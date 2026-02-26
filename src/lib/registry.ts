import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface RegisteredProject {
  path: string;
  addedAt: string;
}

export interface Registry {
  projects: RegisteredProject[];
}

/**
 * Get the path to the global Codery registry file
 */
export function getRegistryPath(): string {
  return path.join(os.homedir(), '.codery', 'projects.json');
}

/**
 * Get the path to the global Codery directory
 */
export function getRegistryDir(): string {
  return path.join(os.homedir(), '.codery');
}

/**
 * Load the registry from disk, creating it if it doesn't exist
 */
export function loadRegistry(): Registry {
  const registryPath = getRegistryPath();
  const registryDir = getRegistryDir();

  // Create ~/.codery directory if it doesn't exist
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }

  // Create empty registry if it doesn't exist
  if (!fs.existsSync(registryPath)) {
    const emptyRegistry: Registry = { projects: [] };
    fs.writeFileSync(registryPath, JSON.stringify(emptyRegistry, null, 2), 'utf-8');
    return emptyRegistry;
  }

  try {
    const content = fs.readFileSync(registryPath, 'utf-8');
    return JSON.parse(content) as Registry;
  } catch {
    // If corrupted, return empty registry
    return { projects: [] };
  }
}

/**
 * Save the registry to disk
 */
export function saveRegistry(registry: Registry): void {
  const registryPath = getRegistryPath();
  const registryDir = getRegistryDir();

  // Ensure directory exists
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }

  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
}

/**
 * Add a project to the registry (idempotent - no duplicates)
 * @param projectPath - Path to add (will be converted to absolute)
 * @returns true if added, false if already existed
 */
export function addProject(projectPath: string): boolean {
  const absolutePath = path.resolve(projectPath);
  const registry = loadRegistry();

  // Check if already registered
  const exists = registry.projects.some(p => p.path === absolutePath);
  if (exists) {
    return false;
  }

  registry.projects.push({
    path: absolutePath,
    addedAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });

  saveRegistry(registry);
  return true;
}

/**
 * Remove a project from the registry
 * @param projectPath - Path to remove
 * @returns true if removed, false if not found
 */
export function removeProject(projectPath: string): boolean {
  const absolutePath = path.resolve(projectPath);
  const registry = loadRegistry();

  const initialLength = registry.projects.length;
  registry.projects = registry.projects.filter(p => p.path !== absolutePath);

  if (registry.projects.length < initialLength) {
    saveRegistry(registry);
    return true;
  }

  return false;
}

/**
 * List all registered projects
 */
export function listProjects(): RegisteredProject[] {
  const registry = loadRegistry();
  return registry.projects;
}

/**
 * Check if a project path exists on the filesystem
 */
export function projectExists(projectPath: string): boolean {
  return fs.existsSync(projectPath);
}

/**
 * Check if a project has a valid Codery config
 */
export function hasCoderyConfig(projectPath: string): boolean {
  const configPath = path.join(projectPath, '.codery', 'config.json');
  return fs.existsSync(configPath);
}
