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
* @author Ulrik H. Gade, December 2015
*/

app.FourSquareSearch = function() {};


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
				+ '&limit=' + 10 //max 50, but long list doesn't work well on physically large (PC) screens
				;
	
	
	// Execute search
	
	$.ajax ({
		
		url: request,
		
		dataType: 'jsonp',
		
		success: function(data){ // Request successful, so process response
		
			var venues = data.response.venues;
					
			// Sort venues ascending by name
				
			venues.sort(function(a,b){
				
				a = a.name.toLowerCase();
				
				b = b.name.toLowerCase();
				
				return a === b ? 0 : +(a > b) || -1;
			});


			callback(venues);
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
			
			// Initialize custom methods
			// Only detailed venues need this
			
			//app.FourSquareVenue.initPlace(data.response.venue);
			
			
			// Copy over address from compact version of venue
			
			//data.response.venue.formatted_address = place.formatted_address;
			
			
			//call caller callback(!), passing in detailed venue
			
			callback(data.response.venue);
		},
		
		error: function(e) { // request failed, so log error
			
			console.log(e);
		}
	});
}
