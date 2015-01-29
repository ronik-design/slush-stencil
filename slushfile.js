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
    extend = require('gulp-multi-extend'),
    rename = require('gulp-rename'),
    ignore = require('gulp-ignore'),
    clean = require('gulp-clean'),
    clone = require('101/clone'),
    slugify = require('underscore.string/slugify'),
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
        name: workingDirName,
        nameWebhook: slugify(workingDirName),
        userName: format(user.name) || osUserName,
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [{
        name: 'name',
        message: 'What is the name of your site?',
        default: defaults.name
    }, {
        name: 'domain',
        message: 'What is the domain for your site?',
        default: defaults.nameWebhook + '.com',
    }, {
        name: 'nameWebhook',
        message: 'What is your Webhook site name? (slug chars only)',
        default: defaults.nameWebhook,
        validate: function (nameWebhook) {
            return (nameWebhook === slugify(nameWebhook));
        }
    }, {
        name: 'description',
        message: 'Please describe your site?'
    }, {
        name: 'version',
        message: 'What is the version of your site?',
        default: '0.1.0'
    }, {
        name: 'jsFramework',
        type: 'list',
        message: 'Which client-side framework would you like to use?',
        choices: [
            {
                name: 'Simple Modules (jQuery,lodash)',
                value: 'simple'
            },
            {
                name: 'Backbone',
                value: 'backbone'
            },
            {
                name: 'React/TuxedoJS',
                value: 'react'
            }
        ]
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

            var locals = clone(answers);

            function installPlainFiles(cb) {

                var ignorePaths = [
                    __dirname + '/templates/{scripts,scripts/**}',
                    __dirname + '/templates/package.json'
                ];

                gulp.src(__dirname + '/templates/**/!(*.slush)', { dot: true })
                    .pipe(ignore(ignorePaths))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .on('end', function () {
                        cb();
                    });
            }

            function cleanScripts(cb) {
                gulp.src('scripts')
                    .pipe(clean({ force: true }))
                    .on('end', function () {
                        cb();
                    });
            }

            function installScripts(cb) {
                var glob = __dirname + '/templates/scripts/' + answers.jsFramework + '/**';
                gulp.src(glob, { dot: true })
                    .pipe(rename({ dirname: 'scripts' }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .on('end', function () {
                        cb();
                    });
            }

            function installTemplateFiles(cb) {
                gulp.src(__dirname + '/templates/**/*.slush', { dot: true })
                    .pipe(template(locals))
                    .pipe(rename({ extname: '' }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .on('end', function () {
                        cb();
                    });
            }

            function extendPackageAndInstall(cb) {
                gulp.src(__dirname + '/templates/package.json')
                    .pipe(template(locals))
                    .pipe(extend('package.json', null, 2))
                    .pipe(gulp.dest('./'))
                    .pipe(install())
                    .on('end', function () {
                        cb();
                    });
            }

            async.series([
                installPlainFiles,
                cleanScripts,
                installScripts,
                installTemplateFiles,
                extendPackageAndInstall
            ], done);
        });
});
