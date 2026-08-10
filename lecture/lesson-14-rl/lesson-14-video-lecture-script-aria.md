# Lesson 14 video lecture script

- Route: /lessons/14
- Voice: Microsoft Aria Neural (en-US-AriaNeural)
- Speaking rate: 0.94x (-6%)
- Slides: 25
- Narration words: 5,877
- Captions: burned in at the bottom of the final video

## Slide 1: Learn by acting, observing consequences, and revising a policy

### Concept and boundary

Reinforcement learning replaces a known transition model with experience. An agent acts, observes consequences, receives reward, and revises a policy or value estimate. The recurring loop is interaction, return, value, and control, with uncertainty made visible rather than erased.

### Read the visible model

Now connect that idea to the exact visible evidence. 75-MINUTE MEETING Interaction leads to return leads to value leads to control Trial and error motivates the mathematical machinery we will make visible through one small environment. 01 Agent select an action leads to 02 World changes state leads to 03 Reward scores consequence ↻ Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 2: The source establishes trial-and-error, feedback, reward, policy, and exploration

### Concept and boundary

The historical source gives five foundational ideas: trial and error, feedback as reward, policy, return, and exploration. Preserve those ideas, but qualify the claim that an agent simply learns an optimal policy. Optimality depends on representation, exploration, algorithm assumptions, and the environment.

### Read the visible model

Now connect that idea to the exact visible evidence. COURSE-SOURCE RECONSTRUCTION · PAGE 30 Reinforcement learning trial and error feedback as reward policy connects situations to actions maximize cumulative reward exploration discovers useful actions Trial and error, cumulative reward, exploration, and disciplinary connections. READ THE SOURCE AS EVIDENCE Five durable knowledge points The agent learns through trial and error. Feedback arrives as reward, not a labeled correct action. A policy connects situations to actions. Performance concerns cumulative reward. Exploration produces the experience used to learn. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 3: Reinforcement learning seeks high expected return; optimality is not automatic

### Concept and boundary

Reinforcement learning seeks high expected return, but successful learning is not automatic. Sparse feedback, partial observability, unsafe exploration, unstable approximation, and distribution shift can all break the promise. Separate the objective from the evidence that an algorithm actually reaches it.

### Read the visible model

Now connect that idea to the exact visible evidence. SOURCE WORDING “learns an optimal policy” The phrase names the objective but can sound like a guarantee. leads to COURSE FORMULATION learn a policy that maximizes expected return Reaching an optimum depends on representation, exploration, data, algorithm assumptions, and whether function approximation is used. SECOND QUALIFICATION A large or unknown environment can motivate model-free RL, but size alone does not make RL successful or sample-efficient. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 4: Games and elevator control show why action-dependent experience matters

### Concept and boundary

Games and elevator control demonstrate action-dependent experience. A move changes the future board; an elevator decision changes waiting time and future requests. Unlike passive prediction, the learner partly controls which data it will see next.

### Read the visible model

Now connect that idea to the exact visible evidence. ♟ ♙ ♜ ♔ GAME PLAYING Too many states for a hand-written rule per position Agents can learn through play against humans or other agents. 4 3 2 1 CONTROL Scheduling balances waiting time and changing demand Simulation supports retraining when operating conditions change. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 5: The source contrasts batch learning with incremental online learning

### Concept and boundary

Batch and online learning describe update schedules. Batch learning updates after collecting a dataset; online learning updates as examples arrive. Reinforcement learning is instead defined by sequential decisions and reward, so it may use either batch or online updates.

### Read the visible model

Now connect that idea to the exact visible evidence. COURSE-SOURCE RECONSTRUCTION · PAGE 32 Batch learning compared with online learning Batch: observe a fixed training set, learn once, then predict Online: observe a sequence, update incrementally, then predict again The true response can trigger the next update data leads to model leads to prediction leads to response ↺ update Batch and online learning compared through a complete prediction-and-update pipeline. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 6: Online updating and reinforcement learning can overlap—but answer different questions

### Concept and boundary

The source figure compares batch and online updating. Enlarge it, inspect the actual labels, and keep the source boundary visible. Online updating can occur in supervised learning without reward or control, while reinforcement learning can learn from a stored replay buffer rather than updating after every transition.

### Read the visible model

Now connect that idea to the exact visible evidence. Exact image25.png · copied byte-for-byte from the authoritative PowerPoint. CLICK IMAGE TO ENLARGE ONLINE LEARNING ASKS When is the model updated? Incrementally as examples arrive, rather than from one fixed batch. REINFORCEMENT LEARNING ASKS How should an agent act under reward and delayed consequences? Actions change future states and therefore change the data observed. NOT SYNONYMS RL may be online or offline. Online learning may use labeled responses without choosing actions in an environment. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: Enlarge: Exact embedded source figure comparing batch and online learning

Before selecting Enlarge: Exact embedded source figure comparing batch and online learning, predict the result. Now activate it. Enlarge the embedded source figure and inspect its labels directly. It distinguishes update schedule, not the defining decision-and-reward structure of reinforcement learning.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 7: The source places reinforcement learning inside a broader learning taxonomy

### Concept and boundary

The historical taxonomy places reinforcement learning among broader learning categories. Use it as a snapshot rather than a universal partition. Modern systems can combine supervised pretraining, offline reinforcement learning, online fine-tuning, and model-based planning in one pipeline.

### Read the visible model

Now connect that idea to the exact visible evidence. COURSE-SOURCE RECONSTRUCTION · PAGE 33 Categories of machine learning symbolic and non-symbolic supervised and unsupervised batch and online analogical, deep, reinforcement, and hybrid learning Exact PowerPoint export · including the online/RL comparison and the note that RL is important to robots. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 8: Incremental updating is a schedule; reinforcement learning is a decision problem

### Concept and boundary

Distinguish four dimensions that are often conflated: the feedback signal, update schedule, representation, and decision setting. Reinforcement learning is primarily a decision problem with delayed consequences, not merely a synonym for incremental updating.

### Read the visible model

Now connect that idea to the exact visible evidence. DIMENSION 1 Feedback labels · structure · reward DIMENSION 2 Update schedule batch · online · offline replay DIMENSION 3 Representation symbolic · statistical · neural · hybrid DIMENSION 4 Decision setting prediction · sequential control · planning One system can occupy one position on every dimension. An RL robot may update online, use a neural Q-function, and learn from delayed reward. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 9: An MDP names the pieces hidden inside the source’s words “agent,” “environment,” and “policy”

### Concept and boundary

The MDP gives formal meaning to the source terms agent, environment, and policy. States describe what the agent can distinguish, actions are choices, dynamics generate successors, rewards label consequences, and gamma weights later rewards. Learning estimates quantities that planning assumed were known.

### Read the visible model

Now connect that idea to the exact visible evidence. MARKOV DECISION PROCESS the tuple S, A, P, R, gamma The current state must contain the information needed to predict the next transition under an action. S States situations the agent can distinguish A Actions choices available to the agent P Dynamics P(s′|s,a), possibly unknown R Reward immediate scalar feedback gamma Discount weight on later rewards Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 10: A reward labels a consequence—not the action the agent should have taken

### Concept and boundary

Reward labels the consequence observed after an action; it does not retrospectively announce the uniquely correct action. Step through the interaction loop and keep the timing straight: state, action, next reward, next state, then update.

### Read the visible model

Now connect that idea to the exact visible evidence. Agent policy + learner aₜ leads to comes from rₜ₊₁ comes from sₜ₊₁ Environment dynamics + reward 1 2 3 4 5 OBSERVE sₜ The agent receives a representation of the current situation. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: Agent: policy + learner

Before selecting Agent: policy + learner, predict the result. Now activate it. Focus on the agent. The policy chooses an action from the represented state, and the learner later uses the resulting transition to revise an estimate.

### Interaction: aₜ leads to

Before selecting aₜ leads to, predict the result. Now activate it. Focus on the action arrow. The action is chosen before the next reward and next state are observed, so those consequences cannot label the action in advance.

### Interaction: comes from rₜ₊₁

Before selecting comes from rₜ₊₁, predict the result. Now activate it. Focus on the reward arrow. Reward arrives from the environment after the action and describes a consequence under the specified objective.

### Interaction: comes from sₜ₊₁

Before selecting comes from sₜ₊₁, predict the result. Now activate it. Focus on the next-state arrow. The successor state is part of the transition sample and determines where the next decision begins.

### Interaction: Environment: dynamics + reward

Before selecting Environment: dynamics + reward, predict the result. Now activate it. Focus on the environment. Its dynamics generate the next state and reward; the learner does not control those outcomes directly.

### Interaction: 1

Before selecting 1, predict the result. Now activate it. Step one observes the current state representation. If it omits relevant history, the learning problem may not be Markov.

### Interaction: 2

Before selecting 2, predict the result. Now activate it. Step two samples an action from the behavior policy. Exploration changes this data-collection choice.

### Interaction: 3

Before selecting 3, predict the result. Now activate it. Step three lets the environment generate the consequence of that action.

### Interaction: 4

Before selecting 4, predict the result. Now activate it. Step four observes the next reward and next state, completing one transition tuple.

### Interaction: 5

Before selecting 5, predict the result. Now activate it. Step five updates a value or policy estimate, then repeats from the successor state unless the episode terminated.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 11: Learning data are ordered transitions, not shuffled input–label pairs

### Concept and boundary

Reinforcement-learning data are ordered transitions. Shuffling them into independent input-label pairs can hide how actions influence later states and rewards. Episodes, terminal states, and continuing tasks determine how returns and updates should be interpreted.

### Read the visible model

Now connect that idea to the exact visible evidence. s₀ lobby leads to a₀ go up leads to r₁ −1 leads to s₁ floor 2 leads to a₁ serve call leads to r₂ +5 leads to s₂ terminal TRAJECTORY s₀,a₀,r₁,s₁,… One ordered sequence of interaction. EPISODE start leads to terminal A finite trajectory with a natural ending. CONTINUING TASK Elevator control may have no terminal state; discounting or an average-reward objective can keep the return well-defined. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 12: Return converts a stream of future rewards into one learning target

### Concept and boundary

Return converts a stream of rewards into a scalar target. Gamma controls the influence of delay, but it also interacts with task horizon and termination. State whether the task is episodic or continuing before treating the return formula as complete.

### Read the visible model

Now connect that idea to the exact visible evidence. DISCOUNTED RETURN FROM TIME T Gₜ = rₜ₊₁ + gamma rₜ₊₂ + gamma ²rₜ₊₃ + ··· gamma ∈ [0,1] controls how strongly delayed rewards influence the present. gamma = 0 Only the immediate reward matters. 0 < gamma < 1 Later rewards count, but with diminishing weight. gamma = 1 All rewards count equally; use safely for finite episodes. OBJECTIVE A policy is evaluated by expected return, because trajectories and rewards may be stochastic. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 13: The same reward sequence supports different preferences as γ changes

### Concept and boundary

Use the same reward sequence with several gamma values. A myopic setting favors immediate reward, while a larger gamma preserves more delayed benefit. The arithmetic is a policy preference encoded by the objective, not a neutral fact about what ought to matter.

### Read the visible model

Now connect that idea to the exact visible evidence. TRAJECTORY REWARDS t −1 step cost leads to t+1 0 move leads to t+2 +10 goal CHOOSE Γ 0.0 0.5 0.9 1.0 Gₜ = −1 + 0.9(0) + 0.9²(10) Gₜ = 7.10 Smaller gamma values place less weight on the delayed goal reward. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: 0.0

Before selecting 0.0, predict the result. Now activate it. With gamma zero, the delayed goal is ignored and the return is only the immediate step cost: minus one.

### Interaction: 0.5

Before selecting 0.5, predict the result. Now activate it. With gamma one half, the goal two steps away contributes two point five, so the return is one point five.

### Interaction: 0.9

Before selecting 0.9, predict the result. Now activate it. With gamma point nine, the displayed return is seven point one. Most of the delayed goal reward remains.

### Interaction: 1.0

Before selecting 1.0, predict the result. Now activate it. With gamma one, the rewards are undiscounted and the return is nine. This encodes a different time preference, not greater factual certainty.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 14: A policy chooses; value functions predict long-run consequences

### Concept and boundary

A policy chooses actions; state and action values predict expected long-run return. Q learning will store action values because control requires comparing choices at the same state. Every estimate is indexed by a representation, so omitted state can make two genuinely different situations look identical.

### Read the visible model

Now connect that idea to the exact visible evidence. POLICY pi (a|s) A distribution over actions in state s. What will the agent do? STATE VALUE V pi (s)=E pi [Gₜ|sₜ=s] Expected return from a state under policy pi . How good is this situation? ACTION VALUE Q pi (s,a)=E pi [Gₜ|sₜ=s,aₜ=a] Expected return after taking action a, then following pi . How good is this choice here? Control idea If Q is accurate, choose an action with the largest Q(s,a)—while retaining enough exploration to improve the estimates. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 15: A bandit reveals the exploration–exploitation conflict without state transitions

### Concept and boundary

A multi-armed bandit isolates exploration from state transitions. With no evidence, a greedy choice has no basis. Pull the arms, update their sample averages, and observe why exploration has informational value even when it sacrifices immediate expected reward.

### Read the visible model

Now connect that idea to the exact visible evidence. THREE UNKNOWN REWARD SOURCES Which arm should receive the next trial? Pulling an arm both earns a reward and produces evidence about that action. Reset evidence Arm A Q estimate = ? 0 reward / 0 pulls Arm B Q estimate = ? 0 reward / 0 pulls Arm C Q estimate = ? 0 reward / 0 pulls Start with uncertainty. A greedy policy has no evidence yet. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: Reset evidence

Before selecting Reset evidence, predict the result. Now activate it. Reset the evidence. All pull counts return to zero and no arm has an empirical advantage, so a greedy tie-break is arbitrary.

### Interaction: Arm A: Q estimate unknown; zero reward; zero pulls

Before selecting Arm A: Q estimate unknown; zero reward; zero pulls, predict the result. Now activate it. Pull Arm A. Record its reward, increment its count, and update its Q estimate to the sample mean of rewards observed from A.

### Interaction: Arm B: Q estimate unknown; zero reward; zero pulls

Before selecting Arm B: Q estimate unknown; zero reward; zero pulls, predict the result. Now activate it. Pull Arm B. Its immediate reward both affects return and supplies evidence that changes B's estimated value.

### Interaction: Arm C: Q estimate unknown; zero reward; zero pulls

Before selecting Arm C: Q estimate unknown; zero reward; zero pulls, predict the result. Now activate it. Pull Arm C. Compare sample means and pull counts; a high estimate based on one pull is more uncertain than the same estimate after many pulls.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 16: Exploit the current estimate most of the time; explore with probability ε

### Concept and boundary

Epsilon-greedy behavior exploits the current best estimate most of the time and explores with probability epsilon. Compare zero, point one, and point five. Exploration does not mean uniformly random forever; it is a controlled data-collection policy whose cost and safety must be justified.

### Read the visible model

Now connect that idea to the exact visible evidence. epsilon = 0 epsilon = 0.1 epsilon = 0.5 MOSTLY EXPLOIT 20 illustrative decisions About 10% of decisions explore; all actions retain some chance of being sampled. Ε-GREEDY RULE With probability 1− epsilon choose an action with maximal Q(s,a); with probability epsilon choose an action at random. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: epsilon = 0

Before selecting epsilon = 0, predict the result. Now activate it. With epsilon zero, the behavior is purely greedy after tie-breaking. It can stop collecting evidence about alternatives and preserve an early mistake.

### Interaction: epsilon = 0.1

Before selecting epsilon = 0.1, predict the result. Now activate it. With epsilon point one, roughly two of the twenty illustrative decisions explore while the remainder exploit the current estimate.

### Interaction: epsilon = 0.5

Before selecting epsilon = 0.5, predict the result. Now activate it. With epsilon point five, exploration is much more frequent. Coverage improves, but immediate reward and possible safety cost can worsen.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 17: Q-learning moves one stored value toward a bootstrapped one-step target

### Concept and boundary

Q learning moves one stored action value toward a bootstrapped target. The target is immediate reward plus discounted maximum next-state action value. Alpha controls how far the current estimate moves, and gamma controls how much of the next estimate enters the target.

### Read the visible model

Now connect that idea to the exact visible evidence. OFF-POLICY TEMPORAL-DIFFERENCE CONTROL Q(s,a) comes from Q(s,a) + α[r + gamma maxₐ′Q(s′,a′) − Q(s,a)] α learning rate how far to move toward this sample target r reward immediate feedback from the transition gamma discount weight on the successor estimate max Q′ bootstrap estimated value of the greedy next action SOURCE BOUNDARY The historical speaker note contains only the term “Q-Learning.” This equation, its terms, and the derivation are textbook supplements. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 18: Compute target, error, and update as three separate quantities

### Concept and boundary

Keep target, temporal-difference error, and update separate. First compute the target, then subtract the current estimate to obtain the error, then multiply by alpha and add the correction. Step through the controls and name each number before combining them.

### Read the visible model

Now connect that idea to the exact visible evidence. TRANSITION SAMPLE (s, a, r, s′) Q(s,a) 2.00 r −1 gamma 0.9 max Q(s′,·) 5.00 α 0.2 STEP 1 OF 4 · CURRENT ESTIMATE Q(s,a) = 2.00 This is the value stored before the transition. Previous Next Reset Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: Previous

Before selecting Previous, predict the result. Now activate it. Move to the previous calculation stage so target, temporal-difference error, and parameter update remain separate quantities.

### Interaction: Next

Before selecting Next, predict the result. Now activate it. Advance one stage. Compute the target first, then the error, and only then apply alpha to move the stored Q value.

### Interaction: Reset

Before selecting Reset, predict the result. Now activate it. Reset to the original transition and Q value. Recompute the update without carrying over a value from the previous walkthrough.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 19: Repeated transitions propagate goal reward backward through a Q-table

### Concept and boundary

In the tabular gridworld, reward information propagates backward through experienced transitions. Run a few episodes before jumping ahead. This makes clear that Q learning updates only visited state-action pairs and depends on exploration to cover useful alternatives.

### Read the visible model

Now connect that idea to the exact visible evidence. 3 times 3 CLASSROOM ENVIRONMENT Start −10 +10 1 2 3 4 BEFORE EXPERIENCE Q(Start, ·) direction 0.0 leads to 0.0 direction 0.0 comes from 0.0 All four action values at the start are tied. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: 1

Before selecting 1, predict the result. Now activate it. Reveal transition one. Only the visited state-action entry changes; the goal reward has not yet propagated to the start.

### Interaction: 2

Before selecting 2, predict the result. Now activate it. Reveal transition two. The new target uses the best available successor estimate and moves reward information one step backward.

### Interaction: 3

Before selecting 3, predict the result. Now activate it. Reveal transition three. Compare the updated entry with untouched alternatives and connect the difference to sampled experience.

### Interaction: 4

Before selecting 4, predict the result. Now activate it. Reveal transition four. Reward information reaches an earlier decision, illustrating why repeated visits and exploration determine coverage.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 20: Q-learning alternates behavior, observation, and one local table update

### Concept and boundary

The tabular algorithm alternates behavior, observation, and one local update. The behavior policy chooses the action; the environment returns reward and successor state; the target uses the greedy next action value. Terminal handling must remove nonexistent future value.

### Read the visible model

Now connect that idea to the exact visible evidence. Initialize Q(s,a), usually to zero or optimistic values. Observe the current state s. Select a using a behavior policy such as epsilon -greedy. Execute a; observe reward r and successor s′. Update Q(s,a) toward r + gamma maxₐ′Q(s′,a′). Set s comes from s′; repeat until terminal, then start another episode. SEPARATE TWO POLICIES Behavior explores; target is greedy Q-learning is off-policy because the update evaluates the greedy target even when the sampled behavior action was exploratory. TABULAR BOUNDARY One table entry per state-action pair is feasible only when the discrete space is small enough to enumerate. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 21: The next-action term determines whether learning is off-policy or on-policy

### Concept and boundary

Q learning is off-policy because its target uses the greedy next action even when exploratory behavior selected something else. SARSA is on-policy because its target uses the actual next action. Compare the equations and explain how the target changes, not just the acronym.

### Read the visible model

Now connect that idea to the exact visible evidence. Q-learning SARSA OFF-POLICY r + gamma maxₐ′ Q(s′,a′) Target asks: What would the greedy policy do next? LEARNING CONSEQUENCE Backs up the best estimated next action even if exploration selects another action. Both are one-step temporal-difference control methods. The only symbol that changes in the target is enough to change which policy is evaluated. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: Q-learning

Before selecting Q-learning, predict the result. Now activate it. Select Q-learning. Its target uses the greedy maximum at the next state even when the behavior policy took an exploratory action, so the update is off-policy.

### Interaction: SARSA

Before selecting SARSA, predict the result. Now activate it. Select SARSA. Its target uses the actual next action sampled by the behavior policy, so the update evaluates that policy and is on-policy.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 22: A high training reward can coexist with poor, unsafe, or brittle behavior

### Concept and boundary

High training reward can coexist with sample inefficiency, reward hacking, instability, unsafe exploration, distribution shift, or weak evaluation. A deployment claim needs held-out scenarios, multiple seeds, uncertainty, baselines, safety constraints, and failure analysis.

### Read the visible model

Now connect that idea to the exact visible evidence. 01 Sample cost Interaction can be slow, expensive, or dangerous. 02 Reward hacking The agent exploits the measured proxy rather than the intended goal. 03 Instability Bootstrapping, off-policy data, and function approximation can interact badly. 04 Distribution shift A policy learned in simulation may fail under changed dynamics. 05 Exploration risk Trying unknown actions may be unacceptable in real systems. 06 Evaluation Use held-out scenarios, baselines, variance, and safety constraints—not one best run. Design question For elevator control, what measurable reward could reduce waiting without producing unsafe or unfair service? Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 23: Use the formal objects—not intuition alone—to justify each answer

### Concept and boundary

Practice by identifying the formal object required by each question. Compute a return from rewards and gamma, compute a Q update from current value and target, distinguish policy from value, and diagnose a claim whose evidence does not support deployment.

### Read the visible model

Now connect that idea to the exact visible evidence. Return Update Policy Diagnosis PAIR PRACTICE · CASE 1 Rewards are 2, 0, 8 and gamma =0.5. Compute G₀. Show the exponent attached to each delayed reward. Reveal solution Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: Return

Before selecting Return, predict the result. Now activate it. Choose the return case and attach gamma exponents to delayed rewards before adding them.

### Interaction: Update

Before selecting Update, predict the result. Now activate it. Choose the update case and keep current Q, target, temporal-difference error, and alpha-weighted correction on separate lines.

### Interaction: Policy

Before selecting Policy, predict the result. Now activate it. Choose the policy case and distinguish the behavior policy that generated data from the target policy represented by the update.

### Interaction: Diagnosis

Before selecting Diagnosis, predict the result. Now activate it. Choose the diagnosis case and identify what training return fails to establish about robustness, safety, and transfer.

### Interaction: Reveal solution

Before selecting Reveal solution, predict the result. Now activate it. Reveal the worked solution only after committing to the four formal objects. Compare each line with the definition it instantiates.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 24: Which statement correctly distinguishes reinforcement learning from online supervised learning?

### Concept and boundary

The assessment asks what distinguishes reinforcement learning from online supervised learning. The decisive property is that actions influence future data and rewards may be delayed. Online supervised learning can update continuously while still receiving externally supplied labeled examples.

### Read the visible model

Now connect that idea to the exact visible evidence. CHECK FOR UNDERSTANDING Choose the strongest distinction. Commit to an answer, then defend the representation or search rule. A RL always updates online; supervised learning always trains in batches. B RL actions affect future data and rewards may be delayed; online supervised learning can update from arriving labeled examples without controlling the data source. C RL has no model, while supervised learning always has an explicit model. D The two methods differ only in vocabulary. SUBMIT BEFORE LEAVING Write the Q-learning target for one transition. Compute the update when Q=0, r=2, gamma =0.5, max Q′=4, α=0.25. Name one risk that reward alone may fail to represent. Check value: new Q = 1.00 Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: A: RL always updates online; supervised learning always trains in batches.

Before selecting A: RL always updates online; supervised learning always trains in batches., predict the result. Now activate it. Option A is false. Reinforcement learning can train from an offline replay dataset, and supervised learning can update online as labels arrive.

### Interaction: B: RL actions affect future data and rewards may be delayed; online supervised learning can update from arriving labeled examples without controlling the data source.

Before selecting B: RL actions affect future data and rewards may be delayed; online supervised learning can update from arriving labeled examples without controlling the data source., predict the result. Now activate it. Option B is correct. Reinforcement-learning actions influence future data and consequences can be delayed; online supervised learning need not control the source of its labeled examples.

### Interaction: C: RL has no model, while supervised learning always has an explicit model.

Before selecting C: RL has no model, while supervised learning always has an explicit model., predict the result. Now activate it. Option C is false. Reinforcement learning may use an explicit learned or known model, while supervised learning need not expose one as a separate object.

### Interaction: D: The two methods differ only in vocabulary.

Before selecting D: The two methods differ only in vocabulary., predict the result. Now activate it. Option D is false. The distinction changes the data-generating process, objective, credit assignment, exploration problem, and evaluation evidence.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.

## Slide 25: Connect the course references to reinforcement-learning control

### Concept and boundary

Connect the lesson to the course sources and carry forward an explicit evidence standard. A complete reinforcement-learning explanation names the interaction loop, return, Q update, policy-improvement step, and the assumptions or risks that limit the claim.

### Read the visible model

Now connect that idea to the exact visible evidence. COURSE-SOURCE RECONSTRUCTION · PAGE 36 Course references Luger, Artificial Intelligence, 6th ed. Russell and Norvig, Artificial Intelligence: A Modern Approach, 3rd ed. Course slides and speaker-note applications Exact PowerPoint export · source misspellings remain visible as historical evidence. CORRECTED COURSE READING LIST George F. Luger, Artificial Intelligence: Structures and Strategies for Complex Problem Solving, 6th ed., Chapters 10 and 12. Tom M. Mitchell, Machine Learning, Chapter 13. Stuart Russell and Peter Norvig, Artificial Intelligence: A Modern Approach, 3rd ed., Chapter 21. EXIT SYNTHESIS In one paragraph, connect interaction leads to return leads to Q update leads to policy improvement, and identify where exploration enters. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.
