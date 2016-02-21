'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class FormView extends View
******************************************************************************/

var app = app || {};


/** @classdesc Root class for form views. Provides default method implementations specific
*
* to form views, as well as an easy way to identify form views as such at runtime.
*
* @extends View
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*/

app.FormView = function() {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	/** Initializes instance members inherited from parent class*/
	
	app.View.call(this, arguments);
	
	
	
	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
		
	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	
	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/
	

	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
		

	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	
	
	/*----------------------------------------------------------------------------------------
	* Other object initialization (using parameter parsing/constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
		
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

	var ret = _modelId;

	_modelId = null;

	return ret;
}


/** Determines whether view should respond to update notification.
*
* FormViews ignore and override changes to their underlying model while they are being edited.
*
* Realization required by abstract View class. See this for further documentation.
 */

app.FormView.prototype.doUpdate = function(IModelable) {

	if (this.ModelId() === null) { // view is inactive

		if (IModelable.constructor === _modelClass) { // classes match

			if (IModelable.id() === this.ModelId()) { // ids match

				return true;
			}
		}
	}

	return false;
}