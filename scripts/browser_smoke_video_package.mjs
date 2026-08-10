import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const [packagePath, portValue] = process.argv.slice(2);
if (!packagePath || !portValue) throw new Error("Usage: browser_smoke_video_package.mjs PACKAGE_DIR PORT");
const packageRoot = path.resolve(packagePath);
const port = Number(portValue);
const siteRoot = path.resolve(packageRoot, "../..");
const script = JSON.parse(await fs.readFile(path.join(packageRoot, "lecture-script-aria.json"), "utf8"));
let cuePlan = null;
try { cuePlan = JSON.parse(await fs.readFile(path.join(packageRoot, "visual-cue-plan.json"), "utf8")); } catch {}
const screenshots = path.join(siteRoot, "output", "playwright", `lesson-${script.lesson}-smoke`);
await fs.mkdir(screenshots, { recursive: true });

const oldArgv = process.argv;
process.argv = [...process.argv.slice(0, 2), "--port", String(port)];
await import(`${pathToFileURL(path.join(packageRoot, "capture-server.mjs")).href}?smoke=${Date.now()}`);
process.argv = oldArgv;
for (let attempt = 0; attempt < 120; attempt += 1) {
  try { if ((await fetch(`http://127.0.0.1:${port}`)).ok) break; } catch {}
  await new Promise(resolve => setTimeout(resolve, 250));
}

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const failures = [];
let actionsChecked = 0;
try {
  for (const slide of script.slides) {
    await page.goto(`http://127.0.0.1:${port}${script.route}?smoke=${slide.number}-${Date.now()}#slide-${slide.number}`, { waitUntil: "networkidle" });
    const marker = (await page.locator(".progress-meta span").last().textContent())?.trim();
    if (!marker?.startsWith(`${slide.number} /`)) failures.push(`Slide ${slide.number}: expected route marker, found ${marker}`);
    for (const item of slide.segments) {
      for (const focus of item.visualDesign.focuses ?? []) {
        const count = await page.locator(focus.selector).count();
        if (count <= focus.index) failures.push(`Slide ${slide.number}: ${focus.selector}[${focus.index}] has ${count} matches`);
      }
      if (item.action) {
        const locator = page.locator(item.action.selector).nth(item.action.index);
        if (!(await locator.count())) failures.push(`Slide ${slide.number}: missing action ${item.action.label}`);
        else {
          try { await locator.evaluate(element => element.click()); await page.waitForTimeout(180); actionsChecked += 1; }
          catch (error) { failures.push(`Slide ${slide.number}: action ${item.action.label} failed: ${error.message}`); }
        }
      }
    }
    const plan = cuePlan?.slides.find(candidate => candidate.number === slide.number);
    if (cuePlan && (!plan || plan.segments.length !== slide.segments.length)) failures.push(`Slide ${slide.number}: cue-plan segment mismatch`);
    if ([1, 5, 10, 15, 20, 25].includes(slide.number)) {
      await page.screenshot({ path: path.join(screenshots, `slide-${String(slide.number).padStart(2, "0")}.png`), fullPage: true });
    }
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify({ status: failures.length ? "failed" : "passed", lesson: script.lesson, slidesChecked: script.slides.length, actionsChecked, screenshots, failures }, null, 2));
process.exit(failures.length ? 1 : 0);
