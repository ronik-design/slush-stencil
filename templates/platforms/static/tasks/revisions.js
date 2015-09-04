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

  var buildDir = util.env.buildDir;
  var deployDir = util.env.deployDir;

  gulp.src(buildDir + "/**")
    .pipe(revAll.revision())
    .on("error", notify.onError())
    .pipe(gulp.dest(deployDir));
});
