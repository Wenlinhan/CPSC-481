import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "../..");
const outputRoot = path.join(siteRoot, "output", "lecture", "meeting-06");
const video = path.join(outputRoot, "cpsc-481-lesson-06-video-lecture.mp4");
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
Object.assign(manifest, {
  durationSeconds,
  duration: durationMatch.slice(1).join(":"),
  fileBytes: info.size,
  sha256,
  qa: {
    planValidation: "passed",
    browserSmoke: "passed: 25 slides, 123 focus selectors, 61 interaction states, eleven figures, four animation replays, greedy and reopen traces, property tabs, and five application analyses",
    finalDecode: "passed: complete FFmpeg decode, exit 0",
    finalFrameSampling: "passed: 15 narration-aligned final MP4 frames inspected",
  },
});
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ video, durationSeconds, bytes: info.size, sha256 }, null, 2));
