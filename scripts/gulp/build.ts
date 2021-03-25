import { spawn } from 'child_process';
import log from 'fancy-log';
import fs from 'fs';
import { dest, parallel, src, watch } from 'gulp';
import minimist from 'minimist';
import nodemon from 'nodemon';
import rimraf from 'rimraf';
import { TaskFunction } from 'undertaker';
import compileHtmlPlugin from './compileHtmlPlugin';

const argv = minimist(process.argv.slice(2));

// not using import "fs/promises" to remain compatible with node v12
const { mkdir, stat } = fs.promises;

const stdio = 'inherit';

const binFolder = './node_modules/.bin/';

const webpackBin = `${binFolder}/webpack`;
const webpackArgs = ['--config', argv.project || 'webpack.config.ts'];

const tscBin = `${binFolder}/tsc`;
const tscArgs = ['--project', argv.project || 'tsconfig.build.json'];

const nodeRedBin = `${binFolder}/node-red`;

/* #region Cleanup tasks */

export const clean: TaskFunction = (done) => {
  rimraf('dist', done);
};

/* #endregion */
/* #region Build tasks */

export const buildFrontend: TaskFunction = () => spawn(webpackBin, webpackArgs, { stdio });

export const buildTypescript: TaskFunction = () => spawn(tscBin, tscArgs, { stdio });

export const compileHtml: TaskFunction = () =>
  src(['./src/nodes/**/index.ts'], { base: 'src' }).pipe(compileHtmlPlugin()).pipe(dest('dist'));

/* #endregion */
/* #region Development tasks */

export const watchFrontend: TaskFunction = () => spawn(webpackBin, [...webpackArgs, '--watch'], { stdio });

export const watchTypescript: TaskFunction = () =>
  spawn(
    tscBin,
    [
      ...tscArgs,
      // dist/.tsbuildinfo notifies watcher of complete build
      '--incremental',
      '--tsBuildInfoFile',
      'dist/.tsbuildinfo',
      // Do not clear output
      '--preserveWatchOutput',
      // Keep watching files
      '--watch',
    ],
    {
      stdio,
    },
  );

export const watchHtml: TaskFunction = () => watch('src/nodes/**/*', { ignoreInitial: false }, compileHtml);

export const waitForBuild: TaskFunction = async () => {
  // Waits for initial watcher process to finish building the first time

  // watcher doesn't work if directory does not exist
  const stats = await stat('dist').catch(() => false);
  if (stats === false) await mkdir('dist');

  return new Promise((resolve, reject) => {
    const watcher = watch('dist/.tsbuildinfo', () => {
      watcher.close(); // only listening once just to detect when inital build has completed
      resolve(true);
    });
    watcher.on('error', reject);
  });
};

export const startDevServer: TaskFunction = (done) => {
  const monitor = nodemon({
    watch: ['package.json', '.node-red/settings.js', 'dist/**/*'],
    ext: '*',
    script: `${nodeRedBin}`,
    args: ['--userDir', '.node-red'],
    stdin: false,
    delay: 1000,
  });

  monitor.on('restart', () => log('file change detected, restarting server...'));
  monitor.on('quit', () => done());
};

/* #endregion */

export const buildAll = parallel(buildTypescript, buildFrontend, compileHtml);
export const watchAll = parallel(watchTypescript, watchFrontend, watchHtml);
