# Codery Development Lifecycles

## Development Flow with Subagents

The Codery development lifecycle leverages specialized subagents for each phase of development. The main Claude agent orchestrates the flow while subagents handle specific tasks.

### 1. **Understanding Phase**
- Main agent confirms understanding with user
- May use **scout** subagent for initial research
- Documents context in JIRA

### 2. **Research Phase**
- **scout** subagent investigates codebase, APIs, and dependencies
- Documents all findings in JIRA with `[Scout]` prefix
- Returns comprehensive report

### 3. **Design Phase**
- **architect** subagent creates solution design
- Documents architecture decisions and tradeoffs in JIRA
- Provides clear implementation plan

### 4. **Assessment Phase**
- **crk** subagent evaluates confidence, risks, and knowledge gaps
- Must achieve 85%+ confidence before proceeding
- Documents assessment in JIRA

### 5. **Implementation Phase**
- **builder** subagent implements the approved design
- Documents what was built conceptually in JIRA
- Commits with JIRA ticket references

### 6. **Quality Assurance Phase**
- **audit** subagent reviews code for issues
- **debug** subagent investigates any failures
- **patch** subagent applies targeted fixes
- All findings documented in JIRA

### 7. **Finalization Phase**
- **polish** subagent improves code quality
- **package** subagent handles deployment
- Updates JIRA ticket status

### 8. **Retrospective Phase** (Optional)
- **introspection** subagent analyzes session
- Documents learnings in .codery/Retrospective.md
- Identifies patterns for system improvement
- Ensures knowledge persists across sessions

## Important Notes

- Main agent provides **SNR** (Summarize, Next Steps, Request) after subagent work
- Every subagent MUST document work in JIRA
- Subagents operate with independent context windows
- User approvals happen through main agent interaction

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

The lifecycle ensures systematic progression:

1. **Understanding** → **Research** (scout) → **Design** (architect)
2. **Assessment** (crk) → **Implementation** (builder)
3. **Quality** (audit/debug/patch) → **Deployment** (package)
4. **Retrospective** (introspection) → **Learning** (.codery/Retrospective.md)

Each phase uses specialized subagents with mandatory JIRA documentation to maintain project visibility and accountability. The retrospective phase ensures continuous improvement through persistent learning.