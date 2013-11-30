module.exports = function (grunt) {
	
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask('min', 'uglify');
	
	grunt.initConfig({
		uglify: {
			dist: {
				src: ["src/*.js"],
				dest: "dist/avalon.min.js"
			}
		}
	});
	
};