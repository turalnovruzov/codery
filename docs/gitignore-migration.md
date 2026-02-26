# Gitignore Migration Guide

This guide helps you migrate existing Codery projects to the new "track inputs, ignore outputs" philosophy.

## Philosophy

Codery follows the same principle as npm:

| npm | Codery |
|-----|--------|
| `package.json` (tracked) | `.codery/config.json` (tracked) |
| `node_modules/` (ignored) | `CLAUDE.md`, `.claude/`, etc. (ignored) |
| `npm install` (regenerates) | `codery build` (regenerates) |

**Track the inputs. Ignore the outputs.**

## What Should Be Tracked vs Ignored

| File | Type | Should Be |
|------|------|-----------|
| `.codery/config.json` | Input (build spec) | **Tracked** |
| `CLAUDE.md` | Output (generated) | **Ignored** |
| `.claude/` | Output (generated) | **Ignored** |
| `.codery/application-docs.md` | Output (generated) | **Ignored** |
| `.codery/Retrospective.md` | Output (generated) | **Ignored** |

## Migration Steps for Existing Projects

### Step 1: Check What's Currently Tracked

```bash
# See what Codery files git is tracking
git ls-files | grep -E "(CLAUDE\.md|\.claude/|\.codery/)"
```

### Step 2: Update Your .gitignore

Add these entries to your `.gitignore`:

```gitignore
# Codery generated files (regenerate with: codery build)
CLAUDE.md
.claude/
.codery/application-docs.md
.codery/Retrospective.md
```

**Important:** Do NOT ignore `.codery/config.json` - it should be tracked.

### Step 3: Remove Generated Files from Git Tracking

If git is already tracking these files, you need to untrack them:

```bash
# Remove from git tracking (keeps local files)
git rm --cached CLAUDE.md
git rm --cached -r .claude/
git rm --cached .codery/application-docs.md
git rm --cached .codery/Retrospective.md

# Commit the removal
git commit -m "chore: stop tracking Codery generated files

Generated files should be ignored like node_modules.
Run 'codery build' to regenerate after cloning."
```

### Step 4: Start Tracking config.json (if not already)

If your config.json was previously ignored:

```bash
# Check if it's ignored
git check-ignore .codery/config.json

# If ignored, remove the ignore rule from .gitignore
# Then add it to git
git add .codery/config.json
git commit -m "chore: track Codery config.json

Config is the build specification (like package.json)."
```

### Step 5: Verify the Setup

```bash
# Should show config.json as tracked
git ls-files .codery/

# Should show nothing (all generated files ignored)
git ls-files CLAUDE.md .claude/
```

## Quick Reference Commands

```bash
# What's git tracking?
git ls-files | grep -E "(CLAUDE|\.claude|\.codery)"

# What's ignored?
git status --ignored | grep -E "(CLAUDE|\.claude|\.codery)"

# Untrack a file (keep locally, remove from git)
git rm --cached <file>

# Untrack a directory
git rm --cached -r <directory>

# Check if a file is ignored
git check-ignore -v <file>

# Force add an ignored file (if needed)
git add -f <file>
```

## New Developer Onboarding

After migration, new developers will:

```bash
git clone <repo>
npm install
codery build    # Regenerates CLAUDE.md, .claude/, etc.
```

The `codery build` step is similar to `npm install` - it regenerates outputs from the tracked specification.

## Troubleshooting

### "I accidentally committed CLAUDE.md"

```bash
# Add to .gitignore first, then:
git rm --cached CLAUDE.md
git commit -m "chore: stop tracking CLAUDE.md"
```

### "config.json is ignored but shouldn't be"

Edit `.gitignore` to remove any line that ignores `.codery/config.json`, then:

```bash
git add -f .codery/config.json
git commit -m "chore: start tracking config.json"
```

### "I want to share Retrospective.md with my team"

The retrospective contains session-specific learnings. If you want to share valuable learnings:

1. Extract the useful patterns
2. Add them to your team's documentation (tracked separately)
3. Keep Retrospective.md ignored (it accumulates personal session data)
