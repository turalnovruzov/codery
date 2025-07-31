export interface CoderyConfig {
  cloudId?: string;
  projectKey: string;
  developBranch?: string;
  mainBranch?: string;
  applicationDocs?: string[];
  gitWorkflowType?: 'gitflow' | 'trunk-based';
  jiraIntegrationType?: 'mcp' | 'cli';
}

export const defaultConfig: CoderyConfig = {
  cloudId: 'https://your-domain.atlassian.net',
  projectKey: 'YOUR_PROJECT_KEY',
  developBranch: 'develop',
  mainBranch: 'main',
};
