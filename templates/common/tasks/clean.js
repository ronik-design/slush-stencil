"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const del = require("del");


gulp.task("clean", (cb) => {

  const watching = util.env.watching;

  const buildDir = util.env["build-dir"];
  const deployDir = util.env["deploy-dir"];

  const dirs = [`${buildDir}/**/*`];

  if (!watching && deployDir) {
    dirs.push(`${deployDir}/**/*`);
  }

  del.sync(dirs);

  cb();
});
