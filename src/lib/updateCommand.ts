import { spawn } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  listProjects,
  removeProject,
  projectExists,
  hasCoderyConfig,
  RegisteredProject,
} from './registry';
import { buildCommand } from './buildDocs';

interface UpdateOptions {
  yes?: boolean;
}

interface UpdateResult {
  path: string;
  status: 'success' | 'failed' | 'not-found' | 'removed';
  error?: string;
}

/**
 * Run npm update -g codery
 */
async function updateNpmPackage(): Promise<{ success: boolean; version?: string; error?: string }> {
  return new Promise(resolve => {
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(npmCmd, ['update', '-g', 'codery'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', data => {
      stdout += data.toString();
    });

    child.stderr?.on('data', data => {
      stderr += data.toString();
    });

    child.on('close', code => {
      if (code === 0) {
        // Try to extract version from output
        const versionMatch = stdout.match(/codery@(\d+\.\d+\.\d+)/);
        resolve({
          success: true,
          version: versionMatch ? versionMatch[1] : undefined,
        });
      } else {
        resolve({
          success: false,
          error: stderr || 'npm update failed',
        });
      }
    });

    child.on('error', err => {
      resolve({
        success: false,
        error: err.message,
      });
    });
  });
}

/**
 * Build a single project
 */
async function buildProject(projectPath: string): Promise<{ success: boolean; error?: string }> {
  const originalCwd = process.cwd();

  try {
    process.chdir(projectPath);
    await buildCommand({ output: undefined, dryRun: false, skipConfig: false, force: true });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  } finally {
    process.chdir(originalCwd);
  }
}

export async function updateCommand(options: UpdateOptions = {}): Promise<void> {
  console.log(chalk.blue('🔄 Codery Update'));
  console.log();

  // Step 1: Update npm package
  console.log('Updating Codery package...');
  const npmResult = await updateNpmPackage();

  if (npmResult.success) {
    if (npmResult.version) {
      console.log(chalk.green('✓'), `codery@${npmResult.version}`);
    } else {
      console.log(chalk.green('✓'), 'Codery updated');
    }
  } else {
    console.log(chalk.yellow('⚠'), `npm update issue: ${npmResult.error}`);
    console.log(chalk.dim('  Continuing with project builds...'));
  }
  console.log();

  // Step 2: Get registered projects
  const projects = listProjects();

  if (projects.length === 0) {
    console.log(chalk.yellow('No projects registered.'));
    console.log(chalk.dim('Run `codery init` in a project or `codery register` to add projects.'));
    return;
  }

  console.log(`Rebuilding ${projects.length} project(s)...`);
  console.log();

  // Step 3: Process each project
  const results: UpdateResult[] = [];
  const toRemove: RegisteredProject[] = [];

  for (const project of projects) {
    // Check if path exists
    if (!projectExists(project.path)) {
      toRemove.push(project);
      continue;
    }

    // Check if it has Codery config
    if (!hasCoderyConfig(project.path)) {
      console.log(chalk.red('  ✗'), chalk.dim(project.path), chalk.red('(no config)'));
      results.push({ path: project.path, status: 'failed', error: 'No .codery/config.json found' });
      continue;
    }

    // Build the project
    const buildResult = await buildProject(project.path);

    if (buildResult.success) {
      console.log(chalk.green('  ✓'), project.path);
      results.push({ path: project.path, status: 'success' });
    } else {
      console.log(chalk.red('  ✗'), project.path, chalk.red(`(${buildResult.error})`));
      results.push({ path: project.path, status: 'failed', error: buildResult.error });
    }
  }

  // Step 4: Handle missing projects
  if (toRemove.length > 0) {
    console.log();
    for (const project of toRemove) {
      let shouldRemove = options.yes;

      if (!options.yes) {
        const answer = await inquirer.prompt<{ shouldRemove: boolean }>([
          {
            type: 'confirm',
            name: 'shouldRemove',
            message: `Project not found: ${project.path}. Remove from registry?`,
            default: true,
          },
        ]);
        shouldRemove = answer.shouldRemove;
      }

      if (shouldRemove) {
        removeProject(project.path);
        console.log(chalk.yellow('  ?'), project.path, chalk.dim('(removed from registry)'));
        results.push({ path: project.path, status: 'removed' });
      } else {
        results.push({ path: project.path, status: 'not-found' });
      }
    }
  }

  // Step 5: Print summary
  console.log();
  const succeeded = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const removed = results.filter(r => r.status === 'removed').length;
  const notFound = results.filter(r => r.status === 'not-found').length;

  const parts: string[] = [];
  if (succeeded > 0) parts.push(chalk.green(`${succeeded} updated`));
  if (failed > 0) parts.push(chalk.red(`${failed} failed`));
  if (removed > 0) parts.push(chalk.yellow(`${removed} removed`));
  if (notFound > 0) parts.push(chalk.dim(`${notFound} not found`));

  console.log(`Summary: ${parts.join(', ')}`);

  // Exit with error code if any failed
  if (failed > 0) {
    process.exit(1);
  }
}
