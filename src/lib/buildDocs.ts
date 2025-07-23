import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

interface BuildOptions {
  output?: string;
  dryRun?: boolean;
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
  'Commands.md',
  'LifeCycles.md',
  'SuccessCriteria.md'
];

// Read all markdown files from the .codery directory
function readMarkdownFiles(): MarkdownFile[] {
  const coderyDir = path.join(packageRoot, 'codery-docs/.codery');
  const files: MarkdownFile[] = [];

  if (!fs.existsSync(coderyDir)) {
    throw new Error(`Codery documentation directory not found: ${coderyDir}`);
  }

  // Get all .md files
  const allFiles = fs.readdirSync(coderyDir)
    .filter(file => file.endsWith('.md'));

  // Sort files according to predefined order, with unlisted files at the end
  const sortedFiles = [
    ...fileOrder.filter(file => allFiles.includes(file)),
    ...allFiles.filter(file => !fileOrder.includes(file))
  ];

  // Read each file
  sortedFiles.forEach(filename => {
    const filePath = path.join(coderyDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    files.push({
      name: filename,
      path: filePath,
      content: content.trim()
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
  sections.push('This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.');
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

// Main build command
export async function buildCommand(options: BuildOptions): Promise<void> {
  console.log(chalk.blue('🏰 Codery Build'));
  console.log();

  try {
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