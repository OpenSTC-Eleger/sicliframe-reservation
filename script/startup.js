/*!
 * Sicliframe-resa
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		/* #############
		* Libs
		*/
		'text'               : 'libs/require-text.2.0.10.min',

		'jquery'             : 'libs/jquery-2.1.0.min',
		'bootstrap'          : 'libs/bootstrap.3.1.1.min',
		'underscore'         : 'libs/underscore.1.6.0.min',
		'underscore.string'  : 'libs/underscore.string.2.3.3.min',
		'moment'             : 'libs/moment.2.5.0.min',
		'jquery.maskedinput' : 'libs/jquery.maskedinput.1.3.1.min',

		'select2'            : 'libs/select2.3.4.6.min',
		'select2-lang'       : 'libs/select2.3.4.6.locale.fr.min',
		'datepicker'         : 'libs/bootstrap-datepicker.1.3.0.min',
		'datepicker-lang'    : 'libs/bootstrap-datepicker.1.3.0.locale.fr.min',
		'timepicker'         : 'libs/timepicker-0.2.6',
		'fullCalendar'       : 'libs/fullcalendar-1.6.4',


		/* ########
		* JS
		*/
		'app'                : 'app',
		'main'               : 'main',
		'helper'             : 'Helper',
		'advanceSelectBox'   : 'AdvanceSelectBox',
		'fullCalendarView'   : 'FullCalendarView',
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
		},
		'fullcalendar': {
			deps   : ['jquery'],
		}
	}

});


require([
	'main',
], function(main) {

	'use strict';

	main.init();
});