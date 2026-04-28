# Codery CLI

[![npm version](https://img.shields.io/npm/v/codery.svg)](https://www.npmjs.com/package/codery)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> **⚠️ DEPRECATED — moved to a Claude Code plugin (v9.0.0+).** The Codery methodology and skills are now distributed natively via Claude Code's plugin system. The npm package is in deprecation. See **[turalnovruzov/codery-plugin](https://github.com/turalnovruzov/codery-plugin)** for the new home.

## Migrate to the plugin

```text
/plugin marketplace add turalnovruzov/codery-plugin
/plugin install codery@codery-plugin
/codery:setup
```

That's it — `/codery:setup` writes your project config and rules files and replaces everything `codery init` + `codery build` + `codery update` did before.

---

## Below this line: legacy v8.x documentation (npm package)

Codery is a comprehensive development methodology and workflow system designed to enable AI agents (like Claude) to work effectively with human developers on software projects.

## Installation (legacy v8.x)

```bash
npm install -g codery
```

## Documentation

📚 **[View Full Documentation](./docs/README.md)**

- [Getting Started Guide](./docs/getting-started.md)
- [Command Reference](./docs/commands.md)
- [Configuration Guide](./docs/configuration.md)
- [Template System](./docs/templates.md)

## Quick Start

After installation, navigate to your project directory and run:

```bash
codery init
```

This creates a configuration file at `.codery/config.json`. Then build your documentation:

```bash
codery build
```

This generates `CLAUDE.md` - a comprehensive guide for AI assistants

## Commands

### `codery init`

Initialize Codery configuration in your project.

Options:
- `--force` - Overwrite existing configuration

Example:
```bash
codery init --force
```

### `codery build`

Build CLAUDE.md from documentation templates.

Options:
- `--output <path>` - Custom output path
- `--dry-run` - Preview without creating files
- `--skip-config` - Build without template substitution

Example:
```bash
codery build --output ./docs/AI-GUIDE.md
```

See the [Command Reference](./docs/commands.md) for detailed documentation

## What is Codery?

Codery provides:

1. **Structured Development Workflows** - Well-defined processes for AI-human collaboration
2. **Specialized Subagents** - Pre-configured AI specialists for different development tasks
3. **JIRA Integration** - Deep integration with project management
4. **Git Strategy** - Structured branching and merge procedures
5. **Quality Assurance** - Built-in checks and documentation requirements

## Project Structure

After initialization and build:

```
your-project/
├── .codery/
│   └── config.json      # Your project configuration
├── CLAUDE.md           # Generated AI assistant guide
└── docs/               # User documentation (if using this package)
    ├── README.md
    ├── getting-started.md
    ├── commands.md
    ├── configuration.md
    └── templates.md
```

## Working with AI Assistants

Once Codery is set up in your project:

1. AI assistants can read CLAUDE.md to understand your workflows
2. They'll follow structured development processes with specialized subagents
3. All work is tracked through JIRA integration
4. Git workflows are customized to your branch names

## Configuration

Edit `.codery/config.json` to customize:
- Atlassian Cloud ID
- JIRA project key
- Branch names
- More options coming soon

See the [Configuration Guide](./docs/configuration.md) for details

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
- 📚 [Documentation](./docs/README.md)
- 🐛 [GitHub Issues](https://github.com/turalnovruzov/codery/issues)
- 📦 [NPM Package](https://www.npmjs.com/package/codery)

---

Codery - Bringing structure and best practices to AI-assisted development.