import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { CoderyConfig } from '../types/config';

interface BuildOptions {
  output?: string;
  dryRun?: boolean;
  skipConfig?: boolean;
  force?: boolean;
  quiet?: boolean;
}

// Get the package root directory
const packageRoot = path.resolve(__dirname, '../..');

// Load configuration from .codery/config.json
function loadConfig(): CoderyConfig | null {
  const configPath = path.join(process.cwd(), '.codery', 'config.json');

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent) as CoderyConfig;
  } catch (_error) {
    console.warn(chalk.yellow('Warning: Failed to parse .codery/config.json'));
    return null;
  }
}

// Perform template variable substitution
function substituteTemplates(
  content: string,
  config: CoderyConfig
): { content: string; unsubstituted: string[] } {
  const unsubstituted: string[] = [];
  const templateRegex = /\{\{(\w+(?:\.\w+)*)\}\}/g;

  const substitutedContent = content.replace(templateRegex, (match, variable) => {
    // Skip the applicationDocsImports placeholder — handled separately
    if (variable === 'applicationDocsImports') {
      return match;
    }

    // Handle nested properties like customValues.teamName
    const value = variable.split('.').reduce((obj: any, key: string) => {
      return obj?.[key];
    }, config);

    if (value !== undefined && value !== null) {
      return String(value);
    } else {
      if (!unsubstituted.includes(variable)) {
        unsubstituted.push(variable);
      }
      return match; // Keep original if not found
    }
  });

  return { content: substitutedContent, unsubstituted };
}

// Generate @import lines for applicationDocs
function generateAppDocsImports(config: CoderyConfig): string {
  if (!config.applicationDocs || config.applicationDocs.length === 0) {
    return '';
  }

  return config.applicationDocs
    .map(docPath => `@${docPath}`)
    .join('\n');
}

// Get the appropriate JIRA reference source file based on config
function getJiraReferenceSource(config: CoderyConfig | null): string {
  const integrationType = config?.jiraIntegrationType || 'mcp';
  const fileMap: Record<string, string> = {
    'mcp': 'jira-reference-mcp.md',
    'cli': 'jira-reference-cli.md'
  };
  return fileMap[integrationType];
}

// Get the appropriate git workflow source file based on config
function getGitWorkflowSource(config: CoderyConfig | null): string {
  const workflowType = config?.gitWorkflowType || 'gitflow';
  const fileMap: Record<string, string> = {
    'gitflow': 'GitWorkflows/GitFlow.md',
    'trunk-based': 'GitWorkflows/TrunkBased.md'
  };
  return fileMap[workflowType];
}

// Copy reference files to .codery/ directory with substitution
function copyReferenceFiles(
  config: CoderyConfig | null,
  dryRun: boolean = false,
  quiet: boolean = false
): boolean {
  const log = (...args: unknown[]) => { if (!quiet) console.log(...args); };
  const coderyDir = path.join(process.cwd(), '.codery');
  const sourceDir = path.join(packageRoot, 'codery-docs/.codery');

  try {
    if (!fs.existsSync(coderyDir)) {
      fs.mkdirSync(coderyDir, { recursive: true });
    }

    // Copy JIRA reference
    const jiraSource = path.join(sourceDir, getJiraReferenceSource(config));
    const refsDir = path.join(coderyDir, 'refs');
    if (!fs.existsSync(refsDir)) {
      fs.mkdirSync(refsDir, { recursive: true });
    }

    const jiraTarget = path.join(refsDir, 'jira-reference.md');

    if (fs.existsSync(jiraSource)) {
      if (dryRun) {
        log(`Would copy ${getJiraReferenceSource(config)} → .codery/jira-reference.md`);
      } else {
        let content = fs.readFileSync(jiraSource, 'utf-8');
        if (config) {
          const result = substituteTemplates(content, config);
          content = result.content;
        }
        fs.writeFileSync(jiraTarget, content, 'utf-8');
        log(`  ✓ jira-reference.md`);
      }
    }

    // Copy git workflow
    const gitSource = path.join(sourceDir, getGitWorkflowSource(config));
    const gitTarget = path.join(refsDir, 'git-workflow.md');

    if (fs.existsSync(gitSource)) {
      if (dryRun) {
        log(`Would copy ${getGitWorkflowSource(config)} → .codery/git-workflow.md`);
      } else {
        let content = fs.readFileSync(gitSource, 'utf-8');
        if (config) {
          const result = substituteTemplates(content, config);
          content = result.content;
        }
        fs.writeFileSync(gitTarget, content, 'utf-8');
        log(`  ✓ git-workflow.md`);
      }
    }

    // Copy PR conventions
    const prSource = path.join(sourceDir, 'pr-conventions.md');
    const prTarget = path.join(refsDir, 'pr-conventions.md');

    if (fs.existsSync(prSource)) {
      if (dryRun) {
        log(`Would copy pr-conventions.md → .codery/refs/pr-conventions.md`);
      } else {
        let content = fs.readFileSync(prSource, 'utf-8');
        if (config) {
          const result = substituteTemplates(content, config);
          content = result.content;
        }
        fs.writeFileSync(prTarget, content, 'utf-8');
        log(`  ✓ pr-conventions.md`);
      }
    }

    return true;
  } catch (error: any) {
    log(chalk.red(`  ❌ Failed to copy reference files: ${error.message}`));
    return false;
  }
}

// Copy skill files to .claude/skills/ directory with substitution
function copySkillFiles(
  config: CoderyConfig | null,
  dryRun: boolean = false,
  quiet: boolean = false
): boolean {
  const log = (...args: unknown[]) => { if (!quiet) console.log(...args); };
  const sourceDir = path.join(packageRoot, 'codery-docs/.codery/skills');
  const targetDir = path.join(process.cwd(), '.claude/skills');

  if (!fs.existsSync(sourceDir)) {
    log(chalk.yellow('  ⚠️  No skill files found in package'));
    return false;
  }

  try {
    // Get all skill directories
    const skillDirs = fs.readdirSync(sourceDir)
      .filter(item => fs.statSync(path.join(sourceDir, item)).isDirectory());

    if (skillDirs.length === 0) {
      return false;
    }

    if (dryRun) {
      log(`Would copy ${skillDirs.length} skills to ${targetDir}`);
      skillDirs.forEach(dir => log(`  - ${dir}/SKILL.md`));
      return true;
    }

    log(`Copying ${skillDirs.length} skills...`);

    for (const skillDir of skillDirs) {
      const sourcePath = path.join(sourceDir, skillDir, 'SKILL.md');
      const targetSkillDir = path.join(targetDir, skillDir);
      const targetPath = path.join(targetSkillDir, 'SKILL.md');

      if (!fs.existsSync(sourcePath)) {
        continue;
      }

      // Create skill directory
      if (!fs.existsSync(targetSkillDir)) {
        fs.mkdirSync(targetSkillDir, { recursive: true });
      }

      // Read, substitute, write
      let content = fs.readFileSync(sourcePath, 'utf-8');
      if (config) {
        const result = substituteTemplates(content, config);
        content = result.content;

        if (result.unsubstituted.length > 0) {
          log(chalk.yellow(`  ⚠️  Unsubstituted in ${skillDir}: ${result.unsubstituted.join(', ')}`));
        }
      }

      fs.writeFileSync(targetPath, content, 'utf-8');
      log(`  ✓ ${skillDir}/SKILL.md`);
    }

    return true;
  } catch (error: any) {
    log(chalk.red(`  ❌ Failed to copy skills: ${error.message}`));
    return false;
  }
}

// Main build command
export async function buildCommand(options: BuildOptions): Promise<void> {
  const log = (...args: unknown[]) => {
    if (!options.quiet) {
      console.log(...args);
    }
  };

  log(chalk.blue('🏰 Codery Build'));
  log();

  try {
    // Load configuration
    let config: CoderyConfig | null = null;

    if (!options.skipConfig) {
      config = loadConfig();
      if (!config) {
        log(chalk.yellow('⚠️  No configuration found. Run "codery init" to create one.'));
        log(chalk.dim('   Building without template substitution...'));
        log();
      }
    }

    // Read the CLAUDE.md template
    const templatePath = path.join(packageRoot, 'codery-docs/.codery/claude-md-template.md');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    let claudeContent = fs.readFileSync(templatePath, 'utf-8');

    // Inject applicationDocs @imports
    if (config) {
      const appDocsImports = generateAppDocsImports(config);
      claudeContent = claudeContent.replace('{{applicationDocsImports}}', appDocsImports);
    } else {
      claudeContent = claudeContent.replace('{{applicationDocsImports}}', '');
    }

    // Apply template variable substitution
    let allUnsubstituted: string[] = [];
    if (config && !options.skipConfig) {
      log('Applying template substitution...');
      const result = substituteTemplates(claudeContent, config);
      claudeContent = result.content;
      allUnsubstituted = result.unsubstituted;

      if (allUnsubstituted.length > 0) {
        log(chalk.yellow(`⚠️  Unsubstituted variables: ${[...new Set(allUnsubstituted)].join(', ')}`));
      }
      log();
    }

    // Determine output path
    const outputPath = path.resolve(process.cwd(), options.output || 'CLAUDE.md');

    // Dry run mode
    if (options.dryRun) {
      log(chalk.yellow('DRY RUN MODE - No files will be created'));
      log();
      log(`Would create: ${outputPath}`);
      log(`File size: ~${Math.round(claudeContent.length / 1024)}KB`);
      log();
      copyReferenceFiles(config, true, options.quiet);
      copySkillFiles(config, true, options.quiet);
      return;
    }

    // Check if file exists and prompt for confirmation (unless --force)
    if (fs.existsSync(outputPath) && !options.force) {
      log(chalk.yellow(`⚠️  File already exists: ${outputPath}`));
      log();

      const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Do you want to overwrite the existing CLAUDE.md file?',
          default: false,
        },
      ]);

      if (!confirm) {
        log(chalk.red('Build cancelled.'));
        process.exit(0);
      }
    }

    // Write CLAUDE.md
    fs.writeFileSync(outputPath, claudeContent, 'utf-8');

    log(chalk.green('✨ Codery build complete!'));
    log();
    log(`Created: ${outputPath}`);
    log(`Size: ~${Math.round(claudeContent.length / 1024)}KB`);

    // Copy reference files to .codery/
    log();
    log('Copying reference files...');
    copyReferenceFiles(config, false, options.quiet);

    // Copy skills to .claude/skills/
    log();
    copySkillFiles(config, false, options.quiet);

    log();
    log('Next steps:');
    log('  1. Review the generated CLAUDE.md file');
    log('  2. Run', chalk.yellow('codery build'), 'after updating codery');
  } catch (error: any) {
    console.error(chalk.red('Build failed:'), error.message);
    throw error;
  }
}
