'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class ListView extends View
******************************************************************************/

var app = app || {};


/** @classdesc Abstract base class for list views. Provides default method implementations specific
*
* to list views, as well as an easy way to identify list views as such at runtime.
*
* @extends View
*
* @constructor
*
* @return {ListView} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, March 2016
*
*/

app.ListView = function(Function_modelClass, str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Call (chain) parent class constructor
	*---------------------------------------------------------------------------------------*/
	
	// Set temporary literal for use by parent class constructor (unless already defined in calling class)

	if (!this.className) {this.className = 'ListView';}

	
	// Initializes instance members inherited from parent class
	
	app.View.call(this, Function_modelClass, str_elementId, str_heading);

		
	/*----------------------------------------------------------------------------------------
	* Other object initialization (using parameter parsing/constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
	
	this.parentList().push(app.ListView);
		
};

	
/*----------------------------------------------------------------------------------------
* Inherit from View
*---------------------------------------------------------------------------------------*/	

app.ListView.prototype = Object.create(app.View.prototype); // Set up inheritance

app.ListView.prototype.constructor = app.ListView; // Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Captures click in list and notifies observers */

app.ListView.prototype.onClick = function(nEvent_e, Model_m) {

	this.notifyObservers(this, Model_m, app.View.UIAction.SELECT);
};


/** Does misc housekeeping required when ListView has rendered to the DOM */

app.ListView.prototype.onRender = function(Model_m) {

	return; // listviews should respond dynamically to model updates, so dummy method for now
}