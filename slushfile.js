/* eslint max-statements:0 */
/* eslint no-console:0 */
/* eslint global-require:0 */

/*
 * slush-stencil
 * https://github.com/ronik-design/slush-stencil
 *
 * Copyright (c) 2015, Michael Shick
 * Licensed under the ISC license.
 */

"use strict";

var gulp = require("gulp");
var path = require("path");
var fs = require("fs");
var async = require("async");
var install = require("gulp-install");
var conflict = require("gulp-conflict");
var template = require("gulp-template");
var jeditor = require("gulp-json-editor");
var ignore = require("gulp-ignore");
var clone = require("lodash.clone");
var merge = require("lodash.merge");
var slugify = require("uslug");
var inquirer = require("inquirer");

var pkg = require("./package.json");


var TEMPLATE_SETTINGS = {
  evaluate: /\{SLUSH\{(.+?)\}\}/g,
  interpolate: /\{SLUSH\{=(.+?)\}\}/g,
  escape: /\{SLUSH\{-(.+?)\}\}/g
};

var format = function (string) {
  if (string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, "");
  }
  return "";
};

var dest = function (filepath) {
  return path.resolve(process.cwd(), filepath || "./");
};

var defaults = (function () {
  var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  var workingDirName = process.cwd().split("/").pop().split("\\").pop();
  var workingDirNoExt = workingDirName.replace(/\.[a-z]{2,3}$/, "");
  var osUserName = homeDir && homeDir.split("/").pop() || "root";
  var configFile = homeDir + "/.gitconfig";
  var user = {};

  if (require("fs").existsSync(configFile)) {
    user = require("iniparser").parseSync(configFile).user;
  }

  return {
    name: workingDirName,
    slug: slugify(workingDirNoExt),
    userName: format(user.name) || osUserName,
    authorEmail: user.email || ""
  };
})();

gulp.task("default", function (done) {
  var prompts = [{
    name: "platform",
    message: "What serving platform would you like to use?",
    type: "list",
    choices: [{
      name: "Static",
      value: "static"
    }, {
      name: "Webhook",
      value: "webhook"
    }]
  }, {
    name: "name",
    message: "What is the PRETTY name of your site?",
    default: defaults.name
  }, {
    name: "slug",
    message: "What is the name SLUG for your site?",
    default: defaults.slug,
    validate: function (slug) {
      return slug === slugify(slug);
    }
  }, {
    name: "domain",
    message: "What is the domain for your site?",
    default: function (answers) {
      if (answers.platform === "webhook") {
        return defaults.slug + ".webhook.org";
      }
      return "www." + defaults.slug + ".com";
    }
  }, {
    name: "description",
    message: "Please describe your site?"
  }, {
    name: "pkgVersion",
    message: "What is the version of your site?",
    default: "0.1.0"
  }, {
    name: "github",
    message: "GitHub repo name?"
  }, {
    type: "checkbox",
    name: "jsExternals",
    message: "Which external JS libraries would you like included?",
    choices: [{
      name: "jQuery (2.2.0)",
      value: "jquery"
    }, {
      name: "Modernizr (2.8.4)",
      value: "modernizr"
    }]
  }, {
    type: "confirm",
    name: "singlePageApplication",
    message: "Single Page Application? (Unknown routes are handled by index.html)",
    when: function (answers) {
      return answers.platform === "static";
    }
  }, {
    type: "confirm",
    name: "moveon",
    message: "Continue?"
  }];
  //Ask
  inquirer.prompt(prompts,
    function (answers) {

      if (!answers.moveon) {
        return done();
      }

      var config = clone(answers);

      if (answers.github) {
        var githubRe = /(?:https?:\/\/github.com)?\/?([^\/.]+\/[^\/.]+)(?:\.git)?$/i;
        var match = answers.github.match(githubRe);
        if (match && match[1]) {
          config.github = match[1];
        } else {
          config.github = null;
        }
      }

      config.js = "knockout";
      config.css = "bem";

      if (config.platform === "webhook") {
        config.buildDir = "static";
        config.deployDir = ".whdist/.build";
        config.staticPath = "";
        config.browserSync = false;
        config.minifyCss = false;
        config.minifyJs = false;
      } else {
        config.buildDir = ".build";
        config.deployDir = "public";
        config.staticPath = "static";
        config.browserSync = true;
        config.minifyCss = true;
        config.minifyJs = true;
      }

      config.version = pkg.version;

      var commonPath = __dirname + "/templates/common";
      var platformPath = __dirname + "/templates/platforms/" + config.platform;
      var destDir = dest();

      var installCommonFiles = function (cb) {

        var excludePaths = [
          "{styles,styles/**,styles/**/.*}",
          "{scripts,scripts/**,scripts/**/.*}",
          "{pages,pages/**,pages/**/.*}",
          "package.json"
        ];

        gulp.src(commonPath + "/**/*", { dot: true })
          .pipe(ignore.exclude(excludePaths))
          .pipe(template(config, TEMPLATE_SETTINGS))
          .pipe(conflict(destDir, { logger: console.log }))
          .pipe(gulp.dest(destDir))
          .on("end", cb);
      };

      var installCommonPages = function (cb) {

        var paths = [
          commonPath + "/pages/" + config.css + "/**/*"
        ];

        gulp.src(paths, { dot: true })
          .pipe(template(config, TEMPLATE_SETTINGS))
          .pipe(conflict(dest("pages"), { logger: console.log }))
          .pipe(gulp.dest(dest("pages")))
          .on("end", cb);
      };

      var installJsFramework = function (cb) {

        var paths = [
          commonPath + "/scripts/common/**/*",
          commonPath + "/scripts/" + config.js + "/**/*"
        ];

        gulp.src(paths, { dot: true })
          .pipe(conflict(dest("scripts"), { logger: console.log }))
          .pipe(gulp.dest(dest("scripts")))
          .on("end", cb);
      };

      var installCssFramework = function (cb) {

        var paths = [
          commonPath + "/styles/common/**/*",
          commonPath + "/styles/" + config.css + "/**/*"
        ];

        gulp.src(paths, { dot: true })
          .pipe(conflict(dest("styles"), { logger: console.log }))
          .pipe(gulp.dest(dest("styles")))
          .on("end", cb);
      };

      var installPlatformFiles = function (cb) {

        var excludePaths = [
          "package.json"
        ];

        gulp.src(platformPath + "/**/!(*.slush)", { dot: true })
          .pipe(ignore.exclude(excludePaths))
          .pipe(template(config, TEMPLATE_SETTINGS))
          .pipe(conflict(destDir, { logger: console.log }))
          .pipe(gulp.dest(destDir))
          .on("end", cb);
      };

      var writeConfig = function (cb) {

        gulp.src(commonPath + "/stencil.json")
          .pipe(jeditor(config, {
            "indent_char": " ",
            "indent_size": 2
          }))
          .pipe(gulp.dest(dest()))
          .on("end", cb);
      };

      var extendPackageAndInstall = function (cb) {

        var pkgMerge = function (commonPkg) {

          var platformPkg;
          var existingPkg;

          platformPkg = require(platformPath + "/package.json");
          if (fs.existsSync(dest("package.json"))) {
            existingPkg = require(dest("package.json"));
          }

          return merge(commonPkg, platformPkg, existingPkg || {});
        };

        gulp.src(commonPath + "/package.json")
          .pipe(template(config, TEMPLATE_SETTINGS))
          .pipe(jeditor(pkgMerge, {
            "indent_char": " ",
            "indent_size": 2
          }))
          .pipe(gulp.dest(destDir))
          .pipe(install())
          .on("end", cb);
      };

      async.series([
        installCommonFiles,
        installCommonPages,
        installJsFramework,
        installCssFramework,
        installPlatformFiles,
        writeConfig,
        extendPackageAndInstall
      ], done);
    });
});
