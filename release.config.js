/* eslint-disable no-template-curly-in-string */
module.exports = {
  branches: ['main', { name: 'dev', prerelease: 'dev' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'docs/CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'docs/CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    ['@semantic-release/github', { assets: 'node-red-contrib-z2m-*.tgz' }],
    ['@semantic-release/npm', { tarballDir: '.' }],
  ],
};
