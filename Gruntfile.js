module.exports = function(grunt) {

	'use strict';


	// Grunt configuration //
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		build_directory : 'dist',


		banner: '/*! \n' +
			'* <%= pkg.name %> - v<%= pkg.version %> - (<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
			'* <%= pkg.description %>\n' +
			'* <%= pkg.author %>\n' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
			'<%= pkg.author.name %>\n' +
			'*/',

		archiveName: '<%= pkg.name %>_v<%= pkg.version %>.tar.gz',


		// Clean the dist directory //
		clean: ['<%= build_directory %>', '*.tar.gz'],


		// Create the build directory //
		createdir: {
			dist: {
				dir : '<%= build_directory %>'
			}
		},


		// Check JSON File
		jsonlint: {
			dist: {
				src: ['properties.json', 'config/*.json', 'i18n/**/*.json']
			}
		},


		// Check JS Files //
		jshint: {
			options: {
				strict       : true,
				unused       : true,
				quotmark     : 'single',
				indent       : 4,
				freeze       : true,
				curly        : true,
				latedef      : true,
				maxcomplexity: 15
			},
			gruntfile: {
				src: ['Gruntfile.js']
			},
			jsonFile: {
				options: {
					quotmark: 'double'
				},
				src: ['config/*.json', 'i18n/**/*.json']
			},
			scripts: {
				src: ['script/*.js']
			}
		},


		// Check Style JS File
		jscs: {
			options: {
				'disallowKeywords'                        : ['with'],
				'requireLeftStickedOperators'             : [','],
				'disallowLeftStickedOperators'            : ['?', '+', '-', '/', '*', '=', '==', '===', '!=', '!==', '>', '>=', '<', '<='],
				'disallowRightStickedOperators'           : ['?', '/', '*', ':', '=', '==', '===', '!=', '!==', '>', '>=', '<', '<='],
				'disallowSpaceAfterPrefixUnaryOperators'  : ['++', '--', '+', '-', '~'],
				'disallowSpaceBeforePostfixUnaryOperators': ['++', '--'],
				'requireRightStickedOperators'            : ['!'],
				'requireSpaceAfterBinaryOperators'        : ['+', '-', '/', '*', '=', '==', '===', '!=', '!=='],
				'requireSpaceAfterKeywords'               : ['if', 'else', 'for', 'while', 'do', 'switch', 'return', 'try', 'catch'],
				'requireSpaceBeforeBinaryOperators'       : ['+', '-', '/', '*', '=', '==', '===', '!=', '!=='],
				'requireSpacesInFunctionExpression'       : { 'beforeOpeningCurlyBrace': true },
				'requireKeywordsOnNewLine'                : ['else'],
				'disallowSpacesInFunctionExpression'      : { 'beforeOpeningRoundBrace': true },
				'validateLineBreaks'                      : 'LF',
				'force': true
			},
			gruntfile: {
				src: ['Gruntfile.js']
			},
			scripts: {
				src: ['script/*.js']
			}
		},


		// Built the Js //
		requirejs: {
			dist: {
				options: {
					name: 'init',
					mainConfigFile: 'script/startup.js',
					out: '<%= build_directory %>/script/app.js',
					paths: {
						'text'               : 'libs/require-text.2.0.10.min',

						'jquery'             : 'libs/jquery-2.0.3.min',
						'bootstrap'          : 'libs/bootstrap.3.0.3.min',
						'underscore'         : 'libs/underscore.1.5.2.min',
						'underscore.string'  : 'libs/underscore.string.2.3.3.min',
						'moment'             : 'libs/moment.2.5.0.min',
						'jquery.maskedinput' : 'libs/jquery.maskedinput.1.3.1.min',

						'select2'            : 'libs/select2.3.4.5.min',
						'select2-lang'       : 'libs/select2.3.4.5.locale.fr.min',
						'datepicker'         : 'libs/bootstrap-datepicker.1.2.0.min',
						'datepicker-lang'    : 'libs/bootstrap-datepicker.1.2.0.locale.fr.min'
					},
					optimize: 'uglify2',
					preserveLicenseComments: false,
				}
			}
		},


		// Copy files and folders //
		copy: {
			dist: {
				files: [
					{ src: 'config/configuration.json.example', dest: '<%= build_directory %>/'},
					{ src: 'properties.json', dest: '<%= build_directory %>/'},
					{ src: 'i18n/**', dest: '<%= build_directory %>/'},
					{ src: 'script/libs/require.2.1.9.min.js', dest: '<%= build_directory %>/script/require.js' },
					{ src: 'fonts/**', dest: '<%= build_directory %>/' },
					{ src: 'img/**', dest: '<%= build_directory %>/' }
				]
			}
		},


		// Build the index.html //
		targethtml: {
			dist: {
				files: {
					'<%= build_directory %>/index.html': 'index.html'
				}
			}
		},


		// Build the CSS //
		cssmin: {
			options: {
				keepSpecialComments : 0
			},
			dist: {
				files: {
					'<%= build_directory %>/style/app.css': ['style/libs/*.css', 'style/app.css']
				}
			}
		},


		// Minify html file //
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
				},
				files: {
					'<%= build_directory %>/templates/booking-summary.html'  : 'templates/booking-summary.html',
					'<%= build_directory %>/templates/form-new-resa.html'    : 'templates/form-new-resa.html'
				}
			},
		},


		// Add banner to the files //
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [ '<%= build_directory %>/script/*.js', '<%= build_directory %>/style/*.css' ]
				}
			}
		},


		// Archive the dist //
		compress : {
			dist : {
				options : {
					mode   : 'tgz',
					level  : 9,
					archive: '<%= archiveName %>',
					pretty : true
				},
				files : [
					{ expand: true, src : '**/*', cwd : 'dist/' }
				]
			}
		}

	});


	// Task to create The Build Directory //
	grunt.registerMultiTask('createdir', 'Create the Build Directory', function() {

		var data = this.data;

		// Check if the dir path is specify //
		if (grunt.util.kindOf(data.dir) == 'undefined'){
			grunt.log.errorlns('Specify a directory');
		}
		else {
			// Check if the dir exist //
			if (grunt.file.exists(data.dir)){
				grunt.log.warn('The directory already exist, deleting...');
				grunt.file.delete(data.dir);
			}

			grunt.file.mkdir(data.dir);
			grunt.log.ok('Create build directory ' + data.dir.cyan);
		}

	});


	// Load Grunt Tasks //
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});



	// Tasks //
	grunt.registerTask('check', ['jsonlint', 'jshint', 'jscs']);
	grunt.registerTask('default', ['check', 'clean', 'createdir', 'requirejs', 'cssmin', 'htmlmin', 'targethtml', 'copy', 'usebanner', 'compress']);
};