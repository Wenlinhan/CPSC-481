"use client";

import { useMemo, useState } from "react";
import "../styles/meeting23.css";
import { SourceDeckShell, type SourceLessonSlide } from "./SourceDeckShell";

type CheckState = "pass" | "fail" | "blocked" | "pending";

function Check({
  label,
  state,
  detail,
}: {
  label: string;
  state: CheckState;
  detail: string;
}) {
  return (
    <article className={`m23-check m23-${state}`}>
      <span aria-hidden="true">
        {state === "pass" ? "✓" : state === "fail" ? "×" : state === "blocked" ? "!" : "…"}
      </span>
      <div><strong>{label}</strong><small>{detail}</small></div>
      <b>{state}</b>
    </article>
  );
}

const validationCases = {
  malformed: {
    label: "Malformed JSON",
    call: `{
  "name": "search_course",
  "arguments": { "query": "A*",
}`,
    checks: [
      ["JSON syntax", "fail", "Missing closing brace"] as const,
      ["Tool schema", "blocked", "Cannot inspect an invalid document"] as const,
      ["Meaning", "blocked", "No trusted argument object exists"] as const,
      ["Authority", "blocked", "No operation may reach execution"] as const,
    ],
    verdict: "Reject before dispatch. The model can repair the proposal, but the application must not guess.",
  },
  type: {
    label: "Wrong type",
    call: `{
  "name": "search_course",
  "arguments": { "query": "A*", "limit": "five" }
}`,
    checks: [
      ["JSON syntax", "pass", "The document parses"] as const,
      ["Tool schema", "fail", "limit must be an integer"] as const,
      ["Meaning", "blocked", "Later checks have no valid input"] as const,
      ["Authority", "blocked", "Execution remains closed"] as const,
    ],
    verdict: "Syntactic JSON is not yet a valid tool call.",
  },
  extra: {
    label: "Unknown field",
    call: `{
  "name": "search_course",
  "arguments": {
    "query": "A*",
    "limit": 5,
    "include_answer_key": true
  }
}`,
    checks: [
      ["JSON syntax", "pass", "The document parses"] as const,
      ["Tool schema", "fail", "Additional properties are forbidden"] as const,
      ["Meaning", "blocked", "The field is outside the contract"] as const,
      ["Authority", "blocked", "The caller cannot widen the tool"] as const,
    ],
    verdict: "A strict schema prevents the caller from inventing a more powerful interface.",
  },
  unsafe: {
    label: "Valid form, wrong scope",
    call: `{
  "name": "search_course",
  "arguments": { "query": "midterm answer key", "limit": 5 }
}`,
    checks: [
      ["JSON syntax", "pass", "The document parses"] as const,
      ["Tool schema", "pass", "Types and bounds match"] as const,
      ["Meaning", "fail", "Protected assessment content is out of scope"] as const,
      ["Authority", "fail", "The student role lacks access"] as const,
    ],
    verdict: "Schemas constrain form, not intent, target, policy, or user authority.",
  },
  valid: {
    label: "Valid read-only call",
    call: `{
  "name": "search_course",
  "arguments": {
    "query": "A star admissible heuristic",
    "limit": 3
  }
}`,
    checks: [
      ["JSON syntax", "pass", "The document parses"] as const,
      ["Tool schema", "pass", "Types, required fields, and bounds match"] as const,
      ["Meaning", "pass", "The request is a course-content search"] as const,
      ["Authority", "pass", "The role may read published course material"] as const,
    ],
    verdict: "Eligible for execution—inside the application’s read-only boundary.",
  },
} satisfies Record<string, {
  label: string;
  call: string;
  checks: readonly (readonly [string, CheckState, string])[];
  verdict: string;
}>;

function SchemaValidator() {
  const [active, setActive] = useState<keyof typeof validationCases>("unsafe");
  const item = validationCases[active];
  return (
    <div className="m23-validator">
      <nav aria-label="Tool-call validation examples">
        {(Object.keys(validationCases) as (keyof typeof validationCases)[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => setActive(key)}
            type="button"
          >
            {validationCases[key].label}
          </button>
        ))}
      </nav>
      <div className="m23-validator-body">
        <pre><code>{item.call}</code></pre>
        <section>
          {item.checks.map(([label, state, detail]) => (
            <Check detail={detail} key={label} label={label} state={state} />
          ))}
        </section>
      </div>
      <p><strong>Decision:</strong> {item.verdict}</p>
    </div>
  );
}

const loopEvents = [
  {
    stage: "Observe",
    evidence: "User asks: “Where does the syllabus define late work?”",
    decision: "The task requires current course evidence, not memory.",
    state: "1 step remaining after this decision",
  },
  {
    stage: "Decide",
    evidence: "Available capability: search_course(query, limit)",
    decision: "Propose a read-only search for “late work policy.”",
    state: "No side effect has occurred",
  },
  {
    stage: "Act",
    evidence: "Validated call: search_course({ query: “late work policy”, limit: 3 })",
    decision: "The application executes against published pages.",
    state: "Read budget: 1 of 2 calls used",
  },
  {
    stage: "Observe",
    evidence: "Result R2 contains the policy and source URL; R1 and R3 are related.",
    decision: "Evidence is sufficient; do not search again.",
    state: "Stop condition satisfied",
  },
  {
    stage: "Answer",
    evidence: "Cite R2 and distinguish the quoted policy from interpretation.",
    decision: "Return the answer and trace; terminate the loop.",
    state: "Completed in 1 tool call",
  },
];

function ToolLoopLab() {
  const [step, setStep] = useState(0);
  const event = loopEvents[step];
  return (
    <div className="m23-loop-lab">
      <div className="m23-loop-track" aria-label="Observe decide act observe answer loop">
        {loopEvents.map((item, index) => (
          <button
            aria-current={index === step ? "step" : undefined}
            className={index < step ? "done" : index === step ? "active" : ""}
            key={`${item.stage}-${index}`}
            onClick={() => setStep(index)}
            type="button"
          >
            <span>{index + 1}</span><strong>{item.stage}</strong>
          </button>
        ))}
      </div>
      <section>
        <div><span>Evidence available</span><p>{event.evidence}</p></div>
        <div><span>Control decision</span><p>{event.decision}</p></div>
        <strong>{event.state}</strong>
      </section>
      <nav>
        <button disabled={step === 0} onClick={() => setStep(value => value - 1)} type="button">Previous event</button>
        <button disabled={step === loopEvents.length - 1} onClick={() => setStep(value => value + 1)} type="button">Advance trace</button>
        <button onClick={() => setStep(0)} type="button">Reset</button>
      </nav>
    </div>
  );
}

const capabilityCases = [
  {
    name: "search_course",
    description: "Accept a query and return ranked published passages.",
    correct: "Tool",
    why: "It is an executable operation with arguments and a result.",
  },
  {
    name: "course://syllabus/current",
    description: "Addressable syllabus content that a client may read.",
    correct: "Resource",
    why: "It is contextual data identified by a URI.",
  },
  {
    name: "explain-for-novice",
    description: "Reusable instructions with audience and topic placeholders.",
    correct: "Prompt",
    why: "It is a reusable interaction template, not an execution capability.",
  },
  {
    name: "delete_submission",
    description: "Remove a student submission from the LMS.",
    correct: "Tool",
    why: "It is an action—even though this course server should not expose it.",
  },
] as const;

function CapabilityClassifier() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const score = useMemo(
    () => capabilityCases.filter((item, index) => answers[index] === item.correct).length,
    [answers],
  );
  return (
    <div className="m23-classifier">
      <div>
        {capabilityCases.map((item, index) => (
          <article key={item.name}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{item.name}</strong><small>{item.description}</small></div>
            <select
              aria-label={`Classify ${item.name}`}
              onChange={event => setAnswers(previous => ({ ...previous, [index]: event.target.value }))}
              value={answers[index] ?? ""}
            >
              <option value="">Choose…</option>
              <option value="Tool">Tool</option>
              <option value="Resource">Resource</option>
              <option value="Prompt">Prompt</option>
            </select>
            {checked && <p className={answers[index] === item.correct ? "correct" : "incorrect"}>
              {answers[index] === item.correct ? "✓" : `${item.correct}:`} {item.why}
            </p>}
          </article>
        ))}
      </div>
      <button onClick={() => setChecked(value => !value)} type="button">
        {checked ? `Score ${score} / ${capabilityCases.length} · hide feedback` : "Check classifications"}
      </button>
    </div>
  );
}

const searchCases = {
  exact: {
    label: "Exact concept",
    query: "A* admissible heuristic",
    limit: 3,
    results: [
      ["M06 · p18", "Admissibility: h(n) never overestimates true remaining cost.", "0.94"],
      ["M06 · p19", "Consistency implies h(n) ≤ c(n,a,n′) + h(n′).", "0.88"],
      ["M05 · p04", "A heuristic estimates remaining effort.", "0.72"],
    ],
    finding: "The top results jointly define the term and distinguish the stronger consistency condition.",
  },
  broad: {
    label: "Too broad",
    query: "search",
    limit: 3,
    results: [
      ["M03 · p01", "Problem formulation and breadth-first search.", "0.63"],
      ["M04 · p01", "Depth-first, uniform-cost, and evaluation.", "0.62"],
      ["M07 · p03", "Game trees are a form of adversarial search.", "0.60"],
    ],
    finding: "The call is valid, but the query does not identify a useful information need.",
  },
  protected: {
    label: "Protected target",
    query: "midterm answer key",
    limit: 3,
    results: [],
    finding: "The policy layer rejects the request before search; an empty result is not the same as an authorized search with no matches.",
  },
} as const;

function CourseSearchLab() {
  const [active, setActive] = useState<keyof typeof searchCases>("exact");
  const [executed, setExecuted] = useState(false);
  const item = searchCases[active];
  const protectedRequest = active === "protected";
  const select = (key: keyof typeof searchCases) => {
    setActive(key);
    setExecuted(false);
  };
  return (
    <div className="m23-search-lab">
      <nav aria-label="Course search scenarios">
        {(Object.keys(searchCases) as (keyof typeof searchCases)[]).map(key => (
          <button
            aria-pressed={active === key}
            className={active === key ? "active" : ""}
            key={key}
            onClick={() => select(key)}
            type="button"
          >
            {searchCases[key].label}
          </button>
        ))}
      </nav>
      <div className="m23-search-call">
        <div><span>query</span><code>{item.query}</code></div>
        <div><span>limit</span><code>{item.limit}</code></div>
        <button onClick={() => setExecuted(true)} type="button">Validate + execute</button>
      </div>
      {executed ? (
        <section className={protectedRequest ? "blocked" : ""}>
          {protectedRequest ? (
            <div className="m23-search-blocked"><b>Policy rejection</b><p>Protected assessment content is outside the student-readable corpus.</p></div>
          ) : item.results.map(([id, excerpt, score], index) => (
            <article key={id}>
              <b>{index + 1}</b>
              <div><strong>{id}</strong><p>{excerpt}</p></div>
              <span>{score}</span>
            </article>
          ))}
          <footer>{item.finding}</footer>
        </section>
      ) : (
        <section className="m23-search-idle">
          <span aria-hidden="true">⌕</span>
          <p>No capability has executed. Inspect the proposed arguments first.</p>
        </section>
      )}
    </div>
  );
}

const assessmentCases = [
  {
    prompt: "The model emits a schema-valid call to search a private faculty folder.",
    options: ["Execute because the schema passed", "Reject at authorization", "Convert the call to plain text"],
    answer: 1,
    reason: "Schema validity says nothing about the caller’s permission or the target’s allowed scope.",
  },
  {
    prompt: "An MCP server lists a tool named delete_everything.",
    options: ["Discovery grants permission", "The host must trust the name", "Discovery only describes a capability"],
    answer: 2,
    reason: "The host still owns trust, policy, consent, validation, and execution decisions.",
  },
  {
    prompt: "A search tool returns sufficient evidence after one call.",
    options: ["Stop and answer with trace", "Continue until the budget is exhausted", "Ask the model to invent a second source"],
    answer: 0,
    reason: "A success condition is a stop condition; extra calls add latency and new failure opportunities.",
  },
] as const;

function AssessmentLab() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const item = assessmentCases[caseIndex];
  const chooseCase = (index: number) => {
    setCaseIndex(index);
    setChoice(null);
  };
  return (
    <div className="m23-assessment">
      <nav>
        {assessmentCases.map((_, index) => (
          <button
            aria-current={caseIndex === index ? "step" : undefined}
            key={index}
            onClick={() => chooseCase(index)}
            type="button"
          >
            Case {index + 1}
          </button>
        ))}
      </nav>
      <section>
        <span>Choose the application-level decision</span>
        <h3>{item.prompt}</h3>
        <div>
          {item.options.map((option, index) => (
            <button
              className={choice === index ? "selected" : ""}
              key={option}
              onClick={() => setChoice(index)}
              type="button"
            >
              <b>{String.fromCharCode(65 + index)}</b>{option}
            </button>
          ))}
        </div>
        {choice !== null && (
          <p className={choice === item.answer ? "correct" : "incorrect"}>
            <strong>{choice === item.answer ? "Correct." : `Reconsider; the best answer is ${String.fromCharCode(65 + item.answer)}.`}</strong> {item.reason}
          </p>
        )}
      </section>
    </div>
  );
}

const slides: SourceLessonSlide[] = [
  {
    eyebrow: "Week 12 · Meeting 23",
    title: "When text becomes a proposed action",
    subtitle: "Structured tool calls, bounded agent loops, and Model Context Protocol concepts.",
    content: (
      <div className="m23-cover">
        <section>
          <span>Central question</span>
          <h3>What changes when a model can request that software act?</h3>
          <p>A tool call crosses from probabilistic generation into a deterministic application boundary with real data, permissions, failures, and consequences.</p>
        </section>
        <div className="m23-cover-visual" aria-label="Model proposes, application controls, tool executes">
          <article><span>01</span><i className="m23-orb">M</i><strong>Model</strong><small>proposes</small></article>
          <b>structured call</b>
          <article><span>02</span><i className="m23-gate">✓</i><strong>Application</strong><small>validates + authorizes</small></article>
          <b>eligible request</b>
          <article><span>03</span><i className="m23-tool">⌕</i><strong>Tool</strong><small>executes + returns evidence</small></article>
        </div>
      </div>
    ),
    note: "Timing: 2 minutes. Ask whether typing “delete the file” in a chat is already a deletion. Use the disagreement to introduce the execution boundary.",
    sourceSlides: [],
  },
  {
    eyebrow: "Learning objectives",
    title: "Read a tool-using system at four layers",
    content: (
      <div className="m23-objectives">
        {[
          ["01", "Call", "Explain a named operation, structured arguments, and result."],
          ["02", "Boundary", "Separate model proposal from validation, authority, and execution."],
          ["03", "Loop", "Trace observe–decide–act–observe with explicit termination."],
          ["04", "Protocol", "Map MCP hosts, clients, servers, and negotiated capabilities."],
          ["05", "Evidence", "Audit a read-only course-search trace from query to answer."],
        ].map(([number, title, detail]) => (
          <article key={number}><span>{number}</span><strong>{title}</strong><p>{detail}</p></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Students select the objective they find least familiar. Preview that the laboratory stays read-only.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 1 · Text versus action",
    title: "A sentence can describe an action without causing one",
    content: (
      <div className="m23-text-action">
        <article>
          <span>Generated text</span>
          <blockquote>“I searched the course and found three passages.”</blockquote>
          <ul><li>May be a claim</li><li>Does not prove execution</li><li>May contain invented evidence</li></ul>
        </article>
        <div aria-hidden="true"><i>≠</i><small>different artifacts</small></div>
        <article>
          <span>Tool event</span>
          <pre><code>{`tool: search_course
args: { query: "A*" }
status: succeeded
result_ids: [R1, R2, R3]`}</code></pre>
          <ul><li>Application-dispatched</li><li>Recorded result</li><li>Traceable evidence</li></ul>
        </article>
      </div>
    ),
    note: "Timing: 3 minutes. Think–pair–share: list the minimum evidence needed to substantiate the model’s sentence.",
    sourceSlides: [],
  },
  {
    eyebrow: "System model",
    title: "The model proposes; the application owns the consequences",
    content: (
      <div className="m23-boundary">
        <section>
          <span>Probabilistic component</span>
          <div className="m23-model-core"><i>M</i><strong>Language model</strong><small>selects a tool name and arguments from context</small></div>
          <p>It does not itself open the database, possess user authority, or guarantee that arguments are safe.</p>
        </section>
        <div className="m23-boundary-gate">
          <span>Execution boundary</span>
          {["parse", "schema", "semantics", "authority", "budget"].map(item => <b key={item}>{item}</b>)}
        </div>
        <section>
          <span>Deterministic application</span>
          <div className="m23-app-core"><i>APP</i><strong>Tool controller</strong><small>checks, dispatches, times out, records, and returns</small></div>
          <p>Correct engineering places policy at this boundary, not inside a hopeful prompt.</p>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Have students point to the component responsible for each failure: malformed JSON, prohibited target, timeout, and fabricated result.",
    sourceSlides: [],
  },
  {
    eyebrow: "Structured call anatomy",
    title: "A tool contract makes a proposal inspectable",
    content: (
      <div className="m23-anatomy">
        <pre><code>{`{
  "name": "search_course",
  "arguments": {
    "query": "A star admissibility",
    "limit": 3
  }
}`}</code></pre>
        <section>
          {[
            ["1", "Tool name", "Selects one advertised operation; it is not free-form code."],
            ["2", "Arguments", "Carry the proposed inputs as structured data."],
            ["3", "Schema", "Defines required fields, types, bounds, and unknown-field policy."],
            ["4", "Result", "Returns new evidence or a typed error to the application."],
          ].map(([number, label, detail]) => (
            <article key={number}><span>{number}</span><div><strong>{label}</strong><p>{detail}</p></div></article>
          ))}
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Work line by line. Ask what information is deliberately absent: user credentials, unrestricted paths, and arbitrary code.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive demo · Validation stack",
    title: "Schema-valid is necessary—not sufficient",
    content: <SchemaValidator />,
    note: "Timing: 4 minutes. Cycle through all five examples. Students predict the first failing layer before revealing each decision.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 2 · Meaning and authority",
    title: "Validation asks different questions in a fixed order",
    content: (
      <div className="m23-validation-layers">
        {[
          ["01", "Syntax", "Can the bytes be parsed as JSON?", `{ "limit": 3 }`],
          ["02", "Schema", "Are fields, types, and bounds allowed?", "integer 1…10"],
          ["03", "Semantics", "Does the request mean something allowed?", "published course content"],
          ["04", "Authority", "May this user access this target now?", "student · read"],
          ["05", "Execution", "Can the action run within timeout and budget?", "2 s · 2 calls"],
        ].map(([number, label, question, example]) => (
          <article key={number}><span>{number}</span><strong>{label}</strong><p>{question}</p><code>{example}</code></article>
        ))}
      </div>
    ),
    note: "Timing: 3 minutes. Emphasize short-circuiting: failure at an earlier layer blocks later execution. Ask why authority should still be checked even after semantic validation.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked example · Execution boundary",
    title: "Application code turns a proposal into an event",
    content: (
      <div className="m23-pseudocode">
        <pre><code>{`proposal = model(context, tool_schemas)
call = parse_json(proposal)
validate_schema(call)
validate_semantics(call, task)
authorize(user, call.name, call.arguments)
reserve_budget(task, call)

try:
    result = execute(call, timeout=2s)
    record(call, result)
except ToolError as error:
    result = typed_error(error)

return result_to_model(result)`}</code></pre>
        <aside>
          <span>Invariant</span>
          <h3>No tool implementation receives unvalidated, unauthorized arguments.</h3>
          <p>The result becomes evidence for the next decision; it is not silently treated as truth.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Walk the pseudocode top to bottom. Students identify the exact line after which a real side effect could occur.",
    sourceSlides: [],
  },
  {
    eyebrow: "Consequences",
    title: "Read and write tools require different control policies",
    content: (
      <div className="m23-effects">
        <section>
          <header><i>⌕</i><div><span>Read effects</span><strong>Observe existing state</strong></div></header>
          <ul><li>search published pages</li><li>list files in an allowed folder</li><li>read a named resource</li></ul>
          <p>Still sensitive: reads can expose private data, consume cost, or leak context.</p>
        </section>
        <section>
          <header><i>✎</i><div><span>Write effects</span><strong>Change external state</strong></div></header>
          <ul><li>send a message</li><li>submit a grade</li><li>delete or pay</li></ul>
          <p>Require stronger authorization, exact previews, idempotency, and often human approval.</p>
        </section>
        <aside><strong>Risk is not binary.</strong><p>Classify the target, reversibility, scope, and potential harm—not only the verb.</p></aside>
      </div>
    ),
    note: "Timing: 3 minutes. Ask whether “read student records” is lower risk than “write a personal draft.” Use the answers to show why context matters.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 3 · Agent loop",
    title: "Tool use is an evidence-updating control loop",
    content: (
      <div className="m23-loop-concept">
        <div>
          {[
            ["1", "Observe", "task + current evidence"],
            ["2", "Decide", "answer, call, clarify, or stop"],
            ["3", "Act", "validated application execution"],
            ["4", "Observe", "result, error, or state change"],
          ].map(([number, label, detail]) => (
            <article key={number}><span>{number}</span><strong>{label}</strong><small>{detail}</small></article>
          ))}
          <i aria-hidden="true">↻</i>
        </div>
        <section>
          <span>State carried between turns</span>
          <ul><li>goal and success condition</li><li>evidence and unresolved questions</li><li>step, time, cost, and retry budgets</li><li>tool results and typed errors</li></ul>
          <p>A loop that cannot explain why it should continue is already drifting.</p>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Contrast this loop with one long prompt. Ask which state changes after a tool returns no results.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive demo · Event trace",
    title: "Advance one bounded course-search loop",
    content: <ToolLoopLab />,
    note: "Timing: 4 minutes. Students narrate the evidence and control decision at each event. On the fourth event, ask why another search would be wasteful.",
    sourceSlides: [],
  },
  {
    eyebrow: "Termination and budgets",
    title: "Every loop needs reasons to stop—and limits if it does not",
    content: (
      <div className="m23-budgets">
        <section>
          <span>Success stops</span>
          <ul><li>answer supported by sufficient evidence</li><li>requested artifact produced and verified</li><li>user clarification required</li></ul>
        </section>
        <section>
          <span>Safety and resource stops</span>
          <ul><li>step, time, token, or monetary budget reached</li><li>unauthorized or high-impact action proposed</li><li>repeated error or unchanged state</li></ul>
        </section>
        <section>
          <span>Error policy</span>
          <div className="m23-error-flow"><b>typed error</b><i>→</i><b>classify</b><i>→</i><b>retry once?</b><i>→</i><b>stop / escalate</b></div>
          <p>Retries require a changed condition and a finite counter. “Try again” is not a recovery strategy.</p>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Students write one success stop and one resource stop for a research assistant. Collect two examples.",
    sourceSlides: [],
  },
  {
    eyebrow: "Worked error trace",
    title: "A typed error should change the next decision",
    content: (
      <div className="m23-error-trace">
        {[
          ["Attempt 1", "search_course · 12 results", "schema_error", "limit must be ≤ 10"],
          ["Repair", "search_course · 5 results", "eligible", "argument changed within contract"],
          ["Execution", "course index", "timeout", "2-second deadline reached"],
          ["Decision", "no blind retry", "stop", "return partial status and suggest later retry"],
        ].map(([step, action, status, detail], index) => (
          <article key={step}><span>{index + 1}</span><div><small>{step}</small><strong>{action}</strong><p>{detail}</p></div><b>{status}</b></article>
        ))}
        <aside><strong>Compare:</strong> a syntax repair is deterministic; a timeout retry might repeat the same failure and consume the remaining budget.</aside>
      </div>
    ),
    note: "Timing: 3 minutes. Ask students which transition is safe to automate and which requires task-level judgment.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 4 · MCP architecture",
    title: "MCP connects a host to capabilities through clients and servers",
    content: (
      <div className="m23-mcp-architecture">
        <section>
          <span>User-facing system</span>
          <div className="m23-host"><i>H</i><strong>Host application</strong><small>coordinates models, policies, context, and UI</small></div>
        </section>
        <div className="m23-clients">
          <span>one client connection per server</span>
          <article><i>C1</i><strong>MCP client</strong></article>
          <article><i>C2</i><strong>MCP client</strong></article>
        </div>
        <section>
          <span>Capability providers</span>
          <div><article><i>S1</i><strong>Course server</strong><small>search + published resources</small></article><article><i>S2</i><strong>Local file server</strong><small>scoped files</small></article></div>
        </section>
        <svg aria-hidden="true" viewBox="0 0 1000 150">
          <path d="M250 25 C400 25, 350 125, 500 125" />
          <path d="M250 25 C400 25, 550 25, 720 25" />
          <circle cx="250" cy="25" r="7" /><circle cx="500" cy="125" r="7" /><circle cx="720" cy="25" r="7" />
        </svg>
      </div>
    ),
    note: "Timing: 3 minutes. Draw the architecture verbally from left to right. Correct the misconception that the model directly connects to every server.",
    sourceSlides: [],
  },
  {
    eyebrow: "Protocol concept · JSON-RPC",
    title: "MCP standardizes messages—not application judgment",
    content: (
      <div className="m23-rpc">
        <section>
          <span>Request</span>
          <pre><code>{`{
  "jsonrpc": "2.0",
  "id": 41,
  "method": "tools/list",
  "params": {}
}`}</code></pre>
        </section>
        <div><i>→</i><strong>correlate by id</strong><i>←</i></div>
        <section>
          <span>Response</span>
          <pre><code>{`{
  "jsonrpc": "2.0",
  "id": 41,
  "result": {
    "tools": [ ... ]
  }
}`}</code></pre>
        </section>
        <aside><strong>Conceptual level:</strong> method names, parameters, results, errors, and request IDs provide a common envelope. They do not prove a server is trustworthy.</aside>
      </div>
    ),
    note: "Timing: 3 minutes. Point out the matching id and method. Avoid implementation details; ask what the message format cannot decide.",
    sourceSlides: [],
  },
  {
    eyebrow: "Lifecycle",
    title: "Initialization negotiates a shared protocol surface",
    content: (
      <div className="m23-lifecycle">
        {[
          ["01", "Initialize", "client sends protocol version, identity, and client capabilities"],
          ["02", "Negotiate", "server returns compatible version, identity, and server capabilities"],
          ["03", "Ready", "client signals that initialization is complete"],
          ["04", "Operate", "both sides use only the negotiated feature set"],
          ["05", "Shutdown", "connection ends cleanly; in-flight work is resolved"],
        ].map(([number, label, detail], index) => (
          <article key={number}><span>{number}</span><i style={{ animationDelay: `${index * 120}ms` }} /><div><strong>{label}</strong><p>{detail}</p></div></article>
        ))}
        <aside>
          <code>client: roots + sampling</code>
          <b>compatible intersection</b>
          <code>server: tools + resources</code>
          <p>After negotiation, the client may list tools and resources; it must not assume prompts exist.</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Ask why a client should not assume every server supports tools, resources, prompts, or change notifications. Students identify one legal and one unsupported next request from the negotiated capability intersection.",
    sourceSlides: [],
  },
  {
    eyebrow: "Knowledge point 5 · Server primitives",
    title: "Tools, resources, and prompts serve different roles",
    content: (
      <div className="m23-primitives">
        <article>
          <i>ƒ</i><span>Executable</span><h3>Tools</h3><p>Named functions with input schemas and results; they may read or change state.</p><code>search_course(query)</code>
        </article>
        <article>
          <i>://</i><span>Contextual data</span><h3>Resources</h3><p>Data addressed by URIs and read as context; some servers can list or subscribe.</p><code>course://syllabus</code>
        </article>
        <article>
          <i>“ ”</i><span>Reusable interaction</span><h3>Prompts</h3><p>Named templates with arguments that help users and clients construct messages.</p><code>explain(topic, audience)</code>
        </article>
      </div>
    ),
    note: "Timing: 3 minutes. Ask which primitive best represents a PDF, a database query, and a reusable code-review template. Discuss ambiguity only after students commit.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive practice · Classify capabilities",
    title: "Classify by behavior—not by a friendly name",
    content: <CapabilityClassifier />,
    note: "Timing: 4 minutes. Students classify individually, then check. Emphasize that a dangerous operation remains a tool even if policy should prevent exposure.",
    sourceSlides: [],
  },
  {
    eyebrow: "Discovery versus trust",
    title: "A capability list is an inventory, not an endorsement",
    content: (
      <div className="m23-trust">
        <section>
          <span>Discovery can establish</span>
          <ul><li>names and descriptions</li><li>declared schemas and metadata</li><li>protocol capabilities</li></ul>
        </section>
        <div className="m23-trust-gap"><i>≠</i><strong>trust gap</strong></div>
        <section>
          <span>Host policy must establish</span>
          <ul><li>server provenance and allowed users</li><li>permitted targets and effects</li><li>result handling and monitoring</li></ul>
        </section>
        <aside>
          <strong>Threat model prompt</strong>
          <p>A server describes <code>search_course</code> as read-only but its implementation transmits every query elsewhere. Which layer detects or prevents that?</p>
        </aside>
      </div>
    ),
    note: "Timing: 3 minutes. Let students answer the threat prompt. The protocol alone cannot establish implementation behavior; trust configuration, isolation, review, and monitoring remain necessary.",
    sourceSlides: [],
  },
  {
    eyebrow: "Laboratory · Read-only boundary",
    title: "Design the smallest useful course-search capability",
    content: (
      <div className="m23-lab-brief">
        <section>
          <span>Task</span>
          <h3>Find published course passages that answer a student’s concept question.</h3>
          <p>The lab does not read private files, reveal assessment keys, modify Canvas, or contact anyone.</p>
        </section>
        <div>
          {[
            ["Corpus", "published meeting pages + syllabus"],
            ["Operation", "search only"],
            ["Inputs", "query · limit"],
            ["Outputs", "source id · excerpt · score"],
            ["Budgets", "2 calls · 10 results · 4 seconds"],
            ["Stop", "sufficient evidence or bounded failure"],
          ].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}
        </div>
        <aside><strong>Security boundary:</strong> read-only does not mean unrestricted; the indexed corpus and role filter remain explicit.</aside>
      </div>
    ),
    note: "Timing: 3 minutes. Students restate the capability in one sentence and name two actions that are deliberately impossible.",
    sourceSlides: [],
  },
  {
    eyebrow: "Laboratory · Tool schema",
    title: "Make invalid and over-broad requests easy to reject",
    content: (
      <div className="m23-schema-lab">
        <pre><code>{`{
  "name": "search_course",
  "description": "Search published CPSC 481 content",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "minLength": 3,
        "maxLength": 160
      },
      "limit": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10,
        "default": 5
      }
    },
    "required": ["query"],
    "additionalProperties": false
  }
}`}</code></pre>
        <section>
          <span>Partner audit</span>
          <ol>
            <li>Construct one call rejected by syntax.</li>
            <li>Construct one rejected by schema.</li>
            <li>Construct one schema-valid call rejected by policy.</li>
            <li>Name evidence required before execution.</li>
          </ol>
        </section>
      </div>
    ),
    note: "Timing: 3 minutes. Run the four-part partner audit. Invite one policy-invalid example and explain why JSON Schema cannot encode user authority by itself.",
    sourceSlides: [],
  },
  {
    eyebrow: "Interactive lab · Course search",
    title: "Validate, execute, and interpret a read-only call",
    content: <CourseSearchLab />,
    note: "Timing: 4 minutes. Run all three scenarios. Ask students to distinguish rejection, no results, irrelevant results, and sufficient evidence.",
    sourceSlides: [],
  },
  {
    eyebrow: "Laboratory · Trace audit",
    title: "The answer is only as strong as its execution trace",
    content: (
      <div className="m23-trace-audit">
        <section>
          {[
            ["T-104", "user role", "student"],
            ["T-104", "validated call", "search_course · limit 3"],
            ["T-104", "result", "R1, R2, R3 · 146 ms"],
            ["T-104", "stop", "R1 + R2 sufficient"],
            ["T-104", "answer", "two claims · two citations"],
          ].map(([id, event, value], index) => (
            <article key={`${event}-${index}`}><span>{id}</span><b>{event}</b><p>{value}</p></article>
          ))}
        </section>
        <aside>
          <span>Audit questions</span>
          <ol>
            <li>Which event proves execution occurred?</li>
            <li>Which record supports the stop decision?</li>
            <li>What still cannot be inferred from this trace?</li>
          </ol>
          <p><strong>Answer:</strong> a clean trace does not prove the retrieved passages are true or the server implementation is benign.</p>
        </aside>
      </div>
    ),
    note: "Timing: 2 minutes. Students answer all three audit questions. Keep the distinction between operational trace and source truth explicit.",
    sourceSlides: [],
  },
  {
    eyebrow: "In-class assessment",
    title: "Choose the control decision at the application boundary",
    content: <AssessmentLab />,
    note: "Timing: 2 minutes. Run the three cases quickly as a retrieval-practice check. Ask students to justify one choice without using the word “safe.”",
    sourceSlides: [],
  },
  {
    eyebrow: "Synthesis · Exit ticket · Readings",
    title: "Standardized communication does not transfer responsibility",
    content: (
      <div className="m23-exit">
        <section>
          <span>Exit ticket · submit before leaving</span>
          <ol>
            <li>Why can a schema-valid tool call still be rejected?</li>
            <li>Write one success stop and one budget stop for a course-search loop.</li>
            <li>What does MCP standardize, and what trust decision remains with the host?</li>
          </ol>
          <blockquote>The model proposes. The application controls. The tool returns evidence. The loop decides whether evidence is sufficient.</blockquote>
        </section>
        <section>
          <span>Current primary-source reading set</span>
          <ul>
            <li><a href="https://modelcontextprotocol.io/docs/learn/architecture" rel="noreferrer" target="_blank">MCP · Architecture overview</a></li>
            <li><a href="https://modelcontextprotocol.io/specification/2025-11-25/schema" rel="noreferrer" target="_blank">MCP · 2025-11-25 schema reference</a></li>
            <li><a href="https://modelcontextprotocol.io/specification/2025-11-25/server/resources" rel="noreferrer" target="_blank">MCP · Server resources</a></li>
            <li><a href="https://openai.github.io/openai-agents-js/guides/tools/" rel="noreferrer" target="_blank">OpenAI Agents SDK · Tools guide</a></li>
          </ul>
          <p>Preparation for Meeting 24: identify the most consequential action in one tool-using workflow and the state needed before approving it.</p>
        </section>
      </div>
    ),
    note: "Timing: 2 minutes. Collect the exit ticket. The 25 slide timings total exactly 75 minutes. Assign the architecture and tools readings; reserve deeper authorization and harness approval for Meeting 24.",
    sourceSlides: [],
  },
];

export function Meeting23Deck() {
  return (
    <SourceDeckShell
      meetingLabel="Week 12 · Meeting 23"
      meetingTitle="Structured Tool Calls, Agent Loops, and MCP Concepts"
      slides={slides}
      sourceCollectionLabel="Current primary-source reading set"
    />
  );
}
