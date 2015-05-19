/*global module */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    browserSync: {
      dev: {
        bsFiles: {
          src: [
          '**/*.{css,html}',
          'jdcsign/*.js',
          'jdcevent/*.js'
          ]
        },
        options: {
          server: {
            baseDir: "./"
          }
        }
      }
    }
  });

  //load
  grunt.loadNpmTasks('grunt-browser-sync');
  //task
  grunt.registerTask('default', ['browserSync']);
};