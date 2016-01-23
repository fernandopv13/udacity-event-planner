'use strict'

//console.log('FourSquareVenue loading');

var app = app || {}; // create a simple namespace for the app


/***************************************************************************
* class FourSquareVenue
***************************************************************************/

/**
* @classdesc Wrapper class for FourSquare (detailed) Venue objects.
*
* @constructor
*
* @extends 'MapPlace'
*
* @this {FourSquareVenue}
*
* @return {FourSquareVenue} A new FourSquareVenue instance
*
* @author Ulrik H. Gade, December 2015
*/


app.FourSquareVenue = function() {/* FourSquareVenue constructor */}


/** Initializes venue details object once it's been fetched from the server */

app.FourSquareVenue.initPlace = function(obj_venue) {

	app.util.copyMethods(obj_venue, app.FourSquareVenue.prototype);
	
	obj_venue.constructor = app.FourSquareVenue; // Pretend we're constructed locally
}


/** Renders to HTML element (for infowindow)
*
* @return {DOMElement} A div containing the rendered content
*/

app.FourSquareVenue.prototype.render = function() {
	
	// Create main, text, and image container divs
	
	var el = document.createElement('div');
	
	el.id = 'infowindow-container';
	
	
	var el_img = document.createElement('div');
	
	el_img.id = 'infowindow-img-container';
	
		
	var el_txt = document.createElement('div');
	
	el_txt.id = 'infowindow-text-container';
		
		
	// Add place name and likes as header, if available
	
	if (this.name) {
		
		var heading = document.createElement('p');
		
		heading.id = 'infowindow-heading';
	
		heading.innerHTML = this.name;
		
		if (this.likes && this.likes.summary) {
			
			var likes = document.createElement('span');
		
			likes.id = 'infowindow-likes';
	
			likes.innerHTML = ' (' + this.likes.summary + ')';
		
			heading.appendChild(likes);
		}
		
		el_img.appendChild(heading);
	}
	
	
	// Add (best) image, if available
				
	if (this.bestPhoto) {

		var img = document.createElement('img');
		
		img.id = 'infoWindow-img_main'
		
		img.src = this.bestPhoto.prefix + '180x180' +  this.bestPhoto.suffix;
		
		// Wrap in link to FourSquare page, if available
		// 'ref' url paramater required by FourSquare
		
		if (this.canonicalUrl) {
			
			var anchor = document.createElement('a');
			
			anchor.href = this.canonicalUrl + '?ref=' + app.FourSquare.client_id;
			
			anchor.target = '_blank'; //open in new window/tab, preserving map
			
			anchor.title = this.name + ' at FourSquare.com'
			
			anchor.appendChild(img);
			
			el_img.appendChild(anchor);
		}
		
		else {
		
			el_img.appendChild(img);
		
		}

	}
	
	
	//Add street address, if available, reuse from compact venue (place)
	
	if (this.formatted_address) {
		
		var address = document.createElement('p');
		
		address.id = 'infowindow-address';
		
		address.innerHTML = this.formatted_address;
		
		el_txt.appendChild(address);
	}
	
	
	// Add phone number, if available
	
	if (this.contact && this.contact.formattedPhone) {
		
		var phone = document.createElement('p');
		
		phone.id = 'infowindow-phone';
		
		phone.innerHTML = 'Phone: ' + this.contact.formattedPhone;
		
		el_txt.appendChild(phone);
	}
	
	
	//Add website link, if available
	
	if (this.url) {
		
		var url = document.createElement('p');
		
		url.id = 'infowindow-website';
		
		url.innerHTML = 
			'Web: <a href="' + this.url + '" target="_blank">'
			+ this.url + '</a>';
		
		el_txt.appendChild(url);
	}
	
	
	// Add Facebook link, if available
	
	if (this.contact && this.contact.facebook) {
		
		var fb = document.createElement('p');
		
		fb.id = 'infowindow-facebook';
		
		fb.innerHTML = 
			'Facebook: '
			+ '<a href="https://facebook.com/' + this.contact.facebook + '"'
			+ ' title="' + this.name + ' on Facebook"'
			+ 'target="_blank"'
			+ '>'
			+ this.contact.facebookName + '</a>';
		
		el_txt.appendChild(fb);
	}
	
	
	//Add visual attribution to FourSquare
	
	var logo = document.createElement('img');
	
	logo.id = 'infowindow-foursquare-attribution-img';
	
	logo.title = 'Venue info powered by FourSquare';
	
	logo.src = 'https://ss0.4sqi.net/img/poweredByFoursquare/poweredby-one-color-cdf070cc7ae72b3f482cf2d075a74c8c.png'
	
	//retina src: https://ss0.4sqi.net/img/poweredByFoursquare/poweredby-one-color@2x-e7dda5140f3cd2f2fe545fe6affc9faa.png
	
	el_txt.appendChild(logo);
	
	
	// Append image and text to main div, then return it
	
	if (el_img.hasChildNodes()) {
		
			el.appendChild(el_img);
		}
		
	if (el_txt.hasChildNodes()) {
	
		el.appendChild(el_txt);
	}

	return el;
}