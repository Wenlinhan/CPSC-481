import fs from "node:fs/promises";
import path from "node:path";

const lessonGuides = {
  13: [
    "This lesson changes the question from what will happen to what an agent should do. We begin with Markov prediction, add actions and rewards, and end with value iteration. Keep model, evaluation, optimization, and audit separate: an algorithm can solve the stated model exactly while the model still omits a fact that matters in the world.",
    "A sequence model links observations that arrive in an order. Speech, robot localization, attention, and medical monitoring all have state that changes through time or position. The key modeling task is deciding what the state must remember so that the next-step distribution no longer needs the entire raw history.",
    "A Markov model needs three ingredients before any prediction is possible: a state space, an initial distribution, and transition dynamics. State says what can be true now, the initial distribution says where uncertainty begins, and the transition model says how probability mass moves from one step to the next.",
    "The Markov assumption is a conditional-independence claim, not a claim that the past never mattered. Its role is to summarize every relevant effect of the past inside the present state. That shortens the chain rule from a growing history to repeated local factors, which makes representation and computation tractable.",
    "Read this independence statement carefully. Once the present state is known, earlier states should add no information about the next state. If an omitted variable such as battery level or traffic phase still changes the next-step probabilities, then the chosen state is not Markov and must be repaired.",
    "An unrolled first-order Markov chain is also a Bayesian network. Each time step is a node, and each local conditional distribution is a factor. This bridge matters because the same graphical-model reasoning from Lesson twelve now explains a sequence: d-separation, factorization, and conditional independence still do the work.",
    "The weather example shows one transition model in three equivalent forms: a conditional-probability table, a directed state graph, and a matrix. They must agree row by row. Each representation supports a different task, so translating among them is a useful error-detection skill rather than decorative notation.",
    "Start with certainty about sun. One transition step selects the sun row of the matrix, producing point nine probability of sun and point one probability of rain. The arithmetic is simple, but the interpretation is important: prediction moves a distribution, not a single guaranteed weather label.",
    "Forward prediction repeats the same transition operator. Multiply the current distribution by the transition matrix to obtain the next distribution, then feed that result into the following step. Watch probability mass spread and stabilize while remembering that the result remains conditional on the modeled dynamics.",
    "A stationary distribution is a fixed point of the transition operator. Starting from that distribution leaves it unchanged after one step. Do not turn this definition into a universal convergence promise: periodic, reducible, or otherwise poorly behaved chains may fail to converge uniquely from every starting state.",
    "A Markov chain predicts what state comes next under fixed dynamics. A Markov decision process adds an action choice, and actions change the transition distribution and reward consequences. That is the conceptual boundary between passive prediction and control.",
    "The MDP tuple contains states, actions, transition probabilities, rewards, and a discount factor. Each symbol answers a different modeling question. A complete solution requires all five, and each is an assumption that can be challenged with evidence.",
    "An action does not normally determine the next state. It selects a probability distribution over next states. In the gridworld, moving right can reach the intended cell, slip sideways, or leave the agent in place. Planning must average over those outcomes rather than pretending the most likely one is certain.",
    "Reward is the formal objective supplied to the agent. It is not automatically the same as human value, safety, or long-term usefulness. Reward design is therefore both mathematical and socio-technical: specify what is measured, stress-test shortcuts, constrain unacceptable behavior, and monitor for gaming.",
    "Return combines immediate reward with discounted future rewards. Gamma controls how strongly later consequences influence the present decision. Use the controls to compare the same reward stream under different gamma values, then explain the behavioral preference rather than reporting only a number.",
    "A policy maps states to action distributions. A state value predicts expected return from a state under a policy, while an action value conditions on taking one action first. These are predictions about long-run consequences under explicit dynamics and reward assumptions.",
    "The Bellman expectation equation decomposes value into immediate reward plus discounted expected successor value. Reveal the equation one line at a time and identify the policy average, transition average, reward term, and recursive value term. The recursion is what lets local backups represent long futures.",
    "Policy evaluation averages over the actions chosen by a fixed policy. Optimal control replaces that policy-weighted action average with a maximum over actions. The immediate reward remains; only the decision rule changes. This distinction prevents a common error of maximizing the wrong part of the equation.",
    "A Bellman optimality backup evaluates every available action at one state. For each action, combine immediate reward with the probability-weighted value of successor states, then keep the largest action value. Use the directional controls to compare the candidates before selecting the winner.",
    "Value iteration applies Bellman optimality backups repeatedly and synchronously. After each sweep, measure the largest value change. Stop when that residual is small enough for the chosen tolerance, then extract a greedy policy with one-step lookahead.",
    "The gridworld makes value propagation visible. A goal reward first affects nearby states and then travels backward through repeated sweeps. Run one sweep before jumping to convergence so you can see why dynamic programming is repeated local computation rather than a mysterious global solve.",
    "A small Bellman residual is evidence about the numerical solver. It does not validate the reward function, transition model, state representation, or deployment setting. Keep solver convergence and real-world validity as separate claims with separate tests.",
    "Once values stabilize, extract a policy by taking the action with the largest one-step lookahead value at each state. The policy is a consequence of the model and values; it is not an additional source of truth. Ties and near-ties should be reported rather than hidden.",
    "A mathematically elegant policy can optimize the wrong model. Audit state sufficiency, reward specification, transition evidence, and planning assumptions independently. A delivery robot may appear optimal while ignoring pedestrians, battery degradation, or rare transition failures.",
    "Close the lesson by connecting representation, calculation, explanation, and audit. A defensible MDP solution states the tuple, shows at least one Bellman computation, identifies the resulting policy, and names the assumptions whose failure would change the recommendation.",
  ],
  14: [
    "Reinforcement learning replaces a known transition model with experience. An agent acts, observes consequences, receives reward, and revises a policy or value estimate. The recurring loop is interaction, return, value, and control, with uncertainty made visible rather than erased.",
    "The historical source gives five foundational ideas: trial and error, feedback as reward, policy, return, and exploration. Preserve those ideas, but qualify the claim that an agent simply learns an optimal policy. Optimality depends on representation, exploration, algorithm assumptions, and the environment.",
    "Reinforcement learning seeks high expected return, but successful learning is not automatic. Sparse feedback, partial observability, unsafe exploration, unstable approximation, and distribution shift can all break the promise. Separate the objective from the evidence that an algorithm actually reaches it.",
    "Games and elevator control demonstrate action-dependent experience. A move changes the future board; an elevator decision changes waiting time and future requests. Unlike passive prediction, the learner partly controls which data it will see next.",
    "Batch and online learning describe update schedules. Batch learning updates after collecting a dataset; online learning updates as examples arrive. Reinforcement learning is instead defined by sequential decisions and reward, so it may use either batch or online updates.",
    "The source figure compares batch and online updating. Enlarge it, inspect the actual labels, and keep the source boundary visible. Online updating can occur in supervised learning without reward or control, while reinforcement learning can learn from a stored replay buffer rather than updating after every transition.",
    "The historical taxonomy places reinforcement learning among broader learning categories. Use it as a snapshot rather than a universal partition. Modern systems can combine supervised pretraining, offline reinforcement learning, online fine-tuning, and model-based planning in one pipeline.",
    "Distinguish four dimensions that are often conflated: the feedback signal, update schedule, representation, and decision setting. Reinforcement learning is primarily a decision problem with delayed consequences, not merely a synonym for incremental updating.",
    "The MDP gives formal meaning to the source terms agent, environment, and policy. States describe what the agent can distinguish, actions are choices, dynamics generate successors, rewards label consequences, and gamma weights later rewards. Learning estimates quantities that planning assumed were known.",
    "Reward labels the consequence observed after an action; it does not retrospectively announce the uniquely correct action. Step through the interaction loop and keep the timing straight: state, action, next reward, next state, then update.",
    "Reinforcement-learning data are ordered transitions. Shuffling them into independent input-label pairs can hide how actions influence later states and rewards. Episodes, terminal states, and continuing tasks determine how returns and updates should be interpreted.",
    "Return converts a stream of rewards into a scalar target. Gamma controls the influence of delay, but it also interacts with task horizon and termination. State whether the task is episodic or continuing before treating the return formula as complete.",
    "Use the same reward sequence with several gamma values. A myopic setting favors immediate reward, while a larger gamma preserves more delayed benefit. The arithmetic is a policy preference encoded by the objective, not a neutral fact about what ought to matter.",
    "A policy chooses actions; state and action values predict expected long-run return. Q learning will store action values because control requires comparing choices at the same state. Every estimate is indexed by a representation, so omitted state can make two genuinely different situations look identical.",
    "A multi-armed bandit isolates exploration from state transitions. With no evidence, a greedy choice has no basis. Pull the arms, update their sample averages, and observe why exploration has informational value even when it sacrifices immediate expected reward.",
    "Epsilon-greedy behavior exploits the current best estimate most of the time and explores with probability epsilon. Compare zero, point one, and point five. Exploration does not mean uniformly random forever; it is a controlled data-collection policy whose cost and safety must be justified.",
    "Q learning moves one stored action value toward a bootstrapped target. The target is immediate reward plus discounted maximum next-state action value. Alpha controls how far the current estimate moves, and gamma controls how much of the next estimate enters the target.",
    "Keep target, temporal-difference error, and update separate. First compute the target, then subtract the current estimate to obtain the error, then multiply by alpha and add the correction. Step through the controls and name each number before combining them.",
    "In the tabular gridworld, reward information propagates backward through experienced transitions. Run a few episodes before jumping ahead. This makes clear that Q learning updates only visited state-action pairs and depends on exploration to cover useful alternatives.",
    "The tabular algorithm alternates behavior, observation, and one local update. The behavior policy chooses the action; the environment returns reward and successor state; the target uses the greedy next action value. Terminal handling must remove nonexistent future value.",
    "Q learning is off-policy because its target uses the greedy next action even when exploratory behavior selected something else. SARSA is on-policy because its target uses the actual next action. Compare the equations and explain how the target changes, not just the acronym.",
    "High training reward can coexist with sample inefficiency, reward hacking, instability, unsafe exploration, distribution shift, or weak evaluation. A deployment claim needs held-out scenarios, multiple seeds, uncertainty, baselines, safety constraints, and failure analysis.",
    "Practice by identifying the formal object required by each question. Compute a return from rewards and gamma, compute a Q update from current value and target, distinguish policy from value, and diagnose a claim whose evidence does not support deployment.",
    "The assessment asks what distinguishes reinforcement learning from online supervised learning. The decisive property is that actions influence future data and rewards may be delayed. Online supervised learning can update continuously while still receiving externally supplied labeled examples.",
    "Connect the lesson to the course sources and carry forward an explicit evidence standard. A complete reinforcement-learning explanation names the interaction loop, return, Q update, policy-improvement step, and the assumptions or risks that limit the claim.",
  ],
};

function speakable(value) {
  return value
    .replace(/⟨S, A, P, R, γ⟩/g, "the tuple S, A, P, R, gamma")
    .replace(/γ/g, " gamma ").replace(/ε/g, " epsilon ").replace(/π/g, " pi ")
    .replace(/Q̂/g, "Q estimate ").replace(/Q\*/g, "optimal Q ")
    .replace(/[→⇒]/g, " leads to ").replace(/←/g, " comes from ")
    .replace(/[↑↓]/g, " direction ").replace(/×/g, " times ")
    .replace(/\s+/g, " ").trim();
}

function phrase(text) {
  return text.split(/\s+/).slice(0, 8).join(" ").replace(/[.,;:!?]+$/g, "");
}

const actionNotes = {
  13: {
    15: [
      "With gamma zero, every delayed term vanishes, so the return is only the immediate reward: five.",
      "With gamma one half, the return is five plus two plus one quarter, or seven point two five. The reward two steps away is heavily discounted.",
      "With gamma point nine, the displayed return is twelve point nine four after rounding. Most of the delayed reward still matters.",
      "With gamma one, no reward is discounted, so the return is five plus zero plus eight plus two, or fifteen.",
    ],
    17: [
      "Reveal the next algebra line only. Pause to identify whether this line averages over policy choices, transition outcomes, or both before continuing.",
      "Reveal the full derivation. Read it from the inside out: successor values are averaged by transition probability, action values are averaged by the policy, and immediate reward is added before discounting the remainder.",
    ],
    18: [
      "Option A is incorrect. Bellman optimality still keeps the probability-weighted expectation over successor states because the action can have stochastic outcomes.",
      "Option B is correct. Replace the policy-weighted average over available actions with a maximum over actions; keep reward and successor-state expectation intact.",
      "Option C is incorrect. Immediate reward remains part of both Bellman expectation and Bellman optimality backups.",
    ],
    19: [
      "Up produces an action backup of zero point three two, so it is not the greedy choice at this state.",
      "Right produces zero point five nine, the largest of the four backups, so Bellman optimality selects Right.",
      "Down also produces zero point three two. Equal backups are possible, but both remain below Right here.",
      "Left produces zero point one four, the smallest candidate in this comparison.",
    ],
    21: [
      "Move back one sweep and compare the values. This exposes that each synchronous update used only the previous sweep rather than partially updated values.",
      "Run exactly one Bellman sweep. The positive terminal's influence moves only one layer farther through the grid, making value propagation visible.",
      "Run to sweep thirty. The maximum residual becomes small and the displayed values are close to a fixed point for this stated gridworld model.",
      "Show the greedy policy derived from one-step lookahead. The arrows are consequences of the converged values, transition rules, reward, and tie handling.",
    ],
    23: [
      "Select the state valued zero point seven three and inspect the one-step action comparisons that support its rightward greedy arrow.",
      "Select the state valued zero point eight six. Its rightward action moves toward the positive terminal and has the largest lookahead value.",
      "Select the state valued zero point six two. Its upward action avoids the negative terminal while moving toward higher-value states.",
      "Select the state valued zero point five two. The upward action is greedy under the displayed deterministic dynamics and reward.",
      "Select the state valued zero point four three. Its leftward arrow is a model-derived action, not a claim that left is universally safer.",
      "Select the state valued zero point three four. Compare every one-step backup and report a tie if more than one action shares the maximum.",
    ],
    24: [
      "Audit the state representation. Location alone is insufficient if battery, payload, time, or traffic changes transition or reward predictions after conditioning on location.",
      "Audit the reward. Test for shortcuts, omitted costs, and behavior that scores well while violating the actual delivery objective.",
      "Audit the dynamics. Compare predicted transition frequencies with held-out and rare-event evidence, including wall, traffic, pedestrian, and failure conditions.",
      "Audit the planning claim. A small residual supports numerical convergence for the model; it does not establish that the model or resulting policy is deployment-ready.",
    ],
  },
  14: {
    6: ["Enlarge the embedded source figure and inspect its labels directly. It distinguishes update schedule, not the defining decision-and-reward structure of reinforcement learning."],
    10: [
      "Focus on the agent. The policy chooses an action from the represented state, and the learner later uses the resulting transition to revise an estimate.",
      "Focus on the action arrow. The action is chosen before the next reward and next state are observed, so those consequences cannot label the action in advance.",
      "Focus on the reward arrow. Reward arrives from the environment after the action and describes a consequence under the specified objective.",
      "Focus on the next-state arrow. The successor state is part of the transition sample and determines where the next decision begins.",
      "Focus on the environment. Its dynamics generate the next state and reward; the learner does not control those outcomes directly.",
      "Step one observes the current state representation. If it omits relevant history, the learning problem may not be Markov.",
      "Step two samples an action from the behavior policy. Exploration changes this data-collection choice.",
      "Step three lets the environment generate the consequence of that action.",
      "Step four observes the next reward and next state, completing one transition tuple.",
      "Step five updates a value or policy estimate, then repeats from the successor state unless the episode terminated.",
    ],
    13: [
      "With gamma zero, the delayed goal is ignored and the return is only the immediate step cost: minus one.",
      "With gamma one half, the goal two steps away contributes two point five, so the return is one point five.",
      "With gamma point nine, the displayed return is seven point one. Most of the delayed goal reward remains.",
      "With gamma one, the rewards are undiscounted and the return is nine. This encodes a different time preference, not greater factual certainty.",
    ],
    15: [
      "Reset the evidence. All pull counts return to zero and no arm has an empirical advantage, so a greedy tie-break is arbitrary.",
      "Pull Arm A. Record its reward, increment its count, and update its Q estimate to the sample mean of rewards observed from A.",
      "Pull Arm B. Its immediate reward both affects return and supplies evidence that changes B's estimated value.",
      "Pull Arm C. Compare sample means and pull counts; a high estimate based on one pull is more uncertain than the same estimate after many pulls.",
    ],
    16: [
      "With epsilon zero, the behavior is purely greedy after tie-breaking. It can stop collecting evidence about alternatives and preserve an early mistake.",
      "With epsilon point one, roughly two of the twenty illustrative decisions explore while the remainder exploit the current estimate.",
      "With epsilon point five, exploration is much more frequent. Coverage improves, but immediate reward and possible safety cost can worsen.",
    ],
    18: [
      "Move to the previous calculation stage so target, temporal-difference error, and parameter update remain separate quantities.",
      "Advance one stage. Compute the target first, then the error, and only then apply alpha to move the stored Q value.",
      "Reset to the original transition and Q value. Recompute the update without carrying over a value from the previous walkthrough.",
    ],
    19: [
      "Reveal transition one. Only the visited state-action entry changes; the goal reward has not yet propagated to the start.",
      "Reveal transition two. The new target uses the best available successor estimate and moves reward information one step backward.",
      "Reveal transition three. Compare the updated entry with untouched alternatives and connect the difference to sampled experience.",
      "Reveal transition four. Reward information reaches an earlier decision, illustrating why repeated visits and exploration determine coverage.",
    ],
    21: [
      "Select Q-learning. Its target uses the greedy maximum at the next state even when the behavior policy took an exploratory action, so the update is off-policy.",
      "Select SARSA. Its target uses the actual next action sampled by the behavior policy, so the update evaluates that policy and is on-policy.",
    ],
    23: [
      "Choose the return case and attach gamma exponents to delayed rewards before adding them.",
      "Choose the update case and keep current Q, target, temporal-difference error, and alpha-weighted correction on separate lines.",
      "Choose the policy case and distinguish the behavior policy that generated data from the target policy represented by the update.",
      "Choose the diagnosis case and identify what training return fails to establish about robustness, safety, and transfer.",
      "Reveal the worked solution only after committing to the four formal objects. Compare each line with the definition it instantiates.",
    ],
    24: [
      "Option A is false. Reinforcement learning can train from an offline replay dataset, and supervised learning can update online as labels arrive.",
      "Option B is correct. Reinforcement-learning actions influence future data and consequences can be delayed; online supervised learning need not control the source of its labeled examples.",
      "Option C is false. Reinforcement learning may use an explicit learned or known model, while supervised learning need not expose one as a separate object.",
      "Option D is false. The distinction changes the data-generating process, objective, credit assignment, exploration problem, and evaluation evidence.",
    ],
  },
};

function controlLabel(button) {
  return speakable(button.ariaLabel || button.text || `control ${button.index + 1}`)
    .replace(/^([A-D])(?=[A-Z])/, "$1: ")
    .replace(/^Agentpolicy/, "Agent: policy")
    .replace(/^Environmentdynamics/, "Environment: dynamics")
    .replace(/^Arm ([ABC])Q estimate = \?0 reward \/ 0 pulls$/, "Arm $1: Q estimate unknown; zero reward; zero pulls")
    .trim();
}

function segment(label, text, index = 0, action = undefined) {
  const sourcePhrase = phrase(text);
  return {
    label,
    text,
    ...(action ? { action } : {}),
    visualDesign: {
      focusSelector: ".slide-content > *",
      focusIndex: index,
      focusPhrase: sourcePhrase,
      focuses: [{ phrase: sourcePhrase, selector: ".slide-content > *", index, label }],
      kinetics: [],
    },
  };
}

for (const lesson of [13, 14]) {
  const packageName = lesson === 13 ? "lesson-13-mdp" : "lesson-14-rl";
  const root = path.resolve("lecture", packageName);
  const inventory = JSON.parse(await fs.readFile(path.join(root, `lesson-${lesson}-slide-inventory.json`), "utf8"));
  const guides = lessonGuides[lesson];
  if (inventory.slides.length !== 25 || guides.length !== 25) throw new Error(`Lesson ${lesson} requires 25 inventory slides and guides.`);
  const slides = inventory.slides.map((slide, slideIndex) => {
    const visible = speakable(slide.text).slice(0, 1150);
    const segments = [segment("Concept and boundary", guides[slideIndex], 0)];
    segments.push(segment(
      "Read the visible model",
      `Now connect that idea to the exact visible evidence. ${visible} Read symbols as named quantities, trace each arrow as a dependency or transition, and verify that every probability or value has a stated conditioning context.`,
      0,
    ));
    for (const button of slide.buttons) {
      const label = controlLabel(button);
      const result = actionNotes[lesson]?.[slide.number]?.[button.index]
        ?? `Use this control to change the visible state. Describe the before-and-after difference, identify the formal quantity that changed, and state whether the evidence changed the model, estimate, policy, or only the display.`;
      segments.push(segment(
        `Interaction: ${label}`,
        `Before selecting ${label}, predict the result. Now activate it. ${result}`,
        0,
        { selector: ".slide-content button", index: button.index, label },
      ));
    }
    segments.push(segment(
      "Transfer and audit",
      lesson === 13
        ? `Transfer this page to a new sequential decision problem. State what the agent observes, what it can do, how uncertainty enters the transition, what reward is optimized, and which omitted variable would most threaten the Markov assumption. Then separate numerical solution evidence from evidence that the model is appropriate for deployment.`
        : `Transfer this page to a new learning system. Identify the state or context, the behavior policy, the observed transition, the reward timing, the update target, and the evaluation boundary. Then name one failure that training return would miss and one additional test needed before a deployment claim is defensible.`,
      0,
    ));
    return { number: slide.number, title: slide.title, segments };
  });
  const title = lesson === 13
    ? "Lesson 13: Markov Decision Processes, Policies, and Value Iteration"
    : "Lesson 14: Reinforcement Learning, Q-Learning, and Exploration";
  const script = {
    version: 1,
    lesson: String(lesson),
    meeting: String(lesson),
    course: "CPSC 481: Introduction to Artificial Intelligence",
    title,
    route: `/lessons/${lesson}`,
    voice: {
      name: "Microsoft Aria Neural",
      engineVoice: "en-US-AriaNeural",
      provider: "Microsoft neural text to speech",
      gender: "female",
      culture: "en-US",
      speakingRate: 0.94,
      edgeTtsRate: "-6%",
    },
    slides,
  };
  await fs.writeFile(path.join(root, "lecture-script-aria.json"), `${JSON.stringify(script, null, 2)}\n`, "utf8");
  const words = slides.flatMap(slide => slide.segments).reduce((total, item) => total + (item.text.match(/\S+/g)?.length ?? 0), 0);
  const lines = [
    `# Lesson ${lesson} video lecture script`, "",
    `- Route: /lessons/${lesson}`,
    "- Voice: Microsoft Aria Neural (en-US-AriaNeural)",
    "- Speaking rate: 0.94x (-6%)",
    `- Slides: ${slides.length}`,
    `- Narration words: ${words.toLocaleString("en-US")}`,
    "- Captions: burned in at the bottom of the final video", "",
  ];
  for (const slide of slides) {
    lines.push(`## Slide ${slide.number}: ${slide.title}`, "");
    for (const item of slide.segments) lines.push(`### ${item.label}`, "", item.text, "");
  }
  await fs.writeFile(path.join(root, `lesson-${lesson}-video-lecture-script-aria.md`), `${lines.join("\n")}\n`, "utf8");
  console.log(JSON.stringify({ lesson, slides: slides.length, segments: slides.flatMap(slide => slide.segments).length, words }, null, 2));
}
