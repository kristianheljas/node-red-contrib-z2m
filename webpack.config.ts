import globby from 'globby';
import path from 'path';
import { Configuration } from 'webpack';

module.exports = {
  mode: 'development',
  entry: {
    nodes: globby.sync('./src/nodes/**/editor.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'editor/[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
} as Configuration;
