---
description: Review a PR with linked JIRA context, discuss findings, and generate report. Use when reviewing a PR, auditing code, doing a code review, checking if changes are ready to merge, or getting feedback on implementation before merging.
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

### 2. Pattern Comparison
Find 1-3 prior merged PRs in the same area of the codebase (same feature surface, same framework area, same file type). Use `gh pr list` with relevant filters or `git log` on the target files. Diff the current PR's approach against what was done before:

- Does it follow established naming, structure, and conventions?
- Does it contradict recent decisions without explanation?
- Does it introduce a new pattern that should be explicitly justified?

If the PR diverges from prior patterns without explicit justification, flag it as a finding.

### 3. Code Quality Review
- **Security**: Authentication, authorization, data exposure, injection risks
- **Performance**: Query efficiency, caching, resource management
- **Quality**: Readability, naming, error handling, DRY principle
- **Standards**: Project conventions from CLAUDE.md and application-docs
- **Tests**: Coverage for new/modified code

### 4. Present Findings (Private Draft)
Organize by severity: **Critical** (must fix) → **Recommendations** (should consider) → **Positive Notes** (good patterns). This is a private draft in the conversation — not a GitHub post. Tone: direct, specific, sharp — for the user's review, not public consumption. Do NOT post to GitHub yet.

## Interactive Discussion

After presenting the private draft, engage in discussion. Answer questions, clarify concerns, discuss alternatives, reach consensus.

## Posting to GitHub

Only after the user explicitly approves posting (e.g., "post it", "submit", "ready"):

1. **Inline comments by default.** Use `gh api` with the PR review-comment endpoints to attach per-line comments on the specific code locations. Reserve the top-level review body for a brief summary.
2. **Softer public tone.** Phrase findings as questions or suggestions where appropriate ("Consider extracting..." vs "This should be extracted"). Keep critique specific; strip the private-draft sharpness.
3. **Approval type.** APPROVE / REQUEST_CHANGES / COMMENT, chosen from finding severity.

Never post without explicit approval. Never post the private draft verbatim.

## Final Report

When user requests ("generate report"), create `reviews/PR-<number>-review.md` with: summary, requirements compliance table, findings by severity, conclusion.

After reviewing, mention: "Run `/codery-docs-check` to verify docs are up to date."
