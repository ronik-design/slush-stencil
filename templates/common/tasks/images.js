"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const gulpIf = require("gulp-if");
const plumber = require("gulp-plumber");
const changed = require("gulp-changed");
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const size = require("gulp-size");
const runSequence = require("run-sequence");

const errorHandler = notify.onError();

gulp.task("images:copy", () => {

  const watching = util.env.watching;

  const imagesDir = util.env["images-dir"];
  const staticDir = util.env["static-dir"];

  const srcDir = `!${imagesDir}/**/*.(gif|jpg|png|jpeg)`;
  const destDir = `${staticDir}/images`;

  return gulp.src(srcDir)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(changed(destDir))
    .pipe(size({ title: "images:copy" }))
    .pipe(gulp.dest(destDir));
});

gulp.task("images:min", () => {

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
    .pipe(size({ title: "images:min" }))
    .pipe(gulp.dest(destDir));
});

gulp.task("images", (cb) => {
  runSequence("images:copy", "images:min", cb);
});
