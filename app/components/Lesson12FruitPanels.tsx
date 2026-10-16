"use client";

import { useState } from "react";
import styles from "./Meeting10Deck.module.css";

export function MAPExplanation() {
  return <div className={styles.explainGrid}>
    <section className={styles.explainPanel}>
      <h3>MAP = maximum a posteriori</h3>
      <p><b>Posterior</b> means the class probability AFTER seeing the features. <b>Maximum</b> means choose whichever class has the largest probability.</p>
      <div className={styles.explainTakeaway}>Choose the most probable class after combining prior belief with observed evidence.</div>
      <p><b>C</b> is a candidate class: apple or not-apple. <b>e</b> is the evidence: this fruit’s size, color, and shape. <b>P(C)</b> is the prior: how common the class was before observing this fruit.</p>
      <div className={styles.storyPath}>score(C) = prior × feature likelihood<br/>= P(C) × ∏ᵢ P(eᵢ | C)</div>
      <p>∏ means multiply the feature likelihoods; eᵢ is one observed feature value. <b>argmax</b> means return the class with the largest score; ĉ denotes that chosen class.</p>
      <details><summary>Implementation: avoid tiny products</summary><p>In software, add log probabilities instead of multiplying many small values. This avoids numerical underflow and preserves the winner.</p></details>
    </section>
    <section className={styles.explainPanel}>
      <h3>The prior can change the winning class</h3>
      <p>Suppose the combined feature likelihood is 0.30 for apple and 0.60 for not-apple. These are illustrative numbers.</p>
      <table className={styles.studyTable}><thead><tr><th>Class C</th><th>Prior P(C)</th><th>P(e | C)</th><th>MAP score</th></tr></thead><tbody><tr><td>apple</td><td>0.80</td><td>0.30</td><td><b>0.24</b></td></tr><tr><td>not-apple</td><td>0.20</td><td>0.60</td><td>0.12</td></tr></tbody></table>
      <p><b>Maximum likelihood:</b> compare 0.30 and 0.60 → choose not-apple. This ignores the prior.</p>
      <p><b>MAP:</b> compare 0.24 and 0.12 → choose apple. The more common class wins after combining prior and likelihood.</p>
      <div className={styles.explainTakeaway}>Posterior for apple = 0.24 ÷ (0.24 + 0.12) ≈ 0.667. The shared denominator can be omitted when only choosing a winner.</div>
      <p>With equal priors, MAP and maximum likelihood choose the same class.</p>
    </section>
  </div>;
}

export function FruitClassificationFlow() {
  return <div className={styles.explainGrid}>
    <section className={styles.explainPanel}>
      <h3>1 · Train on fruit with known labels</h3>
      <img className={styles.trainingFruit} src="/lesson-visuals/lesson12-fruit-training.svg" alt="Apple, grapes, and a banana: labeled fruit used for training" />
      <p><b>Known classes:</b> apple and not-apple. Grapes and other fruit belong to not-apple in this two-class model.</p>
      <p><b>Measure features:</b> size, color, and shape. Labels tell the model which class each training fruit belongs to.</p>
      <div className={styles.explainTakeaway}><b>Learn two kinds of numbers:</b><br/>P(C): class frequencies (priors).<br/>P(feature value | C): feature likelihoods within each class.</div>
      <p>For example, estimate how often training apples are red, then separately how often not-apples are red.</p>
    </section>
    <section className={styles.explainPanel}>
      <h3>2 · Predict the label of a new fruit</h3>
      <div className={styles.testFruit}><img src="/lesson-visuals/lesson12-apple.svg" alt="A new red apple to classify" /><div><b>Observed features</b><p>Medium size<br/>Red color<br/>Rounded shape</p></div></div>
      <div className={styles.storyPath}>score(C)=P(C)P(size|C)P(color|C)P(shape|C)</div>
      <p>Compute a score per class, then normalize. The lecture’s illustrative outputs are:</p>
      <div className={styles.fruitScores}><div><b>apple · 0.8</b><span style={{width:"80%"}} /></div><div><b>not-apple · 0.2</b><span style={{width:"20%"}} /></div></div>
      <div className={styles.explainTakeaway}><b>MAP prediction: apple</b> because 0.8 &gt; 0.2.</div>
      <p>These outputs are illustrative, not derived from a supplied dataset. Test fresh labeled examples before interpreting 0.8 as a reliable real-world 80% chance.</p>
    </section>
  </div>;
}

const checks = [
  {label:"1 · Assumption",question:"What does ‘naive’ assume?",claim:"Features must be independent overall.",correction:"The assumption is independence GIVEN the class. Size, color, and shape are treated as independent within apple, and separately within not-apple.",example:"Redness and roundness may be related across fruit. Naive Bayes multiplies their likelihoods after fixing a class; that is a simplification, not a guarantee.",action:"Compare errors on labeled examples not used for training. If important dependencies cause errors, consider a richer model."},
  {label:"2 · Decision",question:"Does the decision include the prior?",claim:"Prior × feature likelihood is maximum likelihood.",correction:"Including the prior makes the rule MAP: maximum a posteriori. Maximum likelihood uses only feature likelihood, ignoring how common each class is.",example:"A large apple prior can outweigh a weaker feature match, changing the winning class.",action:"Write the score: P(C) × product of P(feature value | C). Check whether the class frequencies are appropriate for deployment."},
  {label:"3 · Training",question:"What should training estimate?",claim:"Every Naive Bayes model learns means and variances.",correction:"Only Gaussian Naive Bayes models numeric feature distributions with means and variances. Categorical, Bernoulli, and multinomial variants use category, yes/no, or count statistics.",example:"Fruit weight is numeric; color is categorical; ‘contains a spam word’ is yes/no. Feature types need suitable probability models.",action:"Choose a variant suited to the features, then estimate class priors and within-class feature probabilities."},
  {label:"4 · Trust",question:"Can repeated evidence inflate confidence?",claim:"Irrelevant or duplicate features can never hurt.",correction:"Correlated or duplicated features can count the same evidence repeatedly. A high score may then be overconfident even if the chosen class is correct.",example:"‘Red’ plus a copied ‘is red’ feature counts one observation twice. A new camera or fruit mix can also change performance.",action:"Test fresh labeled data: check errors and whether confidence matches actual success rates. Recheck after data changes; remove duplicates or model dependencies."},
];

export function ClassifierTrustPanel() {
  const [active,setActive]=useState(0); const item=checks[active];
  return <div className={styles.explainGrid}>
    <section className={styles.explainPanel}>
      <h3>Check a classifier before trusting it</h3>
      <img className={styles.auditFruit} src="/lesson-visuals/lesson12-fruit-training.svg" alt="Labeled fruit used to train a classifier" />
      <div className={styles.storyPath}>Observed features → class scores → predicted label</div>
      <p>A fruit model can output “apple” with a high score. This page checks whether its assumptions, training, and confidence justify using that prediction.</p>
      <ol className={styles.explainSteps}><li><b>Assumption:</b> what dependencies did we simplify?</li><li><b>Decision:</b> did we use a prior?</li><li><b>Training:</b> do the probability models fit the features?</li><li><b>Trust:</b> does it work on fresh examples?</li></ol>
    </section>
    <section className={`${styles.explainPanel} ${styles.auditDetails}`}>
      <nav className={styles.explainTabs} aria-label="Choose a classifier check">{checks.map((c,i)=><button key={c.label} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}>{c.label}</button>)}</nav>
      <h3>{item.question}</h3>
      <div className={styles.auditMistake}><b>Common mistake:</b> {item.claim}</div>
      <div className={styles.explainTakeaway}><b>Better explanation:</b> {item.correction}</div>
      <p><b>Concrete example:</b> {item.example}</p>
      <p><b>What to do:</b> {item.action}</p>
    </section>
  </div>;
}
