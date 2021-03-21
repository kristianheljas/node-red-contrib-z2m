import fs from 'fs';
import log from 'fancy-log';
import globby from 'globby';
import { TaskFunction } from 'undertaker';
import { createBackup, readPackageJson, restoreBackup, writePackageJson } from './helpers';

// not using import "fs/promises" to remain compatible with node v12
const { rm } = fs.promises;

export const cleanNpmPacks: TaskFunction = async () => {
  log('cleaning up npm pack files');
  const { name } = await readPackageJson();
  const packFiles = await globby(`${name}-*.tgz`);

  if (packFiles.length) {
    return Promise.all(
      packFiles.map((packFile) => {
        log(`deleting '${packFile}'`);
        return rm(packFile);
      }),
    );
  }

  return Promise.resolve();
};

export const preparePackageJson: TaskFunction = async () => {
  await createBackup('package.json');

  const pJson = await readPackageJson();

  // Remove unecessary fields
  delete pJson.private;
  delete pJson.scripts;
  delete pJson.devDependencies;

  return writePackageJson(pJson);
};

export const restorePackageJson: TaskFunction = () => restoreBackup('package.json');
