# Subagent Workflow

## Codery-Specific Subagent Integration

This document outlines how subagents integrate with the Codery system's workflows and requirements.

## Main Agent Responsibilities

When working with subagents, the main Claude agent has specific responsibilities that differ from standard Claude Code usage:

### 1. JIRA Documentation Pattern

When a subagent completes work, the main agent MUST:

```
[Subagent] Detailed findings from the subagent's work
```

Examples:
- `[Scout] Found authentication in src/auth/jwt.ts using bcrypt v5.0 with 10 salt rounds`
- `[Architect] Designed event-driven architecture using Redis pub/sub for real-time updates`
- `[Audit] Security issue: API keys exposed in client bundle at build/main.js:1234`

### 2. Output Display Requirements

**CRITICAL**: Always display subagent output in this order:

1. **First**: Show the complete subagent output as returned
2. **Then**: Add JIRA comment with findings
3. **Finally**: Provide SNR summary
4. **Always**: Wait for user approval before proceeding

### 3. Context Preservation

Since subagents operate in isolated contexts:
- Pass all necessary context when delegating
- Include JIRA ticket number
- Provide relevant file paths and code snippets
- Specify expected output format

## Workflow Integration

### During Development Lifecycle

1. **Scout Phase** → Can delegate complex searches to scout subagent
2. **Architect Phase** → Can delegate design exploration to architect subagent  
3. **Builder Phase** → Can delegate implementation to builder subagent
4. **After Building** → MUST proactively delegate to audit subagent
5. **When Issues Arise** → Delegate debugging to debug subagent

### JIRA Status Updates

The main agent remains responsible for:
- Transitioning ticket status
- Adding all comments (including subagent findings)
- Maintaining ticket continuity

## Best Practices

1. **Proactive Delegation**: Don't wait for user to request subagents
2. **Clear Requirements**: Provide detailed task descriptions
3. **Preserve Findings**: Never summarize away subagent discoveries
4. **Maintain Flow**: Subagents supplement, not replace, the role system

## Common Patterns

### Pattern 1: Post-Build Audit
```
After completing Builder Mode:
1. Automatically delegate to audit subagent
2. Display full audit findings
3. Document in JIRA: "[Audit] No issues found" or specific issues
4. Wait for user decision on fixes
```

### Pattern 2: Complex Investigation
```
During Scout Mode:
1. If search spans many files/patterns
2. Delegate to scout subagent with specific targets
3. Display all discovered information
4. Continue with Architect Mode based on findings
```

### Pattern 3: Parallel Implementation
```
During Builder Mode with multiple features:
1. Identify independent components
2. Delegate each to separate builder subagents
3. Collect and display all results
4. Commit completed features together
```