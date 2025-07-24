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

This will prompt you to:
- Select your Git workflow (Git Flow or Trunk-Based)
- Enter your Atlassian URL
- Configure your project key and branch names

The command creates `.codery/config.json` with your chosen configuration.

### 2. Review Your Configuration

The init command creates `.codery/config.json` based on your selections:

**For Git Flow:**
```json
{
  "cloudId": "https://your-domain.atlassian.net",
  "projectKey": "YOUR_PROJECT",
  "developBranch": "develop",
  "mainBranch": "main",
  "gitWorkflowType": "gitflow"
}
```

**For Trunk-Based Development:**
```json
{
  "cloudId": "https://your-domain.atlassian.net",
  "projectKey": "YOUR_PROJECT",
  "mainBranch": "main",
  "gitWorkflowType": "trunk-based"
}
```

You can edit this file if needed to adjust any values.

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
│   ├── config.json
│   └── application-docs.md  # Your aggregated docs (if configured)
└── CLAUDE.md                # AI assistant instructions
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

## Including Your Documentation

You can include your existing project documentation for AI assistants:

1. Add `applicationDocs` to your config:
   ```json
   {
     "cloudId": "https://your-domain.atlassian.net",
     "projectKey": "YOUR_PROJECT",
     "developBranch": "develop",
     "mainBranch": "main",
     "applicationDocs": [
       "README.md",
       "docs/api.md",
       "docs/architecture.md"
     ]
   }
   ```

2. Run `codery build` - it will create `.codery/application-docs.md`

3. AI assistants will read both CLAUDE.md and your application docs

## Next Steps

- Learn about [available commands](./commands.md)
- Understand [configuration options](./configuration.md)
- Explore the [template system](./templates.md)