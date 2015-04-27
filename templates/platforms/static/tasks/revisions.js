var gulp = require('gulp');
var util = require('gulp-util');
var revCollector = require('gulp-rev-collector');
var notify = require('gulp-notify');

gulp.task('revisions', function () {

    var buildDir = util.env.buildDir;

    var revCollectorConfig = {
        revSuffix: '-[0-9a-f]{8,20}',
        dirReplacements: {
            '/javascript/': '',
            '/css/': '/css/'
        }
    };

    return gulp.src([buildDir + '/**/rev-manifest.json', buildDir + '/**/*.html'])
        .pipe(revCollector(revCollectorConfig))
        .on('error', notify.onError())
        .pipe(gulp.dest(buildDir));
});
