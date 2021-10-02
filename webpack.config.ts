import globby from 'globby';
import path from 'path';
import { Configuration } from 'webpack';

module.exports = {
  mode: 'development',
  entry: {
    vendor: './src/editor/vendor.ts',
    core: {
      import: './src/editor/core.ts',
      dependOn: 'vendor',
    },
    nodes: {
      import: globby.sync('./src/nodes/**/editor.ts'),
      dependOn: 'core',
    },
  },
  externals: {
    jquery: 'jQuery',
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
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
} as Configuration;
