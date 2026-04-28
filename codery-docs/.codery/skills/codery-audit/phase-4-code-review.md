# Phase 4 — Code Review

**Goal:** Improve overall code health. Not perfect — *better*.

> "There is no such thing as 'perfect' code — there is only better code. Reviewers should favor approving a CL once it is in a state where it definitely improves the overall code health of the system being worked on, even if the CL isn't perfect." — Google's Code Review Standard

**Inputs:** PR diff, prior PRs in the same area (1–3 for pattern comparison), `CLAUDE.md` and applicable doc imports for project conventions, code comments in modified files.

## Navigation — how to read the diff

1. **Broad view first.** Does the change make sense at all? If the design is fundamentally wrong, surface that first — don't bury it under nits.
2. **Main components next.** Largest logical changes. Architecture concerns surface here; flag them before the author builds more on top.
3. **Systematic line review last.** Once design and architecture are sound, walk every modified line at appropriate depth.

## The 12 things to look for

- **Design** — interactions of new code with the rest of the system; does this belong here?
- **Functionality** — does it solve the actual problem; edge cases; concurrency; user-visible impact
- **Complexity** — over-engineering, speculative future-proofing, unnecessary abstractions; reject "solving problems we don't have"
- **Tests** — present, correct, sufficient; assertions actually fail when the code breaks
- **Naming** — clear, communicative, appropriately sized; no cryptic abbreviations
- **Comments** — explain *why*, not *what*; remove rotted ones; require code clarity over commentary
- **Style** — conformance to project style; use `Nit:` for personal-preference nudges
- **Consistency** — matches surrounding code unless there's a reason; new patterns require justification
- **Documentation** — README / docs / changelog / `CLAUDE.md` updated when behavior changes
- **Every Line** — understand the change at appropriate depth; ask for clarification rather than assuming
- **Context** — fit with the broader system; cumulative complexity; degradation
- **Good Things** — name what was done well; reinforcement is part of review

## Pattern comparison

For each substantial diff area, find 1–3 prior merged PRs in the same surface (`gh pr list`, `git log` on touched files). Diff the new approach against the old:

- Does it follow established naming, structure, conventions?
- Does it contradict recent decisions without explanation?
- Does it introduce a new pattern without justifying why?

Divergence without justification is a finding.

## Severity labels

Adopt Google's conventions plus a few extras for this audit's needs:

- **Critical** — must fix before merge; bug, security issue, data loss risk, broken functionality
- **Important** — should fix before merge; architecture problems, missing error handling, test gaps that matter
- **`Nit:`** — minor, technically should be addressed; non-blocking
- **`Optional:`** / **`Consider:`** — suggestion without expectation; author's call
- **`FYI:`** — informational; no action expected
- **`Praise:`** — call out good work; reinforcement, not flattery

## Don't flag (false-positive guardrails)

- Pre-existing issues outside the diff
- Things a linter / typechecker / CI catches automatically
- General code-quality complaints not tied to the PR's actual changes
- Style preferences not in the project's style guide
- Stuff already silenced intentionally (`// eslint-disable`, `# noqa`, etc.)
- Real issues on lines the PR didn't modify

## Principles

- **Code health > perfection.** Approve when the system gets better, even if not ideal.
- **Address the code, not the developer.** "The concurrency model adds complexity without performance benefit" — not "Why did you do this?"
- **Explain reasoning.** Reference the principle, the doc, or the prior PR.
- **Push back where warranted.** "Improving code health happens in small steps" — don't accept "clean it up later" for new complexity.
- **Concede where warranted.** Author often knows their code better; technical merit wins.

## Phase status

Computed from severity counts:

- `failed` — any `Critical`
- `partial` — any `Important`, no `Critical`
- `passed` — only `Nit` / `Optional` / `Praise` or empty

## Output for the consolidated report

Group by severity, descending:

```text
Phase 4 — Code Review: <STATUS>

  Critical (N):
    - file:line-range — <issue>
      Why it matters: <impact>
      Fix: <how to address>

  Important (N):
    - file:line-range — <issue>
      Why it matters: <impact>

  Nit (N):
    - file:line-range — <suggestion>

  Optional / Consider (N):
    - file:line-range — <suggestion>

  Praise (N):
    - file:line-range — <what's good>
```
