/*
  grunt --gruntfile grunt-mobile.js

*/
module.exports = function(grunt){

    // Your Project's directory.
    var

      copyto = 'D:\\svn\\m.toomao.com\\public\\',
      // copyto = 'G:\\svn\\m.toomao.com\\public\\',
      modulesConfig = {
        // NO AMD RULES
        swiper        : true,
        gaodeMap      : false,
        jqueryCookie  : false,
        jqueryLazyload: false,
        jweixin       : true,

        // AMD
        alert         : false,

        baseUtils     : false,

        citySelect    : true,
        confirm       : false,

        formJSON      : true,
        formValidator : true,
        formOnInvalid : true,

        imageView     : true,

        lazyload      : true,
        loadpage      : true,
        loadingPage   : true,

        menu          : false,

        paging        : true,
        popup         : false,
        preview       : false,
        prompt        : false,
        pullDown      : false,
        pullUp        : false,

        shareWX       : true,

        tabs          : true,
        template      : true,
        toast         : true,

        ajaxUpload    : true
      },

      // javascript
      modulesJS = ['HTMLElement', 'XMLHttpRequest', 'CustomEvent', 'EventPath', 'logForBrowser'],
      jsBase = './src/',
      externJS = [jsBase + '_fixMobile/HTMLElement.js', jsBase + '_fixMobile/XMLHttpRequest.js', jsBase + '_fixMobile/CustomEvent.js', jsBase + '_fixMobile/EventPath.js', jsBase + 'baseUtils/logForBrowser.js'],
      uglifyJSTask = [],
      requireJSTask = {},
      requireJSConfig = grunt.file.read('./requirejs.config.js', {encoding: 'utf8'}),

      // stylesheet
      modulesCSS = [],
      cssBase = './src/',
      cssConfig = grunt.file.readJSON('css.config.json'),
      cssTaskList = [
        cssBase + 'baseCSS/base.css',
        cssBase + 'CSS-Controls/radio/ui-radio.css'
      ];


    // Read requestjs's config and parse it.
    requireJSConfig = requireJSConfig.substring(requireJSConfig.indexOf('{'), requireJSConfig.lastIndexOf('}') + 1);
    requireJSConfig = eval('(' + requireJSConfig + ')');



    // Build js & css task
    for (var name in modulesConfig) {

        // javascript
        var outputName,
            temp;

        if (modulesConfig[name]) {

          modulesJS.push(name);
          outputName = "./dist/" + name + ".min.js";

          uglifyJSTask.push(outputName);

          temp = {
            options: {
              name: name,
              mainConfigFile: "./requirejs.config.js",
              "out": outputName,
              exclude: requireJSConfig._exclude[name],
              optimize: "none"
            }
          };

          // require task list
          requireJSTask["compile-" + name] = temp;
        }


        // stylesheet
        if (modulesConfig[name] === true && cssConfig[name] !== null) {
          cssTaskList.push(cssBase + cssConfig[name]);
          modulesCSS.push(name);
        }
    }

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        usebanner: {
          js: {
            options: {
              position: 'top',
              banner: '/*!\n' +
                        ' * web-moduels v<%= pkg.version %>\n' +
                        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                        ' * Licensed under <%= pkg.license %>\n' +
                        ' * Include ' + modulesJS.toString() + ' \n' +
                        ' * Update on <%= grunt.template.today("yyyy-mm-dd HH:MM;ss") %> \n' +
                        ' */\n'
            },
            files: {
              src: [ './dist/modules.min.js' ]
            }
          },
          css: {
            options: {
              position: 'top',
              banner: '/*!\n' +
                        ' * web-moduels v<%= pkg.version %>\n' +
                        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                        ' * Licensed under <%= pkg.license %>\n' +
                        ' * Include base.css, CSS-Controls/radio, ' + modulesCSS.toString() + ' \n' +
                        ' * Update on <%= grunt.template.today("yyyy-mm-dd HH:MM;ss") %> \n' +
                        ' */\n'
            },
            files: {
              src: [ './dist/modules.min.css' ]
            }
          }
        },

        copy: {
          js: {
            src: "./dist/modules.min.js",
            dest: copyto + "/js/modules.min.js"
          },
          // map: {
          //   src: "./dist/modules.min.map",
          //   dest: copyto + "/js/modules.min.map"
          // },
          css: {
            src: "./dist/modules.min.css",
            dest: copyto + "/css/modules.min.css"
          }
        },


        // javascript
        uglify: {
            options: {
                // sourceMap: true,
                // sourceMapName: './dist/modules.min.map'
            },
            release: {
                files: {
                    "./dist/modules.min.js": uglifyJSTask
                }
            }
        },

        concat: {
          debug: {
            files: {
              "./dist/modules.min.js": externJS.concat(uglifyJSTask)
            }
          }
        },

        requirejs: requireJSTask,

        clean: uglifyJSTask,

        // bootstrap-core task
        less: {
            compileCore: {
                src: "./src/baseCSS/bootstrap/bootstrap-core.less",
                dest: './dist/bootstrap-core.css'
            }
        },

        cssmin: {
            minifyCore: {
                files:{
                    "dist/modules.min.css": cssTaskList
                }
            }
        }

    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // js
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // css
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');


    // 默认任务
    grunt.registerTask('release', ['less', 'requirejs', 'uglify', 'clean', 'cssmin', 'usebanner', 'copy']);
    grunt.registerTask('default', ['less', 'requirejs', 'concat', 'clean', 'cssmin', 'usebanner', 'copy']);
    // grunt.registerTask('default', ['less', 'requirejs', 'concat', 'clean', 'cssmin', 'usebanner', 'copy']);
};
