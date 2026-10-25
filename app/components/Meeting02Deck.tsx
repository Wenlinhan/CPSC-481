"use client";

import { type ReactNode, useState } from "react";
import { L01DeckShell, type LessonSlide } from "./L01DeckShell";
import { EnlargeableImage } from "./SearchLessonPrimitives";

const sourceRoot = "/course-source/l01-ai";

function ConceptImage({ name, alt }: { name: string; alt: string }) {
  return <figure className="source-concept"><img alt={alt} src={`/concepts/${name}.webp`} /></figure>;
}

function CourseImage({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  const source = `${sourceRoot}/${name}`;
  return (
    <figure className={`source-figure ${className}`.trim()}>
      <EnlargeableImage alt={alt} src={source} />
    </figure>
  );
}

function SourceCallout({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="source-callout"><strong>{title}</strong><div>{children}</div></aside>;
}

function VacuumPeasLab() {
  const [active, setActive] = useState(0);
  const cases = [
    ["⟨(A, dirty)⟩", "SUCK", "The current square is dirty, so cleaning it immediately improves performance."],
    ["⟨(A, clean)⟩", "RIGHT", "A simple reflex policy moves to the other square because the current one needs no cleaning."],
    ["⟨(A, clean), (B, dirty)⟩", "SUCK", "The newest percept is B and dirty; the percept history also records that A was clean."],
    ["⟨(A, clean), (B, clean), (A, clean)⟩", "NO-OP", "If dirt does not reappear and movement has a cost, the history supports stopping after both squares were observed clean."],
  ];
  const current = cases[active];
  return (
    <div className="peas-vacuum-lab">
      <section className="peas-spec">
        <div><span>PEAS specification</span><h3>Two-location vacuum world</h3></div>
        <div className="peas-grid">
          <article><strong>P</strong><div><span>Performance</span><p>Clean both squares; minimize time, actions, and energy.</p></div></article>
          <article><strong>E</strong><div><span>Environment</span><p>Squares A and B, dirt, and the agent’s location.</p></div></article>
          <article><strong>A</strong><div><span>Actuators</span><p>LEFT · RIGHT · SUCK · NO-OP</p></div></article>
          <article><strong>S</strong><div><span>Sensors</span><p>Current location and whether that square is dirty.</p></div></article>
        </div>
      </section>
      <section className="vacuum-function">
        <div><span>Agent-function trace</span><h3>f : P* → A</h3><p>Choose a percept history, predict the action, then reveal the rationale.</p></div>
        <nav>{cases.map((_, index) => <button className={active === index ? "active" : ""} key={index} onClick={() => setActive(index)} type="button">{index + 1}</button>)}</nav>
        <div className="vacuum-trace"><code>{current[0]}</code><i>→</i><strong>{current[1]}</strong></div>
        <SourceCallout title="Why this action?">{current[2]}</SourceCallout>
      </section>
    </div>
  );
}

function LearningAgentDiagram() {
  return (
    <svg aria-labelledby="learning-agent-title learning-agent-desc" className="learning-agent-svg" role="img" viewBox="0 0 760 430">
      <title id="learning-agent-title">Learning agent architecture</title>
      <desc id="learning-agent-desc">An environment exchanges percepts and actions with a performance element. A critic, learning element, and problem generator improve the agent.</desc>
      <defs>
        <marker id="learning-agent-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0,0 L8,4 L0,8 Z" fill="#5131c7" />
        </marker>
      </defs>
      <rect fill="#e7f1ff" height="100" rx="22" stroke="#1578c3" strokeWidth="3" width="154" x="22" y="158" />
      <text fill="#111827" fontSize="20" fontWeight="800" textAnchor="middle" x="99" y="214">Environment</text>
      <rect fill="#ffffff" height="374" rx="28" stroke="#aab8cc" strokeWidth="3" width="535" x="205" y="28" />
      <text fill="#3d0877" fontSize="18" fontWeight="900" x="232" y="64">LEARNING AGENT</text>

      <rect fill="#f1edff" height="96" rx="16" stroke="#6740d9" strokeWidth="3" width="250" x="290" y="112" />
      <text fill="#111827" fontSize="19" fontWeight="800" textAnchor="middle" x="415">
        <tspan x="415" y="146">Performance</tspan>
        <tspan x="415" y="167">element</tspan>
      </text>
      <text fill="#59647a" fontSize="14" textAnchor="middle" x="415" y="190">selects external actions</text>

      <rect fill="#e8f8f2" height="96" rx="16" stroke="#0a9b62" strokeWidth="3" width="250" x="290" y="265" />
      <text fill="#111827" fontSize="19" fontWeight="800" textAnchor="middle" x="415">
        <tspan x="415" y="299">Learning</tspan>
        <tspan x="415" y="320">element</tspan>
      </text>
      <text fill="#59647a" fontSize="14" textAnchor="middle" x="415" y="343">changes future behavior</text>

      <rect fill="#fff4d8" height="96" rx="16" stroke="#f0ad2f" strokeWidth="3" width="150" x="565" y="265" />
      <text fill="#111827" fontSize="20" fontWeight="800" textAnchor="middle" x="640" y="310">Critic</text>
      <text fill="#59647a" fontSize="14" textAnchor="middle" x="640" y="339">evaluates</text>

      <rect fill="#fdecef" height="96" rx="16" stroke="#c64f6d" strokeWidth="3" width="150" x="565" y="112" />
      <text fill="#111827" fontSize="17" fontWeight="800" textAnchor="middle" x="640">
        <tspan x="640" y="146">Problem</tspan>
        <tspan x="640" y="166">generator</tspan>
      </text>
      <text fill="#59647a" fontSize="14" textAnchor="middle" x="640" y="190">suggests exploration</text>

      <path d="M176 178 H290" fill="none" markerEnd="url(#learning-agent-arrow)" stroke="#5131c7" strokeWidth="4" />
      <text fill="#59647a" fontSize="14" textAnchor="middle" x="233" y="166">percepts</text>
      <path d="M290 198 H176" fill="none" markerEnd="url(#learning-agent-arrow)" stroke="#5131c7" strokeWidth="4" />
      <text fill="#59647a" fontSize="14" textAnchor="middle" x="233" y="222">actions</text>

      <path d="M176 244 C230 244 238 382 290 382 H640 V361" fill="none" markerEnd="url(#learning-agent-arrow)" stroke="#5131c7" strokeWidth="4" />
      <text fill="#59647a" fontSize="14" x="201" y="304">experience</text>
      <path d="M565 314 H540" fill="none" markerEnd="url(#learning-agent-arrow)" stroke="#5131c7" strokeWidth="4" />
      <path d="M415 265 V208" fill="none" markerEnd="url(#learning-agent-arrow)" stroke="#5131c7" strokeWidth="4" />
      <path d="M565 160 H540" fill="none" markerEnd="url(#learning-agent-arrow)" stroke="#5131c7" strokeWidth="4" />
    </svg>
  );
}

function Dimension({
  left,
  right,
  leftDefinition,
  rightDefinition,
  details,
  leftExample,
  rightExample,
  leftVisual,
  rightVisual,
}: {
  left: string;
  right: string;
  leftDefinition: string;
  rightDefinition: string;
  details: ReactNode;
  leftExample: string;
  rightExample: string;
  leftVisual: string;
  rightVisual: string;
}) {
  return (
    <div className="dimension-layout">
      <div className="dimension-pair">
        <article><ConceptImage alt={`${left} task environment`} name={leftVisual} /><span>A</span><h3>{left}</h3><p>{leftDefinition}</p><small>{leftExample}</small></article>
        <article><ConceptImage alt={`${right} task environment`} name={rightVisual} /><span>B</span><h3>{right}</h3><p>{rightDefinition}</p><small>{rightExample}</small></article>
      </div>
      <SourceCallout title="Important qualification">{details}</SourceCallout>
    </div>
  );
}

function SoccerReveal() {
  const [revealed, setRevealed] = useState(0);
  const properties = [
    ["Partially observable", "An agent cannot detect everything affecting its action, including what other players are thinking."],
    ["Stochastic", "A kick’s outcome cannot be exactly determined; another player may stop the ball and many field states can follow."],
    ["Sequential", "The history of actions in the game affects the next action."],
    ["Dynamic", "The field changes while the agent is deciding because players move."],
    ["Continuous", "Player and ball locations, speed, and direction are continuous."],
    ["Unknown", "The agent is not given every outcome for every action and must learn aspects of the environment."],
    ["Multi-agent", "Many agents participate in the game."],
  ];
  return (
    <div className="soccer-reveal">
      <div><ConceptImage alt="A robot playing soccer in a changing field" name="soccer-environment" /><span>Classify first</span><h3>A single soccer game</h3><p>Write all seven properties before revealing the analysis.</p><div><button disabled={revealed >= properties.length} onClick={() => setRevealed(value => Math.min(properties.length, value + 1))} type="button">Reveal next property</button><button onClick={() => setRevealed(revealed === properties.length ? 0 : properties.length)} type="button">{revealed === properties.length ? "Reset" : "Reveal all"}</button></div></div>
      <ol>{properties.map(([name, explanation], index) => <li className={index < revealed ? "visible" : ""} key={name}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{index < revealed ? name : "Commit your classification"}</strong><p>{index < revealed ? explanation : "Reason before revealing."}</p></div></li>)}</ol>
    </div>
  );
}

function EnvironmentPractice() {
  const scenarios = [
    ["Chess clock tournament", "Fully observable for board state; deterministic; sequential; dynamic with a clock; discrete; known; multi-agent.", "chess-environment"],
    ["Robot vacuum in a busy home", "Partially observable; stochastic; sequential; dynamic; mixed discrete/continuous; partly unknown; multi-agent when people or pets matter.", "vacuum-environment"],
    ["Medical diagnosis assistant", "Partially observable; stochastic; sequential when follow-up tests matter; dynamic; mixed; partly unknown; often multi-agent.", "medical-task"],
  ];
  const [active, setActive] = useState(0);
  const [answer, setAnswer] = useState(false);
  const scenario = scenarios[active];
  return (
    <div className="environment-practice">
      <nav>{scenarios.map((item, index) => <button className={active === index ? "active" : ""} key={item[0]} onClick={() => { setActive(index); setAnswer(false); }} type="button">{item[0]}</button>)}</nav>
      <section><ConceptImage alt={`${scenario[0]} environment`} name={scenario[2]} /><div><span>Seven-dimension classification</span><h3>{scenario[0]}</h3><p>Classify observability, outcomes, dependence, change, values, knowledge, and agents. State every assumption.</p><button onClick={() => setAnswer(value => !value)} type="button">{answer ? "Hide one defensible analysis" : "Reveal one defensible analysis"}</button>{answer && <SourceCallout title="One defensible analysis">{scenario[1]}</SourceCallout>}</div></section>
    </div>
  );
}

function RobotPractice() {
  const cases = [
    ["Shopping robot: bring back items on a shopping list", "Goal-based is defensible if it must plan how to obtain every item. A simpler implementation may work in a fixed environment."],
    ["Robotic vacuum", "Simple reflex may work in a fully observable toy world; model-based is more defensible when rooms, obstacles, and cleaned areas are not all visible."],
    ["Mail sorting robot: sort mail by ZIP code", "Simple reflex is defensible when the current ZIP code completely determines the routing action."],
    ["Shopping robot: bring back items on a shopping list with the lowest price", "Utility-based is defensible because it must rank successful outcomes by price and possibly time or travel cost."],
  ];
  const labels = ["Shopping goal", "Vacuum", "Mail sorter", "Lowest price"];
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="robot-practice">
      <nav>{cases.map((item, index) => <button className={active === index ? "active" : ""} key={item[0]} onClick={() => { setActive(index); setRevealed(false); }} type="button">{labels[index]}</button>)}</nav>
      <section><ConceptImage alt="Robots requiring different agent designs" name="guided-practice" /><div><span>Student participation</span><h3>{cases[active][0]}</h3><p>Choose the simplest agent type that meets the task. Identify the assumption that determines your answer.</p><button onClick={() => setRevealed(value => !value)} type="button">{revealed ? "Hide analysis" : "Reveal a defensible analysis"}</button>{revealed && <SourceCallout title="Not the only possible answer">{cases[active][1]}</SourceCallout>}</div></section>
    </div>
  );
}

function TuringMiniLab() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="turing-mini-lab">
      <div><span>Interrogator</span><p>Explain why a metal spoon feels colder than a wooden spoon in the same room.</p></div>
      <div><span>Player A</span><p>Metal conducts heat away from your hand faster, although both spoons have the same room temperature.</p></div>
      <div><span>Player B</span><p>The metal spoon has more coldness inside its material.</p></div>
      <aside><h3>Which player is the machine?</h3><p>Decide from the transcript, then state what your decision would—and would not—prove.</p><button onClick={() => setRevealed(value => !value)} type="button">{revealed ? "Hide debrief" : "Debrief the test"}</button>{revealed && <SourceCallout title="Evidence boundary">A convincing response supports human-like conversational performance in this exchange. It does not by itself establish perception, truthfulness, general intelligence, or a human-like internal mechanism.</SourceCallout>}</aside>
    </div>
  );
}

function TuringCritique() {
  const points = [
    ["Importance", "The test seeks an objective notion of intelligence without favoring living organisms."],
    ["Perception limit", "It emphasizes symbolic and problem-solving skill rather than perceptual skill."],
    ["Lovelace objection", "Computers do as instructed and therefore appear unable to originate actions of their own."],
    ["Theory distraction", "Imitation can distract from explaining the mechanisms of intelligence in humans and machines."],
    ["Human benchmark limit", "It tests simulation of human behavior even though machines can outperform humans on many tasks."],
  ];
  return (
    <div className="turing-critique all-points">
      <CourseImage alt="Venn diagram contrasting human behavior, intelligent behavior, and the Turing Test overlap" name="turing-behavior-venn.png" />
      <div><span>Importance and criticisms</span><ol>{points.map(([label, explanation], index) => <li key={label}><b>{String(index + 1).padStart(2, "0")}</b><div><strong>{label}</strong><p>{explanation}</p></div></li>)}</ol><SourceCallout title="Read the diagram">Some human behavior is unintelligent; some intelligent behavior is not human behavior. Human imitation and intelligence are not equivalent sets.</SourceCallout></div>
    </div>
  );
}

function EvolutionFuture() {
  return (
    <div className="evolution-future-visible">
      <section>
        <header><ConceptImage alt="The evolution of AI systems and methods" name="history-ai-systems" /><div><span>Evolution of AI</span><h3>Optimism, setbacks, and practical systems</h3></div></header>
        <article><strong>Early stages</strong><p>Concepts, theories, and simulated human intelligence: formal logic, theorem proving, graph theory, search, knowledge representation, stochastic analysis, and related mathematics.</p></article>
        <article><strong>Modern AI</strong><p>Practical applications and problem solving driven by real-world demand: machine learning, data mining, search engines, intelligent systems, robots, and big-data analytics.</p></article>
        <small>AI became an essential part of industrial technology; <strong>collective intelligence</strong> joins human and machine capability.</small>
      </section>
      <section>
        <header><ConceptImage alt="People evaluating possible futures with AI" name="consequences" /><div><span>Future of AI</span><h3>Capability, coexistence, ethics, and work</h3></div></header>
        <ul><li>AI began with a strong-AI goal but has mainly delivered weak AI; strong AI remains a long-term research goal.</li><li>Could a strong-AI system become more intelligent than humans? What ethical issues would arise?</li><li>A human using a chess computer could beat Deep Blue: how should humans and AI coexist?</li><li>How well can you utilize AI? Pessimistic forecasts emphasize job removal, while history also shows new jobs.</li><li>Source context included robotics, Industry 4.0, and the Internet of Things.</li></ul>
        <SourceCallout title="Historical claim to reassess">The 2020 material said AI was still weak at recognition, feeling, and emotion. Recognition has advanced sharply; feeling and emotion remain contested capabilities that require operational definitions and evidence.</SourceCallout>
      </section>
    </div>
  );
}

function CourseStudyGuide() {
  const levels = [
    ["Understand and explain", "can tell"],
    ["Apply", "can do"],
    ["Teach", "can teach"],
    ["Criticize", "can criticize"],
    ["Improve and innovate", "can innovate"],
  ];
  return (
    <div className="course-study-visible">
      <section><span>Primary course focus</span><h3>Understand and implement intelligence</h3><p>Problem solving · reasoning · learning · creativity · natural-language understanding · decision making · planning</p><h3>Learn practical AI</h3><p>Complex and intelligent problem-solving strategies.</p><SourceCallout title="Course habit">For every method: explain the idea, trace an example, apply it, criticize the evidence, and improve the design.</SourceCallout></section>
      <section><span>Levels of knowledge capability</span><ol>{levels.map(([level, shorthand], index) => <li key={level}><b>{index + 1}</b><strong>{level}</strong><small>{shorthand}</small></li>)}</ol><SourceCallout title="Study principle">Understand the principal ideas, then apply them to solve complex problems and build an intelligent system.</SourceCallout></section>
    </div>
  );
}

const reviewOne = [
  "What is intelligence?",
  "What are the key capabilities of intelligence? Define each and consider real-world applications.",
  "What is the main difference between single intelligence and multiple intelligence?",
  "Do only humans have intelligence?",
  "What are some unknown aspects of intelligence?",
  "Can we develop a software system that has intelligence?",
  "What is Artificial Intelligence (AI)?",
  "What is an intelligent agent?",
  "What are the different types of environment for agents?",
  "Define simple reflex, goal-based, and utility-based agents.",
  "What are the areas of AI?",
  "How can we tell whether a software system is intelligent?",
  "How can AI solve complex real-world problems? What are its applications?",
];

const reviewTwo = [
  "Is it possible to develop a system as intelligent as a human?",
  "What is the Turing Test? What is its purpose?",
  "Is it possible to develop a system that can pass the Turing Test?",
  "If a machine passes the Turing Test, can it solve most AI problems?",
  "Is it possible to develop a system more intelligent than a human?",
  "What is the main difference between weak AI and strong AI?",
  "What do you think will be the future of AI?",
  "What potential problems may arise with advanced AI?",
];

const remember = [
  "Can you explain intelligence?",
  "What are the major capabilities for intelligence?",
  "Can you explain Artificial Intelligence (AI)?",
  "How can we tell whether a system is intelligent?",
  "What is an intelligent agent?",
  "What are the areas of AI?",
  "What are the applications of AI in the real world?",
  "What is the ultimate goal for AI?",
];

function ReviewQuestions({ questions }: { questions: string[] }) {
  return (
    <ol className="review-list">{questions.map((question, index) => <li key={question}><span>{String(index + 1).padStart(2, "0")}</span>{question}</li>)}</ol>
  );
}

function ImportantPointsAndReferences() {
  return (
    <div className="important-reference-grid">
      <section><span>Most important points to remember</span><ol>{remember.map((point, index) => <li key={point}><b>{String(index + 1).padStart(2, "0")}</b>{point}</li>)}</ol></section>
      <section><span>References</span><p><strong>George F. Luger.</strong> <em>Artificial Intelligence: Structures and Strategies for Complex Problem Solving</em>, 6th ed., Chapter 1, Addison Wesley, 2009.</p><p><strong>Stuart Russell and Peter Norvig.</strong> <em>Artificial Intelligence: A Modern Approach</em>, 3rd ed., Prentice Hall, 2010.</p><SourceCallout title="Exit prompt">Choose one review question. Answer it with a definition, an example, and one evidence boundary.</SourceCallout></section>
    </div>
  );
}

const slides: LessonSlide[] = [
  {
    eyebrow: "Module 2 · Lesson 2",
    title: "Intelligent Agents",
    minutes: 2,
    subtitle: "Task environments, agent architectures, AI directions, and the Turing Test",
    content: <div className="source-hero"><div><p>Intelligence becomes an engineering problem when a system must perceive, choose, and act.</p><span>Today: define the agent, classify its world, and justify its design.</span></div><ConceptImage alt="An intelligent agent interacting with an environment" name="agent-loop" /></div>,
    note: "On this page, we are focusing on Intelligent Agents. Start by identifying the agent boundary in one familiar AI system.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Learning objectives",
    title: "Move from a definition to a defensible agent design",
    minutes: 2,
    content: <div className="source-objectives"><article><span>01</span><h3>Define</h3><p>Agent, percept, action, function, program, architecture, and rationality.</p></article><article><span>02</span><h3>Classify</h3><p>Seven properties of task environments and their design consequences.</p></article><article><span>03</span><h3>Compare</h3><p>Simple reflex, model-based, goal-based, and utility-based agents.</p></article><article><span>04</span><h3>Evaluate</h3><p>Weak/strong AI claims and the evidence provided by the Turing Test.</p></article></div>,
    note: "On this page, we are focusing on Move from a definition to a defensible agent design. These objectives provide the organizing questions for the meeting. Each section ends with classification or evaluation practice.",
    sourceSlides: [11, 12, 13, 15, 21, 22],
  },
  {
    eyebrow: "Knowledge point 1 · Agent definition",
    title: "An agent perceives an environment and acts upon it",
    minutes: 3,
    content: <div className="agent-definition"><blockquote>An agent is anything that can be viewed as <strong>perceiving</strong> its environment through <strong>sensors</strong> and <strong>acting</strong> upon that environment through <strong>actuators</strong>.</blockquote><div><article><span>Human agent</span><p>Eyes, ears, and other organs serve as sensors; hands, legs, mouth, and other body parts serve as actuators.</p></article><article><span>Robotic agent</span><p>Cameras and infrared range finders serve as sensors; various motors serve as actuators.</p></article></div></div>,
    note: "On this page, we are focusing on An agent perceives an environment and acts upon it. Notice the complete definition visible. Try to mark the agent boundary, environment, sensors, and actuators in a chatbot and an autonomous car.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Agent definition · exact model",
    title: "Percepts flow in; actions flow out",
    minutes: 2,
    content: <div className="source-figure-explain"><CourseImage alt="Agent environment diagram labeled environment, percepts, sensors, agent, actions, and actuators" name="agent-environment-loop.png" /><div><h3>Read every arrow and label</h3><ul><li>The environment produces <strong>percepts</strong>.</li><li>Sensors deliver percepts to the agent.</li><li>The agent selects an <strong>action</strong>.</li><li>Actuators affect the environment.</li></ul><div className="source-formula">f : P* → A</div><p>The agent function maps <strong>possible percept sequences (P*)</strong> to actions—not only the current percept.</p></div></div>,
    note: "Let’s focus on this idea: percepts flow into the agent, and actions flow out. Follow every arrow in the figure. The symbol P* means the set of possible percept sequences, so the agent function can depend on everything perceived so far—not only the current percept.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Agent definition · implementation and rationality",
    title: "The function is abstract; the program runs on an architecture",
    minutes: 2,
    content: <div className="architecture-equation"><div><span>Agent program</span><p>Implements the mapping from percept histories to actions.</p></div><b>+</b><div><span>Physical architecture</span><p>Provides the computational and embodied machinery on which the program runs.</p></div><b>=</b><div><span>Agent</span><p><strong>agent = architecture + program</strong></p></div><aside><strong>Rational-agent criterion</strong><p>For each possible percept sequence, select the action <strong>expected to maximize the performance measure</strong>, given the percept evidence and built-in knowledge.</p><small>Rational does not mean omniscient, always successful, or morally good.</small></aside></div>,
    note: "Let’s focus on this distinction: the agent function is an abstract mapping from percept history to action, while the agent program is the implementation running on an architecture. Rationality depends on the performance measure, the evidence in the percept sequence, prior knowledge, and the actions available to the agent.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Textbook extension · PEAS and two-location vacuum world",
    title: "PEAS defines success; the agent function defines a response",
    minutes: 4,
    content: <VacuumPeasLab />,
    note: "Let’s focus on this idea: PEAS defines the task and what counts as success, while the agent function defines a response to percept history. In the two-location vacuum world, predict each action before revealing the rationale. Then change one PEAS assumption and explain which actions should change as a result.",
    sourceSlides: [11, 12, 13],
  },
  {
    eyebrow: "Knowledge point 2 · Task environments",
    title: "A task environment specifies the problem the agent must solve",
    minutes: 2,
    content: <div className="task-environment-boundary"><section><ConceptImage alt="An agent, its task, and relevant external conditions" name="task-environment" /><h3>A task environment includes</h3><p>The external states, entities, events, information, and constraints relevant to choosing and evaluating the agent’s actions.</p></section><section><ConceptImage alt="An irrelevant object outside the task environment" name="not-task-environment" /><h3>It does not automatically include</h3><p>Every fact about the universe, the agent’s source code, or details that cannot affect its percepts, choices, or performance.</p></section><SourceCallout title="Diagnostic question">Could changing this feature alter what the agent perceives, should do, or how success is measured?</SourceCallout></div>,
    note: "On this page, we are focusing on A task environment specifies the problem the agent must solve. Examples: a chessboard position is part of the chess task environment; the color of the table usually is not. Task relevance depends on the stated performance measure.",
    sourceSlides: [12, 13],
  },
  {
    eyebrow: "Task-environment property 1",
    title: "Fully observable vs. partially observable",
    minutes: 2,
    content: <Dimension left="Fully observable" right="Partially observable" leftDefinition="Sensors detect all aspects of the environment relevant to choosing an action." rightDefinition="Relevant information is missing, noisy, inaccurate, or impossible to measure." details={<>With other agents, their actions may be observable while their intentions remain hidden.</>} leftExample="Chess board state" rightExample="Driving among people" leftVisual="fully-observable" rightVisual="partially-observable" />,
    note: "On this page, we are focusing on Fully observable vs. partially observable. Observability is relative to the agent’s sensors and the information required for action—not to whether a human observer knows everything.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Task-environment property 2",
    title: "Deterministic vs. stochastic",
    minutes: 2,
    content: <Dimension left="Deterministic" right="Stochastic" leftDefinition="The current state and executed action completely determine the next state." rightDefinition="The next state has uncertainty associated with it." details={<>Uncertainty may come from randomness, an inadequate environment model, or incomplete sensor coverage.</>} leftExample="A legal chess move" rightExample="A kick in a soccer match" leftVisual="deterministic" rightVisual="stochastic" />,
    note: "On this page, we are focusing on Deterministic vs. stochastic. We should not equate stochastic only with randomness; uncertainty can also reflect incomplete models and sensing.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Task-environment property 3",
    title: "Episodic vs. sequential",
    minutes: 2,
    content: <Dimension left="Episodic" right="Sequential" leftDefinition="Experience is divided into atomic episodes; the next episode does not depend on prior actions." rightDefinition="Current decisions affect future decisions or rely on earlier decisions." details={<>An expert-advice system can be episodic when one episode is a single question and answer.</>} leftExample="Independent item classification" rightExample="A soccer match" leftVisual="episodic" rightVisual="sequential" />,
    note: "On this page, we are focusing on Episodic vs. sequential. Consider whether a spam filter is episodic if its later model updates depend on earlier labels. The answer changes with the system boundary.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Task-environment property 4",
    title: "Static vs. dynamic",
    minutes: 2,
    content: <Dimension left="Static" right="Dynamic" leftDefinition="Nothing other than the agent changes while it is deciding." rightDefinition="The environment may change while the agent is deciding." details={<>Other agents make an environment dynamic. The agent moving to another location does not by itself make the environment dynamic, although it can create a similar design effect.</>} leftExample="Crossword puzzle on paper" rightExample="Taxi driving" leftVisual="static" rightVisual="dynamic" />,
    note: "On this page, we are focusing on Static vs. dynamic. Notice the important nuance about agent motion versus independent environmental change. A clock can also make an otherwise static task semidynamic.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Task-environment property 5",
    title: "Discrete vs. continuous",
    minutes: 2,
    content: <Dimension left="Discrete" right="Continuous" leftDefinition="Time or state advances in fixed steps, often with one measurement and perhaps one action per step." rightDefinition="Signals arrive continually and actions or states vary over continuous ranges." details={<>Chess is discrete. Taxi driving is continuous: position, speed, steering angle, and sensor signals vary continuously.</>} leftExample="Chess" rightExample="Taxi driving" leftVisual="discrete" rightVisual="continuous" />,
    note: "Let’s focus on the difference between discrete and continuous variables. A task may combine discrete decisions with continuous perception and control. When you classify an environment, name the particular variable you mean instead of labeling the entire system without qualification.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Task-environment properties 6 and 7",
    title: "Known vs. unknown; single-agent vs. multi-agent",
    minutes: 2,
    content: <div className="paired-dimensions-lesson"><div className="paired-dimensions"><article><ConceptImage alt="A known task environment with given outcomes" name="known" /><span>Known</span><p>Outcomes for all actions are given.</p></article><article><ConceptImage alt="An unknown environment being learned" name="unknown" /><span>Unknown</span><p>The agent must learn how the environment works.</p></article><article><ConceptImage alt="One agent operating alone" name="single-agent" /><span>Single-agent</span><p>Only one agent’s decisions determine performance.</p></article><article><ConceptImage alt="Several agents interacting" name="multi-agent" /><span>Multi-agent</span><p>Other agents cooperate, compete, or otherwise alter outcomes.</p></article></div><SourceCallout title="Do not confuse two dimensions">A card game can be <b>known</b> because its rules are given and still <b>partially observable</b> because an opponent’s cards are hidden.</SourceCallout></div>,
    note: "On this page, we are focusing on Known vs. unknown; single-agent vs. multi-agent. Known concerns the action model, not observability. An environment can be fully observable yet unknown. Multi-agent classification depends on whether other entities should be modeled as agents.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Task environments · worked example",
    title: "Classify a single soccer game",
    minutes: 4,
    content: <SoccerReveal />,
    note: "Let’s classify a single soccer game. Reveal the dimensions one at a time: partially observable, stochastic, sequential, dynamic, continuous, unknown, and multi-agent. For every label, give a reason tied to the players’ sensors, actions, uncertainty, or interaction.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Task environments · in-class practice",
    title: "The classification depends on stated assumptions",
    minutes: 3,
    content: <EnvironmentPractice />,
    note: "On this page, we are focusing on The classification depends on stated assumptions. In groups, classify one scenario, then compare with another group. Differences are acceptable when the assumed boundary or performance measure differs and the reasoning is explicit.",
    sourceSlides: [12, 13, 14],
  },
  {
    eyebrow: "Knowledge point 3 · Simple reflex agent",
    title: "A simple reflex agent acts on the current percept",
    minutes: 2,
    content: <div className="architecture-slide"><CourseImage alt="Simple reflex agent architecture with condition-action rules" name="agent-simple-reflex.png" /><div><h3>Condition–action rules choose what to do now.</h3><ul><li>Uses only the current percept.</li><li>Ignores the rest of percept history.</li><li>Succeeds only when the environment is fully observable.</li><li>Can enter infinite loops in partially observable environments.</li></ul><SourceCallout title="Reflex and examples">A reflex is an action performed as a response to a stimulus without conscious thought. Source examples: a ZIP-code mail sorter and a Mars rover.</SourceCallout></div></div>,
    note: "Let’s focus on the simple reflex agent. Trace the flow from sensors to the current percept, through a condition-action rule, then to the chosen action and effectors. Because this agent uses only the current percept, ask what goes wrong when important information is temporarily hidden.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Knowledge point 3 · Model-based agent",
    title: "Internal state represents what cannot currently be seen",
    minutes: 2,
    content: <div className="architecture-slide"><CourseImage alt="Model-based reflex agent architecture with state, world evolution, and action effects" name="agent-model-based.png" /><div><h3>A simple reflex agent with internal state handles partial observability.</h3><ul><li>Stores a current state inside the agent.</li><li>Maintains a structure describing parts of the world that cannot be seen.</li><li>Uses how the world evolves.</li><li>Uses what its own actions do.</li></ul></div></div>,
    note: "Let’s focus on internal state as a representation of what cannot currently be seen. Trace the current percept, the previous internal state, and the model of how the world changes. Then consider what happens when that internal model is wrong: the agent can update its state confidently and still be mistaken.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Knowledge point 3 · Goal-based agent",
    title: "Goals let the agent compare possible futures",
    minutes: 2,
    content: <div className="architecture-comparison"><article><CourseImage alt="Model-based agent architecture" name="agent-model-based.png" /><span>Model-based</span><p>Represents the current world.</p></article><i>→</i><article><CourseImage alt="Goal-based agent architecture with predicted outcomes and goals" name="agent-goal-based.png" /><span>Goal-based</span><p>Adds reasoning or inference and goals, then selects among possibilities that reach a goal state.</p></article></div>,
    note: "On this page, we are focusing on Goals let the agent compare possible futures. The repeated model-based figure is intentional. Try to identify exactly what the goal-based architecture adds: predicted consequences and a goal test.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Knowledge point 3 · Utility-based agent",
    title: "Utility ranks successful outcomes and tradeoffs",
    minutes: 2,
    content: <div className="architecture-comparison"><article><CourseImage alt="Goal-based agent architecture" name="agent-goal-based.png" /><span>Goal-based</span><p>Distinguishes goal states from non-goal states. A shopping list specifies a goal.</p></article><i>→</i><article><CourseImage alt="Utility-based agent architecture with utility and expected happiness of states" name="agent-utility-based.png" /><span>Utility-based</span><p>Adds rational decision making: “How happy I will be in such a state.” If several actions reach the goal, rank them by lowest price, fastest completion, risk, or another utility.</p></article></div>,
    note: "On this page, we are focusing on Utility ranks successful outcomes and tradeoffs. The figure’s Utility input and happiness label are knowledge-bearing. The important idea is that utility ranks outcomes; it does not guarantee that the chosen utility function is appropriate.",
    sourceSlides: [17],
  },
  {
    eyebrow: "Knowledge point 3 · Learning agent · textbook extension",
    title: "A learning agent changes how it acts from experience",
    minutes: 2,
    content: <div className="learning-agent-layout"><LearningAgentDiagram /><div><article><strong>Performance element</strong><p>Selects actions from current knowledge.</p></article><article><strong>Critic</strong><p>Evaluates behavior against a performance standard.</p></article><article><strong>Learning element</strong><p>Uses feedback to change the performance element.</p></article><article><strong>Problem generator</strong><p>Suggests exploratory actions that may produce useful experience.</p></article><SourceCallout title="Design question">Which component is missing if the agent acts, receives a score, but never changes future behavior?</SourceCallout></div></div>,
    note: "On this page, we are focusing on A learning agent changes how it acts from experience. This page completes the revised course plan’s architecture list. Let’s trace one robot-vacuum failure through critic → learning element → changed performance element.",
    sourceSlides: [15, 16, 17],
  },
  {
    eyebrow: "Agent architectures · student participation",
    title: "Which agent type should build each robot?",
    minutes: 4,
    content: <RobotPractice />,
    note: "On this page, we are focusing on Which agent type should build each robot?. The course material provides no official answers. Accept multiple architectures when students identify the assumption that makes the extra capability necessary.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Knowledge point 4 · Dartmouth, 1956",
    title: "The first AI agenda named questions that still organize the field",
    minutes: 2,
    content: <div className="dartmouth-map"><article><span>Automatic computers</span><p>A program that simulates the machine</p></article><article><span>Language</span><p>How can a computer use language the way humans use and manipulate words?</p></article><article><span>Neuron networks</span><p>Networks of simple processing units</p></article><article><span>Calculation</span><p>Theory of the size of a calculation</p></article><article><span>Self-improvement</span><p>Learning and reasoning</p></article><article><span>Abstractions</span><p>Represent what matters</p></article><article><span>Randomness and creativity</span><p>What is the difference?</p></article></div>,
    note: "Let’s focus on the first AI research agenda. Read every Dartmouth item and connect it to a later part of this course. The wording is historical, but the questions about language, abstraction, learning, and self-improvement still organize major areas of AI.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Knowledge point 4 · General areas of AI",
    title: "AI divides intelligence into researchable subfields",
    minutes: 2,
    content: <div className="ai-area-map"><ul><li>Perception and the ability to move and manipulate objects</li><li>Knowledge representation</li><li>Natural language processing and understanding</li><li>Machine learning</li><li>Reasoning: knowledge-based or expert systems</li></ul><ul><li>Planning</li><li>Problem solving</li><li>Complex decision making</li><li>Abstract thought or creativity</li></ul><aside><strong>Scope of AI</strong><p>What system is considered intelligent?</p></aside></div>,
    note: "On this page, we are focusing on AI divides intelligence into researchable subfields. Notice all nine named areas. The important idea is that deployed systems often combine several subfields.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Knowledge point 5 · Directions of AI",
    title: "Scope and evaluation distinguish weak AI from strong AI",
    minutes: 2,
    content: <div className="ai-directions"><section><article><span>Weak AI</span><h3>AI with specific intelligent abilities</h3></article><article><span>Strong AI</span><h3>AI with general intelligence</h3></article><SourceCallout title="Current term: AGI">Artificial General Intelligence usually refers to broad competence that transfers across many unfamiliar intellectual tasks; the term is not perfectly standardized.</SourceCallout></section><div><span>Direction of AI research</span><p>From <strong>thinking humanly</strong> and <strong>acting humanly</strong></p><i>↓</i><p>To <strong>thinking rationally</strong> and <strong>acting rationally</strong></p><small>through logical reasoning and a measure of optimal or ideal decision making</small></div></div>,
    note: "On this page, we are focusing on Scope and evaluation distinguish weak AI from strong AI. The important idea is that weak/strong describes scope, while humanly/rationally describes the evaluation target. AGI is a modern, not perfectly standardized term often associated with broad transferable capability.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Knowledge point 6 · Turing Test",
    title: "The imitation game operationalizes acting humanly",
    minutes: 2,
    content: <div className="source-figure-explain"><CourseImage alt="Turing Test diagram with a human, an interrogator, and a computer connected by hidden communication channels" name="turing-test-diagram.png" /><div><span className="turing-theory-label">Alan Turing · theory of computability</span><h3>“Can machines think?” becomes an observable test.</h3><p>The Turing Test measures an intelligent machine’s performance against a human through the imitation game.</p><ul><li>The interrogator tries to determine which player—A or B—is the computer.</li><li>Can a system that passes be considered as intelligent as a human?</li><li>Chatbots include ELIZA (1966), social-media messengers, and later systems.</li></ul></div></div>,
    note: "On this page, we are focusing on The imitation game operationalizes acting humanly. Notice the exact diagram uncropped. Identify the evaluator, hidden participants, observable evidence, and criterion of success.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Turing Test · classroom demonstration",
    title: "A transcript can support imitation without explaining intelligence",
    minutes: 4,
    content: <TuringMiniLab />,
    note: "On this page, we are focusing on A transcript can support imitation without explaining intelligence. Take a moment to vote before debriefing. The correct instructional move is not to reveal a hidden machine identity; it is to inspect what the transcript can justify.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Turing Test · importance and criticisms",
    title: "Human imitation and intelligence are overlapping—not identical—sets",
    minutes: 2,
    content: <TuringCritique />,
    note: "Let’s focus on the difference between imitating a human and demonstrating intelligence. Read the five arguments and use the Venn diagram to separate the two ideas. With your group, defend one criticism of the Turing Test and name evidence that could answer that criticism.",
    sourceSlides: [23, 24],
  },
  {
    eyebrow: "Knowledge point 7 · Evolution and future",
    title: "AI evolved through optimism, setbacks, practical systems, and new questions",
    minutes: 2,
    content: <EvolutionFuture />,
    note: "On this page, we are focusing on AI evolved through optimism, setbacks, practical systems, and new questions. Both source topics are visible together. Notice the early/modern method lists, collective intelligence, strong/weak AI claims, coexistence, ethics, Industry 4.0/IoT context, and work questions. Let’s discuss historical claims critically in light of current systems.",
    sourceSlides: [25, 26],
  },
  {
    eyebrow: "Course purpose · study guide",
    title: "Knowledge grows from explanation to innovation",
    minutes: 2,
    content: <CourseStudyGuide />,
    note: "On this page, we are focusing on Knowledge grows from explanation to innovation. The course focus and full five-level ladder are visible together. This connects “teach” to explaining AI to nontechnical audiences age 5 and up.",
    sourceSlides: [27, 28],
  },
  {
    eyebrow: "Meeting 2 · cumulative review · part 1",
    title: "Retrieve the definitions, capabilities, agents, and environments",
    minutes: 2,
    content: <ReviewQuestions questions={reviewOne} />,
    note: "Let’s retrieve the definitions, capabilities, agents, and environment dimensions from the lesson. Use the thirteen prompts as a practice bank. A complete answer should include a definition, a concrete example, and a boundary explaining what the available evidence does not establish.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Meeting 2 · cumulative review · part 2",
    title: "Evaluate intelligence claims, the Turing Test, and possible futures",
    minutes: 2,
    content: <ReviewQuestions questions={reviewTwo} />,
    note: "Let’s evaluate claims about intelligence, the Turing Test, and possible futures. With a partner, choose one question and build an answer containing a clear claim, supporting evidence, a reasonable counterargument, and one remaining uncertainty.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Meeting 2 · exit assessment and references",
    title: "Explain the most important ideas with evidence",
    minutes: 3,
    content: <ImportantPointsAndReferences />,
    note: "On this page, we are focusing on Explain the most important ideas with evidence. The course materials do not provide keyed answers. Before leaving this page, write one response to the exit prompt and score definition, example, evidence, and boundary.",
    sourceSlides: [31, 32],
  },
];

const lesson02InstructorSpeech = [
  "An intelligent agent is a system situated in an environment. It receives information through sensors or data interfaces, chooses an action, and affects what happens next. The boundary matters. For a delivery robot, the robot and its controller may be the agent, while hallways, people, doors, and weather belong to the environment. For a recommendation service, the boundary may include the ranking model but not the user. We will use the agent view to turn the vague word intelligence into an engineering specification: what can the system perceive, what can it do, what counts as success, and what conditions make the task difficult?",
  "The lesson moves from vocabulary to design. First we define agent, percept, action, function, program, architecture, and rationality. Then we classify the task environment because the same architecture does not fit every world. A simple reflex rule may work in a fully observable, static setting, but fail when information is hidden or actions have long-term consequences. Next we compare agent types and the additional information each one uses. Finally we examine the Turing Test and broader claims about intelligence. Keep one recurring example in mind and revise it as concepts appear. By the end, the design should be justified by the environment rather than selected because its diagram looks impressive.",
  "An agent perceives its environment and acts upon it. A percept is one item of information received at a moment; a percept sequence is the history received so far. An action is an operation the agent can perform. The environment includes everything relevant outside the agent boundary. This definition is deliberately broad. A thermostat, web crawler, robot, and conversational system can all be analyzed as agents even though their sensors and actions differ. Calling something an agent does not automatically call it intelligent. Intelligence and rationality depend on how effectively its action choices use available information to satisfy the performance measure. Start every analysis by drawing the boundary and labeling the information crossing it.",
  "Follow the loop in the diagram. Percepts enter through sensors. The agent uses its program and internal information to select an action. Actuators carry the action back into the environment, where the action may change the next percept. The notation P-star represents all possible percept sequences, not one current observation. The agent function maps each possible history to an action. History matters because the same current reading can require different behavior after different earlier events. A vacuum agent that just cleaned the left room knows more than one that has just started, even if both currently sense a clean square. The loop emphasizes interaction: perception changes action, and action changes future perception.",
  "The agent function is an abstract description of behavior: for every possible percept sequence, which action should be selected? The agent program is the concrete algorithm that implements some part of that mapping. The architecture is the platform on which the program runs, including processors, sensors, actuators, and supporting software. This distinction separates specification from implementation. Two programs on different robot bodies may attempt the same function, while one program placed on an architecture without the required sensor cannot implement it. The familiar equation agent equals architecture plus program is therefore a design reminder. Before judging the algorithm, check whether the hardware and interfaces make the required information and actions available.",
  "PEAS describes the task before we design the agent. P is the performance measure: what outcomes count as success? E is the environment. A is the actuator set, and S is the sensor set. For a vacuum agent, the performance measure might combine cleanliness, time, energy, and collisions. The environment includes rooms and dirt. Actions may include moving and sucking, while sensors report location and dirt status. The agent function then maps percept history to an action. Notice that PEAS does not itself choose the action; it specifies the problem and evaluation. If the performance measure rewards only dirt removed, the agent may waste energy moving forever. Clear objectives prevent an algorithm from becoming highly rational about the wrong score.",
  "A task environment is the external situation in which the agent operates, together with the aspects that influence success. It is not merely a physical place. A chess environment includes board states, legal moves, the opponent, and the game clock. A medical decision environment includes patient information, available tests, treatment choices, and uncertain outcomes. Classifying the environment helps identify what an agent must remember, predict, learn, and coordinate. The dimensions on the next pages are not labels to memorize in isolation. Each one has a design consequence. When a classification changes, ask which component of the agent must change with it.",
  "A fully observable environment provides all information needed for the next rational choice. A partially observable environment hides relevant facts or supplies noisy observations. Observability is relative to both sensors and the decision. A chess board may be fully observable for legal move choice, while a poker hand is partially observable because opponents' cards are hidden. A robot with cameras can still face partial observability when objects are occluded. The design consequence is internal state or belief: the agent must remember earlier observations or maintain possible explanations. More sensors do not automatically create full observability if the needed information cannot be measured reliably.",
  "In a deterministic environment, the current state and chosen action determine one next state. In a stochastic environment, the same action can lead to several outcomes with probabilities. A slippery robot may attempt to move right and sometimes drift. Uncertainty can also reflect an incomplete model, so distinguish true environmental randomness from missing knowledge. Determinism does not guarantee easy planning; chess is deterministic but has an enormous decision space. Stochasticity does not make rational choice impossible; it changes the calculation from predicting one outcome to comparing distributions of outcomes. The agent needs transition probabilities, risk preferences, or learning mechanisms appropriate to the uncertainty.",
  "An episodic task can be divided into independent cases. The action for one case does not affect later cases. Classifying a fixed batch of unrelated images is approximately episodic. A sequential task has consequences that carry forward: a driving maneuver changes position, risk, and future options. Many tasks that look episodic become sequential when learning or resource use is included. A spam filter's individual classifications may be independent at inference time, but user feedback can update the model for later messages. The design consequence is planning and memory. Sequential agents must consider delayed outcomes rather than judging each action only by its immediate result.",
  "A static environment does not change while the agent is deciding. A dynamic environment may change independently during deliberation. A crossword puzzle is usually static; road traffic is dynamic. Semi-dynamic tasks keep the world fixed while the performance measure changes, as when a chess clock continues running. Do not confuse the agent's own movement with environmental dynamics. A puzzle state changes when the agent acts, yet it can remain static while the agent thinks. Dynamic settings require timely sensing, continual updating, and sometimes rapid approximate decisions. A perfect answer delivered after the situation has changed may be less rational than a good answer delivered in time.",
  "Discrete environments use countable states, percepts, actions, or time steps. Continuous environments include quantities such as position, speed, steering angle, temperature, or time. Many real tasks are mixed. A robot may choose a discrete command such as turn left while controlling continuous velocity. The classification depends on the representation as well as the world. We can discretize a continuous space into grid cells, but that approximation may lose important detail. Continuous tasks often require estimation and control methods, while discrete tasks often support explicit search or logic. The important question is whether the representation is precise enough for safe and effective decisions.",
  "Known versus unknown concerns whether the agent knows the rules that connect actions to outcomes. This differs from observability. An environment can be fully observable but unknown if the agent sees the complete state yet does not know what an action will do. Learning can estimate that model. Single-agent environments are evaluated without another decision maker whose goals matter. Multi-agent environments contain agents whose actions influence one another. They may cooperate, compete, or do both. The design consequences include communication, coordination, opponent modeling, and strategic reasoning. A moving obstacle is not necessarily another agent; agency matters when its behavior is usefully modeled as goal-directed choice.",
  "A soccer game combines nearly every difficult dimension. It is partially observable because no player sees the complete field perfectly. It is stochastic because actions and physical outcomes vary. It is sequential because each move changes future possibilities, dynamic because the world changes while a player decides, and continuous in position and time. It is multi-agent because teammates and opponents choose strategically. Whether it is known depends on how much of the dynamics the agent already understands. Reveal the dimensions one at a time and connect each label to a design requirement: state estimation, prediction, planning, rapid control, communication, and opponent modeling. The classification is useful only when it changes how we build the agent.",
  "Environment classifications depend on stated assumptions. A delivery task can be discrete if represented as stops on a map or continuous if represented with precise motion. It can be deterministic in a simplified simulator and stochastic on real streets. Different groups may therefore produce different defensible labels. The goal is not to guess the instructor's secret adjective. State the modeling boundary, identify evidence, and explain the design consequence. In this activity, choose one scenario and defend every dimension. If another group disagrees, locate the different assumption. That discussion is valuable because real engineering begins by negotiating the problem definition rather than receiving a perfectly labeled world.",
  "A simple reflex agent chooses an action from the current percept using condition-action rules. If the square is dirty, suck; otherwise move. This design can be fast, transparent, and appropriate when the current percept contains all relevant information. It fails when two situations look the same now but require different actions because of hidden history. The diagram's flow is direct: sensors produce a percept, rules match a condition, and actuators execute the selected action. There is no internal model of unseen state and no explicit evaluation of future consequences. Simplicity is not automatically weakness. It becomes a mismatch only when the task requires information the architecture does not represent.",
  "A model-based reflex agent adds internal state. The state summarizes aspects of the world that are not visible in the current percept. Updating it requires a model of how the world changes and how the agent's actions affect it. A robot that briefly loses sight of a person can use prior location and motion to maintain an estimate. The agent still may use condition-action rules, but the conditions now apply to the estimated state rather than the raw percept alone. Internal state is not a perfect copy of reality. It is a representation that can be wrong, so the system may need uncertainty and correction from new observations. Memory helps only when its update model is appropriate.",
  "A goal-based agent evaluates possible futures according to whether they reach a desired state. The goal supplies direction that reflex rules lack. Instead of reacting immediately, the agent can search or plan through alternative action sequences. A navigation agent considers routes because reaching the destination is not determined by one local move. Goals also create flexibility: the same planning mechanism can pursue a different destination when the goal changes. However, a simple goal distinguishes success from failure without ranking two successful outcomes. If several routes reach the destination, the agent needs additional preferences such as time, safety, or energy. That limitation motivates utility on the next page.",
  "A utility-based agent uses a numerical preference measure to compare outcomes and tradeoffs. Reaching the destination may be the goal, while utility distinguishes a safe twenty-minute route from a risky fifteen-minute route. Under uncertainty, the agent can compare expected utility across possible outcomes. Utility is not happiness in a psychological sense; it is a formal representation of preference for the decision problem. Designing it is difficult because weights encode value judgments and can create unintended behavior. The agent rationally optimizes the utility function it is given. Therefore, utility design must be tested for loopholes, sensitivity, and whose preferences are represented.",
  "A learning agent improves some aspect of its behavior through experience. The performance element selects actions. The learning element modifies the performance element. The critic evaluates results against a standard, and the problem generator proposes exploratory actions that may produce informative experience. These roles separate acting, evaluating, updating, and exploring. In practice, one software component may perform several roles, but the conceptual separation helps diagnose failure. Poor behavior may come from weak action selection, misleading feedback, an ineffective update, or insufficient exploration. Learning does not remove the need for an objective and environment model. It changes how parts of the agent are acquired or adapted.",
  "The robot-design activity asks us to connect task properties to architecture. A predictable line-following robot may need only simple reflex rules. A home robot with occluded rooms needs internal state. A route-planning robot needs goals and search. A service robot balancing time, safety, comfort, and energy may need utility. A robot in an unfamiliar setting may need learning in addition to any of these structures. More complex is not automatically better. Every added component creates cost, data needs, and new failure modes. Defend the smallest architecture that represents the information and decisions the task requires, and state what change in the environment would force a redesign.",
  "The Dartmouth proposal named research questions that still organize AI: language, neural networks, computation, self-improvement, abstraction, randomness, creativity, and more. The historical wording reflects its time, but the agenda is strikingly durable. Connect each item to a modern course topic. Language leads to natural-language processing and large language models. Self-improvement connects to machine learning. Abstraction connects to representation and reasoning. The proposal also carried optimism that major progress could occur quickly. That optimism helped establish a field, but later setbacks remind us that naming a problem is not the same as solving it. Read history as both ambition and evidence about recurring difficulty.",
  "AI divides broad intelligence into researchable areas such as search, knowledge representation, reasoning, learning, language, perception, robotics, and multi-agent systems. This division allows precise methods and evaluations, but deployed systems often combine several areas. A self-driving vehicle uses perception, state estimation, planning, control, learning, and interaction with other agents. The subfields are therefore lenses, not sealed boxes. When examining a system, identify which capabilities are present and how information flows among them. A failure may occur at an interface: excellent perception can still feed a poor planner, while a strong planner can act badly from incorrect state estimates.",
  "Weak AI and strong AI concern scope. Weak or narrow AI is built for specific tasks, while strong AI refers to broad general intelligence. Acting humanly, thinking humanly, thinking rationally, and acting rationally describe different evaluation traditions. A system can act rationally without imitating a person, and it can imitate human conversation without using human cognitive mechanisms. These axes should not be collapsed into one ladder. State which claim is being made: task performance, behavioral similarity, cognitive-model similarity, or rational decision quality. Evidence that supports one may not support the others. Precision prevents a narrow benchmark result from becoming a universal intelligence announcement.",
  "The imitation game operationalizes one aspect of acting humanly. An evaluator communicates without seeing the hidden participants and tries to distinguish a person from a machine. The test avoids requiring an agreed internal definition of intelligence; it asks whether behavior is convincingly human in the interaction. That is both its strength and its limitation. Passing can demonstrate conversational imitation under particular conditions, but it does not directly reveal internal understanding, consciousness, embodiment, or rationality. Inspect the diagram carefully: the evaluator, communication channel, hidden participants, and judgment procedure are all part of the test. Change those conditions and the evidence changes.",
  "A convincing transcript can support a claim about human-like conversation, but it cannot by itself explain the mechanism or establish every form of intelligence. A system may use stored responses, statistical prediction, reasoning tools, or a mixture. The transcript shows behavior at the interface. It does not reveal whether beliefs are grounded, whether factual claims are reliable, or whether the system can transfer to physical tasks. Before revealing the discussion answer, distinguish the tested claim from stronger claims. The right conclusion is neither that the test is meaningless nor that passing settles intelligence. It provides behavioral evidence with a defined scope.",
  "Human imitation and intelligence overlap, but they are not identical sets. Some human behavior is habitual, mistaken, or irrational. Some intelligent behavior may be unlike human behavior, as when a program searches millions of possibilities or uses a representation people do not. The Venn diagram helps us resist two assumptions: that everything human is intelligent and that everything intelligent must look human. Evaluate a system according to the task and the evidence needed, while recognizing when human compatibility itself is the goal. A social assistant may need human-like communication, whereas a route optimizer may be better judged by safety and efficiency than by whether its calculations resemble a driver's thoughts.",
  "The timeline alternates optimism, setbacks, practical systems, and renewed questions. Early demonstrations generated ambitious forecasts. Limits in computation, data, representations, and evaluation produced periods of reduced funding and confidence. Expert systems delivered value in bounded domains but exposed maintenance and brittleness problems. Statistical learning and larger datasets opened new capabilities, followed by modern deep learning and generative systems. The lesson is not a simple march toward inevitable success. Progress depends on matching methods to problems, building infrastructure, and evaluating claims honestly. Each wave solves some limitations while creating new questions about reliability, resources, bias, safety, and meaning.",
  "The knowledge ladder moves from remembering and explaining toward applying, analyzing, evaluating, and creating. In this course, memorizing definitions is necessary but not sufficient. You should be able to use PEAS to specify a task, classify an environment with stated assumptions, choose an agent architecture, and evaluate evidence for an intelligence claim. Higher levels do not discard foundational knowledge; they depend on it. Creation means designing a defensible system or experiment, not merely producing something new. Use the ladder as a study guide: if you can define stochastic but cannot explain how it changes agent design, the concept is not yet ready for transfer.",
  "This review page retrieves the lesson's core vocabulary. For each prompt, answer in three parts: define the term, give a concrete example, and state a boundary or common confusion. For instance, fully observable does not mean known, and deterministic does not mean easy. Retrieval should happen before looking back at the slides because the effort of reconstructing an answer strengthens memory and reveals gaps. If an answer is vague, return to the agent loop and ask what information enters, what action leaves, and what feature of the environment creates the difficulty. The questions are a practice bank, not a list to read silently.",
  "The second review asks for evaluation rather than recall. Build an answer with a claim, evidence, counterargument, and remaining uncertainty. When discussing the Turing Test, specify what behavior is observed and what stronger conclusions remain unsupported. When discussing strong AI or possible futures, distinguish current evidence from speculation. Reasonable people may disagree, but a defensible answer makes its assumptions visible. Pair discussion is useful because another person can expose an unstated leap from performance on one task to general intelligence. The purpose is not to eliminate uncertainty; it is to reason responsibly within it.",
  "The exit page collects the most important ideas. Explain an agent as a perception-action system, define its task with PEAS, classify the environment, and justify an architecture. Then connect those engineering ideas to broader questions about AI scope and the evidence supplied by behavioral tests. Your response should include a definition, example, evidence, and boundary. A strong answer does not merely say that a system is intelligent; it names the demonstrated capability and the conditions under which it was observed. Use the references to revisit agent design and the Turing Test in more depth. This foundation will support later search, probability, learning, and decision-making lessons.",
];

const slidesWithInstructorSpeech = slides.map((slide, index) => ({
  ...slide,
  note: `${slide.note} ${lesson02InstructorSpeech[index]}`,
}));

export function AiFoundationsDeck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return <L01DeckShell forcePrintAll={forcePrintAll} hoverEffects meetingLabel="Module 2 · Lesson 2" meetingTitle="Intelligent Agents, Task Environments, and the Turing Test" notesMode="instructor" slides={slidesWithInstructorSpeech} />;
}
