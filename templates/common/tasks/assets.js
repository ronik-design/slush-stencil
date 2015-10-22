"use strict";

var gulp = require("gulp");
var util = require("gulp-util");
var plumber = require("gulp-plumber");
var gulpIf = require("gulp-if");
var notify = require("gulp-notify");
var size = require("gulp-size");


gulp.task("assets", function () {

  var watching = util.env.watching;
  var buildDir = util.env.buildDir;
  var assetsDir = util.env.assetsDir;

  return gulp.src(assetsDir + "/**/*")
    .pipe(gulpIf(watching, plumber({ errorHandler: notify.onError() })))
    .pipe(size({ title: "assets" }))
    .pipe(gulp.dest(buildDir + "/"));
});
