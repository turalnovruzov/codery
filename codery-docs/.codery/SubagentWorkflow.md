# Subagent Integration

## JIRA Documentation Pattern

When subagents complete work, document as:
`[SubagentType] Actual findings in your own words`

Example: `[Scout] Found JWT auth in src/auth/jwt.ts using bcrypt v5.0`

## Output Display Order

**CRITICAL**: Always follow this sequence:
1. Show complete subagent output FIRST
2. Add JIRA comment with findings
3. Provide SNR summary
4. Wait for user approval before proceeding

## Workflow Integration Patterns

### Post-Build Audit (MANDATORY)
```
After Builder Mode completion:
1. Automatically delegate to audit subagent
2. Display full audit findings
3. Document: "[Audit] No issues found" or specific issues
4. Wait for user decision on fixes
```

### Complex Investigation
```
During Scout Mode with multi-file searches:
1. Delegate to scout subagent with specific targets
2. Display all discovered information
3. Document: "[Scout] Found X in Y files..."
4. Continue with Architect Mode
```

## Key Patterns

**Post-Build Audit**: Always delegate to audit subagent after building
**Complex Searches**: Delegate multi-file searches to scout subagent  
**Parallel Work**: Use multiple subagents for independent tasks
**Context Passing**: Include ticket number, file paths, expected output

Main agent retains: JIRA updates, user interaction, overall orchestration