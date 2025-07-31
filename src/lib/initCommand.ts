import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { defaultConfig, CoderyConfig } from '../types/config';

interface InitOptions {
  force?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.blue('🏰 Codery Init'));
  console.log();

  const coderyDir = path.join(process.cwd(), '.codery');
  const configPath = path.join(coderyDir, 'config.json');

  // Check if config already exists
  if (fs.existsSync(configPath) && !options.force) {
    console.log(chalk.yellow('⚠️  Configuration file already exists: .codery/config.json'));
    console.log();

    const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to overwrite the existing configuration?',
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.red('Init cancelled.'));
      process.exit(0);
    }
  }

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
        default: 'gitflow'
      },
      {
        type: 'list',
        name: 'jiraIntegrationType',
        message: 'Select your JIRA integration method:',
        choices: [
          { name: 'MCP - Model Context Protocol (default)', value: 'mcp' },
          { name: 'CLI - JIRA Command Line Interface', value: 'cli' }
        ],
        default: 'mcp'
      },
      {
        type: 'input',
        name: 'cloudId',
        message: 'Enter your Atlassian instance URL:',
        default: defaultConfig.cloudId,
        validate: (input: string) => {
          if (input.startsWith('https://') && input.includes('.atlassian.net')) {
            return true;
          }
          return 'Please enter a valid Atlassian URL (e.g., https://mycompany.atlassian.net)';
        },
        when: (currentAnswers) => currentAnswers.jiraIntegrationType === 'mcp'
      },
      {
        type: 'input',
        name: 'projectKey',
        message: 'Enter your JIRA project key:',
        default: defaultConfig.projectKey,
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
        default: defaultConfig.mainBranch || 'main'
      },
      {
        type: 'input',
        name: 'developBranch',
        message: 'Enter your development branch name:',
        default: defaultConfig.developBranch || 'develop',
        when: (currentAnswers) => currentAnswers.gitWorkflowType === 'gitflow'
      }
    ]);

    // Build config object
    const config: CoderyConfig = {
      projectKey: answers.projectKey,
      mainBranch: answers.mainBranch,
      gitWorkflowType: answers.gitWorkflowType,
      jiraIntegrationType: answers.jiraIntegrationType
    };

    // Only add cloudId for MCP integration
    if (answers.jiraIntegrationType === 'mcp') {
      config.cloudId = answers.cloudId;
    }

    // Only add developBranch for gitflow
    if (answers.gitWorkflowType === 'gitflow') {
      config.developBranch = answers.developBranch;
    }

    // Write config
    const configContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath, configContent, 'utf-8');
    console.log();
    console.log(chalk.green('✓'), 'Created config.json with your project settings');

    // Add to .gitignore if it exists
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      if (!gitignoreContent.includes('.codery/config.json')) {
        const updatedContent =
          gitignoreContent.trimEnd() + '\n\n# Codery configuration\n.codery/config.json\n';
        fs.writeFileSync(gitignorePath, updatedContent, 'utf-8');
        console.log(chalk.green('✓'), 'Added .codery/config.json to .gitignore');
      }
    }

    console.log();
    console.log(chalk.green('✨ Codery initialization complete!'));
    console.log();
    console.log('Configuration summary:');
    console.log(`  - Git Workflow: ${chalk.cyan(config.gitWorkflowType === 'gitflow' ? 'Git Flow' : 'Trunk-Based Development')}`);
    console.log(`  - JIRA Integration: ${chalk.cyan(config.jiraIntegrationType === 'mcp' ? 'MCP (Model Context Protocol)' : 'CLI (Command Line Interface)')}`);
    if (config.cloudId) {
      console.log(`  - Atlassian URL: ${chalk.cyan(config.cloudId)}`);
    }
    console.log(`  - Project Key: ${chalk.cyan(config.projectKey)}`);
    console.log(`  - Main Branch: ${chalk.cyan(config.mainBranch)}`);
    if (config.developBranch) {
      console.log(`  - Develop Branch: ${chalk.cyan(config.developBranch)}`);
    }
    console.log();
    console.log('Next steps:');
    console.log('  1. Review .codery/config.json and adjust if needed');
    console.log('  2. Run', chalk.yellow('codery build'), 'to generate your customized CLAUDE.md');
    console.log();
    if (config.jiraIntegrationType === 'mcp') {
      console.log(chalk.dim('Note: The Atlassian MCP will automatically convert your URL to the correct Cloud ID.'));
    } else {
      console.log(chalk.dim('Note: Make sure JIRA CLI is installed and configured with your API token.'));
    }
  } catch (error: any) {
    console.error(chalk.red('Init failed:'), error.message);
    throw error;
  }
}
