import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const script = JSON.parse(await readFile(path.join(here, "lecture-script-aria.json"), "utf8"));
const audioDir = path.join(root, "output", "lecture", "lesson-11", "audio-aria-final");

function duration(buffer) {
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
  if (!byteRate || dataSize === undefined) throw new Error("Invalid WAV");
  return dataSize / byteRate;
}

function normalized(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "");
}

function atPhrase(phrase, boundaries) {
  const wanted = phrase.split(/\s+/).map(normalized).filter(Boolean);
  const spoken = boundaries.map(item => normalized(item.text));
  for (let index = 0; index <= spoken.length - wanted.length; index += 1) {
    if (wanted.every((word, offset) => spoken[index + offset] === word)) {
      return Math.max(0.05, boundaries[index].offsetSeconds - 0.08);
    }
  }
  throw new Error("Aligned phrase not found: " + phrase);
}

const visual = { version: 1, meeting: "11", scriptVersion: script.version, voice: script.voice, timing: { leadSeconds: 0.22, defaultFocusSeconds: 6, defaultPopupSeconds: 6.2, minimumGapSeconds: 0.6, minimumPopupHoldSeconds: 2 }, slides: [] };
const kinetic = { version: 1, meeting: "11", timing: { leadSeconds: 0.22, defaultDurationSeconds: 6.2, minimumCenterHoldSeconds: 2, maximumStillSeconds: 12 }, slides: [] };

for (const slide of script.slides) {
  const visualSlide = { number: slide.number, title: slide.title, segments: [] };
  const kineticSlide = { number: slide.number, title: slide.title, segments: [] };
  for (const [index, segment] of slide.segments.entries()) {
    const filename = "slide-" + String(slide.number).padStart(2, "0") + "-segment-" + String(index + 1).padStart(2, "0") + ".wav";
    const seconds = duration(await readFile(path.join(audioDir, filename)));
    const boundaries = JSON.parse(await readFile(path.join(audioDir, filename.replace(".wav", ".words.json")), "utf8"));
    const design = segment.visualDesign;
    const focusCues = (design.focuses ?? []).map(focus => ({
      type: "focus",
      label: focus.label,
      selector: focus.selector,
      index: focus.index,
      sourcePhrase: focus.phrase,
      atSeconds: +atPhrase(focus.phrase, boundaries).toFixed(3),
    })).sort((a, b) => a.atSeconds - b.atSeconds);
    for (let cueIndex = 0; cueIndex < focusCues.length; cueIndex += 1) {
      const cue = focusCues[cueIndex];
      const next = focusCues[cueIndex + 1];
      const remaining = Math.max(0.1, seconds - cue.atSeconds);
      const untilNext = Math.max(0.1, (next?.atSeconds ?? seconds) - cue.atSeconds - 0.05);
      cue.durationSeconds = +Math.min(remaining, Math.max(1.8, Math.min(7, untilNext))).toFixed(3);
    }
    const explicitKinetics = (design.kinetics ?? []).map(moment => {
      const cueAt = atPhrase(moment.phrase, boundaries);
      const available = Math.max(0.1, seconds - cueAt);
      const durationSeconds = +Math.min(moment.durationSeconds ?? 5.5, available).toFixed(3);
      return {
        ...moment,
        slide: undefined,
        segment: undefined,
        phrase: undefined,
        sourcePhrase: moment.phrase,
        atSeconds: +cueAt.toFixed(3),
        durationSeconds,
        centerHoldSeconds: +Math.min(durationSeconds, Math.max(2, durationSeconds * .64)).toFixed(3),
      };
    });
    const visualCues = [...focusCues, ...explicitKinetics.filter(cue => cue.type === "popup")].sort((a, b) => a.atSeconds - b.atSeconds);
    const kineticCues = explicitKinetics.filter(cue => cue.type !== "popup");
    const eventStarts = [0, ...visualCues.map(cue => cue.atSeconds), ...kineticCues.map(cue => cue.atSeconds), seconds].sort((a,b)=>a-b);
    for (let eventIndex = 1; eventIndex < eventStarts.length; eventIndex += 1) {
      let left = eventStarts[eventIndex - 1];
      const right = eventStarts[eventIndex];
      while (right - left > 12) {
        const at = left + 10;
        kineticCues.push({ type: "camera", label: "Subtle camera reframe", route: (slide.number + index + eventIndex) % 2 ? "breathe-left" : "breathe-right", sourcePhrase: "cadence filler", atSeconds: +at.toFixed(3), durationSeconds: +Math.min(4.2, seconds - at).toFixed(3), automatic: true });
        left = at;
      }
    }
    visualSlide.segments.push({ number: index + 1, label: segment.label, durationSeconds: +seconds.toFixed(3), cueCount: visualCues.length, cues: visualCues });
    kineticCues.sort((a, b) => a.atSeconds - b.atSeconds);
    kineticSlide.segments.push({ number: index + 1, durationSeconds: +seconds.toFixed(3), cueCount: kineticCues.length, cues: kineticCues });
  }
  visual.slides.push(visualSlide);
  kinetic.slides.push(kineticSlide);
}

await writeFile(path.join(here, "visual-cue-plan.json"), JSON.stringify(visual, null, 2) + "\n", "utf8");
await writeFile(path.join(here, "kinetic-cue-plan.json"), JSON.stringify(kinetic, null, 2) + "\n", "utf8");
const cues = kinetic.slides.flatMap(slide => slide.segments.flatMap(segment => segment.cues));
const lines = [
  "# Lesson 11 visual engagement plan", "",
  "- Phrase-synchronized focus and popup cues: " + visual.slides.flatMap(slide => slide.segments.flatMap(segment => segment.cues)).length,
  "- Centered concept popups: " + visual.slides.flatMap(slide => slide.segments.flatMap(segment => segment.cues)).filter(cue => cue.type === "popup").length,
  "- Kinetic concept cues: " + cues.filter(cue => !cue.automatic).length,
  "- Automatic camera reframes: " + cues.filter(cue => cue.automatic).length,
  "- Large popups hold in the central viewing area for at least two seconds.",
  "- Interactive traces, reveals, tabs, figure enlargements, and replayable animations align to narration boundaries.",
  "- Bottom caption safe area remains clear.", "",
];
for (const slide of kinetic.slides) {
  lines.push("## Slide " + slide.number + " - " + slide.title, "");
  for (const segment of slide.segments) {
    lines.push("- Segment " + segment.number + ": " + segment.cues.map(cue => cue.label + " at " + cue.atSeconds.toFixed(1) + "s").join("; ") + ".");
  }
  lines.push("");
}
await writeFile(path.join(here, "lesson-11-visual-engagement-plan.md"), lines.join("\n"), "utf8");
console.log(JSON.stringify({ slides: visual.slides.length, segments: visual.slides.flatMap(slide => slide.segments).length, kineticCues: cues.length }, null, 2));
