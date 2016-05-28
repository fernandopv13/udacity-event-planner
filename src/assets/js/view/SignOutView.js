'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class SignOutView extends ModalView
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

	module.SignOutView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'SignOutView';

		this.ssuper = module.ModalView;
		
		// Initialize instance members inherited from parent class
		
		module.ModalView.call(this, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.SignOutView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ModalView
	*---------------------------------------------------------------------------------------*/

	module.SignOutView.prototype = Object.create(module.ModalView.prototype); // Set up inheritance

	module.SignOutView.prototype.constructor = module.SignOutView; // Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	
	/** (Re)renders modal into DOM
	*
	* @param {Object} options JSON object containing (optional) header and body content, and custom 'OK' event handler
	*
	* @return void
	 */

	module.SignOutView.prototype.render = function(obj_options) {
	
		var self = this;

		this.ssuper().prototype.render.call(this, 
		{
			header: 'Sign Out',

			body: (function() {

				var container = document.createElement('div');

				

				container.appendChild(self.createWidget.call(

					this,

					'HTMLElement',
					{
						element: 'p',

						innerHTML: 'Sign out from the app?'
					}
				));

				
				var storageMsg = module.controller.selectedAccount().localStorageAllowed() ?

				'Your events and account info will still be here when you sign back in.' :

				'You will loose all your event and account info. Allow "Local Storage" in Account Settings before you sign out to change this.';

				
				container.appendChild(self.createWidget.call(

					this,

					'HTMLElement',
					{
						element: 'p',

						innerHTML: storageMsg
					}
				));

				
				return container;

			}.bind(this))(),

			ok: 'Sign Out',

			cancel: 'Stay signed in'
		});
	};

})(app);