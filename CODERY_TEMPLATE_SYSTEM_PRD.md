# Product Requirements Document: Codery Template System

## Executive Summary

This PRD outlines the implementation of a template variable system for Codery that enables dynamic documentation generation with project-specific configurations. The system will allow users to customize their CLAUDE.md files with their own JIRA cloud IDs, project keys, and other configuration values through a simple initialization and build process.

## Problem Statement

Currently, Codery generates static documentation that cannot be customized for specific projects or organizations. Users need to manually edit the generated CLAUDE.md to add their:
- Atlassian Cloud ID for JIRA integration
- Project keys
- Organization-specific URLs
- Other project-specific configurations

This manual process is error-prone and makes updates difficult.

## Solution Overview

Implement a template variable system that:
1. Introduces a `codery init` command to bootstrap project configuration
2. Uses a JSON configuration file to store user-specific values
3. Supports template variables in markdown files using `{{variableName}}` syntax
4. Enhances the `codery build` command to perform variable substitution

## User Journey

### First-Time Setup
1. User installs Codery: `npm install -g @hdts/codery`
2. User navigates to their project directory
3. User runs: `codery init`
4. System creates `.codery/config.json` with template values
5. User edits `.codery/config.json` with their specific values
6. User runs: `codery build`
7. System generates customized CLAUDE.md with substituted values

### Subsequent Builds
1. User runs: `codery build`
2. System reads existing `.codery/config.json`
3. System generates updated CLAUDE.md with current configuration

## Functional Requirements

### 1. New Command: `codery init`

#### Purpose
Initialize a Codery configuration in the current project

#### Behavior
- Creates `.codery` directory if it doesn't exist
- Generates `.codery/config.json` with default template
- Displays instructions for filling out the configuration
- Checks if config already exists and prompts for overwrite

#### Options
- `--force`: Overwrite existing configuration without prompting

#### Config Template Structure
```json
{
  "cloudId": "YOUR_ATLASSIAN_CLOUD_ID",
  "projectKey": "YOUR_PROJECT_KEY",
  "projectName": "Your Project Name",
  "jiraUrl": "https://your-domain.atlassian.net",
  "githubRepo": "https://github.com/your-org/your-repo",
  "developBranch": "develop",
  "mainBranch": "main",
  "customValues": {
    "teamName": "Your Team Name",
    "slackChannel": "#your-channel"
  }
}
```

### 2. Template Variable System

#### Syntax
- Variables use double curly braces: `{{variableName}}`
- Supports nested values: `{{customValues.teamName}}`
- Case-sensitive matching

#### Variable Locations
Template variables can appear in any markdown file within `codery-docs/.codery/`

#### Common Variables
- `{{cloudId}}` - Atlassian Cloud ID
- `{{projectKey}}` - JIRA project key
- `{{projectName}}` - Human-readable project name
- `{{jiraUrl}}` - Full JIRA instance URL
- `{{githubRepo}}` - GitHub repository URL
- `{{developBranch}}` - Development branch name
- `{{mainBranch}}` - Main/production branch name

### 3. Enhanced `codery build` Command

#### New Behavior
1. Check for `.codery/config.json`
   - If missing, prompt user to run `codery init` first
   - Optional: `--skip-config` flag to build without substitution
2. Load configuration values
3. Read markdown files
4. Perform variable substitution
5. Merge files as before
6. Write customized CLAUDE.md

#### Error Handling
- Warn about undefined variables (don't fail build)
- Show list of unsubstituted variables in output
- Option to fail on undefined: `--strict`

### 4. New JIRA Workflow Documentation

Create `codery-docs/.codery/JIRA_Workflow.md`:

```markdown
# JIRA Workflow for Codery

## Overview

Codery integrates with JIRA through the Atlassian MCP (Model Context Protocol) tools. This document outlines how JIRA is used within the Codery system.

## Configuration

- **Cloud ID**: {{cloudId}}
- **Project Key**: {{projectKey}}
- **JIRA URL**: {{jiraUrl}}

## Core Concepts

JIRA follows standard Agile methodology:
- **Epics**: Large features or initiatives
- **Stories**: User-facing functionality
- **Tasks**: Technical work items
- **Bugs**: Defects requiring fixes

## MCP Integration

Codery uses Atlassian MCP tools to:
- Create and update tickets
- Log time against tickets
- Add comments with findings and decisions
- Transition ticket status
- Link commits and pull requests

## Required Information

For MCP tools to function, ensure these are configured:
- Cloud ID: `{{cloudId}}`
- Project Key: `{{projectKey}}`

## Workflow Integration

All work follows this JIRA flow:
1. Ticket creation/assignment
2. Status: To Do → In Progress
3. Development work (tracked in Git branches)
4. Code review via pull requests
5. Status: In Review → Done
6. Deployment tracking

## Best Practices

- Every Git branch references a JIRA ticket
- All commits include JIRA ticket number
- Time logging is mandatory for all roles
- Comments document actual findings, not just activity

Refer to the Roles documentation for specific JIRA requirements per role.
```

## Technical Implementation

### File Structure
```
project-root/
├── .codery/
│   └── config.json      # User configuration (git-ignored)
├── codery-docs/
│   └── .codery/
│       ├── Roles.md
│       ├── Git_Workflow.md
│       ├── JIRA_Workflow.md    # New file with templates
│       ├── Commands.md
│       └── ...
└── CLAUDE.md            # Generated output
```

### Implementation Steps

1. **Phase 1: Template System**
   - Implement variable detection regex
   - Build substitution engine
   - Add to build process

2. **Phase 2: Init Command**
   - Create init command structure
   - Generate default config template
   - Add file system operations

3. **Phase 3: JIRA Workflow**
   - Write JIRA_Workflow.md with template variables
   - Update file ordering in build command

4. **Phase 4: Error Handling**
   - Config validation
   - Missing variable warnings
   - User guidance

## Success Criteria

1. Users can initialize configuration with single command
2. Build process successfully substitutes all variables
3. No manual editing of CLAUDE.md required for basic setup
4. Clear error messages for missing configuration
5. Backward compatibility (build works without config)

## Future Enhancements

1. **Interactive Init**: Prompt for values during `codery init`
2. **Config Validation**: Verify cloudId/projectKey with Atlassian API
3. **Multiple Environments**: Support dev/staging/prod configurations
4. **Config Inheritance**: Project configs extending team/org configs
5. **Custom Templates**: Allow users to add their own template files

## Security Considerations

- Add `.codery/config.json` to default .gitignore template
- Document that config may contain sensitive information
- Consider encryption for sensitive values in future

## Migration Path

1. Existing users can continue using `codery build` without config
2. Running `codery init` adds template support
3. Documentation explains both workflows

## Metrics

- Time to complete initial setup (target: < 2 minutes)
- Percentage of users adopting template system
- Reduction in support questions about configuration