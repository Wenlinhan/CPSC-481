"use client";
/* eslint-disable @next/next/no-img-element -- course-source assets are versioned static files */

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import "../styles/lesson10-gp.css";
import type { CourseSourceReference } from "./L01DeckShell";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

const ROOT = "/course-source/l07-gp-l08-alife";
const IMAGE_ROOT = `${ROOT}/generated`;
const alife = (...pages: number[]) => pages.map(page => 100 + page);

function resolveSource(sourceSlide: number): CourseSourceReference {
  const isAlife = sourceSlide >= 100;
  const page = isAlife ? sourceSlide - 100 : sourceSlide;
  return {
    deckLabel: isAlife ? "L08_ArtificialLife.pptx" : "L07_GP.pdf",
    image: `${ROOT}/${isAlife ? "l08-pptx-source-slides" : "l07-source-slides"}/slide-${String(page).padStart(2, "0")}.png`,
    key: `${isAlife ? "l08-alife" : "l07-gp"}:${page}`,
    page,
  };
}

function slide(eyebrow: string, title: string, content: ReactNode, sourceSlides: number[], minutes: number, subtitle?: string): SourceLessonSlide {
  const refs = sourceSlides.map(page => page >= 100 ? `L08-${page - 100}` : `L07-${page}`).join(", ");
  return { eyebrow, title, content, sourceSlides, minutes, subtitle, note: `Timing: ${minutes} minutes. Explain the mechanism from ${refs}; prompt a prediction before revealing the next state.` };
}

function Tag({ children, tone = "indigo" }: { children: ReactNode; tone?: "indigo" | "teal" | "amber" | "coral" }) {
  return <span className={`l10-tag ${tone}`}>{children}</span>;
}

function GeneratedVisual({ file, alt }: { file: string; alt: string }) {
  return <figure className="l10-generated"><img alt={alt} src={`${IMAGE_ROOT}/${file}`} /></figure>;
}

type TreeNode = { label: string; x: number; y: number; parent?: number; kind?: "function" | "terminal"; hot?: boolean };
function ProgramTree({ nodes, label }: { nodes: TreeNode[]; label: string }) {
  return <svg className="l10-tree" viewBox="0 0 640 350" role="img" aria-label={label}>
    {nodes.map((node, index) => node.parent === undefined ? null : <line key={`e-${index}`} x1={nodes[node.parent].x} y1={nodes[node.parent].y} x2={node.x} y2={node.y}/>) }
    {nodes.map((node, index) => <g className={`${node.kind ?? "function"} ${node.hot ? "hot" : ""}`} key={`${node.label}-${index}`}><circle cx={node.x} cy={node.y} r="28"/><text x={node.x} y={node.y + 8}>{node.label}</text></g>)}
  </svg>;
}

const lispNodes: TreeNode[] = [
  { label: "+", x: 320, y: 48, kind: "function" },
  { label: "2", x: 90, y: 145, parent: 0, kind: "terminal" },
  { label: "3", x: 230, y: 145, parent: 0, kind: "terminal" },
  { label: "×", x: 390, y: 145, parent: 0, kind: "function" },
  { label: "÷", x: 550, y: 145, parent: 0, kind: "function" },
  { label: "X", x: 350, y: 260, parent: 3, kind: "terminal" },
  { label: "7", x: 430, y: 260, parent: 3, kind: "terminal" },
  { label: "Y", x: 510, y: 260, parent: 4, kind: "terminal" },
  { label: "5", x: 590, y: 260, parent: 4, kind: "terminal" },
];

function GpDefinition() {
  return <div className="l10-definition"><section><Tag>Definition</Tag><h3>Genetic programming evolves a population of computer programs.</h3><p>Each individual is executable structure. Fitness measures how well the program performs a task; selection and tree-based variation bias later populations toward useful behavior.</p></section><div className="l10-ga-gp"><article><small>Genetic algorithm</small><code>10110 01101</code><b>fixed or task-specific chromosome</b></article><i>extend the representation</i><article><small>Genetic programming</small><ProgramTree label="A small executable program tree" nodes={[{label:"+",x:320,y:70},{label:"X",x:220,y:210,parent:0,kind:"terminal"},{label:"1",x:420,y:210,parent:0,kind:"terminal"}]}/><b>variable-size executable tree</b></article></div></div>;
}

function LispContext() {
  return <div className="l10-lisp-context"><section><Tag tone="teal">Lisp context</Tag><h3>Lisp writes a function before its arguments.</h3><div className="l10-prefix"><span>(</span><b>+</b><code>2</code><code>3</code><span>(</span><b>*</b><code>X</code><code>7</code><span>)</span><span>(</span><b>/</b><code>Y</code><code>5</code><span>)</span><span>)</span></div><p>The outer <b>+</b> is the root call. Nested parenthesized expressions become child subtrees. Lisp is the source example’s programming language; GP itself is not restricted to Lisp.</p><a href="https://www.tutorialspoint.com/lisp/index.htm" rel="noopener noreferrer" target="_blank">Open the Lisp tutorial ↗</a></section><aside><div><b>function</b><span>operator with one or more argument positions</span></div><div><b>terminal</b><span>variable, constant, sensor, or action with no children</span></div><div><b>parse tree</b><span>hierarchical structure that records evaluation</span></div></aside></div>;
}

function LispTree() {
  return <div className="l10-lisp-tree"><ProgramTree label="Parse tree for plus two three times X seven divided Y five" nodes={lispNodes}/><section><code>(+ 2 3 (* X 7) (/ Y 5))</code><div><Tag tone="coral">Functions</Tag><b>+ · * · /</b><span>internal nodes may have children</span></div><div><Tag tone="teal">Terminals</Tag><b>2 · 3 · X · 7 · Y · 5</b><span>leaves provide values</span></div><p>Evaluation is recursive: compute the two nested calls, then pass all four results to the root <b>+</b>.</p></section></div>;
}

const gpPseudo = [
  ["P ← randomly generated programs", "initialize"],
  ["evaluate every program in P and assign fitness", "measure"],
  ["while termination criterion is not fulfilled:", "repeat"],
  ["  P′ ← empty population", "new generation"],
  ["  while P′ is not fully populated:", "fill offspring"],
  ["    select parent program(s) using fitness", "selection"],
  ["    apply crossover, mutation, or reproduction", "variation"],
  ["    insert valid offspring into P′", "replacement"],
  ["  P ← P′; evaluate every program in P", "advance"],
  ["return the best program found", "output"],
];

function GpPseudocode() {
  return <div className="l10-pseudocode"><ol>{gpPseudo.map(([line, meaning], index) => <li className={index >= 3 && index <= 8 ? "loop" : ""} key={line}><span>{String(index + 1).padStart(2, "0")}</span><code>{line}</code><b>{meaning}</b></li>)}</ol><aside><Tag tone="amber">Algorithm category</Tag><h3>GP is an evolutionary search algorithm over programs.</h3><p>The pseudocode is a control contract: representation, initialization, fitness, selection, variation, replacement, and stopping must all be specified.</p></aside></div>;
}

function GpLifecycle() {
  const steps = [["1","random programs"],["2","execute + score"],["3","select parents"],["4","vary trees"],["5","fill P′"],["6","stop?"]];
  return <div className="l10-cycle"><svg viewBox="0 0 850 390" role="img" aria-label="Generational genetic programming lifecycle"><defs><marker id="l10-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs><path className="ring" d="M160 195C160 75 275 40 425 40S690 75 690 195 575 350 425 350 160 315 160 195"/>{steps.map(([n,name],index)=>{const pts=[[160,195],[270,75],[480,55],[680,170],[575,330],[320,335]][index];return <g key={name}><circle cx={pts[0]} cy={pts[1]} r="58"/><text x={pts[0]} y={pts[1]-8}>{n}</text><text className="name" x={pts[0]} y={pts[1]+18}>{name}</text></g>})}<path className="exit" d="M660 295L795 340"/><text className="exit-text" x="730" y="307">yes → best program</text></svg><p>One generation produces a complete new population <b>P′</b>. Fitness guides reproductive probability; it does not directly edit code.</p></div>;
}

function PrimitiveSets() {
  return <div className="l10-primitives"><div className="l10-grammar"><section><Tag tone="coral">Function set F</Tag><h3>{`{ +, −, ×, ÷ }`}</h3><p>Every function defines an arity. Choosing a function creates child positions that must be filled recursively.</p></section><section><Tag tone="teal">Terminal set T</Tag><h3>{`{ integers, X, Y }`}</h3><p>A terminal closes a branch. Variables receive task inputs; constants provide numeric material.</p></section></div><ProgramTree label="A valid program tree composed from function and terminal sets" nodes={lispNodes}/><aside><b>Validity rule</b><span>Every internal node belongs to F, every leaf belongs to T, and every function receives exactly the arguments its arity requires.</span></aside></div>;
}

const buildStates: TreeNode[][] = [
  [{label:"+",x:320,y:65,kind:"function",hot:true}],
  [{label:"+",x:320,y:65,kind:"function"},{label:"2",x:120,y:165,parent:0,kind:"terminal",hot:true}],
  [{label:"+",x:320,y:65,kind:"function"},{label:"2",x:120,y:165,parent:0,kind:"terminal"},{label:"3",x:250,y:165,parent:0,kind:"terminal",hot:true}],
  [{label:"+",x:320,y:65,kind:"function"},{label:"2",x:120,y:165,parent:0,kind:"terminal"},{label:"3",x:250,y:165,parent:0,kind:"terminal"},{label:"×",x:400,y:165,parent:0,kind:"function",hot:true}],
  [{label:"+",x:320,y:65,kind:"function"},{label:"2",x:120,y:165,parent:0,kind:"terminal"},{label:"3",x:250,y:165,parent:0,kind:"terminal"},{label:"×",x:400,y:165,parent:0,kind:"function"},{label:"÷",x:550,y:165,parent:0,kind:"function",hot:true},{label:"X",x:365,y:280,parent:3,kind:"terminal"},{label:"7",x:435,y:280,parent:3,kind:"terminal"}],
  lispNodes,
];
function RandomTreeBuilder() {
  const [step,setStep]=useState(0);
  const expressions=["(+ …)","(+ 2 …)","(+ 2 3 …)","(+ 2 3 (* …) …)","(+ 2 3 (* X 7) (/ …))","(+ 2 3 (* X 7) (/ Y 5))"];
  return <div className="l10-builder"><div><ProgramTree label={`Random program construction step ${step+1}`} nodes={buildStates[step]}/><code>{expressions[step]}</code></div><section><Tag tone="amber">Recursive generation</Tag><h3>{step < 5 ? "Choose the next open position" : "Every open position is closed"}</h3><p>{step < 5 ? "Randomly choose a legal function or terminal. A function adds new argument positions; a terminal ends its branch." : "The result is a syntactically valid program because every function has its required children."}</p><div>{buildStates.map((_,index)=><button aria-label={`Show generation step ${index+1}`} className={step===index?"active":""} key={index} onClick={()=>setStep(index)}>{index+1}</button>)}</div></section></div>;
}

function MutationVisual() {
  const before=lispNodes.map(node=>({...node,hot:node.label==="×"||node.parent===3}));
  const after:TreeNode[]=[{label:"+",x:320,y:48},{label:"2",x:90,y:145,parent:0,kind:"terminal"},{label:"3",x:230,y:145,parent:0,kind:"terminal"},{label:"+",x:390,y:145,parent:0,hot:true},{label:"÷",x:550,y:145,parent:0},{label:"×",x:350,y:260,parent:3,hot:true},{label:"3",x:430,y:260,parent:3,kind:"terminal",hot:true},{label:"Y",x:510,y:260,parent:4,kind:"terminal"},{label:"5",x:590,y:260,parent:4,kind:"terminal"}];
  return <div className="l10-operator"><section><Tag>Before</Tag><ProgramTree label="Original program with selected multiplication subtree" nodes={before}/><code>(+ 2 3 (* X 7) (/ Y 5))</code></section><i>delete one node and its descendants<br/><b>grow a random replacement subtree</b></i><section><Tag tone="teal">After</Tag><ProgramTree label="Mutated program with a replacement subtree" nodes={after}/><code>(+ 2 3 (+ (* 4 2) 3) (/ Y 5))</code></section><p>GP mutation may change program size. Depth limits and closure keep the new program executable.</p></div>;
}

function CrossoverVisual() {
  return <div className="l10-crossover"><div className="parents"><article><Tag>Parent A</Tag><code>(+ X (* 3 Y))</code><ProgramTree label="Parent A tree" nodes={[{label:"+",x:320,y:60},{label:"X",x:190,y:180,parent:0,kind:"terminal"},{label:"×",x:450,y:180,parent:0,hot:true},{label:"3",x:400,y:290,parent:2,kind:"terminal",hot:true},{label:"Y",x:500,y:290,parent:2,kind:"terminal",hot:true}]}/></article><article><Tag tone="coral">Parent B</Tag><code>(− (/ 25 X) 7)</code><ProgramTree label="Parent B tree" nodes={[{label:"−",x:320,y:60},{label:"÷",x:190,y:180,parent:0,hot:true},{label:"7",x:450,y:180,parent:0,kind:"terminal"},{label:"25",x:140,y:290,parent:1,kind:"terminal",hot:true},{label:"X",x:240,y:290,parent:1,kind:"terminal",hot:true}]}/></article></div><div className="offspring"><i>swap the selected subtrees</i><code>(+ X (* (/ 25 X) Y))</code><code>(− 3 7)</code></div><p>Tree-aware crossover preserves syntactic structure, but it can still create overly deep or semantically poor programs.</p></div>;
}

function GuidedSearch() {
  return <div className="l10-random"><section><Tag tone="coral">Random generation only</Tag><div className="bars">{[22,31,27,43,35,48,40,52].map((v,i)=><i style={{height:`${v}%`}} key={i}/>)}</div><h3>200,000 unrelated attempts</h3><p>No information passes from a useful program to the next attempt.</p></section><b>fitness + inheritance</b><section><Tag tone="teal">Genetic programming</Tag><div className="bars guided">{[25,34,45,49,61,67,73,84].map((v,i)=><i style={{height:`${v}%`}} key={i}/>)}</div><h3>200 generations × 1,000</h3><p>Selection preserves useful structure statistically; crossover and mutation explore related programs.</p></section><aside>The cited tic-tac-toe comparison found the evolved program significantly better than the best purely random program. That is evidence for one experiment—not a universal guarantee.</aside></div>;
}

const mazeWalls=[[0,0,8,1],[0,1,1,7],[7,1,1,7],[1,7,6,1],[2,1,1,4],[4,1,1,3],[5,3,2,1],[2,5,3,1],[5,5,1,2]];
function Maze({ improved=false }: { improved?: boolean }) {
  const route=improved?"M95 325L95 285L165 285L165 245L95 245L95 205L165 205L165 165L235 165L235 125L305 125L305 85L445 85L445 125L515 125L515 85L585 85":"M95 325L95 285L165 285L165 325L235 325L235 285L305 285L305 245L235 245L235 205L165 205L165 165L235 165L235 125";
  return <svg className="l10-maze" viewBox="0 0 650 390" role="img" aria-label={improved?"Improved mouse route through the maze":"Candidate mouse route that stops far from the cheese"}><rect x="55" y="45" width="560" height="320" rx="18"/>{mazeWalls.map(([x,y,w,h],i)=><rect className="wall" key={i} x={55+x*70} y={45+y*40} width={w*70} height={h*40}/>) }<path className={improved?"route improved":"route"} d={route}/><g className="mouse"><circle cx="95" cy="325" r="20"/><text x="95" y="332">M</text></g><g className="cheese"><path d="M565 65L610 90L565 115Z"/><circle cx="580" cy="86" r="4"/><circle cx="590" cy="98" r="4"/></g></svg>;
}

function MouseSetup() {
  return <div className="l10-mouse"><Maze/><section><Tag tone="amber">Task</Tag><h3>Evolve a controller that reaches the cheese.</h3><div><b>Function set</b><code>{`{ IF-BLOCKED, WHILE-NOT-AT-CHEESE }`}</code></div><div><b>Terminal set</b><code>{`{ FORWARD, LEFT, RIGHT }`}</code></div><pre>WHILE-NOT-AT-CHEESE
  IF-BLOCKED
    LEFT
    FORWARD</pre><p>The root repeats the controller. Sensors and actions become primitives; executing the tree produces movement.</p></section></div>;
}

function MouseFitness() {
  return <div className="l10-mouse-fitness"><Maze/><section><Tag tone="coral">Lower is better</Tag><h3>fitness = (execution cost + final distance)²</h3><div className="l10-equation"><span>100</span><i>units spent</i><b>+</b><span>10</span><i>moves away</i><b>→</b><strong>12,100</strong></div><ul><li>Every non-root function or terminal costs 1 unit.</li><li>The mouse dies after more than 100 units.</li><li>Distance penalizes controllers that stop far from the exit.</li></ul><p>A fitness function makes the task measurable, but it also defines what evolution will exploit.</p></section></div>;
}

function MouseVariation() {
  return <div className="l10-mouse-variation"><article><Tag>Candidate A · 12,996</Tag><pre>IF-BLOCKED
  LEFT
  FORWARD</pre></article><article><Tag tone="coral">Mutation</Tag><pre>IF-BLOCKED
  LEFT
  LEFT</pre><span>one behavior subtree changes</span></article><article><Tag tone="teal">Crossover offspring · 11,664</Tag><pre>IF-BLOCKED
  FORWARD
  LEFT</pre><span>material from two parents combines</span></article><aside>Do not judge a tree only by appearance. Execute it in the maze, count cost, measure final distance, then compare fitness.</aside></div>;
}

function MouseResult() {
  return <div className="l10-mouse-result"><div><Tag tone="coral">Earlier program · 12,996</Tag><Maze/></div><i>4,202 generations<br/>1,000 programs per generation</i><div><Tag tone="teal">Evolved program · 2,809</Tag><Maze improved/></div><p>The later controller is substantially better under the specified fitness, yet “better” still means better for this maze, primitive set, cost model, and evaluation budget.</p></div>;
}

function DesignProperties() {
  const props=[['Sufficiency','Can F ∪ T express a solution?'],['Parsimony','Does the representation avoid needless search and bloat?'],['Closure','Can every function safely accept every value its children may return?']];
  return <div className="l10-properties"><svg viewBox="0 0 560 390" role="img" aria-label="Triangle connecting sufficiency, parsimony, and closure"><path d="M280 55L70 335H490Z"/>{props.map(([name],i)=>{const p=[[280,55],[70,335],[490,335]][i];return <g key={name}><circle cx={p[0]} cy={p[1]} r="68"/><text x={p[0]} y={p[1]+7}>{name}</text></g>})}</svg><section>{props.map(([name,q])=><article key={name}><b>{name}</b><span>{q}</span></article>)}<aside><Tag tone="amber">Parameters</Tag><p>Population size · generations · operator probabilities · initialization · maximum depth · termination</p></aside></section></div>;
}

function TournamentGp() {
  const lines=['repeat until termination:','  sample a tournament subset','  evaluate every competitor','  select winner(s) by fitness','  apply genetic operators to winner(s)','  replace tournament loser(s) with offspring','return the best program'];
  return <div className="l10-tournament"><ol>{lines.map((line,i)=><li className={i>0&&i<6?'loop':''} key={line}><span>{i+1}</span><code>{line}</code></li>)}</ol><section><div><Tag>Generational GP</Tag><p>Build a complete new population, then replace P all at once.</p></div><div><Tag tone="teal">Tournament GP</Tag><p>Update one population continuously. Offspring immediately replace sampled losers.</p></div><aside>Also called <b>steady state</b>: variation is asynchronous and there is no centralized generation boundary.</aside></section></div>;
}

function Regression() {
  const pts=Array.from({length:10},(_,i)=>{const x=i/10;return [65+x*620,320-(x*x/2)*520]});
  const curve=Array.from({length:101},(_,i)=>{const x=i/100;return `${i?'L':'M'}${65+x*620} ${320-(x*x/2)*520}`}).join(' ');
  return <div className="l10-regression"><svg viewBox="0 0 740 370" role="img" aria-label="Training points and learned function x squared divided by two"><path className="axis" d="M65 30V320H705"/><path className="curve" d={curve}/>{pts.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="7"/><text x={x} y={342}>{(i/10).toFixed(1)}</text></g>)}<text x="450" y="90">learned f(x) = x²/2</text></svg><section><Tag tone="amber">Symbolic regression</Tag><h3>Evolve the function, not only its coefficients.</h3><div className="l10-regression-data"><b>Terminal set</b><span>x; integers −5…+5</span><b>Function set</b><span>+ · − · × · protected ÷</span><b>Fitness</b><span>error over 10 training records</span><b>Population</b><span>600</span><b>Operators</b><span>90% crossover · 5% mutation</span><b>Stop</b><span>error ≤ .001 or 100 generations</span></div></section></div>;
}

function ParallelSearch() {
  const points=useMemo(()=>Array.from({length:34},(_,i)=>[55+(i*83)%710,235-90*Math.sin(i*1.7)-(i%4)*18]),[]);
  return <div className="l10-parallel"><svg viewBox="0 0 820 350" role="img" aria-label="Population candidates distributed across a multi-peaked quality landscape"><path d="M20 300C110 270 100 120 190 130S300 300 370 220 440 55 515 115 610 305 690 215 740 105 805 140"/>{points.map(([x,y],i)=><circle className={`g${i%3}`} cx={x} cy={y} r="7" key={i}/>)}</svg><section><Tag>Implicit parallelism</Tag><p>Many programs explore different regions at once. Selection concentrates effort, while variation can move candidates away from a current peak.</p><div><b>Good fit</b><span>executable structure, black-box evaluation, approximation acceptable</span></div><div><b>Weak fit</b><span>a safe exact algorithm is known, evaluation is costly, or program behavior cannot be tested reliably</span></div><small>Applications in the source include spacecraft control, neural structures, image analysis, expert systems, fuzzy control, and hardware evolution.</small></section></div>;
}

function AlifeIntro() {
  return <div className="l10-alife"><GeneratedVisual file="artificial-life-modes.png" alt="Three artificial-life modes: biochemical protocells, embodied robots, and a simulated digital ecosystem"/><section><Tag tone="teal">Artificial Life</Tag><h3>Study life-like processes by constructing systems that exhibit them.</h3><div><b>Wet</b><span>biochemistry and material processes</span></div><div><b>Hard</b><span>robotics and embodied agents</span></div><div><b>Soft</b><span>simulation and digital organisms</span></div><p>Simulators make mechanisms observable: Polyworld, Avida, EcoSim, OpenWorm/Geppetto, and Neurokernel use different models to expose different phenomena.</p></section></div>;
}

function SwarmConcept() {
  return <div className="l10-swarm-concept"><svg viewBox="0 0 720 370" role="img" aria-label="Simple agents interacting locally to produce an organized global pattern"><defs><marker id="l10-small-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z"/></marker></defs>{Array.from({length:18},(_,i)=>{const x=70+(i%6)*105+(i%2)*18,y=70+Math.floor(i/6)*120;return <g key={i} transform={`translate(${x} ${y}) rotate(${(i%6-2.5)*7})`}><path d="M-18 0L12 0"/><circle cx="0" cy="0" r="13"/><path className="heading" d="M10 0L26 0"/></g>})}<path className="flow" d="M50 305C180 230 230 285 350 205S540 95 690 115"/></svg><section><Tag>Swarm intelligence</Tag><h3>Local interaction can yield organized global behavior without a central controller.</h3><ul><li>Population of simple autonomous agents</li><li>Local sensing and action</li><li>Partly stochastic rules</li><li>Emergent collective pattern</li></ul><aside><b>Robot-demo check</b><span>A group of robots is not automatically a swarm. Ask whether coordination emerges from local agent rules or from centralized planning and choreography.</span></aside></section></div>;
}

function PsoDemo() {
  const [step,setStep]=useState(0);
  const data=[{p:[210,270],pb:[150,180],gb:[590,80],next:[210,270]},{p:[210,270],pb:[150,180],gb:[590,80],next:[300,205]},{p:[300,205],pb:[300,205],gb:[590,80],next:[405,145]},{p:[405,145],pb:[405,145],gb:[590,80],next:[500,105]}][step];
  const arrow=(from:number[],to:number[],cls:string,label:string)=><g className={cls}><line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}/><text x={(from[0]+to[0])/2} y={(from[1]+to[1])/2-8}>{label}</text></g>;
  return <div className="l10-pso"><svg viewBox="0 0 700 370" role="img" aria-label={`Particle swarm optimization update step ${step+1}`}><defs><marker id="l10-pso-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs>{[[570,90,65],[570,90,115],[570,90,170],[570,90,235]].map((c,i)=><ellipse key={i} cx={c[0]} cy={c[1]} rx={c[2]} ry={c[2]*.58}/>)}<circle className="gb" cx={data.gb[0]} cy={data.gb[1]} r="15"/><text x={610} y={70}>gBest</text><circle className="pb" cx={data.pb[0]} cy={data.pb[1]} r="13"/><text x={data.pb[0]+18} y={data.pb[1]-12}>pBest</text><circle className="p" cx={data.p[0]} cy={data.p[1]} r="17"/><text x={data.p[0]-8} y={data.p[1]+6}>p</text>{arrow(data.p,[data.p[0]+65,data.p[1]-10],'inertia','momentum')}{arrow(data.p,data.pb,'personal','personal')}{arrow(data.p,data.gb,'social','social')}<circle className="next" cx={data.next[0]} cy={data.next[1]} r="18"/><text x={data.next[0]+20} y={data.next[1]+24}>next</text></svg><section><Tag tone="teal">PSO update · {step+1}/4</Tag><h3>{['Evaluate current position','Combine three influences','Update personal best','Move toward a stronger region'][step]}</h3><code>v ← v + c₁r₁(pBest−p) + c₂r₂(gBest−p)</code><code>p ← p + v</code><p>{['Compute fitness f(p); retain the best location this particle has personally visited.','Velocity mixes momentum, personal memory, and the swarm’s best shared location.','If the new position is better, overwrite pBest; gBest is the best pBest in the swarm.','Repeat until the stopping condition; particles share best positions, not genetic material.'][step]}</p><div>{[0,1,2,3].map(i=><button className={step===i?'active':''} key={i} onClick={()=>setStep(i)}>{i+1}</button>)}</div></section></div>;
}

function BeesDemo() {
  const [step,setStep]=useState(0);
  const quality=[.35,.92,.62];
  return <div className="l10-bees"><svg viewBox="0 0 760 360" role="img" aria-label={`Bees algorithm recruitment step ${step+1}`}><circle className="hive" cx="110" cy="180" r="55"/><text x="110" y="188">hive</text>{[[520,70],[610,200],[420,285]].map(([x,y],i)=><g key={i}><circle className={`patch p${i}`} cx={x} cy={y} r={38+quality[i]*18}/><text x={x} y={y+7}>patch {String.fromCharCode(65+i)}</text>{Array.from({length:step<2?1:Math.max(1,Math.round(quality[i]*6))},(_,j)=><circle className="bee" cx={x-45+(j%3)*28} cy={y-65-Math.floor(j/3)*20} r="7" key={j}/>) }<path className={step>=1?'route active':'route'} d={`M165 180Q${(165+x)/2} ${y<180?80:285} ${x-45} ${y}`}/></g>)}</svg><section><Tag tone="amber">Bees algorithm · {step+1}/5</Tag><h3>{['Scout','Evaluate','Waggle dance','Recruit + exploit','Abandon or revisit'][step]}</h3><p>{['Scout bees sample flower patches randomly.','Each scout estimates patch quality from available nectar or pollen.','At the hive, dance direction encodes angle, duration encodes distance, and frequency communicates quality.','Higher-quality patches recruit more follower bees, allocating more local search effort.','Weak patches may be abandoned; some scouts keep exploring so the colony can discover alternatives.'][step]}</p><div>{[0,1,2,3,4].map(i=><button className={step===i?'active':''} key={i} onClick={()=>setStep(i)}>{i+1}</button>)}</div></section></div>;
}

function AcoObstacle() {
  const [step,setStep]=useState(0);
  const shortWidth=[3,5,9,14,18][step], longWidth=[3,5,7,6,4][step];
  return <div className="l10-aco"><svg viewBox="0 0 780 350" role="img" aria-label={`Ant colony obstacle reconnection step ${step+1}`}><defs><marker id="l10-ant-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs><circle className="nest" cx="70" cy="175" r="38"/><text x="70" y="183">nest</text><circle className="food" cx="710" cy="175" r="38"/><text x="710" y="183">food</text><path className="obstacle" d="M365 110L425 110L450 175L425 240H365L340 175Z"/><path className="trail short" style={{'--trail':shortWidth} as CSSProperties} d="M108 175C230 175 265 115 340 115S550 175 672 175"/><path className="trail long" style={{'--trail':longWidth} as CSSProperties} d="M108 175C220 175 250 305 390 305S555 175 672 175"/>{Array.from({length:step+3},(_,i)=><circle className="ant" key={i} cx={150+i*80} cy={i%2?142:205} r="7"/>)}</svg><section><Tag tone="coral">Obstacle trace · {step+1}/5</Tag><h3>{['Trail interrupted','Random left/right split','Short detour returns sooner','Positive feedback amplifies it','Shortest path dominates'][step]}</h3><p>{['Ants initially follow one pheromone trail between nest and food.','At the obstacle, ants cannot continue; stochastic choices explore both detours.','The shorter route completes more trips per unit time, so it receives pheromone faster.','More pheromone raises following probability, sending still more ants along the shorter route.','Evaporation weakens underused alternatives while continued traffic maintains the efficient route.'][step]}</p><div>{[0,1,2,3,4].map(i=><button className={step===i?'active':''} key={i} onClick={()=>setStep(i)}>{i+1}</button>)}</div></section></div>;
}

function AcoDiscovery() {
  const [step,setStep]=useState(0);
  const routes=[3,4,7,13,10];
  return <div className="l10-discovery"><svg viewBox="0 0 760 350" role="img" aria-label={`Ant colony new food discovery step ${step+1}`}><circle className="nest" cx="90" cy="175" r="42"/><text x="90" y="183">nest</text><circle className="food" cx="675" cy="85" r="42"/><text x="675" y="93">food</text><path className="weak" d="M130 175C230 80 310 250 420 140S570 80 633 85"/><path className="weak" d="M130 175C230 275 350 245 470 285S610 170 633 105"/><path className="strong" style={{'--trail':routes[step]} as CSSProperties} d="M130 175C250 170 330 130 430 125S560 90 633 85"/>{Array.from({length:5+step*2},(_,i)=><circle className="ant" cx={150+(i*71)%480} cy={140+(i%4)*30} r="7" key={i}/>)}</svg><section><Tag>Food discovery · {step+1}/5</Tag><h3>{['Random scouts','One ant finds food','Return trail recruits followers','Stochastic alternatives remain','Evaporation adapts memory'][step]}</h3><p>{['A small number of ants wander without a trail.','A successful scout returns to the nest while depositing pheromone.','Other ants probabilistically follow and reinforce the discovered route.','Some ants ignore the current trail, preserving exploration and sometimes finding a shorter route.','Old pheromone evaporates. Shared memory persists only when traffic continues to reinforce it.'][step]}</p><div>{[0,1,2,3,4].map(i=><button className={step===i?'active':''} key={i} onClick={()=>setStep(i)}>{i+1}</button>)}</div></section></div>;
}

function Comparison() {
  const rows=[['GA','string / task genome','fitness','crossover + mutation','population genes'],['GP','executable tree','program performance','subtree crossover + mutation','program structure'],['PSO','position + velocity','objective value','velocity update','pBest + gBest'],['Bees','patch location','patch quality','recruit + local search','dance recruitment'],['ACO','path / solution','path cost','stochastic construction','pheromone trail']];
  const [choice,setChoice]=useState<number|null>(null);
  return <div className="l10-comparison"><div className="table"><div className="head"><b>method</b><b>candidate</b><b>feedback</b><b>variation</b><b>shared memory</b></div>{rows.map(row=><div key={row[0]}>{row.map((cell,i)=><span className={i===0?'method':''} key={cell}>{cell}</span>)}</div>)}</div><section><h3>Which method stores shared memory outside any one agent?</h3>{['GP trees','PSO pBest','ACO pheromone','GA chromosomes'].map((o,i)=><button className={choice===i?(i===2?'correct':'wrong'):''} key={o} onClick={()=>setChoice(i)}>{o}</button>)}{choice!==null&&<p><b>{choice===2?'Correct.':'Try again.'}</b> Pheromone is an external, evaporating trail that many ants can read and reinforce.</p>}</section></div>;
}

function ReviewStudio() {
  const prompts=[['Representation','Why does GP use trees instead of fixed strings?','Trees naturally express variable-size hierarchical programs and support subtree variation.'],['Fitness','What happens when a GP fitness function is poorly defined?','Evolution optimizes the stated measure, so loopholes or proxies can produce high-scoring but useless programs.'],['PSO vs GA','What is the primary operational difference?','PSO moves positions using velocity plus personal/social bests; GA creates offspring using selection, crossover, and mutation.'],['Emergence','Why is there no central brain in ACO?','Each ant follows local stochastic rules and pheromone; global route preference emerges from repeated interaction.']];
  const [active,setActive]=useState(0),[show,setShow]=useState(false);
  return <div className="l10-review"><nav>{prompts.map((p,i)=><button className={active===i?'active':''} key={p[0]} onClick={()=>{setActive(i);setShow(false)}}>{p[0]}</button>)}</nav><section><Tag tone="amber">Explain, do not only name</Tag><h3>{prompts[active][1]}</h3><button onClick={()=>setShow(!show)}>{show?'Hide expected answer':'Reveal expected answer'}</button>{show&&<aside>{prompts[active][2]}</aside>}</section><div className="l10-review-map"><span>representation</span><i>→</i><span>evaluation</span><i>→</i><span>local operator</span><i>→</i><span>population behavior</span></div></div>;
}

function Exit() {
  return <div className="l10-exit"><section><Tag>Exit ticket</Tag><h3>Design or diagnose one evolutionary computation system.</h3><ol><li>State the candidate representation and how it executes or decodes.</li><li>Write the fitness or feedback signal and one loophole.</li><li>Trace one update—GP variation, PSO movement, bee recruitment, or ACO reinforcement.</li><li>Explain what stops the process and what evidence supports the result.</li></ol></section><aside><h3>Core synthesis</h3><div><b>GP</b><span>evolves executable structure</span></div><div><b>ALife</b><span>constructs systems to study life-like mechanisms</span></div><div><b>Swarm methods</b><span>turn local rules and shared signals into population search</span></div><p>Reading: Luger, 6e, Ch. 12 · Koza (1992) · Eberhart, Shi &amp; Kennedy (2001)</p></aside></div>;
}

export const lesson10Slides: SourceLessonSlide[] = [
  slide("Module 6 · Lesson 10", "Can a computer search over programs—not just numbers?", <div className="l10-hero"><GeneratedVisual file="gp-program-evolution.png" alt="A population of program trees being selected and recombined into a high-performing tree"/><aside><Tag>Driving question</Tag><h2>What must be represented, executed, scored, and varied when the candidate solution is code?</h2><p>Genetic programming makes programs the individuals in an evolutionary search.</p></aside></div>, [1], 2, "Genetic programming, artificial life, and swarm intelligence"),
  slide("Genetic programming · Definition", "Genetic programming evolves executable structures", <GpDefinition/>, [2,3], 3),
  slide("Representation context · Lisp", "Lisp makes hierarchical program structure visible", <LispContext/>, [3,4], 2),
  slide("Lisp program · Parse tree", "The program text and tree encode the same computation", <LispTree/>, [4], 2),
  slide("Generational GP · Complete algorithm", "Initialize, evaluate, select, vary, replace, and repeat", <GpPseudocode/>, [5], 3),
  slide("Generational GP · One population cycle", "Fitness guides reproduction; operators create the next programs", <GpLifecycle/>, [5,6], 3),
  slide("Program grammar", "Function and terminal sets define what GP can build", <PrimitiveSets/>, [7], 2),
  slide("Initialization · Grow a program", "Random generation recursively fills every argument position", <RandomTreeBuilder/>, [8,9,10,11,12,13], 3),
  slide("Variation · Mutation", "Mutation replaces one selected subtree with a random program", <MutationVisual/>, [14,15,16], 2),
  slide("Variation · Crossover", "Crossover swaps subtrees between two parent programs", <CrossoverVisual/>, [17,18,19], 2),
  slide("Why not random programs?", "Fitness-guided inheritance accumulates useful structure", <GuidedSearch/>, [20], 2),
  slide("Worked case · Building a better mouse", "Sensors, actions, and control flow become GP primitives", <MouseSetup/>, [21,22], 3),
  slide("Worked case · Fitness", "Execute the controller, then score cost and remaining distance", <MouseFitness/>, [23], 3),
  slide("Worked case · Variation", "Mutation and crossover change behavior—not only tree shape", <MouseVariation/>, [24,25,26], 3),
  slide("Worked case · Result", "The evolved controller improves the stated fitness from 12,996 to 2,809", <MouseResult/>, [27], 2),
  slide("GP design contract", "Sufficiency, parsimony, and closure constrain the search", <DesignProperties/>, [28], 3),
  slide("Tournament GP", "Steady-state GP replaces sampled losers continuously", <TournamentGp/>, [29], 3),
  slide("Symbolic regression", "GP can evolve a function that fits training examples", <Regression/>, [30], 4),
  slide("Parallel search · Applications and limits", "A population explores many program structures at once", <ParallelSearch/>, [31,32,33], 2),
  slide("Artificial Life", "Construct life-like systems to expose their mechanisms", <AlifeIntro/>, alife(1,2), 2),
  slide("Swarm intelligence", "Simple local rules can produce organized collective behavior", <SwarmConcept/>, alife(3,4,6), 3),
  slide("Particle Swarm Optimization", "A particle combines momentum, personal memory, and social information", <PsoDemo/>, alife(5), 4),
  slide("Bees algorithm", "Recruitment allocates more search effort to promising patches", <BeesDemo/>, alife(7), 3),
  slide("Ant Colony Optimization · Obstacle", "The shorter detour reinforces faster and attracts more ants", <AcoObstacle/>, alife(8,9,10,11,12,13,14), 4),
  slide("Ant Colony Optimization · Discovery", "Exploration, reinforcement, and evaporation create adaptive shared memory", <AcoDiscovery/>, alife(15,16,17,18,19,20,21,22), 4),
  slide("Cumulative comparison", "Match each method to its candidate, feedback, operator, and memory", <Comparison/>, alife(23), 2),
  slide("Cumulative review studio", "Explain representation, fitness, update, and emergence", <ReviewStudio/>, alife(24,25,26,27), 2),
  slide("Synthesis · Exit ticket", "A population method is only as meaningful as its representation and feedback", <Exit/>, alife(28), 2),
];

export function Lesson10Deck() {
  return <SourceDeckShell meetingLabel="Module 6 · Lesson 10" meetingTitle="Genetic Programming, Artificial Life, and Swarm Intelligence" resolveSourceReference={resolveSource} slides={lesson10Slides} sourceCollectionLabel="L07_GP + L08_ArtificialLife" sourceCollectionPath="l07-gp-l08-alife"/>;
}
