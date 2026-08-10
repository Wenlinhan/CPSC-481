# Lesson 12 video lecture script

- Route: /lessons/12
- Voice: Microsoft Aria Neural (en-US-AriaNeural)
- Speaking rate: 0.94x (-6%)
- Slides: 25
- Narration words: 4,838
- Captions: burned in at the bottom of the final video

## Slide 01 - Conditional Independence, Bayesian Networks, and Naive Bayes

### 1. Concept

We are moving from raw probability tables to structured probability models. The central question is which variables still matter after the right evidence is known. Independence removes factors globally; conditional independence removes them only inside a stated context.

### 2. Mechanism

Bayesian networks turn local conditional-independence claims into a directed acyclic graph plus compact local tables. Inference then multiplies those local factors, sums hidden variables, and normalizes. Naive Bayes uses an especially strong version of this idea for fast classification.

### 3. Example and metaphor

Think of a crowded group chat. A rumor may connect everyone until the original announcement is revealed; after that, some messages add no new information. The conditioning variable is the announcement, not a magical delete button.

### 4. Boundary and transfer

By the end, you should be able to test independence, read a network factorization, trace exact enumeration, compute a Naive Bayes score, and defend every simplifying assumption. A graph is a model claim, not decorative arrow confetti.

## Slide 02 - Independence means learning Y does not change belief about X

### 1. Concept

Independence is a statement about a probability distribution, not a statement that two English words sound unrelated. Start with X independent of Y, written X perpendicular to Y. The first conditional form says P of x given y equals P of x whenever P of y is positive. In plain language, learning y does not move our belief about x. The positive-denominator condition matters because conditioning on an impossible event is undefined, not mysterious.

### 2. Mechanism

The second form reverses the roles: P of y given x equals P of y. The third form removes conditioning entirely: P of x and y equals P of x times P of y for every pair x comma y. To see the equivalence, substitute the product rule P of x and y equals P of x given y times P of y. If the conditional is unchanged, replace P of x given y with P of x, and the factorized joint appears. Divide the factorized joint by P of y and the conditional form returns.

### 3. Example and metaphor

For a finite table, independence is an all-cells claim. Imagine a quality inspector checking a carton of eggs: one cracked egg disproves 'all intact,' while one intact egg proves almost nothing. Likewise, a single cell where P of x comma y differs from P of x times P of y disproves independence. Establishing independence requires the equality for every assignment, subject to ordinary rounding tolerance when probabilities are estimated.

### 4. Boundary and transfer

Exact independence is often rare in empirical data, so distinguish three positions: mathematically independent in the specified distribution, approximately independent for a decision tolerance, or simply assumed independent for tractability. A professional report states which position it takes and what evidence could overturn it. The symbol is compact; the burden of justification is not.

## Slide 03 - Factorization replaces one joint table with smaller distributions

### 1. Concept

Factorization is a compression rule. Without assumptions, a joint distribution over n binary variables assigns probability mass to two to the n complete assignments. With mutual independence, the joint becomes the product over i of P of X sub i, so a complete row can be reconstructed by multiplying one local probability from each variable.

### 2. Mechanism

The storage comparison on screen is two to the n joint rows versus two n marginal entries. For twenty binary variables, that is one million forty-eight thousand five hundred seventy-six joint rows versus forty marginal entries. That dramatic reduction is why independence is computationally tempting. It is also why an unjustified independence assumption can be dramatically wrong: one small sentence controls an enormous number of reconstructed cells.

### 3. Example and metaphor

Think of a restaurant menu. Listing every possible meal combination grows explosively. If drink, side, and dessert choices are independent, we store three short menus and combine them. But if the soup always comes with bread, multiplying separate menus invents orders the kitchen never serves. Factorization saves representation by asserting regularity; it does not manufacture truth.

### 4. Boundary and transfer

The universal quantifier is the guardrail: every assignment must satisfy the product equality. Before accepting the compressed representation, test the assumption, measure approximation error, and ask whether mistakes affect the downstream decision. Saving memory is useful; saving memory by forgetting dependence is less charming.

## Slide 04 - One mismatched cell disproves independence

### 1. Concept

We now test three tables, not three vibes. The rightmost table is the product model P of T times P of W. From the displayed marginals, P of hot is point five, P of cold is point five, P of sun is point six, and P of rain is point four. Multiplication predicts four cells: hot-sun point three, hot-rain point two, cold-sun point three, and cold-rain point two.

### 2. Mechanism

Compare P one with that product table. Its hot-sun cell is point four, but independence predicts point three because point five times point six equals point three. That one mismatch is enough: P one does not factorize. We could stop the disproof there, though the remaining cells also differ. One counterexample breaks a universal claim with the efficiency of a single banana peel in a dignified hallway.

### 3. Example and metaphor

Now compare P two cell by cell. Hot-sun is point three, hot-rain point two, cold-sun point three, and cold-rain point two. All four entries match P of T times P of W. The rows and columns also reproduce the stated marginals. Therefore P two factorizes, while P one does not. This conclusion comes from equality of distributions, not from P two merely looking more symmetric.

### 4. Boundary and transfer

Make the logical asymmetry explicit before revealing the answer: one mismatch disproves independence; every cell match is needed to establish it. Then reveal the analysis and connect the arithmetic to the formal definition from the previous slides. The example is the definition running on actual numbers.

### 5. Reveal table analysis

**Instructor action before narration:** Reveal independence-table analysis.

Reveal the analysis. P two factorizes because all four cells match the marginal products. P one fails immediately at hot and sun: point four is not point three. Keep the asymmetric rule visible—one counterexample disproves, while every cell is needed to establish independence.

## Slide 05 - Independent coin flips turn an exponential joint into repeated local factors

### 1. Concept

For three fair independent flips, the sequence heads, tails, heads has probability one half cubed, or point one two five. Fairness supplies the marginals; independence is the additional permission to multiply them.

### 2. Mechanism

For n flips, the sequence probability factorizes into a product of n local terms. We avoid listing two to the n complete sequences, even though all those outcomes still exist. The model stores the repeatable mechanism.

### 3. Example and metaphor

A fair coin can still be dependent over time. Imagine a device that chooses the first flip fairly and then copies it. Every individual flip may look balanced, but sequences are highly constrained. Fair marginals do not guarantee independent trials.

### 4. Boundary and transfer

When someone multiplies probabilities, ask what independence statement licenses the multiplication. The multiplication sign often hides the most important modeling decision on the page.

## Slide 06 - A shared cause can explain why two observations move together

### 1. Concept

Smoke and an alarm may be associated because both respond to fire. Before we observe fire, smoke changes our belief about the alarm because it provides indirect evidence about their shared cause.

### 2. Mechanism

After the fire state is known, a simplified model may say smoke adds no further information about the alarm. Fire screens the two effects off. That is conditional independence, not unconditional independence.

### 3. Example and metaphor

Picture two students arriving late because the same bus broke down. Their arrival times move together until the bus status is known. Once the shared cause is fixed, one student's delay may tell us nothing additional about the other.

### 4. Boundary and transfer

The word may is essential. Real alarms can respond directly to smoke, and hidden sensor faults can create extra dependence. Conditional independence follows from a proposed model and must be tested.

## Slide 07 - Condition on Z, then test factorization inside every Z stratum

### 1. Concept

Conditional independence adds a context. X independent of Y given Z means that inside each fixed Z stratum, the conditional joint factorizes: P of x comma y given z equals P of x given z times P of y given z. The vertical bar means 'given,' so Z is not decoration; it changes the distribution being tested.

### 2. Mechanism

The two equivalent conditional forms say P of x given y comma z equals P of x given z, and symmetrically P of y given x comma z equals P of y given z. Once z is known, learning the other variable adds no further information. Derive the first form by dividing the conditional joint factorization by P of y given z whenever that denominator is positive.

### 3. Example and metaphor

Operationally, partition or model the data by Z, then test the relationship inside every valid stratum. A pooled association can disappear after conditioning because Z explains it. This is the statistical version of discovering that two coworkers always arrive together because they ride the same bus; after bus status is known, one arrival may add nothing about the other.

### 4. Boundary and transfer

Read the quantifier carefully: the equality must hold for all relevant x, y, and z values. Conditional independence is neither 'sometimes unrelated' nor a license to choose only the convenient stratum. These local claims are the representational engine behind Bayesian networks and the class-conditional shortcut in Naive Bayes.

## Slide 08 - Cavity can screen Toothache from Catch

### 1. Concept

Let Cavity be the conditioning variable, Toothache one effect, and Catch the event that a dental probe catches in the tooth. Toothache and Catch may be associated before cavity status is known because both provide evidence about the same underlying condition.

### 2. Mechanism

The first equation says P of Catch given Toothache and Cavity equals P of Catch given Cavity. Once cavity status is fixed, Toothache adds no information about Catch. The second equation is the symmetric statement with Toothache and Catch exchanged. These are not two different assumptions; with valid denominators they describe the same conditional independence relation.

### 3. Example and metaphor

The third equation is the factorized conditional joint: P of Toothache comma Catch given Cavity equals P of Toothache given Cavity times P of Catch given Cavity. Apply the conditional product rule, then replace P of Catch given Toothache comma Cavity with P of Catch given Cavity. The algebra makes the screening-off claim explicit.

### 4. Boundary and transfer

The equality must be considered for cavity present and cavity absent. Real dental data can violate it through inflammation, probe technique, or an unmodeled condition affecting both observations. The mathematics tells us what the model asserts; clinical evidence tells us whether the assertion survives contact with teeth, which are famously uncooperative data structures.

## Slide 09 - Rain can screen Traffic from Umbrella

### 1. Concept

Traffic and umbrella use can move together because rain influences both. Before rain is known, an umbrella is evidence about weather and therefore indirectly about traffic.

### 2. Mechanism

In the simple fork graph, Raining points to Traffic and Umbrella. Conditioning on the common cause blocks that path, yielding Traffic independent of Umbrella given Raining.

### 3. Example and metaphor

The arrow picture is a compressed set of probability claims. It does not mean every umbrella causes traffic or every traffic jam causes umbrellas. The common parent explains the observed association.

### 4. Boundary and transfer

Reveal the defensible claim only after predicting it. Then identify possible violations such as a stadium event that simultaneously changes traffic and umbrella use even within the same rain condition.

### 5. Reveal rain claim

**Instructor action before narration:** Reveal Rain common-cause claim.

Reveal the defensible rain claim. Traffic and Umbrella may be associated before conditioning because both carry evidence about Rain. In the proposed fork model, fixing Rain blocks the path. This remains a claim to test against events, geography, and behavior outside the simple graph.

## Slide 10 - Fire can screen Smoke from Alarm—but only under a simplified model

### 1. Concept

The same fork pattern uses Fire as a common cause of Smoke and Alarm. In the simplified graph, observing fire blocks the only path connecting the two effects.

### 2. Mechanism

Conditional independence therefore reads Smoke independent of Alarm given Fire. Notice that this is a property of the represented distribution, not a conclusion extracted from the English nouns.

### 3. Example and metaphor

A real smoke detector often has a direct smoke-to-alarm mechanism. Add that edge and the screening-off claim changes. A latent sensor fault could also couple smoke readings and alarm behavior.

### 4. Boundary and transfer

Use the reveal to state the simplified claim, then critique it. Good probabilistic modeling alternates between exploiting a structure and asking which real mechanisms the structure omitted.

### 5. Reveal fire claim

**Instructor action before narration:** Reveal Fire common-cause claim.

Reveal the simplified fire claim. Smoke is independent of Alarm given Fire only in a model with no direct smoke-to-alarm mechanism and no hidden common fault. The reveal demonstrates the formal graph; our critique demonstrates responsible use of it.

## Slide 11 - Product and chain rules turn independence claims into factorization

### 1. Concept

Conditional probability is a definition: P of x given y equals P of x comma y divided by P of y. Rearranging gives the product rule, P of x comma y equals P of x given y times P of y. These are identities whenever the denominator exists; no independence assumption has entered yet.

### 2. Mechanism

The chain rule repeatedly applies the product rule. For an ordered list x one through x n, multiply P of x i conditioned on all earlier variables. Any joint distribution can be written this way in any order, although different orders produce different-looking factors.

### 3. Example and metaphor

Independence is the simplifying assumption. If X is independent of Y, P of x given y becomes P of x, so the product rule shortens to P of x times P of y. Conditional independence similarly removes selected variables from a conditioning set. Think of the chain rule as a guaranteed full packing list; independence is permission to cross out items proven irrelevant.

### 4. Boundary and transfer

When reading a derivation, label each step identity, arithmetic, or assumption. The most dangerous line is often the innocent-looking one where a conditioning variable disappears. If no independence claim justifies that disappearance, the algebra has performed a magic trick and hidden the rabbit in the model assumptions.

## Slide 12 - A Bayesian network is a DAG plus one local conditional distribution per node

### 1. Concept

A Bayesian network is a directed acyclic graph, or DAG, plus one local probability distribution per node. Each node is a random variable with a defined domain. Each directed edge says that the child distribution is represented as depending locally on that parent. Acyclic means no directed path can loop back to where it started, so the factorization has a consistent ordering.

### 2. Mechanism

Burglary is a root variable, so it has a prior P of B. Earthquake is another root with prior P of E. Both point to Alarm, giving the conditional table P of A given B comma E. Alarm points to JohnCalls and MaryCalls, producing P of J given A and P of M given A. The graph is a compact index of which conditioning variables each local table needs.

### 3. Example and metaphor

The thief who appears for Burglary is a memory cue, not a claim that cartoon criminals follow probability theory. The screen shake at Earthquake marks the second root cause. Alarm is their shared effect, while the two calls are downstream observations. This five-node story will let us compute a posterior without storing all thirty-two binary assignments as an undifferentiated table.

### 4. Boundary and transfer

An arrow does not automatically prove causation. A Bayesian network always defines probabilistic factorization; causal interpretation requires stronger assumptions about mechanisms and interventions. Read each node operationally: name its domain, parents, and local table. If those are missing, the arrows are decorative spaghetti with excellent posture.

## Slide 13 - Local CPTs multiply into the complete joint distribution

### 1. Concept

The complete joint has one local factor for each node. Burglary contributes P of B and Earthquake contributes P of E because roots have no parents. Alarm contributes P of A given B comma E. JohnCalls contributes P of J given A, and MaryCalls contributes P of M given A.

### 2. Mechanism

Multiplying those five terms gives P of B comma E comma A comma J comma M. Every variable appears once as the left-hand variable of a local factor, and every factor conditions only on the node's parents. This is not an arbitrary recipe; it is the Bayesian-network semantics.

### 3. Example and metaphor

The representation saves parameters. A full five-variable binary joint has thirty-two rows and thirty-one free parameters after normalization. The local tables need one parameter for each root, four for Alarm's parent configurations, and two each for JohnCalls and MaryCalls: nine free parameters total in this binary example.

### 4. Boundary and transfer

Walk through every control. For each selected node, identify its parents and say why its factor has that conditioning set. Then rebuild the product from memory. A missing factor loses probability mass; a duplicated factor counts evidence twice; an extra parent throws away the very compactness the graph was designed to provide.

### 5. Earthquake factor

**Instructor action before narration:** Earthquake factor.

Select E. Earthquake is a root, so its local factor is the prior P of E.

### 6. Alarm factor

**Instructor action before narration:** Alarm factor.

Select A. Alarm has Burglary and Earthquake as parents, so its table is P of A given B and E.

### 7. John factor

**Instructor action before narration:** John factor.

Select J. JohnCalls has only Alarm as a parent, giving P of J given A.

### 8. Mary factor

**Instructor action before narration:** Mary factor.

Select M. MaryCalls likewise contributes P of M given A. We have now visited every local factor in the joint.

## Slide 14 - Blocked and opened paths determine which evidence remains relevant

### 1. Concept

Graphical independence depends on path structure and the conditioning set. A common cause is blocked when the cause is observed. A collider behaves oppositely: it blocks a path until the collider or one of its descendants is observed.

### 2. Mechanism

In the burglary network, JohnCalls and MaryCalls become independent given Alarm. Burglary and Earthquake are independent before Alarm is observed because Alarm is a collider. Observing Alarm opens the path and creates explaining away.

### 3. Example and metaphor

If the alarm sounds and we learn there was an earthquake, burglary becomes less necessary as an explanation. Competing causes become dependent once their shared effect is known.

### 4. Boundary and transfer

Cycle through all three cases and say the conditioning set every time. The phrase independent in the graph is incomplete unless we know which nodes are observed.

### 5. Collider closed

**Instructor action before narration:** Collider closed.

Choose Collider closed. Burglary and Earthquake are independent before Alarm or its descendants are observed because the unobserved collider blocks their path.

### 6. Explaining away

**Instructor action before narration:** Explaining away.

Choose Explaining away. Observing Alarm opens the collider path, so evidence for Earthquake changes belief in Burglary. Competing causes become dependent through their observed effect.

### 7. Return to common cause

**Instructor action before narration:** Return to common cause.

Return to Common cause. Conditioning on Alarm blocks the fork from Alarm to the two callers, making JohnCalls independent of MaryCalls given Alarm in this network.

## Slide 15 - Enumeration sums hidden assignments and normalizes the query distribution

### 1. Concept

Exact enumeration separates variables into three roles. The query is what we want to know, evidence is fixed by observation, and hidden variables are neither queried nor observed. For P of Burglary given JohnCalls and MaryCalls, B is the query, j and m are evidence, and Earthquake plus Alarm are hidden.

### 2. Mechanism

For each query value, enumerate every assignment of the hidden variables. With two hidden binary variables, that means four products for B true and four more for B false. Each product uses the network factorization P of B, P of E, P of A given B comma E, P of j given A, and P of m given A.

### 3. Example and metaphor

The formula P of X given e equals alpha times the sum over hidden y of the product of local factors compresses that procedure. Sigma means add compatible hidden worlds. Pi means multiply one local probability per node. Alpha is the normalization constant that makes the query values sum to one.

### 4. Boundary and transfer

Enumeration is conceptually transparent but repeats work exponentially. Variable elimination improves the mechanics by multiplying and summing factors in a useful order, caching intermediate results instead of recomputing every storyline. Before arithmetic, always name query, evidence, hidden variables, and the number of hidden assignments.

## Slide 16 - Two calls raise burglary belief, but the low prior still matters

### 1. Concept

The canonical burglary network uses P of B equal point zero zero one and P of E equal point zero zero two. Alarm is very likely when burglary or earthquake occurs, but false alarms remain possible. John and Mary are likely to call when Alarm is true, yet each can also call without an alarm. Two calls are strong evidence, not a notarized confession from the universe.

### 2. Mechanism

For B true, sum four terms over e and a. Each term multiplies P of b, P of e, P of a given b comma e, P of j given a, and P of m given a. The resulting unnormalized mass is zero point zero zero zero five nine two two four three.

### 3. Example and metaphor

Repeat for B false. The unnormalized no-burglary mass is zero point zero zero one four nine one eight five eight, which is larger because the no-burglary prior is enormous even though the calls favor an alarm. Evidence updates a prior; it does not erase it.

### 4. Boundary and transfer

Normalize the two masses by their sum, zero point zero zero two zero eight four one zero zero. The posterior P of burglary given both calls is about zero point two eight four. Belief jumps from point one percent to twenty-eight point four percent—a huge update, but still far from certainty. Walk every Next step and connect the displayed number to the operation that produced it.

### 5. Expand factors

**Instructor action before narration:** Expand factors.

Click Next to expand the five local network factors and the two hidden sums.

### 6. Enumerate burglary true

**Instructor action before narration:** Enumerate burglary true.

Click Next to sum the four hidden assignments compatible with burglary and both calls.

### 7. Enumerate burglary false

**Instructor action before narration:** Enumerate burglary false.

Click Next to compute the larger no-burglary mass. Evidence raises burglary belief without erasing alternative explanations.

### 8. Normalize posterior

**Instructor action before narration:** Normalize posterior.

Click Next to normalize both masses. The burglary posterior is about point two eight four, a large update from the prior but far from certainty.

## Slide 17 - Given the class, treat feature likelihoods as independent factors

### 1. Concept

Naive Bayes starts with the class C and features F one through F n. The exact conditional joint could use a chain rule with growing conditioning sets. The naive approximation replaces it with the product over i of P of F i given C, asserting that features are conditionally independent once the class is fixed.

### 2. Mechanism

This is not marginal independence. Size, color, and shape can be strongly associated across all fruit because apples, grapes, and bananas occur in different proportions. The model says that within a fixed class, the remaining dependencies are small enough to ignore for the intended prediction.

### 3. Example and metaphor

The classification score is P of C times the product of feature likelihoods. The evidence denominator P of the observed features is identical for every class, so it can be omitted when computing an argmax. That is why unnormalized scores are sufficient to choose a label.

### 4. Boundary and transfer

The approximation can work surprisingly well, but correlated features may double-count evidence. If 'contains the word free' and 'contains the phrase free money' are nearly duplicates, multiplying both likelihoods can make spam confidence shout through a megaphone. Inspect dependence and calibration, not only accuracy.

## Slide 18 - The class prior and feature likelihoods produce a MAP decision

### 1. Concept

The decision rule chooses the class c hat that maximizes P of C times the product of P of evidence item i given C. Because the class prior P of C is included, this is maximum a posteriori, or MAP, classification. Maximum likelihood would compare only the feature likelihood product.

### 2. Mechanism

The prior acts like a starting-line advantage. A common class begins with more probability mass; a rare class can still win if its features are much more diagnostic. Priors can come from class frequencies or justified domain knowledge, but they should match the deployment population rather than yesterday's convenient spreadsheet.

### 3. Example and metaphor

Multiplying many probabilities can underflow to zero in floating-point arithmetic. Software therefore computes log scores: log P of C plus the sum over i of log P of e i given C. Logarithms turn products into sums while preserving the maximizing class.

### 4. Boundary and transfer

Unseen feature values can also create zeros, so use an appropriate smoothing method such as Laplace or additive smoothing. Report the likelihood model, prior, smoothing, and evaluation data. 'We used Naive Bayes' is a family name, not a reproducible model specification.

## Slide 19 - Training estimates local probabilities; testing compares class scores

### 1. Concept

Training counts classes and feature values within each class, or estimates distribution parameters for a chosen variant. Testing plugs a new example into those learned local probabilities and compares posterior scores.

### 2. Mechanism

The statistics depend on the variant. Gaussian Naive Bayes estimates means and variances; multinomial models estimate token counts; Bernoulli models estimate binary presence; categorical models estimate value frequencies.

### 3. Example and metaphor

A model labeled Naive Bayes is a family name, not a complete specification. Asking which likelihood model was used is like asking what kind of vehicle arrived after hearing only that it was transportation.

### 4. Boundary and transfer

Use held-out data to compare accuracy, calibration, and error types. Training likelihood is evidence about fit to observed data, not a guarantee of reliable future decisions.

## Slide 20 - A probabilistic finite-state acceptor models alternative phone paths

### 1. Concept

The phone graph represents sequential alternatives and transition probabilities. It is useful probabilistic structure, but it is not itself evidence of a Naive Bayes feature factorization.

### 2. Mechanism

Each state summarizes position in a phone sequence; arcs carry possible observations or transitions. Decoding searches paths whose local probabilities combine into a sequence score.

### 3. Example and metaphor

This is closer to route planning through a pronunciation network than to placing independent feature cards under a class. The graph remembers order, which ordinary bag-of-features Naive Bayes discards.

### 4. Boundary and transfer

Name the model you actually have. Probabilistic does not mean Naive Bayes, and a graph does not automatically mean Bayesian network. Representation and factorization determine the category.

## Slide 21 - A common word can outrank a perfect phone match

### 1. Concept

We score candidate words using Bayes: P of word given the phone evidence ni is proportional to P of ni given word times P of word. The first factor is a phone or acoustic likelihood; the second is a corpus prior. The omitted evidence denominator is shared across candidates and therefore does not affect the ranking.

### 2. Mechanism

Read the prior table. Knee appears sixty-one times, giving about point zero zero zero zero two four. Need appears one thousand four hundred seventeen times, and new two thousand six hundred twenty-five times. The word the is extremely common at point zero four six, but a high prior cannot rescue a zero likelihood for the observed phone sequence.

### 3. Example and metaphor

A perfect local phone match can lose to a more frequent candidate with a slightly weaker match. This is the same prior-versus-likelihood negotiation used in medical diagnosis and spam filtering. The prior whispers 'usually'; the likelihood replies 'this evidence.' The posterior score decides which voice is louder.

### 4. Boundary and transfer

Predict before seeing the product table. Then state which column is prior, which will be likelihood, and why their product is only an unnormalized posterior. Also ask whether the corpus matches the speaker and domain; a courtroom, a kitchen, and a gaming stream do not share identical word priors.

## Slide 22 - Phone-only decoding selects “new”; word context favors “need”

### 1. Concept

Multiply each phone likelihood by its word prior. New scores point three six times point zero zero one, giving point zero zero zero three six, the largest displayed product. Neat yields about point zero zero zero zero six eight, need about point zero zero zero zero six two, knee point zero zero zero zero two four, and the receives zero because its phone likelihood is zero.

### 2. Mechanism

The local winner is therefore new. Notice that knee has a perfect phone likelihood of one, but its tiny prior makes its product smaller. A perfect match to a rare candidate need not beat a good match to a more common candidate.

### 3. Example and metaphor

Now add the preceding word I. 'I need' is plausible; 'I new' is not standard English. The displayed calculation omits that contextual factor, so a sequence or language model can rerank the candidates. Local evidence proposes; context disposes. Even Sherlock Holmes would ask what came before the suspicious syllable.

### 4. Boundary and transfer

The repair is representational: include contextual variables or use a sequence model. Do not merely tune the same phone-only table harder. Track every factor and every omitted dependency, then test on held-out speech from the intended domain. The best isolated word score need not produce the best sentence.

## Slide 23 - Naive Bayes is efficient, but the variant and dependencies matter

### 1. Concept

Naive Bayes trains quickly, predicts quickly, and works with discrete, continuous, or streaming data through different likelihood variants. Its small local statistics are often strong baselines.

### 2. Mechanism

The main weakness is dependence among features after conditioning on class. Correlated or duplicated features can multiply similar evidence several times, producing overconfident scores even when accuracy remains reasonable.

### 3. Example and metaphor

Irrelevant features are not magically harmless. Weak features may wash out, but noisy estimation, duplication, and distribution shift can still hurt. Simplicity is a benefit, not an immunity certificate.

### 4. Boundary and transfer

Compare variants, use smoothing, inspect calibration, and consider richer networks or sequence models when relationships matter. The right question is not whether Naive Bayes is naive; it is whether its assumptions are useful enough here.

## Slide 24 - A useful shortcut must state exactly what it assumes

### 1. Concept

The audit presents four tempting claims about Naive Bayes. Each is close enough to sound plausible and wrong enough to damage a report. Good model literacy means repairing the exact statement.

### 2. Mechanism

The assumption is conditional, not marginal, independence. Including a prior yields MAP. Parameter estimates depend on the variant. Irrelevant or duplicated features can hurt through noise and repeated evidence.

### 3. Example and metaphor

Treat the audit like code review for equations. A claim can run without throwing a syntax error and still produce the wrong scientific result. Precise terminology is part of model correctness.

### 4. Boundary and transfer

Cycle through all four claims. For each, state the correction, identify evidence needed to test it, and name when a Bayesian network or richer sequence model would be preferable.

### 5. Audit decision

**Instructor action before narration:** Audit decision.

Choose Decision. With a class prior included, the classifier is MAP; maximum likelihood omits the prior.

### 6. Audit parameters

**Instructor action before narration:** Audit parameters.

Choose Parameters. Only Gaussian Naive Bayes estimates means and variances; other variants learn counts or categorical probabilities.

### 7. Audit robustness

**Instructor action before narration:** Audit robustness.

Choose Robustness. Correlated or duplicated features can repeat evidence and distort confidence, so irrelevant does not mean harmless.

### 8. Return to assumption

**Instructor action before narration:** Return to assumption.

Return to Assumption. Features are conditionally independent given the class, not marginally independent across the full population.

## Slide 25 - Factor, query, classify—and defend every independence claim

### 1. Concept

The lesson's through-line is structured simplification. Independence and conditional independence remove unnecessary dependencies; Bayesian networks encode local structure; inference recombines factors; Naive Bayes trades realism for efficient classification.

### 2. Mechanism

A complete explanation names variables and domains, the factorization, observed evidence, hidden variables, the query, and the assumption that licenses each simplification. Leaving out the conditioning set is leaving out the model.

### 3. Example and metaphor

The practical habit is assumption accounting. Every time a product becomes shorter, write down why. Every time a graph omits an edge, ask what independence that omission asserts. Every time a classifier is confident, inspect repeated evidence.

### 4. Boundary and transfer

Exit with four abilities: test a table, read a DAG, trace enumeration, and audit a classifier. If you can defend the structure instead of merely reciting a formula, you can transfer this lesson to much larger probabilistic systems.
