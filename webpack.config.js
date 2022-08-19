const { resolve } = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');
const webpack = require('webpack');

module.exports = {
  entry: './app/main.js',
  output: {
    path: resolve(
      __dirname,
      '../../../../../../www/assets/aws2/vuejs/stark/status-management'
    ),
    filename: 'status-management.umd.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
        },
      },
      {
        test: /\.(scss|css|sass)$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: resolve(
                __dirname,
                'app/assets/styles/_variables.scss'
              ),
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules\/(?!bootstrap-vue\/src\/)/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      'bootstrap-vue$': 'bootstrap-vue/src/index.js',
      '@': resolve(__dirname, 'app/'),
      process: 'process/browser',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    compress: true,
    hot: true,
  },
  performance: {
    hints: false,
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new ESLintPlugin(),
    new VueLoaderPlugin(),
    new SourceMapDevToolPlugin({
      filename: 'status-management.umd.map',
      exclude: ['vendor.js'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    }),
  ]);
}
