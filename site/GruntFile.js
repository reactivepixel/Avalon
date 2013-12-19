// GruntFile

module.exports = function (grunt) {
	
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-html2js");
    grunt.loadNpmTasks("grunt-contrib-sass");
	
	grunt.registerTask("build", ["clean", "html2js", "concat", "sass"]);
	
	grunt.initConfig({
		html2js: {
			app: {
				src: ["src/**/*.tpl.html"],
				dest: "src/build/templates/templates.js",
				options: {
					module: "html-templates",
					rename: function (moduleName) {
						return moduleName.replace("app/", "");
					}
				}
			}
		},
		uglify: {
			dist: {
				src: ["src/build/avalon-app.js"],
				dest: "/var/www/avalon-app-min.js"
			}
		},
		concat: {
			dist: {
				src: ["src/**/*.js"],
				dest: "/var/www/avalon-app.js"
			},
			index: {
				src: ["src/app/main/index.html"],
				dest: "/var/www/index.html"
			},
			angular: {
				src: ["vendor/angular/angular.min.js"],
				dest: "/var/www/vendor/angular.js"
			},
			angularRoute: {
				src: ["vendor/angular/angular-route.min.js"],
				dest: "/var/www/vendor/angular-route.js"
			},
            angularSanitize: {
                src: ["vendor/angular/angular-sanitize.min.js"],
                dest: "/var/www/vendor/angular-sanitize.js"
            },
			angularFire: {
				src: ["vendor/angular/angularfire.min.js"],
				dest: "/var/www/vendor/angular-fire.js"
			}
		},
        clean: ["/var/www/*", "src/build/*"],
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "src/style",
                    src: ["main.scss"],
                    dest: "/var/www/css",
                    ext: ".css"
                }]
            }
        }
	});
	
};

//grunt.initConfig({
//  sass: {
//    dist: {
//      files: [{
//        expand: true,
//        cwd: 'styles',
//        src: ['*.scss'],
//        dest: '../public',
//        ext: '.css'
//      }]
//    }
//  }
//});



