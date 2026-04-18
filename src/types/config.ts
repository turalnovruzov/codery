export interface CoderyConfig {
  projectKey: string;
  developBranch?: string;
  mainBranch?: string;
  applicationDocs?: string[];
  gitWorkflowType?: 'gitflow' | 'trunk-based';
}

export const defaultConfig: CoderyConfig = {
  projectKey: 'YOUR_PROJECT_KEY',
  developBranch: 'develop',
  mainBranch: 'main',
};
