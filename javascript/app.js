/******************************************
* APPLICATION NAMESPACE
*/
define('app', [

	// Load our app module and pass it to our definition function
	'jquery', 'underscore', 'moment', 'datepicker-lang', 'timepicker', 'advanceSelectBox',
	'text!form-new-resa'

], function($, _, moment, datepicker, timepicker, advanceSelectBox, formTemplate){

	'use strict';


	var app =  {

		api_url_partner   : 'open_object/partners',
		api_url_bookables : 'openresa/partners/<%= id %>/bookables',

		configPath : 'config/configuration.json',
		langPath   : 'i18n/'+window.navigator.language+'/lang.json',

		// Global Variable //
		config         : {},
		lang           : {},

		container  : $('#container'),



		/** View Render
		*/
		formView: function(){

			// Retrieve the template // 
			var tmp = _.template(formTemplate, {
				lang    : app.lang,
				moment  : moment()
			});

			this.container.html(tmp);


			app.selectListClaimerAssociation = new advanceSelectBox({selectbox: $('#claimerAssociation'), url: app.config.server_api_url+this.api_url_partner});
			app.selectListClaimerAssociation.render();


			var searchParam = { field : 'type_id.code', operator : 'ilike', value : 'PART' };
			app.selectListClaimerAssociation.setSearchParam(searchParam , true);


			// Get the id of the partner_type Particulier //



			app.selectListBookingPlace = new advanceSelectBox({selectbox: $('#bookingPlace'), url: app.config.server_api_url+this.api_url_bookables});
			app.selectListBookingPlace.render();

			app.selectListBookingPlace.setSearchParam({field:'type_prod', operator:'ilike', value:'site'},true);



			$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr', todayHighlight: true });
			$('.timepicker').timepicker({defaultTime: false, showMeridian: false, showInputs: false, showWidgetOnAddonClick: false});

		},




	};

return app;

});