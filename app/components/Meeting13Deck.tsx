"use client";

import { useState } from "react";
import "../styles/meeting13.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l09-machine-learning-part-a";
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
      <span>Course-source reconstruction · page {slide}</span>
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
    title: "Learning as concept formation and search",
    subtitle: "From human learning actions to Winston's arch-learning program.",
    content: (
      <div className="m13-cover">
        <SourceFrame
          slide={1}
          alt="CPSC 481 Machine Learning Part A title page"
          caption="CPSC 481 course context and links to advanced machine-learning study."
        />
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
    title: "Explain, operate, model, and audit",
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
    title: "Learning acquires knowledge, skills, values, or understanding",
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
          <div className="m13-learning-curve">
            <i />
            <span>performance</span>
            <b>experience or time →</b>
          </div>
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
    title: "Learning actions transform experience into knowledge",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={3}
          alt="Cognitive process of human learning with people reading, observing, touching, doing, and thinking"
          caption="The people and actions in the source image are instructional content, not decoration."
        />
        <section>
          <div className="m13-action-chain">
            {["read", "observe", "touch", "do", "think"].map((action, index) => (
              <span key={action}><b>{String(index + 1).padStart(2, "0")}</b>{action}</span>
            ))}
          </div>
          <h3>Physical action can strengthen what is learned.</h3>
          <p>For a computer system, identify the corresponding observations, interactions, stored representation, and performance change.</p>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Use the source speaker note: compare examples of human-brain learning with computer systems. Students map observe, act, and think to data, interaction, and computation without claiming that the processes are identical.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Learning outcomes · Concepts and knowledge",
    title: "Class concepts: a label names a class; a concept carries reusable meaning",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={4}
          alt="Important terms and questions related to learning"
          caption="The complete source page links concept, meaning, knowledge, representation, and application."
        />
        <section>
          <blockquote>A concept is a cognitive unit of meaning, an abstract idea or a mental symbol defined as a “unit of knowledge.”</blockquote>
          <div className="m13-concept-ladder">
            <article><span>Label</span><strong>ball</strong><p>a name</p></article>
            <article><span>Concept</span><strong>round object</strong><p>properties and relations</p></article>
            <article><span>Knowledge</span><strong>ball game → sport</strong><p>connected concepts</p></article>
            <article><span>Use</span><strong>recognize · reason · act</strong><p>application</p></article>
          </div>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the definition and the examples Ball, Ball Game, and Sports. Ask how a representation makes a learned concept usable for recognition or reasoning.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Concept learning · Inquiry",
    title: "A baby's animal classes expose the central learning questions",
    content: (
      <div className="m13-source-practice">
        <SourceFrame
          slide={5}
          alt="Baby animal-class learning page with dog, cat, bird, and animal images"
          caption="Four animal classes anchor five questions about how concepts are learned."
        />
        <AnimalInquiry />
      </div>
    ),
    note: "Timing: 4 minutes. Move through all five source questions. Assign one question to each group, then compare the roles of labels, similarity, examples, and feedback.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Learning methods · Taxonomy",
    title: "Different methods transform information in different ways",
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
    title: "Machine learning is a change that improves repeated or related performance",
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
          <div>
            <article><strong>change</strong><p>the system is different after experience</p></article>
            <article><strong>performance</strong><p>the improvement needs a task measure</p></article>
            <article><strong>population</strong><p>the claim extends beyond one memorized case</p></article>
          </div>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Read the definition exactly. Have students underline change, better, task, and same population. Preserve the source phrase “implementation of learning with computer” as the opening historical framing.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Machine learning · Motivation and uses",
    title: "Learning addresses the knowledge-engineering bottleneck",
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
    title: "Generalization increases the set of instances a description covers",
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
    title: "Disjunction and class hierarchies widen concepts systematically",
    content: <GeneralizationOperatorLab />,
    note: "Timing: 4 minutes. Use all four tabs. Spend most time on adding a disjunct and replacing a property with its parent. Preserve the source ontology note: the representation connects an object or concept to different symbols and types.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Concept learning · Worked example",
    title: "Two different balls preserve roundness while size and color vary",
    content: (
      <div className="m13-source-practice">
        <SourceFrame
          slide={9}
          alt="Ball concept learning through generalization and version space"
          caption="The exact Ball1, Ball2, generalized form, concept-space, and coverage statements are visible."
        />
        <div className="m13-ball-column">
          <BallGeneralizationLab />
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
    title: "Learning searches among candidate concepts ordered by coverage",
    content: (
      <div className="m13-coverage-layout">
        <section>
          <span>Source definitions</span>
          <h3>Concept space</h3>
          <p>A set of candidate concepts that can be created by the learning methods.</p>
          <h3>Coverage</h3>
          <p>If concept p is more general than q, the source writes p covers q, p ⇐ q; equivalently, q(x) is a logical consequence of p(x).</p>
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
    title: "Generalize upward; specialize downward",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={10}
          alt="Concept-space diagram with generalization and specialization directions"
          caption="Candidate expressions span a structured path from specific to general."
        />
        <section className="m13-concept-space-notes">
          <article><span>Too specific</span><strong>obj</strong><p>It names almost no reusable concept.</p></article>
          <article><span>Candidate boundary</span><strong>obj(Y, Z, ball)</strong><p>Variable size and color; ball shape retained.</p></article>
          <article><span>Too general</span><strong>obj(X, Y, Z)</strong><p>It may cover non-balls such as cubes or bricks.</p></article>
          <SearchCallout label="Source note" tone="amber">
            Here “ball” is treated as a shape category—contrasted with cube or brick—not merely as the property “round.”
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Trace the direction arrows on the exact diagram. Preserve the speaker-note clarification about ball as a shape category.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Learning-system design · Questions first",
    title: "A learning system needs a target, representation, method, and evidence",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={11}
          alt="Developing learning systems questions from balls and arches to faces, voices, games, credit, and investment"
          caption="The complete problem list stays visible as a bridge from concepts to systems."
        />
        <section className="m13-design-grid">
          <article><span>Target</span><p>What concept, strategy, pattern, or forecast should be learned?</p></article>
          <article><span>Representation</span><p>How will the learned knowledge be stored and used?</p></article>
          <article><span>Method</span><p>Which operators transform examples into a candidate?</p></article>
          <article><span>Evidence</span><p>What examples and performance tests justify the claim?</p></article>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve all source problems: ball, arch, face, voice, chess or Go, credit, and investment. Assign one system to each pair and require answers for all four design questions.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Winston 1975 · Program architecture",
    title: "Winston's program learned an arch concept in a semantic network",
    content: (
      <div className="m13-source-practice">
        <SourceFrame
          slide={12}
          alt="Winston learning program semantic-network page"
          caption="Learning goal, representation, and semantic-network diagram."
        />
        <div className="m13-winston-intro">
          <article><span>Learning goal</span><strong>arch concept</strong></article>
          <article><span>Representation</span><strong>semantic networks</strong></article>
          <article><span>Operators</span><strong>generalization + specialization</strong></article>
          <SemanticArch />
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Name Winston 1975, the learning goal, the representation, and both operators. Point to nodes and labeled relations in the exact source image before using the simplified network.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Training evidence · Positive and negative examples",
    title: "Positive examples expand coverage; near misses constrain it",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={13}
          alt="Positive arch examples and negative near-miss examples"
          caption="Positive and negative examples define the training evidence."
        />
        <section className="m13-evidence-roles">
          <article className="positive"><span>Positive examples · arches</span><h3>Cover all positives</h3><p>Use generalization to include patterns shared by valid arches.</p></article>
          <article className="negative"><span>Negative examples · near misses</span><h3>Cover no negatives</h3><p>Use specialization to exclude patterns found in non-arches.</p></article>
          <SearchCallout label="Training data" tone="cyan">
            The historical learner requires both positive and negative examples for training.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Students point to one positive and one near miss in the complete source image. Require the verbs cover, exclude, generalize, and specialize.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Winston demo · Positive examples",
    title: "Generalize only the property that differs across valid arches",
    content: (
      <SourcePair
        left={{
          slide: 14,
          alt: "Two positive arches and their semantic-network descriptions",
          caption: "Both arches have brick supports; their top parts differ.",
        }}
        right={{
          slide: 15,
          alt: "Generalization hierarchy and generalized semantic network for arches",
          caption: "Background knowledge makes brick and pyramid children of polygon.",
        }}
      />
    ),
    note: "Timing: 4 minutes. Before showing page 15, ask which node differs. Then reveal the hierarchy: brick isa polygon; pyramid isa polygon. The top-part type generalizes to polygon while support relations remain.",
    sourceSlides: [14, 15],
  },
  {
    eyebrow: "Background knowledge · Generalization hierarchy",
    title: "Examples alone do not say that brick and pyramid share the parent polygon",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={15}
          alt="Generalization hierarchy from brick and pyramid to polygon"
          caption="The complete source image links the hierarchy to the generalized arch semantic network."
        />
        <section className="m13-hierarchy">
          <strong>polygon</strong>
          <i aria-hidden="true" />
          <div><span>brick</span><span>pyramid</span></div>
          <p>The hierarchy is background knowledge. It determines which generalization is available to the learner.</p>
          <SearchCallout label="Inductive commitment" tone="amber">
            A different hierarchy could produce a different candidate concept from the same examples.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Distinguish training examples from background knowledge. Ask students whether “top is any object” would cover both positives and why it would be less constrained than “top is a polygon.”",
    sourceSlides: [15],
  },
  {
    eyebrow: "Winston demo · Near misses",
    title: "Specialization adds the smallest constraints needed to reject non-arches",
    content: (
      <SourcePair
        left={{
          slide: 16,
          alt: "Two negative near-miss arch examples"
          ,
          caption: "One arrangement lacks support relations; another has touching supports.",
        }}
        right={{
          slide: 17,
          alt: "Semantic-network specialization with must-not-touch constraints"
          ,
          caption: "The learned network is specialized so it cannot match the touching-support near miss.",
        }}
      />
    ),
    note: "Timing: 4 minutes. Use both exact images. For the loose pieces, require support relations. For the touching supports, add must-not-touch between the two supports. Emphasize minimal specialization rather than memorizing the entire negative example.",
    sourceSlides: [16, 17],
  },
  {
    eyebrow: "Decision boundary · Overgeneralization",
    title: "Negative examples carve away regions that positive examples alone leave ambiguous",
    content: (
      <div className="m13-explain-source">
        <SourceFrame
          slide={18}
          alt="Concept regions learned from positive examples alone and from positive plus negative examples"
          caption="The question marks in the left region become evidence-tested boundary decisions on the right."
        />
        <section className="m13-boundary-notes">
          <article><span>Positives only</span><h3>Large plausible region</h3><p>Many unobserved cases remain accepted because nothing has contradicted them.</p></article>
          <article><span>Positives + negatives</span><h3>Constrained boundary</h3><p>Near misses identify where the concept must become more specific.</p></article>
          <SearchCallout label="Not proof of perfection" tone="amber">
            The boundary is justified only relative to the examples and representation supplied so far.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Compare the two source regions. Ask students to explain one question mark on the left and how a nearby negative example changes the candidate boundary.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Guided practice · Build the arch concept",
    title: "Process each example as an operator on the current semantic network",
    content: <ArchLearningLab />,
    note: "Timing: 4 minutes. Visit all four evidence tabs. Students predict each update before selecting it. Require them to separate observed evidence, background hierarchy, generalization, and specialization.",
    sourceSlides: [12, 13, 14, 15, 16, 17, 18],
  },
  {
    eyebrow: "Lessons learned · Search and data quality",
    title: "A hill-climbing learner without backtracking is sensitive to its examples",
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
    title: "Separate model development from the evidence used for final evaluation",
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
          <ModernWorkflowCheck />
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Explicitly label this page as a modern supplement. Walk the six-step workflow, then run the check. Connect the untouched test set to Simon's phrase “another task drawn from the same population.”",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative assessment · Readings",
    title: "Define the concept, update it with evidence, then audit the claim",
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

export function Meeting13Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 7 · Meeting 13"
      meetingTitle="Machine Learning Foundations and Concept Learning"
      resolveSourceReference={resolveMeeting13SourceReference}
      slides={slides}
      sourceCollectionLabel={SOURCE_DECK_LABEL}
    />
  );
}
