module.exports = function (grunt) {
	
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-html2js");
	
	grunt.registerTask("build", ["clean", "html2js", "concat", "uglify"]);
	
	grunt.initConfig({
		html2js: {
			app: {
				src: ["src/**/*.tpl.html"],
				dest: "src/build/templates/app-tpl.js"
			}
		},
		uglify: {
			dist: {
				src: ["src/build/avalon-app.js"],
				dest: "dist/avalon-app-min.js"
			}
		},
		concat: {
			dist: {
				src: ["src/**/*.js"],
				dest: "src/build/avalon-app.js"
			},
			index: {
				src: ["src/index.html"],
				dest: "dist/index.html"
			},
			angular: {
				src: ["vendor/angular/angular.min.js"],
				dest: "dist/vendor/angular.js"
			}
		},
		clean: ["dist/*", "src/build/*"]
	});
	
};