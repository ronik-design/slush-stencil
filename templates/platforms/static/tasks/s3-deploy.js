var gulp = require('gulp');
var util = require('gulp-util');
var awsPublish = require('gulp-awspublish');
var s3Website = require('s3-website');
var notify = require('gulp-notify');


gulp.task('s3-deploy', ['s3-deploy-config'], function () {

    var production = util.env.production;
    var domain = util.env.domain;
    var buildDir = util.env.buildDir;

    var bucketName = production ? domain : 'stage.' + domain;
    var publisher = awsPublish.create({ bucket: bucketName });

    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    return gulp.src(buildDir + '/**/*')
        .pipe(awsPublish.gzip())
        .pipe(publisher.publish(headers))
        .on('error', notify.onError())
        .pipe(publisher.sync())
        .on('error', notify.onError())
        .pipe(publisher.cache())
        .on('error', notify.onError())
        .pipe(awsPublish.reporter());
});

gulp.task('s3-deploy-config', function (cb) {

    var production = util.env.production;
    var domain = util.env.domain;
    var spa = util.env.spa;

    var bucketName = production ? domain : 'stage.' + domain;

    var s3Config = {
        domain: bucketName,
        index: 'index.html',
        error: 'error.html'
    };

    if (spa) {
        s3Config.routes = [{
            Condition: {
                HttpErrorCodeReturnedEquals: 404
            },
            Redirect: {
                HostName: bucketName
            }
        }];
    }

    s3Website(s3Config, function (err, website) {

        if (err) {
            notify.onError(err);
        }

        if (website.modified) {
            util.log(
                'deploy-s3-config:',
                'Site configuration updated %s', website.url
            );
        }

        cb(err);
    });
});
