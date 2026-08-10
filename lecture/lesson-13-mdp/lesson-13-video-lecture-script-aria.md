# Lesson 13 video lecture script

- Route: /lessons/13
- Voice: Microsoft Aria Neural (en-US-AriaNeural)
- Speaking rate: 0.94x (-6%)
- Slides: 25
- Narration words: 5,825
- Captions: burned in at the bottom of the final video

## Slide 1: Markov Decision Processes, Policies, and Value Iteration

### Concept and boundary

This lesson changes the question from what will happen to what an agent should do. We begin with Markov prediction, add actions and rewards, and end with value iteration. Keep model, evaluation, optimization, and audit separate: an algorithm can solve the stated model exactly while the model still omits a fact that matters in the world.

### Read the visible model

Now connect that idea to the exact visible evidence. DRIVING PROBLEM Prediction tells us what may happen. An MDP asks what we should do. We begin with Markov-chain foundations, clarify two claims in context, and then add the decision layer from the course textbooks. Model state, action, transition, reward, discount Evaluate policy, return, value, Bellman expectation Optimize Bellman optimality, value iteration, policy extraction Audit state sufficiency, reward design, model error Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 2: Sequence models connect observations across time or space

### Concept and boundary

A sequence model links observations that arrive in an order. Speech, robot localization, attention, and medical monitoring all have state that changes through time or position. The key modeling task is deciding what the state must remember so that the next-step distribution no longer needs the entire raw history.

### Read the visible model

Now connect that idea to the exact visible evidence. ORIGINAL KNOWLEDGE POINT Reason about a sequence of observations Introduce time—or space—because the current observation alone may not identify the underlying state. Speech recognition State: phoneme or word position Observation: acoustic frames Robot localization State: location and heading Observation: sensor readings User attention State: attention state Observation: clicks and gaze Medical monitoring State: patient condition Observation: vital signs RETRIEVAL PROMPT For robot localization, what must the state preserve so the next-step distribution no longer needs the entire path history? Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 3: A Markov model starts with state, an initial distribution, and transitions

### Concept and boundary

A Markov model needs three ingredients before any prediction is possible: a state space, an initial distribution, and transition dynamics. State says what can be true now, the initial distribution says where uncertainty begins, and the transition model says how probability mass moves from one step to the next.

### Read the visible model

Now connect that idea to the exact visible evidence. STATE SEQUENCE X₁ leads to X₂ leads to X₃ leads to X₄ leads to … P(X₁) P(Xₜ | Xₜ₋₁) State Xₜ The value of X at time t. Initial distribution P(X₁) Uncertainty before the sequence begins. Transition dynamics P(Xₜ|Xₜ₋₁) How the state evolves one step. TERMINOLOGY CORRECTION Reusing the same transition probabilities at every time is a time-homogeneous transition assumption. It is not required by every Markov model and is not the same as a stationary state distribution. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 4: The Markov assumption shortens the chain-rule history

### Concept and boundary

The Markov assumption is a conditional-independence claim, not a claim that the past never mattered. Its role is to summarize every relevant effect of the past inside the present state. That shortens the chain rule from a growing history to repeated local factors, which makes representation and computation tractable.

### Read the visible model

Now connect that idea to the exact visible evidence. X₁ leads to X₂ leads to X₃ leads to X₄ leads to … 1 · CHAIN RULE IDENTITY P(x₁:ₜ) = P(x₁) ∏i=2T P(xᵢ | x₁:ᵢ₋₁) Valid for every joint distribution. 2 · FIRST-ORDER ASSUMPTION Xᵢ ⟂ X₁:ᵢ₋₂ | Xᵢ₋₁ The present state screens off earlier history. 3 · MARKOV FACTORIZATION P(x₁:ₜ) = P(x₁) ∏i=2T P(xᵢ | xᵢ₋₁) A modeling assumption makes the factors local. IN-CLASS CHECK Which line is a probability identity, and which line introduces the Markov modeling assumption? Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 5: Given the present, earlier history adds no information about the next state

### Concept and boundary

Read this independence statement carefully. Once the present state is known, earlier states should add no information about the next state. If an omitted variable such as battery level or traffic phase still changes the next-step probabilities, then the chosen state is not Markov and must be repaired.

### Read the visible model

Now connect that idea to the exact visible evidence. EXPLICIT ASSUMPTION Xₜ ⟂ X₁:ₜ₋₂ | Xₜ₋₁ Each state needs only the previous state. IMPLIED PROPERTY past ⟂ future | present Knowing the present blocks information flow along the chain. PROOF IDEA factor, cancel, normalize For example, P(X₁|X₂,X₃,X₄)=P(X₁|X₂). CORRECTION TO THE ORIGINAL WORDING Past and future are conditionally independent given the present; they are not “independent of the present.” Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 6: An unrolled first-order chain is a Bayesian network

### Concept and boundary

An unrolled first-order Markov chain is also a Bayesian network. Each time step is a node, and each local conditional distribution is a factor. This bridge matters because the same graphical-model reasoning from Lesson twelve now explains a sequence: d-separation, factorization, and conditional independence still do the work.

### Read the visible model

Now connect that idea to the exact visible evidence. X₁ leads to X₂ leads to X₃ leads to X₄ leads to … GRAPH FORM A growable Bayesian network Truncate at horizon T to obtain a finite directed acyclic graph. PROBABILITY FORM Multiply local factors P(x₁)P(x₂|x₁)…P(xₜ|xₜ₋₁). INDEPENDENCE FORM Condition on an intermediate state X₁ and X₄ may be dependent marginally, but are independent given X₂ or X₃. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 7: One transition model has three equivalent representations

### Concept and boundary

The weather example shows one transition model in three equivalent forms: a conditional-probability table, a directed state graph, and a matrix. They must agree row by row. Each representation supports a different task, so translating among them is a useful error-detection skill rather than decorative notation.

### Read the visible model

Now connect that idea to the exact visible evidence. CPT current next P sun sun .9 sun rain .1 rain sun .3 rain rain .7 STATE GRAPH sun .9 loop · .1 leads to rain rain .7 loop · .3 leads to sun MATRIX T = [ .9 .1 .3 .7 ] Rows: current state; columns: next state. REPRESENTATION CHECK Map one CPT row to the matching outgoing graph edges and matrix row. Each row must sum to 1. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 8: From all sun, one step produces 0.9 sun and 0.1 rain

### Concept and boundary

Start with certainty about sun. One transition step selects the sun row of the matrix, producing point nine probability of sun and point one probability of rain. The arithmetic is simple, but the interpretation is important: prediction moves a distribution, not a single guaranteed weather label.

### Read the visible model

Now connect that idea to the exact visible evidence. GIVEN P₁(sun)=1.0 · P₁(rain)=0.0 LAW OF TOTAL PROBABILITY P₂(sun) = P(sun|sun)P₁(sun) + P(sun|rain)P₁(rain) = 0.9(1.0) + 0.3(0.0) = 0.9 P₂(rain) = 0.1(1.0) + 0.7(0.0) = 0.1 PREDICT BEFORE REVEALING Why must both next-state probabilities add to 1? Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 9: Forward prediction repeatedly applies the same transition operator

### Concept and boundary

Forward prediction repeats the same transition operator. Multiply the current distribution by the transition matrix to obtain the next distribution, then feed that result into the following step. Watch probability mass spread and stabilize while remembering that the result remains conditional on the modeled dynamics.

### Read the visible model

Now connect that idea to the exact visible evidence. FORWARD PREDICTION Pₜ(xₜ)=Σxₜ₋₁P(xₜ|xₜ₋₁)Pₜ₋₁(xₜ₋₁) Prediction only: no observation update. initial belief P(X₁) P(X₂) P(X₃) P(X₄) limit All sun (1.000, 0.000) (0.900, 0.100) (0.840, 0.160) (0.804, 0.196) (.750, .250) All rain (0.000, 1.000) (0.300, 0.700) (0.480, 0.520) (0.588, 0.412) (.750, .250) Any p (p, 1−p) repeated transition updates (.750, .250) Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 10: A stationary distribution is a fixed point—not a universal convergence promise

### Concept and boundary

A stationary distribution is a fixed point of the transition operator. Starting from that distribution leaves it unchanged after one step. Do not turn this definition into a universal convergence promise: periodic, reducible, or otherwise poorly behaved chains may fail to converge uniquely from every starting state.

### Read the visible model

Now connect that idea to the exact visible evidence. DEFINITION A stationary distribution pi is unchanged by one transition pi = pi T, or pi (x′)=ΣₓP(x′|x) pi (x). WEATHER EQUATIONS pi (sun)=.9 pi (sun)+.3 pi (rain) pi (rain)=.1 pi (sun)+.7 pi (rain) pi (sun)+ pi (rain)=1 SOLVE pi (sun)=¾ pi (rain)=¼ CONVERGENCE CONDITION This chain converges because it is finite, irreducible, and aperiodic. A stationary distribution alone does not guarantee convergence from every start. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 11: A Markov chain predicts; an MDP adds choices and consequences

### Concept and boundary

A Markov chain predicts what state comes next under fixed dynamics. A Markov decision process adds an action choice, and actions change the transition distribution and reward consequences. That is the conceptual boundary between passive prediction and control.

### Read the visible model

Now connect that idea to the exact visible evidence. MARKOV CHAIN Current state leads to random next state P(s′|s) No decision variable Models how a process evolves Question: what will happen? + DECISION LAYER Choose action a in state s P(s′|s,a) and R(s,a,s′) Policy selects actions Rewards encode the objective Question: what should the agent do? Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 12: An MDP is the tuple ⟨S, A, P, R, γ⟩

### Concept and boundary

The MDP tuple contains states, actions, transition probabilities, rewards, and a discount factor. Each symbol answers a different modeling question. A complete solution requires all five, and each is an assumption that can be challenged with evidence.

### Read the visible model

Now connect that idea to the exact visible evidence. S States Information the model treats as sufficient for predicting the next transition and reward. A Actions Choices available to the agent; A(s) may depend on the state. P Transitions P(s′|s,a), a probability distribution over next states. R Reward R(s,a,s′), the immediate scalar signal used by the objective. gamma Discount 0≤ gamma <1 for continuing discounted tasks; weights later rewards. MARKOV REQUIREMENT Given the modeled state and current action, the distribution of next state and reward must not require additional history. If it does, the state representation is insufficient. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 13: Actions change transition distributions; they do not guarantee outcomes

### Concept and boundary

An action does not normally determine the next state. It selects a probability distribution over next states. In the gridworld, moving right can reach the intended cell, slip sideways, or leave the agent in place. Planning must average over those outcomes rather than pretending the most likely one is certain.

### Read the visible model

Now connect that idea to the exact visible evidence. EXAMPLE · MOVE RIGHT P(s′|s,Right) 0.80 move right 0.10 slip up 0.10 slip down Walls redirect an attempted move to “stay” in this model. 0.00 S00 0.00 S01 1.00 TERMINAL 0.00 S10 WALL -1.00 TERMINAL 0.00 S20 0.00 S21 0.00 S22 PROBABILITY AUDIT For every state-action pair, Σs′P(s′|s,a)=1. Deterministic dynamics are the special case with one successor at probability 1. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 14: Reward is the formal objective—not a label for what humans value

### Concept and boundary

Reward is the formal objective supplied to the agent. It is not automatically the same as human value, safety, or long-term usefulness. Reward design is therefore both mathematical and socio-technical: specify what is measured, stress-test shortcuts, constrain unacceptable behavior, and monitor for gaming.

### Read the visible model

Now connect that idea to the exact visible evidence. GRIDWORLD REWARD MODEL +1 goal · −1 hazard · −0.04 per nonterminal step The living cost favors shorter paths, but it can also change risk preference. A more negative cost may drive the agent near hazards; a positive living reward may encourage endless wandering. Specify Whose outcome is represented? Stress-test Can the objective be gamed? Constrain Which harms are unacceptable regardless of reward? Monitor Does deployment differ from the modeled setting? Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 15: Return adds immediate and discounted future rewards

### Concept and boundary

Return combines immediate reward with discounted future rewards. Gamma controls how strongly later consequences influence the present decision. Use the controls to compare the same reward stream under different gamma values, then explain the behavioral preference rather than reporting only a number.

### Read the visible model

Now connect that idea to the exact visible evidence. gamma = 0.0 gamma = 0.5 gamma = 0.9 gamma = 1.0 T + 0 r = 5 0.90 times 5 = 5.00 T + 1 r = 0 0.91 times 0 = 0.00 T + 2 r = 8 0.92 times 8 = 6.48 T + 3 r = 2 0.93 times 2 = 1.46 DISCOUNTED RETURN Gt = 12.94 gamma controls how quickly later rewards lose weight; it does not express uncertainty and it does not repair a poorly chosen reward. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: gamma = 0.0

Before selecting gamma = 0.0, predict the result. Now activate it. With gamma zero, every delayed term vanishes, so the return is only the immediate reward: five.

### Interaction: gamma = 0.5

Before selecting gamma = 0.5, predict the result. Now activate it. With gamma one half, the return is five plus two plus one quarter, or seven point two five. The reward two steps away is heavily discounted.

### Interaction: gamma = 0.9

Before selecting gamma = 0.9, predict the result. Now activate it. With gamma point nine, the displayed return is twelve point nine four after rounding. Most of the delayed reward still matters.

### Interaction: gamma = 1.0

Before selecting gamma = 1.0, predict the result. Now activate it. With gamma one, no reward is discounted, so the return is five plus zero plus eight plus two, or fifteen.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 16: A policy chooses; a value function predicts long-run return

### Concept and boundary

A policy maps states to action distributions. A state value predicts expected return from a state under a policy, while an action value conditions on taking one action first. These are predictions about long-run consequences under explicit dynamics and reward assumptions.

### Read the visible model

Now connect that idea to the exact visible evidence. POLICY pi (a|s) A distribution over actions in each state. Deterministic pi (s) is a special case. Question answered: What will the agent choose? STATE VALUE V pi (s)=E pi [Gt|St=s] Expected return from state s when policy pi is followed. Question answered: How good is this state under pi ? ACTION VALUE Q pi (s,a)=E pi [Gt|s,a] Expected return after taking a now and following pi afterward. Question answered: How good is this choice? Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 17: Bellman expectation decomposes value into one step plus the remainder

### Concept and boundary

The Bellman expectation equation decomposes value into immediate reward plus discounted expected successor value. Reveal the equation one line at a time and identify the policy average, transition average, reward term, and recursive value term. The recursion is what lets local backups represent long futures.

### Read the visible model

Now connect that idea to the exact visible evidence. POLICY Π AT STATE S pi (right|s)=0.75 · pi (left|s)=0.25 Immediate reward is −0.1 and gamma =0.9. “Right” reaches a state valued 4 with probability 0.8 and a state valued 2 with probability 0.2. “Left” reaches a state valued 1. Reveal next line Reveal all 1 Predict this line Name the expectation before revealing it. 2 Predict this line Name the expectation before revealing it. 3 Predict this line Name the expectation before revealing it. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: Reveal next line

Before selecting Reveal next line, predict the result. Now activate it. Reveal the next algebra line only. Pause to identify whether this line averages over policy choices, transition outcomes, or both before continuing.

### Interaction: Reveal all

Before selecting Reveal all, predict the result. Now activate it. Reveal the full derivation. Read it from the inside out: successor values are averaged by transition probability, action values are averaged by the policy, and immediate reward is added before discounting the remainder.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 18: Policy evaluation averages; optimal control maximizes

### Concept and boundary

Policy evaluation averages over the actions chosen by a fixed policy. Optimal control replaces that policy-weighted action average with a maximum over actions. The immediate reward remains; only the decision rule changes. This distinction prevents a common error of maximizing the wrong part of the equation.

### Read the visible model

Now connect that idea to the exact visible evidence. BELLMAN EXPECTATION V pi (s)=Σa pi (a|s)Σs′P(s′|s,a)[R+ gamma V pi (s′)] Evaluate a specified policy—even if it sometimes chooses a weaker action. BELLMAN OPTIMALITY V*(s)=maxaΣs′P(s′|s,a)[R+ gamma V*(s′)] Choose the action whose expected one-step backup is largest. CHECK FOR UNDERSTANDING Which change turns Bellman expectation into Bellman optimality? A Replace the successor-state expectation with a maximum B Replace the policy-weighted action average with a maximum C Remove the immediate reward Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: A: Replace the successor-state expectation with a maximum

Before selecting A: Replace the successor-state expectation with a maximum, predict the result. Now activate it. Option A is incorrect. Bellman optimality still keeps the probability-weighted expectation over successor states because the action can have stochastic outcomes.

### Interaction: B: Replace the policy-weighted action average with a maximum

Before selecting B: Replace the policy-weighted action average with a maximum, predict the result. Now activate it. Option B is correct. Replace the policy-weighted average over available actions with a maximum over actions; keep reward and successor-state expectation intact.

### Interaction: C: Remove the immediate reward

Before selecting C: Remove the immediate reward, predict the result. Now activate it. Option C is incorrect. Immediate reward remains part of both Bellman expectation and Bellman optimality backups.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 19: A Bellman optimality backup compares every action at one state

### Concept and boundary

A Bellman optimality backup evaluates every available action at one state. For each action, combine immediate reward with the probability-weighted value of successor states, then keep the largest action value. Use the directional controls to compare the candidates before selecting the winner.

### Read the visible model

Now connect that idea to the exact visible evidence. direction Up leads to Right direction Down comes from Left ONE DETERMINISTIC ACTION BACKUP Q(s,Right) = −0.04 + 0.9(0.7) = 0.59 Successor: bottom-right. CURRENT MAXIMUM Bellman optimality keeps the largest action backup. Here, Vnew(s)=max(0.32, 0.59, 0.32, 0.14)=0.59, so Right is greedy. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: direction Up

Before selecting direction Up, predict the result. Now activate it. Up produces an action backup of zero point three two, so it is not the greedy choice at this state.

### Interaction: leads to Right

Before selecting leads to Right, predict the result. Now activate it. Right produces zero point five nine, the largest of the four backups, so Bellman optimality selects Right.

### Interaction: direction Down

Before selecting direction Down, predict the result. Now activate it. Down also produces zero point three two. Equal backups are possible, but both remain below Right here.

### Interaction: comes from Left

Before selecting comes from Left, predict the result. Now activate it. Left produces zero point one four, the smallest candidate in this comparison.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 20: Value iteration applies Bellman optimality synchronously until change is small

### Concept and boundary

Value iteration applies Bellman optimality backups repeatedly and synchronously. After each sweep, measure the largest value change. Stop when that residual is small enough for the chosen tolerance, then extract a greedy policy with one-step lookahead.

### Read the visible model

Now connect that idea to the exact visible evidence. Initialize Choose V₀(s), often zero for nonterminals. Back up Vk+1(s) comes from maxaΣs′P(s′|s,a)[R+ gamma Vk(s′)]. Measure Δ comes from maxs|Vk+1(s)−Vk(s)|. Repeat Stop by a justified residual or iteration rule. Extract pi (s) comes from argmaxa one-step lookahead using final V. SYNCHRONOUS MEANS PREVIOUS SWEEP Every Vk+1(s) uses Vk, not values already updated during the same sweep. In-place variants can work, but they are a different update schedule. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 21: Watch value information move through a 3×3 gridworld

### Concept and boundary

The gridworld makes value propagation visible. A goal reward first affects nearby states and then travels backward through repeated sweeps. Run one sweep before jumping to convergence so you can see why dynamic programming is repeated local computation rather than a mysterious global solve.

### Read the visible model

Now connect that idea to the exact visible evidence. INTERACTIVE SYNCHRONOUS VALUE ITERATION Sweep 0 · max Δ = 0.0000 Deterministic moves, wall collision means “stay,” living reward −0.04, gamma =0.9, terminal values +1 and −1. Every nonterminal cell uses only values from the previous sweep. Previous Run one sweep Run to 30 Show greedy policy OBSERVE THE WAVE Positive terminal value propagates left and downward one sweep at a time. Values are not rewards; they summarize expected discounted future reward under the current greedy backup. 0.00 S00 0.00 S01 1.00 TERMINAL 0.00 S10 WALL -1.00 TERMINAL 0.00 S20 0.00 S21 0.00 S22 Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: Previous

Before selecting Previous, predict the result. Now activate it. Move back one sweep and compare the values. This exposes that each synchronous update used only the previous sweep rather than partially updated values.

### Interaction: Run one sweep

Before selecting Run one sweep, predict the result. Now activate it. Run exactly one Bellman sweep. The positive terminal's influence moves only one layer farther through the grid, making value propagation visible.

### Interaction: Run to 30

Before selecting Run to 30, predict the result. Now activate it. Run to sweep thirty. The maximum residual becomes small and the displayed values are close to a fixed point for this stated gridworld model.

### Interaction: Show greedy policy

Before selecting Show greedy policy, predict the result. Now activate it. Show the greedy policy derived from one-step lookahead. The arrows are consequences of the converged values, transition rules, reward, and tie handling.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 22: A small Bellman residual is solver evidence, not real-world validation

### Concept and boundary

A small Bellman residual is evidence about the numerical solver. It does not validate the reward function, transition model, state representation, or deployment setting. Keep solver convergence and real-world validity as separate claims with separate tests.

### Read the visible model

Now connect that idea to the exact visible evidence. DISCOUNTED FINITE MDP The Bellman optimality operator is a gamma -contraction With 0≤ gamma <1 and bounded rewards, repeated optimality backups converge to a unique V*. The residual Δ measures numerical change under the model. Iteration rule Stop after a fixed compute budget; simple, but no direct accuracy guarantee. Residual rule Stop when max state change is below a chosen tolerance. Policy stability Monitor whether greedy actions stop changing; ties need care. DO NOT CONFLATE ERRORS Small iteration error does not imply small transition-model error, reward-specification error, or deployment risk. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 23: Once values stabilize, one-step lookahead yields a greedy policy

### Concept and boundary

Once values stabilize, extract a policy by taking the action with the largest one-step lookahead value at each state. The policy is a consequence of the model and values; it is not an additional source of truth. Ties and near-ties should be reported rather than hidden.

### Read the visible model

Now connect that idea to the exact visible evidence. 0.73 leads to 0.86 leads to 1.00 TERMINAL 0.62 direction WALL -1.00 TERMINAL 0.52 direction 0.43 comes from 0.34 comes from SELECTED STATE · 2-0 Extract pi *(s) by taking argmaxa Q(s,a) direction Up to 1-0 0.519 direction Down to 2-0 0.427 comes from Left to 2-0 0.427 leads to Right to 2-1 0.344 TIE POLICY If multiple actions share the maximum, a deterministic policy may choose any maximizer; a stochastic policy may distribute probability among them. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: 0.73 leads to

Before selecting 0.73 leads to, predict the result. Now activate it. Select the state valued zero point seven three and inspect the one-step action comparisons that support its rightward greedy arrow.

### Interaction: 0.86 leads to

Before selecting 0.86 leads to, predict the result. Now activate it. Select the state valued zero point eight six. Its rightward action moves toward the positive terminal and has the largest lookahead value.

### Interaction: 0.62 direction

Before selecting 0.62 direction, predict the result. Now activate it. Select the state valued zero point six two. Its upward action avoids the negative terminal while moving toward higher-value states.

### Interaction: 0.52 direction

Before selecting 0.52 direction, predict the result. Now activate it. Select the state valued zero point five two. The upward action is greedy under the displayed deterministic dynamics and reward.

### Interaction: 0.43 comes from

Before selecting 0.43 comes from, predict the result. Now activate it. Select the state valued zero point four three. Its leftward arrow is a model-derived action, not a claim that left is universally safer.

### Interaction: 0.34 comes from

Before selecting 0.34 comes from, predict the result. Now activate it. Select the state valued zero point three four. Compare every one-step backup and report a tie if more than one action shares the maximum.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 24: An elegant solution can still optimize the wrong model

### Concept and boundary

A mathematically elegant policy can optimize the wrong model. Audit state sufficiency, reward specification, transition evidence, and planning assumptions independently. A delivery robot may appear optimal while ignoring pedestrians, battery degradation, or rare transition failures.

### Read the visible model

Now connect that idea to the exact visible evidence. State Reward Dynamics Planning CLAIM TO AUDIT Location alone is a sufficient state for a delivery robot. Diagnosis Usually incomplete: remaining battery, payload, time, and relevant traffic conditions can change transition or reward predictions. Evidence plan Test whether next-state and reward distributions still depend on omitted history after conditioning on the proposed state. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Interaction: State

Before selecting State, predict the result. Now activate it. Audit the state representation. Location alone is insufficient if battery, payload, time, or traffic changes transition or reward predictions after conditioning on location.

### Interaction: Reward

Before selecting Reward, predict the result. Now activate it. Audit the reward. Test for shortcuts, omitted costs, and behavior that scores well while violating the actual delivery objective.

### Interaction: Dynamics

Before selecting Dynamics, predict the result. Now activate it. Audit the dynamics. Compare predicted transition frequencies with held-out and rare-event evidence, including wall, traffic, pedestrian, and failure conditions.

### Interaction: Planning

Before selecting Planning, predict the result. Now activate it. Audit the planning claim. A small residual supports numerical convergence for the model; it does not establish that the model or resulting policy is deployment-ready.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.

## Slide 25: Model the future, choose a policy, and defend the assumptions

### Concept and boundary

Close the lesson by connecting representation, calculation, explanation, and audit. A defensible MDP solution states the tuple, shows at least one Bellman computation, identifies the resulting policy, and names the assumptions whose failure would change the recommendation.

### Read the visible model

Now connect that idea to the exact visible evidence. Represent Write ⟨S,A,P,R, gamma ⟩ for a two-state decision problem. Calculate Complete one Bellman expectation or optimality backup. Explain Why is an MDP not merely a Markov chain? Audit Name one omitted variable or reward failure and evidence that would reveal it. REQUIRED AND SUPPLEMENTAL READING Continue beyond the classroom demo Course source: L12 Part B, pages 12–25 — Markov-chain foundations. Russell & Norvig, Artificial Intelligence: A Modern Approach, 3rd ed., Chapter 17. Sutton & Barto, Reinforcement Learning: An Introduction, 2nd ed., Sections 3.1–4.4. SOURCE BOUNDARY The historical deck supports the Markov-chain portion. MDP tuples, actions, rewards, policies, Bellman equations, and value iteration are textbook/modern supplements added for this meeting. Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.

### Transfer and audit

Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.
