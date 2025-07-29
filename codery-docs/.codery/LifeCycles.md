# Codery Development Lifecycles

## Classic Lifecycle Role Handoff Order

### 1. **MIRROR MODE** — Confirm understanding and clarify the request

- *Handoff to → SCOUT MODE*
- Add to your checklist: JIRA comments

### 2. **SCOUT MODE** — Gather requirements, context, and technical details

- *Handoff to → ARCHITECT MODE*
- Add to your checklist: JIRA comments

### 3. **ARCHITECT MODE** — Design the solution, document the approach, and break down tasks

- *Handoff to → TINKER MODE (for planning/spec updates) or directly to BUILDER MODE if plan is clear*
- Add to your checklist: JIRA comments

### 4. **TINKER MODE** (optional) — Refine plan, update specs/README, clarify implementation details

- *Handoff to → BUILDER MODE*
- Add to your checklist: JIRA comments

### 5. **CRK ASSESSMENT** — Perform and present summary of Confidence Level, Risks, and Knowledge Gap assessment

- Assess if ready for build phase or list unknowns/risks
- Add to your checklist: JIRA comments

### 6. **BUILDER MODE** — Implement code, tests, and documentation as per the plan

- *Handoff to → KANBAN MODE*
- Add to your checklist: JIRA comments

### 7. **KANBAN MODE** — Update status, record SNR, and coordinate review/approval

- *Handoff to → USER MODE for final approval*
- Add to your checklist: JIRA comments

### 8. **USER MODE** — User reviews and approves the work for merge

- *Handoff to → KANBAN MODE to close and merge*
- Add to your checklist: User's JIRA comment expectations

## Important Notes

- Each step should include a clear **SNR** (Summarize, Next Steps, Request Role) block before handoff
- Every handoff to BUILDER MODE requires a **CRK** (Confidence, Risks, and Knowledge Gap) assessment
- CRK findings must be added to your checklist with JIRA comments

## Self-Introspective Analysis

The **introspection** subagent handles session analysis:

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

The lifecycle ensures systematic progression through phases:

1. **Understanding** (Mirror) → **Research** (Scout) → **Design** (Architect)
2. **Planning** (Tinker) → **Assessment** (CRK) → **Implementation** (Builder)
3. **Tracking** (Kanban) → **Approval** (User) → **Completion** (Merge)

Each phase has specific responsibilities and mandatory JIRA documentation requirements to maintain project visibility and accountability.
