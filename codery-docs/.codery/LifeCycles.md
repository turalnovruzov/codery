# Codery Development Lifecycles

## Development Flow with Subagents

The Codery development lifecycle leverages specialized subagents for each phase of development. The main Claude agent orchestrates the flow while subagents handle specific tasks.

### 1. **Understanding Phase**
- Main agent confirms understanding with user
- May use **scout** subagent for initial research
- Documents context in JIRA

### 2. **Research Phase**
- **scout** subagent investigates codebase, APIs, and dependencies
- Returns comprehensive research findings naturally
- Main agent displays full report to user
- Main agent documents findings in JIRA with `[Scout]` prefix
- **STOP**: Main agent provides SNR and waits for user approval before proceeding

### 3. **Design Phase**
- **architect** subagent creates solution design
- Provides clear implementation plan with detailed analysis
- Main agent displays full architectural plan to user
- Main agent documents design decisions in JIRA with `[Architect]` prefix
- **STOP**: Main agent provides SNR and waits for user approval before proceeding

### 4. **Assessment Phase**
- **crk** subagent evaluates confidence, risks, and knowledge gaps
- Must achieve 85%+ confidence before proceeding
- Main agent displays CRK assessment to user
- Main agent documents assessment in JIRA with `[CRK]` prefix
- **STOP**: Main agent provides SNR and waits for user approval before proceeding

### 5. **Implementation Phase**
- **builder** subagent implements the approved design
- Provides detailed implementation progress naturally
- Main agent displays full build report to user
- Main agent documents what was built in JIRA with `[Builder]` prefix
- Main agent commits with JIRA ticket references
- **STOP**: Main agent provides SNR and waits for user approval before proceeding

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
- **CRITICAL**: Main agent MUST STOP after each SNR and wait for user approval before proceeding to next phase
- Never automatically proceed from one phase to the next without user approval
- Main agent MUST document all subagent work in JIRA
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