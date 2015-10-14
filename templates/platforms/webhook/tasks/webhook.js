"use strict";

var gulp = require("gulp");
var util = require("gulp-util");
var notify = require("gulp-notify");
var spawn = require("child_process").spawn;


var onExit = function (cb) {
  return function (code) {
    cb(code === 0 ? null : "ERROR: Webhook process exited with code: " + code);
  };
};

gulp.task("webhook-build", function (cb) {

  var wh = spawn("wh", ["build"], {
    env: process.env,
    stdio: "inherit"
  });
  wh.on("error", notify.onError());
  wh.on("exit", onExit(cb));
});

gulp.task("webhook-serve", function (cb) {

  var args = ["serve"];

  if (util.env.port) {
    args.push(util.env.port);
  }

  var wh = spawn("wh", args, {
    env: process.env,
    stdio: "inherit"
  });
  wh.on("error", notify.onError());
  wh.on("exit", onExit(cb));
});

gulp.task("webhook-deploy", function (cb) {

  var wh = spawn("wh", ["deploy"], {
    env: process.env,
    stdio: "inherit"
  });
  wh.on("error", notify.onError());
  wh.on("exit", onExit(cb));
});
