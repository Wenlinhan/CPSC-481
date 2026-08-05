"use client";

/* eslint-disable @next/next/no-img-element -- static course assets must remain full-fit in the presentation canvas */

import {
  type ReactNode,
  type TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type SlideRecord = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
  note: string;
  minutes: number;
};

const retrievalDocs = [
  {
    id: "D1",
    score: 0.91,
    label: "Course catalog",
    text: "CPSC 481 introduces intelligent agents, search, uncertainty, machine learning, and contemporary AI systems.",
    relevant: false,
  },
  {
    id: "D2",
    score: 0.88,
    label: "Syllabus",
    text: "The Research Evidence Brief is submitted through Canvas and is worth 6% of the course grade.",
    relevant: true,
  },
  {
    id: "D3",
    score: 0.73,
    label: "Assignment page",
    text: "The evidence brief requires source trace, methods, findings, limitations, and supported-versus-unsupported claims.",
    relevant: true,
  },
];

function Tag({ children, tone = "blue" }: { children: ReactNode; tone?: string }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

function Callout({
  title,
  children,
  tone = "blue",
}: {
  title: string;
  children: ReactNode;
  tone?: string;
}) {
  return (
    <div className={`callout callout-${tone}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

function Pipeline() {
  const stages = [
    ["1", "Prepare", "Documents → chunks"],
    ["2", "Represent", "Chunks → searchable index"],
    ["3", "Retrieve", "Query → candidate evidence"],
    ["4", "Assemble", "Instructions + evidence"],
    ["5", "Generate", "Answer + citations"],
    ["6", "Evaluate", "Retrieval + answer quality"],
  ];

  return (
    <div className="pipeline" aria-label="Six-stage RAG pipeline">
      {stages.map(([number, title, detail], index) => (
        <div className="pipeline-stage-wrap" key={number}>
          <div className="pipeline-stage">
            <span className="stage-number">{number}</span>
            <strong>{title}</strong>
            <small>{detail}</small>
          </div>
          {index < stages.length - 1 && (
            <span className="pipeline-arrow" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function StrategyCompare() {
  const rows = [
    ["RAG", "Changing or private facts", "External evidence at inference time"],
    ["Fine-tuning", "Behavior, style, or repeated task patterns", "Model parameters"],
    ["Long context", "A bounded set of documents already in hand", "One large prompt"],
  ];

  return (
    <div className="strategy-grid">
      <div className="strategy-table">
        <div className="strategy-row strategy-head">
          <span>Approach</span><span>Best fit</span><span>What changes?</span>
        </div>
        {rows.map((row) => (
          <div className="strategy-row" key={row[0]}>
            <strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span>
          </div>
        ))}
        <Callout title="Often combined" tone="gold">
          A tuned model can still retrieve, and a RAG system still uses a context window.
        </Callout>
      </div>
      <div className="video-card">
        <div className="video-frame">
          <iframe
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
            src="https://video.ibm.com/embed/recorded/133019817"
            title="IBM: Introduction to retrieval-augmented generation"
          />
        </div>
        <div className="video-caption">
          <span className="micro-label">Optional explainer · 3 minutes</span>
          <p>Listen for the distinction between model memory and retrieved knowledge.</p>
          <a href="https://video.ibm.com/recorded/133019817" target="_blank" rel="noreferrer">
            Open the IBM video ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function EmbeddingScene() {
  return (
    <div className="embedding-scene" aria-label="Animated two-dimensional intuition for embedding similarity">
      <div className="axis axis-x" />
      <div className="axis axis-y" />
      <div className="vector-query">
        <span>q</span>
        <small>“When is the brief due?”</small>
      </div>
      <div className="vector-point point-a"><span>D2</span><small>due week</small></div>
      <div className="vector-point point-b"><span>D3</span><small>requirements</small></div>
      <div className="vector-point point-c"><span>D1</span><small>course description</small></div>
      <div className="similarity-ring ring-one" />
      <div className="similarity-ring ring-two" />
    </div>
  );
}

function SimilarityVisual() {
  const rows = [
    ["D2 · syllabus", 0.88, "nearest"],
    ["D3 · assignment", 0.73, "useful"],
    ["D1 · catalog", 0.41, "distractor"],
  ];
  return (
    <div className="similarity-visual">
      <div className="similarity-formula">
        <span>cosine similarity</span>
        <strong>cos(θ) = q · d / ‖q‖‖d‖</strong>
        <small>Direction matters more than vector length.</small>
      </div>
      <div className="score-bars">
        {rows.map(([label, score, status]) => (
          <div className="score-row" key={String(label)}>
            <div><strong>{label}</strong><span>{Number(score).toFixed(2)} · {status}</span></div>
            <i><b style={{ width: `${Number(score) * 100}%` }} /></i>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParsingVisual() {
  const [mode, setMode] = useState<"raw" | "structured">("raw");

  return (
    <div className="parsing-lab">
      <div className="lab-header">
        <div>
          <span className="micro-label">Parsing demo</span>
          <h3>Same PDF, different retrieval units</h3>
        </div>
        <div className="segmented" aria-label="Select parsing mode">
          {(["raw", "structured"] as const).map((value) => (
            <button
              aria-pressed={mode === value}
              className={mode === value ? "active" : ""}
              key={value}
              onClick={() => setMode(value)}
              type="button"
            >
              {value === "raw" ? "Raw text" : "Structure-aware"}
            </button>
          ))}
        </div>
      </div>
      <div className={`document-preview ${mode}`}>
        <div className="document-page" aria-label="A two-column course policy page">
          <span className="doc-kicker">CPSC 481 · Course policy</span>
          <h4>Research Evidence Brief</h4>
          <div className="doc-columns">
            <p><b>Submission</b><br />Upload the completed brief through Canvas.</p>
            <p><b>Required evidence</b><br />Source trace, methods, findings, and limitations.</p>
          </div>
          <div className="doc-footer">CPSC 481 · page 7</div>
        </div>
        <div className="parse-output">
          {mode === "raw" ? (
            <>
              <span className="parse-bad">481 7 Deadline Required evidence CPSC</span>
              <span className="parse-bad">Upload completed source trace brief methods through findings Canvas limitations</span>
              <small>Columns interleave; headers and footers become noise.</small>
            </>
          ) : (
            <>
              <span><b>section:</b> Research Evidence Brief</span>
              <span><b>submission:</b> Upload the completed brief through Canvas.</span>
              <span><b>requirements:</b> Source trace, methods, findings, limitations.</span>
              <small>Reading order and section identity survive extraction.</small>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ChunkingLab() {
  const [strategy, setStrategy] = useState<"fixed" | "structure">("fixed");
  const [overlap, setOverlap] = useState(false);

  return (
    <div className="chunk-lab">
      <div className="lab-header">
        <div>
          <span className="micro-label">Chunking demo</span>
          <h3>Can one chunk answer the question?</h3>
        </div>
        <div className="chunk-controls">
          <div className="segmented" aria-label="Select chunking strategy">
            {(["fixed", "structure"] as const).map((value) => (
              <button
                aria-pressed={strategy === value}
                className={strategy === value ? "active" : ""}
                key={value}
                onClick={() => setStrategy(value)}
                type="button"
              >
                {value === "fixed" ? "120 tokens" : "By section"}
              </button>
            ))}
          </div>
          <button
            aria-pressed={overlap}
            className={`overlap-toggle ${overlap ? "active" : ""}`}
            onClick={() => setOverlap((value) => !value)}
            type="button"
          >
            {overlap ? "20-token overlap" : "No overlap"}
          </button>
        </div>
      </div>
      <p className="query"><span>Question</span>Where is the evidence brief submitted, and what must it include?</p>
      <div className={`chunk-output ${strategy} ${overlap ? "with-overlap" : ""}`}>
        {strategy === "fixed" ? (
          <>
            <article><b>Chunk A</b><p>…Evidence Brief. Upload the completed brief through Canvas. The next assignment…</p></article>
            <article><b>Chunk B</b><p>…requires source trace, methods, findings, limitations, and supported claims…</p></article>
            <article className="distractor"><b>Chunk C</b><p>Late work and course catalog information…</p></article>
          </>
        ) : (
          <>
            <article className="complete"><b>Research Evidence Brief</b><p>Submit through Canvas. Include source trace, methods, findings, limitations, and supported-versus-unsupported claims.</p></article>
            <article className="distractor"><b>Late work</b><p>Policies for extensions and documented emergencies…</p></article>
          </>
        )}
      </div>
      <div className={`lab-verdict ${strategy === "structure" || overlap ? "success" : "warning"}`}>
        <strong>{strategy === "structure" ? "Semantic boundary preserved" : overlap ? "Boundary repaired, with duplication" : "Answer split across a boundary"}</strong>
        <span>
          {strategy === "structure"
            ? "One retrievable unit contains the complete policy."
            : overlap
              ? "Overlap improves continuity but increases index size and repeated context."
              : "Top-k must recover two chunks before the generator can answer both parts."}
        </span>
      </div>
    </div>
  );
}

function VectorIndexVisual() {
  return (
    <div className="index-layout">
      <div className="index-map" aria-label="Vector index search path">
        <div className="index-query">q</div>
        {[
          ["D2", "near", "syllabus"],
          ["D3", "near", "assignment"],
          ["D7", "mid", "calendar"],
          ["D1", "far", "catalog"],
          ["D9", "far", "parking"],
        ].map(([id, distance, label], index) => (
          <div className={`index-node ${distance} node-${index + 1}`} key={id}>
            <b>{id}</b><small>{label}</small>
          </div>
        ))}
        <i className="search-radius radius-a" />
        <i className="search-radius radius-b" />
      </div>
      <div className="index-copy">
        <span className="micro-label">Search structure</span>
        <h3>An index avoids comparing every vector</h3>
        <ol>
          <li><b>Insert</b><span>Store vector + chunk ID + metadata.</span></li>
          <li><b>Navigate</b><span>Approximate nearest-neighbor search visits promising regions.</span></li>
          <li><b>Return</b><span>Resolve top-k IDs back to readable chunks.</span></li>
        </ol>
        <Callout title="Engineering tradeoff" tone="gold">
          Exact search maximizes recall but scales poorly. Approximate search trades a little recall for speed and memory efficiency.
        </Callout>
      </div>
    </div>
  );
}

function MismatchVisual() {
  const [approach, setApproach] = useState<"literal" | "semantic" | "rewrite">("literal");
  const result = {
    literal: ["Low match", "“turn in” does not occur in the policy.", "warning"],
    semantic: ["Useful match", "Embedding proximity links “turn in” with “submit.”", "success"],
    rewrite: ["Sharper query", "“evidence brief submission deadline requirements”", "success"],
  }[approach];

  return (
    <div className="mismatch-layout">
      <div className="mismatch-pair">
        <div><span>Student language</span><strong>“Where do I upload the brief, and what goes with it?”</strong></div>
        <div><span>Document language</span><strong>“Submission channel: Canvas. Required evidence: …”</strong></div>
        <div className="vocabulary-gap" aria-hidden="true">≠</div>
      </div>
      <div className="mismatch-demo">
        <div className="segmented" aria-label="Select mismatch strategy">
          {([
            ["literal", "Keyword"],
            ["semantic", "Dense"],
            ["rewrite", "Rewrite"],
          ] as const).map(([value, label]) => (
            <button
              aria-pressed={approach === value}
              className={approach === value ? "active" : ""}
              key={value}
              onClick={() => setApproach(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className={`mismatch-result ${result[2]}`}>
          <strong>{result[0]}</strong>
          <p>{result[1]}</p>
        </div>
        <small>Vocabulary mismatch is a retrieval problem, not a generation problem.</small>
      </div>
    </div>
  );
}

function RerankVisual() {
  return (
    <div className="rerank-flow">
      <div className="candidate-stack">
        <span className="micro-label">Fast retriever · top 50</span>
        {["D8 · 0.92", "D2 · 0.88", "D1 · 0.84", "D3 · 0.73"].map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
      <div className="funnel" aria-hidden="true"><span>rerank</span></div>
      <div className="candidate-stack final-stack">
        <span className="micro-label">Cross-encoder · top 3</span>
        {["D2 · syllabus", "D3 · assignment", "D8 · calendar"].map((item, index) => (
          <div key={item}><b>{index + 1}</b>{item}</div>
        ))}
      </div>
      <div className="filter-chips">
        <span>course = CPSC 481</span><span>term = current</span><span>access = student</span>
      </div>
    </div>
  );
}

function RetrievalLab() {
  const [topK, setTopK] = useState(1);
  const selected = retrievalDocs.slice(0, topK);
  const hasDueDate = selected.some((doc) => doc.id === "D2");
  const hasRequirements = selected.some((doc) => doc.id === "D3");
  const hasCompleteEvidence = hasDueDate && hasRequirements;

  return (
    <div className="lab">
      <div className="lab-header">
        <div>
          <span className="micro-label">Live retrieval model</span>
          <h3>What changes when top-k changes?</h3>
        </div>
        <div className="segmented" aria-label="Select number of retrieved chunks">
          {[1, 2, 3].map((value) => (
            <button
              aria-pressed={topK === value}
              className={topK === value ? "active" : ""}
              key={value}
              onClick={() => setTopK(value)}
              type="button"
            >
              k = {value}
            </button>
          ))}
        </div>
      </div>
      <p className="query">
        <span>Query</span> When is the research evidence brief due, and what must it include?
      </p>
      <div className="retrieval-controls" aria-label="Metadata filters applied before search">
        <span>course = CPSC 481</span>
        <span>term = current</span>
        <span>access = student</span>
        <small>Filter first, then rank the permitted subset.</small>
      </div>
      <div className="retrieval-results">
        {selected.map((doc) => (
          <article className={doc.relevant ? "result relevant" : "result"} key={doc.id}>
            <div className="result-meta">
              <span>{doc.id} · {doc.label}</span>
              <strong>{doc.score.toFixed(2)}</strong>
            </div>
            <p>{doc.text}</p>
          </article>
        ))}
      </div>
      <div className={`lab-verdict ${hasCompleteEvidence ? "success" : "warning"}`} aria-live="polite">
        <strong>{hasCompleteEvidence ? "Enough evidence to answer" : hasDueDate ? "Partial evidence only" : "Retrieval failure"}</strong>
        <span>
          {hasCompleteEvidence
            ? "The generator now has both the due week and required elements."
            : hasDueDate
              ? "The due week is available, but the required elements are still missing."
            : "The highest-scoring chunk is topically related but does not answer the question."}
        </span>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  question,
  examples,
}: {
  label: string;
  question: string;
  examples: string;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <h3>{question}</h3>
      <p>{examples}</p>
    </article>
  );
}

export function RagDeck() {
  const [current, setCurrent] = useState(0);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [printAll, setPrintAll] = useState(false);

  const slides: SlideRecord[] = useMemo(
    () => [
      {
        eyebrow: "Module 14 · Lesson 21",
        minutes: 2,
        title: "RAG Foundations",
        subtitle: "Retrieval-Augmented Generation as an evidence pipeline",
        content: (
          <div className="hero-layout">
            <div className="hero-copy">
              <div className="tag-row">
                <Tag>75-minute class</Tag>
                <Tag tone="gold">CPSC 481</Tag>
              </div>
              <p className="big-question">
                How can an LLM answer with information it was not trained to remember?
              </p>
              <div className="hero-rule" />
              <p className="quiet">
                Retrieval changes the model&apos;s input—not its parameters.
              </p>
            </div>
            <div className="memory-contrast" aria-label="Parametric and retrieved memory">
              <div className="memory-card parametric">
                <span>Parametric memory</span>
                <strong>Model weights</strong>
                <small>Broad patterns · expensive to update</small>
              </div>
              <div className="plus" aria-hidden="true">+</div>
              <div className="memory-card retrieved">
                <span>Non-parametric memory</span>
                <strong>Retrieved evidence</strong>
                <small>Specific sources · updated independently</small>
              </div>
            </div>
          </div>
        ),
        note:
          "Open with the contrast between what a model has encoded in its weights and what can be supplied at inference time. Ask students for one situation where model memory is insufficient.",
      },
      {
        eyebrow: "Learning objectives",
        minutes: 1,
        title: "By the end of class, you can…",
        content: (
          <div className="objective-grid">
            {[
              ["01", "Trace", "a question through the complete RAG pipeline."],
              ["02", "Explain", "parsing, chunking, embeddings, and vector search."],
              ["03", "Control", "retrieval with top-k, filters, and metadata."],
              ["04", "Diagnose", "the earliest broken stage from observable evidence."],
            ].map(([number, verb, detail]) => (
              <article className="objective-card" key={number}>
                <span>{number}</span>
                <h3>{verb}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        ),
        note:
          "Ask students to point to the objective they expect to be hardest. The 75-minute plan reserves the longest block for guided system design.",
      },
      {
        eyebrow: "The problem",
        minutes: 3,
        title: "A fluent answer is not necessarily an informed answer",
        content: (
          <div className="split">
            <div>
              <div className="failure-stack">
                {[
                  ["Knowledge cutoff", "The needed fact may postdate training."],
                  ["Private or local data", "The fact may never have been in training data."],
                  ["Source ambiguity", "The model may blend incompatible sources."],
                  ["No evidence trail", "A plausible claim may be hard to verify."],
                ].map(([label, text]) => (
                  <div className="failure-row" key={label}>
                    <span aria-hidden="true">×</span>
                    <div><strong>{label}</strong><small>{text}</small></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="definition-panel">
              <span className="micro-label">Working definition</span>
              <p>
                <strong>RAG</strong> retrieves external evidence at inference time and
                conditions a generator on that evidence.
              </p>
              <Callout title="Important" tone="gold">
                RAG can reduce unsupported answers, but it does not guarantee truth.
              </Callout>
            </div>
          </div>
        ),
        note:
          "Emphasize that RAG is an architecture pattern, not a truth machine. A bad corpus, weak retrieval, or unfaithful generator can still produce a wrong answer.",
      },
      {
        eyebrow: "Architecture choice",
        minutes: 3,
        title: "RAG is one tool—not the answer to every problem",
        subtitle: "Choose the mechanism that matches what must change",
        content: <StrategyCompare />,
        note:
          "Use the table to prevent an overly broad claim that RAG replaces fine-tuning or long-context prompting. Play only the opening of the optional video if class time allows.",
      },
      {
        eyebrow: "System view",
        minutes: 3,
        title: "RAG is a pipeline, not a single model",
        content: (
          <div className="pipeline-slide">
            <Pipeline />
            <div className="system-boundary">
              <div>
                <span>Offline / ingestion</span>
                <strong>Prepare · represent · index</strong>
              </div>
              <div>
                <span>Online / inference</span>
                <strong>Retrieve · assemble · generate</strong>
              </div>
              <div>
                <span>Continuous</span>
                <strong>Evaluate · observe · improve</strong>
              </div>
            </div>
            <p className="takeaway">
              Every boundary creates a measurable failure mode.
            </p>
          </div>
        ),
        note:
          "Walk left to right. Ask which stages require an LLM. Retrieval can use learned encoders, but the pipeline is not simply 'ask one LLM twice.'",
      },
      {
        eyebrow: "Worked example · 1 of 3",
        minutes: 3,
        title: "Build a governed course-policy corpus",
        content: (
          <div className="media-split">
            <figure className="photo-card">
              <img
                alt="Rows of Wikimedia servers that physically store digital knowledge"
                src="/media/wikimedia-servers.jpg"
              />
              <figcaption>
                Wikimedia servers · Helpameout · CC BY-SA 3.0
              </figcaption>
            </figure>
            <div className="governance-list">
              {[
                ["Authority", "Which sources are trusted enough to answer from?"],
                ["Freshness", "How will updates invalidate stale chunks and indexes?"],
                ["Identity", "Can every chunk resolve to an immutable source and version?"],
                ["Permission", "May this user retrieve this passage at this moment?"],
              ].map(([label, text]) => (
                <article key={label}><span>{label}</span><p>{text}</p></article>
              ))}
              <Callout title="Garbage in, fluent garbage out" tone="gold">
                Retrieval cannot recover evidence that is absent, outdated, misparsed, or inaccessible.
              </Callout>
            </div>
          </div>
        ),
        note:
          "Introduce the worked example used through the lesson: a course-policy assistant built from the syllabus and assignment pages. RAG quality starts with document ownership, update policy, identity, and permissions—not with vector search.",
      },
      {
        eyebrow: "Ingestion",
        minutes: 3,
        title: "Before retrieval: make evidence retrievable",
        content: (
          <div className="ingestion-grid">
            <article>
              <span className="step-chip">1 · Collect</span>
              <h3>Choose authoritative sources</h3>
              <p>Record origin, date, permissions, and document identity.</p>
            </article>
            <article>
              <span className="step-chip">2 · Parse</span>
              <h3>Preserve structure</h3>
              <p>Extract text without losing headings, tables, page numbers, or code boundaries.</p>
            </article>
            <article>
              <span className="step-chip">3 · Chunk</span>
              <h3>Create retrieval units</h3>
              <p>Balance semantic completeness against focused matching.</p>
            </article>
            <article>
              <span className="step-chip">4 · Enrich</span>
              <h3>Attach metadata</h3>
              <p>Add title, section, author, time, access group, and source URL.</p>
            </article>
            <div className="chunk-spectrum">
              <span>Smaller chunks</span>
              <div className="spectrum-line">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <span>Larger chunks</span>
              <small>precise but fragmented</small>
              <small>coherent but less focused</small>
            </div>
          </div>
        ),
        note:
          "Explain why chunk size is not a universal constant. Code, policy documents, FAQs, and scientific papers each have different semantic boundaries.",
      },
      {
        eyebrow: "Document parsing",
        minutes: 3,
        title: "A PDF is a layout—not a clean text stream",
        subtitle: "Retrieval begins with reading order, structure, and provenance",
        content: <ParsingVisual />,
        note:
          "Toggle raw text and structure-aware parsing. Ask students why a visually correct PDF can yield scrambled text. Name common hazards: two columns, repeated headers, scanned pages requiring OCR, tables, equations, and code blocks.",
      },
      {
        eyebrow: "Structure-aware chunking",
        minutes: 4,
        title: "Chunk around meaning, not just a token count",
        content: (
          <div className="chunk-principles">
            <div className="section-document">
              <div className="section-title">Research Evidence Brief</div>
              <div className="section-block identity"><span>metadata</span><b>course · term · page · section · access</b></div>
              <div className="section-block"><span>submission</span><b>Canvas upload · completed brief</b></div>
              <div className="section-block complete"><span>requirements</span><b>source trace · methods · findings · limitations</b></div>
              <div className="section-block"><span>rubric</span><b>evidence quality · claim discipline</b></div>
            </div>
            <div className="chunk-rules">
              {[
                ["Respect boundaries", "Keep a heading with the paragraphs, table, or code it governs."],
                ["Carry identity", "Attach document ID, section path, version, page, and access metadata."],
                ["Test complete questions", "A useful chunk should preserve enough context to answer a target question."],
                ["Tune by evidence", "Measure retrieval on representative questions; do not copy a universal chunk size."],
              ].map(([label, text], index) => (
                <article key={label}><span>{index + 1}</span><div><strong>{label}</strong><p>{text}</p></div></article>
              ))}
            </div>
          </div>
        ),
        note:
          "Contrast fixed windows with document-aware splitters. A token limit remains necessary, but headings, paragraph groups, tables, and code boundaries should guide the first cut.",
      },
      {
        eyebrow: "Interactive checkpoint",
        minutes: 4,
        title: "Chunk size and overlap trade precision for continuity",
        content: <ChunkingLab />,
        note:
          "Have students predict the result before toggling each control. Smaller chunks are focused but may fragment an answer. Larger chunks preserve context but add noise. Overlap can repair boundaries while increasing duplication, cost, and repeated evidence.",
      },
      {
        eyebrow: "Representation",
        minutes: 3,
        title: "Embeddings turn meaning into a neighborhood",
        content: (
          <div className="embedding-layout">
            <EmbeddingScene />
            <div className="embedding-copy">
              <span className="micro-label">Visual intuition—not literal geography</span>
              <h3>Nearby vectors express similar use in context</h3>
              <p>
                An encoder maps the query and each chunk to fixed-length vectors.
                Search then finds passages whose vectors point in similar directions.
              </p>
              <ul>
                <li>Same embedding model for queries and passages</li>
                <li>Normalize vectors when the similarity metric expects it</li>
                <li>Re-index when the model or chunking strategy changes</li>
              </ul>
            </div>
          </div>
        ),
        note:
          "Tell students the two-dimensional picture is a projection for intuition. Real embeddings have hundreds or thousands of dimensions and proximity does not explain why a result is relevant.",
      },
      {
        eyebrow: "Retrieval",
        minutes: 3,
        title: "Three ways to find evidence",
        content: (
          <div className="retriever-grid">
            <article className="retriever sparse">
              <Tag tone="gray">Lexical</Tag>
              <h3>Sparse retrieval</h3>
              <p>Matches weighted terms. BM25 is strong when exact words, identifiers, or rare names matter.</p>
              <code>query terms ↔ document terms</code>
              <small>Strength: exactness · Risk: vocabulary mismatch</small>
            </article>
            <article className="retriever dense">
              <Tag>Semantic</Tag>
              <h3>Dense retrieval</h3>
              <p>Embeds queries and passages into vectors and ranks them by similarity.</p>
              <code>sim(q, d) = cos(e(q), e(d))</code>
              <small>Strength: paraphrase · Risk: opaque near-neighbors</small>
            </article>
            <article className="retriever hybrid">
              <Tag tone="gold">Combined</Tag>
              <h3>Hybrid retrieval</h3>
              <p>Fuses lexical and dense rankings, often followed by a more expensive reranker.</p>
              <code>retrieve wide → rerank narrow</code>
              <small>Strength: coverage · Risk: more tuning and cost</small>
            </article>
          </div>
        ),
        note:
          "Do not frame dense retrieval as an automatic replacement for BM25. Ask for examples where an exact course number or API name should dominate semantic similarity.",
      },
      {
        eyebrow: "Vector search",
        minutes: 3,
        title: "Similarity creates a ranking—not a truth score",
        content: (
          <div className="similarity-layout">
            <SimilarityVisual />
            <div className="ranking-notes">
              <Callout title="A score is local to the setup">
                It depends on the embedding model, metric, corpus, index settings, and query.
              </Callout>
              <ol>
                <li><span>1</span><p><strong>Encode</strong> the query with the same model.</p></li>
                <li><span>2</span><p><strong>Search</strong> exact or approximate neighbors.</p></li>
                <li><span>3</span><p><strong>Select</strong> top-k, then filter or rerank.</p></li>
              </ol>
            </div>
          </div>
        ),
        note:
          "Stress that 0.88 is not 88 percent relevant. Similarity scores are useful for ordering candidates and must be calibrated empirically for the specific application.",
      },
      {
        eyebrow: "Vector index",
        minutes: 3,
        title: "Search the neighborhood without scanning the corpus",
        content: <VectorIndexVisual />,
        note:
          "Keep index internals conceptual: vectors and metadata are stored behind stable chunk IDs, approximate search visits promising neighborhoods, and returned IDs resolve to readable evidence. HNSW details belong in an advanced systems course.",
      },
      {
        eyebrow: "Worked example · 2 of 3",
        minutes: 4,
        title: "Top-k decides which evidence reaches the model",
        content: <RetrievalLab />,
        note:
          "Start at k=1. Ask students to predict whether the generator can answer before changing k. Then discuss the precision-recall tradeoff. Metadata filters such as course, term, and access should run before prompt assembly; top-k is not a substitute for authorization.",
      },
      {
        eyebrow: "Query–document mismatch",
        minutes: 4,
        title: "Users and documents often describe the same idea differently",
        content: <MismatchVisual />,
        note:
          "Toggle keyword, dense, and rewritten queries. Ask which approach helps a course number such as CPSC 481 and which helps a paraphrase such as turn in versus submission. Hybrid retrieval and reranking are previewed next and developed in Meeting 22.",
      },
      {
        eyebrow: "Meeting 22 preview",
        minutes: 1,
        title: "Retrieve wide, then spend effort on the shortlist",
        content: (
          <div className="rerank-layout">
            <RerankVisual />
            <div className="rerank-notes">
              <h3>Why rerank?</h3>
              <p>
                A fast bi-encoder retrieves many candidates independently. A slower
                cross-encoder reads each query–passage pair and produces a sharper order.
              </p>
              <Callout title="Metadata is not decoration" tone="gold">
                Filter by time, product, tenant, language, or permission before sensitive
                text can enter the prompt.
              </Callout>
            </div>
          </div>
        ),
        note:
          "This is a conceptual preview, not a deep implementation lecture. Ask what could go wrong if access-control filtering happens after generation rather than before retrieval.",
      },
      {
        eyebrow: "Worked example · 3 of 3",
        minutes: 3,
        title: "The prompt is a controlled evidence package",
        content: (
          <div className="prompt-layout">
            <div className="prompt-stack">
              <div className="prompt-block instructions">
                <span>System instructions</span>
                <p>Answer only from supplied evidence. State when evidence is insufficient.</p>
              </div>
              <div className="prompt-block context">
                <span>Retrieved context</span>
                <p>[D2] Submit through Canvas…<br />[D3] Include source trace, methods…</p>
              </div>
              <div className="prompt-block question">
                <span>User question</span>
                <p>Where is the brief submitted, and what must it include?</p>
              </div>
            </div>
            <span className="prompt-arrow" aria-hidden="true">→</span>
            <div className="answer-card">
              <span>Grounded response</span>
              <p>
                Submit the brief through Canvas. It must include source trace,
                methods, findings, limitations, and a supported-versus-unsupported
                claim analysis. <strong>[D2][D3]</strong>
              </p>
              <div className="answer-checks">
                <span>✓ answers both parts</span>
                <span>✓ attributes claims</span>
                <span>✓ no extra claim</span>
              </div>
            </div>
          </div>
        ),
        note:
          "Point out that citations are generated text unless the application verifies and maps them to retrieved document IDs. UI and backend must cooperate.",
      },
      {
        eyebrow: "Grounding and attribution",
        minutes: 3,
        title: "A citation is useful only when the claim resolves to evidence",
        content: (
          <div className="citation-layout">
            <div className="claim-card">
              <span className="micro-label">Generated answer</span>
              <p>
                The research evidence brief is submitted through <mark>Canvas</mark> and must include
                a <mark>source trace</mark> and <mark>limitations</mark>.
              </p>
              <div className="claim-links">
                <span><b>Claim 1</b> → D2 · syllabus · submission section</span>
                <span><b>Claim 2</b> → D3 · assignment · ¶2</span>
              </div>
            </div>
            <div className="citation-checklist">
              {[
                ["Entailment", "Does the passage actually support the claim?"],
                ["Completeness", "Are all externally checkable claims covered?"],
                ["Resolution", "Can the reader open the exact version and location?"],
                ["Abstention", "Does the answer stop when evidence runs out?"],
              ].map(([label, text]) => (
                <article key={label}><span>✓</span><div><strong>{label}</strong><p>{text}</p></div></article>
              ))}
            </div>
          </div>
        ),
        note:
          "Distinguish a decorative citation from verified attribution. Applications should map stable document IDs to visible source locations and check that the cited passage entails the nearby claim.",
      },
      {
        eyebrow: "Quality boundary",
        minutes: 3,
        title: "Evaluate the retriever and generator separately",
        content: (
          <div className="evaluation-layout">
            <div className="metric-column">
              <span className="column-label">Retrieval layer</span>
              <MetricCard
                label="Coverage"
                question="Did we retrieve needed evidence?"
                examples="Recall@k · hit rate · MRR · nDCG"
              />
              <MetricCard
                label="Focus"
                question="How much retrieved context was useful?"
                examples="Precision@k · context relevance"
              />
            </div>
            <div className="metric-column">
              <span className="column-label">Generation layer</span>
              <MetricCard
                label="Faithfulness"
                question="Is every claim supported by context?"
                examples="Claim verification · citation entailment"
              />
              <MetricCard
                label="Task quality"
                question="Did the response answer correctly?"
                examples="Correctness · completeness · abstention"
              />
            </div>
            <Callout title="Start with a small human-reviewed evaluation set" tone="gold">
              Include answerable, unanswerable, ambiguous, and paraphrased questions.
              Meeting 22 develops hybrid retrieval, reranking, citation checks, and evaluation.
            </Callout>
          </div>
        ),
        note:
          "Keep this as a boundary-setting preview. Students need only distinguish retrieval coverage from answer faithfulness today. Meeting 22 develops the metrics and experimental design.",
      },
      {
        eyebrow: "Failure analysis",
        minutes: 3,
        title: "Debug the earliest broken stage",
        content: (
          <div className="failure-table" role="table" aria-label="RAG failures and interventions">
            <div className="failure-table-row header" role="row">
              <span role="columnheader">Observed failure</span>
              <span role="columnheader">Likely stage</span>
              <span role="columnheader">First intervention</span>
            </div>
            {[
              ["Correct source never appears", "Corpus / parsing", "Audit coverage and extraction"],
              ["Source exists but ranks too low", "Retrieval", "Inspect query, chunking, hybrid search"],
              ["Relevant result ranks below noise", "Ranking", "Add metadata filters or reranking"],
              ["Evidence is present; answer contradicts it", "Generation", "Tighten instructions; test model"],
              ["Citation points to wrong passage", "Attribution", "Bind claims to immutable document IDs"],
              ["Old policy beats current policy", "Freshness", "Add time-aware metadata and invalidation"],
            ].map((row) => (
              <div className="failure-table-row" role="row" key={row[0]}>
                {row.map((cell, index) => (
                  <span role="cell" key={cell}>
                    {index === 1 && <i className="status-dot" aria-hidden="true" />}
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ),
        note:
          "Give pairs one row and ask what evidence would confirm the suspected stage. Stress observability: retain query, retrieved IDs/scores, prompt version, response, latency, and cost.",
      },
      {
        eyebrow: "Security and trust",
        minutes: 3,
        title: "Retrieved text is untrusted input",
        content: (
          <div className="security-layout">
            <figure className="photo-card security-photo">
              <img
                alt="A secure aisle between rows of data-center cabinets"
                src="/media/server-aisle.jpg"
              />
              <figcaption>Server aisle · Robert.Harker · CC BY-SA 3.0</figcaption>
            </figure>
            <div className="threat-path">
              <div className="threat-node source"><span>1</span><strong>Malicious document</strong><small>“Ignore prior rules…”</small></div>
              <div className="threat-arrow">→</div>
              <div className="threat-node prompt"><span>2</span><strong>Retrieved context</strong><small>Data enters the prompt</small></div>
              <div className="threat-arrow">→</div>
              <div className="threat-node blocked"><span>3</span><strong>Guarded action</strong><small>Separate data from instructions</small></div>
              <ul>
                <li>Enforce permissions before retrieval</li>
                <li>Treat retrieved passages as quoted data</li>
                <li>Allow-list tools and validate outputs</li>
                <li>Log source IDs without exposing secrets</li>
              </ul>
            </div>
          </div>
        ),
        note:
          "Introduce indirect prompt injection: a document can contain instructions aimed at the model. RAG expands the attack surface because external text crosses a trust boundary.",
      },
      {
        eyebrow: "Guided practice",
        minutes: 6,
        title: "A minimum viable RAG experiment",
        content: (
          <div className="studio-layout">
            <div className="studio-brief">
              <span className="micro-label">6-minute pair activity</span>
              <h3>Design a course-policy assistant</h3>
              <p>
                It answers questions from the CPSC 481 syllabus and assignment
                pages. It must cite sources and abstain when policy is missing.
              </p>
              <div className="constraints">
                <span>Small corpus</span>
                <span>No student data</span>
                <span>Local vector index</span>
                <span>20 test questions</span>
              </div>
            </div>
            <ol className="design-questions">
              <li><span>1</span><p><strong>Corpus</strong>What enters—and what is excluded?</p></li>
              <li><span>2</span><p><strong>Retrieval</strong>What is the baseline and why?</p></li>
              <li><span>3</span><p><strong>Abstention</strong>When should the system refuse?</p></li>
              <li><span>4</span><p><strong>Evaluation</strong>Which test cases expose failure?</p></li>
            </ol>
          </div>
        ),
        note:
          "Pairs get four minutes to complete the design and two minutes for rapid share-out. Look for teams that start with a vector database rather than a task definition, governed corpus, and test questions; redirect them.",
      },
      {
        eyebrow: "Synthesis",
        minutes: 2,
        title: "RAG adds evidence—not certainty",
        content: (
          <div className="summary-layout">
            <div className="summary-list">
              {[
                ["Pipeline", "RAG coordinates ingestion, retrieval, prompting, generation, and evaluation."],
                ["Tradeoff", "Retrieval must balance coverage, focus, latency, cost, and access control."],
                ["Diagnosis", "Separate retrieval failures from generation and attribution failures."],
                ["Evidence", "Use versioned sources, traceable IDs, held-out questions, and human review."],
              ].map(([label, text]) => (
                <div className="summary-item" key={label}>
                  <span>{label}</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <div className="exit-ticket">
              <span className="micro-label">Exit ticket · 2 minutes</span>
              <h3>A RAG answer is wrong even though the correct passage was retrieved.</h3>
              <p>Name the next two artifacts you would inspect, and explain why.</p>
            </div>
          </div>
        ),
        note:
          "Expected direction: inspect the assembled prompt/context and generated response with claim-to-source mapping. Students may also identify prompt version, ordering, truncation, or model settings.",
      },
      {
        eyebrow: "Sources and next class",
        minutes: 2,
        title: "Continue from foundations to RAG quality",
        content: (
          <div className="references-layout">
            <div>
              <span className="micro-label">Foundational reading</span>
              <ul className="references">
                <li>
                  <a href="https://arxiv.org/abs/2005.11401" target="_blank" rel="noreferrer">
                    Lewis et al. (2020), Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
                  </a>
                </li>
                <li>
                  <a href="https://aclanthology.org/2020.emnlp-main.550/" target="_blank" rel="noreferrer">
                    Karpukhin et al. (2020), Dense Passage Retrieval for Open-Domain Question Answering
                  </a>
                </li>
                <li>
                  <a href="https://aclanthology.org/D19-1410/" target="_blank" rel="noreferrer">
                    Reimers &amp; Gurevych (2019), Sentence-BERT
                  </a>
                </li>
                <li>
                  <a href="https://aclanthology.org/2024.eacl-demo.16/" target="_blank" rel="noreferrer">
                    Es et al. (2024), RAGAs: Automated Evaluation of RAG
                  </a>
                </li>
              </ul>
            </div>
            <div className="next-class">
              <Tag tone="gold">Meeting 22 preview</Tag>
              <h3>RAG Quality</h3>
              <p>Hybrid retrieval · reranking · grounding · citations · evaluation</p>
              <div className="keyboard-help">
                <span><kbd>←</kbd><kbd>→</kbd> navigate</span>
                <span><kbd>O</kbd> overview</span>
                <span><kbd>N</kbd> notes</span>
                <span><kbd>F</kbd> full screen</span>
              </div>
            </div>
          </div>
        ),
        note:
          "Close by connecting the next meeting to the weaknesses students identified today. The references are primary sources and suitable starting points for technical reading.",
      },
    ],
    [],
  );

  const total = slides.length;
  const plannedMinutes = slides.reduce((sum, item) => sum + item.minutes, 0);

  useEffect(() => {
    setPrintAll(new URLSearchParams(window.location.search).get("print") === "all");
  }, []);

  const goTo = useCallback((index: number) => {
    const bounded = Math.max(0, Math.min(total - 1, index));
    setCurrent(bounded);
    setOverviewOpen(false);
    window.history.replaceState(null, "", `#slide-${bounded + 1}`);
  }, [total]);

  useEffect(() => {
    const match = window.location.hash.match(/slide-(\d+)/);
    if (match) {
      const requested = Number(match[1]) - 1;
      if (requested >= 0 && requested < total) {
        const frame = window.requestAnimationFrame(() => setCurrent(requested));
        return () => window.cancelAnimationFrame(frame);
      }
    }
  }, [total]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(target.tagName)) return;

      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(current + 1);
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(total - 1);
      } else if (event.key.toLowerCase() === "o") {
        setOverviewOpen((value) => !value);
      } else if (event.key.toLowerCase() === "n") {
        setNotesOpen((value) => !value);
      } else if (event.key.toLowerCase() === "f") {
        document.documentElement.requestFullscreen?.();
      } else if (event.key === "Escape") {
        setOverviewOpen(false);
        setNotesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, total]);

  const handleTouchStart = (event: TouchEvent) => {
    setTouchStart(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStart === null) return;
    const end = event.changedTouches[0]?.clientX ?? touchStart;
    const distance = end - touchStart;
    if (Math.abs(distance) > 55) goTo(distance < 0 ? current + 1 : current - 1);
    setTouchStart(null);
  };

  const slide = slides[current];

  if (printAll) {
    return (
      <main className="deck print-all-deck">
        {slides.map((item, index) => (
          <section
            aria-label={`Slide ${index + 1} of ${total}: ${item.title}`}
            className="slide"
            key={`${item.eyebrow}-${item.title}`}
          >
            <div className="slide-heading">
              <div className="heading-meta">
                <span className="eyebrow">{item.eyebrow}</span>
                <span className="timing-chip">{item.minutes} min</span>
              </div>
              <h1>{item.title}</h1>
              {item.subtitle && <p>{item.subtitle}</p>}
            </div>
            <div className="slide-content">{item.content}</div>
          </section>
        ))}
      </main>
    );
  }

  return (
    <main
      className={motionEnabled ? "deck" : "deck motion-off"}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <header className="deck-header">
        <div className="brand">
          <span className="brand-mark">481</span>
          <div>
            <strong>CPSC 481</strong>
            <small>Introduction to Artificial Intelligence</small>
          </div>
        </div>
        <div className="header-actions">
          <button
            aria-pressed={motionEnabled}
            onClick={() => setMotionEnabled((value) => !value)}
            type="button"
          >
            Motion {motionEnabled ? "on" : "off"}
          </button>
          <button onClick={() => setNotesOpen((value) => !value)} type="button">
            Notes
          </button>
          <button onClick={() => setOverviewOpen(true)} type="button">
            Overview
          </button>
          <button onClick={() => window.print()} type="button">
            Print
          </button>
        </div>
      </header>

      <section
        aria-label={`Slide ${current + 1} of ${total}: ${slide.title}`}
        className="slide"
        key={current}
      >
        <div className="slide-heading">
          <div className="heading-meta">
            <span className="eyebrow">{slide.eyebrow}</span>
            <span className="timing-chip">{slide.minutes} min</span>
          </div>
          <h1>{slide.title}</h1>
          {slide.subtitle && <p>{slide.subtitle}</p>}
        </div>
        <div className="slide-content">{slide.content}</div>
      </section>

      {notesOpen && (
        <aside aria-label="Instructor notes" className="speaker-notes">
          <div>
            <span>Instructor note · Slide {current + 1}</span>
            <button aria-label="Close instructor notes" onClick={() => setNotesOpen(false)} type="button">
              ×
            </button>
          </div>
          <p>{slide.note}</p>
        </aside>
      )}

      <footer className="deck-footer">
        <button
          aria-label="Previous slide"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
          type="button"
        >
          ←
        </button>
        <div className="progress-wrap">
          <div className="progress-meta">
            <span>RAG Foundations · {plannedMinutes}-minute plan</span>
            <span>{current + 1} / {total}</span>
          </div>
          <div
            aria-label={`${Math.round(((current + 1) / total) * 100)} percent complete`}
            aria-valuemax={total}
            aria-valuemin={1}
            aria-valuenow={current + 1}
            className="progress"
            role="progressbar"
          >
            <i style={{ width: `${((current + 1) / total) * 100}%` }} />
          </div>
        </div>
        <button
          aria-label="Next slide"
          disabled={current === total - 1}
          onClick={() => goTo(current + 1)}
          type="button"
        >
          →
        </button>
      </footer>

      {overviewOpen && (
        <div className="overview-backdrop" role="presentation">
          <aside aria-label="Slide overview" className="overview">
            <div className="overview-heading">
              <div>
                <span>Module 14 · Lesson 21</span>
                <h2>RAG Foundations</h2>
              </div>
              <button aria-label="Close slide overview" onClick={() => setOverviewOpen(false)} type="button">
                ×
              </button>
            </div>
            <nav aria-label="Presentation slides">
              {slides.map((item, index) => (
                <button
                  aria-current={index === current ? "page" : undefined}
                  key={`${item.eyebrow}-${item.title}`}
                  onClick={() => goTo(index)}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>{item.eyebrow} · {item.minutes} min</small>
                    <strong>{item.title}</strong>
                  </div>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </main>
  );
}
