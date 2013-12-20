/******************************************
* APPLICATION NAMESPACE
*/
define('main', [

	'jquery', 'underscore', 'app', 'moment', 'datepicker-lang', 'timepicker',
	'text!form-new-resa'

], function($, _, app, moment, datepicker, timepicker, formTemplate){

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

			// Retrieve the template // 
			var tmp = _.template(formTemplate, {
				lang    : app.lang,
				moment  : moment()
			});

			this.container.html(tmp);

			$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr', todayHighlight: true });
			$('.timepicker').timepicker({defaultTime: false, showMeridian: false, showInputs: false, showWidgetOnAddonClick: false});

		}
	}

	return main;
});