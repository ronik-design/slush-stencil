var fs = require('fs');
var url = require('url');
var gulp = require('gulp');
var util = require('gulp-util');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');


function middleware(buildDir) {

    return function (req, res, next) {

        var fileName = url.parse(req.url);
        fileName = fileName.href.split(fileName.search).join('');
        var fileExists = fs.existsSync(buildDir + fileName);
        if (!fileExists && fileName.indexOf('browser-sync-client') < 0) {
            req.url = '/index.html';
        }
        return next();
    };
}

gulp.task('browser-sync', function () {

    var buildDir = util.env.buildDir;

    var host = util.env.host || 'localhost';
    var port = util.env.port || 8080;
    var spa = util.env.spa;

    var serverOptions = {
        baseDir: buildDir
    };

    if (spa) {
        serverOptions.middleware = middleware(buildDir);
    }

    browserSync({
        open: false,
        ghostMode: false,
        host: host,
        port: port,
        server: serverOptions
    });

    util.env.reload = browserSync.reload;

    watch(buildDir + '/**/*.{js,html,css}', function () {
        browserSync.reload();
    });
});
