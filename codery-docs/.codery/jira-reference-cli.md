# JIRA Reference (CLI)

**Project Key**: `{{projectKey}}`

## Preview & Approval

Before creating a ticket, editing a ticket, or adding a comment: display details to user, ask for approval, then proceed. Transitions and worklog additions proceed without approval — they're core workflow, not content creation.

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

## Anti-Patterns — Never Do These

- **Heredocs for simple JIRA commands.** Use inline `-s "summary" -b "body"`. Heredocs slow the flow and are hard to edit mid-draft.
- **Skipping `-p {{projectKey}}`.** Every `jira` command needs the project key — omitting it silently writes to the wrong project or errors.
- **`--no-input` when the user should be prompted.** Only use it for commands with all values specified; never for interactive drafts.
- **Creating, editing, or commenting without the Preview & Approval step.** Show details and get approval first. (Transitions and worklogs are exempt.)
- **Commenting without reading existing comments first.** Run `jira issue view KEY --comments 15` before adding to a ticket.
- **Hardcoded issue keys in scripts.** Look up by name/summary with `-q` queries.
- **Bypassing `codery-*` skills.** If a skill fits the task (codery-pr, codery-release, codery-audit, codery-snr, codery-status), invoke it via the Skill tool instead of raw commands.
