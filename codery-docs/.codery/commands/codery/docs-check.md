---
description: Check if documentation needs updates based on PR changes
argument-hint: [PR-number]
---

# Docs Check Command

**Goal**: Ensure documentation stays in sync with code changes by identifying what needs updating and suggesting specific changes.

## Your Objective

You are reviewing a PR to determine if the documentation source files need updates. Think critically about what was changed and whether it affects anything documented.

## Process

### 1. Understand the Changes

If PR number given, fetch the diff:
```bash
gh pr diff <number>
```

If no argument, check current branch for changes:
```bash
git diff main...HEAD
```

Analyze what was changed:
- New features or capabilities added?
- Existing behavior modified?
- APIs changed?
- Configuration options added/removed?
- Dependencies updated?
- Architecture decisions made?

### 2. Find Documentation Sources

Read the project's `.codery/config.json` to find the `applicationDocs` array. These are the **source files** you should check and potentially update.

**Important**: NEVER edit `.codery/application-docs.md` - that's generated. Only edit the source files listed in `applicationDocs`.

### 3. Review Each Doc Source

For each file in `applicationDocs`:
- Read the current content
- Compare against the PR changes
- Identify gaps, outdated info, or missing documentation

### 4. Suggest Updates

Present your findings clearly:

```
## Documentation Review for PR #XX

### Changes That May Affect Documentation
- [List key changes from the PR]

### Suggested Updates

**File: `engineering-docs/README.md`**
- Section "Architecture": Add mention of new caching layer
- Section "Dependencies": Update to reflect new library X

**File: `engineering-docs/api-guide.md`**
- Add documentation for new endpoint POST /api/widgets

### No Updates Needed
- [List docs that are still accurate]
```

### 5. Ask for Approval

After presenting suggestions, ask:
> "Would you like me to make these documentation updates? I'll edit the source files, and you can review the changes before committing."

### 6. Make Edits (If Approved)

Only after explicit approval:
- Edit the source files listed in `applicationDocs`
- Make focused, minimal changes
- Preserve existing style and formatting

## What NOT to Do

- Don't edit `.codery/application-docs.md` (it's generated)
- Don't make changes without approval
- Don't over-document - only add what's necessary
- Don't restructure docs unless asked

## Integration with Audit

When `/codery:audit` reviews a PR, it should mention:
> "Consider running `/codery:docs-check` to verify documentation is up to date."
