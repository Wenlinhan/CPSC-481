# CPSC 481 source-fidelity and modernization map

This file is the implementation ledger for the unified 15-week, 30-meeting course site. It separates three kinds of material:

- **Preserved source knowledge**: concepts, definitions, examples, diagrams, algorithms, and instructional sequences from the historical CPSC 481 archive.
- **Corrected source knowledge**: historically used material retained with a mathematical, factual, typographic, or attribution correction.
- **Modern supplement**: material added to support the revised course plan, current practice, demonstrations, laboratories, or assessment.

The source decks are evidence, not a visual template. New meeting decks may reorganize the material into a stronger college-level teaching sequence, but they must not silently omit a source knowledge point or crop a knowledge-bearing source image.

## Definition of done for a source-grounded meeting

1. Inventory every source slide, text object, speaker note, embedded image, animation, and media reference.
2. Record a source-slide-to-meeting-page mapping.
3. Preserve every knowledge-bearing definition, example, diagram, and algorithm.
4. Retain exact source images at their natural aspect ratio; use click-to-enlarge when fine labels matter.
5. Distinguish corrections and modern supplements from source claims.
6. Include explanation, worked example or demonstration, guided practice, formative check, and reading/preparation.
7. Verify all routes, source assets, page counts, responsive fit, keyboard controls, and production build.

## Historical archive inventory

| Deck | Source focus | Slide inventory | Revised-course disposition |
|---|---|---:|---|
| `L01_AI.pptx` | Applications, history, intelligence, definitions, agents, task environments, agent types, AI fields, weak/strong AI, AGI, Turing test | 32; schema-v2 inventory and 32 full-slide renders | Preserve across Meetings 1–2 |
| `L02_StateSpaceSearch.pptx` | State spaces, graphs, formulation, DFS, BFS, depth bounds, backtracking | 41 | Preserve across Meetings 3–4; add UCS and evaluation |
| `L03_Heuristic, HillClimbing&SA.pptx` | Heuristics, hill climbing, local search, simulated annealing | 31 | Preserve in Meeting 5 |
| `L04_BFS&AStar.pptx` | Best-first search, A*, admissibility, consistency, informedness | 22 | Preserve in Meeting 6 |
| `L05_MiniMax&Pruning.pptx` | Game trees, minimax, evaluation, alpha-beta pruning | 31 | Preserve across Meetings 7–8; add expectimax and MCTS |
| `L06_Bio&GA.pptx` | Biological motivation and genetic algorithms | 22 | Move to optional historical/evolutionary-computation supplement unless restored to the core plan |
| `L07_GP.ppt` | Genetic programming | 33 | Move to optional historical/evolutionary-computation supplement unless restored to the core plan |
| `L08_ArtificialLife.pptx` | Artificial life, swarm intelligence, PSO, ant-colony methods | 28 | Preserve selected still-relevant optimization ideas as optional supplements |
| `L09_MachineLearning Part A.pptx` | ML framing, concept learning, Winston, decision trees, ID3, entropy | 40 | Preserve the ML and decision-tree bridge across Meetings 13–15 |
| `L10_MachineLearning Part B.pptx` | Neural networks, backpropagation, clustering, reinforcement learning | 36 | Preserve relevant material across Meetings 12 and 17–18; assess clustering gap |
| `L11_stochasticmethods - Part A.pptx` | Probability rules, Bayes, conditional independence, Naive Bayes | 44 | Preserve probability bridge across Meetings 9–10 |
| `L12_StochasticMethods - Part B.pptx` | Markov models, HMMs, filtering, PageRank-related stochastic reasoning | 53 objects, 49 shown | Preserve selected foundations in Meetings 10–11 or an explicit optional supplement |

## Meeting implementation ledger

| Meeting | Revised topic | Historical source | Status and source-fidelity action |
|---:|---|---|---|
| 1 | AI applications, history, intelligence, definitions | L01 slides 1–10 | **Rebuilt.** 25 pages; every source slide is mapped to the lesson sequence. Exact 4:3 source pages and knowledge-bearing images remain uncropped and enlargeable through the per-page Course source view. The source application survey is identified as a 2020 snapshot, and source notes are retained with explicit factual qualification where needed. |
| 2 | Agents, task environments, agent types, AI directions, weak/strong AI, AGI, Turing test | L01 slides 11–32 | **Rebuilt.** 32 pages; every source slide, definition, review prompt, and knowledge-bearing agent/Turing-Test figure is mapped. The per-page Course source view preserves the complete 4:3 reference pages, while PEAS, the two-location vacuum-world laboratory, and the learning-agent architecture are clearly identified extensions. All 32 L01 slides and all 12 exact source images are preserved across Meetings 1–2. |
| 3 | State-space formulation and graph foundations | L02 slides 1–20 | **Rebuilt.** 27 pages; exact source diagrams, definitions, examples, practice, and assessment retained. |
| 4 | DFS, BFS, UCS, depth limits, backtracking, evaluation | L02 slides 21–41 | **Rebuilt.** 28 pages; all 41 source slides and all 26 exact source images are mapped across Meetings 3–4. |
| 5 | Heuristic functions, hill climbing, simulated annealing | L03, all 31 slides | **Rebuilt.** 25 pages; all 31 source slides and all 13 exact assets are mapped. Factorial proxies, sign conventions, acceptance probability, and convergence conditions are corrected explicitly. |
| 6 | Best-first search, A*, admissibility, consistency, heuristic quality | L04, all 22 slides | **Rebuilt.** 25 pages; all 22 source slides and all 15 exact assets are mapped, including four replayable source GIFs. Reopening, standard notation, consistency, and computation-cost qualifications are explicit. |
| 7 | Game trees, minimax, evaluation functions | L05 slides 1–16 | **Rebuilt.** 25 pages; the exact game-playing, game-theory, minimax, cutoff-evaluation, and tic-tac-toe source sequence is retained with all seven Meeting 7 source assets. |
| 8 | Alpha-beta pruning, expectimax, MCTS | L05 slides 17–31 plus modern supplements | **Rebuilt.** 25 pages; the exact alpha-beta pseudocode and worked pruning sequence is retained with all eight Meeting 8 source assets. Standard cutoff names and pruning equivalence are corrected explicitly; expectimax and MCTS are labeled modern supplements. |
| 9 | Probability models, conditioning, and Bayes rule | L11 slides 1–34 | **Rebuilt.** 25 pages; every source slide is mapped across variables and distributions, joints and marginals, normalization, conditioning, product and chain rules, Bayes rule, total probability, diagnosis, and hypothesis selection. Exact 1600×1200 source renders are retained at full aspect ratio with click-to-enlarge, and the source correction ledger is applied explicitly, including posterior-versus-likelihood and MAP-versus-maximum-likelihood distinctions. |
| 10 | Conditional independence, Bayesian networks, and Naive Bayes | L11 slides 35–44 plus selected L12 slides 3–11 | **Rebuilt.** 25 pages; the remaining L11 source sequence and the complete selected L12 independence block are mapped with exact click-to-enlarge renders. Independence, conditional independence, Naive Bayes, pronunciation/speech examples, evaluation claims, and references are preserved with documented corrections. Bayesian-network semantics, DAG/CPT factorization, graphical independence, and exact inference are explicitly labeled textbook-grounded supplements rather than attributed to the historical decks. |
| 11 | MDPs, policies, value iteration | Selected L12 Markov foundations plus modern MDP material | Pending rebuild. Treat this as a deliberate replacement/extension, not as if L12 already taught the complete MDP unit. |
| 12 | Reinforcement learning and Q-learning | L10 reinforcement-learning seed plus modern supplement | Pending rebuild. |
| 13 | ML workflow, data, baselines, splits | L09 ML framing plus modern workflow | Pending rebuild. |
| 14 | Classification, regression, overfitting, metrics | L09 supervised learning, decision trees, ID3, entropy plus modern metrics | Pending rebuild. Current provenance must be expanded so decision-tree knowledge is actually taught, not merely cited. |
| 15 | Pipelines, cross-validation, error analysis | L09–L10 plus modern laboratory | Pending rebuild. Preserve a decision-tree/entropy bridge and add a reproducible pipeline lab. |
| 16 | Midterm examination | Historical quizzes/exams plus Meetings 1–15 | Pending assessment alignment and Canvas-ready exam blueprint. |
| 17 | Perceptrons, activations, loss, gradient descent | L10 neural-network material | Pending rebuild. |
| 18 | Backpropagation and PyTorch laboratory | L10 backpropagation plus modern PyTorch lab | Pending rebuild. |
| 19 | Tokens, embeddings, attention, transformers | Modern unit linked back to course representation/search foundations | Pending rebuild; current primary sources required. |
| 20 | LLM training, structured output, hallucination, verification | Modern unit | Pending rebuild; current primary sources and hands-on verification exercise required. |
| 21 | RAG foundations | Revised custom unit | Existing custom deck; pending the same page-by-page source, image, pedagogy, and visual-fit audit. |
| 22 | RAG quality, hybrid retrieval, reranking, grounding, evaluation | Revised custom unit | Existing custom deck; pending the same audit. |
| 23 | Tool calls, agent loops, MCP concepts | Modern unit | Pending rebuild; official protocol/tool documentation required. |
| 24 | Harness state, permissions, approval, logging, evaluation | Modern unit | Pending rebuild; include a safe observable harness demonstration and evaluation trace. |
| 25 | AAB research-evidence practicum | AAB Research Evidence Brief assignment | Pending rebuild and assignment integration. Students locate and summarize a research paper or review an evidence card. |
| 26 | Explain AI to nontechnical audiences age five and older | AAB Explain AI assignment | Pending rebuild and assignment integration. Emphasize AI literacy, audience analysis, explanation, and evidence. |
| 27 | Capstone baselines, evaluation sets, testing, system cards | Historical assignments/project expectations plus revised capstone | Pending rebuild and rubric alignment. |
| 28 | Peer testing, red-teaming, revision | Revised capstone | Pending rebuild and studio protocol. |
| 29 | Demonstrations and individual technical defense | Historical project/demo expectations plus revised capstone | Pending rebuild and assessment protocol. |
| 30 | Course synthesis and final review | Complete archive plus revised course | Pending rebuild and cumulative concept map. |

## Deliberate curriculum decisions

- Genetic algorithms, genetic programming, and artificial-life material are not deleted from the archive. They are provisionally moved out of the core sequence because the revised plan prioritizes probabilistic reasoning, modern ML, transformers, RAG, and tool-using systems. Selected optimization ideas may return as optional comparison material.
- Constraint satisfaction and planning remain outside the core plan by instructor decision.
- AAB involvement is concentrated in one instructional week and two required assignments, not spread across five weeks.
- “AI literacy” includes explaining AI accurately and accessibly to nontechnical audiences age five and older; it is not framed only as K–12 pedagogy.
- Contemporary material must use current primary documentation or research and must be reverified when each meeting is built.

## Verified source packages in the site

- `public/course-source/l01-ai/manifest.json`: schema-v2 package for the exact `L01_AI.pptx` hash, with an explicit slide-to-meeting map (slides 1–10 in Meeting 1; 11–32 in Meeting 2), 12 exact source-image roles and hashes, 12 slides with speaker notes, and native timing recorded on slides 5 and 14.
- `public/course-source/l01-ai/source-inventory.json`: read-only object-level evidence for all 32 slides, 99 text blocks, 12 embedded media files, 14 slide-to-media relationships, speaker notes, timing metadata, and per-render hashes. Its SHA-256 is pinned in the v2 manifest.
- `public/course-source/l01-ai/source-slides/`: 32 complete 1600×1200 PNG renders at the source 4:3 aspect ratio, one per authoritative slide; renders supplement rather than replace searchable text, notes, and media provenance.
- `public/course-source/l02-state-space/manifest.json`: 41 source slides, 26 exact source images.
- `public/course-source/l03-heuristic-local-search/manifest.json`: 31 source slides, 13 exact source assets.
- `public/course-source/l04-best-first-astar/manifest.json`: 22 source slides, 15 exact source assets.
- `public/course-source/l05-minimax-pruning/manifest.json`: 31 source slides, 15 exact source assets; completely mapped across the rebuilt Meetings 7–8.
- `public/course-source/l11-probability-bayes/manifest.json`: schema-v2 package for all 44 slides of `L11_stochasticmethods - Part A.pptx`, mapped as slides 1–34 in Meeting 9 and 35–44 in Meeting 10. It records 44 complete 1600×1200 renders, 105 embedded-media files, three OLE embeddings, 16 slides with speaker notes, 17 slides with native timing, seven slides with build elements, and 11 explicit source-correction entries.
- `public/course-source/l12-conditional-independence/manifest.json`: schema-v2 selected-source package for slides 3–11 of `L12_StochasticMethods - Part B.pptx`, used in Meeting 10. It records nine complete 1600×1200 renders, 30 byte-preserved media files, native timing on four selected slides, and four explicit source-correction entries.
- `tests/rendered-html.test.mjs`: route, instructional-cycle, source-coverage, asset-existence, and custom-deck checks, including the L01 inventory hash, exact meeting split, all 32 render files/hashes/dimensions, all 12 media mappings, and note/timing counts.

The next production unit is Meetings 11–12, using selected L12 Markov foundations and the L10 reinforcement-learning seed while preserving the same source-fidelity acceptance contract.
