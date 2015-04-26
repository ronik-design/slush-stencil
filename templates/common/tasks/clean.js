var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');

gulp.task('clean', function(cb) {

    var buildDir = util.env.buildDir;

    del([buildDir + '/**/*'], cb);
});
