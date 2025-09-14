# Codery Development Lifecycles

## Classic Lifecycle Role Handoff Order

**Note**: Every step requires JIRA documentation to track progress and decisions.

### 1. **MIRROR MODE** — Confirm understanding and clarify the request

- *Handoff to → SCOUT MODE*

### 2. **SCOUT MODE** — Gather requirements, context, and technical details

- *Handoff to → ARCHITECT MODE*

### 3. **ARCHITECT MODE** — Design the solution, document the approach, and break down tasks

- *Handoff to → TINKER MODE (for planning/spec updates) or directly to BUILDER MODE if plan is clear*

### 4. **TINKER MODE** (optional) — Refine plan, update specs/README, clarify implementation details

- *Handoff to → BUILDER MODE*

### 5. **CRK ASSESSMENT** — Perform and present summary of Confidence Level, Risks, and Knowledge Gap assessment

- Assess if ready for build phase or list unknowns/risks

### 6. **BUILDER MODE** — Implement code, tests, and documentation as per the plan

- *Handoff to → KANBAN MODE*

### 7. **KANBAN MODE** — Update status, record SNR, and coordinate review/approval

- *Handoff to → User for final approval*

### 8. **User Approval** — User reviews and approves the work for merge

- *Return to → KANBAN MODE to close and merge*

## Important Notes

- Follow SNR protocol as defined in the Roles section above
- CRK assessment required before BUILDER MODE (see CRK Mode details above)

## Self-Introspective Analysis

Session analysis is handled directly in the main context:

### 1. Retrospective Documentation
- Reads existing .codery/Retrospective.md file
- Identifies genuinely new learnings from session
- Appends unique insights to avoid duplication
- Maintains persistent knowledge across sessions

### 2. Retrospective.md Entry Format

```
| Date | Category | Finding | Root Cause | Recommendation | Ticket |
| YYYY-MM-DD | Category Name | What happened | Why it happened | How to prevent | COD-XXX |
```

### 3. Benefits of Persistent Learning
- Knowledge accumulates across all sessions
- Common patterns become visible over time
- Reduces repeated mistakes
- Improves system continuously

## Lifecycle Summary

Systematic progression through three phases:

1. **Understanding** (Mirror) → **Research** (Scout) → **Design** (Architect)
2. **Planning** (Tinker) → **Assessment** (CRK) → **Implementation** (Builder)
3. **Tracking** (Kanban) → **Approval** (User) → **Completion** (Merge)
