/*!
 * Sicliframe-resa
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

/******************************************
* APPLICATION NAMESPACE
*/
define('app', [

	// Load our app module and pass it to our definition function
	'jquery', 'bootstrap', 'underscore', 'helper', 'bookingsModel', 'moment', 'datepicker-lang', 'timepicker', 'advanceSelectBox', 'jquery.maskedinput', 'fullCalendarView',
	'text!form-new-resa', 'text!booking-summary'

], function($, bs, _, Helper, BookingsModel, moment, datepicker, timepicker, AdvanceSelectBox, mask, FullCalendarView, formTemplate, bookingSummaryTemplate) {

	'use strict';


	var app =  {

		api_url_partner       : 'open_object/partners',
		api_url_bookables     : 'openresa/partners/<%= id %>/bookables',
		api_url_bookings      : 'openresa/bookings',
		api_url_booking_lines : 'openresa/booking_lines',

		configPath       : 'config/configuration.json',
		langPath         : 'i18n/fr/lang.json',
		propertiesPath   : 'properties.json',

		// Global Variable //
		config           : {},
		lang             : {},
		properties       : {},

		appContainer        : $('#container'),
		bookingSumContainer : '#bookingSummary',

		currentStep      : 0,
		maxStep          : 2,


		bookingsModel   : new BookingsModel(),
		bookingLines    : {},



		/** View Render
		*/
		formView: function() {
			var self = this;

			// Retrieve the template //
			var tmp = _.template(formTemplate, {
				lang       : app.lang,
				moment     : moment(),
				properties : app.properties
			});

			this.appContainer.html(tmp);


			app.selectListClaimerAssociation = new AdvanceSelectBox({selectbox: $('#claimerAssociation'), url: app.config.server_api_url + this.api_url_partner});
			app.selectListClaimerAssociation.render();



			// Filter on all the ASSO //
			var selectListClaimerAssociationParams = { field: 'type_id.code', operator: 'ilike', value: 'ASSO' };
			app.selectListClaimerAssociation.setSearchParam(selectListClaimerAssociationParams, true);


			app.selectListBookingPlace = new AdvanceSelectBox({selectbox: $('#bookingPlace'), url: app.config.server_api_url});
			app.selectListBookingPlace.render();
			var selectListBookingPlaceParams = { field : 'type_prod', operator : 'ilike', value : 'site' };
			app.selectListBookingPlace.setSearchParam(selectListBookingPlaceParams, true);


			$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr', todayHighlight: true });
			$('.timepicker').timepicker({defaultTime: false, showMeridian: false, showInputs: false, showWidgetOnAddonClick: false});

			$('#citizenPhone').mask('09 99 99 99 99');
			$('*[data-toggle="tooltip"]').tooltip({container : 'body'});
			$('#citizenZipCode').mask('44999');


			// Claimer type change //
			$('input[name="claimerType"]').change(function() {
				self.changeClaimerType();
			});


			// Start date change //
			$('#bookingStartDate').datepicker().on('changeDate', function() {
				var sDate = $('#bookingStartDate').datepicker('getDate');
				$('#bookingEndDate').datepicker('setStartDate', sDate);
				$('#bookingEndDate').datepicker('setDate', sDate);

				if (!_.isUndefined(app.fullCalendar)){
					app.fullCalendar.goTo(sDate);
					self.selectPeriodCalendar();
				}
			});

			// Start Hour change //
			$('#bookingStartHour').timepicker().on('changeTime.timepicker', function() {
				$('#bookingEndHour').timepicker('setTime', moment($('#bookingStartHour').val(), 'HH:mm').add('hours', 3).format('HH:00'));
				self.selectPeriodCalendar();
			});

			// End date change //
			$('#bookingEndDate').datepicker().on('changeDate', function() {
				self.selectPeriodCalendar();
			});

			// Start Hour change //
			$('#bookingEndHour').timepicker().on('changeTime.timepicker', function() {
				self.selectPeriodCalendar();
			});


			// Association change, update the places List //
			$('#claimerAssociation').on('change', function() {
				var url = _.template(app.api_url_bookables, {id: app.selectListClaimerAssociation.getSelectedItem()});
				app.selectListBookingPlace.url = app.config.server_api_url + url;
			});


			// Association change, update the places List //
			$('#bookingPlace').on('change', function() {
				app.bookingLines.name = app.selectListBookingPlace.getSelectedText();
				app.bookingLines.line_id = app.selectListBookingPlace.getSelectedItem();

				var placeID = app.selectListBookingPlace.getSelectedItem();


				// If fullCalendar view isn't define //
				if (_.isUndefined(app.fullCalendar)){
					app.fullCalendar = new FullCalendarView({ el: $('#calendar'), date: moment($('#bookingStartDate').datepicker('getDate')), lang: app.lang, urlBookings: app.config.server_api_url + app.api_url_bookings });
					app.fullCalendar.setSelectedResource(placeID);
					app.fullCalendar.render();
					self.selectPeriodCalendar();
				}
				else {
					// Refetch the booking //
					app.fullCalendar.setSelectedResource(placeID);
					app.fullCalendar.fetchEvents();
				}

			});



			// Disable tab navigation //
			$('li.disabled a').click(function(e) {
				e.preventDefault();
			});

			// Previous button is click //
			$('li.previous a').click(function() {
				self.previousStep();
			});


			// Next button is click //
			$('li.next a').click(function() {
				self.nextStep();
			});


			// Save the Booking //
			$('#form').submit(function(e) {
				e.preventDefault();
				self.submitForm();
			});


			// Set the focus to the first Input //
			$('#wizard li a').on('shown.bs.tab', function(e) {

				var id = $(e.target).attr('href');
				$(id + ' .form-group .form-control').first().focus();
			});

		},



		/** When the claimer type change
		*/
		changeClaimerType: function() {
			var self = this;

			// Reset the booking Select Place //
			app.selectListBookingPlace.reset();

			// Is Citizen //
			if ($('#isCitizen').prop('checked')){
				$('.isCitizen').stop().slideDown();
				$('.isAssociation').stop().slideUp();

				$('#citizenName').focus();

				// Retrieve the Id of the Citizen partner //
				this.getIdOfPartnerCitizen().done(function(data) {

					var url = _.template(app.api_url_bookables, {id: data[0].id});
					app.selectListBookingPlace.url = app.config.server_api_url + url;

					self.bookingsModel.setPartner(data[0].id);
				});

				this.bookingsModel.setCitizen(true);
			}
			else {
				$('.isCitizen').stop().slideUp();
				$('.isAssociation').stop().slideDown();

				this.bookingsModel.setCitizen(false);

				// Set the claimer Id to the place url //
				if (app.selectListClaimerAssociation.getSelectedItem() !== ''){
					var url = _.template(app.api_url_bookables, {id: app.selectListClaimerAssociation.getSelectedItem()});
					app.selectListBookingPlace.url = app.config.server_api_url + url;
				}
			}
		},



		/** Previous Step
		*/
		previousStep: function() {

			if (this.currentStep == this.maxStep){
				$('button[type="submit"]').addClass('hide');
			}


			this.currentStep--;

			if (this.currentStep >= 0){
				// Show the previous Tab //
				$('#wizard li:not(.sep):eq(' + this.currentStep + ') a').tab('show');

				$('li.next a').removeClass('hide');

				if (this.currentStep === 0){
					$('li.previous a').addClass('hide');
				}
			}
		},



		/** Next step
		*/
		nextStep: function() {

			// Check the form of the current step //
			if (this.checkStep(this.currentStep)){

				if (this.currentStep < this.maxStep){
					this.currentStep++;

					// Hide the next Button //
					if (this.currentStep == this.maxStep){
						$('li.next a').addClass('hide');
						$('button[type="submit"]').removeClass('hide');
					}
					// Display the previous button //
					else {
						$('li.previous a').removeClass('hide');
					}

					// Show the next Tab //
					$('#wizard li:not(.sep):eq(' + this.currentStep + ') a').tab('show');
				}
			}
		},



		/** Check the form of the step
		*/
		checkStep: function(step) {

			switch (step){
				case 0:
					if (this.checkStep0()){
						$('#step0 .form-group.has-error').removeClass('has-error');
						$('li[data-step="0"]').addClass('success');
						return true;
					}
					else {
						$('#step0 .form-group.has-error input').first().focus();
						app.appContainer.find('#bookingName').focus();
						return false;
					}
					break;
				case 1:
					if (this.checkStep1()){
						$('#step1 .form-group.has-error').removeClass('has-error');
						$('li[data-step="1"]').addClass('success');

						this.displaySummary();
						return true;
					}
					else {
						$('#step1 .form-group.has-error input').first().focus();
						return false;
					}
					break;
			}
		},



		/** Check step 0
		*/
		checkStep0: function() {
			var isCitizen      = $('#isCitizen').prop('checked');
			var citizenName    = $('#citizenName').val();
			var citizenMail    = $('#citizenMail').val();
			var citizenPhone   = $('#citizenPhone').val();
			var citizenAddress = $('#citizenAddress').val();
			var citizenZipCode = $('#citizenZipCode').val();
			var citizenCity    = $('#citizenCity').val();

			var returnStatement = true;

			if (isCitizen){
				if (_.isEmpty(citizenName)){
					$('#form-citizenName').addClass('has-error');
					returnStatement = false;
				}
				else {
					$('#form-citizenName').removeClass('has-error');
					this.bookingsModel.setCitizenName(citizenName);
				}

				if (_.isEmpty(citizenMail) || !Helper.checkMail(citizenMail)){
					$('#form-citizenMail').addClass('has-error');
					returnStatement = false;
				}
				else {
					$('#form-citizenMail').removeClass('has-error');
					this.bookingsModel.setCitizenMail(citizenMail);
				}

				if (_.isEmpty(citizenPhone)){
					$('#form-citizenPhone').addClass('has-error');
					returnStatement = false;
				}
				else {
					$('#form-citizenPhone').removeClass('has-error');
					this.bookingsModel.setCitizenPhone(citizenPhone);
				}

				if (_.isEmpty(citizenAddress)){
					$('#form-citizenAddress').addClass('has-error');
					returnStatement = false;
				}
				else {
					$('#form-citizenAddress').removeClass('has-error');
					this.bookingsModel.setCitizenAddress(citizenAddress);
				}

				if (_.isEmpty(citizenZipCode)){
					$('#form-citizenZipCode').addClass('has-error');
					returnStatement = false;
				}
				else {
					$('#form-citizenZipCode').removeClass('has-error');
					this.bookingsModel.setCitizenZipCode(citizenZipCode);
				}

				if (_.isEmpty(citizenCity)){
					$('#form-citizenCity').addClass('has-error');
					returnStatement = false;
				}
				else {
					$('#form-citizenCity').removeClass('has-error');
					this.bookingsModel.setCitizenCity(citizenCity);
				}
			}
			else {
				if (app.selectListClaimerAssociation.getSelectedItem() === ''){
					$('#form-claimerAssociation').addClass('has-error');
					returnStatement = false;
				}
				else {
					this.bookingsModel.setPartner(app.selectListClaimerAssociation.getSelectedItem());
					this.bookingsModel.setPartnerName(app.selectListClaimerAssociation.getSelectedText());
				}
			}

			return returnStatement;
		},



		/** Check step 1
		*/
		checkStep1: function() {
			var bookingName      = $('#bookingName').val();
			var bookingStartDate = $('#bookingStartDate').val();
			var bookingStartHour = $('#bookingStartHour').val();
			var bookingEndDate   = $('#bookingEndDate').val();
			var bookingEndHour   = $('#bookingEndHour').val();

			var mStartDate = moment(bookingStartDate + ' ' + bookingStartHour, 'DD/MM/YYYY HH:mm');
			var mEndDate   = moment(bookingEndDate + ' ' + bookingEndHour, 'DD/MM/YYYY HH:mm');

			var returnStatement = true;

			// Booking Name //
			if (_.isEmpty(bookingName)){
				$('#form-bookingName').addClass('has-error');
				returnStatement = false;
			}
			else {
				$('#form-bookingName').removeClass('has-error');
				this.bookingsModel.setBookingsName(bookingName);
			}

			// Booking Place //
			if (app.selectListBookingPlace.getSelectedItem() === ''){
				$('#form-bookingPlace').addClass('has-error');
				returnStatement = false;
			}
			else {
				$('#form-bookingPlace').removeClass('has-error');
			}

			// Booking Start Date //
			if (!mStartDate.isValid()){
				$('#form-bookingStartDate').addClass('has-error');
				returnStatement = false;
			}
			else {
				this.bookingsModel.setStartDate(mStartDate);
			}

			// Booking End Date //
			if (!mEndDate.isValid()){
				$('#form-bookingEndDate').addClass('has-error');
				returnStatement = false;
			}
			else {
				this.bookingsModel.setEndDate(mEndDate);
			}

			if (mStartDate > mEndDate){
				$('#form-bookingEndDate').addClass('has-error');
				returnStatement = false;
			}


			if (app.fullCalendar.checkOverlapEvent(mStartDate, mEndDate)){
				$('#form-bookingStartDate').addClass('has-error');
				returnStatement = false;
			}
			else {
				$('#form-bookingStartDate').removeClass('has-error');
			}

			return returnStatement;
		},



		/** Display the Summary
		*/
		displaySummary: function() {

			var tmp = _.template(bookingSummaryTemplate, { booking : this.bookingsModel, lang : app.lang, bookingLines: app.bookingLines });

			this.appContainer.find(app.bookingSumContainer).html(tmp);
		},



		/** Display the Summary
		*/
		submitForm : function() {

			var obj = {
				name             : this.bookingsModel.getName(),
				checkin          : moment(this.bookingsModel.checkin).utc().format('YYYY-MM-DD HH:mm:ss'),
				checkout         : moment(this.bookingsModel.checkout).utc().format('YYYY-MM-DD HH:mm:ss'),
				partner_id       : this.bookingsModel.partner_id,
				reservation_line : [[0, 0, {reserve_product : app.bookingLines.line_id }]]
			};

			if (this.bookingsModel.isCitizen()){
				obj.is_citizen    = true;
				obj.people_name   = this.bookingsModel.getClaimer();
				obj.partner_mail  = this.bookingsModel.getPeopleMail();
				obj.people_phone  = this.bookingsModel.getPeoplePhone();
				obj.people_street = this.bookingsModel.getPeopleAddress();
				obj.people_zip    = this.bookingsModel.getPeopleZipCode();
				obj.people_city   = this.bookingsModel.getPeopleCity();
			}

			$('button[type="submit"]').button('loading');

			// Request to save the reservation //
			var rest = $.ajax({
				url     : app.config.server_api_url + app.api_url_bookings,
				method  : 'POST',
				dataType: 'json',
				data    : JSON.stringify(obj)
			});

			rest.done(function(resaId) {
				var message = '<strong><i class="fa fa-check fa-lg fa-2x"></i></strong> ' + app.lang.infoMessage.validSendBooking;
				$('#submitMessage').html(message).addClass('alert-success').slideDown('slow');

				$('li[data-step="2"]').addClass('success');
				$('ul.pager').addClass('invisible');


				$.ajax({
					url     : app.config.server_api_url + app.api_url_bookings + '/' + resaId,
					method  : 'PATCH',
					dataType: 'json',
					data    : JSON.stringify({state_event: 'save'})
				});

			})
			.fail(function() {
				var message = '<strong><i class="fa fa-warning fa-lg fa-2x"></i></strong> ' + app.lang.errorMessage.errorSendBooking;
				$('#submitMessage').html(message).addClass('alert-danger').slideDown('slow');
			})
			.always(function() {
				$('button[type="submit"]').button('reset');
			});



		},



		/** Get the id of the Partner Citizen
		*/
		getIdOfPartnerCitizen: function() {

			var params = [{ field : 'type_id.code', operator : 'ilike', value : 'PART'}];

			return $.ajax({
				url   : app.config.server_api_url + app.api_url_partner,
				method: 'GET',
				data  : {
					fields  : ['id'],
					filters : Helper.objectifyFilters(params)
				}
			});

		},



		/** Select period of time in the calendar
		*/
		selectPeriodCalendar: function() {
			var sDat  = $('#bookingStartDate').val();
			var eDat  = $('#bookingEndDate').val();
			var sHour = $('#bookingStartHour').val();
			var eHour = $('#bookingEndHour').val();

			var mStartDate = moment(sDat + ' ' + sHour, 'DD/MM/YYYY HH:mm').toDate();
			var mEndDate   = moment(eDat + ' ' + eHour, 'DD/MM/YYYY HH:mm').toDate();

			// Check if the calendar is instantiate //
			if (!_.isUndefined(app.fullCalendar)){
				app.fullCalendar.select(mStartDate, mEndDate);
			}
		}


	};

	return app;
});