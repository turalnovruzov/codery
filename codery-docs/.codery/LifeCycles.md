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
- Returns comprehensive report following Output Format
- Main agent displays full report to user before SNR

### 3. **Design Phase**
- **architect** subagent creates solution design
- Documents architecture decisions and tradeoffs in JIRA
- Provides clear implementation plan with detailed design and summary
- Main agent displays full architectural plan to user before SNR

### 4. **Assessment Phase**
- **crk** subagent evaluates confidence, risks, and knowledge gaps
- Must achieve 85%+ confidence before proceeding
- Documents assessment in JIRA

### 5. **Implementation Phase**
- **builder** subagent implements the approved design
- Documents what was built conceptually in JIRA
- Provides detailed implementation progress and summary
- Main agent displays full build report to user before SNR
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

## Important Notes

- Main agent MUST display subagent's detailed output BEFORE providing SNR
- Main agent provides **SNR** (Summarize, Next Steps, Request) after displaying subagent work
- Every subagent MUST document work in JIRA
- Subagents operate with independent context windows
- User approvals happen through main agent interaction
- Never hide or summarize subagent output - always show full details

## Self-Introspective Analysis

The **introspection** subagent handles session analysis:

### 1. Check PROJECTCODERY Configuration
- Creates improvement tickets in PROJECTCODERY if configured
- Otherwise, documents lessons learned

### 2. LessonsLearned.md Entry Format
```
Date | Finding Category | Description | Recommendation
```

## Lifecycle Summary

The lifecycle ensures systematic progression:

1. **Understanding** → **Research** (scout) → **Design** (architect)
2. **Assessment** (crk) → **Implementation** (builder)
3. **Quality** (audit/debug/patch) → **Deployment** (package)

Each phase uses specialized subagents with mandatory JIRA documentation to maintain project visibility and accountability.