import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const COURSE_ID = "3586560";
const CANVAS = "https://csufullerton.instructure.com";
const SITE = "https://wenlinhan.github.io/CPSC-481";
const MODULE_9_ID = 9926402;
const MODULE_10_ID = 9926401;
const APPLY = process.argv.includes("--apply");
const VERIFY = process.argv.includes("--verify");
const token = fs.readFileSync(path.resolve("..", "Canvas API.txt"), "utf8").split(/\r?\n/).map(value => value.trim()).filter(Boolean).at(-1);
const siteVersion = process.env.CPSC481_SITE_VERSION ?? execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

const lessons = [
  { id: 11, moduleId: MODULE_9_ID, pageItemId: 92176029, pdfItemId: 92320106, videoItemId: 92232101, title: "Probability Foundations and Bayesian Inference", pdf: "output/pdf/lessons/cpsc481-lesson-11-slides.pdf", video: "output/lecture/lesson-11/cpsc-481-lesson-11-video-lecture-canvas.mp4", videoDisplayName: "cpsc-481-lesson-11-video-lecture.mp4", replaceVideoFileId: 283918713, replaceVideoName: "CPSC 481 Lesson 13 - Probability Foundations and Bayesian Inference.mp4" },
  { id: 12, moduleId: MODULE_9_ID, pageItemId: 92176030, pdfItemId: 92320107, videoItemId: 92231782, title: "Conditional Independence, Bayesian Networks, and Naive Bayes", pdf: "output/pdf/lessons/cpsc481-lesson-12-slides.pdf", video: "output/lecture/lesson-12/cpsc-481-lesson-12-video-lecture-canvas.mp4", videoDisplayName: "cpsc-481-lesson-12-video-lecture.mp4", replaceVideoFileId: 283969230, replaceVideoName: "CPSC 481 Lesson 14 - Conditional Independence, Bayesian Networks, and Naive Bayes.mp4" },
  { id: 13, moduleId: MODULE_10_ID, title: "Markov Decision Processes, Policies, and Value Iteration", pdf: "output/pdf/lessons/cpsc481-lesson-13-slides.pdf", video: "output/lecture/lesson-13/cpsc-481-lesson-13-video-lecture-canvas.mp4", videoDisplayName: "cpsc-481-lesson-13-video-lecture.mp4" },
  { id: 14, moduleId: MODULE_10_ID, title: "Reinforcement Learning, Q-Learning, and Exploration", pdf: "output/pdf/lessons/cpsc481-lesson-14-slides.pdf", video: "output/lecture/lesson-14-rl/cpsc-481-lesson-14-video-lecture-canvas.mp4", videoDisplayName: "cpsc-481-lesson-14-video-lecture.mp4" },
];

function apiUrl(endpoint) { return `${CANVAS}/api/v1/${endpoint}`; }
async function request(endpoint, options = {}) {
  const response = await fetch(apiUrl(endpoint), {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`${options.method ?? "GET"} ${endpoint}: ${response.status} ${(await response.text()).slice(0, 800)}`);
  if (response.status === 204) return null;
  return response.json();
}
async function paginate(endpoint) {
  const records = [];
  let next = apiUrl(`${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100`);
  while (next) {
    const response = await fetch(next, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`GET ${endpoint}: ${response.status}`);
    records.push(...await response.json());
    next = (response.headers.get("link") ?? "").split(",").find(value => value.includes('rel="next"'))?.match(/<([^>]+)>/)?.[1] ?? null;
  }
  return records;
}
async function replacementVideo(lesson) {
  const canonical = await paginate(`courses/${COURSE_ID}/files?search_term=${encodeURIComponent(lesson.videoDisplayName)}`);
  const current = canonical.find(file => file.display_name === lesson.videoDisplayName);
  if (current) return current;
  const original = await request(`files/${lesson.replaceVideoFileId}`);
  if (original.display_name !== lesson.replaceVideoName) throw new Error(`Replacement file identity mismatch for Lesson ${lesson.id}: ${original.display_name}`);
  return original;
}
async function upload(filePath, contentType, folder, uploadName = path.basename(filePath), finalName = uploadName) {
  const absolute = path.resolve(filePath);
  const stat = fs.statSync(absolute);
  const init = await request(`courses/${COURSE_ID}/files`, {
    method: "POST",
    body: JSON.stringify({ name: uploadName, size: stat.size, content_type: contentType, parent_folder_path: folder, on_duplicate: "overwrite" }),
  });
  const form = new FormData();
  for (const [key, value] of Object.entries(init.upload_params ?? {})) form.append(key, value);
  form.append("file", new Blob([fs.readFileSync(absolute)], { type: contentType }), uploadName);
  const response = await fetch(init.upload_url, { method: "POST", body: form });
  if (!response.ok) throw new Error(`Upload ${uploadName}: ${response.status} ${(await response.text()).slice(0, 500)}`);
  let file = await response.json();
  if (file.display_name !== finalName) file = await request(`files/${file.id}`, { method: "PUT", body: JSON.stringify({ name: finalName }) });
  return file;
}
function pageBody(lesson, pdfFile, videoFile) {
  const lessonId = String(lesson.id).padStart(2, "0");
  return `<div style="max-width:1100px;margin:0 auto;line-height:1.55;color:#1f2937"><h2>Lesson ${lesson.id}: ${lesson.title}</h2><p>Use the interactive lecture for demonstrations and guided practice. The PDF is a stable study copy; the narrated video includes captions and the performed interaction states.</p><p><a href="${CANVAS}/courses/${COURSE_ID}/files/${pdfFile.id}/download?download_frd=1">Download the Lesson ${lesson.id} PDF</a> · <a href="${CANVAS}/courses/${COURSE_ID}/files/${videoFile.id}/download?download_frd=1">Download the narrated video</a></p><div style="position:relative;padding-top:75%;overflow:hidden;border:1px solid #cbd5e1;border-radius:12px"><iframe title="Lesson ${lesson.id}: ${lesson.title}" src="${SITE}/lessons/${lessonId}?v=${siteVersion}" style="position:absolute;inset:0;width:100%;height:100%;border:0" loading="lazy" allowfullscreen></iframe></div></div>`;
}
async function ensurePage(title, body) {
  const pages = await paginate(`courses/${COURSE_ID}/pages`);
  const existing = pages.find(page => page.title === title);
  if (existing) return request(`courses/${COURSE_ID}/pages/${existing.url}`, { method: "PUT", body: JSON.stringify({ wiki_page: { title, body, published: true } }) });
  return request(`courses/${COURSE_ID}/pages`, { method: "POST", body: JSON.stringify({ wiki_page: { title, body, published: true } }) });
}
async function upsertItem(moduleId, match, moduleItem) {
  const items = await paginate(`courses/${COURSE_ID}/modules/${moduleId}/items`);
  const existing = items.find(match);
  if (existing) return request(`courses/${COURSE_ID}/modules/${moduleId}/items/${existing.id}`, { method: "PUT", body: JSON.stringify({ module_item: { ...moduleItem, published: true } }) });
  return request(`courses/${COURSE_ID}/modules/${moduleId}/items`, { method: "POST", body: JSON.stringify({ module_item: { ...moduleItem, published: true } }) });
}

const rlQuestions = [
  ["A delivery robot uses location only as its MDP state. Two visits to the same location have different transition risks because battery charge differs. What is the best diagnosis?", "The state is not Markov because it omits battery charge that changes next-state probabilities.", ["The reward is necessarily wrong.", "Value iteration cannot handle stochastic transitions.", "The discount factor must equal one."], "A Markov state must retain the information needed for the next-state distribution under an action."],
  ["At a state, action Right has immediate reward -0.04 and successor values 0.7 with probability 0.8 and 0.1 with probability 0.2. With gamma 0.9, what is its one-step backup?", "0.482", ["0.536", "0.680", "0.720"], "Compute -0.04 + 0.9(0.8×0.7 + 0.2×0.1) = 0.482."],
  ["What changes when Bellman expectation is replaced by Bellman optimality for control?", "The policy-weighted average over actions becomes a maximum over actions.", ["The immediate reward is removed.", "The transition probabilities become deterministic.", "The successor-state expectation is removed."], "Optimal control chooses the largest action value while preserving reward and transition expectations."],
  ["A value-iteration run has a very small Bellman residual. Which claim is justified?", "The numerical values are nearly a fixed point for the stated model and tolerance.", ["The reward represents every human value.", "The transition model is validated in deployment.", "The greedy policy is ethically acceptable."], "A residual supports solver convergence, not real-world model validity."],
  ["Rewards are 2, 0, and 8 with gamma 0.5. What is the return from the first step?", "4", ["5", "6", "10"], "The return is 2 + 0.5×0 + 0.5²×8 = 4."],
  ["Current Q(s,a)=2, reward=-1, gamma=0.9, max Q(s',·)=5, and alpha=0.2. What is the updated Q(s,a)?", "2.3", ["2.5", "3.5", "4.3"], "The target is 3.5, error is 1.5, and the update adds 0.2×1.5 = 0.3."],
  ["Why is Q-learning called off-policy?", "Its target uses the greedy next-action value even when the behavior policy explores.", ["It never uses a policy.", "It learns only from offline datasets.", "It removes rewards from the update."], "Behavior may be epsilon-greedy while the target evaluates a greedy next action."],
  ["What does epsilon=0.1 mean in a standard epsilon-greedy policy?", "Approximately ten percent of decisions use the exploration rule; the rest exploit the current estimate.", ["Every action has exactly ten percent probability.", "The learning rate is 0.1.", "The discount factor is 0.1."], "Epsilon controls behavior-policy exploration, not learning rate or discounting."],
  ["A learner reports high training return from one random seed. Which additional evidence is most important before a robust performance claim?", "Held-out scenarios, multiple seeds, uncertainty, baselines, and failure or safety analysis.", ["A larger font in the reward plot.", "Only the final training episode.", "Removal of low-return runs."], "Training return alone can hide variance, reward hacking, brittle behavior, and unsafe exploration."],
  ["What most clearly distinguishes reinforcement learning from online supervised learning?", "Actions affect future data and rewards may be delayed, while online supervised learning can update from arriving labeled examples without controlling their source.", ["Reinforcement learning always updates after every observation.", "Online supervised learning never uses neural networks.", "Reinforcement learning cannot use stored experience."], "The defining distinction is sequential control and delayed consequences, not update schedule."],
];

function quizQuestion([prompt, correct, incorrect, feedback], index) {
  const answers = [{ answer_text: correct, weight: 100, comments: `Correct. ${feedback}` }, ...incorrect.map(answer => ({ answer_text: answer, weight: 0, comments: `Not correct. ${feedback}` }))];
  return { question_name: `Module 10 scenario ${index + 1}`, question_text: `<p>${prompt}</p>`, question_type: "multiple_choice_question", points_possible: 1, answers, correct_comments: `Correct. ${feedback}`, incorrect_comments: `Review the formal model and calculation. ${feedback}` };
}

async function ensureRlQuiz() {
  const title = "Module 10 Quiz: Sequential Decision-Making and Reinforcement Learning";
  const quizzes = await paginate(`courses/${COURSE_ID}/quizzes`);
  let quiz = quizzes.find(candidate => candidate.title === title);
  if (!quiz) quiz = await request(`courses/${COURSE_ID}/quizzes`, { method: "POST", body: JSON.stringify({ quiz: { title, description: "Ten scenario-based checks on MDPs, value iteration, returns, Q-learning, exploration, and evaluation.", quiz_type: "assignment", assignment_group_id: 6950071, points_possible: 10, allowed_attempts: 2, scoring_policy: "keep_highest", published: true } }) });
  let questions = await paginate(`courses/${COURSE_ID}/quizzes/${quiz.id}/questions`);
  const existingNames = new Set(questions.map(question => question.question_name));
  for (const [index, definition] of rlQuestions.entries()) {
    const name = `Module 10 scenario ${index + 1}`;
    if (existingNames.has(name)) continue;
    await request(`courses/${COURSE_ID}/quizzes/${quiz.id}/questions`, { method: "POST", body: JSON.stringify({ question: quizQuestion(definition, index) }) });
  }
  questions = await paginate(`courses/${COURSE_ID}/quizzes/${quiz.id}/questions`);
  if (questions.length !== 10 || !rlQuestions.every((_, index) => questions.some(question => question.question_name === `Module 10 scenario ${index + 1}`))) throw new Error(`Existing RL quiz ${quiz.id} does not contain the expected 10 named questions.`);
  await request(`courses/${COURSE_ID}/quizzes/${quiz.id}`, { method: "PUT", body: JSON.stringify({ quiz: { title, published: true } }) });
  return quiz;
}

async function ensureFinalAssessmentCoverage() {
  const bankId = 10458481;
  const finalQuizId = 9299958;
  const bankGroupId = 4785463;
  const bankQuestions = await paginate(`question_banks/${bankId}/questions`);
  if (bankQuestions.length !== 50) throw new Error(`Expected the preserved final bank to contain 50 questions; observed ${bankQuestions.length}.`);
  await request(`courses/${COURSE_ID}/quizzes/${finalQuizId}/groups/${bankGroupId}`, { method: "PUT", body: JSON.stringify({ quiz_groups: [{ name: "Modules 9 and 11-14 final exam pool: random 25 of 50", pick_count: 25, question_points: 1 }] }) });

  let groups = (await request(`courses/${COURSE_ID}/quizzes/${finalQuizId}/groups`)).quiz_groups;
  let rlGroup = groups.find(group => group.name === "Module 10 final exam pool: random 5 of 10");
  if (!rlGroup) {
    const created = await request(`courses/${COURSE_ID}/quizzes/${finalQuizId}/groups`, { method: "POST", body: JSON.stringify({ quiz_groups: [{ name: "Module 10 final exam pool: random 5 of 10", pick_count: 5, question_points: 1 }] }) });
    rlGroup = created.quiz_groups?.[0] ?? created;
  }
  const finalQuestions = await paginate(`courses/${COURSE_ID}/quizzes/${finalQuizId}/questions`);
  const existingNames = new Set(finalQuestions.map(question => question.question_name));
  for (const [index, definition] of rlQuestions.entries()) {
    const name = `M10 RL Final ${String(index + 1).padStart(2, "0")}`;
    if (existingNames.has(name)) continue;
    const question = quizQuestion(definition, index);
    question.question_name = name;
    question.quiz_group_id = rlGroup.id;
    await request(`courses/${COURSE_ID}/quizzes/${finalQuizId}/questions`, { method: "POST", body: JSON.stringify({ question }) });
  }
  const updatedQuestions = await paginate(`courses/${COURSE_ID}/quizzes/${finalQuizId}/questions`);
  const rlFinalQuestions = updatedQuestions.filter(question => /^M10 RL Final \d{2}$/.test(question.question_name));
  if (rlFinalQuestions.length !== 10 || !rlQuestions.every((_, index) => rlFinalQuestions.some(question => question.question_name === `M10 RL Final ${String(index + 1).padStart(2, "0")}`))) {
    throw new Error(`Final assessment did not reach the expected 10 named Module 10 questions; observed ${rlFinalQuestions.length}. Rerun to resume missing questions; do not add duplicates manually.`);
  }
  groups = (await request(`courses/${COURSE_ID}/quizzes/${finalQuizId}/groups`)).quiz_groups;
  rlGroup = groups.find(group => group.id === rlGroup.id);
  if (rlGroup?.pick_count !== 5 || rlGroup.question_points !== 1 || rlGroup.assessment_question_bank_id != null) throw new Error("Module 10 final-exam group configuration failed");
  return { bankQuestions, rlFinalQuestions };
}

async function ensureDiscussion(title, message) {
  const topics = await paginate(`courses/${COURSE_ID}/discussion_topics`);
  const existing = topics.find(topic => topic.title === title);
  if (existing) return request(`courses/${COURSE_ID}/discussion_topics/${existing.id}`, { method: "PUT", body: JSON.stringify({ title, message, discussion_type: "threaded", published: true }) });
  return request(`courses/${COURSE_ID}/discussion_topics`, { method: "POST", body: JSON.stringify({ title, message, discussion_type: "threaded", published: true }) });
}

function aabReadingBody() {
  return `<div style="max-width:950px;margin:0 auto;line-height:1.55"><h2>External reading: How an AI-education evidence registry makes claims traceable</h2><p>This short reading follows Lesson 20 on LLM verification. AAB is not a lecture module, and the reading is not an endorsement requirement.</p><ol><li><a href="https://www.aaboard.org/" target="_blank">AABoard public evidence registry and workflow</a></li><li><a href="https://www.aaboard.org/research" target="_blank">AAB research briefs and dataset documentation</a></li><li>Inspect one public case, such as <a href="https://www.aaboard.org/cases/AAB-CASE-2026-RV-116" target="_blank">AI Audit</a>.</li></ol><p>Bring a four-entry trace: one registry claim, its primary-source location, a status of author report/reviewer inference/missing or unsupported, and a cautious revision. No account or external submission is required. Public records describe evidence; they do not endorse a provider, tool, curriculum, or result.</p></div>`;
}
function aabAssignmentBody() {
  return `<div style="max-width:950px;margin:0 auto;line-height:1.55"><h2>Optional Project 4: AI Evidence and Public Communication Contribution</h2><p>Create one optional, zero-point contribution that could help a public AI-literacy evidence workflow. This replaces the former Transformer and LLM Verification Mini-Lab slot; it does not add another post-midterm project.</p><h3>Choose one pathway</h3><ol><li><strong>Audit an evidence record:</strong> compare at least six material claims or fields with the primary source and propose exact revisions.</li><li><strong>Propose a source-traced candidate:</strong> prepare a candidate record, six-claim trace, study-design limits, missing information, and an accept/revise/hold/reject recommendation.</li><li><strong>Build a public AI explainer or demonstration:</strong> define the audience, preserve the mechanism, test teach-back, and revise from observable evidence.</li><li><strong>Conduct an accessibility or usability review:</strong> document reproducible checks, prioritized findings, and a repair mock-up or exact remediation specification.</li><li><strong>Create a technical visualization or validation aid:</strong> provide a runnable artifact, test cases, failure boundaries, and a short use guide.</li></ol><h3>Shared requirements</h3><ol><li>Contribution claim and intended user.</li><li>Stable primary sources or standards.</li><li>At least six traced content or design decisions.</li><li>Limitations, uncertainty, missing information, and excluded uses.</li><li>Accessibility, privacy, and safety check.</li><li>Reproducibility or facilitation package.</li><li>200–300 word editorial note.</li></ol><h3>Deliverables</h3><ul><li>Main artifact in an appropriate format.</li><li>Six-entry minimum evidence or decision trace and stable source list.</li><li>Reproducibility or facilitation guide.</li><li>Limitations and risk statement.</li><li>Editorial note and post-feedback publication choice.</li></ul><h3>Completion feedback</h3><p>A complete submission demonstrates technical fidelity, traceability, usefulness for a named user, responsible design, and enough documentation for another person to inspect, run, facilitate, or repeat the work without oral rescue.</p><h3>Publication and consent boundary</h3><p>Course feedback is independent of AAB acceptance. No AAB account is required. Nothing is shared externally without a separate affirmative permission choice after course feedback. You may keep the work within the course, permit private candidate review only, or later permit possible publication with your selected name, pseudonym, or no public attribution. External publication would still require independent source checking, accessibility/privacy review, licensing confirmation, and an authorized editorial decision.</p><h3>Starting references</h3><ul><li><a href="https://www.aaboard.org/" target="_blank">AABoard public evidence registry</a></li><li><a href="https://www.aaboard.org/research" target="_blank">AAB research briefs</a></li><li><a href="https://www.w3.org/WAI/tutorials/" target="_blank">W3C Web Accessibility Initiative tutorials</a></li><li><a href="https://www.equator-network.org/" target="_blank">EQUATOR reporting guidelines</a></li></ul></div>`;
}

function updateSyllabus(body) {
  let next = body;
  next = next.replace(/<strong>Module 9:<\/strong>[^<]*AI literacy and AAB evidence practicum/, "<strong>Module 9:</strong> Reasoning under uncertainty")
    .replace(/Research-evidence review, audience-appropriate explanation, and module quiz/, "Probability foundations, Bayes’ rule, conditional independence, Bayesian networks, Naive Bayes, discussion, and quiz")
    .replace(/<strong>Module 10:<\/strong>[^<]*Reasoning under uncertainty/, "<strong>Module 10:</strong> Sequential decision-making and reinforcement learning")
    .replace(/Conditional probability, Bayes[^<]*and quiz/, "Markov models, MDPs, policies, value iteration, reinforcement learning, Q-learning, exploration, discussion, and quiz")
    .replace(/optional Project 4: Transformer and LLM Verification Mini-Lab/, "external AAB evidence-registry reading and optional Project 4: AI Evidence and Public Communication Contribution");
  if (!next.includes("Formulate and solve a Markov decision process")) next = next.replace("</li>\n<li>Describe and evaluate machine-learning workflows", "</li>\n<li>Formulate and solve a Markov decision process, trace value iteration and Q-learning updates, and evaluate exploration and model assumptions.</li>\n<li>Describe and evaluate machine-learning workflows");
  return next;
}

function updateFinalStudyGuide(body) {
  const studyAction = "<p><strong>Study action:</strong> define each term from memory, trace or calculate one example, identify a model assumption, and explain what the result does and does not justify.</p>";
  const module9 = `<section><h2>Module 9: Reasoning Under Uncertainty</h2><p><a href="${SITE}/?module=9" target="_blank">Open the course-site module map</a></p><ul><li><strong>conditional probability:</strong> restrict a probability model to cases where the conditioning event is known.</li><li><strong>Bayes' rule:</strong> combine a prior and likelihood, then normalize by the evidence.</li><li><strong>conditional independence:</strong> decide whether learning one variable changes belief about another after conditioning on a third.</li><li><strong>Bayesian network:</strong> a directed acyclic graph whose local conditional distributions factor the joint distribution.</li><li><strong>Naive Bayes:</strong> compare posterior class scores under a conditional-independence assumption for features given the class.</li></ul>${studyAction}</section>`;
  const module10 = `<section><h2>Module 10: Sequential Decision-Making and Reinforcement Learning</h2><p><a href="${SITE}/?module=10" target="_blank">Open the course-site module map</a></p><ul><li><strong>Markov state:</strong> retain the information needed to model the next-state distribution under an action.</li><li><strong>Bellman backup:</strong> combine immediate reward with discounted expected successor value.</li><li><strong>value iteration:</strong> repeatedly apply Bellman optimality until values and the induced greedy policy stabilize within a stated tolerance.</li><li><strong>return and Q-value:</strong> distinguish a sampled discounted reward sequence from an expected action value.</li><li><strong>Q-learning and exploration:</strong> trace the temporal-difference update and explain how an exploratory behavior policy can learn a greedy target policy.</li></ul>${studyAction}</section>`;
  return body
    .replace(/<section><h2>Module 9:[\s\S]*?<\/section>/, module9)
    .replace(/<section><h2>Module 10:[\s\S]*?<\/section>/, module10);
}

async function preflight() {
  const missing = [];
  for (const lesson of lessons) for (const key of ["pdf", "video"]) {
    const file = path.resolve(lesson[key]);
    if (!fs.existsSync(file) || fs.statSync(file).size < (key === "pdf" ? 100_000 : 5_000_000)) missing.push(`${key}: ${file}`);
  }
  if (missing.length) throw new Error(`Publication is fail-closed; missing artifacts:\n${missing.join("\n")}`);
}

async function preflightQuota() {
  const quota = await request(`courses/${COURSE_ID}/files/quota`);
  const uploadBytes = lessons.reduce((sum, lesson) => sum + fs.statSync(path.resolve(lesson.pdf)).size + fs.statSync(path.resolve(lesson.video)).size, 0);
  let replacementBytes = 0;
  for (const lesson of lessons.filter(candidate => candidate.replaceVideoFileId)) {
    const existing = await replacementVideo(lesson);
    replacementBytes += existing.size;
  }
  const availableBytes = quota.quota - quota.quota_used;
  const projectedDeltaBytes = uploadBytes - replacementBytes;
  if (projectedDeltaBytes > availableBytes) throw new Error(`Canvas quota preflight failed: needs ${projectedDeltaBytes} net bytes but only ${availableBytes} are available.`);
  return { quota, uploadBytes, replacementBytes, projectedDeltaBytes, availableBytes };
}

async function apply() {
  await preflight();
  const quotaPlan = await preflightQuota();
  console.log(JSON.stringify({ canvasQuotaPreflight: quotaPlan }, null, 2));
  await request(`courses/${COURSE_ID}/modules/${MODULE_9_ID}`, { method: "PUT", body: JSON.stringify({ module: { name: "Module 9: Reasoning Under Uncertainty", position: 9, published: true } }) });
  await request(`courses/${COURSE_ID}/modules/${MODULE_10_ID}`, { method: "PUT", body: JSON.stringify({ module: { name: "Module 10: Sequential Decision-Making and Reinforcement Learning", position: 10, published: true } }) });

  const artifactRecords = new Map();
  for (const lesson of lessons) {
    const pdf = await upload(lesson.pdf, "application/pdf", `CPSC 481/Module ${lesson.id <= 12 ? 9 : 10}`);
    let video;
    if (lesson.replaceVideoFileId) {
      const existing = await replacementVideo(lesson);
      video = await upload(lesson.video, "video/mp4", "Lecture Videos", existing.display_name, lesson.videoDisplayName);
    } else {
      video = await upload(lesson.video, "video/mp4", `CPSC 481/Module ${lesson.id <= 12 ? 9 : 10}`, lesson.videoDisplayName, lesson.videoDisplayName);
    }
    artifactRecords.set(lesson.id, { pdf, video });
  }

  const module9Pages = [
    { itemId: 92176029, url: "lesson-13-probability-foundations-conditional-probability-and-bayes-rule" },
    { itemId: 92176030, url: "lesson-14-independence-naive-bayes-and-bayesian-networks" },
  ];
  for (const [index, lesson] of lessons.entries()) {
    const files = artifactRecords.get(lesson.id);
    const pageTitle = `Lesson ${lesson.id}: ${lesson.title}`;
    const page = index < 2
      ? await request(`courses/${COURSE_ID}/pages/${module9Pages[index].url}`, { method: "PUT", body: JSON.stringify({ wiki_page: { title: pageTitle, body: pageBody(lesson, files.pdf, files.video), published: true } }) })
      : await ensurePage(pageTitle, pageBody(lesson, files.pdf, files.video));
    await upsertItem(lesson.moduleId, item => item.type === "Page" && (item.page_url === page.url || item.id === lesson.pageItemId), { type: "Page", title: pageTitle, page_url: page.url, position: index % 2 === 0 ? 1 : 4 });
    // Canvas does not support retargeting an existing File module item to a
    // different content_id. Preserve the old pointers as unpublished archive
    // items, then create or update items keyed by the newly uploaded file IDs.
    for (const staleItemId of [lesson.pdfItemId, lesson.videoItemId].filter(Boolean)) {
      await request(`courses/${COURSE_ID}/modules/${lesson.moduleId}/items/${staleItemId}`, { method: "PUT", body: JSON.stringify({ module_item: { published: false } }) });
    }
    await upsertItem(lesson.moduleId, item => item.type === "File" && item.content_id === files.pdf.id, { type: "File", title: `Lesson ${lesson.id} PDF slides`, content_id: files.pdf.id, position: index % 2 === 0 ? 2 : 5 });
    await upsertItem(lesson.moduleId, item => item.type === "File" && item.content_id === files.video.id, { type: "File", title: `Lesson ${lesson.id} narrated video`, content_id: files.video.id, position: index % 2 === 0 ? 3 : 6 });
  }

  for (const itemId of [92176027, 92320104, 92176028, 92320105, 92196042, 92203786]) await request(`courses/${COURSE_ID}/modules/${MODULE_10_ID}/items/${itemId}`, { method: "PUT", body: JSON.stringify({ module_item: { published: false } }) });
  for (const pageUrl of ["lesson-11-aab-evidence-practicum-finding-and-reviewing-research", "lesson-12-ai-literacy-explaining-ai-to-nontechnical-audiences-age-five-and-older"]) {
    await request(`courses/${COURSE_ID}/pages/${pageUrl}`, { method: "PUT", body: JSON.stringify({ wiki_page: { published: false } }) });
  }
  await request(`courses/${COURSE_ID}/quizzes/9299944`, { method: "PUT", body: JSON.stringify({ quiz: { published: false } }) });
  await request(`courses/${COURSE_ID}/discussion_topics/23080638`, { method: "PUT", body: JSON.stringify({ published: false }) });
  for (const fileId of [284175815, 284175816, 284175817, 284175818]) {
    await request(`files/${fileId}`, { method: "PUT", body: JSON.stringify({ hidden: true }) });
  }

  const module9Quiz = await request(`courses/${COURSE_ID}/quizzes/9299946`, { method: "PUT", body: JSON.stringify({ quiz: { title: "Module 9 Quiz: Reasoning Under Uncertainty", published: true } }) });
  await upsertItem(MODULE_9_ID, item => item.type === "Quiz" && item.content_id === module9Quiz.id, { type: "Quiz", title: module9Quiz.title, content_id: module9Quiz.id, position: 7 });
  for (const itemId of [92195841, 92195864]) await request(`courses/${COURSE_ID}/modules/${MODULE_9_ID}/items/${itemId}`, { method: "PUT", body: JSON.stringify({ module_item: { published: false } }) });
  for (const topicId of [23079766, 23079765]) await request(`courses/${COURSE_ID}/discussion_topics/${topicId}`, { method: "PUT", body: JSON.stringify({ published: false }) });
  const module9Discussion = await ensureDiscussion("Module 9 Discussion: When should uncertain evidence change a decision?", "Choose one probabilistic AI claim. State the prior, evidence, likelihood or model structure, posterior or inference result, and one assumption whose failure would change the decision.");
  await upsertItem(MODULE_9_ID, item => item.type === "Discussion" && item.title.includes("Module 9 Discussion"), { type: "Discussion", title: module9Discussion.title, content_id: module9Discussion.id, position: 8 });
  const module9Cafe = await ensureDiscussion("Module 9 Question Café", "Post questions about probability, Bayes' rule, conditional independence, Bayesian networks, or Naive Bayes. Include the exact probability, graph relation, equation, or inference step that is confusing.");
  await upsertItem(MODULE_9_ID, item => item.type === "Discussion" && item.title === "Module 9 Question Café", { type: "Discussion", title: module9Cafe.title, content_id: module9Cafe.id, position: 9 });

  const rlQuiz = await ensureRlQuiz();
  await upsertItem(MODULE_10_ID, item => item.type === "Quiz" && item.content_id === rlQuiz.id, { type: "Quiz", title: rlQuiz.title, content_id: rlQuiz.id, position: 7 });
  const rlDiscussion = await ensureDiscussion("Module 10 Discussion: What should the agent optimize—and what could the model miss?", "Define one sequential decision problem with state, actions, transition uncertainty, reward, and a deployment boundary. Explain one policy or learning update and one omitted variable or reward shortcut that could invalidate the result.");
  await upsertItem(MODULE_10_ID, item => item.type === "Discussion" && item.content_id === rlDiscussion.id, { type: "Discussion", title: rlDiscussion.title, content_id: rlDiscussion.id, position: 8 });
  const cafe = await ensureDiscussion("Module 10 Question Café", "Post questions about Markov states, Bellman backups, value iteration, returns, Q-learning, exploration, or the lecture demonstrations. Include the exact state, equation, or step that is confusing.");
  await upsertItem(MODULE_10_ID, item => item.type === "Discussion" && item.content_id === cafe.id, { type: "Discussion", title: cafe.title, content_id: cafe.id, position: 9 });
  await ensureFinalAssessmentCoverage();

  const reading = await ensurePage("External Reading: AAB Evidence Registry and Claim Traceability", aabReadingBody());
  const modules = await paginate(`courses/${COURSE_ID}/modules`);
  const module13 = modules.find(module => module.name.startsWith("Module 13:"));
  if (!module13) throw new Error("Module 13 not found");
  await upsertItem(module13.id, item => item.type === "Page" && item.page_url === reading.url, { type: "Page", title: reading.title, page_url: reading.url, position: 6 });
  await request(`courses/${COURSE_ID}/assignments/39938173`, { method: "PUT", body: JSON.stringify({ assignment: { name: "Optional Project 4: AI Evidence and Public Communication Contribution", description: aabAssignmentBody(), points_possible: 0, grading_type: "points", omit_from_final_grade: true, submission_types: ["online_upload", "online_text_entry", "online_url"], published: true } }) });
  const module13Items = await paginate(`courses/${COURSE_ID}/modules/${module13.id}/items`);
  const assignmentItem = module13Items.find(item => item.type === "Assignment" && item.content_id === 39938173);
  if (assignmentItem) await request(`courses/${COURSE_ID}/modules/${module13.id}/items/${assignmentItem.id}`, { method: "PUT", body: JSON.stringify({ module_item: { title: "Optional Project 4: AI Evidence and Public Communication Contribution", position: 7, published: true } }) });
  for (const [itemId, position] of [[92196049, 5], [92196535, 8], [92203787, 9]]) {
    await request(`courses/${COURSE_ID}/modules/${module13.id}/items/${itemId}`, { method: "PUT", body: JSON.stringify({ module_item: { position, published: true } }) });
  }
  const finalStudyGuide = await request(`courses/${COURSE_ID}/pages/final-exam-study-guide`);
  await request(`courses/${COURSE_ID}/pages/final-exam-study-guide`, { method: "PUT", body: JSON.stringify({ wiki_page: { title: finalStudyGuide.title, body: updateFinalStudyGuide(finalStudyGuide.body), published: true } }) });

  const syllabus = await request(`courses/${COURSE_ID}?include[]=syllabus_body`);
  await request(`courses/${COURSE_ID}`, { method: "PUT", body: JSON.stringify({ course: { syllabus_body: updateSyllabus(syllabus.syllabus_body), syllabus_public: false } }) });
}

async function verify() {
  const modules = (await paginate(`courses/${COURSE_ID}/modules`)).sort((a, b) => a.position - b.position);
  const module9 = modules.find(module => module.id === MODULE_9_ID);
  const module10 = modules.find(module => module.id === MODULE_10_ID);
  if (module9?.name !== "Module 9: Reasoning Under Uncertainty" || module9.position !== 9 || !module9.published) throw new Error("Module 9 verification failed");
  if (module10?.name !== "Module 10: Sequential Decision-Making and Reinforcement Learning" || module10.position !== 10 || !module10.published) throw new Error("Module 10 verification failed");
  const report = [];
  for (const lesson of lessons) {
    const items = await paginate(`courses/${COURSE_ID}/modules/${lesson.moduleId}/items`);
    const pageItem = items.find(item => item.type === "Page" && item.title === `Lesson ${lesson.id}: ${lesson.title}`);
    const pdfItem = items.find(item => item.type === "File" && item.title === `Lesson ${lesson.id} PDF slides`);
    const videoItem = items.find(item => item.type === "File" && item.title === `Lesson ${lesson.id} narrated video`);
    if (!pageItem?.published || !pdfItem?.published || !videoItem?.published) throw new Error(`Lesson ${lesson.id} module items failed verification`);
    const page = await request(`courses/${COURSE_ID}/pages/${pageItem.page_url}`);
    if (!page.published || !page.body.includes(`${SITE}/lessons/${String(lesson.id).padStart(2, "0")}?v=${siteVersion}`)) throw new Error(`Lesson ${lesson.id} iframe/version failed verification`);
    const pdfFile = await request(`files/${pdfItem.content_id}`);
    const videoFile = await request(`files/${videoItem.content_id}`);
    if (pdfFile.display_name !== path.basename(lesson.pdf) || videoFile.display_name !== lesson.videoDisplayName || pdfFile.hidden || videoFile.hidden) {
      throw new Error(`Lesson ${lesson.id} uploaded file identity or visibility failed verification`);
    }
    report.push({ lesson: lesson.id, pageItem: pageItem.id, pdfItem: pdfItem.id, videoItem: videoItem.id, pdfFile: pdfItem.content_id, videoFile: videoItem.content_id });
  }
  const expectedModule9Tail = ["Module 9 Quiz: Reasoning Under Uncertainty", "Module 9 Discussion: When should uncertain evidence change a decision?", "Module 9 Question Café"];
  const expectedModule10Tail = ["Module 10 Quiz: Sequential Decision-Making and Reinforcement Learning", "Module 10 Discussion: What should the agent optimize—and what could the model miss?", "Module 10 Question Café"];
  for (const [module, expectedTail] of [[module9, expectedModule9Tail], [module10, expectedModule10Tail]]) {
    const published = (await paginate(`courses/${COURSE_ID}/modules/${module.id}/items`)).filter(item => item.published).sort((a, b) => a.position - b.position);
    const expectedLessons = module.id === MODULE_9_ID ? lessons.slice(0, 2) : lessons.slice(2);
    const expectedTitles = expectedLessons.flatMap(lesson => [`Lesson ${lesson.id}: ${lesson.title}`, `Lesson ${lesson.id} PDF slides`, `Lesson ${lesson.id} narrated video`]).concat(expectedTail);
    if (expectedTitles.some((title, index) => published[index]?.title !== title)) throw new Error(`${module.name} published item order verification failed`);
  }
  for (const pageUrl of ["lesson-11-aab-evidence-practicum-finding-and-reviewing-research", "lesson-12-ai-literacy-explaining-ai-to-nontechnical-audiences-age-five-and-older"]) {
    if ((await request(`courses/${COURSE_ID}/pages/${pageUrl}`)).published) throw new Error(`Archived AAB page ${pageUrl} is still published`);
  }
  if ((await request(`courses/${COURSE_ID}/quizzes/9299944`)).published || (await request(`courses/${COURSE_ID}/discussion_topics/23080638`)).published) throw new Error("Archived AAB quiz or Question Café is still published");
  for (const fileId of [284175815, 284175816, 284175817, 284175818]) {
    if (!(await request(`files/${fileId}`)).hidden) throw new Error(`Archived superseded file ${fileId} is still visible`);
  }
  const module9Items = await paginate(`courses/${COURSE_ID}/modules/${MODULE_9_ID}/items`);
  const activeLessonFileItemIds = new Set(report.flatMap(lesson => [lesson.pdfItem, lesson.videoItem]));
  for (const staleItemId of [92320106, 92232101, 92320107, 92231782]) {
    if (!activeLessonFileItemIds.has(staleItemId) && module9Items.find(item => item.id === staleItemId)?.published) throw new Error(`Superseded Module 9 file item ${staleItemId} is still published`);
  }
  const assignment = await request(`courses/${COURSE_ID}/assignments/39938173`);
  const expectedSubmissionTypes = ["online_upload", "online_text_entry", "online_url"];
  if (assignment.name !== "Optional Project 4: AI Evidence and Public Communication Contribution" || assignment.points_possible !== 0 || assignment.grading_type !== "points" || !assignment.omit_from_final_grade || !expectedSubmissionTypes.every(type => assignment.submission_types.includes(type)) || !assignment.description.includes("separate affirmative permission") || !assignment.description.includes("W3C Web Accessibility Initiative")) throw new Error("AAB optional assignment verification failed");
  const quizzes = await paginate(`courses/${COURSE_ID}/quizzes`);
  const probabilityQuiz = quizzes.find(quiz => quiz.id === 9299946);
  const probabilityQuestions = await paginate(`courses/${COURSE_ID}/quizzes/9299946/questions`);
  if (probabilityQuiz?.title !== "Module 9 Quiz: Reasoning Under Uncertainty" || !probabilityQuiz.published || probabilityQuestions.length !== 10 || !probabilityQuestions.every(question => question.answers?.every(answer => typeof answer.comments === "string" && answer.comments.length > 0))) throw new Error("Preserved Module 9 quiz or feedback verification failed");
  const rlQuiz = quizzes.find(quiz => quiz.title === "Module 10 Quiz: Sequential Decision-Making and Reinforcement Learning");
  if (!rlQuiz?.published || rlQuiz.points_possible !== 10 || rlQuiz.allowed_attempts !== 2 || rlQuiz.scoring_policy !== "keep_highest") throw new Error("Module 10 quiz settings verification failed");
  const rlQuizQuestions = await paginate(`courses/${COURSE_ID}/quizzes/${rlQuiz.id}/questions`);
  if (rlQuizQuestions.length !== 10 || !rlQuizQuestions.every(question => question.answers?.every(answer => typeof answer.comments === "string" && answer.comments.length > 0))) throw new Error("Module 10 quiz questions or feedback verification failed");
  const reading = (await paginate(`courses/${COURSE_ID}/pages`)).find(page => page.title === "External Reading: AAB Evidence Registry and Claim Traceability");
  if (!reading?.published) throw new Error("AAB external reading verification failed");
  const module13 = modules.find(module => module.name.startsWith("Module 13:"));
  const module13Titles = (await paginate(`courses/${COURSE_ID}/modules/${module13.id}/items`)).filter(item => item.published).sort((a, b) => a.position - b.position).map(item => item.title);
  const expectedModule13Titles = ["Lesson 19: Tokens, Embeddings, Attention, and Transformer Architecture", "Lesson 19 Slides (PDF)", "Lesson 20: LLM Training, Structured Outputs, Hallucination, and Verification", "Lesson 20 Slides (PDF)", "Module 13 Quiz: Transformers and Large Language Models", "External Reading: AAB Evidence Registry and Claim Traceability", "Optional Project 4: AI Evidence and Public Communication Contribution", "Final Exam Study Guide", "Module 13 Question Café (Optional)"];
  if (expectedModule13Titles.some((title, index) => module13Titles[index] !== title)) throw new Error("Module 13 AAB reading and optional-project order verification failed");
  const syllabus = await request(`courses/${COURSE_ID}?include[]=syllabus_body`);
  if (!syllabus.syllabus_body.includes("Module 9:</strong> Reasoning under uncertainty") || !syllabus.syllabus_body.includes("Module 10:</strong> Sequential decision-making and reinforcement learning") || syllabus.syllabus_body.includes("AI literacy and AAB evidence practicum")) throw new Error("Syllabus module schedule verification failed");
  const finalBank = await paginate(`question_banks/10458481/questions`);
  const finalQuestions = await paginate(`courses/${COURSE_ID}/quizzes/9299958/questions`);
  const rlFinalQuestions = finalQuestions.filter(question => /^M10 RL Final \d{2}$/.test(question.question_name));
  const finalStudyGuide = await request(`courses/${COURSE_ID}/pages/final-exam-study-guide`);
  if (!finalStudyGuide.body.includes("Module 9: Reasoning Under Uncertainty") || !finalStudyGuide.body.includes("Module 10: Sequential Decision-Making and Reinforcement Learning") || finalStudyGuide.body.includes("Module 9: AI Literacy and AAB Evidence")) throw new Error("Final Exam Study Guide coverage verification failed");
  if (finalBank.length !== 50 || !finalBank.every(question => question.answers?.every(answer => typeof answer.comments === "string" && answer.comments.length > 0))) throw new Error("Preserved final bank count or answer-level feedback verification failed");
  if (rlFinalQuestions.length !== 10 || !rlFinalQuestions.every(question => question.answers?.every(answer => typeof answer.comments === "string" && answer.comments.length > 0))) throw new Error("Module 10 final question count or answer-level feedback verification failed");
  const finalGroups = await request(`courses/${COURSE_ID}/quizzes/9299958/groups`);
  const finalQuiz = quizzes.find(quiz => quiz.id === 9299958);
  if (!finalQuiz?.published || finalQuiz.points_possible !== 30) throw new Error("Final exam publication or point total verification failed");
  const bankGroup = finalGroups.quiz_groups.find(group => group.id === 4785463);
  const rlGroup = finalGroups.quiz_groups.find(group => group.name === "Module 10 final exam pool: random 5 of 10");
  if (bankGroup?.name !== "Modules 9 and 11-14 final exam pool: random 25 of 50" || bankGroup.pick_count !== 25 || bankGroup.assessment_question_bank_id !== 10458481) throw new Error("Preserved final-bank group verification failed");
  if (rlGroup?.pick_count !== 5 || rlGroup.question_points !== 1 || rlGroup.assessment_question_bank_id != null || !rlFinalQuestions.every(question => question.quiz_group_id === rlGroup.id)) throw new Error("Module 10 final-exam group verification failed");
  console.log(JSON.stringify({ status: "passed", siteVersion, module9: module9.id, module10: module10.id, lessons: report, assignment: assignment.id, finalAssessment: { bankQuestions: finalBank.length, bankPickCount: bankGroup.pick_count, module10Questions: rlFinalQuestions.length, module10PickCount: rlGroup.pick_count, totalPickCount: bankGroup.pick_count + rlGroup.pick_count } }, null, 2));
}

if (VERIFY) await verify();
else if (APPLY) { await apply(); await verify(); }
else {
  console.log(JSON.stringify({ mode: "dry-run", courseId: COURSE_ID, siteVersion, modules: [{ id: MODULE_9_ID, name: "Module 9: Reasoning Under Uncertainty" }, { id: MODULE_10_ID, name: "Module 10: Sequential Decision-Making and Reinforcement Learning" }], lessons, aabAssignment: 39938173 }, null, 2));
  await preflight();
}
