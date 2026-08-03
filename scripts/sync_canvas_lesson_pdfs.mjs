import fs from "node:fs";
import path from "node:path";

const COURSE_ID = "3586560";
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const PDF_DIR = path.resolve("output", "pdf", "lessons");
const CANVAS_FOLDER_PATH = "CPSC 481 Lesson Slide PDFs";
const APPLY = process.argv.includes("--apply");
const VERIFY = process.argv.includes("--verify");

const lessons = [
  [1, "AI Applications, History, Intelligence, and Definitions"],
  [2, "Agents, Task Environments, Agent Types, and the Turing Test"],
  [3, "Problem Formulation and Breadth-First Search"],
  [4, "Depth-First, Uniform-Cost, and Search Evaluation"],
  [5, "Heuristic Functions, Hill Climbing, and Simulated Annealing"],
  [6, "Best-First Search, A*, and Heuristic Quality"],
  [7, "Game Trees, Minimax, and Evaluation Functions"],
  [8, "Alpha-Beta Pruning and Modern Game Search"],
  [9, "Evolutionary Computation and Genetic Algorithms"],
  [10, "Genetic Programming, Artificial Life, and Swarm Intelligence"],
].map(([id, title]) => ({
  id,
  pageTitle: `Lesson ${id}: ${title}`,
  itemTitle: `Lesson ${id} Slides (PDF)`,
  fileName: `cpsc481-lesson-${String(id).padStart(2, "0")}-slides.pdf`,
}));

const token = fs.readFileSync(TOKEN_FILE, "utf8").split(/\r?\n/).map(line => line.trim()).filter(Boolean).at(-1);
if (!token || token.toLowerCase().includes("canvas api")) throw new Error(`Could not find a Canvas API token in ${TOKEN_FILE}`);

function apiUrl(endpoint) {
  return `${CANVAS_BASE_URL}/api/v1/${endpoint.replace(/^\//, "")}`;
}

async function canvasFetch(endpoint, options = {}) {
  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${endpoint}: ${response.status} ${(await response.text()).slice(0, 500)}`);
  return response.status === 204 ? null : response.json();
}

async function paginate(endpoint) {
  const values = [];
  let url = apiUrl(`${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100`);
  while (url) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`GET ${endpoint}: ${response.status}`);
    values.push(...await response.json());
    url = (response.headers.get("link") ?? "").split(",").find(part => part.includes('rel="next"'))?.match(/<([^>]+)>/)?.[1] ?? null;
  }
  return values;
}

function localPdf(lesson) {
  return path.join(PDF_DIR, lesson.fileName);
}

function assertLocalPdfs() {
  for (const lesson of lessons) {
    const filePath = localPdf(lesson);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 100_000) throw new Error(`Missing or invalid PDF: ${filePath}`);
  }
}

async function uploadPdf(lesson) {
  const filePath = localPdf(lesson);
  const { size } = fs.statSync(filePath);
  const init = await canvasFetch(`courses/${COURSE_ID}/files`, {
    method: "POST",
    body: JSON.stringify({
      name: lesson.fileName,
      size,
      content_type: "application/pdf",
      parent_folder_path: CANVAS_FOLDER_PATH,
      on_duplicate: "overwrite",
    }),
  });
  const form = new FormData();
  for (const [key, value] of Object.entries(init.upload_params ?? {})) form.append(key, value);
  form.append("file", new Blob([fs.readFileSync(filePath)], { type: "application/pdf" }), lesson.fileName);
  const response = await fetch(init.upload_url, { method: "POST", body: form });
  if (!response.ok) throw new Error(`Upload ${lesson.fileName}: ${response.status} ${(await response.text()).slice(0, 500)}`);
  return response.json();
}

async function courseState() {
  const modules = (await paginate(`courses/${COURSE_ID}/modules`)).sort((a, b) => a.position - b.position);
  const moduleRecords = [];
  for (const module of modules) {
    moduleRecords.push({ module, items: (await paginate(`courses/${COURSE_ID}/modules/${module.id}/items`)).sort((a, b) => a.position - b.position) });
  }
  return moduleRecords;
}

function locateLessons(moduleRecords) {
  return lessons.map(lesson => {
    for (const record of moduleRecords) {
      const pageItem = record.items.find(item => item.type === "Page" && item.title === lesson.pageTitle);
      if (pageItem) return { ...lesson, ...record, pageItem };
    }
    throw new Error(`Canvas page item not found: ${lesson.pageTitle}`);
  });
}

async function verifyCanvas() {
  const located = locateLessons(await courseState());
  const files = await paginate(`courses/${COURSE_ID}/files`);
  const report = [];
  for (const lesson of located) {
    const pdfItem = lesson.items.find(item => item.type === "File" && item.title === lesson.itemTitle);
    const file = files.find(candidate => candidate.id === pdfItem?.content_id);
    const contentType = file?.["content-type"] ?? file?.content_type;
    if (!lesson.module.published || !lesson.pageItem.published || !pdfItem?.published || !file || contentType !== "application/pdf" || file.size < 100_000) {
      throw new Error(`Canvas verification failed for Lesson ${lesson.id}`);
    }
    if (pdfItem.position !== lesson.pageItem.position + 1) throw new Error(`Lesson ${lesson.id} PDF is not directly after its lesson page`);
    report.push({ lesson: lesson.id, module: lesson.module.name, pagePosition: lesson.pageItem.position, pdfPosition: pdfItem.position, fileId: file.id, bytes: file.size, published: pdfItem.published });
  }
  console.log(JSON.stringify({ status: "passed", courseId: COURSE_ID, lessons: report }, null, 2));
}

assertLocalPdfs();
if (VERIFY) {
  await verifyCanvas();
  process.exit(0);
}

const located = locateLessons(await courseState());
console.log(`${APPLY ? "APPLY" : "DRY RUN"}: upload 10 PDFs and place each directly after its matching lesson page.`);
for (const lesson of located) console.log(`Lesson ${lesson.id}: ${lesson.module.name} -> after item ${lesson.pageItem.id}`);
if (!APPLY) process.exit(0);

for (const lesson of located) {
  const file = await uploadPdf(lesson);
  let item = lesson.items.find(candidate => candidate.type === "File" && candidate.title === lesson.itemTitle);
  if (!item) {
    item = await canvasFetch(`courses/${COURSE_ID}/modules/${lesson.module.id}/items`, {
      method: "POST",
      body: JSON.stringify({ module_item: { type: "File", title: lesson.itemTitle, content_id: file.id, position: lesson.pageItem.position + 1 } }),
    });
  } else {
    item = await canvasFetch(`courses/${COURSE_ID}/modules/${lesson.module.id}/items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ module_item: { title: lesson.itemTitle, content_id: file.id, position: lesson.pageItem.position + 1, published: true } }),
    });
  }
  if (!item.published) {
    await canvasFetch(`courses/${COURSE_ID}/modules/${lesson.module.id}/items/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ module_item: { published: true } }),
    });
  }
  console.log(`Lesson ${lesson.id}: uploaded file ${file.id}; module item ${item.id}`);
}

// Canvas renumbers later items after every insertion. Re-read the finished
// module state and place PDFs from bottom to top so each one remains directly
// after its lesson page.
const placed = locateLessons(await courseState()).sort((a, b) => {
  if (a.module.id !== b.module.id) return a.module.position - b.module.position;
  return b.pageItem.position - a.pageItem.position;
});
for (const lesson of placed) {
  const pdfItem = lesson.items.find(item => item.type === "File" && item.title === lesson.itemTitle);
  if (!pdfItem) throw new Error(`Canvas PDF item not found after upload: ${lesson.itemTitle}`);
  await canvasFetch(`courses/${COURSE_ID}/modules/${lesson.module.id}/items/${pdfItem.id}`, {
    method: "PUT",
    body: JSON.stringify({ module_item: { position: lesson.pageItem.position + 1, published: true } }),
  });
}

await verifyCanvas();
