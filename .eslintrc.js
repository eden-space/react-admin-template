const OFF = 0;
const WARN = 1;

module.exports = {
  root: true,
  env: { browser: true, commonjs: true, es6: true, node: true },
  settings: {
    'import/ignore': ['node_modules'],
    node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    react: { pragma: 'React', version: '17.0.1', createClass: 'createReactClass' },
  },
  globals: { document: true, window: true, process: true },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
      legacyDecorators: true,
      experimentalObjectRestSpread: true,
    },
    warnOnUnsupportedTypeScriptVersion: true,
    projectFolderIgnoreList: ['dist', '**/node_modules/**'],
  },
  extends: ['jarvis'],
  rules: {
    '@typescript-eslint/no-unsafe-assignment': WARN,
    '@typescript-eslint/no-misused-promises': OFF,
    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,
  },
};
