import fs from "node:fs";
import path from "node:path";

const COURSE_ID = "3586560";
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const SITE_URL = "https://cpsc481-introduction-to-ai.winniechef.chatgpt.site";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const COURSE_FILE = path.resolve("app", "data", "course.ts");

const apply = process.argv.includes("--apply");
const verify = process.argv.includes("--verify");

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
  if (meeting.id <= 8) return `Lesson ${meeting.id}: ${meeting.title}`;
  return `Meeting ${String(meeting.id).padStart(2, "0")}: ${meeting.title}`;
}

function moduleTitle(week) {
  const redesigned = new Map([
    [1, "Module 2: L01-Introduction"],
    [2, "Module 3: L02-State Space Search"],
    [3, "Module 4: L03-Heuristic, HillClimbing&SA"],
    [4, "Module 5: L04-BFS&AStar"],
  ]);
  if (redesigned.has(week.week)) return redesigned.get(week.week);
  return `Week ${String(week.week).padStart(2, "0")}: ${week.module}`;
}

function meetingUrl(meeting) {
  return `${SITE_URL}/meetings/${String(meeting.id).padStart(2, "0")}`;
}

function pageBody(meeting) {
  const url = meetingUrl(meeting);
  return `
<div style="margin: 0 0 16px 0;">
  <p><strong>${pageTitle(meeting)}</strong></p>
  <p>${meeting.question}</p>
  <p><a href="${url}" target="_blank" rel="noopener">Open the slides in a new tab</a></p>
</div>
<iframe
  src="${url}"
  width="100%"
  height="720"
  style="border: 1px solid #d7dde8; border-radius: 8px; background: #ffffff;"
  allowfullscreen>
</iframe>
`.trim();
}

function logDryRun() {
  console.log("[DRY RUN] No Canvas changes will be made.");
  console.log(`Course: ${COURSE_ID}`);
  console.log(`Modules to sync: ${weeks.length}`);
  console.log(`Pages to sync: ${meetings.length}`);
  for (const week of weeks) {
    console.log(`- ${moduleTitle(week)}`);
    for (const meeting of week.meetings) {
      console.log(`  - ${pageTitle(meeting)} -> ${meetingUrl(meeting)}`);
    }
  }
}

async function main() {
  if (verify) {
    const [existingModules, existingPages] = await Promise.all([
      canvasPaginate(`courses/${COURSE_ID}/modules`),
      canvasPaginate(`courses/${COURSE_ID}/pages`),
    ]);
    const weeklyModules = existingModules
      .filter((module) => /^(?:Module [2-5]:|Week \d\d:)/.test(module.name))
      .sort((a, b) => a.position - b.position);
    let meetingPageItems = 0;
    let iframePages = 0;
    console.log(`Weekly modules: ${weeklyModules.length}`);
    for (const module of weeklyModules) {
      const items = await canvasPaginate(`courses/${COURSE_ID}/modules/${module.id}/items`);
      const pages = items.filter((item) => item.type === "Page" && /^(?:Meeting \d\d:|Lesson [1-8]:)/.test(item.title));
      meetingPageItems += pages.length;
      for (const page of pages) {
        const fullPage = await canvasFetch(`courses/${COURSE_ID}/pages/${page.page_url}`);
        if ((fullPage.body ?? "").includes("<iframe") && (fullPage.body ?? "").includes(SITE_URL)) {
          iframePages += 1;
        }
      }
      console.log(`${module.name}: ${pages.length} meeting page item(s), published=${module.published}`);
    }
    const meetingPages = existingPages.filter((page) => /^(?:Meeting \d\d:|Lesson [1-8]:)/.test(page.title));
    console.log(`Meeting page items in modules: ${meetingPageItems}`);
    console.log(`Meeting pages in course: ${meetingPages.length}`);
    console.log(`Meeting pages with iframe body: ${iframePages}`);
    return;
  }

  logDryRun();
  if (!apply) return;

  console.log("");
  console.log("[APPLY] Writing Canvas modules and iframe pages.");

  const [existingModules, existingPages] = await Promise.all([
    canvasPaginate(`courses/${COURSE_ID}/modules`),
    canvasPaginate(`courses/${COURSE_ID}/pages`),
  ]);

  const modulesByName = new Map(existingModules.map((module) => [module.name, module]));
  const pagesByUrl = new Map(existingPages.map((page) => [page.url, page]));
  const pagesByTitle = new Map(existingPages.map((page) => [page.title, page]));

  for (const week of weeks) {
    const name = moduleTitle(week);
    let module = modulesByName.get(name);
    if (!module) {
      module = await canvasFetch(`courses/${COURSE_ID}/modules`, {
        method: "POST",
        body: JSON.stringify({
          module: {
            name,
            position: week.week,
            published: true,
          },
        }),
      });
      modulesByName.set(name, module);
      console.log(`Created module: ${name}`);
    } else {
      console.log(`Using module: ${name}`);
    }

    const moduleItems = await canvasPaginate(`courses/${COURSE_ID}/modules/${module.id}/items`);
    const modulePageUrls = new Set(moduleItems.filter((item) => item.type === "Page").map((item) => item.page_url));

    for (const meeting of week.meetings) {
      const slug = pageSlug(meeting);
      const title = pageTitle(meeting);
      const body = pageBody(meeting);
      let page = pagesByUrl.get(slug) ?? pagesByTitle.get(title);

      if (!page) {
        page = await canvasFetch(`courses/${COURSE_ID}/pages`, {
          method: "POST",
          body: JSON.stringify({
            wiki_page: {
              title,
              body,
              published: true,
              editing_roles: "teachers",
            },
          }),
        });
        pagesByUrl.set(page.url, page);
        pagesByTitle.set(page.title, page);
        console.log(`  Created page: ${title}`);
      } else {
        await canvasFetch(`courses/${COURSE_ID}/pages/${page.url}`, {
          method: "PUT",
          body: JSON.stringify({
            wiki_page: {
              title,
              body,
              published: true,
              editing_roles: "teachers",
            },
          }),
        });
        pagesByUrl.set(page.url, { ...page, title });
        pagesByTitle.set(title, { ...page, title });
        console.log(`  Updated page: ${title}`);
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
        console.log(`    Added to module`);
      }
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
