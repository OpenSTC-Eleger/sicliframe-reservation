/*!
 * Sicliframe-resa
 * Copyright 2013-2014 Siclic <contact@siclic.fr>
 * Licensed under AGPL-3.0 (https://www.gnu.org/licenses/agpl.txt)
 */

/******************************************
* APPLICATION HELPER
*/
define('helper', [

	'jquery'

], function($) {

	'use strict';


	var helper =  {


		objectifyFilters: function(filterArray) {
			return $.extend({},filterArray);
		},



		/** Ajax Setup
		*/
		setAjaxSetUp: function(token) {

			$.ajaxSetup({
				contentType: 'application/json',
				headers: {Authorization: 'Token token=' + token},
				statusCode: {
					401: function() {
						console.log('Dont have the right');
					},
					500: function() {
						console.log('Internal Server Error');
					},
					502: function() {
						console.log('Bad Gateway ou Proxy Error');
					}
				}
			});

		},


		checkMail: function(email) {
			var re = /\S+@\S+\.\S+/;
			return re.test(email);
		}

	};

	return helper;

});