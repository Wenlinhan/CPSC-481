"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  BacktrackingTrace,
  FrontierTrace,
  RevealSequence,
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const MEETING_04_TIMING = [2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 3, 4, 3, 2, 3, 2, 3, 4, 3, 3, 3, 2, 4, 3, 3, 2, 2, 4] as const;

function AlgorithmSelectionLab() {
  const cases = [
    {
      title: "Shallow goal; every step has equal cost",
      answer: "Breadth-first search",
      why: "BFS finds the shallowest goal and is complete when the branching factor is finite.",
    },
    {
      title: "Very deep solution; memory is severely limited",
      answer: "Depth-first search",
      why: "DFS stores a path plus alternatives rather than an entire breadth layer, but it gives up shallowest-solution guarantees.",
    },
    {
      title: "Unknown goal depth; equal step costs",
      answer: "Iterative deepening",
      why: "Repeated depth-limited DFS combines BFS's shallowest-goal behavior with DFS-like space usage.",
    },
    {
      title: "Different positive step costs; minimum total cost required",
      answer: "Uniform-cost search",
      why: "UCS expands the lowest accumulated path cost g(n), not simply the shallowest node.",
    },
  ];
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = cases[active];
  return (
    <div className="algorithm-selection">
      <nav>
        {cases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.title}
            onClick={() => {
              setActive(index);
              setRevealed(false);
            }}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <span>Engineering case {active + 1}</span>
        <h3>{item.title}</h3>
        <p>Choose a strategy and name the guarantee you are accepting or giving up.</p>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide analysis" : "Reveal one defensible choice"}
        </button>
        {revealed && <SearchCallout label={item.answer} tone="green">{item.why}</SearchCallout>}
      </section>
    </div>
  );
}

function ReviewStudio() {
  const groups = [
    {
      label: "Representation",
      questions: [
        "How do humans solve problems in general? Do we use a general-purpose strategy?",
        "What are state, state space, search space, and search?",
        "What information and methods must a useful state maintain?",
        "How can a state and state space be represented in computer data structures?",
        "What are the basic elements and benefits of graph theory?",
        "Describe state-space problem solving from conceptual representation to implementation.",
      ],
    },
    {
      label: "Solutions and direction",
      questions: [
        "What are the initial state, goal state, and path?",
        "When is the solution a state, a path, or both?",
        "What determines the size or complexity of a search space?",
        "What is data-driven or forward search, and when is it appropriate?",
        "What is goal-driven or backward search, and when is it appropriate?",
        "Why choose a search direction if both approaches explore the same problem space?",
      ],
    },
    {
      label: "Algorithms",
      questions: [
        "How do DFS, BFS, and backtracking find solutions?",
        "Why are DFS and BFS called brute-force methods?",
        "What is the primary difference between DFS and backtracking?",
        "Why can backtracking be considered informed while still relying on brute-force exploration?",
        "What are the benefits and limitations of DFS, BFS, bounded DFS, iterative deepening, and backtracking?",
        "Which data structures implement graphs, frontiers, explored sets, paths, and dead-end records?",
      ],
    },
  ];
  const [active, setActive] = useState(0);
  return (
    <div className="search-review-studio">
      <nav>
        {groups.map((group, index) => (
          <button
            className={active === index ? "active" : ""}
            key={group.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {group.label}
          </button>
        ))}
      </nav>
      <ol>
        {groups[active].questions.map((question, index) => (
          <li key={question}><span>{index + 1}</span><p>{question}</p></li>
        ))}
      </ol>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 3 · Lesson 4",
    title: "Uninformed Graph Search",
    subtitle: "Depth-first, breadth-first, bounded, uniform-cost, and backtracking strategies",
    content: (
      <div className="search-hero">
        <section>
          <span>From a state space to an algorithm</span>
          <h3>Which state should the agent expand next?</h3>
          <p>The answer determines search order, memory use, solution guarantees, and failure modes.</p>
        </section>
        <SearchSourceImage
          alt="A rooted search tree used to compare DFS and BFS"
          file="dfs-bfs-example-tree.png"
        />
      </div>
    ),
    note: "Open by retrieving the Meeting 3 four-tuple. Then ask which part of the model specifies the order in which states are examined.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Meeting map",
    title: "Five strategies, four evaluation questions",
    content: (
      <div className="algorithm-map">
        <section>
          {[
            ["DFS", "Go deeper before siblings"],
            ["BFS", "Explore level by level"],
            ["Bounded / deepening", "Control depth, then increase it"],
            ["Uniform-cost", "Expand lowest accumulated cost"],
            ["Backtracking", "Maintain a path and recover from dead ends"],
          ].map(([name, detail], index) => (
            <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{detail}</p></article>
          ))}
        </section>
        <aside>
          <span>Evaluate every strategy</span>
          <p><strong>Complete?</strong> Will it find a solution if one exists?</p>
          <p><strong>Optimal?</strong> Will it return the best solution?</p>
          <p><strong>Time?</strong> How many states may it generate?</p>
          <p><strong>Space?</strong> How much frontier and history must it store?</p>
        </aside>
      </div>
    ),
    note: "The historical source emphasizes DFS, BFS, and backtracking. Uniform-cost evaluation is added here to align the revised course plan and prepare for A*.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Knowledge point 1 · Search order",
    title: "The graph is not handed to the algorithm",
    content: (
      <div className="tree-challenge">
        <SearchSourceImage
          alt="Example graph with root A and descendants through U"
          caption="The common source graph for DFS and BFS."
          file="dfs-bfs-example-tree.png"
        />
        <section>
          <h3>Predict two removal orders</h3>
          <p>Start at A. Generate children left to right.</p>
          <ol>
            <li>Write the first ten states removed by DFS.</li>
            <li>Write the first ten states removed by BFS.</li>
            <li>Mark when goal S is first removed—not merely generated.</li>
          </ol>
          <SearchCallout label="Important modeling fact" tone="amber">
            In a real problem, the complete search tree is not given. The algorithm generates it incrementally from the initial state.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Students commit to both orders before any reveal. This makes the later OPEN/CLOSED traces meaningful.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Knowledge point 1 · Same graph, different frontier",
    title: "Read the frontier state before comparing two snapshots",
    content: (
      <div className="iteration-comparison">
        <article>
          <span>DFS · iteration 6</span>
          <SearchSourceImage
            alt="Open and closed regions after six iterations of depth-first search"
            caption="DFS follows one branch and keeps alternatives for later."
            file="dfs-iteration-six.png"
          />
        </article>
        <article>
          <span>BFS · after expanding C</span>
          <SearchSourceImage
            alt="Open and closed regions after six iterations of breadth-first search"
            caption="This exact source image is after expanding C; its original iteration-6 label was inconsistent with the trace."
            file="bfs-iteration-six.png"
          />
        </article>
      </div>
    ),
    note: "Correct the source mismatch explicitly: the DFS figure matches iteration 6, while the BFS asset shows the state after expanding C. The later interactive trace supplies a true iteration-6 BFS state.",
    sourceSlides: [23, 24],
  },
  {
    eyebrow: "Knowledge point 2 · Depth-first search",
    title: "DFS examines descendants before siblings",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Selection rule</span>
          <h3>Remove the deepest frontier state next</h3>
          <p>When a state is examined, its children and their descendants are examined before its siblings.</p>
        </section>
        <div>
          <article><strong>Strength</strong><p>Low memory relative to breadth-first search; it may reach a deep solution quickly.</p></article>
          <article><strong>Risk</strong><p>It can become lost deep in a graph, loop, or miss a much shorter path in another branch.</p></article>
          <article><strong>Implementation</strong><p>Place generated children on the left of OPEN, producing stack behavior.</p></article>
        </div>
      </div>
    ),
    note: "Separate the conceptual selection rule from the data structure. DFS can be written recursively or implemented with an explicit stack.",
    sourceSlides: [21, 30],
  },
  {
    eyebrow: "Knowledge point 2 · Source algorithm",
    title: "DFS uses OPEN, CLOSED, and a loop check",
    content: (
      <div className="algorithm-source-layout">
        <SearchSourceImage
          alt="Depth-first-search source pseudocode"
          caption="The source DFS algorithm; enlarge to inspect each line."
          className="algorithm-figure"
          file="dfs-algorithm.png"
        />
        <ol>
          <li>Initialize OPEN with the start state and CLOSED as empty.</li>
          <li>Remove the leftmost state X from OPEN.</li>
          <li>If X is a goal, return success.</li>
          <li>Generate children of X and place X on CLOSED.</li>
          <li>Discard a child already on OPEN or CLOSED.</li>
          <li>Place the remaining children on the <strong>left</strong> end of OPEN.</li>
          <li>Fail only when OPEN is empty.</li>
        </ol>
      </div>
    ),
    note: "Trace the exact source pseudocode line by line. Ask what can go wrong if the loop check is removed.",
    sourceSlides: [25],
  },
  {
    eyebrow: "Worked example · DFS trace",
    title: "OPEN records alternatives; CLOSED records examined states",
    content: (
      <div className="trace-source-layout">
        <SearchSourceImage
          alt="DFS trace listing OPEN and CLOSED over eleven iterations"
          caption="Source trace on the shared graph."
          className="trace-figure"
          file="dfs-trace.png"
        />
        <section>
          <h3>Read one row as an invariant</h3>
          <p>The leftmost OPEN state is always next. Newly generated children go before older alternatives. CLOSED prevents repeated examination.</p>
          <SearchCallout label="Path reconstruction" tone="cyan">
            OPEN and CLOSED alone do not preserve a returned solution path. Store a parent pointer—or an equivalent ancestor structure—for each generated state.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Ask students to verify the change from iteration 4 to 5 and identify which state becomes a dead end.",
    sourceSlides: [26],
  },
  {
    eyebrow: "Interactive demonstration · DFS",
    title: "Advance the frontier one state at a time",
    content: <FrontierTrace mode="dfs" />,
    note: "Before each click, students predict the selected state, OPEN, and CLOSED. Compare predictions with the exact source trace.",
    sourceSlides: [26],
  },
  {
    eyebrow: "Knowledge point 3 · Breadth-first search",
    title: "BFS explores the space level by level",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Selection rule</span>
          <h3>Remove the shallowest frontier state next</h3>
          <p>Examine all states at depth n before proceeding to depth n + 1.</p>
        </section>
        <div>
          <article><strong>Strength</strong><p>Complete for finite branching and returns a shallowest solution; with equal step costs, that solution is also minimum cost.</p></article>
          <article><strong>Risk</strong><p>The number of stored frontier states grows exponentially and can make a large space intractable.</p></article>
          <article><strong>Implementation</strong><p>Place generated children on the right of OPEN, producing queue behavior.</p></article>
        </div>
      </div>
    ),
    note: "Make the equal-step-cost condition explicit. Shallowest is not necessarily cheapest when edge costs differ.",
    sourceSlides: [21, 30],
  },
  {
    eyebrow: "Knowledge point 3 · Source algorithm",
    title: "One line changes DFS into BFS",
    content: (
      <div className="algorithm-source-layout">
        <SearchSourceImage
          alt="Breadth-first-search source pseudocode"
          caption="The source BFS algorithm; enlarge to inspect each line."
          className="algorithm-figure"
          file="bfs-algorithm.png"
        />
        <section>
          <h3>Children go to the right end of OPEN</h3>
          <p>The initialization, goal test, expansion, CLOSED update, duplicate test, and failure condition match the DFS framework.</p>
          <SearchCallout label="Queue invariant" tone="green">
            Older, shallower frontier states remain ahead of newly generated, deeper states.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Have students circle the one insertion rule that changes the exploration order.",
    sourceSlides: [27],
  },
  {
    eyebrow: "Worked example · BFS trace",
    title: "Breadth is visible in the OPEN sequence",
    content: (
      <div className="trace-source-layout">
        <SearchSourceImage
          alt="BFS trace listing OPEN and CLOSED over nine iterations"
          caption="Source BFS trace on the shared graph."
          className="trace-figure"
          file="bfs-trace.png"
        />
        <section>
          <h3>Depth-one states stay ahead of depth-two states</h3>
          <p>After A expands, B, C, and D remain ahead of E and F even after B generates them.</p>
          <SearchCallout label="Goal timing" tone="amber">
            A generated goal is not yet guaranteed to be the next state removed under every cost model. State the goal-test timing assumed by the algorithm.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Students identify the row in which every depth-one node has been closed and explain what appears next.",
    sourceSlides: [28],
  },
  {
    eyebrow: "Interactive demonstration · BFS",
    title: "Advance the queue one state at a time",
    content: <FrontierTrace mode="bfs" />,
    note: "Contrast the exact OPEN update with the DFS interaction. Ask which data structure property creates the difference.",
    sourceSlides: [28],
  },
  {
    eyebrow: "Worked example · BFS on the 8-puzzle",
    title: "Breadth-first removal order finds a shortest move sequence",
    content: (
      <div className="puzzle-source-layout wide">
        <SearchSourceImage
          alt="Breadth-first 8-puzzle tree with states numbered in removal order"
          caption="The source tree shows the order in which states are removed from OPEN."
          file="bfs-eight-puzzle.png"
        />
        <section>
          <h3>Trace the solution path backward</h3>
          <p>Use parent pointers from the numbered goal state to the initial state. The reversed pointer chain gives the move sequence.</p>
          <ul>
            <li>What creates duplicate puzzle states?</li>
            <li>Where would graph search remove them?</li>
            <li>Why does the frontier become large?</li>
          </ul>
        </section>
      </div>
    ),
    note: "Enlarge the exact source tree. Ask students to point to two duplicate arrangements reached by different move sequences.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Knowledge point 4 · Compare strategies",
    title: "BFS spends memory; DFS risks spending depth",
    content: (
      <div className="search-comparison-table">
        <div><span>Criterion</span><strong>Breadth-first</strong><strong>Depth-first</strong></div>
        <div><span>Order</span><p>All depth n before n + 1</p><p>Descendants before siblings</p></div>
        <div><span>Space</span><p>Potentially very large frontier</p><p>Usually one path plus alternatives</p></div>
        <div><span>Best fit</span><p>Small space or shallow solution</p><p>Deep solutions with tight memory</p></div>
        <div><span>Main risk</span><p>Intractable memory growth</p><p>Infinite/deep branch or nonshortest result</p></div>
        <div><span>Decision</span><p>The problem's properties determine the better choice.</p><p>No strategy is universally superior.</p></div>
      </div>
    ),
    note: "Ask students to name a problem property that reverses their choice. Preserve the source conclusion that algorithm choice depends on the problem.",
    sourceSlides: [30],
  },
  {
    eyebrow: "In-class practice · Select an algorithm",
    title: "Match the strategy to the guarantee that matters",
    content: <AlgorithmSelectionLab />,
    note: "Require justification in terms of completeness, optimality, time, space, costs, and expected solution depth.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Knowledge point 5 · Improve DFS",
    title: "A bound prevents infinite descent; deepening removes the guessed bound",
    content: (
      <div className="bounded-search-layout">
        <article><span>DFS with a bound</span><h3>Stop a path below a specified depth or time</h3><p>Treat the cutoff as failure on that path and try another. This is useful in time-limited game search.</p></article>
        <article><span>DFS with deepening</span><h3>Repeat DFS with bounds 0, 1, 2, …</h3><p>Each iteration conducts a complete depth-limited DFS to the current bound, then increases the bound by one.</p></article>
        <SearchCallout label="Tradeoff" tone="cyan">
          Iterative deepening combines shallowest-goal behavior with space on the order of b × d, while repeating work in the upper levels. Its time remains exponential in solution depth.
        </SearchCallout>
      </div>
    ),
    note: "Correct the source's superscript formatting when discussing O(b^d). Distinguish a cutoff from proof that no solution exists.",
    sourceSlides: [31],
  },
  {
    eyebrow: "Demonstration · Depth bound",
    title: "A depth-five cutoff changes what DFS can see",
    content: (
      <div className="depth-limit-demo">
        <SearchSourceImage
          alt="8-puzzle depth-first search tree with a depth bound of five"
          caption="The source bounded-DFS tree."
          file="dfs-depth-bound-five.png"
        />
        <section>
          <h3>Watch DFS and iterative deepening side by side</h3>
          <p>The verified Moving AI Lab animations use green for DFS and red for depth-first iterative deepening.</p>
          <a href="https://movingai.com/dfid.html" rel="noreferrer" target="_blank">Open the DFS vs. DFID teaching videos ↗</a>
          <SearchCallout label="Observation prompt" tone="amber">
            When does repeated shallow work cost less than exploring far below the shallowest goal?
          </SearchCallout>
        </section>
      </div>
    ),
    note: "The linked videos are supplemental. Before opening them, ask students to predict how branching factor changes the relative overhead.",
    sourceSlides: [31, 32],
  },
  {
    eyebrow: "Revised-plan supplement · Uniform-cost search",
    title: "When step costs differ, expand the smallest accumulated cost g(n)",
    content: (
      <RevealSequence
        items={[
          { label: "OPEN = A:0", detail: "Begin with the start state at path cost zero." },
          { label: "Expand A", detail: "Insert B:2, C:5, and D:1 into a priority queue ordered by g(n)." },
          { label: "Remove D:1", detail: "D is deeper than no node yet, but it has the lowest accumulated cost." },
          { label: "Update a path", detail: "If a cheaper path to an existing frontier state is found, replace its cost and parent." },
          { label: "Remove the goal", detail: "With positive step costs, the goal is optimal when removed as the minimum-cost frontier state." },
        ]}
        prompt="What does a cost-sensitive frontier do next?"
      />
    ),
    note: "This content extends the historical deck to meet the revised course plan. Connect UCS to BFS: when every step cost is equal, ordering by g(n) reproduces breadth layers.",
    sourceSlides: [21, 30],
  },
  {
    eyebrow: "Knowledge point 6 · Search evaluation",
    title: "Guarantees depend on explicit conditions",
    content: (
      <div className="evaluation-matrix">
        <div><span>Strategy</span><strong>Complete?</strong><strong>Optimal?</strong><strong>Space pattern</strong></div>
        <div><span>BFS</span><p>Yes, finite b</p><p>Yes, equal costs</p><p>O(b^d)</p></div>
        <div><span>DFS</span><p>No, in infinite depth</p><p>No</p><p>O(bm)</p></div>
        <div><span>Depth-limited</span><p>No if goal is below limit</p><p>No</p><p>O(bℓ)</p></div>
        <div><span>Iterative deepening</span><p>Yes, finite b</p><p>Yes, equal costs</p><p>O(bd)</p></div>
        <div><span>Uniform-cost</span><p>Yes, costs ≥ ε &gt; 0</p><p>Yes</p><p>Potentially exponential</p></div>
      </div>
    ),
    note: "Define b as branching factor, d as shallowest solution depth, m as maximum depth, and ℓ as the depth limit. Conditions are part of every guarantee.",
    sourceSlides: [30, 31],
  },
  {
    eyebrow: "Knowledge point 7 · Backtracking search",
    title: "Backtracking pursues a path and recovers from failure",
    content: (
      <div className="backtracking-intro">
        <SearchSourceImage
          alt="State space showing a current path and alternative branches for backtracking"
          caption="The source backtracking state space."
          file="backtracking-state-space.png"
        />
        <section>
          <h3>Continue until goal, dead end, or unacceptable cost</h3>
          <p>If the goal is found, return the path. At a dead end—or when the current path is too expensive—return to the most recent state with an untried alternative.</p>
          <SearchCallout label="Important distinction" tone="cyan">
            DFS already backtracks through its frontier. This list-based variant makes the current path, alternatives, and dead ends explicit and may prune by a path-cost rule; that does not automatically make it heuristic informed search.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Ask students to identify where the state-space figure would backtrack and which alternative should be tried next.",
    sourceSlides: [33],
  },
  {
    eyebrow: "Knowledge point 7 · Source algorithm",
    title: "SL, NSL, DE, and CS make recovery explicit",
    content: (
      <div className="algorithm-source-layout">
        <SearchSourceImage
          alt="Backtracking source pseudocode using SL NSL DE and CS"
          caption="The source backtracking algorithm; enlarge to inspect each condition."
          className="algorithm-figure"
          file="backtracking-algorithm.png"
        />
        <section className="backtracking-structures">
          <article><span>SL</span><p>State list: the current path.</p></article>
          <article><span>NSL</span><p>New-state list: alternatives still available.</p></article>
          <article><span>DE</span><p>Dead ends: states known not to continue the current solution.</p></article>
          <article><span>CS</span><p>Current state.</p></article>
          <SearchCallout label="Backtrack condition" tone="amber">
            If CS has no children after excluding states already on DE, SL, and NSL, remove states from SL until an available alternative becomes current.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Trace the source condition carefully. Students should explain why states already in SL must be excluded to avoid cycles in the current path.",
    sourceSlides: [34],
  },
  {
    eyebrow: "Worked example · Backtracking trace",
    title: "The current path can shrink without walking back through the graph",
    content: (
      <div className="trace-source-layout">
        <SearchSourceImage
          alt="Backtracking trace table for CS SL NSL and DE"
          caption="Source trace through iteration eight."
          className="trace-figure"
          file="backtracking-trace.png"
        />
        <section>
          <h3>Ancestors encode the return path</h3>
          <p>No physical reverse traversal is required. Maintaining ancestor information produces the same recovery effect.</p>
          <SearchCallout label="Interpret the lists" tone="green">
            When a branch fails, its states enter DE, SL shrinks to a viable ancestor, and NSL supplies the next alternative.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Ask what changes between iterations 3 and 4, then 4 and 5. Require an explanation using all four data structures.",
    sourceSlides: [35],
  },
  {
    eyebrow: "Interactive demonstration · Backtracking",
    title: "Scrub through the source trace",
    content: <BacktrackingTrace />,
    note: "Students predict CS, SL, NSL, and DE before moving the iteration slider.",
    sourceSlides: [35],
  },
  {
    eyebrow: "Knowledge point 7 · Compare DFS and backtracking",
    title: "Similar traversal does not mean identical state management",
    content: (
      <div className="search-comparison-table">
        <div><span>Criterion</span><strong>Depth-first graph search</strong><strong>Backtracking search</strong></div>
        <div><span>Primary record</span><p>OPEN frontier plus CLOSED explored set</p><p>Current path SL, alternatives NSL, dead ends DE, current state CS</p></div>
        <div><span>Recovery</span><p>Next state already waits on OPEN</p><p>Shrink current path to an ancestor with an alternative</p></div>
        <div><span>Pruning signal</span><p>Duplicate/explored-state test</p><p>Dead end or an unacceptable current path cost</p></div>
        <div><span>Shared limitation</span><p>Search order remains depth-oriented and can still require extensive exploration.</p><p>Being “informed” by dead ends does not remove worst-case brute force.</p></div>
      </div>
    ),
    note: "Use the source's distinction: backtracking can use current-path cost to abandon a branch, yet it remains based on extensive search.",
    sourceSlides: [33, 34, 35],
  },
  {
    eyebrow: "Course model · End-to-end problem solving",
    title: "Move deliberately from meaning to implementation",
    content: (
      <div className="problem-solving-pipeline">
        <article><span>1</span><h3>Problem</h3><p>A real problem to be solved.</p></article>
        <i>→</i>
        <article><span>2</span><h3>State space</h3><p>Conceptual representation.</p></article>
        <i>→</i>
        <article><span>3</span><h3>Graph</h3><p>Symbolic representation.</p></article>
        <i>→</i>
        <article><span>4</span><h3>Data structures + algorithm</h3><p>Computer implementation.</p></article>
        <i>→</i>
        <article><span>5</span><h3>Solution</h3><p>A goal, path, or both.</p></article>
      </div>
    ),
    note: "Use this pipeline as the synthesis of both meetings. Ask where representation mistakes, algorithm mistakes, and evaluation mistakes occur.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Retrieval practice · Review questions",
    title: "Explain, trace, implement, and critique",
    content: <ReviewStudio />,
    note: "Use the tabs for team assignment. Each team answers one question with a diagram or trace and one with an implementation-level data-structure explanation.",
    sourceSlides: [37, 38, 39],
  },
  {
    eyebrow: "Most important points",
    title: "A correct search answer includes the representation and the process",
    content: (
      <div className="important-points-grid">
        {[
          "Explain state-space search as a general problem-solving strategy.",
          "Explain why graph theory supports state-space representation.",
          "Model a complex problem conceptually, symbolically, and computationally.",
          "Implement and trace DFS.",
          "Implement and trace BFS.",
          "Implement and trace backtracking.",
          "Explain why DFS and BFS are brute-force methods.",
          "Explain why backtracking remains search-intensive despite using dead-end information.",
        ].map((point, index) => (
          <article key={point}><span>{String(index + 1).padStart(2, "0")}</span><p>{point}</p></article>
        ))}
      </div>
    ),
    note: "Run this as a confidence inventory. Students mark each item: can explain, can trace, or can implement. Use the weakest item for final pair practice.",
    sourceSlides: [39, 40],
  },
  {
    eyebrow: "Exit assessment and readings",
    title: "Choose an algorithm only after stating the problem conditions",
    content: (
      <div className="search-exit">
        <article><span>Trace</span><h3>One expansion</h3><p>Show selected state, generated children, OPEN, CLOSED, and parent information.</p></article>
        <article><span>Compare</span><h3>DFS vs. BFS vs. UCS</h3><p>Name the selection rule and one conditional guarantee for each.</p></article>
        <article><span>Diagnose</span><h3>One failure mode</h3><p>Repair it with a bound, deepening, duplicate detection, or cost ordering.</p></article>
        <aside>
          <strong>References</strong>
          <p>George F. Luger, <em>Artificial Intelligence: Structures and Strategies for Complex Problem Solving</em>, 6th ed., Chapter 3.</p>
          <p>Russell and Norvig, <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed., Chapter 3.</p>
        </aside>
      </div>
    ),
    note: "Correct the author's name from the source reference typo. Preview Meeting 5: heuristic information changes which frontier state looks promising.",
    sourceSlides: [41],
  },
];

export function UninformedSearchDeck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      hoverEffects
      meetingLabel="Module 3 · Lesson 4"
      meetingTitle="Uninformed Graph Search"
      notesMode="key-points"
      slides={slides}
      sourceCollectionLabel="L02_StateSpaceSearch.pptx"
      sourceCollectionPath="l02-state-space"
      timingPlan={MEETING_04_TIMING}
    />
  );
}
