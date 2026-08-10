import fs from "node:fs";
import path from "node:path";

const COURSE_ID = "3586560";
const MODULE_IDS = ["9926401", "9926402", "9926405"];
const CANVAS_BASE_URL = "https://csufullerton.instructure.com";
const TOKEN_FILE = path.resolve("..", "Canvas API.txt");
const OUTPUT_DIR = path.resolve("output", "canvas-backups");

const token = fs.readFileSync(TOKEN_FILE, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .at(-1);

if (!token) throw new Error(`Canvas token missing from ${TOKEN_FILE}`);

const headers = { Authorization: `Bearer ${token}` };
const apiUrl = (endpoint) => `${CANVAS_BASE_URL}/api/v1/${endpoint.replace(/^\//, "")}`;

async function request(endpoint) {
  const response = await fetch(apiUrl(endpoint), { headers });
  if (!response.ok) throw new Error(`${endpoint}: ${response.status} ${(await response.text()).slice(0, 300)}`);
  return response.json();
}

async function paginate(endpoint) {
  const rows = [];
  let next = apiUrl(`${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100`);
  while (next) {
    const response = await fetch(next, { headers });
    if (!response.ok) throw new Error(`${endpoint}: ${response.status} ${(await response.text()).slice(0, 300)}`);
    rows.push(...await response.json());
    next = (response.headers.get("link") ?? "")
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.includes('rel="next"'))
      ?.match(/<([^>]+)>/)?.[1] ?? null;
  }
  return rows;
}

const modules = [];
for (const moduleId of MODULE_IDS) {
  const moduleRecord = await request(`courses/${COURSE_ID}/modules/${moduleId}`);
  const items = await paginate(`courses/${COURSE_ID}/modules/${moduleId}/items`);
  const details = [];
  for (const item of items) {
    let content = null;
    if (item.type === "Page") content = await request(`courses/${COURSE_ID}/pages/${item.page_url}`);
    if (item.type === "Quiz") {
      const quiz = await request(`courses/${COURSE_ID}/quizzes/${item.content_id}`);
      const questions = await paginate(`courses/${COURSE_ID}/quizzes/${item.content_id}/questions`);
      content = { quiz, questions };
    }
    if (item.type === "Discussion") content = await request(`courses/${COURSE_ID}/discussion_topics/${item.content_id}`);
    if (item.type === "File") content = await request(`files/${item.content_id}`);
    details.push({ item, content });
  }
  modules.push({ module: moduleRecord, items: details });
}

const [course, syllabus, assignmentGroups, assignments, modulesAll, pages, files, fileQuota] = await Promise.all([
  request(`courses/${COURSE_ID}`),
  request(`courses/${COURSE_ID}?include[]=syllabus_body`),
  paginate(`courses/${COURSE_ID}/assignment_groups?include[]=assignments`),
  paginate(`courses/${COURSE_ID}/assignments?include[]=submission_types`),
  paginate(`courses/${COURSE_ID}/modules`),
  paginate(`courses/${COURSE_ID}/pages`),
  paginate(`courses/${COURSE_ID}/files`),
  request(`courses/${COURSE_ID}/files/quota`),
]);
const [finalStudyGuide, finalQuiz, finalQuizQuestions, finalQuizGroups, finalBank, finalBankQuestions] = await Promise.all([
  request(`courses/${COURSE_ID}/pages/final-exam-study-guide`),
  request(`courses/${COURSE_ID}/quizzes/9299958`),
  paginate(`courses/${COURSE_ID}/quizzes/9299958/questions`),
  request(`courses/${COURSE_ID}/quizzes/9299958/groups`),
  request(`question_banks/10458481?include_question_count=true`),
  paginate(`question_banks/10458481/questions`),
]);

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = path.join(OUTPUT_DIR, `before-module9-10-restructure-${timestamp}.json`);
fs.writeFileSync(outputPath, JSON.stringify({
  captured_at: new Date().toISOString(),
  course_id: COURSE_ID,
  course,
  syllabus,
  assignment_groups: assignmentGroups,
  assignments,
  modules_all: modulesAll,
  pages,
  files,
  file_quota: fileQuota,
  target_modules: modules,
  final_assessment: {
    study_guide: finalStudyGuide,
    quiz: finalQuiz,
    quiz_questions: finalQuizQuestions,
    quiz_groups: finalQuizGroups.quiz_groups,
    question_bank: finalBank,
    question_bank_questions: finalBankQuestions,
  },
}, null, 2));

console.log(outputPath);
