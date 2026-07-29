import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const packageDir = join(
  process.cwd(),
  "public",
  "course-source",
  "l10-neural-networks",
);
const inventoryPath = join(packageDir, "source-inventory.json");
const inventoryBytes = readFileSync(inventoryPath);
const inventory = JSON.parse(inventoryBytes.toString("utf8"));
const sourcePptx = process.argv[2];

if (!sourcePptx) {
  throw new Error(
    "Usage: node scripts/build_l10_nn_source_manifest.mjs <path-to-L10-pptx>",
  );
}

const sha256 = (content) =>
  createHash("sha256").update(content).digest("hex").toUpperCase();
const meetingCoverage = {
  17: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13],
  18: [14, 15, 16, 17, 18, 19, 36],
};
const selectedSlides = Object.values(meetingCoverage).flat();
const selectedSet = new Set(selectedSlides);
const slideToMeeting = Object.fromEntries(
  Object.entries(meetingCoverage).flatMap(([meeting, slides]) =>
    slides.map((slide) => [slide, Number(meeting)]),
  ),
);
const slideTitle = (slide) =>
  slide.textBlocks.find((text) => text !== String(slide.number)) ??
  `Source slide ${slide.number}`;

const sourceSlideEvidence = inventory.slides
  .filter((slide) => selectedSet.has(slide.number))
  .map((slide) => ({
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

const assets = inventory.media
  .map((media) => {
    const sourceSlides = inventory.slides
      .filter(
        (slide) =>
          selectedSet.has(slide.number) && slide.media.includes(media.file),
      )
      .map((slide) => slide.number);
    return {
      media,
      sourceSlides,
    };
  })
  .filter(({ sourceSlides }) => sourceSlides.length > 0)
  .map(({ media, sourceSlides }) => ({
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
    knowledgeRole: `Exact source image used on ${sourceSlides
      .map((number) => `page ${number}: ${slideTitle(inventory.slides[number - 1])}`)
      .join("; ")}.`,
    preservation:
      "Copied byte-for-byte from the authoritative PPTX; source dimensions and aspect ratio are unchanged.",
  }));

const sourceCorrectionLedger = [
  {
    sourceSlides: [3],
    sourceIssue:
      "The source groups evolutionary adaptation and neural-network optimization together as non-symbolic learning, which can hide important differences in representation and optimization.",
    correction:
      "Retain the historical taxonomy, then distinguish model representation, objective, search or optimizer, and supervision as separate dimensions.",
  },
  {
    sourceSlides: [6, 9],
    sourceIssue:
      "The source repeatedly spells threshold as 'thresh hold' or 'threshhold' and distributes the bias or threshold notation inconsistently.",
    correction:
      "Use one explicit affine form z=w dot x+b, then define the activation and decision threshold consistently.",
  },
  {
    sourceSlides: [7],
    sourceIssue:
      "The McCulloch-Pitts examples can be misread as learning examples even though their weights and thresholds are hand specified.",
    correction:
      "Separate hand-designed logic-gate parameters from the later perceptron learning rule.",
  },
  {
    sourceSlides: [9],
    sourceIssue:
      "The source labels perceptron learning 'Rosenblatt, 1962' without distinguishing the earlier invention and the 1962 book.",
    correction:
      "State that Rosenblatt introduced the perceptron in the late 1950s and published the book Principles of Neurodynamics in 1962.",
  },
  {
    sourceSlides: [10],
    sourceIssue:
      "The source calls the worked perceptron update gradient descent without identifying a differentiable loss or the perceptron criterion.",
    correction:
      "Teach the perceptron mistake-driven update directly and distinguish it from gradient descent on differentiable losses.",
  },
  {
    sourceSlides: [11],
    sourceIssue:
      "The reported convergence after about 500 iterations is specific to the shown data, initialization, learning rate, and ordering.",
    correction:
      "Use the example as one run and state the perceptron convergence guarantee only for linearly separable finite data under its assumptions.",
  },
  {
    sourceSlides: [12],
    sourceIssue:
      "The statement that Minsky and Papert proved a perceptron that solves XOR is impossible is overbroad.",
    correction:
      "State precisely that a single linear threshold unit cannot represent XOR; a multilayer nonlinear network can.",
  },
  {
    sourceSlides: [13],
    sourceIssue:
      "The source describes the sigmoid range as 0 to 1, although the logistic sigmoid has the open range (0,1).",
    correction:
      "Use the open interval (0,1), derive the derivative, and compare sigmoid with modern activation choices.",
  },
  {
    sourceSlides: [14],
    sourceIssue:
      "The source claims backpropagation is proven to converge to the nearest local minimum.",
    correction:
      "Backpropagation computes gradients; optimizer convergence depends on the objective, step sizes, stochasticity, architecture, and other assumptions, and may approach a stationary point rather than a nearest local minimum.",
  },
  {
    sourceSlides: [15, 16, 17, 18],
    sourceIssue:
      "The output-unit delta expression does not by itself explain hidden-layer gradients.",
    correction:
      "Use the chain rule to distinguish output and hidden deltas, then connect the source algorithm to modern reverse-mode automatic differentiation.",
  },
  {
    sourceSlides: [19],
    sourceIssue:
      "The source uses layer count as the main definition of deep learning and compresses neural-network uses into supervised classification and unsupervised clustering.",
    correction:
      "Retain the historical examples while distinguishing topology, objective, data, optimization, and task; include regression, representation learning, and generative uses.",
  },
  {
    sourceSlides: [36],
    sourceIssue:
      "The reference page spells George F. Luger's surname as 'Fluger' and McGraw-Hill as 'McGraw-Hills.'",
    correction:
      "Use George F. Luger and McGraw-Hill in course text while preserving the exact source page in the evidence viewer.",
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
  selectedSlides,
  intendedMeetings: [17, 18],
  meetingCoverage,
  slideToMeeting,
  scope:
    "Historical neural-network evidence from Machine Learning Part B: non-symbolic learning, artificial neurons, McCulloch-Pitts logic, perceptron learning, linear separability, XOR, sigmoid activation, multilayer networks, delta rules, backpropagation, network types, and references.",
  selectionRationale:
    "Pages 1-3 and 6-19 form the complete neural-network teaching sequence; page 36 preserves its textbook references. Genetic programming, clustering, reinforcement learning, and general ML pages remain inventoried but are assigned elsewhere or retained as optional archive material.",
  knowledgePointGroups: [
    {
      slides: [1, 2, 3],
      meeting: 17,
      topic:
        "Machine Learning Part B context and the historical distinction between symbolic and adaptive or optimization-based learning.",
    },
    {
      slides: [6, 7, 8],
      meeting: 17,
      topic:
        "Artificial-neuron components, McCulloch-Pitts logic functions, and the transition from hand-set parameters to a learning problem.",
    },
    {
      slides: [9, 10, 11, 12, 13],
      meeting: 17,
      topic:
        "Perceptron learning, a numeric update sequence, linear separation, XOR limitation, and sigmoid activation.",
    },
    {
      slides: [14, 15, 16, 17, 18],
      meeting: 18,
      topic:
        "Multilayer networks, forward propagation, error backpropagation, delta-rule weight adjustment, layer notation, and the complete source algorithm.",
    },
    {
      slides: [19, 36],
      meeting: 18,
      topic:
        "Network design choices, supervised and unsupervised uses, and the historical textbook references.",
    },
  ],
  auditSummary: {
    wholeDeckSlides: inventory.slideCount,
    wholeDeckMedia: inventory.mediaCount,
    selectedSlideCount: selectedSlides.length,
    selectedRenderCount: sourceSlideEvidence.filter((slide) => slide.render).length,
    selectedMediaCount: assets.length,
    selectedSlidesWithNotes: sourceSlideEvidence
      .filter((slide) => slide.speakerNotes)
      .map((slide) => slide.slide),
    renderDimensions: { width: 1600, height: 1200 },
  },
  inventoryProvenance: {
    file: "source-inventory.json",
    sha256: sha256(inventoryBytes),
    bytes: inventoryBytes.length,
    generator: "scripts/inventory_pptx.py",
  },
  renderProvenance: {
    source:
      "Historical instructor PDF exported from the same L10 PowerPoint deck.",
    renderer: "Poppler pdftoppm at 160 DPI",
    selectedRenders: sourceSlideEvidence.map((slide) => slide.render),
    archivalContextRenders: [
      "slide-renders/slide-04.png",
      "slide-renders/slide-05.png",
    ],
    dimensions: { width: 1600, height: 1200 },
    preservation:
      "Complete 4:3 pages are retained without cropping. Source images and explanatory text remain visible together.",
  },
  sourceSlideEvidence,
  extractionPolicy: {
    publicPath:
      "/course-source/l10-neural-networks/slide-renders/slide-XX.png",
    imagePolicy:
      "Use complete source pages in the Course source viewer and preserve exact embedded media byte-for-byte.",
    textPolicy:
      "Preserve searchable source wording; present corrections and modern PyTorch supplements explicitly.",
  },
  assets,
  sourceCorrectionLedger,
  excludedCoreSlides: {
    4: "Genetic-programming regression is retained as optional archive context rather than core neural-network content.",
    5: "The historical gplearn demonstration is retained as optional archive context.",
    "20-29": "Unsupervised learning and clustering are inventoried but outside the revised core sequence.",
    30: "Reinforcement learning is preserved in Meeting 12.",
    "31-35":
      "Domain knowledge, online learning, taxonomy, applications, and challenges are inventoried and may be used as optional comparison material.",
  },
};

writeFileSync(
  join(packageDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
