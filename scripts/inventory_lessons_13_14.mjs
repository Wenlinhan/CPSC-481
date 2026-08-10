import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.env.CPSC481_LOCAL_URL ?? "http://127.0.0.1:3058";
const chrome = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath: chrome, headless: true });
try {
  for (const lesson of [13, 14]) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    const slides = [];
    for (let number = 1; number <= 25; number += 1) {
      await page.goto(`${base}/lessons/${lesson}?inventory=${number}#slide-${number}`, { waitUntil: "networkidle" });
      await page.locator(".progress-meta span").last().waitFor({ state: "visible" });
      const title = (await page.locator(".slide-heading h1").innerText()).trim();
      const text = (await page.locator(".slide-content").innerText()).replace(/\s+/g, " ").trim();
      const buttons = await page.locator(".slide-content button").evaluateAll(nodes => nodes.map((node, index) => ({
        index,
        text: node.textContent?.replace(/\s+/g, " ").trim() ?? "",
        ariaLabel: node.getAttribute("aria-label"),
        className: node.className,
      })));
      slides.push({ number, title, text, buttons });
    }
    await page.close();
    const packageName = lesson === 13 ? "lesson-13-mdp" : "lesson-14-rl";
    const output = path.resolve("lecture", packageName, `lesson-${lesson}-slide-inventory.json`);
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, `${JSON.stringify({ route: `/lessons/${lesson}`, slides }, null, 2)}\n`, "utf8");
    console.log(`Lesson ${lesson}: wrote ${slides.length} slides to ${output}`);
  }
} finally {
  await browser.close();
}
