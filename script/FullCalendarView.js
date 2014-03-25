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
	'fullCalendar', 'moment', 'helper'

], function(fullCalendar, moment, Helper) {

	'use strict';


	var FullCalendarView = function(params) {

		this.bookings_url = '/api/openresa/bookings';


		// Retrieve params //
		this.calendar         = params.el;
		this.lang             = params.lang;
		this.bookings_url     = params.urlBookings;
		this.selectedResource = '';


		/** View Render
		*/
		this.render = function() {
			var self = this;


			this.calendar.fullCalendar({

				/** Full calendar attributes **/
				defaultView   : 'agendaWeek',
				ignoreTimezone: false,
				aspectRatio   : 2.1,
				header: {
					left  : 'title',
					center: '',
					right : 'agendaWeek,agendaDay today,prev,next'
				},
				// time formats
				titleFormat: {
					month: 'MMMM yyyy',
					week :  '\'Semaine \'W\' <small class="hidden-xs">du\' dd [MMM] [yyyy] {\'au\' dd MMM yyyy}</small>',
					day  : 'dddd dd MMM yyyy'
				},
				columnFormat: {
					month: 'ddd',
					week : 'ddd dd/M',
					day  : 'dddd dd/M'
				},
				firstDay  : 1,
				axisFormat: 'HH:mm',
				timeFormat: 'H(:mm){ - H(:mm)}',

				monthNames     : self.lang.monthNames,
				monthNamesShort: self.lang.monthNamesShort,
				dayNames       : self.lang.dayNames,
				dayNamesShort  : self.lang.dayNamesShort,
				buttonText: {
					today: self.lang.today,
					month: self.lang.month,
					week : self.lang.week,
					day  : self.lang.day
				},
				allDaySlot     : false,
				slotMinutes    : 30,
				firstHour      : 9,
				dragOpacity    : 0.5,
				weekends       : true,
				selectable     : true,
				selectHelper   : true,


				/** Calculates events to display on calendar for officer (or team) on week selected
				*/
				events: function(start, end, callback) {

					self.fetchReservations(start, end).done(function(data) {
						callback(self.jsonToEvents(data));
					});
				}

            });
		};



		/** Fetch the reservations
		*/
		this.fetchReservations = function(start, end) {

			var startDate = moment.utc(moment(start)).format('YYYY-MM-DD HH:mm:ss');
			var endDate = moment.utc(moment(end)).format('YYYY-MM-DD HH:mm:ss');

			// Create Fetch params //
			var params = {
				fields : ['name', 'checkin', 'checkout', 'note', 'whole_day'],
			};

			var filters = [
				'|',
				'|',
				'&',
				{ 'field' : 'checkin', 'operator' : '>=', 'value' : startDate },
				{ 'field' : 'checkin', 'operator' : '<=', 'value' : endDate },
				'&',
				{ 'field' : 'checkout', 'operator' : '>=', 'value' : startDate },
				{ 'field' : 'checkout', 'operator' : '<=', 'value' : endDate },
				'&',
				{ 'field' : 'checkin', 'operator' : '<', 'value' : startDate },
				{ 'field' : 'checkout','operator' : '>', 'value' : endDate },
				{ 'field' : 'reservation_line.reserve_product.id', 'operator' : 'in', 'value' : [this.selectedResource]},
				{ 'field' : 'state', 'operator' : 'in', 'value' : ['confirm', 'done']}
			];

			params.filters = Helper.objectifyFilters(filters);


			return $.ajax({
				url     : this.bookings_url,
				method  : 'GET',
				dataType: 'json',
				data    : params
			});

		};



		/** Refetch the events
		*/
		this.fetchEvents = function() {
			if (this.selectedResource !== ''){
				this.calendar.fullCalendar('refetchEvents');
			}
			else {
				this.calendar.fullCalendar('removeEvents');
			}

		};



		/** Set the selected ressouce to the fullcalendar
		*/
		this.setSelectedResource = function(res) {
			this.selectedResource = res;
		};



		/** Convert a Array events for FullCalendar
		*/
		this.jsonToEvents = function(jsonEvents) {

			var events = [];

			_.each(jsonEvents, function(booking) {

				var evt = {
					id     : booking.id,
					title  : '',
					allDay : booking.whole_day,
					start  : moment(booking.checkin).format('YYYY-MM-DD HH:mm'),
					end    : moment(booking.checkout).format('YYYY-MM-DD HH:mm'),
					color  : '#d9534f',
				};

				events.push(evt);
			});

			return events;
		};


	};

	return FullCalendarView;
});