---
description: Understand the full context of a PR or JIRA ticket. Use when checking the status of a PR, reading a ticket for context, checking where a PR or ticket stands, or when a PR number or ticket ID (like COD-XX) is referenced and needs investigation.
argument-hint: <PR-number or ticket-id>
---

# Status

**Goal**: Give the user a complete understanding of where this PR/ticket stands so they can make informed decisions.

## Find the Entry Point

**PR number** → Fetch PR, find linked JIRA ticket.
**Ticket ID** → Use directly.
**No argument** → Check current branch for ticket pattern or open PR.

## Load the Hierarchy

A JIRA ticket only makes sense in its hierarchy. From the entry point, **load every ancestor up to the root, plus the entry's immediate context** — its children if it has any, otherwise its siblings. Never just the single ticket. Read comments on every loaded node; comments carry the decisions and blockers that the fields don't show.

| Entry point | Also load |
|---|---|
| Subtask | parent Story, Story's Epic, sibling subtasks |
| Story | Epic, child subtasks |
| Epic | child Stories (skip the subtask layer unless something points there) |

Don't widen further by default — sibling stories under a shared epic, or unrelated epics, only if a comment or link in the entry tree points at them.

## Think Broader

**For PRs:**
- Commits **after** the last review? Alert the user.
- Review status, CI checks, merge-readiness.

**For tickets:**
- What do comments across the hierarchy reveal about decisions and blockers?
- Is this blocked by a sibling or parent that hasn't moved?

## What to Surface

Don't list fields. Provide **insights**:
- "This subtask is part of [Story] which aims to [goal] under Epic [X]"
- "PR is approved and CI passing — ready to merge"
- "Blocked: waiting on review from @reviewer"

Start with the most actionable insight. Suggest the logical next action.
