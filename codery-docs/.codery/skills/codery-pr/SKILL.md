---
allowed-tools: Bash, Read, Grep
description: Create a pull request with a well-structured description following industry best practices. Use when creating a PR, opening a pull request, pushing changes for review, or when the user says "create a PR", "open a PR", "make a pull request", or "ready for review".
argument-hint: [ticket-id] [--draft]
---

# Create Pull Request

Create a pull request for the current branch with a title and description that follow industry best practices.

## Process

### 1. Gather Context

Run these in parallel to understand what's being shipped:

- `git branch --show-current` — confirm not on main
- `git status` — check for uncommitted changes
- `git log main..HEAD --oneline` — commits on this branch
- `git diff main...HEAD --stat` — scope of changes
- `git diff main...HEAD` — actual changes (review all commits, not just the latest)

If there are uncommitted changes, stop and ask the user how to handle them.

### 2. Extract Ticket ID

- From `$ARGUMENTS` if provided
- Otherwise from branch name (e.g., `feature/{{projectKey}}-42-description` → `{{projectKey}}-42`)
- Otherwise from commit messages

### 3. Draft Title

Format: `<type>(<scope>): <subject> (<ticket>)`

- **Conventional commit prefix**: `feat`, `fix`, `docs`, `refactor`, `chore`, etc.
- **Subject**: Imperative mood ("add", not "added"), under 72 characters total
- **Ticket ID**: Include at the end in parentheses

Examples:
- `feat(cli): add progress bar to build command ({{projectKey}}-42)`
- `fix(build): handle missing config gracefully ({{projectKey}}-45)`

### 4. Draft Description

Every PR description has four mandatory sections, in this order.

#### Why

Explain the problem or motivation. The description must stand on its own — link the ticket but never defer to it. "See {{projectKey}}-42" alone is not acceptable. A reader should understand the purpose without opening any external link.

#### What

Bulleted list of significant changes. Summarize intent, don't replay the diff. Keep it proportional — a one-line fix needs one bullet, not five. Review all commits on the branch, not just the latest.

#### Evidence

Concrete verification the author already performed before requesting review. Examples: `npm test passed`, `manually exercised the init flow in a sandbox project`, `grep -r 'xxx' returns only expected hits`. "I think it should work" is not evidence. If a section is genuinely N/A (e.g., documentation-only change with no code), say so explicitly.

#### How to Verify

Specific steps, commands, or test scenarios a reviewer can follow to validate the change. Automated test references count if they cover the claim.

#### Conditional Sections (when applicable)

- **Breaking Changes** — Migration steps, what breaks, who is affected. Never bury these inside the "What" list.
- **Screenshots** — Required for visual or UI changes. Before/after format preferred.
- **Reviewer Guidance** — Flag tricky decisions, areas needing extra attention, or related files the diff doesn't make obvious.

### 5. Sizing Check

If the description needs a wall of text, the PR is too large. Stop and suggest splitting it. Small, focused PRs with clear descriptions merge faster and break less.

### 6. Present for Approval

Show the user the drafted title and description. Wait for approval before creating the PR.

### 7. Push and Create

After approval:

1. Push the branch if not already pushed: `git push -u origin <branch>`
2. Create the PR using `gh pr create` with a HEREDOC for the body. If the invoker requested a draft PR (via `--draft` in arguments, or contextually — e.g., invoked by `codery-autopilot`), pass `--draft` to `gh pr create`:

```bash
gh pr create --title "the title" --body "$(cat <<'EOF'
## Why

...

## What

- ...

## Evidence

- ...

## How to Verify

...
EOF
)"
```

3. Return the PR URL to the user

### 8. Update JIRA

After PR creation, add a comment to the ticket linking the PR.

## Anti-Patterns — Never Do These

- **Empty or pointer-only descriptions** ("See {{projectKey}}-42")
- **Describing changes that weren't actually implemented** — verify every bullet against the diff
- **Burying breaking changes** without calling them out in a dedicated section
- **Unreviewed AI-generated descriptions** — always present for user approval before creating
- **Restating the diff line-by-line** instead of explaining intent
- **Reviewing only the latest commit** when the branch has multiple commits — check all of them
