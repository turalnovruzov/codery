# Trunk-Based Development

## Overview

Continuous integration on a single trunk branch with optional short-lived feature branches (<24 hours).

## Branch Structure

- **{{mainBranch}}**: Always deployable trunk
- **Feature branches**: `feature/{{projectKey}}-XXX` (merge within 24 hours)
- **Hotfixes**: `hotfix/{{projectKey}}-XXX` (immediate merge)

## Core Principles

1. **Daily Integration**: Commit to trunk at least once per day
2. **Feature Flags**: Deploy incomplete features behind flags
3. **Branch Protection**: All changes via PR with passing tests

## 🚨 Branch Safety

**⚠️ CRITICAL: You MUST verify your current branch BEFORE ANY code changes!**

### Why This Matters
Working on the wrong branch (especially {{mainBranch}}) can:
- Bypass code review requirements
- Break CI/CD pipelines
- Cause production incidents

### Pre-Work Safety Check
```bash
# 1. CHECK YOUR CURRENT BRANCH (MANDATORY)
git branch --show-current

# 2. If on {{mainBranch}}, STOP and create feature branch:
git checkout {{mainBranch}} && git pull
git checkout -b feature/{{projectKey}}-XXX-description

# 3. Verify you're on correct branch before proceeding
git branch --show-current
```

### Decision Rules
**Direct to {{mainBranch}}**: Only for <10 line pre-approved changes
**Feature branch**: Everything else (DEFAULT - when in doubt, use feature branch)

### Common Mistake Prevention
❌ **WRONG**: Start coding immediately after git checkout
✅ **CORRECT**: Always verify branch → create feature branch → then code

## Workflow Examples

```bash
# Feature branch (default)
git checkout {{mainBranch}} && git pull
git checkout -b feature/{{projectKey}}-123-description
git add . && git commit -m "{{projectKey}}-123: Description"
git push -u origin feature/{{projectKey}}-123-description
# Create PR, merge within 24 hours

# Hotfix
git checkout -b hotfix/{{projectKey}}-456
# Fix, commit, push, immediate PR
```

## Best Practices

- **Small commits**: Complete, working changes only
- **Feature flags**: Deploy incomplete features safely
- **Test before push**: All tests must pass
- **Quick reviews**: Merge within 24 hours to avoid conflicts

## JIRA Integration

- Commit format: `{{projectKey}}-123: Description`
- Update status on PR creation
- Close ticket after merge

## When to Use

**Trunk-Based**: CI/CD teams, rapid iteration, web apps
**Git Flow**: Multiple versions, infrequent releases, strict cycles


## Example Workflow

```bash
# Start feature
git checkout {{mainBranch}} && git pull
git checkout -b feature/{{projectKey}}-100-user-prefs

# Work and commit
git add . && git commit -m "{{projectKey}}-100: Add user preferences"
git push -u origin feature/{{projectKey}}-100-user-prefs

# Create PR and merge same day
# For incomplete features, use feature flags
```

```text
{{mainBranch}} (trunk)
    ↑
    └── feature branches (<24 hours)
```