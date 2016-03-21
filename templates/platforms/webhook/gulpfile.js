"use strict";

const PACKAGE = require("./package");
const STENCIL = require("./stencil");

const path = require("path");
const gulp = require("gulp");
const util = require("gulp-util");
const watch = require("gulp-watch");
const runSequence = require("run-sequence");
const requireDir = require("require-dir");


const dirPath = function (dir) {
  return path.resolve(__dirname, dir);
};

// Params
util.env.PACKAGE = PACKAGE;
util.env.STENCIL = STENCIL;

// Domain, for...
util.env.domain = STENCIL.domain;

// Build directory
util.env["base-dir"] = dirPath("./");
util.env["build-dir"] = dirPath(STENCIL.buildDir);
util.env["deploy-dir"] = dirPath(STENCIL.deployDir);
util.env["static-dir"] = dirPath(path.join(STENCIL.buildDir, STENCIL.staticPath));

// Misc
util.env["minify-css"] = STENCIL.minifyCss;
util.env["minify-js"] = STENCIL.minifyJs;

// Various process sub-dirs
util.env["sprites-dir"] = dirPath("sprites");
util.env["assets-dir"] = dirPath("assets");
util.env["images-dir"] = dirPath("images");
util.env["scripts-dir"] = dirPath("scripts");
util.env["styles-dir"] = dirPath("styles");

gulp.task("build", (cb) => {

  runSequence(
    "lint",
    "clean",
    "styles",
    "webpack",
    "sprites",
    "images",
    "assets",
    cb
    );
});

gulp.task("watch", (cb) => {

  util.env.watching = true;

  const watchStart = () => {

    watch("assets/**/*", () => gulp.start("assets"));
    watch("styles/**/*", () => gulp.start("styles"));
    watch("images/**/*", () => gulp.start("images"));
    watch("sprites/**/*.svg", () => gulp.start("sprites"));
    watch("scripts/**/*.js", () => gulp.start("webpack"));

    cb();
  };

  runSequence("build", watchStart);
});

gulp.task("deploy", (cb) => {
  runSequence("build", "webhook:deploy", cb);
});

gulp.task("deploy:staging", (cb) => {
  runSequence("build", "webhook:build", "s3-deploy", cb);
});

gulp.task("develop", (cb) => {
  runSequence("watch", "webhook:serve", cb);
});

gulp.task("default", (cb) => {

  const help = [
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
