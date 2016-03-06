'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class ViewUpdateHandler
******************************************************************************/

var app = app || {};

/** @classdesc Abstract base class for handlers of updates from Views to a Controller, in the mold of the Strategy pattern.
*
* @constructor
*
* @param {Controller} Reference to the Controller this ViewUpdateHandler will be collaborating with
*
* @return {ViewUpdateHandler} Not supposed to be instantiated, except when extended by subclasses.
*
* @author Ulrik H. Gade, March 2016
*/

app.ViewUpdateHandler = function(Controller_c) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _controller;
	
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
	
	if (Controller_c.constructor && Controller_c.constructor === app.Controller) {
		
		_controller = Controller_c;
	}

	else {

		throw new IllegalArgumentError('Expected Controller');
	}

	
};


/*----------------------------------------------------------------------------------------
* Public instance fields (non-encapsulated data members)
*---------------------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

/** Does the detailed work required when a Controller receives an update from a View.
*
* Plays the same role as the execute() method in the Strategy pattern, except we are
*
* here relying in the Observer pattern for handling the inter-object messaging. 
*
* @param {int} UIAction An integer representing the user action to respond to
*
* @param {Model} model The Model bound to the view spawning the request.
*
* @param {View} view The View spawning the request
*
* @return

* Author: Ulrik H. Gade, March 2016
*/


app.ViewUpdateHandler.prototype.update = function() {
	
	

	return 'ViewUpdateHandler received update() message ';
};


/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/
		
	

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

void app.IInterfaceable.mixInto(app.IInterfaceable, app.ViewUpdateHandler); // custom 'interface' framework

void app.IInterfaceable.mixInto(app.IObserver, app.ViewUpdateHandler); // the actual interface to implement