# Module 9–10 restructuring source map

This document freezes the student-facing sequence and the evidence used to build, export, narrate, and publish Lessons 11–14. Internal component names such as `Meeting09Deck` remain implementation details; the course-facing labels below are authoritative.

## Canonical sequence

| Module | Lesson | Title | Primary local evidence | Course-source role |
| --- | ---: | --- | --- | --- |
| 9 | 11 | Probability Foundations and Bayesian Inference | `public/course-source/l11-probability-bayes/manifest.json`, historical Part A slides 1–34 | Preserve probability notation, worked tables, conditional probability, Bayes rule, and source corrections. |
| 9 | 12 | Conditional Independence, Bayesian Networks, and Naive Bayes | Part A slides 35–44 plus `public/course-source/l12-conditional-independence/manifest.json`, selected Part B slides 3–11 | Preserve independence examples; extend to DAG/CPT semantics, exact inference, and qualified Naive Bayes claims. |
| 10 | 13 | Markov Decision Processes, Policies, and Value Iteration | `public/course-source/l12-mdp/manifest.json`, selected Part B slides 12–25; textbook/modern supplements where the historical deck stops | Distinguish prediction from control, formalize an MDP, calculate Bellman backups, iterate values, and extract a policy. |
| 10 | 14 | Reinforcement Learning, Q-Learning, and Exploration | `public/course-source/l10-reinforcement-learning/manifest.json`, historical pages 30, 32, 33, and 36; textbook/modern supplements | Connect experience to learning, trace return and a Q update, compare behavior and target policies, and evaluate exploration and safety limits. |

## Lesson design contracts

### Lesson 11 — Probability Foundations and Bayesian Inference

- Knowledge points: random variables and distributions; joint, marginal, and conditional probability; normalization; product and chain rules; Bayes rule; total probability; prior, likelihood, evidence, and posterior; MAP versus maximum likelihood.
- Visual evidence: native probability tables, event/query diagrams, traffic and diagnosis examples, and preserved source renders available through the source viewer.
- Practice: normalize a selected row, marginalize a joint table, infer a traffic cause, calculate a rare-disease posterior, and compare MAP with maximum likelihood.
- Checks: event notation check, normalization check, Bayes calculation, and cumulative exit ticket.
- Timing target: 75 planned minutes across 25 pages.

### Lesson 12 — Conditional Independence, Bayesian Networks, and Naive Bayes

- Knowledge points: marginal versus conditional independence; factorization; DAG and CPT semantics; d-separation intuition; enumeration; Naive Bayes classification; assumptions and calibrated claim language.
- Visual evidence: independence counterexamples, repeated trials, weather and dental structures, native Bayesian-network diagrams, classifier score tables, and source-backed speech examples.
- Practice: prove or refute independence, read a network factorization, compute a small network query, classify fruit with Naive Bayes, and audit an evaluation claim.
- Checks: independence tests, graphical reasoning, classifier decision, model-claim audit, and cumulative exit ticket.
- Timing target: 75 planned minutes across 25 pages.

### Lesson 13 — Markov Decision Processes, Policies, and Value Iteration

- Knowledge points: Markov state; transition model; reward and return; discounting; policy and value; Bellman expectation and optimality equations; value iteration; convergence and policy extraction.
- Visual evidence: historical Markov-chain diagrams and matrices, a native state/action/reward model, numeric Bellman backups, an iterative value table, and an interactive gridworld.
- Practice: diagnose whether state is Markov, factor a trajectory, calculate returns, perform Bellman backups, run value-iteration steps, and extract a greedy policy.
- Checks: model/evidence audit, numeric backup, stopping-rule interpretation, and cumulative exit ticket.
- Timing target: 75 planned minutes; use the existing 25-page MDP deck as the authoritative page set.

### Lesson 14 — Reinforcement Learning, Q-Learning, and Exploration

- Knowledge points: agent–environment loop; trajectory, episode, return, and discount; policy and action value; exploration versus exploitation; epsilon-greedy behavior; temporal-difference error; Q-learning; Q-learning versus SARSA; tabular limits, safety, and evaluation.
- Visual evidence: preserved historical RL figures, a native experience loop, discounted-return trace, exploration controls, numeric Q update, and an interactive tabular gridworld.
- Practice: calculate a return, classify experience transitions, choose an epsilon-greedy action, update a Q entry, compare on-policy and off-policy targets, and diagnose evaluation leakage or unsafe exploration.
- Checks: return calculation, update trace, algorithm comparison, limitations audit, and cumulative exit ticket.
- Timing target: 75 planned minutes; preserve all authored instructional pages unless timing validation requires consolidation.

## Canvas migration map

| Existing object | New role | Migration rule |
| --- | --- | --- |
| Module `9926402` (current Module 10) | Module 9: Reasoning Under Uncertainty | Rename and reposition; retain the probability pages, quiz, discussion, and Question Café where possible; renumber pages and replace files/media with validated Lesson 11–12 artifacts. |
| Module `9926401` (current Module 9) | Module 10: Sequential Decision-Making and Reinforcement Learning | Rename and reposition; remove old AAB lecture items from the published sequence without deleting recoverable source objects; add Lesson 13–14 pages, PDFs, videos, quiz, discussion, and Question Café. |
| Assignment `39938173` (zero-point Optional Project 4 slot) | Optional Project 4: AI Evidence and Public Communication Contribution | Repurpose rather than add a second post-midterm project. Grading is independent of AAB acceptance; any external submission requires separate student permission after grading. |
| Existing AAB lesson pages and PDFs | Recoverable unpublished archive | Do not present as lectures or delete. Preserve them for rollback/source recovery. |

## Legacy meeting-route boundary

The public 30-meeting planner no longer routes Meetings 25–26 to the former AAB-specific decks. Those routes now use general planned lessons on responsible-AI evaluation, accessible explanation, participatory testing, and public communication. The former `Meeting25Deck.tsx` and `Meeting26Deck.tsx` files remain unrouted archival source material; AAB appears to students only through the Module 13 external reading and optional Project 4 pathway.

## Release gates

1. Each lesson route displays its canonical module, lesson number, and title.
2. HTML interaction, print-all rendering, narration script, captions, PDF, and video all derive from the same final page order.
3. PDFs contain every lesson page and pass visual and text-extraction checks.
4. Videos use the approved neural voice, burned captions, phrase-timed visual focus, full decode, final-frame interaction checks, and artifact hashes.
5. Canvas API readback confirms module order, titles, publication, iframe routes, file IDs, quiz/question feedback, assignment boundaries, and syllabus schedule.
6. The exact validated commit is deployed to Sites before Canvas iframe verification.

## Canvas media-capacity contract

Canvas course `3586560` was within 26.7 MB of its file quota before this migration. The release therefore keeps the full 1920×1080 masters in the local production archive and creates caption-preserving 1280×720 H.264 derivatives for Canvas. Before replacement, the four superseded PDFs and two superseded probability videos are downloaded with byte counts and SHA-256 hashes to `output/canvas-backups/superseded-module9-10-media-2026-08-09/`.

The Lesson 11–12 Canvas derivatives replace the two superseded probability-video file objects in place and receive canonical Lesson 11–12 names; this reuses quota and preserves module links. Lessons 13–14 use the reclaimed capacity. The migration performs an API quota calculation before changing course state, checks the exact replacement file identities, and fails closed if the projected net bytes exceed available capacity.
