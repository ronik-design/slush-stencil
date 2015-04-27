/* $lab:coverage:off$ */
var PARAMS = require('./params.json');
var HOST = process.env.HOST || '0.0.0.0';
var PORT = process.env.PORT || 8080;
/* $lab:coverage:on$ */

var path = require('path');
var hapi = require('hapi');
var bole = require('bole');
var boleConsole = require('bole-console');

var log = bole('server');
var boleConsoleStream = boleConsole();
bole.output({
    level: 'info',
    stream: boleConsoleStream
});

var server = new hapi.Server();

var buildDir = path.join(__dirname, PARAMS.buildDir);

server.connection({
    host: HOST,
    port: PORT
});

server.route([{
    method: 'GET',
    path: '/',
    handler: {
        file: path.join(buildDir, 'index.html')
    }
}, {
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: buildDir
        }
    },
    config: {
        cache: {
            expiresIn: 1 * 365 * 24 * 60 * 60 * 1000
        }
    }
}]);

if (PARAMS.singlePageApplication) {
    server.ext('onPreResponse', function (request, reply) {

        if (request.response.isBoom) {
            if (request.response.output.statusCode === 404) {
                return reply.file(path.join(buildDir, 'index.html'));
            }
        }

        reply.continue();
    });
}

server.start(function () {

    log.info('Listening at: http://%s:%d', HOST, PORT);
});

module.exports = server;
