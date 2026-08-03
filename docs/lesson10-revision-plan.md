# Lesson 10 revision plan

Lesson 10 is a 75-minute, 28-page native HTML lecture grounded in all 33 pages of `L07_GP.pdf` and all 28 authoritative slides of `L08_ArtificialLife.pptx`. Full source-page renders remain available only in the Course source dialog.

## Knowledge-point plan

| Knowledge point | Source evidence | Explanation | Visual or demo | Student task | Check | Minutes |
|---|---|---|---|---|---|---:|
| Genetic programming and executable representation | L07 1–4 | Define GP before showing an example; contrast GA strings with executable program trees; introduce Lisp prefix notation and functions/terminals | Generated hero plus native Lisp-to-tree diagram | Translate a Lisp expression between text and tree | Identify functions, terminals, root, and evaluation order | 9 |
| Generational GP and variation | L07 5–20 | Present complete pseudocode, then trace initialization, fitness, selection, mutation, crossover, replacement, and termination | Native pseudocode, lifecycle loop, progressive random-tree builder, mutation/crossover SVG | Predict valid offspring and explain why fitness-guided search differs from random search | Locate the population state changed by each step | 17 |
| Complete mouse-navigation case | L07 21–27 | Define function/terminal sets, execute a candidate, calculate fitness, vary programs, and interpret the evolved result | Native maze, executable program tree, fitness calculator, before/after programs | Diagnose and improve a candidate controller | Calculate `(cost + distance)^2` and prefer the lower score | 11 |
| GP design, tournament GP, regression, applications | L07 28–33 | Explain sufficiency, parsimony, closure, steady-state replacement, symbolic regression, parallel search, uses, and limits | Constraint triangle, tournament flow, data table and fitted curve, search landscape | Choose a safe primitive set and compare GP with an exact algorithm | Explain one failure caused by violating closure or parsimony | 12 |
| Artificial life and swarm intelligence | L08 1–7, including PPTX-only slide 6 | Define ALife and decentralized emergence; distinguish coordinated robotics from genuine swarm intelligence | Generated ALife illustration, simulator timeline, local-rule-to-global-pattern diagram, PSO vector field, bee recruitment map | Classify wet/hard/soft ALife and trace one PSO/bee update | Contrast PSO memory with GA crossover/mutation | 13 |
| Ant colony optimization and synthesis | L08 8–28 | Explain random exploration, pheromone reinforcement, obstacle detours, discovery, positive feedback, evaporation, comparison, and review | Two progressive ACO diagrams: obstacle reconnection and new-food discovery | Predict which trail strengthens and why evaporation matters | Match GA, GP, PSO, bees, and ACO to representation and shared memory | 13 |

## Page and visual plan

| Page | Teaching purpose | Source | Visual job | Reconstruction | QA risk |
|---:|---|---|---|---|---|
| 1 | Opening question: can code itself evolve? | L07 1 | Establish programs—not numbers—as candidates | Generated scientific-educational hero | Image crop and text contrast |
| 2 | Define genetic programming | L07 2–3 | GA-to-GP representation bridge | Native comparison diagram | Definition fidelity |
| 3 | Introduce Lisp and the tutorial | L07 3–4 | Explain prefix notation and nested calls | Native syntax anatomy plus external tutorial link | Link visibility and context |
| 4 | Map Lisp expression to tree | L07 4 | Connect every token to a node | Native SVG tree | Label collision |
| 5 | Show complete generational-GP pseudocode | L07 5 | Make the algorithm category and control flow explicit | Native readable pseudocode | Dense text |
| 6 | Explain one generation | L07 5–6 | Tie each pseudocode block to population state | Native lifecycle loop | Arrow clarity |
| 7 | Define function and terminal sets | L07 7 | Show grammar constraints | Native set cards plus tree legend | Concept distinction |
| 8 | Build a random program recursively | L07 8–13 | Reveal recursive expansion | Interactive SVG tree builder | State and focus behavior |
| 9 | Mutation | L07 14–16 | Replace one selected subtree | Before/after SVG | Subtree boundary clarity |
| 10 | Crossover | L07 17–19 | Swap compatible subtrees | Paired trees and offspring | Edge and node identity |
| 11 | Fitness-guided search versus random generation | L07 20 | Show accumulated selection advantage | Native comparison chart | Avoid overstating guarantee |
| 12 | Mouse case: primitives and controller | L07 21–22 | Ground GP in a complete task | Native maze and program tree | Maze readability |
| 13 | Mouse fitness | L07 23 | Calculate execution cost and remaining distance | Native maze trace and equation | Exact value 12100 |
| 14 | Mouse mutation and crossover | L07 24–26 | Connect operators to behavior change | Program cards with exchanged branches | Text density |
| 15 | Evolved mouse result | L07 27 | Compare fitness 12996 versus 2809 | Before/after route and program summary | Exact values |
| 16 | Sufficiency, parsimony, closure, parameters | L07 28 | Turn design properties into checks | Native constraint triangle | Terminology fidelity |
| 17 | Tournament GP | L07 29 | Contrast steady-state and generational replacement | Native pseudocode and flow | Algorithm completeness |
| 18 | Symbolic regression | L07 30 | Connect data, error fitness, and learned `x²/2` | Native table, curve, parameter panel | Exact data and parameters |
| 19 | Parallel search, applications, and limits | L07 31–33 | Show implicit parallelism and appropriate use | Native landscape and use/limit callouts | Avoid filler visuals |
| 20 | Define ALife and three modes | L08 1–2 | Connect simulation, robotics, and biochemistry | Generated ALife illustration plus simulator timeline | Preserve L08/L07 separation |
| 21 | Define swarm intelligence | L08 3–4, 6 | Show local rules producing global pattern; classify robot demos | Native agent-interaction diagram | Do not equate all robot groups with swarms |
| 22 | PSO trace | L08 5 | Show inertia, personal best, and global best as vectors; include full algorithm | Interactive contour map and native pseudocode | Equation and vector legibility |
| 23 | Bees algorithm | L08 7 | Show scouting, dance information, recruitment, exploitation, abandonment | Interactive hive-to-patch map | Direction/distance/quality mapping |
| 24 | ACO obstacle reconnection | L08 8–14 | Show stochastic split and faster reinforcement of shorter detour | Progressive native route diagram | Trail-weight clarity |
| 25 | ACO food discovery and evaporation | L08 15–22 | Show exploration, discovery, reinforcement, stochastic alternatives, evaporation | Progressive native network | State transition clarity |
| 26 | Method comparison | L08 23 | Compare representation, fitness, variation, and shared memory | Native table plus reveal check | Table fit |
| 27 | Cumulative review studio | L08 24–27 | Require explanation and transfer | Interactive prompt/reveal cards | Answers required |
| 28 | Exit ticket and references | L08 28 | Synthesize GP and swarm methods | Native synthesis map | Final-page completeness |

## Source-page destinations

- L07 pages 1–4 → lesson pages 1–4.
- L07 pages 5–6 → lesson pages 5–6.
- L07 pages 7–13 → lesson pages 7–8.
- L07 pages 14–16 → lesson page 9.
- L07 pages 17–19 → lesson page 10.
- L07 page 20 → lesson page 11.
- L07 pages 21–22 → lesson page 12.
- L07 page 23 → lesson page 13.
- L07 pages 24–26 → lesson page 14.
- L07 page 27 → lesson page 15.
- L07 page 28 → lesson page 16.
- L07 page 29 → lesson page 17.
- L07 page 30 → lesson page 18.
- L07 pages 31–33 → lesson page 19.
- L08 pages 1–2 → lesson page 20.
- L08 pages 3–4 and PPTX-only page 6 → lesson page 21.
- L08 page 5 → lesson page 22.
- L08 page 7 → lesson page 23.
- L08 pages 8–14 → lesson page 24.
- L08 pages 15–22 → lesson page 25.
- L08 page 23 → lesson page 26.
- L08 pages 24–27 → lesson page 27.
- L08 page 28 → lesson page 28.
