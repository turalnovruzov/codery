import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { CoderyConfig } from '../types/config';

interface BuildOptions {
  output?: string;
  dryRun?: boolean;
  skipConfig?: boolean;
}

interface MarkdownFile {
  name: string;
  path: string;
  content: string;
}

// Get the package root directory
const packageRoot = path.resolve(__dirname, '../..');

// Define the order of files to merge (customize as needed)
const fileOrder = [
  'Roles.md',
  '', // Placeholder for workflow file
  'JIRA_Workflow.md',
  'Commands.md',
  'LifeCycles.md',
  'SuccessCriteria.md',
];

// Get the appropriate workflow file based on config
function getWorkflowFile(config: CoderyConfig | null): string {
  const workflowType = config?.gitWorkflowType || 'gitflow';
  const workflowMap: Record<string, string> = {
    'gitflow': 'GitWorkflows/GitFlow.md',
    'trunk-based': 'GitWorkflows/TrunkBased.md'
  };
  return workflowMap[workflowType];
}

// Read all markdown files from the .codery directory
function readMarkdownFiles(config: CoderyConfig | null): MarkdownFile[] {
  const coderyDir = path.join(packageRoot, 'codery-docs/.codery');
  const files: MarkdownFile[] = [];

  if (!fs.existsSync(coderyDir)) {
    throw new Error(`Codery documentation directory not found: ${coderyDir}`);
  }

  // Get the workflow file
  const workflowFile = getWorkflowFile(config);

  // Update fileOrder with the selected workflow file
  const updatedFileOrder = fileOrder.map(file => file === '' ? workflowFile : file);

  // Get all .md files from root directory (excluding subdirectories)
  const rootFiles = fs.readdirSync(coderyDir)
    .filter(file => {
      const filePath = path.join(coderyDir, file);
      return fs.statSync(filePath).isFile() && file.endsWith('.md');
    });

  // Build the complete file list
  const allFilesToRead: string[] = [];

  // Add files in the specified order
  updatedFileOrder.forEach(file => {
    if (file.includes('/')) {
      // It's a file in a subdirectory (like GitWorkflows/GitFlow.md)
      allFilesToRead.push(file);
    } else if (rootFiles.includes(file)) {
      // It's a root file
      allFilesToRead.push(file);
    }
  });

  // Add any remaining root files not in the order
  rootFiles.forEach(file => {
    if (!updatedFileOrder.includes(file)) {
      allFilesToRead.push(file);
    }
  });

  // Read each file
  allFilesToRead.forEach(filename => {
    const filePath = path.join(coderyDir, filename);
    
    // Check for backward compatibility - if GitWorkflows file doesn't exist, try old location
    if (!fs.existsSync(filePath) && filename.includes('GitWorkflows/GitFlow.md')) {
      const oldPath = path.join(coderyDir, 'Git_Workflow.md');
      if (fs.existsSync(oldPath)) {
        console.log(chalk.yellow('⚠️  Using legacy Git_Workflow.md location. Run migration to update.'));
        const content = fs.readFileSync(oldPath, 'utf-8');
        files.push({
          name: 'Git_Workflow.md',
          path: oldPath,
          content: content.trim(),
        });
        return;
      }
    }

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const displayName = filename.includes('/') ? path.basename(filename) : filename;
      files.push({
        name: displayName,
        path: filePath,
        content: content.trim(),
      });
    }
  });

  return files;
}

// Merge markdown files into a single document
function mergeMarkdownFiles(files: MarkdownFile[]): string {
  const sections: string[] = [];

  // Add header
  sections.push('# CLAUDE.md');
  sections.push('');
  sections.push(
    'This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.'
  );
  sections.push('');
  sections.push('---');
  sections.push('');

  // Add each file as a section
  files.forEach((file, index) => {
    // Extract title from filename (remove .md extension)
    const sectionTitle = file.name.replace('.md', '').replace(/_/g, ' ');

    // Add section
    sections.push(`## ${sectionTitle}`);
    sections.push('');
    sections.push(file.content);
    sections.push('');

    // Add separator between sections (except for the last one)
    if (index < files.length - 1) {
      sections.push('---');
      sections.push('');
    }
  });

  return sections.join('\n');
}

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

// Build application documentation from user-specified files
async function buildApplicationDocs(config: CoderyConfig): Promise<boolean> {
  if (!config.applicationDocs || config.applicationDocs.length === 0) {
    return false;
  }

  const coderyDir = path.join(process.cwd(), '.codery');
  const outputPath = path.join(coderyDir, 'application-docs.md');
  const sections: string[] = [];

  // Add header
  sections.push('# Application Documentation');
  sections.push('');
  sections.push('_This file contains project-specific documentation aggregated from user-defined sources._');
  sections.push('');

  let hasValidFiles = false;

  // Process each documentation file
  for (const docPath of config.applicationDocs) {
    try {
      // Resolve the path relative to current working directory
      const resolvedPath = path.resolve(process.cwd(), docPath);
      
      // Check if file exists
      if (!fs.existsSync(resolvedPath)) {
        console.log(chalk.yellow(`  ⚠️  File not found: ${docPath}`));
        continue;
      }

      // Read the file content
      const content = fs.readFileSync(resolvedPath, 'utf-8');
      
      // Add section
      sections.push('---');
      sections.push('');
      sections.push(`## ${docPath}`);
      sections.push('');
      sections.push(content.trim());
      sections.push('');
      
      hasValidFiles = true;
    } catch (error: any) {
      console.log(chalk.yellow(`  ⚠️  Error reading ${docPath}: ${error.message}`));
    }
  }

  if (!hasValidFiles) {
    console.log(chalk.yellow('  No valid application documentation files found'));
    return false;
  }

  try {
    // Ensure .codery directory exists
    if (!fs.existsSync(coderyDir)) {
      fs.mkdirSync(coderyDir, { recursive: true });
    }

    // Write the merged documentation
    fs.writeFileSync(outputPath, sections.join('\n'), 'utf-8');
    return true;
  } catch (error: any) {
    console.log(chalk.red(`  ❌ Failed to write application docs: ${error.message}`));
    return false;
  }
}

// Copy subagent files to user's project
async function copySubagentFiles(config: CoderyConfig | null, dryRun: boolean = false): Promise<boolean> {
  const sourceDir = path.join(packageRoot, 'codery-docs/.codery/agents');
  const targetDir = path.join(process.cwd(), '.claude/agents');
  
  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.log(chalk.yellow('  ⚠️  No subagent files found in package'));
    return false;
  }
  
  try {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Get all .md files from agents directory
    const subagentFiles = fs.readdirSync(sourceDir)
      .filter(file => file.endsWith('.md'));
    
    if (subagentFiles.length === 0) {
      return false;
    }
    
    if (dryRun) {
      console.log(`Would copy ${subagentFiles.length} subagent files to ${targetDir}`);
      subagentFiles.forEach(file => console.log(`  - ${file}`));
      return true;
    }
    
    console.log(`Copying ${subagentFiles.length} subagent files...`);
    
    // Process each subagent file
    for (const file of subagentFiles) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      
      // Read the subagent content
      let content = fs.readFileSync(sourcePath, 'utf-8');
      
      // Apply template substitution if config is available
      if (config) {
        const result = substituteTemplates(content, config);
        content = result.content;
        
        if (result.unsubstituted.length > 0) {
          console.log(chalk.yellow(`  ⚠️  Unsubstituted in ${file}: ${result.unsubstituted.join(', ')}`));
        }
      }
      
      // Write to target
      fs.writeFileSync(targetPath, content, 'utf-8');
      console.log(`  ✓ ${file}`);
    }
    
    return true;
  } catch (error: any) {
    console.log(chalk.red(`  ❌ Failed to copy subagents: ${error.message}`));
    return false;
  }
}

// Main build command
export async function buildCommand(options: BuildOptions): Promise<void> {
  console.log(chalk.blue('🏰 Codery Build'));
  console.log();

  try {
    // Load configuration if not skipping
    let config: CoderyConfig | null = null;
    let allUnsubstituted: string[] = [];

    if (!options.skipConfig) {
      config = loadConfig();
      if (!config) {
        console.log(chalk.yellow('⚠️  No configuration found. Run "codery init" to create one.'));
        console.log(chalk.dim('   Building without template substitution...'));
        console.log();
      }
    }

    // Read all markdown files
    const markdownFiles = readMarkdownFiles(config);

    if (markdownFiles.length === 0) {
      console.log(chalk.yellow('No markdown files found in codery-docs/.codery'));
      return;
    }

    console.log(`Found ${markdownFiles.length} markdown files:`);
    markdownFiles.forEach(file => {
      console.log(`  - ${file.name}`);
    });
    console.log();

    // Apply template substitution if config is available
    if (config && !options.skipConfig) {
      console.log('Applying template substitution...');
      markdownFiles.forEach(file => {
        const result = substituteTemplates(file.content, config);
        file.content = result.content;
        allUnsubstituted.push(...result.unsubstituted);
      });

      if (allUnsubstituted.length > 0) {
        console.log(
          chalk.yellow(`⚠️  Unsubstituted variables: ${[...new Set(allUnsubstituted)].join(', ')}`)
        );
      }
      console.log();
    }

    // Merge files
    const mergedContent = mergeMarkdownFiles(markdownFiles);

    // Determine output path
    const outputPath = path.resolve(process.cwd(), options.output || 'CLAUDE.md');

    // Dry run mode
    if (options.dryRun) {
      console.log(chalk.yellow('DRY RUN MODE - No files will be created'));
      console.log();
      console.log(`Would create: ${outputPath}`);
      console.log(`File size: ~${Math.round(mergedContent.length / 1024)}KB`);
      console.log();
      console.log('Preview of merged content:');
      console.log('---');
      console.log(mergedContent.substring(0, 500) + '...');
      console.log('---');
      console.log();
      
      // Show what subagents would be copied
      await copySubagentFiles(config, true);
      
      return;
    }

    // Check if file exists and prompt for confirmation
    if (fs.existsSync(outputPath)) {
      console.log(chalk.yellow(`⚠️  File already exists: ${outputPath}`));
      console.log();

      const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Do you want to overwrite the existing CLAUDE.md file?',
          default: false,
        },
      ]);

      if (!confirm) {
        console.log(chalk.red('Build cancelled.'));
        process.exit(0);
      }
    }

    // Write the merged file
    fs.writeFileSync(outputPath, mergedContent, 'utf-8');

    console.log();
    console.log(chalk.green('✨ Codery build complete!'));
    console.log();
    console.log(`Created: ${outputPath}`);
    console.log(`Size: ~${Math.round(mergedContent.length / 1024)}KB`);
    console.log();
    console.log('Your CLAUDE.md file contains:');
    markdownFiles.forEach(file => {
      console.log(`  - ${file.name.replace('.md', '').replace(/_/g, ' ')}`);
    });
    
    // Build application documentation if configured
    if (config?.applicationDocs && config.applicationDocs.length > 0) {
      console.log();
      console.log('Building application documentation...');
      const appDocsSuccess = await buildApplicationDocs(config);
      if (appDocsSuccess) {
        console.log(chalk.green('✓ Created .codery/application-docs.md'));
      }
    }
    
    // Copy subagent files
    console.log();
    const subagentsSuccess = await copySubagentFiles(config, false);
    if (subagentsSuccess) {
      console.log(chalk.green('✓ Copied subagents to .claude/agents/'));
    }
    
    console.log();
    console.log('Next steps:');
    console.log('  1. Review the generated CLAUDE.md file');
    console.log('  2. Customize it for your specific project needs');
    console.log('  3. Commit it to your repository');
    console.log('  4. Start using AI assistants with your Codery-enabled project!');
  } catch (error: any) {
    console.error(chalk.red('Build failed:'), error.message);
    throw error;
  }
}
