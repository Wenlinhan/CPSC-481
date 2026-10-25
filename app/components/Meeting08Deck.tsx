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
    note: "Lesson eight begins with a promise that sounds suspiciously like a late-night advertisement: obtain the same minimax decision while examining less of the tree. Alpha-beta pruning keeps the minimax backup rule, terminal utilities, cutoff depth, and evaluation function. It saves work only when returned values prove that unexplored siblings cannot change an ancestor's choice. Picture a restaurant menu where your opponent has already guaranteed that your table will pay no more than twenty dollars. Discovering a branch whose meal costs at least thirty is enough; the opponent will refuse it. Alpha and beta are those remembered alternatives, and the pruning shears appear only after the arithmetic proves irrelevance. The four cards establish our contract. The result must be the same minimax action. The mechanism is a pair of path bounds. Efficiency depends on visitation order. Evidence is a trace of every recursive return. A cutoff based on vibes is not pruning; it is merely deleting homework with confidence. By the end, you should trace MAX-VALUE and MIN-VALUE, name beta and alpha cutoffs correctly, explain who owns each bound, verify equality with full minimax, and distinguish move ordering from model changes such as expectimax or Monte Carlo tree search. Every skipped subtree needs a proof and an ancestor alternative.",
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
    note: "Depth-limited minimax normally evaluates every reachable leaf at its selected ply limit and backs each value toward the root. That is correct but expensive because the branching factor raises the tree size exponentially. Some leaves are evaluated even after an ancestor has an alternative that makes the entire branch strategically unacceptable. Imagine interviewing every applicant after one candidate has already met every requirement and the current branch has failed a mandatory test. More interviews cannot rescue that branch. Alpha-beta turns this administrative common sense into inequalities, but unlike a bored hiring committee, it must preserve the exact minimax answer. Notice what remains fixed: terminal utility, depth limit, evaluation function, legal moves, and the MAX-MIN backup operators. What changes is depth-first visitation plus the moment at which a bound closes. If any of those controlled ingredients change, a matching answer is no longer evidence that pruning alone caused the saving. The structural insight connects nonadjacent levels. A value discovered below a grandchild can prove that the intermediate choice will never be selected by an ancestor. We do not need the exact values of the skipped leaves; we need only establish that even their best possible influence cannot cross the existing alternative.",
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
    note: "Alpha is the best value MAX can already guarantee along the active path. It is a lower bound because MAX has an explored alternative worth at least alpha. Beta is the best value MIN can already guarantee, meaning an upper bound on MAX's outcome because MIN can force the result to beta or less. Think of alpha as an elevator that only travels upward and beta as an elevator that only travels downward. Returned child values tighten the decision window from both sides. Nobody presses a reverse button: alpha never decreases, and beta never increases while the current path remains active. The displayed interval says alpha is no greater than any still decision-relevant backed-up value, which is no greater than beta. When alpha meets or exceeds beta, the window has closed. Remaining siblings may contain fascinating numbers, dramatic plot twists, or free snacks, but they cannot alter the ancestor decision. Keep utility from MAX's fixed perspective throughout the tree. MIN does not suddenly call a good score positive for itself and flip the signs unless the representation explicitly uses negamax. In this pseudocode, MAX maximizes one utility scale and MIN minimizes that same scale.",
    sourceSlides: [17, 21],
  },
  {
    eyebrow: "Execution · Depth-first order",
    title: "Finish a child, return its value, then update the parent",
    content: <DepthFirstVisitDemo />,
    note: "Alpha-beta is depth-first. It chooses one child, descends until a terminal or cutoff state supplies a value, returns that value to the immediate parent, and only then updates the parent's temporary value and bound. It does not sample every sibling at one level before descending, because incomplete children establish no usable backed-up value. The stack behaves like a set of nested phone calls. The leaf answers its parent; the parent updates its own notes and later calls its parent. A leaf does not shout directly to the root across three unfinished conversations. That shortcut would mix values owned by different decision nodes. At a terminal state return exact utility. At a depth cutoff return the evaluation function used by ordinary depth-limited minimax. After a MIN child returns, MAX updates v and perhaps alpha. After a MAX child returns, MIN updates v and perhaps beta. Bound updates are consequences of completed evidence. Use the live control as a proof rehearsal. Before each click, state the next node, current alpha and beta, and which variable may change on return. If your spoken prediction names a sibling before the active child finishes, your trace has quietly become breadth-first and the pruning logic will wander off wearing someone else's nametag. Advance to the MIN child. The active path is one ply deeper, but alpha and beta remain negative and positive infinity because no completed child value has returned. This demonstrates that descending alone does not update a bound. Advance to the terminal or cutoff state. Return exact utility at a terminal node or the agreed evaluation at the depth limit. This leaf result is evidence, but it still belongs first to its immediate parent. Advance through the return to MIN. MIN incorporates the child result and lowers beta when appropriate. Only now can it test beta against inherited alpha and decide whether another sibling remains relevant. Advance back to the MAX root. MAX incorporates the completed MIN result and raises alpha when appropriate. The trace has returned one edge at a time, preserving ownership of every temporary value and bound.",
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
    note: "At a MAX node, stop when its temporary value v reaches or exceeds beta. This is a beta cutoff. A MIN ancestor already possesses an alternative that keeps MAX at beta or below, so MIN will never allow the current branch whose MAX value is at least beta. The family-veto metaphor helps. MAX is excited because this branch offers seven, but the ancestor MIN says, charming story, I can choose another route capped at six. MAX may find nine or ninety among the remaining children; MIN still rejects the branch. The skipped siblings cannot help the root decision. At a MIN node, stop when v falls to or below alpha. This is an alpha cutoff. A MAX ancestor already owns an alternative worth alpha or more, so MAX will never choose a branch where MIN can hold the result to alpha or less. The inequalities mirror the players' preferences. Names come from the ancestor bound that triggers the proof: beta cutoff at MAX, alpha cutoff at MIN. Do not rename them according to the node's favorite variable or which Greek letter feels more photogenic. State the inequality, the ancestor, and the existing alternative every time.",
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
    note: "MAX-VALUE begins with v equal to negative infinity. For each legal action, it recursively asks MIN-VALUE for the child result and replaces v with the larger of its current value and that return. This is ordinary minimax until the upper bound supplied by a MIN ancestor becomes decisive. Read the return test before the alpha update. If v is at least beta, return v immediately. The remaining children are irrelevant because the MIN ancestor can avoid this branch. Only when the search continues does alpha become the larger of its prior value and v. The order matters in code and on an exam. First receive the child value, then update v, then test v against beta, then update alpha if another child may be explored. Moving the test before v changes can miss a cutoff; updating the wrong bound can manufacture one from thin air. At the root, Alpha-Beta-Search calls MAX-VALUE with negative infinity and positive infinity. No ancestor has yet established an alternative, so the first root child cannot be pruned by a preexisting finite bound. Useful root alpha appears only after a complete child returns. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Algorithm trace · MAX node",
    title: "MAX trace: prune when v ≥ β",
    content: <MaxCutoffTrace />,
    note: "This compact trace gives MAX an incoming alpha of three and beta of six. MAX starts at negative infinity and has children valued three, seven, and nine. The question is not which child is largest in the completed list; it is how soon the incoming ceiling makes later work irrelevant. After child three returns, v becomes three. Three is below beta six, so MAX cannot yet prove that MIN will reject this branch. Alpha remains or becomes three, and child seven still matters. The interval is open, so the recursion must continue. After child seven returns, v becomes seven. Now seven is at least beta six. The MIN ancestor already has an alternative worth at most six, so it will never choose the route permitting MAX to obtain seven. Child nine is skipped without changing the returned minimax decision. Notice the saving is one child evaluation, not mystical disappearance of the whole universe. Report evaluated children three and seven, returned bound at least seven, skipped child nine, cutoff type beta, and the MIN ancestor's six-valued alternative. That complete sentence is the proof. Advance after evaluating child three. MAX updates v to three, which remains below beta six. The interval stays open, so seven must still be evaluated; child nine remains waiting behind it. Advance after evaluating child seven. MAX updates v to seven and proves seven is at least beta six. The MIN ancestor rejects this branch, producing a beta cutoff that skips child nine.",
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
    note: "MIN-VALUE mirrors MAX-VALUE. It initializes v to positive infinity, asks MAX-VALUE for each successor, and keeps the smaller returned value. Its incoming alpha summarizes an alternative already guaranteed by a MAX ancestor, so sufficiently low evidence makes the current branch unacceptable to MAX. After updating v, MIN tests whether v is at most alpha. If so, return v immediately: an alpha cutoff. If search continues, beta becomes the smaller of beta and v. The comparisons reverse because MIN seeks lower utility on MAX's fixed scale. The visible pseudocode is worth enlarging because one inequality controls the entire proof. Trace the line that obtains a child value, the min operation, the v less-than-or-equal-to-alpha return, and the beta update. Read them in execution order, not as four inspirational quotes arranged vertically. Do not switch the meaning of utility at MIN levels. A value of negative ten is bad for MAX and therefore attractive to MIN. The algorithm represents that preference by taking a minimum, not by relabeling whose happiness the number describes after every ply. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Algorithm trace · MIN node",
    title: "MIN trace: prune when v ≤ α",
    content: <MinCutoffTrace />,
    note: "The MIN trace arrives with alpha four and beta nine. Its children return eight, two, and zero. MIN begins at positive infinity because any real returned value will improve its minimizing choice. Again, we stop when evidence crosses the ancestor's existing alternative, not merely when a number looks small. After eight returns, v becomes eight and beta tightens from nine to eight. Eight remains above alpha four, so MAX might still prefer this root branch if later MIN children stay high. The next child must be evaluated; no cutoff has been earned. After two returns, v becomes two. Since two is at most alpha four, the MAX ancestor already guarantees four elsewhere and will never choose a route where MIN can force two. This alpha cutoff skips the final child zero, even though zero would make MIN happier. Report the exact proof: evaluated eight and two, current MIN value two, alpha four from a MAX ancestor, inequality two less than or equal to four, skipped zero, returned bound at most two. That language connects arithmetic to agency instead of treating Greek letters as decorative algebra confetti. Advance after evaluating child eight. MIN lowers v and beta to eight, but eight remains above alpha four. The proof is incomplete, so child two must still be evaluated. Advance after evaluating child two. MIN lowers v to two and proves two is at most alpha four. The MAX ancestor keeps its four-valued alternative, so an alpha cutoff skips child zero.",
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
    note: "The active alpha-beta window is path memory. Alpha records a completed alternative available to some MAX ancestor; beta records a completed alternative available to some MIN ancestor. Neither number predicts an unseen child. Both summarize choices outside the subtree currently being searched. Think of courtroom precedent rather than a crystal ball. A returned value creates evidence that constrains what can matter next. Before any child returns, there is no legal basis for filtering values merely because they appear above alpha or below beta in the drawing. The temporary v belongs to the current node. At MAX it rises as children return; at MIN it falls. A cutoff occurs only when this evidence closes the inherited window. The correct procedure examines children in order until the inequality is established, then skips what remains. A common misconception says examine only values between alpha and beta. That assumes leaf values are known before evaluation, which defeats the point of search. Bounds prune subtrees after recursive evidence arrives; they do not scan a hidden answer key and preselect the fashionable numbers.",
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
    note: "Alpha-beta's result is order invariant under the same depth, evaluation, utilities, and legal actions, but its workload is not. MAX benefits when high-valued moves are searched early because alpha rises quickly. MIN benefits when low-valued moves come early because beta falls quickly. Imagine packing a suitcase with the bulkiest item first. You discover the capacity constraint immediately instead of arranging twelve socks and meeting the same problem later. Good move ordering exposes decisive bounds early; bad ordering postpones them until most of the tree has already submitted expense reports. A move-ordering heuristic predicts which actions are promising for visitation. It does not replace the cutoff evaluation function and does not change minimax's backup rule. The heuristic may cost time itself, so measure leaf savings, internal nodes, elapsed time, and ordering overhead rather than celebrating one smaller count. Read across the matrix. Best-first ordering tries strong MAX and weak MIN moves early, producing tight bounds. Worst-first ordering often approaches full minimax. In both columns the legal actions, cutoff depth, evaluation function, and final minimax result remain controlled invariants.",
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
    note: "The worked tree starts at a MAX root with alpha negative infinity and beta positive infinity. Search proceeds left to right through three MIN children. Because the root has no finite ancestor ceiling, its first completed child establishes the first useful alpha rather than triggering a root cutoff. Prepare a trace with columns for node, temporary v, alpha, beta, returned value, and skipped siblings. The left MIN child owns leaves three, twelve, and eight. The middle child begins with two. The right child receives fourteen, five, and two in that order. Before each leaf, predict which node owns the next update. MIN keeps the smallest child return; MAX keeps the largest completed branch value. Alpha changes at the root only after a MIN child finishes. Beta changes inside each MIN branch as its leaves arrive. This bookkeeping may feel fussy, but it prevents time travel. If you use the future leaf two while analyzing the earlier leaf fourteen, you have granted the algorithm spoilers. Alpha-beta knows only completed returns in visitation order, so our trace must respect the same information boundary.",
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
    note: "In the left branch, MIN first sees three, so its temporary value and beta become three. The next leaf twelve is larger and therefore cannot improve MIN's choice; beta remains three. Leaf eight is also larger, leaving the branch value unchanged. The complete MIN child returns three to the MAX root. Now the root updates alpha from negative infinity to three. That means MAX has a legal explored alternative guaranteeing at least three, and every later MIN branch will inherit this floor. No pruning occurred inside the first branch because root alpha was not finite while its leaves were being searched. The branch had to finish before it could create the alternative used against later siblings. Good evidence arrives after work; it is not issued as a complimentary starter coupon. Read the enlarged figure in event order: leaf three, beta three; leaf twelve, beta still three; leaf eight, beta still three; return three; root alpha three. Close the figure only after each number has an owner and a direction of update. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.",
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
    note: "The middle MIN node inherits root alpha three. Its first visited leaf returns two, so MIN's v and beta become two. Immediately beta two is less than or equal to alpha three. The inherited window closes after only one leaf. The ancestor explanation is the heart of the cutoff. MAX already has the completed left alternative worth three. This middle branch lets MIN force two or less, so MAX will never choose it. Any remaining middle siblings can only keep or lower MIN's result, never raise it above three. This is an alpha cutoff at a MIN node. Mark the two unvisited siblings as skipped, return a bound of at most two, and leave root alpha at three. The root does not replace its better branch with a worse one merely because the worse branch arrived wearing a dramatic inequality. Use the enlarged tree to distinguish drawn from evaluated. The skipped leaves remain visible because the game tree contains them, but the search never requests their evaluation. A diagram shows possible structure; a trace records actual computation. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.",
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
    note: "The third MIN branch also inherits root alpha three. Its first leaf returns fourteen, so v and beta become fourteen. Test beta less than or equal to alpha: fourteen is not less than or equal to three. The decision window remains open. A large first value at MIN is not a reason to stop. Later siblings may lower MIN's result dramatically, perhaps below the root's established alternative. MIN has not completed its choice, and MAX cannot yet know whether this branch will beat three. The situation resembles an auction where the first bid is high but lower bids are still permitted and the buyer always chooses the cheapest. Declaring victory after fourteen would misunderstand whose preference controls the node. MIN waits for smaller evidence. In the enlarged image, point to root alpha three and local beta fourteen simultaneously. The cutoff condition compares those two path bounds; it does not compare fourteen with a random neighboring leaf or with negative infinity remembered from the root's initial call. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.",
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
    note: "The next leaf returns five. MIN updates v and beta to the smaller of fourteen and five, so beta becomes five. This confirms monotonicity: beta moved downward and did not rebound merely because fourteen had enjoyed a brief career as the current value. Compare beta five with root alpha three. Five is still greater, so the window remains open. The third child can lower the branch to two, which would make MAX reject it, or remain above three, which might let this branch replace the root's current choice. This intermediate state is pedagogically valuable because it resists button-mashing. Not every bound update creates a cutoff. We update, test, and continue when the inequality is false. Alpha-beta is a proof procedure, not a machine that becomes more pruney whenever Greek letters appear. Enlarge the figure and say the invariant aloud: root alpha stays three; local beta decreases from fourteen to five; five is greater than three; one sibling remains relevant. Then close the figure and preserve those values for the final step. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.",
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
    note: "The final leaf returns two, so MIN lowers beta from five to two. Now beta two is less than or equal to root alpha three. The cutoff condition is true, and the branch returns at most two to the root. However, the triggering leaf was already the last child. There are no remaining siblings to skip. The inequality proves that additional work would be irrelevant, but zero additional work exists. This is the algorithmic equivalent of announcing that the store is closed after the final customer has left. Precise analysis separates a cutoff condition from pruning benefit. Record that the condition holds late and saves zero evaluations. Root MAX compares its completed alternative three with the middle bound at most two and the right value two, so the final root value remains three. Inspect the completed tree and count actual leaves evaluated versus skipped. The middle branch produced the useful saving; this late right-branch closure did not. A good performance report measures work, not the number of times someone circled alpha and beta with an enthusiastic marker. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.",
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
    note: "The concept check gives root MAX an existing alpha of three and asks about a new MIN child whose leaves are eight and ten. After MIN sees eight, its beta becomes eight. The correct test is beta less than or equal to alpha, not whether the number feels impressively large. Eight is not less than or equal to three, so there is no alpha cutoff. MIN must inspect the next child. Ten does not lower its temporary value, so MIN returns eight, and root MAX can then raise alpha from three to eight. Option A reverses the logic by treating a value larger than alpha as a stopping condition. Option C invents a cutoff after every completed child. Only option B names the real issue: MIN has not fallen to alpha or below, so the ancestor cannot yet reject the branch. We will click every option, not because uncertainty deserves three trophies, but because feedback is part of the lesson. For each response, locate the same invariant: local beta eight, ancestor alpha three, open interval, next leaf still capable of affecting MIN's returned value. Choose option A to expose the first misconception. Eight being larger than alpha is not an alpha-cutoff condition at MIN. The feedback should send us back to beta eight less than or equal to alpha three, which is false. Choose option B. This is correct: MIN has not fallen to alpha or below, so the next leaf remains relevant. After ten, MIN still returns eight and root MAX may raise alpha. Choose option C to test the automatic-cutoff misconception. Completing one MIN child updates evidence but does not guarantee a cutoff. The inherited inequality must close before siblings can be skipped.",
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
    note: "Now a MAX node receives beta four from a MIN ancestor, and its first child returns eight. MAX sets v to eight and tests v greater than or equal to beta. Eight is at least four, so the window closes immediately. This is a beta cutoff because the proof uses the MIN ancestor's beta bound. MIN already has an alternative that caps MAX at four, so it will never permit a branch giving MAX eight or more. Remaining MAX children cannot make this branch more acceptable to MIN. Option A states the correct inequality and action. Option B misnames the cutoff by mentioning alpha even though the decisive inherited bound is beta. Option C incorrectly demands every child, erasing the entire advantage of alpha-beta after the proof is already complete. As we click each option, keep the causal sentence stable: MAX found eight, MIN can choose a route capped at four, therefore MIN rejects this branch, therefore MAX's remaining siblings are irrelevant. Arithmetic, agent preference, and skipped work must travel together. Choose option A. Correct: v equals eight at MAX, beta equals four from a MIN ancestor, and eight is at least four. A beta cutoff returns immediately and skips the remaining MAX children. Choose option B to expose the naming error. A large value is not automatically an alpha cutoff. The decisive bound is beta, owned by MIN, so the standard name is beta cutoff. Choose option C to expose full-tree thinking. Alpha-beta does not evaluate every child after the ancestor preference is proven. Requiring all siblings would preserve minimax correctness while throwing away the pruning benefit.",
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
    note: "The hypothetical state space combines several cutoffs in one depth-first proof. Nodes without numerical results are not mysterious zeros; they were never evaluated. We must follow the active path, identify each completed return, and state which inherited bound makes the next subtree irrelevant. Begin at MIN node A. Its first completed MAX child returns three, so A has beta three. Inside MAX node B, the first leaf returns five. Five reaches beta three, producing a beta cutoff that skips B's remaining leaf because A will prefer its alternative at three or less. A returns three to root MAX node C, establishing alpha three. MIN node D then receives a first completed child value zero. Zero is at most alpha three, so D has an alpha cutoff. MIN node E similarly reaches two and cuts off its remaining subtree. Finally C returns max of the decision-relevant branch results, equal to three. Full minimax at the same depth and evaluation also returns three. The trace demonstrates both labels: beta cutoff at MAX B, alpha cutoffs at MIN D and E, all justified by completed alternatives. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped. Advance to the beta cutoff inside B. B is MAX, its first leaf returns five, and inherited beta is three from MIN node A. Five reaches beta, so B's remaining leaf is skipped. Advance to root update C. A returns three, giving root MAX an explored alternative and alpha three. This newly earned floor will control the later MIN branches. Advance to D. Its first completed child returns zero, so MIN node D has v zero at most root alpha three. An alpha cutoff skips D's remaining subtree. Advance to E. Its first completed child returns two, again at most root alpha three. The same ancestor alternative justifies another alpha cutoff, though the local returned bound differs. Advance to the final root value. C returns max of the decision-relevant branch results, equal to three, matching full minimax at the same depth and with the same evaluation function.",
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
    note: "Verification needs an oracle, and full minimax supplies one for small controlled trees. Run both algorithms with identical legal actions, terminal utilities, cutoff depth, and evaluation function. Then compare root value, selected action, and evaluated work. Root values must match exactly. Selected actions must match unless equal-valued ties permit more than one correct move under different ordering. Alpha-beta should evaluate no more leaves than full minimax, though a poor ordering may produce almost no saving. Comparing only current and parent heuristic values is insufficient. Those local numbers can look reasonable while a bound is updated at the wrong node or a subtree is pruned under the wrong ancestor. The final decision plus an event-level trace reveals those implementation errors. Treat testing like a science experiment. Hold depth and evaluation fixed, vary ordering, count leaves and internal nodes, and assert the same decision. If the answer changes with ordering, the program has not discovered a bold new game strategy; it has discovered a bug.",
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
    note: "Poor ordering delays useful bounds, so alpha-beta approaches full minimax work. Good ordering searches likely strong MAX moves and likely weak MIN moves first, tightening alpha or beta early. Either visitation order returns the same deterministic depth-limited minimax result when the implementation is correct. Measure more than leaf count. Record internal nodes, elapsed time, memory, and the cost of computing the ordering heuristic. A brilliant ordering routine that spends an hour ranking moves before saving twelve milliseconds has optimized the lecture example but perhaps not the product. Expectimax changes the model by adding chance nodes that back up probability-weighted expected utility. This is appropriate when nature, dice, or uncertain outcomes select successors according to known probabilities rather than an adversary choosing the worst response. Monte Carlo tree search selectively grows a tree through repeated selection, expansion, simulation, and backup. It is not an alpha-beta shortcut pasted onto deterministic minimax. Changing visitation order preserves the backup rule; expectimax and MCTS change what evidence is collected or how values are backed up.",
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
    note: "The practice tree has a MAX root, three MIN children, nested MAX nodes, and fifteen leaves. Visit every edge left to right. Submit an event trace, not only a root number, because the location and justification of each cutoff are the assessed skills. For every internal node, record temporary v, incoming alpha and beta, the updated bound after each child, and any skipped subtree. Mark whether the cutoff is beta at MAX or alpha at MIN, and write the exact inequality that closes the window. The leaf sequence is five, two, ten, eleven, one, two, two, eight, six, five, twelve, four, three, twenty-five, and two, grouped by the branches in the image. Do not flatten those numbers into one list when computing backups; parent ownership determines every min and max. Your final report needs the root value, chosen branch, evaluated-leaf count, skipped-leaf count, and a statement about ordering. A different legal order may change which leaves are visited and how soon cutoffs appear, but it cannot change the depth-limited minimax result. Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration. Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.",
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
    note: "The reveal sequence checks the independent trace one proof at a time. The left MIN branch returns five, the middle branch is bounded at two, the right branch tightens to four, and root MAX chooses five. Do not reveal ahead of your own reasoning; prediction turns animation into evidence. On the left, the first MAX child returns five from leaves five and two. In the second MAX child, leaf ten reaches the MIN node's beta five, so a beta cutoff skips eleven. The completed left MIN result is five, establishing root alpha five. The middle MIN branch's first MAX child returns two from one, two, and two. Since two is at most root alpha five, an alpha cutoff skips the eight subtree and the six-five subtree. The right branch later tightens from twelve to four and cuts off its final twenty-five-two child. The root returns max of five, at most two, and four, equal to five. Nine of fifteen leaves were evaluated. Full minimax returns the same value and action. Each click should add one auditable claim, not merely make another card stop looking shy. Reveal the left MIN result. The first MAX child returns five; the second reaches beta five when leaf ten appears, so eleven is skipped. The completed MIN branch returns five and root alpha becomes five. Reveal the middle result. Its first MAX child returns two from one, two, and two. Since two is at most root alpha five, an alpha cutoff skips the eight branch and the six-five branch. Reveal the right branch's first tightening. Its first MAX child returns twelve. The next child returns max of four and three, equal to four, so the right MIN beta falls from twelve to four. Reveal the right-branch cutoff. Beta four is at most root alpha five, so the final MAX child containing twenty-five and two is skipped. The ancestor already prefers the left branch worth five. Reveal the root decision. MAX chooses max of five, at most two, and four, equal to five. Nine of fifteen leaves were evaluated, and full minimax agrees on both value and action.",
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
    note: "The exit task asks for three linked skills. Explain one beta cutoff and one alpha cutoff by naming the ancestor alternative. Trace v, alpha, and beta through the exact child return that closes the window. Verify that the pruned result matches full minimax under identical settings. A useful summary is inequality, owner, consequence. For v at least beta at MAX, a MIN ancestor owns the beta alternative, so remaining MAX siblings are skipped. For v at most alpha at MIN, a MAX ancestor owns the alpha alternative, so remaining MIN siblings are skipped. Move ordering changes running time because strong early evidence tightens bounds, but it does not change the minimax decision. Expectimax, MCTS, and other extensions answer different modeling needs by changing backup or sampling. Choose them because the environment differs, not because alpha and beta have become unfashionable. Before leaving, identify one operation you can perform without peeking: update bounds, label a cutoff, trace the practice tree, or design a verification test. The durable idea is simple: search may skip work only after completed evidence proves that the skipped work cannot change the chosen action.",
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
