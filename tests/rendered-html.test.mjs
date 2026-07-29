import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

function sha256(content) {
  return createHash("sha256").update(content).digest("hex").toUpperCase();
}

function pngDimensions(content) {
  assert.equal(content.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "Expected a PNG signature");
  return {
    width: content.readUInt32BE(16),
    height: content.readUInt32BE(20),
  };
}

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

test("preserves implemented custom meeting decks and their visual assets", async () => {
  const files = [
    "../app/components/Meeting01Deck.tsx",
    "../app/components/Meeting02Deck.tsx",
    "../app/components/Meeting03Deck.tsx",
    "../app/components/Meeting04Deck.tsx",
    "../app/components/Meeting05Deck.tsx",
    "../app/components/Meeting06Deck.tsx",
    "../app/components/Meeting07Deck.tsx",
    "../app/components/Meeting08Deck.tsx",
    "../app/components/Meeting09Deck.tsx",
    "../app/components/Meeting10Deck.tsx",
    "../app/components/Meeting11Deck.tsx",
    "../app/components/Meeting12Deck.tsx",
    "../app/components/Meeting13Deck.tsx",
    "../app/components/Meeting14Deck.tsx",
    "../app/components/Meeting15Deck.tsx",
    "../app/components/Meeting16Deck.tsx",
    "../app/components/Meeting17Deck.tsx",
    "../app/components/Meeting18Deck.tsx",
    "../app/components/Meeting19Deck.tsx",
    "../app/components/Meeting20Deck.tsx",
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

test("Meetings 1 and 2 account for the complete L01 v2 source-evidence package", async () => {
  const [meeting1, meeting2, manifestText, inventoryContent] = await Promise.all([
    readFile(new URL("../app/components/Meeting01Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting02Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l01-ai/manifest.json", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l01-ai/source-inventory.json", import.meta.url)),
  ]);
  const extractCoverage = (source) => [...source.matchAll(/sourceSlides:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0])));
  const meeting1Coverage = [...new Set(extractCoverage(meeting1))].sort((a, b) => a - b);
  const meeting2Coverage = [...new Set(extractCoverage(meeting2))].sort((a, b) => a - b);
  const allSlides = Array.from({ length: 32 }, (_, index) => index + 1);
  const expectedMeeting1 = allSlides.slice(0, 10);
  const expectedMeeting2 = allSlides.slice(10);
  assert.equal((meeting1.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.equal((meeting2.match(/sourceSlides:\s*\[/g) ?? []).length, 32);
  assert.equal((meeting1.match(/minutes:\s*\d+/g) ?? []).length, 25);
  assert.equal((meeting2.match(/minutes:\s*\d+/g) ?? []).length, 32);
  assert.equal(
    [...meeting1.matchAll(/minutes:\s*(\d+)/g)]
      .reduce((total, match) => total + Number(match[1]), 0),
    75,
  );
  assert.equal(
    [...meeting2.matchAll(/minutes:\s*(\d+)/g)]
      .reduce((total, match) => total + Number(match[1]), 0),
    75,
  );
  assert.deepEqual(meeting1Coverage, expectedMeeting1);
  assert.deepEqual(meeting2Coverage, expectedMeeting2);

  const combined = `${meeting1}\n${meeting2}`;
  for (const knowledgePoint of [
    "AlphaGo and AlphaZero",
    "Intelligence is a general mental capability",
    "Gardner’s theory has never been tested",
    "AI is Artificial Intelligence using computer",
    "The science and engineering of making intelligent machines",
    "agent = architecture + program",
    "expected to maximize the performance measure",
    "PEAS specification",
    "Two-location vacuum world",
    "Fully observable",
    "Partially observable",
    "A card game can be",
    "Episodic",
    "Stochastic",
    "Continuous",
    "Multi-agent",
    "AGI",
    "How happy I will be in such a state",
    "Learning element",
    "Problem generator",
    "The imitation game",
    "Collective intelligence",
    "Understand and explain",
    "What is the Turing Test",
    "George F. Luger",
  ]) {
    assert.match(combined, new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.match(meeting2, /Textbook extension · PEAS and two-location vacuum world/);
  assert.doesNotMatch(combined, /\b(?:original|old)\s+slides?\b/i);

  const shell = await readFile(new URL("../app/components/L01DeckShell.tsx", import.meta.url), "utf8");
  assert.match(shell, /Course source/);
  assert.match(shell, /source-slides\/slide-/);
  assert.match(shell, /select to enlarge/i);

  const manifest = JSON.parse(manifestText);
  const inventory = JSON.parse(inventoryContent.toString("utf8"));
  assert.equal(manifest.schemaVersion, 2);
  assert.equal(manifest.source, "L01_AI.pptx");
  assert.equal(manifest.sourceFilename, "L01_AI.pptx");
  assert.equal(manifest.authoritativeSlideCount, 32);
  assert.equal(manifest.sourceSha256, "AD882532D0D9DE2404F3C52495B3860DD1827321EDCA0CA1934607E43A143359");
  assert.equal(manifest.sourceBytes, 3874293);
  assert.deepEqual(manifest.sourcePage, { widthPoints: 720, heightPoints: 540, aspectRatio: "4:3" });
  assert.deepEqual(manifest.meetingCoverage["1"], expectedMeeting1);
  assert.deepEqual(manifest.meetingCoverage["2"], expectedMeeting2);
  assert.deepEqual(
    [...new Set(Object.values(manifest.meetingCoverage).flat())].sort((a, b) => a - b),
    allSlides,
  );
  assert.deepEqual(
    manifest.slideToMeeting,
    Object.fromEntries(allSlides.map((slide) => [String(slide), slide <= 10 ? 1 : 2])),
  );

  assert.equal(
    sha256(inventoryContent),
    "DEA439CC75F07E3579CB57B23F78DA3B9323213E7C57772A7F83324130386D25",
  );
  assert.equal(manifest.inventoryProvenance.sha256, sha256(inventoryContent));
  assert.equal(manifest.inventoryProvenance.file, "source-inventory.json");
  assert.equal(inventory.sourceFilename, manifest.sourceFilename);
  assert.equal(inventory.sourceSha256.toUpperCase(), manifest.sourceSha256);
  assert.equal(inventory.slideCount, 32);
  assert.equal(inventory.slides.length, 32);
  assert.equal(inventory.mediaCount, 12);
  assert.equal(inventory.media.length, 12);
  assert.equal(inventory.slides.reduce((count, slide) => count + slide.textBlocks.length, 0), 99);

  const expectedSpeakerNoteSlides = [7, 10, 11, 12, 13, 15, 16, 17, 21, 22, 23, 26];
  const speakerNoteSlides = inventory.slides.filter((slide) => slide.notes.trim()).map((slide) => slide.number);
  assert.deepEqual(speakerNoteSlides, expectedSpeakerNoteSlides);
  assert.deepEqual(
    manifest.inventoryProvenance.speakerNotes,
    { count: 12, slides: expectedSpeakerNoteSlides },
  );
  assert.equal(manifest.auditSummary.slidesWithSpeakerNotes, 12);
  assert.deepEqual(manifest.auditSummary.speakerNoteSlides, expectedSpeakerNoteSlides);

  const expectedTimingSlides = [5, 14];
  const nativeTimingSlides = inventory.slides.filter((slide) => slide.timing.hasTiming).map((slide) => slide.number);
  assert.deepEqual(nativeTimingSlides, expectedTimingSlides);
  assert.equal(inventory.slides.reduce((count, slide) => count + slide.timing.conditionCount, 0), 0);
  assert.equal(inventory.slides.reduce((count, slide) => count + slide.timing.effectCount, 0), 0);
  assert.deepEqual(
    manifest.inventoryProvenance.nativeTiming,
    { count: 2, slides: expectedTimingSlides, conditionCount: 0, effectCount: 0 },
  );
  assert.equal(manifest.auditSummary.slidesWithNativeTiming, 2);
  assert.deepEqual(manifest.auditSummary.nativeTimingSlides, expectedTimingSlides);

  const expectedMediaSlides = [5, 11, 15, 16, 17, 22, 24];
  assert.deepEqual(
    inventory.slides.filter((slide) => slide.media.length).map((slide) => slide.number),
    expectedMediaSlides,
  );
  assert.equal(inventory.slides.reduce((count, slide) => count + slide.media.length, 0), 14);
  assert.equal(manifest.auditSummary.embeddedMediaFiles, 12);
  assert.equal(manifest.auditSummary.mediaRelationships, 14);
  assert.deepEqual(manifest.auditSummary.embeddedMediaSlides, expectedMediaSlides);

  assert.equal(manifest.renderProvenance.count, 32);
  assert.equal(manifest.renderProvenance.renders.length, 32);
  assert.deepEqual(manifest.renderProvenance.dimensions, { width: 1600, height: 1200 });
  for (const [index, inventorySlide] of inventory.slides.entries()) {
    const slide = index + 1;
    const expectedFile = `slide-${String(slide).padStart(2, "0")}.png`;
    const manifestRender = manifest.renderProvenance.renders[index];
    assert.equal(inventorySlide.number, slide);
    assert.equal(inventorySlide.render.file, expectedFile);
    assert.equal(inventorySlide.render.width, 1600);
    assert.equal(inventorySlide.render.height, 1200);
    assert.equal(manifestRender.slide, slide);
    assert.equal(manifestRender.meeting, slide <= 10 ? 1 : 2);
    assert.equal(manifestRender.file, expectedFile);
    assert.equal(manifestRender.bytes, inventorySlide.render.bytes);
    assert.equal(manifestRender.sha256, inventorySlide.render.sha256.toUpperCase());
    assert.equal(manifestRender.width, 1600);
    assert.equal(manifestRender.height, 1200);

    const renderContent = await readFile(
      new URL(`../public/course-source/l01-ai/source-slides/${expectedFile}`, import.meta.url),
    );
    assert.equal(renderContent.length, inventorySlide.render.bytes);
    assert.equal(sha256(renderContent), inventorySlide.render.sha256.toUpperCase());
    assert.deepEqual(pngDimensions(renderContent), { width: 1600, height: 1200 });
  }

  assert.equal(manifest.assets.length, 12);
  const inventoryMedia = new Map(inventory.media.map((media) => [media.file, media]));
  for (const asset of manifest.assets) {
    const sourceMedia = inventoryMedia.get(asset.sourceMedia);
    assert.ok(sourceMedia, `${asset.file} must map to inventory media`);
    assert.equal(asset.sourceMediaSha256, sourceMedia.sha256.toUpperCase());
    assert.equal(asset.sourceMediaBytes, sourceMedia.bytes);
    assert.deepEqual(
      asset.sourceSlides,
      inventory.slides.filter((slide) => slide.media.includes(asset.sourceMedia)).map((slide) => slide.number),
    );
    assert.ok(asset.knowledgeRole);

    const assetContent = await readFile(
      new URL(`../public/course-source/l01-ai/${asset.file}`, import.meta.url),
    );
    assert.equal(assetContent.length, asset.bytes);
    assert.equal(sha256(assetContent), asset.sha256);
    assert.deepEqual(pngDimensions(assetContent), asset.dimensions);
    assert.deepEqual(asset.dimensions, { width: sourceMedia.width, height: sourceMedia.height });
    if (/\.png$/i.test(asset.sourceMedia)) {
      assert.equal(asset.sha256, asset.sourceMediaSha256, `${asset.file} should be byte-identical`);
      assert.equal(asset.bytes, asset.sourceMediaBytes, `${asset.file} should preserve byte length`);
    }
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

test("Meetings 3 through 8 route Course source to the matching complete historical deck", async () => {
  const deckGroups = [
    {
      components: ["Meeting03Deck.tsx", "Meeting04Deck.tsx"],
      count: 41,
      directory: "l02-state-space",
      label: "L02_StateSpaceSearch.pptx",
    },
    {
      components: ["Meeting05Deck.tsx"],
      count: 31,
      directory: "l03-heuristic-local-search",
      label: "L03_Heuristic, HillClimbing&SA.pptx",
    },
    {
      components: ["Meeting06Deck.tsx"],
      count: 22,
      directory: "l04-best-first-astar",
      label: "L04_BFS&AStar.pptx",
    },
    {
      components: ["Meeting07Deck.tsx", "Meeting08Deck.tsx"],
      count: 31,
      directory: "l05-minimax-pruning",
      label: "L05_MiniMax&Pruning.pptx",
    },
  ];

  for (const group of deckGroups) {
    const components = await Promise.all(group.components.map((name) => (
      readFile(new URL(`../app/components/${name}`, import.meta.url), "utf8")
    )));
    const combined = components.join("\n");
    assert.match(combined, new RegExp(`sourceCollectionLabel="${group.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(combined, new RegExp(`sourceCollectionPath="${group.directory}"`));

    for (let page = 1; page <= group.count; page += 1) {
      const sourcePage = await readFile(new URL(
        `../public/course-source/${group.directory}/source-slides/slide-${String(page).padStart(2, "0")}.png`,
        import.meta.url,
      ));
      assert.deepEqual(pngDimensions(sourcePage), { width: 1600, height: 1200 });
    }
  }
});

test("historical teaching meetings expose complete 75-minute timing plans", async () => {
  const [meeting3, meeting4, meeting7, meeting9, meeting12] = await Promise.all(
    [3, 4, 7, 9, 12].map((meeting) => (
      readFile(new URL(`../app/components/Meeting${String(meeting).padStart(2, "0")}Deck.tsx`, import.meta.url), "utf8")
    )),
  );
  const timingArray = (source, constantName) => {
    const match = source.match(new RegExp(`const ${constantName} = \\[([^\\]]+)\\] as const;`));
    assert.ok(match, `${constantName} should be present`);
    return [...match[1].matchAll(/\d+/g)].map((item) => Number(item[0]));
  };
  const meeting3Timing = timingArray(meeting3, "MEETING_03_TIMING");
  const meeting4Timing = timingArray(meeting4, "MEETING_04_TIMING");
  assert.equal(meeting3Timing.length, 27);
  assert.equal(meeting4Timing.length, 28);
  assert.equal(meeting3Timing.reduce((total, minutes) => total + minutes, 0), 75);
  assert.equal(meeting4Timing.reduce((total, minutes) => total + minutes, 0), 75);

  for (const [meeting, source] of [[7, meeting7], [9, meeting9], [12, meeting12]]) {
    const minutes = [...source.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
      .map((match) => Number(match[1]));
    assert.equal(minutes.length, 25, `Meeting ${meeting} should time all 25 pages`);
    assert.equal(minutes.reduce((total, value) => total + value, 0), 75);
  }
});

test("Meeting 5 accounts for every authoritative L03 source slide and image", async () => {
  const [meeting5, manifestText] = await Promise.all([
    readFile(new URL("../app/components/Meeting05Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l03-heuristic-local-search/manifest.json", import.meta.url), "utf8"),
  ]);
  const coverage = [...new Set(
    [...meeting5.matchAll(/sourceSlides:\s*\[([^\]]+)\]/g)]
      .flatMap((match) => [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0]))),
  )].sort((a, b) => a - b);
  assert.equal((meeting5.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.deepEqual(coverage, Array.from({ length: 31 }, (_, index) => index + 1));
  for (const knowledgePoint of [
    "combinatorial explosion",
    "Most winning opportunities",
    "nearest-neighbor",
    "misplaced tiles",
    "Manhattan",
    "first-choice hill climbing",
    "local maximum",
    "plateau",
    "shoulder",
    "simulated annealing",
    "0.0067",
    "George F. Luger",
  ]) {
    assert.match(meeting5, new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.doesNotMatch(meeting5, /\b(?:original|old)\s+slides?\b/i);

  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.authoritativeSlideCount, 31);
  assert.equal(manifest.sourceSha256, "B076CF24F606F0730E0BCC362F0C9ED0369591C3F91BEC4C1020BB996B2CB4F5");
  assert.deepEqual(
    [...new Set(Object.values(manifest.meetingCoverage).flat())].sort((a, b) => a - b),
    Array.from({ length: 31 }, (_, index) => index + 1),
  );
  assert.equal(manifest.assets.length, 13);
  for (const asset of manifest.assets) {
    await access(new URL(`../public/course-source/l03-heuristic-local-search/${asset.file}`, import.meta.url));
    assert.match(meeting5, new RegExp(asset.file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Meeting 6 accounts for every authoritative L04 source slide and image", async () => {
  const [meeting6, manifestText] = await Promise.all([
    readFile(new URL("../app/components/Meeting06Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l04-best-first-astar/manifest.json", import.meta.url), "utf8"),
  ]);
  const coverage = [...new Set(
    [...meeting6.matchAll(/sourceSlides:\s*\[([^\]]+)\]/g)]
      .flatMap((match) => [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0]))),
  )].sort((a, b) => a - b);
  assert.equal((meeting6.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.deepEqual(coverage, Array.from({ length: 22 }, (_, index) => index + 1));
  for (const knowledgePoint of [
    "Greedy best-first",
    "Open",
    "Closed",
    "priority queue",
    "A\\*",
    "admissib",
    "consisten",
    "reopen",
    "more informed",
    "Dijkstra",
    "George F. Luger",
  ]) {
    assert.match(meeting6, new RegExp(knowledgePoint, "i"));
  }
  assert.doesNotMatch(meeting6, /\b(?:original|old)\s+slides?\b/i);

  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.authoritativeSlideCount, 22);
  assert.equal(manifest.sourceSha256, "4B0A102995BD6FC150DA56864CB7B16E371010B048E7C511D2288E775B6C84A0");
  assert.deepEqual(
    [...new Set(Object.values(manifest.meetingCoverage).flat())].sort((a, b) => a - b),
    Array.from({ length: 22 }, (_, index) => index + 1),
  );
  assert.equal(manifest.assets.length, 15);
  for (const asset of manifest.assets) {
    await access(new URL(`../public/course-source/l04-best-first-astar/${asset.file}`, import.meta.url));
    assert.match(meeting6, new RegExp(asset.file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Meetings 7 and 8 account for every authoritative L05 source slide and image", async () => {
  const [meeting7, meeting8, manifestText] = await Promise.all([
    readFile(new URL("../app/components/Meeting07Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting08Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l05-minimax-pruning/manifest.json", import.meta.url), "utf8"),
  ]);
  const extractCoverage = (source) => [...source.matchAll(/sourceSlides:\s*\[([^\]]+)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0])));
  const meeting7Coverage = [...new Set(extractCoverage(meeting7))].sort((a, b) => a - b);
  const meeting8Coverage = [...new Set(extractCoverage(meeting8))].sort((a, b) => a - b);
  assert.equal((meeting7.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.equal((meeting8.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.deepEqual(meeting7Coverage, Array.from({ length: 16 }, (_, index) => index + 1));
  assert.deepEqual(meeting8Coverage, Array.from({ length: 15 }, (_, index) => index + 17));
  assert.deepEqual(
    [...new Set([...meeting7Coverage, ...meeting8Coverage])].sort((a, b) => a - b),
    Array.from({ length: 31 }, (_, index) => index + 1),
  );

  const combined = `${meeting7}\n${meeting8}`;
  for (const knowledgePoint of [
    "Game playing",
    "strategy game",
    "unpredictable opponent",
    "Game theory",
    "zero-sum",
    "Minimax",
    "best worst-case backed-up utility",
    "MAX",
    "MIN",
    "terminal utility",
    "evaluation function",
    "ply",
    "E(n) = M(n) − O(n)",
    "alpha-beta",
    "beta cutoff",
    "alpha cutoff",
    "same minimax result",
    "move ordering",
    "full minimax",
    "expectimax",
    "Monte Carlo Tree Search",
    "George F. Luger",
  ]) {
    assert.match(combined, new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.doesNotMatch(combined, /\b(?:original|old)\s+slides?\b/i);

  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.authoritativeSlideCount, 31);
  assert.equal(manifest.sourceSha256, "19D492F9B7A4F24CB410B0744026D0597B128C5FA3A4AB06AD525582EC4B9A51");
  assert.deepEqual(manifest.meetingCoverage["7"], Array.from({ length: 16 }, (_, index) => index + 1));
  assert.deepEqual(manifest.meetingCoverage["8"], Array.from({ length: 15 }, (_, index) => index + 17));
  assert.deepEqual(
    [...new Set(Object.values(manifest.meetingCoverage).flat())].sort((a, b) => a - b),
    Array.from({ length: 31 }, (_, index) => index + 1),
  );
  assert.equal(manifest.assets.length, 15);
  for (const asset of manifest.assets) {
    await access(new URL(`../public/course-source/l05-minimax-pruning/${asset.file}`, import.meta.url));
    assert.match(combined, new RegExp(asset.file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Meetings 9 and 10 preserve the complete L11 deck and selected L12 evidence package", async () => {
  const [deckShell, meeting9, meeting10, l11ManifestText, l12ManifestText] = await Promise.all([
    readFile(new URL("../app/components/L01DeckShell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting09Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting10Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l11-probability-bayes/manifest.json", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l12-conditional-independence/manifest.json", import.meta.url), "utf8"),
  ]);

  const extractCoverage = (source) => [...source.matchAll(/sourceSlides:\s*\[([^\]]*)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0])));
  const meeting9Coverage = [...new Set(extractCoverage(meeting9))].sort((a, b) => a - b);
  const meeting10Coverage = [...new Set(extractCoverage(meeting10))].sort((a, b) => a - b);
  const meeting10L11Coverage = meeting10Coverage.filter((slide) => slide >= 35);
  const meeting10L12Coverage = meeting10Coverage.filter((slide) => slide >= 3 && slide <= 11);
  const l12Coverage = [...new Set(
    [...meeting10.matchAll(/data-l12-source-slide="(\d+)"/g)].map((match) => Number(match[1])),
  )].sort((a, b) => a - b);
  const allL11Slides = Array.from({ length: 44 }, (_, index) => index + 1);
  const expectedMeeting9 = allL11Slides.slice(0, 34);
  const expectedMeeting10 = allL11Slides.slice(34);
  const expectedL12Slides = Array.from({ length: 9 }, (_, index) => index + 3);

  assert.equal((meeting9.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.equal((meeting10.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.deepEqual(meeting9Coverage, expectedMeeting9);
  assert.deepEqual(meeting10L11Coverage, expectedMeeting10);
  assert.deepEqual(meeting10L12Coverage, expectedL12Slides);
  assert.deepEqual(
    [...new Set([...meeting9Coverage, ...meeting10L11Coverage])].sort((a, b) => a - b),
    allL11Slides,
  );
  assert.deepEqual(l12Coverage, expectedL12Slides);

  assert.match(deckShell, /resolveSourceReference\?: \(sourceSlide: number\) => CourseSourceReference/);
  assert.match(deckShell, /const sourceReferenceResolver = resolveSourceReference \?\?/);
  assert.match(deckShell, /\? resolveL01SourceReference/);
  assert.match(meeting9, /resolveSourceReference=\{resolveMeeting09SourceReference\}/);
  assert.match(meeting10, /resolveSourceReference=\{resolveMeeting10SourceReference\}/);
  assert.match(meeting9, /\/course-source\/l11-probability-bayes/);
  assert.match(meeting10, /\/course-source\/l11-probability-bayes\/slide-renders/);
  assert.match(meeting10, /\/course-source\/l12-conditional-independence\/slide-renders/);
  assert.doesNotMatch(`${meeting9}\n${meeting10}`, /\/course-source\/l01-ai/);

  for (const slide of expectedMeeting10) {
    assert.match(meeting10, new RegExp(`file="slide-${String(slide).padStart(2, "0")}\\.png"`));
    await access(new URL(
      `../public/course-source/l11-probability-bayes/slide-renders/slide-${String(slide).padStart(2, "0")}.png`,
      import.meta.url,
    ));
  }
  for (const slide of expectedL12Slides) {
    const padded = String(slide).padStart(2, "0");
    assert.match(meeting10, new RegExp(`data-l12-source-slide="${slide}"[\\s\\S]*?file="slide-${padded}\\.png"`));
    await access(new URL(
      `../public/course-source/l12-conditional-independence/slide-renders/slide-${padded}.png`,
      import.meta.url,
    ));
  }

  const combined = `${meeting9}\n${meeting10}`;
  for (const knowledgePoint of [
    "Random variables name uncertain aspects",
    "joint distribution",
    "marginal distribution",
    "Conditional probability",
    "Normalization trick",
    "Product rule",
    "Chain rule",
    "Bayes' rule",
    "Total probability",
    "MAP versus maximum likelihood",
    "Independence means learning Y",
    "Conditional independence",
    "directed acyclic graph",
    "Bayesian network is a DAG",
    "explaining away",
    "Enumeration sums hidden assignments",
    "Naive Bayes",
    "probabilistic finite-state acceptor",
    "Speech recognition",
    "George F. Luger",
    "Stuart Russell and Peter Norvig",
  ]) {
    assert.match(combined, new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.doesNotMatch(combined, /\b(?:original|old)\s+slides?\b/i);

  const l11 = JSON.parse(l11ManifestText);
  assert.equal(l11.schemaVersion, 2);
  assert.equal(l11.source, "L11_stochasticmethods - Part A.pptx");
  assert.equal(l11.sourceFilename, "L11_stochasticmethods - Part A.pptx");
  assert.equal(l11.sourceSha256, "67D4E1B41ADD343BAF347DCE9945AF978E3833B441A9F4E81377E0A82DEB7C6C");
  assert.equal(l11.sourceBytes, 2054793);
  assert.equal(l11.authoritativeSlideCount, 44);
  assert.deepEqual(l11.sourcePage, { widthPoints: 720, heightPoints: 540, aspectRatio: "4:3" });
  assert.deepEqual(l11.meetingCoverage["9"], expectedMeeting9);
  assert.deepEqual(l11.meetingCoverage["10"], expectedMeeting10);
  assert.deepEqual(
    l11.slideToMeeting,
    Object.fromEntries(allL11Slides.map((slide) => [String(slide), slide <= 34 ? 9 : 10])),
  );
  assert.deepEqual(
    [...new Set(Object.values(l11.meetingCoverage).flat())].sort((a, b) => a - b),
    allL11Slides,
  );
  assert.equal(l11.slides.length, 44);
  assert.deepEqual(l11.renderProvenance.dimensions, { width: 1600, height: 1200 });
  assert.equal(l11.auditSummary.fullSlideRenders, 44);
  assert.deepEqual(l11.auditSummary.renderDimensions, { width: 1600, height: 1200 });
  assert.equal(l11.auditSummary.embeddedMediaFiles, 105);
  assert.equal(l11.auditSummary.oleEmbeddingFiles, 3);
  assert.deepEqual(
    l11.auditSummary.speakerNoteSlides,
    [7, 10, 12, 15, 19, 20, 22, 25, 28, 31, 32, 34, 37, 40, 41, 42],
  );
  assert.deepEqual(
    l11.auditSummary.nativeTimingSlides,
    [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 24, 27, 30, 35],
  );
  assert.deepEqual(l11.auditSummary.nativeBuildSlides, [6, 11, 12, 14, 16, 27, 30]);
  assert.equal(l11.sourceCorrectionLedger.length, 11);

  for (const [index, slideRecord] of l11.slides.entries()) {
    const slide = index + 1;
    const expectedFile = `slide-renders/slide-${String(slide).padStart(2, "0")}.png`;
    assert.equal(slideRecord.slide, slide);
    assert.equal(slideRecord.meeting, slide <= 34 ? 9 : 10);
    assert.equal(slideRecord.render.file, expectedFile);
    assert.deepEqual(slideRecord.render.dimensions, { width: 1600, height: 1200 });
    assert.deepEqual(slideRecord.render.requestedDimensions, { width: 1600, height: 1200 });
    const renderContent = await readFile(
      new URL(`../public/course-source/l11-probability-bayes/${expectedFile}`, import.meta.url),
    );
    assert.equal(renderContent.length, slideRecord.render.bytes);
    assert.equal(sha256(renderContent), slideRecord.render.sha256);
    assert.deepEqual(pngDimensions(renderContent), { width: 1600, height: 1200 });
  }

  assert.equal(l11.rawMedia.length, 105);
  for (const media of l11.rawMedia) {
    const mediaContent = await readFile(
      new URL(`../public/course-source/l11-probability-bayes/${media.file}`, import.meta.url),
    );
    assert.equal(mediaContent.length, media.bytes);
    assert.equal(sha256(mediaContent), media.sha256);
    assert.ok(media.sourceRelationships.length > 0, `${media.file} must retain a source relationship`);
    for (const relationship of media.sourceRelationships) {
      assert.ok(
        allL11Slides.includes(relationship.slide),
        `${media.file} has an out-of-range source slide`,
      );
    }
  }
  assert.equal(l11.embeddings.length, 3);
  for (const embedding of l11.embeddings) {
    const embeddingContent = await readFile(
      new URL(`../public/course-source/l11-probability-bayes/${embedding.file}`, import.meta.url),
    );
    assert.equal(embeddingContent.length, embedding.bytes);
    assert.equal(sha256(embeddingContent), embedding.sha256);
    assert.ok(embedding.sourceRelationships.length > 0);
  }

  const l12 = JSON.parse(l12ManifestText);
  assert.equal(l12.schemaVersion, 2);
  assert.equal(l12.source, "L12_StochasticMethods - Part B.pptx");
  assert.equal(l12.sourceFilename, "L12_StochasticMethods - Part B.pptx");
  assert.equal(l12.sourceSha256, "3728337B4AB2FC532B1C332B9C6A21F0C01A2345CE4F83A0E71FE01A5882E737");
  assert.equal(l12.authoritativeSlideCount, 53);
  assert.deepEqual(l12.selectedSlides, expectedL12Slides);
  assert.deepEqual(l12.intendedMeetings, [9, 10]);
  assert.equal(l12.slideInventory.length, 9);
  assert.equal(l12.rawMediaFiles.length, 30);
  assert.deepEqual(l12.auditSummary.slidesWithNotes, [8]);
  assert.deepEqual(l12.auditSummary.slidesWithNonemptyNotes, []);
  assert.deepEqual(l12.auditSummary.slidesWithNativeTiming, [3, 4, 7, 10]);
  assert.equal(l12.auditSummary.renderCount, 9);
  assert.deepEqual(l12.auditSummary.renderDimensions, { width: 1600, height: 1200 });
  assert.deepEqual(l12.timingInventory.nativeTimingSlides, [3, 4, 7, 10]);
  assert.equal(l12.sourceCorrectionLedger.length, 4);

  for (const [index, slideRecord] of l12.slideInventory.entries()) {
    const slide = expectedL12Slides[index];
    const expectedFile = `slide-renders/slide-${String(slide).padStart(2, "0")}.png`;
    assert.equal(slideRecord.slide, slide);
    assert.equal(slideRecord.render.file, expectedFile);
    assert.deepEqual(slideRecord.render.dimensions, { width: 1600, height: 1200 });
    const renderContent = await readFile(
      new URL(`../public/course-source/l12-conditional-independence/${expectedFile}`, import.meta.url),
    );
    assert.equal(renderContent.length, slideRecord.render.bytes);
    assert.equal(sha256(renderContent), slideRecord.render.sha256);
    assert.deepEqual(pngDimensions(renderContent), { width: 1600, height: 1200 });
  }

  const l12Media = new Map(l12.rawMediaFiles.map((media) => [media.file, media]));
  for (const media of l12.rawMediaFiles) {
    const mediaContent = await readFile(
      new URL(`../public/course-source/l12-conditional-independence/${media.file}`, import.meta.url),
    );
    assert.equal(mediaContent.length, media.bytes);
    assert.equal(sha256(mediaContent), media.sha256);
    assert.ok(media.sourceRelationships.length > 0, `${media.file} must retain a source relationship`);
    assert.ok(media.sourceSlides.every((slide) => expectedL12Slides.includes(slide)));
  }
  for (const slideRecord of l12.slideInventory) {
    for (const relationship of slideRecord.mediaRelationships) {
      const media = l12Media.get(relationship.copiedFile);
      assert.ok(media, `${relationship.copiedFile} must exist in the L12 media inventory`);
      assert.equal(relationship.sha256, media.sha256);
      assert.equal(relationship.bytes, media.bytes);
      assert.ok(media.sourceSlides.includes(slideRecord.slide));
    }
  }
});

test("Meetings 11 and 12 preserve their Markov and reinforcement-learning source evidence", async () => {
  const [
    meeting11,
    meeting12,
    mdpManifestText,
    reinforcementManifestText,
  ] = await Promise.all([
    readFile(new URL("../app/components/Meeting11Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting12Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/course-source/l12-mdp/manifest.json", import.meta.url), "utf8"),
    readFile(
      new URL("../public/course-source/l10-reinforcement-learning/manifest.json", import.meta.url),
      "utf8",
    ),
  ]);
  const extractCoverage = (source) => [
    ...new Set(
      [...source.matchAll(/sourceSlides:\s*\[([^\]]*)\]/g)].flatMap((match) =>
        [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0])),
      ),
    ),
  ].sort((a, b) => a - b);
  const expectedMarkovSlides = Array.from({ length: 14 }, (_, index) => index + 12);
  const expectedReinforcementSlides = [30, 32, 33, 36];

  assert.equal((meeting11.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.equal((meeting12.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.deepEqual(extractCoverage(meeting11), expectedMarkovSlides);
  assert.deepEqual(extractCoverage(meeting12), expectedReinforcementSlides);
  assert.match(meeting11, /\/course-source\/l12-mdp\/slide-renders/);
  assert.match(meeting12, /\/course-source\/l10-reinforcement-learning/);
  assert.match(meeting12, /source-slides\/slide-/);
  assert.match(meeting11, /resolveSourceReference=/);
  assert.match(meeting12, /resolveSourceReference=\{resolveMeeting12SourceReference\}/);
  assert.doesNotMatch(`${meeting11}\n${meeting12}`, /\/course-source\/l01-ai/);

  for (const knowledgePoint of [
    "Markov chain",
    "transition matrix",
    "stationary distribution",
    "Markov decision process",
    "policy",
    "discount",
    "Bellman",
    "value iteration",
    "trial and error",
    "return",
    "Q-learning",
    "ε-greedy",
    "off-policy",
    "SARSA",
  ]) {
    assert.match(
      `${meeting11}\n${meeting12}`,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  assert.doesNotMatch(`${meeting11}\n${meeting12}`, /\b(?:original|old)\s+slides?\b/i);

  const mdpManifest = JSON.parse(mdpManifestText);
  assert.equal(mdpManifest.schemaVersion, 2);
  assert.equal(mdpManifest.source, "L12_StochasticMethods - Part B.pptx");
  assert.equal(
    mdpManifest.sourceSha256,
    "3728337B4AB2FC532B1C332B9C6A21F0C01A2345CE4F83A0E71FE01A5882E737",
  );
  assert.equal(mdpManifest.sourceBytes, 5417912);
  assert.equal(mdpManifest.authoritativeSlideCount, 53);
  assert.deepEqual(mdpManifest.selectedSlides, expectedMarkovSlides);
  assert.deepEqual(mdpManifest.meetingCoverage["11"], expectedMarkovSlides);
  assert.equal(mdpManifest.renderProvenance.count, 14);
  assert.equal(mdpManifest.selectedMedia.count, 46);
  assert.equal(mdpManifest.sourceCorrectionLedger.length, 19);
  for (const render of mdpManifest.renderProvenance.renders) {
    const renderContent = await readFile(
      new URL(`../public/course-source/l12-mdp/slide-renders/${render.file}`, import.meta.url),
    );
    assert.equal(renderContent.length, render.bytes);
    assert.equal(sha256(renderContent), render.sha256);
    assert.deepEqual(pngDimensions(renderContent), { width: 1600, height: 1200 });
  }
  for (const file of mdpManifest.selectedMedia.files) {
    await access(new URL(`../public/course-source/l12-mdp/media/${file}`, import.meta.url));
  }

  const reinforcementManifest = JSON.parse(reinforcementManifestText);
  assert.equal(reinforcementManifest.schemaVersion, 2);
  assert.equal(reinforcementManifest.source, "L10_MachineLearning Part B.pptx");
  assert.equal(
    reinforcementManifest.sourceSha256,
    "AFB85A8365CF49BAC114D362E78552503A1D771F84B6FA85A0D0827775FADC7D",
  );
  assert.equal(reinforcementManifest.sourceBytes, 963006);
  assert.equal(reinforcementManifest.authoritativeSlideCount, 36);
  assert.deepEqual(reinforcementManifest.selectedSlides, expectedReinforcementSlides);
  assert.deepEqual(reinforcementManifest.meetingCoverage["12"], expectedReinforcementSlides);
  assert.equal(reinforcementManifest.renderProvenance.count, 4);
  assert.equal(reinforcementManifest.assets.length, 1);
  assert.equal(reinforcementManifest.sourceCorrectionLedger.length, 4);
  for (const render of reinforcementManifest.renderProvenance.renders) {
    const renderContent = await readFile(
      new URL(
        `../public/course-source/l10-reinforcement-learning/source-slides/${render.file}`,
        import.meta.url,
      ),
    );
    assert.equal(renderContent.length, render.bytes);
    assert.equal(sha256(renderContent), render.sha256);
    assert.deepEqual(pngDimensions(renderContent), { width: 1600, height: 1200 });
  }
  for (const asset of reinforcementManifest.assets) {
    const assetContent = await readFile(
      new URL(
        `../public/course-source/l10-reinforcement-learning/${asset.file}`,
        import.meta.url,
      ),
    );
    assert.equal(assetContent.length, asset.bytes);
    assert.equal(sha256(assetContent), asset.sha256);
  }
});

test("Meetings 13–15 preserve concept learning, ID3, ensembles, and supervised evaluation", async () => {
  const [meeting13, meeting14, meeting15, manifestText, inventoryContent] = await Promise.all([
    readFile(new URL("../app/components/Meeting13Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting14Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting15Deck.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../public/course-source/l09-machine-learning-part-a/manifest.json", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../public/course-source/l09-machine-learning-part-a/source-inventory.json",
        import.meta.url,
      ),
    ),
  ]);
  const extractCoverage = (source) => [
    ...new Set(
      [...source.matchAll(/sourceSlides:\s*\[([^\]]*)\]/g)].flatMap((match) =>
        [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0])),
      ),
    ),
  ].sort((a, b) => a - b);
  const expectedMeeting13 = Array.from({ length: 19 }, (_, index) => index + 1);
  const expectedMeeting14 = Array.from({ length: 16 }, (_, index) => index + 20);
  const expectedMeeting15 = Array.from({ length: 5 }, (_, index) => index + 36);

  assert.equal((meeting13.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.equal((meeting14.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.equal((meeting15.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.deepEqual(extractCoverage(meeting13), expectedMeeting13);
  assert.deepEqual(extractCoverage(meeting14), expectedMeeting14);
  assert.deepEqual(extractCoverage(meeting15), expectedMeeting15);
  assert.match(meeting13, /resolveSourceReference=\{resolveMeeting13SourceReference\}/);
  assert.match(meeting14, /resolveSourceReference=\{resolveMeeting14SourceReference\}/);
  assert.match(meeting15, /resolveSourceReference=\{resolveMeeting15SourceReference\}/);
  assert.match(meeting13, /\/course-source\/l09-machine-learning-part-a/);
  assert.match(meeting14, /\/course-source\/l09-machine-learning-part-a/);
  assert.match(meeting15, /\/course-source\/l09-machine-learning-part-a/);
  assert.doesNotMatch(`${meeting13}\n${meeting14}\n${meeting15}`, /\b(?:original|old)\s+slides?\b/i);

  for (const knowledgePoint of [
    "Learning is acquiring new knowledge",
    "Any change in a system",
    "Replacing constants with variables",
    "p covers q",
    "Winston",
    "near miss",
    "hill-climbing",
    "Decision Tree Induction",
    "ID3",
    "Minimal Message Length",
    "50 integers",
    "Entropy",
    "Information gain",
    "gain(income)",
    "Class concepts",
    "greedy search",
    "precision",
    "recall",
    "bagging",
    "AdaBoost",
    "Gradient boosting",
    "inductive bias",
    "Supervised learning",
    "cross-validation",
    "Pipeline",
    "leakage",
    "error analysis",
  ]) {
    assert.match(
      `${meeting13}\n${meeting14}\n${meeting15}`,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }

  const manifest = JSON.parse(manifestText);
  const inventory = JSON.parse(inventoryContent.toString("utf8"));
  assert.equal(manifest.schemaVersion, 2);
  assert.equal(manifest.source, "L09_MachineLearning Part A.pptx");
  assert.equal(
    manifest.sourceSha256,
    "F6995BEE122230AF66447C8E09D258CB762DD00FE2DFD6EA91CBD50D5E993296",
  );
  assert.equal(manifest.sourceBytes, 1090966);
  assert.equal(manifest.authoritativeSlideCount, 40);
  assert.deepEqual(manifest.meetingCoverage["13"], expectedMeeting13);
  assert.deepEqual(manifest.meetingCoverage["14"], expectedMeeting14);
  assert.deepEqual(manifest.meetingCoverage["15"], expectedMeeting15);
  assert.equal(manifest.sourceSlideEvidence.length, 40);
  assert.equal(manifest.assets.length, 21);
  assert.equal(manifest.sourceCorrectionLedger.length, 10);
  assert.equal(manifest.auditSummary.fullSlideRenders, 40);
  assert.deepEqual(manifest.auditSummary.renderDimensions, {
    width: 1600,
    height: 1200,
  });
  assert.equal(sha256(inventoryContent), manifest.inventoryProvenance.sha256);
  assert.equal(inventory.slideCount, 40);
  assert.equal(inventory.mediaCount, 21);

  for (const slideRecord of manifest.sourceSlideEvidence) {
    assert.ok(slideRecord.render, `Source page ${slideRecord.slide} must have a render`);
    const renderContent = await readFile(
      new URL(
        `../public/course-source/l09-machine-learning-part-a/${slideRecord.render.file}`,
        import.meta.url,
      ),
    );
    assert.equal(renderContent.length, slideRecord.render.bytes);
    assert.equal(sha256(renderContent), slideRecord.render.sha256);
    assert.deepEqual(pngDimensions(renderContent), { width: 1600, height: 1200 });
  }
  for (const asset of manifest.assets) {
    const assetContent = await readFile(
      new URL(
        `../public/course-source/l09-machine-learning-part-a/${asset.file}`,
        import.meta.url,
      ),
    );
    assert.equal(assetContent.length, asset.bytes);
    assert.equal(sha256(assetContent), asset.sha256);
    assert.ok(asset.sourceSlides.length > 0);
  }
});

test("Meetings 17 and 18 preserve the neural-network sequence and modern training laboratory", async () => {
  const [meeting17, meeting18, manifestText, inventoryContent] = await Promise.all([
    readFile(new URL("../app/components/Meeting17Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting18Deck.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../public/course-source/l10-neural-networks/manifest.json", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../public/course-source/l10-neural-networks/source-inventory.json", import.meta.url),
    ),
  ]);
  const extractCoverage = (source) => [
    ...new Set(
      [...source.matchAll(/sourceSlides:\s*\[([^\]]*)\]/g)].flatMap((match) =>
        [...match[1].matchAll(/\d+/g)].map((number) => Number(number[0])),
      ),
    ),
  ].sort((a, b) => a - b);
  const expectedMeeting17 = [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13];
  const expectedMeeting18 = [14, 15, 16, 17, 18, 19, 36];

  assert.equal((meeting17.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.equal((meeting18.match(/sourceSlides:\s*\[/g) ?? []).length, 25);
  assert.deepEqual(extractCoverage(meeting17), expectedMeeting17);
  assert.deepEqual(extractCoverage(meeting18), expectedMeeting18);
  assert.match(meeting17, /resolveSourceReference=\{resolveMeeting17SourceReference\}/);
  assert.match(meeting18, /resolveSourceReference=\{resolveMeeting18SourceReference\}/);
  assert.match(meeting17, /\/course-source\/l10-neural-networks/);
  assert.match(meeting18, /\/course-source\/l10-neural-networks/);
  assert.doesNotMatch(`${meeting17}\n${meeting18}`, /\b(?:original|old)\s+slides?\b/i);

  for (const knowledgePoint of [
    "McCulloch–Pitts",
    "perceptron",
    "AND",
    "OR",
    "XOR",
    "linear decision boundary",
    "sigmoid",
    "gradient descent",
    "Backpropagation",
    "chain rule",
    "delta rule",
    "autodiff",
    "PyTorch",
    "zero_grad",
    "model.eval",
    "checkpoint",
  ]) {
    assert.match(
      `${meeting17}\n${meeting18}`,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }

  const manifest = JSON.parse(manifestText);
  const inventory = JSON.parse(inventoryContent.toString("utf8"));
  assert.equal(manifest.schemaVersion, 2);
  assert.equal(manifest.source, "L10_MachineLearning Part B.pptx");
  assert.equal(
    manifest.sourceSha256,
    "AFB85A8365CF49BAC114D362E78552503A1D771F84B6FA85A0D0827775FADC7D",
  );
  assert.equal(manifest.sourceBytes, 963006);
  assert.equal(manifest.authoritativeSlideCount, 36);
  assert.deepEqual(manifest.meetingCoverage["17"], expectedMeeting17);
  assert.deepEqual(manifest.meetingCoverage["18"], expectedMeeting18);
  assert.equal(manifest.sourceSlideEvidence.length, 18);
  assert.equal(manifest.assets.length, 24);
  assert.equal(manifest.sourceCorrectionLedger.length, 12);
  assert.equal(manifest.auditSummary.selectedRenderCount, 18);
  assert.deepEqual(manifest.auditSummary.renderDimensions, {
    width: 1600,
    height: 1200,
  });
  assert.equal(sha256(inventoryContent), manifest.inventoryProvenance.sha256);
  assert.equal(inventory.slideCount, 36);
  assert.equal(inventory.mediaCount, 29);

  for (const slideRecord of manifest.sourceSlideEvidence) {
    assert.ok(slideRecord.render, `Source page ${slideRecord.slide} must have a render`);
    const renderContent = await readFile(
      new URL(
        `../public/course-source/l10-neural-networks/${slideRecord.render.file}`,
        import.meta.url,
      ),
    );
    assert.equal(renderContent.length, slideRecord.render.bytes);
    assert.equal(sha256(renderContent), slideRecord.render.sha256);
    assert.deepEqual(pngDimensions(renderContent), { width: 1600, height: 1200 });
  }
  for (const asset of manifest.assets) {
    const assetContent = await readFile(
      new URL(
        `../public/course-source/l10-neural-networks/${asset.file}`,
        import.meta.url,
      ),
    );
    assert.equal(assetContent.length, asset.bytes);
    assert.equal(sha256(assetContent), asset.sha256);
    assert.ok(asset.sourceSlides.length > 0);
  }
});

test("Meeting 16 provides a secure, cumulative, 75-minute public assessment review", async () => {
  const meeting16 = await readFile(
    new URL("../app/components/Meeting16Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting16.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting16.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting16.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting16, /\b(?:original|old)\s+slides?\b/i);
  assert.doesNotMatch(meeting16, /solution key/i);
  for (const knowledgePoint of [
    "rational",
    "task environment",
    "A*",
    "alpha-beta",
    "Bayes rule",
    "Bellman",
    "Q-learning",
    "data leakage",
    "information gain",
    "accessibility",
    "integrity",
    "Canvas",
  ]) {
    assert.match(
      meeting16,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("Meetings 19 and 20 provide two complete primary-source transformer and LLM lessons", async () => {
  const [meeting19, meeting20] = await Promise.all([
    readFile(new URL("../app/components/Meeting19Deck.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Meeting20Deck.tsx", import.meta.url), "utf8"),
  ]);
  for (const [meeting, source] of [[19, meeting19], [20, meeting20]]) {
    assert.equal(
      (source.match(/sourceSlides:\s*\[\]/g) ?? []).length,
      25,
      `Meeting ${meeting} must contain 25 modern lesson pages`,
    );
    assert.equal((source.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
    const minutes = [...source.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
      .reduce((total, match) => total + Number(match[1]), 0);
    assert.equal(minutes, 75, `Meeting ${meeting} must total 75 minutes`);
    assert.doesNotMatch(source, /\b(?:original|old)\s+slides?\b/i);
    assert.match(source, /Current primary-source reading set/);
  }
  for (const knowledgePoint of [
    "BPE",
    "SentencePiece",
    "embedding matrix",
    "positional",
    "query",
    "key",
    "value",
    "QK",
    "scaled",
    "softmax",
    "causal mask",
    "multi-head",
    "residual",
    "normalization",
    "feed-forward",
    "next-token",
    "temperature",
    "scaling laws",
    "instruction tuning",
    "preference",
    "structured output",
    "schema",
    "semantic",
    "hallucination",
    "verification",
    "refuse",
    "escalate",
  ]) {
    assert.match(
      `${meeting19}\n${meeting20}`,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const primarySource of [
    "aclanthology.org/P16-1162",
    "arxiv.org/abs/1808.06226",
    "papers.nips.cc/paper_files/paper/2017",
    "arxiv.org/abs/2001.08361",
    "arxiv.org/abs/2203.02155",
    "aclanthology.org/2022.acl-long.229",
    "openai.com/index/introducing-structured-outputs",
  ]) {
    assert.match(`${meeting19}\n${meeting20}`, new RegExp(primarySource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Meeting 23 provides a complete structured-tool, agent-loop, and MCP lesson", async () => {
  const meeting23 = await readFile(
    new URL("../app/components/Meeting23Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting23.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting23.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting23.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting23, /\b(?:original|old)\s+slides?\b/i);
  assert.match(meeting23, /Current primary-source reading set/);
  for (const knowledgePoint of [
    "structured tool",
    "JSON Schema",
    "syntactic",
    "semantic",
    "authority",
    "agent loop",
    "stop condition",
    "budget",
    "host",
    "client",
    "server",
    "tools",
    "resources",
    "prompts",
    "capabilit",
    "read-only",
    "trace",
  ]) {
    assert.match(
      meeting23,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const primarySource of [
    "modelcontextprotocol.io/docs/learn/architecture",
    "modelcontextprotocol.io/specification/2025-11-25/schema",
    "modelcontextprotocol.io/specification/2025-11-25/server/resources",
    "openai.github.io/openai-agents-js/guides/tools",
  ]) {
    assert.match(
      meeting23,
      new RegExp(primarySource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("Meeting 24 provides a complete harness-state, authority, approval, and evaluation lesson", async () => {
  const meeting24 = await readFile(
    new URL("../app/components/Meeting24Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting24.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting24.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting24.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting24, /\b(?:original|old)\s+slides?\b/i);
  assert.match(meeting24, /Current primary-source reading set/);
  for (const knowledgePoint of [
    "harness",
    "HarnessState",
    "durable",
    "least privilege",
    "scope",
    "approval",
    "single-use",
    "budget",
    "trace",
    "redact",
    "prompt injection",
    "sandbox",
    "secret",
    "idempoten",
    "recovery",
    "evaluation",
    "correctness",
    "release",
  ]) {
    assert.match(
      meeting24,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const primarySource of [
    "modelcontextprotocol.io/specification/2025-11-25/basic/authorization",
    "modelcontextprotocol.io/docs/tutorials/security/security_best_practices",
    "openai.github.io/openai-agents-js/guides/human-in-the-loop",
    "openai.github.io/openai-agents-js/guides/guardrails",
    "openai.github.io/openai-agents-js/guides/tracing",
    "openai.github.io/openai-agents-js/guides/sessions",
  ]) {
    assert.match(
      meeting24,
      new RegExp(primarySource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("Meeting 22 provides a complete RAG evaluation, reliability, and guardrails lesson", async () => {
  const meeting22 = await readFile(
    new URL("../app/components/Meeting22Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting22.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting22.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting22.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting22, /\b(?:original|old)\s+slides?\b/i);
  for (const knowledgePoint of [
    "hybrid",
    "BM25",
    "dense",
    "RRF",
    "metadata",
    "chunk",
    "rerank",
    "lost in the middle",
    "abstain",
    "Recall@5",
    "Precision@5",
    "MRR",
    "grounded",
    "correctness",
    "citation",
    "indirect prompt injection",
    "guardrail",
    "human",
    "escalat",
    "latency",
    "cost",
  ]) {
    assert.match(
      meeting22,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const primarySource of [
    "research.google/pubs/reciprocal-rank-fusion",
    "arxiv.org/abs/2307.03172",
    "aclanthology.org/2024.eacl-demo.16",
    "aclanthology.org/2024.naacl-long.20",
    "arxiv.org/abs/2302.12173",
    "doi.org/10.6028/NIST.AI.600-1",
  ]) {
    assert.match(
      meeting22,
      new RegExp(primarySource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("Meeting 21 provides a complete 75-minute RAG foundations lesson", async () => {
  const meeting21 = await readFile(
    new URL("../app/components/Meeting21Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting21.match(/minutes:\s*\d+/g) ?? []).length, 25);
  const minutes = [...meeting21.matchAll(/minutes:\s*(\d+)/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting21, /\b(?:original|old)\s+slides?\b/i);
  for (const knowledgePoint of [
    "RAG",
    "pipeline",
    "ingestion",
    "parsing",
    "provenance",
    "chunk",
    "overlap",
    "embedding",
    "lexical",
    "vector",
    "hybrid",
    "similarity",
    "index",
    "top-k",
    "query",
    "prompt",
    "citation",
    "retriever",
    "generator",
    "untrusted input",
  ]) {
    assert.match(
      meeting21,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const primarySource of [
    "arxiv.org/abs/2005.11401",
    "aclanthology.org/2020.emnlp-main.550",
    "aclanthology.org/D19-1410",
    "aclanthology.org/2024.eacl-demo.16",
  ]) {
    assert.match(
      meeting21,
      new RegExp(primarySource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("AAB participation is concentrated in Week 13 Meetings 25 and 26", async () => {
  const meetingsWithAab = [];
  for (let meeting = 1; meeting <= 30; meeting += 1) {
    const source = await readFile(
      new URL(`../app/components/Meeting${String(meeting).padStart(2, "0")}Deck.tsx`, import.meta.url),
      "utf8",
    );
    if (/\bAAB\b|AABoard|aaboard/i.test(source)) meetingsWithAab.push(meeting);
  }
  assert.deepEqual(meetingsWithAab, [25, 26]);
});

test("Meeting 25 provides a complete AAB research-evidence practicum and publication guardrails", async () => {
  const meeting25 = await readFile(
    new URL("../app/components/Meeting25Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting25.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting25.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting25.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting25, /\b(?:original|old)\s+slides?\b/i);
  assert.match(meeting25, /Current AAB and scholarly-source reading set/);
  for (const knowledgePoint of [
    "candidate contribution",
    "not endorse",
    "grades never depend",
    "source verification",
    "authorized editorial review",
    "population",
    "study type",
    "peer-reviewed",
    "search record",
    "include",
    "exclude",
    "DOI",
    "methods",
    "causal",
    "uncertainty",
    "limitations",
    "transferability",
    "reviewer inference",
    "unsupported",
    "claim-to-source",
    "field map",
    "reproducible",
    "Accept",
    "Revise",
    "Hold",
    "Reject",
  ]) {
    assert.match(
      meeting25,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const currentSource of [
    "aaboard.org/cases/AAB-CASE-2026-RV-116",
    "aaboard.org/cases/AAB-CASE-2026-RV-065",
    "doi.org/the-identifier/what-is-a-doi",
    "equator-network.org",
  ]) {
    assert.match(
      meeting25,
      new RegExp(currentSource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("Meeting 26 provides a complete AI-literacy explanation and audience-testing practicum", async () => {
  const meeting26 = await readFile(
    new URL("../app/components/Meeting26Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting26.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting26.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting26.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting26, /\b(?:original|old)\s+slides?\b/i);
  assert.doesNotMatch(meeting26, /K[–-]12/i);
  assert.match(meeting26, /Current AI-literacy and communication reading set/);
  for (const knowledgePoint of [
    "nontechnical audiences age five and older",
    "Audience profile",
    "Age 5-7",
    "Teen",
    "Adult",
    "observable objective",
    "cognitive load",
    "causal spine",
    "plain language",
    "analogy",
    "break point",
    "meaning-matched",
    "next-token",
    "retrieval",
    "misconception",
    "Accessibility",
    "Privacy",
    "Safety",
    "Teach-back",
    "Pilot",
    "observed performance",
    "revision",
    "Course grade and publication are separate",
  ]) {
    assert.match(
      meeting26,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const currentSource of [
    "aaboard.org/cases/AAB-CASE-2026-RV-065",
    "udlguidelines.cast.org",
    "w3.org/WAI/tutorials/images",
    "ahrq.gov/health-literacy/improve/precautions/tool5",
  ]) {
    assert.match(
      meeting26,
      new RegExp(currentSource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("Meeting 27 provides a complete claim, baseline, evaluation-set, testing, and system-card studio", async () => {
  const meeting27 = await readFile(
    new URL("../app/components/Meeting27Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting27.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting27.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting27.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting27, /\b(?:original|old)\s+slides?\b/i);
  assert.match(meeting27, /Historical capstone requirements and current engineering practice/);
  for (const knowledgePoint of [
    "bounded problem",
    "intended use",
    "excluded use",
    "falsifi",
    "disconfirm",
    "baseline",
    "ablation",
    "evaluation set",
    "version",
    "typical",
    "difficult",
    "edge",
    "adversarial",
    "unanswerable",
    "leakage",
    "quantitative",
    "qualitative",
    "unit",
    "integration",
    "task",
    "misuse",
    "regression",
    "uncertainty",
    "error",
    "reproducib",
    "dependencies",
    "third-party",
    "license",
    "individual contribution",
    "system card",
  ]) {
    assert.match(
      meeting27,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const currentSource of [
    "doi.org/10.1145/3287560.3287596",
    "doi.org/10.1145/3458723",
    "doi.org/10.6028/NIST.AI.600-1",
    "research.google/pubs/the-ml-test-score",
  ]) {
    assert.match(
      meeting27,
      new RegExp(currentSource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("Meeting 28 provides a complete peer-testing, red-team, revision, and regression studio", async () => {
  const meeting28 = await readFile(
    new URL("../app/components/Meeting28Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting28.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting28.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting28.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting28, /\b(?:original|old)\s+slides?\b/i);
  assert.match(meeting28, /Capstone studio protocol and current testing practice/);
  for (const knowledgePoint of [
    "reproducib",
    "protocol",
    "participant",
    "environment",
    "expected behavior",
    "actual behavior",
    "trace",
    "task success",
    "confusion",
    "recovery",
    "think-aloud",
    "coaching",
    "model",
    "interface",
    "instruction",
    "task definition",
    "red-team",
    "prompt injection",
    "unsupported",
    "unsafe action",
    "privacy",
    "authorization",
    "severity",
    "likelihood",
    "reproducib",
    "defect",
    "limitation",
    "misuse",
    "out-of-scope",
    "one variable",
    "regression",
    "decision log",
    "residual",
    "disclosure",
  ]) {
    assert.match(
      meeting28,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
  for (const currentSource of [
    "nist.gov/publications/adversarial-machine-learning-taxonomy",
    "airc.nist.gov/airmf-resources/airmf/5-sec-core",
    "cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention",
  ]) {
    assert.match(
      meeting28,
      new RegExp(currentSource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
});

test("Meeting 29 provides a complete ten-minute capstone demonstration and individual defense", async () => {
  const meeting29 = await readFile(
    new URL("../app/components/Meeting29Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting29.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting29.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting29.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting29, /\b(?:original|old)\s+slides?\b/i);
  assert.match(meeting29, /Historical demonstration requirements and revised capstone evidence/);
  for (const knowledgePoint of [
    "10-minute limit",
    "1:00",
    "3:00",
    "6:00",
    "8:00",
    "9:00",
    "Architecture",
    "contribution",
    "Live success",
    "trace",
    "Baseline",
    "evaluation",
    "honest failure",
    "limitations",
    "oversight",
    "recommendation",
    "preflight",
    "fallback",
    "accessibility",
    "Peer evaluation",
    "Novelty",
    "instructor evaluates technical correctness",
    "individual defense",
    "explain",
    "end-to-end",
    "justify",
    "diagnos",
    "dependency",
    "reused",
  ]) {
    assert.match(
      meeting29,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("Meeting 30 provides a complete public course synthesis and final review", async () => {
  const meeting30 = await readFile(
    new URL("../app/components/Meeting30Deck.tsx", import.meta.url),
    "utf8",
  );
  assert.equal((meeting30.match(/sourceSlides:\s*\[\]/g) ?? []).length, 25);
  assert.equal((meeting30.match(/Timing:\s*\d+\s+minutes?/g) ?? []).length, 25);
  const minutes = [...meeting30.matchAll(/Timing:\s*(\d+)\s+minutes?/g)]
    .reduce((total, match) => total + Number(match[1]), 0);
  assert.equal(minutes, 75);
  assert.doesNotMatch(meeting30, /\b(?:original|old)\s+slides?\b/i);
  assert.doesNotMatch(meeting30, /solution key/i);
  assert.match(meeting30, /Complete course source map and public review set/);
  for (const knowledgePoint of [
    "rational",
    "task environment",
    "performance measure",
    "representation",
    "state space",
    "A*",
    "Bayes",
    "Markov",
    "MDP",
    "RL",
    "objective",
    "data",
    "baseline",
    "leakage",
    "backpropagation",
    "tokens",
    "attention",
    "LLM",
    "RAG",
    "Tools",
    "MCP",
    "harness",
    "permissions",
    "approval",
    "logging",
    "evidence brief",
    "nontechnical",
    "system card",
    "deployment boundary",
    "assumption",
    "misconception",
    "concept map",
    "Accessibility",
    "Integrity",
  ]) {
    assert.match(
      meeting30,
      new RegExp(knowledgePoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});
