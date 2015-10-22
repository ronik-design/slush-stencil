/* eslint global-require:0 */

"use strict";

var gulp = require("gulp");
var util = require("gulp-util");
var del = require("del");
var webpack = require("webpack");
var mkdirp = require("mkdirp");


gulp.task("webpack", function (cb) {

  var watching = util.env.watching;
  var baseDir = util.env.baseDir;
  var staticDir = util.env.staticDir;
  var started = false;
  var config;

  del.sync(staticDir + "/javascript/**/*");
  mkdirp.sync(staticDir + "/javascript");

  if (util.env.production) {
    config = require(baseDir + "/webpack.production.config.js");
  } else {
    config = require(baseDir + "/webpack.development.config.js");
  }

  var bundler = webpack(config);

  var bundle = function (err, stats) {

    var errors;

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
