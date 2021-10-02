/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:promise/recommended',
    'plugin:node/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  rules: {
    // Typescript transpiles imports to require
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
    'node/no-missing-import': ['error', { tryExtensions: ['.js', '.json', '.node', '.ts'] }],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        // Javascript files dont use imports
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['src/**/*{js,ts}'],
      parserOptions: {
        // Check source files with correct tsconfig
        project: './tsconfig.json',
      },
    },
    {
      files: ['src/editor/**/*', 'src/nodes/**/editor.ts'],
      rules: {
        // Broswer code should be able to log warning and errors to console
        'no-console': ['warn', { allow: ['warn', 'error'] }],
      },
    },
    {
      files: ['./*.{js,ts}', 'scripts/**/*.{js,ts}'],
      rules: {
        // scripts in ./ and scripts/ folder should be happy with devDependencies as they are development tools
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
};
