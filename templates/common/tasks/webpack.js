/* eslint global-require:0 */

"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const del = require("del");
const webpack = require("webpack");
const mkdirp = require("mkdirp");


gulp.task("webpack", (cb) => {

  const watching = util.env.watching;
  const baseDir = util.env.baseDir;
  const staticDir = util.env.staticDir;

  let started = false;
  let config;

  del.sync(`${staticDir}/javascript/**/*`);
  mkdirp.sync(`${staticDir}/javascript`);

  if (util.env.production) {
    config = require(`${baseDir}/webpack.production.config.js`);
  } else {
    config = require(`${baseDir}/webpack.development.config.js`);
  }

  const bundler = webpack(config);

  const bundle = function (err, stats) {

    let errors;

    if (err) {
      throw new util.PluginError("webpack", err);
    }

    if (stats.hasErrors()) {
      util.log("webpack:", stats.toString({ colors: true }));
      errors = stats.toJson().errors;
    }

    if (stats.hasWarnings()) {
      util.log("webpack:", stats.toString({ colors: true }));
    }

    util.log("webpack:", "Rebuilt bundle...");

    if (!started) {
      started = true;
      return cb(watching ? null : errors);
    }
  };

  if (watching) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});
