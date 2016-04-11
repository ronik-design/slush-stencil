"use strict";

const path = require("path");
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

  const args = ["build", "--strict=true"];

  const args1 = [].concat(args);

  const opts = {
    env: process.env,
    stdio: "inherit"
  };

  if (util.env.production) {
    args1.push("--production");
  }

  spawn("grunt", args1, opts)
    .on("error", notify.onError())
    .on("exit", () => {

      spawn("grunt", ["assets"], opts)
        .on("error", notify.onError())
        .on("exit", () => {

          opts.cwd = path.join(__dirname, "../.whdist");
          const args2 = [].concat(args);
          args2.push(`--cwd=${opts.cwd}`);
          if (util.env.production) {
            args2.push("--production");
          }
          spawn("grunt", args2, opts)
            .on("error", notify.onError())
            .on("exit", onExit(cb));
        });
    });
});

gulp.task("webhook:serve", (cb) => {

  const args = ["serve"];
  const opts = {
    env: process.env,
    stdio: "inherit"
  };

  if (util.env.production) {
    args.push("--production");
  }

  if (util.env.port) {
    args.push(util.env.port);
  }

  spawn("wh", args, opts)
    .on("error", notify.onError())
    .on("exit", onExit(cb));
});

gulp.task("webhook:deploy", (cb) => {

  const args = ["deploy"];
  const opts = {
    env: process.env,
    stdio: "inherit"
  };

  if (util.env.production) {
    args.push("--production");
  }

  spawn("wh", args, opts)
    .on("error", notify.onError())
    .on("exit", onExit(cb));
});
