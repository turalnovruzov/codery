---
description: Check JIRA ticket and/or PR status with auto-linking
argument-hint: <PR-number or ticket-id>
---

# Status Command

Fetch and display the current status of a JIRA ticket and/or PR, automatically linking related items.

## Auto-Linking Logic

**If PR number given** (e.g., `123`, `#123`):
1. Run `gh pr view <number>` to get PR details
2. Parse PR title/body for JIRA ticket ID (pattern: `COD-XXX`)
3. If ticket found, also fetch JIRA ticket details

**If ticket ID given** (e.g., `COD-123`):
1. Fetch JIRA ticket details
2. Check remote links for associated PR
3. If PR found, also fetch PR details

**If no argument given**:
1. Check current branch name for ticket ID pattern (e.g., `feature/COD-123-description`)
2. Check for open PR on current branch via `gh pr view`
3. Load whatever context is found

## Display Format

### PR Information (if available)
- Title and number
- Status (open, merged, closed)
- Author and reviewers
- Branch info (head → base)
- Check status (CI passing/failing)
- Recent review comments summary

### Ticket Information (if available)
- Title and type (Story, Task, Bug, etc.)
- Current status (To Do, In Progress, In Review, Done)
- Priority level
- Assignee (if any)
- Created and updated timestamps

### Recent Activity Summary
Analyze the last 10 JIRA comments and provide a concise summary of:
- What has been achieved recently
- Key decisions made
- Current progress status
- Any blockers or issues identified

Group related activities together (e.g., all Scout findings, all Architecture decisions, all Builder implementations) and highlight the most significant developments. Focus on outcomes rather than just listing actions.

## Example Output

```
## PR #45: Add user authentication
Status: Open | Checks: Passing
Author: @developer | Reviewers: @reviewer1
Branch: feature/COD-31-auth → main

## Ticket: COD-31 - Implement user authentication
Type: Story | Status: In Progress | Priority: High
Assignee: developer@example.com

### Recent Activity
- [Builder] Implemented JWT token generation and validation
- [Architect] Decided on stateless auth with 15-min token expiry
- [Scout] Researched OAuth vs JWT, recommended JWT for simplicity

### Current State
Implementation complete, awaiting code review.
```
