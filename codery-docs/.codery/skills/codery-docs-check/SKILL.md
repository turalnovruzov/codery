---
description: Check if documentation needs updates based on PR changes. Use when the user says "check docs", "do docs need updating", "documentation check", or before merging a PR.
argument-hint: [PR-number]
---

# Docs Check

**Goal**: Ensure documentation stays in sync with code changes.

## Process

### 1. Understand the Changes
If PR number given, fetch diff with `gh pr diff <number>`. Otherwise check current branch: `git diff main...HEAD`.

Analyze: new features, behavior changes, API changes, config changes, dependency updates.

### 2. Find Documentation Sources
Read `.codery/config.json` for the `applicationDocs` array. These are the source files to check and update. Never edit generated files.

### 3. Review Each Doc Source
For each file in `applicationDocs`: read content, compare against PR changes, identify gaps or outdated info.

### 4. Suggest Updates
Present findings: which docs need updates, which are still accurate. Be specific about sections and what to add/change.

### 5. Make Edits (If Approved)
Only after explicit approval. Edit source files with focused, minimal changes.
