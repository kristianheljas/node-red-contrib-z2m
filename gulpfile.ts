import { parallel, series, task } from 'gulp';
import { clean, buildAll, watchAll, waitForBuild, startDevServer } from './scripts/gulp/build';

// Build tasks
task('build', series(clean, buildAll));
task('watch', series(clean, watchAll));
task('start', series(clean, parallel(watchAll, series(waitForBuild, startDevServer))));

// Build by default
task('default', task('build'));
