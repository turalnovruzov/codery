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
    // Skip block-level placeholders — handled separately
    if (variable === 'docImports') {
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

// Replace a block-level placeholder in template content. When value is empty
// and the placeholder sits on its own line, remove the line entirely so we do
// not leave behind orphan whitespace.
function substituteBlockPlaceholder(content: string, placeholder: string, value: string): string {
  if (value !== '') {
    return content.replace(placeholder, value);
  }
  const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const linePattern = new RegExp(`^${escaped}[\\t ]*\\r?\\n?`, 'm');
  if (linePattern.test(content)) {
    return content.replace(linePattern, '');
  }
  return content.replace(placeholder, '');
}

// POSIX-normalize a path string. Replaces backslashes explicitly so configs
// authored on Windows render usable @-imports regardless of which platform
// runs `codery build`.
function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

// Generate eager @import lines for every entry in applicationDocs and
// documentationRoots. Each entry can be a file or a folder. Files are imported
// directly; folders are walked recursively for .md files. Missing entries are
// warned and skipped (lenient at build time). Output is sorted and deduplicated
// across both fields so an entry appearing in both produces one @import.
function generateAllDocImports(
  config: CoderyConfig,
  log: (...args: unknown[]) => void
): string {
  const projectRoot = process.cwd();
  const entries = [
    ...(config.applicationDocs ?? []),
    ...(config.documentationRoots ?? []),
  ];
  if (entries.length === 0) {
    return '';
  }

  const collected = new Set<string>();
  for (const entry of entries) {
    const resolved = path.resolve(projectRoot, entry);
    if (!fs.existsSync(resolved)) {
      log(chalk.yellow(`  ⚠️  doc entry not found, skipping: ${entry}`));
      continue;
    }
    const stat = fs.statSync(resolved);
    if (stat.isFile()) {
      if (!entry.toLowerCase().endsWith('.md')) {
        log(chalk.yellow(`  ⚠️  doc entry is not a .md file, skipping: ${entry}`));
        continue;
      }
      collected.add(toPosix(entry));
    } else if (stat.isDirectory()) {
      for (const f of walkMarkdownFiles(resolved, projectRoot)) {
        collected.add(f);
      }
    }
  }

  return Array.from(collected).sort().map(p => `@${p}`).join('\n');
}

// Names skipped during folder walks so common build/dependency outputs do
// not pollute the generated imports. Dotfiles/dotdirs are skipped separately.
const WALK_SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'out',
  'target',
  'coverage',
]);

// Walk a directory recursively and return all .md file paths (relative to
// projectRoot, POSIX-normalized). Skips dotfiles/dotdirs, common output
// directories, and symlinks to avoid runaway traversal.
function walkMarkdownFiles(rootDir: string, projectRoot: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(rootDir)) return results;
  const queue: string[] = [rootDir];
  while (queue.length > 0) {
    const dir = queue.shift() as string;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      if (entry.name.startsWith('.')) continue;
      if (WALK_SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        results.push(toPosix(path.relative(projectRoot, fullPath)));
      }
    }
  }
  return results.sort();
}

// Remove a stale .codery/refs/docs-index.md if one exists. The hub-and-spoke
// index from v8.x is no longer generated — applicationDocs and
// documentationRoots both eager-load now. This cleanup runs unconditionally so
// projects upgrading from v8.x lose the dangling index file on next build.
function removeStaleDocsIndex(dryRun: boolean, log: (...args: unknown[]) => void): void {
  const indexPath = path.join(process.cwd(), '.codery/refs/docs-index.md');
  if (!fs.existsSync(indexPath)) return;
  if (dryRun) {
    log(`Would remove stale .codery/refs/docs-index.md`);
    return;
  }
  fs.unlinkSync(indexPath);
  log(`  ✓ removed stale docs-index.md`);
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

// Get the appropriate JIRA reference source file based on config
function getJiraReferenceSource(config: CoderyConfig | null): string {
  const integrationType = config?.jiraIntegrationType || 'cli';
  const fileMap: Record<string, string> = {
    'cli': 'jira-reference-cli.md',
    'mcp': 'jira-reference-mcp.md'
  };
  return fileMap[integrationType];
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

    // Copy JIRA reference (CLI or MCP variant based on config)
    const jiraSourceFile = getJiraReferenceSource(config);
    const jiraSource = path.join(sourceDir, jiraSourceFile);
    const refsDir = path.join(coderyDir, 'refs');
    if (!fs.existsSync(refsDir)) {
      fs.mkdirSync(refsDir, { recursive: true });
    }

    const jiraTarget = path.join(refsDir, 'jira-reference.md');

    if (fs.existsSync(jiraSource)) {
      if (dryRun) {
        log(`Would copy ${jiraSourceFile} → .codery/jira-reference.md`);
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

    return true;
  } catch (error: any) {
    log(chalk.red(`  ❌ Failed to copy reference files: ${error.message}`));
    return false;
  }
}

// Recursively list every file under a skill source dir, returning
// POSIX-normalized paths relative to that root. Skips dotfiles, dotdirs, and
// symlinks. Used by both the dry-run preview and the recursive copy.
function listSkillFiles(sourceRoot: string): string[] {
  const results: string[] = [];
  const queue: string[] = [sourceRoot];
  while (queue.length > 0) {
    const dir = queue.shift() as string;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      if (entry.name.startsWith('.')) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }
      if (entry.isFile()) {
        results.push(toPosix(path.relative(sourceRoot, fullPath)));
      }
    }
  }
  return results.sort();
}

// Copy a single skill directory tree to its target. Applies {{var}}
// substitution to .md files; copies other extensions verbatim. Warns and
// continues on per-file errors so one bad file does not break the build.
function copySkillDirectory(
  source: string,
  target: string,
  config: CoderyConfig | null,
  log: (...args: unknown[]) => void,
  skillName: string
): void {
  const files = listSkillFiles(source);
  if (files.length === 0) {
    log(chalk.yellow(`  ⚠️  ${skillName}/ has no files`));
    return;
  }

  for (const relPath of files) {
    const sourceFile = path.join(source, relPath);
    const targetFile = path.join(target, relPath);

    try {
      const targetSubdir = path.dirname(targetFile);
      if (!fs.existsSync(targetSubdir)) {
        fs.mkdirSync(targetSubdir, { recursive: true });
      }

      if (relPath.toLowerCase().endsWith('.md')) {
        let content = fs.readFileSync(sourceFile, 'utf-8');
        if (config) {
          const result = substituteTemplates(content, config);
          content = result.content;
          if (result.unsubstituted.length > 0) {
            log(
              chalk.yellow(
                `  ⚠️  Unsubstituted in ${skillName}/${relPath}: ${result.unsubstituted.join(', ')}`
              )
            );
          }
        }
        fs.writeFileSync(targetFile, content, 'utf-8');
      } else {
        fs.copyFileSync(sourceFile, targetFile);
      }
      log(`  ✓ ${skillName}/${relPath}`);
    } catch (err: any) {
      log(chalk.yellow(`  ⚠️  Failed to copy ${skillName}/${relPath}: ${err.message}`));
    }
  }
}

// Copy skill directories to .claude/skills/ with substitution. Each skill is
// a directory containing SKILL.md and any companion files (phase playbooks,
// templates, etc.). Companion files are required for skills that reference
// them by name from SKILL.md.
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
    const skillDirs = fs.readdirSync(sourceDir)
      .filter(item => fs.statSync(path.join(sourceDir, item)).isDirectory());

    if (skillDirs.length === 0) {
      return false;
    }

    if (dryRun) {
      log(`Would copy ${skillDirs.length} skills to ${targetDir}`);
      for (const skillDir of skillDirs) {
        const files = listSkillFiles(path.join(sourceDir, skillDir));
        for (const f of files) log(`  - ${skillDir}/${f}`);
      }
      return true;
    }

    log(`Copying ${skillDirs.length} skills...`);

    for (const skillDir of skillDirs) {
      const skillSource = path.join(sourceDir, skillDir);
      const skillTarget = path.join(targetDir, skillDir);
      copySkillDirectory(skillSource, skillTarget, config, log, skillDir);
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

    // Inject the unified doc-imports block before the general substitution pass.
    // applicationDocs and documentationRoots are now treated identically: each
    // entry is a file or folder, eagerly imported (folders walked for .md).
    const docImports = config ? generateAllDocImports(config, log) : '';
    claudeContent = substituteBlockPlaceholder(claudeContent, '{{docImports}}', docImports);

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
      removeStaleDocsIndex(true, log);
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
    removeStaleDocsIndex(false, log);

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
