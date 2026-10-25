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
        <p className="m11-inline-notation"><strong>Notation:</strong> P<sub>t</sub>(sun/rain) is the probability of that weather at day t; the numbers 0.9, 0.3, 0.1, and 0.7 are transition probabilities from the current weather.</p>
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
const discountRewardMeanings = [
  "pick up package",
  "travel step",
  "complete delivery",
  "on-time bonus",
];

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
      <p className="m11-example-source">
        <strong>Where do 5, 0, 8, and 2 come from?</strong> They are invented
        rewards for one illustrative delivery episode—not measured data and not
        values from the weather or gridworld examples. Their only job is to show
        how the same reward sequence is weighted differently when γ changes.
      </p>
      <section>
        <div className="m11-reward-timeline">
          {discountRewards.map((reward, index) => (
            <article key={`${reward}-${index}`}>
              <span>t + {index}</span>
              <strong>r = {reward}</strong>
              <em>{discountRewardMeanings[index]}</em>
              <p>{gamma.toFixed(1)}<sup>{index}</sup> × {reward} = {terms[index].toFixed(2)}</p>
            </article>
          ))}
        </div>
        <div className="m11-return-total">
          <span>Discounted return from the current step t</span>
          <p className="m11-return-formula">
            G<sub>t</sub> = r<sub>t</sub> + γr<sub>t+1</sub> + γ<sup>2</sup>r<sub>t+2</sub> + …
          </p>
          <strong>G<sub>t</sub> = {total.toFixed(2)}</strong>
          <p className="m11-return-working">
            {gamma.toFixed(1) === "0.9"
              ? "5 + 0.9(0) + 0.9²(8) + 0.9³(2) = 12.938 ≈ 12.94"
              : `${terms.map(value => value.toFixed(2)).join(" + ")} = ${total.toFixed(2)}`}
          </p>
          <p>“Starting at t” means begin with the reward received now, then add every later reward with an increasing power of γ.</p>
        </div>
      </section>
      <p className="m11-notation-footnote"><strong>Notation:</strong>
        G<sub>t</sub> is the total discounted reward counted from time t onward; r<sub>t+i</sub> is the reward i steps after t; γ (gamma) is the discount factor; i counts how many steps into the future a reward occurs; and γ<sup>i</sup> applies the corresponding discount.
      </p>
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
      prompt: "Compute Qπ(s,right) from its two possible next states.",
      detail: `Qπ(s,right) = −0.1 + 0.9[0.8(4) + 0.2(2)] = ${right.toFixed(2)}`,
    },
    {
      label: "Left action",
      prompt: "Compute Qπ(s,left) from its certain next state.",
      detail: `Qπ(s,left) = −0.1 + 0.9[1.0(1)] = ${left.toFixed(2)}`,
    },
    {
      label: "Policy average",
      prompt: "Weight the two action values by the policy probabilities.",
      detail: `Vπ(s) = 0.75(${right.toFixed(2)}) + 0.25(${left.toFixed(2)}) = ${value.toFixed(3)}`,
    },
  ];

  return (
    <div className="m11-backup">
      <section>
        <span>Invented worked example · policy π at state s</span>
        <h3>π(right|s)=0.75 · π(left|s)=0.25</h3>
        <p className="m11-example-origin"><strong>Where do the numbers come from?</strong> They are synthesized assumptions chosen only to illustrate the page 16 equations—not measured data and not values from another example.</p>
        <ul className="m11-backup-givens">
          <li><strong>Both actions:</strong> immediate reward −0.1; discount γ=0.9.</li>
          <li><strong>Right:</strong> 80% chance of next value 4; 20% chance of next value 2.</li>
          <li><strong>Left:</strong> 100% chance of next value 1.</li>
          <li><strong>Policy:</strong> choose Right 75% of the time and Left 25%.</li>
        </ul>
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
              <strong>{index < revealed ? line.label : "Try this calculation"}</strong>
              <p>{index < revealed ? line.detail : line.prompt}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="m11-notation-footnote"><strong>Notation:</strong>
        π is the policy, Qπ(s,a) is the expected return after taking action a in state s, Vπ(s) is the policy’s average value at s, and E means take an expectation over possible outcomes.
      </p>
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
        <div className="m11-notation-box"><strong>Notation:</strong> Q(s,a) = value of taking action a in state s; V<sub>new</sub>(s) = updated value of state s; max = keep the largest action value.</div>
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

function explainGridSweep(sweep: number) {
  if (sweep === 0) return {
    label: "Round 0 · initialize",
    detail: "No Bellman backup has run yet. Terminal values are fixed at +1 and −1; every ordinary state starts at 0.00.",
  };
  if (sweep === 1) return {
    label: "Round 0 → 1 · the goal reaches its neighbor",
    detail: "State s01 can move directly to +1, so it becomes −0.04 + 0.9(1) = 0.86. Other ordinary states only see zeros, so their best backup is −0.04.",
  };
  if (sweep === 2) return {
    label: "Round 1 → 2 · one more step from the goal",
    detail: "State s00 now sees s01=0.86 from the previous table, so it becomes −0.04 + 0.9(0.86) = 0.734. Synchronous updating prevents the new 0.734 from traveling farther during this same round.",
  };
  if (sweep === 3) return {
    label: "Round 2 → 3 · the value turns downward",
    detail: "State s10 can move up to s00=0.734, so it becomes −0.04 + 0.9(0.734) = 0.6206. The wall blocks the shorter middle route.",
  };
  if (sweep === 4) return {
    label: "Round 3 → 4 · the bottom row is reached",
    detail: "State s20 uses the previous value s10=0.6206 and becomes −0.04 + 0.9(0.6206) = 0.5185.",
  };
  if (sweep === 5) return {
    label: "Round 4 → 5 · move across the bottom row",
    detail: "State s21 uses s20=0.5185 and becomes −0.04 + 0.9(0.5185) = 0.4267.",
  };
  if (sweep === 6) return {
    label: "Round 5 → 6 · the last state receives the path value",
    detail: "State s22 uses s21=0.4267 and becomes −0.04 + 0.9(0.4267) = 0.3440. Its best route goes left, away from the −1 terminal.",
  };
  return {
    label: `Round ${sweep - 1} → ${sweep} · values have settled`,
    detail: "Every state’s best backup reproduces its current value, so max Δ is 0. The greedy arrows now describe the stable shortest safe path toward +1.",
  };
}

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
  const sweepGuide = explainGridSweep(sweep);

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
        <div className="m11-notation-box"><strong>Notation:</strong> sweep = one update of every state; Δ (delta) = largest value change in that sweep; γ (gamma) = discount factor; s<sub>rc</sub> identifies the state at row r, column c.</div>
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
        <SearchCallout label={sweepGuide.label} tone={sweep >= 7 ? "green" : "cyan"}>
          {sweepGuide.detail} Values summarize discounted future reward; they
          are not immediate rewards.
        </SearchCallout>
      </section>
      <ValueGrid showPolicy={policy} values={values} />
    </div>
  );
}

function PolicyExtractionLab() {
  const values = gridSweeps[30];
  const [selected, setSelected] = useState("2-0");
  const selectedLabel = `s${selected.replace("-", "")}`;
  const actionRows = gridActions
    .map(action => ({
      ...action,
      successor: gridSuccessor(selected, action.id),
      successorValue: values[gridSuccessor(selected, action.id)],
      q: gridActionValue(selected, action.id, values),
    }))
    .sort((a, b) => b.q - a.q);
  const bestAction = actionRows[0];

  return (
    <div className="m11-policy-lab">
      <ValueGrid
        onSelect={setSelected}
        selected={selected}
        showPolicy
        values={values}
      />
      <section>
        <span>Selected state · {selectedLabel} (row {selected[0]}, column {selected[2]})</span>
        <h3>Extract π*(s) by taking argmax<sub>a</sub> Q(s,a)</h3>
        <div className="m11-policy-instructions">
          <strong>How to use the grid</strong>
          <ol>
            <li><b>Click an ordinary square.</b> The purple outline marks the selected state. The wall and terminal states cannot be selected.</li>
            <li><b>Read the square.</b> Its number is the settled value V*(s); its arrow is the currently extracted best action.</li>
            <li><b>Compare the four rows.</b> Each Q-value uses −0.04 + 0.9V*(successor) because moves are deterministic here.</li>
            <li><b>Find the green row.</b> It has the largest Q-value, so its action becomes π*(s).</li>
          </ol>
        </div>
        <div className="m11-notation-box"><strong>Notation:</strong> π*(s) = optimal action at state s; Q(s,a) = value of taking action a at s; argmax<sub>a</sub> = choose the action with the largest Q-value.</div>
        <ol>
          {actionRows.map((action, index) => (
            <li className={index === 0 ? "best" : ""} key={action.id}>
              <strong>{action.symbol} {action.label}</strong>
              <span>
                {action.successor === selected
                  ? "blocked or edge → stay"
                  : `move to s${action.successor.replace("-", "")}`}
                <small>−0.04 + 0.9({action.successorValue.toFixed(3)})</small>
              </span>
              <b>Q={action.q.toFixed(3)}</b>
            </li>
          ))}
        </ol>
        <SearchCallout label={`Why ${bestAction.label} becomes the arrow`} tone="green">
          Its Q-value, {bestAction.q.toFixed(3)}, is the largest of the four.
          Therefore argmax selects {bestAction.label} for π*({selectedLabel}). If
          actions tie, any tied maximizer may be chosen.
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
        <div className="m11-notation-box"><strong>Terms:</strong> state = information used to describe the current situation; reward = immediate objective signal; dynamics = transition behavior; Bellman residual = remaining numerical change after a backup.</div>
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
          <div className="m11-notation-box"><strong>Notation:</strong> x<sub>i</sub> = state at step i; x<sub>1:T</sub> = states from step 1 through T; ∏ = multiply all factors.</div>
        </article>
        <article>
          <span>2 · First-order assumption</span>
          <p>Xᵢ ⟂ X₁:ᵢ₋₂ | Xᵢ₋₁</p>
          <small>The present state screens off earlier history.</small>
          <div className="m11-notation-box"><strong>Notation:</strong> ⟂ = conditionally independent; the vertical bar | means “given.”</div>
        </article>
        <article>
          <span>3 · Markov factorization</span>
          <p>P(x₁:ₜ) = P(x₁) ∏<sub>i=2</sub><sup>T</sup> P(xᵢ | xᵢ₋₁)</p>
          <small>A modeling assumption makes the factors local.</small>
          <div className="m11-notation-box"><strong>Notation:</strong> P = probability; T = final time step; x<sub>i−1</sub> = previous state.</div>
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
        <div className="m11-notation-box"><strong>Notation:</strong> P₁ = today’s probability distribution; P₂ = tomorrow’s distribution; P(next | current) = probability of the next weather given the current weather.</div>
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
        <article><span>Definition</span><h3>A stationary distribution π is unchanged by one transition</h3><p>π = πT, or π(x′)=ΣₓP(x′|x)π(x).</p><div className="m11-notation-box"><strong>Notation:</strong> π (pi) = probability distribution; T = transition matrix; x′ = next state; Σ = add over all possible current states.</div></article>
      </section>
      <div className="m11-stationary-work">
        <article><span>Weather equations</span><p>π(sun)=.9π(sun)+.3π(rain)</p><p>π(rain)=.1π(sun)+.7π(rain)</p><p>π(sun)+π(rain)=1</p><div className="m11-notation-box"><strong>Notation:</strong> π(sun) and π(rain) = long-run probabilities. The equation π=πT means one update leaves them unchanged.</div></article>
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
    note: "An agent often has several possible futures. The central problem in this lesson is deciding what to do now when each action can change what happens later. We begin with a model of states and transitions, then add actions and rewards so the agent can make choices. A policy describes those choices. A value tells us how useful a state or action is over time. Value iteration repeatedly improves these estimates until they settle. The final part of the lesson is an audit: even a mathematically elegant policy can fail if the state, reward, or transition model leaves out something important.",
    sourceSlides: [],
  },
  {
    eyebrow: "Course foundation · L12 Part B",
    title: "Some problems make more sense as a sequence",
    content: <SequenceMotivation />,
    note: "Many problems become easier when we treat them as sequences. In speech recognition, the hidden state may be the phoneme or word position, while the microphone gives us acoustic frames. In robot localization, the hidden state is the robot’s location and heading, while sensors provide noisy readings. For user attention, clicks and gaze are observations of an attention state. In medical monitoring, vital signs are observations of a patient’s underlying condition. A single observation can be ambiguous, but a sequence gives context. The key idea is that the past helps us interpret the present and predict what comes next.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Course foundation · State and dynamics",
    title: "A Markov model needs a state, a starting belief, and a one-step rule",
    content: <MarkovModelFoundation />,
    note: "A Markov model has three basic pieces. First, Xₜ is the state at time t: the information we use to describe the situation now. Second, P(X₁) is the initial distribution, which describes our uncertainty before the sequence begins. Third, P(Xₜ|Xₜ₋₁) is the transition rule. It tells us how likely the next state is, given the current state. These are different ideas from a stationary distribution. Reusing the same transition rule at each step is a modeling choice. A stationary distribution is a probability pattern that remains unchanged after the transition is applied.",
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
        <p className="m11-notation-footnote"><strong>Notation:</strong>
          xᵢ is the state at step i; x₁:ₜ means the sequence from step 1 through T; T is the time horizon; and ∏ means multiply all of the listed factors.
        </p>
      </div>
    ),
    note: "The chain rule lets us write the probability of an entire sequence by multiplying conditional probabilities. In the unrestricted version, the next state can depend on every earlier state. A first-order Markov model makes a simplifying assumption: once we know the immediately previous state, the older history adds no extra information about the next state. That changes each factor from P(xᵢ|x₁:ᵢ₋₁) to P(xᵢ|xᵢ₋₁). The chain rule itself is always correct. The shorter expression is correct only when the state contains the information needed to summarize the past.",
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
    note: "The Markov condition says that the distant past and the future become conditionally independent once the present state is known. The word conditionally matters: the past and future can still be related when the present is hidden. Once Xₜ₋₁ is given, however, older states should not improve our prediction of Xₜ. This places a responsibility on state design. If battery level, heading, or traffic conditions affect the next transition but are omitted from the state, the Markov assumption is false for that representation. A good state keeps the information needed for prediction and leaves irrelevant history behind.",
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
    note: "The chain X₁→X₂→X₃→X₄ can also be viewed as a Bayesian network. The arrows show local dependence: each state is generated from the state just before it. X₁ and X₄ are generally related because information can travel along the path. If an intermediate state such as X₂ is known, that state carries the relevant information forward, so the distant past does not add predictive information about the future. The important distinction is between ordinary independence and conditional independence. The endpoints are not necessarily independent until the appropriate middle state is observed.",
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
          <p className="m11-notation-footnote"><strong>Notation:</strong>
            W is the weather state, T is the transition matrix, and P(next state | current state) is the probability of the next weather condition given the current one. An arrow such as sun→rain means one possible transition.
          </p>
        </section>
      </div>
    ),
    note: "The weather example shows the same transition model in three forms. The conditional probability table lists the numbers directly. The graph emphasizes possible paths. The matrix makes repeated updates convenient. From sun, the next state is sun with probability 0.9 and rain with probability 0.1. From rain, the next state is sun with probability 0.3 and rain with probability 0.7. Each row describes all possible next states, so its probabilities must add to one. Changing the representation does not change the model; it only changes how we read or calculate with it.",
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
        <p className="m11-notation-footnote"><strong>Notation:</strong>
          P₁ is the starting distribution, P₂ is the distribution after one step, and P(s′|s) is the chance of next state s′ when the current state is s. The subscript marks the time step.
        </p>
      </div>
    ),
    note: "Suppose today is certainly sunny, so P₁(sun)=1 and P₁(rain)=0. To predict tomorrow, we add the contribution from each possible current state. The probability of sun tomorrow is 0.9(1)+0.3(0)=0.9. The probability of rain tomorrow is 0.1(1)+0.7(0)=0.1. These two values form the complete next distribution. After one update, the model no longer starts from certainty: both sun and rain have positive probability. Later updates mix the transition probabilities from both parts of the current distribution.",
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
    note: "Forward prediction repeats the same one-step calculation. For every possible next state, we multiply each current-state probability by the appropriate transition probability and add the results. Starting from all sun, all rain, or a mixed distribution produces different early predictions. Over repeated updates, these starting differences become smaller and the distributions move toward the same long-run pattern. This page describes prediction only. We are not incorporating a new observation, so this is different from filtering in a hidden Markov model.",
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
        <p className="m11-notation-footnote"><strong>Notation:</strong>
          π (pi) is a probability distribution; π=πT says one transition leaves it unchanged; T is the transition matrix; and t→∞ means the long-run limit as time grows.
        </p>
      </div>
    ),
    note: "A stationary distribution is a balance point of the transition process. If π is stationary, applying the transition matrix T leaves π unchanged, so π=πT. For this weather model, let p be the long-run probability of sun. The equation is p=0.9p+0.3(1−p), which gives p=0.75. The remaining probability is rain, 0.25. This fixed point is different from saying that the process literally reaches a time called infinity. We mean that as the number of updates grows, the distribution approaches this balance point.",
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
        <p className="m11-notation-footnote"><strong>Notation:</strong>
          s is the current state, a is the action chosen by the agent, s′ is the next state, P is the transition probability, and R is the immediate reward for that state-action-outcome combination.
        </p>
      </div>
    ),
    note: "A Markov chain describes how a process changes when no one is choosing an action. An MDP adds a decision layer. In state s, the agent chooses an action a. That action affects the probability of the next state s′ and produces a reward. A delivery robot might be at an intersection, choose Right or Left, and then experience noisy motion, delay, or progress. The chain asks, ‘What is likely to happen?’ The MDP asks, ‘What should the agent choose, given the future consequences?’",
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
    note: "An MDP is summarized by five components. S is the set of states, or the information the agent uses to describe the current situation. A is the set of available actions. P(s′|s,a) gives the probability of each next state after action a in state s. R(s,a,s′) is the immediate reward for that transition. Gamma, written γ, discounts rewards that arrive later. For a campus delivery robot, S might include location and battery, A might include movement choices, P describes noisy motion, and R can represent delivery progress and safety.",
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
          <aside className="m11-grid-explainer" aria-label="How to read the gridworld">
            <strong>How to read the grid</strong>
            <div>
              <span><b>Each square</b> is one possible state or location.</span>
              <span><b>0.00</b> is the current value estimate V(s); these nonterminal states start at zero.</span>
              <span><b>s20</b> means state s at row 2, column 0. Rows count top to bottom; columns count left to right.</span>
              <span><b>Terminal / wall</b> marks an ending state with fixed value, or a blocked location the agent cannot enter.</span>
            </div>
          </aside>
          <SearchCallout label="Probability audit" tone="green">
            For every state-action pair, Σ<sub>s′</sub>P(s′|s,a)=1. Deterministic
            dynamics are the special case with one successor at probability 1.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "The expression P(s′|s,a) means the probability of ending in next state s′ when the current state is s and the chosen action is a. The grid is a map of possible states. Each ordinary cell shows its current value estimate V(s), initialized here to 0.00. A label such as s20 means row 2, column 0, with rows counted from top to bottom and columns from left to right. The green +1 and red −1 cells are terminal states, so reaching one ends the episode. The striped wall is not a state the agent may enter. In this example, moving Right succeeds with probability 0.80, slips Up with probability 0.10, and slips Down with probability 0.10. Those outcomes add to 1. If a slip points into a wall, the model sends the agent back to its current cell. Deterministic motion is the special case where one successor has probability 1.",
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
    note: "The reward is the objective the algorithm actually optimizes. In this gridworld, reaching the goal gives +1, reaching the hazard gives −1, and every nonterminal step costs −0.04. The step cost encourages shorter routes, but changing it can change the agent’s risk preference. A reward can also be incomplete. An agent might earn the stated score while causing delays, wasting energy, or taking an unsafe shortcut. Therefore, an optimal policy is optimal only for the modeled states, transitions, and rewards. It is not automatically safe, fair, or aligned with every human goal.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Return and discount",
    title: "Return adds today’s reward to later rewards",
    content: <DiscountReturnExplorer />,
    note: "The numbers 5, 0, 8, and 2 are not observations, probabilities, or values copied from the weather or gridworld examples. They are invented rewards for a small delivery episode: 5 for picking up a package, 0 for a travel step, 8 for completing the delivery, and 2 for an on-time bonus. We use this sequence only to see what discounting does. The return Gₜ means the total discounted reward counted from the current time t onward. Under the convention on this page, the formula is Gₜ=rₜ+γrₜ₊₁+γ²rₜ₊₂ and so on. The reward received now has exponent zero, so it keeps its full weight. Each reward one step farther away receives one more factor of gamma. With gamma equal to 0.9, the calculation is 5 plus 0.9 times 0, plus 0.9 squared times 8, plus 0.9 cubed times 2. Those terms are 5, 0, 6.48, and 1.458. Their sum is 12.938, which the page rounds to 12.94. With γ=0, only the immediate reward matters. With γ=1, the listed rewards receive equal weight. Gamma expresses how the objective values time; it is not a measure of uncertainty in the environment.",
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
        <p className="m11-notation-footnote">
          <strong>Notation:</strong> π (pi) = policy; s = current state; a =
          action; V<sup>π</sup>(s) = value of state s under π; Q<sup>π</sup>(s,a)
          = value of taking a in s under π; E<sub>π</sub>[ ] = expected average
          when π is followed; G<sub>t</sub> = return from time t; S<sub>t</sub>
          = state at time t; and | means “given that.”
        </p>
      </div>
    ),
    note: "A policy π describes how the agent chooses actions in each state. In the notation π(a|s), a is an action, s is the current state, and the vertical bar means ‘given that,’ so the expression means the probability of choosing action a given state s. The state value Vπ(s) is the expected long-term return when the agent starts in s and follows that policy. The action value Qπ(s,a) is more specific: it is the expected return after taking action a now and following π afterward. Eπ means an expected average when policy π is followed, Gₜ is the return from time t, and Sₜ is the state at time t. Reward is only the immediate signal, while value includes future consequences. An action with a small immediate reward can still have a high Q-value if it leads to a valuable state later.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Bellman expectation",
    title: "The Bellman equation breaks a long-term value into one step",
    content: <BellmanExpectationBackup />,
    note: "This page is a worked example of the policy and value equations on page 16. Every number is a synthesized assumption chosen to make the arithmetic visible; the numbers are not measured data and do not come from the earlier gridworld. Both actions receive an immediate reward of negative 0.1, and gamma is 0.9. If the agent chooses Right, the environment reaches a next state valued at 4 with probability 0.8 or a state valued at 2 with probability 0.2. The expected next-state value is therefore 0.8 times 4 plus 0.2 times 2, which equals 3.6. Discounting gives 0.9 times 3.6, or 3.24, and adding the immediate reward gives Qπ of s comma Right equal to 3.14. Left certainly reaches a state valued at 1, so negative 0.1 plus 0.9 times 1 gives 0.80. Finally, the fixed policy chooses Right with probability 0.75 and Left with probability 0.25. The policy value is therefore 0.75 times 3.14 plus 0.25 times 0.80, which equals 2.555. The hidden prompt now asks students to perform each specific calculation instead of vaguely saying ‘predict this line.’ This is policy evaluation: the policy is fixed, and we average over both environmental outcomes and the policy’s action choices.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Expectation versus optimality",
    title: "Expectation evaluates a policy; optimality finds the best action",
    content: (
      <div className="m11-bellman-compare">
        <article>
          <span>Bellman expectation</span>
          <b className="m11-bellman-question">Question: “How good is state s if we keep following policy π?”</b>
          <h3>V<sup>π</sup>(s)=Σ<sub>a</sub>π(a|s)Σ<sub>s′</sub>P(s′|s,a)[R+γV<sup>π</sup>(s′)]</h3>
          <ol>
            <li>For each action, average over its possible next states.</li>
            <li>Then average the action values using the policy’s choice probabilities.</li>
          </ol>
          <p><strong>Plain English:</strong> score the policy as it actually behaves—even when it sometimes chooses a weaker action.</p>
          <div className="m11-notation-box"><strong>Notation:</strong> V<sup>π</sup>(s) = value under policy π; Σ = add across actions or next states; γ = discount factor.</div>
        </article>
        <article>
          <span>Bellman optimality</span>
          <b className="m11-bellman-question">Question: “How good could state s be if we always choose the best action?”</b>
          <h3>V*(s)=max<sub>a</sub>Σ<sub>s′</sub>P(s′|s,a)[R+γV*(s′)]</h3>
          <ol>
            <li>For each action, average over its possible next states.</li>
            <li>Then keep the action with the largest expected value.</li>
          </ol>
          <p><strong>Plain English:</strong> compare the choices and keep the best one; do not average good and weak actions together.</p>
          <div className="m11-notation-box"><strong>Notation:</strong> V*(s) = best achievable value from state s; max<sub>a</sub> = choose the action with the largest expected value.</div>
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
        <p className="m11-notation-footnote"><strong>Notation:</strong>
          Vπ(s) is value under a fixed policy π; V*(s) is the best achievable value; Σ means add across possible actions or successor states; and max means choose the best action.
        </p>
      </div>
    ),
    note: "Bellman equations let us express a long-term value using one immediate step plus the value that remains afterward. Bellman expectation answers an evaluation question: how good is state s if the agent continues to follow a particular policy π? First, for each action, it averages over the next states that the environment might produce. Then it averages those action values using the probabilities with which the policy selects the actions. For example, if a policy chooses Right 75 percent of the time and Left 25 percent of the time, Bellman expectation uses that 75–25 average even if Left is weaker. Bellman optimality answers a control question: how good could state s be if the agent always chose the best available action? It still averages over random successor states, because the agent cannot choose which stochastic outcome occurs. But after calculating each action’s expected value, it keeps the largest one with the max operator. The memorable rule is: average over environmental uncertainty, but maximize over choices the agent controls.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Numeric backup 2",
    title: "At one state, compare every possible action",
    content: <OptimalBackupExplorer />,
    note: "Here we perform one optimality backup at a single state. For each action, we add the living reward −0.04 to 0.9 times the value of the successor state. Up gives 0.32, Right gives 0.59, Down gives 0.32, and Left gives 0.14. The updated value is the maximum, 0.59, and the greedy action is Right. This is one local calculation. Value iteration applies the same comparison to every nonterminal state and repeats the process.",
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
        <p className="m11-notation-footnote"><strong>Notation:</strong>
          V<sub>k</sub> is the value table before sweep k, V<sub>k+1</sub> is the next table, Δ (delta) is the largest change, ε (epsilon) is a chosen tolerance, and argmax means choose the action with the largest backup.
        </p>
      </div>
    ),
    note: "Value iteration is a repeated backup procedure. We begin with an initial value table, often setting nonterminal values to zero. During a sweep, each state receives a new value by choosing the best action and averaging over its possible successors. We measure delta, the largest difference between the old and new tables. We repeat until the change is small enough or a justified iteration limit is reached. Finally, argmax extracts the action with the largest one-step lookahead. In the synchronous version, every new value uses the previous complete table.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Dynamic lab",
    title: "Watch the goal’s value spread through a small grid",
    content: <GridworldValueIteration />,
    note: "This grid shows value iteration as a moving wave of information. A sweep means that every ordinary state is updated once using the complete value table from the previous round. At sweep zero, no Bellman backup has run: the terminal cells are fixed at plus 1 and minus 1, while all ordinary cells begin at zero. From round zero to one, s01 can move directly into the plus-1 terminal, so its value becomes negative 0.04 plus 0.9 times 1, which is 0.86. The other ordinary cells only see zero-valued successors, so their best value is negative 0.04. From round one to two, s00 sees the previous-round value 0.86 at s01 and becomes 0.734. Because this is synchronous value iteration, the new 0.734 cannot influence another state until the next sweep. From round two to three, s10 uses s00 and becomes 0.6206. The wall forces the useful path to turn downward on the left. From round three to four, s20 becomes 0.5185. From round four to five, s21 becomes 0.4267. From round five to six, s22 becomes 0.3440 and prefers moving left, away from the minus-1 terminal. By sweep seven, every state’s best backup reproduces its current value, so maximum delta is zero and later sweeps make no change. The greedy arrows then show the stable shortest safe route toward the positive terminal. Values are not immediate rewards; they summarize expected discounted future reward. This demonstration uses deterministic moves, but a stochastic version would average over slips or other possible outcomes inside each action backup.",
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
          <div className="m11-notation-box"><strong>Notation:</strong> γ (gamma) = discount factor; V* = optimal value function; Δ (delta) = largest change between two value tables; γ-contraction = each backup shrinks value error by at least the factor γ.</div>
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
    note: "A small Bellman residual means that the value table is changing very little under the specified backup. For a discounted finite MDP with bounded rewards, this supports convergence to a unique fixed point of the model. It does not prove that the model describes the real world. A missing state variable, an incorrect transition probability, a badly designed reward, or a changed deployment environment can still produce a harmful policy. Numerical stability is solver evidence. Real-world validation requires separate tests of the model, objective, and deployment behavior.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Policy extraction",
    title: "When values settle, choose the best next action",
    content: <PolicyExtractionLab />,
    note: "Once the value table has stabilized, this page lets us extract a policy with one-step lookahead. Start by clicking any ordinary grid square. The selected state receives a purple outline, and the action calculations on the right immediately change to match that state. The wall cannot be entered, and the plus-1 and minus-1 terminal cells end the episode, so those cells are not selectable. Inside each ordinary square, the decimal number is the settled optimal state value V-star of s produced by the sweeps on page 21. The arrow is the greedy action extracted from those settled values; clicking does not rerun value iteration. After a cell is selected, the panel evaluates Up, Right, Down, and Left. This demonstration has deterministic movement, so each action has exactly one successor. Every row now shows whether the move reaches another state or is blocked by an edge or wall, the successor’s settled value, and the complete calculation negative 0.04 plus 0.9 times V-star of the successor. A blocked move stays in the current state, so it uses the current state’s value as the successor value. The four rows are sorted from largest to smallest Q-value. The green first row is the maximum, and the dynamic explanation states why that action becomes pi-star of the selected state. For the initial selection s20, Up reaches s10, whose settled value is about 0.621. Therefore Q of s20 comma Up is negative 0.04 plus 0.9 times 0.621, or about 0.519, which is larger than the alternatives. Try several cells and notice that the arrows follow the highest discounted route toward plus 1 while avoiding minus 1. If two actions tie, a deterministic policy may choose either maximizer, while a stochastic policy may divide probability between them. The arrows are not universal instructions: changing the transitions, reward, discount factor, or state representation can change the extracted policy.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment · Model and evidence audit",
    title: "A polished answer can still solve the wrong problem",
    content: <MdpAssumptionAudit />,
    note: "A reliable decision system needs more than a correct implementation of an algorithm. The state representation must retain the information needed to predict transitions and rewards. The reward must represent the outcomes people actually care about and resist simple forms of reward hacking. The transition model must remain valid when weather, sensors, or other agents change. Finally, a small Bellman residual only shows that the numerical calculation has settled. These four audits separate representation error, reward error, dynamics error, and solver error.",
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
          <div className="m11-notation-box"><strong>Notation recap:</strong> ⟨S,A,P,R,γ⟩ = states, actions, transition probabilities, rewards, and discount factor; π = policy; V = state value; Q = action value.</div>
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
    note: "The lesson brings together prediction, control, and evaluation. A Markov chain describes how states evolve. An MDP adds actions and rewards. A policy chooses actions, value functions estimate long-term return, and Bellman backups connect one-step consequences to the future. Value iteration repeatedly applies the optimality backup and then extracts a policy. The final caution is that an optimal policy is only as good as its state, transition model, and reward. The readings continue these ideas in greater depth, especially the distinction between solving a mathematical model and validating a real system.",
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
