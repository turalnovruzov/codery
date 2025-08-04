import { readFileSync } from 'fs';
import { join } from 'path';

let cachedVersion: string | null = null;

export function getVersion(): string {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    cachedVersion = packageJson.version;
    return packageJson.version;
  } catch (_error) {
    console.warn('Unable to read version from package.json, using fallback');
    return '0.0.0';
  }
}

export function getPackageInfo(): { name: string; version: string } {
  try {
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return {
      name: packageJson.name,
      version: packageJson.version,
    };
  } catch (_error) {
    console.warn('Unable to read package.json, using fallback');
    return {
      name: 'codery',
      version: '0.0.0',
    };
  }
}