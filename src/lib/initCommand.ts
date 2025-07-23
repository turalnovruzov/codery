import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { defaultConfig } from '../types/config';

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

    // Write default config
    const configContent = JSON.stringify(defaultConfig, null, 2);
    fs.writeFileSync(configPath, configContent, 'utf-8');
    console.log(chalk.green('✓'), 'Created config.json with template values');

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
    console.log('Next steps:');
    console.log('  1. Edit .codery/config.json with your project values:');
    console.log(chalk.cyan('     - cloudId: Your Atlassian URL (e.g., https://mycompany.atlassian.net)'));
    console.log(chalk.cyan('     - projectKey: Your JIRA project key (e.g., PROJ)'));
    console.log();
    console.log('  2. Run', chalk.yellow('codery build'), 'to generate your customized CLAUDE.md');
    console.log();
    console.log(chalk.dim('Note: The Atlassian MCP will automatically convert your URL to the correct Cloud ID.'));
  } catch (error: any) {
    console.error(chalk.red('Init failed:'), error.message);
    throw error;
  }
}
