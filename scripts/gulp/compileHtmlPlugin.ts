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
    callback('Only buffers are supported');
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

  const { dirname, stem } = file;

  const templatePath = join(dirname, `${stem}.ejs`);

  if (await exists(templatePath)) {
    file.contents = await ejs.renderFile(templatePath).then(Buffer.from);
    callback(null, file);
    return;
  }

  callback(new PluginError(`No suitable templates found for '${relativeTsPath}'`, __filename));
};

export default (): Transform => through.obj(transform);
