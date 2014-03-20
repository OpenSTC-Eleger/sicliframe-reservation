/*!
 * Sicliframe-resa
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

/******************************************
* FullCalendarView
*/
define([

	// Load our app module and pass it to our definition function
	'fullcalendar'

], function(fullcalendar) {

	'use strict';


	var FullCalendarView = function(params) {


		/** View Render
		*/
		this.render = function() {
			var self = this;


			$('#calendar').fullCalendar({
            })
		};


	};

	return FullCalendarView;
});