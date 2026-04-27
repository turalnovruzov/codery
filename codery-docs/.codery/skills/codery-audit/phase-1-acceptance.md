# Phase 1 — Acceptance Criteria

**Goal:** Determine whether the PR delivers what the ticket asked for. Answer: does this PR close this ticket?

**Inputs:** linked JIRA ticket (description + AC section + comments), PR diff, PR description.

## Signals — when "AC" exists

- An "Acceptance Criteria" / "AC" / "Done when" section in the ticket body
- A checklist of testable conditions the ticket explicitly defines as done

What does NOT count as AC:

- A general description ("we should add a button") — that's context, not criteria
- Inferred requirements from the title alone
- Bullet points buried in scope/why sections — only an explicit AC section qualifies

Comments that explicitly add or revise AC count if framed as scope changes; otherwise treat as context.

## Principles

- **Strict.** No explicit AC section → phase is `not-applicable`. Do not invent criteria. Lack of AC is a ticket-quality signal, not a reason to lower the bar.
- **Map, don't restate.** For each requirement, cite the file and line range that delivers it. The mapping is a reusable artifact — Phase 2 uses it as the verification plan.
- **Don't second-guess the requirements themselves.** That's a ticket conversation, not an audit. Flag ambiguous AC; score against the most plausible reading.
- **Scope creep is its own finding.** Implementation that goes beyond AC gets flagged separately, never counted as extra credit toward AC.

## Scoring per requirement

- `met` — clear, observable delivery in the diff
- `partial` — partly delivered, with named gaps
- `not-met` — required, not delivered
- `scope-creep` — flagged separately, does not contribute to status

## Phase status

- `passed` — all requirements `met`
- `partial` — at least one `partial`, no `not-met`
- `failed` — at least one `not-met`
- `not-applicable` — no extractable explicit AC

## Anti-patterns

- Manufacturing AC from the description when no AC section exists
- Lowering the bar because the ticket is sparse
- Demanding things the AC doesn't ask for
- Treating scope creep as a positive

## Output for the consolidated report

```text
Phase 1 — Acceptance Criteria: <STATUS>

  ✅ Met (N):
    - <requirement> → file:line-range

  ⚠️  Partial (N):
    - <requirement> → file:line-range
      Gap: <what's missing>

  ❌ Not met (N):
    - <requirement>
      Reason: <why>

  📦 Scope creep (N):
    - <what was added> → file:line-range
      Intentional? <flag for discussion>
```
