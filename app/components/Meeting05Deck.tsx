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
    note: "State-space search tells an agent how to represent possibilities and generate legal successors, but it does not tell the agent which possibility deserves attention first. Lesson 5 adds guidance. A heuristic is useful information that estimates promise, while local search keeps only a small neighborhood and tries to improve the current state. Simulated annealing then adds controlled risk: sometimes a worse move is the price of escaping a bad neighborhood. Imagine driving through a city with no map application. The road network is the state space, legal turns are operators, and exhaustive search means trying streets systematically. A heuristic is the estimate saying downtown is probably east. It can save enormous time, but it can also be wrong. Local search is even more committed: it looks around the current intersection and chooses a better-looking street without preserving every abandoned route. We will distinguish g of n, h of n, and f of n; calculate scores rather than admire formulas from a safe distance; compare first-choice with steepest-ascent hill climbing; diagnose local maxima, plateaus, and shoulders; and compute simulated-annealing acceptance probabilities. The recurring question is not whether a method is intelligent in the abstract. It is what information it uses, what work it avoids, and what guarantee it gives up. Apply the lesson map to a campus delivery robot. Exhaustive search could enumerate countless routes, battery states, delays, and pedestrian encounters. A heuristic might estimate remaining travel time plus charging risk. Hill climbing could modify one route segment at a time to reduce cost. Annealing could occasionally accept a longer route to escape a congestion pattern. Each method uses the same problem representation but makes a different commitment about alternatives, memory, and risk.",
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
      </div>
    ),
    note: "The first card is Reduce: use symmetry, bounds, or domain knowledge to ignore possibilities that are equivalent or hopeless. The second is Evaluate: assign a cost, distance, reward, or estimated total to the states that remain. Reduction changes how much must be considered; evaluation changes which remaining state looks most promising. Climb means improve locally by moving to a better neighbor. Escape means relax that discipline when strict improvement becomes a trap. Hill climbing is like a hiker who always steps uphill; simulated annealing occasionally permits a downhill step so the hiker can leave a small hill and approach a taller mountain. The joke is that the algorithm becomes wiser by temporarily looking worse. Today stays focused on heuristic design, evaluation functions, hill climbing, and annealing. Best-first search and A star will later combine heuristic estimates with an explicit frontier. This distinction matters: local search usually keeps one current state, while best-first methods compare a collection of alternatives. Do not let the shared word heuristic blur two different memory and recovery models. The four cards can be read as one decision loop. What can safely be removed? How will the survivors be scored? Which local change improves that score? What escape behavior is allowed when improvement stops? This sequence prevents a common design mistake: reaching for annealing before checking whether symmetry or a better feature could simplify the landscape. Randomness is useful, but it should not be hired to perform work that a cleaner representation could eliminate deterministically.",
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
    note: "Click the tic-tac-toe case. Nine factorial equals 362,880 orderings. That number is a deliberately crude permutation proxy, not the exact number of legal games, because legality, alternating players, early wins, and symmetry remove many sequences. The point is diagnostic: even a toy board creates enough raw arrangements that representation and knowledge matter. Click chess. Sixty-four factorial is roughly 1.27 times ten to the eighty-ninth. Counting board-square permutations still exaggerates and misdescribes legal chess states, but the exponent makes a practical point: a systematic procedure without strong pruning will spend the semester introducing itself to possibilities and never reach the exam. Click Go. Three hundred sixty-one factorial has an exponent near seven hundred sixty-eight. A heuristic is not magic and not merely a faster loop. It is a rule or method that uses available information to guide discovery when exhaustive enumeration is impossible or wasteful. The proxy counts are warnings: the agent must ignore most possibilities intelligently, while remembering that ignored possibilities can contain the best solution. A rough upper-bound proxy can guide engineering even when it is not an exact state count. If a naive count is already astronomical, correcting it downward by a few orders of magnitude may leave the practical conclusion unchanged. But precision still matters when comparing algorithms or making scientific claims. Say what is counted, which legal constraints are ignored, and why the proxy supports only a scale argument. Honest approximations teach more than suspiciously precise mythology.",
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
    note: "In the enlarged figure, the first move appears to offer nine squares, but rotations and reflections group them into three symmetry classes: corner, center, and side. Symmetry does not make moves disappear physically. It proves that several branches have the same strategic structure, so searching one representative can stand in for the others. This is knowledge-based reduction, not a faster implementation of the same redundant tree. Close the figure and answer the quick check incorrectly first with nine. The feedback exposes the misconception: legal actions are not the same as strategically distinct actions. Now choose three. All four corners are equivalent under rotation, all four sides are equivalent, and the center is unique. One fact about invariance removes two-thirds of the first-level tree before a heuristic score is even calculated. Symmetry proves equivalence among transformed positions; it does not prove that center is better than corner. That judgment needs an evaluation rule on the next page. Keep the logic separated: symmetry reduces duplicate structure, then a heuristic ranks the remaining representatives. Combining those steps carelessly is like removing duplicate restaurant menus and claiming the remaining restaurant must be delicious. Mathematically, symmetry partitions states into equivalence classes. Instead of searching every board, search one representative from each class and remember that rotations or reflections can reconstruct the others. This operation creates a smaller quotient state space. The same idea appears in scheduling identical machines, arranging interchangeable objects, and planning with indistinguishable agents. The hard part is proving that transformed states preserve legal actions, costs, and goal status; visual resemblance alone is not enough.",
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
    note: "The enlarged source image scores each opening by how many winning lines pass through it. A corner participates in three lines, the center in four, and a side in two. The measure is simple, computable, and tied to a strategic objective. It is still only a one-step estimate; counting available lines does not foresee every fork or defensive necessity later in the game. Close the figure and click Corner. The visible score is three. This is legal and not foolish, but under the stated heuristic it is not the maximum. Notice the wording: the conclusion is conditional on the rule most winning opportunities. Change the rule, and the ranking may change. Click Center. Four winning lines pass through the center, so the heuristic selects it. The center is also unique under symmetry, which makes this one representative branch especially convenient. A heuristic has turned nine surface actions into three candidates and then one preferred branch. That is an enormous reduction produced by a few lines of domain knowledge. Click Side and observe two winning lines, then reveal all scores so the comparison remains visible: corner three, center four, side two. The side is the weakest according to this measure. However, the table does not prove optimal play. It tells us which first move this particular heuristic prefers. Heuristics are confident assistants, not royal decrees. Counting winning lines claims that line participation predicts strategic promise. That claim can be tested against perfect play or a database of games. If the heuristic consistently prefers losing openings, the arithmetic may be correct while the relevance claim is wrong. This is a useful way to critique learned evaluation functions too: ask which features influence the score, what outcome they are supposed to predict, and where that relationship fails.",
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
    note: "Enlarge the pruned tree. The center-opening branch remains, while corner and side branches are removed after symmetry grouping and heuristic scoring. The picture makes a crucial benefit visible: intelligence can reduce branching before deeper search begins. Every eliminated branch saves all of its descendants, so an early informed decision compounds through the tree. Close the image and follow the four-step list. Group symmetric states, score distinct openings, keep the center, then reapply the heuristic after the opponent moves. A heuristic is not a coupon used once at checkout. Each new state changes the available winning lines, threats, and responses, so the evaluation must be recomputed. Pruning two-thirds of a tree sounds heroic, but correctness now depends on the heuristic preserving the strategically important branch. A short-sighted score can discard a move that enables a later win or blocks a future threat. The tradeoff is not search versus no search. It is more computation with stronger guarantees versus less computation with greater dependence on the quality of knowledge. Suppose every state has nine actions but symmetry and evaluation keep only three. After one level the reduction is modest; after several levels, the difference between nine to the depth and three to the depth is enormous. This is why early pruning is attractive and dangerous. A mistaken deletion near the root erases an entire future subtree. Verification effort should therefore concentrate on high-impact pruning rules and early decisions, not only on leaves.",
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
    note: "Inspect the travelling-salesperson tree. Fixing start city A leaves N minus one cities to order, so the candidate tour count grows as N minus one factorial before useful pruning. The arc labels show accumulated weight, not just the price of the latest edge. Reading cumulative cost correctly is essential because pruning decisions compare partial tours with the best complete tour found so far. Close the figure. Branch and bound keeps an incumbent: the cheapest complete tour currently known. For each partial tour, compute a lower bound on any completion. If that bound is already no better than the incumbent, prune the branch. This is logically safer than mere optimism because the bound explains why every descendant must lose. Nearest neighbor chooses the closest unvisited city at each step. It is wonderfully cheap and wonderfully capable of painting itself into an expensive corner. Think of grocery shopping by always walking to the nearest item: you may end with frozen food melting while the final item waits across the store. The rule reduces work dramatically, but it does not reserve an inexpensive return to the start. Nearest neighbor guesses which next city looks good. Branch and bound uses a mathematical inequality to prove when a branch cannot win. Both reduce work, but they support different language. A heuristic may say unlikely or less promising; a valid lower bound can justify impossible to beat. Mixing those claims can make an approximate method sound exact. In algorithm reports, label pruning as safe, heuristic, or stochastic so readers know what kind of evidence was used.",
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
    note: "In the enlarged counterexample, nearest neighbor produces the bold tour A to E to D to B to C and back to A. When the final A-C edge costs 125, the total is 375 and the route is best in this example. Change only that return edge to 300 and the same sequence costs 550. The greedy choices did not change, but their hidden consequence did. Close the figure. Choose the first edge as a deliberately wrong answer; it looks suspicious only because it comes first. Then choose the final C-to-A edge. The feedback identifies the actual blind spot: nearest neighbor evaluates each immediate step but fails to reserve a cheap way home. A local estimate can postpone a large obligation until no alternatives remain. A stronger heuristic might include a lower bound for returning to the start, the cheapest outgoing edges still required, or a minimum-spanning-tree estimate over unvisited cities. The exact design depends on the search method and required guarantees. The lesson is broader than TSP: whenever an action creates a future obligation, scoring only the immediate reward can make the agent borrow from tomorrow at an impressive interest rate. To test a greedy rule, preserve the local choices while changing a later consequence. The TSP slide does exactly that: early nearest edges remain attractive, but the final return becomes expensive. This counterexample pattern is reusable. For earliest-deadline scheduling, create one long urgent job that blocks many short jobs. For cheapest-item shopping, add shipping fees paid at the end. A good counterexample isolates the heuristic's missing information rather than merely producing random failure.",
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
    note: "Start with the first two cards. Identify the goal precisely, then collect the data and domain knowledge that can distinguish progress from distraction. For a Mars rover, reaching a target is not enough if the route exceeds energy or safety limits. A formula written before the objective is understood is algebra wearing a fake mustache. The third card reduces states only when equivalence or irrelevance is justified. The fourth defines measurable features such as distance, risk, number of threats, or estimated energy. Quantification forces vague preferences into a comparison rule. It can also expose disagreement: two experts may agree on the goal but weight risk and speed differently. The fifth card is testing. Try easy cases, boundary cases, counterexamples, and situations where two scores tie. A heuristic that succeeds only on the example used to invent it is not a heuristic yet; it is a souvenir. Testing across puzzles, vehicles, games, and robots asks whether the information truly tracks progress or merely happened to correlate once. After choosing measurable features, a designer may combine them with weights. A robot score could equal travel time plus ten times collision risk plus a lateness penalty. The weights encode tradeoffs and units, so they need calibration from expert judgment, data, or optimization. Multiplying a feature by a large number does not make it objectively important; it makes the program treat it as important. Document that policy choice and test sensitivity to the weights.",
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
    note: "Focus on g of n. It is the accumulated known cost from the start to state n. In an unweighted tree, g may simply be depth. In a road network, it could be miles already driven. Calling g a heuristic is a common mistake: it summarizes the path taken; it does not estimate the future. Now h of n asks what cost may remain from n to a goal. Manhattan distance in a sliding puzzle is an estimate; straight-line distance on a road map is another. h is the heuristic function. A useful h is cheap enough to compute and informative enough to change decisions. A perfectly accurate h would solve the remaining problem, which is a slightly suspicious bargain. Finally f of n equals g plus h: known cost so far plus estimated cost remaining. In a cost convention, smaller is better. In a reward convention, larger may be better. State the convention before comparing numbers; otherwise a class can passionately optimize in opposite directions and still congratulate itself on teamwork. If h of n is zero for every state, then f equals g and the heuristic contributes no guidance. In a frontier-based search, this reduces A star to uniform-cost search. If g is also ignored and only h is used, the method becomes greedy best-first search. Those later algorithms are not today's local search, but the algebra previews how one formula can express different strategies depending on which information is present.",
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
    note: "The enlarged eight-puzzle figure shows one start arrangement and three children created by moving the blank once. The candidates are close in the state graph, yet different heuristics can rank them differently because each heuristic notices different information. Before looking at the next page's numbers, identify which tiles differ from the goal and how far each must travel. Close the figure. h one counts misplaced tiles and ignores distance. h two sums horizontal and vertical distance to each tile's goal position. Manhattan distance is appropriate because legal puzzle moves are axis-aligned; a diagonal shortcut would pass through the plastic between squares, which the puzzle manufacturer discourages. h three adds two for each direct tile reversal. That feature may capture a difficult conflict, but by itself it can assign identical scores to states that clearly differ. Predict which measure will distinguish these three children, then ask what each measure ignores. Heuristic design is feature engineering with consequences: whatever the score cannot see cannot influence the choice. For A star, an admissible heuristic never overestimates the true remaining cost. Misplaced tiles and Manhattan distance are useful because they can be interpreted as relaxed versions of the puzzle: they ignore some interactions, so they estimate work without inventing extra required moves. A highly aggressive composite may guide faster but lose that property. We will examine the guarantee later; for now, recognize that heuristic quality includes both informativeness and mathematical behavior.",
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
    note: "Inspect the worked comparison. The three children receive h-one scores 5, 3, 5; h-two scores 6, 4, 6; and h-three scores 0, 0, 0. The middle child looks best under both misplaced tiles and Manhattan distance because lower estimated cost is better. The reversal-only measure provides no discrimination here. Close the figure and select h one. The score row shows 5, 3, 5. It is fast to compute and correctly prefers Child 2 in this example, but it treats a tile one step away the same as a tile five steps away. Speed is useful; blindness is still blindness even when computed very efficiently. Select h two. The visible scores become 6, 4, 6. Manhattan distance uses more information, so it often gives a sharper estimate while remaining cheap. It still ignores interactions where moving one tile blocks another. More informative does not mean omniscient; it means the estimate distinguishes more relevant structure. Select h three. Every child receives zero, so this feature alone cannot choose. A composite can add distance plus twice the number of reversals, but adding signals is not automatically improvement. Test whether the combination predicts real remaining work and whether it preserves any guarantee required by the search algorithm. A spreadsheet can calculate nonsense to twelve decimal places. Both h one and h two tie Child 1 with Child 3. A real implementation must still choose an order: first generated, lower g, lexicographic state code, or a secondary heuristic. Tie-breaking can change runtime dramatically even when the primary score and correctness guarantee remain the same. Record the rule so repeated runs and classroom traces are reproducible. Otherwise the algorithm appears moody when it is merely under-specified.",
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
    note: "The enlarged figure annotates the same three puzzle children. Each is one move from the start, so g equals one for all three. Their h values are five, three, and five. Adding the known and estimated parts gives f values six, four, and six. Because this is a cost function, Child 2 has the smallest estimated total. Close the figure and select Child 1. The equation reads one plus five equals six. Keep the labels attached: one is g, the move already paid; five is h, the estimated work remaining; six is f, the estimated total. Arithmetic without semantics is how formulas become decorative wallpaper. Select Child 2. One plus three equals four, currently the best score. The decision is not based on h alone by accident; g happens to tie across these depth-one children. At different depths, g can prevent the search from chasing a low-looking h down an extremely expensive path. Select Child 3. Its f score is also six. The reducer shown on the page selects Child 2 because four is less than both sixes. If the function represented reward instead of cost, the comparison direction would reverse. Code should make that convention explicit; a variable named score is not a legally binding promise about whether high or low is good. Imagine two routes. Route A has already cost one and appears five units from the goal; Route B has cost twenty but appears one unit away. Comparing h alone prefers B, while f compares estimated total six versus twenty-one. The example shows why accumulated cost matters when paths have different histories. A promising-looking state can sit at the end of a wildly expensive detour, like finding a discount store after buying an airplane ticket to reach it.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Knowledge point 5 · Hill climbing",
    title: "Hill climbing keeps moving only while a neighbor looks better",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <SearchSourceImage
          alt="Simple hill climbing rejects A=3, accepts B=5 because 5 exceeds current=4, and stops before inspecting C=7."
          caption="Simple hill climbing accepts the first improvement: next = 5 > current = 4. It need not choose the best neighbor, 7."
          file="simple-hill-climbing-first-better.svg"
          sourceRoot="/diagrams"
        />
        <section>
          <div className="heuristic-big-number"><strong>next &gt; current</strong><span>the basic acceptance rule for ascent</span></div>
          <p>Inspect neighbors in order. Move to the first state with a higher evaluation value, then repeat from that new current state.</p>
          <SearchCallout label="Local information" tone="amber">
            The algorithm sees neighboring states, not the entire landscape. A better neighbor need not lead to the global best solution.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Inspect the search landscape. The vertical dimension is value for a maximization problem. The algorithm sees only nearby states, so it can identify an uphill neighbor without seeing whether a taller peak exists beyond a valley. The picture is a god's-eye view for us, not information automatically available to the agent. Close the figure. The basic ascent rule is next greater than current. For cost minimization, the inequality reverses and the method descends. Hill climbing therefore needs a clearly stated evaluation direction. It also needs a neighborhood definition: changing one variable, swapping two cities, or moving one step creates very different landscapes. A better neighbor is evidence of local improvement, not proof of global quality. Hill climbing is like climbing in fog with an altimeter. The altimeter tells whether the next step rises, but not whether Mount Everest is two valleys away. The method is attractive because it uses little memory and can work in huge or continuous spaces; its limitation is the same commitment that makes it efficient. A landscape is not an intrinsic picture of the problem alone; it depends on the move operators. In scheduling, swapping adjacent tasks creates one neighborhood, while moving any task to any position creates another. Larger neighborhoods can reveal better steps and reduce local traps, but they cost more to enumerate. Before blaming hill climbing, inspect whether the chosen neighborhood makes useful changes reachable at an affordable computational price.",
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
    note: "Read the first two steps. Test whether the current state already solves the problem; if not, generate its children. Local search may discard the path used to arrive, but it still needs a correct successor function. A clever evaluation cannot repair illegal neighbors generated by a broken model. Step three evaluates children in order. Step four selects the first better state and commits without comparing the rest. That word first creates order dependence. If values are five, seven, and six while current is four, first-choice takes five and never discovers seven during this iteration. The algorithm is impatient by design, not because the seven offended it personally. Repeat until a goal or a state with no better successor. At that point strict hill climbing stops, even if a superior state exists elsewhere. Recovery mechanisms include a large jump, sideways move, random restart, backtracking, or temporarily accepting a worse move. Each repair adds computation, randomness, memory, or weaker monotonic progress. There is no free rescue helicopter. First-choice methods can be sensible when evaluating one successor requires an expensive simulation. If a design change improves fuel use, accepting it immediately may allow more iterations within a fixed time budget than measuring every alternative. The comparison should therefore include improvement per unit computation, not only improvement per move. Steepest ascent wins each local contest; first-choice may enter many more contests before the clock expires.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Interactive demonstration · One current state",
    title: "First-choice and steepest-ascent can move differently",
    content: (
      <div className="heuristic-layout heuristic-layout-split">
        <HillClimbStepper />
        <section className="local-search-properties">
          <h3>Steepest-ascent chooses the best child</h3>
          <p>Evaluate <strong>all child states</strong> and choose the one with the highest value. Move only if this best child is better than the current state; otherwise stop.</p>
          <p>Here, current = 4 and children are A = 5, B = 7, C = 6. Steepest-ascent selects <strong>B = 7</strong>; first-choice stops at A = 5.</p>
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
    note: "Select First-choice and reveal the selection. The current value is four, and successors are A equals five, B equals seven, and C equals six. Scanning left to right, A is the first improvement, so the method commits to five. It saves evaluation work but makes successor order part of the behavior. Select Steepest-ascent and reveal again. This mode compares every successor, then chooses B with value seven. It spends more work per move to obtain the best local step. It improves the decision among visible neighbors, but the selected seven may still lead to a smaller peak than some path beginning with six. The properties list explains the memory advantage. Keep one current state, inspect neighbors, ignore the arrival path, and retain no full frontier. This is valuable when the state itself matters more than the route, such as arranging a schedule or optimizing a design. It is dangerous when the path must be returned, actions are irreversible, or recovery from a poor commitment is essential. Because first-choice scans left to right, randomizing successor order can turn a fixed bias into stochastic exploration. Repeated runs may then reach different local optima. That can improve robustness, but it also means one trace is insufficient evidence. Report the distribution of outcomes and the evaluation budget. Random order is a design choice, not a magician's cape hiding inconvenient results.",
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
    note: "Enlarge the landscape and locate three traps. A local maximum has no better neighbor although a higher peak exists. A plateau has many equal-valued neighbors, so the gradient provides no direction. A shoulder is flat locally but eventually rises; a few sideways moves could reach improvement. The same picture shows why one-step information cannot diagnose the whole terrain. Close the figure. Focus first on local maximum: every immediate move is worse. Then plateau: many moves are equally valued and direction is ambiguous. Finally shoulder: equality is temporary and a rising edge exists beyond the flat region. These categories matter because the repairs differ; a method that crosses a shoulder may still fail at a true local maximum. Without a global bound or exhaustive evidence, hill climbing cannot tell whether the peak under its boots is local or global. Multiple heuristics, learned evaluation, and randomness may improve practical results, but none automatically provides a certificate. The algorithm can stop confidently for a very modest reason: it has run out of better neighbors, not because the universe has run out of better states. An equal score does not necessarily mean states are equally useful. The heuristic may be too coarse to see progress, while another feature could reveal distance to an exit, constraint slack, or future flexibility. Sideways moves are one repair; enriching the evaluation is another. Before adding randomness, ask whether the plateau represents genuine indifference or missing information in the score.",
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
    note: "First-choice stops at the first improving successor; steepest ascent evaluates all successors and chooses the best. If successor evaluation is expensive or the branching factor is huge, first-choice may make faster progress. If ordering is arbitrary and evaluations are cheap, steepest ascent removes an avoidable source of poor local choices. The pseudocode chooses the highest-valued successor. If that neighbor is no better than current, return current; otherwise replace current and repeat. Notice what is absent: no OPEN queue, no CLOSED set, no parent chain, and no backtracking instruction. The compact state is the feature and the limitation. For value or reward, select the highest neighbor. For cost or energy, select the lowest. Calling every improvement uphill can become confusing when the objective is energy minimization, where improvement physically goes downhill. State the mathematical convention first and let the mountain metaphor follow, not lead the expedition. In continuous optimization, gradient ascent uses derivatives to select a direction of fastest local increase. In discrete problems, steepest-ascent hill climbing compares neighboring states instead. The intuition is related, but the machinery differs: a puzzle has no smooth derivative between two tile arrangements. Using gradient as a loose synonym is common; state clearly whether the method computes derivatives or simply ranks discrete successors.",
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
    note: "Inspect the three-level look-ahead figure. A one-step evaluator sees equal-valued neighbors and cannot choose a direction, while deeper inspection reveals that one sequence eventually rises. Look-ahead effectively changes the neighborhood from immediate children to short paths. That can cross a plateau, but its cost grows with depth and branching. Close the image, choose Local maximum, and reveal a repair. Random restart samples a new region; backtracking revisits an alternative; simulated annealing may accept a worse move. Look-ahead alone does not guarantee escape if every examined path first descends farther than the chosen horizon. Choose Plateau and reveal. Bounded sideways moves, randomness, or multi-step look-ahead can restore direction. Unlimited sideways movement is risky because the search can wander forever across equal states, like a committee discussing font choices after the deadline has achieved sentience. Choose Shoulder and reveal. A limited sequence of sideways moves or deeper look-ahead can reach the rising edge. This repair is especially well matched because the shoulder contains improvement nearby, just not one step away. The correct answer is conditional: name the failure geometry, the repair's horizon, and the new cost or risk introduced. Practical optimizers often combine repairs. Use sideways moves for short plateaus, random restart for separated basins, tabu memory to avoid immediate revisits, and annealing for controlled descent. The combination should be justified by observed failure modes, not assembled like every topping at a frozen-yogurt bar. Each addition changes runtime, memory, parameters, and reproducibility; ablation tests can reveal which mechanism actually helps.",
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
    note: "Enlarge the metallurgy image. Heating gives particles enough energy to rearrange and escape rigid local structure; controlled cooling gradually reduces motion so a low-energy configuration can stabilize. Simulated annealing borrows this physical story for optimization. Temperature is an algorithmic control parameter, not a weather report from inside the computer. Close the metallurgy image and enlarge the schedule. Early temperature is high, so the search explores broadly and tolerates some bad moves. Later temperature is low, so the policy becomes selective. Cooling too quickly freezes a mediocre configuration; cooling too slowly may produce excellent theoretical patience and an instructor who retires before the run finishes. Close the schedule. In energy minimization, lower energy is better. In value maximization, higher value is better. Both descriptions use the same acceptance idea after their signs are handled consistently. Simulated annealing is a probabilistic metaheuristic: it does not require the objective landscape to look physically like metal, and it does not guarantee a perfect crystal in a finite practical run. A schedule allocates the run's willingness to explore. Exponential cooling spends exploration quickly; logarithmic cooling can support convergence theory but is painfully slow; adaptive schedules react to acceptance rates or stalled progress. There is no universally best schedule because landscapes differ. Treat temperature and cooling rate as experimental parameters, record them, and compare results under equal evaluation budgets.",
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
    note: "Click Replay and watch the search traverse the landscape. The important event is not that the marker always rises; it is that a non-improving move can leave a locally attractive region. Strict hill climbing would reject that transition. Annealing assigns it a probability based on how bad the move is and how much temperature remains. Enlarge the animation and identify three events: arrival at a locally attractive region, acceptance of a worse move, and later arrival at the global maximum. The successful path demonstrates possibility, not certainty. A different random draw can reject the escape move or follow another neighbor. Close the animation. Choose the full-frontier answer first, then the correct answer: simulated annealing sometimes accepts a worse neighbor. It does not need to compare every path and does not preserve a full frontier. Its new capability is probabilistic escape, purchased with nondeterministic outcomes. An acceptance probability of 0.37 does not mean the move is thirty-seven percent completed. The algorithm draws a random number between zero and one and accepts if the draw falls below 0.37. Over many equivalent proposals, roughly thirty-seven percent are accepted. One individual proposal is binary: accepted or rejected. This distinction prevents probability from being narrated as a gradual physical motion.",
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
    note: "Step one samples a random nearby state rather than searching for the best neighbor. Step two computes delta V, the change in objective value. Random sampling keeps each iteration cheap and introduces exploration, while delta V measures whether the proposal helps or hurts under the chosen convention. Step three accepts improvement automatically. Step four may accept a negative change with a probability that decreases as the loss becomes larger. This is not random chaos. A tiny loss can be tolerated frequently at high temperature, while a catastrophic loss remains unlikely. The policy has a thermostat, not a blindfold. Step five lowers temperature over time, shifting from exploration toward exploitation. The optional note adds another source of randomness: move size itself can vary, enabling occasional large jumps. Larger jumps may escape distant traps but can also ignore useful local structure. The schedule and neighborhood jointly determine how the search roams. If random proposals are tiny, high temperature may still explore slowly because each accepted move travels little. If proposals are enormous, low temperature may reject nearly everything. Effective annealing coordinates proposal scale with temperature: broad moves early, finer adjustments later. The optional move-size note is therefore not decorative. It reminds us that exploration depends on what is proposed as well as what is accepted.",
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
    note: "Trace the maximization pseudocode. Delta V equals value of next minus value of current. Positive means better and is accepted automatically. Negative means worse and is accepted with probability exponential of delta V over T. Because delta V is negative, the exponent is negative and the probability lies between zero and one. For energy or cost minimization, delta E equals next minus current. Positive delta E is worse, so accept it with exponential of negative delta E over T. The minus sign is not a disagreement with the value formula. It is the translation required because one convention rewards increases and the other rewards decreases. For a fixed loss, reducing T makes the negative exponent larger in magnitude, so acceptance probability decreases. This corrects a frequent verbal reversal. High temperature is permissive; low temperature is conservative. Mixing the value definition with the energy formula can produce probabilities above one or the absurd claim that colder systems take more risks. For very negative exponents, exponential can underflow to zero in floating-point arithmetic. That is usually acceptable because the probability is effectively negligible, but code should avoid division by zero when temperature reaches zero. The pseudocode returns current at T equals zero before calculating probability. Also compare logarithms when appropriate: accept if log of a uniform draw is less than delta V over T, avoiding explicit exponentiation.",
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
    note: "Click delta V equals negative 0.1 at temperature one. The probability is exponential negative 0.1, about 0.9048, or 90.48 percent. A small loss is usually accepted at this temperature. This helps the search drift across shallow bumps rather than treating every tiny decline as a cliff. Click delta V equals positive 0.5. An improving move is accepted with probability one; the exponential test is unnecessary. Annealing changes how the algorithm treats losses, not whether it recognizes improvement. Randomness opens escape doors without asking progress to flip a coin. Click delta V equals negative five. At temperature one, exponential negative five is approximately 0.0067, or 0.67 percent. The decimal is not 0.05 and the percentage is not five percent. A large loss is possible but rare, which prevents exploration from becoming a habit of enthusiastically jumping off cliffs. Move the temperature slider down to 0.25 while delta V remains negative five. The probability becomes extremely close to zero. Nothing about the proposed move changed; only the system's willingness to take risk changed. This isolates the cooling effect and shows why late-stage search behaves more like greedy local optimization. Move the slider up to five. The same loss now has probability exponential negative one, about 0.3679. Heating makes a severe loss far more plausible, which may help escape a deep basin but can destroy good structure. A schedule balances those phases rather than choosing one temperature forever. For a fixed negative delta V, probability rises smoothly with temperature. For fixed temperature, probability falls as the loss magnitude grows. Those two monotonic relationships are excellent sanity checks. If code reports that a larger loss is more likely, or that cooling increases acceptance, inspect the sign convention. A quick table of values can catch an error before a thousand-run experiment turns it into a colorful but fictional chart.",
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
    note: "The historical and theoretical cards separate two claims. Simulated annealing became a practical optimization method in the early 1980s. Mathematical convergence to a global optimum requires restrictive, asymptotically slow cooling and effectively unbounded time. A finite classroom or production run does not inherit that guarantee merely because the algorithm has an impressive temperature metaphor. Gradual cooling may be slow, schedule selection is problem-specific, and results depend on random proposals and acceptances. The method is valuable because it can escape local traps with little memory, not because every run reaches the global optimum. Report several runs, best and typical quality, runtime, and schedule parameters when evaluating it empirically. Choose the claim that every run finds the optimum, then correct it by selecting: a finite run may stop without the global optimum. Cooling makes fixed worse moves less likely, not more likely. This final correction is the honest conclusion: annealing exchanges a deterministic path for a tunable probability of escape, while practical guarantees remain conditional. Use the exit ticket to connect the lesson. Define g as known cost, h as estimated remaining cost, and f as their combined evaluation. Name one hill-climbing trap and a repair whose limits you can explain. Finally compute exponential negative two at temperature one, about 0.1353. The goal is not to memorize a zoo of algorithms; it is to reason about information, locality, risk, and guarantees. Use multiple independent runs, fixed evaluation budgets, and baselines such as random search and greedy hill climbing. Report median, spread, best result, and failure rate—not only the champion run. Separate tuning data from final evaluation so the schedule is not customized to the test cases. A stochastic method deserves the same scientific discipline as a deterministic one, plus enough repetitions to distinguish reliable improvement from a photogenic accident.",
    sourceSlides: [29, 30, 31],
  },
];

export function HeuristicLocalSearchDeck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      hoverEffects
      meetingLabel="Module 4 · Lesson 5"
      meetingTitle="Heuristic Search and Local Search"
      notesMode="key-points"
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
