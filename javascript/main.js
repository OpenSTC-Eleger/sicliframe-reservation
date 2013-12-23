/******************************************
* APPLICATION NAMESPACE
*/
define('main', [

	'jquery', 'app', 'helper'

], function($, app, Helper){

	'use strict';

	var main  = {


		/** Application initialization
		*/
		init: function() {
			var self = this;


			// Retrieve configuration and lang files //
			$.when($.getJSON(app.configPath), $.getJSON(app.langPath))
			.done(function (config_data, lang_data) {

				// Set the global variables //
				app.config = config_data[0];
				app.lang   = lang_data[0];


				// Set the Ajax setup //
				Helper.setAjaxSetUp(app.config.token_api);


				app.formView();

			})
			.fail(function(e){
				throw new Error('Unable to init the app');
			});
 
		},

	}

	return main;
});