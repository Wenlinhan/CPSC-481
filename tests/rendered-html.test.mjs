import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the unified course home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /CPSC 481/);
  assert.match(html, /15 modules/);
  assert.match(html, /30 class meetings/);
  assert.match(html, /Learn AI by explaining, tracing, building, and evaluating it/);
  for (let meeting = 1; meeting <= 30; meeting += 1) {
    assert.match(html, new RegExp(`href="/meetings/${String(meeting).padStart(2, "0")}"`));
  }
});

test("all 30 meeting routes render and retain their titles", async () => {
  const plan = await readFile(new URL("../app/data/course.ts", import.meta.url), "utf8");
  const ids = [...plan.matchAll(/\bid:\s*(\d+),\s*week:/g)].map((match) => Number(match[1]));
  assert.deepEqual(ids, Array.from({ length: 30 }, (_, index) => index + 1));
  for (const id of ids) {
    const response = await render(`/meetings/${String(id).padStart(2, "0")}`);
    assert.equal(response.status, 200, `Meeting ${id} should render`);
    const html = await response.text();
    assert.match(html, new RegExp(`Meeting ${id}\\b|Meeting ${String(id).padStart(2, "0")}`));
  }
});

test("every lesson is preplanned as explanation, example, demo, practice, and assessment", async () => {
  const [plan, deck] = await Promise.all([
    readFile(new URL("../app/data/course.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/PlannedLessonDeck.tsx", import.meta.url), "utf8"),
  ]);
  assert.equal((plan.match(/knowledgePoints:/g) ?? []).length - 1, 30);
  assert.equal((plan.match(/\bkp\(/g) ?? []).length, 90);
  for (const field of ["explanation", "example", "demo", "practice", "check"]) assert.match(plan, new RegExp(field));
  for (const stage of ["Knowledge point", "Worked case", "Interactive demonstration", "In-class practice", "Formative assessment", "Misconception clinic", "Integration challenge", "Exit ticket"]) {
    assert.match(deck, new RegExp(stage, "i"));
  }
});

test("preserves custom Meetings 1, 2, 3, 4, 21, and 22 and their visual assets", async () => {
  const files = [
    "../app/components/Meeting01Deck.tsx",
    "../app/components/Meeting02Deck.tsx",
    "../app/components/Meeting03Deck.tsx",
    "../app/components/Meeting04Deck.tsx",
    "../app/components/Meeting21Deck.tsx",
    "../app/components/Meeting22Deck.tsx",
  ];
  const contents = await Promise.all(files.map((file) => readFile(new URL(file, import.meta.url), "utf8")));
  for (const detail of ["AlphaGo", "Dartmouth", "task environment", "agent", "chunk", "embedding", "hybrid", "rerank"]) {
    assert.match(contents.join("\n"), new RegExp(detail, "i"));
  }
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/concepts/visual-usage-manifest.json", import.meta.url));
});

test("Meetings 1 and 2 account for every authoritative L01 source slide and image", async () => {
  const [meeting1, meeting2, manifestText] = await Promise.all([
    readFile(new URL("../app/components/Meeting01Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting02Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l01-ai/manifest.json", import.meta.url), "utf8"),
  ]);
  const extractCoverage = (source) => [...source.matchAll(/sourceSlides:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0])));
  const coverage = [...new Set([...extractCoverage(meeting1), ...extractCoverage(meeting2)])].sort((a, b) => a - b);
  assert.equal((meeting1.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.equal((meeting2.match(/sourceSlides:\s*\[/g) ?? []).length, 28);
  assert.deepEqual(coverage, Array.from({ length: 32 }, (_, index) => index + 1));

  const combined = `${meeting1}\n${meeting2}`;
  for (const knowledgePoint of [
    "AlphaGo and AlphaZero",
    "Intelligence is a general mental capability",
    "Gardner’s theory has never been tested",
    "AI is Artificial Intelligence using computer",
    "The science and engineering of making intelligent machines",
    "agent = architecture + program",
    "Fully observable",
    "Partially observable",
    "Episodic",
    "Stochastic",
    "Continuous",
    "Multi-agent",
    "AGI",
    "How happy I will be in such a state",
    "The imitation game",
    "Collective intelligence",
    "Understand and explain",
    "What is the Turing Test",
    "George F. Luger",
  ]) {
    assert.match(combined, new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.doesNotMatch(combined, /\b(?:original|old)\s+slides?\b/i);

  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.authoritativeSlideCount, 32);
  assert.equal(manifest.sourceSha256, "AD882532D0D9DE2404F3C52495B3860DD1827321EDCA0CA1934607E43A143359");
  assert.deepEqual(
    [...new Set(Object.values(manifest.meetingCoverage).flat())].sort((a, b) => a - b),
    Array.from({ length: 32 }, (_, index) => index + 1),
  );
  assert.equal(manifest.assets.length, 12);
  for (const asset of manifest.assets) {
    await access(new URL(`../public/course-source/l01-ai/${asset.file}`, import.meta.url));
  }
  for (const match of combined.matchAll(/<ConceptImage\b[^>]*\bname="([^"]+)"/g)) {
    await access(new URL(`../public/concepts/${match[1]}.webp`, import.meta.url));
  }
  for (const match of combined.matchAll(/<CourseImage\b[^>]*\bname="([^"]+)"/g)) {
    await access(new URL(`../public/course-source/l01-ai/${match[1]}`, import.meta.url));
  }
});

test("Meetings 3 and 4 account for every authoritative L02 source slide and image", async () => {
  const [meeting3, meeting4, manifestText] = await Promise.all([
    readFile(new URL("../app/components/Meeting03Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting04Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l02-state-space/manifest.json", import.meta.url), "utf8"),
  ]);
  const extractCoverage = (source) => [...source.matchAll(/sourceSlides:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0])));
  const coverage = [...new Set([...extractCoverage(meeting3), ...extractCoverage(meeting4)])].sort((a, b) => a - b);
  assert.equal((meeting3.match(/sourceSlides:\s*\[/g) ?? []).length, 27);
  assert.equal((meeting4.match(/sourceSlides:\s*\[/g) ?? []).length, 28);
  assert.deepEqual(coverage, Array.from({ length: 41 }, (_, index) => index + 1));

  const combined = `${meeting3}\n${meeting4}`;
  for (const knowledgePoint of [
    "State, state space, and search",
    "Königsberg",
    "⟨N, A, S, GD⟩",
    "PROSPECTOR",
    "DENDRAL",
    "Depth-first search",
    "Breadth-first search",
    "Uniform-cost search",
    "SL, NSL, DE, and CS",
    "George F. Luger",
  ]) {
    assert.match(combined, new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.doesNotMatch(combined, /\b(?:original|old)\s+slides?\b/i);

  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.authoritativeSlideCount, 41);
  assert.equal(manifest.sourceSha256, "0ADF5336D2B7B31F82F3B72446346B0419CA336C24BF051C5660D3D1F4457FE6");
  assert.deepEqual(
    [...new Set(Object.values(manifest.meetingCoverage).flat())].sort((a, b) => a - b),
    Array.from({ length: 41 }, (_, index) => index + 1),
  );
  assert.equal(manifest.assets.length, 26);
  for (const asset of manifest.assets) {
    await access(new URL(`../public/course-source/l02-state-space/${asset.file}`, import.meta.url));
  }
  for (const match of combined.matchAll(/<SearchSourceImage\b[^>]*\bfile="([^"]+)"/g)) {
    await access(new URL(`../public/course-source/l02-state-space/${match[1]}`, import.meta.url));
  }
});
