import fs from "node:fs";
import path from "node:path";

const COURSE_ID = "3586560";
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const COURSE_FILE = path.resolve("app", "data", "course.ts");
const PDF_DIR = path.resolve("..", "output", "canvas-pdfs");
const CANVAS_FOLDER_PATH = "course files/CPSC 481 Meeting Slides";

const apply = process.argv.includes("--apply");
const verify = process.argv.includes("--verify");
const uploadOnly = process.argv.includes("--upload-only");

const token = fs
  .readFileSync(TOKEN_FILE, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .at(-1);

if (!token || token.toLowerCase().includes("canvas api")) {
  throw new Error(`Could not find a Canvas API token in ${TOKEN_FILE}`);
}

const source = fs.readFileSync(COURSE_FILE, "utf8");

function decodeText(text) {
  return text
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\'/g, "'");
}

function extractMeetings(tsSource) {
  const meetingStartPattern = /^\s*\{\s*$/gm;
  const meetings = [];
  let match;

  while ((match = meetingStartPattern.exec(tsSource))) {
    const start = match.index;
    const next = tsSource.indexOf("\n  {", start + 1);
    const end = next === -1 ? tsSource.indexOf("\n];", start) : next;
    if (end === -1) continue;
    const block = tsSource.slice(start, end);
    const header = block.match(/id:\s*(\d+),\s*week:\s*(\d+),\s*module:\s*"([^"]+)"/);
    const title = block.match(/title:\s*"([^"]+)"/);
    const question = block.match(/question:\s*"([^"]+)"/);
    if (!header || !title || !question) continue;
    meetings.push({
      id: Number(header[1]),
      week: Number(header[2]),
      module: decodeText(header[3]),
      title: decodeText(title[1]),
      question: decodeText(question[1]),
    });
  }

  return meetings.sort((a, b) => a.id - b.id);
}

const meetings = extractMeetings(source);
if (meetings.length !== 30) {
  throw new Error(`Expected 30 meetings, found ${meetings.length}`);
}

const weeks = Array.from(
  meetings.reduce((map, meeting) => {
    if (!map.has(meeting.week)) {
      map.set(meeting.week, {
        week: meeting.week,
        module: meeting.module,
        meetings: [],
      });
    }
    map.get(meeting.week).meetings.push(meeting);
    return map;
  }, new Map()).values(),
);

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

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options.method ?? "GET"} ${endpoint} failed: ${response.status} ${body.slice(0, 500)}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function canvasPaginate(endpoint) {
  const results = [];
  let nextUrl = apiUrl(`${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100`);

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GET ${endpoint} failed: ${response.status} ${body.slice(0, 500)}`);
    }
    results.push(...(await response.json()));
    const link = response.headers.get("link") ?? "";
    const next = link
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.includes('rel="next"'));
    nextUrl = next ? next.match(/<([^>]+)>/)?.[1] : null;
  }

  return results;
}

function pageSlug(meeting) {
  return `cpsc-481-meeting-${String(meeting.id).padStart(2, "0")}-slides`;
}

function pageTitle(meeting) {
  return `Meeting ${String(meeting.id).padStart(2, "0")}: ${meeting.title}`;
}

function moduleTitle(week) {
  return `Week ${String(week.week).padStart(2, "0")}: ${week.module}`;
}

function pdfFileName(meeting) {
  return `cpsc481-meeting-${String(meeting.id).padStart(2, "0")}.pdf`;
}

function pdfFilePath(meeting) {
  return path.join(PDF_DIR, pdfFileName(meeting));
}

function canvasFilePreviewUrl(file) {
  return `${CANVAS_BASE_URL}/courses/${COURSE_ID}/files/${file.id}/preview`;
}

function canvasFileDownloadUrl(file) {
  return `${CANVAS_BASE_URL}/courses/${COURSE_ID}/files/${file.id}?wrap=1`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pageBody(meeting, file) {
  const previewUrl = canvasFilePreviewUrl(file);
  const openUrl = canvasFileDownloadUrl(file);
  return `
<div style="margin: 0 0 16px 0;">
  <p><strong>${escapeHtml(pageTitle(meeting))}</strong></p>
  <p>${escapeHtml(meeting.question)}</p>
  <p><a href="${openUrl}" target="_blank" rel="noopener">Open the Canvas-hosted slides PDF in a new tab</a></p>
</div>
<iframe
  src="${previewUrl}"
  width="100%"
  height="760"
  style="border: 1px solid #d7dde8; border-radius: 8px; background: #ffffff;"
  allowfullscreen>
</iframe>
`.trim();
}

function assertLocalPdfs() {
  const missing = meetings.filter((meeting) => !fs.existsSync(pdfFilePath(meeting)));
  if (missing.length) {
    throw new Error(`Missing PDFs: ${missing.map((meeting) => pdfFileName(meeting)).join(", ")}`);
  }
}

async function uploadPdf(meeting) {
  const filePath = pdfFilePath(meeting);
  const fileName = pdfFileName(meeting);
  const { size } = fs.statSync(filePath);

  const init = await canvasFetch(`courses/${COURSE_ID}/files`, {
    method: "POST",
    body: JSON.stringify({
      name: fileName,
      size,
      content_type: "application/pdf",
      parent_folder_path: CANVAS_FOLDER_PATH,
      on_duplicate: "overwrite",
    }),
  });

  const form = new FormData();
  for (const [key, value] of Object.entries(init.upload_params ?? {})) {
    form.append(key, value);
  }
  const bytes = fs.readFileSync(filePath);
  form.append("file", new Blob([bytes], { type: "application/pdf" }), fileName);

  const uploadResponse = await fetch(init.upload_url, {
    method: "POST",
    body: form,
  });

  if (!uploadResponse.ok) {
    const body = await uploadResponse.text();
    throw new Error(`Upload ${fileName} failed: ${uploadResponse.status} ${body.slice(0, 500)}`);
  }

  return uploadResponse.json();
}

async function getCourseFilesByName() {
  const files = await canvasPaginate(`courses/${COURSE_ID}/files`);
  return new Map(files.map((file) => [file.display_name ?? file.filename, file]));
}

async function verifyCanvasState() {
  const [modules, pages, files] = await Promise.all([
    canvasPaginate(`courses/${COURSE_ID}/modules`),
    canvasPaginate(`courses/${COURSE_ID}/pages`),
    canvasPaginate(`courses/${COURSE_ID}/files`),
  ]);

  const fileNames = new Set(files.map((file) => file.display_name ?? file.filename));
  const uploadedPdfs = meetings.filter((meeting) => fileNames.has(pdfFileName(meeting)));
  const meetingPages = pages.filter((page) => /^Meeting \d\d:/.test(page.title));
  const weeklyModules = modules.filter((module) => /^Week \d\d:/.test(module.name));

  let pdfIframePages = 0;
  let chatgptIframePages = 0;
  for (const page of meetingPages) {
    const fullPage = await canvasFetch(`courses/${COURSE_ID}/pages/${page.url}`);
    const body = fullPage.body ?? "";
    if (body.includes("/files/") && body.includes("/preview")) pdfIframePages += 1;
    if (body.includes("chatgpt.site")) chatgptIframePages += 1;
  }

  let meetingPageItems = 0;
  for (const module of weeklyModules) {
    const items = await canvasPaginate(`courses/${COURSE_ID}/modules/${module.id}/items`);
    meetingPageItems += items.filter((item) => item.type === "Page" && /^Meeting \d\d:/.test(item.title)).length;
  }

  console.log(`Canvas PDFs found by filename: ${uploadedPdfs.length}`);
  console.log(`Weekly modules: ${weeklyModules.length}`);
  console.log(`Meeting pages in course: ${meetingPages.length}`);
  console.log(`Meeting page items in modules: ${meetingPageItems}`);
  console.log(`Meeting pages with Canvas PDF iframe: ${pdfIframePages}`);
  console.log(`Meeting pages still referencing chatgpt.site: ${chatgptIframePages}`);
}

async function main() {
  assertLocalPdfs();

  if (verify) {
    await verifyCanvasState();
    return;
  }

  console.log("[DRY RUN] Local PDFs ready for Canvas upload/update.");
  console.log(`Course: ${COURSE_ID}`);
  console.log(`PDF folder: ${PDF_DIR}`);
  console.log(`Canvas folder path: ${CANVAS_FOLDER_PATH}`);
  console.log(`PDFs to upload: ${meetings.length}`);
  console.log(`Pages to update: ${meetings.length}`);
  if (!apply) return;

  console.log("");
  console.log("[APPLY] Uploading PDFs and updating Canvas meeting pages.");

  const uploadedByMeetingId = new Map();
  for (const meeting of meetings) {
    const file = await uploadPdf(meeting);
    uploadedByMeetingId.set(meeting.id, file);
    console.log(`Uploaded ${pdfFileName(meeting)} -> Canvas file ${file.id}`);
  }

  if (uploadOnly) return;

  const [existingModules, existingPages] = await Promise.all([
    canvasPaginate(`courses/${COURSE_ID}/modules`),
    canvasPaginate(`courses/${COURSE_ID}/pages`),
  ]);

  const modulesByName = new Map(existingModules.map((module) => [module.name, module]));
  const pagesByUrl = new Map(existingPages.map((page) => [page.url, page]));
  const pagesByTitle = new Map(existingPages.map((page) => [page.title, page]));

  for (const week of weeks) {
    const name = moduleTitle(week);
    const module = modulesByName.get(name);
    if (!module) {
      throw new Error(`Missing Canvas module: ${name}. Run sync_canvas_iframe_modules.mjs first.`);
    }

    const moduleItems = await canvasPaginate(`courses/${COURSE_ID}/modules/${module.id}/items`);
    const modulePageUrls = new Set(moduleItems.filter((item) => item.type === "Page").map((item) => item.page_url));

    for (const meeting of week.meetings) {
      const slug = pageSlug(meeting);
      const title = pageTitle(meeting);
      const file = uploadedByMeetingId.get(meeting.id);
      const body = pageBody(meeting, file);
      let page = pagesByUrl.get(slug) ?? pagesByTitle.get(title);

      if (!page) {
        page = await canvasFetch(`courses/${COURSE_ID}/pages`, {
          method: "POST",
          body: JSON.stringify({
            wiki_page: {
              title,
              body,
              published: false,
              editing_roles: "teachers",
            },
          }),
        });
        pagesByUrl.set(page.url, page);
        pagesByTitle.set(page.title, page);
        console.log(`Created page: ${title}`);
      } else {
        await canvasFetch(`courses/${COURSE_ID}/pages/${page.url}`, {
          method: "PUT",
          body: JSON.stringify({
            wiki_page: {
              title,
              body,
              published: false,
              editing_roles: "teachers",
            },
          }),
        });
        pagesByUrl.set(page.url, { ...page, title });
        pagesByTitle.set(title, { ...page, title });
        console.log(`Updated page: ${title}`);
      }

      if (!modulePageUrls.has(page.url)) {
        await canvasFetch(`courses/${COURSE_ID}/modules/${module.id}/items`, {
          method: "POST",
          body: JSON.stringify({
            module_item: {
              title,
              type: "Page",
              page_url: page.url,
              indent: 0,
            },
          }),
        });
        console.log(`Added ${title} to ${name}`);
      }
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
