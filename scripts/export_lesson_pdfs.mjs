import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const COURSE_BASE_URL = process.env.CPSC481_LOCAL_URL ?? "http://localhost:3056";
const CHROME_PATH = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PYTHON_PATH = process.env.PYTHON_PATH ?? "C:\\Users\\winni\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const OUTPUT_DIR = path.resolve("output", "pdf", "lessons");
const TEMP_ROOT = path.resolve("tmp", "pdfs");
const requested = process.argv
  .filter(arg => /^\d+$/.test(arg))
  .map(Number)
  .filter(lesson => lesson >= 1 && lesson <= 22);
const LESSONS = requested.length ? [...new Set(requested)] : Array.from({ length: 22 }, (_, index) => index + 1);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", chunk => { stderr += chunk; });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}: ${stderr}`)));
  });
}

async function exportLesson(browser, lesson) {
  const lessonId = String(lesson).padStart(2, "0");
  const pdfPath = path.join(OUTPUT_DIR, `cpsc481-lesson-${lessonId}-slides.pdf`);
  const tempDir = path.join(TEMP_ROOT, `lesson-${lessonId}`);
  await fs.rm(pdfPath, { force: true });
  await fs.rm(tempDir, { force: true, recursive: true });
  await fs.mkdir(tempDir, { recursive: true });

  const context = await browser.newContext({ javaScriptEnabled: true, viewport: { width: 1600, height: 1200 } });
  const page = await context.newPage();
  await page.goto(`${COURSE_BASE_URL}/lessons/${lessonId}?print=all`, { waitUntil: "networkidle" });
  const slideCount = await page.locator(".print-all-deck .slide").count();
  if (slideCount < 20) throw new Error(`Lesson ${lessonId} print route exposed only ${slideCount} slides`);

  const pagePdfs = [];
  for (let slide = 1; slide <= slideCount; slide += 1) {
    await page.goto(`${COURSE_BASE_URL}/lessons/${lessonId}?pdf=${slide}#slide-${slide}`, { waitUntil: "networkidle" });
    await page.locator(".deck-footer").waitFor({ state: "attached" });
    await page.waitForFunction(
      expected => document.querySelector(".progress-meta span:last-child")?.textContent?.trim().startsWith(`${expected} /`),
      slide,
    );
    const pagePdf = path.join(tempDir, `slide-${String(slide).padStart(2, "0")}.pdf`);
    await page.pdf({
      displayHeaderFooter: false,
      height: "7.5in",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      pageRanges: "1",
      path: pagePdf,
      printBackground: true,
      width: "10in",
    });
    pagePdfs.push(pagePdf);
  }
  await context.close();

  await run(PYTHON_PATH, [path.resolve("scripts", "merge_pdfs.py"), ...pagePdfs, "--output", pdfPath]);
  await fs.rm(tempDir, { force: true, recursive: true });
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
