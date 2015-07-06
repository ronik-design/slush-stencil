/* eslint no-trailing-spaces:0 */
var fs = require('fs');
var gulp = require('gulp');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');
var notify = require('gulp-notify');
var size = require('gulp-size');
var del = require('del');
var rupture = require('rupture');
var gulpIf = require('gulp-if');
var nib = require('nib');


gulp.task('styles', function () {

    var PARAMS = util.env.PARAMS;
    var watching = util.env.watching;
    var buildDir = util.env.buildDir;
    var tmpDir = util.env.tmpDir;
    var stylesDir = util.env.stylesDir;
    var stencilDir = util.env.stencilDir;

    var imports = [],
        iconfontEmbedded, iconStyles;

    iconfontEmbedded = tmpDir + '/iconfont_embedded.css';

    if (fs.existsSync(iconfontEmbedded)) {
        imports.push(iconfontEmbedded);
    } else {
        imports.push(stencilDir + '/icons/iconfont_fontface.styl');
    }

    iconStyles = tmpDir + '/icons.styl';

    if (fs.existsSync(iconStyles)) {
        imports.push(iconStyles);
    } else {
        imports.push(stencilDir + '/icons/icons.styl');
    }

    var use = [nib(), rupture()];

    if (PARAMS.cssFramework === 'basic') {
        use.push(require('jeet')());
    }

    if (PARAMS.cssFramework === 'bootstrap') {
        use.push(require('bootstrap-styl')());
    }

    del.sync(buildDir + '/css/**/*');

    return gulp.src(stylesDir + '/**/[!_]*.{css,styl}')
        .pipe(gulpIf(watching, sourcemaps.init()))
        .pipe(stylus({ use: use, import: imports, 'include css': true }))
        .on('error', notify.onError())
        .pipe(gulpIf(watching, sourcemaps.write('./')))
        .pipe(size({ title: 'styles' }))
        .pipe(gulp.dest(buildDir + '/css/'));
});
