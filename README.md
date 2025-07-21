# Codery CLI

Codery is a comprehensive development methodology and workflow system designed to enable AI agents (like Claude) to work effectively with human developers on software projects.

## Installation

```bash
npm install -g @hdts/codery
```

## Quick Start

After installation, navigate to your project directory and run:

```bash
codery setup
```

This will install the Codery documentation and configuration files into your project:

- `.codery/` - Codery documentation and workflows
- `CLAUDE.md` - Instructions for AI assistants
- `.codery-config` - Codery configuration file

## Commands

### `codery setup`

Copies the Codery documentation and configuration files into your current project directory.

Options:
- `--dry-run` - Shows what would be copied without actually copying any files
- `--help` - Display help information

Example with dry-run:
```bash
codery setup --dry-run
```

## What is Codery?

Codery provides:

1. **Structured Development Workflows** - Well-defined processes for AI-human collaboration
2. **Role Definitions** - 16 operational modes for different development tasks
3. **JIRA Integration** - Deep integration with project management
4. **Git Strategy** - Structured branching and merge procedures
5. **Quality Assurance** - Built-in checks and documentation requirements

## Project Structure After Setup

```
your-project/
├── .codery/
│   ├── Lifecycles/
│   │   ├── GIT-Strategy.md
│   │   ├── LifeCycles.md
│   │   └── MergeEvents.md
│   └── Startup/
│       ├── Details/
│       │   ├── Commands.md
│       │   ├── JiraCommands.md
│       │   ├── ReconcatApplications.md
│       │   ├── ReconcatCodery.md
│       │   ├── Roles.md
│       │   └── SuccessCriteria.md
│       └── FullPlaybooksCodery.md
├── CLAUDE.md
└── .codery-config
```

## Working with AI Assistants

Once Codery is set up in your project:

1. AI assistants like Claude can read the Codery documentation to understand your workflows
2. Use the commands documented in `.codery/Startup/Details/Commands.md`
3. Follow the role definitions in `.codery/Startup/Details/Roles.md`
4. Implement the lifecycle processes in `.codery/Lifecycles/`

## Configuration

Edit `.codery-config` to customize Codery settings for your project. This file contains project-specific configuration that AI assistants will use to understand your development environment.

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## Contributing

Codery is an open-source project. Contributions are welcome!

- Repository: https://github.com/turalnovruzov/codery
- Issues: https://github.com/turalnovruzov/codery/issues

## License

ISC License

## Support

For questions and support:
- GitHub Issues: https://github.com/turalnovruzov/codery/issues
- Documentation: Read the files in `.codery/` after setup

---

Codery - Bringing structure and best practices to AI-assisted development.