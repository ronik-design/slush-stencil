var gulp = require('gulp');
var util = require('gulp-util');
var notify = require('gulp-notify');
var size = require('gulp-size');
var iconfont = require('gulp-iconfont');
var swig = require('gulp-swig');
var rename = require('gulp-rename');
var cssfont64 = require('gulp-cssfont64');
var del = require('del');


function cleanGlyph(glyph) {
    return {
        name: glyph.name,
        unicode: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
    };
}

function writeGlyphs(stencilDir, tmpDir) {

    return function(glyphs) {

        var cleanGlyphs = glyphs.map(cleanGlyph);

        return gulp.src(stencilDir + '/icons/icons.swig')
            .pipe(swig({ data: { glyphs: cleanGlyphs }}))
            .pipe(rename('icons.styl'))
            .pipe(gulp.dest(tmpDir));
    };
}

gulp.task('iconfont', function() {

    var buildDir = util.env.buildDir,
        tmpDir = util.env.tmpDir,
        iconsDir = util.env.iconsDir,
        stencilDir = util.env.stencilDir;

    del.sync([buildDir + '/fonts/iconfont.*', tmpDir + '/icons.styl']);

    return gulp.src(iconsDir + '/*.svg')
        .pipe(iconfont({ fontName: 'iconfont', appendUnicode: true }))
        .on('glyphs', writeGlyphs(stencilDir, tmpDir))
        .on('error', notify.onError())
        .pipe(size({ title: 'icons' }))
        .pipe(gulp.dest(buildDir + '/fonts'));
});

gulp.task('icons-embedded', ['iconfont'], function () {

    var buildDir = util.env.buildDir,
        tmpDir = util.env.tmpDir;

    del.sync(tmpDir + '/iconfont_embedded.css');

    return gulp.src(buildDir + '/fonts/iconfont.ttf')
        .pipe(cssfont64())
        .pipe(rename('iconfont_embedded.css'))
        .pipe(gulp.dest(tmpDir));
});

gulp.task('icons', ['iconfont'], function (cb) {

    cb();
});
