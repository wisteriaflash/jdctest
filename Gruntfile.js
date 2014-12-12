/*
 * jQuery File Upload Gruntfile
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global module */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        watch: {
            livereload: {
                options: {
                  livereload: true
                },
                files: ['jdcsign/**/*']
            }
        }
    });

    //load
    grunt.loadNpmTasks('grunt-contrib-watch');

    //task
    grunt.registerTask('default', ['watch']);
};
