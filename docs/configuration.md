# Configuration Guide

[← Back to Documentation](./README.md)

## Configuration File

Codery stores configuration in `.codery/config.json`.

## Configuration Fields

### cloudId
- **Type**: String
- **Required**: Yes
- **Description**: Your Atlassian instance URL
- **Example**: `"https://mycompany.atlassian.net"`
- **Used in**: JIRA integration, API calls

### projectKey
- **Type**: String
- **Required**: Yes
- **Description**: JIRA project key for issue tracking
- **Example**: `"PROJ"`, `"ACME"`, `"MVP"`
- **Used in**: Branch naming, issue references

### developBranch
- **Type**: String
- **Optional**: Yes (default: `"develop"`)
- **Description**: Name of your development/integration branch
- **Example**: `"development"`, `"dev"`, `"develop"`
- **Used in**: Git workflow documentation

### mainBranch
- **Type**: String
- **Optional**: Yes (default: `"main"`)
- **Description**: Name of your production/release branch
- **Example**: `"main"`, `"master"`, `"production"`
- **Used in**: Git workflow documentation

### applicationDocs
- **Type**: Array of Strings
- **Optional**: Yes
- **Description**: Paths to your application documentation files that will be aggregated during build
- **Example**: `["docs/api.md", "docs/architecture.md", "README.md"]`
- **Used in**: Creates `.codery/application-docs.md` for AI assistants to read
- **Note**: Paths are relative to your project root

## Example Configurations

### Basic Configuration
```json
{
  "cloudId": "https://acme.atlassian.net",
  "projectKey": "ACME",
  "developBranch": "develop",
  "mainBranch": "main"
}
```

### Custom Branch Names
```json
{
  "cloudId": "https://startup.atlassian.net",
  "projectKey": "MVP",
  "developBranch": "dev",
  "mainBranch": "production"
}
```

### Legacy Project (using master)
```json
{
  "cloudId": "https://legacy.atlassian.net",
  "projectKey": "LEG",
  "developBranch": "develop",
  "mainBranch": "master"
}
```

### With Application Documentation
```json
{
  "cloudId": "https://startup.atlassian.net",
  "projectKey": "APP",
  "developBranch": "develop",
  "mainBranch": "main",
  "applicationDocs": [
    "docs/api-reference.md",
    "docs/architecture/overview.md",
    "docs/deployment-guide.md",
    "README.md"
  ]
}
```

## How Configuration Affects Build

When you run `codery build`, these values replace template variables throughout the documentation:

| Template Variable | Replaced With | Example Result |
|-------------------|---------------|----------------|
| `{{cloudId}}` | Your cloudId value | `https://acme.atlassian.net` |
| `{{projectKey}}` | Your projectKey value | `ACME` |
| `{{developBranch}}` | Your developBranch value | `develop` |
| `{{mainBranch}}` | Your mainBranch value | `main` |

### Example Transformation

**Before** (in template):
```markdown
Create a feature branch from {{developBranch}}:
\`\`\`bash
git checkout {{developBranch}}
git checkout -b feature/{{projectKey}}-123-new-feature
\`\`\`
```

**After** (in CLAUDE.md):
```markdown
Create a feature branch from develop:
\`\`\`bash
git checkout develop
git checkout -b feature/ACME-123-new-feature
\`\`\`
```

## Best Practices

1. **Use meaningful project keys** - They appear in branch names and commits
2. **Match your actual branch names** - Ensure documentation reflects reality
3. **Include the protocol** - Always include `https://` in cloudId
4. **Version control config** - Consider if you want to commit `.codery/config.json`

## Validation

The configuration is validated when you run `codery build`:
- Missing required fields will show warnings
- Invalid JSON will prevent the build
- Template variables without values remain unchanged

## Application Documentation Aggregation

When you specify `applicationDocs` in your configuration:

1. **During Build**: Codery reads all specified documentation files
2. **Aggregation**: Files are merged with clear section headers
3. **Output**: Creates `.codery/application-docs.md`
4. **AI Access**: AI assistants read this file during STARTUP

### Benefits
- Keep your existing documentation structure
- AI assistants understand your specific application
- No need to duplicate documentation
- Documentation stays in version control

### Example Output Structure
```markdown
# Application Documentation

## docs/api-reference.md
[Your API documentation content]

## docs/architecture/overview.md
[Your architecture documentation content]
```

**Note**: Template substitution is NOT applied to application documentation files - they are preserved exactly as written.

## Extending Configuration

The configuration system is designed to be minimal but extensible. Future versions may support additional fields for:
- Custom template variables
- Team-specific settings
- Environment configurations

See the [Template System](./templates.md) guide for more details on how templates work.