# JIRA Workflow for Codery

## Overview

Codery integrates with JIRA for comprehensive project tracking and management.

## Core JIRA Concepts

Standard Agile work item types:

- **Epics**: Large features spanning multiple sprints
- **Stories**: User-facing functionality with acceptance criteria  
- **Tasks**: Technical work items
- **Bugs**: Defects requiring fixes
- **Sub-tasks**: Breakdown of larger items

## Workflow States

Standard JIRA workflow progression:

1. **To Do** - Work not yet started
2. **In Progress** - Active development
3. **In Review** - Code review/PR stage  
4. **Done** - Work completed and merged

## Preview & Approval Requirements

**MANDATORY**: Before any JIRA ticket create or edit operation:
1. Display the full ticket details to the user
2. Ask for explicit approval: "Do you approve creating/editing this ticket?"
3. Only proceed with the tool call after receiving confirmation ("approved", "yes", "create it", etc.)

## Git Integration

Every Git branch must reference a JIRA ticket:

- Feature branches: `feature/{{projectKey}}-123-description`
- Bug fixes: `bugfix/{{projectKey}}-456-description`
- Hotfixes: `hotfix/{{projectKey}}-789-description`

## Comment Standards

JIRA comments must document substance, not just activity:

### Good Examples

- "Found root cause: Database connection pool exhausted under load"
- "Design decision: Chose Redis for session storage due to TTL requirements"
- "Implementation complete: Added JWT auth with 15-minute expiry"

### Poor Examples

- "Worked on ticket"
- "Made progress"
- "Updated code"

## Best Practices

1. **Link Everything**: Connect PRs, commits, and related tickets
2. **Update Regularly**: Transition status as work progresses
3. **Document Decisions**: Use comments for future reference
4. **Use Labels**: Apply team-specific labels and components

Remember: JIRA is the single source of truth for all project work. Every code change must trace back to a JIRA ticket.
