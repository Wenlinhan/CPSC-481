"use client";

import { useMemo, useState } from "react";
import "../styles/meeting18.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l10-neural-networks";
const SOURCE_DECK_LABEL = "L10 Machine Learning · Part B";

function resolveMeeting18SourceReference(sourceSlide: number) {
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
      className={`m18-source-frame ${className}`.trim()}
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
    <div className={`m18-source-explain ${reverse ? "reverse" : ""}`}>
      <SourceFrame alt={alt} caption={caption} slide={slide} />
      <section>{children}</section>
    </div>
  );
}

function BackpropNumericLab() {
  const [x, setX] = useState(0.8);
  const [weight, setWeight] = useState(0.4);
  const [bias, setBias] = useState(-0.1);
  const [target, setTarget] = useState(1);
  const [rate, setRate] = useState(0.5);

  const values = useMemo(() => {
    const net = weight * x + bias;
    const activation = 1 / (1 + Math.exp(-net));
    const loss = 0.5 * (target - activation) ** 2;
    const derivative = activation * (1 - activation);
    const gradient = (activation - target) * derivative * x;
    const delta = (target - activation) * derivative;
    const change = rate * delta * x;
    return {
      activation,
      change,
      delta,
      derivative,
      gradient,
      loss,
      net,
      nextWeight: weight + change,
    };
  }, [bias, rate, target, weight, x]);

  return (
    <div className="m18-numeric-lab">
      <section className="m18-lab-controls">
        <span>One sigmoid output neuron</span>
        <label>
          Input x = {x.toFixed(1)}
          <input max="1" min="0" onChange={event => setX(Number(event.target.value))} step="0.1" type="range" value={x} />
        </label>
        <label>
          Weight w = {weight.toFixed(1)}
          <input max="2" min="-2" onChange={event => setWeight(Number(event.target.value))} step="0.1" type="range" value={weight} />
        </label>
        <label>
          Bias b = {bias.toFixed(1)}
          <input max="1" min="-1" onChange={event => setBias(Number(event.target.value))} step="0.1" type="range" value={bias} />
        </label>
        <label>
          Target t
          <select onChange={event => setTarget(Number(event.target.value))} value={target}>
            <option value="1">1</option>
            <option value="0">0</option>
          </select>
        </label>
        <label>
          Learning rate η = {rate.toFixed(1)}
          <input max="1" min="0.1" onChange={event => setRate(Number(event.target.value))} step="0.1" type="range" value={rate} />
        </label>
      </section>

      <section className="m18-computation-graph" aria-label="Interactive computational graph">
        <div className="graph-forward">
          <article><span>Input</span><strong>{x.toFixed(2)}</strong><small>x</small></article>
          <i>× w</i>
          <article><span>Net input</span><strong>{values.net.toFixed(3)}</strong><small>wx + b</small></article>
          <i>σ</i>
          <article><span>Activation</span><strong>{values.activation.toFixed(3)}</strong><small>a = σ(net)</small></article>
          <i>compare t</i>
          <article><span>Loss</span><strong>{values.loss.toFixed(4)}</strong><small>½(t − a)²</small></article>
        </div>
        <div className="graph-backward">
          <article><span>Local slope</span><strong>{values.derivative.toFixed(3)}</strong><small>σ′ = a(1 − a)</small></article>
          <article><span>Output δ</span><strong>{values.delta.toFixed(3)}</strong><small>(t − a)σ′</small></article>
          <article><span>Gradient</span><strong>{values.gradient.toFixed(3)}</strong><small>∂L/∂w</small></article>
          <article className="next"><span>Updated weight</span><strong>{values.nextWeight.toFixed(3)}</strong><small>w + ηδx</small></article>
        </div>
      </section>
    </div>
  );
}

const algorithmStages = [
  {
    label: "Initialize",
    source: "Step 1",
    detail: "Choose small weights and biases. Symmetry must be broken so hidden units can learn different features.",
  },
  {
    label: "Forward",
    source: "Steps 3–6",
    detail: "For each example, compute net inputs and activations layer by layer from input to output.",
  },
  {
    label: "Output error",
    source: "Steps 7–8",
    detail: "Compare each output activation with its target and form the output-layer error signal.",
  },
  {
    label: "Hidden error",
    source: "Steps 9–10",
    detail: "Use the chain rule: send downstream error through connecting weights and the hidden activation derivative.",
  },
  {
    label: "Update",
    source: "Steps 11–16",
    detail: "Adjust every weight and bias, then repeat until a chosen stopping condition is satisfied.",
  },
];

function AlgorithmWalkthrough() {
  const [active, setActive] = useState(0);
  const item = algorithmStages[active];
  return (
    <div className="m18-algorithm-walkthrough">
      <nav aria-label="Backpropagation algorithm stages">
        {algorithmStages.map((stage, index) => (
          <button
            className={active === index ? "active" : ""}
            key={stage.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {stage.label}
          </button>
        ))}
      </nav>
      <section>
        <span>{item.source}</span>
        <h3>{item.label}</h3>
        <p>{item.detail}</p>
        <div className={`m18-flow stage-${active}`}>
          <i>data</i><b>forward</b><i>loss</i><b>backward</b><i>update</i>
        </div>
      </section>
    </div>
  );
}

const autodiffSteps = [
  {
    label: "Build graph",
    code: "logits = model(x)",
    detail: "Tensor operations record how each result depends on earlier values.",
  },
  {
    label: "Create scalar loss",
    code: "loss = criterion(logits, y)",
    detail: "Training needs a scalar objective whose gradient can be propagated.",
  },
  {
    label: "Reverse accumulation",
    code: "loss.backward()",
    detail: "Autodiff applies the chain rule from the loss back to every trainable leaf tensor.",
  },
  {
    label: "Update parameters",
    code: "optimizer.step()",
    detail: "The optimizer uses stored gradients; it is separate from gradient computation.",
  },
];

function AutodiffExplorer() {
  const [active, setActive] = useState(0);
  return (
    <div className="m18-autodiff">
      <nav>
        {autodiffSteps.map((step, index) => (
          <button className={active === index ? "active" : ""} key={step.label} onClick={() => setActive(index)} type="button">
            {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <span>Modern supplement · stage {active + 1}</span>
        <h3>{autodiffSteps[active].label}</h3>
        <code>{autodiffSteps[active].code}</code>
        <p>{autodiffSteps[active].detail}</p>
      </section>
      <div className="m18-autodiff-graph" aria-label="Reverse-mode automatic differentiation graph">
        {["x", "Linear", "ReLU", "Linear", "Loss"].map((node, index) => (
          <div className={index <= active ? "active" : ""} key={`${node}-${index}`}>
            <b>{node}</b>{index < 4 && <i>→</i>}
          </div>
        ))}
        <strong>gradients flow ←</strong>
      </div>
    </div>
  );
}

const networkOptions = [
  {
    name: "MLP",
    topology: "Dense feed-forward layers",
    encoding: "Flat feature vector",
    example: "tabular classification",
    supervision: "usually supervised",
  },
  {
    name: "CNN",
    topology: "Local filters + shared weights",
    encoding: "Spatial grid",
    example: "image recognition",
    supervision: "supervised or self-supervised",
  },
  {
    name: "RNN",
    topology: "Recurrent state connections",
    encoding: "Ordered sequence",
    example: "time-series forecasting",
    supervision: "supervised or self-supervised",
  },
  {
    name: "Autoencoder",
    topology: "Encoder → bottleneck → decoder",
    encoding: "Learned latent vector",
    example: "representation learning",
    supervision: "unsupervised / self-supervised",
  },
];

function NetworkExplorer() {
  const [active, setActive] = useState(0);
  const item = networkOptions[active];
  return (
    <div className="m18-network-explorer">
      <nav>
        {networkOptions.map((network, index) => (
          <button className={active === index ? "active" : ""} key={network.name} onClick={() => setActive(index)} type="button">
            {network.name}
          </button>
        ))}
      </nav>
      <section>
        <div className={`m18-network-viz kind-${active}`} aria-label={`${item.name} topology diagram`}>
          <i /><i /><i /><i /><i /><i />
        </div>
        <article><span>Topology</span><strong>{item.topology}</strong></article>
        <article><span>Encoding</span><strong>{item.encoding}</strong></article>
        <article><span>Example</span><strong>{item.example}</strong></article>
        <article><span>Learning signal</span><strong>{item.supervision}</strong></article>
      </section>
    </div>
  );
}

const pytorchStages = [
  {
    label: "Tensors + model",
    code: `torch.manual_seed(7)
x = torch.tensor([[0., 0.], [0., 1.],
                  [1., 0.], [1., 1.]])
y = torch.tensor([[0.], [1.], [1.], [0.]])
model = nn.Sequential(
    nn.Linear(2, 8), nn.ReLU(), nn.Linear(8, 1)
)`,
    check: "x: [4, 2] · y: [4, 1] · logits: [4, 1]",
  },
  {
    label: "Loss + optimizer",
    code: `criterion = nn.BCEWithLogitsLoss()
optimizer = torch.optim.Adam(
    model.parameters(), lr=0.03
)`,
    check: "Use raw logits with BCEWithLogitsLoss; do not add sigmoid inside the model.",
  },
  {
    label: "Training step",
    code: `model.train()
optimizer.zero_grad()
logits = model(x)
loss = criterion(logits, y)
loss.backward()
optimizer.step()`,
    check: "Order: clear → forward → loss → backward → step.",
  },
  {
    label: "Evaluation",
    code: `model.eval()
with torch.no_grad():
    probability = torch.sigmoid(model(x))
    prediction = (probability >= 0.5).float()`,
    check: "eval() changes layer behavior; no_grad() disables gradient recording.",
  },
];

function PyTorchLab() {
  const [active, setActive] = useState(0);
  return (
    <div className="m18-pytorch-lab">
      <nav>
        {pytorchStages.map((stage, index) => (
          <button className={active === index ? "active" : ""} key={stage.label} onClick={() => setActive(index)} type="button">
            <span>{index + 1}</span>{stage.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Modern PyTorch training lab</span>
        <pre><code>{pytorchStages[active].code}</code></pre>
        <p>{pytorchStages[active].check}</p>
      </section>
    </div>
  );
}

const debugCases = [
  {
    label: "Shape mismatch",
    symptom: "Target size [32] differs from input size [32, 1].",
    fix: "Make the target shape [32, 1] with y = y.float().unsqueeze(1), or intentionally flatten both tensors.",
  },
  {
    label: "Growing gradients",
    symptom: "Each batch seems to include gradients from earlier batches.",
    fix: "Call optimizer.zero_grad() before loss.backward(); PyTorch accumulates gradients by default.",
  },
  {
    label: "Unstable validation",
    symptom: "Dropout remains active and validation varies unexpectedly.",
    fix: "Call model.eval() for validation, then model.train() when the next training epoch begins.",
  },
  {
    label: "Double sigmoid",
    symptom: "Learning is slow with Sigmoid followed by BCEWithLogitsLoss.",
    fix: "Remove the model's Sigmoid. BCEWithLogitsLoss combines a numerically stable sigmoid and binary cross-entropy.",
  },
];

function ShapeDebugger() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = debugCases[active];
  return (
    <div className="m18-debugger">
      <nav>
        {debugCases.map((debugCase, index) => (
          <button
            className={active === index ? "active" : ""}
            key={debugCase.label}
            onClick={() => {
              setActive(index);
              setRevealed(false);
            }}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <span>Debug case {active + 1}</span>
        <h3>{item.label}</h3>
        <code>{item.symptom}</code>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide repair" : "Reveal repair"}
        </button>
        {revealed && <p>{item.fix}</p>}
      </section>
      <aside>
        <strong>Shape contract</strong>
        <div><span>x</span><code>[batch, features]</code></div>
        <div><span>logits</span><code>[batch, 1]</code></div>
        <div><span>y</span><code>[batch, 1]</code></div>
      </aside>
    </div>
  );
}

function TrainingCurveLab() {
  const [epoch, setEpoch] = useState(8);
  const trainLoss = Math.max(0.06, 0.88 * Math.exp(-epoch / 7));
  const validationLoss = 0.13 + 0.7 * Math.exp(-epoch / 5) + Math.max(0, epoch - 12) * 0.025;
  const overfit = epoch > 14;
  return (
    <div className="m18-training-lab">
      <section>
        <span>Epoch explorer</span>
        <label>
          Epoch {epoch}
          <input max="24" min="1" onChange={event => setEpoch(Number(event.target.value))} type="range" value={epoch} />
        </label>
        <div className="m18-loss-bars">
          <article><strong>train</strong><i style={{ height: `${Math.max(8, trainLoss * 180)}px` }} /><span>{trainLoss.toFixed(3)}</span></article>
          <article><strong>validation</strong><i className={overfit ? "warn" : ""} style={{ height: `${Math.max(8, validationLoss * 180)}px` }} /><span>{validationLoss.toFixed(3)}</span></article>
        </div>
      </section>
      <div>
        <span>{overfit ? "Generalization warning" : "Training status"}</span>
        <h3>{overfit ? "Training improves while validation worsens." : "Both losses still support continued training."}</h3>
        <p>{overfit ? "Restore the checkpoint with the lowest validation loss; do not select the final epoch automatically." : "Track validation evidence and save a checkpoint whenever it improves."}</p>
        <ul>
          <li>Seed Python, NumPy, and PyTorch where reproducibility matters.</li>
          <li>Save model state, optimizer state, epoch, metrics, and configuration.</li>
          <li>Keep the test set untouched until the final report.</li>
        </ul>
      </div>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Neural networks · Part B",
    title: "Backpropagation and a modern training loop",
    subtitle: "From multilayer networks and the delta rule to computational graphs, autodiff, and PyTorch.",
    content: (
      <div className="m18-cover">
        <SourceFrame
          alt="Complete multilayer neural network with backpropagation course-source page"
          caption="Course source page 14 · multilayer architecture, training goal, mechanism, caveats, and applications."
          slide={14}
        />
        <section>
          <span>Meeting 18 · 75 minutes</span>
          <h3>How does error at the output teach a hidden layer?</h3>
          <p>Follow one prediction forward, one gradient backward, and one parameter update into a reproducible training workflow.</p>
        </section>
      </div>
    ),
    note: "Timing: 1 minute. Open with the complete source page. The diagram and wording are both instructional content, so invite students to enlarge it.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Learning objectives · Knowledge map",
    title: "Trace, derive, compute, implement, and diagnose",
    content: (
      <div className="m18-objectives">
        <article><span>01</span><strong>Trace</strong><p>activations forward and error signals backward through a multilayer network</p></article>
        <article><span>02</span><strong>Derive</strong><p>output and hidden gradients from the chain rule and sigmoid derivative</p></article>
        <article><span>03</span><strong>Implement</strong><p>a correct PyTorch train/eval loop with explicit tensor-shape contracts</p></article>
        <article><span>04</span><strong>Evaluate</strong><p>convergence claims, overfitting, reproducibility, and checkpoint evidence</p></article>
      </div>
    ),
    note: "Timing: 1 minute. Assessment evidence will include a numeric update, a hidden-gradient explanation, a repaired training loop, and an exit ticket.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 · Multilayer architecture",
    title: "Hidden units compose intermediate representations",
    content: (
      <SourceExplanation
        alt="Complete multilayer architecture with input, hidden, output, bias, and weights"
        caption="Course source page 14 · every connection and layer remains visible in the full 4:3 render."
        slide={14}
      >
        <div className="m18-layer-map">
          <article><span>Input layer</span><strong>x₁ … x₄ plus bias</strong><p>encodes one example</p></article>
          <article><span>Hidden layer</span><strong>learned intermediate features</strong><p>not directly supervised</p></article>
          <article><span>Output layer</span><strong>a prediction</strong><p>compared with a target</p></article>
          <article><span>Weights</span><strong>trainable connections</strong><p>control signal strength</p></article>
        </div>
        <SearchCallout label="Representation + applications" tone="cyan">A hidden unit is “hidden” because its value is internal—not because its computation is unknowable. Learned hidden representations support image and face recognition, speech, forecasting, and many other real-world tasks.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Point to every labeled source element. Connect the face-recognition note to learned intermediate features without claiming individual hidden units always have human-readable meanings.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Knowledge point 1 · Learning objective",
    title: "Training searches for parameters that reduce a loss",
    content: (
      <SourceExplanation
        alt="Backpropagation goal, forward mechanism, caveats, and application statement"
        caption="Course source page 14 · goal and mechanism preserved; the convergence claim is qualified at right."
        reverse
        slide={14}
      >
        <ol className="m18-process">
          <li><span>1</span><strong>Forward</strong><p>compute activations and a prediction</p></li>
          <li><span>2</span><strong>Measure</strong><p>turn prediction error into a scalar loss</p></li>
          <li><span>3</span><strong>Backward</strong><p>compute each parameter&apos;s contribution to loss</p></li>
          <li><span>4</span><strong>Update</strong><p>take a small loss-reducing step</p></li>
        </ol>
        <SearchCallout label="Caveats + correction" tone="amber">The source caveats remain important: training may miss the best weights, depends on initialization, and can be slow. In addition, gradient descent is not guaranteed to reach the “nearest local minimum”; non-convex surfaces include saddles, plateaus, and optimizer-dependent paths.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve the source wording, then explicitly correct its guarantee. A small learning rate and repeated updates do not by themselves prove convergence to a particular minimum.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Knowledge point 2 · Delta rule",
    title: "A weight update combines error, local slope, and input",
    content: (
      <SourceExplanation
        alt="Complete delta-rule and error-surface course-source page"
        caption="Course source page 15 · delta rule, learning rate, gradient, cumulative error surface, and source questions."
        slide={15}
      >
        <div className="m18-equation-stack">
          <code>Δwᵢⱼ = η(tⱼ − aⱼ) f′(netⱼ) xᵢ</code>
          <article><span>Error signal</span><strong>(tⱼ − aⱼ)</strong><p>which direction should the output move?</p></article>
          <article><span>Local sensitivity</span><strong>f′(netⱼ)</strong><p>how responsive is this unit?</p></article>
          <article><span>Upstream value</span><strong>xᵢ</strong><p>how much did this connection contribute?</p></article>
          <article><span>Step size</span><strong>η</strong><p>how far should the update move?</p></article>
        </div>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Read every factor aloud. Note that the source uses l for learning rate; this lesson also uses the common symbol eta. Rumelhart et al. 1986 is retained.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Knowledge point 2 · Error surface",
    title: "The negative gradient is a local direction, not a destination guarantee",
    content: (
      <SourceExplanation
        alt="Delta-rule error surface with old and new weight positions"
        caption="Course source page 15 · the curve represents cumulative data-set error as a function of weights."
        reverse
        slide={15}
      >
        <div className="m18-gradient-notes">
          <article><span>Gradient</span><strong>∇L</strong><p>a vector of partial derivatives—the local slope in every parameter direction</p></article>
          <article><span>Descent step</span><strong>θ ← θ − η∇L</strong><p>move opposite the local uphill direction</p></article>
          <article><span>Reality</span><strong>high-dimensional and non-convex</strong><p>mini-batch noise, momentum, initialization, and geometry alter the path</p></article>
        </div>
        <SearchQuickCheck
          correct={2}
          explanation="The gradient is local. In a non-convex landscape it does not identify a unique destination or guarantee the nearest minimum."
          options={[
            "It finds the globally best weights.",
            "It always reaches the nearest local minimum.",
            "It gives a local steepest-ascent direction.",
            "It makes the loss decrease after every mini-batch.",
          ]}
          question="What can the gradient itself tell us?"
        />
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Use the source curve as a one-dimensional intuition only, then surface the limits of that picture with the quick check.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Knowledge point 3 · Output-layer notation",
    title: "Keep layer indices and signal directions explicit",
    content: (
      <SourceExplanation
        alt="Complete output-node gradient derivation with I, J, K layers and subscript notation"
        caption="Course source page 16 · full layer diagram, error/activation directions, notation, and derivation."
        slide={16}
      >
        <div className="m18-notation">
          <article><span>I</span><strong>input layer</strong><p>aᵢ enters a hidden unit</p></article>
          <article><span>J</span><strong>hidden layer</strong><p>aⱼ feeds an output unit</p></article>
          <article><span>K</span><strong>output layer</strong><p>aₖ is compared with tₖ</p></article>
          <article><span>wᵢⱼ</span><strong>input → hidden</strong><p>weight into unit j</p></article>
          <article><span>wⱼₖ</span><strong>hidden → output</strong><p>weight into unit k</p></article>
          <article><span>net, η</span><strong>net input, learning rate</strong><p>activation argument and step scale</p></article>
        </div>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve the complete page because the subscript conventions and the arrows are knowledge points. Trace activation downward and error upward.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Knowledge point 3 · Output gradient",
    title: "At an output unit, the target supplies the error directly",
    content: (
      <SourceExplanation
        alt="Complete chain-rule derivation for an output-layer weight"
        caption="Course source page 16 · squared error, sigmoid derivative, and hidden-to-output delta rule."
        reverse
        slide={16}
      >
        <div className="m18-derivation">
          <code>∂L/∂wⱼₖ = ∂L/∂aₖ · ∂aₖ/∂netₖ · ∂netₖ/∂wⱼₖ</code>
          <code>= (aₖ − tₖ) · aₖ(1 − aₖ) · aⱼ</code>
          <code>δₖ = (tₖ − aₖ)aₖ(1 − aₖ)</code>
          <code>wⱼₖ ← wⱼₖ + ηδₖaⱼ</code>
        </div>
        <SearchCallout label="Sign convention" tone="cyan">The source defines δ using (target − activation), so its update uses “+ ηδa.” If δ used the loss derivative (activation − target), gradient descent would use a minus sign.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Derive the three chain-rule factors. Emphasize that the two common delta sign conventions are equivalent only when the update sign changes consistently.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Worked demo · One output weight",
    title: "Compute every link in the chain before updating",
    content: <BackpropNumericLab />,
    note: "Timing: 3 minutes. Set target to zero and one. Ask students to predict the update direction before reading the calculated gradient and next weight.",
    sourceSlides: [15, 16],
  },
  {
    eyebrow: "Knowledge point 4 · Hidden-layer notation",
    title: "A hidden unit has no target; its error arrives through downstream paths",
    content: (
      <SourceExplanation
        alt="Complete hidden-node gradient derivation with full network and notation"
        caption="Course source page 17 · full layer diagram, notation, downstream sum, and input-to-hidden delta rule."
        slide={17}
      >
        <div className="m18-hidden-idea">
          <article><span>Output unit k</span><strong>target tₖ is observed</strong><p>error begins at the supervised output</p></article>
          <article><span>Hidden unit j</span><strong>no target tⱼ exists</strong><p>credit or blame must be aggregated from every downstream output</p></article>
          <article><span>Connection i → j</span><strong>update uses aᵢ</strong><p>the presynaptic activation is still the final chain-rule factor</p></article>
        </div>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve the full source diagram and notation. Ask why assigning an independent target to each hidden unit would change the learning problem.",
    sourceSlides: [17],
  },
  {
    eyebrow: "Knowledge point 4 · Hidden gradient",
    title: "The hidden signal is a weighted sum of downstream signals",
    content: (
      <SourceExplanation
        alt="Complete chain-rule derivation for a hidden-layer weight"
        caption="Course source page 17 · error propagation through all output nodes and the hidden sigmoid derivative."
        reverse
        slide={17}
      >
        <div className="m18-derivation hidden">
          <code>∂L/∂aⱼ = Σₖ (∂L/∂netₖ) wⱼₖ</code>
          <code>δⱼ = aⱼ(1 − aⱼ) Σₖ δₖwⱼₖ</code>
          <code>∂L/∂wᵢⱼ = −δⱼaᵢ</code>
          <code>wᵢⱼ ← wᵢⱼ + ηδⱼaᵢ</code>
        </div>
        <SearchCallout label="Chain-rule interpretation" tone="green">Each path from hidden unit j to the loss contributes one product of local derivatives. Backpropagation sums those path contributions without expanding every path separately.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Follow one path j to k, then add the second output path. Correct the source label that accidentally says output layer for the input-to-hidden weight.",
    sourceSlides: [17],
  },
  {
    eyebrow: "Compare · Output versus hidden gradients",
    title: "Same chain rule, different source of the error signal",
    content: (
      <div className="m18-compare">
        <article>
          <span>Output unit k</span>
          <strong>δₖ = (tₖ − aₖ)f′(netₖ)</strong>
          <p>The target is directly available. Error measures the output discrepancy.</p>
          <code>Δwⱼₖ = ηδₖaⱼ</code>
        </article>
        <article>
          <span>Hidden unit j</span>
          <strong>δⱼ = f′(netⱼ)Σₖδₖwⱼₖ</strong>
          <p>No hidden target exists. Downstream error is weighted and summed.</p>
          <code>Δwᵢⱼ = ηδⱼaᵢ</code>
        </article>
        <SearchQuickCheck
          correct={1}
          explanation="A hidden unit receives error through every downstream connection, so it aggregates weighted downstream deltas before applying its local derivative."
          options={[
            "Its target is stored in the training set.",
            "It sums weighted downstream error signals.",
            "It copies the largest output error.",
            "It updates only after the output weights converge.",
          ]}
          question="How does a hidden unit obtain its learning signal?"
        />
      </div>
    ),
    note: "Timing: 3 minutes. Students should be able to state the one structural difference: direct target discrepancy versus weighted downstream sum.",
    sourceSlides: [16, 17],
  },
  {
    eyebrow: "Knowledge point 5 · Complete algorithm",
    title: "The source algorithm makes the forward, backward, and update loops explicit",
    content: (
      <div className="m18-algorithm-source">
        <SourceFrame
          alt="Complete sixteen-step backpropagation algorithm"
          caption="Course source page 18 · input, output, initialization, forward pass, output and hidden errors, weight updates, and bias updates."
          slide={18}
        />
        <aside>
          <article><span>Input</span><strong>training set · learning rate · multilayer network</strong></article>
          <article><span>Output</span><strong>a trained classifier</strong></article>
          <article><span>Loop invariant</span><strong>forward values first; gradients second; updates last</strong></article>
          <SearchCallout label="Read as pseudocode" tone="cyan">Locate the nested loops and identify which quantities must be saved during the forward pass for use during the backward pass.</SearchCallout>
        </aside>
      </div>
    ),
    note: "Timing: 4 minutes. Keep the 4:3 render full and enlargeable. Walk through all 16 lines. Modern frameworks vectorize batches, but the data dependencies are unchanged.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Demo · Algorithm state machine",
    title: "Backpropagation is an ordered dataflow",
    content: <AlgorithmWalkthrough />,
    note: "Timing: 3 minutes. Invite students to click each stage and connect it to the numbered source algorithm. Ask what fails if updates occur before all needed gradients are computed.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Computational graph · Numeric backpropagation",
    title: "Local derivatives make a global gradient tractable",
    content: (
      <div className="m18-graph-practice">
        <section>
          <span>Forward values</span>
          <div className="m18-mini-graph">
            <article><b>x = 2</b><small>input</small></article><i>×</i>
            <article><b>w = 3</b><small>parameter</small></article><i>→</i>
            <article><b>z = 6</b><small>xw</small></article><i>square</i>
            <article><b>L = 36</b><small>z²</small></article>
          </div>
        </section>
        <section>
          <span>Backward values</span>
          <div className="m18-chain">
            <code>∂L/∂z = 2z = 12</code>
            <code>∂z/∂w = x = 2</code>
            <code>∂L/∂w = 12 × 2 = 24</code>
          </div>
          <p>One step with η = 0.01: <strong>w ← 3 − 0.01(24) = 2.76</strong>.</p>
        </section>
        <SearchCallout label="Pair practice" tone="amber">Now compute ∂L/∂x. Then explain why x usually receives a gradient but is not updated as a model parameter.</SearchCallout>
      </div>
    ),
    note: "Timing: 4 minutes. Give one minute for the forward pass, two for the backward pass and update, and one to discuss parameter versus data tensors.",
    sourceSlides: [16, 17],
  },
  {
    eyebrow: "Modern supplement · Automatic differentiation",
    title: "Autodiff records operations, then applies the same chain rule in reverse",
    content: <AutodiffExplorer />,
    note: "Timing: 3 minutes. Distinguish symbolic differentiation, numerical finite differences, and reverse-mode autodiff. PyTorch still computes the derivatives taught on pages 16–17.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 6 · Network variation",
    title: "Topology, learning algorithm, and encoding define different neural networks",
    content: (
      <SourceExplanation
        alt="Complete course-source page listing neural-network design options and learning settings"
        caption="Course source page 19 · topology, layer depth, learning algorithm, encoding, supervised classification, and unsupervised clustering."
        slide={19}
      >
        <div className="m18-choice-grid">
          <article><span>Topology</span><strong>what connects to what?</strong><p>dense, convolutional, recurrent, attention-based</p></article>
          <article><span>Depth</span><strong>how many transformations?</strong><p>deep learning uses many learned layers</p></article>
          <article><span>Algorithm</span><strong>how are parameters fitted?</strong><p>optimizer, objective, batching, regularization</p></article>
          <article><span>Encoding</span><strong>how are inputs and outputs represented?</strong><p>vectors, grids, tokens, sequences, labels</p></article>
        </div>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Retain every design option on the source page. Clarify that depth alone does not determine task quality and that topology should match the data structure.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Modern examples · Architecture explorer",
    title: "The same backpropagation principle spans different topologies",
    content: <NetworkExplorer />,
    note: "Timing: 3 minutes. Students choose one topology and justify the encoding. Explicitly connect CNN and RNN to the source notes while labeling the expanded examples as modern.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Knowledge point 6 · Learning signal",
    title: "Supervised and unsupervised describe the signal—not the shape of the network",
    content: (
      <div className="m18-learning-modes">
        <article>
          <span>Supervised</span>
          <strong>target labels or values</strong>
          <p>Classification: predict a category. Regression: predict a quantity.</p>
          <code>(x, y) → loss(prediction, y)</code>
        </article>
        <article>
          <span>Unsupervised</span>
          <strong>structure without task labels</strong>
          <p>Clustering, compression, density estimation, or representation learning.</p>
          <code>x → objective derived from x</code>
        </article>
        <article>
          <span>Modern bridge</span>
          <strong>self-supervision constructs targets from data</strong>
          <p>Masking, next-token prediction, and contrastive objectives provide scalable training signals.</p>
          <code>x → transformed target from x</code>
        </article>
        <SearchCallout label="Check the claim" tone="green">A neural network is a function family. The data, objective, and training signal determine what it learns.</SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the source's supervised classification and unsupervised clustering examples, then broaden carefully to regression and self-supervision.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Modern PyTorch lab · Workflow",
    title: "A trustworthy training loop has four visible stages",
    content: (
      <div className="m18-loop-map">
        <article><span>1</span><strong>Prepare</strong><p>tensors, shapes, split, seed, model</p></article>
        <i>→</i>
        <article><span>2</span><strong>Train</strong><p>zero gradients, forward, loss, backward, step</p></article>
        <i>→</i>
        <article><span>3</span><strong>Validate</strong><p>eval mode, no gradients, metrics, checkpoint</p></article>
        <i>→</i>
        <article><span>4</span><strong>Report</strong><p>configuration, learning curves, final test evidence</p></article>
        <SearchCallout label="Lab target" tone="cyan">Fit XOR with a 2→8→1 network, then explain why a model without a hidden nonlinear layer cannot represent XOR.</SearchCallout>
      </div>
    ),
    note: "Timing: 4 minutes. Preview the lab deliverable: working code plus a shape table, learning curve, saved checkpoint, and explanation—not code execution alone.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern PyTorch lab · Code",
    title: "Clear, forward, measure, backward, step",
    content: <PyTorchLab />,
    note: "Timing: 4 minutes. Move through all four tabs. Have students recite the five training-step calls in order and explain why raw logits pair with BCEWithLogitsLoss.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern PyTorch lab · Debugging",
    title: "Shapes and modes are part of the algorithm",
    content: <ShapeDebugger />,
    note: "Timing: 3 minutes. Assign one debug case per group, require a diagnosis before reveal, then compare shape, accumulation, mode, and loss-interface failures.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern PyTorch lab · Generalization",
    title: "More epochs can lower training loss while harming validation",
    content: <TrainingCurveLab />,
    note: "Timing: 3 minutes. Move the epoch slider beyond 14. Distinguish reproducibility from exact hardware-level determinism and model selection from final test evaluation.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment · Synthesize and repair",
    title: "Explain one gradient and repair one loop",
    content: (
      <div className="m18-assessment">
        <section>
          <span>Part A · 2 minutes</span>
          <h3>Gradient reasoning</h3>
          <p>An output unit has a = 0.8, target t = 1, incoming activation 0.5, and η = 0.1.</p>
          <ol>
            <li>Compute δ = (t − a)a(1 − a).</li>
            <li>Compute Δw = ηδa<sub>incoming</sub>.</li>
            <li>State whether the weight increases or decreases.</li>
          </ol>
        </section>
        <section>
          <span>Part B · 2 minutes</span>
          <h3>Training-loop repair</h3>
          <pre><code>{`logits = model(x)
loss = criterion(logits, y)
optimizer.step()
loss.backward()`}</code></pre>
          <p>Rewrite the step in the correct order and add the missing operation.</p>
        </section>
        <aside>
          <strong>Evidence standard</strong>
          <p>Show the chain-rule factors, not only the final number. Explain every moved code line in terms of the data dependency.</p>
        </aside>
      </div>
    ),
    note: "Timing: 4 minutes. Answer: delta = 0.032, delta-w = 0.0016, so the source-sign-convention update increases w. Correct loop: zero_grad, forward, loss, backward, step.",
    sourceSlides: [15, 16, 18],
  },
  {
    eyebrow: "Readings · Exit ticket",
    title: "Backpropagation connects the source derivation to modern autodiff",
    content: (
      <div className="m18-exit">
        <SourceFrame
          alt="Complete course-source references page"
          caption="Course source page 36 · the cited Luger and Mitchell texts; corrected bibliographic spelling appears at right."
          slide={36}
        />
        <section>
          <span>Corrected references</span>
          <ul>
            <li>George F. Luger, <em>Artificial Intelligence: Structures and Strategies for Complex Problem Solving</em>, 6th ed., Chapters 10 and 12, Addison-Wesley, 2009.</li>
            <li>Tom M. Mitchell, <em>Machine Learning</em>, McGraw-Hill, 1997.</li>
            <li>Rumelhart, Hinton, and Williams, “Learning representations by back-propagating errors,” 1986.</li>
            <li>PyTorch documentation: Autograd mechanics; <code>nn.Module.train()</code> and <code>eval()</code>.</li>
          </ul>
          <div className="m18-exit-ticket">
            <strong>Exit ticket</strong>
            <ol>
              <li>Why does a hidden delta need a weighted downstream sum?</li>
              <li>What does <code>loss.backward()</code> do that <code>optimizer.step()</code> does not?</li>
              <li>Name one piece of evidence that training generalizes.</li>
            </ol>
          </div>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Collect the three-item exit ticket. The planned timings across all 25 pages total 75 minutes. The course-source rendering is retained exactly; bibliographic typographical errors are corrected in the readable list.",
    sourceSlides: [36],
  },
];

export function Meeting18Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Module 12 · Lesson 18 · Part B"
      meetingTitle="Backpropagation and Modern Neural-Network Training"
      resolveSourceReference={resolveMeeting18SourceReference}
      slides={slides}
      sourceCollectionLabel={SOURCE_DECK_LABEL}
    />
  );
}
