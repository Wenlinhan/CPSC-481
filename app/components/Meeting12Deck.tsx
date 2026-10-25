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
        <div className="m12-notation-box"><strong>Notation:</strong> ε (epsilon) = probability of exploring; 1−ε = probability of choosing a current best action; Q(s,a) = estimated value of action a in state s.</div>
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
        <div className="m12-notation-box"><strong>Notation:</strong> Q(Start,·) lists the estimated values of every action at Start; the dot means “all available actions.”</div>
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
    eyebrow: "Course foundation · page 30",
    title: "Five ideas behind reinforcement learning",
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
    eyebrow: "Source correction · qualify, do not erase",
    title: "The goal is a strong policy—not an automatic guarantee",
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
    note: "It is common to say that reinforcement learning finds an optimal policy, but that wording can sound like a guarantee. A more careful statement is that the algorithm tries to learn a policy that maximizes expected return. Whether it succeeds depends on the state representation, the amount and quality of exploration, the data collected, and the assumptions of the learning algorithm. In a large problem, the agent may also use an approximate value function rather than an exact table. Therefore, optimality is a mathematical objective. It is not proof that the learned policy is perfect, safe, or even well tested in every relevant situation.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Historical speaker notes · applications",
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
    note: "Games and elevator control illustrate the same learning pattern in different settings. In a game, the state is the current position, the actions are legal moves, and the final result can provide reward. The agent may learn through self-play or by playing people. In elevator control, the state includes elevator locations and waiting calls, while actions include moving, stopping, or assigning a car. Reward might reflect waiting time, travel time, or energy use. In both cases, the action changes what happens next, so the agent’s decisions also influence the experience from which it learns.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Course foundation · page 32",
    title: "Batch learning updates later; online learning updates as data arrive",
    content: (
      <div className="m12-full-source">
        <SourceFrame
          slide={32}
          alt="Course source page comparing batch offline learning and online learning"
          caption="Batch and online learning compared through a complete prediction-and-update pipeline."
        />
      </div>
    ),
    note: "Batch and online learning describe when a model is updated. In batch learning, the system first collects a fixed dataset, trains on that dataset, and then uses the trained model. In online learning, examples arrive over time and the model is updated incrementally. A prediction can be followed by a true response, and that new evidence changes the model before the next prediction. This distinction is about the update schedule. It does not by itself determine whether the task is supervised learning or reinforcement learning. An online supervised model can receive labels without choosing actions that affect the future data source.",
    sourceSlides: [32],
  },
  {
    eyebrow: "Exact embedded figure · source page 32",
    title: "Online learning and reinforcement learning are not the same thing",
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
    note: "Online learning and reinforcement learning can occur together, but they answer different questions. Online learning asks when the model updates: it updates as new examples arrive. Reinforcement learning asks how an agent should act when actions affect future states and rewards. An RL agent may update immediately after every transition, or it may learn later from stored experience. Similarly, an online supervised learner may update continuously without controlling the process that generates its labeled examples. The key distinction is that reinforcement learning involves sequential decisions, action-dependent data, and consequences that can be delayed.",
    sourceSlides: [32, 33],
  },
  {
    eyebrow: "Course foundation · page 33",
    title: "Learning methods can be grouped in several different ways",
    content: (
      <div className="m12-full-source">
        <SourceFrame
          slide={33}
          alt="Course source page listing categories of machine learning"
          caption="Exact PowerPoint export · including the online/RL comparison and the note that RL is important to robots."
        />
      </div>
    ),
    note: "Machine-learning systems can be classified along several independent dimensions. A method can use symbolic rules, statistical representations, neural networks, or a hybrid. It can learn from labels, discover structure without labels, or learn from reward. It can train from a fixed batch or update online. Deep learning describes a kind of representation, while reinforcement learning describes a sequential decision setting. Because these categories answer different questions, one system can belong to several categories at once. For example, a robot can use deep neural networks, learn from reward, and update its model online.",
    sourceSlides: [33],
  },
  {
    eyebrow: "Source correction · learning categories",
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
    eyebrow: "Textbook/modern supplement · formal problem",
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
    eyebrow: "Textbook/modern supplement · observable interaction",
    title: "The agent acts; the environment returns a state and reward",
    content: <InteractionLoopExplorer />,
    note: "At time t, the agent observes state sₜ and selects action aₜ using its policy π. The environment responds with the next state sₜ₊₁ and reward rₜ₊₁. The reward evaluates the consequence, but it does not tell the agent which action would have been correct. The learner updates its value estimates or policy and repeats the loop. The action arrow is crucial because the selected action changes the next experience. This makes reinforcement-learning data action-dependent: the agent partly determines which states and rewards it will observe in the future.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · trajectory and episode",
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
    eyebrow: "Textbook/modern supplement · return",
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
    eyebrow: "Textbook/modern supplement · policy and value",
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
    note: "This three-arm bandit isolates the exploration problem. Each arm represents an action with an unknown reward pattern. Pulling an arm has two effects: it may earn reward now, and it produces evidence that improves the estimate for that arm. Always choosing the current best estimate exploits existing knowledge, but an early lucky result can cause the agent to ignore a better arm. Trying another arm explores and may improve later choices. A bandit has no changing state, so it is a simplified one-state reinforcement-learning problem rather than a full sequential environment.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · ε-greedy exploration",
    title: "ε-greedy usually exploits and sometimes explores",
    content: <EpsilonGreedyExplorer />,
    note: "The ε-greedy rule balances exploitation and exploration. With probability one minus ε, the agent chooses an action with the largest current Q-value. With probability ε, it chooses an action at random. If ε is zero, the agent never deliberately explores. If ε is 0.1, exploration occurs about ten percent of the time over many decisions. If ε is 0.5, exploration is frequent, producing more information but sacrificing many currently preferred choices. The dots illustrate typical proportions; a short random sequence will not always contain exactly those counts.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook/modern supplement · Q-learning",
    title: "Q-learning updates one action value after each transition",
    content: (
      <div className="m12-q-equation">
        <section>
          <span>Off-policy temporal-difference control</span>
          <h3>Q(s,a) ← Q(s,a) + α[r + γ maxₐ′Q(s′,a′) − Q(s,a)]</h3>
          <div className="m12-notation-box"><strong>Notation:</strong> ← means “replace with”; α = learning rate; r = reward; s′ = next state; a′ = possible next action; max = choose the largest next-action estimate.</div>
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
    eyebrow: "Textbook/modern supplement · tabular algorithm",
    title: "Q-learning repeats six simple steps",
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
          <div className="m12-notation-box"><strong>Terms:</strong> behavior policy = action rule used to collect experience; target policy = policy being learned; off-policy = these two policies may differ.</div>
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
    eyebrow: "Textbook/modern supplement · Q-learning versus SARSA",
    title: "Q-learning and SARSA use different next-action targets",
    content: <TDComparison />,
    note: "Q-learning and SARSA differ in the next-action value placed in the target. Q-learning uses the maximum estimated Q-value at the next state, so it evaluates what a greedy policy would do next. SARSA uses the Q-value of the action that the behavior policy actually selected. This makes Q-learning off-policy and SARSA on-policy. In a risky environment, an exploratory policy may occasionally take unsafe actions. SARSA can incorporate that exploratory risk into its values, while Q-learning evaluates the greedy next action even if the observed behavior continues to explore.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern supplement · limits, safety, and evaluation",
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
    eyebrow: "Course foundation · page 36 · readings",
    title: "Review the learning loop and continue with the readings",
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
    note: "The lesson can now be summarized as one connected loop. Interaction produces transitions and rewards. Return combines immediate and delayed rewards into the objective. Value functions estimate the long-term consequences of states and actions. Q-learning updates an action value from one observed transition, and a policy improves by favoring actions with larger Q-values while preserving enough exploration to keep learning. The readings extend this foundation with formal convergence arguments, alternative control methods, and broader treatment of reinforcement learning. As you read, keep asking which assumptions concern the environment, which concern the objective, and which concern the learning algorithm.",
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
