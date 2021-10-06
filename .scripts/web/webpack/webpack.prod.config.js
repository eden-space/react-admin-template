const glob = require('glob');
const { merge: webpackMerge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const webpackBaseConfig = require('./webpack.base.config');
const paths = require('../../config/paths');
const { buildEnv, useSourceMap } = require('../../config');
const isProduction = buildEnv === 'production';
const isProductionProfile = isProduction && process.argv.includes('--profile');
const canUseSourceMap = isProduction ? useSourceMap : true;

const webpackProdConfig = {
  mode: 'production',
  bail: true,
  devtool: canUseSourceMap ? 'source-map' : false,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.appPublicAssetsPath,
          to: paths.appWebDistPath,
          globOptions: {
            ignore: ['**/favicon.ico', '**/index.html'],
          },
          noErrorOnMissing: false,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: 'statics/styles/[name].[contenthash:8].css',
      chunkFilename: 'statics/styles/[name].[contenthash:8].chunk.css',
    }),
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${paths.appWebSrc}/**/*`,  { nodir: true }),
    }),
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
    minimizer: [
      new TerserWebpackPlugin({
        exclude: /\.min\.js$/,
        parallel: true,
        extractComments: true,
        terserOptions: {
          compress: {
            ecma: 5,
            inline: 2,
            unused: true,
            warnings: false,
            comparisons: false,
            drop_console: isProduction,
            drop_debugger: true,
          },
          keep_classnames: isProductionProfile,
          keep_fnames: isProductionProfile,
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerWebpackPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
};

module.exports = webpackMerge(webpackBaseConfig, webpackProdConfig);
