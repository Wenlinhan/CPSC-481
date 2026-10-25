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
        src={file.startsWith("/") ? file : `${SOURCE_ROOT}/raw-media/${file}`}
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
    note: "Lesson eleven begins where certainty ends. An AI system rarely receives a complete, perfectly accurate world state. A medical agent sees symptoms, a robot receives noisy sensors, and a weather system sees measurements rather than tomorrow itself. Probability gives us a disciplined language for representing what could be true and how strongly the available evidence supports each possibility. The path on this slide has four jobs. Represent uncertain variables and their possible values. Compute joint, marginal, and conditional probabilities. Update beliefs with Bayes' rule. Then interpret the result without quietly converting association into causation. Think of the probability model as a bridge: evidence enters on one side, and a distribution over plausible hidden states leaves on the other. A probability of point seven is not a tiny oracle shouting seventy percent certainty. It is a claim made inside a model, using assumptions and evidence that can be questioned. If new evidence arrives, the belief should move. Our recurring audit will be: what is observed, what is hidden, what model connects them, and what exact calculation justifies the update? Here is the practical transfer. A spam filter, navigation agent, and medical screener may all produce probabilities, but the variables and consequences differ. The numerical machinery does not decide what counts as evidence or which errors matter. Before trusting a posterior, inspect data collection, domain definitions, and calibration. A model whose seventy-percent predictions are correct only forty percent of the time has not discovered a bold new interpretation of arithmetic; it is miscalibrated.",
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
    note: "Separate three roles. Evidence variables are observed now: a sensor reading, a symptom, or a report of rain. Target variables are the hidden quantities we want to infer: an object's location, a disease state, or tomorrow's weather. The model describes how those known and unknown quantities relate. Without the model, evidence is merely a fact looking for a job. For a self-driving car, a camera patch and lidar return are evidence. The hidden target might be whether a pedestrian occupies the lane. A model connects visual patterns and distances to that hidden state, producing a belief distribution rather than a single unqualified answer. The four bars illustrate that several states may retain probability at the same time. The arrow is inferential, not magical. If the model omits glare, unusual clothing, or a broken sensor, its posterior can be confidently wrong. Probability helps us expose uncertainty; it does not disinfect bad assumptions. Always name the evidence, target, and relationship separately, because mixing them is how a plausible story sneaks into the lab wearing a fake data badge. Try the three-role test on voice recognition. The sound waveform is evidence, the intended word is hidden, and an acoustic-language model connects them. Several word sequences may remain plausible. Context can shift their probabilities without changing the recorded sound. This is why a system can revise an earlier transcription after hearing the end of a sentence: later evidence changes belief over the hidden sequence.",
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
    note: "A random variable is a function that names an uncertain aspect of the world and maps outcomes to values. R might ask whether it rains and take true or false. T might take hot or cold. Drive time D is continuous over nonnegative values, while robot location L ranges over coordinates. The variable is the question; one value is a possible answer. A domain lists legal values. A probability distribution assigns mass or density across that domain. The weather table places point six on sun, point one on rain, point three on fog, and effectively zero on meteor. Those values must be interpreted together. Saying weather equals sun is one outcome; saying P of weather is a distribution describes the whole uncertain menu. Use a restaurant metaphor. The random variable is the menu category, the domain is the list of dishes, and the distribution is how likely customers are to order each dish. A continuous variable is more like soup volume: individual exact values need densities and intervals. Do not confuse the menu with today's order, unless you enjoy receiving seventeen entrees and a probability-theory bill. One more distinction matters for continuous variables. For discrete weather, probabilities attach to individual values. For drive time, probability usually belongs to an interval, such as between twenty and twenty-five minutes; the probability of one exact real number may be zero even though that number is possible. A density is not itself a probability. Integrating density over an interval produces probability, just as a height map needs area before it tells us volume.",
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
    note: "A joint distribution is a complete ledger over assignments to several variables. For temperature and weather, each row specifies both values: hot and sun, hot and rain, cold and sun, or cold and rain. These are complete assignments. A row that says only hot is incomplete because weather is still unspecified. Two constraints make the table legal. Every probability must be nonnegative; negative probability would be like owing three tenths of an outcome to the universe. Second, all complete rows must sum to one because exactly one complete assignment occurs. Here point four plus point one plus point two plus point three equals one. Table size grows as the product of domain sizes. If variable X i has domain size d i, the joint contains the product of all d i rows. The shortcut d to the n works only when every variable has the same domain size. This growth is the first warning that full joint tables become enormous: probability is tidy, but its spreadsheet can become a small planet. Now scale the table. Ten binary variables require two to the tenth, or one thousand twenty-four rows. Thirty binary variables require more than one billion. This combinatorial growth motivates factorization and graphical models: represent local relationships instead of writing every complete assignment explicitly. The joint distribution remains the semantic foundation, while compact structure becomes the engineering survival kit. We will use the chain rule later to show how that factorization begins.",
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
    note: "An event is a set of complete outcomes. Hot and sun identifies one row, so its probability is point four. Hot alone identifies two rows because weather may be sun or rain, so we add point four and point one. The general rule is to sum the probability of every complete outcome that satisfies the event. For hot OR sun, include hot-sun, hot-rain, and cold-sun. Add point four, point one, and point two to get point seven. The hot-sun row satisfies both descriptions, but it is still one physical row. Counting it twice is like charging the same student twice because they are both a computer-science major and hungry. A useful procedure is mechanical: translate the query into a membership test, mark each satisfying row, and add each marked mass once. AND narrows to intersections; OR creates unions; leaving a variable unspecified gathers multiple rows. The joint model earns its keep because every event query becomes careful bookkeeping rather than storytelling. Compare OR with the addition rule P of A union B equals P of A plus P of B minus P of A intersection B. The subtraction removes the duplicate overlap created when two event totals were added. Row selection and the formula are the same logic viewed from different distances. On a tiny table, marking rows is safer; on symbolic events, inclusion-exclusion is compact. Either way, overlap gets exactly one seat.",
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
    note: "Use the joint table as the source of truth. Before touching arithmetic, point to the rows that satisfy the event. That habit separates logical selection from numerical addition and catches most double-counting errors. The four masses sum to one, so every answer must fall between zero and one. We will work all three prompts and expose the answer only after naming the included rows. Notice how each question changes only the set of selected rows. Q one selects a single complete assignment. Q two ignores Y and therefore gathers a marginal. Q three combines a union and must protect the overlap. The arithmetic is deliberately easy so the logic is visible. In larger models, software may perform the summation, but you still need to state which worlds belong to the event or the computer will sum the wrong neighborhood with flawless enthusiasm. Reveal Q1. The answer is point two because plus x and plus y names exactly the first row. No summation is needed; a complete assignment selects one ledger entry. Choose Q2. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal Q2. The answer is point five. Plus x leaves Y unspecified, so add point two and point three. This is marginalization: Y has been summed out. Choose Q3. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal Q3. The union is point six. Include plus x plus y, plus x minus y, and minus x minus y once each. The overlap row is not charged a second admission fee.",
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
    note: "Marginalization removes a variable from a joint table by summing over its possible values. To find P of hot, keep temperature fixed at hot and add across weather: point four plus point one equals point five. To find P of cold, add point two plus point three, also point five. The notation P of x equals the sum over y of P of x comma y says exactly that. We are not deleting evidence or averaging rows; we are collecting every complete world compatible with x. Imagine checking hotel occupancy by floor: to get the building total, add every room count without caring which room number supplied it. The X marginal is point five and point five. The Y marginal is point six for plus y and point four for minus y. Each marginal distribution must sum to one. That is a powerful checksum. If it does not, a row vanished, a row was counted twice, or arithmetic took an unscheduled vacation. Marginalization can also eliminate many variables: P of x equals the sum over every assignment to y and z of P of x, y, z. Computationally, the order of those sums can matter enormously when a model is factorized, even though the final probability does not change. Variable elimination exploits that fact. Today's table addition is the small, transparent ancestor of inference algorithms used in Bayesian networks.",
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
    note: "Conditional probability asks about A inside the restricted world where B is true. The formula P of A given B equals P of A intersection B divided by P of B. The numerator is the mass satisfying both; the denominator rescales the entire B population to one. Among people who cough, what fraction are sick is P sick given cough. Among people who are sick, what fraction cough is P cough given sick. These denominators describe different reference populations, so the values can be dramatically different. Reversing the vertical bar is not a harmless typographical yoga pose. The word given does not automatically mean earlier, caused by, or morally responsible for. It means conditioned on. A diagnostic symptom may be evidence about a disease, but the conditional calculation alone does not establish causal direction. Always translate the notation into an among-the-cases-that sentence; the denominator then becomes visible in plain English. Conditional probability becomes undefined when P of B is zero because there is no reference population to normalize. In continuous models, conditioning on exact values requires densities or more careful definitions. For our finite tables, the safety rule is simple: check that the denominator is positive, name it in words, and verify the resulting conditional values sum to one. Denominators deserve background checks too.",
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
    note: "A conditional distribution contains one normalized table for each fixed evidence value. Under hot, sun has probability point eight and rain point two. Under cold, sun has point four and rain point six. Each column of context answers a different question and each must sum to one. For plus x given plus y, select the two rows where y is positive. Their total mass is point six; the plus-x part is point two, giving one third. Minus x given plus y is point four divided by point six, or two thirds. For minus y given plus x, the denominator changes to point five and the answer is point six. Conditioning is like changing the guest list before calculating proportions. Once only plus-y guests enter the room, every percentage is computed inside that room. If you silently reuse the denominator from another room, the arithmetic may look polished while answering the wrong party invitation. Compare P of weather given hot with P of weather given cold. The distribution changes because temperature is informative about weather in this model. If the two tables were identical, weather and temperature would be independent: learning temperature would not change weather belief. Independence is therefore a statement about unchanged conditionals, not a vague claim that variables have never met at a conference.",
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
    note: "The normalization trick has three visible stages. Begin with the joint table. Select rows compatible with T equals cold: cold-sun has mass point two and cold-rain has point three. Their selected mass is point five, which is exactly P of T equals cold. Divide each compatible mass by point five. Sun becomes point four and rain becomes point six. Selection preserves the relative ratio two to three; normalization turns that selected pile into a proper probability distribution totaling one. Think of zooming into a photograph. Selection crops to the evidence region; normalization enlarges that crop to fill the frame. Nothing outside the crop survives, but relationships inside it remain proportional. This procedure is Bayes' denominator in miniature: gather all ways the evidence can occur, then divide the favored way by the complete evidence mass. The select-normalize routine generalizes to any finite conditional query. First zero out incompatible assignments. Second sum what remains to obtain the normalizer. Third divide every surviving mass by that sum. This is sometimes written with proportionality: P of query given evidence is proportional to the joint mass consistent with both. The missing constant is not mysterious; it is precisely the amount required to make the surviving distribution sum to one.",
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
    note: "Condition on Y equals minus y by selecting masses point three and point one. Their total is point four. Before calculating, predict that plus x will receive three times the probability of minus x because the selected masses have a three-to-one ratio. We will reveal both components, then verify that the conditional vector sums to one. The sum check is not ceremonial; it is the fastest detector of a wrong normalizer. Ratios provide a mental shortcut. Before normalization, point three to point one is three to one. After normalization, it must remain three to one while totaling one, so the answer is three quarters and one quarter. This lets you estimate conditionals before calculating. If a calculator returns point six and point four, the sum passes but the preserved-ratio test fails. Two independent checks are better than one confident green checkmark. Reveal plus x. The selected evidence mass is point four. Plus x owns point three of it, so P of plus x given minus y is point three divided by point four, or point seven five. Choose minus x. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal minus x. Minus x owns point one of the same point-four evidence mass, giving point two five. Point seven five plus point two five equals one, so the conditional vector passes its checksum.",
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
    note: "Three fair coin tosses create eight equally likely sequences. The sample space contains HHH through TTT. Event A is the set with more heads than tails; event B is the set whose first toss is H. An event is a collection of outcomes, not a numerical measuring device. A random variable maps each sequence to a value. X can count heads from zero through three, while indicator I records whether the first toss is H. We will use the interactive lab to keep sample space, event, random variable, distribution, and conditional probability in their correct drawers. The distribution one-three-three-one comes from combinations. Exactly two heads can occur as HHT, HTH, or THH, three sequences; exactly one head also has three placements. This symmetry gives P of A equals one half. Conditioning on the first toss being H breaks some symmetry and raises the chance of a head majority to three quarters. Evidence changes the sample space before it changes the fraction. Reveal Q1. There are eight length-three sequences. The sample space lists every possible H or T string, so its size is two cubed. Choose Q2. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal Q2. Event A contains HHH, HHT, HTH, and THH. Event B contains the four sequences beginning with H. Each event therefore has probability four eighths. Choose Q3. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal Q3. A and B are events, sets of outcomes. X, the number of heads, and I, the first-toss indicator, are random variables because they map each outcome to a value. Choose Q4. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal Q4. The distribution of X is one, three, three, one over eight for zero through three heads. Those binomial counts total eight. Choose Q5. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal Q5. Conditioning on B leaves HHH, HHT, HTH, and HTT. Three have more heads than tails, so P of A given B is three fourths.",
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
    note: "Bad traffic is an observation. Construction and an accident are competing hidden explanations. The same evidence can support several hypotheses, so inference should distribute belief rather than award the first plausible story a detective badge. Additional evidence can discriminate. Orange barrels are more compatible with construction; flashing emergency lights may be more compatible with an accident. A probabilistic model specifies those relationships quantitatively. Without likelihoods, saying one clue feels construction-like is useful intuition, not yet a posterior calculation. This is explaining away territory: once one cause receives strong support, belief in another competing cause may fall, depending on the model. Think of hearing a crash in the kitchen. A dropped pan and a very confident cat are both hypotheses. Seeing the pan on the floor changes the distribution, although the cat will continue denying everything. Do not confuse a dependency sketch with a complete Bayesian network specification. Arrows suggest conditional structure, but inference needs numerical conditional probability tables and assumptions about omitted relationships. A beautiful diagram without parameters is a street map without distances: it tells us which roads connect but not how long the trip takes. We can reason qualitatively, yet a numerical posterior still needs the missing model.",
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
    note: "The displayed joint table contains construction C and bad traffic T. It supports a prior calculation and an update after observing traffic. It does not yet contain a barrel variable, so a numeric barrel update would require additional probabilities. We will marginalize over traffic to find the construction prior, condition on bad traffic, and then state precisely what extra model information barrels would require. The update from point five to point seven five is evidence-sensitive, not causal proof. Bad traffic is more common when construction is present in this joint model, so observing traffic reallocates probability. It does not prove construction caused this particular slowdown. If an unmodeled parade creates traffic, the posterior may be overstated. Model completeness and data quality remain part of the conclusion. Reveal Q1. Marginalize over traffic. The two construction-true rows have masses point three and point two, so the prior P of C is point five. Choose Q2. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal Q2. Under bad traffic, compatible masses are point three with construction and point one without it. Normalize point three by point four to get point seven five. Choose Q3. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal Q3. Barrels should increase construction belief only if they are more likely when construction is true. A numeric update needs probabilities involving a barrel variable; arrows alone do not manufacture numbers.",
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
    note: "The product rule reconstructs a joint cell from a prior and a conditional: P of x comma y equals P of y times P of x given y. For sun and wet, multiply point eight by point one to get point zero eight. For sun and dry, multiply point eight by point nine to get point seven two. Rain contributes point two times point seven equals point one four for wet, and point two times point three equals point zero six for dry. The four products sum to one. Each product represents a path through a probability tree: choose weather, then choose surface condition inside that weather branch. Multiplication handles sequential restriction; addition combines mutually exclusive ways. That two-operation rhythm appears everywhere in probability models. Multiply along one explanatory route, add across alternative routes. It is the probability version of calculating each restaurant bill and then discovering your friends want to split all four checks. The product rule can be rearranged into the conditional definition and Bayes' rule, so these are not disconnected formulas. They are different views of one joint quantity. A probability tree makes the relationship visual: branch probabilities multiply to leaf masses, and leaf masses add across events. Whenever you feel lost, reconstruct the joint leaves. The algebra usually becomes less dramatic once every symbol has a physical row.",
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
    note: "The chain rule repeatedly applies the product rule. For two variables, factor the joint as P of x one times P of x two given x one. Add a third factor conditioned on the first two, and continue until every variable appears. The identity requires no independence assumption. Ordering may change the factors, but the complete product still represents the same joint when the corresponding conditionals are correct. We will build the two-variable, three-variable, and n-variable forms interactively. Ordering creates a modeling opportunity. The full chain rule conditions on all predecessors, which may be expensive. If justified conditional independences let us omit some predecessors, the factorization becomes compact. Bayesian networks encode those omissions with parent sets. But deleting a condition is an assumption about the world, not a formatting preference. Every missing dependency should be defended by domain knowledge, data, or both. Reveal 2. For two variables, P of x one comma x two equals P of x one times P of x two given x one. Reversing the ordering is also valid with corresponding factors. Choose 3. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal 3. For three variables, append P of x three given x one and x two. The previous variables become the accumulated context. Choose n. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal n. For n variables, multiply one conditional per variable, each conditioned on all predecessors in the chosen ordering. This is an identity, not an independence claim.",
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
    note: "Bayes' rule comes from writing the same joint probability two ways. P of x comma y equals P of x given y times P of y. It also equals P of y given x times P of x. Set those expressions equal and divide by P of y, assuming the denominator is positive. The result is posterior equals likelihood times prior divided by evidence. Posterior P of x given y is the updated belief. Likelihood P of y given x measures how compatible the evidence is with x. Prior P of x is the belief before y. Evidence P of y normalizes across all possible explanations. Bayes is not a spell for swapping letters around a vertical bar. It is accounting for the base rate while reversing a conditional. Think of a courtroom: likelihood asks how expected this evidence would be if a hypothesis were true; posterior asks how plausible that hypothesis is after considering both the evidence and how plausible it was beforehand. Use odds for another view. Posterior odds equal prior odds times a likelihood ratio. The likelihood ratio compares how well the evidence is predicted under competing hypotheses, while prior odds encode base rates. This form makes evidence accumulation intuitive: independent pieces contribute multiplicative likelihood ratios. It also makes clear why strong evidence may fail to overcome an extremely tiny prior, as the rare-disease example will demonstrate.",
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
    note: "Disease may causally influence a symptom, so the arrow points from disease to symptom. Diagnosis reasons backward from observed symptom to hidden disease. The posterior P disease given symptom is not the likelihood P symptom given disease; Bayes' rule connects them using the disease prior and symptom prevalence. Suppose most people with a rare disease develop a cough. That high likelihood does not mean most coughing people have the rare disease, because common colds create many more coughs. The denominator includes every way the symptom can occur. Base rates are the quiet crowd in the room that dramatic evidence often tries to ignore. Probability also does not prove causation. A model may encode a causal hypothesis, but observational association can arise from confounding or selection. Keep three questions distinct: which direction does the mechanism run, which direction are we inferring, and what assumptions justify using this model? A diagnostic model should also be calibrated and validated on the population where it will be used. Disease prevalence can differ by age, location, or referral setting, changing the prior and therefore the posterior even if test sensitivity stays fixed. Copying a posterior from one population to another can be badly wrong. Bayes is sensitive to context because context belongs in the prior, not because the theorem is being difficult before coffee.",
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
    note: "To compute the evidence normalizer, partition the hypothesis space into mutually exclusive and collectively exhaustive cases H one through H n. Event E intersects each case. Because those slices do not overlap, their probabilities add without any subtraction. The total-probability formula is P of E equals the sum over i of P of E given H i times P of H i. Each term is one route by which E can happen. For medical evidence, routes might be disease present and disease absent. For weather, routes could be sun and rain. Imagine sorting every evidence case into labeled bins. Mutually exclusive means no case enters two bins; exhaustive means none escapes under the table. Add the mass in all bins and you have P of E. Bayes then divides one hypothesis-and-evidence bin by that complete total. The hypotheses in a partition need not be equally likely. Total probability weights each evidence likelihood by its hypothesis prior. A rare route may predict the evidence strongly yet contribute little total mass; a common route with moderate likelihood may dominate. This weighted addition is why denominators often surprise intuition. Human attention notices dramatic compatibility, while the normalizer quietly counts how many ordinary cases exist.",
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
    note: "The disease prior is one in ten thousand. The symptom occurs with probability point eight when disease is present, but also with probability point zero one when disease is absent. The likelihood ratio is large, yet the healthy population is enormous. We will compute the evidence probability, the posterior, and the decision interpretation one step at a time. The calculation is educational, not medical advice; real diagnosis requires validated tests, clinical context, and professional evaluation. Imagine one million people. About one hundred have the disease. Roughly eighty of those show the symptom. Among the other nine hundred ninety-nine thousand nine hundred, about nine thousand nine hundred ninety-nine also show it. So the symptom-positive group contains roughly ten thousand seventy-nine people, only eighty with disease. The frequency picture matches the algebra and makes the base-rate effect much harder to wave away. Reveal 1. The prior is point zero zero zero one. Symptom likelihood is point eight with disease and point zero one without disease. The likelihood ratio is eighty, but the prior odds are tiny. Choose 2. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal 2. Total probability gives P of symptom as point eight times point zero zero zero one plus point zero one times point nine nine nine nine, which equals point zero one zero zero seven nine. Choose 3. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal 3. The disease-and-symptom mass is point zero zero zero zero eight. Divide by point zero one zero zero seven nine to get about point zero zero seven nine four, or zero point seven nine four percent. Choose 4. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal 4. A low posterior can still justify evaluation when the cost of missing disease is severe and examination cost is modest. Probability informs a decision; utilities and follow-up tests finish the job.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Student participation · Bayes' rule",
    title: "Dry conditions make sun much more probable than rain",
    content: (
      <div className={styles.twoColumn}>
        <div className={styles.weatherPanel}>
          <SourceFragment file="/lesson-visuals/lesson11-weather-sun-rain-dry.svg" alt="Three weather outcomes: sun, rain, and dry" caption="Only the three outcomes used in this Bayes example: sun, rain, and dry." contain />
          <ProbabilityTable caption="Prior P(W)" headers={["W", "P"]} rows={[{ values: ["sun", "0.8"] }, { values: ["rain", "0.2"] }]} />
          <ProbabilityTable caption="Likelihood P(dry | W)" headers={["W", "P"]} rows={[{ values: ["sun", "0.9"] }, { values: ["rain", "0.3"] }]} />
        </div>
        <ProbabilityPractice ariaLabel="Choose a weather posterior step" eyebrow="Posterior distribution" items={weatherCases} />
      </div>
    ),
    note: "The weather prior assigns point eight to sun and point two to rain. Dry conditions are more likely under sun, point nine, than rain, point three. We will multiply each prior by its likelihood, add the routes to obtain P of dry, and normalize. The two posterior values must sum to one because sun and rain exhaust this simplified model. That final checksum verifies both numerator calculations and the shared denominator. We can also compare likelihood ratios. Dry is three times more likely under sun than rain because point nine divided by point three equals three. Prior odds favor sun four to one. Multiply to get posterior odds twelve to one, which normalizes to twelve thirteenths and one thirteenth, approximately point nine two three and point zero seven seven. Odds offer a second route to the same checked result. Reveal 1. P of dry is point nine times point eight plus point three times point two, totaling point seven eight. Choose 2. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal 2. The sun-and-dry mass is point seven two. Divide by point seven eight to obtain P of sun given dry, about point nine two three. Choose 3. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal 3. The rain-and-dry mass is point zero six. Divide by point seven eight to obtain about point zero seven seven. The two posteriors sum to one.",
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
    note: "Read the general Bayes formula as a before-and-after machine. The prior P of H describes plausibility before evidence. The likelihood P of e given H describes compatibility. Their product is unnormalized support for H. The denominator sums that support across every competing hypothesis. It is the overall prevalence of the evidence. Dividing by it produces the posterior P of H given e, a normalized distribution across hypotheses. Every hypothesis is judged with the same evidence denominator. A useful metaphor is an audition. Priors are the performers' starting reputations, likelihoods are how well each performance predicts what we heard, the evidence total is the applause distributed across all candidates, and the posterior is the updated ranking. The metaphor is imperfect, but at least nobody divides by the stage manager. When several evidence items are conditionally independent given H, their likelihoods can multiply, causing the posterior to move sharply. When they are correlated, multiplying them as if independent double-counts information. Two weather apps using the same satellite feed are not two independent witnesses. The Bayes formula is correct only with the likelihood model we supply, so dependence assumptions must be visible rather than tucked under the equation.",
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
    note: "Maximum likelihood chooses the hypothesis maximizing P of evidence given h. It asks which hypothesis best predicts what we observed and omits the prior. Maximum a posteriori, or MAP, maximizes likelihood times prior. The evidence denominator can be dropped from the argmax because it is identical for every candidate hypothesis. Keeping the prior is the defining difference. If priors are uniform, multiplying every likelihood by the same constant preserves the ranking, so MAP and ML agree. With unequal priors, a slightly lower likelihood can win under MAP because the hypothesis was much more plausible before the observation. Picture two detectives. ML judges only how well each suspect explains the clue. MAP also considers how plausible each suspect was before the clue. Neither should smuggle the common denominator into one candidate's score. Dropping P of E is legal for comparison; dropping P of h changes the estimator. Consider handwriting recognition. A rare character may fit the pixels slightly better, giving it higher likelihood, while a common character has a much larger language prior. MAP may select the common character; ML selects the pixel-best rare one. Which is preferable depends on whether the prior matches deployment. A stale prior can overpower genuine novelty, so incorporating prior knowledge creates power and responsibility in equal portions.",
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
    note: "Three dealers have priors point two, point four, and point four. The probability of purchasing product a one differs by dealer. To infer dealer two after seeing the purchase, compute dealer two's joint mass and divide by the total probability of that purchase across all dealers. We will expose numerator, normalizer, and posterior separately. This prevents a common error: normalizing by one convenient competitor instead of by every mutually exclusive way the evidence could occur. The three dealer terms illustrate a reusable denominator pattern. For each hypothesis, multiply prior by evidence likelihood. Store those unnormalized weights. Add all weights. Divide each by the sum. Computing the whole posterior distribution, not only dealer two, would yield point one two five, point five, and point three seven five. Their sum is one, providing the final audit. Reveal 1. Dealer two's numerator is likelihood point four times prior point four, giving joint mass point one six. Choose 2. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal 2. The evidence normalizer adds all dealer routes: point zero four plus point one six plus point one two equals point three two. Choose 3. Read the new prompt and identify the compatible rows or factors before revealing the result. Reveal 3. Normalize dealer two's point-one-six mass by point three two. The posterior is point five, so half the purchase-compatible probability mass belongs to dealer two.",
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
    note: "The closing audit has three stages. Represent: define variables and domains, then verify that a joint distribution is nonnegative and normalized. Infer: select or marginalize compatible rows, compute the evidence normalizer, and apply the correct product, conditional, or Bayes rule. Interpret: state the reference population and distinguish event from random variable, posterior from likelihood, association from cause, and MAP from maximum likelihood. A correct number with the wrong sentence is not a correct probabilistic answer; it is arithmetic wearing someone else's name tag. When you meet a new uncertainty problem, resist formula roulette. Draw the variables, identify observed and hidden quantities, write the target conditional, and list the mutually exclusive routes to the evidence. Then calculate and check bounds, normalization, and meaning. Probability becomes manageable when every symbol has a job and every denominator has an address. For the next lesson, bring one real case in which a prior changes the selected hypothesis. State the hypotheses, evidence, likelihood intuition, and why unequal base rates matter. Avoid examples where the prior is merely prejudice disguised as mathematics; priors need empirical or defensible grounding. A good probabilistic argument makes assumptions inspectable, updates them with evidence, and states what uncertainty remains after the calculation.",
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
