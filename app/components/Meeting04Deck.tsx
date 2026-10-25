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
    note: "Uninformed search decides which frontier state to expand without a heuristic estimate of closeness to a goal. The frontier contains generated states waiting for examination; a strategy is the rule that removes one waiting state next. Imagine exploring a dark building with a flashlight: the floor plan and legal doors exist, but the beam reveals only the next choices. The same state space produces different traces when DFS, BFS, or UCS organizes that frontier differently. Suppose OPEN contains B at depth two, C at depth one, and D at depth three. DFS selects D, BFS selects C, and UCS ignores depth unless the path costs make one entry cheapest. The state labels did not change; only the priority rule did. Uninformed does not mean stupid or random. The algorithm still uses a representation, successor function, goal test, and disciplined frontier policy. Uninformed means no heuristic h(n); it does not remove the successor function, goal test, or frontier discipline. Think of uninformed search as entering a museum after the lights fail. You still have the room map, the door rules, and a test for recognizing the exit; what you lack is an arrow saying warmer or colder. DFS, BFS, and UCS are therefore not guesses. They are disciplined ways to organize the same waiting list. The comedy begins only when someone calls a queue random because it refuses to read minds. Retrieve the Meeting 3 tuple and ask which component specifies legal moves, then identify what new choice a search strategy must make. Lesson 4 adds frontier policy, duplicate handling, goal timing, and path records to the state-space model.",
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
    note: "We will compare depth-first, breadth-first, bounded and iterative deepening, uniform-cost, and backtracking search. DFS chooses depth, BFS chooses a level, bounded search limits depth, UCS chooses accumulated cost, and backtracking exposes path recovery. Every strategy should face the same interview questions: complete, optimal, time-hungry, and memory-hungry. Algorithms dislike interviews, but students benefit. Completeness asks whether a solution will be found; optimality asks whether it is best; time and space measure different resources. Consider a delivery robot. A shallow equal-cost hallway map supports BFS, a massive deep warehouse under a memory cap may justify DFS, variable travel times require UCS, and an unknown shelf depth makes iterative deepening attractive. One application can demand different strategies after one condition changes. A strategy name alone is not an evaluation. Each guarantee depends on conditions such as finite branching, positive costs, or a reachable depth bound. Finite branching, step costs, depth bounds, duplicate policy, and memory turn those guarantees on or off. Treat the four evaluation questions like a job interview for algorithms. Completeness asks whether the candidate eventually finishes the assignment. Optimality asks whether the result is the best acceptable one. Time asks how much work accumulates, and space asks how much must remain on the desk at once. A charming acronym does not get hired; the problem conditions and guarantees do. Even algorithms need references, although theirs are usually asymptotic. Choose one strategy and predict its strongest advantage and most embarrassing failure before the formal comparison. Match shallow equal-cost goals to BFS, tight memory to DFS, unknown depth to deepening, and variable costs to UCS.",
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
    note: "A search algorithm normally generates the graph incrementally from the start state by applying legal operators. A real program starts with A and generates later nodes only by applying legal operators to removed states. On the shared tree, DFS and BFS see the same children but remove them in different orders. The difference lives in frontier management. DFS and BFS see the same children but place and remove them in different orders. Starting from A, the program applies the successor function to create B, C, and D. It does not allocate every descendant in the picture. When B is removed, only then are E and F generated. Incremental generation is why frontier management matters operationally. Do not confuse generated with examined. A goal sitting in OPEN has been discovered, but some algorithms guarantee success only when it is removed. Generated means waiting on OPEN; examined means removed, tested, and processed. Those events are not interchangeable. Incremental generation resembles building a city only as travelers reach each intersection. The planner does not pour concrete for every possible street before leaving home. It creates the start, applies legal operators, and materializes successors when their parent is examined. That saves work, but it also makes order consequential: a state that waits deep in OPEN has not yet donated its children to the graph. The visible tree is a teaching summary, not a preloaded warehouse inventory. Predict the first ten removals for DFS and BFS and circle where goal S is removed, not merely drawn on the page. Locate S in both removal orders and mark when it is removed under the stated goal-test policy.",
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
    note: "The two source snapshots show different moments, so labels and frontier contents must be read before visual comparison. Before comparing pictures, read the selected state, OPEN, CLOSED, and the event named by each label. DFS iteration six follows a deep branch, while the BFS image is specifically the state after expanding C. Context is part of the evidence. The BFS picture is after expanding C, not another iteration-six snapshot. Imagine comparing a photo taken after six DFS removals with a photo taken immediately after BFS expands C. Different OPEN contents are expected because both the algorithm and timestamp differ. Relabeling the pictures with the exact event prevents a false conclusion about which method expanded more nodes. A screenshot can look authoritative while answering a different question. This is the algorithmic version of comparing Tuesday's weather with Friday's umbrella. Visual similarity cannot normalize two different algorithmic moments; the event context is part of the evidence. A trace without an event label is like a laboratory photo without a timestamp. It may be perfectly sharp and still support the wrong conclusion. To compare DFS and BFS fairly, freeze both after the same kind of event: state removed, goal tested, children inserted, or expansion count completed. Then compare selected state, ordered OPEN, and CLOSED. Otherwise we are timing one runner at kilometer six and another after tying a shoe, then publishing a very confident sports report. State selected node, OPEN, and CLOSED for each image, then say which comparison is valid and which would be misleading. A fair comparison aligns expansion count, selected node, frontier order, explored set, and goal timing.",
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
    note: "Depth-first search removes the deepest available frontier state, examining descendants before returning to siblings. Deepest means greatest depth among waiting states, so descendants outrank older siblings. A stack or recursive call chain naturally supports this order. DFS packs light, like a hiker carrying one trail and a few remembered forks. Prepending children produces LIFO stack behavior and a narrow stored frontier. With OPEN equal to B, C, D, DFS removes B. If B generates E and F, prepending produces E, F, C, D. The next removal is E, then E's child if one exists. C waits even though it is shallower and was generated earlier. Low memory does not imply good answers. DFS can dive forever, loop, or return a long solution while a short one waits nearby waving politely. That memory advantage permits infinite descent, cycles, and a long first solution while a shallow goal waits elsewhere. DFS behaves like a spelunker who chooses one tunnel, keeps a compact rope back to the entrance, and postpones neighboring tunnels. This is why memory can remain modest: the active path and alternatives matter more than a whole breadth layer. The risk is equally physical. A tunnel may be extremely long, cyclic, or bottomless in the model. Courage is not completeness; without loop checks or a bound, the brave spelunker can become a permanent resident of the left branch. Name a problem with a deep solution and tight memory, then name one condition that would make DFS a dangerous choice. Use DFS when depth is plausible and memory is tight, not when shortest-path guarantees are required.",
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
    note: "The source algorithm removes the leftmost OPEN state, goal-tests it, generates children, and records examined states on CLOSED. OPEN begins with Start and CLOSED begins empty; the loop continues until OPEN is exhausted. Click to enlarge the pseudocode and follow one iteration: select X, test X, expand X, filter duplicates, and prepend survivors. Execute the enlarged lines in order: remove X, test X, generate children, close X, filter duplicates, and prepend survivors. Let OPEN be B, C, D. Removing B and generating E and F gives E, F, C, D after duplicate filtering. B moves to CLOSED. If E was already waiting on OPEN, it must not be inserted again. Parent records still remember which surviving child came from B. Without the OPEN and CLOSED duplicate test, a reversible action can create an endless ping-pong match between two states. Checking both OPEN and CLOSED prevents pending duplicates and repeated examination. Read the pseudocode as a state-transition contract. Removing X changes OPEN; goal testing may terminate; generating children invokes the successor function; moving X to CLOSED records examination; duplicate filtering protects the graph invariant; and left insertion creates stack behavior. Each line owns one effect. If an implementation produces the wrong trace, compare these effects one at a time. Debugging six responsibilities at once is like asking which ingredient ruined a soup after adding the pantry with a shovel. Explain why putting children on the left creates stack behavior and why parent pointers are still needed to return a path. Failure occurs only when OPEN is empty; returning a path additionally requires parent pointers.",
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
    note: "OPEN stores generated alternatives not yet examined, while CLOSED records states already removed and processed. The leftmost OPEN entry is always next; that invariant comes from prepending children. In the trace, newly generated descendants jump ahead of older siblings. The left edge of OPEN is therefore a live promise about the next removal. When B expands, E and F move ahead of older alternatives C and D. Read the transition from OPEN B, C, D and CLOSED A. After B expands, OPEN becomes E, F, C, D and CLOSED becomes B, A. The front changed because children were prepended; the history changed because B was examined; the path map changes because E and F point to B. OPEN and CLOSED do not automatically preserve the winning route. A giant explored list can still shrug when asked, how did we get here? OPEN and CLOSED describe search status, but parent pointers explain how the goal was reached. OPEN and CLOSED answer different temporal questions. OPEN says which generated states are still waiting; CLOSED says which states have already been examined. A parent table answers a third question: how did each surviving state first enter the search? Picture an airport with a departure board, a passport stamp, and a baggage claim tag. Mixing those records loses either pending work, duplicate protection, or the route home. One heroic list cannot safely perform every administrative job. Verify one row transition and specify the parent information required to reconstruct the solution path. Verify one row transition by accounting for the removal, new children, CLOSED update, and parents.",
    sourceSlides: [26],
  },
  {
    eyebrow: "Interactive demonstration · DFS",
    title: "Advance the frontier one state at a time",
    content: <FrontierTrace mode="dfs" />,
    note: "The DFS trace makes frontier order observable rather than leaving it as punctuation inside pseudocode. At iteration one, A is closed and B is the leftmost waiting state. Predict the next selected state, then click Next. Watch new children enter the left side of OPEN while CLOSED grows. After B expands, E and F are prepended before C and D, exposing stack behavior. Before clicking Next, cover the screen and predict all fields. At iteration two the selected state should be B, OPEN should begin with E and F, and CLOSED should begin with B. Revealing the state tests the entire update rule, not merely the next node label. If your prediction differs, diagnose the exact rule you used: queue behavior, stack behavior, or accidental alphabetical sorting. Choosing C would reveal queue reasoning; choosing alphabetically would invent a rule the algorithm never stated. The interactive trace is an instrument panel, not a slot machine. Before each click, predict the selected state, the exact ordered OPEN list, the CLOSED update, and any new parent links. Then one mismatch identifies one faulty rule. If only the next node is predicted, a broken duplicate check can hide for several iterations. Good tracing converts surprise into diagnosis. Bad tracing repeatedly clicks Next and hopes understanding will arrive by express shipping. Advance several iterations and explain why the current deepest branch wins over an older shallow alternative. Narrate the next update with remove, test, expand, and prepend.",
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
    note: "Breadth-first search removes the shallowest frontier state and examines every depth n state before depth n plus one. Shallowest means minimum depth from the initial state; every depth-n state precedes depth n plus one. A queue preserves arrival order. BFS is the friend who checks every room on one floor before charging upstairs. A FIFO queue keeps older frontier states ahead of newly generated children. For the same OPEN B, C, D, BFS removes B and appends E and F, producing C, D, E, F. C stays first because it entered before E and F. That simple queue invariant generates complete level order across the whole tree. Shallowest means cheapest only when step costs are equal. A one-edge private jet can cost more than a three-edge bus route. Finite branching gives completeness, and equal step costs make a shallowest goal minimum cost. BFS is the airport agent who boards passengers by zone: everyone in zone one goes before anyone in zone two, even if a zone-two passenger waves enthusiastically. FIFO order preserves that layer discipline because older shallow states remain ahead of newly generated deeper ones. This yields a shallowest-goal guarantee under finite branching. It does not magically minimize dollars, fuel, or danger; depth counts actions. A cheap six-step route can lose to an expensive five-step route unless costs are equal. State the finite-branching and equal-cost conditions behind BFS completeness and optimality. The exponential breadth frontier can still exhaust memory before the guarantee becomes useful.",
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
    note: "BFS shares initialization, goal testing, expansion, duplicate handling, and failure logic with DFS. Initialization, removal, testing, expansion, CLOSED, duplicate filtering, and failure match DFS. Enlarge the algorithm and locate the decisive line: remaining children go to the right end of OPEN instead of the left. Only the insertion end changes: surviving children join the right of OPEN. Compare two nearly identical lines: DFS places remaining children on the left; BFS places them on the right. With children E and F and older alternatives C and D, left insertion yields E, F, C, D, while right insertion yields C, D, E, F. Small code changes can produce enormous behavioral changes. One insertion end decides whether the search dives or spreads. That queue invariant—not the word queue by itself—explains level-order removal. The DFS and BFS procedures differ at a deceptively small hinge: which end receives the children. Imagine a cafeteria line. Place new arrivals at the front and the newest family dominates the next decision, producing stack-like depth. Place them at the rear and older customers retain priority, producing queue-like breadth. The rest of the restaurant can be identical. This is a useful software lesson: a one-line data-structure policy can change global behavior more dramatically than a page of decorative comments. Translate the insertion rule into a queue invariant and identify the oldest frontier state after one expansion. After B expands, C and D remain ahead of E and F because they arrived earlier.",
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
    note: "The BFS trace keeps all depth-one states ahead of newly generated depth-two states. B, C, and D enter at depth one, so all remain ahead of E and F at depth two. After B generates E and F, C and D remain in front because they entered OPEN earlier at a shallower level. C stays next after B expands because of arrival order, not alphabetical order. After A expands, the depth-one states B, C, D wait in that order. Expanding B appends depth-two states E and F. Even if E looks promising, BFS removes C next because C is older and shallower. The trace visualizes that invariant row by row. Testing a goal on generation versus removal can change timing and, under cost-sensitive search, can change whether a claim of optimality is justified. Testing a goal on generation versus removal changes the stopping event and can change an optimality argument. A BFS OPEN trace should look layered even when node names are distracting. Annotate every state with depth and check that the depths never decrease from left to right. Within one depth, parent expansion and child order break ties. If a depth-two node jumps ahead of an unexamined depth-one node, either children were inserted on the wrong end or the queue was reordered. Alphabetical sorting is especially sneaky: it looks tidy while quietly replacing the algorithm with office filing. Find the first row where every depth-one node is closed and explain what layer appears next. Find the first row where depth one is closed and identify the depth-two frontier order.",
    sourceSlides: [28],
  },
  {
    eyebrow: "Interactive demonstration · BFS",
    title: "Advance the queue one state at a time",
    content: <FrontierTrace mode="bfs" />,
    note: "The live BFS trace exposes queue behavior with the same graph used for DFS. After A expands, B is the oldest waiting state and therefore the next removal. Predict the next removal, click Next, and watch new children join the right side rather than cutting the line. Expanding B appends E and F, producing C, D, E, F rather than letting new children cut the line. Clicking three times should move CLOSED from A to B, A and then C, B, A, while new children accumulate at OPEN's right edge. If a new child appears at the left, the implementation has silently changed from queue behavior to stack behavior. If BFS were a grocery queue, DFS would be the shopper who opens a secret checkout inside every shopping cart. Efficient sometimes; socially alarming always. The next step moves C to CLOSED and appends G and H. Use the live trace to test conservation of information. One state leaves OPEN, that state enters CLOSED, legal novel children enter OPEN on the right, and each child receives a parent. Nothing should teleport between lists. If two children are generated but only one appears, ask whether the other was a duplicate before calling it missing. A trace is a small accounting ledger; unlike creative accounting, every state should have a documented reason for appearing or disappearing. Compare the current OPEN order with the DFS trace and identify the first point where their removals diverge. Compare this queue with the DFS trace and identify their first forced disagreement.",
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
    note: "In the eight-puzzle tree, BFS removal order finds a shallowest goal and parent pointers recover the move sequence. The puzzle numbers show removal order; BFS reaches a shallow goal only after earlier frontier entries. Enlarge the source tree and trace backward from the numbered goal through parents, then reverse that chain to obtain actions. Follow parent pointers backward from the goal, then reverse the chain to recover forward actions. In an eight-puzzle, moving a blank right and later left can recreate an earlier board. CLOSED detects the examined duplicate; OPEN detects a pending duplicate. Once the numbered goal is removed, following parent links backward yields the exact shortest move sequence under equal move costs. Different move sequences can reach the same board. Without duplicate detection, the frontier grows copies like a photocopier with trust issues. Reversible moves create duplicate boards, so graph search suppresses copies already on OPEN or CLOSED. The eight-puzzle makes duplicate detection unavoidable because moves are reversible. Slide the blank right and then left, and the board returns wearing no disguise at all. Tree search may treat that return as a new child and reproduce an infinite family reunion. Graph search checks OPEN and CLOSED, retaining the useful first or cheapest record according to policy. Parent pointers then compress the explored mess into one solution path. The search can be large; the submitted directions should not read like its autobiography. Point to a repeated arrangement and explain where graph search suppresses it without losing a shorter solution. Point to a repeated board and explain why shortest parent information must be retained.",
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
    note: "BFS purchases shallowest-solution guarantees with a potentially enormous frontier; DFS saves space while accepting depth risk. BFS orders by depth; DFS orders by active branch, changing both memory and first-solution behavior. For a shallow goal with branching factor ten, BFS may store a small civilization of nodes while DFS stores a narrow expedition. BFS may store a whole breadth layer, while DFS usually stores a path and alternatives. Take branching factor ten and a goal at depth six. BFS may retain hundreds of thousands of frontier nodes near the deepest layer. DFS may store only a path and alternatives, but could chase an unrelated branch far beyond depth six. The resource trade is concrete, not rhetorical. Neither strategy is universally superior. A table of pros and cons without problem conditions is a menu with no prices. BFS fits shallow equal-cost goals; DFS fits deep goals under tight memory but gives up optimality. Compare BFS and DFS as two packing styles. BFS rents a warehouse so every state in the current layer remains accessible; DFS carries a backpack containing the current path and nearby alternatives. The warehouse makes shallow discovery dependable but can bankrupt memory. The backpack travels lightly but may wander far from the nearest goal. Neither is morally superior. Asking which is better without branching factor, goal depth, memory budget, and cost structure is like comparing a canoe with a forklift using only color. Change one property such as goal depth, memory, or step cost and explain why your preferred strategy reverses. Change goal depth, branching, memory, or cost and explain why the recommendation changes.",
    sourceSlides: [30],
  },
  {
    eyebrow: "In-class practice · Select an algorithm",
    title: "Match the strategy to the guarantee that matters",
    content: <AlgorithmSelectionLab />,
    note: "Algorithm selection begins with the required guarantee and the known problem conditions, not personal loyalty to a favorite acronym. Case one favors BFS because shallowest depth equals minimum cost when every step costs the same. Reveal the shallow equal-cost case, then compare it with a deep memory-limited case, an unknown-depth case, and a variable-cost case. Case two favors DFS's narrow memory footprint while accepting a possibly nonshortest result. Case three demonstrates why a guessed bound is fragile. A limit of four misses a goal at depth five; a huge limit recreates DFS's descent risk. Iterative deepening systematically tries four, then five, paying repeated upper-level work to avoid both guesses. Choosing BFS because it feels thorough is not a technical justification. Thorough can be another word for out of memory. Case three favors iterative deepening because goal depth is unknown. Algorithm selection resembles medical triage: begin with the outcome that must be protected. If a shallowest equal-cost solution is required, BFS may justify its memory bill. If memory is strict and any solution is acceptable, DFS may be reasonable. Unknown depth favors iterative deepening; variable positive costs favor UCS. State the accepted risk explicitly. Choosing an algorithm because it was first in the lecture notes is not engineering; it is alphabetical destiny. For each case, name the accepted guarantee, the sacrificed guarantee, and the resource most likely to fail first. Case four requires UCS because total path cost, not depth, defines the best solution.",
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
    note: "Depth-limited DFS cuts off a path at a specified limit, while iterative deepening repeats DFS with successively larger limits. A cutoff says the chosen bound blocked deeper expansion; it does not prove that no deeper solution exists. Deepening repeats upper levels, but most nodes in a broad tree live near the bottom, so repeated shallow work can be surprisingly affordable. Iterative deepening runs complete bounded searches with limits zero, one, two, and onward. If the bound is two, a node at depth two is examined but its children are cut off. The result is cutoff, not ordinary failure. Iterative deepening reruns with bound three, allowing those children to enter the frontier without storing every earlier breadth layer simultaneously. A cutoff is not proof of failure. It means the chosen limit prevented this run from seeing farther, not that the goal does not exist. Most nodes in a broad tree lie near the deepest level, so repeating small upper levels can be affordable. A depth bound acts like an elevator whose buttons stop at floor five. Reaching floor five and finding no goal does not prove the building ends; it proves this elevator refuses the next floor. Iterative deepening repeatedly installs one more button. That sounds wasteful, yet broad trees concentrate most nodes near the bottom, so replaying the small lobby levels can cost less than storing an entire crowd. The distinction between cutoff and failure prevents the elevator from making architectural claims. Distinguish failure, cutoff, and success, then explain why iterative deepening can recover shallowest-goal behavior with DFS-like space. Space is roughly b times d while time remains exponential in solution depth.",
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
    note: "The depth-five source tree shows exactly which descendants bounded DFS can examine before retreating. The depth-five boundary hides every descendant below it, including a possible goal at depth six. The linked teaching animation contrasts green DFS with red iterative deepening; predict the repeated layers before watching. Green DFS follows a branch; red iterative deepening revisits upper layers before extending the limit. Suppose each state has four children and the shallowest goal is depth five. Most generated states live at depth five, so re-expanding depths zero through four adds relatively little compared with storing the entire breadth frontier. A narrow branching factor changes that calculation. A bound protects time and depth but can hide a valid goal at depth six with the confidence of a locked door pretending the hallway ends. Repeated shallow work can cost less than one disastrous descent when branching is broad and the goal is shallow. On the depth-five tree, mark every node with both its depth and its status: expanded, generated but cut off, or never reached. A node at the limit can be goal-tested while its children remain forbidden. This distinction matters in code because a cutoff must propagate differently from failure. If all branches fail within the bound, report failure; if at least one branch is truncated, report cutoff. Otherwise iterative deepening may stop early and confidently announce that floor six has been canceled. Ask when repeated shallow work costs less than one disastrous descent and connect the answer to branching factor and goal depth. Use branching factor and shallowest goal depth to justify that tradeoff.",
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
    note: "Uniform-cost search orders OPEN by accumulated path cost g(n), not by depth or generation time. UCS stores g(n), the accumulated path cost, and removes the frontier state with the smallest value. Reveal the priority-queue sequence: start at A zero, insert priced children, remove the cheapest frontier state, and update cheaper paths. Insert priced children, remove the cheapest entry, and update a state when a cheaper parent path is discovered. From A, imagine edges to B cost two, C cost five, and D cost one. UCS removes D first even if D is visually deeper. If a later route reaches C for cost three, the priority record for C must be decreased from five to three. The first generated goal need not be optimal. With positive costs, optimality arrives when the goal is removed as the minimum-cost frontier state. A generated goal can be expensive; positive costs make it optimal when removed as the cheapest frontier entry. UCS is a road-trip planner that watches toll receipts rather than counting intersections. A path with three roads can cost more than a path with six. The priority queue therefore orders states by accumulated g(n), and a cheaper rediscovery may update an existing entry. Positive lower-bounded costs matter because they prevent infinitely many almost-free detours before the goal. The first goal sign seen through the windshield is not enough; optimality arrives when the goal is the cheapest item removed from the queue. Connect UCS to BFS by setting every step cost equal and explain why cost layers then become depth layers. If every edge costs one, g(n) equals depth and UCS reproduces BFS layers.",
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
    note: "Completeness and optimality are conditional statements, so the conditions belong beside the checkmarks rather than in invisible footnotes. The table contains conditional claims, not unconditional badges. BFS needs finite branching; BFS and iterative deepening need equal costs for minimum cost; UCS needs costs bounded above zero. BFS needs finite branching and equal costs for its strongest guarantees; DFS promises neither in infinite depth. A depth limit l of five uses space proportional to b times l, but fails if the only goal is at six. UCS is optimal with positive costs, yet a tiny epsilon can still allow many low-cost expansions. The symbols describe growth patterns, not guaranteed wall-clock comfort. Big-O symbols are not decorative algebra confetti. They describe how branching factor, depth, maximum depth, or limit drives resource growth. A depth limit can hide a goal; deepening repairs that; UCS requires costs bounded by a positive epsilon. Read the guarantee matrix as a legal contract with the conditions printed at normal font size. Completeness and optimality are not personality traits that an algorithm carries everywhere. They are implications: if branching, depth, and costs satisfy stated assumptions, then the guarantee follows. Complexity symbols identify the variables driving growth, not a stopwatch prediction. Big O is a map of the storm system; it does not promise that Tuesday at three o'clock will merely be breezy. Compare one row at a time and name the assumption whose removal would invalidate its strongest guarantee. Read b as branching, d as shallowest goal depth, m as maximum depth, and l as the limit.",
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
    note: "Backtracking follows a current path until a goal, dead end, or unacceptable cost forces recovery to a recent alternative. Backtracking keeps a current path until a goal, dead end, or unacceptable cost forces recovery. Picture navigating a maze with breadcrumbs and a list of unopened doors. Dead ends are information, not personal criticism from the maze. Recovery selects the nearest ancestor with an untried alternative. In a maze, the current path may be A, B, F. If F is a dead end, record F, return logically to B, and try B's next unvisited alternative. If B has none, continue shrinking toward A. The saved alternatives decide where recovery stops. DFS already backtracks through OPEN. This list-based variant makes path, alternatives, and dead ends explicit, but that alone does not make it heuristic search. DFS also returns to alternatives, but this version exposes path, alternatives, dead ends, and optional cost rejection. Backtracking turns failure into routing information. The current path is a stack of commitments; alternatives are unopened doors attached to earlier commitments; dead ends record doors not worth reopening. When the current state fails, retract only far enough to reach the most recent viable alternative. This is more precise than restarting at the entrance and more disciplined than choosing a random door. The maze may judge our choices silently, but DE ensures it does not get to repeat the same joke. Identify the most recent state with an untried alternative and describe what information must survive when the path shrinks. Dead-end memory helps pruning but is not a heuristic estimate of remaining goal distance.",
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
    note: "The source algorithm names the state list SL, new-state list NSL, dead ends DE, and current state CS. SL is the current path and CS is its current state. Enlarge the pseudocode and watch one failure: place the failed state in DE, shrink SL, and select the next available alternative from NSL. NSL records available new states; DE records known dead ends. Suppose CS is F, SL is F, B, A, NSL contains F, B, C, D, A, and DE contains E, I, H. If F has no viable child, add F to DE, shrink SL, and choose the next alternative associated with the nearest surviving ancestor. Failing to exclude states already on SL can create a cycle inside the current path. That is less a search strategy and more a hamster wheel with variables. When CS has no viable child, shrink SL until an ancestor has an available alternative. The four records divide responsibilities. SL represents the active path, CS names its current endpoint, NSL preserves candidate alternatives, and DE remembers recognized dead ends. Test the invariant that CS agrees with the active end of SL after every update. When failure occurs, DE grows while SL contracts; NSL determines the next candidate. If all four lists change arbitrarily, the algorithm is not backtracking—it is a spreadsheet experiencing an emotional event. Explain each list in one sentence and predict how all four change when the current state has no viable child. Trace one failure by updating DE, shortening SL, selecting from NSL, and assigning CS.",
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
    note: "Ancestor information lets the algorithm recover logically without performing a physical reverse action in the represented world. Ancestor records encode logical recovery without requiring a physical reverse action in the represented world. In the trace, failed states enter DE, SL shrinks to a viable ancestor, and NSL supplies the next alternative. A failed state enters DE, SL contracts, and NSL supplies the next alternative. A delivery robot need not physically reverse every meter merely because the planning algorithm backtracks. The planner can retract a hypothetical route in memory, select another branch, and then send only the chosen forward route to the robot for execution. The data structure models recovery; the robot, theorem prover, or puzzle need not literally undo every real-world step. Search bookkeeping and external-world motion are therefore separate mechanisms. Logical recovery is different from physical reversal. A planner can erase a hypothetical suffix from SL in microseconds without commanding a robot to drive backward through the warehouse. Only the final chosen action sequence must be executed. This separation is common in AI: internal search explores possibilities that the external agent never performs. Confusing planning states with physical motion can multiply execution cost and produce a robot that appears thoughtful mainly because it keeps returning to the same shelf. Compare two adjacent rows and narrate the update using CS, SL, NSL, and DE in that order. Compare adjacent trace rows in the order CS, SL, NSL, and DE.",
    sourceSlides: [35],
  },
  {
    eyebrow: "Interactive demonstration · Backtracking",
    title: "Scrub through the source trace",
    content: <BacktrackingTrace />,
    note: "The slider turns the backtracking table into a sequence of visible state-management decisions. At iteration zero, CS and SL begin at A while DE is empty. Move to iteration three, predict the dead end, then scrub forward and watch SL contract while DE grows. By iteration three, the path has grown and alternatives remain recorded. Scrub from iteration three to five and watch two coupled changes: SL loses the failed suffix while DE gains those failed states. NSL preserves alternatives. The current state CS should always agree with the active end of the recovered path. A slider is not understanding by osmosis. Pause at each change and explain which condition in the algorithm fired. At iteration five, failed states appear in DE while SL shows the surviving path. While scrubbing the trace, treat SL and DE like coupled gauges. A failed suffix should leave the path and enter the dead-end record; the selected alternative should come from the nearest surviving ancestor with options. Pause at iterations three, five, and eight and narrate the exact cause of each change. The slider is useful because it exposes history. Dragging it rapidly back and forth without reading the lists is technically interaction, much as shaking a textbook is technically using gravity. Move across several iterations and identify the first recovery that selects an alternative from an ancestor. At iteration eight, identify the failed state, contracted ancestor, selected alternative, and DE update.",
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
    note: "Depth-first graph search uses OPEN and CLOSED, while the source backtracking method foregrounds SL, NSL, DE, and CS. Graph DFS centers OPEN and CLOSED; backtracking centers SL, NSL, DE, and CS. Both are depth-oriented, but recovery is represented differently: a waiting frontier versus an explicitly shrinking current path. DFS recovery selects a waiting OPEN state; backtracking explicitly shrinks the path. Both methods may visit A, B, F and then recover. Graph DFS already has C and D waiting in OPEN. The list-based backtracker instead shrinks SL and consults NSL. Similar traversal order does not imply identical records or recovery code. Calling backtracking informed because it remembers dead ends can overstate the claim. Remembering failure is useful, but worst-case brute force still attends the party. Their pruning signals are duplicate history versus dead ends or unacceptable cost. Graph DFS and explicit backtracking can share a depth-oriented visiting order while maintaining different bookkeeping. DFS leaves alternatives distributed across OPEN and prevents repeats through global history. The backtracking formulation foregrounds one current path, its local alternatives, and dead ends. Similar next states do not imply interchangeable code. Two kitchens can serve the same sandwich while one uses a ticket queue and the other relies on a chef remembering every table—a comparison that becomes exciting during lunch rush. Compare primary record, recovery mechanism, pruning signal, and shared limitation without pretending the methods are unrelated or identical. Both remain depth-oriented and can still require exponential exploration.",
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
    note: "The pipeline moves from a real problem to a state space, graph, data structures plus algorithm, and finally a state, path, or both. Begin with a real problem whose goals, constraints, observations, and legal actions are explicit. A delivery problem becomes variables and operators, then nodes and arcs, then queues, stacks, priority queues, hashes, and parent records. The state space is conceptual; the graph turns states into nodes and legal transitions into arcs. For route planning, the real problem specifies destinations and road rules. A state encodes location and relevant conditions. The graph turns legal moves into arcs. A priority queue and hash set implement the frontier and history. Parent pointers turn the goal into directions. An efficient algorithm cannot rescue a representation that erased information needed for legal or goal-directed action. Data structures store the graph, frontier, history, costs, and parents; the algorithm updates them. The five-stage pipeline protects meaning as the solution moves toward code. Real goals and constraints determine the state variables; legal actions determine arcs; data structures preserve frontier, history, cost, and parent information; the algorithm updates those records; the output returns the required goal or path. An error upstream survives every elegant optimization downstream. A priority queue cannot repair a state representation that forgot fuel, just as a faster oven cannot restore an ingredient omitted from the recipe. Locate one representation error, one implementation error, and one evaluation error along the five-stage pipeline. The solution may be a goal, a path, or both, so each stage must preserve needed information.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Retrieval practice · Review questions",
    title: "Explain, trace, implement, and critique",
    content: <ReviewStudio />,
    note: "Review should connect definitions to traces and data structures rather than reward isolated vocabulary recitation. The representation tab connects states, state spaces, graphs, operators, and data structures through one modeled problem. Use the tabs to move from representation questions to solution direction and then algorithms. Each group should draw, trace, and defend one answer. The direction tab distinguishes initial state, goal, path, forward search, and backward search. Answer the queue question operationally: after B expands, which list changes, where do its children enter, and which state leaves next? A correct answer ties the data structure to the visible trace. Saying only queue or stack is a label without a mechanism. Saying BFS uses a queue earns a start, not a parade. Explain which queue invariant produces level order and under which conditions that matters. The algorithms tab requires DFS, BFS, and backtracking mechanisms, invariants, benefits, and limitations. The review tabs ask for layered competence. Explanation states what a concept means; tracing predicts concrete state changes; implementation maps those changes to data structures; critique identifies assumptions and failure modes. Practice one weak layer directly. If queue behavior is unclear, write OPEN after each expansion. If guarantees are unclear, add the missing conditions. Re-reading the acronym ten times may create familiarity, but familiarity is the academic cousin of recognizing someone at a party and still not knowing their name. Choose the weakest review category and answer one conceptual question plus one implementation question without consulting the slide. Answer one weak item conceptually and then with a trace or implementation detail.",
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
    note: "A complete explanation names the state model, graph, operators, frontier rule, explored-state handling, goal timing, and returned solution. Outcomes one through three cover representation from state space to computational model. Trace and implementation skills must travel together: DFS, BFS, and backtracking are not understood if only their slogans survive. Outcomes four through six require implementing and tracing DFS, BFS, and backtracking. A student who can define BFS but cannot predict OPEN after one expansion has not yet met the trace outcome. A student who can trace but cannot store parents has not yet met the implementation outcome. The grid separates those competencies so practice can target the gap. Brute force is not an insult. It is a warning that systematic exploration may still grow explosively without stronger problem knowledge. DFS and BFS are brute force because neither uses an h(n) estimate of remaining goal distance. Use the outcomes as preflight checks. Can you model the problem, define operators, choose data structures, trace DFS and BFS, implement parent recovery, and diagnose backtracking failure? A yes should be supported by an example or trace, not optimistic weather. The outcomes connect representation to process because search errors often masquerade: a bad state model looks like an algorithm bug, and a missing parent table looks like a successful search that forgot why it came. Mark each outcome can explain, can trace, or can implement, then select one weak item for deliberate practice. Dead-end information helps backtracking, but worst-case growth can remain exponential.",
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
    note: "The exit task requires one expansion trace, a conditional comparison of DFS, BFS, and UCS, and a repaired failure mode. The trace must show selection, children, ordered OPEN, CLOSED, goal timing, and parent information. A defensible answer states branching, costs, expected depth, memory limits, duplicate policy, and when the goal test occurs. The comparison must pair each selection rule with a conditional guarantee. If search loops between two states, add duplicate detection. If DFS descends forever, add a bound or deepening. If BFS exhausts memory, reconsider representation or strategy. If a shallow path is expensive, use cost ordering. Each repair addresses a different diagnosed cause. The algorithm name is the conclusion, not the opening guess. Otherwise strategy selection becomes horoscope reading for data structures. Diagnose one cycle, depth, memory, hidden-goal, or cost failure and choose the matching repair. The exit task is a mechanic's diagnosis, not an algorithm popularity poll. A loop suggests duplicate handling; unbounded descent suggests a limit or deepening; memory explosion suggests breadth pressure; a cheap deeper path suggests cost ordering. Name the failure, identify the violated condition, and choose the smallest repair that addresses it. Installing UCS because the search engine made a strange noise is like replacing a car's transmission because the cup holder squeaks—expensive, impressive, and unrelated. Complete the exit ticket and preview Meeting 5: heuristics add problem-specific estimates to decide which frontier state looks promising. Problem conditions come before the algorithm name; heuristics in Lesson 5 add estimates, not permission to skip modeling.",
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
