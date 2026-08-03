# Lesson 9 revision plan

## Source inventory and destination map

| Knowledge point | Source evidence | Explanation | Visual/demo | Student task | Check | Minutes |
|---|---|---|---|---|---|---:|
| Biology as a computational metaphor | L06 slides 1-11 | Connect molecule, cell, DNA, gene, protein, heredity, variation, and selection without treating the analogy as identity | Generated DNA/cell illustration; native hierarchy, central-dogma, base-pair, and analogy diagrams | Predict which biological ideas become algorithm design choices | Distinguish biological mechanism from computational abstraction | 14 |
| Evolutionary-computation loop | L06 slides 10-12 | Define initialization, evaluation, selection, variation, replacement, and termination | Native loop diagram and annotated GA pseudocode | Trace one generation and identify the state that changes | Identify which step chooses reproductive material | 12 |
| GA specification | L06 slides 13-14 | Define population P(t), chromosome, fitness, operators, population policy, and stopping criteria | Generated evolutionary-search illustration; native specification pipeline | Complete the five-part GA contract for a toy problem | Diagnose an underspecified GA | 10 |
| Continuous optimization worked example | L06 slides 15-17 | Maximize f(x)=x sin(10 pi x)+1 on [-1,2]; derive 22-bit resolution, encode/decode, initialize 300 candidates, evaluate, select, cross, mutate, and run up to 1000 generations | Native function plot, number-line discretization, bit decoder, population table, operator demo, generation trace | Decode one chromosome and predict operator effects | Check bit count, fitness direction, and parameter meaning | 22 |
| TSP representation and operators | L06 slides 18-20 | Contrast 4-bit-per-city encoding with permutation encoding; explain validity and order crossover | Generated route-optimization illustration; native nine-city graph, representation comparison, and order-crossover trace | Find invalid offspring and repair an order-crossover child | Explain why generic bit crossover fails | 12 |
| Evaluation and transfer | L06 slides 21-22 | Explain compactness, encoding burden, representation/operator fit, and appropriate modern use | Native tradeoff scale and synthesis map | Audit a proposed GA and write an exit explanation | Defend when GA is or is not appropriate | 5 |

## Page-level visual plan

Every page uses a meaning-bearing visual rather than an empty card grid. Generated raster illustrations carry section mood only; exact algorithms, equations, data, and labels remain native HTML/SVG.

1. Hero: generated evolutionary-search illustration plus driving question.
2. Outcomes: route map showing the lecture journey.
3. Biology scale and molecules: atom-to-species hierarchy plus DNA/RNA/protein flow.
4. Central dogma: generated cell-to-DNA zoom plus 1D code to 3D protein over time.
5. Genetic code: paired strands, direction, codon, and gene.
6. Natural selection: population before/after with inheritance, crossover, mutation.
7. Analogy: paired life/computer pipelines with explicit limits.
8. Biological commitments: five concepts linked to algorithm decisions.
9. EC loop: circular state-transition diagram.
10. GA pseudocode: line-numbered algorithm with loop anatomy.
11. GA contract: five connected specification questions.
12. Optimization problem: accurate function plot and target maximum.
13. Precision to bits: interval discretization and 2^21/3,000,001/2^22 comparison.
14. Encode/decode: 22-bit chromosome through integer and affine map.
15. Initial population: sample candidates in a population table.
16. Fitness and selection: candidate-to-x-to-f(x) pipeline plus parent pool.
17. Variation: interactive crossover and mutation comparison.
18. One generation: full trace, parameters, stochastic progress, and stopping.
19. TSP problem: generated nine-city route illustration and exact objective.
20. TSP encoding #1: 4-bit city chunks and invalid offspring warning.
21. TSP encoding #2: permutation route on the same city graph.
22. Order crossover: progressive, validity-preserving construction.
23. Guided practice: complete a child and justify validity.
24. Evaluation: compact search vs representation burden.
25. Design studio: GA specification canvas with peer audit.
26. Synthesis and exit: representation-operator-fitness triangle and source reading.

## QA risks

- Dense pseudocode and order-crossover traces must remain readable at 1536 x 723.
- The 22-bit chromosome must not wrap or clip.
- Function notation and the inclusive endpoint mapping must remain exact.
- All nine cities must appear exactly once in every valid permutation.
- Generated images must not contain text or be used as evidence for an exact equation or algorithm.
- Narrow layout must preserve logical reading order and avoid horizontal overflow.
