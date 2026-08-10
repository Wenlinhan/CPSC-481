import { spawn, spawnSync } from "node:child_process";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import ffmpegPath from "ffmpeg-static";
import {
  installLectureOverlays as installTimedLectureOverlays,
  startVisualTimeline,
  clearVisualTimeline,
  startCaption as startTimedCaption,
  clearCaption as clearTimedCaption,
} from "./lecture-overlays.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "../..");
const scriptPath = path.join(here, "lecture-script-aria.json");
const cuePlanPath = path.join(here, "visual-cue-plan.json");
const kineticCuePlanPath = path.join(here, "kinetic-cue-plan.json");
const outputRoot = path.join(siteRoot, "output", "lecture", "lesson-11");
const audioDir = path.join(outputRoot, "audio-aria-final");
const captureDir = path.join(siteRoot, "output", "playwright", "lesson-11-lecture");
const finalVideo = path.join(outputRoot, "cpsc-481-lesson-11-video-lecture.mp4");
const pauseSeconds = 0.42;
// Playwright records a short viewport-settling pre-roll before the first
// caption/focus timer begins. Match the narration to that measured pre-roll.
const startupSeconds = 0.82;
// Eighteen visible pointer steps add roughly 355 ms of browser round trips to
// the explicit waits inside humanClick. Keep the audio timeline matched to the
// measured on-video click duration.
const clickSeconds = 1.445;
const transitionSeconds = 0.75;
const navigationSeconds = clickSeconds + transitionSeconds;
const script = JSON.parse(await readFile(scriptPath, "utf8"));
const cuePlan = JSON.parse(await readFile(cuePlanPath, "utf8"));
const kineticCuePlan = JSON.parse(await readFile(kineticCuePlanPath, "utf8"));

function run(command, args, options = {}) {
  const quietArgs = command === ffmpegPath ? ["-loglevel", "error", ...args] : args;
  const result = spawnSync(command, quietArgs, { cwd: siteRoot, stdio: "inherit", ...options });
  if (result.status !== 0) throw new Error(`${command} failed with exit code ${result.status}`);
}

function wavDurationSeconds(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error("Expected a PCM WAV file.");
  }
  let offset = 12;
  let byteRate;
  let dataSize;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (id === "fmt ") byteRate = buffer.readUInt32LE(offset + 16);
    if (id === "data") { dataSize = size; break; }
    offset += 8 + size + (size % 2);
  }
  if (!byteRate || dataSize === undefined) throw new Error("WAV file is missing fmt or data chunks.");
  return dataSize / byteRate;
}

function mediaDurationSeconds(file) {
  const result = spawnSync(ffmpegPath, ["-hide_banner", "-i", file], { cwd: siteRoot, encoding: "utf8", windowsHide: true });
  const match = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) throw new Error(`Unable to measure media duration: ${file}`);
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

async function muxSynchronized(rawVideo, combinedAudio, destination) {
  const rawVideoDuration = mediaDurationSeconds(rawVideo);
  const narrationDuration = wavDurationSeconds(await readFile(combinedAudio));
  const synchronizationRatio = narrationDuration / rawVideoDuration;
  const frameSeconds = 1 / 30;
  const videoFilter = Math.abs(rawVideoDuration - narrationDuration) > frameSeconds
    ? ["-vf", `setpts=${synchronizationRatio.toFixed(12)}*PTS`]
    : [];
  run(ffmpegPath, ["-y", "-i", rawVideo, "-i", combinedAudio, ...videoFilter, "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", destination]);
  return { rawVideoDuration, narrationDuration, synchronizationRatio, retimed: videoFilter.length > 0 };
}

async function waitForServer(url, processHandle, timeoutMs = 90000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (processHandle.exitCode !== null) throw new Error(`Lecture server exited with code ${processHandle.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 600));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function firstExisting(paths) {
  for (const candidate of paths.filter(Boolean)) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch {}
  }
  throw new Error("Chrome or Edge is required for lecture capture.");
}

function browserCandidates() {
  return [
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
    process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe"),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Microsoft", "Edge", "Application", "msedge.exe"),
  ];
}

async function installInstructorCursor(page) {
  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.id = "instructor-cursor";
    Object.assign(cursor.style, {
      position: "fixed", left: "0", top: "0", width: "22px", height: "30px", zIndex: "2147483647",
      pointerEvents: "none", transform: "translate(1780px, 1010px)", transition: "transform 520ms cubic-bezier(.22,.72,.2,1)",
      filter: "drop-shadow(0 2px 3px rgba(0,0,0,.45))"
    });
    const arrow = document.createElement("div");
    Object.assign(arrow.style, {
      width: "0", height: "0", borderTop: "20px solid white", borderRight: "12px solid transparent",
      transform: "rotate(-18deg)", filter: "drop-shadow(0 0 1px #111)"
    });
    cursor.appendChild(arrow);
    document.body.appendChild(cursor);
  });
}

async function installLectureOverlays(page) {
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.id = "lecture-overlay-styles";
    style.textContent = `
      @keyframes lecturePulse { 0%,100% { transform:scale(1); opacity:.92 } 50% { transform:scale(1.035); opacity:1 } }
      @keyframes captionIn { from { transform:translateY(12px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      #lecture-focus-ring { position:fixed; z-index:2147483638; pointer-events:none; border:4px solid #f5b237; border-radius:18px; box-shadow:0 0 0 9999px rgba(5,10,20,.38),0 8px 32px rgba(0,0,0,.42); transition:all 520ms cubic-bezier(.22,.72,.2,1); }
      #lecture-focus-ring.zoom { animation:lecturePulse 2.4s ease-in-out infinite; }
      #lecture-focus-ring.pulse { animation:lecturePulse 1.25s ease-in-out infinite; border-color:#55d6be; }
      #lecture-focus-label { position:absolute; left:12px; top:-42px; background:#f5b237; color:#111827; padding:7px 12px; border-radius:9px; font:700 17px/1.2 system-ui,sans-serif; white-space:nowrap; box-shadow:0 4px 14px rgba(0,0,0,.32); }
      #lecture-caption { position:fixed; left:50%; bottom:84px; transform:translateX(-50%); width:min(1540px,86vw); min-height:58px; z-index:2147483640; pointer-events:none; display:flex; align-items:center; justify-content:center; padding:13px 28px 15px; border-radius:16px; color:white; background:rgba(3,8,18,.89); border:1px solid rgba(255,255,255,.2); box-shadow:0 9px 30px rgba(0,0,0,.42); font:650 31px/1.25 system-ui,sans-serif; text-align:center; letter-spacing:.01em; animation:captionIn 220ms ease-out; }
      #lecture-caption:empty { display:none; }
      #lecture-caption-progress { position:absolute; left:18px; right:18px; bottom:5px; height:3px; border-radius:3px; overflow:hidden; background:rgba(255,255,255,.18); }
      #lecture-caption-progress i { display:block; height:100%; width:0; background:#55d6be; transition:width 120ms linear; }
      .lecture-enlarged { transform:scale(1.035)!important; transform-origin:center!important; transition:transform 520ms cubic-bezier(.22,.72,.2,1)!important; position:relative!important; z-index:2147483639!important; }
    `;
    document.head.appendChild(style);
    const caption = document.createElement("div");
    caption.id = "lecture-caption";
    caption.innerHTML = `<span></span><div id="lecture-caption-progress"><i></i></div>`;
    document.body.appendChild(caption);
  });
}

async function clearFocus(page) {
  await page.evaluate(() => {
    document.getElementById("lecture-focus-ring")?.remove();
    document.querySelectorAll(".lecture-enlarged").forEach(element => element.classList.remove("lecture-enlarged"));
  });
}

async function focusSegment(page, focus, segmentIndex) {
  await clearFocus(page);
  await page.evaluate(({ focus, segmentIndex }) => {
    const candidates = [...document.querySelectorAll(
      ".slide-content article, .slide-content .callout, .slide-content .formula, .slide-content .big-question, .slide-content .quiet, .slide-content .definition-scene > div, .slide-content .practice-sheet > div, .slide-content .assessment-scene, .slide-content .sources-card, .slide-content h3"
    )].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 100 && rect.height > 45 && rect.top < innerHeight - 120;
    });
    const fallback = document.querySelector(".slide-content") ?? document.querySelector(".slide-heading h1");
    const target = candidates.length ? candidates[segmentIndex % candidates.length] : fallback;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const padding = 12;
    const ring = document.createElement("div");
    ring.id = "lecture-focus-ring";
    ring.className = focus?.effect ?? "spotlight";
    Object.assign(ring.style, {
      left: `${Math.max(8, rect.left - padding)}px`,
      top: `${Math.max(52, rect.top - padding)}px`,
      width: `${Math.min(innerWidth - 16, rect.width + padding * 2)}px`,
      height: `${Math.min(innerHeight - Math.max(52, rect.top - padding) - 92, rect.height + padding * 2)}px`,
    });
    const label = document.createElement("div");
    label.id = "lecture-focus-label";
    label.textContent = `Focus: ${focus?.label ?? "Key idea"}`;
    ring.appendChild(label);
    document.body.appendChild(ring);
    if (focus?.effect === "zoom" || focus?.effect === "pulse") target.classList.add("lecture-enlarged");
  }, { focus, segmentIndex });
}

async function startCaption(page, text, durationSeconds) {
  await page.evaluate(({ text, durationSeconds }) => {
    clearInterval(window.__lectureCaptionTimer);
    const words = text.trim().split(/\s+/);
    const chunks = [];
    for (let index = 0; index < words.length; index += 10) chunks.push(words.slice(index, index + 10).join(" "));
    const caption = document.querySelector("#lecture-caption span");
    const progress = document.querySelector("#lecture-caption-progress i");
    if (!caption || !progress || !chunks.length) return;
    const started = performance.now();
    const durationMs = Math.max(500, durationSeconds * 1000);
    const update = () => {
      const fraction = Math.min(1, (performance.now() - started) / durationMs);
      const index = Math.min(chunks.length - 1, Math.floor(fraction * chunks.length));
      caption.textContent = chunks[index];
      progress.style.width = `${fraction * 100}%`;
      if (fraction >= 1) clearInterval(window.__lectureCaptionTimer);
    };
    update();
    window.__lectureCaptionTimer = setInterval(update, 100);
  }, { text, durationSeconds });
}

async function clearCaption(page) {
  await page.evaluate(() => {
    clearInterval(window.__lectureCaptionTimer);
    const caption = document.querySelector("#lecture-caption span");
    if (caption) caption.textContent = "";
  });
}

async function humanClick(page, locator) {
  await locator.waitFor({ state: "visible" });
  const box = await locator.boundingBox();
  if (!box) throw new Error("Clickable target has no bounding box.");
  const x = Math.round(box.x + box.width * 0.5);
  const y = Math.round(box.y + box.height * 0.5);
  await page.evaluate(({ x, y }) => {
    const cursor = document.getElementById("instructor-cursor");
    if (cursor) cursor.style.transform = `translate(${x}px, ${y}px)`;
  }, { x, y });
  await page.mouse.move(x, y, { steps: 18 });
  await page.waitForTimeout(560);
  await page.evaluate(({ x, y }) => {
    const ring = document.createElement("div");
    Object.assign(ring.style, {
      position: "fixed", left: `${x - 9}px`, top: `${y - 9}px`, width: "18px", height: "18px",
      border: "3px solid rgba(245,178,55,.95)", borderRadius: "999px", zIndex: "2147483646",
      pointerEvents: "none", transition: "all 420ms ease-out"
    });
    document.body.appendChild(ring);
    requestAnimationFrame(() => { ring.style.transform = "scale(3.2)"; ring.style.opacity = "0"; });
    setTimeout(() => ring.remove(), 480);
  }, { x, y });
  await page.waitForTimeout(110);
  await locator.evaluate(element => element.click());
  await page.waitForTimeout(420);
}

async function humanSetRange(page, locator, value) {
  await humanClick(page, locator);
  await locator.evaluate((element, nextValue) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(element, String(nextValue));
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
  await page.waitForTimeout(220);
}

await mkdir(audioDir, { recursive: true });
await mkdir(captureDir, { recursive: true });
if (!process.argv.includes("--reuse-narration")) {
  const python = process.env.LECTURE_PYTHON ?? "C:\\Users\\winni\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
  run(python, [path.join(here, "generate-narration-aria.py"), "--script", scriptPath, "--output", audioDir, "--ffmpeg", ffmpegPath]);
}

const audioTimeline = [];
for (const slide of script.slides) {
  const plannedSlide = cuePlan.slides.find(candidate => candidate.number === slide.number);
  const kineticSlide = kineticCuePlan.slides.find(candidate => candidate.number === slide.number);
  if (!plannedSlide) throw new Error(`Missing visual cue plan for slide ${slide.number}`);
  if (!kineticSlide) throw new Error(`Missing kinetic cue plan for slide ${slide.number}`);
  for (let index = 0; index < slide.segments.length; index += 1) {
    const filename = `slide-${String(slide.number).padStart(2, "0")}-segment-${String(index + 1).padStart(2, "0")}.wav`;
    const file = path.join(audioDir, filename);
    const duration = wavDurationSeconds(await readFile(file));
    const wordBoundaries = JSON.parse(await readFile(path.join(audioDir, filename.replace(".wav", ".words.json")), "utf8"));
    const plannedSegment = plannedSlide.segments.find(candidate => candidate.number === index + 1);
    const kineticSegment = kineticSlide.segments.find(candidate => candidate.number === index + 1);
    if (!plannedSegment) throw new Error(`Missing visual cue plan for slide ${slide.number}, segment ${index + 1}`);
    if (!kineticSegment) throw new Error(`Missing kinetic cue plan for slide ${slide.number}, segment ${index + 1}`);
    if (Math.abs(duration - plannedSegment.durationSeconds) > 0.03) {
      throw new Error(`Cue timing drift on slide ${slide.number}, segment ${index + 1}: WAV=${duration}, plan=${plannedSegment.durationSeconds}`);
    }
    const visualCues = [...plannedSegment.cues, ...kineticSegment.cues].sort((a, b) => a.atSeconds - b.atSeconds);
    audioTimeline.push({ slide: slide.number, segment: index + 1, file, duration, action: slide.segments[index].action, visualCues, text: slide.segments[index].text, wordBoundaries, pauseAfterSeconds: slide.segments[index].pauseAfterSeconds ?? 0 });
  }
}

const silenceFile = path.join(audioDir, "pause.wav");
run(ffmpegPath, ["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(pauseSeconds), "-c:a", "pcm_s16le", silenceFile]);
const startupSilenceFile = path.join(audioDir, "startup-pause.wav");
run(ffmpegPath, ["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(startupSeconds), "-c:a", "pcm_s16le", startupSilenceFile]);
const clickSilenceFile = path.join(audioDir, "click-pause.wav");
run(ffmpegPath, ["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(clickSeconds), "-c:a", "pcm_s16le", clickSilenceFile]);
const navigationSilenceFile = path.join(audioDir, "navigation-pause.wav");
run(ffmpegPath, ["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(navigationSeconds), "-c:a", "pcm_s16le", navigationSilenceFile]);
const reflectionPauses = new Map();
for (const seconds of [...new Set(audioTimeline.map(item => item.pauseAfterSeconds).filter(Boolean))]) {
  const file = path.join(audioDir, `reflection-pause-${String(seconds).replace(".", "-")}.wav`);
  run(ffmpegPath, ["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(seconds), "-c:a", "pcm_s16le", file]);
  reflectionPauses.set(seconds, file);
}
const concatFile = path.join(audioDir, "concat.txt");
const ffconcatPath = file => file.replaceAll("\\", "/").replaceAll("'", "'\\''");
const concatLines = [`file '${ffconcatPath(startupSilenceFile)}'`];
for (const [timelineIndex, item] of audioTimeline.entries()) {
  if (item.action) concatLines.push(`file '${ffconcatPath(clickSilenceFile)}'`);
  concatLines.push(`file '${ffconcatPath(item.file)}'`, `file '${ffconcatPath(silenceFile)}'`);
  if (item.pauseAfterSeconds) concatLines.push(`file '${ffconcatPath(reflectionPauses.get(item.pauseAfterSeconds))}'`);
  const nextItem = audioTimeline[timelineIndex + 1];
  const isSlideEnd = !nextItem || nextItem.slide !== item.slide;
  if (isSlideEnd && item.slide < script.slides.length) concatLines.push(`file '${ffconcatPath(navigationSilenceFile)}'`);
}
await writeFile(concatFile, `${concatLines.join("\n")}\n`, "utf8");
const combinedAudio = path.join(outputRoot, "lesson-11-narration.wav");
run(ffmpegPath, ["-y", "-f", "concat", "-safe", "0", "-i", concatFile, "-c:a", "pcm_s16le", combinedAudio]);

if (process.argv.includes("--remux-only")) {
  const rawVideo = path.join(captureDir, "lesson-11-live-deck.webm");
  const synchronization = await muxSynchronized(rawVideo, combinedAudio, finalVideo);
  const manifest = {
    lesson: script.lesson, route: script.route, title: script.title, slideCount: script.slides.length,
    voice: script.voice, resolution: "1920x1080", finalVideo, narration: combinedAudio,
    generatedAt: new Date().toISOString(), remuxedFromExistingCapture: true, synchronization,
  };
  await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\nFinal lecture: ${finalVideo}`);
  process.exit(0);
}

const port = 4340;
const baseUrl = `http://127.0.0.1:${port}`;
const captureServer = path.join(here, "capture-server.mjs");
const server = spawn(process.execPath, [captureServer, "--port", String(port)], {
  cwd: siteRoot,
  shell: false,
  windowsHide: true,
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", chunk => process.stdout.write(`[site] ${chunk}`));
server.stderr.on("data", chunk => process.stderr.write(`[site] ${chunk}`));

let browser;
try {
  await waitForServer(baseUrl, server);
  const executablePath = await firstExisting(browserCandidates());
  browser = await chromium.launch({ headless: true, executablePath, args: ["--autoplay-policy=no-user-gesture-required"] });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1,
    recordVideo: { dir: captureDir, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  await page.goto(baseUrl + script.route + "#slide-1", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => [...document.images].every(image => image.complete));
  await installInstructorCursor(page);
  await installTimedLectureOverlays(page);
  const video = page.video();

  for (const slide of script.slides) {
    console.log(`[capture] Slide ${slide.number}/${script.slides.length}: ${slide.title}`);
    const current = page.locator(".progress-meta span").last();
    await current.waitFor({ state: "visible" });
    const marker = await current.textContent();
    if (!marker?.startsWith(`${slide.number} /`)) throw new Error(`Expected slide ${slide.number}, found ${marker}`);
    for (let index = 0; index < slide.segments.length; index += 1) {
      const item = audioTimeline.find(entry => entry.slide === slide.number && entry.segment === index + 1);
      if (!item) throw new Error(`Missing audio timing for slide ${slide.number}, segment ${index + 1}`);
      if (item.action?.type === "click") await humanClick(page, page.locator(item.action.selector).nth(item.action.index));
      if (item.action?.type === "range") await humanSetRange(page, page.locator(item.action.selector).nth(item.action.index), item.action.value);
      await startVisualTimeline(page, item.visualCues);
      await startTimedCaption(page, item.text, item.duration, item.wordBoundaries);
      await page.waitForTimeout(Math.round((item.duration + pauseSeconds + item.pauseAfterSeconds) * 1000));
    }
    if (slide.number < script.slides.length) {
      await clearTimedCaption(page);
      await clearVisualTimeline(page);
      await humanClick(page, page.locator(".deck-footer > button").last());
      await page.waitForTimeout(Math.round(transitionSeconds * 1000));
    }
  }

  await context.close();
  const recordedPath = await video.path();
  const rawVideo = path.join(captureDir, "lesson-11-live-deck.webm");
  await copyFile(recordedPath, rawVideo);
  await browser.close();
  browser = undefined;
  const synchronization = await muxSynchronized(rawVideo, combinedAudio, finalVideo);
  const manifest = {
    lesson: script.lesson, route: script.route, title: script.title, slideCount: script.slides.length,
    voice: script.voice, resolution: "1920x1080", finalVideo, narration: combinedAudio,
    generatedAt: new Date().toISOString(), captions: "burned-in bottom captions",
    synchronization,
    cuePlanVersion: cuePlan.version,
    cueCount: cuePlan.slides.flatMap(slide => slide.segments).reduce((total, segment) => total + segment.cues.length, 0),
    kineticCuePlanVersion: kineticCuePlan.version,
    kineticCueCount: kineticCuePlan.slides.flatMap(slide => slide.segments).reduce((total, segment) => total + segment.cues.length, 0),
    maximumStillSeconds: kineticCuePlan.timing.maximumStillSeconds,
    minimumCenterHoldSeconds: kineticCuePlan.timing.minimumCenterHoldSeconds,
    minimumPopupHoldSeconds: cuePlan.timing.minimumPopupHoldSeconds,
    popupPolicy: "Important terms and objects absent from the current slide only",
    effects: ["instructor cursor", "click rings", "phrase-timed focus", "gentle zoom", "large center-held concept visuals", "two-second minimum stationary holds", "answer-anchored correctness marks", "camera breathing"],
  };
  await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\nFinal lecture: ${finalVideo}`);
} finally {
  if (browser) await browser.close().catch(() => {});
  if (!server.killed) server.kill();
}
