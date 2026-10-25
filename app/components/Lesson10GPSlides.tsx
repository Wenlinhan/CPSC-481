import { lesson10InstructorSpeech } from "../data/lesson10InstructorSpeech";
"use client";
/* eslint-disable @next/next/no-img-element -- course-source assets are versioned static files */

import { useMemo, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import "../styles/lesson10-gp.css";
import "../styles/lesson10-illustrations.css";
import type { CourseSourceReference } from "./L01DeckShell";
import { EnlargeableImage } from "./SearchLessonPrimitives";
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
  return { eyebrow, title, content, sourceSlides, minutes, subtitle, note: "Let’s explain the mechanism, predict what happens next, and then compare the prediction with the revealed state." };
}

function Tag({ children, tone = "indigo" }: { children: ReactNode; tone?: "indigo" | "teal" | "amber" | "coral" }) {
  return <span className={`l10-tag ${tone}`}>{children}</span>;
}

function GeneratedVisual({ file, alt }: { file: string; alt: string }) {
  return <figure className="l10-generated"><EnlargeableImage alt={alt} src={`${IMAGE_ROOT}/${file}`} /></figure>;
}

type TreeNode = { label: string; x: number; y: number; parent?: number; kind?: "function" | "terminal"; hot?: boolean };
function ProgramTree({ nodes, label }: { nodes: TreeNode[]; label: string }) {
  return <svg className="l10-tree" viewBox="0 0 640 350" role="img" aria-label={label}>
    {nodes.map((node, index) => node.parent === undefined ? null : <line key={`e-${index}`} x1={nodes[node.parent].x} y1={nodes[node.parent].y} x2={node.x} y2={node.y}/>) }
    {nodes.map((node, index) => <g className={`${node.kind ?? "function"} ${node.hot ? "hot" : ""}`} key={`${node.label}-${index}`}><circle cx={node.x} cy={node.y} r="28"/><text x={node.x} y={node.y + 8}>{node.label}</text></g>)}
  </svg>;
}


function ExpressionTree({ expression }: { expression: string }) {
  const tokens = expression.replaceAll("−", "-").match(/\(|\)|[^\s()]+/g) ?? [];
  type Branch = { label: string; children: Branch[]; x: number; y: number };
  let cursor = 0;
  function parse(): Branch {
    const token = tokens[cursor++];
    if (token !== "(") return { label: token, children: [], x: 0, y: 0 };
    const label = tokens[cursor++], children: Branch[] = [];
    while (tokens[cursor] !== ")" && cursor < tokens.length) children.push(parse());
    cursor++;
    return { label, children, x: 0, y: 0 };
  }
  const tree = parse(), nodes: Branch[] = [], edges: Array<[Branch, Branch]> = [];
  let leaves = 0, depth = 0;
  function layout(node: Branch, level: number) {
    depth = Math.max(depth, level); node.y = 36 + level * 82;
    if (!node.children.length) node.x = 90 + leaves++ * 180;
    else { node.children.forEach(child => { layout(child, level + 1); edges.push([node, child]); }); node.x = node.children.reduce((sum, child) => sum + child.x, 0) / node.children.length; }
    nodes.push(node);
  }
  layout(tree, 0);
  const width = Math.max(leaves * 180, ...nodes.map(node => node.label.length * 17 + 30));
  nodes.forEach(node => { node.x += (width - leaves * 180) / 2; });
  return <svg className="l10-expression-tree" viewBox={`0 0 ${width} ${depth * 82 + 72}`} role="img" aria-label={`Parse tree for ${expression}`}>
    {edges.map(([a,b],i)=><line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>)}
    {nodes.map((node,i)=><g key={i} className={node.children.length ? "function" : "terminal"}><rect x={node.x - Math.max(28,node.label.length*8.5)} y={node.y-22} width={Math.max(56,node.label.length*17)} height="44" rx="12"/><text x={node.x} y={node.y+6}>{node.label}</text></g>)}
  </svg>;
}
function ProgramCard({ label, expression }: { label: string; expression: string }) {
  return <article className="l10-program-card"><Tag>{label}</Tag><code>{expression}</code><ExpressionTree expression={expression}/></article>;
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
  return <div className="l10-crossover-trees"><div>{[
    ["Parent 1", "(+ X (* 3 Y))"], ["Parent 2", "(- (/ 25 X) 7)"],
    ["Child 1", "(+ X (* (/ 25 X) Y))"], ["Child 2", "(- 3 7)"]
  ].map(([label,expression])=><ProgramCard key={label} label={label} expression={expression}/>)}</div><p>Exchange terminal <b>3</b> in Parent 1 with subtree <b>(/ 25 X)</b> in Parent 2. Each child’s tree matches its prefix program; crossover can change program size.</p></div>;
}

function GuidedSearch() {
  return <div className="l10-random"><section><Tag tone="coral">Random generation only</Tag><div className="bars">{[22,31,27,43,35,48,40,52].map((v,i)=><i style={{height:`${v}%`}} key={i}/>)}</div><h3>200,000 unrelated attempts</h3><p>No information passes from a useful program to the next attempt.</p></section><b>fitness + inheritance</b><section><Tag tone="teal">Genetic programming</Tag><div className="bars guided">{[25,34,45,49,61,67,73,84].map((v,i)=><i style={{height:`${v}%`}} key={i}/>)}</div><h3>200 generations × 1,000</h3><p>Selection preserves useful structure statistically; crossover and mutation explore related programs.</p></section><aside>The cited tic-tac-toe comparison found the evolved program significantly better than the best purely random program. That is evidence for one experiment—not a universal guarantee.</aside></div>;
}

type MazeCell = [number, number];
type MazeDirection = "up" | "down" | "left" | "right";
type MouseAction = "forward" | "left" | "right";
const mazeColumns=9, mazeRows=6, mazeStart:MazeCell=[0,5], mazeGoal:MazeCell=[8,0];
const mazeOpenCells:MazeCell[]=[
  [0,5],[1,5],[1,4],[2,4],[2,3],[3,3],[4,3],[4,2],[5,2],[6,2],[6,1],[7,1],[8,1],[8,0],
  [0,4],[0,3],[1,3],[2,5],[3,5],[3,4],[2,2],[2,1],[1,1],[1,0],[0,0],[3,2],[3,1],[4,1],[4,0],
  [5,3],[5,4],[6,4],[7,4],[7,3],[8,3],[5,1],[5,0],[6,0],
];
const mazeSolution:MazeCell[]=[[0,5],[1,5],[1,4],[2,4],[2,3],[3,3],[4,3],[4,2],[5,2],[6,2],[6,1],[7,1],[8,1],[8,0]];
const mazeCandidate:MazeCell[]=[[0,5],[1,5],[1,4],[0,4],[0,3],[1,3]];
const mazeKey=([x,y]:MazeCell)=>`${x},${y}`;
const mazeOpen=new Set(mazeOpenCells.map(mazeKey));
const mazeSteps:{direction:MazeDirection;dx:number;dy:number;symbol:string}[]=[
  {direction:"up",dx:0,dy:-1,symbol:"↑"},{direction:"left",dx:-1,dy:0,symbol:"←"},
  {direction:"right",dx:1,dy:0,symbol:"→"},{direction:"down",dx:0,dy:1,symbol:"↓"},
];

function mazeDistance(start:MazeCell) {
  const queue:{cell:MazeCell;distance:number}[]=[{cell:start,distance:0}],visited=new Set([mazeKey(start)]);
  while(queue.length){const current=queue.shift()!;if(mazeKey(current.cell)===mazeKey(mazeGoal))return current.distance;for(const {dx,dy} of mazeSteps){const next:MazeCell=[current.cell[0]+dx,current.cell[1]+dy],key=mazeKey(next);if(mazeOpen.has(key)&&!visited.has(key)){visited.add(key);queue.push({cell:next,distance:current.distance+1});}}}
  return 99;
}

function MazeScene({position,trail,facing="right",label}:{position:MazeCell;trail:MazeCell[];facing?:MazeDirection;label:string}) {
  const ox=48,oy=38,cw=68,ch=58,center=([x,y]:MazeCell)=>[ox+x*cw+cw/2,oy+y*ch+ch/2];
  const points=trail.map(cell=>center(cell).join(",")).join(" "),[mx,my]=center(position),[gx,gy]=center(mazeGoal);
  const rotation={right:0,left:180,up:-90,down:90}[facing];
  const cells=Array.from({length:mazeRows*mazeColumns},(_,i):MazeCell=>[i%mazeColumns,Math.floor(i/mazeColumns)]);
  return <svg className="l10-maze" viewBox="0 0 710 430" role="img" aria-label={label}>
    <defs><linearGradient id="l10-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f9ffff"/><stop offset="1" stopColor="#dff4f3"/></linearGradient><linearGradient id="l10-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b9c9e8"/><stop offset="1" stopColor="#7183b0"/></linearGradient><filter id="l10-shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#17243d" floodOpacity=".24"/></filter></defs>
    <rect className="maze-board" x="20" y="16" width="670" height="394" rx="28"/>
    {cells.map(([x,y])=>{const open=mazeOpen.has(`${x},${y}`),px=ox+x*cw,py=oy+y*ch;return open?<rect className="floor-tile" key={`${x}-${y}`} x={px+2} y={py+2} width={cw-4} height={ch-4} rx="10"/>:<g className="wall-cube" key={`${x}-${y}`}><rect className="wall-side" x={px+5} y={py+9} width={cw-5} height={ch-3} rx="9"/><rect className="wall-face" x={px+1} y={py+1} width={cw-5} height={ch-9} rx="9"/><path className="wall-shine" d={`M${px+9} ${py+9}H${px+cw-14}`}/></g>})}
    {points&&<polyline className="legal-route" points={points}/>}
    <g className="cheese-3d" transform={`translate(${gx} ${gy})`} filter="url(#l10-shadow)"><path className="cheese-side" d="M-18-10L24 0L-18 20Z"/><path className="cheese-top" d="M-21-17L25-5L-21 13Z"/><circle cx="-8" cy="-7" r="4"/><circle cx="-9" cy="6" r="3"/><circle cx="7" cy="-2" r="3"/></g>
    <g className="rat" transform={`translate(${mx} ${my}) rotate(${rotation})`} filter="url(#l10-shadow)"><path className="tail" d="M-22 8C-43 19-46-12-61-3"/><ellipse className="body" cx="-5" cy="1" rx="24" ry="17"/><circle className="head" cx="17" cy="0" r="14"/><circle className="ear" cx="10" cy="-11" r="7"/><circle className="ear" cx="21" cy="-10" r="6"/><path className="snout" d="M27-5L39 0L27 5Z"/><circle className="eye" cx="22" cy="-4" r="2.4"/><path className="whiskers" d="M28-2L42-8M29 1L44 1M28 4L42 9"/></g>
  </svg>;
}

function InteractiveMouseMaze({scoreMode=false}:{scoreMode?:boolean}) {
  const [position,setPosition]=useState<MazeCell>(mazeStart),[trail,setTrail]=useState<MazeCell[]>([mazeStart]);
  const [actions,setActions]=useState(0),[facing,setFacing]=useState<MazeDirection>("right"),[status,setStatus]=useState("Use FORWARD, LEFT, and RIGHT to guide the rat.");
  const remaining=useMemo(()=>mazeDistance(position),[position]),won=mazeKey(position)===mazeKey(mazeGoal),liveFitness=(actions+remaining)**2;
  const act=(action:MouseAction)=>{setActions(old=>old+1);if(action!=="forward"){const headings:MazeDirection[]=["up","right","down","left"],turn=action==="right"?1:-1,nextFacing=headings[(headings.indexOf(facing)+turn+4)%4];setFacing(nextFacing);setStatus(`${action.toUpperCase()} turns the rat to face ${nextFacing}; its cell does not change.`);return;}const step=mazeSteps.find(item=>item.direction===facing)!;const next:MazeCell=[position[0]+step.dx,position[1]+step.dy];if(!mazeOpen.has(mazeKey(next))){setStatus(`FORWARD is blocked by a raised wall while facing ${facing}.`);return;}setPosition(next);setTrail(old=>[...old,next]);setStatus(mazeKey(next)===mazeKey(mazeGoal)?"Success! The rat reached the cheese.":`FORWARD moved one cell ${facing}.`);};
  const reset=()=>{setPosition(mazeStart);setTrail([mazeStart]);setActions(0);setFacing("right");setStatus("Maze reset. The rat starts facing right.");};
  const onKeyDown=(event:KeyboardEvent<HTMLDivElement>)=>{const map:Record<string,MouseAction>={ArrowUp:"forward",w:"forward",W:"forward",ArrowLeft:"left",a:"left",A:"left",ArrowRight:"right",d:"right",D:"right"};const action=map[event.key];if(action){event.preventDefault();event.stopPropagation();act(action);}};
  return <div className={`l10-maze-demo${won?" won":""}`} tabIndex={0} onKeyDown={onKeyDown} aria-label="Interactive mouse maze. Use forward, turn left, or turn right.">
    <MazeScene position={position} trail={trail} facing={facing} label="Interactive raised-wall maze with a rat, legal route, and cheese target"/>
    <div className="maze-dashboard"><div className="maze-stats"><span><b>{actions}</b> executed actions</span><span><b>{remaining}</b> corridor distance</span><span><b>{facing}</b> facing</span>{scoreMode&&<span className="score"><b>{liveFitness}</b> live score</span>}</div><div className="maze-controls" aria-label="Mouse terminal controls"><button className="action" aria-label="Move forward one step" onClick={()=>act("forward")}><b>↑</b><small>FORWARD</small></button><button className="action" aria-label="Turn left without moving" onClick={()=>act("left")}><b>↶</b><small>LEFT</small></button><button className="action" aria-label="Turn right without moving" onClick={()=>act("right")}><b>↷</b><small>RIGHT</small></button><button className="reset" onClick={reset}>Reset</button></div><p aria-live="polite">{status}</p></div>
  </div>;
}

function Maze({ improved=false }: { improved?: boolean }) {
  const trail=improved?mazeSolution:mazeCandidate;
  return <MazeScene position={trail.at(-1)!} trail={trail} facing={improved?"up":"right"} label={improved?"Improved legal rat route through the maze":"Candidate legal rat route that stops far from the cheese"}/>;
}

function MouseSetup() {
  return <div className="l10-mouse"><InteractiveMouseMaze/><section><Tag tone="amber">Try the task</Tag><h3>Reach the cheese without crossing a wall.</h3><p className="maze-instruction"><b>FORWARD</b> moves one cell in the current heading. <b>LEFT</b> and <b>RIGHT</b> rotate 90° in place. Keyboard: ↑/W, ←/A, →/D.</p><div><b>Function set</b><code>{`{ IF-BLOCKED, WHILE-NOT-AT-CHEESE }`}</code></div><div><b>Terminal set</b><code>{`{ FORWARD, LEFT, RIGHT }`}</code></div><div className="l10-mouse-program"><code>(WHILE-NOT-AT-CHEESE (IF-BLOCKED LEFT FORWARD))</code><ExpressionTree expression="(WHILE-NOT-AT-CHEESE (IF-BLOCKED LEFT FORWARD))"/><small>Repeat until cheese. IF-BLOCKED takes the left child when blocked, the right child otherwise.</small></div></section></div>;
}

function MouseFitness() {
  return <div className="l10-mouse-fitness"><InteractiveMouseMaze scoreMode/><section><Tag tone="coral">Lower is better</Tag><h3>fitness = (execution cost + final distance)²</h3><p className="maze-instruction">Every executed terminal costs 1: a turn changes heading only; a blocked <b>FORWARD</b> costs an action but cannot cross the wall.</p><div className="source-benchmark"><small>Source benchmark</small><div className="l10-equation"><span>100</span><i>units spent</i><b>+</b><span>10</span><i>moves away</i><b>→</b><strong>12,100</strong></div></div><ul><li>Every non-root function or terminal costs 1 unit.</li><li>The mouse dies after more than 100 units.</li><li>Distance penalizes controllers that stop far from the exit.</li></ul><p>A fitness function makes behavior measurable, but it also defines what evolution will exploit.</p></section></div>;
}

function MouseVariation() {
  return <div className="l10-mouse-variation-trees"><div><ProgramCard label="Candidate A · 12,996" expression="(IF-BLOCKED LEFT FORWARD)"/><ProgramCard label="Mutation" expression="(IF-BLOCKED LEFT LEFT)"/><ProgramCard label="Crossover offspring · 11,664" expression="(IF-BLOCKED FORWARD LEFT)"/></div><p>Left child = blocked action; right child = otherwise action. These are body subtrees inside WHILE-NOT-AT-CHEESE. Compare fitness by executing the complete controller, counting cost, and measuring final distance.</p></div>;
}

function MouseResult() {
  return <div className="l10-result-code"><div><Tag tone="coral">Earlier · 12,996</Tag><Maze/></div><section><Tag>LISP-style controller · 2,809</Tag><pre>{`(WHILE-NOT-AT-CHEESE
  (IF-BLOCKED
    (PROGN RIGHT FORWARD FORWARD FORWARD)
    (PROGN FORWARD RIGHT FORWARD FORWARD
      LEFT (IF-BLOCKED LEFT FORWARD))))`}</pre><p>PROGN executes actions in order. IF-BLOCKED selects the first branch when blocked, otherwise the second.</p><small>4,202 generations × 1,000 programs. This encodes the evolved controller’s action sequence.</small></section><div><Tag tone="teal">Evolved · 2,809</Tag><Maze improved/></div></div>;
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
  return <div className="l10-regression"><svg viewBox="0 0 740 370" role="img" aria-label="Training points and learned function x squared divided by two"><path className="axis" d="M65 30V320H705"/><path className="curve" d={curve}/>{pts.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="7"/><text x={x} y={342}>{(i/10).toFixed(1)}</text></g>)}<text x="450" y="90">learned f(x) = x²/2</text></svg><section><Tag tone="amber">Symbolic regression</Tag><h3>Evolve the function, not only its coefficients.</h3><div className="l10-regression-data"><b>Terminal set</b><span>x; integers −5…+5</span><b>Function set</b><span>+ · − · × · protected ÷</span><b>Fitness</b><span>error over 10 training records</span><b>Population</b><span>600</span><b>Operators</b><span>90% crossover · 5% mutation</span><b>Stop</b><span>error ≤ .001 or 100 generations</span></div><aside className="l10-external-reading"><strong>External reading · worked Python example</strong><a href="https://gplearn.readthedocs.io/en/stable/examples.html#symbolic-regressor" target="_blank" rel="noopener noreferrer">gplearn: Symbolic Regressor example ↗</a><p>Follow data generation, program evolution, test-set evaluation, and visualization of the learned program tree.</p></aside></section></div>;
}

function ParallelSearch() {
  const points=useMemo(()=>Array.from({length:34},(_,i)=>[55+(i*83)%710,235-90*Math.sin(i*1.7)-(i%4)*18]),[]);
  return <div className="l10-parallel"><svg viewBox="0 0 820 350" role="img" aria-label="Population candidates distributed across a multi-peaked quality landscape"><path d="M20 300C110 270 100 120 190 130S300 300 370 220 440 55 515 115 610 305 690 215 740 105 805 140"/>{points.map(([x,y],i)=><circle className={`g${i%3}`} cx={x} cy={y} r="7" key={i}/>)}</svg><section><Tag>Implicit parallelism</Tag><p>Many programs explore different regions at once. Selection concentrates effort, while variation can move candidates away from a current peak.</p><div><b>Good fit</b><span>executable structure, black-box evaluation, approximation acceptable</span></div><div><b>Weak fit</b><span>a safe exact algorithm is known, evaluation is costly, or program behavior cannot be tested reliably</span></div><small>Applications in the source include spacecraft control, neural structures, image analysis, expert systems, fuzzy control, and hardware evolution.</small></section></div>;
}

function AlifeIntro() {
  return <div className="l10-alife"><GeneratedVisual file="artificial-life-modes.png" alt="Three artificial-life modes: biochemical protocells, embodied robots, and a simulated digital ecosystem"/><section><Tag tone="teal">Artificial Life</Tag><h3>Study life-like processes by constructing systems that exhibit them.</h3><div><b>Wet</b><span>biochemistry and material processes</span></div><div><b>Hard</b><span>robotics and embodied agents</span></div><div><b>Soft</b><span>simulation and digital organisms</span></div><p>Simulators make mechanisms observable: Polyworld, Avida, EcoSim, OpenWorm/Geppetto, and Neurokernel use different models to expose different phenomena.</p></section></div>;
}

function Bird({x,y,angle=0,phase=0}:{x:number;y:number;angle?:number;phase?:number}) {
  return <g className={`l10-bird wing-${phase%2}`} transform={`translate(${x} ${y}) rotate(${angle})`}><path className="tail" d="M-24 1L-41-11L-37 3L-43 13Z"/><ellipse className="body" cx="-4" cy="0" rx="27" ry="14"/><path className="wing upper" d="M-13-4Q-26-35 4-17Q18-8 15 0Z"/><path className="wing lower" d="M-7 5Q1 34 22 13Q25 4 14-1Z"/><circle className="head" cx="22" cy="-3" r="11"/><circle className="eye" cx="25" cy="-6" r="2.3"/><path className="beak" d="M31-5L43 0L31 3Z"/></g>;
}

function SwarmConcept() {
  const [step,setStep]=useState(0);
  const layouts=[[[95,82,-16],[220,70,8],[355,105,-6],[520,74,16],[650,126,-12],[150,230,14],[315,275,-15],[490,245,8],[650,295,-4]],[[85,110,0],[210,92,0],[335,125,0],[470,100,0],[610,120,0],[145,240,0],[285,235,0],[440,250,0],[595,238,0]],[[155,188,-8],[235,150,-3],[305,205,2],[380,160,4],[445,215,6],[520,178,8],[355,275,3],[270,270,-2],[445,285,5]],[[90,275,-18],[175,230,-12],[260,200,-7],[350,165,-2],[445,130,3],[535,105,7],[625,82,12],[315,255,-5],[410,220,1]]];
  const labels=['Separate from close neighbors','Align headings','Cohere toward nearby birds','Emergent flock'];
  return <div className="l10-swarm-concept"><div className="l10-flock-stage"><svg viewBox="0 0 720 370" role="img" aria-label={`Illustrated bird flock: ${labels[step]}`}><defs><linearGradient id="l10-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dff5ff"/><stop offset="1" stopColor="#f7fcff"/></linearGradient><marker id="l10-flock-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs><rect width="720" height="370" rx="22" fill="url(#l10-sky)"/><path className="cloud" d="M0 70Q55 22 112 65Q165 27 215 74V0H0Z"/><path className="horizon" d="M0 330Q130 280 255 325T520 315T720 325V370H0Z"/>{layouts[step].map(([x,y,a],i)=><Bird key={i} x={x} y={y} angle={a} phase={i+step}/>)}{step===0&&<><circle className="rule-ring danger" cx="95" cy="82" r="46"/><path className="rule-arrow" d="M120 90L170 112"/></>}{step===1&&<path className="rule-arrow" d="M135 55H270"/>}{step===2&&<><circle className="rule-ring" cx="355" cy="210" r="145"/><path className="rule-arrow" d="M535 280Q460 245 410 215"/></>}{step===3&&<path className="flock-flow" d="M65 305Q330 185 650 58"/>}<text className="scene-label" x="28" y="338">{labels[step]}</text></svg><div className="l10-stage-buttons" aria-label="Flocking stages">{labels.map((label,i)=><button className={step===i?'active':''} key={label} onClick={()=>setStep(i)}><b>{i+1}</b><span>{label.split(' ')[0]}</span></button>)}</div></div><section><Tag>Swarm intelligence · {step+1}/4</Tag><h3>Local interaction can yield organized global behavior without a central controller.</h3><p>{['Each bird steers away when a neighbor is too close; no bird receives a centrally planned route.','A bird adjusts toward the average heading of the nearby birds it can sense.','A bird also steers toward the local center of its neighbors, keeping the flock together.','Repeated local updates create a coherent, adaptive flock-level path.'][step]}</p><ul><li>Recognizable autonomous agents</li><li>Local sensing and action</li><li>Partly stochastic rules</li><li>Emergent collective pattern</li></ul><aside><b>Robot-demo check</b><span>A group is a swarm only when coordination emerges from local agent rules—not centralized choreography.</span></aside></section></div>;
}

function PsoMotion() {
  const [step,setStep]=useState(0);
  const data=[{p:[210,270],pb:[150,180],gb:[590,80],next:[210,270]},{p:[210,270],pb:[150,180],gb:[590,80],next:[300,205]},{p:[300,205],pb:[300,205],gb:[590,80],next:[405,145]},{p:[405,145],pb:[405,145],gb:[590,80],next:[500,105]}][step];
  const arrow=(from:number[],to:number[],cls:string,label:string)=><g className={cls}><line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}/><text x={(from[0]+to[0])/2} y={(from[1]+to[1])/2-8}>{label}</text></g>;
  return <div className="l10-pso"><svg viewBox="0 0 700 370" role="img" aria-label={`Particle swarm optimization update step ${step+1}`}><defs><marker id="l10-pso-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs>{[[570,90,65],[570,90,115],[570,90,170],[570,90,235]].map((c,i)=><ellipse key={i} cx={c[0]} cy={c[1]} rx={c[2]} ry={c[2]*.58}/>)}<circle className="gb" cx={data.gb[0]} cy={data.gb[1]} r="15"/><text x={610} y={70}>gBest</text><circle className="pb" cx={data.pb[0]} cy={data.pb[1]} r="13"/><text x={data.pb[0]+18} y={data.pb[1]-12}>pBest</text><circle className="p" cx={data.p[0]} cy={data.p[1]} r="17"/><text x={data.p[0]-8} y={data.p[1]+6}>p</text>{arrow(data.p,[data.p[0]+65,data.p[1]-10],'inertia','momentum')}{arrow(data.p,data.pb,'personal','personal')}{arrow(data.p,data.gb,'social','social')}<circle className="next" cx={data.next[0]} cy={data.next[1]} r="18"/><text x={data.next[0]+20} y={data.next[1]+24}>next</text></svg><section><Tag tone="teal">PSO update · {step+1}/4</Tag><h3>{['Evaluate current position','Combine three influences','Update personal best','Move toward a stronger region'][step]}</h3><code>v ← v + c₁r₁(pBest−p) + c₂r₂(gBest−p)</code><code>p ← p + v</code><p>{['Compute fitness f(p); retain the best location this particle has personally visited.','Velocity mixes momentum, personal memory, and the swarm’s best shared location.','If the new position is better, overwrite pBest; gBest is the best pBest in the swarm.','Repeat until the stopping condition; particles share best positions, not genetic material.'][step]}</p><div>{[0,1,2,3].map(i=><button className={step===i?'active':''} key={i} onClick={()=>setStep(i)}>{i+1}</button>)}</div></section></div>;
}

function Bee({x,y,angle=0}:{x:number;y:number;angle?:number}) { return <g className="l10-bee" transform={`translate(${x} ${y}) rotate(${angle})`}><ellipse className="bee-wing" cx="-5" cy="-8" rx="9" ry="6" transform="rotate(-25)"/><ellipse className="bee-wing" cx="6" cy="-8" rx="9" ry="6" transform="rotate(25)"/><ellipse className="bee-body" rx="15" ry="9"/><path d="M-7-8V8M1-9V9M8-7V7"/><circle className="bee-head" cx="16" cy="0" r="6"/><path className="antenna" d="M18-4Q24-12 28-8M19 3Q25 8 29 4"/></g> }
function FlowerPatch({x,y,color,label}:{x:number;y:number;color:string;label:string}) { const pts=[[-31,8],[-8,-12],[18,3],[35,-15],[12,24],[-20,29]]; return <g className="l10-flower-patch" transform={`translate(${x} ${y})`}>{pts.map(([fx,fy],i)=><g key={i} transform={`translate(${fx} ${fy})`}><path d="M0 8V30"/><circle fill={color} cx="0" cy="0" r="11"/><circle fill="#fff6b0" cx="0" cy="0" r="4"/></g>)}<text y="58">{label}</text></g> }
function Hive({x,y}:{x:number;y:number}) { return <g className="l10-hive" transform={`translate(${x} ${y})`}><path className="roof" d="M-67-61H67L54-42H-54Z"/><rect x="-58" y="-42" width="116" height="108" rx="8"/><path d="M-58-13H58M-58 16H58M-58 45H58"/><ellipse className="entrance" cx="0" cy="48" rx="15" ry="9"/><path className="stand" d="M-72 66H72V78H-72Z"/></g> }


function PsoDemo() {
  return <div className="l10-pso-algorithm"><PsoMotion/><section><Tag>PSO pseudocode · minimize f</Tag><pre>{`initialize positions pᵢ and velocities vᵢ
evaluate f(pᵢ); pBestᵢ ← pᵢ
gBest ← best pBestᵢ in the swarm
while stopping criterion is not met:
  g ← gBest  // shared snapshot
  for each particle i:
    draw independent r₁, r₂ ∈ [0,1] per dimension
    vᵢ ← vᵢ + c₁r₁(pBestᵢ−pᵢ) + c₂r₂(g−pᵢ)
    pᵢ ← pᵢ + vᵢ; enforce search-space bounds
    evaluate f(pᵢ)
    if f(pᵢ) < f(pBestᵢ): pBestᵢ ← pᵢ
  gBest ← best pBestᵢ in the swarm
return gBest`}</pre><p>c₁ and c₂ weight personal/social attraction; r₁ and r₂ add randomness. For maximization, use &gt; in the best-value comparison. This form uses inertia weight 1.</p></section></div>;
}


function SwarmReading({ kind }: { kind: "bees" | "ants" }) {
  const bees = kind === "bees";
  return <aside className="l10-external-reading" aria-label={bees ? "Bees Algorithm external reading" : "Ant Colony Optimization external reading"}>
    <strong>External reading · algorithm details</strong>
    <a href={bees ? "http://beesalgorithmsite.altervista.org/BeesAlgorithm.htm" : "https://www.cs.unm.edu/~forrest/classes/cs523-2015/readings/DorigoIEEEAnts2006.pdf"} target="_blank" rel="noopener noreferrer">
      {bees ? "The Bees Algorithm ↗" : "Ant Colony Optimization: Artificial Ants as a Computational Intelligence Technique ↗"}
    </a>
    <small>{bees ? "Bees Algorithm website · external reading" : "Dorigo, Birattari & Stützle (2006) · free university-hosted article PDF"}</small>
    <p>{bees ? "Read about the Bees Algorithm: site selection, recruitment, neighbourhood search, and global scouting." : "Read Section II and Algorithm 1: construct solutions, optional local search, and pheromone updates; compare Ant System, MAX–MIN Ant System, and Ant Colony System."}</p>
    <b>{bees ? "Reading question: How do recruitment counts and neighbourhood size balance exploration and exploitation?" : "Reading question: How do α, β, and evaporation ρ change edge-choice probabilities and reinforcement?"}</b>
  </aside>;
}

function BeesDemo() {
  const [step,setStep]=useState(0); const titles=['Scout','Evaluate','Waggle dance','Recruit + exploit','Abandon or revisit']; const scouts=[[350,80,-10],[520,88,8],[575,260,14]]; const recruitCount=[3,3,1,9,7][step];
  return <div className="l10-bees l10-with-reading"><div className="l10-bee-stage"><svg viewBox="0 0 760 360" role="img" aria-label={`Illustrated hive and flower patches: ${titles[step]}`}><defs><marker id="l10-bee-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs><rect width="760" height="360" rx="22" fill="#eef9f4"/><path className="meadow" d="M0 250Q150 218 305 258T600 242T760 255V360H0Z"/><Hive x={112} y={182}/><FlowerPatch x={410} y={90} color="#ef7c8d" label="patch A · low"/><FlowerPatch x={620} y={160} color="#8f78e8" label="patch B · rich"/><FlowerPatch x={455} y={285} color="#f3ba32" label="patch C · medium"/>{step<=1&&scouts.map(([x,y,a],i)=><Bee key={i} x={x} y={y} angle={a}/>)}{step===0&&scouts.map(([x,y],i)=><path key={i} className="bee-route scout" d={`M170 180Q${(170+x)/2} ${i===2?300:62} ${x-25} ${y}`}/>)}{step===1&&<><circle className="quality low" cx="410" cy="90" r="64"/><circle className="quality high" cx="620" cy="160" r="75"/><circle className="quality med" cx="455" cy="285" r="68"/></>}{step===2&&<><Bee x={180} y={178}/><path className="waggle" d="M190 155C220 125 245 185 215 195S190 135 225 130S260 190 225 205"/><text className="dance-note" x="245" y="128">angle → direction</text><text className="dance-note" x="260" y="214">duration → distance</text></>}{step>=3&&<><path className="bee-route rich" d="M170 180Q360 62 575 150"/><path className="bee-route medium" d="M170 190Q300 320 415 285"/>{step===3&&<path className="bee-route weak" d="M170 170Q290 78 370 90"/>}{Array.from({length:recruitCount},(_,i)=><Bee key={i} x={250+(i%4)*92} y={135+(i%3)*34} angle={i%2?10:-8}/>)}</>}</svg><div className="l10-stage-buttons five" aria-label="Bees algorithm stages">{titles.map((title,i)=><button className={step===i?'active':''} key={title} onClick={()=>setStep(i)}><b>{i+1}</b><span>{title}</span></button>)}</div></div><section><Tag tone="amber">Bees algorithm · {step+1}/5</Tag><h3>{titles[step]}</h3><p>{['Scout bees leave the hive and sample flower patches in different directions.','Each scout estimates patch quality from the nectar or pollen it finds.','Back at the hive, dance angle encodes direction, duration encodes distance, and intensity communicates quality.','A richer patch recruits more follower bees and receives more local-search effort.','Weak patches are abandoned while some scouts explore again, preserving discovery.'][step]}</p><div>{[0,1,2,3,4].map(i=><button aria-label={titles[i]} className={step===i?'active':''} key={i} onClick={()=>setStep(i)}>{i+1}</button>)}</div><SwarmReading kind="bees"/></section></div>;
}

function Ant({x,y,angle=0}:{x:number;y:number;angle?:number}) { return <g className="l10-ant-real" transform={`translate(${x} ${y}) rotate(${angle})`}><ellipse className="abdomen" cx="-13" rx="10" ry="8"/><circle className="thorax" r="7"/><circle className="head" cx="12" r="6"/><path className="legs" d="M-5-4L-14-15M0-5V-17M5-4L15-14M-5 4L-14 15M0 5V17M5 4L15 14"/><path className="antennae" d="M16-3Q24-11 29-7M16 3Q24 11 29 7"/></g> }
function AntNest({x,y}:{x:number;y:number}) { return <g className="l10-ant-nest" transform={`translate(${x} ${y})`}><path d="M-62 32Q-50-24 0-40Q50-24 62 32Z"/><path className="soil" d="M-55 20Q-20-14 0-30Q24-12 52 19"/><ellipse className="entrance" cx="0" cy="22" rx="19" ry="12"/><path className="grass" d="M-45 8L-50-10M-44 8L-34-8M37 6L35-13M38 6L49-8"/></g> }
function AntFood({x,y}:{x:number;y:number}) { return <g className="l10-ant-food" transform={`translate(${x} ${y})`}><path className="leaf" d="M-25 2Q-8-28 25-22Q20 12-15 20Q-27 17-25 2Z"/><path d="M-18 13Q2-2 20-17"/><circle className="berry" cx="13" cy="15" r="13"/><path className="shine" d="M8 10Q13 6 18 10"/></g> }
function Rock({x,y}:{x:number;y:number}) { return <g className="l10-rock" transform={`translate(${x} ${y})`}><path className="shadow" d="M-75 55Q0 80 78 52Q46 78-47 73Z"/><path className="base" d="M-72 48L-58-25L-21-65L36-53L70-12L61 50Z"/><path className="face" d="M-58-25L-21-65L10-22L-3 49L-72 48Z"/><path className="top" d="M-21-65L36-53L70-12L10-22Z"/><path className="crack" d="M12-20L34 4L20 20L44 42"/></g> }

function AcoObstacle() {
  const [step,setStep]=useState(0); const titles=['Trail interrupted','Random left/right split','Short detour returns sooner','Positive feedback amplifies it','Shortest path dominates']; const shortWidth=[3,5,9,14,18][step], longWidth=[3,5,7,6,4][step]; const ants=[[145,174,0],[235,156,-12],[315,125,-18],[475,122,12],[555,150,12],[635,173,0],[270,265,18],[410,294,0],[535,250,-20]];
  return <div className="l10-aco"><svg viewBox="0 0 780 350" role="img" aria-label={`Illustrated ants navigating around a rock: ${titles[step]}`}><defs><marker id="l10-ant-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker><linearGradient id="l10-ground" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#eef8e7"/><stop offset="1" stopColor="#d9edc7"/></linearGradient></defs><rect width="780" height="350" rx="22" fill="url(#l10-ground)"/><path className="ground-dots" d="M0 292Q170 270 330 302T780 288V350H0Z"/><AntNest x={73} y={176}/><AntFood x={705} y={170}/><Rock x={390} y={176}/><path className="trail short" style={{'--trail':shortWidth} as CSSProperties} d="M118 175C230 175 270 105 325 105S540 175 660 175"/><path className="trail long" style={{'--trail':longWidth} as CSSProperties} d="M118 180C220 182 250 305 390 305S555 185 660 180"/>{ants.slice(0,step+5).map(([x,y,a],i)=><Ant key={i} x={x} y={y} angle={a}/>)}<text className="object-label" x="73" y="252">NEST</text><text className="object-label" x="390" y="82">ROCK</text><text className="object-label" x="705" y="232">FOOD</text></svg><section><Tag tone="coral">Obstacle trace · {step+1}/5</Tag><h3>{titles[step]}</h3><p>{['Ants initially follow one pheromone trail between their nest and a food source.','The rock blocks the trail, so stochastic choices explore both real detours.','The shorter route completes more trips per unit time and receives pheromone faster.','More pheromone raises following probability, sending still more ants along that route.','Evaporation weakens the underused detour while continued ant traffic maintains the efficient route.'][step]}</p><div>{[0,1,2,3,4].map(i=><button aria-label={titles[i]} className={step===i?'active':''} key={i} onClick={()=>setStep(i)}>{i+1}</button>)}</div></section></div>;
}

function AcoDiscovery() {
  const [step,setStep]=useState(0); const titles=['Random scouts','One ant finds food','Return trail recruits followers','Stochastic alternatives remain','Evaporation adapts memory']; const routes=[2,4,7,13,10];
  const ants=[[150,188,-8],[220,120,-25],[274,248,20],[342,166,-8],[420,118,-12],[495,111,-8],[565,92,-10],[620,79,-8],[245,292,14],[390,280,-5],[535,235,-24],[590,152,-18],[315,92,-8]];
  return <div className="l10-discovery l10-with-reading"><svg viewBox="0 0 760 350" role="img" aria-label={`Illustrated ant colony food discovery: ${titles[step]}`}><defs><marker id="l10-discovery-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker><linearGradient id="l10-discovery-ground" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#eef8e7"/><stop offset="1" stopColor="#d9edc7"/></linearGradient></defs><rect width="760" height="350" rx="22" fill="url(#l10-discovery-ground)"/><path className="ground-dots" d="M0 290Q150 260 310 300T590 282T760 292V350H0Z"/><AntNest x={82} y={188}/><AntFood x={680} y={82}/><path className="weak upper" d="M125 180C225 72 315 250 420 140S565 72 640 78"/><path className="weak lower" d="M125 188C225 292 350 260 470 292S595 175 645 102"/><path className="strong" style={{'--trail':routes[step]} as CSSProperties} d="M125 184C245 178 330 135 430 126S565 88 642 82"/>{ants.slice(0,4+step*2).map(([x,y,a],i)=><Ant x={x} y={y} angle={a} key={i}/>)}<text className="object-label" x="82" y="258">NEST</text><text className="object-label" x="680" y="142">FOOD</text></svg><section><Tag>Food discovery · {step+1}/5</Tag><h3>{titles[step]}</h3><p>{['A small number of recognizable scout ants wander away from the nest without a trail.','A successful scout reaches the food and returns while depositing pheromone.','Followers probabilistically choose the marked path and strengthen it on successful trips.','Some ants still explore the faint alternatives, preserving a chance to find a better route.','Unused pheromone evaporates; the shared trail remains strong only where repeated ant traffic reinforces it.'][step]}</p><div>{[0,1,2,3,4].map(i=><button aria-label={titles[i]} className={step===i?'active':''} key={i} onClick={()=>setStep(i)}>{i+1}</button>)}</div><SwarmReading kind="ants"/></section></div>;
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
  slide("Worked case · Building a better mouse", "A mouse controller is a program tree", <MouseSetup/>, [21,22], 3),
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

const lesson10SlidesWithSpeech = lesson10Slides.map((slide, index) => ({ ...slide, note: lesson10InstructorSpeech[index] }));

export function Lesson10Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return <SourceDeckShell forcePrintAll={forcePrintAll} meetingLabel="Module 6 · Lesson 10" meetingTitle="Genetic Programming, Artificial Life, and Swarm Intelligence" notesMode="key-points" resolveSourceReference={resolveSource} slides={lesson10SlidesWithSpeech} sourceCollectionLabel="L07_GP + L08_ArtificialLife" sourceCollectionPath="l07-gp-l08-alife"/>;
}



