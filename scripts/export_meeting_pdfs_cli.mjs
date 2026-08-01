import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const COURSE_BASE_URL = process.env.CPSC481_LOCAL_URL ?? "http://localhost:3056";
const CHROME_PATH = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve("..", "output", "canvas-pdfs");
const MEETINGS = process.argv.includes("--all")
  ? Array.from({ length: 30 }, (_, index) => index + 1)
  : process.argv
    .filter((arg) => /^\d+$/.test(arg))
    .map(Number);

if (!MEETINGS.length) {
  console.error("Usage: node scripts/export_meeting_pdfs_cli.mjs 1 [2 ...] or --all");
  process.exit(1);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function runChrome(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(CHROME_PATH, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`Chrome exited ${code}\n${stdout}\n${stderr}`));
    });
  });
}

async function exportMeeting(meeting) {
  const meetingId = String(meeting).padStart(2, "0");
  const pdfPath = path.join(OUTPUT_DIR, `cpsc481-meeting-${meetingId}.pdf`);
  const profileDir = path.join(OUTPUT_DIR, `.chrome-cli-${meetingId}-${process.pid}`);
  await ensureDir(profileDir);
  await runChrome([
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--no-first-run",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=12000",
    `--user-data-dir=${profileDir}`,
    `--print-to-pdf=${pdfPath}`,
    "--print-to-pdf-no-header",
    `${COURSE_BASE_URL}/meetings/${meetingId}?print=all`,
  ]);
  const stat = await fs.stat(pdfPath);
  console.log(`Meeting ${meetingId}: ${stat.size} bytes -> ${pdfPath}`);
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  for (const meeting of MEETINGS) await exportMeeting(meeting);
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exit(1);
});
