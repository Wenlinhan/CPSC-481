import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const jobs = [
  ["output/lecture/lesson-11/cpsc-481-lesson-11-video-lecture.mp4", "output/lecture/lesson-11/cpsc-481-lesson-11-video-lecture-canvas.mp4"],
  ["output/lecture/lesson-12/cpsc-481-lesson-12-video-lecture.mp4", "output/lecture/lesson-12/cpsc-481-lesson-12-video-lecture-canvas.mp4"],
  ["output/lecture/lesson-13/cpsc-481-lesson-13-video-lecture.mp4", "output/lecture/lesson-13/cpsc-481-lesson-13-video-lecture-canvas.mp4"],
  ["output/lecture/lesson-14-rl/cpsc-481-lesson-14-video-lecture.mp4", "output/lecture/lesson-14-rl/cpsc-481-lesson-14-video-lecture-canvas.mp4"],
];

for (const [source, destination] of jobs) {
  await stat(source);
  await mkdir(path.dirname(destination), { recursive: true });
  console.log(`[canvas-video] ${path.basename(source)} -> ${path.basename(destination)}`);
  const result = spawnSync(ffmpegPath, [
    "-y", "-loglevel", "error", "-i", source,
    "-vf", "scale=1280:720:flags=lanczos",
    "-c:v", "libx264", "-preset", "slow", "-crf", "28",
    "-profile:v", "high", "-level", "4.0", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "80k", "-ar", "48000",
    "-movflags", "+faststart", destination,
  ], { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`FFmpeg failed for ${source} with exit code ${result.status}`);
  const info = await stat(destination);
  console.log(`[canvas-video] ${(info.size / 1_000_000).toFixed(1)} MB`);
}
