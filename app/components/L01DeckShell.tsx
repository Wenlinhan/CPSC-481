"use client";

import { type ReactNode, type TouchEvent, useEffect, useState } from "react";

export type LessonSlide = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
  note: string;
  sourceSlides: number[];
};

type L01DeckShellProps = {
  meetingLabel: string;
  meetingTitle: string;
  slides: LessonSlide[];
};

export function L01DeckShell({ meetingLabel, meetingTitle, slides }: L01DeckShellProps) {
  const [current, setCurrent] = useState(0);
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const [sourceView, setSourceView] = useState(false);
  const [motion, setMotion] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const total = slides.length;

  const go = (requested: number) => {
    const next = Math.max(0, Math.min(total - 1, requested));
    setCurrent(next);
    setOverview(false);
    setSourceView(false);
    window.history.replaceState(null, "", `#slide-${next + 1}`);
  };

  useEffect(() => {
    const match = window.location.hash.match(/slide-(\d+)/);
    if (!match) return;
    const frame = window.requestAnimationFrame(() => {
      setCurrent(Math.max(0, Math.min(total - 1, Number(match[1]) - 1)));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [total]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tagName = (event.target as HTMLElement | null)?.tagName ?? "";
      if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A", "IFRAME"].includes(tagName)) return;
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        go(current + 1);
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(current - 1);
      } else if (event.key === "Home") {
        go(0);
      } else if (event.key === "End") {
        go(total - 1);
      } else if (event.key.toLowerCase() === "o") {
        setOverview(value => !value);
      } else if (event.key.toLowerCase() === "n") {
        setNotes(value => !value);
      } else if (event.key.toLowerCase() === "s") {
        setSourceView(value => !value);
      } else if (event.key.toLowerCase() === "f") {
        document.documentElement.requestFullscreen?.();
      } else if (event.key === "Escape") {
        setOverview(false);
        setNotes(false);
        setSourceView(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, total]);

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart === null) return;
    const end = event.changedTouches[0]?.clientX ?? touchStart;
    const delta = end - touchStart;
    if (Math.abs(delta) > 55) go(delta < 0 ? current + 1 : current - 1);
    setTouchStart(null);
  };

  const slide = slides[current];
  return (
    <main
      className={motion ? "deck ai-deck source-deck" : "deck ai-deck source-deck motion-off"}
      onTouchStart={event => setTouchStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={onTouchEnd}
    >
      <header className="deck-header">
        <div className="brand">
          <span className="brand-mark">481</span>
          <div><strong>CPSC 481</strong><small>Introduction to Artificial Intelligence</small></div>
        </div>
        <div className="header-actions">
          <button aria-pressed={motion} onClick={() => setMotion(value => !value)} type="button">
            Motion {motion ? "on" : "off"}
          </button>
          <button aria-pressed={notes} onClick={() => setNotes(value => !value)} type="button">Notes</button>
          <button
            aria-pressed={sourceView}
            onClick={() => {
              setOverview(false);
              setSourceView(value => !value);
            }}
            type="button"
          >
            Course source
          </button>
          <button onClick={() => setOverview(true)} type="button">Overview</button>
          <button onClick={() => window.print()} type="button">Print</button>
        </div>
      </header>

      <section
        className="slide"
        data-source-slides={slide.sourceSlides.join(",")}
        key={current}
      >
        <div className="slide-heading">
          <span className="eyebrow">{slide.eyebrow}</span>
          <h1>{slide.title}</h1>
          {slide.subtitle && <p>{slide.subtitle}</p>}
        </div>
        <div className="slide-content">{slide.content}</div>
      </section>

      {notes && (
        <aside className="speaker-notes">
          <div><span>Instructor note · Slide {current + 1}</span><button onClick={() => setNotes(false)} type="button">×</button></div>
          <p>{slide.note}</p>
        </aside>
      )}

      {sourceView && (
        <div className="source-reference-backdrop" role="presentation">
          <section
            aria-label={`Course source for lesson page ${current + 1}`}
            aria-modal="true"
            className="source-reference"
            role="dialog"
          >
            <div className="source-reference-heading">
              <div>
                <span>Course source · L01_AI.pptx</span>
                <h2>Exact reference {slide.sourceSlides.length === 1 ? "page" : "pages"} {slide.sourceSlides.join(", ")}</h2>
                <p>Inspect the complete wording, emphasis, and figures connected to this lesson page.</p>
              </div>
              <button aria-label="Close course source" onClick={() => setSourceView(false)} type="button">×</button>
            </div>
            <div className={slide.sourceSlides.length > 1 ? "source-reference-pages multiple" : "source-reference-pages"}>
              {[...new Set(slide.sourceSlides)].map(number => {
                const image = `/course-source/l01-ai/source-slides/slide-${String(number).padStart(2, "0")}.png`;
                return (
                  <figure key={number}>
                    <a href={image} rel="noreferrer" target="_blank">
                      <img alt={`Complete course source page ${number}`} src={image} />
                    </a>
                    <figcaption>Reference page {number} · select to enlarge</figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        </div>
      )}

      <footer className="deck-footer">
        <button aria-label="Previous slide" disabled={!current} onClick={() => go(current - 1)} type="button">←</button>
        <div className="progress-wrap">
          <div className="progress-meta"><span>{meetingTitle}</span><span>{current + 1} / {total}</span></div>
          <div aria-hidden="true" className="progress"><i style={{ width: `${((current + 1) / total) * 100}%` }} /></div>
        </div>
        <button aria-label="Next slide" disabled={current === total - 1} onClick={() => go(current + 1)} type="button">→</button>
      </footer>

      {overview && (
        <div className="overview-backdrop">
          <aside aria-label={`${meetingTitle} slide overview`} className="overview">
            <div className="overview-heading">
              <div><span>{meetingLabel}</span><h2>{meetingTitle}</h2></div>
              <button aria-label="Close overview" onClick={() => setOverview(false)} type="button">×</button>
            </div>
            <nav>
              {slides.map((item, index) => (
                <button
                  aria-current={index === current ? "page" : undefined}
                  key={`${item.title}-${index}`}
                  onClick={() => go(index)}
                  type="button"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><small>{item.eyebrow}</small><strong>{item.title}</strong></div>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </main>
  );
}
