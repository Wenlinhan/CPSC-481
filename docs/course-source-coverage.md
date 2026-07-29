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
| `L01_AI.pptx` | Applications, history, intelligence, definitions, agents, task environments, agent types, AI fields, weak/strong AI, AGI, Turing test | 32 | Preserve across Meetings 1–2 |
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
| 1 | AI applications, history, intelligence, definitions | L01 slides 1–10 and 18–21, with cross-references to the complete deck | **Rebuilt.** 25 pages; complete L01 coverage is enforced jointly with Meeting 2. |
| 2 | Agents, task environments, agent types, AI directions, weak/strong AI, AGI, Turing test | L01 slides 11–32 | **Rebuilt.** 28 pages; all 32 source slides and all 12 exact source images are mapped across Meetings 1–2. |
| 3 | State-space formulation and graph foundations | L02 slides 1–20 | **Rebuilt.** 27 pages; exact source diagrams, definitions, examples, practice, and assessment retained. |
| 4 | DFS, BFS, UCS, depth limits, backtracking, evaluation | L02 slides 21–41 | **Rebuilt.** 28 pages; all 41 source slides and all 26 exact source images are mapped across Meetings 3–4. |
| 5 | Heuristics, greedy and local search | L03, all 31 slides | **Next rebuild.** Inventory complete; use about 25 pages by combining redundant source slides without dropping knowledge. Correct factorial proxy claims and the simulated-annealing probability example. |
| 6 | A*, admissibility, consistency, heuristic experiments | L04, all 22 slides | **Next rebuild.** Inventory complete; use about 25 pages with exact GIFs and diagrams, practice, and a heuristic-quality experiment. Clarify reopening, notation, and consistency. |
| 7 | Game trees, minimax, evaluation functions | L05 slides 1–16 | Pending exact-object inventory and rebuild. |
| 8 | Alpha-beta pruning, expectimax, MCTS | L05 slides 17–31 plus modern supplements | Pending exact-object inventory and rebuild. Preserve minimax/pruning source assets; label expectimax and MCTS as supplements. |
| 9 | Probability, Bayes rule, conditional independence | L11 foundations, with prerequisite material from L12 if needed | Pending rebuild. Restore normalization, product rule, chain rule, and Naive Bayes bridge that the current outline understates. |
| 10 | Bayesian networks and inference | L11–L12 foundations plus revised-plan material | Pending rebuild. Correct the current broad provenance claim and explicitly distinguish preserved stochastic foundations from the Bayesian-network supplement. |
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

- `public/course-source/l01-ai/manifest.json`: 32 source slides, 12 exact source images.
- `public/course-source/l02-state-space/manifest.json`: 41 source slides, 26 exact source images.
- `tests/rendered-html.test.mjs`: route, instructional-cycle, source-coverage, asset-existence, and custom-deck checks.

The next production unit is Meetings 5–6, using the completed L03/L04 inventories and this ledger as the acceptance contract.
