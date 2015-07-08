/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
    'use strict';
    var base = "../src/";
    var nameList = ["dist/bootstrap-core.css",
                    base + "_lib/swiper/swiper.min.css",
                    base + "pull-v2/pull.css",
                    base + "baseCSS/base.css",
                    //base + "_lib/jquery-mobile/jquery.mobile.custom.structure.css",
                    base + "loadingPage/loadingPage.css",
                    base + "popup/popup.css",
                    base + "tabs/tabs.css",
                    base + 'loadpage/animate.css',
                    base + 'loadingPage/loadingPage.css',
                    base + 'loadpage/loadpage.css'
    ];
    var finalName = "dist/modules.min.css";
    var copyto = 'G:\\svn\\m.toomao.com\\public\\css\\modules.min.css';
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            ' * web-moduels v<%= pkg.version %>\n' +
            ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' * Include ' + nameList.toString() + ' \n' +
            ' * Update on <%= grunt.template.today("yyyy-mm-dd hh:MM;ss") %> \n' +
            ' */\n',
        footer: "\n/*! include:" + nameList.toString() + "*/",
        less: {
            compileCore: {
                src: "bootstrap-core.less",
                dest: nameList[0]
            }
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                footer: "\n/*! include:" + nameList.toString() + "*/"
            },
            minifyCore: {
                files:{
                    "dist/modules.min.css": nameList
                }
            }
        },
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [ "dist/src.min.css"]
                }
            }
        },
        copy: {
          css: {
            src: finalName,
            dest: copyto
          }
        }
    });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['less:compileCore', "cssmin:minifyCore", "usebanner:dist", "copy:css"]);
};
