/******************************************
* Booking Model
*/
define([

	'jquery', 'underscore', 'underscore.string','moment'

], function($, _, str, moment){

	'use strict';


	var BookingsModel = function(){

		this.fields = ['name', 'checkin', 'checkout', 'partner_id', 'people_name', 'people_email', 'people_phone', 'is_citizen', 'resources'];
		

		/** Get Name
		*/
		this.getName = function(){
			return this.name;	
		};



		/** Get CheckDate
		*/
		this.getCheckDate = function(){
			return moment(checkin).format('LLL');
		};


		// Citizen Phone //
		this.setPartner = function(id){
			this.partner_id = id;
		};

		// Set Booking is Citizen //
		this.setCitizen = function(param){
			this.is_citizen = true;
		};
		// Citizen Name //
		this.setCitizenName = function(param){
			this.people_name = str.titleize(param);
		};
		// Citizen Mail //
		this.setCitizenMail = function(param){
			this.people_email = param;
		};
		// Citizen Phone //
		this.setCitizenPhone = function(param){
			this.people_phone = param;
		};

		// Booking Name //
		this.setBookingsName = function(param){
			this.name = param;
		};
		// Booking Start Date //
		this.setStartDate = function(date){
			this.checkin = date.format('YYYY-MM-DD HH:mm:ss');
		};
		// Booking End Date //
		this.setEndDate = function(date){
			this.checkout = date.format('YYYY-MM-DD HH:mm:ss');
		}



	};

return BookingsModel;

});