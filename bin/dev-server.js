const project = require('../config/project.config')
const server = require('../server/main')
const debug = require('debug')('app:bin:dev-server')

server.init().then(function (app) {
    app.listen(project.server_port)
    debug(`Server is now running at http://localhost:${project.server_port}.`)
}).catch(err=>{
    console.error(err);
    process.exit(-1);
});