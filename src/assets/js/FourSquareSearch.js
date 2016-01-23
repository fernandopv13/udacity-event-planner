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

app.FourSquareSearch.prototype.execute = function(callback) {
	
	// Set up request
	
	var request = 'https://api.foursquare.com/v2/venues/search'
				+ '?client_id=' + app.FourSquare.client_id
				+ '&client_secret=' + app.FourSquare.client_secret
				+ '&v=' + 20130815
				+ '&intent=browse'
				+ '&ll=' + app.defaultLocation.lat() + ',' + app.defaultLocation.lng()
				+ '&radius=1000'
				+ '&categoryId=4bf58dd8d48988d16d941735,4bf58dd8d48988d1e0931735' //cafés and coffee shops
				+ '&limit=' + 25 //max 50
				;
	
	
	// Execute search
	
	$.ajax ({
		
		url: request,
		
		dataType: 'jsonp',
		
		success: function(data){ // Request successful, so process response
		
			var results = data.response.venues;
					
			// Sort venues ascending by name
				
			results.sort(function(a,b){
				
				a = a.name.toLowerCase();
				
				b = b.name.toLowerCase();
				
				return a === b ? 0 : +(a > b) || -1;
			});
			
			
			// Add custom fields and map markers to venues
			// One big, happy loop to avoid redundant iteration!
			
			/*
			for (var i = 0, len = results.length; i < len; i++) {
				
				// Address (for use in list view)
				
				results[i].formatted_address = // info may/not be available, so test
					
					  (results[i].location.address ? results[i].location.address + ', ': '')
					
					+ (results[i].location.city ? results[i].location.city : '');
				
				// Category icon and name (for use in infowindow)
				
				for (var j = 0, ln = results[i].categories.length; j < ln; j++) {
					
					if (results[i].categories[j].primary) {
						
						results[i].icon = results[i].categories[j].icon.prefix
										+ 'bg_44' //may need larger icon for hi-res touch devices
										+ results[i].categories[j].icon.suffix;
										
						results[i].category = results[i].categories[j].name;
					}
				}
				
				// 'Constructor' (pretend we're constructed locally)
				
				//results[i].constructor = app.FourSquareVenue;
				
				
				// Geolocation (for use by map marker)
				
				//results[i].geometry = {location: new google.maps.LatLng(results[i].location.lat, results[i].location.lng)};
				
				
				// Map marker
				
				//results[i].marker = new app.Marker(results[i]);
				
			}
			*/
			
			// Call viewmodel initializer, passing in list of venues
			
			callback(results);
		},
		
		error: function(e) { // request failed, so log error
			
			console.log(e);
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
