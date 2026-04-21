---
description: Autopilot mode — autonomously take a ticket from interpretation to draft PR without per-step approval. Only run when the user explicitly invokes this skill with a JIRA ticket ID. Never auto-triggers.
argument-hint: <ticket-id>
disable-model-invocation: true
---

# Autopilot

**Goal:** Take a JIRA ticket through the full Codery lifecycle — interpretation, design, implementation, verification, PR — without asking the user for approval at each step. The user's one intervention point is at the start (Mirror) and the end (reviewing the draft PR).

**When to use:** Only when the user explicitly invokes this skill with a ticket ID. Never self-trigger.

## The one gate: Mirror

Before any autonomous action: read the ticket (delegate to `codery-status`), restate your understanding, list assumptions, and ask targeted clarifying questions. Wait for explicit user confirmation before starting the autonomous run.

This is the only approval gate. If Mirror interpretation is wrong, the entire autonomous run is wasted — so this gate is non-negotiable.

## Operating principles (autonomous run)

After Mirror confirmation, run the lifecycle (Scout → Architect → CRK → Builder → Verify → PR) without pausing for approval. How you do each step is your judgment; the principles below shape it.

**Delegation over re-implementation.** At each step, scan available skills for a matching one and use it. `codery-status` for ticket lookup, `codery-pr` for PR creation (as draft), project Figma or similar skills when context calls for them. Don't rewrite logic that already exists.

**CRK is externally validated.** Self-grading is theater — the model that designed something can't fairly grade it. Before Builder, either call `advisor()` for a second opinion (preferred — sees full session), or spawn a subagent with an explicit payload (ticket, design, risks, intended diff) asking what's being overlooked. Act on flagged concerns rather than dismissing them.

**JIRA is the accountability trail.** With no human watching, every meaningful transition must leave a trace — what you did, what you observed, what's next. Tag `[Autopilot]` for filterability. Pause comments must be specific enough that the user can unblock you without re-reading the whole trail.

**Draft PR is the endpoint.** Never mark ready-for-review. Never merge. Human review of the draft is the final gate.

**Branches are cheap.** New feature branch per run. On abort, leave it dirty for inspection — no cleanup, no reset.

## Mechanical specifics (prescriptive)

These don't need judgment — follow exactly:

- Branch name: `feature/<ticket-id>-<slug>`
- Commit format: conventional commits with ticket reference
- PR state: draft (pass `--draft` to `codery-pr`, or use `gh pr create --draft` directly)

## When to pause

Hand back to the user when:

- Mirror clarifications are unresolved.
- CRK second opinion flags unresolved concerns, or unknowns remain listed.
- Verification fails and you can't auto-diagnose (typos fine to fix; logic bugs need human).
- Required credentials, deps, or context are missing.
- A delegated skill returns a blocking error.

On pause: log reason to JIRA, leave the branch, exit cleanly. Resume when the user unblocks you.

## Anti-patterns

- Starting the autonomous run without Mirror confirmation.
- Re-implementing logic a sibling skill owns.
- Marking the PR ready-for-review or merging it.
- Passing CRK with unresolved unknowns.
- Blind-retrying a verification failure.
- Skeletal JIRA comments that don't explain what happened.
