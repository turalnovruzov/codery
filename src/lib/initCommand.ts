import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { defaultConfig, CoderyConfig } from '../types/config';
import { addProject } from './registry';

interface InitOptions {
  force?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.blue('🏰 Codery Init'));
  console.log();

  const coderyDir = path.join(process.cwd(), '.codery');
  const configPath = path.join(coderyDir, 'config.json');

  // Read existing config if present
  let existingConfig: Partial<CoderyConfig> = {};
  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      existingConfig = JSON.parse(configContent);
      console.log(chalk.dim('Found existing configuration'));
    } catch (_error) {
      console.log(chalk.yellow('⚠️  Could not parse existing config, will use defaults'));
    }
  }

  // Check if config already exists (for overwrite prompt)
  if (fs.existsSync(configPath) && !options.force) {
    console.log(chalk.yellow('⚠️  Configuration file already exists: .codery/config.json'));
    console.log();

    const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to update the existing configuration?',
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.red('Init cancelled.'));
      process.exit(0);
    }
  }

  // Merge existing config with defaults for prompt defaults
  const currentValues = { ...defaultConfig, ...existingConfig };

  try {
    // Create .codery directory if it doesn't exist
    if (!fs.existsSync(coderyDir)) {
      fs.mkdirSync(coderyDir, { recursive: true });
      console.log(chalk.green('✓'), 'Created .codery directory');
    }

    // Prompt for configuration values
    console.log('Let\'s configure your project:');
    console.log();

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'gitWorkflowType',
        message: 'Select your Git workflow type:',
        choices: [
          { name: 'Git Flow (feature branches, develop/main)', value: 'gitflow' },
          { name: 'Trunk-Based (direct commits to main)', value: 'trunk-based' }
        ],
        default: currentValues.gitWorkflowType || 'gitflow'
      },
      {
        type: 'input',
        name: 'projectKey',
        message: 'Enter your JIRA project key:',
        default: currentValues.projectKey,
        validate: (input: string) => {
          if (input.match(/^[A-Z][A-Z0-9]*$/)) {
            return true;
          }
          return 'Project key must be uppercase letters and numbers (e.g., PROJ, MVP, ACME)';
        }
      },
      {
        type: 'input',
        name: 'mainBranch',
        message: 'Enter your main/production branch name:',
        default: currentValues.mainBranch || 'main'
      },
      {
        type: 'input',
        name: 'developBranch',
        message: 'Enter your development branch name:',
        default: currentValues.developBranch || 'develop',
        when: (currentAnswers) => currentAnswers.gitWorkflowType === 'gitflow'
      }
    ]);

    // Build config object — preserve existing fields and merge with new answers.
    // Strip legacy MCP-related fields (removed in v8.0.0) so they don't persist on re-init.
    const { cloudId: _cloudId, jiraIntegrationType: _jiraIntegrationType, ...preservedConfig } =
      existingConfig as CoderyConfig & { cloudId?: string; jiraIntegrationType?: string };
    const config: CoderyConfig = {
      ...preservedConfig,
      projectKey: answers.projectKey,
      mainBranch: answers.mainBranch,
      gitWorkflowType: answers.gitWorkflowType,
      // Preserve applicationDocs if it exists, otherwise initialize as empty
      applicationDocs: existingConfig.applicationDocs || []
    };

    // Only add developBranch for gitflow
    if (answers.gitWorkflowType === 'gitflow') {
      config.developBranch = answers.developBranch;
    } else {
      // Remove developBranch if switching from gitflow to trunk-based
      delete config.developBranch;
    }

    // Write config
    const configContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath, configContent, 'utf-8');
    console.log();
    console.log(chalk.green('✓'), 'Created config.json with your project settings');

    // Add generated files to .gitignore (but NOT config.json - it should be tracked)
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      const entriesToAdd: string[] = [];

      // Generated files that should be ignored (like node_modules)
      const generatedFiles = [
        'CLAUDE.md',
        '.claude/',
        '.codery/refs/',
      ];

      for (const entry of generatedFiles) {
        if (!gitignoreContent.includes(entry)) {
          entriesToAdd.push(entry);
        }
      }

      if (entriesToAdd.length > 0) {
        const updatedContent =
          gitignoreContent.trimEnd() +
          '\n\n# Codery generated files (like node_modules - regenerate with: codery build)\n' +
          entriesToAdd.join('\n') +
          '\n';
        fs.writeFileSync(gitignorePath, updatedContent, 'utf-8');
        console.log(chalk.green('✓'), `Added ${entriesToAdd.length} Codery generated file(s) to .gitignore`);
      }
    }

    // Register project for updates
    const wasAdded = addProject(process.cwd());
    if (wasAdded) {
      console.log(chalk.green('✓'), 'Project registered for updates');
    }

    console.log();
    console.log(chalk.green('✨ Codery configuration updated!'));
    console.log();
    console.log('Configuration summary:');
    console.log(`  - Git Workflow: ${chalk.cyan(config.gitWorkflowType === 'gitflow' ? 'Git Flow' : 'Trunk-Based Development')}`);
    console.log(`  - Project Key: ${chalk.cyan(config.projectKey)}`);
    console.log(`  - Main Branch: ${chalk.cyan(config.mainBranch)}`);
    if (config.developBranch) {
      console.log(`  - Develop Branch: ${chalk.cyan(config.developBranch)}`);
    }
    if (config.applicationDocs && config.applicationDocs.length > 0) {
      console.log(`  - Application Docs: ${chalk.cyan(`${config.applicationDocs.length} path(s) preserved`)}`);
    }
    console.log();
    console.log('Next steps:');
    console.log('  1. Review .codery/config.json and adjust if needed');
    console.log('  2. Run', chalk.yellow('codery build'), 'to generate your customized CLAUDE.md');
    console.log();
    console.log(chalk.dim('Note: Make sure JIRA CLI is installed and configured with your API token.'));
  } catch (error: any) {
    console.error(chalk.red('Init failed:'), error.message);
    throw error;
  }
}
