---
allowed-tools: mcp__atlassian__getJiraIssue, mcp__atlassian__getJiraIssueRemoteIssueLinks
description: Check JIRA ticket status and display recent comments
argument-hint: [ticket-id]
---

# Status Command

Fetch and display the current status of a JIRA ticket.

If no ticket ID is provided as $ARGUMENTS, prompt the user to specify which ticket they want to check.

For the specified ticket (e.g., COD-12), retrieve and display:

- Ticket title and type (Story, Task, Bug, etc.)
- Current status (To Do, In Progress, In Review, Done)
- Priority level
- Assignee (if any)
- Created and updated timestamps
- Last 10 comments in chronological order (newest first) with:
  - Author name
  - Timestamp
  - Comment body

Format the output clearly with the ticket information at the top, followed by the recent comments section. Handle cases where the ticket has no comments gracefully.

Use the configured JIRA Cloud ID: {{cloudId}}
Project Key: {{projectKey}}
