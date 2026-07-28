"use client";

import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import { modules } from "../data/course";

export function CourseHub() {
  const [query, setQuery] = useState("");
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const visible = useMemo(() => modules.filter((module) => {
    const haystack = `${module.title} ${module.meetings.map((meeting) => meeting.title).join(" ")}`.toLowerCase();
    return (!activeWeek || module.week === activeWeek) && haystack.includes(query.toLowerCase());
  }), [activeWeek, query]);

  return (
    <main className="course-hub">
      <header className="course-hero">
        <nav><span className="course-code">CPSC 481</span><span>Introduction to Artificial Intelligence</span></nav>
        <div className="course-hero-grid">
          <section>
            <span className="hub-eyebrow">15 modules · 30 class meetings · one course site</span>
            <h1>Learn AI by explaining, tracing, building, and evaluating it.</h1>
            <p>Each 75-minute meeting develops a small set of college-level knowledge points through explanation, worked examples, interactive demonstrations, guided practice, and formative assessment.</p>
            <div className="hero-actions">
              <Link href="/meetings/01">Begin Meeting 1</Link>
              <a href="#modules">Browse all modules</a>
            </div>
          </section>
          <div className="course-orbit" aria-label="Course concept map">
            <strong>AI</strong>
            {["Agents", "Search", "Uncertainty", "Learning", "LLMs", "Evidence"].map((item, index) =>
              <span key={item} style={{ "--i": index } as CSSProperties}>{item}</span>)}
          </div>
        </div>
      </header>

      <section className="course-method">
        {[
          ["01", "Explain", "Build the mental model and define the boundary."],
          ["02", "Demonstrate", "Make the algorithm or system behavior visible."],
          ["03", "Practice", "Trace, calculate, design, or critique in class."],
          ["04", "Assess", "Reveal reasoning and misconceptions before moving on."],
        ].map((item) => <article key={item[0]}><span>{item[0]}</span><h2>{item[1]}</h2><p>{item[2]}</p></article>)}
      </section>

      <section className="module-browser" id="modules">
        <div className="browser-heading">
          <div><span className="hub-eyebrow">Course map</span><h2>Fifteen cumulative modules</h2></div>
          <div className="course-filters">
            <input aria-label="Search meetings" onChange={(event) => setQuery(event.target.value)} placeholder="Search a topic…" value={query} />
            <select aria-label="Filter by module" onChange={(event) => setActiveWeek(event.target.value ? Number(event.target.value) : null)} value={activeWeek ?? ""}>
              <option value="">All modules</option>
              {modules.map((module) => <option key={module.week} value={module.week}>Module {module.week}</option>)}
            </select>
          </div>
        </div>
        <div className="module-grid">
          {visible.map((module) => (
            <article className="module-card" key={module.week}>
              <div className="module-number">{String(module.week).padStart(2, "0")}</div>
              <div className="module-copy"><span>Module {module.week}</span><h3>{module.title}</h3></div>
              <div className="meeting-links">
                {module.meetings.map((meeting) => (
                  <Link href={`/meetings/${String(meeting.id).padStart(2, "0")}`} key={meeting.id}>
                    <span>Meeting {meeting.id}</span><strong>{meeting.title}</strong><i aria-hidden="true">→</i>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer className="course-footer"><strong>CPSC 481</strong><span>California State University, Fullerton</span></footer>
    </main>
  );
}
