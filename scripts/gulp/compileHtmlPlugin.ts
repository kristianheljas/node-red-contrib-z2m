/* eslint-disable no-param-reassign */
import { Transform } from 'stream';
import Vinyl from 'vinyl';
import ejs from 'ejs';
import { join } from 'path';
import through, { TransformFunction } from 'through2';

import PluginError from 'plugin-error';
import fs from 'fs';

const { stat, readFile } = fs.promises;

const exists = async (path: string): Promise<boolean> =>
  stat(path)
    .then(() => true)
    .catch(() => false);

const transform: TransformFunction = async (file: Vinyl, encoding, callback) => {
  if (!file.isBuffer()) {
    callback(new PluginError('Only buffers are supported for ejs compilation!', __filename));
    return;
  }

  const relativeTsPath = file.relative;

  file.extname = '.html';

  // If html file already exists, skip everything else
  if (await exists(file.path)) {
    file.contents = await readFile(file.path);
    callback(null, file);
    return;
  }

  const { cwd, base, dirname, stem } = file;
  const viewsPath = join(cwd, base, 'views');

  const templatePath = join(dirname, `${stem}.ejs`);
  const templateData: ejs.Data = {};
  const templateOptions: ejs.Options = {
    views: [viewsPath],
  };

  if (await exists(templatePath)) {
    file.contents = await ejs.renderFile(templatePath, templateData, templateOptions).then(Buffer.from);
    callback(null, file);
    return;
  }

  callback(new PluginError(`No suitable templates found for '${relativeTsPath}'`, __filename));
};

export default (): Transform => through.obj(transform);
