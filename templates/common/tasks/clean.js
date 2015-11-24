"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const del = require("del");


gulp.task("clean", (cb) => {

  const watching = util.env.watching;
  const buildDir = util.env.buildDir;
  const deployDir = util.env.deployDir;

  const cleanDirs = [`${buildDir}/**/*`];

  if (!watching && deployDir) {
    cleanDirs.push(`${deployDir}/**/*`);
  }

  del.sync(cleanDirs);

  cb();
});
