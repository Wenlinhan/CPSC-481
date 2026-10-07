"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  ReplayableSourceAnimation,
  SearchCallout,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const sourceRoot = "/course-source/l04-best-first-astar";

function BestFirstOrderPrediction() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section>
      <span>Predict before revealing</span>
      <h3>Which node leaves OPEN next?</h3>
      <p>
        Greedy best-first search always selects the frontier node with the
        smallest heuristic value. Resolve ties in the left-to-right order shown.
      </p>
      <p>
        Write the complete selection order from <strong>A</strong> until the
        goal <strong>P</strong> is selected.
      </p>
      <div className="best-first-step-controls">
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide the order" : "Reveal the order"}
        </button>
      </div>
      {revealed && (
        <SearchCallout label="Selection order" tone="green">
          A(5) → B(4) → C(4) → H(3) → O(2) → P(3). O is explored before P,
          so greedy best-first can recover from a locally attractive branch
          instead of committing to it forever.
        </SearchCallout>
      )}
    </section>
  );
}

const greedyTrace = [
  {
    label: "Initialize",
    selected: "—",
    open: "[A5]",
    closed: "[]",
    detail: "Place the start node A in OPEN with h(A)=5.",
  },
  {
    label: "Evaluate A5",
    selected: "A5",
    open: "[B4, C4, D6]",
    closed: "[A5]",
    detail: "Expand A and insert its three children in heuristic order.",
  },
  {
    label: "Evaluate B4",
    selected: "B4",
    open: "[C4, E5, F5, D6]",
    closed: "[B4, A5]",
    detail: "B wins the tie with C because it appears first in OPEN.",
  },
  {
    label: "Evaluate C4",
    selected: "C4",
    open: "[H3, G4, E5, F5, D6]",
    closed: "[C4, B4, A5]",
    detail: "H becomes the most promising frontier node.",
  },
  {
    label: "Evaluate H3",
    selected: "H3",
    open: "[O2, P3, G4, E5, F5, D6]",
    closed: "[H3, C4, B4, A5]",
    detail: "Both O and the goal P enter OPEN; O has the smaller h value.",
  },
  {
    label: "Evaluate O2",
    selected: "O2",
    open: "[P3, G4, E5, F5, D6]",
    closed: "[O2, H3, C4, B4, A5]",
    detail: "O is not a goal, so the search returns to the best remaining node.",
  },
  {
    label: "Select goal P3",
    selected: "P3",
    open: "[G4, E5, F5, D6]",
    closed: "[O2, H3, C4, B4, A5]",
    detail: "The goal test succeeds when P is removed from OPEN.",
  },
];

function GreedyFrontierTrace() {
  const [step, setStep] = useState(0);
  const state = greedyTrace[step];

  return (
    <section>
      <span>Exact priority-queue trace · {step + 1} of {greedyTrace.length}</span>
      <h3>{state.label}</h3>
      <p>{state.detail}</p>
      <p><strong>Selected:</strong> {state.selected}</p>
      <p><strong>OPEN:</strong> {state.open}</p>
      <p><strong>CLOSED:</strong> {state.closed}</p>
      <div className="best-first-step-controls">
        <button
          disabled={step === 0}
          onClick={() => setStep(value => Math.max(0, value - 1))}
          type="button"
        >
          Previous
        </button>
        <button
          disabled={step === greedyTrace.length - 1}
          onClick={() => setStep(value => Math.min(greedyTrace.length - 1, value + 1))}
          type="button"
        >
          Next
        </button>
        <button onClick={() => setStep(0)} type="button">Reset</button>
      </div>
    </section>
  );
}

const admissibilityChecks = [
  {
    label: "Q1 · Perfect?",
    question: "Must an admissible heuristic predict the exact remaining cost?",
    answer: "No.",
    explanation:
      "It may underestimate. The requirement is 0 ≤ h(n) ≤ h*(n), not h(n)=h*(n). A more accurate admissible heuristic usually saves more search.",
  },
  {
    label: "Q2 · 8-puzzle",
    question: "Which familiar 8-puzzle heuristics are admissible?",
    answer: "Misplaced tiles and Manhattan distance.",
    explanation:
      "With unit-cost legal moves, each misplaced tile needs at least one move and each tile must travel at least its Manhattan distance. Any third heuristic must be proved pointwise: if h3(n)>h*(n) anywhere, it is not admissible.",
  },
  {
    label: "Q3 · “BFS”",
    question: "Is “BFS” the same algorithm as A*?",
    answer: "The abbreviation is too ambiguous.",
    explanation:
      "Breadth-first search matches uniform-cost search, and therefore A* with h=0, when every action has the same positive cost (often normalized to one). Greedy best-first search orders by h alone and is not A*.",
  },
];

function AdmissibilityStudio() {
  const [active, setActive] = useState(0);
  const item = admissibilityChecks[active];

  return (
    <div className="search-review-studio">
      <nav>
        {admissibilityChecks.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <ol>
        <li>
          <span>ASK</span>
          <p><strong>{item.question}</strong></p>
        </li>
        <li>
          <span>ANSWER</span>
          <p><strong>{item.answer}</strong> {item.explanation}</p>
        </li>
        <li>
          <span>JUSTIFY</span>
          <p>
            Explain why your answer holds using the relevant rule or cost assumption.
            For admissibility, show why h(n) ≤ h*(n) for every state: the estimate
            never exceeds the minimum remaining cost. Checking a few examples is not enough.
          </p>
        </li>
      </ol>
    </div>
  );
}

const reopenTrace = [
  {
    label: "Initialize S",
    selected: "—",
    open: "[S: g0, f3]",
    closed: "[]",
    detail: "Start with S. Its true optimal cost is 4 and h(S)=3.",
  },
  {
    label: "Expand S",
    selected: "S: g0, f3",
    open: "[A: g3, f3; B: g1, f4]",
    closed: "[S]",
    detail: "A has the smallest f, so it is selected before B.",
  },
  {
    label: "Expand A too early",
    selected: "A: g3, f3",
    open: "[B: g1, f4; G: g5, f5]",
    closed: "[S, A]",
    detail: "The first path to A costs 3; it produces a goal path costing 5.",
  },
  {
    label: "Discover a better A",
    selected: "B: g1, f4",
    open: "[A: g2, f2; G: g5, f5]",
    closed: "[S, B]",
    detail: "B→A improves g(A) from 3 to 2. Remove A from CLOSED and reopen it.",
  },
  {
    label: "Propagate the improvement",
    selected: "A: g2, f2",
    open: "[G: g4, f4]",
    closed: "[S, B, A]",
    detail: "Re-expanding A updates the goal from cost 5 to cost 4.",
  },
  {
    label: "Return the optimal goal",
    selected: "G: g4, f4",
    open: "[]",
    closed: "[S, B, A]",
    detail: "The recovered path is S→B→A→G with total cost 4.",
  },
];

function AStarReopenDemo() {
  const [step, setStep] = useState(0);
  const state = reopenTrace[step];

  return (
    <div className="frontier-trace m6-reopen-trace">
      <section>
        <span>Admissible but inconsistent heuristic · {step + 1} of {reopenTrace.length}</span>
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
            disabled={step === reopenTrace.length - 1}
            onClick={() => setStep(value => Math.min(reopenTrace.length - 1, value + 1))}
            type="button"
          >
            Next
          </button>
          <button onClick={() => setStep(0)} type="button">Reset</button>
        </div>
      </section>
      <div className="frontier-queues">
        <article>
          <span>Graph and heuristic</span>
          <svg className="m6-reopen-graph" viewBox="0 0 480 220" role="img" aria-labelledby="m6-reopen-title m6-reopen-desc">
            <title id="m6-reopen-title">Example graph for reopening A</title>
            <desc id="m6-reopen-desc">Directed edges: S to A costs 3; S to B costs 1; B to A costs 1; A to goal G costs 2. Heuristics: S 3, B 3, A 0, G 0.</desc>
            <defs><marker id="m6-reopen-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#52627a" /></marker></defs>
            <g fill="none" stroke="#52627a" strokeWidth="2.5" markerEnd="url(#m6-reopen-arrow)">
              <path d="M88 96 L191 53" /><path d="M88 120 L191 163" />
              <path d="M220 147 L220 79" /><path d="M250 46 L385 46 L410 78" />
            </g>
            <g fill="#6740d9" fontSize="19" fontWeight="800" textAnchor="middle">
              <text x="133" y="66">3</text><text x="132" y="160">1</text><text x="203" y="118">1</text><text x="328" y="35">2</text>
            </g>
            {[{name:"S",h:3,x:60,y:108},{name:"A",h:0,x:220,y:46},{name:"B",h:3,x:220,y:178},{name:"G",h:0,x:425,y:108}].map(node => (
              <g key={node.name}>
                <circle cx={node.x} cy={node.y} r="30" fill={state.selected.startsWith(node.name + ":") ? "#e4dcff" : "#f2f6fc"} stroke={node.name === "G" ? "#168578" : "#52627a"} strokeWidth="2" />
                <text x={node.x} y={node.y - 2} textAnchor="middle" fill="#1d2b45" fontSize="22" fontWeight="800">{node.name}</text>
                <text x={node.x} y={node.y + 17} textAnchor="middle" fill="#52627a" fontSize="14">h={node.h}</text>
              </g>
            ))}
          </svg>
          <small>Arrows show legal moves; numbers on edges are costs. G is the goal. Shaded node = selected node.</small>
        </article>
        <article>
          <span>OPEN</span>
          <strong>{state.open}</strong>
        </article>
        <article>
          <span>CLOSED</span>
          <strong>{state.closed}</strong>
          <small>Consistency fails on B→A: 3 &gt; 1+0. S→A→G costs 5; S→B→A→G costs 4.</small>
        </article>
      </div>
    </div>
  );
}

const applicationCases = [
  {
    title: "Autopilot",
    answer: "A* can plan a bounded route component, not the whole controller.",
    why: "Real flight is dynamic, partially observable, and stochastic. A* needs a state graph, an objective, and replanning or a richer decision model around it.",
  },
  {
    title: "Autonomous drone",
    answer: "A* fits a discretized, known motion-planning map.",
    why: "Cells or configurations can be states and energy or distance can be edge cost. Wind, moving obstacles, and uncertain sensing demand online replanning.",
  },
  {
    title: "Robot vacuum",
    answer: "A* fits point-to-point travel on a known floor plan.",
    why: "It does not by itself decide coverage, discover an unknown room, or react safely to people and pets; those require additional online behavior.",
  },
  {
    title: "Chess",
    answer: "Use adversarial search, not ordinary A*.",
    why: "An opponent chooses actions against us. Minimax and alpha-beta model alternating competitive decisions; a shortest-path frontier does not.",
  },
  {
    title: "Financial investment",
    answer: "A* alone is usually the wrong model.",
    why: "Returns and observations are uncertain, the environment changes, and objectives include risk. A deterministic offline path-cost model hides the central difficulty.",
  },
];

function ApplicationScene({ kind, title }: { kind: number; title: string }) {
  const line = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <svg className="m6-application-scene" role="img" viewBox="0 0 360 190">
      <title>{title} application scene</title>
      <rect className="scene-sky" height="190" rx="22" width="360" />
      {kind === 0 && <>
        <path className="scene-route" d="M28 142 C102 128 128 78 213 91 S302 58 338 49" {...line} />
        <path className="scene-ground" d="M20 155 H340" {...line} />
        <path className="scene-object" d="M105 98 l62 -17 56 -48 13 5 -26 52 58 21 -5 12 -66 -7 -39 31 -12 -5 17 -35 -58 3z" {...line} />
        <circle className="scene-marker" cx="319" cy="56" r="7" />
      </>}
      {kind === 1 && <>
        <path className="scene-ground" d="M18 151 Q75 114 132 146 T244 138 T342 149" {...line} />
        <path className="scene-object" d="M151 76 h58 M180 47 v58 M144 69 l16 14 M216 69 l-16 14 M164 52 l16 12 16-12 M164 100 l16-12 16 12" {...line} />
        <rect className="scene-object-fill" height="31" rx="7" width="44" x="158" y="62" />
        <path className="scene-route" d="M38 134 C86 83 121 133 176 112 S274 50 329 73" {...line} />
        <circle className="scene-marker" cx="329" cy="73" r="7" />
      </>}
      {kind === 2 && <>
        <path className="scene-ground" d="M22 148 H338 M68 35 V148 M292 35 V148" {...line} />
        <rect className="scene-furniture" height="52" rx="6" width="64" x="213" y="84" />
        <circle className="scene-object-fill" cx="127" cy="117" r="32" />
        <circle className="scene-wheel" cx="112" cy="143" r="7" />
        <circle className="scene-wheel" cx="142" cy="143" r="7" />
        <path className="scene-object" d="M110 112 q17 -17 34 0 M119 122 h16" {...line} />
        <path className="scene-route" d="M127 79 C142 48 198 50 222 72" {...line} />
      </>}
      {kind === 3 && <>
        <rect className="scene-board" height="128" width="128" x="116" y="30" />
        {[0, 1, 2, 3].map(row => [0, 1, 2, 3].map(col => <rect className={(row + col) % 2 ? "scene-square-dark" : "scene-square-light"} height="32" key={`${row}-${col}`} width="32" x={116 + col * 32} y={30 + row * 32} />))}
        <path className="scene-piece" d="M144 130 h36 l-4 -13 h-28z M151 116 q22 -20 10 -42 q25 8 21 42z" {...line} />
        <path className="scene-piece-alt" d="M202 130 h27 l-4 -12 h-19z M210 116 v-24 h13 v24 M209 91 h15" {...line} />
        <path className="scene-route" d="M169 68 C195 49 216 56 221 83" {...line} />
      </>}
      {kind === 4 && <>
        <path className="scene-ground" d="M30 148 H332" {...line} />
        <path className="scene-bars" d="M67 138 v-29 h28 v29 M115 138 V82 h28 v56 M163 138 v-43 h28 v43 M211 138 V59 h28 v79 M259 138 V42 h28 v96" {...line} />
        <path className="scene-route" d="M50 119 L101 93 151 107 202 73 252 83 310 38" {...line} />
        <circle className="scene-marker" cx="310" cy="38" r="7" />
        <path className="scene-risk" d="M59 43 l19 34 H40z M59 54 v10 M59 70 v1" {...line} />
      </>}
    </svg>
  );
}

function AStarApplicationPractice() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = applicationCases[active];

  return (
    <div className="algorithm-selection m6-application-practice">
      <nav>
        {applicationCases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.title}
            onClick={() => {
              setActive(index);
              setRevealed(false);
            }}
            type="button"
          >
            <ApplicationScene kind={index} title={entry.title} />
            <span>{entry.title}</span>
          </button>
        ))}
      </nav>
      <section>
        <ApplicationScene kind={active} title={item.title} />
        <div>
          <span>Application {active + 1} · {item.title}</span>
          <h3>Would A* be a defensible model?</h3>
          <p>Name the state, actions, edge cost, heuristic, and environmental assumptions before deciding.</p>
          <button onClick={() => setRevealed(value => !value)} type="button">
            {revealed ? "Hide analysis" : "Reveal one defensible analysis"}
          </button>
          {revealed && <SearchCallout label={item.answer} tone="green">{item.why}</SearchCallout>}
        </div>
      </section>
    </div>
  );
}

const propertyQuestions = [
  { prompt: "Is h1 admissible?", lens: "HEURISTIC h", answer: "Check 0 ≤ h1(n) ≤ h*(n) for every state." },
  { prompt: "Is h2 consistent?", lens: "HEURISTIC h", answer: "Check h2(n) ≤ c(n,n′)+h2(n′) on every edge." },
  { prompt: "Is DFS consistent?", lens: "CATEGORY MISMATCH", answer: "Consistency here is a property of h. Evaluate DFS for completeness, optimality, time, and space instead." },
  { prompt: "Is best-first search complete?", lens: "SEARCH ALGORITHM", answer: "State which best-first variant and the space, cycle, and termination assumptions." },
  { prompt: "Is algorithm A admissible?", lens: "SEARCH ALGORITHM", answer: "In the classical algorithm sense, ask whether A is guaranteed to return an optimal solution." },
];

function PropertyEvaluationFramework() {
  const [active, setActive] = useState(0);
  const item = propertyQuestions[active];

  return (
    <div className="m6-property-framework">
      <section className="m6-property-lenses">
        <article>
          <header><span>01</span><div><strong>Heuristic function h</strong><small>Judge an estimate</small></div></header>
          <p><b>Admissibility</b><em>0 ≤ h(n) ≤ h*(n)</em><small>Never overestimates true remaining cost.</small></p>
          <p><b>Consistency</b><em>h(n) ≤ c(n,n′)+h(n′)</em><small>Also monotonicity or local admissibility.</small></p>
          <p><b>Informedness</b><em>h1(n) ≤ h2(n) ≤ h*(n)</em><small>h2 is the tighter admissible lower bound.</small></p>
        </article>
        <article>
          <header><span>02</span><div><strong>Search algorithm</strong><small>Judge the whole procedure</small></div></header>
          <div className="m6-algorithm-gauges">
            <p><b>Complete?</b><small>Finds a solution if one exists.</small></p>
            <p><b>Optimal?</b><small>Returns a least-cost solution.</small></p>
            <p><b>Time?</b><small>How much work grows?</small></p>
            <p><b>Space?</b><small>How much must be stored?</small></p>
          </div>
          <aside><strong>Algorithm admissibility</strong> is the classical synonym for an optimality guarantee—not heuristic admissibility.</aside>
        </article>
      </section>
      <section className="m6-question-sorter">
        <nav>{propertyQuestions.map((question, index) => <button className={active === index ? "active" : ""} key={question.prompt} onClick={() => setActive(index)} type="button">{question.prompt}</button>)}</nav>
        <div><span>{item.lens}</span><strong>{item.prompt}</strong><p>{item.answer}</p></div>
      </section>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 4 · Lesson 6 · Informed search",
    title: "Best-First Search, A*, and Heuristic Quality",
    subtitle: "How should a search agent combine cost already paid with cost it predicts remains?",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Driving question</span>
          <h3>What deserves to leave the frontier next?</h3>
          <p>
            Retrieve four ideas: OPEN, CLOSED, path cost g(n), and parent links.
            Today a heuristic h(n) changes the expansion order.
          </p>
        </section>
        <div>
          <article>
            <strong>Greedy best-first</strong>
            <p>Select the frontier node with minimum predicted remaining cost h(n).</p>
          </article>
          <article>
            <strong>A*</strong>
            <p>Select the frontier node with minimum estimated total cost g(n)+h(n).</p>
          </article>
          <article>
            <strong>Heuristic quality</strong>
            <p>Ask what h guarantees, how much search it saves, and what it costs to compute.</p>
          </article>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Have students retrieve OPEN, CLOSED, g, and parent links before naming either informed-search rule. Preview the driving question and the distinction between h-only and g+h ordering.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Greedy best-first · Core idea",
    title: "Follow the smallest estimated distance to the goal",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Selection rule</span>
          <h3>Choose min h(n) from OPEN</h3>
          <p>
            The heuristic estimates cost from n to a goal. Greedy best-first
            uses that estimate alone, so “looks closest” is not the same as
            “lies on a least-cost path.”
          </p>
        </section>
        <div>
          <article>
            <strong>OPEN · priority queue</strong>
            <p>Stores generated but unexpanded nodes, keyed here by h(n).</p>
          </article>
          <article>
            <strong>CLOSED · explored record</strong>
            <p>Records expanded states and supports duplicate detection.</p>
          </article>
          <article>
            <strong>Parents and best g</strong>
            <p>Recover a path and decide whether a newly found duplicate is better.</p>
          </article>
          <SearchCallout label="Guarantee check" tone="amber">
            Greedy best-first is neither generally optimal nor complete in
            unrestricted spaces. OPEN and CLOSED organize work; they do not
            create a shortest-path guarantee.
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Disambiguate greedy best-first from breadth-first immediately. Explain that a min-priority queue supports efficient removal; a heap gives logarithmic insert/remove in typical implementations. CLOSED is better understood as an explored set or best-cost map than as a queue.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Greedy best-first · Procedure",
    title: "Generate broadly, then select the most promising frontier node",
    content: (
      <div className="algorithm-source-layout">
        <ol>
          <li>Put the start node in OPEN; keep CLOSED empty.</li>
          <li>Remove a node with minimum h from OPEN.</li>
          <li>Test whether its state satisfies the goal.</li>
          <li>Expand it and evaluate each successor.</li>
          <li>Insert unseen successors; update a duplicate when the new record is better.</li>
          <li>Record the expanded state in CLOSED and repeat.</li>
        </ol>
        <section>
          <h3>“Backtrack” means choose the next-best OPEN entry</h3>
          <p>
            Unlike hill climbing, the algorithm keeps alternatives. A dead end
            does not force it to undo physical actions; it simply pops another
            frontier entry.
          </p>
          <SearchCallout label="Path recovery" tone="cyan">
            Store a parent pointer with each accepted record. When a goal is
            selected, follow parents back to the start and reverse the chain.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Walk through the six operations. Frame the source comparison carefully: the method can follow one promising path like depth-first or hill climbing, retains alternatives across depths like a frontier search, and can choose another alternative like backtracking. Connect conceptual backtracking to selecting another OPEN entry, not necessarily moving an agent backward in the world. Contrast a linked-list priority queue with a heap or balanced tree.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Greedy best-first · Prediction",
    title: "Trace the heuristic order before seeing the answer",
    content: (
      <div className="tree-challenge source-definition-layout">
        <SearchSourceImage
          alt="Hypothetical state-space tree labeled with heuristic values, including goal node P"
          caption="Smaller heuristic values are preferred; bold nodes have been expanded."
          file="best-first-hypothetical-state-space.png"
          sourceRoot={sourceRoot}
        />
        <BestFirstOrderPrediction />
      </div>
    ),
    note: "Timing: 3 minutes. Give pairs 45 seconds to write the order. Ask why O is selected before P and how retaining OPEN differs from hill climbing. The exact order is A, B, C, H, O, P with the displayed tie order.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Greedy best-first · Implementation",
    title: "The pseudocode needs explicit duplicate and path policy",
    content: (
      <div className="algorithm-source-layout">
        <SearchSourceImage
          alt="Best-first search pseudocode with OPEN and CLOSED structures"
          caption="Procedure for maintaining the frontier, explored record, and current path."
          file="best-first-search-pseudocode.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Read the data structures, then repair the contract</h3>
          <p>
            OPEN is a min-priority queue keyed by h. CLOSED records expanded
            states. Each accepted node stores its state, parent, g value, and h
            value.
          </p>
          <SearchCallout label="Duplicate policy" tone="cyan">
            If a successor is unseen, insert it. If it represents a known state
            through a better g, update its record and parent; whether a CLOSED
            state must reopen depends on the algorithm and heuristic conditions.
          </SearchCallout>
          <SearchCallout label="Corrected guarantee" tone="amber">
            Following parent links returns the path the search found. Greedy
            best-first does not guarantee that this path is shortest.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Read the pseudocode as an implementation sketch rather than a theorem. Correct the claim that the current path necessarily becomes shortest. Highlight the minimum priority queue, explored record, parent links, and best-known g.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Greedy best-first · Exact trace",
    title: "OPEN determines every next move",
    content: (
      <div className="trace-source-layout">
        <SearchSourceImage
          alt="Best-first search state-space tree with the exact OPEN and CLOSED execution trace"
          caption="The trace selects the minimum-h OPEN entry until goal P is selected."
          file="best-first-open-closed-trace.png"
          sourceRoot={sourceRoot}
        />
        <GreedyFrontierTrace />
      </div>
    ),
    note: "Timing: 4 minutes. Advance one step only after students predict the next selected node and both queue contents. The displayed trace exactly follows the source example. Ask what tie policy was used for B4 and C4.",
    sourceSlides: [5],
  },
  {
    eyebrow: "8-puzzle · Scoring successors",
    title: "This figure already combines g and h",
    content: (
      <div className="puzzle-source-layout source-definition-layout">
        <SearchSourceImage
          alt="Eight-puzzle start state and three successors scored by f equals g plus h"
          caption="One move has been taken, so every shown successor has g=1; h counts misplaced tiles."
          file="eight-puzzle-f-score-successors.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Read each f score aloud</h3>
          <p>
            The start has g=0. Each shown successor has g=1. Counting tiles out
            of place gives the displayed totals f=6, f=4, and f=6.
          </p>
          <SearchCallout label="Naming matters" tone="amber">
            Because the ranking uses f(n)=g(n)+h(n), this is A* scoring—not
            greedy best-first scoring, which would compare h(n) alone.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Have students identify g, h, and f for all three successors. Correct the inherited best-first label: this particular ranking is A* because it uses g+h.",
    sourceSlides: [6],
  },
  {
    eyebrow: "8-puzzle · Data structures",
    title: "OPEN is ordered; CLOSED remembers what was expanded",
    content: (
      <div className="puzzle-source-layout m6-tall-source">
        <SearchSourceImage
          alt="Eight-puzzle OPEN and CLOSED collections after the third iteration"
          caption="A snapshot after the third iteration of the search."
          file="eight-puzzle-open-closed-third-iteration.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Interrogate the snapshot</h3>
          <p>
            OPEN contains generated candidates still eligible for selection.
            CLOSED contains states already expanded. Parent and best-g records
            support path recovery and duplicate comparison.
          </p>
          <ul>
            <li>A priority queue answers “which f is smallest?”</li>
            <li>A state-indexed map answers “have we seen this state?”</li>
            <li>A best-g record answers “is this duplicate an improvement?”</li>
          </ul>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to point to one OPEN state and one CLOSED state and explain why each is there. Emphasize that queue ordering and duplicate lookup are different operations and may require different structures.",
    sourceSlides: [7],
  },
  {
    eyebrow: "8-puzzle · Heuristic quality",
    title: "A weak heuristic leaves a large state space alive",
    content: (
      <div className="puzzle-source-layout m6-tall-source">
        <SearchSourceImage
          alt="Large generated eight-puzzle state space under best-first search"
          caption="A generated state space reveals how much work survives the heuristic."
          file="eight-puzzle-best-first-generated-state-space.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>What makes h weak or unreasonable?</h3>
          <p>
            A weak h gives many states similar priorities, so the search
            explores broadly. An unreasonable h may be expensive, unrelated to
            remaining cost, or systematically misleading.
          </p>
          <SearchCallout label="Design test" tone="cyan">
            Compare the number of expanded nodes, the cost of computing h, and
            whether h preserves the guarantee your algorithm needs.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to identify visual evidence of a weak heuristic in the generated tree. Collect hypotheses before introducing admissibility and consistency as formal quality conditions.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Heuristic guarantees · Admissibility",
    title: "An admissible heuristic never overestimates remaining optimal cost",
    content: (
      <div className="source-definition-layout">
        <SearchSourceImage
          alt="Definition graphic relating an admissible heuristic to optimal cost"
          caption="The intended idea is a lower bound on true optimal remaining cost."
          file="admissibility-and-optimality-definition.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <article>
            <span>True remaining cost</span>
            <p><strong>h*(n)</strong> is the cost of an optimal path from n to a goal.</p>
          </article>
          <article>
            <span>Admissibility</span>
            <p><strong>0 ≤ h(n) ≤ h*(n)</strong> for every n, with <strong>h(goal)=0</strong>.</p>
          </article>
          <article>
            <span>A* selection</span>
            <p><strong>f(n)=g(n)+h(n)</strong>; admissibility belongs to h, not to greedy selection.</p>
          </article>
          <SearchCallout label="Optimality conditions" tone="amber">
            Tree-search A* is optimal with an admissible h under standard
            nonnegative-cost and termination assumptions. Graph-search A*
            additionally needs consistency or a correct reopen policy.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Replace the inconsistent notation in the figure with the standard definition on the right. Separate the property of h from the guarantee of a particular A* implementation. Mention positive lower-bounded step costs or a finite relevant search space for termination.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Heuristic guarantees · Formative check",
    title: "Three questions expose three common confusions",
    content: <AdmissibilityStudio />,
    note: "Timing: 3 minutes. Let students answer all three tabs in pairs. Insist on an inequality or cost assumption as evidence. Say breadth-first in full; the abbreviation BFS is ambiguous in this lesson.",
    sourceSlides: [9],
  },
  {
    eyebrow: "A* · Evaluation function",
    title: "Estimate the total solution cost through each frontier node",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>A* selection rule</span>
          <h3>Choose min f(n)=g(n)+h(n)</h3>
          <p>
            g is cost already paid from the start. h estimates optimal cost
            remaining to a goal. Their sum estimates the cost of a complete
            solution constrained to pass through n.
          </p>
        </section>
        <div>
          <article>
            <strong>g(n) · known so far</strong>
            <p>Computed from the accepted parent path and edge costs.</p>
          </article>
          <article>
            <strong>h(n) · predicted remainder</strong>
            <p>Problem knowledge that should be cheaper than solving the remainder exactly.</p>
          </article>
          <article>
            <strong>f(n) · estimated total</strong>
            <p>The key used by A*’s minimum priority queue.</p>
          </article>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Frame A* as combining lowest-cost-first search with heuristic best-first guidance. Ask what changes when h=0 and what is lost when g is omitted.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Comparison · Breadth-first and A*",
    title: "Equal depth is not the same as equal estimated total cost",
    content: (
      <div className="puzzle-source-layout m6-tall-source">
        <SearchSourceImage
          alt="Side-by-side eight-puzzle comparison of breadth-first search and A-star"
          caption="The two methods impose different frontier priorities."
          file="breadth-first-vs-astar-eight-puzzle.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Name the assumptions behind each guarantee</h3>
          <p>
            Breadth-first search is complete with finite branching and is
            optimal when every action has the same cost. A* can handle unequal
            nonnegative costs when its heuristic and graph policy satisfy the
            required conditions.
          </p>
          <SearchCallout label="Equivalence condition" tone="cyan">
            A* with h=0 orders by g, which is uniform-cost search. Depth and g
            induce the same ordering when every step has the same positive cost,
            often normalized to one.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to state the equivalence condition before revealing the callout. Remind them that depth-first is not optimal, hill climbing is not optimal, and simulated annealing depends on its schedule. Keep breadth-first distinct from greedy best-first.",
    sourceSlides: [11],
  },
  {
    eyebrow: "A* in action · City graph",
    title: "Straight-line distance guides road search",
    content: (
      <div className="trace-source-layout m6-animation-fit">
        <ReplayableSourceAnimation
          alt="Animated A-star search across a city road graph"
          attribution="CountingPine · Own work · CC0 · Wikimedia Commons curid=31958129"
          caption="A* expands road-network nodes using traveled distance plus straight-line distance to the goal."
          file="astar-city-graph.gif"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Predict the next expansion before replay</h3>
          <p>
            Here g is road distance already traveled. A straight-line distance
            to the destination supplies h because roads cannot beat the direct
            geometric distance.
          </p>
          <SearchCallout label="Watch for" tone="cyan">
            The visually nearest node need not win: A* compares g+h, not h alone.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Pause before replay and ask students to name g, h, and f for one candidate. Use the animation to distinguish a geometrically attractive node from the minimum-total-estimate node.",
    sourceSlides: [12],
  },
  {
    eyebrow: "A* in action · Motion planning",
    title: "Configuration-space search routes around obstacles",
    content: (
      <div className="trace-source-layout m6-animation-fit">
        <ReplayableSourceAnimation
          alt="Animated A-star robot motion planning around obstacles"
          attribution="Subh83 · Own work · CC BY 3.0 · Wikimedia Commons curid=14916867"
          caption="Open circles show frontier configurations; filled circles show expanded configurations."
          file="astar-robot-motion-planning.gif"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>The state is a robot configuration</h3>
          <p>
            Edges represent feasible local motions, g accumulates motion cost,
            and h estimates remaining distance. Obstacles invalidate direct
            moves and force the frontier to route around them.
          </p>
          <SearchCallout label="Interpret the marks" tone="cyan">
            Open circles are OPEN; filled circles are CLOSED. Color encodes the
            distance measure used in the visualization.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Ask what the nodes and edges mean before playing. Point out OPEN and CLOSED encodings, then ask what must change if an obstacle moves after planning begins.",
    sourceSlides: [13],
  },
  {
    eyebrow: "A* in action · Rail route",
    title: "A lower-bound geography heuristic focuses a national route",
    content: (
      <div className="trace-source-layout m6-animation-fit">
        <ReplayableSourceAnimation
          alt="Animated A-star rail search from Washington DC to Los Angeles"
          attribution="Srossd · Own work · CC BY-SA 3.0 · Wikimedia Commons curid=35900474"
          caption="A* searches a rail network from Washington, D.C. to Los Angeles."
          file="astar-washington-los-angeles-rail.gif"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Great-circle distance is a useful lower bound</h3>
          <p>
            Rail distance already traveled supplies g. Great-circle distance to
            Los Angeles supplies h because a rail route cannot be shorter than
            the direct surface distance between its endpoints.
          </p>
          <SearchCallout label="Assumption" tone="amber">
            The comparison is valid only when edge costs and h use compatible
            units and the route cost cannot undercut direct distance.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Ask why great-circle distance is admissible for distance-minimizing rail travel. Surface the need for compatible units and a lower-bound argument.",
    sourceSlides: [14],
  },
  {
    eyebrow: "A* special case · Zero heuristic",
    title: "Set h(n)=0 and A* becomes uniform-cost search",
    content: (
      <div className="trace-source-layout m6-animation-fit">
        <ReplayableSourceAnimation
          alt="Animated Dijkstra shortest-path search on a weighted graph"
          attribution="Ibmua · Work by uploader · Public Domain · Wikimedia Commons curid=6282617"
          caption="With h=0, the frontier is ordered entirely by accumulated path cost g."
          file="dijkstra-shortest-path.gif"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>f(n)=g(n)+0=g(n)</h3>
          <p>
            On a graph with nonnegative edge costs, this is
            uniform-cost/Dijkstra-style search: expand the unsettled node with
            minimum known distance from the start.
          </p>
          <SearchCallout label="Do not overgeneralize" tone="amber">
            Breadth-first search is equivalent only when the same positive step
            cost makes shallowest depth and smallest g the same ordering.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Replay once and ask why the wavefront follows path cost rather than geometric distance. State the nonnegative-edge requirement and the equal-unit-cost condition for breadth-first equivalence.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Heuristic guarantees · Consistency",
    title: "A consistent heuristic obeys a triangle inequality on every edge",
    content: (
      <div className="source-definition-layout">
        <SearchSourceImage
          alt="Definition graphic for heuristic consistency or monotonicity"
          caption="Consistency compares the estimate at a node with one step plus the estimate at its successor."
          file="heuristic-consistency-definition.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <article>
            <span>Edge condition</span>
            <p><strong>h(n) ≤ c(n,n′)+h(n′)</strong> for every successor n′, with h(goal)=0.</p>
          </article>
          <article>
            <span>Monotone f</span>
            <p>Along a path, consistency makes <strong>f(n′) ≥ f(n)</strong>.</p>
          </article>
          <article>
            <span>Consequence</span>
            <p>Under standard conditions, consistency implies admissibility and lets graph-search A* close a node at its best g.</p>
          </article>
          <SearchCallout label="Diagnostic" tone="cyan">
            Check one edge at a time. A violation means a later path may improve
            a state that was already expanded.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Derive nondecreasing f by adding g(n)+c(n,n') to both sides. Relate the inequality to the ordinary triangle inequality. Misplaced tiles and Manhattan distance are consistent for the standard 8-puzzle; an arbitrary h3 need not be.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Graph-search A* · Duplicate handling",
    title: "An inconsistent heuristic can force a CLOSED node to reopen",
    content: <AStarReopenDemo />,
    note: "Timing: 4 minutes. Step through the graph manually. Verify admissibility first, then show the consistency violation on B→A. If A remains permanently CLOSED, the algorithm may return cost 5; reopening A propagates g=2 and returns the optimal cost 4.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Heuristic quality · Dominance",
    title: "A more informed admissible heuristic gives tighter lower bounds",
    content: (
      <div className="source-definition-layout">
        <SearchSourceImage
          alt="Definition graphic comparing more and less informed heuristics"
          caption="Pointwise larger admissible values supply tighter lower bounds."
          file="heuristic-informedness-definition.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <article>
            <span>Dominance</span>
            <p>If admissible h1 and h2 satisfy <strong>h1(n) ≤ h2(n)</strong> for all n, h2 dominates h1.</p>
          </article>
          <article>
            <span>8-puzzle example</span>
            <p>Manhattan distance dominates misplaced-tile count for the standard unit-cost puzzle.</p>
          </article>
          <article>
            <span>Search effect</span>
            <p>With comparable tie-breaking, A* using h2 typically expands no more nodes than A* using h1.</p>
          </article>
          <SearchCallout label="Engineering qualification" tone="amber">
            “More informed” does not mean free. Count the time and memory needed
            to compute or retrieve the stronger heuristic.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students to compare misplaced tiles and Manhattan distance on one board. State dominance pointwise, not as an average. Qualify node-expansion benefits with tie-breaking and heuristic computation cost.",
    sourceSlides: [17],
  },
  {
    eyebrow: "Heuristic quality · Total effort",
    title: "Search savings must exceed the cost of control knowledge",
    content: (
      <div className="puzzle-source-layout source-definition-layout">
        <SearchSourceImage
          alt="Graph showing search cost decreasing and heuristic control cost increasing"
          caption="Total problem-solving cost can be U-shaped as heuristic effort increases."
          file="heuristic-informedness-cost-tradeoff.png"
          sourceRoot={sourceRoot}
        />
        <section>
          <h3>Optimize total cost, not node count alone</h3>
          <p>
            A stronger heuristic can reduce search and rule-application cost,
            yet require more preprocessing, memory, sensing, or computation at
            every node.
          </p>
          <SearchCallout label="Measure" tone="cyan">
            Total effort = search work + heuristic/control work. The most
            informed available heuristic is not automatically the fastest
            end-to-end system.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Read all three curves: search cost falls, heuristic/control cost rises, and total cost can have an interior minimum. Ask for a real example of a heuristic whose computation could dominate expansion.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Evaluation · First identify the object",
    title: "Use one lens for h and another for the search algorithm",
    content: <PropertyEvaluationFramework />,
    note: "Timing: 5 minutes. First separate the object being judged: a heuristic function or a search procedure. For h, test admissibility, consistency (also monotonicity or local admissibility), and informedness. For the procedure, test completeness, optimality or algorithm admissibility, time, and space under explicit assumptions. Use every sorter prompt. Treat 'Is DFS consistent?' as a category mismatch under the heuristic definition of consistency.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Application practice · Model before choosing",
    title: "Can all intelligent tasks use A*?",
    content: <AStarApplicationPractice />,
    note: "Timing: 4 minutes. Assign one application per group, require a state/action/cost/heuristic model, then reveal the analysis. The point is not that A* is rare; it is that a deterministic offline path model is only one component of many systems.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Limits · Environment assumptions",
    title: "Offline deterministic search is only one corner of agency",
    content: (
      <div className="algorithm-map">
        <section>
          <article><span>1</span><h3>Physical action</h3><p>Backing up may be costly or impossible; computational backtracking is not physical reversal.</p></article>
          <article><span>2</span><h3>Uncertainty</h3><p>Partial observations, stochastic outcomes, and unknown models break a fixed deterministic graph.</p></article>
          <article><span>3</span><h3>Change</h3><p>Dynamic worlds require online sensing, replanning, or policies rather than one offline path.</p></article>
          <article><span>4</span><h3>Other agents</h3><p>Cooperation changes coordination; competition requires adversarial reasoning.</p></article>
        </section>
        <aside>
          <span>Environment audit</span>
          <p>Deterministic, stochastic, or nondeterministic?</p>
          <p>Fully observable, partially observable, or unknown?</p>
          <p>Episodic or sequential; static or dynamic?</p>
          <p>Discrete or continuous; known or learned?</p>
          <p>Single-agent, cooperative, or competitive?</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Use the environment audit aloud on one application from the prior slide. Note that a heuristic may be learned or computed at runtime. Preview multi-agent competition as the next conceptual turn.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Synthesis · Cumulative assessment",
    title: "Trace it, justify it, and decide when it belongs",
    content: (
      <div className="search-exit">
        <article>
          <span>1 · Trace</span>
          <h3>Execute the frontier</h3>
          <p>Given a weighted graph and h table, show every OPEN, CLOSED, parent, g, and f update—including a reopened state.</p>
        </article>
        <article>
          <span>2 · Justify</span>
          <h3>Prove the heuristic claim</h3>
          <p>Use 0≤h≤h* for admissibility and h(n)≤c+h(n′) for consistency. State all cost and termination assumptions.</p>
        </article>
        <article>
          <span>3 · Decide</span>
          <h3>Defend the model</h3>
          <p>Choose greedy best-first, A*, uniform-cost, breadth-first, or a non-path-search model—and name the guarantee and tradeoff.</p>
        </article>
        <aside>
          <strong>Reading and bibliography</strong>
          <p>
            Read George F. Luger,{" "}<em>Artificial Intelligence: Structures and
            Strategies for Complex Problem Solving</em>, 6th ed., Chapter 4
            (Addison-Wesley, 2009); and review Stuart Russell and Peter Norvig,
            {" "}<em>Artificial Intelligence: A Modern Approach</em>, 3rd ed.,
            Chapter 3 (Prentice Hall, 2010).
          </p>
        </aside>
      </div>
    ),
    note: "Timing: 5 minutes. Use the three cards as a cumulative exit task: one exact trace, one guarantee proof, and one modeling decision. Collect responses or assign the full trace for submission. Close with the two readings and their roles.",
    sourceSlides: [22],
  },
];

export function Meeting06Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      hoverEffects
      meetingLabel="Module 4 · Lesson 6"
      meetingTitle="Best-First Search, A*, and Heuristic Quality"
      notesMode="key-points"
      slides={slides}
      sourceCollectionLabel="L04_BFS&AStar.pptx"
      sourceCollectionPath="l04-best-first-astar"
    />
  );
}
