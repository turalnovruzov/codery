# Subagent Integration

## JIRA Documentation Pattern

When subagents complete work, document as:
`[SubagentType] Actual findings in your own words`

Example: `[Scout] Found JWT auth in src/auth/jwt.ts using bcrypt v5.0`

## Output Display Order

1. Show complete subagent output
2. Add JIRA comment with findings
3. Provide SNR summary
4. Wait for user approval

## Key Patterns

**Post-Build Audit**: Always delegate to audit subagent after building
**Complex Searches**: Delegate multi-file searches to scout subagent  
**Parallel Work**: Use multiple subagents for independent tasks

Main agent retains: JIRA updates, user interaction, overall orchestration