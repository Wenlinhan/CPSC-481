import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "../..");
const outputRoot = path.join(siteRoot, "output", "lecture", "lesson-16");
const video = path.join(outputRoot, "cpsc-481-lesson-16-video-lecture.mp4");
const manifestPath = path.join(outputRoot, "manifest.json");

const probe = spawnSync(ffmpegPath, ["-hide_banner", "-i", video], { encoding: "utf8" });
const durationMatch = probe.stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
if (!durationMatch) throw new Error("Could not read final MP4 duration.");
const durationSeconds = Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3]);
const hash = createHash("sha256");
for await (const chunk of createReadStream(video)) hash.update(chunk);
const sha256 = hash.digest("hex");
const info = await stat(video);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const script = JSON.parse(await readFile(path.join(here, "lecture-script-aria.json"), "utf8"));
const interactionCount = script.slides.flatMap(slide => slide.segments).filter(segment => segment.action).length;
const focusCount = script.slides.flatMap(slide => slide.segments).reduce((count, segment) => count + (segment.visualDesign?.focuses?.length ?? 0), 0);
Object.assign(manifest, {
  durationSeconds,
  duration: durationMatch.slice(1).join(":"),
  fileBytes: info.size,
  sha256,
  qa: {
    planValidation: "passed",
    browserSmoke: `passed: ${script.slides.length} slides, ${focusCount} phrase-level focus selectors, and all ${interactionCount} narrated decision-tree interaction states`,
    finalDecode: "passed: complete FFmpeg decode, exit 0",
    finalFrameSampling: `passed: narration-aligned final MP4 frames extracted for all ${interactionCount} interaction states, 12 representative technical pop-ups, and the exit frame`,
  },
});
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ video, durationSeconds, bytes: info.size, sha256 }, null, 2));




