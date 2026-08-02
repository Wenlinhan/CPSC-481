"use client";

import { useMemo, useState } from "react";
import "../styles/meeting20.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

type SamplingTemperature = "0.3" | "1.0" | "1.8";

const samplingOptions: Record<
  SamplingTemperature,
  { label: string; bars: number[]; message: string; samples: string[] }
> = {
  "0.3": {
    label: "Low temperature",
    bars: [88, 8, 3, 1],
    message: "The largest logit dominates; repeated samples look similar.",
    samples: ["Paris", "Paris", "Paris", "Paris"],
  },
  "1.0": {
    label: "Baseline",
    bars: [57, 24, 13, 6],
    message: "Alternatives remain plausible, so sampling produces variation.",
    samples: ["Paris", "Paris", "Lyon", "Marseille"],
  },
  "1.8": {
    label: "High temperature",
    bars: [37, 29, 21, 13],
    message: "The distribution is flatter; diversity and error risk both rise.",
    samples: ["Paris", "Lyon", "Marseille", "Bordeaux"],
  },
};

function SamplingLab() {
  const [temperature, setTemperature] = useState<SamplingTemperature>("1.0");
  const option = samplingOptions[temperature];
  const labels = ["Paris", "Lyon", "Marseille", "Bordeaux"];

  return (
    <div className="m20-sampling-lab">
      <section>
        <span>Prompt</span>
        <p>“The capital of France is”</p>
        <div className="m20-token-stream">
          <i>The</i><i>capital</i><i>of</i><i>France</i><i>is</i><b>?</b>
        </div>
        <nav aria-label="Sampling temperature">
          {(Object.keys(samplingOptions) as SamplingTemperature[]).map(value => (
            <button
              className={temperature === value ? "active" : ""}
              key={value}
              onClick={() => setTemperature(value)}
              type="button"
            >
              T = {value}
            </button>
          ))}
        </nav>
      </section>
      <section>
        <span>{option.label} · illustrative probabilities</span>
        <div className="m20-prob-bars">
          {option.bars.map((bar, index) => (
            <div key={labels[index]}>
              <label>{labels[index]} <b>{bar}%</b></label>
              <i><em style={{ width: `${bar}%` }} /></i>
            </div>
          ))}
        </div>
        <p>{option.message}</p>
        <div className="m20-samples" aria-label="Four illustrative samples">
          {option.samples.map((sample, index) => <b key={`${sample}-${index}`}>{sample}</b>)}
        </div>
      </section>
    </div>
  );
}

const trainingStages = [
  {
    label: "Pretraining",
    signal: "next token in text",
    update: "predict continuation patterns across a large corpus",
    doesNotGuarantee: "instruction following or truth",
  },
  {
    label: "Instruction tuning",
    signal: "demonstrated prompt–response pairs",
    update: "make requested behavior easier to elicit",
    doesNotGuarantee: "coverage beyond the demonstrations",
  },
  {
    label: "Preference optimization",
    signal: "comparisons under a rubric",
    update: "favor responses rated as preferable",
    doesNotGuarantee: "a single universal human value function",
  },
  {
    label: "Evaluation",
    signal: "held-out tests and human review",
    update: "estimate behavior on specified tasks",
    doesNotGuarantee: "performance in every deployment context",
  },
];

function TrainingPipeline() {
  const [stage, setStage] = useState(0);
  const item = trainingStages[stage];

  return (
    <div className="m20-pipeline">
      <nav aria-label="Language-model training stages">
        {trainingStages.map((entry, index) => (
          <button
            className={stage === index ? "active" : ""}
            key={entry.label}
            onClick={() => setStage(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Stage {stage + 1} · {item.label}</span>
        <div>
          <article><small>Learning signal</small><strong>{item.signal}</strong></article>
          <article><small>Behavioral effect</small><strong>{item.update}</strong></article>
          <article className="warning"><small>Does not guarantee</small><strong>{item.doesNotGuarantee}</strong></article>
        </div>
      </section>
    </div>
  );
}

const allocationCases = [
  {
    label: "Parameter-heavy",
    parameters: 82,
    data: 30,
    compute: 78,
    diagnosis: "A large model can be undertrained when too few tokens carry the learning signal.",
  },
  {
    label: "Data-heavy",
    parameters: 34,
    data: 90,
    compute: 72,
    diagnosis: "More data helps only when model capacity and training compute can use it effectively.",
  },
  {
    label: "Balanced allocation",
    parameters: 61,
    data: 64,
    compute: 66,
    diagnosis: "Compute-optimal work asks how to allocate a fixed budget—not how to maximize one axis.",
  },
];

function ScalingLab() {
  const [active, setActive] = useState(2);
  const item = allocationCases[active];
  return (
    <div className="m20-scaling-lab">
      <nav aria-label="Training budget allocations">
        {allocationCases.map((entry, index) => (
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
        {[
          ["Parameters", item.parameters],
          ["Training data", item.data],
          ["Compute", item.compute],
        ].map(([label, value]) => (
          <div key={String(label)}>
            <span>{label}</span>
            <i><em style={{ width: `${value}%` }} /></i>
            <b>{value}</b>
          </div>
        ))}
      </section>
      <p>{item.diagnosis}</p>
    </div>
  );
}

function PreferenceLab() {
  const [rubric, setRubric] = useState<"concise" | "cautious">("concise");
  const choices = {
    concise: {
      winner: "A",
      reason: "It answers directly and uses fewer words, but omits a boundary condition.",
    },
    cautious: {
      winner: "B",
      reason: "It states the limitation and recommends verification, but is less direct.",
    },
  };

  return (
    <div className="m20-preference-lab">
      <section>
        <span>Prompt</span>
        <p>“Can I combine these two medicines?”</p>
        <nav>
          <button className={rubric === "concise" ? "active" : ""} onClick={() => setRubric("concise")} type="button">Rubric: concise</button>
          <button className={rubric === "cautious" ? "active" : ""} onClick={() => setRubric("cautious")} type="button">Rubric: cautious</button>
        </nav>
      </section>
      <div>
        <article className={choices[rubric].winner === "A" ? "winner" : ""}>
          <b>A</b><p>“Usually yes. Take them with food.”</p>
        </article>
        <article className={choices[rubric].winner === "B" ? "winner" : ""}>
          <b>B</b><p>“Interactions depend on the exact medicines and dose. Check the labels and ask a pharmacist.”</p>
        </article>
        <aside><strong>Preferred: {choices[rubric].winner}</strong><p>{choices[rubric].reason}</p></aside>
      </div>
    </div>
  );
}

type OutputMode = "json" | "schema" | "semantic" | "fact";

const outputChecks: Record<OutputMode, {
  label: string;
  code: string;
  statuses: [string, "pass" | "fail"][];
  finding: string;
}> = {
  json: {
    label: "Malformed JSON",
    code: `{ "city": "Fullerton", "temperature_f": 72, }`,
    statuses: [["Parses as JSON", "fail"], ["Matches schema", "fail"], ["Values make sense", "fail"], ["Supported now", "fail"]],
    finding: "A trailing comma fails at the syntax layer. Later checks cannot run.",
  },
  schema: {
    label: "Wrong type",
    code: `{ "city": "Fullerton", "temperature_f": "warm" }`,
    statuses: [["Parses as JSON", "pass"], ["Matches schema", "fail"], ["Values make sense", "fail"], ["Supported now", "fail"]],
    finding: "The document parses, but “warm” is not a numeric temperature.",
  },
  semantic: {
    label: "Impossible value",
    code: `{ "city": "Fullerton", "temperature_f": -900 }`,
    statuses: [["Parses as JSON", "pass"], ["Matches schema", "pass"], ["Values make sense", "fail"], ["Supported now", "fail"]],
    finding: "A numeric field can satisfy the schema while violating domain constraints.",
  },
  fact: {
    label: "Plausible but unsupported",
    code: `{ "city": "Fullerton", "temperature_f": 72 }`,
    statuses: [["Parses as JSON", "pass"], ["Matches schema", "pass"], ["Values make sense", "pass"], ["Supported now", "fail"]],
    finding: "Only a current authoritative weather observation can support the value.",
  },
};

function ValidationStackLab() {
  const [mode, setMode] = useState<OutputMode>("fact");
  const item = outputChecks[mode];
  return (
    <div className="m20-validation-lab">
      <nav aria-label="Output validation examples">
        {(Object.keys(outputChecks) as OutputMode[]).map(key => (
          <button className={key === mode ? "active" : ""} key={key} onClick={() => setMode(key)} type="button">
            {outputChecks[key].label}
          </button>
        ))}
      </nav>
      <section>
        <code>{item.code}</code>
        <div>
          {item.statuses.map(([label, status], index) => (
            <article className={status} key={label}>
              <span>{index + 1}</span><strong>{label}</strong><b>{status}</b>
            </article>
          ))}
        </div>
        <p>{item.finding}</p>
      </section>
    </div>
  );
}

const hallucinationCases = [
  {
    label: "Unsupported",
    claim: "The department adopted this policy in 2024.",
    evidence: "The supplied documents never mention adoption.",
    disposition: "not verified",
  },
  {
    label: "Contradicted",
    claim: "The submission deadline is October 12.",
    evidence: "The official notice states October 2.",
    disposition: "contradicted",
  },
  {
    label: "Misattributed",
    claim: "The study was written by Russell and Norvig.",
    evidence: "The DOI record lists different authors.",
    disposition: "contradicted",
  },
  {
    label: "Overgeneralized",
    claim: "The model works for every age group.",
    evidence: "The evaluation included only college students.",
    disposition: "not verified",
  },
];

function HallucinationTaxonomy() {
  const [active, setActive] = useState(0);
  const item = hallucinationCases[active];
  return (
    <div className="m20-taxonomy">
      <nav aria-label="Hallucination cases">
        {hallucinationCases.map((entry, index) => (
          <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <article><span>Atomic claim</span><p>{item.claim}</p></article>
        <article><span>Available evidence</span><p>{item.evidence}</p></article>
        <strong className={item.disposition.replace(" ", "-")}>{item.disposition}</strong>
      </section>
    </div>
  );
}

type AuditLabel = "unreviewed" | "supported" | "contradicted" | "not verified";

const auditClaims = [
  {
    claim: "TruthfulQA contains 817 questions across 38 categories.",
    source: "TruthfulQA paper and dataset description",
    correct: "supported" as AuditLabel,
  },
  {
    claim: "A high TruthfulQA score proves a model is truthful in all domains.",
    source: "No bounded benchmark can establish a universal claim",
    correct: "contradicted" as AuditLabel,
  },
  {
    claim: "Every preference rater used the same internal standard.",
    source: "No rater-level agreement evidence has been supplied",
    correct: "not verified" as AuditLabel,
  },
];

function ClaimAuditLab() {
  const [labels, setLabels] = useState<AuditLabel[]>(auditClaims.map(() => "unreviewed"));
  const [showKey, setShowKey] = useState(false);
  const setLabel = (index: number, label: AuditLabel) => {
    setLabels(previous => previous.map((value, row) => row === index ? label : value));
  };

  return (
    <div className="m20-claim-audit">
      <div role="table" aria-label="Claim verification table">
        {auditClaims.map((item, index) => (
          <article key={item.claim} role="row">
            <div><span>Claim {index + 1}</span><p>{item.claim}</p><small>{item.source}</small></div>
            <select
              aria-label={`Disposition for claim ${index + 1}`}
              onChange={event => setLabel(index, event.target.value as AuditLabel)}
              value={labels[index]}
            >
              <option value="unreviewed">choose…</option>
              <option value="supported">supported</option>
              <option value="contradicted">contradicted</option>
              <option value="not verified">not verified</option>
            </select>
            {showKey && <b className={labels[index] === item.correct ? "correct" : "incorrect"}>{labels[index] === item.correct ? "✓" : `Answer: ${item.correct}`}</b>}
          </article>
        ))}
      </div>
      <button onClick={() => setShowKey(value => !value)} type="button">{showKey ? "Hide key" : "Check dispositions"}</button>
    </div>
  );
}

const verificationMethods = [
  {
    label: "Citation",
    question: "Who said it, where, and in what context?",
    test: "Open the primary source; locate the exact supporting passage.",
    failure: "A real URL can still fail to support the nearby sentence.",
  },
  {
    label: "Calculation",
    question: "Does the numerical result follow from the inputs?",
    test: "Recompute with a calculator, script, spreadsheet, or unit check.",
    failure: "Correct prose formatting does not validate arithmetic.",
  },
  {
    label: "Code",
    question: "Does the program exhibit the claimed behavior?",
    test: "Run an executable test with controlled inputs and expected outputs.",
    failure: "Reading generated code is weaker evidence than executing it.",
  },
  {
    label: "Current fact",
    question: "Is the fact true at the relevant time?",
    test: "Check a dated authoritative source and record retrieval time.",
    failure: "Model training data and confident phrasing can both be stale.",
  },
];

function VerificationMethodLab() {
  const [active, setActive] = useState(0);
  const item = verificationMethods[active];
  return (
    <div className="m20-method-lab">
      <nav aria-label="Verification methods">
        {verificationMethods.map((entry, index) => (
          <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <h3>{item.question}</h3>
        <article><span>Executable check</span><p>{item.test}</p></article>
        <article className="warning"><span>Common failure</span><p>{item.failure}</p></article>
      </section>
    </div>
  );
}

const riskCases = [
  { label: "Movie suggestion", impact: 1, reversibility: 4, verification: "Sample and disclose uncertainty", action: "answer" },
  { label: "Course prerequisite", impact: 2, reversibility: 3, verification: "Check the current catalog", action: "verify first" },
  { label: "Medication interaction", impact: 4, reversibility: 1, verification: "Use an authoritative medical source and professional review", action: "escalate" },
  { label: "Emergency symptoms", impact: 5, reversibility: 1, verification: "Do not delay emergency guidance for model completion", action: "refuse / escalate" },
];

function RiskRouter() {
  const [active, setActive] = useState(1);
  const item = riskCases[active];
  return (
    <div className="m20-risk-router">
      <nav aria-label="Risk routing cases">
        {riskCases.map((entry, index) => (
          <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <div className="m20-risk-meter">
          <article><span>Potential impact</span><i><em style={{ width: `${item.impact * 20}%` }} /></i><b>{item.impact}/5</b></article>
          <article><span>Reversibility</span><i><em style={{ width: `${item.reversibility * 20}%` }} /></i><b>{item.reversibility}/5</b></article>
        </div>
        <p><span>Required evidence</span>{item.verification}</p>
        <strong>{item.action}</strong>
      </section>
    </div>
  );
}

function LossVisual() {
  const [choice, setChoice] = useState(0);
  const options = [
    { token: "blue", probability: 0.62 },
    { token: "green", probability: 0.23 },
    { token: "bright", probability: 0.1 },
    { token: "cold", probability: 0.05 },
  ];
  const selected = options[choice];
  const loss = useMemo(() => -Math.log(selected.probability), [selected]);
  return (
    <div className="m20-loss-visual">
      <section>
        <span>Training sequence</span>
        <div><i>The</i><i>sky</i><i>is</i><b>blue</b></div>
        <p>At this position, the observed target token is <strong>blue</strong>.</p>
      </section>
      <section>
        <span>Inspect a predicted probability</span>
        <nav>
          {options.map((option, index) => (
            <button className={index === choice ? "active" : ""} key={option.token} onClick={() => setChoice(index)} type="button">
              {option.token} · {option.probability}
            </button>
          ))}
        </nav>
        <code>loss = −log p({selected.token}) = {loss.toFixed(3)}</code>
        <p>{selected.token === "blue" ? "Higher probability on the observed target lowers this position’s loss." : "This token was not the observed target; its probability matters through normalization."}</p>
      </section>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 13 · Lesson 20",
    title: "From fluent continuation to verified output",
    subtitle: "LLM training, inference, structured outputs, hallucination, and risk-based verification.",
    content: (
      <div className="m20-cover">
        <section>
          <span>Central question</span>
          <h3>What evidence turns a plausible model output into a usable answer?</h3>
          <p>We will connect the training objective to the output’s strengths—and to the checks the objective does not perform.</p>
        </section>
        <div className="m20-cover-flow" aria-label="Training to verification flow">
          <article><span>01</span><strong>Train</strong><small>predict continuations</small></article>
          <i>→</i>
          <article><span>02</span><strong>Generate</strong><small>sample an output</small></article>
          <i>→</i>
          <article><span>03</span><strong>Validate</strong><small>structure + meaning</small></article>
          <i>→</i>
          <article><span>04</span><strong>Verify</strong><small>claims + evidence</small></article>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Open with the central question and preview the four-stage flow. Ask students which arrow they think is most often skipped.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning objectives",
    title: "Explain, distinguish, validate, audit, and route",
    content: (
      <div className="m20-objectives">
        {[
          ["Explain", "how next-token pretraining and sampling produce text"],
          ["Distinguish", "pretraining, instruction tuning, preference optimization, and evaluation"],
          ["Validate", "syntax, schema, semantics, and factual support separately"],
          ["Audit", "atomic claims against authoritative evidence or executable tests"],
          ["Route", "answer, verify, abstain, refuse, or escalate according to risk"],
        ].map(([verb, detail], index) => (
          <article key={verb}><span>{String(index + 1).padStart(2, "0")}</span><strong>{verb}</strong><p>{detail}</p></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Have students paraphrase the difference between validate and verify. Use these objectives as the exit-ticket rubric.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 · Pretraining objective",
    title: "A language model learns to assign probability to the next token",
    content: (
      <div className="m20-equation-layout">
        <section>
          <span>Autoregressive factorization</span>
          <code>p(x₁, …, xₙ) = ∏ᵢ p(xᵢ | x₁, …, xᵢ₋₁)</code>
          <p>The transformer produces logits for the vocabulary at every position. Softmax converts them to a distribution.</p>
        </section>
        <div>
          <article><span>Input</span><strong>previous tokens</strong><p>the context window available at that position</p></article>
          <article><span>Target</span><strong>observed next token</strong><p>one token from the training sequence</p></article>
          <article><span>Update</span><strong>reduce cross-entropy loss</strong><p>increase probability assigned to observed continuations</p></article>
          <article className="warning"><span>Not in the objective</span><strong>truth checking</strong><p>no automatic database lookup, citation audit, or proof step</p></article>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Read the factorization left to right. Connect it to Meeting 19’s causal mask: each prediction can use only preceding tokens.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked example · Cross-entropy",
    title: "The loss rewards probability on the observed continuation",
    content: <LossVisual />,
    note: "Timing: 3 minutes. Select blue, compute −ln(0.62), then select another token. Clarify that training loss is evaluated against the observed target, not against every merely plausible continuation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Inference and temperature",
    title: "Generation repeatedly samples one token, appends it, and predicts again",
    content: <SamplingLab />,
    note: "Timing: 4 minutes. Toggle all three temperatures. Probabilities are illustrative, not outputs from a live model. Ask why temperature cannot repair an incorrect underlying distribution.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 · Scaling evidence",
    title: "Model loss follows empirical trends with parameters, data, and compute",
    content: (
      <div className="m20-scaling-figure">
        <section>
          <span>Scaling-law question</span>
          <h3>If we increase resources, how predictably does validation loss change?</h3>
          <p>Kaplan et al. measured approximate power-law relations over specific model families and training regimes.</p>
        </section>
        <div aria-label="Illustrative log-log scaling curves">
          <i className="axis-y">loss</i>
          <i className="curve curve-a" />
          <i className="curve curve-b" />
          <i className="curve curve-c" />
          <span className="axis-x">resource on a log scale →</span>
          <b className="label-a">parameters</b>
          <b className="label-b">data</b>
          <b className="label-c">compute</b>
        </div>
        <aside>Empirical regularity ≠ unlimited extrapolation, capability guarantee, or safety guarantee.</aside>
      </div>
    ),
    note: "Timing: 3 minutes. Emphasize empirical fit and scope. Do not derive exponents. Ask students what must stay comparable before extrapolating a curve.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Compute allocation",
    title: "A fixed training budget must balance model size and training data",
    content: <ScalingLab />,
    note: "Timing: 4 minutes. Compare parameter-heavy and balanced cases. Introduce Hoffmann et al.’s result conceptually: larger parameter count alone can leave a model undertrained.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 4 · Training pipeline",
    title: "Post-training changes elicited behavior by changing the learning signal",
    content: <TrainingPipeline />,
    note: "Timing: 2 minutes. Click through the four stages rapidly. Keep each stage’s learning signal distinct; evaluation measures behavior but does not itself update the model.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked trace · One request",
    title: "The same example plays different roles across training stages",
    content: (
      <div className="m20-example-trace">
        <header><span>User request</span><strong>“Explain photosynthesis to a ten-year-old.”</strong></header>
        <div>
          <article><span>Pretraining</span><p>Predict tokens in pages that happen to discuss photosynthesis.</p><small>target: corpus continuation</small></article>
          <article><span>Instruction tuning</span><p>Learn from a demonstrated age-appropriate answer paired with the request.</p><small>target: demonstration</small></article>
          <article><span>Preference</span><p>Compare two candidate answers using a clarity-and-accuracy rubric.</p><small>target: relative rating</small></article>
          <article><span>Evaluation</span><p>Score a held-out response for correctness, age fit, and unsupported claims.</p><small>target: measured evidence</small></article>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Trace the one request through all stages. Ask what additional evaluation would be needed for an audience age five and up.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Preference depends on a rubric",
    title: "A preference label is evidence about raters and criteria—not universal truth",
    content: <PreferenceLab />,
    note: "Timing: 4 minutes. Toggle the rubric and note the winner changes. Discuss coverage, disagreement, and whose preferences are represented. Do not imply this toy choice models a production optimization algorithm.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 5 · Alignment boundary",
    title: "Instruction following, preference, and truthfulness are different properties",
    content: (
      <div className="m20-venn">
        <article className="helpful"><strong>Helpful</strong><p>addresses the user’s request</p></article>
        <article className="preferred"><strong>Preferred</strong><p>scores well under a comparison rubric</p></article>
        <article className="truthful"><strong>Truthful</strong><p>avoids false claims relative to evidence</p></article>
        <aside>
          <span>Possible outputs</span>
          <p><b>Helpful + false:</b> confidently answers with invented details.</p>
          <p><b>True + unhelpful:</b> states a fact but ignores the request.</p>
          <p><b>Preferred + limited:</b> fits raters’ rubric but misses an untested group.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to place a polished but fabricated citation in the diagram. Explain why alignment evidence must name the evaluated property.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 6 · Truthfulness evaluation",
    title: "Fluency can reproduce common misconceptions",
    content: (
      <div className="m20-truthfulqa">
        <section>
          <span>TruthfulQA motivation</span>
          <blockquote>Can a model avoid imitating false answers that people commonly repeat?</blockquote>
          <p>The benchmark contains adversarially selected questions across multiple categories. It operationalizes one bounded truthfulness test.</p>
        </section>
        <div>
          <article><span>Measure</span><strong>truthfulness + informativeness</strong><p>not surface fluency alone</p></article>
          <article><span>Evidence</span><strong>817 questions · 38 categories</strong><p>a finite evaluation set</p></article>
          <article className="warning"><span>Do not conclude</span><strong>“truthful everywhere”</strong><p>benchmark performance does not establish a universal property</p></article>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Use TruthfulQA to illustrate operationalization: define a behavior, build items, score outcomes, state scope. Avoid treating the benchmark as a complete truth detector.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 7 · Structured outputs",
    title: "Constrained decoding can enforce a shape while leaving values unchecked",
    content: (
      <div className="m20-schema-concept">
        <section>
          <span>Example JSON Schema</span>
          <code>{`{
  "type": "object",
  "required": ["city", "temperature_f"],
  "properties": {
    "city": { "type": "string" },
    "temperature_f": { "type": "number" }
  }
}`}</code>
        </section>
        <div>
          <article><span>JSON mode</span><strong>syntactically valid JSON</strong></article>
          <i>→</i>
          <article><span>Schema constrained</span><strong>allowed fields, types, and structure</strong></article>
          <i>→</i>
          <article className="warning"><span>Still required</span><strong>semantic and factual validation</strong></article>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Read the small schema. Explain constrained decoding conceptually: disallowed next tokens can be masked according to the schema state. Keep implementation details out of scope.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Four validation layers",
    title: "Valid JSON, schema-valid data, meaningful values, and supported facts differ",
    content: <ValidationStackLab />,
    note: "Timing: 4 minutes. Move through malformed, wrong-type, impossible, and plausible-but-unsupported outputs. Require students to name the first layer that catches each case.",
    sourceSlides: [],
  },
  {
    eyebrow: "Practice · Design a contract",
    title: "A schema is an interface contract, not a knowledge guarantee",
    content: (
      <div className="m20-contract-practice">
        <section>
          <span>Task</span>
          <h3>Return an evidence-card claim review</h3>
          <p>Choose fields and constraints that make downstream checking safer.</p>
        </section>
        <div>
          <article><input aria-label="Claim field selected" defaultChecked type="checkbox" /><strong>claim</strong><p>non-empty string</p></article>
          <article><input aria-label="Disposition field selected" defaultChecked type="checkbox" /><strong>disposition</strong><p>supported | contradicted | not_verified</p></article>
          <article><input aria-label="Evidence field selected" defaultChecked type="checkbox" /><strong>evidence</strong><p>source ID + excerpt location</p></article>
          <article><input aria-label="Confidence field selected" type="checkbox" /><strong>confidence</strong><p>optional estimate; never substitutes for evidence</p></article>
        </div>
        <aside><strong>Discuss:</strong> Which constraints are structural? Which require domain code? Which require opening the source?</aside>
      </div>
    ),
    note: "Timing: 3 minutes. Give pairs 90 seconds to improve the contract, then classify each check as schema, semantic, or factual. Connect to the evidence-card work later in the course without entering RAG implementation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 8 · Hallucination",
    title: "Define the failure relative to a claim, task, and evidence set",
    content: (
      <div className="m20-definition">
        <blockquote>
          An output claim is a verification failure when it is <strong>unsupported</strong>, <strong>contradicted</strong>, or <strong>not verifiable</strong> with the evidence required by the task.
        </blockquote>
        <div>
          <article><span>Unsupported</span><p>No supplied evidence entails the claim.</p></article>
          <article><span>Contradicted</span><p>Relevant evidence supports an incompatible claim.</p></article>
          <article><span>Not verified</span><p>Evidence is absent, inaccessible, ambiguous, or too weak.</p></article>
        </div>
        <p className="m20-definition-note">A useful label states the comparison standard. “The model hallucinated” alone does not tell a reviewer what failed.</p>
      </div>
    ),
    note: "Timing: 2 minutes. Distinguish not verified from false. A reviewer may lack enough evidence to decide, and that uncertainty must survive into the disposition.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Hallucination taxonomy",
    title: "Different surface errors can share the same verification disposition",
    content: <HallucinationTaxonomy />,
    note: "Timing: 3 minutes. Click all four cases. Ask whether misattribution is a separate taxonomy category, a contradicted claim, or both; categories describe failure form while dispositions record evidence status.",
    sourceSlides: [],
  },
  {
    eyebrow: "Practice · Atomic claims",
    title: "Verification begins by splitting prose into checkable units",
    content: (
      <div className="m20-atomize">
        <section>
          <span>Generated sentence</span>
          <blockquote>“TruthfulQA was published at ACL 2022, has 817 questions, and proves aligned models do not hallucinate.”</blockquote>
        </section>
        <div>
          <article><span>Claim 1</span><p>TruthfulQA was published at ACL 2022.</p><b>check venue record</b></article>
          <article><span>Claim 2</span><p>TruthfulQA has 817 questions.</p><b>check paper / dataset</b></article>
          <article><span>Claim 3</span><p>TruthfulQA proves aligned models do not hallucinate.</p><b>test logical scope</b></article>
        </div>
        <aside>One citation after a compound sentence does not automatically support every clause.</aside>
      </div>
    ),
    note: "Timing: 4 minutes. Students atomize before revealing the three cards. Ask what evidence type is appropriate for each and why Claim 3 overreaches the benchmark.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 9 · Verification protocol",
    title: "A defensible review records claim, evidence, procedure, and disposition",
    content: (
      <div className="m20-protocol">
        {[
          ["1", "Claim", "one proposition precise enough to test"],
          ["2", "Evidence", "an authoritative source or executable test"],
          ["3", "Procedure", "how evidence was compared with the claim"],
          ["4", "Disposition", "supported, contradicted, or not verified"],
          ["5", "Revision", "correct, qualify, cite, abstain, or escalate"],
        ].map(([number, label, detail]) => (
          <article key={number}><span>{number}</span><strong>{label}</strong><p>{detail}</p></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Stress reproducibility: another reviewer should be able to repeat the comparison. Confidence without procedure is not verification evidence.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Choose an executable check",
    title: "Different claim types require different verification procedures",
    content: <VerificationMethodLab />,
    note: "Timing: 3 minutes. Cycle through citation, calculation, code, and current fact. Ask students to propose an authoritative source and a failure condition for each.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment · Claim audit",
    title: "Assign a disposition only after comparing claim and evidence",
    content: <ClaimAuditLab />,
    note: "Timing: 3 minutes. Students classify independently, compare in pairs, then reveal. The second item tests scope; the third tests the difference between absence of evidence and contradiction.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 10 · Uncertainty behavior",
    title: "Abstention is an output policy to evaluate—not guaranteed self-knowledge",
    content: (
      <div className="m20-abstention">
        <section>
          <span>Three distinct signals</span>
          <article><strong>Token probability</strong><p>uncertainty over continuations at a decoding step</p></article>
          <article><strong>Verbal confidence</strong><p>generated language such as “I am 90% sure”</p></article>
          <article><strong>Empirical calibration</strong><p>observed accuracy among cases assigned similar confidence</p></article>
        </section>
        <div>
          <h3>Evaluate the behavior</h3>
          <p>On answerable and unanswerable test cases, measure when the system answers, abstains, cites limits, or escalates.</p>
          <code>coverage = answered cases / all cases</code>
          <code>selective risk = error among answered cases</code>
          <aside>Lower coverage may reduce error—but only if abstention is routed to a useful next step.</aside>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Keep internal-state claims modest. A model’s verbal confidence is another generated output and must be calibrated empirically.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Risk-based routing",
    title: "Required evidence rises with impact and irreversibility",
    content: <RiskRouter />,
    note: "Timing: 3 minutes. Compare the four cases. Ask why a refusal without escalation can still be unhelpful in a high-risk context.",
    sourceSlides: [],
  },
  {
    eyebrow: "Synthesis · End-to-end worked case",
    title: "A safe output pipeline makes every boundary explicit",
    content: (
      <div className="m20-end-to-end">
        <section>
          <span>Task</span>
          <h3>Summarize one research result as evidence for a public-facing AI literacy card.</h3>
        </section>
        <div>
          <article><span>1 · Generate</span><p>Request atomic claims and source IDs in a defined schema.</p></article>
          <article><span>2 · Parse</span><p>Reject malformed or schema-incompatible output.</p></article>
          <article><span>3 · Validate</span><p>Check required fields, value ranges, and allowed dispositions.</p></article>
          <article><span>4 · Verify</span><p>Open the paper; compare each claim with methods and results.</p></article>
          <article><span>5 · Communicate</span><p>Revise unsupported language and preserve limitations.</p></article>
        </div>
        <aside>Structured generation organizes review. It does not replace reading the research evidence.</aside>
      </div>
    ),
    note: "Timing: 2 minutes. Have students identify which steps can be automated and which still require domain judgment. Stop before retrieval-system design; that begins in Meeting 21.",
    sourceSlides: [],
  },
  {
    eyebrow: "Exit assessment · Readings",
    title: "Fluency raises the burden of verification when it hides weak evidence",
    content: (
      <div className="m20-exit">
        <section>
          <span>Exit ticket · Submit before leaving</span>
          <ol>
            <li>Why does next-token training not guarantee truth?</li>
            <li>A response is schema-valid but names the wrong deadline. Which checks passed, and which failed?</li>
            <li>Why can a more fluent answer require more—not less—verification?</li>
          </ol>
        </section>
        <section>
          <span>Current primary-source reading set</span>
          <ul>
            <li><a href="https://arxiv.org/abs/2001.08361" rel="noreferrer" target="_blank">Kaplan et al. · Scaling Laws for Neural Language Models</a></li>
            <li><a href="https://deepmind.google/blog/an-empirical-analysis-of-compute-optimal-large-language-model-training/" rel="noreferrer" target="_blank">Hoffmann et al. · Compute-optimal training summary</a></li>
            <li><a href="https://arxiv.org/abs/2203.02155" rel="noreferrer" target="_blank">Ouyang et al. · Instruction following with human feedback</a></li>
            <li><a href="https://aclanthology.org/2022.acl-long.229/" rel="noreferrer" target="_blank">Lin et al. · TruthfulQA</a></li>
            <li><a href="https://openai.com/index/introducing-structured-outputs-in-the-api/" rel="noreferrer" target="_blank">OpenAI · Structured Outputs implementation case</a></li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Collect the three-part exit ticket. All 25 planned timings total 75 minutes. Assign the primary readings by question rather than asking students to read every implementation detail.",
    sourceSlides: [],
  },
];

export function Meeting20Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Module 13 · Lesson 20"
      meetingTitle="LLM Training, Structured Outputs, and Verification"
      slides={slides}
      sourceCollectionLabel="Current primary-source reading set"
    />
  );
}
