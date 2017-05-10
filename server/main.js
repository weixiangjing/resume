"use strict";


const express = require('express')
const debug = require('debug')('app:server')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config')
const project = require('../config/project.config')
const compress = require('compression');
const proxy =require('http-proxy-middleware');
const fs = require('fs');

const app = express()
process.env.NAME="BMS";
// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement universal
// rendering, you'll want to remove this middleware.
app.use(require('connect-history-api-fallback')())

// Apply gzip compression
app.use(compress())




// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
function initMiddleware() {
    if (project.env === 'development') {
        const compiler = webpack(webpackConfig)

        debug('Enabling webpack dev and HMR middleware')
        app.use(require('webpack-dev-middleware')(compiler, {
            publicPath  : webpackConfig.output.publicPath,
            contentBase : project.paths.client(),
            hot         : true,
            quiet       : project.compiler_quiet,
            noInfo      : project.compiler_quiet,
            lazy        : false,
            stats       : project.compiler_stats
        }))
        app.use(require('webpack-hot-middleware')(compiler))
        app.use(project.devProxyServer.uri, proxy(project.devProxyServer.options));
        // Serve static assets from ~/public since Webpack is unaware of
        // these files. This middleware doesn't need to be enabled outside
        // of development since this directory will be copied into ~/dist
        // when the application is compiled.
        app.use(express.static(project.paths.public()))
    } else {
        debug(
            'Server is being run outside of live development mode, meaning it will ' +
            'only serve the compiled application bundle in ~/dist. Generally you ' +
            'do not need an application server for this and can instead use a web ' +
            'server such as nginx to serve your static files. See the "deployment" ' +
            'section in the README for more information on deployment strategies.'
        )

        // Serving ~/dist by default. Ideally these files should be served by
        // the web server and not the app server, but this helps to components the
        // server in production.
        app.use(express.static(project.paths.dist()))
    }
}

function preBuildVendor() {
    const path = require('path');
    let jsFiles = [];
    Object.keys(project.preload_dist).forEach((name)=>{
        let dir = path.join(process.cwd(),'node_modules',name);
        let item = project.preload_dist[name];
        let jsFile = path.join(dir,item.dist);
        webpackConfig.externals[item] = item.global;
        jsFiles.push({file:jsFile,name:name,standalone:item.global});
    });
    return new Promise((resolve,reject)=>{
        let index = 0;
        let list = [];
        next();
        function next() {
            let pkg = jsFiles[index];
            fs.readFile(pkg.file,'utf-8',function (err,rs) {
                if(err)reject(err);
                list.push(rs);
                if(++index<list.length){
                    next();
                }else {
                    resolve(list);
                }
            })
        }
    });
}

exports.init = function(){
  return new Promise((resolve,reject)=> {
        if (project.env === 'development'){
            debug('wait pre build vendor ......');
            preBuildVendor().then(function (jsList) {
                debug('build vendor complete');
                initMiddleware();
                let scripts = jsList.join('\r\n');
                app.use('/__vendor.dev.js',(req,res)=>{
                    res.send(scripts);
                });
                resolve(app);
            }).catch(err=>{
                reject(err);
            })
        }else {
            resolve(app);
        }
    });
};