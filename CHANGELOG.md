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
