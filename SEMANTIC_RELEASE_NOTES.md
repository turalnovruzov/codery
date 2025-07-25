# Semantic Release Configuration Notes

## First Release

The first release using semantic-release will analyze all commits since the beginning of the repository. Based on the commit history containing `feat` commits, it will determine that version 1.0.0 should be released (as per semantic versioning, any 0.x.x version can have breaking changes without major version bump, but the first stable release should be 1.0.0).

Current published version: 0.1.0
Expected first semantic-release version: 1.0.0

## GitHub Secrets Required

The following secrets must be configured in your GitHub repository:

1. **NPM_TOKEN** - ✅ Already configured
   - Required for publishing to npm registry
   - Get from: `https://www.npmjs.com/settings/YOUR_USERNAME/tokens`

2. **GH_TOKEN** - ✅ Already configured
   - Personal Access Token with repo permissions
   - Required for creating releases and pushing tags
   - Using PAT instead of default GITHUB_TOKEN to avoid limitations

## Local Testing

To test semantic-release locally (dry-run):

```bash
npx semantic-release --dry-run --no-ci
```

Note: This will fail on GitHub authentication but will show what version would be released.

## Triggering a Release

Releases are automatically triggered when commits are pushed to the `main` branch. The GitHub Actions workflow will:

1. Analyze commits since last release
2. Determine version bump (major/minor/patch)
3. Update package.json version
4. Generate CHANGELOG.md
5. Create git tag
6. Publish to npm
7. Create GitHub release

## Commit Convention Reminder

- `fix:` - Patch release (1.0.0 → 1.0.1)
- `feat:` - Minor release (1.0.0 → 1.1.0)
- `feat!:` or `BREAKING CHANGE:` - Major release (1.0.0 → 2.0.0)

See `engineering-docs/commit-conventions.md` for full details.
