"use client";

import { useState, type CSSProperties } from "react";
import "../styles/meeting30.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

type DomainId =
  | "agent"
  | "representation"
  | "uncertainty"
  | "learning"
  | "language"
  | "systems"
  | "evidence";

type CourseDomain = {
  id: DomainId;
  label: string;
  question: string;
  receives: string;
  produces: string;
  capstone: string;
  color: string;
};

const courseDomains: CourseDomain[] = [
  {
    id: "agent",
    label: "Agent + task environment",
    question: "What can act, observe, and count as success?",
    receives: "Goals, percepts, available actions, environment properties",
    produces: "A rational action relative to evidence and performance measure",
    capstone: "Intended user, decision, action boundary, and success criterion",
    color: "#235b8c",
  },
  {
    id: "representation",
    label: "Representation + search",
    question: "What state is represented, and what alternatives are explored?",
    receives: "State encoding, operators, constraints, cost model",
    produces: "A path, policy candidate, or selected alternative",
    capstone: "System state, retrieval index, prompt context, or workflow graph",
    color: "#376dad",
  },
  {
    id: "uncertainty",
    label: "Uncertainty + decision",
    question: "What is unknown, how does evidence update belief, and what is at stake?",
    receives: "Prior belief, observation model, transition model, rewards or costs",
    produces: "Posterior belief, expected utility, or value-guided action",
    capstone: "Confidence, abstention rule, risk threshold, and oversight trigger",
    color: "#7651a8",
  },
  {
    id: "learning",
    label: "Learning + optimization",
    question: "What objective changes the model, from which data, and against what baseline?",
    receives: "Examples, labels or rewards, loss, model family, split protocol",
    produces: "Parameters and evidence about generalization",
    capstone: "Training configuration, baseline comparison, evaluation slices",
    color: "#287869",
  },
  {
    id: "language",
    label: "Tokens + LLM + RAG",
    question: "How is language represented, generated, and grounded in recoverable evidence?",
    receives: "Tokens, context, attention, retrieved passages, decoding controls",
    produces: "Generated claims with—or without—source support",
    capstone: "Prompt version, retrieval trace, citations, unsupported-claim check",
    color: "#9a6818",
  },
  {
    id: "systems",
    label: "Tools + MCP + harness",
    question: "How does a model become a controlled stateful system that can act?",
    receives: "Tool schemas, permissions, state, approvals, budgets, logs",
    produces: "Bounded actions and recoverable execution traces",
    capstone: "Authority boundary, approval point, failure recovery, task evaluation",
    color: "#9a495d",
  },
  {
    id: "evidence",
    label: "Evidence + public explanation",
    question: "Which claim is supported, under what conditions, and who should decide?",
    receives: "Sources, tests, limitations, affected audiences, value judgments",
    produces: "A calibrated claim, evidence card, explanation, and deployment boundary",
    capstone: "System card, evidence brief, honest failure, recommendation",
    color: "#4a5c75",
  },
];

function ConceptNetwork() {
  const [active, setActive] = useState<DomainId>("agent");
  const selected = courseDomains.find(domain => domain.id === active) ?? courseDomains[0];

  return (
    <div className="m30-network">
      <div className="m30-network-map" aria-label="Interactive course concept network">
        <div className="m30-network-core">
          <span>AI system</span>
          <strong>Decision under constraints</strong>
          <small>observe · represent · choose · learn · act · evaluate</small>
        </div>
        {courseDomains.map((domain, index) => (
          <button
            aria-pressed={active === domain.id}
            className={`m30-network-node node-${index + 1}`}
            key={domain.id}
            onClick={() => setActive(domain.id)}
            style={{ "--domain-color": domain.color } as CSSProperties}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{domain.label}</strong>
          </button>
        ))}
      </div>
      <section className="m30-network-detail" aria-live="polite">
        <span>Selected dependency</span>
        <h3>{selected.label}</h3>
        <blockquote>{selected.question}</blockquote>
        <div>
          <article><small>Receives</small><p>{selected.receives}</p></article>
          <article><small>Produces</small><p>{selected.produces}</p></article>
          <article><small>Capstone evidence</small><p>{selected.capstone}</p></article>
        </div>
      </section>
    </div>
  );
}

const traceStages = [
  {
    label: "Frame",
    course: "Agent + environment",
    record: "User asks whether a late withdrawal is possible.",
    question: "What is the intended use, and what action must the system never take?",
    dependency: "A performance measure is meaningless until the user, task, and cost of error are bounded.",
  },
  {
    label: "Represent",
    course: "State + retrieval",
    record: "Query, student context, policy version, and corpus filters become system state.",
    question: "Which facts belong in state, and which are hidden or unavailable?",
    dependency: "Search and retrieval can only operate over what the representation preserves.",
  },
  {
    label: "Infer",
    course: "Uncertainty + LLM",
    record: "Relevant passages are retrieved; a model proposes a source-linked answer.",
    question: "Which sentence is observation, inference, or unsupported generation?",
    dependency: "Generation does not remove uncertainty; it changes where uncertainty becomes visible.",
  },
  {
    label: "Control",
    course: "Tools + harness",
    record: "The harness blocks account changes and requests approval before sending a message.",
    question: "Where is authority enforced—prompt, model, tool, or host application?",
    dependency: "A model request becomes an action only through an interface with permissions.",
  },
  {
    label: "Judge",
    course: "Evaluation + evidence",
    record: "The answer is scored, one unsupported deadline is found, and the claim narrows.",
    question: "What evidence changes the release decision rather than merely describing output?",
    dependency: "A result becomes evidence only through a defined case, rule, comparison, and consequence.",
  },
] as const;

function DependencyTracer() {
  const [active, setActive] = useState(0);
  const stage = traceStages[active];

  return (
    <div className="m30-tracer">
      <nav aria-label="System dependency trace">
        {traceStages.map((item, index) => (
          <button
            aria-current={active === index ? "step" : undefined}
            key={item.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{item.label}</strong>
            <small>{item.course}</small>
          </button>
        ))}
      </nav>
      <section aria-live="polite">
        <header>
          <span>Trace stage {active + 1} / {traceStages.length}</span>
          <strong>{stage.course}</strong>
        </header>
        <blockquote>{stage.record}</blockquote>
        <article><small>Diagnostic question</small><p>{stage.question}</p></article>
        <aside><small>Dependency</small><p>{stage.dependency}</p></aside>
      </section>
    </div>
  );
}

const methodCases = [
  {
    id: "museum",
    label: "Museum guide",
    task: "Answer low-stakes questions about a fixed exhibit collection.",
    observable: "Mostly observable",
    stakes: "Low",
    data: "Curated documents",
    supervision: "Staff can review",
    recommend: "Retrieval + constrained generation",
    why: "The corpus is explicit, language varies, and abstention is acceptable.",
    reversal: "If exact legal wording becomes binding, prefer retrieval with quotations and no free-form recommendation.",
  },
  {
    id: "robot",
    label: "Delivery robot",
    task: "Navigate sidewalks with moving people, occlusion, and limited battery.",
    observable: "Partially observable",
    stakes: "Medium–high",
    data: "Sensors + simulator",
    supervision: "Intermittent",
    recommend: "State estimation + planning or learned policy + safety controller",
    why: "Actions change future state; uncertainty and delayed consequences matter.",
    reversal: "If the route is a fully controlled conveyor, a finite-state controller may dominate a learned policy.",
  },
  {
    id: "triage",
    label: "Clinical triage",
    task: "Prioritize cases from incomplete symptoms without making a diagnosis.",
    observable: "Partially observable",
    stakes: "High",
    data: "Limited, shifted, sensitive",
    supervision: "Required",
    recommend: "Interpretable baseline + calibrated probabilistic model + human decision",
    why: "Error costs are asymmetric, data shift is plausible, and escalation is part of the task.",
    reversal: "If no representative validation data exist, do not automate prioritization; support documentation only.",
  },
] as const;

function MethodSelector() {
  const [active, setActive] = useState(1);
  const item = methodCases[active];

  return (
    <div className="m30-method">
      <nav aria-label="Method-selection scenarios">
        {methodCases.map((scenario, index) => (
          <button
            aria-pressed={active === index}
            key={scenario.id}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{scenario.label}</strong>
          </button>
        ))}
      </nav>
      <section aria-live="polite">
        <header><span>Task</span><p>{item.task}</p></header>
        <div className="m30-method-dimensions">
          {[
            ["Observability", item.observable],
            ["Stakes", item.stakes],
            ["Data", item.data],
            ["Supervision", item.supervision],
          ].map(([label, value]) => (
            <article key={label}><small>{label}</small><strong>{value}</strong></article>
          ))}
        </div>
        <article className="m30-method-choice">
          <small>Initial recommendation</small>
          <h3>{item.recommend}</h3>
          <p>{item.why}</p>
        </article>
        <aside><small>Assumption that reverses it</small><p>{item.reversal}</p></aside>
      </section>
    </div>
  );
}

const bayesEvidence = [
  {
    label: "Prior only",
    belief: "P(blocked path) = 0.20",
    action: "Continue slowly",
    explanation: "The agent starts with a base-rate belief before the new sensor reading.",
  },
  {
    label: "Noisy camera",
    belief: "P(blocked path | dark shape) = 0.55",
    action: "Gather another observation",
    explanation: "Evidence raises belief, but the observation model admits shadows and occlusion.",
  },
  {
    label: "Camera + lidar",
    belief: "P(blocked path | both signals) = 0.93",
    action: "Stop and replan",
    explanation: "The posterior crosses a cost-sensitive decision threshold; it does not become certainty.",
  },
] as const;

function BayesDecisionLab() {
  const [active, setActive] = useState(0);
  const item = bayesEvidence[active];
  return (
    <div className="m30-bayes">
      <div className="m30-bayes-road" aria-hidden="true">
        <span className="robot">R</span>
        <i className={active >= 1 ? "seen" : ""} />
        <b className={active >= 2 ? "confirmed" : ""}>?</b>
      </div>
      <section>
        <nav aria-label="Evidence sequence">
          {bayesEvidence.map((evidence, index) => (
            <button
              aria-current={active === index ? "step" : undefined}
              key={evidence.label}
              onClick={() => setActive(index)}
              type="button"
            >
              <span>{index + 1}</span>{evidence.label}
            </button>
          ))}
        </nav>
        <article aria-live="polite">
          <small>Belief state</small>
          <strong>{item.belief}</strong>
          <p>{item.explanation}</p>
          <aside><span>Decision</span><b>{item.action}</b></aside>
        </article>
      </section>
    </div>
  );
}

const learningAudits = [
  {
    label: "Objective",
    finding: "Optimize cross-entropy on historical tickets.",
    risk: "The training objective rewards next-label accuracy, not safe resolution of rare urgent cases.",
    repair: "Add task-specific costs and evaluate high-severity slices separately.",
  },
  {
    label: "Baseline",
    finding: "Compare a neural classifier only with last semester’s accuracy.",
    risk: "The comparison changes data and method simultaneously.",
    repair: "Run a simple majority/rules model on the same frozen evaluation set.",
  },
  {
    label: "Split",
    finding: "Randomly split messages from repeated users and threads.",
    risk: "Near-duplicate context crosses train and test, inflating generalization.",
    repair: "Group by thread or user, then freeze the test set before tuning.",
  },
  {
    label: "Metric",
    finding: "Report 94% accuracy on a 95% routine class.",
    risk: "Average accuracy hides failure on the class that matters.",
    repair: "Report confusion matrix, precision/recall by class, calibration, and error costs.",
  },
] as const;

function LearningAudit() {
  const [active, setActive] = useState(0);
  const item = learningAudits[active];
  return (
    <div className="m30-learning-audit">
      <nav aria-label="Learning-pipeline audit">
        {learningAudits.map((audit, index) => (
          <button
            aria-pressed={active === index}
            key={audit.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {audit.label}
          </button>
        ))}
      </nav>
      <section aria-live="polite">
        <article><small>Observed design</small><blockquote>{item.finding}</blockquote></article>
        <article className="risk"><small>Why the claim fails</small><p>{item.risk}</p></article>
        <article className="repair"><small>Evidence repair</small><p>{item.repair}</p></article>
      </section>
      <aside>
        <strong>Generalization claim</strong>
        <p>Model performance is conditional on the data-generating process, split protocol, metric, and deployment population.</p>
      </aside>
    </div>
  );
}

const attentionTokens = [
  { token: "The", weights: [0.08, 0.12, 0.08, 0.09, 0.05, 0.06, 0.52] },
  { token: "robot", weights: [0.06, 0.18, 0.07, 0.08, 0.07, 0.10, 0.44] },
  { token: "did", weights: [0.08, 0.09, 0.15, 0.18, 0.09, 0.08, 0.33] },
  { token: "not", weights: [0.04, 0.13, 0.16, 0.19, 0.08, 0.06, 0.34] },
  { token: "enter", weights: [0.04, 0.28, 0.08, 0.18, 0.09, 0.07, 0.26] },
  { token: "because", weights: [0.04, 0.12, 0.08, 0.10, 0.07, 0.10, 0.49] },
  { token: "it", weights: [0.05, 0.36, 0.06, 0.08, 0.07, 0.06, 0.32] },
] as const;

function AttentionProbe() {
  const [active, setActive] = useState(6);
  const row = attentionTokens[active];
  return (
    <div className="m30-attention">
      <section>
        <span>Query token</span>
        <div>
          {attentionTokens.map((item, index) => (
            <button
              aria-pressed={active === index}
              key={`${item.token}-${index}`}
              onClick={() => setActive(index)}
              type="button"
            >
              {item.token}
            </button>
          ))}
        </div>
        <p>Click a token to inspect a toy attention distribution. Darker cells receive more weight.</p>
      </section>
      <div className="m30-attention-weights" aria-label={`Toy attention weights for ${row.token}`}>
        {attentionTokens.map((target, index) => (
          <article
            key={`${target.token}-${index}`}
            style={{ "--attention": row.weights[index] } as CSSProperties}
          >
            <span>{target.token}</span>
            <strong>{row.weights[index].toFixed(2)}</strong>
          </article>
        ))}
      </div>
      <aside>
        <strong>Attention weight is not a complete explanation.</strong>
        <p>It is one learned routing coefficient inside one layer and head—not proof of causality, truth, or human-like understanding.</p>
      </aside>
    </div>
  );
}

const ragStages = [
  ["Question", "Which policy governs a late withdrawal?", "Preserve the user’s actual information need."],
  ["Retrieve", "handbook §7.2 · registrar FAQ §3", "Record document IDs, versions, filters, and scores."],
  ["Compose", "Quote the rule; distinguish exception from standard process.", "Bind material claims to retrieved evidence."],
  ["Verify", "One deadline sentence has no support.", "Check claims atomically rather than trusting fluent prose."],
  ["Respond", "Cite the rule, remove deadline, route exception to registrar.", "Make abstention and escalation part of quality."],
] as const;

function RagTrace() {
  const [active, setActive] = useState(0);
  const item = ragStages[active];
  return (
    <div className="m30-rag">
      <div className="m30-rag-path">
        {ragStages.map((stage, index) => (
          <button
            aria-current={active === index ? "step" : undefined}
            key={stage[0]}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{stage[0]}</strong>
          </button>
        ))}
      </div>
      <section aria-live="polite">
        <span>Artifact at {item[0]}</span>
        <blockquote>{item[1]}</blockquote>
        <article><small>Design requirement</small><p>{item[2]}</p></article>
      </section>
      <aside>
        <span>RAG changes the evidence path</span>
        <p>It does not guarantee retrieval relevance, source validity, citation entailment, or a correct final decision.</p>
      </aside>
    </div>
  );
}

const loopStages = [
  { label: "Observe", object: "User request + current state", trust: "Input may be incomplete or adversarial." },
  { label: "Reason", object: "Proposed next step", trust: "A proposal is not authority." },
  { label: "Select tool", object: "Schema-valid call", trust: "Schema validity does not grant permission." },
  { label: "Approve", object: "Human or policy decision", trust: "High-impact actions require an explicit gate." },
  { label: "Execute", object: "Tool result + side effect", trust: "The host enforces scope and records outcome." },
  { label: "Evaluate", object: "Task result + trace", trust: "Success needs a task criterion, not merely no exception." },
] as const;

function AgentLoop() {
  const [active, setActive] = useState(0);
  const stage = loopStages[active];
  return (
    <div className="m30-loop">
      <div className="m30-loop-wheel">
        <div><span>Harness</span><strong>state + policy</strong></div>
        {loopStages.map((item, index) => (
          <button
            aria-pressed={active === index}
            className={`loop-${index + 1}`}
            key={item.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{index + 1}</span>{item.label}
          </button>
        ))}
      </div>
      <section aria-live="polite">
        <span>{stage.label} layer</span>
        <h3>{stage.object}</h3>
        <blockquote>{stage.trust}</blockquote>
        <p>MCP can standardize discovery and exchange among hosts, clients, and servers. The application still owns trust, authorization, and user-visible consequences.</p>
      </section>
    </div>
  );
}

const assumptionFlips = [
  {
    label: "Evidence is complete",
    default: "Use deterministic search over a fixed policy corpus.",
    change: "Policies change daily and versions conflict.",
    flipped: "Add versioned retrieval, freshness checks, provenance, and abstention.",
    why: "The representation and evidence boundary—not model size—became the dominant risk.",
  },
  {
    label: "Errors cost the same",
    default: "Optimize average classification accuracy.",
    change: "A false negative can delay emergency intervention.",
    flipped: "Use cost-sensitive thresholds, recall-focused slices, calibration, and human escalation.",
    why: "The performance measure changed, so the rational decision rule changed.",
  },
  {
    label: "Action is reversible",
    default: "Allow the agent to execute after a schema-valid tool call.",
    change: "The tool can permanently delete a student record.",
    flipped: "Require preview, least privilege, explicit approval, immutable log, and recovery path.",
    why: "Authority and consequence moved the problem from generation quality to system control.",
  },
  {
    label: "Train and deployment match",
    default: "Release the model after aggregate test accuracy improves.",
    change: "Deployment shifts from campus email to short multilingual chat.",
    flipped: "Collect representative evaluation slices or delay the capability claim.",
    why: "Without distributional support, the generalization claim no longer follows.",
  },
] as const;

function AssumptionFlipLab() {
  const [active, setActive] = useState(0);
  const item = assumptionFlips[active];
  return (
    <div className="m30-flip">
      <nav aria-label="Assumptions that reverse a recommendation">
        {assumptionFlips.map((flip, index) => (
          <button
            aria-pressed={active === index}
            key={flip.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{index + 1}</span>{flip.label}
          </button>
        ))}
      </nav>
      <section aria-live="polite">
        <article><small>Under the first assumption</small><p>{item.default}</p></article>
        <div><span>Change one condition</span><strong>{item.change}</strong></div>
        <article className="flipped"><small>Recommendation reverses</small><p>{item.flipped}</p></article>
        <aside><small>Course connection</small><p>{item.why}</p></aside>
      </section>
    </div>
  );
}

const misconceptions = [
  {
    claim: "A* always expands fewer nodes than every other correct search algorithm.",
    diagnosis: "Overgeneralization",
    repair: "Admissibility supports optimality under conditions; expansion efficiency depends on heuristic quality and comparison assumptions.",
    probe: "What changes if h(n) = 0, or if the heuristic is inconsistent?",
  },
  {
    claim: "A 95% accurate classifier is ready because its test score is high.",
    diagnosis: "Metric without task context",
    repair: "Inspect prevalence, split leakage, error asymmetry, calibration, deployment shift, and the baseline.",
    probe: "Which error would change the release decision?",
  },
  {
    claim: "RAG prevents hallucination because the answer includes citations.",
    diagnosis: "Mechanism mistaken for guarantee",
    repair: "Evaluate retrieval recall, passage relevance, claim–source entailment, unsupported additions, and abstention.",
    probe: "Can the cited passage actually support each material claim?",
  },
  {
    claim: "A tool call is safe when it matches the JSON schema.",
    diagnosis: "Validity confused with authority",
    repair: "Schema checks structure; the host must enforce identity, scope, permission, approval, budget, and recovery.",
    probe: "Where is the irreversible action blocked?",
  },
  {
    claim: "Attention weights explain why an LLM answer is true.",
    diagnosis: "Internal signal confused with evidence",
    repair: "Attention helps compute representations; truth requires external evidence and task-appropriate evaluation.",
    probe: "Which source or test supports the answer independently of the model?",
  },
] as const;

function MisconceptionLab() {
  const [active, setActive] = useState(0);
  const item = misconceptions[active];
  return (
    <div className="m30-misconception">
      <nav aria-label="Public misconception practice">
        {misconceptions.map((_, index) => (
          <button
            aria-label={`Practice statement ${index + 1}`}
            aria-pressed={active === index}
            key={index}
            onClick={() => setActive(index)}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </nav>
      <section aria-live="polite">
        <span>Public practice statement</span>
        <blockquote>{item.claim}</blockquote>
        <div>
          <article><small>Diagnosis</small><strong>{item.diagnosis}</strong></article>
          <article><small>Repair</small><p>{item.repair}</p></article>
          <article><small>Follow-up probe</small><p>{item.probe}</p></article>
        </div>
      </section>
    </div>
  );
}

const mapRequirements = [
  ["Task boundary", "user · environment · goal · performance · excluded action"],
  ["Representation", "state · data · documents · operators · hidden information"],
  ["Decision method", "search · probability · learning · LLM · policy"],
  ["System layers", "retrieval · tools · MCP · harness · permissions · state"],
  ["Evidence", "claim · baseline · evaluation set · metrics · failure slices"],
  ["Public boundary", "limitation · oversight · explanation · deployment decision"],
] as const;

function FinalMapChecklist() {
  const [checked, setChecked] = useState<boolean[]>(mapRequirements.map(() => false));
  const completed = checked.filter(Boolean).length;
  const toggle = (index: number) => {
    setChecked(current => current.map((value, itemIndex) => itemIndex === index ? !value : value));
  };

  return (
    <div className="m30-final-map">
      <section>
        <header>
          <span>Final concept-map artifact</span>
          <strong>{completed} / {mapRequirements.length} dependency groups visible</strong>
          <div><i style={{ width: `${(completed / mapRequirements.length) * 100}%` }} /></div>
        </header>
        <div>
          {mapRequirements.map(([label, detail], index) => (
            <button
              aria-pressed={checked[index]}
              key={label}
              onClick={() => toggle(index)}
              type="button"
            >
              <span>{checked[index] ? "✓" : index + 1}</span>
              <strong>{label}</strong>
              <small>{detail}</small>
            </button>
          ))}
        </div>
      </section>
      <aside>
        <strong>Required arrows</strong>
        <ol>
          <li>At least one input becomes a representation.</li>
          <li>One method produces a decision or output.</li>
          <li>One assumption changes the method choice.</li>
          <li>One test weakens or bounds a claim.</li>
          <li>One control limits deployment or action.</li>
        </ol>
        <blockquote>Label relationships with verbs: observes, encodes, searches, updates, predicts, retrieves, authorizes, evaluates.</blockquote>
      </aside>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Week 15 · Meeting 30 · 75 minutes",
    title: "Course Synthesis and Final Review",
    subtitle: "Connect foundational AI, modern AI systems, evidence, and responsible deployment into one inspectable concept network.",
    content: (
      <div className="m30-cover">
        <section>
          <span>One course · one systems question</span>
          <h3>How does an AI system turn limited evidence into a bounded decision?</h3>
          <p>The answer crosses agents, representation, search, uncertainty, learning, language models, tools, controls, and public explanation.</p>
          <div className="m30-cover-actions" aria-label="Meeting learning objectives">
            {["trace", "select", "diagnose", "explain", "bound"].map(action => <b key={action}>{action}</b>)}
          </div>
        </section>
        <div className="m30-cover-visual" aria-label="Course domains converging on an evidence-backed decision">
          {["observe", "represent", "search", "learn", "retrieve", "act", "evaluate"].map((label, index) => (
            <span className={`orbit orbit-${index + 1}`} key={label}>{label}</span>
          ))}
          <div><small>system claim</small><strong>decision</strong><b>under constraints</b></div>
        </div>
      </div>
    ),
    note: "Timing: 1 minute. Frame the final meeting as systems synthesis and preview the five cumulative actions: trace, select, diagnose, explain, and bound. No secure final-assessment items appear in this deck.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative concept network · Interactive",
    title: "Every AI method sits inside a dependency chain",
    subtitle: "Select a node. Read what it receives, what it produces, and what evidence your capstone should expose.",
    content: <ConceptNetwork />,
    note: "Timing: 4 minutes. Invite students to choose nodes and explain one incoming and one outgoing dependency. Ask where their capstone currently has a missing record.",
    sourceSlides: [],
  },
  {
    eyebrow: "Dependency tracing · Worked system",
    title: "Trace one answer from task boundary to release judgment",
    subtitle: "A course-policy assistant is not merely an LLM: each stage inherits assumptions from the stage before it.",
    content: <DependencyTracer />,
    note: "Timing: 3 minutes. Move through the five stages. Cold-call one student to name the recoverable artifact required at each transition.",
    sourceSlides: [],
  },
  {
    eyebrow: "Foundation 1 · Rational agents",
    title: "Rationality is relative to evidence, goals, and a performance measure",
    content: (
      <div className="m30-rationality">
        <section>
          <div className="m30-agent-core">Agent</div>
          {[
            ["Percepts", "What the sensors or interface make available"],
            ["Actions", "What the agent can cause in the environment"],
            ["Goals", "Desired states—not a complete scoring rule"],
            ["Performance", "How outcomes, cost, risk, and time are judged"],
          ].map(([label, detail], index) => (
            <article className={`factor-${index + 1}`} key={label}><strong>{label}</strong><p>{detail}</p></article>
          ))}
        </section>
        <aside>
          <span>Public practice</span>
          <blockquote>A chatbot gives a fluent answer using no current policy evidence. Is it rational?</blockquote>
          <p><b>Answer:</b> the question is underspecified. Name the task environment, available evidence, performance measure, and cost of error first.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Reconstruct the rational-agent definition. Use the chatbot prompt to expose why behavior cannot be judged without task conditions.",
    sourceSlides: [],
  },
  {
    eyebrow: "Method selection · Scenario selector",
    title: "Choose from observability, stakes, data, and supervision—not trendiness",
    content: <MethodSelector />,
    note: "Timing: 3 minutes. Compare all three scenarios. Require students to state the assumption that would reverse each recommendation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Foundation 2 · Representation and state spaces",
    title: "A representation preserves some distinctions and erases others",
    content: (
      <div className="m30-representation">
        <section>
          <div className="m30-world-scene" aria-label="Sidewalk scene with robot, pedestrian, obstacle, and destination">
            <span className="destination">goal</span>
            <span className="pedestrian">person</span>
            <span className="obstacle">box</span>
            <span className="delivery">robot</span>
            <i />
          </div>
          <small>World: continuous, changing, only partly visible</small>
        </section>
        <i aria-hidden="true">→ encode →</i>
        <section className="m30-state">
          <code>s = (x, y, heading, battery, nearby occupancy)</code>
          <article><strong>Preserved</strong><p>Location, energy, local obstacle estimate</p></article>
          <article><strong>Discarded</strong><p>Identity, intentions, distant conditions, sensor history</p></article>
          <article><strong>Consequence</strong><p>A planner cannot reason about distinctions absent from state.</p></article>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students which omitted variable could invalidate a proposed route. Connect state choice to observability and later evaluation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Search and heuristics · Worked comparison",
    title: "Search quality depends on state, operators, cost, and heuristic assumptions",
    content: (
      <div className="m30-search">
        <div className="m30-search-grid" aria-label="Toy route-search grid">
          {[
            "S", "", "", "■", "", "",
            "■", "■", "", "■", "", "■",
            "", "", "", "", "", "",
            "", "■", "■", "■", "■", "",
            "", "", "", "", "", "G",
          ].map((cell, index) => <span className={cell === "■" ? "blocked" : cell ? "endpoint" : ""} key={index}>{cell}</span>)}
          <i className="m30-route-a" />
          <i className="m30-route-b" />
        </div>
        <section>
          {[
            ["Breadth-first / uniform cost", "Systematic; optimal under the relevant step-cost conditions.", "May expand many irrelevant states."],
            ["Greedy best-first", "Uses h(n) to chase an apparently close goal.", "Can be fast and badly misled."],
            ["A*", "Ranks by f(n) = g(n) + h(n).", "Optimality depends on cost and heuristic conditions."],
          ].map(([method, strength, boundary]) => (
            <article key={method}><strong>{method}</strong><p>{strength}</p><small>{boundary}</small></article>
          ))}
          <blockquote>Public practice: If h(n) = 0 for every state, which familiar algorithm does A* resemble?</blockquote>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Review the roles of g and h. Let students answer the public h equals zero prompt and state the cost assumption.",
    sourceSlides: [],
  },
  {
    eyebrow: "Foundation 3 · Uncertainty",
    title: "Observation, belief, transition, and utility answer different questions",
    content: (
      <div className="m30-uncertainty">
        {[
          ["Observation model", "How likely is this percept if the hidden state has a particular value?", "P(oₜ | sₜ)"],
          ["Belief update", "How should new evidence revise uncertainty over hidden state?", "P(sₜ | o₁:ₜ)"],
          ["Transition model", "How can state change after an action or over time?", "P(sₜ₊₁ | sₜ, aₜ)"],
          ["Reward / utility", "Which outcomes are preferred, and what do errors cost?", "R(s, a) or U(outcome)"],
        ].map(([label, question, notation], index) => (
          <article key={label}>
            <span>{index + 1}</span><strong>{label}</strong><p>{question}</p><code>{notation}</code>
          </article>
        ))}
        <aside><strong>Uncertainty is not one number.</strong><p>Separate uncertainty about state, dynamics, model parameters, data coverage, and consequence.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to classify one uncertainty from their capstone. Distinguish probabilistic belief from reward or utility.",
    sourceSlides: [],
  },
  {
    eyebrow: "Bayes → Markov → MDP → RL · Worked scenario",
    title: "Evidence updates belief; values turn belief into action",
    content: <BayesDecisionLab />,
    note: "Timing: 4 minutes. Step through the sensor sequence. Ask where the Markov state, transition model, action cost, and learned value would enter.",
    sourceSlides: [],
  },
  {
    eyebrow: "Foundation 4 · Learning system contract",
    title: "A trained model is the result of an objective, data, optimization, and selection process",
    content: (
      <div className="m30-learning-pipeline">
        {[
          ["Task + claim", "What must generalize to whom and under which conditions?"],
          ["Data", "Sampling, labels, provenance, representation, split unit"],
          ["Baseline", "The simplest meaningful alternative on the same cases"],
          ["Objective", "Loss or reward optimized during training"],
          ["Optimization", "Parameter updates, regularization, stopping rule"],
          ["Evaluation", "Frozen cases, metrics, uncertainty, slices, errors"],
        ].map(([label, detail], index) => (
          <article key={label}><span>{index + 1}</span><strong>{label}</strong><p>{detail}</p></article>
        ))}
        <div className="m30-learning-arrow" aria-hidden="true" />
      </div>
    ),
    note: "Timing: 3 minutes. Trace the learning pipeline and identify which boxes describe construction versus evidence about generalization.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning diagnosis · Interactive audit",
    title: "A high score can still support the wrong claim",
    content: <LearningAudit />,
    note: "Timing: 3 minutes. Select each audit dimension. Ask students to propose one test that could reveal leakage or a misleading aggregate metric.",
    sourceSlides: [],
  },
  {
    eyebrow: "Neural networks · Optimization",
    title: "Backpropagation assigns local parameter responsibility for a global loss",
    content: (
      <div className="m30-neural">
        <section className="m30-neural-graph">
          <div className="layer input">{["x₁", "x₂", "1"].map(node => <span key={node}>{node}</span>)}</div>
          <i>× weights</i>
          <div className="layer hidden">{["h₁", "h₂", "h₃"].map(node => <span key={node}>{node}</span>)}</div>
          <i>× weights</i>
          <div className="layer output"><span>ŷ</span></div>
          <aside>forward: representation → prediction</aside>
          <b>backward: ∂L/∂ŷ → ∂L/∂w</b>
        </section>
        <aside>
          <article><small>Forward pass</small><p>Compose affine transformations and nonlinear activations.</p></article>
          <article><small>Loss</small><p>Quantify mismatch with the training target—not every deployment value.</p></article>
          <article><small>Gradient</small><p>Use the chain rule to estimate how each parameter changes loss.</p></article>
          <article><small>Update</small><p>w ← w − η∇L; learning rate and data order affect the path.</p></article>
          <blockquote>Public practice: Why can lower training loss accompany worse test performance?</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Rehearse forward pass, loss, backward pass, and update. Use the public prompt to surface overfitting and data mismatch.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern layer 1 · Tokens and attention",
    title: "An LLM predicts over token representations conditioned on context",
    content: <AttentionProbe />,
    note: "Timing: 3 minutes. Use the toy token interaction to review query-key weighting and value mixing. Explicitly reject attention-as-truth or attention-as-complete-explanation.",
    sourceSlides: [],
  },
  {
    eyebrow: "LLM worked scenario · From training to output",
    title: "Fluent generation follows an objective; it does not inherit a truth guarantee",
    content: (
      <div className="m30-llm-scenario">
        <section>
          {[
            ["Pretraining", "Next-token objective over a large corpus", "Learns statistical language and world regularities"],
            ["Instruction tuning", "Examples of desired task behavior", "Improves response format and instruction following"],
            ["Preference optimization", "Human or model preference signal", "Shapes which acceptable outputs are favored"],
            ["Decoding", "Temperature, top-p, stop conditions", "Selects a path through output probabilities"],
          ].map(([stage, mechanism, effect], index) => (
            <article key={stage}><span>{index + 1}</span><strong>{stage}</strong><p>{mechanism}</p><small>{effect}</small></article>
          ))}
        </section>
        <aside>
          <span>Observed answer</span>
          <blockquote>“The withdrawal deadline is Friday.”</blockquote>
          <h3>Which layer can establish that this claim is current and true?</h3>
          <p><b>None by itself.</b> The claim needs external, versioned evidence and a task-specific verification rule.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Follow the training-to-decoding pipeline. Ask students why instruction following and preference do not establish factuality.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern layer 2 · RAG",
    title: "Retrieval makes evidence available; verification makes support inspectable",
    content: <RagTrace />,
    note: "Timing: 3 minutes. Trace the policy question. Distinguish retrieval recall, source quality, claim-source entailment, and answer usefulness.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern layer 3 · Tools and MCP",
    title: "A language model proposes; a controlled system authorizes and acts",
    content: (
      <div className="m30-tools">
        <section>
          <div className="m30-tool-model"><span>Model</span><strong>proposes</strong></div>
          <i>tool name + arguments</i>
          <div className="m30-tool-host"><span>Host / harness</span><strong>validates · authorizes · records</strong></div>
          <i>bounded request</i>
          <div className="m30-tool-server"><span>MCP server / tool</span><strong>reads or changes external state</strong></div>
        </section>
        <aside>
          {[
            ["Schema", "Is the request structurally valid?"],
            ["Capability", "Does this tool expose the requested operation?"],
            ["Authority", "May this user/system perform it now?"],
            ["Consequence", "What changes, and can it be recovered?"],
          ].map(([label, question]) => <article key={label}><strong>{label}</strong><p>{question}</p></article>)}
          <blockquote>Discovery is not trust. JSON validity is not permission.</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Trace model, host, and tool boundaries. Ask where authentication, authorization, consent, and side-effect logging must be enforced.",
    sourceSlides: [],
  },
  {
    eyebrow: "Modern layer 4 · Agent loop",
    title: "The harness turns repeated proposals into a bounded process",
    content: <AgentLoop />,
    note: "Timing: 3 minutes. Select loop stages. Have students name one state variable, approval gate, budget, and task-level success criterion.",
    sourceSlides: [],
  },
  {
    eyebrow: "Harness assurance · Control stack",
    title: "Guardrails at different layers stop different failures",
    content: (
      <div className="m30-harness">
        {[
          ["1", "Model boundary", "Prompt, decoding, output format", "Useful behavior—not an authority boundary"],
          ["2", "Tool boundary", "Typed inputs, allowlist, scoped credentials", "Blocks invalid or unauthorized operations"],
          ["3", "Human boundary", "Preview, approval, escalation, override", "Allocates consequential judgment"],
          ["4", "Runtime boundary", "Budget, timeout, sandbox, rate limit", "Contains resource and execution risk"],
          ["5", "Evidence boundary", "Trace, privacy-aware logs, task evaluation", "Makes outcomes inspectable without oversharing"],
          ["6", "Recovery boundary", "Idempotency, rollback, incident response", "Limits damage after a failure"],
        ].map(([number, label, controls, purpose]) => (
          <article key={number}>
            <span>{number}</span><strong>{label}</strong><p>{controls}</p><small>{purpose}</small>
          </article>
        ))}
        <aside><strong>Defense in depth</strong><p>No single control proves safety. Map each plausible failure to the layer that can actually block, detect, or recover from it.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Connect each control layer to a concrete failure. Emphasize privacy-aware logging rather than collecting every possible trace field.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative method practice · High-stakes scenario",
    title: "A method recommendation is a conditional argument",
    content: (
      <div className="m30-high-stakes">
        <section>
          <header><span>Scenario</span><strong>Student-support risk routing</strong></header>
          <p>A university wants to prioritize outreach from sparse messages, attendance signals, and advising history.</p>
          <div>
            {[
              ["Observable?", "No—need, intent, and life context remain hidden."],
              ["Stakes?", "High—missed cases and intrusive false alarms both matter."],
              ["Data?", "Historical labels reflect past access and intervention."],
              ["Supervision?", "Advisors remain responsible for outreach decisions."],
            ].map(([label, answer]) => <article key={label}><small>{label}</small><p>{answer}</p></article>)}
          </div>
        </section>
        <aside>
          <article><span>Baseline</span><p>Transparent eligibility/rules workflow with advisor review.</p></article>
          <article><span>Candidate</span><p>Calibrated ranking model evaluated by subgroup, time, and consequence.</p></article>
          <article><span>Reject</span><p>Autonomous action or an LLM-generated risk label from free-form text.</p></article>
          <blockquote>Public practice: What evidence must exist before the candidate replaces the baseline?</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 4 minutes. Ask groups to defend or reject the candidate. Require a baseline, evaluation slice, human role, and assumption that could halt deployment.",
    sourceSlides: [],
  },
  {
    eyebrow: "Recommendation reversal · Interactive",
    title: "Change one assumption; watch the technical recommendation change",
    content: <AssumptionFlipLab />,
    note: "Timing: 3 minutes. Select two assumption flips. Students must name which course concept caused the reversal and what new evidence is required.",
    sourceSlides: [],
  },
  {
    eyebrow: "AI literacy + public evidence",
    title: "Public explanation separates capability, evidence, limitation, and judgment",
    content: (
      <div className="m30-public">
        <section>
          {[
            ["Capability", "What did the system do in a defined task?", "Observed behavior"],
            ["Evidence", "Which source, comparison, cases, and rule support the claim?", "Recoverable support"],
            ["Limitation", "Where did it fail, remain unknown, or leave the tested conditions?", "Boundary"],
            ["Value judgment", "Which tradeoff is acceptable, and who has authority to decide?", "Governance"],
          ].map(([label, question, kind], index) => (
            <article key={label}><span>{index + 1}</span><strong>{label}</strong><p>{question}</p><small>{kind}</small></article>
          ))}
        </section>
        <aside>
          <span>Marketing claim</span>
          <blockquote>“Our AI tutor understands every learner and makes education fair.”</blockquote>
          <span>Evidence-card rewrite</span>
          <p>In a named pilot, version X improved a defined outcome versus baseline Y for population Z; subgroup result Q and learner-experience evidence remain missing. Do not infer fairness or universal understanding.</p>
          <small>A student evidence brief is a candidate contribution subject to review—not an endorsement.</small>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Model the four-part separation. Ask students to explain the rewritten claim to a nontechnical audience without removing its evidence boundary.",
    sourceSlides: [],
  },
  {
    eyebrow: "Capstone reflection · Evidence changes claims",
    title: "A weakened claim can be a stronger scientific result",
    content: (
      <div className="m30-weakened-claim">
        <section>
          <span>Before evaluation</span>
          <blockquote>“Our RAG assistant gives accurate, grounded answers to course-policy questions.”</blockquote>
          <i aria-hidden="true">↓ test 72 frozen cases ↓</i>
          <div>
            <article><small>Observed</small><strong>84%</strong><p>overall task success</p></article>
            <article><small>Exception slice</small><strong>58%</strong><p>task success</p></article>
            <article><small>Unsupported</small><strong>9%</strong><p>material-claim rate</p></article>
          </div>
        </section>
        <aside>
          <span>After evidence</span>
          <blockquote>“On routine questions represented in eval-v4, RAG v0.3 improves task success over keyword search; it is not reliable for policy exceptions and must route them to a human source owner.”</blockquote>
          <article><small>Deployment boundary</small><p>No autonomous advising, deadline calculation, or account action.</p></article>
          <article><small>Next evidence</small><p>Expand exception cases, verify freshness, test abstention, and rerun the frozen regression set.</p></article>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to identify exactly which evidence weakened the claim and why the revised statement is more useful for deployment.",
    sourceSlides: [],
  },
  {
    eyebrow: "Public formative assessment · Misconception diagnosis",
    title: "Do not memorize the repair—diagnose the broken inference",
    subtitle: "Choose a statement, identify the reasoning error, repair it, and ask the follow-up probe.",
    content: <MisconceptionLab />,
    note: "Timing: 3 minutes. Run two public practice statements. Require diagnosis before correction. These are formative examples, not secure assessment items.",
    sourceSlides: [],
  },
  {
    eyebrow: "Final artifact · Individual synthesis",
    title: "Build one concept map that can explain your capstone end to end",
    content: <FinalMapChecklist />,
    note: "Timing: 4 minutes. Students audit their one-page concept map against the six dependency groups and five required arrows. Collect the map as the final synthesis artifact.",
    sourceSlides: [],
  },
  {
    eyebrow: "Review strategy · Accessibility · Integrity · Next step",
    title: "Review by reconstructing decisions, not rereading topic lists",
    content: (
      <div className="m30-close">
        <section>
          {[
            ["1. Reconstruct", "Start from a scenario. Name agent, environment, representation, uncertainty, method, and performance measure."],
            ["2. Compare", "State a baseline and the evidence that would justify added complexity."],
            ["3. Reverse", "Change observability, stakes, data, or authority; update the recommendation."],
            ["4. Explain", "Separate capability, evidence, limitation, and value judgment for a nontechnical audience."],
          ].map(([label, detail]) => <article key={label}><strong>{label}</strong><p>{detail}</p></article>)}
        </section>
        <aside>
          <article><span>Accessibility</span><p>Use readable contrast, meaningful labels, keyboard access, captions/transcripts, and equivalent nonvisual descriptions.</p></article>
          <article><span>Integrity</span><p>Practice with public prompts; cite collaborators and tools; do not seek, share, or reconstruct secure assessment content.</p></article>
          <article><span>Exit / next step</span><p>Submit your concept map, one claim weakened by evidence, and one deployment boundary. Carry the same evidence discipline into the next system you build.</p></article>
          <blockquote>Technical maturity is not knowing every method. It is knowing what your claim depends on.</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 1 minute. Close with the reconstruct-compare-reverse-explain strategy. Confirm the three final submissions and the accessibility and integrity expectations. The 25 lesson-page timings total exactly 75 minutes.",
    sourceSlides: [],
  },
];

export function Meeting30Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 15 / Meeting 30"
      meetingTitle="Course Synthesis and Final Review"
      slides={slides}
      sourceCollectionLabel="Complete course source map and public review set"
    />
  );
}
