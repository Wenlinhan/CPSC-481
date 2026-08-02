"use client";

import { useMemo, useState } from "react";
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

function LoanDataTable() {
  return <div className="m14-loan-table-wrap"><table className="m14-loan-table"><thead><tr><th>No.</th><th>Risk</th><th>Credit history</th><th>Debt</th><th>Collateral</th><th>Income</th></tr></thead><tbody>{loanRecords.map(row => <tr key={row[0]}>{row.map((cell,index) => <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
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
  return <article className={`m14-source-frame m14-source-rebuilt ${className}`.trim()} aria-label={alt}><span>Course-source reconstruction · page {slide}</span><h3>{page.title}</h3>{usesTable ? <LoanDataTable /> : usesTree ? <CompactRiskTree picnic={slide === 22} /> : <ol>{page.points.map(point => <li key={point}>{point}</li>)}</ol>}{(usesTable || usesTree) && <small>{page.points.join(" · ")}</small>}</article>;
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
    title: "Decision trees: from examples to explainable rules",
    subtitle: "Loan-risk classification, ID3, entropy, information gain, and responsible evaluation.",
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
    title: "Represent, induce, calculate, interpret, and evaluate",
    content: (
      <div className="m14-objectives">
        <article><span>01</span><strong>Represent</strong><p>a classification concept as internal tests, branches, leaves, and rules</p></article>
        <article><span>02</span><strong>Induce</strong><p>a tree through ID3&apos;s top-down recursive, greedy search</p></article>
        <article><span>03</span><strong>Calculate</strong><p>entropy, expected entropy, and information gain for the loan data</p></article>
        <article><span>04</span><strong>Evaluate</strong><p>overfitting, pruning, error types, ranking, calibration, and subgroup behavior</p></article>
      </div>
    ),
    note: "Timing: 1 minute. The assessment evidence will be one tree trace, one information-gain explanation, one rule, and one justified metric choice.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 · Learning problem",
    title: "The target is risk; the evidence is past loan applications",
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
    title: "A training table is a set of labeled input–output examples",
    content: (
      <SourceExplanation
        alt="Complete 14-row loan-risk training data table"
        caption="Exact source page 23 · all 14 records and their attribute values remain visible and enlargeable."
        reverse
        slide={23}
      >
        <div className="m14-data-anatomy">
          <article><span>x</span><strong>Input vector</strong><p>(credit history, debt, collateral, income)</p></article>
          <article><span>y</span><strong>Class label</strong><p>financial risk ∈ {`{high, moderate, low}`}</p></article>
          <article><span>D</span><strong>Training set</strong><p>14 observed pairs (xᵢ, yᵢ)</p></article>
        </div>
        <SearchCallout label="Think · pair · share" tone="cyan">Which attribute looks most predictive by inspection? State the evidence in the table, not just your intuition.</SearchCallout>
      </SourceExplanation>
    ),
    note: "Timing: 4 minutes. Let pairs inspect the exact data. Surface that visual inspection can suggest a split, but ID3 needs a quantitative selection rule.",
    sourceSlides: [23],
  },
  {
    eyebrow: "Knowledge point 2 · Decision Tree Induction",
    title: "ID3 learns a tree that describes class patterns",
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
    title: "Internal nodes test attributes; leaves decide classes",
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
    title: "A risk tree turns attribute values into a class",
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
    title: "Change an applicant and watch the decision path change",
    content: <RiskTreeTrace />,
    note: "Timing: 4 minutes. Invite students to choose attribute values. Before each change, ask them to predict the leaf and identify which attributes will be ignored.",
    sourceSlides: [24, 33],
  },
  {
    eyebrow: "Knowledge point 3 · ID3 algorithm",
    title: "ID3 recursively turns impure partitions into subtrees",
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
    title: "Select, partition, test purity, then recurse",
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
    title: "If several trees fit the data, which one should we prefer?",
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
    title: "A useful pattern compresses the data it explains",
    content: (
      <SourceExplanation
        alt="Historical minimum-message-length motivation and even-number example"
        caption="Exact source page 28 · preserved unchanged; the rebuilt explanation corrects its counting error."
        slide={28}
      >
        <div className="m14-mml">
          <code>Choose Hᵢ minimizing Mlength(Hᵢ) + Mlength(D | Hᵢ)</code>
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
    title: "Entropy measures uncertainty in a class distribution",
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
    title: "Purity lowers entropy; a 50/50 split maximizes it",
    content: <EntropyLab />,
    note: "Timing: 4 minutes. Move the slider from 10/0 through 5/5. Ask students to predict the curve before showing numeric values.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Knowledge point 6 · Attribute selection",
    title: "Choose the test that removes the most expected uncertainty",
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
    title: "Income reduces uncertainty by 0.967 bits",
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
    title: "Rank every candidate test before selecting the root",
    content: <GainReveal />,
    note: "Timing: 5 minutes. Students calculate or verify one candidate in pairs, predict the rank, then reveal the comparison row by row. Ask why the same parent entropy appears in every gain calculation.",
    sourceSlides: [31],
  },
  {
    eyebrow: "Knowledge point 7 · Partial trees",
    title: "One greedy choice creates new, smaller learning problems",
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
    title: "The completed tree encodes three risk concepts",
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
    title: "Each root-to-leaf path becomes one conjunction",
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
    title: "Write the moderate-risk concept as rules",
    content: <RulePractice />,
    note: "Timing: 3 minutes. Give students two minutes to derive the missing rule and one minute to compare with the model answer. Accept equivalent parenthesization.",
    sourceSlides: [33, 34],
  },
  {
    eyebrow: "Knowledge point 9 · Learning as search",
    title: "ID3 greedily searches a concept space of possible trees",
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
    title: "Classification predicts categories; regression predicts quantities",
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
    title: "A confusion matrix turns errors into precision, recall, and F1",
    content: <MetricsLab />,
    note: "Timing: 3 minutes. Let students switch operating points. Ask which preset is preferable if failing to flag a truly high-risk application is the costlier error, then challenge that premise from a lending-fairness perspective.",
    sourceSlides: [],
  },
  {
    eyebrow: "Assessment · Responsible evaluation",
    title: "One score is not enough evidence for deployment",
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
