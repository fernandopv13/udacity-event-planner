'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class FormView extends View
******************************************************************************/

var app = app || {};


/** @classdesc Base class for form views. Provides default method implementations specific
*
* to form views, as well as an easy way to identify form views as such at runtime.
*
* @extends View
*
* @constructor
*
* @return {FormView} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, February 2016
*/

app.FormView = function(Function_modelClass, str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	/** Initializes instance members inherited from parent class*/
	
	app.View.call(this, Function_modelClass, str_elementId, str_heading);
	
		
	/*----------------------------------------------------------------------------------------
	* Other object initialization
	*---------------------------------------------------------------------------------------*/
		
	this.className = 'FormView';

	this.parentList.push(app.FormView);
};

	
/*----------------------------------------------------------------------------------------
* Inherit from View
*---------------------------------------------------------------------------------------*/	

app.FormView.prototype = Object.create(app.View.prototype); // Set up inheritance

app.FormView.prototype.constructor = app.FormView; // Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Handles common tasks for forms when cancelled by user */

app.FormView.prototype.cancel = function(bool_deleteModel) {

	if (bool_deleteModel) { // model was new object that is no longer needed

		var obj = app[this.modelClass].registry.getObjectById(this.modelId); // get reference to model

		app[this.modelClass].registry.removeObject(obj); // remove from class' registry

		obj = undefined; // dereference object to expose it to garbage collection
	}

	//this.clear(); // mark view as inactive

	window.history.back(); // return to previous view

	// for now, simply discard any entries made by user to an existing guest
}


/** Determines whether view should respond to update notification.
*
* FormViews ignore and override changes to their underlying model while they are in focus.
*
* Realization required by abstract View class. See this for further documentation.
 */

app.FormView.prototype.doUpdate = function(IModelable) {

	if (this.constructor !== app.controller.currentView().constructor) { // form is not in focus (i.e. being displayed)

		if (IModelable === null) { // i.e. reset

			return true;
		}

		else if (IModelable.constructor === this.modelClass) { // classes match

			return true;
		}
	}

	return false;
}