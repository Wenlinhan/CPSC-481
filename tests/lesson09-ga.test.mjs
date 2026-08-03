import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function pngDimensions(content) {
  assert.equal(content.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "Expected a PNG signature");
  return { width: content.readUInt32BE(16), height: content.readUInt32BE(20) };
}

test("Lesson 9 restores the GA algorithm and both complete representation cases", async () => {
  const source = await readFile(new URL("../app/components/Lesson09GASlides.tsx", import.meta.url), "utf8");
  assert.equal((source.match(/\bslide\("/g) ?? []).length, 26);
  for (const required of [
    "initialize population P(t)",
    "while termination condition is not met",
    "evaluate fitness of every member of P(t)",
    "produce offspring using crossover and mutation",
    "f(x) = x sin(10πx) + 1",
    "3,000,001 representable values",
    "1000101110110101000111",
    "2,288,967",
    "0.637197",
    "P(0) contains 300 candidates",
    "pᶜ=.50 · pᵐ=.01",
    "Encoding #1: 4 bits per city",
    "Encoding #2: a permutation",
    "Order crossover",
    "2 3 9 | 4 6 5 7 | 1 8",
  ]) assert.ok(source.includes(required), `Lesson 9 must preserve: ${required}`);

  const minutes = [...source.matchAll(/, \[[^\]]*\], (\d+)(?:,|\))/g)].map(match => Number(match[1]));
  assert.equal(minutes.length, 26);
  assert.equal(minutes.reduce((sum, value) => sum + value, 0), 75);

  for (const image of ["evolutionary-search.png", "cell-to-dna.png", "tsp-nine-city-loop.png"]) {
    const content = await readFile(new URL(`../public/course-source/l06-bio-ga/generated/${image}`, import.meta.url));
    const dimensions = pngDimensions(content);
    assert.ok(dimensions.width >= 1500 && dimensions.height >= 900, `${image} must remain presentation resolution`);
  }

  assert.doesNotMatch(source, /source-slides\/slide-\d+\.png/);
});

test("Lesson 9 maps all 22 source pages to native destinations", async () => {
  const manifest = JSON.parse(await readFile(new URL("../public/course-source/l06-bio-ga/manifest.json", import.meta.url), "utf8"));
  assert.equal(manifest.lesson, 9);
  assert.equal(manifest.route, "/lessons/09");
  assert.equal(manifest.sources[0].pageCount, 22);
  assert.deepEqual(Object.keys(manifest.sources[0].sourcePageToLessonPages).map(Number), Array.from({ length: 22 }, (_, i) => i + 1));
  for (const pages of Object.values(manifest.sources[0].sourcePageToLessonPages)) {
    assert.ok(pages.length > 0);
    assert.ok(pages.every(page => page >= 1 && page <= 26));
  }
});
