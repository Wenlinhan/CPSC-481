import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const SOURCE_COURSE_ID = "3328459";
const TARGET_COURSE_ID = "3586560";
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const apply = process.argv.includes("--apply");

const token = fs.readFileSync(TOKEN_FILE, "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).at(-1);
if (!token || token.toLowerCase().includes("canvas api")) throw new Error(`Could not find a Canvas API token in ${TOKEN_FILE}`);

const desiredModules = [
  { position: 1, name: "Module 1: course overview and prerequisites", current: null },
  { position: 2, name: "Module 2: L01-Introduction", current: "Week 01: AI Foundations" },
  { position: 3, name: "Module 3: L02-State Space Search", current: "Week 02: State-Space Search" },
  { position: 4, name: "Module 4: L03-Heuristic, HillClimbing&SA", current: "Week 03: Informed and Local Search" },
  { position: 5, name: "Module 5: L04-BFS&AStar", current: "Week 04: Adversarial Search" },
];

const lessons = [
  [1, "AI Applications, History, Intelligence, and Definitions"],
  [2, "Agents, Task Environments, Agent Types, and the Turing Test"],
  [3, "Problem Formulation and Breadth-First Search"],
  [4, "Depth-First, Uniform-Cost, and Search Evaluation"],
  [5, "Heuristic Functions, Hill Climbing, and Simulated Annealing"],
  [6, "Best-First Search, A*, and Heuristic Quality"],
  [7, "Game Trees, Minimax, and Evaluation Functions"],
  [8, "Alpha-Beta Pruning and Modern Game Search"],
].map(([id, topic]) => ({ id, topic, title: `Lesson ${id}: ${topic}` }));

function apiUrl(endpoint) {
  return `${CANVAS_BASE_URL}/api/v1/${endpoint.replace(/^\//, "")}`;
}

async function canvasFetch(endpoint, options = {}) {
  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options.method ?? "GET"} ${endpoint} failed: ${response.status} ${body.slice(0, 500)}`);
  }
  return response.status === 204 ? null : response.json();
}

async function paginate(endpoint) {
  const results = [];
  let nextUrl = apiUrl(`${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100`);
  while (nextUrl) {
    const response = await fetch(nextUrl, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GET ${endpoint} failed: ${response.status} ${body.slice(0, 500)}`);
    }
    results.push(...(await response.json()));
    const next = (response.headers.get("link") ?? "").split(",").map((part) => part.trim()).find((part) => part.includes('rel="next"'));
    nextUrl = next?.match(/<([^>]+)>/)?.[1] ?? null;
  }
  return results;
}

function digest(value) {
  return crypto.createHash("sha256").update(String(value ?? "")).digest("hex");
}

async function getModuleItems(courseId, moduleId) {
  return paginate(`courses/${courseId}/modules/${moduleId}/items`);
}

async function loadSourceModuleOne() {
  const modules = await paginate(`courses/${SOURCE_COURSE_ID}/modules`);
  const module = modules.find((candidate) => candidate.position === 1 && candidate.name === "Module 1: course overview and prerequisites");
  if (!module) throw new Error("Reference Module 1 not found");
  const items = await getModuleItems(SOURCE_COURSE_ID, module.id);
  const detailed = [];
  for (const item of items.sort((a, b) => a.position - b.position)) {
    if (item.type === "Page") {
      detailed.push({ item, content: await canvasFetch(`courses/${SOURCE_COURSE_ID}/pages/${item.page_url}`) });
    } else if (item.type === "Assignment") {
      detailed.push({ item, content: await canvasFetch(`courses/${SOURCE_COURSE_ID}/assignments/${item.content_id}`) });
    } else if (item.type === "Discussion") {
      detailed.push({ item, content: await canvasFetch(`courses/${SOURCE_COURSE_ID}/discussion_topics/${item.content_id}`) });
    } else {
      throw new Error(`Unsupported reference Module 1 item type: ${item.type}`);
    }
  }
  return { module, items: detailed };
}

async function createOrReuseContent(source, targetIndex) {
  const { item, content } = source;
  if (item.type === "Page") {
    const existing = targetIndex.pages.find((candidate) => candidate.title.trim() === item.title.trim());
    if (existing) return { type: "Page", page_url: existing.url, contentId: null, reused: true };
    const created = await canvasFetch(`courses/${TARGET_COURSE_ID}/pages`, {
      method: "POST",
      body: JSON.stringify({ wiki_page: { title: item.title, body: content.body ?? "", published: true, editing_roles: "teachers" } }),
    });
    targetIndex.pages.push(created);
    return { type: "Page", page_url: created.url, contentId: null, reused: false };
  }
  if (item.type === "Assignment") {
    const existing = targetIndex.assignments.find((candidate) => candidate.name.trim() === item.title.trim());
    if (existing) return { type: "Assignment", page_url: null, contentId: existing.id, reused: true };
    const created = await canvasFetch(`courses/${TARGET_COURSE_ID}/assignments`, {
      method: "POST",
      body: JSON.stringify({ assignment: {
        name: content.name,
        description: content.description ?? "",
        points_possible: content.points_possible ?? 0,
        grading_type: content.grading_type ?? "points",
        submission_types: content.submission_types ?? ["none"],
        allowed_extensions: content.allowed_extensions ?? [],
        omit_from_final_grade: content.omit_from_final_grade ?? false,
        published: true,
      } }),
    });
    targetIndex.assignments.push(created);
    return { type: "Assignment", page_url: null, contentId: created.id, reused: false };
  }
  const existing = targetIndex.discussions.find((candidate) => candidate.title.trim() === item.title.trim());
  if (existing) return { type: "Discussion", page_url: null, contentId: existing.id, reused: true };
  const created = await canvasFetch(`courses/${TARGET_COURSE_ID}/discussion_topics`, {
    method: "POST",
    body: JSON.stringify({
      title: content.title,
      message: content.message ?? "",
      discussion_type: content.discussion_type ?? "threaded",
      published: true,
      require_initial_post: content.require_initial_post ?? false,
      allow_rating: content.allow_rating ?? false,
      only_graders_can_rate: content.only_graders_can_rate ?? false,
      sort_by_rating: content.sort_by_rating ?? false,
    }),
  });
  targetIndex.discussions.push(created);
  return { type: "Discussion", page_url: null, contentId: created.id, reused: false };
}

async function cloneModuleOne(source, targetModule, targetIndex) {
  const currentItems = await getModuleItems(TARGET_COURSE_ID, targetModule.id);
  for (const sourceItem of source.items) {
    const existingItem = currentItems.find((candidate) => candidate.title.trim() === sourceItem.item.title.trim() && candidate.type === sourceItem.item.type);
    if (existingItem) {
      await canvasFetch(`courses/${TARGET_COURSE_ID}/modules/${targetModule.id}/items/${existingItem.id}`, {
        method: "PUT",
        body: JSON.stringify({ module_item: { position: sourceItem.item.position, published: true } }),
      });
      console.log(`  Reused Module 1 item: ${sourceItem.item.title}`);
      continue;
    }
    const target = await createOrReuseContent(sourceItem, targetIndex);
    const moduleItem = {
      title: sourceItem.item.title,
      type: target.type,
      position: sourceItem.item.position,
      published: true,
      indent: sourceItem.item.indent ?? 0,
    };
    if (target.page_url) moduleItem.page_url = target.page_url;
    if (target.contentId) moduleItem.content_id = target.contentId;
    await canvasFetch(`courses/${TARGET_COURSE_ID}/modules/${targetModule.id}/items`, {
      method: "POST",
      body: JSON.stringify({ module_item: moduleItem }),
    });
    console.log(`  Added Module 1 item: ${sourceItem.item.title} (${target.reused ? "reused content" : "cloned content"})`);
  }
}

async function main() {
  const [sourceModuleOne, targetModules, targetPages, targetAssignments, targetDiscussions] = await Promise.all([
    loadSourceModuleOne(),
    paginate(`courses/${TARGET_COURSE_ID}/modules`),
    paginate(`courses/${TARGET_COURSE_ID}/pages`),
    paginate(`courses/${TARGET_COURSE_ID}/assignments`),
    paginate(`courses/${TARGET_COURSE_ID}/discussion_topics`),
  ]);

  const modulePlans = desiredModules.map((desired) => {
    const module = targetModules.find((candidate) => candidate.name === desired.name)
      ?? (desired.current ? targetModules.find((candidate) => candidate.name === desired.current) : null);
    return { desired, module };
  });
  const targetIndex = { pages: targetPages, assignments: targetAssignments, discussions: targetDiscussions };
  const lessonPlans = [];
  for (const lesson of lessons) {
    const oldPrefix = `Meeting ${String(lesson.id).padStart(2, "0")}:`;
    const pageSummary = targetPages.find((candidate) => candidate.title.startsWith(oldPrefix) || candidate.title === lesson.title);
    if (!pageSummary) throw new Error(`Target page not found for Meeting ${String(lesson.id).padStart(2, "0")}`);
    const page = await canvasFetch(`courses/${TARGET_COURSE_ID}/pages/${pageSummary.url}`);
    const expectedModule = modulePlans[Math.floor((lesson.id - 1) / 2) + 1]?.module;
    if (!expectedModule) throw new Error(`Target module not found for Lesson ${lesson.id}`);
    const items = await getModuleItems(TARGET_COURSE_ID, expectedModule.id);
    const item = items.find((candidate) => candidate.type === "Page" && candidate.page_url === pageSummary.url);
    if (!item) throw new Error(`Module item not found for ${page.title}`);
    lessonPlans.push({ lesson, page, item, module: expectedModule, bodyHash: digest(page.body ?? "") });
  }

  console.log(`${apply ? "[APPLY]" : "[DRY RUN]"} Canvas redesign for Modules 1-5`);
  console.log(`Reference Module 1: ${sourceModuleOne.items.length} non-lecture item(s)`);
  for (const plan of modulePlans) {
    console.log(`- ${plan.module ? `Rename/use module ${plan.module.id}` : "Create module"}: ${plan.desired.name} at position ${plan.desired.position}`);
  }
  for (const plan of lessonPlans) {
    console.log(`- ${plan.page.title} -> ${plan.lesson.title}; body sha256=${plan.bodyHash}`);
  }
  console.log("- Meetings 09-30: unchanged");
  if (!apply) return;

  const backupDir = path.resolve("output", "canvas-backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(backupDir, `modules-01-05-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(backupPath, JSON.stringify({
    captured_at: new Date().toISOString(),
    target_course_id: TARGET_COURSE_ID,
    modules: targetModules,
    lessons: lessonPlans.map(({ lesson, page, item, module, bodyHash }) => ({ lesson, page, item, module, bodyHash })),
  }, null, 2));
  console.log(`Backup: ${backupPath}`);

  let moduleOne = modulePlans[0].module;
  if (!moduleOne) {
    moduleOne = await canvasFetch(`courses/${TARGET_COURSE_ID}/modules`, {
      method: "POST",
      body: JSON.stringify({ module: { name: desiredModules[0].name, position: 1, published: true } }),
    });
    console.log(`Created ${desiredModules[0].name}`);
  } else {
    await canvasFetch(`courses/${TARGET_COURSE_ID}/modules/${moduleOne.id}`, {
      method: "PUT",
      body: JSON.stringify({ module: { name: desiredModules[0].name, position: 1, published: true } }),
    });
  }
  await cloneModuleOne(sourceModuleOne, moduleOne, targetIndex);
  await canvasFetch(`courses/${TARGET_COURSE_ID}/modules/${moduleOne.id}`, {
    method: "PUT",
    body: JSON.stringify({ module: { name: desiredModules[0].name, position: 1, published: true } }),
  });

  // Normalize positions after Module 1 exists. Creating a module shifts existing
  // positions, so positioning Modules 2-5 before creation is not stable.
  for (const plan of modulePlans.slice(1)) {
    await canvasFetch(`courses/${TARGET_COURSE_ID}/modules/${plan.module.id}`, {
      method: "PUT",
      body: JSON.stringify({ module: { name: plan.desired.name, position: plan.desired.position, published: true } }),
    });
  }

  for (const plan of lessonPlans) {
    await canvasFetch(`courses/${TARGET_COURSE_ID}/pages/${plan.page.url}`, {
      method: "PUT",
      body: JSON.stringify({ wiki_page: { title: plan.lesson.title, published: true } }),
    });
    await canvasFetch(`courses/${TARGET_COURSE_ID}/modules/${plan.module.id}/items/${plan.item.id}`, {
      method: "PUT",
      body: JSON.stringify({ module_item: { title: plan.lesson.title, position: plan.item.position, published: true } }),
    });
  }

  const readbackModules = await paginate(`courses/${TARGET_COURSE_ID}/modules`);
  for (const desired of desiredModules) {
    const module = readbackModules.find((candidate) => candidate.name === desired.name);
    if (!module || module.position !== desired.position || !module.published) throw new Error(`Module readback failed: ${desired.name}`);
  }
  const readbackModuleOne = readbackModules.find((candidate) => candidate.name === desiredModules[0].name);
  const readbackModuleOneItems = await getModuleItems(TARGET_COURSE_ID, readbackModuleOne.id);
  if (readbackModuleOneItems.length !== sourceModuleOne.items.length || readbackModuleOneItems.some((item) => !item.published)) {
    throw new Error("Module 1 item readback failed");
  }
  for (const plan of lessonPlans) {
    const page = await canvasFetch(`courses/${TARGET_COURSE_ID}/pages/${plan.page.url}`);
    const item = await canvasFetch(`courses/${TARGET_COURSE_ID}/modules/${plan.module.id}/items/${plan.item.id}`);
    if (page.title !== plan.lesson.title || item.title !== plan.lesson.title || !page.published || !item.published) {
      throw new Error(`Lesson readback failed: ${plan.lesson.title}`);
    }
    if (digest(page.body ?? "") !== plan.bodyHash) throw new Error(`Page body changed unexpectedly: ${plan.lesson.title}`);
  }
  console.log("VERIFIED: Modules 1-5 published; Module 1 cloned; Lessons 1-8 renamed; all eight page bodies unchanged.");
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exit(1);
});
