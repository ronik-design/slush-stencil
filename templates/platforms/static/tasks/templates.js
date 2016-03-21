/* eslint global-require:0 */

"use strict";

const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const util = require("gulp-util");
const gulpIf = require("gulp-if");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const size = require("gulp-size");
const nunjucks = require("gulp-nunjucks");
const nunjucksModule = require("nunjucks");
const data = require("gulp-data");
const glob = require("glob");
const prettify = require("gulp-prettify");


const getJsonData = function (dataDir, pagesDir) {

  return function (file) {

    let jsonData;

    try {

      const ext = path.extname(file.path);
      const re = new RegExp(`${ext}$`);

      const basename = file.path
        .replace(pagesDir || dataDir, "")
        .replace(re, "")
        .replace(/^\//, "");

      const dataFile = `${dataDir}/${basename}.json`;

      const dataStr = fs.readFileSync(dataFile, {
        encoding: "utf-8"
      });

      jsonData = JSON.parse(dataStr);

    } catch (e) {
      jsonData = null;
    }

    return jsonData;
  };
};

const globalMatches = function (obj, dir) {

  const getData = getJsonData(dir);

  return function (fileGlob) {

    const prop = path.basename(fileGlob).substr(1).replace(".json", "");
    obj[prop] = getData({ path: fileGlob });
  };
};

const dataMatches = function (obj, dir) {

  const getData = getJsonData(dir);

  return function (fileGlob) {

    const propName = fileGlob
      .replace(path.extname(fileGlob), "")
      .replace(/index$/, "")
      .replace(dir, "")
      .replace(/^\//, "")
      .replace(/\/$/, "")
      .replace(/\//g, "_");

    obj[propName || "index"] = getData({ path: fileGlob });
  };
};

const getJson = function (dataDir) {

  const globals = { data: {} };

  glob.sync(`${dataDir}/_*.json`).forEach(globalMatches(globals, dataDir));
  glob.sync(`${dataDir}/**/[^_]*.json`).forEach(dataMatches(globals.data, dataDir));

  return globals;
};

// const loadTags = function (baseDir) {

//   const tags = {};

//   glob.sync(`${baseDir}/templates/tags/*.js`).forEach((fileGlob) => {
//     const prop = path.basename(fileGlob).replace(".js", "");

//     try {
//       tags[prop] = require(fileGlob);
//     } catch (err) {
//       util.log("templates", `Could not load custom tag ${prop}`);
//     }
//   });

//   return tags;
// };

gulp.task("templates", () => {

  const watching = util.env.watching;
  const buildDir = util.env["build-dir"];
  // const baseDir = util.env.baseDir;
  const pagesDir = util.env.templatePagesDir;
  const dataDir = util.env.templateDataDir;

  // const tags = loadTags(baseDir);
  const locals = getJson(dataDir);

  locals.package = util.env.PACKAGE;
  locals.stencil = util.env.STENCIL;
  locals.__DEV__ = !util.env.production;

  // const opts = {
  //   setup(swigInstance) {

  //     swigInstance.setDefaults({
  //       loader: swigInstance.loaders.fs(baseDir)
  //     });

  //     Object.keys(tags).forEach((tagName) => {
  //       const tag = tags[tagName];
  //       swigInstance.setTag(tagName, tag.parse, tag.compile, tag.ends, tag.blockLevel);
  //     });
  //   },
  //   defaults: { cache: false, locals }
  // };

  // const env = new nunjucksModule.Environment();
  const env = nunjucksModule.configure("templates");

  return gulp.src(`${pagesDir}/**/*.html`)
    .pipe(gulpIf(watching, plumber({ errorHandler: notify.onError() })))
    .pipe(data(getJsonData(dataDir, pagesDir)))
    .pipe(nunjucks.compile(null, { env }))
    .pipe(prettify({
      "indent_size": 2,
      "unformatted": ["script"]
    }))
    .pipe(size({ title: "templates" }))
    .pipe(gulp.dest(buildDir));
});
