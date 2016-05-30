'use strict';

/* global module */
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins({
    rename: {
        // 'gulp-html-replace': 'htmlreplace',
        // 'gulp-requirejs-optimize': 'requirejsOptimize'
    }
});

//debug
var stripDebug = require('gulp-strip-debug');
gulp.task('debuge-clean', function () {
    return gulp.src('app.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('dist'));
});

//compress
gulp.task('compress', function() {
  return gulp.src('app.js')
    .pipe($.uglify({
        // output: {
        //     beautify: true
        // },
        compress: {
            drop_console: true
        }
    }))
    .pipe(gulp.dest('dist'));
});