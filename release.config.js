/* eslint-disable no-template-curly-in-string */
module.exports = {
  branches: ['main', { name: 'dev', prerelease: 'dev' }],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { type: 'chore', scope: 'deps', release: 'patch' },
          { type: 'docs', scope: 'readme', release: 'patch' },
          { scope: 'no-release', release: false },
          { scope: 'release-patch', release: 'patch' },
          { scope: 'release-minor', release: 'minor' },
          { scope: 'release-major', release: 'major' },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    ['@semantic-release/github', { assets: 'node-red-contrib-z2m-*.tgz' }],
    ['@semantic-release/npm', { tarballDir: '.' }],
  ],
};
