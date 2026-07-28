"use client";

import Link from "next/link";
import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from "react";
import type { KnowledgePoint, MeetingPlan } from "../data/course";

type Slide = { eyebrow: string; title: string; subtitle?: string; content: ReactNode; note: string };

function TopicVisual({ meeting, point = 0, mode = "concept" }: { meeting: MeetingPlan; point?: number; mode?: "concept" | "example" | "demo" | "practice" }) {
  const family = meeting.id <= 8 ? "search" : meeting.id <= 12 ? "probability" : meeting.id <= 18 ? "learning" : meeting.id <= 24 ? "language" : "evidence";
  const labels = meeting.knowledgePoints[point] ?? meeting.knowledgePoints[0];
  return (
    <div className={`topic-visual ${family} ${mode}`} style={{ "--hue": (meeting.week * 27 + point * 38) % 360 } as CSSProperties}>
      <div className="visual-field">
        <span className="visual-node n1">{family === "search" ? "S" : family === "probability" ? "P" : family === "learning" ? "x" : family === "language" ? "token" : "claim"}</span>
        <span className="visual-node n2">{family === "search" ? "A" : family === "probability" ? "evidence" : family === "learning" ? "model" : family === "language" ? "context" : "source"}</span>
        <span className="visual-node n3">{family === "search" ? "B" : family === "probability" ? "belief" : family === "learning" ? "ŷ" : family === "language" ? "output" : "review"}</span>
        <i className="edge e1"/><i className="edge e2"/><i className="edge e3"/>
        <div className="signal s1"/><div className="signal s2"/>
      </div>
      <div className="visual-caption"><span>{mode}</span><strong>{labels.concept}</strong></div>
    </div>
  );
}

function KnowledgeSlide({ meeting, point, index }: { meeting: MeetingPlan; point: KnowledgePoint; index: number }) {
  return <div className="knowledge-layout"><TopicVisual meeting={meeting} point={index}/><section><span className="micro-label">Core idea {index + 1}</span><p className="knowledge-definition">{point.explanation}</p><div className="boundary-callout"><strong>Boundary to remember</strong><span>{point.check}</span></div></section></div>;
}

function WorkedExample({ meeting, point, index }: { meeting: MeetingPlan; point: KnowledgePoint; index: number }) {
  const steps = point.example.split(/;|\. /).filter(Boolean).slice(0, 3);
  return <div className="worked-example"><section><span className="micro-label">Worked case</span><h3>{point.example}</h3><ol>{(steps.length > 1 ? steps : ["Name the task and assumptions", "Apply the concept step by step", "Interpret the result and its limit"]).map((step) => <li key={step}>{step.replace(/\.$/, "")}</li>)}</ol></section><TopicVisual meeting={meeting} point={index} mode="example"/></div>;
}

function Demo({ meeting, point, index }: { meeting: MeetingPlan; point: KnowledgePoint; index: number }) {
  const [step, setStep] = useState(0);
  const stages = ["Set up", "Run", "Inspect", "Explain"];
  return <div className="demo-layout"><TopicVisual meeting={meeting} point={index} mode="demo"/><section><span className="micro-label">Interactive demonstration</span><h3>{point.demo}</h3><div className="demo-steps">{stages.map((stage, i) => <button className={step === i ? "active" : ""} key={stage} onClick={() => setStep(i)} type="button"><span>{i + 1}</span>{stage}</button>)}</div><p>{[
    "Identify inputs, assumptions, and the expected behavior.",
    "Advance the mechanism one operation at a time.",
    "Compare the observed state with the prediction.",
    "State what the demonstration supports—and what it does not.",
  ][step]}</p></section></div>;
}

function Practice({ meeting, point, index }: { meeting: MeetingPlan; point: KnowledgePoint; index: number }) {
  const [revealed, setRevealed] = useState(false);
  return <div className="practice-layout"><section><span className="micro-label">In-class practice · Think → pair → test</span><h3>{point.practice}</h3><div className="practice-cycle"><span>1<small>Predict alone</small></span><i>→</i><span>2<small>Compare reasoning</small></span><i>→</i><span>3<small>Test or trace</small></span><i>→</i><span>4<small>Revise claim</small></span></div><button onClick={() => setRevealed(!revealed)} type="button">{revealed ? "Hide success criteria" : "Reveal success criteria"}</button>{revealed && <p className="success-criteria">A strong response names the assumption, shows the intermediate reasoning, and connects the result to the knowledge point.</p>}</section><TopicVisual meeting={meeting} point={index} mode="practice"/></div>;
}

function QuickCheck({ point }: { point: KnowledgePoint }) {
  const [choice, setChoice] = useState<number | null>(null);
  const options = ["The visible result is enough.", "The result plus its assumptions and evidence.", "The most complex method.", "The newest available tool."];
  return <div className="planned-check"><section><span className="micro-label">Formative assessment</span><h3>{point.check}</h3><p>Select the strongest reasoning pattern, then explain it to a partner.</p></section><div>{options.map((option, index) => <button className={choice === index ? index === 1 ? "correct" : "incorrect" : ""} key={option} onClick={() => setChoice(index)} type="button"><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}{choice !== null && <p>{choice === 1 ? "Good. Evidence and assumptions define what the result can support." : "Reconsider what must accompany a result before it justifies a claim."}</p>}</div></div>;
}

export function PlannedLessonDeck({ meeting }: { meeting: MeetingPlan }) {
  const [current, setCurrent] = useState(0);
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const [motion, setMotion] = useState(true);
  const slides = useMemo<Slide[]>(() => {
    const generated: Slide[] = [
      { eyebrow: `Week ${meeting.week} · Meeting ${meeting.id}`, title: meeting.title, subtitle: meeting.question, content: <div className="planned-hero"><section><p>{meeting.question}</p><div>{meeting.knowledgePoints.map((point, index) => <span key={point.concept}>0{index + 1} · {point.concept}</span>)}</div></section><TopicVisual meeting={meeting}/></div>, note: `Open with the driving question. Ask students to make an initial prediction. [Sources] ${meeting.sourceTrace.join("; ")}.` },
      { eyebrow: "Learning objectives", title: "By the end of class, you can explain, apply, and evaluate", content: <div className="objective-list">{meeting.knowledgePoints.map((point, index) => <article key={point.concept}><span>0{index + 1}</span><h3>{point.concept}</h3><p>{point.practice}</p></article>)}</div>, note: "Use the objectives as observable outcomes. Students should know what they will produce, not only what they will hear." },
      { eyebrow: "Activate prior knowledge", title: "Start with a prediction before seeing the mechanism", content: <div className="prior-knowledge"><TopicVisual meeting={meeting} mode="practice"/><section><span className="micro-label">Two-minute retrieval</span><h3>{meeting.question}</h3><p>Write one answer, one assumption, and one question. Keep it visible so you can revise it near the end of class.</p></section></div>, note: "Collect two contrasting predictions. Do not resolve the question yet." },
    ];
    meeting.knowledgePoints.forEach((point, index) => {
      generated.push(
        { eyebrow: `Knowledge point ${index + 1}`, title: point.concept, content: <KnowledgeSlide meeting={meeting} point={point} index={index}/>, note: `Explain the concept and its boundary. Ask one student to paraphrase it. [Sources] ${meeting.readings.join("; ")}.` },
        { eyebrow: `Knowledge point ${index + 1} · Example`, title: "Work the example from assumptions to interpretation", content: <WorkedExample meeting={meeting} point={point} index={index}/>, note: "Model the reasoning aloud. Pause before each step and ask students to predict it." },
        { eyebrow: `Knowledge point ${index + 1} · Demonstration`, title: "Make the hidden process visible", content: <Demo meeting={meeting} point={point} index={index}/>, note: "Use the controls to advance the demo. Contrast the prediction with the observed behavior." },
        { eyebrow: `Knowledge point ${index + 1} · Practice`, title: "Use the idea—not just its vocabulary", content: <Practice meeting={meeting} point={point} index={index}/>, note: "Allow individual thinking before pairs compare. Sample reasoning, not only final answers." },
        { eyebrow: `Knowledge point ${index + 1} · Check`, title: "Test the claim against evidence and assumptions", content: <QuickCheck point={point}/>, note: "Poll independently. Ask a student to defend the chosen answer and another to name its limitation." },
      );
    });
    generated.push(
      { eyebrow: "Misconception clinic", title: "A correct term can still hide incorrect reasoning", content: <div className="misconception-grid">{meeting.knowledgePoints.map((point, index) => <article key={point.concept}><span>Misconception {index + 1}</span><h3>{point.check}</h3><p>Repair it by naming the mechanism, assumption, and evidence that the shortcut omits.</p></article>)}</div>, note: "Invite students to contribute a plausible wrong answer. Diagnose why it is attractive." },
      { eyebrow: "Integration challenge", title: "Connect the three knowledge points in one system", content: <div className="integration-map">{meeting.knowledgePoints.map((point, index) => <article key={point.concept}><span>{index + 1}</span><strong>{point.concept}</strong></article>)}<i/><section><h3>{meeting.question}</h3><p>Trace one example across all three ideas. Mark where an assumption, cost, or uncertainty enters.</p></section></div>, note: "Require students to use all three concepts in a coherent explanation." },
      { eyebrow: "Transfer", title: "Change one condition and reconsider the method", content: <div className="transfer-layout"><TopicVisual meeting={meeting} mode="example"/><section><span className="micro-label">What-if analysis</span><h3>Suppose the data, cost, observability, opponent, or audience changes.</h3><p>Which conclusion still holds? Which method or evaluation must change? State the condition that reverses your answer.</p></section></div>, note: "Use a condition relevant to today's material. Look for conditional reasoning rather than absolute claims." },
      { eyebrow: "Exit ticket", title: "Explain one idea, solve one case, name one limit", content: <div className="exit-grid"><article><span>01</span><h3>Explain</h3><p>Define the most important knowledge point in your own words.</p></article><article><span>02</span><h3>Apply</h3><p>Use it on a new example and show an intermediate step.</p></article><article><span>03</span><h3>Evaluate</h3><p>Name one assumption, failure mode, or evidence need.</p></article></div>, note: "Collect responses before students leave. Use errors to open the next meeting." },
      { eyebrow: "Reading and preparation", title: "Consolidate today; prepare to build on it", content: <div className="reading-layout"><section><span className="micro-label">Read or review</span>{meeting.readings.map((reading) => <p key={reading}>{reading}</p>)}</section><section><span className="micro-label">Before the next meeting</span><p>{meeting.preparation}</p><Link href={meeting.id < 30 ? `/meetings/${String(meeting.id + 1).padStart(2, "0")}` : "/"}>{meeting.id < 30 ? "Preview the next meeting →" : "Return to the course map →"}</Link></section></div>, note: `Source trace: ${meeting.sourceTrace.join("; ")}.` },
    );
    return generated;
  }, [meeting]);

  const go = (next: number) => setCurrent(Math.max(0, Math.min(slides.length - 1, next)));
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") go(current + 1);
      if (event.key === "ArrowLeft") go(current - 1);
      if (event.key.toLowerCase() === "o") setOverview((value) => !value);
      if (event.key.toLowerCase() === "n") setNotes((value) => !value);
      if (event.key === "Escape") { setOverview(false); setNotes(false); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [current, slides.length]);

  const slide = slides[current];
  return <main className={`deck planned-deck ${motion ? "" : "reduce-motion"}`}>
    <header className="deck-header"><Link className="brand" href="/"><span className="brand-mark">481</span><div><strong>CPSC 481</strong><small>Module {meeting.week} · Meeting {meeting.id}</small></div></Link><div className="header-actions"><button onClick={() => setOverview(!overview)} type="button">Overview</button><button onClick={() => setNotes(!notes)} type="button">Notes</button><button onClick={() => setMotion(!motion)} type="button">Motion {motion ? "on" : "off"}</button></div></header>
    <article className="slide" key={current}><div className="slide-heading"><span className="eyebrow">{slide.eyebrow}</span><h1>{slide.title}</h1>{slide.subtitle && <p>{slide.subtitle}</p>}</div><div className="slide-content">{slide.content}</div></article>
    <footer className="deck-footer"><button disabled={current === 0} onClick={() => go(current - 1)} type="button">←</button><div className="progress"><i style={{ width: `${((current + 1) / slides.length) * 100}%` }}/></div><span>{String(current + 1).padStart(2, "0")} / {slides.length}</span><button disabled={current === slides.length - 1} onClick={() => go(current + 1)} type="button">→</button></footer>
    {overview && <div className="overview-panel"><div><span className="micro-label">Meeting {meeting.id} · {slides.length} slides</span><h2>{meeting.title}</h2><button onClick={() => setOverview(false)} type="button">Close</button></div><section>{slides.map((item, index) => <button className={current === index ? "active" : ""} key={`${item.title}-${index}`} onClick={() => { setCurrent(index); setOverview(false); }} type="button"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.eyebrow}</small></button>)}</section></div>}
    {notes && <aside className="notes-panel"><button onClick={() => setNotes(false)} type="button">×</button><span className="micro-label">Instructor note</span><p>{slide.note}</p></aside>}
  </main>;
}
