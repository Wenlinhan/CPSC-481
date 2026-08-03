import { spawnSync } from "node:child_process";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "../..");
const courseRoot = path.dirname(siteRoot);
const courseId = "3586560";
const base = "https://csufullerton.instructure.com/api/v1/";
const video = path.join(siteRoot, "output", "lecture", "meeting-08", "cpsc-481-lesson-08-video-lecture.mp4");
const publicationFile = path.join(here, "canvas-publication.json");
const token = (await readFile(path.join(courseRoot, "Canvas API.txt"), "utf8")).split(/\r?\n/).map(line => line.trim()).filter(Boolean).at(-1);
if (!token || token.toLowerCase().includes("canvas api")) throw new Error("Canvas API token is unavailable.");

async function request(endpoint, options = {}) {
  const response = await fetch(base + endpoint, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  });
  if (!response.ok) throw new Error(`${endpoint}: ${response.status} ${await response.text()}`);
  return response.json();
}

async function context() {
  const [pages, modules] = await Promise.all([
    request(`courses/${courseId}/pages?per_page=100`),
    request(`courses/${courseId}/modules?per_page=100`),
  ]);
  const candidate = pages.find(page => /^lesson\s*8\b/i.test(page.title ?? ""))
    ?? pages.find(page => /(?:^|-)lesson-?8(?:-|$)/i.test(page.url ?? ""));
  if (!candidate) throw new Error("Could not find the Lesson 8 Canvas page.");
  const page = await request(`courses/${courseId}/pages/${candidate.url}`);
  for (const module of modules) {
    const items = await request(`courses/${courseId}/modules/${module.id}/items?per_page=100`);
    const item = items.find(entry => entry.page_url === candidate.url);
    if (item) return { page, module, item, pageSlug: candidate.url };
  }
  throw new Error(`Lesson 8 page ${candidate.url} is not in a Canvas module.`);
}

const mode = process.argv[2] ?? "--dry-run";
const file = await stat(video);
if (mode === "--dry-run") {
  const { page, module, item, pageSlug } = await context();
  console.log(JSON.stringify({
    dryRun: true,
    video,
    bytes: file.size,
    pageSlug,
    pageTitle: page.title,
    moduleName: module.name,
    pagePublished: page.published,
    modulePublished: module.published,
    itemPublished: item.published,
    existingVideoMarker: page.body?.includes("lesson-08-video") === true,
  }, null, 2));
  process.exit(0);
}

if (mode === "--upload") {
  const init = await request(`courses/${courseId}/files`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      name: "CPSC 481 Lesson 8 - Alpha-Beta Pruning and Modern Game Search.mp4",
      size: String(file.size),
      content_type: "video/mp4",
      parent_folder_path: "Lecture Videos",
      on_duplicate: "overwrite",
    }),
  });
  const args = ["-sS", "-L", "-X", "POST"];
  for (const [key, value] of Object.entries(init.upload_params ?? {})) args.push("-F", `${key}=${value}`);
  args.push("-F", `file=@${video};type=video/mp4`, init.upload_url);
  const upload = spawnSync("curl.exe", args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024, windowsHide: true });
  if (upload.status !== 0) throw new Error(`Canvas file upload failed: ${upload.stderr}`);
  let uploaded;
  try { uploaded = JSON.parse(upload.stdout); } catch { throw new Error(`Canvas returned a non-JSON upload response: ${upload.stdout.slice(0, 500)}`); }
  if (!uploaded.id) throw new Error(`Canvas upload response is missing a file id: ${upload.stdout.slice(0, 500)}`);
  const record = {
    courseId,
    fileId: uploaded.id,
    displayName: uploaded.display_name ?? uploaded.filename,
    url: uploaded.url,
    previewUrl: uploaded.preview_url,
    updatedAt: uploaded.updated_at,
    size: uploaded.size,
    contentType: uploaded["content-type"] ?? uploaded.content_type,
  };
  await writeFile(publicationFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ uploaded: true, fileId: record.fileId, displayName: record.displayName, size: record.size, contentType: record.contentType }, null, 2));
  process.exit(0);
}

if (mode === "--apply-page") {
  const siteVersion = process.argv[3];
  if (!/^\d+$/.test(siteVersion ?? "")) throw new Error("Pass the deployed Sites version number after --apply-page.");
  const publication = JSON.parse(await readFile(publicationFile, "utf8"));
  const { page, module, item, pageSlug } = await context();
  const lessonUrl = `https://cpsc481-introduction-to-ai.winniechef.chatgpt.site/lessons/08?v=${siteVersion}`;
  const marker = /(?:<!-- lesson-08-video:start -->\s*)?<div\b[^>]*id=["']lesson-08-video["'][^>]*>[\s\S]*?<\/div>\s*(?:<!-- lesson-08-video:end -->)?/i;
  const videoBlock = `<div id="lesson-08-video" style="margin:16px 0;padding:16px;border:1px solid #d7dde8;border-radius:10px;background:#f7f9fc;">\n  <h3 style="margin:0 0 8px;">Lesson 8 lecture video</h3>\n  <p style="margin:0 0 10px;">Alpha-Beta Pruning and Modern Game Search &middot; 48 minutes &middot; captions included</p>\n  <p style="margin:0;"><a href="${publication.previewUrl}" target="_blank">Watch the lecture video in Canvas</a></p>\n</div>`;
  let body = page.body ?? "";
  body = marker.test(body) ? body.replace(marker, videoBlock) : body.replace(/(<iframe\b)/i, `${videoBlock}\n$1`);
  body = body.replace(/https:\/\/cpsc481-introduction-to-ai\.winniechef\.chatgpt\.site\/(?:meetings\/08|lessons\/08)(?:\?v=\d+)?/g, lessonUrl);
  await request(`courses/${courseId}/pages/${pageSlug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wiki_page: { body, published: true } }),
  });
  await request(`courses/${courseId}/modules/${module.id}/items/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ module_item: { published: true } }),
  });
  await request(`courses/${courseId}/modules/${module.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ module: { published: true } }),
  });
  const verified = await context();
  const storedBody = verified.page.body ?? "";
  const storedPreviewPath = `/courses/${courseId}/files/${publication.fileId}/file_preview`;
  console.log(JSON.stringify({
    applied: true,
    pageSlug,
    moduleName: verified.module.name,
    lessonUrl,
    siteEmbedExact: storedBody.includes(lessonUrl),
    videoLinkExact: storedBody.includes(storedPreviewPath),
    videoBlockCount: (storedBody.match(/Lesson 8 lecture video/g) ?? []).length,
    pagePublished: verified.page.published,
    modulePublished: verified.module.published,
    itemPublished: verified.item.published,
  }, null, 2));
  process.exit(0);
}

throw new Error(`Unknown mode: ${mode}`);

