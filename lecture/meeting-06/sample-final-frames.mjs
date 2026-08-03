import { mkdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "../..");
const script = JSON.parse(await readFile(path.join(here, "lecture-script-aria.json"), "utf8"));
const visual = JSON.parse(await readFile(path.join(here, "visual-cue-plan.json"), "utf8"));
const kinetic = JSON.parse(await readFile(path.join(here, "kinetic-cue-plan.json"), "utf8"));
const audioDir = path.join(siteRoot, "output", "lecture", "meeting-06", "audio-aria-final");
const video = path.join(siteRoot, "output", "lecture", "meeting-06", "cpsc-481-lesson-06-video-lecture.mp4");
const output = path.join(siteRoot, "output", "lecture", "meeting-06", "qa-frames");
await mkdir(output, { recursive: true });

function wavDuration(buffer) {
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
  return dataSize / byteRate;
}

const starts = new Map();
let clock = 0.82;
for (const slide of script.slides) {
  for (const [index, segment] of slide.segments.entries()) {
    if (segment.action) clock += 1.445;
    starts.set(slide.number + ":" + (index + 1), clock);
    const filename = "slide-" + String(slide.number).padStart(2, "0") + "-segment-" + String(index + 1).padStart(2, "0") + ".wav";
    clock += wavDuration(await readFile(path.join(audioDir, filename))) + 0.42 + (segment.pauseAfterSeconds ?? 0);
  }
  if (slide.number < script.slides.length) clock += 2.195;
}

const samples = [
  { name: "01-centered-concept", slide: 1, segment: 2, cueType: "kinetic" },
  { name: "04-revealed-selection-order", slide: 4, segment: 4, offset: 4 },
  { name: "06-greedy-trace-c4", slide: 6, segment: 7, offset: 4 },
  { name: "07-puzzle-enlarged", slide: 7, segment: 2, offset: 4 },
  { name: "10-admissibility-popup", slide: 10, segment: 2, cueType: "popup" },
  { name: "11-eight-puzzle-tab", slide: 11, segment: 2, offset: 4 },
  { name: "14-city-animation-replay", slide: 14, segment: 3, offset: 5 },
  { name: "18-consistency-visual", slide: 18, segment: 2, cueType: "kinetic" },
  { name: "19-reopened-a", slide: 19, segment: 7, offset: 4 },
  { name: "20-dominance-popup", slide: 20, segment: 2, cueType: "popup" },
  { name: "21-total-cost-popup", slide: 21, segment: 2, cueType: "kinetic" },
  { name: "22-dfs-category-mismatch", slide: 22, segment: 6, offset: 4 },
  { name: "23-chess-analysis", slide: 23, segment: 10, offset: 4 },
  { name: "24-environment-audit", slide: 24, segment: 4, cueType: "popup" },
  { name: "25-exit-takeaway", slide: 25, segment: 4, cueType: "kinetic" },
];

const report = [];
for (const sample of samples) {
  const start = starts.get(sample.slide + ":" + sample.segment);
  const visualCues = visual.slides.find(item => item.number === sample.slide).segments.find(item => item.number === sample.segment).cues;
  const kineticCues = kinetic.slides.find(item => item.number === sample.slide).segments.find(item => item.number === sample.segment).cues;
  const candidates = sample.cueType === "kinetic"
    ? kineticCues.filter(item => !item.automatic)
    : visualCues.filter(item => item.type === sample.cueType);
  const cue = sample.cueType ? candidates[sample.cueIndex ?? 0] : null;
  if (sample.cueType && !cue) throw new Error(`No ${sample.cueType} cue for ${sample.slide}:${sample.segment}`);
  const seconds = start + (cue ? cue.atSeconds + Math.min(1.5, cue.durationSeconds / 2) : sample.offset);
  const target = path.join(output, sample.name + ".png");
  const result = spawnSync(ffmpegPath, ["-y", "-ss", seconds.toFixed(3), "-i", video, "-frames:v", "1", "-q:v", "2", target], { stdio: "ignore" });
  if (result.status !== 0) throw new Error("Frame extraction failed for " + sample.name);
  report.push({ ...sample, seconds: +seconds.toFixed(3), target });
}
console.log(JSON.stringify({ timelineSeconds: +clock.toFixed(3), frames: report }, null, 2));
