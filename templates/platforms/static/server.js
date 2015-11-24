"use strict";

/* $lab:coverage:off$ */
const STENCIL = require("./stencil/params.json");
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 8080;
const STATIC_DIR = process.env.WATCHING ? STENCIL.buildDir : STENCIL.deployDir;
/* $lab:coverage:on$ */

const path = require("path");
const hapi = require("hapi");
const bole = require("bole");
const boleConsole = require("bole-console");

const log = bole("server");
const boleConsoleStream = boleConsole();
bole.output({
  level: "info",
  stream: boleConsoleStream
});

const server = new hapi.Server();

const staticDir = path.join(__dirname, STATIC_DIR);

server.connection({
  host: HOST,
  port: PORT
});

server.route([{
  method: "GET",
  path: "/",
  handler: {
    file: path.join(staticDir, "index.html")
  }
}, {
  method: "GET",
  path: "/{param*}",
  handler: {
    directory: {
      path: staticDir
    }
  },
  config: {
    cache: {
      expiresIn: 1 * 365 * 24 * 60 * 60 * 1000
    }
  }
}]);

if (STENCIL.singlePageApplication) {
  server.ext("onPreResponse", (request, reply) => {

    if (request.response.isBoom) {
      if (request.response.output.statusCode === 404) {
        return reply.file(path.join(staticDir, "index.html"));
      }
    }

    reply.continue();
  });
}

server.start(() => {
  log.info("Listening at: http://%s:%d", HOST, PORT);
});

module.exports = server;
