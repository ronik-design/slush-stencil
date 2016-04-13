/* eslint global-require:0 */

"use strict";

const path = require("path");
const gulp = require("gulp");
const util = require("gulp-util");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");

notify.logLevel(0);

const errorHandler = notify.onError();

const getConfig = function (baseDir, production) {

  if (production) {
    return require(`${baseDir}/webpack.production.config.js`);
  } else {
    return require(`${baseDir}/webpack.development.config.js`);
  }
};

gulp.task("webpack", () => {

  const production = util.env.production;
  const watching = util.env.watching;
  const baseDir = util.env["base-dir"];
  const staticDir = util.env["static-dir"];
  const scriptsDir = util.env["scripts-dir"];

  const src = `${scriptsDir}/main.js`;
  const dest = `${staticDir}/javascript/`;

  const config = getConfig(baseDir, production);

  config.eslint = { configFile: path.join(scriptsDir, ".eslintrc") };

  return gulp.src(src)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest(dest));
});
