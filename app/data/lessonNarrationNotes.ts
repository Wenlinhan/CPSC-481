import narrationData from "./lesson-narration-notes.json";

type NarrationLesson = keyof typeof narrationData;

export function lessonNarrationNotes(lesson: 7 | 8 | 9 | 10): readonly string[] {
  return narrationData[String(lesson) as NarrationLesson].notes;
}
