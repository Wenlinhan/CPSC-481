import { spawn } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const siteRoot = process.cwd();
const packageName = process.argv[2];
if (!packageName) throw new Error("Usage: node scripts/validate_lecture_actions.mjs <lecture-package-directory>");
const packageDir = path.resolve(siteRoot, "lecture", packageName);
const script = JSON.parse(await readFile(path.join(packageDir, "lecture-script-aria.json"), "utf8"));
const port = Number(process.argv[3] ?? 4342);
const baseUrl = `http://127.0.0.1:${port}`;

async function firstExisting(candidates) {
  for (const candidate of candidates.filter(Boolean)) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch {}
  }
  throw new Error("Chrome or Edge is required for action validation.");
}

const browserPath = await firstExisting([
  process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
  process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe"),
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
  process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Microsoft", "Edge", "Application", "msedge.exe"),
]);

const server = spawn(process.execPath, [path.join(packageDir, "capture-server.mjs"), "--port", String(port)], {
  cwd: siteRoot,
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Capture server exited with ${server.exitCode}`);
    try { if ((await fetch(baseUrl)).ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 400));
  }
  browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const failures = [];
  let actionCount = 0;
  for (const slide of script.slides) {
    const actions = slide.segments.map(segment => segment.action).filter(Boolean);
    if (!actions.length) continue;
    await page.goto(`${baseUrl}${script.route}?action-qa=${slide.number}#slide-${slide.number}`, { waitUntil: "networkidle" });
    await page.locator(".slide-content").waitFor({ state: "visible" });
    const signatures = [];
    for (const action of actions) {
      const candidates = page.locator(action.selector);
      const candidateCount = await candidates.count();
      if (candidateCount <= action.index) {
        const labels = await candidates.evaluateAll(elements => elements.map(element => element.textContent?.trim() ?? ""));
        throw new Error(`Lesson ${script.lesson}, slide ${slide.number}, action ${action.label}: initial index ${action.index} but targets are ${JSON.stringify(labels)}`);
      }
      signatures.push(await candidates.nth(action.index).evaluate(element => ({
        text: element.textContent?.trim() ?? "",
        aria: element.getAttribute("aria-label") ?? "",
        value: "value" in element ? String(element.value) : "",
      })));
    }
    for (const [actionIndex, action] of actions.entries()) {
      actionCount += 1;
      const candidates = page.locator(action.selector);
      const signature = signatures[actionIndex];
      const resolvedIndex = await candidates.evaluateAll((elements, expected) => elements.findIndex(element =>
        (element.textContent?.trim() ?? "") === expected.text
        && (element.getAttribute("aria-label") ?? "") === expected.aria
        && (!("value" in element) || String(element.value) === expected.value)
      ), signature);
      if (resolvedIndex < 0) throw new Error(`Lesson ${script.lesson}, slide ${slide.number}, action ${action.label}: stable target disappeared`);
      const target = candidates.nth(resolvedIndex);
      const wasSelected = await target.evaluate(element =>
        element.getAttribute("aria-pressed") === "true"
        || element.getAttribute("aria-selected") === "true"
        || /(^|\s)(active|selected)(\s|$)/i.test(element.className)
      );
      const before = await page.locator("body").innerHTML();
      if (action.type === "range") {
        await target.evaluate((element, value) => {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
          setter?.call(element, String(value));
          element.dispatchEvent(new Event("input", { bubbles: true }));
          element.dispatchEvent(new Event("change", { bubbles: true }));
        }, action.value);
      } else {
        await target.evaluate(element => element.click());
      }
      await page.waitForTimeout(120);
      const after = await page.locator("body").innerHTML();
      if (before === after && actionIndex !== 0 && action.label !== "Previous" && !wasSelected) failures.push({ slide: slide.number, label: action.label });
    }
  }
  if (failures.length) throw new Error(`Actions produced no visible state change: ${JSON.stringify(failures)}`);
  console.log(JSON.stringify({ lesson: script.lesson, slideCount: script.slides.length, actionCount, failures: 0 }, null, 2));
} finally {
  await browser?.close().catch(() => {});
  server.kill();
}
