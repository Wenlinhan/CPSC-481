import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

const packages = [
  {
    directory: "l06-bio-ga",
    lesson: 9,
    sources: [{
      inventory: "source-inventory.json",
      label: "L06_Bio&GA.pptx",
      renderDirectory: "source-slides",
      lessonPagesBySourcePage: {
        1:[1],2:[1,2],3:[3],4:[3],5:[4],6:[4,5],7:[5],8:[6],9:[7],10:[2,8],11:[2,8],
        12:[9],13:[10,11,25],14:[11,25],15:[12,13,14],16:[15,16,18],17:[17,18],
        18:[19,20,23],19:[21,23],20:[22,23],21:[24,25,26],22:[26],
      },
    }],
  },
  {
    directory: "l07-gp-l08-alife",
    lesson: 10,
    sources: [
      {
        inventory: "l07-source-inventory.json",
        label: "L07_GP.pdf",
        renderDirectory: "l07-source-slides",
        lessonPagesBySourcePage: {
          1:[1],2:[1,2],3:[2,3],4:[3,4],5:[5],6:[5],7:[6],8:[6],9:[6],10:[6],11:[6],12:[6],13:[6],
          14:[7],15:[7],16:[7],17:[8],18:[8],19:[8],20:[9],21:[10],22:[10],23:[11],24:[12],25:[12],
          26:[12],27:[13],28:[14],29:[15],30:[16],31:[17],32:[18],33:[18],
        },
      },
      {
        inventory: "l08-source-inventory.json",
        label: "L08_ArtificialLife.pptx",
        renderDirectory: "l08-pptx-source-slides",
        lessonPagesBySourcePage: {
          1:[19],2:[20],3:[21],4:[21],5:[22],6:[21],7:[23],8:[24,25],9:[24],10:[24],11:[24],12:[24],
          13:[24],14:[24],15:[24],16:[24],17:[24],18:[24],19:[24],20:[24],21:[24],22:[24],23:[25,26],
          24:[26],25:[26],26:[26],27:[26],28:[26],
        },
      },
    ],
  },
];

for (const sourcePackage of packages) {
  const packageRoot = resolve(root, "public", "course-source", sourcePackage.directory);
  const sources = [];
  for (const source of sourcePackage.sources) {
    const inventoryPath = resolve(packageRoot, source.inventory);
    const inventoryContent = await readFile(inventoryPath);
    const inventory = JSON.parse(inventoryContent);
    const pageCount = inventory.pageCount ?? inventory.slideCount;
    const expectedPages = Array.from({ length: pageCount }, (_, index) => index + 1);
    const mappedPages = Object.keys(source.lessonPagesBySourcePage).map(Number).sort((a,b)=>a-b);
    if (JSON.stringify(mappedPages) !== JSON.stringify(expectedPages)) {
      throw new Error(`${source.label} mapping does not cover every source page exactly once.`);
    }
    sources.push({
      label: source.label,
      sourceSha256: inventory.sourceSha256,
      pageCount,
      inventory: { file: source.inventory, sha256: sha256(inventoryContent) },
      renderDirectory: source.renderDirectory,
      sourcePageToLessonPages: source.lessonPagesBySourcePage,
    });
  }
  const manifest = {
    schemaVersion: 1,
    lesson: sourcePackage.lesson,
    route: `/lessons/${String(sourcePackage.lesson).padStart(2,"0")}`,
    preservationPolicy: "Every historical source page is mapped to at least one native lesson page; full-page renders appear only in the optional Course source dialog.",
    sources,
  };
  await writeFile(resolve(packageRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

console.log("Built complete source manifests for Lessons 9 and 10.");
