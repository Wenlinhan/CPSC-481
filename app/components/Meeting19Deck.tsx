"use client";

import { useState } from "react";
import "../styles/meeting19.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

const PRIMARY_SOURCE_LABEL = "Current primary-source reading set";

const bpeStages = [
  {
    merge: "Start with characters",
    frequency: "No merge yet",
    words: [
      ["l", "o", "w", "</w>"],
      ["l", "o", "w", "e", "r", "</w>"],
      ["n", "e", "w", "e", "s", "t", "</w>"],
      ["w", "i", "d", "e", "s", "t", "</w>"],
    ],
  },
  {
    merge: "e + s → es",
    frequency: "9 occurrences",
    words: [
      ["l", "o", "w", "</w>"],
      ["l", "o", "w", "e", "r", "</w>"],
      ["n", "e", "w", "es", "t", "</w>"],
      ["w", "i", "d", "es", "t", "</w>"],
    ],
  },
  {
    merge: "es + t → est",
    frequency: "9 occurrences",
    words: [
      ["l", "o", "w", "</w>"],
      ["l", "o", "w", "e", "r", "</w>"],
      ["n", "e", "w", "est", "</w>"],
      ["w", "i", "d", "est", "</w>"],
    ],
  },
  {
    merge: "est + </w> → est</w>",
    frequency: "9 occurrences",
    words: [
      ["l", "o", "w", "</w>"],
      ["l", "o", "w", "e", "r", "</w>"],
      ["n", "e", "w", "est</w>"],
      ["w", "i", "d", "est</w>"],
    ],
  },
  {
    merge: "l + o → lo",
    frequency: "7 occurrences",
    words: [
      ["lo", "w", "</w>"],
      ["lo", "w", "e", "r", "</w>"],
      ["n", "e", "w", "est</w>"],
      ["w", "i", "d", "est</w>"],
    ],
  },
  {
    merge: "lo + w → low",
    frequency: "7 occurrences",
    words: [
      ["low", "</w>"],
      ["low", "e", "r", "</w>"],
      ["n", "e", "w", "est</w>"],
      ["w", "i", "d", "est</w>"],
    ],
  },
];

function BPEMergeLab() {
  const [stage, setStage] = useState(0);
  const current = bpeStages[stage];
  const wordLabels = ["low × 5", "lower × 2", "newest × 6", "widest × 3"];

  return (
    <div className="m19-bpe-lab">
      <section>
        <span>Corpus vocabulary with word counts</span>
        <h3>At each step, merge one frequent adjacent symbol pair.</h3>
        <p>
          Ties need a deterministic rule. This worked path chooses one of the
          highest-frequency pairs and applies it everywhere.
        </p>
        <nav aria-label="Choose a BPE merge step">
          {bpeStages.map((item, index) => (
            <button
              className={index === stage ? "active" : ""}
              key={item.merge}
              onClick={() => setStage(index)}
              type="button"
            >
              {index}
            </button>
          ))}
        </nav>
        <div className="m19-bpe-controls">
          <button
            disabled={stage === 0}
            onClick={() => setStage(value => Math.max(0, value - 1))}
            type="button"
          >
            Previous
          </button>
          <button
            disabled={stage === bpeStages.length - 1}
            onClick={() => setStage(value => Math.min(bpeStages.length - 1, value + 1))}
            type="button"
          >
            Apply next merge
          </button>
        </div>
      </section>
      <section className="m19-bpe-state">
        <header>
          <div>
            <span>Step {stage} of 5</span>
            <strong>{current.merge}</strong>
          </div>
          <b>{current.frequency}</b>
        </header>
        <div className="m19-bpe-words">
          {current.words.map((word, wordIndex) => (
            <article key={wordLabels[wordIndex]}>
              <small>{wordLabels[wordIndex]}</small>
              <div>
                {word.map((token, tokenIndex) => (
                  <code key={`${wordIndex}-${tokenIndex}-${token}`}>{token}</code>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

const tokenizerCases = [
  {
    label: "Name",
    text: "Wenlin Han",
    a: ["Wen", "lin", " Han"],
    b: ["W", "en", "lin", " H", "an"],
    question: "Which segmentation better reuses units seen in the training corpus?",
  },
  {
    label: "Code",
    text: "getUserProfile",
    a: ["get", "User", "Profile"],
    b: ["get", "U", "ser", "Pro", "file"],
    question: "A tokenizer does not execute camelCase or know the identifier's role.",
  },
  {
    label: "Multilingual",
    text: "人工智能",
    a: ["人工", "智能"],
    b: ["人", "工", "智", "能"],
    question: "Segmentation depends on the learned vocabulary, not a universal word list.",
  },
];

function TokenizerComparator() {
  const [active, setActive] = useState(0);
  const item = tokenizerCases[active];
  return (
    <div className="m19-tokenizer-compare">
      <nav aria-label="Choose text to tokenize">
        {tokenizerCases.map((entry, index) => (
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
        <span>Input string</span>
        <h3>{item.text}</h3>
        <div className="m19-tokenizer-row">
          <strong>Tokenizer A</strong>
          <div>{item.a.map((token, index) => <code key={`${token}-${index}`}>{token}</code>)}</div>
        </div>
        <div className="m19-tokenizer-row">
          <strong>Tokenizer B</strong>
          <div>{item.b.map((token, index) => <code key={`${token}-${index}`}>{token}</code>)}</div>
        </div>
        <p>{item.question}</p>
        <small>Illustrative segmentations: an actual result is model- and vocabulary-specific.</small>
      </section>
    </div>
  );
}

const embeddingRows = [
  { id: 7, token: "AI", vector: [0.8, -0.2, 0.1, 0.6] },
  { id: 31, token: "helps", vector: [-0.1, 0.7, 0.4, 0.2] },
  { id: 12, token: "people", vector: [0.3, 0.5, -0.6, 0.9] },
];

function EmbeddingLookupLab() {
  const [active, setActive] = useState(0);
  const item = embeddingRows[active];
  return (
    <div className="m19-embedding-lab">
      <section>
        <span>Token IDs</span>
        <nav aria-label="Choose a token ID for embedding lookup">
          {embeddingRows.map((row, index) => (
            <button
              className={index === active ? "active" : ""}
              key={row.id}
              onClick={() => setActive(index)}
              type="button"
            >
              <b>{row.id}</b>
              <small>{row.token}</small>
            </button>
          ))}
        </nav>
      </section>
      <div className="m19-lookup-arrow" aria-hidden="true">
        <i />
        <span>row lookup</span>
      </div>
      <section className="m19-embedding-matrix">
        <header>
          <span>E ∈ R<sup>|V|×d</sup></span>
          <strong>row {item.id}</strong>
        </header>
        <div>
          {item.vector.map((value, index) => (
            <code key={`${value}-${index}`}>{value.toFixed(1)}</code>
          ))}
        </div>
        <p>{item.token} → [{item.vector.map(value => value.toFixed(1)).join(", ")}]</p>
      </section>
    </div>
  );
}

const contextCases = [
  {
    sentence: "The bank approved the loan.",
    neighbors: ["approved", "loan"],
    meaning: "financial institution",
    vector: [0.2, 0.9, -0.1],
  },
  {
    sentence: "The canoe reached the river bank.",
    neighbors: ["river", "canoe"],
    meaning: "land beside water",
    vector: [0.8, -0.2, 0.6],
  },
];

function ContextualEmbeddingStudio() {
  const [active, setActive] = useState(0);
  const item = contextCases[active];
  return (
    <div className="m19-context-studio">
      <nav aria-label="Choose a sentence containing bank">
        {contextCases.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.sentence}
            onClick={() => setActive(index)}
            type="button"
          >
            Context {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <h3>{item.sentence}</h3>
        <div className="m19-context-flow">
          <article>
            <span>Lookup input</span>
            <strong>E[bank]</strong>
            <small>same learned row before context</small>
          </article>
          <i>+</i>
          <article>
            <span>Attention context</span>
            <strong>{item.neighbors.join(" + ")}</strong>
            <small>information from this sequence</small>
          </article>
          <i>→</i>
          <article className="result">
            <span>Contextual state</span>
            <strong>[{item.vector.join(", ")}]</strong>
            <small>{item.meaning}</small>
          </article>
        </div>
      </section>
    </div>
  );
}

function PositionStudio() {
  const [ordered, setOrdered] = useState(true);
  const words = ordered ? ["dog", "bites", "person"] : ["person", "bites", "dog"];
  return (
    <div className="m19-position-studio">
      <section>
        <span>Same three token types</span>
        <div className="m19-position-sentence">
          {words.map((word, index) => (
            <article key={`${word}-${index}`}>
              <small>position {index}</small>
              <strong>{word}</strong>
              <code>E[{word}] + P[{index}]</code>
            </article>
          ))}
        </div>
        <button onClick={() => setOrdered(value => !value)} type="button">
          Swap subject and object
        </button>
      </section>
      <section className="m19-position-equation">
        <span>2017 sinusoidal option</span>
        <code>PE(pos, 2i) = sin(pos / 10000<sup>2i/d</sup>)</code>
        <code>PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d</sup>)</code>
        <p>Learned position embeddings are another common design. Either way, position must enter the computation.</p>
      </section>
    </div>
  );
}

const qkvRoles = [
  {
    label: "Query",
    symbol: "qᵢ",
    role: "What information does position i request?",
    analogy: "A search request produced from the current token state.",
  },
  {
    label: "Key",
    symbol: "kⱼ",
    role: "What information does position j advertise?",
    analogy: "A searchable descriptor for a possible source position.",
  },
  {
    label: "Value",
    symbol: "vⱼ",
    role: "What information will position j contribute if selected?",
    analogy: "The payload mixed into the output—not the matching score itself.",
  },
];

function QKVRoleStudio() {
  const [active, setActive] = useState(0);
  const item = qkvRoles[active];
  return (
    <div className="m19-qkv-studio">
      <nav aria-label="Inspect query, key, and value roles">
        {qkvRoles.map((role, index) => (
          <button
            className={index === active ? "active" : ""}
            key={role.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{role.symbol}</span>
            {role.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Position i attends to position j</span>
        <div className="m19-qkv-equation">
          <code>score(i,j) = qᵢ · kⱼ</code>
          <i aria-hidden="true">→</i>
          <code>outputᵢ = Σⱼ αᵢⱼvⱼ</code>
        </div>
        <h3>{item.role}</h3>
        <p>{item.analogy}</p>
        <small>The analogy explains data flow; it does not imply a head has a stable human-readable meaning.</small>
      </section>
    </div>
  );
}

const shapeSteps = [
  { name: "Input states", expression: "X", shape: "n × d_model", note: "one row per sequence position" },
  { name: "Queries", expression: "Q = XW_Q", shape: "n × d_k", note: "W_Q: d_model × d_k" },
  { name: "Keys", expression: "K = XW_K", shape: "n × d_k", note: "W_K: d_model × d_k" },
  { name: "Values", expression: "V = XW_V", shape: "n × d_v", note: "W_V: d_model × d_v" },
  { name: "Scores", expression: "QKᵀ", shape: "n × n", note: "every query position scores every key position" },
  { name: "Attention output", expression: "AV", shape: "n × d_v", note: "A: n × n; each row of A sums to 1" },
];

function ShapeTraceStudio() {
  const [active, setActive] = useState(0);
  const item = shapeSteps[active];
  return (
    <div className="m19-shape-studio">
      <ol>
        {shapeSteps.map((step, index) => (
          <li key={step.name}>
            <button
              className={index === active ? "active" : ""}
              onClick={() => setActive(index)}
              type="button"
            >
              <span>{index + 1}</span>
              <strong>{step.name}</strong>
              <code>{step.shape}</code>
            </button>
          </li>
        ))}
      </ol>
      <section>
        <span>Shape trace · step {active + 1}</span>
        <h3>{item.expression}</h3>
        <strong>{item.shape}</strong>
        <p>{item.note}</p>
        <div className="m19-shape-blocks" aria-label={`Matrix shape ${item.shape}`}>
          {Array.from({ length: Math.max(4, active === 4 ? 16 : 8) }, (_, index) => <i key={index} />)}
        </div>
      </section>
    </div>
  );
}

const keyVectors = [
  { label: "k₁: strong match", key: [1, 1], score: 2 },
  { label: "k₂: partial match", key: [1, 0], score: 1 },
  { label: "k₃: no match", key: [0, 0], score: 0 },
];

function DotProductLab() {
  const [active, setActive] = useState(0);
  const item = keyVectors[active];
  return (
    <div className="m19-dot-lab">
      <section>
        <span>Fixed query</span>
        <h3>q = [1, 1]</h3>
        <p>A dot product is large when corresponding components align in this learned projection space.</p>
      </section>
      <nav aria-label="Choose a key vector">
        {keyVectors.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{entry.label}</span>
            <code>[{entry.key.join(", ")}]</code>
          </button>
        ))}
      </nav>
      <section className="m19-dot-result">
        <span>Compatibility score</span>
        <code>[1,1] · [{item.key.join(",")}]</code>
        <strong>= {item.score}</strong>
        <p>This score is not yet a probability. Softmax will normalize a whole row of scores.</p>
      </section>
    </div>
  );
}

function SoftmaxWorkedExample() {
  const [scaled, setScaled] = useState(true);
  const rawScores = [2, 1, 0];
  const displayScores = rawScores.map(score => scaled ? score / Math.sqrt(2) : score);
  const exponentials = displayScores.map(Math.exp);
  const denominator = exponentials.reduce((sum, value) => sum + value, 0);
  const weights = exponentials.map(value => value / denominator);

  return (
    <div className="m19-softmax-lab">
      <section>
        <span>One query row · d<sub>k</sub> = 2</span>
        <h3>raw qK<sup>T</sup> = [2, 1, 0]</h3>
        <button
          aria-pressed={scaled}
          onClick={() => setScaled(value => !value)}
          type="button"
        >
          {scaled ? "Using 1/√2 scaling" : "Scaling is off"}
        </button>
      </section>
      <div className="m19-softmax-steps">
        <article>
          <span>1 · scores</span>
          <code>[{displayScores.map(value => value.toFixed(3)).join(", ")}]</code>
        </article>
        <article>
          <span>2 · exponentiate</span>
          <code>[{exponentials.map(value => value.toFixed(3)).join(", ")}]</code>
        </article>
        <article>
          <span>3 · divide by Σ</span>
          <code>Σ = {denominator.toFixed(3)}</code>
        </article>
        <article className="result">
          <span>4 · attention weights</span>
          <code>[{weights.map(value => value.toFixed(3)).join(", ")}]</code>
          <small>row sum = {weights.reduce((sum, value) => sum + value, 0).toFixed(3)}</small>
        </article>
      </div>
    </div>
  );
}

function ValueMixLab() {
  const values = [[1, 0], [0, 2], [-1, 1]];
  const weights = [0.576, 0.284, 0.14];
  const output = [
    weights.reduce((sum, weight, index) => sum + weight * values[index][0], 0),
    weights.reduce((sum, weight, index) => sum + weight * values[index][1], 0),
  ];
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="m19-value-mix">
      <section>
        <span>Attention weights</span>
        <div>{weights.map(weight => <code key={weight}>{weight.toFixed(3)}</code>)}</div>
      </section>
      <i aria-hidden="true">×</i>
      <section>
        <span>Value rows</span>
        <div>{values.map((value, index) => <code key={index}>v{index + 1}=[{value.join(",")}]</code>)}</div>
      </section>
      <i aria-hidden="true">=</i>
      <section className="result">
        <span>Weighted output</span>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? `[${output.map(value => value.toFixed(3)).join(", ")}]` : "Predict, then reveal"}
        </button>
        <small>0.576v₁ + 0.284v₂ + 0.140v₃</small>
      </section>
    </div>
  );
}

function CausalMaskLab() {
  const [masked, setMasked] = useState(true);
  const labels = ["The", "robot", "can", "learn"];
  return (
    <div className="m19-mask-lab">
      <section>
        <span>Decoder self-attention</span>
        <h3>{masked ? "Causal mask on" : "Causal mask off"}</h3>
        <p>
          {masked
            ? "Row i may use positions 0 through i, never a future target token."
            : "Information leaks from future target positions during next-token training."}
        </p>
        <button
          aria-pressed={masked}
          onClick={() => setMasked(value => !value)}
          type="button"
        >
          Toggle mask
        </button>
      </section>
      <div className="m19-mask-matrix" role="img" aria-label={masked ? "Lower triangular causal attention mask" : "Unmasked attention matrix"}>
        <span />
        {labels.map(label => <b key={`column-${label}`}>{label}</b>)}
        {labels.flatMap((row, rowIndex) => [
          <b key={`row-${row}`}>{row}</b>,
          ...labels.map((column, columnIndex) => {
            const blocked = masked && columnIndex > rowIndex;
            return (
              <i className={blocked ? "blocked" : "allowed"} key={`${row}-${column}`}>
                {blocked ? "−∞" : "0"}
              </i>
            );
          }),
        ])}
      </div>
    </div>
  );
}

const attentionHeads = [
  {
    label: "Head 1",
    focus: "local syntax candidate",
    links: [["can", "robot"], ["learn", "can"]],
    color: "cyan",
  },
  {
    label: "Head 2",
    focus: "longer-range identity candidate",
    links: [["it", "robot"], ["learn", "robot"]],
    color: "violet",
  },
  {
    label: "Head 3",
    focus: "position or punctuation candidate",
    links: [["learn", "."], ["can", "learn"]],
    color: "amber",
  },
];

function MultiHeadStudio() {
  const [active, setActive] = useState(0);
  const item = attentionHeads[active];
  return (
    <div className={`m19-head-studio ${item.color}`}>
      <nav aria-label="Inspect an attention head">
        {attentionHeads.map((head, index) => (
          <button
            className={index === active ? "active" : ""}
            key={head.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {head.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Illustrative projection space</span>
        <h3>{item.focus}</h3>
        <div className="m19-head-tokens">
          {["the", "robot", "said", "it", "can", "learn", "."].map(token => (
            <code key={token}>{token}</code>
          ))}
        </div>
        <div className="m19-head-links">
          {item.links.map(([from, to]) => (
            <p key={`${from}-${to}`}><strong>{from}</strong><i>attends to</i><strong>{to}</strong></p>
          ))}
        </div>
        <small>A learned head is not guaranteed to align with a stable human linguistic category.</small>
      </section>
      <aside>
        <code>head<sub>h</sub> = Attention(XW<sup>Q</sup><sub>h</sub>, XW<sup>K</sup><sub>h</sub>, XW<sup>V</sup><sub>h</sub>)</code>
        <code>MHA(X) = Concat(head₁,…,head<sub>H</sub>)W<sup>O</sup></code>
      </aside>
    </div>
  );
}

function TransformerBlockDiagram() {
  const [active, setActive] = useState(0);
  const stages = [
    { name: "Input", formula: "X", detail: "token states with position information" },
    { name: "Self-attention", formula: "MHA(X)", detail: "mix information across allowed positions" },
    { name: "Add & Norm", formula: "Z = LN(X + MHA(X))", detail: "residual path plus normalization in the 2017 post-norm block" },
    { name: "Feed-forward", formula: "FFN(Z)", detail: "the same two-layer MLP is applied independently at every position" },
    { name: "Add & Norm", formula: "Y = LN(Z + FFN(Z))", detail: "second residual path produces the block output" },
  ];
  const item = stages[active];
  return (
    <div className="m19-block-diagram">
      <ol aria-label="Transformer block stages">
        {stages.map((stage, index) => (
          <li key={`${stage.name}-${index}`}>
            <button
              className={index === active ? "active" : ""}
              onClick={() => setActive(index)}
              type="button"
            >
              <span>{index + 1}</span>
              <strong>{stage.name}</strong>
            </button>
            {index < stages.length - 1 && <i aria-hidden="true">↑</i>}
          </li>
        ))}
      </ol>
      <section>
        <span>Selected stage</span>
        <h3>{item.formula}</h3>
        <p>{item.detail}</p>
        <code>FFN(x) = max(0, xW₁ + b₁)W₂ + b₂</code>
        <small>Pre-norm variants reorder normalization; always read the implementation or diagram.</small>
      </section>
    </div>
  );
}

function ArchitectureCompare() {
  const [decoderOnly, setDecoderOnly] = useState(false);
  return (
    <div className="m19-architecture">
      <nav aria-label="Compare transformer architectures">
        <button className={!decoderOnly ? "active" : ""} onClick={() => setDecoderOnly(false)} type="button">
          2017 encoder–decoder
        </button>
        <button className={decoderOnly ? "active" : ""} onClick={() => setDecoderOnly(true)} type="button">
          Decoder-only next-token model
        </button>
      </nav>
      {!decoderOnly ? (
        <section>
          <article><span>Source tokens</span><strong>Encoder stack</strong><small>bidirectional self-attention</small></article>
          <i>→</i>
          <article><span>Target prefix</span><strong>Decoder stack</strong><small>masked self-attention + encoder attention</small></article>
          <i>→</i>
          <article><span>Output</span><strong>next target token</strong><small>translation distribution</small></article>
        </section>
      ) : (
        <section>
          <article><span>Prefix</span><strong>Decoder blocks</strong><small>causal self-attention only</small></article>
          <i>→</i>
          <article><span>Final position</span><strong>Linear + softmax</strong><small>scores over the vocabulary</small></article>
          <i>→</i>
          <article><span>Loop</span><strong>append one token</strong><small>then run again on the longer prefix</small></article>
        </section>
      )}
      <p>
        The Transformer paper presented an encoder–decoder translation system.
        Decoder-only next-token prediction is one later use of transformer blocks.
      </p>
    </div>
  );
}

const traceQuestions = [
  {
    prompt: "Tokens T have shape 6. What is E[T] when d_model = 8?",
    answer: "6 × 8",
    why: "Six sequence positions, each represented by an eight-dimensional row.",
  },
  {
    prompt: "For two heads with d_k = d_v = 4, what is one Q matrix?",
    answer: "6 × 4",
    why: "Each head projects every one of the six positions into its own four-dimensional query space.",
  },
  {
    prompt: "What is QKᵀ for one head?",
    answer: "6 × 6",
    why: "Every one of six queries scores every one of six keys.",
  },
  {
    prompt: "After two 6 × 4 head outputs are concatenated?",
    answer: "6 × 8",
    why: "Concatenation joins features, not positions: 4 + 4 = 8 columns.",
  },
  {
    prompt: "What shape should W_O have to preserve d_model = 8?",
    answer: "8 × 8",
    why: "It maps the concatenated eight features back to eight model features.",
  },
];

function CumulativeShapeLab() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = traceQuestions[active];
  const select = (index: number) => {
    setActive(index);
    setRevealed(false);
  };
  return (
    <div className="m19-cumulative-shapes">
      <nav aria-label="Choose a tensor-shape question">
        {traceQuestions.map((question, index) => (
          <button
            className={index === active ? "active" : ""}
            key={question.prompt}
            onClick={() => select(index)}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <span>Given n=6 · d_model=8 · H=2 · d_k=d_v=4</span>
        <h3>{item.prompt}</h3>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide answer" : "Reveal after everyone commits"}
        </button>
        {revealed && (
          <div>
            <strong>{item.answer}</strong>
            <p>{item.why}</p>
          </div>
        )}
      </section>
    </div>
  );
}

const checkQuestions = [
  {
    prompt: "Which object contains learned parameters?",
    options: ["Token ID sequence", "Attention weights for one sentence", "Embedding matrix E"],
    correct: 2,
    explanation: "E is trained and reused across examples; token IDs and per-example attention weights are activations or inputs.",
  },
  {
    prompt: "Why add a causal mask in next-token training?",
    options: ["Prevent access to future target tokens", "Reduce vocabulary size", "Make every head interpretable"],
    correct: 0,
    explanation: "Without the mask, position i can see the token it is supposed to predict or later targets.",
  },
  {
    prompt: "Which multiplication creates the n × n compatibility matrix?",
    options: ["QKᵀ", "AV", "XW_V"],
    correct: 0,
    explanation: "Q is n × d_k and Kᵀ is d_k × n, so their product is n × n.",
  },
];

function FormativeCheck() {
  const [question, setQuestion] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const item = checkQuestions[question];
  const chooseQuestion = (index: number) => {
    setQuestion(index);
    setChoice(null);
  };
  return (
    <div className="m19-check">
      <nav aria-label="Choose a formative-assessment question">
        {checkQuestions.map((_, index) => (
          <button
            className={index === question ? "active" : ""}
            key={index}
            onClick={() => chooseQuestion(index)}
            type="button"
          >
            Q{index + 1}
          </button>
        ))}
      </nav>
      <section>
        <h3>{item.prompt}</h3>
        <div>
          {item.options.map((option, index) => (
            <button
              className={choice === index ? (index === item.correct ? "correct" : "incorrect") : ""}
              key={option}
              onClick={() => setChoice(index)}
              type="button"
            >
              <span>{String.fromCharCode(65 + index)}</span>
              {option}
            </button>
          ))}
        </div>
        {choice !== null && (
          <p><strong>{choice === item.correct ? "Correct." : "Reconsider."}</strong> {item.explanation}</p>
        )}
      </section>
    </div>
  );
}

function RepresentationPipeline() {
  return (
    <div className="m19-pipeline" role="img" aria-label="Text flows through tokenization, embedding, attention, transformer blocks, and vocabulary scores">
      {[
        ["Text", '"AI can learn"'],
        ["Tokens", "[7, 18, 42]"],
        ["Vectors", "3 × d_model"],
        ["Attention", "mix positions"],
        ["Blocks", "transform states"],
        ["Scores", "|V| logits"],
      ].map(([label, detail], index) => (
        <article key={label}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{label}</strong>
          <small>{detail}</small>
          {index < 5 && <i aria-hidden="true" />}
        </article>
      ))}
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Modern language models · Representation and computation",
    title: "Tokens, embeddings, attention, and transformers",
    subtitle: "Trace text into vectors, calculate one attention row, and assemble a decoder block.",
    content: (
      <div className="m19-cover">
        <section>
          <span>Module 13 · Lesson 19 · 75 minutes</span>
          <h3>How does a sequence of symbols become a context-sensitive computation?</h3>
          <p>We will follow every major tensor from input text to next-token scores.</p>
        </section>
        <RepresentationPipeline />
      </div>
    ),
    note: "Timing: 1 minute. Open with the central question. Tell students that every box in the pipeline will become an explicit representation, equation, or constraint by the end of class.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning objectives · Evidence of learning",
    title: "By the end, you can explain the mechanism and compute its core operation",
    content: (
      <div className="m19-objectives">
        <article><span>01</span><strong>Tokenize</strong><p>run five BPE merges and compare learned segmentations</p></article>
        <article><span>02</span><strong>Represent</strong><p>map IDs to embeddings and add positional information</p></article>
        <article><span>03</span><strong>Calculate</strong><p>derive Q, K, V shapes and one scaled softmax attention row</p></article>
        <article><span>04</span><strong>Assemble</strong><p>locate masks, heads, residual paths, normalization, and FFN</p></article>
      </div>
    ),
    note: "Timing: 2 minutes. Read the four performance verbs. Students will demonstrate these objectives in the BPE lab, the attention calculation, the shape trace, and the exit ticket.",
    sourceSlides: [],
  },
  {
    eyebrow: "Continuity · Search, learning, and representation",
    title: "A transformer is a learned computation over a structured state",
    content: (
      <div className="m19-continuity">
        <section>
          <span>Earlier course foundations</span>
          <article><strong>Representation</strong><p>states and features determine what a system can distinguish</p></article>
          <article><strong>Search and choice</strong><p>scores rank alternatives; constraints rule out invalid paths</p></article>
          <article><strong>Neural learning</strong><p>parameters change to reduce a loss over examples</p></article>
        </section>
        <i aria-hidden="true">→</i>
        <section>
          <span>Today&apos;s transformer view</span>
          <article><strong>State</strong><p>one vector per sequence position</p></article>
          <article><strong>Choice</strong><p>attention weights select mixtures of value vectors</p></article>
          <article><strong>Parameters</strong><p>embedding, projection, feed-forward, and output matrices</p></article>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Activate prior knowledge. Ask students to name the state, alternatives, constraints, and learned parameters in a transformer before revealing the right column.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 · Tokenization",
    title: "A tokenizer maps a string to vocabulary indices—not to understood words",
    content: (
      <div className="m19-token-definition">
        <section>
          <span>Function</span>
          <code>τ: string → (t₁, t₂, …, tₙ), &nbsp; tᵢ ∈ {"{0,…,|V|−1}"}</code>
          <p>The vocabulary V stores token strings or byte sequences. The integer ID is only an index; ID 900 is not more meaningful than ID 9.</p>
        </section>
        <div>
          <article><span>Not always a word</span><strong>un · believe · able</strong><p>subwords can share evidence across related strings</p></article>
          <article><span>Not always stable</span><strong>tokenizer A ≠ tokenizer B</strong><p>training corpus, algorithm, and vocabulary size change boundaries</p></article>
          <article><span>Changes computation</span><strong>n tokens → O(n²) score cells</strong><p>sequence length affects attention memory and work</p></article>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Define tokenization precisely. Ask why a vocabulary ID should not be treated as an ordinal feature and how a longer tokenization changes the attention score matrix.",
    sourceSlides: [],
  },
  {
    eyebrow: "BPE demonstration · Five merge steps",
    title: "Byte-pair encoding learns reusable units from adjacent-pair counts",
    content: <BPEMergeLab />,
    note: "Timing: 5 minutes. Run all five merges. Before each click, have students identify a highest-frequency adjacent pair from the weighted vocabulary. Explain that tie handling is implementation-specific and that each learned merge becomes available as a tokenization rule.",
    sourceSlides: [],
  },
  {
    eyebrow: "BPE reasoning · What the merge list does",
    title: "Greedy merges compress frequent patterns while retaining smaller fallback units",
    content: (
      <div className="m19-bpe-consequences">
        <section>
          <span>Learned merge order</span>
          {["e+s→es", "es+t→est", "est+</w>→est</w>", "l+o→lo", "lo+w→low"].map((merge, index) => (
            <article key={merge}><b>{index + 1}</b><code>{merge}</code></article>
          ))}
        </section>
        <section>
          <span>Apply merges in learned priority order</span>
          <article><strong>lowest</strong><p><code>low · est&lt;/w&gt;</code></p></article>
          <article><strong>lower</strong><p><code>low · e · r · &lt;/w&gt;</code></p></article>
          <article><strong>newest</strong><p><code>n · e · w · est&lt;/w&gt;</code></p></article>
          <article><strong>newer</strong><p><code>n · e · w · e · r · &lt;/w&gt;</code></p></article>
          <small>With character or byte fallback, a new string can still be represented even when no whole-word token exists.</small>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Have pairs apply the learned merge order to lowest and newer, then reveal the segmentations. Distinguish the training procedure that learns merges from the tokenization procedure that applies them.",
    sourceSlides: [],
  },
  {
    eyebrow: "SentencePiece · Raw text and boundaries",
    title: "SentencePiece learns subwords directly from raw sentences",
    content: (
      <div className="m19-sentencepiece">
        <section>
          <span>Whitespace-dependent pipeline</span>
          <div><code>AI helps everyone</code><i>→ pre-tokenize on spaces →</i><code>AI | helps | every · one</code></div>
        </section>
        <section>
          <span>SentencePiece view</span>
          <div><code>AI helps everyone</code><i>→ treat space as symbol ▁ →</i><code>▁AI | ▁helps | ▁every | one</code></div>
        </section>
        <div>
          <article><strong>Language independent</strong><p>No required language-specific word splitter before training.</p></article>
          <article><strong>Reversible</strong><p>The boundary symbol helps reconstruct spacing during detokenization.</p></article>
          <article><strong>Algorithm choice</strong><p>SentencePiece supports BPE and unigram language-model tokenization.</p></article>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Contrast an external whitespace tokenizer with SentencePiece's direct training on raw sentences. Emphasize that SentencePiece is a toolkit and representation convention, not a synonym for one unique segmentation.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class practice · Tokenizer comparison",
    title: "Inspect the segmentation before interpreting model behavior",
    content: <TokenizerComparator />,
    note: "Timing: 4 minutes. Visit all three inputs. Teams compare token count, reusable units, and likely failure points. Require the statement that the displayed segmentations are illustrative and actual output depends on the trained vocabulary.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 · Embedding lookup",
    title: "Token IDs select rows from a learned embedding matrix",
    content: (
      <div className="m19-embedding-definition">
        <section>
          <span>Parameters</span>
          <h3>E ∈ R<sup>|V| × d_model</sup></h3>
          <p>One trainable row per vocabulary item.</p>
        </section>
        <i aria-hidden="true">+</i>
        <section>
          <span>Input IDs</span>
          <h3>T ∈ {"{0,…,|V|−1}"}<sup>n</sup></h3>
          <p>One integer index per sequence position.</p>
        </section>
        <i aria-hidden="true">→</i>
        <section className="result">
          <span>Activations</span>
          <h3>X = E[T] ∈ R<sup>n × d_model</sup></h3>
          <p>One dense vector per position.</p>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Distinguish the learned parameter matrix E from the input indices T and the example-specific activation X. Ask which objects persist after the sentence has been processed.",
    sourceSlides: [],
  },
  {
    eyebrow: "Embedding demonstration · Row selection",
    title: "Lookup preserves sequence length and replaces each ID with d_model features",
    content: <EmbeddingLookupLab />,
    note: "Timing: 3 minutes. Click all three IDs. With |V| unspecified, d_model=4, and n=3, students state E has |V| by 4 rows and the looked-up tensor X has shape 3 by 4.",
    sourceSlides: [],
  },
  {
    eyebrow: "Static input, contextual state · Meaning in use",
    title: "The same token row can produce different contextual representations",
    content: <ContextualEmbeddingStudio />,
    note: "Timing: 4 minutes. Toggle both sentences. Clarify that E[bank] is initially the same row for the same token ID, while successive attention and feed-forward layers produce different hidden states because the surrounding sequence differs.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 · Positional information",
    title: "Without position, self-attention cannot distinguish a permutation by order alone",
    content: <PositionStudio />,
    note: "Timing: 3 minutes. Swap subject and object. Students explain why the token multiset is unchanged but the proposition differs. Present the sinusoidal formula from the 2017 paper and note that learned position embeddings are also common.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 4 · Query, key, and value",
    title: "Queries select, keys advertise, and values carry information",
    content: <QKVRoleStudio />,
    note: "Timing: 3 minutes. Visit all three roles. Keep the distinction precise: q and k form compatibility scores; v supplies the content mixed into the output. Warn against assuming a head has a permanent human-interpretable role.",
    sourceSlides: [],
  },
  {
    eyebrow: "Attention derivation · Tensor shapes",
    title: "Shape tracing makes the information flow testable",
    content: <ShapeTraceStudio />,
    note: "Timing: 4 minutes. Step through all six tensors. Use n=4, d_model=8, d_k=d_v=2 as a verbal example. Require students to justify why QK-transpose is n by n and why multiplying A by V restores one output row per position.",
    sourceSlides: [],
  },
  {
    eyebrow: "Attention arithmetic · Compatibility",
    title: "A dot product scores how strongly one query matches each key",
    content: <DotProductLab />,
    note: "Timing: 3 minutes. Students compute all three dot products before clicking. State that these learned-space compatibility scores can be negative and are not probabilities until normalized across the row.",
    sourceSlides: [],
  },
  {
    eyebrow: "Scaled dot-product attention · Why √d_k?",
    title: "Scaling controls score magnitude before softmax",
    content: (
      <div className="m19-scaling">
        <section>
          <span>Unscaled score</span>
          <code>q · k = Σ<sub>r=1</sub><sup>d_k</sup> q<sub>r</sub>k<sub>r</sub></code>
          <p>Under a simple independent, zero-mean, unit-variance assumption, the variance of this sum grows with d_k.</p>
        </section>
        <i aria-hidden="true">÷ √d<sub>k</sub></i>
        <section className="result">
          <span>Scaled score</span>
          <code>S = QK<sup>T</sup> / √d<sub>k</sub></code>
          <code>Attention(Q,K,V) = softmax(S + M)V</code>
          <p>Keeping typical magnitudes controlled helps avoid an overly saturated softmax and very small gradients. M adds 0 to allowed positions and −∞ to blocked positions.</p>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Give the variance intuition without overclaiming it as an exact distributional guarantee. Connect the scale factor to the denominator in the complete attention equation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked calculation · Softmax row",
    title: "Normalize one scaled score row into attention weights",
    content: <SoftmaxWorkedExample />,
    note: "Timing: 5 minutes. Students calculate the scaled scores, exponentials, denominator, and normalized weights. Toggle scaling to compare concentration. Check that the final row sums to one, allowing for rounding.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked calculation · Weighted values",
    title: "Attention returns a weighted mixture of value vectors",
    content: <ValueMixLab />,
    note: "Timing: 3 minutes. Use the scaled weights from the prior page. Students compute each output coordinate separately, then reveal approximately [0.436, 0.708]. Reinforce that the output dimension is d_v, not n.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 5 · Causal information flow",
    title: "A causal mask prevents a decoder from reading future target tokens",
    content: <CausalMaskLab />,
    note: "Timing: 3 minutes. Toggle the mask. Ask which cells row two may use and why future positions receive negative infinity before softmax. State the prevented failure explicitly: target leakage during next-token training.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 6 · Multi-head attention",
    title: "Multiple heads learn different projection spaces in parallel",
    content: <MultiHeadStudio />,
    note: "Timing: 3 minutes. Inspect all three illustrative heads, then read the equations. Emphasize that the examples are possible behaviors, not guaranteed labels. Concatenation combines feature channels before W_O mixes them.",
    sourceSlides: [],
  },
  {
    eyebrow: "Transformer block · Attention plus position-wise transformation",
    title: "Residual paths, normalization, and the FFN complete the block",
    content: <TransformerBlockDiagram />,
    note: "Timing: 3 minutes. Walk bottom to top through all five stages. State that the 2017 architecture uses post-norm equations shown here, while many implementations use pre-norm. Ask what the residual path preserves.",
    sourceSlides: [],
  },
  {
    eyebrow: "Architecture · From the 2017 system to decoder-only models",
    title: "The transformer is an architecture family, not one fixed language model",
    content: <ArchitectureCompare />,
    note: "Timing: 2 minutes. Compare both tabs. Preserve the historical distinction: the 2017 paper described an encoder-decoder translation model; decoder-only causal next-token prediction is one later configuration.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class practice · End-to-end shape trace",
    title: "Follow positions and features through two attention heads",
    content: <CumulativeShapeLab />,
    note: "Timing: 3 minutes. Work all five prompts quickly as a whole-class response sequence. Require dimension labels, not only numbers. Use the final W_O question to show how concatenated heads return to d_model.",
    sourceSlides: [],
  },
  {
    eyebrow: "Formative assessment · Commit, reveal, explain",
    title: "Locate parameters, activations, shapes, and information constraints",
    content: <FormativeCheck />,
    note: "Timing: 2 minutes. Run all three questions. Ask one student to defend the correct choice and another to explain why a distractor is wrong. Use results to decide whether to revisit embedding parameters, QK-transpose, or masking.",
    sourceSlides: [],
  },
  {
    eyebrow: "Exit ticket · Primary-source reading",
    title: "Explain one token's path from text to a contextual output vector",
    content: (
      <div className="m19-exit">
        <section>
          <span>Submit before leaving</span>
          <h3>In six labeled lines, trace:</h3>
          <ol>
            <li>string → tokens and IDs</li>
            <li>IDs → embedding rows + position</li>
            <li>X → Q, K, and V</li>
            <li>scores → scaled, masked softmax weights</li>
            <li>weights × V → head output</li>
            <li>heads → residual, norm, and FFN</li>
          </ol>
        </section>
        <section>
          <span>Required primary sources</span>
          <a href="https://aclanthology.org/P16-1162/" rel="noreferrer" target="_blank">
            Sennrich, Haddow &amp; Birch (2016) · Subword units
          </a>
          <a href="https://arxiv.org/abs/1808.06226" rel="noreferrer" target="_blank">
            Kudo &amp; Richardson (2018) · SentencePiece
          </a>
          <a href="https://papers.nips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html" rel="noreferrer" target="_blank">
            Vaswani et al. (2017) · Attention Is All You Need
          </a>
          <p>Next meeting: training objectives, instruction tuning, structured output, hallucination, and verification.</p>
        </section>
      </div>
    ),
    note: "Timing: 1 minute. Collect the six-line trace. The planned timings across all 25 pages total 75 minutes. Assign the three primary sources selectively: BPE algorithm, SentencePiece design, and Transformer sections 3.1 through 3.5.",
    sourceSlides: [],
  },
];

export function Meeting19Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Module 13 · Lesson 19"
      meetingTitle="Tokens, Embeddings, Attention, and Transformers"
      slides={slides}
      sourceCollectionLabel={PRIMARY_SOURCE_LABEL}
    />
  );
}
