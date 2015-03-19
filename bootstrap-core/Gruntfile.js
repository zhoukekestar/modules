/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';
    debugger;
   // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
	less: {
	  compileCore: {
		src: "less/bootstrap.less",
		dest: "dist/<%= pkg.name %>.css"
	  }
	},
	cssmin: {
		options: {
			// TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
			//    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
			compatibility: 'ie8',
			keepSpecialComments: '*',
			advanced: false
		},
		minifyCore: {
			src: 'dist/<%= pkg.name %>.css',
			dest: 'dist/<%= pkg.name %>.min.css'
		}
	},
  });
  
  console.log("hi");
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');

    console.log("end");
  grunt.registerTask('default', ['less:compileCore', "cssmin:minifyCore"]);
};
