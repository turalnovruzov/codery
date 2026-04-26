# Codery Engineering Documentation

## Overview

Codery is a command-line tool that generates AI-readable documentation (CLAUDE.md) enabling AI agents to follow your project's workflows, conventions, and configurations.

### Core Purpose

- **Enable AI-driven development**: Structured documentation that AI assistants parse and follow
- **Standardize workflows**: Consistent practices through role-based methodologies
- **Integrate with existing tools**: JIRA (via CLI) and Git workflows
- **Customize for each project**: Template-based system adapts to your needs
- **Support Claude Code**: Native integration with Claude Code skills

## Architecture

### Technology Stack

- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Interactive Prompts**: Inquirer.js
- **Styling**: Chalk
- **Runtime**: Node.js (>=20.8.1)
- **Build System**: TypeScript Compiler (tsc)
- **Versioning**: Semantic Release (automated NPM publishing)
- **Package Version**: 7.0.0

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
│       ├── claude-md-template.md   # CLAUDE.md template with @imports
│       ├── jira-reference.md       # JIRA reference
│       ├── GitWorkflows/           # Git workflow templates
│       │   ├── GitFlow.md
│       │   └── TrunkBased.md
│       └── skills/                 # Claude Code skills
│           ├── codery-audit/       # PR review with JIRA context
│           ├── codery-autopilot/   # Autonomous ticket → draft PR run
│           ├── codery-docs-check/  # Documentation sync check
│           ├── codery-pr/          # Create PR with structured description
│           ├── codery-release/     # Release branch creation
│           ├── codery-retrospective/ # Session review
│           ├── codery-snr/         # Summary/Next/Request protocol
│           ├── codery-status/      # PR/ticket status check
│           └── codery-ticket/      # Author well-structured Jira tickets
├── dist/                       # Compiled JavaScript
├── docs/                       # User documentation
└── engineering-docs/           # This documentation
```

## Git Philosophy

Codery follows the npm principle: **track inputs, ignore outputs**.

| npm | Codery |
|-----|--------|
| `package.json` (tracked) | `.codery/config.json` (tracked) |
| `node_modules/` (ignored) | `CLAUDE.md`, `.claude/`, `.codery/refs/` (ignored) |
| `npm install` | `codery build` |

### What's Tracked vs Ignored

| File | Type | Git Status |
|------|------|------------|
| `.codery/config.json` | Input (build spec) | **Tracked** |
| `CLAUDE.md` | Output (generated) | **Ignored** |
| `.claude/` | Output (generated skills) | **Ignored** |
| `.codery/refs/` | Output (generated reference files) | **Ignored** |

### Why This Matters

- **No git pollution**: Codery updates don't create commits
- **No merge conflicts**: Multiple devs can't conflict on generated files
- **Team consistency**: Everyone uses same config, generates same output
- **Clean onboarding**: `git clone` → `npm install` → `codery build`

## Version History

### Version 8.x - `codery config` Command (COD-59)
- Added `codery config` for viewing and editing `.codery/config.json` without re-running `codery init`
- Bare `codery config` opens an interactive arrow-key navigable menu listing all fields with current values; select to edit, with appropriate prompt per field type (list / input / array submenu)
- Scriptable subcommands for shell loops: `codery config list | get <key> | set <key> <value> | unset <key> | add <key> <value> | remove <key> <value>`
- Field validators extracted into `src/lib/configSchema.ts` and reused by both `codery init` and `codery config` to prevent drift
- Stale-field warnings surface inline (e.g., `jiraCloudId` set while `jiraIntegrationType=cli`); strict semantics — `set` does not auto-cleanup paired fields
- No automatic rebuild — run `codery build` separately when ready

### Version 8.x - Atlassian MCP Reintroduction (COD-57)
- Reintroduced the Atlassian MCP as an opt-in JIRA integration alongside the CLI (removed in v8.0.0)
- Config regains `jiraIntegrationType: 'mcp' | 'cli'` (default `cli` for backward compat) and `jiraCloudId`
- Template split: `jira-reference-cli.md` (existing command-oriented ref) and new slim `jira-reference-mcp.md` (tool-schema-driven)
- Hardcoded workflow states removed from both reference files — projects define their own
- Preview & approval convention relaxed: applies only to ticket create/edit/comment; transitions and worklogs are exempt
- `codery-release` skill rewritten to be integration-agnostic (no hardcoded `jira` CLI syntax)

### Version 7.0.0 - Modernization (COD-41) — Breaking
- **CLAUDE.md**: ~800 lines → ~85 lines using `@` imports for reference docs
- **Commands → Skills**: 8 commands migrated from `.claude/commands/` to `.claude/skills/` format
- **Subagents removed**: 5 agent templates deleted (Claude creates its own)
- **Retrospective → auto memory**: Claude Code native feature replaces `.codery/Retrospective.md`
- **Roles condensed**: 19 → 11, 1-3 lines each, common rules stated once at top
- **Build process rewritten**: Template-based flow — read template, inject `@` imports, substitute variables, copy reference files + skills
- **Breaking**: Existing projects need manual cleanup of old files (`.claude/commands/`, `.claude/agents/`, `.codery/application-docs.md`, `.codery/Retrospective.md`)

### Version 6.8.0 - Git Philosophy Update (COD-38)
- Changed `codery init` to follow "track inputs, ignore outputs" principle
- Config.json is now tracked (like package.json)
- Generated files are now ignored
- Added migration guide for existing projects

### Version 6.7.0 - Project Registry System (COD-33)
- Added project registry (`~/.codery/projects.json`) to track Codery-enabled projects
- New `codery update` command to update npm package and rebuild all registered projects
- New `codery register [path]` and `codery unregister [path]` commands
- New `codery list` command to display all registered projects
- Auto-registration on `codery init`
- Added `--force` flag to `codery build` for non-interactive builds

### Version 6.0.0 - Automatic Subagent Delegation (Breaking)
- AI assistants automatically delegate to subagents when thresholds are met

### Version 5.x - JIRA Integration Options
- Added JIRA CLI integration as alternative to MCP (COD-22)
- Made cloudId optional in config
- Added jiraIntegrationType config option ('mcp' | 'cli')

### Version 4.0.0 - Slash Commands (Breaking)
- Replaced text commands with slash commands (COD-12)

### Versions 1.x - 3.x
- Core role-based system, git workflows, JIRA integration, retrospective system, subagent optimization

## Core Functionality

### 1. Initialize Command (`codery init`)

**Purpose**: Sets up project-specific configuration through an interactive wizard.

**Process**:
1. Checks for existing configuration and preserves it if found
2. Prompts for Git workflow type (Git Flow or Trunk-Based)
3. Collects JIRA project key
4. Configures branch names based on workflow
5. Creates `.codery/config.json`
6. Updates `.gitignore` to exclude generated files (`CLAUDE.md`, `.claude/`, `.codery/refs/`)
7. Registers project in registry for `codery update`

### 2. Build Command (`codery build`)

**Purpose**: Generates CLAUDE.md, reference files, and skills from source templates.

**Process**:
1. Loads configuration from `.codery/config.json`
2. Reads `claude-md-template.md` (the CLAUDE.md template with `@` imports)
3. Injects `applicationDocs` as `@` import lines (replacing `{{applicationDocsImports}}`)
4. Performs `{{variable}}` substitution from config values
5. Writes `CLAUDE.md`
6. Copies reference files to `.codery/refs/`:
   - `jira-reference.md` → `.codery/refs/jira-reference.md`
   - `GitFlow.md` or `TrunkBased.md` → `.codery/refs/git-workflow.md` (based on `gitWorkflowType`)
7. Copies all skills to `.claude/skills/` with variable substitution

**Key Features**:
- Template variable substitution using `{{variable}}` syntax
- Config-driven selection of JIRA and git workflow variants
- `@` imports for reference docs (Claude Code resolves these at runtime)
- `applicationDocs` config array for project-specific doc imports
- Dry-run mode, skip-config option, force mode

### 3. Update Command (`codery update`)

**Purpose**: Updates the Codery npm package and rebuilds all registered projects.

### 4. Registry Commands (`codery register`, `codery unregister`, `codery list`)

**Purpose**: Manage the project registry for `codery update`.

### 5. Config Command (`codery config`)

**Purpose**: View and edit `.codery/config.json` without re-running the full `codery init` wizard.

**Two surfaces**:
- **Interactive**: `codery config` (bare) opens a menu listing all fields with current values. Use arrow keys + Enter to pick a field, edit it (with the same validators init uses), and return to the menu. Choose Save & Exit / Discard & Exit.
- **Scriptable**: `codery config list | get <key> | set <key> <value> | unset <key> | add <key> <value> | remove <key> <value>` — for shell loops and CI.

**Validation**: per-field validators live in `src/lib/configSchema.ts` and are shared with `codery init`. Filters (e.g., stripping `https://` from `jiraCloudId`) apply consistently in both interactive and scriptable paths.

**Stale-field warnings**: `set jiraIntegrationType cli` while `jiraCloudId` is set will print a warning but not auto-unset; the menu shows the warning inline next to the field. Strict semantics — `set` does one thing.

**Does not trigger a rebuild**: run `codery build` separately when ready.

## Implementation Details

### Template System

**Variable Syntax**: `{{variableName}}`

**Supported Variables**:
- `{{projectKey}}` - JIRA project key
- `{{mainBranch}}` - Main branch name
- `{{developBranch}}` - Development branch name (Git Flow only)
- `{{applicationDocsImports}}` - Special: replaced with `@` import lines from config
- `{{customValues.property}}` - Nested custom values

### Build Flow

```
codery-docs/.codery/claude-md-template.md
    │
    ├── {{applicationDocsImports}} → @engineering-docs/README.md (from config)
    ├── {{projectKey}}             → COD (from config)
    └── ... other variables
    │
    ▼
CLAUDE.md (with @imports that Claude Code resolves at runtime)
    ├── @.codery/refs/jira-reference.md  ← copied from jira-reference-{cli,mcp}.md
    ├── @.codery/refs/git-workflow.md    ← copied from GitWorkflows/{GitFlow,TrunkBased}.md
    └── @engineering-docs/*.md           ← user's own docs (not copied, referenced in-place)

.claude/skills/codery-*/SKILL.md         ← copied from codery-docs/.codery/skills/
```

### Configuration

**Config Structure** (`CoderyConfig` interface):
```typescript
{
  projectKey: string;                          // JIRA project key
  developBranch?: string;                      // For Git Flow
  mainBranch?: string;                         // Main branch name
  applicationDocs?: string[];                  // Paths to project-specific docs (become @imports)
  gitWorkflowType?: 'gitflow' | 'trunk-based';
  jiraIntegrationType?: 'mcp' | 'cli';         // Default 'cli'
  jiraCloudId?: string;                        // Required when jiraIntegrationType === 'mcp'
}
```

**JIRA integration** is selected at `codery init` time:
- `cli` (default): emits `jira-reference-cli.md` → `.codery/refs/jira-reference.md`. Requires the `jira` CLI installed locally with an API token.
- `mcp`: emits the slim `jira-reference-mcp.md`. Requires the Atlassian MCP server installed in Claude Code. The `jiraCloudId` (e.g. `company.atlassian.net`) is passed through to the reference file as `{{jiraCloudId}}` and then used as the `cloudId` argument to MCP tool calls.

**Storage**: `.codery/config.json` (tracked in git)

## Development Guide

### Setup

```bash
git clone https://github.com/turalnovruzov/codery.git
cd codery
npm install
npm run build
npm link
```

### Scripts

- `npm run build` - Compile TypeScript
- `npm run typecheck` - Type checking without emit
- `npm run format` - Prettier
- `npm run lint` - ESLint
- `npm test` - Jest

### Adding New Features

1. **New Skills**: Add `SKILL.md` to `codery-docs/.codery/skills/<skill-name>/`
2. **New Reference Files**: Add to `codery-docs/.codery/`, update `copyReferenceFiles()` in `buildDocs.ts`
3. **New Variables**: Update `CoderyConfig` interface and substitution logic
4. **New Workflows**: Add to `GitWorkflows/` directory
5. **New Roles**: Update `claude-md-template.md`

### Code Style

- TypeScript for type safety
- Follow existing patterns
- Chalk for colored console output
- Validate user input thoroughly

## CLI Reference

```bash
codery init [--force]
codery build [--output <path>] [--dry-run] [--skip-config] [--force]
codery update [--yes]
codery register [path]
codery unregister [path]
codery list
codery config                      # interactive menu
codery config list                 # print full config
codery config get <key>            # print one field
codery config set <key> <value>    # set scalar field
codery config unset <key>          # remove a field
codery config add <key> <value>    # append to array field (applicationDocs)
codery config remove <key> <value> # remove from array field
```

## Troubleshooting

1. **"No configuration found"** → Run `codery init`
2. **"Unsubstituted variables"** → Check config values match template variables
3. **"File not found" in application docs** → Verify paths in `applicationDocs` array use relative paths from project root
