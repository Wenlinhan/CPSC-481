"use client";

import { useState } from "react";
import { lessonNarrationNotes } from "../data/lessonNarrationNotes";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  RevealSequence,
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const sourceRoot = "/course-source/l05-minimax-pruning";
const LESSON_08_VIDEO_URL = "https://csufullerton.instructure.com/files/283889902/download?download_frd=1&verifier=CUxBCDRpcugkXDGArfXa4uoOWEePwld576VCDsvD";

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
    <div className="frontier-trace">
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
        <article><span>Evaluated children</span><strong>{state.evaluated}</strong></article>
        <article><span>Temporary value and bounds</span><strong>{state.value}<br />{state.bounds}</strong></article>
        <article><span>Children still on the board</span><strong>{state.remaining}</strong></article>
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
    <div className="frontier-trace">
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
        <article><span>Evaluated children</span><strong>{state.evaluated}</strong></article>
        <article><span>Temporary value and bounds</span><strong>{state.value}<br />{state.bounds}</strong></article>
        <article><span>Children still on the board</span><strong>{state.remaining}</strong></article>
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
    title: "At MAX, v ≥ β proves that remaining siblings cannot help",
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
    title: "At MIN, v ≤ α proves that remaining siblings cannot hurt MAX",
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
    title: "Move ordering changes work, not the minimax answer",
    content: (
      <div className="evaluation-matrix">
        <div><span>Question</span><span>Best-first ordering</span><span>Worst-first ordering</span><span>Invariant</span></div>
        <div><span>MAX tries</span><p>High-value moves early</p><p>Low-value moves early</p><p>Same legal actions</p></div>
        <div><span>MIN tries</span><p>Low-value moves early</p><p>High-value moves early</p><p>Same cutoff depth</p></div>
        <div><span>Effect</span><p>Tight bounds and earlier cutoffs</p><p>Few cutoffs; near-full minimax</p><p>Same evaluation function</p></div>
        <div><span>Result</span><p>Fewer leaves evaluated</p><p>More leaves evaluated</p><p>Same minimax result</p></div>
      </div>
    ),
    note: "Timing: 2 minutes. Explain that a move-ordering heuristic predicts promising actions only to improve pruning. It does not replace the cutoff evaluation function or alter correctness.",
    sourceSlides: [17, 18, 21],
  },
  {
    eyebrow: "Worked example · Setup",
    title: "Start left-to-right with no bounds at the root",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Initial call</span>
          <h3>MAX(root, −∞, +∞)</h3>
          <p>
            Search two plies to the shown leaf evaluations. Visit children
            left-to-right and return each completed MIN value to the root.
          </p>
        </section>
        <div>
          <article>
            <strong>Left MIN</strong>
            <p>Leaves 3, 12, and 8 establish the first root alternative.</p>
          </article>
          <article>
            <strong>Middle MIN</strong>
            <p>Its first leaf is 2; decide whether its remaining siblings matter.</p>
          </article>
          <article>
            <strong>Right MIN</strong>
            <p>Its observed leaves arrive in the order 14, 5, and 2.</p>
          </article>
          <SearchCallout label="Trace discipline" tone="cyan">
            At every return, record node type, temporary v, α, β, and any
            siblings that remain unvisited.
          </SearchCallout>
        </div>
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
      lectureVideoUrl={LESSON_08_VIDEO_URL}
      meetingLabel="Module 5 · Lesson 8"
      meetingTitle="Alpha-Beta Pruning and Modern Game Search"
      narrationNotes={lessonNarrationNotes(8)}
      slides={slides}
      sourceCollectionLabel="L05_MiniMax&Pruning.pptx"
      sourceCollectionPath="l05-minimax-pruning"
    />
  );
}
