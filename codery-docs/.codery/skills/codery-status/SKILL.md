---
description: Understand the full context of a PR or JIRA ticket. Use when needing to gather context about a specific PR or JIRA ticket — checking progress, understanding where work stands, loading context before continuing on a ticket, or when a PR number or ticket ID is referenced and its status is relevant.
argument-hint: <PR-number or ticket-id>
---

# Status

**Goal**: Give the user a complete understanding of where this PR/ticket stands so they can make informed decisions.

## Context Loading

Based on the argument, load related context:

**If PR number given**: Fetch PR details, find linked JIRA ticket, load both.
**If ticket ID given**: Fetch ticket, check for linked PR, load both.
**If no argument**: Check current branch for ticket pattern or open PR.

## Think Broader

**For PRs, consider:**
- Are there commits **after** the last review? Alert user if so.
- What's the review status? Are CI checks passing?

**For JIRA tickets, consider:**
- Is this a **subtask**? Read the parent Story/Epic for bigger picture.
- Are there **sibling tasks** that provide context?
- What do the comments reveal about decisions made?

## What to Surface

Don't just list fields. Provide **insights**:
- "This subtask is part of [Story] which aims to [goal]"
- "PR is approved and CI passing - ready to merge"
- "Blocked: waiting on review from @reviewer"

Start with the most actionable insight. Suggest logical next action.
