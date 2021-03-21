import { parallel, series, task } from 'gulp';
import { clean, buildAll, watchAll, waitForBuild, startDevServer } from './scripts/gulp/build';
import { cleanNpmPacks, preparePackageJson, restorePackageJson } from './scripts/gulp/release';

// Build tasks
task('clean', parallel(clean, cleanNpmPacks));
task('build', series(clean, buildAll));
task('watch', series(clean, watchAll));
task('start', series(clean, parallel(watchAll, series(waitForBuild, startDevServer))));

// Release tasks
task('prepack', parallel(task('build'), cleanNpmPacks, preparePackageJson));
task('postpack', series(restorePackageJson));

// Build by default
task('default', task('build'));
