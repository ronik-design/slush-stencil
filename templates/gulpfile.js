var Gulp = require('gulp'),
    Util = require('gulp-util'),
    Webpack = require('webpack'),
    ReactTools = require('react-tools'),
    Fs = require('fs'),
    exec = require('child_process').exec,
    gulpIf = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    iconfont = require('gulp-iconfont'),
    size = require('gulp-size'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    run = require('gulp-run'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    jeet = require('jeet'),
    argv = require('minimist')(process.argv.slice(2));

var DEST = './static';
var RELEASE = !!argv.release;
var src = {};
var watch = false;

// Configure JSX Harmony transform in order to be able
// require .js files with JSX (see 'pages' task)
var originalJsTransform = require.extensions['.js'];

var reactTransform = function(module, filename) {
    if (filename.indexOf('node_modules') === -1) {
        var src = Fs.readFileSync(filename, {
            encoding: 'utf8'
        });
        src = ReactTools.transform(src, {
            harmony: true,
            stripTypes: true
        });
        module._compile(src, filename);
    } else {
        originalJsTransform(module, filename);
    }
};

require.extensions['.js'] = reactTransform;

Gulp.task('styles', function() {
    src.styles = 'styles/**/*.{css,styl}';
    Gulp.src('./styles/main.styl')
        .pipe(stylus({
            use: [nib(), jeet()]
        }))
        .pipe(gulpIf(RELEASE, minifyCss()))
        .pipe(Gulp.dest(DEST + '/css/'));
});

Gulp.task('scripts', function(cb) {
    src.scripts = 'scripts/**/*';
    var started = false;
    var config = require('./webpack.config.js')(RELEASE, DEST);
    var bundler = Webpack(config);

    function bundle(err, stats) {
        if (err) {
            throw new Util.PluginError('webpack', err);
        }

        if (argv.verbose) {
            Util.log('[webpack]', stats.toString({
                colors: true
            }));
        }

        if (!started) {
            started = true;
            return cb();
        }
    }

    if (watch) {
        bundler.watch(200, bundle);
    } else {
        bundler.run(bundle);
    }
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
    Gulp.src(src.icons)
        .pipe(iconfont({
            fontName: 'iconfont',
            appendCodepoints: true
        }))
        .on('codepoints', function(codepoints, options) {
            var len = codepoints.length;
            var str = 'icons = {';
            codepoints.forEach(function (icon, idx) {
                str += '"' + icon.name + '":' + (icon.codepoint).toString(16);
                if (idx < len - 1) {
                    str += ',';
                }
            });
            str += '}';
            Fs.writeFileSync('./icons/icons.styl', str);
        })
        .pipe(Gulp.dest(DEST + '/fonts'));
});

Gulp.task('build', ['icons', 'styles', 'images', 'scripts']);

Gulp.task('watch', ['build'], function() {
    watch = true;
    Gulp.watch(src.styles, ['styles']);
    Gulp.watch(src.images, ['images']);
    Gulp.watch(src.scripts, ['scripts']);
    Gulp.watch(src.icons, ['icons']);
});

// Starts the webhook serve process, and captures stdout
Gulp.task('serve', ['watch'], function() {
    exec('wh serve').stdout.pipe(process.stdout);
});

Gulp.task('default', ['serve']);
