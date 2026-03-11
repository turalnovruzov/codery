# JIRA Reference

**Cloud ID**: `{{cloudId}}`
**Project Key**: `{{projectKey}}`

## Workflow States

1. **To Do** → **In Progress** → **In Review** → **Done**

## Preview & Approval

Before any JIRA ticket create or edit: display details to user, ask for approval, then proceed.

## Git Branch Naming

- Feature: `feature/{{projectKey}}-123-description`
- Bugfix: `bugfix/{{projectKey}}-456-description`
- Hotfix: `hotfix/{{projectKey}}-789-description`

## MCP Integration

Use Atlassian MCP tools for all JIRA operations. Claude Code has automatic access to manage issues, comments, and workflows.

## Progress Tracking

Use role-specific comment prefixes: `[Scout]`, `[Architect]`, `[Builder]`, `[CRK]`. Always read comments before continuing work on a ticket.
