import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

const topics = [
  {
    title: "Best-First Search, A*, and Heuristic Quality",
    selector: ".algorithm-definition section, .algorithm-definition article",
    core: [
      "Lesson six adds informed judgment to the frontier. OPEN still stores generated candidates, CLOSED still records expanded states, g of n still measures cost already paid, and parent links still recover a route. The new ingredient is h of n: a problem-specific estimate of the cost that remains.",
      "Think of planning a road trip. Greedy best-first stares at the remaining map distance, while A-star also checks the fuel already burned. One behaves like an impatient tourist pointing at the destination; the other keeps both the receipt and the compass on the dashboard.",
      "A heuristic is guidance, not prophecy. A small h value can make a state look attractive without proving that the full route through it is cheap. The central question is therefore not merely which number is smallest, but what that number means and what guarantee it supports.",
      "By the end, you should be able to trace greedy best-first and A-star, prove admissibility or consistency, compare heuristic strength, and reject A-star when the environment is dynamic, uncertain, or adversarial. The algorithm name comes after the model and assumptions, never before them."
    ],
    detail: [
      "Read the three visible cards as a progression: h alone for greedy selection, g plus h for estimated total solution cost, and quality tests for deciding whether h is useful and safe.",
      "If two frontier states have h values two and five but their g values are one hundred and one, greedy prefers the first while A-star may prefer the second. That disagreement is the whole lesson in miniature.",
      "OPEN and CLOSED organize the computation; neither list magically creates optimality. Optimality comes from the evaluation rule, the heuristic conditions, the edge costs, duplicate handling, and the moment at which the goal is accepted.",
      "Keep four columns in your notes: selected state, g, h, and f. That tiny ledger prevents the common mistake of calling every priority-based search A-star or treating the heuristic as the cost already spent."
    ]
  },
  {
    title: "Follow the smallest estimated distance to the goal",
    selector: ".algorithm-definition section, .algorithm-definition article, .search-callout",
    core: [
      "Greedy best-first search removes from OPEN whichever node has minimum h of n. The heuristic estimates remaining goal cost, so the rule says, choose what currently looks closest. It ignores the path cost already accumulated, which makes the method energetic, focused, and occasionally spectacularly gullible.",
      "Imagine hiking toward a mountain by always walking toward the peak as the crow flies. A cliff can make the visually closest position a terrible route. Greedy search behaves similarly: it may race down a promising-looking branch while a slightly less glamorous frontier node begins a much cheaper path.",
      "OPEN is a minimum-priority queue keyed here by h. CLOSED is an explored record used for duplicate handling. Parent pointers recover the selected route, and a best-g record can detect an improved duplicate even though g does not decide which greedy node leaves OPEN next.",
      "Greedy best-first is not generally optimal, and in unrestricted spaces it is not generally complete. A neat priority queue does not repair those limits. It merely executes the chosen policy efficiently, like a very organized assistant following an overconfident instruction."
    ],
    detail: [
      "Focus on the selection rule shown at left, then distinguish it from the three records shown at right. Selection, duplicate detection, and path recovery are separate jobs even when one node object stores all their fields.",
      "With frontier entries X having h equals two and Y having h equals four, greedy selects X regardless of whether g of X is fifty and g of Y is one. That is precisely the information greedy discards.",
      "A heap usually supports logarithmic insertion and removal, while a state-indexed map supports fast duplicate lookup. Calling CLOSED a queue hides this distinction because membership testing, not removal order, is its important operation.",
      "Before using greedy search, ask whether a locally low estimate correlates with progress, whether cycles are controlled, and whether any solution is sufficient. If minimum-cost solutions matter, h-only ordering is usually the wrong contract."
    ]
  },
  {
    title: "Generate broadly, then select the most promising frontier node",
    selector: ".algorithm-source-layout li, .algorithm-source-layout section, .search-callout",
    core: [
      "The procedure begins by placing the start node in OPEN and leaving CLOSED empty. It repeatedly removes a minimum-h node, performs the goal test, generates legal successors, handles duplicates, records parent information, and continues until a goal is selected or OPEN becomes empty.",
      "The crucial distinction from hill climbing is memory of alternatives. Greedy best-first may follow one branch deeply, but siblings remain in OPEN. When the favorite branch disappoints, the algorithm chooses the next-best waiting entry instead of declaring that the universe has personally betrayed it.",
      "The word backtrack here describes a computational choice, not necessarily a physical reverse action. A planner can pop another stored frontier record without commanding a drone to fly backward through every previous coordinate. Representation and execution live at different levels.",
      "Duplicate policy must state what counts as the same state and what happens when a cheaper path appears. Insert an unseen state, compare best g for a known one, update its parent when improved, and decide whether an expanded state is allowed to reopen."
    ],
    detail: [
      "Walk down the numbered list in order. Removing, goal-testing, expanding, inserting, updating, and closing are distinct events; changing their order can change both the trace and the correctness argument.",
      "Picture OPEN as a waiting room sorted by estimated remaining distance. Exploring one patient does not erase everyone else. That retained frontier is why a dead end differs from hill climbing's more brittle commitment.",
      "Parent links point through accepted records, so when a goal is removed the program follows those links back to the start and reverses the chain. The resulting path is the one found, not automatically a shortest path.",
      "For an implementation answer, name both structures: a priority queue for selecting minimum h and a hash map for state membership or best cost. One structure rarely performs both jobs well by accident."
    ]
  },
  {
    title: "Trace the heuristic order before seeing the answer",
    selector: ".search-source-image, .tree-challenge section, .search-callout",
    core: [
      "This state-space tree labels nodes with heuristic values. Greedy best-first always removes the smallest h currently in OPEN, with the displayed left-to-right tie rule. Before revealing anything, separate nodes already expanded from nodes merely visible in the generated tree.",
      "Enlarge the figure and begin at A with h five. Expanding A generates B four, C four, and D six. B wins the tie by the stated order. Its children are less attractive, so C still gets the next turn rather than being forgotten.",
      "From C, node H with h three becomes best. H generates O two and goal P three. O leaves OPEN before P because two is smaller than three, even though P has a giant metaphorical sign saying GOAL. The goal test occurs on selection.",
      "The final removal order is A, B, C, H, O, P. This example shows both greed and recovery: h pulls the search toward O, but retained alternatives return it to P. Predicting first makes the reveal evidence rather than decorative confetti."
    ],
    detail: [
      "A node drawn in the picture is not necessarily in OPEN yet. Only successors of expanded nodes have been generated, so trace the frontier after every expansion instead of scanning the entire diagram for the globally smallest label.",
      "After B expands, C four remains ahead of E five, F five, and D six. The waiting frontier is the algorithm's memory; without it, the behavior would collapse toward hill climbing.",
      "Selecting O before P is not a failure. O is checked, found not to be a goal, and then P becomes the smallest remaining frontier entry. Greedy search can recover because OPEN still contains P.",
      "Now use the control to compare your written order. If yours differs, locate the first disagreement and name its cause: generation timing, tie-breaking, or confusing a visible node with an eligible frontier node."
    ]
  },
  {
    title: "The pseudocode needs explicit duplicate and path policy",
    selector: ".search-source-image, .algorithm-source-layout section, .search-callout",
    core: [
      "The pseudocode is an implementation sketch, so read it as a contract that needs clarification. OPEN selects minimum h, CLOSED records expanded states, and each accepted node should carry state, parent, best-known g, and h. Those fields support different correctness obligations.",
      "Enlarge the algorithm and follow one iteration: remove a record, test its state, generate successors, compare duplicates, update accepted records, and place the expanded state in CLOSED. A missing duplicate rule can create multiple records for one state or preserve an expensive parent forever.",
      "The source wording can sound as if following parents always returns a shortest path. Repair that claim. Parent pointers return the path associated with the selected goal record; greedy h-only ordering provides no general minimum-cost guarantee.",
      "A robust policy says when an OPEN duplicate is decreased and when a CLOSED state reopens. Greedy selection may still use h alone, but best g remains useful for choosing which record and parent represent the state."
    ],
    detail: [
      "Do not let the data structures blur together. The priority queue answers who is next, the map answers whether this state is known, and the parent field answers how the accepted path reached it.",
      "Suppose state Q first arrives with g ten and later with g six. Keeping the older record can corrupt the returned route even if both copies share the same heuristic value. Update policy is not optional housekeeping.",
      "Optimality is a theorem about the selection rule plus assumptions, not a side effect of writing the word shortest beside a parent chain. Code comments are not legally binding on mathematics, although they often act confident in meetings.",
      "When you close the enlarged view, summarize the repaired contract in one sentence: greedy chooses by h, tracks best records and parents, detects duplicates, and returns the found path without promising it is cheapest."
    ]
  },
  {
    title: "OPEN determines every next move",
    selector: ".search-source-image, .trace-source-layout section, .trace-source-layout p",
    core: [
      "The exact trace turns frontier ordering into observable state. At initialization, OPEN is A five and CLOSED is empty. Each Next click should follow a prediction: name the selected entry, say which successors appear, then give the complete ordered OPEN and CLOSED lists.",
      "Expanding A yields B four, C four, D six. B wins the tie, so CLOSED becomes B then A after B expands, while C remains ahead of the new E five and F five. The priority queue preserves every unresolved alternative.",
      "Expanding C inserts H three and G four. H is now best; expanding it inserts O two and P three. O is selected before the goal, produces no successful result, and leaves P as the smallest remaining frontier node.",
      "When P is removed, the goal test succeeds. The trace ends with goal selection, not with P's earlier generation. That distinction matters because many optimal-search proofs rely on the selected entry being the best frontier candidate at acceptance time."
    ],
    detail: [
      "Open the figure long enough to study the labels, then return to the live trace. The diagram explains the topology; the control explains the changing queue state. Neither view substitutes for the other.",
      "Tie-breaking is visible evidence, not trivia. If C were chosen before B, the order of intermediate expansions could change even though the minimum-h rule remains valid.",
      "At every step, read OPEN from left to right as increasing priority under the displayed policy. CLOSED is shown most-recent-first here, so do not accidentally interpret its visual order as another selection queue.",
      "The last click demonstrates the acceptance event. Use parent links from P back through H and C to A to recover a path; reversing those links produces the forward solution sequence."
    ]
  },
  {
    title: "This figure already combines g and h",
    selector: ".search-source-image, .puzzle-source-layout section, .search-callout",
    core: [
      "This eight-puzzle picture is sometimes introduced near best-first search, but its numbers reveal the actual algorithm. The displayed score is f of n equals g of n plus h of n. Once g participates in priority, we are looking at A-star scoring, not greedy h-only scoring.",
      "Enlarge the boards and count carefully. The start has g zero. Every displayed successor is one legal move away, so each has g one. The heuristic counts misplaced tiles, producing the visible totals f six, f four, and f six.",
      "Naming matters because algorithms can inspect the same states while making different choices. Greedy would compare only the three h values. A-star compares the estimated total through each successor, and uniform-cost would compare only g.",
      "For each successor, say the triple g, h, f aloud. This simple habit prevents arithmetic from floating free of meaning. g is paid cost, h is predicted remainder, and f is the estimated cost of a complete solution through that node."
    ],
    detail: [
      "The center successor wins because its total is four while the alternatives total six. The visible choice is therefore evidence of g-plus-h ordering, even if a nearby label uses the broader phrase best-first.",
      "Misplaced tiles is a relaxation-based lower bound: every tile currently out of place must participate in at least one move before the puzzle can finish, though one move may not independently fix every counted tile.",
      "If all three successors have equal g, greedy and A-star may temporarily agree on their ranking. Agreement on one layer does not make the rules identical; deeper nodes can carry very different accumulated costs.",
      "After closing the figure, create one imaginary successor with g five and h zero. Compare it with g one and h three. Both have f five versus four, showing why the arithmetic must stay attached to the frontier record."
    ]
  },
  {
    title: "OPEN is ordered; CLOSED remembers what was expanded",
    selector: ".search-source-image, .puzzle-source-layout section, .puzzle-source-layout li",
    core: [
      "This third-iteration snapshot separates two questions. OPEN answers which generated candidate can still be selected, and its order reflects the evaluation score. CLOSED answers which states have already been expanded. One is a priority structure; the other is an explored-state record.",
      "Enlarge the boards and point to one OPEN state. It is waiting because it has been generated but not expanded. Then point to one CLOSED state. Its successors were already considered, so retaining it supports duplicate detection rather than another ordinary turn.",
      "Queue ordering and state lookup are different operations. A heap is good at removing minimum f, while a hash map is good at asking whether a board configuration has appeared and what best g has been recorded for it.",
      "Parent and best-g fields connect the structures. When a duplicate board arrives, compare the new g with the stored one. If it improves the record, update the parent and possibly the frontier position or reopen policy."
    ],
    detail: [
      "Do not infer path order from the visual arrangement of CLOSED. The membership fact is usually more important than display order; what matters is whether the state is expanded and whether its best cost can still improve.",
      "The same puzzle state can be reached by moving a tile out and immediately back. Without state identity checks, the frontier grows reversible-action copies faster than students opening browser tabs during registration week.",
      "A practical node record might store a compact board key, g, h, parent identifier, and status. The priority queue can reference that record while the map owns the authoritative best-known version.",
      "Close the enlarged snapshot and explain the division of labor without acronyms: select cheaply, recognize duplicates quickly, preserve the best route, and know whether prior expansion should block or permit reconsideration."
    ]
  },
  {
    title: "A weak heuristic leaves a large state space alive",
    selector: ".search-source-image, .puzzle-source-layout section, .search-callout",
    core: [
      "The large generated puzzle tree is a visual diagnosis. Many states survive with similar priorities, so the heuristic fails to sharply distinguish promising from unpromising regions. A weak h can still be correct; it simply provides little pruning power beyond uninformed cost ordering.",
      "Enlarge the tree and notice the broad frontier. If h assigns nearly the same estimate everywhere, A-star behaves more like uniform-cost search. The compass points north, technically, but with the enthusiasm of a refrigerator magnet.",
      "A heuristic can also be unreasonable for a different reason: it may be expensive to compute, unrelated to actual remaining cost, or systematically misleading. Quality includes information, computation cost, and compatibility with the guarantee the algorithm needs.",
      "Measure at least three quantities: nodes expanded, time or memory spent computing h, and solution quality under the stated assumptions. A smaller search tree is not a win if every heuristic call quietly solves another difficult problem."
    ],
    detail: [
      "The picture does not by itself prove inadmissibility. Broad expansion may indicate an admissible but weak lower bound. Formal properties require inequalities; visual density is evidence about effectiveness, not a theorem about correctness.",
      "Compare h equals zero with misplaced tiles. Both can be admissible, but misplaced tiles separates some boards that zero treats identically. Manhattan distance often separates them more strongly while remaining safe for the standard puzzle.",
      "A misleading overestimate may reduce expansions and still destroy A-star's optimality guarantee. Fast and wrong can look excellent on a node-count chart, which is why guarantees and performance need separate columns.",
      "Close the figure and propose one improved puzzle heuristic. State what relaxation makes it a lower bound and what extra computation it costs. That pair of statements is the beginning of heuristic engineering."
    ]
  },
  {
    title: "An admissible heuristic never overestimates remaining optimal cost",
    selector: ".search-source-image, .source-definition-layout article, .search-callout",
    core: [
      "Admissibility is a pointwise property of h. Let h-star of n be the true optimal remaining cost from n to a goal. An admissible heuristic satisfies zero less than or equal to h of n, less than or equal to h-star of n, for every relevant state.",
      "Enlarge the definition and interpret h as a lower-bound price tag. If the cheapest remaining trip truly costs twelve, estimates zero, seven, or twelve are admissible; thirteen is not. The estimate may be pessimistically small, but it may never promise a cost larger than reality.",
      "Admissibility belongs to the heuristic, not automatically to greedy selection. Tree-search A-star can use an admissible h to obtain optimality under standard nonnegative-cost and termination conditions. Graph-search A-star also needs consistency or a correct reopening policy.",
      "At a goal, h should be zero because no remaining cost is required. To prove a heuristic admissible, identify the relaxed problem or lower-bound argument that prevents overestimation; familiarity, popularity, or a confident textbook font is not a proof."
    ],
    detail: [
      "Misplaced tiles is admissible for the unit-cost eight-puzzle because every misplaced tile must be addressed by future motion. Manhattan distance is also a lower bound because each tile must traverse at least its row-and-column displacement.",
      "Admissible does not mean accurate. The zero heuristic is perfectly admissible and perfectly unhelpful about direction. It preserves A-star's safety while reducing its behavior to uniform-cost search.",
      "Negative estimates are usually excluded because they cease to represent remaining cost and can distort ordering. Nonnegative edge costs and suitable termination assumptions also matter; the inequality alone does not make every implementation terminate.",
      "Close the figure and test one proposed h value against h-star. One counterexample is sufficient to disprove admissibility, while a proof must cover every state in the intended problem space."
    ]
  },
  {
    title: "Three questions expose three common confusions",
    selector: ".search-review-studio nav button, .search-review-studio li",
    core: [
      "Question one asks whether admissible means perfect. No. The defining inequality permits underestimation; exact equality with h-star would be a perfect heuristic, usually as expensive as already knowing the solution. Admissibility is a safety ceiling, not a demand for clairvoyance.",
      "Question two asks about eight-puzzle heuristics. Misplaced tiles and Manhattan distance are admissible with standard unit-cost moves. Each needs a lower-bound argument. Any mysterious third heuristic must be checked pointwise rather than admitted to the club because its name sounds mathematical.",
      "Question three exposes abbreviation trouble. BFS might mean breadth-first search or best-first search. Breadth-first equals uniform-cost, and therefore A-star with h zero, only under equal positive step costs. Greedy best-first orders by h alone and is not A-star.",
      "The proof habit is the takeaway. For a heuristic claim, write the relevant inequality and the cost assumptions. For an algorithm claim, state the search variant, graph policy, branching, edge costs, and termination conditions. Acronyms cannot carry those assumptions for you."
    ],
    detail: [
      "Use the first tab to separate admissible from perfect, then move the focus to the answer-and-proof sequence. A lower estimate can waste work without violating the guarantee.",
      "On the second tab, explain why one legal move changes tile distances in a controlled way. The proof is tied to the move model; change the cost model and the familiar heuristic may need a new argument.",
      "On the third tab, say breadth-first and greedy best-first in full. This is not vocabulary fussiness: the two algorithms prioritize different quantities and support different guarantees.",
      "For each response, ask what evidence would falsify it. A single overestimating state defeats admissibility, an edge violation defeats consistency, and unequal step costs defeat the usual breadth-first minimum-cost claim."
    ]
  },
  {
    title: "Estimate the total solution cost through each frontier node",
    selector: ".algorithm-definition section, .algorithm-definition article",
    core: [
      "A-star chooses the frontier node with minimum f of n, where f equals g plus h. g is the accepted path cost from the start to n. h estimates optimal remaining cost. Their sum estimates a complete solution constrained to pass through n.",
      "Imagine comparing airline itineraries. g is the money already charged for the legs booked so far; h is a lower-bound estimate for reaching the destination. Choosing by only h ignores sunk travel, while choosing by only g ignores direction. A-star balances both ledgers.",
      "g is computed from edge costs and parent records. h comes from problem knowledge and should be cheaper than solving the remaining problem exactly. f is not a third mysterious oracle; it is the arithmetic combination used as the priority key.",
      "Two special cases clarify the rule. If h is zero everywhere, A-star becomes uniform-cost search. If g is omitted, the behavior becomes greedy best-first. The missing term reveals which information and which guarantees have been discarded."
    ],
    detail: [
      "Move focus across the three visible cards exactly as the narration names g, h, and f. Leaving the highlight on g while explaining h would teach the wrong equation with excellent animation.",
      "For frontier X with g four and h nine, f is thirteen. For Y with g seven and h three, f is ten, so A-star selects Y even though Y has already cost more.",
      "An admissible h makes f a lower bound on the cost of any solution through n. That lower-bound interpretation is what supports A-star's comparison between incomplete routes.",
      "Keep units compatible: if g is minutes and h is kilometers, addition produces numerical soup. Convert both to the same objective before placing the sum in a priority queue."
    ]
  },
  {
    title: "Equal depth is not the same as equal estimated total cost",
    selector: ".search-source-image, .puzzle-source-layout section, .search-callout",
    core: [
      "Breadth-first search orders by depth, while A-star orders by estimated total cost. Those rankings coincide only under special conditions. Equal depth says the same number of actions; it does not say those actions have equal cost or lead equally close to the goal.",
      "Enlarge the comparison and inspect the different wavefronts. Breadth-first treats all nodes at a level alike until arrival order breaks ties. A-star can pass over a shallow node when its g-plus-h estimate is worse than a deeper candidate's estimate.",
      "Breadth-first is complete with finite branching and optimal when every action has the same cost. A-star can handle unequal nonnegative costs when its heuristic and duplicate policy satisfy the required conditions. The assumptions belong beside the guarantee.",
      "A-star with h zero becomes uniform-cost search. Uniform-cost and breadth-first impose the same order when every step has one common positive cost, often normalized to one. Otherwise depth is a poor substitute for accumulated price."
    ],
    detail: [
      "A two-edge route costing one hundred per edge is shallower than a three-edge route costing one per edge. Breadth-first prefers the former by depth; uniform-cost and sensible A-star scoring prefer the latter by cost.",
      "The picture illustrates priorities, not a universal speed ranking. A weak heuristic can make A-star expand nearly as broadly as uniform-cost, while a strong admissible heuristic can sharply narrow the search.",
      "Goal timing matters. For cost-sensitive search, accepting the first generated goal can be premature because another frontier path may later reach a cheaper goal record.",
      "Close the figure and state the equivalence as a conditional sentence: with h zero A-star is uniform-cost; with equal positive step costs uniform-cost's g layers match breadth-first depth layers."
    ]
  },
  {
    title: "Straight-line distance guides road search",
    selector: ".replayable-source-animation, .trace-source-layout section, .search-callout",
    core: [
      "In the city graph, nodes represent locations and edges represent road segments. g accumulates road distance already traveled. Straight-line distance to the destination supplies h because an actual road route cannot be shorter than the direct geometric distance between endpoints.",
      "Enlarge the animation before replaying it. Watch the frontier develop around the network, but resist choosing whichever dot looks closest on the screen. A-star compares traveled distance plus straight-line remainder, so a geometrically tempting node can lose after an expensive detour.",
      "Replay the animation and predict the next expansion from candidate f values. The heuristic is admissible for distance minimization only when edge costs use compatible distance units and roads cannot create wormholes. Campus parking may feel non-Euclidean, but the graph still needs a defensible metric.",
      "The transfer question is what changes if travel time replaces distance. Straight-line kilometers may remain a weak proxy but are not automatically a lower bound on minutes. A valid time heuristic needs a speed bound or another argument connecting geography to cost."
    ],
    detail: [
      "The open frontier is a set of partially evaluated routes, not a single glowing path. Each candidate carries its own g, h, f, and parent record.",
      "A road that initially moves away from the goal may reduce total cost by connecting to a fast route. Greedy h-only search is especially vulnerable to rejecting such temporary detours.",
      "During replay, pause mentally at each expansion and ask whether the selected node minimizes h or f. The visible difference is where informed search stops being a slogan and becomes a trace.",
      "After the replay, invent one blocked road. A fixed offline A-star result becomes stale; the system must update the graph and replan or use an incremental search method."
    ]
  },
  {
    title: "Configuration-space search routes around obstacles",
    selector: ".replayable-source-animation, .trace-source-layout section, .search-callout",
    core: [
      "For robot motion planning, a node is a configuration rather than merely a point on the floor. Edges represent feasible local motions, g accumulates motion cost, and h estimates remaining cost. Obstacles remove transitions and force the frontier to route through valid free space.",
      "Enlarge the animation and identify its marks. Open circles represent frontier configurations in OPEN; filled circles represent expanded configurations in CLOSED. The growing pattern shows computation exploring around obstacles rather than a robot physically visiting every displayed point.",
      "Replay and watch the wave bend around blocked regions. A direct Euclidean estimate can remain admissible, yet collision constraints mean the real route must be longer. The heuristic whispers straight ahead while the successor function politely points out the wall.",
      "If an obstacle moves after planning begins, the deterministic offline graph has changed. A deployed robot needs sensing, collision checking, replanning, and possibly uncertainty-aware control around the A-star component. The search algorithm is one instrument, not the entire orchestra."
    ],
    detail: [
      "Configuration may include position, orientation, joint angles, or velocity. A visually simple workspace can therefore induce a high-dimensional state space where naive grids become enormous.",
      "The successor function is responsible for legal local motion. A heuristic may guide toward the goal but cannot legalize a transition that intersects an obstacle.",
      "Color or distance marks in the visualization are encodings of search quantities, not decorative fireworks. Explain which quantity changes before interpreting the animation's shape.",
      "After replay, name the boundary between planner and controller: A-star proposes a discrete route, while feedback control executes and corrects motion under real sensor noise."
    ]
  },
  {
    title: "A lower-bound geography heuristic focuses a national route",
    selector: ".replayable-source-animation, .trace-source-layout section, .search-callout",
    core: [
      "The rail example searches from Washington, D.C. to Los Angeles. States are rail-network locations, edges are available rail connections, and g is rail distance already traveled. Great-circle distance to Los Angeles supplies a geographic lower bound for remaining route distance.",
      "Enlarge the map and notice that the search does not expand every city uniformly. The heuristic focuses the frontier westward while g prevents a wildly expensive westward detour from winning merely because it looks closer to California.",
      "Replay the route and inspect the frontier growth. Great-circle distance is admissible only when the objective is compatible distance and no rail segment has a cost smaller than the physical separation it covers. Units and cost semantics are part of the proof.",
      "If the objective becomes ticket price, schedule reliability, or travel time, geography alone may no longer be a safe lower bound. A real travel planner might use several costs or constraints, turning the tidy classroom graph into a considerably grumpier optimization problem."
    ],
    detail: [
      "The heuristic need not predict the exact rail path. Its job is to underestimate the remaining optimal distance while distinguishing cities that are plausibly closer to the destination.",
      "A node far west can still lose when its accumulated rail distance is already large. That is the balancing role of g in the f score.",
      "During replay, separate expansion order from the final path. Many expanded cities provide evidence and alternatives but do not appear in the parent chain returned as the solution.",
      "After replay, propose a time lower bound using great-circle distance divided by a maximum possible train speed. State why the maximum, rather than average speed, preserves underestimation."
    ]
  },
  {
    title: "Set h(n)=0 and A* becomes uniform-cost search",
    selector: ".replayable-source-animation, .trace-source-layout section, .search-callout",
    core: [
      "Setting h of n to zero simplifies f equals g plus zero, so A-star orders the frontier entirely by accumulated path cost. On nonnegative weighted graphs, this is uniform-cost or Dijkstra-style search: settle the least-cost reachable frontier record next.",
      "Enlarge the animation and watch the cost wave spread. It does not necessarily move by geometric radius or by edge count. A longer-looking edge with low weight can be settled before a short-looking edge with high weight because the labels, not the artwork, define cost.",
      "Replay and identify the moment a node's cheapest path becomes settled under the algorithm's assumptions. Nonnegative edge costs matter because a later negative edge could retroactively make a previously expensive route cheaper, breaking the ordinary argument.",
      "Breadth-first is equivalent only when every action has the same positive cost. With unequal weights, shallowest depth and smallest g diverge. Saying Dijkstra is just breadth-first with numbers is charming, compact, and dangerously incomplete."
    ],
    detail: [
      "The zero heuristic is admissible and consistent, but it provides no directional information. It is the safe baseline against which stronger heuristics should demonstrate search savings.",
      "The frontier priority is current best distance from the start. Relaxing an edge means checking whether the selected path offers a cheaper g for its neighbor and updating that record if so.",
      "During replay, distinguish a discovered node from a settled one. Discovery gives a candidate cost; selection at minimum g establishes the relevant guarantee under the nonnegative-cost conditions.",
      "After replay, compare two paths with depths two and four but costs twenty and six. Uniform-cost chooses by six; breadth-first chooses by two edges. The example exposes the missing equal-cost assumption."
    ]
  },
  {
    title: "A consistent heuristic obeys a triangle inequality on every edge",
    selector: ".search-source-image, .source-definition-layout article, .search-callout",
    core: [
      "Consistency, also called monotonicity, is a local edge condition: h of n must be no greater than the step cost from n to successor n-prime plus h of n-prime. It says the estimate cannot drop by more than the cost paid to cross one edge.",
      "Enlarge the definition and picture a triangle. Going directly from the estimate at n cannot claim more remaining distance than taking one real step and then using the successor's estimate. A violation is a heuristic price tag that falls suspiciously faster than the journey pays for.",
      "Consistency makes f values nondecreasing along a path. Substitute g of n-prime equals g of n plus the edge cost, add terms, and the edge inequality yields f of n-prime greater than or equal to f of n.",
      "Under standard graph-search conditions, consistency implies admissibility and allows A-star to close a state at its best g without later reopening it. If one edge violates the inequality, a cheaper route may reach an already expanded state."
    ],
    detail: [
      "Check consistency edge by edge. For h of B equals three, edge B to A cost one, and h of A equals zero, the inequality demands three less than or equal to one, which fails.",
      "Manhattan distance is consistent for standard unit-cost puzzle moves because one legal tile move changes the total Manhattan estimate by at most one, matching the step cost.",
      "Consistency is stronger than admissibility in the usual setting. An admissible heuristic may still have local drops that force graph-search A-star to reconsider CLOSED states.",
      "Close the figure and perform the diagnostic in a fixed order: write h at the source, edge cost, h at the successor, compute the right side, then compare."
    ]
  },
  {
    title: "An inconsistent heuristic can force a CLOSED node to reopen",
    selector: ".frontier-trace section, .frontier-queues article",
    core: [
      "This graph uses an admissible but inconsistent heuristic. Start at S with g zero and f three. Expanding S generates A with g three, f three, and B with g one, f four, so A is selected first and placed in CLOSED.",
      "Expanding A creates goal G with cost five. B is then selected, and edge B to A discovers a cheaper g for A: two instead of three. Consistency fails on that edge because h of B is three while one plus h of A is only one.",
      "The improved A must leave CLOSED and reopen with g two, f two. Re-expanding it updates the goal from cost five to cost four. Without reopening, the algorithm can preserve the early expensive parent and return the wrong cost.",
      "Finally G with g four is selected, returning path S to B to A to G. The lesson is implementation-specific: admissibility protects the lower bound, but graph search needs consistency or correct reopen logic to propagate improved paths."
    ],
    detail: [
      "Read OPEN and CLOSED after every click. The dramatic moment is not discovering G at cost five; it is discovering that a CLOSED state's best g was not actually final.",
      "All heuristic values remain at or below true remaining optimal cost, so admissibility is not the failed property. The failure is the local triangle inequality on B to A.",
      "Reopening is not duplicate chaos. It is a disciplined response to a strictly improved path record: update g, update the parent, restore frontier eligibility, and propagate the improvement.",
      "Use the final state to compare two hypothetical implementations. Permanent CLOSED returns five; reopen-aware graph search returns four. That one policy decision changes correctness."
    ]
  },
  {
    title: "A more informed admissible heuristic gives tighter lower bounds",
    selector: ".search-source-image, .source-definition-layout article, .search-callout",
    core: [
      "For two admissible heuristics, h-two dominates h-one when h-one of n is less than or equal to h-two of n for every state. The larger values remain below h-star, so h-two supplies tighter lower bounds without sacrificing admissibility.",
      "Enlarge the definition and compare misplaced tiles with Manhattan distance in the standard eight-puzzle. Every misplaced tile contributes at least one unit of Manhattan distance, while some tiles are several squares away. Manhattan therefore dominates the simpler count pointwise.",
      "With comparable tie-breaking, A-star using the dominating heuristic typically expands no more nodes than A-star using the weaker one. Tighter lower bounds eliminate more frontier candidates whose estimated totals cannot beat the best solution cost.",
      "More informed does not mean free. Manhattan distance costs slightly more arithmetic than counting misplaced tiles, and sophisticated pattern databases require memory and preprocessing. Judge total problem-solving effort, not just the elegance of the estimate."
    ],
    detail: [
      "Dominance is a for-every-state comparison, not a claim that one heuristic has a better average on a sample. One violating state defeats the pointwise relation.",
      "The zero heuristic is dominated by every nonnegative admissible heuristic. It provides the baseline lower bound and turns A-star into uniform-cost search.",
      "Tie-breaking can affect exactly which equal-f nodes expand, so empirical counts need controlled comparisons. The theoretical intuition remains that tighter safe bounds focus the frontier.",
      "Close the figure and evaluate a stronger proposed h. Prove it stays below h-star, then price its computation. A heuristic that saves ten expansions but costs a million operations per node has won the wrong contest."
    ]
  },
  {
    title: "Search savings must exceed the cost of control knowledge",
    selector: ".search-source-image, .puzzle-source-layout section, .search-callout",
    core: [
      "The cost graph separates search effort from heuristic or control effort. As a heuristic becomes more informed, node expansion and rule application may fall, while preprocessing, memory, sensing, or per-node calculation rises. Their sum can form a U-shaped total-cost curve.",
      "Enlarge the curves and locate the interior minimum. The left side spends little on guidance and pays for a huge search. The right side owns a magnificent heuristic department whose meetings cost more than the problem it was hired to solve.",
      "Node count is therefore an incomplete metric. Record wall-clock time, memory, heuristic calls, preprocessing, and solution quality. A stronger heuristic can dominate mathematically yet lose end-to-end when its computation overwhelms saved expansions.",
      "The engineering objective is minimum total effort subject to the required guarantee. Choose the heuristic granularity that pays for itself on the expected problem distribution, hardware, and reuse frequency rather than worshiping maximum informedness."
    ],
    detail: [
      "The descending curve represents search or rule-application cost; the ascending curve represents acquiring and using control knowledge. The total is their vertical sum.",
      "A pattern database may be expensive once but reused across thousands of puzzles, changing the amortized optimum. Workload frequency belongs in the analysis.",
      "A learned heuristic adds training data, inference latency, and possible guarantee violations. If optimality matters, the system may need calibration, bounding, or a safe fallback.",
      "Close the graph and propose an experiment: run identical instances with h zero, misplaced tiles, and Manhattan distance; measure both expansions and elapsed time, then explain any disagreement."
    ]
  },
  {
    title: "Use one lens for h and another for the search algorithm",
    selector: ".m6-property-lenses article, .m6-question-sorter nav button, .m6-question-sorter div",
    core: [
      "Before evaluating a claim, identify the object. A heuristic function is judged for admissibility, consistency, and informedness. A search algorithm is judged for completeness, optimality, time, and space under explicit conditions. Mixing the two lenses creates questions that sound technical but lack a defined test.",
      "For h-one admissibility, check zero less than or equal to h-one of n less than or equal to h-star everywhere. For h-two consistency, check the triangle inequality on every edge. These are properties of estimates, not of DFS as a whole procedure.",
      "Asking whether DFS is consistent is a category mismatch under this definition. Evaluate DFS for completeness, optimality, time, and memory instead. Classical algorithm admissibility is an older synonym for guaranteed optimality, which is separate from heuristic admissibility.",
      "Best-first completeness also needs the variant and assumptions. Greedy, A-star, and other best-first strategies use different priorities. State the space, cycles, branching, costs, and termination policy before placing a checkmark beside the algorithm."
    ],
    detail: [
      "Use the visible two-column framework like a diagnostic tool. First point to heuristic or algorithm, then select the corresponding inequality or guarantee questions.",
      "The first two tabs are valid heuristic questions. Each has a concrete mathematical test, so the answer can be proved or refuted with states and edges.",
      "The DFS tab deliberately exposes the mismatch. Consistency could mean colloquial reliability, but in informed search it names a property of h; precise language prevents accidental theorem swapping.",
      "The remaining tabs show algorithm questions. Explain why the phrase best-first is too broad and why algorithm admissibility means returning an optimal solution rather than satisfying h less than or equal to h-star."
    ]
  },
  {
    title: "Can all intelligent tasks use A*?",
    selector: ".m6-application-practice nav button, .m6-application-practice section, .search-callout",
    core: [
      "A-star is powerful when a task can be modeled as deterministic path search with states, actions, edge costs, a goal, and a defensible heuristic. The five cases test whether that model captures the central difficulty or merely one bounded component.",
      "For autopilot, A-star can plan a route through a known discretized region, but it is not the whole flight controller. Wind, partial observation, moving traffic, safety envelopes, and continuous dynamics require sensing, prediction, feedback, and online replanning around the path search.",
      "For an autonomous drone and robot vacuum, A-star fits known-map point-to-point travel. Name configurations or grid cells as states, feasible moves as actions, and energy or distance as cost. Unknown rooms, moving obstacles, people, and pets demand additional online behavior.",
      "Chess and financial investment reveal model failure. Chess is adversarial because another agent selects actions against us, so minimax-style reasoning is appropriate. Investment is stochastic, partially observed, dynamic, and risk-sensitive; a deterministic shortest path hides the problem we most need to solve."
    ],
    detail: [
      "For every case, use the same checklist before revealing the analysis: state, actions, edge cost, heuristic, observability, dynamics, and other agents. A-star is a conclusion from that model, not a decorative badge.",
      "Autopilot may use graph search for a bounded route subproblem while control laws track the route and replanning reacts to change. Components can be appropriate even when the whole task is not ordinary A-star.",
      "Drone and vacuum examples show discretization tradeoffs. Fine grids improve geometric fidelity but enlarge the search; coarse grids save computation but may erase safe passages or useful orientations.",
      "Chess has alternating agency, while investment has uncertain transitions and rewards. In both cases, the environment actively defeats the fixed deterministic graph assumption, though for very different reasons."
    ]
  },
  {
    title: "Offline deterministic search is only one corner of agency",
    selector: ".algorithm-map article, .algorithm-map aside p",
    core: [
      "Offline deterministic search assumes a known model, predictable actions, and enough stability to compute a path before execution. Real agents may act physically, observe partially, face stochastic outcomes, operate in changing worlds, or interact with cooperative and competitive agents.",
      "Computational backtracking does not imply physical reversal. A planner can return to another frontier record instantly, while a drone cannot teleport back through wind and obstacles. Execution cost and irreversibility must be represented if they matter to the real task.",
      "Partial observations and unknown dynamics break the fixed-state graph. Dynamic environments can invalidate edges while the plan is running. These settings motivate sensing, belief states, policies, online search, incremental replanning, and reinforcement or decision-theoretic methods.",
      "Use the environment audit aloud: deterministic or stochastic, fully or partially observable, episodic or sequential, static or dynamic, discrete or continuous, known or learned, single-agent, cooperative, or competitive. The answers determine whether A-star belongs and what must surround it."
    ],
    detail: [
      "Move focus across the four limitation cards as each is named: physical action, uncertainty, change, and other agents. Each card invalidates a different simplifying assumption.",
      "A warehouse robot may use A-star on a local occupancy grid while a scheduler coordinates peers and a controller handles motion. Layered systems are normal; one algorithm need not impersonate an entire intelligence.",
      "A learned heuristic can adapt guidance, but learning does not automatically provide admissibility or consistency. If guarantees matter, the learned estimate needs a bound, verification, or safe search wrapper.",
      "Choose one prior application and classify it with every question in the audit. Any answer you cannot state is a modeling uncertainty, not permission to assume the convenient option."
    ]
  },
  {
    title: "Trace it, justify it, and decide when it belongs",
    selector: ".search-exit article, .search-exit aside",
    core: [
      "The cumulative task has three parts. First, trace a weighted graph by showing every selected node, OPEN and CLOSED state, parent, g, h, and f update. Include a reopened state so duplicate policy becomes visible rather than hiding behind the word implementation.",
      "Second, justify heuristic claims. Use zero less than or equal to h less than or equal to h-star for admissibility, and h of n less than or equal to edge cost plus successor h for consistency. State edge-cost and termination assumptions beside the proof.",
      "Third, decide whether the model belongs. Choose among greedy best-first, A-star, uniform-cost, breadth-first, or a non-path-search method. Name the required guarantee, resource tradeoff, environment assumptions, and why the rejected alternatives fail the task.",
      "The durable sequence is trace, justify, decide. Arithmetic without a model is bookkeeping; a theorem without assumptions is a motivational poster; an algorithm name without either is horoscope reading for priority queues. Build the representation first, then earn the conclusion."
    ],
    detail: [
      "For the trace card, make one table row per expansion and record goal timing. A state generated early can still wait while a lower-f candidate leaves OPEN first.",
      "For the proof card, separate heuristic admissibility from A-star optimality. The former is an inequality about h; the latter also depends on the search version and implementation conditions.",
      "For the decision card, test whether the environment is a stable deterministic graph. If uncertainty, opponents, or continuous feedback dominate, say which richer model replaces or surrounds path search.",
      "Finish by marking one skill as secure and one as needing practice: exact trace, inequality proof, or environment-model diagnosis. Your next study step should target the weak operation, not reread every page equally."
    ]
  }
];

const labels = ["Concept framing", "Worked mechanism", "Boundary and guarantee", "Transfer and takeaway"];
const focusIndexes = topics.map((_, slideIndex) => {
  if (slideIndex === 3) return [0, 1, 1, 1];
  return [0, 1, 2, 3].map(index => slideIndex === 10 || slideIndex === 21 ? index : index % 3);
});
const phraseAt = text => text.trim().split(/\s+/).slice(0, 5).join(" ");
const limitWords = (text, maximum) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= maximum) return text;
  return words.slice(0, maximum).join(" ").replace(/[,:;]$/, "") + ".";
};

const slides = topics.map((topic, slideIndex) => ({
  number: slideIndex + 1,
  title: topic.title,
  segments: topic.core.map((core, segmentIndex) => ({
    label: labels[segmentIndex],
    text: limitWords(`${core} ${topic.detail[segmentIndex]}`, 65),
    visualDesign: {
      focusSelector: topic.selector,
      focusIndex: focusIndexes[slideIndex][segmentIndex],
      focusPhrase: phraseAt(core),
      focuses: [{ phrase: phraseAt(core), selector: topic.selector, index: focusIndexes[slideIndex][segmentIndex], label: labels[segmentIndex] }],
      kinetics: [],
    },
    ...([4, 6, 11, 19, 22, 23, 25].includes(slideIndex + 1) && segmentIndex === 3 ? { pauseAfterSeconds: 3 } : {}),
  })),
}));

const visualMoments = [
  [1,2,"keeps both the receipt and the compass","emoji","🧾 🧭","Paid cost plus predicted remainder"],
  [2,2,"walking toward the peak as the crow flies","emoji","⛰️ 🐦","Looks close, route may be costly"],
  [3,2,"waiting room sorted by estimated remaining distance","popup","OPEN → min h(n)","Frontier priority"],
  [4,3,"giant metaphorical sign saying GOAL","emoji","🎯","Goal still waits for selection"],
  [5,3,"Code comments are not legally binding","emoji","📝 ≠ THEOREM","Claims require proof"],
  [6,3,"O two and P three","popup","O(2) → P(3)","Heuristic order"],
  [7,1,"f of n equals g of n plus h of n","popup","f(n) = g(n) + h(n)","A-star score"],
  [8,3,"priority queue can reference","emoji","📄📄📄","Duplicate states"],
  [9,2,"refrigerator magnet","emoji","🧲","Weak directional guidance"],
  [10,2,"lower-bound price tag","popup","h(n) ≤ h*(n)","Never overestimate"],
  [11,4,"Acronyms cannot carry those assumptions","emoji","🔤⚠️","State the full algorithm"],
  [12,2,"A-star balances both ledgers","emoji","🧾 + 🧭","g plus h"],
  [13,4,"g layers match breadth-first depth layers","popup","h=0 ⇒ UCS; equal costs ⇒ BFS","Special-case chain"],
  [14,3,"Campus parking may feel non-Euclidean","emoji","🅿️🌀","The metric still needs proof"],
  [15,4,"one instrument, not the entire orchestra","emoji","🎻 🤖","Planner is one component"],
  [16,4,"grumpier optimization problem","emoji","🚆 😤","Real objectives add constraints"],
  [17,1,"f equals g plus zero","popup","f(n)=g(n)","Uniform-cost special case"],
  [18,2,"price tag that falls suspiciously faster","emoji","🏷️📉","Consistency violation"],
  [19,3,"leave CLOSED and reopen","popup","CLOSED → OPEN","Propagate improved g"],
  [20,2,"Manhattan therefore dominates","popup","hₘᵢₛ ≤ hₘₐₙ ≤ h*","Tighter safe bound"],
  [21,2,"magnificent heuristic department","emoji","🏢💸","Control cost can dominate"],
  [22,3,"category mismatch","popup","h property ≠ DFS property","Choose the right lens"],
  [23,4,"fixed deterministic graph assumption","emoji","♟️ 📈","Adversarial and stochastic limits"],
  [24,4,"deterministic or stochastic","popup","Observe · Change · Agents","Environment audit"],
  [25,4,"horoscope reading for priority queues","emoji","🔮🚫","Conditions before algorithm names"],
];
for (const [slide, segment, phrase, type, emoji, label] of visualMoments) {
  slides[slide - 1].segments[segment - 1].visualDesign.kinetics.push({ type, phrase, emoji, label, route: "center-hold", durationSeconds: 5.8 });
}

const click = (slide, segment, selector, index, label) => { slides[slide - 1].segments[segment - 1].action = { type: "click", selector, index, label }; };
const addSegment = (slide, text, action, selector, index, label) => {
  slides[slide - 1].segments.push({
    label,
    text: limitWords(text, 28),
    action,
    visualDesign: { focusSelector: selector, focusIndex: index, focusPhrase: phraseAt(text), focuses: [{ phrase: phraseAt(text), selector, index, label }], kinetics: [] },
  });
};

for (const slide of [4,5,7,8,9,10,13,18,20,21]) {
  click(slide, 2, ".search-source-image > button", 0, "Enlarge the source figure while explaining it");
  click(slide, 3, ".source-image-close", 0, "Close the enlarged source figure");
}
click(4,4,".tree-challenge .best-first-step-controls button",0,"Reveal the predicted greedy selection order");
click(6,1,".search-source-image > button",0,"Enlarge the exact greedy trace figure");
click(6,2,".source-image-close",0,"Close the enlarged greedy trace figure");
const greedyStepNarration = [
  "Advance from initialization and select A five. Its expansion inserts B four, C four, and D six into OPEN while A enters CLOSED. The next choice must come from those eligible records.",
  "Select B four by the displayed left-to-right tie rule. E five and F five join OPEN, but C four remains ahead because its heuristic is still smaller.",
  "Select C four. Its children include H three and G four, so H jumps to the front of OPEN. CLOSED now documents three completed expansions.",
  "Select H three and generate O two plus goal P three. O receives priority despite P being a goal because greedy ordering compares heuristic values before the goal test runs.",
  "Select O two. O fails the goal test and contributes no better candidate, so the search returns to the stored frontier rather than becoming trapped on this branch.",
  "Select P three from OPEN. The goal test now succeeds; follow parent links through H and C to A, then reverse them to obtain the forward solution path."
];
for (let step = 1; step <= 6; step += 1) addSegment(6, greedyStepNarration[step - 1], { type:"click", selector:".trace-source-layout .best-first-step-controls button", index:1, label:`Advance greedy trace to state ${step + 1}` }, ".trace-source-layout section", 0, `Greedy trace state ${step + 1}`);
click(11,2,".search-review-studio nav button",1,"Open the eight-puzzle admissibility question");
click(11,3,".search-review-studio nav button",2,"Open the BFS abbreviation question");
for (const slide of [14,15,16,17]) {
  click(slide,1,".replayable-source-animation .search-source-image > button",0,"Enlarge the animation before explaining it");
  click(slide,2,".source-image-close",0,"Close the enlarged animation");
  click(slide,3,".replayable-source-animation > div button",0,"Replay the source animation while narrating the visible search");
}
const reopenStepNarration = [
  "Expand S. A enters OPEN with g three and f three; B enters with g one and f four. Minimum f selects A first even though B begins a cheaper route.",
  "Expand A too early. It reaches G with total cost five and moves into CLOSED. That goal record is only a candidate because another frontier route may still improve it.",
  "Select B and discover B-to-A with new g two. This beats A's stored g three, so update A's parent, remove it from CLOSED, and restore frontier eligibility.",
  "Re-expand improved A. Its edge to G now produces goal cost four rather than five. The reopened record propagates the cheaper prefix into the descendant path.",
  "Select G at g four and finish with S-to-B-to-A-to-G. Compare this result with permanent CLOSED, which would have preserved the inferior cost-five route."
];
for (let step = 1; step <= 5; step += 1) addSegment(19, reopenStepNarration[step - 1], { type:"click", selector:".frontier-trace section > div button", index:1, label:`Advance reopen trace to state ${step + 1}` }, ".frontier-trace section, .frontier-queues article", step % 3, `Reopen trace state ${step + 1}`);
const propertyNarration = [
  "Open the consistency prompt for h-two. Use the heuristic lens and check every edge inequality h of n no greater than cost plus successor h; one violating edge is enough to reject the claim.",
  "Open the DFS consistency prompt. This is the deliberate category mismatch: DFS has no heuristic h to test here, so evaluate completeness, optimality, time, and space under its graph assumptions.",
  "Open the best-first completeness prompt. Name the exact variant before answering because greedy and A-star have different priorities, guarantees, and dependencies on cycles, branching, costs, and termination.",
  "Open algorithm A admissibility. In classical algorithm language, admissible means guaranteed to return an optimal solution; it is not the pointwise lower-bound inequality used to judge a heuristic function."
];
for (let index = 1; index <= 4; index += 1) addSegment(22, propertyNarration[index - 1], { type:"click", selector:".m6-question-sorter nav button", index, label:`Open property diagnosis ${index + 1}` }, ".m6-question-sorter div", 0, `Property diagnosis ${index + 1}`);
click(23,2,".m6-application-practice section button",0,"Reveal the autopilot analysis");
const applicationNarration = [
  ["Select the autonomous drone. Model grid cells or configurations as states, feasible motions as actions, and energy or distance as cost; then ask how wind and moving obstacles violate a fixed known map.", "Reveal the drone analysis. A-star is defensible for a discretized known planning map, while sensing and online replanning must handle uncertain motion, new obstacles, and changing local conditions."],
  ["Select the robot vacuum. A floor-plan cell can be a state and travel distance an edge cost, but point-to-point routing is different from complete coverage and safe interaction with people or pets.", "Reveal the vacuum analysis. A-star can route across a known map; mapping, coverage strategy, obstacle discovery, and reactive safety require additional algorithms around that route component."],
  ["Select chess. Board positions and legal moves form a graph, yet an opponent deliberately chooses alternating actions. Ordinary shortest-path search does not represent that strategic control of successor selection.", "Reveal the chess analysis. Use adversarial search such as minimax and alpha-beta because the other player optimizes against us; A-star's passive deterministic environment assumption is the wrong model."],
  ["Select financial investment. States, actions, and objectives can be written down, but returns are uncertain, observations incomplete, conditions dynamic, and risk essential. A single deterministic edge cost erases the central challenge.", "Reveal the investment analysis. Decision-theoretic, stochastic, sequential, and risk-aware models are needed; A-star alone may optimize a simplified subproblem but cannot justify the overall investment policy."]
];
for (let index = 1; index <= 4; index += 1) {
  addSegment(23, applicationNarration[index - 1][0], { type:"click", selector:".m6-application-practice nav button", index, label:`Select application ${index + 1}` }, ".m6-application-practice section", 0, `Application ${index + 1} model`);
  addSegment(23, applicationNarration[index - 1][1], { type:"click", selector:".m6-application-practice section button", index:0, label:`Reveal application ${index + 1} analysis` }, ".m6-application-practice .search-callout", 0, `Application ${index + 1} analysis`);
}

const script = { version: 1, lesson: "06", meeting: "06", course: "CPSC 481: Introduction to Artificial Intelligence", title: "Lesson 6: Best-First Search, A*, and Heuristic Quality", route: "/lessons/06", voice: { name: "Microsoft Aria Neural", engineVoice: "en-US-AriaNeural", provider: "Microsoft neural text to speech", gender: "female", culture: "en-US", speakingRate: 0.94, edgeTtsRate: "-6%" }, slides };
await writeFile(path.join(here, "lecture-script-aria.json"), JSON.stringify(script, null, 2) + "\n", "utf8");
const words = slides.flatMap(slide => slide.segments).reduce((total, segment) => total + (segment.text.match(/\S+/g)?.length ?? 0), 0);
const lines = ["# Lesson 06 video lecture script", "", "- Route: /lessons/06", "- Voice: Microsoft Aria Neural (en-US-AriaNeural)", "- Speaking rate: 0.94x (-6%)", "- Slides: " + slides.length, "- Narration words: " + words.toLocaleString("en-US"), "- Captions: burned in at the bottom of the final video", ""];
for (const slide of slides) {
  lines.push("## Slide " + String(slide.number).padStart(2, "0") + " - " + slide.title, "");
  for (const [index, segment] of slide.segments.entries()) {
    lines.push("### " + (index + 1) + ". " + segment.label, "");
    if (segment.action) lines.push("**Instructor action before narration:** " + segment.action.label + ".", "");
    lines.push(segment.text, "");
    if (segment.pauseAfterSeconds) lines.push("**Reflection pause:** " + segment.pauseAfterSeconds + " seconds.", "");
  }
}
await writeFile(path.join(here, "meeting-06-video-lecture-script-aria.md"), lines.join("\n").trim() + "\n", "utf8");
console.log(JSON.stringify({ slides: slides.length, segments: slides.flatMap(slide => slide.segments).length, words, averageWordsPerSlide: +(words/slides.length).toFixed(1) }, null, 2));
