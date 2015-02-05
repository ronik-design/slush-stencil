var Gulp = require('gulp'),
    Fs = require('fs'),
    watch = require('gulp-watch'),
    iconfont = require('gulp-iconfont'),
    size = require('gulp-size'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    jeet = require('jeet'),
    minifyCss = require('gulp-minify-css'),
    gulpIf = require('gulp-if'),
    rupture = require('rupture'),
    uglify = require('gulp-uglify'),
    Notify = require('gulp-notify'),
    assign = require('101/assign'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    react = require('gulp-react'),
    Webpack = require('webpack'),
    Util = require('gulp-util'),
    log = Util.log,
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    cssfont64 = require('gulp-cssfont64'),
    rename = require('gulp-rename'),
    map = require('map-stream');

module.exports = function(buildDir, devServer) {

    var src = {};
    var watching = false;

    Gulp.task('clean', function(cb) {
        del([
            buildDir + '/javascript/**/*.{js,json,map}',
            buildDir + '/css/**/*.css',
            buildDir + '/fonts/**/*.*'
        ], cb);
    });

    Gulp.task('assets', function() {

        src.assets = 'assets/**/*';

        return Gulp.src(src.assets)
            .pipe(size({ title: 'assets' }))
            .pipe(Gulp.dest(buildDir + '/'));
    });

    Gulp.task('styles', function() {

        src.styles = 'styles/**/*.{css,styl}';

        return Gulp.src('styles/**/[!_]*.{css,styl}')
            .pipe(gulpIf(watching, sourcemaps.init()))
            .pipe(stylus({
                use: [nib(), jeet(), rupture()],
                'include css': true
            }))
            .on('error', Notify.onError())
            .pipe(gulpIf(watching, sourcemaps.write()))
            .pipe(size({ title: 'styles' }))
            .pipe(Gulp.dest(buildDir + '/css/'))
            .pipe(map(function(a, cb) {
                if (devServer && devServer.invalidate) {
                    devServer.invalidate();
                }
                cb();
            }));
    });

    Gulp.task('webpack', function(cb) {
        var release = !watching;
        var started = false;
        var config;

        if (release) {
            config = require('../webpack.production.config.js');
        } else {
            config = require('../webpack.config.js');
        }

        var bundler = Webpack(config);

        function bundle(err, stats) {
            if (err) {
                throw Util.PluginError('webpack', err);
            }

            if (stats.hasErrors()) {
                log('[webpack]', stats.toString({
                    colors: true
                }));
            }

            if (!started) {
                started = true;
                return cb();
            }
        }

        if (watching) {
            bundler.watch(200, bundle);
        } else {
            bundler.run(bundle);
        }
    });

    Gulp.task('images', function() {
        src.images = 'images/**/*';
        return Gulp.src(src.images)
            .pipe(changed(buildDir + '/images'))
            .pipe(imagemin({
                progressive: true,
                interlaced: true
            }))
            .on('error', Notify.onError())
            .pipe(size({ title: 'images' }))
            .pipe(Gulp.dest(buildDir + '/images'));
    });

    Gulp.task('iconfont', function() {
        src.icons = 'icons/*.svg';

        return Gulp.src(src.icons)
            .pipe(iconfont({
                fontName: 'iconfont',
                appendCodepoints: true
            }))
            .on('error', Notify.onError())
            .on('codepoints', function(codepoints, options) {
                var len = codepoints.length;
                var str = 'icons = {';
                codepoints.forEach(function(ico, idx) {
                    str += '"' + ico.name + '":' + (ico.codepoint).toString(16);
                    if (idx < len - 1) {
                        str += ',';
                    }
                });
                str += '}';
                Fs.writeFileSync('styles/collection/_icons.styl', str);
            })
            .on('error', Notify.onError())
            .pipe(size({ title: 'icons' }))
            .pipe(Gulp.dest(buildDir + '/fonts'));
    });

    Gulp.task('icons', ['iconfont'], function () {
      return Gulp.src(buildDir + '/fonts/iconfont.ttf')
            .pipe(cssfont64())
            .pipe(rename('_iconfont_embedded.css'))
            .pipe(Gulp.dest('styles/'));
    });

    Gulp.task('watch:common', [
        'watch-start',
        'clean',
        'icons',
        'styles',
        'images',
        'assets'
    ], function() {

        watch(src.assets, function() {
            Gulp.start('assets');
        });
        watch(src.styles, function() {
            Gulp.start('styles');
        });
        watch(src.images, function() {
            Gulp.start('images');
        });
        watch(src.icons, function() {
            Gulp.start('icons');
        });

        cb();
    });
};

Gulp.task('lint', function() {
    var patterns = [
        './scripts/**/*.{js,jsx}',
        '!./scripts/{vendor,vendor/**,vendor/**/.*}'
    ];

    return Gulp.src(patterns)
        .pipe(react())
        .on('error', Notify.onError())
        .pipe(jshint())
        .on('error', Notify.onError())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .on('error', Notify.onError());
});

Gulp.task('watch-start', function (cb) {
    watching = true;
    cb();
});

Gulp.task('build:common', [
    'clean',
    'icons',
    'styles',
    'images',
    'assets',
    'webpack'
]);

Gulp.task('default', function (cb) {
    log('\n \
         Usage: gulp [task] [options]\n\
         \n\
         Tasks:\n\
         gulp serve\n\
         gulp clean\n\
         gulp build\n\
         gulp watch\n\
         gulp deploy');
    cb();
});
