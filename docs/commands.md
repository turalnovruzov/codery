# Command Reference

[← Back to Documentation](./README.md)

## Available Commands

### codery init

Initialize Codery configuration in your project.

**Usage:**
```bash
codery init [options]
```

**Options:**
- `--force` - Overwrite existing configuration without prompting

**What it does:**
1. Creates `.codery` directory if it doesn't exist
2. Generates `config.json` with default values
3. Adds `.codery/config.json` to `.gitignore` if it exists

**Examples:**

Basic initialization:
```bash
codery init
```

Force overwrite existing config:
```bash
codery init --force
```

**Output:**
```
🏰 Codery Init

✓ Created .codery directory
✓ Created config.json with template values

✨ Codery initialized successfully!

Next steps:
  1. Edit .codery/config.json with your project settings
  2. Run 'codery build' to generate your CLAUDE.md file
```

---

### codery build

Build a CLAUDE.md file from Codery documentation templates.

**Usage:**
```bash
codery build [options]
```

**Options:**
- `--output <path>` - Custom output path (default: `./CLAUDE.md`)
- `--dry-run` - Preview what would be built without creating files
- `--skip-config` - Build without template substitution

**What it does:**
1. Reads documentation templates from the package
2. Loads your `.codery/config.json`
3. Substitutes template variables with your values
4. Merges all documentation into a single file
5. Creates CLAUDE.md for AI assistants
6. If `applicationDocs` is configured, aggregates your documentation into `.codery/application-docs.md`

**Examples:**

Basic build:
```bash
codery build
```

Custom output location:
```bash
codery build --output ./docs/AI-GUIDE.md
```

Preview without creating:
```bash
codery build --dry-run
```

Build without substitution:
```bash
codery build --skip-config
```

**Output:**
```
🏰 Codery Build

Found 6 markdown files:
  - Subagents
  - Git Workflow
  - JIRA Workflow
  - Commands
  - SuccessCriteria
  - Lifecycles

Applying template substitution...

✨ Codery build complete!

Created: /path/to/project/CLAUDE.md
Size: ~33KB

Building application documentation...
✓ Created .codery/application-docs.md
```

**With Application Documentation:**
If you have `applicationDocs` configured, the build process will also:
- Read each specified documentation file
- Merge them with section headers
- Create `.codery/application-docs.md`
- Show warnings for any missing files but continue

## Error Handling

### Common Errors

**Config not found:**
```
⚠️  No configuration found. Run "codery init" to create one.
```

**Invalid config:**
```
Warning: Failed to parse .codery/config.json
```

**Existing file (without --force):**
```
⚠️  Configuration file already exists: .codery/config.json
Do you want to overwrite the existing configuration? (y/N)
```

## Getting Help

Display help for any command:
```bash
codery --help
codery init --help
codery build --help
```