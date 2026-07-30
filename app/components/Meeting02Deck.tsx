"use client";

import { type ReactNode, useState } from "react";
import { L01DeckShell, type LessonSlide } from "./L01DeckShell";

const sourceRoot = "/course-source/l01-ai";

function ConceptImage({ name, alt }: { name: string; alt: string }) {
  return <figure className="source-concept"><img alt={alt} src={`/concepts/${name}.webp`} /></figure>;
}

function CourseImage({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  const source = `${sourceRoot}/${name}`;
  return (
    <figure className={`source-figure ${className}`.trim()}>
      <a aria-label={`Enlarge: ${alt}`} href={source} rel="noreferrer" target="_blank">
        <img alt={alt} src={source} />
      </a>
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
    eyebrow: "Week 1 · Meeting 2",
    title: "Intelligent Agents",
    minutes: 2,
    subtitle: "Task environments, agent architectures, AI directions, and the Turing Test",
    content: <div className="source-hero"><div><p>Intelligence becomes an engineering problem when a system must perceive, choose, and act.</p><span>Today: define the agent, classify its world, and justify its design.</span></div><ConceptImage alt="An intelligent agent interacting with an environment" name="agent-loop" /></div>,
    note: "Open by asking students to identify the agent boundary in one familiar AI system. [Sources] Russell & Norvig 3e, Ch. 2; Luger 6e, Ch. 1.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Learning objectives",
    title: "Move from a definition to a defensible agent design",
    minutes: 2,
    content: <div className="source-objectives"><article><span>01</span><h3>Define</h3><p>Agent, percept, action, function, program, architecture, and rationality.</p></article><article><span>02</span><h3>Classify</h3><p>Seven properties of task environments and their design consequences.</p></article><article><span>03</span><h3>Compare</h3><p>Simple reflex, model-based, goal-based, and utility-based agents.</p></article><article><span>04</span><h3>Evaluate</h3><p>Weak/strong AI claims and the evidence provided by the Turing Test.</p></article></div>,
    note: "Use these objectives as the organizing questions for the meeting. Each section ends with classification or evaluation practice.",
    sourceSlides: [11, 12, 13, 15, 21, 22],
  },
  {
    eyebrow: "Knowledge point 1 · Agent definition",
    title: "An agent perceives an environment and acts upon it",
    minutes: 3,
    content: <div className="agent-definition"><blockquote>An agent is anything that can be viewed as <strong>perceiving</strong> its environment through <strong>sensors</strong> and <strong>acting</strong> upon that environment through <strong>actuators</strong>.</blockquote><div><article><span>Human agent</span><p>Eyes, ears, and other organs serve as sensors; hands, legs, mouth, and other body parts serve as actuators.</p></article><article><span>Robotic agent</span><p>Cameras and infrared range finders serve as sensors; various motors serve as actuators.</p></article></div></div>,
    note: "Keep the complete definition visible. Ask students to mark the agent boundary, environment, sensors, and actuators in a chatbot and an autonomous car. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Agent definition · exact model",
    title: "Percepts flow in; actions flow out",
    minutes: 2,
    content: <div className="source-figure-explain"><CourseImage alt="Agent environment diagram labeled environment, percepts, sensors, agent, actions, and actuators" name="agent-environment-loop.png" /><div><h3>Read every arrow and label</h3><ul><li>The environment produces <strong>percepts</strong>.</li><li>Sensors deliver percepts to the agent.</li><li>The agent selects an <strong>action</strong>.</li><li>Actuators affect the environment.</li></ul><div className="source-formula">f : P* → A</div><p>The agent function maps <strong>possible percept sequences (P*)</strong> to actions—not only the current percept.</p></div></div>,
    note: "The figure is knowledge-bearing; keep it uncropped and inspect every label. P* denotes possible percept sequences, not only the current percept. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Agent definition · implementation and rationality",
    title: "The function is abstract; the program runs on an architecture",
    minutes: 2,
    content: <div className="architecture-equation"><div><span>Agent program</span><p>Implements the mapping from percept histories to actions.</p></div><b>+</b><div><span>Physical architecture</span><p>Provides the computational and embodied machinery on which the program runs.</p></div><b>=</b><div><span>Agent</span><p><strong>agent = architecture + program</strong></p></div><aside><strong>Rational-agent criterion</strong><p>For each possible percept sequence, select the action <strong>expected to maximize the performance measure</strong>, given the percept evidence and built-in knowledge.</p><small>Rational does not mean omniscient, always successful, or morally good.</small></aside></div>,
    note: "Distinguish agent function from agent program. Rationality depends on the performance measure, evidence from the percept sequence, prior knowledge, and available actions. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [11],
  },
  {
    eyebrow: "Textbook extension · PEAS and two-location vacuum world",
    title: "PEAS defines success; the agent function defines a response",
    minutes: 4,
    content: <VacuumPeasLab />,
    note: "This worked laboratory extends the historical agent-definition sequence with the textbook PEAS framework and two-location vacuum world. Connect it to f : P* → A, have students predict each action before revealing its rationale, then change one PEAS assumption and identify which actions would change. [Sources] Russell & Norvig 3e, Ch. 2; revised course plan.",
    sourceSlides: [11, 12, 13],
  },
  {
    eyebrow: "Knowledge point 2 · Task environments",
    title: "A task environment specifies the problem the agent must solve",
    minutes: 2,
    content: <div className="task-environment-boundary"><section><ConceptImage alt="An agent, its task, and relevant external conditions" name="task-environment" /><h3>A task environment includes</h3><p>The external states, entities, events, information, and constraints relevant to choosing and evaluating the agent’s actions.</p></section><section><ConceptImage alt="An irrelevant object outside the task environment" name="not-task-environment" /><h3>It does not automatically include</h3><p>Every fact about the universe, the agent’s source code, or details that cannot affect its percepts, choices, or performance.</p></section><SourceCallout title="Diagnostic question">Could changing this feature alter what the agent perceives, should do, or how success is measured?</SourceCallout></div>,
    note: "Examples: a chessboard position is part of the chess task environment; the color of the table usually is not. Task relevance depends on the stated performance measure. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [12, 13],
  },
  {
    eyebrow: "Task-environment property 1",
    title: "Fully observable vs. partially observable",
    minutes: 2,
    content: <Dimension left="Fully observable" right="Partially observable" leftDefinition="Sensors detect all aspects of the environment relevant to choosing an action." rightDefinition="Relevant information is missing, noisy, inaccurate, or impossible to measure." details={<>With other agents, their actions may be observable while their intentions remain hidden.</>} leftExample="Chess board state" rightExample="Driving among people" leftVisual="fully-observable" rightVisual="partially-observable" />,
    note: "Observability is relative to the agent’s sensors and the information required for action—not to whether a human observer knows everything. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Task-environment property 2",
    title: "Deterministic vs. stochastic",
    minutes: 2,
    content: <Dimension left="Deterministic" right="Stochastic" leftDefinition="The current state and executed action completely determine the next state." rightDefinition="The next state has uncertainty associated with it." details={<>Uncertainty may come from randomness, an inadequate environment model, or incomplete sensor coverage.</>} leftExample="A legal chess move" rightExample="A kick in a soccer match" leftVisual="deterministic" rightVisual="stochastic" />,
    note: "Do not equate stochastic only with randomness; uncertainty can also reflect incomplete models and sensing. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Task-environment property 3",
    title: "Episodic vs. sequential",
    minutes: 2,
    content: <Dimension left="Episodic" right="Sequential" leftDefinition="Experience is divided into atomic episodes; the next episode does not depend on prior actions." rightDefinition="Current decisions affect future decisions or rely on earlier decisions." details={<>An expert-advice system can be episodic when one episode is a single question and answer.</>} leftExample="Independent item classification" rightExample="A soccer match" leftVisual="episodic" rightVisual="sequential" />,
    note: "Ask whether a spam filter is episodic if its later model updates depend on earlier labels. The answer changes with the system boundary. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [12],
  },
  {
    eyebrow: "Task-environment property 4",
    title: "Static vs. dynamic",
    minutes: 2,
    content: <Dimension left="Static" right="Dynamic" leftDefinition="Nothing other than the agent changes while it is deciding." rightDefinition="The environment may change while the agent is deciding." details={<>Other agents make an environment dynamic. The agent moving to another location does not by itself make the environment dynamic, although it can create a similar design effect.</>} leftExample="Crossword puzzle on paper" rightExample="Taxi driving" leftVisual="static" rightVisual="dynamic" />,
    note: "Keep the important nuance about agent motion versus independent environmental change. A clock can also make an otherwise static task semidynamic. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Task-environment property 5",
    title: "Discrete vs. continuous",
    minutes: 2,
    content: <Dimension left="Discrete" right="Continuous" leftDefinition="Time or state advances in fixed steps, often with one measurement and perhaps one action per step." rightDefinition="Signals arrive continually and actions or states vary over continuous ranges." details={<>Chess is discrete. Taxi driving is continuous: position, speed, steering angle, and sensor signals vary continuously.</>} leftExample="Chess" rightExample="Taxi driving" leftVisual="discrete" rightVisual="continuous" />,
    note: "A task may mix discrete decisions with continuous perception and control. Require students to state which variable they are classifying. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Task-environment properties 6 and 7",
    title: "Known vs. unknown; single-agent vs. multi-agent",
    minutes: 2,
    content: <div className="paired-dimensions-lesson"><div className="paired-dimensions"><article><ConceptImage alt="A known task environment with given outcomes" name="known" /><span>Known</span><p>Outcomes for all actions are given.</p></article><article><ConceptImage alt="An unknown environment being learned" name="unknown" /><span>Unknown</span><p>The agent must learn how the environment works.</p></article><article><ConceptImage alt="One agent operating alone" name="single-agent" /><span>Single-agent</span><p>Only one agent’s decisions determine performance.</p></article><article><ConceptImage alt="Several agents interacting" name="multi-agent" /><span>Multi-agent</span><p>Other agents cooperate, compete, or otherwise alter outcomes.</p></article></div><SourceCallout title="Do not confuse two dimensions">A card game can be <b>known</b> because its rules are given and still <b>partially observable</b> because an opponent’s cards are hidden.</SourceCallout></div>,
    note: "Known concerns the action model, not observability. An environment can be fully observable yet unknown. Multi-agent classification depends on whether other entities should be modeled as agents. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [13],
  },
  {
    eyebrow: "Task environments · worked example",
    title: "Classify a single soccer game",
    minutes: 4,
    content: <SoccerReveal />,
    note: "Reveal all seven source classifications one at a time: partially observable, stochastic, sequential, dynamic, continuous, unknown, and multi-agent. Require a reason for each. [Sources] Course soccer example.",
    sourceSlides: [14],
  },
  {
    eyebrow: "Task environments · in-class practice",
    title: "The classification depends on stated assumptions",
    minutes: 3,
    content: <EnvironmentPractice />,
    note: "Groups classify one scenario, then compare with another group. Differences are acceptable when the assumed boundary or performance measure differs and the reasoning is explicit.",
    sourceSlides: [12, 13, 14],
  },
  {
    eyebrow: "Knowledge point 3 · Simple reflex agent",
    title: "A simple reflex agent acts on the current percept",
    minutes: 2,
    content: <div className="architecture-slide"><CourseImage alt="Simple reflex agent architecture with condition-action rules" name="agent-simple-reflex.png" /><div><h3>Condition–action rules choose what to do now.</h3><ul><li>Uses only the current percept.</li><li>Ignores the rest of percept history.</li><li>Succeeds only when the environment is fully observable.</li><li>Can enter infinite loops in partially observable environments.</li></ul><SourceCallout title="Reflex and examples">A reflex is an action performed as a response to a stimulus without conscious thought. Source examples: a ZIP-code mail sorter and a Mars rover.</SourceCallout></div></div>,
    note: "Keep the complete source figure uncropped and large enough to read every label and arrow. Trace sensors → current world state → condition-action rule → action → effectors. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Knowledge point 3 · Model-based agent",
    title: "Internal state represents what cannot currently be seen",
    minutes: 2,
    content: <div className="architecture-slide"><CourseImage alt="Model-based reflex agent architecture with state, world evolution, and action effects" name="agent-model-based.png" /><div><h3>A simple reflex agent with internal state handles partial observability.</h3><ul><li>Stores a current state inside the agent.</li><li>Maintains a structure describing parts of the world that cannot be seen.</li><li>Uses how the world evolves.</li><li>Uses what its own actions do.</li></ul></div></div>,
    note: "Trace the three information sources entering the state update. Ask what happens when the internal model is wrong. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [15],
  },
  {
    eyebrow: "Knowledge point 3 · Goal-based agent",
    title: "Goals let the agent compare possible futures",
    minutes: 2,
    content: <div className="architecture-comparison"><article><CourseImage alt="Model-based agent architecture" name="agent-model-based.png" /><span>Model-based</span><p>Represents the current world.</p></article><i>→</i><article><CourseImage alt="Goal-based agent architecture with predicted outcomes and goals" name="agent-goal-based.png" /><span>Goal-based</span><p>Adds reasoning or inference and goals, then selects among possibilities that reach a goal state.</p></article></div>,
    note: "The repeated model-based figure is intentional. Ask students to identify exactly what the goal-based architecture adds: predicted consequences and a goal test. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [16],
  },
  {
    eyebrow: "Knowledge point 3 · Utility-based agent",
    title: "Utility ranks successful outcomes and tradeoffs",
    minutes: 2,
    content: <div className="architecture-comparison"><article><CourseImage alt="Goal-based agent architecture" name="agent-goal-based.png" /><span>Goal-based</span><p>Distinguishes goal states from non-goal states. A shopping list specifies a goal.</p></article><i>→</i><article><CourseImage alt="Utility-based agent architecture with utility and expected happiness of states" name="agent-utility-based.png" /><span>Utility-based</span><p>Adds rational decision making: “How happy I will be in such a state.” If several actions reach the goal, rank them by lowest price, fastest completion, risk, or another utility.</p></article></div>,
    note: "The figure’s Utility input and happiness label are knowledge-bearing. Explain that utility ranks outcomes; it does not guarantee that the chosen utility function is appropriate. [Sources] Russell & Norvig 3e, Ch. 2.",
    sourceSlides: [17],
  },
  {
    eyebrow: "Knowledge point 3 · Learning agent · textbook extension",
    title: "A learning agent changes how it acts from experience",
    minutes: 2,
    content: <div className="learning-agent-layout"><LearningAgentDiagram /><div><article><strong>Performance element</strong><p>Selects actions from current knowledge.</p></article><article><strong>Critic</strong><p>Evaluates behavior against a performance standard.</p></article><article><strong>Learning element</strong><p>Uses feedback to change the performance element.</p></article><article><strong>Problem generator</strong><p>Suggests exploratory actions that may produce useful experience.</p></article><SourceCallout title="Design question">Which component is missing if the agent acts, receives a score, but never changes future behavior?</SourceCallout></div></div>,
    note: "This page completes the revised course plan’s architecture list. Trace one robot-vacuum failure through critic → learning element → changed performance element. [Sources] Russell & Norvig 3e, Ch. 2; revised course plan.",
    sourceSlides: [15, 16, 17],
  },
  {
    eyebrow: "Agent architectures · student participation",
    title: "Which agent type should build each robot?",
    minutes: 4,
    content: <RobotPractice />,
    note: "The source provides no official answers. Accept multiple architectures when students identify the assumption that makes the extra capability necessary.",
    sourceSlides: [18],
  },
  {
    eyebrow: "Knowledge point 4 · Dartmouth, 1956",
    title: "The first AI agenda named questions that still organize the field",
    minutes: 2,
    content: <div className="dartmouth-map"><article><span>Automatic computers</span><p>A program that simulates the machine</p></article><article><span>Language</span><p>How can a computer use language the way humans use and manipulate words?</p></article><article><span>Neuron networks</span><p>Networks of simple processing units</p></article><article><span>Calculation</span><p>Theory of the size of a calculation</p></article><article><span>Self-improvement</span><p>Learning and reasoning</p></article><article><span>Abstractions</span><p>Represent what matters</p></article><article><span>Randomness and creativity</span><p>What is the difference?</p></article></div>,
    note: "Preserve every Dartmouth item. Ask students which later course module addresses each question. [Sources] Dartmouth proposal, 1955/1956.",
    sourceSlides: [19],
  },
  {
    eyebrow: "Knowledge point 4 · General areas of AI",
    title: "AI divides intelligence into researchable subfields",
    minutes: 2,
    content: <div className="ai-area-map"><ul><li>Perception and the ability to move and manipulate objects</li><li>Knowledge representation</li><li>Natural language processing and understanding</li><li>Machine learning</li><li>Reasoning: knowledge-based or expert systems</li></ul><ul><li>Planning</li><li>Problem solving</li><li>Complex decision making</li><li>Abstract thought or creativity</li></ul><aside><strong>Scope of AI</strong><p>What system is considered intelligent?</p></aside></div>,
    note: "Keep all nine named areas. Explain that deployed systems often combine several subfields. [Sources] Luger 6e, Ch. 1; Russell & Norvig 3e, Ch. 1.",
    sourceSlides: [20],
  },
  {
    eyebrow: "Knowledge point 5 · Directions of AI",
    title: "Scope and evaluation distinguish weak AI from strong AI",
    minutes: 2,
    content: <div className="ai-directions"><section><article><span>Weak AI</span><h3>AI with specific intelligent abilities</h3></article><article><span>Strong AI</span><h3>AI with general intelligence</h3></article><SourceCallout title="Current term: AGI">Artificial General Intelligence usually refers to broad competence that transfers across many unfamiliar intellectual tasks; the term is not perfectly standardized.</SourceCallout></section><div><span>Direction of AI research</span><p>From <strong>thinking humanly</strong> and <strong>acting humanly</strong></p><i>↓</i><p>To <strong>thinking rationally</strong> and <strong>acting rationally</strong></p><small>through logical reasoning and a measure of optimal or ideal decision making</small></div></div>,
    note: "Explain that weak/strong describes scope, while humanly/rationally describes the evaluation target. AGI is a modern, not perfectly standardized term often associated with broad transferable capability. [Sources] Russell & Norvig 3e, Ch. 1; course directions.",
    sourceSlides: [21],
  },
  {
    eyebrow: "Knowledge point 6 · Turing Test",
    title: "The imitation game operationalizes acting humanly",
    minutes: 2,
    content: <div className="source-figure-explain"><CourseImage alt="Turing Test diagram with a human, an interrogator, and a computer connected by hidden communication channels" name="turing-test-diagram.png" /><div><span className="turing-theory-label">Alan Turing · theory of computability</span><h3>“Can machines think?” becomes an observable test.</h3><p>The Turing Test measures an intelligent machine’s performance against a human through the imitation game.</p><ul><li>The interrogator tries to determine which player—A or B—is the computer.</li><li>Can a system that passes be considered as intelligent as a human?</li><li>Chatbots include ELIZA (1966), social-media messengers, and later systems.</li></ul></div></div>,
    note: "Keep the exact diagram uncropped. Identify the evaluator, hidden participants, observable evidence, and criterion of success. [Sources] Turing 1950; course Turing Test diagram.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Turing Test · classroom demonstration",
    title: "A transcript can support imitation without explaining intelligence",
    minutes: 4,
    content: <TuringMiniLab />,
    note: "Let students vote before debriefing. The correct instructional move is not to reveal a hidden machine identity; it is to inspect what the transcript can justify. [Sources] Turing 1950; ELIZA example.",
    sourceSlides: [22],
  },
  {
    eyebrow: "Turing Test · importance and criticisms",
    title: "Human imitation and intelligence are overlapping—not identical—sets",
    minutes: 2,
    content: <TuringCritique />,
    note: "Read all five arguments and the exact Venn diagram. Ask each group to defend one criticism and name evidence that would address it. [Sources] Course critique diagram; Turing 1950; Ada Lovelace objection.",
    sourceSlides: [23, 24],
  },
  {
    eyebrow: "Knowledge point 7 · Evolution and future",
    title: "AI evolved through optimism, setbacks, practical systems, and new questions",
    minutes: 2,
    content: <EvolutionFuture />,
    note: "Both source topics are visible together. Preserve the early/modern method lists, collective intelligence, strong/weak AI claims, coexistence, ethics, Industry 4.0/IoT context, and work questions. Discuss historical claims critically in light of current systems. [Sources] Luger 6e, Ch. 1; course evolution and future discussion.",
    sourceSlides: [25, 26],
  },
  {
    eyebrow: "Course purpose · study guide",
    title: "Knowledge grows from explanation to innovation",
    minutes: 2,
    content: <CourseStudyGuide />,
    note: "The course focus and full five-level ladder are visible together. Connect “teach” to explaining AI to nontechnical audiences age 5 and up. [Sources] Course focus and study guide.",
    sourceSlides: [27, 28],
  },
  {
    eyebrow: "Meeting 2 · cumulative review · part 1",
    title: "Retrieve the definitions, capabilities, agents, and environments",
    minutes: 2,
    content: <ReviewQuestions questions={reviewOne} />,
    note: "Use these thirteen prompts as a retrieval-practice bank. Require each answer to include a definition, example, and evidence boundary. [Sources] Course review questions 1.",
    sourceSlides: [29],
  },
  {
    eyebrow: "Meeting 2 · cumulative review · part 2",
    title: "Evaluate intelligence claims, the Turing Test, and possible futures",
    minutes: 2,
    content: <ReviewQuestions questions={reviewTwo} />,
    note: "Assign pairs one question, then require a claim, evidence, counterargument, and remaining uncertainty. [Sources] Course review questions 2.",
    sourceSlides: [30],
  },
  {
    eyebrow: "Meeting 2 · exit assessment and references",
    title: "Explain the most important ideas with evidence",
    minutes: 3,
    content: <ImportantPointsAndReferences />,
    note: "The course materials do not provide keyed answers. Collect one response to the exit prompt and score definition, example, evidence, and boundary. [Sources] Luger 6e, Ch. 1; Russell & Norvig 3e, Chs. 1–2.",
    sourceSlides: [31, 32],
  },
];

export function AiFoundationsDeck() {
  return <L01DeckShell meetingLabel="Week 1 · Meeting 2" meetingTitle="Intelligent Agents, Task Environments, and the Turing Test" slides={slides} />;
}
