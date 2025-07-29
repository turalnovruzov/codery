# Subagents

## Overview

Codery leverages Claude Code's native subagent feature for specialized AI assistants. Subagents complement the role system by providing isolated execution environments with independent context windows, specific tool permissions, and focused expertise.

## What are Codery Subagents?

Codery subagents are pre-configured AI specialists that handle specific aspects of the development lifecycle:

- **Independent Context**: Each subagent operates in its own context window
- **Tool Restrictions**: Only granted necessary tools for their specific role
- **Pure Specialists**: Focus on their expertise without handling project management
- **Natural Output**: Provide findings naturally without rigid formats

## Available Subagents

### scout
Research and exploration specialist. Investigates APIs, libraries, and file structures before implementation.
- **Tools**: Read, Grep, Glob, LS, WebSearch, WebFetch
- **Focus**: Pure code investigation and research

### architect  
System design specialist. Creates technical recommendations and documents architectural decisions.
- **Tools**: Read, Grep, Glob, LS, TodoWrite
- **Focus**: Pure solution design and planning

### builder
Code implementation specialist. Writes code based on approved designs.
- **Tools**: Read, Edit, MultiEdit, Write, Grep, Glob, LS, TodoWrite, Bash
- **Focus**: Pure code implementation and testing

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

### Delegation Flow
1. Main Claude agent receives task with JIRA ticket
2. Delegates to appropriate subagent with context
3. Subagent performs work using its specialized expertise
4. Subagent returns natural, detailed findings to main agent
5. Main agent displays the subagent's detailed output to user
6. **Main agent handles JIRA documentation** based on subagent findings
7. Main agent provides SNR summary to user
8. **STOP**: Main agent waits for user approval before any further action

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

## Main Agent Responsibilities

When working with subagents, the main Claude agent MUST:

### 1. Display Subagent Output
After a subagent completes its work:
- **First**: Display the subagent's natural, detailed output to the user
- **Then**: Handle JIRA documentation based on the findings
- **Finally**: Provide your SNR summary
- **Always**: Ensure users see the detailed findings before summary

### 2. JIRA Documentation
The main agent handles all JIRA operations:
- Document subagent findings in appropriate format
- Use prefixes like `[Scout]`, `[Architect]`, `[Builder]` for clarity
- Focus on WHAT was found/designed/built, not just activity
- Example: `[Scout] Found auth handled in src/auth/jwt.ts using bcrypt v5.0`

### 3. Never Skip Detailed Output
- Do NOT summarize or paraphrase subagent output
- Do NOT hide findings behind SNR alone
- Do NOT make output display conditional
- ALWAYS show the full subagent report naturally

### 4. Always Wait for User Approval
- After providing SNR, STOP and wait for user response
- Do NOT automatically proceed to next subagent or phase
- Do NOT continue without explicit user approval (e.g., "approved", "proceed")
- Only continue when user gives clear direction

## Best Practices

### 1. Let Subagents Handle Their Domain
Don't try to make one subagent do everything. Each has a specific purpose.

### 2. Document in JIRA
Main agent should document all subagent findings with substance in JIRA.

### 3. Trust the Delegation
Claude Code knows when to use each subagent based on their descriptions.

### 4. Maintain Context Flow
The main agent passes relevant context to subagents and handles all project coordination.

## Subagent vs Traditional Roles

| Aspect | Traditional Roles | Subagents |
|--------|------------------|-----------|
| Context | Shared with main | Independent window |
| Tools | All available | Only necessary ones |
| Switching | Manual commands | Automatic delegation |
| JIRA | Manual tracking | Handled by main agent |

## Troubleshooting

### Subagents Not Appearing
- Run `codery build` to copy subagents
- Check `.claude/agents/` directory exists
- Verify no errors during build

### JIRA Comments Missing
- Check main agent JIRA authentication is working
- Verify main agent is properly documenting subagent findings
- Ensure JIRA ticket context is being passed correctly

### Wrong Subagent Used
- Check task description clarity
- Use explicit invocation if needed
- Review subagent descriptions

## Summary

Codery subagents transform the role-based methodology into Claude Code's native feature, providing:
- Better context management through isolation
- Enhanced security through tool restrictions  
- Natural expertise-focused output
- Clean separation between specialists and orchestration

The transition from text-based roles to native subagents maintains all Codery principles while leveraging Claude Code's superior implementation for pure specialist patterns.