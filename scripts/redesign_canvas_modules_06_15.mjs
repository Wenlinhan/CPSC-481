import fs from "node:fs";
import path from "node:path";

const COURSE_ID="3586560";
const BASE="https://csufullerton.instructure.com";
const SITE="https://cpsc481-introduction-to-ai.winniechef.chatgpt.site";
const TOKEN_FILE=path.resolve("..","Canvas API.txt");
const apply=process.argv.includes("--apply");
const version=(process.argv.find(x=>x.startsWith("--version="))?.split("=")[1]||"2026-08-01").replace(/[^a-zA-Z0-9._-]/g,"-");
const token=fs.readFileSync(TOKEN_FILE,"utf8").split(/\r?\n/).map(x=>x.trim()).filter(Boolean).at(-1);
if(!token) throw new Error("Canvas token not found");

const modules=[
 [1,"Module 1: course overview and prerequisites"],[2,"Module 2: L01-Introduction"],[3,"Module 3: L02-State Space Search"],[4,"Module 4: L03-Heuristic, HillClimbing&SA"],[5,"Module 5: L04-BFS&AStar"],
 [6,"Module 6: Evolutionary Computation, Genetic Programming, and Artificial Life"],[7,"Module 7: Midterm Review"],[8,"Module 8: Midterm Exam"],[9,"Module 9: AI Literacy and AAB Evidence"],[10,"Module 10: Reasoning Under Uncertainty"],[11,"Module 11: Machine Learning Foundations"],[12,"Module 12: Applied Machine Learning and Neural Networks"],[13,"Module 13: Transformers and Large Language Models"],[14,"Module 14: Retrieval-Augmented Generation"],[15,"Module 15: Final Review"],[16,"Final Exam"],
];

const lessons=[
 [1,2,"AI Applications, History, Intelligence, and Definitions","Lesson 1:"],[2,2,"Agents, Task Environments, Agent Types, and the Turing Test","Lesson 2:"],[3,3,"Problem Formulation and Breadth-First Search","Lesson 3:"],[4,3,"Depth-First, Uniform-Cost, and Search Evaluation","Lesson 4:"],[5,4,"Heuristic Functions, Hill Climbing, and Simulated Annealing","Lesson 5:"],[6,4,"Best-First Search, A*, and Heuristic Quality","Lesson 6:"],[7,5,"Game Trees, Minimax, and Evaluation Functions","Lesson 7:"],[8,5,"Alpha-Beta Pruning and Modern Game Search","Lesson 8:"],
 [9,6,"Evolutionary Computation and Genetic Algorithms",null],[10,6,"Genetic Programming, Artificial Life, and Swarm Intelligence",null],
 [11,9,"AAB Evidence Practicum: Finding and Reviewing Research","Meeting 25:"],[12,9,"AI Literacy: Explaining AI to Nontechnical Audiences Age Five and Older","Meeting 26:"],
 [13,10,"Probability Foundations, Conditional Probability, and Bayes Rule","Meeting 09:"],[14,10,"Independence, Naive Bayes, and Bayesian Networks","Meeting 10:"],
 [15,11,"Machine Learning Foundations and Concept Learning","Meeting 13:"],[16,11,"Decision Trees, ID3, and Evaluation","Meeting 14:"],
 [17,12,"Applied Machine Learning: Pipelines, Validation, and Error Analysis","Meeting 15:"],[18,12,"Neural Networks: Foundations, Training, and Evaluation","Meeting 17:"],
 [19,13,"Tokens, Embeddings, Attention, and Transformer Architecture","Meeting 19:"],[20,13,"LLM Training, Structured Outputs, Hallucination, and Verification","Meeting 20:"],
 [21,14,"RAG Foundations: From Documents to Retrieved Context","Meeting 21:"],[22,14,"RAG Quality: Hybrid Retrieval, Reranking, Grounding, and Evaluation","Meeting 22:"],
].map(([id,module,topic,sourcePrefix])=>({id,module,topic,sourcePrefix,title:`Lesson ${id}: ${topic}`}));

const special=[
 {module:7,title:"Midterm Review",sourcePrefix:"Meeting 11:",body:`<h2>Midterm Review</h2><p>Review Lessons 1–10. Be prepared to explain representations, trace algorithms, compare guarantees, and justify design choices with evidence.</p><ol><li>AI definitions, agents, and task environments</li><li>State-space, uninformed, informed, local, and adversarial search</li><li>Evolutionary computation, genetic algorithms, genetic programming, artificial life, and swarm intelligence</li></ol>`},
 {module:8,title:"Midterm Exam",sourcePrefix:"Meeting 16:",body:`<h2>Midterm Exam</h2><p>Midterm exam instructions, availability, and accommodations will be provided in Canvas.</p>`},
 {module:15,title:"Final Review",sourcePrefix:"Meeting 30:",body:`<h2>Final Review</h2><p>Use the interactive final-review deck below to synthesize Lessons 1–22.</p><p><a href="${SITE}/meetings/30?v=${version}" target="_blank" rel="noopener">Open the final review in a new tab</a></p><iframe src="${SITE}/meetings/30?v=${version}" width="100%" height="720" style="border:1px solid #d7dde8;border-radius:8px;background:#fff" allowfullscreen></iframe>`},
 {module:16,title:"Final Exam",sourcePrefix:"Meeting 29:",body:`<h2>Final Exam</h2><p>Final exam instructions, availability, and accommodations will be provided in Canvas.</p>`},
];

const url=e=>`${BASE}/api/v1/${e.replace(/^\//,"")}`;
async function req(endpoint,options={}){const r=await fetch(url(endpoint),{...options,headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json",...(options.headers||{})}});if(!r.ok)throw new Error(`${options.method||"GET"} ${endpoint}: ${r.status} ${(await r.text()).slice(0,500)}`);return r.status===204?null:r.json()}
async function all(endpoint){let out=[],next=url(`${endpoint}${endpoint.includes("?")?"&":"?"}per_page=100`);while(next){const r=await fetch(next,{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw new Error(`GET ${endpoint}: ${r.status}`);out.push(...await r.json());next=(r.headers.get("link")||"").split(",").map(x=>x.trim()).find(x=>x.includes('rel="next"'))?.match(/<([^>]+)>/)?.[1]||null}return out}
function lessonBody(x){const target=`${SITE}/lessons/${String(x.id).padStart(2,"0")}?v=${version}`;return `<div style="margin:0 0 16px"><p><strong>${x.title}</strong></p><p><a href="${target}" target="_blank" rel="noopener">Open the slides in a new tab</a></p></div><iframe src="${target}" width="100%" height="720" style="border:1px solid #d7dde8;border-radius:8px;background:#fff" allowfullscreen></iframe>`}
function findPage(pages,prefix,title){return pages.find(p=>p.title===title)||pages.find(p=>prefix&&p.title.startsWith(prefix))}

async function main(){
 const currentModules=(await all(`courses/${COURSE_ID}/modules`)).sort((a,b)=>a.position-b.position); const pages=await all(`courses/${COURSE_ID}/pages`);
 const plans=[];
 for(const x of lessons){let page=findPage(pages,x.sourcePrefix,x.title);if(!page&&x.id===9)page=null;if(!page&&x.id===10)page=null;if(!page&&x.id!==9&&x.id!==10)throw new Error(`Source page not found for ${x.title}`);plans.push({...x,page})}
 for(const x of special){const page=findPage(pages,x.sourcePrefix,x.title);if(!page)throw new Error(`Source page not found for ${x.title}`);plans.push({...x,page,special:true})}
 console.log(`${apply?"[APPLY]":"[DRY RUN]"} Modules 6-15 + Final Exam; cache version ${version}`);modules.forEach(([p,n])=>console.log(`${p}. ${n}`));plans.forEach(x=>console.log(`- M${x.module}: ${x.page?.title||"CREATE"} -> ${x.title}`));if(!apply)return;
 const backupDir=path.resolve("output","canvas-backups");fs.mkdirSync(backupDir,{recursive:true});const details=[];for(const m of currentModules){details.push({...m,items:await all(`courses/${COURSE_ID}/modules/${m.id}/items`)})}const pageDetails=[];for(const p of pages)pageDetails.push(await req(`courses/${COURSE_ID}/pages/${p.url}`));fs.writeFileSync(path.join(backupDir,`full-redesign-${new Date().toISOString().replace(/[:.]/g,"-")}.json`),JSON.stringify({modules:details,pages:pageDetails},null,2));
 const liveModules=[];for(const [position,name] of modules){let m=currentModules[position-1];if(!m)m=await req(`courses/${COURSE_ID}/modules`,{method:"POST",body:JSON.stringify({module:{name,position,published:true}})});else await req(`courses/${COURSE_ID}/modules/${m.id}`,{method:"PUT",body:JSON.stringify({module:{name,position,published:true}})});liveModules.push({...m,name,position})}
 for(const plan of plans){let page=plan.page;if(!page){page=await req(`courses/${COURSE_ID}/pages`,{method:"POST",body:JSON.stringify({wiki_page:{title:plan.title,body:lessonBody(plan),published:true,editing_roles:"teachers"}})});pages.push(page)}else{page=await req(`courses/${COURSE_ID}/pages/${page.url}`,{method:"PUT",body:JSON.stringify({wiki_page:{title:plan.title,body:plan.special?plan.body:lessonBody(plan),published:true}})})}plan.page=page}
 for(const m of liveModules.slice(5)){const items=await all(`courses/${COURSE_ID}/modules/${m.id}/items`);for(const item of items)await req(`courses/${COURSE_ID}/modules/${m.id}/items/${item.id}`,{method:"DELETE"})}
 for(const m of liveModules.slice(1,5)){await req(`courses/${COURSE_ID}/modules/${m.id}`,{method:"PUT",body:JSON.stringify({module:{name:m.name,position:m.position,published:true}})})}
 for(const plan of plans.sort((a,b)=>a.module-b.module||(a.id||99)-(b.id||99))){const m=liveModules[plan.module-1];const existing=await all(`courses/${COURSE_ID}/modules/${m.id}/items`);if(!existing.some(i=>i.type==="Page"&&i.page_url===plan.page.url))await req(`courses/${COURSE_ID}/modules/${m.id}/items`,{method:"POST",body:JSON.stringify({module_item:{type:"Page",page_url:plan.page.url,title:plan.title,position:existing.length+1,published:true}})})}
 for(const m of liveModules)await req(`courses/${COURSE_ID}/modules/${m.id}`,{method:"PUT",body:JSON.stringify({module:{name:m.name,position:m.position,published:true}})});
 console.log("Canvas redesign applied and published.");
}
await main();
