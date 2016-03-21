/* eslint global-require:0 */

"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const path = require("path");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");

notify.logLevel(0);

const errorHandler = notify.onError();

const getConfig = function (baseDir, options) {

  let configPath;

  if (options.production) {
    configPath = path.join(baseDir, "webpack.production.config.js");
  } else {
    configPath = path.join(baseDir, "webpack.development.config.js");
  }

  return require(configPath);
};

gulp.task("webpack", () => {

  const production = util.env.production;
  const watching = util.env.watching;

  const baseDir = util.env["base-dir"];
  const staticDir = util.env["static-dir"];
  const scriptsDir = util.env["scripts-dir"];

  const src = path.join(scriptsDir, "main.js");
  const dest = path.join(staticDir, "javascript");

  const config = getConfig(baseDir, { production });

  return gulp.src(src)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest(dest));
});
