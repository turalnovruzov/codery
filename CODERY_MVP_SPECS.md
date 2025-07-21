# Codery CLI — Specification Document

## 1 Purpose

Provide a command‑line interface (CLI) that developers can install globally via `npm install -g @hdts/codery`. The CLI's MVP command, `codery setup`, boot‑straps a local project so an AI agent ("Codery") can load its context from the prepared documentation. The tool copies a curated set of **codery‑docs** resources into predictable locations inside the consumer's repository and performs minimal configuration.

## 2 Scope

* **In**   Packaging the docs, exposing the CLI, copying files, light config.
* **Out**  Implementing or orchestrating the AI agent itself, deep project scaffolding, selective installs, interactive prompts beyond confirmation of overwrite.

## 3 Stakeholders & Roles

| Stakeholder                | Interest                                                         |
| -------------------------- | ---------------------------------------------------------------- |
| Internal Codery maintainers | Build & publish the `codery` package, tag versions, maintain docs |
| Consumer developers        | Install and run `codery setup` to enable AI workflow              |
| OSS community              | Review source, raise issues, contribute fixes                    |

## 4 Definitions

| Term                 | Meaning                                           |
| -------------------- | ------------------------------------------------- |
| **Consumer project** | Any repo into which the CLI copies docs           |
| **MVP**              | Minimum viable product described in this document |
| **SemVer**           | Semantic Versioning: MAJOR.MINOR.PATCH            |

## 5 Assumptions

1. Consumers run Node ≥ 18 LTS.
2. Package is public on npm under the name **@hdts/codery**.
3. Installation is expected to be global; using `npx` is acceptable but not required.
4. Consumers are comfortable with overwritten files after confirmation.

## 6 Functional Requirements

### 6.1 Installation

* The package is installable via `npm install -g @hdts/codery`.
* A symlinked executable **codery** is registered in the user's `$PATH`.

### 6.2 Command: `codery setup`

| ID  | Requirement                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------- |
| F‑1 | The CLI copies the **codery‑docs/.codery/** folder and all its contents into `<current-directory>/.codery/`                     |
| F‑2 | The CLI copies **codery‑docs/Setup/NewCLAUDE.md** to `<current-directory>/CLAUDE.md`                                         |
| F‑3 | The CLI copies **codery‑docs/Setup/.codery-config.example** to `<current-directory>/.codery-config`                            |
| F‑4 | Existing files prompt user with a list of files to be overwritten and ask for single yes/no confirmation                    |
| F‑5 | The CLI returns exit code 0 on success, non‑zero on failure                                                                  |
| F‑6 | `codery setup --dry-run` prints the planned file operations without writing                                                   |
| F‑7 | `codery --help` and `codery setup --help` output usage information                                                             |

### 6.3 Internal File Mapping (MVP)

| Source in package                      | Destination in consumer repo |
| -------------------------------------- | ---------------------------- |
| `codery-docs/.codery/**/*`               | `.codery/**/*`                |
| `codery-docs/Setup/NewCLAUDE.md`        | `./CLAUDE.md`                |
| `codery-docs/Setup/.codery-config.example` | `./.codery-config`            |

> *Note*: If the source file tree changes, update this table.

### 6.4 Overwrite Behaviour

When existing files are detected, the CLI:
1. Lists all files that will be overwritten
2. Prompts user with a single yes/no confirmation
3. Proceeds with overwrite if user confirms, exits if user declines

### 6.5 Error Handling

* The CLI works in any directory (Git repository not required)
* Unexpected IO errors are surfaced with stack traces only when `--debug` is passed; otherwise show concise messages.
* If file copy operations fail, provide clear error messages indicating which files could not be copied

## 7 Non‑Functional Requirements

* **Compatibility** – Tested on macOS, Linux, Windows 10+ environments with Node 18 and 20.
* **Security** – Package contains only static markdown / shell files; no code executed post‑install besides the CLI.
* **Performance** – `codery setup` completes in under 1 second on typical SSD.
* **Telemetry** – None.

## 8 Package Layout (published tarball)

```
package root
├── bin
│   └── codery          # shebang JS file
├── lib
│   └── copyDocs.js    # internal helper(s)
├── codery-docs/**      # vendored markdown tree
├── package.json
└── README.md
```

* **bin/codery** uses [Commander.js](https://github.com/tj/commander.js) for argument parsing.

## 9 Publishing & Versioning Workflow

### 9.1 Versioning Model

* Follow **Semantic Versioning 2.0.0**.
* Use `npm version <patch|minor|major>` which:

  1. Updates `package.json` version.
  2. Creates a git commit and tag (`vX.Y.Z`).

### 9.2 Release Procedure

1. Ensure `main` is clean and CI passes.
2. `npm version patch` (or minor/major).
3. `git push --follow-tags`.
4. `npm publish --access public`.

> *Note*: Git tags are the source of truth; npm shows the same versions automatically.

### 9.3 Continuous Integration (future)

* GitHub Actions job runs lint & unit tests on every PR.
* Optional `npm publish` on push to `main` when package.json version differs from the latest tag.

## 10 Testing Strategy

* Unit tests for file‑copy logic using Node's `fs` fixture objects.
* E2E smoke test in a temporary directory invoking the CLI via `child_process`.
* Windows path handling verified via GitHub Actions on `windows-latest`.

## 11 Roadmap / Future Extensions

1. `codery update` command that performs a three‑way merge instead of raw overwrite.
2. Flags to install subsets of docs (`--lifecycles`, `--startup`).
3. Template variables inside docs to inject project‑specific metadata.
4. Support for local install (`npx @hdts/codery setup`).
5. Telemetry opt‑in to collect anonymous usage stats.

---

**End of v0.1 spec**