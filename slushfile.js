/*
 * slush-stencil
 * https://github.com/ronik-design/slush-stencil
 *
 * Copyright (c) 2015, Michael Shick
 * Licensed under the ISC license.
 */

var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    util = require('gulp-util'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    jeditor = require('gulp-json-editor'),
    rename = require('gulp-rename'),
    ignore = require('gulp-ignore'),
    gulpif = require('gulp-if'),
    clone = require('lodash.clone'),
    merge = require('lodash.merge'),
    slugify = require('uslug'),
    inquirer = require('inquirer');


function format(string) {
    if(string) {
        var username = string.toLowerCase();
        return username.replace(/\s/g, '');
    }
    return '';
}

function dest(filepath) {
    return path.resolve(process.cwd(), filepath || './');
}

var defaults = (function () {
    var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
        workingDirName = process.cwd().split('/').pop().split('\\').pop(),
        osUserName = homeDir && homeDir.split('/').pop() || 'root',
        configFile = homeDir + '/.gitconfig',
        user = {};
    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }
    return {
        name: workingDirName,
        slug: slugify(workingDirName),
        userName: format(user.name) || osUserName,
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'platform',
        message: 'What serving platform would you like to use?',
        type: 'list',
        choices: [
            {
                name: 'Static',
                value: 'static'
            },
            {
                name: 'Webhook',
                value: 'webhook'
            }
        ]
    }, {
        name: 'name',
        message: 'What is the PRETTY name of your site?',
        default: defaults.name
    }, {
        name: 'slug',
        message: 'What is the name SLUG for your site?',
        default: defaults.slug,
        validate: function (slug) {
            return (slug === slugify(slug));
        }
    }, {
        name: 'domain',
        message: 'What is the domain for your site?',
        default: function (answers) {
            if (answers.platform === 'webhook') {
                return defaults.slug + '.webhook.org'
            }
            return defaults.slug + '.com';
        }
    }, {
        name: 'description',
        message: 'Please describe your site?'
    }, {
        name: 'version',
        message: 'What is the version of your site?',
        default: '0.1.0'
    }, {
        name: 'github',
        message: 'GitHub repo name?'
    }, {
        name: 'jsFramework',
        type: 'list',
        message: 'Which client-side framework would you like to use?',
        choices: [
            {
                name: 'Simple Modules (ES6, jQuery, lodash)',
                value: 'simple'
            },
            {
                name: 'Backbone (ES6, jQuery, lodash, Backbone)',
                value: 'backbone'
            },
            {
                name: 'React (ES6, jsx, Flux/alt, React Router)',
                value: 'react'
            }
        ]
    }, {
        name: 'cssFramework',
        type: 'list',
        message: 'Which stylus libraries you like to use?',
        choices: [
            {
                name: 'Basic (BEM-style, topical)',
                value: 'basic'
            },
            {
                name: 'Bootstrap (bootstrap-styl)',
                value: 'bootstrap'
            },
            {
                name: 'Skeleton.css',
                value: 'skeleton'
            }
        ]
    }, {
        type: 'confirm',
        name: 'singlePageApplication',
        message: 'Single Page Application? (Unknown routes are handled by index.html)',
        when: function (answers) {
            return (answers.platform === 'static');
        }
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {

            if (!answers.moveon) {
                return done();
            }

            var config = clone(answers);
            var platform = config.platform;

            config.buildDir = (platform === 'webhook') ? './static' : './public';

            config.styles = {
                minifyCss: (platform !== 'webhook'),
                revisionCss: (platform !== 'webhook')
            };

            config.browserSync = (platform !== 'webhook');

            var commonPath = __dirname + '/templates/common';
            var platformPath = __dirname + '/templates/platforms/' + platform;
            var destDir = dest();

            function installCommonFiles(cb) {

                var ignorePaths = [
                    commonPath + '/{styles,styles/**,styles/**/.*}',
                    commonPath + '/{scripts,scripts/**,scripts/**/.*}',
                    commonPath + '/{pages,pages/**,pages/**/.*}',
                    commonPath + '/package.json'
                ];

                gulp.src(commonPath + '/**/!(*.slush)', { dot: true })
                    .pipe(ignore(ignorePaths))
                    .pipe(conflict(destDir, { logger: console.log }))
                    .pipe(gulp.dest(destDir))
                    .on('end', cb);
            }

            function installCommonPages(cb) {

                var paths = [
                    commonPath + '/pages/' + config.cssFramework + '/**/*'
                ];

                gulp.src(paths, { dot: true })
                    .pipe(template(config))
                    .pipe(rename({ extname: '' }))
                    .pipe(conflict(dest('pages'), { logger: console.log }))
                    .pipe(gulp.dest(dest('pages')))
                    .on('end', cb);
            }

            function installJsFramework(cb) {

                var paths = [
                    commonPath + '/scripts/common/**/*',
                    commonPath + '/scripts/' + config.jsFramework + '/**/*'
                ];

                gulp.src(paths, { dot: true })
                    .pipe(conflict(dest('scripts'), { logger: console.log }))
                    .pipe(gulp.dest(dest('scripts')))
                    .on('end', cb);
            }

            function installCssFramework(cb) {

                var paths = [
                    commonPath + '/styles/common/**/*',
                    commonPath + '/styles/' + config.cssFramework + '/**/*'
                ];

                gulp.src(paths, { dot: true })
                    .pipe(conflict(dest('styles'), { logger: console.log }))
                    .pipe(gulp.dest(dest('styles')))
                    .on('end', cb);
            }

            function installPlatformFiles(cb) {

                var ignorePaths = [
                    platformPath + '/package.json'
                ];

                gulp.src(platformPath + '/**/!(*.slush)', { dot: true })
                    .pipe(ignore(ignorePaths))
                    .pipe(conflict(destDir, { logger: console.log }))
                    .pipe(gulp.dest(destDir))
                    .on('end', cb);
            }

            function installTemplatedFiles(cb) {

                var templateGlobs = [
                    commonPath + '/**/*.slush',
                    platformPath + '/**/*.slush'
                ];

                var ignoreGlobs = [
                    commonPath + '/pages/**/*.slush'
                ];

                gulp.src(templateGlobs, { dot: true })
                    .pipe(ignore(ignoreGlobs))
                    .pipe(template(config))
                    .pipe(rename({ extname: '' }))
                    .pipe(conflict(destDir, { logger: console.log }))
                    .pipe(gulp.dest(destDir))
                    .on('end', cb);
            }

            function writeConfig(cb) {

                gulp.src(commonPath + '/params.json')
                    .pipe(jeditor(config, { 'indent_char': ' ', 'indent_size': 2 }))
                    .pipe(gulp.dest(destDir))
                    .on('end', cb);
            }

            function extendPackageAndInstall(cb) {

                var pkgMerge = function (commonPkg) {

                    var platformPkg, existingPkg;
                    platformPkg = require(platformPath + '/package.json');
                    if (fs.existsSync(dest('package.json'))) {
                        existingPkg = require(dest('package.json'));
                    }

                    return merge(commonPkg, platformPkg, existingPkg || {});
                };

                gulp.src(commonPath + '/package.json')
                    .pipe(template(config))
                    .pipe(jeditor(pkgMerge, { 'indent_char': ' ', 'indent_size': 2 }))
                    .pipe(gulp.dest(destDir))
                    .pipe(install())
                    .on('end', cb);
            }

            async.series([
                installCommonFiles,
                installCommonPages,
                installJsFramework,
                installCssFramework,
                installPlatformFiles,
                installTemplatedFiles,
                writeConfig,
                extendPackageAndInstall
            ], done);
        });
});
