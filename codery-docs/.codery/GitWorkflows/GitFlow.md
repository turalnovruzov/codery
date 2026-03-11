# Git Flow Workflow

## Branch Structure

**Main branches:**
- **{{mainBranch}}**: Production releases, tagged with versions
- **{{developBranch}}**: Integration branch for features

**Supporting branches:**
- `feature/{{projectKey}}-XXX-desc` — from {{developBranch}}, merge back via PR
- `bugfix/{{projectKey}}-XXX-desc` — from {{developBranch}}, merge back via PR
- `release/X.Y.Z` — from {{developBranch}}, merge to {{mainBranch}} AND {{developBranch}}
- `hotfix/{{projectKey}}-XXX-desc` — from {{mainBranch}}, merge to {{mainBranch}} AND {{developBranch}}

## Branch Safety

**CRITICAL: ALWAYS create a branch before beginning work!**

1. Create appropriate branch based on ticket type (feature/bugfix/hotfix/release)
2. Verify with `git branch --show-current`
3. NEVER work directly on {{mainBranch}} or {{developBranch}}

## Workflow Commands

```bash
# Feature development
git checkout {{developBranch}} && git pull origin {{developBranch}}
git checkout -b feature/{{projectKey}}-123-description
git add . && git commit -m "{{projectKey}}-123: Description"
git push origin feature/{{projectKey}}-123-description
# Create PR to {{developBranch}}, delete branch after merge

# Release
git checkout {{developBranch}} && git pull origin {{developBranch}}
git checkout -b release/X.Y.Z
# Test, fix, commit: "chore: prepare release X.Y.Z"
# Create PRs to both {{mainBranch}} and {{developBranch}}
# Tag on {{mainBranch}}: git tag vX.Y.Z && git push origin vX.Y.Z

# Hotfix
git checkout {{mainBranch}} && git pull origin {{mainBranch}}
git checkout -b hotfix/{{projectKey}}-456-critical-fix
# Fix, commit, push
# Create PRs to both {{mainBranch}} and {{developBranch}}
```

## Key Rules

1. Never commit directly to {{mainBranch}} or {{developBranch}} — always use PRs
2. Delete branches after PR merge
3. Tag releases on {{mainBranch}}
4. Always pull before branching

## Changelog

Maintain CHANGELOG.md with Keep a Changelog format. Add user-facing entries before creating PR. During release, move Unreleased → `[X.Y.Z] - YYYY-MM-DD`.

**Include**: New features, bug fixes affecting UX, API changes, new config requirements.
**Exclude**: Internal refactors, renames, code cleanup, CSS class changes.

## JIRA Integration

- Commit format: `{{projectKey}}-123: Description`
- Branch lifecycle tracked in JIRA ticket status
- Link PRs to JIRA tickets

```text
{{mainBranch}}     ←── release (PR) ──→ {{developBranch}}
  ↑                              ↑
  └──── hotfix (PR) ────────────┤
                                 ↑
                    feature/bugfix branches (PR)
```
