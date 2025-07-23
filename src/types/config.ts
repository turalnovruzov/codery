export interface CoderyConfig {
  cloudId: string;
  projectKey: string;
  developBranch?: string;
  mainBranch?: string;
}

export const defaultConfig: CoderyConfig = {
  cloudId: 'https://your-domain.atlassian.net',
  projectKey: 'YOUR_PROJECT_KEY',
  developBranch: 'develop',
  mainBranch: 'main',
};
