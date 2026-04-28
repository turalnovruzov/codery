# Phase 3 — Design Fidelity

**Goal:** Where a design source of truth exists, verify the implementation matches it.

**Inputs:** linked JIRA ticket, PR description, PR diff, design tools (Figma MCP if available).

## Signals — when this phase applies

A "design source of truth" is anything the team committed to as the spec for what this work should look like. Concretely:

- A Figma file linked in the JIRA ticket or the PR description
- A mockup image attached to the ticket or PR
- A design document (annotated screenshots, component spec, design ADR) referenced from the ticket or PR
- A design system component the PR claims to implement against

If none of these exist for this work, the phase is `not-applicable` and is omitted from the consolidated report. Do not manufacture a design source.

## Principles

- **Compare what the diff produces to what the source describes.** Use Figma MCP to read the source when available; otherwise compare against the image or document.
- **Focus on observable fidelity.** Layout, spacing, typography, color, component states (loading / empty / error / success), interaction affordances. Don't critique the design itself.
- **Surface mismatches as concrete findings.** "Button is `bg-slate-700` in code; design uses `bg-slate-800`" — addressable, not opinion.
- **Acknowledge intentional deviations.** If the PR description explains a deviation from the design, accept it; don't re-litigate.

## Phase status

- `passed` — implementation matches source on every dimension checked
- `partial` — minor mismatches (small spacing, near-color shifts) but overall intent preserved
- `failed` — significant mismatch (missing states, wrong layout, wrong components)
- `not-applicable` — no design source of truth identified; phase is omitted from the report

## Anti-patterns

- Inventing a design source from the description when none was linked
- Critiquing the design itself ("this should be a different color")
- Treating implementation choices unrelated to design (variable names, file structure) as fidelity issues

## Output for the consolidated report

When `not-applicable`, the phase is omitted entirely. When it ran:

```text
Phase 3 — Design Fidelity: <STATUS>

Source: <Figma URL / mockup / design doc>

  ✅ Matches (N):
    - <dimension>: <evidence>

  ⚠️  Minor mismatch (N):
    - <dimension>: <implementation> vs <source>

  ❌ Mismatch (N):
    - <dimension>: <implementation> vs <source>
      Why it matters: <impact>
```
