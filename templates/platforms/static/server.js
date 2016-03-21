"use strict";

const HTTP_CODE_NOT_FOUND = 404;
const YEAR_MS = 31536000000;

/* $lab:coverage:off$ */
const DEFAULT_PORT = 8080;
const STENCIL = require("./stencil.json");
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || DEFAULT_PORT;
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
      expiresIn: 1 * YEAR_MS
    }
  }
}]);

if (STENCIL.singlePageApplication) {
  server.ext("onPreResponse", (request, reply) => {

    if (request.response.isBoom) {
      if (request.response.output.statusCode === HTTP_CODE_NOT_FOUND) {
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
