# Lesson 6 property and visual revision plan

## Source and terminology inventory

| Knowledge point | Source evidence | Explanation to preserve or add | Visual / interaction | Student check |
|---|---|---|---|---|
| Search-algorithm evaluation | `L04_BFS&AStar.pptx`, pages 9, 11, and 19; existing Lesson 6 page 22 | Evaluate the whole procedure for completeness, optimality (also called algorithm admissibility in classical search), time, and space, always with its assumptions | Algorithm lens with four labeled gauges | Classify “Is greedy best-first complete?” as an algorithm question |
| Heuristic admissibility | Source page 9; existing Lesson 6 pages 10 and 21 | `0 <= h(n) <= h*(n)` and `h(goal)=0`; the heuristic never overestimates remaining optimal cost | Lower-bound ruler from zero to true remaining cost | Decide whether `h1` is admissible and state the required evidence |
| Consistency / monotonicity | Source page 16; existing Lesson 6 page 18 | `h(n) <= c(n,n') + h(n')` on every edge; also called monotonicity or local admissibility | Local triangle / edge test | Decide whether `h2` is consistent by checking every edge |
| Informedness / dominance | Source pages 17-18; existing Lesson 6 pages 20-21 | Among admissible heuristics, pointwise larger values are more informed; include computation cost | Nested lower-bound bars | Compare `h1` and `h2` pointwise, then qualify the cost claim |
| Category diagnosis | Source correction ledger notes that the deck mixes heuristic and algorithm properties | First identify the object: a function `h` or a search procedure. “Is DFS consistent?” is a category mismatch under heuristic consistency. “Is algorithm A admissible?” uses the classical algorithm sense: guaranteed optimal | Two-lens question sorter with four worked prompts | Sort each prompt before answering it |
| Five A* application cases | Source page 20; existing Lesson 6 page 23 | Preserve autopilot, autonomous drone, robot vacuum, chess, and financial investment, including why A* is only suitable under particular models | Five recognizable native SVG scenes plus interactive analysis | Name state, actions, cost, heuristic, and assumptions for the selected case |

## Visual audit

Lesson 6 pages 4-8 and 10-21 already use exact source figures, replayable animations, interactive traces, or native explanatory diagrams. Pages 1-3, 9, 24, and 25 use structured native process maps, cards, checks, or synthesis layouts. The two weakest visual pages are page 22 (dense comparison table) and page 23 (numbered text tabs), so this revision concentrates new explanatory graphics there instead of adding decorative imagery to already visual pages.

## QA targets

- Page 22 must visibly separate heuristic-function properties from search-algorithm properties.
- “Consistency,” “monotonicity,” and “local admissibility” must appear together.
- Algorithm admissibility must be distinguished from heuristic admissibility.
- Page 23 must show five recognizable scenes and preserve the five-case interactive reveal.
- Both pages must fit the 1536x723 Canvas player and a 1024x768 narrow viewport without clipping.
