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
- **Naming**: `feature/JIRA-XXX-description`
- **Purpose**: New feature development

#### Bugfix Branches

- **Created from**: `{{developBranch}}`
- **Merge back into**: `{{developBranch}}` via pull request
- **Naming**: `bugfix/JIRA-XXX-description`
- **Purpose**: Non-critical bug fixes for upcoming releases

#### Release Branches

- **Created from**: `{{developBranch}}`
- **Merge into**: `{{mainBranch}}` AND `{{developBranch}}` via pull requests
- **Naming**: `release/X.Y.Z`
- **Purpose**: Prepare new production release, minor bug fixes, version bumping

#### Hotfix Branches

- **Created from**: `{{mainBranch}}`
- **Merge into**: `{{mainBranch}}` AND `{{developBranch}}` via pull requests
- **Naming**: `hotfix/JIRA-XXX-description`
- **Purpose**: Emergency production fixes

## 🛡️ CODERY BEHAVIORAL INSTRUCTIONS

**IMPORTANT**: The following instructions are MANDATORY for Codery. You MUST follow these rules without exception.

### Branch Creation Requirements

1. **YOU MUST ALWAYS CREATE A BRANCH** when starting work on any JIRA ticket
2. **YOU MUST NEVER** make changes directly on `{{mainBranch}}` or `{{developBranch}}`
3. **YOU MUST VERIFY** you are on the correct branch before making any changes
4. **YOU MUST USE** the branch naming convention that matches the JIRA ticket type
5. **FAILURE TO CREATE BRANCHES** will result in immediate work stoppage

### Enforcement

- If you attempt to commit directly to `{{mainBranch}}` or `{{developBranch}}`, STOP immediately
- If you are not on a feature/bugfix/hotfix/release branch, DO NOT proceed with any code changes
- Always run `git branch` to verify your current branch before any Builder Mode operations

## 📋 JIRA Ticket Type to Branch Mapping

You MUST create the appropriate branch type based on the JIRA ticket type:

| JIRA Ticket Type | Branch Type | Created From | Naming Convention | Example |
|------------------|-------------|--------------|-------------------|----------|
| Task | feature | {{developBranch}} | feature/JIRA-XXX-description | feature/COD-123-add-login |
| Story | feature | {{developBranch}} | feature/JIRA-XXX-description | feature/COD-456-user-profile |
| Bug (non-critical) | bugfix | {{developBranch}} | bugfix/JIRA-XXX-description | bugfix/COD-789-fix-validation |
| Bug (critical/prod) | hotfix | {{mainBranch}} | hotfix/JIRA-XXX-description | hotfix/COD-911-security-patch |
| Epic | N/A | N/A | Break into Tasks/Stories | N/A |

**Note**: Critical bugs are those affecting production. All other bugs use bugfix branches.

## ✅ Pre-Work Branch Creation Checklist

Before starting ANY work, you MUST complete this checklist:

- [ ] **Identify JIRA ticket type** (Task, Story, Bug, etc.)
- [ ] **Determine correct branch type** from the mapping table above
- [ ] **Check current branch**: Run `git branch` to see current branch
- [ ] **Switch to base branch**: Checkout {{developBranch}} or {{mainBranch}} as appropriate
- [ ] **Pull latest changes**: Run `git pull origin [base-branch]`
- [ ] **Create new branch**: Run `git checkout -b [branch-type]/JIRA-XXX-description`
- [ ] **Verify branch creation**: Run `git branch` to confirm on new branch
- [ ] **Push branch to remote**: Run `git push -u origin [branch-name]`

## 🔗 Role Integration Requirements

### Scout Mode
- MUST identify the JIRA ticket type when analyzing requirements
- MUST determine the appropriate branch type before proceeding

### Architect Mode
- MUST include branch creation in technical planning
- MUST specify which base branch to use

### CRK Assessment
- MUST verify correct branch exists before approving Builder Mode
- MUST include branch validation in confidence assessment
- If not on correct branch type, confidence MUST be 0%

### Builder Mode
- MUST NOT proceed without verifying correct branch
- MUST run `git branch` before ANY code modifications
- MUST stop immediately if on {{mainBranch}} or {{developBranch}}
- All commits MUST include JIRA ticket reference

## Workflow Commands

### Feature Development

```bash
git checkout {{developBranch}}
git pull origin {{developBranch}}
git checkout -b feature/JIRA-123-new-feature
# ... work on feature ...
git add .
git commit -m "JIRA-123: Feature description"
git push origin feature/JIRA-123-new-feature
# Create pull request from feature/JIRA-123-new-feature → {{developBranch}}
# After PR is merged, delete local branch
git checkout {{developBranch}}
git pull origin {{developBranch}}
git branch -d feature/JIRA-123-new-feature
```

### Release Creation

```bash
git checkout {{developBranch}}
git pull origin {{developBranch}}
git checkout -b release/1.2.0
# ... final testing, version bump ...
git add .
git commit -m "JIRA-XXX: Prepare release 1.2.0"
git push origin release/1.2.0
# Create pull request from release/1.2.0 → {{mainBranch}}
# After PR is merged to {{mainBranch}}, tag the release
# Create pull request from release/1.2.0 → {{developBranch}}
# After both PRs are merged, delete local branch
git checkout {{developBranch}}
git pull origin {{developBranch}}
git branch -d release/1.2.0
```

### Hotfix Deployment

```bash
git checkout {{mainBranch}}
git pull origin {{mainBranch}}
git checkout -b hotfix/JIRA-456-critical-fix
# ... fix issue ...
git add .
git commit -m "JIRA-456: Fix critical issue"
git push origin hotfix/JIRA-456-critical-fix
# Create pull request from hotfix/JIRA-456-critical-fix → {{mainBranch}}
# After PR is merged to {{mainBranch}}, tag the hotfix
# Create pull request from hotfix/JIRA-456-critical-fix → {{developBranch}}
# After both PRs are merged, delete local branch
git checkout {{developBranch}}
git pull origin {{developBranch}}
git branch -d hotfix/JIRA-456-critical-fix
```

## Pull Request Workflow

1. **Never merge locally** - all merges happen via pull requests
2. Push feature/release/hotfix branches to remote
3. Create pull requests for code review and merging
4. Delete local branches after PR is merged
5. Always pull latest changes before creating new branches

## JIRA Integration

- All branches must reference JIRA ticket numbers
- Commit messages include JIRA ticket: `JIRA-123: Description`
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

## SNR Protocol

After each work session, document progress:

- **S** (Summary): What was completed
- **N** (Next): What comes next
- **R** (Request): Role needed for next phase

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