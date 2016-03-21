/* eslint global-require:0 */

"use strict";

const path = require("path");
const gulp = require("gulp");
const util = require("gulp-util");
const ignore = require("gulp-ignore");
const runSequence = require("run-sequence");
const awspublish = require("gulp-awspublish");
const s3Website = require("s3-website");
const notify = require("gulp-notify");
const merge = require("merge-stream");
const parallelize = require("concurrent-transform");
const cyan = util.colors.cyan;
const logName = `"${cyan("s3-deploy")}"`;

const MAX_CONCURRENCY = 5;

const REVISIONED_HEADERS = {
  "Cache-Control": "max-age=315360000, no-transform, public"
};

const STATIC_HEADERS = {
  "Cache-Control": "max-age=300, s-maxage=900, no-transform, public"
};

const getManifest = function (dirname, filename) {

  let manifest;

  try {
    const revManifest = require(path.join(dirname, filename || "rev-manifest.json"));
    manifest = Object.keys(revManifest).map((p) => revManifest[p]);
  } catch (e) {
    manifest = [];
  }

  return manifest;
};

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

  const force = util.env.force;
  const domain = util.env.domain;
  const deployDir = util.env["deploy-dir"];

  const publisher = awspublish.create({
    params: {
      Bucket: domain
    }
  });

  const publisherOpts = { force };

  const revManifest = getManifest(deployDir);

  let gzipRevisioned = util.noop();
  let plainRevisioned = util.noop();

  if (revManifest.length) {

    const revPaths = revManifest.map((p) => path.join(deployDir, p));

    gzipRevisioned = gulp.src(revPaths, { base: deployDir })
      .pipe(ignore.include("**/*.{html,js,css,txt}"))
      .pipe(awspublish.gzip())
      .pipe(parallelize(publisher.publish(REVISIONED_HEADERS, publisherOpts), MAX_CONCURRENCY));

    plainRevisioned = gulp.src(revPaths, { base: deployDir })
      .pipe(ignore.exclude("**/*.{html,js,css,txt}"))
      .pipe(parallelize(publisher.publish(REVISIONED_HEADERS, publisherOpts), MAX_CONCURRENCY));
  }

  const gzipStatic = gulp.src(path.join(deployDir, "**/*.+(html|js|css|txt)"))
    .pipe(ignore.exclude(revManifest))
    .pipe(awspublish.gzip())
    .pipe(parallelize(publisher.publish(STATIC_HEADERS, publisherOpts), MAX_CONCURRENCY));

  const plainStatic = gulp.src(path.join(deployDir, "/**/*.!(html|js|css|txt)"))
    .pipe(ignore.exclude(revManifest))
    .pipe(parallelize(publisher.publish(STATIC_HEADERS, publisherOpts), MAX_CONCURRENCY));

  return merge(gzipRevisioned, gzipStatic, plainRevisioned, plainStatic)
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
