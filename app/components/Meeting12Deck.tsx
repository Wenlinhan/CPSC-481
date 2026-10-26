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
  const topicLabel = {
    30: "Reinforcement learning foundations",
    32: "Batch and online learning",
    33: "Ways to classify learning",
    36: "Readings and references",
  }[slide];
  return (
    <article className={`m12-source-rebuilt ${className}`.trim()} aria-label={alt}>
      <span>{topicLabel}</span>
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

function ReinforcementLearningFiveAspects() {
  const aspects = [
    ["1", "Explore", "Try actions so the agent can discover their consequences."],
    ["2", "Act and observe", "Trial and error produces experience in the environment."],
    ["3", "Receive reward", "Reward evaluates the consequence; it is not a labeled action."],
    ["4", "Update the policy", "Use experience to improve how situations map to actions."],
    ["5", "Improve return", "Judge the policy by cumulative reward, including delayed effects."],
  ];

  return (
    <section className="m12-five-aspects" aria-label="Five connected aspects of reinforcement learning">
      <header>
        <span>One connected learning loop</span>
        <h3>Explore → act → learn → improve</h3>
      </header>
      <ol>
        {aspects.map(([number, title, detail]) => (
          <li key={title}>
            <b>{number}</b>
            <div><strong>{title}</strong><p>{detail}</p></div>
          </li>
        ))}
      </ol>
      <small>The next action begins another trip through the loop.</small>
    </section>
  );
}

function LearningCategoriesComparison() {
  const rows = [
    ["Feedback", "What learning signal is available?", "labels · patterns · reward", "Supervised, unsupervised, and reinforcement learning differ here."],
    ["Update schedule", "When does the model change?", "batch · online", "A method can update once from fixed data or incrementally as data arrive."],
    ["Representation", "How is knowledge stored?", "symbolic · statistical/neural · hybrid", "Rules, learned parameters, or a combination can represent knowledge."],
    ["Decision setting", "What must the system do?", "prediction · analogy · sequential control", "Reinforcement learning focuses on actions whose effects unfold over time."],
  ];

  return (
    <div className="m12-category-comparison" aria-label="Comparison of four ways to categorize machine-learning systems">
      <header>
        <span>Compare one dimension at a time</span>
        <p>These categories answer different questions, so one system can belong to several at once.</p>
      </header>
      <div className="m12-category-table" role="table" aria-label="Machine-learning category comparison">
        <div className="head" role="row"><b>Dimension</b><b>Question</b><b>Choices</b><b>Meaning</b></div>
        {rows.map(([dimension, question, choices, meaning]) => (
          <div role="row" key={dimension}>
            <strong>{dimension}</strong><span>{question}</span><code>{choices}</code><p>{meaning}</p>
          </div>
        ))}
      </div>
      <aside><strong>Example:</strong> An RL robot can learn from reward, update online, use a neural representation, and control a sequence of actions.</aside>
    </div>
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
        <div className="m12-notation-box"><strong>Notation:</strong> s<sub>t</sub> = state at time t; a<sub>t</sub> = action at time t; r<sub>t+1</sub> = reward received next; π = policy; Q = action-value estimate.</div>
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
        <div className="m12-notation-box"><strong>Notation:</strong> G<sub>t</sub> = return starting at time t; γ (gamma) = discount factor; γ² means a reward two steps later is discounted twice.</div>
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
        <span>Context · repeated choices with uncertain rewards</span>
        <h3>Which option should the agent try next?</h3>
        <p>An agent repeatedly chooses among three actions—called <strong>arms</strong>, like the arms of slot machines. Each pull reveals a binary reward: <strong>r = 1</strong> for success or <strong>r = 0</strong> for no success.</p>
        <p>The agent does not know which arm succeeds most often. It must learn from the outcomes it has observed.</p>
        <div className="m12-bandit-formula">
          <strong>Q̂(a) = R(a) ÷ N(a)</strong>
          <small>estimated value = total reward ÷ number of pulls</small>
        </div>
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
              <strong>Q̂({label}) = {counts[arm] ? estimate.toFixed(2) : "?"}</strong>
              <small>R({label}) = {totals[arm]} total reward</small>
              <small>N({label}) = {counts[arm]} pulls</small>
            </button>
          );
        })}
      </div>
      <aside>
        <div>
          {last
            ? <>Arm {["A", "B", "C"][last.arm]} returned <strong>r = {last.reward}</strong>. Its pull count N, total reward R, and estimate Q̂ are updated.</>
            : <>Before any pulls, N(a) = 0, so Q̂(a) is shown as <strong>?</strong>: there is not enough evidence to compute an average.</>}
        </div>
        <small><strong>Notation:</strong> a = selected action or arm; r = reward from one pull; N(a) = pulls of arm a; R(a) = rewards accumulated from arm a; Q̂(a) = current sample-average estimate of that arm’s reward. This demo uses fixed hidden 0/1 outcome sequences so it is repeatable.</small>
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
        <p className="m12-page-explainer">Assume Arm B currently has the largest Q estimate. Each dot is one decision: choosing B exploits current knowledge; choosing A or C explores an alternative.</p>
        <div className="m12-choice-dots" aria-label={`Illustrative action counts ${item.counts.join(", ")}`}>
          {item.counts.flatMap((count, arm) =>
            Array.from({ length: count }, (_, index) => (
              <i className={`arm-${arm}`} key={`${arm}-${index}`} />
            )),
          )}
        </div>
        <div className="m12-choice-legend" aria-label="Action dot legend">
          <span><i className="arm-0" />Arm A · explore</span>
          <span><i />Arm B · current best</span>
          <span><i className="arm-2" />Arm C · explore</span>
        </div>
        <p>{item.interpretation}</p>
        <div className="m12-notation-box"><strong>Notation:</strong> ε (epsilon) = probability of exploring; 1−ε = probability of choosing a current best action; Q(s,a) = estimated value of action a in state s.</div>
        <SearchCallout label="ε-greedy rule" tone="cyan">
          With probability 1−ε choose an action with maximal Q(s,a); with
          probability ε choose an action at random.
        </SearchCallout>
        <small className="m12-demo-caveat">The dots show an easy-to-read example allocation, not a claim that every 20 random decisions will have exactly these counts.</small>
      </section>
    </div>
  );
}

const updateSteps = [
  {
    label: "Current estimate",
    equation: "Q(s,a) = 2.00",
    detail: "This is the value stored before the transition.",
    interpretation: "The learner currently predicts a long-run value of 2.00 for taking action a in state s. This is a prediction, not the reward from this single step.",
  },
  {
    label: "One-step target",
    equation: "r + γ max Q(s′,a′) = −1 + 0.9(5) = 3.50",
    detail: "Bootstrap from the best estimated action value in the successor state.",
    interpretation: "The sample suggests 3.50: immediate reward −1 plus 90% of the best estimated future value 5.00.",
  },
  {
    label: "TD error",
    equation: "δ = 3.50 − 2.00 = 1.50",
    detail: "The target exceeds the current estimate, so the update moves upward.",
    interpretation: "The positive error means this transition was 1.50 better than the old prediction. A negative error would move Q downward.",
  },
  {
    label: "Updated value",
    equation: "Q ← 2.00 + 0.2(1.50) = 2.30",
    detail: "The learning rate α=0.2 moves only partway toward the target.",
    interpretation: "The learner closes 20% of the 1.50 gap, adding 0.30. It keeps some prior knowledge instead of replacing Q with one noisy sample.",
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
        <p className="m12-page-explainer">One action was taken in state s. It produced reward −1 and next state s′, where the best available action is currently estimated at 5.</p>
        <div className="m12-notation-box"><strong>Notation:</strong> s = current state; a = action; r = reward; s′ = next state; α (alpha) = learning rate; γ (gamma) = discount factor; δ (delta) = TD error.</div>
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
        <div className="m12-update-meaning"><strong>Interpretation:</strong> {item.interpretation}</div>
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
    path: [0, 1, 2, 5, 8],
    note: "Reward begins to propagate backward from the goal.",
  },
  {
    label: "After repeated episodes",
    q: ["0.6", "1.4", "0.1", "−1.0"],
    path: [0, 1, 2, 5, 8],
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
        <p className="m12-page-explainer">The agent starts at the upper-left cell and can move up, right, down, or left. Highlighted cells show the route sampled in the selected learning snapshot.</p>
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
        <div className="m12-grid-legend">
          <span><i className="start" />Start</span>
          <span><i />ordinary cell · small step cost</span>
          <span><i className="path" />sampled path</span>
          <span><i className="hazard" />hazard −10</span>
          <span><i className="goal" />goal +10</span>
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
        <div className="m12-notation-box"><strong>Notation:</strong> Q(Start,·) lists the estimated values of every action at Start; the dot means “all available actions.”</div>
        <div className="m12-q-compass">
          <article><small>↑</small><strong>{state.q[0]}</strong></article>
          <article><small>→</small><strong>{state.q[1]}</strong></article>
          <article><small>↓</small><strong>{state.q[2]}</strong></article>
          <article><small>←</small><strong>{state.q[3]}</strong></article>
        </div>
        <p>{state.note}</p>
        <small className="m12-demo-caveat"><strong>How to read the rounds:</strong> select 1→4 to compare the table after more experience. Only sampled transitions update. These values form a simplified teaching trace rather than measurements from a hidden production system.</small>
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
        <div className="m12-notation-box"><strong>Notation:</strong> a′ = next action; max<sub>a′</sub> chooses the largest next-action value; Q(s′,a′) uses the action actually selected at the next state.</div>
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
    title: "How an agent learns from consequences",
    subtitle: "Act, observe the result, update what seems useful, and try again.",
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
    note: "Reinforcement learning begins with interaction. An agent observes its situation, chooses an action, and then sees what happens. The environment changes and returns a reward that scores the immediate consequence. The agent uses repeated experience to improve its policy, which is the rule it uses to choose actions. Unlike supervised learning, the agent is not usually shown the correct action for every situation. It must try actions, experience delayed consequences, and learn which choices produce high total reward over time. This lesson follows that loop from interaction, to return, to value estimates, and finally to Q-learning and policy improvement.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Reinforcement learning foundations",
    title: "Five ideas behind reinforcement learning",
    content: (
      <div className="m12-source-and-notes">
        <ReinforcementLearningFiveAspects />
        <section>
          <span>How the ideas fit together</span>
          <h3>Five durable knowledge points</h3>
          <ol>
            <li><b>↻</b><span>The agent learns through trial and error.</span></li>
            <li><b>★</b><span>Feedback arrives as reward, not a labeled correct action.</span></li>
            <li><b>→</b><span>A policy connects situations to actions.</span></li>
            <li><b>Σ</b><span>Performance concerns cumulative reward.</span></li>
            <li><b>?</b><span>Exploration produces the experience used to learn.</span></li>
          </ol>
        </section>
      </div>
    ),
    note: "This page introduces five ideas that appear throughout reinforcement learning. First, learning happens through trial and error. Second, feedback is given as reward rather than as a labeled correct action. Third, a policy connects a situation to an action choice. Fourth, success depends on cumulative reward, so a decision can be useful even when its immediate reward is small. Fifth, exploration matters because the agent cannot learn about an action it never tries. These ideas work together: exploration creates experience, reward evaluates consequences, and the policy changes as the agent learns from that experience.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Policy objective · expected return",
    title: "A strong policy maximizes expected return under stated assumptions",
    content: (
      <div className="m12-claim-audit">
        <article>
          <span>Objective</span>
          <h3>maximize expected return</h3>
          <p>Choose actions so cumulative discounted reward is high on average.</p>
        </article>
        <i>→</i>
        <article className="corrected">
          <span>What affects the result</span>
          <h3>representation · exploration · data · algorithm</h3>
          <p>
            These choices determine whether learning approaches the best policy
            available within the modeled problem.
          </p>
        </article>
        <SearchCallout label="Optimality is model-relative" tone="amber">
          A policy can score highly under the chosen state, reward, and
          transition model without being safe or effective in every real-world
          situation.
        </SearchCallout>
      </div>
    ),
    note: "The objective in reinforcement learning is to learn a policy that produces high expected return. Expected return means the average cumulative discounted reward we would receive if we repeatedly followed that policy. Success depends on what the state represents, how the agent explores, which experiences are collected, and what assumptions the learning algorithm makes. In a large problem, the agent may approximate values instead of storing an exact table. Therefore, an optimal policy is always optimal relative to the modeled states, actions, transitions, and rewards. It is not automatic proof that the policy is safe, fair, or effective in every real-world situation.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Reinforcement learning applications",
    title: "Games and elevators both learn from action-dependent experience",
    content: (
      <div className="m12-application-pair">
        <article>
          <div className="m12-game-board" aria-label="Small game board">
            {["♟", "", "♙", "", "♜", "", "", "♔", ""].map((piece, index) => (
              <span key={index}>{piece}</span>
            ))}
          </div>
          <section>
            <span>Game playing · Chess</span>
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
            <span>Control · Elevator</span>
            <h3>Scheduling balances waiting time and changing demand</h3>
            <p>Simulation supports retraining when operating conditions change.</p>
          </section>
        </article>
      </div>
    ),
    note: "Games and elevator control illustrate the same learning pattern in different settings. In a game, the state is the current position, the actions are legal moves, and the final result can provide reward. The agent may learn through self-play or by playing people. In elevator control, the state includes elevator locations and waiting calls, while actions include moving, stopping, or assigning a car. Reward might reflect waiting time, travel time, or energy use. In both cases, the action changes what happens next, so the agent’s decisions also influence the experience from which it learns.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Batch and online learning",
    title: "Batch learning updates later; online learning updates as data arrive",
    content: (
      <div className="m12-full-source">
        <SourceFrame
          slide={32}
          alt="Comparison of batch offline learning and online learning"
          caption="Batch and online learning compared through a complete prediction-and-update pipeline."
        />
      </div>
    ),
    note: "Batch and online learning describe when a model is updated. In batch learning, the system first collects a fixed dataset, trains on that dataset, and then uses the trained model. In online learning, examples arrive over time and the model is updated incrementally. A prediction can be followed by a true response, and that new evidence changes the model before the next prediction. This distinction is about the update schedule. It does not by itself determine whether the task is supervised learning or reinforcement learning. An online supervised model can receive labels without choosing actions that affect the future data source.",
    sourceSlides: [32],
  },
  {
    eyebrow: "Batch and online learning · visual comparison",
    title: "Online learning and reinforcement learning are not the same thing",
    content: (
      <div className="m12-media-compare">
        <SearchSourceImage
          alt="Diagram comparing batch and online learning"
          caption="A prediction-and-update view of batch and online learning."
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
    note: "Online learning and reinforcement learning can occur together, but they answer different questions. Online learning asks when the model updates: it updates as new examples arrive. Reinforcement learning asks how an agent should act when actions affect future states and rewards. An RL agent may update immediately after every transition, or it may learn later from stored experience. Similarly, an online supervised learner may update continuously without controlling the process that generates its labeled examples. The key distinction is that reinforcement learning involves sequential decisions, action-dependent data, and consequences that can be delayed.",
    sourceSlides: [32, 33],
  },
  {
    eyebrow: "Machine-learning categories",
    title: "Learning methods can be grouped in several different ways",
    content: (
      <LearningCategoriesComparison />
    ),
    note: "Machine-learning systems can be classified along several independent dimensions. A method can use symbolic rules, statistical representations, neural networks, or a hybrid. It can learn from labels, discover structure without labels, or learn from reward. It can train from a fixed batch or update online. Deep learning describes a kind of representation, while reinforcement learning describes a sequential decision setting. Because these categories answer different questions, one system can belong to several categories at once. For example, a robot can use deep neural networks, learn from reward, and update its model online.",
    sourceSlides: [33],
  },
  {
    eyebrow: "Learning categories · separate dimensions",
    title: "Update timing and decision making are separate questions",
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
    note: "This page separates four questions that are often mixed together. Feedback asks what learning signal is available: labels, discovered structure, or reward. Update schedule asks whether learning happens in batches or incrementally. Representation asks whether knowledge is stored symbolically, statistically, neurally, or through a hybrid. Decision setting asks whether the system predicts, plans, or controls a sequence of actions. Reinforcement learning belongs primarily to the decision-setting and reward-feedback dimensions. Online learning belongs to the update-schedule dimension. A reinforcement-learning robot can therefore be online, neural, and reward-based at the same time.",
    sourceSlides: [33],
  },
  {
    eyebrow: "Decision model · Markov decision process",
    title: "An MDP names the five parts of a decision problem",
    content: (
      <div className="m12-mdp-map">
        <section>
          <span>Markov decision process</span>
          <h3>⟨S, A, P, R, γ⟩</h3>
          <p>The current state must contain the information needed to predict the next transition under an action.</p>
          <div className="m12-notation-box"><strong>Notation:</strong> S = states; A = actions; P = transition probabilities; R = rewards; γ (gamma) = discount factor.</div>
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
    note: "A Markov decision process, or MDP, gives us a precise vocabulary for a reinforcement-learning problem. S is the set of states the agent can distinguish. A is the set of available actions. P describes the transition probabilities: what next state may follow an action. R gives the immediate reward. Gamma, written γ, discounts rewards that arrive later. The state should contain enough information to predict the next transition and reward once the action is known. Transition probabilities describe what may happen, while rewards describe how the objective scores what happened. They are related, but they are not the same object.",
    sourceSlides: [],
  },
  {
    eyebrow: "Agent–environment interaction",
    title: "The agent acts; the environment returns a state and reward",
    content: <InteractionLoopExplorer />,
    note: "At time t, the agent observes state sₜ and selects action aₜ using its policy π. The environment responds with the next state sₜ₊₁ and reward rₜ₊₁. The reward evaluates the consequence, but it does not tell the agent which action would have been correct. The learner updates its value estimates or policy and repeats the loop. The action arrow is crucial because the selected action changes the next experience. This makes reinforcement-learning data action-dependent: the agent partly determines which states and rewards it will observe in the future.",
    sourceSlides: [],
  },
  {
    eyebrow: "Experience over time · trajectories and episodes",
    title: "Reinforcement-learning experience comes in an ordered sequence",
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
          <div className="m12-notation-box"><strong>Notation:</strong> s<sub>0</sub> = starting state; a<sub>0</sub> = first action; r<sub>1</sub> = reward received after that action; terminal = the episode ends.</div>
          <SearchCallout label="Continuing task" tone="cyan">
            Elevator control may have no terminal state; discounting or an
            average-reward objective can keep the return well-defined.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "A trajectory is an ordered record of interaction: state, action, reward, next state, and so on. In this elevator example, the system begins in the lobby, takes the action go up, receives a step cost, reaches floor two, serves a call, and then receives a positive reward. Each transition can be written as a tuple containing the current state, action, reward, and next state. An episode is a trajectory with a natural ending, such as finishing a game. Elevator control may instead be a continuing task with no terminal state, so its objective needs discounting or an average-reward formulation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative reward · return",
    title: "Return combines immediate and future rewards",
    content: (
      <div className="m12-equation-stage">
        <section>
          <span>Discounted return from time t</span>
          <h3>Gₜ = rₜ₊₁ + γrₜ₊₂ + γ²rₜ₊₃ + ···</h3>
          <p>γ ∈ [0,1] controls how strongly delayed rewards influence the present.</p>
          <div className="m12-notation-box"><strong>Notation:</strong> G<sub>t</sub> = total discounted return from time t; r<sub>t+1</sub> = next reward; γ = discount factor; ∈ [0,1] means γ ranges from 0 through 1.</div>
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
    note: "Return combines the reward received next with rewards that arrive later. Gₜ is the return viewed from time t. Gamma, γ, controls how strongly delayed rewards count. When γ is zero, only the immediate reward matters. When γ lies between zero and one, later rewards still matter but receive progressively smaller weights. For a finite episode, γ can sometimes be one so that all rewards count equally. A policy is evaluated by expected return because transitions and rewards may be uncertain. Maximizing only the immediate reward can fail when a temporary cost leads to a much larger future benefit.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked demonstration · discounting",
    title: "The discount factor changes how much future rewards matter",
    content: <ReturnExplorer />,
    note: "The reward sequence stays fixed on this page, but the return changes when γ changes. The first reward is a cost of minus one, followed by zero, and then a goal reward of ten. With γ equal to zero, the agent ignores the delayed goal and sees only minus one. As γ increases, the future goal contributes more to the present return. Gamma is not a probability. It is a weighting factor chosen as part of the objective. A smaller γ creates a shorter effective planning horizon, while a value near one makes distant consequences more important.",
    sourceSlides: [],
  },
  {
    eyebrow: "Policies and value functions",
    title: "A policy chooses; value estimates the long-term result",
    content: (
      <div className="m12-policy-values">
        <article>
          <span>Policy</span>
          <h3>π(a|s)</h3>
          <p>A distribution over actions in state s.</p>
          <small>What will the agent do?</small>
          <div className="m12-notation-box"><strong>Notation:</strong> π (pi) = policy; π(a|s) = probability of choosing action a when the state is s.</div>
        </article>
        <article>
          <span>State value</span>
          <h3>Vπ(s)=Eπ[Gₜ|sₜ=s]</h3>
          <p>Expected return from a state under policy π.</p>
          <small>How good is this situation?</small>
          <div className="m12-notation-box"><strong>Notation:</strong> V<sup>π</sup>(s) = value of state s under policy π; E = expected average over possible futures.</div>
        </article>
        <article>
          <span>Action value</span>
          <h3>Qπ(s,a)=Eπ[Gₜ|sₜ=s,aₜ=a]</h3>
          <p>Expected return after taking action a, then following π.</p>
          <small>How good is this choice here?</small>
          <div className="m12-notation-box"><strong>Notation:</strong> Q<sup>π</sup>(s,a) = value of taking action a in state s, then following policy π.</div>
        </article>
        <aside>
          <strong>Control idea</strong>
          <p>If Q is accurate, choose an action with the largest Q(s,a)—while retaining enough exploration to improve the estimates.</p>
        </aside>
      </div>
    ),
    note: "A policy and value function answer different questions. The policy π(a|s) describes how actions are chosen in state s. The state-value function Vπ(s) estimates the expected return from state s when policy π is followed. The action-value function Qπ(s,a) estimates the return after taking action a in state s and then following π. Q is especially useful for control because actions can be compared directly. If the Q-values are accurate, the agent can choose an action with the largest Q(s,a) without separately calculating the transition model at decision time.",
    sourceSlides: [],
  },
  {
    eyebrow: "Live demonstration · exploration as information gathering",
    title: "Should the agent use its best action or test another one?",
    content: <BanditLab />,
    note: "This three-arm bandit isolates the exploration problem. Imagine three slot-machine arms, treatments, or recommendations whose success rates are unknown. The agent repeatedly chooses one action a and observes a binary reward r: one means success and zero means no success. N(a) counts how many times that arm has been pulled, and R(a) is the total reward collected from it. The displayed estimate is the sample average, Q-hat of a equals R(a) divided by N(a). Before the first pull, N(a) is zero, so the page shows a question mark instead of dividing by zero. After every click, the selected arm reveals its next hidden outcome; N and possibly R increase, so Q-hat is recalculated. For example, two successes in three pulls produce Q-hat equals two-thirds, or about 0.67. The demo uses fixed repeating zero-one sequences so the classroom result is reproducible. Pulling an arm has two effects: it may earn reward now, and it produces evidence that improves the estimate for that action. Always choosing the current best estimate exploits existing knowledge, but an early lucky result can cause the agent to ignore a better arm. Trying another arm explores and may improve later choices. A bandit has no changing state, so it is a simplified one-state reinforcement-learning problem rather than a full sequential environment.",
    sourceSlides: [],
  },
  {
    eyebrow: "Exploration strategy · ε-greedy",
    title: "ε-greedy usually exploits and sometimes explores",
    content: <EpsilonGreedyExplorer />,
    note: "The ε-greedy rule balances exploitation and exploration. With probability one minus ε, the agent chooses an action with the largest current Q-value. With probability ε, it chooses an action at random. If ε is zero, the agent never deliberately explores. If ε is 0.1, exploration occurs about ten percent of the time over many decisions. If ε is 0.5, exploration is frequent, producing more information but sacrificing many currently preferred choices. The dots illustrate typical proportions; a short random sequence will not always contain exactly those counts.",
    sourceSlides: [],
  },
  {
    eyebrow: "Action-value learning · Q-learning",
    title: "Q-learning updates one action value after each transition",
    content: (
      <div className="m12-q-equation">
        <section>
          <span>Off-policy temporal-difference control</span>
          <h3>Q(s,a) ← Q(s,a) + α[r + γ maxₐ′Q(s′,a′) − Q(s,a)]</h3>
          <div className="m12-equation-translation">
            <strong>new estimate</strong><i>=</i><strong>old estimate</strong><i>+</i><strong>learning rate</strong><i>×</i><strong>prediction surprise</strong>
          </div>
          <div className="m12-notation-box"><strong>Notation:</strong> Q(s,a) = estimated return for taking action a in state s; ← = replace the old value; α = learning rate; r = immediate reward; γ = discount factor; s′ = next state; a′ = a possible next action; max = use the largest next-action estimate.</div>
        </section>
        <div>
          <article><strong>α</strong><h3>learning rate</h3><p>how far to move toward this sample target</p></article>
          <article><strong>r</strong><h3>reward</h3><p>immediate feedback from the transition</p></article>
          <article><strong>γ</strong><h3>discount</h3><p>weight on the successor estimate</p></article>
          <article><strong>max Q′</strong><h3>bootstrap</h3><p>estimated value of the greedy next action</p></article>
        </div>
        <SearchCallout label="Equation focus" tone="amber">
          The target is <strong>r + γ max Q(s′,a′)</strong>. Subtracting the old
          Q(s,a) gives the TD error: how surprising this transition was. α
          determines how much of that error is learned now.
        </SearchCallout>
      </div>
    ),
    note: "The Q-learning equation updates one stored action value after observing a transition. Q(s,a) is the current estimate. The bracketed expression compares that estimate with a one-step target: the immediate reward plus discounted value of the best estimated action in the next state. Their difference is the temporal-difference error. Alpha, α, is the learning rate and controls how far the estimate moves toward the target. Because the target uses the maximum next-action value, Q-learning learns about a greedy target policy even when the behavior policy explores. For a terminal next state, the future-value term is conventionally zero.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked demonstration · one numeric Q update",
    title: "Work a Q-learning update in three steps",
    content: <QUpdateStepper />,
    note: "Here the current Q-value is 2. The observed reward is minus one, gamma is 0.9, and the best next-state Q-value is 5. First compute the target: minus one plus 0.9 times 5 equals 3.5. Next compute the temporal-difference error: 3.5 minus the current estimate 2 equals 1.5. Because the error is positive, the estimate should move upward. Finally, multiply the error by the learning rate 0.2 and add it to the old value. The new Q-value is 2.3, which moves partway—not all the way—toward the target.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive demonstration · tabular gridworld",
    title: "Repeated experience spreads goal information through the Q-table",
    content: <GridworldStudio />,
    note: "The gridworld shows how reward information moves backward through experience. Initially, every action at Start has the same estimate. A failed route lowers estimates for actions along that path. A successful route produces a positive goal reward, and later updates make actions leading toward that route more valuable. After repeated episodes, moving right becomes the greedy choice at Start. The table learns only from sampled transitions, so actions that have not been tried remain uncertain. These snapshots illustrate the learning pattern; they are not claiming exact convergence for a fully specified stochastic environment.",
    sourceSlides: [],
  },
  {
    eyebrow: "Q-learning algorithm · tabular form",
    title: "Q-learning repeats six simple steps",
    content: (
      <div className="m12-algorithm">
        <div className="m12-algorithm-guide"><strong>Read the loop:</strong> Step 1 prepares the table once. Steps 2–6 repeat for every transition. Only the Q entry for the experienced pair (s,a) changes on that update.</div>
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
          <div className="m12-notation-box"><strong>Terms:</strong> behavior policy = action rule used to collect experience; target policy = policy being learned; off-policy = these two policies may differ.</div>
          <div className="m12-algorithm-context"><strong>Episode boundary:</strong> if s′ is terminal, there is no next action, so the future-value term is 0. Begin a new episode from a start state.</div>
          <SearchCallout label="Tabular boundary" tone="cyan">
            One table entry per state-action pair is feasible only when the
            discrete space is small enough to enumerate.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Tabular Q-learning repeats a local update. Initialize a Q-value for each state-action pair. Observe the current state and select an action using a behavior policy such as ε-greedy. Execute the action, then observe the reward and next state. Update the one Q-entry toward the reward plus discounted maximum next-state Q-value. Move to the next state and repeat until the episode ends. The behavior policy explores, while the target in the update is greedy, which makes Q-learning off-policy. A table works only when the state-action space is small enough to enumerate.",
    sourceSlides: [],
  },
  {
    eyebrow: "Compare control methods · Q-learning and SARSA",
    title: "Q-learning and SARSA use different next-action targets",
    content: <TDComparison />,
    note: "Q-learning and SARSA differ in the next-action value placed in the target. Q-learning uses the maximum estimated Q-value at the next state, so it evaluates what a greedy policy would do next. SARSA uses the Q-value of the action that the behavior policy actually selected. This makes Q-learning off-policy and SARSA on-policy. In a risky environment, an exploratory policy may occasionally take unsafe actions. SARSA can incorporate that exploratory risk into its values, while Q-learning evaluates the greedy next action even if the observed behavior continues to explore.",
    sourceSlides: [],
  },
  {
    eyebrow: "Limits, safety, and evaluation",
    title: "High training reward does not guarantee safe or reliable behavior",
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
    note: "A high training reward is not enough to establish that a policy is useful or safe. Interaction may be expensive or dangerous, and an agent can exploit a poorly designed reward rather than accomplish the intended goal. Learning can also become unstable, especially when bootstrapping, off-policy data, and function approximation interact. A policy trained in simulation may fail when real dynamics change. Exploration that is acceptable in a game may be unacceptable in an elevator or medical system. Evaluation should therefore include baselines, multiple scenarios, variation across runs, safety constraints, and checks for reward loopholes—not only the best training score.",
    sourceSlides: [],
  },
  {
    eyebrow: "Guided practice · calculate, classify, diagnose",
    title: "Practice the calculation and explain what each result means",
    content: <GuidedPracticeStudio />,
    note: "This practice page brings together four skills. For the return problem, attach the correct power of gamma to each delayed reward before adding. For the Q-learning update, separate the target, temporal-difference error, and learning-rate step. For the policy problem, identify the largest Q-value and then consider how a nonzero epsilon would change action selection. For the diagnosis problem, distinguish an algorithm error from a reward-design error. If a robot earns points by spinning instead of delivering, the optimizer may be working correctly while the reward is an incomplete proxy for the intended task.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment · independent retrieval",
    title: "Check your understanding: what makes reinforcement learning different?",
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
          <div className="m12-notation-box"><strong>Notation:</strong> Q′ = largest next-state action value; α = learning rate; γ = discount factor; target = r + γ max Q′.</div>
          <strong>Check value: new Q = 1.00</strong>
        </aside>
      </div>
    ),
    note: "The strongest distinction is that reinforcement-learning actions affect future data and rewards can be delayed. Online supervised learning can update from arriving labeled examples without controlling their source. For the calculation, the target is r plus gamma times the largest next Q-value: 2 plus 0.5 times 4 equals 4. The old Q-value is zero, so the error is 4. With alpha equal to 0.25, the update adds one, producing a new Q-value of 1. A complete answer should also name a concrete risk that reward misses, such as safety, fairness, energy cost, or undesirable shortcuts.",
    sourceSlides: [],
  },
  {
    eyebrow: "Readings and synthesis",
    title: "Review the learning loop and continue with the readings",
    content: (
      <div className="m12-source-and-readings">
        <SourceFrame
          slide={36}
          alt="Recommended textbooks for reinforcement learning"
          caption="Foundational readings for reinforcement learning and intelligent decision making."
        />
        <section>
          <span>Recommended reading list</span>
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
    note: "The lesson can now be summarized as one connected loop. Interaction produces transitions and rewards. Return combines immediate and delayed rewards into the objective. Value functions estimate the long-term consequences of states and actions. Q-learning updates an action value from one observed transition, and a policy improves by favoring actions with larger Q-values while preserving enough exploration to keep learning. The readings extend this foundation with formal convergence arguments, alternative control methods, and broader treatment of reinforcement learning. As you read, keep asking which assumptions concern the environment, which concern the objective, and which concern the learning algorithm.",
    sourceSlides: [36],
  },
];

const instructorNotes = [
  `Reinforcement learning is learning through consequences. Look at the loop on this page from left to right. The agent first chooses an action. The world responds by changing, and a reward gives the agent a numerical signal about that consequence. Then the process repeats. The important difference from ordinary supervised learning is that nobody hands the agent a correct-action label after every decision. The agent has to discover useful behavior by acting, observing, and updating.

The four words at the bottom give us the path through this lesson. Interaction means the agent and environment repeatedly affect one another. Return means the total reward across time, not just the reward from one step. Value means an estimate of how useful a state or action will be in the long run. Control means using those estimates to choose better actions. We will keep one question in view: how can a learner connect a decision made now with a consequence that may arrive several steps later? Q-learning is one answer. By the end, we will be able to read its update equation, calculate one update, and explain why exploration is necessary.`,

  `This source page gives us five ideas that belong together. First, trial and error means the learner must actually try actions and observe the results. Second, reward is feedback, but it is not the same as a correct-answer label. A reward says how desirable an outcome was; it does not necessarily say what the agent should have done instead. Third, the policy is the rule that connects a situation to an action. You can think of it as the agent's current strategy.

Fourth, the sigma symbol on the page suggests a sum: we care about cumulative reward across many steps. An action with a small immediate cost may still be useful if it leads to a larger reward later. Fifth, exploration means deliberately trying actions whose value is uncertain. Without exploration, the learner can become trapped using the first action that looked good. Put the five ideas into one sentence: exploration creates varied experience, reward evaluates the consequences, and learning uses that experience to improve the policy so that total reward increases over time.`,

  `The phrase “learns an optimal policy” needs careful interpretation. Optimal describes the mathematical goal: among the policies allowed by our model, we want one with the greatest expected return. It does not mean that every reinforcement-learning run automatically discovers a perfect strategy. The corrected statement on the right is more precise: learn a policy that maximizes expected return. Expected means an average over possible uncertain futures, and return means the discounted total of future rewards.

Several conditions affect whether the learned policy is actually strong. The state representation may omit important information. Exploration may fail to visit useful or risky situations. The learner may not receive enough data, or its function approximator may generalize badly. The environment may also change after training. Even a policy with high measured return can exploit a loophole in the reward. So separate three claims: the objective defines what optimal would mean, the algorithm tries to approach that objective, and evaluation provides evidence about how well the resulting policy works. Those are related claims, but they are not interchangeable guarantees.`,

  `The two pictures show very different applications, but the decision structure is the same. In a game, a state is the current board position, an action is a legal move, and reward may be sparse—for example, zero during play and positive or negative only when the game ends. A move changes the next position, so the learner's choices determine the future examples it will see. Self-play can generate many such trajectories without requiring a human to label every move.

Now consider the elevator. Its state might include car locations, directions, passenger calls, time of day, and current loads. Actions might move a car, stop at a floor, or assign a request. A reward could penalize waiting time, energy use, overcrowding, or unfair service. This example shows why reward design matters: optimizing only average waiting time might leave a small group waiting far too long. In both applications, an action changes the future state, consequences may be delayed, and the agent learns from action-dependent experience. The domain changes, but the agent–environment loop stays recognizable.`,

  `This page compares batch and online learning, and the distinction is about timing. In batch learning, we collect a fixed dataset, train a model using that collection, and then deploy the result. If new data arrive, we usually gather another batch and retrain later. In online learning, data arrive one example or one small group at a time. The model predicts, receives new evidence, updates, and is ready for the next example.

Follow the arrows in the diagram: data enter the model, the model produces a prediction, the true response arrives, and that response can trigger an update. The word online does not necessarily mean “connected to the internet.” It means incremental updating as observations arrive. Also, online learning is not a synonym for reinforcement learning. An online spam filter may receive a correct label after each message without choosing actions that change the next message. Reinforcement learning adds sequential decisions and action-dependent consequences. Keep the two questions separate: when does the model update, and how is feedback generated?`,

  `The left side preserves the original batch-versus-online figure. The right side separates two concepts that are easy to confuse. Online learning answers the question, “When is the model updated?” The answer is incrementally, as new examples arrive. Reinforcement learning answers a different question: “How should an agent choose actions when those actions affect later states and rewards?”

An RL system can update online after every transition, but it does not have to. Offline reinforcement learning can train from a stored collection of past interactions. Likewise, an online supervised learner can update continually without controlling the source of its data. Imagine a weather predictor that updates each day after the true temperature is recorded. That is online learning, but its prediction does not cause tomorrow's weather. By contrast, a robot's steering action changes where the robot goes and what sensor readings it sees next. That action-dependent data is central to RL. So the strongest distinction is not simply “updates frequently.” It is sequential action, delayed reward, and experience shaped by the learner's own behavior.`,

  `This page reminds us that machine-learning categories are not one single list of mutually exclusive boxes. One category may describe the feedback, another the representation, and another the update schedule. Supervised learning uses labeled examples. Unsupervised learning looks for structure without target labels. Reinforcement learning uses reward to evaluate sequences of action. Batch and online describe when updating occurs. Symbolic, statistical, neural, and hybrid describe how knowledge is represented or computed.

That means one system can have several labels at once. A robot might use a deep neural network as its representation, reinforcement learning as its decision framework, and online updates as new experience arrives. Another RL agent might use a small table and learn offline from stored transitions. Deep learning and reinforcement learning are therefore not competitors at the same level; deep describes a model family, while reinforcement learning describes a decision and feedback setting. When classifying a system, first ask what dimension the label answers. This prevents us from treating a useful taxonomy as if every term were mutually exclusive.`,

  `Here we organize the taxonomy into four independent questions. Feedback asks what signal supports learning: explicit labels, patterns found in the data, or rewards following action. Update schedule asks when parameters change: after collecting a batch, continually online, or later from stored replay. Representation asks how the learner stores what it knows: rules, statistics, neural networks, or a hybrid. Decision setting asks what the system must do: make a prediction, plan a sequence, or control an environment.

Use the example at the bottom to combine the dimensions. An RL robot can receive reward feedback, update online, represent its action values with a neural network, and solve a sequential-control problem. None of those descriptions cancels another. Reinforcement learning belongs mainly to the reward-feedback and sequential-decision dimensions. Online learning belongs only to the update-schedule dimension. This four-question structure will also help when reading research papers: instead of asking for one label, identify the feedback, timing, representation, and decision setting separately.`,

  `An MDP, or Markov decision process, names the pieces of a sequential decision problem. The angle brackets group five objects. S is the set of states—the situations the agent can distinguish. A is the set of actions available. P is the transition model. The expression P of s-prime given s and a means the probability of reaching next state s-prime after taking action a in state s. R is the reward function, which scores an immediate consequence. Gamma, written with the Greek letter γ, is the discount factor that controls how much later rewards count.

The word Markov means the current state contains the information needed to predict the next transition once the action is known. It does not mean the future is deterministic. P can assign probabilities to several possible next states. Also keep dynamics and reward separate: P describes what may happen, while R describes how the objective evaluates it. In reinforcement learning, P and R may be unknown; the agent can learn useful behavior from sampled transitions rather than receiving the complete model in advance.`,

  `This diagram shows one complete interaction step. At time t, the agent observes state s-sub-t. It selects action a-sub-t according to policy pi. The expression pi of dot given s means a distribution over the possible actions in that state; the choice may be deterministic or random. After the action, the environment produces the next state s-sub-t-plus-one and the reward r-sub-t-plus-one. The plus one reminds us that both are consequences observed after the action at time t.

Now click through the five numbered steps. Observe identifies the current state representation. Act applies the policy. Transition is the environment's response. Reward evaluates the immediate result. Update changes Q, the action-value estimate, or changes the policy itself. Then the loop repeats. The arrow from agent to environment is essential: the action influences which experience arrives next. Therefore RL data are not a passive sample drawn independently of the learner. The learner partly creates its own training distribution, which is one reason exploration and safe data collection are so important.`,

  `A trajectory is the ordered history produced by interaction. Read this elevator example in time order: the system starts in a lobby state, chooses the action “go up,” receives a step cost, reaches floor two, serves a call, and later receives a positive reward. We often write one transition as the tuple s, a, r, s-prime: current state, selected action, observed reward, and next state. A learning algorithm can store many such transitions and use them for updates.

An episode is a trajectory with a natural ending. A chess game ends in a win, loss, or draw; a delivery episode ends when the package arrives. Some problems are continuing tasks. Elevator control does not naturally terminate at the end of the day unless we define an artificial boundary. For continuing tasks, discounting or an average-reward objective keeps the long-run criterion meaningful. Order matters throughout this page. If we shuffle the symbols and forget which action produced which next state and reward, we lose the causal sequence the learner needs to evaluate decisions.`,

  `Return is the quantity the agent ultimately tries to increase. G-sub-t means the return viewed from time t. It begins with r-sub-t-plus-one, the next reward, then adds gamma times the following reward, gamma squared times the reward after that, and so on. Each additional delay adds another power of gamma. The interval notation gamma belongs to zero through one means gamma may range from 0 to 1, including the endpoints.

When gamma is zero, only the immediate next reward matters. When gamma lies between zero and one, delayed rewards still count but receive smaller weights. When gamma is one, all rewards count equally; that is most straightforward for finite episodes, because an infinite continuing sum could fail to remain finite. We use expected return because transitions and rewards may be uncertain. This equation explains why greedy attention to the next reward can be shortsighted. Paying a small cost now—such as moving away from congestion—may lead to a much better long-term outcome.`,

  `Use this page as a numerical experiment. The reward sequence is fixed: minus one now, zero one step later, and plus ten at the goal two steps later. Only gamma changes. The equation is G-sub-t equals minus one plus gamma times zero plus gamma squared times ten. With gamma equal to zero, both delayed terms disappear, so the return is minus one. The learner would see only the immediate cost and ignore the goal.

Try gamma equal to one half. The goal receives weight one quarter because it is two steps away, so it contributes 2.5 and the return becomes 1.5. With gamma equal to 0.9, the goal contributes 8.1 and the return becomes 7.1. With gamma equal to one, the return is 9. Gamma is not a probability that the goal occurs; it is a weighting parameter in the objective. A small gamma creates a short effective horizon. A value near one gives distant outcomes much more influence, but may also increase variance and make estimation harder.`,

  `This page separates the policy from two kinds of value. Pi of a given s is the policy: the probability of choosing action a when the state is s. It answers, “What will the agent do?” V superscript pi of s is the state value under policy pi. It is the expected return starting in state s and then following that policy. The expectation symbol E means an average over possible future trajectories.

Q superscript pi of s comma a is the action value. It asks for the expected return after taking action a in state s and then following pi. The distinction is useful: V rates a situation, while Q directly compares choices within that situation. For control, if our Q estimates are accurate, a greedy policy can select an action with the largest Q of s comma a. The superscript pi matters because the same state can have different value under different future behavior. Value is not an intrinsic label permanently attached to a state; it depends on what the agent will do afterward.`,

  `The three-arm bandit strips away changing states so we can focus on exploration. Each arm is an action with an unknown reward distribution. When we pull an arm, we may receive a reward, but we also gain information that improves our estimate of that arm. This creates a tradeoff. Exploitation means choosing the action with the highest current estimated value. Exploration means trying an action whose value is less certain.

Interact with the arms and watch how the estimates change. An early lucky reward can make a mediocre arm look best, while an excellent arm may look poor after one unlucky sample. If the agent always exploits immediately, it may never collect the evidence needed to correct that mistake. Exploration can reduce reward in the short term but improve decisions later. A bandit is a one-state decision problem: there is no state transition to plan through. Full RL adds changing states and delayed consequences, but the same information-gathering problem remains. An action is valuable partly for its reward and sometimes for what it helps the agent learn.`,

  `Epsilon-greedy is a simple way to balance exploitation and exploration. The Greek letter epsilon, ε, is the exploration probability. With probability one minus epsilon, the agent selects an action with the largest current Q value. With probability epsilon, it selects randomly from the available actions. Q of s comma a is the estimated long-term value of taking action a in state s.

Assume Arm B currently has the largest estimate. Purple dots therefore represent exploitation, while the cyan and amber dots represent exploratory selections of A and C. Examine the three settings. When epsilon is zero, the agent is fully greedy and performs no deliberate exploration. At epsilon 0.1, about ten percent of decisions explore over a long run. At epsilon 0.5, exploration is frequent: the learner gathers broad evidence but often ignores its current best estimate. The twenty dots are an illustration, not a literal random sample or a guarantee. In a real set of twenty decisions, the number of exploratory choices can be higher or lower. In practice, epsilon is sometimes reduced over training so that learning begins with broad exploration and later relies more on the estimates, although reducing it too quickly can leave important actions untested.`,

  `Read the Q-learning equation from the inside out. Q of s comma a is the current estimate for the state-action pair we just experienced. The one-step target is the immediate reward r plus gamma times the largest estimated Q value at the next state s-prime. The prime mark means “next,” and max over a-prime means compare all possible next actions and keep the largest estimate.

The plain-language line under the equation summarizes the same operation: new estimate equals old estimate plus learning rate times prediction surprise. Subtracting the old Q from the target gives that surprise, formally called the temporal-difference error. A positive error says the outcome was better than expected; a negative error says it was worse. Alpha, α, is the learning rate. It determines what fraction of that error is added to the old estimate. The left arrow means replace the old value with the updated one. This is called bootstrapping because the target uses another current estimate rather than waiting for the full episode to finish. It is off-policy because the target evaluates the greedy next action even if the behavior that collected the transition was exploratory. If s-prime is terminal, its future value is taken as zero.`,

  `Now apply the equation in three clean stages. The current Q value is 2. The reward r is minus one. Gamma is 0.9, and the largest next-state Q value is 5. First compute the target: minus one plus 0.9 times 5. That is minus one plus 4.5, which equals 3.5. Keep the target separate so we can see what value the sample suggests.

Second, compute the temporal-difference error, shown as delta: target minus current estimate. That is 3.5 minus 2, or 1.5. The positive sign means this transition was better than the old estimate predicted. Third, apply the learning rate alpha equal to 0.2. Add 0.2 times 1.5 to the old value: 2 plus 0.3 equals 2.3. Notice that the new value does not jump all the way to 3.5. Alpha controls the step size, allowing many noisy samples to contribute over time. Use the buttons to reveal each stage. The interpretation box changes with the selected stage so that students can distinguish an old prediction, a sample target, a prediction error, and the final partial update.`,

  `The gridworld makes propagation visible. At the beginning, all four actions at Start have equal Q values, so the learner has no evidence favoring a direction. During exploration, it samples routes. A path that encounters step costs or a hazard produces lower targets for the actions on that path. A successful path reaches the goal and produces a positive reward. The action immediately before the goal benefits first because its update includes that reward directly.

Across later transitions and episodes, the useful information moves backward. The predecessor action bootstraps from a larger next-state Q value, and eventually the action Right at Start, shown by the route across the top row toward the goal, becomes more valuable. This is what the page means by reward information spreading through the table. Click through the snapshots and inspect Q of Start comma dot, the four action estimates at the starting cell. Blank cells are ordinary locations with a small movement cost; the red cell is a hazard worth minus ten, and the green goal is worth plus ten. The demonstration illustrates the mechanism, not a formal convergence proof. Exact numbers depend on the transition rules, rewards, learning rate, discount, exploration schedule, and sampled experience. Untried actions remain uncertain even when one route currently looks best.`,

  `Tabular Q-learning repeats these six steps. First initialize one Q value for every state-action pair. Zero is common, while optimistic initial values can encourage exploration. Second observe the current state s. Third choose action a using a behavior policy such as epsilon-greedy. The behavior policy is simply the rule used to collect experience.

Fourth execute the action and observe reward r and successor state s-prime. Fifth update only the experienced entry Q of s comma a toward the target r plus gamma times the maximum next-state Q value. Sixth replace s with s-prime and continue. Step one prepares the table once; steps two through six repeat for each transition. If the episode terminates, there is no next action, so the future-value term is zero and a new episode begins from a start state. Q-learning is off-policy because its behavior may explore while its target assumes the greedy next action. The target policy is the policy being learned; it can differ from the behavior policy. A literal table is practical only when the discrete state-action space is small enough to enumerate. Larger problems usually require approximation, which adds new stability and generalization concerns.`,

  `Q-learning and SARSA look almost identical, but one target term changes their meaning. Q-learning uses r plus gamma times the maximum Q value in the next state. It asks, “What value would the best estimated next action provide?” That greedy target makes Q-learning off-policy, because the update can evaluate a different action from the one the behavior policy actually takes.

SARSA uses r plus gamma times Q of s-prime comma a-prime, where a-prime is the next action actually selected by the behavior policy. Its name comes from the sequence State, Action, Reward, next State, next Action. Because it learns the value of the same policy used to act, SARSA is on-policy. The difference matters when exploration itself creates risk. Near a cliff, an epsilon-greedy behavior policy sometimes makes random dangerous moves. SARSA can account for that continuing exploratory risk and prefer a safer route. Q-learning evaluates the greedy continuation and may value a shorter path close to danger. Neither method is universally better; their targets answer different policy questions.`,

  `A high training reward is evidence about one measured objective, not a complete certificate of quality. Start with sample cost. Real interaction can be slow, expensive, or dangerous, so collecting enough varied experience may be difficult. Reward hacking occurs when the agent finds a way to increase the measured score without accomplishing the intended goal. A delivery robot that spins to trigger a motion reward is optimizing the proxy, not the task we meant.

Instability can arise when bootstrapping, off-policy learning, and function approximation interact. Distribution shift means a policy trained under one set of dynamics—perhaps in simulation—faces different conditions after deployment. Exploration risk reminds us that trying an unknown action may be acceptable in a game but unacceptable in transportation or medicine. Evaluation should use baselines, held-out scenarios, multiple random seeds, variance across runs, and explicit safety constraints. For the elevator example, a reward might combine average wait, worst-case wait, energy use, capacity, and safety violations. Even that formula needs testing for loopholes. The broader lesson is to evaluate intended behavior, not only the scalar the optimizer was given.`,

  `This practice page combines calculation with interpretation. Begin with the Return tab. Write each reward in order and attach one additional power of gamma for every step of delay. Do not treat gamma as a probability; it is the weight applied to future reward. On the Update tab, organize the work into target, temporal-difference error, and learning-rate step. That structure makes arithmetic mistakes easier to locate and explains what the result means.

On the Policy tab, compare the Q values and choose the largest when epsilon is zero. Then explain how a nonzero epsilon changes behavior: the greedy action remains preferred, but any action may sometimes be sampled. Finally, use the Diagnosis tab to distinguish learning failure from objective failure. If a robot earns reward by spinning rather than delivering, the optimizer may be following the reward exactly. The defect is that the reward is an incomplete proxy for our intent. Reveal each solution only after producing a reasoned answer. A strong response includes the calculation, defines the symbols used, and interprets the result in the decision setting.`,

  `The multiple-choice question checks the central distinction. Reinforcement learning is not defined by always updating online, and supervised learning is not restricted to batches. The strongest answer is that RL actions influence future data and rewards may be delayed. An online supervised learner can update from arriving labeled examples without controlling the process that produces them.

Now work the numeric update. The target is r plus gamma times max Q-prime. Substitute the values: 2 plus 0.5 times 4 equals 4. The old Q value is zero, so the temporal-difference error is 4 minus 0, which is 4. Alpha is 0.25, so the update adds one quarter of the error: 0 plus 0.25 times 4 equals 1. The new Q value is therefore 1. Finally, name one important concern a reward may omit. Suitable examples include safety, fairness, energy use, rare failures, or undesirable shortcuts. This final part matters because successful optimization of an incomplete number can still produce unacceptable behavior.`,

  `We can now connect the entire lesson in one chain. Interaction produces an ordered sequence of states, actions, rewards, and next states. Return combines the immediate and delayed rewards into the quantity the agent tries to increase. Value functions estimate that return before all future consequences are known. Q-learning uses one observed transition to move an action-value estimate toward a one-step target. A policy then improves by favoring actions with larger Q values while retaining enough exploration to test uncertain alternatives.

As you use the readings, keep three layers separate. The environment includes states, actions, transitions, and rewards. The objective defines return through the reward and discount factor. The learning algorithm specifies how estimates and behavior change from experience. Many misunderstandings come from moving a claim from one layer to another—for example, treating a reward definition as proof of safety or treating an optimization goal as a convergence guarantee. For the exit synthesis, explain where exploration enters the chain: it changes which actions are sampled, which transitions are observed, and therefore which Q values can be learned accurately.`,
] as const;

export function Meeting12Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  const deck = useMemo(
    () => slides.map((slide, index) => ({ ...slide, note: instructorNotes[index] })),
    [],
  );

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
