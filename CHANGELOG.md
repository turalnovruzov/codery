# [6.1.0](https://github.com/turalnovruzov/codery/compare/v6.0.0...v6.1.0) (2025-08-10)


### Features

* **jira:** add preview and approval workflow for ticket operations ([d4ac0ec](https://github.com/turalnovruzov/codery/commit/d4ac0eccd058c0d1bb467072a74e47299f7019db))

# [6.0.0](https://github.com/turalnovruzov/codery/compare/v5.1.1...v6.0.0) (2025-08-04)


### Features

* **roles:** add automatic subagent delegation triggers ([0f4ed76](https://github.com/turalnovruzov/codery/commit/0f4ed7628c7965a8b1edb8674d4d47b68bd29b66))


### BREAKING CHANGES

* **roles:** AI assistants will now automatically delegate to subagents when thresholds are met, without waiting for user approval

## [5.1.1](https://github.com/turalnovruzov/codery/compare/v5.1.0...v5.1.1) (2025-08-01)


### Bug Fixes

* update package author information ([e743ca2](https://github.com/turalnovruzov/codery/commit/e743ca297ebea198ee9f5a6cd6bbbde5be72bfad))

# [5.1.0](https://github.com/turalnovruzov/codery/compare/v5.0.0...v5.1.0) (2025-08-01)


### Features

* **init:** add support for reading and preserving existing configuration ([ebe3ac8](https://github.com/turalnovruzov/codery/commit/ebe3ac88ba3df36996bac080c61dc98eb00e91db))

# [5.0.0](https://github.com/turalnovruzov/codery/compare/v4.0.0...v5.0.0) (2025-07-31)


### Bug Fixes

* **init:** reorder prompts and make cloudId conditional based on JIRA integration type ([d3680c7](https://github.com/turalnovruzov/codery/commit/d3680c774aee4132740c06b5f174060b3dc3096d))


### Features

* **docs:** add comprehensive JIRA CLI integration documentation ([a180aff](https://github.com/turalnovruzov/codery/commit/a180aff63734bf5fd57c1e1f86611765c3e5d257))
* **init:** add applicationDocs field to generated config ([b35d9d0](https://github.com/turalnovruzov/codery/commit/b35d9d0d7b81806c8738f5ccd5ec154691cfd7a8))
* **integration:** add JIRA integration type selection ([d4d1c43](https://github.com/turalnovruzov/codery/commit/d4d1c4369b90302d7b81aa85b6d493da36c703e5))


### BREAKING CHANGES

* **init:** cloudId is now optional in CoderyConfig interface.
Existing configs with CLI integration may have unnecessary cloudId field.

# [4.0.0](https://github.com/turalnovruzov/codery/compare/v3.0.1...v4.0.0) (2025-07-30)


### Bug Fixes

* **commands:** update status command to summarize achievements ([ea7ae1a](https://github.com/turalnovruzov/codery/commit/ea7ae1a0e735f0f5191c3896ecbce3573dce46a3))


### Features

* **commands:** namespace commands under codery to prevent conflicts ([fb3ac80](https://github.com/turalnovruzov/codery/commit/fb3ac8029e2825f8852d136a792f9188515781e0))
* **commands:** replace text commands with slash commands ([8753546](https://github.com/turalnovruzov/codery/commit/87535469cac8151c73d7e2f13de96f76257c99d6))


### BREAKING CHANGES

* **commands:** Text commands (START, STATUS, etc.) are replaced
with slash commands (/start, /status, etc.). Users must use the new
slash command syntax after running 'codery build'.

## [3.0.1](https://github.com/turalnovruzov/codery/compare/v3.0.0...v3.0.1) (2025-07-30)


### Bug Fixes

* **docs:** restore critical content to prevent Codery ambiguities ([538ee0b](https://github.com/turalnovruzov/codery/commit/538ee0bc96159b51f4a5f40a717be9098d4cd872))


### Reverts

* restore Commands.md, JIRA_Workflow.md, and Roles.md to main branch versions ([4097f73](https://github.com/turalnovruzov/codery/commit/4097f7346730f53a01ba504ca5005c543ecce1a4))

# [3.0.0](https://github.com/turalnovruzov/codery/compare/v2.0.0...v3.0.0) (2025-07-29)


### Code Refactoring

* **templates:** remove context-dependent subagents ([04f3d22](https://github.com/turalnovruzov/codery/commit/04f3d22fbb5894fd5395af53c7dac13d9de6ab37))


### Features

* **templates:** improve subagent effectiveness ([49a3ff9](https://github.com/turalnovruzov/codery/commit/49a3ff95d86aebca08254ac3f49fdb9c25f1e020))


### BREAKING CHANGES

* **templates:** The following subagents are no longer available:
architect, crk, introspection, package, poc. Projects using these
subagents will need to handle these tasks in the main agent context.

# [2.0.0](https://github.com/turalnovruzov/codery/compare/v1.6.0...v2.0.0) (2025-07-29)


### Bug Fixes

* **build:** exclude Retrospective.md from CLAUDE.md generation ([2958a4d](https://github.com/turalnovruzov/codery/commit/2958a4de77ad60cd11a7924d6c3e1df618fa5841))


### Features

* **templates:** complete role and subagent integration restructuring ([7d56643](https://github.com/turalnovruzov/codery/commit/7d56643e8b7948b21e0f642457dc19859e01a621))
* **templates:** restore role-based system and integrate with subagents ([c5e9592](https://github.com/turalnovruzov/codery/commit/c5e9592e8a5d0fb49d15098c3a2c8e5418ca2d0d)), closes [#17](https://github.com/turalnovruzov/codery/issues/17)


### BREAKING CHANGES

* **templates:** Subagents.md removed. Projects using direct references to this file
will need to update to use Roles.md and SubagentWorkflow.md instead.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

# [1.6.0](https://github.com/turalnovruzov/codery/compare/v1.5.0...v1.6.0) (2025-07-29)


### Bug Fixes

* **retrospective:** add critical error handling and file creation ([b03ae23](https://github.com/turalnovruzov/codery/commit/b03ae2382e6faa7701308d5c6a36619fb03f2411))


### Features

* modernize retrospective system with persistent learning ([6cd95f2](https://github.com/turalnovruzov/codery/commit/6cd95f29270bdfd0049a2b9856908879a1427178))

# [1.5.0](https://github.com/turalnovruzov/codery/compare/v1.4.0...v1.5.0) (2025-07-29)


### Features

* **templates:** add branch creation requirements to Trunk-Based workflow ([7cb4f5e](https://github.com/turalnovruzov/codery/commit/7cb4f5eeef544b9329595156a91103fb5d1e3a2b))

# [1.4.0](https://github.com/turalnovruzov/codery/compare/v1.3.0...v1.4.0) (2025-07-29)


### Bug Fixes

* prevent automatic subagent handoff without user approval ([adb1aa8](https://github.com/turalnovruzov/codery/commit/adb1aa888c6ea515fe5cc089b0838019605d1c4b))


### Features

* **subagents:** convert remaining 8 subagents to clean specialist format ([2258341](https://github.com/turalnovruzov/codery/commit/225834191db57f8c5d03ace37d3769dee529e7f3))

# [1.3.0](https://github.com/turalnovruzov/codery/compare/v1.2.0...v1.3.0) (2025-07-28)


### Features

* **commands:** enhance STATUS command to fetch and display JIRA comments ([637adb7](https://github.com/turalnovruzov/codery/commit/637adb7bf10170947748a14d4f66c54482951c04))

# [1.2.0](https://github.com/turalnovruzov/codery/compare/v1.1.0...v1.2.0) (2025-07-28)


### Features

* **docs:** add explicit Codery behavioral instructions to Git Flow ([858ca49](https://github.com/turalnovruzov/codery/commit/858ca492c5ef8604ef620b465d74cd8e2e37b1fb))
* **docs:** reduce GitFlow branch creation instructions to essential requirement ([1dba4d3](https://github.com/turalnovruzov/codery/commit/1dba4d3133b93cf9f280cfef6f7ef67b25d9ff81))

# [1.1.0](https://github.com/turalnovruzov/codery/compare/v1.0.0...v1.1.0) (2025-07-28)


### Bug Fixes

* update documentation to use subagent terminology ([5f5ac56](https://github.com/turalnovruzov/codery/commit/5f5ac564ae9e94f70c5d7bcbd1dfe9b664f85de4))


### Features

* add subagent configurations for all Codery roles ([2f28b57](https://github.com/turalnovruzov/codery/commit/2f28b5792105a0a7f0d383e1012bdd12d43814cc))
* implement subagent copying in buildDocs.ts ([193a9c4](https://github.com/turalnovruzov/codery/commit/193a9c4699337c7e6d91025b54760eb426a35ec6))
* replace role-based terminology with subagent references ([fb2c856](https://github.com/turalnovruzov/codery/commit/fb2c856563cd40984b2061f982706f991d224c9d))

# 1.0.0 (2025-07-25)


### Bug Fixes

* Add author information to package.json ([a5ac7f1](https://github.com/turalnovruzov/codery/commit/a5ac7f13999a18f6314d0eef0dd5d2c9b024aac8))
* Add missing dist/ directory to .gitignore ([6289a1b](https://github.com/turalnovruzov/codery/commit/6289a1b3df8abfe985b1937649ee5535398603f0))
* update Node.js version to 20.x for semantic-release compatibility ([69f8cfd](https://github.com/turalnovruzov/codery/commit/69f8cfd835cae807fe18acd646a51735acdeb828))
* Update package name to include scope ([2165388](https://github.com/turalnovruzov/codery/commit/21653885bf95b6f413d82a9b86dfc951c670a1ca))
* update version to 0.1.1 in package.json and package-lock.json ([3dd232b](https://github.com/turalnovruzov/codery/commit/3dd232ba96e54fd4ae343f5d553a4b3448fb8545))


### Features

* configure ESLint v9 with flat config and fix linting errors ([abf8081](https://github.com/turalnovruzov/codery/commit/abf8081c64b17a47bf212f305bf7d8fe1f826ad1))
* enhance STARTUP command to explicitly initialize Codery system ([2dae714](https://github.com/turalnovruzov/codery/commit/2dae71458becc51b0bf7042a505645c0efd7a21a))
* Implement CLI for AI Guild setup and documentation copying ([490fa34](https://github.com/turalnovruzov/codery/commit/490fa345a3d65c9226a8851fcea29872d23930cd))
* implement Semantic Release for automated versioning and publishing ([e311dd0](https://github.com/turalnovruzov/codery/commit/e311dd0543bfe53cc78245c1b2ce80daa24c7190))
* implement template system with codery init command ([76c967b](https://github.com/turalnovruzov/codery/commit/76c967bad74016e4b43ee49fabae4ea485496072))
* rename project from AI Guild to Codery ([5393ada](https://github.com/turalnovruzov/codery/commit/5393adaa0d14af74d4a1b402e94625650f9c63ce))
* replace setup command with build command ([19ae656](https://github.com/turalnovruzov/codery/commit/19ae6560ef5e0798e3f526e1101a0bdaeb5213a7))


### BREAKING CHANGES

* First release will bump version from 0.1.0 to 1.0.0.
All future commits must follow conventional commit format.

COD-7
* This is a complete rebrand. The package name, CLI command,
and all directory structures have changed. Users of the previous @hdts/guild
package should migrate to @hdts/codery.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
