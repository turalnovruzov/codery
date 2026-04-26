import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { CoderyConfig } from '../types/config';
import {
  configSchema,
  ConfigKey,
  FieldSchema,
  isValidKey,
  applyScalarFilter,
  validateScalarValue,
  validateArrayItem,
  detectStaleFields,
} from './configSchema';

interface LoadedConfig {
  config: CoderyConfig;
  configPath: string;
}

function asRecord(config: CoderyConfig): Record<string, unknown> {
  return config as unknown as Record<string, unknown>;
}

function loadConfig(): LoadedConfig {
  const configPath = path.join(process.cwd(), '.codery', 'config.json');
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('Error:'), 'No Codery configuration found in this directory.');
    console.error(chalk.dim('Run `codery init` to create one.'));
    process.exit(1);
  }
  let config: CoderyConfig;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as CoderyConfig;
  } catch (error: any) {
    console.error(chalk.red('Error:'), `Could not parse ${configPath}: ${error.message}`);
    process.exit(1);
  }
  return { config, configPath };
}

function saveConfig(config: CoderyConfig, configPath: string): void {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

function ensureKey(key: string): asserts key is ConfigKey {
  if (!isValidKey(key)) {
    const valid = Object.keys(configSchema).join(', ');
    console.error(chalk.red('Error:'), `Unknown config key: ${key}`);
    console.error(chalk.dim(`Valid keys: ${valid}`));
    process.exit(1);
  }
}

function warnStaleFields(config: CoderyConfig): void {
  for (const w of detectStaleFields(config)) {
    console.warn(chalk.yellow('⚠'), `${w.key}: ${w.message}`);
  }
}

export function configList(): void {
  const { config } = loadConfig();
  console.log(JSON.stringify(config, null, 2));
}

export function configGet(key: string): void {
  ensureKey(key);
  const { config } = loadConfig();
  const value = asRecord(config)[key];
  if (value === undefined) {
    console.error(chalk.red('Error:'), `Key "${key}" is not set.`);
    process.exit(1);
  }
  if (Array.isArray(value)) {
    for (const item of value) console.log(item);
  } else {
    console.log(value);
  }
}

export function configSet(key: string, rawValue: string): void {
  ensureKey(key);
  const field = configSchema[key];
  if (field.kind === 'array') {
    console.error(
      chalk.red('Error:'),
      `"${key}" is an array field; use \`codery config add\` / \`remove\`.`
    );
    process.exit(1);
  }
  const filtered = applyScalarFilter(key, rawValue);
  const result = validateScalarValue(key, filtered);
  if (result !== true) {
    console.error(chalk.red('Error:'), result);
    process.exit(1);
  }
  const { config, configPath } = loadConfig();
  asRecord(config)[key] = filtered;
  saveConfig(config, configPath);
  console.log(chalk.green('✓'), `${key} = ${filtered}`);
  warnStaleFields(config);
}

export function configUnset(key: string): void {
  ensureKey(key);
  const { config, configPath } = loadConfig();
  if (asRecord(config)[key] === undefined) {
    console.log(chalk.dim(`${key} was not set; nothing to unset.`));
    return;
  }
  delete asRecord(config)[key];
  saveConfig(config, configPath);
  console.log(chalk.green('✓'), `Unset ${key}`);
}

export function configAdd(key: string, rawValue: string): void {
  ensureKey(key);
  const field = configSchema[key];
  if (field.kind !== 'array') {
    console.error(
      chalk.red('Error:'),
      `"${key}" is not an array field; use \`codery config set\`.`
    );
    process.exit(1);
  }
  const result = validateArrayItem(key, rawValue);
  if (result !== true) {
    console.error(chalk.red('Error:'), result);
    process.exit(1);
  }
  const { config, configPath } = loadConfig();
  const arr = (asRecord(config)[key] as string[] | undefined) ?? [];
  arr.push(rawValue);
  asRecord(config)[key] = arr;
  saveConfig(config, configPath);
  console.log(chalk.green('✓'), `Added "${rawValue}" to ${key}`);
}

export function configRemove(key: string, rawValue: string): void {
  ensureKey(key);
  const field = configSchema[key];
  if (field.kind !== 'array') {
    console.error(
      chalk.red('Error:'),
      `"${key}" is not an array field; use \`codery config unset\`.`
    );
    process.exit(1);
  }
  const { config, configPath } = loadConfig();
  const arr = (asRecord(config)[key] as string[] | undefined) ?? [];
  const idx = arr.indexOf(rawValue);
  if (idx === -1) {
    console.error(chalk.red('Error:'), `"${rawValue}" not found in ${key}`);
    process.exit(1);
  }
  arr.splice(idx, 1);
  if (arr.length === 0) {
    delete asRecord(config)[key];
  } else {
    asRecord(config)[key] = arr;
  }
  saveConfig(config, configPath);
  console.log(chalk.green('✓'), `Removed "${rawValue}" from ${key}`);
}

function formatValue(value: unknown): string {
  if (value === undefined) return chalk.dim('(not set)');
  if (Array.isArray(value)) {
    if (value.length === 0) return chalk.dim('(empty)');
    return chalk.cyan(`[${value.length} item${value.length === 1 ? '' : 's'}]`);
  }
  return chalk.cyan(String(value));
}

export async function configMenu(): Promise<void> {
  const { config, configPath } = loadConfig();
  const working: CoderyConfig = JSON.parse(JSON.stringify(config));
  let dirty = false;

  console.log(chalk.blue('🛠️  Codery config'));
  console.log(chalk.dim(`File: ${configPath}`));
  console.log();

  while (true) {
    const warnings = detectStaleFields(working);
    const warningMap = new Map(warnings.map(w => [w.key, w.message]));

    const fieldChoices = (Object.keys(configSchema) as ConfigKey[]).map(key => {
      const value = asRecord(working)[key];
      const display = formatValue(value);
      const warning = warningMap.get(key);
      const name = warning
        ? `${key}: ${display} ${chalk.yellow(`⚠ ${warning}`)}`
        : `${key}: ${display}`;
      return { name, value: key };
    });

    const { selected } = await inquirer.prompt<{ selected: string }>([
      {
        type: 'list',
        name: 'selected',
        message: dirty ? 'Codery config (unsaved changes):' : 'Codery config:',
        pageSize: 15,
        choices: [
          ...fieldChoices,
          new inquirer.Separator(),
          { name: 'Save & Exit', value: '__save__' },
          { name: 'Discard & Exit', value: '__discard__' },
        ],
      },
    ]);

    if (selected === '__save__') {
      if (!dirty) {
        console.log(chalk.dim('No changes to save.'));
        return;
      }
      saveConfig(working, configPath);
      console.log(chalk.green('✓'), 'Configuration saved.');
      warnStaleFields(working);
      return;
    }
    if (selected === '__discard__') {
      if (dirty) {
        const { confirmDiscard } = await inquirer.prompt<{ confirmDiscard: boolean }>([
          {
            type: 'confirm',
            name: 'confirmDiscard',
            message: 'Discard unsaved changes?',
            default: false,
          },
        ]);
        if (!confirmDiscard) continue;
      }
      console.log(chalk.dim('Discarded changes.'));
      return;
    }

    const changed = await editField(working, selected as ConfigKey);
    if (changed) dirty = true;
  }
}

async function editField(config: CoderyConfig, key: ConfigKey): Promise<boolean> {
  const field = configSchema[key];
  const current = asRecord(config)[key];

  if (field.kind === 'enum') {
    return editEnumField(config, key, field, current as string | undefined);
  }
  if (field.kind === 'scalar') {
    return editScalarField(config, key, field, current as string | undefined);
  }
  return editArrayField(config, key, field);
}

async function editEnumField(
  config: CoderyConfig,
  key: ConfigKey,
  field: Extract<FieldSchema, { kind: 'enum' }>,
  current: string | undefined
): Promise<boolean> {
  const { value } = await inquirer.prompt<{ value: string }>([
    {
      type: 'list',
      name: 'value',
      message: `${key}:`,
      choices: field.choices.map(c => ({ name: c, value: c })),
      default: current,
    },
  ]);
  if (value !== current) {
    asRecord(config)[key] = value;
    return true;
  }
  return false;
}

async function editScalarField(
  config: CoderyConfig,
  key: ConfigKey,
  field: Extract<FieldSchema, { kind: 'scalar' }>,
  current: string | undefined
): Promise<boolean> {
  const { value } = await inquirer.prompt<{ value: string }>([
    {
      type: 'input',
      name: 'value',
      message: `${key}:`,
      default: current ?? '',
      filter: field.filter,
      validate: field.validate,
    },
  ]);
  if (value !== current) {
    asRecord(config)[key] = value;
    return true;
  }
  return false;
}

async function editArrayField(
  config: CoderyConfig,
  key: ConfigKey,
  field: Extract<FieldSchema, { kind: 'array' }>
): Promise<boolean> {
  let changed = false;
  while (true) {
    const arr = (asRecord(config)[key] as string[] | undefined) ?? [];
    const itemChoices = arr.map((item, i) => ({
      name: `${i + 1}. ${item}`,
      value: `__remove__:${i}`,
    }));

    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: 'list',
        name: 'action',
        message: `${key}:`,
        pageSize: 15,
        choices: [
          ...itemChoices,
          new inquirer.Separator(),
          { name: '+ Add path', value: '__add__' },
          { name: '← Back', value: '__back__' },
        ],
      },
    ]);

    if (action === '__back__') return changed;

    if (action === '__add__') {
      const { newItem } = await inquirer.prompt<{ newItem: string }>([
        {
          type: 'input',
          name: 'newItem',
          message: 'New path:',
          validate: field.itemValidate,
        },
      ]);
      const newArr = [...arr, newItem];
      asRecord(config)[key] = newArr;
      changed = true;
      continue;
    }

    if (action.startsWith('__remove__:')) {
      const idx = Number(action.split(':')[1]);
      const newArr = [...arr];
      newArr.splice(idx, 1);
      if (newArr.length === 0) {
        delete asRecord(config)[key];
      } else {
        asRecord(config)[key] = newArr;
      }
      changed = true;
      continue;
    }
  }
}
