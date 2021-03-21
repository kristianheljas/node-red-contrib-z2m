import fs from 'fs';
import { TaskFunction } from 'undertaker';
import { createBackup, restoreBackup } from './helpers';

// not using import "fs/promises" to remain compatible with node v12
const { readFile, writeFile } = fs.promises;

// Prepare package.json for release
export const preparePackageJson: TaskFunction = async () => {
  await createBackup('package.json');

  const pJson = await readFile('package.json', 'utf-8').then(JSON.parse);

  // Remove unecessary fields
  delete pJson.private;
  delete pJson.scripts;
  delete pJson.devDependencies;

  const pJsonString = JSON.stringify(pJson, null, 2);

  return writeFile('package.json', pJsonString);
};

export const restorePackageJson: TaskFunction = () => restoreBackup('package.json');
