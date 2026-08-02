import fs from "node:fs";
import path from "node:path";

const SOURCE_COURSE_ID = "3328459";
const TARGET_COURSE_ID = "3586560";
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const MODULE_NAME = "Module 1: course overview and prerequisites";
const apply = process.argv.includes("--apply");

const token = fs.readFileSync(TOKEN_FILE, "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).at(-1);
if (!token || token.toLowerCase().includes("canvas api")) throw new Error(`Could not find a Canvas API token in ${TOKEN_FILE}`);

function apiUrl(endpoint) {
  return `${CANVAS_BASE_URL}/api/v1/${endpoint.replace(/^\//, "")}`;
}

async function request(endpoint, options = {}) {
  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${endpoint} failed: ${response.status} ${(await response.text()).slice(0, 500)}`);
  return response.status === 204 ? null : response.json();
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

async function content(courseId, item) {
  if (item.type === "Page") return request(`courses/${courseId}/pages/${item.page_url}`);
  if (item.type === "Assignment") return request(`courses/${courseId}/assignments/${item.content_id}`);
  if (item.type === "Discussion") return request(`courses/${courseId}/discussion_topics/${item.content_id}`);
  throw new Error(`Unsupported Module 1 item type: ${item.type}`);
}

function htmlField(type, value) {
  if (type === "Page") return value.body ?? "";
  if (type === "Assignment") return value.description ?? "";
  return value.message ?? "";
}

function fileIds(html) {
  const ids = new Set();
  const pattern = new RegExp(`(?:courses/${SOURCE_COURSE_ID}/files/|api/v1/courses/${SOURCE_COURSE_ID}/files/)(\\d+)`, "g");
  for (const match of String(html ?? "").matchAll(pattern)) ids.add(match[1]);
  return [...ids];
}

function safeName(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

async function uploadSourceFile(sourceFileId) {
  const sourceFile = await request(`files/${sourceFileId}`);
  const uploadName = `module1-source-${sourceFileId}-${safeName(sourceFile.display_name ?? sourceFile.filename ?? "file")}`;
  const existing = await paginate(`courses/${TARGET_COURSE_ID}/files?search_term=${encodeURIComponent(uploadName)}`);
  const exact = existing.find((file) => file.display_name === uploadName || file.filename === uploadName);
  if (exact) return { sourceFile, targetFile: exact, reused: true };

  const sourceResponse = await fetch(sourceFile.url, { headers: { Authorization: `Bearer ${token}` } });
  if (!sourceResponse.ok) throw new Error(`Download file ${sourceFileId} failed: ${sourceResponse.status}`);
  const bytes = await sourceResponse.arrayBuffer();
  const setupResponse = await fetch(apiUrl(`courses/${TARGET_COURSE_ID}/files`), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      name: uploadName,
      size: String(bytes.byteLength),
      content_type: sourceFile["content-type"] ?? sourceFile.content_type ?? "application/octet-stream",
      parent_folder_path: "course files/Imported Reference Module 1",
      on_duplicate: "overwrite",
    }),
  });
  if (!setupResponse.ok) throw new Error(`Upload setup failed for ${sourceFileId}: ${setupResponse.status} ${(await setupResponse.text()).slice(0, 500)}`);
  const setup = await setupResponse.json();
  const form = new FormData();
  for (const [key, value] of Object.entries(setup.upload_params ?? {})) form.append(key, String(value));
  form.append("file", new Blob([bytes], { type: sourceFile["content-type"] ?? sourceFile.content_type ?? "application/octet-stream" }), uploadName);
  const uploadResponse = await fetch(setup.upload_url, { method: "POST", body: form, redirect: "follow" });
  if (!uploadResponse.ok) throw new Error(`Upload failed for ${sourceFileId}: ${uploadResponse.status} ${(await uploadResponse.text()).slice(0, 500)}`);
  const targetFile = await uploadResponse.json();
  return { sourceFile, targetFile, reused: false };
}

function rewriteHtml(html, fileMap) {
  let result = String(html ?? "").replaceAll(`/courses/${SOURCE_COURSE_ID}/`, `/courses/${TARGET_COURSE_ID}/`);
  result = result.replaceAll(`/api/v1/courses/${SOURCE_COURSE_ID}/`, `/api/v1/courses/${TARGET_COURSE_ID}/`);
  for (const [sourceId, targetId] of fileMap) {
    result = result.replace(new RegExp(`(?<=files/)${sourceId}(?=[/?"'])`, "g"), String(targetId));
  }
  return result.replace(/\?verifier=[^"'&<\s]+/g, "");
}

async function updateTarget(item, html) {
  if (item.type === "Page") {
    return request(`courses/${TARGET_COURSE_ID}/pages/${item.page_url}`, {
      method: "PUT",
      body: JSON.stringify({ wiki_page: { body: html, published: true } }),
    });
  }
  if (item.type === "Assignment") {
    return request(`courses/${TARGET_COURSE_ID}/assignments/${item.content_id}`, {
      method: "PUT",
      body: JSON.stringify({ assignment: { description: html, published: true } }),
    });
  }
  return request(`courses/${TARGET_COURSE_ID}/discussion_topics/${item.content_id}`, {
    method: "PUT",
    body: JSON.stringify({ message: html, published: true }),
  });
}

const [sourceModules, targetModules] = await Promise.all([
  paginate(`courses/${SOURCE_COURSE_ID}/modules`),
  paginate(`courses/${TARGET_COURSE_ID}/modules`),
]);
const sourceModule = sourceModules.find((module) => module.name === MODULE_NAME);
const targetModule = targetModules.find((module) => module.name === MODULE_NAME);
if (!sourceModule || !targetModule) throw new Error("Source or target Module 1 is missing");
const [sourceItems, targetItems] = await Promise.all([
  paginate(`courses/${SOURCE_COURSE_ID}/modules/${sourceModule.id}/items`),
  paginate(`courses/${TARGET_COURSE_ID}/modules/${targetModule.id}/items`),
]);

const plans = [];
for (const sourceItem of sourceItems.sort((a, b) => a.position - b.position)) {
  const targetItem = targetItems.find((item) => item.type === sourceItem.type && item.title.trim() === sourceItem.title.trim());
  if (!targetItem) throw new Error(`Target Module 1 item missing: ${sourceItem.title}`);
  const sourceContent = await content(SOURCE_COURSE_ID, sourceItem);
  plans.push({ sourceItem, targetItem, sourceHtml: htmlField(sourceItem.type, sourceContent), ids: fileIds(htmlField(sourceItem.type, sourceContent)) });
}

const allFileIds = [...new Set(plans.flatMap((plan) => plan.ids))];
console.log(`${apply ? "[APPLY]" : "[DRY RUN]"} Module 1 embedded-content migration`);
console.log(`Items: ${plans.length}; embedded Canvas files to localize: ${allFileIds.length}`);
for (const plan of plans) console.log(`- ${plan.sourceItem.type}: ${plan.sourceItem.title}; source file ids=${plan.ids.join(",") || "none"}`);
if (!apply) process.exit(0);

const fileMap = new Map();
for (const sourceId of allFileIds) {
  const uploaded = await uploadSourceFile(sourceId);
  fileMap.set(sourceId, uploaded.targetFile.id);
  console.log(`  ${uploaded.reused ? "Reused" : "Uploaded"} source file ${sourceId} as target file ${uploaded.targetFile.id}`);
}
for (const plan of plans) {
  await updateTarget(plan.targetItem, rewriteHtml(plan.sourceHtml, fileMap));
  console.log(`  Updated ${plan.targetItem.title}`);
}
await request(`courses/${TARGET_COURSE_ID}/modules/${targetModule.id}`, {
  method: "PUT",
  body: JSON.stringify({ module: { published: true, position: 1 } }),
});
console.log("DONE: Module 1 content and embedded files now point to the Fall 2026 course.");
