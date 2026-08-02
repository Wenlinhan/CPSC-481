"use client";

import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  PuzzleMoveDemo,
  SearchCallout,
  SearchDirectionPractice,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const MEETING_03_TIMING = [2, 2, 2, 3, 3, 2, 4, 2, 2, 2, 2, 3, 2, 3, 2, 3, 4, 3, 3, 3, 3, 3, 2, 2, 3, 6, 4] as const;

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 3 · Lesson 3",
    title: "State-Space Search for Problem Solving",
    subtitle: "From a real problem to states, operators, graphs, and a searchable solution space",
    content: (
      <div className="search-hero">
        <section>
          <span>AI as knowledge representation and search</span>
          <h3>How can one general framework describe chess, navigation, purchasing, and autonomous driving?</h3>
          <p>Represent what matters, define legal transitions, identify a goal, and search.</p>
        </section>
        <SearchSourceImage
          alt="A state space with one initial state and several goal states"
          file="state-space-initial-goals.png"
        />
      </div>
    ),
    note: "Begin with the generality question. Ask students to name a problem they solve as a sequence of intermediate states. Source reading: Luger, 6e, Chapter 3.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Meeting map",
    title: "Six connected knowledge points",
    content: (
      <div className="search-objectives">
        {[
          ["01", "State", "Represent one problem-solving step."],
          ["02", "State space", "Describe all possible states and transitions."],
          ["03", "Representation", "Balance expressiveness with computational efficiency."],
          ["04", "Graph", "Encode nodes, arcs, paths, trees, and AND/OR structure."],
          ["05", "Solution", "Recognize a goal state, a path, or both."],
          ["06", "Direction", "Choose data-driven or goal-driven search."],
        ].map(([number, title, detail]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    ),
    note: "Use these as observable outcomes. Students should formulate and defend a state-space model by the end of the meeting.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Knowledge point 1 · General problem solving",
    title: "Do we need thousands of algorithms—or a few general methods?",
    content: (
      <div className="search-driving-question">
        <section>
          <span>Think–pair–share</span>
          <h3>Is there a general-purpose process or framework for solving many types of problems?</h3>
          <p>Compare a driverless car, playing chess, finding the cheapest car, and buying a ticket.</p>
        </section>
        <div>
          {["Driverless car", "Playing chess", "Finding the cheapest car", "Buying a ticket"].map((item, index) => (
            <article key={item}><span>0{index + 1}</span><strong>{item}</strong><small>What changes from one step to the next?</small></article>
          ))}
        </div>
      </div>
    ),
    note: "Give students one minute to identify states, available actions, and a success condition for one case. Do not define the formal vocabulary yet.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Knowledge point 1 · Human problem solving",
    title: "A difficult problem becomes a sequence of meaningful states",
    content: (
      <div className="search-process-layout">
        <ol>
          <li><span>1</span><div><strong>Understand the problem</strong><p>Identify the solution or goal, constraints, and relevant states.</p></div></li>
          <li><span>2</span><div><strong>Define each step or status</strong><p>A state contains the information and available methods needed at that point.</p></div></li>
          <li><span>3</span><div><strong>Move between states</strong><p>Use available information and methods to produce a next state.</p></div></li>
          <li><span>4</span><div><strong>Recognize success</strong><p>Find a state—or a sequence of states—that satisfies the goal.</p></div></li>
        </ol>
        <SearchCallout label="Source examples" tone="cyan">
          Playing chess, tic-tac-toe, the 8-puzzle, navigating a maze, purchasing a ticket, and autonomous driving.
        </SearchCallout>
      </div>
    ),
    note: "Connect 'state' to the familiar object-oriented idea of an object's status and available operations, while emphasizing that a search state must support problem solving.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Knowledge point 1 · Exact definitions",
    title: "State, state space, and search are different objects",
    content: (
      <div className="definition-stack">
        <article><span>State</span><h3>A representation for a problem-solving step</h3><p>It involves the available information and methods and captures the essential features needed by a problem-solving procedure.</p></article>
        <article><span>State space</span><h3>All possible states of the problem</h3><p>It defines the domain in which a solution may be found.</p></article>
        <article><span>Search</span><h3>A navigation method in the state space</h3><p>It selects and generates states until a solution is found or the search fails.</p></article>
        <SearchCallout label="Historical framing">
          Early AI often treated intelligence as a problem of state representation and search. State-space search was proposed as a general strategy for difficult problems without direct algorithmic solutions.
        </SearchCallout>
      </div>
    ),
    note: "Require students to distinguish the representation, the set of possibilities, and the navigation procedure. Source reading: Luger, 6e, Chapter 3.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Knowledge point 2 · Representation",
    title: "A useful representation balances expressiveness and efficiency",
    content: (
      <div className="representation-layers">
        <section>
          <div><span>Expressiveness</span><strong>Can the representation capture what matters?</strong></div>
          <i />
          <div><span>Efficiency</span><strong>Can the system search, read, write, and update it affordably?</strong></div>
        </section>
        <ol>
          <li><span>01</span><div><strong>Conceptual or mental</strong><p>State: the meaningful status of the problem.</p></div></li>
          <li><span>02</span><div><strong>Symbolic</strong><p>Graph: nodes and arcs that encode states and transitions.</p></div></li>
          <li><span>03</span><div><strong>Computer representation</strong><p>Variables, arrays, records, objects, tables, lists, trees, queues, and other data structures.</p></div></li>
        </ol>
      </div>
    ),
    note: "Ask what information an autonomous-driving state could omit without harming route planning, and what it cannot omit without causing unsafe decisions.",
    sourceSlides: [6],
  },
  {
    eyebrow: "In-class practice · Formulate before searching",
    title: "Which details belong in the state?",
    content: (
      <div className="formulation-studio">
        <section><span>Case</span><h3>Buy the least expensive feasible airline ticket</h3><p>The traveler has dates, airports, a budget, baggage needs, and a latest arrival time.</p></section>
        <div>
          <article><span>Keep</span><p>Current itinerary, total cost, arrival time, constraints already violated, remaining choices.</p></article>
          <article><span>Question</span><p>Does seat color affect the goal? Does the airline logo? Does the browser-tab order?</p></article>
          <article><span>Produce</span><p>Write a state representation, two operators, one goal test, and one reason your representation is efficient enough.</p></article>
        </div>
      </div>
    ),
    note: "Students work individually for two minutes, then compare representations. Ask one pair to explain a detail they deliberately excluded.",
    sourceSlides: [3, 4, 5, 6],
  },
  {
    eyebrow: "Knowledge point 3 · Abstraction",
    title: "The Königsberg problem begins as a city, islands, and bridges",
    subtitle: "Is there a walk that crosses every bridge exactly once?",
    content: (
      <div className="konigsberg-layout">
        <SearchSourceImage
          alt="Map of the city of Königsberg with two islands and seven numbered bridges"
          caption="The physical problem: four land regions connected by seven bridges."
          file="konigsberg-bridges-map.png"
        />
        <section>
          <span>Challenge</span>
          <h3>Trace a route—or explain why no route exists.</h3>
          <p>Which geographic details affect the crossing problem? Which can be discarded?</p>
          <SearchCallout label="Abstraction move" tone="amber">
            Replace each land region with a node and each bridge with an arc. The geometry disappears; connectivity remains.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Let students attempt routes before showing the graph. Euler's key move was not faster trial-and-error; it was a better representation.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Knowledge point 3 · Graph theory",
    title: "The graph exposes the invariant that the map hides",
    content: (
      <div className="konigsberg-layout reverse">
        <SearchSourceImage
          alt="Graph abstraction of the Königsberg bridge system with four nodes and seven labeled edges"
          caption="The same bridge system represented as a graph."
          file="konigsberg-bridges-graph.png"
        />
        <section>
          <span>Euler's result</span>
          <h3>In the connected part containing the edges, an Euler walk is possible only with zero or two odd-degree nodes.</h3>
          <p>Zero odd-degree nodes permits a closed circuit; two permits different start and end nodes. Königsberg has four, so the requested walk is impossible.</p>
          <SearchCallout label="AI connection" tone="green">
            Many real-world problems become tractable only after an abstraction reveals the structure that search must preserve.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Have students count each node's degree from the exact graph. Emphasize that graph theory proves impossibility without enumerating all walks.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Knowledge point 3 · Graph vocabulary",
    title: "A graph is a set of nodes plus a set of arcs",
    content: (
      <div className="source-definition-layout">
        <SearchSourceImage
          alt="Textbook definition of graph, nodes, arcs, directed graph, root, leaf, path, cycle, and tree"
          caption="Source definition page; enlarge to inspect the exact terminology."
          className="definition-figure"
          file="graph-definition.png"
        />
        <section>
          <article><span>Nodes</span><p>A set N₁, N₂, … that need not be finite.</p></article>
          <article><span>Arcs</span><p>Ordered pairs (Nᵢ, Nⱼ) connecting nodes; direction matters unless the paired reverse arc is also present.</p></article>
          <article><span>Directed graph</span><p>Every arc has a unique direction; Nᵢ is the parent and Nⱼ the child of arc (Nᵢ, Nⱼ).</p></article>
          <article><span>Root</span><p>A unique node with no parent from which all paths in the graph originate.</p></article>
        </section>
      </div>
    ),
    note: "Use the source definition as a primary figure and the adjacent transcription for readability and accessibility.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Knowledge point 3 · Directed paths",
    title: "A path must follow successive directed arcs",
    content: (
      <div className="directed-graph-layout">
        <SearchSourceImage
          alt="A directed graph with nodes a through e and explicit arc set"
          caption="Nodes = {a,b,c,d,e}; arcs are the ordered pairs printed below the graph."
          file="directed-graph-example.png"
        />
        <section>
          <h3>Path example: (a, b, c, d)</h3>
          <p>A path is an ordered sequence of nodes where each consecutive pair is connected by an arc in the required direction.</p>
          <ul>
            <li>A repeated node creates a loop.</li>
            <li>A path without repeated nodes is a simple path.</li>
            <li>Direction can make a visually connected route invalid.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Ask whether (d, a, b, c) is a valid path and require students to verify every ordered pair against the printed arc set.",
    sourceSlides: [9, 10],
  },
  {
    eyebrow: "Knowledge point 3 · Trees",
    title: "A tree is a rooted graph with one unique path to every node",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Rooted tree with root a, children b c d, and descendants e through j"
          caption="A rooted family-style tree: each non-root node has one parent."
          file="rooted-tree-example.png"
        />
        <section>
          <span>Tree properties</span>
          <h3>Root · parent · child · leaf · ancestor · descendant</h3>
          <ul>
            <li>The root has no parent.</li>
            <li>A leaf has no children.</li>
            <li>Every node is reached from the root by one unique path.</li>
            <li>A tree therefore contains no cycle.</li>
          </ul>
          <details className="mini-search-check">
            <summary>Check: Which observation proves this is not a tree?</summary>
            <p>A node with two distinct paths from the root violates the unique-path property.</p>
          </details>
        </section>
      </div>
    ),
    note: "Connect the unique-parent property to search trees while warning that the underlying state graph may contain repeated states and cycles.",
    sourceSlides: [9, 11],
  },
  {
    eyebrow: "Knowledge point 3 · AND/OR structure",
    title: "Some problems decompose; others offer alternatives",
    content: (
      <div className="and-or-layout">
        <article>
          <SearchSourceImage alt="AND graph with q and r jointly supporting p" file="and-graph.png" />
          <span>AND</span><h3>(q ∧ r) → p</h3>
          <p>Both q and r are subproblems that must be solved.</p>
        </article>
        <article>
          <SearchSourceImage alt="OR graph with q or r alternatively supporting p" file="or-graph.png" />
          <span>OR</span><h3>(q ∨ r) → p</h3>
          <p>q and r are alternative solution paths; either can support p.</p>
        </article>
        <SearchCallout label="Relationship encoded by the edge">
          The arrow can represent an IF–THEN rule, implication, or dependency. AND/OR graphs can therefore be expressed in logic.
        </SearchCallout>
      </div>
    ),
    note: "Ask students to model 'graduate requires passing both required courses' and 'enter the building through either door' as AND or OR structures.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Knowledge point 4 · Formal state space",
    title: "A state space can be specified as ⟨N, A, S, GD⟩",
    content: (
      <div className="source-definition-layout">
        <SearchSourceImage
          alt="Formal state-space-search definition with N A S GD and solution path"
          caption="The source four-tuple and its path and cost qualifications."
          className="definition-figure"
          file="state-space-definition.png"
        />
        <section className="tuple-grid">
          <article><span>N</span><p>Nodes or states in the problem-solving process.</p></article>
          <article><span>A</span><p>Arcs or links corresponding to problem-solving steps.</p></article>
          <article><span>S</span><p>A nonempty subset of N containing the start state or states.</p></article>
          <article><span>GD</span><p>A nonempty subset of N containing the goal state or states.</p></article>
        </section>
      </div>
    ),
    note: "Preserve the source notation N, A, S, GD. Ask students to explain why S and GD are sets rather than necessarily single nodes.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Knowledge point 4 · What counts as a solution?",
    title: "Search may return a state, a path, or both",
    content: (
      <div className="solution-types">
        <article><span>Goal state</span><h3>The state contains the solution</h3><p>Example: a theorem-proving state in which the theorem has been established.</p></article>
        <article><span>Path</span><h3>The sequence itself is the solution</h3><p>Example: a shortest route from an initial location to a destination.</p></article>
        <article><span>Both</span><h3>The destination and how it was reached matter</h3><p>A goal can have a measurable property while the path carries transition cost.</p></article>
        <SearchCallout label="Search space and complexity" tone="amber">
          The state space also estimates problem complexity: chess, for example, contains the space of all legal move sequences, not only one played game.
        </SearchCallout>
      </div>
    ),
    note: "Use a password-recovery problem versus route planning to contrast a goal-state answer with a path answer.",
    sourceSlides: [13, 17],
  },
  {
    eyebrow: "Worked example · 8-puzzle",
    title: "Move-blank operators generate a state-space graph",
    content: (
      <div className="puzzle-source-layout">
        <SearchSourceImage
          alt="8-puzzle state graph generated by up left down and right moves of the blank"
          caption="One state and its legal successors in the original 8-puzzle figure."
          file="eight-puzzle-state-graph.png"
        />
        <section>
          <h3>Identify the four-tuple</h3>
          <ul>
            <li><strong>N:</strong> all reachable tile arrangements.</li>
            <li><strong>A:</strong> legal blank moves Up, Left, Down, Right.</li>
            <li><strong>S:</strong> the given initial arrangement.</li>
            <li><strong>GD:</strong> the target arrangement or arrangements.</li>
          </ul>
          <p>What data structure should store a state? How should duplicate arrangements be detected?</p>
        </section>
      </div>
    ),
    note: "Point to one arc at a time and ask which operator created it. Distinguish the conceptual graph from the data structure used to implement it.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Interactive demonstration · Successor function",
    title: "One state plus one operator produces one successor",
    content: <PuzzleMoveDemo />,
    note: "Students predict each successor before clicking. Ask what happens if an operator is attempted when the blank is already on the boundary.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Worked example · Traveling salesperson",
    title: "A valid tour is not necessarily an optimal tour",
    content: (
      <div className="tsp-layout">
        <SearchSourceImage
          alt="Weighted graph with cities A through E for a traveling salesperson problem"
          caption="Goal: visit every city and return to the starting city with minimum total distance."
          file="traveling-salesperson-graph.png"
        />
        <section>
          <span>Source tour</span>
          <h3>A → D → C → B → E → A</h3>
          <strong>450 miles</strong>
          <p>The sequence is a complete tour. The remaining question is whether any other tour costs less.</p>
          <SearchCallout label="Two tests" tone="cyan">
            Feasibility asks whether every required city is visited and the route returns. Optimality compares the tour's cost with all competing feasible tours.
          </SearchCallout>
          <SearchCallout label="Resolve the source question" tone="green">
            A → B → C → D → E → A costs 100 + 50 + 100 + 50 + 75 = <strong>375 miles</strong>, so the 450-mile tour is not optimal.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Have students recompute the 450-mile cost directly from the labeled graph before discussing optimality.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Formative assessment · Representation and cost",
    title: "What must the TSP state remember?",
    content: (
      <SearchQuickCheck
        correct={2}
        explanation="The future legal actions and the cost of a complete tour depend on both the current city and which cities have already been visited. The accumulated cost is needed for cost-sensitive search."
        options={[
          "Only the current city",
          "Only the total distance traveled",
          "Current city, visited-city set, and accumulated cost",
          "The visual coordinates of every city on the slide",
        ]}
        question="Which state representation is sufficient for searching complete minimum-cost tours?"
      />
    ),
    note: "Ask a student to construct two partial tours ending at the same city but having different visited sets, showing why current city alone is insufficient.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Knowledge point 4 · Finite-state machines",
    title: "An FSM is a finite set of states plus inputs and a transition function",
    content: (
      <div className="fsm-layout">
        <SearchSourceImage
          alt="Formal finite-state-machine definition using S I and transition function F"
          caption="FSM = (S, I, F), with F mapping a state and input to a next state."
          file="finite-state-machine-definition.png"
        />
        <SearchSourceImage
          alt="Two-state flip-flop graph and its transition matrix"
          caption="The same finite behavior in visual and compact matrix representations."
          file="flip-flop-fsm.png"
        />
      </div>
    ),
    note: "Compare a finite-state machine with a general search space: an FSM specifies transition behavior, while search additionally selects paths toward goals.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Knowledge point 4 · State charts",
    title: "Events, conditions, and actions make transitions interpretable",
    content: (
      <div className="atm-layout">
        <SearchSourceImage
          alt="ATM state chart with off idle and serving customer states"
          caption="A state chart for an ATM session."
          file="atm-state-chart.png"
        />
        <section>
          <h3>State chart or finite-state machine?</h3>
          <p>Both describe states and transitions. State charts emphasize named events, guards, and actions in a readable system model; an FSM is the formal transition structure.</p>
          <SearchCallout label="Natural-language example" tone="amber">
            A finite-state model can represent permitted word sequences such as “I was …” or “I am …” while rejecting sequences such as “I are.”
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Ask students to identify the event that moves the ATM from IDLE to SERVING CUSTOMER and the event that returns it to IDLE.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Knowledge point 5 · Search direction",
    title: "A problem space can be explored from facts or from a goal",
    content: (
      <div className="direction-overview">
        <article><span>Data-driven / forward</span><h3>Facts → consequences → goal</h3><p>Apply rules to the knowledge and constraints available in each state until a solution is produced.</p></article>
        <article><span>Goal-driven / backward</span><h3>Goal → required conditions → facts</h3><p>Ask which rules could produce the goal; their conditions become new subgoals until known facts are reached.</p></article>
        <SearchCallout label="Same problem space">
          The two directions explore the same conceptual space. Choose according to problem structure, estimated branching factor, complexity, and implementation difficulty.
        </SearchCallout>
      </div>
    ),
    note: "Use one implication rule to demonstrate forward chaining from premises and backward chaining from its conclusion.",
    sourceSlides: [17, 18],
  },
  {
    eyebrow: "Knowledge point 5 · Data-driven search",
    title: "Forward search is strong when facts are available and goals are numerous",
    content: (
      <div className="criteria-layout">
        <section><span>Prefer data-driven search when…</span>
          <ol>
            <li>All or most data are given in the initial problem statement.</li>
            <li>Interpretation starts from measurements and seeks a high-level explanation.</li>
            <li>Many goals are possible, but only a few rules use the facts in this instance.</li>
            <li>A goal or hypothesis is difficult to formulate in advance.</li>
          </ol>
        </section>
        <div>
          <article><strong>PROSPECTOR</strong><p>Interprets geological data to locate mineral deposits.</p></article>
          <article><strong>DENDRAL</strong><p>Infers candidate organic molecular structures from formula and mass data.</p></article>
        </div>
      </div>
    ),
    note: "Preserve the expert-system examples as historical evidence of data-driven reasoning. Ask what the initial facts and possible conclusions are in each case.",
    sourceSlides: [18, 19],
  },
  {
    eyebrow: "Knowledge point 5 · Goal-driven search",
    title: "Backward search is strong when the hypothesis is known",
    content: (
      <div className="criteria-layout">
        <section><span>Prefer goal-driven search when…</span>
          <ol>
            <li>The goal is known or easily formulated.</li>
            <li>The system must find causes after an event has occurred.</li>
            <li>Evidence must be acquired selectively rather than given in advance.</li>
            <li>Many rules match the current facts and would otherwise create too many conclusions.</li>
          </ol>
        </section>
        <div>
          <article><strong>Theorem proving</strong><p>The theorem is the goal; required premises become subgoals.</p></article>
          <article><strong>Medical diagnosis</strong><p>A doctor orders only tests needed to confirm or deny a hypothesis.</p></article>
          <article><strong>Genealogy claim</strong><p>Work backward from “I am a descendant of Thomas Jefferson” through required parent-child links.</p></article>
        </div>
      </div>
    ),
    note: "Ask which goal-driven case requires acquiring new data and which can operate entirely over an existing knowledge base.",
    sourceSlides: [18, 20],
  },
  {
    eyebrow: "In-class practice · Choose a direction",
    title: "Problem properties—not personal preference—select the direction",
    content: <SearchDirectionPractice />,
    note: "Teams classify all four cases, then change one condition so the opposite direction becomes reasonable.",
    sourceSlides: [18, 19, 20],
  },
  {
    eyebrow: "Integration studio · Build the model",
    title: "Formulate a campus delivery robot as state-space search",
    content: (
      <div className="integration-workshop">
        <section><span>Scenario</span><h3>Deliver a package from the library to the engineering building</h3><p>Walkways may be blocked; battery use and lateness carry costs.</p></section>
        <ol>
          <li><strong>Conceptual</strong><p>Define what one meaningful state must contain.</p></li>
          <li><strong>Symbolic</strong><p>Draw nodes, directed arcs, costs, start set S, and goal set GD.</p></li>
          <li><strong>Computational</strong><p>Choose data structures for a state, graph, frontier, explored states, and parent links.</p></li>
          <li><strong>Evaluation</strong><p>Explain whether success is a goal state, a path, or both.</p></li>
        </ol>
      </div>
    ),
    note: "Allocate six minutes. Require each team to state one abstraction choice that improves efficiency and one risk caused by omitting information.",
    sourceSlides: [3, 4, 5, 6, 13, 17],
  },
  {
    eyebrow: "Exit assessment",
    title: "Can you move from a real problem to a defensible search model?",
    content: (
      <div className="search-exit">
        <article><span>Explain</span><h3>State vs. state space vs. search</h3><p>Give one sentence for each and connect the three.</p></article>
        <article><span>Represent</span><h3>Write ⟨N, A, S, GD⟩</h3><p>Use a problem not shown in class.</p></article>
        <article><span>Reason</span><h3>Choose a direction</h3><p>Use the data, goals, branching factor, and evidence-acquisition needs.</p></article>
        <aside><strong>Read before Meeting 4</strong><p>Luger, 6e, Chapter 3: graph search, DFS, BFS, depth bounds, and backtracking. Review queues, stacks, and graph traversal.</p></aside>
      </div>
    ),
    note: "Collect one state-space four-tuple and one direction justification from every student. Use common omissions to open Meeting 4.",
    sourceSlides: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
];

export function StateSpaceFoundationsDeck() {
  return (
    <SourceDeckShell
      hoverEffects
      meetingLabel="Module 3 · Lesson 3"
      meetingTitle="State-Space Search Foundations"
      slides={slides}
      sourceCollectionLabel="L02_StateSpaceSearch.pptx"
      sourceCollectionPath="l02-state-space"
      timingPlan={MEETING_03_TIMING}
    />
  );
}
