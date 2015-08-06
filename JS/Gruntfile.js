module.exports = function(grunt){

    // TODO config requirejs.config.js

    // Your Project's directory.
    var
      copyto = 'G:\\svn\\m.toomao.com\\public\\js\\',
      nameList = {
        // NO AMD RULES
        swiper        : true,
        gaodeMap      : false,
        jqueryCookie  : false,
        jqueryLazyload: false,
        jweixin       : true,

        // AMD
        alertMsg      : true,
        baseUtils     : true,

        pullDown      : false,
        pullUp        : false,
        formValidator : true,
        formSubmit    : false,
        shareWX       : false,
        citySelect    : true,
        popup         : false,
        tabs          : true,
        loadpage      : true,
        loadingPage   : true,
        formJSON      : true,
        template      : true,
        ajaxUpload    : true,
        preview       : true,
        paging        : true
      },
      nameListString = '',
      uglifyList = [],
      requireTask = {},
      requireConfig = grunt.file.read('./requirejs.config.js', {encoding: 'utf8'});

    // Read requestjs's config and parse it.
    requireConfig = requireConfig.substring(requireConfig.indexOf('{'), requireConfig.lastIndexOf('}') + 1);
    requireConfig = eval('(' + requireConfig + ')');

    for (var name in nameList) {

        var outputName,
            temp;

        if (nameList[name]) {

          nameListString += name +',';
          outputName = "./output/" + name + ".min.js";

          uglifyList.push(outputName);

          temp = {
            options: {
              name: name,
              mainConfigFile: "./requirejs.config.js",
              "out": outputName,
              exclude: requireConfig._exclude[name],
              optimize: "none"
            }
          };

          // require task list
          requireTask["compile-" + name] = temp;
        }

    }

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: './output/modules.min.map'
            },
            release: {
                files: {
                    "./output/modules.min.js": uglifyList
                }
            }
        },
        concat: {

          debug: {
            files: {
              "./output/modules.min.js": uglifyList
            }
          }
        },
        requirejs: requireTask,
        copy: {
          js: {
            src: "./output/modules.min.js",
            dest: copyto + "modules.min.js"
          },
          map: {
            src: "./output/modules.min.map",
            dest: copyto + "modules.min.map"
          }
        },
        clean: uglifyList,
        usebanner: {
          dist: {
            options: {
              position: 'top',
              banner: '/*!\n' +
                        ' * web-moduels v<%= pkg.version %>\n' +
                        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                        ' * Licensed under <%= pkg.license %>\n' +
                        ' * Include ' + nameListString + ' \n' +
                        ' * Update on <%= grunt.template.today("yyyy-mm-dd HH:MM;ss") %> \n' +
                        ' */\n'
            },
            files: {
              src: [ './output/modules.min.js' ]
            }
          }
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-banner');

    // 默认任务
    grunt.registerTask('release', ['requirejs', 'uglify', 'clean', 'usebanner', 'copy']);
    grunt.registerTask('default', ['requirejs', 'concat', 'clean', 'usebanner', 'copy']);
};
