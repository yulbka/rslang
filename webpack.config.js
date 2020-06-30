const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const root = path.resolve(__dirname, './'),
  distPath = `${root}/dist`,
  mode = process.env.NODE_ENV,
  isDev = mode === 'development',
  isProd = mode === 'production';

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  devtool: isDev ? 'eval-source-map' : 'none',
  devServer: {
    contentBase: distPath,
    overlay: true,
  },
  resolve: {
    alias: {
      api: `${root}/src/api`,
      assets: `${root}/src/assets`,
      components: `${root}/src/components`,
      utils: `${root}/src/utils`,
      store: `${root}/src/store`,
      pages: `${root}/src/pages`,

      js: `${root}/src/js`,
      scripts: `${root}/src/scripts`,
    },
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitError: true,
          quiet: true,
          failOnError: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: { path: `${root}/configs/stylization/postcss.config.js` },
              sourceMap: isDev && 'inline',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
  output: {
    filename: '[name].bundle.js',
    path: distPath,
  },
};
