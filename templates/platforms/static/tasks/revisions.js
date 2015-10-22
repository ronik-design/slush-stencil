"use strict";

var gulp = require("gulp");
var util = require("gulp-util");
var RevAll = require("gulp-rev-all");
var notify = require("gulp-notify");


gulp.task("revisions", function () {

  var revAll = new RevAll({
    dontGlobal: [/\/favicon\.ico$/],
    dontRenameFile: [/\.(html|txt)$/]
  });

  var watching = util.env.watching;
  var buildDir = util.env.buildDir;
  var deployDir = util.env.deployDir;

  gulp.src(buildDir + "/**")
    .pipe(gulpIf(watching, plumber({ errorHandler: notify.onError() })))
    .pipe(revAll.revision())
    .pipe(gulp.dest(deployDir));
});
