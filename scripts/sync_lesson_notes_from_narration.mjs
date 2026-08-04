import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const lessons = [7, 8, 9, 10];
const output = {};

for (const lesson of lessons) {
  const lessonId = String(lesson).padStart(2, "0");
  const source = path.join("lecture", `meeting-${lessonId}`, "lecture-script-aria.json");
  const narration = JSON.parse(await readFile(source, "utf8"));
  if (!Array.isArray(narration.slides) || narration.slides.length === 0) {
    throw new Error(`${source} has no narration slides.`);
  }

  const notes = narration.slides.map((slide, index) => {
    if (slide.number !== index + 1) throw new Error(`${source} has a nonsequential slide number at ${index + 1}.`);
    const paragraphs = (slide.segments ?? []).map(segment => segment.text?.trim()).filter(Boolean);
    if (paragraphs.length === 0) throw new Error(`${source} slide ${slide.number} has no narration text.`);
    return paragraphs.join("\n\n");
  });

  output[lesson] = { source, title: narration.title, notes };
  console.log(`Lesson ${lesson}: ${notes.length} narrated Notes pages`);
}

await writeFile(
  path.join("app", "data", "lesson-narration-notes.json"),
  `${JSON.stringify(output, null, 2)}\n`,
);
