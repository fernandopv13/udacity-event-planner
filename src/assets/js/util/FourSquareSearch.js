'use strict';

//console.log('FourSquareSearch loading');

var app = app || {}; // create a simple namespace for the app

app.FourSquare = app.FourSquare || {};

/***************************************************************************
* class FourSquareSearch
***************************************************************************/

/**
* @classdesc Wrapper class for FourSquare venue search API.
*
* @constructor
*
* @this {FourSquareSearch}
*
* @return {FourSquareSearch} A new FourSquareSearch instance
*
* @author Ulrik H. Gade, June 2016
*/

app.FourSquareSearch = function(int_count) {

	this.count = int_count ? int_count : 50; // the number of venues to fetch
};


// Store API keys for later use

app.FourSquare.client_id = '5TMRSYOKLO4XJZHUTWFPJCKFA4Y0LPZI4K5KG20KTDC0FK5L';

app.FourSquare.client_secret = 'ZC303RVAGW2QKHDNWKDUCB2SUZIGVWN2YXPR1TDH1DJEWZ1J';


/** Executes search: retrieves list of (compact) venues near given location
*
* @return {Array} An array of FourSquare compact venues
 */

app.FourSquareSearch.prototype.execute = function(callback, obj_location) {
	
	// Set up request

	var locStr;

	if (obj_location.coords) { // location is a Position object

		locStr = '&ll=' + obj_location.coords.latitude + ',' + obj_location.coords.longitude;
	}

	else if (obj_location.constructor === String) { // location is a place name

		locStr = '&near=' + obj_location;
	}

	else { // location is of unknown type

		throw new IllegalArgumentError('Location must be instance of Position or String');
	}
	
	
	var request = 'https://api.foursquare.com/v2/venues/search'
				+ '?client_id=' + app.FourSquare.client_id
				+ '&client_secret=' + app.FourSquare.client_secret
				+ '&v=' + 20130815
				+ '&intent=browse'
				+ locStr //'&ll=' + app.defaultLocation.lat() + ',' + app.defaultLocation.lng()
				+ '&radius=1000'
				+ '&categoryId=4d4b7105d754a06374d81259,4bf58dd8d48988d1f8931735' //restaurants and hotels
				+ '&limit=' + this.count //max 50
				;
	
	
	// Execute search
	
	$.ajax ({
		
		url: request,
		
		dataType: 'jsonp',
		
		success: function(data){ // Request successful, so process response
		
			var venues = data.response.venues;
					
			// Sort venues ascending by name, if search was unsuccesfull
				
			if (venues) { // venues is 'undefined' if no results

				venues.sort(function(a,b){
				
					a = a.name.toLowerCase();
					
					b = b.name.toLowerCase();
					
					return a === b ? 0 : +(a > b) || -1;
				});
			}


			callback(venues ? venues : []); // make sure return value is always an Array
		},
		
		error: function(e) { // request failed, so log error
			
			console.log(e);

			callback(null);
		}
	});
}


/** Retrieves detailed info for place.
*
* @return {FourSquareVenue} A (detailed) FourSquareVenue
*/

app.FourSquareSearch.prototype.getPlaceDetails = function(place, callback) {
	
	var request = 'https://api.foursquare.com/v2/venues/'
				+ place.id
				+ '?client_id=' + app.FourSquare.client_id
				+ '&client_secret=' + app.FourSquare.client_secret
				+ '&v=' + 20130815
				;
	$.ajax ({
		
		url: request,
		
		dataType: 'jsonp',
		
		success: function(data) { // request successful, so proces response
			
			callback(data.response.venue);
		},
		
		error: function(e) { // request failed, so log error
			
			console.log(e);
		}
	});
}
