"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import { SearchCallout } from "./SearchLessonPrimitives";
import styles from "./Meeting10Deck.module.css";
import { MAPExplanation, FruitClassificationFlow, ClassifierTrustPanel } from "./Lesson12FruitPanels";

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
    note: "We are moving from raw probability tables to structured probability models. The central question is which variables still matter after the right evidence is known. Independence removes factors globally; conditional independence removes them only inside a stated context. Bayesian networks turn local conditional-independence claims into a directed acyclic graph plus compact local tables. Inference then multiplies those local factors, sums hidden variables, and normalizes. Naive Bayes uses an especially strong version of this idea for fast classification. Think of a crowded group chat. A rumor may connect everyone until the original announcement is revealed; after that, some messages add no new information. The conditioning variable is the announcement, not a magical delete button. By the end, you should be able to test independence, read a network factorization, trace exact enumeration, compute a Naive Bayes score, and defend every simplifying assumption. A graph is a model claim, not decorative arrow confetti.",
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
    note: "Independence is a statement about a probability distribution, not a statement that two English words sound unrelated. Start with X independent of Y, written X perpendicular to Y. The first conditional form says P of x given y equals P of x whenever P of y is positive. In plain language, learning y does not move our belief about x. The positive-denominator condition matters because conditioning on an impossible event is undefined, not mysterious. The second form reverses the roles: P of y given x equals P of y. The third form removes conditioning entirely: P of x and y equals P of x times P of y for every pair x comma y. To see the equivalence, substitute the product rule P of x and y equals P of x given y times P of y. If the conditional is unchanged, replace P of x given y with P of x, and the factorized joint appears. Divide the factorized joint by P of y and the conditional form returns. For a finite table, independence is an all-cells claim. Imagine a quality inspector checking a carton of eggs: one cracked egg disproves 'all intact,' while one intact egg proves almost nothing. Likewise, a single cell where P of x comma y differs from P of x times P of y disproves independence. Establishing independence requires the equality for every assignment, subject to ordinary rounding tolerance when probabilities are estimated. Exact independence is often rare in empirical data, so distinguish three positions: mathematically independent in the specified distribution, approximately independent for a decision tolerance, or simply assumed independent for tractability. A professional report states which position it takes and what evidence could overturn it. The symbol is compact; the burden of justification is not.",
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
    note: "Factorization is a compression rule. Without assumptions, a joint distribution over n binary variables assigns probability mass to two to the n complete assignments. With mutual independence, the joint becomes the product over i of P of X sub i, so a complete row can be reconstructed by multiplying one local probability from each variable. The storage comparison on screen is two to the n joint rows versus two n marginal entries. For twenty binary variables, that is one million forty-eight thousand five hundred seventy-six joint rows versus forty marginal entries. That dramatic reduction is why independence is computationally tempting. It is also why an unjustified independence assumption can be dramatically wrong: one small sentence controls an enormous number of reconstructed cells. Think of a restaurant menu. Listing every possible meal combination grows explosively. If drink, side, and dessert choices are independent, we store three short menus and combine them. But if the soup always comes with bread, multiplying separate menus invents orders the kitchen never serves. Factorization saves representation by asserting regularity; it does not manufacture truth. The universal quantifier is the guardrail: every assignment must satisfy the product equality. Before accepting the compressed representation, test the assumption, measure approximation error, and ask whether mistakes affect the downstream decision. Saving memory is useful; saving memory by forgetting dependence is less charming.",
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
    note: "We now test three tables, not three vibes. The rightmost table is the product model P of T times P of W. From the displayed marginals, P of hot is point five, P of cold is point five, P of sun is point six, and P of rain is point four. Multiplication predicts four cells: hot-sun point three, hot-rain point two, cold-sun point three, and cold-rain point two. Compare P one with that product table. Its hot-sun cell is point four, but independence predicts point three because point five times point six equals point three. That one mismatch is enough: P one does not factorize. We could stop the disproof there, though the remaining cells also differ. One counterexample breaks a universal claim with the efficiency of a single banana peel in a dignified hallway. Now compare P two cell by cell. Hot-sun is point three, hot-rain point two, cold-sun point three, and cold-rain point two. All four entries match P of T times P of W. The rows and columns also reproduce the stated marginals. Therefore P two factorizes, while P one does not. This conclusion comes from equality of distributions, not from P two merely looking more symmetric. Make the logical asymmetry explicit before revealing the answer: one mismatch disproves independence; every cell match is needed to establish it. Then reveal the analysis and connect the arithmetic to the formal definition from the previous slides. The example is the definition running on actual numbers. Reveal the analysis. P two factorizes because all four cells match the marginal products. P one fails immediately at hot and sun: point four is not point three. Keep the asymmetric rule visible—one counterexample disproves, while every cell is needed to establish independence.",
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
    note: "For three fair independent flips, the sequence heads, tails, heads has probability one half cubed, or point one two five. Fairness supplies the marginals; independence is the additional permission to multiply them. For n flips, the sequence probability factorizes into a product of n local terms. We avoid listing two to the n complete sequences, even though all those outcomes still exist. The model stores the repeatable mechanism. A fair coin can still be dependent over time. Imagine a device that chooses the first flip fairly and then copies it. Every individual flip may look balanced, but sequences are highly constrained. Fair marginals do not guarantee independent trials. When someone multiplies probabilities, ask what independence statement licenses the multiplication. The multiplication sign often hides the most important modeling decision on the page.",
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
    note: "Smoke and an alarm may be associated because both respond to fire. Before we observe fire, smoke changes our belief about the alarm because it provides indirect evidence about their shared cause. After the fire state is known, a simplified model may say smoke adds no further information about the alarm. Fire screens the two effects off. That is conditional independence, not unconditional independence. Picture two students arriving late because the same bus broke down. Their arrival times move together until the bus status is known. Once the shared cause is fixed, one student's delay may tell us nothing additional about the other. The word may is essential. Real alarms can respond directly to smoke, and hidden sensor faults can create extra dependence. Conditional independence follows from a proposed model and must be tested.",
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
    note: "Conditional independence adds a context. X independent of Y given Z means that inside each fixed Z stratum, the conditional joint factorizes: P of x comma y given z equals P of x given z times P of y given z. The vertical bar means 'given,' so Z is not decoration; it changes the distribution being tested. The two equivalent conditional forms say P of x given y comma z equals P of x given z, and symmetrically P of y given x comma z equals P of y given z. Once z is known, learning the other variable adds no further information. Derive the first form by dividing the conditional joint factorization by P of y given z whenever that denominator is positive. Operationally, partition or model the data by Z, then test the relationship inside every valid stratum. A pooled association can disappear after conditioning because Z explains it. This is the statistical version of discovering that two coworkers always arrive together because they ride the same bus; after bus status is known, one arrival may add nothing about the other. Read the quantifier carefully: the equality must hold for all relevant x, y, and z values. Conditional independence is neither 'sometimes unrelated' nor a license to choose only the convenient stratum. These local claims are the representational engine behind Bayesian networks and the class-conditional shortcut in Naive Bayes.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Conditional independence · Dental example",
    title: "Cavity can screen Toothache from Catch",
    content: (
      <div className={styles.nativeGrid} data-l12-source-slide="7">
        <div className={`${styles.panel} ${styles.scenePanel} ${styles.dentalScene}`}>
          <img alt="Dental probe checking a tooth for a cavity" src={`${L12_MEDIA_ROOT}/image18.png`} />
          <CommonCauseDiagram cause="Cavity" left="Toothache" right="Catch" />
          <Formula small>Toothache ⟂ Catch | Cavity</Formula>
          <p className={styles.symbolReading}>Read: Toothache is independent of Catch, <strong>given Cavity</strong>.</p>
        </div>
        <section className={`${styles.panel} ${styles.dentalReasoning}`}>
          <span className={styles.kicker}>Same common-cause pattern as rain</span>
          <h3>One possible cause, two observations</h3>
          <p><strong>Scene:</strong> A dentist examines a patient’s tooth. A <strong>cavity</strong> is a decayed hole; <strong>Toothache</strong> records tooth pain. A <strong>probe</strong> is the dentist’s small examining instrument; <strong>Catch</strong> means its tip catches or sticks at a spot on the tooth.</p>
          <p><strong>Before cavity status is known:</strong> tooth pain may suggest a cavity, which can also make a probe catch more likely. The observations can therefore be associated.</p>
          <p><strong>Once cavity status is known:</strong> in this simplified model, knowing whether the patient has tooth pain adds no further information about whether the probe catches. This applies both when a cavity is present and when it is absent.</p>
          <div className={styles.explainTakeaway}><strong>The claim:</strong> P(Catch | Toothache, Cavity) = P(Catch | Cavity).<br/>⟂ means “independent”; | means “given / already known.”</div>
          <details><summary>Variables and equivalent equations</summary><p>All three variables are true/false. + means present/yes; − means absent/no.</p><p>P(Toothache | Catch, Cavity) = P(Toothache | Cavity)</p><p>P(Toothache, Catch | Cavity) = P(Toothache | Cavity)P(Catch | Cavity)</p></details>
          <small>This is a modeling assumption to test against dental data; it does not say a catch proves a cavity.</small>
        </section>
      </div>
    ),
    note: "Let Cavity be the conditioning variable, Toothache one effect, and Catch the event that a dental probe catches in the tooth. Toothache and Catch may be associated before cavity status is known because both provide evidence about the same underlying condition. The first equation says P of Catch given Toothache and Cavity equals P of Catch given Cavity. Once cavity status is fixed, Toothache adds no information about Catch. The second equation is the symmetric statement with Toothache and Catch exchanged. These are not two different assumptions; with valid denominators they describe the same conditional independence relation. The third equation is the factorized conditional joint: P of Toothache comma Catch given Cavity equals P of Toothache given Cavity times P of Catch given Cavity. Apply the conditional product rule, then replace P of Catch given Toothache comma Cavity with P of Catch given Cavity. The algebra makes the screening-off claim explicit. The equality must be considered for cavity present and cavity absent. Real dental data can violate it through inflammation, probe technique, or an unmodeled condition affecting both observations. The mathematics tells us what the model asserts; clinical evidence tells us whether the assertion survives contact with teeth, which are famously uncooperative data structures.",
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
    note: "Traffic and umbrella use can move together because rain influences both. Before rain is known, an umbrella is evidence about weather and therefore indirectly about traffic. In the simple fork graph, Raining points to Traffic and Umbrella. Conditioning on the common cause blocks that path, yielding Traffic independent of Umbrella given Raining. The arrow picture is a compressed set of probability claims. It does not mean every umbrella causes traffic or every traffic jam causes umbrellas. The common parent explains the observed association. Reveal the defensible claim only after predicting it. Then identify possible violations such as a stadium event that simultaneously changes traffic and umbrella use even within the same rain condition. Reveal the defensible rain claim. Traffic and Umbrella may be associated before conditioning because both carry evidence about Rain. In the proposed fork model, fixing Rain blocks the path. This remains a claim to test against events, geography, and behavior outside the simple graph.",
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
    note: "The same fork pattern uses Fire as a common cause of Smoke and Alarm. In the simplified graph, observing fire blocks the only path connecting the two effects. Conditional independence therefore reads Smoke independent of Alarm given Fire. Notice that this is a property of the represented distribution, not a conclusion extracted from the English nouns. A real smoke detector often has a direct smoke-to-alarm mechanism. Add that edge and the screening-off claim changes. A latent sensor fault could also couple smoke readings and alarm behavior. Use the reveal to state the simplified claim, then critique it. Good probabilistic modeling alternates between exploiting a structure and asking which real mechanisms the structure omitted. Reveal the simplified fire claim. Smoke is independent of Alarm given Fire only in a model with no direct smoke-to-alarm mechanism and no hidden common fault. The reveal demonstrates the formal graph; our critique demonstrates responsible use of it.",
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
    note: "Conditional probability is a definition: P of x given y equals P of x comma y divided by P of y. Rearranging gives the product rule, P of x comma y equals P of x given y times P of y. These are identities whenever the denominator exists; no independence assumption has entered yet. The chain rule repeatedly applies the product rule. For an ordered list x one through x n, multiply P of x i conditioned on all earlier variables. Any joint distribution can be written this way in any order, although different orders produce different-looking factors. Independence is the simplifying assumption. If X is independent of Y, P of x given y becomes P of x, so the product rule shortens to P of x times P of y. Conditional independence similarly removes selected variables from a conditioning set. Think of the chain rule as a guaranteed full packing list; independence is permission to cross out items proven irrelevant. When reading a derivation, label each step identity, arithmetic, or assumption. The most dangerous line is often the innocent-looking one where a conditioning variable disappears. If no independence claim justifies that disappearance, the algebra has performed a magic trick and hidden the rabbit in the model assumptions.",
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
    note: "A Bayesian network is a directed acyclic graph, or DAG, plus one local probability distribution per node. Each node is a random variable with a defined domain. Each directed edge says that the child distribution is represented as depending locally on that parent. Acyclic means no directed path can loop back to where it started, so the factorization has a consistent ordering. Burglary is a root variable, so it has a prior P of B. Earthquake is another root with prior P of E. Both point to Alarm, giving the conditional table P of A given B comma E. Alarm points to JohnCalls and MaryCalls, producing P of J given A and P of M given A. The graph is a compact index of which conditioning variables each local table needs. The thief who appears for Burglary is a memory cue, not a claim that cartoon criminals follow probability theory. The screen shake at Earthquake marks the second root cause. Alarm is their shared effect, while the two calls are downstream observations. This five-node story will let us compute a posterior without storing all thirty-two binary assignments as an undifferentiated table. An arrow does not automatically prove causation. A Bayesian network always defines probabilistic factorization; causal interpretation requires stronger assumptions about mechanisms and interventions. Read each node operationally: name its domain, parents, and local table. If those are missing, the arrows are decorative spaghetti with excellent posture.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · DAG and CPT factorization",
    title: "CPTs: local tables form the joint distribution",
    content: <NetworkFactorizationExplorer />,
    note: "The complete joint has one local factor for each node. Burglary contributes P of B and Earthquake contributes P of E because roots have no parents. Alarm contributes P of A given B comma E. JohnCalls contributes P of J given A, and MaryCalls contributes P of M given A. Multiplying those five terms gives P of B comma E comma A comma J comma M. Every variable appears once as the left-hand variable of a local factor, and every factor conditions only on the node's parents. This is not an arbitrary recipe; it is the Bayesian-network semantics. The representation saves parameters. A full five-variable binary joint has thirty-two rows and thirty-one free parameters after normalization. The local tables need one parameter for each root, four for Alarm's parent configurations, and two each for JohnCalls and MaryCalls: nine free parameters total in this binary example. Walk through every control. For each selected node, identify its parents and say why its factor has that conditioning set. Then rebuild the product from memory. A missing factor loses probability mass; a duplicated factor counts evidence twice; an extra parent throws away the very compactness the graph was designed to provide. Select E. Earthquake is a root, so its local factor is the prior P of E. Select A. Alarm has Burglary and Earthquake as parents, so its table is P of A given B and E. Select J. JohnCalls has only Alarm as a parent, giving P of J given A. Select M. MaryCalls likewise contributes P of M given A. We have now visited every local factor in the joint.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Graphical independence",
    title: "When does one observation change another belief?",
    content: <GraphicalIndependenceStudio />,
    note: "Graphical independence depends on path structure and the conditioning set. A common cause is blocked when the cause is observed. A collider behaves oppositely: it blocks a path until the collider or one of its descendants is observed. In the burglary network, JohnCalls and MaryCalls become independent given Alarm. Burglary and Earthquake are independent before Alarm is observed because Alarm is a collider. Observing Alarm opens the path and creates explaining away. If the alarm sounds and we learn there was an earthquake, burglary becomes less necessary as an explanation. Competing causes become dependent once their shared effect is known. Cycle through all three cases and say the conditioning set every time. The phrase independent in the graph is incomplete unless we know which nodes are observed. Choose Collider closed. Burglary and Earthquake are independent before Alarm or its descendants are observed because the unobserved collider blocks their path. Choose Explaining away. Observing Alarm opens the collider path, so evidence for Earthquake changes belief in Burglary. Competing causes become dependent through their observed effect. Return to Common cause. Conditioning on Alarm blocks the fork from Alarm to the two callers, making JohnCalls independent of MaryCalls given Alarm in this network.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Exact inference",
    title: "Both neighbors called: what must we calculate?",
    content: <EnumerationPlan />,
    note: "Exact enumeration separates variables into three roles. The query is what we want to know, evidence is fixed by observation, and hidden variables are neither queried nor observed. For P of Burglary given JohnCalls and MaryCalls, B is the query, j and m are evidence, and Earthquake plus Alarm are hidden. For each query value, enumerate every assignment of the hidden variables. With two hidden binary variables, that means four products for B true and four more for B false. Each product uses the network factorization P of B, P of E, P of A given B comma E, P of j given A, and P of m given A. The formula P of X given e equals alpha times the sum over hidden y of the product of local factors compresses that procedure. Sigma means add compatible hidden worlds. Pi means multiply one local probability per node. Alpha is the normalization constant that makes the query values sum to one. Enumeration is conceptually transparent but repeats work exponentially. Variable elimination improves the mechanics by multiplying and summing factors in a useful order, caching intermediate results instead of recomputing every storyline. Before arithmetic, always name query, evidence, hidden variables, and the number of hidden assignments.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook-grounded supplement · Worked network",
    title: "From two phone calls to a burglary probability",
    content: <EnumerationTrace />,
    note: "The canonical burglary network uses P of B equal point zero zero one and P of E equal point zero zero two. Alarm is very likely when burglary or earthquake occurs, but false alarms remain possible. John and Mary are likely to call when Alarm is true, yet each can also call without an alarm. Two calls are strong evidence, not a notarized confession from the universe. For B true, sum four terms over e and a. Each term multiplies P of b, P of e, P of a given b comma e, P of j given a, and P of m given a. The resulting unnormalized mass is zero point zero zero zero five nine two two four three. Repeat for B false. The unnormalized no-burglary mass is zero point zero zero one four nine one eight five eight, which is larger because the no-burglary prior is enormous even though the calls favor an alarm. Evidence updates a prior; it does not erase it. Normalize the two masses by their sum, zero point zero zero two zero eight four one zero zero. The posterior P of burglary given both calls is about zero point two eight four. Belief jumps from point one percent to twenty-eight point four percent—a huge update, but still far from certainty. Walk every Next step and connect the displayed number to the operation that produced it. Click Next to expand the five local network factors and the two hidden sums. Click Next to sum the four hidden assignments compatible with burglary and both calls. Click Next to compute the larger no-burglary mass. Evidence raises burglary belief without erasing alternative explanations. Click Next to normalize both masses. The burglary posterior is about point two eight four, a large update from the prior but far from certainty.",
    sourceSlides: [],
  },
  {
    eyebrow: "Naive Bayes · Class-conditional factorization",
    title: "Naive Bayes: classify fruit using its features",
    content: (
      <div className={styles.nativeGrid}>
        <section className={styles.panel}>
          <span className={styles.kicker}>From chain rule to the shortcut</span>
          <Formula small>P(F₁,…,Fₙ|C) ≈ ∏ᵢP(Fᵢ|C)</Formula>
          <div className={styles.featureFlow}>
            <div className={`${styles.classBox} ${styles.appleClass}`}><img src="/lesson-visuals/lesson12-apple.svg" alt="Red apple with a green leaf" /><strong>Class C</strong><br/>apple / not apple</div><div className={styles.arrow}>→</div>
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
    note: "Naive Bayes starts with the class C and features F one through F n. The exact conditional joint could use a chain rule with growing conditioning sets. The naive approximation replaces it with the product over i of P of F i given C, asserting that features are conditionally independent once the class is fixed. This is not marginal independence. Size, color, and shape can be strongly associated across all fruit because apples, grapes, and bananas occur in different proportions. The model says that within a fixed class, the remaining dependencies are small enough to ignore for the intended prediction. The classification score is P of C times the product of feature likelihoods. The evidence denominator P of the observed features is identical for every class, so it can be omitted when computing an argmax. That is why unnormalized scores are sufficient to choose a label. The approximation can work surprisingly well, but correlated features may double-count evidence. If 'contains the word free' and 'contains the phrase free money' are nearly duplicates, multiplying both likelihoods can make spam confidence shout through a megaphone. Inspect dependence and calibration, not only accuracy.",
    sourceSlides: [37],
  },
  {
    eyebrow: "Naive Bayes · Classifier decision",
    title: "MAP: choose the most probable class after evidence",
    content: <MAPExplanation />,
    note: "The decision rule chooses the class c hat that maximizes P of C times the product of P of evidence item i given C. Because the class prior P of C is included, this is maximum a posteriori, or MAP, classification. Maximum likelihood would compare only the feature likelihood product. The prior acts like a starting-line advantage. A common class begins with more probability mass; a rare class can still win if its features are much more diagnostic. Priors can come from class frequencies or justified domain knowledge, but they should match the deployment population rather than yesterday's convenient spreadsheet. Multiplying many probabilities can underflow to zero in floating-point arithmetic. Software therefore computes log scores: log P of C plus the sum over i of log P of e i given C. Logarithms turn products into sums while preserving the maximizing class. Unseen feature values can also create zeros, so use an appropriate smoothing method such as Laplace or additive smoothing. Report the likelihood model, prior, smoothing, and evaluation data. 'We used Naive Bayes' is a family name, not a reproducible model specification.",
    sourceSlides: [38],
  },
  {
    eyebrow: "Naive Bayes · Fruit example",
    title: "From labeled fruit to an apple prediction",
    content: <FruitClassificationFlow />,
    note: "Training counts classes and feature values within each class, or estimates distribution parameters for a chosen variant. Testing plugs a new example into those learned local probabilities and compares posterior scores. The statistics depend on the variant. Gaussian Naive Bayes estimates means and variances; multinomial models estimate token counts; Bernoulli models estimate binary presence; categorical models estimate value frequencies. A model labeled Naive Bayes is a family name, not a complete specification. Asking which likelihood model was used is like asking what kind of vehicle arrived after hearing only that it was transportation. Use held-out data to compare accuracy, calibration, and error types. Training likelihood is evidence about fit to observed data, not a guarantee of reliable future decisions.",
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
    note: "The phone graph represents sequential alternatives and transition probabilities. It is useful probabilistic structure, but it is not itself evidence of a Naive Bayes feature factorization. Each state summarizes position in a phone sequence; arcs carry possible observations or transitions. Decoding searches paths whose local probabilities combine into a sequence score. This is closer to route planning through a pronunciation network than to placing independent feature cards under a class. The graph remembers order, which ordinary bag-of-features Naive Bayes discards. Name the model you actually have. Probabilistic does not mean Naive Bayes, and a graph does not automatically mean Bayesian network. Representation and factorization determine the category.",
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
    note: "We score candidate words using Bayes: P of word given the phone evidence ni is proportional to P of ni given word times P of word. The first factor is a phone or acoustic likelihood; the second is a corpus prior. The omitted evidence denominator is shared across candidates and therefore does not affect the ranking. Read the prior table. Knee appears sixty-one times, giving about point zero zero zero zero two four. Need appears one thousand four hundred seventeen times, and new two thousand six hundred twenty-five times. The word the is extremely common at point zero four six, but a high prior cannot rescue a zero likelihood for the observed phone sequence. A perfect local phone match can lose to a more frequent candidate with a slightly weaker match. This is the same prior-versus-likelihood negotiation used in medical diagnosis and spam filtering. The prior whispers 'usually'; the likelihood replies 'this evidence.' The posterior score decides which voice is louder. Predict before seeing the product table. Then state which column is prior, which will be likelihood, and why their product is only an unnormalized posterior. Also ask whether the corpus matches the speaker and domain; a courtroom, a kitchen, and a gaming stream do not share identical word priors.",
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
    note: "Multiply each phone likelihood by its word prior. New scores point three six times point zero zero one, giving point zero zero zero three six, the largest displayed product. Neat yields about point zero zero zero zero six eight, need about point zero zero zero zero six two, knee point zero zero zero zero two four, and the receives zero because its phone likelihood is zero. The local winner is therefore new. Notice that knee has a perfect phone likelihood of one, but its tiny prior makes its product smaller. A perfect match to a rare candidate need not beat a good match to a more common candidate. Now add the preceding word I. 'I need' is plausible; 'I new' is not standard English. The displayed calculation omits that contextual factor, so a sequence or language model can rerank the candidates. Local evidence proposes; context disposes. Even Sherlock Holmes would ask what came before the suspicious syllable. The repair is representational: include contextual variables or use a sequence model. Do not merely tune the same phone-only table harder. Track every factor and every omitted dependency, then test on held-out speech from the intended domain. The best isolated word score need not produce the best sentence.",
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
    note: "Naive Bayes trains quickly, predicts quickly, and works with discrete, continuous, or streaming data through different likelihood variants. Its small local statistics are often strong baselines. The main weakness is dependence among features after conditioning on class. Correlated or duplicated features can multiply similar evidence several times, producing overconfident scores even when accuracy remains reasonable. Irrelevant features are not magically harmless. Weak features may wash out, but noisy estimation, duplication, and distribution shift can still hurt. Simplicity is a benefit, not an immunity certificate. Compare variants, use smoothing, inspect calibration, and consider richer networks or sequence models when relationships matter. The right question is not whether Naive Bayes is naive; it is whether its assumptions are useful enough here.",
    sourceSlides: [43],
  },
  {
    eyebrow: "In-class assessment · Audit the model claim",
    title: "Can we trust this Naive Bayes classifier?",
    content: <ClassifierTrustPanel />,
    note: "The audit presents four tempting claims about Naive Bayes. Each is close enough to sound plausible and wrong enough to damage a report. Good model literacy means repairing the exact statement. The assumption is conditional, not marginal, independence. Including a prior yields MAP. Parameter estimates depend on the variant. Irrelevant or duplicated features can hurt through noise and repeated evidence. Treat the audit like code review for equations. A claim can run without throwing a syntax error and still produce the wrong scientific result. Precise terminology is part of model correctness. Cycle through all four claims. For each, state the correction, identify evidence needed to test it, and name when a Bayesian network or richer sequence model would be preferable. Choose Decision. With a class prior included, the classifier is MAP; maximum likelihood omits the prior. Choose Parameters. Only Gaussian Naive Bayes estimates means and variances; other variants learn counts or categorical probabilities. Choose Robustness. Correlated or duplicated features can repeat evidence and distort confidence, so irrelevant does not mean harmless. Return to Assumption. Features are conditionally independent given the class, not marginally independent across the full population.",
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
    note: "The lesson's through-line is structured simplification. Independence and conditional independence remove unnecessary dependencies; Bayesian networks encode local structure; inference recombines factors; Naive Bayes trades realism for efficient classification. A complete explanation names variables and domains, the factorization, observed evidence, hidden variables, the query, and the assumption that licenses each simplification. Leaving out the conditioning set is leaving out the model. The practical habit is assumption accounting. Every time a product becomes shorter, write down why. Every time a graph omits an edge, ask what independence that omission asserts. Every time a classifier is confident, inspect repeated evidence. Exit with four abilities: test a table, read a DAG, trace enumeration, and audit a classifier. If you can defend the structure instead of merely reciting a formula, you can transfer this lesson to much larger probabilistic systems.",
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
