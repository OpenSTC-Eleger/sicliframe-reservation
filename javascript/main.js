/******************************************
* APPLICATION NAMESPACE
*/
define('main', [

	'jquery', 'app', 
	'text!form-new-resa'

], function($, app, template){

	'use strict';

	var main  = {

		container  : $('#container'),


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


				self.formView();

			})
			.fail(function(e){
				throw new Error('Unable to init the app');
			});
 
		},


		formView: function(){

			this.container.html(template);
		}
	}

	return main;
});