"use strict";

const gulp = require("gulp");
const util = require("gulp-util");
const notify = require("gulp-notify");
const spawn = require("child_process").spawn;


const onExit = function (cb) {
  return function (code) {
    cb(code === 0 ? null : `ERROR: Webhook process exited with code: ${code}`);
  };
};

gulp.task("webhook:build", (cb) => {

  const wh = spawn("wh", ["build"], {
    env: process.env,
    stdio: "inherit"
  });
  wh.on("error", notify.onError());
  wh.on("exit", onExit(cb));
});

gulp.task("webhook:serve", (cb) => {

  const args = ["serve"];

  if (util.env.port) {
    args.push(util.env.port);
  }

  const wh = spawn("wh", args, {
    env: process.env,
    stdio: "inherit"
  });
  wh.on("error", notify.onError());
  wh.on("exit", onExit(cb));
});

gulp.task("webhook:deploy", (cb) => {

  const wh = spawn("wh", ["deploy"], {
    env: process.env,
    stdio: "inherit"
  });
  wh.on("error", notify.onError());
  wh.on("exit", onExit(cb));
});
