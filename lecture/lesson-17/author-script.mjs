import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const phrase=text=>text.trim().split(/\s+/).slice(0,7).join(" ");
const focus=(text,selector,index=0,label="Narration focus")=>({phrase:phrase(text),selector,index,label});
const popup=(text,label,emoji)=>({type:"popup",phrase:phrase(text),label,emoji,route:"center-hold",durationSeconds:6});
const S=(title,icon,targets,segments)=>({title,popup:[title,icon],targets,segments});

const data=[
S("Machine learning has multiple category axes","🧭",[[".m12-cover section",0],[".m12-cover-orbit",0],[".m12-cover section",0]],[
"Lesson seventeen asks a more useful question than, what type of machine learning is this? A method can be classified simultaneously by the representation it changes, the feedback it receives, and the timing of its updates. One label is rarely enough.",
"We will compare symbolic structures with numeric adaptation, evolve expressions with genetic programming, calculate a neuron's weighted score, and train a perceptron from labeled mistakes. Different mechanisms become comparable when we ask the same three questions.",
"By the end, explain what changes, what signal guides the change, when updates occur, and what the representation can express. That last capacity question explains why one perceptron handles AND but loses an argument with XOR."
]),
S("From categories to one trainable neuron","🗺️",[[".m12-cards article",0],[".m12-cards article",1],[".m12-cards article",2],[".m12-cards article",3]],[
"First, categorize the learner on three independent axes. Representation asks what form changes; feedback asks what teaching signal is available; timing asks whether updates use a fixed collection or arrive sequentially.",
"Second, watch genetic programming search expression trees by evaluating error, selecting parents, varying subtrees, and repeating until a stopping rule fires.",
"Third, open one artificial neuron. Inputs are multiplied by weights, bias shifts the score, and activation converts that score to output. The arithmetic is small enough to calculate by hand, which is less dramatic than the word neuron sounds.",
"Fourth, let a perceptron discover weights from examples. We will trace mistakes numerically, interpret the boundary geometrically, test XOR, and connect the hard threshold to smooth activations."
]),
S("A method occupies several categories at once","🧩",[[".m12-category-explorer nav",0],[".m12-category-explorer section",0],[".m12-axis",0],[".m12-axis",1],[".m12-axis",2]],[
"The representation axis asks what object is modified. A decision tree changes tests and branches. A perceptron changes numeric weights. K-means changes centroid geometry, and reinforcement learning commonly changes values or a policy.",
"The feedback axis asks where guidance comes from. Supervised methods compare predictions with labels. Unsupervised methods seek structure without class labels. Reinforcement learning receives reward, often delayed, so the correct action is not written beside every state.",
"The timing axis asks when evidence changes the learner. Batch learning trains from a collected dataset. Online learning can update as examples arrive. Online-capable describes a mechanism, not a guarantee of good real-time decisions.",
"These axes are coordinates, not competing boxes. A perceptron is non-symbolic, supervised, and online-capable simultaneously. Genetic programming here uses numeric fitness to search symbolic-looking trees, supervised by targets, in batches."
]),
S("Symbolic structures and numeric representations change differently","🧱",[[".m12-cards article",0],[".m12-cards article",1],[".m12-cards article",0]],[
"Symbolic learning changes explicit structures: a decision-tree test, a branch, a concept description, or a rule cutoff. The learned object names relationships in a form a person can often read directly.",
"Non-symbolic learning adapts numeric representations such as weights, centroids, embeddings, or fitness-driven parameters. Meaning is distributed through numbers and geometry rather than written as one if-then sentence.",
"Do not mistake symbolic for rigid and numeric for intelligent. Both can adapt and overfit. The practical questions are what changes smoothly, what can be explained, and which patterns the representation makes easy or impossible."
]),
S("The same loan task can use rules or a weighted boundary","⚖️",[[".m12-contrast article",0],[".m12-contrast i",0],[".m12-contrast article",1],[".m12-contrast",0]],[
"A decision tree might learn, if income is low, predict high risk. The test and branch are explicit. A case near a cutoff may jump to another route because the rule treats the two sides as different symbols.",
"A perceptron computes the sign of w transpose x plus b. Every feature contributes through a weight, and the equation defines one boundary. Moving a weight rotates the boundary; moving bias shifts it.",
"Both models can use the same labels yet encode the solution differently. The tree explains a path of conditions; the perceptron explains a signed score and a geometric side. Same homework, different handwriting—and different limits."
]),
S("Genetic programming evolves functions that fit labeled values","🧬",[[".m12-gp-lab nav",0],[".m12-gp-lab section",0],[".m12-expression-tree",0],[".m12-gp-lab",0]],[
"Genetic programming represents candidate solutions as expression trees. Internal nodes are functions such as addition, subtraction, multiplication, or protected division; leaves are variables and constants. Changing the tree changes the program.",
"Evaluation runs each candidate on all labeled pairs. A fitness function summarizes prediction error, so smaller error means a better fit here. Fitness is the selection signal, not proof that the expression discovered a true law.",
"Tournament selection samples four candidates and favors a fitter parent. Crossover swaps subtrees with ninety percent probability; mutation changes material with five percent probability while depth limits prevent algebraic spaghetti.",
"The loop stops at error zero point zero zero one or generation one hundred. Evolution searches heuristically; it does not enumerate every program or guarantee the globally best tree."
]),
S("Ten labeled pairs define the fitness problem","🔢",[[".m12-dataset-demo table",0],[".m12-dataset-demo tbody tr",0],[".m12-dataset-demo section",0],[".m12-dataset-demo",0]],[
"Training inputs run from zero through zero point nine in steps of one tenth. Each target is y equals x squared divided by two. The table therefore contains ten supervised regression examples.",
"For x zero point six, square to obtain zero point three six, then divide by two to get zero point one eight. GP is not handed that formula; it sees only the labeled pair.",
"A candidate predicts all ten outputs and fitness aggregates the errors. An expression that memorizes these points may still fail elsewhere, so unseen inputs are needed before claiming generalization.",
"The pattern seems simple because we know the recipe. The learner must reconstruct it from ten tastes while someone hides the cookbook and restricts the available ingredients."
]),
S("A symbolic regressor follows a fit and predict workflow","💻",[[".m12-code-lab nav",0],[".m12-code-lab pre",0],[".m12-code-lab section p",0],[".m12-code-lab section small",0]],[
"Step one constructs X as ten rows with one feature and y as matching targets. Reshape matters because estimator interfaces expect examples by rows and features by columns.",
"Step two configures population six hundred, one hundred generations, and tournament size four. These settings control search effort and pressure; they do not change the meaning of fit or predict.",
"Step three calls fit. Behind the familiar interface, the library evolves expression trees instead of solving ordinary linear regression. Printing the selected program exposes the surviving expression.",
"Step four predicts unseen values and measures error. Precision point: gplearn is scikit-learn-compatible, not a core scikit-learn estimator. Familiar packaging should not blur the actual algorithm."
]),
S("An artificial neuron combines weighted inputs, bias, and activation","🧠",[[".m12-source-media",0],[".m12-media-explain section code",0],[".m12-media-explain ol li",0],[".m12-media-explain ol li",1],[".m12-media-explain ol li",2],[".m12-media-explain ol li",3]],[
"An artificial neuron receives inputs x sub i. Each input is multiplied by weight w sub i, and the neuron adds the contributions: net equals the sum of w sub i x sub i plus bias.",
"A positive weight makes larger input push upward; a negative weight pushes downward. Magnitude controls influence. A zero weight tells that feature, thank you for coming, your contribution is nothing.",
"Bias is a constant input of one with its own weight. It shifts the decision point without changing measured features, like moving a ruler's zero mark.",
"Activation converts net to output. A hard step yields a class-like decision; sigmoid yields a smooth value; later networks use differentiable activations so error can guide many weights."
]),
S("Change one factor and watch the score cross threshold","🎚️",[[".m12-neuron-lab label",0],[".m12-neuron-lab label",2],[".m12-neuron-lab label",4],[".m12-neuron-diagram article",0],[".m12-neuron-diagram output",0]],[
"Begin with inputs zero point eight and zero point four, weights zero point seven and negative zero point three, and bias negative zero point two. Net is zero point eight times zero point seven plus zero point four times negative zero point three minus zero point two, or zero point two four.",
"The hard activation returns one when net is at least zero, so this setting outputs one. The second feature subtracts because its weight is negative.",
"Changing one value isolates its role. Reducing w one weakens positive evidence; making bias more negative shifts every example toward zero. Predict the direction before moving the control, then inspect the score.",
"Crossing zero creates a discrete jump even when a slider moves smoothly. That is useful for threshold logic but problematic when we need a gradient saying how to improve a mistake."
]),
S("Fixed weights and bias implement AND and OR","🚪",[[".m12-source-media",0],[".m12-media-explain section code",0],[".m12-media-explain section p",0]],[
"For both gates, set input weights to one and use a hard threshold at net zero. AND uses bias negative two, so only one plus one minus two reaches zero; the other three pairs stay negative.",
"OR uses bias negative one, so either single one reaches zero and one-one is positive. Only zero-zero stays negative. The weights are unchanged; bias moves the threshold.",
"These McCulloch-Pitts units are engineered, not learned. Someone selected parameters to reproduce truth tables. We will run every pair so the equation—not a memorized slogan—shows why the gates differ."
]),
S("Run all four input pairs through one gate","🔘",[[".m12-logic-lab nav",0],[".m12-logic-lab section button",0],[".m12-logic-lab section button",1],[".m12-logic-lab code",0],[".m12-logic-lab output",0]],[
"For AND at zero-zero, net is negative two and output zero. With one input active, net is negative one, still zero. With both active, net reaches zero and output becomes one.",
"For OR, bias changes to negative one. Zero-zero produces negative one, either single one produces zero, and one-one produces positive one.",
"The invariant is weights one and one. The changed bias determines which truth-table corners cross the same threshold. A gate is a tiny geometric classifier over four points.",
"We will demonstrate all combinations. Watching the score update transfers better to larger feature vectors than chanting AND needs both."
]),
S("A predictive learner must discover weights from examples","🔍",[[".m12-cards article",0],[".m12-cards article",1],[".m12-cards article",2]],[
"A supervised classifier receives feature vectors such as dimensions, prices, or pixels. It also receives a desired class t for each training vector.",
"What it is not given is the correct weight vector. Learning adjusts parameters until predictions agree with labels under a declared criterion.",
"This separates design from learning. AND and OR used hand-selected weights; the perceptron infers a boundary from errors. Features, labels, and purpose still come from people and data collection, not the cosmic ether."
]),
S("The target column creates labeled training examples","🏷️",[[".m12-perceptron-table table",0],[".m12-perceptron-table tbody tr",0],[".m12-perceptron-table tbody tr",1],[".m12-perceptron-table section",0]],[
"Each row contains x one, x two, and target t. Small coordinate pairs have label plus one; large pairs have label negative one. The target makes this supervised classification rather than clustering.",
"At prediction time the target disappears. A new point supplies only features, and the sign of the learned score chooses a class. Keeping the target would be answer leakage wearing a fake mustache.",
"These ten points are visually separable into two groups. That matters because one perceptron learns only one linear boundary. If labels alternated around the plane, more epochs would not fix a representation mismatch.",
"Training rows are evidence, not the objective itself. We want weights that generalize to comparable unseen points, not a theatrical performance that recognizes only its rehearsed cases."
]),
S("Predict first and update only after a mistake","🛠️",[[".m12-procedure article",0],[".m12-procedure article",1],[".m12-procedure article",2],[".m12-procedure article",3]],[
"Step one scores the example with the weighted sum. Include a constant feature one if bias is stored as another weight. Step two predicts plus one when net meets threshold, otherwise negative one.",
"Step three computes t minus a. It is zero when correct, plus two when prediction was negative but target positive, and negative two for the opposite mistake.",
"Step four changes every weight by eta times t minus a times x sub i. Eta is learning rate. A positive correction moves this example's score upward; a negative correction moves it downward.",
"Correct predictions produce zero update. The perceptron is wonderfully lazy in a principled way: if the boundary classifies correctly, keep the weights and move on."
]),
S("One epoch processes every example; convergence may reuse data","🔁",[[".m12-loop b",0],[".m12-loop b",1],[".m12-loop b",2],[".m12-loop b",3],[".m12-loop p",0]],[
"Initialize weights, then process examples in a declared order. For each row, score, predict, compare, and update if mistaken. One visit is one training step.",
"One epoch is one complete pass through every example. It is not one update and not necessarily convergence. A late update can make an earlier case wrong again, so another epoch may be required.",
"For linearly separable data and positive learning rate, the convergence theorem guarantees a separating solution after finitely many mistakes. It does not promise identical weights for every order or initialization.",
"For nonseparable data, updates may cycle. A practical implementation declares a maximum epoch count instead of waiting for mathematical enlightenment to arrive by courier."
]),
S("The source example starts with W and learning rate","🧮",[[".m12-cards article",0],[".m12-cards article",1],[".m12-cards article",2]],[
"Start with W equal to zero point seven five, zero point five, negative zero point six, and learning rate eta zero point two. The third coordinate multiplies constant one, acting as bias.",
"Example one is one, one, one with target plus one. Score is zero point seven five plus zero point five minus zero point six, or zero point six five. Prediction is correct, so change is zero.",
"Example two is nine point four, six point four, one with target negative one. Its positive score is a mistake, so t minus a is negative two and the update is negative along each positive input.",
"Example three uses the newly changed weights. Perceptron learning is sequential. Recalculating every row from the original weights would be three parallel daydreams, not this algorithm."
]),
S("Compute score, prediction, correction, and next weights","🧾",[[".m12-perceptron-trace nav",0],[".m12-perceptron-trace section > div",0],[".m12-perceptron-trace ol li",0],[".m12-perceptron-trace ol li",1],[".m12-perceptron-trace ol li",2],[".m12-perceptron-trace ol li",3]],[
"Example one scores zero point six five and predicts plus one, matching target. Eta times zero times x gives zero delta, so W stays zero point seven five, zero point five, negative zero point six.",
"Example two scores nine point six five and predicts plus one while target is negative one. Eta times t minus a is zero point two times negative two, or negative zero point four.",
"Multiply by x: changes are negative three point seven six, negative two point five six, negative zero point four. Add them to obtain negative three point zero one, negative two point zero six, negative one.",
"Example three now scores negative twelve point eight five and predicts negative one for target plus one. Scalar correction positive zero point four times x gives one, zero point eight four, zero point four.",
"Adding yields negative two point zero one, negative one point two two, negative zero point six. Check signs before decimals: positive-target mistakes push scores up; negative-target mistakes push them down."
]),
S("The converged vector defines a separating line","📐",[[".m12-source-media",0],[".m12-media-explain section code",0],[".m12-media-explain section p",0]],[
"After repeated passes, the source reports weights approximately negative one point three, negative one point one, and ten point nine. The boundary is where score equals zero: negative one point three x one minus one point one x two plus ten point nine equals zero.",
"The first coefficients form a vector perpendicular to the line and control orientation. The constant shifts the line. Points on one side score positive; points on the other score negative.",
"Classification depends on sign. Score magnitude relates to distance under this scaling, but a vanilla perceptron does not automatically provide calibrated probability.",
"The line separates training groups. Evaluation still asks about unseen points, scaling, order sensitivity, and whether these features encode an appropriate decision."
]),
S("Move the line and inspect weight geometry","📏",[[".m12-boundary nav",0],[".m12-boundary svg",0],[".m12-boundary section div",0]],[
"The before-learning boundary comes from initial weights and cuts through the labeled geometry. Starting weights are only a hypothesis.",
"The converged line sits between small positive examples and large negative examples. Changing feature coefficients rotates its normal direction; changing bias translates it.",
"The too-high line has plausible orientation but wrong position. Linear is a shape family, not a guarantee of placement.",
"Each selected equation redraws the same points with a different line, connecting algebra to picture. The visual change is a consequence of weights, not decoration."
]),
S("One perceptron represents only a linear boundary","📎",[[".m12-cards article",0],[".m12-cards article",1]],[
"AND and OR are linearly separable: one straight boundary places positive truth-table corners on one side and negative corners on the other. The ten-point example shares that useful geometry.",
"XOR labels opposite corners alike. Any single line collecting one positive corner cannot collect the opposite one without also including a negative corner.",
"More data and more epochs cannot make one line bend. Optimization searches within the representation; it does not secretly replace the representation when homework becomes inconvenient."
]),
S("The XOR threshold inequalities contradict one another","🚫",[[".m12-source-media",0],[".m12-media-explain section code",0],[".m12-media-explain section code",1],[".m12-media-explain section code",2],[".m12-media-explain section code",3],[".m12-media-explain section p",0]],[
"Let XOR output zero for zero-zero and one-one, but one for one-zero and zero-one. With threshold theta, zero-zero being negative requires zero less than theta.",
"For one-zero positive, w one exceeds theta. For zero-one positive, w two exceeds theta. Adding gives w one plus w two greater than two theta.",
"Because theta is positive, that sum is also greater than theta. But one-one negative requires w one plus w two less than theta. The same sum cannot be both greater and less.",
"This is an impossibility proof, not a failed training run. No learning rate, initialization, order, or heroic number of epochs satisfies inconsistent inequalities with one threshold unit."
]),
S("Try a line, then explain why it fails","✂️",[[".m12-xor nav",0],[".xor-plot",0],[".m12-xor article",0]],[
"A vertical line separates left from right, but each side contains one zero and one one. It organizes x coordinate, not XOR labels.",
"A diagonal line can isolate one corner, but the positive corners are opposite. One half-plane cannot collect both without a negative corner.",
"The correct answer is no single line. The useful explanation is geometric: the positive set is disconnected under a linear cut. Saying nonlinear names the diagnosis without showing the X-ray.",
"A richer model combines multiple boundaries. Hidden units carve several regions and compose them, bridging to Lesson eighteen."
]),
S("Sigmoid replaces the hard jump with a smooth curve","🌊",[[".m12-source-media",0],[".m12-media-explain section code",0],[".m12-media-explain section li",0],[".m12-media-explain section li",1],[".m12-media-explain section li",2]],[
"The hard step changes abruptly at zero and has no useful derivative at the jump. Sigmoid maps net to one divided by one plus e raised to negative lambda net, producing values between zero and one.",
"At net zero sigmoid equals one half. Large positive inputs approach one; large negative inputs approach zero. Lambda controls steepness, with larger lambda becoming more step-like.",
"The curve is continuous and differentiable. Its slope is largest in the transition region and small in saturated tails, supplying directional information for gradient-based updates.",
"Smooth output is not automatically calibrated probability, and sigmoid in one unit does not solve XOR. Capacity comes from composing units; activation shape makes composition trainable."
]),
S("Activation choice changes range, smoothness, and gradient flow","📈",[[".m12-activation nav",0],[".m12-activation svg",0],[".m12-activation article",0]],[
"Step outputs zero or one with an abrupt threshold. It illustrates logic well, but the absent useful gradient is unsuitable for ordinary backpropagation through hidden layers.",
"Sigmoid is smooth and bounded. Its S-shape is interpretable, yet gradients become tiny for strongly positive or negative inputs, slowing deep learning.",
"ReLU returns zero for negative input and grows linearly for positive input. Its simple positive derivative helps gradient flow, though a unit stuck negative can receive zero gradient.",
"Activation changes range, smoothness, and learning behavior. It does not replace the weighted sum; it changes what happens after that sum."
]),
S("Classify the learner before choosing an algorithm","🧪",[[".m12-method-check nav",0],[".m12-method-check section",0],[".m12-method-check section button",0]],[
"Case one has labels, expression-tree evolution, and all data available. That is genetic programming: non-symbolic adaptive search, supervised feedback, and batch timing here.",
"Case two has no labels and asks for customer groups. K-means changes centroid geometry, uses unsupervised feedback, and is usually batch.",
"Case three is a labeled stream updated after mistakes. That is a perceptron: non-symbolic weights, supervised targets, and online-capable timing.",
"The axes narrow the design space but do not choose automatically. Geometry, error costs, interpretability, capacity, and deployment still matter. Classification is the map legend, not the journey."
]),
S("Explain what changed and what the representation can express","🎓",[[".m12-exit section",0],[".m12-exit ol li",0],[".m12-exit ol li",1],[".m12-exit ol li",2],[".m12-exit article",0]],[
"The exit ticket needs three precise sentences. First, classify perceptron learning as non-symbolic in representation, supervised in feedback, and online-capable in timing.",
"Second, explain one update: score, compare prediction with target, compute eta times t minus a times each input, and add the correction to current weights.",
"Third, explain XOR's need for richer representation. Opposite positive corners cannot be separated from opposite negatives by one line, and the threshold inequalities contradict.",
"Lesson eighteen combines units into layers. Multiple boundaries form nonlinear regions, while backpropagation uses differentiable activations to assign error credit. One neuron drew a line; next it gets colleagues."
]),
/* DATA */
];

const labels=["Frame","Define","Mechanism","Interpret","Example","Deepen"];
const slides=data.map((entry,slideIndex)=>({
  number:slideIndex+1,
  title:entry.title,
  segments:entry.segments.map((text,i)=>{
    const target=entry.targets[Math.min(i,entry.targets.length-1)];
    return {label:labels[i]||("Part "+(i+1)),text,pauseAfterSeconds:i===entry.segments.length-1?1.1:0,visualDesign:{focuses:[focus(text,target[0],target[1],labels[i]||"Focus")],kinetics:i===0?[popup(text,entry.popup[0],entry.popup[1])]:[]}};
  })
}));

function action(slide,label,text,selector,index=0,type="click",value=undefined,focusSelector=selector,focusIndex=index){
  slides[slide-1].segments.push({label,text,action:{type,selector,index,label,...(value===undefined?{}:{value})},pauseAfterSeconds:.6,visualDesign:{focuses:[focus(text,focusSelector,focusIndex,label)],kinetics:[]}});
}

const deepen={
3:"A useful test is to hold two axes fixed and change the third. A perceptron trained once on a stored file and one updated after every arriving label share representation and feedback but differ in timing. K-means and a supervised geometric classifier may both manipulate numeric geometry but differ in feedback. The axes stop superficial similarity from collapsing distinct mechanisms.",
6:"Fitness design defines evolutionary success. Mean absolute error treats a one-unit miss linearly; squared error punishes large misses more; a complexity penalty can discourage enormous trees that shave tiny training errors. Selection optimizes the declared score, not an abstract notion of elegance. If the objective rewards the wrong behavior, evolution can become creative at doing precisely the wrong thing.",
7:"Trace units as a consistency check. Input x has its original scale; squaring creates x squared; dividing by two produces the target scale. An expression x divided by two may match endpoints loosely but misses the curvature. Comparing residuals across all rows reveals that distinction more reliably than admiring one successful prediction.",
8:"The fit-predict interface separates training from inference. Fit inspects X and y and alters the estimator. Predict receives only new X and uses the learned program without target access. Evaluation compares predictions with withheld y. Keeping these roles separate prevents leakage and makes experiments reproducible across symbolic regression, trees, and numeric estimators.",
9:"Expand the equation with two features: net equals w one x one plus w two x two plus b. This is affine. Before activation, equal-score points lie on parallel lines, and the zero-score set is the decision boundary. The diagram is both a signal-aggregating circuit and a geometric machine assigning each point to a side.",
10:"Calculate initial contributions separately: the first gives positive zero point five six, the second negative zero point one two, and bias negative zero point two. Their sum is positive zero point two four. A contribution ledger prevents a common error—changing one weight and mentally changing every term as if one slider had union representation.",
11:"Write the AND inequalities. Zero-zero, one-zero, and zero-one must score below zero; one-one must score at least zero. Unit weights and bias negative two satisfy all four. For OR only zero-zero must stay below zero, so bias negative one works. Bias encodes how much combined evidence is required.",
12:"Notice the equality convention. Activation returns one when net is greater than or equal to zero, not strictly greater. That is why AND at one-one with net exactly zero turns on, and OR with a single active input turns on. Changing the comparison operator would require changing bias or would alter boundary cases.",
14:"Targets plus one and negative one match the activation coding. If a system uses zero and one, error magnitudes and the update must be interpreted consistently. Label encoding is part of the mathematical specification. Mixing encodings can make a correct formula look broken, like measuring one ingredient in cups and another in confused optimism.",
15:"Derive update direction. If target is plus one but prediction negative one, t minus a equals two. With positive eta, every positive feature increases its weight, raising this example's future score. For the opposite mistake the factor is negative two and score is pushed downward. The rule combines mistake sign with example coordinates.",
16:"Order matters because every update changes the start for the next calculation. Shuffling can change the path and final separating vector even when runs classify all training data. A reproducible experiment records initialization, learning rate, order, stopping rule, feature scaling, and seed. Convergence is a property; a particular vector is a historical path.",
17:"Estimate magnitude before calculating. Example two has much larger coordinates than example one, so its mistaken update should be large. Scalar correction negative zero point four times nine point four gives negative three point seven six, and times six point four gives negative two point five six. This mental bound catches decimal errors before they propagate.",
18:"Verify example three with updated weights. Negative three point zero one times two point five is negative seven point five two five; negative two point zero six times two point one is negative four point three two six; add bias negative one to get about negative twelve point eight five. Target is positive, so positive correction is required.",
19:"Solve the boundary for x two by moving terms and dividing by negative one point one. This gives a slope-intercept view. Coefficient ratio controls slope while the constant controls intercept. Multiplying every coefficient by the same positive constant leaves the zero set and classifications unchanged, so many numeric vectors can encode the same boundary.",
20:"Check a point by substitution. One, one gives negative one point three minus one point one plus ten point nine, a positive score. Nine, seven gives a strongly negative score. Graph and arithmetic must agree. If they do not, inspect axis direction, sign convention, or plotting coordinates before blaming the perceptron.",
21:"Linear separability belongs to labeled geometry in the chosen feature space. A task nonseparable in raw x one and x two can become separable after adding a transformed feature such as their product. The perceptron still draws one hyperplane, but representation engineering changed the space in which that plane operates.",
22:"The contradiction survives bias notation. Write score as w one x one plus w two x two plus b with threshold zero. XOR imposes incompatible signs on b, w one plus b, w two plus b, and w one plus w two plus b. Threshold and bias forms are algebraic translations of the same impossibility.",
23:"When testing a boundary, name the two sets it creates and list the labels on each side. Success requires every point of one class in one half-plane and every point of the other class in the other. Rotation changes which adjacent corners group together but cannot make opposite corners one connected half-plane.",
24:"Sigmoid derivative equals lambda times sigma times one minus sigma. Near output one half this is largest; near zero or one it shrinks. Backpropagation multiplies local derivatives across layers, so repeated small factors can cause vanishing gradients. Smoothness enables gradient learning, while saturation creates a separate optimization challenge.",
25:"Range matters. Sigmoid stays between zero and one, useful for a binary output interpreted carefully. ReLU is unbounded above and common in hidden layers. Step gives discrete decisions. Choose based on layer role, gradient behavior, stability, and the quantity the output represents; no activation is universally best."
};
for(const [number,text] of Object.entries(deepen)){
  const slide=slides[Number(number)-1];
  const target=data[Number(number)-1].targets.at(-1);
  slide.segments.push({label:"Deepen",text,pauseAfterSeconds:.8,visualDesign:{focuses:[focus(text,target[0],target[1],"Detailed explanation")],kinetics:[]}});
}

const worked={
6:"Imagine two parents: one tree encodes x times x and another encodes x divided by two. Crossover can exchange a subtree to produce x times x divided by two, while mutation might replace a constant. The child is not guaranteed better; evaluation decides. Variation proposes, fitness judges, selection changes which proposals are more likely to reproduce.",
10:"Now separate boundary movement from evidence movement. Adjusting x changes the current case's location while holding the model fixed. Adjusting w or bias changes the model while holding the case fixed. Both alter net, but they answer different questions: what if this input were different, versus what if the learned decision rule were different?",
12:"List AND in order: zero-zero gives negative two, zero-one negative one, one-zero negative one, one-one zero. OR gives negative one, zero, zero, one. The two tables differ only in the three middle score offsets created by bias. Writing the numbers makes the mechanism portable to any pair of binary inputs.",
15:"Bias update follows the same rule by using x bias equal to one. When an example needs a higher score, bias rises by eta times t minus a; when it needs a lower score, bias falls. Treating bias uniformly simplifies implementation and explains why the third coordinate in our vectors is always one.",
16:"Stopping after one error-free pass is common in demonstrations, but a robust implementation may require repeated stable passes or a tolerance. For separable data, zero training mistakes is attainable. For noisy or overlapping classes, monitor mistakes or validation performance and preserve the best checkpoint rather than interpreting endless motion as productive perseverance.",
17:"Feature scale controls update scale because x multiplies the correction. A feature near ten moves its weight roughly ten times more than a feature near one under the same mistake. Standardization can make optimization behavior more balanced, but it also changes how coefficients should be interpreted. Always record preprocessing with the model.",
18:"The update is vector addition, not replacement. For example two, start with old W and add delta component by component. For example three, start with example two's result and add the new delta. A spreadsheet-like table with columns for old weight, correction, and new weight is often the safest way to audit a hand calculation.",
19:"The learned vector is not unique. If several lines separate the clusters, perceptron may settle on different ones depending on order and initialization. It seeks any consistent separator, not necessarily the maximum-margin separator found by a support-vector machine. Convergence therefore answers can it separate, not did it find the widest safety corridor.",
20:"Bias has a geometric interpretation as location, but only relative to coefficient scale. Doubling weights and bias doubles every score while leaving the boundary unchanged. Therefore compare normalized parameters or compare the actual line, rather than declaring one model more confident simply because all its coefficients are numerically larger.",
22:"Another proof uses convexity. Each class separated by one line must lie in its own half-plane, and half-planes are convex. The line segment connecting XOR's two positive corners passes through the square's center, as does the segment connecting the negatives. Their convex hulls intersect, so no linear separator can place them in disjoint half-planes.",
24:"Lambda illustrates a tradeoff. Very large lambda resembles the hard step, but most inputs then fall into nearly flat saturated regions where gradients are tiny. Very small lambda keeps more points in transition but changes slowly. A smooth approximation is useful because of its derivative, not because curves are aesthetically more polite than corners.",
25:"For classification outputs, activation must be paired with an appropriate loss and interpretation. Sigmoid plus binary cross-entropy is a common pairing. Hidden ReLU units transform intermediate representations; they are not probabilities. A final threshold may still convert a smooth score to a class after training. Layer role determines what range is meaningful."
};
for(const [number,text] of Object.entries(worked)){
  const slide=slides[Number(number)-1];
  const target=data[Number(number)-1].targets.at(-1);
  slide.segments.push({label:"Worked detail",text,pauseAfterSeconds:.8,visualDesign:{focuses:[focus(text,target[0],target[1],"Worked detail")],kinetics:[]}});
}

for(const [i,name,text] of [
  [0,"Decision tree","A decision tree represents a prediction as a sequence of feature tests: each branch asks a question, and each leaf returns an answer. Labeled examples provide the feedback for choosing useful splits, and the full training set is usually revisited in batches while the tree is constructed."],
  [1,"Genetic programming","Genetic programming represents candidate solutions as executable expression trees. It scores those programs with a fitness function, then repeatedly selects, crosses, and mutates them. Feedback arrives after evaluating candidates on a batch of examples, so learning behaves more like evolutionary search than a direct formula update."],
  [2,"Perceptron","A perceptron represents a classifier with weights and a bias. It computes a linear score, compares the sign with a labeled target, and changes its parameters only when the prediction is wrong. Because one example can trigger one immediate update, the perceptron naturally supports online learning."],
  [3,"K-means","K-means represents each cluster by a centroid. It receives no class labels; instead, distance supplies the signal by assigning each point to its nearest centroid and then moving that centroid to the group mean. Those alternating batch steps continue until the assignments or centroids stabilize."],
  [4,"Reinforcement learning","Reinforcement learning represents behavior with a policy or value function. An agent acts, observes consequences, and receives delayed rewards rather than a correct label for every move. The timing is sequential: today’s action can change tomorrow’s state, so credit assignment must connect outcomes back to earlier decisions."]
]) action(3,"Choose "+name,text,'nav[aria-label="Machine-learning method examples"] button',i);

for(const [i,name,text] of [
  [0,"Represent","Genetic programming begins by representing candidate programs as expression trees assembled from variables, constants, and allowed functions. This is the search language: if an operation is absent from the building set, evolution cannot magically invent it."],
  [1,"Evaluate","Evaluation runs every candidate on all ten labeled pairs and converts aggregate prediction error into fitness. A lower training error earns reproductive preference, but it is not a diploma in universal truth; generalization still needs separate evidence."],
  [2,"Select","Selection now samples four candidates for a tournament and favors the fittest member as a parent. This creates useful pressure without globally sorting the entire population, like holding many small auditions instead of one enormous talent show."],
  [3,"Vary","Variation creates new programs. Crossover swaps subtrees with ninety percent probability, mutation makes smaller changes with five percent probability, and depth limits keep the trees from becoming botanical monsters that are impressive but useless."],
  [4,"Stop","Termination makes the computational budget explicit. Search ends when error reaches zero point zero zero one or after one hundred generations, whichever comes first; otherwise evolution could keep tinkering like a chef who refuses to serve dinner."]
]) action(6,name,text,'nav[aria-label="Genetic-programming cycle"] button',i);

for(const [i,text] of [
  [0,"Record one anchors the curve at the origin: when x is zero, the target is also zero. Any candidate expression that misses this point begins with avoidable error."],
  [3,"Record four shows x equal to zero point three and target equal to zero point zero four five. Squaring zero point three and dividing by two reproduces that target, giving us a clue about the hidden pattern."],
  [6,"Record seven moves farther along the curve. With x equal to zero point six, the target is zero point one eight, which again matches x squared over two and gives evolution a stronger test than the origin alone."],
  [9,"Record ten provides the far endpoint: x equals zero point nine and the target is zero point four zero five. A candidate that fits the early rows but misses this endpoint has learned a local coincidence, not the underlying relationship."]
]) action(7,"Select row "+(i+1),text,".m12-dataset-demo tbody tr",i);

for(const [i,name,text] of [
  [0,"Show data step","The data stage separates inputs from targets. X contains ten rows with one feature each, while y contains the ten matching regression values that supply supervised feedback."],
  [1,"Show model step","The model stage configures the evolutionary search: population size controls how many candidate programs compete, generations limit how long evolution runs, and tournament size controls selection pressure."],
  [2,"Show fit step","During fitting, the estimator keeps a familiar scikit-style interface, but its internal optimizer is evolving expression trees rather than solving directly for numeric coefficients. Familiar packaging can hide a very different learning mechanism."],
  [3,"Show test step","Testing asks the evolved program to predict values it did not optimize directly. That distinction matters because excellent training fitness can belong to an overgrown expression that generalizes about as well as a horoscope."]
]) action(8,name,text,'nav[aria-label="Scikit-compatible genetic-programming workflow"] button',i);

action(10,"Reduce the first weight","Weight one is now only zero point one, so the first feature contributes much less positive evidence. The total score crosses below zero, and the hard-threshold output switches off. A weight controls influence, not the feature value itself.",".m12-neuron-lab input",2,"range",0.1);
action(10,"Raise the bias","The bias now rises to zero point two. Because bias is a constant offset, it lifts the score for every input combination, bringing this example back across the threshold and switching the output on.",".m12-neuron-lab input",4,"range",0.2);
action(10,"Make the second weight positive","Weight two is now positive zero point six. The second feature changes from subtracting evidence to adding it, so the net score increases. The sign of a weight tells us the direction of influence.",".m12-neuron-lab input",3,"range",0.6);
action(10,"Lower the first input","The first input is now negative zero point five. With a positive first weight, that feature contributes a negative product and pulls the score downward. Here the evidence changed while the model stayed fixed.",".m12-neuron-lab input",0,"range",-0.5);

const gate=(label,text,index)=>action(12,label,text,".m12-logic-lab section button",index);
gate("Set x to zero","For the AND gate, x is now zero while y is also zero. The weighted sum plus bias is negative two, safely below threshold, so the output remains zero.",0);
gate("Set y to one","Only y is active now. Its contribution raises the AND score from negative two to negative one, but that is still below threshold, so one active input is not enough.",1);
gate("Set x to one","Both inputs are active now. Their two positive contributions exactly cancel the bias of negative two, net reaches zero, and the threshold produces one. That is the defining AND behavior.",0);
action(12,"Choose OR","For OR, the weights stay at one and one while the bias becomes negative one. With both inputs active, net equals one; more importantly, either single positive input will now be enough to reach the threshold.",".m12-logic-lab nav button",1);
gate("Set x to zero","With x zero and y one, the OR score is exactly zero. Reaching the threshold is sufficient, so y by itself produces output one.",0);
gate("Set y to zero","Now neither input is active. Only the bias remains, net is negative one, and OR correctly returns zero.",1);
gate("Set x to one","With x active by itself, its weight raises net from negative one to zero. The output becomes one, confirming the second single-input case for OR.",0);
gate("Return x to zero","The inputs return to zero-zero, restoring net negative one and output zero. Across the four cases, OR required at least one active input while AND required both.",0);

for(const [i,text] of [
  [0,"In example one, the score is positive zero point six five and the target is positive one. The sign is already correct, so the error term is zero and every component of delta remains zero."],
  [1,"Example two exposes a mistake: the positive score predicts one, but the target is negative one. The resulting negative correction moves the weights to negative three point zero one, negative two point zero six, and negative one."],
  [2,"Example three begins with those newly corrected weights, which now predict negative for a positive target. The positive correction moves every weight along the input vector, illustrating why training order changes the path through weight space."]
]) action(18,"Trace example "+(i+1),text,".m12-perceptron-trace nav button",i);

for(const [i,name,text] of [
  [0,"Show before-learning boundary","Before learning, the initial boundary cuts through the labeled geometry. Those starting weights are merely a hypothesis, so several points fall on the wrong side."],
  [1,"Show converged boundary","After convergence, the learned coefficients rotate and shift the boundary until the two training clusters occupy opposite sides. The perceptron has found a separator, though not necessarily the widest possible one."],
  [2,"Show overly high boundary","This boundary has a similar orientation but sits too high. The comparison isolates the bias: weights control the line's normal direction, while bias helps determine where the line is positioned."]
]) action(20,name,text,".m12-boundary nav button",i);

for(const [i,name,text] of [
  [0,"Try a vertical line","A vertical boundary groups points only by their x coordinate. Each side still contains one zero and one one, so that division cannot represent XOR."],
  [1,"Try a diagonal line","A diagonal boundary fails for the same geometric reason. The positive examples occupy opposite corners, so placing both in one half-plane inevitably brings along a negative corner."],
  [2,"Choose no single line","The correct conclusion is that no single line works. XOR is not linearly separable, which means one perceptron cannot express it regardless of how patiently we adjust its weights."]
]) action(23,name,text,".m12-xor nav button",i);

for(const [i,name,text] of [
  [0,"Show step","The step activation jumps abruptly at the threshold. It produces a crisp binary decision, but the flat regions and sudden jump provide no useful gradient for multilayer error correction."],
  [1,"Show sigmoid","The sigmoid replaces that jump with a smooth S-curve bounded between zero and one. Its slope is greatest near the transition and becomes tiny in the saturated tails."],
  [2,"Show ReLU","ReLU maps every negative input to zero and lets positive inputs grow linearly. Its simple positive-side derivative helps deep networks train, although units can become inactive when they remain on the zero side."]
]) action(25,name,text,".m12-activation nav button",i);

for(const [i,name,text] of [
  [0,"Open case one","Case one combines labeled targets with expression-tree evolution over a fixed dataset. Those clues identify supervised, batch genetic programming: labels define fitness, and a population is evaluated together."],
  [1,"Open case two","Case two provides no labels and asks the system to form groups around representative centers. That is unsupervised K-means, whose geometry comes from distances to centroids."],
  [2,"Open case three","Case three presents a labeled stream and changes parameters whenever a prediction is wrong. That is an online-capable perceptron, using immediate mistake-driven feedback."]
]) {
  action(26,name,text,".m12-method-check nav button",i);
  action(26,"Reveal case "+(i+1),"The revealed classification confirms the mechanism. Notice how representation tells us what the model stores, feedback tells us what counts as improvement, and timing tells us whether learning happens from a batch or a stream.",".m12-method-check section button",0);
}

const script={version:3,lesson:"17",meeting:"15",course:"CPSC 481: Introduction to Artificial Intelligence",title:"Lesson 17: Machine Learning Categories, Genetic Learning, and Perceptrons",route:"/lessons/17",voice:{name:"Microsoft Aria Neural",engineVoice:"en-US-AriaNeural",provider:"Microsoft neural text to speech",gender:"female",culture:"en-US",speakingRate:.94,edgeTtsRate:"-6%"},slides};
await writeFile(path.join(here,"lecture-script-aria.json"),JSON.stringify(script,null,2)+"\n","utf8");
const words=slides.flatMap(s=>s.segments).reduce((n,x)=>n+(x.text.match(/\S+/g)?.length??0),0);
const lines=["# Lesson 17 video lecture script","","- Route: /lessons/17","- Voice: Microsoft Aria Neural (en-US-AriaNeural)","- Speaking rate: 0.94x (-6%)","- Slides: "+slides.length,"- Narration words: "+words.toLocaleString("en-US"),"- Timing policy: weighted around two minutes per page on average; concise overview pages; expanded equations, algorithms, mechanisms, worked examples, and every interactive demonstration","- Captions: burned in at the bottom of the final video","- Pop-ups: large standalone images/icons, dynamically positioned to avoid the active focus",""];
for(const slide of slides){lines.push("## Slide "+String(slide.number).padStart(2,"0")+" - "+slide.title,"");for(const [i,segment] of slide.segments.entries()){lines.push("### "+(i+1)+". "+segment.label,"");if(segment.action)lines.push("**Instructor action before narration:** "+segment.action.label+".","");lines.push(segment.text,"");}}
await writeFile(path.join(here,"lesson-17-video-lecture-script-aria.md"),lines.join("\n").trim()+"\n","utf8");
console.log(JSON.stringify({slides:slides.length,segments:slides.flatMap(s=>s.segments).length,actions:slides.flatMap(s=>s.segments).filter(x=>x.action).length,focuses:slides.flatMap(s=>s.segments).reduce((n,x)=>n+x.visualDesign.focuses.length,0),popups:slides.length,words},null,2));
