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

test("preserves custom Meetings 1, 2, 21, and 22 and their visual assets", async () => {
  const files = [
    "../app/components/Meeting01Deck.tsx",
    "../app/components/Meeting02Deck.tsx",
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
