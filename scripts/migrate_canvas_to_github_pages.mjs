import fs from "node:fs";
import path from "node:path";

const COURSE_ID = "3586560";
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const OLD_SITE_URL = "https://cpsc481-introduction-to-ai.winniechef.chatgpt.site";
const NEW_SITE_URL = "https://wenlinhan.github.io/CPSC-481";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const apply = process.argv.includes("--apply");

const token = fs.readFileSync(TOKEN_FILE, "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).at(-1);
if (!token || token.toLowerCase().includes("canvas api")) throw new Error(`Could not find a Canvas API token in ${TOKEN_FILE}`);

function apiUrl(endpoint) {
  return `${CANVAS_BASE_URL}/api/v1/${endpoint.replace(/^\//, "")}`;
}

async function canvasFetch(endpoint, options = {}) {
  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${endpoint} failed: ${response.status} ${(await response.text()).slice(0, 500)}`);
  return response.status === 204 ? null : response.json();
}

async function canvasPaginate(endpoint) {
  const results = [];
  let nextUrl = apiUrl(`${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100`);
  while (nextUrl) {
    const response = await fetch(nextUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`GET ${endpoint} failed: ${response.status}`);
    results.push(...await response.json());
    const next = (response.headers.get("link") ?? "").split(",").find((part) => part.includes('rel="next"'));
    nextUrl = next?.match(/<([^>]+)>/)?.[1] ?? null;
  }
  return results;
}

function lessonUrl(lesson) {
  return `${NEW_SITE_URL}/lessons/${String(lesson).padStart(2, "0")}/`;
}

function replaceLessonUrl(body, lesson) {
  const escapedOld = OLD_SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const oldLesson = new RegExp(`${escapedOld}/lessons/${String(lesson).padStart(2, "0")}(?:\\?[^\"'<\\s]*)?`, "g");
  return body.replace(oldLesson, lessonUrl(lesson));
}

async function main() {
  const modules = (await canvasPaginate(`courses/${COURSE_ID}/modules`)).sort((a, b) => a.position - b.position);
  if (modules.length !== 16) throw new Error(`Expected 16 modules, found ${modules.length}`);

  const targets = [];
  let lesson = 1;
  for (let moduleIndex = 1; moduleIndex < 14; moduleIndex += 1) {
    if ([6, 7].includes(moduleIndex)) continue;
    const module = modules[moduleIndex];
    const items = await canvasPaginate(`courses/${COURSE_ID}/modules/${module.id}/items`);
    for (const item of items) {
      if (item.type !== "Page" || !/^Lesson \d+:/.test(item.title)) continue;
      if (lesson > 22) throw new Error("Found more than 22 lesson pages in the expected modules");
      const page = await canvasFetch(`courses/${COURSE_ID}/pages/${item.page_url}`);
      if (!page.title.startsWith(`Lesson ${lesson}:`)) throw new Error(`Expected Lesson ${lesson}, found ${page.title}`);
      const revisedBody = replaceLessonUrl(page.body ?? "", lesson);
      const expectedUrl = lessonUrl(lesson);
      if (!revisedBody.includes(expectedUrl)) throw new Error(`Could not prepare GitHub Pages URL for ${page.title}`);
      targets.push({ lesson, module, item, page, revisedBody, expectedUrl, changed: revisedBody !== (page.body ?? "") });
      lesson += 1;
    }
  }
  if (targets.length !== 22) throw new Error(`Expected 22 lesson pages, found ${targets.length}`);

  console.log(`${apply ? "[APPLY]" : "[DRY RUN]"} Canvas course ${COURSE_ID}: ${targets.length} lesson pages`);
  for (const target of targets) {
    console.log(`Lesson ${target.lesson}: changed=${target.changed}; page=${target.page.published}; item=${target.item.published}; module=${target.module.published}; ${target.expectedUrl}`);
  }
  if (!apply) return;

  for (const target of targets) {
    await canvasFetch(`courses/${COURSE_ID}/pages/${target.page.url}`, {
      method: "PUT",
      body: JSON.stringify({ wiki_page: { body: target.revisedBody, published: true } }),
    });
    await canvasFetch(`courses/${COURSE_ID}/modules/${target.module.id}/items/${target.item.id}`, {
      method: "PUT",
      body: JSON.stringify({ module_item: { published: true } }),
    });
    await canvasFetch(`courses/${COURSE_ID}/modules/${target.module.id}`, {
      method: "PUT",
      body: JSON.stringify({ module: { published: true } }),
    });

    const [pageReadback, itemReadback, moduleReadback] = await Promise.all([
      canvasFetch(`courses/${COURSE_ID}/pages/${target.page.url}`),
      canvasFetch(`courses/${COURSE_ID}/modules/${target.module.id}/items/${target.item.id}`),
      canvasFetch(`courses/${COURSE_ID}/modules/${target.module.id}`),
    ]);
    if (!(pageReadback.body ?? "").includes(target.expectedUrl) || (pageReadback.body ?? "").includes(OLD_SITE_URL)) {
      throw new Error(`URL readback failed for ${target.page.title}`);
    }
    if (!pageReadback.published || !itemReadback.published || !moduleReadback.published) {
      throw new Error(`Publication readback failed for ${target.page.title}`);
    }
    console.log(`Verified Lesson ${target.lesson}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
