# JIRA Reference (Atlassian MCP)

**Project Key**: `{{projectKey}}`
**Site / Cloud ID**: `{{jiraCloudId}}`

Pass the site hostname (or UUID) above as `cloudId` to MCP tools. The Atlassian MCP exposes tools for reading issues/comments, searching JQL, creating/editing issues, transitioning status, and adding worklogs — tool schemas are self-describing, so no command syntax is documented here.

## Preview & Approval

Before creating a ticket, editing a ticket, or adding a comment: display the intended content to the user, ask for approval, then proceed. Transitions and worklog additions proceed without approval — they're core workflow, not content creation.

## Progress Tracking

Use role-specific comment prefixes: `[Scout]`, `[Architect]`, `[Builder]`, `[CRK]`. Always read existing comments on a ticket before adding a new one.

## Git Branch Naming

- Feature: `feature/{{projectKey}}-123-description`
- Bugfix: `bugfix/{{projectKey}}-456-description`
- Hotfix: `hotfix/{{projectKey}}-789-description`

## Anti-Patterns — Never Do These

- **Creating, editing, or commenting without the Preview & Approval step.** Show details and get approval first. (Transitions and worklogs are exempt.)
- **Commenting without reading existing comments first.** Fetch the issue with recent comments before adding yours.
- **Hardcoded issue keys in scripts or assumptions.** Look up by summary/properties via JQL search.
- **Bypassing `codery-*` skills.** If a skill fits the task (codery-pr, codery-release, codery-audit, codery-snr, codery-status), invoke it via the Skill tool instead of forming JIRA calls directly.
