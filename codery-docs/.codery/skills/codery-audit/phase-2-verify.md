# Phase 2 — Functional Verification

**Goal:** Run the thing. Confirm it does what it claims to do — not just that the code reads correctly.

**Inputs:** Phase 1's requirement → file mapping (the test plan), PR diff (for diff-driven probes), available tools (`gh`, `curl`, dev-server scripts, Playwright MCP, project test commands).

## Signals — what to verify

- Each requirement scored `met` or `partial` in Phase 1 → derive a verification scenario for it
- New tests added by the PR → run them
- Diff-touched code paths not covered by AC → probe quickly for regression

If Phase 1 reported `not-applicable`, fall back to: verify the PR's stated changes work as described in its own description.

## Principles

- **Cheapest credible verification per scenario.** Existing tests cover it → run them. CLI command → run it. API endpoint → `curl` / `gh api`. UI flow → Playwright. Complex / auth-gated / external → manual handoff.
- **Evidence convention.** For each scenario: `Ran X. Observed Y. Expected Z. Match | mismatch.` Same shape Builder/Executor use elsewhere.
- **Never fabricate test data.** No mock setup, no fake fixtures, no production-data shortcuts. If verification needs realistic data the env doesn't have, that's a manual handoff.
- **Never run destructive operations** (drops, deletes, prod writes, `rm -rf`, `git reset --hard`) without explicit user confirmation. Defer to standard destructive-action rules.
- **Punt and continue.** When a scenario can't run (auth, env, complex setup), produce a manual handoff, mark the scenario `awaiting-manual`, and continue. Don't block the audit.

## Manual handoff format

When the model can't verify a scenario itself:

```text
🧪 Manual verification needed: <scenario>
   Why: <auth / env / external service / hardware / etc.>
   Steps:
     1. <concrete step>
     2. <concrete step>
   Expected: <what success looks like>
   Reply with the result and the audit will incorporate it.
```

## Phase status

- `passed` — every scenario verified, every result matched
- `partial` — some scenarios verified-OK, some `awaiting-manual` (none failed)
- `failed` — at least one scenario verified-broken
- `blocked` — nothing could be run (build failed, no env, missing deps); Phase 4 falls back to static-only review and notes the gap

## Anti-patterns

- Reading code and declaring it "works" without running anything
- Mocking up data to make a verification "pass"
- Running destructive operations to "test" them
- Marking the whole phase `blocked` because one scenario needs manual — punt that one, verify the rest

## Output for the consolidated report

```text
Phase 2 — Functional Verification: <STATUS>

  ✅ Verified (N):
    - <scenario>
      Ran: <command/action>
      Observed: <result>
      Match.

  🧪 Awaiting manual (N):
    - <scenario>
      [handoff block]

  ❌ Verified broken (N):
    - <scenario>
      Ran: <command/action>
      Observed: <result>
      Expected: <expected>
      Diagnosis: <brief>

  ⚠️  Blocked: <reason>     (only when status = blocked)
```
