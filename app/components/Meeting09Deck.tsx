"use client";

import { useState, type ReactNode } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import { SearchCallout } from "./SearchLessonPrimitives";
import styles from "./Meeting09Deck.module.css";

const SOURCE_ROOT = "/course-source/l11-probability-bayes";
const SOURCE_DECK_LABEL = "L11 Stochastic Methods · Part A";

function resolveMeeting09SourceReference(sourceSlide: number) {
  return {
    deckLabel: SOURCE_DECK_LABEL,
    image: `${SOURCE_ROOT}/slide-renders/slide-${String(sourceSlide).padStart(2, "0")}.png`,
    key: `l11-probability-bayes:${sourceSlide}`,
    page: sourceSlide,
  };
}

type Row = { values: ReactNode[]; tone?: "focus" | "muted" };

function ProbabilityTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: ReactNode[];
  rows: Row[];
}) {
  return (
    <table className={styles.table}>
      <caption>{caption}</caption>
      <thead><tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr></thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr className={row.tone ? styles[row.tone] : ""} key={rowIndex}>
            {row.values.map((value, cellIndex) => <td key={cellIndex}>{value}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Formula({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className={styles.formula}>
      {label && <span>{label}</span>}
      <strong>{children}</strong>
    </div>
  );
}

function SourceFragment({
  file,
  alt,
  caption,
  contain = false,
}: {
  file: string;
  alt: string;
  caption?: string;
  contain?: boolean;
}) {
  return (
    <figure className={styles.fragment}>
      <img
        alt={alt}
        className={contain ? styles.contain : ""}
        src={`${SOURCE_ROOT}/raw-media/${file}`}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function ConceptCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className={styles.card}>
      <span>{label}</span>
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  );
}

type PracticeItem = {
  label: string;
  question: string;
  working: string;
  answer: string;
  explanation: string;
};

function ProbabilityPractice({
  ariaLabel,
  eyebrow,
  items,
}: {
  ariaLabel: string;
  eyebrow: string;
  items: PracticeItem[];
}) {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = items[active];

  return (
    <div className={styles.practice}>
      <nav aria-label={ariaLabel}>
        {items.map((entry, index) => (
          <button
            className={active === index ? styles.active : ""}
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
        <span>{eyebrow}</span>
        <h3>{item.question}</h3>
        <p>{item.working}</p>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide answer" : "Reveal answer"}
        </button>
        {revealed && (
          <SearchCallout label={item.answer} tone="green">
            {item.explanation}
          </SearchCallout>
        )}
      </section>
    </div>
  );
}

const jointRows: Row[] = [
  { values: ["hot", "sun", "0.4"] },
  { values: ["hot", "rain", "0.1"] },
  { values: ["cold", "sun", "0.2"] },
  { values: ["cold", "rain", "0.3"] },
];

const xyRows: Row[] = [
  { values: ["+x", "+y", "0.2"] },
  { values: ["+x", "−y", "0.3"] },
  { values: ["−x", "+y", "0.4"] },
  { values: ["−x", "−y", "0.1"] },
];

const eventCases: PracticeItem[] = [
  { label: "Q1", question: "What is P(+x, +y)?", working: "A complete assignment identifies one row of the joint table.", answer: "P(+x, +y) = 0.2", explanation: "The event contains exactly the first row, so no summation is needed." },
  { label: "Q2", question: "What is P(+x)?", working: "The value of Y is unspecified. Sum every row in which X is true.", answer: "P(+x) = 0.2 + 0.3 = 0.5", explanation: "This is a marginal probability: Y has been summed out." },
  { label: "Q3", question: "What is P(−y OR +x)?", working: "Take the union once. Do not count the (+x, −y) row twice.", answer: "P(−y ∪ +x) = 0.6", explanation: "Rows (+x,+y), (+x,−y), and (−x,−y) have mass 0.2 + 0.3 + 0.1." },
];

const normalizationCases: PracticeItem[] = [
  { label: "+x", question: "Given Y = −y, how much mass belongs to +x?", working: "Select the two rows with Y = −y. Their unnormalized masses are 0.3 and 0.1.", answer: "P(+x | −y) = 0.3 / 0.4 = 0.75", explanation: "The normalizer is the selected mass P(−y) = 0.3 + 0.1 = 0.4." },
  { label: "−x", question: "Given Y = −y, how much mass belongs to −x?", working: "Use the same evidence normalizer, 0.4.", answer: "P(−x | −y) = 0.1 / 0.4 = 0.25", explanation: "The two conditional values sum to one, which checks the calculation." },
];

const coinCases: PracticeItem[] = [
  { label: "Q1", question: "What is the sample space?", working: "List every length-three sequence of H or T.", answer: "S has eight outcomes", explanation: "S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}." },
  { label: "Q2", question: "Which events matter?", working: "Let A mean more heads than tails and B mean the first toss is H.", answer: "P(A) = 4/8 and P(B) = 4/8", explanation: "A = {HHH,HHT,HTH,THH}; B = {HHH,HHT,HTH,HTT}." },
  { label: "Q3", question: "Which random variables should we define?", working: "An event is a set of outcomes; a random variable maps each outcome to a value.", answer: "Use X = number of heads and I = 1[first toss is H]", explanation: "A and B are events, not random variables. X has values 0–3; I is binary." },
  { label: "Q4", question: "What is the distribution of X?", working: "Count sequences with zero, one, two, and three heads.", answer: "P(X=0,1,2,3) = (1,3,3,1)/8", explanation: "The binomial counts 1, 3, 3, 1 sum to eight equally likely sequences." },
  { label: "Q5", question: "What is P(A | B)?", working: "Under B, only HHH, HHT, HTH, and HTT remain possible.", answer: "P(A | B) = (3/8)/(4/8) = 3/4", explanation: "Three of the four outcomes beginning with H have more heads than tails." },
];

const trafficCases: PracticeItem[] = [
  { label: "Q1", question: "What is P(C = true)?", working: "Marginalize over traffic: add the two rows in which construction is true.", answer: "P(C) = 0.3 + 0.2 = 0.5", explanation: "This prior is the probability of construction before conditioning on bad traffic." },
  { label: "Q2", question: "What is P(C = true | T = true)?", working: "Select the two rows with bad traffic and normalize their masses.", answer: "P(C | T) = 0.3 / (0.3 + 0.1) = 0.75", explanation: "Bad traffic raises the construction belief from 0.5 to 0.75 in this joint model." },
  { label: "Q3", question: "What should orange barrels do to the belief?", working: "Barrels are evidence associated with construction, but the displayed joint table contains only C and T.", answer: "Increase it—if barrels are more likely when C is true", explanation: "A numeric update requires probabilities involving B. The arrows are a dependency sketch, not a fully specified Bayesian network." },
];

const chainCases: PracticeItem[] = [
  { label: "2", question: "Factor two variables", working: "Start from the product rule and choose an ordering.", answer: "P(x₁,x₂) = P(x₁)P(x₂ | x₁)", explanation: "Reversing the ordering is also valid: P(x₂)P(x₁ | x₂)." },
  { label: "3", question: "Add a third variable", working: "Treat the first two variables as the accumulated context.", answer: "P(x₁,x₂,x₃) = P(x₁)P(x₂ | x₁)P(x₃ | x₁,x₂)", explanation: "Equivalently, P(x₁,x₂)P(x₃ | x₁,x₂)." },
  { label: "n", question: "State the general chain rule", working: "Each factor conditions on every variable that precedes it in the chosen ordering.", answer: "P(x₁,…,xₙ) = ∏ᵢ P(xᵢ | x₁,…,xᵢ₋₁)", explanation: "The identity follows by repeatedly applying the product rule; it does not assume independence." },
];

const meningitisCases: PracticeItem[] = [
  { label: "1", question: "Record the prior and likelihoods", working: "P(+m)=0.0001, P(+s|+m)=0.8, and P(+s|−m)=0.01.", answer: "Rare disease, informative symptom", explanation: "The likelihood ratio is 80, but the prior odds are extremely small." },
  { label: "2", question: "Compute the evidence probability", working: "Use the two-hypothesis partition {+m, −m}.", answer: "P(+s) = 0.8(0.0001) + 0.01(0.9999) = 0.010079", explanation: "Computation check: P(−m)=1−0.0001=0.9999." },
  { label: "3", question: "Compute the posterior", working: "Divide the disease-and-symptom mass by the total symptom mass.", answer: "P(+m | +s) ≈ 0.00794 = 0.794%", explanation: "The symptom changes the belief sharply, yet the posterior remains below one percent because the prior is tiny." },
  { label: "4", question: "Why still seek medical evaluation?", working: "A probability is not a decision by itself; actions also depend on consequences.", answer: "Low probability can still justify action", explanation: "A serious missed diagnosis can carry much higher cost than an examination. Decision thresholds depend on utilities and tests." },
];

const weatherCases: PracticeItem[] = [
  { label: "1", question: "Compute the normalizer P(dry)", working: "Use total probability over weather.", answer: "P(dry) = 0.9(0.8) + 0.3(0.2) = 0.78", explanation: "The two terms are dry-and-sun and dry-and-rain." },
  { label: "2", question: "Compute P(sun | dry)", working: "Apply Bayes’ rule with likelihood 0.9 and prior 0.8.", answer: "P(sun | dry) = 0.72 / 0.78 ≈ 0.923", explanation: "Dry evidence shifts probability toward sun." },
  { label: "3", question: "Compute P(rain | dry)", working: "Use likelihood 0.3, prior 0.2, and the same normalizer.", answer: "P(rain | dry) = 0.06 / 0.78 ≈ 0.077", explanation: "The posterior values sum to one." },
];

const dealerCases: PracticeItem[] = [
  { label: "1", question: "Form the d₂ numerator", working: "Multiply the likelihood of buying a₁ at d₂ by the prior probability of visiting d₂.", answer: "P(a₁ | d₂)P(d₂) = 0.4 × 0.4 = 0.16", explanation: "This is the joint mass P(a₁,d₂)." },
  { label: "2", question: "Compute the evidence normalizer", working: "Sum over the three mutually exclusive dealers.", answer: "P(a₁) = 0.2(0.2) + 0.4(0.4) + 0.3(0.4) = 0.32", explanation: "This uses P(a₁)=ΣᵢP(a₁,dᵢ)." },
  { label: "3", question: "Normalize the d₂ mass", working: "Divide the d₂ joint mass by the total probability of buying a₁.", answer: "P(d₂ | a₁) = 0.16 / 0.32 = 0.5", explanation: "Half of the compatible probability mass belongs to d₂." },
];

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Stochastic reasoning · Part A",
    title: "Reasoning under uncertainty starts with a probability model",
    subtitle: "Variables → distributions → conditional inference → Bayes’ rule",
    content: (
      <div className={styles.hero}>
        <div className={styles.heroVisual}>
          <div className={styles.observation}>evidence</div>
          <div className={styles.arrow}>→</div>
          <div className={styles.modelNode}>probability<br />model</div>
          <div className={styles.arrow}>→</div>
          <div className={styles.belief}>belief</div>
        </div>
        <div className={styles.cardGrid}>
          <ConceptCard label="01" title="Represent"><p>Name uncertain variables and their possible values.</p></ConceptCard>
          <ConceptCard label="02" title="Compute"><p>Use joint, marginal, and conditional probabilities.</p></ConceptCard>
          <ConceptCard label="03" title="Update"><p>Reverse conditionals with Bayes’ rule.</p></ConceptCard>
          <ConceptCard label="04" title="Interpret"><p>Separate posterior belief from causation and decision.</p></ConceptCard>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Ask students for one AI system that must act with incomplete information. Preview the four-part learning path.",
    sourceSlides: [1, 2],
  },
  {
    eyebrow: "Uncertainty · Evidence, targets, and models",
    title: "Evidence is observed; target variables are hidden; a model connects them",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.inferenceDiagram}>
          <div><span>Observed</span><strong>sensor reading</strong><small>facts available now</small></div>
          <b>→</b>
          <div className={styles.modelNode}><span>Model</span><strong>relationship</strong><small>links known to unknown</small></div>
          <b>→</b>
          <div><span>Hidden</span><strong>world state</strong><small>quantity to infer</small></div>
          <div className={styles.matrixBand} aria-label="Belief distribution over hidden states">
            {[0.11, 0.22, 0.37, 0.3].map((value, index) => <i key={index} style={{ opacity: 0.35 + value }} />)}
          </div>
        </div>
        <div className={styles.compactGrid}>
          <ConceptCard label="Observed variables" title="Evidence"><p>Sensor readings, symptoms, or current weather.</p></ConceptCard>
          <ConceptCard label="Unobserved variables" title="Targets"><p>An object’s location, a disease, or tomorrow’s weather.</p></ConceptCard>
          <ConceptCard label="Structured relationship" title="Model"><p>Represents how evidence and hidden quantities relate.</p></ConceptCard>
          <SearchCallout label="Belief, not certainty" tone="cyan">Probability represents degrees of belief and changes when evidence changes.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the three-part source structure. Have students identify evidence, target, and model for self-driving perception.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Probability foundations · Variables and distributions",
    title: "Random variables and probability distributions",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.variablePanel}>
          <SourceFragment file="image5.png" alt="Robot tossing a coin to illustrate a random experiment" caption="A random variable maps uncertain outcomes to values." contain />
          <div className={styles.variableList}>
            <p><strong>R</strong> = Is it raining? <em>{'{true, false}'}</em></p>
            <p><strong>T</strong> = Is it hot or cold? <em>{'{hot, cold}'}</em></p>
            <p><strong>D</strong> = Drive time <em>[0, ∞)</em></p>
            <p><strong>L</strong> = Robot location <em>possible coordinates</em></p>
          </div>
        </div>
        <div className={styles.distributionPanel}>
          <SourceFragment file="image9.png" alt="Four weather conditions: sun, rain, fog, and meteor" caption="Weather outcomes: sun, rain, fog, and meteor." contain />
          <div className={styles.tableRow}>
            <ProbabilityTable caption="P(T)" headers={["T", "P"]} rows={[{ values: ["hot", "0.5"] }, { values: ["cold", "0.5"] }]} />
            <ProbabilityTable caption="P(W)" headers={["W", "P"]} rows={[{ values: ["sun", "0.6"] }, { values: ["rain", "0.1"] }, { values: ["fog", "0.3"] }, { values: ["meteor", "0.0"] }]} />
          </div>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Distinguish the variable, one value, its domain, and the distribution. Compare discrete R and T with continuous D.",
    sourceSlides: [4, 5],
  },
  {
    eyebrow: "Probability foundations · Joint distributions",
    title: "A valid joint distribution covers every complete assignment",
    content: (
      <div className={styles.threeColumn}>
        <ConceptCard label="Constraint 1" title="Nonnegative"><Formula>P(x) ≥ 0</Formula><p>No outcome may receive negative probability.</p></ConceptCard>
        <ConceptCard label="Constraint 2" title="Normalized"><Formula>Σₓ P(x) = 1</Formula><p>The complete outcome space carries total mass one.</p></ConceptCard>
        <div className={styles.tableCard}>
          <ProbabilityTable caption="P(T, W)" headers={["T", "W", "P"]} rows={jointRows} />
          <Formula label="Size">|P(X₁,…,Xₙ)| = ∏ᵢ |Dom(Xᵢ)|</Formula>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Explain complete assignments and the product-of-domain-sizes rule. The shortcut d^n applies only when every domain has size d.",
    sourceSlides: [6, 7],
  },
  {
    eyebrow: "Probabilistic models · Events and queries",
    title: "A joint model makes the probability of any event computable",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.eventPanel}>
          <h3>Event = a set of complete outcomes</h3>
          <div className={styles.outcomeGrid}>
            {jointRows.map((row, index) => <div key={index}><span>{row.values[0]} ∧ {row.values[1]}</span><strong>{row.values[2]}</strong></div>)}
          </div>
          <Formula label="General query">P(E) = Σ<sub>ω ∈ E</sub> P(ω)</Formula>
        </div>
        <div className={styles.queryStack}>
          <ConceptCard label="One row" title="hot AND sun"><p>P(hot, sun) = <strong>0.4</strong></p></ConceptCard>
          <ConceptCard label="Two rows" title="hot"><p>P(hot) = 0.4 + 0.1 = <strong>0.5</strong></p></ConceptCard>
          <ConceptCard label="Union" title="hot OR sun"><p>0.4 + 0.1 + 0.2 = <strong>0.7</strong></p></ConceptCard>
          <SearchCallout label="Do not double-count" tone="amber">The hot-and-sun row belongs to both conditions but is added only once in the union.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Compute the three queries aloud. Clarify that partial assignments identify sets of complete rows.",
    sourceSlides: [8, 9],
  },
  {
    eyebrow: "Formative check · Events",
    title: "Select the rows that satisfy the event, then add each row once",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.tableCard}>
          <ProbabilityTable caption="Joint distribution P(X,Y)" headers={["X", "Y", "P"]} rows={xyRows} />
          <p className={styles.prompt}>Before calculating, point to the included rows.</p>
        </div>
        <ProbabilityPractice ariaLabel="Choose an event-probability question" eyebrow="Commit before reveal" items={eventCases} />
      </div>
    ),
    note: "Timing: 3 minutes. Preserve answers 0.2, 0.5, and 0.6. Diagnose double-counting in the union.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Marginalization · Summing out variables",
    title: "A marginal distribution collapses a joint table by addition",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.marginalVisual}>
          <ProbabilityTable caption="P(T,W)" headers={["T", "W", "P"]} rows={jointRows} />
          <div className={styles.sumArrow}>Σ<sub>W</sub> →</div>
          <ProbabilityTable caption="P(T)" headers={["T", "P"]} rows={[{ values: ["hot", "0.4 + 0.1 = 0.5"], tone: "focus" }, { values: ["cold", "0.2 + 0.3 = 0.5"] }]} />
        </div>
        <div className={styles.queryStack}>
          <Formula>P(x) = Σ<sub>y</sub> P(x,y)</Formula>
          <ConceptCard label="Pair practice" title="Marginalize X"><p>P(+x)=0.5; P(−x)=0.5</p></ConceptCard>
          <ConceptCard label="Pair practice" title="Marginalize Y"><p>P(+y)=0.6; P(−y)=0.4</p></ConceptCard>
          <SearchCallout label="Check" tone="green">Every marginal distribution must sum to one.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Demonstrate one collapsed row, then let pairs complete the X and Y marginals.",
    sourceSlides: [11, 12],
  },
  {
    eyebrow: "Conditional probability · Definition",
    title: "Conditioning restricts the population; it does not imply time or causation",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.conditionVisual}>
          <div className={styles.population}><span>All outcomes</span><div className={styles.conditionSet}><span>Evidence B</span><div className={styles.targetSet}>A ∩ B</div></div></div>
          <Formula>P(A | B) = P(A ∩ B) / P(B)</Formula>
        </div>
        <div className={styles.stack}>
          <ConceptCard label="Question" title="P(sick | cough)"><p>Among people who cough, what fraction are sick?</p></ConceptCard>
          <ConceptCard label="Reverse" title="P(cough | sick)"><p>Among people who are sick, what fraction cough?</p></ConceptCard>
          <SearchCallout label="Interpretation" tone="amber">“Given B” need not mean B happened earlier or caused A. Reversing the conditional changes the reference population.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Derive the ratio from the nested sets. Ask why reversing sick and cough changes the denominator.",
    sourceSlides: [13, 14],
  },
  {
    eyebrow: "Conditional distributions · From one value to a table",
    title: "Each fixed temperature gives one distribution over weather",
    content: (
      <div className={styles.threeColumn}>
        <div className={styles.tableCard}>
          <p className={styles.prompt}><strong>Given hot:</strong> compare only hot cases.</p>
          <ProbabilityTable caption="P(W | T = hot)" headers={["Weather W", "Probability"]} rows={[{ values: ["sun", "0.8"], tone: "focus" }, { values: ["rain", "0.2"] }]} />
          <p className={styles.prompt}>The two probabilities sum to 1.</p>
        </div>
        <div className={styles.tableCard}>
          <p className={styles.prompt}><strong>Given cold:</strong> compare only cold cases.</p>
          <ProbabilityTable caption="P(W | T = cold)" headers={["Weather W", "Probability"]} rows={[{ values: ["sun", "0.4"] }, { values: ["rain", "0.6"], tone: "focus" }]} />
          <p className={styles.prompt}>This table also sums to 1.</p>
        </div>
        <div className={styles.conditionalQuestionStack}>
          <ConceptCard label="Question 1 · Read the hot table" title="If it is hot, which weather is more likely?"><p><strong>Sun:</strong> P(sun | hot) = 0.8, compared with P(rain | hot) = 0.2.</p></ConceptCard>
          <ConceptCard label="Question 2 · Read the cold table" title="If it is cold, which weather is more likely?"><p><strong>Rain:</strong> P(rain | cold) = 0.6, compared with P(sun | cold) = 0.4.</p></ConceptCard>
          <ConceptCard label="Question 3 · Compare" title="What changed between the tables?"><p>Changing the fixed evidence from hot to cold shifts probability from sun toward rain. Each table is a complete distribution over <strong>W</strong>.</p></ConceptCard>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Students read one probability from each table, then compare how changing the fixed temperature changes the weather distribution. Emphasize that each conditional table sums to one.",
    sourceSlides: [15, 16],
  },
  {
    eyebrow: "Normalization trick · Select, then normalize",
    title: "The selected mass is exactly the probability of the evidence",
    content: (
      <div className={styles.normalizationFlow}>
        <div className={styles.tableCard}><ProbabilityTable caption="1 · Joint table" headers={["T", "W", "P"]} rows={jointRows} /></div>
        <div className={styles.flowArrow}>select<br /><strong>T = cold</strong> →</div>
        <div className={styles.tableCard}><ProbabilityTable caption="2 · Compatible rows" headers={["W", "mass"]} rows={[{ values: ["sun", "0.2"], tone: "focus" }, { values: ["rain", "0.3"], tone: "focus" }]} /></div>
        <div className={styles.flowArrow}>divide by<br /><strong>0.5</strong> →</div>
        <div className={styles.tableCard}><ProbabilityTable caption="3 · P(W | cold)" headers={["W", "P"]} rows={[{ values: ["sun", "0.4"] }, { values: ["rain", "0.6"] }]} /></div>
      </div>
    ),
    note: "Timing: 2 minutes. Derive the trick from P(W|T=c)=P(W,T=c)/P(T=c), where the selected-row sum is P(T=c).",
    sourceSlides: [17, 18],
  },
  {
    eyebrow: "Formative check · Normalization",
    title: "Selection preserves ratios; normalization makes them probabilities",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.tableCard}>
          <ProbabilityTable caption="Select Y = −y" headers={["X", "Y", "P"]} rows={xyRows.map((row, index) => ({ ...row, tone: index === 1 || index === 3 ? "focus" : "muted" }))} />
          <Formula label="Normalizer">P(−y) = 0.3 + 0.1 = 0.4</Formula>
        </div>
        <ProbabilityPractice ariaLabel="Choose a normalization component" eyebrow="Conditional vector" items={normalizationCases} />
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to predict which value is larger, then compute 0.75 and 0.25 and check the sum.",
    sourceSlides: [19],
  },
  {
    eyebrow: "In-class practice · Three coin tosses",
    title: "Three coin tosses: outcomes, events, and X",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.coinPanel}>
          <figure className={styles.threeTosses} aria-label="Three independent fair coin tosses; the illustrated example is heads, heads, tails">
            <div className={styles.tossRow}>{["H", "H", "T"].map((face,index) => <div className={styles.tossStep} key={index}><strong>Toss {index+1}</strong><span className={styles.tossCoin}>{face}</span><small>H or T · ½ each</small></div>)}</div>
            <figcaption>Example: HHT → two heads → X=2. H = heads; T = tails.</figcaption>
          </figure>
          <div className={styles.outcomes}>
            {["HHH", "HHT", "HTH", "HTT", "THH", "THT", "TTH", "TTT"].map(value => <span key={value}>{value}</span>)}
          </div>
          <p><strong>Event A:</strong> more heads than tails · <strong>Event B:</strong> first toss is H</p>
          <p className={styles.coinDefinition}><strong>Random variable X = number of heads.</strong> Three independent fair tosses give X ∈ {'{0, 1, 2, 3}'}. For example, X(HHT)=2 and X(TTT)=0. The eight outcomes above are equally likely (⅛ each). Q4 asks for the probability of each value of X.</p>
        </div>
        <ProbabilityPractice ariaLabel="Choose a coin-toss exercise question" eyebrow="Five-part probability lab" items={coinCases} />
      </div>
    ),
    note: "Timing: 4 minutes. Let groups answer Q1–Q5. Explicitly correct Q3: A and B are events; X and I are random variables.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Inference scenario · Competing explanations",
    title: "One observation can support several hidden causes",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.trafficScenePanel}>
          <figure className={styles.trafficScene}>
            <img src="/lesson-visuals/lesson11-construction-traffic.png" alt="Orange-and-white construction barrels close a lane beside workers and an excavator, while cars queue in heavy traffic." />
            <figcaption>Construction closes a lane. Orange barrels mark the work zone. Cars back up into bad traffic.</figcaption>
          </figure>
          <SourceFragment file="image58.png" alt="Dependency sketch linking construction and accident to bad traffic and related evidence" contain />
        </div>
        <div className={`${styles.stack} ${styles.trafficEvidence}`}>
          <ConceptCard label="Observed now" title="Bad traffic"><p>The vehicle slows because traffic is congested.</p></ConceptCard>
          <ConceptCard label="Competing hypotheses" title="Construction or accident"><p>Either hidden cause could explain the same observation.</p></ConceptCard>
          <ConceptCard label="Discriminating evidence" title="Barrels or flashing lights"><p>Additional observations can shift belief between explanations.</p></ConceptCard>
          <SearchCallout label="Inference task" tone="cyan">Compare posterior beliefs after evidence—not merely which story sounds plausible.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to separate observations from hypotheses and name evidence that discriminates between the causes.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Traffic inference · Marginalize and condition",
    title: "Bad traffic raises the construction belief from 0.5 to 0.75",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.trafficPanel}>
          <SourceFragment file="image58.png" alt="Construction and accident dependency sketch" contain />
          <ProbabilityTable caption="P(C,T)" headers={["C", "T", "P"]} rows={[{ values: ["true", "true", "0.3"], tone: "focus" }, { values: ["true", "false", "0.2"] }, { values: ["false", "true", "0.1"], tone: "focus" }, { values: ["false", "false", "0.4"] }]} />
        </div>
        <ProbabilityPractice ariaLabel="Choose a traffic-inference question" eyebrow="Evidence update" items={trafficCases} />
      </div>
    ),
    note: "Timing: 4 minutes. The C,T table supports the first two calculations. A numeric barrel update needs probabilities involving B.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Product rule · Reconstructing a joint",
    title: "Multiply a prior by a conditional to recover joint probability",
    subtitle: "P(x,y) = P(y)P(x | y)",
    content: (
      <div className={styles.twoColumn}>
        <SourceFragment file="image62.png" alt="Cartoon multiplication showing two probability factors combine into a joint probability" caption="Two probability factors combine into a joint probability." contain />
        <div className={styles.productPanel}>
          <ProbabilityTable caption="P(W)" headers={["W", "P"]} rows={[{ values: ["sun", "0.8"] }, { values: ["rain", "0.2"] }]} />
          <ProbabilityTable caption="P(D | W)" headers={["W", "wet", "dry"]} rows={[{ values: ["sun", "0.1", "0.9"] }, { values: ["rain", "0.7", "0.3"] }]} />
          <Formula label="Four joint cells">0.08 · 0.72 · 0.14 · 0.06</Formula>
          <SearchCallout label="Check" tone="green">The four products sum to one.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Trace all four products and confirm normalization.",
    sourceSlides: [23, 24],
  },
  {
    eyebrow: "Chain rule · Incremental factorization",
    title: "Repeated product rules factor any joint distribution",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.chainVisual}>
          <Formula label="Two variables">P(x₁,x₂) = P(x₁)P(x₂ | x₁)</Formula>
          <Formula label="Three variables">P(x₁,x₂,x₃) = P(x₁)P(x₂ | x₁)P(x₃ | x₁,x₂)</Formula>
          <Formula label="n variables">P(x₁,…,xₙ) = ∏ᵢ P(xᵢ | x₁,…,xᵢ₋₁)</Formula>
          <SearchCallout label="No independence assumption" tone="cyan">The chain rule is an identity. Independence assumptions may simplify its factors later.</SearchCallout>
        </div>
        <ProbabilityPractice ariaLabel="Choose a chain-rule depth" eyebrow="Build the factorization" items={chainCases} />
      </div>
    ),
    note: "Timing: 3 minutes. Build the three formulas one factor at a time. Stress ordering and the absence of independence assumptions.",
    sourceSlides: [25],
  },
  {
    eyebrow: "Bayes’ rule · Reverse a conditional",
    title: "Two factorizations of the same joint yield Bayes' rule",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.bayesPortrait}>
          <SourceFragment file="image71.jpeg" alt="Portrait of Thomas Bayes" caption="Thomas Bayes (1701–1761)" contain />
          <Formula>P(x,y) = P(x | y)P(y)</Formula>
          <Formula>P(x,y) = P(y | x)P(x)</Formula>
        </div>
        <div className={styles.derivation}>
          <p>Set the two factorizations equal:</p>
          <Formula>P(x | y)P(y) = P(y | x)P(x)</Formula>
          <p>Divide by P(y), provided P(y) &gt; 0:</p>
          <Formula label="Bayes' rule">P(x | y) = P(y | x)P(x) / P(y)</Formula>
          <div className={styles.bayesTerms}><span>posterior</span><span>likelihood</span><span>prior</span><span>evidence</span></div>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Derive Bayes' rule rather than presenting it as memorization. Name all four quantities.",
    sourceSlides: [26, 27],
  },
  {
    eyebrow: "Bayes' rule · Diagnosis",
    title: "Posterior disease probability is not the probability that disease causes a symptom",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.diagnosisDiagram}>
          <div className={styles.causeNode}>Disease<br /><small>hypothesis d</small></div>
          <div className={styles.causalArrow}>causal direction →</div>
          <div className={styles.effectNode}>Symptom<br /><small>evidence s</small></div>
          <div className={styles.reverseArrow}>← inferential direction</div>
          <Formula>P(d | s) = P(s | d)P(d) / P(s)</Formula>
        </div>
        <div className={styles.compactGrid}>
          <ConceptCard label="Posterior" title="P(disease | symptom)"><p>Belief in disease after observing the symptom.</p></ConceptCard>
          <ConceptCard label="Likelihood" title="P(symptom | disease)"><p>How probable the symptom is if the disease is present.</p></ConceptCard>
          <ConceptCard label="Prior" title="P(disease)"><p>Belief before the current symptom is observed.</p></ConceptCard>
          <SearchCallout label="Meaning correction" tone="amber">Bayes&apos; rule reverses a conditional; it does not prove causation.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Use cold, fever, runny nose, cough, and ear infection as examples. Contrast posterior and likelihood.",
    sourceSlides: [28],
  },
  {
    eyebrow: "Total probability · The evidence normalizer",
    title: "Partition the hypothesis space, then add disjoint joint masses",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.partition}>
          <div className={styles.eventSlice}>E</div>
          {["H₁", "H₂", "H₃"].map(label => <div key={label}><span>{label}</span></div>)}
        </div>
        <div className={styles.stack}>
          <Formula>E = (E∩H₁) ∪ (E∩H₂) ∪ ··· ∪ (E∩Hₙ)</Formula>
          <Formula>P(E) = Σᵢ P(E∩Hᵢ)</Formula>
          <Formula label="Total probability">P(E) = Σᵢ P(E | Hᵢ)P(Hᵢ)</Formula>
          <SearchCallout label="Why addition works" tone="amber">The hypotheses are mutually exclusive and collectively exhaustive, so the pieces are disjoint. No overlap subtraction is needed.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Trace E across the partition and connect P(E) to the denominator in Bayes' rule.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Worked example · Rare-disease diagnosis",
    title: "Does a stiff neck imply meningitis?",
    content: (
      <div className={styles.twoColumn}>
        <div className={`${styles.medicalPanel} ${styles.medicalContext}`}>
          <SourceFragment file="image82.jpeg" alt="Cutaway showing the bony skull outside the meninges, protective membranes around the brain, with inflamed meninges and stiff-neck symptoms" contain />
          <div className={styles.givens}><span>P(+m)=0.0001</span><span>P(+s | +m)=0.8</span><span>P(+s | −m)=0.01</span></div>
        </div>
        <div className={styles.medicalDetails}>
          <div className={styles.exampleContext}>
            <p><strong>Medical scene:</strong> A person has a stiff neck. Could meningitis explain the symptom?</p>
            <p><strong>Skull → meninges → brain:</strong> the skull is the bony case; the meninges are protective membranes around the brain and spinal cord. <strong>Meningitis</strong> is inflammation of these membranes and can cause a stiff neck. <a href="https://www.cdc.gov/meningitis/about/index.html" target="_blank" rel="noreferrer">Medical context: CDC</a></p>
            <p><strong>M = meningitis; S = stiff neck.</strong> +m means disease present; −m means absent. +s means stiff neck present; −s means absent. These are true/false values, not arithmetic signs.</p>
            <p><strong>Question:</strong> Given a stiff neck, what is P(+m | +s)? Use the illustrative probabilities below.</p>
          </div>
          <ProbabilityPractice ariaLabel="Choose a meningitis calculation step" eyebrow="Work the posterior" items={meningitisCases} />
        </div>
      </div>
    ),
    note: "Timing: 4 minutes. Compute the normalizer and posterior. Discuss why action also depends on consequences and follow-up tests.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Student participation · Bayes' rule",
    title: "Dry conditions make sun much more probable than rain",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.weatherPanel}>
          <SourceFragment file="image9.png" alt="Sun and rain among four possible weather states" contain />
          <ProbabilityTable caption="Prior P(W)" headers={["W", "P"]} rows={[{ values: ["sun", "0.8"] }, { values: ["rain", "0.2"] }]} />
          <ProbabilityTable caption="Likelihood P(dry | W)" headers={["W", "P"]} rows={[{ values: ["sun", "0.9"] }, { values: ["rain", "0.3"] }]} />
        </div>
        <ProbabilityPractice ariaLabel="Choose a weather posterior step" eyebrow="Posterior distribution" items={weatherCases} />
      </div>
    ),
    note: "Timing: 3 minutes. Compute P(dry)=0.78, P(sun|dry)=0.923, and P(rain|dry)=0.077. Require the sum-to-one check.",
    sourceSlides: [31],
  },
  {
    eyebrow: "General Bayes theorem · Four quantities",
    title: "The posterior combines prior belief, likelihood, and evidence prevalence",
    content: (
      <div className={styles.bayesBoard}>
        <Formula>P(H | e) = P(e | H) P(H) / Σᵢ P(e | Hᵢ)P(Hᵢ)</Formula>
        <div className={styles.cardGrid}>
          <ConceptCard label="Prior · P(H)" title="Before"><p>How plausible was H before this evidence?</p></ConceptCard>
          <ConceptCard label="Likelihood · P(e|H)" title="Compatibility"><p>How well does H predict the evidence?</p></ConceptCard>
          <ConceptCard label="Evidence · P(e)" title="Prevalence"><p>How probable is e across all hypotheses?</p></ConceptCard>
          <ConceptCard label="Posterior · P(H|e)" title="After"><p>How plausible is H after observing e?</p></ConceptCard>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Point to each term in the formula and match it to its physical meaning.",
    sourceSlides: [32],
  },
  {
    eyebrow: "Hypothesis selection · MAP versus maximum likelihood",
    title: "Including the prior makes the rule MAP, not maximum likelihood",
    content: (
      <div className={styles.comparison}>
        <ConceptCard label="Maximum likelihood" title="arg maxₕ P(E | h)"><p>Chooses the hypothesis that makes the evidence most likely. The prior is omitted.</p></ConceptCard>
        <ConceptCard label="Maximum a posteriori" title="arg maxₕ P(E | h)P(h)"><p>Chooses the most probable hypothesis after evidence. P(E) is common and can be dropped.</p></ConceptCard>
        <div className={styles.equalPrior}>
          <strong>Uniform prior</strong><span>⇒</span><p>MAP and ML choose the same hypothesis.</p>
        </div>
        <SearchCallout label="Terminology check" tone="amber">Dropping P(E) is valid for the argmax. Keeping P(h) means the estimator is MAP.</SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Have students compare the two objectives and state exactly when they agree.",
    sourceSlides: [33],
  },
  {
    eyebrow: "Worked example · Dealer inference",
    title: "Which dealer sold the purchased car?",
    content: (
      <div className={styles.twoColumn}>
        <div className={`${styles.dealerPanel} ${styles.dealerContext}`}>
          <div className={styles.exampleContext}>
            <p><strong>Scene:</strong> You visit exactly one of three car dealers. All three sell car model a₁, but your chance of buying it differs by dealer.</p>
            <p><strong>D = dealer visited.</strong> d₁, d₂, d₃ name the three possible dealers; dᵢ means “dealer i.” <strong>a₁ = the event that you buy car model 1.</strong></p>
            <p><strong>Question:</strong> You bought model a₁. What is the probability you bought it at dealer d₂—that is, P(d₂ | a₁)?</p>
          </div>
          <ProbabilityTable caption="Prior dealer probability" headers={["Dealer", "P(dᵢ)"]} rows={[{ values: ["d₁", "0.2"] }, { values: ["d₂", "0.4"], tone: "focus" }, { values: ["d₃", "0.4"] }]} />
          <ProbabilityTable caption="Purchase likelihood" headers={["Dealer", "P(a₁ | dᵢ)"]} rows={[{ values: ["d₁", "0.2"] }, { values: ["d₂", "0.4"], tone: "focus" }, { values: ["d₃", "0.3"] }]} />
          <Formula>P(d₂ | a₁) = 0.16 / 0.32 = 0.5</Formula>
        </div>
        <ProbabilityPractice ariaLabel="Choose a dealer-example calculation step" eyebrow="Three-step solution" items={dealerCases} />
      </div>
    ),
    note: "Timing: 3 minutes. Compute numerator, denominator, and posterior. Preserve P(a1)=ΣᵢP(a1,di).",
    sourceSlides: [34],
  },
  {
    eyebrow: "Cumulative assessment · Probability foundations",
    title: "Represent uncertainty, compute an update, and defend the interpretation",
    content: (
      <div className={styles.exit}>
        <ConceptCard label="1 · Represent" title="Build the model"><p>Define variables and domains. Verify a joint distribution is nonnegative and normalized.</p></ConceptCard>
        <ConceptCard label="2 · Infer" title="Show the calculation"><p>Select or marginalize rows, compute the normalizer, and apply the correct probability rule.</p></ConceptCard>
        <ConceptCard label="3 · Interpret" title="State what it means"><p>Distinguish event from variable, posterior from likelihood, association from cause, and MAP from ML.</p></ConceptCard>
        <aside>
          <strong>Prepare for Lesson 12</strong>
          <p>Read George F. Luger, <em>Artificial Intelligence</em>, 6th ed., and Stuart Russell and Peter Norvig, <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed., Chapter 13. Bring one example in which a prior changes the selected hypothesis.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Collect one complete response with a normalized model, transparent calculation, and defensible interpretation.",
    sourceSlides: [1, 2, 20, 22, 25, 27, 29, 31, 32, 33, 34],
  },
];

export function Meeting09Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      meetingLabel="Module 9 · Lesson 11"
      meetingTitle="Probability Foundations and Bayesian Inference"
      resolveSourceReference={resolveMeeting09SourceReference}
      slides={slides}
      sourceCollectionLabel={SOURCE_DECK_LABEL}
    />
  );
}
