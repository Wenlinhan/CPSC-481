import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const topics = [
  {
    title: "Alpha-Beta Pruning and Modern Game Search",
    selector: ".search-driving-question section, .search-driving-question article",
    paragraphs: [
      "Lesson eight begins with a promise that sounds suspiciously like a late-night advertisement: obtain the same minimax decision while examining less of the tree. Alpha-beta pruning keeps the minimax backup rule, terminal utilities, cutoff depth, and evaluation function. It saves work only when returned values prove that unexplored siblings cannot change an ancestor's choice.",
      "Picture a restaurant menu where your opponent has already guaranteed that your table will pay no more than twenty dollars. Discovering a branch whose meal costs at least thirty is enough; the opponent will refuse it. Alpha and beta are those remembered alternatives, and the pruning shears appear only after the arithmetic proves irrelevance.",
      "The four cards establish our contract. The result must be the same minimax action. The mechanism is a pair of path bounds. Efficiency depends on visitation order. Evidence is a trace of every recursive return. A cutoff based on vibes is not pruning; it is merely deleting homework with confidence.",
      "By the end, you should trace MAX-VALUE and MIN-VALUE, name beta and alpha cutoffs correctly, explain who owns each bound, verify equality with full minimax, and distinguish move ordering from model changes such as expectimax or Monte Carlo tree search. Every skipped subtree needs a proof and an ancestor alternative."
    ],
    kinetic: { phrase: "the pruning shears appear", type: "emoji", emoji: "✂️🌳", label: "Proof-driven pruning" },
  },
  {
    title: "Minimax may pursue branches whose values cannot matter",
    selector: ".algorithm-definition section, .algorithm-definition article, .search-callout",
    paragraphs: [
      "Depth-limited minimax normally evaluates every reachable leaf at its selected ply limit and backs each value toward the root. That is correct but expensive because the branching factor raises the tree size exponentially. Some leaves are evaluated even after an ancestor has an alternative that makes the entire branch strategically unacceptable.",
      "Imagine interviewing every applicant after one candidate has already met every requirement and the current branch has failed a mandatory test. More interviews cannot rescue that branch. Alpha-beta turns this administrative common sense into inequalities, but unlike a bored hiring committee, it must preserve the exact minimax answer.",
      "Notice what remains fixed: terminal utility, depth limit, evaluation function, legal moves, and the MAX-MIN backup operators. What changes is depth-first visitation plus the moment at which a bound closes. If any of those controlled ingredients change, a matching answer is no longer evidence that pruning alone caused the saving.",
      "The structural insight connects nonadjacent levels. A value discovered below a grandchild can prove that the intermediate choice will never be selected by an ancestor. We do not need the exact values of the skipped leaves; we need only establish that even their best possible influence cannot cross the existing alternative."
    ],
    kinetic: { phrase: "the tree size exponentially", type: "emoji", emoji: "🌳💥", label: "Exploding game tree" },
  },
  {
    title: "Alpha rises for MAX; beta falls for MIN",
    selector: ".algorithm-definition section, .algorithm-definition article, .search-callout",
    paragraphs: [
      "Alpha is the best value MAX can already guarantee along the active path. It is a lower bound because MAX has an explored alternative worth at least alpha. Beta is the best value MIN can already guarantee, meaning an upper bound on MAX's outcome because MIN can force the result to beta or less.",
      "Think of alpha as an elevator that only travels upward and beta as an elevator that only travels downward. Returned child values tighten the decision window from both sides. Nobody presses a reverse button: alpha never decreases, and beta never increases while the current path remains active.",
      "The displayed interval says alpha is no greater than any still decision-relevant backed-up value, which is no greater than beta. When alpha meets or exceeds beta, the window has closed. Remaining siblings may contain fascinating numbers, dramatic plot twists, or free snacks, but they cannot alter the ancestor decision.",
      "Keep utility from MAX's fixed perspective throughout the tree. MIN does not suddenly call a good score positive for itself and flip the signs unless the representation explicitly uses negamax. In this pseudocode, MAX maximizes one utility scale and MIN minimizes that same scale."
    ],
    kinetic: { phrase: "elevator that only travels upward", type: "popup", label: "Monotone bounds", text: "α rises · β falls" },
  },
  {
    title: "Finish a child, return its value, then update the parent",
    selector: ".frontier-trace section, .frontier-queues article",
    paragraphs: [
      "Alpha-beta is depth-first. It chooses one child, descends until a terminal or cutoff state supplies a value, returns that value to the immediate parent, and only then updates the parent's temporary value and bound. It does not sample every sibling at one level before descending, because incomplete children establish no usable backed-up value.",
      "The stack behaves like a set of nested phone calls. The leaf answers its parent; the parent updates its own notes and later calls its parent. A leaf does not shout directly to the root across three unfinished conversations. That shortcut would mix values owned by different decision nodes.",
      "At a terminal state return exact utility. At a depth cutoff return the evaluation function used by ordinary depth-limited minimax. After a MIN child returns, MAX updates v and perhaps alpha. After a MAX child returns, MIN updates v and perhaps beta. Bound updates are consequences of completed evidence.",
      "Use the live control as a proof rehearsal. Before each click, state the next node, current alpha and beta, and which variable may change on return. If your spoken prediction names a sibling before the active child finishes, your trace has quietly become breadth-first and the pruning logic will wander off wearing someone else's nametag."
    ],
    kinetic: { phrase: "nested phone calls", type: "emoji", emoji: "📞↩️", label: "Return one level at a time" },
  },
  {
    title: "A cutoff says an ancestor already has a better alternative",
    selector: ".search-objectives article",
    paragraphs: [
      "At a MAX node, stop when its temporary value v reaches or exceeds beta. This is a beta cutoff. A MIN ancestor already possesses an alternative that keeps MAX at beta or below, so MIN will never allow the current branch whose MAX value is at least beta.",
      "The family-veto metaphor helps. MAX is excited because this branch offers seven, but the ancestor MIN says, charming story, I can choose another route capped at six. MAX may find nine or ninety among the remaining children; MIN still rejects the branch. The skipped siblings cannot help the root decision.",
      "At a MIN node, stop when v falls to or below alpha. This is an alpha cutoff. A MAX ancestor already owns an alternative worth alpha or more, so MAX will never choose a branch where MIN can hold the result to alpha or less. The inequalities mirror the players' preferences.",
      "Names come from the ancestor bound that triggers the proof: beta cutoff at MAX, alpha cutoff at MIN. Do not rename them according to the node's favorite variable or which Greek letter feels more photogenic. State the inequality, the ancestor, and the existing alternative every time."
    ],
    kinetic: { phrase: "The family-veto metaphor", type: "emoji", emoji: "🙅‍♀️🎮", label: "Ancestor rejects the branch" },
  },
  {
    title: "MAX returns as soon as its value reaches beta",
    selector: ".algorithm-source-layout .search-source-image, .algorithm-source-layout section, .search-callout",
    paragraphs: [
      "MAX-VALUE begins with v equal to negative infinity. For each legal action, it recursively asks MIN-VALUE for the child result and replaces v with the larger of its current value and that return. This is ordinary minimax until the upper bound supplied by a MIN ancestor becomes decisive.",
      "Read the return test before the alpha update. If v is at least beta, return v immediately. The remaining children are irrelevant because the MIN ancestor can avoid this branch. Only when the search continues does alpha become the larger of its prior value and v.",
      "The order matters in code and on an exam. First receive the child value, then update v, then test v against beta, then update alpha if another child may be explored. Moving the test before v changes can miss a cutoff; updating the wrong bound can manufacture one from thin air.",
      "At the root, Alpha-Beta-Search calls MAX-VALUE with negative infinity and positive infinity. No ancestor has yet established an alternative, so the first root child cannot be pruned by a preexisting finite bound. Useful root alpha appears only after a complete child returns."
    ],
    kinetic: { phrase: "manufacture one from thin air", type: "emoji", emoji: "🎩🐇", label: "Never invent a cutoff" },
  },
  {
    title: "At MAX, v ≥ β proves that remaining siblings cannot help",
    selector: ".frontier-trace section, .frontier-queues article",
    paragraphs: [
      "This compact trace gives MAX an incoming alpha of three and beta of six. MAX starts at negative infinity and has children valued three, seven, and nine. The question is not which child is largest in the completed list; it is how soon the incoming ceiling makes later work irrelevant.",
      "After child three returns, v becomes three. Three is below beta six, so MAX cannot yet prove that MIN will reject this branch. Alpha remains or becomes three, and child seven still matters. The interval is open, so the recursion must continue.",
      "After child seven returns, v becomes seven. Now seven is at least beta six. The MIN ancestor already has an alternative worth at most six, so it will never choose the route permitting MAX to obtain seven. Child nine is skipped without changing the returned minimax decision.",
      "Notice the saving is one child evaluation, not mystical disappearance of the whole universe. Report evaluated children three and seven, returned bound at least seven, skipped child nine, cutoff type beta, and the MIN ancestor's six-valued alternative. That complete sentence is the proof."
    ],
    kinetic: { phrase: "The interval is open", type: "popup", label: "MAX cutoff test", text: "continue while v < β" },
  },
  {
    title: "MIN returns as soon as its value falls to alpha",
    selector: ".algorithm-source-layout .search-source-image, .algorithm-source-layout section, .search-callout",
    paragraphs: [
      "MIN-VALUE mirrors MAX-VALUE. It initializes v to positive infinity, asks MAX-VALUE for each successor, and keeps the smaller returned value. Its incoming alpha summarizes an alternative already guaranteed by a MAX ancestor, so sufficiently low evidence makes the current branch unacceptable to MAX.",
      "After updating v, MIN tests whether v is at most alpha. If so, return v immediately: an alpha cutoff. If search continues, beta becomes the smaller of beta and v. The comparisons reverse because MIN seeks lower utility on MAX's fixed scale.",
      "The visible pseudocode is worth enlarging because one inequality controls the entire proof. Trace the line that obtains a child value, the min operation, the v less-than-or-equal-to-alpha return, and the beta update. Read them in execution order, not as four inspirational quotes arranged vertically.",
      "Do not switch the meaning of utility at MIN levels. A value of negative ten is bad for MAX and therefore attractive to MIN. The algorithm represents that preference by taking a minimum, not by relabeling whose happiness the number describes after every ply."
    ],
    kinetic: { phrase: "four inspirational quotes", type: "emoji", emoji: "📜😄", label: "Execute pseudocode in order" },
  },
  {
    title: "At MIN, v ≤ α proves that remaining siblings cannot hurt MAX",
    selector: ".frontier-trace section, .frontier-queues article",
    paragraphs: [
      "The MIN trace arrives with alpha four and beta nine. Its children return eight, two, and zero. MIN begins at positive infinity because any real returned value will improve its minimizing choice. Again, we stop when evidence crosses the ancestor's existing alternative, not merely when a number looks small.",
      "After eight returns, v becomes eight and beta tightens from nine to eight. Eight remains above alpha four, so MAX might still prefer this root branch if later MIN children stay high. The next child must be evaluated; no cutoff has been earned.",
      "After two returns, v becomes two. Since two is at most alpha four, the MAX ancestor already guarantees four elsewhere and will never choose a route where MIN can force two. This alpha cutoff skips the final child zero, even though zero would make MIN happier.",
      "Report the exact proof: evaluated eight and two, current MIN value two, alpha four from a MAX ancestor, inequality two less than or equal to four, skipped zero, returned bound at most two. That language connects arithmetic to agency instead of treating Greek letters as decorative algebra confetti."
    ],
    kinetic: { phrase: "decorative algebra confetti", type: "emoji", emoji: "αβ🎉", label: "Bounds carry decisions" },
  },
  {
    title: "Alpha and beta summarize alternatives outside the current subtree",
    selector: ".algorithm-definition section, .algorithm-definition article, .search-callout",
    paragraphs: [
      "The active alpha-beta window is path memory. Alpha records a completed alternative available to some MAX ancestor; beta records a completed alternative available to some MIN ancestor. Neither number predicts an unseen child. Both summarize choices outside the subtree currently being searched.",
      "Think of courtroom precedent rather than a crystal ball. A returned value creates evidence that constrains what can matter next. Before any child returns, there is no legal basis for filtering values merely because they appear above alpha or below beta in the drawing.",
      "The temporary v belongs to the current node. At MAX it rises as children return; at MIN it falls. A cutoff occurs only when this evidence closes the inherited window. The correct procedure examines children in order until the inequality is established, then skips what remains.",
      "A common misconception says examine only values between alpha and beta. That assumes leaf values are known before evaluation, which defeats the point of search. Bounds prune subtrees after recursive evidence arrives; they do not scan a hidden answer key and preselect the fashionable numbers."
    ],
    kinetic: { phrase: "courtroom precedent rather than a crystal ball", type: "emoji", emoji: "⚖️🔮", label: "Evidence, not prediction" },
  },
  {
    title: "Move ordering changes work, not the minimax answer",
    selector: ".evaluation-matrix > div",
    paragraphs: [
      "Alpha-beta's result is order invariant under the same depth, evaluation, utilities, and legal actions, but its workload is not. MAX benefits when high-valued moves are searched early because alpha rises quickly. MIN benefits when low-valued moves come early because beta falls quickly.",
      "Imagine packing a suitcase with the bulkiest item first. You discover the capacity constraint immediately instead of arranging twelve socks and meeting the same problem later. Good move ordering exposes decisive bounds early; bad ordering postpones them until most of the tree has already submitted expense reports.",
      "A move-ordering heuristic predicts which actions are promising for visitation. It does not replace the cutoff evaluation function and does not change minimax's backup rule. The heuristic may cost time itself, so measure leaf savings, internal nodes, elapsed time, and ordering overhead rather than celebrating one smaller count.",
      "Read across the matrix. Best-first ordering tries strong MAX and weak MIN moves early, producing tight bounds. Worst-first ordering often approaches full minimax. In both columns the legal actions, cutoff depth, evaluation function, and final minimax result remain controlled invariants."
    ],
    kinetic: { phrase: "packing a suitcase with the bulkiest item first", type: "emoji", emoji: "🧳📦", label: "Expose constraints early" },
  },
  {
    title: "Start left-to-right with no bounds at the root",
    selector: ".algorithm-definition section, .algorithm-definition article, .search-callout",
    paragraphs: [
      "The worked tree starts at a MAX root with alpha negative infinity and beta positive infinity. Search proceeds left to right through three MIN children. Because the root has no finite ancestor ceiling, its first completed child establishes the first useful alpha rather than triggering a root cutoff.",
      "Prepare a trace with columns for node, temporary v, alpha, beta, returned value, and skipped siblings. The left MIN child owns leaves three, twelve, and eight. The middle child begins with two. The right child receives fourteen, five, and two in that order.",
      "Before each leaf, predict which node owns the next update. MIN keeps the smallest child return; MAX keeps the largest completed branch value. Alpha changes at the root only after a MIN child finishes. Beta changes inside each MIN branch as its leaves arrive.",
      "This bookkeeping may feel fussy, but it prevents time travel. If you use the future leaf two while analyzing the earlier leaf fourteen, you have granted the algorithm spoilers. Alpha-beta knows only completed returns in visitation order, so our trace must respect the same information boundary."
    ],
    kinetic: { phrase: "you have granted the algorithm spoilers", type: "emoji", emoji: "🚫🔮", label: "No future leaf values" },
  },
  {
    title: "The first MIN branch sets β=3 and root α=3",
    selector: ".tree-challenge .search-source-image, .tree-challenge section, .search-callout",
    paragraphs: [
      "In the left branch, MIN first sees three, so its temporary value and beta become three. The next leaf twelve is larger and therefore cannot improve MIN's choice; beta remains three. Leaf eight is also larger, leaving the branch value unchanged.",
      "The complete MIN child returns three to the MAX root. Now the root updates alpha from negative infinity to three. That means MAX has a legal explored alternative guaranteeing at least three, and every later MIN branch will inherit this floor.",
      "No pruning occurred inside the first branch because root alpha was not finite while its leaves were being searched. The branch had to finish before it could create the alternative used against later siblings. Good evidence arrives after work; it is not issued as a complimentary starter coupon.",
      "Read the enlarged figure in event order: leaf three, beta three; leaf twelve, beta still three; leaf eight, beta still three; return three; root alpha three. Close the figure only after each number has an owner and a direction of update."
    ],
    kinetic: { phrase: "complimentary starter coupon", type: "emoji", emoji: "🎟️α", label: "First branch earns alpha" },
  },
  {
    title: "Seeing 2 at MIN is enough to skip its remaining siblings",
    selector: ".tree-challenge .search-source-image, .tree-challenge section, .search-callout",
    paragraphs: [
      "The middle MIN node inherits root alpha three. Its first visited leaf returns two, so MIN's v and beta become two. Immediately beta two is less than or equal to alpha three. The inherited window closes after only one leaf.",
      "The ancestor explanation is the heart of the cutoff. MAX already has the completed left alternative worth three. This middle branch lets MIN force two or less, so MAX will never choose it. Any remaining middle siblings can only keep or lower MIN's result, never raise it above three.",
      "This is an alpha cutoff at a MIN node. Mark the two unvisited siblings as skipped, return a bound of at most two, and leave root alpha at three. The root does not replace its better branch with a worse one merely because the worse branch arrived wearing a dramatic inequality.",
      "Use the enlarged tree to distinguish drawn from evaluated. The skipped leaves remain visible because the game tree contains them, but the search never requests their evaluation. A diagram shows possible structure; a trace records actual computation."
    ],
    kinetic: { phrase: "arrived wearing a dramatic inequality", type: "emoji", emoji: "🎭≤", label: "A cutoff still needs preference" },
  },
  {
    title: "The third MIN branch first establishes an upper bound of 14",
    selector: ".tree-challenge .search-source-image, .tree-challenge section, .search-callout",
    paragraphs: [
      "The third MIN branch also inherits root alpha three. Its first leaf returns fourteen, so v and beta become fourteen. Test beta less than or equal to alpha: fourteen is not less than or equal to three. The decision window remains open.",
      "A large first value at MIN is not a reason to stop. Later siblings may lower MIN's result dramatically, perhaps below the root's established alternative. MIN has not completed its choice, and MAX cannot yet know whether this branch will beat three.",
      "The situation resembles an auction where the first bid is high but lower bids are still permitted and the buyer always chooses the cheapest. Declaring victory after fourteen would misunderstand whose preference controls the node. MIN waits for smaller evidence.",
      "In the enlarged image, point to root alpha three and local beta fourteen simultaneously. The cutoff condition compares those two path bounds; it does not compare fourteen with a random neighboring leaf or with negative infinity remembered from the root's initial call."
    ],
    kinetic: { phrase: "auction where the first bid is high", type: "emoji", emoji: "🔨14", label: "MIN waits for a lower bid" },
  },
  {
    title: "A second child tightens beta from 14 to 5",
    selector: ".tree-challenge .search-source-image, .tree-challenge section, .search-callout",
    paragraphs: [
      "The next leaf returns five. MIN updates v and beta to the smaller of fourteen and five, so beta becomes five. This confirms monotonicity: beta moved downward and did not rebound merely because fourteen had enjoyed a brief career as the current value.",
      "Compare beta five with root alpha three. Five is still greater, so the window remains open. The third child can lower the branch to two, which would make MAX reject it, or remain above three, which might let this branch replace the root's current choice.",
      "This intermediate state is pedagogically valuable because it resists button-mashing. Not every bound update creates a cutoff. We update, test, and continue when the inequality is false. Alpha-beta is a proof procedure, not a machine that becomes more pruney whenever Greek letters appear.",
      "Enlarge the figure and say the invariant aloud: root alpha stays three; local beta decreases from fourteen to five; five is greater than three; one sibling remains relevant. Then close the figure and preserve those values for the final step."
    ],
    kinetic: { phrase: "a brief career as the current value", type: "emoji", emoji: "14➡️5", label: "Beta tightens" },
  },
  {
    title: "β reaches 2, but no remaining work is left to save",
    selector: ".tree-challenge .search-source-image, .tree-challenge section, .search-callout",
    paragraphs: [
      "The final leaf returns two, so MIN lowers beta from five to two. Now beta two is less than or equal to root alpha three. The cutoff condition is true, and the branch returns at most two to the root.",
      "However, the triggering leaf was already the last child. There are no remaining siblings to skip. The inequality proves that additional work would be irrelevant, but zero additional work exists. This is the algorithmic equivalent of announcing that the store is closed after the final customer has left.",
      "Precise analysis separates a cutoff condition from pruning benefit. Record that the condition holds late and saves zero evaluations. Root MAX compares its completed alternative three with the middle bound at most two and the right value two, so the final root value remains three.",
      "Inspect the completed tree and count actual leaves evaluated versus skipped. The middle branch produced the useful saving; this late right-branch closure did not. A good performance report measures work, not the number of times someone circled alpha and beta with an enthusiastic marker."
    ],
    kinetic: { phrase: "the triggering leaf was already the last child", type: "emoji", emoji: "🏪🔒", label: "True cutoff, zero savings" },
  },
  {
    title: "A large MIN value does not trigger an alpha cutoff",
    selector: ".search-quick-check section, .search-quick-check button",
    paragraphs: [
      "The concept check gives root MAX an existing alpha of three and asks about a new MIN child whose leaves are eight and ten. After MIN sees eight, its beta becomes eight. The correct test is beta less than or equal to alpha, not whether the number feels impressively large.",
      "Eight is not less than or equal to three, so there is no alpha cutoff. MIN must inspect the next child. Ten does not lower its temporary value, so MIN returns eight, and root MAX can then raise alpha from three to eight.",
      "Option A reverses the logic by treating a value larger than alpha as a stopping condition. Option C invents a cutoff after every completed child. Only option B names the real issue: MIN has not fallen to alpha or below, so the ancestor cannot yet reject the branch.",
      "We will click every option, not because uncertainty deserves three trophies, but because feedback is part of the lesson. For each response, locate the same invariant: local beta eight, ancestor alpha three, open interval, next leaf still capable of affecting MIN's returned value."
    ],
    kinetic: { phrase: "uncertainty deserves three trophies", type: "emoji", emoji: "🏆🏆🏆", label: "Test every misconception" },
  },
  {
    title: "A MAX value that reaches beta ends the remaining sibling search",
    selector: ".search-quick-check section, .search-quick-check button",
    paragraphs: [
      "Now a MAX node receives beta four from a MIN ancestor, and its first child returns eight. MAX sets v to eight and tests v greater than or equal to beta. Eight is at least four, so the window closes immediately.",
      "This is a beta cutoff because the proof uses the MIN ancestor's beta bound. MIN already has an alternative that caps MAX at four, so it will never permit a branch giving MAX eight or more. Remaining MAX children cannot make this branch more acceptable to MIN.",
      "Option A states the correct inequality and action. Option B misnames the cutoff by mentioning alpha even though the decisive inherited bound is beta. Option C incorrectly demands every child, erasing the entire advantage of alpha-beta after the proof is already complete.",
      "As we click each option, keep the causal sentence stable: MAX found eight, MIN can choose a route capped at four, therefore MIN rejects this branch, therefore MAX's remaining siblings are irrelevant. Arithmetic, agent preference, and skipped work must travel together."
    ],
    kinetic: { phrase: "Arithmetic, agent preference, and skipped work", type: "popup", label: "Complete cutoff proof", text: "inequality → ancestor choice → skipped work" },
  },
  {
    title: "Every skipped subtree follows from a completed bound",
    selector: ".trace-source-layout .search-source-image, .trace-source-layout section, .search-callout",
    paragraphs: [
      "The hypothetical state space combines several cutoffs in one depth-first proof. Nodes without numerical results are not mysterious zeros; they were never evaluated. We must follow the active path, identify each completed return, and state which inherited bound makes the next subtree irrelevant.",
      "Begin at MIN node A. Its first completed MAX child returns three, so A has beta three. Inside MAX node B, the first leaf returns five. Five reaches beta three, producing a beta cutoff that skips B's remaining leaf because A will prefer its alternative at three or less.",
      "A returns three to root MAX node C, establishing alpha three. MIN node D then receives a first completed child value zero. Zero is at most alpha three, so D has an alpha cutoff. MIN node E similarly reaches two and cuts off its remaining subtree.",
      "Finally C returns max of the decision-relevant branch results, equal to three. Full minimax at the same depth and evaluation also returns three. The trace demonstrates both labels: beta cutoff at MAX B, alpha cutoffs at MIN D and E, all justified by completed alternatives."
    ],
    kinetic: { phrase: "Nodes without numerical results", type: "emoji", emoji: "🌳🚫🔢", label: "Unvisited is not zero" },
  },
  {
    title: "Correct alpha-beta must agree with full minimax",
    selector: ".evaluation-matrix > div",
    paragraphs: [
      "Verification needs an oracle, and full minimax supplies one for small controlled trees. Run both algorithms with identical legal actions, terminal utilities, cutoff depth, and evaluation function. Then compare root value, selected action, and evaluated work.",
      "Root values must match exactly. Selected actions must match unless equal-valued ties permit more than one correct move under different ordering. Alpha-beta should evaluate no more leaves than full minimax, though a poor ordering may produce almost no saving.",
      "Comparing only current and parent heuristic values is insufficient. Those local numbers can look reasonable while a bound is updated at the wrong node or a subtree is pruned under the wrong ancestor. The final decision plus an event-level trace reveals those implementation errors.",
      "Treat testing like a science experiment. Hold depth and evaluation fixed, vary ordering, count leaves and internal nodes, and assert the same decision. If the answer changes with ordering, the program has not discovered a bold new game strategy; it has discovered a bug."
    ],
    kinetic: { phrase: "Treat testing like a science experiment", type: "emoji", emoji: "🧪✅", label: "Controlled comparison" },
  },
  {
    title: "Ordering reduces evaluations; other game models change the backup rule",
    selector: ".algorithm-map article, .algorithm-map aside",
    paragraphs: [
      "Poor ordering delays useful bounds, so alpha-beta approaches full minimax work. Good ordering searches likely strong MAX moves and likely weak MIN moves first, tightening alpha or beta early. Either visitation order returns the same deterministic depth-limited minimax result when the implementation is correct.",
      "Measure more than leaf count. Record internal nodes, elapsed time, memory, and the cost of computing the ordering heuristic. A brilliant ordering routine that spends an hour ranking moves before saving twelve milliseconds has optimized the lecture example but perhaps not the product.",
      "Expectimax changes the model by adding chance nodes that back up probability-weighted expected utility. This is appropriate when nature, dice, or uncertain outcomes select successors according to known probabilities rather than an adversary choosing the worst response.",
      "Monte Carlo tree search selectively grows a tree through repeated selection, expansion, simulation, and backup. It is not an alpha-beta shortcut pasted onto deterministic minimax. Changing visitation order preserves the backup rule; expectimax and MCTS change what evidence is collected or how values are backed up."
    ],
    kinetic: { phrase: "dice, or uncertain outcomes", type: "emoji", emoji: "🎲📊", label: "Chance changes the backup" },
  },
  {
    title: "Apply alpha-beta left-to-right to the complete practice tree",
    selector: ".algorithm-source-layout .search-source-image, .algorithm-source-layout section, .search-callout",
    paragraphs: [
      "The practice tree has a MAX root, three MIN children, nested MAX nodes, and fifteen leaves. Visit every edge left to right. Submit an event trace, not only a root number, because the location and justification of each cutoff are the assessed skills.",
      "For every internal node, record temporary v, incoming alpha and beta, the updated bound after each child, and any skipped subtree. Mark whether the cutoff is beta at MAX or alpha at MIN, and write the exact inequality that closes the window.",
      "The leaf sequence is five, two, ten, eleven, one, two, two, eight, six, five, twelve, four, three, twenty-five, and two, grouped by the branches in the image. Do not flatten those numbers into one list when computing backups; parent ownership determines every min and max.",
      "Your final report needs the root value, chosen branch, evaluated-leaf count, skipped-leaf count, and a statement about ordering. A different legal order may change which leaves are visited and how soon cutoffs appear, but it cannot change the depth-limited minimax result."
    ],
    kinetic: { phrase: "Submit an event trace, not only a root number", type: "emoji", emoji: "🧾🌳", label: "Show the proof trail" },
  },
  {
    title: "The practice tree returns 5 after evaluating nine of fifteen leaves",
    selector: ".search-reveal section, .search-reveal li",
    paragraphs: [
      "The reveal sequence checks the independent trace one proof at a time. The left MIN branch returns five, the middle branch is bounded at two, the right branch tightens to four, and root MAX chooses five. Do not reveal ahead of your own reasoning; prediction turns animation into evidence.",
      "On the left, the first MAX child returns five from leaves five and two. In the second MAX child, leaf ten reaches the MIN node's beta five, so a beta cutoff skips eleven. The completed left MIN result is five, establishing root alpha five.",
      "The middle MIN branch's first MAX child returns two from one, two, and two. Since two is at most root alpha five, an alpha cutoff skips the eight subtree and the six-five subtree. The right branch later tightens from twelve to four and cuts off its final twenty-five-two child.",
      "The root returns max of five, at most two, and four, equal to five. Nine of fifteen leaves were evaluated. Full minimax returns the same value and action. Each click should add one auditable claim, not merely make another card stop looking shy."
    ],
    kinetic: { phrase: "another card stop looking shy", type: "emoji", emoji: "🫣➡️📋", label: "Reveal with a reason" },
  },
  {
    title: "A cutoff is a proof that remaining work cannot change the choice",
    selector: ".search-exit article, .search-exit aside",
    paragraphs: [
      "The exit task asks for three linked skills. Explain one beta cutoff and one alpha cutoff by naming the ancestor alternative. Trace v, alpha, and beta through the exact child return that closes the window. Verify that the pruned result matches full minimax under identical settings.",
      "A useful summary is inequality, owner, consequence. For v at least beta at MAX, a MIN ancestor owns the beta alternative, so remaining MAX siblings are skipped. For v at most alpha at MIN, a MAX ancestor owns the alpha alternative, so remaining MIN siblings are skipped.",
      "Move ordering changes running time because strong early evidence tightens bounds, but it does not change the minimax decision. Expectimax, MCTS, and other extensions answer different modeling needs by changing backup or sampling. Choose them because the environment differs, not because alpha and beta have become unfashionable.",
      "Before leaving, identify one operation you can perform without peeking: update bounds, label a cutoff, trace the practice tree, or design a verification test. The durable idea is simple: search may skip work only after completed evidence proves that the skipped work cannot change the chosen action."
    ],
    kinetic: { phrase: "inequality, owner, consequence", type: "popup", label: "Cutoff explanation", text: "inequality · owner · consequence" },
  },
];

const labels = ["Concept framing", "Mechanism and metaphor", "Boundary and proof", "Transfer and takeaway"];
const focusCounts = [5,5,5,3,3,4,4,4,4,5,5,5,3,3,3,3,3,4,4,3,5,5,4,6,4];
const phraseAt = text => text.trim().split(/\s+/).slice(0, 6).join(" ");
const slides = topics.map((topic, slideIndex) => ({
  number: slideIndex + 1,
  title: topic.title,
  segments: topic.paragraphs.map((text, segmentIndex) => ({
    label: labels[segmentIndex],
    text,
    visualDesign: {
      focusSelector: topic.selector,
      focusIndex: segmentIndex % focusCounts[slideIndex],
      focusPhrase: phraseAt(text),
      focuses: [{ phrase: phraseAt(text), selector: topic.selector, index: segmentIndex % focusCounts[slideIndex], label: labels[segmentIndex] }],
      kinetics: topic.kinetic && text.includes(topic.kinetic.phrase) ? [{ ...topic.kinetic, phrase: topic.kinetic.phrase, route: "center-hold", durationSeconds: 5.8 }] : [],
    },
  })),
}));

function actionSegment(slideNumber, text, action, focusSelector, focusIndex, label) {
  slides[slideNumber - 1].segments.push({
    label,
    text,
    action,
    visualDesign: {
      focusSelector,
      focusIndex,
      focusPhrase: phraseAt(text),
      focuses: [{ phrase: phraseAt(text), selector: focusSelector, index: focusIndex, label }],
      kinetics: [],
    },
  });
}

const imageSlides = [6,8,13,14,15,16,17,20,23];
for (const slideNumber of imageSlides) {
  actionSegment(slideNumber, "Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.", { type:"click", selector:".search-source-image > button", index:0, label:"Enlarge the instructional source figure" }, ".source-image-lightbox", 0, "Interactive figure enlargement");
  actionSegment(slideNumber, "Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.", { type:"click", selector:".source-image-close", index:0, label:"Close the enlarged instructional source figure" }, topics[slideNumber-1].selector, 0, "Figure-to-trace synthesis");
}

const depthStates = [
  "Advance to the MIN child. The active path is one ply deeper, but alpha and beta remain negative and positive infinity because no completed child value has returned. This demonstrates that descending alone does not update a bound.",
  "Advance to the terminal or cutoff state. Return exact utility at a terminal node or the agreed evaluation at the depth limit. This leaf result is evidence, but it still belongs first to its immediate parent.",
  "Advance through the return to MIN. MIN incorporates the child result and lowers beta when appropriate. Only now can it test beta against inherited alpha and decide whether another sibling remains relevant.",
  "Advance back to the MAX root. MAX incorporates the completed MIN result and raises alpha when appropriate. The trace has returned one edge at a time, preserving ownership of every temporary value and bound."
];
for (let i=0;i<depthStates.length;i++) actionSegment(4, depthStates[i], {type:"click",selector:".frontier-trace section > div button",index:1,label:`Advance depth-first demonstration to state ${i+2}`}, ".frontier-trace section, .frontier-queues article", (i+1)%3, `Depth-first state ${i+2}`);

const maxStates = [
  "Advance after evaluating child three. MAX updates v to three, which remains below beta six. The interval stays open, so seven must still be evaluated; child nine remains waiting behind it.",
  "Advance after evaluating child seven. MAX updates v to seven and proves seven is at least beta six. The MIN ancestor rejects this branch, producing a beta cutoff that skips child nine."
];
for(let i=0;i<maxStates.length;i++) actionSegment(7,maxStates[i],{type:"click",selector:".frontier-trace section > div button",index:1,label:`Advance MAX cutoff trace to state ${i+2}`},".frontier-trace section, .frontier-queues article",(i+1)%4,`MAX trace state ${i+2}`);

const minStates = [
  "Advance after evaluating child eight. MIN lowers v and beta to eight, but eight remains above alpha four. The proof is incomplete, so child two must still be evaluated.",
  "Advance after evaluating child two. MIN lowers v to two and proves two is at most alpha four. The MAX ancestor keeps its four-valued alternative, so an alpha cutoff skips child zero."
];
for(let i=0;i<minStates.length;i++) actionSegment(9,minStates[i],{type:"click",selector:".frontier-trace section > div button",index:1,label:`Advance MIN cutoff trace to state ${i+2}`},".frontier-trace section, .frontier-queues article",(i+1)%4,`MIN trace state ${i+2}`);

const alphaChoices = [
  "Choose option A to expose the first misconception. Eight being larger than alpha is not an alpha-cutoff condition at MIN. The feedback should send us back to beta eight less than or equal to alpha three, which is false.",
  "Choose option B. This is correct: MIN has not fallen to alpha or below, so the next leaf remains relevant. After ten, MIN still returns eight and root MAX may raise alpha.",
  "Choose option C to test the automatic-cutoff misconception. Completing one MIN child updates evidence but does not guarantee a cutoff. The inherited inequality must close before siblings can be skipped."
];
for(let i=0;i<3;i++) actionSegment(18,alphaChoices[i],{type:"click",selector:".search-quick-check button",index:i,label:`Select alpha-cutoff answer ${String.fromCharCode(65+i)}`},".search-quick-check button, .search-check-feedback",i,`Alpha-cutoff option ${String.fromCharCode(65+i)}`);

const betaChoices = [
  "Choose option A. Correct: v equals eight at MAX, beta equals four from a MIN ancestor, and eight is at least four. A beta cutoff returns immediately and skips the remaining MAX children.",
  "Choose option B to expose the naming error. A large value is not automatically an alpha cutoff. The decisive bound is beta, owned by MIN, so the standard name is beta cutoff.",
  "Choose option C to expose full-tree thinking. Alpha-beta does not evaluate every child after the ancestor preference is proven. Requiring all siblings would preserve minimax correctness while throwing away the pruning benefit."
];
for(let i=0;i<3;i++) actionSegment(19,betaChoices[i],{type:"click",selector:".search-quick-check button",index:i,label:`Select beta-cutoff answer ${String.fromCharCode(65+i)}`},".search-quick-check button, .search-check-feedback",i,`Beta-cutoff option ${String.fromCharCode(65+i)}`);

const hypotheticalStates = [
  "Advance to the beta cutoff inside B. B is MAX, its first leaf returns five, and inherited beta is three from MIN node A. Five reaches beta, so B's remaining leaf is skipped.",
  "Advance to root update C. A returns three, giving root MAX an explored alternative and alpha three. This newly earned floor will control the later MIN branches.",
  "Advance to D. Its first completed child returns zero, so MIN node D has v zero at most root alpha three. An alpha cutoff skips D's remaining subtree.",
  "Advance to E. Its first completed child returns two, again at most root alpha three. The same ancestor alternative justifies another alpha cutoff, though the local returned bound differs.",
  "Advance to the final root value. C returns max of the decision-relevant branch results, equal to three, matching full minimax at the same depth and with the same evaluation function."
];
for(let i=0;i<hypotheticalStates.length;i++) actionSegment(20,hypotheticalStates[i],{type:"click",selector:".trace-source-layout .best-first-step-controls button",index:1,label:`Advance hypothetical proof to state ${i+2}`},".trace-source-layout section, .search-callout",i%2,`Hypothetical proof state ${i+2}`);

const revealStates = [
  "Reveal the left MIN result. The first MAX child returns five; the second reaches beta five when leaf ten appears, so eleven is skipped. The completed MIN branch returns five and root alpha becomes five.",
  "Reveal the middle result. Its first MAX child returns two from one, two, and two. Since two is at most root alpha five, an alpha cutoff skips the eight branch and the six-five branch.",
  "Reveal the right branch's first tightening. Its first MAX child returns twelve. The next child returns max of four and three, equal to four, so the right MIN beta falls from twelve to four.",
  "Reveal the right-branch cutoff. Beta four is at most root alpha five, so the final MAX child containing twenty-five and two is skipped. The ancestor already prefers the left branch worth five.",
  "Reveal the root decision. MAX chooses max of five, at most two, and four, equal to five. Nine of fifteen leaves were evaluated, and full minimax agrees on both value and action."
];
for(let i=0;i<revealStates.length;i++) actionSegment(24,revealStates[i],{type:"click",selector:".search-reveal section > div button",index:0,label:`Reveal practice proof step ${i+1}`},".search-reveal li",i,`Practice reveal ${i+1}`);

const script = {
  version: 1,
  lesson: "08",
  meeting: "08",
  course: "CPSC 481: Introduction to Artificial Intelligence",
  title: "Lesson 8: Alpha-Beta Pruning and Modern Game Search",
  route: "/lessons/08",
  voice: { name:"Microsoft Aria Neural", engineVoice:"en-US-AriaNeural", provider:"Microsoft neural text to speech", gender:"female", culture:"en-US", speakingRate:0.94, edgeTtsRate:"-6%" },
  slides,
};

await writeFile(path.join(here,"lecture-script-aria.json"),JSON.stringify(script,null,2)+"\n","utf8");
const words=slides.flatMap(s=>s.segments).reduce((n,s)=>n+(s.text.match(/\S+/g)?.length??0),0);
const lines=["# Lesson 08 video lecture script","","- Route: /lessons/08","- Voice: Microsoft Aria Neural (en-US-AriaNeural)","- Speaking rate: 0.94x (-6%)","- Slides: "+slides.length,"- Narration words: "+words.toLocaleString("en-US"),"- Captions: burned in at the bottom of the final video",""];
for(const slide of slides){lines.push("## Slide "+String(slide.number).padStart(2,"0")+" - "+slide.title,"");for(const [i,segment] of slide.segments.entries()){lines.push("### "+(i+1)+". "+segment.label,"");if(segment.action)lines.push("**Instructor action before narration:** "+segment.action.label+".","");lines.push(segment.text,"");}}
await writeFile(path.join(here,"meeting-08-video-lecture-script-aria.md"),lines.join("\n").trim()+"\n","utf8");
console.log(JSON.stringify({slides:slides.length,segments:slides.flatMap(s=>s.segments).length,actions:slides.flatMap(s=>s.segments).filter(s=>s.action).length,words,averageWordsPerSlide:+(words/slides.length).toFixed(1)},null,2));
