/* eslint-disable no-template-curly-in-string */
module.exports = {
  branches: ['main', { name: 'dev', prerelease: 'dev' }],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { type: 'chore', scope: 'deps', release: 'patch' },
          { type: 'docs', scope: 'README', release: 'patch' },
          { scope: 'no-release', release: false },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    ['@semantic-release/github', { assets: 'node-red-contrib-z2m-*.tgz' }],
    ['@semantic-release/npm', { tarballDir: '.' }],
  ],
};
