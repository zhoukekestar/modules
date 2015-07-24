module.exports = function(grunt){

    // TODO config requirejs.config.js

    var copyto = 'G:\\svn\\www.toomao.com\\public\\js\\modules.min.js';
    var nameList = [
        "alertMsg",                     // 1
        "formValidator",                // 2
        "formSubmit",                   // 3
        "baseUtils",                    // 4
        "pullDown",                     // 5
        "pullUp",                       // 6

        "swiper",                       // 7
        //"gaodeMap",                     // 8
        "jqueryCookie",                 // 9
        "jqueryLazyload",               // 10

        "jweixin",                      // 11
        "shareWX",                      // 12
        //"jqueryMobile",                 // 13
        "citySelect",                   // 14
        'popup',                        // 15
        'tabs',                         // 16
        'loadpage',                     // 17
        'loadingPage',                  // 18
        'formJSON',                     // 19
        'template',                     // 20
        'ajaxUpload',                   // 21
        'preview',                      // 22
        'paging',                       // 23
    ];
    var excludeList = [
        ["jquery"],                     // alertMsg             1
        ["jquery", "alertMsg"],         // formValidator        2
        ["formValidator"],              // formSubmit           3
        ["jquery"],                     // baseUtils            4
        ["jquery"],                     // pullDown             5
        ["jquery"],                     // pullUp               6

        [],                             // swiper               7
        //[],                             // gaodeMap             8
        ["jquery"],                     // jqueryCookie         9
        ["jquery"],                     // jqueryLazyload       10

        [],                             // jweixin              11
        ["jquery", "jweixin"],          // shareWX              12
        //["jquery"],                     // JqueryMobile         13
        ["jquery"],                     // citySelect           14
        ["popup"],                      // popup                15
        ["tabs"],                       // tabs                 16
        ['jquery', 'alertMsg', 'loadingPage'], // loadpage             17
        [],                             // loadingPage          18
        ['jquery'],                     // formJSON             19
        ['jquery'],                     // template             20
        ['jquery'],                     // ajaxUpload           21
        ['jquery'],                     // preview              22
        ['jquery'],                     // paging               23
    ];

    var uglifyList = new Array();
    var requireTask = {};


    for (var i = 0, len = nameList.length; i < len; i++) {

        // after requirejs handler's file name
        uglifyList[i] = "./output/" + nameList[i] + ".min.js";

        var t =  {
                options: {
                    name: nameList[i],
                    mainConfigFile: "./requirejs.config.js",
                    "out": uglifyList[i],
                    exclude: excludeList[i],
                    optimize: "none"
                }
        };

        // require task list
        requireTask["compile-" + nameList[i]] = t;

    }

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
               banner: '/*!\n' +
                        ' * web-moduels v<%= pkg.version %>\n' +
                        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                        ' * Licensed under <%= pkg.license %>\n' +
                        ' * Include ' + nameList.toString() + ' \n' +
                        ' * Update on <%= grunt.template.today("yyyy-mm-dd HH:MM;ss") %> \n' +
                        ' */\n',
                footer: "\n/*! @zkk */"
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
          jscript: {
            src: "./output/modules.min.js",
            dest: copyto
          }
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // 默认任务
    grunt.registerTask('release', ['requirejs', 'uglify', 'copy']);
    grunt.registerTask('default', ['requirejs', 'concat', 'copy']);
    grunt.registerTask('all', ['uglify']);
    grunt.registerTask('js', ['requirejs']);
};
