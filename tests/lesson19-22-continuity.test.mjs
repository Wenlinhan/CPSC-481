import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (name) => readFile(new URL(`../app/components/${name}`, import.meta.url), "utf8");

test("Lessons 19 and 20 open with concrete interactive decisions", async () => {
  const [lesson19, lesson20] = await Promise.all([
    read("Meeting19Deck.tsx"),
    read("Meeting20Deck.tsx"),
  ]);

  assert.match(lesson19, /How does AI connect a later word to the right earlier clue/);
  assert.match(lesson19, /function ContextClueDemo/);
  assert.match(lesson19, /What does <b>it<\/b> refer to/);
  assert.doesNotMatch(lesson19, /How does a sequence of symbols become a context-sensitive computation/);

  assert.match(lesson20, /function TrustTheAnswerDemo/);
  assert.match(lesson20, /A polished answer appears in one second/);
  assert.match(lesson20, /Fluent - no evidence shown/);
  assert.match(lesson20, /Linked to assignment instructions \[D3\]/);
});

test("Lessons 21 and 22 use schedule-independent RAG examples and interactive reliability evidence", async () => {
  const [lesson21, lesson22] = await Promise.all([
    read("Meeting21Deck.tsx"),
    read("Meeting22Deck.tsx"),
  ]);

  assert.doesNotMatch(lesson21, /Week 1[23]/);
  assert.doesNotMatch(lesson22, /Week 1[23]/);
  assert.match(lesson21, /Submission channel: Canvas/);
  assert.match(lesson21, /Where is the brief submitted, and what must it include/);
  assert.match(lesson22, /function ReliabilityOpeningDemo/);
  assert.match(lesson22, /Failures grouped by cause/);
  assert.match(lesson22, /current syllabus names Canvas/);
});
