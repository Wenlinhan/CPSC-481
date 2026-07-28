"use client";

import {
  type ReactNode,
  type TouchEvent,
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
};

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

function QualityLoop() {
  const stages = [
    ["1", "Observe", "Log query, retrieved IDs, prompt, answer"],
    ["2", "Slice", "Group failures by question and source type"],
    ["3", "Diagnose", "Find the earliest broken stage"],
    ["4", "Change one thing", "Retriever, chunking, prompt, or model"],
    ["5", "Re-evaluate", "Compare on the same held-out set"],
  ];
  return (
    <div className="quality-loop" aria-label="Five-step RAG quality improvement loop">
      {stages.map(([n, label, detail], index) => (
        <div className="quality-node" key={n}>
          <span>{n}</span><strong>{label}</strong><small>{detail}</small>
          {index < stages.length - 1 && <i aria-hidden="true">→</i>}
        </div>
      ))}
    </div>
  );
}

const fusionDocs = [
  { id: "D1", label: "CPSC 481 course catalog", lexical: 1, dense: 4, useful: false },
  { id: "D2", label: "Current syllabus · Week 13", lexical: 2, dense: 1, useful: true },
  { id: "D3", label: "Evidence brief assignment", lexical: 4, dense: 2, useful: true },
  { id: "D4", label: "Archived syllabus · Week 12", lexical: 3, dense: 3, useful: false },
];

function FusionLab() {
  const [mode, setMode] = useState<"lexical" | "dense" | "hybrid">("lexical");
  const ranked = [...fusionDocs].sort((a, b) => {
    if (mode === "lexical") return a.lexical - b.lexical;
    if (mode === "dense") return a.dense - b.dense;
    const rrfA = 1 / (60 + a.lexical) + 1 / (60 + a.dense);
    const rrfB = 1 / (60 + b.lexical) + 1 / (60 + b.dense);
    return rrfB - rrfA;
  });

  return (
    <div className="fusion-lab">
      <div className="lab-header">
        <div><span className="micro-label">Interactive ranking</span><h3>Which evidence rises?</h3></div>
        <div className="segmented" aria-label="Select retrieval mode">
          {(["lexical", "dense", "hybrid"] as const).map((value) => (
            <button
              aria-pressed={mode === value}
              className={mode === value ? "active" : ""}
              key={value}
              onClick={() => setMode(value)}
              type="button"
            >
              {value === "hybrid" ? "RRF hybrid" : value}
            </button>
          ))}
        </div>
      </div>
      <p className="query"><span>Query</span>When is the evidence brief due?</p>
      <div className="fusion-results">
        {ranked.map((doc, index) => (
          <article className={doc.useful ? "fusion-result useful" : "fusion-result"} key={doc.id}>
            <b>{index + 1}</b>
            <div><strong>{doc.id} · {doc.label}</strong><small>lexical rank {doc.lexical} · dense rank {doc.dense}</small></div>
            <span>{doc.useful ? "needed" : "noise"}</span>
          </article>
        ))}
      </div>
      <Callout title={mode === "hybrid" ? "Fusion improves coverage" : "One signal can miss important evidence"} tone="gold">
        RRF combines rank positions; it does not make either retriever correct.
      </Callout>
    </div>
  );
}

const auditClaims = [
  {
    label: "Claim A",
    claim: "The evidence brief is due in Week 13.",
    evidence: "D2: “Submit the AAB Research Evidence Brief during Week 13.”",
    verdict: "supported",
  },
  {
    label: "Claim B",
    claim: "Late submissions automatically receive half credit.",
    evidence: "No retrieved passage states a late-work penalty.",
    verdict: "unsupported",
  },
  {
    label: "Claim C",
    claim: "The brief must discuss limitations.",
    evidence: "D3: “Report methods, findings, limitations, and claim boundaries.”",
    verdict: "supported",
  },
];

function CitationAudit() {
  const [selected, setSelected] = useState(0);
  const item = auditClaims[selected];
  return (
    <div className="citation-audit">
      <div className="claim-tabs" role="tablist" aria-label="Select answer claim">
        {auditClaims.map((claim, index) => (
          <button
            aria-selected={selected === index}
            key={claim.label}
            onClick={() => setSelected(index)}
            role="tab"
            type="button"
          >
            {claim.label}
          </button>
        ))}
      </div>
      <div className="audit-body">
        <div className="audit-claim"><span>Generated claim</span><p>{item.claim}</p></div>
        <div className="audit-arrow" aria-hidden="true">→</div>
        <div className="audit-evidence"><span>Retrieved evidence</span><p>{item.evidence}</p></div>
      </div>
      <div className={`audit-verdict ${item.verdict}`}>
        <strong>{item.verdict === "supported" ? "✓ Supported" : "× Unsupported"}</strong>
        <span>{item.verdict === "supported" ? "Keep the claim and bind its citation." : "Delete, qualify, or abstain—do not invent a citation."}</span>
      </div>
    </div>
  );
}

function MetricLab() {
  const [slice, setSlice] = useState<"all" | "policy" | "multi-hop" | "unanswerable">("all");
  const values = {
    all: [82, 76, 79, 71],
    policy: [91, 88, 86, 79],
    "multi-hop": [58, 69, 63, 54],
    unanswerable: [86, 42, 61, 93],
  }[slice];
  const labels = ["Recall@5", "Context precision", "Faithfulness", "Correctness"];

  return (
    <div className="metric-lab">
      <div className="segmented" aria-label="Select evaluation slice">
        {(["all", "policy", "multi-hop", "unanswerable"] as const).map((value) => (
          <button
            aria-pressed={slice === value}
            className={slice === value ? "active" : ""}
            key={value}
            onClick={() => setSlice(value)}
            type="button"
          >
            {value}
          </button>
        ))}
      </div>
      <div className="metric-bars">
        {labels.map((label, index) => (
          <div className="metric-bar" key={label}>
            <div><strong>{label}</strong><span>{values[index]}%</span></div>
            <i><b style={{ width: `${values[index]}%` }} /></i>
          </div>
        ))}
      </div>
      <Callout title={slice === "all" ? "Averages hide the weak cases" : `Inspect the ${slice} slice`} tone="gold">
        {slice === "unanswerable"
          ? "High abstention can coexist with poor context precision. One number cannot describe the system."
          : slice === "multi-hop"
            ? "The system often retrieves one needed passage but misses the second."
            : "Choose a slice to reveal a different quality profile."}
      </Callout>
    </div>
  );
}

export function RagQualityDeck() {
  const [current, setCurrent] = useState(0);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const slides: SlideRecord[] = useMemo(
    () => [
      {
        eyebrow: "Week 11 · Meeting 22",
        title: "RAG Quality",
        subtitle: "From a working demo to a system you can measure and improve",
        content: (
          <div className="hero-layout">
            <div className="hero-copy">
              <div className="tag-row"><Tag>CPSC 481</Tag><Tag tone="gold">75-minute class</Tag></div>
              <p className="big-question">The system answered correctly once. How do we know it will answer correctly again?</p>
              <div className="hero-rule" />
              <p className="quiet">Quality is a repeatable evaluation process—not a more impressive demo.</p>
            </div>
            <div className="quality-hero" aria-label="Quality funnel from candidate evidence to verified answer">
              <div><span>50</span><strong>retrieve</strong><small>broad candidates</small></div>
              <i>↓</i>
              <div><span>5</span><strong>rerank</strong><small>focused evidence</small></div>
              <i>↓</i>
              <div><span>1</span><strong>verify</strong><small>grounded answer</small></div>
            </div>
          </div>
        ),
        note: "Ask students what evidence they would accept before calling a RAG system good. Contrast a successful demo with repeatable performance on a defined task.",
      },
      {
        eyebrow: "Learning objectives",
        title: "By the end of class, you can…",
        content: (
          <div className="objective-grid">
            {[
              ["01", "Fuse", "lexical and dense rankings with a simple hybrid method."],
              ["02", "Rerank", "a candidate set while respecting metadata and access rules."],
              ["03", "Audit", "claims, evidence, citations, and abstentions."],
              ["04", "Evaluate", "quality by layer, slice, latency, and cost."],
            ].map(([n, verb, detail]) => (
              <article className="objective-card" key={n}><span>{n}</span><h3>{verb}</h3><p>{detail}</p></article>
            ))}
          </div>
        ),
        note: "Frame the class as a quality-engineering lesson. Students do not need to memorize every metric; they should know which layer each metric diagnoses.",
      },
      {
        eyebrow: "Foundation recap",
        title: "Start at the earliest broken stage",
        content: (
          <div className="diagnostic-map">
            {[
              ["Corpus", "Is the needed source present, current, and permitted?"],
              ["Parsing", "Did structure, tables, and identity survive extraction?"],
              ["Retrieval", "Did the needed chunk enter the candidate set?"],
              ["Ranking", "Did useful evidence rise above distractors?"],
              ["Generation", "Did the model follow and cite the evidence?"],
              ["Product", "Could the user verify, correct, or reject the answer?"],
            ].map(([stage, question], index) => (
              <article key={stage}><span>{index + 1}</span><div><strong>{stage}</strong><p>{question}</p></div></article>
            ))}
          </div>
        ),
        note: "Reinforce the Meeting 21 diagnostic rule: do not tune the generator when the source was never retrieved.",
      },
      {
        eyebrow: "Quality engineering",
        title: "Improve RAG with a controlled loop",
        content: (
          <div className="loop-slide">
            <QualityLoop />
            <Callout title="One change per experiment" tone="gold">
              If chunking, embeddings, top-k, prompt, and model all change together, you cannot attribute the result.
            </Callout>
          </div>
        ),
        note: "Connect this to experimental design. Keep a run record with configuration, dataset version, metrics, latency, cost, and qualitative failures.",
      },
      {
        eyebrow: "Baseline",
        title: "Build the boring system first",
        content: (
          <div className="baseline-layout">
            <div className="baseline-stack">
              {[
                ["Corpus", "Small, versioned, authoritative"],
                ["Chunking", "Headings + fixed token window"],
                ["Retriever", "BM25 or one dense model"],
                ["Generation", "One grounded-answer prompt"],
                ["Evaluation", "20–50 reviewed questions"],
              ].map(([label, text], index) => (
                <div key={label}><span>{index + 1}</span><strong>{label}</strong><small>{text}</small></div>
              ))}
            </div>
            <div className="definition-panel">
              <span className="micro-label">A baseline gives you</span>
              <p>A known cost, a known score, and a known failure profile.</p>
              <Callout title="No baseline, no improvement" tone="gold">A complex stack is not evidence that the task got better.</Callout>
            </div>
          </div>
        ),
        note: "A baseline should be easy to reproduce and cheap enough to run often. New components must earn their complexity.",
      },
      {
        eyebrow: "Query quality",
        title: "Users ask conversationally; retrievers need a searchable intent",
        content: (
          <div className="rewrite-layout">
            <div className="rewrite-before"><span>Conversation</span><p>“What about the late one?”</p><small>Ambiguous without history</small></div>
            <div className="rewrite-engine"><strong>rewrite</strong><span>history + current turn</span></div>
            <div className="rewrite-after"><span>Standalone query</span><p>“What is the late-submission policy for the AAB evidence brief?”</p><small>Preserves task and entity</small></div>
            <div className="rewrite-rules">
              <span>Do not add facts</span><span>Keep names and identifiers</span><span>Split only when necessary</span><span>Log original + rewrite</span>
            </div>
          </div>
        ),
        note: "Query rewriting can help vocabulary mismatch and multi-turn context, but it can also drift. Always evaluate the rewrite and preserve the original query for traceability.",
      },
      {
        eyebrow: "Hybrid retrieval",
        title: "Lexical and dense search make different mistakes",
        content: (
          <div className="venn-layout">
            <div className="venn">
              <div className="venn-circle lexical-circle"><strong>BM25</strong><small>IDs · rare terms · exact phrases</small></div>
              <div className="venn-circle dense-circle"><strong>Dense</strong><small>paraphrases · concepts · semantic neighbors</small></div>
              <span>hybrid</span>
            </div>
            <div className="fusion-formula">
              <span className="micro-label">Reciprocal Rank Fusion</span>
              <code>RRF(d) = Σ 1 / (k + rankᵢ(d))</code>
              <p>Combine rank positions without forcing incomparable raw scores onto one scale.</p>
              <Callout title="Simple is a feature" tone="gold">RRF is a strong first fusion baseline; tune only after evaluation.</Callout>
            </div>
          </div>
        ),
        note: "Explain that lexical and dense scores live on different scales. RRF uses rank positions. The constant k dampens the contribution of rank differences near the top.",
      },
      {
        eyebrow: "Interactive lab",
        title: "Fuse rankings, then inspect what moved",
        content: <FusionLab />,
        note: "Switch modes and ask why the archived syllabus remains dangerous. Hybrid retrieval improves coverage, but metadata must still enforce freshness.",
      },
      {
        eyebrow: "Metadata",
        title: "Filter before irrelevant or forbidden text enters the prompt",
        content: (
          <div className="filter-layout">
            <div className="filter-query"><span>Query</span><strong>When is the brief due?</strong></div>
            <div className="filter-gates">
              {[
                ["course", "CPSC 481"],
                ["term", "Summer 2026"],
                ["status", "published"],
                ["access", "enrolled student"],
              ].map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong><i>✓</i></div>)}
            </div>
            <div className="filter-output"><span>Candidate set</span><strong>24 → 7 documents</strong><small>fewer distractors · lower reranking cost · correct permissions</small></div>
          </div>
        ),
        note: "Metadata filtering is part of correctness and security. Do not retrieve across tenants or access groups and hope the prompt will hide the result.",
      },
      {
        eyebrow: "Chunking",
        title: "Retrieve the focused chunk; return the useful context",
        content: (
          <div className="parent-child-layout">
            <div className="document-map">
              <div className="doc-parent"><span>Parent section</span><strong>Assignment policy</strong></div>
              <div className="doc-children">
                <div>Purpose</div><div className="matched">Due date</div><div>Required elements</div><div>Rubric</div>
              </div>
            </div>
            <div className="parent-child-copy">
              <h3>Parent–child retrieval</h3>
              <p>Search small child chunks for precision, then return the surrounding parent section for coherence.</p>
              <div className="tradeoff-row"><span>small search unit</span><i>+</i><span>larger reading unit</span><i>=</i><strong>focused context</strong></div>
              <Callout title="Evaluate boundaries, not just size" tone="gold">Headings, tables, code blocks, and lists often define better semantic units than a fixed number alone.</Callout>
            </div>
          </div>
        ),
        note: "Contrast the unit used for search with the unit returned to the generator. They do not have to be identical.",
      },
      {
        eyebrow: "Reranking",
        title: "A slower reader can reorder a short candidate list",
        content: (
          <div className="rerank-layout">
            <div className="rerank-flow">
              <div className="candidate-stack"><span className="micro-label">Retriever · top 40</span>{["D8 · calendar", "D2 · syllabus", "D4 · archive", "D3 · assignment"].map(x => <div key={x}>{x}</div>)}</div>
              <div className="funnel"><span>cross-encoder</span></div>
              <div className="candidate-stack final-stack"><span className="micro-label">Reranked · top 4</span>{["D2 · syllabus", "D3 · assignment", "D8 · calendar", "D4 · archive"].map((x, i) => <div key={x}><b>{i + 1}</b>{x}</div>)}</div>
            </div>
            <div className="rerank-notes">
              <h3>Retrieve wide, rerank narrow</h3>
              <p>A bi-encoder scores documents independently. A cross-encoder jointly reads the query and passage for a more precise relevance score.</p>
              <Callout title="Pay only where it matters" tone="gold">Reranking every document would be too slow; rerank the shortlist.</Callout>
            </div>
          </div>
        ),
        note: "Keep this conceptual. Students should understand the two-stage architecture and the quality–latency tradeoff, not implement a cross-encoder today.",
      },
      {
        eyebrow: "Context selection",
        title: "More context can make the answer worse",
        content: (
          <div className="context-budget">
            <div className="budget-meter">
              <span>Prompt budget</span>
              <div><i className="system-budget">instructions</i><i className="useful-budget">useful evidence</i><i className="noise-budget">distractors</i><i className="answer-budget">answer</i></div>
            </div>
            <div className="context-actions">
              {[
                ["Deduplicate", "Remove overlapping near-copies."],
                ["Diversify", "Keep complementary passages, not five versions of one fact."],
                ["Order", "Put the strongest evidence where the model can use it."],
                ["Compress", "Preserve claims and provenance; drop irrelevant detail."],
              ].map(([label, text]) => <article key={label}><strong>{label}</strong><p>{text}</p></article>)}
            </div>
            <Callout title="Long context is capacity, not attention" tone="gold">Relevant information can still be overlooked when buried among distractors.</Callout>
          </div>
        ),
        note: "Introduce the lost-in-the-middle result. A larger context window does not remove the need for retrieval, ordering, and evaluation.",
      },
      {
        eyebrow: "Grounded generation",
        title: "Design the answer contract before tuning the prose",
        content: (
          <div className="contract-layout">
            <div className="contract-card">
              <span className="micro-label">Answer contract</span>
              <ol>
                <li>Answer only from retrieved evidence.</li>
                <li>Cite each externally checkable claim.</li>
                <li>Separate fact, inference, and recommendation.</li>
                <li>State conflicts instead of silently choosing.</li>
                <li>Abstain when evidence is missing.</li>
              </ol>
            </div>
            <div className="answer-states">
              <div className="answerable"><span>Evidence sufficient</span><strong>Answer + citations</strong><small>“The brief is due in Week 13. [D2]”</small></div>
              <div className="conflict"><span>Evidence conflicts</span><strong>Expose the conflict</strong><small>“The archive says Week 12; current syllabus says Week 13.”</small></div>
              <div className="insufficient"><span>Evidence insufficient</span><strong>Abstain + next step</strong><small>“The provided course sources do not state a penalty.”</small></div>
            </div>
          </div>
        ),
        note: "An answer contract creates observable behavior. It also lets the evaluation set include conflicts and unanswerable questions.",
      },
      {
        eyebrow: "Interactive audit",
        title: "Check claims, not just the answer’s overall tone",
        content: <CitationAudit />,
        note: "Select each claim. Ask students whether the retrieved evidence entails the claim. Unsupported Claim B should be removed or explicitly marked unknown.",
      },
      {
        eyebrow: "Evaluation set",
        title: "Test the questions that can break the system",
        content: (
          <div className="dataset-layout">
            <div className="dataset-ring">
              {[
                ["8", "direct"],
                ["4", "paraphrase"],
                ["4", "multi-hop"],
                ["4", "unanswerable"],
                ["3", "conflict"],
                ["2", "adversarial"],
              ].map(([n, label]) => <div key={label}><strong>{n}</strong><span>{label}</span></div>)}
            </div>
            <div className="gold-record">
              <span className="micro-label">One reviewed test record</span>
              <div><b>Question</b><p>When is the brief due?</p></div>
              <div><b>Needed evidence</b><p>D2 §4 and D3 ¶2</p></div>
              <div><b>Expected behavior</b><p>Week 13 + required elements + citations</p></div>
              <div><b>Failure tags</b><p>freshness · multi-source · attribution</p></div>
            </div>
          </div>
        ),
        note: "A small reviewed set is enough to begin. Include questions from real user language and preserve some as held-out tests.",
      },
      {
        eyebrow: "Layered metrics",
        title: "Each metric should answer a diagnostic question",
        content: (
          <div className="evaluation-layout">
            <div className="metric-column"><span className="column-label">Retrieval</span>
              <article className="metric-card"><span>Coverage</span><h3>Did needed evidence appear?</h3><p>Recall@k · hit rate · MRR · nDCG</p></article>
              <article className="metric-card"><span>Focus</span><h3>How much context was useful?</h3><p>Precision@k · context relevance</p></article>
            </div>
            <div className="metric-column"><span className="column-label">Generation</span>
              <article className="metric-card"><span>Faithfulness</span><h3>Were claims supported?</h3><p>Claim entailment · citation precision</p></article>
              <article className="metric-card"><span>Task quality</span><h3>Did behavior meet the contract?</h3><p>Correctness · completeness · abstention</p></article>
            </div>
            <Callout title="LLM judges accelerate review; they require calibration" tone="gold">Compare automated judgments with human labels and inspect disagreements.</Callout>
          </div>
        ),
        note: "RAGAS is one example of automated layered evaluation. Emphasize that metric names and implementations vary; the diagnostic question is primary.",
      },
      {
        eyebrow: "Interactive evaluation",
        title: "Slice the results before averaging them",
        content: <MetricLab />,
        note: "Use the slices to show why aggregate quality can look acceptable while multi-hop or unanswerable behavior remains weak.",
      },
      {
        eyebrow: "Failure analysis",
        title: "Turn every bad answer into a labeled example",
        content: (
          <div className="failure-table" role="table" aria-label="RAG quality failure slices">
            <div className="failure-table-row header" role="row"><span>Failure slice</span><span>Evidence</span><span>Next controlled experiment</span></div>
            {[
              ["Exact identifier missing", "BM25 hit; dense miss", "Add lexical or hybrid baseline"],
              ["Paraphrase missing", "Dense hit; BM25 miss", "Add semantic retrieval"],
              ["Right source, low rank", "Appears below top-k", "Rerank candidate set"],
              ["Old source selected", "Archive outranks current", "Filter by status and date"],
              ["Correct context, wrong claim", "Evidence present in prompt", "Audit answer contract and model"],
              ["Should abstain", "No supporting passage", "Add negative examples and threshold"],
            ].map(row => <div className="failure-table-row" role="row" key={row[0]}>{row.map(cell => <span role="cell" key={cell}>{cell}</span>)}</div>)}
          </div>
        ),
        note: "Failure labels should be consistent enough to aggregate. The table connects an observation to one targeted intervention.",
      },
      {
        eyebrow: "Systems tradeoffs",
        title: "Quality shares a budget with latency and cost",
        content: (
          <div className="tradeoff-layout">
            <div className="tradeoff-triangle">
              <span className="quality-point">quality</span><span className="latency-point">latency</span><span className="cost-point">cost</span>
              <i className="target-point" />
            </div>
            <div className="latency-stack">
              {[
                ["query rewrite", "80 ms"],
                ["hybrid retrieval", "45 ms"],
                ["reranker", "120 ms"],
                ["generation", "780 ms"],
              ].map(([label, time]) => <div key={label}><span>{label}</span><i /><strong>{time}</strong></div>)}
              <div className="latency-total"><span>Total p50</span><strong>1.03 s</strong></div>
              <Callout title="Measure percentiles" tone="gold">A pleasant median can hide an unusable p95.</Callout>
            </div>
          </div>
        ),
        note: "Ask which stage dominates. Explain p50 versus p95. A quality improvement that doubles cost or tail latency may not be acceptable for the product.",
      },
      {
        eyebrow: "Design studio",
        title: "Run one defensible quality experiment",
        content: (
          <div className="studio-layout">
            <div className="studio-brief">
              <span className="micro-label">15-minute pair activity</span>
              <h3>Improve the course-policy assistant</h3>
              <p>Choose one observed failure. Propose one change, one metric, and one stopping rule.</p>
              <div className="constraints"><span>25 test questions</span><span>Same corpus</span><span>One change</span><span>2-second p95</span></div>
            </div>
            <ol className="design-questions">
              <li><span>1</span><p><strong>Failure</strong>What exact behavior is wrong?</p></li>
              <li><span>2</span><p><strong>Hypothesis</strong>Which stage caused it?</p></li>
              <li><span>3</span><p><strong>Change</strong>What single intervention will you test?</p></li>
              <li><span>4</span><p><strong>Decision</strong>What result means ship, revise, or reject?</p></li>
            </ol>
          </div>
        ),
        note: "Require a falsifiable hypothesis. Examples: hybrid retrieval raises recall@5 on identifier questions without reducing freshness accuracy; reranking raises nDCG@5 under the latency limit.",
      },
      {
        eyebrow: "Synthesis and sources",
        title: "Quality is the discipline of knowing what improved",
        content: (
          <div className="closing-layout">
            <div className="summary-list">
              {[
                ["Retrieve", "Combine complementary signals and protect the candidate set with metadata."],
                ["Select", "Rerank, deduplicate, diversify, and fit a purposeful context budget."],
                ["Ground", "Use an answer contract, claim-level citations, and explicit abstention."],
                ["Evaluate", "Measure by layer and slice; change one variable at a time."],
              ].map(([label, text]) => <div className="summary-item" key={label}><span>{label}</span><p>{text}</p></div>)}
            </div>
            <div className="sources-card">
              <span className="micro-label">Primary reading</span>
              <a href="https://research.google/pubs/reciprocal-rank-fusion-outperforms-condorcet-and-individual-rank-learning-methods/" target="_blank" rel="noreferrer">Cormack et al. (2009) · Reciprocal Rank Fusion</a>
              <a href="https://aclanthology.org/2023.emnlp-main.322/" target="_blank" rel="noreferrer">Ma et al. (2023) · Query Rewriting for RAG</a>
              <a href="https://aclanthology.org/2022.naacl-main.272/" target="_blank" rel="noreferrer">Santhanam et al. (2022) · ColBERTv2</a>
              <a href="https://arxiv.org/abs/2307.03172" target="_blank" rel="noreferrer">Liu et al. (2023) · Lost in the Middle</a>
              <a href="https://aclanthology.org/2024.eacl-demo.16/" target="_blank" rel="noreferrer">Es et al. (2024) · RAGAS</a>
              <div className="exit-ticket"><span className="micro-label">Exit ticket</span><h3>Name one metric and the failure layer it diagnoses.</h3></div>
            </div>
          </div>
        ),
        note: "Close by asking students to name a metric and its layer. A correct answer connects the number to a diagnostic question, not just a formula.",
      },
    ],
    [],
  );

  const total = slides.length;
  const goTo = (index: number) => {
    const bounded = Math.max(0, Math.min(total - 1, index));
    setCurrent(bounded);
    setOverviewOpen(false);
    window.history.replaceState(null, "", `#slide-${bounded + 1}`);
  };

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
        event.preventDefault(); goTo(current + 1);
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault(); goTo(current - 1);
      } else if (event.key === "Home") {
        event.preventDefault(); goTo(0);
      } else if (event.key === "End") {
        event.preventDefault(); goTo(total - 1);
      } else if (event.key.toLowerCase() === "o") {
        setOverviewOpen(value => !value);
      } else if (event.key.toLowerCase() === "n") {
        setNotesOpen(value => !value);
      } else if (event.key.toLowerCase() === "f") {
        document.documentElement.requestFullscreen?.();
      } else if (event.key === "Escape") {
        setOverviewOpen(false); setNotesOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, total]);

  const handleTouchStart = (event: TouchEvent) => setTouchStart(event.touches[0]?.clientX ?? null);
  const handleTouchEnd = (event: TouchEvent) => {
    if (touchStart === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
    if (Math.abs(distance) > 55) goTo(distance < 0 ? current + 1 : current - 1);
    setTouchStart(null);
  };
  const slide = slides[current];

  return (
    <main className={motionEnabled ? "deck quality-deck" : "deck quality-deck motion-off"} onTouchEnd={handleTouchEnd} onTouchStart={handleTouchStart}>
      <header className="deck-header">
        <div className="brand"><span className="brand-mark">481</span><div><strong>CPSC 481</strong><small>Introduction to Artificial Intelligence</small></div></div>
        <div className="header-actions">
          <button aria-pressed={motionEnabled} onClick={() => setMotionEnabled(value => !value)} type="button">Motion {motionEnabled ? "on" : "off"}</button>
          <button onClick={() => setNotesOpen(value => !value)} type="button">Notes</button>
          <button onClick={() => setOverviewOpen(true)} type="button">Overview</button>
          <button onClick={() => window.print()} type="button">Print</button>
        </div>
      </header>
      <section aria-label={`Slide ${current + 1} of ${total}: ${slide.title}`} className="slide" key={current}>
        <div className="slide-heading"><span className="eyebrow">{slide.eyebrow}</span><h1>{slide.title}</h1>{slide.subtitle && <p>{slide.subtitle}</p>}</div>
        <div className="slide-content">{slide.content}</div>
      </section>
      {notesOpen && <aside aria-label="Instructor notes" className="speaker-notes"><div><span>Instructor note · Slide {current + 1}</span><button aria-label="Close instructor notes" onClick={() => setNotesOpen(false)} type="button">×</button></div><p>{slide.note}</p></aside>}
      <footer className="deck-footer">
        <button aria-label="Previous slide" disabled={current === 0} onClick={() => goTo(current - 1)} type="button">←</button>
        <div className="progress-wrap"><div className="progress-meta"><span>RAG Quality</span><span>{current + 1} / {total}</span></div><div aria-label={`${Math.round(((current + 1) / total) * 100)} percent complete`} aria-valuemax={total} aria-valuemin={1} aria-valuenow={current + 1} className="progress" role="progressbar"><i style={{ width: `${((current + 1) / total) * 100}%` }} /></div></div>
        <button aria-label="Next slide" disabled={current === total - 1} onClick={() => goTo(current + 1)} type="button">→</button>
      </footer>
      {overviewOpen && <div className="overview-backdrop" role="presentation"><aside aria-label="Slide overview" className="overview"><div className="overview-heading"><div><span>Week 11 · Meeting 22</span><h2>RAG Quality</h2></div><button aria-label="Close slide overview" onClick={() => setOverviewOpen(false)} type="button">×</button></div><nav aria-label="Presentation slides">{slides.map((item, index) => <button aria-current={index === current ? "page" : undefined} key={`${item.eyebrow}-${item.title}`} onClick={() => goTo(index)} type="button"><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.eyebrow}</small><strong>{item.title}</strong></div></button>)}</nav></aside></div>}
    </main>
  );
}
