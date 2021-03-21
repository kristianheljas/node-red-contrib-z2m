/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { spawn } from 'child_process';
import fs from 'fs';
import { dest, parallel, series, src, task, watch } from 'gulp';
import log from 'fancy-log';
import nodemon from 'nodemon';
import rimraf from 'rimraf';
import { TaskFunction } from 'undertaker';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

// not using import "fs/promises" to remain compatible with node v12
const { mkdir, stat } = fs.promises;

const stdio = 'inherit';

const binFolder = './node_modules/.bin/';

const tscBin = `${binFolder}/tsc`;
const tscArgs = ['--project', argv.project || 'tsconfig.json'];

const nodeRedBin = `${binFolder}/node-red`;

/* #region Cleanup tasks */

export const clean: TaskFunction = (done) => {
  rimraf('dist', done);
};

/* #endregion */
/* #region Build tasks */

const buildTypescript: TaskFunction = () => {
  return spawn(tscBin, tscArgs, { stdio });
};

const copyHtml: TaskFunction = () => {
  return src('src/**/*.html').pipe(dest('dist'));
};

/* #endregion */
/* #region Development tasks */

export const watchTypescript: TaskFunction = () => {
  return spawn(
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
};

const watchHtml: TaskFunction = () => {
  return watch('src/**/*.html', { ignoreInitial: false }, copyHtml);
};

const waitForInitialBuild: TaskFunction = async () => {
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

export const startServerMonitor: TaskFunction = (done) => {
  const monitor = nodemon({
    watch: ['package.json', '.node-red/settings.js', 'dist/**/*'],
    ext: '*',
    script: `${nodeRedBin}`,
    args: ['--userDir', '.node-red'],
    stdin: false,
    delay: 200,
  });

  monitor.on('restart', () => log('file change detected, restarting server...'));
  monitor.on('quit', () => done());
};

/* #endregion */
/* #region Combined tasks */

const buildAll = parallel(buildTypescript, copyHtml);
const watchAll = parallel(watchTypescript, watchHtml);

task('build', series(clean, buildAll));
task('watch', series(clean, watchAll));
task('start', series(clean, parallel(watchAll, series(waitForInitialBuild, startServerMonitor))));

task('default', task('build'));

/* #endregion */
