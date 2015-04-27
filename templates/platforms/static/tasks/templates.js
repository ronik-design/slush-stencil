var path = require('path');
var gulp = require('gulp');
var util = require('gulp-util');
var notify = require('gulp-notify');
var size = require('gulp-size');
var swig = require('gulp-swig');
var data = require('gulp-data');
var glob = require('glob');
var assign = require('101/assign');
var prettify = require('gulp-prettify');


var getJsonData = function(dataDir) {
    return function(file) {
        var jsonData;
        try {
            var basename = path.basename(file.path, path.extname(file.path));
            jsonData = require(dataDir + '/' + basename + '.json');
        } catch(e) {
            jsonData = null;
        }
        return jsonData;
    };
};

var getJsonGlobals = function (baseDir, dataDir) {
    var globals = {
        package: require(baseDir + '/package.json')
    };
    var fileGlobs = glob.sync(dataDir + '/**/_*.json');
    fileGlobs.forEach(function(fileGlob) {
        var prop = path.basename(fileGlob).replace('.json', '');
        globals[prop] = getJsonData(dataDir)({ path: fileGlob });
    });
    return globals;
};

gulp.task('templates', function() {
    var buildDir = util.env.buildDir,
        baseDir = util.env.baseDir,
        pagesDir = util.env.templatePagesDir,
        dataDir = util.env.templateDataDir;

    var jsonGlobals = getJsonGlobals(baseDir, dataDir);
    var globals = assign(jsonGlobals, { '__DEV__': util.env.watching });

    var opts = {
        setup: function(swigInstance) {
            swigInstance.setDefaults({
                loader: swigInstance.loaders.fs(baseDir)
            });
        },
        defaults: {
            cache: false,
            locals: globals
        }
    };

    return gulp.src(pagesDir + '/**/*.html')
        .pipe(data(getJsonData(dataDir)))
        .on('error', notify.onError())
        .pipe(swig(opts))
        .on('error', notify.onError())
        .pipe(prettify({ 'indent_size': 2 }))
        .pipe(size( { title: 'templates' }))
        .pipe(gulp.dest(buildDir));
});
