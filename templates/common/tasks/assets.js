"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");
const notify = require("gulp-notify");
const size = require("gulp-size");


gulp.task("assets", () => {

  const watching = util.env.watching;
  const buildDir = util.env.buildDir;
  const assetsDir = util.env.assetsDir;
  const errorHandler = notify.onError();

  return gulp.src(`${assetsDir}/**/*`)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(size({ title: "assets" }))
    .pipe(gulp.dest(`${buildDir}/`));
});
