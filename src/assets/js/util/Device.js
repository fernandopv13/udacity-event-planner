
'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Device
******************************************************************************/

var app = app || {}; // Create a simple namespace for the app

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Convenience class for holding all code dealing with queries about the device displaying the app in one place
	*
	* @constructor
	*
	* @author Ulrik H. Gade, May 2016
	*/

	module.Device = function() { // Constructor
		
		/*----------------------------------------------------------------------------------------
		* Private instance fields
		*---------------------------------------------------------------------------------------*/
		
		var _orientation = window.matchMedia('(orientation: portrait)').matches	? 'portrait' : 'landscape';
		

		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields
		*---------------------------------------------------------------------------------------*/
		
		/** Gets or sets the device's orientation
		*
		* @param {String} orientation Accepted values are 'portrait' or 'landscape' (without quotes, not case-sensitive)
		*
		* @return {String} The device's orientation. Possible values are 'portrait' or 'landscape' (without quotes).
		*
		* @todo combine with an event handler so the value gets updated when user rotates device
		*/

		this.orientation = function(str_orientation) {
			
			if (arguments.length > 0) { // setter

				str_orientation = str_orientation.toLowerCase();
				
				if (['portrait','landscape'].indexOf(str_orientation) > -1) {
				
					_orientation = str_orientation;
				}
				
				else {
					
					throw new IllegalArgumentError('Illegal orientation string: ' + str_orientation);
				}
			}

			return _orientation;
		};
	};


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/**
	* Gets whether device runs Android or not
	*
	* @return {Boolean} true if device runs Android, otherwise false
	*/
	
	module.Device.prototype.isAndroid = function() {

		return /android/i.test(navigator.userAgent.toLowerCase());
	}


	/**
	* Gets whether browser is Google Chrome or not
	*
	* @return {Boolean} true if browser is Chrome, otherwise false
	*/
	
	module.Device.prototype.isChrome = function() {

		return /chrome/i.test(navigator.userAgent.toLowerCase())

				|| /crios/i.test(navigator.userAgent.toLowerCase()); // on iOS, Chrome identifies as 'CriOS'
	}

	/**
	* Gets whether device runs iOS (i.e. is an Apple iPhone, iPad or iPod) or not
	*
	* @return {Boolean} true if device runs iOS, otherwise false
	*/
	
	module.Device.prototype.isiOS = function() {

		return /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) && !window.MSStream;
	}


	/** Gets whether device is currently held in landscape orientation
	*
	* @return {Boolean} true if landscape, else false
	*/

	module.Device.prototype.isLandscape = function () {
		
		return this.orientation() === 'landscape';
	};


	/**
	* Gets whether device runs Linux or not
	*
	* @return {Boolean} true if device runs Linux, otherwise false
	*/
	
	module.Device.prototype.isLinux = function() {

		return navigator.platform.toLowerCase().indexOf('linux') !== -1;
	}


	/**
	* Gets whether device runs MacOS or not
	*
	* @return {Boolean} true if device runs MacOS, otherwise false
	*/
	
	module.Device.prototype.isMacOS = function() {

		return navigator.platform.toLowerCase().indexOf('mac') !== -1;
	}


	/** Gets whether device is mobile (i.e. phone or tablet) or not
	*
	* @return {Boolean} true if mobile, else false
	*
	* @todo Increase sophistication, taking inspiration from e.g. https://css-tricks.com/snippets/css/media-queries-for-standard-devices/
	*/

	module.Device.prototype.isMobile = function() {

		if (Modernizr.matchmedia) { // use media queries, if available (much preferred)
			
			// If none of the device's dimensions exceed 1024px, assume its a phone or tablet

			return window.matchMedia('(max-device-height: 1024px)').matches

				&& window.matchMedia('(max-device-width: 1024px)').matches

		} else { // brute force old school, even if it may raise eyebrows

			// We will very rarely need this, so risks are acceptable

			var isMobile = false;

			['android', 'blackberry', 'bb10', 'iemobile', 'ipad', 'ipod', 'opera mini', 'mobile'].forEach(function(key) {

				isMobile = isMobile || window.navigator.userAgent.toLowerCase().indexOf(key) > -1;
			});

			return isMobile;
		}
	};


	/** Gets whether device is currently held in portrait orientation
	*
	* @return {Boolean} true if portrait, else false
	*/
	
	module.Device.prototype.isPortrait = function () {
		
		return this.orientation() === 'portrait';
	};


	/**
	* Gets whether browser is Safari or not
	*
	* @return {Boolean} true if browser is Safari, otherwise false
	*/
	
	module.Device.prototype.isSafari = function() {

		return /safari/i.test(navigator.userAgent.toLowerCase())

				&& !/chrome/i.test(navigator.userAgent.toLowerCase()) // chrome also reports as Safari

				&& !/crios/i.test(navigator.userAgent.toLowerCase());
	}


	/**
	* Gets whether device runs Windows or not
	*
	* @return {Boolean} true if device runs Windows, otherwise false
	*/
	
	module.Device.prototype.isWindows = function() {

		return navigator.platform.toLowerCase().indexOf('win') !== -1;
	}


	/** Converts Device object to JSON. Mostly needed to ease debugging on non-desktops (less typing).
	*
	* @return {Object} JSON object literal representation of Device's internal state
	*/
	
	module.Device.prototype.toJSON = function () {
		
		return {

			android: this.isAndroid(),

			chrome: this.isChrome(),

			iOS: this.isiOS(),

			landscape: this.isLandscape(),

			linux: this.isLinux(),

			mac: this.isMacOS(),

			mobile: this.isMobile(),

			orientation: this.orientation(),

			portrait: this.isPortrait(),

			safari: this.isSafari(),

			windows: this.isWindows()
		}
	};

})(app);