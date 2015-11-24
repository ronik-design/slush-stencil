"use strict";

const PACKAGE = require("./package");
const STENCIL = require("./stencil/params");

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

// Domain, for S3 deployment
util.env.domain = STENCIL.domain;

// SPA routing, default on for now
util.env.spa = STENCIL.singlePageApplication;

// Build directory
util.env.stencilDir = dirPath("stencil");
util.env.buildDir = dirPath(STENCIL.buildDir);
util.env.staticDir = dirPath(path.join(STENCIL.buildDir, STENCIL.staticPath));
util.env.deployDir = dirPath(STENCIL.deployDir);
util.env.baseDir = dirPath("./");
util.env.tmpDir = dirPath(`${STENCIL.buildDir}/.tmp`);

// Various process sub-dirs
util.env.spritesDir = dirPath("sprites");
util.env.assetsDir = dirPath("assets");
util.env.imagesDir = dirPath("images");
util.env.scriptsDir = dirPath("scripts");
util.env.stylesDir = dirPath("styles");
util.env.iconsDir = dirPath("icons");
util.env.templatePagesDir = dirPath("pages");
util.env.templateDataDir = dirPath("data");

gulp.task("build", (cb) => {
  runSequence(
    "lint",
    "clean",
    ["images", "assets", "webpack", "templates", "sprites", "styles"],
    "revisions",
    cb
  );
});

gulp.task("watch", (cb) => {

  util.env.watching = true;

  const watchStart = function () {

    watch("assets/**/*", () => {
      gulp.start("assets");
    });
    watch("styles/**/*", () => {
      gulp.start("styles");
    });
    watch("images/**/*", () => {
      gulp.start("images");
    });
    watch("sprites/**/*.svg", () => {
      gulp.start("sprites");
    });
    watch(["templates/**/*", "pages/**/*", "data/**/*"], () => {
      gulp.start("templates");
    });

    cb();
  };

  runSequence("build", watchStart);
});

gulp.task("deploy", (cb) => {

  util.env.production = true;

  runSequence("build", "s3-deploy", () => {

    if (util.env.website) {
      util.log("Your site has been deployed to S3");
      util.log("---------------------------------");
      util.log(util.colors.green(util.env.website.url));
    }

    cb();
  });
});

gulp.task("develop", (cb) => {
  runSequence("watch", "browser-sync", cb);
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
    "gulp develop [--host, --port]",
    "gulp build [--production]",
    "gulp deploy",
    ""
  ];

  util.log(help.join("\n"));

  cb();
});

requireDir("./tasks");
