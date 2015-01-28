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
        siteNameWebhook: _.slugify(workingDirName),
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
        name: 'siteNameWebhook',
        message: 'What is your Webhook site name? (slug chars only)',
        default: defaults.siteNameWebhook,
        validate: function (siteNameWebhook) {
            return (siteNameWebhook === _.slugify(siteNameWebhook));
        }
    }, {
        name: 'secretKey',
        message: 'What is Firebase/Webhook secretKey for your site?',
    }, {
        name: 'siteDomain',
        message: 'What is the domain for your site?',
        default: defaults.siteNameWebhook + '.com',
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.1.0'
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
