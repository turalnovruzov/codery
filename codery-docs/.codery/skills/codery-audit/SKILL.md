---
description: Multi-phase audit of a PR — acceptance criteria, functional verification, design fidelity, code review. Use when reviewing a PR, auditing code, doing a code review, checking if changes are ready to merge, or getting feedback on implementation before merging.
argument-hint: <PR-number or ticket-id>
---

# Audit

Run a comprehensive 4-phase audit on a PR — not just code review. The audit answers four questions in order:

1. **Does this PR satisfy the ticket's acceptance criteria?** (Phase 1)
2. **Does the feature actually work when run?** (Phase 2)
3. **Where there's a design source of truth, does the implementation match?** (Phase 3)
4. **Is the code itself healthy?** (Phase 4)

All phases run regardless of upstream results. Each phase produces findings + a status. The overall verdict is computed from phase statuses combined.

## Context Loading

- **PR number given** → fetch PR diff, find linked JIRA ticket
- **Ticket ID given** → fetch ticket, find linked PR + diff
- **No argument** → check current branch for ticket pattern or open PR

For ticket reading, delegate to `codery-status` when fuller hierarchy context (parent epic, sibling tickets) is needed.

## The Pipeline

Each phase has a focused playbook. Run them in order; do not skip on prior-phase failure.

1. **Phase 1 — Acceptance Criteria.** Follow [phase-1-acceptance.md](phase-1-acceptance.md).
2. **Phase 2 — Functional Verification.** Follow [phase-2-verify.md](phase-2-verify.md).
3. **Phase 3 — Design Fidelity.** Follow [phase-3-design.md](phase-3-design.md). (`not-applicable` when no design source exists; phase is omitted from the report.)
4. **Phase 4 — Code Review.** Follow [phase-4-code-review.md](phase-4-code-review.md).

Each phase reports a status: `passed` / `partial` / `failed` / `blocked` / `not-applicable`.

## Verdict Computation

One overall verdict, computed from the four phase statuses:

- **`changes-required`** — any phase = `failed`
- **`cannot-verify`** — any phase = `blocked` and no phase = `failed`
- **`ready-to-merge`** — every phase that ran is `passed` or `partial` (and at least Phase 4 ran)

`not-applicable` does not contribute to the verdict.

## Consolidated Report (private draft)

After all phases run, present a single private draft to the user. Do not post to GitHub yet. Format:

```text
# Audit — PR #<n> / <ticket-id>

## Verdict: <READY-TO-MERGE | CHANGES-REQUIRED | CANNOT-VERIFY>

| Phase | Status |
|---|---|
| 1. Acceptance Criteria | <status> |
| 2. Functional Verification | <status> |
| 3. Design Fidelity | <status or n/a> |
| 4. Code Review | <status> |

---

[Phase 1 output block]

[Phase 2 output block]

[Phase 3 output block — omitted if not-applicable]

[Phase 4 output block]
```

Tone for the private draft: direct, specific, sharp — for the user's review, not public consumption.

## Interactive Discussion

After presenting the draft, discuss with the user. Answer questions, clarify findings, accept pushback where the user has merit, hold firm where code health is at stake. Reach consensus before posting.

## Posting to GitHub

Only after explicit approval ("post it", "submit", "ready"):

1. **Inline comments by default.** Use `gh api` with PR review-comment endpoints to attach per-line comments at specific code locations. Reserve the top-level review body for a brief summary plus the verdict.
2. **Severity labels in comments.** Prefix each comment: `Critical:` / `Important:` / `Nit:` / `Optional:` / `Consider:` / `FYI:` / `Praise:`. Phase 1 / 2 / 3 findings can ride in the top-level body when they don't have a single anchor line; Phase 4 findings are inline by default.
3. **Soften the public tone.** Phrase as questions or suggestions where appropriate ("Consider extracting…" not "This should be extracted"). Strip the private-draft sharpness; preserve specificity.
4. **Approval type.** APPROVE / REQUEST_CHANGES / COMMENT — choose from the verdict and severity counts.

Never post without explicit approval. Never post the private draft verbatim.

## After Posting

Mention to the user: "Run `/codery-docs-check` to verify docs are up to date — audits frequently uncover doc drift."

## Anti-Patterns

- Skipping a phase because a prior one failed
- Posting the private draft to GitHub without explicit approval
- Inventing acceptance criteria when the ticket has none (Phase 1 is `not-applicable`, not "lowered bar")
- Manufacturing test data to make Phase 2 "pass"
- Critiquing the design itself in Phase 3 — fidelity to source only
- Flagging things CI catches in Phase 4
