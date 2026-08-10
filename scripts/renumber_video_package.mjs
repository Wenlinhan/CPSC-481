import fs from "node:fs/promises";
import path from "node:path";

const [directory, fromLesson, toLesson, fromMeeting, toMeeting] = process.argv.slice(2);
if (!directory || !fromLesson || !toLesson || !fromMeeting || !toMeeting) {
  throw new Error("Usage: renumber_video_package.mjs DIRECTORY FROM_LESSON TO_LESSON FROM_MEETING TO_MEETING");
}

const numberWords = {
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen",
};
const titleNumberWords = Object.fromEntries(Object.entries(numberWords).map(([key, value]) => [key, value[0].toUpperCase() + value.slice(1)]));
const replacements = [
  [`/lessons/${fromLesson}`, `/lessons/${toLesson}`],
  [`lesson-${fromLesson}`, `lesson-${toLesson}`],
  [`Lesson ${fromLesson}`, `Lesson ${toLesson}`],
  [`Lesson ${numberWords[fromLesson]}`, `Lesson ${numberWords[toLesson]}`],
  [`Lesson ${titleNumberWords[fromLesson]}`, `Lesson ${titleNumberWords[toLesson]}`],
  [`meeting-${fromMeeting}`, `lesson-${toLesson}`],
  [`Meeting ${fromMeeting}`, `Lesson ${toLesson}`],
  [`"lesson": "${fromLesson}"`, `"lesson": "${toLesson}"`],
  [`"lesson": ${fromLesson}`, `"lesson": ${toLesson}`],
  [`lesson: "${fromLesson}"`, `lesson: "${toLesson}"`],
  [`"meeting": "${fromMeeting}"`, `"meeting": "${toMeeting}"`],
  [`"meeting": ${fromMeeting}`, `"meeting": ${toMeeting}`],
  [`meeting: "${fromMeeting}"`, `meeting: "${toMeeting}"`],
];

const root = path.resolve(directory);
for (const entry of await fs.readdir(root, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const source = path.join(root, entry.name);
  let text = await fs.readFile(source, "utf8");
  for (const [from, to] of replacements) text = text.split(from).join(to);
  await fs.writeFile(source, text, "utf8");
}

for (const entry of await fs.readdir(root, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  let nextName = entry.name
    .split(`lesson-${fromLesson}`).join(`lesson-${toLesson}`)
    .split(`meeting-${fromMeeting}`).join(`lesson-${toLesson}`);
  if (nextName !== entry.name) await fs.rename(path.join(root, entry.name), path.join(root, nextName));
}

console.log(`Renumbered ${root}: Lesson ${fromLesson} -> ${toLesson}; meeting ${fromMeeting} -> ${toMeeting}`);
