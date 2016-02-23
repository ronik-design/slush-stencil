"use strict";

const path = require("path");
const gulp = require("gulp");
const util = require("gulp-util");
const runSequence = require("run-sequence");
const awspublish = require("gulp-awspublish");
const s3Website = require("s3-website");
const notify = require("gulp-notify");
const merge = require("merge-stream");
const cyan = util.colors.cyan;
const logName = `"${cyan("s3-deploy")}"`;

gulp.task("s3-deploy:config", (cb) => {

  const domain = util.env.domain;
  const spa = util.env.spa;

  const s3Config = {
    domain,
    index: "index.html",
    error: "error.html"
  };

  if (spa) {
    s3Config.routes = [{
      Condition: {
        HttpErrorCodeReturnedEquals: "404"
      },
      Redirect: {
        HostName: domain
      }
    }];
  }

  s3Website(s3Config, (err, website) => {

    if (err) {
      notify.onError(err);
    }

    util.env.website = website;

    if (website && website.modified) {
      util.log(logName, "Site updated");
    }

    cb(err);
  });
});


gulp.task("s3-deploy:publish", () => {

  const domain = util.env.domain;
  const deployDir = util.env.deployDir;

  const publisher = awspublish.create({
    params: {
      Bucket: domain
    }
  });

  const headers = {
    "Cache-Control": "max-age=315360000, no-transform, public"
  };

  const gzipGlob = path.join(deployDir, "**/*.{css,html,js}");
  const plainGlob = [
    path.join(deployDir, "**/*"),
    `!${gzipGlob}`
  ];

  const gzip = gulp.src(gzipGlob).pipe(awspublish.gzip());
  const plain = gulp.src(plainGlob);

  return merge(gzip, plain)
    .pipe(publisher.publish(headers))
    .on("error", notify.onError())
    .pipe(publisher.sync())
    .on("error", notify.onError())
    .pipe(publisher.cache())
    .on("error", notify.onError())
    .pipe(awspublish.reporter());
});

gulp.task("s3-deploy", (cb) => {
  runSequence("s3-deploy:config", "s3-deploy:publish", cb);
});
