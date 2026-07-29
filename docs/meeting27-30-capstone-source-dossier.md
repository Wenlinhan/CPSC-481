# Meetings 27–30: capstone source dossier and revised sequence

This dossier connects the revised capstone to the instructor’s Spring 2020 project expectations without carrying forward obsolete submission mechanics.

## Historical expectations to preserve

Source: `Assignments/assignment 4-CPSC 481.docx`

- Teams presented a completed paper with slides or demonstrated a completed project.
- The presentation/demo had a ten-minute limit.
- Team participation and peer evaluation were part of the presentation process.
- Novelty was evaluated by peers and the instructor.

Source: `Assignments/assignment 5-CPSC 481.docx`

- Project submissions included source code, external libraries, a detailed run guide, file/function descriptions, and a report.
- Students distinguished their own contribution from reused or rewritten work and cited third-party sources.
- Teams reported individual contributions.
- A baseline was required.
- Paper submissions synthesized a substantial body of literature, compared approaches, cited sources, and used the student’s own wording.
- Final work was submitted as one organized package or repository link.

Source: Spring 2020 syllabus

- The major project was staged across multiple assignments and represented 30% of the course grade.
- The course emphasized practical problem solving, representation choice, AI methods, machine learning, and application.
- Participation included preparation, discussion, programming practice, and documented third-party work.

## Revised capstone contract

The revised course uses one testable AI-system project rather than a project-or-long-survey-paper fork. A research-heavy project is allowed only when it produces an evaluable artifact, dataset, benchmark, evidence synthesis tool, or reproducible analysis.

Every team must provide:

1. bounded problem, user, context, and intended-use statement;
2. primary system claim and a result that would disconfirm it;
3. at least one meaningful baseline;
4. versioned evaluation set with construction rationale and leakage controls;
5. task-appropriate quantitative and qualitative evidence;
6. failure taxonomy, error slices, and known limitations;
7. reproducible code/configuration, dependency manifest, run guide, and artifact links;
8. third-party code/model/data inventory with licenses and contribution boundaries;
9. system card with purpose, components, data, evaluation, intended uses, excluded uses, risks, oversight, and change history;
10. individual contribution record and individual technical defense.

## Meeting 27: Baselines, evaluation sets, testing, and system cards

Knowledge points:

- convert a vague goal into a falsifiable claim;
- select a baseline that answers whether added complexity helps;
- design representative, versioned, non-leaking evaluation cases;
- distinguish unit, integration, task, misuse, and regression tests;
- make uncertainty and failure categories visible;
- create a source-linked system card.

In-class artifact: claim–baseline–evaluation plan plus system-card skeleton.

## Meeting 28: Peer testing, red-teaming, and revision

Knowledge points:

- use a reproducible test protocol rather than informal “try it” feedback;
- record input, expected behavior, actual behavior, environment, severity, and trace;
- red-team boundary conditions, prompt injection, unsupported claims, unsafe actions, privacy, and recovery;
- separate defect, limitation, misuse, and out-of-scope behavior;
- prioritize fixes by severity, likelihood, reproducibility, and cost;
- rerun a regression set and document residual risk.

In-class artifact: peer test report with at least three adversarial cases and a revision decision log.

## Meeting 29: Demonstrations and individual technical defense

Preserve the historical ten-minute limit, but structure it:

- 1 minute: problem, user, and claim;
- 2 minutes: architecture and contribution boundaries;
- 3 minutes: live success case plus trace;
- 2 minutes: baseline/evaluation evidence and one honest failure;
- 1 minute: limitations, oversight, and recommendation;
- 1 minute: transition to questions.

The individual defense asks each student to:

- explain one component without team narration;
- trace one input end to end;
- justify one evaluation or design choice;
- diagnose one change scenario;
- identify their own contribution and one reused dependency.

Peer feedback informs revision and communication quality; it does not replace instructor evaluation of technical correctness.

## Meeting 30: Course synthesis and final review

The final meeting connects the capstone to the whole course:

- agent, environment, goals, and performance;
- representation and search;
- uncertainty and decision making;
- learning objective, data, model, and optimization;
- LLM/RAG/tool/harness layers;
- evaluation, evidence, human oversight, and public explanation.

Students submit a final concept map, identify one claim now weakened by evidence, and explain one deployment boundary. The cumulative review uses public practice prompts and does not reveal secure final-assessment items.

## Suggested capstone rubric, 100 points

- Problem framing and falsifiable claim: 10
- Baseline and evaluation-set design: 15
- Technical implementation and reproducibility: 20
- Evidence, error analysis, and uncertainty: 15
- Safety, misuse testing, limitations, and oversight: 10
- System card and source/contribution trace: 10
- Demonstration: 10
- Individual technical defense: 10

## Submission package

- repository or organized archive;
- pinned dependencies and environment instructions;
- data/model/source licenses or use conditions;
- one-command or clearly staged run procedure;
- evaluation set and results;
- system card;
- test/red-team report;
- individual contribution statement;
- demonstration link only when Canvas requires an asynchronous fallback.
