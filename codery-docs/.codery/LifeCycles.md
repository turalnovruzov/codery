# Codery Development Lifecycles

## Classic Lifecycle Role Handoff Order

### 1. **MIRROR MODE** — Confirm understanding and clarify the request

- *Handoff to → SCOUT MODE*
- Add to your checklist: JIRA time logging and comments

### 2. **SCOUT MODE** — Gather requirements, context, and technical details

- *Handoff to → ARCHITECT MODE*
- Add to your checklist: JIRA time logging and comments

### 3. **ARCHITECT MODE** — Design the solution, document the approach, and break down tasks

- *Handoff to → TINKER MODE (for planning/spec updates) or directly to BUILDER MODE if plan is clear*
- Add to your checklist: JIRA time logging and comments

### 4. **TINKER MODE** (optional) — Refine plan, update specs/README, clarify implementation details

- *Handoff to → BUILDER MODE*
- Add to your checklist: JIRA time logging and comments

### 5. **CRK ASSESSMENT** — Perform and present summary of Confidence Level, Risks, and Knowledge Gap assessment

- Assess if ready for build phase or list unknowns/risks
- Add to your checklist: JIRA time logging and comments

### 6. **BUILDER MODE** — Implement code, tests, and documentation as per the plan

- *Handoff to → KANBAN MODE*
- Add to your checklist: JIRA time logging and comments

### 7. **KANBAN MODE** — Update status, record SNR, and coordinate review/approval

- *Handoff to → USER MODE for final approval*
- Add to your checklist: JIRA time logging and comments

### 8. **USER MODE** — User reviews and approves the work for merge

- *Handoff to → KANBAN MODE to close and merge*
- Add to your checklist: User's JIRA time logging and comment expectations

## Important Notes

- Each step should include a clear **SNR** (Summarize, Next Steps, Request Role) block before handoff
- Every handoff to BUILDER MODE requires a **CRK** (Confidence, Risks, and Knowledge Gap) assessment
- CRK findings must be added to your checklist with JIRA comments

## Self-Introspective Analysis Mode Instructions

When the user invokes **Self-Report**, **Self-Diagnose**, or **Retrospective** roles:

### 1. Check PROJECTCODERY Configuration

- Create improvement tickets in PROJECTCODERY if configured
- Otherwise, write lessons to `/public/Codery/Playbooks/Lifecycles/LessonsLearned.md`

### 2. LessonsLearned.md Entry Format

For documentation entries:
- Document patterns, failures, and improvements discovered
- These are learning notes, NOT tickets
- Include timestamp, session context, and actionable insights

**Required format:**
```
Date | Finding Category | Description | Recommendation
```

## Lifecycle Summary

The lifecycle ensures systematic progression through phases:

1. **Understanding** (Mirror) → **Research** (Scout) → **Design** (Architect)
2. **Planning** (Tinker) → **Assessment** (CRK) → **Implementation** (Builder)
3. **Tracking** (Kanban) → **Approval** (User) → **Completion** (Merge)

Each phase has specific responsibilities and mandatory JIRA documentation requirements to maintain project visibility and accountability.