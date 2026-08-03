import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const COURSE_BASE_URL = process.env.CPSC481_LOCAL_URL ?? "http://localhost:3056";
const CHROME_PATH = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve("output", "pdf", "lessons");
const TEMP_ROOT = path.resolve("tmp", "pdfs");
const requested = process.argv
  .filter(arg => /^\d+$/.test(arg))
  .map(Number)
  .filter(lesson => lesson >= 1 && lesson <= 10);
const LESSONS = requested.length ? [...new Set(requested)] : Array.from({ length: 10 }, (_, index) => index + 1);

async function exportLesson(browser, lesson) {
  const lessonId = String(lesson).padStart(2, "0");
  const pdfPath = path.join(OUTPUT_DIR, `cpsc481-lesson-${lessonId}-slides.pdf`);
  await fs.rm(pdfPath, { force: true });
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1600, height: 1200 } });
  const page = await context.newPage();
  await page.goto(`${COURSE_BASE_URL}/lessons/${lessonId}?print=all`, { waitUntil: "networkidle" });
  const slideCount = await page.locator(".print-all-deck .slide").count();
  if (slideCount < 20) throw new Error(`Lesson ${lessonId} print route exposed only ${slideCount} slides`);
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    displayHeaderFooter: false,
    height: "7.5in",
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    path: pdfPath,
    preferCSSPageSize: true,
    printBackground: true,
    width: "10in",
  });
  await context.close();
  const stat = await fs.stat(pdfPath);
  if (stat.size < 100_000) throw new Error(`Lesson ${lessonId} PDF is unexpectedly small: ${stat.size} bytes`);
  console.log(`Lesson ${lessonId}: ${slideCount} pages · ${stat.size} bytes -> ${pdfPath}`);
}

await fs.mkdir(OUTPUT_DIR, { recursive: true });
await fs.mkdir(TEMP_ROOT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
try {
  for (const lesson of LESSONS) await exportLesson(browser, lesson);
} finally {
  await browser.close();
}
