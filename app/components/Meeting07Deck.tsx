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
    <div className="frontier-trace">
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
        <article>
          <span>Execution discipline</span>
          <strong>Depth-first recursion</strong>
          <small>Minimax is not breadth-first search with a bound. A depth limit controls how far a call descends.</small>
        </article>
      </div>
    </div>
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
    eyebrow: "Week 4 · Meeting 7 · Adversarial search",
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
    note: "Timing: 2 minutes. Ask students why choosing the visually best successor is insufficient when an opponent controls the next action. Preview the distinction between a path and a strategy.",
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
    note: "Timing: 2 minutes. Preserve all three source reasons: a good reasoning problem, formal and nontrivial, and directly comparable with humans or programs. Add the note-derived multi-agent connection.",
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
    note: "Timing: 2 minutes. Start with the source list—sequence, possible moves, reward, maximize—then refine reward into terminal utility plus cutoff evaluation. Ask students to name these elements in tic-tac-toe.",
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
    note: "Timing: 2 minutes. Preserve both source contrasts: unpredictable opponent implies a move for every reply; time limits make a full goal search unlikely and force approximation. Ask whether a game solution is a path or policy.",
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
    note: "Timing: 2 minutes. Walk the exact two-player flow: opponent move, new position, successors, game-over test, evaluation, highest-valued move, and repeat. Ask where a terminal utility enters.",
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
    note: "Timing: 2 minutes. Read the source definition, then separate game theory's broad scope from the narrower two-player minimax model used today.",
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
    note: "Timing: 2 minutes. Preserve zero-sum, non-zero-sum, prisoner's dilemma, and the listed type pairs. Ask students whether zero-sum implies alternating moves; it does not.",
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
    note: "Timing: 3 minutes. Use the exact chess figure. Let pairs generate one tempting move and one reply. Correct the phrase maximize/minimize advantage into one consistent utility perspective.",
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
    note: "Timing: 3 minutes. Have students formulate tic-tac-toe aloud. State the zero-sum, two-player, deterministic, alternating, perfect-information assumptions before minimax is introduced.",
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
    note: "Timing: 2 minutes. Preserve the source assumption of shared state-space knowledge and consistent effort to win. Correct the informal advantage wording with the best-worst-case definition.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Minimax · Backup rules",
    title: "MAX takes the largest child value; MIN takes the smallest",
    content: (
      <div className="algorithm-map">
        <section>
          <article><span>1</span><h3>Build</h3><p>Generate legal actions to terminal states or a chosen cutoff depth.</p></article>
          <article><span>2</span><h3>Evaluate leaves</h3><p>Return exact utility at terminal leaves and an evaluation estimate at nonterminal cutoff leaves.</p></article>
          <article><span>3</span><h3>Back up</h3><p>At MAX take max(children); at MIN take min(children).</p></article>
          <article><span>4</span><h3>Choose</h3><p>At the root, select the action whose child returns the best backed-up value.</p></article>
        </section>
        <aside>
          <span>Keep the perspective fixed</span>
          <p>The player to move determines MAX or MIN.</p>
          <p>The utility sign convention does not change between levels.</p>
          <p>Alternation models who controls the next action.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Trace the four source rules. Explicitly correct the claim that root type is selected by whether the heuristic looks like a reward or cost.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Exact algorithm · Recursive minimax",
    title: "The recursion alternates value functions until a leaf returns",
    content: (
      <div className="source-definition-layout">
        <SearchSourceImage
          alt="Recursive Minimax-Decision, Max-Value, and Min-Value pseudocode"
          caption="The complete recursive minimax procedure adapted from Russell and Norvig."
          file="minimax-pseudocode.png"
          sourceRoot={SOURCE_ROOT}
        />
        <section>
          <article><span>Terminal test</span><p>Return exact Utility(state) when the game is over.</p></article>
          <article><span>MAX-VALUE</span><p>Return the largest value produced by MIN-VALUE over legal actions.</p></article>
          <article><span>MIN-VALUE</span><p>Return the smallest value produced by MAX-VALUE over legal actions.</p></article>
          <article><span>Decision</span><p>Return arg max over root actions—the action, not merely the value.</p></article>
          <SearchCallout label="Execution correction" tone="amber">
            Standard minimax computes recursively depth-first to terminal or cutoff states. It is not breadth-first search with a bound.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Enlarge the exact pseudocode. Follow one line through Minimax-Decision, Max-Value, and Min-Value. Separate the returned root action from the backed-up numeric value.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Demo · Recursive call stack",
    title: "One action is resolved before the next sibling is searched",
    content: <RecursiveMinimaxTrace />,
    note: "Timing: 4 minutes. Students predict each return before advancing. Emphasize depth-first recursive control, alternate MAX/MIN calls, and the difference between computational return and physically undoing a move.",
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
    note: "Timing: 3 minutes. Ask students to cover the internal labels and identify the eleven leaf values. Define ply. Correct the broad rule 'apply a heuristic to every leaf' by separating terminal utility from cutoff evaluation.",
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
    note: "Timing: 3 minutes. Require students to say which player controls each layer before doing arithmetic. Values back up only after a child's descendants have been resolved.",
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
    note: "Timing: 3 minutes. Ask for the chosen action before showing the max equation. Contrast max leaf 9 with backed-up action value 3.",
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
    note: "Timing: 4 minutes. Enlarge the exact figure and count one board together. Preserve all three source examples: 6−5=1, 4−6=−2, and 5−4=1.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Practice · Score a cutoff state",
    title: "The arithmetic is simple; the representation does the work",
    content: <TicTacToeScoringPractice />,
    note: "Timing: 3 minutes. Students compute all three source cases, then explain what the heuristic discards. Stress that equal scores can hide tactically different positions.",
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
    note: "Timing: 4 minutes. Enlarge the exact opening tree. Have groups compute one MIN branch each and report −1, −2, or 1 without yet announcing the root decision.",
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
    note: "Timing: 3 minutes. Require every student to commit before revealing. Diagnose root-player confusion and the error of selecting a raw leaf instead of a backed-up branch.",
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
    note: "Timing: 4 minutes. Enlarge the exact next-turn tree. Correct the note-derived claim that a completely new graph must always be created after every opponent move.",
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
    note: "Timing: 4 minutes. Use the exact late-game tree to locate −∞ outcomes. Ask why a heuristic cannot replace a terminal test and what minimax can guarantee from this particular state.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Misconception clinic · Claims and guarantees",
    title: "Minimax is safe under assumptions—not magic",
    content: <MisconceptionStudio />,
    note: "Timing: 3 minutes. Work through all three source questions: best-first search, opponent mistakes, and win guarantees. Require a corrected claim plus the assumptions that make it defensible.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Question clinic · Explain the mechanism",
    title: "Six questions that reveal whether minimax is understood",
    content: <SourceQuestionClinic />,
    note: "Timing: 4 minutes. Assign each group one of the six source questions, then rotate. Answers must identify player to move, fixed utility perspective, terminal/cutoff semantics, or subtree reuse as appropriate.",
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
    note: "Timing: 4 minutes. Collect one complete response or assign it for submission. Preview alpha-beta as an efficiency improvement that must return the same depth-limited minimax value.",
    sourceSlides: [16],
  },
];

export function Meeting07Deck() {
  return (
    <SourceDeckShell
      hoverEffects
      meetingLabel="Week 4 · Meeting 7"
      meetingTitle="Game Trees, Minimax, and Evaluation Functions"
      slides={slides}
      sourceCollectionLabel="L05_MiniMax&Pruning.pptx"
      sourceCollectionPath="l05-minimax-pruning"
    />
  );
}
