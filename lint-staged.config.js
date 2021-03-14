const prettier = require('prettier');

const prettierExtensions = prettier
  // List all supported extensions
  .getSupportInfo()
  .languages.map(({ extensions }) => extensions)
  .flat()
  // Remove dots
  .map((extension) => extension.substr(1))
  // Remove separately formatted extentsions
  .filter((extension) => ['js', 'jsx', 'ts', 'tsx'].includes(extension));

module.exports = {
  // Lint & fix
  '**/*.{js,jsx,ts,tsx}': [
    'eslint --cache --fix', // Fix possible eslint issues
    'prettier --write', // Ensure uniformed formatting
    'eslint --cache', // Sanity check - is eslint still happy after prettier?
  ],
  // Type check typescript files - some things are still missed by linter (ie. type imports)
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  // Ensure uniformed formatting on other files as well
  [`**/*.{${prettierExtensions.join(',')}}`]: 'prettier --write',
  // Sort package.json - for better diffs
  'package.json': 'sort-package-json',
};
