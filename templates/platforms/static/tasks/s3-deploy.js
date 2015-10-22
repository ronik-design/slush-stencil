"use strict";

var gulp = require("gulp");
var util = require("gulp-util");
var awsPublish = require("gulp-awspublish");
var s3Website = require("s3-website");
var notify = require("gulp-notify");
var cyan = util.colors.cyan;
var logName = "\"" + cyan("s3-deploy") + "\"";


gulp.task("s3-deploy", ["s3-deploy-config"], function () {

  var domain = util.env.domain;
  var deployDir = util.env.deployDir;

  var publisher = awsPublish.create({
    params: {
      Bucket: domain
    }
  });

  var headers = {
    "Cache-Control": "max-age=315360000, no-transform, public"
  };

  return gulp.src(deployDir + "/**/*")
    .pipe(awsPublish.gzip())
    .pipe(publisher.publish(headers))
    .on("error", notify.onError())
    .pipe(publisher.sync())
    .on("error", notify.onError())
    .pipe(publisher.cache())
    .on("error", notify.onError())
    .pipe(awsPublish.reporter());
});

gulp.task("s3-deploy-config", function (cb) {

  var domain = util.env.domain;
  var spa = util.env.spa;

  var s3Config = {
    domain: domain,
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

  s3Website(s3Config, function (err, website) {

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
