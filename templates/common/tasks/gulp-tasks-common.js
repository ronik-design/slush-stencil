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
    del = require('del');

module.exports = function(src, dest) {

    var watching = false;

    Gulp.task('clean', function(cb) {
        del([dest + '/javascript/**/*.{js,json,map}'], cb);
    });

    Gulp.task('assets', function() {
        src.assets = 'assets/**/*';
        return Gulp.src(src.assets)
            .pipe(size({ title: 'assets' }))
            .pipe(Gulp.dest(dest + '/'));
    });

    Gulp.task('styles', function() {
        src.styles = 'styles/**/*.{css,styl}';
        Gulp.src('styles/**/[!_]*.{css,styl}')
            .pipe(stylus({
                use: [nib(), jeet(), rupture()]
            }))
            .pipe(gulpIf(!watching, minifyCss()))
            .pipe(size({ title: 'styles' }))
            .pipe(Gulp.dest(dest + '/css/'));
    });

    Gulp.task('webpack', function(cb) {
        var release = !watching;
        var started = false;
        var config = require('../webpack.config.js')(dest, release);
        var bundler = Webpack(config);

        function bundle(err, stats) {
            if (err) {
                throw Util.PluginError('webpack', err);
            }

            if (stats.hasErrors()) {
                Util.log('[webpack]', stats.toString({
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
            .pipe(changed(dest + '/images'))
            .pipe(imagemin({
                progressive: true,
                interlaced: true
            }))
            .on('error', Notify.onError())
            .pipe(size({ title: 'images' }))
            .pipe(Gulp.dest(dest + '/images'));
    });

    Gulp.task('icons', function() {
        src.icons = 'icons/*.svg';

        return Gulp.src(src.icons)
            .pipe(iconfont({
                fontName: 'iconfont',
                appendCodepoints: true
            }))
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
                Fs.writeFileSync('./icons/icons.styl', str);
            })
            .on('error', Notify.onError())
            .pipe(size({ title: 'icons' }))
            .pipe(Gulp.dest(dest + '/fonts'));
    });

    Gulp.task('lint', function() {
        return Gulp.src(['./scripts/**/*.{js,jsx}'])
            .pipe(react())
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(jshint.reporter('fail'))
            .on('error', Notify.onError());
    });

    Gulp.task('watch-start', function () {
        watching = true;
    });

    Gulp.task('watch:common', [
        'watch-start',
        'clean',
        'icons',
        'styles',
        'images',
        'assets',
        'webpack'
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
    });

    Gulp.task('build:common', [
        'clean',
        'icons',
        'styles',
        'images',
        'assets',
        'webpack'
    ]);
};
