import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { installLectureOverlays, startCaption, startVisualTimeline } from "./lecture-overlays.mjs";

const here=path.dirname(fileURLToPath(import.meta.url));
const siteRoot=path.resolve(here,"../..");
const screenshots=path.join(siteRoot,"output","playwright","lesson-11-smoke");
await mkdir(screenshots,{recursive:true});
const script=JSON.parse(await readFile(path.join(here,"lecture-script-aria.json"),"utf8"));
const cuePlan=JSON.parse(await readFile(path.join(here,"visual-cue-plan.json"),"utf8"));
const kineticPlan=JSON.parse(await readFile(path.join(here,"kinetic-cue-plan.json"),"utf8"));
await import("./capture-server.mjs");

async function waitForServer(){for(let i=0;i<120;i++){try{if((await fetch("http://127.0.0.1:4340")).ok)return;}catch{}await new Promise(r=>setTimeout(r,250));}throw new Error("Lesson 11 capture server did not start.");}
async function firstExisting(candidates){for(const candidate of candidates.filter(Boolean)){try{if((await stat(candidate)).isFile())return candidate;}catch{}}throw new Error("Chrome or Edge is required.");}
await waitForServer();
const executablePath=await firstExisting([
  process.env.PROGRAMFILES&&path.join(process.env.PROGRAMFILES,"Microsoft","Edge","Application","msedge.exe"),
  process.env.PROGRAMFILES&&path.join(process.env.PROGRAMFILES,"Google","Chrome","Application","chrome.exe"),
  process.env["PROGRAMFILES(X86)"]&&path.join(process.env["PROGRAMFILES(X86)"],"Microsoft","Edge","Application","msedge.exe"),
]);
const browser=await chromium.launch({headless:true,executablePath});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
const base="http://127.0.0.1:4340"+script.route;
const failures=[]; const inventory=[]; const interactionStates=[];
async function openSlide(number){const response=await page.goto(base+"?smoke="+number+"#slide-"+number,{waitUntil:"networkidle"});if(response&&!response.ok())throw new Error(`Slide ${number} returned HTTP ${response.status()}`);await page.evaluate(()=>window.scrollTo(0,0));await page.locator(".progress-meta span").last().waitFor({state:"visible"});const marker=(await page.locator(".progress-meta span").last().textContent())?.trim();if(!marker?.startsWith(number+" /"))throw new Error(`Expected slide ${number}, found ${marker}`);await page.waitForTimeout(400);}

for(const slide of script.slides){
  await openSlide(slide.number); const visibleText=await page.locator(".slide-content").innerText(); const actions=[];
  for(const [segmentIndex,segment] of slide.segments.entries()){
    if(segment.action){const locator=page.locator(segment.action.selector).nth(segment.action.index);if(!(await locator.count())){failures.push(`Slide ${slide.number} segment ${segmentIndex+1}: missing action ${segment.action.selector}[${segment.action.index}]`);continue;}await locator.evaluate(element=>element.click());await page.waitForTimeout(350);const stateText=(await page.locator(".slide-content").innerText()).replace(/\s+/g," ").slice(0,1000);actions.push({segment:segmentIndex+1,label:segment.action.label,stateText});interactionStates.push({slide:slide.number,segment:segmentIndex+1,label:segment.action.label});await page.screenshot({path:path.join(screenshots,`slide-${String(slide.number).padStart(2,"0")}-action-${String(segmentIndex+1).padStart(2,"0")}.png`),fullPage:true});if(segment.action.selector.includes("search-source-image > button")){const image=page.locator(".source-image-lightbox > img");const bounds=await image.boundingBox();if(!bounds||bounds.x<0||bounds.y<0||bounds.x+bounds.width>1920||bounds.y+bounds.height>1080)failures.push(`Slide ${slide.number}: enlarged source image is clipped`);}}
    for(const focus of segment.visualDesign.focuses??[]){const count=await page.locator(focus.selector).count();if(count<=focus.index)failures.push(`Slide ${slide.number}: ${focus.selector} index ${focus.index} only has ${count} matches`);}
  }
  inventory.push({number:slide.number,title:slide.title,visibleText,actions});
  if([1,4,6,7,9,13,18,19,20,23,24,25].includes(slide.number))await page.screenshot({path:path.join(screenshots,`slide-${String(slide.number).padStart(2,"0")}.png`),fullPage:true});
}

for(const [slideNumber,segmentNumber] of [[1,2],[6,4],[10,2],[12,12],[14,8],[17,2],[20,10],[21,8],[24,8],[25,2]]){
  await openSlide(slideNumber);const target=script.slides[slideNumber-1];
  for(let prior=0;prior<segmentNumber;prior++){const action=target.segments[prior].action;if(action){await page.locator(action.selector).nth(action.index).evaluate(element=>element.click());await page.waitForTimeout(220);}}
  await installLectureOverlays(page);
  const visual=cuePlan.slides.find(x=>x.number===slideNumber).segments.find(x=>x.number===segmentNumber);
  const kinetic=kineticPlan.slides.find(x=>x.number===slideNumber).segments.find(x=>x.number===segmentNumber);
  const candidate=[...visual.cues,...kinetic.cues].find(cue=>!cue.automatic);
  const cues=candidate?[{...candidate,atSeconds:.1,durationSeconds:6,centerHoldSeconds:Math.max(2,candidate.centerHoldSeconds??2)}]:[];
  await startVisualTimeline(page,cues);await startCaption(page,target.segments[segmentNumber-1].text,8);await page.waitForTimeout(2500);
  await page.screenshot({path:path.join(screenshots,`cue-slide-${String(slideNumber).padStart(2,"0")}-segment-${segmentNumber}.png`),fullPage:true});
}
await browser.close();
await writeFile(path.join(here,"lesson-11-slide-inventory.json"),JSON.stringify({route:script.route,slides:inventory},null,2)+"\n","utf8");
console.log(JSON.stringify({status:failures.length?"failed":"passed",slidesChecked:script.slides.length,focusSelectorsChecked:script.slides.flatMap(s=>s.segments.flatMap(x=>x.visualDesign.focuses??[])).length,interactionStatesChecked:interactionStates.length,interactions:["all event query tabs and answer reveals","both normalization outcomes","all five coin-lab questions","all traffic, chain-rule, rare-disease, weather, and dealer steps"],screenshots,failures},null,2));
process.exit(failures.length?1:0);
