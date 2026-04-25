---
description: Author well-structured Jira tickets — epics, stories, tasks, bugs, spikes, subtasks — at the right altitude with industry-aligned conventions. Use when creating, drafting, or refining a ticket of any type, when decomposing a story into subtasks, when planning a backlog from a discovery doc, or when the user says "create a ticket", "write a story", "break this down", "add a bug for X", "add a spike for Y".
---

# Write Tickets

**Goal:** produce tickets that describe outcome and behavior at the right altitude — clear enough that any teammate picks them up cold and knows what "done" looks like, free of implementation details that belong in code, sized to ship in a sprint.

**Use when:** drafting any new ticket; decomposing a parent into subtasks; refining an existing ticket that doesn't read well; turning a discovery / Confluence doc into a backlog.

**Don't use when:** the ticket is a one-off tracking item that won't be worked; the user explicitly asks for a one-liner; the work is a true hotfix where rapid action beats authoring discipline.

## Core principles

**Outcome over output.** Lead with what changes for a user or system, not what files get touched. *How* it gets built emerges from team conversation, not from the ticket body.

**Right altitude.** Epics → outcomes. Stories → behavior. Subtasks → contracts at a surface boundary (endpoint shape, page + states + Figma link). Refactor / code-level tickets → implementation specifics. Anything below a ticket's altitude belongs in code, an ADR, or a follow-up ticket.

**Audience test for detail.** A teammate should be able to pick up a ticket cold and know what "done" looks like. Anything more specific than that is over-specification.

**INVEST when sizing feels off.** Independent, Negotiable, Valuable, Estimable, Small, Testable. A story that depends on another story to deliver value is two stories merged. A story that won't ship in a sprint is split.

**Conversation, not specification.** The ticket is a placeholder for a conversation. Acceptance criteria are the contract; everything else is context.

**Stand on its own.** Linking out is fine; deferring substance is not. "See {{projectKey}}-42" with nothing else is broken.

## Artifact types

### Epic

A multi-sprint container grouping stories toward a measurable outcome. A *tracking container*, not a unit of delivery.

**Use when:** the work obviously spans multiple sprints, multiple delivery surfaces, or multiple stakeholders, and shared progress tracking adds value.

**Structure:**
- **Outcome statement** — what becomes possible / what improves
- **Success criteria** — measurable where possible (drop-in metrics, target dates, conversion deltas)
- **Scope boundaries** — explicit in/out
- **Discovery links** — research, designs, prior decisions
- **Child stories** populate as the epic is broken down

**Good example:**
> Customer Self-Serve Account Management — enable customers to update profile, change plan, and cancel without contacting support.
> Success: 30% reduction in account-related support tickets within 60 days of launch.
> Out of scope: SSO migration, billing-history export.

**Anti-patterns:** themes masquerading as epics ("Performance" with no end); epics broken down by architectural layer rather than by user-visible increment; epics with no measurable outcome.

### Story

A sprint-sized increment of user-visible behavior. The team's primary unit of value.

**Use when:** there is a real user (internal or external) whose behavior or experience changes.

**Structure (user-story form, when a persona fits):**
- **"As a [role], I want [goal] so that [reason]"** — the *so-that* clause is the highest-leverage element; it forces articulation of why
- **Description** — context the title doesn't carry
- **Acceptance criteria** — observable conditions for done
- **Decisions** — planning-time choices made (component reuse, library choice, UX state decisions)
- **Links** — design (Figma), discovery, dependencies

**Good example:**
> *As a customer, I want to view a paginated, sortable list of my past orders, so that I can find a specific past purchase quickly.*
> AC: list paginates at 25/page; sortable by date and total; empty state shown when no orders; error state shown when fetch fails.

**Anti-patterns:** stories that read as specifications (file paths, class names, ORM choices in the body); stories combining multiple user actions; vague non-functional terms ("better performance" — see AC section for what observable looks like); forcing the user-story template on engineering work that has no user.

### Task

Sprint-sized engineering, operational, or technical work where the user-story template would be contrived.

**Use when:** there's no clean user persona — CI changes, log rotation, dependency upgrades, infrastructure migrations, internal tooling, build tooling.

**Structure:** Outcome → Scope (in/out) → Acceptance criteria → Decisions.

**Good example:**
> Migrate CI runners to Node 20.
> Done when: all pipelines green on Node 20; no remaining Node 18 references in workflow YAML; runbook updated.

**Anti-patterns:** fake user stories ("As a developer, I want CI to use Node 20…"); tasks that are really TODO lists of implementation steps; tasks with no acceptance criteria.

### Bug

A defect ticket — observed behavior diverges from intended behavior.

**Structure (treat as required fields):**
- **Summary** — one-line problem statement
- **Environment** — browser/OS/build/version, or service/region/timestamp
- **Steps to reproduce** — numbered, deterministic
- **Expected behavior**
- **Actual behavior**
- **Severity** — impact if it occurs (Blocker / Critical / Major / Minor / Trivial)
- **Priority** — fix urgency (Highest / High / Medium / Low) — distinct from severity
- **Attachments** — screenshots, logs, traces

**Severity vs priority:** two axes. A Critical bug on a low-traffic admin page can be Critical severity but Medium priority. Both matter.

**Anti-patterns:** essay-style bugs with no clear repro; multiple bugs merged into one ticket; bugs filed against unconfirmed behavior (file a question or spike instead); "intermittent / sometimes" with no further investigation.

### Spike

A time-boxed research activity. The deliverable is *knowledge*, not shippable code (origin: XP / Kent Beck).

**Use when:** a story can't be reasonably estimated or planned because of unknown technical, design, or domain risk. The signal is uncertainty, not size.

**Structure:**
- **Question(s) to answer** — explicit
- **Time-box** — explicit (days, not "as long as it takes")
- **Deliverable** — decision document, ADR, prototype repo, recommendation
- **Out of scope** — name production code explicitly; the prototype is throwaway

**Good example:**
> Spike (3 days): evaluate vector store options for semantic search.
> Decide between pgvector, Pinecone, Weaviate.
> Deliverable: ADR with recommendation, latency benchmarks at projected scale, cost estimate.
> Out of scope: production integration.

**Anti-patterns:** open-ended spikes (no time-box → research drifts forever); spikes producing production code (violates the throwaway-prototype principle); spikes whose output doesn't unblock a specific subsequent ticket.

### Subtask

A child decomposition of a parent story/task/bug, owned by a single specialist or surface, completed within the parent's sprint.

**Decomposition by delivery surface (BE / FE / DB / design / ops):** the parent story stays vertical (user-visible value); the horizontal split happens *one level lower* as a coordination artifact within a single sprint. This matches mainstream Scrum practice — but only with three guardrails:

1. **The parent story is the unit of value and what gets reported on.** Subtask completion is internal coordination; the *story closing* signals delivery.
2. **All subtasks for a parent complete in the same sprint as the parent.** A slipping subtask is a sprint risk for the parent, not a standalone item to roll forward.
3. **The frontend consumes a stub or contract early.** Backend and frontend should parallelize within the sprint, not serialize. The contract — the BE subtask's response shape — is what makes that possible.

**Subtask structure (contract-level):**
- **What this subtask delivers** — a single, surface-specific deliverable (the endpoint, the page, the migration)
- **The contract** — for an API: method, path, request shape, response shape, error cases. For a page: route, components consumed, states (loading / empty / error / success), Figma link. For a migration: schema diff, backfill plan, rollback plan.
- **Dependencies** — other subtasks this needs (be specific: "BE subtask must publish contract before FE starts wiring")
- **Out of scope** — what belongs to a sibling subtask

**Good example (BE subtask under the orders story above):**
> Add `GET /orders` endpoint with pagination and sort.
> Method: `GET`. Path: `/orders`. Query: `page` (int, default 1), `pageSize` (int, default 25, max 100), `sortBy` (`date` | `total`), `sortDir` (`asc` | `desc`).
> Response (200): `{ items: Order[], page, pageSize, totalCount }`.
> Errors: 400 on invalid `sortBy` / `sortDir` / non-positive page; 401 unauthenticated.
> Out of scope: filtering by status — sibling subtask if needed.

**Anti-patterns:** subtasks treated as standalone deliverables (defeats parent-as-unit-of-value); subtasks so granular they read as a TODO list; subtask titles that are unintelligible without the parent open in another tab; horizontal split happening at the *story* level (one BE story, one FE story shipping in different sprints — universal anti-pattern).

## Acceptance criteria

The contract for "done." Two recognized styles, both legitimate — choose by ticket character:

**Gherkin (Given / When / Then)** — strong for behavior-rich features and scenarios; maps directly to executable tests.
> Given the user is on `/orders` with 30 past orders, when they sort by total descending, then the highest-total order appears at row 1.

**Checklist** — flat list of conditions; lower ceremony; common for CRUD, technical work, content changes.
> - [ ] List paginates at 25/page
> - [ ] Sortable by date and total
> - [ ] Empty state shown when no orders
> - [ ] Error state shown when fetch fails

Authored collaboratively (PO + dev + QA) during refinement. Live on the ticket itself, not in a separate document. Distinct from Definition of Done — AC are story-specific; DoD applies to every story.

**Observable beats subjective.** "Is performant" is not an AC; "p95 < 200ms at 100 concurrent users" is.

## Definition of Ready vs Definition of Done

**Definition of Ready (DoR)** — *optional* gate for entering a sprint. Not in the Scrum Guide. Typical contents: clear AC, dependencies identified, design artifacts attached, sized, no obvious blockers.

**Definition of Done (DoD)** — *formal Scrum commitment*. Applies uniformly to all stories. Typical contents: code reviewed, tests written and passing, documentation updated, deployed per team policy, observability in place.

Both live *outside* individual tickets — typically in the team's working agreement or a Confluence page — and are referenced, not restated.

## Story splitting

When a story is too large for a sprint, split it. The unifying principle across all valid splits is the **vertical slice** — each split still cuts through every architectural layer needed to deliver observable value. Splitting "build the API" + "build the UI" violates *Independent* and *Valuable* in INVEST and is the canonical anti-pattern.

Patterns to reach for, in rough preference order (Lawrence / Humanizing Work):

- **Workflow steps** — ship the simplest end-to-end path first, then add steps
- **Operations (CRUD)** — read first, then create, then update, then delete
- **Business rule variations** — simplest rule first, exotic rules later
- **Data variations** — one data type / region / currency first
- **Data entry methods** — minimal UI first, fancier UI later
- **Major effort** — when most of the cost is one-time setup, ship the first variant fully so the rest are cheap
- **Simple / complex** — smallest valuable version first
- **Defer performance** — make it work, then make it fast
- **Spike** — when even splitting is unclear, time-box research first

## Decisions section, and the ADR upgrade path

Planning-time decisions (component reuse, library choice, state-machine choices, UX state decisions) belong in a **Decisions** section in the ticket body. Without this section, decisions vanish into Slack and get rediscovered later.

**Upgrade path: ADRs.** Decisions that *outlive the ticket* — architectural choices that constrain future work (database choice, auth model, API style, framework selection) — should be promoted to **Architecture Decision Records** committed to the repo. Canonical Nygard format: Title / Status / Context / Decision / Consequences. See [adr.github.io](https://adr.github.io).

**Rule of thumb:** if the decision will still matter to a new engineer six months from now, it's an ADR. If it only matters until the ticket closes, the Decisions section is enough.

## Anti-patterns — never do these

- **Implementation details in feature ticket bodies** — file paths, class names, ORM choices belong in code or ADRs, not story descriptions. Refactor and code-level tickets are the exception.
- **Forcing the user-story template on engineering work** — fake personas weaken the format everywhere it's used. Use a Task instead.
- **Subtasks split horizontally at the story level** — one BE story, one FE story shipping in different sprints. The split goes one level lower, or stays vertical.
- **Open-ended spikes** — no time-box means no exit criterion.
- **Bugs without repro** — "it crashes sometimes" is a question to investigate, not a ticket to fix.
- **Acceptance criteria that aren't observable** — replace adjectives with measurements.
- **Decisions that should be ADRs hidden inside ticket bodies** — they get lost when the ticket archives.
- **Tickets that defer to external links for substance** — the ticket should stand on its own.
- **Restating Definition of Done on every ticket** — DoD is team-wide; reference, don't restate.
- **Estimating a spike in story points** — spikes are time-boxed, not pointed; the work is exploration, not delivery.
