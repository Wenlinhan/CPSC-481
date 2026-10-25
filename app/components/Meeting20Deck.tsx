"use client";

import { useMemo, useState, type ReactNode } from "react";
import "../styles/meeting20.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

type SamplingTemperature = "0.3" | "1.0" | "1.8";

function NotationGuide({ items }: { items: Array<[string, string]> }) {
  return (
    <aside className="m20-notation-guide" aria-label="Notation used on this page">
      <strong>Notation on this page</strong>
      <div>{items.map(([symbol, meaning]) => <span key={`${symbol}-${meaning}`}><b>{symbol}</b> = {meaning}</span>)}</div>
    </aside>
  );
}

function WithNotation({ children, items }: { children: ReactNode; items: Array<[string, string]> }) {
  return <div className="m20-with-notation"><div className="m20-notation-content">{children}</div><NotationGuide items={items} /></div>;
}

const llmArchitectureStages = [
  { label: "Tokenize", owner: "runtime", detail: "Split the prompt into vocabulary IDs. The tokenizer is fixed for this model family.", artifact: "token IDs" },
  { label: "Embed", owner: "model", detail: "Look up learned token vectors and add position information.", artifact: "input states" },
  { label: "Transformer x N", owner: "model", detail: "Masked attention and feed-forward layers repeatedly update every position's state.", artifact: "contextual states" },
  { label: "LM head", owner: "model", detail: "Project the final state to one score (logit) for every vocabulary token.", artifact: "vocabulary logits" },
  { label: "Sample", owner: "runtime", detail: "Softmax, temperature, top-k, or top-p turn scores into a next-token choice.", artifact: "one next token" },
  { label: "Append + repeat", owner: "runtime", detail: "Add that token to the sequence and run the same path again until stopping.", artifact: "generated sequence" },
] as const;

function LLMArchitectureStudio() {
  const [active, setActive] = useState(0);
  const item = llmArchitectureStages[active];
  return (
    <div className="m20-llm-studio">
      <div className="m20-llm-boundaries">
        <span className="runtime">Runtime input</span><span className="model">Inside the learned LLM</span><span className="runtime">Runtime decoding</span>
      </div>
      <div className="m20-llm-flow" aria-label="Complete autoregressive language model architecture">
        {llmArchitectureStages.map((stage, index) => (
          <div className="m20-llm-node-wrap" key={stage.label}>
            <button className={`${stage.owner} ${active === index ? "active" : ""}`} onClick={() => setActive(index)} type="button">
              <small>{index + 1}</small><strong>{stage.label}</strong><span>{stage.artifact}</span>
            </button>
            {index < llmArchitectureStages.length - 1 && <i aria-hidden="true">&#8594;</i>}
          </div>
        ))}
        <b className="m20-repeat-arrow">next token loops back into the sequence &#8634;</b>
      </div>
      <section className={item.owner}>
        <div><span>{item.owner === "model" ? "learned parameters" : "inference-time operation"}</span><h3>{item.label}</h3></div>
        <p>{item.detail}</p>
        <aside><strong>Training objective</strong><code>p(sequence) = product of p(next token | previous tokens)</code><small>Fluent prediction does not add a truth-checking step.</small></aside>
      </section>
    </div>
  );
}

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

function TrustTheAnswerDemo() {
  const [selected, setSelected] = useState<"fluent" | "grounded" | null>(null);
  return (
    <div className="m20-trust-demo">
      <span>Which answer can you actually use?</span>
      <p className="m20-trust-prompt">Question: What must the research brief include?</p>
      <div className="m20-trust-cards">
        <button aria-pressed={selected === "fluent"} onClick={() => setSelected("fluent")} type="button">
          <i aria-hidden="true">✨</i><strong>Answer A</strong>
          <p>It should be polished, persuasive, and about five pages long.</p>
          <small>Fluent - no evidence shown</small>
        </button>
        <button aria-pressed={selected === "grounded"} onClick={() => setSelected("grounded")} type="button">
          <i aria-hidden="true">🔗</i><strong>Answer B</strong>
          <p>Include source trace, methods, findings, limitations, and supported-versus-unsupported claims.</p>
          <small>Linked to assignment instructions [D3]</small>
        </button>
      </div>
      <div className={`m20-trust-verdict ${selected ? "shown" : ""}`} aria-live="polite">
        {!selected && <><strong>Choose before revealing.</strong><small>Style is visible immediately; support requires a source check.</small></>}
        {selected === "fluent" && <><strong>Not usable yet.</strong><small>Answer A sounds confident, but its length claim is unsupported.</small></>}
        {selected === "grounded" && <><strong>Better - and still verify the link.</strong><small>Answer B exposes the evidence needed to check each requirement.</small></>}
      </div>
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
    title: "A fluent answer is not automatically a trustworthy answer",
    subtitle: "LLM training, inference, structured outputs, hallucination, and risk-based verification.",
    content: (
      <div className="m20-cover">
        <section>
          <span>Start with a decision</span>
          <h3>A polished answer appears in one second. What makes it trustworthy?</h3>
          <p>Compare fluency with evidence first. Then connect that difference to training, generation, validation, and verification.</p>
        </section>
        <TrustTheAnswerDemo />
      </div>
    ),
    note: "Timing: 2 minutes. Students choose an answer before the verdict appears. Ask which visual cue influenced them, then separate polish, structural validity, and evidence support. The lesson will explain why each needs a different mechanism.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning objectives",
    title: "By the end, you can explain how an LLM generates and how to check its output",
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
    title: "An LLM predicts one token at a time",
    content: <WithNotation items={[["p", "probability assigned by the model"], ["N", "number of transformer layers"], ["logit", "raw score for one vocabulary token"], ["|", "given the tokens that came before"]]}><LLMArchitectureStudio /></WithNotation>,
    note: "Timing: 3 minutes. Read the factorization left to right. Connect it to Meeting 19’s causal mask: each prediction can use only preceding tokens.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked example · Cross-entropy",
    title: "Training loss falls when the observed next token gets more probability",
    content: <WithNotation items={[["p(target)", "probability assigned to the observed next token"], ["−log", "negative natural logarithm"], ["loss", "penalty minimized during training"]]}><LossVisual /></WithNotation>,
    note: "Timing: 3 minutes. Select blue, compute −ln(0.62), then select another token. Clarify that training loss is evaluated against the observed target, not against every merely plausible continuation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Inference and temperature",
    title: "Generation repeats three steps: predict, choose, and append",
    content: <WithNotation items={[["T", "sampling temperature"], ["T < 1", "sharper distribution with less variation"], ["T > 1", "flatter distribution with more variation"]]}><SamplingLab /></WithNotation>,
    note: "Timing: 4 minutes. Toggle all three temperatures. Probabilities are illustrative, not outputs from a live model. Ask why temperature cannot repair an incorrect underlying distribution.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 · Scaling evidence",
    title: "More parameters, data, and compute often lower loss in predictable trends",
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
    title: "A fixed compute budget must be divided between model size and training data",
    content: <ScalingLab />,
    note: "Timing: 4 minutes. Compare parameter-heavy and balanced cases. Introduce Hoffmann et al.’s result conceptually: larger parameter count alone can leave a model undertrained.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 4 · Training pipeline",
    title: "Post-training changes behavior by changing examples and feedback",
    content: <TrainingPipeline />,
    note: "Timing: 2 minutes. Click through the four stages rapidly. Keep each stage’s learning signal distinct; evaluation measures behavior but does not itself update the model.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked trace · One request",
    title: "One request can be used in four different ways",
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
    title: "A preference label depends on the raters and their rubric",
    content: <PreferenceLab />,
    note: "Timing: 4 minutes. Toggle the rubric and note the winner changes. Discuss coverage, disagreement, and whose preferences are represented. Do not imply this toy choice models a production optimization algorithm.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 5 · Alignment boundary",
    title: "Helpful, preferred, and truthful are not the same property",
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
    title: "A fluent model can repeat popular falsehoods",
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
    title: "A schema can enforce structure, but it cannot guarantee truth",
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
    title: "A schema tells software what shape to expect—not whether the facts are right",
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
    title: "Define hallucination by the evidence check that failed",
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
    title: "Different-looking errors can receive the same evidence label",
    content: <HallucinationTaxonomy />,
    note: "Timing: 3 minutes. Click all four cases. Ask whether misattribution is a separate taxonomy category, a contradicted claim, or both; categories describe failure form while dispositions record evidence status.",
    sourceSlides: [],
  },
  {
    eyebrow: "Practice · Atomic claims",
    title: "Break a response into separate claims before checking it",
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
    title: "A reproducible review records the claim, evidence, method, and result",
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
    title: "Match the verification method to the type of claim",
    content: <VerificationMethodLab />,
    note: "Timing: 3 minutes. Cycle through citation, calculation, code, and current fact. Ask students to propose an authoritative source and a failure condition for each.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment · Claim audit",
    title: "Compare the evidence before assigning a result",
    content: <ClaimAuditLab />,
    note: "Timing: 3 minutes. Students classify independently, compare in pairs, then reveal. The second item tests scope; the third tests the difference between absence of evidence and contradiction.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 10 · Uncertainty behavior",
    title: "Abstention must be tested like any other system behavior",
    content: (
      <WithNotation items={[["coverage", "fraction of all cases the system answers"], ["selective risk", "error rate among the cases it answered"]]}>
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
      </WithNotation>
    ),
    note: "Timing: 3 minutes. Keep internal-state claims modest. A model’s verbal confidence is another generated output and must be calibrated empirically.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo · Risk-based routing",
    title: "Higher-risk decisions require stronger evidence",
    content: <RiskRouter />,
    note: "Timing: 3 minutes. Compare the four cases. Ask why a refusal without escalation can still be unhelpful in a high-risk context.",
    sourceSlides: [],
  },
  {
    eyebrow: "Synthesis · End-to-end worked case",
    title: "A safe pipeline separates generation, validation, and verification",
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
    title: "Fluent writing can hide weak evidence, so it still needs verification",
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

const lesson20InstructorNotes = [
  `Let us start with a practical question: if an answer appears instantly and sounds polished, what makes it trustworthy? Choose between the two sample answers before revealing the evidence. Many people are drawn to confident wording, detail, and professional formatting. Those cues can make an answer easier to read, but they do not show that its claims are supported. Today we will separate three ideas that are often mixed together. Fluency means the text reads smoothly. Structural validity means the output follows a requested format. Verification means its claims have been compared with appropriate evidence or tests. A system may succeed at one and fail at the others. This opening choice gives us the central problem of the lesson: language-model training is designed to produce likely continuations, while trustworthiness requires additional validation, evidence, and risk-aware decision rules.`,
  `Here is what you should be able to do by the end of the lesson. First, explain how next-token training and repeated decoding produce a response. Second, distinguish pretraining from instruction tuning, preference optimization, and evaluation. Third, separate syntax checks, schema checks, semantic checks, and factual verification. Fourth, break a response into atomic claims and match each claim with an authoritative source or executable test. Finally, choose whether a system should answer, verify, abstain, refuse, or escalate based on risk. Notice the difference between validate and verify. Validation often asks whether data obeys a rule or contract. Verification asks whether a claim is supported by evidence. We need both, but they solve different problems. The exit ticket will ask you to apply these distinctions rather than merely define the terms.`,
  `This diagram shows the complete loop for one generated token. The runtime first tokenizes the prompt into IDs. The model looks up embeddings and sends the resulting states through N transformer layers. Here N means the number of repeated layers. The language-model head converts the final state into one logit, or raw score, for every vocabulary token. The runtime turns those scores into probabilities and chooses one token. That token is appended to the sequence, and the entire process repeats. In the notation strip, p means probability and the vertical bar means “given the earlier tokens.” The training objective multiplies the conditional probabilities of all observed tokens in a sequence. The crucial boundary is that this objective rewards prediction of text, not a separate check of whether every statement is true. Fluency emerges from learned continuation patterns; verification must be added elsewhere.`,
  `Cross-entropy loss tells the model how much probability it assigned to the observed next token. The formula is negative log p of the target. If the observed token is “blue” and the model assigns it probability 0.62, the loss is about 0.48. Increasing the target probability lowers the loss. Select a different token and notice that it was not the observed target for this training position. Its probability still matters indirectly because all token probabilities share a normalization, but the direct loss is computed from the target token. This does not mean every alternative continuation is meaningless. It means supervised next-token training has one recorded continuation at each position. The model updates its parameters to make observed continuations more probable across many examples. Also remember that lower training loss does not automatically mean better factual reliability on every task; it measures performance on the specified prediction objective and data.`,
  `At inference time, the model does not produce a whole paragraph in one step. It predicts a probability distribution for the next token, chooses one token, appends it, and predicts again. Temperature T changes the shape of that distribution. When T is below one, the distribution becomes sharper and repeated outputs are more similar. When T is above one, the distribution becomes flatter, so lower-ranked alternatives are selected more often. Toggle the three examples and compare both the bars and the sample tokens. These probabilities are illustrative, but the mechanism is accurate. Temperature changes variation; it does not correct the underlying knowledge. If the model gives an incorrect token the highest score, lowering temperature may make that error more consistent. Raising temperature may produce more variety, but it also increases the chance of weak alternatives. Decoding controls behavior at selection time, not factual truth.`,
  `Scaling laws describe empirical trends between validation loss and resources such as model parameters, training data, and compute. On a log-log graph, the measured curves often look approximately like power laws over a particular range. The visual shows the general idea: adding a resource tends to reduce loss, but with diminishing improvement. Treat this as evidence about measured model families and training regimes, not a law that guarantees unlimited progress. To compare or extrapolate curves responsibly, we must keep the model family, data quality, optimization method, and evaluation definition sufficiently comparable. A lower language-model loss also does not directly prove a specific capability, truthfulness, or safety property. Scaling can make prediction more accurate on average while leaving important failure modes. The correct claim is bounded: within the studied regime, loss followed a useful empirical trend that helped researchers reason about resource allocation.`,
  `A fixed compute budget creates a tradeoff between model size and the amount of training data. Use the controls to compare the parameter-heavy, data-heavy, and balanced cases. A very large model trained on too few tokens may be undertrained: it has capacity, but not enough learning signal to use that capacity well. A very large dataset also cannot be fully exploited if the model or compute budget is too small. Compute-optimal training asks how to allocate a fixed budget so model capacity and training tokens grow together. The bars are conceptual, not a recipe for a particular production model. The important correction is that parameter count alone is not a complete measure of training quality. When someone says one model is “bigger,” ask whether it also received enough appropriate data and optimization compute, and whether the comparison uses the same evaluation conditions.`,
  `This pipeline separates four stages that are often described as if they were one training process. Pretraining predicts the next token across a large corpus. Instruction tuning learns from prompt-response demonstrations so requested behavior becomes easier to elicit. Preference optimization uses comparisons under a rubric to favor responses raters prefer. Evaluation measures behavior on held-out tasks or with human review. Click through the stages and read the learning signal in each one. Evaluation is different because it normally measures the model rather than updating it. Each stage has limits. Pretraining does not guarantee instruction following or truth. Instruction examples cannot cover every request. Preference data represents particular raters and criteria, not one universal value function. Evaluation supports claims only within the tested tasks and deployment conditions. Keeping the learning signals separate helps us avoid vague statements such as “the model was aligned” without saying how or for what property.`,
  `The same photosynthesis request can play four different roles. During pretraining, the model may encounter ordinary text about photosynthesis and learn to predict its continuation. During instruction tuning, the request is paired with an example answer written for a ten-year-old. During preference work, raters compare candidate answers using criteria such as clarity and accuracy. During evaluation, a new held-out answer is scored without using it as a training target. Follow the row from left to right and notice that the text may look similar while the evidence it provides is different. A demonstration teaches a response pattern. A preference comparison says which candidate won under a rubric. An evaluation result estimates behavior on a defined sample. For a younger audience, we would also need to test age-appropriate vocabulary, conceptual accuracy, accessibility, and whether children can explain the idea back without adopting a misconception.`,
  `Preference labels are conditional on the people and criteria that produced them. Toggle the rubric and watch the winning answer change. One rubric may reward concision, while another rewards completeness or caution. Neither winner is automatically the universally best response. Preference data can be valuable, but we should ask who the raters were, what instructions they received, how disagreement was handled, which languages and user groups were represented, and what situations were missing. This toy comparison illustrates the concept; production preference optimization uses many examples and a specific learning algorithm. The main lesson is about evidence scope. A preference label means that one response was favored under a stated process. It does not by itself establish factual truth, fairness across untested groups, or suitability for every deployment. Good reporting names the rubric and population instead of treating “human preference” as a single objective.`,
  `Helpful, preferred, and truthful overlap, but they are not synonyms. A response can be helpful in form because it directly addresses the request, yet include invented details. A response can be true but unhelpful because it ignores what the user needs. A response can score well under a preference rubric while failing an untested audience or context. Place a polished fabricated citation in the diagram: it may look helpful and may even be preferred for its confident detail, but it is not truthful relative to evidence. This is why evaluation claims must name the property being measured. Instruction-following tests support claims about following directions. Preference comparisons support claims about rubric-based judgments. Factual evaluations support bounded claims about evidence accuracy. No single score establishes every desirable property. In deployment, we need a portfolio of tests and explicit safeguards matched to the actual use.`,
  `TruthfulQA illustrates how a broad concern can be turned into a bounded evaluation. Its motivating question is whether a model avoids repeating false answers that people commonly give. The benchmark contains 817 questions across 38 categories and scores truthfulness together with informativeness. Those details matter because an evaluation result is always tied to its items, scoring method, and population of prompts. Strong performance is evidence for this test; it does not prove that a model is truthful everywhere. A model may perform differently on new domains, current events, languages, or adversarial prompts. The deeper lesson is operationalization. Define the behavior, construct or select test cases, specify the scoring procedure, and state the limits of the evidence. Fluency is especially dangerous here because familiar misconceptions may be statistically common and therefore easy for a language model to reproduce smoothly.`,
  `Structured output controls the form of a response. In the schema shown here, the output must be an object with city and temperature-f fields, and those fields must have the stated types. JSON mode can ensure syntactically valid JSON. Schema-constrained decoding can go further by blocking next tokens that would violate the allowed structure. This makes downstream software safer because parsers receive predictable fields and types. But consider the value 900 for temperature-f. It may be a valid number and therefore schema-valid, while still being impossible for ordinary weather. A plausible value may also be factually unsupported. Read the sequence on the right as increasing checks: valid syntax, valid structure, meaningful values, and supported facts. Constrained decoding helps with the first two. Domain validation and evidence verification are still required for the last two. A schema is an interface contract, not a knowledge source.`,
  `This interactive stack shows four different failure layers. A malformed string fails the JSON syntax layer. A string where the schema requires a number may be valid JSON but fail schema validation. A value such as 900 degrees may pass both syntax and type checks but fail a semantic range rule. A realistic-looking value can pass all three and still lack factual support from a weather source. Move through each case and identify the first layer that should reject it. The ordering matters because cheap structural checks can happen before expensive source verification. It also helps debugging: instead of saying only “the output is wrong,” we can say whether parsing, schema, domain logic, or evidence failed. A robust system records which checks ran and what they found. Passing an earlier layer never implies passing a later one.`,
  `Now design a contract for an evidence-card review. The claim field should contain one nonempty proposition. The disposition should use a controlled set such as supported, contradicted, or not verified. Evidence should identify a source and the exact location used. Confidence may be included, but it cannot replace evidence. Classify the checks. Required fields, types, and enumerated labels can be enforced by a schema. Rules such as a confidence range or a valid identifier format may require semantic validation. Whether the cited passage actually supports the claim requires opening the source and comparing meaning. Good schemas reduce ambiguity and make missing information visible, but they do not perform the research task. Think of the schema as a well-designed form: it guides what must be recorded so a later reviewer or program can inspect the result consistently.`,
  `The word hallucination can become too vague to be useful. This page defines failure relative to a specific claim, task, and required evidence set. Unsupported means the available evidence does not entail the claim. Contradicted means relevant evidence supports an incompatible claim. Not verified means the evidence is missing, inaccessible, ambiguous, or too weak to decide. Not verified is not the same as false. A reviewer may simply lack enough evidence. Preserving that uncertainty is important because forcing every claim into true or false encourages overstatement. When reporting an error, name the atomic claim, the evidence standard, and the disposition. “The model hallucinated” does not tell another reviewer what source was checked, whether the claim was contradicted, or whether the necessary evidence was unavailable. Precise labels make correction and escalation possible.`,
  `Different surface errors may lead to the same evidence disposition. A fabricated citation, a wrong date, a misattributed quotation, and an overgeneralized conclusion look different in prose, but each must be compared with evidence. Use the controls to examine the cases. Taxonomy labels describe the form of the error: fabrication, contradiction, misattribution, or scope overreach. Dispositions describe the result of the evidence comparison: supported, contradicted, or not verified. Both views can be useful. For example, a quotation assigned to the wrong author is a misattribution and may also be contradicted by the source record. Do not classify based only on how confident or detailed the response sounds. The evidence procedure determines the disposition.`,
  `Verification begins by splitting compound prose into atomic claims. The example sentence contains at least three propositions: the publication venue and year, the number of questions, and a broad conclusion about aligned models. One citation after the entire sentence does not automatically support every clause. Claim one should be checked against the publication record. Claim two should be checked against the paper or dataset. Claim three requires a scope analysis: a finite benchmark cannot prove that aligned models never hallucinate. This step is sometimes called atomization. It prevents one well-supported detail from lending false credibility to a neighboring unsupported statement. Before searching for evidence, rewrite each claim so it can be tested independently. Then select the evidence type suited to that claim. Clear claim boundaries make disagreements easier to resolve and revisions more precise.`,
  `A defensible review leaves a reproducible trail. First, record one precise claim. Second, identify authoritative evidence or an executable test. Third, document the comparison procedure: where you looked, which version or date you used, and what counted as support. Fourth, assign a disposition such as supported, contradicted, or not verified. Fifth, choose a revision or action: correct the text, qualify it, add a citation, abstain, or escalate. Confidence alone is not evidence. Another reviewer should be able to repeat the procedure and understand why the disposition was assigned. This protocol is useful for human review and automated pipelines because it makes each boundary explicit. It also preserves uncertainty; if a source is unavailable, the record should say not verified instead of inventing certainty.`,
  `Different claims require different checks. A citation claim should be compared with the cited source and bibliographic record. A calculation should be recomputed with stated inputs and units. A code claim should be tested in a controlled environment with known cases and versions. A current fact should be checked against an authoritative, up-to-date source. Cycle through the examples and propose both the evidence source and a failure condition. A web search result may help locate a source, but the result snippet is not automatically authoritative evidence. Likewise, running code once is not enough if the claim is universal. The verification procedure must match the scope of the claim. The goal is not to perform the same ritual for every sentence; it is to choose a method capable of detecting the relevant error.`,
  `In this claim audit, classify only after reading both the claim and the evidence. Work independently first, then compare with a partner. One item is directly supported. Another uses a real fact but expands it beyond the source's scope. A third lacks enough evidence, which should lead to not verified rather than contradicted. Explain the decision with a specific comparison, not with intuition about how the sentence sounds. The exercise reinforces three habits: atomize the claim, identify the appropriate evidence, and preserve uncertainty. If partners disagree, ask whether they are using the same claim wording and evidence standard. Many apparent disagreements come from testing different propositions.`,
  `Abstention is a system behavior, not proof that a model knows the boundaries of its knowledge. Token probability measures uncertainty over continuations at one decoding step. Verbal confidence is generated text such as “I am 90 percent sure.” Empirical calibration compares stated confidence with observed accuracy over many cases. These signals are related only through measured evidence. Coverage is the fraction of all cases the system answers. Selective risk is the error rate among answered cases. A system can reduce selective risk by abstaining more, but very low coverage may make it useless. Evaluate answerable and unanswerable cases, record when the system answers or abstains, and provide a useful next step such as requesting evidence or escalating to a qualified person.`,
  `Verification effort should rise with potential harm and irreversibility. Compare the low-stakes and high-stakes cases in the router. A casual creative suggestion may need only basic checks. A medical, legal, financial, or safety-critical recommendation needs authoritative evidence, domain review, and often escalation. Risk depends on impact, likelihood, reversibility, user vulnerability, and whether someone can detect and correct an error. Refusal alone is not always a complete safety strategy. In a high-risk setting, a bare refusal may leave the user without a path forward. Good routing communicates limits and directs the case to an appropriate source or professional. The goal is proportional evidence: do not burden harmless tasks unnecessarily, and do not treat polished language as sufficient when decisions can cause serious harm.`,
  `This end-to-end example separates responsibilities. Generation produces atomic claims and source IDs in a defined schema. Parsing rejects malformed output. Validation checks required fields, allowed labels, identifiers, and value ranges. Verification opens the actual research paper and compares each claim with methods and results. Communication revises unsupported language and preserves limitations for the public audience. Some steps can be automated reliably, especially parsing and simple validation. Other steps require domain judgment, source interpretation, and accountability. Structured generation organizes the review; it does not replace reading the evidence. This boundary prepares us for the next lessons on retrieval-augmented generation, where a system can obtain sources but still needs to select, interpret, cite, and evaluate them correctly.`,
  `For the exit ticket, answer three questions in plain language. First, next-token training rewards likely continuations in the training data; it does not include an automatic truth-check for each generated claim. Second, if an output is schema-valid but gives the wrong deadline, syntax and structure passed while semantic or factual verification failed. Third, fluent writing can increase the burden of verification because confidence, detail, and good formatting may hide weak evidence and make errors harder to notice. Use the readings according to the question you want to investigate: scaling behavior, compute allocation, instruction following, truthfulness evaluation, or structured output. The lesson's central message is not that language models are unusable. It is that generation, validation, and verification are separate mechanisms, and trustworthy systems make those boundaries visible.`,
];

slides.forEach((slide, index) => {
  slide.note = lesson20InstructorNotes[index];
});

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
