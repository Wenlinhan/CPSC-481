"use client";

import { useMemo, useState } from "react";
import "../styles/meeting26.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

type AudienceKey = "early" | "teen" | "adult";

const audienceProfiles = {
  early: {
    tab: "Age 5-7",
    title: "Family science-night pair",
    fields: [
      ["Age range", "5-7 with an accompanying adult"],
      ["Language", "English and Spanish; oral directions first"],
      ["Prior knowledge", "Uses autocomplete; no AI vocabulary expected"],
      ["Context", "Busy library table with shared materials"],
      ["Time", "7 minutes"],
      ["Access", "Large cards, high contrast, no reading required"],
    ],
    objective: "Given four picture cards, the learner predicts which card a pattern machine will choose next and gives one clue for the prediction.",
    entry: "Start with a turn-taking picture sequence, then name the idea after the learner predicts.",
  },
  teen: {
    tab: "Teen",
    title: "Library media workshop",
    fields: [
      ["Age range", "14-17"],
      ["Language", "Everyday English; define token and probability"],
      ["Prior knowledge", "Uses chatbots; may equate fluency with truth"],
      ["Context", "Small-group media-literacy workshop"],
      ["Time", "12 minutes"],
      ["Access", "Keyboard navigation and text alternative for diagram"],
    ],
    objective: "Given a prompt and three candidate continuations, the learner ranks likely next tokens and explains why likelihood is not truth.",
    entry: "Begin with a surprising fluent error, then trace one generation step.",
  },
  adult: {
    tab: "Adult / community",
    title: "Neighborhood information session",
    fields: [
      ["Age range", "Adults with varied schooling and technology use"],
      ["Language", "Plain English; interpreter-ready handout"],
      ["Prior knowledge", "No programming assumed; source checking is familiar"],
      ["Context", "Community meeting about an information chatbot"],
      ["Time", "8 minutes"],
      ["Access", "Captioned demo, print copy, verbal and written response"],
    ],
    objective: "Given a chatbot answer and two retrieved passages, the learner marks which claims are supported and names one claim that still needs checking.",
    entry: "Begin with a local-service question where the source matters more than technical vocabulary.",
  },
} as const;

function AudienceProfileLab() {
  const [active, setActive] = useState<AudienceKey>("early");
  const profile = audienceProfiles[active];

  return (
    <div className="m26-audience-lab">
      <nav aria-label="Audience profiles">
        {(Object.keys(audienceProfiles) as AudienceKey[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {audienceProfiles[key].tab}
          </button>
        ))}
      </nav>
      <div className="m26-audience-body">
        <section>
          <span>Defined audience</span>
          <h3>{profile.title}</h3>
          <div>
            {profile.fields.map(([label, value]) => (
              <article key={label}><small>{label}</small><strong>{value}</strong></article>
            ))}
          </div>
        </section>
        <aside>
          <span>Observable objective</span>
          <blockquote>{profile.objective}</blockquote>
          <span>Instructional entry point</span>
          <p>{profile.entry}</p>
        </aside>
      </div>
    </div>
  );
}

const objectiveCases = {
  vague: {
    label: "Vague intention",
    text: "Learners will understand how retrieval-augmented generation works.",
    test: "No visible performance, condition, or success criterion.",
    parts: [["Condition", "missing"], ["Action", "understand"], ["Evidence", "missing"]],
    verdict: "You cannot tell whether the explanation worked.",
  },
  observable: {
    label: "Observable objective",
    text: "Given one answer and three retrieved passages, learners will underline two supported claims and flag one unsupported claim, with all three judgments matching the passages.",
    test: "A new item can reveal whether the learner transfers the idea.",
    parts: [["Condition", "answer + passages"], ["Action", "underline and flag"], ["Evidence", "3 correct judgments"]],
    verdict: "The assessment can now be designed before the explanation.",
  },
} as const;

function ObjectiveLab() {
  const [mode, setMode] = useState<keyof typeof objectiveCases>("vague");
  const item = objectiveCases[mode];

  return (
    <div className="m26-objective-lab">
      <nav>
        {(Object.keys(objectiveCases) as (keyof typeof objectiveCases)[]).map(key => (
          <button
            aria-pressed={mode === key}
            className={mode === key ? "active" : ""}
            key={key}
            onClick={() => setMode(key)}
            type="button"
          >
            {objectiveCases[key].label}
          </button>
        ))}
      </nav>
      <blockquote>{item.text}</blockquote>
      <div>
        {item.parts.map(([label, value]) => (
          <article key={label}><span>{label}</span><strong>{value}</strong></article>
        ))}
      </div>
      <footer>
        <strong>{mode === "observable" ? "Measurable" : "Not measurable yet"}</strong>
        <p>{item.test} {item.verdict}</p>
      </footer>
    </div>
  );
}

const translationLayers = {
  technical: {
    label: "1 / Technical account",
    heading: "State the mechanism precisely",
    text: "A language model maps a token context to logits, applies a normalization such as softmax, selects a next token under a decoding rule, appends it, and repeats.",
    keep: "Context conditions a distribution over token candidates.",
    avoid: "Do not begin by deleting the mechanism.",
  },
  process: {
    label: "2 / Process account",
    heading: "Replace terms, not causal links",
    text: "The system looks at the pieces already present, scores possible next pieces from learned patterns, chooses one according to a rule, adds it, and repeats.",
    keep: "Look -> score -> choose -> append -> repeat.",
    avoid: "Do not replace the process with 'the AI thinks.'",
  },
  example: {
    label: "3 / Concrete instance",
    heading: "Let the audience predict",
    text: "After 'Please close the front ___,' door may receive a higher score than cloud because similar word patterns appeared in training.",
    keep: "Several continuations remain possible.",
    avoid: "A plausible token is not guaranteed to be true.",
  },
  boundary: {
    label: "4 / Boundary",
    heading: "Name what the account does not imply",
    text: "This describes one generation step. It does not show that the model knows the room, intends to help, or has verified a real front door.",
    keep: "Generation evidence is not evidence of intention or truth.",
    avoid: "Do not leave the memorable metaphor unqualified.",
  },
} as const;

function TranslationLayerLab() {
  const [active, setActive] = useState<keyof typeof translationLayers>("technical");
  const item = translationLayers[active];

  return (
    <div className="m26-layer-lab">
      <nav aria-label="Translation layers">
        {(Object.keys(translationLayers) as (keyof typeof translationLayers)[]).map(key => (
          <button
            aria-current={active === key ? "step" : undefined}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            <span>{translationLayers[key].label.split(" / ")[0]}</span>
            <strong>{translationLayers[key].label.split(" / ")[1]}</strong>
          </button>
        ))}
      </nav>
      <section>
        <span>{item.label}</span>
        <h3>{item.heading}</h3>
        <p>{item.text}</p>
        <div>
          <article><small>Preserve</small><strong>{item.keep}</strong></article>
          <article><small>Guard against</small><strong>{item.avoid}</strong></article>
        </div>
      </section>
    </div>
  );
}

const analogyCases = {
  autocomplete: {
    label: "Autocomplete",
    source: "A familiar interface proposes a continuation from what has already been typed.",
    mappings: [
      ["typed text", "context tokens"],
      ["candidate suggestions", "possible next tokens"],
      ["rank order", "relative model scores"],
      ["choose and continue", "decode, append, repeat"],
    ],
    break: "A chat model may generate many tokens and use a much larger learned representation; the analogy does not establish understanding or factual verification.",
  },
  recipe: {
    label: "Recipe",
    source: "A recipe gives ordered instructions that a cook follows.",
    mappings: [
      ["ingredients", "inputs"],
      ["steps", "explicit procedure"],
      ["dish", "output"],
      ["taste check", "evaluation"],
    ],
    break: "Useful for a fixed algorithm, but misleading for learned model parameters: training is not a programmer writing every decision step.",
  },
  librarian: {
    label: "Librarian",
    source: "A librarian locates relevant sources before answering a question.",
    mappings: [
      ["question", "retrieval query"],
      ["catalog search", "retriever"],
      ["selected sources", "context passages"],
      ["response", "generated answer"],
    ],
    break: "A retriever matches signals, not professional judgment; a generated citation can still mismatch its source.",
  },
} as const;

function AnalogyMapLab() {
  const [active, setActive] = useState<keyof typeof analogyCases>("autocomplete");
  const item = analogyCases[active];

  return (
    <div className="m26-analogy-lab">
      <nav>
        {(Object.keys(analogyCases) as (keyof typeof analogyCases)[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {analogyCases[key].label}
          </button>
        ))}
      </nav>
      <div>
        <section>
          <span>Source situation</span>
          <p>{item.source}</p>
          <div className="m26-map-grid">
            {item.mappings.map(([familiar, technical]) => (
              <article key={familiar}>
                <strong>{familiar}</strong><i aria-hidden="true">maps to</i><b>{technical}</b>
              </article>
            ))}
          </div>
        </section>
        <aside>
          <span>Explicit break point</span>
          <p>{item.break}</p>
          <strong>An analogy is a partial structure-preserving map, not an identity.</strong>
        </aside>
      </div>
    </div>
  );
}

const nextTokenCandidates = [
  { token: "door", score: 62, note: "Fits common local syntax and meaning patterns." },
  { token: "book", score: 23, note: "Possible in other contexts, weaker after this phrase." },
  { token: "cloud", score: 10, note: "Grammatical noun, but locally unlikely." },
  { token: ".", score: 5, note: "Could terminate, though the phrase feels incomplete." },
] as const;

function NextTokenDemo() {
  const [selected, setSelected] = useState(0);
  const item = nextTokenCandidates[selected];

  return (
    <div className="m26-token-demo">
      <section>
        <span>Context already generated</span>
        <blockquote>Please close the front <mark>___</mark></blockquote>
        <div className="m26-token-flow" aria-label="One next-token generation step">
          {["context pieces", "model scores", "probabilities", "selection", "append + repeat"].map((label, index) => (
            <article key={label}><span>{index + 1}</span><strong>{label}</strong></article>
          ))}
        </div>
      </section>
      <aside>
        <span>Constructed candidate distribution</span>
        {nextTokenCandidates.map((candidate, index) => (
          <button
            aria-pressed={selected === index}
            key={candidate.token}
            onClick={() => setSelected(index)}
            type="button"
          >
            <strong>{candidate.token}</strong>
            <i><b style={{ width: `${candidate.score}%` }} /></i>
            <span>{candidate.score}%</span>
          </button>
        ))}
        <p><strong>{item.token}:</strong> {item.note}</p>
      </aside>
    </div>
  );
}

const visualCases = {
  sequence: {
    label: "Next-token prediction",
    best: "Movable word or picture cards in a visible sequence",
    reason: "The audience can predict, select, append, and repeat the same causal cycle.",
    weak: "A decorative robot portrait",
  },
  boundary: {
    label: "Classification boundary",
    best: "Floor tape or draggable points separated by a decision line",
    reason: "Position, rule, boundary, and misclassification are perceptible and manipulable.",
    weak: "A stock photo of labeled objects",
  },
  retrieval: {
    label: "Retrieval grounding",
    best: "Question card, source cards, claim strips, and trace arrows",
    reason: "Learners can test whether each claim is recoverable from the retrieved evidence.",
    weak: "A glowing database icon",
  },
} as const;

function VisualMatchLab() {
  const [active, setActive] = useState<keyof typeof visualCases>("sequence");
  const item = visualCases[active];

  return (
    <div className="m26-visual-lab">
      <nav>
        {(Object.keys(visualCases) as (keyof typeof visualCases)[]).map(key => (
          <button
            aria-current={active === key ? "page" : undefined}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {visualCases[key].label}
          </button>
        ))}
      </nav>
      <section>
        <div className={`m26-representation m26-representation-${active}`} aria-label={`Diagram for ${item.label}`}>
          <i /><i /><i /><i /><i />
        </div>
        <article><span>Meaning-matched representation</span><strong>{item.best}</strong><p>{item.reason}</p></article>
        <article className="weak"><span>Visually attractive, instructionally weak</span><strong>{item.weak}</strong><p>It signals the topic but does not expose the mechanism the objective asks learners to use.</p></article>
      </section>
    </div>
  );
}

const assessmentCases = [
  {
    prompt: "Objective: distinguish a grounded claim from an unsupported claim.",
    options: ["Ask: 'Did that make sense?'", "Sort claim cards under Supported / Not shown, then point to the source line", "Ask learners to rate the activity from 1 to 5"],
    answer: 1,
    reason: "The sorting decision plus source pointer directly samples the target performance.",
  },
  {
    prompt: "Objective: explain one next-token step.",
    options: ["Draw the context-score-choice-repeat cycle and narrate one arrow", "Copy the definition of token", "Name a favorite chatbot"],
    answer: 0,
    reason: "Drawing and narration expose both the process order and the learner's causal account.",
  },
  {
    prompt: "A learner repeats your exact analogy word for word.",
    options: ["Count it as mastery", "Ask for a prediction on a new example and where the analogy stops", "Ask whether the learner enjoyed it"],
    answer: 1,
    reason: "Transfer and a boundary statement provide stronger evidence than recall or politeness.",
  },
] as const;

function FormativeAssessment() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const item = assessmentCases[caseIndex];

  const changeCase = (index: number) => {
    setCaseIndex(index);
    setChoice(null);
  };

  return (
    <div className="m26-assessment">
      <nav>
        {assessmentCases.map((_, index) => (
          <button aria-current={caseIndex === index ? "step" : undefined} key={index} onClick={() => changeCase(index)} type="button">
            Case {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <span>Choose the strongest evidence of learning</span>
        <h3>{item.prompt}</h3>
        <div>
          {item.options.map((option, index) => (
            <button
              className={choice === index ? "selected" : ""}
              key={option}
              onClick={() => setChoice(index)}
              type="button"
            >
              <b>{String.fromCharCode(65 + index)}</b>{option}
            </button>
          ))}
        </div>
        {choice !== null && (
          <p className={choice === item.answer ? "correct" : "incorrect"}>
            <strong>{choice === item.answer ? "Correct." : `Best answer: ${String.fromCharCode(65 + item.answer)}.`}</strong> {item.reason}
          </p>
        )}
      </section>
    </div>
  );
}

const teachBackResponses = {
  nextToken: {
    label: "Next-token activity",
    prompt: "Using these cards, show me what the model does after it sees the pieces already written. Then tell me one thing this activity does not prove.",
    evidence: [
      ["Strong", "Learner scores two plausible cards, chooses one, appends it, and says the choice need not be true."],
      ["Partial", "Learner predicts the card but cannot explain what evidence influenced the choice."],
      ["Misconception", "Learner says the model looks up the correct answer in a hidden answer book."],
    ],
    response: "Re-model only the missing causal step, use a new sequence, and ask again without requiring your exact wording.",
  },
  retrieval: {
    label: "Retrieval activity",
    prompt: "Show which sentence supports this answer. What would you do if none of the source cards supports one claim?",
    evidence: [
      ["Strong", "Learner points to the matching sentence and flags the unmatched claim for checking."],
      ["Partial", "Learner chooses the most relevant passage but does not match individual claims."],
      ["Misconception", "Learner treats a displayed citation as automatic proof that every claim is supported."],
    ],
    response: "Split the answer into atomic claims, model one trace, then ask the learner to trace a different claim.",
  },
} as const;

function TeachBackLab() {
  const [active, setActive] = useState<keyof typeof teachBackResponses>("nextToken");
  const item = teachBackResponses[active];

  return (
    <div className="m26-teachback">
      <nav>
        {(Object.keys(teachBackResponses) as (keyof typeof teachBackResponses)[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {teachBackResponses[key].label}
          </button>
        ))}
      </nav>
      <section>
        <blockquote>{item.prompt}</blockquote>
        <div>
          {item.evidence.map(([level, observation]) => (
            <article className={`m26-evidence-${level.toLowerCase()}`} key={level}>
              <strong>{level}</strong><p>{observation}</p>
            </article>
          ))}
        </div>
        <aside><span>Instructor response</span><p>{item.response}</p></aside>
      </section>
    </div>
  );
}

const pilotObservations = [
  {
    kind: "like",
    statement: '"Both people liked the robot picture and said the lesson was clear."',
    verdict: "Preference data only",
    revision: "No mechanism-level revision can be justified from this statement.",
  },
  {
    kind: "observe",
    statement: "Participant A sorted 5/6 claims correctly but treated every citation as support. Participant B sorted 4/6 and changed one answer after pointing to the source sentence.",
    verdict: "Observed performance",
    revision: "Add a citation-mismatch example, replace the database icon with claim-to-source arrows, and require one unsupported-claim explanation.",
  },
] as const;

function PilotEvidenceLab() {
  const [mode, setMode] = useState<"like" | "observe">("like");
  const item = pilotObservations.find(candidate => candidate.kind === mode)!;
  const revisions = useMemo(
    () => mode === "observe"
      ? [
        ["Explanation", "Add: a citation label and source support are different claims."],
        ["Visual / activity", "Trace atomic claims to exact source lines; include one mismatch."],
        ["Assessment", "Score claim judgment and evidence pointer separately."],
      ]
      : [
        ["Explanation", "unknown"],
        ["Visual / activity", "unknown"],
        ["Assessment", "unknown"],
      ],
    [mode],
  );

  return (
    <div className="m26-pilot-lab">
      <nav>
        <button aria-pressed={mode === "like"} className={mode === "like" ? "active" : ""} onClick={() => setMode("like")} type="button">Record reactions</button>
        <button aria-pressed={mode === "observe"} className={mode === "observe" ? "active" : ""} onClick={() => setMode("observe")} type="button">Record performance</button>
      </nav>
      <section>
        <blockquote>{item.statement}</blockquote>
        <p><strong>{item.verdict}:</strong> {item.revision}</p>
      </section>
      <div>
        {revisions.map(([label, revision]) => (
          <article key={label}><span>{label}</span><strong>{revision}</strong></article>
        ))}
      </div>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Week 13 / Meeting 26",
    title: "Explain one AI mechanism without breaking it",
    subtitle: "Technical fidelity, audience design, teach-back evidence, and revision for nontechnical audiences age five and older.",
    content: (
      <div className="m26-cover">
        <section>
          <span>Central question</span>
          <h3>How can a technically accurate idea become understandable without becoming misleading?</h3>
          <p>The goal is not to remove complexity. It is to select one causal structure, represent it accessibly, and test whether another person can use it.</p>
        </section>
        <div className="m26-bridge" aria-label="A bridge from technical mechanism to observable learning">
          <article><span>01</span><strong>Technical mechanism</strong><small>What must remain true?</small></article>
          <i aria-hidden="true"><b>translate</b></i>
          <article><span>02</span><strong>Audience experience</strong><small>What can this person perceive and do?</small></article>
          <i aria-hidden="true"><b>test</b></i>
          <article><span>03</span><strong>Learning evidence</strong><small>What observable performance demonstrates the idea?</small></article>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Open with a challenge: explain next-token prediction in 30 seconds without using 'thinking,' 'magic,' or 'database lookup.' Collect one phrase to revisit after the worked example.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning objectives",
    title: "Design, test, and revise a bounded AI explanation",
    content: (
      <div className="m26-objectives">
        {[
          ["01", "Define", "Specify age range, language, prior knowledge, context, time, and access needs."],
          ["02", "Preserve", "Identify the causal spine that must survive simplification."],
          ["03", "Translate", "Use plain language, examples, a mapped analogy, and a meaning-matched representation."],
          ["04", "Assess", "Elicit prediction, sorting, drawing, explanation, or teach-back evidence."],
          ["05", "Revise", "Change the explanation, activity, and assessment from observed pilot evidence."],
        ].map(([number, title, detail]) => (
          <article key={number}><span>{number}</span><strong>{title}</strong><p>{detail}</p></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to name which objective requires the deepest CPSC 481 understanding. Emphasize that a polished artifact can still fail if it changes the mechanism.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 / Audience",
    title: "\"General public\" is not an audience profile",
    content: (
      <div className="m26-audience-anatomy">
        <section>
          <span>Audience design tuple</span>
          <code>A = (age, language, prior knowledge, context, time, access)</code>
          <p>Each field changes an instructional decision. Age alone does not determine interests, ability, language, experience, or preferred representation.</p>
        </section>
        <div>
          {[
            ["Age range", "Select examples and interaction demands; do not infer competence from a label."],
            ["Language", "Plan vocabulary, interpretation, pacing, and translated materials."],
            ["Prior knowledge", "Name only the prerequisites this concept actually uses."],
            ["Context", "Home, library, classroom, workplace, or civic meeting changes the task."],
            ["Available time", "Choose one causal idea that can be practiced, not a tour of AI."],
            ["Accessibility", "Offer equivalent ways to perceive, act, and respond."],
          ].map(([label, detail], index) => (
            <article key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><p>{detail}</p></article>
          ))}
        </div>
        <aside><strong>Design rule:</strong><p>Describe what this audience needs in this setting; do not design from stereotypes about a demographic.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Give students one minute to underline the missing fields in 'parents at a community event.' Invite two repairs and show how different profiles imply different objectives.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo / Audience profile explorer",
    title: "One concept needs different entry points, not different truths",
    content: <AudienceProfileLab />,
    note: "Timing: 4 minutes. Switch among all three profiles. For each, ask which element changes and which causal idea remains. Point out that the age 5-7 profile includes a collaborating adult but the adult profile is equally central to the assignment.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 / Observable objective",
    title: "Write the assessment before the explanation",
    content: <ObjectiveLab />,
    note: "Timing: 3 minutes. Toggle from vague to observable. Students rewrite their own 'understand AI' statement as condition + action + evidence. Cold-call one example and test whether a peer could score it consistently.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 / Prerequisites and cognitive load",
    title: "Select the smallest conceptual path to the objective",
    content: (
      <div className="m26-load">
        <section>
          <span>Example objective</span>
          <h3>Predict one next token and explain why a likely continuation can still be false.</h3>
          <div className="m26-prereq-path">
            {[
              ["Already familiar", "words or picture pieces form a sequence"],
              ["Teach now", "context changes which continuation is likely"],
              ["Teach now", "several continuations receive different chances"],
              ["Use", "predict, choose, append, repeat"],
              ["Boundary", "likely text is not verified truth"],
            ].map(([kind, idea], index) => (
              <article key={`${kind}-${idea}`}><span>{index + 1}</span><small>{kind}</small><strong>{idea}</strong></article>
            ))}
          </div>
        </section>
        <aside>
          <span>Move to later</span>
          {["matrix dimensions", "attention heads", "gradient descent", "full vocabulary", "temperature equation"].map(item => <p key={item}>{item}</p>)}
          <strong>Omitted is not denied.</strong>
          <small>The technical-fidelity statement records what was simplified and why.</small>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Students label each listed detail essential, prerequisite, or later. Clarify that responsible simplification is a documented scope choice, not pretending the omitted material does not exist.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 / Technical fidelity",
    title: "Preserve the causal spine",
    content: (
      <div className="m26-causal">
        <div>
          {[
            ["Context", "What information is available to the system?"],
            ["Mechanism", "What transformation or decision occurs?"],
            ["Observable outcome", "What output can we inspect?"],
            ["Boundary", "What conclusion does the mechanism not support?"],
          ].map(([label, question], index) => (
            <article key={label}>
              <i>{index + 1}</i><strong>{label}</strong><p>{question}</p>
              {index < 3 && <b aria-hidden="true">→</b>}
            </article>
          ))}
        </div>
        <section>
          <span>Next-token causal spine</span>
          <p><b>Context tokens</b> condition <b>candidate scores</b>; a decoding rule selects <b>one token</b>; the token is appended and the cycle repeats.</p>
          <aside><strong>Not licensed:</strong> the model knew the author&apos;s intent, checked reality, or selected the only correct continuation.</aside>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Ask which arrow disappears in the phrase 'AI writes like a person.' Have pairs state a four-part causal spine for classification, reinforcement learning, or retrieval.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 / Plain-language layers",
    title: "Translate in layers: term, process, instance, boundary",
    content: <TranslationLayerLab />,
    note: "Timing: 3 minutes. Step through the four layers. Students identify which technical nouns changed and verify that the verbs and arrow order did not. Ask why the boundary belongs inside the explanation rather than in a footnote.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 / Analogy",
    title: "Map the analogy, then mark where it breaks",
    content: <AnalogyMapLab />,
    note: "Timing: 4 minutes. Compare the three analogy maps. Students choose one mapping that carries useful structure and one point where the familiar situation would create a false inference if left unqualified.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 / Audience adaptation",
    title: "Change the entry point and task; keep the same claim",
    content: (
      <div className="m26-three-audiences">
        {[
          {
            label: "Age 5-7 / family pair",
            hook: "What picture could come next?",
            representation: "Large movable picture cards; adult reads directions.",
            language: "The pattern machine gives each next card a chance.",
            evidence: "Predict, place one card, and name one clue.",
          },
          {
            label: "Teen / media workshop",
            hook: "Why can a fluent answer be confidently wrong?",
            representation: "Candidate-token bars and two contrasting prompts.",
            language: "Context changes a probability distribution over next tokens.",
            evidence: "Rank candidates, then explain likelihood versus truth.",
          },
          {
            label: "Adult / community session",
            hook: "When should we trust an information chatbot?",
            representation: "Question, source, claim, and verification cards.",
            language: "Generated text can be plausible before a fact is checked.",
            evidence: "Trace a claim and state when human checking is needed.",
          },
        ].map((profile, index) => (
          <article key={profile.label}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><strong>{profile.label}</strong></header>
            <div><small>Entry</small><p>{profile.hook}</p></div>
            <div><small>Representation</small><p>{profile.representation}</p></div>
            <div><small>Technical sentence</small><p>{profile.language}</p></div>
            <div><small>Learning evidence</small><p>{profile.evidence}</p></div>
          </article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Read the technical sentence in each column. Ask students whether the causal claim changes. Discuss why age is one design variable rather than a proxy for intelligence or interest.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 / Representation",
    title: "A visual should make the mechanism operable",
    content: <VisualMatchLab />,
    note: "Timing: 3 minutes. Switch among the three concepts. Ask: what can the learner do with the strong representation that is impossible with the decorative image? Connect this to informative alt text that describes purpose, not appearance alone.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked example 1 / College-level account",
    title: "First, recover the mechanism: one next-token step",
    content: <NextTokenDemo />,
    note: "Timing: 3 minutes. Let students select candidates and inspect the constructed distribution. State that the numbers illustrate the interface, not a live model measurement. Ask what changes if the context changes to 'Upload the file to the'.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked example 1 / Five-minute activity",
    title: "Turn next-token prediction into an embodied cycle",
    content: (
      <div className="m26-token-activity">
        <section>
          <span>Materials</span>
          <div className="m26-card-stack" aria-label="Sequence and candidate cards">
            {["the", "small", "dog", "chased", "the", "?"].map((word, index) => <i key={`${word}-${index}`}>{word}</i>)}
          </div>
          <div className="m26-candidates">
            {["ball", "moon", "blue", "."].map((word, index) => <b key={word} style={{ "--m26-rank": index + 1 } as React.CSSProperties}>{word}</b>)}
          </div>
        </section>
        <div>
          {[
            ["1 / Predict", "Each person silently chooses a candidate and one context clue."],
            ["2 / Compare", "Reveal choices; allow more than one plausible continuation."],
            ["3 / Append", "Add the selected card and generate a new candidate set."],
            ["4 / Boundary", "Test a fluent but false continuation; likelihood is not verification."],
          ].map(([step, detail]) => <article key={step}><strong>{step}</strong><p>{detail}</p></article>)}
        </div>
        <aside><strong>Assessment prompt:</strong><p>&quot;Use the cards to show one generation step. What does the activity leave out about a real language model?&quot;</p></aside>
      </div>
    ),
    note: "Timing: 4 minutes. Run one physical round or have pairs simulate with the displayed cards. Require every group to say both the causal rule and one limit before moving on.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked example 2 / Retrieval-grounded answers",
    title: "Retrieval adds evidence access, not automatic correctness",
    content: (
      <div className="m26-rag-example">
        <section>
          <span>Question</span>
          <blockquote>When may residents place large items at the curb?</blockquote>
          <div className="m26-rag-flow">
            {[
              ["Retrieve", "Find passages similar to the question."],
              ["Place in context", "Attach selected passages to the prompt."],
              ["Generate", "Compose an answer using that context."],
              ["Verify", "Match each claim to an exact source line."],
            ].map(([label, detail], index) => <article key={label}><span>{index + 1}</span><strong>{label}</strong><p>{detail}</p></article>)}
          </div>
        </section>
        <aside>
          <span>Source cards</span>
          <article><b>City guide / p. 3</b><p>&quot;Schedule bulky-item pickup before placing items outside.&quot;</p></article>
          <article><b>Holiday notice / p. 1</b><p>&quot;Collection shifts one day after listed holidays.&quot;</p></article>
          <span>Candidate answer</span>
          <p>Residents may place items outside any evening before collection. <mark>Unsupported detail</mark></p>
          <strong>Boundary: retrieved context can be incomplete, irrelevant, outdated, or misused.</strong>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Have students underline the supported clause and cross out the unsupported one. Ask which part of the four-step flow failed and what a nontechnical audience should do next.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 / Misconception control",
    title: "Predict the misconception before you pilot",
    content: (
      <div className="m26-misconceptions">
        {[
          {
            number: "01",
            misconception: "The model looks up the correct next word in a hidden answer book.",
            cause: "Autocomplete analogy presented without scores or alternatives.",
            boundary: "The model scores multiple candidate tokens from learned patterns; it is not retrieving a unique correct continuation.",
            check: "Ask the learner to produce two plausible continuations.",
          },
          {
            number: "02",
            misconception: "A high-probability continuation is probably a true statement.",
            cause: "Likelihood and factual verification collapsed into one idea.",
            boundary: "Probability here concerns continuation under context, not whether a claim matches the world.",
            check: "Give one fluent false continuation and ask what evidence would verify it.",
          },
        ].map(item => (
          <article key={item.number}>
            <header><span>{item.number}</span><strong>{item.misconception}</strong></header>
            <div><small>How our design may cause it</small><p>{item.cause}</p></div>
            <div><small>Boundary statement</small><p>{item.boundary}</p></div>
            <div><small>Diagnostic check</small><p>{item.check}</p></div>
          </article>
        ))}
        <aside><strong>Boundary sentence pattern:</strong><p>&quot;This representation helps us see __. It does not show __, because __.&quot;</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Students identify which misconception their own first draft could produce. Require a diagnostic question that would expose it rather than merely restating the warning.",
    sourceSlides: [],
  },
  {
    eyebrow: "Formative assessment",
    title: "Does the assessment sample the objective?",
    content: <FormativeAssessment />,
    note: "Timing: 3 minutes. Run all three cases quickly. Students vote before revealing the rationale. Use disagreements to distinguish enjoyment, recall, explanation, application, and transfer.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 / Accessibility, privacy, and safety",
    title: "Design access and safeguards into the first prototype",
    content: (
      <div className="m26-safeguards">
        {[
          {
            label: "Accessibility",
            symbol: "A",
            points: [
              "Provide equivalent spoken, written, visual, and manipulable paths.",
              "Use high contrast, readable type, keyboard access, captions, and meaningful text alternatives.",
              "Do not make color, speed, fine motor control, or reading the only route to success.",
            ],
            test: "Can a learner perceive the same causal relation through another mode?",
          },
          {
            label: "Privacy",
            symbol: "P",
            points: [
              "Use invented prompts and de-identified pilot notes.",
              "Do not require participants to disclose disability, immigration, health, school, or account data.",
              "Record the least evidence needed; obtain permission before photos or recordings.",
            ],
            test: "Could the evidence be useful without identifying the participant?",
          },
          {
            label: "Safety",
            symbol: "S",
            points: [
              "Use age- and context-appropriate examples with no distressing or deceptive content.",
              "Avoid live account creation, secret entry, consequential advice, and unreviewed external tools.",
              "Plan adult support, physical materials, and a stop option when appropriate.",
            ],
            test: "What could go wrong during the activity, and who can stop it?",
          },
        ].map(section => (
          <article key={section.label}>
            <header><i>{section.symbol}</i><strong>{section.label}</strong></header>
            <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>
            <aside><span>Design test</span><p>{section.test}</p></aside>
          </article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Assign one column to each part of the room. Teams name one preventable failure and one concrete design change. Remind students that an accessibility need can be stated without collecting sensitive diagnoses.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 / Learning evidence",
    title: "Match the response mode to the knowledge claim",
    content: (
      <div className="m26-response-modes">
        {[
          ["Predict", "Use a rule on a new case", "What comes next, and which clue changed your prediction?", "next-token likelihood"],
          ["Sort", "Distinguish categories", "Place each claim under supported, unsupported, or unclear.", "retrieval grounding"],
          ["Draw", "Represent causal structure", "Draw arrows from context to scores to choice to new context.", "generation cycle"],
          ["Explain", "State a mechanism and limit", "Why can fluent text still be wrong?", "likelihood versus truth"],
          ["Teach back", "Reconstruct and apply", "Show me the process in your own way, then use it on this new example.", "integrated understanding"],
        ].map(([mode, evidence, prompt, fit], index) => (
          <article key={mode}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{mode}</strong>
            <div><small>Evidence</small><p>{evidence}</p></div>
            <div><small>Prompt</small><p>{prompt}</p></div>
            <b>{fit}</b>
          </article>
        ))}
        <aside><strong>Avoid:</strong><p>&quot;Do you understand?&quot; samples willingness to agree, not the target performance.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Give each pair an objective from the suggested concept families. They choose one response mode and explain why it produces observable evidence for that specific objective.",
    sourceSlides: [],
  },
  {
    eyebrow: "Demo / Teach-back",
    title: "Teach-back tests the explanation, not the audience",
    content: <TeachBackLab />,
    note: "Timing: 3 minutes. Model a non-shaming prompt: 'I want to see whether my explanation worked.' Toggle between the two activities and ask when to reteach, when to change the representation, and when to revise the objective.",
    sourceSlides: [],
  },
  {
    eyebrow: "Studio 1 / Audience and objective",
    title: "Define one audience and one visible performance",
    content: (
      <div className="m26-studio">
        <section>
          <span>Team task / 4 minutes</span>
          <h3>Choose one bounded CPSC 481 concept and complete the design sentence.</h3>
          <blockquote>For <mark>[defined audience]</mark> in <mark>[context]</mark>, given <mark>[condition]</mark>, learners will <mark>[observable action]</mark> with <mark>[success evidence]</mark>.</blockquote>
        </section>
        <div>
          {[
            ["Audience fields", "age range · language · prior knowledge · context · time · accessibility"],
            ["Concept boundary", "one mechanism, not 'how AI works'"],
            ["Prerequisites", "what must already be known or taught first"],
            ["Evidence", "a peer could score the response consistently"],
          ].map(([label, criterion], index) => <article key={label}><span>{index + 1}</span><strong>{label}</strong><p>{criterion}</p></article>)}
        </div>
        <aside><strong>Peer check:</strong><p>Circle any audience assumption unsupported by the profile. Underline the verb in the objective. Can the verb be observed?</p></aside>
      </div>
    ),
    note: "Timing: 4 minutes. Students work in assignment pairs. At minute three, exchange objectives with another pair for a scoreability check. Collect one revision that changed after peer review.",
    sourceSlides: [],
  },
  {
    eyebrow: "Studio 2 / Analogy boundary",
    title: "Build a four-row map before using the metaphor",
    content: (
      <div className="m26-analogy-studio">
        <section>
          <header><span>Familiar system</span><i aria-hidden="true">↔</i><span>AI mechanism</span></header>
          {[1, 2, 3, 4].map(number => (
            <article key={number}><b>{number}</b><p>________________</p><i aria-hidden="true">maps to</i><p>________________</p></article>
          ))}
        </section>
        <aside>
          <span>Required break point</span>
          <blockquote>This analogy helps explain __________ because __________. It stops working when __________; the AI system actually __________.</blockquote>
          <div>
            <strong>Failure test</strong>
            <p>What false prediction would a learner make if they treated the analogy as literal?</p>
          </div>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Each team maps four correspondences and one break point. Reject mappings that match only appearance. Ask a neighboring team to predict the misconception the analogy might create.",
    sourceSlides: [],
  },
  {
    eyebrow: "Studio 3 / Representation and assessment",
    title: "Prototype the action, not the decoration",
    content: (
      <div className="m26-prototype-studio">
        <div className="m26-prototype-canvas" aria-label="Blank prototype canvas with causal checkpoints">
          <span>input / context</span><i aria-hidden="true">→</i><span>learner action</span><i aria-hidden="true">→</i><span>visible outcome</span><i aria-hidden="true">→</i><span>boundary check</span>
        </div>
        <section>
          {[
            ["Meaning", "Every visual or object encodes a relation used by the explanation."],
            ["Interaction", "The learner predicts, sorts, moves, draws, or explains."],
            ["Access", "An equivalent route exists if seeing, hearing, reading, or moving is difficult."],
            ["Assessment", "A new item samples the objective, including the boundary."],
          ].map(([label, test]) => <article key={label}><strong>{label}</strong><p>{test}</p></article>)}
        </section>
        <aside><strong>90-second gallery test:</strong><p>A visitor should be able to point to where the causal relation is represented and where learning evidence will appear.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Teams sketch on paper or a shared slide. Require labels for input, action, result, and boundary. Conduct a rapid gallery walk and remove one element that is merely decorative.",
    sourceSlides: [],
  },
  {
    eyebrow: "Pilot and revision",
    title: "Collect performance evidence, then revise three linked choices",
    content: (
      <div className="m26-pilot">
        <header>
          {[
            ["1", "Pilot", "Two people approximating the audience, or two supplied role profiles"],
            ["2", "Observe", "Predictions, actions, words, errors, pauses, and help requested"],
            ["3", "Interpret", "Which causal link or boundary was missing?"],
            ["4", "Revise", "Explanation + visual/activity + assessment"],
            ["5", "Recheck", "Use a new item rather than rehearsing the answer"],
          ].map(([number, label, detail]) => <article key={number}><span>{number}</span><strong>{label}</strong><p>{detail}</p></article>)}
        </header>
        <PilotEvidenceLab />
      </div>
    ),
    note: "Timing: 2 minutes. Toggle from reactions to observed performance. Ask students which revision is justified by the first record; the answer is none. Clarify that role profiles are acceptable when access to the intended audience would be inappropriate or impractical.",
    sourceSlides: [],
  },
  {
    eyebrow: "Assignment B / Explain AI",
    title: "Submit a tested learning experience, not a publicity artifact",
    content: (
      <div className="m26-assignment">
        <section>
          <span>Minimum deliverables</span>
          {[
            ["Audience + objective", "Defined profile and one observable performance"],
            ["Teaching artifact", "5-8 minute explanation, example, representation, and analogy boundary"],
            ["Facilitator guide", "Materials, timing, questions, access, privacy, and safety"],
            ["Learning evidence", "Before/after misconception check or teach-back"],
            ["Revision log", "Observed evidence and three linked revisions"],
            ["Technical fidelity", "300-500 words: simplified, retained, and analogy stop point"],
          ].map(([label, detail], index) => <article key={label}><span>{index + 1}</span><strong>{label}</strong><p>{detail}</p></article>)}
        </section>
        <section>
          <span>Rubric / 100 points</span>
          {[
            ["Technical fidelity + boundaries", 25],
            ["Audience fit + accessibility", 20],
            ["Example + visual + interaction", 15],
            ["Assessment validity", 15],
            ["Evidence-based revision", 15],
            ["Clarity + privacy + safety", 10],
          ].map(([label, points]) => (
            <article key={String(label)}><strong>{label}</strong><i><b style={{ width: `${Number(points) * 4}%` }} /></i><span>{points}</span></article>
          ))}
        </section>
        <aside>
          <strong>Course grade and publication are separate.</strong>
          <p>A submission may become a candidate AAB contribution only after grading. Instructor/AAB source, privacy, and editorial review is a separate workflow; publication is optional and never changes the course grade.</p>
          <div aria-label="Candidate AAB workflow"><span>course submission</span><i>→</i><span>course grade</span><i>→</i><span>optional review</span><i>→</i><span>authorized publication</span></div>
        </aside>
      </div>
    ),
    note: "Timing: 2 minutes. Walk through the six required artifacts and point out the two 15-point categories students often leave implicit: assessment validity and evidence-based revision. State the grade/publication separation exactly.",
    sourceSlides: [],
  },
  {
    eyebrow: "Exit ticket / Current readings",
    title: "Fidelity is demonstrated when another person can use the idea",
    content: (
      <div className="m26-exit">
        <section>
          <span>Exit ticket / submit before leaving</span>
          <ol>
            <li>Write your audience as six fields, not a demographic label.</li>
            <li>State the causal spine your explanation must preserve.</li>
            <li>Write one analogy break point and one observable assessment prompt.</li>
            <li>Name the pilot evidence that would make you revise the visual.</li>
          </ol>
          <blockquote>Plain language changes the path into an idea. It does not change which idea the path reaches.</blockquote>
        </section>
        <section>
          <FormativeAssessment />
        </section>
        <aside>
          <span>Current AI-literacy and communication reading set</span>
          <ul>
            <li><a href="https://www.aaboard.org/cases/AAB-CASE-2026-RV-065" rel="noreferrer" target="_blank">AAB case: AI literacy for nontechnical learners</a></li>
            <li><a href="https://udlguidelines.cast.org/" rel="noreferrer" target="_blank">CAST: Universal Design for Learning Guidelines</a></li>
            <li><a href="https://www.w3.org/WAI/tutorials/images/" rel="noreferrer" target="_blank">W3C WAI: Images and equivalent text alternatives</a></li>
            <li><a href="https://www.ahrq.gov/health-literacy/improve/precautions/tool5.html" rel="noreferrer" target="_blank">AHRQ: Use the Teach-Back Method</a></li>
          </ul>
          <p><strong>Bring next meeting:</strong> your audience profile, objective, causal spine, and first representation sketch.</p>
        </aside>
      </div>
    ),
    note: "Timing: 2 minutes. Collect the four-part exit ticket. If time permits, run one assessment case. The 25 lesson-page timings total exactly 75 minutes.",
    sourceSlides: [],
  },
];

export function Meeting26Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Module 9 · Lesson 12"
      meetingTitle="Explaining AI to Nontechnical Audiences Age Five and Older"
      slides={slides}
      sourceCollectionLabel="Current AI-literacy and communication reading set"
    />
  );
}
