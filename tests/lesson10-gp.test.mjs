import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const deckPath = new URL("../app/components/Lesson10GPSlides.tsx", import.meta.url);
const routePath = new URL("../app/lessons/[lesson]/page.tsx", import.meta.url);
const manifestPath = new URL("../public/course-source/l07-gp-l08-alife/manifest.json", import.meta.url);
const illustrationStylesPath = new URL("../app/styles/lesson10-illustrations.css", import.meta.url);

test("Lesson 10 is a 28-page, 75-minute source-grounded deck", async () => {
  const deck = await readFile(deckPath, "utf8");
  const minutes = [...deck.matchAll(/, (\d+)(?:, [^)]*)?\),?$/gm)].map((match) => Number(match[1]));
  assert.equal((deck.match(/^  slide\(/gm) ?? []).length, 28);
  assert.equal(minutes.length, 28);
  assert.equal(minutes.reduce((sum, value) => sum + value, 0), 75);

  for (const concept of [
    "Genetic programming evolves executable structures",
    "tutorialspoint.com/lisp/index.htm",
    "P ← randomly generated programs",
    "evaluate every program in P and assign fitness",
    "Particle Swarm Optimization",
    "Bees algorithm",
    "Ant Colony Optimization",
  ]) assert.match(deck, new RegExp(concept.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(deck, /gp-program-evolution\.png/);
  assert.match(deck, /artificial-life-modes\.png/);
  assert.doesNotMatch(deck, /source-slides\/slide-/);
});

test("Lesson 10 preserves all authoritative L07 and L08 pages", async () => {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(manifest.sources[0].label, "L07_GP.pdf");
  assert.equal(manifest.sources[0].pageCount, 33);
  assert.equal(Object.keys(manifest.sources[0].sourcePageToLessonPages).length, 33);
  assert.equal(manifest.sources[1].label, "L08_ArtificialLife.pptx");
  assert.equal(manifest.sources[1].pageCount, 28);
  assert.equal(Object.keys(manifest.sources[1].sourcePageToLessonPages).length, 28);
  for (const source of manifest.sources) {
    for (const lessonPages of Object.values(source.sourcePageToLessonPages)) {
      assert.ok(lessonPages.length > 0);
      assert.ok(lessonPages.every((page) => page >= 1 && page <= 28));
    }
  }
});

test("Lesson 10 route uses the rebuilt deck", async () => {
  const route = await readFile(routePath, "utf8");
  assert.match(route, /Lesson10GPSlides/);
  assert.match(route, /10:"Genetic Programming, Artificial Life, and Swarm Intelligence"/);
});

test("Lesson 10 uses orientation-based mouse terminals and recognizable swarm illustrations", async () => {
  const deck = await readFile(deckPath, "utf8");
  const styles = await readFile(illustrationStylesPath, "utf8");
  for (const concept of [
    "InteractiveMouseMaze",
    "FORWARD is blocked by a raised wall",
    "Success! The rat reached the cheese.",
    "Move forward one step",
    "Turn left without moving",
    "Turn right without moving",
    "action!==\"forward\"",
    "executed actions",
    "Emergent flock",
    "Waggle dance",
    "Recruit + exploit",
    "AntNest",
    "AntFood",
    "Rock",
    "Illustrated ant colony food discovery",
  ]) assert.match(deck, new RegExp(concept.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const selector of [".l10-bird", ".l10-hive", ".l10-bee", ".l10-ant-real", ".l10-ant-nest", ".l10-ant-food", ".l10-rock"]) {
    assert.match(styles, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
