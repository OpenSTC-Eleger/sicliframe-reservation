/******************************************
* Require JS Configuration
*/
requirejs.config({


	paths: {

		/* #############
		* Libs
		*/
		'jquery'             : '//code.jquery.com/jquery-2.0.3.min',
		'bootstrap'          : '//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min',
		'underscore'         : '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
		'text'               : '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min',


		/* ########
		* Templates
		*/
		'form-new-resa'      : '../templates/form-new-resa.html'
	},

	shim: {
		'underscore': {
			exports: '_'
		},
		'bootstrap': {
			deps   : ['jquery'],
			exports: 'bootstrap'
		}
	}

});



/******************************************
* Start The App
*/
require([
	'main',
], function(main){

	main.init();
});