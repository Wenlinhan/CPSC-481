"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
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

function SciKitWorkflow() {
  const [step, setStep] = useState(0);
  const item = toolSteps[step];
  return <div className="m12-code-lab"><nav aria-label="Scikit-compatible genetic-programming workflow">{toolSteps.map((entry, index) => <button className={step === index ? "active" : ""} key={entry.label} onClick={() => setStep(index)} type="button">{entry.label}</button>)}</nav><section><span>Executable workflow</span><pre><code>{item.code}</code></pre><p>{item.explanation}</p><small><b>Precision:</b> `gplearn` is a scikit-learn-compatible library; genetic programming is not part of scikit-learn’s core estimators.</small></section></div>;
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
  { eyebrow: "Module 12 · Machine Learning Part B", title: "Machine learning has multiple category axes", subtitle: "Representation, feedback, and timing answer different questions.", content: <div className="m12-cover"><section><span>Lesson 17 · 75 minutes</span><h3>How does a learner change from examples?</h3><p>We will compare symbolic and adaptive methods, evolve a function, build a neuron, and train a perceptron.</p></section><div className="m12-cover-orbit"><b>LEARN</b><span>symbolic</span><span>adaptive</span><span>labels</span><span>stream</span><span>fitness</span><span>weights</span></div></div>, note: "Ask students to name two different meanings of 'type of machine learning.'", sourceSlides: [] },
  { eyebrow: "Source-complete roadmap", title: "From categories to one trainable neuron", content: <Cards columns={4}><Card label="01" title="Categorize">Symbolic/non-symbolic, supervised/unsupervised, batch/online.</Card><Card label="02" title="Evolve" tone="purple">Use genetic programming to search expression trees.</Card><Card label="03" title="Compute" tone="green">Trace weighted sums and McCulloch–Pitts gates.</Card><Card label="04" title="Learn" tone="amber">Update perceptron weights and test capacity.</Card></Cards>, note: "Preview the four knowledge points and their evidence.", sourceSlides: [] },
  { eyebrow: "Knowledge point 1 · Category axes", title: "A method occupies several categories at once", content: <CategoryExplorer />, note: "Switch among all five methods. Require a justification for each axis.", sourceSlides: [] },
  { eyebrow: "Representation axis", title: "Symbolic learning changes explicit structures; non-symbolic learning adapts parameters", content: <Cards columns={2}><Card label="Symbolic" title="Generalize structures"><ul><li>Decision-tree tests and branches</li><li>Winston-style concept descriptions</li><li>Human-readable rules and cutoffs</li></ul></Card><Card label="Non-symbolic" title="Optimize adaptive representations" tone="purple"><ul><li>Evolutionary fitness search</li><li>Weights adjusted from error</li><li>Geometry or gradients rather than explicit rule editing</li></ul></Card></Cards>, note: "Use the $15,000/$15,001 cutoff to discuss brittleness without implying all symbolic learning is non-adaptive.", sourceSlides: [] },
  { eyebrow: "Worked contrast", title: "The same loan task can be represented as rules or a weighted boundary", content: <div className="m12-contrast"><article><span>Decision tree</span><Formula>if income = low → risk = high</Formula><p>A named test produces a branch and an explicit rule.</p></article><i>same labels</i><article><span>Perceptron</span><Formula>sign(wᵀx + b)</Formula><p>Numeric parameters place a boundary in feature space.</p></article></div>, note: "Ask which representation is easier to explain and which changes smoothly near a cutoff.", sourceSlides: [] },
  { eyebrow: "Knowledge point 2 · Genetic learning", title: "Genetic programming evolves functions that fit labeled values", content: <GeneticProgramLab />, note: "Walk through representation, fitness, tournament selection, 90% crossover, 5% mutation, and stopping.", sourceSlides: [] },
  { eyebrow: "Exact regression example", title: "Ten labeled pairs define the fitness problem", content: <GeneticDataset />, note: "Select several rows and ask students to infer the hidden pattern before revealing y=x²/2.", sourceSlides: [] },
  { eyebrow: "Tool demonstration · scikit-compatible", title: "A symbolic regressor can use the familiar fit/predict workflow", content: <SciKitWorkflow />, note: "Clarify that gplearn follows the scikit-learn estimator interface but is a separate package.", sourceSlides: [] },
  { eyebrow: "Knowledge point 3 · Artificial neuron", title: "An artificial neuron combines weighted inputs, bias, and an activation", content: <div className="m12-media-explain"><SourceMedia alt="Artificial-neuron weighted-input schematic" caption="Each connection contributes xᵢwᵢ before activation." file="image1.png" /><section><Formula>net = Σᵢ wᵢxᵢ + b</Formula><ol><li>Inputs encode measured evidence.</li><li>Weights encode influence and direction.</li><li>Bias moves the decision point.</li><li>Activation converts the score to an output.</li></ol></section></div>, note: "Treat this as an engineered mathematical model, not a faithful simulation of biological thought.", sourceSlides: [] },
  { eyebrow: "Interactive neuron", title: "Change one factor and watch the score cross the threshold", content: <NeuronLab />, note: "Have students predict the output before moving the weight or bias.", sourceSlides: [] },
  { eyebrow: "McCulloch–Pitts · 1943", title: "Fixed weights and bias implement AND and OR", content: <div className="m12-media-explain"><SourceMedia alt="McCulloch-Pitts AND and OR weighted units" caption="AND uses bias −2; OR uses bias −1 when both input weights are 1." file="image3.png" /><section><Formula>f(net) = 1 when net ≥ 0; otherwise 0</Formula><p>The activation rule stays fixed. The bias changes which truth-table rows reach net ≥ 0.</p></section></div>, note: "Connect the constant input 1 to the bias term.", sourceSlides: [] },
  { eyebrow: "McCulloch–Pitts demo", title: "Run all four input pairs through one gate", content: <LogicGateLab />, note: "Toggle all four combinations for both gates and state the invariant weights.", sourceSlides: [] },
  { eyebrow: "From logic to learning", title: "A predictive learner must discover the weights from examples", content: <Cards columns={3}><Card label="Given" title="Feature vectors">Measurements such as size, price, or pixel values.</Card><Card label="Given" title="Desired class" tone="green">A target t for each training case.</Card><Card label="Learn" title="Weight vector" tone="purple">Parameters W that make predictions match labels.</Card></Cards>, note: "Contrast manually designed AND/OR weights with learned perceptron weights.", sourceSlides: [] },
  { eyebrow: "Supervised evidence", title: "The target column turns points into labeled training examples", content: <div className="m12-table-layout"><table><thead><tr><th>x₁</th><th>x₂</th><th>target t</th></tr></thead><tbody>{perceptronRows.map((row, index) => <tr key={index}><td>{row[0]}</td><td>{row[1]}</td><td className={row[2] === 1 ? "positive-text" : "negative-text"}>{row[2]}</td></tr>)}</tbody></table><section><h3>Classifier, not clusterer</h3><p>The learner already knows the two desired classes: +1 and −1. It uses them to adjust a decision boundary.</p></section></div>, note: "Ask what disappears at prediction time: the target label.", sourceSlides: [] },
  { eyebrow: "Knowledge point 4 · Perceptron", title: "Predict first; update only after a mistake", content: <div className="m12-procedure"><article><b>1</b><span>Score</span><Formula>net = Σwᵢxᵢ</Formula></article><article><b>2</b><span>Activate</span><Formula>a = 1 if net ≥ θ; else −1</Formula></article><article><b>3</b><span>Compare</span><Formula>error = t − a</Formula></article><article><b>4</b><span>Update</span><Formula>Δwᵢ = η(t−a)xᵢ</Formula></article></div>, note: "Define η, t, a, xᵢ, and θ. Correct predictions produce a zero update.", sourceSlides: [] },
  { eyebrow: "Training procedure", title: "One epoch processes every example; convergence can require reuse", content: <div className="m12-loop"><b>initialize W</b><i>→</i><b>predict one case</b><i>→</i><b>update on error</b><i>→</i><b>next case</b><i>↺</i><p>Continue across epochs until outputs remain correct for repeated passes—or stop at a declared training limit.</p></div>, note: "Distinguish one update, one epoch, and convergence.", sourceSlides: [] },
  { eyebrow: "Numeric setup", title: "The source example begins with W=[0.75, 0.50, −0.60] and η=0.2", content: <Cards columns={3}><Card label="Example 1" title="[1.0, 1.0, 1]">Target +1; the initial prediction is correct.</Card><Card label="Example 2" title="[9.4, 6.4, 1]" tone="amber">Target −1; the positive prediction requires a negative update.</Card><Card label="Example 3" title="[2.5, 2.1, 1]" tone="purple">Target +1; the new negative prediction requires a positive update.</Card></Cards>, note: "Students predict which examples will change the weights.", sourceSlides: [] },
  { eyebrow: "Worked perceptron update", title: "Compute score, prediction, correction, and next weights", content: <PerceptronTrace />, note: "Calculate all three updates. Expect students to justify the sign of ΔW.", sourceSlides: [] },
  { eyebrow: "Geometric interpretation", title: "The converged weight vector defines a separating line", content: <div className="m12-media-explain"><SourceMedia alt="Two labeled point groups separated by a linear perceptron boundary" caption="The learned line separates +1 from −1 training examples." file="image13.png" /><section><Formula>−1.3x₁ − 1.1x₂ + 10.9 = 0</Formula><p>After repeated passes, the source example reports W≈[−1.3, −1.1, 10.9]. New points are classified by the sign of the score.</p></section></div>, note: "Relate the coefficient vector to the line orientation and the bias to its position.", sourceSlides: [] },
  { eyebrow: "Boundary explorer", title: "Move the line and inspect which geometry the weights encode", content: <BoundaryExplorer />, note: "Compare the initial, converged, and overly high boundaries.", sourceSlides: [] },
  { eyebrow: "Representation limit", title: "One perceptron can represent only a linear decision boundary", content: <Cards columns={2}><Card label="Can represent" title="Linearly separable">AND, OR, and the ten-point binary example.</Card><Card label="Cannot represent" title="XOR with one unit" tone="amber">Positive corners are opposite; no single line separates them.</Card></Cards>, note: "Ask whether more training data or more epochs can fix a representation that cannot express the target.", sourceSlides: [] },
  { eyebrow: "XOR equations", title: "The four threshold inequalities have no common solution", content: <div className="m12-media-explain"><SourceMedia alt="XOR points on opposite corners of a square" caption="XOR assigns the same class to opposite corners." file="image15.png" /><section><Formula>w₁+w₂ &lt; θ</Formula><Formula>w₁ &gt; θ</Formula><Formula>w₂ &gt; θ</Formula><Formula>0 &lt; θ</Formula><p>The requirements contradict one another.</p></section></div>, note: "Combine w₁>θ and w₂>θ to show why w₁+w₂<θ cannot hold for positive θ.", sourceSlides: [] },
  { eyebrow: "Guided practice · XOR", title: "Try a line, then explain why it fails", content: <XorLab />, note: "Require a geometric explanation, not only the phrase 'nonlinear.'", sourceSlides: [] },
  { eyebrow: "Smooth activation", title: "Sigmoid replaces the hard jump with a differentiable S-curve", content: <div className="m12-media-explain"><SourceMedia alt="Hard threshold and sigmoid activation curves" caption="Increasing λ makes the sigmoid approach a hard threshold." file="image16.png" /><section><Formula>σ(net)=1/(1+e^(−λnet))</Formula><ul><li>continuous output in (0,1)</li><li>differentiable at every point</li><li>largest slope in its transition region</li></ul></section></div>, note: "Connect differentiability to later weight updates in multilayer networks.", sourceSlides: [] },
  { eyebrow: "Activation comparison", title: "Activation choice changes range, smoothness, and gradient flow", content: <ActivationLab />, note: "Compare step, sigmoid, and ReLU; identify which statement comes from the source and which is a modern supplement.", sourceSlides: [] },
  { eyebrow: "Formative synthesis", title: "Classify the learner before choosing its algorithm", content: <MethodCheck />, note: "Students answer each case on representation, feedback, and timing axes.", sourceSlides: [] },
  { eyebrow: "Exit ticket", title: "Explain what changed—and what the representation can express", content: <div className="m12-exit"><section><span>Submit three sentences</span><ol><li>Classify perceptron learning on all three axes.</li><li>Explain one numeric weight update.</li><li>Explain why XOR needs a richer representation.</li></ol></section><Card label="Bridge to Lesson 18" title="From one boundary to many layers" tone="purple">Hidden units compose multiple learned boundaries; backpropagation assigns credit through the composition.</Card></div>, note: "Collect the three-sentence response and preview multilayer learning.", sourceSlides: [] },
];

const backpropSteps = [
  { title: "Initialize", detail: "Choose small starting weights and biases. Different starts can reach different local minima." },
  { title: "Forward", detail: "Compute net inputs and activations layer by layer from inputs to outputs." },
  { title: "Measure", detail: "Compare output activations with desired targets to obtain error or loss." },
  { title: "Backward", detail: "Use local derivatives and downstream weights to propagate error signals toward earlier layers." },
  { title: "Update", detail: "Change every weight and bias in the direction that reduces the selected error measure." },
];

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
  const centroids = stage < 2 ? [[80, 145], [220, 145]] : [[79, 69], [264, 83]];
  return <div className="m12-kmeans"><nav>{["Original points", "Choose K=2", "Assign", "Recompute", "Converged"].map((label, index) => <button className={stage === index ? "active" : ""} key={label} onClick={() => setStage(index)} type="button">{index + 1} · {label}</button>)}</nav><section><svg aria-label="K-means clustering progression" viewBox="0 0 360 190">{clusterPoints.map((point, index) => <circle className={stage >= 2 ? index < 5 ? "cluster-a" : "cluster-b" : "unassigned"} cx={point[0]} cy={point[1]} key={index} r="8" />)}{stage >= 1 && centroids.map((point, index) => <path className={index ? "centroid-b" : "centroid-a"} d={`M${point[0]-9},${point[1]}h18M${point[0]},${point[1]-9}v18`} key={index} />)}</svg><article><span>Current operation</span><h3>{["Inspect the geometry", "Initialize two centroids", "Assign each point to its closest centroid", "Replace each centroid with its cluster mean", "Repeat until centroids stop changing"][stage]}</h3><p>K must be chosen. Different initial centroids can produce different local solutions.</p></article></section></div>;
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
  return <div className="m12-stream"><nav>{(["batch", "online"] as const).map(value => <button className={mode === value ? "active" : ""} key={value} onClick={() => setMode(value)} type="button">{value}</button>)}</nav><section><label>Observed transactions <input max="8" min="1" onChange={event => setEvents(Number(event.target.value))} type="range" value={events} /></label><div className={`m12-event-stream ${mode}`}>{Array.from({ length: 8 }, (_, index) => <i className={index < events ? "seen" : ""} key={index}>{index + 1}</i>)}</div><article><span>{mode === "batch" ? "Offline cycle" : "Incremental cycle"}</span><h3>{mode === "batch" ? "Collect a dataset, then retrain" : "Update as each labeled instance arrives"}</h3><p>{mode === "batch" ? "Stable snapshots simplify evaluation but can become stale." : "Adapts to streams and scale, but order, drift, and monitoring matter."}</p></article></section></div>;
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
  "Credit screening": { method: "Supervised classification", data: "Past applications + outcomes", risk: "Historical bias and distribution shift" },
  "Customer segments": { method: "Unsupervised clustering", data: "Behavioral feature vectors", risk: "Clusters are not natural truths" },
  "Elevator control": { method: "Reinforcement learning", data: "State, actions, cumulative reward", risk: "Unsafe exploration and reward design" },
  "Fraud stream": { method: "Online supervised learning", data: "Changing transaction stream + delayed labels", risk: "Concept drift and feedback delay" },
} as const;

function ApplicationMapper() {
  const [name, setName] = useState<keyof typeof applications>("Credit screening");
  const item = applications[name];
  return <div className="m12-app-map"><nav>{Object.keys(applications).map(value => <button className={name === value ? "active" : ""} key={value} onClick={() => setName(value as keyof typeof applications)} type="button">{value}</button>)}</nav><section><Card label="Method" title={item.method}>{name}</Card><Card label="Evidence" title={item.data} tone="green">What signal makes learning possible?</Card><Card label="Evaluation risk" title={item.risk} tone="amber">What could make performance claims misleading?</Card></section></div>;
}

const lesson18Slides: SourceLessonSlide[] = [
  { eyebrow: "Module 12 · Machine Learning Part B", title: "From multilayer networks to a complete learning taxonomy", subtitle: "Backpropagation, clustering, reinforcement learning, online learning, deep learning, and applications.", content: <div className="m12-cover lesson18"><section><span>Lesson 18 · 75 minutes</span><h3>Which signal should change which representation, and when?</h3><p>We will trace credit assignment, discover groups, learn from rewards, and design for streaming data.</p></section><div className="m12-cover-orbit"><b>SIGNAL</b><span>error</span><span>similarity</span><span>reward</span><span>stream</span><span>depth</span><span>knowledge</span></div></div>, note: "Retrieve the three category axes from Lesson 17.", sourceSlides: [] },
  { eyebrow: "Learning outcomes", title: "Trace, cluster, distinguish, and design", content: <Cards columns={4}><Card label="01" title="Trace">Forward activation and backward error.</Card><Card label="02" title="Cluster" tone="green">Run K-means and interpret proximity.</Card><Card label="03" title="Distinguish" tone="purple">Supervision, reward, batch, and online timing.</Card><Card label="04" title="Design" tone="amber">Match methods to applications and risks.</Card></Cards>, note: "State the four forms of assessment evidence.", sourceSlides: [] },
  { eyebrow: "Knowledge point 1 · ANN", title: "Hidden layers compose intermediate representations", content: <div className="m12-layered-net"><div className="layer input"><span>input I</span>{[1,2,3].map(x=><i key={x}/>)}</div><b>Wᵢⱼ →</b><div className="layer hidden"><span>hidden J</span>{[1,2,3,4].map(x=><i key={x}/>)}</div><b>Wⱼₖ →</b><div className="layer output"><span>output K</span>{[1,2].map(x=><i key={x}/>)}</div><p>A hidden unit is not directly observed or supplied a target; its useful features are learned through the task.</p></div>, note: "Explain why hidden means internal to the model, not mysterious.", sourceSlides: [] },
  { eyebrow: "Forward and backward passes", title: "Training alternates value flow and credit assignment", content: <BackpropStepper />, note: "Walk through all five stages and keep forward values separate from backward signals.", sourceSlides: [] },
  { eyebrow: "Delta rule", title: "A weight update combines error, local slope, and input", content: <DeltaRuleLab />, note: "Ask which factor becomes zero for a saturated or inactive unit.", sourceSlides: [] },
  { eyebrow: "Gradient interpretation", title: "The negative gradient is a local direction—not a guarantee of the global best", content: <div className="m12-media-explain"><SourceMedia alt="Error surface with old and new weight positions and a local minimum" caption="A small step can reduce error locally while another minimum may be better." file="image18.png" /><section><ul><li>η controls step size.</li><li>Initialization changes the starting point.</li><li>Training can be slow.</li><li>Nearest local minimum may not be the best setting.</li></ul></section></div>, note: "Diagnose the misconception that gradient descent always finds the global optimum.", sourceSlides: [] },
  { eyebrow: "Notation map", title: "Keep layer indices and signal directions explicit", content: <Cards columns={3}><Card label="I" title="Input layer">xᵢ and weights wᵢⱼ feed hidden units.</Card><Card label="J" title="Hidden layer" tone="purple">aⱼ and netⱼ transform upstream evidence.</Card><Card label="K" title="Output layer" tone="green">aₖ is compared with target tₖ.</Card></Cards>, note: "Have students point in the direction of wᵢⱼ, wⱼₖ, forward activations, and backward error signals.", sourceSlides: [] },
  { eyebrow: "Output-layer credit", title: "The target directly supplies the output error signal", content: <div className="m12-equations"><Formula>δₖ = (tₖ−aₖ)f′(netₖ)</Formula><Formula>Δwⱼₖ = η δₖ aⱼ</Formula><p>The output unit knows its desired target, so its error term is local and direct.</p></div>, note: "Connect the formula term by term to the delta-rule lab.", sourceSlides: [] },
  { eyebrow: "Hidden-layer credit", title: "A hidden unit receives blame through its downstream paths", content: <div className="m12-equations"><Formula>δⱼ = f′(netⱼ) Σₖ wⱼₖδₖ</Formula><Formula>Δwᵢⱼ = η δⱼ xᵢ</Formula><p>No target exists for a hidden unit. Its signal is the weighted sum of the output signals it influenced.</p></div>, note: "Emphasize the chain rule and why downstream weights appear.", sourceSlides: [] },
  { eyebrow: "Guided calculation", title: "Trace one hidden signal backward", content: <div className="m12-worked"><section><Formula>δ₁=0.12, wⱼ₁=0.8</Formula><Formula>δ₂=−0.05, wⱼ₂=−0.4</Formula></section><i>→</i><section><Formula>Σwδ = 0.8(0.12)+(−0.4)(−0.05)=0.116</Formula><Formula>if f′=0.25, δⱼ=0.029</Formula></section><i>→</i><section><Formula>η=.2, xᵢ=.7</Formula><Formula>Δwᵢⱼ=.2(.029)(.7)=.00406</Formula></section></div>, note: "Students compute the weighted error sum before revealing the hidden delta and update.", sourceSlides: [] },
  { eyebrow: "Complete procedure", title: "Backpropagation is an ordered dataflow", content: <div className="m12-procedure five"><article><b>1</b><span>outputs</span><p>Forward activations</p></article><article><b>2</b><span>errors</span><p>Compare to targets</p></article><article><b>3</b><span>backpropagate</span><p>Output → hidden → input</p></article><article><b>4</b><span>weights</span><p>Apply every Δw</p></article><article><b>5</b><span>biases</span><p>Update constant inputs</p></article></div>, note: "Preserve the five source steps in this exact order.", sourceSlides: [] },
  { eyebrow: "Procedure check", title: "Why must gradients be computed before weights are changed?", content: <div className="m12-method-check"><section><span>Think · pair · share</span><h3>If one downstream weight changes too early, which hidden-layer signal is affected?</h3><p className="revealed">All deltas in one backward pass should refer to the same forward-pass parameter state; otherwise the calculation mixes states.</p></section></div>, note: "Use this to justify accumulate-then-update implementations.", sourceSlides: [] },
  { eyebrow: "Knowledge point 2 · Unsupervised learning", title: "Without target labels, the learner must discover structure", content: <Cards columns={3}><Card label="Discovery" title="Hypothesis → generality → conclusion">Historical programs such as AM attempted autonomous mathematical discovery.</Card><Card label="Pattern finding" title="Clustering" tone="green">Identify groups from similarity rather than a predefined class column.</Card><Card label="Output" title="Clusters, not class names" tone="purple">Interpretation and validation remain human/modeling responsibilities.</Card></Cards>, note: "Contrast a cluster ID with a known semantic label.", sourceSlides: [] },
  { eyebrow: "Clustering families", title: "Partitional, hierarchical, and conceptual methods return different structures", content: <Cards columns={3}><Card label="Partitional" title="One flat assignment">Choose K groups and assign each object to one group.</Card><Card label="Hierarchical" title="A nested tree" tone="green">Build a hierarchy of clusters at multiple granularities.</Card><Card label="Conceptual" title="Groups plus descriptions" tone="purple">Generate a concept description for each discovered class.</Card></Cards>, note: "Correct a source wording issue: good clusters maximize within-cluster similarity and minimize between-cluster similarity.", sourceSlides: [] },
  { eyebrow: "K-means demonstration", title: "Alternate assignment and centroid recomputation", content: <KMeansLab />, note: "Walk through every stage and ask what changes at each iteration.", sourceSlides: [] },
  { eyebrow: "Proximity and objective", title: "Similarity is high when objects are alike; dissimilarity is low", content: <div className="m12-equations"><Formula>dᵣ(p,q) = (Σₖ |pₖ−qₖ|ʳ)¹⁄ʳ</Formula><Cards columns={2}><Card label="Similarity" title="Higher = more alike">Often normalized to [0,1].</Card><Card label="Dissimilarity" title="Lower = more alike" tone="amber">Minimum is often 0; the upper limit depends on the measure.</Card></Cards><p>K-means minimizes within-cluster squared Euclidean distance, but the general clustering objective is computationally difficult.</p></div>, note: "Define each symbol in Minkowski distance and connect r=2 to Euclidean distance.", sourceSlides: [] },
  { eyebrow: "K-means procedure", title: "K is a parameter; convergence means the centroids stop changing", content: <div className="m12-loop"><b>select K centroids</b><i>→</i><b>assign nearest points</b><i>→</i><b>recompute means</b><i>↺</i><p>Variants include k-means++ initialization and fuzzy c-means membership.</p></div>, note: "Ask why initialization matters and why K is not learned by basic K-means.", sourceSlides: [] },
  { eyebrow: "Classification versus clustering", title: "The difference is the teaching signal, not the picture of the data", content: <Cards columns={2}><Card label="Classification" title="Predefined classes">Learn from labeled examples; predict which known class contains a new object.</Card><Card label="Clustering" title="Discovered groups" tone="green">Group unlabeled objects and investigate the relationships afterward.</Card></Cards>, note: "Diagnose the misconception that clustering is simply classification with unknown names.", sourceSlides: [] },
  { eyebrow: "Fruit-basket example", title: "Known labels produce classes; observed similarity produces clusters", content: <FruitLearningLab />, note: "Toggle both modes and ask what information changed while the fruit stayed the same.", sourceSlides: [] },
  { eyebrow: "Supervised and unsupervised can work together", title: "Clusters can become features, hypotheses, or candidates for later labeling", content: <div className="m12-procedure"><article><b>1</b><span>cluster</span><p>Discover recurring structure.</p></article><article><b>2</b><span>inspect</span><p>Interpret and validate groups.</p></article><article><b>3</b><span>label</span><p>Obtain selected human judgments.</p></article><article><b>4</b><span>classify</span><p>Train a supervised model.</p></article></div>, note: "Connect to semi-supervised learning and applications in biology, business, segmentation, outliers, and dimensionality reduction.", sourceSlides: [] },
  { eyebrow: "Knowledge point 3 · Reinforcement learning", title: "An agent learns a policy from trial, reward, and cumulative consequences", content: <ReinforcementLab />, note: "Compare direct class labels with scalar reward; discuss exploration and delayed consequences.", sourceSlides: [] },
  { eyebrow: "Batch, online, and Big Data Analysis", title: "Update timing determines how quickly the model can respond to a changing stream", content: <div className="m12-stream-layout"><StreamLab /><SourceMedia alt="Batch learning compared with online incremental learning" caption="Batch learns from a collected dataset; online learning updates as cases arrive." file="image25.png" /></div>, note: "Explain that online learning and reinforcement learning can both be sequential, but their feedback signals differ.", sourceSlides: [] },
  { eyebrow: "Full category synthesis", title: "Deep, reinforcement, analogical, and hybrid learning are not one exclusive list", content: <CategoryMatrix />, note: "Add analogical learning and hybrid/universal learning verbally; show why depth is an architecture property, not a feedback signal.", sourceSlides: [] },
  { eyebrow: "Network types and deep learning", title: "Topology, learning algorithm, encoding, and depth are separate design choices", content: <Cards columns={4}><Card label="Dense" title="Fully connected">Combine all upstream activations.</Card><Card label="CNN" title="Spatial sharing" tone="green">Learn local filters for images and grids.</Card><Card label="RNN" title="Sequence state" tone="purple">Reuse recurrent connections across time.</Card><Card label="Deep" title="Many layers" tone="amber">Compose multiple levels of representation; 100+ layers are possible.</Card></Cards>, note: "Reinforce that neural networks can support supervised or unsupervised objectives.", sourceSlides: [] },
  { eyebrow: "Domain knowledge and hybrid learning", title: "Patterns alone are not the only source of learning power", content: <Cards columns={3}><Card label="Domain knowledge" title="Guide generalization">Humans often learn from few examples because prior knowledge constrains interpretation.</Card><Card label="Meta-DENDRAL" title="Learn chemical rules" tone="purple">Infer molecular-structure rules from formulas and data; retain explanations as positive examples.</Card><Card label="Hybrid systems" title="Combine representations" tone="green">Integrate rules, learned features, ensembles, and common-sense/domain knowledge.</Card></Cards>, note: "Discuss how knowledge can reduce sample needs while also introducing assumptions.", sourceSlides: [] },
  { eyebrow: "Applications and challenges", title: "Choose the learning signal and evaluation risk together", content: <ApplicationMapper />, note: "Cycle through credit, customer segments, elevator control, and a fraud stream. Add weather, speech, games, engineering, robotics, medicine, biology, BI and BDA.", sourceSlides: [] },
  { eyebrow: "Exit ticket · References", title: "Describe one system on four axes, then name its evidence risk", content: <div className="m12-exit"><section><span>Decision canvas</span><ol><li>Representation: symbolic, weights, centroids, policy, or hybrid?</li><li>Feedback: labels, similarity, reward, or domain knowledge?</li><li>Timing: batch or online?</li><li>Evaluation: what could invalidate the claim?</li></ol></section><section className="m12-references"><h3>Course references</h3><p>George F. Luger, <em>Artificial Intelligence: Structures and Strategies for Complex Problem Solving</em>, 6th ed., Chapters 10 and 12.</p><p>Tom M. Mitchell, <em>Machine Learning</em>, 1997.</p></section></div>, note: "Collect the four-axis design and one explicit risk. This completes all 36 source pages.", sourceSlides: [] },
];

export function Module12Lesson17Deck() {
  return <SourceDeckShell meetingLabel="Module 12 · Lesson 17" meetingTitle="Machine Learning Categories, Genetic Learning, and Perceptrons" slides={lesson17Slides} sourceCollectionLabel="L10 Machine Learning · Part B" timingPlan={[2,2,4,3,2,4,3,4,3,3,2,3,2,2,3,2,2,4,3,3,2,3,3,2,3,2,4]} />;
}

export function Module12Lesson18Deck() {
  return <SourceDeckShell meetingLabel="Module 12 · Lesson 18" meetingTitle="Neural Networks, Clustering, Reinforcement, and Online Learning" slides={lesson18Slides} sourceCollectionLabel="L10 Machine Learning · Part B" timingPlan={[2,2,3,3,4,2,2,3,3,4,2,2,3,3,4,3,2,2,3,3,4,2,3,2,3,2,4]} />;
}
