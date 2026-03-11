---
allowed-tools: Read, Edit, Write, Bash
description: Create release branch with versioned changelog following Git Flow
argument-hint: [version]
---

# Release

Create a release branch following Git Flow. Analyzes changes and suggests semantic version.

## Process

1. **Verify workflow**: Ensure project uses Git Flow
2. **Switch to develop**: `git checkout {{developBranch}} && git pull origin {{developBranch}}`
3. **Analyze Unreleased changes**: Read CHANGELOG.md, get commits since last tag
4. **Verify changelog accuracy**: Compare against actual code diff from last version tag. Apply user-facing filter — remove internal refactors from consideration.
5. **Suggest version** (if not in $ARGUMENTS):
   - **MAJOR**: Breaking changes
   - **MINOR**: New features
   - **PATCH**: Bug fixes only
   - Present reasoning, ask for approval
6. **Create release branch**: `git checkout -b release/X.Y.Z`
7. **Version changelog**: Move Unreleased → `[X.Y.Z] - YYYY-MM-DD`, keep empty Unreleased header
8. **Push and guide**: Push branch, remind to test, create PRs to both {{mainBranch}} and {{developBranch}}, tag after merge
