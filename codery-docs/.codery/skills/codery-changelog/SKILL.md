---
allowed-tools: Read, Edit, Write, Bash
description: Analyze git history and update CHANGELOG.md with current branch changes. Use when updating the changelog, writing release notes, checking what changed on a branch, or preparing for a release after implementation is complete.
argument-hint: [ticket-id]
---

# Changelog

Update CHANGELOG.md with changes from the current branch, following Keep a Changelog format.

If ticket ID provided as $ARGUMENTS, include it in changelog entries.

## Process

1. **Verify location**: Confirm on feature/bugfix branch (not main/develop)
2. **Analyze user-facing changes**:
   - Get commits since branch diverged
   - Review actual file changes with `git diff`
   - Apply changelog philosophy: would users/integrators/operators notice this change? If NO, exclude.
   - Categorize into: Added, Changed, Fixed, Deprecated, Removed, Security
3. **Read current CHANGELOG.md**: Check existing Unreleased section
4. **Present findings**: Show categorized changes for approval
5. **Update CHANGELOG.md**: Add to Unreleased section
6. **Commit**: `git add CHANGELOG.md && git commit -m "chore: update CHANGELOG.md"`
7. **JIRA comment**: Document changelog update on ticket
