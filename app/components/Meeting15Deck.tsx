"use client";

import { useState } from "react";
import "../styles/meeting15.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";
import {
  SearchCallout,
  SearchQuickCheck,
  SearchSourceImage,
} from "./SearchLessonPrimitives";

const SOURCE_ROOT = "/course-source/l09-machine-learning-part-a";
const SOURCE_DECK_LABEL = "L09 Machine Learning - Part A";

function resolveMeeting15SourceReference(sourceSlide: number) {
  return {
    deckLabel: SOURCE_DECK_LABEL,
    image: `${SOURCE_ROOT}/slide-renders/slide-${String(sourceSlide).padStart(2, "0")}.png`,
    key: `l09-machine-learning-part-a:${sourceSlide}`,
    page: sourceSlide,
  };
}

function SourceFrame({
  slide,
  alt,
  caption,
  className = "",
}: {
  slide: number;
  alt: string;
  caption: string;
  className?: string;
}) {
  return (
    <SearchSourceImage
      alt={alt}
      caption={caption}
      className={`m15-source-frame ${className}`.trim()}
      file={`slide-renders/slide-${String(slide).padStart(2, "0")}.png`}
      sourceRoot={SOURCE_ROOT}
    />
  );
}

const dataQualityCases = [
  {
    label: "Inconsistent",
    symptom: "The same feature pattern appears with conflicting labels.",
    treeEffect: "The branch cannot become pure; the learner may add brittle tests to chase contradictions.",
    action: "Check duplicates, label policy, annotator agreement, and whether an omitted feature explains the difference.",
  },
  {
    label: "Missing",
    symptom: "Some records do not contain a value needed by a split.",
    treeEffect: "Training or prediction needs an explicit routing rule; silent row deletion can change the population.",
    action: "Measure missingness, preserve a missingness indicator when meaningful, and fit imputation only on training data.",
  },
  {
    label: "Poor coverage",
    symptom: "Important subgroups or boundary cases are rare or absent.",
    treeEffect: "A branch can look accurate while its rule is unsupported outside the sampled region.",
    action: "Create a class-by-slice coverage table and collect examples where evidence is weak.",
  },
];

function DataQualityClinic() {
  const [active, setActive] = useState(0);
  const item = dataQualityCases[active];
  return (
    <div className="m15-data-clinic">
      <nav aria-label="Decision-tree data-quality cases">
        {dataQualityCases.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Observed symptom</span>
        <h3>{item.symptom}</h3>
        <article><strong>Likely tree behavior</strong><p>{item.treeEffect}</p></article>
        <article><strong>Evidence-first response</strong><p>{item.action}</p></article>
      </section>
    </div>
  );
}

const featureCases = [
  {
    label: "Nominal",
    example: "color = {red, blue, green}",
    source: "The source calls nominal attributes ideal because their categories already define branches.",
    modern: "Encode categories without inventing an order. For high-cardinality features, guard against tiny leaves and leakage.",
  },
  {
    label: "Continuous",
    example: "income = 42,700",
    source: "The source suggests breaking values into groups.",
    modern: "A tree usually searches candidate thresholds such as income <= 35,000. The learned threshold is part of model fitting.",
  },
  {
    label: "Missing",
    example: "credit_history = ?",
    source: "Missing data are identified as a common issue.",
    modern: "Handling is implementation-specific: impute, model missingness, or use an estimator with native missing-value rules.",
  },
];

function FeatureTreatmentLab() {
  const [active, setActive] = useState(0);
  const item = featureCases[active];
  return (
    <div className="m15-feature-lab">
      <nav aria-label="Attribute value types">
        {featureCases.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Example</span>
        <code>{item.example}</code>
        <article><strong>Course-source point</strong><p>{item.source}</p></article>
        <article><strong>Implementation clarification</strong><p>{item.modern}</p></article>
      </section>
    </div>
  );
}

function BaggingDiagram() {
  return (
    <div className="m15-ensemble-diagram bagging" aria-label="Bootstrap aggregation process">
      <section><span>Training set D</span><b>n labeled rows</b></section>
      <i aria-hidden="true">sampling with replacement</i>
      <div>
        <article><span>D1*</span><small>duplicates + omissions</small></article>
        <article><span>D2*</span><small>duplicates + omissions</small></article>
        <article><span>Dm*</span><small>duplicates + omissions</small></article>
      </div>
      <div>
        <article><b>model 1</b></article>
        <article><b>model 2</b></article>
        <article><b>model m</b></article>
      </div>
      <strong>equal vote for classification / average for regression</strong>
    </div>
  );
}

function BoostingDiagram() {
  return (
    <div className="m15-boosting" aria-label="Sequential boosting process">
      <article><span>01</span><strong>Fit a weak learner</strong><p>Start from the current example weights or current residuals.</p></article>
      <i aria-hidden="true">then</i>
      <article><span>02</span><strong>Focus the next learner</strong><p>AdaBoost emphasizes errors; gradient boosting follows residual or gradient information.</p></article>
      <i aria-hidden="true">then</i>
      <article><span>03</span><strong>Combine the sequence</strong><p>The final predictor is a weighted additive model, not a set of independent bootstrap fits.</p></article>
    </div>
  );
}

const ensembleCases = [
  {
    label: "Bagging",
    data: "Independent bootstrap samples, drawn with replacement",
    training: "Base learners can be fit in parallel",
    combination: "Equal vote or average in the basic form",
    purpose: "Reduce variance of an unstable learner",
    example: "Bagged trees; random forests also randomize candidate features",
  },
  {
    label: "AdaBoost",
    data: "One training set with changing example weights",
    training: "Sequential; later learners focus on prior mistakes",
    combination: "Learner votes are weighted by performance",
    purpose: "Build a strong classifier from a sequence of weak learners",
    example: "AdaBoost is the source's weighted-vote boosting case",
  },
  {
    label: "Gradient boosting",
    data: "One training set with residual or gradient targets",
    training: "Sequential additive fitting",
    combination: "Sum of learning-rate-scaled learners",
    purpose: "Optimize a differentiable loss stage by stage",
    example: "This modern family should not be reduced to classifier voting",
  },
];

function EnsembleComparison() {
  const [active, setActive] = useState(0);
  const item = ensembleCases[active];
  return (
    <div className="m15-ensemble-compare">
      <nav aria-label="Ensemble methods">
        {ensembleCases.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>{item.label}</span>
        <div>
          <article><strong>Data</strong><p>{item.data}</p></article>
          <article><strong>Training</strong><p>{item.training}</p></article>
          <article><strong>Combination</strong><p>{item.combination}</p></article>
          <article><strong>Primary idea</strong><p>{item.purpose}</p></article>
        </div>
        <SearchCallout label="Anchor example" tone="green">{item.example}</SearchCallout>
      </section>
    </div>
  );
}

const splitRoles = [
  {
    label: "Training",
    verb: "fit",
    detail: "Learn model parameters and every data-derived preprocessing value.",
    forbidden: "Do not estimate imputers, encoders, scaling, feature selection, or PCA on held-out rows.",
  },
  {
    label: "Validation",
    verb: "choose",
    detail: "Compare features, model families, pruning, thresholds, and hyperparameters.",
    forbidden: "Repeated choices adapt to validation evidence; cross-validation organizes this reuse more reliably.",
  },
  {
    label: "Test",
    verb: "estimate",
    detail: "Measure final generalization after the complete workflow is fixed.",
    forbidden: "Do not keep tuning after seeing test results. A changed workflow needs fresh final evidence.",
  },
  {
    label: "Use",
    verb: "monitor",
    detail: "Apply the fixed pipeline to new cases and watch for drift, failures, and changing costs.",
    forbidden: "Deployment data are not automatically representative labels; define feedback and retraining rules.",
  },
];

function SplitRoleLab() {
  const [active, setActive] = useState(0);
  const item = splitRoles[active];
  return (
    <div className="m15-split-lab">
      <nav aria-label="Train validation test and use roles">
        {splitRoles.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>{item.label} set role</span>
        <h3>{item.verb}</h3>
        <p>{item.detail}</p>
        <SearchCallout label="Boundary" tone="amber">{item.forbidden}</SearchCallout>
      </section>
    </div>
  );
}

function KFoldLab() {
  const [fold, setFold] = useState(0);
  const foldCount = 5;
  return (
    <div className="m15-kfold">
      <section>
        <span>Development data - 5-fold cross-validation</span>
        <div className="m15-fold-row" aria-label={`Cross-validation fold ${fold + 1}`}>
          {Array.from({ length: foldCount }, (_, index) => (
            <article className={index === fold ? "validation" : "training"} key={index}>
              <b>Fold {index + 1}</b>
              <small>{index === fold ? "validate" : "train"}</small>
            </article>
          ))}
        </div>
        <nav aria-label="Cross-validation folds">
          <button onClick={() => setFold(value => (value + foldCount - 1) % foldCount)} type="button">Previous fold</button>
          <strong>Run {fold + 1} of {foldCount}</strong>
          <button onClick={() => setFold(value => (value + 1) % foldCount)} type="button">Next fold</button>
        </nav>
      </section>
      <div>
        <ol>
          <li><span>1</span><p>Fit imputer, encoder, scaler, PCA, and estimator on the four training folds.</p></li>
          <li><span>2</span><p>Transform and score the held-out fold with those fitted values.</p></li>
          <li><span>3</span><p>Rotate the held-out fold; summarize all five scores.</p></li>
        </ol>
        <SearchCallout label="Untouched test set" tone="cyan">
          Cross-validation supports development. The separate test set remains sealed until choices are fixed.
        </SearchCallout>
      </div>
    </div>
  );
}

const supervisedStages = [
  {
    label: "Train",
    source: "Positive and negative examples build a model with patterns.",
    clarification: "More generally, supervised data are labeled input-output pairs; labels may be binary, multiclass, multilabel, numeric, or structured.",
  },
  {
    label: "Test",
    source: "Testing verifies the concept learned.",
    clarification: "Testing estimates performance under a declared population and metric; it does not prove that a concept is universally correct.",
  },
  {
    label: "Use",
    source: "Use the model for forecasting, prediction, recognition, and related tasks.",
    clarification: "Deployment also needs input checks, uncertainty or thresholds, human oversight where needed, and monitoring.",
  },
];

function SupervisedWorkflow() {
  const [active, setActive] = useState(0);
  const item = supervisedStages[active];
  return (
    <div className="m15-supervised-flow">
      <nav aria-label="Supervised learning process">
        {supervisedStages.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{index + 1}</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Course-source step</span>
        <h3>{item.source}</h3>
        <SearchCallout label="Scope clarification" tone="cyan">{item.clarification}</SearchCallout>
      </section>
    </div>
  );
}

const biasCases = [
  {
    label: "ID3 heuristic",
    constraint: "Prefer an attribute with high information gain.",
    benefit: "The heuristic avoids enumerating every possible tree.",
    risk: "Information gain can favor high-cardinality attributes unless the method controls that bias.",
  },
  {
    label: "Representation",
    constraint: "Search only bit strings, decision trees, rules, feature vectors, or another chosen representation.",
    benefit: "A smaller, structured concept space can be searched and interpreted.",
    risk: "A true pattern outside the representation cannot be learned, no matter how much optimization is applied.",
  },
  {
    label: "Regularization",
    constraint: "Prefer a smaller tree through depth, leaf-size, or pruning controls.",
    benefit: "The preference can improve generalization when the unconstrained tree follows noise.",
    risk: "Too strong a preference underfits a real but complex boundary.",
  },
  {
    label: "Feature design",
    constraint: "Assume the supplied variables make relevant distinctions observable.",
    benefit: "Domain knowledge can expose a pattern that raw inputs hide.",
    risk: "Omitted or proxy features can produce systematic blind spots and misleading accuracy.",
  },
];

function BiasLab() {
  const [active, setActive] = useState(0);
  const item = biasCases[active];
  return (
    <div className="m15-bias-lab">
      <nav aria-label="Inductive bias examples">
        {biasCases.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Constraint or preference</span>
        <h3>{item.constraint}</h3>
        <div>
          <article><strong>Why it helps</strong><p>{item.benefit}</p></article>
          <article><strong>Accuracy risk</strong><p>{item.risk}</p></article>
        </div>
      </section>
    </div>
  );
}

const taxonomyCases = [
  {
    label: "Spam detector",
    axes: ["supervision: supervised", "task: binary classification", "model family: linear or neural", "training mode: batch or online"],
    lesson: "Supervised does not imply symbolic or non-symbolic; those describe a different axis.",
  },
  {
    label: "Customer segments",
    axes: ["supervision: unsupervised", "task: clustering", "representation: feature vectors", "model family: centroid or density based"],
    lesson: "The output groups are discovered without target labels, but human interpretation still assigns meaning.",
  },
  {
    label: "PCA compression",
    axes: ["supervision: usually unsupervised", "task: dimensionality reduction", "representation: linear components", "training: numerical optimization"],
    lesson: "Principal Component Analysis learns variance-preserving directions; it is not itself a clustering algorithm.",
  },
  {
    label: "Winston arches",
    axes: ["supervision: labeled examples", "task: concept learning", "representation: symbolic network", "search: generalize and specialize"],
    lesson: "This is the source's supervised symbolic-learning example.",
  },
];

function TaxonomyLab() {
  const [active, setActive] = useState(0);
  const item = taxonomyCases[active];
  return (
    <div className="m15-taxonomy-lab">
      <nav aria-label="Machine-learning taxonomy cases">
        {taxonomyCases.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>Classify along independent axes</span>
        <div>{item.axes.map(axis => <strong key={axis}>{axis}</strong>)}</div>
        <p>{item.lesson}</p>
      </section>
    </div>
  );
}

function PipelineLab() {
  const [view, setView] = useState<"pipeline" | "evaluate">("pipeline");
  return (
    <div className="m15-pipeline-lab">
      <section>
        <span>Textbook / modern supplement</span>
        <h3>Reproducible scikit-learn pipeline</h3>
        <p>All data-derived preprocessing lives inside the estimator evaluated by each fold.</p>
        <nav aria-label="Pipeline code views">
          <button className={view === "pipeline" ? "active" : ""} onClick={() => setView("pipeline")} type="button">Build pipeline</button>
          <button className={view === "evaluate" ? "active" : ""} onClick={() => setView("evaluate")} type="button">Cross-validate</button>
        </nav>
        <SearchCallout label="Reproduce it" tone="green">
          Save the dataset version, split seed, package versions, code commit, fold scores, and fitted final artifact.
        </SearchCallout>
      </section>
      <pre aria-label={`${view} Python code`}><code>{view === "pipeline" ? `from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numeric = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler())
])
categorical = Pipeline([
    ("impute", SimpleImputer(strategy="most_frequent")),
    ("encode", OneHotEncoder(handle_unknown="ignore"))
])
prep = ColumnTransformer([
    ("num", numeric, numeric_cols),
    ("cat", categorical, categorical_cols)
])
model = Pipeline([
    ("prep", prep),
    ("clf", LogisticRegression(max_iter=2000, random_state=481))
])` : `from sklearn.dummy import DummyClassifier
from sklearn.model_selection import StratifiedKFold, cross_validate

cv = StratifiedKFold(
    n_splits=5, shuffle=True, random_state=481
)
scores = cross_validate(
    model, X_dev, y_dev, cv=cv,
    scoring=["accuracy", "balanced_accuracy", "f1"],
    return_estimator=True
)
baseline = cross_validate(
    DummyClassifier(strategy="prior"),
    X_dev, y_dev, cv=cv,
    scoring=["accuracy", "balanced_accuracy", "f1"]
)
print(scores["test_balanced_accuracy"].mean())
print(scores["test_balanced_accuracy"].std())`}</code></pre>
    </div>
  );
}

const evaluationViews = [
  {
    label: "Baseline + CV",
    content: "Report the simple baseline, every fold score, mean, and variability. A complex model must beat a relevant reference.",
    evidence: "DummyClassifier(strategy='prior') vs. the full pipeline under identical folds.",
  },
  {
    label: "Confusion matrix",
    content: "Counts of true/false positives and negatives reveal which errors an aggregate score hides.",
    evidence: "Use cross-validated development predictions; select a decision threshold from declared costs.",
  },
  {
    label: "Error slices",
    content: "Measure failures by relevant conditions such as missingness, class, source, time period, or subgroup.",
    evidence: "Predeclare important slices. If a post-test discovery changes the workflow, acquire new final evidence.",
  },
  {
    label: "Experiment record",
    content: "Capture data and schema version, seed and split policy, pipeline, search space, metrics, fold results, environment, and code commit.",
    evidence: "Another student should be able to rerun the experiment and explain any remaining difference.",
  },
];

function EvaluationStudio() {
  const [active, setActive] = useState(0);
  const item = evaluationViews[active];
  return (
    <div className="m15-evaluation-studio">
      <nav aria-label="Evaluation evidence views">
        {evaluationViews.map((entry, index) => (
          <button
            className={index === active ? "active" : ""}
            key={entry.label}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {entry.label}
          </button>
        ))}
      </nav>
      <section>
        <span>{item.label}</span>
        <h3>{item.content}</h3>
        <SearchCallout label="Evidence artifact" tone="cyan">{item.evidence}</SearchCallout>
        <div className="m15-mini-confusion" aria-label="Example confusion matrix">
          <span />
          <b>predicted -</b><b>predicted +</b>
          <b>actual -</b><i className="good">TN</i><i className="bad">FP</i>
          <b>actual +</b><i className="bad">FN</i><i className="good">TP</i>
        </div>
      </section>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Machine learning - Part A",
    title: "Evaluate supervised learning as an evidence pipeline",
    subtitle: "Decision-tree limits, ensembles, inductive bias, and reproducible experiments.",
    content: (
      <div className="m15-cover">
        <SourceFrame
          slide={36}
          alt="Decision-tree evaluation course source page"
          caption="Tree advantages, data issues, ensembles, data division, C4.5, and CART begin this meeting."
        />
        <section>
          <span>Meeting 15 - 75 minutes</span>
          <h3>A score is credible only when the full learning process is credible.</h3>
          <p>Trace each claim from data and inductive bias through preprocessing, training, validation, testing, and error analysis.</p>
        </section>
      </div>
    ),
    note: "Timing: 1 minute. Frame the meeting as the evaluation layer that connects the decision-tree construction from Meeting 14 to a reproducible supervised-learning experiment.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Learning objectives - Knowledge map",
    title: "Diagnose, distinguish, design, and defend",
    content: (
      <div className="m15-objectives">
        <article><span>01</span><strong>Diagnose</strong><p>poor, inconsistent, missing, continuous, and large-data decision-tree issues</p></article>
        <article><span>02</span><strong>Distinguish</strong><p>bagging, boosting, training, validation, testing, and k-fold cross-validation</p></article>
        <article><span>03</span><strong>Explain</strong><p>supervised learning, class concepts, inductive bias, and historical versus modern taxonomies</p></article>
        <article><span>04</span><strong>Defend</strong><p>a leakage-safe scikit-learn pipeline with baselines, error evidence, and an experiment record</p></article>
      </div>
    ),
    note: "Timing: 1 minute. Read the four performance verbs. The cumulative assessment asks students to defend an experiment, not merely name algorithms.",
    sourceSlides: [36, 37, 38, 39],
  },
  {
    eyebrow: "Decision-tree evaluation - Source map",
    title: "One page connects representation, data, scale, ensembles, and evaluation",
    content: (
      <div className="m15-source-map">
        <SourceFrame
          slide={36}
          alt="Complete evaluation of decision tree page"
          caption="Select to inspect the complete wording and every listed issue and variation."
        />
        <div>
          {[
            ["Representation", "tree -> rules"],
            ["Data", "poor, inconsistent, missing"],
            ["Values", "nominal and continuous"],
            ["Scale", "large data can yield a large tree"],
            ["Algorithms", "C4.5 and CART"],
            ["Ensembles", "bagging and boosting"],
            ["Evaluation", "divide, build, and test"],
          ].map(([label, detail]) => (
            <article key={label}><span>{label}</span><strong>{detail}</strong></article>
          ))}
        </div>
      </div>
    ),
    note: "Timing: 1 minute. Point out all seven regions. Tell students that the next ten pages unpack this dense source page without deleting any of its knowledge points.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Decision trees - Advantage",
    title: "A root-to-leaf path converts directly into an if-then rule",
    content: (
      <div className="m15-rule-conversion">
        <section>
          <span>Tree path</span>
          <div><b>income &lt;= 35k?</b><i>yes</i><b>credit = bad?</b><i>yes</i><strong>high risk</strong></div>
        </section>
        <i aria-hidden="true">becomes</i>
        <section>
          <span>Equivalent rule</span>
          <code>IF income &lt;= 35000<br />AND credit = &quot;bad&quot;<br />THEN risk = &quot;high&quot;</code>
          <p>Each leaf yields one conjunction; the complete tree yields a set of rules.</p>
        </section>
        <SearchCallout label="Interpretability boundary" tone="amber">
          Convertible does not always mean understandable: a deep tree can produce hundreds of overlapping, low-support rules.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Derive the rule aloud. Ask which conditions come from internal nodes and which class comes from the leaf. Preserve the source advantage, then qualify it by tree size.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Decision trees - Data quality",
    title: "Poor evidence becomes a brittle boundary",
    content: (
      <div className="m15-source-practice">
        <SourceFrame
          slide={36}
          alt="Decision-tree evaluation page naming poor inconsistent and missing data"
          caption="The source identifies poor quality, inconsistent records, and missing data as common issues."
        />
        <DataQualityClinic />
      </div>
    ),
    note: "Timing: 4 minutes. Visit all three cases. For each, students must separate the observed symptom from a response that collects evidence. Do not let pruning stand in for fixing incorrect labels.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Decision trees - Attribute values",
    title: "Nominal, continuous, and missing values require different decisions",
    content: (
      <div className="m15-source-practice">
        <FeatureTreatmentLab />
        <section className="m15-threshold-visual">
          <span>Continuous split candidate</span>
          <div>
            {[18, 24, 31, 42, 55, 67].map(value => <i key={value} style={{ left: `${value}%` }}><b>{value}</b></i>)}
            <em style={{ left: "36%" }}>threshold t</em>
          </div>
          <code>x &lt;= t -&gt; left branch | x &gt; t -&gt; right branch</code>
          <SearchCallout label="Leakage check" tone="amber">
            A learned threshold is fitted on training data; it is not selected after inspecting held-out labels.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 4 minutes. Use all three tabs. Preserve the nominal-versus-continuous source point while clarifying that modern tree implementations can learn numeric thresholds directly rather than requiring fixed bins.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Decision trees - Scale and variants",
    title: "Tree size is controlled by evidence, stopping, and pruning",
    content: (
      <div className="m15-variant-grid">
        <article><span>Source issue</span><strong>Large data may produce a large tree</strong><p>More records and attributes expose more candidate distinctions, especially under noise.</p></article>
        <article><span>C4.5</span><strong>Quinlan&apos;s ID3 successor</strong><p>Gain ratio, numeric attributes, missing-value handling, and pruning address several ID3 limitations.</p></article>
        <article><span>CART</span><strong>Classification and Regression Trees</strong><p>Binary splits, impurity criteria, regression support, and cost-complexity pruning define a related family.</p></article>
        <article><span>Controls</span><strong>Stop or prune</strong><p>Use maximum depth, minimum leaf support, impurity decrease, or post-pruning selected with validation evidence.</p></article>
        <SearchCallout label="Generalization" tone="cyan">
          A larger tree can fit training data better and still generalize worse. Size is a model choice, not an achievement by itself.
        </SearchCallout>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve C4.5 or higher and CART from the source. Clarify that a large dataset alone does not force a large tree; representation, noise, and stopping controls matter.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Ensembles - Bagging",
    title: "Bagging fits replicated bootstrap samples, then aggregates",
    content: (
      <div className="m15-ensemble-page">
        <BaggingDiagram />
        <section>
          <blockquote>Sample with replacement from the training instances to create bootstrap training sets.</blockquote>
          <p>A row can appear repeatedly in one bootstrap sample while another row is omitted. For a size-n bootstrap sample, about 63.2% of training rows are unique when n is large.</p>
          <SearchCallout label="Combine" tone="green">
            Average predictions for regression or vote for classification. The basic bagging learners have equal combining strength, and the base learner need not be a tree.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve bootstrap sampling with replacement, replicate training sets, voting or averaging, and applicability to regression. Explain duplicates and omissions with the source speaker-note 63.2% fact.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Ensembles - Boosting",
    title: "Boosting fits a dependent sequence that concentrates on remaining error",
    content: (
      <div className="m15-ensemble-page reverse">
        <BoostingDiagram />
        <section>
          <blockquote>The source&apos;s weighted-classifier account describes AdaBoost, one important boosting method.</blockquote>
          <p>AdaBoost changes example weights and gives component learners performance-based voting strength. Gradient boosting instead fits residual or gradient information and combines an additive sequence.</p>
          <SearchCallout label="Do not conflate" tone="amber">
            Bagging is parallel bootstrap aggregation; boosting is sequential error-focused fitting.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Correct the compressed comparison without discarding it. Name AdaBoost as the weighted-vote case and distinguish gradient boosting so students do not overgeneralize one mechanism to all boosting.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Ensembles - Compare mechanisms",
    title: "Ask four questions before calling a method an ensemble",
    content: <EnsembleComparison />,
    note: "Timing: 4 minutes. Visit all three tabs. Students state the data construction, training dependence, combination rule, and intended effect for each method. Ask which parts can run in parallel.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Evaluation - Divide, build, test",
    title: "The source idea becomes credible only when every subset has a declared role",
    content: (
      <div className="m15-source-explain">
        <SourceFrame
          slide={36}
          alt="Decision-tree page with divide build and test evaluation idea"
          caption="The source proposes dividing data, building on one subset, and testing accuracy on others."
        />
        <section>
          <ol>
            <li><span>1</span><p><strong>Divide</strong> by a policy that respects time, groups, duplicates, and the deployment population.</p></li>
            <li><span>2</span><p><strong>Build</strong> the complete preprocessing-and-model pipeline with training evidence only.</p></li>
            <li><span>3</span><p><strong>Choose</strong> settings with validation or cross-validation evidence.</p></li>
            <li><span>4</span><p><strong>Test</strong> the fixed workflow once on untouched final evidence.</p></li>
          </ol>
          <SearchCallout label="Clarification" tone="cyan">
            The source wording describes a generic holdout idea. K-fold cross-validation is a specific repeated rotation of held-out folds.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve divide-build-test, then require role names. Give one grouped-data example: multiple records from one person must stay in the same split to avoid identity leakage.",
    sourceSlides: [36],
  },
  {
    eyebrow: "Evaluation - Roles",
    title: "Training fits, validation chooses, testing estimates, deployment monitors",
    content: <SplitRoleLab />,
    note: "Timing: 3 minutes. Visit all four roles. Ask where pruning depth, imputation median, classification threshold, and drift monitoring belong. Emphasize that preprocessing is fitted, not a neutral pre-step.",
    sourceSlides: [36, 37],
  },
  {
    eyebrow: "Textbook / modern supplement - Cross-validation",
    title: "Rotate validation folds; refit preprocessing inside every fold",
    content: <KFoldLab />,
    note: "Timing: 4 minutes. Advance through at least three folds. Have students narrate what is refit on each run. State that group, time-series, or stratified splitters replace ordinary K-fold when the data-generating structure requires them.",
    sourceSlides: [],
  },
  {
    eyebrow: "Textbook / modern supplement - Leakage",
    title: "Which workflow protects held-out evidence?",
    content: (
      <SearchQuickCheck
        question="A team wants five-fold cross-validation after filling every missing value with the median of the complete dataset. What should change?"
        options={[
          "Nothing; the median does not use class labels.",
          "Fit the imputer separately inside each training fold by placing it in a Pipeline.",
          "Compute the median on the test set so it matches deployment.",
          "Remove all missing rows before creating folds.",
        ]}
        correct={1}
        explanation="Even label-free preprocessing can leak information from held-out feature distributions. A Pipeline refits the imputer on each training fold and applies it to that fold's validation rows."
      />
    ),
    note: "Timing: 3 minutes. Collect a vote before revealing. Ask students to name two more fitted preprocessing steps: encoding vocabulary, scaling, feature selection, or PCA.",
    sourceSlides: [],
  },
  {
    eyebrow: "Supervised learning - Process",
    title: "Train with labeled examples, evaluate the learned relationship, then use it",
    content: (
      <div className="m15-source-practice">
        <SourceFrame
          slide={37}
          alt="Supervised learning process course source page"
          caption="Training, testing, use, naming questions, class concepts, and open questions remain visible together."
        />
        <SupervisedWorkflow />
      </div>
    ),
    note: "Timing: 3 minutes. Preserve the source's three steps and positive/negative phrasing, then broaden it to labeled input-output pairs so multiclass classification and regression fit the definition.",
    sourceSlides: [37],
  },
  {
    eyebrow: "Supervised learning - Why the names?",
    title: "One process can be described by its evidence, inference, task, and outcome",
    content: (
      <div className="m15-name-grid">
        <article><span>Supervised</span><strong>targets guide learning</strong><p>Each training input is paired with an expected output supplied by a labeling process.</p></article>
        <article><span>Learning by examples</span><strong>cases carry the evidence</strong><p>The learner is not given a complete rule for every future instance.</p></article>
        <article><span>Inductive learning</span><strong>specific cases -&gt; general predictor</strong><p>The learned relationship extends beyond the observed examples under assumptions.</p></article>
        <article><span>Classification</span><strong>predict a class label</strong><p>This name applies when the target is categorical; supervised regression predicts numeric values.</p></article>
        <article className="wide"><span>Outcome</span><strong>Class descriptions represent patterns or properties - concepts or knowledge.</strong><p>A multiclass learner can learn multiple decision regions. Winston&apos;s learner illustrates classification only when its learned concept and decision procedure assign new cases to declared classes.</p></article>
      </div>
    ),
    note: "Timing: 3 minutes. Answer every why-question from source page 37. Preserve the class-concept outcome and both open questions about multiple concepts and using Winston's algorithm for classification.",
    sourceSlides: [37],
  },
  {
    eyebrow: "Textbook / modern supplement - Target types",
    title: "Positive and negative examples are one supervised target type",
    content: (
      <div className="m15-target-strip">
        <article><span>Binary</span><strong>spam / not spam</strong></article>
        <article><span>Multiclass</span><strong>cat / dog / bird</strong></article>
        <article><span>Multilabel</span><strong>beach + sunset</strong></article>
        <article><span>Regression</span><strong>delivery time = 18.4 min</strong></article>
        <article><span>Structured</span><strong>sequence or tree output</strong></article>
      </div>
    ),
    note: "Timing: 1 minute. This concise supplement prevents the binary-only source language from becoming the definition. Have students identify which listed target types are classification.",
    sourceSlides: [],
  },
  {
    eyebrow: "Inductive bias - Definition",
    title: "Learning depends on prior knowledge and assumptions",
    content: (
      <div className="m15-source-explain">
        <SourceFrame
          slide={38}
          alt="Inductive bias definition examples reasons and accuracy warning"
          caption="The complete definition, examples, necessity arguments, and accuracy risk are preserved."
        />
        <section>
          <blockquote>
            Inductive bias is any criterion a learner uses to constrain the concept space or to select concepts within that space.
          </blockquote>
          <div className="m15-bias-equation">
            <span>finite training data</span><b>+</b><span>representation</span><b>+</b><span>selection preference</span><b>=</b><strong>one learned hypothesis</strong>
          </div>
          <SearchCallout label="Not automatically unfairness" tone="cyan">
            Here bias means the assumptions that make generalization possible. Those assumptions can still create performance or fairness failures and must be tested.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Read the source definition exactly. Distinguish inductive bias from statistical estimator bias and social bias while showing how model assumptions can contribute to subgroup harms.",
    sourceSlides: [38],
  },
  {
    eyebrow: "Inductive bias - Examples",
    title: "Heuristics and representations select which concepts are reachable",
    content: <BiasLab />,
    note: "Timing: 3 minutes. Visit all four cases. Preserve the source examples: information-theoretic heuristics for ID3 and syntactic constraints such as bit representations, decision trees, feature vectors, and rules.",
    sourceSlides: [38],
  },
  {
    eyebrow: "Inductive bias - Necessity and risk",
    title: "Data underdetermine the rule outside observed cases",
    content: (
      <div className="m15-underdetermination">
        <section>
          <span>Observed training examples</span>
          <div className="m15-points">
            <i className="positive" style={{ left: "12%", top: "68%" }} />
            <i className="positive" style={{ left: "28%", top: "54%" }} />
            <i className="positive" style={{ left: "39%", top: "38%" }} />
            <i className="negative" style={{ left: "63%", top: "29%" }} />
            <i className="negative" style={{ left: "76%", top: "48%" }} />
            <i className="negative" style={{ left: "86%", top: "66%" }} />
            <b className="boundary simple">simple boundary</b>
            <b className="boundary complex">complex boundary</b>
          </div>
        </section>
        <div>
          <article><strong>Why needed</strong><p>The concept space is too large for unconstrained search.</p></article>
          <article><strong>Why needed</strong><p>Training examples are only a subset of domain instances.</p></article>
          <article><strong>Risk</strong><p>Additional assumptions select a likely concept, but the induced knowledge may be inaccurate.</p></article>
          <SearchCallout label="Assessment prompt" tone="amber">
            Both boundaries classify every shown point correctly. What evidence or preference would justify selecting one?
          </SearchCallout>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve both source reasons and the accuracy warning. Students must state why training accuracy cannot choose between two hypotheses that agree on all observed examples.",
    sourceSlides: [38],
  },
  {
    eyebrow: "Machine-learning taxonomy - Historical framing",
    title: "Supervision and representation are different classification axes",
    content: (
      <div className="m15-source-practice">
        <SourceFrame
          slide={39}
          alt="Categorization of machine learning approaches course source page"
          caption="Supervised versus unsupervised and symbolic versus non-symbolic categories with all listed approaches."
        />
        <section className="m15-historical-taxonomy">
          <article><span>Source definitions</span><p><strong>Symbolic learning</strong> builds symbolic concepts or models from experience through symbolic computation. <strong>Non-symbolic learning</strong> uses numerical optimization or evolutionary adaptation.</p></article>
          <article><span>Symbolic + supervised</span><p>concept learning by generalization and specialization; decision-tree induction; concept or version-space learning</p></article>
          <article><span>Non-symbolic + supervised</span><p>artificial neural networks; genetic learning in the source taxonomy</p></article>
          <article><span>Unsupervised</span><p>clustering; expectation-maximization; Principal Component Analysis</p></article>
          <SearchCallout label="Source speaker-note examples" tone="green">
            Winston&apos;s program and decision trees are supervised symbolic learning; a genetic program&apos;s tree may encode a candidate solution without being a symbolic concept representation.
          </SearchCallout>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Preserve every listed category and approach. Correct Principle to Principal Component Analysis. Keep the source distinction that learning transforms information into concepts, while noting the taxonomy is historical.",
    sourceSlides: [39],
  },
  {
    eyebrow: "Textbook / modern supplement - Taxonomy",
    title: "Describe a learning system along multiple independent axes",
    content: (
      <div className="m15-taxonomy-page">
        <TaxonomyLab />
        <div className="m15-axis-stack">
          <span>supervision</span><strong>supervised / self-supervised / unsupervised / reinforcement</strong>
          <span>task</span><strong>classification / regression / ranking / clustering / dimensionality reduction / generation</strong>
          <span>model family</span><strong>tree / linear / probabilistic / kernel / neural / evolutionary</strong>
          <span>training mode</span><strong>batch / online / transfer / active / federated</strong>
          <span>representation</span><strong>symbolic / feature vector / embedding / hybrid</strong>
        </div>
      </div>
    ),
    note: "Timing: 3 minutes. Use at least three cases. Explain that modern taxonomy separates task, supervision, model family, training mode, and representation rather than forcing one symbolic-versus-nonsymbolic tree.",
    sourceSlides: [39],
  },
  {
    eyebrow: "Textbook / modern supplement - Reproducible lab",
    title: "Put preprocessing inside the cross-validated estimator",
    content: <PipelineLab />,
    note: "Timing: 5 minutes. Walk both code tabs. Assign numeric_cols and categorical_cols from an agreed schema; create X_dev and a sealed X_test before this cell. Require students to explain why Pipeline prevents fold-level leakage.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class practice - Evidence package",
    title: "A model result needs a baseline, errors, slices, and a record",
    content: <EvaluationStudio />,
    note: "Timing: 5 minutes. Groups rotate through the four tabs and write one required artifact for each. Ask which work may use cross-validated development predictions and what happens if a test-set discovery changes the model.",
    sourceSlides: [],
  },
  {
    eyebrow: "Cumulative assessment - Reference and readings",
    title: "Defend the complete supervised-learning experiment",
    content: (
      <div className="m15-exit">
        <SourceFrame
          slide={40}
          alt="Course source reference page for the machine learning unit"
          caption="The source reference is preserved; the corrected author name is used in the reading list."
        />
        <section>
          <span>Exit ticket - one experiment, six claims</span>
          <ol>
            <li><strong>Data:</strong> identify one quality or split risk.</li>
            <li><strong>Bias:</strong> name one representation or selection preference.</li>
            <li><strong>Pipeline:</strong> state what is fitted inside each fold.</li>
            <li><strong>Evidence:</strong> compare against a baseline and name a metric.</li>
            <li><strong>Errors:</strong> name one confusion type and one slice.</li>
            <li><strong>Boundary:</strong> explain why the final test is used once.</li>
          </ol>
          <h3>Required reading</h3>
          <p>George F. Luger, <em>Artificial Intelligence: Structures and Strategies for Complex Problem Solving</em>, 6th ed., Chapters 10 and 12, Addison Wesley, 2009.</p>
          <p>Supplement: scikit-learn User Guide - Pipelines and composite estimators; cross-validation; model evaluation.</p>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Collect all six claims. The planned timings across exactly 25 pages total 75 minutes. Note that the course source misspells the author's surname; the student-facing citation correctly uses George F. Luger.",
    sourceSlides: [40],
  },
];

export function Meeting15Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 8 - Meeting 15"
      meetingTitle="Supervised Learning Evaluation and Reproducible Pipelines"
      resolveSourceReference={resolveMeeting15SourceReference}
      slides={slides}
      sourceCollectionLabel={SOURCE_DECK_LABEL}
    />
  );
}
