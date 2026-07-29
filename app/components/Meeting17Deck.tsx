"use client";

import { useMemo, useState } from "react";
import "../styles/meeting17.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l10-neural-networks";
const SOURCE_DECK_LABEL = "L10 Machine Learning · Part B";

function resolveMeeting17SourceReference(sourceSlide: number) {
  return {
    deckLabel: SOURCE_DECK_LABEL,
    image: `${SOURCE_ROOT}/slide-renders/slide-${String(sourceSlide).padStart(2, "0")}.png`,
    key: `l10-neural-networks:${sourceSlide}`,
    page: sourceSlide,
  };
}

function SourceFrame({
  slide,
  alt,
  caption,
  className = "",
}: {
  slide: number;
  alt: string;
  caption: string;
  className?: string;
}) {
  return (
    <SearchSourceImage
      alt={alt}
      caption={caption}
      className={`m17-source-frame ${className}`.trim()}
      file={`slide-renders/slide-${String(slide).padStart(2, "0")}.png`}
      sourceRoot={SOURCE_ROOT}
    />
  );
}

function SourceExplanation({
  slide,
  alt,
  caption,
  children,
  reverse = false,
}: {
  slide: number;
  alt: string;
  caption: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={reverse ? "m17-source-explain reverse" : "m17-source-explain"}>
      <SourceFrame alt={alt} caption={caption} slide={slide} />
      <section>{children}</section>
    </div>
  );
}

function WeightedSumLab() {
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(1);
  const [w1, setW1] = useState(0.8);
  const [w2, setW2] = useState(-0.4);
  const [bias, setBias] = useState(-0.2);
  const net = w1 * x1 + w2 * x2 + bias;
  const output = net >= 0 ? 1 : -1;
  const controls = [
    { label: "x₁", value: x1, set: setX1 },
    { label: "x₂", value: x2, set: setX2 },
    { label: "w₁", value: w1, set: setW1 },
    { label: "w₂", value: w2, set: setW2 },
    { label: "bias b", value: bias, set: setBias },
  ];

  return (
    <div className="m17-weighted-lab">
      <section>
        <span>Interactive neuron</span>
        <div className="m17-controls">
          {controls.map(control => (
            <label key={control.label}>
              <span>{control.label}</span>
              <input
                aria-label={control.label}
                max="1"
                min="-1"
                onChange={event => control.set(Number(event.target.value))}
                step="0.1"
                type="range"
                value={control.value}
              />
              <strong>{control.value.toFixed(1)}</strong>
            </label>
          ))}
        </div>
      </section>
      <section className="m17-neuron-result">
        <div className="m17-neuron-inputs">
          <code>{x1.toFixed(1)}</code>
          <code>{x2.toFixed(1)}</code>
          <code>1</code>
        </div>
        <div className="m17-neuron-node">
          <span>weighted sum</span>
          <strong>{net.toFixed(2)}</strong>
          <small>wᵀx + b</small>
        </div>
        <div className={output > 0 ? "m17-output positive" : "m17-output negative"}>
          <span>step output</span>
          <strong>{output}</strong>
        </div>
        <p>
          {output > 0
            ? "The weighted evidence reaches the decision side of the boundary."
            : "The weighted evidence remains below the decision boundary."}
        </p>
      </section>
    </div>
  );
}

function LogicGateLab() {
  const [gate, setGate] = useState<"AND" | "OR">("AND");
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  const bias = gate === "AND" ? -2 : -1;
  const net = x + y + bias;
  const output = net >= 0 ? 1 : 0;

  return (
    <div className="m17-logic-lab">
      <nav aria-label="Logic gate">
        {(["AND", "OR"] as const).map(item => (
          <button
            className={gate === item ? "active" : ""}
            key={item}
            onClick={() => setGate(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>
      <section>
        <div className="m17-bit-controls">
          <button onClick={() => setX(value => 1 - value)} type="button">
            <span>x</span><strong>{x}</strong>
          </button>
          <button onClick={() => setY(value => 1 - value)} type="button">
            <span>y</span><strong>{y}</strong>
          </button>
        </div>
        <div className="m17-logic-equation">
          <code>net = 1x + 1y {bias < 0 ? "−" : "+"} {Math.abs(bias)}</code>
          <strong>{net.toFixed(0)}</strong>
          <span>step(net) = {output}</span>
        </div>
        <div className={output ? "m17-gate-output on" : "m17-gate-output"}>
          <span>{gate}</span>
          <strong>{output}</strong>
        </div>
      </section>
      <p>Change the inputs. The activation stays fixed; the bias changes which truth table the neuron implements.</p>
    </div>
  );
}

const trainingRows = [
  { x1: 1.0, x2: 1.0, target: 1 },
  { x1: 9.4, x2: 6.4, target: -1 },
  { x1: 2.5, x2: 2.1, target: 1 },
  { x1: 8.0, x2: 7.7, target: -1 },
  { x1: 0.5, x2: 2.2, target: 1 },
  { x1: 7.9, x2: 8.4, target: -1 },
  { x1: 7.0, x2: 7.0, target: -1 },
  { x1: 2.8, x2: 0.8, target: 1 },
  { x1: 1.2, x2: 3.0, target: 1 },
  { x1: 7.8, x2: 6.1, target: -1 },
];

function TrainingDataStudio() {
  const [row, setRow] = useState(0);
  const item = trainingRows[row];
  return (
    <div className="m17-data-studio">
      <div role="table" aria-label="Perceptron training data">
        <div role="row"><b>x₁</b><b>x₂</b><b>target t</b></div>
        {trainingRows.map((entry, index) => (
          <button
            className={row === index ? "active" : ""}
            key={`${entry.x1}-${entry.x2}`}
            onClick={() => setRow(index)}
            role="row"
            type="button"
          >
            <span>{entry.x1.toFixed(1)}</span>
            <span>{entry.x2.toFixed(1)}</span>
            <span>{entry.target}</span>
          </button>
        ))}
      </div>
      <section>
        <span>Selected labeled example</span>
        <code>x = [{item.x1.toFixed(1)}, {item.x2.toFixed(1)}, 1]</code>
        <code>t = {item.target}</code>
        <p>The final coordinate is the constant input for the bias weight.</p>
        <SearchCallout label="Supervised learning" tone="cyan">
          The target is supplied during training. At prediction time, the learned weights must classify a new x without seeing t.
        </SearchCallout>
      </section>
    </div>
  );
}

const perceptronSteps = [
  {
    label: "Example 1 · correct",
    x: "[1.0, 1.0, 1]",
    target: "1",
    weights: "[0.75, 0.50, −0.60]",
    net: "0.75(1) + 0.50(1) − 0.60 = 0.65",
    output: "a = 1",
    delta: "Δw = 0.2(1 − 1)x = [0, 0, 0]",
    next: "[0.75, 0.50, −0.60]",
    explanation: "The prediction matches the target, so the weights do not change.",
  },
  {
    label: "Example 2 · mistake",
    x: "[9.4, 6.4, 1]",
    target: "−1",
    weights: "[0.75, 0.50, −0.60]",
    net: "0.75(9.4) + 0.50(6.4) − 0.60 = 9.65",
    output: "a = 1",
    delta: "Δw = 0.2(−1 − 1)x = [−3.76, −2.56, −0.40]",
    next: "[−3.01, −2.06, −1.00]",
    explanation: "The positive prediction is wrong; the update moves the boundary away from this negative example.",
  },
  {
    label: "Example 3 · mistake",
    x: "[2.5, 2.1, 1]",
    target: "1",
    weights: "[−3.01, −2.06, −1.00]",
    net: "−3.01(2.5) − 2.06(2.1) − 1.00 ≈ −12.85",
    output: "a = −1",
    delta: "Δw = 0.2(1 − (−1))x = [1.00, 0.84, 0.40]",
    next: "[−2.01, −1.22, −0.60]",
    explanation: "The negative prediction is wrong; the update moves the boundary toward accepting this positive example.",
  },
];

function PerceptronUpdateLab({ startAt = 0 }: { startAt?: number }) {
  const [step, setStep] = useState(startAt);
  const item = perceptronSteps[step];
  return (
    <div className="m17-update-lab">
      <nav aria-label="Perceptron update examples">
        {perceptronSteps.map((entry, index) => (
          <button
            className={index === step ? "active" : ""}
            key={entry.label}
            onClick={() => setStep(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>{entry.label}
          </button>
        ))}
      </nav>
      <section>
        <div className="m17-update-header">
          <span>Current</span><code>w = {item.weights}</code>
          <span>Example</span><code>x = {item.x}, t = {item.target}</code>
        </div>
        <ol>
          <li><span>1</span><div><strong>Score</strong><code>{item.net}</code></div></li>
          <li><span>2</span><div><strong>Threshold</strong><code>{item.output}</code></div></li>
          <li><span>3</span><div><strong>Update</strong><code>{item.delta}</code></div></li>
          <li><span>4</span><div><strong>Next weights</strong><code>w′ = {item.next}</code></div></li>
        </ol>
        <p>{item.explanation}</p>
      </section>
    </div>
  );
}

const boundaryPresets = [
  {
    label: "Too low",
    weights: [-1, -1, 4],
    equation: "−x₁ − x₂ + 4 = 0",
    line: { x1: 0, y1: 4, x2: 4, y2: 0 },
  },
  {
    label: "Converged",
    weights: [-1.3, -1.1, 10.9],
    equation: "−1.3x₁ − 1.1x₂ + 10.9 = 0",
    line: { x1: 0, y1: 9.91, x2: 8.38, y2: 0 },
  },
  {
    label: "Too high",
    weights: [-1, -1, 15],
    equation: "−x₁ − x₂ + 15 = 0",
    line: { x1: 5, y1: 10, x2: 10, y2: 5 },
  },
];

function BoundaryExplorer() {
  const [preset, setPreset] = useState(1);
  const item = boundaryPresets[preset];
  const mistakes = trainingRows.filter(row => {
    const score = item.weights[0] * row.x1 + item.weights[1] * row.x2 + item.weights[2];
    return (score >= 0 ? 1 : -1) !== row.target;
  }).length;
  const px = (value: number) => 40 + value * 30;
  const py = (value: number) => 280 - value * 24;

  return (
    <div className="m17-boundary-lab">
      <nav aria-label="Decision boundary candidates">
        {boundaryPresets.map((entry, index) => (
          <button
            className={index === preset ? "active" : ""}
            key={entry.label}
            onClick={() => setPreset(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <svg aria-label="Training points and selected linear decision boundary" role="img" viewBox="0 0 380 310">
          <line x1="40" x2="340" y1="280" y2="280" />
          <line x1="40" x2="40" y1="40" y2="280" />
          {[0, 2, 4, 6, 8, 10].map(tick => (
            <g key={tick}>
              <text x={px(tick)} y="300">{tick}</text>
              <text x="20" y={py(tick) + 4}>{tick}</text>
            </g>
          ))}
          <line
            className="m17-boundary-line"
            x1={px(item.line.x1)}
            x2={px(item.line.x2)}
            y1={py(item.line.y1)}
            y2={py(item.line.y2)}
          />
          {trainingRows.map((point, index) => (
            point.target === 1 ? (
              <circle
                className="positive"
                cx={px(point.x1)}
                cy={py(point.x2)}
                key={index}
                r="7"
              />
            ) : (
              <path
                className="negative"
                d={`M ${px(point.x1)} ${py(point.x2) - 8} l 8 14 h -16 z`}
                key={index}
              />
            )
          ))}
          <text className="axis-label" x="326" y="273">x₁</text>
          <text className="axis-label" x="48" y="52">x₂</text>
        </svg>
        <div>
          <span>Boundary</span>
          <code>{item.equation}</code>
          <strong>{mistakes} / {trainingRows.length} mistakes</strong>
          <p>Circle = +1 · triangle = −1. A point&apos;s class is determined by the sign of wᵀx + b.</p>
        </div>
      </section>
    </div>
  );
}

function XorBoundaryLab() {
  const [candidate, setCandidate] = useState<"vertical" | "horizontal" | "diagonal" | "none">("vertical");
  const answers = {
    vertical: "x₁ = 0.5 splits left from right, but each side still contains one 0 and one 1.",
    horizontal: "x₂ = 0.5 splits bottom from top, but each side still contains one 0 and one 1.",
    diagonal: "x₁ + x₂ = 1 separates one corner, but it cannot group both opposite XOR-positive corners.",
    none: "Correct: no single straight line separates the two XOR classes.",
  };
  return (
    <div className="m17-xor-lab">
      <nav aria-label="Candidate XOR boundaries">
        {([
          ["vertical", "Vertical"],
          ["horizontal", "Horizontal"],
          ["diagonal", "Diagonal"],
          ["none", "No single line"],
        ] as const).map(([key, label]) => (
          <button
            className={candidate === key ? "active" : ""}
            key={key}
            onClick={() => setCandidate(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>
      <section>
        <div className="m17-xor-plot">
          <span className="zero p00">0</span>
          <span className="one p01">1</span>
          <span className="one p10">1</span>
          <span className="zero p11">0</span>
          {candidate !== "none" && <i className={candidate} />}
          <b className="x-label">x₁</b>
          <b className="y-label">x₂</b>
        </div>
        <article className={candidate === "none" ? "correct" : ""}>
          <span>Test the claim</span>
          <p>{answers[candidate]}</p>
        </article>
      </section>
    </div>
  );
}

const activationFunctions = {
  step: {
    label: "Step",
    formula: "f(z) = 1 if z ≥ 0, else 0",
    use: "Discrete threshold decisions; not differentiable at 0.",
    fn: (z: number) => (z >= 0 ? 1 : 0),
  },
  sigmoid: {
    label: "Sigmoid",
    formula: "σ(z) = 1 / (1 + e⁻ᶻ)",
    use: "Smooth output in the open interval (0, 1); common for binary probabilities at an output layer.",
    fn: (z: number) => 1 / (1 + Math.exp(-z)),
  },
  tanh: {
    label: "tanh",
    formula: "tanh(z) ∈ (−1, 1)",
    use: "Smooth and zero-centered, but it can saturate for large |z|.",
    fn: (z: number) => Math.tanh(z),
  },
  relu: {
    label: "ReLU",
    formula: "ReLU(z) = max(0, z)",
    use: "Simple, non-saturating for z > 0, and widely used in hidden layers.",
    fn: (z: number) => Math.max(0, z) / 4,
  },
};

function ActivationExplorer() {
  const [activation, setActivation] = useState<keyof typeof activationFunctions>("sigmoid");
  const item = activationFunctions[activation];
  const path = useMemo(() => {
    return Array.from({ length: 81 }, (_, index) => {
      const z = -4 + index / 10;
      const raw = item.fn(z);
      const normalized = activation === "tanh" ? (raw + 1) / 2 : Math.max(0, Math.min(1, raw));
      const x = 30 + index * 4;
      const y = 210 - normalized * 160;
      return `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  }, [activation, item]);

  return (
    <div className="m17-activation-lab">
      <nav aria-label="Activation functions">
        {(Object.keys(activationFunctions) as Array<keyof typeof activationFunctions>).map(key => (
          <button
            className={activation === key ? "active" : ""}
            key={key}
            onClick={() => setActivation(key)}
            type="button"
          >
            {activationFunctions[key].label}
          </button>
        ))}
      </nav>
      <section>
        <svg aria-label={`${item.label} activation curve`} role="img" viewBox="0 0 380 240">
          <line x1="30" x2="350" y1="210" y2="210" />
          <line x1="190" x2="190" y1="30" y2="220" />
          <path d={path} />
          <text x="340" y="230">z</text>
          <text x="198" y="42">f(z)</text>
        </svg>
        <article>
          <span>Textbook / modern supplement</span>
          <h3>{item.label}</h3>
          <code>{item.formula}</code>
          <p>{item.use}</p>
        </article>
      </section>
    </div>
  );
}

function LossDescentLab() {
  const [weight, setWeight] = useState(-1.5);
  const learningRate = 0.2;
  const loss = (weight - 2) ** 2;
  const gradient = 2 * (weight - 2);
  const next = weight - learningRate * gradient;
  return (
    <div className="m17-loss-lab">
      <section>
        <span>Smooth toy objective</span>
        <code>L(w) = (w − 2)²</code>
        <div>
          <article><span>current w</span><strong>{weight.toFixed(2)}</strong></article>
          <article><span>loss</span><strong>{loss.toFixed(2)}</strong></article>
          <article><span>gradient</span><strong>{gradient.toFixed(2)}</strong></article>
        </div>
        <button onClick={() => setWeight(next)} type="button">Take one gradient step</button>
        <button onClick={() => setWeight(-1.5)} type="button">Reset</button>
      </section>
      <section>
        <div className="m17-loss-track">
          <i style={{ left: `${Math.max(2, Math.min(98, ((weight + 2) / 6) * 100))}%` }} />
          <span>−2</span><b>minimum w = 2</b><span>4</span>
        </div>
        <code>w′ = w − η ∂L/∂w = {next.toFixed(2)}</code>
        <SearchCallout label="Important distinction" tone="amber">
          The classic perceptron rule is mistake-driven. It is not ordinary gradient descent on a smooth average-error surface, although it can be related to a subgradient update on perceptron loss.
        </SearchCallout>
      </section>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Machine learning · Part B",
    title: "From one artificial neuron to a learned decision boundary",
    subtitle: "Weighted sums, threshold logic, perceptron learning, linear separability, and smooth activations.",
    content: (
      <div className="m17-cover">
        <SourceFrame
          alt="CPSC 481 Machine Learning Part B title page"
          caption="Course context · Machine Learning Part B."
          slide={1}
        />
        <section>
          <span>Meeting 17 · 75 minutes</span>
          <h3>What can one trainable neuron learn?</h3>
          <p>We will connect a weighted threshold model to logic, labeled examples, a perceptron update, a geometric boundary, and the limitation exposed by XOR.</p>
        </section>
      </div>
    ),
    note: "Timing: 1 minute. Use the exact course title page. Ask students to predict whether one neuron can learn every binary function.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Course map · Part B",
    title: "This meeting begins the non-symbolic branch of learning",
    content: (
      <SourceExplanation
        alt="Machine Learning Part B overview"
        caption="Course source page 2 · neural networks sit within a broader non-symbolic learning sequence."
        slide={2}
      >
        <div className="m17-overview-grid">
          <article><span>Today</span><strong>artificial neural networks</strong><p>one neuron, one boundary, one learning rule</p></article>
          <article><span>Later</span><strong>unsupervised learning</strong><p>discover structure without target labels</p></article>
          <article><span>Connections</span><strong>evolutionary · reinforcement · deep · online</strong><p>different sources of feedback and adaptation</p></article>
          <article><span>Always</span><strong>issues related to learning</strong><p>representation, evidence, optimization, and evaluation</p></article>
        </div>
      </SourceExplanation>
    ),
    note: "Timing: 1 minute. Preserve every item on course source page 2. Clarify that today's scope is the artificial-neural-network branch, not all topics on the overview.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Learning objectives · Evidence map",
    title: "Model, calculate, update, separate, and critique",
    content: (
      <div className="m17-objectives">
        <article><span>01</span><strong>Model</strong><p>a neuron as z = wᵀx + b followed by an activation</p></article>
        <article><span>02</span><strong>Calculate</strong><p>AND, OR, and a numeric perceptron prediction</p></article>
        <article><span>03</span><strong>Update</strong><p>weights after a correct case or a classification mistake</p></article>
        <article><span>04</span><strong>Explain</strong><p>linear separability, XOR, sigmoid, loss, and gradient descent</p></article>
      </div>
    ),
    note: "Timing: 1 minute. Preview the evidence: logic table, one complete update, a boundary explanation, and an XOR limitation.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Knowledge point 1 · Non-symbolic learning",
    title: "Adapt the parameters instead of rewriting symbolic rules",
    content: (
      <SourceExplanation
        alt="Non-symbolic learning approaches and optimization framing"
        caption="Course source page 3 · adaptive and optimization methods are contrasted with symbolic generalization and specialization."
        reverse
        slide={3}
      >
        <blockquote>Non-symbolic learning changes numeric parameters so that measured performance improves.</blockquote>
        <div className="m17-contrast">
          <article><span>Symbolic</span><strong>change a description</strong><p>generalize, specialize, split, or add a relation</p></article>
          <article><span>Numeric</span><strong>change parameters</strong><p>adjust weights using errors, gradients, or fitness</p></article>
        </div>
        <SearchCallout label="Precision note" tone="amber">
          “Similar to gradient search” is a broad family resemblance. The classic perceptron update used later is mistake-driven, not ordinary smooth gradient descent.
        </SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve adaptive, optimization, evolutionary, fitness, weights, and local search from the source. Correct the over-broad gradient-descent wording without erasing it.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Knowledge point 2 · Neuron abstraction",
    title: "The diagram is an analogy, not a biological simulation",
    content: (
      <SourceExplanation
        alt="Biological neuron beside an artificial neuron"
        caption="Course source page 6 · the biological and artificial diagrams are both knowledge-bearing."
        slide={6}
      >
        <div className="m17-neuron-map">
          <article><span>Signals</span><strong>input vector x</strong><p>measurements from the environment or outputs from other units</p></article>
          <article><span>Strength</span><strong>weight vector w</strong><p>signed influence of each input on the score</p></article>
          <article><span>Integration</span><strong>weighted sum z</strong><p>combine all contributions plus a bias</p></article>
          <article><span>Response</span><strong>activation f(z)</strong><p>transform the score into the unit&apos;s output</p></article>
        </div>
        <SearchCallout label="Do not overclaim" tone="cyan">An artificial neuron borrows an input–integration–output metaphor; it does not reproduce the complexity of a biological neuron.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Point to dendrites, cell body, axon, input arrows, weights, net, and activation. Require students to identify both useful analogy and important mismatch.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Knowledge point 2 · Vector model",
    title: "A neuron computes one score, then applies one activation",
    content: (
      <div className="m17-vector-model">
        <section>
          <span>Scalar form</span>
          <code>z = w₁x₁ + w₂x₂ + ··· + wₙxₙ + b</code>
          <span>Vector form</span>
          <code>z = wᵀx + b</code>
          <span>Output</span>
          <code>a = f(z)</code>
        </section>
        <section>
          <div className="m17-vector-flow">
            <article><strong>x</strong><span>features</span></article><i>×</i>
            <article><strong>w</strong><span>importance + direction</span></article><i>+</i>
            <article><strong>b</strong><span>offset</span></article><i>→</i>
            <article><strong>f</strong><span>activation</span></article>
          </div>
          <SearchCallout label="Threshold convention" tone="amber">
            Either compare wᵀx with a threshold θ, or absorb it into a bias b = −θ and compare wᵀx + b with zero. Do not subtract the same threshold twice.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Translate every source symbol into vector notation. Correct the spelling to threshold. Explain the equivalence between explicit threshold and bias conventions.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Demo · Weighted evidence",
    title: "Weights control influence; the bias moves the decision point",
    content: <WeightedSumLab />,
    note: "Timing: 4 minutes. Move one input, one weight, and the bias separately. Ask which change rotates a boundary and which translates it. Connect to the source examples of house search and college choice.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Knowledge point 3 · Threshold logic",
    title: "McCulloch–Pitts units implement AND and OR by changing the bias",
    content: (
      <SourceExplanation
        alt="McCulloch-Pitts neuron implementations of AND and OR with truth tables"
        caption="Course source page 7 · full logic diagrams, bias weights, threshold function, and truth tables."
        reverse
        slide={7}
      >
        <div className="m17-logic-cards">
          <article><span>AND</span><code>z = x + y − 2</code><p>Only (1,1) reaches z ≥ 0.</p></article>
          <article><span>OR</span><code>z = x + y − 1</code><p>Any input containing a 1 reaches z ≥ 0.</p></article>
        </div>
        <SearchCallout label="Key idea" tone="green">The activation rule stays fixed. Changing weights or bias changes the boundary and therefore the Boolean function.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve the source's 1943 model, both diagrams, and both truth tables. Ask the source question: weights or activation? Here the decisive difference is the bias.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Demo · Logic neuron",
    title: "Run all four inputs through the same threshold rule",
    content: <LogicGateLab />,
    note: "Timing: 3 minutes. Students predict net and output before toggling each input. Visit all four rows for AND, then change only the bias and repeat for OR.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Check for understanding · Representation",
    title: "Which parameter change turns AND into OR?",
    content: (
      <SearchQuickCheck
        correct={1}
        explanation="With w₁ = w₂ = 1 and step(net ≥ 0), changing b from −2 to −1 moves the boundary so either single positive input activates the unit."
        options={[
          "Change both input weights from 1 to 0",
          "Change the bias from −2 to −1",
          "Replace the step function with the identity",
          "Remove the constant input",
        ]}
        question="Keep the step activation and weights w₁ = w₂ = 1. What converts AND to OR?"
      />
    ),
    note: "Timing: 3 minutes. Poll before students select. Require the explanation in terms of the boundary, not memorization of the two formulas.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Knowledge point 4 · From logic to learning",
    title: "A learning problem asks the data to determine the weights",
    content: (
      <SourceExplanation
        alt="Training data and questions about using a McCulloch-Pitts neuron for prediction"
        caption="Course source page 8 · the complete 10-row labeled data set and all three learning questions."
        slide={8}
      >
        <blockquote>Which part of the fixed logic neuron must change so it can classify these labeled numeric examples?</blockquote>
        <div className="m17-learning-bridge">
          <article><span>Given</span><strong>examples (x, t)</strong><p>two features and a binary class label</p></article>
          <article><span>Learn</span><strong>w and b</strong><p>a boundary that predicts the supplied labels</p></article>
          <article><span>Use</span><strong>f(wᵀx + b)</strong><p>classify a new point whose target is unknown</p></article>
        </div>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve all three source questions. Distinguish solving a hand-designed logic function from learning a classifier from examples.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Knowledge point 4 · Training evidence",
    title: "Every row pairs a feature vector with a desired class",
    content: <TrainingDataStudio />,
    note: "Timing: 3 minutes. Select one low-valued positive point and one high-valued negative point. Ask which information is available during training and which remains at prediction time.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Knowledge point 5 · Perceptron rule",
    title: "Predict first; update only when the prediction is wrong",
    content: (
      <SourceExplanation
        alt="Perceptron learning rule, network diagram, and algorithm"
        caption="Course source page 9 · activation, weight adjustment, and the complete repeat-until-converged procedure."
        reverse
        slide={9}
      >
        <div className="m17-formula-stack">
          <code>z = wᵀx + b</code>
          <code>a = +1 if z ≥ 0; −1 otherwise</code>
          <code>w ← w + η(t − a)x</code>
          <code>b ← b + η(t − a)</code>
        </div>
        <SearchCallout label="Date nuance" tone="amber">
          Rosenblatt introduced the perceptron in 1957–1958. The source&apos;s 1962 date corresponds to his book <em>Principles of Neurodynamics</em>, not the first introduction.
        </SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Read each source variable: learning rate, desired target, current output, input component, and next weight. State the Rosenblatt date nuance explicitly.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Knowledge point 5 · Algorithm",
    title: "One epoch processes every example; convergence may require many epochs",
    content: (
      <div className="m17-algorithm">
        <ol>
          <li><span>1</span><div><strong>Initialize</strong><p>Choose w, b, and a learning rate η &gt; 0.</p></div></li>
          <li><span>2</span><div><strong>Score</strong><p>For one example, compute z = wᵀx + b and a = sign(z).</p></div></li>
          <li><span>3</span><div><strong>Compare</strong><p>If t = a, keep the parameters. Otherwise apply the update.</p></div></li>
          <li><span>4</span><div><strong>Repeat</strong><p>Cycle through the training set until an epoch has no mistakes—or stop at a preset limit.</p></div></li>
        </ol>
        <section>
          <h3>Perceptron convergence theorem</h3>
          <p>If the finite training set is linearly separable and η &gt; 0, the algorithm reaches a separating solution in finitely many updates.</p>
          <SearchCallout label="When it does not converge" tone="amber">If no linear separator exists, the basic perceptron can keep making updates. A stopping rule is therefore part of an implementation.</SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Define an epoch and the practical stopping rule. Keep the theorem conditional: finite, linearly separable data and positive learning rate.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Worked example · Complete data",
    title: "The source example starts with ten labeled points and three weights",
    content: (
      <SourceExplanation
        alt="Complete numeric perceptron training example"
        caption="Course source page 10 · full data table, neuron diagram, initial weights, learning rate, and first updates."
        slide={10}
      >
        <div className="m17-example-setup">
          <article><span>Augmented input</span><code>x̃ = [x₁, x₂, 1]</code></article>
          <article><span>Initial weights</span><code>w = [0.75, 0.50, −0.60]</code></article>
          <article><span>Learning rate</span><code>η = 0.20</code></article>
          <article><span>Decision</span><code>a = sign(wᵀx̃)</code></article>
        </div>
        <SearchCallout label="Consistent notation" tone="cyan">
          In the expanded source calculation, −0.60 is used as the bias weight on the constant input 1; the threshold comparison is therefore against zero.
        </SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 4 minutes. Keep the complete table visible. Resolve the source's threshold/bias notation by using the augmented vector convention actually shown in its arithmetic.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Worked example · Perceptron update",
    title: "A correct case does nothing; a mistake moves the boundary",
    content: <PerceptronUpdateLab startAt={0} />,
    note: "Timing: 4 minutes. Work all three tabs: the zero update, the negative-class correction, and the positive-class correction. Preserve the source numbers, but use approximately −12.85 for the third score because direct arithmetic differs slightly from the source's −12.84 rounding.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Knowledge point 6 · Geometry",
    title: "The learned equation is both a score and a line",
    content: (
      <SourceExplanation
        alt="Converged perceptron separating the training data"
        caption="Course source page 11 · complete plot, converged weights, boundary equation, and symbolic-learning comparison question."
        reverse
        slide={11}
      >
        <div className="m17-geometry">
          <code>−1.3x₁ − 1.1x₂ + 10.9 = 0</code>
          <article><span>On the line</span><p>wᵀx + b = 0</p></article>
          <article><span>Positive side</span><p>wᵀx + b ≥ 0</p></article>
          <article><span>Negative side</span><p>wᵀx + b &lt; 0</p></article>
        </div>
        <SearchCallout label="Source consistency note" tone="amber">
          The source page mentions both 10 and about 500 iterations. Treat the displayed weights and separating equation as the result; iteration count depends on initialization, order, and what is counted.
        </SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Trace the line and both half-planes. Explicitly flag the two iteration counts so students do not treat either as an algorithm guarantee.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Demo · Decision boundary",
    title: "Move the line and count which training points change sides",
    content: <BoundaryExplorer />,
    note: "Timing: 3 minutes. Compare all three boundaries. Require students to connect an error count to point-side membership, not visual closeness alone.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Compare · Symbolic and numeric learning",
    title: "The representation determines what the learner can express",
    content: (
      <div className="m17-compare">
        <section>
          <span>Winston / decision tree</span>
          <h3>Explicit symbolic structure</h3>
          <ul>
            <li>nodes, relations, tests, and branches</li>
            <li>generalize, specialize, or add a split</li>
            <li>often directly inspectable as rules</li>
          </ul>
        </section>
        <section>
          <span>Perceptron</span>
          <h3>Numeric linear boundary</h3>
          <ul>
            <li>a real-valued weight for every feature</li>
            <li>mistake-driven parameter updates</li>
            <li>compact geometry but limited to a hyperplane</li>
          </ul>
        </section>
        <SearchCallout label="Answer the source question" tone="cyan">
          Both learn a classifier from labeled examples, but they search different hypothesis spaces with different operators and explanations.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 2 minutes. Use the source page 11 question. Have pairs identify representation, operator, hypothesis space, and explanation form for each method.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Knowledge point 7 · Linear separability",
    title: "XOR places same-class points on opposite corners",
    content: (
      <SourceExplanation
        alt="XOR truth table, plotted points, and contradictory threshold constraints"
        caption="Course source page 12 · the full truth table, geometry, equations, and historical limitation statement."
        slide={12}
      >
        <blockquote>No single straight line can place both XOR-positive corners on one side and both XOR-negative corners on the other.</blockquote>
        <div className="m17-xor-constraints">
          <code>(0,0) → 0</code><code>(1,0) → 1</code>
          <code>(0,1) → 1</code><code>(1,1) → 0</code>
        </div>
        <SearchCallout label="Precise claim" tone="amber">
          A <strong>single linear-threshold unit</strong> cannot represent XOR. A multilayer network with a nonlinear hidden layer can.
        </SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 4 minutes. Preserve the truth table and constraint argument. Qualify the historical wording: the impossibility applies to one linear-threshold unit, not perceptron networks in general.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Guided practice · XOR",
    title: "Try three lines, then justify why none can separate XOR",
    content: <XorBoundaryLab />,
    note: "Timing: 3 minutes. Students must test vertical, horizontal, and diagonal candidates before selecting no single line. Ask how a hidden layer can create intermediate regions.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Knowledge point 8 · Smooth activation",
    title: "Sigmoid replaces a hard jump with a differentiable S-curve",
    content: (
      <SourceExplanation
        alt="Hard threshold and sigmoid activation curves with slope parameter"
        caption="Course source page 13 · complete formula, three plots, slope parameter, and useful properties."
        reverse
        slide={13}
      >
        <div className="m17-sigmoid">
          <code>σ(z) = 1 / (1 + e^(−λz))</code>
          <article><span>Nonlinear</span><p>the output does not grow as a straight line</p></article>
          <article><span>Continuous</span><p>small score changes produce small output changes</p></article>
          <article><span>Differentiable</span><p>its slope can support gradient-based training</p></article>
          <article><span>Bounded</span><p>for finite z, σ(z) lies in the open interval (0, 1)</p></article>
        </div>
        <SearchCallout label="Range correction" tone="amber">Sigmoid approaches 0 and 1 asymptotically; it does not equal either endpoint for any finite input.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve the source's S-shape, continuity, derivative, lambda slope, and normalization ideas. Correct the range from 0–1 to the open interval (0,1) for finite inputs.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Textbook / modern supplement · Activations",
    title: "Activation choice changes range, smoothness, and gradient behavior",
    content: <ActivationExplorer />,
    note: "Timing: 3 minutes. Compare step, sigmoid, tanh, and ReLU. Ask which are bounded, zero-centered, differentiable everywhere, and susceptible to saturation.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Textbook / modern supplement · Training",
    title: "Modern neural learning connects a loss to gradients through the network",
    content: <LossDescentLab />,
    note: "Timing: 3 minutes. Take several gradient steps on the toy objective. Then distinguish smooth-loss gradient descent and backpropagation from the classic perceptron mistake update.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative assessment · Readings",
    title: "From weighted evidence to an honest claim about capacity",
    content: (
      <div className="m17-exit">
        <section>
          <span>Exit ticket · 6 minutes</span>
          <ol>
            <li><strong>Calculate:</strong> For x = [1,0], w = [1,1], b = −1, find z and the step output.</li>
            <li><strong>Update:</strong> State what happens when t = a and when t ≠ a.</li>
            <li><strong>Explain:</strong> Why can one perceptron represent AND but not XOR?</li>
            <li><strong>Correct:</strong> Explain one nuance about threshold/bias, Rosenblatt&apos;s date, sigmoid range, or gradient descent.</li>
          </ol>
        </section>
        <section>
          <span>Continue the learning</span>
          <h3>Required and supplemental reading</h3>
          <ul>
            <li>Course source: L10 Machine Learning Part B, pages 1–3 and 6–13.</li>
            <li>George F. Luger, <em>Artificial Intelligence</em>, 6th ed., neural-network learning section.</li>
            <li>Russell &amp; Norvig, <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed., Chapter 18.</li>
            <li>Rosenblatt, <em>Principles of Neurodynamics</em>, 1962.</li>
            <li>Goodfellow, Bengio &amp; Courville, <em>Deep Learning</em>, Chapters 6–8.</li>
          </ul>
          <SearchCallout label="One-sentence synthesis" tone="green">A perceptron learns a linear decision boundary by changing weights after mistakes; nonlinear multilayer models expand what boundaries can be represented.</SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 6 minutes. Students complete and submit the four-part assessment. Planned timing across all 25 pages totals 75 minutes.",
    sourceSlides: [],
  },
];

export function Meeting17Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 9 · Meeting 17"
      meetingTitle="Neural Networks I: Perceptrons and Linear Boundaries"
      resolveSourceReference={resolveMeeting17SourceReference}
      slides={slides}
      sourceCollectionLabel={SOURCE_DECK_LABEL}
    />
  );
}
