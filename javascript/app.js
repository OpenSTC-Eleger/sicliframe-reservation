/******************************************
* APPLICATION NAMESPACE
*/
define('app', [

	// Load our app module and pass it to our definition function
	'jquery', 'bootstrap', 'underscore', 'helper', 'bookingsModel', 'moment', 'datepicker-lang', 'timepicker', 'advanceSelectBox', 'jquery.maskedinput',
	'text!form-new-resa', 'text!booking-summary'

], function($, bs, _, Helper, BookingsModel, moment, datepicker, timepicker, advanceSelectBox, mask, formTemplate, bookingSummaryTemplate){

	'use strict';


	var app =  {

		api_url_partner   : 'open_object/partners',
		api_url_bookables : 'openresa/partners/<%= id %>/bookables',
		api_url_bookings  : 'openresa/bookings',

		configPath       : 'config/configuration.json',
		langPath         : 'i18n/'+window.navigator.language+'/lang.json',

		// Global Variable //
		config           : {},
		lang             : {},

		appContainer        : $('#container'),
		bookingSumContainer : '#bookingSummary',

		currentStep      : 0,
		maxStep          : 2,


		bookingsModel   : new BookingsModel(),



		/** View Render
		*/
		formView: function(){
			var self = this;

			// Retrieve the template // 
			var tmp = _.template(formTemplate, {
				lang    : app.lang,
				moment  : moment()
			});

			this.appContainer.html(tmp);


			app.selectListClaimerAssociation = new advanceSelectBox({selectbox: $('#claimerAssociation'), url: app.config.server_api_url+this.api_url_partner});
			app.selectListClaimerAssociation.render();

			// Filter on all the ASSO //
			var searchParam = { field : 'type_id.code', operator : 'ilike', value : 'ASSO' };
			app.selectListClaimerAssociation.setSearchParam(searchParam , true);


			app.selectListBookingPlace = new advanceSelectBox({selectbox: $('#bookingPlace'), url: app.config.server_api_url});
			app.selectListBookingPlace.render();
			var searchParam = { field : 'type_prod', operator : 'ilike', value : 'site' };
			app.selectListBookingPlace.setSearchParam(searchParam , true);


			$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr', todayHighlight: true });
			$('.timepicker').timepicker({defaultTime: false, showMeridian: false, showInputs: false, showWidgetOnAddonClick: false});

			$('#citizenPhone').mask("09 99 99 99 99");
			$('*[data-toggle="tooltip"]').tooltip({container : 'body'});

			
			// Claimer type change //
			$('input[name="claimerType"]').change(function(){
				self.changeClaimerType();
			});


			// Claimer type change //
			$('#bookingStartDate').datepicker().on('changeDate', function(){
				$('#bookingEndDate').datepicker('setStartDate', $('#bookingStartDate').datepicker('getDate'));
				$('#bookingEndDate').datepicker('setDate', $('#bookingStartDate').datepicker('getDate'));
			});


			// Association change, update the places List //
			$('#claimerAssociation').on('change', function(){
				var url = _.template(app.api_url_bookables, {id: app.selectListClaimerAssociation.getSelectedItem()});
				app.selectListBookingPlace.url = app.config.server_api_url+url;
			})


			// Previous button is click //
			$('li.previous a').click(function(e){
				self.previousStep();
			});


			// Next button is click //
			$('li.next a').click(function(e){
				self.nextStep();
			});


			this.bookingsModel.getName();
		},


		
		/** When the claimer type change
		*/
		changeClaimerType: function(e){
			// Is Citizen //
			if($('#isCitizen').prop('checked')){
				$('.isCitizen').stop().slideDown();
				$('.isAssociation').stop().slideUp();

				$('#citizenName').focus();

				// Retrieve the Id of the Citizen partner //
				this.getIdOfPartnerCitizen().done(function(data){

					var url = _.template(app.api_url_bookables, {id: data[0].id});
					app.selectListBookingPlace.url = app.config.server_api_url+url;
				});

				this.bookingsModel.setCitizen(true);
			}
			else{
				$('.isCitizen').stop().slideUp();
				$('.isAssociation').stop().slideDown();

				this.bookingsModel.setCitizen(false);
			}
		},



		/** Previous Step
		*/
		previousStep: function(e){

			if(this.currentStep == this.maxStep){
				$('button[type="submit"]').addClass('hide');	
			}


			this.currentStep = this.currentStep-1;

			if(this.currentStep >= 0){
				// Show the previous Tab //
				$('#wizard li:not(.sep):eq('+this.currentStep+') a').tab('show');

				$('li.next a').removeClass('hide');

				if(this.currentStep == 0){
					$('li.previous a').addClass('hide');
				}
			}
		},



		/** Next step
		*/
		nextStep: function(e){

			// Check the form of the current step //
			if(this.checkStep(this.currentStep)){

				if(this.currentStep < this.maxStep){
					this.currentStep = this.currentStep+1;

					// Hide the next Button //
					if(this.currentStep == this.maxStep){
						$('li.next a').addClass('hide');
						$('button[type="submit"]').removeClass('hide');
					}
					// Display the previous button //
					else{
						$('li.previous a').removeClass('hide');
					}

					// Show the next Tab //
					$('#wizard li:not(.sep):eq('+this.currentStep+') a').tab('show');
				}
			}
		},



		/** Check the form of the step
		*/
		checkStep: function(step){

			switch(step){
				case 0:
					if(this.checkStep0()){
						$('#step0 .form-group.has-error').removeClass('has-error');
						$('li[data-step="0"]').addClass('success');
						return true;
					}
					else{
						$('#step0 .form-group.has-error input').first().focus();
						return false;
					}
				break;
				case 1:
					if(this.checkStep1()){
						$('#step1 .form-group.has-error').removeClass('has-error');
						$('li[data-step="1"]').addClass('success');

						this.displaySummary();
						return true;
					}
					else{
						$('#step1 .form-group.has-error input').first().focus();
						return false;
					}
				break;
			}
		},



		/** Check step 0
		*/
		checkStep0: function(){
			var isCitizen    = $('#isCitizen').prop('checked');
			var citizenName  = $('#citizenName').val();
			var citizenMail  = $('#citizenMail').val();
			var citizenPhone = $('#citizenPhone').val();

			var returnStatement = true;

			if(isCitizen){
				if(_.isEmpty(citizenName)){
					$('#form-citizenName').addClass('has-error');
					returnStatement = false;
				}
				else{
					$('#form-citizenName').removeClass('has-error');
					this.bookingsModel.setCitizenName(citizenName);
				}

				if(_.isEmpty(citizenMail) || !Helper.checkMail(citizenMail)){
					$('#form-citizenMail').addClass('has-error');
					returnStatement = false;
				}
				else{
					$('#form-citizenMail').removeClass('has-error');
					this.bookingsModel.setCitizenMail(citizenMail);
				}

				if(_.isEmpty(citizenPhone)){
					$('#form-citizenPhone').addClass('has-error');
					returnStatement = false;
				}
				else{
					$('#form-citizenPhone').removeClass('has-error');
					this.bookingsModel.setCitizenPhone(citizenPhone);
				}
			}
			else{
				if(app.selectListClaimerAssociation.getSelectedItem() == ''){
					$('#form-claimerAssociation').addClass('has-error');
					returnStatement = false;
				}
				else{
					this.bookingsModel.setPartner(app.selectListClaimerAssociation.getSelectedItem());
				}
			}

			return returnStatement;
		},



		/** Check step 1
		*/
		checkStep1: function(){
			var bookingName      = $('#bookingName').val();
			var bookingStartDate = $('#bookingStartDate').val()
			var bookingStartHour = $('#bookingStartHour').val();
			var bookingEndDate   = $('#bookingEndDate').val()
			var bookingEndHour   = $('#bookingEndHour').val();

			var mStartDate = moment(bookingStartDate+' '+bookingStartHour, 'DD/MM/YYYY HH:mm');
			var mEndDate   = moment(bookingEndDate+' '+bookingEndHour, 'DD/MM/YYYY HH:mm');

			var returnStatement = true;

			// Booking Name //
			if(_.isEmpty(bookingName)){
				$('#form-bookingName').addClass('has-error');
				returnStatement = false;
			}
			else{
				$('#form-bookingName').removeClass('has-error');
				this.bookingsModel.setBookingsName(bookingName);
			}

			// Booking Place //
			if(app.selectListBookingPlace.getSelectedItem() == ''){
				$('#form-bookingPlace').addClass('has-error');
				returnStatement = false;
			}
			else{
				$('#form-bookingPlace').removeClass('has-error');
			}

			// Booking Start Date //
			if(!mStartDate.isValid()){
				$('#form-bookingStartDate').addClass('has-error');
				returnStatement = false;
			}
			else{
				this.bookingsModel.setStartDate(mStartDate);
			}

			// Booking End Date //
			if(!mEndDate.isValid()){
				$('#form-bookingEndDate').addClass('has-error');
				returnStatement = false;
			}
			else{
				this.bookingsModel.setEndDate(mEndDate);
			}

			if(mStartDate > mEndDate){
				$('#form-bookingEndDate').addClass('has-error');
				returnStatement = false;	
			}

			return returnStatement;
		},



		displaySummary: function(){
			console.log(this.bookingsModel);

		this.appContainer.find(app.bookingSumContainer).html(bookingSummaryTemplate);
		},



		/** Get the id of the Partner Citizen
		*/
		getIdOfPartnerCitizen: function(){

			var params = [{ field : 'type_id.code', operator : 'ilike', value : 'PART'}];

			return $.ajax({
				url: app.config.server_api_url+app.api_url_partner,
				method: 'GET',
				data: {
					fields  : ['id'],
					filters : Helper.objectifyFilters(params)
				}
			})

		}


	};

return app;

});