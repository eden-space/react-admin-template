const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { merge: webpackMerge } = require('webpack-merge');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const { dllConfig } = require('../../config');
const paths = require('../../config/paths');
const webpackBaseConfig = require('./webpack.base.config');

const dllScriptExists = fs.existsSync(path.resolve(paths.appWebDllPath, dllConfig.filename));
const dllJsonExists = fs.existsSync(path.resolve(paths.appWebDllPath, dllConfig.manifest));
const canUseDll = dllScriptExists && dllJsonExists;

const webpackDevConfig = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    publicPath: '/',
    filename: '[name]-[fullhash:8].js',
  },
  resolve: {
    alias: {},
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
    canUseDll &&
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(path.resolve(paths.appWebDllPath, dllConfig.manifest)),
      }),
    canUseDll &&
      new AddAssetHtmlWebpackPlugin({
        filepath: require.resolve(path.resolve(paths.appWebDllPath, dllConfig.filename)),
      }),
  ].filter(Boolean),
  optimization: {
    moduleIds: 'named',
    emitOnErrors: false,
  },
};

const config = webpackMerge(webpackBaseConfig, webpackDevConfig);

module.exports = config;
