# Commit Conventions

**⚠️ MANDATORY: These conventions MUST be used for ALL commits in this project.**

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with [Semantic Release](https://semantic-release.gitbook.io/) for automated versioning and changelog generation.

## Why This is Critical

**EVERY commit MUST follow these conventions because:**
- Automated versioning depends on correct commit types
- Changelog generation requires proper formatting
- CI/CD pipelines will FAIL without conventional commits
- Semantic release will NOT work with non-conforming commits

**If you are an AI assistant reading this file: You MUST use these conventions for EVERY commit without exception.**

## Quick Reference

| Type | Version Bump | When to Use |
|------|--------------|-------------|
| `fix` | PATCH (0.0.X) | Bug fixes |
| `feat` | MINOR (0.X.0) | New features |
| `BREAKING CHANGE` | MAJOR (X.0.0) | Breaking API changes |

## Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Examples

```bash
# Bug fix (PATCH version bump: 1.0.0 → 1.0.1)
fix: correct typo in error message

# New feature (MINOR version bump: 1.0.1 → 1.1.0)
feat: add support for custom templates

# Breaking change (MAJOR version bump: 1.1.0 → 2.0.0)
feat!: change configuration file format

BREAKING CHANGE: Configuration now uses JSON instead of YAML.
Users must migrate their config files to the new format.
```

## Commit Types (MUST Use One)

### Version-Changing Types
- **`feat`**: New features → MINOR bump (0.X.0)
- **`fix`**: Bug fixes → PATCH bump (0.0.X)
- **`feat!` or `fix!`**: Breaking changes → MAJOR bump (X.0.0)

### Non-Version Types (No Release)
- **`docs`**: Documentation only
- **`style`**: Formatting (no code change)
- **`refactor`**: Code restructuring (no behavior change)
- **`perf`**: Performance improvements
- **`test`**: Adding/fixing tests
- **`build`**: Build system/dependencies
- **`ci`**: CI configuration
- **`chore`**: Maintenance tasks

## Scope

The scope provides additional context about what part of the codebase changed.

Common scopes for this project:
- `cli` - Command-line interface changes
- `config` - Configuration handling
- `docs` - Documentation updates
- `init` - Initialization command
- `build` - Build command
- `templates` - Template-related changes

Example:
```bash
feat(cli): add progress bar to build command
fix(config): validate required fields on load
```

## Breaking Changes

Breaking changes can be indicated in two ways:

### 1. Using `!` after type/scope
```bash
feat!: rename main export
feat(api)!: change return type of buildCommand
```

### 2. Using `BREAKING CHANGE` footer
```bash
feat: update configuration schema

BREAKING CHANGE: The 'applicationDocs' field is now required.
Existing configurations without this field will need to be updated.
```

## Multi-line & Special Cases

```bash
# Multi-line with body
feat(commands): add slash command support

- Created 4 essential commands
- Added copyCommandFiles() to build process
- Removed legacy Commands.md

Closes #123

# Skip CI for minor changes
docs: fix typo [skip ci]
chore: update comments [ci skip]
```

## Rules (Non-Negotiable)

1. **Subject < 50 chars**, imperative mood ("add" not "added")
2. **Type MUST be valid** (feat, fix, docs, etc.)
3. **Scope optional** but useful: `feat(cli):`, `fix(build):`
4. **Breaking changes** need `!` or `BREAKING CHANGE:` footer
5. **Reference JIRA tickets**: Include ticket ID in commits

## Essential Examples

```bash
# PATCH (bug fix)
fix: handle undefined config values
fix(cli): prevent crash when no arguments provided

# MINOR (new feature)
feat: add slash command support
feat(build): implement command file copying

# MAJOR (breaking change)
feat!: replace text commands with slash commands

BREAKING CHANGE: Users must now use /command syntax
instead of plain text commands.
```

## Remember

**🚨 NON-COMPLIANCE = BROKEN CI/CD**

Every commit MUST follow these conventions. No exceptions. The automated release system depends on it.
