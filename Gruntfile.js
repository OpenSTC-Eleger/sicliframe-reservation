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
					{ src: 'script/libs/require.2.1.11.min.js', dest: '<%= build_directory %>/script/require.js' },
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


	/** Check if the version in package.json and properties.json are equal
	*   && if the package version are equal to the last git Tag
	*/
	grunt.registerTask('checkVersion', 'Check if the version in package.json and properties.json are equal', function() {

		// Require semver //
		var semver = require('semver');


		// Get the Semver version in the package file //
		var packageVersion = grunt.file.readJSON('package.json').version;

		// Get the Semver version in the properties file //
		var propertiesVersion = grunt.file.readJSON('properties.json').version;

		// Get the last Git Tag version //
		var shell = require('shelljs');
		var cmdOutput = shell.exec('git describe --tags `git rev-list --tags --max-count=1`', {'silent': true});

		if (cmdOutput.code !== 0){
			grunt.fail.fatal('Git software are require');
		}

		var lastTagVersion = cmdOutput.output.replace(/(\r\n|\n|\r)/gm, '');


		// Check if the last Git Tag is correct //
		if (!semver.valid(lastTagVersion)){
			grunt.fail.warn('Last Git tag Version is not correct');
			grunt.log.error(lastTagVersion);
		}

		// Check if the properties.json version is correct //
		if (!semver.valid(propertiesVersion)){
			grunt.fail.warn('Version in properties.json file is not correct');
			grunt.log.error(propertiesVersion);
		}

		// Check if the package.json version is correct //
		if (!semver.valid(packageVersion)){
			grunt.fail.warn('Version in package.json file is not correct');
			grunt.log.error(packageVersion);
		}



		// Check if the package.json version and properties.json version are equal //
		if (packageVersion !== propertiesVersion){
			grunt.fail.warn('Versions in properties.json and package.json are not equal');
			grunt.log.error(packageVersion + ' != ' + propertiesVersion);
		}


		if (semver.gt(lastTagVersion, packageVersion)){
			grunt.fail.warn('App version are lower than the last Git tag');
			grunt.log.error(packageVersion + ' != ' + lastTagVersion);
		}
		else if (semver.lt(lastTagVersion, packageVersion)){
			grunt.fail.warn('App version are greater than the last Git tag');
			grunt.log.error(packageVersion + ' != ' + lastTagVersion);
		}


		grunt.log.writeln('Check version done without error.'.green);
		grunt.log.ok('App version ' + propertiesVersion);

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
	grunt.registerTask('check', ['jsonlint', 'jshint', 'jscs', 'checkVersion']);
	grunt.registerTask('default', ['check', 'clean', 'createdir', 'requirejs', 'cssmin', 'htmlmin', 'targethtml', 'copy', 'usebanner', 'compress']);
};