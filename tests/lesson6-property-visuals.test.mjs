import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../app/components/Meeting06Deck.tsx", import.meta.url), "utf8");

test("Lesson 6 separates heuristic and search-algorithm properties", () => {
  for (const required of [
    "Heuristic function h",
    "Search algorithm",
    "Admissibility",
    "Consistency",
    "monotonicity or local admissibility",
    "Informedness",
    "Complete?",
    "Optimal?",
    "Time?",
    "Space?",
    "Algorithm admissibility",
  ]) {
    assert.match(source, new RegExp(required.replace(/[?*()]/g, "\\$&"), "i"));
  }
});

test("Lesson 6 diagnoses both kinds of exam question", () => {
  for (const prompt of [
    "Is h1 admissible?",
    "Is h2 consistent?",
    "Is DFS consistent?",
    "Is best-first search complete?",
    "Is algorithm A admissible?",
    "CATEGORY MISMATCH",
  ]) {
    assert.ok(source.includes(prompt), `missing prompt: ${prompt}`);
  }
});

test("Lesson 6 provides a visual for every application case", () => {
  assert.ok(source.includes("function ApplicationScene"));
  assert.match(source, /applicationCases\.map[\s\S]*ApplicationScene kind=\{index\}/);
  for (const title of ["Autopilot", "Autonomous drone", "Robot vacuum", "Chess", "Financial investment"]) {
    assert.ok(source.includes(`title: "${title}"`));
  }
});
