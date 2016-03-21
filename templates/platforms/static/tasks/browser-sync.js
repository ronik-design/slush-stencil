"use strict";

const path = require("path");
const fs = require("fs");
const url = require("url");
const gulp = require("gulp");
const util = require("gulp-util");
const watch = require("gulp-watch");
const browserSync = require("browser-sync");

const DEFAULT_PORT = 2002;

const middleware = function (buildDir) {

  return function (req, res, next) {

    const requestPath = url.parse(req.url);
    const fileName = requestPath.href.split(requestPath.search).join("");
    const fileExists = fs.existsSync(path.join(buildDir, fileName));
    if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
      req.url = "/index.html";
    }
    return next();
  };
};

gulp.task("browser-sync", () => {

  const buildDir = util.env["build-dir"];

  const host = util.env.host || "localhost";
  const port = util.env.port || DEFAULT_PORT;
  const spa = util.env.spa;

  const server = {
    baseDir: buildDir
  };

  if (spa) {
    server.middleware = middleware(buildDir);
  }

  browserSync({
    open: false,
    ghostMode: false,
    host,
    port,
    server
  });

  util.env.reload = browserSync.reload;

  watch(path.join(buildDir, "**/*.{js,html,css}"), () => {
    browserSync.reload();
  });
});
