"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  ReplayableSourceAnimation,
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l03-heuristic-local-search";

function FactorialScaleLab() {
  const cases = [
    {
      label: "Tic-tac-toe",
      objects: "9 cells",
      proxy: "9! = 362,880",
      scale: "A small board already creates hundreds of thousands of orderings.",
    },
    {
      label: "Chess",
      objects: "64 squares",
      proxy: "64! ≈ 1.27 × 10⁸⁹",
      scale: "Far beyond exhaustive enumeration at classroom or practical computing scales.",
    },
    {
      label: "Go",
      objects: "361 intersections",
      proxy: "361! ≈ 1.44 × 10⁷⁶⁸",
      scale: "The exponent alone shows why a strategy must ignore most possibilities.",
    },
  ];
  const [active, setActive] = useState(0);
  const item = cases[active];

  return (
    <div className="heuristic-factorial-lab">
      <nav aria-label="Choose a factorial scale example">
        {cases.map((entry, index) => (
          <button
            aria-pressed={active === index}
            className={active === index ? "heuristic-active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{entry.objects}</span>
            <strong>{entry.label}</strong>
          </button>
        ))}
      </nav>
      <section aria-live="polite">
        <span>Naive permutation proxy</span>
        <strong>{item.proxy}</strong>
        <p>{item.scale}</p>
      </section>
    </div>
  );
}

function TicTacToeOpeningLab() {
  const openings = [
    { name: "Corner", wins: 3, explanation: "Three winning lines pass through a corner." },
    { name: "Center", wins: 4, explanation: "Four winning lines pass through the center—the largest score." },
    { name: "Side", wins: 2, explanation: "Two winning lines pass through a side." },
  ];
  const [choice, setChoice] = useState<number | null>(null);
  const [revealAll, setRevealAll] = useState(false);

  return (
    <div className="heuristic-opening-lab">
      <section>
        <span>Predict first</span>
        <h3>Which symmetry class maximizes the number of possible wins?</h3>
        <p>Choose before revealing all three heuristic values.</p>
      </section>
      <div className="heuristic-opening-options">
        {openings.map((opening, index) => {
          const visible = revealAll || choice === index;
          return (
            <button
              aria-pressed={choice === index}
              className={choice === index ? "heuristic-selected" : ""}
              key={opening.name}
              onClick={() => setChoice(index)}
              type="button"
            >
              <span>{opening.name}</span>
              <strong>{visible ? opening.wins : "?"}</strong>
              <small>{visible ? opening.explanation : "Commit to this opening"}</small>
            </button>
          );
        })}
      </div>
      <button onClick={() => setRevealAll(value => !value)} type="button">
        {revealAll ? "Hide comparison" : "Reveal all scores"}
      </button>
      {choice !== null && (
        <p aria-live="polite" className="heuristic-lab-feedback">
          <strong>{choice === 1 ? "Best score." : "A legal choice, but not the heuristic maximum."}</strong>{" "}
          The “most wins” rule chooses the center: 4 rather than 3 or 2.
        </p>
      )}
    </div>
  );
}

const puzzleHeuristics = [
  {
    id: "h₁",
    label: "Misplaced tiles",
    scores: [5, 3, 5],
    critique: "Fast, but it ignores how far each misplaced tile must travel.",
  },
  {
    id: "h₂",
    label: "Manhattan-distance sum",
    scores: [6, 4, 6],
    critique: "Uses distance, but it does not capture the extra work created by direct tile reversals.",
  },
  {
    id: "h₃",
    label: "2 × direct reversals",
    scores: [0, 0, 0],
    critique: "A reversal penalty alone cannot distinguish these children and is counterintuitive as a complete heuristic.",
  },
];

function PuzzleHeuristicLab() {
  const [active, setActive] = useState(0);
  const item = puzzleHeuristics[active];

  return (
    <div className="heuristic-puzzle-lab">
      <nav aria-label="Choose an eight-puzzle heuristic">
        {puzzleHeuristics.map((heuristic, index) => (
          <button
            aria-pressed={active === index}
            className={active === index ? "heuristic-active" : ""}
            key={heuristic.id}
            onClick={() => setActive(index)}
            type="button"
          >
            <strong>{heuristic.id}</strong>
            <span>{heuristic.label}</span>
          </button>
        ))}
      </nav>
      <section aria-live="polite">
        <div className="heuristic-score-row">
          {item.scores.map((score, index) => (
            <article key={`${item.id}-${index}`}>
              <span>Child {index + 1}</span>
              <strong>{score}</strong>
            </article>
          ))}
        </div>
        <p>{item.critique}</p>
      </section>
    </div>
  );
}

function FScoreTrace() {
  const children = [
    { name: "Child 1", g: 1, h: 5, f: 6 },
    { name: "Child 2", g: 1, h: 3, f: 4 },
    { name: "Child 3", g: 1, h: 5, f: 6 },
  ];
  const [active, setActive] = useState(0);
  const item = children[active];

  return (
    <div className="heuristic-f-trace">
      <nav aria-label="Trace child evaluation scores">
        {children.map((child, index) => (
          <button
            aria-pressed={active === index}
            className={active === index ? "heuristic-active" : ""}
            key={child.name}
            onClick={() => setActive(index)}
            type="button"
          >
            {child.name}
          </button>
        ))}
      </nav>
      <section aria-live="polite">
        <span>{item.name}</span>
        <div className="heuristic-equation">
          <strong>f(n)</strong>
          <i>=</i>
          <b>{item.g}</b>
          <small>g: cost so far</small>
          <i>+</i>
          <b>{item.h}</b>
          <small>h: estimate left</small>
          <i>=</i>
          <strong>{item.f}</strong>
        </div>
        <p>For a cost function, select the smallest evaluation: Child 2 with f = 4.</p>
      </section>
    </div>
  );
}

function HillClimbStepper() {
  const candidates = [
    { label: "A", value: 5 },
    { label: "B", value: 7 },
    { label: "C", value: 6 },
  ];
  const [mode, setMode] = useState<"first" | "steepest">("first");
  const [revealed, setRevealed] = useState(false);
  const selected = mode === "first" ? candidates[0] : candidates[1];

  return (
    <div className="heuristic-hill-stepper">
      <section>
        <span>Current value: 4</span>
        <h3>Inspect successors left to right</h3>
        <p>Predict which state each variation selects.</p>
        <div className="heuristic-step-controls">
          <button
            aria-pressed={mode === "first"}
            className={mode === "first" ? "heuristic-active" : ""}
            onClick={() => {
              setMode("first");
              setRevealed(false);
            }}
            type="button"
          >
            First-choice
          </button>
          <button
            aria-pressed={mode === "steepest"}
            className={mode === "steepest" ? "heuristic-active" : ""}
            onClick={() => {
              setMode("steepest");
              setRevealed(false);
            }}
            type="button"
          >
            Steepest-ascent
          </button>
        </div>
      </section>
      <div className="heuristic-successor-row">
        {candidates.map(candidate => (
          <article
            className={revealed && candidate.label === selected.label ? "heuristic-selected" : ""}
            key={candidate.label}
          >
            <span>{candidate.label}</span>
            <strong>{candidate.value}</strong>
          </article>
        ))}
      </div>
      <button onClick={() => setRevealed(value => !value)} type="button">
        {revealed ? "Hide selection" : "Reveal selection"}
      </button>
      {revealed && (
        <p aria-live="polite" className="heuristic-lab-feedback">
          <strong>{selected.label} is selected.</strong>{" "}
          {mode === "first"
            ? "First-choice stops scanning as soon as it finds value 5 > 4."
            : "Steepest-ascent compares every successor and selects the highest value, 7."}
        </p>
      )}
    </div>
  );
}

function HillClimbRepairLab() {
  const cases = [
    {
      label: "Local maximum",
      prompt: "Every direct neighbor is worse, but a higher peak exists elsewhere.",
      response: "Use a recovery mechanism: random restart, backtracking, or an occasional worse move such as simulated annealing.",
    },
    {
      label: "Plateau",
      prompt: "Many nearby states have the same evaluation.",
      response: "Permit bounded sideways moves, add random exploration, or use multi-step look-ahead to find an informative edge.",
    },
    {
      label: "Shoulder",
      prompt: "A flat region eventually leads upward, but not through one improving successor.",
      response: "A limited sequence of sideways moves or deeper look-ahead can cross the flat shoulder before ascent resumes.",
    },
  ];
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = cases[active];

  return (
    <div className="local-search-repair-lab">
      <nav aria-label="Choose a hill-climbing failure mode">
        {cases.map((entry, index) => (
          <button
            aria-pressed={active === index}
            className={active === index ? "heuristic-active" : ""}
            key={entry.label}
            onClick={() => {
              setActive(index);
              setRevealed(false);
            }}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Diagnose before reveal</span>
        <h3>{item.prompt}</h3>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide repair" : "Reveal one defensible repair"}
        </button>
        {revealed && <p aria-live="polite">{item.response}</p>}
      </section>
    </div>
  );
}

function formatProbability(value: number) {
  if (value > 0 && value < 0.0001) return "< 0.0001";
  return value.toFixed(4);
}

function AnnealingAcceptanceLab() {
  const moves = [-0.1, 0.5, -5];
  const [delta, setDelta] = useState(-5);
  const [temperature, setTemperature] = useState(1);
  const probability = delta > 0 ? 1 : Math.exp(delta / temperature);

  return (
    <div className="local-search-sa-lab">
      <section>
        <span>Maximize-value convention</span>
        <h3>ΔV = V(next) − V(current)</h3>
        <p>Choose a candidate move, then cool or heat the system.</p>
        <nav aria-label="Choose an objective-value change">
          {moves.map(move => (
            <button
              aria-pressed={delta === move}
              className={delta === move ? "heuristic-active" : ""}
              key={move}
              onClick={() => setDelta(move)}
              type="button"
            >
              ΔV = {move > 0 ? `+${move}` : move}
            </button>
          ))}
        </nav>
        <label>
          <span>Temperature T = {temperature.toFixed(2)}</span>
          <input
            aria-label="Simulated annealing temperature"
            max="5"
            min="0.25"
            onChange={event => setTemperature(Number(event.target.value))}
            step="0.25"
            type="range"
            value={temperature}
          />
        </label>
      </section>
      <div className="local-search-probability" aria-live="polite">
        <span>{delta > 0 ? "Better move" : "Worse move"}</span>
        <strong>{formatProbability(probability)}</strong>
        <small>{(probability * 100).toFixed(2)}% acceptance probability</small>
        <div className="local-search-probability-meter">
          <i style={{ width: `${probability * 100}%` }} />
        </div>
        <p>
          {delta > 0
            ? "Accept automatically."
            : "For this fixed negative ΔV, decreasing T makes acceptance less likely."}
        </p>
      </div>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 4 · Lesson 5",
    title: "Heuristic Search and Local Search",
    subtitle: "How can an agent make progress when exhaustive search is impossible?",
    content: (
      <div className="heuristic-hero">
        <section>
          <span>Driving question</span>
          <h3>What information lets us ignore most of a search space without ignoring the solution?</h3>
          <p>We will design evaluation functions, trace hill climbing, and calculate simulated-annealing decisions.</p>
        </section>
        <div className="heuristic-hero-formula">
          <span>Estimate</span>
          <strong>f(n) = g(n) + h(n)</strong>
          <small>then choose, test, and critique</small>
        </div>
      </div>
    ),
    note: "0–2 minutes. Retrieve the state-space-search strategy from Meeting 4. Ask why a general search procedure alone has not produced strong AI: representation and intelligent guidance remain problem dependent.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Meeting map · 75 minutes",
    title: "One question connects heuristics, hill climbing, and annealing",
    content: (
      <div className="heuristic-course-map">
        <section>
          <article><span>01</span><h3>Reduce</h3><p>Use knowledge to shrink a combinatorial search space.</p></article>
          <article><span>02</span><h3>Evaluate</h3><p>Distinguish cost so far, estimated cost remaining, and total score.</p></article>
          <article><span>03</span><h3>Climb</h3><p>Use a local evaluation while diagnosing maxima, plateaus, and shoulders.</p></article>
          <article><span>04</span><h3>Escape</h3><p>Accept some worse moves early, then reduce that probability as temperature falls.</p></article>
        </section>
        <aside>
          <span>Revised course horizon</span>
          <p><strong>Today:</strong> heuristic design, hill climbing, and simulated annealing.</p>
          <p><strong>Core continuation:</strong> best-first search and A*, minimax, advanced game playing, and heuristic evaluation.</p>
          <p><strong>Optional roadmap topics—not scheduled:</strong> constraint satisfaction, performance criteria, complexity and efficiency, AI-complete, and AI-hard problems.</p>
        </aside>
      </div>
    ),
    note: "2–4 minutes. Preview the 75-minute arc: motivation and examples to minute 23; heuristic functions to minute 39; hill climbing to minute 58; simulated annealing to minute 73; assessment and reading to minute 75.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Knowledge point 1 · Combinatorial explosion",
    title: "Factorial growth makes brute force a warning, not a plan",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <FactorialScaleLab />
        <section>
          <h3>Interpret the numbers carefully</h3>
          <p>The familiar 9!, 64!, and 361! counts are naive permutation proxies over board locations. They are not exact counts of legal game states or legal game-tree paths.</p>
          <SearchCallout label="Why keep the proxy?" tone="amber">
            Even this crude upper-bound framing exposes combinatorial explosion. BFS and DFS do not use domain information to decide which possibilities matter.
          </SearchCallout>
          <p className="heuristic-footnote">Scale anchor: 10¹⁰ milliseconds is about 115.7 days.</p>
          <p><strong>Heuristics</strong> are methods or rules for discovery and invention—the human “I found it” idea—that use available information or knowledge when a perfect procedure is unavailable.</p>
        </section>
      </div>
    ),
    note: "4–8 minutes. Frame state-space search as a general problem-solving strategy, then correct the factorial interpretation explicitly: these figures illustrate scale but are not exact legal game-tree sizes. Connect the need for heuristics to chess, Go, optimization, and most AI problems.",
    sourceSlides: [3, 4],
  },
  {
    eyebrow: "Prediction · Symmetry as knowledge",
    title: "Nine legal squares collapse to three distinct first-move classes",
    content: (
      <div className="heuristic-layout heuristic-layout-split heuristic-symmetry-slide">
        <SearchSourceImage
          alt="First three levels of a tic-tac-toe state space reduced by symmetry"
          caption="Corner, center, and side represent the three distinct first moves."
          file="tic-tac-toe-symmetry-state-space.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section className="heuristic-symmetry-assessment">
          <SearchQuickCheck
            correct={1}
            explanation="Rotations and reflections make all corners equivalent and all sides equivalent, leaving corner, center, and side."
            options={["9", "3", "2"]}
            question="After using board symmetry, how many genuinely different first moves remain?"
          />
          <SearchCallout label="Additional reduction" tone="cyan">
            Applying symmetry again at the next level reduces the path count to 12 × 7! in this analysis.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "8–11 minutes. Students predict before selecting. Distinguish knowledge-based equivalence from merely searching faster. Preserve the second-level result: symmetry reduces the remaining paths to 12 × 7!.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Worked example · A quantitative heuristic",
    title: "“Most winning opportunities” makes the center look best",
    content: (
      <div className="heuristic-layout heuristic-layout-image-lab">
        <SearchSourceImage
          alt="Tic-tac-toe openings scored by the number of possible wins"
          caption="The heuristic counts winning lines available after each opening."
          file="tic-tac-toe-most-wins-openings.png"
          sourceRoot={SOURCE_ROOT}
        />
        <TicTacToeOpeningLab />
      </div>
    ),
    note: "11–14 minutes. Require a prediction, then reveal corner = 3, center = 4, side = 2. After the first move, the opponent has two symmetry-distinct alternatives; the same heuristic can be applied again.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Worked example · Heuristic pruning",
    title: "One informed choice removes two-thirds of the first-move tree",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <SearchSourceImage
          alt="Tic-tac-toe state-space tree pruned using the most-wins heuristic"
          caption="Only the center-opening branch remains after the first heuristic decision."
          file="tic-tac-toe-heuristically-pruned-tree.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <div className="heuristic-big-number"><strong>2/3</strong><span>of the first-move search space is pruned</span></div>
          <ol>
            <li>Group symmetric states.</li>
            <li>Score each distinct opening by possible wins.</li>
            <li>Keep the center branch.</li>
            <li>After the opponent moves, score the resulting alternatives again.</li>
          </ol>
          <SearchCallout label="The tradeoff" tone="amber">
            Exhaustive search is unnecessary, but correctness now depends on whether the heuristic preserves the strategically important branch.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "14–17 minutes. Explain that the heuristic is reapplied after the opponent’s move. Ask what could go wrong if “number of immediate winning lines” fails to anticipate a later threat.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Knowledge point 2 · Travelling salesperson",
    title: "A tour tree grows as (N − 1)! before pruning",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <SearchSourceImage
          alt="Search tree for a travelling salesperson problem with cumulative path weights"
          caption="Each arc is marked with the accumulated weight from start city A."
          file="travelling-salesperson-search-tree.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <div className="heuristic-equation heuristic-equation-compact">
            <strong>(N − 1)!</strong>
            <small>candidate visit orders when the start city is fixed</small>
          </div>
          <article>
            <h3>Branch and bound</h3>
            <p>Keep the best complete path found so far and prune a partial path when its lower bound cannot beat that incumbent.</p>
          </article>
          <article>
            <h3>Nearest neighbor</h3>
            <p>Choose the closest unvisited city. It reduces work dramatically, but it need not return the shortest tour.</p>
          </article>
        </section>
      </div>
    ),
    note: "17–20 minutes. Read the cumulative arc weights before proposing a rule. Preserve the (N − 1)! complexity and best-path-so-far idea. Do not repeat the unclear numeric shorthand in the archive note; teach the defensible branch-and-bound principle.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Counterexample · Greedy is not optimal",
    title: "A cheap next edge can force an expensive final return",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <SearchSourceImage
          alt="Nearest-neighbor travelling-salesperson tour showing a costly return edge"
          caption="The bold nearest-neighbor tour is A–E–D–B–C–A."
          file="nearest-neighbor-tour-counterexample.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <div className="heuristic-scenario-pair">
            <article><span>If A–C = 125</span><strong>375</strong><p>The tour A–E–D–B–C–A is shortest.</p></article>
            <article><span>If A–C = 300</span><strong>550</strong><p>The same greedy tour is not shortest.</p></article>
          </div>
          <SearchQuickCheck
            correct={2}
            explanation="Nearest neighbor evaluates the next step, but it does not reserve a cheap way to return to A. The large final C–A edge defeats the heuristic."
            options={["The first edge A–E", "The middle edge D–B", "The final edge C–A"]}
            question="Which edge reveals the heuristic’s blind spot?"
          />
        </section>
      </div>
    ),
    note: "20–23 minutes. Have students total the bold route in both cases. Name the strategy nearest-neighbor or greedy search. Ask what additional information a stronger heuristic would need.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Knowledge point 3 · Heuristic design",
    title: "A useful heuristic begins with information, not a formula",
    content: (
      <div className="heuristic-design-flow">
        <article><span>1</span><h3>Identify the goal</h3><p>State what a good solution must achieve.</p></article>
        <i>→</i>
        <article><span>2</span><h3>Collect information</h3><p>Analyze available data and background or domain knowledge.</p></article>
        <i>→</i>
        <article><span>3</span><h3>Reduce states</h3><p>Identify possible states and eliminate unnecessary ones when justified.</p></article>
        <i>→</i>
        <article><span>4</span><h3>Quantify</h3><p>Define one or more measures that evaluate each state.</p></article>
        <i>→</i>
        <article><span>5</span><h3>Test</h3><p>Formulate the heuristic function and try representative examples.</p></article>
        <aside>
          <strong>Test across problem types</strong>
          <p>Tic-tac-toe, 8-puzzle, chess, Go, an autonomous car, a Mars rover, or a robot vacuum.</p>
        </aside>
      </div>
    ),
    note: "23–26 minutes. Teams choose one example and identify the goal, available information, removable states, and a measurable score. Stress that devising good heuristics from limited information is difficult and critical.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Knowledge point 4 · Evaluation functions",
    title: "g, h, and f answer three different questions",
    content: (
      <div className="heuristic-function-model">
        <section className="heuristic-equation">
          <strong>f(n)</strong><i>=</i><b>g(n)</b><i>+</i><b>h(n)</b>
        </section>
        <div>
          <article><strong>g(n)</strong><span>What has it cost to reach n?</span><p>An accumulated, known path cost from the start state.</p></article>
          <article><strong>h(n)</strong><span>What might remain?</span><p>A heuristic estimate from n to a goal; h alone is the heuristic function.</p></article>
          <article><strong>f(n)</strong><span>What is the estimated total?</span><p>An evaluation function combining known and estimated cost.</p></article>
        </div>
        <SearchCallout label="Direction matters" tone="cyan">
          For cost, smaller is better. For reward or value, larger is better. Never compare scores before stating which convention the function uses.
        </SearchCallout>
        <p className="heuristic-footnote">If two states have the same or nearly the same h value, lower g prefers the state nearer the root and therefore the shorter known path.</p>
      </div>
    ),
    note: "26–29 minutes. Correct a common conflation: h is the heuristic estimate; f is the combined evaluation. In an unweighted tree, g may be depth. Explain how g discourages indefinitely following a fruitless path while h points toward a goal.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Worked example · Three 8-puzzle heuristics",
    title: "Different information produces different estimates",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <SearchSourceImage
          alt="Eight-puzzle start state and three successor states"
          caption="Move the blank once to generate three candidate children."
          file="eight-puzzle-start-and-successors.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section className="heuristic-definition-list">
          <article><strong>h₁</strong><p>Count tiles out of place relative to the goal.</p></article>
          <article><strong>h₂</strong><p>Sum each tile’s Manhattan distance from its goal location.</p></article>
          <article><strong>h₃</strong><p>Add 2 for each direct tile reversal.</p></article>
          <SearchCallout label="Predict before scoring" tone="amber">
            Which measure will distinguish the three children most clearly—and what relevant information does each measure ignore?
          </SearchCallout>
        </section>
      </div>
    ),
    note: "29–32 minutes. Students calculate before the next page. The archive note names Euclidean distance, while the visible definition and worked values use Manhattan distance; use Manhattan distance here and make the terminology distinction explicit.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Worked calculation · Score and critique",
    title: "A score can be computable and still be unhelpful",
    content: (
      <div className="heuristic-layout heuristic-layout-image-lab heuristic-score-critique-slide">
        <SearchSourceImage
          alt="Three eight-puzzle children with h1 h2 and h3 scores"
          caption="Worked source values: h₁ = 5,3,5; h₂ = 6,4,6; h₃ = 0,0,0."
          file="eight-puzzle-heuristic-comparison.png"
          sourceRoot={SOURCE_ROOT}
        />
        <div className="heuristic-score-critique-panel">
          <PuzzleHeuristicLab />
          <SearchCallout label="A stronger composite" tone="green">
            One proposed improvement is the distance sum plus 2 × the number of direct reversals. It combines signals; it still must be tested rather than assumed superior.
          </SearchCallout>
          <p className="heuristic-footnote"><strong>Critique question:</strong> If heuristics return tied or conflicting scores, what additional rule should decide which state is examined first?</p>
          <p className="heuristic-footnote">The complete 8-puzzle and 15-puzzle state spaces each split into two equal disconnected reachability components; from one start, half the permutations are unreachable.</p>
        </div>
      </div>
    ),
    note: "32–36 minutes. Reveal h1 = 5,3,5; h2 = 6,4,6; h3 = 0,0,0. Critique h1 for ignoring distance, h2 for ignoring reversal difficulty, and h3 for being inadequate alone. Discuss non-unique or conflicting scores and the two reachability components.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Coding trace · Combine path cost and estimate",
    title: "At depth one, f = g + h selects the middle child",
    content: (
      <div className="heuristic-layout heuristic-layout-image-lab">
        <SearchSourceImage
          alt="Eight-puzzle successors annotated with f scores"
          caption="With g = 1 for each child and h = 5,3,5, the f scores are 6,4,6."
          file="eight-puzzle-f-score-successors.png"
          sourceRoot={SOURCE_ROOT}
        />
        <div>
          <FScoreTrace />
          <pre className="heuristic-code"><code>{`function evaluate(g: number, h: number) {
  return g + h;
}

const next = children.reduce((best, child) =>
  evaluate(child.g, child.h) < evaluate(best.g, best.h)
    ? child
    : best
);`}</code></pre>
        </div>
      </div>
    ),
    note: "36–39 minutes. Students narrate the three calculations: 1+5=6, 1+3=4, 1+5=6. Ask what changes if the function represents reward rather than cost. Connect a DFS-like local choice guided by an evaluation to simple hill climbing.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Knowledge point 5 · Hill climbing",
    title: "Hill climbing keeps moving only while a neighbor looks better",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <SearchSourceImage
          alt="Search landscape with local maxima plateau shoulder and a global maximum"
          caption="A value landscape for maximization; ascent means larger evaluation values."
          file="hill-climbing-search-landscape.jpeg"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <div className="heuristic-big-number"><strong>next &gt; current</strong><span>the basic acceptance rule for ascent</span></div>
          <p>The next state must have a higher value—or be judged closer to the goal—than the current state.</p>
          <SearchCallout label="Local information" tone="amber">
            The algorithm sees neighboring states, not the entire landscape. A better neighbor need not lead to the global best solution.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "39–42 minutes. Ask students to trace a path from the left side of the landscape without pointing out the global maximum first. Clarify ascent for reward and descent for cost.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Algorithm · First-choice hill climbing",
    title: "Simple hill climbing commits to the first better successor",
    content: (
      <div className="heuristic-algorithm">
        <ol>
          <li><span>1</span><div><strong>Goal test</strong><p>If the current state is a solution, return it.</p></div></li>
          <li><span>2</span><div><strong>Expand</strong><p>Generate the current state’s children.</p></div></li>
          <li><span>3</span><div><strong>Evaluate in order</strong><p>Use the heuristic function on each child.</p></div></li>
          <li><span>4</span><div><strong>Select the FIRST better state</strong><p>Commit without comparing all successors.</p></div></li>
          <li><span>5</span><div><strong>Repeat</strong><p>Continue until a solution or a state with no better successor.</p></div></li>
        </ol>
        <SearchCallout label="Possible recovery mechanisms" tone="cyan">
          Make a large jump, allow a temporary worse move, restart, or backtrack when the local rule becomes trapped.
        </SearchCallout>
      </div>
    ),
    note: "42–45 minutes. Preserve the FIRST-better distinction. Have students identify the exact line that creates order dependence. Preview repairs: a big jump, allowing descent through simulated annealing, or backtracking.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Interactive demonstration · One current state",
    title: "First-choice and steepest-ascent can move differently",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <HillClimbStepper />
        <section className="local-search-properties">
          <h3>Why this is local search</h3>
          <ul>
            <li>Keep one current state.</li>
            <li>Move only to neighboring states.</li>
            <li>Ignore the path used to arrive.</li>
            <li>Use very little memory.</li>
            <li>Often find reasonable solutions in large, infinite, or continuous spaces.</li>
          </ul>
          <p>It resembles depth-first movement guided by a heuristic, but it does not preserve a DFS frontier or recovery path.</p>
        </section>
      </div>
    ),
    note: "45–48 minutes. Run both modes. Stress that local search normally cares about the final state rather than its path and uses very little memory. Ask when returning only a reasonable state is acceptable.",
    sourceSlides: [17],
  },
  {
    eyebrow: "Diagnosis · Failure modes",
    title: "A local maximum, plateau, or shoulder can hide better states",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <SearchSourceImage
          alt="Hill-climbing landscape labeled with local maxima plateau shoulder and global maximum"
          caption="The same landscape now serves as a diagnostic map."
          file="hill-climbing-search-landscape.jpeg"
          sourceRoot={SOURCE_ROOT}
        />
        <section className="local-search-failure-list">
          <article><strong>Local maximum</strong><p>No neighbor is better, although a better state exists elsewhere.</p></article>
          <article><strong>Plateau</strong><p>Nearby evaluations are equal, so direction is unclear.</p></article>
          <article><strong>Shoulder</strong><p>A flat region eventually rises, but not through an immediately better successor.</p></article>
          <SearchCallout label="Core limitation" tone="amber">
            Without backtracking or another recovery mechanism, the algorithm cannot tell a local optimum from the global optimum.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "48–51 minutes. Students label each failure on the figure and explain the missing information. Mention that multiple heuristic measures, learned evaluation, or random evaluation can improve decisions, but none automatically certifies global optimality.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Variation · Compare every successor",
    title: "Steepest ascent improves the choice, not the guarantee",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <div className="local-search-comparison">
          <article><span>First-choice</span><strong>Stop at the first better successor</strong><p>Fast evaluation; sensitive to successor order.</p></article>
          <article><span>Steepest ascent / gradient search</span><strong>Compare all successors and select the best</strong><p>More work per move; still local.</p></article>
          <SearchCallout label="Ascent or descent?" tone="cyan">
            The direction depends on the heuristic: maximize reward or value; minimize cost or energy.
          </SearchCallout>
        </div>
        <pre className="heuristic-code"><code>{`current ← MAKE-NODE(INITIAL-STATE[problem])
loop do
  neighbor ← highest-valued successor of current
  if VALUE[neighbor] ≤ VALUE[current]
    return STATE[current]
  current ← neighbor`}</code></pre>
      </div>
    ),
    note: "51–54 minutes. Compare first-choice with steepest ascent or descent. Trace the AIMA-style pseudocode: it returns the current state as soon as no highest-valued successor improves it. Better need not mean globally best.",
    sourceSlides: [19, 20],
  },
  {
    eyebrow: "Participation · Look farther or recover",
    title: "Three-step look-ahead can cross a plateau—but not every trap",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <SearchSourceImage
          alt="Three-level look-ahead across a hill-climbing plateau"
          caption="Look-ahead can reveal a direction that a one-step evaluation misses."
          file="hill-climbing-plateau-lookahead.png"
          sourceRoot={SOURCE_ROOT}
        />
        <HillClimbRepairLab />
      </div>
    ),
    note: "54–58 minutes. Use the three-level plateau figure for participation: can each variation solve local maxima, shoulder, and plateau problems? Require conditional answers, not yes/no claims. Discuss big jumps, random evaluation, learning with multiple heuristic measures, allowing worse moves, and backtracking.",
    sourceSlides: [21, 22],
  },
  {
    eyebrow: "Knowledge point 6 · Simulated annealing",
    title: "Controlled cooling turns random motion into increasingly selective motion",
    content: (
      <div className="local-search-annealing-analogy">
        <SearchSourceImage
          alt="Photograph illustrating annealing in metallurgy"
          caption="Heating permits rearrangement; controlled cooling reduces defects."
          file="metallurgy-annealing-photo.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <h3>Physical interpretation</h3>
          <p>Free variables act like particles seeking a low-energy, high-quality configuration.</p>
          <p>At high temperature, random motion can break existing structure and release constraints. Slow cooling reduces that motion until the configuration stabilizes.</p>
          <SearchCallout label="Optimization interpretation" tone="cyan">
            Simulated annealing is a probabilistic metaheuristic for global optimization: explore broadly early, then become conservative.
          </SearchCallout>
        </section>
        <SearchSourceImage
          alt="Temperature schedule for simulated annealing"
          caption="The schedule maps iteration or time to a gradually decreasing temperature."
          file="annealing-temperature-schedule.png"
          sourceRoot={SOURCE_ROOT}
        />
      </div>
    ),
    note: "58–62 minutes. Connect the physical random walk and breaking of chemical bonds to search. In energy minimization, lower energy is better; in value maximization, higher value is better. State the convention before using “uphill” or “downhill.”",
    sourceSlides: [23, 24],
  },
  {
    eyebrow: "Replayable demonstration · Escaping a local maximum",
    title: "An occasional worse move can reach the global maximum",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <ReplayableSourceAnimation
          alt="Animated simulated-annealing search escaping local maxima and reaching a global maximum"
          attribution="Kingpin13, own work, CC0 · https://commons.wikimedia.org/w/index.php?curid=25010763"
          caption="Replay the path and identify every accepted move that a strictly greedy climber would reject."
          file="simulated-annealing-local-maxima.gif"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <h3>Watch for three events</h3>
          <ol>
            <li>The search reaches a locally attractive region.</li>
            <li>A non-improving move escapes that region.</li>
            <li>Later moves reach the global maximum.</li>
          </ol>
          <SearchQuickCheck
            correct={1}
            explanation="Strict hill climbing rejects every worse neighbor. Simulated annealing can accept one with a temperature-dependent probability."
            options={["It compares every path", "It sometimes accepts a worse neighbor", "It remembers the full frontier"]}
            question="What capability changes the reachable outcome?"
          />
        </section>
      </div>
    ),
    note: "62–65 minutes. Replay once without commentary, then again with students calling out improving and non-improving transitions. A successful animation illustrates possibility, not a guarantee for every run.",
    sourceSlides: [25],
  },
  {
    eyebrow: "Knowledge point 7 · Annealing policy",
    title: "Choose a random neighbor, always take improvement, sometimes take loss",
    content: (
      <div className="local-search-policy">
        <article><span>1</span><h3>Sample</h3><p>Select a random nearby state rather than the best successor.</p></article>
        <article><span>2</span><h3>Measure</h3><p>Compute the change in objective value, ΔV.</p></article>
        <article><span>3</span><h3>Accept improvement</h3><p>If ΔV is positive in a maximization problem, move.</p></article>
        <article><span>4</span><h3>Possibly accept loss</h3><p>If ΔV is negative, accept with a probability that is smaller for worse moves.</p></article>
        <article><span>5</span><h3>Cool</h3><p>Decrease temperature so locally bad moves become less likely over time.</p></article>
        <aside>
          <strong>Optional exploration</strong>
          <p>The move size itself can also be randomized, permitting occasional large steps through the state space.</p>
        </aside>
      </div>
    ),
    note: "65–68 minutes. Contrast the policy with steepest ascent: it samples one random neighbor rather than selecting the best. Large negative changes are accepted less often, but early randomness creates a chance to escape local maxima.",
    sourceSlides: [26],
  },
  {
    eyebrow: "Algorithm · Keep the sign convention consistent",
    title: "The same acceptance idea has two correct formulas",
    content: (
      <div className="local-search-sign-model">
        <pre className="heuristic-code"><code>{`current ← MAKE-NODE(INITIAL-STATE[problem])
for t ← 1 to ∞ do
  T ← schedule[t]
  if T = 0 return current
  next ← a random successor of current
  ΔV ← VALUE[next] − VALUE[current]
  if ΔV > 0
    current ← next
  else
    accept next with probability exp(ΔV / T)`}</code></pre>
        <section>
          <article>
            <span>Maximize value</span>
            <strong>ΔV = V(next) − V(current)</strong>
            <p>Positive is better; accept a worse move with P = exp(ΔV/T).</p>
          </article>
          <article>
            <span>Minimize energy or cost</span>
            <strong>ΔE = E(next) − E(current)</strong>
            <p>Negative is better; accept a worse move with P = exp(−ΔE/T).</p>
          </article>
          <SearchCallout label="Do not mix conventions" tone="amber">
            Both formulas give probabilities between 0 and 1 for worse moves. For a fixed loss, lowering T lowers the acceptance probability.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "68–71 minutes. Walk line by line through the maximization form. Correct the archived presenter-note reversal: when T decreases, acceptance of the same worse move decreases. Reconcile the metallurgy energy form with the AIMA value form before calculating.",
    sourceSlides: [27],
  },
  {
    eyebrow: "Interactive calculation · Temperature controls risk",
    title: "At T = 1, exp(−5) is 0.0067—not 0.05",
    content: (
      <div className="heuristic-layout heuristic-layout-practice">
        <AnnealingAcceptanceLab />
        <section className="local-search-worked-values">
          <article><span>ΔV = −0.1</span><strong>exp(−0.1) = 0.9048</strong><p>About 90% acceptance.</p></article>
          <article><span>ΔV = +0.5</span><strong>accept = 1</strong><p>An improving move is accepted.</p></article>
          <article><span>ΔV = −5</span><strong>exp(−5) = 0.0067</strong><p>About 0.67% acceptance.</p></article>
          <SearchCallout label="Cooling effect" tone="green">
            High T makes locally bad moves more likely; low T makes the same moves less likely. The schedule determines how quickly exploration becomes exploitation.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "71–73 minutes. Calculate all three moves at T = 1. Explicitly correct the decimal and percentage: exp(−5) ≈ 0.0067 = 0.67%, not 0.05 or 5%. Move the slider down once to show decreasing acceptance.",
    sourceSlides: [28],
  },
  {
    eyebrow: "Synthesis · Guarantee, limits, assessment, reading",
    title: "Annealing trades a deterministic path for a conditional global guarantee",
    content: (
      <div className="local-search-closing">
        <section className="local-search-history">
          <article>
            <span>1983 · Practice</span>
            <p>Kirkpatrick, Gelatt, and Vecchi proposed simulated annealing for optimization, including VLSI layout, in <em>Science</em> 220:671–680.</p>
          </article>
          <article>
            <span>Theoretical result</span>
            <p>Convergence to a global optimum requires restrictive, asymptotically slow cooling and effectively unbounded time. A finite practical run has no such guarantee.</p>
          </article>
          <article>
            <span>Practical limits</span>
            <p>Gradual cooling can be slow; schedule choice is difficult; performance is problem-specific and may depend on fortunate jumps.</p>
          </article>
        </section>
        <SearchQuickCheck
          correct={2}
          explanation="The probability of accepting a fixed worse move decreases as temperature decreases. A practical finite run remains stochastic and is not guaranteed to find the global optimum."
          options={[
            "Every run finds the global optimum",
            "Cooling makes worse moves increasingly likely",
            "A finite run may stop without the global optimum",
          ]}
          question="Which statement is defensible for a practical simulated-annealing run?"
        />
        <section className="local-search-exit">
          <div>
            <strong>Exit ticket</strong>
            <ol>
              <li>Define g(n), h(n), and f(n) without conflating them.</li>
              <li>Give one hill-climbing failure mode and one conditional repair.</li>
              <li>Compute the worse-move acceptance probability for ΔV = −2 and T = 1.</li>
            </ol>
          </div>
          <aside>
            <strong>Readings</strong>
            <p>George F. Luger, <em>Artificial Intelligence: Structures and Strategies for Complex Problem Solving</em>, 6th ed., Chapter 4, Addison-Wesley, 2009.</p>
            <p>Stuart Russell and Peter Norvig, <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed., Prentice Hall, 2010.</p>
          </aside>
        </section>
      </div>
    ),
    note: "73–75 minutes. Use the quick check as the exit ticket and assign the three written prompts for submission. Correct the unconditional claim: theoretical convergence needs an extraordinarily slow schedule and asymptotic time. Preserve the practical problems—speed, schedule choice, problem specificity, and reliance on lucky jumps—and preview best-first search and A*.",
    sourceSlides: [29, 30, 31],
  },
];

export function HeuristicLocalSearchDeck() {
  return (
    <SourceDeckShell
      hoverEffects
      meetingLabel="Module 4 · Lesson 5"
      meetingTitle="Heuristic Search and Local Search"
      slides={slides}
      sourceCollectionLabel="L03_Heuristic, HillClimbing&SA.pptx"
      sourceCollectionPath="l03-heuristic-local-search"
    />
  );
}

export {
  HeuristicLocalSearchDeck as HeuristicSearchDeck,
  HeuristicLocalSearchDeck as Meeting05Deck,
};
