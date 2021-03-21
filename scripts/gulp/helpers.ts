import fs from 'fs';
import log from 'fancy-log';
import PluginError from 'plugin-error';
import { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';

// not using import "fs/promises" to remain compatible with node v12
const { stat, readFile, writeFile, copyFile, rm } = fs.promises;

/* #region package.json manipulation */
export const readPackageJson = (): PackageJson => readFile('package.json', 'utf-8').then(JSON.parse);

export const writePackageJson = (packageJson: PackageJson): Promise<void> =>
  writeFile('package.json', JSON.stringify(packageJson, null, 2));
/* #endregion */

/* #region File backups */
export async function createBackup(filePath: string): Promise<void> {
  log(`restoring '${filePath}' from backup`);
  const backupPath = `${filePath}.bak`;
  const backupStat = await stat(backupPath).catch(() => false);
  if (backupStat) {
    throw new PluginError(__filename, `${backupPath} already exists, did you forget to clean up?`);
  }
  await copyFile(filePath, backupPath);
}

export async function restoreBackup(filePath: string): Promise<void> {
  log(`backing up '${filePath}'`);
  const backupPath = `${filePath}.bak`;
  const backupStat = await stat(backupPath).catch(() => {
    throw new PluginError(__filename, `${backupPath} not found, are you sure this was backed up?`);
  });

  const currentTime = new Date().getTime();
  const backupCreated = backupStat.ctime.getTime();
  if (currentTime - backupCreated > 60000) {
    throw new PluginError(__filename, `${backupPath} is older than 1 minute, please restore it manually!`);
  }

  await copyFile(backupPath, filePath);
  await rm(backupPath);
}
/* #endregion */
