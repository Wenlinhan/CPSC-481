"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l11-probability-bayes";

function SourceFrame({
  slide,
  alt,
  caption,
}: {
  slide: number;
  alt: string;
  caption: string;
}) {
  return (
    <SearchSourceImage
      alt={alt}
      caption={caption}
      file={`slide-renders/slide-${String(slide).padStart(2, "0")}.png`}
      sourceRoot={SOURCE_ROOT}
    />
  );
}

function SourcePair({
  left,
  right,
}: {
  left: { slide: number; alt: string; caption: string };
  right: { slide: number; alt: string; caption: string };
}) {
  return (
    <div className="source-definition-layout">
      <SourceFrame {...left} />
      <SourceFrame {...right} />
    </div>
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
    <div className="algorithm-selection">
      <nav aria-label={ariaLabel}>
        {items.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
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
      <section style={{ padding: "22px" }}>
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

const eventCases: PracticeItem[] = [
  {
    label: "Q1",
    question: "What is P(+x, +y)?",
    working: "A complete assignment identifies one row of the joint table.",
    answer: "P(+x, +y) = 0.2",
    explanation: "The event contains exactly the first row, so no summation is needed.",
  },
  {
    label: "Q2",
    question: "What is P(+x)?",
    working: "The value of Y is unspecified. Sum every row in which X is true.",
    answer: "P(+x) = 0.2 + 0.3 = 0.5",
    explanation: "This is a marginal probability: Y has been summed out.",
  },
  {
    label: "Q3",
    question: "What is P(−y OR +x)?",
    working: "Take the union once. Do not count the (+x, −y) row twice.",
    answer: "P(−y ∪ +x) = 0.6",
    explanation: "Rows (+x,+y), (+x,−y), and (−x,−y) have mass 0.2 + 0.3 + 0.1.",
  },
];

const normalizationCases: PracticeItem[] = [
  {
    label: "+x",
    question: "Given Y = −y, how much mass belongs to +x?",
    working: "Select the two rows with Y = −y. Their unnormalized masses are 0.3 and 0.1.",
    answer: "P(+x | −y) = 0.3 / 0.4 = 0.75",
    explanation: "The normalizer is the selected mass P(−y) = 0.3 + 0.1 = 0.4.",
  },
  {
    label: "−x",
    question: "Given Y = −y, how much mass belongs to −x?",
    working: "Use the same evidence normalizer, 0.4.",
    answer: "P(−x | −y) = 0.1 / 0.4 = 0.25",
    explanation: "The two conditional values sum to one, which checks the calculation.",
  },
];

const coinCases: PracticeItem[] = [
  {
    label: "Q1",
    question: "What is the sample space?",
    working: "List every length-three sequence of H or T.",
    answer: "S has eight outcomes",
    explanation: "S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}.",
  },
  {
    label: "Q2",
    question: "Which events matter?",
    working: "Let A mean more heads than tails and B mean the first toss is H.",
    answer: "P(A) = 4/8 and P(B) = 4/8",
    explanation: "A = {HHH,HHT,HTH,THH}; B = {HHH,HHT,HTH,HTT}.",
  },
  {
    label: "Q3",
    question: "Which random variables should we define?",
    working: "An event is a set of outcomes; a random variable maps each outcome to a value.",
    answer: "Use X = number of heads and I = 1[first toss is H]",
    explanation: "Teaching correction: A and B are events, not random variables. X has values 0–3; I is binary.",
  },
  {
    label: "Q4",
    question: "What is the distribution of X?",
    working: "Count sequences with zero, one, two, and three heads.",
    answer: "P(X=0,1,2,3) = (1,3,3,1)/8",
    explanation: "The binomial counts 1, 3, 3, 1 sum to eight equally likely sequences.",
  },
  {
    label: "Q5",
    question: "What is P(A | B)?",
    working: "Under B, only HHH, HHT, HTH, and HTT remain possible.",
    answer: "P(A | B) = (3/8)/(4/8) = 3/4",
    explanation: "Three of the four outcomes beginning with H have more heads than tails.",
  },
];

const trafficCases: PracticeItem[] = [
  {
    label: "Q1",
    question: "What is P(C = true)?",
    working: "Marginalize over traffic: add the two rows in which construction is true.",
    answer: "P(C) = 0.3 + 0.2 = 0.5",
    explanation: "This prior is the probability of construction before conditioning on bad traffic.",
  },
  {
    label: "Q2",
    question: "What is P(C = true | T = true)?",
    working: "Select the two rows with bad traffic and normalize their masses.",
    answer: "P(C | T) = 0.3 / (0.3 + 0.1) = 0.75",
    explanation: "Bad traffic raises the construction belief from 0.5 to 0.75 in this joint model.",
  },
  {
    label: "Q3",
    question: "What should orange barrels do to the belief?",
    working: "Barrels are evidence associated with construction, but the displayed joint table contains only C and T.",
    answer: "Increase it—if barrels are more likely when C is true",
    explanation: "A numeric update requires probabilities involving B. The arrows are a dependency sketch, not yet a fully specified Bayesian network.",
  },
];

const chainCases: PracticeItem[] = [
  {
    label: "2",
    question: "Factor two variables",
    working: "Start from the product rule and choose an ordering.",
    answer: "P(x₁,x₂) = P(x₁)P(x₂ | x₁)",
    explanation: "Reversing the ordering is also valid: P(x₂)P(x₁ | x₂).",
  },
  {
    label: "3",
    question: "Add a third variable",
    working: "Treat the first two variables as the accumulated context.",
    answer: "P(x₁,x₂,x₃) = P(x₁)P(x₂ | x₁)P(x₃ | x₁,x₂)",
    explanation: "Equivalently, the speaker-note step is P(x₁,x₂)P(x₃ | x₁,x₂).",
  },
  {
    label: "n",
    question: "State the general chain rule",
    working: "Each factor conditions on every variable that precedes it in the chosen ordering.",
    answer: "P(x₁,…,xₙ) = ∏ᵢ P(xᵢ | x₁,…,xᵢ₋₁)",
    explanation: "The identity follows by repeatedly applying the product rule; it does not assume independence.",
  },
];

const meningitisCases: PracticeItem[] = [
  {
    label: "1",
    question: "Record the prior and likelihoods",
    working: "P(+m)=0.0001, P(+s|+m)=0.8, and P(+s|−m)=0.01.",
    answer: "Rare disease, informative symptom",
    explanation: "The likelihood ratio is 80, but the prior odds are extremely small.",
  },
  {
    label: "2",
    question: "Compute the evidence probability",
    working: "Use the two-hypothesis partition {+m, −m}.",
    answer: "P(+s) = 0.8(0.0001) + 0.01(0.9999) = 0.010079",
    explanation: "Computation check: P(−m)=1−0.0001=0.9999.",
  },
  {
    label: "3",
    question: "Compute the posterior",
    working: "Divide the disease-and-symptom mass by the total symptom mass.",
    answer: "P(+m | +s) ≈ 0.00794 = 0.794%",
    explanation: "The symptom changes the belief sharply, yet the posterior remains below one percent because the prior is tiny.",
  },
  {
    label: "4",
    question: "Why still seek medical evaluation?",
    working: "A probability is not a decision by itself; actions also depend on consequences.",
    answer: "Low probability can still justify action",
    explanation: "A serious missed diagnosis can carry much higher cost than an examination. Decision thresholds depend on utilities and available tests.",
  },
];

const weatherCases: PracticeItem[] = [
  {
    label: "1",
    question: "Compute the normalizer P(dry)",
    working: "Sum the dry joint outcomes or use total probability over weather.",
    answer: "P(dry) = 0.9(0.8) + 0.3(0.2) = 0.78",
    explanation: "The two terms correspond to dry-and-sun and dry-and-rain.",
  },
  {
    label: "2",
    question: "Compute P(sun | dry)",
    working: "Apply Bayes' rule with likelihood 0.9 and prior 0.8.",
    answer: "P(sun | dry) = 0.72 / 0.78 ≈ 0.923",
    explanation: "Dry evidence shifts probability toward sun.",
  },
  {
    label: "3",
    question: "Compute P(rain | dry)",
    working: "Use likelihood 0.3, prior 0.2, and the same normalizer.",
    answer: "P(rain | dry) = 0.06 / 0.78 ≈ 0.077",
    explanation: "The two posterior values sum to one, providing a useful check.",
  },
];

const dealerCases: PracticeItem[] = [
  {
    label: "1",
    question: "Form the d2 numerator",
    working: "Multiply the likelihood of buying a1 at d2 by the prior probability of visiting d2.",
    answer: "P(a1 | d2)P(d2) = 0.4 × 0.4 = 0.16",
    explanation: "This is the joint mass P(a1,d2).",
  },
  {
    label: "2",
    question: "Compute the evidence normalizer",
    working: "Sum over the three mutually exclusive dealers.",
    answer: "P(a1) = 0.2(0.2) + 0.4(0.4) + 0.3(0.4) = 0.32",
    explanation: "This preserves the speaker-note identity P(a1)=ΣᵢP(a1,dᵢ).",
  },
  {
    label: "3",
    question: "Normalize the d2 mass",
    working: "Divide the d2 joint mass by the total probability of buying a1.",
    answer: "P(d2 | a1) = 0.16 / 0.32 = 0.5",
    explanation: "After observing the purchase, half of the compatible probability mass belongs to d2.",
  },
];

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Stochastic reasoning · Part A",
    title: "Reasoning under uncertainty starts with a probability model",
    subtitle: "Today: variables, distributions, conditional inference, Bayes' rule, and worked diagnosis.",
    content: (
      <SourcePair
        left={{
          slide: 1,
          alt: "CPSC 481 stochastic methods Part A title frame",
          caption: "Stochastic methods for reasoning in uncertain situations.",
        }}
        right={{
          slide: 2,
          alt: "Lecture overview listing uncertainty, probability, probabilistic reasoning, and Bayesian inference",
          caption: "The complete learning path for this meeting.",
        }}
      />
    ),
    note: "Timing: 2 minutes. Open with the source title and agenda. Ask students for one AI system that must act with incomplete information. Keep all four overview topics visible.",
    sourceSlides: [1, 2],
  },
  {
    eyebrow: "Uncertainty · Evidence, targets, and models",
    title: "Evidence is observed; target variables are hidden; a model connects them",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={3}
          alt="Uncertainty frame with observed variables, unobserved variables, and a model"
          caption="Examples connect sensors, symptoms, and weather evidence to hidden states."
        />
        <section>
          <article><span>Observed variables</span><p>Facts available now: sensor readings, symptoms, or current weather.</p></article>
          <article><span>Unobserved variables</span><p>Quantities the agent must infer: an object&apos;s location, a disease, or tomorrow&apos;s weather.</p></article>
          <article><span>Model</span><p>A structured account of how observed and hidden variables relate.</p></article>
          <SearchCallout label="Belief, not certainty" tone="cyan">
            Probabilistic reasoning represents degrees of belief and updates them when evidence changes.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Preserve the three-part source structure. Have students identify evidence, target, and model for a self-driving-car perception example.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Probability foundations · Variables and distributions",
    title: "Random variables name uncertain aspects; distributions assign probability to their values",
    content: (
      <SourcePair
        left={{
          slide: 4,
          alt: "Examples and domains of random variables including rain, temperature, drive time, and location",
          caption: "Discrete and continuous domains appear in the same modeling vocabulary.",
        }}
        right={{
          slide: 5,
          alt: "Temperature and weather probability distribution tables",
          caption: "Each table associates a probability with every value in a variable's domain.",
        }}
      />
    ),
    note: "Timing: 3 minutes. Preserve R, T, D, and L plus their domains. Distinguish the random variable (capital letter), a value (such as hot), and the distribution over values.",
    sourceSlides: [4, 5],
  },
  {
    eyebrow: "Probability foundations · Joint distributions",
    title: "A valid distribution is nonnegative, normalized, and defined over complete outcomes",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={6}
          alt="Probability distribution definition, notation, tables, and normalization constraints"
          caption="A distribution is a table; a probability is one number selected from it."
        />
        <section style={{ gridTemplateRows: "minmax(0, 1fr) auto" }}>
          <SourceFrame
            slide={7}
            alt="Joint distribution over temperature and weather with four complete outcomes"
            caption="A joint table assigns probability to every combined assignment."
          />
          <SearchCallout label="Domain-size correction" tone="amber">
            With domains of sizes d₁,…,dₙ, a full joint table has ∏ᵢdᵢ entries. The shortcut dⁿ applies only when all n domains have the same size d.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Enlarge both frames. Preserve shorthand notation, nonnegativity, sum-to-one, the joint table, and the practicality question. Explicitly teach the corrected product-of-domain-sizes rule.",
    sourceSlides: [6, 7],
  },
  {
    eyebrow: "Probabilistic models · Events and queries",
    title: "A joint model makes the probability of any event computable",
    content: (
      <SourcePair
        left={{
          slide: 8,
          alt: "Probabilistic model definition with variables, domains, joint distribution, and normalization",
          caption: "A probabilistic model is a normalized joint distribution over chosen variables.",
        }}
        right={{
          slide: 9,
          alt: "Events and sample-space questions over the temperature and weather joint table",
          caption: "Events are sets of complete outcomes; partial assignments select several rows.",
        }}
      />
    ),
    note: "Timing: 3 minutes. Compute hot-and-sun = 0.4, hot = 0.5, and hot-or-sun = 0.7 aloud. Clarify that a global outcome space underlies the model; an event is a subset of that space.",
    sourceSlides: [8, 9],
  },
  {
    eyebrow: "Formative check · Events",
    title: "Select the rows that satisfy the event, then add each row once",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={10}
          alt="Student participation joint table and three event-probability questions"
          caption="Use the complete X,Y joint table for all three calculations."
        />
        <section>
          <ProbabilityPractice
            ariaLabel="Choose an event-probability question"
            eyebrow="Commit before reveal"
            items={eventCases}
          />
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the speaker-note answers 0.2, 0.5, and 0.6. Require students to mark included rows before adding; diagnose double-counting in the union.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Marginalization · Summing out variables",
    title: "A marginal distribution collapses a joint table by addition",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={11}
          alt="Marginalization of temperature and weather from a joint table"
          caption="Rows that differ only in the eliminated variable are combined."
        />
        <section style={{ gridTemplateRows: "minmax(0, 1fr) auto" }}>
          <SourceFrame
            slide={12}
            alt="Student participation marginal-distribution tables for X and Y"
            caption="Complete both one-variable distributions before checking."
          />
          <SearchCallout label="Speaker-note answers" tone="green">
            P(+x)=0.5, P(−x)=0.5; P(+y)=0.6, P(−y)=0.4. Each marginal table must sum to one.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Demonstrate one collapsed row, then let pairs complete the X and Y marginals. Preserve all four note answers and use normalization as the error check.",
    sourceSlides: [11, 12],
  },
  {
    eyebrow: "Conditional probability · Definition",
    title: "Conditioning restricts the population; it does not imply time or causation",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={13}
          alt="Conditional probability definition and hot, sun, sickness, and cough examples"
          caption="P(A | B) asks about A under the condition or evidence B."
        />
        <section style={{ gridTemplateRows: "minmax(0, 1fr) auto" }}>
          <SourceFrame
            slide={14}
            alt="Joint-to-conditional probability relation with a joint table"
            caption="P(A | B) = P(A∩B) / P(B), provided P(B) is positive."
          />
          <SearchCallout label="Interpretation correction" tone="amber">
            “Given B” need not mean B happened earlier or caused A. P(sick | cough) and P(cough | sick) answer different questions.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the source wording and examples, then state the corrected set-based definition. Ask why reversing sick and cough changes the denominator.",
    sourceSlides: [13, 14],
  },
  {
    eyebrow: "Conditional distributions · From one value to a table",
    title: "Normalize every compatible row to obtain a conditional distribution",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={15}
          alt="Student participation questions for three conditional probabilities"
          caption="Each denominator is the total mass consistent with the stated evidence."
        />
        <section style={{ gridTemplateRows: "minmax(0, 1fr) auto" }}>
          <SourceFrame
            slide={16}
            alt="Joint distribution and two conditional weather distributions"
            caption="Fixing temperature produces a full distribution over weather."
          />
          <SearchCallout label="Speaker-note answers" tone="green">
            P(+x|+y)=1/3; P(−x|+y)=2/3; P(−y|+x)=0.6.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Students compute all three source questions. Then compare P(W|hot)=(0.8,0.2) with P(W|cold)=(0.4,0.6) and explain why each column-normalized table sums to one.",
    sourceSlides: [15, 16],
  },
  {
    eyebrow: "Normalization trick · Select, then normalize",
    title: "The selected mass is exactly the probability of the evidence",
    content: (
      <SourcePair
        left={{
          slide: 17,
          alt: "Normalization trick setup using the temperature and weather joint table",
          caption: "Begin with a joint table and an evidence assignment.",
        }}
        right={{
          slide: 18,
          alt: "Normalization trick selecting cold rows and normalizing them",
          caption: "Select matching rows; divide by their sum to make a conditional distribution.",
        }}
      />
    ),
    note: "Timing: 2 minutes. Preserve the build sequence across both frames. Derive the trick from P(W|T=c)=P(W,T=c)/P(T=c), where the selected-row sum is P(T=c).",
    sourceSlides: [17, 18],
  },
  {
    eyebrow: "Formative check · Normalization",
    title: "Selection preserves ratios; normalization makes them probabilities",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={19}
          alt="Student participation normalization problem for P of X given Y is false"
          caption="Select the two Y=−y rows before dividing."
        />
        <section>
          <ProbabilityPractice
            ariaLabel="Choose a normalization component"
            eyebrow="Conditional vector"
            items={normalizationCases}
          />
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the note answers 0.75 and 0.25. Ask students to predict which value is larger before calculating, then verify that the result sums to one.",
    sourceSlides: [19],
  },
  {
    eyebrow: "In-class practice · Three coin tosses",
    title: "Connect sample space, events, random variables, distributions, and conditioning",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={20}
          alt="Five-question exercise about three fair coin tosses"
          caption="Work through all five questions; the definitions must agree with one another."
        />
        <section>
          <ProbabilityPractice
            ariaLabel="Choose a coin-toss exercise question"
            eyebrow="Five-part probability lab"
            items={coinCases}
          />
        </section>
      </div>
    ),
    note: "Timing: 5 minutes. Let groups answer Q1–Q5 before revealing. Preserve every speaker-note answer. Explicitly correct Q3: A and B are events; X and the first-toss indicator are random variables.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Inference scenario · Competing explanations",
    title: "The same observation can support several hidden causes",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={21}
          alt="Traffic-congestion scenario with construction, accident, barrels, and flashing lights"
          caption="Bad traffic is evidence; construction and accident are competing explanations."
        />
        <section>
          <article><span>Observation</span><p>The vehicle is slowing because traffic has become congested.</p></article>
          <article><span>Hypotheses</span><p>Road construction, an accident, or another unmodeled cause.</p></article>
          <article><span>Additional evidence</span><p>Orange barrels support construction; flashing emergency lights support accident.</p></article>
          <SearchCallout label="Inference task" tone="cyan">
            Compare posterior beliefs after evidence—not just which story sounds plausible.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Preserve the full traffic narrative. Ask students to separate observations from hypotheses and to name one evidence item that discriminates between the two causes.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Traffic inference · Marginalize and condition",
    title: "Bad traffic raises the construction belief from 0.5 to 0.75",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={22}
          alt="Traffic dependency sketch, construction and traffic joint table, and three inference questions"
          caption="The full frame includes the causal sketch, joint table, and all three questions."
        />
        <section>
          <ProbabilityPractice
            ariaLabel="Choose a traffic-inference question"
            eyebrow="Evidence update"
            items={trafficCases}
          />
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Preserve note answers 0.5, 0.75, and yes. Make the qualification explicit: the C,T table supports the first two calculations; a numeric barrel update needs probabilities involving B. Do not present the arrow sketch as a complete Bayesian-network specification.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Product rule · Reconstructing a joint",
    title: "Multiply a prior by a conditional to recover joint probability",
    subtitle: "P(x,y) = P(y)P(x | y)",
    content: (
      <SourcePair
        left={{
          slide: 23,
          alt: "Product rule definition relating a conditional distribution to a joint distribution",
          caption: "The product rule is the conditional-probability definition rearranged.",
        }}
        right={{
          slide: 24,
          alt: "Product rule worked example for weather and wet or dry conditions",
          caption: "Each joint cell is a weather prior multiplied by the corresponding conditional value.",
        }}
      />
    ),
    note: "Timing: 3 minutes. Trace all four products: 0.8×0.1=0.08, 0.8×0.9=0.72, 0.2×0.7=0.14, and 0.2×0.3=0.06. Confirm that the joint table sums to one.",
    sourceSlides: [23, 24],
  },
  {
    eyebrow: "Chain rule · Incremental factorization",
    title: "Repeated product rules factor any joint distribution",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={25}
          alt="Chain rule equations for three and n random variables"
          caption="The complete chain-rule formulation and the question of why it is always true."
        />
        <section>
          <ProbabilityPractice
            ariaLabel="Choose a chain-rule depth"
            eyebrow="Build the factorization"
            items={chainCases}
          />
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve both displayed equations and the speaker-note intermediate P(x1,x2)P(x3|x1,x2). Stress that the chain rule is an identity; independence assumptions only simplify its factors later.",
    sourceSlides: [25],
  },
  {
    eyebrow: "Bayes' rule · Reverse a conditional",
    title: "Two factorizations of the same joint yield Bayes' rule",
    content: (
      <SourcePair
        left={{
          slide: 26,
          alt: "Bayes rule equation",
          caption: "Posterior = likelihood × prior ÷ evidence.",
        }}
        right={{
          slide: 27,
          alt: "Bayes rule derivation from two factorizations of a joint distribution",
          caption: "P(x|y) is constructed from the often easier reverse conditional P(y|x).",
        }}
      />
    ),
    note: "Timing: 3 minutes. Derive P(x|y)P(y)=P(y|x)P(x) before dividing. Preserve the source motivations: reverse a difficult conditional, support probabilistic systems, and recognize a foundational AI equation.",
    sourceSlides: [26, 27],
  },
  {
    eyebrow: "Bayes' rule · Diagnosis",
    title: "Posterior disease probability is not the probability that disease causes a symptom",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={28}
          alt="Bayes rule cause-and-effect interpretation for medical diagnosis"
          caption="The complete disease-and-symptom explanation and cause/effect diagram."
        />
        <section>
          <article><span>Posterior</span><p>P(disease | symptom): belief in the disease after observing the symptom.</p></article>
          <article><span>Likelihood</span><p>P(symptom | disease): probability of the symptom under the disease hypothesis.</p></article>
          <article><span>Prior</span><p>P(disease): belief before observing the current symptom.</p></article>
          <SearchCallout label="Meaning correction" tone="amber">
            Bayes&apos; rule reverses a conditional. It does not, by itself, prove that the disease caused the observed symptom.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the source medical-test examples from the notes: common cold, fever, runny nose, cough, and ear infection. Correct the posterior-versus-causal-likelihood wording visibly.",
    sourceSlides: [28],
  },
  {
    eyebrow: "Total probability · The evidence normalizer",
    title: "Partition the hypothesis space, then add disjoint joint masses",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={29}
          alt="Total probability theorem with a Venn diagram and partition derivation"
          caption="The complete partition diagram and derivation remain available for close inspection."
        />
        <section>
          <article><span>Partition</span><p>Hypotheses H₁,…,Hₙ are mutually exclusive and collectively exhaustive.</p></article>
          <article><span>Disjoint pieces</span><p>E = (E∩H₁) ∪ ··· ∪ (E∩Hₙ).</p></article>
          <article><span>Clean theorem</span><p><strong>P(E) = Σᵢ P(E|Hᵢ)P(Hᵢ)</strong></p></article>
          <SearchCallout label="Derivation correction" tone="amber">
            Because the partition pieces are disjoint, add their probabilities directly. No multiway-intersection subtraction term is needed.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Trace E across the three regions of the exact Venn diagram. Teach the corrected disjoint-union derivation and connect P(E) to the denominator in Bayes' rule.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Worked example · Rare-disease diagnosis",
    title: "A strong likelihood may still produce a small posterior when the prior is tiny",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={30}
          alt="Meningitis and stiff-neck Bayes rule example with givens, equation, and medical illustration"
          caption="The full diagnostic equation, numerical givens, and medical visual are preserved."
        />
        <section>
          <ProbabilityPractice
            ariaLabel="Choose a meningitis calculation step"
            eyebrow="Work the posterior"
            items={meningitisCases}
          />
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Advance only after students predict each term. Use P(-m)=0.9999, compute P(+m|+s)≈0.794%, and discuss why medical action also depends on consequences and follow-up tests.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Student participation · Bayes' rule",
    title: "Dry conditions make sun much more probable than rain",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={31}
          alt="Weather priors, wet and dry likelihoods, and question asking for weather given dry"
          caption="Use the same tables that generated the product-rule joint distribution."
        />
        <section>
          <ProbabilityPractice
            ariaLabel="Choose a weather posterior step"
            eyebrow="Posterior distribution"
            items={weatherCases}
          />
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Preserve the full speaker-note derivation: P(dry)=0.78, P(sun|dry)=0.923, and P(rain|dry)=0.077. Require the sum-to-one check.",
    sourceSlides: [31],
  },
  {
    eyebrow: "General Bayes theorem · Four quantities",
    title: "The posterior combines prior belief, likelihood, and evidence prevalence",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={32}
          alt="General Bayes theorem with prior, likelihood, marginal evidence, and posterior meanings"
          caption="The general formula includes total probability in the denominator."
        />
        <section>
          <article><span>Prior · P(H)</span><p>How plausible was the hypothesis before this evidence?</p></article>
          <article><span>Likelihood · P(e|H)</span><p>How compatible is the evidence with this hypothesis?</p></article>
          <article><span>Evidence · P(e)</span><p>How probable is the evidence across the full hypothesis partition?</p></article>
          <article><span>Posterior · P(H|e)</span><p>How plausible is the hypothesis after observing the evidence?</p></article>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve every physical meaning and the total-probability denominator. Explain the note definition of argmax in preparation for hypothesis selection.",
    sourceSlides: [32],
  },
  {
    eyebrow: "Hypothesis selection · MAP versus maximum likelihood",
    title: "Including the prior makes the rule MAP, not maximum likelihood",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={33}
          alt="Probabilistic inference frame labeled maximum likelihood with argmax likelihood times prior"
          caption="Inspect the complete source formulation before comparing the two estimators."
        />
        <section>
          <article><span>MAP</span><p><strong>arg maxₕ P(E|h)P(h)</strong> chooses the largest posterior because P(E) is common to every h.</p></article>
          <article><span>Maximum likelihood</span><p><strong>arg maxₕ P(E|h)</strong> compares likelihoods and omits the prior.</p></article>
          <article><span>When equal</span><p>With a uniform prior over hypotheses, MAP and maximum likelihood select the same h.</p></article>
          <SearchCallout label="Terminology correction" tone="amber">
            Dropping P(E) is valid for the argmax; retaining P(h) means the estimator is maximum a posteriori.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the source equation and class-selection question. Explicitly correct the title: argmax P(E|h)P(h) is MAP; maximum likelihood omits P(h).",
    sourceSlides: [33],
  },
  {
    eyebrow: "Worked example · Dealer inference",
    title: "The evidence normalizer combines all ways the observed purchase could occur",
    content: (
      <div className="source-definition-layout">
        <SourceFrame
          slide={34}
          alt="Bayes theorem dealer and car model example with complete calculation"
          caption="The full scenario, priors, likelihoods, denominator, and posterior are preserved."
        />
        <section>
          <ProbabilityPractice
            ariaLabel="Choose a dealer-example calculation step"
            eyebrow="Three-step solution"
            items={dealerCases}
          />
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Preserve the speaker-note identity P(a1)=P(a1,d1)+P(a1,d2)+P(a1,d3). Have students compute the numerator, denominator, and final posterior 0.5.",
    sourceSlides: [34],
  },
  {
    eyebrow: "Cumulative assessment · Probability foundations",
    title: "Represent uncertainty, compute an update, and defend the interpretation",
    content: (
      <div className="search-exit">
        <article>
          <span>1 · Represent</span>
          <h3>Build the model</h3>
          <p>Define variables and domains, list the relevant outcomes, and verify that the joint distribution is nonnegative and normalized.</p>
        </article>
        <article>
          <span>2 · Infer</span>
          <h3>Show the calculation</h3>
          <p>Select or marginalize rows, compute the evidence normalizer, apply the product, chain, or Bayes rule, and check the result.</p>
        </article>
        <article>
          <span>3 · Interpret</span>
          <h3>State what it means</h3>
          <p>Distinguish event from random variable, posterior from likelihood, association from cause, and MAP from maximum likelihood.</p>
        </article>
        <aside>
          <strong>Prepare for Meeting 10: independence, Naive Bayes, and Bayesian-network structure</strong>
          <p>
            Read George F. Luger, <em>Artificial Intelligence</em>, 6th ed.,
            the stochastic-methods probability sections, and Stuart Russell
            and Peter Norvig, <em>Artificial Intelligence: A Modern Approach</em>,
            3rd ed., Chapter 13. Bring one example in which a prior changes the
            selected hypothesis.
          </p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Collect one complete response. The submission must include a normalized model, a transparent calculation, and an interpretation that uses the corrected terminology from the meeting.",
    sourceSlides: [1, 2, 20, 22, 25, 27, 29, 31, 32, 33, 34],
  },
];

export function Meeting09Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 5 · Meeting 9"
      meetingTitle="Probability Foundations and Bayesian Inference"
      slides={slides}
    />
  );
}
