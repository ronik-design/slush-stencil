var gulp = require('gulp');
var exec = require('child_process').exec;


gulp.task('webhook-deploy', function (cb) {

    var whDeploy = exec('wh deploy');
    whDeploy.stdout.pipe(process.stdout);
    whDeploy.on('exit', cb);
});
