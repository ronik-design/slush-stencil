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
util.env.STENCIL = STENCIL;

// Domain, for S3 deployment
util.env.domain = STENCIL.domain;

// SPA routing, default on for now
util.env.spa = STENCIL.singlePageApplication;

// Build directory
util.env.stencilDir = dirPath("stencil");
util.env.buildDir = dirPath(STENCIL.buildDir);
util.env.staticDir = dirPath(STENCIL.buildDir + "/static");
util.env.deployDir = dirPath(STENCIL.deployDir);
util.env.baseDir = dirPath("./");
util.env.tmpDir = dirPath(STENCIL.buildDir + "/.tmp");

// Various process sub-dirs
util.env.spritesDir = dirPath("sprites");
util.env.assetsDir = dirPath("assets");
util.env.imagesDir = dirPath("images");
util.env.scriptsDir = dirPath("scripts");
util.env.stylesDir = dirPath("styles");
util.env.iconsDir = dirPath("icons");
util.env.templatePagesDir = dirPath("pages");
util.env.templateDataDir = dirPath("data");

gulp.task("build", function (cb) {

  runSequence(
    "lint",
    "clean",
    ["images", "assets", "webpack", "templates", "sprites", "styles"],
    "revisions",
    cb
  );
});

gulp.task("watch", function (cb) {

  util.env.watching = true;

  var watchStart = function () {

    watch("assets/**/*", function () {
      gulp.start("assets");
    });
    watch("styles/**/*", function () {
      gulp.start("styles");
    });
    watch("images/**/*", function () {
      gulp.start("images");
    });
    watch("sprites/**/*.svg", function () {
      gulp.start("sprites");
    });
    watch(["templates/**/*", "pages/**/*", "data/**/*"], function () {
      gulp.start("templates");
    });

    cb();
  };

  runSequence("build", watchStart);
});

gulp.task("deploy", function (cb) {

  runSequence("build", "s3-deploy", function () {

    if (util.env.website) {
      util.log("Your site has been deployed to S3");
      util.log("---------------------------------");
      util.log(util.colors.green(util.env.website.url));
    }

    cb();
  });
});

gulp.task("develop", function (cb) {
  runSequence("watch", "browser-sync", cb);
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
    "gulp develop [--host, --port]",
    "gulp build",
    "gulp deploy [--production]",
    ""
  ];

  util.log(help.join("\n"));

  cb();
});

requireDir("./tasks");
