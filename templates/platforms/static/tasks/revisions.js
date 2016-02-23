"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");
const RevAll = require("gulp-rev-all");

const errorHandler = notify.onError();

gulp.task("revisions", () => {

  const revAll = new RevAll({
    dontGlobal: [/\/favicon\.ico$/],
    dontRenameFile: [/\.(html|txt)$/]
  });

  const watching = util.env.watching;
  const buildDir = util.env["build-dir"];
  const deployDir = util.env["deploy-dir"];

  gulp.src(`${buildDir}/**`)
    .pipe(gulpIf(watching, plumber({ errorHandler })))
    .pipe(revAll.revision())
    .pipe(gulp.dest(deployDir));
});
