/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { spawn } from 'child_process';
import { dest, parallel, series, src, task, watch } from 'gulp';
import rimraf from 'rimraf';
import { TaskFunction } from 'undertaker';

const stdio = 'inherit';
const tscBin = './node_modules/.bin/tsc';

/* #region Cleanup tasks */

export const clean: TaskFunction = (done) => {
  rimraf('dist', done);
};

/* #endregion */
/* #region Build tasks */

const buildTypescript: TaskFunction = () => {
  return spawn(tscBin, { stdio });
};

const copyHtml: TaskFunction = () => {
  return src('src/**/*.html').pipe(dest('dist'));
};

/* #endregion */
/* #region Development tasks */

const watchTypescript: TaskFunction = () => {
  return spawn(tscBin, ['--watch', '--preserveWatchOutput'], { stdio });
};

const watchHtml: TaskFunction = () => {
  return watch('src/**/*.html', { ignoreInitial: false }, copyHtml);
};

/* #endregion */
/* #region Combined tasks */

const buildAll = parallel(buildTypescript, copyHtml);
const watchAll = parallel(watchTypescript, watchHtml);

task('build', series(clean, buildAll));
task('watch', series(clean, watchAll));

task('default', task('build'));

/* #endregion */
