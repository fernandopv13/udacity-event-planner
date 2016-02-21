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

app.FormView.prototype.constructor = app.FormView; //Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Resets the modelId of the view to null, thus marking the view as inactive and ready to
*
* receive update notifications. Call before exiting cancel/submit functions to relase the view
*
* return {int} The id being removed.
*/

app.FormView.prototype.clear = function() {

	var ret = this.modelId;

	this.modelId = null;

	return ret;
}


/** Determines whether view should respond to update notification.
*
* FormViews ignore and override changes to their underlying model while they are being edited.
*
* Realization required by abstract View class. See this for further documentation.
 */

app.FormView.prototype.doUpdate = function(IModelable) {

	if (this.modelId === null) { // view is inactive

		if (IModelable.constructor === this.modelClass) { // classes match

			if (IModelable.id() === this.modelId) { // ids match

				return true;
			}
		}
	}

	return false;
}