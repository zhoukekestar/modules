module.exports = function(grunt){

    // TODO config requirejs.config.js

    // Your Project's directory.
    var
      copyto = 'G:\\svn\\m.toomao.com\\public\\js\\',
      modulesConfig = {
        // NO AMD RULES
        swiper        : true,
        gaodeMap      : false,
        jqueryCookie  : false,
        jqueryLazyload: false,
        jweixin       : true,

        // AMD
        alert         : false,
        alertMsg      : true,

        baseUtils     : true,

        citySelect    : true,
        confirm       : false,

        formJSON      : true,
        formValidator : true,
        formSubmit    : false,

        loadpage      : true,
        loadingPage   : true,

        paging        : true,
        popup         : false,
        preview       : true,
        prompt        : false,
        pullDown      : false,
        pullUp        : false,

        shareWX       : false,

        tabs          : true,
        template      : true,

        ajaxUpload    : true
      },

      // javascript
      modulesJS = [],
      uglifyJSTask = [],
      requireJSTask = {},
      requireJSConfig = grunt.file.read('./requirejs.config.js', {encoding: 'utf8'}),

      // stylesheet
      modulesCSS = [],
      cssBase = './src/',
      cssConfig = grunt.file.readJSON('css.config.json'),
      cssTaskList = [];


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
                        ' * Include ' + modulesCSS.toString() + ' \n' +
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
            dest: copyto + "modules.min.js"
          },
          map: {
            src: "./dist/modules.min.map",
            dest: copyto + "modules.min.map"
          }
        },


        // javascript
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: './dist/modules.min.map'
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
              "./dist/modules.min.js": uglifyJSTask
            }
          }
        },

        requirejs: requireJSTask,

        clean: uglifyJSTask,

        // stylesheet
        //
        //
        // less: {
        //     compileCore: {
        //         src: "bootstrap-core.less",
        //         dest: nameList[0]
        //     }
        // },

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
    grunt.registerTask('release', ['requirejs', 'uglify', 'clean', 'cssmin', 'usebanner']);
    grunt.registerTask('default', ['requirejs', 'concat', 'clean', 'cssmin', 'usebanner']);
};
