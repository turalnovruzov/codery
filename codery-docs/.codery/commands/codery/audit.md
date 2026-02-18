---
description: Review a PR with linked JIRA context, discuss findings, and generate report
argument-hint: <PR-number or ticket-id>
---

# Review Command

Perform a comprehensive review of a PR directly in the main conversation context. This enables iterative discussion about findings with the user.

## Context Loading

Based on the argument provided, automatically load all related context:

**If PR number given** (e.g., `123`, `#123`):
1. Run `gh pr view <number>` to get PR details (title, body, author, status)
2. Run `gh pr diff <number>` to get all changes
3. Parse PR body/title for JIRA ticket ID (pattern: `COD-XXX`)
4. If ticket found, fetch JIRA ticket details

**If ticket ID given** (e.g., `COD-123`):
1. Fetch JIRA ticket details (summary, description, acceptance criteria)
2. Check for linked PRs in remote links
3. If PR found, fetch PR details and diff

**If no argument given**:
1. Check current branch name for ticket ID pattern
2. Check for open PR on current branch via `gh pr view`

## Review Process

After loading context, perform the review directly (no subagents):

### 1. Requirements Compliance
- Extract requirements from JIRA ticket
- Map each requirement to implementation
- Flag any missing or partial implementations

### 2. Code Quality Review
- **Security**: Authentication, authorization, data exposure, injection risks
- **Performance**: Query efficiency, caching, resource management
- **Quality**: Readability, naming, error handling, DRY principle
- **Standards**: Project conventions from CLAUDE.md and application-docs
- **Tests**: Coverage for new/modified code

### 3. Present Findings
Present findings organized by severity:
- **Critical**: Must fix before merge
- **Recommendations**: Should consider
- **Positive Notes**: Good patterns observed

## Interactive Discussion

After presenting findings, engage in discussion with the user:
- Answer questions about specific findings
- Clarify concerns
- Discuss alternative approaches
- Reach consensus on what needs to change

## Final Report

When the user requests (e.g., "generate report", "write the review"), create a Markdown file:

**Default location**: `reviews/PR-<number>-review.md` (create `reviews/` directory if needed)

**Report format**:
```markdown
# PR Review: #<number> - <PR Title>

**Ticket**: COD-XXX
**Author**: <PR author>
**Reviewer**: <User>
**Date**: YYYY-MM-DD

## Summary
<Brief overview of what was reviewed and overall assessment>

## Requirements Compliance
| Requirement | Status | Notes |
|-------------|--------|-------|
| ... | Met/Partial/Missing | ... |

## Findings

### Critical Issues
- [ ] Issue description (file:line)

### Recommendations
- [ ] Suggestion description (file:line)

### Positive Notes
- Good pattern observed at...

## Conclusion
<Overall assessment and approval recommendation>
```

## Important Notes

- Review happens in main context for full discussion capability
- Do NOT use subagents - findings must be discussable
- Load all context upfront so conversation can reference it
- Only write the report file when user explicitly requests it
