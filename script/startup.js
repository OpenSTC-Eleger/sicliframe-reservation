/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		/* #############
		* Libs
		*/
		'text'               : ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min', 'libs/require-text.2.0.10.min'],

		'jquery'             : ['//code.jquery.com/jquery-2.1.0.min', 'libs/jquery-2.1.0.min'],
		'bootstrap'          : ['//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min', 'libs/bootstrap.3.1.1.min'],
		'underscore'         : ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min', 'libs/underscore.1.6.0.min'],
		'underscore.string'  : ['//cdnjs.cloudflare.com/ajax/libs/underscore.string/2.3.3/underscore.string.min', 'libs/underscore.string.2.3.3.min'],
		'moment'             : ['//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.0/moment-with-langs.min', 'libs/moment.2.5.0.min'],
		'jquery.maskedinput' : ['//cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.3.1/jquery.maskedinput.min', 'libs/jquery.maskedinput.1.3.1.min'],

		'select2'            : ['//cdnjs.cloudflare.com/ajax/libs/select2/3.4.4/select2.min', 'libs/select2.3.4.5.min'],
		'select2-lang'       : ['//cdnjs.cloudflare.com/ajax/libs/select2/3.4.5/select2_locale_fr.min', 'libs/select2.3.4.5.locale.fr.min'],
		'datepicker'         : ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/bootstrap-datepicker.min', 'libs/bootstrap-datepicker.1.3.0.min'],
		'datepicker-lang'    : ['//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/locales/bootstrap-datepicker.fr.min', 'libs/bootstrap-datepicker.1.3.0.locale.fr.min'],
		'timepicker'         : 'libs/timepicker-0.2.6',


		/* ########
		* JS
		*/
		'app'                : 'app',
		'main'               : 'main',
		'helper'             : 'Helper',
		'advanceSelectBox'   : 'AdvanceSelectBox',
		'bookingsModel'      : 'BookingsModel',


		/* ########
		* Templates
		*/
		'form-new-resa'      : '../templates/form-new-resa.html',
		'booking-summary'    : '../templates/booking-summary.html'
	},

	shim: {
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


require([
	'main',
], function(main) {

	'use strict';

	main.init();
});