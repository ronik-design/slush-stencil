var gulp = require('gulp');
var util = require('gulp-util');
var eslint = require('gulp-eslint');
var notify = require('gulp-notify');

gulp.task('lint', function() {

    var scripts = util.env.scripts;

    var globs = [
        'webpack.config.js',
        'webpack.production.config.js',
        'tasks/*'
    ];

    var options = {
        useEslintrc: true
    };

    if (scripts) {
        globs.push('scripts/**/*.{js,jsx}');
    }

    return gulp.src(globs)
        .pipe(eslint(options))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .on('error', notify.onError());
});
