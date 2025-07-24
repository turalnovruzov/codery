# Codery Commands Reference

## Overview

This document lists all available commands and directives that can be used within the Codery system. Commands trigger specific behaviors, role switches, and workflows.

## Core Commands

### System Initialization

- **START** / **STARTUP**  
  Initialize the Codery system by instructing the AI agent to:
  1. Read or re-read the CLAUDE.md file in the project root
  2. Check for and read .codery/application-docs.md if it exists
  3. Fully adopt the Codery methodology and all its roles, workflows, and protocols
  4. Begin operating under the Codery system guidelines
  5. Start in Mirror Mode as specified in the Roles documentation
  
  _Note: This command ensures the AI agent is properly configured to work within the Codery framework. The AI should acknowledge reading CLAUDE.md and confirm activation of the Codery system._

### Information Commands

- **WhatsUp**  
  Summarize what you know about the current codery system and playbooks you have read, specifically by name.  
  _Note: You must NOT execute any BASH or shell commands for this directive._

- **Status**  
  Request KANBAN mode to read the Jira ticket and summarize what we are doing.

- **Roles**  
  Lists all the roles in the codery system.

### Role Management

- **SWITCH `<role>`**  
  Switch to the specified role and abide by its guidelines, then continue.

### Documentation & Communication

- **SNR** (Summarize, Next Steps, Request Role)  
  Provide a summary, outline next steps, and request the next role.
  
  Standard SNR protocol:
  - 🔷 **S—Summarize**: Recap the explanation provided and any clarifications made
  - 🟡 **N—Next Steps**: Suggest how to proceed based on improved understanding  
  - 🟩 **R—Request Role**: Suggest an appropriate next role based on the clarified direction

### Approval Workflow

- **Approved `<text>`**  
  Used after an SNR to accept the recommendations of Next Steps and Request Role, possibly with minor modifications in `<text>`.

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

### Meta Commands

- **Directives** / **Commands**  
  List all the directives (this list) to the user with a mini description. Provides a compressed list of all available directives.

- **Self-Report** / **Self-Diagnose**  
  Triggers the 🔬 Self-Introspective Analysis Mode for session review and learning.

## Usage Notes

1. Commands are case-insensitive but conventionally written in uppercase
2. Parameters in angle brackets `<>` are required
3. Parameters in parentheses `()` indicate options (e.g., I for Issue, F for Feature, E for Epic)
4. Some commands trigger immediate mode switches
5. All commands should be documented in JIRA when applicable