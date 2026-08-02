"use client";

import { useMemo, useState } from "react";
import "../styles/meeting25.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

const questionCases = {
  broad: {
    label: "Broad claim",
    question: "Do AI tutors work?",
    fields: {
      population: "any learner",
      system: "any AI tutor",
      context: "any setting",
      outcome: "work",
      study: "any evidence",
    },
    verdict: "Not screenable: almost any paper could appear relevant.",
  },
  bounded: {
    label: "Bounded question",
    question: "For first-year programming students, does a retrieval-grounded tutoring chatbot, compared with static hints in a four-week lab course, improve transfer-test performance in controlled studies?",
    fields: {
      population: "first-year programming students",
      system: "retrieval-grounded tutoring chatbot vs. static hints",
      context: "four-week lab course",
      outcome: "transfer-test performance",
      study: "controlled comparison",
    },
    verdict: "Screenable: each field can become an inclusion criterion.",
  },
} as const;

function QuestionBoundaryLab() {
  const [active, setActive] = useState<keyof typeof questionCases>("broad");
  const item = questionCases[active];

  return (
    <div className="m25-question-lab">
      <nav aria-label="Research-question examples">
        {(Object.keys(questionCases) as (keyof typeof questionCases)[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {questionCases[key].label}
          </button>
        ))}
      </nav>
      <blockquote>{item.question}</blockquote>
      <div>
        {Object.entries(item.fields).map(([field, value]) => (
          <article key={field}>
            <span>{field}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <p className={active === "bounded" ? "ready" : "warning"}>
        <strong>{active === "bounded" ? "Ready to search" : "Revise first"}:</strong> {item.verdict}
      </p>
    </div>
  );
}

const queryConcepts = {
  population: ['"first-year"', "undergraduate*", "novice programmer*"],
  system: ['"AI tutor"', "chatbot", '"large language model"'],
  outcome: ['"learning outcome*"', "transfer", "achievement"],
} as const;

function SearchQueryLab() {
  const [selected, setSelected] = useState({
    population: true,
    system: true,
    outcome: true,
    exclusion: false,
  });
  const query = useMemo(() => {
    const clauses: string[] = [];
    if (selected.population) clauses.push(`(${queryConcepts.population.join(" OR ")})`);
    if (selected.system) clauses.push(`(${queryConcepts.system.join(" OR ")})`);
    if (selected.outcome) clauses.push(`(${queryConcepts.outcome.join(" OR ")})`);
    if (selected.exclusion) clauses.push(`NOT (editorial OR news OR marketing)`);
    return clauses.join(" AND ") || "Select at least one concept block";
  }, [selected]);

  return (
    <div className="m25-query-lab">
      <div className="m25-query-controls">
        {[
          ["population", "Who?", "learner synonyms"],
          ["system", "What system?", "technology synonyms"],
          ["outcome", "Which outcome?", "measurable endpoints"],
          ["exclusion", "Exclude?", "nonresearch commentary"],
        ].map(([key, label, detail]) => (
          <button
            aria-pressed={selected[key as keyof typeof selected]}
            className={selected[key as keyof typeof selected] ? "active" : ""}
            key={key}
            onClick={() => setSelected(previous => ({ ...previous, [key]: !previous[key as keyof typeof selected] }))}
            type="button"
          >
            <span>{selected[key as keyof typeof selected] ? "✓" : "+"}</span>
            <strong>{label}</strong>
            <small>{detail}</small>
          </button>
        ))}
      </div>
      <section>
        <span>Reproducible query</span>
        <code>{query}</code>
      </section>
      <footer>
        <div><span>Database</span><strong>ACM Digital Library</strong></div>
        <div><span>Searched</span><strong>2026-07-29</strong></div>
        <div><span>Filters</span><strong>peer reviewed · 2020–2026 · English</strong></div>
        <div><span>Record</span><strong>query · date · filters · hit count</strong></div>
      </footer>
    </div>
  );
}

const annotationSections = {
  abstract: {
    label: "Abstract",
    excerpt: "Students using the activity improved their mean score from 12.1 to 15.8. The authors conclude that the activity was effective.",
    extract: "Author-reported direction of change; no comparison, uncertainty, attrition, or test description is visible here.",
    caution: "An abstract is a map to the paper, not enough evidence for a causal summary.",
  },
  methods: {
    label: "Methods",
    excerpt: "Two intact course sections were assigned different activities. One instructor taught both sections. The 18-item outcome test was created by the research team.",
    extract: "Quasi-experimental comparison; section assignment, shared instructor, researcher-made measure.",
    caution: "Intact sections leave selection and schedule differences as plausible alternative explanations.",
  },
  results: {
    label: "Results",
    excerpt: "Adjusted mean difference = 2.4 points, 95% CI [0.6, 4.2], p = .01; 104 of 120 enrolled students completed the posttest.",
    extract: "Magnitude, interval, test result, analysis denominator, and 16 missing posttests.",
    caution: "Statistical compatibility does not establish educational importance or eliminate attrition bias.",
  },
  limits: {
    label: "Limitations",
    excerpt: "The study occurred at one institution over four weeks. The authors did not measure persistence after the course or report accessibility accommodations.",
    extract: "Single site, short duration, no delayed outcome, accessibility information missing.",
    caution: "Transfer to other ages, institutions, durations, or access needs requires verification.",
  },
} as const;

function PaperAnnotationLab() {
  const [active, setActive] = useState<keyof typeof annotationSections>("methods");
  const item = annotationSections[active];

  return (
    <div className="m25-annotation-lab">
      <nav aria-label="Constructed paper sections">
        {(Object.keys(annotationSections) as (keyof typeof annotationSections)[]).map(key => (
          <button
            aria-current={active === key ? "page" : undefined}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {annotationSections[key].label}
          </button>
        ))}
      </nav>
      <section>
        <span>Constructed teaching excerpt · {item.label}</span>
        <blockquote>{item.excerpt}</blockquote>
      </section>
      <div>
        <article><span>Extract</span><p>{item.extract}</p></article>
        <article><span>Do not overclaim</span><p>{item.caution}</p></article>
      </div>
    </div>
  );
}

const traceCases = {
  result: {
    label: "Result claim",
    claim: "The adjusted between-group difference was 2.4 points (95% CI [0.6, 4.2]).",
    source: "Results, p. 8, Table 2, row ‘Posttest total’",
    kind: "Author report",
    decision: "Trace is specific and preserves magnitude and uncertainty.",
  },
  transfer: {
    label: "Transfer claim",
    claim: "The activity will improve AI literacy in middle-school classrooms.",
    source: "No middle-school sample or transfer study reported",
    kind: "Unsupported",
    decision: "Reject this claim; the study cannot establish transfer to a new population.",
  },
  access: {
    label: "Missing field",
    claim: "The activity is accessible to learners using screen readers.",
    source: "Accessibility procedures are not reported",
    kind: "Missing",
    decision: "Record as missing information, not as a negative finding.",
  },
} as const;

function TraceAuditLab() {
  const [active, setActive] = useState<keyof typeof traceCases>("result");
  const item = traceCases[active];

  return (
    <div className="m25-trace-lab">
      <nav aria-label="Claim trace examples">
        {(Object.keys(traceCases) as (keyof typeof traceCases)[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {traceCases[key].label}
          </button>
        ))}
      </nav>
      <div className="m25-trace-flow">
        <article><span>Candidate claim</span><p>{item.claim}</p></article>
        <i aria-hidden="true">→</i>
        <article><span>Source locator</span><p>{item.source}</p></article>
        <i aria-hidden="true">→</i>
        <article><span>Evidence class</span><strong>{item.kind}</strong></article>
      </div>
      <p><strong>Editorial decision:</strong> {item.decision}</p>
    </div>
  );
}

const dispositionCases = {
  accept: {
    label: "Accept",
    evidence: "Stable citation; six claims recoverable; qualifications preserved; required fields complete.",
    disposition: "Accept as a candidate contribution for instructor/AAB verification.",
  },
  revise: {
    label: "Revise",
    evidence: "Relevant source, but two claims cite only the abstract and omit comparison details.",
    disposition: "Return to reviewer with exact repair requests.",
  },
  hold: {
    label: "Hold",
    evidence: "Bibliographic record exists, but the full paper and supplement cannot yet be checked.",
    disposition: "Hold for verification; do not infer from metadata.",
  },
  reject: {
    label: "Reject",
    evidence: "Provider blog repeats a result without linking a primary study.",
    disposition: "Reject as research evidence; it may remain a lead for further searching.",
  },
} as const;

function DispositionLab() {
  const [active, setActive] = useState<keyof typeof dispositionCases>("revise");
  const item = dispositionCases[active];

  return (
    <div className="m25-disposition-lab">
      <nav aria-label="Editorial dispositions">
        {(Object.keys(dispositionCases) as (keyof typeof dispositionCases)[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {dispositionCases[key].label}
          </button>
        ))}
      </nav>
      <section>
        <span>Evidence state</span>
        <p>{item.evidence}</p>
      </section>
      <aside><strong>{item.label}</strong><p>{item.disposition}</p></aside>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "AAB Evidence Practicum",
    title: "From a paper to cautious, traceable case evidence",
    subtitle: "Finding, reading, tracing, and reviewing research without making the study say more than it does.",
    content: (
      <div className="m25-cover">
        <section>
          <span>Meeting question</span>
          <h3>How can a research paper become useful evidence without becoming an exaggerated claim?</h3>
          <p>Today you will move through one complete evidence workflow: frame, find, screen, read, trace, map, audit, and disposition.</p>
        </section>
        <div className="m25-cover-workflow" aria-label="Evidence workflow">
          {[
            ["01", "Question", "bound the claim"],
            ["02", "Paper", "verify the source"],
            ["03", "Trace", "locate each claim"],
            ["04", "Card", "map with caution"],
          ].map(([number, label, detail], index) => (
            <article key={label}>
              <span>{number}</span><i>{index === 1 ? "⌕" : index === 2 ? "↳" : index === 3 ? "▤" : "?"}</i>
              <strong>{label}</strong><small>{detail}</small>
            </article>
          ))}
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Open with the meeting question. Preview the four visible artifacts students will produce today and connect the workflow to Assignment A.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning objectives / Assignment A",
    title: "By the end of class, you can make an evidence review reproducible",
    content: (
      <div className="m25-objectives">
        {[
          ["Frame", "a bounded evidence question with population, system, context, outcome, and study type"],
          ["Find", "a primary, peer-reviewed study with a reproducible query and verified identity"],
          ["Read", "design, participants, measures, results, uncertainty, limitations, and transfer conditions"],
          ["Trace", "author reports, reviewer inferences, missing evidence, and unsupported claims to locations"],
          ["Judge", "an AAB candidate field map and accept, revise, hold, or reject disposition"],
        ].map(([label, detail], index) => (
          <article key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><p>{detail}</p></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Read the objectives as an evidence pipeline. Students identify which stage is easiest to fake if another reviewer cannot see the trace.",
    sourceSlides: [],
  },
  {
    eyebrow: "Assignment contract / Publication guardrail",
    title: "Your submission is a candidate contribution—not a published AAB record",
    content: (
      <div className="m25-guardrail">
        <div className="m25-guardrail-flow">
          {[
            ["Course work", "student submits evidence brief or card audit"],
            ["Verification", "instructor/AAB reviewers check sources, claims, privacy, and fields"],
            ["Editorial decision", "authorized review may accept, revise, hold, or reject"],
            ["Possible publication", "only verified and authorized material may enter a public record"],
          ].map(([label, detail], index) => (
            <article key={label}><span>{index + 1}</span><div><strong>{label}</strong><p>{detail}</p></div></article>
          ))}
        </div>
        <section>
          <span>Three nonnegotiable boundaries</span>
          <ul>
            <li>A registry record describes evidence; it does not endorse a tool, provider, curriculum, or result.</li>
            <li>Course grades never depend on whether AAB publishes the work.</li>
            <li>Publication requires instructor/AAB source verification and authorized editorial review.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. State all three boundaries verbatim. Ask students why a high course grade and a publication decision answer different questions.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 / Bounded evidence questions",
    title: "A research question becomes searchable when five fields are explicit",
    content: (
      <div className="m25-question-fields">
        {[
          ["P", "Population", "Who was studied?", "age · experience · sample"],
          ["S", "System / intervention", "What was used or compared?", "AI system · activity · baseline"],
          ["C", "Context", "Where and for how long?", "course · institution · duration"],
          ["O", "Outcome", "What observable result?", "measure · time point · magnitude"],
          ["D", "Study design", "What kind of evidence?", "controlled · correlational · qualitative"],
        ].map(([initial, label, question, examples]) => (
          <article key={label}><i>{initial}</i><strong>{label}</strong><p>{question}</p><small>{examples}</small></article>
        ))}
        <aside><strong>Test:</strong> Could two reviewers use these fields to make the same include/exclude decision?</aside>
      </div>
    ),
    note: "Timing: 3 minutes. Define the five fields. Students underline the population and outcome in one candidate question, then name the missing field.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive practice / Question boundary",
    title: "Turn a topic into a screenable evidence question",
    content: <QuestionBoundaryLab />,
    note: "Timing: 3 minutes. Toggle between broad and bounded examples. Pairs revise one broad topic from their interests using all five fields.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 / Source selection",
    title: "Prefer the original study—but never treat peer review as a quality guarantee",
    content: (
      <div className="m25-source-layers">
        <section>
          {[
            ["Best evidence object", "Original peer-reviewed research report", "methods, data analysis, results, limitations"],
            ["Useful orientation", "Systematic review or scholarly synthesis", "find vocabulary and primary studies; trace important claims backward"],
            ["Lead only", "News, blog, vendor page, abstract index", "use to discover a source, not as the final evidence object"],
          ].map(([rank, source, use], index) => (
            <article key={rank}><span>{index + 1}</span><div><small>{rank}</small><strong>{source}</strong><p>{use}</p></div></article>
          ))}
        </section>
        <aside>
          <span>Selection checks</span>
          <ul>
            <li>Does the paper report the study firsthand?</li>
            <li>Is the venue and review status identifiable?</li>
            <li>Can you inspect the full methods and results?</li>
            <li>Does it answer the bounded question?</li>
          </ul>
          <blockquote>Relevant is not the same as reliable; peer reviewed is not the same as correct.</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Distinguish primary source from primary data. Ask where a systematic review belongs and why a provider blog remains a lead rather than evidence.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 / Reproducible search",
    title: "A search is a recorded procedure, not a browser history",
    content: (
      <div className="m25-search-anatomy">
        {[
          ["Concept blocks", "Translate question fields into synonyms and controlled vocabulary."],
          ["Boolean logic", "OR joins synonyms; AND joins concepts; quotes preserve phrases."],
          ["Source", "Record database or index because coverage and syntax differ."],
          ["Execution", "Record exact query, date, filters, and number of results."],
          ["Decision trail", "Keep include/exclude reasons and query changes."],
        ].map(([label, detail], index) => (
          <article key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><p>{detail}</p></article>
        ))}
        <code>(&quot;AI tutor&quot; OR chatbot) AND (undergraduate* OR &quot;novice programmer&quot;) AND (transfer OR achievement)</code>
      </div>
    ),
    note: "Timing: 3 minutes. Build the example query left to right. Ask which operator broadens within a concept and which operator narrows across concepts.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive demo / Query builder",
    title: "Construct a query another student could rerun",
    content: <SearchQueryLab />,
    note: "Timing: 3 minutes. Toggle concept blocks and read how the Boolean structure changes. Students copy one complete search record into their assignment workspace.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 4 / Screening and inclusion",
    title: "Screen against declared criteria—not against an exciting title",
    content: (
      <div className="m25-screening">
        <section>
          <span>Before searching</span>
          {[
            ["Include", "original empirical study; target population; relevant AI-literacy activity; measured learning outcome"],
            ["Exclude", "commentary only; no accessible methods/results; unrelated population; system without educational outcome"],
          ].map(([label, detail]) => <article key={label}><strong>{label}</strong><p>{detail}</p></article>)}
        </section>
        <div className="m25-screen-flow">
          {[
            ["42", "records found"],
            ["31", "title/abstract screen"],
            ["9", "full texts checked"],
            ["3", "included studies"],
          ].map(([number, label], index) => <article key={label}><b>{number}</b><span>{label}</span>{index < 3 && <i>→</i>}</article>)}
        </div>
        <aside>
          <strong>Record one reason per excluded full text.</strong>
          <p>“Not useful” is not reproducible. “No measured learner outcome” is.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Students make one include and one exclude rule for their question before seeing search results. Discuss how post hoc criteria create confirmation bias.",
    sourceSlides: [],
  },
  {
    eyebrow: "Bibliographic identity / DOI",
    title: "Verify that the paper you read is the paper you cite",
    content: (
      <div className="m25-identity">
        <section>
          {[
            ["Title", "exact subtitle and punctuation"],
            ["Authors", "order and complete names"],
            ["Venue", "journal or proceedings title"],
            ["Year", "version of record, not upload date"],
            ["Identifier", "DOI or stable publisher URL"],
            ["Access", "full text and supplement if used"],
          ].map(([label, detail]) => <article key={label}><span>{label}</span><strong>{detail}</strong></article>)}
        </section>
        <div className="m25-doi">
          <span>Persistent identifier</span>
          <code>https://doi.org/10.xxxx/xxxxx</code>
          <div><b>resolve</b><i>→</i><b>match metadata</b><i>→</i><b>inspect version</b></div>
          <p>A DOI identifies an object; it does not certify the study’s quality or causal validity.</p>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Demonstrate the identity checklist. Students compare the PDF title page with the database record and explain what a DOI does not prove.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 5 / Reading beyond the abstract",
    title: "Follow the claim through the paper—not just through the abstract",
    content: (
      <div className="m25-paper-map">
        {[
          ["Question", "Introduction", "What gap and hypothesis are declared?"],
          ["Population", "Methods", "Who participated, who was excluded, and what was the setting?"],
          ["Intervention", "Methods / supplement", "What exactly happened, for how long, and compared with what?"],
          ["Measure", "Methods", "How was the outcome operationalized and validated?"],
          ["Magnitude", "Results / tables", "What changed, by how much, with what uncertainty and denominator?"],
          ["Boundary", "Limitations / discussion", "Which explanations and transfer conditions remain unresolved?"],
        ].map(([claim, location, question], index) => (
          <article key={claim}><span>{index + 1}</span><div><strong>{claim}</strong><small>{location}</small><p>{question}</p></div></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Give students 60 seconds to predict where each detail belongs, then reveal the reading path. Emphasize tables and supplements.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 6 / Study designs and causal claims",
    title: "The design limits the verbs your evidence statement may use",
    content: (
      <div className="m25-designs">
        {[
          ["Randomized comparison", "can estimate an intervention effect if assignment, attrition, measurement, and analysis are credible", "caused / increased, with qualifications"],
          ["Quasi-experiment", "compares groups or time periods without random assignment", "was associated with; effect estimate under assumptions"],
          ["Correlational study", "measures variables without assigning exposure", "was related to / predicted"],
          ["Descriptive or design report", "documents implementation, usability, or observed patterns", "participants reported / the team observed"],
          ["Qualitative study", "interprets experience, meaning, process, and context", "themes indicated / participants described"],
        ].map(([design, warrant, language], index) => (
          <article key={design}><span>{index + 1}</span><div><strong>{design}</strong><p>{warrant}</p></div><code>{language}</code></article>
        ))}
        <aside><strong>No design licenses universal claims.</strong><p>Causal identification and transferability are separate judgments.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Students replace the verb “proved” in three example summaries. Ask why a randomized result at one site can still have limited transferability.",
    sourceSlides: [],
  },
  {
    eyebrow: "Extraction / Participants, context, measures, and results",
    title: "A result needs its population, measure, magnitude, and uncertainty",
    content: (
      <div className="m25-extraction">
        <div>
          <section>
            <span>Participants</span>
            <ul><li>enrolled and analyzed sample</li><li>age, experience, language</li><li>assignment, attrition, exclusions</li></ul>
          </section>
          <section>
            <span>Context</span>
            <ul><li>institution, course, modality</li><li>technology and support</li><li>comparison and duration</li></ul>
          </section>
          <section>
            <span>Measures</span>
            <ul><li>construct, instrument, scoring</li><li>validity or reliability evidence</li><li>time point and outcome type</li></ul>
          </section>
        </div>
        <section>
          <div className="m25-interval" aria-label="Confidence interval from 0.6 to 4.2 with estimate 2.4">
            <span className="zero">0</span><i className="range" /><b className="estimate">2.4</b><span className="low">0.6</span><span className="high">4.2</span>
          </div>
          <code>adjusted mean difference = 2.4 points, 95% CI [0.6, 4.2]</code>
          <p><strong>Read together:</strong> direction · magnitude · comparison · denominator · uncertainty</p>
        </section>
        <aside><strong>Operationalization check:</strong><p>“AI literacy improved” must resolve to what learners actually did on which measure. p &lt; .05 is not an effect size.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Students operationalize “AI literacy improved,” then read the interval visually and state a cautious one-sentence result with population, comparison, magnitude, and uncertainty. Do not interpret the interval as a probability about this fixed interval.",
    sourceSlides: [],
  },
  {
    eyebrow: "Extraction / Limitations and transferability",
    title: "Limitations constrain the claim; transferability asks what must match elsewhere",
    content: (
      <div className="m25-transfer">
        <section>
          <span>Internal validity</span>
          <p>Could selection, attrition, measurement, instructor, history, or analysis explain the observed result?</p>
          <div>{["selection", "attrition", "measurement", "confounding"].map(item => <b key={item}>{item}</b>)}</div>
        </section>
        <section>
          <span>Transfer conditions</span>
          <p>Which population, setting, implementation, technology, language, duration, and outcome features must be similar?</p>
          <div>{["learners", "setting", "support", "duration"].map(item => <b key={item}>{item}</b>)}</div>
        </section>
        <aside>
          <strong>Cautious transfer sentence</strong>
          <blockquote>The result may inform similar short undergraduate courses with comparable support; evidence for other ages, settings, or sustained outcomes was not reported.</blockquote>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Students name one internal-validity threat and one transfer condition. Correct the misconception that listing a limitation makes the result unusable.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 7 / Evidence classes",
    title: "Label whose claim it is—and what the source cannot tell you",
    content: (
      <div className="m25-evidence-classes">
        {[
          ["Author report", "Directly stated or shown by the paper", "“The authors report a 2.4-point adjusted difference.”", "#dff4ee"],
          ["Reviewer inference", "Reasoned interpretation not stated verbatim", "“The short duration may limit evidence about retention.”", "#e5edff"],
          ["Missing / unclear", "Needed information is not reported or cannot be located", "“Accessibility accommodations were not reported.”", "#fff2d5"],
          ["Unsupported", "The design or source does not warrant the claim", "“The activity works for all learners.”", "#ffe6e8"],
        ].map(([label, definition, example, color]) => (
          <article key={label} style={{ borderTopColor: color }}>
            <span>{label}</span><p>{definition}</p><blockquote>{example}</blockquote>
          </article>
        ))}
        <aside><strong>Do not convert “not reported” into “did not happen.”</strong></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Read four statements aloud; students hold up 1–4 for the evidence class. Discuss missing versus unsupported.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked example / Paper annotation",
    title: "Annotate the source before writing the summary",
    content: <PaperAnnotationLab />,
    note: "Timing: 4 minutes. This is a constructed teaching excerpt, not a published study. Cycle through all four sections. Students identify one extractable fact and one prohibited overclaim from each.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 8 / Claim-to-source matrix",
    title: "The matrix is the evidence brief’s test harness",
    content: (
      <div className="m25-matrix">
        <header><span>Candidate claim</span><span>Class</span><span>Locator</span><span>Qualification</span><span>Status</span></header>
        {[
          ["104 of 120 students completed the posttest.", "author report", "Results p. 7", "analysis excludes 16 enrolled learners", "trace"],
          ["Adjusted difference was 2.4 points.", "author report", "Table 2", "95% CI [0.6, 4.2]", "trace"],
          ["The activity caused the difference.", "unsupported", "none", "intact sections; no random assignment", "reject"],
          ["Accessibility support was available.", "missing", "none found", "record as not reported", "hold"],
        ].map(([claim, kind, locator, qualification, status]) => (
          <article key={claim}><p>{claim}</p><b>{kind}</b><code>{locator}</code><small>{qualification}</small><strong className={status}>{status}</strong></article>
        ))}
        <aside><strong>Minimum assignment trace:</strong><p>at least six material claims with page, section, table, or figure locations.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Walk one row left to right. Ask students which column prevents a true number from becoming a misleading statement.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive practice / Trace audit",
    title: "Can a second reader recover the claim?",
    content: <TraceAuditLab />,
    note: "Timing: 4 minutes. Run all three cases. Students state what they would change before a second reader receives the matrix.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 9 / AAB candidate field map",
    title: "Map evidence into fields without filling gaps from imagination",
    content: (
      <div className="m25-field-map">
        {[
          ["Learner profile", "population, prior experience, access needs"],
          ["Setting", "institution, course, modality, duration"],
          ["Educational intent", "knowledge, skill, disposition, or decision"],
          ["Activity / intervention", "what learners and facilitators did"],
          ["Outcomes", "measure, time point, magnitude, uncertainty"],
          ["Challenges", "implementation barriers and evidence limitations"],
          ["Safeguards", "privacy, accessibility, oversight, or not reported"],
          ["Evidence type", "design, comparison, sample, data source"],
          ["Transferability", "conditions that may or may not generalize"],
          ["Operations", "cost, staffing, technology, when reported"],
          ["Confidence", "high / medium / low with a reason"],
        ].map(([field, evidence], index) => (
          <article key={field}><span>{String(index + 1).padStart(2, "0")}</span><strong>{field}</strong><p>{evidence}</p></article>
        ))}
        <aside><strong>Field rule:</strong><p>reported value, reviewer inference, or explicitly missing—never silent completion.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Assign each table group two fields to populate from the constructed excerpt. Require an evidence class and locator for every filled value.",
    sourceSlides: [],
  },
  {
    eyebrow: "Evidence-card audit / Public AAB case",
    title: "Audit the AI Audit case as a registry record—not as an endorsement",
    content: (
      <div className="m25-case-audit">
        <section>
          <span>AAB-CASE-2026-RV-116</span>
          <h3>AI Audit: A Card Game to Reflect on Everyday AI Systems</h3>
          <p>Use the public record to locate its source-publication identity, evidence fields, transferability statements, missing information, and confidence labels.</p>
          <a href="https://www.aaboard.org/cases/AAB-CASE-2026-RV-116" rel="noreferrer" target="_blank">Open current public case ↗</a>
        </section>
        <div>
          {[
            ["Identity", "Does the card point to the exact primary source and version?"],
            ["Trace", "Can each material result be located in the source?"],
            ["Boundary", "Are author reports separated from reviewer interpretation?"],
            ["Missing", "Which absent implementation or outcome details are explicit?"],
            ["Transfer", "What must be similar before applying the evidence elsewhere?"],
          ].map(([label, question], index) => <article key={label}><span>{index + 1}</span><strong>{label}</strong><p>{question}</p></article>)}
        </div>
        <aside><strong>Audit output:</strong><p>one verified match, one qualification, one missing field, and one proposed revision.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Open the live case if connectivity allows. Students do not judge whether they like the activity; they audit traceability and field discipline.",
    sourceSlides: [],
  },
  {
    eyebrow: "Comparative card audit / Public AAB case",
    title: "A second case tests whether your review rules transfer",
    content: (
      <div className="m25-case-compare">
        <section>
          <span>AAB-CASE-2026-RV-065</span>
          <h3>Artificial Intelligence for Future Presidents: Teaching AI Literacy to Everyone</h3>
          <a href="https://www.aaboard.org/cases/AAB-CASE-2026-RV-065" rel="noreferrer" target="_blank">Open current public case ↗</a>
        </section>
        <div className="m25-compare-axis">
          {[
            ["Population", "Who participated—not who might someday use it"],
            ["Intent", "Which AI-literacy capability is claimed?"],
            ["Outcome", "What was measured versus merely described?"],
            ["Evidence type", "Which design supports which verbs?"],
            ["Transfer", "What does “everyone” mean in the evidence?"],
          ].map(([axis, prompt]) => <article key={axis}><strong>{axis}</strong><p>{prompt}</p></article>)}
        </div>
        <aside>
          <span>Partner comparison</span>
          <p>Apply the same five audit questions used for RV-116. If your rules change only because the title is compelling, revise the rules.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Pairs compare the two public records using identical criteria. Ask which case title creates the stronger temptation to overgeneralize.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 10 / Second-reader reproducibility",
    title: "A review is reproducible when another reader can recover the judgment",
    content: (
      <div className="m25-second-reader">
        <section>
          <span>Reviewer 1 submits</span>
          <ul><li>exact citation and accessible source</li><li>search and screening record</li><li>claim matrix and field map</li><li>qualifications and proposed disposition</li></ul>
        </section>
        <div aria-hidden="true"><b>R1</b><i>⇄</i><b>R2</b></div>
        <section>
          <span>Reviewer 2 attempts</span>
          <ul><li>resolve bibliographic identity</li><li>locate every material claim</li><li>reproduce evidence classes</li><li>note disagreements without guessing intent</li></ul>
        </section>
        <aside>
          <strong>Agreement target</strong>
          <p>Every material claim is recoverable. Disagreements point to a field, locator, inference, or rule that can be revised.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Conduct a two-minute swap: each student gives one matrix row to a partner, who attempts to recover the claim without verbal help.",
    sourceSlides: [],
  },
  {
    eyebrow: "Editorial judgment / Disposition",
    title: "Accept, revise, hold, and reject describe evidence states",
    content: <DispositionLab />,
    note: "Timing: 3 minutes. Cycle through all dispositions. Emphasize that reject is not a judgment about the student or topic; it is a reasoned decision about this evidence object.",
    sourceSlides: [],
  },
  {
    eyebrow: "Studio practice / Deliverables and rubric",
    title: "Build the submission package while the evidence is still visible",
    content: (
      <div className="m25-studio">
        <section>
          <span>Studio / 12-minute assignment work block</span>
          <ol>
            <li>Write the five-field question and one inclusion rule.</li>
            <li>Record one database query, date, filters, and hit count.</li>
            <li>Verify one candidate paper’s bibliographic identity.</li>
            <li>Draft two claim-to-source rows and swap with a second reader.</li>
            <li>Choose one field-map entry and proposed disposition.</li>
          </ol>
        </section>
        <div>
          <span>Minimum deliverables</span>
          {[
            ["Brief", "800–1,200 words"],
            ["Trace", "at least 6 material claims"],
            ["Map", "completed AAB candidate fields"],
            ["Limits", "missing information + transfer conditions"],
            ["Note", "150-word editorial recommendation"],
          ].map(([label, detail]) => <article key={label}><strong>{label}</strong><p>{detail}</p></article>)}
        </div>
        <aside>
          <span>Rubric / 100</span>
          {[
            ["Source + identity", "15"],
            ["Design reasoning", "20"],
            ["Trace accuracy", "25"],
            ["Field map + transfer", "15"],
            ["Limits + nonendorsement", "15"],
            ["Clarity + reproducibility", "10"],
          ].map(([label, points]) => <b key={label}>{label}<i>{points}</i></b>)}
        </aside>
      </div>
    ),
    note: "Timing: 4 minutes of deck-guided setup; continue the 12-minute studio while this page remains visible and draw remaining work time from transitions/discussion as needed. Check that every pair completes a trace swap.",
    sourceSlides: [],
  },
  {
    eyebrow: "Formative assessment / Exit ticket / Readings",
    title: "Evidence becomes useful when claims remain recoverable and bounded",
    content: (
      <div className="m25-exit">
        <section>
          <span>Exit ticket / submit before leaving</span>
          <ol>
            <li>Rewrite one causal claim so it matches a correlational or quasi-experimental design.</li>
            <li>Name one material claim and its exact source locator.</li>
            <li>Choose accept, revise, hold, or reject—and give the evidence reason.</li>
          </ol>
          <blockquote>Do not ask only, “Is the claim in the paper?” Ask, “Whose claim is it, where is it, what supports it, and where does it stop?”</blockquote>
        </section>
        <section>
          <span>Current AAB and scholarly-source reading set</span>
          <ul>
            <li><a href="https://www.aaboard.org/" rel="noreferrer" target="_blank">AAB · public evidence workflow</a></li>
            <li><a href="https://www.aaboard.org/cases/AAB-CASE-2026-RV-116" rel="noreferrer" target="_blank">AAB · AI Audit public case</a></li>
            <li><a href="https://www.aaboard.org/cases/AAB-CASE-2026-RV-065" rel="noreferrer" target="_blank">AAB · Future Presidents public case</a></li>
            <li><a href="https://www.doi.org/the-identifier/what-is-a-doi/" rel="noreferrer" target="_blank">DOI Foundation · What is a DOI?</a></li>
            <li><a href="https://www.equator-network.org/" rel="noreferrer" target="_blank">EQUATOR Network · Reporting guidelines</a></li>
          </ul>
          <p>Bring to Meeting 26: one CPSC 481 concept you want to explain to a defined nontechnical audience age five or older.</p>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Collect the three-part exit ticket. Confirm Assignment A submission components and remind students that publication is optional, separately reviewed, and unrelated to the course grade. The 25 slide timings total exactly 75 minutes.",
    sourceSlides: [],
  },
];

export function Meeting25Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Module 9 · Lesson 11"
      meetingTitle="AAB Evidence Practicum: Finding and Reviewing Research"
      slides={slides}
      sourceCollectionLabel="Current AAB and scholarly-source reading set"
    />
  );
}
