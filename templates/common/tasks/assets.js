"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");
const notify = require("gulp-notify");
const size = require("gulp-size");

const errorHandler = notify.onError();

gulp.task("assets", () => {

  const watching = util.env.watching;

  const assetsDir = util.env["assets-dir"];

  const srcDir = `${assetsDir}/**/*`;
  const destDir = util.env["build-dir"];

  return gulp.src(srcDir)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(size({ title: "assets" }))
    .pipe(gulp.dest(destDir));
});
