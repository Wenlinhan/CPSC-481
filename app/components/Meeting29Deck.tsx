"use client";

import { useEffect, useMemo, useState } from "react";
import "../styles/meeting29.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

type Segment = {
  label: string;
  minutes: number;
  purpose: string;
  evidence: string;
  color: string;
};

const demoSegments: Segment[] = [
  {
    label: "Problem · user · claim",
    minutes: 1,
    purpose: "Bound the decision and state the claim that the demonstration will test.",
    evidence: "User, context, intended use, measurable claim",
    color: "#235b8c",
  },
  {
    label: "Architecture · contribution",
    minutes: 2,
    purpose: "Show the system path and distinguish team work from reused dependencies.",
    evidence: "Component map, ownership, dependency boundary",
    color: "#286f78",
  },
  {
    label: "Live success · trace",
    minutes: 3,
    purpose: "Run one representative case and expose the trace that produced the result.",
    evidence: "Input, intermediate state, output, source or log",
    color: "#3b7c58",
  },
  {
    label: "Baseline · evaluation · failure",
    minutes: 2,
    purpose: "Compare against a meaningful baseline and inspect one honest failure.",
    evidence: "Evaluation slice, metric, failure category, uncertainty",
    color: "#9a6b12",
  },
  {
    label: "Limits · oversight · recommendation",
    minutes: 1,
    purpose: "State where the evidence stops and who should review consequential use.",
    evidence: "Excluded use, control, deployment recommendation",
    color: "#8a4158",
  },
  {
    label: "Transition to questions",
    minutes: 1,
    purpose: "Freeze the evidence view and invite a technically inspectable question.",
    evidence: "Stable result screen, artifact links, named responder",
    color: "#574392",
  },
];

function TenMinuteStructure() {
  const [active, setActive] = useState(0);
  const segment = demoSegments[active];

  return (
    <div className="m29-structure">
      <div className="m29-structure-bar" aria-label="Ten-minute demonstration structure">
        {demoSegments.map((item, index) => (
          <button
            aria-pressed={active === index}
            key={item.label}
            onClick={() => setActive(index)}
            style={{ flexGrow: item.minutes, "--segment-color": item.color } as React.CSSProperties}
            type="button"
          >
            <strong>{item.minutes} min</strong>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <section>
        <div>
          <span>Segment {active + 1} of 6</span>
          <h3>{segment.label}</h3>
          <p>{segment.purpose}</p>
        </div>
        <aside>
          <span>Audience must be able to inspect</span>
          <strong>{segment.evidence}</strong>
        </aside>
      </section>
      <footer>
        <strong>10:00 is a hard limit.</strong>
        <p>The schedule is an argument: spend the most time on observable behavior and evidence, not background.</p>
      </footer>
    </div>
  );
}

function DemoTimer() {
  const totalSeconds = 600;
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const next = Math.min(totalSeconds, seconds + 1);
      setSeconds(next);
      if (next === totalSeconds) setRunning(false);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, seconds]);
  const currentIndex = useMemo(() => {
    let boundary = 0;
    for (let index = 0; index < demoSegments.length; index += 1) {
      boundary += demoSegments[index].minutes * 60;
      if (seconds < boundary) return index;
    }
    return demoSegments.length - 1;
  }, [seconds]);
  const elapsedBefore = demoSegments
    .slice(0, currentIndex)
    .reduce((total, segment) => total + segment.minutes * 60, 0);
  const withinSegment = Math.max(0, seconds - elapsedBefore);
  const remaining = Math.max(0, totalSeconds - seconds);

  return (
    <div className="m29-timer">
      <section>
        <span>Rehearsal clock</span>
        <strong>{String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}</strong>
        <p>{remaining === 0 ? "Stop. Transition to questions." : demoSegments[currentIndex].label}</p>
        <div aria-label={`${seconds} of ${totalSeconds} seconds elapsed`}>
          <i style={{ width: `${(seconds / totalSeconds) * 100}%` }} />
        </div>
      </section>
      <aside>
        <span>Jump to rehearsal checkpoint</span>
        <div>
          {demoSegments.map((segment, index) => {
            const start = demoSegments.slice(0, index).reduce((sum, item) => sum + item.minutes, 0);
            return (
              <button
                aria-current={currentIndex === index ? "step" : undefined}
                key={segment.label}
                onClick={() => setSeconds(start * 60)}
                type="button"
              >
                <b>{start}:00</b>
                <span>{segment.label}</span>
              </button>
            );
          })}
        </div>
        <footer>
          <button onClick={() => setRunning(value => !value)} type="button">{running ? "Pause" : "Start"}</button>
          <button onClick={() => setSeconds(value => Math.min(totalSeconds, value + 15))} type="button">+15 sec</button>
          <button onClick={() => setSeconds(value => Math.min(totalSeconds, value + 60))} type="button">+1 min</button>
          <button onClick={() => { setRunning(false); setSeconds(0); }} type="button">Reset</button>
        </footer>
        <p>Current segment: {Math.floor(withinSegment / 60)}:{String(withinSegment % 60).padStart(2, "0")} / {demoSegments[currentIndex].minutes}:00</p>
      </aside>
    </div>
  );
}

const fallbackCases = {
  network: {
    label: "Network unavailable",
    condition: "The hosted interface cannot reach the model or data service.",
    response: "Show the captured request, environment identifier, timestamped response, and the same trace produced during preflight.",
    disclose: "Say that the live dependency failed; do not describe the capture as a live run.",
    preserve: "Input → intermediate records → output → evaluation decision",
  },
  nondeterminism: {
    label: "Different output",
    condition: "The live run produces a result different from rehearsal.",
    response: "Keep the result visible, compare it with the frozen case, and classify the difference using the evaluation rule.",
    disclose: "Do not rerun until a favorable result appears.",
    preserve: "Observed variation, configuration, seed or decoding settings, consequence",
  },
  interface: {
    label: "Display failure",
    condition: "The projector, browser, or UI does not render the result clearly.",
    response: "Use a local trace viewer or accessible document containing the same case and source-linked records.",
    disclose: "Separate interface failure from model or pipeline failure.",
    preserve: "Exact case ID, exact artifacts, exact evaluation criterion",
  },
} as const;

function FallbackLab() {
  const [active, setActive] = useState<keyof typeof fallbackCases>("network");
  const item = fallbackCases[active];

  return (
    <div className="m29-fallback">
      <nav aria-label="Fallback scenarios">
        {(Object.keys(fallbackCases) as (keyof typeof fallbackCases)[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {fallbackCases[key].label}
          </button>
        ))}
      </nav>
      <section>
        <span>Observed condition</span>
        <blockquote>{item.condition}</blockquote>
        <div>
          <article><small>Fallback action</small><p>{item.response}</p></article>
          <article><small>Disclosure sentence</small><p>{item.disclose}</p></article>
          <article><small>Evidence continuity</small><p>{item.preserve}</p></article>
        </div>
      </section>
    </div>
  );
}

const traceStages = [
  {
    label: "Input",
    artifact: "case-017.json",
    detail: "Question: Which policy applies to a late withdrawal?",
    inspect: "Versioned case ID and expected behavior",
  },
  {
    label: "Retrieve",
    artifact: "trace-8f2 / retrieval",
    detail: "Top passages: handbook §7.2, registrar FAQ §3",
    inspect: "Document IDs, scores, timestamps, filters",
  },
  {
    label: "Generate",
    artifact: "trace-8f2 / model",
    detail: "Model cites handbook §7.2 and adds an unsupported deadline.",
    inspect: "Prompt version, model config, raw output",
  },
  {
    label: "Evaluate",
    artifact: "eval-v4 / groundedness",
    detail: "2 of 3 material claims supported; severity = major.",
    inspect: "Rule, expected result, actual result, reviewer",
  },
  {
    label: "Decide",
    artifact: "system-card / limits",
    detail: "Do not automate advising; require a registrar link and human review.",
    inspect: "Claim boundary, oversight, release recommendation",
  },
] as const;

function TraceExplorer() {
  const [active, setActive] = useState(0);
  const item = traceStages[active];

  return (
    <div className="m29-trace">
      <div className="m29-trace-path">
        {traceStages.map((stage, index) => (
          <button
            aria-current={active === index ? "step" : undefined}
            key={stage.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{stage.label}</strong>
          </button>
        ))}
      </div>
      <section>
        <header><span>{item.label} artifact</span><code>{item.artifact}</code></header>
        <blockquote>{item.detail}</blockquote>
        <aside><span>Audience can inspect</span><strong>{item.inspect}</strong></aside>
      </section>
      <footer>
        <strong>A trace is a chain of recoverable records.</strong>
        <p>A narrated arrow is not enough when the underlying input, configuration, source, or evaluation record cannot be opened.</p>
      </footer>
    </div>
  );
}

const drilldownLayers = [
  {
    label: "Headline",
    claim: "The RAG assistant improved grounded-answer accuracy.",
    evidence: "84% versus 61% for the no-retrieval baseline.",
    challenge: "Which cases and scoring rule produced those percentages?",
  },
  {
    label: "Evaluation slice",
    claim: "On policy questions, accuracy was 41/48; on exceptions, 17/24.",
    evidence: "eval-set-v4.json · frozen before the final run",
    challenge: "Are the categories representative, independent, and non-leaking?",
  },
  {
    label: "Case record",
    claim: "Case 017 failed because the answer added an unsupported deadline.",
    evidence: "Expected: cite the policy and defer the deadline to the registrar.",
    challenge: "Was retrieval wrong, generation wrong, or the scoring rule wrong?",
  },
  {
    label: "Source / log",
    claim: "The correct passage was retrieved at rank 1.",
    evidence: "trace-8f2: handbook §7.2, score .83; model added the deadline.",
    challenge: "Does the record support the proposed failure category?",
  },
] as const;

function EvidenceDrilldown() {
  const [depth, setDepth] = useState(0);
  const item = drilldownLayers[depth];

  return (
    <div className="m29-drilldown">
      <nav aria-label="Evidence drill-down depth">
        {drilldownLayers.map((layer, index) => (
          <button
            aria-current={depth === index ? "page" : undefined}
            key={layer.label}
            onClick={() => setDepth(index)}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{layer.label}</strong>
          </button>
        ))}
      </nav>
      <section>
        <span>Claim at this depth</span>
        <h3>{item.claim}</h3>
        <article><small>Recoverable evidence</small><p>{item.evidence}</p></article>
        <article><small>Next audience question</small><p>{item.challenge}</p></article>
      </section>
      <aside>
        <strong>{depth + 1} / {drilldownLayers.length}</strong>
        <p>Good demonstrations let the audience move from aggregate claim to exact case without changing the story.</p>
      </aside>
    </div>
  );
}

const defensePrompts = [
  {
    category: "Explain",
    prompt: "Explain the retriever’s role without referring to the generator.",
    probe: "What exact input and output cross this component boundary?",
  },
  {
    category: "Trace",
    prompt: "Trace case 017 from user input to the release recommendation.",
    probe: "Name the record that verifies each transition.",
  },
  {
    category: "Justify",
    prompt: "Why is the no-retrieval system a meaningful baseline for your claim?",
    probe: "What conclusion would a weaker baseline fail to support?",
  },
  {
    category: "Diagnose",
    prompt: "Suppose the document set updates weekly instead of monthly. What changes first?",
    probe: "Predict a failure, a control, and a regression test.",
  },
  {
    category: "Contribution",
    prompt: "Identify one component you produced and one dependency you reused.",
    probe: "Show the commit, artifact, license, or interface boundary.",
  },
] as const;

function DefensePromptLab() {
  const [active, setActive] = useState(0);
  const item = defensePrompts[active];

  return (
    <div className="m29-defense-lab">
      <nav>
        {defensePrompts.map((prompt, index) => (
          <button
            aria-pressed={active === index}
            className={active === index ? "active" : ""}
            key={prompt.category}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{prompt.category}</strong>
          </button>
        ))}
      </nav>
      <section>
        <span>Individual defense prompt</span>
        <blockquote>{item.prompt}</blockquote>
        <article>
          <small>Follow-up probe</small>
          <p>{item.probe}</p>
        </article>
      </section>
      <aside>
        <strong>No team narration</strong>
        <p>The student may point to team artifacts, but must construct the explanation, trace, and justification independently.</p>
      </aside>
    </div>
  );
}

const feedbackDimensions = [
  {
    label: "Claim",
    check: "Could you state the claim and the condition under which it was tested?",
    useful: "The claim names grounded answers, but the intended user and release decision remained unclear.",
  },
  {
    label: "Trace",
    check: "Could you follow one input through the system to a recoverable record?",
    useful: "The output was visible; retrieval scores and prompt version were not available for inspection.",
  },
  {
    label: "Evidence",
    check: "Could you connect the comparison to a baseline, evaluation set, and scoring rule?",
    useful: "The metric improved, but the baseline and evaluation categories were not defined.",
  },
  {
    label: "Boundary",
    check: "Did the team show one failure and state what the system should not decide?",
    useful: "The failure was honest; add the human-review action that follows it.",
  },
] as const;

function PeerFeedbackLab() {
  const [active, setActive] = useState(0);
  const item = feedbackDimensions[active];

  return (
    <div className="m29-feedback">
      <nav aria-label="Peer feedback dimensions">
        {feedbackDimensions.map((dimension, index) => (
          <button
            aria-current={active === index ? "step" : undefined}
            key={dimension.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {dimension.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Observation question</span>
        <blockquote>{item.check}</blockquote>
        <span>Evidence-specific feedback</span>
        <p>{item.useful}</p>
      </section>
      <aside>
        <div><strong>Observe</strong><p>Record what was visible or missing.</p></div>
        <div><strong>Locate</strong><p>Name the segment or artifact.</p></div>
        <div><strong>Revise</strong><p>Request one feasible evidence improvement.</p></div>
      </aside>
    </div>
  );
}

const scoringDimensions = [
  ["Problem + claim", 10, "Bounded user, context, intended use, falsifiable system claim"],
  ["Architecture + contribution", 15, "Correct component relations, owned work, reused dependencies"],
  ["Live behavior + trace", 20, "Representative case, observable execution, recoverable artifacts"],
  ["Baseline + evaluation", 20, "Meaningful comparison, frozen set, scoring rule, uncertainty"],
  ["Failure + limitations", 15, "Honest failure, taxonomy, boundary, oversight, recommendation"],
  ["Time + communication", 10, "Ten-minute structure, readable evidence, accessible delivery"],
  ["Individual defense", 10, "Independent explanation, trace, justification, diagnosis, contribution"],
] as const;

function ScoringView() {
  const [active, setActive] = useState(2);
  const item = scoringDimensions[active];

  return (
    <div className="m29-scoring">
      <section>
        {scoringDimensions.map((dimension, index) => (
          <button
            aria-pressed={active === index}
            key={dimension[0]}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{dimension[0]}</span>
            <i><b style={{ width: `${Number(dimension[1]) * 4}%` }} /></i>
            <strong>{dimension[1]}</strong>
          </button>
        ))}
      </section>
      <aside>
        <span>Instructor evidence for this dimension</span>
        <h3>{item[0]} · {item[1]} points</h3>
        <p>{item[2]}</p>
        <blockquote>Peer feedback informs revision and communication quality. The instructor evaluates technical correctness.</blockquote>
      </aside>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Week 15 · Meeting 29 · 75 minutes",
    title: "Capstone Demonstrations and Individual Technical Defense",
    subtitle: "Make the system’s behavior, evidence, boundaries, and individual understanding inspectable in ten minutes.",
    content: (
      <div className="m29-cover">
        <section>
          <span>Demonstration argument</span>
          <h3>Claim → system → behavior → evidence → boundary</h3>
          <p>A polished interface is useful only when the audience can inspect why the observed result should change a technical or deployment decision.</p>
        </section>
        <div className="m29-cover-stage" aria-label="Demonstration stage with evidence layers">
          <div className="m29-projector">
            <span>LIVE CASE 017</span>
            <b>input</b><i>→</i><b>trace</b><i>→</i><b>result</b>
          </div>
          <div className="m29-audience">
            {[1, 2, 3, 4, 5].map(number => <i key={number} />)}
          </div>
          <aside><strong>10:00</strong><span>hard limit</span></aside>
        </div>
      </div>
    ),
    note: "Timing: 1 minute. Frame the demonstration as a technical argument, not a product pitch. Preview the ten-minute limit and individual defense.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning objectives",
    title: "By the end, you can rehearse, inspect, question, and defend",
    content: (
      <div className="m29-objectives">
        {[
          ["01", "Rehearse", "Deliver the six-part ten-minute demonstration with evidence-weighted timing."],
          ["02", "Inspect", "Drill from a headline metric to an exact case, source, configuration, or log."],
          ["03", "Question", "Ask audience questions that test claims, failure boundaries, and oversight."],
          ["04", "Defend", "Explain and diagnose the system independently of team narration."],
          ["05", "Revise", "Turn peer observations and instructor findings into a final evidence correction."],
        ].map(([number, label, detail]) => (
          <article key={number}><span>{number}</span><strong>{label}</strong><p>{detail}</p></article>
        ))}
      </div>
    ),
    note: "Timing: 2 minutes. Ask students to identify which objective is currently least rehearsed. Emphasize independent defense and recoverable evidence.",
    sourceSlides: [],
  },
  {
    eyebrow: "Capstone contract",
    title: "The demonstration inherits three enduring expectations",
    content: (
      <div className="m29-contract">
        {[
          ["10-minute limit", "A fixed boundary tests prioritization and time discipline.", "Rehearse to 9:30; reserve 0:30 for variance."],
          ["Team participation", "The system is shared, but participation and contribution boundaries remain visible.", "Every member owns a segment and completes an individual defense."],
          ["Peer evaluation", "Peers observe clarity, evidence access, and boundaries.", "Peer scores inform revision; they do not determine technical correctness."],
          ["Novelty in context", "A new idea can motivate a project, but novelty alone is not evidence.", "Compare against a baseline and show measured consequences."],
        ].map(([label, rationale, operational], index) => (
          <article key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
            <p>{rationale}</p>
            <aside>{operational}</aside>
          </article>
        ))}
      </div>
    ),
    note: "Timing: 2 minutes. Connect the demonstration to the course project contract: time limit, participation, peer evaluation, and novelty context. State explicitly that novelty cannot substitute for baseline evidence.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 · Demonstration structure",
    title: "Allocate ten minutes by evidentiary importance",
    content: <TenMinuteStructure />,
    note: "Timing: 4 minutes. Click every segment. Ask why live behavior receives three minutes while background receives one. Require teams to adopt the six-part allocation exactly.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Time discipline",
    title: "Rehearse checkpoints, not just a final duration",
    content: <DemoTimer />,
    note: "Timing: 4 minutes. Jump through checkpoints. Teams mark where their current narration should be at 1:00, 3:00, 6:00, 8:00, and 9:00. Explain that the final minute is not spare time.",
    sourceSlides: [],
  },
  {
    eyebrow: "Minute 0:00–1:00 · Problem, user, claim",
    title: "Begin with a falsifiable claim, not a feature tour",
    content: (
      <div className="m29-claim-frame">
        <section>
          <span>Weak opening</span>
          <blockquote>We built an innovative AI advising assistant with RAG and a modern interface.</blockquote>
          <p>Names technology and novelty; leaves user, decision, comparison, and evidence undefined.</p>
        </section>
        <i aria-hidden="true">→</i>
        <section>
          <span>Demonstrable opening</span>
          <blockquote>For first-year students asking policy questions, our retrieval-grounded assistant should reduce unsupported material claims relative to the same model without retrieval on eval-set-v4.</blockquote>
          <div>
            {["user + context", "system change", "baseline", "outcome", "evaluation set"].map(item => <b key={item}>{item}</b>)}
          </div>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Have students underline the population, system contrast, outcome, and evaluation set. Ask what result would weaken the claim.",
    sourceSlides: [],
  },
  {
    eyebrow: "Minute 1:00–3:00 · Architecture and boundaries",
    title: "Show architecture as responsibility and evidence flow",
    content: (
      <div className="m29-architecture">
        <div>
          {[
            ["User interface", "team", "input validation · accessible status"],
            ["Retriever", "team", "query transform · ranking · source IDs"],
            ["Vector store", "reused", "external library · pinned version"],
            ["Generator", "reused", "model API · fixed configuration"],
            ["Evaluator", "team", "claim units · grounding rule · severity"],
            ["Oversight", "team", "abstain · source link · human review"],
          ].map(([label, owner, details], index) => (
            <article className={owner === "team" ? "owned" : "reused"} key={label}>
              <span>{index + 1}</span><strong>{label}</strong><p>{details}</p><b>{owner}</b>
            </article>
          ))}
        </div>
        <aside>
          <span>Boundary legend</span>
          <p><i className="owned" /> Team-created or substantially modified</p>
          <p><i className="reused" /> Reused code, model, data, or service</p>
          <blockquote>Name inputs, outputs, version, license or terms, and failure handling at reused boundaries.</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Trace one arrow verbally and ask who owns the code, configuration, data, and evaluation rule at each boundary. Contribution boundaries must be visible before the live run.",
    sourceSlides: [],
  },
  {
    eyebrow: "Minute 3:00–6:00 · Live success and trace",
    title: "A success case needs a visible causal path",
    content: <TraceExplorer />,
    note: "Timing: 4 minutes. Click through all five trace stages. Ask which displayed records are implementation artifacts and which are evaluative judgments. The live case should be representative, not specially selected because it looks impressive.",
    sourceSlides: [],
  },
  {
    eyebrow: "Minute 6:00–8:00 · Baseline, evaluation, failure",
    title: "Place one honest failure beside the aggregate result",
    content: (
      <div className="m29-evidence-failure">
        <section>
          <span>Evaluation summary · eval-set-v4 · n = 72</span>
          <div className="m29-bars">
            <article><strong>No retrieval baseline</strong><i><b style={{ width: "61%" }} /></i><span>61%</span></article>
            <article><strong>RAG system</strong><i><b style={{ width: "84%" }} /></i><span>84%</span></article>
          </div>
          <p>Metric: all material claims supported by the provided policy sources. Two reviewers reconciled disagreements.</p>
          <aside><strong>Observed difference:</strong> +23 percentage points on this constructed evaluation set—not a universal accuracy claim.</aside>
        </section>
        <section>
          <span>Honest failure · case 017</span>
          <blockquote>The correct policy was retrieved, but the response added an unsupported deadline.</blockquote>
          <div>
            <article><small>Category</small><strong>Generation overreach</strong></article>
            <article><small>Severity</small><strong>Major</strong></article>
            <article><small>Residual risk</small><strong>Confident policy error</strong></article>
            <article><small>Control</small><strong>Source-level check + human review</strong></article>
          </div>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Ask what the 23-point difference supports and what it does not. Then have students identify the failure layer and explain why a success-only demo would hide deployment risk.",
    sourceSlides: [],
  },
  {
    eyebrow: "Minute 8:00–9:00 · Limits, oversight, recommendation",
    title: "End the evidence argument with a bounded decision",
    content: (
      <div className="m29-decision">
        <div className="m29-decision-ladder">
          {[
            ["Observed", "84% grounded answers on eval-set-v4; exception questions remained weaker."],
            ["Inferred", "Retrieval helped on this set, but generation can still add unsupported details."],
            ["Bounded", "No evidence yet for other institutions, languages, or high-stakes advising."],
            ["Controlled", "Show sources, abstain on missing policy, log traces, require human review."],
            ["Recommended", "Pilot as an information aid; do not automate enrollment or policy decisions."],
          ].map(([label, text], index) => <article key={label}><span>{index + 1}</span><strong>{label}</strong><p>{text}</p></article>)}
        </div>
        <aside>
          <span>One-minute sentence frame</span>
          <blockquote>Given <mark>[evidence]</mark> and <mark>[remaining failure]</mark>, we recommend <mark>[bounded use]</mark> with <mark>[oversight]</mark>; we do not recommend <mark>[excluded use]</mark>.</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Students practice the sentence frame in pairs. Reject recommendations that omit the residual failure or the decision maker.",
    sourceSlides: [],
  },
  {
    eyebrow: "Minute 9:00–10:00 · Transition",
    title: "Freeze the evidence view before inviting questions",
    content: (
      <div className="m29-transition">
        <section>
          <span>Keep visible</span>
          <div>
            {[
              ["Claim", "one-sentence bounded claim"],
              ["Comparison", "baseline and system metric"],
              ["Failure", "case ID and category"],
              ["Artifacts", "trace, evaluation set, system card"],
              ["Recommendation", "bounded use and oversight"],
            ].map(([label, detail]) => <article key={label}><strong>{label}</strong><p>{detail}</p></article>)}
          </div>
        </section>
        <aside>
          <span>Transition script</span>
          <blockquote>We have shown the claim, system path, representative success, baseline comparison, and one residual failure. Which result or artifact would you like us to inspect?</blockquote>
          <p>Name the first responder for architecture, evaluation, deployment, and reproducibility questions.</p>
        </aside>
      </div>
    ),
    note: "Timing: 2 minutes. Teams choose one stable final screen and rehearse the transition sentence. Do not close the trace window or replace evidence with a decorative thank-you page.",
    sourceSlides: [],
  },
  {
    eyebrow: "Preflight · Reproducibility",
    title: "Freeze what matters; test what can still fail",
    content: (
      <div className="m29-preflight">
        {[
          ["Build identity", "Commit/tag, branch, artifact checksum, date", "Can the team identify exactly what is running?"],
          ["Environment", "Pinned dependencies, model/config version, secrets injected safely", "Can the build start on the presentation machine?"],
          ["Data", "Evaluation-set version, source snapshot, licenses, no sensitive records", "Will the same case resolve to the same evidence?"],
          ["Live path", "Accounts, network, permissions, quotas, browser, projector", "Have we tested from the room and user account?"],
          ["Trace path", "Logging enabled, case IDs visible, artifact links readable", "Can an audience question be answered from records?"],
          ["Fallback", "Local capture, offline artifacts, disclosure sentence", "Does the fallback preserve evidence continuity?"],
          ["Accessibility", "Captioning, contrast, zoom, keyboard, text alternatives", "Can every attendee perceive the essential evidence?"],
          ["Roles", "Speaker handoffs, timer, operator, question owners", "Does each student know the next action after a failure?"],
        ].map(([label, artifacts, test], index) => (
          <article key={label}><span>{index + 1}</span><strong>{label}</strong><p>{artifacts}</p><aside>{test}</aside></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Teams mark each item green, amber, or red. A red build, data, trace, or fallback item blocks a reliable demonstration.",
    sourceSlides: [],
  },
  {
    eyebrow: "Fallback · Transparency",
    title: "Recover the evidence without hiding the failure",
    content: <FallbackLab />,
    note: "Timing: 3 minutes. Toggle all three failure modes. Ask which fallback preserves the same case and artifacts. Require teams to write the exact disclosure sentence they will use.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 · Source and log trace",
    title: "Design every audience claim to be recoverable",
    content: (
      <div className="m29-ledger">
        <header>
          <span>Claim ID</span><span>Presentation claim</span><span>Recoverable record</span><span>Locator</span><span>Boundary</span>
        </header>
        {[
          ["C-01", "Retrieval improved grounded accuracy by 23 points.", "eval-summary-v4.csv", "rows 2–3", "this set and scoring rule"],
          ["C-02", "Case 006 followed the intended source.", "trace-a31.json", "events 4–9", "one representative success"],
          ["C-03", "Case 017 contains an unsupported deadline.", "review-017.md", "claims 2–3", "reviewer judgment reconciled"],
          ["C-04", "The vector store is a reused dependency.", "DEPENDENCIES.md", "entry 7", "version and license recorded"],
          ["C-05", "Human review is required for policy advice.", "system-card.md", "limitations §2", "release recommendation"],
        ].map(row => (
          <article key={row[0]}>{row.map((cell, index) => index === 0 ? <strong key={cell}>{cell}</strong> : <span key={cell}>{cell}</span>)}</article>
        ))}
        <aside><strong>Trace test:</strong><p>A skeptical reader should recover the exact evidence without asking the presenter to recreate the result.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Ask which rows describe observations, judgments, contribution boundaries, and recommendations. Teams add one missing locator to their own evidence ledger.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interaction · Evidence drill-down",
    title: "Move from headline metric to exact case without changing the claim",
    content: <EvidenceDrilldown />,
    note: "Timing: 4 minutes. Click all four levels. At each level, ask what new uncertainty becomes visible. Students name the next artifact required by an audience challenge.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked example · A complete ten-minute argument",
    title: "The demo path and evidence path must remain synchronized",
    content: (
      <div className="m29-worked">
        <div className="m29-worked-timeline">
          {[
            ["0–1", "Claim", "Grounded assistant vs. no-retrieval baseline", "claim C-01"],
            ["1–3", "System", "UI → retriever → model → evaluator → oversight", "architecture v7"],
            ["3–6", "Success", "Run case 006 and open its retrieval/model trace", "trace-a31"],
            ["6–8", "Evidence", "84% vs. 61%; inspect failed case 017", "eval-v4 + review-017"],
            ["8–9", "Boundary", "Pilot as information aid with human review", "system card §2"],
            ["9–10", "Question", "Freeze summary and open artifact index", "demo-index.html"],
          ].map(([time, label, action, artifact]) => (
            <article key={time}><span>{time}</span><strong>{label}</strong><p>{action}</p><code>{artifact}</code></article>
          ))}
        </div>
        <aside>
          <span>Consistency checks</span>
          <ul>
            <li>The live case comes from the declared evaluation taxonomy.</li>
            <li>The aggregate metric uses the displayed scoring rule.</li>
            <li>The failure record supports the stated failure category.</li>
            <li>The recommendation follows from the residual risk.</li>
            <li>Every contribution and dependency has an owner.</li>
          </ul>
        </aside>
      </div>
    ),
    note: "Timing: 4 minutes. Walk through the synchronized timeline. Ask students to identify where a polished demo could still make an unsupported inference.",
    sourceSlides: [],
  },
  {
    eyebrow: "Audience questions · Technical inspection",
    title: "Ask questions that could change the conclusion",
    content: (
      <div className="m29-questions">
        {[
          ["Claim", "What result would make you withdraw or narrow the primary claim?", "Tests falsifiability"],
          ["Baseline", "Why does this comparison isolate the value of the added component?", "Tests causal interpretation"],
          ["Evaluation", "How was this set constructed, frozen, and checked for leakage?", "Tests evidence validity"],
          ["Trace", "Can we inspect one surprising result down to source, configuration, and log?", "Tests recoverability"],
          ["Failure", "Which failure category is most consequential despite being infrequent?", "Tests risk reasoning"],
          ["Change", "What breaks if the user, data source, model, or environment changes?", "Tests transfer"],
          ["Oversight", "Who reviews uncertainty, and what can that person actually do?", "Tests control design"],
          ["Dependency", "Which result depends on reused code, model, data, or service?", "Tests contribution boundary"],
        ].map(([category, question, purpose], index) => (
          <article key={category}><span>{String(index + 1).padStart(2, "0")}</span><strong>{category}</strong><p>{question}</p><aside>{purpose}</aside></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Assign one question to each table. Teams answer by opening an artifact, not only by adding narration. Collect one question that would materially change a deployment recommendation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Accessibility · Audience fit",
    title: "Readable evidence is part of technical correctness",
    content: (
      <div className="m29-access">
        <section>
          <span>Visual access</span>
          <div className="m29-access-example">
            <article className="weak"><small>Weak projected result</small><p>acc=.84; base=.61; n=72; cat_e=.708</p></article>
            <article className="strong"><small>Readable projected result</small><strong>84% grounded</strong><p>versus 61% baseline · 72 test cases</p><b>Exception questions: 71%</b></article>
          </div>
        </section>
        <aside>
          {[
            ["Say what changes", "Do not rely on animation, color, or cursor position alone."],
            ["Caption and transcribe", "Provide spoken labels, captions, and a readable artifact index."],
            ["Control pace", "Pause after state changes; never scroll through evidence while explaining it."],
            ["Preserve interaction", "Keyboard access and visible focus for drill-down controls."],
            ["Answer for the room", "Repeat audience questions before responding; define project-specific terms."],
          ].map(([label, detail]) => <article key={label}><strong>{label}</strong><p>{detail}</p></article>)}
        </aside>
      </div>
    ),
    note: "Timing: 2 minutes. Ask students which technical facts disappear in the weak display. Require a text-equivalent path for every essential visual or live state.",
    sourceSlides: [],
  },
  {
    eyebrow: "Peer evaluation · Revision evidence",
    title: "Peers report observations; teams decide revisions",
    content: <PeerFeedbackLab />,
    note: "Timing: 3 minutes. Demonstrate the observation-locator-revision protocol. Ban feedback that says only interesting, confusing, innovative, or good. Novelty may be noted, but evidence quality remains separate.",
    sourceSlides: [],
  },
  {
    eyebrow: "Assessment · Instructor technical correctness",
    title: "Score the argument, artifacts, and independent understanding",
    content: <ScoringView />,
    note: "Timing: 3 minutes. Click the seven dimensions. Explain that the demonstration component is judged with technical evidence, while peer feedback is formative. Clarify individual defense scoring.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 · Individual accountability",
    title: "Every student must independently explain, trace, justify, diagnose, and attribute",
    content: (
      <div className="m29-defense-contract">
        {[
          ["Explain one component", "Inputs, outputs, method, assumptions, and failure modes", "No team member completes the explanation."],
          ["Trace one input end-to-end", "Case ID, state transitions, sources or logs, output, evaluation", "Point to recoverable records at each transition."],
          ["Justify one choice", "Design or evaluation choice, alternatives, evidence, tradeoff", "Name what would reverse the choice."],
          ["Diagnose a change scenario", "Changed user, data, model, environment, cost, or risk", "Predict failure, control, and test."],
          ["Identify contribution + dependency", "Own implementation and one reused component or artifact", "Show boundary, provenance, version, and license or terms."],
        ].map(([task, evidence, standard], index) => (
          <article key={task}><span>{index + 1}</span><strong>{task}</strong><p>{evidence}</p><aside>{standard}</aside></article>
        ))}
      </div>
    ),
    note: "Timing: 4 minutes. Read each task as an assessment contract. Students mark which artifact they will use for each response. Emphasize that shared authorship does not imply interchangeable understanding.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interaction · Randomized technical defense",
    title: "Practice beyond the segment you plan to present",
    content: <DefensePromptLab />,
    note: "Timing: 4 minutes. Click all five prompt families. Cold-call volunteers for 30-second responses and one follow-up probe. Require artifact references and boundary language.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class practice · Defense triads",
    title: "Answer, probe, and score with a three-role protocol",
    content: (
      <div className="m29-triads">
        <section>
          {[
            ["Student", "90 sec", "Answer one randomized prompt with an artifact.", "State claim → show record → name boundary."],
            ["Examiner", "45 sec", "Ask one probe that changes an assumption.", "Change user, data, model, environment, cost, or risk."],
            ["Observer", "45 sec", "Score technical completeness and independence.", "Record one missing link; do not supply the answer."],
          ].map(([role, time, action, criterion], index) => (
            <article key={role}><span>{index + 1}</span><strong>{role}</strong><b>{time}</b><p>{action}</p><aside>{criterion}</aside></article>
          ))}
        </section>
        <aside>
          <span>Rotate three times · 9 minutes total outside slide explanation</span>
          <div>
            {["component explanation", "end-to-end trace", "choice or change diagnosis"].map((prompt, index) => (
              <article key={prompt}><strong>Round {index + 1}</strong><p>{prompt}</p></article>
            ))}
          </div>
          <blockquote>An adequate response links a mechanism to an artifact and then names an assumption or limit.</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes of setup and modeled exchange. Run the three nine-minute practice rounds during the associated studio block or assigned rehearsal period. Collect observer records for formative feedback.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demonstration day · Operating protocol",
    title: "Run the room with the same discipline as the system",
    content: (
      <div className="m29-runbook">
        {[
          ["Before class", "Freeze build, test room path, load local fallback, open artifact index."],
          ["T − 2 min", "Connect display, verify readable scale and audio/captions, name timer and operator."],
          ["T = 0", "Start claim segment. Timer remains visible to the team."],
          ["T = 9 min", "Freeze evidence summary and transition to questions."],
          ["T = 10 min", "Stop the planned demonstration. Do not borrow question time."],
          ["Questions", "Repeat the question, choose an owner, open the relevant artifact, answer with a boundary."],
          ["Individual defense", "Instructor selects student and prompt; team remains silent unless invited."],
          ["After", "Collect peer observations and instructor findings in the revision log."],
        ].map(([time, action], index) => (
          <article key={time}><span>{String(index + 1).padStart(2, "0")}</span><strong>{time}</strong><p>{action}</p></article>
        ))}
      </div>
    ),
    note: "Timing: 2 minutes. Assign demonstration-day roles and confirm the hard stop. Students should know exactly which artifact opens for each likely question.",
    sourceSlides: [],
  },
  {
    eyebrow: "Exit ticket · Hand-off to Meeting 30",
    title: "Carry one evidence correction into the final course synthesis",
    content: (
      <div className="m29-exit">
        <section>
          <span>Submit before leaving</span>
          <ol>
            <li>Write your one-sentence falsifiable demonstration claim.</li>
            <li>Name the exact case and record you will open for success and failure.</li>
            <li>State one dependency you reused and one contribution you own.</li>
            <li>Write the defense change scenario you are least ready to diagnose.</li>
            <li>Record one revision caused by peer or instructor evidence.</li>
          </ol>
        </section>
        <aside>
          <span>Meeting 30 preparation</span>
          <h3>Bring a one-page concept map and one claim that your project evidence weakened.</h3>
          <p>Connect the capstone to agents, task environments, representation, search, uncertainty, learning, LLM/RAG/tool layers, evaluation, oversight, and public explanation.</p>
          <blockquote>Technical maturity is visible when evidence can narrow a claim.</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 2 minutes. Collect the five-part exit ticket and confirm Meeting 30 preparation. The 25 lesson-page timings total exactly 75 minutes.",
    sourceSlides: [],
  },
];

export function Meeting29Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 15 / Meeting 29"
      meetingTitle="Capstone Demonstrations and Individual Technical Defense"
      slides={slides}
      sourceCollectionLabel="Historical demonstration requirements and revised capstone evidence"
    />
  );
}
