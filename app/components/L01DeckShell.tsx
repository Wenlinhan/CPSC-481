"use client";

import { type ReactNode, type TouchEvent, useEffect, useRef, useState } from "react";

export type LessonSlide = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
  keyPoints?: readonly string[];
  minutes?: number;
  note: string;
  sourceSlides: number[];
};

export type CourseSourceReference = {
  deckLabel: string;
  image: string;
  key?: string;
  page: number;
};

type L01DeckShellProps = {
  forcePrintAll?: boolean;
  hoverEffects?: boolean;
  meetingLabel: string;
  meetingTitle: string;
  notesMode?: "instructor" | "key-points";
  resolveSourceReference?: (sourceSlide: number) => CourseSourceReference;
  slides: LessonSlide[];
  sourceCollectionLabel?: string;
  sourceCollectionPath?: string;
  timingPlan?: readonly number[];
};

const DEFAULT_SOURCE_COLLECTION_LABEL = "L01_AI.pptx";

function resolveL01SourceReference(sourceSlide: number): CourseSourceReference {
  return {
    deckLabel: DEFAULT_SOURCE_COLLECTION_LABEL,
    image: `/course-source/l01-ai/source-slides/slide-${String(sourceSlide).padStart(2, "0")}.png`,
    key: `l01-ai:${sourceSlide}`,
    page: sourceSlide,
  };
}

function inferMinutes(slide: LessonSlide): number | undefined {
  if (slide.minutes) return slide.minutes;
  const direct = slide.note.match(/Timing:\s*(\d+)\s+minutes?/i);
  if (direct) return Number(direct[1]);
  const range = slide.note.match(/(?:^|\s)(\d+)\s*[–-]\s*(\d+)\s+minutes?/i);
  if (range) return Math.max(1, Number(range[2]) - Number(range[1]));
  return undefined;
}

function noteStartsWithTiming(note: string): boolean {
  return /^(?:Timing:|\d+\s*[–-]\s*\d+\s+minutes?|Allocate\s+\w+\s+minutes?)/i.test(note);
}

function normalizeKeyPoint(value: string): string {
  return value.replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
}

function shortenKeyPoint(value: string): string {
  if (value.length <= 220) return value;
  const firstSentence = value.match(/^.{40,220}?[.!?](?:\s|$)/)?.[0]?.trim();
  if (firstSentence) return firstSentence;
  return `${value.slice(0, 217).replace(/\s+\S*$/, "")}…`;
}

function isBoilerplateKeyPoint(value: string): boolean {
  return /^(?:cpsc\s*481(?:\s*[·|-]\s*introduction to artificial intelligence)?|introduction to artificial intelligence|all modules)$/i.test(value)
    || /(?:click|select)(?: the)? (?:image|figure|page)? ?to enlarge/i.test(value);
}

function collectKeyPoints(root: HTMLDivElement | null, slide: LessonSlide): string[] {
  if (slide.keyPoints?.length) {
    return slide.keyPoints.map(normalizeKeyPoint).filter(Boolean).slice(0, 5);
  }
  if (!root) return slide.subtitle ? [slide.subtitle] : [slide.title];
  const candidates = [
    slide.subtitle ?? "",
    ...Array.from(root.querySelectorAll("h2, h3, h4, p, li, figcaption, article > strong, section > strong"))
      .map(element => element.textContent ?? ""),
  ];
  const points: string[] = [];

  for (const raw of candidates) {
    const point = shortenKeyPoint(normalizeKeyPoint(raw));
    if (point.length < 18 || point.toLowerCase() === slide.title.toLowerCase() || isBoilerplateKeyPoint(point)) continue;
    if (/^(?:next|previous|reset|reveal|hide|check answer|try again)$/i.test(point)) continue;
    if (points.some(existing => existing.toLowerCase() === point.toLowerCase())) continue;
    points.push(point);
    if (points.length === 5) break;
  }

  if (points.length < 3) {
    const fallback = normalizeKeyPoint(root.innerText)
      .split(/(?<=[.!?])\s+/)
      .map(shortenKeyPoint);
    for (const point of fallback) {
      if (point.length < 24 || isBoilerplateKeyPoint(point)) continue;
      if (points.some(existing => existing.toLowerCase() === point.toLowerCase())) continue;
      points.push(point);
      if (points.length === 5) break;
    }
  }

  return points.length ? points : [slide.subtitle ?? slide.title];
}

export function L01DeckShell({
  forcePrintAll = false,
  hoverEffects = true,
  meetingLabel,
  meetingTitle,
  notesMode = "instructor",
  resolveSourceReference,
  slides,
  sourceCollectionLabel = DEFAULT_SOURCE_COLLECTION_LABEL,
  sourceCollectionPath = "l01-ai",
  timingPlan,
}: L01DeckShellProps) {
  const [current, setCurrent] = useState(0);
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const [motion, setMotion] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [printAll, setPrintAll] = useState(forcePrintAll);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const slideContentRef = useRef<HTMLDivElement>(null);
  const total = slides.length;

  const go = (requested: number) => {
    const next = Math.max(0, Math.min(total - 1, requested));
    setCurrent(next);
    setOverview(false);
    window.history.replaceState(null, "", `#slide-${next + 1}`);
  };

  useEffect(() => {
    setPrintAll(forcePrintAll || new URLSearchParams(window.location.search).get("print") === "all");
  }, [forcePrintAll]);

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
      } else if (event.key.toLowerCase() === "f") {
        document.documentElement.requestFullscreen?.();
      } else if (event.key === "Escape") {
        setOverview(false);
        setNotes(false);
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
  const currentMinutes = timingPlan?.[current] ?? inferMinutes(slide);
  const noteParagraphs = slide.note.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean);
  void resolveSourceReference;
  void sourceCollectionLabel;
  void sourceCollectionPath;

  useEffect(() => {
    if (notesMode !== "key-points") return;
    const frame = window.requestAnimationFrame(() => {
      setKeyPoints(collectKeyPoints(slideContentRef.current, slides[current]));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [current, notesMode, slides]);

  if (printAll) {
    return (
      <main className="deck ai-deck source-deck print-all-deck">
        {slides.map((item, index) => (
          <section
            className="slide"
            data-source-slides={item.sourceSlides.join(",")}
            key={`${item.title}-${index}`}
          >
            <div className="slide-heading">
              <span className="eyebrow">{item.eyebrow}</span>
              <h1>{item.title}</h1>
              {item.subtitle && <p>{item.subtitle}</p>}
            </div>
            <div className="slide-content">{item.content}</div>
          </section>
        ))}
      </main>
    );
  }

  return (
    <main
      className={`deck ai-deck source-deck${hoverEffects ? " hover-effects" : ""}${motion ? "" : " motion-off"}`}
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
        <div className="slide-content" ref={slideContentRef}>{slide.content}</div>
      </section>

      {notes && (
        <aside className="speaker-notes">
          <div><span>{notesMode === "key-points" ? "Page key points" : "Instructor note"} · Slide {current + 1}</span><button aria-label="Close notes" onClick={() => setNotes(false)} type="button">×</button></div>
          {notesMode === "key-points" ? (
            <ul className="speaker-note-points">
              {keyPoints.map((point, index) => <li key={`${current}-${index}`}>{point}</li>)}
            </ul>
          ) : (
            <div className="speaker-note-body">
              {noteParagraphs.map((paragraph, index) => (
                <p key={`${current}-${index}`}>
                  {index === 0 && currentMinutes && !noteStartsWithTiming(slide.note) ? `Timing: ${currentMinutes} minutes. ` : ""}
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </aside>
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
                  <div><small>{item.eyebrow}{(timingPlan?.[index] ?? inferMinutes(item)) ? ` · ${timingPlan?.[index] ?? inferMinutes(item)} min` : ""}</small><strong>{item.title}</strong></div>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </main>
  );
}
