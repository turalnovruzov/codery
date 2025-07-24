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
  'Git_Workflow.md',
  'JIRA_Workflow.md',
  'Commands.md',
  'LifeCycles.md',
  'SuccessCriteria.md',
];

// Read all markdown files from the .codery directory
function readMarkdownFiles(): MarkdownFile[] {
  const coderyDir = path.join(packageRoot, 'codery-docs/.codery');
  const files: MarkdownFile[] = [];

  if (!fs.existsSync(coderyDir)) {
    throw new Error(`Codery documentation directory not found: ${coderyDir}`);
  }

  // Get all .md files
  const allFiles = fs.readdirSync(coderyDir).filter(file => file.endsWith('.md'));

  // Sort files according to predefined order, with unlisted files at the end
  const sortedFiles = [
    ...fileOrder.filter(file => allFiles.includes(file)),
    ...allFiles.filter(file => !fileOrder.includes(file)),
  ];

  // Read each file
  sortedFiles.forEach(filename => {
    const filePath = path.join(coderyDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    files.push({
      name: filename,
      path: filePath,
      content: content.trim(),
    });
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
  } catch (error) {
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
      
      // Get the filename for the section header
      const filename = path.basename(resolvedPath);
      
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
    const markdownFiles = readMarkdownFiles();

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
