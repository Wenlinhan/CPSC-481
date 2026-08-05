# Module 12 source map: Lessons 17–18

Authoritative source: `L10_MachineLearning Part B.pptx`, 36 slides, SHA-256 `AFB85A8365CF49BAC114D362E78552503A1D771F84B6FA85A0D0827775FADC7D`.

## Complete source inventory and destination

| Source page | Knowledge or evidence to preserve | Destination |
|---:|---|---|
| 1 | Machine Learning Part B context | Lesson 17 page 1 |
| 2 | Non-symbolic learning, ANN, unsupervised, genetic, reinforcement, deep, online, and learning issues | Lesson 17 page 2 and Lesson 18 page 23 |
| 3 | Adaptive/optimization-based non-symbolic learning; evolutionary fitness and ANN weight optimization; symbolic cutoff concern | Lesson 17 pages 4–5 |
| 4 | Genetic programming as supervised nonlinear regression; terminal/function sets, fitness, population, crossover, mutation, selection, stopping parameters; ten-row dataset | Lesson 17 pages 6–7 |
| 5 | Scikit-compatible `gplearn` symbolic-regressor example and practice workflow | Lesson 17 page 8 |
| 6 | Artificial-neuron definition: inputs X, weights W, activation f, net = Σwᵢxᵢ, threshold/bias; decision examples | Lesson 17 pages 9–10 |
| 7 | McCulloch–Pitts AND/OR models, fixed activation, weights and bias | Lesson 17 pages 11–12 |
| 8 | From fixed logic unit to a learned predictive model; labeled binary dataset | Lesson 17 pages 13–14 |
| 9 | Perceptron activation, learning rate, target/output, Δwᵢ = η(t−a)xᵢ, update and convergence procedure | Lesson 17 pages 15–16 |
| 10 | Exact ten-row training data, initial W = [0.75, 0.5, −0.6], η = 0.2, first three updates | Lesson 17 pages 17–18 |
| 11 | Converged W = [−1.3, −1.1, 10.9], separating equation, classifier interpretation | Lesson 17 pages 19–20 |
| 12 | XOR truth table, unsatisfiable inequalities, single-perceptron limitation | Lesson 17 pages 21–22 |
| 13 | Hard threshold versus differentiable sigmoid; f(net)=1/(1+e^(−λnet)); range and slope | Lesson 17 pages 23–24 |
| 14 | Multilayer network goal, forward activation, backward error, local-minimum and initialization limitations | Lesson 18 pages 3–4 |
| 15 | Delta rule Δwⱼ = η(tⱼ−aⱼ)f′(netⱼ)xᵢ and error-surface/gradient interpretation | Lesson 18 pages 5–6 |
| 16 | I/J/K layer notation and output-layer propagation/update relationships | Lesson 18 pages 7–8 |
| 17 | Hidden-layer error propagation and weight relationships | Lesson 18 pages 9–10 |
| 18 | Complete backpropagation algorithm: outputs, errors, backpropagation, weights, bias | Lesson 18 pages 11–12 |
| 19 | Topology, learning algorithm, encoding, deep networks, supervised classification and unsupervised clustering | Lesson 18 page 24 |
| 20 | Unsupervised learning, AM discovery program, discovery and clustering | Lesson 18 page 13 |
| 21 | Partitional, hierarchical, and conceptual clustering | Lesson 18 page 14 |
| 22 | Original points for partitional clustering | Lesson 18 page 15 |
| 23 | Clustering objective and NP-hard search challenge | Lesson 18 page 16 |
| 24 | Similarity, dissimilarity, proximity, and Minkowski distance | Lesson 18 page 16 |
| 25 | K-means initialization, assignment, centroid update, convergence, K parameter and variants | Lesson 18 pages 15–17 |
| 26 | Classification versus clustering distinction | Lesson 18 page 18 |
| 27 | Fruit-basket comparison setup | Lesson 18 page 19 |
| 28 | Labeled fruit classification versus feature-driven fruit clustering | Lesson 18 page 19 |
| 29 | Unsupervised applications, outputs, supervised outputs, combination and semi-supervision | Lesson 18 page 20 |
| 30 | Reinforcement learning: trial and error, reward, policy, exploration, cumulative reward and applications | Lesson 18 page 21 |
| 31 | Domain knowledge, few-shot human learning, Meta-DENDRAL, rule explanations | Lesson 18 page 25 |
| 32 | Batch/offline versus incremental online learning for Big Data Analysis | Lesson 18 page 22 |
| 33 | Category axes: symbolic/non-symbolic, supervised/unsupervised, batch/online, analogical, deep, reinforcement, hybrid/universal | Lesson 17 page 3 and Lesson 18 pages 23–24 |
| 34 | ML applications: data mining, BI/BDA, finance, credit, weather, speech, games, engineering, robotics, medicine/biology | Lesson 18 page 26 |
| 35 | Big-data, integration, ensemble, deep/universal learning, representation, domain/common-sense challenges | Lesson 18 page 26 |
| 36 | Luger chapters 10/12 and Mitchell references | Lesson 18 page 27 |

## Lesson architecture

| Lesson | Knowledge point | Explanation | Visual/demo | Student task and check | Minutes |
|---|---|---|---|---|---:|
| 17 | Multiple category axes | A method can be symbolic/non-symbolic, supervised/unsupervised, and batch/online simultaneously | Interactive three-axis method classifier | Classify decision trees, GP, perceptrons, k-means, and RL; justify each axis | 12 |
| 17 | Genetic learning and tools | GP evolves expression trees using fitness and genetic operators | Progressive population/selection/crossover/mutation lab and scikit-compatible pipeline | Trace one generation and identify which parts are learned versus configured | 12 |
| 17 | Artificial neuron and McCulloch–Pitts | Weighted evidence, bias, activation, logic gates | Source neuron figure plus interactive weighted-sum and AND/OR truth-table labs | Predict outputs and alter only the bias | 15 |
| 17 | Perceptron learning | Mistake-driven supervised updates learn a linear boundary | Exact dataset, step-by-step numeric update, boundary explorer | Calculate ΔW and explain movement of the line | 24 |
| 17 | Capacity and activation | XOR exposes linear-separability limits; sigmoid supplies smooth derivatives | XOR boundary challenge and activation explorer | Diagnose why no line works and contrast step/sigmoid | 12 |
| 18 | Multilayer ANN and backpropagation | Forward values, error signals, local derivatives, ordered updates | Layered network, delta-rule surface, progressive backprop trace | Calculate one output and hidden signal; order the procedure | 22 |
| 18 | Unsupervised learning and clustering | Clusters are discovered from similarity rather than predefined labels | Interactive K-means iterations and fruit classification/clustering comparison | Assign points, recompute centroids, distinguish class labels from clusters | 20 |
| 18 | Reinforcement, batch, and online learning | Reward signals and streaming updates define different feedback/timing regimes | RL action–reward loop and batch/stream simulator | Choose the correct regime for elevator control and changing transaction streams | 12 |
| 18 | Deep/hybrid learning, domain knowledge, applications, challenges | Architecture depth is separate from supervision; real systems combine methods and knowledge | Category synthesis matrix and application mapper | Select a learning design and state its signal, timing, representation, and risk | 16 |
| 18 | Synthesis | Connect the full source taxonomy to an explainable design decision | Exit-ticket decision canvas | Defend one method for a new use case | 5 |

## Visual plan

- Use native HTML for definitions, equations, datasets, truth tables, algorithms, and comparison matrices.
- Lesson 17 page 8 supplements source page 5 with the official gplearn Symbolic Regressor example: link directly to the documentation, animate the published generation/error trace, and let students compare native surface previews for ground truth, evolved GP, decision tree, and random forest. Preserve the published target equation and learned symbolic expression; do not screenshot the documentation page.
- Lesson 18 pages 2, 7, 11, 14, 15, 18, 20, 22, and 24-26 use native instructional diagrams: an outcome path, explicit layer notation, forward/backward dataflow, clustering-family structures, a visibly changing K-means trace, labeled-versus-unlabeled geometry, a cluster-to-classify pipeline, a batch/online stream comparison, expanded neural-network architecture cards, a domain-knowledge hybrid flow, and application-specific evidence/risk scenes. Page 22 replaces the source-page image with a reconstructed interactive comparison; no complete slide image is delivered.
- Use source-cropped media only for the artificial-neuron schematic, error surface, and fruit basket; never use a complete source slide.
- Use interactive native diagrams for method categorization, GP evolution, McCulloch–Pitts gates, perceptron updates, XOR, activations, backpropagation, k-means, reinforcement learning, and streaming updates.
- All controls must work with keyboard and touch; answers include revealable explanations and misconception feedback.
- Presentation text targets at least 16px in core instructional regions at the 1536×723 Canvas viewport, with responsive validation at 1024×723.
