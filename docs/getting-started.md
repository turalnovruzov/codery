# Getting Started with Codery

[← Back to Documentation](./README.md)

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Installation

```bash
npm install -g @hdts/codery
```

Verify installation:
```bash
codery --version
```

## Quick Start

### 1. Initialize Codery

Navigate to your project and run:

```bash
codery init
```

This creates `.codery/config.json` with template configuration.

### 2. Configure Your Project

Edit `.codery/config.json`:

```json
{
  "cloudId": "https://your-domain.atlassian.net",
  "projectKey": "YOUR_PROJECT",
  "developBranch": "develop",
  "mainBranch": "main"
}
```

Replace the values with your actual:
- Atlassian instance URL
- JIRA project key
- Branch names (if different from defaults)

### 3. Build Documentation

Generate your CLAUDE.md file:

```bash
codery build
```

This creates a comprehensive guide for AI assistants with all your project-specific configurations.

## What Gets Created?

After initialization:
```
your-project/
└── .codery/
    └── config.json    # Your project configuration
```

After build:
```
your-project/
├── .codery/
│   └── config.json
└── CLAUDE.md         # AI assistant instructions
```

## Basic Workflow Example

1. **Initialize configuration**
   ```bash
   codery init
   ```

2. **Edit configuration**
   ```bash
   # Edit .codery/config.json with your values
   ```

3. **Build documentation**
   ```bash
   codery build
   ```

4. **Start coding with AI**
   - AI assistants can now read CLAUDE.md
   - They'll understand your workflows and configurations
   - Follow the structured development process

## Next Steps

- Learn about [available commands](./commands.md)
- Understand [configuration options](./configuration.md)
- Explore the [template system](./templates.md)