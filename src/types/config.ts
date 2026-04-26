export interface CoderyConfig {
  projectKey: string;
  developBranch?: string;
  mainBranch?: string;
  applicationDocs?: string[];
  documentationRoots?: string[];
  gitWorkflowType?: 'gitflow' | 'trunk-based';
  jiraIntegrationType?: 'mcp' | 'cli';
  jiraCloudId?: string;
}

export const defaultConfig: CoderyConfig = {
  projectKey: 'YOUR_PROJECT_KEY',
  developBranch: 'develop',
  mainBranch: 'main',
  jiraIntegrationType: 'cli',
};
