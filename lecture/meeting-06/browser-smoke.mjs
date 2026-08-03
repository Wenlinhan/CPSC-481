import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { installLectureOverlays, startCaption, startVisualTimeline } from "./lecture-overlays.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "../..");
const screenshots = path.join(siteRoot, "output", "playwright", "meeting-06-smoke");
await mkdir(screenshots, { recursive: true });
const script = JSON.parse(await readFile(path.join(here, "lecture-script-aria.json"), "utf8"));
const cuePlan = JSON.parse(await readFile(path.join(here, "visual-cue-plan.json"), "utf8"));
const kineticPlan = JSON.parse(await readFile(path.join(here, "kinetic-cue-plan.json"), "utf8"));
await import("./capture-server.mjs");

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try { if ((await fetch("http://127.0.0.1:4340")).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("Lesson 6 capture server did not start.");
}
async function firstExisting(candidates) {
  for (const candidate of candidates.filter(Boolean)) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch {}
  }
  throw new Error("Chrome or Edge is required.");
}

await waitForServer();
const executablePath = await firstExisting([
  process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Microsoft", "Edge", "Application", "msedge.exe"),
  process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
  process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Microsoft", "Edge", "Application", "msedge.exe"),
]);
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const base = "http://127.0.0.1:4340" + script.route;
const failures = [];
const inventory = [];
const interactionStates = [];

async function openSlide(number) {
  const response = await page.goto(base + "?smoke=" + number + "#slide-" + number, { waitUntil: "networkidle" });
  if (response && !response.ok()) throw new Error("Slide " + number + " returned HTTP " + response.status());
  await page.locator(".progress-meta span").last().waitFor({ state: "visible" });
  const marker = (await page.locator(".progress-meta span").last().textContent())?.trim();
  if (!marker?.startsWith(number + " /")) throw new Error("Expected slide " + number + ", found " + marker);
  await page.waitForTimeout(500);
}

for (const slide of script.slides) {
  await openSlide(slide.number);
  const visibleText = await page.locator(".slide-content").innerText();
  const actions = [];
  for (const [segmentIndex, segment] of slide.segments.entries()) {
    if (segment.action) {
      const locator = page.locator(segment.action.selector).nth(segment.action.index);
      if (!(await locator.count())) {
        failures.push(`Slide ${slide.number} segment ${segmentIndex + 1}: missing action ${segment.action.selector}[${segment.action.index}]`);
        continue;
      }
      await locator.click({ force: true });
      await page.waitForTimeout(400);
      const stateText = (await page.locator(".slide-content").innerText()).replace(/\s+/g, " ").slice(0, 900);
      actions.push({ segment: segmentIndex + 1, label: segment.action.label, stateText });
      interactionStates.push({ slide: slide.number, segment: segmentIndex + 1, label: segment.action.label });
      await page.screenshot({ path: path.join(screenshots, `slide-${String(slide.number).padStart(2,"0")}-action-${String(segmentIndex + 1).padStart(2,"0")}.png`), fullPage: true });
      if (segment.action.selector === ".search-source-image > button" || segment.action.selector.includes("search-source-image > button")) {
        const image = page.locator(".source-image-lightbox > img");
        const bounds = await image.boundingBox();
        if (!bounds || bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > 1920 || bounds.y + bounds.height > 1080) failures.push(`Slide ${slide.number}: enlarged source image is clipped`);
      }
    }
    for (const focus of segment.visualDesign.focuses ?? []) {
      const count = await page.locator(focus.selector).count();
      if (count <= focus.index) failures.push(`Slide ${slide.number}: ${focus.selector} index ${focus.index} only has ${count} matches`);
    }
  }
  inventory.push({ number: slide.number, title: slide.title, visibleText, actions });
  if ([1,4,6,10,11,14,18,19,22,23,25].includes(slide.number)) await page.screenshot({ path: path.join(screenshots, `slide-${String(slide.number).padStart(2,"0")}.png`), fullPage: true });
}

for (const [slideNumber, segmentNumber] of [[1,2],[4,3],[6,7],[10,2],[14,3],[18,2],[19,7],[21,2],[22,6],[23,10],[25,4]]) {
  await openSlide(slideNumber);
  const targetSlide = script.slides[slideNumber - 1];
  for (let priorIndex = 0; priorIndex < segmentNumber; priorIndex += 1) {
    const action = targetSlide.segments[priorIndex].action;
    if (!action) continue;
    await page.locator(action.selector).nth(action.index).click({ force: true });
    await page.waitForTimeout(250);
  }
  await installLectureOverlays(page);
  const visualSegment = cuePlan.slides.find(item => item.number === slideNumber).segments.find(item => item.number === segmentNumber);
  const kineticSegment = kineticPlan.slides.find(item => item.number === slideNumber).segments.find(item => item.number === segmentNumber);
  const candidate = [...visualSegment.cues, ...kineticSegment.cues].find(cue => !cue.automatic);
  const cues = candidate ? [{ ...candidate, atSeconds: .1, durationSeconds: 6, centerHoldSeconds: Math.max(2, candidate.centerHoldSeconds ?? 2) }] : [];
  await startVisualTimeline(page, cues);
  await startCaption(page, targetSlide.segments[segmentNumber - 1].text, 8);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(screenshots, `cue-slide-${String(slideNumber).padStart(2,"0")}-segment-${segmentNumber}.png`), fullPage: true });
}

await browser.close();
await writeFile(path.join(here, "lesson-06-slide-inventory.json"), JSON.stringify({ route: script.route, slides: inventory }, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ status: failures.length ? "failed" : "passed", slidesChecked: script.slides.length, focusSelectorsChecked: script.slides.flatMap(slide => slide.segments.flatMap(segment => segment.visualDesign.focuses ?? [])).length, interactionStatesChecked: interactionStates.length, interactions: ["eleven enlarged figures", "four animation replays", "greedy trace", "admissibility tabs", "A-star reopen trace", "property sorter", "five application analyses"], screenshots, failures }, null, 2));
process.exit(failures.length ? 1 : 0);
