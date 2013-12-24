/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		/* #############
		* Libs
		*/
		'text'               : '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min',

		'jquery'             : '//code.jquery.com/jquery-2.0.3.min',
		'bootstrap'          : '//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min',
		'underscore'         : '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
		'underscore.string'  : '//cdnjs.cloudflare.com/ajax/libs/underscore.string/2.3.3/underscore.string.min',
		'moment'             : '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/moment.min',
		'jquery.maskedinput' : '//cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.3.1/jquery.maskedinput.min',
		
		'select2'            : '//cdnjs.cloudflare.com/ajax/libs/select2/3.4.4/select2.min',
		'select2-lang'       : '//cdnjs.cloudflare.com/ajax/libs/select2/3.4.4/select2_locale_fr.min',
		'datepicker'         : '//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.2.0/js/bootstrap-datepicker.min',
		'datepicker-lang'    : '//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.2.0/js/locales/bootstrap-datepicker.fr.min',
		'timepicker'         : 'libs/timepicker-0.2.6',


		'app'                : 'app',
		'main'               : 'main',
		'helper'             : 'helper',
		'advanceSelectBox'   : 'advanceSelectBox',


		/* ########
		* Templates
		*/
		'form-new-resa'      : '../templates/form-new-resa.html'
	},

	shim: {
		'underscore': {
			exports: '_'
		},
		'bootstrap': {
			deps   : ['jquery']
		},
		'select2': {
			deps   : ['jquery'],
			exports: 'select2'
		},
		'select2-lang': {
			deps   : ['select2'],
			exports: 'select2'
		},
		'datepicker': {
			deps   : ['jquery'],
		},
		'datepicker-lang' : {
			deps   : ['datepicker'],
			exports: 'datepicker'
		},
		'timepicker' : {
			deps   : ['jquery'],
			exports: 'timepicker'
		},
		'jquery.maskedinput' : {
			deps   : ['jquery']
		}
	}

});



/******************************************
* Start The App
*/
require([
	'main',
], function(main){

	main.init();
});