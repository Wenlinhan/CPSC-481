# Lesson 08 video lecture script

- Route: /lessons/08
- Voice: Microsoft Aria Neural (en-US-AriaNeural)
- Speaking rate: 0.94x (-6%)
- Slides: 25
- Narration words: 6,092
- Captions: burned in at the bottom of the final video

## Slide 01 - Alpha-Beta Pruning and Modern Game Search

### 1. Concept framing

Lesson eight begins with a promise that sounds suspiciously like a late-night advertisement: obtain the same minimax decision while examining less of the tree. Alpha-beta pruning keeps the minimax backup rule, terminal utilities, cutoff depth, and evaluation function. It saves work only when returned values prove that unexplored siblings cannot change an ancestor's choice.

### 2. Mechanism and metaphor

Picture a restaurant menu where your opponent has already guaranteed that your table will pay no more than twenty dollars. Discovering a branch whose meal costs at least thirty is enough; the opponent will refuse it. Alpha and beta are those remembered alternatives, and the pruning shears appear only after the arithmetic proves irrelevance.

### 3. Boundary and proof

The four cards establish our contract. The result must be the same minimax action. The mechanism is a pair of path bounds. Efficiency depends on visitation order. Evidence is a trace of every recursive return. A cutoff based on vibes is not pruning; it is merely deleting homework with confidence.

### 4. Transfer and takeaway

By the end, you should trace MAX-VALUE and MIN-VALUE, name beta and alpha cutoffs correctly, explain who owns each bound, verify equality with full minimax, and distinguish move ordering from model changes such as expectimax or Monte Carlo tree search. Every skipped subtree needs a proof and an ancestor alternative.

## Slide 02 - Minimax may pursue branches whose values cannot matter

### 1. Concept framing

Depth-limited minimax normally evaluates every reachable leaf at its selected ply limit and backs each value toward the root. That is correct but expensive because the branching factor raises the tree size exponentially. Some leaves are evaluated even after an ancestor has an alternative that makes the entire branch strategically unacceptable.

### 2. Mechanism and metaphor

Imagine interviewing every applicant after one candidate has already met every requirement and the current branch has failed a mandatory test. More interviews cannot rescue that branch. Alpha-beta turns this administrative common sense into inequalities, but unlike a bored hiring committee, it must preserve the exact minimax answer.

### 3. Boundary and proof

Notice what remains fixed: terminal utility, depth limit, evaluation function, legal moves, and the MAX-MIN backup operators. What changes is depth-first visitation plus the moment at which a bound closes. If any of those controlled ingredients change, a matching answer is no longer evidence that pruning alone caused the saving.

### 4. Transfer and takeaway

The structural insight connects nonadjacent levels. A value discovered below a grandchild can prove that the intermediate choice will never be selected by an ancestor. We do not need the exact values of the skipped leaves; we need only establish that even their best possible influence cannot cross the existing alternative.

## Slide 03 - Alpha rises for MAX; beta falls for MIN

### 1. Concept framing

Alpha is the best value MAX can already guarantee along the active path. It is a lower bound because MAX has an explored alternative worth at least alpha. Beta is the best value MIN can already guarantee, meaning an upper bound on MAX's outcome because MIN can force the result to beta or less.

### 2. Mechanism and metaphor

Think of alpha as an elevator that only travels upward and beta as an elevator that only travels downward. Returned child values tighten the decision window from both sides. Nobody presses a reverse button: alpha never decreases, and beta never increases while the current path remains active.

### 3. Boundary and proof

The displayed interval says alpha is no greater than any still decision-relevant backed-up value, which is no greater than beta. When alpha meets or exceeds beta, the window has closed. Remaining siblings may contain fascinating numbers, dramatic plot twists, or free snacks, but they cannot alter the ancestor decision.

### 4. Transfer and takeaway

Keep utility from MAX's fixed perspective throughout the tree. MIN does not suddenly call a good score positive for itself and flip the signs unless the representation explicitly uses negamax. In this pseudocode, MAX maximizes one utility scale and MIN minimizes that same scale.

## Slide 04 - Finish a child, return its value, then update the parent

### 1. Concept framing

Alpha-beta is depth-first. It chooses one child, descends until a terminal or cutoff state supplies a value, returns that value to the immediate parent, and only then updates the parent's temporary value and bound. It does not sample every sibling at one level before descending, because incomplete children establish no usable backed-up value.

### 2. Mechanism and metaphor

The stack behaves like a set of nested phone calls. The leaf answers its parent; the parent updates its own notes and later calls its parent. A leaf does not shout directly to the root across three unfinished conversations. That shortcut would mix values owned by different decision nodes.

### 3. Boundary and proof

At a terminal state return exact utility. At a depth cutoff return the evaluation function used by ordinary depth-limited minimax. After a MIN child returns, MAX updates v and perhaps alpha. After a MAX child returns, MIN updates v and perhaps beta. Bound updates are consequences of completed evidence.

### 4. Transfer and takeaway

Use the live control as a proof rehearsal. Before each click, state the next node, current alpha and beta, and which variable may change on return. If your spoken prediction names a sibling before the active child finishes, your trace has quietly become breadth-first and the pruning logic will wander off wearing someone else's nametag.

### 5. Depth-first state 2

**Instructor action before narration:** Advance depth-first demonstration to state 2.

Advance to the MIN child. The active path is one ply deeper, but alpha and beta remain negative and positive infinity because no completed child value has returned. This demonstrates that descending alone does not update a bound.

### 6. Depth-first state 3

**Instructor action before narration:** Advance depth-first demonstration to state 3.

Advance to the terminal or cutoff state. Return exact utility at a terminal node or the agreed evaluation at the depth limit. This leaf result is evidence, but it still belongs first to its immediate parent.

### 7. Depth-first state 4

**Instructor action before narration:** Advance depth-first demonstration to state 4.

Advance through the return to MIN. MIN incorporates the child result and lowers beta when appropriate. Only now can it test beta against inherited alpha and decide whether another sibling remains relevant.

### 8. Depth-first state 5

**Instructor action before narration:** Advance depth-first demonstration to state 5.

Advance back to the MAX root. MAX incorporates the completed MIN result and raises alpha when appropriate. The trace has returned one edge at a time, preserving ownership of every temporary value and bound.

## Slide 05 - A cutoff says an ancestor already has a better alternative

### 1. Concept framing

At a MAX node, stop when its temporary value v reaches or exceeds beta. This is a beta cutoff. A MIN ancestor already possesses an alternative that keeps MAX at beta or below, so MIN will never allow the current branch whose MAX value is at least beta.

### 2. Mechanism and metaphor

The family-veto metaphor helps. MAX is excited because this branch offers seven, but the ancestor MIN says, charming story, I can choose another route capped at six. MAX may find nine or ninety among the remaining children; MIN still rejects the branch. The skipped siblings cannot help the root decision.

### 3. Boundary and proof

At a MIN node, stop when v falls to or below alpha. This is an alpha cutoff. A MAX ancestor already owns an alternative worth alpha or more, so MAX will never choose a branch where MIN can hold the result to alpha or less. The inequalities mirror the players' preferences.

### 4. Transfer and takeaway

Names come from the ancestor bound that triggers the proof: beta cutoff at MAX, alpha cutoff at MIN. Do not rename them according to the node's favorite variable or which Greek letter feels more photogenic. State the inequality, the ancestor, and the existing alternative every time.

## Slide 06 - MAX returns as soon as its value reaches beta

### 1. Concept framing

MAX-VALUE begins with v equal to negative infinity. For each legal action, it recursively asks MIN-VALUE for the child result and replaces v with the larger of its current value and that return. This is ordinary minimax until the upper bound supplied by a MIN ancestor becomes decisive.

### 2. Mechanism and metaphor

Read the return test before the alpha update. If v is at least beta, return v immediately. The remaining children are irrelevant because the MIN ancestor can avoid this branch. Only when the search continues does alpha become the larger of its prior value and v.

### 3. Boundary and proof

The order matters in code and on an exam. First receive the child value, then update v, then test v against beta, then update alpha if another child may be explored. Moving the test before v changes can miss a cutoff; updating the wrong bound can manufacture one from thin air.

### 4. Transfer and takeaway

At the root, Alpha-Beta-Search calls MAX-VALUE with negative infinity and positive infinity. No ancestor has yet established an alternative, so the first root child cannot be pruned by a preexisting finite bound. Useful root alpha appears only after a complete child returns.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

## Slide 07 - At MAX, v ≥ β proves that remaining siblings cannot help

### 1. Concept framing

This compact trace gives MAX an incoming alpha of three and beta of six. MAX starts at negative infinity and has children valued three, seven, and nine. The question is not which child is largest in the completed list; it is how soon the incoming ceiling makes later work irrelevant.

### 2. Mechanism and metaphor

After child three returns, v becomes three. Three is below beta six, so MAX cannot yet prove that MIN will reject this branch. Alpha remains or becomes three, and child seven still matters. The interval is open, so the recursion must continue.

### 3. Boundary and proof

After child seven returns, v becomes seven. Now seven is at least beta six. The MIN ancestor already has an alternative worth at most six, so it will never choose the route permitting MAX to obtain seven. Child nine is skipped without changing the returned minimax decision.

### 4. Transfer and takeaway

Notice the saving is one child evaluation, not mystical disappearance of the whole universe. Report evaluated children three and seven, returned bound at least seven, skipped child nine, cutoff type beta, and the MIN ancestor's six-valued alternative. That complete sentence is the proof.

### 5. MAX trace state 2

**Instructor action before narration:** Advance MAX cutoff trace to state 2.

Advance after evaluating child three. MAX updates v to three, which remains below beta six. The interval stays open, so seven must still be evaluated; child nine remains waiting behind it.

### 6. MAX trace state 3

**Instructor action before narration:** Advance MAX cutoff trace to state 3.

Advance after evaluating child seven. MAX updates v to seven and proves seven is at least beta six. The MIN ancestor rejects this branch, producing a beta cutoff that skips child nine.

## Slide 08 - MIN returns as soon as its value falls to alpha

### 1. Concept framing

MIN-VALUE mirrors MAX-VALUE. It initializes v to positive infinity, asks MAX-VALUE for each successor, and keeps the smaller returned value. Its incoming alpha summarizes an alternative already guaranteed by a MAX ancestor, so sufficiently low evidence makes the current branch unacceptable to MAX.

### 2. Mechanism and metaphor

After updating v, MIN tests whether v is at most alpha. If so, return v immediately: an alpha cutoff. If search continues, beta becomes the smaller of beta and v. The comparisons reverse because MIN seeks lower utility on MAX's fixed scale.

### 3. Boundary and proof

The visible pseudocode is worth enlarging because one inequality controls the entire proof. Trace the line that obtains a child value, the min operation, the v less-than-or-equal-to-alpha return, and the beta update. Read them in execution order, not as four inspirational quotes arranged vertically.

### 4. Transfer and takeaway

Do not switch the meaning of utility at MIN levels. A value of negative ten is bad for MAX and therefore attractive to MIN. The algorithm represents that preference by taking a minimum, not by relabeling whose happiness the number describes after every ply.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

## Slide 09 - At MIN, v ≤ α proves that remaining siblings cannot hurt MAX

### 1. Concept framing

The MIN trace arrives with alpha four and beta nine. Its children return eight, two, and zero. MIN begins at positive infinity because any real returned value will improve its minimizing choice. Again, we stop when evidence crosses the ancestor's existing alternative, not merely when a number looks small.

### 2. Mechanism and metaphor

After eight returns, v becomes eight and beta tightens from nine to eight. Eight remains above alpha four, so MAX might still prefer this root branch if later MIN children stay high. The next child must be evaluated; no cutoff has been earned.

### 3. Boundary and proof

After two returns, v becomes two. Since two is at most alpha four, the MAX ancestor already guarantees four elsewhere and will never choose a route where MIN can force two. This alpha cutoff skips the final child zero, even though zero would make MIN happier.

### 4. Transfer and takeaway

Report the exact proof: evaluated eight and two, current MIN value two, alpha four from a MAX ancestor, inequality two less than or equal to four, skipped zero, returned bound at most two. That language connects arithmetic to agency instead of treating Greek letters as decorative algebra confetti.

### 5. MIN trace state 2

**Instructor action before narration:** Advance MIN cutoff trace to state 2.

Advance after evaluating child eight. MIN lowers v and beta to eight, but eight remains above alpha four. The proof is incomplete, so child two must still be evaluated.

### 6. MIN trace state 3

**Instructor action before narration:** Advance MIN cutoff trace to state 3.

Advance after evaluating child two. MIN lowers v to two and proves two is at most alpha four. The MAX ancestor keeps its four-valued alternative, so an alpha cutoff skips child zero.

## Slide 10 - Alpha and beta summarize alternatives outside the current subtree

### 1. Concept framing

The active alpha-beta window is path memory. Alpha records a completed alternative available to some MAX ancestor; beta records a completed alternative available to some MIN ancestor. Neither number predicts an unseen child. Both summarize choices outside the subtree currently being searched.

### 2. Mechanism and metaphor

Think of courtroom precedent rather than a crystal ball. A returned value creates evidence that constrains what can matter next. Before any child returns, there is no legal basis for filtering values merely because they appear above alpha or below beta in the drawing.

### 3. Boundary and proof

The temporary v belongs to the current node. At MAX it rises as children return; at MIN it falls. A cutoff occurs only when this evidence closes the inherited window. The correct procedure examines children in order until the inequality is established, then skips what remains.

### 4. Transfer and takeaway

A common misconception says examine only values between alpha and beta. That assumes leaf values are known before evaluation, which defeats the point of search. Bounds prune subtrees after recursive evidence arrives; they do not scan a hidden answer key and preselect the fashionable numbers.

## Slide 11 - Move ordering changes work, not the minimax answer

### 1. Concept framing

Alpha-beta's result is order invariant under the same depth, evaluation, utilities, and legal actions, but its workload is not. MAX benefits when high-valued moves are searched early because alpha rises quickly. MIN benefits when low-valued moves come early because beta falls quickly.

### 2. Mechanism and metaphor

Imagine packing a suitcase with the bulkiest item first. You discover the capacity constraint immediately instead of arranging twelve socks and meeting the same problem later. Good move ordering exposes decisive bounds early; bad ordering postpones them until most of the tree has already submitted expense reports.

### 3. Boundary and proof

A move-ordering heuristic predicts which actions are promising for visitation. It does not replace the cutoff evaluation function and does not change minimax's backup rule. The heuristic may cost time itself, so measure leaf savings, internal nodes, elapsed time, and ordering overhead rather than celebrating one smaller count.

### 4. Transfer and takeaway

Read across the matrix. Best-first ordering tries strong MAX and weak MIN moves early, producing tight bounds. Worst-first ordering often approaches full minimax. In both columns the legal actions, cutoff depth, evaluation function, and final minimax result remain controlled invariants.

## Slide 12 - Start left-to-right with no bounds at the root

### 1. Concept framing

The worked tree starts at a MAX root with alpha negative infinity and beta positive infinity. Search proceeds left to right through three MIN children. Because the root has no finite ancestor ceiling, its first completed child establishes the first useful alpha rather than triggering a root cutoff.

### 2. Mechanism and metaphor

Prepare a trace with columns for node, temporary v, alpha, beta, returned value, and skipped siblings. The left MIN child owns leaves three, twelve, and eight. The middle child begins with two. The right child receives fourteen, five, and two in that order.

### 3. Boundary and proof

Before each leaf, predict which node owns the next update. MIN keeps the smallest child return; MAX keeps the largest completed branch value. Alpha changes at the root only after a MIN child finishes. Beta changes inside each MIN branch as its leaves arrive.

### 4. Transfer and takeaway

This bookkeeping may feel fussy, but it prevents time travel. If you use the future leaf two while analyzing the earlier leaf fourteen, you have granted the algorithm spoilers. Alpha-beta knows only completed returns in visitation order, so our trace must respect the same information boundary.

## Slide 13 - The first MIN branch sets β=3 and root α=3

### 1. Concept framing

In the left branch, MIN first sees three, so its temporary value and beta become three. The next leaf twelve is larger and therefore cannot improve MIN's choice; beta remains three. Leaf eight is also larger, leaving the branch value unchanged.

### 2. Mechanism and metaphor

The complete MIN child returns three to the MAX root. Now the root updates alpha from negative infinity to three. That means MAX has a legal explored alternative guaranteeing at least three, and every later MIN branch will inherit this floor.

### 3. Boundary and proof

No pruning occurred inside the first branch because root alpha was not finite while its leaves were being searched. The branch had to finish before it could create the alternative used against later siblings. Good evidence arrives after work; it is not issued as a complimentary starter coupon.

### 4. Transfer and takeaway

Read the enlarged figure in event order: leaf three, beta three; leaf twelve, beta still three; leaf eight, beta still three; return three; root alpha three. Close the figure only after each number has an owner and a direction of update.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

## Slide 14 - Seeing 2 at MIN is enough to skip its remaining siblings

### 1. Concept framing

The middle MIN node inherits root alpha three. Its first visited leaf returns two, so MIN's v and beta become two. Immediately beta two is less than or equal to alpha three. The inherited window closes after only one leaf.

### 2. Mechanism and metaphor

The ancestor explanation is the heart of the cutoff. MAX already has the completed left alternative worth three. This middle branch lets MIN force two or less, so MAX will never choose it. Any remaining middle siblings can only keep or lower MIN's result, never raise it above three.

### 3. Boundary and proof

This is an alpha cutoff at a MIN node. Mark the two unvisited siblings as skipped, return a bound of at most two, and leave root alpha at three. The root does not replace its better branch with a worse one merely because the worse branch arrived wearing a dramatic inequality.

### 4. Transfer and takeaway

Use the enlarged tree to distinguish drawn from evaluated. The skipped leaves remain visible because the game tree contains them, but the search never requests their evaluation. A diagram shows possible structure; a trace records actual computation.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

## Slide 15 - The third MIN branch first establishes an upper bound of 14

### 1. Concept framing

The third MIN branch also inherits root alpha three. Its first leaf returns fourteen, so v and beta become fourteen. Test beta less than or equal to alpha: fourteen is not less than or equal to three. The decision window remains open.

### 2. Mechanism and metaphor

A large first value at MIN is not a reason to stop. Later siblings may lower MIN's result dramatically, perhaps below the root's established alternative. MIN has not completed its choice, and MAX cannot yet know whether this branch will beat three.

### 3. Boundary and proof

The situation resembles an auction where the first bid is high but lower bids are still permitted and the buyer always chooses the cheapest. Declaring victory after fourteen would misunderstand whose preference controls the node. MIN waits for smaller evidence.

### 4. Transfer and takeaway

In the enlarged image, point to root alpha three and local beta fourteen simultaneously. The cutoff condition compares those two path bounds; it does not compare fourteen with a random neighboring leaf or with negative infinity remembered from the root's initial call.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

## Slide 16 - A second child tightens beta from 14 to 5

### 1. Concept framing

The next leaf returns five. MIN updates v and beta to the smaller of fourteen and five, so beta becomes five. This confirms monotonicity: beta moved downward and did not rebound merely because fourteen had enjoyed a brief career as the current value.

### 2. Mechanism and metaphor

Compare beta five with root alpha three. Five is still greater, so the window remains open. The third child can lower the branch to two, which would make MAX reject it, or remain above three, which might let this branch replace the root's current choice.

### 3. Boundary and proof

This intermediate state is pedagogically valuable because it resists button-mashing. Not every bound update creates a cutoff. We update, test, and continue when the inequality is false. Alpha-beta is a proof procedure, not a machine that becomes more pruney whenever Greek letters appear.

### 4. Transfer and takeaway

Enlarge the figure and say the invariant aloud: root alpha stays three; local beta decreases from fourteen to five; five is greater than three; one sibling remains relevant. Then close the figure and preserve those values for the final step.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

## Slide 17 - β reaches 2, but no remaining work is left to save

### 1. Concept framing

The final leaf returns two, so MIN lowers beta from five to two. Now beta two is less than or equal to root alpha three. The cutoff condition is true, and the branch returns at most two to the root.

### 2. Mechanism and metaphor

However, the triggering leaf was already the last child. There are no remaining siblings to skip. The inequality proves that additional work would be irrelevant, but zero additional work exists. This is the algorithmic equivalent of announcing that the store is closed after the final customer has left.

### 3. Boundary and proof

Precise analysis separates a cutoff condition from pruning benefit. Record that the condition holds late and saves zero evaluations. Root MAX compares its completed alternative three with the middle bound at most two and the right value two, so the final root value remains three.

### 4. Transfer and takeaway

Inspect the completed tree and count actual leaves evaluated versus skipped. The middle branch produced the useful saving; this late right-branch closure did not. A good performance report measures work, not the number of times someone circled alpha and beta with an enthusiastic marker.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

## Slide 18 - A large MIN value does not trigger an alpha cutoff

### 1. Concept framing

The concept check gives root MAX an existing alpha of three and asks about a new MIN child whose leaves are eight and ten. After MIN sees eight, its beta becomes eight. The correct test is beta less than or equal to alpha, not whether the number feels impressively large.

### 2. Mechanism and metaphor

Eight is not less than or equal to three, so there is no alpha cutoff. MIN must inspect the next child. Ten does not lower its temporary value, so MIN returns eight, and root MAX can then raise alpha from three to eight.

### 3. Boundary and proof

Option A reverses the logic by treating a value larger than alpha as a stopping condition. Option C invents a cutoff after every completed child. Only option B names the real issue: MIN has not fallen to alpha or below, so the ancestor cannot yet reject the branch.

### 4. Transfer and takeaway

We will click every option, not because uncertainty deserves three trophies, but because feedback is part of the lesson. For each response, locate the same invariant: local beta eight, ancestor alpha three, open interval, next leaf still capable of affecting MIN's returned value.

### 5. Alpha-cutoff option A

**Instructor action before narration:** Select alpha-cutoff answer A.

Choose option A to expose the first misconception. Eight being larger than alpha is not an alpha-cutoff condition at MIN. The feedback should send us back to beta eight less than or equal to alpha three, which is false.

### 6. Alpha-cutoff option B

**Instructor action before narration:** Select alpha-cutoff answer B.

Choose option B. This is correct: MIN has not fallen to alpha or below, so the next leaf remains relevant. After ten, MIN still returns eight and root MAX may raise alpha.

### 7. Alpha-cutoff option C

**Instructor action before narration:** Select alpha-cutoff answer C.

Choose option C to test the automatic-cutoff misconception. Completing one MIN child updates evidence but does not guarantee a cutoff. The inherited inequality must close before siblings can be skipped.

## Slide 19 - A MAX value that reaches beta ends the remaining sibling search

### 1. Concept framing

Now a MAX node receives beta four from a MIN ancestor, and its first child returns eight. MAX sets v to eight and tests v greater than or equal to beta. Eight is at least four, so the window closes immediately.

### 2. Mechanism and metaphor

This is a beta cutoff because the proof uses the MIN ancestor's beta bound. MIN already has an alternative that caps MAX at four, so it will never permit a branch giving MAX eight or more. Remaining MAX children cannot make this branch more acceptable to MIN.

### 3. Boundary and proof

Option A states the correct inequality and action. Option B misnames the cutoff by mentioning alpha even though the decisive inherited bound is beta. Option C incorrectly demands every child, erasing the entire advantage of alpha-beta after the proof is already complete.

### 4. Transfer and takeaway

As we click each option, keep the causal sentence stable: MAX found eight, MIN can choose a route capped at four, therefore MIN rejects this branch, therefore MAX's remaining siblings are irrelevant. Arithmetic, agent preference, and skipped work must travel together.

### 5. Beta-cutoff option A

**Instructor action before narration:** Select beta-cutoff answer A.

Choose option A. Correct: v equals eight at MAX, beta equals four from a MIN ancestor, and eight is at least four. A beta cutoff returns immediately and skips the remaining MAX children.

### 6. Beta-cutoff option B

**Instructor action before narration:** Select beta-cutoff answer B.

Choose option B to expose the naming error. A large value is not automatically an alpha cutoff. The decisive bound is beta, owned by MIN, so the standard name is beta cutoff.

### 7. Beta-cutoff option C

**Instructor action before narration:** Select beta-cutoff answer C.

Choose option C to expose full-tree thinking. Alpha-beta does not evaluate every child after the ancestor preference is proven. Requiring all siblings would preserve minimax correctness while throwing away the pruning benefit.

## Slide 20 - Every skipped subtree follows from a completed bound

### 1. Concept framing

The hypothetical state space combines several cutoffs in one depth-first proof. Nodes without numerical results are not mysterious zeros; they were never evaluated. We must follow the active path, identify each completed return, and state which inherited bound makes the next subtree irrelevant.

### 2. Mechanism and metaphor

Begin at MIN node A. Its first completed MAX child returns three, so A has beta three. Inside MAX node B, the first leaf returns five. Five reaches beta three, producing a beta cutoff that skips B's remaining leaf because A will prefer its alternative at three or less.

### 3. Boundary and proof

A returns three to root MAX node C, establishing alpha three. MIN node D then receives a first completed child value zero. Zero is at most alpha three, so D has an alpha cutoff. MIN node E similarly reaches two and cuts off its remaining subtree.

### 4. Transfer and takeaway

Finally C returns max of the decision-relevant branch results, equal to three. Full minimax at the same depth and evaluation also returns three. The trace demonstrates both labels: beta cutoff at MAX B, alpha cutoffs at MIN D and E, all justified by completed alternatives.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

### 7. Hypothetical proof state 2

**Instructor action before narration:** Advance hypothetical proof to state 2.

Advance to the beta cutoff inside B. B is MAX, its first leaf returns five, and inherited beta is three from MIN node A. Five reaches beta, so B's remaining leaf is skipped.

### 8. Hypothetical proof state 3

**Instructor action before narration:** Advance hypothetical proof to state 3.

Advance to root update C. A returns three, giving root MAX an explored alternative and alpha three. This newly earned floor will control the later MIN branches.

### 9. Hypothetical proof state 4

**Instructor action before narration:** Advance hypothetical proof to state 4.

Advance to D. Its first completed child returns zero, so MIN node D has v zero at most root alpha three. An alpha cutoff skips D's remaining subtree.

### 10. Hypothetical proof state 5

**Instructor action before narration:** Advance hypothetical proof to state 5.

Advance to E. Its first completed child returns two, again at most root alpha three. The same ancestor alternative justifies another alpha cutoff, though the local returned bound differs.

### 11. Hypothetical proof state 6

**Instructor action before narration:** Advance hypothetical proof to state 6.

Advance to the final root value. C returns max of the decision-relevant branch results, equal to three, matching full minimax at the same depth and with the same evaluation function.

## Slide 21 - Correct alpha-beta must agree with full minimax

### 1. Concept framing

Verification needs an oracle, and full minimax supplies one for small controlled trees. Run both algorithms with identical legal actions, terminal utilities, cutoff depth, and evaluation function. Then compare root value, selected action, and evaluated work.

### 2. Mechanism and metaphor

Root values must match exactly. Selected actions must match unless equal-valued ties permit more than one correct move under different ordering. Alpha-beta should evaluate no more leaves than full minimax, though a poor ordering may produce almost no saving.

### 3. Boundary and proof

Comparing only current and parent heuristic values is insufficient. Those local numbers can look reasonable while a bound is updated at the wrong node or a subtree is pruned under the wrong ancestor. The final decision plus an event-level trace reveals those implementation errors.

### 4. Transfer and takeaway

Treat testing like a science experiment. Hold depth and evaluation fixed, vary ordering, count leaves and internal nodes, and assert the same decision. If the answer changes with ordering, the program has not discovered a bold new game strategy; it has discovered a bug.

## Slide 22 - Ordering reduces evaluations; other game models change the backup rule

### 1. Concept framing

Poor ordering delays useful bounds, so alpha-beta approaches full minimax work. Good ordering searches likely strong MAX moves and likely weak MIN moves first, tightening alpha or beta early. Either visitation order returns the same deterministic depth-limited minimax result when the implementation is correct.

### 2. Mechanism and metaphor

Measure more than leaf count. Record internal nodes, elapsed time, memory, and the cost of computing the ordering heuristic. A brilliant ordering routine that spends an hour ranking moves before saving twelve milliseconds has optimized the lecture example but perhaps not the product.

### 3. Boundary and proof

Expectimax changes the model by adding chance nodes that back up probability-weighted expected utility. This is appropriate when nature, dice, or uncertain outcomes select successors according to known probabilities rather than an adversary choosing the worst response.

### 4. Transfer and takeaway

Monte Carlo tree search selectively grows a tree through repeated selection, expansion, simulation, and backup. It is not an alpha-beta shortcut pasted onto deterministic minimax. Changing visitation order preserves the backup rule; expectimax and MCTS change what evidence is collected or how values are backed up.

## Slide 23 - Apply alpha-beta left-to-right to the complete practice tree

### 1. Concept framing

The practice tree has a MAX root, three MIN children, nested MAX nodes, and fifteen leaves. Visit every edge left to right. Submit an event trace, not only a root number, because the location and justification of each cutoff are the assessed skills.

### 2. Mechanism and metaphor

For every internal node, record temporary v, incoming alpha and beta, the updated bound after each child, and any skipped subtree. Mark whether the cutoff is beta at MAX or alpha at MIN, and write the exact inequality that closes the window.

### 3. Boundary and proof

The leaf sequence is five, two, ten, eleven, one, two, two, eight, six, five, twelve, four, three, twenty-five, and two, grouped by the branches in the image. Do not flatten those numbers into one list when computing backups; parent ownership determines every min and max.

### 4. Transfer and takeaway

Your final report needs the root value, chosen branch, evaluated-leaf count, skipped-leaf count, and a statement about ordering. A different legal order may change which leaves are visited and how soon cutoffs appear, but it cannot change the depth-limited minimax result.

### 5. Interactive figure enlargement

**Instructor action before narration:** Enlarge the instructional source figure.

Open the source figure and hold it at full teaching size. Read the labels in their displayed order, connect each number or pseudocode line to the narration, and verify that the visual evidence supports the bound claim rather than treating the image as background decoration.

### 6. Figure-to-trace synthesis

**Instructor action before narration:** Close the enlarged instructional source figure.

Close the enlarged figure after the decisive details have been inspected. Return attention to the native explanation and restate the event in trace language: current node, returned value, inherited alpha and beta, cutoff inequality if any, and the work actually skipped.

## Slide 24 - The practice tree returns 5 after evaluating nine of fifteen leaves

### 1. Concept framing

The reveal sequence checks the independent trace one proof at a time. The left MIN branch returns five, the middle branch is bounded at two, the right branch tightens to four, and root MAX chooses five. Do not reveal ahead of your own reasoning; prediction turns animation into evidence.

### 2. Mechanism and metaphor

On the left, the first MAX child returns five from leaves five and two. In the second MAX child, leaf ten reaches the MIN node's beta five, so a beta cutoff skips eleven. The completed left MIN result is five, establishing root alpha five.

### 3. Boundary and proof

The middle MIN branch's first MAX child returns two from one, two, and two. Since two is at most root alpha five, an alpha cutoff skips the eight subtree and the six-five subtree. The right branch later tightens from twelve to four and cuts off its final twenty-five-two child.

### 4. Transfer and takeaway

The root returns max of five, at most two, and four, equal to five. Nine of fifteen leaves were evaluated. Full minimax returns the same value and action. Each click should add one auditable claim, not merely make another card stop looking shy.

### 5. Practice reveal 1

**Instructor action before narration:** Reveal practice proof step 1.

Reveal the left MIN result. The first MAX child returns five; the second reaches beta five when leaf ten appears, so eleven is skipped. The completed MIN branch returns five and root alpha becomes five.

### 6. Practice reveal 2

**Instructor action before narration:** Reveal practice proof step 2.

Reveal the middle result. Its first MAX child returns two from one, two, and two. Since two is at most root alpha five, an alpha cutoff skips the eight branch and the six-five branch.

### 7. Practice reveal 3

**Instructor action before narration:** Reveal practice proof step 3.

Reveal the right branch's first tightening. Its first MAX child returns twelve. The next child returns max of four and three, equal to four, so the right MIN beta falls from twelve to four.

### 8. Practice reveal 4

**Instructor action before narration:** Reveal practice proof step 4.

Reveal the right-branch cutoff. Beta four is at most root alpha five, so the final MAX child containing twenty-five and two is skipped. The ancestor already prefers the left branch worth five.

### 9. Practice reveal 5

**Instructor action before narration:** Reveal practice proof step 5.

Reveal the root decision. MAX chooses max of five, at most two, and four, equal to five. Nine of fifteen leaves were evaluated, and full minimax agrees on both value and action.

## Slide 25 - A cutoff is a proof that remaining work cannot change the choice

### 1. Concept framing

The exit task asks for three linked skills. Explain one beta cutoff and one alpha cutoff by naming the ancestor alternative. Trace v, alpha, and beta through the exact child return that closes the window. Verify that the pruned result matches full minimax under identical settings.

### 2. Mechanism and metaphor

A useful summary is inequality, owner, consequence. For v at least beta at MAX, a MIN ancestor owns the beta alternative, so remaining MAX siblings are skipped. For v at most alpha at MIN, a MAX ancestor owns the alpha alternative, so remaining MIN siblings are skipped.

### 3. Boundary and proof

Move ordering changes running time because strong early evidence tightens bounds, but it does not change the minimax decision. Expectimax, MCTS, and other extensions answer different modeling needs by changing backup or sampling. Choose them because the environment differs, not because alpha and beta have become unfashionable.

### 4. Transfer and takeaway

Before leaving, identify one operation you can perform without peeking: update bounds, label a cutoff, trace the practice tree, or design a verification test. The durable idea is simple: search may skip work only after completed evidence proves that the skipped work cannot change the chosen action.
