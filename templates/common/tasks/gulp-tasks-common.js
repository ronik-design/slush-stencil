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
    rupture = require('rupture'),
    to5ify = require('6to5ify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    uglify = require('gulp-uglify'),
    Notify = require('gulp-notify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    assign = require('101/assign'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    react = require('gulp-react');

module.exports = function(src, dest) {

    var DEST = dest;

    Gulp.task('assets', function() {
        src.assets = 'assets/**/*';
        return Gulp.src(src.assets)
            .pipe(Gulp.dest(DEST + '/'));
    });

    Gulp.task('styles', function() {
        src.styles = 'styles/**/*.{css,styl}';
        Gulp.src('styles/**/[!_]*.{css,styl}')
            .pipe(stylus({
                use: [nib(), jeet(), rupture()]
            }))
            .pipe(Gulp.dest(DEST + '/css/'));
    });

    Gulp.task('watchify', ['lint'], function() {
        var app = 'main.js';
        var src = './scripts/' + app;
        var dst = DEST + '/javascript';
        var opt = assign(watchify.args, {
            debug: true
        });

        var bundler = watchify(browserify(src, opt));

        function rebundle() {
            return bundler
                .bundle()
                .on('error', Notify.onError())
                .pipe(source(app))
                .pipe(Gulp.dest(dst));
        }

        bundler
            .transform(to5ify.configure({
                sourceMap: 'inline',
                sourceMapRelative: __dirname + '/scripts',
                experimental: true
            }))
            .on('update', rebundle);

        return rebundle();
    });

    Gulp.task('browserify', ['lint'], function() {
        browserify('./scripts/main.js')
            .transform(to5ify.configure({
                experimental: true
            }))
            .bundle()
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(Gulp.dest(DEST + '/javascript'));
    });

    Gulp.task('images', function() {
        src.images = 'images/**/*';
        return Gulp.src(src.images)
            .pipe(changed(DEST + '/images'))
            .pipe(imagemin({
                progressive: true,
                interlaced: true
            }))
            .pipe(Gulp.dest(DEST + '/images'))
            .pipe(size({
                title: 'images'
            }));
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
                codepoints.forEach(function(icon, idx) {
                    str += '"'+icon.name+'":'+(icon.codepoint).toString(16);
                    if (idx < len - 1) {
                        str += ',';
                    }
                });
                str += '}';
                Fs.writeFileSync('./icons/icons.styl', str);
            })
            .pipe(Gulp.dest(DEST + '/fonts'));
    });

    Gulp.task('lint', function() {
        return Gulp.src(['./scripts/**/*.{js,jsx}'])
            .pipe(react())
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(jshint.reporter('fail'))
            .on('error', Notify.onError());
    });

    /**
     * Develop stuff
     */

    Gulp.task('watch:common',
        ['icons',
         'styles',
         'images',
         'assets',
         'watchify'
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

    // Starts the webhook serve process, and captures stdout
    Gulp.task('serve', ['watch'], function() {
        exec('wh serve').stdout.pipe(process.stdout);
    });

    /**
     * Release stuff
     */

    Gulp.task('build:common', [
        'icons',
        'styles',
        'images',
        'assets',
        'browserify'
    ]);

    Gulp.task('wh-build', ['build'], function(cb) {
        var whBuild = exec('wh build');
        whBuild.stdout.pipe(process.stdout);
        whBuild.on('exit', cb);
    });

    Gulp.task('wh-deploy', ['build'], function() {
        var whDeploy = exec('wh deploy');
        whDeploy.stdout.pipe(process.stdout);
        whDeploy.on('exit', cb);
    });
};
