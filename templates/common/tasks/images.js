"use strict";

var gulp = require("gulp");
var util = require("gulp-util");
var changed = require("gulp-changed");
var imagemin = require("gulp-imagemin");
var notify = require("gulp-notify");
var size = require("gulp-size");


gulp.task("svg-images", function () {

  var buildDir = util.env.buildDir;
  var imagesDir = util.env.imagesDir;

  return gulp.src(imagesDir + "/**/!(*.gif|*.jpg|*.png|*.jpeg)")
    .pipe(changed(buildDir + "/images"))
    .on("error", notify.onError())
    .pipe(size({ title: "svg-images" }))
    .pipe(gulp.dest(buildDir + "/images"));
});

gulp.task("images", ["svg-images"], function () {

  var buildDir = util.env.buildDir;
  var imagesDir = util.env.imagesDir;

  return gulp.src(imagesDir + "/**/*!(*.svg)")
    .pipe(changed(buildDir + "/images"))
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .on("error", notify.onError())
    .pipe(size({ title: "images" }))
    .pipe(gulp.dest(buildDir + "/images"));
});
