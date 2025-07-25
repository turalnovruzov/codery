# Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with [Semantic Release](https://semantic-release.gitbook.io/) for automated versioning and changelog generation.

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

## Commit Types

### Version-Changing Types

#### `feat` - New Feature
Introduces new functionality to the codebase.
```bash
feat: add GitHub Actions workflow generator
feat(cli): add --dry-run flag to build command
```

#### `fix` - Bug Fix
Patches a bug in your codebase.
```bash
fix: resolve path resolution on Windows
fix(parser): handle empty configuration files
```

### Non-Version-Changing Types

These types are recognized but don't trigger releases:

#### `docs` - Documentation
Documentation only changes.
```bash
docs: update README with new CLI options
docs(api): add JSDoc comments to public methods
```

#### `style` - Code Style
Changes that don't affect code meaning (whitespace, formatting, semicolons).
```bash
style: format code with prettier
style(tests): fix indentation in test files
```

#### `refactor` - Code Refactoring
Code changes that neither fix bugs nor add features.
```bash
refactor: extract config validation to separate module
refactor(cli): simplify command parsing logic
```

#### `perf` - Performance
Performance improvements.
```bash
perf: optimize file reading with streams
perf(parser): cache parsed templates
```

#### `test` - Tests
Adding or correcting tests.
```bash
test: add unit tests for config loader
test(integration): add E2E tests for CLI commands
```

#### `build` - Build System
Changes to build system or external dependencies.
```bash
build: update TypeScript to v5.0
build(deps): bump semantic-release to latest
```

#### `ci` - Continuous Integration
Changes to CI configuration files and scripts.
```bash
ci: add Node.js 20 to test matrix
ci(github): enable caching for npm dependencies
```

#### `chore` - Chores
Other changes that don't modify src or test files.
```bash
chore: update .gitignore
chore(release): 1.2.3 [skip ci]
```

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

## Multi-line Commits

For complex changes, use the commit body to provide more context:

```bash
git commit -m "feat(templates): add support for custom variables

- Users can now define custom variables in config
- Variables are validated at build time
- Added interpolation for nested object properties

Closes #123"
```

## Special Keywords

### Closing Issues
Reference GitHub issues to automatically close them:
```bash
fix: prevent duplicate file processing

Fixes #456
Closes #789
```

### Skipping CI
Prevent CI runs for minor changes:
```bash
docs: fix typo in README [skip ci]
chore: update comments [ci skip]
```

## Best Practices

1. **Keep the subject line under 50 characters**
2. **Use imperative mood** ("add feature" not "added feature")
3. **Don't end subject with period**
4. **Separate subject from body with blank line**
5. **Use body to explain what and why, not how**
6. **Reference issues and PRs in the footer**

## Examples by Version Impact

### PATCH Version (Bug Fixes)
```bash
fix: handle undefined config values
fix(cli): prevent crash when no arguments provided
fix: correctly parse Windows file paths
```

### MINOR Version (New Features)
```bash
feat: add JSON output format
feat(cli): support multiple config files
feat: implement caching for better performance
```

### MAJOR Version (Breaking Changes)
```bash
feat!: migrate to ESM modules
fix!: correct typo in API method name
refactor!: change plugin architecture

BREAKING CHANGE: Plugins must now export a default function
instead of using named exports.
```

## Validation

To ensure your commits follow the convention, consider:

1. **Manual Review**: Check your commit messages before pushing
2. **Git Hooks**: Use commitlint (future enhancement)
3. **PR Checks**: GitHub Actions will validate on pull requests

## Why Conventional Commits?

- **Automated Versioning**: Semantic Release determines version bumps automatically
- **Changelog Generation**: Creates detailed changelogs from commit history
- **Clear Communication**: Team members understand impact of changes
- **CI/CD Integration**: Enables fully automated release pipelines

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)