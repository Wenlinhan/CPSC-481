"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import "../styles/module12-learning.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

const MEDIA_ROOT = "/course-source/l10-neural-networks/media";

function SourceMedia({ file, alt, caption }: { file: string; alt: string; caption: string }) {
  return <figure className="m12-source-media"><img alt={alt} src={`${MEDIA_ROOT}/${file}`} /><figcaption>{caption}</figcaption></figure>;
}

function Cards({ children, columns = 3 }: { children: ReactNode; columns?: number }) {
  return <div className="m12-cards" style={{ "--columns": columns } as CSSProperties}>{children}</div>;
}

function Card({ label, title, children, tone = "blue" }: { label: string; title: string; children: ReactNode; tone?: string }) {
  return <article className={`m12-card tone-${tone}`}><span>{label}</span><h3>{title}</h3><div>{children}</div></article>;
}

function Formula({ children }: { children: ReactNode }) {
  return <code className="m12-formula">{children}</code>;
}

function NotationBox({ children }: { children: ReactNode }) {
  return <div className="m12-notation-box"><strong>Notation:</strong> {children}</div>;
}

const categoryMethods = {
  "Decision tree": { representation: "Symbolic", feedback: "Supervised", timing: "Batch", example: "Loan-risk rules learned from labeled applications." },
  "Genetic programming": { representation: "Non-symbolic search", feedback: "Supervised", timing: "Batch", example: "Evolve an expression that predicts a numeric target." },
  Perceptron: { representation: "Non-symbolic weights", feedback: "Supervised", timing: "Online-capable", example: "Update a linear classifier after each labeled mistake." },
  "K-means": { representation: "Non-symbolic geometry", feedback: "Unsupervised", timing: "Usually batch", example: "Group customers around centroids without class labels." },
  "Reinforcement learning": { representation: "Values / policy", feedback: "Reward", timing: "Sequential online", example: "Learn an elevator policy from delayed service rewards." },
} as const;

function CategoryExplorer() {
  const [method, setMethod] = useState<keyof typeof categoryMethods>("Decision tree");
  const item = categoryMethods[method];
  return <div className="m12-category-explorer">
    <nav aria-label="Machine-learning method examples">{Object.keys(categoryMethods).map(name => <button className={method === name ? "active" : ""} key={name} onClick={() => setMethod(name as keyof typeof categoryMethods)} type="button">{name}</button>)}</nav>
    <section>
      <div className="m12-axis"><span>Representation</span><strong>{item.representation}</strong><small>What form changes during learning?</small></div>
      <div className="m12-axis"><span>Feedback</span><strong>{item.feedback}</strong><small>What teaching signal is available?</small></div>
      <div className="m12-axis"><span>Timing</span><strong>{item.timing}</strong><small>When are updates made?</small></div>
      <p>{item.example}</p>
    </section>
  </div>;
}

const gpStages = [
  { label: "Represent", title: "Build expression trees", detail: "Terminal set: x and constants −5…+5. Function set: +, −, ×, ÷.", tree: ["÷", "×", "2", "x", "x"] },
  { label: "Evaluate", title: "Score prediction error", detail: "Run every candidate on the ten labeled input–output pairs; smaller error means greater fitness.", tree: ["fitness", "Σ", "|ŷ−y|", "10 cases"] },
  { label: "Select", title: "Tournament selection", detail: "Sample four candidates and favor the fitter expression as a parent.", tree: ["4 enter", "1 parent", "fitness"] },
  { label: "Vary", title: "Crossover and mutation", detail: "Swap subtrees with 90% probability; mutate with 5% probability while enforcing depth limits.", tree: ["parent A", "parent B", "swap", "offspring"] },
  { label: "Stop", title: "Check the criterion", detail: "Stop by 100 generations or when tolerated error reaches 0.001.", tree: ["error", "≤ .001", "or", "generation 100"] },
];

function GeneticProgramLab() {
  const [stage, setStage] = useState(0);
  const item = gpStages[stage];
  return <div className="m12-gp-lab">
    <nav aria-label="Genetic-programming cycle">{gpStages.map((entry, index) => <button className={stage === index ? "active" : ""} key={entry.label} onClick={() => setStage(index)} type="button"><span>{index + 1}</span>{entry.label}</button>)}</nav>
    <section><span>Stage {stage + 1} of 5</span><h3>{item.title}</h3><p>{item.detail}</p><div className="m12-expression-tree">{item.tree.map((node, index) => <b key={`${node}-${index}`}>{node}</b>)}</div></section>
  </div>;
}

const gpRows = Array.from({ length: 10 }, (_, index) => {
  const x = index / 10;
  return { id: index + 1, x, y: x * x / 2 };
});

function GeneticDataset() {
  const [row, setRow] = useState(6);
  return <div className="m12-dataset-demo">
    <table><caption>Training pairs for the nonlinear regression example</caption><thead><tr><th>record</th><th>input x</th><th>target y</th></tr></thead><tbody>{gpRows.map((item, index) => <tr className={row === index ? "active" : ""} key={item.id} onClick={() => setRow(index)}><td>{item.id}</td><td>{item.x.toFixed(3)}</td><td>{item.y.toFixed(3)}</td></tr>)}</tbody></table>
    <section><span>Selected case</span><Formula>x = {gpRows[row].x.toFixed(3)} → y = {gpRows[row].y.toFixed(3)}</Formula><p>The target pattern is y = x²/2. GP is not given that expression; it must evolve a tree whose predictions fit these labels.</p></section>
  </div>;
}

const toolSteps = [
  { label: "1 · data", code: "X = np.arange(0, 1, .1).reshape(-1, 1)\ny = (X[:, 0] ** 2) / 2", explanation: "Create the exact ten training inputs and numeric targets." },
  { label: "2 · model", code: "SymbolicRegressor(\n  population_size=600,\n  generations=100,\n  tournament_size=4\n)", explanation: "Configure the source population, generation limit, and tournament size." },
  { label: "3 · fit", code: "est.fit(X, y)\nprint(est._program)", explanation: "The estimator follows the scikit-learn fit/predict interface while evolving expressions internally." },
  { label: "4 · test", code: "pred = est.predict(X_new)\nerror = mean_absolute_error(y_new, pred)", explanation: "Evaluate on unseen data; training fitness alone is not evidence of generalization." },
];

const gplearnTrace = [0.32066597, 0.32020176, 0.23953666, 0.23567635, 0.10394641, 0.06080204, 0.000781474];
const surfaceModes = ["Ground truth", "Evolved GP", "Decision tree", "Random forest"] as const;

function GplearnProjectPreview() {
  const [generation, setGeneration] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<(typeof surfaceModes)[number]>("Evolved GP");
  useEffect(() => {
    if (!running) return;
    if (generation >= gplearnTrace.length - 1) { setRunning(false); return; }
    const timer = window.setTimeout(() => setGeneration(value => value + 1), 520);
    return () => window.clearTimeout(timer);
  }, [generation, running]);
  const progress = generation / (gplearnTrace.length - 1);
  const curves = useMemo(() => Array.from({ length: 7 }, (_, row) => Array.from({ length: 11 }, (_, column) => {
    const x0 = -1 + column / 5;
    const x1 = -1 + row / 3;
    const truth = x0 * x0 - x1 * x1 + x1 - 1;
    const early = 0.45 * x0 - 0.25 * x1 - 0.3;
    let value = mode === "Ground truth" ? truth : early * (1 - progress) + truth * progress;
    if (mode === "Decision tree") value = Math.round(truth * 2) / 2;
    if (mode === "Random forest") value = Math.round(truth * 5) / 5;
    return `${50 + column * 30 + row * 11},${205 - row * 17 - value * 30}`;
  }).join(" ")), [mode, progress]);
  const fitness = gplearnTrace[generation];
  return <section className="m12-gplearn-preview">
    <header><div><span>Dynamic project preview</span><strong>Symbolic regression evolves a surface</strong></div><button onClick={() => { setGeneration(0); setMode("Evolved GP"); setRunning(true); }} type="button">{running ? "Evolving…" : "Run evolution"}</button></header>
    <nav aria-label="Compare regression surfaces">{surfaceModes.map(value => <button className={mode === value ? "active" : ""} key={value} onClick={() => setMode(value)} type="button">{value}</button>)}</nav>
    <div className="m12-gplearn-surface"><svg aria-label={`${mode} response surface at generation ${generation}`} role="img" viewBox="0 0 430 245"><path className="base" d="M42 211 L343 211 L410 110 L109 110 Z" />{curves.map((points, index) => <polyline className="mesh-row" key={index} points={points} />)}<text x="340" y="232">X₀</text><text x="395" y="103">X₁</text><text x="25" y="55">y</text></svg><aside><span>Generation</span><strong>{generation}</strong><span>Best fitness (error)</span><strong>{fitness.toFixed(fitness < .01 ? 6 : 3)}</strong><div className="m12-fitness-meter"><i style={{ width: `${Math.max(4, (1 - fitness / gplearnTrace[0]) * 100)}%` }} /></div><small>{fitness < .01 ? "✓ stopping criterion reached" : "Searching for a lower-error expression"}</small></aside></div>
    <footer><p><b>Target:</b> y = X₀² − X₁² + X₁ − 1</p><p><b>Evolved:</b> y ≈ X₀² − X₁² + X₁ − .999</p></footer>
  </section>;
}

function SciKitWorkflow() {
  const [step, setStep] = useState(0);
  const item = toolSteps[step];
  return <div className="m12-gplearn-page"><GplearnProjectPreview /><div className="m12-code-lab compact"><nav aria-label="Scikit-compatible genetic-programming workflow">{toolSteps.map((entry, index) => <button className={step === index ? "active" : ""} key={entry.label} onClick={() => setStep(index)} type="button">{entry.label}</button>)}</nav><section><span>Course-source workflow</span><pre><code>{item.code}</code></pre><p>{item.explanation}</p><p className="m12-gplearn-resource"><a href="https://gplearn.readthedocs.io/en/stable/examples.html#symbolic-regressor" rel="noreferrer" target="_blank">Open the gplearn Symbolic Regressor project ↗</a></p><small><b>Precision:</b> gplearn follows the scikit-learn fit/predict interface; genetic programming is not a core scikit-learn estimator.</small></section></div></div>;
}

function NeuronLab() {
  const [x1, setX1] = useState(0.8);
  const [x2, setX2] = useState(0.4);
  const [w1, setW1] = useState(0.7);
  const [w2, setW2] = useState(-0.3);
  const [bias, setBias] = useState(-0.2);
  const net = x1 * w1 + x2 * w2 + bias;
  const output = net >= 0 ? 1 : 0;
  const controls = [["x₁", x1, setX1], ["x₂", x2, setX2], ["w₁", w1, setW1], ["w₂", w2, setW2], ["bias", bias, setBias]] as const;
  return <div className="m12-neuron-lab"><section>{controls.map(([label, value, setter]) => <label key={label}><span>{label}</span><input aria-label={label} max="1" min="-1" onChange={event => setter(Number(event.target.value))} step="0.1" type="range" value={value} /><strong>{value.toFixed(1)}</strong></label>)}</section><div className="m12-neuron-diagram"><div><b>{x1.toFixed(1)}</b><b>{x2.toFixed(1)}</b><b>1</b></div><i>Σ</i><article><span>net</span><strong>{net.toFixed(2)}</strong><small>{x1.toFixed(1)}({w1.toFixed(1)}) + {x2.toFixed(1)}({w2.toFixed(1)}) + {bias.toFixed(1)}</small></article><em>f(net)</em><output className={output ? "on" : ""}>{output}</output></div></div>;
}

function LogicGateLab() {
  const [gate, setGate] = useState<"AND" | "OR">("AND");
  const [x, setX] = useState(1);
  const [y, setY] = useState(0);
  const bias = gate === "AND" ? -2 : -1;
  const net = x + y + bias;
  const out = net >= 0 ? 1 : 0;
  return <div className="m12-logic-lab"><nav>{(["AND", "OR"] as const).map(value => <button className={gate === value ? "active" : ""} key={value} onClick={() => setGate(value)} type="button">{value}</button>)}</nav><section><button onClick={() => setX(1 - x)} type="button">x = {x}</button><button onClick={() => setY(1 - y)} type="button">y = {y}</button><Formula>net = 1x + 1y {bias < 0 ? "−" : "+"} {Math.abs(bias)} = {net}</Formula><output className={out ? "on" : ""}>{gate} → {out}</output></section><p>Weights stay at 1. Changing the bias changes which input combinations cross the fixed threshold.</p></div>;
}

const perceptronRows = [
  [1.0, 1.0, 1], [9.4, 6.4, -1], [2.5, 2.1, 1], [8.0, 7.7, -1], [0.5, 2.2, 1],
  [7.9, 8.4, -1], [7.0, 7.0, -1], [2.8, 0.8, 1], [1.2, 3.0, 1], [7.8, 6.1, -1],
] as const;

function PerceptronDatasetTable() {
  const [selected, setSelected] = useState(0);
  const row = perceptronRows[selected];
  return <div className="m12-perceptron-table"><table className="m12-data-table"><caption>Labeled binary training examples</caption><thead><tr><th>Case</th><th>x₁</th><th>x₂</th><th>Target t</th></tr></thead><tbody>{perceptronRows.map((item, index) => <tr className={selected === index ? "active" : ""} key={index} onClick={() => setSelected(index)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(index); } }} tabIndex={0}><td>{index + 1}</td><td>{item[0].toFixed(1)}</td><td>{item[1].toFixed(1)}</td><td className={item[2] === 1 ? "positive-text" : "negative-text"}>{item[2] > 0 ? "+1" : "−1"}</td></tr>)}</tbody></table><section className="m12-selected-record"><span>Selected case {selected + 1}</span><h3>Each input stays with its label</h3><Formula>x = [{row[0].toFixed(1)}, {row[1].toFixed(1)}, 1]</Formula><Formula>target t = {row[2] > 0 ? "+1" : "−1"}</Formula><p>The target is supplied during supervised training. At prediction time, the model receives x₁ and x₂ but must infer the class.</p></section></div>;
}

const perceptronSteps = [
  { row: 0, weights: [0.75, 0.5, -0.6], net: 0.65, output: 1, delta: [0, 0, 0], next: [0.75, 0.5, -0.6] },
  { row: 1, weights: [0.75, 0.5, -0.6], net: 9.65, output: 1, delta: [-3.76, -2.56, -0.4], next: [-3.01, -2.06, -1] },
  { row: 2, weights: [-3.01, -2.06, -1], net: -12.85, output: -1, delta: [1, 0.84, 0.4], next: [-2.01, -1.22, -0.6] },
] as const;

function PerceptronTrace() {
  const [step, setStep] = useState(0);
  const item = perceptronSteps[step];
  const row = perceptronRows[item.row];
  return <div className="m12-perceptron-trace"><nav>{perceptronSteps.map((_, index) => <button className={step === index ? "active" : ""} key={index} onClick={() => setStep(index)} type="button">Example {index + 1}</button>)}</nav><section><div><span>Input and target</span><Formula>x = [{row[0]}, {row[1]}, 1], t = {row[2]}</Formula></div><div><span>Current weights</span><Formula>W = [{item.weights.join(", ")}]</Formula></div><ol><li><b>1</b><span>Score net = {item.net.toFixed(2)}</span></li><li><b>2</b><span>Predict a = {item.output}</span></li><li><b>3</b><span>ΔW = [{item.delta.join(", ")}]</span></li><li><b>4</b><span>W′ = [{item.next.join(", ")}]</span></li></ol><p>{row[2] === item.output ? "Correct: no update." : "Mistake: move the boundary toward the desired classification."}</p></section></div>;
}

function BoundaryExplorer() {
  const [position, setPosition] = useState(0);
  const lines = [
    { name: "Before learning", equation: "−x₁ − x₂ + 4 = 0", x1: 20, y1: 190, x2: 130, y2: 50 },
    { name: "Converged", equation: "−1.3x₁ − 1.1x₂ + 10.9 = 0", x1: 38, y1: 35, x2: 300, y2: 235 },
    { name: "Too high", equation: "−x₁ − x₂ + 15 = 0", x1: 170, y1: 25, x2: 330, y2: 160 },
  ];
  const line = lines[position];
  return <div className="m12-boundary"><nav>{lines.map((item, index) => <button className={position === index ? "active" : ""} key={item.name} onClick={() => setPosition(index)} type="button">{item.name}</button>)}</nav><section><svg aria-label="Perceptron training points and linear boundary" viewBox="0 0 360 260"><line className="axis" x1="25" x2="340" y1="235" y2="235" /><line className="axis" x1="25" x2="25" y1="20" y2="235" /><line className="boundary-line" x1={line.x1} x2={line.x2} y1={line.y1} y2={line.y2} />{perceptronRows.map((row, index) => <circle className={row[2] === 1 ? "positive" : "negative"} cx={35 + row[0] * 28} cy={225 - row[1] * 20} key={index} r="7" />)}</svg><div><span>Selected boundary</span><Formula>{line.equation}</Formula><p>The sign of wᵀx + b chooses the class. Learning changes the geometry by changing W.</p></div></section></div>;
}

function XorLab() {
  const [answer, setAnswer] = useState<"vertical" | "diagonal" | "none">("vertical");
  const explanations = { vertical: "Each side still contains one 0 and one 1.", diagonal: "One diagonal cannot place both opposite positive corners together.", none: "Correct: XOR is not linearly separable, so one perceptron cannot represent it." };
  return <div className="m12-xor"><nav>{(["vertical", "diagonal", "none"] as const).map(value => <button className={answer === value ? "active" : ""} key={value} onClick={() => setAnswer(value)} type="button">{value === "none" ? "No single line" : `${value} line`}</button>)}</nav><section><div className="xor-plot"><b className="p00">0</b><b className="p01">1</b><b className="p10">1</b><b className="p11">0</b>{answer !== "none" && <i className={answer} />}</div><article className={answer === "none" ? "correct" : ""}><span>Boundary claim</span><p>{explanations[answer]}</p></article></section></div>;
}

const activations = {
  Step: { formula: "f(z)=1 if z≥0, else 0", description: "Discrete and useful for threshold logic, but it has no usable derivative at the jump.", fn: (z: number) => z >= 0 ? 1 : 0 },
  Sigmoid: { formula: "σ(z)=1/(1+e⁻ᶻ)", description: "Smooth, differentiable, and bounded between 0 and 1.", fn: (z: number) => 1 / (1 + Math.exp(-z)) },
  ReLU: { formula: "ReLU(z)=max(0,z)", description: "A modern hidden-layer choice with a simple positive-side derivative.", fn: (z: number) => Math.max(0, z) / 4 },
} as const;

function ActivationLab() {
  const [name, setName] = useState<keyof typeof activations>("Sigmoid");
  const item = activations[name];
  const d = useMemo(() => Array.from({ length: 81 }, (_, i) => { const z = -4 + i / 10; const y = Math.max(0, Math.min(1, item.fn(z))); return `${i ? "L" : "M"}${30 + i * 4},${205 - y * 155}`; }).join(" "), [item]);
  return <div className="m12-activation"><nav>{Object.keys(activations).map(value => <button className={name === value ? "active" : ""} key={value} onClick={() => setName(value as keyof typeof activations)} type="button">{value}</button>)}</nav><section><svg aria-label={`${name} activation curve`} viewBox="0 0 380 230"><line x1="30" x2="350" y1="205" y2="205" /><line x1="190" x2="190" y1="25" y2="215" /><path d={d} /></svg><article><span>Activation</span><h3>{name}</h3><Formula>{item.formula}</Formula><p>{item.description}</p></article></section></div>;
}

function MethodCheck() {
  const questions = [
    { prompt: "Labels + expression-tree evolution + all data available", answer: "Genetic programming · non-symbolic, supervised, batch" },
    { prompt: "No labels + discover customer groups", answer: "K-means · non-symbolic, unsupervised, usually batch" },
    { prompt: "Labeled stream + update after each mistake", answer: "Perceptron · non-symbolic, supervised, online-capable" },
  ];
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  return <div className="m12-method-check"><nav>{questions.map((_, index) => <button className={active === index ? "active" : ""} key={index} onClick={() => { setActive(index); setRevealed(false); }} type="button">Case {index + 1}</button>)}</nav><section><span>Classify on three axes</span><h3>{questions[active].prompt}</h3><button onClick={() => setRevealed(value => !value)} type="button">{revealed ? "Hide reasoning" : "Reveal reasoning"}</button>{revealed && <p>{questions[active].answer}</p>}</section></div>;
}

const lesson17Slides: SourceLessonSlide[] = [
  { eyebrow: "Module 12 · Machine Learning Part B", title: "One learning method can belong to several categories", subtitle: "Ask what changes, what feedback is available, and when updates happen.", content: <div className="m12-cover"><section><span>Lesson 17 · 75 minutes</span><h3>How does a learner change from examples?</h3><p>We will compare symbolic and adaptive methods, evolve a function, build a neuron, and train a perceptron.</p></section><div className="m12-cover-orbit"><b>LEARN</b><span>symbolic</span><span>adaptive</span><span>labels</span><span>stream</span><span>fitness</span><span>weights</span></div></div>, note: "Ask students to name two different meanings of 'type of machine learning.'", sourceSlides: [] },
  { eyebrow: "Source-complete roadmap", title: "Four steps from learning categories to a trained perceptron", content: <Cards columns={4}><Card label="01" title="Categorize">Symbolic/non-symbolic, supervised/unsupervised, batch/online.</Card><Card label="02" title="Evolve" tone="purple">Use genetic programming to search expression trees.</Card><Card label="03" title="Compute" tone="green">Trace weighted sums and McCulloch–Pitts gates.</Card><Card label="04" title="Learn" tone="amber">Update perceptron weights and test capacity.</Card></Cards>, note: "Preview the four knowledge points and their evidence.", sourceSlides: [] },
  { eyebrow: "Knowledge point 1 · Category axes", title: "Classify a learner on three separate axes", content: <CategoryExplorer />, note: "Switch among all five methods. Require a justification for each axis.", sourceSlides: [] },
  { eyebrow: "Representation axis", title: "Symbolic methods edit structures; adaptive methods change numeric parameters", content: <Cards columns={2}><Card label="Symbolic" title="Generalize structures"><ul><li>Decision-tree tests and branches</li><li>Winston-style concept descriptions</li><li>Human-readable rules and cutoffs</li></ul></Card><Card label="Non-symbolic" title="Optimize adaptive representations" tone="purple"><ul><li>Evolutionary fitness search</li><li>Weights adjusted from error</li><li>Geometry or gradients rather than explicit rule editing</li></ul></Card></Cards>, note: "Use the $15,000/$15,001 cutoff to discuss brittleness without implying all symbolic learning is non-adaptive.", sourceSlides: [] },
  { eyebrow: "Worked contrast", title: "The same labels can train a rule tree or a weighted boundary", content: <div className="m12-contrast"><article><span>Decision tree</span><Formula>if income = low → risk = high</Formula><p>A named test produces a branch and an explicit rule.</p></article><i>same labels</i><article><span>Perceptron</span><Formula>sign(wᵀx + b)</Formula><NotationBox>w is the weight vector; x is the feature vector; wᵀx is their weighted sum; b is bias; sign returns the class from the score.</NotationBox><p>Numeric parameters place a boundary in feature space.</p></article></div>, note: "Ask which representation is easier to explain and which changes smoothly near a cutoff.", sourceSlides: [] },
  { eyebrow: "Knowledge point 2 · Genetic learning", title: "Genetic programming evolves expression trees that fit examples", content: <GeneticProgramLab />, note: "Walk through representation, fitness, tournament selection, 90% crossover, 5% mutation, and stopping.", sourceSlides: [] },
  { eyebrow: "Exact regression example", title: "Ten input–target pairs tell us how to score each program", content: <GeneticDataset />, note: "Select several rows and ask students to infer the hidden pattern before revealing y=x²/2.", sourceSlides: [] },
  { eyebrow: "Tool demonstration · scikit-compatible", title: "A symbolic regressor still follows fit, then predict", content: <SciKitWorkflow />, note: "Clarify that gplearn follows the scikit-learn estimator interface but is a separate package.", sourceSlides: [] },
  { eyebrow: "Knowledge point 3 · Artificial neuron", title: "A neuron adds weighted inputs, bias, and an activation rule", content: <div className="m12-media-explain"><SourceMedia alt="Artificial-neuron weighted-input schematic" caption="Each connection contributes xᵢwᵢ before activation." file="image1.png" /><section><Formula>net = Σᵢ wᵢxᵢ + b</Formula><NotationBox>xᵢ is input i; wᵢ is its weight; Σ means add every weighted input; b is bias; net is the score sent to the activation.</NotationBox><ol><li>Inputs encode measured evidence.</li><li>Weights encode influence and direction.</li><li>Bias moves the decision point.</li><li>Activation converts the score to an output.</li></ol></section></div>, note: "Treat this as an engineered mathematical model, not a faithful simulation of biological thought.", sourceSlides: [] },
  { eyebrow: "Interactive neuron", title: "Changing a weight or bias can move the score across the threshold", content: <NeuronLab />, note: "Have students predict the output before moving the weight or bias.", sourceSlides: [] },
  { eyebrow: "McCulloch–Pitts · 1943", title: "Fixed weights and different biases produce AND or OR", content: <div className="m12-media-explain"><SourceMedia alt="McCulloch-Pitts AND and OR weighted units" caption="AND uses bias −2; OR uses bias −1 when both input weights are 1." file="image3.png" /><section><Formula>f(net) = 1 when net ≥ 0; otherwise 0</Formula><NotationBox>f is the activation function; net is the weighted score; ≥ means greater than or equal to; output is 1 when the threshold is reached.</NotationBox><p>The activation rule stays fixed. The bias changes which truth-table rows reach net ≥ 0.</p></section></div>, note: "Connect the constant input 1 to the bias term.", sourceSlides: [] },
  { eyebrow: "McCulloch–Pitts demo", title: "Run all four input pairs through one gate", content: <LogicGateLab />, note: "Toggle all four combinations for both gates and state the invariant weights.", sourceSlides: [] },
  { eyebrow: "From logic to learning", title: "A perceptron learns its weights from labeled examples", content: <Cards columns={3}><Card label="Given" title="Feature vectors">Measurements such as size, price, or pixel values.</Card><Card label="Given" title="Desired class" tone="green">A target t for each training case.</Card><Card label="Learn" title="Weight vector" tone="purple">Parameters W that make predictions match labels.</Card></Cards>, note: "Contrast manually designed AND/OR weights with learned perceptron weights.", sourceSlides: [] },
  { eyebrow: "Supervised evidence", title: "The target column turns points into labeled training examples", content: <PerceptronDatasetTable />, note: "Select different rows, then ask what disappears at prediction time: the target label.", sourceSlides: [] },
  { eyebrow: "Knowledge point 4 · Perceptron", title: "Predict first, then change weights only when the answer is wrong", content: <div className="m12-procedure"><article><b>1</b><span>Score</span><Formula>net = Σwᵢxᵢ</Formula></article><article><b>2</b><span>Activate</span><Formula>a = 1 if net ≥ θ; else −1</Formula></article><article><b>3</b><span>Compare</span><Formula>error = t − a</Formula></article><article><b>4</b><span>Update</span><Formula>Δwᵢ = η(t−a)xᵢ</Formula></article><NotationBox>t is the target; a is the prediction; η is the learning rate; θ is the threshold; Δwᵢ is the change to weight i.</NotationBox></div>, note: "Define η, t, a, xᵢ, and θ. Correct predictions produce a zero update.", sourceSlides: [] },
  { eyebrow: "Training procedure", title: "One epoch visits every example once; training may need many epochs", content: <div className="m12-loop"><b>initialize W</b><i>→</i><b>predict one case</b><i>→</i><b>update on error</b><i>→</i><b>next case</b><i>↺</i><p>Continue across epochs until outputs remain correct for repeated passes—or stop at a declared training limit.</p></div>, note: "Distinguish one update, one epoch, and convergence.", sourceSlides: [] },
  { eyebrow: "Numeric setup", title: "The source example begins with W=[0.75, 0.50, −0.60] and η=0.2", content: <Cards columns={3}><Card label="Example 1" title="[1.0, 1.0, 1]">Target +1; the initial prediction is correct.</Card><Card label="Example 2" title="[9.4, 6.4, 1]" tone="amber">Target −1; the positive prediction requires a negative update.</Card><Card label="Example 3" title="[2.5, 2.1, 1]" tone="purple">Target +1; the new negative prediction requires a positive update.</Card></Cards>, note: "Students predict which examples will change the weights.", sourceSlides: [] },
  { eyebrow: "Worked perceptron update", title: "Calculate the score, prediction, error, and new weights", content: <PerceptronTrace />, note: "Calculate all three updates. Expect students to justify the sign of ΔW.", sourceSlides: [] },
  { eyebrow: "Geometric interpretation", title: "The learned weights define a line between the two classes", content: <div className="m12-media-explain"><SourceMedia alt="Two labeled point groups separated by a linear perceptron boundary" caption="The learned line separates +1 from −1 training examples." file="image13.png" /><section><Formula>−1.3x₁ − 1.1x₂ + 10.9 = 0</Formula><NotationBox>x₁ and x₂ are two features; −1.3 and −1.1 control the line’s angle; 10.9 is the bias that moves the line; ≈ means approximately.</NotationBox><p>After repeated passes, the source example reports W≈[−1.3, −1.1, 10.9]. New points are classified by the sign of the score.</p></section></div>, note: "Relate the coefficient vector to the line orientation and the bias to its position.", sourceSlides: [] },
  { eyebrow: "Boundary explorer", title: "Move the line and inspect which geometry the weights encode", content: <BoundaryExplorer />, note: "Compare the initial, converged, and overly high boundaries.", sourceSlides: [] },
  { eyebrow: "Representation limit", title: "One perceptron can draw only one straight decision boundary", content: <Cards columns={2}><Card label="Can represent" title="Linearly separable">AND, OR, and the ten-point binary example.</Card><Card label="Cannot represent" title="XOR with one unit" tone="amber">Positive corners are opposite; no single line separates them.</Card></Cards>, note: "Ask whether more training data or more epochs can fix a representation that cannot express the target.", sourceSlides: [] },
  { eyebrow: "XOR equations", title: "XOR requires contradictory thresholds for a single perceptron", content: <div className="m12-media-explain"><SourceMedia alt="XOR points on opposite corners of a square" caption="XOR assigns the same class to opposite corners." file="image15.png" /><section><Formula>w₁+w₂ &lt; θ</Formula><Formula>w₁ &gt; θ</Formula><Formula>w₂ &gt; θ</Formula><Formula>0 &lt; θ</Formula><NotationBox>w₁ and w₂ are input weights; θ is the activation threshold; &lt; means below the threshold and &gt; means above it.</NotationBox><p>The requirements contradict one another.</p></section></div>, note: "Combine w₁>θ and w₂>θ to show why w₁+w₂<θ cannot hold for positive θ.", sourceSlides: [] },
  { eyebrow: "Guided practice · XOR", title: "Try a line, then explain why it fails", content: <XorLab />, note: "Require a geometric explanation, not only the phrase 'nonlinear.'", sourceSlides: [] },
  { eyebrow: "Smooth activation", title: "Sigmoid changes a hard step into a smooth S-shaped curve", content: <div className="m12-media-explain"><SourceMedia alt="Hard threshold and sigmoid activation curves" caption="Increasing λ makes the sigmoid approach a hard threshold." file="image16.png" /><section><Formula>σ(net)=1/(1+e^(−λnet))</Formula><NotationBox>σ is sigmoid output; e is the exponential constant; λ controls steepness; net is the neuron score; the output stays between 0 and 1.</NotationBox><ul><li>continuous output in (0,1)</li><li>differentiable at every point</li><li>largest slope in its transition region</li></ul></section></div>, note: "Connect differentiability to later weight updates in multilayer networks.", sourceSlides: [] },
  { eyebrow: "Activation comparison", title: "Activation choice changes range, smoothness, and gradient flow", content: <ActivationLab />, note: "Compare step, sigmoid, and ReLU; identify which statement comes from the source and which is a modern supplement.", sourceSlides: [] },
  { eyebrow: "Formative synthesis", title: "Describe the learner before choosing an algorithm", content: <MethodCheck />, note: "Students answer each case on representation, feedback, and timing axes.", sourceSlides: [] },
  { eyebrow: "Exit ticket", title: "Explain what changed and what one perceptron cannot represent", content: <div className="m12-exit"><section><span>Submit three sentences</span><ol><li>Classify perceptron learning on all three axes.</li><li>Explain one numeric weight update.</li><li>Explain why XOR needs a richer representation.</li></ol></section><Card label="Bridge to Lesson 18" title="From one boundary to many layers" tone="purple">Hidden units compose multiple learned boundaries; backpropagation assigns credit through the composition.</Card></div>, note: "Collect the three-sentence response and preview multilayer learning.", sourceSlides: [] },
];

const backpropSteps = [
  { title: "Initialize", detail: "Choose small starting weights and biases. Different starts can reach different local minima." },
  { title: "Forward", detail: "Compute net inputs and activations layer by layer from inputs to outputs." },
  { title: "Measure", detail: "Compare output activations with desired targets to obtain error or loss." },
  { title: "Backward", detail: "Use local derivatives and downstream weights to propagate error signals toward earlier layers." },
  { title: "Update", detail: "Change every weight and bias in the direction that reduces the selected error measure." },
];

const lesson17InstructorNotes = [
  `The phrase “type of machine learning” can answer several different questions. One question is what kind of representation changes: explicit rules, expression trees, or numeric weights. Another is what teaching signal is available: class labels, similarity, or reward. A third is when updates occur: in a fixed batch or as data arrive. These axes are independent, so one method can occupy several categories at once.

Today we will move from that taxonomy to three concrete learners. Genetic programming searches over expression trees. An artificial neuron turns weighted evidence into an output. A perceptron changes its weights after labeled mistakes. Keep asking the same four questions: what is represented, what feedback is supplied, when does updating happen, and what can the representation express?`,
  `The roadmap has four connected stages. First, categorize methods on the representation, feedback, and timing axes. Second, evolve a mathematical expression using genetic programming. Third, compute the output of an artificial neuron by adding weighted inputs, bias, and an activation. Fourth, train a perceptron and test the limits of one linear boundary.

Each stage produces different evidence. For categorization, justify every axis rather than naming one label. For genetic programming, trace representation, fitness, selection, crossover, and mutation. For the neuron, calculate the score before activation. For the perceptron, show a numeric weight update and interpret the resulting line. The final XOR example will demonstrate that training cannot recover a concept the representation is unable to express.`,
  `Use the explorer to compare five methods. A decision tree changes symbolic tests and branches, learns from labels, and is often trained in a batch. Genetic programming searches expression structures using a fitness score computed from labeled targets. A perceptron changes numeric weights from labeled mistakes and can update one case at a time. K-means changes centroids without class labels. Reinforcement learning changes values or a policy using reward over time.

Do not force a method into one exclusive box. For every selection, answer three separate questions: What form changes? What feedback guides the change? When is the update performed? The answer “supervised” describes feedback, not representation or timing. This three-axis habit prevents category terms from being mixed together.`,
  `Symbolic methods change explicit structures that people can often inspect directly. Examples include decision-tree branches, Winston-style concept relations, and readable cutoffs. Adaptive or non-symbolic methods change numeric parameters, geometry, or populations of candidate programs. A perceptron learns weights; genetic programming uses fitness to search expression trees.

This contrast is useful but not absolute. A symbolic learner can still adapt, and a numeric model can sometimes be explained. Consider a rule that changes sharply between income 15,000 and 15,001. The explicit cutoff is easy to state but may be brittle. A weighted boundary changes continuously with the features. The important question is not which category is always better, but which representation fits the task, data, and explanation needs.`,
  `The same loan labels can train two different representations. The decision-tree rule names a condition and an outcome: if income is low, predict high risk. The perceptron instead computes the sign of w transpose x plus b. Here x is the applicant's feature vector, w contains learned weights, their dot product is a weighted sum, and b shifts the boundary.

The tree exposes a path of named tests. The perceptron describes a geometric boundary. Ask which is easier to explain to a person and which responds more smoothly near a cutoff. Neither representation is automatically fair or accurate. The labels are the same, but the hypothesis space—the set of patterns each learner can express—is different.`,
  `Genetic programming represents each candidate solution as an expression tree. The terminal set contains x and constants, while the function set contains arithmetic operations. Every tree is run on the ten labeled cases. Fitness measures prediction error, so lower error means a better candidate.

Tournament selection samples four programs and favors a fitter one as a parent. Crossover swaps subtrees, here with probability ninety percent. Mutation makes a smaller random change, here with probability five percent. Depth limits prevent uncontrolled growth. The cycle stops after one hundred generations or when error reaches the tolerance 0.001. Evolution does not know the desired formula directly; it searches using only representation, variation, selection, and fitness.`,
  `The dataset contains ten input–target pairs. Input x runs from zero through 0.9, and target y follows x squared divided by two. The learner is given the numeric pairs, not the hidden expression. Select several rows and compute whether the target is plausible. For x equal to 0.6, squaring gives 0.36 and dividing by two gives 0.18.

In symbolic regression, fitness is based on how closely an expression tree predicts these targets. A candidate can match some rows and fail others, so evaluation aggregates error across the dataset. Ten points do not uniquely prove one underlying law; several expressions may fit. Simplicity and performance on new inputs help distinguish useful patterns from memorization.`,
  `This workflow looks familiar because gplearn follows the scikit-learn estimator interface. First create X and y. X contains the input feature values and y contains numeric targets. Next configure a SymbolicRegressor with population size, generation limit, and tournament size. Then call fit, inspect the evolved program, and use predict on new cases.

The familiar interface does not mean gplearn is part of scikit-learn itself; it is a separate compatible package. Internally, it evolves expression trees rather than fitting a conventional linear coefficient vector. The interface tells us how software is used, while the representation and training procedure tell us what kind of learning occurs.`,
  `An artificial neuron is an engineered mathematical unit. Each input x-sub-i is multiplied by weight w-sub-i. Sigma means add those products, then add bias b. The resulting score is called net. An activation function converts that score into the unit's output.

Weights encode magnitude and direction of influence. A positive weight pushes the score upward when its input increases; a negative weight pushes downward. Bias moves the decision point without depending on a measured feature. This model was inspired historically by biological neurons, but it is not a faithful simulation of biological thought. Treat it as a useful computational abstraction whose behavior we can calculate exactly.`,
  `Before changing any control, calculate the score using the displayed inputs, weights, and bias. Then predict whether it lies above or below the threshold. Move one weight and observe that only its input's contribution changes. Move the bias and notice that every case's score shifts by the same amount.

This interaction separates three roles. Inputs describe the current example. Weights determine how strongly each input contributes. Bias adjusts the overall threshold location. When the score crosses the activation threshold, the output changes abruptly for a step activation. Later, sigmoid will replace this hard jump with a smooth transition.`,
  `McCulloch–Pitts units can implement logical gates with fixed weights. Both inputs have weight one. The activation returns one when net is at least zero and zero otherwise. For AND, bias minus two means only inputs one and one produce net zero; every other pair remains negative. For OR, bias minus one means any input containing at least one one reaches zero or above.

The activation rule does not change between the gates. Only the bias changes which truth-table rows cross the threshold. The constant input shown in the diagram is one way to include the bias as another weighted contribution. This page demonstrates designed weights, not learning yet.`,
  `Toggle all four binary input pairs for AND and OR. For each pair, compute net before reading the output. AND should return one only for one, one. OR should return zero only for zero, zero. The weights remain fixed at one; the gate difference comes from bias.

State the invariant aloud: same inputs, same input weights, same activation, different bias. This small example makes a decision boundary concrete. In a two-dimensional plot, AND and OR are linearly separable because one straight line can place their positive and negative cases on opposite sides. That fact will matter when we reach XOR.`,
  `For AND and OR, a designer supplied the weights. A predictive learner must discover useful weights from examples. Each training case provides a feature vector, such as measurements or pixel values, and a desired target t. The perceptron learns a weight vector W so that its predictions agree with those targets.

At prediction time, the target is unavailable. Only the features remain. This is why target information must guide training without accidentally appearing as an input feature. The distinction also explains supervised learning: labeled examples provide a direct desired answer during training. The learned parameters are the representation that changes.`,
  `Select rows in the perceptron dataset and separate features from the target column. The feature vector contains the values the model will receive for a future case. The target says whether the training example belongs to class plus one or minus one.

During training, the target allows us to measure an error and decide whether to update. During prediction, the target disappears because it is the unknown answer. If a target-derived value remains among the inputs, that would be leakage. The goal is not to memorize a row identifier but to learn a boundary that generalizes from feature patterns to unseen points.`,
  `The perceptron follows four steps. First compute net, the weighted sum of the inputs. Second compare net with threshold theta to produce prediction a, either plus one or minus one. Third compute error t minus a, where t is the desired target. Fourth change each weight by eta times the error times its input.

Eta is the learning rate and controls update size. Delta w-sub-i means the change to weight i. If the prediction is correct, t equals a, so the error and every update are zero. If the prediction is wrong, the update pushes the score toward the correct side of the boundary.`,
  `One update processes one training example. One epoch processes every example once. Convergence means repeated passes produce no classification mistakes for the training set. These are different units of progress.

Begin by initializing W. Predict one case, update after an error, continue to the next case, and repeat across epochs. Updating one example changes predictions for other examples, so a case that was previously correct may need to be checked again. If the data are linearly separable, the perceptron convergence theorem guarantees eventual separation under standard conditions. If they are not separable, more epochs will not create a stable perfect solution, so training needs a declared stopping rule.`,
  `The initial weight vector is 0.75, 0.50, and minus 0.60; the third value acts on a constant input and therefore serves as bias. Eta is 0.2. For each example, compute the score and predict its sign before deciding whether an update occurs.

Example one is initially classified correctly, so its update is zero. Example two has target minus one but receives a positive prediction, so the correction must lower its score. After that change, example three may become negative even though its target is plus one, so it requires a positive correction. The sequence shows that training order and prior updates affect the current prediction.`,
  `Use the trace one stage at a time: calculate the weighted score, convert it to a prediction, subtract prediction from target, and apply the update. The sign of delta W should make sense before doing arithmetic. A negative target misclassified as positive requires movement that lowers the example's score. A positive target misclassified as negative requires movement that raises it.

Remember that the update is a vector. Every component is eta times the same error times its corresponding input. A large feature can cause a large weight change unless features are scaled. Correct predictions yield t minus a equal to zero, so the weight vector stays unchanged.`,
  `After repeated passes, the reported weights define the line minus 1.3 x-one minus 1.1 x-two plus 10.9 equals zero. Points on one side have a positive score; points on the other side have a negative score. The coefficients control the line's orientation, and the bias 10.9 controls its position.

W approximately equals the displayed vector because training produces numerical values rounded for presentation. New points are classified by substituting their features and checking the score's sign. The geometry is the same computation viewed spatially: learning the weights means moving and rotating a boundary until it separates the labeled examples.`,
  `Compare the initial, converged, and overly high boundaries. For each line, count which positive and negative points lie on the wrong side. Then connect the visual movement to parameter changes. Adjusting the bias shifts the line, while changing feature weights can rotate it and change its position.

A line that perfectly separates these training points may still perform poorly on new points if the sample is unrepresentative. The visualization shows representational capacity and training fit, not a complete evaluation. A useful boundary must also be tested on unseen data from the intended population.`,
  `A single perceptron can represent only a linear decision boundary: one line in two dimensions, one plane in three, or one hyperplane in more dimensions. AND, OR, and the ten-point example are linearly separable, so one unit can express them.

XOR is different. Its positive examples occupy opposite corners of a square, with negative examples in the other two corners. No single straight line separates both positives from both negatives. More training data or more epochs cannot fix this, because the limitation is representational rather than informational or computational. We need a richer representation, such as multiple units arranged in layers.`,
  `The XOR inequalities expose the contradiction algebraically. To classify zero, zero below the threshold, theta must be positive. To classify one, zero and zero, one above the threshold, both w-one and w-two must exceed theta. Adding those two positive requirements makes w-one plus w-two greater than theta. But XOR requires one, one to be in the negative class, which demands w-one plus w-two less than theta.

Both conditions cannot hold at once. This is not a failure of the learning rate or training procedure. It is proof that one threshold unit cannot represent XOR. The geometric and algebraic explanations describe the same limitation.`,
  `Try moving the line through the XOR points. You may separate three points correctly, but correcting the fourth causes another error. Explain the failure geometrically: each class occupies opposite corners, so either half-plane that captures both positives also captures at least one negative.

Avoid stopping at the phrase “XOR is nonlinear.” State exactly what the representation lacks: one perceptron supplies only one straight boundary. A multilayer network can combine several boundaries to form separated regions. This practice distinguishes an optimization problem—finding good parameters—from a capacity problem—whether suitable parameters exist at all.`,
  `The hard threshold jumps abruptly from zero to one. Sigmoid replaces it with the smooth function one divided by one plus e raised to negative lambda times net. Sigma here names the sigmoid function, e is the exponential constant, lambda controls steepness, and net is the weighted score.

The output stays between zero and one and changes continuously. Increasing lambda makes the transition steeper and closer to a hard step. Differentiability is the key advantage for multilayer learning because a derivative supplies a local sensitivity used to assign credit and adjust weights. The output can be interpreted as a score, but it is not automatically a calibrated probability.`,
  `Compare step, sigmoid, and ReLU activations. Step produces a discrete output but has no useful gradient at most points. Sigmoid is smooth and bounded, although its gradient becomes small in saturated regions. ReLU returns zero for negative input and a linear positive output, supporting effective gradient flow in many modern networks.

Separate historical source content from modern supplementation. The threshold and sigmoid comparison motivates differentiable learning. ReLU is a later widely used alternative. Activation choice affects output range, smoothness, and how learning signals propagate; it does not by itself determine whether the task is supervised, unsupervised, or reinforcement learning.`,
  `Use each case to classify the learner before choosing an algorithm. Identify the representation that changes, the teaching signal available, and the timing of updates. A perceptron changes numeric weights, uses class labels, and can update online after each example. Genetic programming changes expression trees, uses fitness computed from targets, and commonly operates in batch generations.

Justify every axis with evidence from the workflow. Do not label a method “online” merely because it processes a sequence, and do not label it “reinforcement learning” merely because updating happens over time. Classification should help us select assumptions and evaluation methods, not serve as a vocabulary-matching exercise.`,
  `Your exit response should contain three connected claims. First, classify perceptron learning: numeric weight representation, supervised label feedback, and online-capable updates. Second, explain one update by naming the score, prediction, target error, learning rate, and direction of weight change. Third, explain why XOR needs a richer representation: one unit creates only one linear boundary, but XOR places same-class points in opposite corners.

This leads directly to Lesson 18. Hidden units compose multiple boundaries into more flexible regions. Backpropagation then assigns credit through that composition so each layer's weights can change. The limitation we saw today provides the motivation for multilayer networks rather than simply adding complexity without a reason.`,
] as const;

lesson17Slides.forEach((slide, index) => { slide.note = lesson17InstructorNotes[index]; });

function BackpropStepper() {
  const [step, setStep] = useState(0);
  return <div className="m12-backprop"><nav>{backpropSteps.map((item, index) => <button className={step === index ? "active" : ""} key={item.title} onClick={() => setStep(index)} type="button"><span>{index + 1}</span>{item.title}</button>)}</nav><section><span>Procedure {step + 1} of 5</span><h3>{backpropSteps[step].title}</h3><p>{backpropSteps[step].detail}</p><div className={`m12-network-flow stage-${step}`}><b>x</b><i>→</i><b>hidden</b><i>→</i><b>output</b><i>⇠</i><b>error</b></div></section></div>;
}

function DeltaRuleLab() {
  const [input, setInput] = useState(0.8);
  const [target, setTarget] = useState(1);
  const [activation, setActivation] = useState(0.6);
  const [slope, setSlope] = useState(0.24);
  const eta = 0.2;
  const delta = eta * (target - activation) * slope * input;
  return <div className="m12-delta-lab"><section>{[["input xᵢ", input, setInput], ["target tⱼ", target, setTarget], ["activation aⱼ", activation, setActivation], ["local slope f′", slope, setSlope]] .map(([label, value, setter]) => <label key={String(label)}><span>{label}</span><input max="1" min="0" onChange={event => (setter as (value:number)=>void)(Number(event.target.value))} step="0.05" type="range" value={Number(value)} /><strong>{Number(value).toFixed(2)}</strong></label>)}</section><article><Formula>Δwⱼ = η(tⱼ−aⱼ)f′(netⱼ)xᵢ</Formula><div><span>learning rate η</span><strong>{eta}</strong></div><div><span>weight change</span><strong>{delta >= 0 ? "+" : ""}{delta.toFixed(4)}</strong></div><p>Error says how wrong; slope says local sensitivity; input says how strongly this connection participated.</p></article></div>;
}

const clusterPoints = [
  [55, 55], [75, 70], [92, 48], [68, 92], [105, 82], [235, 65], [260, 52], [280, 82], [245, 105], [300, 110],
] as const;

function KMeansLab() {
  const [stage, setStage] = useState(0);
  const centroidStages = [[], [[80,145],[220,145]], [[80,145],[220,145]], [[72,88],[250,98]], [[79,69],[264,83]]] as const;
  const centroids = centroidStages[stage];
  return <div className="m12-kmeans"><nav>{["Original points", "Choose K=2", "Assign", "Recompute", "Converged"].map((label, index) => <button className={stage === index ? "active" : ""} key={label} onClick={() => setStage(index)} type="button">{index + 1} · {label}</button>)}</nav><section><svg aria-label={`K-means progression: ${["original points", "initial centroids", "nearest-centroid assignments", "moving means", "converged clusters"][stage]}`} viewBox="0 0 360 190">{stage === 4 && <><ellipse className="cluster-halo a" cx="80" cy="70" rx="55" ry="45" /><ellipse className="cluster-halo b" cx="265" cy="83" rx="62" ry="48" /></>}{stage === 2 && clusterPoints.map((point, index) => { const centroid=index<5?centroids[0]:centroids[1]; return <line className={index<5?"assignment-a":"assignment-b"} key={`line-${index}`} x1={point[0]} x2={centroid[0]} y1={point[1]} y2={centroid[1]} />; })}{stage === 3 && <><line className="centroid-move a" x1="80" x2={centroids[0][0]} y1="145" y2={centroids[0][1]} /><line className="centroid-move b" x1="220" x2={centroids[1][0]} y1="145" y2={centroids[1][1]} /><circle className="old-centroid" cx="80" cy="145" r="6" /><circle className="old-centroid" cx="220" cy="145" r="6" /></>}{clusterPoints.map((point, index) => <circle className={stage >= 2 ? index < 5 ? "cluster-a" : "cluster-b" : "unassigned"} cx={point[0]} cy={point[1]} key={index} r="8" />)}{stage >= 1 && centroids.map((point, index) => <path className={index ? "centroid-b" : "centroid-a"} d={`M${point[0]-10},${point[1]}h20M${point[0]},${point[1]-10}v20`} key={index} />)}<text className="k-label" x="38" y="176">{stage < 2 ? "unlabeled geometry" : stage === 2 ? "lines show nearest centroid" : stage === 3 ? "means move toward members" : "stable groups + centroids"}</text></svg><article><span>Current operation · step {stage + 1}</span><h3>{["Inspect the geometry", "Initialize two centroids", "Assign each point to its closest centroid", "Replace each centroid with its cluster mean", "Repeat until centroids stop changing"][stage]}</h3><p>{["No labels or centers exist yet.", "The starting crosses sit away from the visible groups.", "Colored lines expose every assignment decision.", "Dotted paths show how both means relocate.", "Halos reveal the final partition; another initialization could differ."][stage]}</p></article></section></div>;
}

function FruitLearningLab() {
  const [mode, setMode] = useState<"classification" | "clustering">("classification");
  return <div className="m12-fruit-lab"><SourceMedia alt="Basket containing several kinds of fruit" caption="The same observations support different tasks depending on whether labels are supplied." file="image24.jpeg" /><section><nav>{(["classification", "clustering"] as const).map(value => <button className={mode === value ? "active" : ""} key={value} onClick={() => setMode(value)} type="button">{value}</button>)}</nav>{mode === "classification" ? <article><span>Supervised</span><h3>Known fruit labels</h3><p>Train from examples labeled apple, banana, cherry, or grape; predict a predefined class for a new fruit.</p><Formula>features → class name</Formula></article> : <article><span>Unsupervised</span><h3>No fruit labels</h3><p>Group by observed similarity such as color and size; interpret the resulting clusters afterward.</p><Formula>features → cluster ID</Formula></article>}</section></div>;
}

function ReinforcementLab() {
  const [choice, setChoice] = useState<"serve" | "wait" | "explore">("serve");
  const outcomes = { serve: { reward: "+3", text: "Serve the current request quickly, but another floor may wait longer." }, wait: { reward: "−2", text: "Delay increases passenger waiting time." }, explore: { reward: "+1?", text: "Try a less-used action; it may reveal a better long-term policy." } };
  return <div className="m12-rl"><section><span>State s</span><h3>Elevator at floor 4</h3><p>Requests wait at floors 2 and 7.</p><nav>{Object.keys(outcomes).map(value => <button className={choice === value ? "active" : ""} key={value} onClick={() => setChoice(value as keyof typeof outcomes)} type="button">{value}</button>)}</nav></section><i>action → environment → reward</i><article><span>Feedback r</span><strong>{outcomes[choice].reward}</strong><p>{outcomes[choice].text}</p><Formula>goal: maximize cumulative reward</Formula></article></div>;
}

function StreamLab() {
  const [mode, setMode] = useState<"batch" | "online">("batch");
  const [events, setEvents] = useState(4);
  return <div className="m12-stream"><nav>{(["batch", "online"] as const).map(value => <button className={mode === value ? "active" : ""} key={value} onClick={() => setMode(value)} type="button">{value}</button>)}</nav><section><div className="m12-stream-controls"><label>Observed transactions <input max="8" min="1" onChange={event => setEvents(Number(event.target.value))} type="range" value={events} /></label><div className={`m12-event-stream ${mode}`}>{Array.from({ length: 8 }, (_, index) => <i className={index < events ? "seen" : ""} key={index}>{index + 1}</i>)}</div><article><span>{mode === "batch" ? "Offline cycle" : "Incremental cycle"}</span><h3>{mode === "batch" ? "Collect a dataset, then retrain" : "Update as each labeled instance arrives"}</h3><p>{mode === "batch" ? "Stable snapshots simplify evaluation but can become stale." : "Adapts to streams and scale, but order, drift, and monitoring matter."}</p></article></div><div className={`m12-stream-architecture ${mode}`} aria-label={`${mode} learning dataflow`}><div className="incoming"><span>1</span><span>2</span><span>3</span><span>…</span></div><i>→</i>{mode === "batch" ? <><div className="data-store"><b>DATASET</b><small>collect snapshot</small></div><i>→</i><div className="model-box"><b>MODEL v2</b><small>periodic retrain</small></div></> : <><div className="model-box pulse"><b>MODEL</b><small>update 1 → 2 → 3</small></div><i>↺</i><div className="monitor"><b>DRIFT</b><small>monitor continuously</small></div></>}<p>{mode === "batch" ? "One large update after collection" : "Many small updates during the stream"}</p></div></section></div>;
}

const synthesisMethods = {
  "Decision tree": ["symbolic", "supervised", "batch", "classification"],
  Perceptron: ["weights", "supervised", "online-capable", "classification"],
  "Multilayer ANN": ["weights", "supervised or unsupervised", "batch or online", "many tasks"],
  "K-means": ["centroids", "unsupervised", "batch", "clustering"],
  RL: ["policy/value", "reward", "sequential online", "control"],
} as const;

function CategoryMatrix() {
  const [method, setMethod] = useState<keyof typeof synthesisMethods>("Multilayer ANN");
  const values = synthesisMethods[method];
  return <div className="m12-matrix"><nav>{Object.keys(synthesisMethods).map(value => <button className={method === value ? "active" : ""} key={value} onClick={() => setMethod(value as keyof typeof synthesisMethods)} type="button">{value}</button>)}</nav><section>{["Learned representation", "Feedback", "Update timing", "Typical result"].map((label, index) => <article key={label}><span>{label}</span><strong>{values[index]}</strong></article>)}</section></div>;
}

const applications = {
  "Credit screening": { method: "Supervised classification", data: "Past applications + outcomes", risk: "Historical bias and distribution shift", visual: "credit" },
  "Customer segments": { method: "Unsupervised clustering", data: "Behavioral feature vectors", risk: "Clusters are not natural truths", visual: "segments" },
  "Elevator control": { method: "Reinforcement learning", data: "State, actions, cumulative reward", risk: "Unsafe exploration and reward design", visual: "elevator" },
  "Fraud stream": { method: "Online supervised learning", data: "Changing transaction stream + delayed labels", risk: "Concept drift and feedback delay", visual: "fraud" },
} as const;

function ApplicationMapper() {
  const [name, setName] = useState<keyof typeof applications>("Credit screening");
  const item = applications[name];
  return <div className="m12-app-map"><nav>{Object.keys(applications).map(value => <button className={name === value ? "active" : ""} key={value} onClick={() => setName(value as keyof typeof applications)} type="button">{value}</button>)}</nav><div className="m12-app-layout"><div className={`m12-application-scene ${item.visual}`} aria-label={`${name} learning workflow`}><div className="scene-input"><i/><i/><i/><span>{name === "Fraud stream" ? "live events" : name === "Elevator control" ? "state" : "examples"}</span></div><b>→</b><div className="scene-model"><span>{item.method}</span><strong>{name === "Customer segments" ? "GROUP" : name === "Elevator control" ? "ACT" : "PREDICT"}</strong></div><b>→</b><div className="scene-output"><i/><i/><span>{name === "Credit screening" ? "decision" : name === "Customer segments" ? "interpreted segments" : name === "Elevator control" ? "reward + next state" : "alert + delayed label"}</span></div></div><section><Card label="Method" title={item.method}>{name}</Card><Card label="Evidence" title={item.data} tone="green">What signal makes learning possible?</Card><Card label="Evaluation risk" title={item.risk} tone="amber">What could make performance claims misleading?</Card></section></div></div>;
}

function OutcomePath() {
  const outcomes = [
    ["Trace", "forward values", "backward credit", "flow"],
    ["Cluster", "points", "centroids", "cluster"],
    ["Distinguish", "labels · reward", "batch · online", "signal"],
    ["Design", "method + evidence", "risk check", "design"],
  ];
  return <div className="m12-outcome-path">{outcomes.map(([title, top, bottom, kind], index) => <article key={title}><span>0{index + 1}</span><div className={`m12-mini-visual ${kind}`} aria-hidden="true"><i/><i/><i/><b>{index === 0 ? "↔" : index === 1 ? "K" : index === 2 ? "?" : "✓"}</b></div><h3>{title}</h3><p>{top}<br/>{bottom}</p></article>)}</div>;
}

function NotationDiagram() {
  return <div className="m12-notation-diagram"><section className="input"><span>I · input layer</span><div><i/><i/><i/></div><code>xᵢ</code></section><b><span>wᵢⱼ</span>→</b><section className="hidden"><span>J · hidden layer</span><div><i/><i/><i/><i/></div><code>aⱼ, netⱼ</code></section><b><span>wⱼₖ</span>→</b><section className="output"><span>K · output layer</span><div><i/><i/></div><code>aₖ ↔ tₖ</code></section><p className="forward">activations flow forward →</p><p className="backward">← error signals flow backward</p></div>;
}

function BackpropProcedureVisual() {
  const steps = [["1","Forward","x → hidden → output"],["2","Measure","target − output"],["3","Backpropagate","δₖ → δⱼ"],["4","Weights","apply ηδa"],["5","Biases","update constant inputs"]];
  return <div className="m12-procedure-visual"><div className="m12-procedure-network"><span className="input">x</span><i>→</i><span className="hidden">h</span><i>→</i><span className="output">ŷ</span><b>loss</b><em>← credit assignment ←</em></div><section>{steps.map(([number,title,detail])=><article key={number}><b>{number}</b><span>{title}</span><small>{detail}</small></article>)}</section></div>;
}

function ClusteringFamiliesVisual() {
  return <div className="m12-cluster-families"><article><div className="flat"><i/><i/><i/><i/><i/><i/></div><span>Partitional</span><h3>One flat assignment</h3><p>Every point joins one of K groups.</p></article><article><div className="tree"><b/><span/><span/><i/><i/><i/><i/></div><span>Hierarchical</span><h3>A nested tree</h3><p>Cut the hierarchy at different levels.</p></article><article><div className="concept"><i>red</i><i>round</i><i>small</i><b>concept</b></div><span>Conceptual</span><h3>Groups + descriptions</h3><p>Return a cluster and an interpretable rule.</p></article></div>;
}

function ClassificationClusterCompare() {
  const points = Array.from({length:10},(_,index)=>index);
  return <div className="m12-class-cluster"><article><span>Classification · labels supplied</span><div className="point-field labeled">{points.map(index=><i className={index<5?"a":"b"} key={index}>{index<5?"A":"B"}</i>)}</div><p>Learn a boundary between known classes A and B.</p></article><b>same feature geometry</b><article><span>Clustering · no labels</span><div className="point-field clustered">{points.map(index=><i className={index<5?"a":"b"} key={index}/>)}</div><p>Discover groups, then investigate their meaning.</p></article></div>;
}

function ClusterLabelPipeline() {
  return <div className="m12-cluster-label-pipeline"><article><div><i/><i/><i/><i/><i/></div><b>1</b><span>Cluster</span><p>Find recurring geometry</p></article><em>→</em><article><div className="magnify">⌕</div><b>2</b><span>Inspect</span><p>Validate patterns</p></article><em>→</em><article><div className="tags"><i>A</i><i>B</i></div><b>3</b><span>Label</span><p>Request judgments</p></article><em>→</em><article><div className="boundary"><i/><i/></div><b>4</b><span>Classify</span><p>Predict known labels</p></article></div>;
}

function NetworkArchitectureCards() {
  const cards = [
    ["Dense", "Fully Connected Network", "dense", "Every unit connects to every unit in the next layer."],
    ["CNN", "Convolutional Neural Network", "cnn", "Shared local filters preserve spatial structure."],
    ["RNN", "Recurrent Neural Network", "rnn", "A recurrent state carries sequence context forward."],
    ["Deep", "Deep Neural Network", "deep", "Many layers compose increasingly abstract representations."],
  ];
  return <div className="m12-architecture-cards">{cards.map(([abbr,name,kind,detail])=><article key={abbr}><span>{abbr}</span><div className={`architecture-visual ${kind}`} aria-hidden="true"><i/><i/><i/><i/><b>{kind === "cnn" ? "▦" : kind === "rnn" ? "↺" : kind === "deep" ? "→→" : "×"}</b></div><h3>{name}</h3><p>{detail}</p></article>)}</div>;
}

function KnowledgeHybridVisual() {
  return <div className="m12-hybrid-visual"><article><div className="knowledge"><b>IF</b><i>rule</i><i>constraint</i></div><span>Domain knowledge</span><h3>Guide generalization</h3><p>Prior structure narrows plausible explanations.</p></article><article><div className="dendral"><i>C</i><b>?</b><i>O</i><em>→ rule</em></div><span>Meta-DENDRAL</span><h3>Learn chemical rules</h3><p>Infer structure rules while retaining explanations.</p></article><article><div className="hybrid"><i>rules</i><i>features</i><i>data</i><b>system</b></div><span>Hybrid learning</span><h3>Combine representations</h3><p>Coordinate symbolic constraints and learned patterns.</p></article></div>;
}

const lesson18Slides: SourceLessonSlide[] = [
  { eyebrow: "Module 12 · Machine Learning Part B", title: "From multilayer networks to a complete learning taxonomy", subtitle: "Backpropagation, clustering, reinforcement learning, online learning, deep learning, and applications.", content: <div className="m12-cover lesson18"><section><span>Lesson 18 · 75 minutes</span><h3>Which signal should change which representation, and when?</h3><p>We will trace credit assignment, discover groups, learn from rewards, and design for streaming data.</p></section><div className="m12-cover-orbit"><b>SIGNAL</b><span>error</span><span>similarity</span><span>reward</span><span>stream</span><span>depth</span><span>knowledge</span></div></div>, note: "Retrieve the three category axes from Lesson 17.", sourceSlides: [] },
  { eyebrow: "Learning outcomes", title: "Trace, cluster, distinguish, and design", content: <OutcomePath />, note: "Use the visual path to state the four forms of assessment evidence.", sourceSlides: [] },
  { eyebrow: "Knowledge point 1 · ANN", title: "Hidden layers compose intermediate representations", content: <div className="m12-layered-net"><div className="layer input"><span>input I</span>{[1,2,3].map(x=><i key={x}/>)}</div><b>Wᵢⱼ →</b><div className="layer hidden"><span>hidden J</span>{[1,2,3,4].map(x=><i key={x}/>)}</div><b>Wⱼₖ →</b><div className="layer output"><span>output K</span>{[1,2].map(x=><i key={x}/>)}</div><p>A hidden unit is not directly observed or supplied a target; its useful features are learned through the task.</p></div>, note: "Explain why hidden means internal to the model, not mysterious.", sourceSlides: [] },
  { eyebrow: "Forward and backward passes", title: "Training alternates value flow and credit assignment", content: <BackpropStepper />, note: "Walk through all five stages and keep forward values separate from backward signals.", sourceSlides: [] },
  { eyebrow: "Delta rule", title: "A weight update combines error, local slope, and input", content: <DeltaRuleLab />, note: "Ask which factor becomes zero for a saturated or inactive unit.", sourceSlides: [] },
  { eyebrow: "Gradient interpretation", title: "The negative gradient is a local direction—not a guarantee of the global best", content: <div className="m12-media-explain"><SourceMedia alt="Error surface with old and new weight positions and a local minimum" caption="A small step can reduce error locally while another minimum may be better." file="image18.png" /><section><ul><li>η controls step size.</li><li>Initialization changes the starting point.</li><li>Training can be slow.</li><li>Nearest local minimum may not be the best setting.</li></ul></section></div>, note: "Diagnose the misconception that gradient descent always finds the global optimum.", sourceSlides: [] },
  { eyebrow: "Notation map", title: "Keep layer indices and signal directions explicit", content: <NotationDiagram />, note: "Have students point in the direction of wᵢⱼ, wⱼₖ, forward activations, and backward error signals.", sourceSlides: [] },
  { eyebrow: "Output-layer credit", title: "The target directly supplies the output error signal", content: <div className="m12-equations"><Formula>δₖ = (tₖ−aₖ)f′(netₖ)</Formula><Formula>Δwⱼₖ = η δₖ aⱼ</Formula><p>The output unit knows its desired target, so its error term is local and direct.</p></div>, note: "Connect the formula term by term to the delta-rule lab.", sourceSlides: [] },
  { eyebrow: "Hidden-layer credit", title: "A hidden unit receives blame through its downstream paths", content: <div className="m12-equations"><Formula>δⱼ = f′(netⱼ) Σₖ wⱼₖδₖ</Formula><Formula>Δwᵢⱼ = η δⱼ xᵢ</Formula><p>No target exists for a hidden unit. Its signal is the weighted sum of the output signals it influenced.</p></div>, note: "Emphasize the chain rule and why downstream weights appear.", sourceSlides: [] },
  { eyebrow: "Guided calculation", title: "Trace one hidden signal backward", content: <div className="m12-worked"><section><Formula>δ₁=0.12, wⱼ₁=0.8</Formula><Formula>δ₂=−0.05, wⱼ₂=−0.4</Formula></section><i>→</i><section><Formula>Σwδ = 0.8(0.12)+(−0.4)(−0.05)=0.116</Formula><Formula>if f′=0.25, δⱼ=0.029</Formula></section><i>→</i><section><Formula>η=.2, xᵢ=.7</Formula><Formula>Δwᵢⱼ=.2(.029)(.7)=.00406</Formula></section></div>, note: "Students compute the weighted error sum before revealing the hidden delta and update.", sourceSlides: [] },
  { eyebrow: "Complete procedure", title: "Backpropagation is an ordered dataflow", content: <BackpropProcedureVisual />, note: "Preserve the five source steps in this exact order and trace the two signal directions.", sourceSlides: [] },
  { eyebrow: "Procedure check", title: "Why must gradients be computed before weights are changed?", content: <div className="m12-method-check"><section><span>Think · pair · share</span><h3>If one downstream weight changes too early, which hidden-layer signal is affected?</h3><p className="revealed">All deltas in one backward pass should refer to the same forward-pass parameter state; otherwise the calculation mixes states.</p></section></div>, note: "Use this to justify accumulate-then-update implementations.", sourceSlides: [] },
  { eyebrow: "Knowledge point 2 · Unsupervised learning", title: "Without target labels, the learner must discover structure", content: <Cards columns={3}><Card label="Discovery" title="Hypothesis → generality → conclusion">Historical programs such as AM attempted autonomous mathematical discovery.</Card><Card label="Pattern finding" title="Clustering" tone="green">Identify groups from similarity rather than a predefined class column.</Card><Card label="Output" title="Clusters, not class names" tone="purple">Interpretation and validation remain human/modeling responsibilities.</Card></Cards>, note: "Contrast a cluster ID with a known semantic label.", sourceSlides: [] },
  { eyebrow: "Clustering families", title: "Partitional, hierarchical, and conceptual methods return different structures", content: <ClusteringFamiliesVisual />, note: "Use each native diagram to contrast a flat assignment, a nested hierarchy, and a group with a description.", sourceSlides: [] },
  { eyebrow: "K-means demonstration", title: "Alternate assignment and centroid recomputation", content: <KMeansLab />, note: "Walk through every stage and ask what changes at each iteration.", sourceSlides: [] },
  { eyebrow: "Proximity and objective", title: "Similarity is high when objects are alike; dissimilarity is low", content: <div className="m12-equations"><Formula>dᵣ(p,q) = (Σₖ |pₖ−qₖ|ʳ)¹⁄ʳ</Formula><Cards columns={2}><Card label="Similarity" title="Higher = more alike">Often normalized to [0,1].</Card><Card label="Dissimilarity" title="Lower = more alike" tone="amber">Minimum is often 0; the upper limit depends on the measure.</Card></Cards><p>K-means minimizes within-cluster squared Euclidean distance, but the general clustering objective is computationally difficult.</p></div>, note: "Define each symbol in Minkowski distance and connect r=2 to Euclidean distance.", sourceSlides: [] },
  { eyebrow: "K-means procedure", title: "K is a parameter; convergence means the centroids stop changing", content: <div className="m12-loop"><b>select K centroids</b><i>→</i><b>assign nearest points</b><i>→</i><b>recompute means</b><i>↺</i><p>Variants include k-means++ initialization and fuzzy c-means membership.</p></div>, note: "Ask why initialization matters and why K is not learned by basic K-means.", sourceSlides: [] },
  { eyebrow: "Classification versus clustering", title: "The difference is the teaching signal, not the picture of the data", content: <ClassificationClusterCompare />, note: "Use the identical point geometry to isolate the changed teaching signal.", sourceSlides: [] },
  { eyebrow: "Fruit-basket example", title: "Known labels produce classes; observed similarity produces clusters", content: <FruitLearningLab />, note: "Toggle both modes and ask what information changed while the fruit stayed the same.", sourceSlides: [] },
  { eyebrow: "Supervised and unsupervised can work together", title: "Clusters can become features, hypotheses, or candidates for later labeling", content: <ClusterLabelPipeline />, note: "Trace the cluster-inspect-label-classify pipeline and connect it to semi-supervised learning.", sourceSlides: [] },
  { eyebrow: "Knowledge point 3 · Reinforcement learning", title: "An agent learns a policy from trial, reward, and cumulative consequences", content: <ReinforcementLab />, note: "Compare direct class labels with scalar reward; discuss exploration and delayed consequences.", sourceSlides: [] },
  { eyebrow: "Batch, online, and Big Data Analysis", title: "Update timing determines how quickly the model can respond to a changing stream", content: <StreamLab />, note: "Toggle the reconstructed batch/online dataflow; explain that sequential timing does not imply reinforcement learning.", sourceSlides: [] },
  { eyebrow: "Full category synthesis", title: "Deep, reinforcement, analogical, and hybrid learning are not one exclusive list", content: <CategoryMatrix />, note: "Add analogical learning and hybrid/universal learning verbally; show why depth is an architecture property, not a feedback signal.", sourceSlides: [] },
  { eyebrow: "Network types and deep learning", title: "Topology, learning algorithm, encoding, and depth are separate design choices", content: <NetworkArchitectureCards />, note: "Expand CNN and RNN aloud and use the mini-diagrams to distinguish spatial sharing, recurrence, connectivity, and depth.", sourceSlides: [] },
  { eyebrow: "Domain knowledge and hybrid learning", title: "Patterns alone are not the only source of learning power", content: <KnowledgeHybridVisual />, note: "Use the diagrams to show constraints, explanatory chemical-rule induction, and combined representations.", sourceSlides: [] },
  { eyebrow: "Applications and challenges", title: "Choose the learning signal and evaluation risk together", content: <ApplicationMapper />, note: "Cycle through credit, customer segments, elevator control, and a fraud stream. Add weather, speech, games, engineering, robotics, medicine, biology, BI and BDA.", sourceSlides: [] },
  { eyebrow: "Exit ticket · References", title: "Describe one system on four axes, then name its evidence risk", content: <div className="m12-exit"><section><span>Decision canvas</span><ol><li>Representation: symbolic, weights, centroids, policy, or hybrid?</li><li>Feedback: labels, similarity, reward, or domain knowledge?</li><li>Timing: batch or online?</li><li>Evaluation: what could invalidate the claim?</li></ol></section><section className="m12-references"><h3>Course references</h3><p>George F. Luger, <em>Artificial Intelligence: Structures and Strategies for Complex Problem Solving</em>, 6th ed., Chapters 10 and 12.</p><p>Tom M. Mitchell, <em>Machine Learning</em>, 1997.</p></section></div>, note: "Collect the four-axis design and one explicit risk. This completes all 36 source pages.", sourceSlides: [] },
];

export function Module12Lesson17Deck() {
  return <SourceDeckShell meetingLabel="Module 12 · Lesson 17" meetingTitle="Machine Learning Categories, Genetic Learning, and Perceptrons" slides={lesson17Slides} sourceCollectionLabel="L10 Machine Learning · Part B" timingPlan={[2,2,4,3,2,4,3,4,3,3,2,3,2,2,3,2,2,4,3,3,2,3,3,2,3,2,4]} />;
}

export function Module12Lesson18Deck() {
  return <SourceDeckShell meetingLabel="Module 12 · Lesson 18" meetingTitle="Neural Networks, Clustering, Reinforcement, and Online Learning" slides={lesson18Slides} sourceCollectionLabel="L10 Machine Learning · Part B" timingPlan={[2,2,3,3,4,2,2,3,3,4,2,2,3,3,4,3,2,2,3,3,4,2,3,2,3,2,4]} />;
}
