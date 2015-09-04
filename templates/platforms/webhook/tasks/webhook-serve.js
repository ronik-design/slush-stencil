"use strict";

var gulp = require("gulp");
var exec = require("child_process").exec;


gulp.task("webhook-serve", function (cb) {

  var whServe = exec("wh serve");
  whServe.stdout.pipe(process.stdout);
  whServe.on("exit", cb);
});
