module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                footer:'\n/*! 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            test: {
                files: {
                    './output/uglify.min.js': ['a.js', './b.js']
                }
            }
        },
        requirejs: {

    		compilea: {
				options: {
					name: "a",
					mainConfigFile: "./requirejs.config.js",
					out: "./output/require.a.js",

					// a依赖b，b依赖c时
					
					// a只指定依赖b时 			(define("a", ["b], function(){})
					// 		exclude: b 		会去除b与c
					
					// a指定依赖b，c			(define("a", ["c", "b"], function(){})
					// 		exclude: b 		会去除b，保留c
					//		exclude: b,c 	会去除b,c

					// 默认会加入b模块，因为配置文件中配置了，会自动加入
					exclude: ["b"] 
				}
			},
			compileb: {
				options: {
					name: "b",
					mainConfigFile: "./requirejs.config.js",
					out: "./output/require.b.js",
					include: ["a"]
				}
			}

		}
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // 默认任务
    grunt.registerTask('default', ['uglify:test', 'requirejs:compilea', 'requirejs:compileb']);
    grunt.registerTask('uglify-test', ['uglify:test']);
    grunt.registerTask('require-test', ['requirejs:compilea', 'requirejs:compileb']);
}