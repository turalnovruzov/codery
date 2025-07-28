# Subagents

## Overview

Codery leverages Claude Code's native subagent feature for specialized AI assistants. Subagents replace the previous text-based role system with a more powerful implementation featuring independent context windows, specific tool permissions, and built-in JIRA integration.

## What are Codery Subagents?

Codery subagents are pre-configured AI specialists that handle specific aspects of the development lifecycle:

- **Independent Context**: Each subagent operates in its own context window
- **Tool Restrictions**: Only granted necessary tools for their specific role
- **JIRA Integration**: Every subagent documents work directly in JIRA
- **Template Variables**: Automatically configured with your project's {{projectKey}} and {{cloudId}}

## Available Subagents

### scout
Research and exploration specialist. Investigates APIs, libraries, and file structures before implementation.
- **Tools**: Read, Grep, Glob, LS, WebSearch, WebFetch, Task, JIRA tools
- **JIRA Format**: `[Scout] Description of finding`

### architect  
System design specialist. Creates technical recommendations and documents architectural decisions.
- **Tools**: Read, Grep, Glob, LS, TodoWrite, JIRA tools
- **JIRA Format**: `[Architect] Design decision with rationale`

### builder
Code implementation specialist. Writes code based on approved designs.
- **Tools**: Read, Edit, MultiEdit, Write, Grep, Glob, LS, TodoWrite, Bash, JIRA tools
- **JIRA Format**: `[Builder] What was built conceptually`

### crk
Confidence, Risks, and Knowledge assessment specialist. Evaluates readiness before builds.
- **Tools**: Read, Grep, Glob, LS, JIRA tools
- **JIRA Format**: `[CRK] Confidence: X%. Risks: Y. Gaps: Z`

### audit
Code review specialist. Checks security, performance, and maintainability.
- **Tools**: Read, Grep, Glob, LS, JIRA tools
- **JIRA Format**: `[Audit] Specific issue found at file:line`

### debug
Problem-solving specialist. Investigates errors and identifies root causes.
- **Tools**: Read, Grep, Glob, LS, Bash, JIRA tools
- **JIRA Format**: `[Debug] Bug description and root cause`

### patch
Bug fix specialist. Implements minimal, targeted fixes.
- **Tools**: Read, Edit, MultiEdit, Grep, Glob, LS, JIRA tools
- **JIRA Format**: `[Patch] Description of fix applied`

### poc
Proof of concept specialist. Rapid prototyping with mock data allowed.
- **Tools**: All tools available
- **JIRA Format**: `[POC] What was proven and findings`

### polish
Code quality specialist. Refactors for readability and best practices.
- **Tools**: Read, Edit, MultiEdit, Grep, Glob, LS, JIRA tools
- **JIRA Format**: `[Polish] Improvements made`

### package
Deployment specialist. Handles git operations and merging to protected branches.
- **Tools**: Bash, Read, JIRA tools with transition permissions
- **JIRA Format**: `[Package] Deployment actions taken`

### introspection
Session analysis specialist. Reviews work for system improvements.
- **Tools**: Read, Write, TodoWrite, JIRA tools with create permissions
- **JIRA Format**: `[Introspection] Session findings`

## How Subagents Work with Codery

### Automatic Installation
When you run `codery build`, all subagents are automatically:
1. Copied to `.claude/agents/` in your project
2. Configured with your JIRA settings
3. Ready for immediate use in Claude Code

### JIRA Integration Pattern
Every subagent MUST document work in JIRA:
```
[SubagentName] Actual findings/decisions/implementations
```

Bad examples:
- "[Scout] Investigated files" ❌
- "[Builder] Implemented feature" ❌

Good examples:
- "[Scout] Found auth handled in src/auth/jwt.ts using bcrypt v5.0" ✅
- "[Builder] Created JWT refresh token system with 15min expiry" ✅

### Delegation Flow
1. Main Claude agent receives task with JIRA ticket
2. Delegates to appropriate subagent with context
3. Subagent performs work and documents in JIRA
4. Returns results to main agent
5. Main agent provides SNR summary to user

## Using Subagents

### Automatic Delegation
Claude Code will automatically use appropriate subagents based on the task:
```
> Investigate the authentication system
[Claude automatically delegates to scout subagent]
```

### Explicit Invocation  
You can request specific subagents:
```
> Use the audit subagent to review my recent changes
> Have the debug subagent investigate this error
```

### Viewing Available Subagents
Use the `/agents` command in Claude Code to:
- List all Codery subagents
- See their descriptions and tools
- Understand when each should be used

## Best Practices

### 1. Let Subagents Handle Their Domain
Don't try to make one subagent do everything. Each has a specific purpose.

### 2. Check JIRA Documentation
Every subagent action should have a corresponding JIRA comment with substance.

### 3. Trust the Delegation
Claude Code knows when to use each subagent based on their descriptions.

### 4. Maintain Context Flow
The main agent passes JIRA ticket context to subagents automatically.

## Subagent vs Traditional Roles

| Aspect | Traditional Roles | Subagents |
|--------|------------------|-----------|
| Context | Shared with main | Independent window |
| Tools | All available | Only necessary ones |
| Switching | Manual commands | Automatic delegation |
| JIRA | Manual tracking | Built into each subagent |

## Troubleshooting

### Subagents Not Appearing
- Run `codery build` to copy subagents
- Check `.claude/agents/` directory exists
- Verify no errors during build

### JIRA Comments Missing
- Ensure {{projectKey}} and {{cloudId}} are configured
- Check subagent has JIRA tool permissions
- Verify JIRA authentication is working

### Wrong Subagent Used
- Check task description clarity
- Use explicit invocation if needed
- Review subagent descriptions

## Summary

Codery subagents transform the role-based methodology into Claude Code's native feature, providing:
- Better context management through isolation
- Enhanced security through tool restrictions  
- Automatic JIRA documentation
- Seamless integration with existing Codery workflows

The transition from text-based roles to native subagents maintains all Codery principles while leveraging Claude Code's superior implementation.