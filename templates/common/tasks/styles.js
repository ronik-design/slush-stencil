/* eslint global-require:0 */

"use strict";

const path = require("path");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const util = require("gulp-util");
const sourcemaps = require("gulp-sourcemaps");
const stylus = require("gulp-stylus");
const stylint = require("gulp-stylint");
const notify = require("gulp-notify");
const size = require("gulp-size");
const del = require("del");
const rupture = require("rupture");
const gulpIf = require("gulp-if");
const nib = require("nib");
const minify = require("gulp-minify-css");


gulp.task("stylint", () => {

  const watching = util.env.watching;
  const stylesDir = util.env.stylesDir;
  const errorHandler = notify.onError();

  return gulp.src(path.join(stylesDir, "**/*.styl"))
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(stylint({
      config: path.join(stylesDir, ".stylintrc"),
      reporter: "stylint-stylish"
    }))
    .on("error", () => {
      throw new util.PluginError("stylint", "style linting failed");
    })
    .pipe(stylint.reporter());
});

gulp.task("styles", ["stylint"], () => {

  const STENCIL = util.env.STENCIL;
  const production = util.env.production;
  const watching = util.env.watching;
  const staticDir = util.env.staticDir;
  const stylesDir = util.env.stylesDir;

  const errorHandler = notify.onError();
  const use = [nib(), rupture()];

  if (STENCIL.cssFramework === "basic") {
    use.push(require("jeet")());
  }

  if (STENCIL.cssFramework === "bootstrap") {
    use.push(require("bootstrap-styl")());
  }

  del.sync(path.join(staticDir, "css/**/*"));

  return gulp.src(path.join(stylesDir, "/**/[!_]*.{css,styl}"))
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(gulpIf(!production, sourcemaps.init()))
    .pipe(stylus({ use, "include css": true }))
    .pipe(gulpIf(!production, sourcemaps.write("./")))
    .pipe(gulpIf(production && STENCIL.minifyCss, minify()))
    .pipe(size({ title: "styles" }))
    .pipe(gulp.dest(path.join(staticDir, "css")));
});

