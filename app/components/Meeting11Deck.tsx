"use client";

import { useMemo, useState } from "react";
import "../styles/meeting11.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const L12_MDP_RENDER_ROOT = "/course-source/l12-mdp/slide-renders";

const weatherTransition = {
  sun: { sun: 0.9, rain: 0.1 },
  rain: { sun: 0.3, rain: 0.7 },
};

function propagateWeather(sun: number, rain: number) {
  return {
    sun: weatherTransition.sun.sun * sun + weatherTransition.rain.sun * rain,
    rain: weatherTransition.sun.rain * sun + weatherTransition.rain.rain * rain,
  };
}

function WeatherPredictionStudio() {
  const distributions = useMemo(() => {
    const values = [{ sun: 1, rain: 0 }];
    for (let step = 0; step < 8; step += 1) {
      values.push(propagateWeather(values.at(-1)!.sun, values.at(-1)!.rain));
    }
    return values;
  }, []);
  const [step, setStep] = useState(1);
  const current = distributions[step];
  const previous = distributions[step - 1];

  return (
    <div className="m11-weather-studio">
      <section>
        <span>Forward prediction · day {step}</span>
        <h3>Multiply the current distribution by the transition model</h3>
        <div className="m11-weather-equation">
          <p>
            P<sub>{step + 1}</sub>(sun) = 0.9({previous.sun.toFixed(3)}) +
            0.3({previous.rain.toFixed(3)})
          </p>
          <strong>= {current.sun.toFixed(3)}</strong>
          <p>
            P<sub>{step + 1}</sub>(rain) = 0.1({previous.sun.toFixed(3)}) +
            0.7({previous.rain.toFixed(3)})
          </p>
          <strong>= {current.rain.toFixed(3)}</strong>
        </div>
        <div className="m11-controls">
          <button
            disabled={step === 1}
            onClick={() => setStep(value => Math.max(1, value - 1))}
            type="button"
          >
            Previous
          </button>
          <button
            disabled={step === distributions.length - 1}
            onClick={() => setStep(value => Math.min(distributions.length - 1, value + 1))}
            type="button"
          >
            Next day
          </button>
          <button onClick={() => setStep(1)} type="button">Reset</button>
        </div>
      </section>
      <div className="m11-weather-bars" aria-label={`Weather distribution at day ${step + 1}`}>
        <article>
          <div style={{ height: `${current.sun * 100}%` }} />
          <strong>{(current.sun * 100).toFixed(1)}%</strong>
          <span>sun</span>
        </article>
        <article>
          <div style={{ height: `${current.rain * 100}%` }} />
          <strong>{(current.rain * 100).toFixed(1)}%</strong>
          <span>rain</span>
        </article>
        <p>
          The weather-chain fixed point is <strong>(0.75 sun, 0.25 rain)</strong>.
          This particular chain approaches it from the all-sun start.
        </p>
      </div>
    </div>
  );
}

const discountRewards = [5, 0, 8, 2];

function DiscountReturnExplorer() {
  const [gamma, setGamma] = useState(0.9);
  const terms = discountRewards.map((reward, index) => (gamma ** index) * reward);
  const total = terms.reduce((sum, value) => sum + value, 0);

  return (
    <div className="m11-discount">
      <nav aria-label="Choose a discount factor">
        {[0, 0.5, 0.9, 1].map(value => (
          <button
            className={gamma === value ? "active" : ""}
            key={value}
            onClick={() => setGamma(value)}
            type="button"
          >
            γ = {value.toFixed(1)}
          </button>
        ))}
      </nav>
      <section>
        <div className="m11-reward-timeline">
          {discountRewards.map((reward, index) => (
            <article key={`${reward}-${index}`}>
              <span>t + {index}</span>
              <strong>r = {reward}</strong>
              <p>{gamma.toFixed(1)}<sup>{index}</sup> × {reward} = {terms[index].toFixed(2)}</p>
            </article>
          ))}
        </div>
        <div className="m11-return-total">
          <span>Discounted return</span>
          <strong>G<sub>t</sub> = {total.toFixed(2)}</strong>
          <p>
            γ controls how quickly later rewards lose weight; it does not express
            uncertainty and it does not repair a poorly chosen reward.
          </p>
        </div>
      </section>
    </div>
  );
}

function BellmanExpectationBackup() {
  const [revealed, setRevealed] = useState(0);
  const right = -0.1 + 0.9 * (0.8 * 4 + 0.2 * 2);
  const left = -0.1 + 0.9 * 1;
  const value = 0.75 * right + 0.25 * left;

  const lines = [
    {
      label: "Right action",
      detail: `Qπ(s,right) = −0.1 + 0.9[0.8(4) + 0.2(2)] = ${right.toFixed(2)}`,
    },
    {
      label: "Left action",
      detail: `Qπ(s,left) = −0.1 + 0.9[1.0(1)] = ${left.toFixed(2)}`,
    },
    {
      label: "Policy average",
      detail: `Vπ(s) = 0.75(${right.toFixed(2)}) + 0.25(${left.toFixed(2)}) = ${value.toFixed(3)}`,
    },
  ];

  return (
    <div className="m11-backup">
      <section>
        <span>Policy π at state s</span>
        <h3>π(right|s)=0.75 · π(left|s)=0.25</h3>
        <p>
          Immediate reward is −0.1 and γ=0.9. “Right” reaches a state valued 4
          with probability 0.8 and a state valued 2 with probability 0.2.
          “Left” reaches a state valued 1.
        </p>
        <div className="m11-controls">
          <button
            disabled={revealed === lines.length}
            onClick={() => setRevealed(value => Math.min(lines.length, value + 1))}
            type="button"
          >
            Reveal next line
          </button>
          <button onClick={() => setRevealed(revealed === lines.length ? 0 : lines.length)} type="button">
            {revealed === lines.length ? "Reset" : "Reveal all"}
          </button>
        </div>
      </section>
      <ol>
        {lines.map((line, index) => (
          <li className={index < revealed ? "visible" : ""} key={line.label}>
            <span>{index + 1}</span>
            <div>
              <strong>{index < revealed ? line.label : "Predict this line"}</strong>
              <p>{index < revealed ? line.detail : "Name the expectation before revealing it."}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const actionBackupData = [
  { action: "↑ Up", successor: "wall → stay", nextValue: 0.4, q: 0.32 },
  { action: "→ Right", successor: "bottom-right", nextValue: 0.7, q: 0.59 },
  { action: "↓ Down", successor: "edge → stay", nextValue: 0.4, q: 0.32 },
  { action: "← Left", successor: "bottom-left", nextValue: 0.2, q: 0.14 },
];

function OptimalBackupExplorer() {
  const [active, setActive] = useState(1);
  const item = actionBackupData[active];

  return (
    <div className="m11-optimal-backup">
      <nav aria-label="Choose an action backup">
        {actionBackupData.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.action}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.action}
          </button>
        ))}
      </nav>
      <section>
        <span>One deterministic action backup</span>
        <h3>Q(s,{item.action.slice(2).trim()}) = −0.04 + 0.9({item.nextValue.toFixed(1)})</h3>
        <strong>= {item.q.toFixed(2)}</strong>
        <p>Successor: {item.successor}.</p>
        <SearchCallout
          label={active === 1 ? "Current maximum" : "Compare all four"}
          tone={active === 1 ? "green" : "cyan"}
        >
          Bellman optimality keeps the largest action backup. Here,
          V<sub>new</sub>(s)=max(0.32, 0.59, 0.32, 0.14)=0.59, so Right is greedy.
        </SearchCallout>
      </section>
    </div>
  );
}

type GridAction = "up" | "right" | "down" | "left";
type GridValues = Record<string, number>;

const gridActions: Array<{ id: GridAction; symbol: string; label: string }> = [
  { id: "up", symbol: "↑", label: "Up" },
  { id: "right", symbol: "→", label: "Right" },
  { id: "down", symbol: "↓", label: "Down" },
  { id: "left", symbol: "←", label: "Left" },
];
const gridWall = "1-1";
const gridPositive = "0-2";
const gridNegative = "1-2";
const gridGamma = 0.9;
const livingReward = -0.04;

function gridKey(row: number, column: number) {
  return `${row}-${column}`;
}

function isGridTerminal(key: string) {
  return key === gridPositive || key === gridNegative;
}

function gridSuccessor(key: string, action: GridAction) {
  if (isGridTerminal(key) || key === gridWall) return key;
  const [row, column] = key.split("-").map(Number);
  const delta: Record<GridAction, [number, number]> = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
  };
  const [dr, dc] = delta[action];
  const nextRow = row + dr;
  const nextColumn = column + dc;
  if (
    nextRow < 0 ||
    nextRow > 2 ||
    nextColumn < 0 ||
    nextColumn > 2 ||
    gridKey(nextRow, nextColumn) === gridWall
  ) {
    return key;
  }
  return gridKey(nextRow, nextColumn);
}

function initialGridValues(): GridValues {
  const values: GridValues = {};
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const key = gridKey(row, column);
      if (key === gridWall) continue;
      values[key] = key === gridPositive ? 1 : key === gridNegative ? -1 : 0;
    }
  }
  return values;
}

function gridActionValue(key: string, action: GridAction, values: GridValues) {
  return livingReward + gridGamma * values[gridSuccessor(key, action)];
}

function sweepGrid(values: GridValues) {
  const next: GridValues = { ...values };
  for (const key of Object.keys(values)) {
    if (isGridTerminal(key)) continue;
    next[key] = Math.max(...gridActions.map(action => gridActionValue(key, action.id, values)));
  }
  return next;
}

function makeGridSweeps(count: number) {
  const sweeps = [initialGridValues()];
  for (let index = 0; index < count; index += 1) {
    sweeps.push(sweepGrid(sweeps.at(-1)!));
  }
  return sweeps;
}

const gridSweeps = makeGridSweeps(30);

function greedyGridAction(key: string, values: GridValues) {
  if (isGridTerminal(key) || key === gridWall) return "";
  return gridActions.reduce((best, action) => (
    gridActionValue(key, action.id, values) > gridActionValue(key, best.id, values)
      ? action
      : best
  )).symbol;
}

function gridCellBackground(value: number) {
  const strength = Math.min(0.95, Math.abs(value));
  return value >= 0
    ? `rgba(29, 155, 99, ${0.12 + 0.62 * strength})`
    : `rgba(205, 74, 89, ${0.12 + 0.58 * strength})`;
}

function ValueGrid({
  values,
  showPolicy = false,
  selected,
  onSelect,
}: {
  values: GridValues;
  showPolicy?: boolean;
  selected?: string;
  onSelect?: (key: string) => void;
}) {
  return (
    <div className="m11-grid" role="grid" aria-label="Three by three gridworld">
      {Array.from({ length: 9 }, (_, index) => {
        const row = Math.floor(index / 3);
        const column = index % 3;
        const key = gridKey(row, column);
        if (key === gridWall) {
          return <div className="wall" key={key} role="gridcell"><span>wall</span></div>;
        }
        const terminal = isGridTerminal(key);
        const content = (
          <>
            <strong>{values[key].toFixed(2)}</strong>
            <span>{terminal ? "terminal" : showPolicy ? greedyGridAction(key, values) : `s${row}${column}`}</span>
          </>
        );
        if (onSelect && !terminal) {
          return (
            <button
              aria-selected={selected === key}
              className={selected === key ? "selected" : ""}
              key={key}
              onClick={() => onSelect(key)}
              role="gridcell"
              style={{ background: gridCellBackground(values[key]) }}
              type="button"
            >
              {content}
            </button>
          );
        }
        return (
          <div
            className={terminal ? "terminal" : ""}
            key={key}
            role="gridcell"
            style={{ background: gridCellBackground(values[key]) }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

function GridworldValueIteration() {
  const [sweep, setSweep] = useState(0);
  const [policy, setPolicy] = useState(false);
  const values = gridSweeps[sweep];
  const delta = sweep === 0
    ? 0
    : Math.max(...Object.keys(values).map(key => Math.abs(values[key] - gridSweeps[sweep - 1][key])));

  return (
    <div className="m11-gridworld-lab">
      <section>
        <span>Interactive synchronous value iteration</span>
        <h3>Sweep {sweep} · max Δ = {delta.toFixed(4)}</h3>
        <p>
          Deterministic moves, wall collision means “stay,” living reward −0.04,
          γ=0.9, terminal values +1 and −1. Every nonterminal cell uses only
          values from the previous sweep.
        </p>
        <div className="m11-controls">
          <button
            disabled={sweep === 0}
            onClick={() => setSweep(value => Math.max(0, value - 1))}
            type="button"
          >
            Previous
          </button>
          <button
            disabled={sweep === 30}
            onClick={() => setSweep(value => Math.min(30, value + 1))}
            type="button"
          >
            Run one sweep
          </button>
          <button onClick={() => setSweep(30)} type="button">Run to 30</button>
          <button
            aria-pressed={policy}
            onClick={() => setPolicy(value => !value)}
            type="button"
          >
            {policy ? "Hide policy" : "Show greedy policy"}
          </button>
        </div>
        <SearchCallout label="Observe the wave" tone="cyan">
          Positive terminal value propagates left and downward one sweep at a
          time. Values are not rewards; they summarize expected discounted
          future reward under the current greedy backup.
        </SearchCallout>
      </section>
      <ValueGrid showPolicy={policy} values={values} />
    </div>
  );
}

function PolicyExtractionLab() {
  const values = gridSweeps[30];
  const [selected, setSelected] = useState("2-0");
  const actionRows = gridActions
    .map(action => ({
      ...action,
      successor: gridSuccessor(selected, action.id),
      q: gridActionValue(selected, action.id, values),
    }))
    .sort((a, b) => b.q - a.q);

  return (
    <div className="m11-policy-lab">
      <ValueGrid
        onSelect={setSelected}
        selected={selected}
        showPolicy
        values={values}
      />
      <section>
        <span>Selected state · {selected}</span>
        <h3>Extract π*(s) by taking argmax<sub>a</sub> Q(s,a)</h3>
        <ol>
          {actionRows.map((action, index) => (
            <li className={index === 0 ? "best" : ""} key={action.id}>
              <strong>{action.symbol} {action.label}</strong>
              <span>to {action.successor}</span>
              <b>{action.q.toFixed(3)}</b>
            </li>
          ))}
        </ol>
        <SearchCallout label="Tie policy" tone="amber">
          If multiple actions share the maximum, a deterministic policy may
          choose any maximizer; a stochastic policy may distribute probability
          among them.
        </SearchCallout>
      </section>
    </div>
  );
}

const assumptionCases = [
  {
    label: "State",
    claim: "Location alone is a sufficient state for a delivery robot.",
    diagnosis:
      "Usually incomplete: remaining battery, payload, time, and relevant traffic conditions can change transition or reward predictions.",
    evidence:
      "Test whether next-state and reward distributions still depend on omitted history after conditioning on the proposed state.",
  },
  {
    label: "Reward",
    claim: "Give +1 for every package delivered; the learned policy will be safe.",
    diagnosis:
      "The reward omits collision, delay, energy, and equity costs. The optimizer can satisfy the stated objective while violating the intended one.",
    evidence:
      "Run adversarial scenarios, inspect failure trajectories, and elicit stakeholder constraints before deployment.",
  },
  {
    label: "Dynamics",
    claim: "A transition model measured in clear weather can be reused unchanged in rain.",
    diagnosis:
      "That assumes a stationary environment. Rain may change braking, sensor reliability, and other agents’ behavior.",
    evidence:
      "Stratify transition estimates by operating condition and monitor model drift.",
  },
  {
    label: "Planning",
    claim: "A tiny Bellman residual guarantees the real system performs well.",
    diagnosis:
      "It only says the numerical iteration is near a fixed point of the specified model. Model error or reward misspecification can still dominate.",
    evidence:
      "Separate solver error from model error; validate the extracted policy in held-out and stress-test environments.",
  },
];

function MdpAssumptionAudit() {
  const [active, setActive] = useState(0);
  const item = assumptionCases[active];

  return (
    <div className="m11-assumption-audit">
      <nav aria-label="Choose an MDP design claim">
        {assumptionCases.map((entry, index) => (
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
        <span>Claim to audit</span>
        <h3>{item.claim}</h3>
        <div>
          <article>
            <strong>Diagnosis</strong>
            <p>{item.diagnosis}</p>
          </article>
          <article>
            <strong>Evidence plan</strong>
            <p>{item.evidence}</p>
          </article>
        </div>
      </section>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Week 6 · Meeting 11 · Sequential decisions",
    title: "Markov Decision Processes, Policies, and Value Iteration",
    subtitle: "How does an agent choose now when actions change uncertain future opportunities?",
    content: (
      <div className="m11-opening">
        <section>
          <span>Driving problem</span>
          <h3>Prediction tells us what may happen. An MDP asks what we should do.</h3>
          <p>
            We begin with Markov-chain foundations, clarify two claims in
            context, and then add the decision layer from the course textbooks.
          </p>
        </section>
        <ol>
          <li><strong>Model</strong><span>state, action, transition, reward, discount</span></li>
          <li><strong>Evaluate</strong><span>policy, return, value, Bellman expectation</span></li>
          <li><strong>Optimize</strong><span>Bellman optimality, value iteration, policy extraction</span></li>
          <li><strong>Audit</strong><span>state sufficiency, reward design, model error</span></li>
        </ol>
      </div>
    ),
    note: "Timing: 1 minute. Preview the prediction-to-control bridge. Tell students that exact historical evidence is visibly separated from textbook/modern supplement material.",
    sourceSlides: [],
  },
  {
    eyebrow: "Course foundation · L12 Part B",
    title: "Sequence models connect observations across time or space",
    content: (
      <div className="tree-layout m11-source-pair">
        <SearchSourceImage
          alt="Complete course source slide motivating reasoning over time or space"
          caption="Exact source page 12 · speech recognition, robot localization, user attention, and medical monitoring."
          file="slide-12.png"
          sourceRoot={L12_MDP_RENDER_ROOT}
        />
        <section>
          <span>Knowledge point · why sequence matters</span>
          <h3>A single observation has no memory</h3>
          <p>
            Speech, position, attention, and health evolve. A sequential model
            represents a state at each step and specifies how belief or state
            can propagate between steps.
          </p>
          <SearchCallout label="Retrieval prompt" tone="cyan">
            For robot localization, what must the state preserve so that the
            next-step distribution no longer needs the entire path history?
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Preserve source page 12 in full. Ask students to name the state variable and observation for one of the four source applications.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Course foundation · State and dynamics",
    title: "A Markov model starts with state, an initial distribution, and transitions",
    content: (
      <div className="tree-layout m11-source-pair">
        <SearchSourceImage
          alt="Complete course source slide defining Markov-model state and transitions"
          caption="Exact source page 13 · X₁ through X₄, initial-state probabilities, and transition dynamics."
          file="slide-13.png"
          sourceRoot={L12_MDP_RENDER_ROOT}
        />
        <section>
          <span>Read the notation</span>
          <h3>X<sub>t</sub> is the state at step t</h3>
          <ul>
            <li><strong>P(X₁):</strong> uncertainty before the sequence begins.</li>
            <li><strong>P(X<sub>t</sub>|X<sub>t−1</sub>):</strong> how state evolves one step.</li>
            <li><strong>State space:</strong> every value X<sub>t</sub> may take.</li>
          </ul>
          <SearchCallout label="Terminology correction" tone="amber">
            Equal transition probabilities at every time are a
            <strong> time-homogeneous transition assumption</strong>, not a
            requirement of every Markov model and not the same as a stationary
            state distribution.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve source page 13. Explicitly correct “stationarity assumption” to time-homogeneous transitions. Contrast a time-homogeneous model with a stationary distribution.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Course foundation · Factorization",
    title: "The Markov assumption shortens the chain-rule history",
    content: (
      <div className="m11-source-triptych">
        {[14, 15, 16].map(number => (
          <SearchSourceImage
            alt={`Complete course source slide ${number} on Markov-chain factorization`}
            caption={`Exact source page ${number} · select to inspect every equation.`}
            file={`slide-${number}.png`}
            key={number}
            sourceRoot={L12_MDP_RENDER_ROOT}
          />
        ))}
        <SearchCallout label="Derived factorization" tone="green">
          Chain rule: P(x₁:ₜ)=P(x₁)∏<sub>i=2</sub><sup>T</sup>
          P(x<sub>i</sub>|x₁:ᵢ₋₁). First-order Markov:
          P(x<sub>i</sub>|x₁:ᵢ₋₁)=P(x<sub>i</sub>|x<sub>i−1</sub>), so
          P(x₁:ₜ)=P(x₁)∏<sub>i=2</sub><sup>T</sup>P(x<sub>i</sub>|x<sub>i−1</sub>).
        </SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve source pages 14–16 in full. First identify the chain rule as an identity, then name the first-order conditional-independence assumption that permits the shorter factors.",
    sourceSlides: [14, 15, 16],
  },
  {
    eyebrow: "Course foundation · Conditional independence",
    title: "Given the present, earlier history adds no information about the next state",
    content: (
      <div className="m11-source-triptych">
        {[17, 18, 19].map(number => (
          <SearchSourceImage
            alt={`Complete course source slide ${number} on Markov conditional independence`}
            caption={`Exact source page ${number} · proof, recap, and first-order property.`}
            file={`slide-${number}.png`}
            key={number}
            sourceRoot={L12_MDP_RENDER_ROOT}
          />
        ))}
        <SearchCallout label="Correction to source page 19" tone="amber">
          The correct statement is: <strong>past and future are conditionally
          independent given the present</strong>. The source phrase “independent
          of the present” reverses the conditioning relationship.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve source pages 17–19. State X_t ⟂ X_1:t−2 | X_t−1, then ask students to explain what information is discarded and what the state must retain.",
    sourceSlides: [17, 18, 19],
  },
  {
    eyebrow: "Course foundation · Representation",
    title: "An unrolled first-order chain is a Bayesian network",
    content: (
      <div className="tree-layout m11-source-pair">
        <SearchSourceImage
          alt="Complete course source slide representing a Markov chain as a Bayesian network"
          caption="Exact source page 19 · X₁ → X₂ → X₃ → X₄, extendable to a chosen horizon."
          file="slide-19.png"
          sourceRoot={L12_MDP_RENDER_ROOT}
        />
        <section>
          <span>Graph reading</span>
          <h3>X₁ → X₂ → X₃ → ··· → X<sub>T</sub></h3>
          <p>
            Truncating at a finite horizon yields a directed acyclic graph.
            Local transition factors multiply into the full trajectory
            distribution.
          </p>
          <SearchCallout label="Pair check" tone="cyan">
            In X₁→X₂→X₃→X₄, is X₁ independent of X₄? Not necessarily. It is
            independent of X₄ <em>conditional on</em> X₂ or X₃.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Use d-separation language lightly. Students distinguish marginal dependence along the chain from conditional independence after an intermediate state is known.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Course foundation · Weather chain",
    title: "One transition model has three equivalent representations",
    content: (
      <div className="tree-layout m11-source-pair">
        <SearchSourceImage
          alt="Complete weather Markov-chain source slide with CPT graph and transition matrix"
          caption="Exact source page 20 · the complete CPT, transition graph, matrix, and initial all-sun distribution."
          file="slide-20.png"
          sourceRoot={L12_MDP_RENDER_ROOT}
        />
        <section>
          <span>Translate without changing meaning</span>
          <h3>P(next state | current state)</h3>
          <ul>
            <li>sun→sun 0.9; sun→rain 0.1</li>
            <li>rain→sun 0.3; rain→rain 0.7</li>
            <li>Each row or outgoing edge set sums to 1.</li>
          </ul>
          <SearchCallout label="Representation check" tone="green">
            The CPT is easiest to audit, the graph highlights paths, and the
            matrix supports repeated linear-algebra updates.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve source page 20 and all three representations. Have students map one CPT row to graph edges and to a matrix row before continuing.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Course foundation · Worked prediction",
    title: "From all sun, one step produces 0.9 sun and 0.1 rain",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Complete course source slide asking for the weather distribution after one step"
          caption="Exact source page 21 · predict before using the interactive calculation."
          file="slide-21.png"
          sourceRoot={L12_MDP_RENDER_ROOT}
        />
        <WeatherPredictionStudio />
      </div>
    ),
    note: "Timing: 4 minutes. Preserve source page 21. Students first calculate day 2 from the all-sun initial distribution, then advance the studio and verbalize the law of total probability.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Course foundation · Distribution propagation",
    title: "Forward prediction repeatedly applies the same transition operator",
    content: (
      <div className="iteration-comparison">
        <article>
          <span>Exact source page 22 · recursion</span>
          <SearchSourceImage
            alt="Complete course source slide defining Markov-chain forward prediction"
            caption="The source calls this a mini-forward algorithm; here it is prediction without observations."
            file="slide-22.png"
            sourceRoot={L12_MDP_RENDER_ROOT}
          />
        </article>
        <article>
          <span>Exact source page 23 · three initial beliefs</span>
          <SearchSourceImage
            alt="Complete course source slide showing repeated weather-distribution propagation"
            caption="All-sun, all-rain, and a third initial distribution are propagated toward the same limit."
            file="slide-23.png"
            sourceRoot={L12_MDP_RENDER_ROOT}
          />
        </article>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve source pages 22–23. Correct “mini-forward algorithm” to Markov-chain forward prediction; HMM filtering adds an observation update that is absent here.",
    sourceSlides: [22, 23],
  },
  {
    eyebrow: "Course foundation · Long-run behavior",
    title: "A stationary distribution is a fixed point—not a universal convergence promise",
    content: (
      <div className="iteration-comparison">
        <article>
          <span>Exact source page 24 · fixed point</span>
          <SearchSourceImage
            alt="Complete course source slide introducing stationary distributions"
            caption="A stationary distribution π satisfies π = πT under a consistent matrix convention."
            file="slide-24.png"
            sourceRoot={L12_MDP_RENDER_ROOT}
          />
        </article>
        <article>
          <span>Exact source page 25 · weather solution</span>
          <SearchSourceImage
            alt="Complete course source slide solving the weather-chain stationary distribution"
            caption="For this weather chain, the limiting distribution is 0.75 sun and 0.25 rain."
            file="slide-25.png"
            sourceRoot={L12_MDP_RENDER_ROOT}
          />
        </article>
        <SearchCallout label="Convergence correction" tone="amber">
          This finite weather chain converges because it is irreducible and
          aperiodic. In general, stationary distributions may be nonunique and a
          chain may fail to converge from every initial distribution.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve source pages 24–25. Solve p_sun=.9p_sun+.3(1−p_sun)=.75. Replace “time equals infinity” with the limit as t approaches infinity and state the convergence conditions.",
    sourceSlides: [24, 25],
  },
  {
    eyebrow: "Textbook/modern supplement · Prediction versus control",
    title: "A Markov chain predicts; an MDP adds choices and consequences",
    content: (
      <div className="m11-chain-mdp">
        <article>
          <span>Markov chain</span>
          <h3>Current state → random next state</h3>
          <p>P(s′|s)</p>
          <ul>
            <li>No decision variable</li>
            <li>Models how a process evolves</li>
            <li>Question: what will happen?</li>
          </ul>
        </article>
        <div aria-hidden="true">+</div>
        <article>
          <span>Decision layer</span>
          <h3>Choose action a in state s</h3>
          <p>P(s′|s,a) and R(s,a,s′)</p>
          <ul>
            <li>Policy selects actions</li>
            <li>Rewards encode the objective</li>
            <li>Question: what should the agent do?</li>
          </ul>
        </article>
      </div>
    ),
    note: "Timing: 3 minutes. Label this and every following MDP slide as textbook/modern supplement because the selected historical deck contains Markov chains but no actions, rewards, policies, Bellman equations, or value iteration.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · MDP definition",
    title: "An MDP is the tuple ⟨S, A, P, R, γ⟩",
    content: (
      <div className="m11-tuple">
        <article><strong>S</strong><h3>States</h3><p>Information the model treats as sufficient for predicting the next transition and reward.</p></article>
        <article><strong>A</strong><h3>Actions</h3><p>Choices available to the agent; A(s) may depend on the state.</p></article>
        <article><strong>P</strong><h3>Transitions</h3><p>P(s′|s,a), a probability distribution over next states.</p></article>
        <article><strong>R</strong><h3>Reward</h3><p>R(s,a,s′), the immediate scalar signal used by the objective.</p></article>
        <article><strong>γ</strong><h3>Discount</h3><p>0≤γ&lt;1 for continuing discounted tasks; weights later rewards.</p></article>
        <SearchCallout label="Markov requirement" tone="cyan">
          Given the modeled state and current action, the distribution of next
          state and reward must not require additional history. If it does, the
          state representation is insufficient.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. AIMA 3e Chapter 17 supplement. Have students instantiate all five components for a campus delivery robot. Mention finite-horizon or episodic variants where γ=1 can be well-defined.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Transition semantics",
    title: "Actions change transition distributions; they do not guarantee outcomes",
    content: (
      <div className="m11-transition-demo">
        <section>
          <span>Example · move Right</span>
          <h3>P(s′|s,Right)</h3>
          <div className="m11-transition-arrows">
            <article><strong>0.80</strong><span>move right</span></article>
            <article><strong>0.10</strong><span>slip up</span></article>
            <article><strong>0.10</strong><span>slip down</span></article>
          </div>
          <p>Walls redirect an attempted move to “stay” in this model.</p>
        </section>
        <div>
          <ValueGrid values={initialGridValues()} />
          <SearchCallout label="Probability audit" tone="green">
            For every state-action pair, Σ<sub>s′</sub>P(s′|s,a)=1. Deterministic
            dynamics are the special case with one successor at probability 1.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Students identify the three successor probabilities for one nonterminal cell and explain what happens when a slip collides with a wall.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Reward design",
    title: "Reward is the formal objective—not a label for what humans value",
    content: (
      <div className="m11-reward-design">
        <section>
          <span>Gridworld reward model</span>
          <h3>+1 goal · −1 hazard · −0.04 per nonterminal step</h3>
          <p>
            The living cost favors shorter paths, but it can also change risk
            preference. A more negative cost may drive the agent near hazards;
            a positive living reward may encourage endless wandering.
          </p>
        </section>
        <ol>
          <li><strong>Specify</strong><span>Whose outcome is represented?</span></li>
          <li><strong>Stress-test</strong><span>Can the objective be gamed?</span></li>
          <li><strong>Constrain</strong><span>Which harms are unacceptable regardless of reward?</span></li>
          <li><strong>Monitor</strong><span>Does deployment differ from the modeled setting?</span></li>
        </ol>
      </div>
    ),
    note: "Timing: 3 minutes. Ask pairs for one reward-hacking behavior in delivery routing. Make clear that an optimal policy is optimal only for the specified model and reward.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Return and discount",
    title: "Return adds immediate and discounted future rewards",
    content: <DiscountReturnExplorer />,
    note: "Timing: 3 minutes. Define G_t=R_{t+1}+γR_{t+2}+γ²R_{t+3}+…. Students predict which gamma values make the later reward of 8 influential before selecting each button.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Policy and value",
    title: "A policy chooses; a value function predicts long-run return",
    content: (
      <div className="m11-policy-value">
        <article>
          <span>Policy</span>
          <h3>π(a|s)</h3>
          <p>A distribution over actions in each state. Deterministic π(s) is a special case.</p>
          <b>Question answered: What will the agent choose?</b>
        </article>
        <article>
          <span>State value</span>
          <h3>V<sup>π</sup>(s)=E<sub>π</sub>[G<sub>t</sub>|S<sub>t</sub>=s]</h3>
          <p>Expected return from state s when policy π is followed.</p>
          <b>Question answered: How good is this state under π?</b>
        </article>
        <article>
          <span>Action value</span>
          <h3>Q<sup>π</sup>(s,a)=E<sub>π</sub>[G<sub>t</sub>|s,a]</h3>
          <p>Expected return after taking a now and following π afterward.</p>
          <b>Question answered: How good is this choice?</b>
        </article>
      </div>
    ),
    note: "Timing: 3 minutes. Use one grid cell to distinguish reward, state value, and action value. Ask why a high immediate reward need not imply the highest Q-value.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Bellman expectation",
    title: "Bellman expectation decomposes value into one step plus the remainder",
    content: <BellmanExpectationBackup />,
    note: "Timing: 4 minutes. Work the three lines only after predictions. State Vπ(s)=Σ_aπ(a|s)Σ_s′P(s′|s,a)[R(s,a,s′)+γVπ(s′)]. This is numeric backup 1.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Expectation versus optimality",
    title: "Policy evaluation averages; optimal control maximizes",
    content: (
      <div className="m11-bellman-compare">
        <article>
          <span>Bellman expectation</span>
          <h3>V<sup>π</sup>(s)=Σ<sub>a</sub>π(a|s)Σ<sub>s′</sub>P(s′|s,a)[R+γV<sup>π</sup>(s′)]</h3>
          <p>Evaluate a specified policy—even if it sometimes chooses a weaker action.</p>
        </article>
        <article>
          <span>Bellman optimality</span>
          <h3>V*(s)=max<sub>a</sub>Σ<sub>s′</sub>P(s′|s,a)[R+γV*(s′)]</h3>
          <p>Choose the action whose expected one-step backup is largest.</p>
        </article>
        <SearchQuickCheck
          correct={1}
          explanation="The max operator changes policy evaluation into an optimal-control backup. Expectation over successor states remains because transitions can still be stochastic."
          options={[
            "Replace the successor-state expectation with a maximum",
            "Replace the policy-weighted action average with a maximum",
            "Remove the immediate reward",
          ]}
          question="Which change turns Bellman expectation into Bellman optimality?"
        />
      </div>
    ),
    note: "Timing: 3 minutes. Students answer before revealing feedback. Emphasize: maximize over controllable actions; average over uncontrollable stochastic outcomes.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Numeric backup 2",
    title: "A Bellman optimality backup compares every action at one state",
    content: <OptimalBackupExplorer />,
    note: "Timing: 3 minutes. Use γ=.9, living reward −.04, and displayed successor values. Students calculate one action each, then compare. Numeric backup 2 yields V_new(s)=.59 and greedy action Right.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Value-iteration algorithm",
    title: "Value iteration applies Bellman optimality synchronously until change is small",
    content: (
      <div className="m11-algorithm">
        <ol>
          <li><strong>Initialize</strong><span>Choose V₀(s), often zero for nonterminals.</span></li>
          <li><strong>Back up</strong><span>V<sub>k+1</sub>(s) ← max<sub>a</sub>Σ<sub>s′</sub>P(s′|s,a)[R+γV<sub>k</sub>(s′)].</span></li>
          <li><strong>Measure</strong><span>Δ ← max<sub>s</sub>|V<sub>k+1</sub>(s)−V<sub>k</sub>(s)|.</span></li>
          <li><strong>Repeat</strong><span>Stop by a justified residual or iteration rule.</span></li>
          <li><strong>Extract</strong><span>π(s) ← argmax<sub>a</sub> one-step lookahead using final V.</span></li>
        </ol>
        <SearchCallout label="Synchronous means previous sweep" tone="amber">
          Every V<sub>k+1</sub>(s) uses V<sub>k</sub>, not values already updated
          during the same sweep. In-place variants can work, but they are a
          different update schedule.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Walk line by line. Have students identify initialization, backup, residual, stopping, and policy extraction before the interactive sweep.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Dynamic lab",
    title: "Watch value information move through a 3×3 gridworld",
    content: <GridworldValueIteration />,
    note: "Timing: 5 minutes. Advance sweeps 0–4 one at a time, then run to 30. Students predict which cells change next and toggle the greedy policy. Explain that this lab uses deterministic transitions while the general equation supports stochastic dynamics.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Convergence and stopping",
    title: "A small Bellman residual is solver evidence, not real-world validation",
    content: (
      <div className="m11-convergence">
        <section>
          <span>Discounted finite MDP</span>
          <h3>The Bellman optimality operator is a γ-contraction</h3>
          <p>
            With 0≤γ&lt;1 and bounded rewards, repeated optimality backups
            converge to a unique V*. The residual Δ measures numerical change
            under the model.
          </p>
        </section>
        <div>
          <article><strong>Iteration rule</strong><p>Stop after a fixed compute budget; simple, but no direct accuracy guarantee.</p></article>
          <article><strong>Residual rule</strong><p>Stop when max state change is below a chosen tolerance.</p></article>
          <article><strong>Policy stability</strong><p>Monitor whether greedy actions stop changing; ties need care.</p></article>
          <SearchCallout label="Do not conflate errors" tone="amber">
            Small iteration error does not imply small transition-model error,
            reward-specification error, or deployment risk.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. State the discounted finite-MDP conditions. Ask students which error a Bellman residual measures and name two errors it cannot detect.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Policy extraction",
    title: "Once values stabilize, one-step lookahead yields a greedy policy",
    content: <PolicyExtractionLab />,
    note: "Timing: 3 minutes. Students select two states, predict the best action, and compare all Q backups. Discuss ties and why extracted arrows depend on the modeled transitions and reward.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment · Model and evidence audit",
    title: "An elegant solution can still optimize the wrong model",
    content: <MdpAssumptionAudit />,
    note: "Timing: 3 minutes. Run all four tabs. Teams choose one claim, give a diagnosis, and propose evidence. Collect one response that clearly separates state sufficiency, reward design, dynamics shift, and solver convergence.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative assessment · Readings and exit ticket",
    title: "Model the future, choose a policy, and defend the assumptions",
    content: (
      <div className="m11-exit">
        <ol>
          <li><strong>Represent</strong><span>Write ⟨S,A,P,R,γ⟩ for a two-state decision problem.</span></li>
          <li><strong>Calculate</strong><span>Complete one Bellman expectation or optimality backup.</span></li>
          <li><strong>Explain</strong><span>Why is an MDP not merely a Markov chain?</span></li>
          <li><strong>Audit</strong><span>Name one omitted variable or reward failure and evidence that would reveal it.</span></li>
        </ol>
        <section>
          <span>Required and supplemental reading</span>
          <h3>Continue beyond the classroom demo</h3>
          <ul>
            <li>Course source: L12 Part B, pages 12–25 — Markov-chain foundations.</li>
            <li>Russell &amp; Norvig, <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed., Chapter 17.</li>
            <li>Sutton &amp; Barto, <em>Reinforcement Learning: An Introduction</em>, 2nd ed., Sections 3.1–4.4.</li>
          </ul>
          <SearchCallout label="Source boundary" tone="cyan">
            The historical deck supports the Markov-chain portion. MDP tuples,
            actions, rewards, policies, Bellman equations, and value iteration
            are textbook/modern supplements added for this meeting.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Collect the four-part exit ticket. Total planned meeting time is 75 minutes. Use the reading boundary to reinforce what came from the exact course deck and what was added from the textbooks.",
    sourceSlides: [],
  },
];

export function Meeting11Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 6 · Meeting 11"
      meetingTitle="Markov Decision Processes, Policies, and Value Iteration"
      resolveSourceReference={sourceSlide => ({
        deckLabel: "L12_StochasticMethods · Part B",
        image: `${L12_MDP_RENDER_ROOT}/slide-${String(sourceSlide).padStart(2, "0")}.png`,
        key: `l12-mdp:${sourceSlide}`,
        page: sourceSlide,
      })}
      slides={slides}
      sourceCollectionLabel="L12_StochasticMethods · Part B"
    />
  );
}
