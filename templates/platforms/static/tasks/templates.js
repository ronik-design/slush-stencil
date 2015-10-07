/* eslint global-require:0 */

"use strict";

var path = require("path");
var fs = require("fs");
var gulp = require("gulp");
var util = require("gulp-util");
var notify = require("gulp-notify");
var size = require("gulp-size");
var swig = require("gulp-swig");
var data = require("gulp-data");
var glob = require("glob");
var prettify = require("gulp-prettify");


var getJsonData = function (dataDir, pagesDir) {

  return function (file) {

    var jsonData;

    try {

      var re = new RegExp(path.extname(file.path) + "$");

      var basename = file.path
        .replace(pagesDir || dataDir, "")
        .replace(re, "")
        .replace(/^\//, "");

      var dataStr = fs.readFileSync(dataDir + "/" + basename + ".json", {
        encoding: "utf-8"
      });

      jsonData = JSON.parse(dataStr);

    } catch (e) {
      jsonData = null;
    }

    return jsonData;
  };
};

var globalMatches = function (obj, dir) {

  var getData = getJsonData(dir);

  return function (fileGlob) {

    var prop = path.basename(fileGlob).substr(1).replace(".json", "");
    obj[prop] = getData({ path: fileGlob });
  };
};

var dataMatches = function (obj, dir) {

  var getData = getJsonData(dir);

  return function (fileGlob) {

    var propName = fileGlob
      .replace(path.extname(fileGlob), "")
      .replace(/index$/, "")
      .replace(dir, "")
      .replace(/^\//, "")
      .replace(/\/$/, "")
      .replace(/\//g, "_");

    obj[propName || "index"] = getData({ path: fileGlob });
  };
};

var getJson = function (dataDir) {

  var globals = { data: {} };

  glob.sync(dataDir + "/_*.json").forEach(globalMatches(globals, dataDir));
  glob.sync(dataDir + "/**/[^_]*.json").forEach(dataMatches(globals.data, dataDir));

  return globals;
};

var loadTags = function (baseDir) {

  var tags = {};

  glob.sync(baseDir + "/templates/tags/*.js").forEach(function (fileGlob) {
    var prop = path.basename(fileGlob).replace(".js", "");

    try {
      tags[prop] = require(fileGlob);
    } catch (err) {
      util.log("templates", "Could not load custom tag " + prop);
    }
  });

  return tags;
};

gulp.task("templates", function () {

  var buildDir = util.env.buildDir;
  var baseDir = util.env.baseDir;
  var pagesDir = util.env.templatePagesDir;
  var dataDir = util.env.templateDataDir;

  var tags = loadTags(baseDir);

  var locals = getJson(dataDir);

  locals.package = util.env.PACKAGE;
  locals.stencil = util.env.STENCIL;
  locals.__DEV__ = util.env.watching;

  var opts = {
    setup: function (swigInstance) {

      swigInstance.setDefaults({
        loader: swigInstance.loaders.fs(baseDir)
      });

      Object.keys(tags).forEach(function (tagName) {
        var tag = tags[tagName];
        swigInstance.setTag(tagName, tag.parse, tag.compile, tag.ends, tag.blockLevel);
      });
    },
    defaults: {
      cache: false,
      locals: locals
    }
  };

  return gulp.src(pagesDir + "/**/*.html")
    .pipe(data(getJsonData(dataDir, pagesDir)))
    .on("error", notify.onError())
    .pipe(swig(opts))
    .on("error", notify.onError())
    .pipe(prettify({
      "indent_size": 2,
      "unformatted": ["script"]
    }))
    .pipe(size({ title: "templates" }))
    .pipe(gulp.dest(buildDir));
});
