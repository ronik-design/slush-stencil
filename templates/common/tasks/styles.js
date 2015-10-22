/* eslint global-require:0 */

"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var util = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");
var stylus = require("gulp-stylus");
var stylint = require("gulp-stylint");
var notify = require("gulp-notify");
var size = require("gulp-size");
var del = require("del");
var rupture = require("rupture");
var gulpIf = require("gulp-if");
var nib = require("nib");
var minify = require("gulp-minify-css");


gulp.task("stylint", function () {

  var watching = util.env.watching;
  var stylesDir = util.env.stylesDir;

  return gulp.src(stylesDir + "/**/*.styl")
    .pipe(gulpIf(watching, plumber({ errorHandler: notify.onError() })))
    .pipe(stylint({
      config: stylesDir + "/.stylintrc",
      reporter: "stylint-stylish"
    }))
    .on("error", function () {
      throw new util.PluginError("stylint", "style linting failed");
    })
    .pipe(stylint.reporter());

});

gulp.task("styles", ["stylint"], function () {

  var STENCIL = util.env.STENCIL;
  var production = util.env.production;
  var watching = util.env.watching;
  var staticDir = util.env.staticDir;

  var stylesDir = util.env.stylesDir;

  var use = [nib(), rupture()];

  if (STENCIL.cssFramework === "basic") {
    use.push(require("jeet")());
  }

  if (STENCIL.cssFramework === "bootstrap") {
    use.push(require("bootstrap-styl")());
  }

  del.sync(staticDir + "/css/**/*");

  return gulp.src(stylesDir + "/**/[!_]*.{css,styl}")
    .pipe(gulpIf(watching, plumber({ errorHandler: notify.onError() })))
    .pipe(gulpIf(!production, sourcemaps.init()))
    .pipe(stylus({ use: use, "include css": true }))
    .pipe(gulpIf(!production, sourcemaps.write("./")))
    .pipe(gulpIf(production && STENCIL.minifyCss, minify()))
    .pipe(size({ title: "styles" }))
    .pipe(gulp.dest(staticDir + "/css/"));
});

