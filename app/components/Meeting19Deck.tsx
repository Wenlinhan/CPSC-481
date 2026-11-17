"use client";

import { useState, type ReactNode } from "react";
import "../styles/meeting19.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

const PRIMARY_SOURCE_LABEL = "Current primary-source reading set";

function NotationGuide({ items }: { items: Array<[string, string]> }) {
  return (
    <aside className="m19-notation-guide" aria-label="Notation used on this page">
      <strong>Notation on this page</strong>
      <div>
        {items.map(([symbol, meaning]) => (
          <span key={`${symbol}-${meaning}`}><b>{symbol}</b> = {meaning}</span>
        ))}
      </div>
    </aside>
  );
}

function WithNotation({ children, items }: { children: ReactNode; items: Array<[string, string]> }) {
  return (
    <div className="m19-with-notation">
      <div className="m19-notation-content">{children}</div>
      <NotationGuide items={items} />
    </div>
  );
}

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
    idsA: [4182, 391, 9281],
    idsB: [54, 268, 391, 367, 272],
    question: "Which segmentation better reuses units seen in the training corpus?",
  },
  {
    label: "Code",
    text: "getUserProfile",
    a: ["get", "User", "Profile"],
    b: ["get", "U", "ser", "Pro", "file"],
    idsA: [456, 2189, 8821],
    idsB: [456, 52, 812, 1432, 1198],
    question: "A tokenizer does not execute camelCase or know the identifier's role.",
  },
  {
    label: "Multilingual",
    text: "人工智能",
    a: ["人工", "智能"],
    b: ["人", "工", "智", "能"],
    idsA: [12541, 38192],
    idsB: [2169, 3037, 19481, 7811],
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
        <header className="m19-tokenizer-input"><span>Input string</span><h3>{item.text}</h3></header>
        <div className="m19-tokenizer-diagram">
          {([
            ["Tokenizer A", item.a, item.idsA],
            ["Tokenizer B", item.b, item.idsB],
          ] as const).map(([label, tokens, ids]) => (
            <article key={label}>
              <header><strong>{label}</strong><b>n = {tokens.length} positions</b></header>
              <div className="m19-token-flow">
                <div><small>text</small><code>{item.text}</code></div><i aria-hidden="true">→</i>
                <div className="pieces"><small>subword pieces</small><p>{tokens.map((token, index) => <code key={`${token}-${index}`}>{token}</code>)}</p></div><i aria-hidden="true">→</i>
                <div className="ids"><small>vocabulary IDs</small><p>{ids.map((id) => <code key={id}>{id}</code>)}</p></div>
              </div>
            </article>
          ))}
        </div>
        <footer><p>{item.question}</p><small>Illustrative only: boundaries and IDs depend on the trained vocabulary.</small></footer>
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
        <aside className="m19-embedding-explanation">
          <strong>What are these numbers?</strong>
          <p>They are the four coordinates of this token&apos;s embedding vector (d = 4 in this small teaching example), not probabilities or ratings.</p>
          <strong>Where do they come from?</strong>
          <p>These displayed values are illustrative. In a real model, the row starts from initialized parameters and training updates its coordinates through gradient descent to reduce prediction loss. A single coordinate usually has no fixed meaning by itself.</p>
        </aside>
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
          <small>{scaled ? "Divide each raw score by √2: 2/√2, 1/√2, 0/√2." : "Scaling is off, so copy the raw scores unchanged."}</small>
        </article>
        <article>
          <span>2 · exponentiate</span>
          <code>[{exponentials.map(value => value.toFixed(3)).join(", ")}]</code>
          <small>Apply eˣ to each score: {displayScores.map(value => `e^${value.toFixed(3)}`).join(", ")}.</small>
        </article>
        <article>
          <span>3 · divide by Σ</span>
          <code>Σ = {denominator.toFixed(3)}</code>
          <small>Add the exponentials: {exponentials.map(value => value.toFixed(3)).join(" + ")} = {denominator.toFixed(3)}.</small>
        </article>
        <article className="result">
          <span>4 · attention weights</span>
          <code>[{weights.map(value => value.toFixed(3)).join(", ")}]</code>
          <small>Divide each exponential by Σ: {exponentials.map(value => `${value.toFixed(3)}/${denominator.toFixed(3)}`).join(", ")}. Row sum = {weights.reduce((sum, value) => sum + value, 0).toFixed(3)}.</small>
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
      <div className="m19-block-architecture" role="img" aria-label="Decoder transformer block with masked self-attention, two residual paths, normalization, and feed-forward network">
        <header><span>Decoder block</span><b>repeat × N layers</b></header>
        <article className={active === 4 ? "active" : ""}><small>output state</small><strong>Y</strong></article>
        <i aria-hidden="true">↑</i>
        <article className={active === 4 ? "active" : ""}><small>residual 2</small><strong>Add + Norm</strong><em>Z bypasses FFN</em></article>
        <i aria-hidden="true">↑</i>
        <article className={active === 3 ? "active" : ""}><small>position-wise</small><strong>Feed-forward network</strong></article>
        <i aria-hidden="true">↑</i>
        <article className={active === 2 ? "active" : ""}><small>residual 1</small><strong>Add + Norm</strong><em>X bypasses attention</em></article>
        <i aria-hidden="true">↑</i>
        <article className={active === 1 ? "active" : ""}><small>Q · K · V + causal mask</small><strong>Masked multi-head self-attention</strong></article>
        <i aria-hidden="true">↑</i>
        <article className={active === 0 ? "active" : ""}><small>token + position state</small><strong>Input X</strong></article>
      </div>
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

function ContextClueDemo() {
  const [choice, setChoice] = useState<"animal" | "street" | null>(null);
  const correct = choice === "animal";

  return (
    <div className="m19-context-clue">
      <span className="m19-context-kicker">Start with a sentence, not an equation</span>
      <blockquote>
        The <mark>animal</mark> did not cross the <mark>street</mark> because <b>it</b> was too tired.
      </blockquote>
      <p>What does <b>it</b> refer to?</p>
      <div className="m19-context-choices" role="group" aria-label="Choose what the pronoun refers to">
        <button aria-pressed={choice === "animal"} onClick={() => setChoice("animal")} type="button">
          <span aria-hidden="true">🐕</span><strong>the animal</strong>
        </button>
        <button aria-pressed={choice === "street"} onClick={() => setChoice("street")} type="button">
          <span aria-hidden="true">🛣️</span><strong>the street</strong>
        </button>
      </div>
      <div className={`m19-context-result ${choice ? "shown" : ""}`} aria-live="polite">
        {choice ? (
          <><strong>{correct ? "Yes - context links it to the animal." : "Try the other referent."}</strong><small>"too tired" describes the animal. Attention lets a later position combine clues from earlier positions.</small></>
        ) : (
          <><strong>Make a prediction.</strong><small>Then we will turn this everyday clue into tokens, vectors, and attention weights.</small></>
        )}
      </div>
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
          <h3>How does AI connect a later word to the right earlier clue?</h3>
          <p>Begin with a familiar sentence. Then trace how text becomes tokens, vectors, attention, and a context-sensitive output.</p>
        </section>
        <ContextClueDemo />
      </div>
    ),
    note: "Timing: 1 minute. Ask students to choose the referent before using transformer vocabulary. Connect the contextual clue to the lesson promise: we will make the mechanism visible as tokens, vectors, compatibility scores, and weighted information flow.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning objectives · Evidence of learning",
    title: "By the end, you can trace how text becomes a context-aware vector",
    content: (
      <div className="m19-objectives">
        <article><span aria-hidden="true">✂</span><strong>Split the text</strong><p>run five byte-pair encoding (BPE) merges—repeatedly joining frequent adjacent units—and compare two possible tokenizations</p></article>
        <article><span aria-hidden="true">▦</span><strong>Turn IDs into vectors</strong><p>look up embeddings and add information about position</p></article>
        <article><span aria-hidden="true">◎</span><strong>Calculate attention</strong><p>follow query (Q: what this position seeks), key (K: what each position matches on), and value (V: information retrieved), then compute one attention row</p></article>
        <article><span aria-hidden="true">⇧</span><strong>Build one block</strong><p>connect masking, multiple heads, residual paths, normalization, and the feed-forward network (FFN), which transforms each position independently</p></article>
      </div>
    ),
    note: "Timing: 2 minutes. Read the four performance verbs. Students will demonstrate these objectives in the BPE lab, the attention calculation, the shape trace, and the exit ticket.",
    sourceSlides: [],
  },
  {
    eyebrow: "Continuity · Search, learning, and representation",
    title: "A transformer repeatedly updates one vector for each token position",
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
    title: "A tokenizer splits text into pieces and gives each piece an ID",
    content: (
      <WithNotation items={[["τ", "tau (pronounced ‘taow,’ rhyming with ‘cow’); the tokenizer"], ["tᵢ", "the token ID at position i"], ["n", "number of tokens"], ["V", "the tokenizer's vocabulary"], ["|V|", "number of entries in V"]]}>
        <div className="m19-token-definition">
          <section>
            <span>Input → output</span>
            <code>τ (tau, pronounced “taow”): string → (t₁, t₂, …, tₙ), &nbsp; tᵢ ∈ {"{0,…,|V|−1}"}</code>
            <p>Read this as: the tokenizer τ turns a string into n token IDs. An ID is only a row number in a vocabulary; ID 900 is not “more meaningful” than ID 9.</p>
          </section>
          <div>
            <article><span>A token may be part of a word</span><strong>un · believe · able</strong><p>subwords let related strings reuse the same pieces</p></article>
            <article><span>Different tokenizers split differently</span><strong>tokenizer A ≠ tokenizer B</strong><p>the corpus, algorithm, and vocabulary size change the boundaries</p></article>
            <article><span>More tokens means more score cells</span><strong>n tokens → n × n</strong><p>attention compares every position with every position</p></article>
          </div>
        </div>
      </WithNotation>
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
    title: "Each token ID selects one learned row of numbers",
    content: (
      <WithNotation items={[["R", "the set of real numbers"], ["E", "embedding table"], ["T", "input token IDs"], ["X", "vectors used by the model"], ["n", "number of token positions"], ["d_model", "features in each model vector"]]}>
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
      </WithNotation>
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
    title: "Position information tells the model which token came first",
    content: <WithNotation items={[["pos", "token position"], ["i", "feature-pair index"], ["d_model", "features in each vector"], ["PE", "positional encoding added to the token vector"]]}><PositionStudio /></WithNotation>,
    note: "Timing: 3 minutes. Swap subject and object. Students explain why the token multiset is unchanged but the proposition differs. Present the sinusoidal formula from the 2017 paper and note that learned position embeddings are also common.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 4 · Query, key, and value",
    title: "Query asks, key matches, and value carries the information",
    content: <WithNotation items={[["Q", "queries"], ["K", "keys"], ["V", "values"], ["score(i,j)", "compatibility score between query position i and key position j"], ["αᵢⱼ", "normalized attention weight from query position i to source position j"]]}><QKVRoleStudio /></WithNotation>,
    note: "Timing: 3 minutes. Visit all three roles. Keep the distinction precise: q and k form compatibility scores; v supplies the content mixed into the output. Warn against assuming a head has a permanent human-interpretable role.",
    sourceSlides: [],
  },
  {
    eyebrow: "Attention derivation · Tensor shapes",
    title: "Tracking matrix shapes shows whether every step can be multiplied",
    content: <WithNotation items={[["X", "current token vectors"], ["W_Q, W_K, W_V", "learned projection matrices"], ["n", "number of positions"], ["d_model", "features in each input vector"], ["d_k", "query/key features per head"], ["d_v", "value/output features per head"], ["A", "attention-weight matrix"]]}><ShapeTraceStudio /></WithNotation>,
    note: "Timing: 4 minutes. Step through all six tensors. Use n=4, d_model=8, d_k=d_v=2 as a verbal example. Require students to justify why QK-transpose is n by n and why multiplying A by V restores one output row per position.",
    sourceSlides: [],
  },
  {
    eyebrow: "Attention arithmetic · Compatibility",
    title: "A dot product gives each query–key pair a match score",
    content: <WithNotation items={[["q", "one query vector"], ["kⱼ", "key vector at position j"], ["q · kⱼ", "their dot-product match score"], ["j", "which key position is being scored"]]}><DotProductLab /></WithNotation>,
    note: "Timing: 3 minutes. Students compute all three dot products before clicking. State that these learned-space compatibility scores can be negative and are not probabilities until normalized across the row.",
    sourceSlides: [],
  },
  {
    eyebrow: "Scaled dot-product attention · Why √d_k?",
    title: "Divide by √d_k so softmax does not become too extreme",
    content: (
      <WithNotation items={[["d_k", "number of query/key features"], ["S", "scaled score matrix"], ["M", "mask: 0 if allowed, −∞ if blocked"], ["softmax", "turns one score row into weights that sum to 1"]]}>
      <div className="m19-scaling">
        <section>
          <span>Unscaled score</span>
          <code>q · k = Σ<sub>r=1</sub><sup>d_k</sup> q<sub>r</sub>k<sub>r</sub></code>
          <p>Under a simple independent, zero-mean, unit-variance assumption, the variance of this sum grows with d_k.</p>
        </section>
        <i aria-label="Divide by square root of d sub k"><b>÷ √d<sub>k</sub></b><small>read: “divided by square root of d sub k”</small></i>
        <section className="result">
          <span>Scaled score</span>
          <code>S = QK<sup>T</sup> / √d<sub>k</sub></code>
          <code>Attention(Q,K,V) = softmax(S + M)V</code>
          <p>Keeping typical magnitudes controlled helps avoid an overly saturated softmax and very small gradients. M adds 0 to allowed positions and −∞ to blocked positions.</p>
        </section>
      </div>
      </WithNotation>
    ),
    note: "Timing: 2 minutes. Give the variance intuition without overclaiming it as an exact distributional guarantee. Connect the scale factor to the denominator in the complete attention equation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked calculation · Softmax row",
    title: "Softmax turns one row of scores into weights that add to 1",
    content: <WithNotation items={[["sⱼ", "scaled score for key position j"], ["eˢʲ", "positive exponentiated score"], ["αⱼ", "attention weight for position j"], ["Σ", "add across every position in the row"]]}><SoftmaxWorkedExample /></WithNotation>,
    note: "Timing: 5 minutes. Students calculate the scaled scores, exponentials, denominator, and normalized weights. Toggle scaling to compare concentration. Check that the final row sums to one, allowing for rounding.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked calculation · Weighted values",
    title: "Attention blends value vectors using the softmax weights",
    content: <WithNotation items={[["αⱼ", "attention weight for position j"], ["vⱼ", "value vector at position j"], ["z", "output vector for the current query"], ["d_v", "number of features in z"]]}><ValueMixLab /></WithNotation>,
    note: "Timing: 3 minutes. Use the scaled weights from the prior page. Students compute each output coordinate separately, then reveal approximately [0.436, 0.708]. Reinforce that the output dimension is d_v, not n.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 5 · Causal information flow",
    title: "A causal mask hides future tokens from the decoder",
    content: <WithNotation items={[["Mᵢⱼ", "mask entry for query row i and key column j"], ["0", "this position is allowed"], ["−∞", "this position becomes weight 0 after softmax"], ["j > i", "a future position"]]}><CausalMaskLab /></WithNotation>,
    note: "Timing: 3 minutes. Toggle the mask. Ask which cells row two may use and why future positions receive negative infinity before softmax. State the prevented failure explicitly: target leakage during next-token training.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 6 · Multi-head attention",
    title: "Multiple heads make several attention mixtures in parallel",
    content: <WithNotation items={[["MHA", "multi-head attention"], ["h", "number of attention heads"], ["headᵢ", "output from head i"], ["Concat", "join head outputs side by side"], ["W_O", "learned matrix that mixes heads back to d_model features"]]}><MultiHeadStudio /></WithNotation>,
    note: "Timing: 3 minutes. Inspect all three illustrative heads, then read the equations. Emphasize that the examples are possible behaviors, not guaranteed labels. Concatenation combines feature channels before W_O mixes them.",
    sourceSlides: [],
  },
  {
    eyebrow: "Transformer block · Attention plus position-wise transformation",
    title: "A transformer block adds attention, a skip path, normalization, and an FFN",
    content: <WithNotation items={[["x", "vector entering the block"], ["Z", "state after attention, residual addition, and layer normalization"], ["Y", "final block output after the FFN, residual addition, and layer normalization"], ["MHA", "multi-head attention"], ["LN", "layer normalization"], ["FFN", "small feed-forward network applied to each position"], ["x + …", "residual or skip connection"]]}><TransformerBlockDiagram /></WithNotation>,
    note: "Timing: 3 minutes. Walk bottom to top through all five stages. State that the 2017 architecture uses post-norm equations shown here, while many implementations use pre-norm. Ask what the residual path preserves.",
    sourceSlides: [],
  },
  {
    eyebrow: "Architecture · From the 2017 system to decoder-only models",
    title: "“Transformer” names a family of architectures, not one model",
    content: <WithNotation items={[["encoder", "reads an input sequence into contextual vectors"], ["decoder", "produces an output sequence"], ["causal", "may use only the current and earlier target positions"], ["LM", "language model"]]}><ArchitectureCompare /></WithNotation>,
    note: "Timing: 2 minutes. Compare both tabs. Preserve the historical distinction: the 2017 paper described an encoder-decoder translation model; decoder-only causal next-token prediction is one later configuration.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class practice · End-to-end shape trace",
    title: "Practice: follow positions and features through two heads",
    content: <WithNotation items={[["n", "4 token positions in this example"], ["d_model", "8 features per model vector"], ["h", "2 heads"], ["d_k = d_v", "4 features per head here"], ["W_O", "maps concatenated heads back to 8 features"]]}><CumulativeShapeLab /></WithNotation>,
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
      <WithNotation items={[["X", "token vectors after embedding and position are combined"], ["Q, K, V", "query, key, and value matrices"], ["FFN", "feed-forward network applied to each position"], ["norm", "layer normalization"]]}>
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
      </WithNotation>
    ),
    note: "Timing: 1 minute. Collect the six-line trace. The planned timings across all 25 pages total 75 minutes. Assign the three primary sources selectively: BPE algorithm, SentencePiece design, and Transformer sections 3.1 through 3.5.",
    sourceSlides: [],
  },
];

const lesson19InstructorNotes = [
  `Let us begin with the sentence on the screen: “The animal did not cross the street because it was too tired.” Before we use any technical vocabulary, decide what “it” refers to. The natural answer is the animal, because being tired is a property that makes sense for an animal. Notice what your brain just did: it connected a later word with an earlier clue and used the surrounding sentence to resolve the reference. A transformer performs a learned numerical version of that contextual linking. It does not understand the sentence in the human sense. It represents each text position with numbers, compares positions, and combines information from positions that receive larger learned attention weights. During this lesson we will make that process visible. We will start with the raw string, split it into tokens, replace token IDs with vectors, add position information, and then calculate how attention mixes information. Keep this opening example in mind. By the end, you should be able to explain how the vector at the position of “it” can incorporate evidence from “animal” and “tired.”`,
  `Here is our roadmap. First, we will split text into tokens. A token is not necessarily a word; it may be a whole word, part of a word, punctuation, or even a byte-level piece. Second, we will turn token IDs into vectors by looking up rows in an embedding table. Third, we will calculate attention. That means following queries, keys, and values through dot products, scaling, masking, softmax, and a weighted sum. Finally, we will place attention inside a transformer block with multiple heads, residual connections, layer normalization, and a feed-forward network. These are performance goals, not vocabulary goals. You should be able to carry out a small BPE merge, state the shape of an embedding result, compute one attention row, and trace a token through one block. The icons show the same progression visually: split, represent, compare, and update. If any stage is unclear, ask where the objects come from and what shape they have. Shape tracing will be one of our best error checks today.`,
  `Transformers connect to ideas we have already studied. In search, we defined a state, scored alternatives, and applied constraints. In neural learning, parameters changed to reduce a loss. A transformer also has a state: at any layer, each token position owns a vector. Attention scores possible information sources for that position, while a mask can forbid some sources. Learned matrices control how token vectors become queries, keys, values, and feed-forward features. The important shift is that the state is distributed across the sequence rather than stored in one symbolic node. Each layer updates every position's vector using information from other allowed positions. This does not mean the model literally searches a game tree. The comparison is conceptual: representation determines what can be distinguished, scores influence which information matters, constraints limit legal information flow, and learning adjusts parameters. As we proceed, ask four questions: What is the current representation? Which values are learned parameters? Which values are activations for this example? And what information is each position allowed to use?`,
  `A tokenizer is a function that converts a string into a sequence of integer IDs. The Greek letter tau names the tokenizer. The symbol t sub i means the token ID at position i, n is the number of tokens, V is the vocabulary, and vertical bars around V mean the size of that vocabulary. An ID is only an index into a table. ID 900 is not larger in meaning than ID 9, just as room 900 is not better than room 9. Tokens are also not guaranteed to be words. “Unbelievable” might be split into “un,” “believe,” and “able.” Different tokenizers can split the same text differently because they were trained on different data or use different vocabulary sizes. Tokenization also affects computation. If a sequence has n positions, a full self-attention score matrix contains n times n cells. More pieces therefore mean more pairwise comparisons. Before interpreting a model response, it is often useful to inspect how the input was tokenized.`,
  `This page demonstrates byte-pair encoding, or BPE, as a training procedure. We begin with words broken into small units and count adjacent pairs, weighted by how often each word appears. At each step, we select a most frequent neighboring pair and merge it into a reusable unit. Before advancing the demonstration, look across the current vocabulary and predict which pair has the highest weighted count. After the merge, every occurrence of that pair is replaced, and the counts are computed again. The merge order matters because a later merge can use a unit created earlier. In this example, e plus s becomes “es,” then “es” plus t becomes “est.” The end-of-word marker lets the procedure distinguish a piece at a word boundary from the same letters inside a word. If two pairs tie, an implementation needs a tie rule, so exact merge lists can differ. The key idea is simple: frequent neighboring patterns become larger units while smaller units remain available as fallback pieces.`,
  `Now we separate two ideas that are easy to mix up. Training BPE learns an ordered list of merge rules from a corpus. Tokenization later applies those learned rules to a new string in priority order. On the left, the list says which combinations were learned first. On the right, we apply that same list to several words. “Lowest” can use both “low” and “est,” but “lower” cannot use “est,” so its remaining characters stay smaller. “Newest” can reuse “est” even though the whole word was not in the training list. This is one reason subword tokenization generalizes better than a pure whole-word vocabulary. It can reuse frequent chunks and still spell an unfamiliar string with smaller pieces. The notation slash-w marks an end-of-word boundary in this teaching example. Modern tokenizers may represent boundaries differently. Read the examples from top to bottom and explain why the merge list compresses common patterns without requiring every possible word to have its own vocabulary entry.`,
  `SentencePiece addresses a practical problem: many pipelines first split text on spaces and then learn subwords inside those pieces. That assumes spaces reliably mark word boundaries, which is not equally suitable for every writing system. SentencePiece instead trains from raw sentences and treats whitespace as an ordinary symbol. The visible underline-like character represents a space or word-start marker. Because that boundary is encoded, the token sequence can be decoded back into text with spacing restored. SentencePiece is a toolkit, not one single segmentation algorithm. It supports both BPE and a unigram language-model approach, so two SentencePiece models can still produce different pieces. Compare the two pipelines on the page. The upper pipeline commits to words before subword processing. The lower pipeline learns pieces while preserving boundaries in the same symbol stream. The takeaway is not that SentencePiece always finds linguistically correct words. It learns useful statistical units directly from text while reducing dependence on a separate language-specific word splitter.`,
  `Use this page as a tokenizer inspection exercise. Select each example and look first at the number of pieces, then at where boundaries occur. Ask whether the pieces reuse meaningful-looking substrings, but do not assume that every learned piece corresponds to a human morpheme. A tokenizer optimizes a statistical vocabulary objective, not a linguistics exam. Longer or unusual words often split into more pieces because their exact forms are less frequent in the training data. Different scripts, spelling variants, emojis, or domain-specific notation can also produce surprising boundaries. These examples are illustrative; the exact output depends on the trained vocabulary and algorithm. For each input, describe one benefit and one possible cost of the displayed segmentation. A reusable subword may help share evidence across related strings. Extra pieces, however, lengthen the sequence and therefore increase attention work. This is why inspecting tokenization can help explain cost, truncation, or inconsistent handling of names and technical terms before we blame the attention mechanism itself.`,
  `The embedding table converts discrete IDs into continuous vectors. E is the learned table. It has one row for every vocabulary item and d-model columns, where d-model is the number of features in each model vector. T is the sequence of input IDs, and n is the number of positions. The expression E of T means “select the rows of E named by those IDs.” The result X has n rows and d-model columns: one vector per position. Keep parameters and activations separate. E is a learned parameter that remains part of the model after this sentence is finished. T and X belong to the current example. Also remember that lookup does not treat IDs as numerical magnitudes. The model does not multiply by token ID 900; it selects row 900. Point to each object and say its role: E stores learned rows, T says which rows are needed, and X is the ordered collection of vectors that enters the next computation.`,
  `Let us make embedding lookup concrete. We have three token IDs, so the sequence length n is three. Each selected row contains four values, so d-model is four. Click an ID and watch the corresponding table row become the vector for that sequence position. When all three rows are selected, the output X has shape three by four. The number of rows stays equal to the number of token positions; lookup changes the representation at each position from one integer into four learned features. If the vocabulary contains fifty thousand entries, the full embedding table E would have fifty thousand rows by four columns in this toy example, but only three rows are retrieved for this input. Repeated IDs retrieve the same initial embedding row. Later layers may turn those identical starting rows into different contextual states because their neighbors and positions differ. Before moving on, state the shapes aloud: T has length three, E has vocabulary-size by four, and X is three by four.`,
  `The word “bank” shows why we distinguish an input embedding from a contextual representation. At lookup time, the same token ID selects the same row E of bank in both sentences. In “deposit money at the bank,” surrounding words support a financial meaning. In “sit on the river bank,” the context supports land beside water. Attention and feed-forward layers update the vector at the bank position using different neighboring evidence, so the later hidden states can differ even though the starting lookup row was the same. Toggle between the sentences and inspect which contextual clues change. We should not say that one embedding table row permanently stores every dictionary definition. Instead, the row supplies a learned starting representation, and the network constructs context-sensitive states layer by layer. This also explains why the same surface token can participate in different predictions. The crucial distinction is: static lookup row first, contextual hidden vector later. The transformation depends on the entire allowed sequence, the position information, and the learned parameters.`,
  `If self-attention received only a bag of token vectors, it would not know whether “dog bites person” or “person bites dog” came first. The same token identities are present, but order changes the proposition. Position information solves this by adding a position-dependent vector to each token embedding before attention. Here, pos means the token position, i selects a pair of features, d-model is the vector width, and PE is the positional encoding. The sine and cosine formulas assign smoothly varying values across positions and frequencies. You do not need to memorize the formula today; focus on its job. Each position receives a distinguishable pattern that attention can use alongside token content. Swap the sentence order in the demonstration and notice that the tokens remain the same while their positions change. The original 2017 transformer used sinusoidal encodings. Many later systems use learned or rotary position methods. Those methods differ, but all address the same need: the model must represent sequence order rather than treating positions as interchangeable.`,
  `Query, key, and value are three learned views of the current token vectors. Starting from X, the model multiplies by three learned matrices: W-Q, W-K, and W-V. The results are Q, K, and V. A query represents what the current position is looking for. A key represents what each possible source position advertises for matching. Their dot product becomes a compatibility score. A value carries the information that may actually be mixed into the output. Use the metaphor carefully: it helps remember the roles, but these are learned vectors, not English questions and answers. Click through the three roles. When processing “it,” its query might match features in the key for “animal.” A high match gives that position more weight, and the corresponding value contributes more to the new representation of “it.” The query and key decide how much; the value decides what content is transferred. Never replace this distinction with the vague statement that attention simply “looks at important words.”`,
  `Shape tracing lets us verify the attention calculation before doing arithmetic. Suppose X has n rows and d-model columns. Multiplying X by W-Q produces Q with n rows and d-k columns. K has the same shape, while V has n rows and d-v columns. Q times K transpose produces an n by n matrix because every query position receives one score for every key position. After scaling, masking, and applying softmax row by row, A is still n by n. Finally, A times V produces n by d-v: one output row for each original position. In the toy example, n is four, d-model is eight, and d-k and d-v are two. Therefore Q and K are four by two, QK transpose is four by four, and the output is four by two. Step through each object and check the inner dimensions. If two inner dimensions do not match, the multiplication is impossible. Shapes therefore reveal both computational mistakes and the information structure of attention.`,
  `A dot product creates one compatibility score. Take one query q and compare it with each key k sub j. Multiply matching coordinates and add the products. That sum is q dot k sub j. Compute the three displayed scores before revealing them. A larger score means stronger alignment in the learned feature space for this query, not necessarily human semantic similarity. Scores may be positive, zero, or negative. They are not yet probabilities, because they do not have to be between zero and one and they do not sum to one. The index j identifies which source position is being scored. Repeating this operation against every key fills one row of the attention score matrix. Repeating it for every query fills the whole n by n matrix. This is the exact numerical step behind the phrase “compare every position with every position.” On the next page we will scale these scores, and after that softmax will convert one row into nonnegative weights that sum to one.`,
  `Why divide by the square root of d-k? A dot product adds d-k coordinate products. Under a simple independent, zero-mean, unit-variance intuition, the variance of that sum grows with d-k. As vectors become wider, raw scores can become large in magnitude. Softmax applied to very large positive and negative values becomes extremely concentrated, which can produce very small gradients for most entries. Dividing by square root d-k keeps the typical scale more controlled. S names the scaled score matrix. M is the mask: allowed locations add zero, while blocked locations add negative infinity so their softmax weight becomes zero. Softmax then converts each row into weights that sum to one, and multiplying those weights by V returns the weighted value mixture. Read the complete equation from left to right: compare Q with K, scale, apply the mask, normalize each row, then mix V. The scaling is a stabilization device; it does not by itself determine which token should receive attention.`,
  `Now we calculate a complete softmax row. Start with the scaled scores s sub j. Exponentiating makes every value positive. Then divide each exponent by the sum of all exponentials in the row. The resulting alpha sub j values are attention weights. Sigma means add across all candidate positions. Work through the numbers in order: scaled scores, exponentials, denominator, and normalized weights. Check the result by adding the weights; allowing for rounding, they must sum to one. Toggle the comparison with unscaled scores. The unscaled row is usually more concentrated because larger score magnitudes become larger exponential ratios. Softmax preserves order—a larger input score receives a larger weight—but it changes the values into a normalized distribution over source positions. A common mistake is to normalize each score independently. Softmax is relational: every weight depends on the entire row through the shared denominator. These alpha values will be used immediately on the next page to blend the value vectors.`,
  `Attention weights are useful only because they control a mixture of values. For the current query, multiply each value vector v sub j by its attention weight alpha sub j, then add the vectors coordinate by coordinate. The result z is the new output vector for this query. Its width is d-v, the number of features in each value vector. It is not the sequence length n. Use the weights from the previous page and calculate the first output coordinate, then the second. The displayed result is approximately point four three six and point seven zero eight. Interpret this as a weighted blend in a learned feature space, not as a copied word. A position with weight zero contributes nothing; a position with a larger weight contributes more of its value features. Repeating the same operation for every query row gives one output vector per sequence position. This is how attention moves from pairwise compatibility scores to updated representations that contain context from other allowed positions.`,
  `A decoder used for next-token prediction must not read future target tokens during training. The causal mask enforces that rule. M sub i j refers to the mask entry for query position i and key position j. If j is greater than i, the key lies in the future, so the mask adds negative infinity before softmax. Its resulting weight becomes zero. Allowed current and earlier positions add zero and keep their computed scores. Toggle the mask and inspect the triangular pattern. Row one can use only position one. Row two can use positions one and two. Later rows can use a longer prefix. Without this restriction, the model could cheat during training by attending directly to the answer token it is supposed to predict. That failure is called target leakage. The causal mask does not erase future tokens from the training batch; it blocks information flow in the attention calculation. Encoder-style bidirectional attention uses a different rule because it may allow every position to use both earlier and later context.`,
  `One attention head creates one learned comparison and value-mixing space. Multi-head attention runs h such heads in parallel. Each head has its own learned projections, so it can form a different pattern of scores and a different value mixture. The head labels in this demonstration are illustrations of possible behavior, not permanent guaranteed jobs. After the heads produce their outputs, Concat joins their feature channels side by side. W-O is a learned output matrix that mixes those concatenated features back into d-model dimensions. If there are h heads and each has d-v features, concatenation has h times d-v features. Often those dimensions are chosen so the total equals d-model, but the general equations do not require every implementation to use identical widths. Explore the head views, then follow the equation: compute each head, concatenate them, and apply W-O. Multiple heads increase the number of learned relational subspaces available at the same layer; they do not mean the system contains h independent explanations.`,
  `Attention is only one part of a transformer block. Follow the diagram from bottom to top. The input x enters multi-head attention. A residual, or skip, connection adds x back to the attention result, helping preserve the incoming representation and supporting gradient flow. Layer normalization, labeled LN, stabilizes the feature distribution. Then a feed-forward network, FFN, applies the same small neural transformation independently to every position. A second residual connection and normalization complete the block. The 2017 transformer used the post-normalization ordering shown in its equations, while many modern implementations place normalization before a sublayer. Both are transformer variants, so always check the architecture being discussed. The phrase “position-wise” means the FFN does not mix different positions directly; attention already performs that cross-position communication. The FFN transforms features within each position. Stacking many blocks repeatedly alternates information mixing across positions with nonlinear feature transformation within positions.`,
  `The word transformer names an architecture family, not one specific language model. The 2017 paper presented an encoder-decoder system for translation. The encoder reads an input sequence using bidirectional self-attention and produces contextual representations. The decoder generates an output sequence, uses causal self-attention over its earlier outputs, and also attends to encoder representations. A decoder-only language model removes the separate encoder and repeatedly applies causal blocks to predict the next token. Encoder-only models are another common family used for representation and classification. Here, LM means language model, and causal means a position can use only itself and earlier target positions. Compare the two views and identify where the mask belongs and what information each component receives. Avoid saying “the transformer predicts the next word” as a universal definition. Some transformers encode, some decode, and some do both. Tokenization, attention, and feed-forward blocks are reusable mechanisms arranged differently for different learning objectives.`,
  `This practice page combines the shape rules. We have n equals four token positions and d-model equals eight features per model vector. There are h equals two heads. In this example, each head uses d-k and d-v equal to four. Start with X: four by eight. Each head projects X into Q, K, and V with four rows. Q times K transpose is four by four because every query compares with every key. Multiplying the four-by-four attention matrix by the four-by-four V produces a four-by-four head output. Two head outputs are concatenated along the feature dimension, producing four by eight. W-O then maps those eight concatenated features back to eight model features, so the final result remains four by eight. Work each prompt before revealing it and explain the inner dimensions, not just the final numbers. The invariant to remember is that attention preserves one output row per token position, while projection and concatenation change feature width.`,
  `Use these questions to diagnose the most common confusions. First, distinguish a learned parameter from an activation. The embedding table E is a parameter stored in the model; X is created for the current input. Second, remember why QK transpose is n by n: rows are query positions and columns are key positions, so the matrix contains every permitted position pair. Third, interpret masking as an information constraint. Adding negative infinity before softmax makes a blocked cell's weight zero, preventing future-token leakage in causal attention. Commit to an answer before revealing it. Then explain why each distractor is wrong. A vocabulary ID is not a feature magnitude, softmax does not change matrix shape, and a causal mask does not remove the need for position information. If one category remains weak, return to the corresponding visual: embedding lookup for parameters versus activations, the shape trace for matrix dimensions, or the triangular mask for allowed information flow.`,
  `For the exit ticket, explain one token's entire path in six labeled lines. Begin with the string becoming token pieces and integer IDs. Next, use those IDs to select embedding rows and combine them with position information, producing X. Then project X into Q, K, and V. Compute query-key scores, divide by square root d-k, add the mask, and apply softmax to obtain weights. Multiply those weights by V to produce each head output. Finally, concatenate heads, apply W-O, and pass through residual connections, normalization, and the position-wise FFN. The notation box defines the symbols reused here: X is the sequence of token vectors, Q K V are query key and value matrices, FFN is the feed-forward network, and norm means layer normalization. Your explanation should say what each step accomplishes, not merely copy arrows. The readings below provide the primary technical sources for subword units, SentencePiece, and the transformer architecture. Next lesson will build on this mechanism to discuss training, instruction following, structured output, hallucination, and verification.`,
];

slides.forEach((slide, index) => {
  slide.note = lesson19InstructorNotes[index];
});

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
