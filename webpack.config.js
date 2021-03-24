const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/frontend',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'frontend/[name].js',
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
};
