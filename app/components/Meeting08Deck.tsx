"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  RevealSequence,
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const sourceRoot = "/course-source/l05-minimax-pruning";

const depthFirstSteps = [
  {
    label: "Enter the root",
    node: "MAX root",
    bounds: "α = −∞ · β = +∞",
    detail: "Choose the leftmost action and carry both path bounds to its child.",
  },
  {
    label: "Descend one ply",
    node: "MIN child",
    bounds: "α = −∞ · β = +∞",
    detail: "Do not evaluate every sibling first. Alpha-beta follows one branch depth-first.",
  },
  {
    label: "Reach a leaf",
    node: "Terminal or cutoff state",
    bounds: "return utility/evaluation",
    detail: "Use exact utility at a terminal state or the same cutoff evaluation used by depth-limited minimax.",
  },
  {
    label: "Back up one edge",
    node: "MIN child",
    bounds: "β ← min(β, returned value)",
    detail: "Update the current node only after the child value is known; then decide whether another sibling matters.",
  },
  {
    label: "Return to the parent",
    node: "MAX root",
    bounds: "α ← max(α, child value)",
    detail: "Values return to parents one level at a time. A bound may then make a different subtree irrelevant.",
  },
];

function DepthFirstVisitDemo() {
  const [step, setStep] = useState(0);
  const state = depthFirstSteps[step];

  return (
    <div className="frontier-trace">
      <section>
        <span>Depth-first trace · {step + 1} of {depthFirstSteps.length}</span>
        <h3>{state.label}</h3>
        <p>{state.detail}</p>
        <div>
          <button
            disabled={step === 0}
            onClick={() => setStep(value => Math.max(0, value - 1))}
            type="button"
          >
            Previous
          </button>
          <button
            disabled={step === depthFirstSteps.length - 1}
            onClick={() => setStep(value => Math.min(depthFirstSteps.length - 1, value + 1))}
            type="button"
          >
            Next
          </button>
          <button onClick={() => setStep(0)} type="button">Reset</button>
        </div>
      </section>
      <div className="frontier-queues">
        <article>
          <span>Current node</span>
          <strong>{state.node}</strong>
          <small>Only one active depth-first path is being evaluated.</small>
        </article>
        <article>
          <span>Current path bounds</span>
          <strong>{state.bounds}</strong>
          <small>Alpha never decreases; beta never increases along the active search.</small>
        </article>
      </div>
    </div>
  );
}


function CutoffExampleTree({ kind, step }: { kind: "max" | "min"; step: number }) {
  const max = kind === "max";
  const leaves = max ? [3, 7, 9] : [8, 2, 0];
  return <figure className="minimax-trace-tree lesson08-cutoff-tree">
    <svg viewBox="0 0 600 340" role="img" aria-label={max ? "MAX trace: a MAX ancestor has alternative 3, then a MIN ancestor has alternative 6. The current MAX node searches children 3, 7, 9. Reaching 7 causes a beta cutoff and skips 9." : "MIN trace: a MIN ancestor has alternative 9, then a MAX ancestor has alternative 4. The current MIN node searches children 8, 2, 0. Reaching 2 causes an alpha cutoff and skips 0."}>
      <g stroke="#8190a7" strokeWidth="2" fill="none"><path d="M220 44 L85 106 M220 44 L385 106 M385 132 L225 198 M385 132 L450 198" /></g>
      <g fontFamily="Arial" fontSize="21" textAnchor="middle" fill="#111827">
        <rect x="145" y="8" width="150" height="42" rx="9" fill="#1d2b45" /><text x="220" y="36" fill="white">{max ? "MAX ancestor" : "MIN ancestor"}</text>
        <rect x="20" y="90" width="130" height="58" rx="9" fill="#e7edf5" /><text x="85" y="113" fontSize="17">Done subtree</text><text x="85" y="139" fontWeight="700">{max ? "3 → α = 3" : "9 → β = 9"}</text>
        <rect x="310" y="96" width="150" height="42" rx="9" fill="#1d2b45" /><text x="385" y="124" fill="white">{max ? "MIN ancestor" : "MAX ancestor"}</text>
        <rect x="155" y="181" width="140" height="58" rx="9" fill="#e7edf5" /><text x="225" y="204" fontSize="17">Done subtree</text><text x="225" y="230" fontWeight="700">{max ? "6 → β = 6" : "4 → α = 4"}</text>
        <rect x="356" y="185" width="188" height="42" rx="9" fill="#eee8ff" stroke="#6740d9" strokeWidth="3" /><text x="450" y="213" fontWeight="700">{max ? "MAX" : "MIN"}{step === 0 ? " (current)" : step === 2 ? (max ? " ≥ " : " ≤ ") + leaves[1] : " v = " + leaves[0]}</text>
        {leaves.map((v, i) => {
          const x = 350 + i * 100;
          const skipped = step === 2 && i === 2;
          const evaluated = i < step;
          return <g key={i}>
            <path d={"M450 228 L" + x + " 281"} stroke={skipped ? "#b91c1c" : evaluated ? "#6740d9" : "#8190a7"} strokeWidth="3" strokeDasharray={skipped ? "7 5" : undefined} />
            <circle cx={x} cy="291" r="23" fill={evaluated ? "#eee8ff" : "white"} stroke={skipped ? "#b91c1c" : "#8190a7"} strokeWidth="2" />
            <text x={x} y="299" fontSize="25" fontWeight="700">{v}</text>
            {skipped && <><path d={"M" + (x-18) + " 273 L" + (x+18) + " 309"} stroke="#b91c1c" strokeWidth="3"/><text x={x} y="329" fontSize="15" fill="#b91c1c">SKIPPED</text></>}
          </g>;
        })}
      </g>
    </svg>
    <figcaption>{max ? "Known alternatives supply α = 3 and β = 6. At 7 ≥ 6, MIN can choose its alternative 6; skip 9." : "Known alternatives supply α = 4 and β = 9. At 2 ≤ 4, MAX can choose its alternative 4; skip 0."} Leaf scores are example inputs; a cutoff returns a bound.</figcaption>
  </figure>;
}

const maxTrace = [
  {
    label: "Initialize MAX",
    evaluated: "none",
    value: "v = −∞",
    bounds: "α = 3 · β = 6",
    remaining: "3, 7, 9",
    detail: "MAX seeks a larger value, but an ancestor MIN node already has an alternative worth 6.",
  },
  {
    label: "Evaluate first child",
    evaluated: "3",
    value: "v = max(−∞, 3) = 3",
    bounds: "α = max(3, 3) = 3 · β = 6",
    remaining: "7, 9",
    detail: "The returned value does not yet reach beta, so another child can still matter.",
  },
  {
    label: "Evaluate second child",
    evaluated: "3, 7",
    value: "v = max(3, 7) = 7",
    bounds: "v ≥ β because 7 ≥ 6",
    remaining: "9 is skipped",
    detail: "This is a beta cutoff at a MAX node. MIN will never choose the ancestor path that allows 7.",
  },
];

function MaxCutoffTrace() {
  const [step, setStep] = useState(0);
  const state = maxTrace[step];

  return (
    <div className="frontier-trace minimax-example-trace">
      <section>
        <span>MAX-VALUE trace · {step + 1} of {maxTrace.length}</span>
        <h3>{state.label}</h3>
        <p>{state.detail}</p>
        <div>
          <button disabled={step === 0} onClick={() => setStep(value => value - 1)} type="button">
            Previous
          </button>
          <button
            disabled={step === maxTrace.length - 1}
            onClick={() => setStep(value => value + 1)}
            type="button"
          >
            Next
          </button>
          <button onClick={() => setStep(0)} type="button">Reset</button>
        </div>
      </section>
      <div className="frontier-queues">
        <CutoffExampleTree kind="max" step={step} />
        <article><span>Child progress</span><strong>{state.evaluated}</strong><small>Remaining: {state.remaining}</small></article>
        <article><span>Temporary value and bounds</span><strong>{state.value}<br />{state.bounds}</strong></article>
      </div>
    </div>
  );
}

const minTrace = [
  {
    label: "Initialize MIN",
    evaluated: "none",
    value: "v = +∞",
    bounds: "α = 4 · β = 9",
    remaining: "8, 2, 0",
    detail: "MIN seeks a smaller value, but an ancestor MAX node already has an alternative worth 4.",
  },
  {
    label: "Evaluate first child",
    evaluated: "8",
    value: "v = min(+∞, 8) = 8",
    bounds: "α = 4 · β = min(9, 8) = 8",
    remaining: "2, 0",
    detail: "Eight remains above alpha, so the subtree may still return a value MAX would prefer.",
  },
  {
    label: "Evaluate second child",
    evaluated: "8, 2",
    value: "v = min(8, 2) = 2",
    bounds: "v ≤ α because 2 ≤ 4",
    remaining: "0 is skipped",
    detail: "This is an alpha cutoff at a MIN node. MAX already has a better ancestor alternative.",
  },
];

function MinCutoffTrace() {
  const [step, setStep] = useState(0);
  const state = minTrace[step];

  return (
    <div className="frontier-trace minimax-example-trace">
      <section>
        <span>MIN-VALUE trace · {step + 1} of {minTrace.length}</span>
        <h3>{state.label}</h3>
        <p>{state.detail}</p>
        <div>
          <button disabled={step === 0} onClick={() => setStep(value => value - 1)} type="button">
            Previous
          </button>
          <button
            disabled={step === minTrace.length - 1}
            onClick={() => setStep(value => value + 1)}
            type="button"
          >
            Next
          </button>
          <button onClick={() => setStep(0)} type="button">Reset</button>
        </div>
      </section>
      <div className="frontier-queues">
        <CutoffExampleTree kind="min" step={step} />
        <article><span>Child progress</span><strong>{state.evaluated}</strong><small>Remaining: {state.remaining}</small></article>
        <article><span>Temporary value and bounds</span><strong>{state.value}<br />{state.bounds}</strong></article>
      </div>
    </div>
  );
}

const hypotheticalSteps = [
  {
    label: "Evaluate A",
    detail: "A is a MIN node. Its first completed MAX child returns 3, so A has β=3.",
    bound: "A ≤ 3",
  },
  {
    label: "Skip the rest of B",
    detail: "Inside B, a MAX node, the first leaf returns 5. Because 5≥β=3, a beta cutoff skips B’s remaining leaf.",
    bound: "B ≥ 5 cannot improve A",
  },
  {
    label: "Update C",
    detail: "A returns 3 to root C, a MAX node. C now has α=3.",
    bound: "C ≥ 3",
  },
  {
    label: "Skip the rest of D",
    detail: "D is MIN. Its first completed child returns 0, so 0≤α=3 and an alpha cutoff skips D’s remaining subtree.",
    bound: "D ≤ 0 cannot improve C",
  },
  {
    label: "Skip the rest of E",
    detail: "E is MIN. Its first completed child returns 2, so 2≤α=3 and an alpha cutoff skips E’s remaining subtree.",
    bound: "E ≤ 2 cannot improve C",
  },
  {
    label: "Return the root value",
    detail: "C returns 3—the same value full minimax returns at the same depth with the same evaluation function.",
    bound: "C = max(3, 0, 2) = 3",
  },
];

function HypotheticalStateStepper() {
  const [step, setStep] = useState(0);
  const state = hypotheticalSteps[step];

  return (
    <section>
      <span>Depth-first proof · {step + 1} of {hypotheticalSteps.length}</span>
      <h3>{state.label}</h3>
      <p>{state.detail}</p>
      <SearchCallout label="Bound established" tone="cyan">{state.bound}</SearchCallout>
      <div className="best-first-step-controls">
        <button disabled={step === 0} onClick={() => setStep(value => value - 1)} type="button">
          Previous
        </button>
        <button
          disabled={step === hypotheticalSteps.length - 1}
          onClick={() => setStep(value => value + 1)}
          type="button"
        >
          Next
        </button>
        <button onClick={() => setStep(0)} type="button">Reset</button>
      </div>
    </section>
  );
}

const practiceReveal = [
  {
    label: "Left MIN returns 5",
    detail: "Evaluate 5 and 2, so the first MAX child returns 5. In the second MAX child, 10 reaches β=5; beta cutoff skips 11. Root α becomes 5.",
  },
  {
    label: "Middle MIN returns at most 2",
    detail: "Its first MAX child evaluates 1, 2, 2 and returns 2. Because 2≤root α=5, alpha cutoff skips the [8] and [6,5] subtrees.",
  },
  {
    label: "Right MIN tightens from 12 to 4",
    detail: "The first MAX child returns 12. The next returns max(4,3)=4, so β becomes 4.",
  },
  {
    label: "Right branch cuts off",
    detail: "Because β=4≤root α=5, alpha cutoff skips the final MAX child [25,2].",
  },
  {
    label: "Root chooses 5",
    detail: "The root backs up max(5,2,4)=5. Nine of fifteen leaves were evaluated; full minimax and alpha-beta choose the same action.",
  },
];

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 5 · Lesson 8 · Adversarial search",
    title: "Alpha-Beta Pruning and Modern Game Search",
    subtitle: "How can an agent prove that part of a game tree cannot change its decision?",
    content: (
      <div className="search-driving-question">
        <section>
          <span>Driving question</span>
          <h3>When is a branch irrelevant?</h3>
          <p>
            Minimax gives the decision rule. Alpha-beta adds path bounds that
            let a depth-first search stop evaluating branches that cannot
            change the backed-up choice.
          </p>
        </section>
        <div>
          <article><span>Result</span><strong>Same minimax action</strong><small>At the same depth and with the same evaluation function.</small></article>
          <article><span>Mechanism</span><strong>α and β bounds</strong><small>They summarize already established alternatives on the active path.</small></article>
          <article><span>Efficiency</span><strong>Order matters</strong><small>Good moves first can expose cutoffs earlier.</small></article>
          <article><span>Evidence</span><strong>Trace every return</strong><small>A cutoff must follow from a bound, not intuition.</small></article>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Retrieve MAX, MIN, backed-up values, terminal utility, and cutoff evaluation from Meeting 7. Frame alpha-beta as a proof that remaining work cannot affect the current decision.",
    sourceSlides: [17],
  },
  {
    eyebrow: "Why prune · Same decision, less search",
    title: "Minimax may pursue branches whose values cannot matter",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Search problem</span>
          <h3>The game tree grows faster than the search budget</h3>
          <p>
            Full depth-limited minimax evaluates every reachable leaf to its
            ply limit—even after an ancestor has a demonstrably better
            alternative.
          </p>
        </section>
        <div>
          <article>
            <strong>Alpha-beta promise</strong>
            <p>Return the same minimax value and action at the same search depth.</p>
          </article>
          <article>
            <strong>What does not change</strong>
            <p>Terminal utility, cutoff depth, and evaluation function remain the same.</p>
          </article>
          <article>
            <strong>What does change</strong>
            <p>Depth-first visitation and move ordering expose bounds that skip remaining siblings.</p>
          </article>
          <SearchCallout label="Structural insight" tone="cyan">
            A value found below ply n+1 can establish a relation between the
            decision at ply n and a descendant at ply n+2, proving the entire
            intervening subtree irrelevant.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the source motivation that minimax pursues many ignorable branches. Correct the heuristic claim: alpha-beta uses the same evaluation function; move-ordering heuristics improve efficiency by producing useful bounds earlier.",
    sourceSlides: [17, 18],
  },
  {
    eyebrow: "Path bounds · Invariants",
    title: "Alpha rises for MAX; beta falls for MIN",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Active interval</span>
          <h3>α ≤ possible backed-up value ≤ β</h3>
          <p>
            The interval records what the ancestors already know. Once the
            lower bound meets or exceeds the upper bound, the remaining
            siblings cannot affect the ancestor’s choice.
          </p>
        </section>
        <div>
          <article>
            <strong>Alpha · lower bound</strong>
            <p>The best value MAX can already guarantee along the current path.</p>
          </article>
          <article>
            <strong>Beta · upper bound</strong>
            <p>The best value MIN can already guarantee along the current path.</p>
          </article>
          <article>
            <strong>Monotonicity</strong>
            <p>α never decreases; β never increases as the active path is searched.</p>
          </article>
          <SearchCallout label="Cutoff condition" tone="amber">
            The interval closes when α≥β, equivalently β≤α.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to say who owns each bound and why its direction is monotone. Keep utility from MAX’s fixed perspective throughout the tree.",
    sourceSlides: [17, 21],
  },
  {
    eyebrow: "Execution · Depth-first order",
    title: "Finish a child, return its value, then update the parent",
    content: <DepthFirstVisitDemo />,
    note: "Timing: 3 minutes. Advance one step at a time. Stress the note-derived rule: back values up to the immediate parent, not directly to the root, and update alpha or beta only after a child value has returned.",
    sourceSlides: [18, 21],
  },
  {
    eyebrow: "Cutoff rules · Plain language",
    title: "A cutoff says an ancestor already has a better alternative",
    content: (
      <div className="search-objectives">
        <article>
          <span>At a MAX node</span>
          <h3>v ≥ β</h3>
          <p>
            Stop evaluating its remaining children. An ancestor MIN node can
            force an outcome no larger than β.
          </p>
        </article>
        <article>
          <span>Standard name</span>
          <h3>Beta cutoff</h3>
          <p>The MAX node reached or exceeded the MIN ancestor’s upper bound.</p>
        </article>
        <article>
          <span>At a MIN node</span>
          <h3>v ≤ α</h3>
          <p>
            This is an alpha cutoff. An ancestor MAX node already guarantees
            at least α elsewhere.
          </p>
        </article>
      </div>
    ),
    note: "Timing: 3 minutes. Have students translate each inequality into an ancestor preference argument. State the standard labels explicitly: beta cutoff at MAX for v≥β; alpha cutoff at MIN for v≤α.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Algorithm · MAX-VALUE",
    title: "MAX returns as soon as its value reaches beta",
    content: (
      <div className="algorithm-source-layout">
        <SearchSourceImage
          alt="Alpha-Beta-Search and Max-Value pseudocode"
          caption="The exact pseudocode tests v ≥ β inside MAX-VALUE."
          file="alpha-beta-search-max-value-pseudocode.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Read the return condition before the bound update</h3>
          <p>
            MAX initializes v to −∞, recursively asks MIN for each child value,
            and retains the maximum result.
          </p>
          <SearchCallout label="Standard cutoff name" tone="amber">
            <strong>if v ≥ β, return v</strong> is a beta cutoff at a MAX node.
            Only if search continues does α update to max(α,v).
          </SearchCallout>
          <SearchCallout label="Root call" tone="cyan">
            Alpha-Beta-Search begins with MAX-VALUE(state, −∞, +∞) and returns
            an action having the backed-up value.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Read the exact pseudocode line by line. Correct the visible source annotation verbally and in the callout: v≥β is a beta cutoff, not an alpha cutoff.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Algorithm trace · MAX node",
    title: "MAX trace: prune when v ≥ β",
    content: <MaxCutoffTrace />,
    note: "Timing: 3 minutes. Ask students to predict the bound after each child. At the final step, require the full explanation: the MIN ancestor already has an alternative of 6, so it will not permit a branch giving MAX at least 7.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Algorithm · MIN-VALUE",
    title: "MIN returns as soon as its value falls to alpha",
    content: (
      <div className="algorithm-source-layout">
        <SearchSourceImage
          alt="Min-Value pseudocode for alpha-beta search"
          caption="The exact pseudocode tests v ≤ α inside MIN-VALUE."
          file="alpha-beta-min-value-pseudocode.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>MIN mirrors MAX with reversed comparisons</h3>
          <p>
            MIN initializes v to +∞, recursively asks MAX for each child value,
            and retains the minimum result.
          </p>
          <SearchCallout label="Standard cutoff name" tone="amber">
            <strong>if v ≤ α, return v</strong> is an alpha cutoff at a MIN node.
            Only if search continues does β update to min(β,v).
          </SearchCallout>
          <SearchCallout label="Fixed perspective" tone="cyan">
            MIN chooses the action that minimizes MAX’s utility; utility signs
            do not switch perspectives between levels.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Read the exact MIN-VALUE pseudocode. Correct the visible source annotation: v≤α is an alpha cutoff, not a beta cutoff.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Algorithm trace · MIN node",
    title: "MIN trace: prune when v ≤ α",
    content: <MinCutoffTrace />,
    note: "Timing: 3 minutes. Require the ancestor argument: MAX already guarantees 4 elsewhere, so it will never select a branch whose MIN opponent can hold it to 2 or less.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Bounds · Meaning",
    title: "Alpha and beta summarize alternatives outside the current subtree",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Path memory</span>
          <h3>[α, β] is a decision-relevant window</h3>
          <p>
            Bounds are not predictions and not prefilters. They become valid
            only from values already returned by completed search.
          </p>
        </section>
        <div>
          <article>
            <strong>α · MAX’s floor</strong>
            <p>A MAX ancestor can obtain at least α through an explored alternative.</p>
          </article>
          <article>
            <strong>β · MIN’s ceiling</strong>
            <p>A MIN ancestor can hold MAX to at most β through an explored alternative.</p>
          </article>
          <article>
            <strong>v · current evidence</strong>
            <p>The temporary value at this node after one or more child returns.</p>
          </article>
          <SearchCallout label="Do not prefilter" tone="amber">
            Examine children in order until a returned value proves α≥β.
            “Only examine values above α or below β” is not a valid rule.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the source lower-bound and upper-bound definitions, then correct the note-derived prefilter misconception. Bounds are consequences of evaluated alternatives.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Efficiency · Move ordering",
    title: "Ordering: which child do we search first?",
    content: (
      <div className="lesson08-ordering">
        <section>
          <article><h3>Ordering</h3><p>The sequence in which we examine a node’s child states (legal moves). Reorder siblings before searching them; alpha-beta still explores each chosen branch depth-first.</p></article>
          <article><h3>Best-first ordering</h3><p>Try the moves likely to be best <strong>for the player at this node</strong> first: high values at MAX, low values at MIN. Useful bounds appear sooner, allowing earlier pruning.</p></article>
          <article><h3>Worst-first ordering</h3><p>Try the least promising moves for that player first: low values at MAX, high values at MIN. Useful bounds arrive later, so more children may need evaluation.</p></article>
        </section>
        <div className="evaluation-matrix">
          <div><span>Node</span><span>Best-first</span><span>Worst-first</span></div>
          <div><span>MAX</span><p>Highest first<br /><strong>9 → 7 → 3</strong></p><p>Lowest first<br /><strong>3 → 7 → 9</strong></p></div>
          <div><span>MIN</span><p>Lowest first<br /><strong>0 → 2 → 8</strong></p><p>Highest first<br /><strong>8 → 2 → 0</strong></p></div>
          <div><span>Pruning</span><p>Strong bounds early; often fewer evaluated leaves</p><p>Weak bounds early; may approach full minimax work</p></div>
          <div><span>In practice</span><p>Use a move-ordering heuristic to predict promising moves.</p><p>The examples show known values; real values are not yet known before search.</p></div>
          <SearchCallout label="Same result, different work" tone="cyan">With the same tree, cutoff depth, and evaluation, ordering preserves the minimax value. Tied optimal moves may be selected differently.</SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Define ordering as sibling visitation order within depth-first alpha-beta, not changing to the best-first search algorithm. Best is relative to the current player under utility measured for MAX: descending values at MAX, ascending values at MIN; worst-first reverses this. Walk through MAX [3,7,9] and MIN [8,2,0]. The displayed values are known for illustration; practical ordering predicts them using heuristics, prior searches, or domain knowledge. Strong early alternatives tighten bounds, improving pruning. Same minimax value is preserved at matched depth and evaluation; a different tied optimal move can be returned.",
    sourceSlides: [17, 18, 21],
  },
  {
    eyebrow: "Worked example · Setup",
    title: "Start left-to-right with no bounds at the root",
    content: (
      <div className="tree-challenge">
        <section><h3>MAX(root, −∞, +∞)</h3><p>Search the example tree left-to-right. The numbers are illustrative <b>leaf evaluations E(s)</b> measured for MAX; they are inputs to this example, not values calculated by alpha-beta.</p><p>Left MIN: min(3,12,8)=3. Middle MIN first sees 2. Right MIN visits 14,5,2.</p><SearchCallout label="Unvisited leaves" tone="cyan">? marks the middle branch’s unspecified evaluations. After seeing 2 with root α=3, they will be pruned; their values are unnecessary.</SearchCallout></section>
        <svg viewBox="0 0 780 390" role="img" aria-label="Example game tree: MAX root with three MIN children. Left leaves 3,12,8; middle leaves 2,unknown,unknown; right leaves 14,5,2.">
          <g stroke="#7b8ba1" strokeWidth="3">{[130,390,650].map(x=><line key={x} x1="390" y1="65" x2={x} y2="170"/>)}{[130,390,650].flatMap((x,i)=>[-70,0,70].map((offset,j)=><line key={i*3+j} x1={x} y1="170" x2={x+offset} y2="290"/>))}</g>
          <rect x="325" y="40" width="130" height="50" rx="12" fill="#1d2b45"/><text x="390" y="72" textAnchor="middle" fill="white" fontSize="24">MAX</text>
          {[130,390,650].map(x=><g key={x}><rect x={x-45} y="145" width="90" height="48" rx="10" fill="#ebe7ff" stroke="#5938dd"/><text x={x} y="176" textAnchor="middle" fill="#17243d" fontSize="24">MIN</text></g>)}
          {['3','12','8','2','?','?','14','5','2'].map((value,i)=>{const x=[60,130,200,320,390,460,580,650,720][i];return <g key={i}><circle cx={x} cy="290" r="26" fill="#ddf6f4" stroke="#0a9098"/><text x={x} y="298" textAnchor="middle" fill="#17243d" fontSize="24">{value}</text></g>})}
          <text x="390" y="365" textAnchor="middle" fill="#17243d" fontSize="21">Leaf values E(s) · visit left → right</text>
        </svg>
      </div>
    ),
    note: "Timing: 2 minutes. Students copy a four-column trace: node, v, alpha, beta. Preview the exact image sequence without revealing the later cutoffs.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Worked example · Left branch",
    title: "The first MIN branch sets β=3 and root α=3",
    content: (
      <div className="tree-challenge">
        <SearchSourceImage
          alt="First alpha-beta worked branch with leaves 3, 12, and 8"
          caption="MIN returns min(3,12,8)=3; the root now guarantees at least 3."
          file="alpha-beta-example-left-branch.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Back up the completed branch</h3>
          <p>
            MIN observes 3 first, so β becomes 3. Values 12 and 8 do not lower
            that bound. MIN returns 3 to MAX.
          </p>
          <SearchCallout label="Root update" tone="green">
            α ← max(−∞,3)=3. Every later root child is now compared against a
            known alternative worth 3.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Read all three leaf values and have students state each beta update before backing 3 up to the root.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Worked example · Middle branch",
    title: "Seeing 2 at MIN is enough to skip its remaining siblings",
    content: (
      <div className="tree-challenge">
        <SearchSourceImage
          alt="Alpha-beta worked tree where the middle MIN branch sees 2 and skips two siblings"
          caption="The middle MIN node reaches β=2 while root α=3."
          file="alpha-beta-example-first-cutoff.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>β=2 ≤ α=3</h3>
          <p>
            The middle MIN node can already force MAX to 2 or less. Root MAX
            has a completed alternative worth 3, so it will not choose this
            branch.
          </p>
          <SearchCallout label="Alpha cutoff" tone="amber">
            Skip the two unvisited siblings. Their values cannot make MIN’s
            result exceed the root’s existing 3.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Ask who owns alpha and why MIN’s remaining values are irrelevant. Name this an alpha cutoff at the MIN node.",
    sourceSlides: [23],
  },
  {
    eyebrow: "Worked example · Third branch",
    title: "The third MIN branch first establishes an upper bound of 14",
    content: (
      <div className="tree-challenge">
        <SearchSourceImage
          alt="Alpha-beta worked tree where the third MIN branch first sees leaf 14"
          caption="After one child, the third MIN node has β=14."
          file="alpha-beta-example-third-branch.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>No cutoff yet</h3>
          <p>
            Root α remains 3. The third MIN node has β=14, and 14≤3 is false.
            A later sibling could still lower this branch below the root’s best
            alternative.
          </p>
          <SearchCallout label="Continue" tone="cyan">
            Bounds tell us when to stop; they do not guarantee that every
            promising first value produces a cutoff.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Have students test beta<=alpha aloud before advancing.",
    sourceSlides: [24],
  },
  {
    eyebrow: "Worked example · Bound update",
    title: "A second child tightens beta from 14 to 5",
    content: (
      <div className="tree-challenge">
        <SearchSourceImage
          alt="Alpha-beta worked tree where the third MIN branch updates beta from 14 to 5"
          caption="MIN keeps the smaller returned value, so β becomes 5."
          file="alpha-beta-example-beta-five.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Still no cutoff</h3>
          <p>
            β ← min(14,5)=5. Because β=5 remains greater than root α=3, the
            third child can still affect the root decision.
          </p>
          <SearchCallout label="Invariant check" tone="green">
            Beta decreased, as required. Alpha at the root has not changed.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Ask whether beta may ever increase and why the next sibling still matters.",
    sourceSlides: [25],
  },
  {
    eyebrow: "Worked example · Final child",
    title: "β reaches 2, but no remaining work is left to save",
    content: (
      <div className="tree-challenge">
        <SearchSourceImage
          alt="Completed alpha-beta worked tree where the third MIN branch reaches value 2"
          caption="The final observed value makes β=2≤α=3 after every child in that branch has been evaluated."
          file="alpha-beta-example-final-cutoff.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>The condition is true; the saving is zero</h3>
          <p>
            β ← min(5,2)=2, so β≤α. However, this was the branch’s last child.
            There are no remaining siblings to skip.
          </p>
          <SearchCallout label="Precise language" tone="amber">
            The bound condition holds, but this particular late cutoff saves no
            additional evaluation.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Distinguish a cutoff condition from actual pruning benefit. The root still returns max(3,≤2,2)=3.",
    sourceSlides: [26],
  },
  {
    eyebrow: "Concept check · Alpha cutoff",
    title: "A large MIN value does not trigger an alpha cutoff",
    content: (
      <SearchQuickCheck
        correct={1}
        explanation="At the MIN node, β becomes 8. Since 8≤α=3 is false, no alpha cutoff occurs. Evaluating 10 leaves β at 8; the node returns 8 and root MAX updates α from 3 to 8."
        options={[
          "Yes—8 is larger than alpha, so stop.",
          "No—MIN has not fallen to alpha or below.",
          "Yes—every completed MIN child causes a cutoff.",
        ]}
        question="Root MAX has α=3. Its next MIN child sees leaves 8 and 10. After seeing 8, is there an alpha cutoff?"
      />
    ),
    note: "Timing: 3 minutes. Recreate the source Alpha Cutoff question. Require students to calculate beta and test beta<=alpha rather than pattern-match on a large number.",
    sourceSlides: [27],
  },
  {
    eyebrow: "Concept check · Beta cutoff",
    title: "A MAX value that reaches beta ends the remaining sibling search",
    content: (
      <SearchQuickCheck
        correct={0}
        explanation="At a MAX node, the first returned value gives v=8. Since v≥β=4, a beta cutoff returns immediately. It is not an alpha cutoff because the proof uses the MIN ancestor’s beta bound."
        options={[
          "Beta cutoff: 8≥4, so skip the remaining MAX children.",
          "Alpha cutoff: 8 is larger than alpha.",
          "No cutoff: every child must be evaluated.",
        ]}
        question="A MAX node receives β=4 from a MIN ancestor. Its first child returns 8. What happens?"
      />
    ),
    note: "Timing: 3 minutes. Recreate the source Beta Cutoff question. Ask students to name the ancestor whose alternative makes the remaining children irrelevant.",
    sourceSlides: [28],
  },
  {
    eyebrow: "Integrated trace · Hypothetical state space",
    title: "Every skipped subtree follows from a completed bound",
    content: (
      <div className="trace-source-layout m8-hypothetical-fit">
        <SearchSourceImage
          alt="Hypothetical MAX-MIN state space with beta pruning at B and alpha pruning at D and E"
          caption="States without numbers were not evaluated; follow the depth-first path and backed-up bounds."
          file="alpha-beta-hypothetical-state-space.png"
          sourceRoot={sourceRoot}
        />
        <HypotheticalStateStepper />
      </div>
    ),
    note: "Timing: 4 minutes. Step through A, B, C, D, and E. Use standard terminology: beta cutoff at MAX node B; alpha cutoffs at MIN nodes D and E. Describe pruning as skipping subtree expansion or evaluation.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Verification · Full minimax baseline",
    title: "Correct alpha-beta must agree with full minimax",
    content: (
      <div className="evaluation-matrix">
        <div><span>Evidence</span><span>Full minimax</span><span>Alpha-beta</span><span>Pass condition</span></div>
        <div><span>Root value</span><p>Compute every leaf at depth d</p><p>Compute only decision-relevant leaves</p><p>Values are equal</p></div>
        <div><span>Selected action</span><p>Argmax of child values</p><p>Argmax of returned bounds/values</p><p>Actions match, allowing ties</p></div>
        <div><span>Leaf count</span><p>Baseline count</p><p>Count evaluated leaves</p><p>Alpha-beta evaluates no more</p></div>
        <div><span>Controlled variables</span><p>Depth d and evaluation E</p><p>Same depth d and evaluation E</p><p>Only ordering/pruning differs</p></div>
      </div>
    ),
    note: "Timing: 3 minutes. Correct the source verification proposal. Current/parent heuristic values alone do not validate an implementation; compare root value, selected action, and leaf count against full minimax under identical settings.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Efficiency and extensions · What changes the tree",
    title: "Ordering reduces evaluations; other game models change the backup rule",
    content: (
      <div className="algorithm-map">
        <section>
          <article><span>1</span><h3>Poor ordering</h3><p>Few early bounds; alpha-beta approaches full minimax work.</p></article>
          <article><span>2</span><h3>Good ordering</h3><p>Likely strong MAX moves and weak MIN moves first; more cutoffs occur early.</p></article>
          <article><span>3</span><h3>Correctness</h3><p>Either order returns the same depth-limited minimax result.</p></article>
          <article><span>4</span><h3>Measurement</h3><p>Record evaluated leaves, internal nodes, time, and ordering overhead.</p></article>
        </section>
        <aside>
          <span>Modern supplements</span>
          <p><strong>Expectimax:</strong> chance nodes back up probability-weighted expected utility when outcomes are stochastic.</p>
          <p><strong>Monte Carlo Tree Search:</strong> selectively grows a tree using repeated selection, expansion, simulation, and backup.</p>
          <p>These alter the game-search model; they are not alpha-beta shortcuts for deterministic minimax.</p>
        </aside>
      </div>
    ),
    note: "Timing: 2 minutes. Keep the modern methods explicitly supplemental. Contrast changing visitation order within minimax with changing the backup operator for chance or sampling-based search.",
    sourceSlides: [17, 29],
  },
  {
    eyebrow: "In-class practice · Independent trace",
    title: "Apply alpha-beta left-to-right to the complete practice tree",
    content: (
      <div className="algorithm-source-layout">
        <SearchSourceImage
          alt="Original Alpha-Beta Pruning Practice slide: a MAX root has three MIN children above MAX nodes and leaves 5, 2, 10, 11, 1, 2, 2, 8, 6, 5, 12, 4, 3, 25, and 2"
          caption="The original practice tree preserves the node shapes, player levels, branch grouping, and left-to-right leaf order."
          file="source-slides/slide-30.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Submit a trace, not only an answer</h3>
          <p>
            Evaluate leaves in the displayed left-to-right order. At every
            internal node, record v, α, and β after each returned child.
          </p>
          <SearchCallout label="Mark every skipped subtree" tone="amber">
            Name the cutoff type, write the inequality that justifies it, and
            count both evaluated and skipped leaves.
          </SearchCallout>
          <SearchCallout label="Final claims" tone="cyan">
            Report the root value, chosen root branch, and whether a different
            legal move order could change either result.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 5 minutes. Use the original source practice tree and its exact leaf grouping. Students work independently for three minutes, then compare bound tables with a partner.",
    sourceSlides: [30],
  },
  {
    eyebrow: "In-class assessment · Reveal and explain",
    title: "The practice tree returns 5 after evaluating nine of fifteen leaves",
    content: (
      <RevealSequence
        items={practiceReveal}
        prompt="Can your partner justify every cutoff from an ancestor alternative?"
      />
    ),
    note: "Timing: 5 minutes. Reveal one step only after pairs reconcile their traces. Score one point each for root value 5, first beta cutoff, two alpha cutoffs, nine evaluated leaves, and a correct same-result explanation.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Synthesis · Exit ticket and reading",
    title: "A cutoff is a proof that remaining work cannot change the choice",
    content: (
      <div className="search-exit">
        <article>
          <span>1 · Explain</span>
          <h3>Name the ancestor alternative</h3>
          <p>For one beta cutoff and one alpha cutoff, state whose existing choice makes the siblings irrelevant.</p>
        </article>
        <article>
          <span>2 · Trace</span>
          <h3>Maintain v, α, and β</h3>
          <p>Show the exact child return that closes the interval and identify any work actually saved.</p>
        </article>
        <article>
          <span>3 · Verify</span>
          <h3>Compare with full minimax</h3>
          <p>Hold depth and evaluation fixed; compare root value, chosen action, and evaluated leaves.</p>
        </article>
        <aside>
          <strong>Corrected references and next reading</strong>
          <p>
            George F. Luger, <em>Artificial Intelligence: Structures and
            Strategies for Complex Problem Solving</em>, 6th ed., Chapter 4
            (Addison-Wesley, 2009). Stuart Russell and Peter Norvig,
            <em> Artificial Intelligence: A Modern Approach</em>, 3rd ed.
            (Prentice Hall, 2010). Exit ticket: explain why move ordering can
            change running time without changing the minimax decision.
          </p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Collect the exit explanation. Correct the author names while preserving the source editions and chapter reference.",
    sourceSlides: [31],
  },
];

export function Meeting08Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      hoverEffects
      meetingLabel="Module 5 · Lesson 8"
      meetingTitle="Alpha-Beta Pruning and Modern Game Search"
      notesMode="key-points"
      slides={slides}
      sourceCollectionLabel="L05_MiniMax&Pruning.pptx"
      sourceCollectionPath="l05-minimax-pruning"
    />
  );
}
