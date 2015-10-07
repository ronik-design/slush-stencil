"use strict";

var gulp = require("gulp");
var glob = require("glob");
var path = require("path");
var merge = require("merge-stream");
var util = require("gulp-util");
var notify = require("gulp-notify");
var svgSprite = require("gulp-svg-sprite");
var del = require("del");


gulp.task("sprites", function () {

  var svgDir = util.env.spritesDir;
  var staticDir = util.env.staticDir;

  var folders = glob.sync("*/", { cwd: svgDir });

  var tasks = folders.map(function (folder) {

    var folderName = folder.substr(0, folder.length - 1);
    var config = {
      mode: {
        stack: {
          dest: ".",
          sprite: folderName + ".stack.svg"
        }
      }
    };

    return gulp.src(path.join(svgDir, folder, "/**/*.svg"))
      .pipe(svgSprite(config))
      .on("error", notify.onError())
      .pipe(gulp.dest(staticDir + "/sprites"));
  });

  var root = gulp.src(path.join(svgDir, "/*.svg"))
      .pipe(svgSprite({ mode: { stack: { dest: ".", sprite: "main.stack.svg" }}}))
      .on("error", notify.onError())
      .pipe(gulp.dest(staticDir + "/sprites"));

  del.sync(staticDir + "/sprites");

  return merge(tasks, root);
});
