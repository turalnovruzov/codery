---
allowed-tools: Read, Write, Edit, Bash
description: Create a release branch with a semantic version recommendation backed by commits, PRs, and JIRA tickets since the last tag. Use when creating a release, cutting a release branch, preparing for deployment, versioning completed work, or when the user says "create a release" or "cut a release".
argument-hint: [version]
---

# Release

Create a release branch following Git Flow. Gathers context from multiple sources to recommend a semantic version, never assumes a CHANGELOG.md or any specific release-notes format.

## Process

### 1. Verify Workflow

Confirm the project uses Git Flow (release branches go from `{{developBranch}}` to `{{mainBranch}}`).

### 2. Switch to develop

```bash
git checkout {{developBranch}} && git pull origin {{developBranch}}
```

### 3. Find the Anchor Point

```bash
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)
TAG_DATE=$(git log -1 --format=%aI "$LAST_TAG")
```

If no tags exist, fall back to the initial commit.

### 4. Gather Context (run in parallel)

Three sources, each adds different signal. Run all three in parallel for speed.

#### a. Commits since last tag

```bash
git log "$LAST_TAG"..HEAD --format="%h %s"
```

For each commit, extract:
- Conventional-commit type: `feat`, `fix`, `chore`, `refactor`, `docs`, `BREAKING CHANGE`, `!` markers
- Ticket IDs via regex `{{projectKey}}-\d+`

#### b. Merged PRs since last tag

```bash
gh pr list --state merged --base {{developBranch}} --search "merged:>=$TAG_DATE" --json number,title,body,labels,mergedAt
```

PR descriptions often capture *why* and *breaking notes* that commits don't. Cross-check the PR list against commits to catch anything missed.

#### c. JIRA tickets since last tag

For each unique ticket ID found in commits and PRs, fetch the ticket:

`jira issue view <KEY> -p {{projectKey}} --plain`

Capture: summary, issue type (Bug/Story/Task/Epic), priority, status, any breaking-change labels.

### 5. Recommend Version

Apply semantic versioning rules with sourced reasoning:

| Bump | Triggers |
|------|----------|
| **MAJOR** | `!` or `BREAKING CHANGE` in any commit, PR labeled `breaking`, JIRA ticket flagged as breaking |
| **MINOR** | Any `feat:` commit, PR with feature label, Story-type ticket |
| **PATCH** | Only `fix:`/`chore:`/`refactor:` and Bug/Task tickets |

Present a table mapping signals to conclusion, like:

```
MAJOR signal: feat(api)! in abc123 ({{projectKey}}-50: Rewrite auth)
MINOR signal: feat: in def456 ({{projectKey}}-51: Add export)
PATCH signal: fix: in ghi789 ({{projectKey}}-52: Null check)
→ Recommended: MINOR bump (1.2.0 → 1.3.0)
```

If `$ARGUMENTS` provided, use that version but still show the analysis for sanity-check.

### 6. Approval Gate

Wait for user approval on the version before creating the branch.

### 7. Create Release Branch

```bash
git checkout -b release/X.Y.Z
```

### 8. Push and Guide

1. Push: `git push -u origin release/X.Y.Z`
2. Remind the user to:
   - Test the release branch
   - Create PRs to both `{{mainBranch}}` and `{{developBranch}}`
   - Tag on `{{mainBranch}}` after merge: `git tag vX.Y.Z && git push origin vX.Y.Z`
3. Suggest using the gathered commit/PR/JIRA context to write the release PR description (Why/What/How to Verify) — consistent with `codery-pr` skill output.

## Notes

- This skill never reads or writes a CHANGELOG.md. If your project uses one, version it with whatever tool you already use (e.g., semantic-release runs in CI).
- Release notes and changelog strategy are intentionally per-project — document yours in your project's own docs.
