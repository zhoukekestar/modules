module.exports = function(grunt){

	var nameList = ["alertMsg", 
	                "formValidator", 
	                "formSubmit"];
	var excludeList = [
	                   ["jquery"], 
	                   ["jquery", "alertMsg"], 
	                   ["formValidator"]
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