'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class FirstTimeSetupView extends ModalView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for first time setup modal dialog (popup).
	*
	* Requests permissions for using local storage and geolocation on the device.
	*
	* @requires jQuery
	*
	* @extends ModalView
	*
	* @constructor
	*
	* @param {String} elementId Id of the HTML DOM element the view is bound to
	*
	* @param {String} header Content for the modal header
	*
	* @param {String} body Content for the modal body
	*
	* @author Ulrik H. Gade, May 2016
	*/

	module.FirstTimeSetupView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'FirstTimeSetupView';

		this.ssuper = module.ModalView;
		
		// Initialize instance members inherited from parent class
		
		module.ModalView.call(this, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.FirstTimeSetupView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ModalView
	*---------------------------------------------------------------------------------------*/

	module.FirstTimeSetupView.prototype = Object.create(module.ModalView.prototype); // Set up inheritance

	module.FirstTimeSetupView.prototype.constructor = module.FirstTimeSetupView; // Reset constructor property

	module.View.children.push(module.FirstTimeSetupView); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** (Re)renders modal into DOM
	*
	* @param {Object} options JSON object containing (optional) header and body content, and custom 'OK' event handler
	*
	* @return void
	 */

	module.FirstTimeSetupView.prototype.render = function(obj_options) {
	
		var self = this, options = obj_options || {};

		$.extend(options,
		{
			header: 'First Time Setup',

			body: (function() {

				var container = document.createElement('div');

				/*
				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						id: 'setup-intro',

						innerHTML: 'Please decide about these permissions.'
					}
				));
				*/

				container.appendChild(self.createWidget(

					'SwitchInputWidget',
					{
						width: 's12',

						id: 'setup-localstorage',

						label: 'Allow local storage'

						//label: 'Allow app to store your account and event info on this device (required for the app to work.)'
					}
				));

				container.appendChild(self.createWidget(

					'InputDescriptionWidget',

					{
						datasource: 'Allows the app to store your account information on this device.',

						divider: false
					}
				));

				container.appendChild(self.createWidget(

					'SwitchInputWidget',
					{
						width: 's12',

						id: 'setup-geolocation',

						label: 'Allow geolocation'

						//label: 'Allow app to access the location of this device (optional)'
					}
				));

				container.appendChild(self.createWidget(

					'InputDescriptionWidget',

					{
						datasource: 'Allows the app to make useful suggestions based on the location of this device',

						divider: false
					}
				));

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						id: 'setup-outro',

						innerHTML: 'See Account Settings for more info, or if you change your mind.'
					}
				));

				return container;
			})(),

			cancel: 'Cancel',

			ok: 'OK'
		});

		this.ssuper().prototype.render.call(this, options);
	};

	
	/** Displays modal in UI and provides handler for data entered in modal (own complete() unless overriden in passed in options) */	

	module.FirstTimeSetupView.prototype.show = function(obj_options) {

		var self = this, options = obj_options || {};

		$.extend(options,
		{
			//dismissible: false, // prevent user from dismissing popup by tap/clicking outside it

			complete: options.complete ? options.complete.bind(self) : (self.complete ? self.complete.bind(self) : null)
		});

		this.ssuper().prototype.show.call(this, options);
	};

})(app);