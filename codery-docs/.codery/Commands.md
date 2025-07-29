# Codery Commands Reference

## Overview

This document lists all available commands and directives that can be used within the Codery system. Commands trigger specific behaviors, subagent delegation, and workflows.

## Core Commands

### System Initialization

- **START** / **STARTUP**  
  Initialize the Codery system by instructing the AI agent to:
  1. Read or re-read the CLAUDE.md file in the project root
  2. Check for and read .codery/application-docs.md if it exists
  3. Check for and read .codery/Retrospective.md to learn from past sessions (if exists)
  4. Fully adopt the Codery methodology with subagents, workflows, and protocols
  5. Begin operating under the Codery system guidelines
  6. Confirm subagents are available in .claude/agents/
  
  _Note: This command ensures the AI agent is properly configured to work within the Codery framework. The AI should acknowledge reading CLAUDE.md and confirm activation of the Codery system. If Retrospective.md doesn't exist, the system logs an informative message and continues normally._

### Information Commands

- **WhatsUp**  
  Summarize what you know about the current codery system and playbooks you have read, specifically by name.  
  _Note: You must NOT execute any BASH or shell commands for this directive._

- **Status**  
  Request current JIRA ticket status, work summary, and fetch the last 10 comments.  
  Displays comments in chronological order (newest first) with author, timestamp, and body text.  
  _Note: Gracefully handles tickets with no comments and formats output for clear readability._

### Documentation & Communication

- **SNR** (Summarize, Next Steps, Request)  
  Main agent provides a summary, outlines next steps, and suggests next actions.
  
  Standard SNR protocol:
  - 🔷 **S—Summarize**: Recap what was accomplished by subagents
  - 🟡 **N—Next Steps**: Suggest how to proceed based on findings  
  - 🟩 **R—Request**: Suggest appropriate next subagent or action

### Approval Workflow

- **Approved `<text>`**  
  Used after an SNR to accept the recommendations of Next Steps and Request, possibly with minor modifications in `<text>`.

- **Denied** / **Not Approved**  
  If not approved, return to KanBan or Mirror mode to reassess.

### Analysis & Debugging

- **WHY `<text>`**  
  Request an explanation of the reasoning or thought process behind a choice, action, or recommendation. Triggers Explainer Mode.

- **CLEANUP `<text>`**  
  Request an ESLint cleanup process. This is typically used to fix linting errors in recently modified code.
  - If the list of errors is small, fix them immediately
  - Branch-level lint errors outside your code changes can be left
  - If the directive is **"CLEANUP ALL"**, fix all ESLint errors in the project

### Subagent Management

- **/agents**  
  Opens Claude Code's native subagent management interface. Allows you to:
  - View all available Codery subagents (automatically installed by `codery build`)
  - See descriptions and tool permissions for each subagent
  - Understand when each subagent should be used
  - Create custom subagents (project-level)
  
  _Note: This is a Claude Code native command that works with Codery's pre-installed subagents._

### Meta Commands

- **Directives** / **Commands**  
  List all the directives (this list) to the user with a mini description. Provides a compressed list of all available directives.

- **Self-Report** / **Self-Diagnose**  
  Triggers the 🔬 Self-Introspective Analysis Mode for session review and learning.

## Usage Notes

1. Commands are case-insensitive but conventionally written in uppercase
2. Parameters in angle brackets `<>` are required
3. Parameters in parentheses `()` indicate options (e.g., I for Issue, F for Feature, E for Epic)
4. Some commands trigger immediate subagent delegation
5. All commands should be documented in JIRA when applicable