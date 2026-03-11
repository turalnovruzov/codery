# Trunk-Based Development

## Branch Structure

- **{{mainBranch}}**: Always deployable trunk
- **Feature branches**: `feature/{{projectKey}}-XXX` (merge within 24 hours)
- **Hotfixes**: `hotfix/{{projectKey}}-XXX` (immediate merge)

## Branch Safety

**CRITICAL: Verify your current branch BEFORE ANY code changes!**

```bash
# 1. CHECK CURRENT BRANCH (MANDATORY)
git branch --show-current

# 2. If on {{mainBranch}}, create feature branch:
git checkout {{mainBranch}} && git pull
git checkout -b feature/{{projectKey}}-XXX-description

# 3. Verify before proceeding
git branch --show-current
```

**Direct to {{mainBranch}}**: Only for <10 line pre-approved changes
**Feature branch**: Everything else (DEFAULT)

## Workflow

```bash
# Feature (default)
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
- **Quick reviews**: Merge within 24 hours

## JIRA Integration

- Commit format: `{{projectKey}}-123: Description`
- Update status on PR creation
- Close ticket after merge

```text
{{mainBranch}} (trunk)
    ↑
    └── feature branches (<24 hours)
```
