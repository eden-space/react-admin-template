const { APP_NAME: name, APP_VERSION: version, ELECTRON_PACKED, BUILD_ENV } = process.env;

export default {
  buildEnv: BUILD_ENV,
  name,
  version,
  packed: ELECTRON_PACKED === '1',
};
