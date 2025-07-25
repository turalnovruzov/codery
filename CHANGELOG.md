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
