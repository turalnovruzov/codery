import updateNotifier from 'update-notifier';
import { getPackageInfo } from './version';
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { CoderyConfig } from '../types/config';

function findProjectRoot(): string {
  // Start from current working directory and look for .codery directory
  let currentDir = process.cwd();
  const root = resolve('/');
  
  while (currentDir !== root) {
    if (existsSync(join(currentDir, '.codery', 'config.json'))) {
      return currentDir;
    }
    const parentDir = resolve(currentDir, '..');
    if (parentDir === currentDir) break; // Reached filesystem root
    currentDir = parentDir;
  }
  
  // Default to current working directory if .codery not found
  return process.cwd();
}

function parseConfig(content: string): CoderyConfig | null {
  try {
    const parsed = JSON.parse(content);
    // Basic validation
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }
    // Validate autoUpdate if present
    if ('autoUpdate' in parsed && typeof parsed.autoUpdate !== 'boolean') {
      console.warn('Invalid autoUpdate value in config, must be boolean');
      return null;
    }
    return parsed as CoderyConfig;
  } catch {
    return null;
  }
}

export function checkForUpdates(): void {
  try {
    // Check if auto-update is disabled in config
    const projectRoot = findProjectRoot();
    const configPath = join(projectRoot, '.codery', 'config.json');
    
    if (existsSync(configPath)) {
      const configContent = readFileSync(configPath, 'utf-8');
      const config = parseConfig(configContent);
      
      // If config is invalid or autoUpdate is explicitly set to false, skip update check
      if (!config || config.autoUpdate === false) {
        return;
      }
    }

    // Check if NO_UPDATE_NOTIFIER env var is set
    if (process.env.NO_UPDATE_NOTIFIER) {
      return;
    }

    const packageInfo = getPackageInfo();
    
    const notifier = updateNotifier({
      pkg: packageInfo,
      updateCheckInterval: 1000 * 60 * 60 * 24, // 24 hours
    });

    // This will show the notification if an update is available
    // The notification appears after the command completes
    notifier.notify({
      isGlobal: true,
      defer: true, // Show notification after process exits
    });
  } catch (error) {
    // Log error in debug mode but don't break the CLI
    if (process.env.DEBUG) {
      console.warn('Update check failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}