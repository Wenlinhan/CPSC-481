"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const L11_RENDER_ROOT = "/course-source/l11-probability-bayes/slide-renders";
const L12_RENDER_ROOT = "/course-source/l12-conditional-independence/slide-renders";
const L11_SOURCE_DECK_LABEL = "L11 Stochastic Methods · Part A";
const L12_SOURCE_DECK_LABEL = "L12 Stochastic Methods · Part B";

function resolveMeeting10SourceReference(sourceSlide: number) {
  const isL11Source = sourceSlide >= 35;
  const deckLabel = isL11Source ? L11_SOURCE_DECK_LABEL : L12_SOURCE_DECK_LABEL;
  const sourceRoot = isL11Source ? L11_RENDER_ROOT : L12_RENDER_ROOT;
  const sourceKey = isL11Source ? "l11-probability-bayes" : "l12-conditional-independence";
  return {
    deckLabel,
    image: `${sourceRoot}/slide-${String(sourceSlide).padStart(2, "0")}.png`,
    key: `${sourceKey}:${sourceSlide}`,
    page: sourceSlide,
  };
}

function IndependenceTableCheck() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section>
      <span>Worked check · use one cell</span>
      <h3>Which joint table factorizes?</h3>
      <p>
        From the displayed marginals, P(T=hot)=0.5 and P(W=sun)=0.6.
        Independence therefore predicts P(hot,sun)=0.5×0.6=0.3.
      </p>
      <div className="best-first-step-controls">
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide analysis" : "Reveal analysis"}
        </button>
      </div>
      {revealed && (
        <SearchCallout label="P₂ factorizes; P₁ does not" tone="green">
          P₂(hot,sun)=0.3 and all four P₂ cells match P(T)P(W). P₁(hot,sun)=0.4,
          so a single counterexample disproves independence for P₁.
        </SearchCallout>
      )}
    </section>
  );
}

function CommonCauseCheck({
  x,
  y,
  cause,
}: {
  x: string;
  y: string;
  cause: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section>
      <span>Common-cause reasoning</span>
      <h3>{x} and {y}</h3>
      <p>
        Decide whether they should be independent before observing {cause}, and
        whether the model supports independence after conditioning on {cause}.
      </p>
      <div className="best-first-step-controls">
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide claim" : "Reveal one defensible claim"}
        </button>
      </div>
      {revealed && (
        <SearchCallout label={`${x} ⟂ ${y} | ${cause}`} tone="cyan">
          They can be associated before conditioning because the shared cause
          changes both probabilities. In the proposed common-cause model,
          knowing {cause} screens them off. This is a modeling claim that data
          and domain knowledge must test.
        </SearchCallout>
      )}
    </section>
  );
}

const networkFactors = [
  {
    label: "B",
    factor: "P(B)",
    meaning: "Burglary is a root variable, so its local table is a prior.",
  },
  {
    label: "E",
    factor: "P(E)",
    meaning: "Earthquake is another root variable with its own prior.",
  },
  {
    label: "A",
    factor: "P(A | B,E)",
    meaning: "Alarm has two parents; its CPT has one row for each B,E assignment.",
  },
  {
    label: "J",
    factor: "P(J | A)",
    meaning: "JohnCalls needs only Alarm in its local conditional table.",
  },
  {
    label: "M",
    factor: "P(M | A)",
    meaning: "MaryCalls also needs only Alarm in its local conditional table.",
  },
];

function BurglaryNetworkDiagram({
  active = [],
  height = 150,
  label = "Bayesian network with Burglary and Earthquake pointing to Alarm, and Alarm pointing to JohnCalls and MaryCalls",
}: {
  active?: string | string[];
  height?: number;
  label?: string;
}) {
  const highlighted = new Set(Array.isArray(active) ? active : [active]);
  const nodes = [
    { id: "B", label: "Burglary", x: 25, y: 18, width: 120 },
    { id: "E", label: "Earthquake", x: 415, y: 18, width: 120 },
    { id: "A", label: "Alarm", x: 220, y: 100, width: 120 },
    { id: "J", label: "JohnCalls", x: 70, y: 182, width: 120 },
    { id: "M", label: "MaryCalls", x: 370, y: 182, width: 120 },
  ];
  const markerId = `bn-arrow-${[...highlighted].sort().join("-") || "none"}-${height}`;

  return (
    <svg
      aria-label={label}
      role="img"
      style={{
        background: "#f8f7ff",
        border: "1px solid #d7d3ee",
        borderRadius: 14,
        display: "block",
        height,
        width: "100%",
      }}
      viewBox="0 0 560 242"
    >
      <title>{label}</title>
      <defs>
        <marker id={markerId} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#344a68" />
        </marker>
      </defs>
      {[
        [145, 50, 238, 102],
        [415, 50, 322, 102],
        [245, 142, 175, 184],
        [315, 142, 385, 184],
      ].map(([x1, y1, x2, y2], index) => (
        <line
          key={`${x1}-${y1}-${x2}-${y2}`}
          markerEnd={`url(#${markerId})`}
          stroke={index < 2 ? "#6740d9" : "#0c8f9b"}
          strokeWidth="4"
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
        />
      ))}
      {nodes.map(node => {
        const selected = highlighted.has(node.id);
        return (
          <g key={node.id}>
            <rect
              fill={selected ? "#6740d9" : "#ffffff"}
              height="42"
              rx="12"
              stroke={selected ? "#4c28bc" : "#9daac0"}
              strokeWidth="2"
              width={node.width}
              x={node.x}
              y={node.y}
            />
            <text
              fill={selected ? "#ffffff" : "#17233a"}
              fontSize="16"
              fontWeight="800"
              textAnchor="middle"
              x={node.x + node.width / 2}
              y={node.y + 26}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function NetworkFactorizationExplorer() {
  const [active, setActive] = useState(0);
  const item = networkFactors[active];

  return (
    <div className="algorithm-selection">
      <nav aria-label="Choose a Bayesian-network variable">
        {networkFactors.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <BurglaryNetworkDiagram active={item.label} height={170} />
        <span>Local factor · {item.label}</span>
        <h3>{item.factor}</h3>
        <p>{item.meaning}</p>
        <p>
          <strong>DAG:</strong> Burglary → Alarm ← Earthquake; Alarm →
          JohnCalls; Alarm → MaryCalls.
        </p>
        <SearchCallout label="Joint factorization" tone="green">
          P(B,E,A,J,M) = P(B)P(E)P(A|B,E)P(J|A)P(M|A).
        </SearchCallout>
      </section>
    </div>
  );
}

const separationCases = [
  {
    label: "Common cause",
    question: "Are JohnCalls and MaryCalls independent after Alarm is known?",
    answer: "Yes in this network: J ⟂ M | A.",
    why: "Conditioning on their common parent blocks the only path between them.",
  },
  {
    label: "Collider closed",
    question: "Are Burglary and Earthquake independent before observing Alarm or its descendants?",
    answer: "Yes in the represented distribution: B ⟂ E.",
    why: "The path B→A←E is blocked by the unobserved collider A.",
  },
  {
    label: "Explaining away",
    question: "Are Burglary and Earthquake independent after Alarm is observed?",
    answer: "No. Conditioning on collider A opens the path.",
    why: "Evidence for one cause can explain away the other once their common effect is known.",
  },
];

function GraphicalIndependenceStudio() {
  const [active, setActive] = useState(0);
  const item = separationCases[active];
  const highlighted = active === 0 ? ["A", "J", "M"] : ["B", "E", "A"];

  return (
    <div className="search-review-studio">
      <nav aria-label="Choose a graphical-independence case">
        {separationCases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <ol>
        <li style={{ gridTemplateColumns: "1fr" }}>
          <BurglaryNetworkDiagram
            active={highlighted}
            height={136}
            label={`Graph for ${item.label}: ${item.question}`}
          />
        </li>
        <li>
          <span>ASK</span>
          <p><strong>{item.question}</strong></p>
        </li>
        <li>
          <span>CLAIM</span>
          <p>{item.answer}</p>
        </li>
        <li>
          <span>PATH</span>
          <p>{item.why}</p>
        </li>
        <li>
          <span>CHECK</span>
          <p>State the conditioning set; a graphical claim without it is incomplete.</p>
        </li>
      </ol>
    </div>
  );
}

const enumerationTrace = [
  {
    label: "Parse the query",
    selected: "Query B; evidence j,m",
    hidden: "E, A",
    value: "Two unobserved binary variables",
    detail: "Compute one unnormalized number for B=true and another for B=false.",
  },
  {
    label: "Expand the factors",
    selected: "P(B)P(E)P(A|B,E)P(j|A)P(m|A)",
    hidden: "Σe Σa",
    value: "Four rows per B value",
    detail: "Each complete assignment contributes a product of five local factors.",
  },
  {
    label: "Enumerate B=true",
    selected: "Σe Σa P(b,e,a,j,m)",
    hidden: "E, A",
    value: "0.000592243",
    detail: "Sum all four rows compatible with burglary and both calls.",
  },
  {
    label: "Enumerate B=false",
    selected: "Σe Σa P(¬b,e,a,j,m)",
    hidden: "E, A",
    value: "0.001491858",
    detail: "The no-burglary mass is larger even after both calls are observed.",
  },
  {
    label: "Normalize",
    selected: "α〈0.000592243, 0.001491858〉",
    hidden: "Evidence total = 0.002084100",
    value: "P(b|j,m) ≈ 0.284",
    detail: "Normalize the two unnormalized entries so they sum to one.",
  },
];

function EnumerationTrace() {
  const [step, setStep] = useState(0);
  const state = enumerationTrace[step];

  return (
    <div className="frontier-trace">
      <section>
        <span>Exact inference · {step + 1} of {enumerationTrace.length}</span>
        <h3>{state.label}</h3>
        <p>{state.detail}</p>
        <div>
          <button
            disabled={step === 0}
            onClick={() => setStep(value => Math.max(0, value - 1))}
            type="button"
          >
            Previous
          </button>
          <button
            disabled={step === enumerationTrace.length - 1}
            onClick={() => setStep(value => Math.min(enumerationTrace.length - 1, value + 1))}
            type="button"
          >
            Next
          </button>
          <button onClick={() => setStep(0)} type="button">Reset</button>
        </div>
      </section>
      <div className="frontier-queues">
        <article>
          <span>Current expression</span>
          <strong>{state.selected}</strong>
        </article>
        <article>
          <span>Hidden variables or normalization</span>
          <strong>{state.hidden}</strong>
        </article>
        <article>
          <span>Result</span>
          <strong>{state.value}</strong>
          <small>Numbers use the canonical burglary–alarm CPTs from the course textbook example.</small>
        </article>
      </div>
    </div>
  );
}

const modelAuditCases = [
  {
    label: "Assumption",
    claim: "Naive Bayes assumes features are marginally independent.",
    correction:
      "No. It assumes features are conditionally independent given the class: P(F₁,…,Fₙ|C)=∏ᵢP(Fᵢ|C).",
  },
  {
    label: "Decision",
    claim: "The classifier formula with a class prior is maximum likelihood.",
    correction:
      "With P(C) included, the argmax is maximum a posteriori (MAP). Maximum likelihood omits the class prior.",
  },
  {
    label: "Parameters",
    claim: "Training Naive Bayes always means estimating means and variances.",
    correction:
      "Only Gaussian Naive Bayes uses class-conditional means and variances. Bernoulli, multinomial, and categorical variants estimate different statistics.",
  },
  {
    label: "Robustness",
    claim: "Irrelevant features can never hurt Naive Bayes.",
    correction:
      "Weakly informative features may have little effect, but correlated or duplicated features can count the same evidence repeatedly and distort confidence.",
  },
];

function NaiveBayesModelAudit() {
  const [active, setActive] = useState(0);
  const item = modelAuditCases[active];

  return (
    <div className="search-review-studio">
      <nav aria-label="Choose a Naive Bayes evaluation claim">
        {modelAuditCases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <ol>
        <li>
          <span>CLAIM</span>
          <p><strong>{item.claim}</strong></p>
        </li>
        <li>
          <span>VERDICT</span>
          <p>Revise before using this statement as evidence.</p>
        </li>
        <li>
          <span>CORRECT</span>
          <p>{item.correction}</p>
        </li>
        <li>
          <span>TEST</span>
          <p>Compare held-out accuracy, calibration, error types, and performance under feature dependence or distribution shift.</p>
        </li>
      </ol>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Week 5 · Meeting 10 · Structured uncertainty",
    title: "Conditional Independence, Bayesian Networks, and Naive Bayes",
    subtitle: "How can a small set of local assumptions represent and query a much larger joint distribution?",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Driving question</span>
          <h3>Which variables still matter once the right evidence is known?</h3>
          <p>
            Independence removes factors. Conditional independence removes
            factors only after a conditioning context is fixed. Graphs make
            those local claims visible and reusable.
          </p>
        </section>
        <div>
          <article><strong>Independence</strong><p>Test factorization, not intuition alone.</p></article>
          <article><strong>Bayesian network</strong><p>Encode local conditional distributions in a directed acyclic graph.</p></article>
          <article><strong>Inference</strong><p>Sum hidden variables and normalize evidence-compatible mass.</p></article>
          <article><strong>Naive Bayes</strong><p>Use a strong class-conditional independence assumption for efficient classification.</p></article>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Retrieve joint, conditional, product, and chain rules. Frame the lesson as representation plus inference, not merely formula manipulation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Independence · Equivalent tests",
    title: "Independence means learning Y does not change belief about X",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Course figure defining independence through conditional equality and joint factorization"
          caption="Independence can be tested as P(x|y)=P(x) or P(x,y)=P(x)P(y), for all values with positive conditioning probability."
          file="slide-35.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Three equivalent views</span>
          <h3>X ⟂ Y</h3>
          <ul>
            <li>P(x|y)=P(x) when P(y)&gt;0.</li>
            <li>P(y|x)=P(y) when P(x)&gt;0.</li>
            <li>P(x,y)=P(x)P(y) for every x,y pair.</li>
          </ul>
          <SearchCallout label="Modeling caution" tone="amber">
            Exact independence is rare in empirical data. Treat it as a claim to
            justify or test, not a property inferred from variable names.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Preserve L11 slide 35 in full. State the positive-probability condition for conditional forms and distinguish exact mathematical independence from an approximation.",
    sourceSlides: [35],
  },
  {
    eyebrow: "Independence · Joint factorization",
    title: "Factorization replaces one joint table with smaller distributions",
    content: (
      <div className="tree-layout">
        <div data-l12-source-slide="3">
          <SearchSourceImage
            alt="L12 course figure showing the product definition of independence"
            caption="L12 Part B · P(X,Y)=P(X)P(Y), written X ⟂ Y."
            file="slide-03.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </div>
        <section>
          <span>Representation consequence</span>
          <h3>Store P(X) and P(Y), not every pair</h3>
          <p>
            If X and Y are independent, every joint cell is reconstructed from
            two marginal entries. For n independent binary variables, a 2ⁿ-row
            joint becomes n two-entry tables.
          </p>
          <SearchCallout label="Ask before factoring" tone="cyan">
            Does the assumption hold for every assignment, and is the resulting
            approximation accurate enough for the intended decision?
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: L12 Part B slide 3. Preserve the formula and the modeling-assumption warning. Contrast parameter counts without claiming real variables are usually independent.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Worked independence · Counterexample and proof",
    title: "One mismatched cell disproves independence",
    content: (
      <div className="tree-layout">
        <div data-l12-source-slide="4">
          <SearchSourceImage
            alt="Two temperature-weather joint tables and their marginal distributions"
            caption="L12 Part B · P₁ does not factorize; P₂ equals P(T)P(W)."
            file="slide-04.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </div>
        <IndependenceTableCheck />
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 4. Students test hot,sun first, then verify the remaining P2 cells. Emphasize that proof requires all cells but disproof needs one counterexample.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Worked independence · Repeated trials",
    title: "Independent coin flips turn an exponential joint into repeated local factors",
    content: (
      <div className="iteration-comparison">
        <article>
          <span>L11 Part A · slide 36</span>
          <SearchSourceImage
            alt="Three fair independent coin distributions"
            caption="Each fair flip contributes a local probability 0.5."
            file="slide-36.png"
            sourceRoot={L11_RENDER_ROOT}
          />
        </article>
        <article data-l12-source-slide="5">
          <span>L12 Part B · slide 5</span>
          <SearchSourceImage
            alt="N fair independent coin flips and a factorized joint distribution"
            caption="The complete joint has 2ⁿ outcomes, but independence gives P(X₁,…,Xₙ)=∏ᵢP(Xᵢ)."
            file="slide-05.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </article>
      </div>
    ),
    note: "Timing: 2 minutes. Preserve L11 slide 36 and L12 slide 5 in full. Ask students for P(H,T,H)=0.5^3 and why fairness alone does not logically imply independence.",
    sourceSlides: [36, 5],
  },
  {
    eyebrow: "Conditional independence · Visual bridge",
    title: "A shared cause can explain why two observations move together",
    content: (
      <div className="search-hero">
        <section>
          <span>From association to screening off</span>
          <h3>Smoke and an alarm can be associated because both depend on fire</h3>
          <p>
            Once the relevant state of the fire is known, a model may assert
            that smoke contributes no additional information about the alarm.
            That assertion is conditional—not absolute—independence.
          </p>
        </section>
        <div data-l12-source-slide="6">
          <SearchSourceImage
            alt="Fire producing smoke while a detector triggers an alarm"
            caption="L12 Part B · a common-cause setting for conditional independence."
            file="slide-06.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: L12 Part B slide 6. Elicit candidate variables before naming conditional independence. Avoid claiming the relationship without a model or data.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Conditional independence · Definition",
    title: "Condition on Z, then test factorization inside every Z stratum",
    content: (
      <div className="tree-layout">
        <div data-l12-source-slide="8">
          <SearchSourceImage
            alt="Conditional independence definition and equivalent equations"
            caption="L12 Part B · X ⟂ Y | Z iff P(x,y|z)=P(x|z)P(y|z), equivalently P(x|z,y)=P(x|z)."
            file="slide-08.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </div>
        <section>
          <span>Read the quantifier</span>
          <h3>For all x, y, z with valid denominators</h3>
          <p>
            Conditional independence does not say X and Y are unrelated. It
            says that after Z is fixed, knowing Y does not further change the
            distribution of X.
          </p>
          <SearchCallout label="Why it matters" tone="green">
            These local claims are the main representational savings behind
            Bayesian networks and Naive Bayes.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 8. Preserve both equivalent equations. Ask why unconditional independence is rare and why conditioning can create a more useful claim.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Conditional independence · Dental example",
    title: "Cavity can screen Toothache from Catch",
    content: (
      <div className="tree-layout">
        <div data-l12-source-slide="7">
          <SearchSourceImage
            alt="Toothache cavity and probe catch conditional-independence equations"
            caption="L12 Part B · Catch ⟂ Toothache | Cavity, with equivalent conditional and factorized statements."
            file="slide-07.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </div>
        <section>
          <span>Translate the notation</span>
          <h3>Once Cavity is known, Toothache does not change Catch</h3>
          <ul>
            <li>P(Catch|Toothache,Cavity)=P(Catch|Cavity)</li>
            <li>P(Toothache|Catch,Cavity)=P(Toothache|Cavity)</li>
            <li>P(Toothache,Catch|Cavity)=P(Toothache|Cavity)P(Catch|Cavity)</li>
          </ul>
          <SearchCallout label="Model claim" tone="amber">
            The equations are equivalent under valid probabilities; whether the
            claim fits real dental data is empirical.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 7. Derive one equivalent statement from another with the product rule. Preserve both cavity and no-cavity cases shown in the figure.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Conditional independence · Weather domain",
    title: "Rain can screen Traffic from Umbrella",
    content: (
      <div className="tree-layout">
        <div data-l12-source-slide="9">
          <SearchSourceImage
            alt="Rain traffic and umbrella domain illustration"
            caption="L12 Part B · Traffic, Umbrella, and Raining invite a common-cause model."
            file="slide-09.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </div>
        <CommonCauseCheck x="Traffic" y="Umbrella" cause="Raining" />
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 9. Students draw Rain→Traffic and Rain→Umbrella, then state Traffic independent of Umbrella given Rain as a testable assumption.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Conditional independence · Safety domain",
    title: "Fire can screen Smoke from Alarm—but only under a simplified model",
    content: (
      <div className="tree-layout">
        <div data-l12-source-slide="10">
          <SearchSourceImage
            alt="Fire smoke and alarm illustrations"
            caption="L12 Part B · Fire, Smoke, and Alarm support a second common-cause analysis."
            file="slide-10.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </div>
        <CommonCauseCheck x="Smoke" y="Alarm" cause="Fire" />
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 10. Surface counterexamples: smoke can directly trigger a detector, and a latent sensor fault may affect Alarm. Conditional independence follows the proposed model, not the nouns alone.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Probability recap · Tools for structured models",
    title: "Product and chain rules turn independence claims into factorization",
    content: (
      <div className="tree-layout">
        <div data-l12-source-slide="11">
          <SearchSourceImage
            alt="Probability recap with conditional probability product rule chain rule and independence"
            caption="L12 Part B · the formulas needed to derive Bayesian-network factorization."
            file="slide-11.png"
            sourceRoot={L12_RENDER_ROOT}
          />
        </div>
        <section>
          <span>Retrieval check</span>
          <h3>Use the right rule for the right job</h3>
          <ul>
            <li>Conditional probability: divide a compatible joint by evidence mass.</li>
            <li>Product rule: reconstruct a joint from a conditional and marginal.</li>
            <li>Chain rule: factor any joint in an ordered sequence.</li>
            <li>Independence: simplify selected chain-rule terms.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: L12 Part B slide 11. Have students name which formulas are identities and which are modeling assumptions.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Textbook-grounded supplement · Bayesian-network semantics",
    title: "A Bayesian network is a DAG plus one local conditional distribution per node",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Representation</span>
          <h3>Parents identify the variables a node conditions on locally</h3>
          <BurglaryNetworkDiagram active="A" height={164} />
          <p>
            A directed acyclic graph orders dependencies. Each node Xᵢ has a
            conditional probability table P(Xᵢ|Parents(Xᵢ)).
          </p>
        </section>
        <div>
          <article><strong>Nodes</strong><p>Random variables with explicit domains.</p></article>
          <article><strong>Directed edges</strong><p>Direct probabilistic dependencies in the chosen representation.</p></article>
          <article><strong>Acyclic</strong><p>No directed path can return to its starting node.</p></article>
          <SearchCallout label="Interpret carefully" tone="amber">
            An arrow does not prove causation. A causally designed network needs
            stronger assumptions than the probabilistic semantics alone.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Clearly label this as a textbook-grounded supplement: Russell and Norvig, 3e, Chapters 13-14. L11 Part A and selected L12 slides do not themselves teach Bayesian-network semantics.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · DAG and CPT factorization",
    title: "Local CPTs multiply into the complete joint distribution",
    content: <NetworkFactorizationExplorer />,
    note: "Timing: 3 minutes. Use the canonical burglary–earthquake–alarm–calls network. Students select each node, state its parents, and assemble P(B,E,A,J,M)=P(B)P(E)P(A|B,E)P(J|A)P(M|A).",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Graphical independence",
    title: "Blocked and opened paths determine which evidence remains relevant",
    content: <GraphicalIndependenceStudio />,
    note: "Timing: 3 minutes. Introduce only the d-separation patterns needed here: common cause and collider. Make conditioning sets explicit and demonstrate explaining away at Alarm.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Exact inference",
    title: "Enumeration sums hidden assignments and normalizes the query distribution",
    content: (
      <div className="algorithm-source-layout">
        <ol>
          <li>Choose query variables and fix the observed evidence.</li>
          <li>List every hidden variable not in the query or evidence.</li>
          <li>Use the network factorization for each complete assignment.</li>
          <li>Sum over all hidden-variable assignments.</li>
          <li>Repeat for each query value and normalize the resulting vector.</li>
        </ol>
        <section>
          <h3>P(X|e)=α Σᵧ ∏ᵢP(xᵢ|paᵢ)</h3>
          <p>
            Enumeration is conceptually direct, but the number of hidden
            assignments can grow exponentially. Variable elimination reuses
            intermediate factors instead of repeating products.
          </p>
          <SearchCallout label="Pair task" tone="cyan">
            For P(Burglary|JohnCalls,MaryCalls), identify the hidden variables
            before doing arithmetic.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Textbook-grounded supplement. Students identify Earthquake and Alarm as hidden. Connect exponential enumeration to the value of factor structure.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Worked network",
    title: "Two calls raise burglary belief, but the low prior still matters",
    content: <EnumerationTrace />,
    note: "Timing: 5 minutes. Use canonical CPTs: P(B)=.001, P(E)=.002; Alarm .95/.94/.29/.001; John .90/.05; Mary .70/.01. Predict before each step. The posterior is approximately .284, not near one.",
    sourceSlides: [],
  },
  {
    eyebrow: "Naive Bayes · Class-conditional factorization",
    title: "Given the class, treat feature likelihoods as independent factors",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Naive Bayes derivation from chain rule and conditional independence"
          caption="The derivation reduces P(F₁,…,Fₙ|C) to a product of class-conditional feature likelihoods."
          file="slide-37.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Correct assumption</span>
          <h3>Fᵢ ⟂ Fⱼ | C, not Fᵢ ⟂ Fⱼ</h3>
          <p>
            Features such as fruit shape, color, and size may be associated
            overall because classes occur in different proportions. Naive
            Bayes asserts independence only after the class is fixed.
          </p>
          <SearchCallout label="Classification score" tone="green">
            score(C)=P(C)∏ᵢP(Fᵢ|C). The shared evidence denominator can be
            omitted when comparing classes.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve L11 slide 37 and its notes: apple/not-apple hypotheses; size, color, shape features; trained class priors and class-conditional feature probabilities. Correct marginal independence to conditional independence.",
    sourceSlides: [37],
  },
  {
    eyebrow: "Naive Bayes · Classifier decision",
    title: "The class prior and feature likelihoods produce a MAP decision",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Naive Bayes classifier argmax formula and fruit and spam examples"
          caption="The argmax includes P(C), so the decision is maximum a posteriori rather than maximum likelihood."
          file="slide-38.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Decision rule</span>
          <h3>ĉ = argmaxᶜ P(C)∏ᵢP(eᵢ|C)</h3>
          <ul>
            <li>Estimate P(C) from class frequency or a justified prior.</li>
            <li>Estimate P(eᵢ|C) within each class.</li>
            <li>Use log probabilities in software to avoid numerical underflow.</li>
            <li>Text classification and spam filtering are common fits.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve L11 slide 38. Correct terminology: including the class prior yields MAP. Ask why multiplying many small probabilities motivates log-space computation.",
    sourceSlides: [38],
  },
  {
    eyebrow: "Naive Bayes · Fruit example",
    title: "Training estimates local probabilities; testing compares class scores",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Naive Bayes fruit classifier example with features and hypotheses"
          caption="The example separates training estimates from the class returned during testing."
          file="slide-39.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Example structure</span>
          <h3>Apple versus not-apple</h3>
          <ul>
            <li>Training data: apples, grapes, and other fruits.</li>
            <li>Features: size, color, and shape.</li>
            <li>Classes: apple and not-apple.</li>
            <li>Testing: compare posterior class scores; 0.8 versus 0.2 selects apple.</li>
          </ul>
          <SearchCallout label="Do not overread 0.8" tone="amber">
            A normalized model score is not automatically calibrated as an 80%
            real-world chance. Check held-out calibration and data shift.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Preserve L11 slide 39. Retain the training/features/hypotheses/testing sequence and correct its 'maximum likelihood' wording to posterior or MAP classification.",
    sourceSlides: [39],
  },
  {
    eyebrow: "Sequence model · Pronouncing “tomato”",
    title: "A probabilistic finite-state acceptor models alternative phone paths",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Probabilistic finite-state acceptor for pronunciations of tomato"
          caption="Transition probabilities encode alternative pronunciations; 0.60 goes directly from /t/ to /m/."
          file="slide-40.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Preserve the model; correct the label</span>
          <h3>This is a probabilistic sequence model, not Naive Bayes by itself</h3>
          <p>
            A finite-state acceptor assigns probabilities to transitions among
            phone states. It characterizes pronunciation variants and can help
            interpret ambiguous phone sequences.
          </p>
          <SearchCallout label="Source note" tone="cyan">
            In the displayed data, 60% of speakers go from the initial /t/
            directly to /m/ without an intervening vowel phone.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve L11 slide 40 and its speaker note. Explicitly correct the slide label: a probabilistic finite-state acceptor is not evidence of a Naive Bayes factorization.",
    sourceSlides: [40],
  },
  {
    eyebrow: "Speech recognition · Prior × phone likelihood",
    title: "A common word can outrank a perfect phone match",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Speech-recognition candidates for phone ni with corpus frequencies and priors"
          caption="Brown and Switchboard counts supply P(word); the phone model supplies P(ni|word)."
          file="slide-41.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Candidate words</span>
          <h3>knee · the · neat · need · new</h3>
          <p>
            Compare candidates with an unnormalized Bayes score:
            P(word|ni) ∝ P(ni|word)P(word).
          </p>
          <ul>
            <li>The combined corpora contain about 2.5 million words.</li>
            <li>“the” appears because its prior is high, even though its phone likelihood will be zero.</li>
            <li>Predict the winner before revealing the calculated table.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve L11 slide 41 and notes, including candidate list, Brown/Switchboard corpus sizes, and why 'the' appears. Ask students to distinguish prior from likelihood.",
    sourceSlides: [41],
  },
  {
    eyebrow: "Speech recognition · Result and missing context",
    title: "Phone-only decoding selects “new”; word context favors “need”",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Calculated ni phone to word scores for new neat need knee and the"
          caption="The phone-only score is largest for “new”; P(ni|the)=0 makes “the” impossible under this observation."
          file="slide-42.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Read the evidence</span>
          <h3>Local winner: new</h3>
          <p>
            The displayed model uses only the phone evidence and word prior, so
            it favors “new.” But the preceding word is “I”: corpus evidence
            makes “I need” more plausible than “I new.”
          </p>
          <SearchCallout label="Model repair" tone="green">
            Add contextual variables or a sequence/language model. Better
            representation can matter more than refining the same local score.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Preserve L11 slide 42 and all note answers: P(ni|the)=0; phone-only winner new; 'I new' is implausible; two-word context favors 'I need'; the displayed score omits I.",
    sourceSlides: [42],
  },
  {
    eyebrow: "Naive Bayes evaluation · Qualified claims",
    title: "Naive Bayes is efficient, but the variant and dependencies matter",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Advantages and disadvantages listed for Naive Bayes"
          caption="The evaluation motivates efficient classification and relationship-aware alternatives; several claims require qualification."
          file="slide-43.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Keep, qualify, correct</span>
          <ul>
            <li><strong>Efficient:</strong> training and prediction are usually simple counts or distribution estimates.</li>
            <li><strong>Real or discrete:</strong> choose Gaussian, multinomial, Bernoulli, or categorical assumptions appropriately.</li>
            <li><strong>Streaming:</strong> sufficient statistics can often update incrementally.</li>
            <li><strong>Dependency risk:</strong> correlated features can double-count evidence and harm calibration.</li>
          </ul>
          <SearchCallout label="Specific correction" tone="amber">
            Mean and variance are sufficient only for Gaussian Naive Bayes—not
            for every Naive Bayes variant.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve L11 slide 43. Retain efficiency, irrelevant-feature, real/discrete/streaming, dependency violation, and relationship-aware solution ideas while applying the documented qualifications.",
    sourceSlides: [43],
  },
  {
    eyebrow: "In-class assessment · Audit the model claim",
    title: "A useful shortcut must state exactly what it assumes",
    content: <NaiveBayesModelAudit />,
    note: "Timing: 4 minutes. Run all four claims. Students revise one claim, identify evidence needed to test it, and explain when a Bayesian network or richer sequence model would be preferable.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative assessment · Readings and next use",
    title: "Factor, query, classify—and defend every independence claim",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Course references for probability and probabilistic reasoning"
          caption="Course bibliography retained in full; corrected author names appear in the reading note."
          file="slide-44.png"
          sourceRoot={L11_RENDER_ROOT}
        />
        <section>
          <span>Exit ticket</span>
          <h3>Submit one response with four parts</h3>
          <ol>
            <li>State one unconditional and one conditional independence claim.</li>
            <li>Factor the burglary-network joint distribution.</li>
            <li>Identify query, evidence, and hidden variables for one posterior.</li>
            <li>Correct one Naive Bayes claim and name evidence that would test it.</li>
          </ol>
          <SearchCallout label="Readings" tone="cyan">
            George F. Luger, <em>Artificial Intelligence</em>, 6th ed.,
            Chapters 5, 9, and 13; Stuart Russell and Peter Norvig,
            <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed.,
            Chapters 13–14. Selected probability figures also adapt CS188
            material by Dan Klein and Pieter Abbeel.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Preserve L11 slide 44 and correct George F. Luger and Stuart Russell. Collect the four-part exit ticket. Close by connecting conditional independence to later probabilistic and sequential models.",
    sourceSlides: [44],
  },
];

export function Meeting10Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 5 · Meeting 10"
      meetingTitle="Conditional Independence, Bayesian Networks, and Naive Bayes"
      resolveSourceReference={resolveMeeting10SourceReference}
      slides={slides}
      sourceCollectionLabel={`${L11_SOURCE_DECK_LABEL} + ${L12_SOURCE_DECK_LABEL}`}
    />
  );
}
