export type KnowledgePoint = {
  concept: string;
  explanation: string;
  example: string;
  demo: string;
  practice: string;
  check: string;
};

export type MeetingPlan = {
  id: number;
  week: number;
  module: string;
  title: string;
  question: string;
  knowledgePoints: KnowledgePoint[];
  readings: string[];
  preparation: string;
  sourceTrace: string[];
  deck: "custom" | "planned";
};

const kp = (
  concept: string,
  explanation: string,
  example: string,
  demo: string,
  practice: string,
  check: string,
): KnowledgePoint => ({ concept, explanation, example, demo, practice, check });

export const meetings: MeetingPlan[] = [
  {
    id: 1, week: 1, module: "AI Foundations", deck: "custom",
    title: "AI Applications, History, Intelligence, and Definitions",
    question: "What does it mean to call a system intelligent?",
    knowledgePoints: [
      kp("State-of-the-art AI applications", "AI systems coordinate perception, representation, reasoning, learning, language, and action rather than relying on one magic algorithm.", "Decompose an autonomous taxi into sensing, prediction, route planning, control, and risk monitoring.", "Compare AlphaGo, a language model, and a robot by capability and evidence.", "Classify four familiar products as automation, AI-enabled, or indeterminate and defend the criterion.", "Can broad task coverage alone justify a claim of general intelligence?"),
      kp("History and cycles of progress", "AI developed through symbolic reasoning, expert systems, statistical learning, deep learning, and foundation models, with repeated gaps between demonstrations and deployment.", "Connect Turing, Dartmouth, MYCIN, Deep Blue, AlexNet, AlphaGo, and generative AI to the methods each made visible.", "Animate a milestone timeline and inspect what changed: representation, data, compute, or evaluation.", "Choose one milestone and name both its demonstrated capability and its unresolved limitation.", "Why does an impressive benchmark not guarantee reliable real-world performance?"),
      kp("Intelligence and definitions of AI", "Definitions emphasize thinking or acting, human likeness or rationality; each choice changes the evidence used to judge success.", "Contrast the four classic approaches and theories of human intelligence.", "Run a miniature imitation-game transcript and reveal why language alone is incomplete evidence.", "Match scenarios to thinking humanly, acting humanly, thinking rationally, or acting rationally.", "Which definition best supports engineering evaluation, and what does it omit?"),
    ],
    readings: ["Luger, 6e, Chapter 1", "Russell and Norvig, 3e, Chapters 1–2"],
    preparation: "Bring one current AI application and one claim about what makes it intelligent.",
    sourceTrace: ["L01_AI.pptx slides 1–10; complete source map shared with Meeting 2", "Revised Week 1 schedule"],
  },
  {
    id: 2, week: 1, module: "AI Foundations", deck: "custom",
    title: "Agents, Task Environments, Agent Types, and the Turing Test",
    question: "How does an intelligent agent choose an action in a particular world?",
    knowledgePoints: [
      kp("Agents and rational action", "An agent maps percept histories to actions; rationality means choosing an action expected to maximize the specified performance measure given available evidence.", "Compare a thermostat, robot vacuum, autonomous taxi, and medical decision-support agent.", "Step through a sensor–agent–actuator loop while changing the performance measure.", "Write an agent function for a two-location vacuum world.", "Does rational mean successful, omniscient, or morally good?"),
      kp("Task environments and PEAS", "A task environment names the performance measure, environment, actuators, and sensors that make an agent design meaningful.", "Build PEAS descriptions for a chess program, soccer robot, and spam filter.", "Classify an autonomous taxi across observability, determinism, dependence, change, values, and number of agents.", "In teams, create and critique a PEAS specification for a campus delivery robot.", "Which missing PEAS element makes a design claim impossible to evaluate?"),
      kp("Agent architectures and tests of intelligence", "Simple reflex, model-based, goal-based, utility-based, and learning agents add internal structure to handle increasingly difficult environments.", "Select an architecture for vacuum cleaning, navigation, and medical triage.", "Compare architecture behavior under a hidden-state change; then conduct a miniature Turing Test.", "Match task-environment properties to an appropriate agent architecture and justify the tradeoff.", "Passing a Turing Test supports which claim—and which claims remain unsupported?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapters 1–2", "Luger, 6e, Chapter 1"],
    preparation: "Review the four definitions of AI and bring a task that could be performed by an agent.",
    sourceTrace: ["L01_AI.pptx slides 11–32; complete source map shared with Meeting 1", "Revised Week 1 schedule"],
  },
  {
    id: 3, week: 2, module: "State-Space Search", deck: "custom",
    title: "Problem Formulation and Breadth-First Search",
    question: "How does a real problem become a searchable state space?",
    knowledgePoints: [
      kp("Problem formulation", "A search problem specifies states, an initial state, actions, a transition model, a goal test, and path cost; representation determines what can be found efficiently.", "Formulate the 8-puzzle and route finding as search problems.", "Manipulate an interactive 8-puzzle and expose the generated graph.", "Formulate a campus-navigation problem and identify irrelevant state details.", "Which formulation choice changes the solution without changing the algorithm?"),
      kp("Graphs, trees, frontier, and explored set", "The search tree records paths generated by an algorithm; the state graph records the underlying problem and may contain repeated states and cycles.", "Trace the Königsberg graph and a small cyclic search space.", "Reveal frontier and explored-set contents one expansion at a time.", "Mark duplicate states and decide when graph search avoids repeated work.", "Why can tree search loop even when the state space is finite?"),
      kp("Breadth-first search", "BFS expands the shallowest unexpanded node first; with unit step costs it is complete and optimal, but its memory grows exponentially.", "Find the shortest number-of-moves path in a small maze.", "Queue animation showing enqueue, dequeue, expansion, and parent pointers.", "Perform three BFS iterations and reconstruct the returned path.", "Under what cost condition does BFS cease to be optimal?"),
    ],
    readings: ["Luger, 6e, Chapter 3", "Russell and Norvig, 3e, Chapter 3"],
    preparation: "Review graphs, queues, and asymptotic complexity.",
    sourceTrace: ["L02_StateSpaceSearch.pptx slides 1–20", "Revised Week 2 schedule"],
  },
  {
    id: 4, week: 2, module: "State-Space Search", deck: "custom",
    title: "Depth-First, Uniform-Cost, and Search Evaluation",
    question: "Which uninformed strategy should we trust under different costs and resource limits?",
    knowledgePoints: [
      kp("Depth-first and depth-limited search", "DFS expands the deepest frontier node, using little memory but risking infinite paths and nonoptimal solutions; limits convert that risk into incompleteness.", "Contrast DFS and BFS on the same branching graph.", "Stack animation with a cycle and a depth cutoff.", "Trace DFS, then repair it with cycle checking and a depth bound.", "When is DFS a sensible engineering choice despite losing optimality?"),
      kp("Uniform-cost search", "UCS expands the node with the lowest accumulated path cost g(n), making it complete and optimal for positive step costs.", "A longer route with cheaper edges beats a short expensive route.", "Priority-queue demo that reorders nodes after costs are revealed.", "Trace UCS until the goal is removed from the frontier—not merely generated.", "Why is the goal test placed after removal from the priority queue?"),
      kp("Completeness, optimality, time, and space", "Algorithm choice is a contract among solution guarantees, branching factor, depth, costs, and available memory.", "Compare BFS, DFS, depth-limited, iterative deepening, and UCS.", "Change b, d, and cost patterns in a complexity estimator.", "Choose an algorithm for three scenarios and defend the guarantee that matters.", "Which metric would make your recommended algorithm unacceptable?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 3", "Luger, 6e, Chapter 3"],
    preparation: "Complete a short BFS/DFS trace before class.",
    sourceTrace: ["L02_StateSpaceSearch.pptx slides 21–41", "Revised Week 2 schedule"],
  },
  {
    id: 5, week: 3, module: "Informed and Local Search", deck: "custom",
    title: "Heuristic Functions, Hill Climbing, and Simulated Annealing",
    question: "How can useful knowledge guide search when exhaustive search is impossible?",
    knowledgePoints: [
      kp("Heuristic functions", "A heuristic h(n) estimates remaining cost; useful heuristics are cheaper than solving the problem and preserve meaningful differences among states.", "Compare misplaced tiles and Manhattan distance for the 8-puzzle.", "Score the same frontier with three heuristic functions.", "Design a heuristic for campus routing and identify information it ignores.", "Can a more informed heuristic still be worse in practice?"),
      kp("Hill climbing and local search", "Local search keeps one current state and moves through neighbors; hill climbing can stop at local maxima, plateaus, or shoulders.", "Compare first-choice and steepest-ascent behavior on the same successor set.", "Step through a multimodal objective landscape.", "Diagnose a failure mode and defend a conditional repair.", "Why does comparing every successor improve a move without guaranteeing the global optimum?"),
      kp("Simulated annealing", "Simulated annealing samples neighbors and accepts some worse moves with a temperature-dependent probability that decreases during cooling.", "Calculate exp(ΔV/T) for improving and worsening moves.", "Replay the source animation and adjust temperature in an acceptance-probability lab.", "Choose a sign convention, compute three acceptance decisions, and interpret the cooling schedule.", "Under what restrictive conditions does the theoretical global convergence result apply?"),
    ],
    readings: ["Luger, 6e, Chapter 4", "Russell and Norvig, 3e, Chapters 3–4"],
    preparation: "Bring one real problem where an exact solution is too expensive.",
    sourceTrace: ["L03_Heuristic, HillClimbing&SA.pptx", "Revised Week 3 schedule"],
  },
  {
    id: 6, week: 3, module: "Informed and Local Search", deck: "custom",
    title: "Best-First Search, A*, and Heuristic Quality",
    question: "When does informed search guarantee an optimal solution, and what does that guarantee cost?",
    knowledgePoints: [
      kp("Greedy best-first search", "Greedy best-first expands the frontier node with minimum h(n), retaining alternatives in OPEN but ignoring path cost already paid.", "Trace the exact A-to-P priority-queue example.", "Advance OPEN and CLOSED one expansion at a time.", "Predict the expansion order and repair the duplicate/path policy.", "Why can greedy best-first recover from a dead end yet still return a nonoptimal path?"),
      kp("A*, admissibility, and consistency", "A* expands minimum f(n)=g(n)+h(n); admissibility lower-bounds true remaining cost, while consistency enforces a triangle inequality and may avoid reopening.", "Compare breadth-first and A* on the 8-puzzle and route-finding animations.", "Toggle an inconsistent heuristic trace until a CLOSED node must reopen.", "Test a heuristic table for admissibility and consistency and state the graph policy.", "Which conditions support optimality in tree search versus graph search?"),
      kp("Informedness and total effort", "A pointwise larger admissible heuristic is more informed, but its computation, sensing, memory, or preprocessing cost can exceed the search it saves.", "Compare misplaced tiles and Manhattan distance and read the source total-cost curve.", "Replay exact A* and Dijkstra animations while naming g, h, and f.", "Choose a heuristic for an application and define the evidence needed to justify it.", "What result would falsify the claim that a stronger heuristic improves end-to-end performance?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 3", "Luger, 6e, Chapter 4"],
    preparation: "Complete the heuristic worksheet and bring a laptop.",
    sourceTrace: ["L04_BFS&AStar.pptx", "Revised Week 3 schedule"],
  },
  {
    id: 7, week: 4, module: "Adversarial Search", deck: "custom",
    title: "Game Trees, Minimax, and Evaluation Functions",
    question: "How should an agent choose when another agent actively tries to defeat it?",
    knowledgePoints: [
      kp("Game trees and zero-sum strategy", "A game model specifies states, the player to move, legal actions, a result function, terminal tests, and utilities; in a two-player zero-sum game, one player’s gain is the other player’s loss.", "Formulate tic-tac-toe and distinguish strategic game search from single-agent route finding.", "Grow a game tree by ply and mark which levels belong to MAX and MIN.", "Identify the player, legal actions, terminal outcomes, and fixed utility perspective in a new game.", "Which assumptions must hold before a problem can be modeled as deterministic, perfect-information, and zero-sum?"),
      kp("Recursive minimax backup", "Minimax computes the best worst-case backed-up utility: MAX chooses the largest child value and MIN chooses the smallest under an optimal-opponent model.", "Back up the exact fixed three-ply source tree and explain why a locally attractive leaf may not determine the root action.", "Step through the recursive Minimax-Decision, Max-Value, and Min-Value calls.", "Complete a minimax trace, state the selected move, and justify every internal value.", "What does minimax guarantee when the opponent is imperfect, and when does it guarantee a win?"),
      kp("Terminal utility, cutoffs, and evaluation", "Terminal states receive exact utility; nonterminal leaves at a depth cutoff receive an evaluation-function estimate whose signs must remain consistent with the fixed utility perspective.", "Use the source tic-tac-toe function E(n) = M(n) − O(n), where open winning lines approximate position quality.", "Change cutoff depth and inspect how backed-up choices change across the source tic-tac-toe trees.", "Compute a two-ply decision, then critique what its evaluation function ignores.", "How can an apparently reasonable cutoff evaluation be strategically exploited?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 5", "Luger, 6e, Chapter 4"],
    preparation: "Play two games of tic-tac-toe while recording decision reasons.",
    sourceTrace: ["L05_MiniMax&Pruning.pptx slides 1–16", "Revised Week 4 schedule"],
  },
  {
    id: 8, week: 4, module: "Adversarial Search", deck: "custom",
    title: "Alpha-Beta Pruning and Modern Game Search",
    question: "How can we search deeper when outcomes or opponents are not perfectly predictable?",
    knowledgePoints: [
      kp("Alpha-beta bounds and cutoffs", "Alpha is MAX’s best guaranteed value on the current path and beta is MIN’s best guaranteed value; a beta cutoff occurs at MAX when v ≥ β, while an alpha cutoff occurs at MIN when v ≤ α.", "Trace the exact source pseudocode and distinguish the two standard cutoff names.", "Advance alpha and beta through a worked tree until β ≤ α proves that remaining siblings cannot affect the decision.", "Annotate every updated bound and circle only subtrees that may be skipped safely.", "Why is alpha or beta a path bound rather than a prefilter on unexplored children?"),
      kp("Pruning equivalence and move ordering", "Alpha-beta returns the same minimax root value and action at the same depth and evaluation function while evaluating no more leaves; favorable move ordering can make the savings much larger.", "Compare full minimax with the source’s staged cutoff examples and hypothetical MAX–MIN state space.", "Reorder the same leaves and count how many evaluations alpha-beta avoids.", "Verify a trace by comparing its root result with full minimax and record whether each declared cutoff actually saves work.", "Why does move ordering change efficiency without changing the returned minimax result?"),
      kp("Chance and sampled game search", "Expectimax replaces adversarial MIN backups with probability-weighted chance backups, while Monte Carlo Tree Search allocates computation through selection, expansion, simulation, and backup.", "Contrast an optimal opponent, a chance event, and an unknown opponent policy.", "Change outcome probabilities in an expectimax example and inspect how sampled MCTS estimates stabilize.", "Choose minimax, expectimax, or MCTS for three game settings and defend the modeling assumption.", "When would an expected-value or rollout model be dangerously optimistic?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 5", "Canvas note on Monte Carlo tree search"],
    preparation: "Review minimax backup and logarithms.",
    sourceTrace: ["L05_MiniMax&Pruning.pptx slides 17–31", "Revised Week 4 schedule"],
  },
  {
    id: 9, week: 5, module: "Reasoning Under Uncertainty", deck: "custom",
    title: "Probability Foundations, Conditional Probability, and Bayes Rule",
    question: "How should an AI system revise belief when evidence is incomplete or noisy?",
    knowledgePoints: [
      kp("Random variables, distributions, and events", "A random variable names an uncertain aspect of the world; a normalized distribution assigns probabilities to its possible values, while a joint model assigns probabilities to complete outcomes.", "Model weather and traffic, then distinguish a single probability, a distribution, an outcome, an event, and a sample space.", "Edit a joint table and watch event probabilities change while normalization remains one.", "Compute event and marginal probabilities from the source tables.", "Which entries must change if a proposed table no longer sums to one?"),
      kp("Marginal and conditional probability", "Marginalization sums out variables; conditioning restricts attention to outcomes consistent with evidence and renormalizes the selected probabilities.", "Use the source X–Y tables and three-toss coin experiment to compute marginals and conditionals.", "Reveal select–sum–normalize one step at a time.", "Solve the event, marginal, conditional, and normalization exercises before revealing the note-derived answers.", "Why does P(A|B) not imply that B happened before or caused A?"),
      kp("Product rule, chain rule, and Bayes rule", "The product and chain rules factor joint probabilities; Bayes rule reverses a conditional by combining likelihood, prior, and evidence probability.", "Infer road construction from traffic and orange barrels, then work the meningitis, weather, and car-dealer examples.", "Move a prior or likelihood and observe the posterior and normalizer update.", "Derive a posterior, identify every term, and distinguish maximum a posteriori from maximum likelihood estimation.", "Why can a strong likelihood still produce a small posterior when the prior is rare?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 13", "Course probability review handout"],
    preparation: "Complete the probability refresher.",
    sourceTrace: ["L11_stochasticmethods - Part A.pptx slides 1–34", "Revised Week 5 schedule"],
  },
  {
    id: 10, week: 5, module: "Reasoning Under Uncertainty", deck: "custom",
    title: "Independence, Naive Bayes, and Bayesian Networks",
    question: "Which dependency assumptions make probabilistic inference manageable—and when are they justified?",
    knowledgePoints: [
      kp("Independence and conditional independence", "Independence factorizes a joint distribution; conditional independence says that one variable supplies no additional information about another once the conditioning variables are known.", "Compare independent coin flips with Toothache and Catch becoming conditionally independent given Cavity.", "Toggle evidence in the traffic–umbrella–rain and fire–smoke–alarm domains.", "Write and test equivalent conditional-independence statements.", "What empirical or domain evidence supports the assumption?"),
      kp("Bayesian-network semantics and inference", "A Bayesian network is a directed acyclic graph plus conditional probability tables; it represents a joint distribution as one local conditional factor per node.", "Build and query a burglary–alarm network while separating graph structure, parameters, evidence, hidden variables, and the posterior.", "Reveal enumeration terms and normalization contributions one assignment at a time.", "Translate a graph into its factorized joint and complete one exact query.", "Does an arrow by itself establish causation?"),
      kp("Naive Bayes and model evaluation", "Naive Bayes assumes features are conditionally independent given the class, then combines likelihood factors with a class prior; different variants estimate different feature distributions.", "Work the source classifier and speech-recognition examples, then identify where pronunciation and language context require richer models.", "Change feature likelihoods and watch class scores and the normalized posterior change.", "Classify one case, audit the assumption, and correct overbroad claims about mean, variance, irrelevant features, and streaming data.", "When can a useful classifier still have badly wrong probability estimates?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapters 13–14", "Luger, 6e, uncertainty chapter"],
    preparation: "Bring one dependency claim that might simplify a probabilistic model.",
    sourceTrace: ["L11_stochasticmethods - Part A.pptx slides 35–44", "L12_StochasticMethods - Part B.pptx slides 3–11", "Bayesian-network supplement grounded in Russell and Norvig, 3e, Chapters 13–14", "Revised Week 5 schedule"],
  },
  {
    id: 11, week: 6, module: "Sequential Decisions and Reinforcement Learning", deck: "custom",
    title: "Markov Decision Processes, Policies, and Value Iteration",
    question: "How does an agent plan when actions have uncertain long-term consequences?",
    knowledgePoints: [
      kp("MDP components", "An MDP specifies states, actions, transition probabilities, rewards, and a discount factor under the Markov assumption.", "Model a stochastic gridworld where movement sometimes slips.", "Change transition noise and reward values in an interactive grid.", "Write the MDP tuple for a delivery robot scenario.", "Which omitted state variable would violate the Markov assumption?"),
      kp("Policies and return", "A policy maps states to actions; return aggregates future rewards, while discounting expresses how strongly delayed outcomes matter.", "Compare a safe long route with a risky short route.", "Move the discount factor and watch preferred policies change.", "Calculate two finite returns and explain the behavioral difference.", "Is the discount factor a technical constant or a value judgment?"),
      kp("Bellman equations and value iteration", "Optimal value equals immediate reward plus discounted expected value of the best next action; value iteration repeatedly applies this backup.", "Perform two value-iteration sweeps on a 3×3 grid.", "Animated Bellman backups expose neighbor contributions.", "Compute one state update and identify convergence evidence.", "Why can locally low reward still support an optimal action?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 17", "Canvas MDP worksheet"],
    preparation: "Review expectation and geometric discounting.",
    sourceTrace: ["L12_StochasticMethods - Part B.pptx Markov-model foundations", "Revised Week 6 schedule"],
  },
  {
    id: 12, week: 6, module: "Sequential Decisions and Reinforcement Learning", deck: "custom",
    title: "Reinforcement Learning, Q-Learning, and Exploration",
    question: "How can an agent improve from consequences without a labeled answer for each action?",
    knowledgePoints: [
      kp("Agent–environment learning loop", "The agent observes a state, acts, receives reward and a successor state, and improves behavior from experience.", "Contrast supervised labels with rewards in game play.", "Step through an episode and record a transition tuple.", "Identify state, action, reward, next state, and terminal condition in a scenario.", "Why can sparse rewards make learning difficult?"),
      kp("Q-learning", "Q-learning updates an action value toward reward plus the best estimated future action value, learning off-policy from sampled transitions.", "Compute Q(s,a) after one gridworld transition.", "Adjust learning rate and discount factor and watch update size.", "Complete four Q-updates and select the greedy action.", "What happens when the learning rate is too large or too small?"),
      kp("Exploration versus exploitation", "An agent must try uncertain actions to discover value while using known good actions to earn reward; epsilon-greedy is a simple compromise.", "A multi-armed bandit shows regret from always exploiting early luck.", "Run repeated bandit trials with different epsilon values.", "Predict which strategy wins in stationary and changing environments.", "How should exploration change when errors affect people?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 21", "Canvas Q-learning note"],
    preparation: "Install the provided notebook environment.",
    sourceTrace: ["L10_MachineLearning Part B.pptx reinforcement-learning introduction", "Revised Week 6 schedule"],
  },
  {
    id: 13, week: 7, module: "Machine Learning Foundations", deck: "custom",
    title: "The Machine-Learning Workflow: Data, Baselines, and Splits",
    question: "What makes a machine-learning result credible rather than merely impressive?",
    knowledgePoints: [
      kp("Problem and target definition", "A useful ML task connects inputs, targets, intended users, decision context, and error costs; the target is a measurement, not reality itself.", "Turn loan-risk prediction into a precise supervised-learning task.", "Inspect how changing the label definition changes the dataset.", "Write a task statement and list one proxy risk.", "Which stakeholder could be harmed by the target definition?"),
      kp("Data and splits", "Training data fits parameters, validation data supports choices, and test data estimates final generalization; leakage breaks this separation.", "Show how the same patient appearing in train and test inflates performance.", "Drag records into time-aware, group-aware, and random splits.", "Diagnose leakage in three dataset descriptions.", "Why should the test set remain untouched until the end?"),
      kp("Baselines and reproducibility", "A baseline defines the minimum credible comparison; reproducibility requires fixed data versions, code, seeds, environments, and evaluation procedures.", "Compare a learned classifier with majority-class and simple-rule baselines.", "Run a small sklearn baseline with a fixed seed.", "Create a reproducibility checklist for the search assignment dataset.", "What improvement is meaningful if the baseline already reaches 95% accuracy?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 18", "Canvas ML workflow guide"],
    preparation: "Bring a laptop with Python, Git, and the course environment ready.",
    sourceTrace: ["L09_MachineLearning Part A.pptx slides 2–11 and 37–39", "Revised Week 7 schedule"],
  },
  {
    id: 14, week: 7, module: "Machine Learning Foundations", deck: "custom",
    title: "Classification, Regression, Overfitting, and Metrics",
    question: "How do we know whether a learned model will work for the people and cases that matter?",
    knowledgePoints: [
      kp("Classification and regression", "Classification predicts categories; regression predicts continuous quantities; both learn a mapping under a loss function.", "Compare spam classification, loan-risk classes, and house-price regression.", "Fit a decision boundary and regression line while adding noisy data.", "Choose task type, target, and loss for four applications.", "When might converting regression to classification discard important information?"),
      kp("Generalization and overfitting", "Overfitting occurs when a model captures training-specific noise rather than transferable structure; complexity, data, and regularization interact.", "Fit polynomial curves of increasing degree.", "Move model complexity and observe training versus validation error.", "Identify underfit, useful fit, and overfit from learning curves.", "Why can training accuracy continue improving while the model gets worse?"),
      kp("Metrics, leakage, and subgroup analysis", "Accuracy can hide class imbalance and unequal errors; precision, recall, F1, ROC/PR curves, confusion matrices, and subgroup results answer different questions.", "Evaluate a rare-disease classifier and a spam filter with the same confusion matrix.", "Change the threshold and watch errors redistribute across groups.", "Select metrics for a scenario and write the cost assumption.", "Can one aggregate metric establish fairness or safety?"),
    ],
    readings: ["Russell and Norvig, 3e, Chapter 18", "Canvas metrics worksheet"],
    preparation: "Review mean, variance, and confusion matrices.",
    sourceTrace: ["L09_MachineLearning Part A.pptx decision trees and supervised learning", "Revised Week 7 schedule"],
  },
  {
    id: 15, week: 8, module: "Applied Machine Learning", deck: "custom",
    title: "Pipelines, Cross-Validation, and Error Analysis Lab",
    question: "How can an experiment reveal why a model fails—not just how often?",
    knowledgePoints: [
      kp("Pipelines and preprocessing", "A pipeline fits preprocessing only on training folds and applies the learned transformation consistently, preventing leakage and deployment mismatch.", "Standardization outside cross-validation leaks validation information.", "Build an sklearn Pipeline from imputation through classification.", "Repair a leaking notebook and explain the correction.", "Which preprocessing steps must be learned rather than fixed?"),
      kp("Cross-validation and model selection", "Cross-validation estimates variation across splits and supports model selection, but the design must respect groups, time, and repeated entities.", "Compare random K-fold with group and time-series splits.", "Visualize folds and validation scores with uncertainty.", "Choose a split strategy for patients, users, and sensor streams.", "Does more folds always produce a better estimate?"),
      kp("Error analysis", "Inspecting false positives, false negatives, slices, and data quality turns a score into actionable hypotheses.", "Cluster misclassified text by length, vocabulary, and source.", "Open an error table linked to examples and feature summaries.", "Create two failure categories and propose one testable improvement.", "How do you avoid tuning to the error-analysis set itself?"),
    ],
    readings: ["Canvas applied-ML lab", "scikit-learn user guide selections"],
    preparation: "Complete the environment check and download the lab dataset.",
    sourceTrace: ["L09_MachineLearning Part A.pptx decision-tree evaluation", "Revised Week 8 schedule"],
  },
  {
    id: 16, week: 8, module: "Applied Machine Learning", deck: "custom",
    title: "Midterm Examination",
    question: "Can you connect agent design, search, uncertainty, and learning under time constraints?",
    knowledgePoints: [
      kp("Concept integration", "The midterm assesses explanation, algorithm traces, comparison of guarantees, and interpretation of evidence rather than isolated vocabulary.", "Connect task-environment properties to search and uncertainty choices.", "Instructor-led sample problem with hidden solution steps.", "Complete an individual retrieval-practice set before the exam begins.", "Which assumption changes your algorithm recommendation?"),
      kp("Algorithmic reasoning", "Students should be able to trace BFS, UCS, A*, minimax, Bayes updates, and basic evaluation calculations.", "One compact state graph supports multiple algorithm traces.", "Reveal a trace one operation at a time and inspect common errors.", "Explain the frontier contents after a specified iteration.", "Can you justify every queue or priority change?"),
      kp("Evidence interpretation", "A result is only meaningful relative to task definition, data, baseline, metric, and limitations.", "Critique a short model-performance claim.", "Annotate a result card to expose missing evidence.", "Write a two-sentence supported conclusion and one limitation.", "What claim is not licensed by the presented evidence?"),
    ],
    readings: ["Midterm study guide", "Meetings 1–15 practice sets"],
    preparation: "Prepare according to the Canvas examination instructions.",
    sourceTrace: ["Revised Week 8 schedule"],
  },
  {
    id: 17, week: 9, module: "Neural Networks", deck: "custom",
    title: "Perceptrons, Activations, Loss, and Gradient Descent",
    question: "How does a neural network turn numerical error into improved predictions?",
    knowledgePoints: [
      kp("Artificial neurons and perceptrons", "A neuron computes a weighted sum and activation; the perceptron learns a linear decision boundary from labeled examples.", "Implement AND and OR with McCulloch–Pitts units and show XOR's limitation.", "Move weights and bias while a 2D boundary updates.", "Calculate a perceptron output and one learning update.", "Why can no single line separate XOR?"),
      kp("Activations and multilayer networks", "Nonlinear activations let stacked layers represent nonlinear functions; without them, many layers collapse to one linear transformation.", "Compare step, sigmoid, tanh, and ReLU.", "Toggle activation functions and watch hidden representations change.", "Choose an activation and predict saturation or sparsity behavior.", "What failure occurs if every layer is linear?"),
      kp("Loss and gradient descent", "A loss measures prediction error; gradients show local sensitivity; learning rate controls the size of parameter updates.", "Minimize a simple quadratic before moving to network loss.", "Animate descent with too-small, useful, and too-large learning rates.", "Compute one derivative-based update and diagnose divergence.", "Does lower training loss guarantee better generalization?"),
    ],
    readings: ["Russell and Norvig, 3e, neural-network section", "L10_MachineLearning Part B.pptx"],
    preparation: "Review vectors, derivatives, and the chain rule.",
    sourceTrace: ["L10_MachineLearning Part B.pptx slides 6–18", "Revised Week 9 schedule"],
  },
  {
    id: 18, week: 9, module: "Neural Networks", deck: "custom",
    title: "Backpropagation and a PyTorch Training Lab",
    question: "What exactly happens between a tensor entering a model and a trained model leaving the loop?",
    knowledgePoints: [
      kp("Computation graphs and backpropagation", "Backpropagation applies the chain rule efficiently from loss to every differentiable parameter, reusing intermediate derivatives.", "Trace a two-layer scalar network forward and backward.", "Reveal a computation graph and local gradients node by node.", "Compute gradients for a tiny network and check their signs.", "Why is backpropagation not itself an optimization algorithm?"),
      kp("PyTorch tensors and autograd", "Tensors store data and parameters; autograd records differentiable operations and produces gradients after backward().", "Create tensors, require gradients, compute loss, and inspect .grad.", "Live code demo with shape checks and intentional detach error.", "Repair tensor-shape and gradient-reset bugs.", "What happens if gradients are not zeroed each iteration?"),
      kp("Training and evaluation loop", "A complete loop separates training mode, gradient updates, validation, checkpoint selection, and final evaluation.", "Train a small classifier and inspect learning curves.", "Change batch size and learning rate while monitoring loss and accuracy.", "Add validation and early-stopping logic to starter code.", "Which checkpoint should be reported, and why?"),
    ],
    readings: ["PyTorch quickstart", "Canvas neural-network lab"],
    preparation: "Install the pinned PyTorch environment and run the diagnostic notebook.",
    sourceTrace: ["L10_MachineLearning Part B.pptx backpropagation material", "Revised Week 9 schedule"],
  },
  {
    id: 19, week: 10, module: "Transformers and Large Language Models", deck: "custom",
    title: "Tokens, Embeddings, Attention, and Transformer Architecture",
    question: "How does a transformer represent context and move information among tokens?",
    knowledgePoints: [
      kp("Tokenization and embeddings", "A tokenizer maps text to discrete units; embeddings map tokens and positions to vectors where learned geometry supports prediction.", "Compare tokenization of common, rare, and multilingual words.", "Interactive tokenizer and nearest-neighbor embedding view.", "Predict token boundaries and explain why token count differs from word count.", "What kinds of meaning are not guaranteed by geometric proximity?"),
      kp("Self-attention", "Queries, keys, and values compute content-dependent weighted combinations, allowing each token to gather information from relevant positions.", "Trace attention for an ambiguous pronoun.", "Adjust query–key similarity and observe normalized attention weights.", "Calculate a small dot-product attention example.", "Why should attention weights not automatically be treated as explanations?"),
      kp("Transformer blocks", "Multi-head attention, residual connections, normalization, and feed-forward layers transform representations repeatedly; causal masking restricts language models to prior tokens.", "Follow tensor shapes through one decoder block.", "Toggle a causal mask and show forbidden future attention.", "Label the data path through a transformer diagram.", "Which component introduces sequence order?"),
    ],
    readings: ["Canvas transformer primer", "Attention Is All You Need, selected figures"],
    preparation: "Review vectors, dot products, softmax, and matrix shapes.",
    sourceTrace: ["Revised Week 10 schedule", "Contemporary transformer readings"],
  },
  {
    id: 20, week: 10, module: "Transformers and Large Language Models", deck: "custom",
    title: "LLM Training, Structured Outputs, Hallucination, and Verification",
    question: "What can an LLM output justify, and what must an application verify?",
    knowledgePoints: [
      kp("Pretraining and adaptation", "Next-token pretraining learns statistical regularities at scale; instruction tuning and preference optimization shape interaction but do not install a truth database.", "Compare base-model continuation with instruction-following behavior.", "Sample from a toy next-token distribution at different temperatures.", "Explain which training stage likely shapes three observed behaviors.", "Why can fluent output still be false?"),
      kp("Prompting and structured outputs", "Clear task context, examples, constraints, and schemas can improve consistency; structured generation narrows form but does not guarantee semantic correctness.", "Extract fields from a short policy into a JSON schema.", "Run valid and invalid structured-output cases and validate locally.", "Write a prompt plus schema and identify one unverifiable field.", "What does schema validation prove—and not prove?"),
      kp("Hallucination and verification", "Verification separates generation from evidence: use retrieval, calculations, tools, citations, tests, or human review according to risk.", "Audit an answer containing a fabricated citation and a correct calculation.", "Evidence panel highlights supported, contradicted, and unverified claims.", "Design a verification pathway for a low- and high-stakes task.", "When should the system refuse or escalate rather than answer?"),
    ],
    readings: ["Canvas LLM systems reading", "Model provider documentation selections"],
    preparation: "Bring one example of a useful LLM answer and one unreliable answer.",
    sourceTrace: ["Revised Week 10 schedule", "Contemporary LLM documentation"],
  },
  {
    id: 21, week: 11, module: "Retrieval-Augmented Generation", deck: "custom",
    title: "RAG Foundations: From Documents to Retrieved Context",
    question: "How can retrieval give a language model task-specific evidence at answer time?",
    knowledgePoints: [
      kp("RAG architecture", "RAG separates document ingestion, indexing, retrieval, context construction, and generation so the answer can be grounded in an inspectable source collection.", "Trace a question through a course-policy knowledge base.", "Animate query, vector search, retrieved chunks, prompt context, and answer.", "Label components and identify where evidence can be lost.", "Which failures are retrieval failures versus generation failures?"),
      kp("Chunking and embeddings", "Chunk boundaries determine what evidence can be retrieved; embeddings support semantic similarity but can blur exact terms and relationships.", "Compare fixed, paragraph, and structure-aware chunking.", "Change chunk size and overlap and inspect retrieved passages.", "Design chunks for a syllabus and justify metadata.", "When does overlap improve recall but harm precision or cost?"),
      kp("Vector retrieval", "Similarity search returns candidates near a query vector; top-k, filtering, and metadata determine the evidence set presented to the model.", "Retrieve course policies under semantic and exact-term queries.", "Interactive vector-space and top-k demo.", "Predict retrieved chunks, then diagnose a missed answer.", "Does nearest mean relevant, sufficient, or true?"),
    ],
    readings: ["Canvas RAG foundations reading", "Lewis et al., 2020, selected sections"],
    preparation: "Bring a small document set suitable for question answering.",
    sourceTrace: ["Existing Meeting 21 RAG Foundations site", "Revised Week 11 schedule"],
  },
  {
    id: 22, week: 11, module: "Retrieval-Augmented Generation", deck: "custom",
    title: "RAG Quality: Hybrid Retrieval, Reranking, Grounding, and Evaluation",
    question: "How do we know a RAG answer is supported by the right evidence?",
    knowledgePoints: [
      kp("Hybrid retrieval and reranking", "Lexical search preserves exact terms, vector search finds semantic similarity, and reranking spends more computation to order a smaller candidate set.", "Compare retrieval for a course number, acronym, and paraphrased policy.", "Fuse BM25 and vector ranks, then apply a cross-encoder reranker.", "Choose a retrieval strategy for three query types.", "Why can reranking not recover a missing candidate?"),
      kp("Grounding and citations", "A grounded response distinguishes source statements from inference and links claims to passages that actually entail them.", "Audit a cited answer whose source is related but does not support the claim.", "Claim–citation alignment interface marks entailment and gaps.", "Rewrite an answer so every factual claim is supported or qualified.", "What makes a citation decorative rather than evidentiary?"),
      kp("RAG evaluation", "Evaluate retrieval and generation separately with answerable queries, relevance judgments, context recall/precision, faithfulness, answer quality, latency, and cost.", "Build a small evaluation set including unanswerable questions.", "Inspect a failure matrix and regression dashboard.", "Classify failures and propose the next experiment.", "Which metric can improve while user trust gets worse?"),
    ],
    readings: ["Canvas RAG evaluation reading", "Selected RAG evaluation documentation"],
    preparation: "Complete the Meeting 21 retrieval diagnosis.",
    sourceTrace: ["Existing Meeting 22 RAG Quality site", "Revised Week 11 schedule"],
  },
  {
    id: 23, week: 12, module: "Tool-Using AI and Agent Harnesses", deck: "custom",
    title: "Structured Tool Calls, Agent Loops, and MCP Concepts",
    question: "What changes when a model can take actions instead of only generating text?",
    knowledgePoints: [
      kp("Structured tool calling", "A model proposes a named operation with typed arguments; application code validates, authorizes, executes, and returns the result.", "Compare free-form 'send an email' text with a validated function call.", "Inspect a tool schema and reject malformed or unauthorized arguments.", "Design a read-only course-search tool with a precise schema.", "Who is responsible when a syntactically valid call is unsafe?"),
      kp("Agent loops", "A tool-using loop observes, plans, acts, receives results, and decides whether to continue; stopping rules and bounded budgets prevent uncontrolled execution.", "Trace a research assistant across search, read, summarize, and verify steps.", "Step through an event log with tool success and failure.", "Write termination conditions for a multi-step task.", "How can a loop appear productive while drifting from the user's goal?"),
      kp("Model Context Protocol concepts", "MCP standardizes how hosts expose tools, resources, and prompts to models while keeping execution and permissions outside the model.", "Map host, client, server, tool, resource, and approval in a local course assistant.", "Browse a mock server capability list and call a read-only resource.", "Classify capabilities as tool, resource, or prompt and justify access.", "What security boundary remains even when the protocol is standardized?"),
    ],
    readings: ["Official MCP introduction and architecture", "Canvas tool-calling note"],
    preparation: "Review JSON Schema and client–server architecture.",
    sourceTrace: ["Revised Week 12 schedule", "Official protocol documentation"],
  },
  {
    id: 24, week: 12, module: "Tool-Using AI and Agent Harnesses", deck: "custom",
    title: "Harness Fundamentals: State, Permissions, Approval, Logging, and Evaluation",
    question: "What must surround an AI model before it can act responsibly in a real system?",
    knowledgePoints: [
      kp("Harness and state", "A harness manages context, memory, tool results, budgets, retries, and task state around a model; explicit state makes behavior inspectable and resumable.", "Contrast a one-shot chatbot with a repository-coding harness.", "Inspect a state machine for planned, executing, awaiting approval, and complete states.", "Define the minimal state needed for a course-research agent.", "Which state belongs in durable storage versus the prompt?"),
      kp("Permissions and human approval", "Least privilege limits available actions; approval gates place consequential decisions with an authorized person using clear previews and exact targets.", "A read-only file search can proceed while sending or deleting requires approval.", "Change permission scopes and see which actions become eligible.", "Create an approval policy for a student-facing assistant.", "When does frequent approval become meaningless click-through?"),
      kp("Logging, security, and evaluation", "Event logs, traces, sandboxing, secret handling, adversarial tests, and task-level evaluation are required to diagnose and govern tool-using behavior.", "Follow a prompt-injection attempt from retrieved content to a blocked tool call.", "Red-team a mock harness and inspect its audit trail.", "Write one misuse test, one reliability test, and one recovery test.", "What evidence would justify expanding the harness's permissions?"),
    ],
    readings: ["Canvas agent-harness reading", "Selected official safety and evaluation documentation"],
    preparation: "Bring one tool-using workflow and identify its most consequential action.",
    sourceTrace: ["Revised Week 12 schedule", "Contemporary agent-system practices"],
  },
  {
    id: 25, week: 13, module: "Responsible AI Evaluation", deck: "planned",
    title: "Auditing AI Claims, Evidence, and Deployment Boundaries",
    question: "What evidence would justify an AI claim, and what boundary would make the same claim misleading?",
    knowledgePoints: [
      kp("Bounded claims and evaluation questions", "A testable AI claim specifies the system version, users, task, context, outcome, baseline, and excluded uses; without these boundaries, an impressive result cannot transfer safely.", "Turn 'the assistant improves learning' into a claim with a named population, task, comparison, measure, and time horizon.", "Change one deployment condition and observe which evaluation cases stop supporting the claim.", "Write one bounded claim and one result that would disconfirm it.", "Which missing boundary makes the original claim easiest to overgeneralize?"),
      kp("Validity, uncertainty, and failure evidence", "Evaluation must connect measures to the intended construct, report uncertainty and subgroup behavior, and include difficult, adversarial, and unanswerable cases rather than only average success.", "Compare a high aggregate score with a lower score that reveals a serious subgroup failure.", "Inspect an evaluation dashboard while toggling confidence intervals and failure categories.", "Diagnose whether one reported improvement reflects real capability, leakage, confounding, or measurement mismatch.", "What evidence would change the deployment recommendation?"),
      kp("Claim-to-source and decision trace", "A defensible audit links each material claim to a source location, separates observation from inference, records missing evidence, and states who is authorized to accept the residual risk.", "Trace a model-card claim to the exact table and test condition that supports it.", "Reveal a claim-to-evidence matrix and flag unsupported, qualified, and missing links.", "Produce a six-row audit trace for a public AI claim.", "Can an independent reviewer reproduce both the evidence judgment and the deployment boundary?"),
    ],
    readings: ["Canvas responsible-AI evaluation note", "One primary evaluation report or system card selected by the student"],
    preparation: "Bring one public AI performance claim and the most direct source you can locate.",
    sourceTrace: ["Revised Week 13 schedule", "Responsible-AI evaluation and audit literature"],
  },
  {
    id: 26, week: 13, module: "Responsible AI Evaluation", deck: "planned",
    title: "Accessible AI Explanations, Participatory Evaluation, and Public Communication",
    question: "How can people understand, test, and challenge an AI system without requiring specialist access?",
    knowledgePoints: [
      kp("Audience, purpose, and actionable transparency", "An explanation should help a named audience make a decision, contest an outcome, or use a system safely; relevance and action matter more than exposing every implementation detail.", "Compare explanations for an affected user, a deployer, and an auditor after the same automated decision.", "Switch audience and decision goals to see which evidence and controls become necessary.", "Write one explanation objective tied to an observable user action.", "What can the audience do differently after receiving the explanation?"),
      kp("Accessible mechanisms and misconception control", "Examples, diagrams, and analogies should preserve the causal mechanism, name where the mapping breaks, and remain usable across keyboard, screen-reader, contrast, language, and cognitive-access needs.", "Revise a magic metaphor into a transparent pattern-and-data explanation with an explicit boundary.", "Audit two explanation variants for accessibility and technical fidelity.", "Create one mechanism-preserving visual or interaction plus alternative text and a boundary statement.", "Which simplification would create the most consequential misconception?"),
      kp("Participatory testing and revision", "Teach-back, task performance, disagreement, and structured feedback reveal whether people understand and can challenge the system; participation must influence a documented design or governance decision.", "A community reviewer identifies a missing failure case and changes the evaluation set.", "Run a two-minute teach-back and log comprehension, confusion, and contested assumptions.", "Revise the explanation or evaluation protocol from observable feedback.", "What evidence shows meaningful influence rather than performative consultation?"),
    ],
    readings: ["Canvas accessible AI communication note", "Selected public explanation, notice, or appeal workflow"],
    preparation: "Bring one AI explanation or notice and identify the decision its audience must make.",
    sourceTrace: ["Revised Week 13 schedule", "Human-centered, accessible, and participatory AI evaluation literature"],
  },
  {
    id: 27, week: 14, module: "Capstone Engineering", deck: "custom",
    title: "Baselines, Evaluation Sets, Testing, and System Cards",
    question: "What evidence should accompany an AI system before anyone relies on it?",
    knowledgePoints: [
      kp("Capstone claim and baseline", "A capstone begins with a bounded claim and comparison that can be tested; the baseline prevents complexity from being mistaken for value.", "Compare a RAG assistant with search-only and model-only baselines.", "Turn a vague project goal into a measurable claim–evidence pair.", "Write the primary claim, baseline, and disconfirming result.", "What result would make you recommend not deploying the system?"),
      kp("Evaluation set and tests", "Evaluation cases should represent typical, difficult, edge, adversarial, and unanswerable conditions; automated tests and human rubrics address different properties.", "Construct a balanced set for a course-policy assistant.", "Run a small regression suite and inspect failure categories.", "Add five cases that challenge the team's current success pattern.", "Does the evaluation set resemble real use or the team's development examples?"),
      kp("Reproducibility and system cards", "A system card records purpose, components, data, evaluations, intended use, limitations, risks, oversight, and change history.", "Audit a sample card for missing evidence and vague limitations.", "Generate a card section from project metadata, then verify it manually.", "Draft the capstone system card with links to artifacts and results.", "Could an independent reviewer reproduce the reported evaluation?"),
    ],
    readings: ["Capstone rubric and system-card template", "Canvas testing guide"],
    preparation: "Bring a working baseline and a first evaluation set.",
    sourceTrace: ["Revised Week 14 schedule"],
  },
  {
    id: 28, week: 14, module: "Capstone Engineering", deck: "custom",
    title: "Project Studio: Peer Testing, Red-Teaming, and Revision",
    question: "Which failure discovered today should change the system before demonstration?",
    knowledgePoints: [
      kp("Peer usability and task testing", "A peer test observes whether a new user can complete representative tasks and interpret outputs without coaching.", "Use a think-aloud protocol with a course assistant.", "Record task success, confusion, recovery, and time without intervening.", "Run two peer tasks and prioritize one usability correction.", "Did the tester fail because of the model, interface, instruction, or task definition?"),
      kp("Red-teaming and limitation analysis", "Red-teaming searches deliberately for boundary failures, prompt injection, unsupported claims, unsafe actions, and recovery weaknesses.", "Attack a RAG assistant with conflicting and malicious retrieved text.", "Threat cards generate structured adversarial cases.", "Run three attacks and document severity, reproducibility, and mitigation.", "Which failure must be disclosed even if it cannot be fixed?"),
      kp("Evidence-driven revision", "Revision should connect a diagnosed cause to a change and a regression test; changing prompts blindly creates unmeasured tradeoffs.", "Repair retrieval, then rerun both the failing case and prior successes.", "Before/after trace compares system behavior and metric movement.", "Write a change hypothesis, implement it, and record the result.", "What regression did the improvement introduce?"),
    ],
    readings: ["Capstone studio checklist", "Canvas red-team scenarios"],
    preparation: "Bring a deployable prototype, system card draft, and known-limitations list.",
    sourceTrace: ["Revised Week 14 schedule"],
  },
  {
    id: 29, week: 15, module: "Demonstration and Synthesis", deck: "custom",
    title: "Capstone Demonstrations and Individual Technical Defense",
    question: "Can the team demonstrate both what the system does and why its evidence should be trusted?",
    knowledgePoints: [
      kp("Problem, system, and decision", "A strong demonstration connects the user problem to architecture and a live task without hiding failure conditions.", "Five-minute model: problem, baseline, system flow, live case, result.", "Presentation timer and evidence checklist support consistent demonstrations.", "Deliver the system demonstration to peers.", "Which design decision had the largest measurable effect?"),
      kp("Evaluation and limitations", "Report evaluation-set construction, baseline comparison, uncertainty, failure categories, and intended-use boundaries.", "Show an honest failure beside a successful case.", "Audience selects a result to inspect down to source or log.", "Answer questions using the system card and artifacts.", "What claim remains uncertain after your evaluation?"),
      kp("Individual technical defense", "Each student must explain one component, trace one execution, justify one evaluation choice, and reason about a change scenario.", "Trace a RAG query or model prediction end to end.", "Randomized defense prompts prevent memorized team narration.", "Complete the individual oral or written technical defense.", "How would the system behave if one key assumption changed?"),
    ],
    readings: ["Capstone demonstration rubric", "Final system card"],
    preparation: "Freeze the demonstration build and verify all links and backups.",
    sourceTrace: ["Revised Week 15 schedule"],
  },
  {
    id: 30, week: 15, module: "Demonstration and Synthesis", deck: "custom",
    title: "Course Synthesis and Final Review",
    question: "How do representation, search, uncertainty, learning, and evidence connect across modern AI systems?",
    knowledgePoints: [
      kp("One system, many AI ideas", "Modern systems combine representations, objectives, search or optimization, probabilistic assumptions, learned models, interfaces, and evaluation.", "Map an autonomous agent and a RAG assistant onto the course concept network.", "Interactive concept map reveals dependencies among all 15 modules.", "Trace one capstone behavior through at least four course ideas.", "Which foundational idea remains visible inside an LLM application?"),
      kp("Choosing methods by task environment", "Method selection follows task properties, evidence, cost, risk, and available supervision—not trendiness.", "Choose between rules, search, probabilistic inference, supervised learning, RL, and an LLM system.", "Scenario selector changes observability, stakes, and data conditions.", "Recommend an approach and state the assumptions that would reverse it.", "What evidence is needed before replacing the baseline?"),
      kp("AI literacy and responsible explanation", "Technical competence includes communicating what a system does, what evidence supports it, what remains unknown, and who should decide.", "Rewrite a marketing claim as a source-traced system claim.", "Claim ladder moves from observation to inference to recommendation.", "Create a final teach-back for a nontechnical audience and peer-audit its accuracy.", "Can the audience distinguish capability, evidence, limitation, and value judgment?"),
    ],
    readings: ["Final review guide", "Student system cards and AAB evidence briefs"],
    preparation: "Bring a one-page concept map and remaining questions.",
    sourceTrace: ["Revised Week 15 schedule", "Cumulative historical and contemporary course materials"],
  },
];

export const modules = Array.from({ length: 15 }, (_, index) => {
  const week = index + 1;
  const moduleMeetings = meetings.filter((meeting) => meeting.week === week);
  return {
    week,
    title: moduleMeetings[0].module,
    meetings: moduleMeetings,
  };
});

export const getMeeting = (id: number) => meetings.find((meeting) => meeting.id === id);
