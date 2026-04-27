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
    if (
      variable === 'applicationDocsImports' ||
      variable === 'documentationRootImports' ||
      variable === 'docsHubBlock'
    ) {
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

// Generate @import lines for applicationDocs. POSIX-normalized so configs
// authored on Windows render usable @-imports cross-platform.
function generateAppDocsImports(config: CoderyConfig): string {
  if (!config.applicationDocs || config.applicationDocs.length === 0) {
    return '';
  }

  return config.applicationDocs
    .map(docPath => `@${toPosix(docPath)}`)
    .join('\n');
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

interface ResolvedDocRoot {
  entryPath: string; // original path string from config
  resolvedAbs: string; // absolute filesystem path after resolution
}

// Resolve every documentationRoots entry against the working directory.
// Missing files are warned and dropped so a stale path does not abort the
// build. Every downstream generator gates on the returned list — when nothing
// resolves we emit no imports, no hub block, and no index file (avoids
// leaving CLAUDE.md with a dangling @.codery/refs/docs-index.md import).
function resolveDocRoots(
  config: CoderyConfig,
  log: (...args: unknown[]) => void
): ResolvedDocRoot[] {
  if (!config.documentationRoots || config.documentationRoots.length === 0) {
    return [];
  }
  const resolved: ResolvedDocRoot[] = [];
  for (const entryPath of config.documentationRoots) {
    const resolvedAbs = path.resolve(process.cwd(), entryPath);
    if (!fs.existsSync(resolvedAbs)) {
      log(chalk.yellow(`  ⚠️  documentationRoots entry not found, skipping: ${entryPath}`));
      continue;
    }
    resolved.push({ entryPath, resolvedAbs });
  }
  return resolved;
}

// Generate @import lines for resolved documentationRoots entry files.
function generateDocRootImports(resolved: ResolvedDocRoot[]): string {
  return resolved.map(r => `@${toPosix(r.entryPath)}`).join('\n');
}

// Generate the hub-and-spoke instruction block plus the @import for the
// generated docs index. Empty when no roots resolved on disk.
function generateDocsHubBlock(resolved: ResolvedDocRoot[]): string {
  if (resolved.length === 0) {
    return '';
  }
  return [
    '',
    '---',
    '',
    '## Project Documentation',
    '',
    'Documentation hub-and-spoke. The eagerly-loaded entry docs above are curated reading. The full file tree under each documentation root is at `.codery/refs/docs-index.md` and is loaded into context below.',
    '',
    'Treat that index as a first-class lookup. Whenever your current work intersects a topic the tree covers — files you are editing, code you are investigating, design decisions, unfamiliar areas — Read the relevant doc *before* proceeding. The user may not name the topic; you are responsible for noticing.',
    '',
    '@.codery/refs/docs-index.md',
  ].join('\n');
}

// Names skipped during the spoke walk so common build/dependency outputs do
// not pollute the generated index when a documentationRoots entry sits near
// the project root. Dotfiles/dotdirs are skipped separately.
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

// Build the markdown body for .codery/refs/docs-index.md. Returns null when
// no roots resolved on disk (signals the index file should be removed).
function generateDocsIndexContent(
  config: CoderyConfig,
  resolved: ResolvedDocRoot[]
): string | null {
  if (resolved.length === 0) {
    return null;
  }
  const projectRoot = process.cwd();

  // Files already in CLAUDE.md context — exclude them from the on-demand list.
  const excluded = new Set<string>();
  for (const p of config.applicationDocs ?? []) excluded.add(toPosix(p));
  for (const r of resolved) excluded.add(toPosix(r.entryPath));

  // Group entry files by their parent folder so multiple roots in the same
  // folder collapse into one section.
  const groups = new Map<string, string[]>();
  for (const r of resolved) {
    const parentRel = toPosix(path.relative(projectRoot, path.dirname(r.resolvedAbs))) || '.';
    const list = groups.get(parentRel) ?? [];
    list.push(toPosix(r.entryPath));
    groups.set(parentRel, list);
  }

  const sections: string[] = [
    '# Project Documentation Index',
    '',
    'Generated by `codery build`. Lists every `.md` file under each documentation root. Read these on demand using the Read tool when your work intersects their topics — entry docs are already eagerly loaded into CLAUDE.md.',
    '',
  ];

  const sortedGroups = Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  for (const [parentRel, entryPaths] of sortedGroups) {
    sections.push(`## ${parentRel}/`);
    sections.push('');
    sections.push(`Entry doc${entryPaths.length > 1 ? 's' : ''} (eagerly loaded):`);
    for (const e of entryPaths.sort()) sections.push(`- ${e}`);
    sections.push('');

    const parentAbs = path.resolve(projectRoot, parentRel);
    const allMd = walkMarkdownFiles(parentAbs, projectRoot).filter(p => !excluded.has(p));
    if (allMd.length === 0) {
      sections.push('_No additional docs in this root._');
    } else {
      sections.push('Spoke docs:');
      for (const p of allMd) sections.push(`- ${p}`);
    }
    sections.push('');
  }

  return sections.join('\n');
}

// Write or remove .codery/refs/docs-index.md based on resolved roots.
function writeOrRemoveDocsIndex(
  config: CoderyConfig | null,
  resolved: ResolvedDocRoot[],
  dryRun: boolean,
  log: (...args: unknown[]) => void
): void {
  const indexPath = path.join(process.cwd(), '.codery/refs/docs-index.md');
  const content = config ? generateDocsIndexContent(config, resolved) : null;

  if (content === null) {
    if (fs.existsSync(indexPath)) {
      if (dryRun) {
        log(`Would remove stale .codery/refs/docs-index.md`);
      } else {
        fs.unlinkSync(indexPath);
        log(`  ✓ removed stale docs-index.md`);
      }
    }
    return;
  }

  if (dryRun) {
    log(`Would write .codery/refs/docs-index.md`);
    return;
  }

  const refsDir = path.dirname(indexPath);
  if (!fs.existsSync(refsDir)) {
    fs.mkdirSync(refsDir, { recursive: true });
  }
  fs.writeFileSync(indexPath, content, 'utf-8');
  log(`  ✓ docs-index.md`);
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

    // Inject block-level placeholders before the general substitution pass.
    // Resolve documentationRoots once so imports, hub block, and index all
    // gate on the same resolved set.
    const appDocsImports = config ? generateAppDocsImports(config) : '';
    const resolvedRoots = config ? resolveDocRoots(config, log) : [];
    const docRootImports = generateDocRootImports(resolvedRoots);
    const docsHubBlock = generateDocsHubBlock(resolvedRoots);
    claudeContent = substituteBlockPlaceholder(
      claudeContent,
      '{{applicationDocsImports}}',
      appDocsImports
    );
    claudeContent = substituteBlockPlaceholder(
      claudeContent,
      '{{documentationRootImports}}',
      docRootImports
    );
    claudeContent = substituteBlockPlaceholder(claudeContent, '{{docsHubBlock}}', docsHubBlock);

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
      writeOrRemoveDocsIndex(config, resolvedRoots, true, log);
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
    writeOrRemoveDocsIndex(config, resolvedRoots, false, log);

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
