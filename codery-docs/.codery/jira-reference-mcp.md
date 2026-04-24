# JIRA Reference (Atlassian MCP)

**Project Key**: `{{projectKey}}`
**Site / Cloud ID**: `{{jiraCloudId}}`

Pass the site hostname (or UUID) above as `cloudId` to MCP tools. The Atlassian MCP exposes tools for reading issues/comments, searching JQL, creating/editing issues, transitioning status, and adding worklogs — tool schemas are self-describing, so no command syntax is documented here.

## Preview & Approval

Display and get approval before:
- Creating a ticket
- Editing a ticket
- Commenting on a ticket **other** than the one you're actively working (parent story, sibling subtask, linked ticket)
- Commenting in a way that addresses other people (@mentions, questions for the team, decisions you want to broadcast)

Proceed without approval for:
- Status transitions
- Worklog additions
- Tracking and progress comments on the ticket you're actively working (the role-prefixed `[Scout]`, `[Builder]`, etc. lifecycle notes — these exist for your own audit trail)

The distinguishing signal is audience: if other people will read it, get approval; if it's just you documenting your own work, don't slow the loop.

## Progress Tracking

Use role-specific comment prefixes: `[Scout]`, `[Architect]`, `[Builder]`, `[CRK]`. Always read existing comments on a ticket before adding a new one.

## Git Branch Naming

- Feature: `feature/{{projectKey}}-123-description`
- Bugfix: `bugfix/{{projectKey}}-456-description`
- Hotfix: `hotfix/{{projectKey}}-789-description`

## Anti-Patterns — Never Do These

- **Skipping Preview & Approval for cross-ticket or audience-facing actions.** See the Preview & Approval section above for the audience test — tracking comments on the active ticket and status transitions are exempt.
- **Commenting without reading existing comments first.** Fetch the issue with recent comments before adding yours.
- **Hardcoded issue keys in scripts or assumptions.** Look up by summary/properties via JQL search.
- **Bypassing `codery-*` skills.** If a skill fits the task (codery-pr, codery-release, codery-audit, codery-snr, codery-status), invoke it via the Skill tool instead of forming JIRA calls directly.
