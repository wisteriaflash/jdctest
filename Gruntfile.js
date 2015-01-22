
/*global module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        watch: {
            livereload: {
                options: {
                  livereload: true
                },
                files: [
                    'jdcevent/**',
                    'jdcsign/**/*',
                    '!jdcsign/pic/**', 
                    '!jdcsign/upload/**', 
                    '!jdcsign/result.html'
                ]
            }
        }
    });

    //load
    grunt.loadNpmTasks('grunt-contrib-watch');

    //task
    grunt.registerTask('default', ['watch']);
};
