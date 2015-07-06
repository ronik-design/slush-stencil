var gulp = require('gulp');
var util = require('gulp-util');
var del = require('del');


gulp.task('clean', function(cb) {

    var cleanDirs = [];

    var watching = util.env.watching;

    cleanDirs.push(util.env.buildDir + '/**/*');

    if (!watching && util.env.deployDir) {
        cleanDirs.push(util.env.deployDir + '/**/*');
    }

    del(cleanDirs, cb);
});
