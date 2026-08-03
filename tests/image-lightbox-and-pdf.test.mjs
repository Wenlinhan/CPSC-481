import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = relative => readFile(new URL(`../${relative}`, import.meta.url), "utf8");

test("lesson image lightboxes fill the viewport while preserving aspect ratio", async () => {
  const [styles, primitives] = await Promise.all([
    read("app/globals.css"),
    read("app/components/SearchLessonPrimitives.tsx"),
  ]);
  assert.match(styles, /\.source-image-lightbox\s*>\s*img[\s\S]*height:\s*82vh[\s\S]*object-fit:\s*contain[\s\S]*width:\s*92vw/);
  assert.match(primitives, /export function EnlargeableImage/);
  assert.match(primitives, /event\.key === "Escape"/);
  assert.match(primitives, /export function SearchSourceImage[\s\S]*event\.key === "Escape"[\s\S]*onClick=\{\(\) => setZoomed\(false\)\}/);
});

test("Lessons 1, 2, 9, and 10 use the shared enlargement control", async () => {
  for (const file of ["Meeting01Deck.tsx", "Meeting02Deck.tsx", "Lesson09GASlides.tsx", "Lesson10GPSlides.tsx"]) {
    const source = await read(`app/components/${file}`);
    assert.match(source, /EnlargeableImage/);
  }
});

test("lesson PDF export targets Lessons 1-10 and print CSS removes navigation chrome", async () => {
  const [exporter, styles] = await Promise.all([
    read("scripts/export_lesson_pdfs.mjs"),
    read("app/globals.css"),
  ]);
  assert.match(exporter, /\/lessons\/\$\{lessonId\}\?print=all/);
  assert.match(exporter, /cpsc481-lesson-\$\{lessonId\}-slides\.pdf/);
  assert.match(styles, /@page\s*\{[\s\S]*size:\s*10in 7\.5in/);
  assert.match(styles, /\.course-home-link/);
});
