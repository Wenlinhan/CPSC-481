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
    note: "Lesson six adds informed judgment to the frontier. OPEN still stores generated candidates, CLOSED still records expanded states, g of n still measures cost already paid, and parent links still recover a route. The new ingredient is h of n: a problem-specific estimate of the cost that remains. Read the three visible cards as a progression: h alone for greedy selection, g plus h for. Think of planning a road trip. Greedy best-first stares at the remaining map distance, while A-star also checks the fuel already burned. One behaves like an impatient tourist pointing at the destination; the other keeps both the receipt and the compass on the dashboard. If two frontier states have h values two and five but their g values are one hundred and one, greedy prefers. A heuristic is guidance, not prophecy. A small h value can make a state look attractive without proving that the full route through it is cheap. The central question is therefore not merely which number is smallest, but what that number means and what guarantee it supports. OPEN and CLOSED organize the computation; neither list magically creates optimality. Optimality comes from the evaluation rule, the. By the end, you should be able to trace greedy best-first and A-star, prove admissibility or consistency, compare heuristic strength, and reject A-star when the environment is dynamic, uncertain, or adversarial. The algorithm name comes after the model and assumptions, never before them. Keep four columns in your notes: selected state, g, h, and f. That tiny ledger prevents the common mistake of calling every.",
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
    note: "Greedy best-first search removes from OPEN whichever node has minimum h of n. The heuristic estimates remaining goal cost, so the rule says, choose what currently looks closest. It ignores the path cost already accumulated, which makes the method energetic, focused, and occasionally spectacularly gullible. Focus on the selection rule shown at left, then distinguish it from the three records shown at right. Selection, duplicate. Imagine hiking toward a mountain by always walking toward the peak as the crow flies. A cliff can make the visually closest position a terrible route. Greedy search behaves similarly: it may race down a promising-looking branch while a slightly less glamorous frontier node begins a much cheaper path. With frontier entries X having h equals two and Y having h equals four, greedy selects. OPEN is a minimum-priority queue keyed here by h. CLOSED is an explored record used for duplicate handling. Parent pointers recover the selected route, and a best-g record can detect an improved duplicate even though g does not decide which greedy node leaves OPEN next. A heap usually supports logarithmic insertion and removal, while a state-indexed map supports fast duplicate lookup. Calling CLOSED a queue. Greedy best-first is not generally optimal, and in unrestricted spaces it is not generally complete. A neat priority queue does not repair those limits. It merely executes the chosen policy efficiently, like a very organized assistant following an overconfident instruction. Before using greedy search, ask whether a locally low estimate correlates with progress, whether cycles are controlled, and whether any solution is sufficient. If minimum-cost.",
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
    note: "The procedure begins by placing the start node in OPEN and leaving CLOSED empty. It repeatedly removes a minimum-h node, performs the goal test, generates legal successors, handles duplicates, records parent information, and continues until a goal is selected or OPEN becomes empty. Walk down the numbered list in order. Removing, goal-testing, expanding, inserting, updating, and closing are distinct events; changing their order can change. The crucial distinction from hill climbing is memory of alternatives. Greedy best-first may follow one branch deeply, but siblings remain in OPEN. When the favorite branch disappoints, the algorithm chooses the next-best waiting entry instead of declaring that the universe has personally betrayed it. Picture OPEN as a waiting room sorted by estimated remaining distance. Exploring one patient does not erase everyone else. That retained. The word backtrack here describes a computational choice, not necessarily a physical reverse action. A planner can pop another stored frontier record without commanding a drone to fly backward through every previous coordinate. Representation and execution live at different levels. Parent links point through accepted records, so when a goal is removed the program follows those links back to the start and reverses the chain.. Duplicate policy must state what counts as the same state and what happens when a cheaper path appears. Insert an unseen state, compare best g for a known one, update its parent when improved, and decide whether an expanded state is allowed to reopen. For an implementation answer, name both structures: a priority queue for selecting minimum h and a hash map for state membership.",
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
    note: "This state-space tree labels nodes with heuristic values. Greedy best-first always removes the smallest h currently in OPEN, with the displayed left-to-right tie rule. Before revealing anything, separate nodes already expanded from nodes merely visible in the generated tree. A node drawn in the picture is not necessarily in OPEN yet. Only successors of expanded nodes have been generated, so trace the frontier after every. Enlarge the figure and begin at A with h five. Expanding A generates B four, C four, and D six. B wins the tie by the stated order. Its children are less attractive, so C still gets the next turn rather than being forgotten. After B expands, C four remains ahead of E five, F five, and D six. The waiting frontier is the algorithm's. From C, node H with h three becomes best. H generates O two and goal P three. O leaves OPEN before P because two is smaller than three, even though P has a giant metaphorical sign saying GOAL. The goal test occurs on selection. Selecting O before P is not a failure. O is checked, found not to be a goal, and then P becomes. The final removal order is A, B, C, H, O, P. This example shows both greed and recovery: h pulls the search toward O, but retained alternatives return it to P. Predicting first makes the reveal evidence rather than decorative confetti. Now use the control to compare your written order. If yours differs, locate the first disagreement and name its cause: generation timing, tie-breaking, or.",
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
    note: "The pseudocode is an implementation sketch, so read it as a contract that needs clarification. OPEN selects minimum h, CLOSED records expanded states, and each accepted node should carry state, parent, best-known g, and h. Those fields support different correctness obligations. Do not let the data structures blur together. The priority queue answers who is next, the map answers whether this state is known, and. Enlarge the algorithm and follow one iteration: remove a record, test its state, generate successors, compare duplicates, update accepted records, and place the expanded state in CLOSED. A missing duplicate rule can create multiple records for one state or preserve an expensive parent forever. Suppose state Q first arrives with g ten and later with g six. Keeping the older record can corrupt the returned. The source wording can sound as if following parents always returns a shortest path. Repair that claim. Parent pointers return the path associated with the selected goal record; greedy h-only ordering provides no general minimum-cost guarantee. Optimality is a theorem about the selection rule plus assumptions, not a side effect of writing the word shortest beside a parent chain. Code comments are not legally binding. A robust policy says when an OPEN duplicate is decreased and when a CLOSED state reopens. Greedy selection may still use h alone, but best g remains useful for choosing which record and parent represent the state. When you close the enlarged view, summarize the repaired contract in one sentence: greedy chooses by h, tracks best records and parents, detects duplicates, and returns the found.",
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
    note: "The exact trace turns frontier ordering into observable state. At initialization, OPEN is A five and CLOSED is empty. Each Next click should follow a prediction: name the selected entry, say which successors appear, then give the complete ordered OPEN and CLOSED lists. Open the figure long enough to study the labels, then return to the live trace. The diagram explains the topology; the control. Expanding A yields B four, C four, D six. B wins the tie, so CLOSED becomes B then A after B expands, while C remains ahead of the new E five and F five. The priority queue preserves every unresolved alternative. Tie-breaking is visible evidence, not trivia. If C were chosen before B, the order of intermediate expansions could change even though the minimum-h rule. Expanding C inserts H three and G four. H is now best; expanding it inserts O two and P three. O is selected before the goal, produces no successful result, and leaves P as the smallest remaining frontier node. At every step, read OPEN from left to right as increasing priority under the displayed policy. CLOSED is shown most-recent-first here, so do not accidentally interpret. When P is removed, the goal test succeeds. The trace ends with goal selection, not with P's earlier generation. That distinction matters because many optimal-search proofs rely on the selected entry being the best frontier candidate at acceptance time. The last click demonstrates the acceptance event. Use parent links from P back through H and C to A to recover a path; reversing those links. Advance from initialization and select A five. Its expansion inserts B four, C four, and D six into OPEN while A enters CLOSED. The next choice must come. Select B four by the displayed left-to-right tie rule. E five and F five join OPEN, but C four remains ahead because its heuristic is still smaller. Select C four. Its children include H three and G four, so H jumps to the front of OPEN. CLOSED now documents three completed expansions. Select H three and generate O two plus goal P three. O receives priority despite P being a goal because greedy ordering compares heuristic values before the goal. Select O two. O fails the goal test and contributes no better candidate, so the search returns to the stored frontier rather than becoming trapped on this branch. Select P three from OPEN. The goal test now succeeds; follow parent links through H and C to A, then reverse them to obtain the forward solution path.",
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
    note: "This eight-puzzle picture is sometimes introduced near best-first search, but its numbers reveal the actual algorithm. The displayed score is f of n equals g of n plus h of n. Once g participates in priority, we are looking at A-star scoring, not greedy h-only scoring. The center successor wins because its total is four while the alternatives total six. The visible choice is therefore. Enlarge the boards and count carefully. The start has g zero. Every displayed successor is one legal move away, so each has g one. The heuristic counts misplaced tiles, producing the visible totals f six, f four, and f six. Misplaced tiles is a relaxation-based lower bound: every tile currently out of place must participate in at least one move before the puzzle can finish. Naming matters because algorithms can inspect the same states while making different choices. Greedy would compare only the three h values. A-star compares the estimated total through each successor, and uniform-cost would compare only g. If all three successors have equal g, greedy and A-star may temporarily agree on their ranking. Agreement on one layer does not make the rules identical; deeper nodes can carry. For each successor, say the triple g, h, f aloud. This simple habit prevents arithmetic from floating free of meaning. g is paid cost, h is predicted remainder, and f is the estimated cost of a complete solution through that node. After closing the figure, create one imaginary successor with g five and h zero. Compare it with g one and h three. Both have.",
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
    note: "This third-iteration snapshot separates two questions. OPEN answers which generated candidate can still be selected, and its order reflects the evaluation score. CLOSED answers which states have already been expanded. One is a priority structure; the other is an explored-state record. Do not infer path order from the visual arrangement of CLOSED. The membership fact is usually more important than display order; what matters is. Enlarge the boards and point to one OPEN state. It is waiting because it has been generated but not expanded. Then point to one CLOSED state. Its successors were already considered, so retaining it supports duplicate detection rather than another ordinary turn. The same puzzle state can be reached by moving a tile out and immediately back. Without state identity checks, the frontier grows reversible-action. Queue ordering and state lookup are different operations. A heap is good at removing minimum f, while a hash map is good at asking whether a board configuration has appeared and what best g has been recorded for it. A practical node record might store a compact board key, g, h, parent identifier, and status. The priority queue can reference that record while the map. Parent and best-g fields connect the structures. When a duplicate board arrives, compare the new g with the stored one. If it improves the record, update the parent and possibly the frontier position or reopen policy. Close the enlarged snapshot and explain the division of labor without acronyms: select cheaply, recognize duplicates quickly, preserve the best route, and know whether prior expansion should block or.",
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
    note: "The large generated puzzle tree is a visual diagnosis. Many states survive with similar priorities, so the heuristic fails to sharply distinguish promising from unpromising regions. A weak h can still be correct; it simply provides little pruning power beyond uninformed cost ordering. The picture does not by itself prove inadmissibility. Broad expansion may indicate an admissible but weak lower bound. Formal properties require inequalities. Enlarge the tree and notice the broad frontier. If h assigns nearly the same estimate everywhere, A-star behaves more like uniform-cost search. The compass points north, technically, but with the enthusiasm of a refrigerator magnet. Compare h equals zero with misplaced tiles. Both can be admissible, but misplaced tiles separates some boards that zero treats identically. Manhattan distance often separates them more strongly while remaining. A heuristic can also be unreasonable for a different reason: it may be expensive to compute, unrelated to actual remaining cost, or systematically misleading. Quality includes information, computation cost, and compatibility with the guarantee the algorithm needs. A misleading overestimate may reduce expansions and still destroy A-star's optimality guarantee. Fast and wrong can look excellent on a node-count chart, which is why guarantees and performance. Measure at least three quantities: nodes expanded, time or memory spent computing h, and solution quality under the stated assumptions. A smaller search tree is not a win if every heuristic call quietly solves another difficult problem. Close the figure and propose one improved puzzle heuristic. State what relaxation makes it a lower bound and what extra computation it costs. That pair of statements is.",
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
    note: "Admissibility is a pointwise property of h. Let h-star of n be the true optimal remaining cost from n to a goal. An admissible heuristic satisfies zero less than or equal to h of n, less than or equal to h-star of n, for every relevant state. Misplaced tiles is admissible for the unit-cost eight-puzzle because every misplaced tile must be addressed by future motion.. Enlarge the definition and interpret h as a lower-bound price tag. If the cheapest remaining trip truly costs twelve, estimates zero, seven, or twelve are admissible; thirteen is not. The estimate may be pessimistically small, but it may never promise a cost larger than reality. Admissible does not mean accurate. The zero heuristic is perfectly admissible and perfectly unhelpful about direction. It preserves A-star's safety. Admissibility belongs to the heuristic, not automatically to greedy selection. Tree-search A-star can use an admissible h to obtain optimality under standard nonnegative-cost and termination conditions. Graph-search A-star also needs consistency or a correct reopening policy. Negative estimates are usually excluded because they cease to represent remaining cost and can distort ordering. Nonnegative edge costs and suitable termination assumptions also matter; the inequality alone does. At a goal, h should be zero because no remaining cost is required. To prove a heuristic admissible, identify the relaxed problem or lower-bound argument that prevents overestimation; familiarity, popularity, or a confident textbook font is not a proof. Close the figure and test one proposed h value against h-star. One counterexample is sufficient to disprove admissibility, while a proof must cover every state in.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Heuristic guarantees · Formative check",
    title: "Three questions expose three common confusions",
    content: <AdmissibilityStudio />,
    note: "Question one asks whether admissible means perfect. No. The defining inequality permits underestimation; exact equality with h-star would be a perfect heuristic, usually as expensive as already knowing the solution. Admissibility is a safety ceiling, not a demand for clairvoyance. Use the first tab to separate admissible from perfect, then move the focus to the answer-and-proof sequence. A lower estimate can waste work without violating. Question two asks about eight-puzzle heuristics. Misplaced tiles and Manhattan distance are admissible with standard unit-cost moves. Each needs a lower-bound argument. Any mysterious third heuristic must be checked pointwise rather than admitted to the club because its name sounds mathematical. On the second tab, explain why one legal move changes tile distances in a controlled way. The proof is tied to the move model. Question three exposes abbreviation trouble. BFS might mean breadth-first search or best-first search. Breadth-first equals uniform-cost, and therefore A-star with h zero, only under equal positive step costs. Greedy best-first orders by h alone and is not A-star. On the third tab, say breadth-first and greedy best-first in full. This is not vocabulary fussiness: the two algorithms prioritize different quantities and support different guarantees. The proof habit is the takeaway. For a heuristic claim, write the relevant inequality and the cost assumptions. For an algorithm claim, state the search variant, graph policy, branching, edge costs, and termination conditions. Acronyms cannot carry those assumptions for you. For each response, ask what evidence would falsify it. A single overestimating state defeats admissibility, an edge violation defeats consistency, and unequal step costs.",
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
    note: "A-star chooses the frontier node with minimum f of n, where f equals g plus h. g is the accepted path cost from the start to n. h estimates optimal remaining cost. Their sum estimates a complete solution constrained to pass through n. Move focus across the three visible cards exactly as the narration names g, h, and f. Leaving the highlight on g while. Imagine comparing airline itineraries. g is the money already charged for the legs booked so far; h is a lower-bound estimate for reaching the destination. Choosing by only h ignores sunk travel, while choosing by only g ignores direction. A-star balances both ledgers. For frontier X with g four and h nine, f is thirteen. For Y with g seven and h three, f is. g is computed from edge costs and parent records. h comes from problem knowledge and should be cheaper than solving the remaining problem exactly. f is not a third mysterious oracle; it is the arithmetic combination used as the priority key. An admissible h makes f a lower bound on the cost of any solution through n. That lower-bound interpretation is what supports A-star's comparison. Two special cases clarify the rule. If h is zero everywhere, A-star becomes uniform-cost search. If g is omitted, the behavior becomes greedy best-first. The missing term reveals which information and which guarantees have been discarded. Keep units compatible: if g is minutes and h is kilometers, addition produces numerical soup. Convert both to the same objective before placing the sum in a priority queue.",
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
    note: "Breadth-first search orders by depth, while A-star orders by estimated total cost. Those rankings coincide only under special conditions. Equal depth says the same number of actions; it does not say those actions have equal cost or lead equally close to the goal. A two-edge route costing one hundred per edge is shallower than a three-edge route costing one per edge. Breadth-first prefers the former. Enlarge the comparison and inspect the different wavefronts. Breadth-first treats all nodes at a level alike until arrival order breaks ties. A-star can pass over a shallow node when its g-plus-h estimate is worse than a deeper candidate's estimate. The picture illustrates priorities, not a universal speed ranking. A weak heuristic can make A-star expand nearly as broadly as uniform-cost, while a strong admissible heuristic. Breadth-first is complete with finite branching and optimal when every action has the same cost. A-star can handle unequal nonnegative costs when its heuristic and duplicate policy satisfy the required conditions. The assumptions belong beside the guarantee. Goal timing matters. For cost-sensitive search, accepting the first generated goal can be premature because another frontier path may later reach a cheaper goal record. A-star with h zero becomes uniform-cost search. Uniform-cost and breadth-first impose the same order when every step has one common positive cost, often normalized to one. Otherwise depth is a poor substitute for accumulated price. Close the figure and state the equivalence as a conditional sentence: with h zero A-star is uniform-cost; with equal positive step costs uniform-cost's g layers match breadth-first depth layers.",
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
    note: "In the city graph, nodes represent locations and edges represent road segments. g accumulates road distance already traveled. Straight-line distance to the destination supplies h because an actual road route cannot be shorter than the direct geometric distance between endpoints. The open frontier is a set of partially evaluated routes, not a single glowing path. Each candidate carries its own g, h, f, and parent. Enlarge the animation before replaying it. Watch the frontier develop around the network, but resist choosing whichever dot looks closest on the screen. A-star compares traveled distance plus straight-line remainder, so a geometrically tempting node can lose after an expensive detour. A road that initially moves away from the goal may reduce total cost by connecting to a fast route. Greedy h-only search is especially. Replay the animation and predict the next expansion from candidate f values. The heuristic is admissible for distance minimization only when edge costs use compatible distance units and roads cannot create wormholes. Campus parking may feel non-Euclidean, but the graph still needs a defensible metric. During replay, pause mentally at each expansion and ask whether the selected node minimizes h or f. The visible difference. The transfer question is what changes if travel time replaces distance. Straight-line kilometers may remain a weak proxy but are not automatically a lower bound on minutes. A valid time heuristic needs a speed bound or another argument connecting geography to cost. After the replay, invent one blocked road. A fixed offline A-star result becomes stale; the system must update the graph and replan or.",
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
    note: "For robot motion planning, a node is a configuration rather than merely a point on the floor. Edges represent feasible local motions, g accumulates motion cost, and h estimates remaining cost. Obstacles remove transitions and force the frontier to route through valid free space. Configuration may include position, orientation, joint angles, or velocity. A visually simple workspace can therefore induce a high-dimensional state space where. Enlarge the animation and identify its marks. Open circles represent frontier configurations in OPEN; filled circles represent expanded configurations in CLOSED. The growing pattern shows computation exploring around obstacles rather than a robot physically visiting every displayed point. The successor function is responsible for legal local motion. A heuristic may guide toward the goal but cannot legalize a transition that intersects an obstacle. Replay and watch the wave bend around blocked regions. A direct Euclidean estimate can remain admissible, yet collision constraints mean the real route must be longer. The heuristic whispers straight ahead while the successor function politely points out the wall. Color or distance marks in the visualization are encodings of search quantities, not decorative fireworks. Explain which quantity changes before interpreting the animation's shape. If an obstacle moves after planning begins, the deterministic offline graph has changed. A deployed robot needs sensing, collision checking, replanning, and possibly uncertainty-aware control around the A-star component. The search algorithm is one instrument, not the entire orchestra. After replay, name the boundary between planner and controller: A-star proposes a discrete route, while feedback control executes and corrects motion under real sensor noise.",
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
    note: "The rail example searches from Washington, D.C. to Los Angeles. States are rail-network locations, edges are available rail connections, and g is rail distance already traveled. Great-circle distance to Los Angeles supplies a geographic lower bound for remaining route distance. The heuristic need not predict the exact rail path. Its job is to underestimate the remaining optimal distance while distinguishing cities that are plausibly closer. Enlarge the map and notice that the search does not expand every city uniformly. The heuristic focuses the frontier westward while g prevents a wildly expensive westward detour from winning merely because it looks closer to California. A node far west can still lose when its accumulated rail distance is already large. That is the balancing role of g in the f score. Replay the route and inspect the frontier growth. Great-circle distance is admissible only when the objective is compatible distance and no rail segment has a cost smaller than the physical separation it covers. Units and cost semantics are part of the proof. During replay, separate expansion order from the final path. Many expanded cities provide evidence and alternatives but do not appear in the parent. If the objective becomes ticket price, schedule reliability, or travel time, geography alone may no longer be a safe lower bound. A real travel planner might use several costs or constraints, turning the tidy classroom graph into a considerably grumpier optimization problem. After replay, propose a time lower bound using great-circle distance divided by a maximum possible train speed. State why the maximum, rather than.",
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
    note: "Setting h of n to zero simplifies f equals g plus zero, so A-star orders the frontier entirely by accumulated path cost. On nonnegative weighted graphs, this is uniform-cost or Dijkstra-style search: settle the least-cost reachable frontier record next. The zero heuristic is admissible and consistent, but it provides no directional information. It is the safe baseline against which stronger heuristics should demonstrate search savings. Enlarge the animation and watch the cost wave spread. It does not necessarily move by geometric radius or by edge count. A longer-looking edge with low weight can be settled before a short-looking edge with high weight because the labels, not the artwork, define cost. The frontier priority is current best distance from the start. Relaxing an edge means checking whether the selected path offers. Replay and identify the moment a node's cheapest path becomes settled under the algorithm's assumptions. Nonnegative edge costs matter because a later negative edge could retroactively make a previously expensive route cheaper, breaking the ordinary argument. During replay, distinguish a discovered node from a settled one. Discovery gives a candidate cost; selection at minimum g establishes the relevant guarantee under the nonnegative-cost conditions. Breadth-first is equivalent only when every action has the same positive cost. With unequal weights, shallowest depth and smallest g diverge. Saying Dijkstra is just breadth-first with numbers is charming, compact, and dangerously incomplete. After replay, compare two paths with depths two and four but costs twenty and six. Uniform-cost chooses by six; breadth-first chooses by two edges. The example exposes the missing equal-cost assumption.",
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
    note: "Consistency, also called monotonicity, is a local edge condition: h of n must be no greater than the step cost from n to successor n-prime plus h of n-prime. It says the estimate cannot drop by more than the cost paid to cross one edge. Check consistency edge by edge. For h of B equals three, edge B to A cost one, and h of. Enlarge the definition and picture a triangle. Going directly from the estimate at n cannot claim more remaining distance than taking one real step and then using the successor's estimate. A violation is a heuristic price tag that falls suspiciously faster than the journey pays for. Manhattan distance is consistent for standard unit-cost puzzle moves because one legal tile move changes the total Manhattan estimate. Consistency makes f values nondecreasing along a path. Substitute g of n-prime equals g of n plus the edge cost, add terms, and the edge inequality yields f of n-prime greater than or equal to f of n. Consistency is stronger than admissibility in the usual setting. An admissible heuristic may still have local drops that force graph-search A-star to reconsider CLOSED states. Under standard graph-search conditions, consistency implies admissibility and allows A-star to close a state at its best g without later reopening it. If one edge violates the inequality, a cheaper route may reach an already expanded state. Close the figure and perform the diagnostic in a fixed order: write h at the source, edge cost, h at the successor, compute the right side, then compare.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Graph-search A* · Duplicate handling",
    title: "An inconsistent heuristic can force a CLOSED node to reopen",
    content: <AStarReopenDemo />,
    note: "This graph uses an admissible but inconsistent heuristic. Start at S with g zero and f three. Expanding S generates A with g three, f three, and B with g one, f four, so A is selected first and placed in CLOSED. Read OPEN and CLOSED after every click. The dramatic moment is not discovering G at cost five; it is discovering that a CLOSED. Expanding A creates goal G with cost five. B is then selected, and edge B to A discovers a cheaper g for A: two instead of three. Consistency fails on that edge because h of B is three while one plus h of A is only one. All heuristic values remain at or below true remaining optimal cost, so admissibility is not the failed property.. The improved A must leave CLOSED and reopen with g two, f two. Re-expanding it updates the goal from cost five to cost four. Without reopening, the algorithm can preserve the early expensive parent and return the wrong cost. Reopening is not duplicate chaos. It is a disciplined response to a strictly improved path record: update g, update the parent, restore frontier eligibility, and propagate. Finally G with g four is selected, returning path S to B to A to G. The lesson is implementation-specific: admissibility protects the lower bound, but graph search needs consistency or correct reopen logic to propagate improved paths. Use the final state to compare two hypothetical implementations. Permanent CLOSED returns five; reopen-aware graph search returns four. That one policy decision changes correctness. Expand S. A enters OPEN with g three and f three; B enters with g one and f four. Minimum f selects A first even though B begins. Expand A too early. It reaches G with total cost five and moves into CLOSED. That goal record is only a candidate because another frontier route may still. Select B and discover B-to-A with new g two. This beats A's stored g three, so update A's parent, remove it from CLOSED, and restore frontier eligibility. Re-expand improved A. Its edge to G now produces goal cost four rather than five. The reopened record propagates the cheaper prefix into the descendant path. Select G at g four and finish with S-to-B-to-A-to-G. Compare this result with permanent CLOSED, which would have preserved the inferior cost-five route.",
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
    note: "For two admissible heuristics, h-two dominates h-one when h-one of n is less than or equal to h-two of n for every state. The larger values remain below h-star, so h-two supplies tighter lower bounds without sacrificing admissibility. Dominance is a for-every-state comparison, not a claim that one heuristic has a better average on a sample. One violating state defeats the pointwise relation. Enlarge the definition and compare misplaced tiles with Manhattan distance in the standard eight-puzzle. Every misplaced tile contributes at least one unit of Manhattan distance, while some tiles are several squares away. Manhattan therefore dominates the simpler count pointwise. The zero heuristic is dominated by every nonnegative admissible heuristic. It provides the baseline lower bound and turns A-star into uniform-cost search. With comparable tie-breaking, A-star using the dominating heuristic typically expands no more nodes than A-star using the weaker one. Tighter lower bounds eliminate more frontier candidates whose estimated totals cannot beat the best solution cost. Tie-breaking can affect exactly which equal-f nodes expand, so empirical counts need controlled comparisons. The theoretical intuition remains that tighter safe bounds focus the frontier. More informed does not mean free. Manhattan distance costs slightly more arithmetic than counting misplaced tiles, and sophisticated pattern databases require memory and preprocessing. Judge total problem-solving effort, not just the elegance of the estimate. Close the figure and evaluate a stronger proposed h. Prove it stays below h-star, then price its computation. A heuristic that saves ten expansions but costs a million operations per.",
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
    note: "The cost graph separates search effort from heuristic or control effort. As a heuristic becomes more informed, node expansion and rule application may fall, while preprocessing, memory, sensing, or per-node calculation rises. Their sum can form a U-shaped total-cost curve. The descending curve represents search or rule-application cost; the ascending curve represents acquiring and using control knowledge. The total is their vertical sum. Enlarge the curves and locate the interior minimum. The left side spends little on guidance and pays for a huge search. The right side owns a magnificent heuristic department whose meetings cost more than the problem it was hired to solve. A pattern database may be expensive once but reused across thousands of puzzles, changing the amortized optimum. Workload frequency belongs in the analysis. Node count is therefore an incomplete metric. Record wall-clock time, memory, heuristic calls, preprocessing, and solution quality. A stronger heuristic can dominate mathematically yet lose end-to-end when its computation overwhelms saved expansions. A learned heuristic adds training data, inference latency, and possible guarantee violations. If optimality matters, the system may need calibration, bounding, or a safe fallback. The engineering objective is minimum total effort subject to the required guarantee. Choose the heuristic granularity that pays for itself on the expected problem distribution, hardware, and reuse frequency rather than worshiping maximum informedness. Close the graph and propose an experiment: run identical instances with h zero, misplaced tiles, and Manhattan distance; measure both expansions and elapsed time, then explain any disagreement.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Evaluation · First identify the object",
    title: "Use one lens for h and another for the search algorithm",
    content: <PropertyEvaluationFramework />,
    note: "Before evaluating a claim, identify the object. A heuristic function is judged for admissibility, consistency, and informedness. A search algorithm is judged for completeness, optimality, time, and space under explicit conditions. Mixing the two lenses creates questions that sound technical but lack a defined test. Use the visible two-column framework like a diagnostic tool. First point to heuristic or algorithm, then select the corresponding inequality. For h-one admissibility, check zero less than or equal to h-one of n less than or equal to h-star everywhere. For h-two consistency, check the triangle inequality on every edge. These are properties of estimates, not of DFS as a whole procedure. The first two tabs are valid heuristic questions. Each has a concrete mathematical test, so the answer can be proved or refuted with. Asking whether DFS is consistent is a category mismatch under this definition. Evaluate DFS for completeness, optimality, time, and memory instead. Classical algorithm admissibility is an older synonym for guaranteed optimality, which is separate from heuristic admissibility. The DFS tab deliberately exposes the mismatch. Consistency could mean colloquial reliability, but in informed search it names a property of h; precise language prevents accidental theorem swapping. Best-first completeness also needs the variant and assumptions. Greedy, A-star, and other best-first strategies use different priorities. State the space, cycles, branching, costs, and termination policy before placing a checkmark beside the algorithm. The remaining tabs show algorithm questions. Explain why the phrase best-first is too broad and why algorithm admissibility means returning an optimal solution rather than satisfying h less than or equal to. Open the consistency prompt for h-two. Use the heuristic lens and check every edge inequality h of n no greater than cost plus successor h; one violating edge. Open the DFS consistency prompt. This is the deliberate category mismatch: DFS has no heuristic h to test here, so evaluate completeness, optimality, time, and space under its. Open the best-first completeness prompt. Name the exact variant before answering because greedy and A-star have different priorities, guarantees, and dependencies on cycles, branching, costs, and termination. Open algorithm A admissibility. In classical algorithm language, admissible means guaranteed to return an optimal solution; it is not the pointwise lower-bound inequality used to judge a heuristic.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Application practice · Model before choosing",
    title: "Can all intelligent tasks use A*?",
    content: <AStarApplicationPractice />,
    note: "A-star is powerful when a task can be modeled as deterministic path search with states, actions, edge costs, a goal, and a defensible heuristic. The five cases test whether that model captures the central difficulty or merely one bounded component. For every case, use the same checklist before revealing the analysis: state, actions, edge cost, heuristic, observability, dynamics, and other agents. A-star is a conclusion. For autopilot, A-star can plan a route through a known discretized region, but it is not the whole flight controller. Wind, partial observation, moving traffic, safety envelopes, and continuous dynamics require sensing, prediction, feedback, and online replanning around the path search. Autopilot may use graph search for a bounded route subproblem while control laws track the route and replanning reacts to change. Components can be. For an autonomous drone and robot vacuum, A-star fits known-map point-to-point travel. Name configurations or grid cells as states, feasible moves as actions, and energy or distance as cost. Unknown rooms, moving obstacles, people, and pets demand additional online behavior. Drone and vacuum examples show discretization tradeoffs. Fine grids improve geometric fidelity but enlarge the search; coarse grids save computation but may erase safe passages. Chess and financial investment reveal model failure. Chess is adversarial because another agent selects actions against us, so minimax-style reasoning is appropriate. Investment is stochastic, partially observed, dynamic, and risk-sensitive; a deterministic shortest path hides the problem we most need to solve. Chess has alternating agency, while investment has uncertain transitions and rewards. In both cases, the environment actively defeats the fixed deterministic graph assumption. Select the autonomous drone. Model grid cells or configurations as states, feasible motions as actions, and energy or distance as cost; then ask how wind and moving obstacles. Reveal the drone analysis. A-star is defensible for a discretized known planning map, while sensing and online replanning must handle uncertain motion, new obstacles, and changing local conditions. Select the robot vacuum. A floor-plan cell can be a state and travel distance an edge cost, but point-to-point routing is different from complete coverage and safe interaction. Reveal the vacuum analysis. A-star can route across a known map; mapping, coverage strategy, obstacle discovery, and reactive safety require additional algorithms around that route component. Select chess. Board positions and legal moves form a graph, yet an opponent deliberately chooses alternating actions. Ordinary shortest-path search does not represent that strategic control of successor. Reveal the chess analysis. Use adversarial search such as minimax and alpha-beta because the other player optimizes against us; A-star's passive deterministic environment assumption is the wrong model. Select financial investment. States, actions, and objectives can be written down, but returns are uncertain, observations incomplete, conditions dynamic, and risk essential. A single deterministic edge cost erases. Reveal the investment analysis. Decision-theoretic, stochastic, sequential, and risk-aware models are needed; A-star alone may optimize a simplified subproblem but cannot justify the overall investment policy.",
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
    note: "Offline deterministic search assumes a known model, predictable actions, and enough stability to compute a path before execution. Real agents may act physically, observe partially, face stochastic outcomes, operate in changing worlds, or interact with cooperative and competitive agents. Move focus across the four limitation cards as each is named: physical action, uncertainty, change, and other agents. Each card invalidates a different simplifying assumption. Computational backtracking does not imply physical reversal. A planner can return to another frontier record instantly, while a drone cannot teleport back through wind and obstacles. Execution cost and irreversibility must be represented if they matter to the real task. A warehouse robot may use A-star on a local occupancy grid while a scheduler coordinates peers and a controller handles motion. Layered systems are normal. Partial observations and unknown dynamics break the fixed-state graph. Dynamic environments can invalidate edges while the plan is running. These settings motivate sensing, belief states, policies, online search, incremental replanning, and reinforcement or decision-theoretic methods. A learned heuristic can adapt guidance, but learning does not automatically provide admissibility or consistency. If guarantees matter, the learned estimate needs a bound, verification, or safe search wrapper. Use the environment audit aloud: deterministic or stochastic, fully or partially observable, episodic or sequential, static or dynamic, discrete or continuous, known or learned, single-agent, cooperative, or competitive. The answers determine whether A-star belongs and what must surround it. Choose one prior application and classify it with every question in the audit. Any answer you cannot state is a modeling uncertainty, not permission to assume.",
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
    note: "The cumulative task has three parts. First, trace a weighted graph by showing every selected node, OPEN and CLOSED state, parent, g, h, and f update. Include a reopened state so duplicate policy becomes visible rather than hiding behind the word implementation. For the trace card, make one table row per expansion and record goal timing. A state generated early can still wait while a. Second, justify heuristic claims. Use zero less than or equal to h less than or equal to h-star for admissibility, and h of n less than or equal to edge cost plus successor h for consistency. State edge-cost and termination assumptions beside the proof. For the proof card, separate heuristic admissibility from A-star optimality. The former is an inequality about h; the latter also depends. Third, decide whether the model belongs. Choose among greedy best-first, A-star, uniform-cost, breadth-first, or a non-path-search method. Name the required guarantee, resource tradeoff, environment assumptions, and why the rejected alternatives fail the task. For the decision card, test whether the environment is a stable deterministic graph. If uncertainty, opponents, or continuous feedback dominate, say which richer model replaces or surrounds path search. The durable sequence is trace, justify, decide. Arithmetic without a model is bookkeeping; a theorem without assumptions is a motivational poster; an algorithm name without either is horoscope reading for priority queues. Build the representation first, then earn the conclusion. Finish by marking one skill as secure and one as needing practice: exact trace, inequality proof, or environment-model diagnosis. Your next study step should target.",
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
