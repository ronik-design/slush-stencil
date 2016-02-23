"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const gulpIf = require("gulp-if");
const plumber = require("gulp-plumber");
const changed = require("gulp-changed");
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const size = require("gulp-size");

const errorHandler = notify.onError();

gulp.task("svg-images", () => {

  const watching = util.env.watching;

  const imagesDir = util.env["images-dir"];
  const staticDir = util.env["static-dir"];

  const srcDir = `!${imagesDir}/**/*.(gif|jpg|png|jpeg)`;
  const destDir = `${staticDir}/images`;

  return gulp.src(srcDir)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(changed(destDir))
    .pipe(size({ title: "svg-images" }))
    .pipe(gulp.dest(destDir));
});

gulp.task("images", ["svg-images"], () => {

  const watching = util.env.watching;

  const imagesDir = util.env["images-dir"];
  const staticDir = util.env["static-dir"];

  const srcDir = `${imagesDir}/**/*!(*.svg)`;
  const destDir = `${staticDir}/images`;

  return gulp.src(srcDir)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(changed(destDir))
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(size({ title: "images" }))
    .pipe(gulp.dest(destDir));
});
