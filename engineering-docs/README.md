# Codery Engineering Documentation

## Overview

Codery is a command-line tool designed to bridge the gap between AI assistants (like Claude) and software development teams. It generates comprehensive, AI-readable documentation (CLAUDE.md) that enables AI agents to understand and follow your project's specific workflows, conventions, and configurations.

### Core Purpose

- **Enable AI-driven development**: Provides structured documentation that AI assistants can parse and follow
- **Standardize workflows**: Enforces consistent development practices through role-based methodologies
- **Integrate with existing tools**: Seamlessly works with JIRA and Git workflows
- **Customize for each project**: Template-based system adapts to your specific needs

## Architecture

### Technology Stack

- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Interactive Prompts**: Inquirer.js
- **Styling**: Chalk
- **Runtime**: Node.js (>=18.0.0)
- **Build System**: TypeScript Compiler (tsc)

### Project Structure

```
codery/
├── src/
│   ├── bin/
│   │   └── codery.ts           # CLI entry point
│   ├── lib/
│   │   ├── buildDocs.ts        # Build command implementation
│   │   └── initCommand.ts      # Init command implementation
│   └── types/
│       └── config.ts           # TypeScript interfaces
├── codery-docs/
│   └── .codery/                # Source documentation templates
│       ├── Subagents.md        # Subagent definitions
│       ├── Commands.md         # Available commands
│       ├── JIRA_Workflow.md    # JIRA integration guide
│       ├── LifeCycles.md       # Development lifecycles
│       ├── SuccessCriteria.md  # Success criteria
│       └── GitWorkflows/       # Git workflow templates
│           ├── GitFlow.md
│           └── TrunkBased.md
├── dist/                       # Compiled JavaScript
├── docs/                       # User documentation
└── engineering-docs/           # This documentation
```

## Core Functionality

### 1. Initialize Command (`codery init`)

**Purpose**: Sets up project-specific configuration through an interactive wizard.

**Process**:
1. Prompts for Git workflow type (Git Flow or Trunk-Based)
2. Collects Atlassian URL and JIRA project key
3. Configures branch names
4. Creates `.codery/config.json`
5. Updates `.gitignore` to exclude config file

**Key Features**:
- Interactive prompts with validation
- Workflow-specific configuration
- Automatic `.gitignore` management
- Force overwrite option

### 2. Build Command (`codery build`)

**Purpose**: Generates CLAUDE.md by merging and processing documentation templates.

**Process**:
1. Loads configuration from `.codery/config.json`
2. Reads markdown files from `codery-docs/.codery/`
3. Performs template variable substitution
4. Merges files in predefined order
5. Optionally builds application documentation
6. Writes final CLAUDE.md

**Key Features**:
- Template variable substitution using `{{variable}}` syntax
- Workflow-specific file selection
- Application documentation aggregation
- Dry-run mode for preview
- Skip-config option for building without substitution

## Implementation Details

### Template System

The template system enables dynamic documentation generation based on project configuration.

**Variable Syntax**: `{{variableName}}`

**Supported Variables**:
- `{{cloudId}}` - Atlassian Cloud ID/URL
- `{{projectKey}}` - JIRA project key
- `{{mainBranch}}` - Main branch name
- `{{developBranch}}` - Development branch name (Git Flow only)
- `{{customValues.property}}` - Nested custom values

**Substitution Process**:
1. Regex pattern matches `{{variable}}` placeholders
2. Resolves values from config object (supports nested properties)
3. Replaces placeholders with actual values
4. Tracks unsubstituted variables for warnings

### File Processing

**File Order**:
1. Subagents.md
2. Workflow file (GitFlow.md or TrunkBased.md based on config)
3. JIRA_Workflow.md
4. Commands.md
5. LifeCycles.md
6. SuccessCriteria.md
7. Any remaining files

**Merging Process**:
1. Adds CLAUDE.md header
2. Converts filenames to section titles
3. Includes file content with proper formatting
4. Adds separators between sections

### Configuration Management

**Config Structure** (`CoderyConfig` interface):
```typescript
{
  cloudId: string;           // Atlassian URL
  projectKey: string;        // JIRA project key
  developBranch?: string;    // For Git Flow
  mainBranch?: string;       // Main branch name
  applicationDocs?: string[]; // User documentation paths
  gitWorkflowType?: 'gitflow' | 'trunk-based';
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
2. **New Templates**: Add markdown files to `codery-docs/.codery/`
3. **New Variables**: Update `CoderyConfig` interface and substitution logic
4. **New Workflows**: Add to `GitWorkflows/` directory

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
```

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

## Future Enhancements

1. **Interactive Configuration Updates**: Edit config through CLI
2. **Template Validation**: Verify all variables are defined
3. **Custom Template Support**: Allow user-defined templates
4. **Plugin System**: Extend functionality through plugins
5. **Multi-Environment Support**: Different configs for dev/prod
6. **API Integration**: Validate JIRA credentials and project keys

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