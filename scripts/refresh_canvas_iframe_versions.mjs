import fs from "node:fs";
import path from "node:path";

const COURSE_ID = "3586560";
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const SITE_URL = "https://cpsc481-introduction-to-ai.winniechef.chatgpt.site";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");

const apply = process.argv.includes("--apply");
const version = process.argv.find((arg) => arg.startsWith("--version="))?.split("=")[1];
const meetings = (process.argv.find((arg) => arg.startsWith("--meetings="))?.split("=")[1] ?? "")
  .split(",")
  .map((value) => Number.parseInt(value, 10))
  .filter(Number.isFinite);

if (!version || meetings.length === 0) {
  throw new Error("Usage: node scripts/refresh_canvas_iframe_versions.mjs --version=18 --meetings=2,10 [--apply]");
}

const token = fs
  .readFileSync(TOKEN_FILE, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .at(-1);

if (!token || token.toLowerCase().includes("canvas api")) {
  throw new Error(`Could not find a Canvas API token in ${TOKEN_FILE}`);
}

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

  return response.status === 204 ? null : response.json();
}

async function canvasPaginate(endpoint) {
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
    const nextLink = (response.headers.get("link") ?? "")
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.includes('rel="next"'));
    nextUrl = nextLink?.match(/<([^>]+)>/)?.[1] ?? null;
  }

  return results;
}

function meetingPath(id) {
  return `/meetings/${String(id).padStart(2, "0")}`;
}

function versionBody(body, id) {
  const base = `${SITE_URL}${meetingPath(id)}`;
  const matcher = new RegExp(`${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?v=[^\"'&<\\s]+)?`, "g");
  return body.replace(matcher, `${base}?v=${encodeURIComponent(version)}`);
}

async function main() {
  const [pages, modules] = await Promise.all([
    canvasPaginate(`courses/${COURSE_ID}/pages`),
    canvasPaginate(`courses/${COURSE_ID}/modules`),
  ]);

  for (const id of meetings) {
    const prefix = `Meeting ${String(id).padStart(2, "0")}:`;
    const summary = pages.find((page) => page.title.startsWith(prefix));
    if (!summary) throw new Error(`Canvas page not found: ${prefix}`);

    const page = await canvasFetch(`courses/${COURSE_ID}/pages/${summary.url}`);
    const updatedBody = versionBody(page.body ?? "", id);
    const expectedUrl = `${SITE_URL}${meetingPath(id)}?v=${version}`;
    const changed = updatedBody !== (page.body ?? "");
    const moduleMatches = [];

    for (const module of modules) {
      const items = await canvasPaginate(`courses/${COURSE_ID}/modules/${module.id}/items`);
      const item = items.find((candidate) => candidate.type === "Page" && candidate.page_url === summary.url);
      if (item) moduleMatches.push({ module, item });
    }

    console.log(`${apply ? "[APPLY]" : "[DRY RUN]"} ${page.title}`);
    console.log(`  page published=${page.published}; changed=${changed}; target=${expectedUrl}`);
    for (const { module, item } of moduleMatches) {
      console.log(`  module=${module.name}; module published=${module.published}; item published=${item.published}`);
    }

    if (!apply) continue;
    if (!updatedBody.includes(expectedUrl)) throw new Error(`Expected iframe URL is absent from ${page.title}`);

    await canvasFetch(`courses/${COURSE_ID}/pages/${summary.url}`, {
      method: "PUT",
      body: JSON.stringify({ wiki_page: { body: updatedBody, published: true } }),
    });

    for (const { module, item } of moduleMatches) {
      await canvasFetch(`courses/${COURSE_ID}/modules/${module.id}/items/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ module_item: { published: true } }),
      });
      await canvasFetch(`courses/${COURSE_ID}/modules/${module.id}`, {
        method: "PUT",
        body: JSON.stringify({ module: { published: true } }),
      });
    }

    const readback = await canvasFetch(`courses/${COURSE_ID}/pages/${summary.url}`);
    if (!(readback.body ?? "").includes(expectedUrl)) {
      throw new Error(`Canvas readback failed for ${page.title}`);
    }
    if (!readback.published) throw new Error(`Canvas page remained unpublished: ${page.title}`);

    for (const { module, item } of moduleMatches) {
      const [moduleReadback, itemReadback] = await Promise.all([
        canvasFetch(`courses/${COURSE_ID}/modules/${module.id}`),
        canvasFetch(`courses/${COURSE_ID}/modules/${module.id}/items/${item.id}`),
      ]);
      if (!moduleReadback.published || !itemReadback.published) {
        throw new Error(`Canvas module publication readback failed for ${page.title}`);
      }
    }
    console.log(`  verified=${expectedUrl}; page/module/item published=true`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
