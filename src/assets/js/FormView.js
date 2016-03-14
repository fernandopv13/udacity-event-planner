'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class FormView extends View
******************************************************************************/

var app = app || {};


/** @classdesc Abstract base class for form views. Provides default method implementations specific
*
* to form views, as well as an easy way to identify form views as such at runtime.
*
* @extends View
*
* @constructor
*
* @return {FormView} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, March 2016
*/

app.FormView = function(Function_modelClass, str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literals for use by parent class constructor (unless already defined in calling class)

	this.className =  this.className ? this.className : 'FormView';

	this.ssuper = this.ssuper ? this.ssuper : app.View;


	// Initializes instance members inherited from parent class
	
	app.View.call(this, Function_modelClass, str_elementId, str_heading);
	
		
	/*----------------------------------------------------------------------------------------
	* Other object initialization
	*---------------------------------------------------------------------------------------*/
		
	this.parentList().push(app.FormView);
};

	
/*----------------------------------------------------------------------------------------
* Inherit from View
*---------------------------------------------------------------------------------------*/	

app.FormView.prototype = Object.create(app.View.prototype); // Set up inheritance

app.FormView.prototype.constructor = app.FormView; // Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Handles delete event in UI */

app.FormView.prototype.delete = function(nEvent) {

	//console.log(this.model());

	this.onUnLoad();

	this.notifyObservers(this, this.model(), app.View.UIAction.DELETE);
};


/** Initializes event handlers and other functionality after the View has been unhidden */

app.FormView.prototype.onLoad = function(nEvent) {

	Materialize.updateTextFields(); // make sure labels are set correctly

	
	$('#nav-delete-icon').show('slow'); // show delete icon in navbar

	
	// Set up modal for delete confirmation

		$('#confirm-delete-modal-cancel').click(function(nEvent) {

			$('#confirm-delete-modal').closeModal();

		}.bind(this));


		$('#confirm-delete-modal-ok').click(function(nEvent) {

			$('#confirm-delete-modal').closeModal();

			this.delete();

		}.bind(this));


		$('#nav-delete-icon').click(function(nEvent) {

			$('#confirm-delete-modal').openModal();
		});
};


/** Does varies housekeeping after the View has rendered to the DOM
*
* @todo Consolidate with onLoad(): they serve the same purpose
*/

app.FormView.prototype.onRender = function(Model_m) {

	this.hide();

	app.View.prototype.update.call(this); // ssuper() does not work recursively, so call directly
}


/** Does varies housekeeping after the View has lost focus in the app */

app.FormView.prototype.onUnLoad = function(nEvent) {

	$('#nav-delete-icon').hide('fast'); // hide delete icon in navbar

	$('#nav-delete-icon, #confirm-delete-modal-cancel, #confirm-delete-modal-ok').off(); // remove all event handlers from delete widgets
};


/** Submits entries made by the user into the form to the controller, with the purpose of updating of the Model */

app.FormView.prototype.submit = function(Model_m, int_UIaction) {

	console.log('FormView');

	this.notifyObservers(this, Model_m, typeof int_UIaction === 'number' ? int_UIaction : app.View.UIAction.SUBMIT);

	return true;
}


/** Updates form when notified by controller of change to model.
*
* FormViews ignore and override changes to their underlying model while they are in focus.
*
* Realization required by abstract View class. See this for further documentation.
*
* @return {void}
*/

app.FormView.prototype.update = function(Model_m) {

	if (!app.controller.currentView() || this.constructor !== app.controller.currentView().constructor) { // view is not in focus

		app.View.prototype.update.call(this, Model_m); // ssuper() does not work recursively, so call directly
	}
}