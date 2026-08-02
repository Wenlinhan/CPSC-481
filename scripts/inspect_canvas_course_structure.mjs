import fs from "node:fs";
import path from "node:path";

const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const courseIds = process.argv.slice(2).filter((value) => /^\d+$/.test(value));

if (courseIds.length === 0) {
  throw new Error("Usage: node scripts/inspect_canvas_course_structure.mjs <course-id> [course-id...]");
}

const token = fs.readFileSync(TOKEN_FILE, "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).at(-1);
if (!token || token.toLowerCase().includes("canvas api")) {
  throw new Error(`Could not find a Canvas API token in ${TOKEN_FILE}`);
}

function apiUrl(endpoint) {
  return `${CANVAS_BASE_URL}/api/v1/${endpoint.replace(/^\//, "")}`;
}

async function canvasFetch(endpoint) {
  const response = await fetch(apiUrl(endpoint), {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GET ${endpoint} failed: ${response.status} ${body.slice(0, 500)}`);
  }
  return response.json();
}

async function paginate(endpoint) {
  const results = [];
  let nextUrl = apiUrl(`${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100`);
  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GET ${endpoint} failed: ${response.status} ${body.slice(0, 500)}`);
    }
    results.push(...(await response.json()));
    const next = (response.headers.get("link") ?? "")
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.includes('rel="next"'));
    nextUrl = next?.match(/<([^>]+)>/)?.[1] ?? null;
  }
  return results;
}

for (const courseId of courseIds) {
  const [course, modules] = await Promise.all([
    canvasFetch(`courses/${courseId}?include[]=syllabus_body`),
    paginate(`courses/${courseId}/modules`),
  ]);
  console.log(`\nCOURSE ${courseId}: ${course.name}`);
  console.log(`SYLLABUS_HTML_LENGTH ${String(course.syllabus_body ?? "").length}`);
  for (const module of modules.sort((a, b) => a.position - b.position)) {
    const items = await paginate(`courses/${courseId}/modules/${module.id}/items`);
    console.log(`\n[${module.position}] ${module.name} | id=${module.id} | published=${module.published} | items=${items.length}`);
    for (const item of items.sort((a, b) => a.position - b.position)) {
      const target = item.page_url ?? item.content_id ?? item.external_url ?? "";
      console.log(`  [${item.position}] ${item.type} | ${item.title} | id=${item.id} | target=${target} | published=${item.published}`);
    }
  }
}
