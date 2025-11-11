# Git Flow Workflow for Codery

## Overview

Codery follows the Git Flow workflow model with JIRA integration. This document provides a concise recap of how Git Flow operates within the Codery system.

## Branch Structure

### Main Branches

- **{{mainBranch}}** (production): Stores official release history, tagged with version numbers
- **{{developBranch}}**: Integration branch for features, always reflects latest delivered development changes

### Supporting Branches

#### Feature Branches

- **Created from**: `{{developBranch}}`
- **Merge back into**: `{{developBranch}}` via pull request
- **Naming**: `feature/{{projectKey}}-XXX-description`
- **Purpose**: New feature development

#### Bugfix Branches

- **Created from**: `{{developBranch}}`
- **Merge back into**: `{{developBranch}}` via pull request
- **Naming**: `bugfix/{{projectKey}}-XXX-description`
- **Purpose**: Non-critical bug fixes for upcoming releases

#### Release Branches

- **Created from**: `{{developBranch}}`
- **Merge into**: `{{mainBranch}}` AND `{{developBranch}}` via pull requests
- **Naming**: `release/X.Y.Z`
- **Purpose**: Prepare new production release, minor bug fixes, version bumping

#### Hotfix Branches

- **Created from**: `{{mainBranch}}`
- **Merge into**: `{{mainBranch}}` AND `{{developBranch}}` via pull requests
- **Naming**: `hotfix/{{projectKey}}-XXX-description`
- **Purpose**: Emergency production fixes

## Critical Branch Creation Requirement

**EXTREMELY IMPORTANT**: It is crucial that Codery ALWAYS creates a branch before beginning work on any task. This prevents accidentally working on protected branches ({{mainBranch}} or {{developBranch}}).

**Before ANY work**:

1. Create appropriate branch based on JIRA ticket type (feature/bugfix/hotfix/release)
2. Verify you're on the correct branch with `git branch`
3. NEVER work directly on {{mainBranch}} or {{developBranch}}

## Workflow Commands

### Feature Development

```bash
git checkout {{developBranch}}
git pull origin {{developBranch}}
git checkout -b feature/{{projectKey}}-123-new-feature
git add .
git commit -m "{{projectKey}}-123: Feature description"
git push origin feature/{{projectKey}}-123-new-feature
# Create pull request to {{developBranch}}
# After merge:
git checkout {{developBranch}}
git pull origin {{developBranch}}
git branch -d feature/{{projectKey}}-123-new-feature
```

### Release Creation

```bash
git checkout {{developBranch}}
git pull origin {{developBranch}}
git checkout -b release/1.2.0
git add .
git commit -m "{{projectKey}}-XXX: Prepare release 1.2.0"
git push origin release/1.2.0
# Create PRs to both {{mainBranch}} and {{developBranch}}
# Tag on {{mainBranch}} after merge
# After both merges:
git checkout {{developBranch}}
git pull origin {{developBranch}}
git branch -d release/1.2.0
```

### Hotfix Deployment

```bash
git checkout {{mainBranch}}
git pull origin {{mainBranch}}
git checkout -b hotfix/{{projectKey}}-456-critical-fix
git add .
git commit -m "{{projectKey}}-456: Fix critical issue"
git push origin hotfix/{{projectKey}}-456-critical-fix
# Create PRs to both {{mainBranch}} and {{developBranch}}
# Tag on {{mainBranch}} after merge
# After both merges:
git checkout {{developBranch}}
git pull origin {{developBranch}}
git branch -d hotfix/{{projectKey}}-456-critical-fix
```

## Changelog Management

Maintain CHANGELOG.md following Keep a Changelog format (keepachangelog.com) and Semantic Versioning (semver.org).

### Changelog Philosophy

CHANGELOG.md is **user-facing communication**, not a commit log.

**Ask before adding any entry:**
- "Would someone **using** this app notice this change?"
- "Would someone **integrating** with this API need to update their code?"
- "Would someone **deploying** this app need to configure something new?"

**If all answers are NO → Skip it.**

**Include:**
- ✅ New features users can see/use
- ✅ Bug fixes that affected user experience
- ✅ API changes requiring integrator updates
- ✅ New configuration requirements for operators
- ✅ Performance improvements users experience

**Exclude:**
- ❌ Internal refactors or code restructuring
- ❌ File/component renames
- ❌ Code cleanup and reorganization
- ❌ CSS class name changes (unless visual change)
- ❌ Documentation updates (unless user-facing)

### During Feature Development

Work freely without updating CHANGELOG.md. Experimental changes, reverts, and iterations happen naturally during development.

### Before Pull Request Creation

Before creating PR to {{developBranch}}, update CHANGELOG.md Unreleased section:

1. Analyze commits since branch diverged from {{developBranch}}
2. Review actual file changes: `git diff {{developBranch}}...HEAD`
3. Ignore intermediate experiments and reverted changes
4. Categorize changes into Keep a Changelog sections:
   - **Added**: New features, capabilities
   - **Changed**: Changes to existing functionality
   - **Fixed**: Bug fixes
   - **Deprecated**: Soon-to-be removed features
   - **Removed**: Removed features
   - **Security**: Security fixes
5. Add entries under `## [Unreleased]` section with format: `- Description ({{projectKey}}-XXX)`

### During Open PR

If additional commits are pushed to the feature branch, update CHANGELOG.md again to reflect new changes.

### Release Workflow

When ready to release from {{developBranch}}:

1. **Analyze Unreleased changes**: Review all entries in Unreleased section
2. **Determine semantic version** (X.Y.Z):
   - **MAJOR (X.0.0)**: Breaking changes, incompatible API changes
   - **MINOR (0.X.0)**: New features, backward-compatible functionality
   - **PATCH (0.0.X)**: Bug fixes only, backward-compatible
3. **Create release branch**: `git checkout -b release/X.Y.Z` from {{developBranch}}
4. **Version the changelog**:
   - Move `## [Unreleased]` content → `## [X.Y.Z] - YYYY-MM-DD`
   - Keep empty `## [Unreleased]` section at top for future changes
   - Commit: `git commit -m "chore: prepare release X.Y.Z"`
5. **Test in release branch**: If bugs found, fix them and add to `[X.Y.Z]` section (not Unreleased)
6. **Merge via PRs**: Create pull requests to both {{mainBranch}} and {{developBranch}}
7. **Tag after merge**: After {{mainBranch}} PR merges, tag: `git tag vX.Y.Z && git push origin vX.Y.Z`

### Hotfix Changelog

For hotfix branches, add fixes directly to a new patch version section (e.g., `## [1.2.1] - YYYY-MM-DD`) during the hotfix process.

## Pull Request Workflow

1. **Never merge locally** - all merges happen via pull requests
2. Push feature/release/hotfix branches to remote
3. Create pull requests for code review and merging
4. Delete local branches after PR is merged
5. Always pull latest changes before creating new branches

## JIRA Integration

- All branches must reference JIRA ticket numbers
- Commit messages include JIRA ticket: `{{projectKey}}-123: Description`
- Time logging and comments required for all work
- Branch lifecycle tracked in JIRA ticket status
- Link pull requests to JIRA tickets

## Key Rules

1. **Never commit directly to {{mainBranch}} or {{developBranch}}** - always use pull requests
2. **No local merges** - all merges happen through pull requests on remote
3. **Delete branches after PR merge** to keep repository clean
4. **Tag releases on {{mainBranch}}** after release PR is merged
5. **Hotfixes increment patch version** (e.g., 1.2.0 → 1.2.1)
6. **Always pull before branching** to ensure you have latest code

## Quick Reference

```text
{{mainBranch}}     ←── release (PR) ──→ {{developBranch}}
  ↑                              ↑
  └──── hotfix (PR) ────────────┤
                                 ↑
                    feature branches (PR)
                                 ↑
                     bugfix branches (PR)
```

This workflow ensures clean version history, supports parallel development, enables code review through pull requests, and provides quick production fixes when needed.