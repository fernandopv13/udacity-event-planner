'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class FirstTimeSetupView extends ModalView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for generic modal dialog (popup) with customizable header and body content.
	*
	* @constructor
	*
	* @param (String) elementId Id of the HTML DOM element the view is bound to
	*
	* @param (String) header Content for the modal header
	*
	* @param (String) body Content for the modal body
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



	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Submits any entries made by the user into the form to the controller, which then decides what to do.
	*
	* Only reacts to taps/clicks on the modal's "OK" button (regardless of labelling). Other forms popup of dismissal are simply ignored.
	*
	* @param {nEvent} n Native browser event spawned by the tap/click
	*
	* @return {void}
	*/

	module.FirstTimeSetupView.prototype.complete = function(nEvent) {

		if (nEvent && nEvent.currentTarget.id === 'modal-ok') { // user selected 'OK' button in modal

			var $modal = $(nEvent.currentTarget.parentNode.parentNode), 

			Model_m = new module.Account(),

			localStorageAllowed = $modal.find('#setup-localstorage').prop('checked');

			void Model_m.localStorageAllowed(localStorageAllowed);

			void Model_m.geoLocationAllowed($modal.find('#setup-geolocation').prop('checked'));

			this.submit(Model_m, module.View.UIAction.SUBMIT);

			//$('#nav-delete-icon').hide(1); // workaround: update to account causes update to AccountSettingsView, which causes the delete icon to display

			if (localStorageAllowed && window.localStorage) {

				app.registry.writeObject(); // save all app data, incl. registries, to local storage

				// on first login, registries have not yet been stored, and so later retrieval may fail unless done here

				Materialize.toast('Success, your account is ready for you to enjoy.', module.prefs.defaultToastDelay());
			}

			else {

				Materialize.toast('In demo mode. Everything works but you will loose your data when leaving the app (go to Account Settings to change this).', 3 * module.prefs.defaultToastDelay());
			}
		}
	};
	
	
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

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						id: 'setup-intro',

						innerHTML: 'Before you start using the app, please decide about these permissions.'
					}
				));

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
						datasource: 'Please allow the app to store your account and event details on this device. Otherwise, you will have to start over from scratch every time you come back to the app.',

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
						datasource: 'Allowing geolocation will enable the app to suggest event venues and other useful information based on the location of this device (optional).',

						divider: false
					}
				));

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						id: 'setup-outro',

						innerHTML: 'You can change these choices at any time in the app\'s Account Settings.'
					}
				));

				return container;
			})(),

			cancel: 'Cancel',

			ok: 'OK'
		});

		this.ssuper().prototype.render.call(this, options);

		/*DEPRECATED
		this.ssuper().prototype.render.call(this, 
		{
			header: 'First Time Setup',

			body: (function() {

				var container = document.createElement('div');

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						id: 'setup-intro',

						innerHTML: 'Before you start using the app, please decide about these permissions.'
					}
				));

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
						datasource: 'Please allow the app to store your account and event details on this device. Otherwise, you will have to start over from scratch every time you come back to the app.',

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
						datasource: 'Allowing geolocation will enable the app to suggest event venues and other useful information based on the location of this device (optional).',

						divider: false
					}
				));

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						id: 'setup-outro',

						innerHTML: 'You can change these choices at any time in the app\'s Account Settings.'
					}
				));

				return container;
			})(),

			ok: 'OK',

			cancel: 'Cancel'
		});
		*/
	};

	
	/** Displays modal in UI and provides handler for data entered in modal (own submit() unless overriden in passed in options) */	

	module.FirstTimeSetupView.prototype.show = function(obj_options) {

		var self = this, options = obj_options || {};

		$.extend(options,
		{
			dismissible: false, // prevent user from dismissing popup by tap/clicking outside it

			complete: options.complete ? options.complete.bind(self) : self.complete.bind(self)
		});

		this.ssuper().prototype.show.call(this, options);
	};

})(app);