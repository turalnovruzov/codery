# PR Description Conventions

**MANDATORY: Follow these conventions for ALL pull requests.**

## Title

- Conventional commit prefix: `feat: ...`, `fix: ...`, `docs: ...`
- Include ticket ID: `feat: add PR conventions ({{projectKey}}-42)`
- Under 72 characters, imperative mood ("add", not "added")

## Description

Every PR description has three mandatory sections, in this order.

### Why

Explain the problem or motivation. The description must stand on its own — link the ticket but never defer to it ("See {{projectKey}}-42" alone is not acceptable). A reader should understand the purpose without opening any external link.

### What

Bulleted list of significant changes. Summarize intent, don't replay the diff. Keep it proportional — a one-line fix needs one bullet, not five.

### How to Verify

Specific steps, commands, or test scenarios a reviewer can follow to validate the change. Automated test references count if they cover the claim.

### Conditional Sections (when applicable)

- **Breaking Changes** — Migration steps, what breaks, who is affected. Never bury these inside the "What" list.
- **Screenshots / Evidence** — Required for visual or UI changes. Before/after format preferred.
- **Reviewer Guidance** — Flag tricky decisions, areas needing extra attention, or related files the diff doesn't make obvious.

## Sizing

If the description needs a wall of text, the PR is too large. Split it. Small, focused PRs with clear descriptions merge faster and break less.

## Anti-Patterns

- Empty or pointer-only descriptions ("See {{projectKey}}-42")
- Describing changes that weren't actually implemented
- Burying breaking changes without calling them out
- Unreviewed AI-generated descriptions — if you didn't validate it, don't submit it
- Restating the diff line-by-line instead of explaining intent
