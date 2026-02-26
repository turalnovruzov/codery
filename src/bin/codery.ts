#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { buildCommand } from '../lib/buildDocs';
import { initCommand } from '../lib/initCommand';
import { updateCommand } from '../lib/updateCommand';
import {
  addProject,
  removeProject,
  listProjects,
  projectExists,
} from '../lib/registry';

const program = new Command();

program
  .name('codery')
  .description('Codery CLI - Build AI development workflows for your project')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize Codery configuration in your project')
  .option('--force', 'Overwrite existing configuration without prompting')
  .action(async options => {
    try {
      await initCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build a CLAUDE.md file from Codery documentation')
  .option('--output <path>', 'Output path for CLAUDE.md file (default: ./CLAUDE.md)')
  .option('--dry-run', 'Show what would be built without creating the file')
  .option('--skip-config', 'Build without template substitution')
  .option('--force', 'Overwrite existing files without prompting')
  .action(async options => {
    try {
      await buildCommand(options);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update Codery and rebuild all registered projects')
  .action(async () => {
    try {
      await updateCommand();
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('register [path]')
  .description('Register a project for updates (defaults to current directory)')
  .action((projectPath?: string) => {
    try {
      const targetPath = projectPath || process.cwd();
      const added = addProject(targetPath);

      if (added) {
        console.log(chalk.green('✓'), `Registered: ${targetPath}`);
      } else {
        console.log(chalk.dim('Already registered:'), targetPath);
      }
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('unregister [path]')
  .description('Remove a project from the registry (defaults to current directory)')
  .action((projectPath?: string) => {
    try {
      const targetPath = projectPath || process.cwd();
      const removed = removeProject(targetPath);

      if (removed) {
        console.log(chalk.green('✓'), `Unregistered: ${targetPath}`);
      } else {
        console.log(chalk.yellow('Not found in registry:'), targetPath);
      }
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all registered Codery projects')
  .action(() => {
    try {
      const projects = listProjects();

      if (projects.length === 0) {
        console.log(chalk.yellow('No projects registered.'));
        console.log(chalk.dim('Run `codery init` in a project or `codery register` to add projects.'));
        return;
      }

      console.log('Registered Codery projects:');
      console.log();

      projects.forEach((project, index) => {
        const exists = projectExists(project.path);
        const status = exists ? '' : chalk.red(' (not found)');
        console.log(`  ${index + 1}. ${project.path}${status}`);
      });

      console.log();
      console.log(`${projects.length} project(s) registered`);
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
