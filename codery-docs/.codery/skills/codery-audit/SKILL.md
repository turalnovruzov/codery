---
description: Review a PR with linked JIRA context, discuss findings, and generate report
argument-hint: <PR-number or ticket-id>
---

# Audit

Perform a comprehensive PR review in the main conversation context for iterative discussion.

## Context Loading

**If PR number given**: Fetch PR details + diff, find linked JIRA ticket.
**If ticket ID given**: Fetch ticket, find linked PR + diff.
**If no argument**: Check current branch for ticket ID or open PR.

## Review Process

### 1. Requirements Compliance
Extract requirements from JIRA ticket. Map each to implementation. Flag missing or partial implementations.

### 2. Code Quality Review
- **Security**: Authentication, authorization, data exposure, injection risks
- **Performance**: Query efficiency, caching, resource management
- **Quality**: Readability, naming, error handling, DRY principle
- **Standards**: Project conventions from CLAUDE.md and application-docs
- **Tests**: Coverage for new/modified code

### 3. Present Findings
Organize by severity: **Critical** (must fix) → **Recommendations** (should consider) → **Positive Notes** (good patterns).

## Interactive Discussion

After presenting findings, engage in discussion. Answer questions, clarify concerns, discuss alternatives, reach consensus.

## Final Report

When user requests ("generate report"), create `reviews/PR-<number>-review.md` with: summary, requirements compliance table, findings by severity, conclusion.

After reviewing, mention: "Run `/codery-docs-check` to verify docs are up to date."
