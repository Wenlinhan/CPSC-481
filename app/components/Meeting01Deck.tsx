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
    eyebrow: "Week 1 · Meeting 1",
    title: "Artificial Intelligence",
    subtitle: "Applications, history, intelligence, and definitions",
    content: <div className="source-hero"><div><p>What is Artificial Intelligence?</p><span>CPSC 481 · Introduction to Artificial Intelligence</span></div><ConceptImage alt="A connected landscape of AI systems" name="ai-systems" /></div>,
    note: "Open with the central course question. Ask students for one system they consider intelligent and one reason. [Sources] Luger 6e, Ch. 1; Russell & Norvig 3e, Ch. 1.",
    sourceSlides: [1],
  },
  {
    eyebrow: "Course orientation",
    title: "Introduction and syllabus",
    content: <div className="orientation-layout"><div><h3>Today</h3><ul><li>Waitlist, roster, and introductions</li><li>Syllabus and course overview</li></ul><SourceCallout title="Introduce yourself">Name, preferred name, one AI system you have used, and one question you have about it.</SourceCallout></div><aside><span>Related courses</span><p>CPSC 483 · Introduction to Machine Learning</p><p>CPSC 485 · Computational Bioinformatics</p><p>CPSC 583 · Expert System Design</p><p>CPSC 585 · Artificial Neural Network</p></aside></div>,
    note: "Complete required enrollment and syllabus items, then use introductions as a first inventory of AI conceptions. [Sources] CPSC course orientation materials.",
    sourceSlides: [2],
  },
  {
    eyebrow: "Knowledge point 1 · “State of the Art Applications” · 2020 snapshot",
    title: "AI acts in games, mobility, security, and robots",
    content: <ApplicationGrid items={[
      ["Board games", "AlphaGo and AlphaZero", "history-alphago"],
      ["Autonomous cars", "Google Waymo; Tesla Autopilot; Audi summon feature; etc.", "taxi-environment"],
      ["Security", "Generative Adversarial Network (GAN): deepfake", "risk"],
      ["Robots", "Sophia; Boston Dynamics; Erica (anthropomorphic)", "agent-architecture"],
    ]} />,
    note: "For each example, ask students to name the task, input, output, and evidence of success. Preserve the distinction between an application and the AI methods inside it. [Sources] Course examples; Luger 6e, Ch. 1.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Knowledge point 1 · “State of the Art Applications” · 2020 snapshot",
    title: "AI also works through language, environments, expertise, and play",
    content: <ApplicationGrid items={[
      ["Natural language processing", "Voice assistants: Google Duplex; Amazon Alexa; Apple Siri; etc.", "communication"],
      ["Internet of Things (IoT)", "Amazon cashierless store", "environment"],
      ["Expert systems", "IBM Watson", "reasoning"],
      ["Video games", "OpenAI-Dota 2", "decision"],
    ]} />,
    note: "Retain every named application. Ask which systems learn, which reason from encoded knowledge, and which coordinate several methods. [Sources] Course examples; Luger 6e, Ch. 1.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Applications · in-class practice",
    title: "An application name does not explain where the intelligence is",
    content: <div className="source-practice-grid"><ConceptImage alt="Students decomposing an AI system" name="guided-practice" /><div><h3>Choose one application from the previous two pages.</h3><ol><li>What task is being performed?</li><li>What information enters the system?</li><li>What action or prediction leaves it?</li><li>Which intelligent capability is required?</li><li>What evidence would demonstrate success?</li></ol><SourceCallout title="Share-out rule">Name the mechanism or capability—not only the product.</SourceCallout></div></div>,
    note: "Pairs analyze for two minutes; cold-call one pair for each prompt. This prepares students to distinguish products, models, and agent behavior.",
    sourceSlides: [3],
  },
  {
    eyebrow: "Knowledge point 2 · History",
    title: "Chess, language, learning, and the imitation game shaped the early agenda",
    content: <div className="source-timeline illustrated">
      <article><ConceptImage alt="Early computer chess as a search problem" name="history-deep-blue" /><span>1950</span><h3>Claude Shannon</h3><p>“Programming a Computer for Playing Chess” is the first published article on developing a chess-playing computer program.</p></article>
      <article><ConceptImage alt="Alan Turing and the imitation game" name="history-turing" /><span>1950</span><h3>Alan Turing</h3><p>“Computing Machinery and Intelligence” proposes the “imitation game,” later known as the Turing Test.</p></article>
      <article><ConceptImage alt="The Dartmouth workshop where the AI research agenda was formed" name="history-dartmouth" /><span>1956</span><h3>First AI Conference at Dartmouth</h3><p>A program that simulates the machine; language use; neuron networks; self-improvement through learning and reasoning.</p></article>
    </div>,
    note: "Emphasize the research questions, not only the dates. Students should connect chess to search, language to representation, and self-improvement to learning. [Sources] Shannon 1950; Turing 1950; Dartmouth proposal.",
    sourceSlides: [4],
  },
  {
    eyebrow: "Knowledge point 2 · History",
    title: "Robotics and expert systems produced important—but bounded—successes",
    content: <div className="source-timeline illustrated">
      <article><ConceptImage alt="An anthropomorphic robot integrating control, vision, and conversation" name="agent-architecture" /><span>1970</span><h3>WABOT-1</h3><p>The first anthropomorphic robot at Waseda University: limb-control, vision, and conversation systems.</p></article>
      <article><ConceptImage alt="A rule-based medical expert system" name="history-mycin" /><span>1972</span><h3>MYCIN</h3><p>An early Stanford expert system identified bacteria causing severe infections and recommended antibiotics.</p></article>
      <article><ConceptImage alt="Computer chess culminating in Deep Blue" name="history-deep-blue" /><span>1997</span><h3>Deep Blue</h3><p>The first computer chess-playing program to defeat a reigning world chess champion.</p></article>
      <aside><strong>Historical tension</strong><p>No major breakthroughs in many years…</p></aside>
    </div>,
    note: "Ask what each system could do and what it could not generalize to. Use “no major breakthroughs” to introduce cycles of expectations and setbacks. [Sources] Course timeline; Russell & Norvig 3e, Ch. 1.",
    sourceSlides: [4],
  },
  {
    eyebrow: "History · current bridge",
    title: "New methods broadened capability without removing the old questions",
    content: <div className="source-comparison"><article><span>Earlier emphasis</span><h3>Symbols, search, rules, and explicit knowledge</h3><p>Programs were designed around formal representations and carefully specified domains.</p></article><i>+</i><article><span>Later emphasis</span><h3>Learning from data, large models, and deployed systems</h3><p>Statistical learning and foundation models expanded pattern recognition and generation.</p></article><SourceCallout title="Continuity">Representation, reasoning, learning, evaluation, and the meaning of intelligence remain central.</SourceCallout></div>,
    note: "This is a bridge, not a replacement history. Modern systems still face the foundational questions introduced in the historical sequence. [Sources] Russell & Norvig 3e, Ch. 1; course modernization.",
    sourceSlides: [3, 4],
  },
  {
    eyebrow: "Knowledge point 3 · Why AI is difficult",
    title: "Can a machine infer the intended concept?",
    subtitle: "Advance the sequence one image at a time",
    content: <OilPuzzle />,
    note: "Do not name the objects before the final reveal. Reveal peanut oil, coconut oil, and corn oil on separate clicks; then reveal the baby-oil bottle, baby photograph, and question marks together. Ask students to state how their hypothesis changed. [Sources] Course concept exercise.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Why AI is difficult · debrief",
    title: "Words inherit meaning from context and world knowledge",
    content: <div className="oil-debrief"><div className="oil-debrief-images"><CourseImage alt="Peanut oil bottle" name="peanut-oil.png" /><CourseImage alt="Coconut oil jar" name="coconut-oil.png" /><CourseImage alt="Corn oil bottle" name="corn-oil.png" /><CourseImage alt="Baby oil bottle" name="baby-oil.png" /><CourseImage alt="Baby photograph" name="baby.png" /></div><div><h3>“Peanut oil” names oil derived from peanuts. “Baby oil” names oil intended for babies.</h3><p>The same grammatical form does not guarantee the same semantic relation.</p><ul><li>Recognition: identify each object.</li><li>Language: interpret a compound noun.</li><li>World knowledge: reject an implausible relation.</li><li>Context: choose the intended meaning.</li></ul></div></div>,
    note: "Connect the exercise to ambiguity, commonsense knowledge, semantic composition, and the limits of pattern matching. The exact objects are part of the knowledge point. [Sources] Course concept exercise.",
    sourceSlides: [5],
  },
  {
    eyebrow: "Knowledge point 4 · What is intelligence?",
    title: "Intelligence is a general mental capability",
    content: <div className="intelligence-overview"><div><strong>Intelligence</strong><p>is a general mental capability.</p><small>It is different from being merely “smart” in the sense of quickly adapting to the environment.</small></div><ul><li>learning</li><li>recognition and understanding</li><li>reasoning</li><li>imagination or abstract thinking</li><li>creativity</li><li>communication</li><li>planning</li><li>decision making</li><li>problem solving</li></ul></div>,
    note: "Keep the definition and all nine capabilities visible. Ask whether each capability is necessary, sufficient, or one contributor to intelligence. [Sources] Course definition; Luger 6e, Ch. 1.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Intelligent capabilities · perceive and infer",
    title: "Learning, recognition, understanding, and reasoning turn experience into conclusions",
    content: <ApplicationGrid items={[
      ["Learning", "Change behavior or a model through data or experience.", "learning"],
      ["Recognition", "Identify a pattern, object, event, or category.", "perception"],
      ["Understanding", "Connect a representation to context, relations, and consequences.", "representation"],
      ["Reasoning", "Derive conclusions from evidence, knowledge, or assumptions.", "reasoning"],
    ]} />,
    note: "Provide one counterexample for each capability: recognition without understanding, memorization without transfer, and logically valid reasoning from false premises.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Intelligent capabilities · imagine and communicate",
    title: "Imagination, abstract thinking, creativity, and communication extend beyond recognition",
    content: <ApplicationGrid items={[
      ["Imagination", "Represent possibilities that are not currently perceived.", "predict"],
      ["Abstract thinking", "Retain relevant structure while ignoring incidental detail.", "model"],
      ["Creativity", "Produce ideas or artifacts that are novel and useful in context.", "creation"],
      ["Communication", "Exchange meaning with another agent or person.", "communication"],
    ]} />,
    note: "Ask whether generating a novel-looking artifact establishes creativity. Require a criterion for novelty, usefulness, and context.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Intelligent capabilities · choose and act",
    title: "Planning, decision making, and problem solving organize action",
    content: <ApplicationGrid className="three" items={[
      ["Planning", "Choose a sequence of future actions toward a goal.", "planning"],
      ["Decision making", "Select among alternatives under goals, costs, and uncertainty.", "decision"],
      ["Problem solving", "Represent a problem and search for a satisfactory solution.", "reasoning"],
    ]} />,
    note: "Distinguish a plan from a decision: a plan is an action sequence; a decision chooses among alternatives. The source contrasts intelligence with merely being “smart,” described there as quickly adapting to the environment; adaptation is not another item in its capability list.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Intelligence · formative assessment",
    title: "A capability claim needs observable evidence",
    content: <QuickCheck question="A system labels a photograph correctly but cannot explain the object, use it, or recognize it from a new angle. Which claim is best supported?" options={["General intelligence", "Recognition on the tested examples", "Understanding", "Creative reasoning"]} correct={1} explanation="The evidence supports bounded recognition. Broader claims require transfer, explanation, use, and additional tests." />,
    note: "Ask students to name one additional test that would support understanding rather than recognition alone.",
    sourceSlides: [6],
  },
  {
    eyebrow: "Knowledge point 5 · Theories of intelligence",
    title: "One theory seeks a general factor; another separates kinds of ability",
    content: <TheoryColumns />,
    note: "Introduce single general intelligence, multiple intelligence, IQ, and EQ exactly as distinct theoretical perspectives—not settled engineering specifications. Source note preserved for evaluation: “Stephen Hawking: 280; Average: 90-110; >120 superior.” Do not present the Hawking number as fact; it is unsupported and should be used only as a source-verification example. [Sources] Course theory summary.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Theories of intelligence · multiple intelligence",
    title: "Gardner proposed several forms of intelligence",
    content: <div className="multiple-intelligences"><div><span>logical</span><span>linguistic</span><span>spatial</span><span>musical</span><span>kinesthetic</span><span>interpersonal</span><span>intrapersonal</span><span>naturalist</span></div><aside><h3>Naturalist intelligence</h3><p>Sensing patterns and making connections to elements in nature.</p><h3>Emotional intelligence</h3><p>Associated with Daniel Goleman and others; often discussed using EQ.</p><SourceCallout title="Claim to evaluate">“Gardner’s theory has never been tested.” What would count as a fair test? The independence and measurement of the proposed intelligences remain contested.</SourceCallout></aside></div>,
    note: "Retain every named intelligence and the course's empirical caution. Frame the caution as a research question about independent measurement and predictive evidence. [Sources] Gardner; Goleman; course theory summary.",
    sourceSlides: [7],
  },
  {
    eyebrow: "Knowledge point 6 · Triarchic theory",
    title: "Sternberg connects analytical, creative, and practical intelligence",
    content: <TriarchicOverview />,
    note: "Use the tabs to preview the three parts before treating each one in depth. [Sources] Robert J. Sternberg's triarchic theory.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Triarchic theory · analytical/componential",
    title: "Analytical intelligence takes problems apart",
    content: <div className="source-focus"><ConceptImage alt="A structured reasoning problem being decomposed" name="reasoning" /><div><span>“Book smart”</span><h3>Take apart problems and see solutions that are not often seen.</h3><p>The emphasis is on analysis, evaluation, comparison, and the components of problem solving.</p><SourceCallout title="Example">Given two search strategies, identify their assumptions and predict when each will fail.</SourceCallout></div></div>,
    note: "Ask for evidence that distinguishes analysis from memorized recall. [Sources] Sternberg triarchic theory; course definition.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Triarchic theory · creative/experiential",
    title: "Creative intelligence combines novelty with automation",
    content: <div className="source-comparison"><article><span>Novelty</span><h3>A situation never experienced before</h3><p>The learner must construct or transfer a strategy rather than retrieve a routine.</p></article><i>+</i><article><span>Automation</span><h3>A process performed many times</h3><p>It can now be carried out with little or no extra thought.</p></article><SourceCallout title="Key relationship">How well a task is performed depends partly on how familiar the task is.</SourceCallout></div>,
    note: "Use a programming example: first recursive problem versus a practiced loop pattern. Preserve both novelty and automation. [Sources] Sternberg triarchic theory; course definition.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Triarchic theory · practical/contextual",
    title: "Practical intelligence seeks a fit with context",
    content: <div className="source-focus"><ConceptImage alt="A person adapting a plan to a changing real-world context" name="adapt" /><div><span>“Street smarts”</span><h3>It “deals with the mental activity involved in attaining fit to context.”</h3><p>Practical performance requires reading a situation, adapting behavior, and acting under real constraints.</p><SourceCallout title="Example">A technically correct explanation fails if the audience cannot understand or use it.</SourceCallout></div></div>,
    note: "Connect practical intelligence to the course's AI-literacy goal: explain a technical idea to a nontechnical audience age 5 and up. [Sources] Sternberg triarchic theory; course definition.",
    sourceSlides: [8],
  },
  {
    eyebrow: "Knowledge point 7 · Other aspects of intelligence",
    title: "Intelligence may not be exclusively human",
    content: <div className="other-intelligence"><ConceptImage alt="Biological organisms and an artificial agent compared" name="compare" /><div><h3>Questions and influences</h3><ul><li>Animal or plant intelligence</li><li>Is human intelligence different from animal or plant intelligence?</li><li>Biological factors</li><li>Environmental factors</li><li>Evolution of intelligence</li></ul><SourceCallout title="Comparison rule">State the capability and evidence before deciding whether the same word “intelligence” applies.</SourceCallout></div></div>,
    note: "Do not resolve this as a vocabulary vote. Ask students to operationalize one capability across human, animal, plant, and machine cases. [Sources] Course questions on intelligence.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Other aspects · open problems",
    title: "Many cognitive processes remain only partly understood",
    content: <div className="open-questions"><article><span>01</span><p>Exactly what happens when learning occurs?</p></article><article><span>02</span><p>How is knowledge represented in the nervous system—or brain?</p></article><article><span>03</span><p>What is intuition or skepticism?</p></article><article><span>04</span><p>What is self-awareness?</p></article><aside>These are scientific questions and design questions. An AI implementation may model a capability without settling how biological intelligence works.</aside></div>,
    note: "Preserve all open questions. Ask which can be studied through behavior, which require internal measurements, and which first need an operational definition. [Sources] Course questions on cognition.",
    sourceSlides: [9],
  },
  {
    eyebrow: "Knowledge point 8 · Definition of AI",
    title: "Artificial Intelligence is both an interdisciplinary idea and a field of study",
    content: <div className="definition-lesson"><div className="definition-stack"><article><span>Influences</span><p>AI has been shaped by philosophers, psychologists, mathematicians, computer scientists, and others.</p></article><article><span>Literal construction</span><p>“AI is Artificial Intelligence using computer.” In literal terms: <strong>artificially made intelligence.</strong></p></article><article><span>John McCarthy</span><p>“The science and engineering of making intelligent machines.”</p></article><article><span>Agent-centered definition</span><p>The study and design of intelligent agents—systems that perceive their environment and take actions that maximize their chances of success.</p></article></div><SourceCallout title="Rationality bridge">“Rationality: logical reasoning and measure of optimal or ideal decision.” For an agent, rationality means choosing the action expected to best satisfy its performance measure from available evidence and knowledge—not being omniscient.</SourceCallout></div>,
    note: "Keep every definition visible and compare what each emphasizes: origin, engineering, mechanism, behavior, environment, or success. [Sources] John McCarthy; Russell & Norvig 3e, Chs. 1–2; Luger 6e, Ch. 1.",
    sourceSlides: [10],
  },
  {
    eyebrow: "Meeting 1 · exit assessment",
    title: "Define AI without losing intelligence, mechanism, or evidence",
    content: <div className="source-exit"><div><span>Individual response · 4 minutes</span><h3>Choose one named AI application.</h3><ol><li>Define AI in one sentence.</li><li>Name two intelligent capabilities the system requires.</li><li>Give one piece of evidence for each capability.</li><li>Name one claim the evidence does <em>not</em> support.</li></ol></div><aside><h3>Prepare for Meeting 2</h3><p>The agent-centered definition introduces four questions:</p><p><strong>What does the system perceive? What can it do? What counts as success? What kind of environment constrains it?</strong></p><small>Reading: Russell & Norvig 3e, Chapter 2; Luger 6e, Chapter 1.</small></aside></div>,
    note: "Collect responses or use pair critique. Score definition, capability, evidence, and boundary from 0–2 each. [Sources] Luger 6e, Ch. 1; Russell & Norvig 3e, Chs. 1–2.",
    sourceSlides: [1, 10],
  },
];

export function AiFoundationsDeck() {
  return <L01DeckShell meetingLabel="Week 1 · Meeting 1" meetingTitle="AI Applications, History, Intelligence, and Definitions" slides={slides} />;
}
