/******************************************
* APPLICATION NAMESPACE
*/
define('app', [

	// Load our app module and pass it to our definition function
	'jquery',

], function($){

	'use strict';


	var app =  {

		configPath : 'config/configuration.json',
		langPath   : 'i18n/'+window.navigator.language+'/lang.json',

		// Global Variable //
		config         : {},
		lang           : {},
	};

return app;

});