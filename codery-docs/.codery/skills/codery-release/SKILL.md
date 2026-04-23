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
echo "Comparing $LAST_TAG..HEAD (HEAD = {{developBranch}})"
```

If no tags exist, fall back to the initial commit. Surface the comparison ref so the user can sanity-check scope before approving the version.

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

Do **not** use a date filter — it silently drops PRs that were merged to `{{developBranch}}` *before* the last tag's date, which is common whenever `{{mainBranch}}` has lagged `{{developBranch}}` (e.g., the tag was cut from a hotfix subset on `{{mainBranch}}`). Derive PRs from the commit subjects on the release scope instead, covering both merge-commit and squash-merge repos:

```bash
PR_NUMS=$(git log "$LAST_TAG"..HEAD --format="%s" \
  | grep -oE '(Merge pull request #|\(#)[0-9]+' \
  | grep -oE '[0-9]+' | sort -u)

for n in $PR_NUMS; do
  gh pr view "$n" --json number,title,body,labels,mergedAt
done
```

The regex matches `Merge pull request #123 from …` (merge-commit strategy) and `feat: thing (#123)` (squash-merge). `gh pr view` errors silently for stray matches — safe to run without pre-filtering.

PR bodies often capture *why* and *breaking notes* that commits don't. Cross-check the PR list against commits to catch anything missed.

#### c. JIRA tickets since last tag

**Goal.** Understand what's shipping at the *user-visible* level — not just the implementation fragments. On projects that use `[FE] / [BE]` subtask conventions, each individual subtask title says little; the parent Story or Task holds the real narrative. The version recommendation and release notes both depend on reading shipping scope at the Story level.

**Signals that warrant walking the parent chain.**

- Ticket type = `Sub-task`, or title prefixed with `[FE]` / `[BE]` / `[API]` / similar
- Generic subtask titles ("Implement endpoint", "Wire up state")
- Multiple subtasks rolling up to the same parent — often a coordinated feature
- Any Epic Link or `parent` field present in the ticket

**What to fetch.** For each ticket, capture summary, issue type, priority, status, any breaking-change labels, and the parent ticket key (subtasks usually expose it under `fields.parent`; epic links often live in a project-specific custom field).

Use whichever JIRA integration this project is configured for — see `.codery/refs/jira-reference.md`. Parent and epic-link fields are often omitted from default ticket views; request them explicitly when walking relationships (e.g. pass `--raw` to the JIRA CLI, or specify `fields: ["parent", ...]` on an MCP issue fetch).

**Default behavior.**

For each unique ticket ID found in commits and PRs, fetch the ticket. If it's a Subtask (or otherwise looks like a fragment per the signals above), walk up to its parent; if the parent is a Story under an Epic, walk up once more. Stop when further traversal stops adding user-visible clarity. Use judgment — these rules don't anticipate every project shape, and over-fetching is cheap.

### 5. Recommend Version

Apply semantic versioning rules with sourced reasoning:

| Bump | Triggers |
|------|----------|
| **MAJOR** | `!` or `BREAKING CHANGE` in any commit, PR title with `!:`, `BREAKING CHANGE` / `## Breaking Changes` in any PR body, PR labeled `breaking`, JIRA ticket flagged as breaking |
| **MINOR** | Any `feat:` commit, PR with feature label, Story-type ticket |
| **PATCH** | Only `fix:`/`chore:`/`refactor:` and Bug/Task tickets |

**Largest applicable bump wins.** Any breaking change → MAJOR (even mixed with features or fixes). Any new feature → MINOR (features + fixes together is still MINOR). Fixes only → PATCH.

**Scan PR bodies, not just labels.** PR descriptions often carry the breaking-change callout under a `## Breaking Changes` heading. Don't rely on labels alone — many projects never apply them. If every fetched PR returns `labels: []`, surface a warning like *"no PR labels in use across this release — relying on commit markers and PR-body scan for breaking-change signal."*

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

### 8. Open PRs, Ship, and Sync

Open *both* PRs (release → `{{mainBranch}}` and release → `{{developBranch}}`) before merging either. Reasons:

- **PR-first QA.** The release PR to `{{mainBranch}}` triggers CI and — if the project has preview deploys — gives QA a preview URL. Don't gate PR creation on local testing.
- **Branch preservation.** Many repos enable "Automatically delete head branches." GitHub skips auto-delete while any open PR still references the branch, so opening both PRs up front keeps `release/X.Y.Z` alive across the first merge. Open the `{{mainBranch}}` PR only, merge it, and the branch is gone before you can open the back-merge.

1. Push: `git push -u origin release/X.Y.Z`

2. **Open the release PR** to `{{mainBranch}}` via `codery-pr` (or `gh pr create` directly). This is the QA-bearing PR — merging it ships the release.
   - Use the commit/PR/JIRA context gathered in Step 4 for the description (Why / What / How to Verify), consistent with `codery-pr` output.
   - Open as a normal PR, **not draft**. A release branch means "we think this is shippable, please review"; draft would delay required reviewers and preview-deploy notifications.

3. **Open the back-merge PR** immediately with `gh pr create --base {{developBranch}}` (codery-pr assumes `{{mainBranch}}` as the base and isn't suitable here). Title it so reviewers know it's a sync — e.g. `chore: back-merge release X.Y.Z to {{developBranch}}`. Body can point to the release PR for context.

4. **Test the release** on the preview deploy attached to the `{{mainBranch}}` PR. If the project has no preview deploy, fall back to a local checkout of `release/X.Y.Z`. Push fixes to the release branch as issues surface — *both* PRs update automatically.

5. **On approval, merge the release PR, then tag:**

   ```bash
   git checkout {{mainBranch}} && git pull
   git tag vX.Y.Z && git push origin vX.Y.Z
   ```

   The release branch stays alive here because the back-merge PR still references it.

6. **Merge the back-merge PR.** The release branch auto-deletes on this merge (if that's enabled in the repo). If the back-merge PR went red after step 5 (rare in a release flow, but possible if `{{mainBranch}}` had diverged), resolve conflicts on the release branch and push — GitHub re-runs mergeability.

7. Emit a **draft release-notes block** for the eventual GitHub release, using the default structure below. The skill should fill in the entries from the gathered commits, PRs, and parent tickets — citing the **parent Story or Task** (not subtasks) so the notes read as user-visible outcomes rather than implementation fragments. Omit sections that have no entries.

   ```markdown
   ## Breaking changes
   - <description> ({{projectKey}}-XXX) — #<pr>

   ## New features
   - <description> ({{projectKey}}-XXX) — #<pr>

   ## Fixes
   - <description> ({{projectKey}}-XXX) — #<pr>

   ## Other
   - <description> ({{projectKey}}-XXX) — #<pr>
   ```

   Sections map to semver bumps: Breaking → MAJOR, New features → MINOR, Fixes → PATCH, Other → no version impact. The user can discard or reshape this block freely — it's a default starting point, not a mandated format.

## Notes

- This skill never reads or writes a CHANGELOG.md file. If your project maintains one, version it with whatever tool you already use (e.g., semantic-release in CI).
- The release-notes draft in Step 8 is a default template for the GitHub release body, not a required format. Override per project as needed.
