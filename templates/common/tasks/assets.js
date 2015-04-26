var gulp = require('gulp'),
    util = require('gulp-util'),
    size = require('gulp-size');

gulp.task('assets', function() {
    var buildDir = util.env.buildDir;
    var assetsDir = util.env.assetsDir;

    return gulp.src(assetsDir + '/**/*')
        .pipe(size({ title: 'assets' }))
        .pipe(gulp.dest(buildDir + '/'));
});
