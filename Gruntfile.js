/*global module */

module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    inline: {
      dist: {
        options: {
          // cssmin: true
        },
        src: 'Swipe/index.html',
        dest: 'Swipe/index-pub.html'
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ['**/*.{css,html}', 'jdcsign/*.js', 'jdcevent/*.js']
        },
        options: {
          server: {
            baseDir: "./"
          }
        }
      }
    }
  });

  //task
  grunt.registerTask('default', ['browserSync']);
};