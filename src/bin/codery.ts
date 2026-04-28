#!/usr/bin/env node

// v9.0.0 — Deprecation shim. Codery has moved to a Claude Code plugin. Every
// command in this binary prints the migration message and exits 0. The package
// stays on npm during the deprecation window so the team has time to migrate;
// see COD-63 for the full migration epic.

import chalk from 'chalk';

const message = [
  '',
  chalk.yellow.bold('Codery has moved to a Claude Code plugin.'),
  '',
  'This npm package (v9.x) is deprecated. The Codery methodology and skills',
  'are now distributed as a native Claude Code plugin.',
  '',
  chalk.bold('To migrate:'),
  '  1. Open Claude Code in your project.',
  '  2. /plugin marketplace add turalnovruzov/codery-plugin',
  '  3. /plugin install codery@codery-plugin',
  '  4. /codery:setup',
  '',
  chalk.bold('Documentation:'),
  '  https://github.com/turalnovruzov/codery-plugin',
  '',
  chalk.dim('The npm package will remain on the registry through the deprecation window.'),
  chalk.dim('Once the team has migrated, the package will be archived and unpublished.'),
  '',
].join('\n');

console.log(message);
process.exit(0);
