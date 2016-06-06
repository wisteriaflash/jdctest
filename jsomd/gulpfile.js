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


//dependencies
var dependItem = {
    utils: {
        name: 'G_utils',
        amd: './g_utils',
        global: 'babelGlobal.utils'
    },
    tracking: {
        name: 'G_tracking',
        amd: './g_tracking',
        global: 'babelGlobal.tracking'
    },
    toast: {
        name: 'toast',
        amd: '../component/com_toast',
        global: 'babelComponent.toast'
    },
    mping: {
        name: 'MPing',
        amd: '//h5.m.jd.com/active/track/mping.min.js',
        global: 'MPing'
    }
};
var dependObj = {
    'g_excStatus': [dependItem.utils, dependItem.tracking, dependItem.toast],
    'g_share': [dependItem.utils, dependItem.toast],
    'g_header': [dependItem.utils],
    'g_tracking': [dependItem.mping]
};
//fileName
var path = require('path');
function getFileName(file){
    return path.basename(file.path, path.extname(file.path));
}
function getFormatName(file){
    var filename = path.basename(file.path, path.extname(file.path));
    var formatname = filename.split('_')[1];
    return formatname;
}
//umd-fun
function getUmdFun(type, files){
    var typeHump = type.replace(/^\S/,function(s){
        return s.toUpperCase();
    });
    return gulp.src(files)
        .pipe($.replace(/define.*\{/,''))
        .pipe($.strip({trim: true}))
        .pipe($.umd({
            namespace: function(file){
                return 'babel'+typeHump+'.'+getFormatName(file);
            },
            dependencies: function(file){
                var filename = getFileName(file);
                var dependArr = dependObj[filename];
                dependArr = dependArr ? dependArr : [];
                return dependArr;
            },
            template: 'templates/returnExportsAmd.js',
        }))
        .pipe($.replace(/}\);\s*\);/,'}));'))
        .pipe(gulp.dest('build/'+type));
};

//umd-global
gulp.task('umd-global', function() {
    getUmdFun('global',[
        'global/g_utils.js',
        'global/g_tracking.js',
        'global/g_excStatus.js',
        'global/g_share.js',
        'global/g_imglazyload.js',
        'global/g_header.js'
    ]);
});

////umd-component
gulp.task('umd-component', function() {
    getUmdFun('component',[
        'component/com_toast.js'
    ]);
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