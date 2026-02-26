# Codery Engineering Documentation

## Overview

Codery is a command-line tool designed to bridge the gap between AI assistants (like Claude) and software development teams. It generates comprehensive, AI-readable documentation (CLAUDE.md) that enables AI agents to understand and follow your project's specific workflows, conventions, and configurations.

### Core Purpose

- **Enable AI-driven development**: Provides structured documentation that AI assistants can parse and follow
- **Standardize workflows**: Enforces consistent development practices through role-based methodologies
- **Integrate with existing tools**: Seamlessly works with JIRA (via MCP or CLI) and Git workflows
- **Customize for each project**: Template-based system adapts to your specific needs
- **Support Claude Code**: Native integration with Claude Code slash commands for streamlined workflows

## Architecture

### Technology Stack

- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Interactive Prompts**: Inquirer.js
- **Styling**: Chalk
- **Runtime**: Node.js (>=20.8.1)
- **Build System**: TypeScript Compiler (tsc)
- **Versioning**: Semantic Release (automated NPM publishing)
- **Package Version**: 6.0.0

### Project Structure

```
codery/
├── src/
│   ├── bin/
│   │   └── codery.ts           # CLI entry point
│   ├── lib/
│   │   ├── buildDocs.ts        # Build command implementation
│   │   ├── initCommand.ts      # Init command implementation
│   │   ├── registry.ts         # Project registry management
│   │   └── updateCommand.ts    # Update command implementation
│   └── types/
│       └── config.ts           # TypeScript interfaces
├── codery-docs/
│   └── .codery/                # Source documentation templates
│       ├── Roles.md            # Role-based development system
│       ├── JIRA_Workflow.md    # JIRA integration guide
│       ├── LifeCycles.md       # Development lifecycles
│       ├── SuccessCriteria.md  # Success criteria
│       ├── Retrospective.md    # Session learnings (excluded from build)
│       ├── agents/             # Subagent templates
│       │   ├── scout.md        # Research and exploration specialist
│       │   ├── builder.md      # Code implementation specialist
│       │   ├── patch.md        # Bug fix specialist
│       │   ├── audit.md        # Code review specialist
│       │   ├── polish.md       # Code quality specialist
│       │   └── debug.md        # Debugging specialist
│       ├── commands/           # Claude Code slash commands
│       │   └── codery/         # Namespaced commands
│       │       ├── start.md    # Initialize Codery system
│       │       ├── status.md   # Check JIRA ticket status
│       │       ├── snr.md      # Perform SNR protocol
│       │       └── retrospective.md # Session analysis
│       ├── integrations/       # Integration options
│       │   ├── JIRA_MCP.md    # MCP-based JIRA integration
│       │   └── JIRA_CLI.md    # CLI-based JIRA integration
│       └── GitWorkflows/       # Git workflow templates
│           ├── GitFlow.md
│           └── TrunkBased.md
├── .claude/                    # Generated Claude Code commands
│   └── commands/               # Auto-copied from codery-docs
├── dist/                       # Compiled JavaScript
├── docs/                       # User documentation
└── engineering-docs/           # This documentation
```

## Version History

### Version 7.0.0 - Project Registry System (COD-33)
- Added project registry (`~/.codery/projects.json`) to track Codery-enabled projects
- New `codery update` command to update npm package and rebuild all registered projects
- New `codery register [path]` command to manually add projects to registry
- New `codery unregister [path]` command to remove projects from registry
- New `codery list` command to display all registered projects
- Auto-registration on `codery init`
- Added `--force` flag to `codery build` for non-interactive builds

### Version 6.0.0 - Automatic Subagent Delegation (Breaking Change)
- **Breaking**: AI assistants now automatically delegate to subagents when thresholds are met
- Added proactive delegation triggers in Roles.md
- No longer requires user approval for subagent delegation

### Version 5.x - JIRA Integration Options
- Added JIRA CLI integration as alternative to MCP (COD-22)
- Made cloudId optional in config (Breaking in 5.0.0)
- Added configuration preservation on re-init (COD-24)
- Added jiraIntegrationType config option ('mcp' | 'cli')

### Version 4.0.0 - Slash Commands (Breaking Change)
- **Breaking**: Replaced text commands with slash commands (COD-12)
- Commands now namespaced under `/codery:*`
- Added automatic `.claude/commands/` directory generation
- Commands: `/codery:start`, `/codery:status`, `/codery:snr`, `/codery:retrospective`

### Version 3.x - Subagent Optimization
- Removed context-dependent subagents (architect, crk, introspection, package, poc)
- Streamlined to specialist subagents only (scout, builder, patch, audit, polish, debug)
- Improved subagent isolation and effectiveness

### Version 2.x - Retrospective System
- Added persistent learning via `.codery/Retrospective.md` (COD-14)
- Implemented session analysis and continuous improvement tracking
- Retrospective file excluded from CLAUDE.md builds

### Version 1.x - Initial Release
- Core role-based system implementation
- Git workflow support (Git Flow and Trunk-Based)
- Basic JIRA integration via MCP
- Application documentation aggregation

## Important Notes

### Documentation Generation Process

**CRITICAL**: CLAUDE.md is auto-generated from source files in `codery-docs/.codery/`. The `.codery/` directory in the project root is also auto-generated. When optimizing CLAUDE.md size, work with the source files in `codery-docs/.codery/`, NOT the generated files.

**Source → Generated Flow**:
- Source: `codery-docs/.codery/*.md` 
- Generated: `CLAUDE.md` (via `codery build` command)
- Generated: `.codery/` directory (auto-generated, do not edit)

## Core Functionality

### 1. Initialize Command (`codery init`)

**Purpose**: Sets up project-specific configuration through an interactive wizard.

**Process**:
1. Checks for existing configuration and preserves it if found (COD-24)
2. Prompts for JIRA integration type (MCP or CLI)
3. Prompts for Git workflow type (Git Flow or Trunk-Based)
4. Collects JIRA project key
5. Conditionally collects Atlassian URL (only for MCP integration)
6. Configures branch names based on workflow
7. Creates `.codery/config.json`
8. Updates `.gitignore` to exclude config file

**Key Features**:
- Configuration preservation on re-init
- JIRA integration type selection (MCP vs CLI)
- Interactive prompts with validation
- Workflow-specific configuration
- Automatic `.gitignore` management
- Force overwrite option
- Empty applicationDocs array initialization
- Auto-registration in project registry for `codery update`

### 2. Build Command (`codery build`)

**Purpose**: Generates CLAUDE.md and Claude Code commands by merging and processing documentation templates.

**Process**:
1. Loads configuration from `.codery/config.json`
2. Reads markdown files from `codery-docs/.codery/`
3. Performs template variable substitution
4. Selects integration-specific documentation (JIRA_MCP.md or JIRA_CLI.md)
5. Merges files in predefined order
6. Copies slash commands to `.claude/commands/` directory
7. Optionally builds application documentation
8. Writes final CLAUDE.md

**Key Features**:
- Template variable substitution using `{{variable}}` syntax
- Integration-specific file selection (MCP vs CLI)
- Workflow-specific file selection (Git Flow vs Trunk-Based)
- Automatic slash command deployment
- Application documentation aggregation
- Dry-run mode for preview
- Skip-config option for building without substitution
- Subagent templates included in build
- Force mode for non-interactive builds (skips overwrite prompt)

### 3. Update Command (`codery update`)

**Purpose**: Updates the Codery npm package and rebuilds all registered projects in one command.

**Process**:
1. Runs `npm update -g codery` to update the global package
2. Loads the project registry from `~/.codery/projects.json`
3. For each registered project:
   - Verifies the path exists
   - Runs `codery build --force` if valid
   - Prompts to remove if path not found
4. Displays summary of results

**Key Features**:
- Single command updates all projects
- Graceful failure - continues if one project fails
- Detects and offers to remove missing projects
- `--yes` flag for non-interactive mode (auto-removes missing projects)
- Progress output with summary

### 4. Registry Commands (`codery register`, `codery unregister`, `codery list`)

**Purpose**: Manage the project registry for `codery update`.

**Registry Location**: `~/.codery/projects.json`

**Commands**:
- `codery register [path]` - Add a project to the registry (defaults to current directory)
- `codery unregister [path]` - Remove a project from the registry
- `codery list` - Display all registered projects with status

**Key Features**:
- Idempotent registration (no duplicates)
- Absolute path storage
- Missing project detection in list output
- Per-machine registry (not synced across machines)

## Implementation Details

### Template System

The template system enables dynamic documentation generation based on project configuration.

**Variable Syntax**: `{{variableName}}`

**Supported Variables**:
- `{{cloudId}}` - Atlassian Cloud ID/URL (optional, MCP only)
- `{{projectKey}}` - JIRA project key
- `{{mainBranch}}` - Main branch name
- `{{developBranch}}` - Development branch name (Git Flow only)
- `{{jiraIntegrationType}}` - Integration type ('mcp' or 'cli')
- `{{customValues.property}}` - Nested custom values

**Substitution Process**:
1. Regex pattern matches `{{variable}}` placeholders
2. Resolves values from config object (supports nested properties)
3. Replaces placeholders with actual values
4. Tracks unsubstituted variables for warnings

### File Processing

**File Order**:
1. Roles.md (includes integrated subagent delegation)
2. Workflow file (GitFlow.md or TrunkBased.md based on config)
3. JIRA_Workflow.md
4. Integration file (JIRA_MCP.md or JIRA_CLI.md based on config)
5. LifeCycles.md
6. SuccessCriteria.md
7. Subagent templates from agents/ directory
8. Any remaining files (excluding Retrospective.md and commands/)

**Merging Process**:
1. Adds CLAUDE.md header
2. Converts filenames to section titles
3. Includes file content with proper formatting
4. Adds separators between sections

### Configuration Management

**Config Structure** (`CoderyConfig` interface):
```typescript
{
  cloudId?: string;           // Atlassian URL (optional, MCP only)
  projectKey: string;        // JIRA project key
  developBranch?: string;    // For Git Flow
  mainBranch?: string;       // Main branch name
  applicationDocs?: string[]; // User documentation paths
  gitWorkflowType?: 'gitflow' | 'trunk-based';
  jiraIntegrationType?: 'mcp' | 'cli'; // JIRA integration type
}
```

**Storage**: `.codery/config.json` (git-ignored)

## Development Guide

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/turalnovruzov/codery.git
   cd codery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Link for local testing**
   ```bash
   npm link
   ```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run typecheck` - Type checking without emit
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

### Adding New Features

1. **New Commands**: Add to `src/bin/codery.ts` and implement in `src/lib/`
2. **New Slash Commands**: Add to `codery-docs/.codery/commands/codery/`
3. **New Templates**: Add markdown files to `codery-docs/.codery/`
4. **New Subagents**: Add to `codery-docs/.codery/agents/`
5. **New Variables**: Update `CoderyConfig` interface and substitution logic
6. **New Workflows**: Add to `GitWorkflows/` directory
7. **New Integrations**: Add to `integrations/` directory
8. **New Roles**: Update `Roles.md` with role definition and delegation patterns
9. **File Order**: Update the `fileOrder` array in `src/lib/buildDocs.ts` if needed

### Code Style Guidelines

- Use TypeScript for type safety
- Follow existing patterns for consistency
- Add proper error handling with user-friendly messages
- Use Chalk for colored console output
- Validate user input thoroughly

## API Reference

### CLI Commands

**codery init**
```bash
codery init [options]

Options:
  --force    Overwrite existing configuration
```

**codery build**
```bash
codery build [options]

Options:
  --output <path>    Output path for CLAUDE.md
  --dry-run         Preview without creating files
  --skip-config     Build without template substitution
  --force           Overwrite existing files without prompting
```

**codery update**
```bash
codery update [options]

Options:
  --yes    Auto-remove missing projects without prompting
```
Updates the global Codery package and rebuilds all registered projects.

**codery register**
```bash
codery register [path]
```
Register a project for updates. Defaults to current directory if no path specified.

**codery unregister**
```bash
codery unregister [path]
```
Remove a project from the registry. Defaults to current directory if no path specified.

**codery list**
```bash
codery list
```
Display all registered Codery projects with their status.

### Core Functions

**initCommand(options: InitOptions)**
- Handles initialization flow
- Creates configuration file
- Updates .gitignore

**buildCommand(options: BuildOptions)**
- Orchestrates build process
- Manages file reading and merging
- Handles template substitution

**substituteTemplates(content: string, config: CoderyConfig)**
- Performs variable replacement
- Returns substituted content and unsubstituted variables

**buildApplicationDocs(config: CoderyConfig)**
- Aggregates user-specified documentation
- Creates `.codery/application-docs.md`

## Implemented Features

### Semantic Release Integration (COD-7)
- Automated versioning based on conventional commits
- Automatic NPM publishing with provenance
- Changelog generation
- GitHub release creation

### Slash Commands System (COD-12)
- Native Claude Code integration
- Namespaced commands under `/codery:*`
- Automatic command deployment to `.claude/commands/`
- Commands for start, status, SNR, and retrospective

### JIRA Integration Options (COD-22)
- Support for both MCP and CLI integration types
- Conditional configuration based on integration type
- Comprehensive JIRA CLI documentation
- Integration-specific template selection

### Subagent System (COD-8, COD-21)
- Specialized AI assistants for specific tasks
- Automatic delegation based on thresholds
- Isolated execution contexts
- Six core subagents: scout, builder, patch, audit, polish, debug

### Retrospective System (COD-14)
- Persistent session learning
- Continuous improvement tracking
- Introspection subagent for analysis
- Knowledge accumulation across sessions

### Project Registry System (COD-33)
- Global project registry at `~/.codery/projects.json`
- One-command update for all projects (`codery update`)
- Project management commands (`register`, `unregister`, `list`)
- Auto-registration on `codery init`
- Non-interactive build mode with `--force` flag

## Future Enhancements

1. **Interactive Configuration Updates**: Edit config through CLI
2. **Template Validation**: Verify all variables are defined
3. **Custom Template Support**: Allow user-defined templates
4. **Plugin System**: Extend functionality through plugins
5. **Multi-Environment Support**: Different configs for dev/prod
6. **API Integration**: Direct JIRA API validation

## Troubleshooting

### Common Issues

1. **"No configuration found"**
   - Run `codery init` first
   - Check `.codery/config.json` exists

2. **"Unsubstituted variables" warning**
   - Update config with missing values
   - Check variable names in templates

3. **"File not found" in application docs**
   - Verify paths in `applicationDocs` array
   - Use relative paths from project root

### Debug Mode

Set environment variable for verbose output:
```bash
DEBUG=codery* codery build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

Follow the existing code style and include appropriate documentation updates.