# Trunk-Based Development Workflow for Codery

## Overview

Codery supports Trunk-Based Development, a modern branching strategy that emphasizes continuous integration and rapid delivery. This document outlines how to work with Trunk-Based Development within the Codery system.

## Branch Structure

### Main Branch

- **{{mainBranch}}** (trunk): The single source of truth, always deployable
- All development happens on or very close to this branch
- Protected with automated tests and CI/CD pipelines

### Short-Lived Feature Branches (Optional)

- **Created from**: `{{mainBranch}}`
- **Merge back into**: `{{mainBranch}}` via pull request
- **Naming**: `feature/{{projectKey}}-XXX-description` or simply `{{projectKey}}-XXX`
- **Lifetime**: Less than 24 hours (ideally a few hours)
- **Purpose**: Small, focused changes

## Core Principles

### 1. Continuous Integration

- Commit to trunk at least once per day
- Small, incremental changes
- Each commit should be production-ready

### 2. Feature Flags

- Use feature flags for incomplete features
- Deploy code continuously, release features when ready
- Decouple deployment from release

### 3. Branch Protection

- Automated tests run on every commit
- No direct pushes to {{mainBranch}} - use pull requests
- Require passing CI/CD pipeline before merge

## 🚨 EXTREMELY IMPORTANT: Critical Branch Creation Requirement

**⚠️ STOP AND READ: You MUST verify your current branch BEFORE ANY code changes!**

### Why This Matters
Working on the wrong branch (especially {{mainBranch}}) can:
- Bypass code review requirements
- Break CI/CD pipelines  
- Cause production incidents
- Violate team agreements

### Decision Criteria: Direct Commit vs Feature Branch

#### ✅ Direct Commits to {{mainBranch}} (Rare)
Only when ALL conditions are met:
- Change is < 10 lines
- Zero risk to production
- Pre-approved by team lead
- Emergency hotfix with incident ticket

#### 🔀 Feature Branch Required (Default)
For everything else:
- Any feature development
- Bug fixes (use bugfix/ prefix)
- Refactoring
- Documentation updates
- Configuration changes

### Pre-Work Checklist
Before writing ANY code, execute these commands:

```bash
# 1. CHECK YOUR CURRENT BRANCH
git branch --show-current

# 2. If on {{mainBranch}}, STOP and create feature branch:
git checkout {{mainBranch}}
git pull origin {{mainBranch}}
git checkout -b feature/{{projectKey}}-XXX-description

# 3. Verify you're on the correct branch
git branch --show-current
```

### Time-Based Safety Rules
- **Morning Start**: Always verify branch
- **After Breaks**: Re-verify branch (context switches cause mistakes)
- **Before Commits**: Final branch check
- **After PR Reviews**: Ensure you're not on {{mainBranch}}

### Common Mistake Prevention

❌ **WRONG** (Direct work on trunk):
```bash
git checkout {{mainBranch}}
# Start coding immediately - NO!
```

✅ **CORRECT** (Feature branch first):
```bash
git checkout {{mainBranch}}
git pull origin {{mainBranch}}
git checkout -b feature/{{projectKey}}-123-user-auth
# NOW you can start coding
```

Remember: When in doubt, CREATE A BRANCH. It's always safer and you can always merge quickly in trunk-based development.

## Workflow Commands

### Direct Trunk Development (Recommended for Small Changes)

```bash
git checkout {{mainBranch}}
git pull origin {{mainBranch}}
# Make small changes
git add .
git commit -m "{{projectKey}}-123: Small improvement"
git push origin {{mainBranch}}
```

### Short-Lived Feature Branch (For Larger Changes)

```bash
git checkout {{mainBranch}}
git pull origin {{mainBranch}}
git checkout -b {{projectKey}}-123-quick-fix
# Work on changes (complete within hours)
git add .
git commit -m "{{projectKey}}-123: Fix description"
git push origin {{projectKey}}-123-quick-fix
# Create pull request immediately
# Merge within 24 hours
```

### Emergency Fixes

```bash
git checkout {{mainBranch}}
git pull origin {{mainBranch}}
git checkout -b hotfix/{{projectKey}}-456
# Fix critical issue
git add .
git commit -m "{{projectKey}}-456: Emergency fix for production issue"
git push origin hotfix/{{projectKey}}-456
# Create high-priority pull request
# Merge immediately after review
```

## Best Practices

### 1. Small Commits

- Each commit should be a complete, working change
- Avoid large, multi-day features
- Break down work into smallest possible increments

### 2. Feature Flags Usage

```javascript
if (featureFlags.newFeature) {
  // New feature code
} else {
  // Existing code
}
```

### 3. Continuous Testing

- Write tests before or with your code
- Ensure all tests pass before pushing
- Monitor CI/CD pipeline results

### 4. Code Reviews

- Quick reviews for small changes
- Focus on code quality and standards
- Merge promptly to avoid conflicts

## JIRA Integration

- Reference tickets in all commits: `{{projectKey}}-123: Description`
- Update ticket status when creating PR
- Link pull requests to JIRA tickets
- Close tickets after merge to trunk

## Key Differences from Git Flow

| Aspect | Trunk-Based | Git Flow |
|--------|-------------|----------|
| Branches | Single trunk + short-lived | Multiple long-lived |
| Feature Development | On trunk or < 24hr branches | Long feature branches |
| Releases | Continuous from trunk | Release branches |
| Complexity | Simple | Complex |
| Merge Conflicts | Minimal | Common |

## When to Use Trunk-Based Development

✅ **Ideal for:**

- Teams practicing CI/CD
- Web applications
- Experienced developers
- Rapid iteration needs
- Continuous delivery

❌ **Consider Git Flow instead for:**

- Multiple version support
- Infrequent releases
- Large, inexperienced teams
- Strict release cycles

## SNR Protocol

After each work session:

- **S** (Summary): What was integrated into trunk
- **N** (Next): Immediate next integration
- **R** (Request): Required reviews or deployments

## Common Scenarios

### Scenario 1: Daily Feature Work

```bash
# Morning
git checkout {{mainBranch}} && git pull
# Work directly on trunk for 2-3 hours
git add . && git commit -m "{{projectKey}}-100: Add user preferences"
git push origin {{mainBranch}}

# Afternoon  
git pull origin {{mainBranch}}
# Continue work
git add . && git commit -m "{{projectKey}}-100: Add preferences UI"
git push origin {{mainBranch}}
```

### Scenario 2: Collaborative Feature

```bash
# Developer A
git checkout -b {{projectKey}}-200-api
# 2 hours of work
git push origin {{projectKey}}-200-api
# Create PR

# Developer B  
git checkout -b {{projectKey}}-200-ui
# 2 hours of work
git push origin {{projectKey}}-200-ui
# Create PR

# Both PRs merged same day
```

### Scenario 3: Feature Flag Deployment

```bash
# Add feature behind flag
git checkout {{mainBranch}}
git add .
git commit -m "{{projectKey}}-300: New dashboard (feature flagged)"
git push origin {{mainBranch}}
# Feature deployed but not active

# Later, activate via feature flag system
# No code deployment needed
```

## Quick Reference

```text
{{mainBranch}} (always deployable)
    ↑
    └── short-lived branches (<24 hours)
```

This workflow ensures continuous integration, minimal conflicts, and rapid delivery while maintaining code quality through automation and good practices.