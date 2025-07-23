# Git Promotion and CI/CD Strategy for JIRA Management

## 🌐 Environment Promotion Flow

The promotion flow is defined in the `.codery-config` file:

- **Local** Git Lifecycle
- **Origin** Git Lifecycle
- Follow the `.codery-config` GIT_General_Strategy phase (overrides this section)

## 🔧 Assumptions

1. **User Responsibility**: Developers are responsible for placing correct versions into the DEVELOPMENT branch (as defined in `.codery-config`) before beginning JIRA work.
2. **Explicit Promotion**: Versions do **not** auto-promote. Promotions to TESTING or PRODUCTION branches require explicit Codery approval and execution.
3. **JIRA Integration**: JIRA is the ticket scope tracking system. This is the starting point for any branch work.

## 🚧 Git Workflow — DEVELOPMENT Phase

### 🔹 Strategy

Each branch is tied to a JIRA ticket or group of tickets (e.g., story or epic) and is developed in an individual branch created from the DEVELOPMENT branch. All progress is documented in markdown with session-based SNR entries.

### 🔁 Workflow Steps

| Step | Description |
|------|-------------|
| 1 | Confirm current branch is the DEVELOPMENT branch (as defined in `.codery-config`). Abort if not. |
| 2 | If working on an existing JIRA ticket, checkout the corresponding branch. |
| 3 | For new work, create a new branch based on JIRA ticket number. |
| 4 | Initial commit includes the creation or update of JIRA tracking markdown. |
| 5 | Code in small commits. After each session, record an SNR (Summarize, Next, Role). |
| 6 | Run ESLint: `npm run lint` |
| 7 | Run Build: `npm run build` |
| 8 | Run Locally: `npm run dev` |
| 9 | Request final review and approval. |
| 10 | Upon approval, merge into the DEVELOPMENT branch. |
| 11 | Delete the working branch after successful merge. |
| 12 | Codery logs the merge event under `~/Productions/DEVELOPMENT/merge-<timestamp>.md` with all JIRA ticket references. |

### 🏷 Branch Naming Conventions

```
TYPE|JIRA-NUMBER|ShortDesc(CamelCased)
```

Examples:
- `EPIC|PROJ-123|UserAuthentication`
- `STORY|PROJ-456|LoginForm`
- `TASK|PROJ-789|FixPasswordValidation`

## ✅ Merge Requirements (into DEVELOPMENT branch)

- ✔ No ESLint errors
- ✔ Successful build
- ✔ Local `npm run dev` test passes
- ✔ All SNRs documented in markdown
- ✔ Final summary and markdown confirmation included

## 📓 SNR Protocol (Mandatory)

After every working session, update the tracking markdown file with an **SNR block**:

```markdown
### SNR - YYYY-MM-DD-HH-MM

**S — Summary:**
🔷 What was completed this session.

**N — Next Steps:**
🟡 What will be tackled next.

**R — Request / Role:**
🟩 What help is needed (if any), or who's responsible next.
```

## 🧭 Visual Flow Summary

```text
Start
  ↓
Check DEVELOPMENT Branch
  ↓
Create/Checkout JIRA Branch
  ↓
Initial Commit (JIRA tracking doc)
  ↓
Code + SNRs
  ↓
Lint → Build → Dev Run
  ↓
Final Review
  ↓
Merge into DEVELOPMENT
  ↓
Delete Branch
```

## 📌 Next Phase Work

- Define TESTING Promotion Rules (DEVELOPMENT → TESTING)
- Add GitHub Action for enforcing lint/build prior to merges (optional)

## ✅ Best Practices

- Always verify you are on the correct branch
- Always pass lint, build, and local dev run before merge
- Always maintain SNR documentation in markdown

## 🔐 Codery Rules Implied and Enforced

```text
[DEV Work: Local Branches from DEVELOPMENT]
       ↓
[Merge into Local DEVELOPMENT]  ← Codery merges
       ↓
[Push Local DEVELOPMENT to origin/DEVELOPMENT]
       ↓
[Codery merges DEVELOPMENT → origin/TESTING] (remote only)
       ↓
[Codery merges TESTING → origin/PRODUCTION] (remote only)
       ↓
[Codery logs summary in ~/Productions/ENV/merge-*.md]
```

## General Git Rules

- **No direct updates** to PRODUCTION, TESTING, or origin DEVELOPMENT without approval
- **No local TESTING/PRODUCTION branches** - Only local DEVELOPMENT and feature branches
- **Promotion via push** - Always through explicit, documented GitHub push to remote
- **Merge-only progression** - Code moves forward only through merge events
- **Separate logging** - Merge summaries logged in `~/Productions/ENV/`, not in the repo
- **Local work restrictions** - Work only in local DEVELOPMENT or JIRA ticket branches

*Maintained under: `/public/readmes/Git_Strategy.md`*