const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const threadLoader = require('thread-loader');
const postcssNormalize = require('postcss-normalize');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

threadLoader.warmup({}, ['babel-loader']);

const {
  bundleAnalyzer,
  output,

  name,
  version,
  gitBranch,
  gitCommitHash,
  buildTime,
} = require('../../config');
const paths = require('../../config/paths');
const nodeEnv = process.env.NODE_ENV;
const buildTarget = process.env.BUILD_TARGET;

const isDevelopment = nodeEnv === 'development';
const isProduction = nodeEnv === 'production';

function getCSSModuleLocalIdent(context, localIdentName, localName, options) {
  const resourcePath = context.resourcePath.replace(/\\/g, '/');
  return `${resourcePath.split('/').slice(-5, -1).join('_')}__${localName}`;
}

function getStyleLoaders(useCssModule, isLessLoader) {
  const loaders = [
    isDevelopment ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: Object.assign(
        {},
        useCssModule
          ? {
              modules: isDevelopment
                ? {
                    getLocalIdent: getCSSModuleLocalIdent,
                  }
                : true,
            }
          : {},
      ),
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: {
          ident: 'postcss',
          config: false,
          plugins: [
            require.resolve('postcss-flexbugs-fixes'),
            [
              require.resolve('postcss-preset-env'),
              {
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              },
            ],
            postcssNormalize(),
          ],
        },
      },
    },
  ];

  if (isLessLoader) {
    loaders.push(
      {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
      {
        loader: require.resolve('style-resources-loader'),
        options: {
          injector: 'prepend',
          patterns: [paths.globalLessVarsAndMixins],
        },
      },
    );
  }
  return loaders.filter(Boolean);
}

const webpackBaseConfig = {
  cache: {
    // 1. 将缓存类型设置为文件系统
    type: 'filesystem',

    buildDependencies: {
      // 2. 将你的 config 添加为 buildDependency，以便在改变 config 时获得缓存无效
      config: [__filename],

      // 3. 如果你有其他的东西被构建依赖，你可以在这里添加它们
      // 注意，webpack、加载器和所有从你的配置中引用的模块都会被自动添加
    },
  },
  // web or electron-renderer 如果想运行于浏览器，target设为web，同时请注意渲染线程代码
  target: buildTarget === 'electron' ? 'electron-renderer' : 'web',
  entry: {
    app: [paths.appWebEntryFile],
  },
  output: {
    globalObject: 'this',
    path: paths.appWebDistPath,
    publicPath: output.publicPath,
    pathinfo: !isProduction,
    filename: 'statics/scripts/[name]-[chunkhash:8].js',
    chunkFilename: 'statics/scripts/[name]-[chunkhash:8].chunk.js',
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: paths.appWebEntryDir,
        use: [
          require.resolve('thread-loader'),
          {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: false,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: getStyleLoaders(false, false),
      },
      {
        test: /\.module\.css$/,
        exclude: /\.module\.css$/,
        use: getStyleLoaders(true, false),
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: getStyleLoaders(false, true),
      },
      {
        test: /\.module\.less$/,
        exclude: /node_modules/,
        use: getStyleLoaders(true, true),
      },
      {
        test: /\.(png|jpg|jpeg|bmp|gif)$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10240,
          name: 'statics/assets/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.svg$/,
        include: paths.spriteSvgPath,
        loader: require.resolve('svg-sprite-loader'),
        options: { symbolId: 'icon-[name]' },
      },
    ],
  },
  resolve: {
    symlinks: false,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': paths.appWebEntryDir,
    },
  },
  plugins: [
    new WebpackBar({
      name: buildTarget === 'electron' ? 'Electron Render' : 'webpack',
      profile: true,
    }),
    new webpack.DefinePlugin({
      'process.env.APP_NAME': JSON.stringify(name),
      'process.env.APP_VERSION': JSON.stringify(version),
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),

      'process.env.BUILD_TARGET': JSON.stringify(buildTarget),
    }),
    bundleAnalyzer &&
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerPort: 'auto',
        reportTitle: `${
          buildTarget === 'electron' ? '渲染线程代码 - ' : ''
        }${name} - [${buildTime}]`,
      }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        enabled: true,
        async: isDevelopment,
        mode: 'write-references',
        configFile: paths.appWebTsConfig,
        diagnosticOptions: {
          syntactic: true,
          semantic: true,
          declaration: true,
          global: true,
        },
      },
    }),
    new ESLintWebpackPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      formatter: require.resolve('react-dev-utils/eslintFormatter'),
      eslintPath: require.resolve('eslint'),
      context: paths.appWebEntryDir,
      cwd: paths.appRootPath,
      resolvePluginsRelativeTo: __dirname,
      cache: process.env.NODE_ENV === 'development',
    }),
    new StylelintPlugin({
      fix: true,
      context: paths.appWebEntryDir,
      files: ['**/*.(le|c)ss'],
      extensions: ['css', 'less'],
      exclude: [paths.globalLessVarsAndMixins],
      cache: process.env.NODE_ENV === 'development',
      customSyntax: 'postcss'
    }),
    new AntdDayjsWebpackPlugin(),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          publicPath: output.publicPath,
          template: paths.appWebHtmlTpl,
          meta: {
            name,
            version,
            branch: gitBranch,
            hash: gitCommitHash,
            build: buildTime,
          },
        },
        isProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined,
      ),
    ),
  ].filter(Boolean),
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

module.exports = webpackBaseConfig;
