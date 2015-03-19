module.exports = function(grunt){

	var nameList = [
        "alertMsg",                 // 1
	    "formValidator",            // 2
	    "formSubmit",               // 3
        "baseUtils",                // 4
        "pullDown",                 // 5
        "pullUp",                   // 6

        "swiper",                   // 7
        "gaodeMap",                 // 8
        "jqueryCookie",             // 9
        "jqueryLazyload",           // 10

        "jweixin",                  // 11
    ];
	var excludeList = [
        ["jquery"],                  //alertMsg             1
        ["jquery", "alertMsg"],     // formValidator        2
        ["formValidator"],          // formSubmit           3
        ["jquery"],                 // baseUtils            4
        ["jquery"],                 // pullDown             5
        ["jquery"],                 // pullUp               6

        [],                         // swiper               7
        [],                         // gaodeMap             8
        ["jquery"],                 // jqueryCookie         9
        ["jquery"],                 // jqueryLazyload       10

        [],                         // jweixin              11
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
					exclude: excludeList[i]
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
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                footer: "\n/*! include:" + nameList.toString() + "*/"
            },
            release: {
                files: {
                	"./output/all.min.js": uglifyList
                }
            }
        },
        requirejs: requireTask
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // 默认任务
    grunt.registerTask('default', ['requirejs', 'uglify']);
    grunt.registerTask('all', ['uglify']);
    grunt.registerTask('js', ['requirejs']);
}