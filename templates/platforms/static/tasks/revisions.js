"use strict";

const path = require("path");
const gulp = require("gulp");
const util = require("gulp-util");
const notify = require("gulp-notify");
const rev = require("gulp-rev");
const revReplace = require("gulp-rev-replace");
const runSequence = require("run-sequence");
const del = require("del");
const ignore = require("gulp-ignore");
const htmlmin = require("gulp-htmlmin");

const MANIFEST_FILENAME = "rev-manifest.json";
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "svg"];

gulp.task("revisions:images", () => {

  const buildDir = util.env["build-dir"];
  const deployDir = util.env["deploy-dir"];

  return gulp.src(`${buildDir}/**/*.{${IMAGE_EXTENSIONS.join(",")}}`)
    .pipe(rev())
    .on("error", notify.onError())
    .pipe(gulp.dest(deployDir))
    .pipe(rev.manifest({
      base: ".build",
      merge: true,
      path: `.build/${MANIFEST_FILENAME}`
    }))
    .on("error", notify.onError())
    .pipe(gulp.dest(buildDir));
});

gulp.task("revisions:css", () => {

  const buildDir = util.env["build-dir"];
  const deployDir = util.env["deploy-dir"];

  const manifest = gulp.src(path.join(buildDir, MANIFEST_FILENAME));

  return gulp.src(`${buildDir}/**/*.css`)
    .pipe(revReplace({ manifest }))
    .pipe(rev())
    .pipe(gulp.dest(deployDir))
    .pipe(rev.manifest({
      base: ".build",
      merge: true,
      path: `.build/${MANIFEST_FILENAME}`
    }))
    .pipe(gulp.dest(buildDir));
});

gulp.task("revisions:js", () => {

  const buildDir = util.env["build-dir"];
  const deployDir = util.env["deploy-dir"];

  const manifest = gulp.src(path.join(buildDir, MANIFEST_FILENAME));

  return gulp.src(`${buildDir}/**/*.js`)
    .pipe(revReplace({ manifest }))
    .pipe(rev())
    .pipe(gulp.dest(deployDir))
    .pipe(rev.manifest({
      base: ".build",
      merge: true,
      path: `.build/${MANIFEST_FILENAME}`
    }))
    .pipe(gulp.dest(buildDir));
});

gulp.task("revisions:replace", () => {

  const buildDir = util.env["build-dir"];
  const deployDir = util.env["deploy-dir"];

  const manifest = gulp.src(path.join(buildDir, MANIFEST_FILENAME));

  const exclude = IMAGE_EXTENSIONS.concat(["js", "css"]).join("|");

  return gulp.src(`${buildDir}/**/*.!(${exclude})`)
    .pipe(ignore.exclude(MANIFEST_FILENAME))
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest(deployDir));
});

gulp.task("revisions:htmlmin", () => {

  const deployDir = util.env["deploy-dir"];

  const htmlminConfig = {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: false,
    removeTagWhitespace: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    keepClosingSlash: true
  };

  return gulp.src(path.join(deployDir, "/**/*.html"))
    .pipe(htmlmin(htmlminConfig))
    .pipe(gulp.dest(deployDir));
});

gulp.task("revisions", (cb) => {

  const deployDir = util.env["deploy-dir"];

  del.sync(path.join(deployDir, MANIFEST_FILENAME));

  runSequence(
    "revisions:images",
    "revisions:css",
    "revisions:js",
    "revisions:replace",
    "revisions:htmlmin",
    cb
  );
});
