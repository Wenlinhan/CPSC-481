"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import "../styles/meeting14.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l09-machine-learning-part-a";
const loanRecords = [
  [1,"high","bad","high","none","$0–$15k"], [2,"high","unknown","high","none","$15–$35k"],
  [3,"moderate","unknown","low","none","$15–$35k"], [4,"high","unknown","low","none","$0–$15k"],
  [5,"low","unknown","low","none","over $35k"], [6,"low","unknown","low","adequate","over $35k"],
  [7,"high","bad","low","none","$0–$15k"], [8,"moderate","bad","low","adequate","over $35k"],
  [9,"low","good","low","none","over $35k"], [10,"low","good","high","adequate","over $35k"],
  [11,"high","good","high","none","$0–$15k"], [12,"moderate","good","high","none","$15–$35k"],
  [13,"low","good","high","none","over $35k"], [14,"high","bad","high","none","$15–$35k"],
] as const;

const loanHeaders = ["No.", "Risk", "Credit history", "Debt", "Collateral", "Income"] as const;

function LoanDataTable({ label = "Loan-risk training data" }: { label?: string }) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const selectedRecord = selectedRow === null ? null : loanRecords.find(row => row[0] === selectedRow) ?? null;
  const selection = selectedRecord
    ? `Row ${selectedRecord[0]}: ${selectedRecord[1]} risk · ${selectedRecord[2]} credit · ${selectedRecord[3]} debt · ${selectedRecord[4]} collateral · ${selectedRecord[5]} income`
    : selectedColumn === null
      ? "Select any row or column to inspect the evidence."
      : `${loanHeaders[selectedColumn]} column selected · compare this attribute across all 14 applications.`;

  const onRowKey = (event: KeyboardEvent<HTMLTableRowElement>, rowNumber: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedRow(rowNumber);
    }
  };

  const table = (
    <div className="m14-loan-table-wrap">
      <table className="m14-loan-table">
        <caption className="sr-only">{label}. Select a column heading or application row for explanation.</caption>
        <thead><tr>{loanHeaders.map((header, index) => <th className={selectedColumn === index ? "selected" : ""} key={header} scope="col"><button aria-pressed={selectedColumn === index} onClick={() => { setSelectedColumn(index); setSelectedRow(null); }} type="button">{header}</button></th>)}</tr></thead>
        <tbody>{loanRecords.map(row => <tr aria-selected={selectedRow === row[0]} className={selectedRow === row[0] ? "selected" : ""} key={row[0]} onClick={() => { setSelectedRow(row[0]); setSelectedColumn(null); }} onKeyDown={event => onRowKey(event, row[0])} tabIndex={0}>{row.map((cell,index) => <td className={selectedColumn === index ? "selected-column" : ""} key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );

  useEffect(() => {
    if (!expanded) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [expanded]);

  const enlargedTable = expanded && typeof document !== "undefined"
    ? createPortal(
        <div className="m14-table-modal" role="presentation">
          <section aria-label={`Enlarged ${label}`} aria-modal="true" role="dialog">
            <header><div><span>Interactive dataset</span><h2>{label}</h2></div><button aria-label="Close enlarged table" onClick={() => setExpanded(false)} type="button">×</button></header>
            {table}
            <p aria-live="polite">{selection}</p>
          </section>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="m14-data-explorer">
      <div className="m14-table-toolbar"><strong>{label}</strong><div><button onClick={() => setExpanded(true)} type="button">⛶ Enlarge</button><button disabled={selectedRow === null && selectedColumn === null} onClick={() => { setSelectedRow(null); setSelectedColumn(null); }} type="button">Clear</button></div></div>
      {table}
      <p aria-live="polite">{selection}</p>
      {enlargedTable}
    </div>
  );
}

const lessonObjectives = [
  { label: "Represent", detail: "Read internal tests, branches, leaves, and the rules encoded by a tree.", cue: "Start by separating predictor columns from the risk label." },
  { label: "Induce", detail: "Trace ID3's top-down recursive, greedy construction procedure.", cue: "Each split partitions these 14 records into smaller learning problems." },
  { label: "Calculate", detail: "Compute entropy, expected entropy, and information gain.", cue: "Class counts in the selected rows supply every probability." },
  { label: "Evaluate", detail: "Audit generalization, error types, calibration, and subgroup behavior.", cue: "A fitted table is not deployment evidence; unseen cases are required." },
];

function LessonRoadmapExplorer() {
  const [active, setActive] = useState(0);
  const item = lessonObjectives[active];
  return (
    <div className="m14-roadmap-explorer">
      <LoanDataTable label="The shared evidence for today's four objectives" />
      <section>
        <nav aria-label="Lesson 16 objectives">{lessonObjectives.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button"><span>{String(index + 1).padStart(2, "0")}</span>{entry.label}</button>)}</nav>
        <article><span>Objective {active + 1}</span><h3>{item.label}</h3><p>{item.detail}</p><strong>{item.cue}</strong></article>
      </section>
    </div>
  );
}

function CompactRiskTree({ picnic = false }: { picnic?: boolean }) {
  if (picnic) return <div className="m14-rebuilt-tree picnic"><b>forecast?</b><div><span>sunny → humidity?</span><span>overcast → yes</span><span>rain → wind?</span></div><small>Internal nodes test attributes; branches are values; leaves are decisions.</small></div>;
  return <div className="m14-rebuilt-tree"><b>income?</b><div><span>$0–$15k → high</span><span>$15–$35k → credit / debt</span><span>&gt;$35k → credit</span></div><small>Collateral is never selected in the learned tree.</small></div>;
}

function M14SourceReconstruction({ slide, alt, className = "" }: { slide: number; alt: string; caption: string; className?: string }) {
  const pageText: Record<number, { title: string; points: string[] }> = {
    20:{title:"Learning the risk level",points:["Target: financial risk", "Predictors: credit history, debt, collateral, and income"]},
    21:{title:"Decision tree induction",points:["Quinlan developed ID3 in 1986", "a tree represents concepts through property tests", "labeled training data induce classification rules"]},
    22:{title:"Decision-tree representation",points:["internal nodes are attribute tests", "branches are attribute values", "leaves are class decisions"]},
    23:{title:"Training data set for learning",points:["14 labeled loan applications", "risk is the decision-class column"]},
    24:{title:"Risk decision tree",points:["begin at income", "follow only the matching branch", "stop at a risk-class leaf"]},
    25:{title:"ID3 recursive algorithm",points:["if all examples share a class, return a leaf", "if no attributes remain, return a default class", "otherwise select a test, partition, and recurse"]},
    26:{title:"Top-down induction",points:["select a best attribute", "create one branch per value", "partition examples", "make pure branches leaves", "recurse on impure branches", "stop at base cases"]},
    27:{title:"Choosing among consistent trees",points:["many trees may fit the training data", "prefer a compact pattern, then verify generalization"]},
    28:{title:"Minimum message length",points:["minimize description of the hypothesis plus data given the hypothesis", "the integers 2–100 contain 50 even values"]},
    29:{title:"Entropy and information",points:["I(c)=−log₂p(c)", "H(S)=−Σp(c)log₂p(c)", "pure sets have entropy 0"]},
    30:{title:"Information gain",points:["E(X)=Σᵥ |Tᵥ|/|T| · H(Tᵥ)", "Gain(X)=H(T)−E(X)", "choose the largest gain"]},
    31:{title:"Loan-data calculation",points:["H(LoanData)=1.531 bits", "E(income)=0.564 bits", "Gain(income)=0.967 bits", "income has the largest gain"]},
    32:{title:"Partial decision trees",points:["Stage A splits all records on income", "Stage B recomputes gain within each impure subset"]},
    33:{title:"Completed risk tree",points:["income is the root", "credit history and debt refine selected branches", "leaves encode high, moderate, and low risk"]},
    34:{title:"Tree paths become rules",points:["join tests on one path with AND", "join alternative paths to one class with OR", "the leaf class becomes the rule conclusion"]},
    35:{title:"Decision-tree induction as search",points:["state: partially built tree", "operator: add an attribute test", "heuristic: information gain", "greedy search uses no backtracking"]},
  };
  const page = pageText[slide] ?? { title:`Course source page ${slide}`, points:[] };
  const usesTable = slide === 20 || slide === 23;
  const usesTree = slide === 22 || [24,27,32,33].includes(slide);
  const visualLabel = usesTable ? "Loan-risk dataset · 14 labeled applications" : usesTree ? "Decision-tree visual" : "Decision-tree concept";
  return <article className={`m14-source-frame m14-source-rebuilt ${className}`.trim()} aria-label={alt}><span>{visualLabel}</span><h3>{page.title}</h3>{usesTable ? <LoanDataTable label={slide === 20 ? "Loan applications and historical risk labels" : "Complete training dataset"} /> : usesTree ? <CompactRiskTree picnic={slide === 22} /> : <ol>{page.points.map(point => <li key={point}>{point}</li>)}</ol>}{(usesTable || usesTree) && <small>{page.points.join(" · ")}</small>}</article>;
}
const SOURCE_DECK_LABEL = "L09 Machine Learning · Part A";

function resolveMeeting14SourceReference(sourceSlide: number) {
  return {
    deckLabel: SOURCE_DECK_LABEL,
    image: `${SOURCE_ROOT}/slide-renders/slide-${String(sourceSlide).padStart(2, "0")}.png`,
    key: `l09-machine-learning-part-a:${sourceSlide}`,
    page: sourceSlide,
  };
}

function SourceFrame({
  slide,
  alt,
  caption,
  className = "",
}: {
  slide: number;
  alt: string;
  caption: string;
  className?: string;
}) {
  return <M14SourceReconstruction alt={alt} caption={caption} className={className} slide={slide} />;
}

function SourceExplanation({
  slide,
  alt,
  caption,
  children,
  reverse = false,
  className = "",
}: {
  slide: number;
  alt: string;
  caption: string;
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`m14-source-explain ${reverse ? "reverse" : ""} ${className}`.trim()}>
      <SourceFrame alt={alt} caption={caption} slide={slide} />
      <section>{children}</section>
    </div>
  );
}

type Income = "low" | "middle" | "high";
type Credit = "unknown" | "bad" | "good";
type Debt = "high" | "low";

function classifyRisk(income: Income, credit: Credit, debt: Debt) {
  if (income === "low") return { risk: "high", path: "income = $0–$15k → high risk" };
  if (income === "high") {
    if (credit === "bad") return { risk: "moderate", path: "income > $35k → credit = bad → moderate risk" };
    return { risk: "low", path: `income > $35k → credit = ${credit} → low risk` };
  }
  if (credit === "bad") return { risk: "high", path: "income = $15–$35k → credit = bad → high risk" };
  if (credit === "good") return { risk: "moderate", path: "income = $15–$35k → credit = good → moderate risk" };
  return debt === "high"
    ? { risk: "high", path: "income = $15–$35k → credit = unknown → debt = high → high risk" }
    : { risk: "moderate", path: "income = $15–$35k → credit = unknown → debt = low → moderate risk" };
}

function RiskTreeTrace() {
  const [income, setIncome] = useState<Income>("middle");
  const [credit, setCredit] = useState<Credit>("unknown");
  const [debt, setDebt] = useState<Debt>("high");
  const result = classifyRisk(income, credit, debt);

  return (
    <div className="m14-tree-trace">
      <section>
        <span>Applicant attributes</span>
        <label>
          Income
          <select onChange={event => setIncome(event.target.value as Income)} value={income}>
            <option value="low">$0–$15k</option>
            <option value="middle">$15–$35k</option>
            <option value="high">over $35k</option>
          </select>
        </label>
        <label>
          Credit history
          <select onChange={event => setCredit(event.target.value as Credit)} value={credit}>
            <option value="unknown">unknown</option>
            <option value="bad">bad</option>
            <option value="good">good</option>
          </select>
        </label>
        <label>
          Debt
          <select onChange={event => setDebt(event.target.value as Debt)} value={debt}>
            <option value="high">high</option>
            <option value="low">low</option>
          </select>
        </label>
      </section>
      <div>
        <span>Trace one root-to-leaf path</span>
        <ol>
          {result.path.split(" → ").map((step, index) => <li key={step}><b>{index + 1}</b>{step}</li>)}
        </ol>
        <strong className={`risk-${result.risk}`}>{result.risk} risk</strong>
        <p>Only attributes encountered on this path affect this prediction.</p>
      </div>
    </div>
  );
}

function BuildTreeReveal() {
  const [stage, setStage] = useState(0);
  const stages = [
    {
      label: "Choose a test",
      detail: "Compare the candidate attributes and select the test that most reduces uncertainty.",
    },
    {
      label: "Partition examples",
      detail: "Create one branch for each observed value and send every training record to its matching branch.",
    },
    {
      label: "Close pure branches",
      detail: "If every example in a partition has the same risk class, replace that partition with a leaf.",
    },
    {
      label: "Recurse",
      detail: "For every impure partition, choose another unused test and repeat until the stopping condition is met.",
    },
  ];

  return (
    <div className="m14-build-reveal">
      <nav aria-label="Top-down decision-tree induction stages">
        {stages.map((item, index) => (
          <button
            className={stage === index ? "active" : ""}
            key={item.label}
            onClick={() => setStage(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Stage {stage + 1} of {stages.length}</span>
        <h3>{stages[stage].label}</h3>
        <p>{stages[stage].detail}</p>
        <div className="m14-mini-tree" aria-label="Animated top-down tree">
          <b>income?</b>
          <i className={stage >= 1 ? "visible left" : "left"} />
          <i className={stage >= 1 ? "visible center" : "center"} />
          <i className={stage >= 1 ? "visible right" : "right"} />
          <em className={stage >= 2 ? "visible leaf left" : "leaf left"}>high</em>
          <em className={stage >= 3 ? "visible node center" : "node center"}>credit?</em>
          <em className={stage >= 3 ? "visible node right" : "node right"}>credit?</em>
        </div>
      </section>
    </div>
  );
}

function EntropyLab() {
  const [positive, setPositive] = useState(5);
  const negative = 10 - positive;
  const entropy = useMemo(() => {
    const terms = [positive / 10, negative / 10].filter(value => value > 0);
    return -terms.reduce((sum, probability) => sum + probability * Math.log2(probability), 0);
  }, [negative, positive]);

  return (
    <div className="m14-entropy-lab">
      <section>
        <span>Binary class distribution · 10 examples</span>
        <div className="m14-dots" aria-label={`${positive} positive and ${negative} negative examples`}>
          {Array.from({ length: 10 }, (_, index) => (
            <i className={index < positive ? "positive" : "negative"} key={index} />
          ))}
        </div>
        <label>
          Positive examples: {positive}
          <input
            aria-label="Number of positive examples"
            max="10"
            min="0"
            onChange={event => setPositive(Number(event.target.value))}
            type="range"
            value={positive}
          />
        </label>
      </section>
      <div>
        <span>Entropy in bits</span>
        <strong>{entropy.toFixed(3)}</strong>
        <code>H(S) = −Σ p(c) log₂ p(c)</code>
        <p>{entropy < 0.01 ? "Pure: the class is certain." : entropy > 0.99 ? "Maximum binary uncertainty." : "Mixed: a useful split could reduce uncertainty."}</p>
        <small>Convention: 0 log₂ 0 = 0 by continuity.</small>
      </div>
    </div>
  );
}

const gainRows = [
  { attribute: "income", expected: "0.564", gain: "0.967", note: "largest reduction" },
  { attribute: "credit history", expected: "1.265", gain: "0.266", note: "smaller reduction" },
  { attribute: "collateral", expected: "1.325", gain: "0.206", note: "smaller reduction" },
  { attribute: "debt", expected: "1.468", gain: "0.063", note: "smallest reduction" },
];

function GainReveal() {
  const [revealed, setRevealed] = useState(0);
  return (
    <div className="m14-gain-reveal">
      <section>
        <span>Parent entropy</span>
        <strong>H(LoanData) = 1.531 bits</strong>
        <p>Predict the winning root attribute before revealing all four candidates.</p>
        <button onClick={() => setRevealed(value => value === gainRows.length ? 0 : Math.min(gainRows.length, value + 1))} type="button">
          {revealed === gainRows.length ? "Reset" : "Reveal next attribute"}
        </button>
      </section>
      <div role="table" aria-label="Information gain comparison">
        <div className="m14-gain-header" role="row"><span>Attribute</span><span>E(attribute)</span><span>Gain</span></div>
        {gainRows.map((row, index) => (
          <div className={index < revealed ? "visible" : ""} key={row.attribute} role="row">
            <strong>{index < revealed ? row.attribute : "?"}</strong>
            <span>{index < revealed ? row.expected : "—"}</span>
            <span>{index < revealed ? `${row.gain} · ${row.note}` : "commit first"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RulePractice() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="m14-rule-practice">
      <section>
        <span>In-class practice · 3 minutes</span>
        <h3>Derive the missing moderate-risk rule.</h3>
        <p>Trace every path that ends in a moderate-risk leaf. Join tests along a path with AND; join alternative paths with OR.</p>
        <button onClick={() => setRevealed(value => !value)} type="button">{revealed ? "Hide model answer" : "Reveal model answer"}</button>
      </section>
      <div className={revealed ? "revealed" : ""}>
        {revealed ? (
          <>
            <code>IF income = $15–$35k AND credit = good</code>
            <code>OR income = $15–$35k AND credit = unknown AND debt = low</code>
            <code>OR income &gt; $35k AND credit = bad</code>
            <strong>THEN risk = moderate</strong>
          </>
        ) : (
          <p>Write three root-to-leaf conjunctions, then combine them.</p>
        )}
      </div>
    </div>
  );
}

const metricPresets = [
  { label: "Balanced", tp: 42, fp: 8, fn: 8, tn: 42 },
  { label: "High recall", tp: 48, fp: 25, fn: 2, tn: 25 },
  { label: "High precision", tp: 32, fp: 2, fn: 18, tn: 48 },
];

function MetricsLab() {
  const [preset, setPreset] = useState(0);
  const values = metricPresets[preset];
  const precision = values.tp / (values.tp + values.fp);
  const recall = values.tp / (values.tp + values.fn);
  const f1 = (2 * precision * recall) / (precision + recall);

  return (
    <div className="m14-metrics-lab">
      <nav aria-label="Classifier operating points">
        {metricPresets.map((item, index) => (
          <button className={index === preset ? "active" : ""} key={item.label} onClick={() => setPreset(index)} type="button">{item.label}</button>
        ))}
      </nav>
      <section className="m14-confusion">
        <span />
        <b>Predicted +</b><b>Predicted −</b>
        <b>Actual +</b><i className="tp">TP {values.tp}</i><i className="fn">FN {values.fn}</i>
        <b>Actual −</b><i className="fp">FP {values.fp}</i><i className="tn">TN {values.tn}</i>
      </section>
      <div>
        <article><span>Precision</span><strong>{precision.toFixed(2)}</strong><small>TP / (TP + FP)</small></article>
        <article><span>Recall</span><strong>{recall.toFixed(2)}</strong><small>TP / (TP + FN)</small></article>
        <article><span>F1</span><strong>{f1.toFixed(2)}</strong><small>harmonic mean</small></article>
      </div>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Machine learning · Part A",
    title: "How a decision tree turns examples into understandable rules",
    subtitle: "Use loan records to build, read, calculate, and evaluate a classifier.",
    content: (
      <div className="m14-cover">
        <SourceFrame
          alt="Historical loan-risk learning problem with the complete training table"
          caption="Exact course source · the loan-risk problem and its data are the meeting anchor."
          slide={20}
        />
        <section>
          <span>Meeting 14 · 75 minutes</span>
          <h3>Which question should the tree ask first?</h3>
          <p>We will turn 14 labeled loan records into a decision tree, translate paths into rules, and evaluate what the resulting classifier can and cannot claim.</p>
        </section>
      </div>
    ),
    note: "Timing: 1 minute. Open with the historical loan table. Point out that both the attributes and the risk labels are knowledge-bearing parts of the source image.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Learning objectives · Knowledge map",
    title: "Five things you will learn to do",
    content: <LessonRoadmapExplorer />,
    note: "Timing: 1 minute. The assessment evidence will be one tree trace, one information-gain explanation, one rule, and one justified metric choice.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 · Learning problem",
    title: "Past loan applications provide examples for predicting risk",
    content: (
      <SourceExplanation
        alt="Loan-risk learning problem and credit-history data table"
        caption="Exact source page 20 · data collected from the credit history of loan applications."
        slide={20}
      >
        <blockquote>What learning method can learn the concept of risk level—and how should that concept be represented?</blockquote>
        <div className="m14-role-grid">
          <article><span>Target</span><strong>risk level</strong><p>high, moderate, or low</p></article>
          <article><span>Predictors</span><strong>applicant attributes</strong><p>credit history, debt, collateral, income</p></article>
        </div>
        <SearchCallout label="Before modeling" tone="amber">Who produced the historical risk labels, and what errors or inequities might they encode?</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve both source questions. Ask students to identify the target column and the predictor columns without yet naming decision trees.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Knowledge point 1 · Training examples",
    title: "Each training row contains inputs and a known answer",
    content: (
      <div className="m14-table-focus">
        <LoanDataTable label="Four predictors and one class label" />
        <section>
          <div className="m14-data-anatomy">
            <article><span>x</span><strong>Input vector</strong><p>(credit history, debt, collateral, income)</p></article>
            <article><span>y</span><strong>Class label</strong><p>financial risk ∈ {`{high, moderate, low}`}</p></article>
            <article><span>D</span><strong>Training set</strong><p>14 observed pairs (xᵢ, yᵢ)</p></article>
          </div>
          <div className="m14-notation-box"><b>Notation:</b> x is one applicant’s input values; y is that applicant’s known risk label; D is the complete training dataset; i identifies one row.</div>
          <SearchCallout label="Think · pair · share" tone="cyan">Select a column, compare its values against risk, and justify which attribute looks most predictive.</SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Let pairs inspect the exact data. Surface that visual inspection can suggest a split, but ID3 needs a quantitative selection rule.",
    sourceSlides: [23],
  },
  {
    eyebrow: "Knowledge point 2 · Decision Tree Induction",
    title: "ID3 builds a decision tree from labeled examples",
    content: (
      <SourceExplanation
        alt="Historical definition and provenance of decision-tree induction and ID3"
        caption="Exact source page 21 · Quinlan, 1986; tree representation; classification through property tests."
        slide={21}
      >
        <div className="m14-definition-stack">
          <article><span>Provenance</span><p>J. Ross Quinlan developed ID3 in 1986 as an early decision-tree learning algorithm.</p></article>
          <article><span>Representation</span><p>A decision tree represents conditional patterns or concepts as a graph of tests and outcomes.</p></article>
          <article><span>Learning</span><p>ID3 uses labeled input data to induce a tree—and therefore a set of classification rules.</p></article>
        </div>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve the source's ID3 provenance and the distinction between decision trees as a representation and ID3 as an induction algorithm.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Knowledge point 2 · Tree anatomy",
    title: "A node asks a question; a branch answers it; a leaf predicts",
    content: (
      <SourceExplanation
        alt="Picnic decision tree and definitions of internal nodes and leaf nodes"
        caption="Exact source page 22 · the picnic example is a conceptual example, not decoration."
        className="m14-anatomy-explain"
        reverse
        slide={22}
      >
        <div className="m14-tree-anatomy">
          <article><span>Root</span><strong>the first test</strong><p>all examples begin here</p></article>
          <article><span>Internal node</span><strong>attribute test</strong><p>asks one question</p></article>
          <article><span>Branch</span><strong>attribute value</strong><p>selects the next path</p></article>
          <article><span>Leaf</span><strong>class decision</strong><p>returns the prediction</p></article>
        </div>
        <SearchQuickCheck
          correct={2}
          explanation="A branch is labeled by an attribute value; a leaf stores the resulting class decision."
          options={["An attribute test", "A training record", "An attribute value", "A probability"]}
          question="In the picnic tree, what does a branch represent?"
        />
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Trace one picnic example aloud. Then use the quick check to distinguish the node test from the branch value.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Knowledge point 2 · Learned risk representation",
    title: "Follow one path through the tree to predict a risk class",
    content: (
      <SourceExplanation
        alt="Decision tree for loan-risk assessment"
        caption="Exact source page 24 · the source asks how to create the tree and classify applications."
        slide={24}
      >
        <h3>Classification is a path, not a vote over every attribute.</h3>
        <ol className="m14-path-steps">
          <li><span>1</span>Begin at the root.</li>
          <li><span>2</span>Evaluate the current attribute.</li>
          <li><span>3</span>Follow the matching value branch.</li>
          <li><span>4</span>Stop at a leaf and return its class.</li>
        </ol>
        <SearchCallout label="Instructor demo" tone="green">Trace record 2, then ask which test is skipped for records that reach a leaf early.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 4 minutes. Trace two records on the exact source tree. Emphasize that collateral is present in the table but absent from this learned tree.",
    sourceSlides: [24],
  },
  {
    eyebrow: "Demo · Tree traversal",
    title: "Changing one input can send an applicant down a different path",
    content: <RiskTreeTrace />,
    note: "Timing: 4 minutes. Invite students to choose attribute values. Before each change, ask them to predict the leaf and identify which attributes will be ignored.",
    sourceSlides: [24, 33],
  },
  {
    eyebrow: "Knowledge point 3 · ID3 algorithm",
    title: "ID3 keeps splitting mixed groups until it can make a decision",
    content: (
      <SourceExplanation
        alt="Complete historical ID3 decision-tree induction pseudocode"
        caption="Exact source page 25 · the algorithm image is retained full-fit so every base case and recursive step can be enlarged."
        reverse
        slide={25}
      >
        <div className="m14-pseudocode-map">
          <article><span>Base case A</span><p>All examples have one class → return that class.</p></article>
          <article><span>Base case B</span><p>No attributes remain → return a default or majority class.</p></article>
          <article><span>Recursive case</span><p>Select a test, partition the examples, and induce one subtree per non-pure branch.</p></article>
        </div>
        <SearchCallout label="Read the source as code" tone="cyan">Circle the stopping conditions. Underline the line that makes the algorithm greedy.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 2 minutes. Have students enlarge the exact pseudocode and locate its base cases and recursive call. Note that noise and unseen values require additional design choices.",
    sourceSlides: [25],
  },
  {
    eyebrow: "Knowledge point 3 · Top-down induction",
    title: "Choose a test, divide the rows, and repeat on mixed groups",
    content: (
      <div className="m14-source-practice">
        <SourceFrame
          alt="Historical top-down decision-tree induction steps"
          caption="Exact source page 26 · the complete six-step wording remains visible."
          slide={26}
        />
        <BuildTreeReveal />
      </div>
    ),
    note: "Timing: 3 minutes. Walk through the source sequence, then use the staged diagram. Students must explain why pure partitions become leaves.",
    sourceSlides: [26],
  },
  {
    eyebrow: "Knowledge point 4 · Simplicity",
    title: "When several trees fit, prefer simplicity—but verify it",
    content: (
      <SourceExplanation
        alt="A simpler decision tree and the question of model choice"
        caption="Exact source page 27 · compare this tree with the earlier risk tree."
        reverse
        slide={27}
      >
        <blockquote>Prefer a tree that captures the pattern without merely memorizing the records.</blockquote>
        <div className="m14-simplicity-compare">
          <article><span>Smaller tree</span><strong>lower description cost</strong><p>often easier to inspect and less likely to encode accidental detail</p></article>
          <article><span>But verify</span><strong>validation performance</strong><p>the shortest tree is not automatically the most accurate or fair</p></article>
        </div>
        <SearchCallout label="In-class question" tone="amber">Give one reason a larger tree might fit training data better yet predict new applications worse.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Use the source question as a whole-class prompt. Connect simplicity to generalization, but avoid treating simplicity as a guarantee.",
    sourceSlides: [27],
  },
  {
    eyebrow: "Knowledge point 4 · Minimal Message Length",
    title: "A good rule is short but still explains the data",
    content: (
      <SourceExplanation
        alt="Historical minimum-message-length motivation and even-number example"
        caption="Exact source page 28 · preserved unchanged; the rebuilt explanation corrects its counting error."
        slide={28}
      >
        <div className="m14-mml">
          <code>Choose Hᵢ minimizing Mlength(Hᵢ) + Mlength(D | Hᵢ)</code>
          <div className="m14-notation-box"><b>Notation:</b> Hᵢ is one candidate hypothesis; D is the dataset; Mlength means the number of bits needed to describe something; D | Hᵢ means the data after using that hypothesis.</div>
          <article><span>Model cost</span><p>bits needed to specify the hypothesis</p></article>
          <article><span>Residual cost</span><p>bits needed to describe the data given the hypothesis</p></article>
        </div>
        <SearchCallout label="Source correction" tone="amber">
          The even integers from 2 through 100 inclusive number <strong>50</strong>, not 49. The compression argument still holds: “all even integers from 2 to 100” is shorter than listing all 50 integers.
        </SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Preserve the MML formula and explicitly correct 49 to 50. Ask what happens when a hypothesis is short but leaves many exceptions.",
    sourceSlides: [28],
  },
  {
    eyebrow: "Knowledge point 5 · Entropy",
    title: "Entropy tells us how mixed the class labels are",
    content: (
      <SourceExplanation
        alt="Historical entropy formulas and class-distribution diagrams"
        caption="Exact source page 29 · probability, information content, entropy, and purity examples."
        reverse
        slide={29}
      >
        <div className="m14-formulas">
          <code>I(c) = −log₂ p(c)</code>
          <code>H(S) = −Σ p(c) log₂ p(c)</code>
        </div>
        <div className="m14-notation-box"><b>Notation:</b> c is a class; p(c) is its proportion; S is a set of examples; Σ means add one term for every class; log₂ measures information in bits.</div>
        <div className="m14-entropy-cases">
          <article><strong>H = 0</strong><p>one class only; no uncertainty</p></article>
          <article><strong>H is high</strong><p>classes are balanced; the label is uncertain</p></article>
        </div>
        <SearchCallout label="Interpretation" tone="green">Entropy is about the distribution of labels in a set—not the visual complexity of a tree.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Define log base 2 and the 0 log 0 convention. Relate pure branches to zero entropy.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Demo · Entropy",
    title: "A pure group has zero entropy; an even mix has the most",
    content: <EntropyLab />,
    note: "Timing: 4 minutes. Move the slider from 10/0 through 5/5. Ask students to predict the curve before showing numeric values.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Knowledge point 6 · Attribute selection",
    title: "Choose the question that removes the most uncertainty",
    content: (
      <SourceExplanation
        alt="Historical formulas for information-theoretic test selection"
        caption="Exact source page 30 · entropy of T, expected entropy after testing X, and information gain."
        className="m14-gain-explain"
        slide={30}
      >
        <div className="m14-formulas">
          <code>E(X) = Σᵥ |Tᵥ| / |T| · H(Tᵥ)</code>
          <code>Gain(X) = H(T) − E(X)</code>
        </div>
        <div className="m14-notation-box"><b>Notation:</b> T is the current training subset; X is a candidate attribute; v is one value of X; Tᵥ contains rows where X=v; E(X) is expected entropy after splitting; Gain(X) is uncertainty removed.</div>
        <ol className="m14-path-steps">
          <li><span>1</span>Measure uncertainty before the split.</li>
          <li><span>2</span>Compute each branch&apos;s entropy.</li>
          <li><span>3</span>Weight branches by their sizes.</li>
          <li><span>4</span>Subtract expected uncertainty from the parent entropy.</li>
        </ol>
        <SearchCallout label="Decision rule" tone="green">ID3 chooses the candidate attribute with the largest information gain.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Derive the expected-entropy expression from the idea of a weighted average. Mention that raw information gain favors some high-cardinality attributes.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Worked example · Loan data",
    title: "For these records, income gives the largest uncertainty reduction",
    content: (
      <SourceExplanation
        alt="Complete historical calculation of information gain for all loan attributes"
        caption="Exact source page 31 · the full income, credit-history, debt, and collateral comparison is preserved."
        reverse
        slide={31}
      >
        <div className="m14-calculation">
          <code>H(LoanData) = −6/14 log₂(6/14) − 3/14 log₂(3/14) − 5/14 log₂(5/14) = 1.531</code>
          <code>E(income) = 4/14(0) + 4/14(1) + 6/14(0.65) = 0.564</code>
          <code>Gain(income) = 1.531 − 0.564 = 0.967 bits</code>
        </div>
        <p className="m14-gain-note">Other gains: credit history 0.266 · collateral 0.206 · debt 0.063. Therefore income becomes the root.</p>
      </SourceExplanation>
    ),
    note: "Timing: 4 minutes. Reconstruct the class counts 6 high, 3 moderate, 5 low. Then show why the first income partition is pure and contributes zero weighted entropy.",
    sourceSlides: [31],
  },
  {
    eyebrow: "Practice · Information gain",
    title: "Compare every attribute before choosing the root question",
    content: <GainReveal />,
    note: "Timing: 5 minutes. Students calculate or verify one candidate in pairs, predict the rank, then reveal the comparison row by row. Ask why the same parent entropy appears in every gain calculation.",
    sourceSlides: [31],
  },
  {
    eyebrow: "Knowledge point 7 · Partial trees",
    title: "After the first split, each branch becomes a smaller problem",
    content: (
      <SourceExplanation
        alt="Historical stage A and stage B partial decision trees"
        caption="Exact source page 32 · both partially constructed trees and their record IDs remain visible."
        slide={32}
      >
        <div className="m14-stage-map">
          <article><span>Stage A</span><strong>split all 14 records on income</strong><p>the $0–$15k branch is already pure high risk</p></article>
          <article><span>Stage B</span><strong>split impure branches again</strong><p>recompute information gain using only the records in each branch</p></article>
        </div>
        <SearchCallout label="Key recursion idea" tone="cyan">After a split, each child receives a local subset. Its best next attribute can differ from another child&apos;s.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Use the record IDs in the exact source figures to show that each recursive call receives a smaller training subset.",
    sourceSlides: [32],
  },
  {
    eyebrow: "Knowledge point 7 · Final tree",
    title: "The finished tree predicts high, moderate, or low risk",
    content: (
      <SourceExplanation
        alt="Complete final loan-risk decision tree"
        caption="Exact source page 33 · income at the root, credit-history and debt tests, and every class leaf."
        reverse
        slide={33}
      >
        <div className="m14-final-tree-notes">
          <article><span>High risk</span><p>all low-income records plus selected middle-income paths</p></article>
          <article><span>Moderate risk</span><p>three distinct root-to-leaf paths</p></article>
          <article><span>Low risk</span><p>high income with unknown or good credit history</p></article>
        </div>
        <SearchCallout label="Inspect the representation" tone="amber">Debt is tested only for middle income with unknown credit history. Collateral is never selected.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Have students count leaves by class and explain why debt and collateral play different roles despite both appearing in the training data.",
    sourceSlides: [33],
  },
  {
    eyebrow: "Knowledge point 8 · Tree-to-rule conversion",
    title: "Each complete path can be written as one IF–THEN rule",
    content: (
      <SourceExplanation
        alt="Historical high-risk and low-risk rules derived from the decision tree"
        caption="Exact source page 34 · LHS conditions, RHS class outcome, and the missing moderate-risk prompt."
        slide={34}
      >
        <div className="m14-rule-grammar">
          <code>IF test₁ AND test₂ AND … THEN class</code>
          <p>Tests on one path are joined by <strong>AND</strong>. Multiple paths to the same class are joined by <strong>OR</strong>.</p>
          <article><span>LHS</span><strong>conditions leading to a leaf</strong></article>
          <article><span>RHS</span><strong>the class outcome</strong></article>
        </div>
      </SourceExplanation>
    ),
    note: "Timing: 3 minutes. Read one high-risk path from the tree, then locate the same conjunction in the exact source rule.",
    sourceSlides: [34],
  },
  {
    eyebrow: "Practice · Rule extraction",
    title: "Convert the moderate-risk paths into rules",
    content: <RulePractice />,
    note: "Timing: 3 minutes. Give students two minutes to derive the missing rule and one minute to compare with the model answer. Accept equivalent parenthesization.",
    sourceSlides: [33, 34],
  },
  {
    eyebrow: "Knowledge point 9 · Learning as search",
    title: "ID3 chooses the best next split without revisiting earlier choices",
    content: (
      <SourceExplanation
        alt="Historical description of decision-tree induction as concept-space search"
        caption="Exact source page 35 · representation, concept space, operations, and greedy search without backtracking."
        reverse
        slide={35}
      >
        <div className="m14-search-map">
          <article><span>State</span><strong>a partially built tree</strong></article>
          <article><span>Space</span><strong>all trees constructible from the examples</strong></article>
          <article><span>Operator</span><strong>add an attribute test</strong></article>
          <article><span>Heuristic</span><strong>choose maximum information gain</strong></article>
        </div>
        <SearchCallout label="Consequence" tone="amber">Greedy and no backtracking makes ID3 efficient, but the locally best split need not produce the globally smallest or best-generalizing tree.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 2 minutes. Connect the source's concept-space framing to earlier search meetings: representation, operators, heuristic, and no backtracking.",
    sourceSlides: [35],
  },
  {
    eyebrow: "Textbook / modern supplement · Task and capacity",
    title: "Classification predicts categories; regression predicts numbers",
    content: (
      <div className="m14-modern-grid">
        <article><span>Classification</span><strong>categorical target</strong><p>risk ∈ high, moderate, low; evaluate class errors and probabilities</p></article>
        <article><span>Regression</span><strong>numeric target</strong><p>predict expected loss or dollar amount; evaluate residual magnitude</p></article>
        <article><span>Overfitting</span><strong>training detail becomes brittle rules</strong><p>deep branches can fit noise, rare cases, or mislabeled records</p></article>
        <article><span>Pruning</span><strong>remove unsupported complexity</strong><p>pre-prune with stopping rules or post-prune using validation evidence</p></article>
        <SearchCallout label="Model-selection discipline" tone="green">Fit the tree on training data, choose depth or pruning on validation data, and report the untouched test set once.</SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Clearly label this as a supplement. Contrast risk class with expected financial loss, then connect pruning to the earlier MML simplicity motivation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook / modern supplement · Error analysis",
    title: "A confusion matrix separates correct predictions from two error types",
    content: <MetricsLab />,
    note: "Timing: 3 minutes. Let students switch operating points. Ask which preset is preferable if failing to flag a truly high-risk application is the costlier error, then challenge that premise from a lending-fairness perspective.",
    sourceSlides: [],
  },
  {
    eyebrow: "Assessment · Responsible evaluation",
    title: "Responsible evaluation needs more than one overall score",
    content: (
      <div className="m14-exit">
        <section>
          <span>Evaluation lens</span>
          <div>
            <article><strong>ROC vs PR</strong><p>ROC compares TPR and FPR; PR is often more revealing when the positive class is rare.</p></article>
            <article><strong>Calibration</strong><p>Among predictions near 0.7, roughly 70% should occur if probabilities are calibrated.</p></article>
            <article><strong>Subgroups</strong><p>Report error, recall, calibration, and sample size for relevant groups—not only the aggregate.</p></article>
          </div>
        </section>
        <section>
          <span>Exit ticket · 2 minutes</span>
          <ol>
            <li>Why did ID3 choose income first?</li>
            <li>Write one root-to-leaf rule.</li>
            <li>Name one evaluation result needed beyond accuracy.</li>
          </ol>
          <h3>Continue the learning</h3>
          <ul>
            <li>Course source: L09 Machine Learning Part A, pages 20–35.</li>
            <li>Luger, <em>Artificial Intelligence</em>, 6th ed., Chapters 10 and 12.</li>
            <li>Russell &amp; Norvig, <em>AIMA</em>, 3rd ed., Chapter 18.</li>
            <li>Quinlan, “Induction of Decision Trees,” 1986.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Collect the three-part exit ticket. The planned timings across all 25 pages total 75 minutes. Reinforce that pages 20–35 are the historical foundation and pages 23–25 add labeled modern evaluation practice.",
    sourceSlides: [],
  },
];

const lesson16InstructorNotes = [
  `This lesson follows one complete classification problem from data to evaluation. The table shows fourteen past loan applications. Each row contains applicant attributes and a historical risk label. Our goal is to build a decision tree that predicts high, moderate, or low risk for a new application. The opening question—what should the tree ask first—is the central problem solved by information gain.

We will move through five stages. First, identify inputs and the target label. Second, learn how a tree represents a sequence of questions. Third, trace the ID3 algorithm that builds the tree. Fourth, calculate entropy and information gain to select a split. Finally, evaluate what the tree can and cannot support. Because this is a lending example, we must also question the labels and attributes themselves. A transparent path is useful, but explainability does not automatically make a model accurate, fair, or ready for deployment.`,

  `These five verbs describe the work you should be able to perform. Represent means read the root, internal nodes, branches, and leaves of a decision tree. Induce means trace how ID3 builds that representation from labeled examples. Calculate means find entropy, expected entropy, and information gain. Interpret means convert a root-to-leaf path into an understandable IF–THEN rule. Evaluate means choose evidence appropriate to the cost of different errors.

Use the roadmap interactively and connect every verb to an artifact. The training table supports calculation. The tree supports representation and interpretation. The recursive procedure supports induction. The confusion matrix supports evaluation. By the end, a complete explanation should include one tree trace, why a particular root was selected, one extracted rule, and one metric chosen for a stated consequence.`,

  `Before naming an algorithm, define the learning problem. The target is financial risk with three possible labels: high, moderate, and low. The predictors are credit history, debt, collateral, and income. Past applications provide examples in which both predictor values and a historical target label are recorded.

The target and predictors play different roles. Predictors are information available when the model must make a decision. The target is the outcome the learner tries to predict. A record number is only an identifier and should not be treated as a meaningful predictor. We should also ask where the historical risk labels came from. If they reflect inconsistent judgments, old policy, or unequal treatment, a tree may reproduce those problems accurately. Learning a pattern in recorded labels is not the same as discovering an objective truth about a person.`,

  `Each row is a labeled example. We write x for the input vector: credit history, debt, collateral, and income. We write y for the known class label, which is one of high, moderate, or low risk. The dataset D contains fourteen pairs, x-sub-i and y-sub-i, where i identifies a row.

Use the table controls to select a row and read the complete example. Then select a column and compare its values with the risk labels. Visual inspection may suggest that income is predictive, but a few conspicuous rows can mislead us. ID3 needs a consistent numerical rule for comparing candidate attributes. That rule will be information gain. Notice that every probability we calculate later comes from class counts in these rows or in a subset created by a split.`,

  `A decision tree is a representation. ID3 is an algorithm for learning that representation. This distinction is important because many different algorithms can build trees, and a tree can also be written manually. Quinlan introduced ID3 in 1986 as an early top-down decision-tree induction procedure.

The learner begins with labeled data and selects an attribute test. Each possible attribute value creates a branch, and the examples are partitioned among those branches. If a branch contains only one class, it can become a leaf. Otherwise the process repeats on the smaller subset. The resulting tree describes conditional patterns in the data and can be translated into rules. ID3 is greedy: it chooses the best available split now rather than testing every possible complete tree.`,

  `A tree has four parts. The root is the first question asked of every example. An internal node is another attribute test. A branch represents one possible value of that tested attribute. A leaf stores the final predicted class. Trace the picnic example from the root to a leaf and say each step aloud: test the attribute, choose the matching value branch, and continue until a class is reached.

The quick check asks what a branch represents. The answer is an attribute value, not the attribute test itself. This distinction helps when reading rules. A node contributes the name of a condition, while a branch contributes the value used in that condition. One path therefore becomes a conjunction such as outlook equals sunny AND humidity equals high.`,

  `Classification uses one path through the tree. Begin at the root, evaluate that attribute for the applicant, follow the branch matching the observed value, and repeat until reaching a leaf. The leaf supplies the predicted risk class. The model does not vote over every available attribute.

Trace record 2 and another contrasting record. Notice that some applicants reach a leaf early, so later attributes are never examined. Collateral appears in the training table but is absent from this learned tree. That does not prove collateral is universally irrelevant. It means that, given this dataset and the greedy splits selected, collateral did not provide enough additional uncertainty reduction to be chosen. A different sample or algorithm could produce a different tree.`,

  `Use the controls to change an applicant's income, credit history, and debt. Before each click, predict the next node and final leaf. This turns the tree from a static picture into an executable decision procedure. Changing income may redirect the example at the root, after which an entirely different set of attributes is considered.

Pay attention to ignored features. Once a path reaches a leaf, every unvisited attribute has no effect on that prediction. This creates simple local explanations: the prediction occurred because this specific sequence of tests was satisfied. However, the explanation describes the model's logic, not necessarily a causal reason for financial risk. A transparent model can still rely on questionable inputs or biased labels.`,

  `ID3 is recursive because it applies the same procedure to progressively smaller subsets. The first base case occurs when all examples in the current subset have the same class. No additional question is needed, so the algorithm returns that class as a leaf. A second base case occurs when no attributes remain. The algorithm must then use a default, commonly the majority class.

In the recursive case, ID3 selects a candidate test, partitions the examples by its values, and calls itself on every mixed branch. The greedy step is the local choice of the attribute with highest information gain. Noise, missing values, unseen values, and ties require implementation decisions beyond this compact pseudocode. The core idea is nevertheless simple: stop when a decision is justified; otherwise ask the most informative available question and repeat.`,

  `The staged diagram converts the pseudocode into a visible cycle. First select the best test for the current examples. Second partition the rows by the values of that attribute. Third inspect each partition. A pure group contains only one class and becomes a leaf. A mixed group remains uncertain and becomes a smaller learning problem. Fourth repeat the procedure on each mixed group using the remaining attributes.

Purity matters because a pure branch already has an unambiguous class label in the training data. Further splitting would add complexity without changing those labels. Each recursive call receives only the local subset, so the best next attribute can differ between branches. The completed tree is therefore not one global ranking of attributes; it is a sequence of locally selected tests.`,

  `Several different trees may classify all fourteen training records correctly. Which should we prefer? A smaller tree is easier to inspect and often less likely to encode accidental detail. This reflects a general preference for simple explanations, but simplicity is not a guarantee of better prediction.

A larger tree can fit rare cases or noise and perform worse on new applications. A tree that is too small can miss a real distinction and underfit. We therefore combine a simplicity preference with validation evidence. Ask students for one reason training accuracy may improve while performance on new data declines. The key answer is that additional branches can memorize peculiarities of the training sample instead of capturing stable patterns from the population.`,

  `Minimum Message Length gives a compression view of model selection. H-sub-i denotes one candidate hypothesis or tree. D is the dataset. Mlength is the number of bits required to describe something. The expression D given H-sub-i means the remaining information needed to describe the data after the hypothesis is known.

We seek a balance. A tiny hypothesis has low model cost but may leave many exceptions, producing a large residual cost. A huge memorizing tree has a large model cost even if it explains every training row. A useful pattern keeps the combined description short. The source's even-number example contains a counting error: the even integers from 2 through 100 number fifty, not forty-nine. The compression point remains valid because one short rule replaces a long list.`,

  `Entropy measures uncertainty in a set of class labels. For a class c, p of c is its proportion in the set. I of c equals negative log base two of p of c, which measures information in bits. H of S adds p of c times that information across all classes. Sigma means sum one term for every class.

If all examples have one label, the distribution is pure and entropy is zero. There is no uncertainty about the class of a randomly selected member. Entropy is largest when the classes are evenly balanced. We use the convention that zero times log zero contributes zero. Entropy describes the label distribution in a dataset or branch; it does not describe the visual complexity or size of the tree.`,

  `Move the slider from a pure ten-to-zero distribution toward five-to-five. At ten-to-zero, the class is known with certainty and entropy is zero. As the minority class grows, uncertainty increases. At five-to-five, neither label is more likely, so binary entropy reaches its maximum of one bit.

Now continue toward zero-to-ten. The curve is symmetric because entropy depends on the proportions, not on which class is named positive. Ask students to predict the direction before revealing each value. This visual prepares us for tree induction: a useful split creates child groups that are more pure than the parent. ID3 measures the remaining uncertainty after a split and prefers the attribute that removes the most.`,

  `Information gain compares uncertainty before and after a candidate split. T is the current training subset. X is an attribute under consideration. For each value v of X, T-sub-v contains the rows having that value. Compute the entropy of each branch and weight it by the branch's fraction of the data. Their sum E of X is the expected entropy after testing X.

Gain of X equals the parent entropy H of T minus that expected entropy. Larger gain means the question removes more uncertainty about the class labels. The weights are essential: a tiny pure branch should not dominate a large mixed branch. ID3 chooses the candidate with maximum information gain. Raw gain can favor attributes with many distinct values, which motivates alternatives such as gain ratio in other tree algorithms.`,

  `The parent dataset contains six high-risk, three moderate-risk, and five low-risk records. Substituting those proportions into the entropy equation gives 1.531 bits. Now split by income. The lowest-income branch is pure high risk, so its entropy is zero. Other income branches contribute according to both their impurity and their size.

The weighted expected entropy after the income split is 0.564. Subtracting from the parent entropy gives a gain of 0.967 bits. Compare this with credit history at 0.266, collateral at 0.206, and debt at 0.063. Income removes the most expected uncertainty, so ID3 selects it as the root. The number 0.967 is not accuracy; it is the reduction in label uncertainty produced by this split on the training data.`,

  `This practice page compares every candidate root test. The parent entropy is identical in every calculation because all attributes are being evaluated on the same fourteen records. What changes is the expected entropy after each proposed split.

Choose one attribute and verify its branch counts and weighted entropy. Predict the rank before revealing the values. Income should rank first because it produces the lowest expected uncertainty and therefore the highest gain. Credit history, collateral, and debt remove less. Ranking all candidates prevents us from selecting a visually appealing attribute without comparison. After the first split, the calculation must be repeated locally within each mixed branch rather than reusing this global ranking.`,

  `The root split on income divides one fourteen-row problem into smaller problems. The low-income branch is already pure high risk and becomes a leaf. Other branches contain mixed labels and require additional tests. Each child receives only the records whose income follows that branch.

Use the record identifiers in the source figure to verify the subsets. Within each subset, recompute class proportions and information gain using the remaining attributes. An attribute that was weak globally may become useful locally because the distribution has changed. This is the recursive character of tree induction. It is also greedy: once income is chosen at the root, ID3 does not backtrack and reconsider an entirely different first split after seeing later consequences.`,

  `The finished tree contains leaves for three risk classes. Income is the root because it produced the largest initial gain. Credit history and debt appear only on branches where they help resolve remaining uncertainty. Debt is tested specifically for middle-income applicants with unknown credit history. Collateral never appears.

Count the leaves and trace at least one path to each class. A feature's absence from the tree means the learner did not select it under this data and greedy procedure; it does not establish that the feature has no relationship to risk in the wider population. The final tree perfectly summarizes patterns in this small table, but its performance on new applications remains an empirical question requiring separate data.`,

  `Every root-to-leaf path can be translated into an IF–THEN rule. The conditions encountered along one path are joined with AND because all must hold for that leaf to be reached. If several different leaves predict the same class, their complete paths are joined with OR.

The left-hand side, or LHS, contains the attribute conditions. The right-hand side, or RHS, contains the predicted class. Read one high-risk path directly from the tree, then compare it with the corresponding rule. This translation makes the model easier to inspect and implement. It also shows that attributes not encountered on the path impose no condition for that rule. Equivalent rules may use different parentheses, but they must preserve the same logical grouping of AND within paths and OR across paths.`,

  `Now derive the moderate-risk concept. Locate every leaf labeled moderate and trace backward to the root. Write one conjunction for each path, preserving every test and branch value. Then join the path rules with OR because any one of them is sufficient to predict moderate risk.

Do not combine conditions merely because they look similar unless the resulting rule covers exactly the same cases. After writing the expression, test it against the original rows and one imagined new applicant. The model answer may use different parentheses or ordering, but it should represent the same set of root-to-leaf paths. Rule extraction is interpretation of the learned tree, not a new learning step.`,

  `ID3 can be understood as heuristic search. A search state is a partially built tree. The concept space contains the trees constructible from the available examples and attributes. An operator adds an attribute test and its branches. The heuristic is information gain, which ranks the possible next tests.

The algorithm is greedy because it chooses the locally best split and does not backtrack. This makes learning practical, but the highest-gain next step does not guarantee the globally smallest tree or the best generalization. Connect this to earlier search lessons: representation determines the possible states, operators determine legal moves, and the heuristic guides which move is chosen. The final result depends on all three as well as on the training examples.`,

  `Decision trees can support different prediction tasks. Classification predicts categories such as high, moderate, or low risk. Regression predicts a numeric quantity such as expected financial loss. The target type changes the split criterion and evaluation measures.

Overfitting occurs when branches capture noise, rare coincidences, or mislabeled records rather than stable patterns. Pruning controls complexity. Pre-pruning stops growth using conditions such as minimum sample size or maximum depth. Post-pruning grows a larger tree and then removes branches that lack validation support. Keep data roles separate: fit the tree on training data, choose pruning or depth using validation data, and report final performance on an untouched test set. This modern workflow makes the earlier simplicity argument operational.`,

  `A confusion matrix separates four outcomes for a chosen positive class. True positives are correctly flagged positives. False negatives are actual positives the model misses. False positives are negative cases incorrectly flagged. True negatives are correctly rejected negatives. Precision equals true positives divided by all predicted positives. Recall equals true positives divided by all actual positives. F1 is the harmonic mean of precision and recall.

Switch operating points and watch the tradeoff. If missing a truly high-risk case is considered more costly, higher recall may be preferred, but that policy assumption must be justified. In lending, falsely flagging applicants can also create serious harm and unequal access. Metrics do not decide values for us; they quantify consequences under a stated definition of the positive class and chosen threshold.`,

  `One aggregate score cannot establish readiness for deployment. ROC analysis compares true-positive and false-positive rates across thresholds. Precision–recall analysis is often more revealing when the positive class is rare. Calibration asks whether predicted probabilities match observed frequencies—for example, whether cases assigned probability 0.7 occur about seventy percent of the time.

Subgroup evaluation reports errors, recall, calibration, and sample size for relevant groups rather than hiding variation inside an overall average. For the exit ticket, explain why income was selected first, write one complete root-to-leaf rule, and name evidence needed beyond accuracy. A strong final answer connects the mathematical calculation to the tree representation and then limits the claim using evaluation on unseen, representative data.`,
] as const;

const lesson16Timing = [1, 1, 3, 4, 3, 3, 4, 4, 2, 3, 3, 3, 3, 4, 3, 4, 5, 3, 3, 3, 2, 3, 3, 3, 2] as const;

slides.forEach((slide, index) => {
  slide.note = `Timing: ${lesson16Timing[index]} minutes. ${lesson16InstructorNotes[index]}`;
});

export function Meeting14Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Module 11 · Lesson 16"
      meetingTitle="Decision Trees, ID3, and Evaluation"
      resolveSourceReference={resolveMeeting14SourceReference}
      slides={slides}
      sourceCollectionLabel={SOURCE_DECK_LABEL}
    />
  );
}
