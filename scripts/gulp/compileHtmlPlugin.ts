/* eslint-disable no-param-reassign */
import ejs from 'ejs';
import fs from 'fs';
import { join } from 'path';
import PluginError from 'plugin-error';
import { Transform } from 'stream';
import through, { TransformFunction } from 'through2';
import Vinyl from 'vinyl';

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

  file.extname = '.html';

  // If html file already exists, skip everything else
  if (await exists(file.path)) {
    file.contents = await readFile(file.path);
    callback(null, file);
    return;
  }

  const { cwd, base, dirname, stem } = file;
  const viewsPath = join(cwd, base, 'views');
  const editorViewsPath = join(cwd, base, 'editor');

  const nodePath = join(dirname, 'node.ts');
  const node = require(nodePath).default; // eslint-disable-line

  const templatePath = join(dirname, `${stem}.ejs`);
  const templateData: ejs.Data = { node };
  const templateOptions: ejs.Options = {
    views: [dirname, editorViewsPath, viewsPath],
  };

  try {
    if (await exists(templatePath)) {
      file.contents = await ejs.renderFile(templatePath, templateData, templateOptions).then(Buffer.from);
      callback(null, file);
      return;
    }

    const defaultTemplate = join(viewsPath, 'default-index.ejs');
    file.contents = await ejs.renderFile(defaultTemplate, templateData, templateOptions).then(Buffer.from);
    callback(null, file);
  } catch (err) {
    callback(new PluginError('Something went wrong when compiling template!', err));
  }
};

export default (): Transform => through.obj(transform);
