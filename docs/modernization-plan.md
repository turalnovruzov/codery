# Codery Modernization Plan

## Context

Codery is a CLI tool that generates CLAUDE.md and Claude Code commands/skills from centralized templates. It manages multiple projects via a registry (`~/.codery/projects.json`) and updates all of them with `codery update`.

Claude Code has evolved significantly since Codery was built. This plan modernizes Codery to leverage native Claude Code features while preserving Codery's core value: **centralized management of AI instructions across multiple projects**.

---

## What's Changing

### 1. CLAUDE.md: Monolith → Template + `@` Imports

**Current**: `codery build` merges 7+ markdown files into a single ~800-line CLAUDE.md. Claude forgets instructions because it's too long.

**New**: CLAUDE.md is a single template (~200 lines) with `@` imports for reference files. Content is condensed, not just split.

**Generated structure**:
```
project/
├── CLAUDE.md                          (~200 lines, template with @imports)
│   ├── @.codery/jira-reference.md     (~100 lines)
│   ├── @.codery/git-workflow.md       (~60 lines)
│   ├── @engineering-docs/README.md    (direct from applicationDocs config)
│   └── @engineering-docs/conventions.md
├── .codery/
│   ├── config.json                    (tracked, existing)
│   ├── jira-reference.md              (generated, merged JIRA Workflow + CLI)
│   └── git-workflow.md                (generated, condensed from TrunkBased or GitFlow)
└── .claude/
    └── skills/                        (generated, replaces commands/)
        └── codery-*/SKILL.md
```

### 2. Application Docs: Aggregated File → Direct `@` Imports

**Current**: `buildApplicationDocs()` reads files from `config.applicationDocs`, concatenates them into `.codery/application-docs.md`, which is then read by the start command.

**New**: Each file in `config.applicationDocs` gets a direct `@path/to/file` line in CLAUDE.md. No intermediate file. No aggregation function.

**Why**: Claude Code's `@` imports handle this natively. The aggregation step is unnecessary.

**Build process changes**:
- Remove `buildApplicationDocs()` function
- Remove `.codery/application-docs.md` from generated outputs
- Add `@` import lines for each `applicationDocs` entry directly into CLAUDE.md
- Remove from `.gitignore` template

### 3. Commands → Skills

**Current**: `.claude/commands/codery/*.md` — invoked as `/codery:command-name`

**New**: `.claude/skills/codery-*/SKILL.md` — invoked as `/codery-*`

Skills offer:
- `disable-model-invocation: true` — prevents Claude from auto-triggering
- `allowed-tools` — restricts available tools during skill execution
- YAML frontmatter with `name`, `description`, `argument-hint`

| Current Command | New Skill | Notes |
|---|---|---|
| `/codery:start` | `/codery-start` | Simplified — just activates Mirror Mode (docs already loaded via @imports) |
| `/codery:status` | `/codery-status` | Keep content as-is |
| `/codery:snr` | `/codery-snr` | Keep content as-is |
| `/codery:retrospective` | `/codery-retrospective` | Simplified — "save learnings to auto memory" |
| `/codery:audit` | `/codery-audit` | Keep content as-is |
| `/codery:changelog` | `/codery-changelog` | Keep content as-is |
| `/codery:release` | `/codery-release` | Keep content as-is |
| `/codery:docs-check` | `/codery-docs-check` | Keep content as-is |

### 4. Subagents → Removed

**Current**: 5 subagent templates in `codery-docs/.codery/agents/` (scout, builder, patch, polish, debug), copied to `.claude/agents/`.

**New**: Removed entirely. User confirmed Claude never uses Codery's custom subagents — it creates its own when needed.

**Build process changes**:
- Remove `copySubagentFiles()` function
- Remove `codery-docs/.codery/agents/` directory
- Remove `.claude/agents/` from generated outputs

### 5. Retrospective → Auto Memory

**Current**: `/codery:retrospective` reads/appends to `.codery/Retrospective.md`. Introspective role manages the file.

**New**: `/codery-retrospective` skill says "Review this session. Save learnings to your auto memory." Auto memory is native to Claude Code, stored at `~/.claude/projects/<project>/memory/`.

**Changes**:
- Remove `Retrospective.md` from template sources
- Remove Retrospective.md copying in build process
- Update Introspective role to reference auto memory
- Remove `.codery/Retrospective.md` from `.gitignore` template

### 6. Roles: Condensed from 19 → 11

**Roles to KEEP** (condensed to 1-3 lines each):
1. 🪞 Mirror — Reflect/confirm understanding, question assumptions
2. 🧭 Scout — Research/explore, present findings
3. 🤔 Architect — Design/decide, weigh alternatives
4. 🎨 CRK — Confidence/Risks/Knowledge assessment before building
5. 🧰 Builder — Implement code, commit with ticket reference
6. 🔧 Executor — Run/verify built code
7. 🛠️ Patch — Fix specific known bug, minimal changes
8. 🔎 Debug — Trace data flow, identify issues (no modifications)
9. 🏃 Kanban — JIRA status updates, sprint tracking
10. 🧑‍🏫 Explainer — Explain reasoning/rationale
11. 🔬 Introspective — Session review, save to auto memory

**Roles to REMOVE**: Tinker, POC, Polish, Package, Brainstorm, Summary, Audit-as-role (keep Audit as skill only)

**Condensation approach**:
- 1-3 lines per role instead of 7-15 lines
- Common rules stated ONCE at top (JIRA docs, SNR, no code without approval)
- Remove per-role JIRA comment examples (covered by top-level rule)
- Remove "Does NOT" lists (implicit from what role DOES)
- Remove subagent delegation mentions

---

## CLAUDE.md Content Plan (~200 lines)

### Section 1: Core Rules (~30 lines)
- You operate in roles. One role at a time. Declare with icon.
- Start in Mirror Mode. When in doubt, go to Mirror.
- Code-modifying roles (Builder, Patch, Executor) require explicit user approval.
- CRK assessment required before Builder Mode.
- After Builder/commit, return to Kanban mode.
- SNR after every interaction (3-line compact definition).
- JIRA: Document substance in your own words. Every commit references ticket.
- No mock data, no workarounds, no hardcoded IDs.

### Section 2: Role Definitions (~80 lines)
- Condensed definitions for all 11 roles

### Section 3: Lifecycle (~10 lines)
- Single chain: Mirror → Scout → Architect → CRK → Builder → Kanban → Approval
- Phase summary: Understanding → Research → Design → Assessment → Implementation → Tracking

### Section 4: Success Criteria (~10 lines)
- Condensed from current 26 lines

### Section 5: Imports (~5 lines)
- `@.codery/jira-reference.md`
- `@.codery/git-workflow.md`
- `@<each applicationDocs entry>`

---

## Imported: jira-reference.md (~100 lines)

Merge JIRA_Workflow.md + JIRA_CLI.md:
- Remove "Core JIRA Concepts" (Claude knows Epics/Stories/Tasks)
- Remove comment good/bad examples (already in CLAUDE.md core rules)
- Keep: Workflow states, preview/approval requirements, Git branch naming
- Keep: All CLI commands (list, create, view, edit, transitions, epics, filtering)
- Keep: Progress tracking with role-specific comments
- Keep: Key points summary

---

## Imported: git-workflow.md (~60 lines)

Condense TrunkBased.md / GitFlow.md:
- Remove "When to Use" comparison (already chose workflow type)
- Remove duplicate workflow examples (keep one)
- Keep: Branch structure, safety check, decision rules, commit format, best practices

---

## Source Template Changes

### New files in `codery-docs/.codery/`:
- `claude-md-template.md` — The CLAUDE.md template (~200 lines, roles + lifecycle + success criteria + import placeholders)
- `jira-reference.md` — Merged JIRA content (~100 lines)
- Condensed `GitWorkflows/TrunkBased.md` (~60 lines)
- Condensed `GitWorkflows/GitFlow.md` (~60 lines)
- `skills/codery-*/SKILL.md` — Skills replacing commands

### Removed from `codery-docs/.codery/`:
- `Roles.md` (content moved into claude-md-template.md)
- `JIRA_Workflow.md` (merged into jira-reference.md)
- `integrations/JIRA_CLI.md` (merged into jira-reference.md)
- `integrations/JIRA_MCP.md` (merged into jira-reference.md, conditional)
- `LifeCycles.md` (content moved into claude-md-template.md)
- `SuccessCriteria.md` (content moved into claude-md-template.md)
- `SubagentWorkflow.md` (removed)
- `Retrospective.md` (removed, replaced by auto memory)
- `agents/` directory (removed entirely)
- `commands/` directory (replaced by skills/)

---

## Build Process Changes (`buildDocs.ts`)

### Current flow:
1. Read 7+ markdown files from `codery-docs/.codery/`
2. Merge them all into one CLAUDE.md
3. Apply template variable substitution
4. Copy subagents to `.claude/agents/`
5. Copy commands to `.claude/commands/`
6. Build application-docs.md from config entries
7. Copy Retrospective.md template

### New flow:
1. Read `claude-md-template.md` as CLAUDE.md base
2. Inject `@` import lines for each `config.applicationDocs` entry
3. Apply template variable substitution
4. Write CLAUDE.md
5. Copy `jira-reference.md` to `.codery/jira-reference.md` (with substitution)
6. Copy appropriate git workflow to `.codery/git-workflow.md` (with substitution)
7. Copy skills to `.claude/skills/` (with substitution)

### Functions to remove:
- `readMarkdownFiles()` — no longer merging multiple files
- `mergeMarkdownFiles()` — no longer merging
- `buildApplicationDocs()` — no aggregation needed
- `copySubagentFiles()` — subagents removed
- `copyCommandFiles()` — replaced by skill copying
- `fileOrder` array — no longer relevant

### Functions to add/modify:
- `copySkillFiles()` — copy skills from `codery-docs/.codery/skills/` to `.claude/skills/`
- `copyReferenceFiles()` — copy jira-reference.md and git-workflow.md to `.codery/`
- `buildCommand()` — rewrite to use new flow

---

## Init Command Changes (`initCommand.ts`)

### .gitignore updates:
- Add: `.codery/jira-reference.md`
- Add: `.codery/git-workflow.md`
- Add: `.claude/skills/` (replaces `.claude/commands/`)
- Remove: `.codery/application-docs.md`
- Remove: `.codery/Retrospective.md`
- Remove: `.claude/agents/`
- Keep: `CLAUDE.md`, `.claude/` catch-all may cover skills

---

## Config Changes (`config.ts`)

No changes to the config interface needed. Existing fields work:
- `applicationDocs: string[]` — now used for direct `@` imports instead of aggregation
- `gitWorkflowType` — selects which git workflow to copy
- `jiraIntegrationType` — selects which JIRA content to include in jira-reference.md
- `projectKey`, `mainBranch`, `developBranch` — template variables

---

## Implementation Order

1. Write condensed `claude-md-template.md` (~200 lines)
2. Write `jira-reference.md` (merged JIRA content)
3. Condense `GitWorkflows/TrunkBased.md` and `GitFlow.md`
4. Convert 8 commands to skills format
5. Rewrite `buildDocs.ts` for new flow
6. Update `initCommand.ts` for new .gitignore entries
7. Remove `agents/` directory from codery-docs
8. Remove old source files (Roles.md, JIRA_Workflow.md, etc.)
9. Simplify retrospective skill
10. Build and test on ai-guild project
11. Test `codery update` across registered projects

---

## Open Questions

1. **Naming**: `/codery-start` vs `/codery:start` — Skills use directory names as command names. Hyphens are standard for directory names. Colons would require a plugin namespace. Decision: use hyphens for now.
2. **MCP JIRA content**: jira-reference.md needs conditional content for MCP vs CLI. How to handle? Options: two separate template files, or one file with both (template substitution removes unused section).
