"use client";

import { useState, type CSSProperties } from "react";
import "../styles/meeting13.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l09-machine-learning-part-a";
const SOURCE_MEDIA_ROOT = `${SOURCE_ROOT}/media`;
const SOURCE_DECK_LABEL = "L09 Machine Learning · Part A";

function resolveMeeting13SourceReference(sourceSlide: number) {
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
  const sourcePages: Record<number, { title: string; points: string[]; visual?: "actions" | "animals" | "methods" | "symbolic" | "arch" | "boundary" }> = {
    1: { title: "Machine learning · Part A", points: ["CPSC 481 introduction", "CPSC 483 and CPSC 585 continue implementation study"] },
    2: { title: "What is learning?", points: ["acquiring knowledge, skills, values, or understanding", "training, education, development, or experience", "a learning curve tracks performance over time"] },
    3: { title: "Cognitive process of human learning", points: ["read", "observe", "touch", "do", "think"], visual: "actions" },
    4: { title: "Concept, meaning, and knowledge", points: ["a concept is a cognitive unit of meaning", "classes such as ball game and sport name knowledge units", "learned knowledge must be represented and applied"] },
    5: { title: "How are animal classes learned?", points: ["dog", "cat", "bird", "animal", "What if no one supplies the label?"], visual: "animals" },
    6: { title: "Possible learning methods", points: ["memorization", "instruction", "analogy", "induction", "deduction", "discovery", "practice"], visual: "methods" },
    7: { title: "What is machine learning?", points: ["Simon 1983: change that improves later performance", "reduce manual knowledge engineering", "recognition, forecasting, vehicles, data mining, and analytics"] },
    8: { title: "Generalization operators", points: ["replace a constant with a variable", "drop a conjunct", "add a disjunct", "replace a property with its parent class"], visual: "symbolic" },
    9: { title: "Learning the ball concept", points: ["Ball₁=(small, red, round)", "Ball₂=(large, blue, round)", "generalize size and color while retaining roundness"], visual: "symbolic" },
    10: { title: "Concept space", points: ["generalize upward to cover more instances", "specialize downward to exclude instances", "candidate descriptions form a structured search space"] },
    11: { title: "Questions for a learning system", points: ["target concept", "knowledge representation", "learning method", "examples and evaluation evidence"] },
    12: { title: "Winston's arch learner", points: ["goal: learn the arch concept", "representation: semantic network", "operators: generalization and specialization"], visual: "arch" },
    13: { title: "Training evidence", points: ["positive arches expand coverage", "negative near misses constrain coverage", "training requires informative examples"], visual: "arch" },
    14: { title: "Two positive arches", points: ["brick supports remain", "top changes from brick to pyramid", "generalize only the differing property"], visual: "arch" },
    15: { title: "Background hierarchy", points: ["brick isa polygon", "pyramid isa polygon", "top-part type generalizes to polygon"], visual: "arch" },
    16: { title: "Negative near misses", points: ["loose pieces lack support relations", "touching supports violate the arch constraint"], visual: "arch" },
    17: { title: "Minimal specialization", points: ["require support relations", "add must-not-touch between supports", "do not memorize the whole negative example"], visual: "arch" },
    18: { title: "Decision boundary", points: ["positive examples leave a broad plausible region", "negative examples carve away invalid regions", "unobserved cases remain uncertain"], visual: "boundary" },
    19: { title: "Lessons from Winston's learner", points: ["minimal generalization and specialization", "hill climbing without backtracking", "example order and data quality matter"] },
  };
  const page = sourcePages[slide] ?? { title: `Course source page ${slide}`, points: [caption] };
  const visualLabels = page.visual === "actions" || page.visual === "animals" || page.visual === "methods" || page.visual === "symbolic"
    ? page.points.slice(0, 5)
    : page.points.slice(0, 5).map((_, index) => String(index + 1));
  return (
    <article className={`m13-source-frame m13-source-rebuilt ${className}`.trim()} aria-label={alt}>
      <h3>{page.title}</h3>
      {page.visual && <div className={`m13-mini-visual ${page.visual}`} aria-hidden="true">
        {visualLabels.map((label, index) => <i key={`${label}-${index}`}><b>{index + 1}</b><em>{label}</em></i>)}
      </div>}
      <ul>{page.points.map(point => <li key={point}>{point}</li>)}</ul>
      <small>{caption}</small>
    </article>
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
    <div className="m13-source-pair">
      <SourceFrame {...left} />
      <SourceFrame {...right} />
    </div>
  );
}

function SourceMediaFigure({
  file,
  alt,
  caption,
  className = "",
}: {
  file: "image1.jpeg" | "image2.jpeg" | "image3.jpeg" | "image4.jpeg" | "image5.jpeg" | "image6.png";
  alt: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={`m13-source-media ${className}`.trim()}>
      <div><img alt={alt} src={`${SOURCE_MEDIA_ROOT}/${file}`} /></div>
      <figcaption><span>Exact course figure</span>{caption}</figcaption>
    </figure>
  );
}

function CoverConceptMap() {
  return (
    <div className="m13-cover-map" aria-label="Lesson path from examples to a learned concept">
      <div><b>Examples</b><span>positive and negative evidence</span></div>
      <i aria-hidden="true">→</i>
      <div><b>Operators</b><span>generalize and specialize</span></div>
      <i aria-hidden="true">→</i>
      <div><b>Concept</b><span>a reusable decision boundary</span></div>
    </div>
  );
}

const learningCurveModes = [
  { label: "Practice", level: 82, note: "Performance improves across varied trials: plausible evidence of transferable learning." },
  { label: "Memorize", level: 64, note: "The repeated item improves, but a new item may reveal that the system memorized instead of generalized." },
  { label: "No feedback", level: 35, note: "More experience alone does not guarantee improvement when errors never guide an update." },
];

function LearningCurveLab() {
  const [active, setActive] = useState(0);
  const mode = learningCurveModes[active];
  return (
    <div className="m13-learning-curve-lab">
      <nav aria-label="Learning curve conditions">
        {learningCurveModes.map((entry, index) => (
          <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>
        ))}
      </nav>
      <div className="m13-learning-curve" style={{ "--curve-level": `${mode.level}%` } as CSSProperties}>
        <i />
        <span>performance</span>
        <b>experience or time →</b>
        {[1, 2, 3, 4].map(point => <em key={point} style={{ left: `${16 + point * 16}%`, bottom: `${22 + (mode.level * point) / 5}%` }} />)}
      </div>
      <p><strong>{mode.label}:</strong> {mode.note}</p>
    </div>
  );
}

const processStages = [
  { label: "Input", title: "Attention selects experience", note: "Reading, observing, touching, and doing provide signals; not every signal enters working memory." },
  { label: "Process", title: "Working processes connect new and known", note: "Processing speed, working memory, logic, and sensory processing transform the selected input." },
  { label: "Store", title: "Long-term memory becomes a knowledge bank", note: "Learning changes what can be retrieved later, not just what is visible in the moment." },
  { label: "Output", title: "Performance makes learning observable", note: "An answer or action is evidence only when the task and measure are clearly specified." },
];

function CognitiveProcessExplorer() {
  const [active, setActive] = useState(0);
  const item = processStages[active];
  return (
    <div className="m13-process-explorer">
      <SourceMediaFigure file="image1.jpeg" alt="How We Learn model showing input, automatic processing, higher thinking, a knowledge bank, and output" caption="Input is processed and connected with known information before learned knowledge supports output." />
      <section>
        <nav aria-label="Human learning process stages">
          {processStages.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button"><span>{index + 1}</span>{entry.label}</button>)}
        </nav>
        <div className="m13-process-detail"><span>Trace stage {active + 1}</span><h3>{item.title}</h3><p>{item.note}</p></div>
      </section>
    </div>
  );
}

const conceptLevels = [
  { label: "Label", value: "ball", role: "A shared name points to a class, but the word alone does not explain membership." },
  { label: "Concept", value: "round object", role: "Properties and relations provide a reusable description of possible members." },
  { label: "Knowledge", value: "ball game → sport", role: "Connections place the concept inside a larger system of meaning." },
  { label: "Use", value: "recognize · reason · act", role: "A represented concept supports classification, inference, and action." },
];

function ConceptMeaningExplorer() {
  const [active, setActive] = useState(0);
  const item = conceptLevels[active];
  return (
    <div className="m13-concept-explorer">
      <nav aria-label="From label to concept use">{conceptLevels.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button"><span>{index + 1}</span><b>{entry.label}</b></button>)}</nav>
      <section><span>{item.label}</span><h3>{item.value}</h3><p>{item.role}</p><div aria-hidden="true"><i className="ball" /><i className="arrow">→</i><i className="network">●—●—●</i></div></section>
    </div>
  );
}

const animalClasses = [
  { label: "Dogs", file: "image2.jpeg" as const, alt: "A diverse group of dogs", clue: "Many sizes, colors, and shapes share enough recurring properties to support one dog class." },
  { label: "Cats", file: "image3.jpeg" as const, alt: "A group of kittens", clue: "Similarity within one image is useful, but varied examples are needed to avoid a kitten-only concept." },
  { label: "Birds", file: "image4.jpeg" as const, alt: "Several bird species including duck, pheasant, pigeon, goose, guinea fowl, and turkey", clue: "A broad bird concept must tolerate large variation while excluding non-birds." },
];

function AnimalConceptLab() {
  const [activeClass, setActiveClass] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const item = animalClasses[activeClass];
  return (
    <div className="m13-animal-lab">
      <section>
        <nav aria-label="Animal class source examples">{animalClasses.map((entry, index) => <button className={activeClass === index ? "active" : ""} key={entry.label} onClick={() => { setActiveClass(index); setAnswer(null); }} type="button">{entry.label}</button>)}</nav>
        <SourceMediaFigure file={item.file} alt={item.alt} caption={item.clue} />
      </section>
      <div>
        <AnimalInquiry />
        <div className="m13-animal-check"><strong>Quick check: what does one labeled photo justify?</strong><button className={answer === 0 ? "incorrect" : ""} onClick={() => setAnswer(0)} type="button">The complete class concept</button><button className={answer === 1 ? "correct" : ""} onClick={() => setAnswer(1)} type="button">One example plus a tentative hypothesis</button>{answer !== null && <p>{answer === 1 ? "Correct: more varied examples and feedback test whether the hypothesis generalizes." : "Not yet: one photo can be memorized and may hide important class variation."}</p>}</div>
      </div>
    </div>
  );
}

const animalQuestions = [
  {
    label: "Acquire",
    question: "How does a baby acquire concepts of dogs, cats, birds, and animals?",
    prompt: "Separate direct experience from words supplied by another person.",
  },
  {
    label: "Classify",
    question: "How does a baby know the class of an animal or object?",
    prompt: "Look for repeated properties, similarity, and feedback across examples.",
  },
  {
    label: "Meaning",
    question: "What does each animal class mean to a baby?",
    prompt: "A label alone is not the concept; meaning connects the label to properties and uses.",
  },
  {
    label: "No labels",
    question: "What if no one tells the baby the class?",
    prompt: "The learner may still cluster similar experiences, but the categories may differ from adult labels.",
  },
  {
    label: "Methods",
    question: "Which possible learning methods might the baby use?",
    prompt: "Compare memorization, similarity, induction, analogy, generalization, and specialization.",
  },
];

function AnimalInquiry() {
  const [active, setActive] = useState(0);
  const item = animalQuestions[active];
  return (
    <div className="m13-inquiry">
      <nav aria-label="Baby animal-class questions">
        {animalQuestions.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Think · pair · share</span>
        <h3>{item.question}</h3>
        <p>{item.prompt}</p>
      </section>
    </div>
  );
}

const learningMethods = [
  {
    name: "Memorization",
    source: "Very weak and low-level learning",
    example: "Recall one labeled dog image without deriving a reusable dog concept.",
  },
  {
    name: "Synthesis",
    source: "Synthesizing different types of information",
    example: "Combine shape, sound, motion, and context into one account of an animal.",
  },
  {
    name: "Generalize / specialize",
    source: "Conceptualization (understanding) and specialization",
    example: "Widen a concept to cover varied dogs; add constraints to reject wolves.",
  },
  {
    name: "Pattern / similarity",
    source: "Pattern recognition and categorization",
    example: "Group objects that share recurring visual or behavioral patterns.",
  },
  {
    name: "Induction / classification",
    source: "Induction and classification",
    example: "Infer a class rule from examples, then assign a class to a new case.",
  },
  {
    name: "Analogy",
    source: "Comparison between two things",
    example: "Use the known structure of one supported object to reason about another.",
  },
  {
    name: "Deduction",
    source: "Apply a general rule to a case",
    example: "CSUF is smoke-free; this location is on campus; therefore smoking is not allowed here.",
  },
];

function LearningMethodStudio() {
  const [active, setActive] = useState(0);
  const item = learningMethods[active];
  return (
    <div className="m13-method-studio">
      <nav aria-label="Learning methods">
        {learningMethods.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.name}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.name}
          </button>
        ))}
      </nav>
      <section>
        <span>Method {active + 1} of {learningMethods.length}</span>
        <h3>{item.name}</h3>
        <strong>{item.source}</strong>
        <p>{item.example}</p>
        <small>Instructor prompt: What information changed, and what reusable knowledge was produced?</small>
      </section>
    </div>
  );
}

const simonCases = [
  { label: "Same quiz", change: true, better: true, population: false, verdict: "Possible memorization", explanation: "The system changed and improved, but repeating identical questions does not establish performance on another task from the same population." },
  { label: "New quiz", change: true, better: true, population: true, verdict: "Evidence of learning", explanation: "The system changed after experience and improved on unseen but related cases drawn from the same population." },
  { label: "No update", change: false, better: true, population: true, verdict: "Not system learning", explanation: "A lucky score increase without a change in the system does not satisfy Simon's definition." },
];

function SimonDefinitionDemo() {
  const [active, setActive] = useState(1);
  const item = simonCases[active];
  return (
    <div className="m13-simon-demo">
      <nav aria-label="Test cases for Simon's machine-learning definition">{simonCases.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>)}</nav>
      <div className="m13-simon-criteria">
        {[['System changed', item.change], ['Performance improved', item.better], ['Related population', item.population]].map(([label, pass]) => <article className={pass ? "pass" : "fail"} key={String(label)}><span>{pass ? "✓" : "×"}</span><strong>{label}</strong></article>)}
      </div>
      <section><span>{item.verdict}</span><p>{item.explanation}</p></section>
    </div>
  );
}

const generalizationOperators = [
  {
    label: "Replacing constants with variables",
    before: "Obj(round, red, ball)",
    after: "Obj(round, X, ball)",
    effect: "Color is no longer fixed; every matching color is now covered.",
  },
  {
    label: "Drop a condition",
    before: "Obj(round) AND Obj(small) AND Obj(red)",
    after: "Obj(round) AND Obj(red)",
    effect: "Size is unconstrained, so the description covers more instances.",
  },
  {
    label: "Add a disjunct",
    before: "Obj(round) AND Obj(small) AND Obj(red)",
    after: "Obj(round) AND Obj(small) AND (Obj(red) OR Obj(blue))",
    effect: "The accepted color set expands from red to red or blue.",
  },
  {
    label: "Move to a parent",
    before: "Obj(red)",
    after: "Obj(primary_color)",
    effect: "Background ontology knowledge makes red one member of a broader class.",
  },
];

function GeneralizationOperatorLab() {
  const [active, setActive] = useState(0);
  const item = generalizationOperators[active];
  return (
    <div className="m13-operator-lab">
      <nav aria-label="Generalization operators">
        {generalizationOperators.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Before</span>
        <code>{item.before}</code>
        <i aria-hidden="true">↓ generalize</i>
        <span>After</span>
        <code>{item.after}</code>
        <p>{item.effect}</p>
      </section>
    </div>
  );
}

function BallGeneralizationLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    {
      label: "Example 1",
      detail: "Ball₁ = (small, red, round)",
      conclusion: "One example supports the overly specific candidate (small, red, round).",
    },
    {
      label: "Example 2",
      detail: "Ball₂ = (large, blue, round)",
      conclusion: "Size and color vary; round remains shared.",
    },
    {
      label: "Candidate concept",
      detail: "Ball = (Y, Z, round)",
      conclusion: "A ball is represented as a round object with variable size and color.",
    },
  ];
  const item = stages[stage];
  return (
    <div className="m13-ball-lab">
      <section>
        <span>Worked concept-learning example</span>
        <div className="m13-ball-visual" aria-label="Round ball examples">
          <i className={stage >= 0 ? "small red visible" : "small red"} />
          <i className={stage >= 1 ? "large blue visible" : "large blue"} />
          <i className={stage >= 2 ? "variable visible" : "variable"}>Y, Z</i>
        </div>
      </section>
      <div>
        <nav aria-label="Ball concept learning stages">
          {stages.map((entry, index) => (
            <button
              className={stage === index ? "active" : ""}
              key={entry.label}
              onClick={() => setStage(index)}
              type="button"
            >
              {entry.label}
            </button>
          ))}
        </nav>
        <h3>{item.detail}</h3>
        <p>{item.conclusion}</p>
        <SearchCallout label="Unification test" tone="green">
          A new description that unifies with (Y, Z, round) is covered by this candidate concept.
        </SearchCallout>
      </div>
    </div>
  );
}

const coverageCandidates = [
  {
    label: "Too specific",
    rule: "(small, red, round)",
    covers: "Ball₁ only",
    result: "Reject: it fails to cover the second positive example.",
  },
  {
    label: "Useful candidate",
    rule: "(Y, Z, round)",
    covers: "Ball₁ and Ball₂",
    result: "Retain provisionally: it covers both observed positives.",
  },
  {
    label: "Too general",
    rule: "(X, Y, Z)",
    covers: "Almost every three-property object",
    result: "Reject or specialize: it may cover many non-balls.",
  },
];

function CoverageLab() {
  const [active, setActive] = useState(1);
  const item = coverageCandidates[active];
  return (
    <div className="m13-coverage-lab">
      <div className="m13-concept-axis">
        <span>more specific</span>
        <i />
        <span>more general</span>
        {coverageCandidates.map((entry, index) => (
          <button
            aria-label={`Inspect ${entry.label} concept`}
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            style={{ left: `${12 + index * 38}%` }}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </div>
      <section>
        <span>{item.label}</span>
        <h3>{item.rule}</h3>
        <p><strong>Covers:</strong> {item.covers}</p>
        <p>{item.result}</p>
      </section>
    </div>
  );
}

const conceptSpaceViews = [
  { label: "Specific", focus: "specific", title: "Examples sit near the bottom", detail: "Descriptions such as obj(small, red, ball) cover few instances and preserve many constants." },
  { label: "Generalize", focus: "generalize", title: "Move upward by removing restrictions", detail: "Replacing constants with variables or moving to a parent class increases coverage." },
  { label: "Specialize", focus: "specialize", title: "Move downward by adding restrictions", detail: "A counterexample can force a return toward a narrower candidate that excludes it." },
  { label: "Boundary", focus: "boundary", title: "Stop at a useful candidate boundary", detail: "The goal is not the top or bottom of the space, but a description consistent with the available evidence." },
];

function ConceptSpaceExplorer() {
  const [active, setActive] = useState(1);
  const item = conceptSpaceViews[active];
  return (
    <div className={`m13-concept-space-explorer ${item.focus}`}>
      <SourceMediaFigure file="image6.png" alt="Concept space lattice from specific object descriptions to the fully general obj(X, Y, Z)" caption="Each connecting line is a legal move between neighboring candidate concepts." />
      <section>
        <nav aria-label="Explore directions in the concept space">{conceptSpaceViews.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>)}</nav>
        <div><span>Concept-space trace</span><h3>{item.title}</h3><p>{item.detail}</p><i aria-hidden="true">{item.focus === "specialize" ? "↓" : item.focus === "specific" ? "●" : "↑"}</i></div>
      </section>
    </div>
  );
}

const designCases = [
  { label: "Face", target: "identity or face/non-face", representation: "visual features and class labels", method: "induction from labeled images", evidence: "unseen people, lighting, and demographic groups" },
  { label: "Voice", target: "speaker, words, or intent", representation: "audio features over time", method: "pattern learning from recordings", evidence: "unseen voices, accents, noise, and devices" },
  { label: "Go", target: "a move-selection strategy", representation: "board state and action values", method: "experience, search, and feedback", evidence: "games against unseen opponents and strategies" },
  { label: "Credit", target: "repayment-risk estimate", representation: "applicant variables and score", method: "induction from historical outcomes", evidence: "future cohorts plus subgroup error checks" },
];

function LearningSystemDesignLab() {
  const [active, setActive] = useState(0);
  const item = designCases[active];
  return (
    <div className="m13-design-lab">
      <nav aria-label="Learning system cases">{designCases.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>)}</nav>
      <section>
        {[["Target", item.target], ["Representation", item.representation], ["Method", item.method], ["Evidence", item.evidence]].map(([label, value], index) => <article key={label}><span>{index + 1}</span><div><strong>{label}</strong><p>{value}</p></div></article>)}
      </section>
      <SearchCallout label="Pair prompt" tone="amber">Change one design choice. Which other choices must change with it, and why?</SearchCallout>
    </div>
  );
}

function SemanticArch() {
  return (
    <div className="m13-semantic-arch" aria-label="Simplified semantic-network representation of an arch">
      <strong>arch</strong>
      <span>has-part</span>
      <div>
        <article><b>support A</b><small>brick</small></article>
        <article><b>support B</b><small>brick</small></article>
        <article><b>top</b><small>polygon</small></article>
      </div>
      <p>A supports top · B supports top · A must-not-touch B</p>
    </div>
  );
}

function ArchSourceFigure({
  file,
  alt,
  caption,
  className = "",
}: {
  file: "image7.png" | "image8.png" | "image9.png" | "image10.png" | "image11.png" | "image12.png";
  alt: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure className={`m13-arch-source-figure ${className}`.trim()}>
      <div><img alt={alt} src={`${SOURCE_MEDIA_ROOT}/${file}`} /></div>
      <figcaption><span>Exact Winston course figure</span>{caption}</figcaption>
    </figure>
  );
}

const architectureViews = [
  {
    label: "Parts",
    heading: "Three physical parts become three part nodes",
    explanation: "Two upright bricks and one top piece are represented separately so the learner can reason about both type and relation.",
    trace: "arch -has-part-> support A, support B, top",
  },
  {
    label: "Types",
    heading: "Each part carries a type that can be generalized",
    explanation: "The first top is a brick and the second is a pyramid. Background knowledge later permits both to match the parent type polygon.",
    trace: "support A: brick | support B: brick | top: brick or pyramid",
  },
  {
    label: "Relations",
    heading: "Support relations distinguish an arch from a bag of parts",
    explanation: "The lower parts must each support the top. Winston learns relational structure, not a pixel template or a list of object names.",
    trace: "supports(support A, top) AND supports(support B, top)",
  },
];

function ArchArchitectureExplorer() {
  const [active, setActive] = useState(0);
  const item = architectureViews[active];
  return (
    <div className="m13-arch-architecture">
      <ArchSourceFigure
        file="image7.png"
        alt="Two valid arches paired with their semantic-network descriptions"
        caption="The physical examples and their network descriptions are kept together so every node and support relation can be traced."
      />
      <section>
        <nav aria-label="Inspect Winston semantic-network layers">
          {architectureViews.map((entry, index) => (
            <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>
          ))}
        </nav>
        <span>Representation layer {active + 1} of {architectureViews.length}</span>
        <h3>{item.heading}</h3>
        <p>{item.explanation}</p>
        <code>{item.trace}</code>
      </section>
    </div>
  );
}

const evidenceExamples = [
  { label: "Positive A", sign: "+", kind: "positive", observation: "Two separated brick supports hold a rectangular brick top.", operation: "Initialize a candidate that records three typed parts and two support relations." },
  { label: "Positive B", sign: "+", kind: "positive", observation: "The same support pattern holds, but the top is a pyramid.", operation: "Generalize only the varying top type after consulting the type hierarchy." },
  { label: "Near miss A", sign: "−", kind: "negative", observation: "The three pieces exist, but the lower pieces do not support the top.", operation: "Specialize by requiring both support relations." },
  { label: "Near miss B", sign: "−", kind: "negative", observation: "Both lower bricks support the top, but the supports touch each other.", operation: "Specialize with a must-not-touch relation between the supports." },
];

function ArchEvidenceExplorer() {
  const [active, setActive] = useState(0);
  const item = evidenceExamples[active];
  return (
    <div className="m13-arch-evidence-explorer">
      <ArchSourceFigure
        file="image8.png"
        alt="Two positive arch examples and two negative near-miss examples"
        caption="Top row: valid arches. Bottom row: near misses used to expose missing constraints."
      />
      <section>
        <nav aria-label="Inspect positive and negative arch evidence">
          {evidenceExamples.map((entry, index) => (
            <button className={`${active === index ? "active" : ""} ${entry.kind}`} key={entry.label} onClick={() => setActive(index)} type="button"><b>{entry.sign}</b>{entry.label}</button>
          ))}
        </nav>
        <span>{item.kind === "positive" ? "Generalization evidence" : "Specialization evidence"}</span>
        <h3>{item.observation}</h3>
        <p><strong>Minimal update:</strong> {item.operation}</p>
        <SearchCallout label="Predict before advancing" tone="cyan">Which node type or relation must change—and which parts of the current concept should remain untouched?</SearchCallout>
      </section>
    </div>
  );
}

const positiveGeneralizationStages = [
  { label: "1 · Compare", file: "image7.png" as const, heading: "Align corresponding parts and relations", detail: "Both examples have two brick supports, three total parts, and the same two support links.", rule: "shared: parts = 3; supports(A, top); supports(B, top)" },
  { label: "2 · Differ", file: "image7.png" as const, heading: "Isolate the one varying property", detail: "Only the top-part type changes: one example uses a brick and the other uses a pyramid.", rule: "top type: brick -> pyramid (variation observed)" },
  { label: "3 · Generalize", file: "image9.png" as const, heading: "Move one step up the supplied hierarchy", detail: "Because brick and pyramid are both polygons, replace the top's specific type with polygon while preserving every support relation.", rule: "top isa polygon; generalize no further than needed" },
];

function PositiveGeneralizationDemo() {
  const [active, setActive] = useState(0);
  const item = positiveGeneralizationStages[active];
  return (
    <div className="m13-arch-procedure">
      <ArchSourceFigure
        className={item.file === "image9.png" ? "hierarchy-figure" : ""}
        file={item.file}
        alt={item.file === "image7.png" ? "Two positive arches and their semantic networks" : "Brick and pyramid type hierarchy with generalized arch network"}
        caption={item.file === "image7.png" ? "Compare the two valid examples before changing the candidate." : "The background hierarchy licenses the minimal type generalization."}
      />
      <section>
        <nav aria-label="Positive-example generalization procedure">
          {positiveGeneralizationStages.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>)}
        </nav>
        <span>Procedure step {active + 1} of {positiveGeneralizationStages.length}</span>
        <h3>{item.heading}</h3>
        <p>{item.detail}</p>
        <code>{item.rule}</code>
      </section>
    </div>
  );
}

const hierarchyNodes = [
  { label: "brick", detail: "Observed as the top type in positive example A." },
  { label: "pyramid", detail: "Observed as the top type in positive example B." },
  { label: "polygon", detail: "Background parent that covers both observed top types without accepting every possible object." },
];

function HierarchyExplorer() {
  const [active, setActive] = useState(2);
  const item = hierarchyNodes[active];
  return (
    <div className="m13-hierarchy-explorer">
      <ArchSourceFigure file="image9.png" alt="Brick and pyramid are shown as children of polygon above the generalized semantic network" caption="The figure explicitly separates supplied background knowledge from relations observed in the examples." />
      <section>
        <span>Inspect a type</span>
        <div>{hierarchyNodes.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>)}</div>
        <h3>{item.label}</h3>
        <p>{item.detail}</p>
        <SearchCallout label="Inductive commitment" tone="amber">The hierarchy is supplied knowledge. Examples alone do not determine that brick and pyramid should meet at polygon.</SearchCallout>
      </section>
    </div>
  );
}

const specializationStages = [
  { label: "1 · Loose pieces", file: "image10.png" as const, heading: "Reject an arrangement with no support structure", observation: "Having two uprights and one crosspiece is insufficient when the parts are disconnected.", update: "require supports(A, top) AND supports(B, top)" },
  { label: "2 · Touching supports", file: "image11.png" as const, heading: "Reject the remaining relational near miss", observation: "Both lower bricks support the top, yet their contact collapses the opening that distinguishes the intended arch.", update: "add must-not-touch(A, B)" },
  { label: "3 · Final candidate", file: "image11.png" as const, heading: "Keep the positive structure and add only the needed constraint", observation: "The specialized network retains three parts, polygon top, and both support links while excluding touching supports.", update: "polygon top + 2 support links + must-not-touch(A, B)" },
];

function NegativeSpecializationDemo() {
  const [active, setActive] = useState(0);
  const item = specializationStages[active];
  return (
    <div className="m13-arch-procedure negative-demo">
      <ArchSourceFigure
        className={item.file === "image10.png" ? "near-miss-figure" : "specialization-figure"}
        file={item.file}
        alt={item.file === "image10.png" ? "Two negative arch near misses: loose parts and touching supports" : "Candidate arch network specialized with must-not-touch constraints"}
        caption={item.file === "image10.png" ? "Diagnose why each arrangement is not an arch." : "The course figure traces candidate, near miss, and minimally specialized network."}
      />
      <section>
        <nav aria-label="Negative-example specialization procedure">
          {specializationStages.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>)}
        </nav>
        <span>Procedure step {active + 1} of {specializationStages.length}</span>
        <h3>{item.heading}</h3>
        <p>{item.observation}</p>
        <code>{item.update}</code>
      </section>
    </div>
  );
}

const boundaryViews = [
  { label: "Positives only", heading: "Coverage expands, but the boundary is weakly constrained", detail: "Every plus must remain inside. The question marks show unobserved cases that the current concept may accept without evidence.", test: "Ask: what invalid arrangement could still match?" },
  { label: "+ Near misses", heading: "Informative negatives remove specific invalid regions", detail: "The learner specializes around observed negatives while retaining all positives. The result is better supported, not universally proven.", test: "Ask: which new negative would be most informative next?" },
];

function BoundaryExplorer() {
  const [active, setActive] = useState(0);
  const item = boundaryViews[active];
  return (
    <div className="m13-boundary-explorer">
      <ArchSourceFigure file="image12.png" alt="Concept boundary learned from positive examples only compared with a boundary learned from positive and negative examples" caption="The same course figure juxtaposes an underconstrained positive-only region with a boundary shaped by near misses." />
      <section>
        <nav aria-label="Compare Winston concept boundaries">
          {boundaryViews.map((entry, index) => <button className={active === index ? "active" : ""} key={entry.label} onClick={() => setActive(index)} type="button">{entry.label}</button>)}
        </nav>
        <span>Boundary view {active + 1} of {boundaryViews.length}</span>
        <h3>{item.heading}</h3>
        <p>{item.detail}</p>
        <SearchCallout label="Student check" tone="cyan">{item.test}</SearchCallout>
      </section>
    </div>
  );
}

const archLearningSteps = [
  {
    label: "Positive A",
    kind: "positive",
    evidence: "Two brick supports hold a brick top.",
    update: "Start with three parts and two support relations.",
    rule: "support A → top; support B → top",
  },
  {
    label: "Positive B",
    kind: "positive",
    evidence: "Two brick supports hold a pyramid top.",
    update: "Generalize brick and pyramid to their parent class: polygon.",
    rule: "top isa polygon",
  },
  {
    label: "Near miss A",
    kind: "negative",
    evidence: "The three pieces are separated; no support relation forms an arch.",
    update: "Require both lower parts to support the top.",
    rule: "support A → top AND support B → top",
  },
  {
    label: "Near miss B",
    kind: "negative",
    evidence: "The supports touch each other beneath the top.",
    update: "Specialize the network with a must-not-touch constraint.",
    rule: "must-not-touch(support A, support B)",
  },
];

function ArchLearningLab() {
  const [active, setActive] = useState(0);
  const item = archLearningSteps[active];
  return (
    <div className="m13-arch-lab">
      <nav aria-label="Winston arch-learning evidence">
        {archLearningSteps.map((entry, index) => (
          <button
            className={`${index === active ? "active" : ""} ${entry.kind}`}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{entry.kind === "positive" ? "+" : "−"}</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>{item.kind === "positive" ? "Generalize" : "Specialize"}</span>
        <h3>{item.evidence}</h3>
        <p>{item.update}</p>
        <code>{item.rule}</code>
      </section>
      <SemanticArch />
    </div>
  );
}

const dataAuditCases = [
  {
    label: "Order",
    diagnosis: "A hill-climbing learner without backtracking can follow a different path when examples arrive in another order.",
    evidence: "Shuffle the same training examples repeatedly and compare final concepts.",
  },
  {
    label: "Contradiction",
    diagnosis: "Identical descriptions with opposing labels cannot both be satisfied by a deterministic concept.",
    evidence: "Run duplicate and label-consistency checks before training.",
  },
  {
    label: "Coverage",
    diagnosis: "Missing subtypes leave the learner with no evidence about important parts of the domain.",
    evidence: "Build a class-by-property coverage table and inspect empty regions.",
  },
  {
    label: "Near misses",
    diagnosis: "Easy negatives may not reveal which boundary constraints are necessary.",
    evidence: "Add deliberately chosen near misses that differ from positives in one relevant relation.",
  },
];

function DataQualityAudit() {
  const [active, setActive] = useState(0);
  const item = dataAuditCases[active];
  return (
    <div className="m13-data-audit">
      <nav aria-label="Training-data quality cases">
        {dataAuditCases.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Diagnosis</span>
        <h3>{item.diagnosis}</h3>
        <SearchCallout label="Evidence to collect" tone="green">
          {item.evidence}
        </SearchCallout>
        <SearchCallout label="Minimal-change rule" tone="cyan">
          Generalize only enough to cover positive examples; specialize only enough to exclude negative examples.
        </SearchCallout>
      </section>
    </div>
  );
}

function ModernWorkflowCheck() {
  const [choice, setChoice] = useState<number | null>(null);
  const options = [
    "Tune the model on the test set until its score is highest.",
    "Split by record after features derived from the whole dataset are computed.",
    "Fit preprocessing on training data, tune on validation data, and use the test set once.",
  ];
  return (
    <div className="m13-modern-check">
      <section>
        <span>Textbook / modern supplement</span>
        <h3>Which workflow best protects the final evaluation?</h3>
        <p>Commit before revealing the explanation.</p>
      </section>
      <div>
        {options.map((option, index) => (
          <button
            className={choice === index ? (index === 2 ? "correct" : "incorrect") : ""}
            key={option}
            onClick={() => setChoice(index)}
            type="button"
          >
            <span>{String.fromCharCode(65 + index)}</span>
            {option}
          </button>
        ))}
        {choice !== null && (
          <p>
            <strong>{choice === 2 ? "Correct." : "Leakage risk."}</strong>{" "}
            Training chooses parameters, validation supports model choices, and the untouched test set estimates final generalization.
          </p>
        )}
      </div>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Machine learning · Part A",
    title: "How examples help a system form a concept",
    subtitle: "Start with examples, build a description, and test what it covers.",
    content: (
      <div className="m13-cover">
        <div className="m13-cover-visual">
          <span>CPSC 481 · Machine learning Part A</span>
          <h3>Examples change what a learner can cover.</h3>
          <CoverConceptMap />
          <small>Concept formation is a search through possible descriptions.</small>
        </div>
        <section>
          <span>Meeting 13 · 75 minutes</span>
          <h3>How can examples change a system&apos;s knowledge?</h3>
          <p>We will represent concepts, generalize from positive examples, specialize from near misses, and test what the learned boundary covers.</p>
        </section>
      </div>
    ),
    note: "Timing: 1 minute. Preserve the course-source title and the distinction that CPSC 483 and CPSC 585 provide more implementation detail. Frame this meeting around symbolic concept learning.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Learning objectives · Knowledge map",
    title: "Four things you will be able to do",
    content: (
      <div className="m13-objectives">
        <article><span>01</span><strong>Explain</strong><p>learning, concepts, meaning, knowledge, and the Simon definition of machine learning</p></article>
        <article><span>02</span><strong>Operate</strong><p>four generalization operators and specialization constraints</p></article>
        <article><span>03</span><strong>Model</strong><p>Winston&apos;s semantic-network learner from positive examples and near misses</p></article>
        <article><span>04</span><strong>Audit</strong><p>coverage, overgeneralization, example order, data quality, and leakage</p></article>
      </div>
    ),
    note: "Timing: 1 minute. Read the four performance verbs. Tell students that the final exit ticket will require one definition, one concept update, and one data-quality diagnosis.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Learning · Definition and evidence",
    title: "Learning means gaining knowledge or improving a skill",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={2}
          alt="What is learning definition and learning-curve questions"
          caption="The source definition connects learning to education, development, experience, and progress over time."
        />
        <section>
          <blockquote>Learning is acquiring new knowledge, skills, values, or understanding.</blockquote>
          <p>It can occur through training or education, personal development, or experience.</p>
          <LearningCurveLab />
          <SearchCallout label="Interpret the curve" tone="amber">
            A learning curve is evidence of changing performance, not by itself proof of understanding.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the complete definition. Ask what the x- and y-axes must measure before a learning curve supports a claim that performance improved.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Human learning · Cognitive process",
    title: "People learn by taking in, processing, and using experience",
    content: (
      <CognitiveProcessExplorer />
    ),
    note: "Timing: 3 minutes. Use the source speaker note: compare examples of human-brain learning with computer systems. Students map observe, act, and think to data, interaction, and computation without claiming that the processes are identical.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Learning outcomes · Concepts and knowledge",
    title: "A label names a category; a concept explains what belongs",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={4}
          alt="Important terms and questions related to learning"
          caption="The complete source page links concept, meaning, knowledge, representation, and application."
        />
        <section>
          <blockquote>A concept is a cognitive unit of meaning, an abstract idea or a mental symbol defined as a “unit of knowledge.”</blockquote>
          <ConceptMeaningExplorer />
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the definition and the examples Ball, Ball Game, and Sports. Ask how a representation makes a learned concept usable for recognition or reasoning.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Concept learning · Inquiry",
    title: "How does a child learn that different animals belong to different groups?",
    content: (
      <AnimalConceptLab />
    ),
    note: "Timing: 4 minutes. Move through all five source questions. Assign one question to each group, then compare the roles of labels, similarity, examples, and feedback.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Learning methods · Taxonomy",
    title: "Seven ways a learner can turn information into knowledge",
    content: (
      <div className="m13-source-practice">
        <SourceFrame
          slide={6}
          alt="Possible learning methods from memorization through deduction"
          caption="The complete historical list anchors the interactive comparison."
        />
        <LearningMethodStudio />
      </div>
    ),
    note: "Timing: 3 minutes. Visit all seven methods. Preserve the source note that analogy compares two things and use the CSUF smoke-free example for deduction. Contrast storing an instance with inducing a reusable rule.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Machine learning · Historical definition",
    title: "A system has learned when experience improves later performance",
    content: (
      <div className="m13-definition">
        <SourceFrame
          slide={7}
          alt="What is machine learning definition, motivation, and applications"
          caption="Simon’s 1983 definition connects performance change, task repetition, and the knowledge-engineering motivation."
        />
        <section>
          <span>Herbert Simon · 1983</span>
          <blockquote>
            “Any change in a system that allows it to perform better the second time on repetition of the same task or on another task drawn from the same population.”
          </blockquote>
          <SimonDefinitionDemo />
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Read the definition exactly. Have students underline change, better, task, and same population. Preserve the source phrase “implementation of learning with computer” as the opening historical framing.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Machine learning · Motivation and uses",
    title: "Learning reduces the need to write every rule by hand",
    content: (
      <div className="m13-motivation">
        <section>
          <span>Why machine learning?</span>
          <h3>It is costly to build expert systems with all necessary knowledge by hand.</h3>
          <p>Learning offers another path: derive useful patterns from examples or experience.</p>
        </section>
        <div>
          {[
            ["pattern recognition", "understanding through analysis"],
            ["speech recognition", "recognition"],
            ["forecasting", "prediction"],
            ["unmanned vehicles", "decision making"],
            ["data mining", "pattern discovery"],
            ["big-data analytics", "analysis at scale"],
          ].map(([name, purpose]) => (
            <article key={name}><strong>{name}</strong><span>{purpose}</span></article>
          ))}
        </div>
      </div>
    ),
    note: "Timing: 1 minute. Preserve every source application. Ask students to classify each as analysis, decision making, forecasting, or a combination.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Generalization · Operators I",
    title: "Generalization lets one description cover more examples",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={8}
          alt="Generalization operators in logical expressions"
          caption="The source page contains all four operators and the ontology note."
        />
        <section>
          <article className="m13-formula-card">
            <span>Replace a constant with a variable</span>
            <code>Obj(round, red, ball) → Obj(round, X, ball)</code>
            <small><b>Notation:</b> Obj lists an object’s properties; X is a variable that may match any color; → means “change the description to.”</small>
          </article>
          <article className="m13-formula-card">
            <span>Drop a conjunctive condition</span>
            <code>round AND small AND red → round AND red</code>
          </article>
          <SearchCallout label="Coverage direction" tone="cyan">
            Each operation admits every old match and at least one possible new match.
          </SearchCallout>
          <SearchCallout label="Everyday source example" tone="green">
            Volleyball, baseball, and football can be generalized to ball games or sports.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Work the first two operators. Students name one newly covered object after each update and explain why no previously covered object is lost.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Generalization · Operators II",
    title: "OR rules and parent categories also make a concept broader",
    content: <GeneralizationOperatorLab />,
    note: "Timing: 4 minutes. Use all four tabs. Spend most time on adding a disjunct and replacing a property with its parent. Preserve the source ontology note: the representation connects an object or concept to different symbols and types.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Concept learning · Worked example",
    title: "Two balls differ in size and color but are both round",
    content: (
      <div className="m13-source-practice">
        <SourceFrame
          slide={9}
          alt="Ball concept learning through generalization and version space"
          caption="The exact Ball1, Ball2, generalized form, concept-space, and coverage statements are visible."
        />
        <div className="m13-ball-column">
          <BallGeneralizationLab />
          <div className="m13-notation-strip"><b>Notation:</b> Ball₁ and Ball₂ are two examples; Y and Z are variables for values that differ; a fixed word such as <i>round</i> must still match.</div>
          <SearchCallout label="Version space learning" tone="cyan">
            The candidate descriptions consistent with the examples form a version space; learning searches that space for the right concept.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Advance the three stages only after predictions. Preserve Ball1=(small, red, round), Ball2=(large, blue, round), and Ball=(Y, Z, round). Ask what counterexample would show round is too restrictive.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Concept space · Coverage",
    title: "Concept learning searches from narrow descriptions to broad ones",
    content: (
      <div className="m13-coverage-layout">
        <section>
          <span>Source definitions</span>
          <h3>Concept space</h3>
          <p>A set of candidate concepts that can be created by the learning methods.</p>
          <h3>Coverage</h3>
          <p>If concept p is more general than q, the source writes p covers q, p ⇐ q; equivalently, q(x) is a logical consequence of p(x).</p>
          <div className="m13-notation-strip"><b>Notation:</b> p and q are candidate concepts; x is an instance; p ⇐ q means every example covered by q is also covered by p.</div>
          <SearchCallout label="Learning as search" tone="cyan">
            Operators move through the concept space; examples help select a useful boundary.
          </SearchCallout>
        </section>
        <CoverageLab />
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the source notation and definition. Use the lab to distinguish too specific, provisionally useful, and too general. Make students state the covered set rather than judging a formula by appearance.",
    sourceSlides: [9, 10],
  },
  {
    eyebrow: "Concept space · Visual model",
    title: "Move up to cover more examples; move down to exclude examples",
    content: <ConceptSpaceExplorer />,
    note: "Timing: 2 minutes. Trace the direction arrows on the exact diagram. Preserve the speaker-note clarification about ball as a shape category.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Learning-system design · Questions first",
    title: "Before learning, define the goal, representation, method, and evidence",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={11}
          alt="Developing learning systems questions from balls and arches to faces, voices, games, credit, and investment"
          caption="The complete problem list stays visible as a bridge from concepts to systems."
        />
        <LearningSystemDesignLab />
      </div>
    ),
    note: "Timing: 3 minutes. Preserve all source problems: ball, arch, face, voice, chess or Go, credit, and investment. Assign one system to each pair and require answers for all four design questions.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Winston 1975 · Program architecture",
    title: "Winston represented an arch as parts connected by relations",
    content: <ArchArchitectureExplorer />,
    note: "Timing: 4 minutes. Use all three representation-layer controls. First identify the three physical parts, then match each part to its type node, then trace both supports relations. Emphasize that Winston learns a relational semantic network rather than a visual pixel template. Name the learning goal and the generalization and specialization operators.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Training evidence · Positive and negative examples",
    title: "Positive examples broaden the concept; near misses add limits",
    content: <ArchEvidenceExplorer />,
    note: "Timing: 4 minutes. Select all four examples. Before each selection, ask students to classify it as positive or near miss and predict the smallest network change. Require the verbs cover, exclude, generalize, and specialize. The exact course figure keeps the two valid arches above the two near misses.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Winston demo · Positive examples",
    title: "When two valid arches differ, generalize only that difference",
    content: <PositiveGeneralizationDemo />,
    note: "Timing: 5 minutes. Advance through compare, differ, and generalize. Students must name every invariant before changing the top node. At step 3, reveal the exact hierarchy figure: brick isa polygon and pyramid isa polygon. Generalize only the top-part type; preserve the part count and both support relations.",
    sourceSlides: [14, 15],
  },
  {
    eyebrow: "Background knowledge · Generalization hierarchy",
    title: "The learner needs background knowledge to connect brick and pyramid",
    content: <HierarchyExplorer />,
    note: "Timing: 4 minutes. Select brick, pyramid, and polygon in order. Distinguish observed example types from the supplied parent relation. Ask whether top isa object would cover both positives and why it is less constrained than top isa polygon. A different hierarchy can yield a different candidate from the same examples.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Winston demo · Near misses",
    title: "Specialization adds only enough detail to reject a near miss",
    content: <NegativeSpecializationDemo />,
    note: "Timing: 5 minutes. Advance through loose pieces, touching supports, and final candidate. Students diagnose the first failed relation before seeing the update. For the second near miss, add must-not-touch between supports. Emphasize that minimal specialization keeps all existing positive matches and does not memorize the complete negative example.",
    sourceSlides: [16, 17],
  },
  {
    eyebrow: "Decision boundary · Overgeneralization",
    title: "Negative examples show which cases the concept must reject",
    content: <BoundaryExplorer />,
    note: "Timing: 4 minutes. Toggle between positives only and positives plus near misses while keeping the exact side-by-side boundary figure visible. Ask students to explain one question mark and propose the most informative next negative. Reinforce that the learned boundary is justified only relative to the examples, hierarchy, and representation supplied so far.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Guided practice · Build the arch concept",
    title: "Update the arch description one example at a time",
    content: <ArchLearningLab />,
    note: "Timing: 4 minutes. Visit all four evidence tabs. Students predict each update before selecting it. Require them to separate observed evidence, background hierarchy, generalization, and specialization.",
    sourceSlides: [12, 13, 14, 15, 16, 17, 18],
  },
  {
    eyebrow: "Lessons learned · Search and data quality",
    title: "Without backtracking, example order can change what is learned",
    content: (
      <div className="m13-source-practice">
        <SourceFrame
          slide={19}
          alt="Lessons learned and limitations of Winston's learning program"
          caption="Minimal generalization, minimal specialization, hill climbing, and sensitivity to data order and quality."
        />
        <DataQualityAudit />
      </div>
    ),
    note: "Timing: 3 minutes. Preserve every source lesson. Run at least two audit tabs. Define high-quality training data operationally: relevant, correctly labeled, representative, noncontradictory, and informative at the boundary.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Textbook / modern supplement · Evaluation workflow",
    title: "Keep final test evidence separate from model development",
    content: (
      <div className="m13-modern-workflow">
        <ol>
          <li><strong>Problem + metric</strong><span>Define the task, population, and what “better” means.</span></li>
          <li><strong>Baseline</strong><span>Measure a simple rule or majority-class predictor first.</span></li>
          <li><strong>Training set</strong><span>Fit parameters and any data-derived preprocessing.</span></li>
          <li><strong>Validation set</strong><span>Compare representations, settings, and model choices.</span></li>
          <li><strong>Test set</strong><span>Estimate final performance once after choices are fixed.</span></li>
          <li><strong>Error analysis</strong><span>Inspect failures, subgroups, shifts, and data-quality gaps.</span></li>
        </ol>
        <section>
          <SearchCallout label="Leakage" tone="amber">
            Leakage occurs when information unavailable at prediction time—or information from validation or test examples—influences training.
          </SearchCallout>
          <div className="m13-notation-strip"><b>Terms:</b> training fits the model; validation helps choose among models; testing estimates final performance after all choices are fixed.</div>
          <ModernWorkflowCheck />
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Explicitly label this page as a modern supplement. Walk the six-step workflow, then run the check. Connect the untouched test set to Simon's phrase “another task drawn from the same population.”",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative assessment · Readings",
    title: "Explain what was learned, how it changed, and why we should trust it",
    content: (
      <div className="m13-exit">
        <ol>
          <li><strong>Define</strong><span>Distinguish a class label from a concept and state Simon&apos;s performance-change criterion.</span></li>
          <li><strong>Generalize</strong><span>Apply one of the four source operators and name the newly covered instances.</span></li>
          <li><strong>Specialize</strong><span>Turn one arch near miss into a minimal semantic-network constraint.</span></li>
          <li><strong>Audit</strong><span>Name one data-order, data-quality, or leakage failure and evidence that would reveal it.</span></li>
        </ol>
        <section>
          <span>Continue the learning</span>
          <h3>Required and supplemental reading</h3>
          <ul>
            <li>Course source: L09 Machine Learning Part A, pages 1–19.</li>
            <li>George F. Luger, <em>Artificial Intelligence</em>, 6th ed., Chapters 10 and 12.</li>
            <li>Russell &amp; Norvig, <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed., Chapter 18.</li>
            <li>Patrick H. Winston, “Learning Structural Descriptions from Examples,” 1975.</li>
          </ul>
          <SearchCallout label="Exit ticket" tone="green">
            In four sentences: What was learned, how was it represented, which evidence changed it, and what could make the claim fail?
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Collect the four-sentence exit ticket. The planned timings across all 25 pages total 75 minutes. Reinforce that the historical pages supply the symbolic concept-learning foundation; the split, baseline, and leakage workflow is a labeled supplement.",
    sourceSlides: [],
  },
];

const lesson15KeyPoints = [
  [
    "Concept learning changes which instances a representation covers.",
    "Positive examples motivate generalization; near misses motivate specialization.",
    "Winston's arch learner demonstrates search through symbolic concept descriptions.",
  ],
  [
    "Explain learning, concepts, meaning, knowledge, and Simon's performance-based definition.",
    "Operate generalization and specialization rules on candidate concepts.",
    "Model Winston's semantic network and audit coverage, example order, data quality, and leakage.",
  ],
  [
    "Learning acquires knowledge, skills, values, or understanding through training, education, development, or experience.",
    "A learning curve must specify the performance measure on the vertical axis and experience or time on the horizontal axis.",
    "Improvement on repeated items may indicate memorization; transfer to varied items is stronger evidence of learning.",
  ],
  [
    "Attention selects experience as input; working processes connect it with prior knowledge.",
    "Long-term memory stores changes that can be retrieved later.",
    "Observable output is evidence of learning only when the task and performance measure are clearly defined.",
  ],
  [
    "A class label names a category, while a concept represents reusable conditions for membership.",
    "Meaning connects symbols such as ball, ball game, and sport to structured knowledge.",
    "A learned representation must support recognition, inference, or action rather than merely store a word.",
  ],
  [
    "Children encounter animals with varying sizes, colors, and shapes yet form stable categories.",
    "Concept acquisition combines recurring similarities, labels, examples, and corrective feedback.",
    "The central question is which evidence supports a reusable rule rather than memory of one instance.",
  ],
  [
    "Rote learning stores instances; induction derives a reusable general rule from examples.",
    "Deduction applies existing rules, while analogy transfers structure between related cases.",
    "Different learning methods transform information differently and support different kinds of claims.",
  ],
  [
    "Simon defines learning as a system change that improves performance on the same task or another task from the same population.",
    "A valid claim must specify the task, performance metric, experience, and comparison point.",
    "Improved performance—not merely more computation or more stored data—is the observable criterion.",
  ],
  [
    "Hand-coding all expert knowledge creates a knowledge-engineering bottleneck.",
    "Learning offers a way to derive useful regularities from examples or experience.",
    "Applications include recognition, forecasting, decision support, vehicles, data mining, and analytics.",
  ],
  [
    "Generalization increases coverage by replacing a constant with a variable or dropping a conjunct.",
    "Each operator removes a restriction, so every previously covered instance remains covered.",
    "The newly covered set must be checked because a broader concept may also admit false positives.",
  ],
  [
    "Adding a disjunct covers an additional alternative without discarding the existing alternative.",
    "Replacing a property with its parent class uses an ontology to increase coverage systematically.",
    "All four operators—variable replacement, condition removal, disjunction, and parent substitution—move toward more general concepts.",
  ],
  [
    "Ball1=(small, red, round) and Ball2=(large, blue, round) differ in size and color.",
    "Unification replaces the differing values with variables Y and Z while preserving the shared value round.",
    "The candidate Ball=(Y,Z,round) remains provisional until counterexamples test whether round is too restrictive or too broad.",
  ],
  [
    "A concept space contains the candidate descriptions reachable with the available representation and operators.",
    "A more general concept covers every instance covered by a more specific concept and possibly additional instances.",
    "Learning searches this ordered space for a boundary consistent with observed evidence.",
  ],
  [
    "Moving upward in the concept lattice removes restrictions and increases coverage.",
    "Moving downward adds restrictions and specializes the concept.",
    "The representation determines which neighboring moves are legal and therefore which concepts can be learned.",
  ],
  [
    "A learning system must define the target concept or performance task.",
    "It also needs a representation, update method, and evidence for evaluating success.",
    "Different targets—faces, voices, games, credit, or investments—require different features and evaluation criteria.",
  ],
  [
    "Winston represents an arch as typed part nodes connected by spatial support relations.",
    "The two supports and top piece remain distinct so the learner can reason about both type and relation.",
    "The learner searches semantic-network descriptions rather than memorizing a pixel template.",
  ],
  [
    "Positive arches expand the set that the candidate should cover.",
    "Near misses differ in a small but important way and reveal missing constraints.",
    "A useful update preserves all known positives while excluding the diagnosed near miss.",
  ],
  [
    "Two valid arches share three parts, two support relations, and brick supports.",
    "Their top pieces differ—brick versus pyramid—so only the top-part type should be generalized.",
    "The supplied hierarchy gives polygon as the least common parent, yielding a minimally generalized candidate.",
  ],
  [
    "The examples show brick and pyramid tops but do not themselves provide the parent relation polygon.",
    "The type hierarchy is background knowledge supplied to the learner.",
    "Changing the hierarchy can change the concept learned from exactly the same examples.",
  ],
  [
    "Disconnected pieces show that part types alone are insufficient; support relations are required.",
    "Touching supports motivate a must-not-touch constraint between the two uprights.",
    "Minimal specialization adds only the constraints needed to reject a near miss while retaining known positives.",
  ],
  [
    "Positive examples require covered regions but leave many unobserved cases ambiguous.",
    "Near misses carve away specific overgeneralized regions and sharpen the decision boundary.",
    "The learned boundary is justified only relative to the examples, hierarchy, and representation supplied so far.",
  ],
  [
    "Initialize the semantic network from the first positive example.",
    "Generalize the top type when a new positive differs only at that node.",
    "Specialize with support and must-not-touch constraints when near misses expose missing relations.",
  ],
  [
    "Winston's learner performs hill climbing through minimal generalizations and specializations without backtracking.",
    "Example order can therefore change the path and final candidate.",
    "Reliable learning requires relevant, correctly labeled, representative, noncontradictory, and boundary-informative data.",
  ],
  [
    "Training data fit model parameters and any data-derived preprocessing.",
    "Validation data compare representations and settings; the untouched test set estimates final performance once.",
    "Leakage occurs when unavailable future information or validation/test evidence influences training.",
  ],
  [
    "A concept-learning claim must state what was learned and how it is represented.",
    "Evidence changes the candidate through explicit generalization or specialization operators.",
    "The final claim must be audited for coverage errors, example-order effects, data quality, and leakage.",
  ],
] as const;

const lesson15InstructorNotes = [
  `Today we will study learning as a change in what a system can describe and recognize. The concept map shows the basic cycle. We begin with examples, build a candidate description, test what that description covers, and revise it when new evidence arrives. Our main historical example is Winston's arch learner. It does not learn from pixels. It represents an arch as parts and relations, then changes that symbolic description through generalization and specialization.

Generalization makes a description broader so that it can cover a new positive example. Specialization adds a necessary restriction so that a near miss is rejected. These two moves turn concept learning into a search through possible descriptions. As we work, keep asking three questions: What representation is available? Which examples have been observed? What background knowledge is supplied? The learned concept depends on all three. Later courses such as CPSC 483 and CPSC 585 examine implementation in greater depth; here our goal is to understand the reasoning clearly enough to trace and critique it.`,

  `These four verbs describe what you should be able to do, not merely what vocabulary you should remember. Explain means distinguish learning, a class label, a concept, meaning, and knowledge in plain language. Operate means apply generalization and specialization rules to an actual description and state which examples become covered or excluded. Model means trace Winston's semantic network as positive examples and near misses arrive. Audit means question whether the result is supported by the data.

The sequence matters. We first need a definition of learning and a representation of concepts. Then we can study operators that change a concept's coverage. After that, the arch example gives us a complete worked process. Finally, we examine example order, data quality, and leakage. The exit task will ask you to connect all four abilities: define what was learned, show one update, identify the evidence that caused it, and name a reason the resulting claim might fail.`,

  `Learning means acquiring knowledge, skills, values, or understanding through education, development, or experience. The small learning-curve activity asks us to be precise about evidence. A curve cannot demonstrate improvement until we know what each axis measures. The horizontal axis might be practice attempts, training examples, or time. The vertical axis must be a meaningful performance measure such as accuracy, task time, or error rate.

Now compare repeated and transfer performance. Becoming faster on the exact same item may reflect memorization. Improvement on different items drawn from the same kind of task is stronger evidence that something reusable was learned. A rising curve is therefore not automatically proof of deep understanding. We must ask what population of tasks was sampled, whether the measure captures the desired ability, and whether the improvement persists. This careful reading of evidence will return later when we separate training, validation, and test data.`,

  `The explorer organizes human learning into a simple flow: experience enters, cognitive processes operate on it, memory changes, and later behavior provides evidence of learning. Reading, observing, touching, doing, and thinking are different ways of obtaining or transforming experience. Attention determines what information is selected. Working processes connect new information with what is already known, and long-term memory stores changes that may be retrieved later.

We use this as a comparison, not as a claim that a computer learns exactly like a human brain. In a computer system, observations become data, internal processing becomes an algorithmic update, and later performance becomes measurable output. The useful parallel is functional: both require input, transformation, storage, and evidence in later behavior. The limitation is equally important: matching this flow does not establish human-like understanding or consciousness. When evaluating any learner, specify the experience it received, the internal representation it changed, and the later task on which improvement was observed.`,

  `A class label and a concept are related but different. A label such as “ball” is a name. A concept supplies reusable meaning: the properties or relations that determine when the label applies. The source definition calls a concept a cognitive unit of meaning, an abstract idea, or a mental symbol that functions as a unit of knowledge. For a computer, the concept must be represented in some usable form.

The examples Ball, Ball Game, and Sports illustrate levels of meaning. A physical ball may be an object. A ball game is an activity involving such objects and rules. Sport is a broader category that includes many activities. A useful representation connects these ideas so the system can recognize, infer, or act. Merely storing the word “ball” is not enough. Use the explorer to ask what each concept means, how it could be represented, and what operation the representation supports.`,

  `Imagine a child seeing dogs, cats, and birds that vary in size, color, and shape. The stable categories cannot come from memorizing one visual template. The page's five questions expose the learning problem. Which similarities matter? Who supplies the labels? What happens when no label is given? How does feedback correct a mistaken category? How can a rule learned from a few examples apply to a new animal?

Click through the animal examples and distinguish an instance from a category. One dog is an instance; dog is a concept that should cover many dogs. Similarity helps, but similarity alone is ambiguous because two animals can share color while belonging to different categories. Labels and corrective feedback help identify which features matter. The broader lesson is that examples do not speak for themselves. Concept learning depends on representation, prior categories, and the kind of feedback available.`,

  `This page compares seven learning methods. Rote learning stores an instance or answer. Instruction receives an explicit statement from a teacher. Analogy transfers a relationship from one case to a similar case. Induction builds a general rule from examples. Deduction applies an existing general rule to reach a particular conclusion. Discovery identifies structure without being directly told the answer. Practice improves performance through repeated execution and feedback.

Use the tabs to compare what each method receives and what it produces. Memorizing that one campus is smoke-free stores a fact. Applying a general smoke-free policy to a particular location is deduction. Observing many examples and proposing a broader pattern is induction. No single method is best for every purpose. The claim we can justify depends on how the information was transformed. This matters for Winston's learner because it uses examples, background hierarchy, and explicit operators rather than one undifferentiated idea of “learning.”`,

  `Herbert Simon's definition gives us an observable test for machine learning. A system learns when it changes in a way that lets it perform better the next time it repeats the same task or performs another task drawn from the same population. Four phrases matter. Change means something in the system must be updated. Better requires a performance measure. Task tells us what behavior is being evaluated. Same population limits the generalization claim to related cases.

More stored data or more computation does not by itself prove learning. We must compare performance before and after experience. The interactive criteria help test possible claims. If a classifier improves only on memorized training examples, it may not perform better on another task from the same population. If accuracy increases on an untouched sample of comparable cases, the claim is stronger. Simon's definition connects this historical foundation to modern evaluation: define the task, metric, experience, and comparison population before saying a system learned.`,

  `Traditional expert systems require people to write large amounts of domain knowledge by hand. That creates a knowledge-engineering bottleneck: experts may have difficulty stating every rule, conditions change, and the number of cases becomes too large to encode manually. Machine learning offers another path by deriving useful regularities from examples or experience.

The application cards show different uses. Pattern and speech recognition emphasize analysis and classification. Forecasting predicts later outcomes. Unmanned vehicles combine perception with sequential decision making. Data mining discovers patterns, while big-data analytics performs analysis at scale. Many real systems combine these roles. For each application, ask what the task is, what experience is available, and how “better” will be measured. Learning does not remove the need for human design; people still choose the target, representation, data, metric, and acceptable failure conditions.`,

  `Generalization makes a description less restrictive so it covers more instances. The first formula uses Obj as a predicate listing properties. In Obj round, red, ball, red is a fixed constant. Replacing red with X creates a variable that can match other colors. The arrow means we changed the candidate description. Every object covered before is still covered, and additional colors may now match.

The second operator drops a conjunct. AND means every listed condition must hold. Removing “small” changes round AND small AND red into round AND red. Large red round objects can now match. These operators always move toward greater coverage, but greater coverage is not automatically better. It may introduce false positives. After each update, name one newly covered object and test whether it truly belongs. Generalization is useful only when the broader description remains consistent with the concept we intend to learn.`,

  `The first two operators broadened a concept by replacing a constant or removing a condition. This page adds two more. A disjunction uses OR to add an alternative. A description can cover red balls OR blue balls without discarding either group. A hierarchy-based operator replaces a property with its parent category. If brick and pyramid are both polygons, changing a specific type to polygon covers both systematically.

The parent relation is background knowledge, often represented by an ontology or class hierarchy. It is not discovered automatically from the two words alone. Use each tab and compare the covered set before and after the operator. A variable may become extremely broad, a removed condition may admit many cases, a disjunction adds a named alternative, and a parent category follows a supplied hierarchy. All move upward in coverage, but they make different assumptions and create different possible errors.`,

  `We now generalize from two positive ball examples. Ball one is small, red, and round. Ball two is large, blue, and round. Compare the three positions. Size differs, so replace it with variable Y. Color differs, so replace it with variable Z. Roundness is shared, so keep the fixed value round. The candidate becomes Ball equals Y, Z, round.

Y and Z do not mean particular values; each is a placeholder that may match values allowed by the representation. The result covers both observed balls and other objects with any size and color that are round. This is a candidate, not a final truth. A counterexample such as a round plate may show that round alone is too broad. A non-round object that should still count as a ball would show it is too narrow. The set of candidates consistent with current evidence is called a version space, and further examples shrink or reshape it.`,

  `A concept space is the set of candidate concepts that our representation and operators can express. Coverage orders those candidates from narrow to broad. Here p and q are candidate concepts, and x is an instance. The source notation p left-double-arrow q means p is more general: every instance covered by q is also covered by p. In logical terms, if q of x is true, then p of x must also be true.

Use the coverage lab to judge candidates by the examples they include, not by how complex the formula looks. A candidate can be too specific and miss positives. It can be provisionally useful and cover current positives. It can be too general and include obvious negatives. Learning becomes a search through this ordered space. The search is limited by the language available: if the representation cannot express an important relation, no operator can discover the correct concept using that relation.`,

  `The diagram gives a spatial metaphor for concept search. Moving upward removes restrictions and increases coverage; this is generalization. Moving downward adds restrictions and reduces coverage; this is specialization. A boundary is a candidate region that includes known positives while excluding known negatives.

Click the modes and trace the arrows. An upward neighbor might replace red with color, or ball with shape. A downward neighbor might require small or add a relation. These moves are not arbitrary. The representation and hierarchy determine which neighboring descriptions exist. The speaker-note clarification matters: ball may be placed under a shape category in this teaching hierarchy, even though everyday language may organize it differently. A hierarchy is a modeling choice. Different background structures can lead a learner from the same examples to different generalizations, so the structure itself must be documented and evaluated.`,

  `Before building a learning system, answer four questions. First, what is the target? It might be recognizing a face, identifying a voice, learning an arch, choosing a chess move, predicting credit risk, or supporting investment decisions. Second, how will the target be represented? Possible representations include feature vectors, rules, trees, graphs, images, audio sequences, or semantic networks.

Third, what learning method will change that representation? Fourth, what evidence will establish success? Accuracy may suit some recognition tasks, but games need outcome measures and financial decisions need calibration, cost, fairness, and risk analysis. Use the design lab to select a problem and answer all four questions. The same algorithm can behave very differently under a different representation or metric. A learning claim is incomplete if it says only that a model was trained; we need the target, representation, update method, and evaluation evidence.`,

  `Winston's program represents an arch as a semantic network. A semantic network is a graph whose nodes represent objects or types and whose labeled links represent relationships. Here the physical arch has three parts: two supports and one top piece. Type links say what each part is, and support links record that each upright supports the top.

Use the three controls to move from physical parts to typed nodes and then to relations. The representation is relational, not a stored picture or pixel template. That distinction allows the learner to recognize arches that differ visually while preserving the important structure. The learning goal is to produce a network description that covers valid arches. Positive examples motivate generalization of node types. Near misses motivate specialization of missing or incorrect relations. Because the representational vocabulary determines what can be expressed, the learner can discover only distinctions available in its nodes, links, and hierarchy.`,

  `Training evidence plays two roles. A positive example is something the concept should cover. If a valid arch differs from the current description, the learner may need to generalize. A near miss is almost a valid example but differs in one important way. It helps reveal a missing constraint and motivates specialization.

Select all four examples. Before revealing the explanation, classify the case and predict the smallest update. The two valid arches share the structural idea even though their top types differ. Loose pieces show that the part types alone are insufficient because the support relations are missing. Touching supports show another relational constraint. A good update preserves every known positive while excluding the diagnosed near miss. We do not copy the entire negative example into a rule; we identify the smallest relevant difference. Near misses are especially informative because they isolate a boundary feature more clearly than an unrelated negative.`,

  `Compare the two positive arches carefully. Both have three parts, two supports, and two support relations. The support pieces remain bricks. Only the top changes: one example uses a brick and the other a pyramid. Minimal generalization means changing only the property that differs while preserving every shared invariant.

Advance through compare, differ, and generalize. The type hierarchy tells us that brick is a polygon and pyramid is also a polygon. Therefore the least common parent available is polygon, so the top type becomes polygon. The words “isa” mean “is a kind of.” This update covers both examples without discarding the part count or support relations. Replacing the top with the much broader type object would also cover both examples, but it would make a less constrained claim and admit more false positives. Minimal change helps avoid unnecessary overgeneralization.`,

  `The two examples show a brick top and a pyramid top, but they do not by themselves state that both are polygons. That connection comes from the supplied hierarchy. Click brick, pyramid, and then polygon to see how the learner moves upward. The relation brick isa polygon means brick belongs to the parent category polygon; pyramid isa polygon states the same for pyramid.

This background knowledge determines the available generalization. If the hierarchy used a different parent, the same examples could lead to a different candidate. The learner could move all the way to object, but object is broader than necessary and therefore less informative. The preferred step is the least general category that covers both observed types. This page demonstrates a general principle: examples constrain learning, but representation and prior knowledge shape what can be inferred from those examples. Always distinguish observed evidence from relationships supplied in advance.`,

  `Specialization makes the candidate more restrictive so that a near miss no longer matches. Begin with the loose-pieces example. It may contain the right types of parts, but the pieces do not have the support relationships required for an arch. The smallest repair is to require both supports to support the top. We do not memorize the exact positions or colors of the negative case.

The second near miss has support relations, but the uprights touch each other. If valid arches in this representation require separated supports, add a must-not-touch relation. Follow the stages and diagnose the failed relation before revealing the update. Minimal specialization means adding only the constraint necessary to reject the negative while retaining all known positives. An overly detailed rule might exclude valid arches that vary in irrelevant ways. This is the downward movement in concept space: coverage shrinks because additional conditions must now be satisfied.`,

  `Positive examples tell us which regions must be included, but they leave many unobserved cases undecided. A broad boundary can cover every known positive and still include many invalid objects. Near misses carve away specific regions by showing which almost-matching structures must be rejected.

Toggle between positives only and positives plus near misses. The question marks represent cases for which current evidence gives no decisive answer. They are not automatically positive or negative. Ask what next example would be most informative: ideally, it lies near the current boundary and tests one unresolved condition. The learned boundary is justified only relative to the representation, hierarchy, and evidence seen so far. It is not a universal truth about arches. This visual also connects symbolic concept learning to modern classification: both require evidence near the boundary to distinguish useful generalization from overgeneralization.`,

  `This guided practice combines the complete arch-learning sequence. Start from the first positive example and build a semantic network with typed parts and support relations. When the second positive changes only the top type, generalize that node through the hierarchy from brick or pyramid to polygon. Then process the loose-pieces near miss and specialize by requiring the two support relations. Finally, process the touching-supports near miss and add the must-not-touch constraint.

Before selecting each tab, predict the operator and the smallest network change. Keep four sources of information separate. Observed evidence is the positive or near-miss example. Background knowledge is the supplied type hierarchy. Generalization broadens a node type to cover a positive. Specialization adds a relation or condition to exclude a near miss. At every stage, verify both sides of the boundary: all known positives should remain covered, and the diagnosed negative should be rejected for the intended reason.`,

  `Winston's learner performs a form of hill climbing. It makes a local minimal generalization or specialization and moves forward without backtracking to reconsider every earlier choice. That makes the result sensitive to example order. An early unusual example can lead the learner into a region of concept space that later local updates cannot repair well.

Use the audit tabs to examine data quality. Relevant examples match the intended task. Correct labels prevent contradictory updates. Representative data include important variation from the population. Noncontradictory evidence avoids impossible requirements. Boundary-informative examples distinguish nearby candidate concepts. Quantity alone is not sufficient; many redundant examples may teach less than one carefully chosen near miss. The operational lesson is that training data are part of the algorithm's behavior. To trust the final candidate, document example order, labels, coverage gaps, and which boundary cases were actually tested.`,

  `This modern workflow separates model development from final evaluation. First define the problem, population, and metric. Next establish a baseline so improvement has a comparison point. Use the training set to fit parameters and any preprocessing learned from data. Use validation data to compare representations, hyperparameters, or model choices. Only after those choices are fixed should the untouched test set estimate final performance.

Training, validation, and test are roles, not merely file names. If test results influence another round of model selection, the test set has effectively become validation data. Leakage occurs when information unavailable at prediction time, or information from validation or test cases, influences training. Run the check and choose the proper source for scaling parameters: compute them from training data, then apply the fixed transformation elsewhere. The untouched test set connects to Simon's phrase “another task drawn from the same population,” because it provides evidence beyond the examples used to build and tune the system.`,

  `Use this final page to tell the whole story in four sentences. First define what the concept is and distinguish the label from its represented meaning. Second describe a generalization operator and name which new instances it covers. Third describe a specialization prompted by an arch near miss and state which invalid structure it excludes. Fourth audit the claim by naming a possible failure involving example order, data quality, boundary coverage, or leakage.

The reading list provides two layers. The historical source and Winston paper develop symbolic concept learning through structured descriptions. The textbooks connect these foundations to broader machine-learning theory and practice. As you review, keep asking: What was learned? How was it represented? Which evidence caused the update? What evidence would challenge the result? Those questions apply far beyond arches. They are a durable framework for explaining and evaluating any learning system rather than accepting the word “learned” as a complete claim.`,
] as const;

slides.forEach((slide, index) => {
  slide.keyPoints = lesson15KeyPoints[index];
  slide.note = lesson15InstructorNotes[index];
});

export function Meeting13Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Module 11 · Lesson 15"
      meetingTitle="Machine Learning Foundations and Concept Learning"
      notesMode="instructor"
      resolveSourceReference={resolveMeeting13SourceReference}
      slides={slides}
      sourceCollectionLabel={SOURCE_DECK_LABEL}
    />
  );
}
