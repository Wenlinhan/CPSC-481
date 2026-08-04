"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import "../styles/evolutionary-computation.css";
import { EnlargeableImage } from "./SearchLessonPrimitives";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

const IMAGE_ROOT = "/course-source/l06-bio-ga/generated";
const LESSON_09_VIDEO_URL = "https://csufullerton.instructure.com/files/283899679/download?download_frd=1&verifier=Lt3ZuNRIyp47WwjZRl7kJYjbfHCUz6fKSOC15Coa";

function slide(eyebrow: string, title: string, content: ReactNode, sourceSlides: number[], minutes: number, subtitle?: string): SourceLessonSlide {
  return {
    eyebrow,
    title,
    content,
    sourceSlides,
    minutes,
    subtitle,
    note: `Timing: ${minutes} minutes. Use the visual to explain the mechanism, prompt a prediction, and connect the answer to source pages ${sourceSlides.join(", ")}.`,
  };
}

function GeneratedVisual({ file, alt }: { file: string; alt: string }) {
  return <figure className="l9-generated"><EnlargeableImage alt={alt} src={`${IMAGE_ROOT}/${file}`} /></figure>;
}

function Pill({ children, tone = "indigo" }: { children: ReactNode; tone?: "indigo" | "teal" | "amber" }) {
  return <span className={`l9-pill ${tone}`}>{children}</span>;
}

function BiologyScale() {
  const items = [["atom", "physical"], ["molecule", "chemical"], ["cell", "biological"], ["organism", "physiological"], ["species", "ecological"]];
  return <div className="l9-scale">{items.map(([name, level], index) => <div style={{ "--level": index } as CSSProperties} key={name}><b>{name}</b><span>{level}</span></div>)}</div>;
}

function MoleculeFlow() {
  return <div className="l9-molecules"><div><b>DNA</b><span>stores hereditary instructions</span></div><i>transcription</i><div><b>RNA</b><span>carries a working message</span></div><i>translation</i><div><b>Protein</b><span>performs cellular functions</span></div></div>;
}

function CentralDogma() {
  return <div className="l9-dogma"><div className="l9-code">A T G C C A T G A</div><div className="l9-dogma-arrow"><b>1D sequence</b><span>transcription + translation over time</span></div><svg viewBox="0 0 420 250" role="img" aria-label="Folded three-dimensional protein chain"><path d="M35 165C90 32 165 235 220 90S326 48 385 170"/><circle cx="35" cy="165" r="13"/><circle cx="110" cy="105" r="13"/><circle cx="190" cy="180" r="13"/><circle cx="270" cy="67" r="13"/><circle cx="345" cy="110" r="13"/><circle cx="385" cy="170" r="13"/></svg><b className="l9-protein-label">3D protein structure</b></div>;
}

function DnaCode() {
  const top = "TACTGAA".split("");
  const bottom = "ATGACTT".split("");
  return <div className="l9-dna-code"><div className="strand"><small>5′</small>{top.map((base, i) => <span key={`${base}-${i}`}>{base}</span>)}<small>3′</small></div><div className="bonds">{top.map((_, i) => <i key={i}/>)}</div><div className="strand"><small>3′</small>{bottom.map((base, i) => <span key={`${base}-${i}`}>{base}</span>)}<small>5′</small></div><div className="codons"><b>codon</b><span>3 bases → 1 amino acid</span><b>gene</b><span>coded sequence → protein</span></div></div>;
}

function NaturalSelection() {
  const population = ["●", "◆", "▲", "●", "■", "◆", "▲", "●", "◆", "■", "▲", "●"];
  return <div className="l9-selection"><section><h3>Population at t</h3><div>{population.map((shape, i) => <i className={`v${i % 4}`} key={i}>{shape}</i>)}</div></section><div className="l9-selection-steps"><Pill>inherit</Pill><Pill tone="teal">crossover</Pill><Pill tone="amber">mutate</Pill><b>fitness changes reproductive frequency</b></div><section><h3>Population at t + 1</h3><div>{population.map((shape, i) => <i className={`v${i % 4} ${i < 7 ? "favored" : ""}`} key={i}>{i < 4 ? "◆" : shape}</i>)}</div></section></div>;
}

function Analogy() {
  const rows = [["base pair", "bit"], ["gene", "instruction"], ["translation", "execution order"], ["protein", "function"], ["repair", "debugging"], ["mutation", "maintenance/change"]];
  return <div className="l9-analogy"><div className="l9-analogy-head"><b>Life system</b><span>useful mapping</span><b>Computer system</b></div>{rows.map(([life, computer]) => <div key={life}><span>{life}</span><i>⇄</i><span>{computer}</span></div>)}<p>The analogy suggests design choices; it does not make software alive or DNA executable computer code.</p></div>;
}

function Commitments() {
  const items = [["Population", "keep many hypotheses"], ["Representation", "encode one candidate"], ["Fitness", "score task quality"], ["Variation", "explore nearby/recombined candidates"], ["Selection", "bias reproduction"]];
  return <div className="l9-commitments">{items.map(([name, text], i) => <article key={name}><span>{String(i + 1).padStart(2, "0")}</span><svg viewBox="0 0 100 70" aria-hidden="true"><circle cx="20" cy="35" r="10"/><circle cx="50" cy="20" r="10"/><circle cx="78" cy="40" r="10"/><path d="M29 31L41 24M59 24L70 35"/></svg><h3>{name}</h3><p>{text}</p></article>)}</div>;
}

function EvolutionLoop() {
  const steps = [["1", "Initialize"], ["2", "Evaluate"], ["3", "Select"], ["4", "Vary"], ["5", "Replace"], ["6", "Stop?"]];
  return <div className="l9-loop"><svg viewBox="0 0 700 410" role="img" aria-label="Evolutionary algorithm loop from initialization through replacement and termination"><defs><marker id="l9-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker></defs><path className="cycle" d="M142 210C142 90 245 45 350 45S558 90 558 210 455 365 350 365 142 330 142 210"/>{steps.map(([n, label], i) => { const pts=[[140,210],[225,80],[395,55],[555,175],[485,335],[255,345]][i]; return <g key={label}><circle cx={pts[0]} cy={pts[1]} r="55"/><text x={pts[0]} y={pts[1]-7}>{n}</text><text className="label" x={pts[0]} y={pts[1]+19}>{label}</text></g>})}<path className="exit" d="M540 310L650 360"/><text className="exit-label" x="590" y="327">yes → return solution</text></svg></div>;
}

const pseudoLines = [
  "t ← 0",
  "initialize population P(t)",
  "while termination condition is not met:",
  "  evaluate fitness of every member of P(t)",
  "  select members of P(t) based on fitness",
  "  produce offspring using crossover and mutation",
  "  replace candidates in P(t) with offspring",
  "  t ← t + 1",
  "return the best available solution(s)",
];

function Pseudocode() {
  return <div className="l9-pseudocode"><ol>{pseudoLines.map((line, i) => <li className={i === 2 ? "loop-start" : i > 2 && i < 8 ? "loop-body" : ""} key={line}><code>{line}</code><span>{["generation counter", "candidate set", "repeat policy", "measure", "choose parents", "create variation", "survivor policy", "advance time", "output"][i]}</span></li>)}</ol></div>;
}

function GaContract() {
  const items = [["Encode", "What does a chromosome mean?"], ["Initialize", "How is P(0) created?"], ["Evaluate", "What evidence becomes fitness?"], ["Vary + replace", "Which operators preserve validity?"], ["Stop", "What counts as sufficient?"]];
  return <div className="l9-contract">{items.map(([verb, question], i) => <article key={verb}><b>{i + 1}</b><div><h3>{verb}</h3><p>{question}</p></div>{i < items.length - 1 && <i>→</i>}</article>)}</div>;
}

function FunctionPlot() {
  const points = useMemo(() => Array.from({ length: 241 }, (_, i) => { const x = -1 + (3 * i) / 240; const f = x * Math.sin(10 * Math.PI * x) + 1; return [70 + ((x + 1) / 3) * 680, 330 - (f / 3.05) * 270]; }), []);
  const d = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return <div className="l9-plot"><svg viewBox="0 0 820 390" role="img" aria-label="Plot of f of x equals x sine ten pi x plus one from negative one to two"><path className="axis" d="M70 330H775M70 35V330"/><path className="curve" d={d}/><circle className="optimum" cx="716.1" cy="77.7" r="10"/><path className="guide" d="M716 78V330"/><text x="675" y="54">best ≈ (1.850547, 2.850274)</text><text x="46" y="352">−1</text><text x="290" y="352">0</text><text x="518" y="352">1</text><text x="754" y="352">2</text><text x="18" y="52">f(x)</text><text x="785" y="352">x</text></svg><aside><Pill tone="amber">Goal</Pill><strong>maximize f(x)</strong><code>f(x) = x sin(10πx) + 1</code><span>x ∈ [−1, 2]</span><span>6 digits after the decimal</span></aside></div>;
}

function BitResolution() {
  return <div className="l9-resolution"><div className="l9-numberline"><span>−1</span><i/><b>3,000,001 representable values</b><i/><span>2</span></div><div className="l9-powers"><article><small>21 bits</small><strong>2,097,152</strong><span>not enough</span></article><b>&lt;</b><article className="need"><small>required</small><strong>3,000,001</strong><span>−1.000000 through 2.000000</span></article><b>≤</b><article className="enough"><small>22 bits</small><strong>4,194,304</strong><span>enough codes</span></article></div><p>Three units of range × 1,000,000 intervals per unit, plus the inclusive endpoint.</p></div>;
}

function Bits({ value, highlight = -1 }: { value: string; highlight?: number }) {
  return <div className="l9-bits" aria-label={`${value.length}-bit chromosome ${value}`}>{value.split("").map((bit, i) => <span className={i === highlight ? "hot" : ""} key={i}>{bit}</span>)}</div>;
}

function Decoder() {
  return <div className="l9-decoder"><section><small>chromosome</small><Bits value="1000101110110101000111"/></section><i>base 2 → base 10</i><section><small>integer x′</small><strong>2,288,967</strong></section><i>affine map</i><section><small>decoded x</small><code>−1 + x′ × 3/(2²²−1)</code><strong>0.637197</strong></section><div className="l9-endpoints"><span>00…00 → −1.000000</span><span>11…11 → 2.000000</span></div></div>;
}

const samplePopulation = [
  ["1000101110110101000111", "0.637197", "1.579"],
  ["1111010011100001001100", "1.870882", "2.495"],
  ["0101100100010110100010", "0.043891", "1.043"],
  ["1111001010111011101001", "1.844682", "2.815"],
];

function PopulationTable() {
  return <div className="l9-population"><div className="head"><span>candidate</span><span>22-bit chromosome</span><span>decoded x</span><span>fitness</span></div>{samplePopulation.map((row, i) => <div key={row[0]}><b>s{i + 1}</b><code>{row[0]}</code><span>{row[1]}</span><strong>{row[2]}</strong></div>)}<aside><b>P(0) contains 300 candidates</b><span>Every bit is initialized randomly.</span></aside></div>;
}

function FitnessPipeline() {
  return <div className="l9-fitness"><section><Bits value="1111001010111011101001"/><small>candidate sᵢ</small></section><i>decode</i><section><strong>xᵢ = 1.844682</strong><small>phenotype</small></section><i>evaluate</i><section><strong>fit(sᵢ) = f(xᵢ) = 2.815</strong><small>higher is better</small></section><div className="l9-parent-pool"><b>parent-selection pool</b>{[32, 18, 11, 27, 12].map((value, i) => <span style={{ width: `${value}%` }} key={i}>s{i + 1}</span>)}</div><p>Fitness supplies evidence. A selection rule turns that evidence into reproductive probability; it does not prove correctness.</p></div>;
}

function Operators() {
  const [mode, setMode] = useState<"crossover" | "mutation">("crossover");
  return <div className="l9-operators"><nav><button className={mode === "crossover" ? "active" : ""} onClick={() => setMode("crossover")}>Crossover</button><button className={mode === "mutation" ? "active" : ""} onClick={() => setMode("mutation")}>Mutation</button></nav>{mode === "crossover" ? <div className="l9-cross"><section><small>parent 1</small><Bits value="1100101010" highlight={4}/><small>parent 2</small><Bits value="0011010101" highlight={4}/></section><i>swap suffixes after one chosen cut</i><section><small>child 1</small><Bits value="1100110101" highlight={4}/><small>child 2</small><Bits value="0011001010" highlight={4}/></section></div> : <div className="l9-mutate"><section><small>before</small><Bits value="1100101010" highlight={6}/></section><i>flip one selected bit</i><section><small>after</small><Bits value="1100100010" highlight={6}/></section></div>}<p>{mode === "crossover" ? "Recombination joins material already present in two parents." : "Mutation introduces local novelty; pₘ = 0.01 is applied probabilistically, not once by command."}</p></div>;
}

function GenerationTrace() {
  const stages = [["P(t)", "300 chromosomes"], ["fitness", "decode → f(x)"], ["selection", "choose parents"], ["variation", "pᶜ=.50 · pᵐ=.01"], ["replacement", "build P(t+1)"]];
  return <div className="l9-trace"><div>{stages.map(([name, text], i) => <article key={name}><b>{i + 1}</b><h3>{name}</h3><span>{text}</span>{i < stages.length - 1 && <i>→</i>}</article>)}</div><svg viewBox="0 0 760 190" role="img" aria-label="Illustrative best fitness increasing unevenly over generations"><path className="axis" d="M45 150H730M45 20V150"/><path className="trend" d="M50 142L120 135L180 138L245 115L315 108L380 85L450 92L520 61L590 55L665 37L725 35"/><text x="50" y="178">generation 0</text><text x="630" y="178">up to 1000</text><text x="62" y="33">best fitness</text></svg><p>Improvement is stochastic and may plateau. Stop at a target quality or the generation limit—not because evolution guarantees the global maximum.</p></div>;
}

const cityPoints = [[90,80],[250,45],[430,70],[600,45],[700,150],[620,275],[430,315],[245,285],[85,220]];
function CityMap({ route = [1,9,2,4,6,5,7,8,3] }: { route?: number[] }) {
  const lookup = cityPoints.map((point, i) => [i + 1, point] as const);
  const routePoints = [...route, route[0]].map(city => lookup.find(([n]) => n === city)![1]).map(([x,y]) => `${x},${y}`).join(" ");
  return <svg className="l9-city-map" viewBox="0 0 780 370" role="img" aria-label={`Nine-city route ${route.join(", ")}`}><polyline points={routePoints}/>{lookup.map(([n,[x,y]]) => <g key={n}><circle cx={x} cy={y} r="25"/><text x={x} y={y+8}>{n}</text></g>)}</svg>;
}

function BitCityEncoding() {
  return <div className="l9-tsp-encoding"><CityMap route={[1,2,3,4,5,6,7,8,9]}/><section><h3>Encoding #1: 4 bits per city</h3><code>0001 0010 0011 … 1000 1001</code><div className="l9-invalid"><span>generic crossover can create</span><b>0001 0010 0010 … 1000 1010</b><small>city 2 repeats · city 3 is missing · 1010 is not a city</small></div><p>A bit string is compact, but its ordinary operators do not preserve the TSP constraint.</p></section></div>;
}

function PermutationEncoding() {
  return <div className="l9-tsp-encoding"><CityMap/><section><h3>Encoding #2: a permutation</h3><div className="l9-route-sequence">{[1,9,2,4,6,5,7,8,3].map((city, i) => <span key={i}>{city}</span>)}</div><ul><li>Decode: visit cities in this order, then return to the start.</li><li>Fitness: shorter total tour distance is better.</li><li>Mutation: swap two cities and validity is preserved.</li><li>Crossover: must preserve every city exactly once.</li></ul></section></div>;
}

function OrderCrossover() {
  const [step, setStep] = useState(0);
  const steps = [
    <><b>P1</b><code>1 9 2 | 4 6 5 7 | 8 3</code><b>P2</b><code>4 5 9 | 1 8 7 6 | 2 3</code></>,
    <><b>Copy P1 segment</b><code>_ _ _ | 4 6 5 7 | _ _</code><span>child keeps the selected middle segment</span></>,
    <><b>Read P2 after the second cut</b><code>2 3 4 5 9 1 8 7 6</code><span>wrap to the beginning</span></>,
    <><b>Remove cities already present</b><code>2 3 <s>4 5</s> 9 1 8 <s>7 6</s></code><span>remaining order: 2, 3, 9, 1, 8</span></>,
    <><b>Fill open positions</b><code>2 3 9 | 4 6 5 7 | 1 8</code><span>every city appears exactly once</span></>,
  ];
  return <div className="l9-order"><div className="l9-order-stage">{steps[step]}</div><div className="l9-order-progress">{steps.map((_,i) => <button aria-label={`Show order crossover step ${i + 1}`} className={i === step ? "active" : ""} key={i} onClick={() => setStep(i)}>{i + 1}</button>)}</div><div className="l9-order-controls"><button disabled={step === 0} onClick={() => setStep(step - 1)}>Previous</button><strong>Order crossover · step {step + 1} of 5</strong><button disabled={step === 4} onClick={() => setStep(step + 1)}>Next</button></div></div>;
}

function Practice() {
  const [choice, setChoice] = useState<number | null>(null);
  const options = ["2 3 9 | 4 6 5 7 | 1 8", "2 3 4 | 4 6 5 7 | 1 8", "2 3 9 | 4 6 5 7 | 1 7"];
  return <div className="l9-practice"><section><Pill tone="amber">Pair trace</Pill><h3>Which child is a valid order-crossover result?</h3><code>P1: 1 9 2 | 4 6 5 7 | 8 3</code><p>The middle segment is fixed. Fill the remaining cities using P2’s order after the second cut.</p></section><div>{options.map((option, i) => <button className={choice === i ? (i === 0 ? "correct" : "incorrect") : ""} key={option} onClick={() => setChoice(i)}><b>{String.fromCharCode(65 + i)}</b><code>{option}</code></button>)}{choice !== null && <aside><strong>{choice === 0 ? "Correct." : "Check city membership."}</strong> A valid route contains each of cities 1–9 exactly once.</aside>}</div></div>;
}

function Evaluation() {
  return <div className="l9-evaluation"><section className="strength"><svg viewBox="0 0 160 120"><path d="M20 100L55 70L85 82L140 25"/><circle cx="20" cy="100" r="8"/><circle cx="55" cy="70" r="8"/><circle cx="85" cy="82" r="8"/><circle cx="140" cy="25" r="8"/></svg><h3>Strength</h3><p>Once representation, fitness, and operators fit the problem, population search can be compact and efficient.</p></section><div className="l9-balance"><span>representation</span><b>determines</b><span>reachable candidates</span><b>and</b><span>legal variation</span></div><section className="risk"><svg viewBox="0 0 160 120"><path d="M80 10L150 108H10Z"/><text x="80" y="88">!</text></svg><h3>Limitation</h3><p>Encoding can be hard. A generic operator may create invalid solutions or make useful structure difficult to discover.</p></section></div>;
}

function Studio() {
  return <div className="l9-studio"><div className="l9-studio-center">GA<br/>specification</div>{[["Candidate", "encode + decode"], ["Fitness", "quality + loophole"], ["Population", "size + initialization"], ["Variation", "valid crossover + mutation"], ["Evidence", "stopping + test"]].map(([title,text],i) => <article className={`p${i}`} key={title}><b>{i + 1}</b><h3>{title}</h3><span>{text}</span></article>)}<aside>Peer audit: point to one chromosome that cannot be decoded, one fitness loophole, or one operator that breaks validity.</aside></div>;
}

function Synthesis() {
  return <div className="l9-synthesis"><svg viewBox="0 0 520 390" role="img" aria-label="Triangle connecting representation, fitness, and variation"><path d="M260 45L60 330H460Z"/><circle cx="260" cy="45" r="62"/><circle cx="60" cy="330" r="62"/><circle cx="460" cy="330" r="62"/><text x="260" y="40">representation</text><text x="260" y="62">what exists</text><text x="60" y="325">fitness</text><text x="60" y="347">what wins</text><text x="460" y="325">variation</text><text x="460" y="347">what changes</text></svg><section><Pill>Core claim</Pill><h3>GA does not remove problem formulation.</h3><p>It relocates formulation into the chromosome, decoder, fitness function, population policy, operators, and stopping evidence.</p><ol><li>Explain the GA loop without the biology metaphor.</li><li>Use the optimization or TSP case to show why representation matters.</li><li>Name one situation where a specialized exact method is preferable.</li></ol><small>Reading: Luger, 6e, Ch. 12 · Goldberg (1989)</small></section></div>;
}

export const lesson09Slides: SourceLessonSlide[] = [
  slide("Module 6 · Lesson 9", "Evolutionary Computation and Genetic Algorithms", <div className="l9-hero"><GeneratedVisual file="evolutionary-search.png" alt="Diverse candidate forms distributed across a multi-peaked fitness landscape"/><aside><Pill tone="amber">Driving question</Pill><h2>How can imperfect candidates become a useful solution?</h2><p>Today we make every design choice visible: candidate, encoding, fitness, selection, variation, replacement, and stopping.</p></aside></div>, [1,2], 2, "From biological metaphor to two complete worked optimization cases"),
  slide("Learning journey", "The lecture moves from metaphor to executable specification", <div className="l9-journey">{[["Biology", "stored information + variation"], ["Algorithm", "a population loop"], ["Continuous x", "22-bit encode/decode"], ["TSP", "permutation + order crossover"], ["Audit", "does the design stay valid?"]].map(([a,b],i)=><article key={a}><b>{i+1}</b><svg viewBox="0 0 90 55"><path d="M8 42C25 8 60 48 82 12"/><circle cx={i*14+15} cy={35-i*4} r="6"/></svg><h3>{a}</h3><p>{b}</p></article>)}</div>, [1,2,10,11], 2),
  slide("Biological foundation", "From atom to species, cells connect three crucial molecules", <div className="l9-foundation"><BiologyScale/><MoleculeFlow/></div>, [3,4], 2),
  slide("Central dogma", "A one-dimensional sequence helps produce a three-dimensional protein over time", <div className="l9-split"><GeneratedVisual file="cell-to-dna.png" alt="Zoom sequence from a cell to a chromosome and DNA double helix"/><CentralDogma/></div>, [5,6], 2),
  slide("DNA structure and genetic code", "Complementary strands preserve information; codons make the sequence interpretable", <DnaCode/>, [6,7], 2),
  slide("Evolution by natural selection", "Inheritance preserves; crossover and mutation vary; selection changes frequencies", <NaturalSelection/>, [8], 3),
  slide("Analogy · not identity", "Life and software both store instructions—but the mapping has limits", <Analogy/>, [9], 2),
  slide("From biology to problem solving", "The metaphor creates five computational commitments", <Commitments/>, [10,11], 2),
  slide("Evolutionary computation", "Initialization, evaluation, variation, and replacement form a search loop", <EvolutionLoop/>, [12], 3),
  slide("Genetic algorithm · pseudocode", "The population P(t) is the state that evolves", <Pseudocode/>, [13], 4),
  slide("GA specification contract", "A problem is not ready until five questions have concrete answers", <GaContract/>, [13,14], 3),
  slide("Worked case 1 · objective", "Maximize a rippled function on [−1, 2]", <FunctionPlot/>, [15], 3),
  slide("Worked case 1 · representation", "Six-decimal precision requires at least 22 bits", <BitResolution/>, [15], 3),
  slide("Worked case 1 · decoding", "A chromosome becomes an integer, then a real value in the interval", <Decoder/>, [15], 4),
  slide("Worked case 1 · initialization", "Create P(0) as 300 random 22-bit candidates", <PopulationTable/>, [16], 3),
  slide("Worked case 1 · fitness and selection", "Decode first, evaluate f(x), then bias parent choice", <FitnessPipeline/>, [16], 3),
  slide("Worked case 1 · genetic variation", "Crossover recombines; mutation introduces local novelty", <Operators/>, [17], 4),
  slide("Worked case 1 · one generation", "The complete setup now runs from P(t) to P(t+1)", <GenerationTrace/>, [16,17], 3),
  slide("Worked case 2 · TSP", "A nine-city tour exposes why representation changes the operators", <div className="l9-tsp-hero"><GeneratedVisual file="tsp-nine-city-loop.png" alt="Exactly nine landmarks joined by one closed route"/><aside><Pill tone="amber">Objective</Pill><h3>Visit every city exactly once, return to the start, and minimize total distance.</h3><p>Question: what chromosome makes validity easy to preserve?</p></aside></div>, [18], 2),
  slide("TSP encoding #1", "Four bits per city are compact—but generic crossover breaks the route", <BitCityEncoding/>, [18], 2),
  slide("TSP encoding #2", "A permutation directly represents visit order", <PermutationEncoding/>, [19], 3),
  slide("TSP operator · order crossover", "Copy a segment, then fill with the other parent's unused order", <OrderCrossover/>, [20], 5),
  slide("Guided practice", "Validity is a property students can inspect, not a promise", <Practice/>, [18,19,20], 4),
  slide("Evaluation of GA", "Power comes from representation–operator fit; so does fragility", <Evaluation/>, [21], 3),
  slide("Design studio", "Specify one defensible GA, then trade designs for an adversarial audit", <Studio/>, [13,14,21], 4),
  slide("Synthesis · exit", "Representation determines what evolution can discover", <Synthesis/>, [21,22], 2),
];

export function Lesson09Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return <SourceDeckShell forcePrintAll={forcePrintAll} lectureVideoUrl={LESSON_09_VIDEO_URL} meetingLabel="Module 6 · Lesson 9" meetingTitle="Evolutionary Computation and Genetic Algorithms" slides={lesson09Slides} sourceCollectionLabel="L06_Bio&GA" sourceCollectionPath="l06-bio-ga"/>;
}
