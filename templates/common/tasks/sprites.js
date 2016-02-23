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

const errorHandler = notify.onError();

gulp.task("sprites", () => {

  const watching = util.env.watching;
  const svgDir = util.env["sprites-dir"];
  const staticDir = util.env["static-dir"];
  const destDir = `${staticDir}/sprites`;

  const folders = glob.sync("*/", { cwd: svgDir });

  const tasks = folders.map((folder) => {

    const folderName = folder.substr(0, folder.length - 1);
    const config = {
      mode: {
        stack: { dest: ".", sprite: `${folderName}.stack.svg` }
      }
    };

    return gulp.src(path.join(svgDir, folder, "**/*.svg"))
      .pipe(gulpIf(watching, plumber({ errorHandler })))
      .pipe(svgSprite(config))
      .pipe(gulp.dest(destDir));
  });

  const root = gulp.src(path.join(svgDir, "*.svg"))
      .pipe(gulpIf(watching, plumber({ errorHandler })))
      .pipe(svgSprite({ mode: { stack: { dest: ".", sprite: "main.stack.svg" }}}))
      .pipe(gulp.dest(destDir));

  if (!watching) {
    del.sync(destDir);
  }

  return merge(tasks, root);
});
