# Subagent Audit Report for COD-19

## Executive Summary

The Codery system contains 11 predefined subagents that are part of the core system. These subagents are stored as templates in the source code and are automatically deployed to user projects during the build process.

## Subagent Inventory

### 1. **scout** - Research and Exploration Specialist
- **Purpose**: Investigates APIs, libraries, file structures before implementation
- **Tools**: Read, Grep, Glob, LS, WebSearch, WebFetch
- **Use Case**: Proactive information gathering and codebase understanding

### 2. **architect** - System Design and Architecture Specialist  
- **Purpose**: Weighs alternatives, creates technical recommendations, documents design decisions
- **Tools**: Read, Grep, Glob, LS, TodoWrite
- **Use Case**: Planning solutions and making architectural choices

### 3. **builder** - Code Implementation Specialist
- **Purpose**: Implements code, adds features, creates components based on approved designs
- **Tools**: Read, Edit, MultiEdit, Write, Grep, Glob, LS, TodoWrite, Bash
- **Use Case**: Code implementation ONLY after architecture is defined and CRK assessment completed

### 4. **audit** - Code Review and Quality Assurance Specialist
- **Purpose**: Reviews structure, security, performance, and maintainability
- **Tools**: Read, Grep, Glob, LS
- **Use Case**: Proactively used after code changes for quality assurance

### 5. **crk** - Confidence, Risks, and Knowledge Gap Assessment Specialist
- **Purpose**: Evaluates readiness before build phases
- **Tools**: Read, Grep, Glob, LS
- **Use Case**: Used before any implementation to assess confidence level (target: 85%+)

### 6. **debug** - Problem-Solving and Debugging Specialist
- **Purpose**: Investigates errors, test failures, and unexpected behavior
- **Tools**: Read, Grep, Glob, LS, Bash
- **Use Case**: Identifying root causes when encountering issues

### 7. **introspection** - Session Analysis and Learning Specialist
- **Purpose**: Reviews sessions to identify patterns, failures, and improvements
- **Tools**: Read, Write, TodoWrite
- **Use Case**: Retrospectives and persistent knowledge retention in .codery/Retrospective.md

### 8. **package** - Production Deployment Specialist
- **Purpose**: Handles git operations, merging to protected branches, and releases
- **Tools**: Bash, Read
- **Use Case**: ONLY for final deployment steps with proper approvals

### 9. **patch** - Bug Fix Specialist
- **Purpose**: Implements targeted fixes for specific issues with minimal changes
- **Tools**: Read, Edit, MultiEdit, Grep, Glob, LS
- **Use Case**: After debug identifies root cause, applies surgical fixes

### 10. **poc** - Proof of Concept Specialist
- **Purpose**: Creates rapid prototypes to validate feasibility
- **Tools**: Read, Write, Edit, MultiEdit, Grep, Glob, LS, Bash
- **Use Case**: Quick validation with mock data and shortcuts allowed

### 11. **polish** - Code Quality and Style Improvement Specialist
- **Purpose**: Refactors for readability, consistency, and best practices
- **Tools**: Read, Edit, MultiEdit, Grep, Glob, LS
- **Use Case**: After features work, improves code quality without changing functionality

## File Locations and Structure

### Source Templates
- **Location**: `/codery-docs/.codery/agents/`
- **Purpose**: Master templates maintained with the Codery codebase
- **Format**: Markdown files with YAML frontmatter

### Deployed Copies
- **Location**: `/.claude/agents/`
- **Purpose**: Working copies in user's project
- **Deployment**: Automatically copied during `codery build` command

### File Format
Each subagent follows this structure:
```yaml
---
name: subagent-name
description: When to use this subagent
tools: comma, separated, tool, list
---

System prompt content...
```

## Integration with Codery System

### Role-Based System Integration
- Subagents complement the main role-based system (Scout Mode, Architect Mode, etc.)
- Main roles can delegate to corresponding subagents for isolated context work
- Example delegations documented in CLAUDE.md:
  - Scout Mode → scout subagent for complex searches
  - Architect Mode → architect subagent for design exploration
  - Builder Mode → builder subagent for large implementations
  - After building → audit subagent (mandatory)

### Build Process Integration
- `buildDocs.ts` handles subagent deployment:
  - Copies from source to project directory
  - Applies template substitution if config available
  - Creates `.claude/agents/` directory if needed
  - Reports success/failure of deployment

### Documentation References
- Subagents mentioned in:
  - CLAUDE.md (main documentation)
  - SubagentWorkflow.md (workflow integration)
  - buildDocs.ts (deployment logic)
  - User documentation references

## Key Findings

1. **Comprehensive Coverage**: The 11 subagents cover the full software development lifecycle from research to deployment

2. **Tool Restrictions**: Each subagent has carefully selected tools matching their purpose (e.g., package only has Bash and Read for safety)

3. **Clear Boundaries**: Each subagent has explicit "What You DON'T Do" sections preventing scope creep

4. **Quality Gates**: CRK subagent enforces 85% confidence threshold before building

5. **Learning System**: Introspection subagent provides persistent learning through Retrospective.md

6. **Safety Measures**: Package subagent restricted to final deployment with strict guidelines

## Recommendations

1. **Documentation**: Consider adding a subagent overview in the main documentation
2. **Validation**: Add checks to ensure subagent files are valid during build
3. **Customization**: Document how users can create custom subagents
4. **Metrics**: Consider tracking subagent usage patterns for improvement

## Conclusion

The Codery system includes a well-designed set of 11 subagents covering all aspects of software development. They are properly integrated with the role-based system and deployment process, with clear purposes and appropriate tool restrictions for each specialist area.