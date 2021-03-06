/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2011-2014 Webcomm Pty Ltd
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Load plugins
var
    gulp         = require('gulp'),
    less         = require('gulp-less'),
    minifycss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    rimraf       = require('gulp-rimraf'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload');

var
    bowerPATH   = '../bower_components/'
    publicPATH  = '../public/'
    srcPATH     = '';

var config = {

    // If you do not have the live reload extension installed,
    // set this to true. We will include the script for you,
    // just to aid with development.
    appendLiveReload: false,

    // Should CSS & JS be compressed?
    minifyCss: true,
    uglifyJS: false

}

// CSS
gulp.task('css', function() {
    var stream = gulp
        .src(srcPATH + 'less/styles.less')
        .pipe(less().on('error', notify.onError(function (error) {
            return 'Error compiling LESS: ' + error.message;
        })))
        .pipe(gulp.dest(publicPATH + 'css'));

    if (config.minifyCss === true) {
        stream.pipe(minifycss());
    }

    return stream
        .pipe(gulp.dest(publicPATH + 'css'));
});

// JS
gulp.task('js', function() {
    var scripts = [
        srcPATH + 'js/angular.min.js',
        srcPATH + 'js/angular-resource.min.js',
        bowerPATH + 'angular-strap/dist/angular-strap.min.js',
        bowerPATH + 'angular-strap/dist/angular-strap.tpl.min.js',
        srcPATH + 'js/core.js'
    ];

    if (config.appendLiveReload === true) {
        scripts.push('src/js/livereload.js');
    }

    var stream = gulp
        .src(scripts)
        .pipe(concat('app.js'));

    if (config.uglifyJS === true) {
        stream.pipe(uglify());
    }

    return stream
        .pipe(gulp.dest(publicPATH + 'js'));
});

// Images
gulp.task('images', function() {
    return gulp
        .src('img/**/*')
        .pipe(gulp.dest(publicPATH + 'img'));
});

// Html
gulp.task('html', function() {
    return gulp
        .src('views/**/*')
        .pipe(gulp.dest(publicPATH + 'views'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp
        .src([
            bowerPATH + 'font-awesome/fonts/*'
        ])
        .pipe(gulp.dest(publicPATH + 'fonts'));
});

// Rimraf
gulp.task('rimraf', function() {
    return gulp
        .src(['css', 'js', 'images'], {read: false})
        .pipe(rimraf());
});

// Default task
gulp.task('default', function() {
    gulp.start('css', 'js', 'html', 'images', 'fonts');
});

// Watch
gulp.task('watch', function() {

    // Watch .less files
    gulp.watch(srcPATH + 'less/**/*.less', ['css']);

    // Watch .js files
    gulp.watch(srcPATH + 'js/**/*.js', ['js']);

    // Watch .html files
    gulp.watch(srcPATH + 'views/**/*.html', ['html']);

    // Watch image files
    gulp.watch(srcPATH + 'img/**/*', ['images']);

    // Watch fonts
    gulp.watch(bowerPATH + 'bootstrap/fonts/**/*', ['fonts']);

    // Create LiveReload server
    var server = livereload();

    // Watch any files in , reload on change
    gulp.watch([publicPATH + 'css/style.css', publicPATH + 'views/**/*.html', publicPATH + 'js/script.js', publicPATH + 'images/**/*', publicPATH + 'fonts/**/*']).on('change', function(file) {
        server.changed(file.path);
    });

});