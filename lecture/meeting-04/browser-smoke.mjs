import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { installLectureOverlays, startCaption, startVisualTimeline } from "./lecture-overlays.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "../..");
const screenshots = path.join(siteRoot, "output", "playwright", "meeting-04-smoke");
await mkdir(screenshots, { recursive: true });
const script = JSON.parse(await readFile(path.join(here, "lecture-script-aria.json"), "utf8"));
const cuePlan = JSON.parse(await readFile(path.join(here, "visual-cue-plan.json"), "utf8"));
const kineticPlan = JSON.parse(await readFile(path.join(here, "kinetic-cue-plan.json"), "utf8"));
const port = 4340;
await import("./capture-server.mjs");

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try { if ((await fetch("http://127.0.0.1:" + port)).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("Meeting 4 capture server did not start.");
}
async function firstExisting(candidates) {
  for (const candidate of candidates.filter(Boolean)) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch {}
  }
  throw new Error("Chrome or Edge is required.");
}

await waitForServer();
const executablePath = await firstExisting([
  process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
  process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe"),
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
  process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Microsoft", "Edge", "Application", "msedge.exe"),
]);
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const base = "http://127.0.0.1:" + port + script.route;
const failures = [];
const inventory = [];

async function openSlide(number) {
  const response = await page.goto(base + "?smoke=" + number + "#slide-" + number, { waitUntil: "networkidle" });
  if (response && !response.ok()) throw new Error("Slide " + number + " returned HTTP " + response.status());
  await page.locator(".progress-meta span").last().waitFor({ state: "visible" });
  const marker = (await page.locator(".progress-meta span").last().textContent())?.trim();
  if (!marker?.startsWith(number + " /")) throw new Error("Expected slide " + number + ", found " + marker);
  await page.waitForTimeout(850);
}

for (const slide of script.slides) {
  await openSlide(slide.number);
  for (const segment of slide.segments) {
    const design = segment.visualDesign;
    const count = await page.locator(design.focusSelector).count();
    if (count <= design.focusIndex) failures.push("Slide " + slide.number + ": " + design.focusSelector + " index " + design.focusIndex + " only has " + count + " matches");
  }
  const visibleText = await page.locator(".slide-content").innerText();
  const focusTargets = await page.locator(".slide-content article, .slide-content section, .slide-content li, .slide-content h3, .slide-content .search-callout, .slide-content .search-source-image").evaluateAll(elements => elements.map((element, index) => ({
    index,
    tag: element.tagName.toLowerCase(),
    className: element.className,
    text: element.textContent?.replace(/\s+/g, " ").trim().slice(0, 240),
  })).filter(item => item.text));
  inventory.push({
    number: slide.number,
    title: slide.title,
    visibleText,
    focusTargets,
    actions: slide.segments.flatMap((segment, segmentIndex) => segment.action ? [{ segment: segmentIndex + 1, ...segment.action }] : []),
  });
  if ([1, 6, 8, 12, 15, 18, 23, 26, 28].includes(slide.number)) {
    await page.screenshot({ path: path.join(screenshots, "slide-" + String(slide.number).padStart(2, "0") + ".png"), fullPage: true });
  }
}

for (const slideNumber of [6, 10, 13, 21]) {
  await openSlide(slideNumber);
  const imageSelector = slideNumber === 13 ? ".puzzle-source-layout .search-source-image button" : ".algorithm-figure button";
  await page.locator(imageSelector).click();
  if (!(await page.locator(".source-image-lightbox").isVisible())) failures.push("Slide " + slideNumber + " source figure did not enlarge.");
  const enlargedImage = page.locator(".source-image-lightbox > img");
  const bounds = await enlargedImage.boundingBox();
  if (!bounds || bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > 1920 || bounds.y + bounds.height > 1080) {
    failures.push("Slide " + slideNumber + " enlarged source figure is clipped outside the 1920x1080 frame.");
  }
  await page.screenshot({ path: path.join(screenshots, "slide-" + String(slideNumber).padStart(2, "0") + "-enlarged.png"), fullPage: true });
  await page.locator(".source-image-close").click();
}

for (const slideNumber of [8, 12]) {
  await openSlide(slideNumber);
  for (let step = 0; step < 3; step += 1) await page.locator(".frontier-trace button").nth(1).click();
  const iteration = await page.locator(".frontier-trace h3").textContent();
  if (!iteration?.includes("4")) failures.push("Slide " + slideNumber + " frontier trace did not advance to iteration 4.");
}

await openSlide(15);
await page.locator(".algorithm-selection section > button").click();
if (!(await page.locator(".algorithm-selection .search-callout").isVisible())) failures.push("Algorithm selection analysis did not reveal.");
for (const index of [1, 2, 3]) await page.locator(".algorithm-selection nav button").nth(index).click();

await openSlide(18);
for (let step = 0; step < 3; step += 1) await page.locator(".search-reveal button").nth(0).click();
await page.locator(".search-reveal button").nth(1).click();
if ((await page.locator(".search-reveal li.visible").count()) !== 5) failures.push("UCS reveal sequence did not show all five steps.");

await openSlide(23);
await page.locator(".backtracking-trace input").evaluate(element => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(element, "8");
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
});
if (!((await page.locator(".backtracking-trace h3").textContent())?.includes("8"))) failures.push("Backtracking slider did not reach iteration 8.");

await openSlide(26);
for (const index of [1, 2, 0]) await page.locator(".search-review-studio nav button").nth(index).click();

for (const [slideNumber, segmentNumber] of [[1,2],[8,2],[15,1],[18,2],[23,2],[28,4]]) {
  await openSlide(slideNumber);
  await installLectureOverlays(page);
  const visualSegment = cuePlan.slides.find(item => item.number === slideNumber).segments.find(item => item.number === segmentNumber);
  const kineticSegment = kineticPlan.slides.find(item => item.number === slideNumber).segments.find(item => item.number === segmentNumber);
  const candidate = [...visualSegment.cues, ...kineticSegment.cues].find(cue => !cue.automatic);
  const cues = candidate ? [{ ...candidate, atSeconds: 0.1, durationSeconds: 6, centerHoldSeconds: Math.max(2, candidate.centerHoldSeconds ?? 2) }] : [];
  await startVisualTimeline(page, cues);
  await startCaption(page, script.slides[slideNumber - 1].segments[segmentNumber - 1].text, 8);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(screenshots, "cue-slide-" + String(slideNumber).padStart(2, "0") + "-segment-" + segmentNumber + ".png"), fullPage: true });
}

// Rehearse the five page-2 strategy focuses against the exact neural word boundaries.
await openSlide(2);
await installLectureOverlays(page);
const strategySegment = cuePlan.slides.find(item => item.number === 2).segments.find(item => item.number === 1);
const strategyWords = JSON.parse(await readFile(path.join(siteRoot, "output", "lecture", "meeting-04", "audio-aria-final", "slide-02-segment-01.words.json"), "utf8"));
await startVisualTimeline(page, strategySegment.cues);
await startCaption(page, script.slides[1].segments[0].text, strategySegment.durationSeconds, strategyWords);
let rehearsalClock = 0;
for (const cue of strategySegment.cues.filter(item => item.type === "focus")) {
  const targetClock = cue.atSeconds + Math.min(0.7, cue.durationSeconds * 0.35);
  await page.waitForTimeout(Math.max(0, targetClock - rehearsalClock) * 1000);
  rehearsalClock = targetClock;
  await page.screenshot({ path: path.join(screenshots, `alignment-slide-02-${String(cue.index + 1).padStart(2, "0")}-${cue.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`), fullPage: true });
}

await browser.close();
await writeFile(path.join(here, "lesson-04-slide-inventory.json"), JSON.stringify({ route: script.route, slides: inventory }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ status: failures.length ? "failed" : "passed", slidesChecked: script.slides.length, focusSelectorsChecked: script.slides.flatMap(slide => slide.segments).length, interactions: ["four figure enlargements", "DFS and BFS traces", "algorithm-selection lab", "UCS reveal", "backtracking slider", "review tabs"], screenshots, failures }, null, 2));
process.exit(failures.length ? 1 : 0);
