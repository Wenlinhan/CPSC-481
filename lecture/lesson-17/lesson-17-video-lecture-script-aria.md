# Lesson 17 video lecture script

- Route: /lessons/17
- Voice: Microsoft Aria Neural (en-US-AriaNeural)
- Speaking rate: 0.94x (-6%)
- Slides: 27
- Narration words: 5,564
- Timing policy: weighted around two minutes per page on average; concise overview pages; expanded equations, algorithms, mechanisms, worked examples, and every interactive demonstration
- Captions: burned in at the bottom of the final video
- Pop-ups: large standalone images/icons, dynamically positioned to avoid the active focus

## Slide 01 - Machine learning has multiple category axes

### 1. Frame

Lesson seventeen asks a more useful question than, what type of machine learning is this? A method can be classified simultaneously by the representation it changes, the feedback it receives, and the timing of its updates. One label is rarely enough.

### 2. Define

We will compare symbolic structures with numeric adaptation, evolve expressions with genetic programming, calculate a neuron's weighted score, and train a perceptron from labeled mistakes. Different mechanisms become comparable when we ask the same three questions.

### 3. Mechanism

By the end, explain what changes, what signal guides the change, when updates occur, and what the representation can express. That last capacity question explains why one perceptron handles AND but loses an argument with XOR.

## Slide 02 - From categories to one trainable neuron

### 1. Frame

First, categorize the learner on three independent axes. Representation asks what form changes; feedback asks what teaching signal is available; timing asks whether updates use a fixed collection or arrive sequentially.

### 2. Define

Second, watch genetic programming search expression trees by evaluating error, selecting parents, varying subtrees, and repeating until a stopping rule fires.

### 3. Mechanism

Third, open one artificial neuron. Inputs are multiplied by weights, bias shifts the score, and activation converts that score to output. The arithmetic is small enough to calculate by hand, which is less dramatic than the word neuron sounds.

### 4. Interpret

Fourth, let a perceptron discover weights from examples. We will trace mistakes numerically, interpret the boundary geometrically, test XOR, and connect the hard threshold to smooth activations.

## Slide 03 - A method occupies several categories at once

### 1. Frame

The representation axis asks what object is modified. A decision tree changes tests and branches. A perceptron changes numeric weights. K-means changes centroid geometry, and reinforcement learning commonly changes values or a policy.

### 2. Define

The feedback axis asks where guidance comes from. Supervised methods compare predictions with labels. Unsupervised methods seek structure without class labels. Reinforcement learning receives reward, often delayed, so the correct action is not written beside every state.

### 3. Mechanism

The timing axis asks when evidence changes the learner. Batch learning trains from a collected dataset. Online learning can update as examples arrive. Online-capable describes a mechanism, not a guarantee of good real-time decisions.

### 4. Interpret

These axes are coordinates, not competing boxes. A perceptron is non-symbolic, supervised, and online-capable simultaneously. Genetic programming here uses numeric fitness to search symbolic-looking trees, supervised by targets, in batches.

### 5. Deepen

A useful test is to hold two axes fixed and change the third. A perceptron trained once on a stored file and one updated after every arriving label share representation and feedback but differ in timing. K-means and a supervised geometric classifier may both manipulate numeric geometry but differ in feedback. The axes stop superficial similarity from collapsing distinct mechanisms.

### 6. Choose Decision tree

**Instructor action before narration:** Choose Decision tree.

Choose Decision tree. Read representation, feedback, and timing as three simultaneous coordinates, then connect the example to its mechanism rather than treating the name as a complete classification.

### 7. Choose Genetic programming

**Instructor action before narration:** Choose Genetic programming.

Choose Genetic programming. Read representation, feedback, and timing as three simultaneous coordinates, then connect the example to its mechanism rather than treating the name as a complete classification.

### 8. Choose Perceptron

**Instructor action before narration:** Choose Perceptron.

Choose Perceptron. Read representation, feedback, and timing as three simultaneous coordinates, then connect the example to its mechanism rather than treating the name as a complete classification.

### 9. Choose K-means

**Instructor action before narration:** Choose K-means.

Choose K-means. Read representation, feedback, and timing as three simultaneous coordinates, then connect the example to its mechanism rather than treating the name as a complete classification.

### 10. Choose Reinforcement learning

**Instructor action before narration:** Choose Reinforcement learning.

Choose Reinforcement learning. Read representation, feedback, and timing as three simultaneous coordinates, then connect the example to its mechanism rather than treating the name as a complete classification.

## Slide 04 - Symbolic structures and numeric representations change differently

### 1. Frame

Symbolic learning changes explicit structures: a decision-tree test, a branch, a concept description, or a rule cutoff. The learned object names relationships in a form a person can often read directly.

### 2. Define

Non-symbolic learning adapts numeric representations such as weights, centroids, embeddings, or fitness-driven parameters. Meaning is distributed through numbers and geometry rather than written as one if-then sentence.

### 3. Mechanism

Do not mistake symbolic for rigid and numeric for intelligent. Both can adapt and overfit. The practical questions are what changes smoothly, what can be explained, and which patterns the representation makes easy or impossible.

## Slide 05 - The same loan task can use rules or a weighted boundary

### 1. Frame

A decision tree might learn, if income is low, predict high risk. The test and branch are explicit. A case near a cutoff may jump to another route because the rule treats the two sides as different symbols.

### 2. Define

A perceptron computes the sign of w transpose x plus b. Every feature contributes through a weight, and the equation defines one boundary. Moving a weight rotates the boundary; moving bias shifts it.

### 3. Mechanism

Both models can use the same labels yet encode the solution differently. The tree explains a path of conditions; the perceptron explains a signed score and a geometric side. Same homework, different handwriting—and different limits.

## Slide 06 - Genetic programming evolves functions that fit labeled values

### 1. Frame

Genetic programming represents candidate solutions as expression trees. Internal nodes are functions such as addition, subtraction, multiplication, or protected division; leaves are variables and constants. Changing the tree changes the program.

### 2. Define

Evaluation runs each candidate on all labeled pairs. A fitness function summarizes prediction error, so smaller error means a better fit here. Fitness is the selection signal, not proof that the expression discovered a true law.

### 3. Mechanism

Tournament selection samples four candidates and favors a fitter parent. Crossover swaps subtrees with ninety percent probability; mutation changes material with five percent probability while depth limits prevent algebraic spaghetti.

### 4. Interpret

The loop stops at error zero point zero zero one or generation one hundred. Evolution searches heuristically; it does not enumerate every program or guarantee the globally best tree.

### 5. Deepen

Fitness design defines evolutionary success. Mean absolute error treats a one-unit miss linearly; squared error punishes large misses more; a complexity penalty can discourage enormous trees that shave tiny training errors. Selection optimizes the declared score, not an abstract notion of elegance. If the objective rewards the wrong behavior, evolution can become creative at doing precisely the wrong thing.

### 6. Worked detail

Imagine two parents: one tree encodes x times x and another encodes x divided by two. Crossover can exchange a subtree to produce x times x divided by two, while mutation might replace a constant. The child is not guaranteed better; evaluation decides. Variation proposes, fitness judges, selection changes which proposals are more likely to reproduce.

### 7. Represent

**Instructor action before narration:** Represent.

Choose Represent. Candidate programs are expression trees assembled from variables, constants, and allowed functions; this structure defines what search can express.

### 8. Evaluate

**Instructor action before narration:** Evaluate.

Choose Evaluate. Every candidate predicts all ten labels, and aggregate error becomes fitness. Lower training error earns preference, not a diploma in universal truth.

### 9. Select

**Instructor action before narration:** Select.

Choose Select. Tournament selection compares four sampled candidates and favors a fitter parent without globally ranking the population.

### 10. Vary

**Instructor action before narration:** Vary.

Choose Vary. Crossover swaps subtrees with ninety percent probability, mutation makes smaller changes with five percent probability, and depth limits restrain bloat.

### 11. Stop

**Instructor action before narration:** Stop.

Choose Stop. Search ends at tolerated error zero point zero zero one or generation one hundred, making termination explicit.

## Slide 07 - Ten labeled pairs define the fitness problem

### 1. Frame

Training inputs run from zero through zero point nine in steps of one tenth. Each target is y equals x squared divided by two. The table therefore contains ten supervised regression examples.

### 2. Define

For x zero point six, square to obtain zero point three six, then divide by two to get zero point one eight. GP is not handed that formula; it sees only the labeled pair.

### 3. Mechanism

A candidate predicts all ten outputs and fitness aggregates the errors. An expression that memorizes these points may still fail elsewhere, so unseen inputs are needed before claiming generalization.

### 4. Interpret

The pattern seems simple because we know the recipe. The learner must reconstruct it from ten tastes while someone hides the cookbook and restricts the available ingredients.

### 5. Deepen

Trace units as a consistency check. Input x has its original scale; squaring creates x squared; dividing by two produces the target scale. An expression x divided by two may match endpoints loosely but misses the curvature. Comparing residuals across all rows reveals that distinction more reliably than admiring one successful prediction.

### 6. Select row 1

**Instructor action before narration:** Select row 1.

Select record one. With x zero, target zero anchors the curve at the origin.

### 7. Select row 4

**Instructor action before narration:** Select row 4.

Select record four. With x zero point three, target is zero point zero four five after squaring and dividing by two.

### 8. Select row 7

**Instructor action before narration:** Select row 7.

Select record seven. With x zero point six, target zero point one eight can be verified from the hidden pattern.

### 9. Select row 10

**Instructor action before narration:** Select row 10.

Select record ten. With x zero point nine, target zero point four zero five is a useful endpoint for checking an evolved expression.

## Slide 08 - A symbolic regressor follows a fit and predict workflow

### 1. Frame

Step one constructs X as ten rows with one feature and y as matching targets. Reshape matters because estimator interfaces expect examples by rows and features by columns.

### 2. Define

Step two configures population six hundred, one hundred generations, and tournament size four. These settings control search effort and pressure; they do not change the meaning of fit or predict.

### 3. Mechanism

Step three calls fit. Behind the familiar interface, the library evolves expression trees instead of solving ordinary linear regression. Printing the selected program exposes the surviving expression.

### 4. Interpret

Step four predicts unseen values and measures error. Precision point: gplearn is scikit-learn-compatible, not a core scikit-learn estimator. Familiar packaging should not blur the actual algorithm.

### 5. Deepen

The fit-predict interface separates training from inference. Fit inspects X and y and alters the estimator. Predict receives only new X and uses the learned program without target access. Evaluation compares predictions with withheld y. Keeping these roles separate prevents leakage and makes experiments reproducible across symbolic regression, trees, and numeric estimators.

### 6. Show data step

**Instructor action before narration:** Show data step.

Choose data. X contains ten rows and one feature; y contains matching regression targets.

### 7. Show model step

**Instructor action before narration:** Show model step.

Choose model. Population, generations, and tournament size configure evolutionary search effort.

### 8. Show fit step

**Instructor action before narration:** Show fit step.

Choose fit. The interface is familiar while the internal optimizer evolves expression trees.

### 9. Show test step

**Instructor action before narration:** Show test step.

Choose test. Predict unseen values and measure error; training fitness cannot establish generalization.

## Slide 09 - An artificial neuron combines weighted inputs, bias, and activation

### 1. Frame

An artificial neuron receives inputs x sub i. Each input is multiplied by weight w sub i, and the neuron adds the contributions: net equals the sum of w sub i x sub i plus bias.

### 2. Define

A positive weight makes larger input push upward; a negative weight pushes downward. Magnitude controls influence. A zero weight tells that feature, thank you for coming, your contribution is nothing.

### 3. Mechanism

Bias is a constant input of one with its own weight. It shifts the decision point without changing measured features, like moving a ruler's zero mark.

### 4. Interpret

Activation converts net to output. A hard step yields a class-like decision; sigmoid yields a smooth value; later networks use differentiable activations so error can guide many weights.

### 5. Deepen

Expand the equation with two features: net equals w one x one plus w two x two plus b. This is affine. Before activation, equal-score points lie on parallel lines, and the zero-score set is the decision boundary. The diagram is both a signal-aggregating circuit and a geometric machine assigning each point to a side.

## Slide 10 - Change one factor and watch the score cross threshold

### 1. Frame

Begin with inputs zero point eight and zero point four, weights zero point seven and negative zero point three, and bias negative zero point two. Net is zero point eight times zero point seven plus zero point four times negative zero point three minus zero point two, or zero point two four.

### 2. Define

The hard activation returns one when net is at least zero, so this setting outputs one. The second feature subtracts because its weight is negative.

### 3. Mechanism

Changing one value isolates its role. Reducing w one weakens positive evidence; making bias more negative shifts every example toward zero. Predict the direction before moving the control, then inspect the score.

### 4. Interpret

Crossing zero creates a discrete jump even when a slider moves smoothly. That is useful for threshold logic but problematic when we need a gradient saying how to improve a mistake.

### 5. Deepen

Calculate initial contributions separately: the first gives positive zero point five six, the second negative zero point one two, and bias negative zero point two. Their sum is positive zero point two four. A contribution ledger prevents a common error—changing one weight and mentally changing every term as if one slider had union representation.

### 6. Worked detail

Now separate boundary movement from evidence movement. Adjusting x changes the current case's location while holding the model fixed. Adjusting w or bias changes the model while holding the case fixed. Both alter net, but they answer different questions: what if this input were different, versus what if the learned decision rule were different?

### 7. Reduce the first weight

**Instructor action before narration:** Reduce the first weight.

Move w one down to zero point one. Its positive contribution shrinks, so the total score crosses below zero and the hard output switches off.

### 8. Raise the bias

**Instructor action before narration:** Raise the bias.

Move bias up to zero point two. The constant offset lifts every score and this example crosses back above threshold.

### 9. Make the second weight positive

**Instructor action before narration:** Make the second weight positive.

Move w two to zero point six. The second feature now adds evidence instead of subtracting it, increasing net.

### 10. Lower the first input

**Instructor action before narration:** Lower the first input.

Move x one to negative zero point five. With positive w one, this contribution reduces the score and may reverse output.

## Slide 11 - Fixed weights and bias implement AND and OR

### 1. Frame

For both gates, set input weights to one and use a hard threshold at net zero. AND uses bias negative two, so only one plus one minus two reaches zero; the other three pairs stay negative.

### 2. Define

OR uses bias negative one, so either single one reaches zero and one-one is positive. Only zero-zero stays negative. The weights are unchanged; bias moves the threshold.

### 3. Mechanism

These McCulloch-Pitts units are engineered, not learned. Someone selected parameters to reproduce truth tables. We will run every pair so the equation—not a memorized slogan—shows why the gates differ.

### 4. Deepen

Write the AND inequalities. Zero-zero, one-zero, and zero-one must score below zero; one-one must score at least zero. Unit weights and bias negative two satisfy all four. For OR only zero-zero must stay below zero, so bias negative one works. Bias encodes how much combined evidence is required.

## Slide 12 - Run all four input pairs through one gate

### 1. Frame

For AND at zero-zero, net is negative two and output zero. With one input active, net is negative one, still zero. With both active, net reaches zero and output becomes one.

### 2. Define

For OR, bias changes to negative one. Zero-zero produces negative one, either single one produces zero, and one-one produces positive one.

### 3. Mechanism

The invariant is weights one and one. The changed bias determines which truth-table corners cross the same threshold. A gate is a tiny geometric classifier over four points.

### 4. Interpret

We will demonstrate all combinations. Watching the score update transfers better to larger feature vectors than chanting AND needs both.

### 5. Deepen

Notice the equality convention. Activation returns one when net is greater than or equal to zero, not strictly greater. That is why AND at one-one with net exactly zero turns on, and OR with a single active input turns on. Changing the comparison operator would require changing bias or would alter boundary cases.

### 6. Worked detail

List AND in order: zero-zero gives negative two, zero-one negative one, one-zero negative one, one-one zero. OR gives negative one, zero, zero, one. The two tables differ only in the three middle score offsets created by bias. Writing the numbers makes the mechanism portable to any pair of binary inputs.

### 7. Set x to zero

**Instructor action before narration:** Set x to zero.

Toggle x to zero. With AND and y zero, net is negative two and output remains zero.

### 8. Set y to one

**Instructor action before narration:** Set y to one.

Toggle y to one. AND remains zero because only one input is active and net is negative one.

### 9. Set x to one

**Instructor action before narration:** Set x to one.

Toggle x back to one. Both inputs are active, net reaches zero, and AND outputs one.

### 10. Choose OR

**Instructor action before narration:** Choose OR.

Choose OR. Weights remain one and one, bias becomes negative one, and current one-one produces net one.

### 11. Set x to zero

**Instructor action before narration:** Set x to zero.

Toggle x to zero. OR remains one because y alone brings net to zero.

### 12. Set y to zero

**Instructor action before narration:** Set y to zero.

Toggle y to zero. With neither input active, net negative one makes OR output zero.

### 13. Set x to one

**Instructor action before narration:** Set x to one.

Toggle x to one. A single active input is sufficient for OR, so net reaches zero.

### 14. Return x to zero

**Instructor action before narration:** Return x to zero.

Toggle x back to zero. This restores zero-zero and completes all input states across both gates.

## Slide 13 - A predictive learner must discover weights from examples

### 1. Frame

A supervised classifier receives feature vectors such as dimensions, prices, or pixels. It also receives a desired class t for each training vector.

### 2. Define

What it is not given is the correct weight vector. Learning adjusts parameters until predictions agree with labels under a declared criterion.

### 3. Mechanism

This separates design from learning. AND and OR used hand-selected weights; the perceptron infers a boundary from errors. Features, labels, and purpose still come from people and data collection, not the cosmic ether.

## Slide 14 - The target column creates labeled training examples

### 1. Frame

Each row contains x one, x two, and target t. Small coordinate pairs have label plus one; large pairs have label negative one. The target makes this supervised classification rather than clustering.

### 2. Define

At prediction time the target disappears. A new point supplies only features, and the sign of the learned score chooses a class. Keeping the target would be answer leakage wearing a fake mustache.

### 3. Mechanism

These ten points are visually separable into two groups. That matters because one perceptron learns only one linear boundary. If labels alternated around the plane, more epochs would not fix a representation mismatch.

### 4. Interpret

Training rows are evidence, not the objective itself. We want weights that generalize to comparable unseen points, not a theatrical performance that recognizes only its rehearsed cases.

### 5. Deepen

Targets plus one and negative one match the activation coding. If a system uses zero and one, error magnitudes and the update must be interpreted consistently. Label encoding is part of the mathematical specification. Mixing encodings can make a correct formula look broken, like measuring one ingredient in cups and another in confused optimism.

## Slide 15 - Predict first and update only after a mistake

### 1. Frame

Step one scores the example with the weighted sum. Include a constant feature one if bias is stored as another weight. Step two predicts plus one when net meets threshold, otherwise negative one.

### 2. Define

Step three computes t minus a. It is zero when correct, plus two when prediction was negative but target positive, and negative two for the opposite mistake.

### 3. Mechanism

Step four changes every weight by eta times t minus a times x sub i. Eta is learning rate. A positive correction moves this example's score upward; a negative correction moves it downward.

### 4. Interpret

Correct predictions produce zero update. The perceptron is wonderfully lazy in a principled way: if the boundary classifies correctly, keep the weights and move on.

### 5. Deepen

Derive update direction. If target is plus one but prediction negative one, t minus a equals two. With positive eta, every positive feature increases its weight, raising this example's future score. For the opposite mistake the factor is negative two and score is pushed downward. The rule combines mistake sign with example coordinates.

### 6. Worked detail

Bias update follows the same rule by using x bias equal to one. When an example needs a higher score, bias rises by eta times t minus a; when it needs a lower score, bias falls. Treating bias uniformly simplifies implementation and explains why the third coordinate in our vectors is always one.

## Slide 16 - One epoch processes every example; convergence may reuse data

### 1. Frame

Initialize weights, then process examples in a declared order. For each row, score, predict, compare, and update if mistaken. One visit is one training step.

### 2. Define

One epoch is one complete pass through every example. It is not one update and not necessarily convergence. A late update can make an earlier case wrong again, so another epoch may be required.

### 3. Mechanism

For linearly separable data and positive learning rate, the convergence theorem guarantees a separating solution after finitely many mistakes. It does not promise identical weights for every order or initialization.

### 4. Interpret

For nonseparable data, updates may cycle. A practical implementation declares a maximum epoch count instead of waiting for mathematical enlightenment to arrive by courier.

### 5. Deepen

Order matters because every update changes the start for the next calculation. Shuffling can change the path and final separating vector even when runs classify all training data. A reproducible experiment records initialization, learning rate, order, stopping rule, feature scaling, and seed. Convergence is a property; a particular vector is a historical path.

### 6. Worked detail

Stopping after one error-free pass is common in demonstrations, but a robust implementation may require repeated stable passes or a tolerance. For separable data, zero training mistakes is attainable. For noisy or overlapping classes, monitor mistakes or validation performance and preserve the best checkpoint rather than interpreting endless motion as productive perseverance.

## Slide 17 - The source example starts with W and learning rate

### 1. Frame

Start with W equal to zero point seven five, zero point five, negative zero point six, and learning rate eta zero point two. The third coordinate multiplies constant one, acting as bias.

### 2. Define

Example one is one, one, one with target plus one. Score is zero point seven five plus zero point five minus zero point six, or zero point six five. Prediction is correct, so change is zero.

### 3. Mechanism

Example two is nine point four, six point four, one with target negative one. Its positive score is a mistake, so t minus a is negative two and the update is negative along each positive input.

### 4. Interpret

Example three uses the newly changed weights. Perceptron learning is sequential. Recalculating every row from the original weights would be three parallel daydreams, not this algorithm.

### 5. Deepen

Estimate magnitude before calculating. Example two has much larger coordinates than example one, so its mistaken update should be large. Scalar correction negative zero point four times nine point four gives negative three point seven six, and times six point four gives negative two point five six. This mental bound catches decimal errors before they propagate.

### 6. Worked detail

Feature scale controls update scale because x multiplies the correction. A feature near ten moves its weight roughly ten times more than a feature near one under the same mistake. Standardization can make optimization behavior more balanced, but it also changes how coefficients should be interpreted. Always record preprocessing with the model.

## Slide 18 - Compute score, prediction, correction, and next weights

### 1. Frame

Example one scores zero point six five and predicts plus one, matching target. Eta times zero times x gives zero delta, so W stays zero point seven five, zero point five, negative zero point six.

### 2. Define

Example two scores nine point six five and predicts plus one while target is negative one. Eta times t minus a is zero point two times negative two, or negative zero point four.

### 3. Mechanism

Multiply by x: changes are negative three point seven six, negative two point five six, negative zero point four. Add them to obtain negative three point zero one, negative two point zero six, negative one.

### 4. Interpret

Example three now scores negative twelve point eight five and predicts negative one for target plus one. Scalar correction positive zero point four times x gives one, zero point eight four, zero point four.

### 5. Example

Adding yields negative two point zero one, negative one point two two, negative zero point six. Check signs before decimals: positive-target mistakes push scores up; negative-target mistakes push them down.

### 6. Deepen

Verify example three with updated weights. Negative three point zero one times two point five is negative seven point five two five; negative two point zero six times two point one is negative four point three two six; add bias negative one to get about negative twelve point eight five. Target is positive, so positive correction is required.

### 7. Worked detail

The update is vector addition, not replacement. For example two, start with old W and add delta component by component. For example three, start with example two's result and add the new delta. A spreadsheet-like table with columns for old weight, correction, and new weight is often the safest way to audit a hand calculation.

### 8. Trace example 1

**Instructor action before narration:** Trace example 1.

Choose Example one. Score zero point six five has the correct positive sign, so delta is all zeros.

### 9. Trace example 2

**Instructor action before narration:** Trace example 2.

Choose Example two. A positive prediction conflicts with target negative one; the negative correction produces weights negative three point zero one, negative two point zero six, negative one.

### 10. Trace example 3

**Instructor action before narration:** Trace example 3.

Choose Example three. New weights predict negative for a positive target; the positive correction moves every weight along the input vector.

## Slide 19 - The converged vector defines a separating line

### 1. Frame

After repeated passes, the source reports weights approximately negative one point three, negative one point one, and ten point nine. The boundary is where score equals zero: negative one point three x one minus one point one x two plus ten point nine equals zero.

### 2. Define

The first coefficients form a vector perpendicular to the line and control orientation. The constant shifts the line. Points on one side score positive; points on the other score negative.

### 3. Mechanism

Classification depends on sign. Score magnitude relates to distance under this scaling, but a vanilla perceptron does not automatically provide calibrated probability.

### 4. Interpret

The line separates training groups. Evaluation still asks about unseen points, scaling, order sensitivity, and whether these features encode an appropriate decision.

### 5. Deepen

Solve the boundary for x two by moving terms and dividing by negative one point one. This gives a slope-intercept view. Coefficient ratio controls slope while the constant controls intercept. Multiplying every coefficient by the same positive constant leaves the zero set and classifications unchanged, so many numeric vectors can encode the same boundary.

### 6. Worked detail

The learned vector is not unique. If several lines separate the clusters, perceptron may settle on different ones depending on order and initialization. It seeks any consistent separator, not necessarily the maximum-margin separator found by a support-vector machine. Convergence therefore answers can it separate, not did it find the widest safety corridor.

## Slide 20 - Move the line and inspect weight geometry

### 1. Frame

The before-learning boundary comes from initial weights and cuts through the labeled geometry. Starting weights are only a hypothesis.

### 2. Define

The converged line sits between small positive examples and large negative examples. Changing feature coefficients rotates its normal direction; changing bias translates it.

### 3. Mechanism

The too-high line has plausible orientation but wrong position. Linear is a shape family, not a guarantee of placement.

### 4. Interpret

Each selected equation redraws the same points with a different line, connecting algebra to picture. The visual change is a consequence of weights, not decoration.

### 5. Deepen

Check a point by substitution. One, one gives negative one point three minus one point one plus ten point nine, a positive score. Nine, seven gives a strongly negative score. Graph and arithmetic must agree. If they do not, inspect axis direction, sign convention, or plotting coordinates before blaming the perceptron.

### 6. Worked detail

Bias has a geometric interpretation as location, but only relative to coefficient scale. Doubling weights and bias doubles every score while leaving the boundary unchanged. Therefore compare normalized parameters or compare the actual line, rather than declaring one model more confident simply because all its coefficients are numerically larger.

### 7. Show before-learning boundary

**Instructor action before narration:** Show before-learning boundary.

Choose Before learning. The initial line cuts through labeled geometry; starting weights are only a hypothesis.

### 8. Show converged boundary

**Instructor action before narration:** Show converged boundary.

Choose Converged. Learned coefficients rotate and shift the line between training clusters.

### 9. Show overly high boundary

**Instructor action before narration:** Show overly high boundary.

Choose Too high. Similar orientation with incorrect position shows why both normal vector and bias matter.

## Slide 21 - One perceptron represents only a linear boundary

### 1. Frame

AND and OR are linearly separable: one straight boundary places positive truth-table corners on one side and negative corners on the other. The ten-point example shares that useful geometry.

### 2. Define

XOR labels opposite corners alike. Any single line collecting one positive corner cannot collect the opposite one without also including a negative corner.

### 3. Mechanism

More data and more epochs cannot make one line bend. Optimization searches within the representation; it does not secretly replace the representation when homework becomes inconvenient.

### 4. Deepen

Linear separability belongs to labeled geometry in the chosen feature space. A task nonseparable in raw x one and x two can become separable after adding a transformed feature such as their product. The perceptron still draws one hyperplane, but representation engineering changed the space in which that plane operates.

## Slide 22 - The XOR threshold inequalities contradict one another

### 1. Frame

Let XOR output zero for zero-zero and one-one, but one for one-zero and zero-one. With threshold theta, zero-zero being negative requires zero less than theta.

### 2. Define

For one-zero positive, w one exceeds theta. For zero-one positive, w two exceeds theta. Adding gives w one plus w two greater than two theta.

### 3. Mechanism

Because theta is positive, that sum is also greater than theta. But one-one negative requires w one plus w two less than theta. The same sum cannot be both greater and less.

### 4. Interpret

This is an impossibility proof, not a failed training run. No learning rate, initialization, order, or heroic number of epochs satisfies inconsistent inequalities with one threshold unit.

### 5. Deepen

The contradiction survives bias notation. Write score as w one x one plus w two x two plus b with threshold zero. XOR imposes incompatible signs on b, w one plus b, w two plus b, and w one plus w two plus b. Threshold and bias forms are algebraic translations of the same impossibility.

### 6. Worked detail

Another proof uses convexity. Each class separated by one line must lie in its own half-plane, and half-planes are convex. The line segment connecting XOR's two positive corners passes through the square's center, as does the segment connecting the negatives. Their convex hulls intersect, so no linear separator can place them in disjoint half-planes.

## Slide 23 - Try a line, then explain why it fails

### 1. Frame

A vertical line separates left from right, but each side contains one zero and one one. It organizes x coordinate, not XOR labels.

### 2. Define

A diagonal line can isolate one corner, but the positive corners are opposite. One half-plane cannot collect both without a negative corner.

### 3. Mechanism

The correct answer is no single line. The useful explanation is geometric: the positive set is disconnected under a linear cut. Saying nonlinear names the diagnosis without showing the X-ray.

### 4. Interpret

A richer model combines multiple boundaries. Hidden units carve several regions and compose them, bridging to Lesson eighteen.

### 5. Deepen

When testing a boundary, name the two sets it creates and list the labels on each side. Success requires every point of one class in one half-plane and every point of the other class in the other. Rotation changes which adjacent corners group together but cannot make opposite corners one connected half-plane.

### 6. Try a vertical line

**Instructor action before narration:** Try a vertical line.

Try vertical. Each side contains one zero and one one, so separation by x coordinate fails.

### 7. Try a diagonal line

**Instructor action before narration:** Try a diagonal line.

Try diagonal. Opposite positive corners cannot occupy one half-plane without a negative corner.

### 8. Choose no single line

**Instructor action before narration:** Choose no single line.

Choose No single line. Correct: XOR is not linearly separable, so one perceptron cannot express it.

## Slide 24 - Sigmoid replaces the hard jump with a smooth curve

### 1. Frame

The hard step changes abruptly at zero and has no useful derivative at the jump. Sigmoid maps net to one divided by one plus e raised to negative lambda net, producing values between zero and one.

### 2. Define

At net zero sigmoid equals one half. Large positive inputs approach one; large negative inputs approach zero. Lambda controls steepness, with larger lambda becoming more step-like.

### 3. Mechanism

The curve is continuous and differentiable. Its slope is largest in the transition region and small in saturated tails, supplying directional information for gradient-based updates.

### 4. Interpret

Smooth output is not automatically calibrated probability, and sigmoid in one unit does not solve XOR. Capacity comes from composing units; activation shape makes composition trainable.

### 5. Deepen

Sigmoid derivative equals lambda times sigma times one minus sigma. Near output one half this is largest; near zero or one it shrinks. Backpropagation multiplies local derivatives across layers, so repeated small factors can cause vanishing gradients. Smoothness enables gradient learning, while saturation creates a separate optimization challenge.

### 6. Worked detail

Lambda illustrates a tradeoff. Very large lambda resembles the hard step, but most inputs then fall into nearly flat saturated regions where gradients are tiny. Very small lambda keeps more points in transition but changes slowly. A smooth approximation is useful because of its derivative, not because curves are aesthetically more polite than corners.

## Slide 25 - Activation choice changes range, smoothness, and gradient flow

### 1. Frame

Step outputs zero or one with an abrupt threshold. It illustrates logic well, but the absent useful gradient is unsuitable for ordinary backpropagation through hidden layers.

### 2. Define

Sigmoid is smooth and bounded. Its S-shape is interpretable, yet gradients become tiny for strongly positive or negative inputs, slowing deep learning.

### 3. Mechanism

ReLU returns zero for negative input and grows linearly for positive input. Its simple positive derivative helps gradient flow, though a unit stuck negative can receive zero gradient.

### 4. Interpret

Activation changes range, smoothness, and learning behavior. It does not replace the weighted sum; it changes what happens after that sum.

### 5. Deepen

Range matters. Sigmoid stays between zero and one, useful for a binary output interpreted carefully. ReLU is unbounded above and common in hidden layers. Step gives discrete decisions. Choose based on layer role, gradient behavior, stability, and the quantity the output represents; no activation is universally best.

### 6. Worked detail

For classification outputs, activation must be paired with an appropriate loss and interpretation. Sigmoid plus binary cross-entropy is a common pairing. Hidden ReLU units transform intermediate representations; they are not probabilities. A final threshold may still convert a smooth score to a class after training. Layer role determines what range is meaningful.

### 7. Show step

**Instructor action before narration:** Show step.

Choose Step. Output jumps at threshold, giving a crisp decision but no useful gradient.

### 8. Show sigmoid

**Instructor action before narration:** Show sigmoid.

Choose Sigmoid. The smooth S-curve stays between zero and one and slopes most near transition.

### 9. Show ReLU

**Instructor action before narration:** Show ReLU.

Choose ReLU. Negative inputs map to zero while positive inputs grow linearly.

## Slide 26 - Classify the learner before choosing an algorithm

### 1. Frame

Case one has labels, expression-tree evolution, and all data available. That is genetic programming: non-symbolic adaptive search, supervised feedback, and batch timing here.

### 2. Define

Case two has no labels and asks for customer groups. K-means changes centroid geometry, uses unsupervised feedback, and is usually batch.

### 3. Mechanism

Case three is a labeled stream updated after mistakes. That is a perceptron: non-symbolic weights, supervised targets, and online-capable timing.

### 4. Interpret

The axes narrow the design space but do not choose automatically. Geometry, error costs, interpretability, capacity, and deployment still matter. Classification is the map legend, not the journey.

### 5. Open case one

**Instructor action before narration:** Open case one.

Choose Case one. Labels plus expression-tree evolution over fixed data identify supervised, batch genetic programming.

### 6. Reveal case 1

**Instructor action before narration:** Reveal case 1.

Reveal the classification for case 1. Compare representation, feedback, and timing with your prediction before moving on.

### 7. Open case two

**Instructor action before narration:** Open case two.

Choose Case two. No labels and grouping identify unsupervised K-means with centroid geometry.

### 8. Reveal case 2

**Instructor action before narration:** Reveal case 2.

Reveal the classification for case 2. Compare representation, feedback, and timing with your prediction before moving on.

### 9. Open case three

**Instructor action before narration:** Open case three.

Choose Case three. A labeled stream with mistake-triggered updates identifies an online-capable perceptron.

### 10. Reveal case 3

**Instructor action before narration:** Reveal case 3.

Reveal the classification for case 3. Compare representation, feedback, and timing with your prediction before moving on.

## Slide 27 - Explain what changed and what the representation can express

### 1. Frame

The exit ticket needs three precise sentences. First, classify perceptron learning as non-symbolic in representation, supervised in feedback, and online-capable in timing.

### 2. Define

Second, explain one update: score, compare prediction with target, compute eta times t minus a times each input, and add the correction to current weights.

### 3. Mechanism

Third, explain XOR's need for richer representation. Opposite positive corners cannot be separated from opposite negatives by one line, and the threshold inequalities contradict.

### 4. Interpret

Lesson eighteen combines units into layers. Multiple boundaries form nonlinear regions, while backpropagation uses differentiable activations to assign error credit. One neuron drew a line; next it gets colleagues.
