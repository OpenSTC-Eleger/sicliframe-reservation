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
			return str.titleize(this.name);
		};

		/** Get CheckDate
		*/
		this.getStartDate = function(){
			return moment(this.checkin).format('LLL');
		};
		this.getEndDate = function(){
			return moment(this.checkout).format('LLL');
		};
		this.getClaimer = function(){
			if(!this.is_citizen){
				return this.partner_name;
			}
			else{
				return this.people_name;
			}
		};
		this.getPeopleMail = function(){
			return this.people_email;
		}
		this.getPeoplePhone = function(){
			return this.people_phone;
		}
		this.isCitizen = function(){
			return this.is_citizen;
		}


		// Partner //
		this.setPartner = function(id){
			this.partner_id = id;
		};
		// Partner Name //
		this.setPartnerName = function(name){
			this.partner_name = name;
		};

		// Set Booking is Citizen //
		this.setCitizen = function(param){
			this.is_citizen = param;
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