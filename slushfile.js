/*
 * slush-webhook
 * https://github.com/ronik-design/slush-webhook
 *
 * Copyright (c) 2015, Michael Shick
 * Licensed under the MIT license.
 */

var gulp = require('gulp'),
    async = require('async'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    ignore = require('gulp-ignore'),
    _ = require('underscore.string'),
    inquirer = require('inquirer');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
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
        siteName: workingDirName,
        siteNameSlug: _.slugify(workingDirName),
        userName: format(user.name) || osUserName,
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'siteName',
        message: 'What is the name of your site?',
        default: defaults.siteName
    }, {
        name: 'siteNameSlug',
        message: 'What is slugified name of your site? (this should match the site name for webhook)',
        default: defaults.siteNameSlug,
        validate: function (siteNameSlug) {
            return (siteNameSlug === _.slugify(siteNameSlug));
        }
    }, {
        name: 'siteDomain',
        message: 'What is the domain for your site?'
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.1.0'
    }, {
        name: 'secretKey',
        message: 'What is Firebase secretKey for your site?',
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

            var templateFiles = [
                __dirname + '/templates/package.json',
                __dirname + '/templates/.firebase.conf',
                __dirname + '/templates/gulpfile.js'
            ];

            function installPlainFiles(cb) {
                gulp.src(__dirname + '/templates/**', { dot: true })
                    .pipe(ignore(templateFiles))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .on('end', function () {
                        cb();
                    });

            }

            function installTemplateFiles(cb) {
                gulp.src(templateFiles)
                    .pipe(template(answers))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .pipe(install())
                    .on('end', function () {
                        cb();
                    });
            }

            async.series([
                installPlainFiles,
                installTemplateFiles
            ], done);
        });
});
