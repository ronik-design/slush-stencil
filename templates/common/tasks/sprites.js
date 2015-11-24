"use strict";

const gulp = require("gulp");
const glob = require("glob");
const path = require("path");
const merge = require("merge-stream");
const util = require("gulp-util");
const gulpIf = require("gulp-if");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const svgSprite = require("gulp-svg-sprite");
const del = require("del");


gulp.task("sprites", () => {

  const watching = util.env.watching;
  const svgDir = util.env.spritesDir;
  const staticDir = util.env.staticDir;

  const folders = glob.sync("*/", { cwd: svgDir });

  const tasks = folders.map((folder) => {

    const folderName = folder.substr(0, folder.length - 1);
    const dest = ".";
    const sprite = `${folderName}.stack.svg`;
    const errorHandler = notify.onError();

    const config = {
      mode: { stack: { dest, sprite } }
    };

    return gulp.src(path.join(svgDir, folder, "**/*.svg"))
      .pipe(gulpIf(watching, plumber({ errorHandler })))
      .pipe(svgSprite(config))
      .pipe(gulp.dest(path.join(staticDir, "sprites")));
  });

  const root = gulp.src(path.join(svgDir, "*.svg"))
      .pipe(gulpIf(watching, plumber({ errorHandler: notify.onError() })))
      .pipe(svgSprite({ mode: { stack: { dest: ".", sprite: "main.stack.svg" }}}))
      .pipe(gulp.dest(path.join(staticDir, "sprites")));

  del.sync(path.join(staticDir, "sprites"));

  return merge(tasks, root);
});
