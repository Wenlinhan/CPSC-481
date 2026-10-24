"use client";

import { useMemo, useState, type ReactNode } from "react";
import "../styles/meeting11.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const L12_MDP_RENDER_ROOT = "/course-source/l12-mdp/slide-renders";
const L12_MDP_MEDIA_ROOT = "/course-source/l12-mdp/media";

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

function MarkovChainDiagram({ extended = false }: { extended?: boolean }) {
  return (
    <div className="m11-chain-diagram" aria-label="First-order Markov chain">
      {["X₁", "X₂", "X₃", "X₄"].map((label, index) => (
        <div className="m11-chain-step" key={label}>
          <span>{label}</span>
          {(index < 3 || extended) && <b aria-hidden="true">→</b>}
        </div>
      ))}
      {extended && <em>…</em>}
    </div>
  );
}

function SequenceMotivation() {
  const cases = [
    ["Speech recognition", "phoneme or word position", "acoustic frames"],
    ["Robot localization", "location and heading", "sensor readings"],
    ["User attention", "attention state", "clicks and gaze"],
    ["Medical monitoring", "patient condition", "vital signs"],
  ];
  return (
    <div className="m11-sequence-motivation">
      <section>
        <span>Original knowledge point</span>
        <h3>Reason about a sequence of observations</h3>
        <p>Introduce time—or space—because the current observation alone may not identify the underlying state.</p>
      </section>
      <div>
        {cases.map(([name, state, observation]) => (
          <article key={name}>
            <img className="m11-application-image" src={`/lesson-visuals/lesson13-${name.toLowerCase().replaceAll(" ", "-")}.svg`} alt="" aria-hidden="true" />
            <strong>{name}</strong>
            <p><b>Hidden state:</b> {state}</p>
            <p><b>What we observe:</b> {observation}</p>
          </article>
        ))}
      </div>
      <SearchCallout label="Retrieval prompt" tone="cyan">
        For robot localization, what must the state preserve so the next-step distribution no longer needs the entire path history?
      </SearchCallout>
    </div>
  );
}

function MarkovModelFoundation() {
  return (
    <div className="m11-foundation-grid">
      <section className="m11-concept-card">
        <span>State sequence</span>
        <MarkovChainDiagram extended />
        <div className="m11-formula-row"><strong>P(X₁)</strong><strong>P(Xₜ | Xₜ₋₁)</strong></div>
      </section>
      <section className="m11-definition-stack">
        <article><strong>State Xₜ</strong><p>The value of X at time t.</p></article>
        <article><strong>Initial distribution P(X₁)</strong><p>Uncertainty before the sequence begins.</p></article>
        <article><strong>Transition dynamics P(Xₜ|Xₜ₋₁)</strong><p>How the state evolves one step.</p></article>
      </section>
      <SearchCallout label="Terminology correction" tone="amber">
        Reusing the same transition probabilities at every time is a <strong>time-homogeneous transition assumption</strong>. It is not required by every Markov model and is not the same as a stationary state distribution.
      </SearchCallout>
    </div>
  );
}

function MarkovFactorizationLesson() {
  return (
    <div className="m11-factorization-lesson">
      <MarkovChainDiagram extended />
      <div className="m11-derivation-steps">
        <article>
          <span>1 · Chain rule identity</span>
          <p>P(x₁:ₜ) = P(x₁) ∏<sub>i=2</sub><sup>T</sup> P(xᵢ | x₁:ᵢ₋₁)</p>
          <small>Valid for every joint distribution.</small>
        </article>
        <article>
          <span>2 · First-order assumption</span>
          <p>Xᵢ ⟂ X₁:ᵢ₋₂ | Xᵢ₋₁</p>
          <small>The present state screens off earlier history.</small>
        </article>
        <article>
          <span>3 · Markov factorization</span>
          <p>P(x₁:ₜ) = P(x₁) ∏<sub>i=2</sub><sup>T</sup> P(xᵢ | xᵢ₋₁)</p>
          <small>A modeling assumption makes the factors local.</small>
        </article>
      </div>
      <SearchCallout label="In-class check" tone="green">
        Which line is a probability identity, and which line introduces the Markov modeling assumption?
      </SearchCallout>
    </div>
  );
}

function ConditionalIndependenceLesson() {
  return (
    <div className="m11-ci-lesson">
      <img alt="Robot states X1 through X4 connected through time" src={`${L12_MDP_MEDIA_ROOT}/image49.png`} />
      <div className="m11-ci-cards">
        <article><span>Explicit assumption</span><strong>Xₜ ⟂ X₁:ₜ₋₂ | Xₜ₋₁</strong><p>Each state needs only the previous state.</p></article>
        <article><span>Implied property</span><strong>past ⟂ future | present</strong><p>Knowing the present blocks information flow along the chain.</p></article>
        <article><span>Proof idea</span><strong>factor, cancel, normalize</strong><p>For example, P(X₁|X₂,X₃,X₄)=P(X₁|X₂).</p></article>
      </div>
      <SearchCallout label="Correction to the original wording" tone="amber">
        Past and future are conditionally independent <strong>given the present</strong>; they are not “independent of the present.”
      </SearchCallout>
    </div>
  );
}

function UnrolledChainLesson() {
  return (
    <div className="m11-unrolled-chain">
      <img alt="Four robot states illustrating a temporal sequence" src={`${L12_MDP_MEDIA_ROOT}/image49.png`} />
      <MarkovChainDiagram extended />
      <section>
        <article><span>Graph form</span><strong>A growable Bayesian network</strong><p>Truncate at horizon T to obtain a finite directed acyclic graph.</p></article>
        <article><span>Probability form</span><strong>Multiply local factors</strong><p>P(x₁)P(x₂|x₁)…P(xₜ|xₜ₋₁).</p></article>
        <article><span>Independence form</span><strong>Condition on an intermediate state</strong><p>X₁ and X₄ may be dependent marginally, but are independent given X₂ or X₃.</p></article>
      </section>
    </div>
  );
}

function WeatherRepresentations() {
  return (
    <div className="m11-weather-representations">
      <img alt="Five-day sun and rain sequence from the course source" src={`${L12_MDP_MEDIA_ROOT}/image50.png`} />
      <div className="m11-weather-models">
        <article>
          <span>CPT</span>
          <table><thead><tr><th>current</th><th>next</th><th>P</th></tr></thead><tbody>
            <tr><td>sun</td><td>sun</td><td>.9</td></tr><tr><td>sun</td><td>rain</td><td>.1</td></tr>
            <tr><td>rain</td><td>sun</td><td>.3</td></tr><tr><td>rain</td><td>rain</td><td>.7</td></tr>
          </tbody></table>
        </article>
        <article className="m11-state-graph"><span>State graph</span><div><b>sun</b><i>.9 loop · .1 → rain</i><b>rain</b><i>.7 loop · .3 → sun</i></div></article>
        <article><span>Matrix</span><p className="m11-matrix">T = [ .9&nbsp; .1<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.3&nbsp; .7 ]</p><small>Rows: current state; columns: next state.</small></article>
      </div>
      <SearchCallout label="Representation check" tone="green">Map one CPT row to the matching outgoing graph edges and matrix row. Each row must sum to 1.</SearchCallout>
    </div>
  );
}

function OneStepWeatherLesson() {
  return (
    <div className="m11-one-step">
      <section>
        <span>Given</span><h3>P₁(sun)=1.0 · P₁(rain)=0.0</h3>
        <img alt="Robot considering weather on a future day" src={`${L12_MDP_MEDIA_ROOT}/image53.png`} />
      </section>
      <section>
        <span>Law of total probability</span>
        <p>P₂(sun) = P(sun|sun)P₁(sun) + P(sun|rain)P₁(rain)</p>
        <strong>= 0.9(1.0) + 0.3(0.0) = 0.9</strong>
        <p>P₂(rain) = 0.1(1.0) + 0.7(0.0) = 0.1</p>
        <SearchCallout label="Predict before revealing" tone="cyan">Why must both next-state probabilities add to 1?</SearchCallout>
      </section>
    </div>
  );
}

function ForwardPredictionLesson() {
  const rows = [
    ["All sun", "(1.000, 0.000)", "(0.900, 0.100)", "(0.840, 0.160)", "(0.804, 0.196)"],
    ["All rain", "(0.000, 1.000)", "(0.300, 0.700)", "(0.480, 0.520)", "(0.588, 0.412)"],
  ];
  return (
    <div className="m11-forward-lesson">
      <section><img alt="Robot using a weather model to predict future days" src={`${L12_MDP_MEDIA_ROOT}/image53.png`} /><div><span>Forward prediction</span><p>Pₜ(xₜ)=Σ<sub>xₜ₋₁</sub>P(xₜ|xₜ₋₁)Pₜ₋₁(xₜ₋₁)</p><small>Prediction only: no observation update.</small></div></section>
      <table><thead><tr><th>initial belief</th><th>P(X₁)</th><th>P(X₂)</th><th>P(X₃)</th><th>P(X₄)</th><th>limit</th></tr></thead><tbody>
        {rows.map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}<td>(.750, .250)</td></tr>)}
        <tr><td>Any p</td><td>(p, 1−p)</td><td colSpan={3}>repeated transition updates</td><td>(.750, .250)</td></tr>
      </tbody></table>
    </div>
  );
}

function StationaryDistributionLesson() {
  return (
    <div className="m11-stationary-lesson">
      <section>
        <img alt="Sequence converging from mixed blobs to one stable purple blob" src={`${L12_MDP_MEDIA_ROOT}/image68.png`} />
        <article><span>Definition</span><h3>A stationary distribution π is unchanged by one transition</h3><p>π = πT, or π(x′)=ΣₓP(x′|x)π(x).</p></article>
      </section>
      <div className="m11-stationary-work">
        <article><span>Weather equations</span><p>π(sun)=.9π(sun)+.3π(rain)</p><p>π(rain)=.1π(sun)+.7π(rain)</p><p>π(sun)+π(rain)=1</p></article>
        <article><span>Solve</span><strong>π(sun)=¾</strong><strong>π(rain)=¼</strong></article>
        <SearchCallout label="Convergence condition" tone="amber">This chain converges because it is finite, irreducible, and aperiodic. A stationary distribution alone does not guarantee convergence from every start.</SearchCallout>
      </div>
    </div>
  );
}

const baseSlides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 10 · Lesson 13 · Sequential decisions",
    title: "From predicting the next state to choosing an action",
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
    note: "Timing: 2 minutes. Open with the central question: if an agent can predict several possible futures, how should it choose its next move? Point to the four-part path: describe the model, evaluate a policy, improve the policy, and audit the assumptions. Tell students that the first pages build Markov-chain intuition and the later pages add actions, rewards, and value iteration. Ask: what could go wrong if the model leaves out something important?",
    sourceSlides: [],
  },
  {
    eyebrow: "Course foundation · L12 Part B",
    title: "Some problems make more sense as a sequence",
    content: <SequenceMotivation />,
    note: "Timing: 3 minutes. Use the four pictures as concrete examples. In speech recognition, the hidden state is the phoneme or word position and the audio frame is the observation. In robot localization, location and heading are hidden while sensors provide readings. For user attention and medical monitoring, clicks or vital signs are observations, not the underlying condition itself. Ask students to choose one example and say why a single observation may be ambiguous without its sequence history.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Course foundation · State and dynamics",
    title: "A Markov model needs a state, a starting belief, and a one-step rule",
    content: <MarkovModelFoundation />,
    note: "Timing: 3 minutes. Point to the three ingredients: the state X at time t, the starting probabilities P(X₁), and the transition rule P(Xₜ|Xₜ₋₁). Explain that the transition rule answers one local question: given the current state, what can happen next? Clarify the common confusion: reusing the same transition rule is a modeling choice, while a stationary distribution is a probability distribution that remains unchanged after a transition. Ask students which of the three ingredients describes uncertainty before the process starts.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Course foundation · Factorization",
    title: "The present state carries the history we need",
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
    note: "Timing: 4 minutes. Start with the full chain rule: every new state could depend on the entire earlier history. Then trace the highlighted simplification. The first-order Markov assumption says that once Xₜ₋₁ is known, older states do not add information about Xₜ, so each factor becomes P(xᵢ|xᵢ₋₁). Emphasize that the chain rule is always true; the shorter factorization is an assumption about the process. Ask students what information the state must retain for that assumption to be reasonable.",
    sourceSlides: [14, 15, 16],
  },
  {
    eyebrow: "Course foundation · Conditional independence",
    title: "Once we know the present, the distant past is no longer needed",
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
    note: "Timing: 4 minutes. Read the statement in words before reading the symbols: given the present state, the distant past does not change the distribution of the next state. Point out the conditioning bar carefully; the past and future become independent only after the present is known. Ask: what would be lost if the state omitted battery level, heading, or another variable that affects the next step? Use the answer to connect the Markov assumption to state design.",
    sourceSlides: [17, 18, 19],
  },
  {
    eyebrow: "Course foundation · Representation",
    title: "A sequence can be drawn as a simple Bayesian network",
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
    note: "Timing: 3 minutes. Follow the arrows from X₁ to X₂ to X₃ to X₄. Without observing the middle, X₁ and X₄ can still be related. If X₂ is known, the path is blocked for predicting X₄ from X₁. Say this plainly as ‘the middle state carries the relevant information forward.’ Ask students whether the endpoints are unconditionally independent, then ask how their answer changes when X₂ is given.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Course foundation · Weather chain",
    title: "The same weather model can be shown three ways",
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
    note: "Timing: 3 minutes. Use the weather example to show that a CPT, a graph, and a matrix are three views of one model. Read the sun row: from sun, the next state is sun with probability .9 and rain with probability .1. Then match those numbers to the outgoing arrows and the matrix row. Repeat briefly for rain and check that each row sums to one. Ask which representation is easiest for checking probabilities and which is easiest for repeated calculation.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Course foundation · Worked prediction",
    title: "Starting with sun, predict tomorrow’s weather",
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
    note: "Timing: 4 minutes. Begin with the all-sun starting belief: P₁(sun)=1 and P₁(rain)=0. Ask students to predict tomorrow before revealing the calculation. The sun term is .9(1)+.3(0)=.9; the rain term is .1(1)+.7(0)=.1. Explain that each next-state probability adds contributions from every possible current state. Advance the studio one day and ask what changed: the model is now mixing both the previous sun and rain probabilities.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Course foundation · Distribution propagation",
    title: "Repeat the one-step rule to look farther ahead",
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
    note: "Timing: 3 minutes. Read the recursion as an instruction: to predict the next distribution, multiply the current distribution by the transition model and add the compatible paths. Compare the all-sun and all-rain rows; both move toward the same long-run pattern. Call attention to what is missing: there is no new observation being incorporated here, so this is prediction rather than filtering. Ask why different starting beliefs can still approach the same limit.",
    sourceSlides: [22, 23],
  },
  {
    eyebrow: "Course foundation · Long-run behavior",
    title: "A stationary distribution is a balance point",
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
    note: "Timing: 4 minutes. Define a stationary distribution as a balance point: after one transition, the probabilities are unchanged. Let p be the sun probability, so p=.9p+.3(1−p); solving gives p=.75 and rain=.25. Distinguish the fixed point from the process reaching it: this finite chain converges because its states communicate and it is not locked into a cycle. Ask students why the phrase ‘at time infinity’ is less precise than ‘the limit as t approaches infinity.’",
    sourceSlides: [24, 25],
  },
  {
    eyebrow: "Textbook/modern supplement · Prediction versus control",
    title: "A Markov chain predicts; an MDP lets the agent choose",
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
    note: "Timing: 3 minutes. Draw the boundary between prediction and decision. A Markov chain says what the environment may do next. An MDP adds an action chosen by the agent, a transition model that depends on that action, and a reward that describes the objective. Use the delivery example: the robot can choose a route, and each route changes both risk and progress. Ask students which question belongs to a chain and which belongs to an MDP.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · MDP definition",
    title: "An MDP names five things the agent needs",
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
    note: "Timing: 4 minutes. Walk through the tuple one symbol at a time. S is the information state, A is the available choice, P is the probability of each next state, R is the immediate objective signal, and γ controls how much later rewards matter. Instantiate it for a campus delivery robot: location and battery in S, move actions in A, noisy motion in P, delivery and safety in R. Ask which missing variable would make the state insufficient.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Transition semantics",
    title: "An action changes the odds; it does not guarantee the result",
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
    note: "Timing: 3 minutes. Focus on the phrase P(s′|s,a): the action changes a distribution, not a guaranteed destination. For Right, the intended move may succeed with .80 while slips go up or down with .10 each. If a slip points into a wall, this model sends the agent back to the same cell. Have students add the three probabilities and explain why the sum must be one.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Reward design",
    title: "The reward tells the agent what counts as success",
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
    note: "Timing: 3 minutes. Explain that the reward is the formal objective the algorithm will optimize. The grid gives +1 for the goal, −1 for the hazard, and a small step cost. Ask pairs to invent a delivery behavior that earns the stated reward while violating what a person really wants. Close by saying that ‘optimal’ always means optimal for this model and this reward, not automatically safe or fair in the world.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Return and discount",
    title: "Return adds today’s reward to later rewards",
    content: <DiscountReturnExplorer />,
    note: "Timing: 3 minutes. Read the timeline from left to right. Return starts with the next reward, then adds later rewards after multiplying them by γ, γ², and so on. Ask students which button makes the reward of 8 matter most. Use γ=0 to show only the immediate reward, γ=.9 to keep substantial future value, and γ=1 to treat every listed reward equally. Clarify that γ expresses time preference, not uncertainty.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Policy and value",
    title: "A policy chooses, while a value estimates what comes next",
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
    note: "Timing: 3 minutes. Separate three ideas students often mix up. Reward is what happens immediately. Qπ(s,a) is the expected return after choosing one action. Vπ(s) averages those action values according to the policy. Point to the formulas and ask why an action with a modest immediate reward could still have a high Q-value if it leads to a valuable future state.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Bellman expectation",
    title: "The Bellman equation breaks a long-term value into one step",
    content: <BellmanExpectationBackup />,
    note: "Timing: 4 minutes. Ask students to predict the order of the three lines before revealing them. First compute the value of Right by averaging its two possible successor values. Then compute Left. Finally weight those action values by the policy probabilities .75 and .25. Say aloud that this is a policy evaluation backup: the policy chooses the action probabilities, while the environment supplies the stochastic outcomes.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Expectation versus optimality",
    title: "Evaluation averages actions; control keeps the best one",
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
    note: "Timing: 3 minutes. Use the comparison to make the operator words memorable. When uncertainty comes from the environment, average over its possible outcomes. When the agent controls the action, choose the largest action value. Ask students to point to the average in the expectation equation and the maximum in the optimality equation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Numeric backup 2",
    title: "At one state, compare every possible action",
    content: <OptimalBackupExplorer />,
    note: "Timing: 3 minutes. Have students choose one of the four actions and calculate −.04+.9V(successor). Compare the four results: Up=.32, Right=.59, Down=.32, and Left=.14. The maximum is .59, so the greedy action is Right. Emphasize that this is a one-state backup; value iteration applies the same calculation across every state.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Value-iteration algorithm",
    title: "Value iteration repeats the comparison until values settle",
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
    note: "Timing: 4 minutes. Read the algorithm as a loop. Initialize values, update every nonterminal state from the previous sweep, measure the largest change, stop when that change is small, and then extract a policy. Ask students to identify why all states use the previous sweep: synchronous updates make each iteration a clear, repeatable snapshot rather than a mixture of old and new values.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Dynamic lab",
    title: "Watch the goal’s value spread through a small grid",
    content: <GridworldValueIteration />,
    note: "Timing: 5 minutes. Start at sweep 0 and advance one sweep at a time. Ask which cells should change first; the positive goal’s value moves through neighboring cells, while the wall remains unavailable. Run to sweep 30 and toggle the policy arrows. Point out that this demonstration uses deterministic moves, even though the Bellman equation also handles stochastic transitions. Ask what would change if a move could slip.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Convergence and stopping",
    title: "A stable calculation does not prove the real system is safe",
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
    note: "Timing: 3 minutes. Define the Bellman residual as the largest change left after an update. A small residual says the numerical solver is close to a fixed point of the specified model. It does not reveal a missing state variable, a badly designed reward, a changed environment, or unsafe behavior. Ask students to name one solver error and one model error, then explain why they require different tests.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Policy extraction",
    title: "When values settle, choose the best next action",
    content: <PolicyExtractionLab />,
    note: "Timing: 3 minutes. Select a state in the grid and ask students to predict the best arrow before looking at the four Q values. Compare the backups, then explain argmax: choose the action with the largest expected return. If two actions tie, either can be selected by a deterministic policy, or a stochastic policy can share probability between them. Remind students that the arrows depend on the chosen model and reward.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment · Model and evidence audit",
    title: "A polished answer can still solve the wrong problem",
    content: <MdpAssumptionAudit />,
    note: "Timing: 4 minutes. Use the four tabs as an audit exercise. For State, ask whether the representation remembers everything needed for prediction. For Reward, ask whether the objective can be gamed. For Dynamics, ask whether conditions changed from training to deployment. For Planning, ask whether a small residual is being mistaken for real-world success. Give teams one claim, then require a diagnosis and a concrete evidence plan.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative assessment · Readings and exit ticket",
    title: "Use the model, choose a policy, and explain your assumptions",
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
    note: "Timing: 4 minutes. Close with four short prompts: represent a two-state decision problem, calculate one Bellman backup, explain why an MDP is more than a Markov chain, and name one assumption that should be audited. Ask students to answer in their own words rather than copy notation. Point to the reading list for the next step and remind them that the Markov-chain foundations and the MDP/value-iteration material are clearly identified on this page.",
    sourceSlides: [],
  },
];

const rebuiltCourseFoundation: Record<number, ReactNode> = {
  3: <MarkovFactorizationLesson />,
  4: <ConditionalIndependenceLesson />,
  5: <UnrolledChainLesson />,
  6: <WeatherRepresentations />,
  7: <OneStepWeatherLesson />,
  8: <ForwardPredictionLesson />,
  9: <StationaryDistributionLesson />,
};

const slides = baseSlides.map((slide, index) =>
  rebuiltCourseFoundation[index]
    ? { ...slide, content: rebuiltCourseFoundation[index] }
    : slide,
);

export function Meeting11Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      meetingLabel="Module 10 · Lesson 13"
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
