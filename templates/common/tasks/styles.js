"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const util = require("gulp-util");
const sourcemaps = require("gulp-sourcemaps");
const notify = require("gulp-notify");
const size = require("gulp-size");
const gulpIf = require("gulp-if");
const del = require("del");
const runSequence = require("run-sequence");

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const lost = require("lost");
const stylelint = require("stylelint");
const syntaxScss = require("postcss-scss");
const reporter = require("postcss-reporter");

const errorHandler = notify.onError();

gulp.task("styles:lint", () => {

  const watching = util.env.watching;
  const stylesDir = util.env["styles-dir"];

  const processors = [
    stylelint({ configFile: `${stylesDir}/.stylelintrc` }),
    reporter({ clearMessages: true, throwError: true })
  ];

  return gulp.src(`${stylesDir}/**/*.{sass,scss}`)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(postcss(processors), { syntax: syntaxScss });
});

gulp.task("styles:build", () => {

  const production = util.env.production;
  const watching = util.env.watching;
  const minifyCss = util.env["minify-css"];

  const baseDir = util.env["base-dir"];
  const stylesDir = util.env["styles-dir"];
  const staticDir = util.env["static-dir"];
  const destDir = `${staticDir}/css`;

  const sassPaths = [
    `${baseDir}/node_modules/breakpoint-sass/stylesheets`
  ];

  const postcssProcessors = [
    autoprefixer({browsers: ["last 2 versions"]}),
    lost
  ];

  if (production && minifyCss) {
    postcssProcessors.push(cssnano);
  }

  if (!watching) {
    del.sync(`${destDir}/**/*`);
  }

  return gulp.src(`${stylesDir}/**/[!_]*.{css,sass,scss}`)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(gulpIf(!production, sourcemaps.init()))
    .pipe(sass({ includePaths: sassPaths }).on("error", sass.logError))
    .pipe(postcss(postcssProcessors))
    .pipe(gulpIf(!production, sourcemaps.write("./")))
    .pipe(size({ title: "styles" }))
    .pipe(gulp.dest(destDir));
});

gulp.task("styles", (cb) => {
  runSequence("styles:lint", "styles:build", cb);
});
