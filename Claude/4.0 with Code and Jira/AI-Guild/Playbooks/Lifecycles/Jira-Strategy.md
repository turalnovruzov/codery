# JIRA Strategy for AI-Guild

## Overview
This document defines the **JIRA workflow**, **ticket types**, and **integration with Git** for managing work items in the AI-Guild system. JIRA replaces the previous IFE (Issue/Feature/Epic) tracking system, providing a more robust and industry-standard approach to project management.

---

## Core Concepts

### JIRA Issue Types
- **Bug**: Defects, fixes, small improvements (replaces IFE Issues)
- **Task**: Technical work items, refactoring, documentation
- **Story**: User-facing features and enhancements (replaces IFE Features)
- **Epic**: Large multi-phase efforts with architectural impact (replaces IFE Epics)

### JIRA Workflow States
1. **To Do**: Work not yet started
2. **In Progress**: Actively being worked on
3. **In Review**: Code complete, awaiting review
4. **Done**: Completed and verified

### Labeling Strategy
Every ticket should have:
1. **Work Type Label**: `broken`, `new-feature`, `enhancement`, `tech-debt`
2. **Domain Label**: `domain-events`, `domain-venues`, `domain-users`, `domain-auth`, etc.
3. **Additional Labels**: `frontend`, `backend`, `api`, `database` as appropriate

---

## Creating Work Items

### When to Create Each Type

| Situation | JIRA Type | Example |
|-----------|-----------|---------|
| Something is broken | Bug | "Login button not responding on mobile" |
| New user-facing capability | Story | "Add event filtering by date range" |
| Technical work (non-user facing) | Task | "Refactor context providers" |
| Multi-phase architectural change | Epic | "Migrate to new authentication system" |

### Using jira-create-classified.sh
```bash
# Bug fix
./jira-create-classified.sh "Fix login button on mobile" "broken" "auth" "Button doesn't respond to clicks on iOS devices"

# New feature
./jira-create-classified.sh "Add date range filter" "new-feature" "events" "Users need to filter events by custom date ranges" "Story"

# Technical task
./jira-create-classified.sh "Refactor auth context" "tech-debt" "auth" "Consolidate duplicate auth logic" "Task"
```

---

## Git Integration

### Branch Naming Convention
| JIRA Type | Branch Format | Example |
|-----------|---------------|---------|
| Bug | `bugfix/PROJ-123-short-description` | `bugfix/TIEMPO-101-fix-login-mobile` |
| Task | `task/PROJ-123-short-description` | `task/TIEMPO-102-refactor-auth` |
| Story | `feature/PROJ-123-short-description` | `feature/TIEMPO-103-date-filter` |
| Epic | `epic/PROJ-123-phase-N-description` | `epic/TIEMPO-104-phase-1-db-migration` |

### Git Workflow
1. **Start from DEVL branch**
2. **Create feature branch** with JIRA ticket number
3. **First commit** must reference JIRA ticket
4. **Update JIRA status** as work progresses
5. **Log time by role** using jira-worklog.sh
6. **Create PR** with JIRA ticket in title
7. **Merge to DEVL** after review
8. **Update JIRA to Done**

### Commit Message Format
```
TIEMPO-123: Brief description of change

- Detailed point 1
- Detailed point 2

AI-Guild Role: Builder
```

---

## AI-Guild Role Integration

### Time Logging by Role
Always log work with the appropriate AI-Guild role:

```bash
# Scout investigation
./jira-worklog.sh add "TIEMPO-123" "Scout" "30m" "Investigated existing code and requirements"

# Architect design
./jira-worklog.sh add "TIEMPO-123" "Architect" "1h" "Designed component architecture and data flow"

# Builder implementation
./jira-worklog.sh add "TIEMPO-123" "Builder" "2h" "Implemented feature with tests"

# CRK review
./jira-worklog.sh add "TIEMPO-123" "CRK" "45m" "Code review and knowledge documentation"
```

### Role Workflow in JIRA
1. **Scout**: Investigation phase (To Do → In Progress)
2. **Architect**: Design phase (add design notes to ticket)
3. **Builder**: Implementation (main development work)
4. **CRK**: Review phase (In Progress → In Review → Done)

---

## Epic Management

### Epic Structure in JIRA
Epics in JIRA maintain the phased approach from IFE:

1. **Create Epic** with clear phases defined in description
2. **Create child tickets** for each phase
3. **Work one phase at a time**
4. **Complete phase** before starting next

### Epic Documentation
Store detailed Epic documentation in the codebase:
- Location: `/docs/epics/EPIC-{number}-{title}/`
- Include: Architecture diagrams, phase plans, rollback strategies
- Reference in JIRA Epic description

### Phase Tracking
Use JIRA's Epic functionality:
- Epic contains all phase tickets
- Each phase is a separate Story/Task under the Epic
- Track progress through JIRA's Epic burndown

---

## Daily Workflow

### Start of Day
```bash
# Check your in-progress work
./jira-search.sh "assignee=currentUser() AND status='In Progress'"

# Check tickets in review
./jira-search.sh "project=$PROJECT AND status='In Review'"
```

### Taking New Work
1. Check for high-priority items first
2. Assign ticket to yourself in JIRA
3. Transition to "In Progress"
4. Create feature branch
5. Start logging time by role

### Completing Work
1. Ensure all tests pass
2. Create PR with JIRA reference
3. Transition to "In Review"
4. Log final time entries
5. After merge, transition to "Done"

---

## Search Queries (JQL)

### Common Searches
```bash
# My open tickets
./jira-search.sh "assignee=currentUser() AND status NOT IN ('Done', 'Closed')"

# Broken items in frontend
./jira-search.sh "labels IN (broken, frontend) AND status != 'Done'"

# This sprint's work
./jira-search.sh "sprint in openSprints() AND project=$PROJECT"

# Unassigned high priority
./jira-search.sh "priority = High AND assignee is EMPTY"
```

---

## Best Practices

### Ticket Creation
- Write clear, actionable titles
- Include reproduction steps for bugs
- Define acceptance criteria for stories
- Link related tickets

### Status Management
- Update status in real-time
- Don't leave tickets "In Progress" overnight
- Use "In Review" for code review phase
- Only mark "Done" after verification

### Time Tracking
- Log time immediately after work
- Use appropriate AI-Guild role
- Include brief description of work done
- Be accurate with time estimates

### Documentation
- Complex features need design docs
- Epics require architecture diagrams
- Update ticket with findings/decisions
- Link to relevant code/PRs

---

## Migration from IFE to JIRA
 IFE (Issues, Features, Epics) transistioned to JIRA in full.

### IFE timeline
 - in Jun 2025 we migration from the IFE (Issues, Features, Epics) to JIRA.
 - Migration occured the old IFE and you many see the jira tickets.

### Mapping IFE to JIRA

| IFE Type | JIRA Type | Number Range | Notes |
|----------|-----------|--------------|--------|
| Issue (1001+) | Bug/Task | N/A | Use JIRA auto-numbering |
| Feature (3001+) | Story | N/A | Add feature labels |
| Epic (5001+) | Epic | N/A | Maintain phased approach |

### Historical Reference
- Keep completed IFE docs for reference
- New work uses JIRA exclusively
- No new IFE documents created

---

## Tools and Scripts

### Essential Scripts
- `jira-search.sh` - Find tickets with JQL
- `jira-create-classified.sh` - Create properly labeled tickets
- `jira-transition.sh` - Update ticket status
- `jira-worklog.sh` - Log time by AI-Guild role
- `jira-ticket-summary.sh` - View complete ticket history

### Configuration
See jira-tools/README.md for setup instructions.

---
## Special helpful notes

  When searching for JIRA tickets:
  1. Start with simple queries: `./jira-search.sh
  "assignee=currentUser()"`
  2. If you get data, filter it locally with jq instead of making
  new API calls
  3. Common ticket statuses in JIRA: "To Do", "In Progress", "In
  Review", "Done", "Assigned"
  4. To find specific tickets from a large result set:
     - Use: `| jq '.issues[] | select(.key == "TICKET-ID")'`
     - Or: `| jq '.issues[] | select(.fields.status.name == "Status
   Name")'`
   5. Always check if a query returned data before trying more complex variations


## Summary

JIRA provides a robust, industry-standard approach to work tracking that integrates seamlessly with the AI-Guild workflow. By combining JIRA's powerful features with our role-based development process, we maintain accountability and visibility while leveraging professional project management capabilities.