"use strict";

var gulp = require("gulp");
var util = require("gulp-util");
var notify = require("gulp-notify");
var size = require("gulp-size");
var iconfont = require("gulp-iconfont");
var swig = require("gulp-swig");
var rename = require("gulp-rename");
// var cssfont64 = require("gulp-cssfont64");
var svgSprite = require("gulp-svg-sprite");
var del = require("del");


var cleanGlyph = function (glyph) {
  return {
    name: glyph.name,
    unicode: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
  };
};

var writeGlyphs = function (stencilDir, tmpDir) {

  return function (glyphs) {

    var cleanGlyphs = glyphs.map(cleanGlyph);

    return gulp.src(stencilDir + "/icons/icons.swig")
      .pipe(swig({
        data: {
          glyphs: cleanGlyphs
        }
      }))
      .pipe(rename("icons.styl"))
      .pipe(gulp.dest(tmpDir));
  };
};

var iconfontTask = function () {

  var buildDir = util.env.buildDir;
  var tmpDir = util.env.tmpDir;
  var iconsDir = util.env.iconsDir;
  var stencilDir = util.env.stencilDir;

  del.sync([buildDir + "/fonts/iconfont.*", tmpDir + "/icons.styl"]);

  return gulp.src(iconsDir + "/*.svg")
    .pipe(iconfont({
      fontName: "iconfont",
      appendUnicode: true
    }))
    .on("glyphs", writeGlyphs(stencilDir, tmpDir))
    .on("error", notify.onError())
    .pipe(size({
      title: "icons"
    }))
    .pipe(gulp.dest(buildDir + "/fonts"));
};

var spritestackTask = function () {

  var buildDir = util.env.buildDir;
  var iconsDir = util.env.iconsDir;

  var config = {
    mode: {
      stack: {
        dest: ".",
        sprite: "sprite.stack.svg"
      }
    }
  };

  del.sync([buildDir + "/sprites"]);

  return gulp.src(iconsDir + "/*.svg")
    .pipe(svgSprite(config))
    .on("error", notify.onError())
    .pipe(gulp.dest(buildDir + "/sprites"));
};

// gulp.task("iconfont-embedded", ["iconfont"], function () {

//   var buildDir = util.env.buildDir;
//   var tmpDir = util.env.tmpDir;

//   del.sync(tmpDir + "/iconfont_embedded.css");

//   return gulp.src(buildDir + "/fonts/iconfont.ttf")
//     .pipe(cssfont64())
//     .pipe(rename("iconfont_embedded.css"))
//     .pipe(gulp.dest(tmpDir));
// });

gulp.task("icons-selector", function () {

  var iconBundleMethod = util.env.STENCIL.iconBundleMethod || "spritestack";

  if (iconBundleMethod === "spritestack") {
    return spritestackTask();
  }

  if (iconBundleMethod === "iconfont") {
    return iconfontTask();
  }
});

gulp.task("icons", ["icons-selector"], function (cb) {

  gulp.start("styles");

  cb();
});
