# Lesson 16 video lecture script

- Route: /lessons/16
- Voice: Microsoft Aria Neural (en-US-AriaNeural)
- Speaking rate: 0.94x (-6%)
- Slides: 25
- Narration words: 5,632
- Timing policy: concise overview pages; extended equations, algorithms, mechanisms, worked examples, and interactive demonstrations
- Captions: burned in at the bottom of the final video

## Slide 01 - Decision trees: from examples to explainable rules

### 1. Frame

Lesson sixteen turns fourteen historical loan applications into an explainable classifier. Each row supplies applicant attributes and a risk label; ID3 converts those labeled examples into a tree whose internal questions lead to high, moderate, or low risk leaves.

### 2. Define

Our anchor question is deceptively simple: which attribute should the tree ask about first? Guessing from appearance is not enough. We need a numerical rule that compares candidate questions by how much uncertainty each one removes.

### 3. Mechanism

We will move from data anatomy to tree traversal, recursive induction, entropy, information gain, rule extraction, and responsible evaluation. Think of the tree as a very disciplined twenty-questions player: every question must earn its place.

## Slide 02 - Represent, induce, calculate, interpret, and evaluate

### 1. Frame

The roadmap begins with representation: identify predictor columns, the target label, internal tests, branches, and leaves. A calculation without a clear representation is merely arithmetic wearing a lab coat.

### 2. Define

Induction is the mechanism. ID3 repeatedly chooses a test, partitions the current examples, closes pure partitions as leaves, and recursively treats each impure partition as a smaller learning problem.

### 3. Mechanism

Calculation supplies entropy, expected entropy, and information gain. Interpretation turns a root-to-leaf path into a rule and explains why a particular attribute was selected rather than merely reporting a decimal.

### 4. Interpret

Evaluation asks whether the learned pattern generalizes beyond these fourteen rows. We will examine unseen cases, error types, calibration, subgroup behavior, and the danger of treating training fit as deployment evidence.

### 5. Choose Represent

**Instructor action before narration:** Choose Represent.

Choose Represent. The objective card now explains this stage of the pipeline and ties it back to the shared loan records. Notice how the focus moves with the narration instead of camping permanently on the first card.

### 6. Choose Induce

**Instructor action before narration:** Choose Induce.

Choose Induce. The objective card now explains this stage of the pipeline and ties it back to the shared loan records. Notice how the focus moves with the narration instead of camping permanently on the first card.

### 7. Choose Calculate

**Instructor action before narration:** Choose Calculate.

Choose Calculate. The objective card now explains this stage of the pipeline and ties it back to the shared loan records. Notice how the focus moves with the narration instead of camping permanently on the first card.

### 8. Choose Evaluate

**Instructor action before narration:** Choose Evaluate.

Choose Evaluate. The objective card now explains this stage of the pipeline and ties it back to the shared loan records. Notice how the focus moves with the narration instead of camping permanently on the first card.

### 9. Inspect the risk column

**Instructor action before narration:** Inspect the risk column.

Select the Risk column. This is the class label we are trying to predict, so compare it against the predictor values without accidentally treating it as an input.

### 10. Inspect the income column

**Instructor action before narration:** Inspect the income column.

Select the Income column. Scan its three bands against the risk labels; the visible pattern motivates income as a candidate root, while information gain will quantify the claim.

### 11. Inspect one row

**Instructor action before narration:** Inspect one row.

Select application two. Read it as one complete labeled example: high risk, unknown credit, high debt, no collateral, and middle income.

### 12. Enlarge the dataset

**Instructor action before narration:** Enlarge the dataset.

Enlarge the dataset so the complete evidence remains readable. The modal preserves all rows and selectors; enlarging changes presentation, not the data or the algorithm.

### 13. Close the enlarged dataset

**Instructor action before narration:** Close the enlarged dataset.

Close the enlarged dataset and return to the roadmap. A production video should demonstrate the control rather than merely mentioning that it exists.

## Slide 03 - The target is risk; the evidence is past loan applications

### 1. Frame

The target variable is financial risk with three possible labels: high, moderate, and low. That is what the learner must predict. Credit history, debt, collateral, and income are predictors: evidence available before the decision.

### 2. Define

Do not mix target and predictor roles. If the answer column leaks into the inputs, the model can appear brilliant by peeking at the answer key. It is the machine-learning version of grading your own exam while holding the rubric.

### 3. Mechanism

A row is historical evidence, not a law of nature. The recorded label may reflect expert judgment, policy, measurement error, or past institutional behavior. ID3 learns patterns in those labels; it does not certify that the labels are fair or correct.

### 4. Interpret

Before modeling, ask who produced the labels, under which policy, for which population, and with what consequences. A technically accurate replica of a biased historical process can be an extremely efficient way to repeat history.

### 5. Deepen

Here is the mechanism-level distinction to keep: supervised learning estimates a mapping from predictors to a target using labeled examples. The tree does not discover risk as a physical substance hidden in the row. It discovers conditional regularities between the provided columns and the historical label. Change the labeling policy, feature definitions, or sampled population, and the learned concept can change even when the algorithm stays identical.

## Slide 04 - A training table is a set of labeled input-output examples

### 1. Frame

Represent one application as an input vector x containing credit history, debt, collateral, and income. Pair it with a label y containing the observed risk class. The dataset D is the collection of fourteen ordered pairs, x sub i comma y sub i.

### 2. Define

Columns define the vocabulary available to the tree. Rows provide combinations of values and labels. ID3 can only ask questions expressible by these columns, so representation limits the hypotheses before the algorithm performs a single calculation.

### 3. Mechanism

The set contains six high-risk, three moderate-risk, and five low-risk labels. Those counts create the parent class distribution. Every entropy and information-gain calculation later on comes from counting labels inside the relevant subset.

### 4. Interpret

Visual inspection may suggest income is predictive, but eyesight is vulnerable to selective attention. We therefore inspect rows and columns, then replace intuition with a reproducible comparison of every candidate attribute.

### 5. Deepen

The notation also clarifies dataset quality. Duplicate x values with conflicting y labels create irreducible ambiguity for a deterministic tree unless another predictor separates them. Missing combinations create blind spots. A train-validation-test split changes the role of rows, not their format: training rows construct the tree, validation rows guide pruning or settings, and test rows estimate final generalization.

### 6. Inspect credit history

**Instructor action before narration:** Inspect credit history.

Select the Credit history column and compare its values with risk. Credit helps, but several label classes remain mixed within its categories.

### 7. Inspect income

**Instructor action before narration:** Inspect income.

Select the Income column. Low-income rows are consistently high risk here, while the higher bands create much cleaner partitions than the other attributes.

### 8. Inspect record fourteen

**Instructor action before narration:** Inspect record fourteen.

Select record fourteen. It combines high risk, bad credit, high debt, no collateral, and middle income. Later we can trace exactly which of those attributes the learned tree uses.

### 9. Clear the table

**Instructor action before narration:** Clear the table.

Clear the current table selection. Clearing is useful before a new comparison because it removes the previous visual emphasis without altering any record.

## Slide 05 - ID3 learns a tree that describes class patterns

### 1. Frame

J. Ross Quinlan introduced ID3 in nineteen eighty-six. The historical detail matters because it separates a general model family, decision trees, from one specific induction procedure used to construct such a model.

### 2. Define

A decision tree represents a conditional concept as tests and outcomes. Internal nodes ask about attributes, branches correspond to observed values, and leaves store predicted classes. The finished tree can be executed and translated into human-readable rules.

### 3. Mechanism

ID3 is the learning mechanism. It uses labeled examples to choose tests greedily, partitions the data, and repeats. Saying the tree learned is shorthand; more precisely, ID3 induced a tree from evidence under a particular selection heuristic.

## Slide 06 - Internal nodes test attributes; leaves decide classes

### 1. Frame

The root is the first internal node and every example begins there. Its location gives it strategic importance: a useful root should organize the dataset into substantially cleaner subsets.

### 2. Define

An internal node contains an attribute test such as forecast or income. It does not contain the final answer. Its job is to ask a question whose possible values determine which outgoing branch is followed.

### 3. Mechanism

A branch represents one answer value, such as sunny, overcast, or rain. A branch is neither a complete training record nor another probability formula; it is the labeled route created by the current test result.

### 4. Interpret

A leaf terminates traversal and stores a class decision. The compact memory trick is: node asks, branch answers, leaf decides. If you confuse them, the tree becomes botanical modern art instead of an algorithm.

### 5. Example

Apply the distinction to the picnic example. Forecast is a node test, sunny is a branch value, humidity may be the next internal test, and yes or no is the leaf decision.

### 6. Deepen

A complete path can be read as nested conditionals. If forecast is sunny, then test humidity; if humidity is high, return no. That operational reading matters because tree depth approximates the number of questions asked for a particular case. Different leaves may have different depths, so prediction cost and explanation length can vary from one applicant to another.

### 7. Try an incorrect branch definition

**Instructor action before narration:** Try an incorrect branch definition.

Choose option A, an attribute test. The feedback says reconsider because a node contains the test; the outgoing branch is labeled by the observed attribute value.

### 8. Choose the branch definition

**Instructor action before narration:** Choose the branch definition.

Choose option C, an attribute value. Correct: a branch is the route selected by one answer to the current node's test.

## Slide 07 - A risk tree turns attribute values into a class

### 1. Frame

To classify an application, begin at the root. In the learned loan tree the first question is income because income produced the largest information gain during training.

### 2. Define

Evaluate only the current node's attribute. If income is between zero and fifteen thousand dollars, the path immediately reaches high risk. Credit, debt, and collateral are not consulted for that case.

### 3. Mechanism

Otherwise follow the branch matching the observed value and evaluate the next node. Middle income may require credit history and, for unknown credit, debt. High income may require credit history but not debt.

### 4. Interpret

Stop at the first leaf and return its class. Classification is therefore a conditional path, not a vote over every predictor. Unvisited attributes have no influence on that particular prediction.

### 5. Example

Trace record two: income is fifteen to thirty-five thousand, credit is unknown, and debt is high, so the path terminates at high risk. Collateral appears in the table but nowhere in the learned tree.

### 6. Deepen

Consider an implementation detail. At a categorical node, the system must map the observed value to exactly one outgoing edge. An unseen value needs an explicit policy: use a default branch, the local majority class, probabilistic routing, or declare uncertainty. A classroom diagram often omits this engineering seam, but deployed software cannot solve it with a thoughtful shrug.

## Slide 08 - Change an applicant and watch the decision path change

### 1. Frame

This interactive trace exposes the mechanism directly. The initial applicant has middle income, unknown credit, and high debt. The tree asks all three relevant questions before returning high risk.

### 2. Define

Change income to the low band. The tree now stops immediately at high risk. Credit and debt remain visible input values, yet they are causally irrelevant to this traversal because the path never reaches those tests.

### 3. Mechanism

Change income to the high band and credit to good. The route becomes income greater than thirty-five thousand, then good credit, then low risk. Debt is skipped, demonstrating instance-specific explanations.

### 4. Interpret

Return to middle income, unknown credit, and switch debt from high to low. The leaf changes from high to moderate. A useful explanation reports the exact path taken and the plausible neighboring change that would alter the result.

### 5. Deepen

This counterfactual exploration must be interpreted carefully. Changing income in the interface shows how the model output changes while holding other represented values fixed. It does not prove that changing a person's real income would causally change financial risk. The tree is an associational predictor learned from records, not a randomized economic experiment.

### 6. Set low income

**Instructor action before narration:** Set low income.

Set income to the low band. The path should collapse immediately to high risk, showing that later attributes are skipped for this applicant.

### 7. Set high income

**Instructor action before narration:** Set high income.

Set income to over thirty-five thousand. The tree now needs credit history and ignores debt for this branch.

### 8. Set good credit

**Instructor action before narration:** Set good credit.

Set credit history to good. The displayed path ends at low risk, and the debt value is absent from the explanation.

### 9. Return to middle income

**Instructor action before narration:** Return to middle income.

Return income to fifteen through thirty-five thousand. Good credit now ends at moderate risk, showing that the meaning of a value depends on earlier tests.

### 10. Set unknown credit

**Instructor action before narration:** Set unknown credit.

Set credit history to unknown. The path opens a debt test because the current subset is still impure.

### 11. Set low debt

**Instructor action before narration:** Set low debt.

Set debt to low. The final leaf changes to moderate risk; switching debt back to high would return high risk.

## Slide 09 - ID3 recursively turns impure partitions into subtrees

### 1. Frame

Read ID3 as executable pseudocode. The procedure receives a set of labeled examples and a set of unused attributes, then returns either a class leaf or a decision subtree.

### 2. Define

Base case A handles purity. If every current example has the same class, return that class as a leaf. Continuing to split would add structure without reducing uncertainty.

### 3. Mechanism

Base case B handles exhausted attributes or an unusable partition. Return a default, commonly the local majority class. This is a policy choice needed when the representation cannot perfectly separate the labels.

### 4. Interpret

The recursive case selects the best attribute, creates one branch per value, partitions examples, and calls ID3 on each impure child with a reduced attribute set. The algorithm grows from the top downward.

### 5. Example

The greedy line is the local attribute selection. ID3 commits to the highest-gain test now and does not backtrack later if a different root would have produced a better global tree.

### 6. Deepen

Track the recursive arguments precisely. Each call receives a subset of examples and usually removes the selected attribute from future consideration along that branch. If a branch receives no examples, the algorithm needs a fallback from its parent context. If labels remain mixed after attributes are exhausted, a majority or probabilistic leaf records unresolved uncertainty rather than inventing a new predictor.

## Slide 10 - Select, partition, test purity, then recurse

### 1. Frame

Stage one compares candidate attributes using the current subset and chooses the test with maximum information gain. At the root, that comparison uses all fourteen records.

### 2. Define

Stage two creates one branch for each observed value and sends every example down exactly one branch. Partitioning conserves the records while changing which examples are considered together.

### 3. Mechanism

Stage three checks each child for purity. A child containing only high-risk labels becomes a high-risk leaf because its entropy is zero and no further question is required.

### 4. Interpret

Stage four recurses on every impure child using its local rows and remaining attributes. Different branches can choose different next tests because their class distributions differ.

### 5. Example

This is divide and conquer with a statistical compass: split the big problem, close the easy pieces, and repeat on the messy pieces until a stopping condition fires.

### 6. Deepen

The invariant across stages is that each training example reaches exactly one current frontier node. Partitioning reorganizes the same evidence; it does not duplicate favorable rows or discard inconvenient ones. At every frontier, ask two questions in order: is the subset already pure, and if not, which remaining test most reduces its entropy? That pair drives the entire recursive construction.

### 7. Show stage 1

**Instructor action before narration:** Show stage 1.

Choose Choose a test. The staged diagram now exposes this part of top-down induction while preserving the earlier structure, so students can see the algorithm grow instead of hearing a detached list.

### 8. Show stage 2

**Instructor action before narration:** Show stage 2.

Choose Partition examples. The staged diagram now exposes this part of top-down induction while preserving the earlier structure, so students can see the algorithm grow instead of hearing a detached list.

### 9. Show stage 3

**Instructor action before narration:** Show stage 3.

Choose Close pure branches. The staged diagram now exposes this part of top-down induction while preserving the earlier structure, so students can see the algorithm grow instead of hearing a detached list.

### 10. Show stage 4

**Instructor action before narration:** Show stage 4.

Choose Recurse. The staged diagram now exposes this part of top-down induction while preserving the earlier structure, so students can see the algorithm grow instead of hearing a detached list.

## Slide 11 - If several trees fit the data, which one should we prefer?

### 1. Frame

Many different trees can classify all training rows correctly. A large tree may memorize rare combinations, label noise, or accidental details rather than capturing a pattern that survives beyond the sample.

### 2. Define

A smaller tree has lower description cost and is easier to inspect. Simplicity acts as an inductive preference: among similarly supported hypotheses, prefer one that explains more with fewer tests.

### 3. Mechanism

But shortest is not automatically best, accurate, or fair. Validate on unseen data. Simplicity is a useful seat belt, not a magical force field against every modeling mistake.

## Slide 12 - A useful pattern compresses the data it explains

### 1. Frame

Minimum message length formalizes a compression intuition. Choose the hypothesis H sub i minimizing the length needed to describe the hypothesis plus the length needed to describe the data given that hypothesis.

### 2. Define

The first term is model cost. A deep tree with many tests, branches, and exceptional leaves requires more bits to specify than a compact tree. Complexity spends part of our explanatory budget.

### 3. Mechanism

The second term is residual cost. A tiny model that explains almost nothing leaves a long list of errors or exceptions. Saying everything is complicated is short, but it does not compress the observations.

### 4. Interpret

The winner balances both terms. Think of packing for a trip: a suitcase the size of a building is wasteful, but one sock and heroic optimism will create expensive residual problems.

### 5. Example

The source's even-number example contains fifty integers from two through one hundred inclusive, not forty-nine. The correction strengthens the lesson: the phrase all even integers from two to one hundred is far shorter than listing all fifty.

### 6. Deepen

MML also reveals why memorization can look deceptively compact on tiny data. A rule listing fourteen row identifiers may classify the training set perfectly, but its hypothesis description grows with the dataset and says little about new rows. A genuinely reusable pattern pays a modest fixed model cost, then describes many observations cheaply. Compression becomes evidence of structure only when the coding scheme and evaluation protocol are honestly specified.

## Slide 13 - Entropy measures uncertainty in a class distribution

### 1. Frame

Information content for a class c is negative log base two of its probability. A rare event has high information because observing it is surprising; a certain event has zero information because it tells us nothing new.

### 2. Define

Entropy H of S is the probability-weighted average information across classes: negative sum over p of c times log base two p of c. The unit is bits because the logarithm uses base two.

### 3. Mechanism

Use the convention zero log zero equals zero by continuity. A class absent from the subset contributes nothing, rather than causing the calculation to explode into mathematical confetti.

### 4. Interpret

A pure set has entropy zero because the next label is certain. For two classes, a fifty-fifty set has entropy one bit, the maximum binary uncertainty. With three balanced classes the maximum is log base two of three, about one point five eight five bits.

### 5. Example

Entropy describes the label distribution inside a set, not the visual complexity of a drawn tree. It is the messiness of the answer pile before we ask another question.

### 6. Deepen

Derive the binary maximum explicitly. Let p be the positive fraction, so H of p equals negative p log two p minus one minus p log two of one minus p. The function is symmetric around one half and its derivative is zero there. The second derivative is negative, confirming a maximum. You do not need calculus to run ID3, but the shape explains the slider rather than asking students to worship it.

## Slide 14 - Purity lowers entropy; a 50/50 split maximizes it

### 1. Frame

The slider controls a binary set of ten examples. With five positives and five negatives, each probability is one half, so entropy equals negative two times one half log base two one half, which is exactly one bit.

### 2. Define

Move to ten positives and zero negatives. The positive term becomes one times log two of one, which is zero, and the absent class contributes zero. The set is pure and entropy falls to zero.

### 3. Mechanism

Move to eight positives and two negatives. Entropy is about zero point seven two two bits. The labels are mixed, but less uncertain than the fifty-fifty case because one class is substantially more likely.

### 4. Interpret

The curve is symmetric: two positives and eight negatives has the same entropy as eight positives and two negatives. Entropy cares about the proportions, not which class name is attached to each proportion.

### 5. Example

Predict before moving the slider. If purity increases, entropy decreases. This relationship explains why ID3 prefers splits whose child branches contain concentrated class labels.

### 6. Deepen

Now connect the lab to splitting. A candidate test is valuable when its children move away from the balanced, high-entropy region toward purer ends of the scale. One child need not be pure, and unequal branch sizes matter. A tiny pure branch plus a huge messy branch may remove less expected uncertainty than two moderately cleaner branches. That is why we calculate a weighted average.

### 7. Set ten positives

**Instructor action before narration:** Set ten positives.

Set ten positives and zero negatives. The class is certain, so entropy is zero bits.

### 8. Set eight positives

**Instructor action before narration:** Set eight positives.

Set eight positives and two negatives. Entropy rises to about zero point seven two two bits because the subset is mixed.

### 9. Set a balanced split

**Instructor action before narration:** Set a balanced split.

Set five positives and five negatives. Entropy reaches one bit, the maximum for two classes.

### 10. Set zero positives

**Instructor action before narration:** Set zero positives.

Set zero positives and ten negatives. The labels are pure again, so entropy returns symmetrically to zero.

## Slide 15 - Choose the test that removes the most expected uncertainty

### 1. Frame

For a candidate attribute X, first compute the parent entropy H of T. This is uncertainty before asking the question, and it is identical for every candidate compared at the same node.

### 2. Define

Next partition T by X. Compute the entropy of each child T sub v. A pure child contributes zero; a mixed child contributes an amount determined by its local class proportions.

### 3. Mechanism

Weight each child entropy by its fraction of the parent, size of T sub v divided by size of T. Large branches matter more because a random training example is more likely to land there.

### 4. Interpret

Sum the weighted child entropies to obtain expected entropy E of X. This is the uncertainty we expect to remain after learning the value of X.

### 5. Example

Information gain is H of T minus E of X. The largest gain removes the most expected uncertainty, so ID3 chooses that attribute. It is like paying each question in bits saved.

### 6. Audit

Raw information gain can favor attributes with many unique values, including an identifier that memorizes every row. Gain ratio, pruning, and validation are later remedies; high gain alone is not a moral endorsement.

### 7. Deepen

Suppose a split creates branches of sizes nine and one. Averaging their entropies as fifty-fifty would pretend a random example is equally likely to enter either branch. The size weights correct that mistake. Expected entropy is an expectation over the branch reached by a random parent example. Information gain then measures the expected reduction in the number of bits needed to identify its class.

## Slide 16 - Income reduces uncertainty by 0.967 bits

### 1. Frame

Start with label counts: six high, three moderate, and five low among fourteen applications. Substitute those probabilities into the three-class entropy formula to obtain H of LoanData equals one point five three one bits.

### 2. Define

Now split on income. The zero-to-fifteen-thousand branch contains four examples of one class, so its entropy is zero. A pure branch contributes four fourteenths times zero, which remains zero.

### 3. Mechanism

The fifteen-to-thirty-five-thousand branch has mixed labels and entropy one bit. Weighted by four fourteenths, its contribution is four fourteenths.

### 4. Interpret

The over-thirty-five-thousand branch contains six cases and has entropy about zero point six five. Weighting gives six fourteenths times zero point six five. Add all three contributions to obtain expected entropy zero point five six four bits.

### 5. Example

Subtract: one point five three one minus zero point five six four equals zero point nine six seven bits of information gain. Income removes almost a full bit of uncertainty on average.

### 6. Audit

Compare the alternatives: credit history gains zero point two six six, collateral zero point two zero six, and debt only zero point zero six three. Because zero point nine six seven is largest, income becomes the root.

### 7. Deepen

Check the income arithmetic against the table instead of trusting the displayed answer. Group row identifiers by income, count high, moderate, and low labels inside each group, compute each local entropy, multiply by group size over fourteen, and sum. This reconstruction is important because a decimal without traceable counts cannot reveal a transcription error, a changed record, or a different convention.

## Slide 17 - Rank every candidate test before selecting the root

### 1. Frame

Every candidate starts from the same parent entropy, one point five three one bits. Therefore ranking information gain is equivalent to ranking expected entropy in reverse: smaller expected entropy means larger gain.

### 2. Define

Income is revealed first with expected entropy zero point five six four and gain zero point nine six seven. Its branches are much cleaner than the parent distribution.

### 3. Mechanism

Credit history follows with expected entropy one point two six five and gain zero point two six six. It helps, but most uncertainty remains after the split.

### 4. Interpret

Collateral produces gain zero point two zero six, and debt produces only zero point zero six three. A visible predictor can still be nearly useless for this dataset if its values do not separate the labels.

### 5. Example

The comparison must be recomputed inside each impure child. Income wins at the root, but a different attribute may win locally because the subset has new counts and a new parent entropy.

### 6. Deepen

A useful sanity check is that every gain must lie between zero and the parent entropy. Negative gain would signal an arithmetic or weighting error because conditioning on the observed attribute cannot increase expected entropy when computed consistently. A gain equal to the parent entropy would mean every child is pure. Income falls between those bounds and is impressively, but not perfectly, informative.

### 7. Reveal candidate 1

**Instructor action before narration:** Reveal candidate 1.

Reveal income. Its expected entropy is zero point five six four and its information gain is zero point nine six seven, the strongest candidate.

### 8. Reveal candidate 2

**Instructor action before narration:** Reveal candidate 2.

Reveal credit history. Its gain is zero point two six six, useful but far below income.

### 9. Reveal candidate 3

**Instructor action before narration:** Reveal candidate 3.

Reveal collateral. Its gain is zero point two zero six, showing only a modest reduction in uncertainty.

### 10. Reveal candidate 4

**Instructor action before narration:** Reveal candidate 4.

Reveal debt. Its gain is zero point zero six three, the smallest. The complete ranking now justifies income as the root.

## Slide 18 - One greedy choice creates new, smaller learning problems

### 1. Frame

Stage A splits all fourteen records on income. The low-income child is pure high risk, so recursion stops there immediately. The other children retain mixed labels and require additional questions.

### 2. Define

Stage B treats each impure child as its own dataset. Recalculate class counts, entropy, expected entropy, and gain using only that child's rows and the remaining attributes.

### 3. Mechanism

This locality is essential. A globally mediocre attribute can become locally excellent after the first split. The best question for the middle-income group need not be the best question for the high-income group.

### 4. Interpret

Greedy construction therefore creates a sequence of conditional optimization problems. Each decision changes the evidence available to its descendants, like dividing a suspiciously large pizza into smaller arguments about toppings.

### 5. Deepen

The recursion can choose credit for one income branch and debt for a narrower descendant because information gain is conditional on the path. This is similar to medical diagnosis: the best next test after one symptom need not be the best test before any symptom is known. Context changes both the remaining uncertainty and the value of another question.

## Slide 19 - The completed tree encodes three risk concepts

### 1. Frame

The completed tree places income at the root. High risk includes every low-income application and selected middle-income paths. The class is therefore a union of different sufficient conditions, not one simple stereotype.

### 2. Define

Moderate risk appears at three separate leaves: middle income with good credit, middle income with unknown credit and low debt, or high income with bad credit. Each leaf is one conjunction.

### 3. Mechanism

Low risk occurs for high income with unknown or good credit. Notice how the same credit value can lead to a different result under a different income branch; tree decisions are contextual.

### 4. Interpret

Debt is tested only for middle income with unknown credit. Collateral is never selected. Absence from the tree means the attribute did not earn a split under this sample and heuristic, not that it is universally irrelevant.

### 5. Deepen

Count the leaves and inspect redundancy. Multiple leaves with the same class do not make the tree inconsistent; they express different sufficient routes to that outcome. Pruning may merge or replace a subtree when its distinctions do not improve validation performance. Any simplification must preserve enough evidence to avoid turning a readable model into an confidently oversimplified one.

## Slide 20 - Each root-to-leaf path becomes one conjunction

### 1. Frame

To convert a tree path into a rule, begin at the root and record every branch condition encountered before the leaf. Join conditions on that single path with AND because all of them must hold.

### 2. Define

The left-hand side contains the conditions; the right-hand side contains the leaf class. For example, if income is middle AND credit is unknown AND debt is high, then risk is high.

### 3. Mechanism

If several paths terminate at the same class, join their complete conjunctions with OR. Never replace an internal AND with OR, or the rule will accept cases that never follow a valid tree path.

### 4. Interpret

Parentheses are useful insurance: OR separates full paths, while AND binds tests within each path. Trees make control flow visible; rules make the same concept easy to audit, store, or combine.

### 5. Deepen

Rule conversion preserves predictions only when every path is represented faithfully. A tree with k leaves yields up to k rules, one per leaf. The rules may overlap after later simplification, so an implementation then needs a conflict policy. In the original unsimplified tree, mutually exclusive branch tests ensure one case follows one path and reaches one conclusion.

## Slide 21 - Write the moderate-risk concept as rules

### 1. Frame

Before revealing the answer, trace every moderate-risk leaf and write one complete conjunction per path. Check that each path begins at income and ends at a moderate leaf.

### 2. Define

The first rule is middle income AND good credit. The second is middle income AND unknown credit AND low debt. Those paths share an income condition but diverge afterward.

### 3. Mechanism

The third is high income AND bad credit. Join the three conjunctions with OR, then place risk equals moderate on the right-hand side.

### 4. Interpret

Test the rule against a neighboring case. High income with good credit must not match the moderate rule because it reaches low risk. Counterexamples are excellent grammar checkers.

### 5. Deepen

After deriving the three moderate rules, verify completeness and exclusivity against the tree. Completeness means every moderate leaf produced a rule. Fidelity means no condition was dropped or swapped. Test at least one case that should match each rule and one near neighbor that should not. This tiny rule test suite catches logical mistakes faster than rereading the expression with increasingly determined eyebrows.

### 6. Reveal the moderate-risk rules

**Instructor action before narration:** Reveal the moderate-risk rules.

Reveal the model answer. Compare all three conjunctions with the final tree, checking every AND within a path and every OR between alternative paths.

### 7. Hide the model answer

**Instructor action before narration:** Hide the model answer.

Hide the model answer so the practice can be replayed. A useful interactive slide should support prediction before reveal rather than turning immediately into answer wallpaper.

## Slide 22 - ID3 greedily searches a concept space of possible trees

### 1. Frame

Frame induction as search. A state is a partially built tree, and the search space contains all trees constructible from the available attributes and their values.

### 2. Define

An operator expands a leaf by adding an attribute test and its branches. The branching factor depends on how many unused attributes and possible values remain.

### 3. Mechanism

Information gain is the heuristic guiding which operator to apply. ID3 selects the locally best split and continues downward rather than exploring and comparing every complete tree.

### 4. Interpret

There is no ordinary backtracking. Efficiency improves dramatically, but the locally best question may lead to a larger or worse-generalizing global tree than another first choice.

### 5. Example

This connects machine learning to earlier AI search: representation defines states, operators define moves, a heuristic ranks alternatives, and the stopping rule decides when the current construction is sufficient.

## Slide 23 - Classification predicts categories; regression predicts quantities

### 1. Frame

Classification predicts a categorical target such as high, moderate, or low risk. Regression predicts a numeric quantity such as expected dollar loss. The input rows may be identical, but the target representation and evaluation metrics change.

### 2. Define

Overfitting occurs when a tree encodes training noise or rare details as brittle branches. Training accuracy improves while performance on unseen cases stagnates or declines.

### 3. Mechanism

Pre-pruning stops growth early using limits such as maximum depth, minimum child size, or minimum gain. Post-pruning first grows a larger tree, then removes branches unsupported by validation evidence.

### 4. Interpret

Use training data to fit, validation data to select depth or pruning, and the untouched test set once for final reporting. The test set is a sealed envelope, not a motivational poster you peek at every afternoon.

## Slide 24 - A confusion matrix turns errors into precision, recall, and F1

### 1. Frame

Treat high risk as the positive class. True positives are correctly flagged high-risk cases; false negatives are truly high risk but missed. False positives are flagged but not truly high risk; true negatives are correctly unflagged.

### 2. Define

Precision equals true positives divided by all predicted positives. It asks: among the applications we flagged, what fraction were actually positive? High precision limits false alarms.

### 3. Mechanism

Recall equals true positives divided by all actual positives. It asks: among all truly high-risk cases, what fraction did we find? High recall limits misses.

### 4. Interpret

F1 is the harmonic mean of precision and recall. It becomes high only when both are reasonably high, but it still hides true negatives and does not encode the real-world cost of each error.

### 5. Example

Switch operating points. The high-recall preset catches forty-eight of fifty positives but creates twenty-five false positives. The high-precision preset has only two false positives but misses eighteen positives. Neither tradeoff is automatically correct.

### 6. Audit

In lending, even the phrase positive class can mislead: flagging high risk may deny opportunity. Evaluate costs, rights, calibration, and subgroup effects rather than optimizing a convenient metric in isolation.

### 7. Deepen

Metrics also depend on prevalence and threshold. Precision can change when the base rate changes even if sensitivity and specificity remain stable. F1 ignores true negatives, while accuracy can be dominated by them. For rare high-risk cases, report the confusion counts, class prevalence, threshold, precision-recall curve, calibration, and decision costs. A single rounded score cannot carry that entire policy conversation.

### 8. Choose high recall

**Instructor action before narration:** Choose high recall.

Choose High recall. Forty-eight true positives and two false negatives produce recall zero point nine six, but twenty-five false positives reduce precision.

### 9. Choose high precision

**Instructor action before narration:** Choose high precision.

Choose High precision. Only two false positives yield precision about zero point nine four, but eighteen false negatives reduce recall to zero point six four.

### 10. Return to balanced

**Instructor action before narration:** Return to balanced.

Return to Balanced. Precision and recall are both zero point eight four, making F1 zero point eight four, but a policy decision still must interpret the costs.

## Slide 25 - One score is not enough evidence for deployment

### 1. Frame

ROC analysis compares true-positive rate with false-positive rate across thresholds. Precision-recall analysis is often more revealing when the positive class is rare because it exposes how many flagged cases are actually positive.

### 2. Define

Calibration asks whether predicted probabilities mean what they claim. Among cases assigned probability zero point seven, roughly seventy percent should realize the event over repeated comparable groups.

### 3. Mechanism

Subgroup evaluation reports error, recall, calibration, and sample size for relevant populations. An acceptable aggregate can conceal serious harm in a smaller group, especially when the group contributes few cases to the average.

### 4. Interpret

For the exit ticket, explain why income became the root, write one valid root-to-leaf rule, and name one result needed beyond accuracy. A complete answer connects calculation, representation, and responsible evidence.

### 5. Example

The central mechanism is now complete: labeled examples define distributions; entropy measures uncertainty; information gain selects a split; recursion grows the tree; paths become rules; and evaluation determines whether the learned pattern deserves trust.
