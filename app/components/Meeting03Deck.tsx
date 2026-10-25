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
    note: "State-space search gives us one language for problems that look very different on the surface. A chess position, a robot location, a ticket itinerary, and a puzzle arrangement can each be treated as a current state with legal ways to change it. To make a problem searchable, represent what matters in one state, define the operators that create successor states, identify where the search starts and what counts as a goal, and choose a method for exploring the resulting space. The quality of that representation determines what the search can see. A useful metaphor is a travel kit. The same suitcase can carry equipment for a beach trip, a conference, or a mountain hike, but the contents must change with the destination. State-space search is the suitcase: it gives us compartments named state, operator, start, goal, and cost. Chess pieces, road conditions, and ticket constraints are the contents. If we confuse the container with the contents, we may expect one algorithm to solve everything. If we ignore the container, every new problem looks unrelated. The productive middle ground is to reuse the framework while redesigning the representation. Here is a quick test: if you cannot say what changes from one moment to the next, you do not yet have operators; if you cannot say what success looks like, you do not yet have a goal test. Search should begin only after those two answers are clear.",
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
    note: "The first card is state: one meaningful snapshot in the problem-solving process. The second is state space: the collection of all states that can be reached, together with the transitions connecting them. One is a point; the other is the whole landscape. Representation asks what information a state must preserve and how that information will be encoded efficiently. Graph then supplies the symbolic structure: nodes represent states, while arcs represent permitted transitions. The representation gives meaning to the graph. Solution tells us whether success is a goal state, a path, or both. Direction asks where reasoning should begin: from available facts moving forward, or from a known goal working backward. By the end, these six cards should form one model, not six isolated definitions. Imagine planning a route from campus to an airport. The state is your current location, time, and transportation status. The state space contains every reachable combination of location and time. Representation decides whether traffic, parking, and baggage belong in the state. A graph turns locations into nodes and travel actions into arcs. The solution may need both an airport arrival state and the route used to reach it. Direction asks whether we should expand forward from campus or work backward from the required check-in time. Notice how each card answers a different question. Removing one card creates a hole: a graph without a goal can wander forever, while a goal without legal transitions is merely a wish with good typography. This dependency is why the six ideas should be learned as a chain rather than as vocabulary flash cards.",
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
    note: "Consider a driverless car. Its state includes location, nearby traffic, speed, and route progress; its actions include steering, braking, and accelerating. In playing chess, the state is the board position and side to move; the actions are legal moves. When finding the cheapest feasible car, a state can record candidates examined, constraints satisfied, and current best price. When buying a ticket, a state may record itinerary choices, cost, baggage rules, and arrival time. The surface details change, but each case still needs a state, actions, constraints, and a success test. A general framework does not mean that one search algorithm is best for every task. It means we can ask the same formulation questions in every domain, then choose representations, costs, uncertainty models, and search strategies that fit the particular problem. Think of these four tasks as animals with the same skeleton but different organs. Every one has a current condition, legal changes, constraints, and a criterion for success. The driverless car has continuous sensor data and serious safety costs. Chess has crisp rules and a perfectly visible board. Car shopping involves incomplete information and preferences that may conflict. Ticket buying combines schedules, prices, and constraints that can change while we search. The shared skeleton lets us formulate each task, but the organs determine which search strategy survives. A chess-style exhaustive search would be a terrible driving instructor: the road will not politely pause while the car examines millions of futures. Conversely, a noisy probabilistic driving model is unnecessary for determining whether a bishop can move diagonally. Generality means transferring the questions, not pretending the answers are identical.",
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
    note: "First, understand the problem by identifying the goal, constraints, and relevant information. Second, define each step as a state containing exactly the information needed to decide what can happen next. Third, use an operator to move from the current state to a successor. Fourth, recognize success by applying a goal test. Sometimes the final state is the answer; sometimes the sequence of moves is the answer. Chess, the 8-puzzle, maze navigation, ticket purchasing, and autonomous driving all use this pattern. What changes is the information that defines a state and the operators that are legal—not the basic logic of moving through possibilities toward a goal. The four steps resemble cooking from a recipe. Understanding the problem is deciding what dish we are making and which dietary constraints matter. Defining the state is checking the kitchen now: what has been chopped, what is cooking, and what ingredients remain. Moving between states is applying an operation such as mix, heat, or wait. Recognizing success is not merely hearing the timer; it is checking whether the food is actually done. The metaphor also exposes a common mistake. If the state records only elapsed time but not oven temperature, the next decision may be wrong. If it records the color of every spoon, the representation is needlessly large. Good problem solving keeps information that changes the next legal or useful action. In AI, as in cooking, more data is not automatically more wisdom—sometimes it is just a very detailed inventory of spoons.",
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
    note: "A state is one representation of a problem-solving step. It must capture the essential features needed to choose and apply an operator. In chess that includes piece locations and whose turn it is; the color of the table is irrelevant. The state space is the domain of all possible states and transitions for the formulated problem. It includes states we may never visit during one run. A single played chess game is one path through the much larger chess state space. Search is the navigation procedure. It selects a state to examine, generates successors, checks goals, and continues until it finds a solution or establishes failure. State is the object, state space is the domain, and search is the process. Imagine a large hotel. One room is a state: it has a particular floor, occupancy, and set of available exits. The entire building, including every room and corridor, is the state space. A search procedure is the guide choosing which corridor to follow. These are related but not interchangeable. Painting one room does not change the number of rooms in the building; changing the representation of a state may not change the underlying problem, although it can change how efficiently we navigate it. A guide who repeatedly returns to the same rooms needs memory of visited states. A guide who knows the destination but not the corridors has a goal without a transition model. This hotel metaphor is especially useful when debugging. Ask whether the error is inside a state, in the modeled connections among states, or in the strategy selecting the next state. Those are three different repairs.",
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
    note: "Expressiveness asks whether the representation captures every distinction that can change a correct decision. Efficiency asks whether the system can store, compare, update, and search those representations affordably. Too little information makes different situations look identical; too much information makes search unnecessarily expensive. At the conceptual level, describe the meaningful status of the problem. At the symbolic level, represent states as nodes and transitions as arcs. At the computational level, choose concrete data structures such as records, arrays, tables, trees, queues, or hash sets. These levels should agree. If the conceptual model says battery charge changes which robot moves are legal, the symbolic state must include charge, and the program needs a field that stores it. Omitting it at any level changes the problem being solved. Representation is like packing for a trip. Forgetting a passport is a failure of expressiveness because the omitted fact can stop the journey. Packing the living-room sofa is a failure of efficiency because it consumes resources without helping. AI systems face the same tension. For a campus robot, location and battery charge may be essential; the serial number printed under a wheel probably is not. The symbolic graph should preserve exactly those distinctions, and the program must encode them in data structures that support fast comparison and update. A useful design question is this: could two situations with different correct actions receive the same representation? If yes, the representation is too coarse. A second question is: could two representations be merged without changing any future action or goal result? If yes, the model may be carrying unnecessary detail. The ideal state is not the most detailed state. It is the smallest state that remains decision-complete.",
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
    note: "The traveler wants the least expensive ticket that still satisfies dates, airports, baggage needs, budget, and latest arrival time. A state must preserve the choices and constraints that affect which itineraries remain feasible. Keep the current itinerary, total cost, arrival time, violated constraints, and remaining choices. Seat color, airline logo, and browser-tab order can be omitted unless the goal explicitly depends on them. Relevance is defined by future decisions and the goal test. A defensible answer names a state representation, at least two operators, a goal test, and one reason the representation is efficient enough. For example, an operator might add a flight segment; the goal test checks arrival, baggage, and budget constraints. Let us apply a three-question filter to the airline case. First, can this detail change which actions are legal? Baggage rules can eliminate a fare, so keep them. Second, can it change the goal test or cost? Arrival time and total price clearly can, so keep them. Third, is it already derivable from other stored information? If total cost can be recomputed cheaply from selected segments, storing both may be convenient but creates a consistency obligation. Now test browser-tab order. It changes neither legality, cost, nor success, so it should disappear from the state. Seat color is similar unless the traveler explicitly makes it a constraint. This is a subtle but important point: relevance does not live inside the data itself. Relevance comes from the problem definition. The same seat color can be irrelevant for cheapest travel and essential for a design-aesthetics task.",
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
    note: "The question is whether a walk can cross each of the seven bridges exactly once. The map contains roads, shorelines, shapes, and distances, but most of those details do not affect whether a crossing sequence exists. Replace each land region with a node and each bridge with an arc. Exact geometry disappears, but connectivity remains. This is the central move in representation: discard details that do not change the answer while preserving every relationship that does. Trying routes one by one searches individual walks. Euler instead changed the representation so a structural property could settle the question. A better model can turn a huge search into a short proof. A subway map is a classic abstraction. It distorts geographic distance and bends real rail lines into neat angles, yet it preserves station order and connectivity because those are what riders need. The Königsberg graph performs the same trick. It discards the shape of the riverbanks, the length of each bridge, and the appearance of the city. What remains is which land region each bridge connects. This is not a loss of truth; it is a choice about which truth matters for the question. If the problem changed to minimizing walking distance, the old abstraction would become insufficient and edge lengths would return. A good abstraction is therefore conditional. It is faithful for a stated purpose, not universally complete. The humorous version is that Euler solved the bridge puzzle by deleting almost the entire city—and, academically speaking, that was excellent urban planning.",
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
    note: "In the graph, each land region is a node, each bridge is an edge, and a node's degree is the number of incident bridges. Count them: all four nodes have odd degree. For a connected graph, a walk using every edge exactly once is possible only when zero or two nodes have odd degree. Zero allows a closed circuit. Two allow different start and end nodes. Königsberg has four odd-degree nodes, so the requested walk is impossible. We did not enumerate every possible route. The graph exposed an invariant—a property preserved across all attempted walks—and the invariant ruled them all out at once. Imagine entering a land region across one unused bridge. Unless that region is the endpoint of the entire walk, you must also leave across another unused bridge. Bridges at an intermediate node therefore pair up: one for entering and one for leaving. That pairing requires an even degree. Only the overall start and end are allowed to have an unpaired bridge, which explains why at most two nodes may have odd degree. If there are zero odd nodes, start and end can be the same. If there are two, one becomes the start and the other the end. Königsberg has four odd nodes, meaning four regions demand to be endpoints, but a single walk owns only two endpoints. The arithmetic is not merely a magic rule; it summarizes the enter-and-leave logic of every possible route.",
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
    note: "A graph consists of a set of nodes and a set of arcs. A node represents an object or state. An arc represents a relationship or permitted transition. In a directed graph, an arc is an ordered pair: the arc from node i to node j does not automatically permit travel from j back to i. A rooted graph has one distinguished root: a node with no parent from which the relevant paths originate. A tip, also called a leaf, is a node with no children. Root and leaf describe positions in a directed hierarchy, not the visual height of a dot on the page. A path is an ordered sequence of nodes in which every consecutive pair is connected by an arc in the required direction. A tree is a rooted graph with exactly one path from the root to every other node. That unique-path property gives every non-root node one parent and prevents cycles. Picture a family tree drawn with arrows from parent to child. People are nodes; arrows are arcs. Because the arrows have direction, parent to child does not imply child to parent. The oldest displayed ancestor can serve as the root. A person with no displayed children is a tip or leaf, even if that person is standing near the top of the screen after someone rotates the monitor. A path follows a valid chain of directed relationships. A tree adds the requirement that every non-root node has exactly one parent and exactly one path from the root. If a node has two parents in this abstract structure, or if arrows form a cycle that makes someone their own ancestor, it is not a tree. Real families can be complicated; mathematical trees are aggressively organized. These definitions give search algorithms precise promises about connectivity and uniqueness.",
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
    note: "A path is not merely a list of nearby-looking nodes. In the sequence a, b, c, d, verify that arc a to b exists, then b to c, then c to d. Every ordered pair must appear in the graph's arc set. If the graph contains a to b, that does not imply b to a. A route can look connected and still be invalid in the requested direction. A path with no repeated node is a simple path; repeating a node creates a loop within the walk. To test d, a, b, c, inspect d to a first. If that ordered arc is absent, reject the candidate immediately; later pairs cannot rescue it. Path validation is local: one missing required arc invalidates the whole sequence. A directed path should be read like a sentence whose word order matters. The words dog bites person and person bites dog use the same three words but describe very different news stories. Likewise, the nodes a, b, c may form a valid path while c, b, a does not, because reversing a sequence requires reverse arcs that may be absent. To validate a path, slide a two-node window across it: check a to b, then b to c, then c to d. The first missing ordered pair ends the test. A simple path forbids repeated nodes, which is useful because repetition often signals wasted motion or a cycle. However, some problems intentionally allow revisiting states. The definition tells us what the sequence is; the search specification tells us whether loops are allowed, penalized, or eliminated.",
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
    note: "A tree begins at a root with no parent. Each outgoing relationship connects a parent to a child. Every non-root node has exactly one parent, so there is exactly one route from the root to that node. A leaf has no children. Internal nodes can have children, but the unique-path rule still holds: every node is reached from the root in exactly one way. If two different root-to-node paths exist, the structure is not a tree. A cycle would let us leave a node and return to it, creating more than one root-to-node path. Therefore a tree contains no cycle. Search algorithms may build a tree of explored choices even when the underlying state graph contains cycles and repeated states. Think of folders in a carefully organized file system. The root folder has no parent, each subfolder has one parent, and a file has one unique address from the root. That unique address makes retrieval straightforward. If the same folder appeared under two parents without using a link, we would have two distinct routes to what claims to be one object, and the structure would no longer be a tree. Search trees exploit this clarity by recording one parent link for each generated node, allowing the final solution path to be reconstructed backward. But the underlying problem graph can be messier: the same puzzle arrangement may be reached through different move sequences. A search tree may therefore contain repeated representations of one graph state unless duplicate detection merges them. The tree is the history of exploration; the graph is the structure of the problem.",
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
    note: "In an AND graph, solving p requires solving both q and r. Think of graduation requiring two required courses: completing only one subproblem is insufficient. The outgoing branches represent joint obligations. In an OR graph, q and r are alternatives; either one can support p. Entering a building through the north door or the south door is an OR choice when either route reaches the same objective. An edge can encode a transition, implication, dependency, or rule. The graph becomes meaningful only when we state that semantics. AND and OR structure tells search whether it must assemble multiple subsolutions or select one alternative. Suppose the goal is serve dinner. One recipe requires both cook pasta and make sauce, so that branch is an AND relationship: finishing only the pasta produces a very minimalist meal. Another choice is serve pasta or order pizza, so those branches form an OR relationship: either complete alternative can satisfy the dinner goal. AND/OR graphs let search represent problems where solutions are not always single paths. An AND solution must collect a set of successful subtrees; an OR solution selects one successful alternative. This matters in planning, theorem proving, and diagnosis. To prove a conclusion, several premises may all be required. To explain a symptom, one of several causes may be sufficient. The edges look similar, but their logic changes what counts as a complete solution. Always label the relationship—otherwise the graph is just arrows having a meeting.",
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
    note: "N is the set of nodes or states in the problem-solving process. A is the set of arcs corresponding to legal problem-solving steps. Together they specify what situations exist and how one situation can lead to another. S is a nonempty subset of N containing the permitted start state or states. GD is a nonempty subset containing the goal states. They are sets because a problem may allow several starting conditions and several acceptable destinations. A solution is a path through arcs in A, beginning at a member of S and ending at a member of GD. If arcs carry costs, the task may require not just any solution path but one with minimum total cost. Treat the four-tuple as a contract between the problem designer and the search algorithm. N promises which states exist. A promises which transitions are legal. S states where the algorithm may begin, and GD states which destinations count as success. If any clause is vague, the algorithm must guess—and computers are exceptionally fast at making the same wrong guess millions of times. Consider a maze. N is the set of reachable cells, A connects neighboring open cells, S contains the entrance, and GD contains the exits. Add weighted terrain and A must also carry costs. Allow several entrances and S becomes a genuine set rather than a single item wrapped in mathematical decoration. The notation is compact, but each symbol should expand into an operational definition that a programmer could implement and a reviewer could test.",
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
    note: "Sometimes the goal state contains the answer. In theorem proving, the important result is a state in which the theorem has been established; the exact route may be secondary. Sometimes the sequence is the answer. In route planning, naming the destination is not enough; the system must return the roads or actions that carry us from the initial location to it. Often both matter: the destination must satisfy a property and the path has a cost, risk, or explanation. The full state space also indicates complexity; chess includes all legal move sequences, not merely the moves in one game. Imagine ordering a package for pickup. If the task is simply determine whether the package is ready, the answer is a goal state. If the task is guide a courier through a building, the answer must include a path. If the organization also audits time, energy, and restricted-area access, both the destination and the route matter. A useful metaphor is destination, directions, and receipt. The goal state is the destination; the path is the directions; accumulated costs are the receipt showing what the trip consumed. Different applications require different parts of that bundle. This distinction affects memory: returning a path requires parent links or another reconstruction method, while returning only a goal state may not. It also affects evaluation. Two searches can reach the same goal but produce paths of very different quality. Success is not always binary; sometimes the journey submits an expense report.",
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
    note: "Each reachable tile arrangement is a node. An arc is created by a legal Up, Left, Down, or Right move of the blank. Applying one operator changes only the blank and its neighboring tile; the other tiles stay fixed. N is all reachable arrangements. A is the set of legal blank moves. S contains the initial arrangement, and GD contains the target arrangement or arrangements. Notice that an operator may be legal in one state and illegal at a boundary in another. A program needs a compact encoding for the tiles, a successor function that tests move legality, and a way to detect arrangements already explored. Duplicate detection matters because different move sequences can return to the same arrangement. The displayed 8-puzzle picture shows only a tiny neighborhood around one arrangement. The full state-space graph contains every reachable arrangement and every legal move among them. This is like seeing one intersection on a city map and remembering that thousands of streets continue beyond the frame. Operators generate the graph lazily: the program does not need to draw every node before search begins. It can store the current frontier and create successors as needed. But cycles appear easily. Move the blank left and then right, and the puzzle returns to the same state with two actions spent and no wisdom gained. Duplicate detection prevents the algorithm from celebrating this round trip as a discovery. A canonical encoding—such as a fixed tile sequence—lets the explored set recognize identical arrangements quickly. Without it, the search can become an enthusiastic tourist repeatedly visiting the same souvenir shop.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Interactive demonstration · Successor function",
    title: "One state plus one operator produces one successor",
    content: <PuzzleMoveDemo />,
    note: "Begin with the displayed arrangement and locate the blank. Before applying Up, predict which tile will move into the blank and what the successor arrangement will be. The operator name describes movement of the blank, not movement of the numbered tile. After clicking Up, tile four moves down into the old blank and the blank moves to the top-center position. The new blank location changes which operators are available. A successor function therefore takes both a state and an operator, verifies the precondition, and returns exactly one next state when the operator is legal. Now click Left from the original displayed state. Tile seven moves right into the blank, and the blank moves to the middle-left boundary. That successor makes another constraint visible: Left is no longer legal from the new blank position. Explicit preconditions keep the state-space graph faithful to the puzzle rules. After clicking Down, tile eight moves up into the old blank and the blank moves to the bottom-center position. A successor function resembles a very strict vending machine. You provide a current state and choose an operator. If the operator's preconditions are satisfied, the machine returns one well-defined successor. If the move is illegal, it should return failure—not shake the board and invent a new puzzle. For the 8-puzzle, Up is legal only when the blank has a tile above it. The function swaps exactly those two positions and preserves every other tile. This local guarantee is powerful: search can trust that every generated arc leads to a legal state. It also makes testing systematic. For each boundary position, verify which moves are rejected; for each legal move, verify that applying its inverse restores the original state. Interactive prediction is not classroom decoration here. It rehearses the same contract that the code must satisfy. Finally, click Right. Tile six moves left into the old blank, leaving the blank at the middle-right boundary. We have now demonstrated all four controls. Each button applies one operator to the same original state, so the four displayed results are sibling successors rather than a four-step path. That distinction matters: comparing operators from one state is different from applying them sequentially.",
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
    note: "A traveling-salesperson tour is feasible when it visits every required city and returns to the starting city. The displayed route A to D to C to B to E to A satisfies that structural requirement and costs 450 miles. Optimality is a stronger claim: no competing feasible tour may cost less. The route A to B to C to D to E to A costs 375 miles, so it is a counterexample to the claim that the 450-mile route is optimal. A search that stops at the first complete tour solves feasibility. A search that guarantees the cheapest tour must compare costs systematically and justify that no unexplored alternative can be better. Those are different problem specifications. Suppose a restaurant claims its lunch special is the cheapest meal in town. You do not need to inspect every restaurant to disprove the claim; finding one cheaper meal is enough. The 375-mile tour plays the same role. It does not prove that 375 is globally optimal, but it proves that 450 is not. This separates three levels of evidence. A valid tour proves feasibility. Computing its edge sum proves that tour's cost. Finding a cheaper competitor disproves optimality of the first tour. Proving the best tour requires a search method or lower-bound argument showing that no remaining candidate can cost less. Optimization language should therefore be handled carefully. Better than one example is not the same as best among all examples. In everyday conversation those words blur; in algorithms they come with paperwork.",
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
    note: "Suppose two partial tours both end at city C, but one has visited A and B while the other has visited A and D. Their remaining legal obligations differ, so current city alone cannot distinguish the futures. Total distance alone also loses location and visitation history. Visual coordinates are unnecessary because the graph's edge costs already contain the travel information needed by search. The sufficient representation records current city, the set of visited cities, and accumulated cost. Current city determines outgoing choices, the visited set records remaining obligations, and accumulated cost supports cost-sensitive comparison and pruning. Think of a TSP state as a traveler carrying a passport. Current city tells us where the traveler stands. The visited-city set is the collection of passport stamps showing obligations already completed. Accumulated cost is the expense total. Two travelers can both stand in city C yet have different stamps and different expenses; they are not interchangeable states because their remaining legal tours differ. This is why the correct representation needs all three components. The visited set is often encoded as a bit mask, making membership tests and comparisons fast. Cost may be stored even though it can be recomputed, because search consults it repeatedly when ordering or pruning states. The design balances sufficiency and efficiency: enough history to predict the future, compressed into a form the algorithm can compare quickly. A passport without stamps is just a small blue notebook with confidence.",
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
    note: "A finite-state machine is a triple with a finite set of states S, a set of inputs I, and a transition function F. Given a current state and an input, F returns the next state. The flip-flop example can be represented as a directed graph or as a transition matrix. The graph makes the flow easy to see; the matrix makes every state-input lookup compact and explicit. Both encode the same behavior. An FSM specifies which transition follows each state-input pair. Search adds a goal and chooses among possible paths toward it. Describing legal behavior is not yet the same as deciding which behavior achieves an objective. A subway turnstile makes the FSM definition concrete. It may have two states: locked and unlocked. Inserting a valid coin while locked produces unlocked. Pushing while unlocked lets a person pass and returns the machine to locked. The transition function answers every state-input pair. What if someone pushes while locked? The machine remains locked, perhaps while producing a disappointed clunk. This example shows why the input matters as much as the current state. The same push causes different behavior depending on state. A transition table is excellent for checking completeness because every row and input column should contain a result. A graph is excellent for seeing cycles and reachability. Neither representation changes the machine; each supports a different question. If a specification leaves a cell blank, the physical turnstile will eventually discover that omission at rush hour.",
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
    note: "The ATM begins in an off or idle state. An event such as inserting a valid card can move it to serving customer. Completion, cancellation, or a timeout can return it to idle. The arrows encode when state changes occur. An event requests a transition. A guard condition decides whether it is allowed, and an action describes what happens during the transition. For example, card inserted is the event, card readable is a guard, and request PIN is an action. State charts emphasize human-readable events, guards, and actions; an FSM emphasizes the formal transition function. They are compatible views. Readable labels help only when their conditions are precise enough to test. A state-chart transition can be read as a structured sentence: when an event occurs, if a guard is true, perform an action and enter the next state. For an ATM: when a card is inserted, if the card is readable and the machine is online, request the PIN and enter authentication. Each part answers a different question. The event says what happened. The guard says whether the transition is permitted. The action says what the system does. The destination says what becomes true afterward. Mixing these roles creates ambiguous designs. For example, valid card is usually a guard, not an event; inserted card is the event. This grammar helps students critique diagrams and helps programmers derive tests. A state chart should behave less like interpretive dance and more like a sentence with testable clauses.",
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
    note: "Data-driven or forward search begins with facts. It applies rules whose premises match those facts, adds the consequences, and continues until a goal is produced or no useful rule remains. Goal-driven or backward search begins with a target claim. It asks which rule could produce that claim, turns the rule's premises into subgoals, and continues until those subgoals match known facts or fail. The two directions can explore the same conceptual problem space but generate very different amounts of work. Choose using the available data, number of possible goals, branching factor, evidence cost, and ease of stating a hypothesis. Imagine two detectives. The first empties every piece of evidence onto a table and asks what conclusions follow; that is forward reasoning. The second begins with a specific hypothesis and asks what evidence would have to exist; that is backward reasoning. Both can solve the same case, but their workloads differ. If the table contains a small set of strong facts and many possible conclusions, forward reasoning may be efficient. If one urgent hypothesis must be tested and acquiring evidence is expensive, backward reasoning can request only what matters. Neither detective is inherently smarter. One starts where information is abundant; the other starts where the question is precise. A poor choice creates unnecessary branching: either deriving hundreds of irrelevant facts or chasing many unsupported subgoals. Search direction is therefore about controlling work, not about whether the arrows look happier pointing right.",
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
    note: "Prefer forward search when most data are already given, interpretation begins from measurements, many conclusions are possible, or a precise goal is hard to formulate in advance. PROSPECTOR starts from geological observations and applies rules toward possible mineral-deposit interpretations. The evidence is concrete at the beginning; the high-level explanation is what the system is trying to discover. DENDRAL starts from molecular formula and mass-spectrometry data and generates candidate structures. Forward reasoning is selective when few rules match the facts, but it can explode when many rules generate irrelevant consequences. Forward search is common when sensors or experiments provide a bundle of observations before we know the explanation. In geology, rock composition, density, and location are facts; possible mineral deposits are conclusions. In chemistry, formula and mass peaks are facts; candidate molecular structures are conclusions. The inference engine repeatedly asks which rules match the current facts and adds their consequences. This resembles assembling a jigsaw puzzle from pieces already on the table. The danger is combinatorial enthusiasm: if many rules match, the system may generate a mountain of conclusions that no one requested. Conflict-resolution policies, relevance filters, and stopping conditions become important. Forward reasoning works best when the initial evidence is informative and the applicable-rule set stays selective. Otherwise the system can become the colleague who replies-all with every thought produced since breakfast.",
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
    note: "Prefer backward search when the goal is clear, the system must identify causes, evidence should be acquired selectively, or forward reasoning would allow too many rules to fire. Theorem proving begins with the theorem and reduces it to premises that must be established. Medical diagnosis begins with a hypothesis and orders only tests that help confirm or reject it. The goal controls which evidence is requested. A genealogy claim works backward through required parent-child links. But backward reasoning is only as good as its starting hypothesis: when a required subgoal fails, the system must revise or try an alternative rather than forcing the evidence to fit. Backward search turns a goal into a sequence of questions. To prove a theorem, ask which rule concludes it; then prove that rule's premises. To diagnose a disease, ask which findings would support or contradict it; then order informative tests. To verify ancestry, ask for the parent-child link required at each generation. This resembles planning a trip backward from a required arrival time: the flight departure determines when to reach the airport, which determines when to leave home. The advantage is relevance—only prerequisites of the goal become subgoals. The danger is tunnel vision. If the initial hypothesis is wrong, a system may spend effort proving increasingly obscure requirements. Good backward reasoning maintains alternative hypotheses and treats failed subgoals as information. The goal is a flashlight, not a pair of blinders.",
    sourceSlides: [18, 20],
  },
  {
    eyebrow: "In-class practice · Choose a direction",
    title: "Problem properties—not personal preference—select the direction",
    content: <SearchDirectionPractice />,
    note: "The first case begins with geological measurements and permits many high-level interpretations. Reveal the analysis: forward search is selective because the evidence is already available and only relevant rules need to fire. This is the PROSPECTOR pattern. Open the second case and reveal its analysis. Formula and mass data are already known, while candidate molecular structures are the possible conclusions. DENDRAL therefore reasons forward from evidence toward explanations. If the evidence were missing but one molecule were hypothesized, the efficient direction could change. Open the third case and reveal its analysis. The theorem is a precise goal, so backward search asks which rule could conclude it and turns that rule's premises into subgoals. A strong justification cites goal clarity and reduced branching, not simply that backward feels more scholarly. Open the fourth case and reveal its analysis. The medical diagnosis is a known hypothesis, while tests should be acquired selectively, so backward search is the recommended starting direction. Real systems sometimes combine directions. A medical system may reason forward from routine lab results to generate candidate conditions, then reason backward from each candidate to request discriminating tests. A theorem prover may work backward from a theorem while using forward-derived lemmas. This hybrid behavior is not indecision; it is an attempt to keep branching under control as information changes. The practice cases on this page should therefore be defended conditionally. State what data are available now, how many goals are plausible, and what evidence costs. Then change one condition and reconsider. If every medical test result has already been collected, selective backward acquisition loses its advantage. If the goal becomes vague, backward search loses its starting point. Search direction is more like choosing a flashlight angle than choosing a sports team. You may turn the flashlight when the room changes.",
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
    note: "For a delivery robot, one meaningful state may include location, battery level, package status, current time, and known walkway blockages. Each field earns its place because it can change a legal action, its cost, or the goal test. Symbolically, draw states as nodes and directed actions as cost-labeled arcs, with start set S and goal set GD. Computationally, choose structures for the state, graph, frontier, explored set, and parent links used to reconstruct a route. Success is both a goal state—package delivered—and a path whose battery use and lateness costs matter. Omitting irrelevant detail improves efficiency; omitting weather or blockage information that changes safety produces a dangerously incomplete model. Let us audit a proposed state containing only robot location. Can it choose safely? Not if a move depends on battery, package status, time, or a blocked walkway. Add those fields, then ask whether each one changes an operator, cost, or goal. Location determines reachable walkways. Battery affects whether a move or recharge is legal. Package status distinguishes traveling to pick up from traveling to deliver. Time affects lateness cost. Known blockages change connectivity. The symbolic graph then needs directed, cost-labeled arcs because slopes or one-way doors may make travel asymmetric. Computationally, a priority queue can hold the frontier, a hash set can record explored states, and parent links can reconstruct the route. This layered audit catches a common failure: drawing an impressive graph whose nodes omit the information needed to choose safely. Attractive arrows cannot compensate for amnesia.",
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
    note: "First, distinguish state, state space, and search in connected sentences: one state is a represented situation; the state space contains possible states and transitions; search navigates that space. Second, choose a new problem and write its four-tuple. Define N, A, S, and GD precisely enough that another person could generate legal successors and test a goal without guessing your intent. Third, choose forward or backward search and justify the choice from data, goals, branching, and evidence needs. Before Meeting 4, review graph traversal, queues, stacks, depth-first search, breadth-first search, depth bounds, and backtracking. A defensible state-space model should survive five questions. One: can another person determine whether two descriptions represent the same state? Two: can every operator's preconditions and effects be tested? Three: are S and GD unambiguous and nonempty? Four: does the solution criterion say whether state, path, cost, or some combination matters? Five: is the search direction justified from data, goals, branching, and evidence cost? Apply this checklist to a new example such as scheduling study sessions before an exam. A state might record completed topics, available time, fatigue, and deadlines. Operators schedule or complete a session. The goal is adequate coverage before the deadline, perhaps with minimum fatigue cost. If the model records highlighter color but omits available time, it has achieved visual organization rather than artificial intelligence. Precision is what turns a story into a searchable specification.",
    sourceSlides: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  },
];

export function StateSpaceFoundationsDeck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      hoverEffects
      meetingLabel="Module 3 · Lesson 3"
      meetingTitle="State-Space Search Foundations"
      notesMode="key-points"
      slides={slides}
      sourceCollectionLabel="L02_StateSpaceSearch.pptx"
      sourceCollectionPath="l02-state-space"
      timingPlan={MEETING_03_TIMING}
    />
  );
}
