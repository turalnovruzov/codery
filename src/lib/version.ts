import { readFileSync } from 'fs';
import { join } from 'path';

let cachedPackageInfo: { name: string; version: string } | null = null;

function loadPackageInfo(): { name: string; version: string } {
  if (cachedPackageInfo) {
    return cachedPackageInfo;
  }

  try {
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    cachedPackageInfo = {
      name: packageJson.name || 'codery',
      version: packageJson.version || '0.0.0',
    };
    return cachedPackageInfo;
  } catch (error) {
    // Log error in debug mode
    if (process.env.DEBUG) {
      console.warn('Unable to read package.json:', error instanceof Error ? error.message : 'Unknown error');
    }
    // Return fallback and cache it
    cachedPackageInfo = { name: 'codery', version: '0.0.0' };
    return cachedPackageInfo;
  }
}

export function getVersion(): string {
  return loadPackageInfo().version;
}

export function getPackageInfo(): { name: string; version: string } {
  return loadPackageInfo();
}