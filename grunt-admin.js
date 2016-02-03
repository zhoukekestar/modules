/*
grunt --gruntfile grunt-admin.js

 */

module.exports = function(grunt){

  // Your Project's directory.
  var

    copyto = 'D:\\svn\\admin.toomao.com\\public\\',
    modulesConfig = {
      // NO AMD RULES
      swiper        : true,

      // AMD

      citySelect    : true,

      datetime      : true,
      formJSON      : true,
      formValidator : true,
      formOnInvalid : true,

      imageView     : true,

      paging        : true,

      tabs          : true,
      template      : true,
      toast         : true,

      ajaxUpload    : true,
      "ajaxUpload-single" : true
    },

    // javascript
    modulesJS = ['EventPath', 'logForBrowser', 'XMLHttpRequest'],
    uglifyJSTask = [],
    jsBase = './src/',
    externJS = [jsBase + '_fixMobile/EventPath.js', jsBase + 'baseUtils/logForBrowser.js', jsBase + '_fixDesktop/XMLHttpRequest.js'],
    requireJSTask = {},
    requireJSConfig = grunt.file.read('./requirejs.config.js', {encoding: 'utf8'}),

    // stylesheet
    modulesCSS = [],
    cssBase = './src/',
    cssConfig = grunt.file.readJSON('css.config.json'),
    externCSS = [
      cssBase + 'CSS-Controls/switch/switch.css',
      cssBase + 'baseCSS/base.css'
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
        externCSS.push(cssBase + cssConfig[name]);
        modulesCSS.push(name);
      }
  }

  // 项目配置
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      usebanner: {
        js: {
          options: {
            position: 'bottom',
            banner: '/*!\n' +
                      ' * web-moduels v<%= pkg.version %>\n' +
                      ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                      ' * Licensed under <%= pkg.license %>\n' +
                      ' * Include ' + modulesJS.toString() + ' \n' +
                      ' * Update on <%= grunt.template.today("yyyy-mm-dd HH:MM;ss") %> \n' +
                      ' */\n'
          },
          files: {
            src: [ './dist/modules.js' ]
          }
        },
        css: {
          options: {
            position: 'bottom',
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
        jsmin: {
          src: "./dist/modules.min.js",
          dest: copyto + "/js/modules.min.js"
        },
        js: {
          src: "./dist/modules.js",
          dest: copyto + "/js/modules.js"
        },
        map: {
          src: "./dist/modules.min.map",
          dest: copyto + "/js/modules.min.map"
        },
        css: {
          src: "./dist/modules.min.css",
          dest: copyto + "/css/modules.min.css"
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
                  "./dist/modules.min.js": './dist/modules.js'
              }
          }
      },

      concat: {
        release: {
          files: {
            "./dist/modules.js": externJS.concat(uglifyJSTask)
          }
        },
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
                  "dist/modules.min.css": externCSS
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
  grunt.registerTask('default', ['less', 'requirejs', 'concat:release', 'uglify', 'usebanner', 'clean', 'cssmin', 'copy']);
  // grunt.registerTask('default', ['less', 'requirejs', 'concat:debug', 'usebanner', 'clean', 'cssmin', 'copy']);
};
