import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const lesson7 = readFileSync(new URL("../app/components/Meeting07Deck.tsx", import.meta.url), "utf8");
const lesson8 = readFileSync(new URL("../app/components/Meeting08Deck.tsx", import.meta.url), "utf8");

test("Lesson 7 adds concept-specific interactive explanations", () => {
  for (const required of [
    "function GameSolutionExplorer",
    "One-agent path",
    "Game strategy",
    "function MinimaxBackupLab",
    "MAX chooses the best worst case",
    "m7-score-visual",
  ]) {
    assert.ok(lesson7.includes(required), `missing Lesson 7 visual or interaction: ${required}`);
  }
});

test("Lesson 8 adds bound, ordering, and complete practice-tree interactions", () => {
  for (const required of [
    "function BoundWindowDemo",
    "Alpha rises for MAX; beta falls for MIN",
    "function MoveOrderingLab",
    "Helpful ordering",
    "Poor ordering",
    "function AlphaBetaPracticeTree",
    "nine of fifteen leaves",
  ]) {
    assert.ok(lesson8.includes(required), `missing Lesson 8 visual or interaction: ${required}`);
  }
});

test("Lesson 8 preserves the exact 15-leaf practice tree in native HTML", () => {
  assert.ok(lesson8.includes("[[5, 2], [10, 11]]"));
  assert.ok(lesson8.includes("[[1, 2, 2], [8], [6, 5]]"));
  assert.ok(lesson8.includes("[[12], [4, 3], [25, 2]]"));
  assert.equal(lesson8.includes('file="source-slides/slide-30.png"'), false);
});
