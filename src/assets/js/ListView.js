'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class ListView extends View
******************************************************************************/

var app = app || {};


/** @classdesc Base class for list views. Provides default method implementations specific
*
* to list views, as well as an easy way to identify list views as such at runtime.
*
* @extends View
*
* @constructor
*
* @return {ListView} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, February 2016
*
*/

app.ListView = function(Function_modelClass, str_elementId, str_heading) {

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
	
	this.className = 'ListView';

	this.parentList.push(app.ListView);
		
};

	
/*----------------------------------------------------------------------------------------
* Inherit from View
*---------------------------------------------------------------------------------------*/	

app.ListView.prototype = Object.create(app.View.prototype); // Set up inheritance

app.ListView.prototype.constructor = app.ListView; //Reset constructor property


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Determines whether view should respond to update notification.
*
* ListViews respond in real time, as long as the object type and id match.
*
* Realization required by abstract View class. See this for further documentation.
 */

app.ListView.prototype.doUpdate = function(IModelable) {

	if (IModelable.constructor === this.modelClass) { // classes match

		if (IModelable.id() === this.ModelId) { // ids match

			return true;
		}
	}

	return false;
}