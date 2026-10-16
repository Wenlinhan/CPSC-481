"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import { SearchCallout } from "./SearchLessonPrimitives";
import styles from "./Meeting10Deck.module.css";

const L11_RENDER_ROOT = "/course-source/l11-probability-bayes/slide-renders";
const L12_RENDER_ROOT = "/course-source/l12-conditional-independence/slide-renders";
const L11_MEDIA_ROOT = "/course-source/l11-probability-bayes/raw-media";
const L12_MEDIA_ROOT = "/course-source/l12-conditional-independence/media";
const L11_SOURCE_DECK_LABEL = "L11 Stochastic Methods · Part A";
const L12_SOURCE_DECK_LABEL = "L12 Stochastic Methods · Part B";

function resolveMeeting10SourceReference(sourceSlide: number) {
  const isL11Source = sourceSlide >= 35;
  const deckLabel = isL11Source ? L11_SOURCE_DECK_LABEL : L12_SOURCE_DECK_LABEL;
  const sourceRoot = isL11Source ? L11_RENDER_ROOT : L12_RENDER_ROOT;
  const sourceKey = isL11Source ? "l11-probability-bayes" : "l12-conditional-independence";
  return {
    deckLabel,
    image: `${sourceRoot}/slide-${String(sourceSlide).padStart(2, "0")}.png`,
    key: `${sourceKey}:${sourceSlide}`,
    page: sourceSlide,
  };
}

function Formula({ children, small = false }: { children: React.ReactNode; small?: boolean }) {
  return <div className={`${styles.formula} ${small ? styles.formulaSmall : ""}`}>{children}</div>;
}

function ProbabilityTable({
  caption,
  rows,
  highlight,
}: {
  caption: string;
  rows: Array<Array<string | number>>;
  highlight?: "bad" | "good";
}) {
  return (
    <table className={styles.probTable}>
      <caption>{caption}</caption>
      <thead><tr><th>T</th><th>W</th><th>P</th></tr></thead>
      <tbody>{rows.map((row, index) => (
        <tr key={`${caption}-${index}`}>
          {row.map((cell, column) => <td className={index === 0 && column === 2 && highlight ? (highlight === "bad" ? styles.badCell : styles.goodCell) : ""} key={column}>{cell}</td>)}
        </tr>
      ))}</tbody>
    </table>
  );
}

function CommonCauseDiagram({ cause, left, right }: { cause: string; left: string; right: string }) {
  return (
    <div className={styles.fork} aria-label={`${cause} is a common cause of ${left} and ${right}`}>
      <div className={`${styles.node} ${styles.causeNode}`}>{cause}</div>
      <div className={styles.arrow}>↙</div><div className={styles.arrow}>↘</div>
      <div className={styles.node}>{left}</div><div className={styles.node}>{right}</div>
    </div>
  );
}

function IndependenceTableCheck() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section>
      <span>Worked check · use one cell</span>
      <h3>Which joint table factorizes?</h3>
      <p>
        From the displayed marginals, P(T=hot)=0.5 and P(W=sun)=0.6.
        Independence therefore predicts P(hot,sun)=0.5×0.6=0.3.
      </p>
      <div className="best-first-step-controls">
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide analysis" : "Reveal analysis"}
        </button>
      </div>
      {revealed && (
        <SearchCallout label="P₂ factorizes; P₁ does not" tone="green">
          P₂(hot,sun)=0.3 and all four P₂ cells match P(T)P(W). P₁(hot,sun)=0.4,
          so a single counterexample disproves independence for P₁.
        </SearchCallout>
      )}
    </section>
  );
}

function CommonCauseCheck({
  x,
  y,
  cause,
}: {
  x: string;
  y: string;
  cause: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <section>
      <span>Common-cause reasoning</span>
      <h3>{x} and {y}</h3>
      <p>
        Decide whether they should be independent before observing {cause}, and
        whether the model supports independence after conditioning on {cause}.
      </p>
      <div className="best-first-step-controls">
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide claim" : "Reveal one defensible claim"}
        </button>
      </div>
      {revealed && (
        <SearchCallout label={`${x} ⟂ ${y} | ${cause}`} tone="cyan">
          They can be associated before conditioning because the shared cause
          changes both probabilities. In the proposed common-cause model,
          knowing {cause} screens them off. This is a modeling claim that data
          and domain knowledge must test.
        </SearchCallout>
      )}
    </section>
  );
}

const networkFactors = [
  {
    label: "B",
    factor: "P(B)",
    meaning: "Burglary is a root variable, so its local table is a prior.",
  },
  {
    label: "E",
    factor: "P(E)",
    meaning: "Earthquake is another root variable with its own prior.",
  },
  {
    label: "A",
    factor: "P(A | B,E)",
    meaning: "Alarm has two parents; its CPT has one row for each B,E assignment.",
  },
  {
    label: "J",
    factor: "P(J | A)",
    meaning: "John Calls needs only Alarm in its local conditional table.",
  },
  {
    label: "M",
    factor: "P(M | A)",
    meaning: "Mary Calls also needs only Alarm in its local conditional table.",
  },
];

function BurglaryNetworkDiagram({
  active = [],
  height = 150,
  label = "Bayesian network with Burglary and Earthquake pointing to Alarm, and Alarm pointing to John Calls and Mary Calls",
}: {
  active?: string | string[];
  height?: number;
  label?: string;
}) {
  const highlighted = new Set(Array.isArray(active) ? active : [active]);
  return (
    <div className={styles.network} aria-label={label} role="img" style={{ minHeight: height }}>
      <div className={`${styles.networkNode} ${styles.b} ${highlighted.has("B") ? styles.active : ""}`}>Burglary</div>
      <div className={`${styles.networkNode} ${styles.e} ${highlighted.has("E") ? styles.active : ""}`}>Earthquake</div>
      <div className={`${styles.networkArrow} ${styles.down1}`}>↘ &nbsp;&nbsp; ↙</div>
      <div className={`${styles.networkNode} ${styles.a} ${highlighted.has("A") ? styles.active : ""}`}>Alarm</div>
      <div className={`${styles.networkArrow} ${styles.down2}`}>↙ &nbsp;&nbsp;&nbsp;&nbsp; ↘</div>
      <div className={`${styles.networkNode} ${styles.j} ${highlighted.has("J") ? styles.active : ""}`}>John Calls</div>
      <div className={`${styles.networkNode} ${styles.m} ${highlighted.has("M") ? styles.active : ""}`}>Mary Calls</div>
    </div>
  );
}

function NetworkFactorizationExplorer() {
  const [active, setActive] = useState(0);
  const item = networkFactors[active];

  return (
    <div className={styles.networkExplorer}>
      <nav className={styles.factorControls} aria-label="Choose a Bayesian-network variable">
        {networkFactors.map((entry, index) => (
          <button
            className={active === index ? styles.selectedFactor : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <div className={styles.networkPanel}>
        <BurglaryNetworkDiagram active={item.label} height={188} />
        <p><strong>DAG:</strong> Burglary → Alarm ← Earthquake; Alarm → John Calls; Alarm → Mary Calls.</p>
      </div>
      <section className={styles.factorPanel}>
        <div className={styles.cptDefinition}>
          <strong>CPT = conditional probability table; CPTs = plural.</strong>
          <p>A node’s CPT lists the probability of each value of that variable for every combination of its parents’ values. Each row sums to 1.</p>
          <p><b>Example:</b> if Alarm=true, P(John Calls=true | Alarm=true)=0.90, so P(John Calls=false | Alarm=true)=0.10. Root nodes have no parents and use prior tables.</p>
        </div>
        <span className={styles.kicker}>Local factor · {item.label}</span>
        <h3>{item.factor}</h3>
        <p>{item.meaning}</p>
        <div className={styles.jointFactor}>
          <strong>Complete joint</strong>
          <span>P(B,E,A,J,M)</span>
          <small>= P(B)P(E)P(A|B,E)P(J|A)P(M|A)</small>
        </div>
      </section>
    </div>
  );
}

const separationCases = [
  { label: "1 · Two calls", path: "John Calls ← Alarm → Mary Calls", question: "If John calls, does that make Mary’s call more likely?", before: "Before knowing Alarm: yes, it can. John’s call is evidence that the alarm sounded, which also makes Mary’s call more likely.", after: "After Alarm is known: no extra information in this model. Once we know whether the alarm sounded, John’s call does not change the probability of Mary’s call.", rule: "J ⟂ M | A means: John Calls and Mary Calls are independent GIVEN Alarm.", term: "Common cause: Alarm influences both calls. Knowing the shared cause blocks this information path." },
  { label: "2 · Two possible causes", path: "Burglary → Alarm ← Earthquake", question: "Does learning about an earthquake change burglary belief?", before: "Before any alarm evidence: no, in this model. Burglary and Earthquake are modeled as independent root variables.", after: "If the alarm is known to have sounded: the causes become related. Evidence of an earthquake supplies another explanation for that alarm and can reduce belief in a burglary.", rule: "B ⟂ E before alarm evidence; B and E need not be independent GIVEN Alarm.", term: "Collider: two arrows meet at Alarm. Observing this shared effect opens an information path; competing causes can explain it away." },
];

function GraphicalIndependenceStudio() {
  const [active, setActive] = useState(0);
  const item = separationCases[active];
  return <div className={styles.explainGrid}>
    <section className={styles.explainPanel}>
      <h3>The alarm-and-phone-call story</h3>
      <p>A house alarm may sound because of a burglary or an earthquake. John and Mary are neighbors who may telephone when they hear it.</p>
      <BurglaryNetworkDiagram active={active === 0 ? ["A", "J", "M"] : ["B", "E", "A"]} height={170} />
      <p><b>B</b> = Burglary; <b>E</b> = Earthquake; <b>A</b> = Alarm; <b>J</b> = John Calls; <b>M</b> = Mary Calls. Each is true or false.</p>
      <p><b>“Given”</b> means we already know the value. “Independent given A” means one observation adds no information about the other once A is known.</p>
    </section>
    <section className={styles.explainPanel}>
      <nav className={styles.explainTabs} aria-label="Choose an independence story">{separationCases.map((entry,index)=><button key={entry.label} type="button" aria-pressed={active===index} onClick={()=>setActive(index)}>{entry.label}</button>)}</nav>
      <h3>{item.question}</h3><div className={styles.storyPath}>{item.path}</div>
      <p><b>Without the shared evidence:</b> {item.before}</p>
      <p><b>With the shared evidence:</b> {item.after}</p>
      <div className={styles.explainTakeaway}>{item.rule}</div><p>{item.term}</p>
      <small>These conclusions follow the proposed network assumptions; the graph alone does not establish real-world causation.</small>
    </section>
  </div>;
}

function EnumerationPlan() {
  return <div className={styles.explainGrid}>
    <section className={styles.explainPanel}>
      <h3>Both neighbors have called. Was there a burglary?</h3>
      <p>John and Mary report the alarm. We know their calls occurred, but have not observed the earthquake or the alarm directly.</p>
      <div className={styles.variableCards}>
        <p><b>Question (query):</b> B = Burglary. Find P(B=true | J=true, M=true).</p>
        <p><b>Known evidence:</b> J = John Calls = true; M = Mary Calls = true.</p>
        <p><b>Hidden variables:</b> E = Earthquake and A = Alarm. Their values are unknown, so consider both true and false.</p>
      </div>
      <table className={styles.studyTable}><caption>Four hidden possibilities for EACH burglary value</caption><thead><tr><th>Earthquake E</th><th>Alarm A</th></tr></thead><tbody>{[["true","true"],["true","false"],["false","true"],["false","false"]].map(([e,a])=><tr key={e+a}><td>{e}</td><td>{a}</td></tr>)}</tbody></table>
    </section>
    <section className={styles.explainPanel}>
      <h3>Enumeration = list, multiply, add, compare</h3>
      <ol className={styles.explainSteps}>
        <li><b>Fix B=true.</b> List the four E,A possibilities shown on the left. Keep both calls true.</li>
        <li><b>Multiply</b> the five probabilities for each complete scenario, using the network’s local tables.</li>
        <li><b>Add</b> the four products. This is the probability of burglary AND both calls.</li>
        <li><b>Repeat for B=false.</b> Add its four products to get the no-burglary AND both-calls probability.</li>
        <li><b>Normalize:</b> divide the burglary total by the sum of both totals. The two posterior probabilities must sum to 1.</li>
      </ol>
      <div className={styles.storyPath}>One row = P(B) × P(E) × P(A | B,E) × P(J=true | A) × P(M=true | A)</div>
      <p>Use the true OR false entry matching each row. Σ means “add all possibilities”; normalization means “divide by their total.”</p>
      <small>With k hidden binary variables there are 2ᵏ combinations. Variable elimination saves work by reusing partial sums.</small>
    </section>
  </div>;
}

function EnumerationTrace() {
  const [burglary, setBurglary] = useState(true);
  const rows = [true,false].flatMap(e=>[true,false].map(a=>{
    const pb=burglary ? .001 : .999, pe=e ? .002 : .998;
    const alarm=burglary ? (e ? .95 : .94) : (e ? .29 : .001);
    const pa=a ? alarm : 1-alarm, pj=a ? .90 : .05, pm=a ? .70 : .01;
    return {e,a,pb,pe,pa,pj,pm,value:pb*pe*pa*pj*pm};
  }));
  const yes=.00059224259, no=.001491857649, total=yes+no;
  return <div className={`${styles.explainGrid} ${styles.workedNumbers}`}>
    <section className={styles.explainPanel}>
      <h3>Where do the numbers come from?</h3>
      <p>Evidence: <b>John Calls=true and Mary Calls=true</b>. B=Burglary; E=Earthquake; A=Alarm. These are illustrative textbook probabilities.</p>
      <div className={styles.explainTakeaway}><b>Prior tables:</b> P(B=true)=0.001; P(E=true)=0.002.<br/>False entries are 0.999 and 0.998: use 1 − P(true).</div>
      <div className={styles.inputTables}>
        <table className={styles.studyTable}><caption>Alarm CPT</caption><thead><tr><th>B</th><th>E</th><th>P(A=true)</th></tr></thead><tbody>{[["true","true",".95"],["true","false",".94"],["false","true",".29"],["false","false",".001"]].map(r=><tr key={r.join()}>{r.map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table>
        <table className={styles.studyTable}><caption>Call CPTs</caption><thead><tr><th>A</th><th>P(J=true)</th><th>P(M=true)</th></tr></thead><tbody><tr><td>true</td><td>.90</td><td>.70</td></tr><tr><td>false</td><td>.05</td><td>.01</td></tr></tbody></table>
      </div>
      <p><b>CPT</b> = conditional probability table. Each Alarm row fixes B and E; each call row fixes A. In every row, P(false)=1−P(true).</p>
    </section>
    <section className={styles.explainPanel}>
      <nav className={styles.explainTabs} aria-label="Choose the burglary hypothesis"><button type="button" aria-pressed={burglary} onClick={()=>setBurglary(true)}>B=true</button><button type="button" aria-pressed={!burglary} onClick={()=>setBurglary(false)}>B=false</button></nav>
      <h3>Four scenarios with B={String(burglary)}</h3>
      <table className={styles.studyTable}><caption>Multiply P(B) × P(E) × P(A|B,E) × P(J=true|A) × P(M=true|A)</caption><thead><tr><th>E</th><th>A</th><th>Five factors → row probability</th></tr></thead><tbody>{rows.map(r=><tr key={String(r.e)+String(r.a)}><td>{String(r.e)}</td><td>{String(r.a)}</td><td><small>{r.pb} × {r.pe} × {r.pa.toFixed(3)} × {r.pj} × {r.pm}</small><br/><b>{r.value.toFixed(12)}</b></td></tr>)}</tbody></table>
      <p><b>Add these four rows:</b> {rows.reduce((v,r)=>v+r.value,0).toFixed(12)}.</p>
      <div className={styles.explainTakeaway}><b>Normalize the two totals</b><br/>P(B=true | both calls) = {yes.toFixed(9)} ÷ ({yes.toFixed(9)} + {no.toFixed(9)}) ≈ <b>{(100*yes/total).toFixed(1)}%</b>.</div>
      <p>Burglary rises from 0.1% to 28.4%; no burglary has {(100*no/total).toFixed(1)}%. The two results sum to 100%.</p>
    </section>
  </div>;
}

const modelAuditCases = [
  {
    label: "Assumption",
    claim: "Naive Bayes assumes features are marginally independent.",
    correction:
      "No. It assumes features are conditionally independent given the class: P(F₁,…,Fₙ|C)=∏ᵢP(Fᵢ|C).",
  },
  {
    label: "Decision",
    claim: "The classifier formula with a class prior is maximum likelihood.",
    correction:
      "With P(C) included, the argmax is maximum a posteriori (MAP). Maximum likelihood omits the class prior.",
  },
  {
    label: "Parameters",
    claim: "Training Naive Bayes always means estimating means and variances.",
    correction:
      "Only Gaussian Naive Bayes uses class-conditional means and variances. Bernoulli, multinomial, and categorical variants estimate different statistics.",
  },
  {
    label: "Robustness",
    claim: "Irrelevant features can never hurt Naive Bayes.",
    correction:
      "Weakly informative features may have little effect, but correlated or duplicated features can count the same evidence repeatedly and distort confidence.",
  },
];

function NaiveBayesModelAudit() {
  const [active, setActive] = useState(0);
  const item = modelAuditCases[active];

  return (
    <div className="search-review-studio">
      <nav aria-label="Choose a Naive Bayes evaluation claim">
        {modelAuditCases.map((entry, index) => (
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
      <ol>
        <li>
          <span>CLAIM</span>
          <p><strong>{item.claim}</strong></p>
        </li>
        <li>
          <span>VERDICT</span>
          <p>Revise before using this statement as evidence.</p>
        </li>
        <li>
          <span>CORRECT</span>
          <p>{item.correction}</p>
        </li>
        <li>
          <span>TEST</span>
          <p>Compare held-out accuracy, calibration, error types, and performance under feature dependence or distribution shift.</p>
        </li>
      </ol>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 9 · Lesson 12 · Structured uncertainty",
    title: "Conditional Independence, Bayesian Networks, and Naive Bayes",
    subtitle: "How can a small set of local assumptions represent and query a much larger joint distribution?",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Driving question</span>
          <h3>Which variables still matter once the right evidence is known?</h3>
          <p>
            Independence removes factors. Conditional independence removes
            factors only after a conditioning context is fixed. Graphs make
            those local claims visible and reusable.
          </p>
        </section>
        <div>
          <article><strong>Independence</strong><p>Test factorization, not intuition alone.</p></article>
          <article><strong>Bayesian network</strong><p>Encode local conditional distributions in a directed acyclic graph.</p></article>
          <article><strong>Inference</strong><p>Sum hidden variables and normalize evidence-compatible mass.</p></article>
          <article><strong>Naive Bayes</strong><p>Use a strong class-conditional independence assumption for efficient classification.</p></article>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Retrieve joint, conditional, product, and chain rules. Frame the lesson as representation plus inference, not merely formula manipulation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Independence · Equivalent tests",
    title: "Independence means learning Y does not change belief about X",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>Three equivalent views</span>
          <Formula>X ⟂ Y</Formula>
          <div className={styles.equiv}>
            <div><b>1</b><span>P(x|y)=P(x), when P(y)&gt;0</span></div>
            <div><b>2</b><span>P(y|x)=P(y), when P(x)&gt;0</span></div>
            <div><b>3</b><span>P(x,y)=P(x)P(y), for every x,y pair</span></div>
          </div>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Interpretation and test</span>
          <h3>Observing Y adds no information about X</h3>
          <p>For a finite joint table, test every cell. One mismatch disproves independence; every match is needed to establish it.</p>
          <SearchCallout label="Modeling caution" tone="amber">
            Exact independence is rare in empirical data. Treat it as a claim to
            justify or test, not a property inferred from variable names.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. State the positive-probability condition for conditional forms and distinguish exact mathematical independence from an approximation.",
    sourceSlides: [35],
  },
  {
    eyebrow: "Independence · Joint factorization",
    title: "Factorization replaces one joint table with smaller distributions",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="3">
        <section className={styles.panel}>
          <span className={styles.kicker}>Definition</span>
          <Formula>P(X,Y)=P(X)P(Y)</Formula>
          <div className={styles.stats}>
            <div><strong>2ⁿ</strong><span>joint rows for n binary variables</span></div>
            <div><strong>2n</strong><span>marginal entries if independent</span></div>
            <div><strong>∀</strong><span>every assignment must satisfy the equality</span></div>
          </div>
          <div className={styles.countVisual}>
            <strong>Example: three binary variables X, Y, Z</strong>
            <span>Joint table: 2 × 2 × 2 = 8 rows</span>
            <div className={styles.assignmentGrid}>{["000", "001", "010", "011", "100", "101", "110", "111"].map(row => <code key={row}>{row}</code>)}</div>
            <span>If independent: 2 + 2 + 2 = 6 entries</span>
            <div className={styles.marginalGrid}>{["X", "Y", "Z"].map(v => <div key={v}><b>{v}</b><span>P({v}=0)</span><span>P({v}=1)</span></div>)}</div>
          </div>
        </section>
        <section className={`${styles.panel} ${styles.countExplanation}`}>
          <span className={styles.kicker}>Representation consequence</span>
          <h3>Multiply choices; add stored entries</h3>
          <p>
            Each binary variable has two values. Listing all combinations gives
            2 × 2 × ··· × 2 = 2ⁿ joint rows. With mutual independence, store one
            two-entry probability table per variable: n × 2 = 2n entries.
          </p>
          <p><strong>Reconstruct any row:</strong> P(X=1,Y=0,Z=1) = P(X=1)P(Y=0)P(Z=1). All 8 outcomes still exist; their probabilities need not be stored separately.</p>
          <p><strong>Scale:</strong> 10 binary variables need 1,024 joint rows, or 20 marginal entries if mutually independent. Counting free parameters instead gives 2ⁿ−1 versus n, because probabilities normalize.</p>
          <SearchCallout label="Ask before factoring" tone="cyan">
            Use this reduction only when all variables are mutually independent.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: L12 Part B slide 3. Preserve the formula and the modeling-assumption warning. Contrast parameter counts without claiming real variables are usually independent.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Worked independence · Counterexample and proof",
    title: "One mismatched cell disproves independence",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="4">
        <div className={`${styles.panel} ${styles.tableRow}`}>
          <ProbabilityTable caption="P₁(T,W)" highlight="bad" rows={[["hot","sun",.4],["hot","rain",.1],["cold","sun",.2],["cold","rain",.3]]} />
          <ProbabilityTable caption="P₂(T,W)" highlight="good" rows={[["hot","sun",.3],["hot","rain",.2],["cold","sun",.3],["cold","rain",.2]]} />
          <div><ProbabilityTable caption="P(T)P(W)" rows={[["hot","sun",.3],["hot","rain",.2],["cold","sun",.3],["cold","rain",.2]]} /><p><strong>First cell:</strong> .5 × .6 = .3</p></div>
        </div>
        <IndependenceTableCheck />
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 4. Students test hot,sun first, then verify the remaining P2 cells. Emphasize that proof requires all cells but disproof needs one counterexample.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Worked independence · Repeated trials",
    title: "Independent coin flips turn an exponential joint into repeated local factors",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="5">
        <section className={styles.panel}>
          <span className={styles.kicker}>Worked event · H, T, H</span>
          <div className={styles.coinRow}><div className={styles.coin}>H</div><div className={styles.coin}>T</div><div className={styles.coin}>H</div></div>
          <Formula small>P(H,T,H)=0.5×0.5×0.5=0.125</Formula>
          <p>Fairness fixes each marginal at 0.5. Independence is the additional assumption that permits multiplication.</p>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>General factorization</span>
          <Formula>P(X₁,…,Xₙ)=∏ᵢP(Xᵢ)</Formula>
          <div className={styles.stats}>
            <div><strong>2ⁿ</strong><span>outcomes</span></div><div><strong>n</strong><span>local distributions</span></div><div><strong>0.5ⁿ</strong><span>per sequence</span></div>
          </div>
          <SearchCallout label="Quick check" tone="cyan">A fair coin does not logically guarantee independent flips; fair marginals alone do not rule out dependence over time.</SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Ask students for P(H,T,H)=0.5^3 and why fairness alone does not logically imply independence.",
    sourceSlides: [36, 5],
  },
  {
    eyebrow: "Conditional independence · Visual bridge",
    title: "A shared cause can explain why two observations move together",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="6">
        <section className={styles.panel}>
          <span className={styles.kicker}>From association to screening off</span>
          <h3>Smoke and an alarm can be associated because both depend on fire</h3>
          <p>
            Once the relevant state of the fire is known, a model may assert
            that smoke contributes no additional information about the alarm.
            That assertion is conditional—not absolute—independence.
          </p>
        </section>
        <figure className={`${styles.panel} ${styles.imagePanel}`}>
          <img alt="Fire produces smoke while an alarm activates" src={`${L12_MEDIA_ROOT}/image17.png`} />
          <figcaption>Fire is the common cause; Smoke and Alarm are its effects.</figcaption>
        </figure>
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: L12 Part B slide 6. Elicit candidate variables before naming conditional independence. Avoid claiming the relationship without a model or data.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Conditional independence · Definition",
    title: "Condition on Z, then test factorization inside every Z stratum",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="8">
        <section className={styles.panel}>
          <span className={styles.kicker}>Equivalent equations</span>
          <Formula small>X ⟂ Y | Z</Formula>
          <div className={styles.equiv}>
            <div><b>1</b><span>P(x,y|z)=P(x|z)P(y|z)</span></div>
            <div><b>2</b><span>P(x|y,z)=P(x|z)</span></div>
            <div><b>3</b><span>P(y|x,z)=P(y|z)</span></div>
          </div>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Read the quantifier</span>
          <h3>For all x, y, z with valid denominators</h3>
          <p>
            Conditional independence does not say X and Y are unrelated. It
            says that after Z is fixed, knowing Y does not further change the
            distribution of X.
          </p>
          <SearchCallout label="Why it matters" tone="green">
            These local claims are the main representational savings behind
            Bayesian networks and Naive Bayes.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 8. Preserve both equivalent equations. Ask why unconditional independence is rare and why conditioning can create a more useful claim.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Conditional independence · Dental example",
    title: "Cavity can screen Toothache from Catch",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="7">
        <div className={`${styles.panel} ${styles.dentalContext}`}>
          <img alt="Dental probe checking a tooth for a cavity" src={`${L12_MEDIA_ROOT}/image18.png`} />
          <p><strong>Scene:</strong> A patient visits a dentist. The patient may report tooth pain, and the dentist examines the tooth with a small pointed instrument called a dental probe or explorer.</p>
          <p><strong>“Probe catch”:</strong> the instrument’s tip catches or sticks at a spot on the tooth instead of moving smoothly. In this example, that observation is evidence about a possible cavity.</p>
          <p><strong>Three true/false variables:</strong> <b>Cavity</b> = a decayed hole is present; <b>Toothache</b> = the patient has tooth pain; <b>Catch</b> = the probe catches. + means present/yes; − means absent/no.</p>
          <p><strong>Why this example?</strong> A cavity can help explain both pain and a probe catch. The model asks whether pain still adds information about Catch once cavity status is known.</p>
        </div>
        <section className={styles.panel}>
          <span className={styles.kicker}>Translate the notation</span>
          <h3>Once Cavity is known, Toothache does not change Catch</h3>
          <ul>
            <li>P(Catch|Toothache,Cavity)=P(Catch|Cavity)</li>
            <li>P(Toothache|Catch,Cavity)=P(Toothache|Cavity)</li>
            <li>P(Toothache,Catch|Cavity)=P(Toothache|Cavity)P(Catch|Cavity)</li>
          </ul>
          <SearchCallout label="Model claim" tone="amber">
            The equations are equivalent under valid probabilities; whether the
            claim fits real dental data is empirical.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 7. Derive one equivalent statement from another with the product rule. Preserve both cavity and no-cavity cases shown in the figure.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Conditional independence · Weather domain",
    title: "Rain can screen Traffic from Umbrella",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="9">
        <div className={`${styles.panel} ${styles.scenePanel}`}><img src="/lesson-visuals/lesson12-rain-traffic-umbrella.svg" alt="Rain falling over a queue of slow-moving cars and a pedestrian holding an umbrella" /><CommonCauseDiagram cause="Raining" left="Traffic" right="Umbrella" /><Formula small>Traffic ⟂ Umbrella | Raining</Formula></div>
        <CommonCauseCheck x="Traffic" y="Umbrella" cause="Raining" />
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 9. Students draw Rain→Traffic and Rain→Umbrella, then state Traffic independent of Umbrella given Rain as a testable assumption.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Conditional independence · Safety domain",
    title: "Fire can screen Smoke from Alarm—but only under a simplified model",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="10">
        <div className={`${styles.panel} ${styles.scenePanel}`}><img src="/lesson-visuals/lesson12-fire-smoke-alarm.svg" alt="A fire producing smoke near a sounding alarm, illustrating the variables Fire, Smoke, and Alarm" /><CommonCauseDiagram cause="Fire" left="Smoke" right="Alarm" /><Formula small>Smoke ⟂ Alarm | Fire</Formula></div>
        <CommonCauseCheck x="Smoke" y="Alarm" cause="Fire" />
      </div>
    ),
    note: "Timing: 3 minutes. Provenance: L12 Part B slide 10. Surface counterexamples: smoke can directly trigger a detector, and a latent sensor fault may affect Alarm. Conditional independence follows the proposed model, not the nouns alone.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Probability recap · Tools for structured models",
    title: "Product and chain rules turn independence claims into factorization",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="11">
        <div className={`${styles.panel} ${styles.rules}`}>
          <article><strong>Conditional probability</strong>P(x|y)=P(x,y)/P(y)</article>
          <article><strong>Product rule</strong>P(x,y)=P(x|y)P(y)</article>
          <article><strong>Chain rule</strong>P(x₁,…,xₙ)=∏ᵢP(xᵢ|x₁,…,xᵢ₋₁)</article>
          <article><strong>Independence</strong>P(x,y)=P(x)P(y)</article>
        </div>
        <section className={styles.panel}>
          <span className={styles.kicker}>Retrieval check</span>
          <h3>Use the right rule for the right job</h3>
          <ul>
            <li>Conditional probability: divide a compatible joint by evidence mass.</li>
            <li>Product rule: reconstruct a joint from a conditional and marginal.</li>
            <li>Chain rule: factor any joint in an ordered sequence.</li>
            <li>Independence: simplify selected chain-rule terms.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Provenance: L12 Part B slide 11. Have students name which formulas are identities and which are modeling assumptions.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Textbook-grounded supplement · Bayesian-network semantics",
    title: "A Bayesian network: graph + local probabilities",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Representation</span>
          <h3>Each node conditions on its parents</h3>
          <BurglaryNetworkDiagram active="A" height={164} />
          <p>
            A directed acyclic graph orders dependencies. Each node Xᵢ has a
            conditional probability table P(Xᵢ|Parents(Xᵢ)).
          </p>
        </section>
        <div>
          <article><strong>Nodes</strong><p>Random variables with explicit domains.</p></article>
          <article><strong>Directed edges</strong><p>Direct probabilistic dependencies in the chosen representation.</p></article>
          <article><strong>Acyclic</strong><p>No directed path can return to its starting node.</p></article>
          <SearchCallout label="Interpret carefully" tone="amber">
            An arrow does not prove causation. A causally designed network needs
            stronger assumptions than the probabilistic semantics alone.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Clearly label this as a textbook-grounded supplement: Russell and Norvig, 3e, Chapters 13-14. L11 Part A and selected L12 slides do not themselves teach Bayesian-network semantics.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · DAG and CPT factorization",
    title: "CPTs: local tables form the joint distribution",
    content: <NetworkFactorizationExplorer />,
    note: "Timing: 3 minutes. Use the canonical burglary–earthquake–alarm–calls network. Students select each node, state its parents, and assemble P(B,E,A,J,M)=P(B)P(E)P(A|B,E)P(J|A)P(M|A).",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Graphical independence",
    title: "When does one observation change another belief?",
    content: <GraphicalIndependenceStudio />,
    note: "Timing: 3 minutes. Introduce only the d-separation patterns needed here: common cause and collider. Make conditioning sets explicit and demonstrate explaining away at Alarm.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Exact inference",
    title: "Both neighbors called: what must we calculate?",
    content: <EnumerationPlan />,
    note: "Timing: 3 minutes. Textbook-grounded supplement. Students identify Earthquake and Alarm as hidden. Connect exponential enumeration to the value of factor structure.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Worked network",
    title: "From two phone calls to a burglary probability",
    content: <EnumerationTrace />,
    note: "Timing: 5 minutes. Use canonical CPTs: P(B)=.001, P(E)=.002; Alarm .95/.94/.29/.001; John .90/.05; Mary .70/.01. Predict before each step. The posterior is approximately .284, not near one.",
    sourceSlides: [],
  },
  {
    eyebrow: "Naive Bayes · Class-conditional factorization",
    title: "Given the class, treat feature likelihoods as independent factors",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>From chain rule to the shortcut</span>
          <Formula small>P(F₁,…,Fₙ|C) ≈ ∏ᵢP(Fᵢ|C)</Formula>
          <div className={styles.featureFlow}>
            <div className={styles.classBox}><strong>Class C</strong><br/>apple / not apple</div><div className={styles.arrow}>→</div>
            <div className={styles.featureStack}><span>size</span><span>color</span><span>shape</span></div>
          </div>
          <p>Every feature is conditioned on the same class. The approximation drops dependencies among features within each class.</p>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Correct assumption</span>
          <h3>Fᵢ ⟂ Fⱼ | C, not Fᵢ ⟂ Fⱼ</h3>
          <p>
            Features such as fruit shape, color, and size may be associated
            overall because classes occur in different proportions. Naive
            Bayes asserts independence only after the class is fixed.
          </p>
          <SearchCallout label="Classification score" tone="green">
            score(C)=P(C)∏ᵢP(Fᵢ|C). The shared evidence denominator can be
            omitted when comparing classes.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Retain the apple/not-apple hypotheses; size, color, shape features; trained class priors and class-conditional feature probabilities. Correct marginal independence to conditional independence.",
    sourceSlides: [37],
  },
  {
    eyebrow: "Naive Bayes · Classifier decision",
    title: "The class prior and feature likelihoods produce a MAP decision",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>Decision rule</span>
          <Formula small>ĉ = argmaxᶜ P(C)∏ᵢP(eᵢ|C)</Formula>
          <div className={styles.scoreCards}>
            <article><span>Maximum likelihood</span><strong>∏P(eᵢ|C)</strong><p>uses feature likelihood only</p></article>
            <article><span>MAP</span><strong>P(C)∏P(eᵢ|C)</strong><p>also uses the class prior</p></article>
          </div>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Compute in log space</span>
          <h3>ĉ = argmaxᶜ P(C)∏ᵢP(eᵢ|C)</h3>
          <ul>
            <li>Estimate P(C) from class frequency or a justified prior.</li>
            <li>Estimate P(eᵢ|C) within each class.</li>
            <li>Use log probabilities in software to avoid numerical underflow.</li>
            <li>Text classification and spam filtering are common fits.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Correct terminology: including the class prior yields MAP. Ask why multiplying many small probabilities motivates log-space computation.",
    sourceSlides: [38],
  },
  {
    eyebrow: "Naive Bayes · Fruit example",
    title: "Training estimates local probabilities; testing compares class scores",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>Training → testing</span>
          <div className={styles.timeline}>
            <article><strong>1 · Data</strong>apples, grapes, other fruit</article>
            <article><strong>2 · Estimate</strong>priors and feature likelihoods</article>
            <article><strong>3 · Score</strong>apple vs not-apple</article>
            <article><strong>4 · Decide</strong>0.8 vs 0.2 → apple</article>
          </div>
          <Formula small>score(C)=P(C)P(size|C)P(color|C)P(shape|C)</Formula>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Example structure</span>
          <h3>Apple versus not-apple</h3>
          <ul>
            <li>Training data: apples, grapes, and other fruits.</li>
            <li>Features: size, color, and shape.</li>
            <li>Classes: apple and not-apple.</li>
            <li>Testing: compare posterior class scores; 0.8 versus 0.2 selects apple.</li>
          </ul>
          <SearchCallout label="Do not overread 0.8" tone="amber">
            A normalized model score is not automatically calibrated as an 80%
            real-world chance. Check held-out calibration and data shift.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Retain the training/features/hypotheses/testing sequence and correct its 'maximum likelihood' wording to posterior or MAP classification.",
    sourceSlides: [39],
  },
  {
    eyebrow: "Sequence model · Pronouncing “tomato”",
    title: "A probabilistic finite-state acceptor models alternative phone paths",
    content: (
      <div className={styles.nativeGrid}>
        <figure className={`${styles.panel} ${styles.imagePanel}`}>
          <img className={styles.sourceFragment} alt="Probabilistic phone-state paths for pronunciations of tomato" src={`${L11_MEDIA_ROOT}/image99.png`} />
          <figcaption>Transition probabilities encode alternative phone paths; 0.60 goes directly from /t/ to /m/.</figcaption>
        </figure>
        <section className={styles.panel}>
          <span className={styles.kicker}>Preserve the model; correct the label</span>
          <h3>This is a probabilistic sequence model, not Naive Bayes by itself</h3>
          <p>
            A finite-state acceptor assigns probabilities to transitions among
            phone states. It characterizes pronunciation variants and can help
            interpret ambiguous phone sequences.
          </p>
          <SearchCallout label="Source note" tone="cyan">
            In the displayed data, 60% of speakers go from the initial /t/
            directly to /m/ without an intervening vowel phone.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the phone-state graph and speaker note. Explicitly correct the label: a probabilistic finite-state acceptor is not evidence of a Naive Bayes factorization.",
    sourceSlides: [40],
  },
  {
    eyebrow: "Speech recognition · Prior × phone likelihood",
    title: "A common word can outrank a perfect phone match",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>Corpus prior</span>
          <Formula small>P(word | [ni]) ∝ P([ni] | word)P(word)</Formula>
          <table className={styles.speechTable}><thead><tr><th>word</th><th>frequency</th><th>P(word)</th></tr></thead><tbody>
            <tr><td>knee</td><td>61</td><td>.000024</td></tr><tr><td>the</td><td>114,834</td><td>.046</td></tr><tr><td>neat</td><td>338</td><td>.00013</td></tr><tr><td>need</td><td>1,417</td><td>.00056</td></tr><tr><td>new</td><td>2,625</td><td>.001</td></tr>
          </tbody></table>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Candidate words</span>
          <h3>knee · the · neat · need · new</h3>
          <p>
            Compare candidates with an unnormalized Bayes score:
            P(word|ni) ∝ P(ni|word)P(word).
          </p>
          <ul>
            <li>The combined corpora contain about 2.5 million words.</li>
            <li>“the” appears because its prior is high, even though its phone likelihood will be zero.</li>
            <li>Predict the winner before revealing the calculated table.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the candidate list, Brown/Switchboard corpus sizes, and why 'the' appears. Ask students to distinguish prior from likelihood.",
    sourceSlides: [41],
  },
  {
    eyebrow: "Speech recognition · Result and missing context",
    title: "Phone-only decoding selects “new”; word context favors “need”",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>Phone-only score</span>
          <table className={styles.speechTable}><thead><tr><th>word</th><th>P([ni]|word)</th><th>P(word)</th><th>product</th></tr></thead><tbody>
            <tr className={styles.winner}><td>new</td><td>.36</td><td>.001</td><td>.00036</td></tr><tr><td>neat</td><td>.52</td><td>.00013</td><td>.000068</td></tr><tr><td>need</td><td>.11</td><td>.00056</td><td>.000062</td></tr><tr><td>knee</td><td>1.0</td><td>.000024</td><td>.000024</td></tr><tr><td>the</td><td>0</td><td>.046</td><td>0</td></tr>
          </tbody></table>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Read the evidence</span>
          <h3>Local winner: new</h3>
          <p>
            The displayed model uses only the phone evidence and word prior, so
            it favors “new.” But the preceding word is “I”: corpus evidence
            makes “I need” more plausible than “I new.”
          </p>
          <SearchCallout label="Model repair" tone="green">
            Add contextual variables or a sequence/language model. Better
            representation can matter more than refining the same local score.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Preserve all note answers: P(ni|the)=0; phone-only winner new; 'I new' is implausible; two-word context favors 'I need'; the displayed score omits I.",
    sourceSlides: [42],
  },
  {
    eyebrow: "Naive Bayes evaluation · Qualified claims",
    title: "Naive Bayes is efficient, but the variant and dependencies matter",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>Evaluation matrix</span>
          <div className={styles.rules}>
            <article><strong>Strength · efficient</strong>Simple counts or distribution estimates; fast prediction.</article>
            <article><strong>Strength · incremental</strong>Sufficient statistics can often update from streaming data.</article>
            <article><strong>Risk · dependence</strong>Correlated features may count the same evidence repeatedly.</article>
            <article><strong>Risk · calibration</strong>Good class accuracy does not guarantee reliable probabilities.</article>
          </div>
          <Formula small>Choose the variant: Gaussian · Multinomial · Bernoulli · Categorical</Formula>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Keep, qualify, correct</span>
          <ul>
            <li><strong>Efficient:</strong> training and prediction are usually simple counts or distribution estimates.</li>
            <li><strong>Real or discrete:</strong> choose Gaussian, multinomial, Bernoulli, or categorical assumptions appropriately.</li>
            <li><strong>Streaming:</strong> sufficient statistics can often update incrementally.</li>
            <li><strong>Dependency risk:</strong> correlated features can double-count evidence and harm calibration.</li>
          </ul>
          <SearchCallout label="Specific correction" tone="amber">
            Mean and variance are sufficient only for Gaussian Naive Bayes—not
            for every Naive Bayes variant.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Retain efficiency, irrelevant-feature, real/discrete/streaming, dependency violation, and relationship-aware solution ideas while applying the documented qualifications.",
    sourceSlides: [43],
  },
  {
    eyebrow: "In-class assessment · Audit the model claim",
    title: "A useful shortcut must state exactly what it assumes",
    content: <NaiveBayesModelAudit />,
    note: "Timing: 4 minutes. Run all four claims. Students revise one claim, identify evidence needed to test it, and explain when a Bayesian network or richer sequence model would be preferable.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative assessment · Readings and next use",
    title: "Factor, query, classify—and defend every independence claim",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>Knowledge map</span>
          <div className={styles.timeline}>
            <article><strong>Factor</strong>independence and chain rule</article>
            <article><strong>Represent</strong>DAG + local CPTs</article>
            <article><strong>Query</strong>sum hidden assignments</article>
            <article><strong>Classify</strong>MAP with Naive Bayes</article>
          </div>
          <SearchCallout label="Readings" tone="cyan">George F. Luger, <em>Artificial Intelligence</em>, 6th ed., Chapters 5, 9, and 13; Stuart Russell and Peter Norvig, <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed., Chapters 13–14.</SearchCallout>
        </section>
        <section className={styles.panel}>
          <span className={styles.kicker}>Exit ticket</span>
          <h3>Submit one response with four parts</h3>
          <ol>
            <li>State one unconditional and one conditional independence claim.</li>
            <li>Factor the burglary-network joint distribution.</li>
            <li>Identify query, evidence, and hidden variables for one posterior.</li>
            <li>Correct one Naive Bayes claim and name evidence that would test it.</li>
          </ol>
          <p>Selected probability examples also adapt CS188 material by Dan Klein and Pieter Abbeel.</p>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Correct George F. Luger and Stuart Russell. Collect the four-part exit ticket. Close by connecting conditional independence to later probabilistic and sequential models.",
    sourceSlides: [44],
  },
];

const lesson14KeyPoints = [
  [
    "Independence and conditional independence reduce large probability models to smaller reusable factors.",
    "Bayesian networks encode local dependencies in a directed acyclic graph with conditional probability tables.",
    "Naive Bayes uses class-conditional independence to classify efficiently from priors and feature likelihoods.",
  ],
  [
    "X and Y are independent when observing either variable does not change the distribution of the other.",
    "Equivalent tests are P(x|y)=P(x), P(y|x)=P(y), and P(x,y)=P(x)P(y), where denominators are positive.",
    "Every joint-table cell must factorize; one mismatched cell is enough to disprove independence.",
  ],
  [
    "Independence factorizes the joint distribution as P(X,Y)=P(X)P(Y).",
    "For n independent binary variables, 2^n joint rows can be represented by n two-entry marginal tables.",
    "The storage saving is valid only when the independence assumption holds well enough for the intended decision.",
  ],
  [
    "The marginals give P(T=hot)=0.5 and P(W=sun)=0.6, so independence predicts P(hot,sun)=0.3.",
    "All four P2 cells equal P(T)P(W), including P2(hot,sun)=0.3; therefore P2 factorizes.",
    "P1(hot,sun)=0.4 rather than 0.3, so that single counterexample proves P1 does not factorize.",
  ],
  [
    "Fairness fixes each coin-flip marginal at 0.5; independence is the separate assumption that permits multiplication.",
    "For H,T,H, the joint probability is 0.5 x 0.5 x 0.5 = 0.125.",
    "More generally, independent variables factorize as P(X1,...,Xn)=the product of their marginal probabilities.",
  ],
  [
    "Smoke and an alarm may be associated because both can be effects of the shared cause Fire.",
    "A model may assert Smoke is conditionally independent of Alarm once Fire is known.",
    "Conditional independence is a claim about the model and evidence, not a fact guaranteed by variable names.",
  ],
  [
    "X is conditionally independent of Y given Z when P(x,y|z)=P(x|z)P(y|z) for every valid assignment.",
    "Equivalent forms are P(x|y,z)=P(x|z) and P(y|x,z)=P(y|z).",
    "X and Y may remain associated overall even when fixing Z makes further information about either one irrelevant.",
  ],
  [
    "Cavity is a common cause that can jointly explain Toothache and a probe Catch.",
    "Given Cavity, the model asserts P(Catch|Toothache,Cavity)=P(Catch|Cavity).",
    "The same conditional-independence claim can be written as a conditional factorization of Toothache and Catch.",
  ],
  [
    "Rain is a common cause of both Traffic and Umbrella use in the proposed network.",
    "Traffic and Umbrella can be dependent before Rain is observed.",
    "Given Rain, the model can assert Traffic is conditionally independent of Umbrella.",
  ],
  [
    "Fire can be modeled as a common cause of Smoke and Alarm.",
    "The conditional-independence claim Smoke independent of Alarm given Fire holds only in the simplified network.",
    "Direct smoke detection or a latent sensor fault would violate that simplified factorization.",
  ],
  [
    "Conditional probability divides a compatible joint probability by the evidence probability.",
    "The product rule reconstructs a joint: P(x,y)=P(x|y)P(y).",
    "The chain rule factorizes any ordered joint; independence assumptions can then remove conditioning variables.",
  ],
  [
    "A Bayesian network consists of random variables, a directed acyclic graph, and one local conditional distribution per node.",
    "A node's parents specify the variables on which its local probability table conditions.",
    "The burglary example separates Burglary, Earthquake, Alarm, John Calls, and Mary Calls into local mechanisms.",
  ],
  [
    "Root nodes use priors P(B) and P(E); Alarm uses P(A|B,E); each call uses a probability conditioned on Alarm.",
    "The complete joint is P(B)P(E)P(A|B,E)P(J|A)P(M|A).",
    "Multiplying local factors reconstructs the probability of any complete assignment.",
  ],
  [
    "D-separation determines whether every path between variables is blocked by the conditioning set.",
    "Conditioning on a common cause blocks its path, while conditioning on a collider can open a path.",
    "In the burglary network, observing Alarm makes Burglary and Earthquake compete to explain the same evidence.",
  ],
  [
    "Enumeration identifies query variables, observed evidence, and all remaining hidden variables.",
    "For each query value, it multiplies network factors and sums over every hidden-variable assignment.",
    "The resulting unnormalized values are divided by their sum to produce a posterior distribution.",
  ],
  [
    "For P(Burglary|John Calls,Mary Calls), Earthquake and Alarm are hidden and must be summed out.",
    "Compute one unnormalized mass for Burglary=true and another for Burglary=false, then normalize.",
    "With the displayed CPTs, two calls raise the burglary probability from 0.001 to about 0.284, not to certainty.",
  ],
  [
    "Naive Bayes assumes features are conditionally independent given the class, not marginally independent.",
    "Its likelihood factorization is P(F1,...,Fn|C)=the product of P(Fi|C).",
    "Features such as color, size, and shape may still be associated in the overall population through class prevalence.",
  ],
  [
    "MAP classification maximizes P(C) times the product of feature likelihoods P(ei|C).",
    "Maximum likelihood omits the class prior; MAP includes it.",
    "Log probabilities replace products with sums, preventing numerical underflow without changing the winning class.",
  ],
  [
    "Training estimates class priors and class-conditional feature probabilities from labeled examples.",
    "Testing computes a posterior score for each candidate class and selects the largest.",
    "The model variant must match the data type, such as Gaussian, multinomial, Bernoulli, or categorical features.",
  ],
  [
    "A probabilistic finite-state acceptor assigns probabilities to transitions along alternative phone sequences.",
    "It represents sequence structure and pronunciation variants rather than a Naive Bayes feature factorization.",
    "The distinction matters because sequence dependence cannot be justified by relabeling a graph as Naive Bayes.",
  ],
  [
    "Speech decoding compares candidates using a score proportional to phone likelihood times word prior.",
    "A frequent word can enter the candidate list because of its large prior even when its phone likelihood is poor.",
    "A zero phone likelihood makes the final product zero regardless of the word prior.",
  ],
  [
    "The displayed phone-only score selects new because P(ni|word)P(word) is largest for that candidate.",
    "The phrase I new is implausible, showing that the preceding word contains useful evidence omitted by the local model.",
    "Adding word context favors I need and illustrates how representation can matter more than refining the same score.",
  ],
  [
    "Naive Bayes is fast, incremental, and often robust to irrelevant features.",
    "Correlated features can double-count evidence and produce poorly calibrated probabilities.",
    "When dependencies or sequence structure matter, a Bayesian network or richer sequence model may be more appropriate.",
  ],
  [
    "Every model claim should identify the exact conditional-independence assumptions it makes.",
    "A useful audit names evidence that could test those assumptions and the consequences of a violation.",
    "Model choice should follow the dependency structure required by the task, not convenience alone.",
  ],
  [
    "Independence and conditional independence justify probability factorization only when their quantified claims hold.",
    "Bayesian-network inference multiplies local factors, sums hidden variables, and normalizes the query distribution.",
    "Naive Bayes performs efficient MAP classification, but its feature-dependence assumptions must be defended.",
  ],
] as const;

slides.forEach((slide, index) => { slide.keyPoints = lesson14KeyPoints[index]; });

export function Meeting10Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      meetingLabel="Module 9 · Lesson 12"
      meetingTitle="Conditional Independence, Bayesian Networks, and Naive Bayes"
      notesMode="key-points"
      resolveSourceReference={resolveMeeting10SourceReference}
      slides={slides}
      sourceCollectionLabel={`${L11_SOURCE_DECK_LABEL} + ${L12_SOURCE_DECK_LABEL}`}
    />
  );
}
