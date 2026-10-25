"use client";

import { useState } from "react";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l05-minimax-pruning";

const recursiveTrace = [
  {
    label: "Enter the root",
    call: "MINIMAX-DECISION(s0) → MAX-VALUE(s0)",
    returned: "No value yet",
    detail:
      "The player to move is MAX, so the root compares the value returned for every legal action.",
  },
  {
    label: "Search action A",
    call: "MAX-VALUE(s0) → MIN-VALUE(A)",
    returned: "min(3, 5) = 3",
    detail:
      "MIN chooses the reply that leaves MAX utility 3. The call returns 3 to the root.",
  },
  {
    label: "Search action B",
    call: "MAX-VALUE(s0) → MIN-VALUE(B)",
    returned: "min(2, 9) = 2",
    detail:
      "The attractive leaf 9 does not control B because an optimal MIN player can force 2.",
  },
  {
    label: "Search action C",
    call: "MAX-VALUE(s0) → MIN-VALUE(C)",
    returned: "min(4, 1) = 1",
    detail:
      "The third action returns 1. Each recursive call completes before the next sibling is searched.",
  },
  {
    label: "Return the decision",
    call: "arg max{A:3, B:2, C:1}",
    returned: "Choose A; backed-up value = 3",
    detail:
      "Depth-first recursion computes a value for each action; the root returns the action with the largest one.",
  },
];

function RecursiveMinimaxTrace() {
  const [step, setStep] = useState(0);
  const state = recursiveTrace[step];

  return (
    <div className="frontier-trace minimax-example-trace">
      <section>
        <span>Live recursive-call trace · {step + 1} of {recursiveTrace.length}</span>
        <h3>{state.label}</h3>
        <p>{state.detail}</p>
        <div>
          <button
            disabled={step === 0}
            onClick={() => setStep(value => Math.max(0, value - 1))}
            type="button"
          >
            Previous
          </button>
          <button
            disabled={step === recursiveTrace.length - 1}
            onClick={() => setStep(value => Math.min(recursiveTrace.length - 1, value + 1))}
            type="button"
          >
            Next call
          </button>
          <button onClick={() => setStep(0)} type="button">Reset</button>
        </div>
      </section>
      <div className="frontier-queues">
        <figure className="minimax-trace-tree">
          <svg viewBox="0 0 600 235" role="img" aria-labelledby="minimax-trace-title minimax-trace-description">
            <title id="minimax-trace-title">Example tree used by this recursive trace</title>
            <desc id="minimax-trace-description">MAX root s0 chooses among MIN nodes A, B, and C. A has terminal utilities 3 and 5; B has 2 and 9; C has 4 and 1. MIN returns 3, 2, and 1, so MAX chooses A with value 3.</desc>
            {[100, 300, 500].map((x, index) => {
              const active = step === index + 1 || (step === 4 && index === 0);
              const returned = step >= index + 1;
              const leaves = [[3, 5], [2, 9], [4, 1]][index];
              return <g key={x} stroke={active ? "#6740d9" : "#52627a"} strokeWidth={active ? 4 : 2}>
                <path d={`M300 48 L${x} 100 M${x} 132 L${x - 45} 186 M${x} 132 L${x + 45} 186`} fill="none" />
                <rect x={x - 68} y="94" width="136" height="42" rx="10" fill={active ? "#eee8ff" : "#f0f4f9"} />
                <text x={x} y="121" textAnchor="middle" stroke="none" fill="#111827" fontSize="21" fontWeight="700">{["A", "B", "C"][index]} · MIN{returned ? ` = ${[3, 2, 1][index]}` : ""}</text>
                {leaves.map((value, leaf) => <g key={leaf}>
                  <circle cx={x + (leaf === 0 ? -45 : 45)} cy="199" r="21" fill="white" />
                  <text x={x + (leaf === 0 ? -45 : 45)} y="207" textAnchor="middle" stroke="none" fill="#111827" fontSize="24" fontWeight="700">{value}</text>
                </g>)}
              </g>;
            })}
            <rect x="205" y="8" width="190" height="42" rx="10" fill="#1d2b45" />
            <text x="300" y="36" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">s0 · MAX{step === 4 ? " = 3" : ""}</text>
          </svg>
          <figcaption><strong>Given terminal utilities, measured for MAX.</strong> These six leaf scores are inputs to this example. MIN returns the smaller score in each pair; MAX takes max(3, 2, 1) = 3.</figcaption>
        </figure>
        <article>
          <span>Current call</span>
          <strong>{state.call}</strong>
          <small>Calls descend until a terminal state or cutoff state supplies a value.</small>
        </article>
        <article>
          <span>Returned value</span>
          <strong>{state.returned}</strong>
          <small>Values return upward; actions do not return from leaves to the physical game.</small>
        </article>
      </div>
    </div>
  );
}

// Native reconstruction of the knowledge carried by source asset minimax-pseudocode.png.
function NativeMinimaxAlgorithm() {
  return (
    <figure className="meeting07-minimax-code" aria-labelledby="meeting07-minimax-caption">
      <figcaption id="meeting07-minimax-caption">
        <span>Minimax algorithm</span>
        <small>Read top to bottom; recursive calls alternate MAX and MIN.</small>
      </figcaption>
      <section aria-label="Minimax decision procedure">
        <h3><b>function</b> MINIMAX-DECISION(<i>state</i>) <em>returns an action</em></h3>
        <code><mark className="decision">v ← MAX-VALUE(state)</mark></code>
        <code><mark className="decision">return the action in SUCCESSORS(state) with value v</mark></code>
      </section>
      <section aria-label="Maximum value procedure">
        <h3><b>function</b> MAX-VALUE(<i>state</i>) <em>returns a utility value</em></h3>
        <code><mark className="terminal">if TERMINAL-TEST(state) then return UTILITY(state)</mark></code>
        <code>v ← −∞</code>
        <code>for a, s in SUCCESSORS(state) do</code>
        <code className="indent"><mark className="recursive">v ← MAX(v, MIN-VALUE(s))</mark></code>
        <code>return v</code>
      </section>
      <section aria-label="Minimum value procedure">
        <h3><b>function</b> MIN-VALUE(<i>state</i>) <em>returns a utility value</em></h3>
        <code><mark className="terminal">if TERMINAL-TEST(state) then return UTILITY(state)</mark></code>
        <code>v ← +∞</code>
        <code>for a, s in SUCCESSORS(state) do</code>
        <code className="indent"><mark className="recursive">v ← MIN(v, MAX-VALUE(s))</mark></code>
        <code>return v</code>
      </section>
    </figure>
  );
}

const scoringCases = [
  {
    label: "State A",
    player: 6,
    opponent: 5,
    score: 1,
    meaning: "X has one more still-open winning line than O.",
  },
  {
    label: "State B",
    player: 4,
    opponent: 6,
    score: -2,
    meaning: "The position favors O under this feature definition.",
  },
  {
    label: "State C",
    player: 5,
    opponent: 4,
    score: 1,
    meaning: "A different board can receive the same score because this heuristic compresses detail.",
  },
];

function TicTacToeScoringPractice() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = scoringCases[active];

  return (
    <div className="algorithm-selection">
      <nav aria-label="Choose a tic-tac-toe scoring case">
        {scoringCases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.label}
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
        <span>{item.label} · evaluation practice</span>
        <h3>M(n) = {item.player}; O(n) = {item.opponent}</h3>
        <p>
          Compute <strong>E(n) = M(n) − O(n)</strong>, then say whether the score
          favors X, favors O, or is neutral. Do not reveal until everyone has
          written the arithmetic.
        </p>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide result" : "Reveal result"}
        </button>
        {revealed && (
          <SearchCallout label={`E(n) = ${item.score}`} tone="green">
            {item.meaning}
          </SearchCallout>
        )}
      </section>
    </div>
  );
}

const misconceptionCases = [
  {
    label: "Best-first?",
    claim: "Ordinary best-first search should work for a game because it already follows the best-looking state.",
    response:
      "Not by itself. A game alternates who controls the next action. Minimax backs up MAX and MIN choices; ordinary best-first assumes one search agent controls the path.",
  },
  {
    label: "Opponent mistake?",
    claim: "If the opponent makes a mistake, a minimax policy can no longer use the result.",
    response:
      "False. Observe the resulting state, re-search or reuse a valid subtree, and choose the new minimax action. The mistake may create a better achievable outcome.",
  },
  {
    label: "Guaranteed win?",
    claim: "Using minimax guarantees a win against any player who does not use minimax.",
    response:
      "False. Minimax guarantees the best worst-case result under the modeled rules and search assumptions. A win is guaranteed only from a theoretically winning position.",
  },
];

function MisconceptionStudio() {
  const [active, setActive] = useState(0);
  const item = misconceptionCases[active];

  return (
    <div className="search-review-studio">
      <nav aria-label="Choose a minimax misconception">
        {misconceptionCases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <ol>
        <li>
          <span>CLAIM</span>
          <p><strong>{item.claim}</strong></p>
        </li>
        <li>
          <span>TEST</span>
          <p>Identify who controls each action, what is guaranteed, and which assumptions the claim hides.</p>
        </li>
        <li>
          <span>REVISE</span>
          <p>{item.response}</p>
        </li>
        <li>
          <span>EVIDENCE</span>
          <p>Use a complete small game tree or a matched-depth experiment to test the revised statement.</p>
        </li>
      </ol>
    </div>
  );
}

const clinicQuestions = [
  {
    label: "Q1",
    question: "How do we decide MIN or MAX at the root node?",
    answer:
      "The player to move and the fixed utility perspective determine the node type. If utility is defined for the agent whose turn it is, that agent is MAX; the sign convention stays fixed throughout the tree.",
  },
  {
    label: "Q2",
    question: "Why do we alternate MIN and MAX?",
    answer:
      "Legal turns alternate. MAX chooses the action with greatest utility for MAX; under a two-player zero-sum model, MIN rationally chooses the action with smallest utility for MAX.",
  },
  {
    label: "Q3",
    question: "When we begin with MAX, do MIN nodes try to choose the worst move?",
    answer:
      "MIN does not choose a bad move for itself. MIN chooses its best reply, which is the reply that minimizes MAX's utility under the shared zero-sum utility convention.",
  },
  {
    label: "Q4",
    question: "Why do we apply an evaluation function only to leaf nodes?",
    answer:
      "Terminal leaves use exact utility. Nonterminal depth-cutoff leaves use an evaluation estimate. Internal values are computed by MAX/MIN backup, so evaluating them independently would mix incompatible horizons.",
  },
  {
    label: "Q5",
    question: "If leaf nodes correspond to the opponent's turn, do we always choose MIN?",
    answer:
      "No choice is made at a leaf. A terminal test or cutoff returns a value. MAX or MIN applies at an internal state according to whose action is next.",
  },
  {
    label: "Q6",
    question: "Do we reuse the same game tree after the opponent moves?",
    answer:
      "Advance the root to the observed child and reuse a matching subtree or valid transposition-table entries. Rebuild only portions invalidated by the new state, rules, or search budget.",
  },
];

function SourceQuestionClinic() {
  const [active, setActive] = useState(0);
  const item = clinicQuestions[active];

  return (
    <div className="search-review-studio">
      <nav aria-label="Choose a source question">
        {clinicQuestions.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <ol>
        <li>
          <span>ASK</span>
          <p><strong>{item.question}</strong></p>
        </li>
        <li>
          <span>ANSWER</span>
          <p>{item.answer}</p>
        </li>
        <li>
          <span>CHECK</span>
          <p>Point to the player label, utility perspective, terminal test, or cutoff rule that makes the answer precise.</p>
        </li>
        <li>
          <span>TEACH</span>
          <p>Explain it without saying that MIN deliberately plays badly or that a heuristic changes whose turn it is.</p>
        </li>
      </ol>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Module 5 · Lesson 7 · Adversarial search",
    title: "Game Trees, Minimax, and Evaluation Functions",
    subtitle: "How should an agent choose when another agent actively tries to defeat it?",
    content: (
      <div className="search-hero">
        <section>
          <span>Driving question</span>
          <h3>What is a good move when the next move belongs to an opponent?</h3>
          <p>
            Ordinary path search controls every action. Game playing requires a
            contingent strategy: choose now while reasoning about the best reply
            another rational agent can make.
          </p>
        </section>
        <SearchSourceImage
          alt="Two chess players across a chessboard"
          caption="Chess makes alternating control, opponent modeling, and strategic utility visible."
          file="chess-zero-sum-players.png"
          sourceRoot={SOURCE_ROOT}
        />
      </div>
    ),
    note: "Ordinary search asks which path reaches a goal when the agent controls every step. A game changes one small word with enormous consequences: the next action may belong to an opponent. Now a good move is not merely followed by our favorite continuation. It must survive the strongest legal reply. The solution therefore becomes a contingent strategy—a plan with an answer for each opponent response. Imagine planning a picnic while someone across the table actively moves the sandwiches. That is adversarial search: the environment is not merely uncertain; another decision-maker selects actions against your objective. Chess gives us clean rules, visible turns, and outcomes, but the logic also appears in cybersecurity, negotiation, auctions, and competitive scheduling. We will formulate a game tree, keep utility from one fixed perspective, alternate MAX and MIN, trace recursive minimax, distinguish terminal utility from cutoff evaluation, calculate complete backups, and critique what minimax actually guarantees. The central habit is simple: never select a shiny leaf until you know who controls the branch leading to it. In intrusion response, a defender chooses monitoring or containment actions while an attacker adapts. A game-state model must represent privileges, observations, and whose action occurs next. Minimax can express worst-case defense in a simplified deterministic model, but real attackers have hidden information and unequal action spaces. The transfer is useful precisely because it reveals which clean classroom assumptions break first. Suppose MAX can choose Calm or Flashy. Calm guarantees a draw against every reply. Flashy wins if MIN cooperates but loses if MIN notices one counter. Minimax chooses Calm because the branch value is set by the counter, not the promotional brochure. That tiny example is the whole lesson in pocket size.",
    sourceSlides: [1, 7],
  },
  {
    eyebrow: "Why games? · Research value",
    title: "Game playing is formal, nontrivial, and easy to compare",
    content: (
      <div className="search-objectives">
        <article>
          <span>01 · Reasoning laboratory</span>
          <h3>Formal but difficult</h3>
          <p>Rules and legal moves are explicit, yet good decisions require deep reasoning under combinatorial growth.</p>
        </article>
        <article>
          <span>02 · Measurable progress</span>
          <h3>Direct comparison</h3>
          <p>Systems can play humans and other programs under the same rules, outcomes, clocks, and starting conditions.</p>
        </article>
        <article>
          <span>03 · Multi-agent ideas</span>
          <h3>Conflict and cooperation</h3>
          <p>Games expose competition, cooperation, opponent models, incentives, and strategic interaction.</p>
        </article>
      </div>
    ),
    note: "The first card describes games as a reasoning laboratory. Legal moves and victory conditions are explicit, so an incorrect decision cannot blame a vague task definition. Yet the tree can grow explosively, forcing representation, search, evaluation, and resource management to work together. Games are tidy laboratories with extremely untidy combinatorics. The second card is direct comparison. Humans and programs can play under identical boards, clocks, rules, and starting positions. Win rate is visible, but serious evaluation also controls opponent strength, color or first-move advantage, time budget, and repeated trials. One dramatic victory is evidence; it is not a complete performance distribution. The third card expands beyond winning. Games expose conflict, partial cooperation, incentives, beliefs about other agents, and strategic interaction. A traffic merge, market bid, or shared-resource negotiation may not be zero-sum, but each requires reasoning about choices that depend on other choices. The board is small; the conceptual luggage is carry-on size only in theory. A game program evaluated only against one opponent may overfit that opponent's style. Strong evidence uses opponents with different strategies, matched compute, alternating starting advantages, and many games. Report draws and confidence intervals, not merely wins. The same principle applies to agent benchmarks: a narrow adversary can turn a brittle trick into a heroic-looking score. Games offered repeatable experiments long before robots could safely roam messy streets. Researchers could change a search rule, replay thousands of positions, and compare outcomes. The environment was controlled enough for science yet difficult enough to expose weaknesses. A board became a wind tunnel for reasoning algorithms.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Strategy games · Structural ingredients",
    title: "Games of strategy specify what can happen and how outcomes are valued",
    content: (
      <div className="algorithm-map">
        <section>
          <article><span>1</span><h3>Sequence</h3><p>Players make a sequence of moves, often in alternating turns.</p></article>
          <article><span>2</span><h3>Legality</h3><p>Rules specify which moves are possible from each state.</p></article>
          <article><span>3</span><h3>Outcome</h3><p>A terminal test identifies completed games and terminal utility values the result.</p></article>
          <article><span>4</span><h3>Objective</h3><p>Each player chooses actions to maximize utility from its fixed perspective.</p></article>
        </section>
        <aside>
          <span>Important correction</span>
          <p>A strategy game does not require a reward for every move.</p>
          <p>Completed outcomes receive terminal utility.</p>
          <p>Nonterminal cutoff states may receive an evaluation estimate.</p>
        </aside>
      </div>
    ),
    note: "Begin with the first two cards. A game unfolds as a sequence of moves, and the rules define which moves are legal from each state. In tic-tac-toe, alternating marks and empty squares determine legality. In chess, piece movement, check, and special rules matter. Without legality, the tree is fan fiction rather than a game model. The third card introduces completed outcomes: a terminal test detects win, loss, draw, or another end condition. The fourth card gives the objective. Each player chooses actions to maximize utility from a fixed perspective. Utility summarizes preference; it need not be money, points, or happiness measured with suspicious confidence. The correction in the side panel matters. We do not need a reward after every move. A completed game receives exact terminal utility. If time forces search to stop at a nonterminal state, an evaluation function estimates its value. Mixing those two sources is like replacing a final exam grade with a weather forecast because both contain numbers. Small rule differences can reshape the entire tree. Allowing a pass move, repetition draw, or hidden card changes actions, terminal tests, and sometimes the state representation. Before reusing an algorithm trace, verify that the formal game is identical. A chess engine asked to play checkers is not confused by strategy; it has been handed the wrong universe. If win, draw, and loss receive ten, zero, and minus ten, the numbers primarily encode preference order. They need not measure ten units of joy. Magnitudes matter when evaluators compare nonterminal states, so document whether differences have semantic meaning or merely preserve ranking.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Games versus ordinary search",
    title: "An unpredictable opponent turns a path into a contingency",
    content: (
      <div className="search-comparison-table">
        <div><span>Issue</span><span>Ordinary search</span><span>Adversarial game search</span></div>
        <div><span>Who acts?</span><p>The search agent selects each step on its path.</p><p>Control alternates; the opponent selects replies.</p></div>
        <div><span>Solution form</span><p>One action sequence to a goal.</p><p>A move plus a response for every possible opponent reply.</p></div>
        <div><span>Time limit</span><p>A goal may be found before execution.</p><p>A clock can force a move before terminal states are reached.</p></div>
        <div><span>Approximation</span><p>Search depth may be sufficient for exact cost.</p><p>Use a cutoff and evaluation function when full resolution is infeasible.</p></div>
      </div>
    ),
    note: "Read the first comparison row. Ordinary search assumes the searching agent selects every step. Adversarial search alternates control, so the opponent chooses replies. This is not ordinary environmental randomness. A rational opponent prefers outcomes that are good for them, which under a zero-sum convention are bad for MAX. The second row changes the shape of an answer. A route is one sequence. A strategy says: if the opponent replies A, do this; if B, do that. It resembles an emergency phone tree rather than a single itinerary. The agent chooses one move now while preserving a response for every modeled reply. The final rows explain why game programs often cannot search to the end. A clock demands a move while the tree remains unfinished. The program chooses a cutoff depth and evaluates those frontier positions. Deeper search usually helps, but only if computation finishes on time and the evaluator is meaningful. A perfect move submitted tomorrow is still a forfeit today. A deterministic strategy maps every reachable decision state to an action. A stochastic strategy maps states to probability distributions over actions. Today's minimax policy is deterministic when tie-breaking is fixed, but the contingency structure still matters. Writing only the chosen root move hides the responses that justify its safety. A strategy can be far larger than the single line eventually played because it must specify actions for replies that never occur. Planning therefore spends computation on counterfactual branches. Those unused branches are not waste; they are the evidence that the chosen move remains defensible when the opponent selects another path.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Two-player game · Decision loop",
    title: "Observe, generate, evaluate, move—and repeat",
    content: (
      <div className="problem-solving-pipeline">
        <article><span>01</span><h3>Opponent moves</h3><p>Observe the new legal position.</p></article>
        <i>→</i>
        <article><span>02</span><h3>Generate</h3><p>Create legal successors from the current position.</p></article>
        <i>→</i>
        <article><span>03</span><h3>Test</h3><p>If the game is over, return terminal utility.</p></article>
        <i>→</i>
        <article><span>04</span><h3>Evaluate</h3><p>Back up successor values through the game tree.</p></article>
        <i>→</i>
        <article><span>05</span><h3>Move</h3><p>Select the highest-valued successor for MAX.</p></article>
      </div>
    ),
    note: "Follow the pipeline from left to right. First observe the opponent's move and obtain the new legal position. Second generate the legal successors. The state must contain enough information to determine whose turn it is, which actions are possible, and whether history-dependent rules apply. A missing turn label can make MAX confidently optimize the opponent's move. Third test whether the game is over. A terminal state returns exact utility immediately. Fourth, if the search continues, evaluate successors and back their values through alternating layers. The order matters: terminal facts outrank heuristic impressions. Never tell a checkmated king that the material score still looks promising. Finally MAX selects the successor with the highest backed-up value, executes the move, and waits. The opponent then changes the state, so the loop begins again. The repeated cycle explains why a game-playing system is not a one-time solver; it is a decision process synchronized with another agent. A game agent has both intellectual and temporal constraints. Deeper search can improve a move until the clock expires and converts wisdom into a loss. Practical systems allocate time by position complexity, reuse prior search, and keep a legal fallback move. Runtime is not a footnote; in games it participates directly in utility. Real programs often preserve the best completed result from an earlier depth while searching deeper. If the clock interrupts, they still have a legal move backed by finished analysis. This iterative-deepening pattern turns time uncertainty into graceful degradation instead of a dramatic stare at the board followed by forfeiture.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Game theory · Broader frame",
    title: "Conflict and cooperation can both be modeled mathematically",
    content: (
      <div className="search-driving-question">
        <section>
          <span>Definition</span>
          <h3>“The study of mathematical models of conflict and cooperation between intelligent rational decision-makers.”</h3>
          <p>Game theory asks how outcomes depend on interdependent choices, not just on one agent’s search path.</p>
        </section>
        <div>
          <article><span>Origins</span><strong>Two-person zero-sum games</strong><small>von Neumann’s early formal work made directly opposed utilities central.</small></article>
          <article><span>Modern scope</span><strong>Logical decision making</strong><small>Applications span humans, animals, computer agents, markets, and institutions.</small></article>
          <article><span>Conflict</span><strong>Goals oppose</strong><small>One player’s better outcome can reduce another player’s utility.</small></article>
          <article><span>Cooperation</span><strong>Goals align partly</strong><small>Players may coordinate, bargain, form coalitions, or share gains.</small></article>
        </div>
      </div>
    ),
    note: "The definition panel frames game theory as mathematical models of conflict and cooperation among rational decision-makers. The crucial word is interdependent: my best action depends on what others choose, and their best actions may depend on what they expect from me. The model turns mutual side-eye into mathematics. The first two cards distinguish history from scope. Early formal work emphasized two-person zero-sum games. Modern game theory studies decisions involving people, animals, software agents, firms, and institutions. Minimax is therefore one precise tool within a much wider field, not a universal recipe for every interaction. The last two cards show opposing and partially aligned goals. In conflict, improving one player's outcome may reduce another's. In cooperation, participants may share gains, bargain, or form coalitions. Lesson 7 deliberately narrows to deterministic, alternating, two-player, zero-sum, perfect-information games so the minimax logic is visible before the assumptions are relaxed. A rational action maximizes expected preference given a model, information, and constraints. If utility omits safety, fairness, or long-term effects, perfectly rational optimization can produce an undesirable result. Game theory does not certify the values supplied to it. Mathematics can optimize a scoreboard while politely declining responsibility for who designed the scoreboard. Voting rules, auctions, and bargaining protocols shape which strategies are attractive. Changing the rules changes incentives even when the participants remain the same. Game-theoretic analysis therefore studies mechanism design as well as individual play: sometimes the intelligent action is redesigning the game rather than searching harder inside it.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Game taxonomy · Utility relationships",
    title: "Zero-sum is one game type—not a synonym for every game",
    content: (
      <div className="search-objectives">
        <article>
          <span>Zero-sum</span>
          <h3>Utilities balance exactly</h3>
          <p>One participant’s gain is matched by another participant’s loss; a single MAX-perspective value is sufficient.</p>
        </article>
        <article>
          <span>Non-zero-sum</span>
          <h3>Joint gains can vary</h3>
          <p>Aggregate gains and losses may be above or below zero. The prisoner’s dilemma is a canonical example.</p>
        </article>
        <article>
          <span>Other dimensions</span>
          <h3>Do not collapse the taxonomy</h3>
          <p>Games may be cooperative/non-cooperative, symmetric/asymmetric, simultaneous/sequential, deterministic/stochastic, or perfect/imperfect information.</p>
        </article>
      </div>
    ),
    note: "The first card defines zero-sum: gains and losses balance exactly. If utility is written from MAX's perspective, MIN can use the same number and prefer smaller values. This single scale is why minimax can alternate max and min operations without changing the meaning of utility halfway down the tree. The second card describes non-zero-sum games, where total welfare can rise or fall. The prisoner's dilemma is famous because individually tempting choices can produce a jointly worse result. A single scalar for MAX may no longer represent both players' preferences, so ordinary two-player zero-sum minimax is not automatically appropriate. The third card prevents taxonomy soup. Zero-sum does not imply alternating turns, determinism, symmetry, or perfect information. Those are separate dimensions. Poker is competitive yet stochastic and imperfect-information; rock-paper-scissors is simultaneous; cooperative games may still be sequential. Label assumptions separately instead of ordering one deluxe game-description combo. For a truly constant-sum two-player game, subtracting a constant can transform utilities into zero-sum form without changing preferences. But games with variable joint welfare cannot be repaired by arithmetic cosmetics. Determine whether interests are strictly opposed before applying one shared scalar and the ordinary min operator. Chess and tic-tac-toe reveal the full position to both players. Poker does not. In imperfect-information games, a search state may include beliefs over hidden cards and strategies may randomize to avoid exploitation. Ordinary minimax on one visible tree cannot simply pretend the hidden information has taken a coffee break.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Chess · Alternating control",
    title: "A good move anticipates the opponent's best reply",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Two people playing chess"
          caption="Rules, alternating turns, opponent actions, and strategic utility define the decision problem."
          file="chess-zero-sum-players.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <span>Think–pair–share</span>
          <h3>Play one candidate move, then answer as the opponent</h3>
          <ul>
            <li>Know the rules and legal moves before searching.</li>
            <li>Account for the opponent’s actions on alternate turns.</li>
            <li>“Maximize my advantage” means maximize a fixed utility—not always maximize a raw board score.</li>
            <li>In a zero-sum convention, the opponent rationally minimizes that same utility.</li>
          </ul>
          <SearchCallout label="Try it" tone="cyan">
            With a partner, name one chess move that looks strong until the opponent’s best reply is considered.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Enlarge the chess image and imagine one tempting move. The board after our move is not the end of the analysis; it is the starting point for the opponent's strongest legal reply. Strategic quality belongs to the move-and-reply structure, not to how impressive our move looks in isolation. Close the image. The list asks us to know the rules, alternate turns, and keep utility consistent. For each candidate move, temporarily sit in the other chair and find the reply that hurts MAX most. This is not pessimism as a personality trait. It is robust planning under optimal opposition. Minimax resembles choosing an umbrella after asking the cloud for its strongest rebuttal. A move that wins a queen but permits checkmate is not good because the opponent controls the checkmating reply. The source callout invites a partner example: propose a strong-looking move, then deliberately search for its refutation. Minimax is robust against the modeled strongest reply. A predictive opponent model instead estimates what this particular opponent is likely to do. Exploitation may score better against a weak pattern but become vulnerable if the pattern changes. Practical agents sometimes balance safe minimax play with opponent-specific opportunities. Strong human players do not merely generate brilliant moves; they rapidly reject moves with tactical refutations. Minimax formalizes that habit. For each candidate, ask what the opponent would love to play next. Expertise often looks like creativity, but much of it is efficient prevention of embarrassment.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Formal model · Adversarial problem",
    title: "A game tree needs states, turns, actions, outcomes, and utilities",
    content: (
      <div className="source-definition-layout">
        <section className="definition-stack">
          <article><span>S</span><p><strong>State:</strong> the complete position needed to determine legal play.</p></article>
          <article><span>Player(s)</span><p><strong>Turn:</strong> identifies which player controls the next action.</p></article>
          <article><span>Actions(s)</span><p><strong>Legal moves:</strong> the choices available to that player.</p></article>
        </section>
        <section className="definition-stack">
          <article><span>Result(s,a)</span><p><strong>Transition:</strong> the position produced by a legal action.</p></article>
          <article><span>Terminal(s)</span><p><strong>End test:</strong> win, loss, draw, or another completed outcome.</p></article>
          <article><span>Utility(s,p)</span><p><strong>Value:</strong> exact preference for player p at a terminal state.</p></article>
        </section>
      </div>
    ),
    note: "The first column defines state, player, and actions. A state is the complete position needed for future legal play. Player identifies who controls the next action. Actions lists that player's legal moves. For tic-tac-toe, the board alone is insufficient if we do not know whose mark comes next. The second column completes the model. Result applies an action to produce a successor. Terminal identifies completed games. Utility gives an exact preference for a player at terminal states. These are definitions, not optional implementation decorations; minimax calls each one in a specific place. For tic-tac-toe, state contains nine cells and player to move; actions are empty squares; result adds the current mark; terminal detects three-in-a-row or a full board; utility might be plus one, zero, or minus one for X. This compact tuple is the contract that turns a familiar game into a searchable decision problem. Two histories may show the same board but differ in legal futures because of repetition rules, castling rights, or move counters. If future actions or terminal status differ, they are not the same search state. The Markov test is practical: can the stored state determine every legal continuation and value-relevant condition without consulting hidden history? A simple consistency test is to narrate every value as good or bad for the same player. If positive three means good for X at one layer but good for O at the next, the tree has changed languages mid-sentence. Fix the perspective before applying MAX or MIN.",
    sourceSlides: [2, 7, 8],
  },
  {
    eyebrow: "Minimax · Modeling assumption",
    title: "Plan against an opponent who also searches rationally",
    content: (
      <div className="algorithm-definition">
        <section>
          <span>Assumption</span>
          <h3>The opponent uses the same game model and consistently tries to obtain its best result</h3>
          <p>
            This is a decision model—not a claim that every human opponent is
            perfectly informed, consistent, or error-free.
          </p>
        </section>
        <div>
          <article><strong>Shared rules</strong><p>Both sides know legal actions, results, terminal tests, and the utility convention.</p></article>
          <article><strong>Optimal opposition</strong><p>Choose the action with the best worst-case backed-up utility.</p></article>
          <article><strong>Safe policy</strong><p>Minimax protects against the strongest modeled reply; it does not predict one particular reply.</p></article>
        </div>
      </div>
    ),
    note: "The large assumption states that the opponent knows the same modeled rules and consistently tries to obtain its best result. This does not claim every human is perfectly rational. It defines the decision standard used to compute a safe move. Minimax asks what remains achievable even if the opponent refuses to cooperate with our lecture example. The first card gives shared rules: both sides agree on actions, transitions, terminal tests, and utility. The second gives optimal opposition: evaluate each candidate by its worst reply. If the model is wrong—perhaps hidden information exists—the guarantee applies to the model, not by magic to reality. The third card calls minimax a safe policy. It protects against the strongest modeled reply but does not predict which reply a particular opponent will choose. If the opponent blunders, the agent observes the new state and may achieve a better outcome. Insurance does not predict a kitchen fire; it limits the damage if one occurs. Minimax can be conservative when opponents are predictably imperfect. That conservatism is appropriate when failure is costly or adversaries adapt. In low-stakes repeated play, an exploitative policy might intentionally choose a move with a worse worst case but better expected payoff against observed behavior. The correct choice depends on objective and risk tolerance, not algorithm fandom. If an opponent has a legal action missing from our generator, minimax may certify a move that fails immediately. Search cannot compensate for an incomplete rules model. Robustness begins with correct actions and results; optimal reasoning over the wrong tree is optimized surprise.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Minimax · From search to decision",
    title: "The six steps of minimax",
    content: (
      <div className="algorithm-map meeting07-minimax-steps">
        <section>
          <article><span>1</span><div><h3>Generate a game tree</h3><p>Start from the current state; expand legal moves to terminal states or a chosen depth limit.</p></div></article>
          <article><span>2</span><div><h3>Decide whether the root is MAX or MIN</h3><p>Fix whose outcome the scores measure. That player’s turn is MAX; the opponent’s turn is MIN.</p></div></article>
          <article><span>3</span><div><h3>Label alternating levels MAX and MIN</h3><p>Alternate the labels at each level because the two players take turns.</p></div></article>
          <article><span>4</span><div><h3>Evaluate every leaf node</h3><p>Use a heuristic at nonterminal cutoff leaves; use exact utility at terminal leaves. Keep one scoring perspective.</p></div></article>
          <article><span>5</span><div><h3>Back up values until the root</h3><p>MAX takes the maximum of its children’s values; MIN takes the minimum. Repeat upward from leaves to parents until the root has a value.</p></div></article>
          <article><span>6</span><div><h3>Choose the next move at the root</h3><p>Choose the action leading to a child whose value equals the root’s backed-up value. If children tie, any tied optimal move qualifies.</p></div></article>
        </section>
        <aside>
          <span>Same example as page 13 · MAX to move</span>
          <svg viewBox="0 0 480 220" role="img" aria-label="MAX root chooses A with value 3. MIN branches A, B, C return 3, 2, 1 from leaf pairs 3 and 5, 2 and 9, 4 and 1.">
            {[80, 240, 400].map((x, i) => <g key={x}>
              <path d={`M240 46 L${x} 95 M${x} 124 L${x - 30} 177 M${x} 124 L${x + 30} 177`} stroke={i === 0 ? "#8be0e7" : "#b5c2d9"} strokeWidth="3" fill="none" />
              <rect x={x - 63} y="88" width="126" height="40" rx="9" fill={i === 0 ? "#cffafe" : "white"} />
              <text x={x} y="114" textAnchor="middle" fill="#111827" fontSize="20" fontWeight="700">{["A", "B", "C"][i]} · MIN = {[3, 2, 1][i]}</text>
              {[[3,5], [2,9], [4,1]][i].map((v, j) => <g key={j}><circle cx={x + (j === 0 ? -30 : 30)} cy="190" r="22" fill="white" /><text x={x + (j === 0 ? -30 : 30)} y="198" textAnchor="middle" fill="#111827" fontSize="25" fontWeight="700">{v}</text></g>)}
            </g>)}
            <rect x="157" y="6" width="166" height="40" rx="9" fill="#cffafe" />
            <text x="240" y="33" textAnchor="middle" fill="#111827" fontSize="23" fontWeight="700">MAX = 3</text>
          </svg>
          <p><strong>Given leaf scores:</strong> A → (3, 5), B → (2, 9), C → (4, 1).</p>
          <p><strong>MIN replies:</strong> A → 3, B → 2, C → 1.</p>
          <p><strong>MAX decision:</strong> max(3, 2, 1) = 3 → choose action A.</p>
          <p>The values measure MAX’s outcome throughout; MIN chooses the reply least favorable to MAX.</p>
        </aside>
      </div>
    ),
    note: "The first card builds legal actions until terminal states or a cutoff depth. The second evaluates leaves: exact utility for terminal leaves, an estimate for nonterminal cutoff leaves. That distinction preserves semantics. A terminal win is a fact; a cutoff score is an informed opinion wearing numerical shoes. The third card performs backup. MAX keeps the largest child value; MIN keeps the smallest, always using MAX's fixed utility scale. The fourth card chooses the root action whose child returns the best backed-up value. Internal values are consequences of descendants, not independent evaluations pasted onto convenient nodes. The side panel separates player-to-move from sign convention. Whose turn it is determines MAX or MIN. Utility meaning stays fixed. Changing the sign perspective at every layer and also taking min is double-counting the opponent, like reversing a map and then driving backward to compensate. If two root actions have equal minimax value, either is optimal under the modeled utility, but their secondary properties may differ. Choose by faster win, slower loss, lower variance, simpler explanation, or a fixed deterministic order. State that rule so identical runs do not appear to change personality on alternate Tuesdays. Minimax does not average child values unless the model contains random chance nodes with known probabilities. MAX selects one child and MIN selects one child because players control actions. Averaging would answer an expectation question about random choice, not the adversarial decision modeled here.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Exact algorithm · Recursive minimax",
    title: "Minimax: actions, states, and recursive values",
    content: (
      <div className="source-definition-layout meeting07-minimax-layout">
        <NativeMinimaxAlgorithm />
        <section>
          <article><span>Read the pair (a, s)</span><p><strong>a = action</strong> (a legal move); <strong>s = successor state</strong> after that move. SUCCESSORS(state) supplies these action–state pairs.</p><p>Example: a = “place X in the center”; s = the board with X in the center.</p></article>
          <article><span>Terminal test</span><p>Return exact Utility(state) when the game is over.</p></article>
          <article><span>MAX-VALUE / MIN-VALUE</span><p>MAX returns the largest MIN-VALUE(s); MIN returns the smallest MAX-VALUE(s) over legal actions.</p></article>
          <article><span>Decision</span><p>Return arg max over root actions—the action, not merely the value.</p></article>
          <SearchCallout label="Execution correction" tone="amber">
            Standard minimax computes recursively depth-first to terminal or cutoff states. It is not breadth-first search with a bound.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Enlarge the exact minimax pseudocode. Minimax-Decision compares actions at the root. Max-Value returns terminal utility or the maximum result of recursive Min-Value calls. Min-Value mirrors it with a minimum over Max-Value. The code is short because recursion reuses the same logic at every alternating layer. Close the image and focus on the first three definition cards. The terminal test stops descent and returns exact utility. Otherwise MAX loops over legal actions and asks MIN for each successor's value; MIN loops and asks MAX. Each call trusts the next layer to summarize everything below it. The decision card is subtle. Recursive value functions return numbers, but Minimax-Decision returns the root action associated with the largest value. Saying the algorithm returns three confuses evaluation with behavior. It chooses action A; three is the backed-up reason. For branching factor b and depth m, full minimax examines on the order of b to the m nodes and stores a depth-first path on the order of b times m in a straightforward implementation. Exponential time is why cutoff evaluation and alpha-beta pruning matter. The pseudocode is short; its family tree is not. Every recursive algorithm needs a base case. Here the terminal or cutoff condition prevents infinite descent and supplies the numbers that recursion can combine. Without a meaningful base value, alternating MAX and MIN is a beautifully organized meeting with no agenda and no decisions.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Demo · Recursive call stack",
    title: "Trace minimax on this example tree",
    content: <RecursiveMinimaxTrace />,
    note: "The trace begins at Minimax-Decision and Max-Value for the root. No result exists yet. MAX will compare A, B, and C, but recursive depth-first execution resolves one action before opening the next sibling. The call stack behaves like a very disciplined librarian: finish this book before pulling the next one. Advance to action A. MIN sees leaf values three and five, chooses three, and returns it to MAX. The physical game has not executed A and then walked backward. Only a computational call has returned a number. Search explores hypothetical states; the board remains where it was. Advance to B. MIN chooses two instead of nine, so B returns two. The attractive nine never reaches the root because MIN controls that reply. This is the minimizing half of minimax: the opponent selects the branch least favorable to MAX. Advance again to C. MIN chooses one instead of four, so C returns one. MAX now has three completed sibling values: A returns three, B returns two, and C returns one. Each number summarizes the strongest reply available to MIN under that root action. Advance to the final step. MAX compares A three, B two, and C one, so it chooses A with backed-up value three. The root returns an action after all sibling values are known. Reset the trace so students can replay the control flow from a clean state. At every trace step, three invariants should hold: utility perspective remains MAX's, node operator matches the player to move, and a returned value summarizes a fully resolved searched subtree. If any invariant fails, stop before continuing arithmetic. Debugging one layer early is cheaper than beautifully backing up the wrong tree. Replay the trace mentally in reverse: final action A depends on values three, two, and one; each depends on a MIN comparison; each leaf provides the base value. Reverse explanation checks whether students understand dependency rather than merely remembering the order in which buttons were clicked.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Fixed three-ply minimax · Read the leaves first",
    title: "A cutoff leaf is where the search horizon ends—not necessarily where the game ends",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Fixed three-ply minimax tree with leaf and backed-up values"
          caption="First ignore the internal labels and read the bottom row: 2, 3, 5, 9, 0, 7, 4, 2, 1, 5, 6."
          file="fixed-three-ply-minimax-tree.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <span>Three-ply look-ahead</span>
          <h3>Terminal utility versus cutoff evaluation</h3>
          <p>
            A <strong>ply</strong> is one player’s move. At depth three, the
            search stops after three moves from the current state.
          </p>
          <ul>
            <li>If a leaf is terminal, use its exact utility.</li>
            <li>If the depth limit creates a nonterminal leaf, use an evaluation function.</li>
            <li>Do not independently evaluate internal nodes; their values are backed up.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Enlarge the fixed three-ply tree and read the bottom values before trusting internal labels. A ply is one player's move, so three-ply search looks ahead three alternating actions. The eleven leaves mark the search horizon; some could be terminal facts, while nonterminal cutoff leaves require an evaluation estimate. Close the image. The first bullet says a terminal leaf gets exact utility. The second says a depth-limited nonterminal leaf gets an evaluation function. Both appear at leaves of the search tree, but only one represents the actual end of the game. Leaf means no deeper search in this computation, not necessarily game over. The final bullet says internal nodes receive backed-up values. Evaluating each internal node with a separate horizon would mix apples, oranges, and a suspicious pineapple. Minimax compares branches only when their values share the same terminal or cutoff semantics. A cutoff can hide a decisive event just beyond the search depth. An evaluator may prefer a move at depth three that loses at depth four. This horizon effect motivates deeper search, quiescence search for tactically unstable positions, and evaluators that recognize immediate threats. A cutoff is a computational horizon, not a wall the opponent promises to respect. A ply is one move by one player. A full round in a two-player alternating game contains two plies. Confusing the terms doubles the intended horizon and can multiply work by another factor of the branching rate. In exponential search, vocabulary can have a surprisingly large electricity bill.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Fixed three-ply minimax · MIN backup",
    title: "Each MIN node keeps the reply least favorable to MAX",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Three-ply minimax tree used to back up MIN values"
          caption="Back up the lower MIN layer after each intervening MAX node has a value."
          file="fixed-three-ply-minimax-tree.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <span>Work from the bottom</span>
          <h3>Compute one completed layer at a time</h3>
          <p>
            First the lower MAX nodes become <strong>3, 9, 0, 7, 2, 6</strong>.
            Then their MIN parents become:
          </p>
          <ul>
            <li>Left: min(3, 9) = <strong>3</strong></li>
            <li>Middle: min(0, 7) = <strong>0</strong></li>
            <li>Right: min(2, 6) = <strong>2</strong></li>
          </ul>
          <SearchCallout label="Interpretation" tone="cyan">
            MIN is choosing its strongest reply, expressed as the smallest utility for MAX.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Enlarge the same tree and work from the bottom. Lower MAX nodes become three, nine, zero, seven, two, and six after selecting their largest leaves. Only then can each MIN parent compare completed child values. Backup is layered arithmetic with turn labels, not a scavenger hunt for the largest number anywhere. Close the image. The list computes left as minimum of three and nine, giving three; middle as minimum of zero and seven, giving zero; right as minimum of two and six, giving two. Say MIN before each calculation. That verbal label prevents arithmetic from floating free of control. MIN is not choosing a foolish move for itself. It chooses its strongest reply, expressed as the smallest utility for MAX under a shared zero-sum scale. From MIN's perspective, shrinking MAX's outcome is precisely rational. The label least favorable to MAX is clearer than saying worst move without naming for whom. Minimax backup composes small solved subproblems. Once a child subtree value is known, the parent needs only max or min over those summaries. Transposition tables exploit this by storing repeated state values. The challenge is preserving depth, bound type, and evaluation conditions so yesterday's summary still answers today's question. When solving a tree by hand, mark each internal layer MAX or MIN before touching arithmetic. Then circle groups of siblings and write the operator beside each parent. This simple annotation separates structural errors from calculation errors and makes partial credit less dependent on telepathy.",
    sourceSlides: [10, 11],
  },
  {
    eyebrow: "Fixed three-ply minimax · Root decision",
    title: "MAX selects the action whose worst reply is best",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Completed fixed three-ply minimax tree with root value three"
          caption="The root compares the three MIN values 3, 0, and 2."
          file="fixed-three-ply-minimax-tree.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <span>Final backup</span>
          <h3>max(3, 0, 2) = 3</h3>
          <p>
            The left action is selected. MAX does not chase the largest visible
            leaf, 9, because MIN controls which reply follows that action.
          </p>
          <SearchCallout label="Say the guarantee precisely" tone="green">
            Under the modeled rules, fixed utility perspective, complete
            three-ply search, and optimal opposition, this move guarantees a
            backed-up cutoff value of at least 3.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Enlarge the completed tree. The root receives three branch summaries: three, zero, and two. Each already represents the reply MIN would choose. MAX therefore computes maximum of three, zero, and two, selecting the left action with value three. Close the image. The visible nine lives below a MIN choice. MIN can select sibling value three instead, so MAX cannot guarantee nine. A large descendant matters only if every controlling choice on the path allows it. Minimax values permissions, not wishful sightseeing. The callout supplies the careful claim. Under the modeled rules, fixed utility perspective, complete three-ply search, evaluation semantics, and optimal opposition, the selected move guarantees a backed-up cutoff value of at least three. Change the depth or evaluator and the recommendation may change. Guarantees have assumptions, not capes. At a MAX root, minimax value three means MAX can force at least three under the modeled search and evaluation, regardless of MIN's reply. MIN might choose poorly and allow more. This lower-bound interpretation explains both safety and opportunity: the policy protects three without forbidding the agent from accepting a gift. The selected root action plus the best replies along its backed-up path form a principal variation—the line currently considered best under the search. It is useful for explanation, but it is not the whole strategy. If the opponent deviates, the agent follows a different stored or recomputed response.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Tic-tac-toe · Evaluation function",
    title: "Count open winning lines for X and subtract those for O",
    content: (
      <div className="source-definition-layout">
        <SearchSourceImage
          alt="Tic-tac-toe boards illustrating a possible-winning-lines evaluation"
          caption="Three exact examples define the cutoff evaluation E(n) = M(n) − O(n)."
          file="tic-tac-toe-evaluation-function.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <article><span>M(n)</span><p>Total winning lines still possible for <strong>my player, X</strong>.</p></article>
          <article><span>O(n)</span><p>Total winning lines still possible for the <strong>opponent, O</strong>.</p></article>
          <article><span>E(n)</span><p><strong>E(n) = M(n) − O(n)</strong>; larger values favor X under this convention.</p></article>
          <SearchCallout label="Scope" tone="amber">
            Use this feature score at nonterminal cutoff states. A completed win, loss, or draw should use exact terminal utility.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Enlarge the tic-tac-toe evaluation figure. M of n counts winning lines still open for X; O of n counts lines still open for O. The estimate E of n equals M minus O. The three source examples are one, negative two, and one, showing that different boards can compress to the same score. Close the image. The first card defines M, the second O, and the third their difference. Larger values favor X because utility is written from X's perspective. The minus sign does not alternate with turns. MIN later chooses the smaller X-perspective value. The callout limits this score to nonterminal cutoff states. A completed win or loss receives exact terminal utility even if line counting produces an ordinary finite number. The evaluator also ignores forks, move order, and tactical immediacy. Compression makes search affordable by forgetting details; testing discovers whether it forgot the plot. A stronger tic-tac-toe evaluator could count immediate wins, blocks, forks, center control, or weighted open lines. More features are not automatically better; correlated counts can double-count evidence, and tactical rules can dominate strategic structure. Compare evaluator choices against deeper exact search on held-out positions. Line-count features can be compared with exact solved positions. Measure how often score order agrees with true minimax order, especially near tactical threats. Calibration turns a plausible formula into empirical evidence. Without testing, an evaluation function is a confident opinion with excellent formatting.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Practice · Score a cutoff state",
    title: "The arithmetic is simple; the representation does the work",
    content: <TicTacToeScoringPractice />,
    note: "Choose State A and reveal. M is six, O is five, so E equals one. The result favors X by one open line under this feature. The calculation is easy; deciding what counts as still open requires the board representation and game rules. Choose State B and reveal. Four minus six equals negative two, so the position favors O on the fixed X-perspective scale. Negative does not mean illegal or impossible; it means the selected feature sees more opportunity for the opponent. Choose State C and reveal. Five minus four returns one, tying State A. The boards are not identical; the heuristic has compressed them to the same scalar. A tie-breaking rule or richer features may be needed. Equal thermometer readings do not prove two patients have the same illness. States A and C both score one, but their tactical futures may differ. A tie can be harmless if deeper minimax separates them, or dangerous if the cutoff forces an arbitrary choice. Record tie frequency and inspect tied positions. When a heuristic frequently shrugs at important distinctions, it is asking for better features, not louder arithmetic. The subtraction on this slide takes milliseconds; producing correct M and O counts requires recognizing blocked lines, player identity, and board geometry. In AI, the final formula is often the smallest part. Representation quietly does the difficult work and then lets arithmetic take the applause.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Two-ply tic-tac-toe · Opening move",
    title: "The opponent's best reply determines each opening's value",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Two-ply minimax tree for the opening move of tic-tac-toe"
          caption="MAX chooses among opening branches after MIN backs up values −1, −2, and 1."
          file="tic-tac-toe-two-ply-opening.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <span>From Nilsson, 1971</span>
          <h3>Read the tree in three passes</h3>
          <ol>
            <li>Identify MAX’s three symmetry-distinct opening choices.</li>
            <li>For each opening, let MIN choose its smallest evaluated reply.</li>
            <li>At the root, let MAX choose the largest backed-up branch value.</li>
          </ol>
          <p>Predict the root value and chosen branch before advancing.</p>
        </section>
      </div>
    ),
    note: "Enlarge the two-ply opening tree. MAX has three symmetry-distinct openings. Under each opening, MIN examines replies and backs up the smallest evaluation. The resulting branch summaries are negative one, negative two, and one. Those summaries—not the largest raw leaves—are what the root may compare. Close the image. First identify MAX's opening choices. Second compute the minimum reply under each. Third select the maximum of those branch values at the root. This three-pass discipline separates tree structure from arithmetic and prevents the eye from teleporting directly to a favorite leaf. The branch values are negative one, negative two, and one. Pause before the next page and predict the root move. If MAX controls the root and utility favors MAX, the answer should be the branch with value one. Commitment before feedback makes a misconception visible instead of letting it escape wearing hindsight glasses. The opening tree groups rotationally equivalent moves, while later search may encounter the same board through different move orders. Symmetry reduction and transposition tables both avoid duplicated reasoning, but their equivalence tests differ. Canonicalization must preserve player to move and value semantics, not merely make boards look alike. The opening tree sees only one reply after MAX's move. A branch valued at one may conceal a tactical problem at ply three. Depth-limited conclusions are conditional on the horizon and evaluator. Deeper search can reverse preferences, which is why iterative deepening watches for unstable decisions.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Predict and reveal · Opening backup",
    title: "What value reaches the root?",
    content: (
      <SearchQuickCheck
        question="MAX receives branch values −1, −2, and 1. Which value and move does minimax select?"
        options={[
          "−2, because MIN chooses at the root",
          "−1, because it is the first branch",
          "1, because MAX chooses the largest backed-up value",
          "2, because the best visible leaf has value 2",
        ]}
        correct={2}
        explanation="The player to move at the root is MAX. The three branch values already summarize each MIN reply, so MAX returns max(−1, −2, 1)=1 and selects the rightmost opening branch."
      />
    ),
    note: "Choose the first answer deliberately: negative two because MIN chooses at the root. The feedback rejects it. MIN produced each branch value, but MAX controls the root choice. Confusing who summarized a branch with who selects among branches is a common two-level error. Now choose the third answer. MAX receives negative one, negative two, and one, then selects the largest: one. The rightmost opening is chosen. Notice that the root does not rerun MIN arithmetic; it trusts the already backed-up child values. When checking a minimax result, ask four questions: whose turn is the root, whose perspective defines utility, have child values already been backed up, and does the chosen action match the correct max or min operator? This audit is faster than staring harder at the tree and hoping guilt produces insight. Selecting the MIN-at-root option reveals a structural misconception, not a subtraction mistake. Good formative assessment targets the decision rule students are likely to misapply. The correction should name the root player, explain that branch values are already minimized, and then perform the final max. Feedback that says only incorrect wastes a perfectly useful error. Once MIN has summarized a branch as one number, the root does not need every leaf to perform its max comparison. The branch value acts like an interface: complex internal reasoning becomes a compact promise about the outcome MIN can force. Good abstractions hide detail without changing meaning.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Next turn · Re-root and reuse",
    title: "After the opponent moves, advance the root to the observed state",
    content: (
      <div className="tree-layout meeting07-reroot-layout">
        <SearchSourceImage
          alt="Expanded tic-tac-toe tree for MAX's second move"
          caption="The next decision begins from the board actually produced by the opponent's reply."
          file="tic-tac-toe-second-turn-tree.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <span>Search engineering</span>
          <h3>Do not discard valid work automatically</h3>
          <p>
            Observe the opponent’s move, locate the matching child, and make
            that state the new root. Continue minimax from the new player-to-move label.
          </p>
          <ul>
            <li>Reuse a matching subtree when rules, state, and depth semantics still match.</li>
            <li>Reuse transposition-table entries when their bounds and depths remain valid.</li>
            <li>Rebuild only parts invalidated by the new state or search budget.</li>
          </ul>
        </section>
      </div>
    ),
    note: "Enlarge the second-turn tree. The opponent's actual reply selects one child of the previous search tree. That observed position becomes the new root, with the player-to-move label advanced. Search continues from reality, not from branches that did not occur. Close the image. The first bullet permits reusing a matching subtree when state, rules, and depth semantics still match. The second permits transposition-table entries whose stored depth and bounds remain valid. Reuse saves computation, but stale information can be worse than no information because it arrives wearing a name badge. The final bullet says rebuild the parts invalidated by the new state or search budget. A fresh root may change remaining depth, timing, or legal actions. The principle is neither discard everything nor trust everything. Verify provenance, then reuse. This is memoization with adult supervision. When the root advances one ply, a subtree previously searched to depth four may now extend only three plies beyond the new root, depending on how depth was stored. Iterative deepening and transposition tables track depth precisely. Reuse is not copying a folder; it is preserving a claim with its scope attached. A transposition occurs when different action sequences reach the same complete game state. A subtree reuse follows the actual previous branch; a transposition table may reuse work reached by another order. Both require state equivalence, but transpositions make good hashing and canonical representation especially important.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Late game · Immediate threats",
    title: "Terminal losses override attractive cutoff features",
    content: (
      <div className="tree-layout">
        <SearchSourceImage
          alt="Late-game two-ply tic-tac-toe minimax tree with immediate losing branches"
          caption="Exact terminal outcomes (shown as ±∞) and finite heuristic values coexist in the late-game tree."
          file="tic-tac-toe-late-game-minimax.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <span>Threat analysis</span>
          <h3>Check terminal tactics before trusting a feature score</h3>
          <ul>
            <li>A terminal loss receives exact losing utility, not a finite line-count estimate.</li>
            <li>MIN will choose an available reply that forces the worst value for MAX.</li>
            <li>A move is safe only if every modeled opponent reply preserves the claimed lower bound.</li>
          </ul>
          <SearchCallout label="Pair task" tone="cyan">
            Find one branch that permits an immediate loss and one branch whose worst reply remains finite.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Enlarge the late-game tree and locate the branches with exact losing outcomes. A terminal loss is not merely a very unattractive estimate. It is a resolved fact and receives exact losing utility, shown with an infinite-style value to dominate finite cutoff scores. Close the image. The first bullet says terminal losses use exact utility. The second reminds us that MIN will choose any available reply forcing the worst value for MAX. A feature score cannot vote to overrule checkmate, three-in-a-row, or another completed loss. The third bullet gives the robust condition: a move is safe only if every modeled opponent reply preserves the claimed lower bound. One attractive continuation is insufficient. Choosing a branch because one child looks wonderful is like declaring a bridge safe because one plank is excellent. Implementations often use large finite constants instead of infinity. Those constants must exceed any possible nonterminal evaluation magnitude, and faster wins or slower losses may add depth adjustments. Otherwise an enthusiastic heuristic can numerically outrank an actual victory, which is an impressive way to lose while winning the spreadsheet. When a cutoff lands in the middle of a forcing tactic, programs may extend search until the position becomes quieter. In chess this is quiescence search; in tic-tac-toe it could mean resolving immediate wins and blocks. Selective extension spends depth where the evaluator is least trustworthy.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Misconception clinic · Claims and guarantees",
    title: "Minimax is safe under assumptions—not magic",
    content: <MisconceptionStudio />,
    note: "Choose Best-first. The claim says ordinary best-first should work because it follows the best-looking state. The revision explains the missing alternation: ordinary best-first assumes one search agent controls the path, whereas minimax backs up decisions made by MAX and MIN. A priority queue does not automatically grow an opponent model. Choose Opponent mistake. A blunder does not invalidate minimax. Observe the resulting state, re-root or re-search, and exploit the improved opportunity. Minimax guarantees protection against strong opposition; it does not require the opponent to remain strong for the agent to function. Choose Guaranteed win. Minimax guarantees the best worst-case outcome under its assumptions, not victory from every position. A losing position remains losing against perfect play; a drawable position may guarantee only a draw. The algorithm is a careful strategist, not a coupon code for victory. A defensible minimax claim names the game model, utility perspective, search depth or completeness, evaluation function, opponent assumption, and result type. Remove any one and guarantees can inflate. Saying minimax guarantees a win is almost always missing the starting position; saying it guarantees the best worst-case modeled outcome is precise. If minimax planned for the strongest reply, a weaker reply cannot make the guaranteed value worse in the same deterministic model. It may open better opportunities. The agent still recalculates because the new root differs, but the opponent's mistake is a gift, not a software exception.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Question clinic · Explain the mechanism",
    title: "Six questions that reveal whether minimax is understood",
    content: <SourceQuestionClinic />,
    note: "Choose Q1. Root type follows the player to move, while utility perspective remains fixed. If MAX moves, the root maximizes; if MIN moves, the root minimizes. Name both facts before backing up a single number. Now choose Q2. MAX and MIN alternate because legal control alternates. The numeric perspective does not flip with the operator. This distinction establishes the skeleton of every correct minimax trace. Choose Q3. MIN chooses its own best move, which minimizes MAX utility. Calling it the worst move without naming the perspective is misleading: it is worst for MAX and best for MIN. Choose Q4. Terminal leaves use exact utility, cutoff leaves use evaluation, and internal nodes use backed-up child values. The search horizon determines the source of a leaf value. Choose Q5. No player chooses at a leaf. Instead, the terminal rule or cutoff rule returns a number to the waiting recursive call. Game control and recursive computation are different layers. Finally choose Q6. After an opponent move, advance the root to the observed child and reuse only subtrees or transpositions that remain valid. Re-rooting separates the plan we imagined from the move that actually occurred. The six-question clinic is not trivia. Each answer forces a causal explanation: who acts, why operators alternate, where values originate, and when work can be reused. If an explanation relies on memorized arrows without a fixed utility perspective, construct a two-level counterexample and make the speaker predict the root value. Ask a student to explain why MIN selects the smallest MAX-perspective value without using the words because that is the rule. A good answer mentions opposed utilities and control of the action. Requiring mechanism instead of recitation distinguishes a mental model from a memorized traffic signal.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Cumulative assessment · Prepare for pruning",
    title: "Formulate, back up, evaluate, and defend",
    content: (
      <div className="search-exit">
        <article>
          <span>1 · Formulate</span>
          <h3>Model the game</h3>
          <p>Define state, player, actions, result, terminal test, utility, and the assumptions needed for a zero-sum minimax model.</p>
        </article>
        <article>
          <span>2 · Trace</span>
          <h3>Compute the decision</h3>
          <p>Label MAX/MIN levels, distinguish terminal from cutoff leaves, back up every value, and circle the selected root action.</p>
        </article>
        <article>
          <span>3 · Critique</span>
          <h3>Test the evaluator</h3>
          <p>Explain one feature, one failure case, and one experiment that compares its move choice with deeper search.</p>
        </article>
        <aside>
          <strong>Next: same minimax result, fewer evaluated branches</strong>
          <p>
            Alpha–beta pruning will maintain path bounds that prove when a
            remaining subtree cannot change the root decision. Read George F.
            Luger, <em>Artificial Intelligence</em>, 6th ed., Chapter 4, and
            Stuart Russell and Peter Norvig, <em>Artificial Intelligence: A
            Modern Approach</em>, 3rd ed., Chapter 5.
          </p>
        </aside>
      </div>
    ),
    note: "The first exit card asks you to formulate the game: state, player, actions, result, terminal test, utility, and assumptions. If one component is missing, minimax may still produce numbers, but the numbers answer a different question. Formulation is where correctness begins, long before recursion begins looking clever. The second card asks for a complete backup with MAX and MIN labels, terminal and cutoff semantics, and a circled root action. The third asks you to critique an evaluator by naming a feature, a failure case, and an experiment. Calculation shows what the algorithm did; critique asks whether it was worth doing. The final panel previews Lesson 8. Alpha-beta pruning returns the same depth-limited minimax decision while proving that some branches cannot affect the result. It changes efficiency, not the decision rule. Today's exit sentence is: MAX chooses the best outcome that MIN cannot prevent, under explicit assumptions and a fixed utility perspective. Alpha-beta will maintain lower and upper path bounds. When those bounds prove a remaining branch cannot improve the current decision, the branch is skipped without changing the minimax result. Move ordering changes how much is pruned, not correctness. The conceptual prerequisite is today's exact backup rule; pruning is a proof layered on top. Minimax chooses the action with the greatest value that an optimal opponent cannot push lower, using terminal utilities or cutoff estimates backed through alternating control. If that sentence feels dense, draw a two-level tree and attach each phrase to a layer. Compression should follow understanding, not replace it.",
    sourceSlides: [16],
  },
];

export function Meeting07Deck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return (
    <SourceDeckShell
      forcePrintAll={forcePrintAll}
      hoverEffects
      meetingLabel="Module 5 · Lesson 7"
      meetingTitle="Game Trees, Minimax, and Evaluation Functions"
      notesMode="key-points"
      slides={slides}
      sourceCollectionLabel="L05_MiniMax&Pruning.pptx"
      sourceCollectionPath="l05-minimax-pruning"
    />
  );
}
