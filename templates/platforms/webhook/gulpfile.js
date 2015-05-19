var PACKAGE = require('./package');
var PARAMS = require('./params');

var path = require('path');
var gulp = require('gulp');
var util = require('gulp-util');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');


function dirPath(dir) {
    return path.resolve(__dirname, dir);
}

// Params
util.env.PACKAGE = PACKAGE;
util.env.PARAMS = PARAMS;

// Domain, for...
util.env.domain = PARAMS.domain;

// Build directory
util.env.buildDir = dirPath(PARAMS.buildDir);
util.env.baseDir = dirPath('./');
util.env.tmpDir = dirPath(PARAMS.buildDir + '/.tmp');

// Various process sub-dirs
util.env.assetsDir = dirPath('assets');
util.env.imagesDir = dirPath('images');
util.env.scriptsDir = dirPath('scripts');
util.env.stylesDir = dirPath('styles');
util.env.iconsDir = dirPath('icons');

gulp.task('build', function(cb) {

    runSequence(
        'clean',
        ['icons', 'lint', 'images', 'assets'],
        ['styles', 'webpack'],
        'webhook-build',
        cb
        );
});

gulp.task('watch', function (cb) {

    util.env.watching = true;

    function watchStart() {

        watch('assets/**/*', function() {
            gulp.start('assets');
        });
        watch('styles/**/*.{css,styl}', function() {
            gulp.start('styles');
        });
        watch('images/**/*', function() {
            gulp.start('images');
        });
        watch('icons/**/*.svg', function() {
            runSequence('icons', 'styles');
        });

        cb();
    }

    runSequence('build', watchStart);
});

gulp.task('deploy', function (cb) {

    runSequence('build', 'webhook-deploy', cb);
});

gulp.task('serve', function (cb) {

    runSequence('watch', 'webhook-serve', cb);
});

gulp.task('default', function (cb) {

    var help = [
        '',
        '',
        '---- S T E N C I L ----',
        '',
        'Usage: gulp [task] [options]',
        '',
        'gulp clean',
        'gulp lint [--scripts]',
        'gulp build',
        'gulp deploy',
        'gulp serve',
        'gulp watch',
        ''
    ];

    util.log(help.join('\n'));

    cb();
});

requireDir('./tasks');
