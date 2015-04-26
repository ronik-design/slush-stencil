var gulp = require('gulp');
var util = require('gulp-util');
var notify = require('gulp-notify');
var size = require('gulp-size');
var iconfont = require('gulp-iconfont');
var swig = require('gulp-swig');
var rename = require('gulp-rename');
var cssfont64 = require('gulp-cssfont64');
var del = require('del');

function writeCodepoints(stylesDir, tmpDir) {

    return function(codepoints) {

        return gulp.src(stylesDir + '/icons/icons.swig')
            .pipe(swig({ data: { icons: codepoints }}))
            .pipe(rename('icons.styl'))
            .pipe(gulp.dest(tmpDir));
    };
}

gulp.task('iconfont', function() {

    var buildDir = util.env.buildDir,
        tmpDir = util.env.tmpDir,
        iconsDir = util.env.iconsDir,
        stylesDir = util.env.stylesDir;

    del.sync([buildDir + '/fonts/**/*', tmpDir + '/icons.styl']);

    return gulp.src(iconsDir + '/*.svg')
        .pipe(iconfont({ fontName: 'iconfont', appendCodepoints: true }))
        .on('error', notify.onError())
        .pipe(size({ title: 'icons' }))
        .on('codepoints', writeCodepoints(stylesDir, tmpDir))
        .on('error', notify.onError())
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
