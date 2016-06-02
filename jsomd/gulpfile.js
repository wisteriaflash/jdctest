'use strict';

/* global module */
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins({
    rename: {
        'gulp-requirejs-optimize': 'requirejsOptimize',
        'gulp-strip-comments': 'strip'
    }
});

//js-concat
gulp.task('omd-concat', function() {
    return gulp.src(['build/global/*.js', '!build/global/global.js'])
        .pipe($.concat('global.js'))
        // .pipe($.uglify())
        .pipe(gulp.dest('./dist/js/'));
});

//umd
gulp.task('umd', function() {
  return gulp.src('global/*.js')
    .pipe($.umd())
    .pipe(gulp.dest('build'));
});




var path = require('path');
var dependenciesObj = {
    'g_excStatus': [{
        name: 'G_utils',
        amd: './g_utils',
        global: 'babelGlobal.utils'
    },{
        name: 'G_tracking',
        amd: './g_tracking',
        global: 'babelGlobal.tracking'
    },{
        name: 'toast',
        amd: '../component/com_toast',
        global: 'babelComponent.toast'
    }],
    'g_share': [{
        name: 'G_utils',
        amd: './g_utils',
        global: 'babelGlobal.utils'
    },{
        name: 'toast',
        amd: '../component/com_toast',
        global: 'babelComponent.toast'
    }],
    'g_header': [{
        name: 'G_utils',
        amd: './g_utils',
        global: 'babelGlobal.utils'
    }],
    'g_tracking': [{
        name: 'MPing',
        amd: '//h5.m.jd.com/active/track/mping.min.js',
        global: 'MPing' 
    }]
};
function getFormatName(file){
    var filename = path.basename(file.path, path.extname(file.path));
    var formatname = filename.split('_')[1];
    return formatname;
}
gulp.task('umd-2', function() {
  //global
  gulp.src([
        'global/g_utils.js',
        'global/g_tracking.js',
        'global/g_excStatus.js',
        'global/g_share.js',
        'global/g_imglazyload.js',
        'global/g_header.js'
    ])
    .pipe($.replace(/define.*\{/,''))
    .pipe($.strip({trim: true}))
    .pipe($.umd({
        namespace: function(file){
            return 'babelGlobal.'+getFormatName(file);
        },
        dependencies: function(file){
            var filename = path.basename(file.path, path.extname(file.path));
            var dependArr = dependenciesObj[filename];
            dependArr = dependArr ? dependArr : [];
            return dependArr;
        },
        template: 'templates/returnExportsAmd.js',
    }))
    .pipe($.replace(/}\);\s*\);/,'}));'))
    .pipe(gulp.dest('build/global'));
});

//component
gulp.task('umd-3', function() {
  return gulp.src([
        'component/com_toast.js'
    ])
    .pipe($.replace(/define.*\{/,''))
    .pipe($.umd({
        namespace: function(file){
            return 'babelComponent.'+getFormatName(file);
        },
        dependencies: function(file){
            var filename = path.basename(file.path, path.extname(file.path));
            var dependArr = dependenciesObj[filename];
            dependArr = dependArr ? dependArr : [];
            return dependArr;
        },
        template: 'templates/returnExportsAmd.js',
    }))
    .pipe($.replace('}););','}));'))
    .pipe(gulp.dest('build/component'));
});









//auto-load
var browserSync = require('browser-sync').create();
gulp.task('browsersync', function() {
    var files = [
        '*.html',
        '*.js',
        'global/*.js'
    ];
    browserSync.init(files, {
        server: {
            baseDir: './',
            // https: true
        },
        ghostMode: false,
        startPath: 'index.html'
    });
});

// watch & browsersunc
gulp.task('default', [
    'browsersync'
]);