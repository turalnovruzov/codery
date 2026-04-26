import { CoderyConfig } from '../types/config';

export type ConfigKey = keyof CoderyConfig;

interface BaseField {
  description: string;
}

export interface ScalarField extends BaseField {
  kind: 'scalar';
  filter?: (input: string) => string;
  validate?: (input: string) => true | string;
}

export interface EnumField extends BaseField {
  kind: 'enum';
  choices: readonly string[];
}

export interface ArrayField extends BaseField {
  kind: 'array';
  itemValidate?: (input: string) => true | string;
}

export type FieldSchema = ScalarField | EnumField | ArrayField;

export function validateProjectKey(input: string): true | string {
  if (input.match(/^[A-Z][A-Z0-9]*$/)) return true;
  return 'Project key must be uppercase letters and numbers (e.g., PROJ, MVP, ACME)';
}

export function filterCloudId(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');
}

export function validateCloudId(input: string): true | string {
  if (!input) return 'Atlassian site is required.';
  if (!input.includes('.')) return 'Enter a hostname like company.atlassian.net.';
  return true;
}

export function validateNonEmpty(input: string): true | string {
  if (!input.trim()) return 'Value cannot be empty.';
  return true;
}

export const configSchema: Record<ConfigKey, FieldSchema> = {
  projectKey: {
    kind: 'scalar',
    description: 'JIRA project key (uppercase letters and numbers)',
    validate: validateProjectKey,
  },
  gitWorkflowType: {
    kind: 'enum',
    description: 'Git workflow style',
    choices: ['gitflow', 'trunk-based'] as const,
  },
  mainBranch: {
    kind: 'scalar',
    description: 'Main/production branch name',
    validate: validateNonEmpty,
  },
  developBranch: {
    kind: 'scalar',
    description: 'Development branch name (used with gitflow)',
    validate: validateNonEmpty,
  },
  jiraIntegrationType: {
    kind: 'enum',
    description: 'How AI agents interact with JIRA',
    choices: ['cli', 'mcp'] as const,
  },
  jiraCloudId: {
    kind: 'scalar',
    description: 'Atlassian site hostname (used with MCP integration)',
    filter: filterCloudId,
    validate: validateCloudId,
  },
  applicationDocs: {
    kind: 'array',
    description: 'Paths to project-specific docs imported into CLAUDE.md',
    itemValidate: validateNonEmpty,
  },
};

export function isValidKey(key: string): key is ConfigKey {
  return Object.prototype.hasOwnProperty.call(configSchema, key);
}

export function applyScalarFilter(key: ConfigKey, raw: string): string {
  const field = configSchema[key];
  if (field.kind === 'scalar' && field.filter) return field.filter(raw);
  return raw;
}

export function validateScalarValue(key: ConfigKey, value: string): true | string {
  const field = configSchema[key];
  if (field.kind === 'enum') {
    return field.choices.includes(value) ? true : `Must be one of: ${field.choices.join(', ')}`;
  }
  if (field.kind === 'array') {
    return `"${key}" is an array field; use \`codery config add\` / \`remove\`.`;
  }
  return field.validate ? field.validate(value) : true;
}

export function validateArrayItem(key: ConfigKey, value: string): true | string {
  const field = configSchema[key];
  if (field.kind !== 'array') {
    return `"${key}" is not an array field; use \`codery config set\`.`;
  }
  return field.itemValidate ? field.itemValidate(value) : true;
}

export interface StaleWarning {
  key: ConfigKey;
  message: string;
}

export function detectStaleFields(config: CoderyConfig): StaleWarning[] {
  const warnings: StaleWarning[] = [];
  if (config.jiraIntegrationType === 'cli' && config.jiraCloudId) {
    warnings.push({
      key: 'jiraCloudId',
      message: 'set but jiraIntegrationType is cli (unused)',
    });
  }
  if (config.gitWorkflowType === 'trunk-based' && config.developBranch) {
    warnings.push({
      key: 'developBranch',
      message: 'set but gitWorkflowType is trunk-based (unused)',
    });
  }
  return warnings;
}
