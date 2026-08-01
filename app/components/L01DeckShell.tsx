"use client";

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type TouchEvent,
  useEffect,
  useState,
} from "react";

export type LessonSlide = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
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
  hoverEffects?: boolean;
  meetingLabel: string;
  meetingTitle: string;
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

export function L01DeckShell({
  hoverEffects = false,
  meetingLabel,
  meetingTitle,
  resolveSourceReference,
  slides,
  sourceCollectionLabel = DEFAULT_SOURCE_COLLECTION_LABEL,
  sourceCollectionPath = "l01-ai",
  timingPlan,
}: L01DeckShellProps) {
  const [current, setCurrent] = useState(0);
  const [overview, setOverview] = useState(false);
  const [notes, setNotes] = useState(false);
  const [sourceView, setSourceView] = useState(false);
  const [motion, setMotion] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [printAll, setPrintAll] = useState(false);
  const total = slides.length;

  const go = (requested: number) => {
    const next = Math.max(0, Math.min(total - 1, requested));
    setCurrent(next);
    setOverview(false);
    setSourceView(false);
    window.history.replaceState(null, "", `#slide-${next + 1}`);
  };

  useEffect(() => {
    setPrintAll(new URLSearchParams(window.location.search).get("print") === "all");
  }, []);

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

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!hoverEffects || !motion || event.pointerType === "touch") return;

    const target = (event.target as HTMLElement).closest<HTMLElement>(
      ".slide-content article, .slide-content aside, .slide-content blockquote, .slide-content .source-concept, .slide-content .source-figure, .slide-content .search-source-image, .slide-content .source-callout, .slide-content .search-callout, .slide-content .source-formula",
    );
    if (!target || !event.currentTarget.contains(target)) return;

    const bounds = target.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    target.style.setProperty("--hover-x", `${Math.round(x * 100)}%`);
    target.style.setProperty("--hover-y", `${Math.round(y * 100)}%`);
    target.style.setProperty("--hover-rotate", `${((x - 0.5) * 1.4).toFixed(2)}deg`);
  };

  const slide = slides[current];
  const currentMinutes = timingPlan?.[current] ?? inferMinutes(slide);
  const sourceReferenceResolver = resolveSourceReference ?? (
    sourceCollectionPath === "l01-ai" && sourceCollectionLabel === DEFAULT_SOURCE_COLLECTION_LABEL
      ? resolveL01SourceReference
      : (sourceSlide: number): CourseSourceReference => ({
        deckLabel: sourceCollectionLabel,
        image: `/course-source/${sourceCollectionPath}/source-slides/slide-${String(sourceSlide).padStart(2, "0")}.png`,
        key: `${sourceCollectionPath}:${sourceSlide}`,
        page: sourceSlide,
      })
  );
  const sourceReferences = slide.sourceSlides.reduce<CourseSourceReference[]>((references, sourceSlide) => {
    const reference = sourceReferenceResolver(sourceSlide);
    const key = reference.key ?? `${reference.deckLabel}:${reference.page}:${reference.image}`;
    if (!references.some(item => (item.key ?? `${item.deckLabel}:${item.page}:${item.image}`) === key)) {
      references.push({ ...reference, key });
    }
    return references;
  }, []);
  const sourceReferenceGroups = sourceReferences.reduce<Map<string, number[]>>((groups, reference) => {
    const pages = groups.get(reference.deckLabel) ?? [];
    pages.push(reference.page);
    groups.set(reference.deckLabel, pages);
    return groups;
  }, new Map());
  const sourceReferenceHeading = sourceReferenceGroups.size
    ? [...sourceReferenceGroups.entries()]
      .map(([deckLabel, pages]) => `${deckLabel} · ${pages.length === 1 ? "page" : "pages"} ${pages.join(", ")}`)
      .join("; ")
    : "No exact course source page is attached to this lesson page";

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
      onPointerMove={onPointerMove}
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
          <p>{currentMinutes && !noteStartsWithTiming(slide.note) ? `Timing: ${currentMinutes} minutes. ` : ""}{slide.note}</p>
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
                <span>Course source · {sourceCollectionLabel}</span>
                <h2>{sourceReferenceHeading}</h2>
                <p>
                  {sourceReferences.length
                    ? "Inspect the complete wording, emphasis, and figures connected to this lesson page."
                    : "This lesson page is a labeled supplement or synthesis without a directly attached source page."}
                </p>
              </div>
              <button aria-label="Close course source" onClick={() => setSourceView(false)} type="button">×</button>
            </div>
            <div className={sourceReferences.length > 1 ? "source-reference-pages multiple" : "source-reference-pages"}>
              {sourceReferences.map(reference => (
                <figure key={reference.key}>
                  <a href={reference.image} rel="noreferrer" target="_blank">
                    <img
                      alt={`Complete ${reference.deckLabel} course source page ${reference.page}`}
                      src={reference.image}
                    />
                  </a>
                  <figcaption>{reference.deckLabel} · page {reference.page} · select to enlarge</figcaption>
                </figure>
              ))}
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
