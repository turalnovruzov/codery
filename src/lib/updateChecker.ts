import updateNotifier from 'update-notifier';
import { getPackageInfo } from './version';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { CoderyConfig } from '../types/config';

export function checkForUpdates(): void {
  try {
    // Check if auto-update is disabled in config
    const configPath = join(process.cwd(), '.codery', 'config.json');
    if (existsSync(configPath)) {
      const configContent = readFileSync(configPath, 'utf-8');
      const config: CoderyConfig = JSON.parse(configContent);
      
      // If autoUpdate is explicitly set to false, skip update check
      if (config.autoUpdate === false) {
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
  } catch (_error) {
    // Silently fail - update check should not break the CLI
  }
}