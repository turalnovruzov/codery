# JIRA CLI Integration

Your Codery system uses the JIRA CLI tool for issue management. The CLI is already configured and ready to use.

**Project Key**: `{{projectKey}}`

## Core Commands

All commands require `-p {{projectKey}}`. Use `--no-input` to skip prompts and `--plain` for scriptable output.

### Issue Operations

```bash
# List issues
jira issue list -p {{projectKey}} --plain --columns key,summary,status,type

# Create (Epic/Story/Task/Bug/Subtask)
jira issue create -p {{projectKey}} -tStory -s"Summary" -b"Description" --no-input
jira issue create -p {{projectKey}} -tSubtask -s"Summary" -P PARENT-KEY --no-input
jira epic create -p {{projectKey}} -n"Epic Name" -s"Summary" -b"Description" --no-input

# View with comments
jira issue view ISSUE-KEY -p {{projectKey}}                    # Default: 1 comment
jira issue view ISSUE-KEY --comments 15 -p {{projectKey}}      # Multiple comments
jira issue view ISSUE-KEY --plain --comments 50 -p {{projectKey}}  # Scriptable
jira issue view ISSUE-KEY --raw -p {{projectKey}} | jq '.fields.comment.comments'

# Edit
jira issue edit ISSUE-KEY -s"Summary" -b"Description" -yHigh -a"user@email.com" --no-input -p {{projectKey}}
jira issue edit ISSUE-KEY -lnew-label --no-input -p {{projectKey}}  # Add label
jira issue edit ISSUE-KEY --label -old-label --no-input -p {{projectKey}}  # Remove label
jira issue edit ISSUE-KEY -P NEW-PARENT-KEY --no-input -p {{projectKey}}  # Change parent

# Transitions
jira issue comment add ISSUE-KEY "Comment text" -p {{projectKey}}
jira issue move ISSUE-KEY "In Progress" -p {{projectKey}}
jira issue assign ISSUE-KEY $(jira me) -p {{projectKey}}
jira issue delete ISSUE-KEY -p {{projectKey}}
```

### Hierarchical Management

```bash
# Epic operations
jira epic list -p {{projectKey}} --table --plain
jira epic list EPIC-KEY -p {{projectKey}} --plain  # Children
jira epic add EPIC-KEY ISSUE-1 ISSUE-2 -p {{projectKey}}

# Parent filtering
jira issue list -p {{projectKey}} -P PARENT-KEY --plain --columns key,summary,status,type
```

### Filtering

```bash
jira issue list -p {{projectKey}} -s"In Progress" -yHigh -a$(jira me) -lbackend --created week --plain
jira issue list -p {{projectKey}} -q"summary ~ 'bug' AND priority = High" --plain  # JQL
```

## Progress Tracking

Comments contain role-specific progress ([Scout], [Builder], etc.), decisions, blockers, and CRK assessments. Always read comments before continuing work.

```bash
# Role-specific comments
jira issue comment add ISSUE-KEY "[Scout] Research findings" -p {{projectKey}}
jira issue comment add ISSUE-KEY "[Architect] Design decisions" -p {{projectKey}}
jira issue comment add ISSUE-KEY "[Builder] Implementation complete" -p {{projectKey}}
jira issue comment add ISSUE-KEY "[CRK] Confidence: 95%" -p {{projectKey}}
```

## Key Points

- **Subtasks require** `-P PARENT-KEY`
- **Issue types**: Epic (`jira epic create`), Story/Task/Bug (`-tType`), Subtask (`-tSubtask -P`)
- **Flags**: `--plain` (scripts), `--no-input` (automation), `--comments N` (view N comments)
- **Current user**: `$(jira me)`