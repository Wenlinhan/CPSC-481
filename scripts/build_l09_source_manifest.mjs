import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const packageDir = join(
  process.cwd(),
  "public",
  "course-source",
  "l09-machine-learning-part-a",
);
const inventoryPath = join(packageDir, "source-inventory.json");
const inventoryBytes = readFileSync(inventoryPath);
const inventory = JSON.parse(inventoryBytes.toString("utf8"));
const sourcePptx = process.argv[2];

if (!sourcePptx) {
  throw new Error(
    "Usage: node scripts/build_l09_source_manifest.mjs <path-to-L09-pptx>",
  );
}

const sha256 = (content) =>
  createHash("sha256").update(content).digest("hex").toUpperCase();

const meetingCoverage = {
  13: Array.from({ length: 19 }, (_, index) => index + 1),
  14: Array.from({ length: 16 }, (_, index) => index + 20),
  15: Array.from({ length: 5 }, (_, index) => index + 36),
};

const slideToMeeting = Object.fromEntries(
  Object.entries(meetingCoverage).flatMap(([meeting, slides]) =>
    slides.map((slide) => [slide, Number(meeting)]),
  ),
);

const slideTitle = (slide) =>
  slide.textBlocks.find((text) => text !== String(slide.number)) ??
  `Source slide ${slide.number}`;

const sourceSlideEvidence = inventory.slides.map((slide) => ({
  slide: slide.number,
  meeting: slideToMeeting[slide.number],
  title: slideTitle(slide),
  visibleTextBlocks: slide.textBlocks,
  speakerNotes: slide.notes || null,
  embeddedMedia: slide.media.map((file) => `media/${file}`),
  render: slide.render
    ? {
        file: `slide-renders/${basename(slide.render.file)}`,
        sha256: slide.render.sha256.toUpperCase(),
        bytes: slide.render.bytes,
        dimensions: {
          width: slide.render.width,
          height: slide.render.height,
        },
      }
    : null,
  nativeTiming: slide.timing,
}));

const assets = inventory.media.map((media) => {
  const sourceSlides = inventory.slides
    .filter((slide) => slide.media.includes(media.file))
    .map((slide) => slide.number);
  const sourceTitles = sourceSlides.map(
    (number) => slideTitle(inventory.slides[number - 1]),
  );

  return {
    file: `media/${media.file}`,
    originalFile: media.file,
    archivePath: media.archivePath,
    sha256: media.sha256.toUpperCase(),
    bytes: media.bytes,
    format: media.format,
    dimensions:
      media.width && media.height
        ? { width: media.width, height: media.height }
        : null,
    sourceSlides,
    knowledgeRole:
      sourceTitles.length > 0
        ? `Exact source image used on: ${sourceTitles.join("; ")}.`
        : "Exact embedded source asset retained for provenance.",
    preservation:
      "Copied byte-for-byte from the authoritative PPTX; source dimensions and aspect ratio are unchanged.",
  };
});

const sourceCorrectionLedger = [
  {
    sourceSlides: [7, 40],
    sourceIssue:
      "The historical deck spells George F. Luger's surname as 'Fluger.'",
    correction:
      "Use George F. Luger in the rebuilt meetings while retaining the exact source pages in the evidence viewer.",
  },
  {
    sourceSlides: [13, 16],
    sourceIssue:
      "The source labels all negative examples as 'near misses,' although a near miss is a particularly informative negative example close to the target concept.",
    correction:
      "Distinguish general negative examples from carefully chosen near misses when explaining Winston's program.",
  },
  {
    sourceSlides: [19],
    sourceIssue:
      "The source summarizes Winston's program as hill climbing without backtracking; that is useful historically but not a general account of concept learning.",
    correction:
      "Present this as a limitation of the historical program and connect it to order sensitivity, representation bias, and modern validation.",
  },
  {
    sourceSlides: [21, 25, 35],
    sourceIssue:
      "The source presents ID3 as a greedy search but does not state how unseen values, noisy labels, or overfitting affect the learned tree.",
    correction:
      "Retain the source algorithm and add explicit stopping, default prediction, pruning, and validation considerations.",
  },
  {
    sourceSlides: [28],
    sourceIssue:
      "The set of even integers from 2 through 100 contains 50 integers, not 49 as stated in the source example.",
    correction:
      "Use 50 integers in the rebuilt explanation while preserving the original source page unchanged.",
  },
  {
    sourceSlides: [29, 30, 31],
    sourceIssue:
      "The entropy sequence does not explicitly state the log base, zero-probability convention, or that information gain is biased toward high-cardinality attributes.",
    correction:
      "Use log base 2, define 0 log 0 as 0 by continuity, and identify gain ratio or other controls as later refinements.",
  },
  {
    sourceSlides: [36],
    sourceIssue:
      "The bagging and boosting comparison is compressed enough to suggest that all boosting methods simply assign classifier votes by accuracy.",
    correction:
      "Explain bootstrap aggregation and sequential error-focused boosting separately, naming AdaBoost as one specific weighted-vote method.",
  },
  {
    sourceSlides: [36],
    sourceIssue:
      "The source's divide-build-test wording is closer to a generic holdout procedure than a complete definition of cross-validation.",
    correction:
      "Define train, validation, and test roles and demonstrate k-fold cross-validation without test-set leakage.",
  },
  {
    sourceSlides: [37],
    sourceIssue:
      "The source describes supervised learning as training with positive and negative examples, which is too narrow for multiclass classification and regression.",
    correction:
      "Define supervised learning as learning from labeled input-output pairs, then distinguish binary, multiclass, multilabel, and regression targets.",
  },
  {
    sourceSlides: [39],
    sourceIssue:
      "The source writes 'Principle Component Analysis' and uses several historical category labels that are not standard modern taxonomy.",
    correction:
      "Use Principal Component Analysis and distinguish task, supervision, model family, training mode, and representation as separate classification axes.",
  },
];

const manifest = {
  schemaVersion: 2,
  source: inventory.sourceFilename,
  sourceFilename: inventory.sourceFilename,
  sourceSha256: inventory.sourceSha256.toUpperCase(),
  sourceBytes: statSync(sourcePptx).size,
  authoritativeSlideCount: inventory.slideCount,
  sourcePage: {
    widthPoints: 720,
    heightPoints: 540,
    aspectRatio: "4:3",
  },
  selectedSlides: Array.from(
    { length: inventory.slideCount },
    (_, index) => index + 1,
  ),
  intendedMeetings: [13, 14, 15],
  meetingCoverage,
  slideToMeeting,
  scope:
    "Complete historical Machine Learning Part A deck, partitioned across Meetings 13-15 so that the original ML framing, concept learning, Winston arch example, ID3, entropy, information gain, supervised learning, inductive bias, taxonomy, and references remain teachable.",
  selectionRationale:
    "All 40 slides are instructional evidence. No historical knowledge slide is omitted; modern data-splitting, regression, metrics, pipelines, cross-validation, and error-analysis material must be clearly labeled as textbook or contemporary supplements.",
  knowledgePointGroups: [
    {
      slides: [1, 2, 3, 4, 5, 6, 7],
      meeting: 13,
      topic:
        "Learning, human learning processes, concepts, learning methods, and the historical definition and motivation of machine learning.",
    },
    {
      slides: [8, 9, 10, 11],
      meeting: 13,
      topic:
        "Generalization, specialization, concept spaces, coverage, and learning as search.",
    },
    {
      slides: [12, 13, 14, 15, 16, 17, 18, 19],
      meeting: 13,
      topic:
        "Winston's arch-learning program, positive examples, near misses, semantic-network constraints, and order or data-quality sensitivity.",
    },
    {
      slides: [20, 21, 22, 23, 24, 25, 26, 27, 28],
      meeting: 14,
      topic:
        "Risk classification, decision-tree representation, ID3, recursive induction, simpler trees, and minimum-message-length motivation.",
    },
    {
      slides: [29, 30, 31, 32, 33, 34, 35],
      meeting: 14,
      topic:
        "Entropy, information gain, the loan-risk worked example, tree construction, rule extraction, and greedy concept-space search.",
    },
    {
      slides: [36, 37, 38, 39, 40],
      meeting: 15,
      topic:
        "Decision-tree evaluation, bagging and boosting, supervised-learning workflow, inductive bias, ML taxonomy, and historical references.",
    },
  ],
  auditSummary: {
    auditedSlideCount: inventory.slideCount,
    inventoryTextBlocks: inventory.slides.reduce(
      (sum, slide) => sum + slide.textBlocks.length,
      0,
    ),
    slidesWithSpeakerNotes: inventory.slides
      .filter((slide) => slide.notes)
      .map((slide) => slide.number),
    embeddedMediaFiles: inventory.mediaCount,
    slidesWithEmbeddedMedia: inventory.slides
      .filter((slide) => slide.media.length > 0)
      .map((slide) => slide.number),
    slidesWithTimingParts: inventory.slides
      .filter((slide) => slide.timing.hasTiming)
      .map((slide) => slide.number),
    slidesWithNativeEffects: inventory.slides
      .filter(
        (slide) =>
          slide.timing.effectCount > 0 ||
          slide.timing.visibilitySetCount > 0 ||
          slide.timing.clickEffectCount > 0,
      )
      .map((slide) => slide.number),
    fullSlideRenders: sourceSlideEvidence.filter((slide) => slide.render).length,
    renderDimensions: {
      width: 1600,
      height: 1200,
    },
  },
  inventoryProvenance: {
    file: "source-inventory.json",
    sha256: sha256(inventoryBytes),
    bytes: inventoryBytes.length,
    generator: "scripts/inventory_pptx.py",
  },
  renderProvenance: {
    source:
      "Historical instructor PDF exported from the same L09 PowerPoint deck.",
    renderer: "Poppler pdftoppm at 160 DPI",
    naming: "slide-01.png through slide-40.png",
    dimensions: {
      width: 1600,
      height: 1200,
    },
    preservation:
      "Complete 4:3 pages are retained without cropping so text and images that carry knowledge remain visible together.",
  },
  sourceSlideEvidence,
  extractionPolicy: {
    publicPath:
      "/course-source/l09-machine-learning-part-a/slide-renders/slide-XX.png",
    imagePolicy:
      "Use exact full-page renders in the Course source viewer. If an embedded source image is placed in a redesigned page, preserve its aspect ratio and allow enlargement when labels are small.",
    textPolicy:
      "The searchable inventory is authoritative for exact historical wording; corrections and modern supplements must be visibly distinguished.",
  },
  assets,
  sourceCorrectionLedger,
  modernizationBoundary: [
    "The source does not define train, validation, and test leakage controls.",
    "The source does not teach contemporary classification or regression metrics.",
    "The source does not provide a reproducible software pipeline or cross-validation laboratory.",
    "The source does not cover current fairness, distribution-shift, calibration, or model-card practices.",
    "These additions belong in Meetings 13-15 as explicitly labeled textbook or contemporary supplements.",
  ],
};

writeFileSync(
  join(packageDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
