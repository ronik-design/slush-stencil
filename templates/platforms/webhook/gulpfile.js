"use strict";

var PACKAGE = require("./package");
var STENCIL = require("./stencil/params");

var path = require("path");
var gulp = require("gulp");
var util = require("gulp-util");
var watch = require("gulp-watch");
var runSequence = require("run-sequence");
var requireDir = require("require-dir");


var dirPath = function (dir) {
  return path.resolve(__dirname, dir);
};

// Params
util.env.PACKAGE = PACKAGE;
util.env.PARAMS = STENCIL;
util.env.STENCIL = STENCIL;

// Domain, for...
util.env.domain = STENCIL.domain;

// Build directory
util.env.stencilDir = dirPath("stencil");
util.env.buildDir = dirPath(STENCIL.buildDir);
util.env.baseDir = dirPath("./");
util.env.tmpDir = dirPath(STENCIL.buildDir + "/.tmp");

// Various process sub-dirs
util.env.assetsDir = dirPath("assets");
util.env.imagesDir = dirPath("images");
util.env.scriptsDir = dirPath("scripts");
util.env.stylesDir = dirPath("styles");
util.env.iconsDir = dirPath("icons");

gulp.task("build", function (cb) {

  runSequence(
    "clean", ["icons", "lint", "images", "assets"], ["styles", "webpack"],
    "webhook-build",
    cb
  );
});

gulp.task("watch", function (cb) {

  util.env.watching = true;

  var watchStart = function () {

    watch("assets/**/*", function () {
      gulp.start("assets");
    });
    watch("styles/**/*.{css,styl}", function () {
      gulp.start("styles");
    });
    watch("images/**/*", function () {
      gulp.start("images");
    });
    watch("icons/**/*.svg", function () {
      gulp.start("icons");
    });

    cb();
  };

  runSequence("build", watchStart);
});

gulp.task("deploy", function (cb) {

  runSequence("build", "webhook-deploy", cb);
});

gulp.task("develop", function (cb) {

  runSequence("watch", "webhook-serve", cb);
});

gulp.task("default", function (cb) {

  var help = [
    "",
    "",
    "---- S T E N C I L ----",
    "",
    "Usage: gulp [task] [options]",
    "",
    "gulp clean",
    "gulp lint [--scripts]",
    "gulp watch",
    "gulp develop",
    "gulp build",
    "gulp deploy",
    ""
  ];

  util.log(help.join("\n"));

  cb();
});

requireDir("./tasks");
