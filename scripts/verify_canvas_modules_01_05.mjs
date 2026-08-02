import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SOURCE_COURSE_ID = "3328459";
const TARGET_COURSE_ID = "3586560";
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const token = fs.readFileSync(TOKEN_FILE, "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).at(-1);
if (!token || token.toLowerCase().includes("canvas api")) throw new Error(`Could not find a Canvas API token in ${TOKEN_FILE}`);

const expectedModules = [
  "Module 1: course overview and prerequisites",
  "Module 2: L01-Introduction",
  "Module 3: L02-State Space Search",
  "Module 4: L03-Heuristic, HillClimbing&SA",
  "Module 5: L04-BFS&AStar",
];

function apiUrl(endpoint) {
  return `${CANVAS_BASE_URL}/api/v1/${endpoint.replace(/^\//, "")}`;
}

async function get(endpoint) {
  const response = await fetch(apiUrl(endpoint), { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`GET ${endpoint} failed: ${response.status} ${(await response.text()).slice(0, 500)}`);
  return response.json();
}

async function paginate(endpoint) {
  const results = [];
  let nextUrl = apiUrl(`${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100`);
  while (nextUrl) {
    const response = await fetch(nextUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`GET ${endpoint} failed: ${response.status} ${(await response.text()).slice(0, 500)}`);
    results.push(...(await response.json()));
    const next = (response.headers.get("link") ?? "").split(",").map((part) => part.trim()).find((part) => part.includes('rel="next"'));
    nextUrl = next?.match(/<([^>]+)>/)?.[1] ?? null;
  }
  return results;
}

function digest(value) {
  return crypto.createHash("sha256").update(String(value ?? "")).digest("hex");
}

async function content(courseId, item) {
  if (item.type === "Page") return get(`courses/${courseId}/pages/${item.page_url}`);
  if (item.type === "Assignment") return get(`courses/${courseId}/assignments/${item.content_id}`);
  if (item.type === "Discussion") return get(`courses/${courseId}/discussion_topics/${item.content_id}`);
  throw new Error(`Unsupported item type: ${item.type}`);
}

function comparableText(type, value) {
  if (type === "Page") return value.body ?? "";
  if (type === "Assignment") return value.description ?? "";
  return value.message ?? "";
}

function normalizeCanvasHtml(value) {
  return String(value ?? "")
    .replaceAll(SOURCE_COURSE_ID, "{course}")
    .replaceAll(TARGET_COURSE_ID, "{course}")
    .replace(/(?<=files\/)\d+/g, "{file}")
    .replace(/\?verifier=[^"'&<\s]+/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

const [sourceModules, targetModules] = await Promise.all([
  paginate(`courses/${SOURCE_COURSE_ID}/modules`),
  paginate(`courses/${TARGET_COURSE_ID}/modules`),
]);

for (let index = 0; index < expectedModules.length; index += 1) {
  const module = targetModules.find((candidate) => candidate.name === expectedModules[index]);
  if (!module || module.position !== index + 1 || !module.published) throw new Error(`Module verification failed: ${expectedModules[index]}`);
}

const sourceModuleOne = sourceModules.find((module) => module.name === expectedModules[0]);
const targetModuleOne = targetModules.find((module) => module.name === expectedModules[0]);
const [sourceItems, targetItems] = await Promise.all([
  paginate(`courses/${SOURCE_COURSE_ID}/modules/${sourceModuleOne.id}/items`),
  paginate(`courses/${TARGET_COURSE_ID}/modules/${targetModuleOne.id}/items`),
]);
if (sourceItems.length !== targetItems.length) throw new Error("Module 1 item count differs from reference");

for (let index = 0; index < sourceItems.length; index += 1) {
  const sourceItem = sourceItems[index];
  const targetItem = targetItems[index];
  if (sourceItem.type !== targetItem.type || sourceItem.title.trim() !== targetItem.title.trim() || !targetItem.published) {
    throw new Error(`Module 1 item mismatch at position ${index + 1}`);
  }
  const [sourceContent, targetContent] = await Promise.all([
    content(SOURCE_COURSE_ID, sourceItem),
    content(TARGET_COURSE_ID, targetItem),
  ]);
  const sourceText = normalizeCanvasHtml(comparableText(sourceItem.type, sourceContent));
  const targetText = normalizeCanvasHtml(comparableText(targetItem.type, targetContent));
  if (digest(sourceText) !== digest(targetText)) {
    let difference = 0;
    while (difference < sourceText.length && difference < targetText.length && sourceText[difference] === targetText[difference]) difference += 1;
    throw new Error(`Module 1 content differs: ${sourceItem.title}; first difference at ${difference}; source=${JSON.stringify(sourceText.slice(difference, difference + 180))}; target=${JSON.stringify(targetText.slice(difference, difference + 180))}`);
  }
}

const backupDirectory = path.resolve("output", "canvas-backups");
const backupFile = fs.readdirSync(backupDirectory)
  .filter((name) => name.startsWith("modules-01-05-") && name.endsWith(".json"))
  .sort()
  .at(-1);
if (!backupFile) throw new Error("No Modules 1-5 backup found for body-integrity verification");
const backup = JSON.parse(fs.readFileSync(path.join(backupDirectory, backupFile), "utf8"));

for (let id = 1; id <= 8; id += 1) {
  const moduleName = expectedModules[Math.floor((id - 1) / 2) + 1];
  const module = targetModules.find((candidate) => candidate.name === moduleName);
  const items = await paginate(`courses/${TARGET_COURSE_ID}/modules/${module.id}/items`);
  const item = items.find((candidate) => candidate.type === "Page" && candidate.title.startsWith(`Lesson ${id}:`));
  if (!item || !item.published) throw new Error(`Lesson ${id} module item verification failed`);
  const page = await get(`courses/${TARGET_COURSE_ID}/pages/${item.page_url}`);
  const expectedHash = backup.lessons.find((entry) => entry.lesson.id === id)?.bodyHash;
  if (!page.published || digest(page.body ?? "") !== expectedHash) throw new Error(`Lesson ${id} page body verification failed`);
  if (!(page.body ?? "").includes(`/meetings/${String(id).padStart(2, "0")}`)) throw new Error(`Lesson ${id} iframe route missing`);
}

console.log("PASS: Modules 1-5 are ordered and published; Module 1 matches the reference content; Lessons 1-8 are published with unchanged iframe bodies.");
