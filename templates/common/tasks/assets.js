"use strict";

var gulp = require("gulp");
var util = require("gulp-util");
var size = require("gulp-size");

gulp.task("assets", function () {

  var buildDir = util.env.buildDir;
  var assetsDir = util.env.assetsDir;

  return gulp.src(assetsDir + "/**/*")
    .pipe(size({
      title: "assets"
    }))
    .pipe(gulp.dest(buildDir + "/"));
});
