/*
 * slush-webhook
 * https://github.com/ronik-design/slush-webhook
 *
 * Copyright (c) 2015, Michael Shick
 * Licensed under the MIT license.
 */

var gulp = require('gulp'),
    fs = require('fs'),
    async = require('async'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    extend = require('gulp-multi-extend'),
    rename = require('gulp-rename'),
    ignore = require('gulp-ignore'),
    gulpif = require('gulp-if'),
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
                name: 'React/Flux(alt)',
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
                    __dirname + '/templates/{scripts,scripts/**,scripts/**/.*}',
                    __dirname + '/templates/package.json'
                ];

                gulp.src(__dirname + '/templates/**/!(*.slush)', { dot: true })
                    .pipe(ignore(ignorePaths))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .on('end', cb);
            }

            function installScripts(cb) {
                var glob = __dirname + '/templates/scripts/' + answers.jsFramework + '/**/*';
                gulp.src(glob, { dot: true })
                    .pipe(conflict('./scripts'))
                    .pipe(gulp.dest('./scripts'))
                    .on('end', cb);
            }

            function installTemplateFiles(cb) {
                gulp.src(__dirname + '/templates/**/*.slush', { dot: true })
                    .pipe(template(locals))
                    .pipe(rename({ extname: '' }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .on('end', cb);
            }

            function extendPackageAndInstall(cb) {
                var exists = fs.existsSync('package.json');
                var package = gulp.src(__dirname + '/templates/package.json');

                package.pipe(template(locals));

                if (exists) {
                    package.pipe(extend('package.json', null, 2));
                }

                package.pipe(gulp.dest('./'))
                    .pipe(install())
                    .on('end', cb);
            }

            async.series([
                installPlainFiles,
                installScripts,
                installTemplateFiles,
                extendPackageAndInstall
            ], done);
        });
});
