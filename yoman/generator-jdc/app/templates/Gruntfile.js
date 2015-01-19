/*
 * grunt-generator-jdc
 * http://github.com/hollandben/grunt-sprite-generator
 *
 * Copyright (c) 2015 Wisteria
 * Licensed under the MIT license.
 */

'use strict';

/*global module */

module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);


  // Configurable paths
  var config = {
    src: 'src',
    dist: 'dist'
  };
  var getDestPath = function(url) {
    var arr = url.split('/');
    arr.shift();
    var dest = arr.join('/');
    console.log(dest);
    return dest;
  };

  //config
  grunt.initConfig({

    // Project settings
    config: config,

    //watch
    watch: {
      sass: {
        files: ['<%%= config.src %>/{,*/}*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['<%%= config.src %>/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%%= config.src %>/{,*/}*.html'
        ]
      }
    },

    //sass
    sass: {
      dist: {
        options: {
          style: 'compact',
          noCache: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.src %>/',
          src: ['{,*/}*.scss'],
          dest: '<%%= config.src %>',
          ext: '.css'
        }]
      }
    },

    //sprite
    sprite:{
      all: {
        src: '<%%= config.src %>/**/sprites/*.png',
        dest: 'spritesheet.png',
        destCss: 'sprites.css'
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= config.dist %>/*',
            '!<%%= config.dist %>/.git*'
          ]
        }]
      },
      tmp: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%%= config.src %>/{,*/}*.js'
      ]
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.src %>',
          dest: '<%%= config.dist %>',
          src: [
            '{,*/}*.html'
          ]
        }]
      }
    },


    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%%= config.dist %>'
      },
      html: '<%%= config.src %>/{,*/}*.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%%= config.dist %>',
          '<%%= config.dist %>/images',
          '<%%= config.dist %>/styles'
        ],
        blockReplacements: {
          css: function(block) {
            var dest = getDestPath(block.dest);
            return '<link rel="stylesheet" href="' + dest + '">';
          },
          js: function(block) {
            var dest = getDestPath(block.dest);
            return '<script src="' + dest + '"></script>'
          }
        }
      },
      html: ['<%%= config.dist %>/{,*/}*.html']
        // css: ['<%%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.src %>/**/img/',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.dist %>'
        }]
      }
    },

    //uglify
    // uglify: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '<%%= config.src %>/',
    //       src: ['{,*/}*.js'],
    //       dest: '<%%= config.dist %>',
    //       ext: '.min.js'
    //     }]
    //   }
    // }
  
    //base64
    dataUri: {
      dist: {
        // src file
        src: ['<%%= config.src %>/**/{,*/}*.css'],
        // output dir
        dest: '<%%= config.src %>',
        options: {
          // specified files are only encoding
          target: ['<%%= config.src %>/**/img/base64/*.*'],
          // adjust relative path?
          fixDirLevel: true,
          // img detecting base dir
          // baseDir: './'

          // Do not inline any images larger
          // than this size. 2048 is a size
          // recommended by Google's mod_pagespeed.
          maxBytes: 2048,
        }
      }
    }

  });

  //bulid
  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'copy',
    'usemin',
    'clean:tmp',
  ]);

  //defaul
  grunt.registerTask('default', [
    'watch'
  ]);
};