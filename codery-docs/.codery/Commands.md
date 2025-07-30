# Commands Reference

## System Commands

**START/STARTUP**: Initialize Codery system, read CLAUDE.md, start in Mirror Mode

**WhatsUp**: Summarize loaded playbooks/system knowledge

**Status**: Show JIRA ticket status and last 10 comments

**Roles**: List all available roles

**SWITCH `<role>`**: Change to specified role

**SNR**: Trigger summary/next steps/role request (see Roles.md)

## Workflow Commands

**Approved `<text>`**: Accept SNR recommendations with optional modifications

**Denied/Not Approved**: Return to Kanban/Mirror to reassess

**WHY `<text>`**: Trigger Explainer Mode for reasoning

**CLEANUP `<text>`**: Fix ESLint errors (ALL = entire project)

**Directives/Commands**: List all available commands

**Self-Report/Self-Diagnose**: Trigger introspection analysis

_Commands are case-insensitive. `<>` = required, `()` = options_