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

---

### codery config

View or edit `.codery/config.json` without re-running the full `codery init` wizard. Mirrors `git config` semantics with both an interactive menu and scriptable subcommands.

**Usage:**
```bash
codery config                       # interactive menu (default)
codery config list                  # print full config as JSON
codery config get <key>             # print one field's value
codery config set <key> <value>     # set a scalar field
codery config unset <key>           # remove a field
codery config add <key> <value>     # append to an array field (e.g. applicationDocs)
codery config remove <key> <value>  # remove a value from an array field
```

**Interactive menu:**

Bare `codery config` opens an arrow-key navigable list of every field with its current value. Select a field to edit it (list prompt for enums, validated input for scalars, sub-menu for arrays). Choose **Save & Exit** to persist or **Discard & Exit** to abandon changes (confirms if dirty).

**Scriptable subcommands:**

Designed for shell loops and CI. All commands operate on `.codery/config.json` in the current directory and exit non-zero on error.

- `list` — pretty-prints the full config
- `get <key>` — prints the field's value (newline-delimited for arrays); exit 1 if unset or unknown
- `set <key> <value>` — validates and writes a scalar/enum field; rejects array fields
- `unset <key>` — removes a field (no-op if already absent)
- `add <key> <value>` — appends to an array field; rejects scalar fields
- `remove <key> <value>` — removes a value from an array; exit 1 if not found

**Validation:** uses the same per-field validators as `codery init` (extracted into `src/lib/configSchema.ts`). Filters apply consistently — e.g. `set jiraCloudId https://acme.atlassian.net/` stores `acme.atlassian.net`.

**Stale-field warnings:** `set jiraIntegrationType cli` while `jiraCloudId` is set prints a warning to stderr but does **not** auto-unset. The interactive menu surfaces the same warnings inline next to the field. Run `unset` deliberately to clean up.

**Examples:**

Migrate a project from JIRA CLI to Atlassian MCP:
```bash
codery config set jiraIntegrationType mcp
codery config set jiraCloudId company.atlassian.net
codery build
```

Loop across multiple projects:
```bash
for dir in ~/projects/*/; do
  (cd "$dir" && codery config set jiraIntegrationType cli)
done
```

Inspect a single field:
```bash
codery config get projectKey
```

**Important:** `codery config` does **not** trigger a rebuild. Run `codery build` separately when ready.

---

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
codery config --help
```