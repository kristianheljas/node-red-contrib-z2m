/**
 * Attempts to detect if npm script is run in project root directory and exits with exit code 1 when not.
 *
 * Usage example:
 * ```
 * "scripts": {
 *    "prepare": "node scripts/not-project-root.js || husky install"
 * }
 * ```
 * Now husky will run only when executed in project root so `npm install /path/to/node-red-contrib-z2m` would still work
 */

const { resolve } = require('path');

const projectRoot = resolve(__dirname, '..');
const has = Object.prototype.hasOwnProperty;

let inProjectRoot = false;
if (has.call(process.env, 'INIT_CWD')) {
  // Package managers set INIT_CWD to from where the command was called
  inProjectRoot = process.env.INIT_CWD === projectRoot;
} else if (has.call(process.env, 'PWD')) {
  // PWD is not affected by process.chdir()
  inProjectRoot = process.env.PWD === projectRoot;
} else {
  // Finally, fall back to process.cwd()
  inProjectRoot = process.cwd() === projectRoot;
}

process.exit(inProjectRoot ? 1 : 0);
