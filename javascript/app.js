/******************************************
* APPLICATION NAMESPACE
*/
define('app', [

	// Load our app module and pass it to our definition function
	'jquery', 'bootstrap', 'underscore', 'moment', 'datepicker-lang', 'timepicker', 'advanceSelectBox', 'jquery.maskedinput',
	'text!form-new-resa'

], function($, bs, _, moment, datepicker, timepicker, advanceSelectBox, mask, formTemplate){

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
			var self = this;

			// Retrieve the template // 
			var tmp = _.template(formTemplate, {
				lang    : app.lang,
				moment  : moment()
			});

			this.container.html(tmp);


			app.selectListClaimerAssociation = new advanceSelectBox({selectbox: $('#claimerAssociation'), url: app.config.server_api_url+this.api_url_partner});
			app.selectListClaimerAssociation.render();


			var searchParam = { field : 'type_id.code', operator : 'ilike', value : 'ASSO' };
			app.selectListClaimerAssociation.setSearchParam(searchParam , true);


			app.selectListBookingPlace = new advanceSelectBox({selectbox: $('#bookingPlace'), url: app.config.server_api_url+this.api_url_bookables});
			app.selectListBookingPlace.render();

			app.selectListBookingPlace.setSearchParam({field:'type_prod', operator:'ilike', value:'site'},true);



			$('.datepicker').datepicker({ format: 'dd/mm/yyyy',	weekStart: 1, autoclose: true, language: 'fr', todayHighlight: true });
			$('.timepicker').timepicker({defaultTime: false, showMeridian: false, showInputs: false, showWidgetOnAddonClick: false});

			$('#citizenPhone').mask("99 99 99 99 99");

			$('*[data-toggle="tooltip"]').tooltip({container : 'body'});

			$('input[name="claimerType"]').change(function(){
				self.changeClaimerType();
			})

		},


		

		changeClaimerType: function(e){
			if($('#isCitizen').prop('checked')){
				$('.isCitizen').stop().slideDown();
				$('.isAssociation').stop().slideUp();
			}
			else{
				$('.isCitizen').stop().slideUp();
				$('.isAssociation').stop().slideDown();
			}
		}



	};

return app;

});