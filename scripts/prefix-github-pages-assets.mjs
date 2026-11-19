import fs from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve("out");
const basePath = "/CPSC-481";
const publicRoots = [
  "concepts",
  "course-source",
  "diagrams",
  "lesson-visuals",
  "media",
];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt"]);

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(filePath);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name))) continue;

    const original = await fs.readFile(filePath, "utf8");
    let revised = original;
    for (const root of publicRoots) {
      revised = revised.replaceAll(`/${root}/`, `${basePath}/${root}/`);
    }
    for (const file of ["favicon.svg", "og.png", "og-source.png"]) {
      revised = revised.replaceAll(`/${file}`, `${basePath}/${file}`);
    }
    if (revised !== original) await fs.writeFile(filePath, revised);
  }
}

await walk(outputRoot);
await fs.writeFile(path.join(outputRoot, ".nojekyll"), "");
