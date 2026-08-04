# Lesson 07 video lecture script - Game Trees, Minimax, and Evaluation Functions

- Voice: Microsoft Aria Neural (en-US-AriaNeural)
- Speaking rate: 0.94x (-6%)
- Slides: 25
- Narration words: 6,220
- Instructional actions: 40
- Captions: burned in at the bottom of the final video
- Cue policy: phrase-timed native focus; centered pop-ups and emoji only for important absent concepts

## Cue summary

- focus: 153
- popup: 49
- emoji: 29
- camera: 0

## Slide 01 - Game Trees, Minimax, and Evaluation Functions

### 1. From a route to a strategy

Ordinary search asks which path reaches a goal when the agent controls every step. A game changes one small word with enormous consequences: the next action may belong to an opponent. Now a good move is not merely followed by our favorite continuation. It must survive the strongest legal reply. The solution therefore becomes a contingent strategy—a plan with an answer for each opponent response.

**Phrase-timed cues:**

- "next action may belong" -> focus: Opponent controls the reply
- "contingent strategy" -> popup: A game solution branches on opponent replies

### 2. The chess-table metaphor

Imagine planning a picnic while someone across the table actively moves the sandwiches. That is adversarial search: the environment is not merely uncertain; another decision-maker selects actions against your objective. Chess gives us clean rules, visible turns, and outcomes, but the logic also appears in cybersecurity, negotiation, auctions, and competitive scheduling.

**Phrase-timed cues:**

- "moves the sandwiches" -> emoji: The environment answers strategically
- "Chess" -> focus: Alternating strategic control

### 3. Lesson contract

We will formulate a game tree, keep utility from one fixed perspective, alternate MAX and MIN, trace recursive minimax, distinguish terminal utility from cutoff evaluation, calculate complete backups, and critique what minimax actually guarantees. The central habit is simple: never select a shiny leaf until you know who controls the branch leading to it.

**Phrase-timed cues:**

- "fixed perspective" -> popup: One utility convention throughout the tree
- "shiny leaf" -> emoji: A large leaf may be unreachable against optimal reply

### 4. Transfer: cybersecurity

In intrusion response, a defender chooses monitoring or containment actions while an attacker adapts. A game-state model must represent privileges, observations, and whose action occurs next. Minimax can express worst-case defense in a simplified deterministic model, but real attackers have hidden information and unequal action spaces. The transfer is useful precisely because it reveals which clean classroom assumptions break first.

**Phrase-timed cues:**

- "intrusion response" -> emoji: Adversarial planning beyond boards
- "assumptions break" -> popup: Transfer the logic, re-check the model

### 5. A three-move thought experiment

Suppose MAX can choose Calm or Flashy. Calm guarantees a draw against every reply. Flashy wins if MIN cooperates but loses if MIN notices one counter. Minimax chooses Calm because the branch value is set by the counter, not the promotional brochure. That tiny example is the whole lesson in pocket size.

**Phrase-timed cues:**

- "promotional brochure" -> popup: A move is valued by the strongest reply it permits

## Slide 02 - Game playing is formal, nontrivial, and easy to compare

### 1. A reasoning laboratory

The first card describes games as a reasoning laboratory. Legal moves and victory conditions are explicit, so an incorrect decision cannot blame a vague task definition. Yet the tree can grow explosively, forcing representation, search, evaluation, and resource management to work together. Games are tidy laboratories with extremely untidy combinatorics.

**Phrase-timed cues:**

- "first card" -> focus: Formal but difficult

### 2. Measurable progress

The second card is direct comparison. Humans and programs can play under identical boards, clocks, rules, and starting positions. Win rate is visible, but serious evaluation also controls opponent strength, color or first-move advantage, time budget, and repeated trials. One dramatic victory is evidence; it is not a complete performance distribution.

**Phrase-timed cues:**

- "second card" -> focus: Direct comparison
- "repeated trials" -> popup: Compare under matched conditions

### 3. Multi-agent ideas

The third card expands beyond winning. Games expose conflict, partial cooperation, incentives, beliefs about other agents, and strategic interaction. A traffic merge, market bid, or shared-resource negotiation may not be zero-sum, but each requires reasoning about choices that depend on other choices. The board is small; the conceptual luggage is carry-on size only in theory.

**Phrase-timed cues:**

- "third card" -> focus: Conflict and cooperation
- "conceptual luggage" -> emoji: Games carry broad multi-agent ideas

### 4. Benchmarks need opponent diversity

A game program evaluated only against one opponent may overfit that opponent's style. Strong evidence uses opponents with different strategies, matched compute, alternating starting advantages, and many games. Report draws and confidence intervals, not merely wins. The same principle applies to agent benchmarks: a narrow adversary can turn a brittle trick into a heroic-looking score.

**Phrase-timed cues:**

- "Strong evidence" -> focus: Evaluate fairly
- "different strategies" -> popup: Opponent diversity tests robustness

### 5. Why games accelerated AI

Games offered repeatable experiments long before robots could safely roam messy streets. Researchers could change a search rule, replay thousands of positions, and compare outcomes. The environment was controlled enough for science yet difficult enough to expose weaknesses. A board became a wind tunnel for reasoning algorithms.

**Phrase-timed cues:**

- "wind tunnel" -> emoji: Controlled tests for reasoning systems

## Slide 03 - Games of strategy specify what can happen and how outcomes are valued

### 1. Sequence and legality

Begin with the first two cards. A game unfolds as a sequence of moves, and the rules define which moves are legal from each state. In tic-tac-toe, alternating marks and empty squares determine legality. In chess, piece movement, check, and special rules matter. Without legality, the tree is fan fiction rather than a game model.

**Phrase-timed cues:**

- "sequence of moves" -> focus: 1. Sequence
- "rules define" -> focus: 2. Legality

### 2. Outcome and objective

The third card introduces completed outcomes: a terminal test detects win, loss, draw, or another end condition. The fourth card gives the objective. Each player chooses actions to maximize utility from a fixed perspective. Utility summarizes preference; it need not be money, points, or happiness measured with suspicious confidence.

**Phrase-timed cues:**

- "third card" -> focus: 3. Outcome
- "fourth card" -> focus: 4. Objective

### 3. Terminal versus cutoff values

The correction in the side panel matters. We do not need a reward after every move. A completed game receives exact terminal utility. If time forces search to stop at a nonterminal state, an evaluation function estimates its value. Mixing those two sources is like replacing a final exam grade with a weather forecast because both contain numbers.

**Phrase-timed cues:**

- "side panel" -> focus: Terminal utility versus cutoff evaluation
- "evaluation function" -> popup: Estimate only at nonterminal cutoff states

### 4. Rules define the transition model

Small rule differences can reshape the entire tree. Allowing a pass move, repetition draw, or hidden card changes actions, terminal tests, and sometimes the state representation. Before reusing an algorithm trace, verify that the formal game is identical. A chess engine asked to play checkers is not confused by strategy; it has been handed the wrong universe.

**Phrase-timed cues:**

- "rule differences" -> focus: Rules define legal transitions
- "wrong universe" -> emoji: Correct algorithm, wrong game

### 5. Utility is ordinal before it is emotional

If win, draw, and loss receive ten, zero, and minus ten, the numbers primarily encode preference order. They need not measure ten units of joy. Magnitudes matter when evaluators compare nonterminal states, so document whether differences have semantic meaning or merely preserve ranking.

**Phrase-timed cues:**

- "preference order" -> focus: Utility expresses preference

## Slide 04 - An unpredictable opponent turns a path into a contingency

### 1. Who controls actions

Read the first comparison row. Ordinary search assumes the searching agent selects every step. Adversarial search alternates control, so the opponent chooses replies. This is not ordinary environmental randomness. A rational opponent prefers outcomes that are good for them, which under a zero-sum convention are bad for MAX.

**Phrase-timed cues:**

- "first comparison row" -> focus: Who acts?

### 2. Solution form

The second row changes the shape of an answer. A route is one sequence. A strategy says: if the opponent replies A, do this; if B, do that. It resembles an emergency phone tree rather than a single itinerary. The agent chooses one move now while preserving a response for every modeled reply.

**Phrase-timed cues:**

- "second row" -> focus: Path versus contingent strategy
- "phone tree" -> emoji: One move, many conditional replies

### 3. Time and approximation

The final rows explain why game programs often cannot search to the end. A clock demands a move while the tree remains unfinished. The program chooses a cutoff depth and evaluates those frontier positions. Deeper search usually helps, but only if computation finishes on time and the evaluator is meaningful. A perfect move submitted tomorrow is still a forfeit today.

**Phrase-timed cues:**

- "clock" -> focus: Time limit
- "cutoff depth" -> focus: Approximation

### 4. Strategies are policies

A deterministic strategy maps every reachable decision state to an action. A stochastic strategy maps states to probability distributions over actions. Today's minimax policy is deterministic when tie-breaking is fixed, but the contingency structure still matters. Writing only the chosen root move hides the responses that justify its safety.

**Phrase-timed cues:**

- "deterministic strategy" -> focus: A strategy covers contingencies
- "maps every reachable" -> popup: Policy: state to action

### 5. Contingency size matters

A strategy can be far larger than the single line eventually played because it must specify actions for replies that never occur. Planning therefore spends computation on counterfactual branches. Those unused branches are not waste; they are the evidence that the chosen move remains defensible when the opponent selects another path.

**Phrase-timed cues:**

- "A strategy can" -> focus: Solution form
- "counterfactual branches" -> popup: Unplayed replies justify the current decision

## Slide 05 - Observe, generate, evaluate, move—and repeat

### 1. Observe and generate

Follow the pipeline from left to right. First observe the opponent's move and obtain the new legal position. Second generate the legal successors. The state must contain enough information to determine whose turn it is, which actions are possible, and whether history-dependent rules apply. A missing turn label can make MAX confidently optimize the opponent's move.

**Phrase-timed cues:**

- "First observe" -> focus: 1. Opponent moves
- "Second generate" -> focus: 2. Generate

### 2. Test and evaluate

Third test whether the game is over. A terminal state returns exact utility immediately. Fourth, if the search continues, evaluate successors and back their values through alternating layers. The order matters: terminal facts outrank heuristic impressions. Never tell a checkmated king that the material score still looks promising.

**Phrase-timed cues:**

- "Third test" -> focus: 3. Terminal test
- "Fourth" -> focus: 4. Evaluate

### 3. Move and repeat

Finally MAX selects the successor with the highest backed-up value, executes the move, and waits. The opponent then changes the state, so the loop begins again. The repeated cycle explains why a game-playing system is not a one-time solver; it is a decision process synchronized with another agent.

**Phrase-timed cues:**

- "Finally" -> focus: 5. Move
- "loop begins again" -> emoji: Observe, search, act, repeat

### 4. Decision latency is part of performance

A game agent has both intellectual and temporal constraints. Deeper search can improve a move until the clock expires and converts wisdom into a loss. Practical systems allocate time by position complexity, reuse prior search, and keep a legal fallback move. Runtime is not a footnote; in games it participates directly in utility.

**Phrase-timed cues:**

- "game agent" -> focus: Act before the deadline
- "clock expires" -> emoji: Late perfection is failure

### 5. Fallback moves

Real programs often preserve the best completed result from an earlier depth while searching deeper. If the clock interrupts, they still have a legal move backed by finished analysis. This iterative-deepening pattern turns time uncertainty into graceful degradation instead of a dramatic stare at the board followed by forfeiture.

**Phrase-timed cues:**

- "Move" -> focus: Always retain a legal completed choice

## Slide 06 - Conflict and cooperation can both be modeled mathematically

### 1. Game theory definition

The definition panel frames game theory as mathematical models of conflict and cooperation among rational decision-makers. The crucial word is interdependent: my best action depends on what others choose, and their best actions may depend on what they expect from me. The model turns mutual side-eye into mathematics.

**Phrase-timed cues:**

- "definition panel" -> focus: Game theory definition
- "mutual side-eye" -> emoji: Interdependent decisions

### 2. Origins and modern scope

The first two cards distinguish history from scope. Early formal work emphasized two-person zero-sum games. Modern game theory studies decisions involving people, animals, software agents, firms, and institutions. Minimax is therefore one precise tool within a much wider field, not a universal recipe for every interaction.

**Phrase-timed cues:**

- "first two cards" -> focus: Origins
- "Modern game theory" -> focus: Modern scope

### 3. Conflict and cooperation

The last two cards show opposing and partially aligned goals. In conflict, improving one player's outcome may reduce another's. In cooperation, participants may share gains, bargain, or form coalitions. Lesson 7 deliberately narrows to deterministic, alternating, two-player, zero-sum, perfect-information games so the minimax logic is visible before the assumptions are relaxed.

**Phrase-timed cues:**

- "conflict" -> focus: Conflict
- "cooperation" -> focus: Cooperation

### 4. Rationality is model-relative

A rational action maximizes expected preference given a model, information, and constraints. If utility omits safety, fairness, or long-term effects, perfectly rational optimization can produce an undesirable result. Game theory does not certify the values supplied to it. Mathematics can optimize a scoreboard while politely declining responsibility for who designed the scoreboard.

**Phrase-timed cues:**

- "rational action" -> focus: Rational decision-makers
- "designed the scoreboard" -> popup: Utility encodes what the model values

### 5. From games to institutions

Voting rules, auctions, and bargaining protocols shape which strategies are attractive. Changing the rules changes incentives even when the participants remain the same. Game-theoretic analysis therefore studies mechanism design as well as individual play: sometimes the intelligent action is redesigning the game rather than searching harder inside it.

**Phrase-timed cues:**

- "Voting rules" -> focus: Broader strategic systems

## Slide 07 - Zero-sum is one game type—not a synonym for every game

### 1. Zero-sum

The first card defines zero-sum: gains and losses balance exactly. If utility is written from MAX's perspective, MIN can use the same number and prefer smaller values. This single scale is why minimax can alternate max and min operations without changing the meaning of utility halfway down the tree.

**Phrase-timed cues:**

- "first card" -> focus: Zero-sum

### 2. Non-zero-sum

The second card describes non-zero-sum games, where total welfare can rise or fall. The prisoner's dilemma is famous because individually tempting choices can produce a jointly worse result. A single scalar for MAX may no longer represent both players' preferences, so ordinary two-player zero-sum minimax is not automatically appropriate.

**Phrase-timed cues:**

- "second card" -> focus: Non-zero-sum
- "jointly worse" -> popup: Individual incentives can conflict with joint welfare

### 3. Independent dimensions

The third card prevents taxonomy soup. Zero-sum does not imply alternating turns, determinism, symmetry, or perfect information. Those are separate dimensions. Poker is competitive yet stochastic and imperfect-information; rock-paper-scissors is simultaneous; cooperative games may still be sequential. Label assumptions separately instead of ordering one deluxe game-description combo.

**Phrase-timed cues:**

- "third card" -> focus: Other game dimensions
- "taxonomy soup" -> emoji: Keep game properties separate

### 4. Zero-sum transformation

For a truly constant-sum two-player game, subtracting a constant can transform utilities into zero-sum form without changing preferences. But games with variable joint welfare cannot be repaired by arithmetic cosmetics. Determine whether interests are strictly opposed before applying one shared scalar and the ordinary min operator.

**Phrase-timed cues:**

- "Zero-sum" -> focus: Strictly opposed utility
- "variable joint welfare" -> popup: Non-zero-sum needs richer solution concepts

### 5. Perfect information is separate

Chess and tic-tac-toe reveal the full position to both players. Poker does not. In imperfect-information games, a search state may include beliefs over hidden cards and strategies may randomize to avoid exploitation. Ordinary minimax on one visible tree cannot simply pretend the hidden information has taken a coffee break.

**Phrase-timed cues:**

- "imperfect-information" -> popup: Hidden state requires beliefs and strategic uncertainty

## Slide 08 - A good move anticipates the opponent's best reply

### 1. Enlarge and inspect the source figure

Enlarge the chess image and imagine one tempting move. The board after our move is not the end of the analysis; it is the starting point for the opponent's strongest legal reply. Strategic quality belongs to the move-and-reply structure, not to how impressive our move looks in isolation.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the chess image" -> focus: Chess and alternating control
- "Enlarge the chess image" -> popup: Inspect the evidence before backing up a value

### 2. Think like the opponent

Close the image. The list asks us to know the rules, alternate turns, and keep utility consistent. For each candidate move, temporarily sit in the other chair and find the reply that hurts MAX most. This is not pessimism as a personality trait. It is robust planning under optimal opposition.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "know the rules" -> focus: Know legal moves
- "alternate turns" -> focus: Opponent replies

### 3. A tactical metaphor

Minimax resembles choosing an umbrella after asking the cloud for its strongest rebuttal. A move that wins a queen but permits checkmate is not good because the opponent controls the checkmating reply. The source callout invites a partner example: propose a strong-looking move, then deliberately search for its refutation.

**Phrase-timed cues:**

- "source callout" -> focus: Try one move and reply
- "umbrella" -> emoji: Plan against the strongest response

### 4. Opponent modeling versus robust play

Minimax is robust against the modeled strongest reply. A predictive opponent model instead estimates what this particular opponent is likely to do. Exploitation may score better against a weak pattern but become vulnerable if the pattern changes. Practical agents sometimes balance safe minimax play with opponent-specific opportunities.

**Phrase-timed cues:**

- "opponent" -> focus: Model the strongest reply
- "robust" -> popup: Safe policy differs from behavioral prediction

### 5. Refutations shape expertise

Strong human players do not merely generate brilliant moves; they rapidly reject moves with tactical refutations. Minimax formalizes that habit. For each candidate, ask what the opponent would love to play next. Expertise often looks like creativity, but much of it is efficient prevention of embarrassment.

**Phrase-timed cues:**

- "refutations" -> emoji: Search for the opponent's best counter

## Slide 09 - A game tree needs states, turns, actions, outcomes, and utilities

### 1. State, player, actions

The first column defines state, player, and actions. A state is the complete position needed for future legal play. Player identifies who controls the next action. Actions lists that player's legal moves. For tic-tac-toe, the board alone is insufficient if we do not know whose mark comes next.

**Phrase-timed cues:**

- "state" -> focus: State S
- "Player" -> focus: Player to move
- "Actions" -> focus: Legal actions

### 2. Result, terminal, utility

The second column completes the model. Result applies an action to produce a successor. Terminal identifies completed games. Utility gives an exact preference for a player at terminal states. These are definitions, not optional implementation decorations; minimax calls each one in a specific place.

**Phrase-timed cues:**

- "Result" -> focus: Result(s,a)
- "Terminal" -> focus: Terminal(s)
- "Utility" -> focus: Utility(s,p)

### 3. Tic-tac-toe formulation

For tic-tac-toe, state contains nine cells and player to move; actions are empty squares; result adds the current mark; terminal detects three-in-a-row or a full board; utility might be plus one, zero, or minus one for X. This compact tuple is the contract that turns a familiar game into a searchable decision problem.

**Phrase-timed cues:**

- "nine cells" -> emoji: Formulate the game before searching
- "contract" -> popup: State · player · actions · result · terminal · utility

### 4. State completeness test

Two histories may show the same board but differ in legal futures because of repetition rules, castling rights, or move counters. If future actions or terminal status differ, they are not the same search state. The Markov test is practical: can the stored state determine every legal continuation and value-relevant condition without consulting hidden history?

**Phrase-timed cues:**

- "State" -> focus: Complete game state
- "same board" -> popup: Visual equality need not imply state equality

### 5. Utility perspective test

A simple consistency test is to narrate every value as good or bad for the same player. If positive three means good for X at one layer but good for O at the next, the tree has changed languages mid-sentence. Fix the perspective before applying MAX or MIN.

**Phrase-timed cues:**

- "consistency test" -> focus: Fixed utility language

## Slide 10 - Plan against an opponent who also searches rationally

### 1. The opponent model

The large assumption states that the opponent knows the same modeled rules and consistently tries to obtain its best result. This does not claim every human is perfectly rational. It defines the decision standard used to compute a safe move. Minimax asks what remains achievable even if the opponent refuses to cooperate with our lecture example.

**Phrase-timed cues:**

- "large assumption" -> focus: Rational-opponent model

### 2. Shared rules and optimal opposition

The first card gives shared rules: both sides agree on actions, transitions, terminal tests, and utility. The second gives optimal opposition: evaluate each candidate by its worst reply. If the model is wrong—perhaps hidden information exists—the guarantee applies to the model, not by magic to reality.

**Phrase-timed cues:**

- "first card" -> focus: Shared rules
- "second" -> focus: Optimal opposition

### 3. Safe is not predictive

The third card calls minimax a safe policy. It protects against the strongest modeled reply but does not predict which reply a particular opponent will choose. If the opponent blunders, the agent observes the new state and may achieve a better outcome. Insurance does not predict a kitchen fire; it limits the damage if one occurs.

**Phrase-timed cues:**

- "third card" -> focus: Safe policy
- "Insurance" -> emoji: Protection is not prediction

### 4. Worst-case reasoning and conservatism

Minimax can be conservative when opponents are predictably imperfect. That conservatism is appropriate when failure is costly or adversaries adapt. In low-stakes repeated play, an exploitative policy might intentionally choose a move with a worse worst case but better expected payoff against observed behavior. The correct choice depends on objective and risk tolerance, not algorithm fandom.

**Phrase-timed cues:**

- "Minimax can be conservative" -> focus: Worst-case protection
- "risk tolerance" -> popup: Robust and exploitative policies answer different goals

### 5. Model mismatch

If an opponent has a legal action missing from our generator, minimax may certify a move that fails immediately. Search cannot compensate for an incomplete rules model. Robustness begins with correct actions and results; optimal reasoning over the wrong tree is optimized surprise.

**Phrase-timed cues:**

- "legal action" -> focus: Correct shared game model

## Slide 11 - MAX takes the largest child value; MIN takes the smallest

### 1. Build and evaluate leaves

The first card builds legal actions until terminal states or a cutoff depth. The second evaluates leaves: exact utility for terminal leaves, an estimate for nonterminal cutoff leaves. That distinction preserves semantics. A terminal win is a fact; a cutoff score is an informed opinion wearing numerical shoes.

**Phrase-timed cues:**

- "first card" -> focus: 1. Build
- "second" -> focus: 2. Evaluate leaves

### 2. Back up and choose

The third card performs backup. MAX keeps the largest child value; MIN keeps the smallest, always using MAX's fixed utility scale. The fourth card chooses the root action whose child returns the best backed-up value. Internal values are consequences of descendants, not independent evaluations pasted onto convenient nodes.

**Phrase-timed cues:**

- "third card" -> focus: 3. Back up
- "fourth" -> focus: 4. Choose

### 3. Keep perspective fixed

The side panel separates player-to-move from sign convention. Whose turn it is determines MAX or MIN. Utility meaning stays fixed. Changing the sign perspective at every layer and also taking min is double-counting the opponent, like reversing a map and then driving backward to compensate.

**Phrase-timed cues:**

- "side panel" -> focus: Fixed utility perspective
- "driving backward" -> emoji: Do not switch perspective twice

### 4. Tie-breaking is part of the algorithm

If two root actions have equal minimax value, either is optimal under the modeled utility, but their secondary properties may differ. Choose by faster win, slower loss, lower variance, simpler explanation, or a fixed deterministic order. State that rule so identical runs do not appear to change personality on alternate Tuesdays.

**Phrase-timed cues:**

- "Choose" -> focus: Root tie-breaking
- "secondary properties" -> popup: Equal minimax value permits a documented tie-break

### 5. Backup is not averaging

Minimax does not average child values unless the model contains random chance nodes with known probabilities. MAX selects one child and MIN selects one child because players control actions. Averaging would answer an expectation question about random choice, not the adversarial decision modeled here.

**Phrase-timed cues:**

- "does not average" -> focus: Select max or min, do not average

## Slide 12 - The recursion alternates value functions until a leaf returns

### 1. Enlarge and inspect the source figure

Enlarge the exact minimax pseudocode. Minimax-Decision compares actions at the root. Max-Value returns terminal utility or the maximum result of recursive Min-Value calls. Min-Value mirrors it with a minimum over Max-Value. The code is short because recursion reuses the same logic at every alternating layer.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the exact minimax" -> focus: Recursive minimax pseudocode
- "Enlarge the exact minimax" -> popup: Inspect the evidence before backing up a value

### 2. Terminal and recursive cases

Close the image and focus on the first three definition cards. The terminal test stops descent and returns exact utility. Otherwise MAX loops over legal actions and asks MIN for each successor's value; MIN loops and asks MAX. Each call trusts the next layer to summarize everything below it.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "terminal test" -> focus: Terminal return
- "MAX loops" -> focus: MAX-VALUE
- "MIN loops" -> focus: MIN-VALUE

### 3. Action versus value

The decision card is subtle. Recursive value functions return numbers, but Minimax-Decision returns the root action associated with the largest value. Saying the algorithm returns three confuses evaluation with behavior. It chooses action A; three is the backed-up reason.

**Phrase-timed cues:**

- "decision card" -> focus: Decision returns an action
- "chooses action A" -> popup: Return the action, retain its backed-up value

### 4. Complexity preview

For branching factor b and depth m, full minimax examines on the order of b to the m nodes and stores a depth-first path on the order of b times m in a straightforward implementation. Exponential time is why cutoff evaluation and alpha-beta pruning matter. The pseudocode is short; its family tree is not.

**Phrase-timed cues:**

- "full minimax" -> focus: Recursive expansion
- "family tree" -> emoji: Short code, exponential search

### 5. Base cases protect recursion

Every recursive algorithm needs a base case. Here the terminal or cutoff condition prevents infinite descent and supplies the numbers that recursion can combine. Without a meaningful base value, alternating MAX and MIN is a beautifully organized meeting with no agenda and no decisions.

**Phrase-timed cues:**

- "terminal or cutoff condition" -> focus: Recursive base case

## Slide 13 - One action is resolved before the next sibling is searched

### 1. Enter the root

The trace begins at Minimax-Decision and Max-Value for the root. No result exists yet. MAX will compare A, B, and C, but recursive depth-first execution resolves one action before opening the next sibling. The call stack behaves like a very disciplined librarian: finish this book before pulling the next one.

**Instructor action:** Reset recursive trace.

**Phrase-timed cues:**

- "trace begins" -> focus: Trace step 1
- "disciplined librarian" -> emoji: Depth-first recursive control

### 2. Resolve action A

Advance to action A. MIN sees leaf values three and five, chooses three, and returns it to MAX. The physical game has not executed A and then walked backward. Only a computational call has returned a number. Search explores hypothetical states; the board remains where it was.

**Instructor action:** Advance to action A.

**Phrase-timed cues:**

- "action A" -> focus: Trace step 2
- "returns it" -> focus: Returned value 3

### 3. Resolve action B

Advance to B. MIN chooses two instead of nine, so B returns two. The attractive nine never reaches the root because MIN controls that reply. This is the minimizing half of minimax: the opponent selects the branch least favorable to MAX.

**Instructor action:** Advance to action B.

**Phrase-timed cues:**

- "B returns two" -> focus: Trace step 3
- "nine never reaches" -> focus: MIN selects 2, not 9

### 4. Resolve action C

Advance again to C. MIN chooses one instead of four, so C returns one. MAX now has three completed sibling values: A returns three, B returns two, and C returns one. Each number summarizes the strongest reply available to MIN under that root action.

**Instructor action:** Advance to action C.

**Phrase-timed cues:**

- "C returns one" -> focus: Trace step 4
- "three completed sibling values" -> focus: A = 3 · B = 2 · C = 1

### 5. Return the decision

Advance to the final step. MAX compares A three, B two, and C one, so it chooses A with backed-up value three. The root returns an action after all sibling values are known. Reset the trace so students can replay the control flow from a clean state.

**Instructor action:** Advance to final decision.

**Phrase-timed cues:**

- "chooses A" -> focus: Trace step 5
- "backed-up value three" -> focus: Final returned decision

### 6. Trace invariants

At every trace step, three invariants should hold: utility perspective remains MAX's, node operator matches the player to move, and a returned value summarizes a fully resolved searched subtree. If any invariant fails, stop before continuing arithmetic. Debugging one layer early is cheaper than beautifully backing up the wrong tree.

**Phrase-timed cues:**

- "every trace step" -> focus: Depth-first invariants
- "three invariants" -> popup: Perspective · player · resolved subtree

### 7. Replay challenge

Replay the trace mentally in reverse: final action A depends on values three, two, and one; each depends on a MIN comparison; each leaf provides the base value. Reverse explanation checks whether students understand dependency rather than merely remembering the order in which buttons were clicked.

**Phrase-timed cues:**

- "Replay the trace" -> focus: Explain dependencies in reverse

## Slide 14 - A cutoff leaf is where the search horizon ends—not necessarily where the game ends

### 1. Enlarge and inspect the source figure

Enlarge the fixed three-ply tree and read the bottom values before trusting internal labels. A ply is one player's move, so three-ply search looks ahead three alternating actions. The eleven leaves mark the search horizon; some could be terminal facts, while nonterminal cutoff leaves require an evaluation estimate.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the fixed three-ply" -> focus: Fixed three-ply minimax tree
- "Enlarge the fixed three-ply" -> popup: Inspect the evidence before backing up a value

### 2. Terminal utility versus evaluation

Close the image. The first bullet says a terminal leaf gets exact utility. The second says a depth-limited nonterminal leaf gets an evaluation function. Both appear at leaves of the search tree, but only one represents the actual end of the game. Leaf means no deeper search in this computation, not necessarily game over.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "first bullet" -> focus: Terminal utility
- "second" -> focus: Cutoff evaluation

### 3. Do not evaluate internal nodes independently

The final bullet says internal nodes receive backed-up values. Evaluating each internal node with a separate horizon would mix apples, oranges, and a suspicious pineapple. Minimax compares branches only when their values share the same terminal or cutoff semantics.

**Phrase-timed cues:**

- "final bullet" -> focus: Internal values are backed up
- "suspicious pineapple" -> emoji: Compare values from a consistent horizon

### 4. Horizon effects

A cutoff can hide a decisive event just beyond the search depth. An evaluator may prefer a move at depth three that loses at depth four. This horizon effect motivates deeper search, quiescence search for tactically unstable positions, and evaluators that recognize immediate threats. A cutoff is a computational horizon, not a wall the opponent promises to respect.

**Phrase-timed cues:**

- "A cutoff" -> focus: Cutoff horizon
- "horizon effect" -> popup: Important consequences may sit one ply deeper

### 5. Depth counts moves, not rounds

A ply is one move by one player. A full round in a two-player alternating game contains two plies. Confusing the terms doubles the intended horizon and can multiply work by another factor of the branching rate. In exponential search, vocabulary can have a surprisingly large electricity bill.

**Phrase-timed cues:**

- "ply" -> focus: One player move

## Slide 15 - Each MIN node keeps the reply least favorable to MAX

### 1. Enlarge and inspect the source figure

Enlarge the same tree and work from the bottom. Lower MAX nodes become three, nine, zero, seven, two, and six after selecting their largest leaves. Only then can each MIN parent compare completed child values. Backup is layered arithmetic with turn labels, not a scavenger hunt for the largest number anywhere.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the same tree" -> focus: MIN backup on fixed tree
- "Enlarge the same tree" -> popup: Inspect the evidence before backing up a value

### 2. Three MIN calculations

Close the image. The list computes left as minimum of three and nine, giving three; middle as minimum of zero and seven, giving zero; right as minimum of two and six, giving two. Say MIN before each calculation. That verbal label prevents arithmetic from floating free of control.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "left" -> focus: Left MIN = 3
- "middle" -> focus: Middle MIN = 0
- "right" -> focus: Right MIN = 2

### 3. Interpret MIN correctly

MIN is not choosing a foolish move for itself. It chooses its strongest reply, expressed as the smallest utility for MAX under a shared zero-sum scale. From MIN's perspective, shrinking MAX's outcome is precisely rational. The label least favorable to MAX is clearer than saying worst move without naming for whom.

**Phrase-timed cues:**

- "strongest reply" -> focus: MIN's best reply
- "for whom" -> popup: Always name the utility perspective

### 4. Backup as dynamic programming

Minimax backup composes small solved subproblems. Once a child subtree value is known, the parent needs only max or min over those summaries. Transposition tables exploit this by storing repeated state values. The challenge is preserving depth, bound type, and evaluation conditions so yesterday's summary still answers today's question.

**Phrase-timed cues:**

- "Minimax backup" -> focus: Bottom-up value composition
- "storing repeated state values" -> popup: Cache only semantically compatible results

### 5. Layer labels before numbers

When solving a tree by hand, mark each internal layer MAX or MIN before touching arithmetic. Then circle groups of siblings and write the operator beside each parent. This simple annotation separates structural errors from calculation errors and makes partial credit less dependent on telepathy.

**Phrase-timed cues:**

- "mark each internal layer" -> popup: Label control before calculating values

## Slide 16 - MAX selects the action whose worst reply is best

### 1. Enlarge and inspect the source figure

Enlarge the completed tree. The root receives three branch summaries: three, zero, and two. Each already represents the reply MIN would choose. MAX therefore computes maximum of three, zero, and two, selecting the left action with value three.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the completed tree." -> focus: Completed minimax root backup
- "Enlarge the completed tree." -> popup: Inspect the evidence before backing up a value

### 2. Why leaf nine loses

Close the image. The visible nine lives below a MIN choice. MIN can select sibling value three instead, so MAX cannot guarantee nine. A large descendant matters only if every controlling choice on the path allows it. Minimax values permissions, not wishful sightseeing.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "visible nine" -> focus: Largest leaf is not selected
- "cannot guarantee nine" -> popup: Opponent controls which reply follows

### 3. State the guarantee precisely

The callout supplies the careful claim. Under the modeled rules, fixed utility perspective, complete three-ply search, evaluation semantics, and optimal opposition, the selected move guarantees a backed-up cutoff value of at least three. Change the depth or evaluator and the recommendation may change. Guarantees have assumptions, not capes.

**Phrase-timed cues:**

- "careful claim" -> focus: Conditional minimax guarantee
- "not capes" -> emoji: Every guarantee carries assumptions

### 4. A guarantee is a lower bound

At a MAX root, minimax value three means MAX can force at least three under the modeled search and evaluation, regardless of MIN's reply. MIN might choose poorly and allow more. This lower-bound interpretation explains both safety and opportunity: the policy protects three without forbidding the agent from accepting a gift.

**Phrase-timed cues:**

- "minimax value three" -> focus: Root value 3
- "at least three" -> popup: Worst-case guarantee, better outcomes possible

### 5. Principal variation

The selected root action plus the best replies along its backed-up path form a principal variation—the line currently considered best under the search. It is useful for explanation, but it is not the whole strategy. If the opponent deviates, the agent follows a different stored or recomputed response.

**Phrase-timed cues:**

- "root" -> focus: Selected root action and principal line

## Slide 17 - Count open winning lines for X and subtract those for O

### 1. Enlarge and inspect the source figure

Enlarge the tic-tac-toe evaluation figure. M of n counts winning lines still open for X; O of n counts lines still open for O. The estimate E of n equals M minus O. The three source examples are one, negative two, and one, showing that different boards can compress to the same score.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the tic-tac-toe evaluation" -> focus: Tic-tac-toe evaluation function
- "Enlarge the tic-tac-toe evaluation" -> popup: Inspect the evidence before backing up a value

### 2. Read the three definitions

Close the image. The first card defines M, the second O, and the third their difference. Larger values favor X because utility is written from X's perspective. The minus sign does not alternate with turns. MIN later chooses the smaller X-perspective value.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "first card" -> focus: M(n): X lines
- "second" -> focus: O(n): O lines
- "third" -> focus: E(n)=M(n)-O(n)

### 3. Scope and limitation

The callout limits this score to nonterminal cutoff states. A completed win or loss receives exact terminal utility even if line counting produces an ordinary finite number. The evaluator also ignores forks, move order, and tactical immediacy. Compression makes search affordable by forgetting details; testing discovers whether it forgot the plot.

**Phrase-timed cues:**

- "callout" -> focus: Use only at cutoff states
- "forgetting details" -> popup: A heuristic is a lossy summary

### 4. Feature engineering for games

A stronger tic-tac-toe evaluator could count immediate wins, blocks, forks, center control, or weighted open lines. More features are not automatically better; correlated counts can double-count evidence, and tactical rules can dominate strategic structure. Compare evaluator choices against deeper exact search on held-out positions.

**Phrase-timed cues:**

- "stronger tic-tac-toe evaluator" -> focus: Evaluation feature
- "held-out positions" -> popup: Test heuristic agreement with deeper search

### 5. Evaluator calibration

Line-count features can be compared with exact solved positions. Measure how often score order agrees with true minimax order, especially near tactical threats. Calibration turns a plausible formula into empirical evidence. Without testing, an evaluation function is a confident opinion with excellent formatting.

**Phrase-timed cues:**

- "Line-count features" -> focus: Validate the cutoff evaluator

## Slide 18 - The arithmetic is simple; the representation does the work

### 1. Score State A

Choose State A and reveal. M is six, O is five, so E equals one. The result favors X by one open line under this feature. The calculation is easy; deciding what counts as still open requires the board representation and game rules.

**Instructor action:** Choose State A.

**Instructor action:** Reveal State A result.

**Phrase-timed cues:**

- "State A" -> focus: State A
- "E equals one" -> focus: State A result

### 2. Score State B

Choose State B and reveal. Four minus six equals negative two, so the position favors O on the fixed X-perspective scale. Negative does not mean illegal or impossible; it means the selected feature sees more opportunity for the opponent.

**Instructor action:** Choose State B.

**Instructor action:** Reveal State B result.

**Phrase-timed cues:**

- "State B" -> focus: State B
- "negative two" -> focus: State B result

### 3. Score State C

Choose State C and reveal. Five minus four returns one, tying State A. The boards are not identical; the heuristic has compressed them to the same scalar. A tie-breaking rule or richer features may be needed. Equal thermometer readings do not prove two patients have the same illness.

**Instructor action:** Choose State C.

**Instructor action:** Reveal State C result.

**Phrase-timed cues:**

- "State C" -> focus: State C
- "tying State A" -> focus: State C result
- "thermometer" -> emoji: Equal scores can hide different structure

### 4. Ties reveal missing resolution

States A and C both score one, but their tactical futures may differ. A tie can be harmless if deeper minimax separates them, or dangerous if the cutoff forces an arbitrary choice. Record tie frequency and inspect tied positions. When a heuristic frequently shrugs at important distinctions, it is asking for better features, not louder arithmetic.

**Phrase-timed cues:**

- "States A and C" -> focus: Tied score
- "shrugs" -> emoji: A tie may expose missing information

### 5. Representation does the hidden labor

The subtraction on this slide takes milliseconds; producing correct M and O counts requires recognizing blocked lines, player identity, and board geometry. In AI, the final formula is often the smallest part. Representation quietly does the difficult work and then lets arithmetic take the applause.

**Phrase-timed cues:**

- "arithmetic" -> emoji: Simple formula, substantial representation

## Slide 19 - The opponent's best reply determines each opening's value

### 1. Enlarge and inspect the source figure

Enlarge the two-ply opening tree. MAX has three symmetry-distinct openings. Under each opening, MIN examines replies and backs up the smallest evaluation. The resulting branch summaries are negative one, negative two, and one. Those summaries—not the largest raw leaves—are what the root may compare.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the two-ply opening" -> focus: Two-ply tic-tac-toe opening tree
- "Enlarge the two-ply opening" -> popup: Inspect the evidence before backing up a value

### 2. Three-pass reading

Close the image. First identify MAX's opening choices. Second compute the minimum reply under each. Third select the maximum of those branch values at the root. This three-pass discipline separates tree structure from arithmetic and prevents the eye from teleporting directly to a favorite leaf.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "First identify" -> focus: Pass 1: MAX openings
- "Second" -> focus: Pass 2: MIN replies
- "Third" -> focus: Pass 3: MAX decision

### 3. Prediction before reveal

The branch values are negative one, negative two, and one. Pause before the next page and predict the root move. If MAX controls the root and utility favors MAX, the answer should be the branch with value one. Commitment before feedback makes a misconception visible instead of letting it escape wearing hindsight glasses.

**Phrase-timed cues:**

- "predict the root move" -> popup: Commit before seeing the answer
- "hindsight glasses" -> emoji: Prediction reveals reasoning

### 4. Symmetry and transpositions

The opening tree groups rotationally equivalent moves, while later search may encounter the same board through different move orders. Symmetry reduction and transposition tables both avoid duplicated reasoning, but their equivalence tests differ. Canonicalization must preserve player to move and value semantics, not merely make boards look alike.

**Phrase-timed cues:**

- "rotationally equivalent" -> focus: Symmetry representatives
- "same board" -> popup: Canonical state must preserve game meaning

### 5. Two-ply limitation

The opening tree sees only one reply after MAX's move. A branch valued at one may conceal a tactical problem at ply three. Depth-limited conclusions are conditional on the horizon and evaluator. Deeper search can reverse preferences, which is why iterative deepening watches for unstable decisions.

**Phrase-timed cues:**

- "opening tree" -> focus: Limited search horizon

## Slide 20 - What value reaches the root?

### 1. Expose the root-player error

Choose the first answer deliberately: negative two because MIN chooses at the root. The feedback rejects it. MIN produced each branch value, but MAX controls the root choice. Confusing who summarized a branch with who selects among branches is a common two-level error.

**Instructor action:** Choose MIN-at-root misconception.

**Phrase-timed cues:**

- "first answer" -> focus: Incorrect: MIN at root

### 2. Reveal the correct backup

Now choose the third answer. MAX receives negative one, negative two, and one, then selects the largest: one. The rightmost opening is chosen. Notice that the root does not rerun MIN arithmetic; it trusts the already backed-up child values.

**Instructor action:** Choose correct root value.

**Phrase-timed cues:**

- "third answer" -> focus: Correct: MAX selects 1
- "selects the largest" -> popup: max(-1,-2,1)=1

### 3. A compact audit recipe

When checking a minimax result, ask four questions: whose turn is the root, whose perspective defines utility, have child values already been backed up, and does the chosen action match the correct max or min operator? This audit is faster than staring harder at the tree and hoping guilt produces insight.

**Phrase-timed cues:**

- "four questions" -> emoji: Root · perspective · backup · operator
- "audit" -> popup: Verify structure before arithmetic

### 4. Why wrong answers are valuable

Selecting the MIN-at-root option reveals a structural misconception, not a subtraction mistake. Good formative assessment targets the decision rule students are likely to misapply. The correction should name the root player, explain that branch values are already minimized, and then perform the final max. Feedback that says only incorrect wastes a perfectly useful error.

**Phrase-timed cues:**

- "MIN-at-root" -> focus: Diagnose structure
- "structural misconception" -> popup: Explain why the rule fails

### 5. Backed-up values are interfaces

Once MIN has summarized a branch as one number, the root does not need every leaf to perform its max comparison. The branch value acts like an interface: complex internal reasoning becomes a compact promise about the outcome MIN can force. Good abstractions hide detail without changing meaning.

**Phrase-timed cues:**

- "branch value" -> popup: A subtree summary is a semantic interface

## Slide 21 - After the opponent moves, advance the root to the observed state

### 1. Enlarge and inspect the source figure

Enlarge the second-turn tree. The opponent's actual reply selects one child of the previous search tree. That observed position becomes the new root, with the player-to-move label advanced. Search continues from reality, not from branches that did not occur.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the second-turn tree." -> focus: Re-rooted tic-tac-toe tree
- "Enlarge the second-turn tree." -> popup: Inspect the evidence before backing up a value

### 2. Reuse valid work

Close the image. The first bullet permits reusing a matching subtree when state, rules, and depth semantics still match. The second permits transposition-table entries whose stored depth and bounds remain valid. Reuse saves computation, but stale information can be worse than no information because it arrives wearing a name badge.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "first bullet" -> focus: Reuse matching subtree
- "second" -> focus: Reuse valid transpositions

### 3. Rebuild only what changed

The final bullet says rebuild the parts invalidated by the new state or search budget. A fresh root may change remaining depth, timing, or legal actions. The principle is neither discard everything nor trust everything. Verify provenance, then reuse. This is memoization with adult supervision.

**Phrase-timed cues:**

- "final bullet" -> focus: Rebuild invalidated parts
- "adult supervision" -> emoji: Reuse only valid cached work

### 4. Tree reuse and moving horizons

When the root advances one ply, a subtree previously searched to depth four may now extend only three plies beyond the new root, depending on how depth was stored. Iterative deepening and transposition tables track depth precisely. Reuse is not copying a folder; it is preserving a claim with its scope attached.

**Phrase-timed cues:**

- "root advances" -> focus: Reuse with depth semantics
- "scope attached" -> popup: Cached value needs state, depth, and bound metadata

### 5. Transpositions versus subtrees

A transposition occurs when different action sequences reach the same complete game state. A subtree reuse follows the actual previous branch; a transposition table may reuse work reached by another order. Both require state equivalence, but transpositions make good hashing and canonical representation especially important.

**Phrase-timed cues:**

- "transposition table" -> focus: Reuse repeated states

## Slide 22 - Terminal losses override attractive cutoff features

### 1. Enlarge and inspect the source figure

Enlarge the late-game tree and locate the branches with exact losing outcomes. A terminal loss is not merely a very unattractive estimate. It is a resolved fact and receives exact losing utility, shown with an infinite-style value to dominate finite cutoff scores.

**Instructor action:** Enlarge source figure.

**Phrase-timed cues:**

- "Enlarge the late-game tree" -> focus: Late-game minimax threats
- "Enlarge the late-game tree" -> popup: Inspect the evidence before backing up a value

### 2. Terminal test before heuristic

Close the image. The first bullet says terminal losses use exact utility. The second reminds us that MIN will choose any available reply forcing the worst value for MAX. A feature score cannot vote to overrule checkmate, three-in-a-row, or another completed loss.

**Instructor action:** Close enlarged source figure.

**Phrase-timed cues:**

- "first bullet" -> focus: Exact terminal loss
- "second" -> focus: MIN forces the worst reply

### 3. Safety means every reply

The third bullet gives the robust condition: a move is safe only if every modeled opponent reply preserves the claimed lower bound. One attractive continuation is insufficient. Choosing a branch because one child looks wonderful is like declaring a bridge safe because one plank is excellent.

**Phrase-timed cues:**

- "third bullet" -> focus: Every reply must preserve the bound
- "one plank" -> emoji: A strategy must cover every opponent reply

### 4. Terminal values must dominate

Implementations often use large finite constants instead of infinity. Those constants must exceed any possible nonterminal evaluation magnitude, and faster wins or slower losses may add depth adjustments. Otherwise an enthusiastic heuristic can numerically outrank an actual victory, which is an impressive way to lose while winning the spreadsheet.

**Phrase-timed cues:**

- "large finite constants" -> focus: Exact terminal outcome
- "outrank an actual victory" -> popup: Terminal utility outranks cutoff estimates

### 5. Threat-first extensions

When a cutoff lands in the middle of a forcing tactic, programs may extend search until the position becomes quieter. In chess this is quiescence search; in tic-tac-toe it could mean resolving immediate wins and blocks. Selective extension spends depth where the evaluator is least trustworthy.

**Phrase-timed cues:**

- "a cutoff" -> focus: Resolve forcing tactics

## Slide 23 - Minimax is safe under assumptions—not magic

### 1. Best-first misconception

Choose Best-first. The claim says ordinary best-first should work because it follows the best-looking state. The revision explains the missing alternation: ordinary best-first assumes one search agent controls the path, whereas minimax backs up decisions made by MAX and MIN. A priority queue does not automatically grow an opponent model.

**Instructor action:** Choose best-first misconception.

**Phrase-timed cues:**

- "Best-first" -> focus: Best-first misconception
- "revision" -> focus: Revised claim

### 2. Opponent mistake misconception

Choose Opponent mistake. A blunder does not invalidate minimax. Observe the resulting state, re-root or re-search, and exploit the improved opportunity. Minimax guarantees protection against strong opposition; it does not require the opponent to remain strong for the agent to function.

**Instructor action:** Choose opponent-mistake misconception.

**Phrase-timed cues:**

- "Opponent mistake" -> focus: Opponent mistake misconception
- "improved opportunity" -> popup: A mistake can raise the achievable value

### 3. Guaranteed-win misconception

Choose Guaranteed win. Minimax guarantees the best worst-case outcome under its assumptions, not victory from every position. A losing position remains losing against perfect play; a drawable position may guarantee only a draw. The algorithm is a careful strategist, not a coupon code for victory.

**Instructor action:** Choose guaranteed-win misconception.

**Phrase-timed cues:**

- "Guaranteed win" -> focus: Guaranteed-win misconception
- "coupon code" -> emoji: Minimax cannot manufacture a winning position

### 4. Guarantee language checklist

A defensible minimax claim names the game model, utility perspective, search depth or completeness, evaluation function, opponent assumption, and result type. Remove any one and guarantees can inflate. Saying minimax guarantees a win is almost always missing the starting position; saying it guarantees the best worst-case modeled outcome is precise.

**Phrase-timed cues:**

- "names the game model" -> focus: Test the revised claim
- "names the game model" -> popup: Precise claims expose assumptions

### 5. Mistakes do not break safety

If minimax planned for the strongest reply, a weaker reply cannot make the guaranteed value worse in the same deterministic model. It may open better opportunities. The agent still recalculates because the new root differs, but the opponent's mistake is a gift, not a software exception.

**Phrase-timed cues:**

- "opponent's mistake" -> focus: Exploit a weaker reply

## Slide 24 - Six questions that reveal whether minimax is understood

### 1. Question one

Choose Q1. Root type follows the player to move, while utility perspective remains fixed. If MAX moves, the root maximizes; if MIN moves, the root minimizes. Name both facts before backing up a single number.

**Instructor action:** Choose Q1.

**Phrase-timed cues:**

- "Q1" -> focus: Root MAX or MIN

### 2. Question two

Now choose Q2. MAX and MIN alternate because legal control alternates. The numeric perspective does not flip with the operator. This distinction establishes the skeleton of every correct minimax trace.

**Instructor action:** Choose Q2.

**Phrase-timed cues:**

- "Q2" -> focus: Why alternate

### 3. Question three

Choose Q3. MIN chooses its own best move, which minimizes MAX utility. Calling it the worst move without naming the perspective is misleading: it is worst for MAX and best for MIN.

**Instructor action:** Choose Q3.

**Phrase-timed cues:**

- "Q3" -> focus: MIN's objective

### 4. Question four

Choose Q4. Terminal leaves use exact utility, cutoff leaves use evaluation, and internal nodes use backed-up child values. The search horizon determines the source of a leaf value.

**Instructor action:** Choose Q4.

**Phrase-timed cues:**

- "Q4" -> focus: Leaf evaluation semantics

### 5. Question five

Choose Q5. No player chooses at a leaf. Instead, the terminal rule or cutoff rule returns a number to the waiting recursive call. Game control and recursive computation are different layers.

**Instructor action:** Choose Q5.

**Phrase-timed cues:**

- "Q5" -> focus: No choice at a leaf

### 6. Question six

Finally choose Q6. After an opponent move, advance the root to the observed child and reuse only subtrees or transpositions that remain valid. Re-rooting separates the plan we imagined from the move that actually occurred.

**Instructor action:** Choose Q6.

**Phrase-timed cues:**

- "Q6" -> focus: Re-root and reuse

### 7. Explain to learn

The six-question clinic is not trivia. Each answer forces a causal explanation: who acts, why operators alternate, where values originate, and when work can be reused. If an explanation relies on memorized arrows without a fixed utility perspective, construct a two-level counterexample and make the speaker predict the root value.

**Phrase-timed cues:**

- "ANSWER" -> focus: Explain the mechanism
- "causal explanation" -> emoji: Teach the rule through a trace

### 8. Oral exam shortcut

Ask a student to explain why MIN selects the smallest MAX-perspective value without using the words because that is the rule. A good answer mentions opposed utilities and control of the action. Requiring mechanism instead of recitation distinguishes a mental model from a memorized traffic signal.

**Phrase-timed cues:**

- "ASK" -> focus: Explain, do not recite

## Slide 25 - Formulate, back up, evaluate, and defend

### 1. Formulate

The first exit card asks you to formulate the game: state, player, actions, result, terminal test, utility, and assumptions. If one component is missing, minimax may still produce numbers, but the numbers answer a different question. Formulation is where correctness begins, long before recursion begins looking clever.

**Phrase-timed cues:**

- "first exit card" -> focus: 1. Formulate

### 2. Trace and critique

The second card asks for a complete backup with MAX and MIN labels, terminal and cutoff semantics, and a circled root action. The third asks you to critique an evaluator by naming a feature, a failure case, and an experiment. Calculation shows what the algorithm did; critique asks whether it was worth doing.

**Phrase-timed cues:**

- "second card" -> focus: 2. Trace
- "third" -> focus: 3. Critique

### 3. Prepare for alpha-beta

The final panel previews Lesson 8. Alpha-beta pruning returns the same depth-limited minimax decision while proving that some branches cannot affect the result. It changes efficiency, not the decision rule. Today's exit sentence is: MAX chooses the best outcome that MIN cannot prevent, under explicit assumptions and a fixed utility perspective.

**Phrase-timed cues:**

- "final panel" -> focus: Next: alpha-beta pruning
- "same depth-limited minimax decision" -> popup: Pruning changes work, not minimax value

### 4. Bridge to alpha-beta

Alpha-beta will maintain lower and upper path bounds. When those bounds prove a remaining branch cannot improve the current decision, the branch is skipped without changing the minimax result. Move ordering changes how much is pruned, not correctness. The conceptual prerequisite is today's exact backup rule; pruning is a proof layered on top.

**Phrase-timed cues:**

- "Alpha-beta" -> focus: Alpha-beta preview
- "without changing" -> popup: Same minimax value, fewer evaluated nodes

### 5. One-sentence synthesis

Minimax chooses the action with the greatest value that an optimal opponent cannot push lower, using terminal utilities or cutoff estimates backed through alternating control. If that sentence feels dense, draw a two-level tree and attach each phrase to a layer. Compression should follow understanding, not replace it.

**Phrase-timed cues:**

- "draw a two-level tree" -> focus: Complete minimax synthesis
