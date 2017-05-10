/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path')
const debug = require('debug')('app:config:project')
const argv = require('yargs').argv
const ip = require('ip')

debug('Creating default configuration.')
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_client : 'src',
  dir_dist   : 'dist',
  dir_public : 'public',
  dir_server : 'server',
  dir_test   : 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : ip.address(), // use string 'localhost' to prevent exposure on local network
  server_port : process.env.PORT || 3031,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel : {
    cacheDirectory : true,
    plugins        : ['transform-runtime'],
    presets        : ['es2015', 'react', 'stage-0']
  },
  compiler_devtool         : 'eval-source-map',
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : './',
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true
  },
  compiler_vendors : [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'immutable',
      'axios',
      // 'antd',
      // 'rx-lite',
      'moment'
  ],
  preload_dist:{
      'react':{
          dist:'dist/react-with-addons.js',
          global:'window.React'
      },
      'react-dom':{
          dist:'dist/react-dom.js',
          global:'window.ReactDOM'
      },
      'react-redux':{
          dist:'dist/react-redux.min.js',
          global:'window.ReactRedux'
      },
      'react-router':{
          dist:'umd/ReactRouter.min.js',
          global:'window.ReactRouter'
      },
      'redux':{
          dist:'dist/redux.min.js',
          global:'window.Redux'
      },
      'immutable':{
          dist:'dist/immutable.min.js',
          global:'window.Immutable'
      },
      'axios':{
          dist:'dist/axios.min.js',
          global:'window.axios'
      },
      'antd':{
          dist:'dist/antd.js',
          global:'window.antd'
      },
      'rx-lite':{
          dist:'rx.lite.min.js',
          global:'window.Rx'
      },
      'moment':{
          dist:'min/moment.min.js',
          global:'window.moment'
      }
  },

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters : [
    { type : 'text-summary' },
    { type : 'lcov', dir : 'coverage' }
  ]
}

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__TEST__'     : config.env === 'test',
  '__COVERAGE__' : !argv.watch && config.env === 'test',
  '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json')

process.version=pkg.version;

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/config/index.js`
    )
  });
Object.keys(config.preload_dist).forEach((key)=>{
  if(config.compiler_vendors.indexOf(key) == -1){
    delete config.preload_dist[key];
  }
});

// ------------------------------------
// Utilities
// ------------------------------------
function base () {
  const args = [config.path_base].concat([].slice.call(arguments))
  return path.resolve.apply(path, args)
}

config.paths = {
  base   : base,
  client : base.bind(null, config.dir_client),
  public : base.bind(null, config.dir_public),
  dist   : base.bind(null, config.dir_dist)
}

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments.config')
const overrides = environments[config.env]
if (overrides) {
  debug('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, defaults will be used.')
}

config.devProxyServer = {
    uri:'/api',
    options:{
        target: 'http://123.56.84.239:8088/billingServer', // target host
        changeOrigin: true,               // needed for virtual hosted sites
        logLevel: 'debug',
        ws: true,                       // proxy websockets
        // pathRewrite: {
        //     '^/api/old-path' : '/api/new-path',     // rewrite path
        //     '^/api/remove/path' : '/path'           // remove base path
        // },
        // router: {
        //     'dev.localhost:3000' : 'http://localhost:8000'
        // }
    }
};
module.exports = config
