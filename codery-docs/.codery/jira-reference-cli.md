# JIRA Reference

**Project Key**: `{{projectKey}}`

## Workflow States

1. **To Do** → **In Progress** → **In Review** → **Done**

## Preview & Approval

Before any JIRA ticket create or edit: display details to user, ask for approval, then proceed.

## Git Branch Naming

- Feature: `feature/{{projectKey}}-123-description`
- Bugfix: `bugfix/{{projectKey}}-456-description`
- Hotfix: `hotfix/{{projectKey}}-789-description`

## CLI Commands

All commands use `-p {{projectKey}}`. Add `--no-input` to skip prompts, `--plain` for scripts.

### Issues

```bash
# List
jira issue list -p {{projectKey}} --plain --columns key,summary,status,type

# Create
jira issue create -p {{projectKey}} -tStory -s"Summary" -b"Description" --no-input
jira issue create -p {{projectKey}} -tSubtask -s"Summary" -P PARENT-KEY --no-input
jira epic create -p {{projectKey}} -n"Epic Name" -s"Summary" -b"Description" --no-input

# View
jira issue view ISSUE-KEY --comments 15 -p {{projectKey}}
jira issue view ISSUE-KEY --plain --comments 50 -p {{projectKey}}

# Edit
jira issue edit ISSUE-KEY -s"Summary" -b"Description" -yHigh --no-input -p {{projectKey}}
jira issue edit ISSUE-KEY -lnew-label --no-input -p {{projectKey}}
jira issue edit ISSUE-KEY -P NEW-PARENT-KEY --no-input -p {{projectKey}}

# Actions
jira issue comment add ISSUE-KEY "Comment text" -p {{projectKey}}
jira issue move ISSUE-KEY "In Progress" -p {{projectKey}}
jira issue assign ISSUE-KEY $(jira me) -p {{projectKey}}
```

### Epics & Hierarchy

```bash
jira epic list -p {{projectKey}} --table --plain
jira epic list EPIC-KEY -p {{projectKey}} --plain
jira epic add EPIC-KEY ISSUE-1 ISSUE-2 -p {{projectKey}}
jira issue list -p {{projectKey}} -P PARENT-KEY --plain --columns key,summary,status,type
```

### Filtering

```bash
jira issue list -p {{projectKey}} -s"In Progress" -yHigh -a$(jira me) --plain
jira issue list -p {{projectKey}} -q"summary ~ 'bug' AND priority = High" --plain
```

## Progress Tracking

Use role-specific comment prefixes: `[Scout]`, `[Architect]`, `[Builder]`, `[CRK]`. Always read comments before continuing work on a ticket.

## Key Points

- Subtasks require `-P PARENT-KEY`
- Issue types: Epic (`jira epic create`), Story/Task/Bug (`-tType`), Subtask (`-tSubtask -P`)
- Flags: `--plain` (scripts), `--no-input` (automation), `--comments N` (view N comments)
- Current user: `$(jira me)`
