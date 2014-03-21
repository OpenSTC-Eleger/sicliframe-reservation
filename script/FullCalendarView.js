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
	'fullCalendar'

], function() {

	'use strict';


	var FullCalendarView = function(params) {


		// Retrieve params //
		this.calendar = params.el;
		this.lang     = params.lang;


		/** View Render
		*/
		this.render = function() {
			var self = this;


			this.calendar.fullCalendar({

				/** Full calendar attributes **/
				defaultView   : 'agendaWeek',
				ignoreTimezone: false,
				aspectRatio   : 2,
				header: {
					left  : 'title',
					center: '',
					right : 'agendaWeek,agendaDay, today,prev,next'
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
				allDaySlot         : false,
				slotMinutes        : 30,
				firstHour          : 9,
				dragOpacity        : 0.5,
				weekends           : true,
				selectable         : true,
				selectHelper       : true,


				/** Calculates events to display on calendar for officer (or team) on week selected
				*/
				/*events: function(start, end, callback) {
					var fetchParams={
						silent : true,
						data   : {}
					};

					var domain = [
						{ 'field' : 'date_start', 'operator' : '>', 'value' : moment(start).format('YYYY-MM-DD HH:mm:ss') },
						{ 'field' : 'date_end', 'operator' : '<', 'value' : moment(end).format('YYYY-MM-DD HH:mm:ss')  },
					];

					if(self.teamMode){
						var users = app.current_user.getOfficerIdsByTeamId(self.model.id);
						if( users.length > 0 ){
							domain.push('|', { 'field' : 'team_id.id', 'operator' : '=', 'value' : self.model.id }, { 'field' : 'user_id.id', 'operator' : 'in', 'value' : users  } );
						}
						else{
							domain.push({ 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id });
						}
					}
					else{
						var teams = app.current_user.getTeamIdsByOfficerId(self.model.id);
						if( teams.length>0 ){
							domain.push('|', { 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id }, { 'field' : 'team_id.id', 'operator' : 'in', 'value' : teams  });
						}
						else{
							domain.push({ 'field' : 'user_id.id', 'operator' : '=', 'value' : self.model.id });
						}
					}

					fetchParams.data.filters = app.objectifyFilters(domain);
					self.collection = new TasksCollection();

					//Get tasks for domain
					self.collection.fetch(fetchParams).done(function(){
						//Transforms tasks in events for fullcalendar
						self.events = self.fetchEvents();
						self.collection.off();
						self.listenTo(self.collection, 'add', self.refreshEvents);
						self.listenTo(self.collection, 'change', self.refreshEvents);
						self.listenTo(self.collection, 'remove', self.refreshEvents);

						self.initPrintView();
						//Display events on calendar
						callback(self.events);
					});
				}*/

            });
		};


	};

	return FullCalendarView;
});