import { parallel, series, task } from 'gulp';
import { clean, buildAll, watchAll, waitForBuild, startDevServer } from './scripts/gulp/build';
import { preparePackageJson, restorePackageJson } from './scripts/gulp/release';

// Build tasks
task('build', series(clean, buildAll));
task('watch', series(clean, watchAll));
task('start', series(clean, parallel(watchAll, series(waitForBuild, startDevServer))));

// Release tasks
task('prepack', series(task('build'), preparePackageJson));
task('postpack', series(restorePackageJson));

// Build by default
task('default', task('build'));
