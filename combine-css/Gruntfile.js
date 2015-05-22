/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
    'use strict';
    var base = "../web-modules/";
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
    var finalName = "dist/web-modules.min.css";
    var copyto = 'G:\\svn\\toomao\\branches\\v2.0.0\\toomao-web\\toomao-mobile\\public\\css\\web-modules.min.css';
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
                    "dist/web-modules.min.css": nameList
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
                    src: [ "dist/web-modules.min.css"]
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
