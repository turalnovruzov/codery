# PR Description Conventions

**⚠️ MANDATORY: Follow these conventions for ALL pull requests.**

## Structure

Every PR description follows this order:

1. **Why** — The problem being solved, in your own words. Link the JIRA ticket but don't rely on it as the sole explanation.
2. **What** — Bulleted list of significant changes. Summarize intent, don't replay the diff.
3. **How to verify** — Test plan with specific steps or commands.

Add **Breaking Changes** or **Screenshots** sections only when applicable.

## Title

- Conventional commit prefix: `feat: ...`, `fix: ...`, `docs: ...`
- Under 72 characters, imperative mood
- Include ticket ID: `feat: add PR conventions (COD-42)`

## Never Do

- Empty or pointer-only descriptions ("See COD-42")
- Describe changes that weren't actually implemented
- Bury breaking changes without calling them out
- Write a wall of text — if you need one, the PR is too large
