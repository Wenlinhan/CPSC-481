# Lesson 13 video lecture script

- Route: /lessons/13
- Voice: Microsoft Aria Neural (en-US-AriaNeural)
- Speaking rate: 0.94x (-6%)
- Slides: 25
- Narration words: 5,940
- Captions: burned in at the bottom of the final video

## Slide 01 - Reasoning under uncertainty starts with a probability model

### 1. Core concept

Lesson thirteen begins where certainty ends. An AI system rarely receives a complete, perfectly accurate world state. A medical agent sees symptoms, a robot receives noisy sensors, and a weather system sees measurements rather than tomorrow itself. Probability gives us a disciplined language for representing what could be true and how strongly the available evidence supports each possibility.

### 2. Worked meaning

The path on this slide has four jobs. Represent uncertain variables and their possible values. Compute joint, marginal, and conditional probabilities. Update beliefs with Bayes' rule. Then interpret the result without quietly converting association into causation. Think of the probability model as a bridge: evidence enters on one side, and a distribution over plausible hidden states leaves on the other.

### 3. Boundary and transfer

A probability of point seven is not a tiny oracle shouting seventy percent certainty. It is a claim made inside a model, using assumptions and evidence that can be questioned. If new evidence arrives, the belief should move. Our recurring audit will be: what is observed, what is hidden, what model connects them, and what exact calculation justifies the update?

### 4. Detailed transfer

Here is the practical transfer. A spam filter, navigation agent, and medical screener may all produce probabilities, but the variables and consequences differ. The numerical machinery does not decide what counts as evidence or which errors matter. Before trusting a posterior, inspect data collection, domain definitions, and calibration. A model whose seventy-percent predictions are correct only forty percent of the time has not discovered a bold new interpretation of arithmetic; it is miscalibrated.

## Slide 02 - Evidence is observed; target variables are hidden; a model connects them

### 1. Core concept

Separate three roles. Evidence variables are observed now: a sensor reading, a symptom, or a report of rain. Target variables are the hidden quantities we want to infer: an object's location, a disease state, or tomorrow's weather. The model describes how those known and unknown quantities relate. Without the model, evidence is merely a fact looking for a job.

### 2. Worked meaning

For a self-driving car, a camera patch and lidar return are evidence. The hidden target might be whether a pedestrian occupies the lane. A model connects visual patterns and distances to that hidden state, producing a belief distribution rather than a single unqualified answer. The four bars illustrate that several states may retain probability at the same time.

### 3. Boundary and transfer

The arrow is inferential, not magical. If the model omits glare, unusual clothing, or a broken sensor, its posterior can be confidently wrong. Probability helps us expose uncertainty; it does not disinfect bad assumptions. Always name the evidence, target, and relationship separately, because mixing them is how a plausible story sneaks into the lab wearing a fake data badge.

### 4. Detailed transfer

Try the three-role test on voice recognition. The sound waveform is evidence, the intended word is hidden, and an acoustic-language model connects them. Several word sequences may remain plausible. Context can shift their probabilities without changing the recorded sound. This is why a system can revise an earlier transcription after hearing the end of a sentence: later evidence changes belief over the hidden sequence.

## Slide 03 - Random variables name uncertain aspects; distributions assign probability to their values

### 1. Core concept

A random variable is a function that names an uncertain aspect of the world and maps outcomes to values. R might ask whether it rains and take true or false. T might take hot or cold. Drive time D is continuous over nonnegative values, while robot location L ranges over coordinates. The variable is the question; one value is a possible answer.

### 2. Worked meaning

A domain lists legal values. A probability distribution assigns mass or density across that domain. The weather table places point six on sun, point one on rain, point three on fog, and effectively zero on meteor. Those values must be interpreted together. Saying weather equals sun is one outcome; saying P of weather is a distribution describes the whole uncertain menu.

### 3. Boundary and transfer

Use a restaurant metaphor. The random variable is the menu category, the domain is the list of dishes, and the distribution is how likely customers are to order each dish. A continuous variable is more like soup volume: individual exact values need densities and intervals. Do not confuse the menu with today's order, unless you enjoy receiving seventeen entrees and a probability-theory bill.

### 4. Detailed transfer

One more distinction matters for continuous variables. For discrete weather, probabilities attach to individual values. For drive time, probability usually belongs to an interval, such as between twenty and twenty-five minutes; the probability of one exact real number may be zero even though that number is possible. A density is not itself a probability. Integrating density over an interval produces probability, just as a height map needs area before it tells us volume.

## Slide 04 - A valid joint distribution covers every complete assignment

### 1. Core concept

A joint distribution is a complete ledger over assignments to several variables. For temperature and weather, each row specifies both values: hot and sun, hot and rain, cold and sun, or cold and rain. These are complete assignments. A row that says only hot is incomplete because weather is still unspecified.

### 2. Worked meaning

Two constraints make the table legal. Every probability must be nonnegative; negative probability would be like owing three tenths of an outcome to the universe. Second, all complete rows must sum to one because exactly one complete assignment occurs. Here point four plus point one plus point two plus point three equals one.

### 3. Boundary and transfer

Table size grows as the product of domain sizes. If variable X i has domain size d i, the joint contains the product of all d i rows. The shortcut d to the n works only when every variable has the same domain size. This growth is the first warning that full joint tables become enormous: probability is tidy, but its spreadsheet can become a small planet.

### 4. Detailed transfer

Now scale the table. Ten binary variables require two to the tenth, or one thousand twenty-four rows. Thirty binary variables require more than one billion. This combinatorial growth motivates factorization and graphical models: represent local relationships instead of writing every complete assignment explicitly. The joint distribution remains the semantic foundation, while compact structure becomes the engineering survival kit. We will use the chain rule later to show how that factorization begins.

## Slide 05 - A joint model makes the probability of any event computable

### 1. Core concept

An event is a set of complete outcomes. Hot and sun identifies one row, so its probability is point four. Hot alone identifies two rows because weather may be sun or rain, so we add point four and point one. The general rule is to sum the probability of every complete outcome that satisfies the event.

### 2. Worked meaning

For hot OR sun, include hot-sun, hot-rain, and cold-sun. Add point four, point one, and point two to get point seven. The hot-sun row satisfies both descriptions, but it is still one physical row. Counting it twice is like charging the same student twice because they are both a computer-science major and hungry.

### 3. Boundary and transfer

A useful procedure is mechanical: translate the query into a membership test, mark each satisfying row, and add each marked mass once. AND narrows to intersections; OR creates unions; leaving a variable unspecified gathers multiple rows. The joint model earns its keep because every event query becomes careful bookkeeping rather than storytelling.

### 4. Detailed transfer

Compare OR with the addition rule P of A union B equals P of A plus P of B minus P of A intersection B. The subtraction removes the duplicate overlap created when two event totals were added. Row selection and the formula are the same logic viewed from different distances. On a tiny table, marking rows is safer; on symbolic events, inclusion-exclusion is compact. Either way, overlap gets exactly one seat.

## Slide 06 - Select the rows that satisfy the event, then add each row once

### 1. Core concept

Use the joint table as the source of truth. Before touching arithmetic, point to the rows that satisfy the event. That habit separates logical selection from numerical addition and catches most double-counting errors.

### 2. Worked meaning

The four masses sum to one, so every answer must fall between zero and one. We will work all three prompts and expose the answer only after naming the included rows.

### 3. Boundary and transfer

Notice how each question changes only the set of selected rows. Q one selects a single complete assignment. Q two ignores Y and therefore gathers a marginal. Q three combines a union and must protect the overlap. The arithmetic is deliberately easy so the logic is visible. In larger models, software may perform the summation, but you still need to state which worlds belong to the event or the computer will sum the wrong neighborhood with flawless enthusiasm.

### 4. Reveal Q1

**Instructor action before narration:** Reveal Q1.

Reveal Q1. The answer is point two because plus x and plus y names exactly the first row. No summation is needed; a complete assignment selects one ledger entry.

### 5. Choose Q2

**Instructor action before narration:** Choose Q2.

Choose Q2. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 6. Reveal Q2

**Instructor action before narration:** Reveal Q2.

Reveal Q2. The answer is point five. Plus x leaves Y unspecified, so add point two and point three. This is marginalization: Y has been summed out.

### 7. Choose Q3

**Instructor action before narration:** Choose Q3.

Choose Q3. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 8. Reveal Q3

**Instructor action before narration:** Reveal Q3.

Reveal Q3. The union is point six. Include plus x plus y, plus x minus y, and minus x minus y once each. The overlap row is not charged a second admission fee.

## Slide 07 - A marginal distribution collapses a joint table by addition

### 1. Core concept

Marginalization removes a variable from a joint table by summing over its possible values. To find P of hot, keep temperature fixed at hot and add across weather: point four plus point one equals point five. To find P of cold, add point two plus point three, also point five.

### 2. Worked meaning

The notation P of x equals the sum over y of P of x comma y says exactly that. We are not deleting evidence or averaging rows; we are collecting every complete world compatible with x. Imagine checking hotel occupancy by floor: to get the building total, add every room count without caring which room number supplied it.

### 3. Boundary and transfer

The X marginal is point five and point five. The Y marginal is point six for plus y and point four for minus y. Each marginal distribution must sum to one. That is a powerful checksum. If it does not, a row vanished, a row was counted twice, or arithmetic took an unscheduled vacation.

### 4. Detailed transfer

Marginalization can also eliminate many variables: P of x equals the sum over every assignment to y and z of P of x, y, z. Computationally, the order of those sums can matter enormously when a model is factorized, even though the final probability does not change. Variable elimination exploits that fact. Today's table addition is the small, transparent ancestor of inference algorithms used in Bayesian networks.

## Slide 08 - Conditioning restricts the population; it does not imply time or causation

### 1. Core concept

Conditional probability asks about A inside the restricted world where B is true. The formula P of A given B equals P of A intersection B divided by P of B. The numerator is the mass satisfying both; the denominator rescales the entire B population to one.

### 2. Worked meaning

Among people who cough, what fraction are sick is P sick given cough. Among people who are sick, what fraction cough is P cough given sick. These denominators describe different reference populations, so the values can be dramatically different. Reversing the vertical bar is not a harmless typographical yoga pose.

### 3. Boundary and transfer

The word given does not automatically mean earlier, caused by, or morally responsible for. It means conditioned on. A diagnostic symptom may be evidence about a disease, but the conditional calculation alone does not establish causal direction. Always translate the notation into an among-the-cases-that sentence; the denominator then becomes visible in plain English.

### 4. Detailed transfer

Conditional probability becomes undefined when P of B is zero because there is no reference population to normalize. In continuous models, conditioning on exact values requires densities or more careful definitions. For our finite tables, the safety rule is simple: check that the denominator is positive, name it in words, and verify the resulting conditional values sum to one. Denominators deserve background checks too.

## Slide 09 - Fix the evidence value, then normalize every compatible row

### 1. Core concept

A conditional distribution contains one normalized table for each fixed evidence value. Under hot, sun has probability point eight and rain point two. Under cold, sun has point four and rain point six. Each column of context answers a different question and each must sum to one.

### 2. Worked meaning

For plus x given plus y, select the two rows where y is positive. Their total mass is point six; the plus-x part is point two, giving one third. Minus x given plus y is point four divided by point six, or two thirds. For minus y given plus x, the denominator changes to point five and the answer is point six.

### 3. Boundary and transfer

Conditioning is like changing the guest list before calculating proportions. Once only plus-y guests enter the room, every percentage is computed inside that room. If you silently reuse the denominator from another room, the arithmetic may look polished while answering the wrong party invitation.

### 4. Detailed transfer

Compare P of weather given hot with P of weather given cold. The distribution changes because temperature is informative about weather in this model. If the two tables were identical, weather and temperature would be independent: learning temperature would not change weather belief. Independence is therefore a statement about unchanged conditionals, not a vague claim that variables have never met at a conference.

## Slide 10 - The selected mass is exactly the probability of the evidence

### 1. Core concept

The normalization trick has three visible stages. Begin with the joint table. Select rows compatible with T equals cold: cold-sun has mass point two and cold-rain has point three. Their selected mass is point five, which is exactly P of T equals cold.

### 2. Worked meaning

Divide each compatible mass by point five. Sun becomes point four and rain becomes point six. Selection preserves the relative ratio two to three; normalization turns that selected pile into a proper probability distribution totaling one.

### 3. Boundary and transfer

Think of zooming into a photograph. Selection crops to the evidence region; normalization enlarges that crop to fill the frame. Nothing outside the crop survives, but relationships inside it remain proportional. This procedure is Bayes' denominator in miniature: gather all ways the evidence can occur, then divide the favored way by the complete evidence mass.

### 4. Detailed transfer

The select-normalize routine generalizes to any finite conditional query. First zero out incompatible assignments. Second sum what remains to obtain the normalizer. Third divide every surviving mass by that sum. This is sometimes written with proportionality: P of query given evidence is proportional to the joint mass consistent with both. The missing constant is not mysterious; it is precisely the amount required to make the surviving distribution sum to one.

## Slide 11 - Selection preserves ratios; normalization makes them probabilities

### 1. Core concept

Condition on Y equals minus y by selecting masses point three and point one. Their total is point four. Before calculating, predict that plus x will receive three times the probability of minus x because the selected masses have a three-to-one ratio.

### 2. Worked meaning

We will reveal both components, then verify that the conditional vector sums to one. The sum check is not ceremonial; it is the fastest detector of a wrong normalizer.

### 3. Boundary and transfer

Ratios provide a mental shortcut. Before normalization, point three to point one is three to one. After normalization, it must remain three to one while totaling one, so the answer is three quarters and one quarter. This lets you estimate conditionals before calculating. If a calculator returns point six and point four, the sum passes but the preserved-ratio test fails. Two independent checks are better than one confident green checkmark.

### 4. Reveal +x

**Instructor action before narration:** Reveal +x.

Reveal plus x. The selected evidence mass is point four. Plus x owns point three of it, so P of plus x given minus y is point three divided by point four, or point seven five.

### 5. Choose -x

**Instructor action before narration:** Choose -x.

Choose minus x. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 6. Reveal -x

**Instructor action before narration:** Reveal -x.

Reveal minus x. Minus x owns point one of the same point-four evidence mass, giving point two five. Point seven five plus point two five equals one, so the conditional vector passes its checksum.

## Slide 12 - Connect outcomes, events, random variables, distributions, and conditioning

### 1. Core concept

Three fair coin tosses create eight equally likely sequences. The sample space contains HHH through TTT. Event A is the set with more heads than tails; event B is the set whose first toss is H. An event is a collection of outcomes, not a numerical measuring device.

### 2. Worked meaning

A random variable maps each sequence to a value. X can count heads from zero through three, while indicator I records whether the first toss is H. We will use the interactive lab to keep sample space, event, random variable, distribution, and conditional probability in their correct drawers.

### 3. Boundary and transfer

The distribution one-three-three-one comes from combinations. Exactly two heads can occur as HHT, HTH, or THH, three sequences; exactly one head also has three placements. This symmetry gives P of A equals one half. Conditioning on the first toss being H breaks some symmetry and raises the chance of a head majority to three quarters. Evidence changes the sample space before it changes the fraction.

### 4. Reveal Q1

**Instructor action before narration:** Reveal Q1.

Reveal Q1. There are eight length-three sequences. The sample space lists every possible H or T string, so its size is two cubed.

### 5. Choose Q2

**Instructor action before narration:** Choose Q2.

Choose Q2. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 6. Reveal Q2

**Instructor action before narration:** Reveal Q2.

Reveal Q2. Event A contains HHH, HHT, HTH, and THH. Event B contains the four sequences beginning with H. Each event therefore has probability four eighths.

### 7. Choose Q3

**Instructor action before narration:** Choose Q3.

Choose Q3. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 8. Reveal Q3

**Instructor action before narration:** Reveal Q3.

Reveal Q3. A and B are events, sets of outcomes. X, the number of heads, and I, the first-toss indicator, are random variables because they map each outcome to a value.

### 9. Choose Q4

**Instructor action before narration:** Choose Q4.

Choose Q4. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 10. Reveal Q4

**Instructor action before narration:** Reveal Q4.

Reveal Q4. The distribution of X is one, three, three, one over eight for zero through three heads. Those binomial counts total eight.

### 11. Choose Q5

**Instructor action before narration:** Choose Q5.

Choose Q5. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 12. Reveal Q5

**Instructor action before narration:** Reveal Q5.

Reveal Q5. Conditioning on B leaves HHH, HHT, HTH, and HTT. Three have more heads than tails, so P of A given B is three fourths.

## Slide 13 - One observation can support several hidden causes

### 1. Core concept

Bad traffic is an observation. Construction and an accident are competing hidden explanations. The same evidence can support several hypotheses, so inference should distribute belief rather than award the first plausible story a detective badge.

### 2. Worked meaning

Additional evidence can discriminate. Orange barrels are more compatible with construction; flashing emergency lights may be more compatible with an accident. A probabilistic model specifies those relationships quantitatively. Without likelihoods, saying one clue feels construction-like is useful intuition, not yet a posterior calculation.

### 3. Boundary and transfer

This is explaining away territory: once one cause receives strong support, belief in another competing cause may fall, depending on the model. Think of hearing a crash in the kitchen. A dropped pan and a very confident cat are both hypotheses. Seeing the pan on the floor changes the distribution, although the cat will continue denying everything.

### 4. Detailed transfer

Do not confuse a dependency sketch with a complete Bayesian network specification. Arrows suggest conditional structure, but inference needs numerical conditional probability tables and assumptions about omitted relationships. A beautiful diagram without parameters is a street map without distances: it tells us which roads connect but not how long the trip takes. We can reason qualitatively, yet a numerical posterior still needs the missing model.

## Slide 14 - Bad traffic raises the construction belief from 0.5 to 0.75

### 1. Core concept

The displayed joint table contains construction C and bad traffic T. It supports a prior calculation and an update after observing traffic. It does not yet contain a barrel variable, so a numeric barrel update would require additional probabilities.

### 2. Worked meaning

We will marginalize over traffic to find the construction prior, condition on bad traffic, and then state precisely what extra model information barrels would require.

### 3. Boundary and transfer

The update from point five to point seven five is evidence-sensitive, not causal proof. Bad traffic is more common when construction is present in this joint model, so observing traffic reallocates probability. It does not prove construction caused this particular slowdown. If an unmodeled parade creates traffic, the posterior may be overstated. Model completeness and data quality remain part of the conclusion.

### 4. Reveal Q1

**Instructor action before narration:** Reveal Q1.

Reveal Q1. Marginalize over traffic. The two construction-true rows have masses point three and point two, so the prior P of C is point five.

### 5. Choose Q2

**Instructor action before narration:** Choose Q2.

Choose Q2. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 6. Reveal Q2

**Instructor action before narration:** Reveal Q2.

Reveal Q2. Under bad traffic, compatible masses are point three with construction and point one without it. Normalize point three by point four to get point seven five.

### 7. Choose Q3

**Instructor action before narration:** Choose Q3.

Choose Q3. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 8. Reveal Q3

**Instructor action before narration:** Reveal Q3.

Reveal Q3. Barrels should increase construction belief only if they are more likely when construction is true. A numeric update needs probabilities involving a barrel variable; arrows alone do not manufacture numbers.

## Slide 15 - Multiply a prior by a conditional to recover joint probability

### 1. Core concept

The product rule reconstructs a joint cell from a prior and a conditional: P of x comma y equals P of y times P of x given y. For sun and wet, multiply point eight by point one to get point zero eight. For sun and dry, multiply point eight by point nine to get point seven two.

### 2. Worked meaning

Rain contributes point two times point seven equals point one four for wet, and point two times point three equals point zero six for dry. The four products sum to one. Each product represents a path through a probability tree: choose weather, then choose surface condition inside that weather branch.

### 3. Boundary and transfer

Multiplication handles sequential restriction; addition combines mutually exclusive ways. That two-operation rhythm appears everywhere in probability models. Multiply along one explanatory route, add across alternative routes. It is the probability version of calculating each restaurant bill and then discovering your friends want to split all four checks.

### 4. Detailed transfer

The product rule can be rearranged into the conditional definition and Bayes' rule, so these are not disconnected formulas. They are different views of one joint quantity. A probability tree makes the relationship visual: branch probabilities multiply to leaf masses, and leaf masses add across events. Whenever you feel lost, reconstruct the joint leaves. The algebra usually becomes less dramatic once every symbol has a physical row.

## Slide 16 - Repeated product rules factor any joint distribution

### 1. Core concept

The chain rule repeatedly applies the product rule. For two variables, factor the joint as P of x one times P of x two given x one. Add a third factor conditioned on the first two, and continue until every variable appears.

### 2. Worked meaning

The identity requires no independence assumption. Ordering may change the factors, but the complete product still represents the same joint when the corresponding conditionals are correct. We will build the two-variable, three-variable, and n-variable forms interactively.

### 3. Boundary and transfer

Ordering creates a modeling opportunity. The full chain rule conditions on all predecessors, which may be expensive. If justified conditional independences let us omit some predecessors, the factorization becomes compact. Bayesian networks encode those omissions with parent sets. But deleting a condition is an assumption about the world, not a formatting preference. Every missing dependency should be defended by domain knowledge, data, or both.

### 4. Reveal 2

**Instructor action before narration:** Reveal 2.

Reveal 2. For two variables, P of x one comma x two equals P of x one times P of x two given x one. Reversing the ordering is also valid with corresponding factors.

### 5. Choose 3

**Instructor action before narration:** Choose 3.

Choose 3. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 6. Reveal 3

**Instructor action before narration:** Reveal 3.

Reveal 3. For three variables, append P of x three given x one and x two. The previous variables become the accumulated context.

### 7. Choose n

**Instructor action before narration:** Choose n.

Choose n. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 8. Reveal n

**Instructor action before narration:** Reveal n.

Reveal n. For n variables, multiply one conditional per variable, each conditioned on all predecessors in the chosen ordering. This is an identity, not an independence claim.

## Slide 17 - Two factorizations of the same joint yield Bayes' rule

### 1. Core concept

Bayes' rule comes from writing the same joint probability two ways. P of x comma y equals P of x given y times P of y. It also equals P of y given x times P of x. Set those expressions equal and divide by P of y, assuming the denominator is positive.

### 2. Worked meaning

The result is posterior equals likelihood times prior divided by evidence. Posterior P of x given y is the updated belief. Likelihood P of y given x measures how compatible the evidence is with x. Prior P of x is the belief before y. Evidence P of y normalizes across all possible explanations.

### 3. Boundary and transfer

Bayes is not a spell for swapping letters around a vertical bar. It is accounting for the base rate while reversing a conditional. Think of a courtroom: likelihood asks how expected this evidence would be if a hypothesis were true; posterior asks how plausible that hypothesis is after considering both the evidence and how plausible it was beforehand.

### 4. Detailed transfer

Use odds for another view. Posterior odds equal prior odds times a likelihood ratio. The likelihood ratio compares how well the evidence is predicted under competing hypotheses, while prior odds encode base rates. This form makes evidence accumulation intuitive: independent pieces contribute multiplicative likelihood ratios. It also makes clear why strong evidence may fail to overcome an extremely tiny prior, as the rare-disease example will demonstrate.

## Slide 18 - Posterior disease probability is not the probability that disease causes a symptom

### 1. Core concept

Disease may causally influence a symptom, so the arrow points from disease to symptom. Diagnosis reasons backward from observed symptom to hidden disease. The posterior P disease given symptom is not the likelihood P symptom given disease; Bayes' rule connects them using the disease prior and symptom prevalence.

### 2. Worked meaning

Suppose most people with a rare disease develop a cough. That high likelihood does not mean most coughing people have the rare disease, because common colds create many more coughs. The denominator includes every way the symptom can occur. Base rates are the quiet crowd in the room that dramatic evidence often tries to ignore.

### 3. Boundary and transfer

Probability also does not prove causation. A model may encode a causal hypothesis, but observational association can arise from confounding or selection. Keep three questions distinct: which direction does the mechanism run, which direction are we inferring, and what assumptions justify using this model?

### 4. Detailed transfer

A diagnostic model should also be calibrated and validated on the population where it will be used. Disease prevalence can differ by age, location, or referral setting, changing the prior and therefore the posterior even if test sensitivity stays fixed. Copying a posterior from one population to another can be badly wrong. Bayes is sensitive to context because context belongs in the prior, not because the theorem is being difficult before coffee.

## Slide 19 - Partition the hypothesis space, then add disjoint joint masses

### 1. Core concept

To compute the evidence normalizer, partition the hypothesis space into mutually exclusive and collectively exhaustive cases H one through H n. Event E intersects each case. Because those slices do not overlap, their probabilities add without any subtraction.

### 2. Worked meaning

The total-probability formula is P of E equals the sum over i of P of E given H i times P of H i. Each term is one route by which E can happen. For medical evidence, routes might be disease present and disease absent. For weather, routes could be sun and rain.

### 3. Boundary and transfer

Imagine sorting every evidence case into labeled bins. Mutually exclusive means no case enters two bins; exhaustive means none escapes under the table. Add the mass in all bins and you have P of E. Bayes then divides one hypothesis-and-evidence bin by that complete total.

### 4. Detailed transfer

The hypotheses in a partition need not be equally likely. Total probability weights each evidence likelihood by its hypothesis prior. A rare route may predict the evidence strongly yet contribute little total mass; a common route with moderate likelihood may dominate. This weighted addition is why denominators often surprise intuition. Human attention notices dramatic compatibility, while the normalizer quietly counts how many ordinary cases exist.

## Slide 20 - A strong likelihood may still produce a small posterior when the prior is tiny

### 1. Core concept

The disease prior is one in ten thousand. The symptom occurs with probability point eight when disease is present, but also with probability point zero one when disease is absent. The likelihood ratio is large, yet the healthy population is enormous.

### 2. Worked meaning

We will compute the evidence probability, the posterior, and the decision interpretation one step at a time. The calculation is educational, not medical advice; real diagnosis requires validated tests, clinical context, and professional evaluation.

### 3. Boundary and transfer

Imagine one million people. About one hundred have the disease. Roughly eighty of those show the symptom. Among the other nine hundred ninety-nine thousand nine hundred, about nine thousand nine hundred ninety-nine also show it. So the symptom-positive group contains roughly ten thousand seventy-nine people, only eighty with disease. The frequency picture matches the algebra and makes the base-rate effect much harder to wave away.

### 4. Reveal 1

**Instructor action before narration:** Reveal 1.

Reveal 1. The prior is point zero zero zero one. Symptom likelihood is point eight with disease and point zero one without disease. The likelihood ratio is eighty, but the prior odds are tiny.

### 5. Choose 2

**Instructor action before narration:** Choose 2.

Choose 2. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 6. Reveal 2

**Instructor action before narration:** Reveal 2.

Reveal 2. Total probability gives P of symptom as point eight times point zero zero zero one plus point zero one times point nine nine nine nine, which equals point zero one zero zero seven nine.

### 7. Choose 3

**Instructor action before narration:** Choose 3.

Choose 3. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 8. Reveal 3

**Instructor action before narration:** Reveal 3.

Reveal 3. The disease-and-symptom mass is point zero zero zero zero eight. Divide by point zero one zero zero seven nine to get about point zero zero seven nine four, or zero point seven nine four percent.

### 9. Choose 4

**Instructor action before narration:** Choose 4.

Choose 4. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 10. Reveal 4

**Instructor action before narration:** Reveal 4.

Reveal 4. A low posterior can still justify evaluation when the cost of missing disease is severe and examination cost is modest. Probability informs a decision; utilities and follow-up tests finish the job.

## Slide 21 - Dry conditions make sun much more probable than rain

### 1. Core concept

The weather prior assigns point eight to sun and point two to rain. Dry conditions are more likely under sun, point nine, than rain, point three. We will multiply each prior by its likelihood, add the routes to obtain P of dry, and normalize.

### 2. Worked meaning

The two posterior values must sum to one because sun and rain exhaust this simplified model. That final checksum verifies both numerator calculations and the shared denominator.

### 3. Boundary and transfer

We can also compare likelihood ratios. Dry is three times more likely under sun than rain because point nine divided by point three equals three. Prior odds favor sun four to one. Multiply to get posterior odds twelve to one, which normalizes to twelve thirteenths and one thirteenth, approximately point nine two three and point zero seven seven. Odds offer a second route to the same checked result.

### 4. Reveal 1

**Instructor action before narration:** Reveal 1.

Reveal 1. P of dry is point nine times point eight plus point three times point two, totaling point seven eight.

### 5. Choose 2

**Instructor action before narration:** Choose 2.

Choose 2. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 6. Reveal 2

**Instructor action before narration:** Reveal 2.

Reveal 2. The sun-and-dry mass is point seven two. Divide by point seven eight to obtain P of sun given dry, about point nine two three.

### 7. Choose 3

**Instructor action before narration:** Choose 3.

Choose 3. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 8. Reveal 3

**Instructor action before narration:** Reveal 3.

Reveal 3. The rain-and-dry mass is point zero six. Divide by point seven eight to obtain about point zero seven seven. The two posteriors sum to one.

## Slide 22 - The posterior combines prior belief, likelihood, and evidence prevalence

### 1. Core concept

Read the general Bayes formula as a before-and-after machine. The prior P of H describes plausibility before evidence. The likelihood P of e given H describes compatibility. Their product is unnormalized support for H.

### 2. Worked meaning

The denominator sums that support across every competing hypothesis. It is the overall prevalence of the evidence. Dividing by it produces the posterior P of H given e, a normalized distribution across hypotheses. Every hypothesis is judged with the same evidence denominator.

### 3. Boundary and transfer

A useful metaphor is an audition. Priors are the performers' starting reputations, likelihoods are how well each performance predicts what we heard, the evidence total is the applause distributed across all candidates, and the posterior is the updated ranking. The metaphor is imperfect, but at least nobody divides by the stage manager.

### 4. Detailed transfer

When several evidence items are conditionally independent given H, their likelihoods can multiply, causing the posterior to move sharply. When they are correlated, multiplying them as if independent double-counts information. Two weather apps using the same satellite feed are not two independent witnesses. The Bayes formula is correct only with the likelihood model we supply, so dependence assumptions must be visible rather than tucked under the equation.

## Slide 23 - Including the prior makes the rule MAP, not maximum likelihood

### 1. Core concept

Maximum likelihood chooses the hypothesis maximizing P of evidence given h. It asks which hypothesis best predicts what we observed and omits the prior. Maximum a posteriori, or MAP, maximizes likelihood times prior. The evidence denominator can be dropped from the argmax because it is identical for every candidate hypothesis.

### 2. Worked meaning

Keeping the prior is the defining difference. If priors are uniform, multiplying every likelihood by the same constant preserves the ranking, so MAP and ML agree. With unequal priors, a slightly lower likelihood can win under MAP because the hypothesis was much more plausible before the observation.

### 3. Boundary and transfer

Picture two detectives. ML judges only how well each suspect explains the clue. MAP also considers how plausible each suspect was before the clue. Neither should smuggle the common denominator into one candidate's score. Dropping P of E is legal for comparison; dropping P of h changes the estimator.

### 4. Detailed transfer

Consider handwriting recognition. A rare character may fit the pixels slightly better, giving it higher likelihood, while a common character has a much larger language prior. MAP may select the common character; ML selects the pixel-best rare one. Which is preferable depends on whether the prior matches deployment. A stale prior can overpower genuine novelty, so incorporating prior knowledge creates power and responsibility in equal portions.

## Slide 24 - The evidence normalizer combines all ways the observed purchase could occur

### 1. Core concept

Three dealers have priors point two, point four, and point four. The probability of purchasing product a one differs by dealer. To infer dealer two after seeing the purchase, compute dealer two's joint mass and divide by the total probability of that purchase across all dealers.

### 2. Worked meaning

We will expose numerator, normalizer, and posterior separately. This prevents a common error: normalizing by one convenient competitor instead of by every mutually exclusive way the evidence could occur.

### 3. Boundary and transfer

The three dealer terms illustrate a reusable denominator pattern. For each hypothesis, multiply prior by evidence likelihood. Store those unnormalized weights. Add all weights. Divide each by the sum. Computing the whole posterior distribution, not only dealer two, would yield point one two five, point five, and point three seven five. Their sum is one, providing the final audit.

### 4. Reveal 1

**Instructor action before narration:** Reveal 1.

Reveal 1. Dealer two's numerator is likelihood point four times prior point four, giving joint mass point one six.

### 5. Choose 2

**Instructor action before narration:** Choose 2.

Choose 2. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 6. Reveal 2

**Instructor action before narration:** Reveal 2.

Reveal 2. The evidence normalizer adds all dealer routes: point zero four plus point one six plus point one two equals point three two.

### 7. Choose 3

**Instructor action before narration:** Choose 3.

Choose 3. Read the new prompt and identify the compatible rows or factors before revealing the result.

### 8. Reveal 3

**Instructor action before narration:** Reveal 3.

Reveal 3. Normalize dealer two's point-one-six mass by point three two. The posterior is point five, so half the purchase-compatible probability mass belongs to dealer two.

## Slide 25 - Represent uncertainty, compute an update, and defend the interpretation

### 1. Core concept

The closing audit has three stages. Represent: define variables and domains, then verify that a joint distribution is nonnegative and normalized. Infer: select or marginalize compatible rows, compute the evidence normalizer, and apply the correct product, conditional, or Bayes rule.

### 2. Worked meaning

Interpret: state the reference population and distinguish event from random variable, posterior from likelihood, association from cause, and MAP from maximum likelihood. A correct number with the wrong sentence is not a correct probabilistic answer; it is arithmetic wearing someone else's name tag.

### 3. Boundary and transfer

When you meet a new uncertainty problem, resist formula roulette. Draw the variables, identify observed and hidden quantities, write the target conditional, and list the mutually exclusive routes to the evidence. Then calculate and check bounds, normalization, and meaning. Probability becomes manageable when every symbol has a job and every denominator has an address.

### 4. Detailed transfer

For the next lesson, bring one real case in which a prior changes the selected hypothesis. State the hypotheses, evidence, likelihood intuition, and why unequal base rates matter. Avoid examples where the prior is merely prejudice disguised as mathematics; priors need empirical or defensible grounding. A good probabilistic argument makes assumptions inspectable, updates them with evidence, and states what uncertainty remains after the calculation.
