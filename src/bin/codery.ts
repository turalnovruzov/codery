#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { buildCommand } from '../lib/buildDocs';

const program = new Command();

program
  .name('codery')
  .description('Codery CLI - Build AI development workflows for your project')
  .version('0.1.0');

program
  .command('build')
  .description('Build a CLAUDE.md file from Codery documentation')
  .option('--output <path>', 'Output path for CLAUDE.md file (default: ./CLAUDE.md)')
  .option('--dry-run', 'Show what would be built without creating the file')
  .action(async options => {
    try {
      await buildCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no command is provided
if (program.args.length === 0) {
  program.help();
}
