/******************************************
* Advanced SelectBox View
*/
define([

	'jquery', 'underscore', 'underscore.string', 'helper', 'select2-lang'

], function($, _, _str, Helper) {

	'use strict';


	var AdvancedSelectBox = function(params) {


		this.selectbox    =  params.selectbox;

		this.url          = params.url;

		this.searchParams =  [];



		/** View Render
		*/
		this.render =  function() {
			var self = this;

			// Retrieve placeholder attribute //
			var placeholder;
			if (!_.isUndefined(this.selectbox.data('placeholder'))){ placeholder = this.selectbox.data('placeholder'); }
			else { placeholder = ''; }

			// Retrieve minimum-input-length attribute //
			var minimumInputLength;
			if (!_.isUndefined(this.selectbox.data('minimum-input-length'))){ minimumInputLength = this.selectbox.data('minimum-input-length'); }
			else { minimumInputLength = 0; }

			// Retrieve multiple attribute //
			var multiple;
			if (!_.isUndefined(this.selectbox.data('multiple'))){ multiple = this.selectbox.data('multiple'); }
			else { multiple = false; }


			var fields = ['id', 'name'];


			this.selectbox.select2({
				allowClear         : true,
				placeholder        : placeholder,
				multiple           : multiple, 
				minimumInputLength : minimumInputLength,
				query: function(query) {

					// SEARCH PARAMS //
					var params = [];
					
					if (_.contains(fields, 'complete_name')){
						params.push({ field : 'complete_name', operator : 'ilike', value : query.term});
					}
					else {
						params.push({ field : 'name', operator : 'ilike', value : query.term});	
					}

					// Set all the search params in the params for the query //
					if (!_.isEmpty(self.searchParams)){
						_.each(self.searchParams, function(query) {
							params.push(query);
						});
					}
					// / SEARCH PARAMS //


					$.ajax({
						url: self.url,
						method: 'GET',
						data: {
							fields  : fields,
							filters : Helper.objectifyFilters(params)
						}
					}).done(function(data) {

							var returnData = {results: []};

							_.each(data, function(item) {

								returnData.results.push({
									id   : item.id,
									text : _str.titleize(item.name.toLowerCase())
								});
							});

							// Return the query //
							query.callback(returnData);
						});

				},
				sortResults: function(results, container, query) {
					var sortResults;

					// If no term was enter, results are Alphabetic //
					if (_.isEmpty(query.term)){
						sortResults = _.sortBy(results, function(result) { 
							return result.text;
						});
					}
					// Display results begin with the term enter and after the rest of the result //
					else {
						var otherResults = [];
						var beginWithResults = _.filter(results, function(result) {

							
							if (_str.startsWith(result.text.toUpperCase(), query.term.toUpperCase())){
								return result;
							}
							else {
								otherResults.push(result);
							}
						});

						sortResults = _.union(beginWithResults, otherResults);
					}

					return sortResults;
				},
				containerCssClass: function() {
					if (!_.isUndefined(self.selectbox.data('tag-large'))){ 
						return 'tag-large';
					}
				}

			});

		};



		/** Set an item as selected
		*/
		this.setSelectedItem = function(item) {
			this.selectbox.select2('data', {id: item[0], text: item[1]});
		};



		/** Set somes items as selected
		*/
		this.setSelectedItems = function(items) {
			var data = [];

			_.each(items, function(item) {
				var itemData = {id: item.id, text: item.name};
				data.push(itemData);
			});

			this.selectbox.select2('data', data);
		};



		/** Get the value of the selected item
		*/
		this.getSelectedItem = function() {

			var returnId = '';

			if (!_.isNull(this.selectbox.select2('data'))){
				returnId = this.selectbox.select2('data').id;
			}

			return returnId;
		};
		
		

		/** Get the value of the selected item
		*/
		this.getSelectedText = function() {

			var name = '';

			if (!_.isNull(this.selectbox.select2('data'))){
				name = this.selectbox.select2('data').text;
			}

			return name;
		};


		/** Get the values of the selected item
		*/
		this.getSelectedItems = function() {

			var returnIds = [];

			if (!_.isEmpty(this.selectbox.select2('data'))){
				
				_.each(this.selectbox.select2('data'), function(item) {
					returnIds.push(item.id);
				});
			}

			return returnIds;
		};



		/** Reset the selectBox Value
		*/
		this.reset = function() {
			this.selectbox.select2('data', null);
		};



		/** Set a search params
		*/
		this.setSearchParam = function(query, reset) {
			if (reset){
				this.resetSearchParams();
			}

			this.searchParams.push(query);
		};



		/** Reset the search Params
		*/
		this.resetSearchParams = function() {
			this.searchParams = [];
		};

	};

	return AdvancedSelectBox;

});