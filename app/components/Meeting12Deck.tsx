"use client";

import { useMemo, useState } from "react";
import "../styles/meeting12.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l10-reinforcement-learning";
const SOURCE_DECK_LABEL = "L10 Machine Learning · Part B";

function resolveMeeting12SourceReference(sourceSlide: number) {
  return {
    deckLabel: SOURCE_DECK_LABEL,
    image: `${SOURCE_ROOT}/source-slides/slide-${sourceSlide}.png`,
    key: `l10-reinforcement-learning:${sourceSlide}`,
    page: sourceSlide,
  };
}

function SourceFrame({
  slide,
  alt,
  caption,
  className = "",
}: {
  slide: 30 | 32 | 33 | 36;
  alt: string;
  caption: string;
  className?: string;
}) {
  const sourceContent = {
    30: {
      title: "Reinforcement learning",
      points: ["trial and error", "feedback as reward", "policy connects situations to actions", "maximize cumulative reward", "exploration discovers useful actions"],
    },
    32: {
      title: "Batch learning compared with online learning",
      points: ["Batch: observe a fixed training set, learn once, then predict", "Online: observe a sequence, update incrementally, then predict again", "The true response can trigger the next update"],
    },
    33: {
      title: "Categories of machine learning",
      points: ["symbolic and non-symbolic", "supervised and unsupervised", "batch and online", "analogical, deep, reinforcement, and hybrid learning"],
    },
    36: {
      title: "Course references",
      points: ["Luger, Artificial Intelligence, 6th ed.", "Russell and Norvig, Artificial Intelligence: A Modern Approach, 3rd ed.", "Course slides and speaker-note applications"],
    },
  }[slide];
  return (
    <article className={`m12-source-rebuilt ${className}`.trim()} aria-label={alt}>
      <span>Course-source reconstruction · page {slide}</span>
      <h3>{sourceContent.title}</h3>
      <ul>{sourceContent.points.map(point => <li key={point}>{point}</li>)}</ul>
      {slide === 32 && (
        <div className="m12-update-flow" aria-label="Batch and online update flow">
          <b>data</b><i>→</i><b>model</b><i>→</i><b>prediction</b><i>→</i><b>response</b><i>↺ update</i>
        </div>
      )}
      <small>{caption}</small>
    </article>
  );
}

const loopSteps = [
  {
    label: "Observe",
    state: "sₜ",
    detail: "The agent receives a representation of the current situation.",
  },
  {
    label: "Act",
    state: "aₜ ~ π(·|sₜ)",
    detail: "The policy selects an action, possibly with exploration.",
  },
  {
    label: "Transition",
    state: "sₜ₊₁",
    detail: "The environment changes; the action influences what data arrives next.",
  },
  {
    label: "Reward",
    state: "rₜ₊₁",
    detail: "A scalar signal evaluates the immediate consequence, not the correct action.",
  },
  {
    label: "Update",
    state: "Q or π",
    detail: "The learner changes its estimates, then repeats the interaction.",
  },
];

function InteractionLoopExplorer() {
  const [active, setActive] = useState(0);
  const item = loopSteps[active];

  return (
    <div className="m12-loop-explorer">
      <div className="m12-loop-map" aria-label="Reinforcement-learning interaction loop">
        <button
          className={active === 0 || active === 1 || active === 4 ? "active" : ""}
          onClick={() => setActive(0)}
          type="button"
        >
          <span>Agent</span>
          <strong>policy + learner</strong>
        </button>
        <div className="m12-loop-arrows">
          <button onClick={() => setActive(1)} type="button">aₜ →</button>
          <button onClick={() => setActive(3)} type="button">← rₜ₊₁</button>
          <button onClick={() => setActive(2)} type="button">← sₜ₊₁</button>
        </div>
        <button
          className={active === 2 || active === 3 ? "active" : ""}
          onClick={() => setActive(2)}
          type="button"
        >
          <span>Environment</span>
          <strong>dynamics + reward</strong>
        </button>
      </div>
      <nav aria-label="Inspect an interaction-loop step">
        {loopSteps.map((step, index) => (
          <button
            className={active === index ? "active" : ""}
            key={step.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <span>{item.label}</span>
        <h3>{item.state}</h3>
        <p>{item.detail}</p>
      </section>
    </div>
  );
}

function ReturnExplorer() {
  const [gamma, setGamma] = useState(0.9);
  const rewardNow = -1;
  const rewardNext = 0;
  const rewardGoal = 10;
  const total = rewardNow + gamma * rewardNext + gamma ** 2 * rewardGoal;

  return (
    <div className="m12-return-explorer">
      <section>
        <span>Trajectory rewards</span>
        <div className="m12-reward-track">
          <article><small>t</small><strong>−1</strong><p>step cost</p></article>
          <i>→</i>
          <article><small>t+1</small><strong>0</strong><p>move</p></article>
          <i>→</i>
          <article className="goal"><small>t+2</small><strong>+10</strong><p>goal</p></article>
        </div>
      </section>
      <section>
        <span>Choose γ</span>
        <nav>
          {[0, 0.5, 0.9, 1].map(value => (
            <button
              className={gamma === value ? "active" : ""}
              key={value}
              onClick={() => setGamma(value)}
              type="button"
            >
              {value.toFixed(1)}
            </button>
          ))}
        </nav>
        <h3>Gₜ = −1 + {gamma.toFixed(1)}(0) + {gamma.toFixed(1)}²(10)</h3>
        <strong className="m12-result">Gₜ = {total.toFixed(2)}</strong>
        <p>Smaller γ values place less weight on the delayed goal reward.</p>
      </section>
    </div>
  );
}

const banditRewards = [
  [1, 0, 1, 0, 0, 1, 0, 1],
  [0, 1, 1, 1, 0, 1, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0],
];

function BanditLab() {
  const [counts, setCounts] = useState([0, 0, 0]);
  const [totals, setTotals] = useState([0, 0, 0]);
  const [last, setLast] = useState<{ arm: number; reward: number } | null>(null);

  const pull = (arm: number) => {
    const reward = banditRewards[arm][counts[arm] % banditRewards[arm].length];
    setCounts(values => values.map((value, index) => index === arm ? value + 1 : value));
    setTotals(values => values.map((value, index) => index === arm ? value + reward : value));
    setLast({ arm, reward });
  };

  const reset = () => {
    setCounts([0, 0, 0]);
    setTotals([0, 0, 0]);
    setLast(null);
  };

  return (
    <div className="m12-bandit">
      <section>
        <span>Three unknown reward sources</span>
        <h3>Which arm should receive the next trial?</h3>
        <p>Pulling an arm both earns a reward and produces evidence about that action.</p>
        <button onClick={reset} type="button">Reset evidence</button>
      </section>
      <div>
        {["A", "B", "C"].map((label, arm) => {
          const estimate = counts[arm] ? totals[arm] / counts[arm] : 0;
          return (
            <button
              className={last?.arm === arm ? "last" : ""}
              key={label}
              onClick={() => pull(arm)}
              type="button"
            >
              <span>Arm {label}</span>
              <strong>Q̂ = {counts[arm] ? estimate.toFixed(2) : "?"}</strong>
              <small>{totals[arm]} reward / {counts[arm]} pulls</small>
            </button>
          );
        })}
      </div>
      <aside>
        {last
          ? <>Arm {["A", "B", "C"][last.arm]} returned <strong>{last.reward}</strong>. Update its sample-average estimate.</>
          : <>Start with uncertainty. A greedy policy has no evidence yet.</>}
      </aside>
    </div>
  );
}

const epsilonCases = [
  {
    epsilon: "0",
    policy: "Always exploit",
    counts: [0, 20, 0],
    interpretation: "Fast commitment, but one early overestimate can prevent discovery of a better action.",
  },
  {
    epsilon: "0.1",
    policy: "Mostly exploit",
    counts: [1, 18, 1],
    interpretation: "About 10% of decisions explore; all actions retain some chance of being sampled.",
  },
  {
    epsilon: "0.5",
    policy: "Explore often",
    counts: [4, 12, 4],
    interpretation: "More information is gathered, but many choices ignore the current best estimate.",
  },
];

function EpsilonGreedyExplorer() {
  const [active, setActive] = useState(1);
  const item = epsilonCases[active];

  return (
    <div className="m12-epsilon">
      <nav aria-label="Choose an epsilon value">
        {epsilonCases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.epsilon}
            onClick={() => setActive(index)}
            type="button"
          >
            ε = {entry.epsilon}
          </button>
        ))}
      </nav>
      <section>
        <span>{item.policy}</span>
        <h3>20 illustrative decisions</h3>
        <div className="m12-choice-dots" aria-label={`Illustrative action counts ${item.counts.join(", ")}`}>
          {item.counts.flatMap((count, arm) =>
            Array.from({ length: count }, (_, index) => (
              <i className={`arm-${arm}`} key={`${arm}-${index}`} />
            )),
          )}
        </div>
        <p>{item.interpretation}</p>
        <SearchCallout label="ε-greedy rule" tone="cyan">
          With probability 1−ε choose an action with maximal Q(s,a); with
          probability ε choose an action at random.
        </SearchCallout>
      </section>
    </div>
  );
}

const updateSteps = [
  {
    label: "Current estimate",
    equation: "Q(s,a) = 2.00",
    detail: "This is the value stored before the transition.",
  },
  {
    label: "One-step target",
    equation: "r + γ max Q(s′,a′) = −1 + 0.9(5) = 3.50",
    detail: "Bootstrap from the best estimated action value in the successor state.",
  },
  {
    label: "TD error",
    equation: "δ = 3.50 − 2.00 = 1.50",
    detail: "The target exceeds the current estimate, so the update moves upward.",
  },
  {
    label: "Updated value",
    equation: "Q ← 2.00 + 0.2(1.50) = 2.30",
    detail: "The learning rate α=0.2 moves only partway toward the target.",
  },
];

function QUpdateStepper() {
  const [step, setStep] = useState(0);
  const item = updateSteps[step];

  return (
    <div className="m12-update-stepper">
      <section>
        <span>Transition sample</span>
        <h3>(s, a, r, s′)</h3>
        <div className="m12-transition-values">
          <article><small>Q(s,a)</small><strong>2.00</strong></article>
          <article><small>r</small><strong>−1</strong></article>
          <article><small>γ</small><strong>0.9</strong></article>
          <article><small>max Q(s′,·)</small><strong>5.00</strong></article>
          <article><small>α</small><strong>0.2</strong></article>
        </div>
      </section>
      <section>
        <span>Step {step + 1} of {updateSteps.length} · {item.label}</span>
        <h3>{item.equation}</h3>
        <p>{item.detail}</p>
        <div>
          <button disabled={step === 0} onClick={() => setStep(value => value - 1)} type="button">Previous</button>
          <button disabled={step === updateSteps.length - 1} onClick={() => setStep(value => value + 1)} type="button">Next</button>
          <button onClick={() => setStep(0)} type="button">Reset</button>
        </div>
      </section>
    </div>
  );
}

const gridSnapshots = [
  {
    label: "Before experience",
    q: ["0.0", "0.0", "0.0", "0.0"],
    path: [0],
    note: "All four action values at the start are tied.",
  },
  {
    label: "After one failed route",
    q: ["−0.2", "0.0", "0.0", "−1.0"],
    path: [0, 1, 4, 7],
    note: "Step costs and the hazard reduce values along the sampled route.",
  },
  {
    label: "After a goal route",
    q: ["−0.2", "0.8", "0.0", "−1.0"],
    path: [0, 3, 4, 5, 8],
    note: "Reward begins to propagate backward from the goal.",
  },
  {
    label: "After repeated episodes",
    q: ["0.6", "1.4", "0.1", "−1.0"],
    path: [0, 3, 4, 5, 8],
    note: "The greedy choice at Start becomes Right.",
  },
];

function GridworldStudio() {
  const [active, setActive] = useState(0);
  const state = gridSnapshots[active];

  return (
    <div className="m12-gridworld">
      <section>
        <span>3 × 3 classroom environment</span>
        <div className="m12-grid">
          {Array.from({ length: 9 }, (_, cell) => (
            <div
              className={[
                cell === 0 ? "start" : "",
                cell === 7 ? "hazard" : "",
                cell === 8 ? "goal" : "",
                state.path.includes(cell) ? "path" : "",
              ].filter(Boolean).join(" ")}
              key={cell}
            >
              {cell === 0 ? "Start" : cell === 7 ? "−10" : cell === 8 ? "+10" : ""}
            </div>
          ))}
        </div>
      </section>
      <section>
        <nav aria-label="Choose a learning snapshot">
          {gridSnapshots.map((snapshot, index) => (
            <button
              className={active === index ? "active" : ""}
              key={snapshot.label}
              onClick={() => setActive(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </nav>
        <span>{state.label}</span>
        <h3>Q(Start, ·)</h3>
        <div className="m12-q-compass">
          <article><small>↑</small><strong>{state.q[0]}</strong></article>
          <article><small>→</small><strong>{state.q[1]}</strong></article>
          <article><small>↓</small><strong>{state.q[2]}</strong></article>
          <article><small>←</small><strong>{state.q[3]}</strong></article>
        </div>
        <p>{state.note}</p>
      </section>
    </div>
  );
}

const tdAlgorithms = [
  {
    label: "Q-learning",
    target: "r + γ maxₐ′ Q(s′,a′)",
    policy: "Off-policy",
    question: "What would the greedy policy do next?",
    consequence: "Backs up the best estimated next action even if exploration selects another action.",
  },
  {
    label: "SARSA",
    target: "r + γ Q(s′,a′)",
    policy: "On-policy",
    question: "What action did the behavior policy actually select?",
    consequence: "Backs up the sampled next action, so exploratory risk can influence learned values.",
  },
];

function TDComparison() {
  const [active, setActive] = useState(0);
  const item = tdAlgorithms[active];

  return (
    <div className="m12-td-comparison">
      <nav aria-label="Choose a temporal-difference algorithm">
        {tdAlgorithms.map((algorithm, index) => (
          <button
            className={active === index ? "active" : ""}
            key={algorithm.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {algorithm.label}
          </button>
        ))}
      </nav>
      <section>
        <span>{item.policy}</span>
        <h3>{item.target}</h3>
        <p><strong>Target asks:</strong> {item.question}</p>
        <SearchCallout label="Learning consequence" tone={active === 0 ? "indigo" : "green"}>
          {item.consequence}
        </SearchCallout>
      </section>
      <aside>
        Both are one-step temporal-difference control methods. The only symbol
        that changes in the target is enough to change which policy is evaluated.
      </aside>
    </div>
  );
}

const practiceCases = [
  {
    label: "Return",
    prompt: "Rewards are 2, 0, 8 and γ=0.5. Compute G₀.",
    answer: "G₀ = 2 + 0.5(0) + 0.5²(8) = 4.",
    evidence: "Show the exponent attached to each delayed reward.",
  },
  {
    label: "Update",
    prompt: "Q=4, r=1, γ=0.9, max Q′=6, α=0.5. Compute the new Q.",
    answer: "Target=6.4; error=2.4; new Q=4+0.5(2.4)=5.2.",
    evidence: "Separate target, TD error, and learning-rate step.",
  },
  {
    label: "Policy",
    prompt: "Q values are [1, 3, 2]. With ε=0, which action is selected?",
    answer: "The second action, because it has the maximal estimated value 3.",
    evidence: "With ε>0, any action can still be selected during exploration.",
  },
  {
    label: "Diagnosis",
    prompt: "A robot earns points by spinning in place instead of delivering. What failed?",
    answer: "The reward function is an incomplete proxy for the intended task.",
    evidence: "Name the observed loophole and propose a measurable repair.",
  },
];

function GuidedPracticeStudio() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = practiceCases[active];

  return (
    <div className="m12-practice">
      <nav aria-label="Choose a reinforcement-learning practice case">
        {practiceCases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.label}
            onClick={() => {
              setActive(index);
              setRevealed(false);
            }}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Pair practice · case {active + 1}</span>
        <h3>{item.prompt}</h3>
        <p>{item.evidence}</p>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide solution" : "Reveal solution"}
        </button>
        {revealed && (
          <SearchCallout label="Worked response" tone="green">
            {item.answer}
          </SearchCallout>
        )}
      </section>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 10 · Lesson 14 · Reinforcement learning",
    title: "Learn by acting, observing consequences, and revising a policy",
    subtitle: "Course foundations first; formal MDP and Q-learning theory are explicitly labeled textbook/modern supplements.",
    content: (
      <div className="m12-cover">
        <section>
          <span>75-minute meeting</span>
          <h2>Interaction → return → value → control</h2>
          <p>
            Trial and error motivates the mathematical machinery we will make
            visible through one small environment.
          </p>
        </section>
        <div className="m12-cover-loop" aria-label="Agent environment reward interaction diagram">
          <article><small>01</small><strong>Agent</strong><p>select an action</p></article>
          <i>→</i>
          <article><small>02</small><strong>World</strong><p>changes state</p></article>
          <i>→</i>
          <article><small>03</small><strong>Reward</strong><p>scores consequence</p></article>
          <i>↻</i>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: source slide 30 supplies trial-and-error, feedback, reward, policy, cumulative reward, and exploration. Preview the formal supplements without claiming that they appear in the historical deck.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Course foundation · page 30",
    title: "The source establishes trial-and-error, feedback, reward, policy, and exploration",
    content: (
      <div className="m12-source-and-notes">
        <SourceFrame
          slide={30}
          alt="Course source page defining reinforcement learning"
          caption="Trial and error, cumulative reward, exploration, and disciplinary connections."
        />
        <section>
          <span>Read the source as evidence</span>
          <h3>Five durable knowledge points</h3>
          <ol>
            <li>The agent learns through trial and error.</li>
            <li>Feedback arrives as reward, not a labeled correct action.</li>
            <li>A policy connects situations to actions.</li>
            <li>Performance concerns cumulative reward.</li>
            <li>Exploration produces the experience used to learn.</li>
          </ol>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: exact L10 Machine Learning Part B slide 30. Ask students to locate trial-and-error, reward, policy, cumulative reward, and exploration in the source image before discussing qualifications.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Source correction · qualify, do not erase",
    title: "Reinforcement learning seeks high expected return; optimality is not automatic",
    content: (
      <div className="m12-claim-audit">
        <article>
          <span>Source wording</span>
          <h3>“learns an optimal policy”</h3>
          <p>The phrase names the objective but can sound like a guarantee.</p>
        </article>
        <i>→</i>
        <article className="corrected">
          <span>Course formulation</span>
          <h3>learn a policy that maximizes expected return</h3>
          <p>
            Reaching an optimum depends on representation, exploration, data,
            algorithm assumptions, and whether function approximation is used.
          </p>
        </article>
        <SearchCallout label="Second qualification" tone="amber">
          A large or unknown environment can motivate model-free RL, but size
          alone does not make RL successful or sample-efficient.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: source slide 30 plus the package correction ledger. Preserve the source claim in the exact image while using expected return as the technically careful objective.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Historical speaker notes · applications",
    title: "Games and elevator control show why action-dependent experience matters",
    content: (
      <div className="m12-application-pair">
        <article>
          <div className="m12-game-board" aria-label="Small game board">
            {["♟", "", "♙", "", "♜", "", "", "♔", ""].map((piece, index) => (
              <span key={index}>{piece}</span>
            ))}
          </div>
          <section>
            <span>Game playing</span>
            <h3>Too many states for a hand-written rule per position</h3>
            <p>Agents can learn through play against humans or other agents.</p>
          </section>
        </article>
        <article>
          <div className="m12-elevator" aria-label="Elevator serving four floors">
            {[4, 3, 2, 1].map((floor, index) => (
              <span className={index === 2 ? "car" : ""} key={floor}>{floor}</span>
            ))}
          </div>
          <section>
            <span>Control</span>
            <h3>Scheduling balances waiting time and changing demand</h3>
            <p>Simulation supports retraining when operating conditions change.</p>
          </section>
        </article>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: speaker notes attached to source slide 30. Preserve game playing, two-player self-play or human play, elevator scheduling, simulation, retraining, and continued updating. Ask what constitutes state, action, and reward in each domain.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Course foundation · page 32",
    title: "The source contrasts batch learning with incremental online learning",
    content: (
      <div className="m12-full-source">
        <SourceFrame
          slide={32}
          alt="Course source page comparing batch offline learning and online learning"
          caption="Batch and online learning compared through a complete prediction-and-update pipeline."
        />
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: exact source slide 32. Have students trace data, model, prediction, true response, and model update. Do not yet treat this supervised online loop as an RL loop.",
    sourceSlides: [32],
  },
  {
    eyebrow: "Exact embedded figure · source page 32",
    title: "Online updating and reinforcement learning can overlap—but answer different questions",
    content: (
      <div className="m12-media-compare">
        <SearchSourceImage
          alt="Exact embedded source figure comparing batch and online learning"
          caption="Exact image25.png · copied byte-for-byte from the authoritative PowerPoint."
          file="media/image25.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <article>
            <span>Online learning asks</span>
            <h3>When is the model updated?</h3>
            <p>Incrementally as examples arrive, rather than from one fixed batch.</p>
          </article>
          <article>
            <span>Reinforcement learning asks</span>
            <h3>How should an agent act under reward and delayed consequences?</h3>
            <p>Actions change future states and therefore change the data observed.</p>
          </article>
          <SearchCallout label="Not synonyms" tone="amber">
            RL may be online or offline. Online learning may use labeled responses
            without choosing actions in an environment.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: exact embedded image25.png from source slide 32, plus the correction ledger for slide 33. The figure itself is a knowledge object and remains fully visible.",
    sourceSlides: [32, 33],
  },
  {
    eyebrow: "Course foundation · page 33",
    title: "The source places reinforcement learning inside a broader learning taxonomy",
    content: (
      <div className="m12-full-source">
        <SourceFrame
          slide={33}
          alt="Course source page listing categories of machine learning"
          caption="Exact PowerPoint export · including the online/RL comparison and the note that RL is important to robots."
        />
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: exact source slide 33. Preserve symbolic/non-symbolic, supervised/unsupervised, batch/online, analogical, deep, reinforcement, and hybrid or universal learning categories.",
    sourceSlides: [33],
  },
  {
    eyebrow: "Source correction · learning categories",
    title: "Incremental updating is a schedule; reinforcement learning is a decision problem",
    content: (
      <div className="m12-taxonomy">
        <article>
          <span>Dimension 1</span>
          <h3>Feedback</h3>
          <p>labels · structure · reward</p>
        </article>
        <article>
          <span>Dimension 2</span>
          <h3>Update schedule</h3>
          <p>batch · online · offline replay</p>
        </article>
        <article>
          <span>Dimension 3</span>
          <h3>Representation</h3>
          <p>symbolic · statistical · neural · hybrid</p>
        </article>
        <article>
          <span>Dimension 4</span>
          <h3>Decision setting</h3>
          <p>prediction · sequential control · planning</p>
        </article>
        <aside>
          <strong>One system can occupy one position on every dimension.</strong>
          <p>An RL robot may update online, use a neural Q-function, and learn from delayed reward.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: source slide 33 plus correction ledger. Explicitly correct the claim that online learning and RL differ only slightly: one concerns update timing; the other concerns sequential action under reward.",
    sourceSlides: [33],
  },
  {
    eyebrow: "Textbook/modern supplement · formal problem",
    title: "An MDP names the pieces hidden inside the source’s words “agent,” “environment,” and “policy”",
    content: (
      <div className="m12-mdp-map">
        <section>
          <span>Markov decision process</span>
          <h3>⟨S, A, P, R, γ⟩</h3>
          <p>The current state must contain the information needed to predict the next transition under an action.</p>
        </section>
        <div>
          <article><strong>S</strong><h3>States</h3><p>situations the agent can distinguish</p></article>
          <article><strong>A</strong><h3>Actions</h3><p>choices available to the agent</p></article>
          <article><strong>P</strong><h3>Dynamics</h3><p>P(s′|s,a), possibly unknown</p></article>
          <article><strong>R</strong><h3>Reward</h3><p>immediate scalar feedback</p></article>
          <article><strong>γ</strong><h3>Discount</h3><p>weight on later rewards</p></article>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Textbook/modern supplement: the source package explicitly documents that slide 30 has no MDP definition. Map source terminology to S, A, P, R, and gamma; distinguish transition dynamics from the reward function.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · observable interaction",
    title: "A reward labels a consequence—not the action the agent should have taken",
    content: <InteractionLoopExplorer />,
    note: "Timing: 3 minutes. Textbook/modern supplement. Walk through s_t, a_t, r_{t+1}, s_{t+1}. Ask which arrow makes RL data action-dependent and why a reward is not equivalent to a supervised target.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · trajectory and episode",
    title: "Learning data are ordered transitions, not shuffled input–label pairs",
    content: (
      <div className="m12-trajectory">
        <div className="m12-trajectory-track">
          {[
            ["s₀", "lobby"],
            ["a₀", "go up"],
            ["r₁", "−1"],
            ["s₁", "floor 2"],
            ["a₁", "serve call"],
            ["r₂", "+5"],
            ["s₂", "terminal"],
          ].map(([symbol, meaning], index) => (
            <article className={symbol.startsWith("r") ? "reward" : ""} key={symbol}>
              <small>{symbol}</small><strong>{meaning}</strong>{index < 6 && <i>→</i>}
            </article>
          ))}
        </div>
        <div className="m12-term-pair">
          <article><span>Trajectory</span><h3>s₀,a₀,r₁,s₁,…</h3><p>One ordered sequence of interaction.</p></article>
          <article><span>Episode</span><h3>start → terminal</h3><p>A finite trajectory with a natural ending.</p></article>
          <SearchCallout label="Continuing task" tone="cyan">
            Elevator control may have no terminal state; discounting or an
            average-reward objective can keep the return well-defined.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Textbook/modern supplement. Students identify two transition tuples in the displayed elevator episode and contrast episodic games with continuing control.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · return",
    title: "Return converts a stream of future rewards into one learning target",
    content: (
      <div className="m12-equation-stage">
        <section>
          <span>Discounted return from time t</span>
          <h3>Gₜ = rₜ₊₁ + γrₜ₊₂ + γ²rₜ₊₃ + ···</h3>
          <p>γ ∈ [0,1] controls how strongly delayed rewards influence the present.</p>
        </section>
        <div>
          <article><strong>γ = 0</strong><p>Only the immediate reward matters.</p></article>
          <article><strong>0 &lt; γ &lt; 1</strong><p>Later rewards count, but with diminishing weight.</p></article>
          <article><strong>γ = 1</strong><p>All rewards count equally; use safely for finite episodes.</p></article>
          <SearchCallout label="Objective" tone="green">
            A policy is evaluated by expected return, because trajectories and
            rewards may be stochastic.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Textbook/modern supplement. Define discounted return and expected return. Ask why immediate-reward maximization can fail in a task with delayed consequences.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked demonstration · discounting",
    title: "The same reward sequence supports different preferences as γ changes",
    content: <ReturnExplorer />,
    note: "Timing: 3 minutes. Textbook/modern supplement. Students predict the return for gamma 0, 0.5, 0.9, and 1 before selecting each value. Connect smaller gamma to shorter planning horizons without calling gamma a probability.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · policy and value",
    title: "A policy chooses; value functions predict long-run consequences",
    content: (
      <div className="m12-policy-values">
        <article>
          <span>Policy</span>
          <h3>π(a|s)</h3>
          <p>A distribution over actions in state s.</p>
          <small>What will the agent do?</small>
        </article>
        <article>
          <span>State value</span>
          <h3>Vπ(s)=Eπ[Gₜ|sₜ=s]</h3>
          <p>Expected return from a state under policy π.</p>
          <small>How good is this situation?</small>
        </article>
        <article>
          <span>Action value</span>
          <h3>Qπ(s,a)=Eπ[Gₜ|sₜ=s,aₜ=a]</h3>
          <p>Expected return after taking action a, then following π.</p>
          <small>How good is this choice here?</small>
        </article>
        <aside>
          <strong>Control idea</strong>
          <p>If Q is accurate, choose an action with the largest Q(s,a)—while retaining enough exploration to improve the estimates.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Textbook/modern supplement. Contrast policy, V, and Q. Ask which object is sufficient to choose among actions without separately knowing the transition model.",
    sourceSlides: [],
  },
  {
    eyebrow: "Live demonstration · exploration as information gathering",
    title: "A bandit reveals the exploration–exploitation conflict without state transitions",
    content: <BanditLab />,
    note: "Timing: 4 minutes. Modern supplement and live demo. Invite students to choose 8-12 pulls. Distinguish reward earned now from information that may improve later choices. A bandit is the one-state special case, not a full gridworld.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · ε-greedy exploration",
    title: "Exploit the current estimate most of the time; explore with probability ε",
    content: <EpsilonGreedyExplorer />,
    note: "Timing: 3 minutes. Textbook/modern supplement. Compare epsilon 0, 0.1, and 0.5. The dot counts are illustrative, not guaranteed frequencies in every 20-step sample.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Q-learning",
    title: "Q-learning moves one stored value toward a bootstrapped one-step target",
    content: (
      <div className="m12-q-equation">
        <section>
          <span>Off-policy temporal-difference control</span>
          <h3>Q(s,a) ← Q(s,a) + α[r + γ maxₐ′Q(s′,a′) − Q(s,a)]</h3>
        </section>
        <div>
          <article><strong>α</strong><h3>learning rate</h3><p>how far to move toward this sample target</p></article>
          <article><strong>r</strong><h3>reward</h3><p>immediate feedback from the transition</p></article>
          <article><strong>γ</strong><h3>discount</h3><p>weight on the successor estimate</p></article>
          <article><strong>max Q′</strong><h3>bootstrap</h3><p>estimated value of the greedy next action</p></article>
        </div>
        <SearchCallout label="Source boundary" tone="amber">
          The historical speaker note contains only the term “Q-Learning.” This
          equation, its terms, and the derivation are textbook supplements.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Textbook/modern supplement. Parse current estimate, target, temporal-difference error, and step size. Note that terminal successors conventionally contribute zero future value.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked demonstration · one numeric Q update",
    title: "Compute target, error, and update as three separate quantities",
    content: <QUpdateStepper />,
    note: "Timing: 4 minutes. Textbook/modern supplement. Students predict the sign of the update before arithmetic. Verify the target 3.5, TD error 1.5, and updated Q value 2.3.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive demonstration · tabular gridworld",
    title: "Repeated transitions propagate goal reward backward through a Q-table",
    content: <GridworldStudio />,
    note: "Timing: 4 minutes. Modern classroom demo. The displayed Q values are pedagogical snapshots rather than a claim of exact convergence under a specified stochastic process. Ask why unsampled actions remain uncertain.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · tabular algorithm",
    title: "Q-learning alternates behavior, observation, and one local table update",
    content: (
      <div className="m12-algorithm">
        <ol>
          <li>Initialize Q(s,a), usually to zero or optimistic values.</li>
          <li>Observe the current state s.</li>
          <li>Select a using a behavior policy such as ε-greedy.</li>
          <li>Execute a; observe reward r and successor s′.</li>
          <li>Update Q(s,a) toward r + γ maxₐ′Q(s′,a′).</li>
          <li>Set s ← s′; repeat until terminal, then start another episode.</li>
        </ol>
        <section>
          <span>Separate two policies</span>
          <h3>Behavior explores; target is greedy</h3>
          <p>
            Q-learning is off-policy because the update evaluates the greedy
            target even when the sampled behavior action was exploratory.
          </p>
          <SearchCallout label="Tabular boundary" tone="cyan">
            One table entry per state-action pair is feasible only when the
            discrete space is small enough to enumerate.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Textbook/modern supplement. Trace one loop with the Lesson 14 gridworld. Keep behavior policy, target policy, terminal handling, and table-size limitation explicit.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Q-learning versus SARSA",
    title: "The next-action term determines whether learning is off-policy or on-policy",
    content: <TDComparison />,
    note: "Timing: 3 minutes. Textbook/modern supplement. Compare only the one-step targets. Use a risky path example: SARSA can price in exploratory actions, while Q-learning evaluates the greedy next action.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern supplement · limits, safety, and evaluation",
    title: "A high training reward can coexist with poor, unsafe, or brittle behavior",
    content: (
      <div className="m12-limit-grid">
        <article><span>01</span><h3>Sample cost</h3><p>Interaction can be slow, expensive, or dangerous.</p></article>
        <article><span>02</span><h3>Reward hacking</h3><p>The agent exploits the measured proxy rather than the intended goal.</p></article>
        <article><span>03</span><h3>Instability</h3><p>Bootstrapping, off-policy data, and function approximation can interact badly.</p></article>
        <article><span>04</span><h3>Distribution shift</h3><p>A policy learned in simulation may fail under changed dynamics.</p></article>
        <article><span>05</span><h3>Exploration risk</h3><p>Trying unknown actions may be unacceptable in real systems.</p></article>
        <article><span>06</span><h3>Evaluation</h3><p>Use held-out scenarios, baselines, variance, and safety constraints—not one best run.</p></article>
        <aside>
          <strong>Design question</strong>
          <p>For elevator control, what measurable reward could reduce waiting without producing unsafe or unfair service?</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Modern supplement. Use the elevator case to surface reward design, fairness, safety, and simulation-to-reality shift. Emphasize that reward is a specification and can be incomplete.",
    sourceSlides: [],
  },
  {
    eyebrow: "Guided practice · calculate, classify, diagnose",
    title: "Use the formal objects—not intuition alone—to justify each answer",
    content: <GuidedPracticeStudio />,
    note: "Timing: 4 minutes. Run the four cases in pairs. Require visible work for return and Q update, exact terminology for policy selection, and an evidence-based reward-function diagnosis.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment · independent retrieval",
    title: "Which statement correctly distinguishes reinforcement learning from online supervised learning?",
    content: (
      <div className="m12-assessment">
        <SearchQuickCheck
          question="Choose the strongest distinction."
          options={[
            "RL always updates online; supervised learning always trains in batches.",
            "RL actions affect future data and rewards may be delayed; online supervised learning can update from arriving labeled examples without controlling the data source.",
            "RL has no model, while supervised learning always has an explicit model.",
            "The two methods differ only in vocabulary.",
          ]}
          correct={1}
          explanation="Update timing and feedback structure are separate dimensions. RL is defined by sequential action and reward; either family may update online."
        />
        <aside>
          <span>Submit before leaving</span>
          <ol>
            <li>Write the Q-learning target for one transition.</li>
            <li>Compute the update when Q=0, r=2, γ=0.5, max Q′=4, α=0.25.</li>
            <li>Name one risk that reward alone may fail to represent.</li>
          </ol>
          <strong>Check value: new Q = 1.00</strong>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Collect the three-part response after students commit to the multiple-choice distinction. Calculation: target 4, error 4, update 1. Require one concrete reward-specification risk.",
    sourceSlides: [],
  },
  {
    eyebrow: "Course foundation · page 36 · readings",
    title: "Connect the course references to reinforcement-learning control",
    content: (
      <div className="m12-source-and-readings">
        <SourceFrame
          slide={36}
          alt="Course source reference page citing the Luger and Mitchell textbooks"
          caption="Exact PowerPoint export · source misspellings remain visible as historical evidence."
        />
        <section>
          <span>Corrected course reading list</span>
          <ol>
            <li>
              George F. Luger, <em>Artificial Intelligence: Structures and
              Strategies for Complex Problem Solving</em>, 6th ed., Chapters 10
              and 12.
            </li>
            <li>Tom M. Mitchell, <em>Machine Learning</em>, Chapter 13.</li>
            <li>
              Stuart Russell and Peter Norvig, <em>Artificial Intelligence: A
              Modern Approach</em>, 3rd ed., Chapter 21.
            </li>
          </ol>
          <SearchCallout label="Exit synthesis" tone="green">
            In one paragraph, connect <strong>interaction → return → Q update →
            policy improvement</strong>, and identify where exploration enters.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: exact source slide 36. Correct George F. Luger and McGraw-Hill in course text while leaving the exact historical render untouched. Assign the synthesis paragraph and the specified textbook chapters.",
    sourceSlides: [36],
  },
];

export function Meeting12Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  const deck = useMemo(() => slides, []);

  return (
    <div className="meeting12-deck">
      <SourceDeckShell
        forcePrintAll={forcePrintAll}
        meetingLabel="Module 10 · Lesson 14"
        meetingTitle="Reinforcement Learning, Q-Learning, and Exploration"
        resolveSourceReference={resolveMeeting12SourceReference}
        slides={deck}
        sourceCollectionLabel={SOURCE_DECK_LABEL}
      />
    </div>
  );
}
