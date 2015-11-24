"use strict";

const gulp = require("gulp");
const eslint = require("gulp-eslint");
const notify = require("gulp-notify");


gulp.task("lint", () => {

  const globs = [
    "webpack.config.js",
    "webpack.production.config.js",
    "tasks/*",
    "scripts/**/*.{js,jsx}"
  ];

  const options = { useEslintrc: true };

  return gulp.src(globs)
    .pipe(eslint(options))
    .on("error", notify.onError())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
