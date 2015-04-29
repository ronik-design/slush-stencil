var gulp = require('gulp');
var exec = require('child_process').exec;


gulp.task('webhook-build', function (cb) {

    var whBuild = exec('wh build');
    whBuild.stdout.pipe(process.stdout);
    whBuild.on('exit', cb);
});
