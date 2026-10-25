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

type AppItem = [title: string, detail: string, visual: string];

function ApplicationGrid({ items, className = "" }: { items: AppItem[]; className?: string }) {
  return (
    <div className={`source-app-grid ${className}`.trim()}>
      {items.map(([title, detail, visual], index) => (
        <article key={title}>
          <ConceptImage alt={`${title} AI application`} name={visual} />
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{title}</h3>
          <p>{detail}</p>
        </article>
      ))}
    </div>
  );
}

function OilPuzzle() {
  const [step, setStep] = useState(0);
  const cookingOils = [
    ["peanut-oil.png", "Product image 1"],
    ["coconut-oil.png", "Product image 2"],
    ["corn-oil.png", "Product image 3"],
  ];
  return (
    <div className="oil-puzzle">
      <div className="oil-sequence" aria-live="polite">
        {cookingOils.map(([name, alt], index) => (
          <div className={step > index ? "revealed" : "waiting"} key={name}>
            {step > index ? <CourseImage alt={alt} name={name} /> : <span>{index + 1}</span>}
          </div>
        ))}
        <div className={step >= 4 ? "revealed final-pair" : "waiting final-pair"}>
          {step >= 4 ? (
            <>
              <CourseImage alt="Product image 4" name="baby-oil.png" />
              <b>???</b>
              <CourseImage alt="Photograph 5" name="baby.png" />
            </>
          ) : <span>4</span>}
        </div>
      </div>
      <div className="oil-controls">
        <p>{step === 0 ? "Study each image as it appears. What relationship do you infer?"
          : step < 4 ? "Update your hypothesis before the next image."
          : "Why does the final pair make the pattern difficult for a machine?"}</p>
        <div>
          <button disabled={step >= 4} onClick={() => setStep(value => Math.min(4, value + 1))} type="button">
            {step === 0 ? "Begin reveal" : "Reveal next"}
          </button>
          <button onClick={() => setStep(step === 4 ? 0 : 4)} type="button">{step === 4 ? "Reset" : "Reveal all"}</button>
        </div>
      </div>
    </div>
  );
}

function QuickCheck({
  question,
  options,
  correct,
  explanation,
}: {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  return (
    <div className="source-quick-check">
      <section><span>Check for understanding</span><h3>{question}</h3><p>Choose first. Then explain the criterion you used.</p></section>
      <div>
        {options.map((option, index) => (
          <button
            className={choice === index ? (index === correct ? "correct" : "incorrect") : ""}
            key={option}
            onClick={() => setChoice(index)}
            type="button"
          >
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </button>
        ))}
        {choice !== null && <p className="source-feedback"><strong>{choice === correct ? "Defensible." : "Reconsider."}</strong> {explanation}</p>}
      </div>
    </div>
  );
}

function TheoryColumns() {
  return (
    <div className="source-theory-columns">
      <article>
        <span>Single intelligence</span>
        <h3>One general intelligence</h3>
        <p>Psychometric testing uses <strong>IQ</strong> to estimate a general level of intelligence.</p>
        <SourceCallout title="Core assumption">Performance across cognitive tasks reflects a shared general capability.</SourceCallout>
      </article>
      <article>
        <span>Multiple intelligence</span>
        <h3>Several distinct capabilities</h3>
        <p>Different forms of intelligence may not reduce to one score. Emotional intelligence is often discussed through <strong>EQ</strong>.</p>
        <SourceCallout title="Evidence question">Are the proposed abilities independent, measurable intelligences—or useful descriptions?</SourceCallout>
      </article>
    </div>
  );
}

function TriarchicOverview() {
  const [active, setActive] = useState(0);
  const dimensions = [
    ["Analytical / componential", "Take apart problems and see solutions that are not often seen.", "“Book smart”"],
    ["Creative / experiential", "Perform in novel situations and automate processes through experience.", "Novelty + automation"],
    ["Practical / contextual", "Adapt mental activity to attain a fit with the surrounding context.", "“Street smarts”"],
  ];
  return (
    <div className="triarchic-overview">
      <nav>{dimensions.map((item, index) => <button className={active === index ? "active" : ""} key={item[0]} onClick={() => setActive(index)} type="button">{item[0]}</button>)}</nav>
      <section><span>Robert J. Sternberg</span><h3>{dimensions[active][0]}</h3><p>{dimensions[active][1]}</p><strong>{dimensions[active][2]}</strong></section>
    </div>
  );
}

const slides: LessonSlide[] = [
  {
    eyebrow: "Module 2 · Lesson 1",
    title: "Artificial Intelligence",
    minutes: 2,
    subtitle: "Applications, history, intelligence, and definitions",
    content: <div className="source-hero"><div><p>What is Artificial Intelligence?</p><span>CPSC 481 · Introduction to Artificial Intelligence</span></div><ConceptImage alt="A connected landscape of AI systems" name="ai-systems" /></div>,
    note: "Let’s focus on this idea: Artificial Intelligence. Begin with the central question of the course: what does it mean for a system to be intelligent? Name one system you consider intelligent and give one reason for your judgment.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Course orientation",
    title: "Introduction and syllabus",
    minutes: 5,
    content: <div className="orientation-layout"><div><h3>Today</h3><ul><li>Waitlist, roster, and introductions</li><li>Syllabus and course overview</li></ul><SourceCallout title="Introduce yourself">Name, preferred name, one AI system you have used, and one question you have about it.</SourceCallout></div><aside><span>Related courses</span><p>CPSC 483 · Introduction to Machine Learning</p><p>CPSC 485 · Computational Bioinformatics</p><p>CPSC 583 · Expert System Design</p><p>CPSC 585 · Artificial Neural Network</p></aside></div>,
    note: "Let’s focus on this idea: our course begins with both logistics and intellectual curiosity. After the enrollment and syllabus details, introduce yourself by naming an AI system you have used and one question you have about it. Your examples give us an early picture of the different meanings people attach to AI.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Knowledge point 1 · “State of the Art Applications” · 2020 snapshot",
    title: "AI acts in games, mobility, security, and robots",
    minutes: 2,
    content: <ApplicationGrid items={[
      ["Board games", "AlphaGo and AlphaZero", "history-alphago"],
      ["Autonomous cars", "Google Waymo; Tesla Autopilot; Audi summon feature; etc.", "taxi-environment"],
      ["Security", "Generative Adversarial Network (GAN): deepfake", "risk"],
      ["Robots", "Sophia; Boston Dynamics; Erica (anthropomorphic)", "agent-architecture"],
    ]} />,
    note: "Let’s focus on this idea: AI acts in games, mobility, security, and robots. For each example, name the task, the input, the output, and the evidence that would show success. An application name tells us where AI is used; it does not yet tell us which intelligent methods make the system work.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Knowledge point 1 · “State of the Art Applications” · 2020 snapshot",
    title: "AI also works through language, environments, expertise, and play",
    minutes: 2,
    content: <ApplicationGrid items={[
      ["Natural language processing", "Voice assistants: Google Duplex; Amazon Alexa; Apple Siri; etc.", "communication"],
      ["Internet of Things (IoT)", "Amazon cashierless store", "environment"],
      ["Expert systems", "IBM Watson", "reasoning"],
      ["Video games", "OpenAI-Dota 2", "decision"],
    ]} />,
    note: "Let’s focus on this idea: AI also works through language, environments, expertise, and play. Compare the examples. Which systems learn from data, which reason from encoded knowledge, and which combine several methods? The visible product may be simple even when the intelligence inside it is a coordinated pipeline.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Applications · in-class practice",
    title: "An application name does not explain where the intelligence is",
    minutes: 5,
    content: <div className="source-practice-grid application-decomposition"><ConceptImage alt="Students decomposing an AI system" name="guided-practice" /><div><h3>Choose one application from the previous two pages.</h3><ol><li>What task is being performed?</li><li>What information enters the system?</li><li>What action or prediction leaves it?</li><li>Which intelligent capability is required?</li><li>What evidence would demonstrate success?</li></ol><SourceCallout title="Share-out rule">Name the mechanism or capability—not only the product.</SourceCallout></div></div>,
    note: "Let’s focus on this idea: an application name does not explain where the intelligence is. Work with a partner for two minutes and separate the product, the model, and the behavior of the agent. Be ready to explain which component performs the intelligent work and what evidence supports your answer.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Knowledge point 2 · History",
    title: "Chess, language, learning, and the imitation game shaped the early agenda",
    minutes: 3,
    content: <div className="source-timeline illustrated">
      <article><ConceptImage alt="Early computer chess as a search problem" name="history-deep-blue" /><span>1950</span><h3>Claude Shannon</h3><p>“Programming a Computer for Playing Chess” is the first published article on developing a chess-playing computer program.</p></article>
      <article><ConceptImage alt="Alan Turing and the imitation game" name="history-turing" /><span>1950</span><h3>Alan Turing</h3><p>“Computing Machinery and Intelligence” proposes the “imitation game,” later known as the Turing Test.</p></article>
      <article><ConceptImage alt="The Dartmouth workshop where the AI research agenda was formed" name="history-dartmouth" /><span>1956</span><h3>First AI Conference at Dartmouth</h3><p>A program that simulates the machine; language use; neuron networks; self-improvement through learning and reasoning.</p></article>
    </div>,
    note: "On this page, we are focusing on Chess, language, learning, and the imitation game shaped the early agenda. The key point is the research questions, not only the dates. By the end, you should connect chess to search, language to representation, and self-improvement to learning.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Knowledge point 2 · History",
    title: "Robotics and expert systems produced important—but bounded—successes",
    minutes: 3,
    content: <div className="source-timeline illustrated">
      <article><ConceptImage alt="An anthropomorphic robot integrating control, vision, and conversation" name="agent-architecture" /><span>1970</span><h3>WABOT-1</h3><p>The first anthropomorphic robot at Waseda University: limb-control, vision, and conversation systems.</p></article>
      <article><ConceptImage alt="A rule-based medical expert system" name="history-mycin" /><span>1972</span><h3>MYCIN</h3><p>An early Stanford expert system identified bacteria causing severe infections and recommended antibiotics.</p></article>
      <article><ConceptImage alt="Computer chess culminating in Deep Blue" name="history-deep-blue" /><span>1997</span><h3>Deep Blue</h3><p>The first computer chess-playing program to defeat a reigning world chess champion.</p></article>
      <aside><strong>Historical tension</strong><p>No major breakthroughs in many years…</p></aside>
    </div>,
    note: "Let’s focus on this idea: robotics and expert systems produced important but bounded successes. For each system, identify what it could do and what it could not generalize to. The phrase “no major breakthroughs” helps us see a recurring pattern in AI history: high expectations, real progress, exposed limitations, and periods of reduced support.",
    sourceSlides: [4],
  },
  {
    eyebrow: "History · current bridge",
    title: "New methods broadened capability without removing the old questions",
    minutes: 2,
    content: <div className="source-comparison"><article><span>Earlier emphasis</span><h3>Symbols, search, rules, and explicit knowledge</h3><p>Programs were designed around formal representations and carefully specified domains.</p></article><i>+</i><article><span>Later emphasis</span><h3>Learning from data, large models, and deployed systems</h3><p>Statistical learning and foundation models expanded pattern recognition and generation.</p></article><SourceCallout title="Continuity">Representation, reasoning, learning, evaluation, and the meaning of intelligence remain central.</SourceCallout></div>,
    note: "On this page, we are focusing on New methods broadened capability without removing the old questions. Think of this as a bridge, not a replacement history. Modern systems still face the foundational questions introduced in the historical sequence.",
    sourceSlides: [3, 4],
  },
  {
    eyebrow: "Knowledge point 3 · Why AI is difficult",
    title: "Can a machine infer the intended concept?",
    minutes: 5,
    subtitle: "Advance the sequence one image at a time",
    content: <OilPuzzle />,
    note: "Let’s focus on this question: can a machine infer the intended concept? Watch the objects appear one at a time without naming the category too early. After peanut oil, coconut oil, and corn oil, form a hypothesis. When baby oil and the baby photograph appear, explain how the new context changes—or breaks—that hypothesis.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Why AI is difficult · debrief",
    title: "Words inherit meaning from context and world knowledge",
    minutes: 3,
    content: <div className="oil-debrief"><div className="oil-debrief-images"><CourseImage alt="Peanut oil bottle" name="peanut-oil.png" /><CourseImage alt="Coconut oil jar" name="coconut-oil.png" /><CourseImage alt="Corn oil bottle" name="corn-oil.png" /><CourseImage alt="Baby oil bottle" name="baby-oil.png" /><CourseImage alt="Baby photograph" name="baby.png" /></div><div><h3>“Peanut oil” names oil derived from peanuts. “Baby oil” names oil intended for babies.</h3><p>The same grammatical form does not guarantee the same semantic relation.</p><ul><li>Recognition: identify each object.</li><li>Language: interpret a compound noun.</li><li>World knowledge: reject an implausible relation.</li><li>Context: choose the intended meaning.</li></ul></div></div>,
    note: "On this page, we are focusing on Words inherit meaning from context and world knowledge. This connects the exercise to ambiguity, commonsense knowledge, semantic composition, and the limits of pattern matching. The exact objects are part of the knowledge point.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Knowledge point 4 · What is intelligence?",
    title: "Intelligence is a general mental capability",
    minutes: 3,
    content: <div className="intelligence-overview"><div><strong>Intelligence</strong><p>is a general mental capability.</p><small>It is different from being merely “smart” in the sense of quickly adapting to the environment.</small></div><ul><li>learning</li><li>recognition and understanding</li><li>reasoning</li><li>imagination or abstract thinking</li><li>creativity</li><li>communication</li><li>planning</li><li>decision making</li><li>problem solving</li></ul></div>,
    note: "On this page, we are focusing on Intelligence is a general mental capability. Notice the definition and all nine capabilities visible. Consider whether each capability is necessary, sufficient, or one contributor to intelligence.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Intelligent capabilities · perceive and infer",
    title: "Learning, recognition, understanding, and reasoning turn experience into conclusions",
    minutes: 3,
    content: <ApplicationGrid items={[
      ["Learning", "Change behavior or a model through data or experience.", "learning"],
      ["Recognition", "Identify a pattern, object, event, or category.", "perception"],
      ["Understanding", "Connect a representation to context, relations, and consequences.", "representation"],
      ["Reasoning", "Derive conclusions from evidence, knowledge, or assumptions.", "reasoning"],
    ]} />,
    note: "On this page, we are focusing on Learning, recognition, understanding, and reasoning turn experience into conclusions. Consider one counterexample for each capability: recognition without understanding, memorization without transfer, and logically valid reasoning from false premises.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Intelligent capabilities · imagine and communicate",
    title: "Imagination, abstract thinking, creativity, and communication extend beyond recognition",
    minutes: 3,
    content: <ApplicationGrid items={[
      ["Imagination", "Represent possibilities that are not currently perceived.", "predict"],
      ["Abstract thinking", "Retain relevant structure while ignoring incidental detail.", "model"],
      ["Creativity", "Produce ideas or artifacts that are novel and useful in context.", "creation"],
      ["Communication", "Exchange meaning with another agent or person.", "communication"],
    ]} />,
    note: "On this page, we are focusing on Imagination, abstract thinking, creativity, and communication extend beyond recognition. Consider whether generating a novel-looking artifact establishes creativity. A complete answer should include a criterion for novelty, usefulness, and context.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Intelligent capabilities · choose and act",
    title: "Planning, decision making, and problem solving organize action",
    minutes: 3,
    content: <ApplicationGrid className="three" items={[
      ["Planning", "Choose a sequence of future actions toward a goal.", "planning"],
      ["Decision making", "Select among alternatives under goals, costs, and uncertainty.", "decision"],
      ["Problem solving", "Represent a problem and search for a satisfactory solution.", "reasoning"],
    ]} />,
    note: "Let’s focus on this idea: planning, decision making, and problem solving organize action. A plan is a sequence of actions, while a decision chooses among alternatives. The course material also contrasts intelligence with being merely “smart,” described as adapting quickly to an environment; adaptation supports intelligent behavior but is not a separate item in this capability list.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Intelligence · formative assessment",
    title: "A capability claim needs observable evidence",
    minutes: 4,
    content: <QuickCheck question="A system labels a photograph correctly but cannot explain the object, use it, or recognize it from a new angle. Which claim is best supported?" options={["General intelligence", "Recognition on the tested examples", "Understanding", "Creative reasoning"]} correct={1} explanation="The evidence supports bounded recognition. Broader claims require transfer, explanation, use, and additional tests." />,
    note: "On this page, we are focusing on A capability claim needs observable evidence. Try to name one additional test that would support understanding rather than recognition alone.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Knowledge point 5 · Theories of intelligence",
    title: "One theory seeks a general factor; another separates kinds of ability",
    minutes: 3,
    content: <TheoryColumns />,
    note: "On this page, we are focusing on One theory seeks a general factor; another separates kinds of ability. Here we compare single general intelligence, multiple intelligence, IQ, and EQ exactly as distinct theoretical perspectives—not settled engineering specifications. One course-material claim says “Stephen Hawking: 280; Average: 90-110; >120 superior.” We should not present that Hawking number as fact; it is unsupported and should be used only as a source-verification example.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Theories of intelligence · multiple intelligence",
    title: "Gardner proposed several forms of intelligence",
    minutes: 3,
    content: <div className="multiple-intelligences"><div><span>logical</span><span>linguistic</span><span>spatial</span><span>musical</span><span>kinesthetic</span><span>interpersonal</span><span>intrapersonal</span><span>naturalist</span></div><aside><h3>Naturalist intelligence</h3><p>Sensing patterns and making connections to elements in nature.</p><h3>Emotional intelligence</h3><p>Associated with Daniel Goleman and others; often discussed using EQ.</p><SourceCallout title="Claim to evaluate">“Gardner’s theory has never been tested.” What would count as a fair test? The independence and measurement of the proposed intelligences remain contested.</SourceCallout></aside></div>,
    note: "Let’s focus on Gardner’s proposal of several forms of intelligence. Read each named form, then consider the empirical caution: can these abilities be measured independently, and do the measurements predict meaningful outcomes? Treat the categories as a theory to examine, not a settled engineering specification.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Knowledge point 6 · Triarchic theory",
    title: "Sternberg connects analytical, creative, and practical intelligence",
    minutes: 3,
    content: <TriarchicOverview />,
    note: "On this page, we are focusing on Sternberg connects analytical, creative, and practical intelligence. Let’s use the tabs to preview the three parts before treating each one in depth.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Triarchic theory · analytical/componential",
    title: "Analytical intelligence takes problems apart",
    minutes: 2,
    content: <div className="source-focus"><ConceptImage alt="A structured reasoning problem being decomposed" name="reasoning" /><div><span>“Book smart”</span><h3>Take apart problems and see solutions that are not often seen.</h3><p>The emphasis is on analysis, evaluation, comparison, and the components of problem solving.</p><SourceCallout title="Example">Given two search strategies, identify their assumptions and predict when each will fail.</SourceCallout></div></div>,
    note: "On this page, we are focusing on Analytical intelligence takes problems apart. Look for evidence that distinguishes analysis from memorized recall.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Triarchic theory · creative/experiential",
    title: "Creative intelligence combines novelty with automation",
    minutes: 2,
    content: <div className="source-comparison"><article><span>Novelty</span><h3>A situation never experienced before</h3><p>The learner must construct or transfer a strategy rather than retrieve a routine.</p></article><i>+</i><article><span>Automation</span><h3>A process performed many times</h3><p>It can now be carried out with little or no extra thought.</p></article><SourceCallout title="Key relationship">How well a task is performed depends partly on how familiar the task is.</SourceCallout></div>,
    note: "On this page, we are focusing on Creative intelligence combines novelty with automation. Let’s use a programming example: first recursive problem versus a practiced loop pattern. Notice both novelty and automation.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Triarchic theory · practical/contextual",
    title: "Practical intelligence seeks a fit with context",
    minutes: 2,
    content: <div className="source-focus"><ConceptImage alt="A person adapting a plan to a changing real-world context" name="adapt" /><div><span>“Street smarts”</span><h3>It “deals with the mental activity involved in attaining fit to context.”</h3><p>Practical performance requires reading a situation, adapting behavior, and acting under real constraints.</p><SourceCallout title="Example">A technically correct explanation fails if the audience cannot understand or use it.</SourceCallout></div></div>,
    note: "On this page, we are focusing on Practical intelligence seeks a fit with context. This connects practical intelligence to the course's AI-literacy goal: explain a technical idea to a nontechnical audience age 5 and up.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Knowledge point 7 · Other aspects of intelligence",
    title: "Intelligence may not be exclusively human",
    minutes: 2,
    content: <div className="other-intelligence"><ConceptImage alt="Biological organisms and an artificial agent compared" name="compare" /><div><h3>Questions and influences</h3><ul><li>Animal or plant intelligence</li><li>Is human intelligence different from animal or plant intelligence?</li><li>Biological factors</li><li>Environmental factors</li><li>Evolution of intelligence</li></ul><SourceCallout title="Comparison rule">State the capability and evidence before deciding whether the same word “intelligence” applies.</SourceCallout></div></div>,
    note: "On this page, we are focusing on Intelligence may not be exclusively human. We should not resolve this as a vocabulary vote. Try to operationalize one capability across human, animal, plant, and machine cases.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Other aspects · open problems",
    title: "Many cognitive processes remain only partly understood",
    minutes: 2,
    content: <div className="open-questions"><article><span>01</span><p>Exactly what happens when learning occurs?</p></article><article><span>02</span><p>How is knowledge represented in the nervous system—or brain?</p></article><article><span>03</span><p>What is intuition or skepticism?</p></article><article><span>04</span><p>What is self-awareness?</p></article><aside>These are scientific questions and design questions. An AI implementation may model a capability without settling how biological intelligence works.</aside></div>,
    note: "On this page, we are focusing on Many cognitive processes remain only partly understood. Notice all open questions. Which can be studied through behavior, which require internal measurements, and which first need an operational definition.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Knowledge point 8 · Definition of AI",
    title: "Artificial Intelligence is both an interdisciplinary idea and a field of study",
    minutes: 4,
    content: <div className="definition-lesson"><div className="definition-stack"><article><span>Influences</span><p>AI has been shaped by philosophers, psychologists, mathematicians, computer scientists, and others.</p></article><article><span>Literal construction</span><p>“AI is Artificial Intelligence using computer.” In literal terms: <strong>artificially made intelligence.</strong></p></article><article><span>John McCarthy</span><p>“The science and engineering of making intelligent machines.”</p></article><article><span>Agent-centered definition</span><p>The study and design of intelligent agents—systems that perceive their environment and take actions that maximize their chances of success.</p></article></div><SourceCallout title="Rationality bridge">“Rationality: logical reasoning and measure of optimal or ideal decision.” For an agent, rationality means choosing the action expected to best satisfy its performance measure from available evidence and knowledge—not being omniscient.</SourceCallout></div>,
    note: "On this page, we are focusing on Artificial Intelligence is both an interdisciplinary idea and a field of study. Notice every definition visible and compare what each emphasizes: origin, engineering, mechanism, behavior, environment, or success.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Meeting 1 · exit assessment",
    title: "Define AI without losing intelligence, mechanism, or evidence",
    minutes: 4,
    content: <div className="source-exit"><div><span>Individual response · 4 minutes</span><h3>Choose one named AI application.</h3><ol><li>Define AI in one sentence.</li><li>Name two intelligent capabilities the system requires.</li><li>Give one piece of evidence for each capability.</li><li>Name one claim the evidence does <em>not</em> support.</li></ol></div><aside><h3>Prepare for Meeting 2</h3><p>The agent-centered definition introduces four questions:</p><p><strong>What does the system perceive? What can it do? What counts as success? What kind of environment constrains it?</strong></p><small>Reading: Russell & Norvig 3e, Chapter 2; Luger 6e, Chapter 1.</small></aside></div>,
    note: "On this page, we are focusing on Define AI without losing intelligence, mechanism, or evidence. Before leaving this page, write responses or use pair critique. We can evaluate definition, capability, evidence, and boundary from 0–2 each.",
    sourceSlides: [1, 10],
  },
];

const lesson01InstructorSpeech = [
  "Artificial intelligence is the subject of the course, but the phrase is not yet a definition. When we call a system intelligent, we may mean that it recognizes patterns, reasons through alternatives, learns from experience, communicates, plans, or acts successfully in a changing environment. Those capabilities are related, but they are not identical. A chess engine and a voice assistant can both be called AI while using very different inputs, outputs, and evidence. Throughout the course, we will replace the vague label with observable questions: what information enters the system, what internal process transforms it, what action or answer comes out, and what evidence supports the claim that the behavior is intelligent?",
  "This course begins with logistics because a learning environment also needs a clear specification. The syllabus tells us what work counts, how it will be evaluated, and what responsibilities we share. The introductions serve a second purpose: they reveal the range of systems students already associate with AI. One person may name a recommendation system, another a chatbot, a navigation tool, or a game agent. Listen for the hidden criteria in those choices. Is the system impressive because it learns, because it speaks naturally, because it makes useful decisions, or simply because its internal mechanism is unfamiliar? Those differences will become our first evidence that AI is not defined by one product category.",
  "These applications show AI acting in very different environments. A game system receives a formal state and chooses a move. A self-driving system combines cameras, maps, and other sensors to choose physical actions under uncertainty. A security system looks for unusual patterns in large streams of activity. A robot must connect perception to movement in the real world. For each application, separate the visible product from the intelligent function inside it. Winning a game, reaching a destination, or identifying suspicious activity is an outcome. To understand the AI, we also need the representation, decision rule, data, and evaluation measure that produced that outcome. The same application can contain several AI components rather than one mysterious intelligence box.",
  "Language systems, simulated environments, expert systems, and interactive games broaden the picture. A language system may predict, translate, retrieve, or generate text. An expert system applies encoded knowledge to a specialized decision. An environment simulator lets an agent learn or plan without immediately acting in the physical world. A game combines rules, opponents, and long-term consequences. Notice that some systems rely heavily on learned statistical patterns, while others use explicit rules or search. Modern applications often combine them. The important lesson is that AI is a family of methods for representing information and choosing behavior. A familiar interface can hide very different mechanisms, so we should not infer how a system works merely from what its product is called.",
  "This activity asks us to locate the intelligence rather than repeat the application name. Saying that a phone is intelligent because it is a smartphone explains almost nothing. We need to identify a particular task, such as recognizing speech, predicting the next word, detecting a face, or selecting a route. Then name the inputs, outputs, and evidence. If the task is route planning, the input may include a map and traffic estimates, the output is a route, and evidence might compare travel time and safety with strong baselines. Also state the boundary of the claim. Good route selection does not prove that the system understands travel the way a person does. Careful AI literacy separates demonstrated capability from an attractive story about the capability.",
  "The early history of AI was organized around enduring questions. Could a machine play a strategic game, use language, learn from experience, or imitate human conversation convincingly? These questions helped turn philosophical ideas into programs and tests. Chess offered formal rules and measurable outcomes. Language exposed ambiguity and world knowledge. Learning asked whether performance could improve without every rule being hand-coded. The imitation game proposed a behavioral test rather than requiring agreement about consciousness. Historical systems were limited by available computation, data, and methods, but the questions did not disappear. Current systems answer parts of them at much larger scale. History is useful here because it shows that impressive demonstrations and unresolved definitions have traveled together from the beginning.",
  "Robotics and expert systems produced real achievements, but usually inside carefully bounded domains. A robot can succeed when its environment, sensors, and allowed actions are constrained. An expert system can offer strong recommendations when its knowledge base covers the case and its rules remain valid. Trouble appears when the environment changes, observations are incomplete, or a case falls outside the encoded domain. This is not a reason to dismiss the systems. It is a reason to describe competence precisely. Bounded success is still success. The lesson for modern AI is the same: report what task was tested, under what conditions, against which baseline, and with which failures. General language can make a narrow system sound universal, while a precise description makes both the achievement and its limits easier to understand.",
  "Later methods expanded what AI systems could do. More computation enabled deeper search and larger models. Larger datasets supported statistical learning. New representations made it possible to learn useful features rather than specify every feature by hand. Yet the older questions remained: what counts as understanding, how should success be measured, and when can behavior transfer beyond the training setting? Progress is therefore not a sequence in which each new method erases the previous one. Search, logic, probability, learning, optimization, and knowledge representation continue to interact. When we examine a modern system, ask which older ideas are still present beneath the new interface. A neural language model may be new in scale while still confronting the old problems of ambiguity, evidence, reasoning, and evaluation.",
  "The category exercise demonstrates concept learning. Each object supplies features such as shape, color, texture, or use. From a small number of examples, we form a hypothesis about which features define the intended category. The difficult part is that many hypotheses may fit the first examples. If peanut and olive appear first, perhaps the concept is food, oval objects, items containing oil, or something else. Each additional example rules out some hypotheses. This is why the sequence matters. Learning is not simply storing examples; it is choosing a generalization that should work on unseen cases. Before naming the category, state the rule you are currently testing and identify what next example would distinguish it from a competing rule.",
  "Words do not carry complete meanings in isolation. Context, shared knowledge, and expectations help us choose among possible interpretations. The word bank can refer to a financial institution, the side of a river, or an action performed by an aircraft. A language system must use surrounding words and broader knowledge to infer the intended sense. This connects linguistic understanding to representation and probability: the system maintains alternatives and uses evidence to change their plausibility. A correct answer on one sentence does not establish general understanding. We should test new contexts, unusual meanings, and counterexamples. The broader lesson is that intelligence often involves interpreting an observation in relation to a situation, not merely matching the observation to a stored label.",
  "This definition treats intelligence as a broad capacity rather than one isolated skill. The listed capabilities include learning, reasoning, planning, solving problems, thinking abstractly, understanding ideas, using language, recognizing patterns, and adapting. A person or system may be strong on some dimensions and weak on others. That makes intelligence difficult to compress into one score. The definition also invites operational questions. How would we observe adaptation? What task would distinguish reasoning from memorized response? What evidence would show transfer to a new situation? The point is not to settle every debate today. It is to establish a habit: whenever a capability word appears, translate it into behavior that could be examined and evidence that could support or challenge the claim.",
  "Learning changes behavior or internal knowledge through experience. Recognition identifies meaningful patterns in observations. Understanding connects information to relationships, implications, and context. Reasoning uses available information to derive or evaluate conclusions. These processes often work together, but they should not be treated as synonyms. A classifier may recognize an object without explaining why it matters. A system may memorize training answers without learning a rule that transfers. A reasoning trace may look coherent while starting from a false premise. For each capability, ask what changes, what remains stable, and what new case tests transfer. Strong evidence usually includes performance on data or situations not used to construct the system. Otherwise we may be measuring recall and calling it intelligence because the output arrived with excellent confidence.",
  "Imagination, abstract thinking, creativity, and communication extend beyond recognizing what is already present. Imagination constructs possibilities that are not directly observed. Abstract thinking identifies a pattern that can apply across concrete examples. Creativity combines novelty with usefulness or value in a context. Communication represents and exchanges information with another agent. Generating an unusual sentence may show novelty, but creativity also requires judging whether the result serves a purpose. Producing fluent language may show communication skill, but it does not by itself prove truthful understanding. These distinctions matter for generative AI. We should evaluate originality, relevance, consistency, and audience effect separately rather than treating a polished surface as evidence for every deeper capability.",
  "Planning, decision making, and problem solving organize intelligent action over time. A plan is a sequence or policy for reaching a goal. Decision making selects among alternatives using expected consequences and preferences. Problem solving constructs or searches for a path from a current situation to a desired one. The three overlap, but each highlights a different question. A navigation system may formulate a route problem, compare alternative paths, and then follow a plan while conditions change. Evidence of success must therefore include more than reaching the destination once. We may measure cost, safety, robustness, and the ability to replan. A system that chooses well only when every assumption is perfect has solved a smaller problem than its interface may suggest.",
  "Capability claims need observable evidence. If a system is said to understand instructions, test paraphrases, missing information, contradictions, and requests that require clarification. If it is said to reason, vary the surface form while preserving the underlying structure and see whether the conclusion remains sound. If it is said to learn, show improvement from experience and transfer to new cases. One successful demonstration is a starting point, not a complete validation. We also need comparison with a baseline, repeated trials, and carefully selected failure cases. This evidence-first approach protects us from both exaggeration and unnecessary skepticism. It lets us say exactly what the system demonstrated and exactly what remains unknown.",
  "Theories of intelligence disagree about whether a general factor explains performance across many tasks or whether distinct abilities should be treated separately. A general-factor view points to correlations among cognitive tests and asks whether one broad capacity contributes to many kinds of performance. Multiple-intelligence views emphasize different forms of competence and the possibility of uneven profiles. For AI, the debate warns us not to treat one benchmark as a complete measure. A model that excels at language may struggle with physical interaction; a planning agent may not communicate well. We can report both broad patterns and specialized strengths. The key is to use measurable constructs and avoid converting an appealing taxonomy into a fact simply because the labels sound familiar.",
  "Gardner's framework names several forms of intelligence, including linguistic, logical-mathematical, spatial, bodily-kinesthetic, musical, interpersonal, intrapersonal, and naturalistic abilities. The framework is influential in educational discussion because it highlights varied human strengths. It is also debated as a scientific theory, especially when the categories are treated as independent measurable intelligences rather than useful descriptions. In this course, use the list as a comparison tool, not as a settled diagnostic instrument. Ask which capabilities current AI systems approximate, which require bodies or social context, and what evidence would distinguish genuine competence from a narrow task score. A taxonomy organizes questions; it does not answer them automatically.",
  "Sternberg's triarchic theory connects analytical, creative, and practical intelligence. Analytical intelligence helps evaluate and solve familiar structured problems. Creative intelligence helps handle novelty and combine ideas in useful ways. Practical intelligence adapts behavior to real contexts, including choosing or changing an environment. The tabs separate the concepts for study, but real tasks often require all three. Designing a campus robot, for example, involves analyzing routes, responding creatively to an unexpected blockage, and acting practically around people and physical constraints. As we examine each part, focus on observable evidence and on the boundary between generating a candidate answer and judging whether that answer works in context.",
  "Analytical intelligence takes a problem apart, identifies relationships, compares alternatives, and supports a justified conclusion. In AI, search algorithms, logical inference, probabilistic calculation, and diagnostic classification can all support analytical behavior. But correct-looking decomposition is not enough. The representation may omit important variables, the rule may be invalid, or the evidence may be biased. A strong evaluation therefore includes both the answer and the process that made the answer defensible. Ask whether the system can explain relevant distinctions, handle counterexamples, and preserve the same logic when superficial details change. Analysis should reveal structure, not merely reproduce a familiar answer pattern.",
  "Creative intelligence combines novelty with the ability to make unfamiliar tasks manageable. The first time we encounter a recursive programming problem, we may need to invent a representation or analogy. After practice, parts of the solution become automatic, freeing attention for harder decisions. AI systems also combine learned patterns to produce new candidates, but novelty alone is not enough. A random string can be novel without being useful. Evaluate creative output using relevance, constraint satisfaction, diversity, and human judgment appropriate to the domain. Also ask where the apparent novelty comes from and whether the system is reproducing protected or memorized material. Creativity is a performance claim that needs both an artifact and a defensible evaluation context.",
  "Practical intelligence concerns fit with a real environment. An agent can adapt itself to conditions, shape the environment, or choose a different environment. A technically correct answer may still be impractical if it ignores cost, time, people, safety, or available tools. This is especially important in AI deployment. A model with excellent laboratory accuracy may fail when sensors differ, users interpret outputs differently, or consequences are unequal. Practical evaluation asks whether the system works for the intended people under actual constraints. It also asks when the system should defer, request help, or decline to act. Success in context is not a softer version of intelligence; it is often the point of building the system.",
  "The possibility of nonhuman intelligence asks us to separate capability from resemblance. Animals, organizations, and machines may solve problems using mechanisms unlike human thought. If intelligence is defined only as behaving exactly like a person, we risk overlooking effective alternative strategies. If it is defined too loosely, almost any automatic response may qualify. The solution is not a vocabulary vote. Choose a capability, specify a task and environment, and identify evidence. A navigation agent may demonstrate efficient planning without consciousness or human-like understanding. A social animal may demonstrate communication and adaptation without language as humans use it. Clear operational definitions allow comparison while leaving philosophical questions open.",
  "Many cognitive processes remain partly understood. Learning involves biological change, experience, attention, and memory, but a complete explanation spans several scientific levels. Knowledge representation in the brain is not a simple table of symbols. Intuition and skepticism are everyday labels for processes that still require careful operational definitions. Self-awareness raises behavioral, neurological, and philosophical questions. AI can model parts of these capabilities without resolving how human cognition works. A machine-learning algorithm may improve from data even though it is not a theory of biological learning. Keep the distinction between engineering a useful function and explaining natural intelligence. Both are valuable goals, but evidence for one does not automatically establish the other.",
  "The definitions on this page emphasize different aspects of AI. The interdisciplinary view highlights philosophy, psychology, mathematics, computer science, and other influences. McCarthy's definition emphasizes the science and engineering of intelligent machines. The agent-centered definition emphasizes perception, action, environment, and success. Rationality adds a decision standard: choose the action expected to perform best using the available evidence and knowledge. Rationality does not mean omniscience. A rational agent can make a poor outcome choice when information is limited or the world is uncertain, as long as the decision was best supported at the time. Comparing definitions helps us see which claims concern mechanism, behavior, purpose, or evaluation.",
  "The exit task combines the lesson's main ideas. Choose one specific AI application and define AI in a way that fits the system without becoming circular. Then name two capabilities the system needs and provide observable evidence for each. Finally, state a boundary: what does that evidence not prove? For a translation system, fluent output may support language competence on tested pairs, but it does not prove human-like understanding or reliable performance in every domain. The boundary is not a weakness in the answer; it is evidence of careful reasoning. This structure—definition, capability, evidence, and limitation—will recur throughout the course. It turns broad AI claims into statements that can be examined, compared, and improved.",
];

const slidesWithInstructorSpeech = slides.map((slide, index) => ({
  ...slide,
  note: `${slide.note} ${lesson01InstructorSpeech[index]}`,
}));

export function AiFoundationsDeck({ forcePrintAll = false }: { forcePrintAll?: boolean }) {
  return <L01DeckShell forcePrintAll={forcePrintAll} hoverEffects meetingLabel="Module 2 · Lesson 1" meetingTitle="AI Applications, History, Intelligence, and Definitions" notesMode="instructor" slides={slidesWithInstructorSpeech} />;
}
