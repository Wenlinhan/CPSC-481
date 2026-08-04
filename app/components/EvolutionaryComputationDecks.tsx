"use client";

import { type ReactNode, useState } from "react";
import "../styles/evolutionary-computation.css";
import { type CourseSourceReference } from "./L01DeckShell";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

type Box = { label: string; title: string; text: string };

function Boxes({ items, columns = 3 }: { items: Box[]; columns?: number }) {
  return <div className="ec-boxes" style={{ gridTemplateColumns: `repeat(${columns},minmax(0,1fr))` }}>{items.map((x) => <article key={`${x.label}-${x.title}`}><span>{x.label}</span><h3>{x.title}</h3><p>{x.text}</p></article>)}</div>;
}

function Process({ items }: { items: string[] }) {
  return <div className="ec-process">{items.map((x, i) => <div key={x}><strong>{x}</strong>{i < items.length - 1 && <i>→</i>}</div>)}</div>;
}

function Note({ label, children }: { label: string; children: ReactNode }) {
  return <aside className="ec-note"><strong>{label}</strong><div>{children}</div></aside>;
}

function Check({ question, options, correct, why }: { question: string; options: string[]; correct: number; why: string }) {
  const [choice, setChoice] = useState<number | null>(null);
  return <div className="ec-check"><section><span>Check for understanding</span><h3>{question}</h3><p>Choose, then defend the mechanism.</p></section><div>{options.map((x, i) => <button className={choice === i ? (i === correct ? "correct" : "incorrect") : ""} key={x} onClick={() => setChoice(i)}><b>{String.fromCharCode(65 + i)}</b>{x}</button>)}{choice !== null && <p><strong>{choice === correct ? "Correct." : "Reconsider."}</strong> {why}</p>}</div></div>;
}

function Landscape() {
  return <svg className="ec-landscape" viewBox="0 0 800 330" role="img" aria-label="Candidates distributed over a fitness landscape"><path d="M25 280 C95 275 100 110 185 135 S290 295 365 220 S445 25 540 75 S650 250 770 45" />{[[105,224],[160,148],[325,235],[457,105],[565,121],[700,96]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="12"/>)}<text x="28" y="315">candidate population</text><text x="625" y="35">higher fitness</text></svg>;
}

function Dna() {
  return <div className="ec-dna"><div className="helix">A · T · G · C</div><Process items={["DNA", "transcription", "mRNA", "translation", "amino acids", "protein"]}/></div>;
}

function Bits({ value, cut = 4 }: { value: string; cut?: number }) {
  return <div className="ec-bits">{value.split("").map((x,i) => <span className={i === cut ? "cut" : ""} key={i}>{x}</span>)}</div>;
}

function Operators() {
  const [mode, setMode] = useState(0);
  const pairs = [["11001010","00110101"],["11000101","00111010"],["11001110","00110101"]];
  return <div className="ec-operators"><nav>{["Parents","Crossover","Mutation"].map((x,i)=><button className={mode===i?"active":""} key={x} onClick={()=>setMode(i)}>{x}</button>)}</nav><Bits value={pairs[mode][0]}/><Bits value={pairs[mode][1]}/><p>{mode===0?"Two candidate chromosomes.":mode===1?"Exchange material at a crossover point.":"Flip a selected bit to introduce variation."}</p></div>;
}

function Tree({ expression = "+ 2 3 * / X 7 Y 5" }: { expression?: string }) {
  const n=expression.split(" "); const pts=[[330,45],[90,135],[220,135],[405,135],[565,135],[360,245],[450,245],[525,245],[610,245]];
  return <svg className="ec-tree" viewBox="0 0 660 310" role="img" aria-label="Program parse tree"><path d="M330 45L90 135M330 45L220 135M330 45L405 135M330 45L565 135M405 135L360 245M405 135L450 245M565 135L525 245M565 135L610 245"/>{n.slice(0,9).map((x,i)=><g key={`${x}-${i}`}><circle cx={pts[i][0]} cy={pts[i][1]} r="28"/><text x={pts[i][0]} y={pts[i][1]+8}>{x}</text></g>)}</svg>;
}

function ProgramBuild() {
  const [step,setStep]=useState(0); const expr=["(+ …)","(+ 2 …)","(+ 2 3 …)","(+ 2 3 (* X 7) …)","(+ 2 3 (* X 7) (/ Y 5))"];
  return <div className="ec-builder"><code>{expr[step]}</code><Tree/><div><button disabled={!step} onClick={()=>setStep(step-1)}>Back</button><strong>{step+1}/5 recursive choices</strong><button disabled={step===4} onClick={()=>setStep(step+1)}>Add node</button></div></div>;
}

function Maze() {
  return <div className="ec-maze"><div><b>mouse</b><i/><i/><i/><i/><strong>cheese</strong></div><pre>{"WHILE not-at-cheese\n  IF movement-blocked\n    turn-left\n  ELSE\n    move-forward"}</pre></div>;
}

function Swarm({ kind }: { kind: "PSO"|"Bees" }) {
  const [step,setStep]=useState(0); return <div className="ec-swarm"><section>{Array.from({length:14},(_,i)=><i key={i} style={{left:`${8+(i*17+step*11)%82}%`,top:`${10+(i*29+step*9)%72}%`}}/>)}<b>{kind==="PSO"?"gBest":"best patch"}</b></section><button onClick={()=>setStep((step+1)%4)}>Advance {kind} update</button></div>;
}

function AntLab() {
  const [step,setStep]=useState(0); const names=["random exploration","short route returns sooner","pheromone reinforcement","weak trail evaporates","short route dominates"];
  return <div className={`ec-ant s${step}`}><section><span>Nest</span><b>Food</b><i/><svg viewBox="0 0 760 260"><path className="long" d="M55 130C230 15 505 20 705 130"/><path className="short" d="M55 130C255 225 505 200 705 130"/></svg></section><div><button disabled={!step} onClick={()=>setStep(step-1)}>Previous</button><strong>{names[step]}</strong><button disabled={step===4} onClick={()=>setStep(step+1)}>Next</button></div></div>;
}

function Table() {
  return <div className="ec-table">{[["Method","Candidate","Update","Memory"],["GA","fixed encoding","crossover + mutation","population fitness"],["GP","program tree","subtree operators","population fitness"],["PSO","position + velocity","personal/social motion","pBest + gBest"],["ACO","constructed path","probabilistic choice","pheromone"]].map((r,i)=><div className={i===0?"head":""} key={r[0]}>{r.map(x=><span key={x}>{x}</span>)}</div>)}</div>;
}

const boxes=(...rows:[string,string,string][]):Box[]=>rows.map(([label,title,text])=>({label,title,text}));
const slide=(eyebrow:string,title:string,content:ReactNode,sourceSlides:number[],minutes=3,subtitle?:string):SourceLessonSlide=>({eyebrow,title,content,sourceSlides,minutes,subtitle,note:`Timing: ${minutes} minutes. Explain, illustrate, and check the stated knowledge point using source pages ${sourceSlides.join(", ") || "supplement"}.`});
const alife=(...pages:number[])=>pages.map(page=>100+page);

function resolveLesson10SourceReference(sourceSlide:number):CourseSourceReference {
  const isArtificialLife=sourceSlide>=100;
  const page=isArtificialLife?sourceSlide-100:sourceSlide;
  const deckLabel=isArtificialLife?"L08_ArtificialLife.pdf":"L07_GP.pdf";
  return {
    deckLabel,
    image:`/course-source/l07-gp-l08-alife/${isArtificialLife?"l08-pptx-source-slides":"l07-source-slides"}/slide-${String(page).padStart(2,"0")}.png`,
    key:`${isArtificialLife ? "l08-alife" : "l07-gp"}:${page}`,
    page,
  };
}

const gaSlides:SourceLessonSlide[]=[
 slide("Module 6 · Lesson 9","Evolutionary Computation and Genetic Algorithms",<div className="ec-hero"><Landscape/><Note label="Driving question">How can a population of imperfect candidates become a useful solution?</Note></div>,[1,2],2,"From biological metaphor to representation, selection, crossover, and mutation"),
 slide("Knowledge map","The metaphor creates five computational commitments",<Boxes columns={5} items={boxes(["01","Population","many candidates"],["02","Representation","a genome for each"],["03","Fitness","evidence of quality"],["04","Variation","mutation + crossover"],["05","Selection","who reproduces"])}/>,[2,10,11]),
 slide("Biological foundation","Cells connect stored information, expression, and function",<Boxes items={boxes(["Information","DNA","Hereditary instructions using A, T, G, C."],["Messenger","RNA","Transcribed information for protein production."],["Function","Protein","Amino-acid structures perform cellular functions."])}/>,[3,4]),
 slide("Central dogma","A one-dimensional code produces a time-varying three-dimensional structure",<Dna/>,[5,6]),
 slide("Genetic code","Complementary base pairs and codons make DNA readable",<Boxes columns={4} items={boxes(["Pair","A ↔ T","complementary bases"],["Pair","G ↔ C","complementary bases"],["Codon","three bases","corresponds to an amino acid"],["Gene","coded sequence","instructions for a protein"])}/>,[7]),
 slide("Evolution by natural selection","Inheritance preserves; variation explores; selection changes frequencies",<Process items={["parent genomes","inheritance","crossover + mutation","varied offspring","fitness differences","next generation"]}/>,[8],4),
 slide("Analogy · not identity","Life and software both store instructions—but the mapping is imperfect",<Boxes columns={2} items={boxes(["Life system","DNA → protein","base pair · gene · translation · protein · repair · mutation"],["Computer system","code → execution","bit · instruction · execution order · function · debugging · maintenance"])}/>,[9]),
 slide("From biology to computation","An evolutionary algorithm turns the metaphor into an executable loop",<Process items={["initialize","evaluate","select","vary","replace","stop or repeat"]}/>,[10,11,12],4),
 slide("Knowledge point · GA","A genetic algorithm evolves fixed-form candidate encodings",<Boxes items={boxes(["Representation","Chromosome","fixed-length candidate string"],["Evaluation","Fitness function","candidate → quality score"],["Evolution","Operators","selection, crossover, mutation"])}/>,[13]),
 slide("GA design checklist","A problem is not ready for GA until five questions have answers",<Boxes columns={5} items={boxes(["1","Encode","What does a chromosome mean?"],["2","Initialize","How are candidates created?"],["3","Evaluate","What counts as fit?"],["4","Vary","Which changes stay valid?"],["5","Stop","What is good enough?"])}/>,[13,14],4),
 slide("Worked encoding","Twenty-two bits locate a value in [−1, 2] to six decimals",<div className="ec-work"><Bits value="1000101110110101000111" cut={7}/><code>x = −1 + integer(bits) × 3/(2²²−1)</code><strong>2288967 → x ≈ 0.637197</strong></div>,[15],4),
 slide("Fitness and parameters","The objective becomes a fitness signal; the run needs explicit controls",<Boxes items={boxes(["Objective","maximize f(x)","f(x)=x·sin(10πx)+1"],["Population","300","random 22-bit candidates"],["Probabilities","0.50 / 0.01","crossover / mutation"])}/>,[15,16]),
 slide("Demo · genetic variation","Crossover recombines; mutation introduces local novelty",<Operators/>,[17],4),
 slide("Practice · operator validity","A legal bit operation can still produce an illegal domain solution",<Check question="For a traveling-salesperson route, why is ordinary crossover risky?" options={["It always creates clones","It can repeat or omit cities","It cannot change fitness","It eliminates mutation"]} correct={1} why="A route is a permutation: each city must occur exactly once."/>,[18]),
 slide("TSP representation","A route is naturally a permutation, not an arbitrary bit string",<Boxes columns={2} items={boxes(["Bit encoding","0001 0010 …","Compact, but generic operators may decode to invalid routes."],["Permutation","1 9 2 4 6 5 7 8 3","Direct route representation; operators must preserve membership."])}/>,[18,19]),
 slide("Worked operator · order crossover","Copy a segment, then preserve the other parent's unused order",<div className="ec-work"><code>P1  1 9 2 | 4 6 5 7 | 8 3</code><code>P2  4 5 9 | 1 8 7 6 | 2 3</code><strong>Child  2 3 9 | 4 6 5 7 | 1 8</strong></div>,[20],4),
 slide("Selection pressure","Fitness guides survival without proving correctness",<Landscape/>,[12,16]),
 slide("Failure mode · specification","The algorithm optimizes the score you wrote, including its loopholes",<Boxes columns={2} items={boxes(["Proxy failure","Fast but invalid route","A distance-only score can reward routes that skip cities."],["Repair","Validity + quality","Penalize violations or use validity-preserving operators."])}/>,[14,18,21]),
 slide("Diversity","Without variation, selection can converge prematurely",<Boxes items={boxes(["Mutation","New local material","restores alleles or structures"],["Crossover","Recombination","joins useful partial patterns"],["Population","Coverage","maintains competing hypotheses"])}/>,[8,10]),
 slide("Evaluation","GA is powerful when representation and operators fit the problem",<Boxes columns={2} items={boxes(["Strength","Compact population search","Efficient after candidates, fitness, and variation are well defined."],["Limitation","Encoding burden","Success may depend on representation more than the generic loop."])}/>,[21]),
 slide("Modern perspective","Evolutionary search helps when gradients or exact algorithms are unavailable",<Boxes items={boxes(["Good fit","Black-box objective","Only evaluations are available."],["Good fit","Irregular structure","Candidates are discrete or simulator-defined."],["Weak fit","Known exact method","A specialized algorithm may be faster and safer."])}/>,[21]),
 slide("In-class design studio","Specify a GA before writing code",<div className="ec-studio"><ol><li>Define and decode a candidate.</li><li>Define fitness and one loophole.</li><li>Define validity-preserving variation.</li><li>Choose population and stopping evidence.</li><li>Exchange specifications and audit.</li></ol></div>,[13,14],5),
 slide("Assessment · trace","One generation should be explainable candidate by candidate",<Check question="Which step determines who contributes genetic material to offspring?" options={["Decoding","Selection","Termination","Initialization"]} correct={1} why="Fitness supplies evidence; selection uses it to choose parents or survivors."/>,[11,12,14],4),
 slide("Synthesis","Representation determines what evolution can discover",<Note label="Core claim">GA does not remove problem formulation. It relocates it into chromosome, fitness, operators, population policy, and stopping rule.</Note>,[13,18,20,21]),
 slide("Exit ticket · reading","Explain the loop without leaning on the metaphor",<div className="ec-exit"><ol><li>Define chromosome, population, fitness, selection, crossover, and mutation.</li><li>Explain why poor encoding can defeat a good search loop.</li><li>Give one condition under which GA is defensible.</li></ol><p>Luger 6e, Ch. 12 · Goldberg (1989)</p></div>,[22]),
];

const gpSlides:SourceLessonSlide[]=[
 slide("Module 6 · Lesson 10","Genetic Programming, Artificial Life, and Swarm Intelligence",<div className="ec-hero"><Tree/><Note label="Driving question">What changes when the candidate solution is itself a program?</Note></div>,[1,2],2,"Evolving executable structures and studying intelligence that emerges from interaction"),
 slide("Definition","Genetic programming extends evolutionary search to programs",<Boxes items={boxes(["Candidate","Program","an executable expression"],["Representation","Parse tree","variable size and shape"],["Search","Evolution","fitness selects programs to vary"])}/>,[2,3]),
 slide("Why trees?","Program structure is hierarchical and dynamically sized",<div className="ec-split"><Tree/><Note label="Koza's representation point">Fixed-length strings are unnatural for program hierarchies whose size and shape change.</Note></div>,[3,4]),
 slide("Read a parse tree","Internal nodes are functions; leaves are terminals",<div className="ec-split"><Tree/><Boxes columns={2} items={boxes(["Function set","{ +, −, ×, ÷ }","operators require child programs"],["Terminal set","{ integers, X, Y }","variables and constants end recursion"])}/></div>,[4]),
 slide("Generational GP","The outer loop resembles GA; representation changes the operators",<Process items={["random programs","fitness","selection","tree variation","new population","termination"]}/>,[5,6],4),
 slide("Demo · recursive generation","Random program generation grows a tree from function and terminal choices",<ProgramBuild/>,[7,8,9,10,11,12,13],5),
 slide("Mutation","Replace a selected subtree with a newly generated program",<div className="ec-split"><Tree/><Process items={["select node","delete subtree","generate","splice"]}/></div>,[14,15,16],4),
 slide("Crossover","Swap selected subtrees between two parent programs",<div className="ec-split"><Tree expression="+ X * 3 Y"/><Tree expression="- / 7 25 X"/></div>,[17,18,19],4),
 slide("Selection matters","Random generation alone lacks cumulative improvement",<Check question="Why can evolved programs beat independently random programs?" options={["Trees are always shorter","Fitness preserves useful partial structure","Random programs cannot execute","Mutation guarantees optimality"]} correct={1} why="Selection creates continuity across generations; useful building blocks survive and recombine."/>,[20]),
 slide("Case study · mouse maze","The domain determines functions and terminals",<div className="ec-split"><Maze/><Boxes columns={2} items={boxes(["Functions","control","if-blocked; while-not-at-cheese"],["Terminals","actions","forward; left; right"])}/></div>,[21,22],4),
 slide("Fitness design","The maze score combines execution cost and remaining distance",<div className="ec-work"><code>fitness = (units spent + distance)²</code><strong>(100 + 10)² = 12,100</strong><p>Lower is better; over 100 units means starvation.</p></div>,[23],4),
 slide("Evolution in the maze","Mutation and crossover can improve behavior without understanding",<Boxes items={boxes(["Parent","12,996","baseline program"],["Mutation","12,996","may be neutral or harmful"],["Crossover","11,664","recombination improves this trial"])}/>,[24,25,26]),
 slide("Result after search","A best evolved program is run evidence, not proof of optimality",<div className="ec-split"><Maze/><Boxes columns={1} items={boxes(["After 4,202 generations","fitness 2,809","Test on new mazes before claiming general navigation."])}/></div>,[27]),
 slide("Desirable properties","Sufficiency, parsimony, and closure shape the search space",<Boxes items={boxes(["Sufficiency","Represent solutions","primitive set is expressive enough"],["Parsimony","Avoid needless structure","constrain bloat and search"],["Closure","Every composition runs","functions handle all possible inputs"])}/>,[28],4),
 slide("Tournament GP","Steady-state replacement updates one population continuously",<Process items={["sample","evaluate","select winner","vary","replace loser","repeat"]}/>,[29],4),
 slide("Symbolic regression","GP can evolve a function that fits examples",<div className="ec-split"><Landscape/><Boxes columns={1} items={boxes(["Learned expression","f(x)=x²/2","Fitness is error across the training table."])}/></div>,[30],4),
 slide("Parallel hill-climbing view","A population explores several regions at once",<Landscape/>,[31]),
 slide("Applications and limits","GP searches executable structure where approximation is useful",<Boxes items={boxes(["Control","spacecraft","near-minimum-time maneuver"],["Models","neural networks","structure search"],["Systems","image/fuzzy/hardware","domain-specific programs"])}/>,[32,33]),
 slide("Artificial Life","ALife studies life-like processes by constructing them",<Boxes items={boxes(["Wet","Biochemistry","material life processes"],["Hard","Robotics","embodied agents"],["Soft","Simulation","digital organisms and ecosystems"])}/>,alife(1)),
 slide("ALife simulators","Different models make different mechanisms observable",<Boxes columns={5} items={boxes(["1990","Polyworld","neural agents"],["1993","Avida","executable DNA"],["2009","EcoSim","fuzzy maps"],["2011","OpenWorm","biological model"],["2014","Neurokernel","neural simulation"])}/>,alife(2)),
 slide("Swarm intelligence","Local rules can produce organized global behavior without central control",<div><Boxes items={boxes(["Agents","Simple + autonomous","sense and act locally"],["Interaction","Local + stochastic","neighbors and environment signal"],["Emergence","Collective behavior","global order is not commanded"])}/><Note label="Embodied demo prompt">Compare the source examples: SpotMini robots hauling a truck, reacting to a banana peel, opening doors, and dancing. Which behaviors require coordination, and which are not evidence of swarm intelligence?</Note></div>,alife(3,4,6),4),
 slide("Particle Swarm Optimization","Each particle combines momentum, personal memory, and social information",<div className="ec-split"><Swarm kind="PSO"/><div className="ec-work"><code>v ← v + c₁r₁(pBest−p) + c₂r₂(gBest−p)</code><code>p ← p + v</code></div></div>,alife(5),4),
 slide("Bees algorithm","Recruitment allocates more effort to promising patches",<div className="ec-split"><Swarm kind="Bees"/><Process items={["scout","evaluate","waggle","recruit","exploit or abandon"]}/></div>,alife(7)),
 slide("Ant Colony Optimization","Positive feedback strengthens useful paths; evaporation preserves exploration",<AntLab/>,alife(8,9,10,11,12,13,14,15,16,17,18,19,20,21,22),5),
 slide("Cumulative comparison","Match representation, feedback, and shared memory",<div className="ec-comparison"><Table/><Check question="Which method uses an evaporating external trail as shared memory?" options={["GA","GP","PSO","ACO"]} correct={3} why="ACO agents follow and reinforce pheromone while old trails evaporate."/></div>,[5,...alife(8,23)],4),
 slide("Exit ticket · reading","Explain emergence without a central brain",<div className="ec-exit"><ol><li>Contrast GA and GP representation.</li><li>Define function set, terminal set, and fitness for one task.</li><li>Explain one swarm as local rule → interaction → global outcome.</li></ol><p>Luger 6e, Ch. 12 · Koza (1992) · Eberhart, Shi &amp; Kennedy (2001)</p></div>,alife(23,24,25,26,27,28)),
];

export function Lesson09Deck(){return <SourceDeckShell meetingLabel="Module 6 · Lesson 9" meetingTitle="Evolutionary Computation and Genetic Algorithms" slides={gaSlides} sourceCollectionLabel="L06_Bio&GA" sourceCollectionPath="l06-bio-ga"/>}
export function Lesson10Deck(){return <SourceDeckShell meetingLabel="Module 6 · Lesson 10" meetingTitle="Genetic Programming, Artificial Life, and Swarm Intelligence" resolveSourceReference={resolveLesson10SourceReference} slides={gpSlides} sourceCollectionLabel="L07_GP + L08_ArtificialLife" sourceCollectionPath="l07-gp-l08-alife"/>}
