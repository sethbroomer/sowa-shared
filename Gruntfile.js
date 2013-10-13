"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        cafemocha: {
            src: 'test/**/*.js',
            options: {
                ui: 'bdd'
            },
        },


        jshint: {
            files: ['gruntfile.js',  '**/*.js' ],
            options: {
                ignores: ['node_modules/**', '**/*.min.js', 'public/js/libs/**/*.js'],
                globalstrict: true,
                laxcomma : true,
                bitwise : false,
                curly : true,
                indent : 4,
                unused:true,
                immed : true,
                latedef : true,
                newcap : true,
                noempty : true,
                node : true    
            }
        }
    });



    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-cafe-mocha');
    grunt.registerTask('test', ['jshint', 'cafemocha']);
    grunt.registerTask('default', ['jshint','cafemocha']);
};
