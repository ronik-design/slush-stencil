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


var getJsonData = function (dataDir) {
  return function (file) {
    var jsonData;
    try {
      var basename = path.basename(file.path, path.extname(file.path));
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

var getJsonGlobals = function (dataDir) {

  var globals = {};

  try {
    globals = getJsonData(dataDir)({
      path: "_globals.json"
    });
  } catch (err) {
    globals = {};
  }

  glob.sync(dataDir + "/**/_*.json").forEach(function (fileGlob) {
    var prop = path.basename(fileGlob).substr(1).replace(".json", "");
    if (prop !== "globals") {
      globals[prop] = getJsonData(dataDir)({
        path: fileGlob
      });
    }
  });

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

  var globals = getJsonGlobals(dataDir);

  globals.package = util.env.PACKAGE;
  globals.stencil = util.env.PARAMS;
  globals.__DEV__ = util.env.watching;

  var tags = loadTags(baseDir);

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
      locals: globals
    }
  };

  return gulp.src(pagesDir + "/**/*.html")
    .pipe(data(getJsonData(dataDir)))
    .on("error", notify.onError())
    .pipe(swig(opts))
    .on("error", notify.onError())
    .pipe(prettify({
      "indent_size": 2,
      "unformatted": ["script"]
    }))
    .pipe(size({
      title: "templates"
    }))
    .pipe(gulp.dest(buildDir));
});
