module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-svginjector');

	var DIR_BOWER  = './bower_components/',
			DIR_CSS    = 'assets/css/',
			DIR_JS     = 'assets/js/',
			DIR_IMG    = 'assets/img/'

	grunt.initConfig({
		bower: grunt.file.readJSON('bower.json'),
		'exec': {
			serve: 'python -m SimpleHTTPServer'
		},
		'sass': {
			dist: {
				files: {
					'assets/css/sq2.css': DIR_BOWER + 'sassquatch2/sass/sassquatch.scss',
					'assets/css/shim.css': 'assets/scss/shim.scss',
					'assets/css/alienHome.css': 'assets/scss/alienHome.scss',
				}
			}
		},

		'uglify': {

			options: {
				sourceMap: true
			},

			separated_js: {
				files: {
					'assets/js/dist/depends.min.js': [
						DIR_BOWER + 'ractive/ractive.js',
						DIR_BOWER + 'ractive-load/dist/ractive-load.js',
						DIR_BOWER + 'rlite/rlite.js',
						DIR_BOWER + 'moment/moment.js',
						DIR_BOWER + 'jquery-waypoints/waypoints.min.js',
						DIR_JS + '/gimme_legacy/gimme.js',
						DIR_BOWER + 'jquery.cookie/jquery.cookie.js',
						DIR_BOWER + 'jquery-autosize/dist/autosize.js',
						DIR_JS + 'src/foundation/*.js'
					],
					'assets/js/dist/scripts.min.js': [
						DIR_JS + 'src/*.js',
						DIR_JS + 'src/globalTopic_interaction.js'
					],
				}
			}

		},

		'clean': {
			css: [DIR_CSS],
			js: DIR_JS + 'dist/'
		},

		'svgstore': {
			icons: {
				files: {
					'assets/icons/iconsprite.svg': ['assets/icons/svg/*.svg']
				},
				options: {

					/*
					prefix all icons with an unambiguous label
					*/
					prefix: 'icon-',

					/*
					cleans fill, stroke, stroke-width attributes
					so that we can style them from CSS
					*/
					cleanup: true,

					/*
					write a custom function to strip the first part
					of the file that Adobe Illustrator generates
					when exporting the artboards to SVG
					*/
					convertNameToId: function(name) {
					return name.replace(/^\w+\_/, '');
					}
				}
			}
		},

		'svginjector': {
			icons: {
				files: {
					'assets/icons/icons.js': ['assets/icons/iconsprite.svg']
				},
				options: {
					container: 'icon-container'
				}
			}
		},

		'watch': {

			html: {
				files: ['./**/*.html'],
				options: {
					livereload: true,
					spawn: false,
				}
			},

			scripts: {
				files: [DIR_JS + 'src/*.js'],
				tasks: ['uglify'],
				options: {
					livereload: true,
					spawn: false,
				}
			},

			css: {
				files: ['assets/scss/*.scss'],
				tasks: ['sass'],
				options: {
					livereload: true,
					spawn: false,
				}
			}

		}
	});
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('icons', ['svgstore:icons', 'svginjector:icons']);
	grunt.registerTask('build', ['clean', 'uglify', 'sass']);
	grunt.registerTask('serve', ['build', 'exec']);
};
