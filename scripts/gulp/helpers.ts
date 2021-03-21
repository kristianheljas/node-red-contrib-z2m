import fs from 'fs';
import PluginError from 'plugin-error';

// not using import "fs/promises" to remain compatible with node v12
const { stat, copyFile, rm } = fs.promises;

/* #region File backups */
export async function createBackup(filePath: string): Promise<void> {
  const backupPath = `${filePath}.bak`;
  const backupStat = await stat(backupPath).catch(() => false);
  if (backupStat) {
    throw new PluginError(__filename, `${backupPath} already exists, did you forget to clean up?`);
  }
  await copyFile(filePath, backupPath);
}

export async function restoreBackup(filePath: string): Promise<void> {
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
