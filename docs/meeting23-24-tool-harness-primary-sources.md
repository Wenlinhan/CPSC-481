# Meetings 23–24: tool-using AI and harness source dossier

Verified July 29, 2026. These meetings stay at an introductory systems level: students should understand the execution boundary and be able to inspect a small tool loop, not build a production multi-agent platform.

## Meeting 23: structured tool calls, loops, and MCP concepts

### Required knowledge points

1. **Text is not an action.** A model proposes a named tool call and structured arguments; application code owns schema validation, authorization, execution, timeout, error handling, and returned evidence.
2. **Schemas constrain form, not intent.** A valid JSON object can still target the wrong file, person, account, or scope.
3. **Observe–decide–act–observe loop.** Tool results return as new evidence. The loop needs a stop condition, step/time/cost budget, and explicit error/retry behavior.
4. **Read versus write consequences.** A search/list/read tool and a send/delete/pay tool require different permissions and approval policies.
5. **MCP architecture.** A host application establishes client connections to servers. The protocol uses JSON-RPC 2.0 plus lifecycle and capability negotiation.
6. **MCP server primitives.**
   - Tools: executable functions that may perform actions.
   - Resources: contextual data addressed by URI.
   - Prompts: reusable interaction templates.
7. **Discovery is not trust.** Listing a capability does not authorize its use, prove its output, or make the server safe.
8. **Small laboratory.** Inspect a read-only course-search schema, validate valid/invalid calls, trace one loop, classify tools/resources/prompts, and state the remaining security boundary.

### Primary sources

- MCP architecture overview: https://modelcontextprotocol.io/docs/learn/architecture
- MCP 2025-11-25 schema: https://modelcontextprotocol.io/specification/2025-11-25/schema
- MCP resources: https://modelcontextprotocol.io/specification/2025-11-25/server/resources
- OpenAI Agents SDK tools guide: https://openai.github.io/openai-agents-js/guides/tools/

## Meeting 24: harness state, permissions, approval, logging, and evaluation

### Working definition

A harness is the application and runtime around a model that manages instructions, context, durable state, tools, permissions, approvals, budgets, retries, errors, logs, tests, and recovery. “Agent” describes a behavior or workflow; “harness” names the control system that makes that behavior observable and governable.

### Required knowledge points

1. **Explicit task state.** Planned, running, awaiting approval, retrying, completed, failed, and cancelled states make a workflow resumable and inspectable.
2. **Least privilege.** Grant the smallest capability, target scope, duration, and credential necessary.
3. **Approval is a control decision.** Preview the exact action, target, arguments, consequences, and reversibility. Approval must occur before the consequential action and survive pause/resume without silently widening scope.
4. **Input/output/tool guardrails have different boundaries.** A workflow-level input guardrail does not automatically validate every nested tool. Tool-call validation must be placed at the execution boundary.
5. **Budgets and termination.** Limit steps, time, cost, retries, parallelism, and recursion. Define success and escalation conditions.
6. **Tracing and auditability.** Record model decisions, tool calls, results, approvals, errors, handoffs, and redactions with correlation IDs. Logs can contain sensitive data and require minimization and access control.
7. **Untrusted context.** Retrieved pages, files, tool descriptions, and tool results may contain prompt injection. Treat content as data; do not let it redefine authority.
8. **Sandbox and secret handling.** Isolate code, filesystem, network, and credentials; never place secrets in prompts or unnecessarily persisted state.
9. **Recovery.** Make retries idempotent where possible, preview irreversible operations, checkpoint state, and support cancel/rollback or compensating action.
10. **Task-level evaluation.** Test success, correctness, side effects, unsafe action rate, false approvals, recovery, latency, and cost—not only final prose quality.

### Security concepts to teach, not implement deeply

- MCP’s current authorization specification uses OAuth-oriented controls, resource indicators, audience-bound tokens, scope minimization, PKCE, and secure redirect rules.
- Security guidance warns about confused deputies, token passthrough, SSRF, session hijacking, malicious local servers, prompt injection, and over-broad scope.
- A protocol standardizes communication; it does not remove the host’s responsibility for trust, consent, permissions, sandboxing, validation, and monitoring.

### Primary sources

- MCP authorization, 2025-11-25: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
- MCP security best practices: https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- OpenAI Agents SDK human-in-the-loop: https://openai.github.io/openai-agents-js/guides/human-in-the-loop/
- OpenAI Agents SDK guardrails: https://openai.github.io/openai-agents-js/guides/guardrails/
- OpenAI Agents SDK tracing: https://openai.github.io/openai-agents-js/guides/tracing/
- OpenAI Agents SDK sessions/state: https://openai.github.io/openai-agents-js/guides/sessions/

## Deliberate exclusions

- no distributed multi-agent framework survey;
- no production OAuth implementation laboratory;
- no autonomous long-running deployment;
- no vendor leaderboard;
- no claim that guardrails, MCP, or approval eliminate prompt injection;
- no broad write-capable live tools in class.
