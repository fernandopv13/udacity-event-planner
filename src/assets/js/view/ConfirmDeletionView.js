'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class ConfirmDeletionView extends ModalView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for generic confirm deletion modal dialog (popup) with customizable header and body content.
	*
	* Provides options to either go ahead with, or cancel, deletion.
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

	module.ConfirmDeletionView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'ConfirmDeletionView';

		this.ssuper = module.ModalView;
		
		// Initialize instance members inherited from parent class
		
		module.ModalView.call(this, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ConfirmDeletionView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from ModalView
	*---------------------------------------------------------------------------------------*/

	module.ConfirmDeletionView.prototype = Object.create(module.ModalView.prototype); // Set up inheritance

	module.ConfirmDeletionView.prototype.constructor = module.ConfirmDeletionView; // Reset constructor property

	module.View.children.push(module.ConfirmDeletionView); // Add to list of derived classes


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Delegates delete request to the Controller, which then decides what to do.
	*
	* Only reacts to taps/clicks on the modal's "OK" button (regardless of labelling). Other forms of popup dismissal are simply ignored.
	*
	* @param {nEvent} n Native browser event spawned by the tap/click
	*
	* @return {void}
	*/

	module.ConfirmDeletionView.prototype.complete = function(nEvent) {

		if (nEvent && nEvent.currentTarget.id === 'modal-ok') { //user selected 'OK' button in modal

			this.notifyObservers(this, this.model(), module.View.UIAction.DELETE);
		}
	};

	/** (Re)renders modal into DOM
	*
	* @param {Object} options JSON object containing optional header and body content, and 'OK' event handler
	*
	* @return void
	 */

	module.ConfirmDeletionView.prototype.render = function(obj_options) {
	
		var self = this, options = obj_options || {}, type = this.model() ? this.model().className() : 'Item';

		$.extend(options,
		{
			header: 'Delete ' + type,

			body: (function() {

				var container = document.createElement('div');

				container.appendChild(self.createWidget(
					
					'HTMLElement',
					{
						element: 'p',

						id: 'delete-intro',

						innerHTML: 'Deletion cannot be undone. Continue?'
					}
				));

				return container;
			})(),

			cancel: 'No, keep it',

			ok: 'OK, delete'
		});

		this.ssuper().prototype.render.call(this, options);
	};


	/** Displays modal in UI and provides handler for data entered in modal (own complete() unless overriden in passed in options) */	

	module.ConfirmDeletionView.prototype.show = function(obj_options) {

		var self = this, options = obj_options || {};

		$.extend(options, 
		{
			complete: options.complete ? options.complete.bind(self) : self.complete.bind(self)
		});

		this.ssuper().prototype.show.call(this, options);
	};
	
})(app);