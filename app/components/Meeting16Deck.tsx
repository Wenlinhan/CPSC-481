"use client";

import { useState } from "react";
import "../styles/meeting16.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l09-machine-learning-part-a";
const SOURCE_DECK_LABEL = "CPSC 481 cumulative course sources";

function resolveMeeting16SourceReference(sourceSlide: number) {
  return {
    deckLabel: SOURCE_DECK_LABEL,
    image: `${SOURCE_ROOT}/slide-renders/slide-${String(sourceSlide).padStart(2, "0")}.png`,
    key: `meeting-16-review:${sourceSlide}`,
    page: sourceSlide,
  };
}

const reviewDomains = [
  {
    label: "Foundations",
    meetings: "1-2",
    evidence: "Define, distinguish, classify, justify",
    points: 10,
    prompt: "What makes an agent rational in a specified task environment?",
  },
  {
    label: "Search",
    meetings: "3-6",
    evidence: "Formulate, trace, compare, evaluate",
    points: 25,
    prompt: "How do representation and the frontier policy change a search trace?",
  },
  {
    label: "Games",
    meetings: "7-8",
    evidence: "Back up values, prune, state assumptions",
    points: 15,
    prompt: "Why does alpha-beta preserve the minimax value?",
  },
  {
    label: "Probability",
    meetings: "9-10",
    evidence: "Calculate, factorize, interpret",
    points: 15,
    prompt: "Which independence claim makes a factorization valid?",
  },
  {
    label: "Sequential decisions",
    meetings: "11-12",
    evidence: "Predict, back up, update, audit",
    points: 15,
    prompt: "Which quantity belongs in a Bellman or Q-learning update?",
  },
  {
    label: "Machine learning",
    meetings: "13-15",
    evidence: "Diagnose, calculate, evaluate evidence",
    points: 20,
    prompt: "Which split or workflow decision could leak held-out evidence?",
  },
];

function DomainNavigator() {
  const [active, setActive] = useState(0);
  const item = reviewDomains[active];
  return (
    <div className="m16-domain-nav">
      <nav aria-label="Midterm knowledge domains">
        {reviewDomains.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{entry.points} pts</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <div>
          <span>Meetings {item.meetings}</span>
          <strong>{item.points} points</strong>
        </div>
        <h3>{item.label}</h3>
        <p>{item.evidence}</p>
        <blockquote>{item.prompt}</blockquote>
      </section>
    </div>
  );
}

const retrievalCards = [
  ["Rationality", "Choose the action expected to maximize the performance measure, given percept history and knowledge."],
  ["Task environment", "The external problem setting in which performance, observations, actions, and dynamics are defined."],
  ["State", "A representation containing the information the search process needs at one point."],
  ["Admissible h", "Never overestimates the true remaining path cost."],
  ["Consistent h", "For every edge, h(n) is no greater than c(n,n') + h(n')."],
  ["Minimax", "MAX selects the largest backed-up value; MIN selects the smallest."],
  ["Bayes rule", "P(H|E) is proportional to P(E|H)P(H), then normalized."],
  ["Conditional independence", "Once the conditioning information is known, one variable adds no information about another."],
  ["Bellman backup", "Immediate reward plus discounted expected value of the next state."],
  ["Q-learning", "A model-free, off-policy temporal-difference control update."],
  ["Information gain", "Parent entropy minus the weighted child entropy after a split."],
  ["Data leakage", "Information unavailable at prediction time improperly influences fitting or model selection."],
];

function RetrievalWall() {
  const [revealed, setRevealed] = useState<boolean[]>(retrievalCards.map(() => false));
  const toggle = (index: number) => {
    setRevealed(current => current.map((value, itemIndex) => (
      itemIndex === index ? !value : value
    )));
  };
  return (
    <div className="m16-retrieval-wall">
      {retrievalCards.map(([term, definition], index) => (
        <button
          className={revealed[index] ? "revealed" : ""}
          key={term}
          onClick={() => toggle(index)}
          type="button"
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{revealed[index] ? definition : term}</strong>
          <small>{revealed[index] ? "Click to hide" : "Define, then reveal"}</small>
        </button>
      ))}
    </div>
  );
}

const formulationCases = [
  {
    label: "Route planning",
    state: "current intersection",
    initial: "Campus Drive at Nutwood Avenue",
    actions: "take an outgoing legal road segment",
    transition: "arrive at the segment's destination",
    goal: "reach the designated parking structure",
    cost: "expected travel time",
  },
  {
    label: "Eight puzzle",
    state: "positions of eight tiles and one blank",
    initial: "the supplied 3 x 3 arrangement",
    actions: "move a tile adjacent to the blank",
    transition: "swap that tile with the blank",
    goal: "match the target arrangement",
    cost: "one per legal move",
  },
  {
    label: "Scheduling",
    state: "assignments made so far plus remaining jobs",
    initial: "no jobs assigned",
    actions: "assign one feasible job to a resource and time",
    transition: "record the assignment and update availability",
    goal: "all jobs assigned without violations",
    cost: "weighted tardiness or another declared objective",
  },
];

function FormulationLab() {
  const [active, setActive] = useState(0);
  const item = formulationCases[active];
  return (
    <div className="m16-formulation-lab">
      <nav aria-label="State-space formulation examples">
        {formulationCases.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <article><span>State</span><strong>{item.state}</strong></article>
        <article><span>Initial</span><strong>{item.initial}</strong></article>
        <article><span>Actions</span><strong>{item.actions}</strong></article>
        <article><span>Transition</span><strong>{item.transition}</strong></article>
        <article><span>Goal test</span><strong>{item.goal}</strong></article>
        <article><span>Path cost</span><strong>{item.cost}</strong></article>
      </section>
    </div>
  );
}

const traceSteps = [
  {
    bfs: "Expand S; frontier = [A, B]",
    dfs: "Expand S; stack = [B, A], with A next",
  },
  {
    bfs: "Expand A; frontier = [B, C, D]",
    dfs: "Expand A; stack = [B, D, C], with C next",
  },
  {
    bfs: "Expand B; frontier = [C, D, E]",
    dfs: "Expand C; stack = [B, D, G], with G next",
  },
  {
    bfs: "Expand C; frontier = [D, E, G]",
    dfs: "Pop G; goal found at depth 3",
  },
];

function TraceLab() {
  const [step, setStep] = useState(0);
  return (
    <div className="m16-trace-lab">
      <section className="m16-graph" aria-label="Search graph: S connects to A and B; A connects to C and D; B connects to E; C connects to goal G">
        <i className="edge e-sa" /><i className="edge e-sb" />
        <i className="edge e-ac" /><i className="edge e-ad" />
        <i className="edge e-be" /><i className="edge e-cg" />
        {[
          ["S", "n-s"], ["A", "n-a"], ["B", "n-b"], ["C", "n-c"],
          ["D", "n-d"], ["E", "n-e"], ["G", "n-g"],
        ].map(([label, className]) => (
          <b className={className} key={label}>{label}</b>
        ))}
      </section>
      <section>
        <div className="m16-trace-controls">
          <button disabled={step === 0} onClick={() => setStep(value => value - 1)} type="button">Back</button>
          <span>Step {step + 1} of {traceSteps.length}</span>
          <button disabled={step === traceSteps.length - 1} onClick={() => setStep(value => value + 1)} type="button">Next</button>
        </div>
        <article><span>BFS - queue</span><strong>{traceSteps[step].bfs}</strong></article>
        <article><span>DFS - stack</span><strong>{traceSteps[step].dfs}</strong></article>
        <p>Assume child order A before B and C before D. State the convention before tracing.</p>
      </section>
    </div>
  );
}

const heuristicRows = [
  { node: "S", g: 0, h: 5, trueCost: 5 },
  { node: "A", g: 2, h: 4, trueCost: 3 },
  { node: "B", g: 1, h: 4, trueCost: 4 },
  { node: "C", g: 4, h: 1, trueCost: 1 },
  { node: "G", g: 5, h: 0, trueCost: 0 },
];

function HeuristicAudit() {
  const [mode, setMode] = useState<"h" | "f" | "audit">("h");
  return (
    <div className="m16-heuristic-audit">
      <nav aria-label="Heuristic table views">
        <button className={mode === "h" ? "active" : ""} onClick={() => setMode("h")} type="button">Show h</button>
        <button className={mode === "f" ? "active" : ""} onClick={() => setMode("f")} type="button">Show f = g + h</button>
        <button className={mode === "audit" ? "active" : ""} onClick={() => setMode("audit")} type="button">Audit admissibility</button>
      </nav>
      <div className="m16-heuristic-table" role="table" aria-label="A* cost and heuristic audit">
        <div role="row"><b>Node</b><b>g</b><b>{mode === "f" ? "f" : "h"}</b><b>{mode === "audit" ? "h <= h*" : "meaning"}</b></div>
        {heuristicRows.map(row => (
          <div key={row.node} role="row">
            <strong>{row.node}</strong>
            <span>{row.g}</span>
            <span>{mode === "f" ? row.g + row.h : row.h}</span>
            <span>
              {mode === "audit"
                ? `${row.h} <= ${row.trueCost}: ${row.h <= row.trueCost ? "yes" : "no"}`
                : mode === "f" ? "estimated solution cost" : "estimated remaining cost"}
            </span>
          </div>
        ))}
      </div>
      {mode === "audit" && <p className="m16-result bad">This table is not admissible because h(A) = 4 overestimates h*(A) = 3.</p>}
    </div>
  );
}

const astarSteps = [
  ["Initialize", "OPEN = {S: f=5}; CLOSED = { }."],
  ["Expand S", "Generate A with g=2, f=6 and B with g=1, f=5. Choose B next."],
  ["Expand B", "Generate C with g=3, f=4 and D with g=5, f=7. Choose C next."],
  ["Expand C", "Generate G with g=5, f=5. The goal now has the smallest frontier f."],
  ["Return", "Pop G and reconstruct S -> B -> C -> G with total path cost 5."],
];

function AStarReveal() {
  const [revealed, setRevealed] = useState(1);
  return (
    <div className="m16-astar-reveal">
      <section>
        <span>Public practice graph</span>
        <div className="m16-route">
          <b>S</b><i>1</i><b>B</b><i>2</i><b>C</b><i>2</i><b>G</b>
        </div>
        <p>Alternative: S &rarr; A costs 2; A &rarr; G costs 4. Consistent h values are S=5, A=4, B=4, C=2, G=0.</p>
        <button
          disabled={revealed === astarSteps.length}
          onClick={() => setRevealed(value => Math.min(astarSteps.length, value + 1))}
          type="button"
        >
          Reveal next decision
        </button>
        <button onClick={() => setRevealed(1)} type="button">Reset</button>
      </section>
      <ol>
        {astarSteps.map(([label, detail], index) => (
          <li className={index < revealed ? "visible" : ""} key={label}>
            <span>{index + 1}</span>
            <div><strong>{index < revealed ? label : "Predict"}</strong><p>{index < revealed ? detail : "Write OPEN and CLOSED before revealing."}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const localStrategies = [
  {
    label: "Hill climbing",
    move: "Choose the best improving neighbor.",
    strength: "Very small memory; fast when the landscape is helpful.",
    failure: "Local maxima, ridges, and plateaus can stop progress.",
  },
  {
    label: "Simulated annealing",
    move: "Sometimes accept a worse move according to temperature.",
    strength: "Can escape a local optimum early in the schedule.",
    failure: "Cooling too quickly freezes; cooling too slowly costs time.",
  },
  {
    label: "Random restart",
    move: "Run local search from multiple initial states.",
    strength: "Independent attempts improve coverage of multimodal landscapes.",
    failure: "Each restart can repeat the same structural blind spot.",
  },
];

function LocalStrategyLab() {
  const [active, setActive] = useState(0);
  const item = localStrategies[active];
  return (
    <div className="m16-local-lab">
      <div className="m16-landscape" aria-label="Search landscape with a small local peak and a larger global peak">
        <span>start</span><i className="walker" /><b className="local-peak">local</b><b className="global-peak">global</b>
      </div>
      <section>
        <nav aria-label="Local search strategies">
          {localStrategies.map((entry, index) => (
            <button className={index === active ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>
          ))}
        </nav>
        <article><span>Move rule</span><strong>{item.move}</strong></article>
        <article><span>Strength</span><strong>{item.strength}</strong></article>
        <article><span>Failure mode</span><strong>{item.failure}</strong></article>
      </section>
    </div>
  );
}

const minimaxStages = [
  {
    label: "Leaves",
    values: ["3", "5", "2", "9", "0", "4", "7", "1"],
    root: "?",
    detail: "Utilities are evaluated from MAX's perspective.",
  },
  {
    label: "MIN layer",
    values: ["min(3,5)=3", "min(2,9)=2", "min(0,4)=0", "min(7,1)=1"],
    root: "?",
    detail: "Each MIN node selects its smallest child.",
  },
  {
    label: "MAX layer",
    values: ["max(3,2)=3", "max(0,1)=1"],
    root: "?",
    detail: "Each MAX node selects its largest child.",
  },
  {
    label: "Root decision",
    values: ["min(3,1)=1"],
    root: "1",
    detail: "This public example has MIN at the root; MIN chooses the right subtree's value 1.",
  },
];

function MinimaxBackup() {
  const [stage, setStage] = useState(0);
  const item = minimaxStages[stage];
  return (
    <div className="m16-minimax">
      <section>
        <span>Backup stage {stage + 1}</span>
        <strong>Root value: {item.root}</strong>
        <p>{item.detail}</p>
        <button disabled={stage === 0} onClick={() => setStage(value => value - 1)} type="button">Previous</button>
        <button disabled={stage === minimaxStages.length - 1} onClick={() => setStage(value => value + 1)} type="button">Next layer</button>
      </section>
      <div>
        <span>{item.label}</span>
        {item.values.map(value => <b key={value}>{value}</b>)}
      </div>
    </div>
  );
}

function BayesWorkedExample() {
  const [show, setShow] = useState(false);
  return (
    <div className="m16-bayes">
      <section>
        <span>Public practice case</span>
        <h3>Spam filter evidence</h3>
        <p>P(Spam)=0.20, P(Offer|Spam)=0.70, and P(Offer|NotSpam)=0.10.</p>
        <strong>Find P(Spam|Offer).</strong>
        <button onClick={() => setShow(value => !value)} type="button">{show ? "Hide derivation" : "Reveal derivation"}</button>
      </section>
      <ol className={show ? "visible" : ""}>
        <li><span>Joint numerator</span><code>0.70 x 0.20 = 0.14</code></li>
        <li><span>Evidence probability</span><code>0.14 + (0.10 x 0.80) = 0.22</code></li>
        <li><span>Normalize</span><code>0.14 / 0.22 = 0.636</code></li>
        <li><span>Interpret</span><strong>About 63.6% of offer messages are spam under this model.</strong></li>
      </ol>
    </div>
  );
}

const bellmanActions = [
  {
    label: "Wait",
    reward: 2,
    next: "0.8 V(safe) + 0.2 V(risky)",
    continuation: 8,
    value: 9.2,
  },
  {
    label: "Act",
    reward: 5,
    next: "0.5 V(safe) + 0.5 V(risky)",
    continuation: 6,
    value: 10.4,
  },
];

function BellmanLab() {
  const [active, setActive] = useState(0);
  const item = bellmanActions[active];
  return (
    <div className="m16-bellman">
      <nav aria-label="Bellman backup actions">
        {bellmanActions.map((entry, index) => (
          <button className={index === active ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>
        ))}
      </nav>
      <section>
        <span>One-step backup with gamma = 0.9</span>
        <div><b>Immediate reward</b><strong>{item.reward}</strong></div>
        <div><b>Expected next value</b><strong>{item.next} = {item.continuation}</strong></div>
        <code>Q(s,{item.label.toLowerCase()}) = {item.reward} + 0.9({item.continuation}) = {item.value.toFixed(1)}</code>
      </section>
      <p>The Bellman optimality backup compares both actions and keeps the larger expected return: <strong>Act</strong>.</p>
    </div>
  );
}

function QLearningLab() {
  const [show, setShow] = useState(false);
  return (
    <div className="m16-qlearning">
      <section>
        <span>Observed transition</span>
        <div className="m16-transition">
          <b>s</b><i>action a</i><b>r = 3</b><i>next</i><b>s&apos;</b>
        </div>
        <p>Q(s,a)=4, alpha=0.5, gamma=0.9, and max Q(s&apos;,a&apos;)=6.</p>
        <button onClick={() => setShow(value => !value)} type="button">{show ? "Hide update" : "Compute update"}</button>
      </section>
      <section className={show ? "visible" : ""}>
        <span>Target</span><code>3 + 0.9(6) = 8.4</code>
        <span>TD error</span><code>8.4 - 4 = 4.4</code>
        <span>New value</span><code>4 + 0.5(4.4) = 6.2</code>
        <p>The update is off-policy because the target uses the maximum next-action value, regardless of the behavior&apos;s next action.</p>
      </section>
    </div>
  );
}

const workflowCases = [
  {
    label: "Split first",
    verdict: "Sound",
    detail: "Create development and final-test partitions before fitting transformations or selecting models.",
  },
  {
    label: "Scale everything",
    verdict: "Leakage",
    detail: "Fitting a scaler on all rows lets held-out feature distributions affect the learned preprocessing.",
  },
  {
    label: "Tune on test",
    verdict: "Leakage",
    detail: "Choosing depth after seeing test performance converts the test set into validation evidence.",
  },
  {
    label: "Pipeline in CV",
    verdict: "Sound",
    detail: "Fit imputation, encoding, and the estimator independently inside each training fold.",
  },
];

function WorkflowAudit() {
  const [active, setActive] = useState(0);
  const item = workflowCases[active];
  return (
    <div className="m16-workflow-audit">
      <nav aria-label="Machine learning workflow decisions">
        {workflowCases.map((entry, index) => (
          <button className={index === active ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>
        ))}
      </nav>
      <section className={item.verdict === "Leakage" ? "bad" : "good"}>
        <span>Diagnosis</span>
        <strong>{item.verdict}</strong>
        <p>{item.detail}</p>
      </section>
      <div className="m16-workflow">
        <article><span>1</span><b>partition</b></article>
        <i>then</i>
        <article><span>2</span><b>fit pipeline</b></article>
        <i>then</i>
        <article><span>3</span><b>validate</b></article>
        <i>then</i>
        <article><span>4</span><b>lock</b></article>
        <i>then</i>
        <article><span>5</span><b>test once</b></article>
      </div>
    </div>
  );
}

function GainWorkedExample() {
  const [show, setShow] = useState(false);
  return (
    <div className="m16-gain">
      <section>
        <span>Public practice table</span>
        <div className="m16-mini-data">
          <b>Parent: 8 cases</b>
          <i>4 yes / 4 no</i>
          <b>Child L: 4</b>
          <i>4 yes / 0 no</i>
          <b>Child R: 4</b>
          <i>0 yes / 4 no</i>
        </div>
        <button onClick={() => setShow(value => !value)} type="button">{show ? "Hide calculation" : "Reveal calculation"}</button>
      </section>
      <section className={show ? "visible" : ""}>
        <code>H(parent) = -(0.5 log2 0.5 + 0.5 log2 0.5) = 1</code>
        <code>H(children) = (4/8)(0) + (4/8)(0) = 0</code>
        <code>Gain = 1 - 0 = 1 bit</code>
        <p>This perfect split is intentionally simple. In real data, compare every candidate using the same parent entropy and weighted child entropy.</p>
      </section>
    </div>
  );
}

const failureCases = [
  {
    label: "Reward",
    claim: "The policy learned the intended behavior.",
    evidence: "High return in the simulator.",
    missing: "Audit reward gaming and test in settings where simulator shortcuts fail.",
    repair: "Add behavioral constraints and slice outcomes by scenario.",
  },
  {
    label: "Metric",
    claim: "The classifier is accurate.",
    evidence: "96% aggregate accuracy.",
    missing: "Inspect the base rate, confusion matrix, calibration, and subgroup sample sizes.",
    repair: "Report error costs and metrics aligned to the decision.",
  },
  {
    label: "State",
    claim: "The search algorithm is inefficient.",
    evidence: "Many repeated expansions.",
    missing: "Check whether duplicate states have different encodings or CLOSED is updated incorrectly.",
    repair: "Canonicalize state representation and state the repeated-state policy.",
  },
  {
    label: "Assumption",
    claim: "The probability factorization is valid.",
    evidence: "The factors multiply to a normalized distribution.",
    missing: "Normalization does not establish the claimed conditional independencies.",
    repair: "State and defend each independence assumption from the graph or domain.",
  },
];

function FailureClinic() {
  const [active, setActive] = useState(0);
  const item = failureCases[active];
  return (
    <div className="m16-failure-clinic">
      <nav aria-label="Failure analysis cases">
        {failureCases.map((entry, index) => (
          <button className={index === active ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>
        ))}
      </nav>
      <section>
        <article><span>Claim</span><strong>{item.claim}</strong></article>
        <article><span>Current evidence</span><strong>{item.evidence}</strong></article>
        <article><span>What is missing?</span><strong>{item.missing}</strong></article>
        <article><span>Corrective action</span><strong>{item.repair}</strong></article>
      </section>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Week 8 - Meeting 16",
    title: "Midterm Review and Assessment Readiness",
    content: (
      <div className="m16-cover">
        <section>
          <span>75-minute cumulative review</span>
          <h3>Retrieve, trace, calculate, explain, and audit.</h3>
          <p>Today is about producing evidence of reasoning across Meetings 1-15, not recognizing familiar vocabulary.</p>
          <SearchCallout label="Public practice only" tone="cyan">
            Examples in this deck teach skill types. They are not active assessment items or item-bank variants.
          </SearchCallout>
        </section>
        <div className="m16-cover-visual" aria-label="Five evidence actions arranged around a central answer">
          <b>ANSWER</b>
          <span className="v1">formulate</span>
          <span className="v2">trace</span>
          <span className="v3">calculate</span>
          <span className="v4">justify</span>
          <span className="v5">audit</span>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Frame this as an active retrieval and problem-solving session. State that public examples are intentionally separate from secure assessment items.",
    sourceSlides: [],
  },
  {
    eyebrow: "Assessment map - Structure",
    title: "The 100 points ask for five kinds of evidence",
    content: (
      <div className="m16-assessment-map">
        <div className="m16-donut" aria-label="Assessment sections total 100 points">
          <span><strong>100</strong>points</span>
        </div>
        <section>
          <article><span>20</span><strong>Selected response</strong><p>conceptual distinctions and misconceptions</p></article>
          <article><span>45</span><strong>Structured calculations</strong><p>traces, backups, updates, and probability</p></article>
          <article><span>20</span><strong>Modeling and explanation</strong><p>formulate and justify assumptions</p></article>
          <article><span>15</span><strong>Evidence and failure analysis</strong><p>diagnose and propose a correction</p></article>
        </section>
        <SearchCallout label="Canvas directions control" tone="amber">
          Attempt policy, allowed materials, accommodations, and submission rules appear in Canvas. Read them before starting.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 2 minutes. Explain the four scored sections and distinguish this public map from secure item text. Remind students that Canvas directions are authoritative.",
    sourceSlides: [],
  },
  {
    eyebrow: "Assessment map - Time",
    title: "Budget time by evidence demand, not by question count",
    content: (
      <div className="m16-time-budget">
        <div className="m16-timeline" aria-label="Seventy-five minute assessment time budget">
          <span style={{ flex: 3 }}>3<small>directions</small></span>
          <span style={{ flex: 10 }}>10<small>concepts</small></span>
          <span style={{ flex: 32 }}>32<small>traces + calculations</small></span>
          <span style={{ flex: 15 }}>15<small>modeling</small></span>
          <span style={{ flex: 10 }}>10<small>failure analysis</small></span>
          <span style={{ flex: 5 }}>5<small>review</small></span>
        </div>
        <section>
          <article><span>Before work</span><strong>write the knowns, target, and governing rule</strong></article>
          <article><span>During work</span><strong>show setup and intermediate states for method credit</strong></article>
          <article><span>If stuck</span><strong>mark the unresolved step, move, and return during review</strong></article>
          <article><span>Before submit</span><strong>check units, normalization, signs, and interpretation</strong></article>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Walk the 75-minute budget. Have students identify which section would tempt them to overspend time and write one personal checkpoint.",
    sourceSlides: [],
  },
  {
    eyebrow: "Scoring - Method evidence",
    title: "A defensible answer separates setup, procedure, result, and meaning",
    content: (
      <div className="m16-method-evidence">
        <article><span>01</span><strong>Setup</strong><p>Represent the problem; name assumptions, variables, frontier, or factors.</p></article>
        <i aria-hidden="true">then</i>
        <article><span>02</span><strong>Procedure</strong><p>Apply the algorithm or equation and expose intermediate work.</p></article>
        <i aria-hidden="true">then</i>
        <article><span>03</span><strong>Result</strong><p>State the computed value, path, action, class, or diagnosis.</p></article>
        <i aria-hidden="true">then</i>
        <article><span>04</span><strong>Interpretation</strong><p>Explain what the result means and when it may fail.</p></article>
      </div>
    ),
    note: "Timing: 3 minutes. Apply the four-part pattern to a search trace and a probability calculation. Emphasize that an unexplained final number may not satisfy an explain-or-justify outcome.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative concept map",
    title: "Every method answers a representation-and-decision question",
    content: (
      <div className="m16-concept-map">
        <section>
          <span>Represent</span>
          <article><strong>Agent + environment</strong><p>percepts, actions, goals, performance</p></article>
          <article><strong>State space</strong><p>states, operators, goal, cost</p></article>
          <article><strong>Random variables</strong><p>events, factors, dependencies</p></article>
          <article><strong>Features + targets</strong><p>examples, attributes, labels</p></article>
        </section>
        <div><b>evidence</b><i>shapes</i><strong>decision</strong></div>
        <section>
          <span>Decide or learn</span>
          <article><strong>Search</strong><p>frontier policy + heuristic</p></article>
          <article><strong>Games</strong><p>opponent model + utility</p></article>
          <article><strong>MDP / RL</strong><p>reward + transition experience</p></article>
          <article><strong>ML</strong><p>inductive bias + evaluation</p></article>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Use the map to retrieve one representation choice and one decision rule from each major unit. Ask how a poor representation can make a correct algorithm fail.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative retrieval - Domain navigator",
    title: "Match each topic to the evidence verb it requires",
    content: <DomainNavigator />,
    note: "Timing: 4 minutes. Visit all six domains. Students translate each prompt into the artifacts an answer should contain, such as a trace, factorization, assumption, or diagnostic.",
    sourceSlides: [],
  },
  {
    eyebrow: "Retrieval practice - Definitions",
    title: "Define from memory before revealing",
    content: <RetrievalWall />,
    note: "Timing: 4 minutes. Run this as paired retrieval: one student defines an odd-numbered card and the partner gives an example or counterexample. Reveal only after both commit.",
    sourceSlides: [],
  },
  {
    eyebrow: "Foundations - Agents and environments",
    title: "Rationality is defined relative to information and a performance measure",
    content: (
      <SearchQuickCheck
        question="A delivery agent takes a longer route because its sensors report a blocked bridge. The bridge is actually open. Is the action necessarily irrational?"
        options={[
          "Yes; rational action always produces the objectively shortest route.",
          "No; rationality is judged from the percept history, knowledge, actions, and performance measure available then.",
          "Yes; any incorrect world model makes every later action irrational.",
          "No; every action by an autonomous system is rational by definition.",
        ]}
        correct={1}
        explanation="Rationality concerns expected performance given the evidence available to the agent, not hindsight perfection. The task environment must still specify the performance measure and information conditions."
      />
    ),
    note: "Timing: 4 minutes. Poll before revealing. Ask students to classify observability and dynamics for the bridge case and name one performance measure that could change the answer.",
    sourceSlides: [],
  },
  {
    eyebrow: "Search - Problem formulation",
    title: "A search problem is six explicit commitments",
    content: <FormulationLab />,
    note: "Timing: 3 minutes. Visit all three examples. Students identify one inadequate state representation and explain which future decision it cannot support.",
    sourceSlides: [],
  },
  {
    eyebrow: "Search - BFS and DFS",
    title: "Frontier discipline changes the expansion order",
    content: <TraceLab />,
    note: "Timing: 4 minutes. Students trace both algorithms on paper before using Next. Require frontier contents after each expansion and a declared child-order convention.",
    sourceSlides: [],
  },
  {
    eyebrow: "Informed search - Heuristic properties",
    title: "Do not confuse remaining cost h with estimated solution cost f",
    content: <HeuristicAudit />,
    note: "Timing: 3 minutes. Toggle all three views. Students locate the inadmissible value, define h-star, and explain why f includes path cost already paid.",
    sourceSlides: [],
  },
  {
    eyebrow: "Informed search - A*",
    title: "Write OPEN and CLOSED before choosing the next node",
    content: <AStarReveal />,
    note: "Timing: 4 minutes. Students independently predict every frontier decision before reveal. Check that g values are path costs and that termination occurs when the goal is selected for expansion under the stated assumptions.",
    sourceSlides: [],
  },
  {
    eyebrow: "Local search - Strategy choice",
    title: "The move rule determines which landscape failures are recoverable",
    content: <LocalStrategyLab />,
    note: "Timing: 3 minutes. Compare all three strategies. Students identify the source of exploration in each and explain why a schedule is part of simulated annealing.",
    sourceSlides: [],
  },
  {
    eyebrow: "Adversarial search - Minimax",
    title: "Back up utilities from the leaves to the decision",
    content: <MinimaxBackup />,
    note: "Timing: 4 minutes. Reveal one layer at a time. Require students to label whose turn each layer represents before applying min or max and to keep utilities in one player's perspective.",
    sourceSlides: [],
  },
  {
    eyebrow: "Adversarial search - Alpha-beta",
    title: "Prune only when a branch cannot change an ancestor's decision",
    content: (
      <SearchQuickCheck
        question="At a MIN node, the first child establishes beta = 4. An ancestor MAX node already has alpha = 6. What follows?"
        options={[
          "Continue because MIN may find a value larger than 6.",
          "Prune the remaining children because beta <= alpha.",
          "Replace alpha with 4 and restart the search.",
          "Return infinity because the window is empty.",
        ]}
        correct={1}
        explanation="MIN can only keep or lower its current bound of 4, so this branch cannot improve the ancestor MAX choice already worth at least 6. Move ordering changes pruning amount, not the minimax result."
      />
    ),
    note: "Timing: 4 minutes. Draw the alpha-beta window and have students state which player controls each bound. Ask what changes if high-value MAX moves are examined first.",
    sourceSlides: [],
  },
  {
    eyebrow: "Probability - Bayes rule",
    title: "Normalize the prior-weighted likelihoods",
    content: <BayesWorkedExample />,
    note: "Timing: 3 minutes. Students calculate the numerator and evidence probability before reveal. Require a sentence interpreting 0.636 in the context of the stated model.",
    sourceSlides: [],
  },
  {
    eyebrow: "Bayesian networks - Independence",
    title: "A graph encodes conditional, not universal, independence",
    content: (
      <SearchQuickCheck
        question="In a chain Rain -> Traffic -> Late, which statement follows from the graph?"
        options={[
          "Rain and Late are always independent.",
          "Rain and Late are conditionally independent given Traffic.",
          "Traffic is independent of Rain given Late.",
          "All three variables must have equal probability.",
        ]}
        correct={1}
        explanation="Conditioning on the middle non-collider blocks the chain. Without conditioning, Rain can influence the probability of Late through Traffic."
      />
    ),
    note: "Timing: 3 minutes. Have students factorize the joint distribution as P(Rain)P(Traffic|Rain)P(Late|Traffic) and contrast marginal with conditional independence.",
    sourceSlides: [],
  },
  {
    eyebrow: "Sequential decisions - MDP backup",
    title: "Immediate reward and expected future value play different roles",
    content: <BellmanLab />,
    note: "Timing: 3 minutes. Students compute both action values before toggling. Ask which quantities come from the model and which come from the current value estimate.",
    sourceSlides: [],
  },
  {
    eyebrow: "Reinforcement learning - Q-learning",
    title: "Move the old estimate toward a one-step target",
    content: <QLearningLab />,
    note: "Timing: 3 minutes. Require the target, TD error, and new value as separate lines. Ask how alpha and gamma change the update and why the max makes this off-policy.",
    sourceSlides: [],
  },
  {
    eyebrow: "Machine learning - Workflow",
    title: "Held-out evidence must not influence fitting or selection",
    content: <WorkflowAudit />,
    note: "Timing: 3 minutes. Visit all four cases. Students state exactly what information crosses the boundary in each leakage case and how Pipeline plus a sealed test set repairs it.",
    sourceSlides: [],
  },
  {
    eyebrow: "Decision trees - Entropy and gain",
    title: "A useful split reduces weighted uncertainty",
    content: <GainWorkedExample />,
    note: "Timing: 2 minutes. Students compute before reveal. Then ask why an unbalanced split with one tiny pure child may have less gain than this perfect balanced split.",
    sourceSlides: [],
  },
  {
    eyebrow: "Evidence and failure analysis",
    title: "A claim needs evidence, reasoning, and a corrective action",
    content: <FailureClinic />,
    note: "Timing: 2 minutes. Visit at least two cases. Students convert each diagnosis into a claim-evidence-reasoning paragraph and name a measurable corrective action.",
    sourceSlides: [],
  },
  {
    eyebrow: "Constructed response - Rubric",
    title: "Use the CER-A pattern when the prompt says explain or audit",
    content: (
      <div className="m16-cera">
        <article><span>C</span><strong>Claim</strong><p>Answer the question directly and precisely.</p></article>
        <article><span>E</span><strong>Evidence</strong><p>Cite a trace step, calculation, graph relation, metric, or observed behavior.</p></article>
        <article><span>R</span><strong>Reasoning</strong><p>Connect evidence to the governing AI concept or assumption.</p></article>
        <article><span>A</span><strong>Action</strong><p>When asked to audit, propose a correction and what new evidence would test it.</p></article>
        <SearchCallout label="Self-check" tone="green">
          Could another reader reconstruct why your result follows without guessing an unstated convention?
        </SearchCallout>
      </div>
    ),
    note: "Timing: 2 minutes. Students revise one prior answer into CER-A form. Accept concise writing when all four logical functions are present.",
    sourceSlides: [],
  },
  {
    eyebrow: "Readiness - Accessibility, integrity, and technology",
    title: "Prepare the conditions for valid evidence before the clock starts",
    content: (
      <div className="m16-readiness">
        <section>
          <span>Access</span>
          <ul>
            <li>Confirm approved accommodations are visible in Canvas before starting.</li>
            <li>Use text descriptions and accessible notation when a graph or equation is provided.</li>
            <li>Contact the instructor promptly if the configured conditions are incorrect.</li>
          </ul>
        </section>
        <section>
          <span>Integrity</span>
          <ul>
            <li>Follow the exact allowed-material and collaboration rules stated in Canvas.</li>
            <li>Submit your own reasoning; equivalent notation is welcome when semantics are correct.</li>
            <li>Do not share, copy, or reconstruct secure assessment content.</li>
          </ul>
        </section>
        <section>
          <span>Technology</span>
          <ul>
            <li>Use a stable connection and power source; close unrelated high-load applications.</li>
            <li>Open Canvas early and verify the course, assessment, and due window.</li>
            <li>If a technical failure occurs, record the time and error, then follow course support instructions.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Point students to Canvas for authoritative policies. Invite private questions about accommodations and explain the course's technical-incident reporting process.",
    sourceSlides: [],
  },
  {
    eyebrow: "Canvas launch - Final check",
    title: "Acknowledge the directions, then produce visible reasoning",
    content: (
      <div className="m16-launch">
        <section>
          <span>Before selecting Start</span>
          <ol>
            <li><strong>Read</strong> time, attempt, materials, and submission rules.</li>
            <li><strong>Verify</strong> accommodations and the assessment window.</li>
            <li><strong>Prepare</strong> scratch work according to the allowed-material policy.</li>
            <li><strong>Commit</strong> to setup, procedure, result, and interpretation.</li>
          </ol>
          <a href="https://csufullerton.instructure.com/courses/3586560" rel="noreferrer" target="_blank">
            Open CPSC 481 in Canvas
          </a>
        </section>
        <div className="m16-final-visual" aria-label="Readiness loop from retrieve to review">
          <b>READY</b>
          <span>retrieve</span><span>represent</span><span>reason</span><span>review</span>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Confirm the planned timings across exactly 25 pages total 75 minutes. Direct students to Canvas, allow policy questions, and do not display secure items in the room before the assessment begins.",
    sourceSlides: [],
  },
];

export function Meeting16Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 8 - Meeting 16"
      meetingTitle="Midterm Review and Assessment Readiness"
      resolveSourceReference={resolveMeeting16SourceReference}
      slides={slides}
      sourceCollectionLabel={SOURCE_DECK_LABEL}
    />
  );
}
