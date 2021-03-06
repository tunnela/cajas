module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			options: {
				compress: {}
			},
			in_view: {
				files: {
					'cajas.min.js': ['cajas.js']
				}
			}
		},
		watch: {
			uglify: {
				files: ['cajas.js', 'Gruntfile.js'],
				tasks: ['uglify']
			}
		},
		release: {
		}
	});

	grunt.loadNpmTasks('grunt-release');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('publish', ['release']);
};