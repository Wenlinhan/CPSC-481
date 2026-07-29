"use client";

import { type ReactNode, useState } from "react";

const defaultSourceRoot = "/course-source/l02-state-space";

export function SearchSourceImage({
  file,
  alt,
  caption,
  className = "",
  sourceRoot = defaultSourceRoot,
}: {
  file: string;
  alt: string;
  caption?: string;
  className?: string;
  sourceRoot?: string;
}) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <>
      <figure className={`search-source-image ${className}`.trim()}>
        <button
          aria-label={`Enlarge: ${alt}`}
          onClick={() => setZoomed(true)}
          type="button"
        >
          <img alt={alt} src={`${sourceRoot}/${file}`} />
        </button>
        {caption && <figcaption>{caption}<span>Click image to enlarge</span></figcaption>}
      </figure>
      {zoomed && (
        <div
          aria-label={`Enlarged source figure: ${alt}`}
          aria-modal="true"
          className="source-image-lightbox"
          role="dialog"
        >
          <button
            aria-label="Close enlarged image"
            className="source-image-close"
            onClick={() => setZoomed(false)}
            type="button"
          >
            ×
          </button>
          <img alt={alt} src={`${sourceRoot}/${file}`} />
          {caption && <p>{caption}</p>}
        </div>
      )}
    </>
  );
}

export function ReplayableSourceAnimation({
  file,
  alt,
  caption,
  attribution,
  sourceRoot,
}: {
  file: string;
  alt: string;
  caption: string;
  attribution: string;
  sourceRoot: string;
}) {
  const [run, setRun] = useState(0);
  return (
    <div className="replayable-source-animation">
      <SearchSourceImage
        alt={alt}
        caption={caption}
        file={`${file}?replay=${run}`}
        sourceRoot={sourceRoot}
      />
      <div>
        <span>{attribution}</span>
        <button onClick={() => setRun(value => value + 1)} type="button">
          Replay animation
        </button>
      </div>
    </div>
  );
}

export function SearchCallout({
  label,
  children,
  tone = "indigo",
}: {
  label: string;
  children: ReactNode;
  tone?: "indigo" | "cyan" | "amber" | "green";
}) {
  return (
    <aside className={`search-callout ${tone}`}>
      <strong>{label}</strong>
      <div>{children}</div>
    </aside>
  );
}

export function SearchQuickCheck({
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
    <div className="search-quick-check">
      <section>
        <span>Check for understanding</span>
        <h3>{question}</h3>
        <p>Commit to an answer, then defend the representation or search rule.</p>
      </section>
      <div>
        {options.map((option, index) => (
          <button
            className={choice === index ? (index === correct ? "correct" : "incorrect") : ""}
            key={option}
            onClick={() => setChoice(index)}
            type="button"
          >
            <span>{String.fromCharCode(65 + index)}</span>
            {option}
          </button>
        ))}
        {choice !== null && (
          <p className="search-check-feedback">
            <strong>{choice === correct ? "Correct." : "Reconsider."}</strong> {explanation}
          </p>
        )}
      </div>
    </div>
  );
}

export function RevealSequence({
  items,
  prompt,
}: {
  items: Array<{ label: string; detail: string }>;
  prompt: string;
}) {
  const [revealed, setRevealed] = useState(0);
  return (
    <div className="search-reveal">
      <section>
        <span>Predict before reveal</span>
        <h3>{prompt}</h3>
        <p>Explain the next step aloud before advancing.</p>
        <div>
          <button
            disabled={revealed >= items.length}
            onClick={() => setRevealed(value => Math.min(items.length, value + 1))}
            type="button"
          >
            Reveal next
          </button>
          <button
            onClick={() => setRevealed(revealed === items.length ? 0 : items.length)}
            type="button"
          >
            {revealed === items.length ? "Reset" : "Reveal all"}
          </button>
        </div>
      </section>
      <ol>
        {items.map((item, index) => (
          <li className={index < revealed ? "visible" : ""} key={`${item.label}-${index}`}>
            <span>{index + 1}</span>
            <div>
              <strong>{index < revealed ? item.label : "Commit your next step"}</strong>
              <p>{index < revealed ? item.detail : "Reason from the current state."}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const puzzleStart = [
  ["1", "4", "3"],
  ["7", "", "6"],
  ["5", "8", "2"],
];

const puzzleResults: Record<string, string[][]> = {
  Up: [["1", "", "3"], ["7", "4", "6"], ["5", "8", "2"]],
  Left: [["1", "4", "3"], ["", "7", "6"], ["5", "8", "2"]],
  Down: [["1", "4", "3"], ["7", "8", "6"], ["5", "", "2"]],
  Right: [["1", "4", "3"], ["7", "6", ""], ["5", "8", "2"]],
};

function PuzzleBoard({ cells }: { cells: string[][] }) {
  return (
    <div className="puzzle-board">
      {cells.flatMap((row, rowIndex) => row.map((cell, columnIndex) => (
        <span className={cell ? "" : "blank"} key={`${rowIndex}-${columnIndex}`}>
          {cell || "blank"}
        </span>
      )))}
    </div>
  );
}

export function PuzzleMoveDemo() {
  const [move, setMove] = useState<string | null>(null);
  return (
    <div className="puzzle-move-demo">
      <section>
        <span>Current state</span>
        <PuzzleBoard cells={puzzleStart} />
      </section>
      <div className="puzzle-actions">
        <p>An operator moves the blank. Choose one legal action.</p>
        <nav>
          {Object.keys(puzzleResults).map(name => (
            <button
              className={move === name ? "active" : ""}
              key={name}
              onClick={() => setMove(name)}
              type="button"
            >
              {name}
            </button>
          ))}
        </nav>
      </div>
      <section>
        <span>Successor state</span>
        {move ? <PuzzleBoard cells={puzzleResults[move]} /> : <div className="puzzle-placeholder">Select an operator</div>}
      </section>
    </div>
  );
}

const directionCases = [
  {
    title: "Interpret geological measurements",
    prompt: "The measurements are given; many high-level interpretations are possible.",
    answer: "Data-driven / forward search",
    why: "Begin from available facts and apply rules until a useful interpretation is produced. PROSPECTOR is the source example.",
  },
  {
    title: "Identify a molecule from formula and mass",
    prompt: "Facts are available and only a few rules use this particular evidence.",
    answer: "Data-driven / forward search",
    why: "DENDRAL works from the observed formula and mass toward candidate molecular structures.",
  },
  {
    title: "Prove a theorem",
    prompt: "The desired statement is known; its required conditions can become subgoals.",
    answer: "Goal-driven / backward search",
    why: "Start with the theorem and work backward through rules until reaching established facts.",
  },
  {
    title: "Confirm a medical diagnosis",
    prompt: "The hypothesis is known, but tests should be ordered only when they help confirm or deny it.",
    answer: "Goal-driven / backward search",
    why: "The diagnosis guides which evidence is worth acquiring next.",
  },
];

export function SearchDirectionPractice() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = directionCases[active];
  return (
    <div className="direction-practice">
      <nav>
        {directionCases.map((entry, index) => (
          <button
            className={active === index ? "active" : ""}
            key={entry.title}
            onClick={() => {
              setActive(index);
              setRevealed(false);
            }}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <span>Case {active + 1}</span>
        <h3>{item.title}</h3>
        <p>{item.prompt}</p>
        <button onClick={() => setRevealed(value => !value)} type="button">
          {revealed ? "Hide analysis" : "Reveal analysis"}
        </button>
        {revealed && (
          <SearchCallout label={item.answer} tone="green">
            {item.why}
          </SearchCallout>
        )}
      </section>
    </div>
  );
}

type SearchStep = {
  selected: string;
  open: string;
  closed: string;
};

const dfsSteps: SearchStep[] = [
  { selected: "A", open: "[B, C, D]", closed: "[A]" },
  { selected: "B", open: "[E, F, C, D]", closed: "[B, A]" },
  { selected: "E", open: "[K, L, F, C, D]", closed: "[E, B, A]" },
  { selected: "K", open: "[S, L, F, C, D]", closed: "[K, E, B, A]" },
  { selected: "S", open: "[L, F, C, D]", closed: "[S, K, E, B, A]" },
  { selected: "L", open: "[T, F, C, D]", closed: "[L, S, K, E, B, A]" },
  { selected: "T", open: "[F, C, D]", closed: "[T, L, S, K, E, B, A]" },
  { selected: "F", open: "[M, C, D]", closed: "[F, T, L, S, K, E, B, A]" },
  { selected: "M", open: "[C, D]", closed: "[M, F, T, L, S, K, E, B, A]" },
  { selected: "C", open: "[G, H, D]", closed: "[C, M, F, T, L, S, K, E, B, A]" },
];

const bfsSteps: SearchStep[] = [
  { selected: "A", open: "[B, C, D]", closed: "[A]" },
  { selected: "B", open: "[C, D, E, F]", closed: "[B, A]" },
  { selected: "C", open: "[D, E, F, G, H]", closed: "[C, B, A]" },
  { selected: "D", open: "[E, F, G, H, I, J]", closed: "[D, C, B, A]" },
  { selected: "E", open: "[F, G, H, I, J, K, L]", closed: "[E, D, C, B, A]" },
  { selected: "F", open: "[G, H, I, J, K, L, M]", closed: "[F, E, D, C, B, A]" },
  { selected: "G", open: "[H, I, J, K, L, M]", closed: "[G, F, E, D, C, B, A]" },
  { selected: "H", open: "[I, J, K, L, M, N, O]", closed: "[H, G, F, E, D, C, B, A]" },
];

export function FrontierTrace({ mode }: { mode: "dfs" | "bfs" }) {
  const steps = mode === "dfs" ? dfsSteps : bfsSteps;
  const [index, setIndex] = useState(0);
  const step = steps[index];
  return (
    <div className="frontier-trace">
      <section>
        <span>{mode.toUpperCase()} trace</span>
        <h3>Iteration {index + 1}</h3>
        <p>Remove <strong>{step.selected}</strong> from the left of OPEN, test it, expand it, and place it on CLOSED.</p>
        <div>
          <button disabled={index === 0} onClick={() => setIndex(value => Math.max(0, value - 1))} type="button">Previous</button>
          <button disabled={index === steps.length - 1} onClick={() => setIndex(value => Math.min(steps.length - 1, value + 1))} type="button">Next</button>
          <button onClick={() => setIndex(0)} type="button">Reset</button>
        </div>
      </section>
      <div className="frontier-queues">
        <article><span>OPEN</span><strong>{step.open}</strong><small>{mode === "dfs" ? "new children go to the left" : "new children go to the right"}</small></article>
        <article><span>CLOSED</span><strong>{step.closed}</strong><small>already examined states</small></article>
      </div>
    </div>
  );
}

const backtrackingRows = [
  ["0", "A", "[A]", "[A]", "[ ]"],
  ["1", "B", "[B A]", "[B C D A]", "[ ]"],
  ["2", "E", "[E B A]", "[E F B C D A]", "[ ]"],
  ["3", "H", "[H E B A]", "[H I E F B C D A]", "[ ]"],
  ["4", "I", "[I E B A]", "[I E F B C D A]", "[H]"],
  ["5", "F", "[F B A]", "[F B C D A]", "[E I H]"],
  ["6", "J", "[J F B A]", "[J F B C D A]", "[E I H]"],
  ["7", "C", "[C A]", "[C D A]", "[B F J E I H]"],
  ["8", "G", "[G C A]", "[G C D A]", "[B F J E I H]"],
];

export function BacktrackingTrace() {
  const [row, setRow] = useState(0);
  const values = backtrackingRows[row];
  return (
    <div className="backtracking-trace">
      <section>
        <span>Trace the data structures</span>
        <h3>After iteration {values[0]}</h3>
        <p>Predict the next current state and which failed states must be recorded.</p>
        <input
          aria-label="Backtracking trace iteration"
          max={backtrackingRows.length - 1}
          min="0"
          onChange={event => setRow(Number(event.target.value))}
          type="range"
          value={row}
        />
      </section>
      <div>
        <article><span>CS</span><strong>{values[1]}</strong><small>current state</small></article>
        <article><span>SL</span><strong>{values[2]}</strong><small>current path</small></article>
        <article><span>NSL</span><strong>{values[3]}</strong><small>new-state list</small></article>
        <article><span>DE</span><strong>{values[4]}</strong><small>dead ends</small></article>
      </div>
    </div>
  );
}
