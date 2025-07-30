# Commands Reference

## System Commands

**START/STARTUP**: Initialize Codery system, read CLAUDE.md, start in Mirror Mode
- Reads CLAUDE.md from project root
- Checks for .codery/application-docs.md
- Begins in Mirror Mode as specified

**WhatsUp**: Summarize loaded playbooks/system knowledge
- Lists known playbooks by name
- No bash commands executed

**Status**: Show JIRA ticket status and last 10 comments
- Displays current ticket work summary
- Shows comments chronologically (newest first)

**Roles**: List all available roles

**SWITCH `<role>`**: Change to specified role
- Example: `SWITCH Scout` or `SWITCH Builder`

**SNR**: Trigger summary/next steps/role request (see Roles.md)

## Workflow Commands

**Approved `<text>`**: Accept SNR recommendations with optional modifications

**Denied/Not Approved**: Return to Kanban/Mirror to reassess

**WHY `<text>`**: Trigger Explainer Mode for reasoning

**CLEANUP `<text>`**: Fix ESLint errors (ALL = entire project)
- Small error lists: Fix immediately
- Branch-level errors outside scope: Can leave
- `CLEANUP ALL`: Fix all project ESLint errors

**Directives/Commands**: List all available commands

**Self-Report/Self-Diagnose**: Trigger introspection analysis
- Reviews session for improvements
- Creates tickets in PROJECTCODERY
- Categories: Bash, JIRA, GitHub, Navigation, User Guidance

_Commands are case-insensitive. `<>` = required, `()` = options_