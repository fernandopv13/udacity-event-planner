'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class AccountProfileView Implements IViewable
******************************************************************************/

var app = app || {};

/** @classdesc ViewObject for account profile. Renders profile in UI, and captures UI events on profile.
*
* @constructor
*
* @implements IViewable
*
* @param (String) elementId Id of the HTML DOM element the view is bound to
*
* @param (String) heading Content for the list heading
*
* @author Ulrik H. Gade, February 2016
*/

app.AccountProfileView = function(str_elementId, str_heading) {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	var _implements = [app.IObservable, app.IObserver, app.IViewable], // list of interfaces implemented by this class (by function reference);

	$_renderContext = $('#' + str_elementId),

	_heading = str_heading;

	
	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far
	

	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	// none so far


	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	this.observers = []; // Array of IObservers. Not private b/c we need to break encapsulation
							//any way in order to expose collection to default IObservable methods
	

	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	/** Cancels entries in, and navigation to, person form
	*
	* @todo Everything(!)
	*/

	app.AccountProfileView.prototype.cancel = function() {

		// do something!
	}


	/** Returns true if class implements the interface passed in (by function reference)
	*
	* (Method realization required by IInterfaceable.)
	*
	* @param {Function} interface The interface we wish to determine if this class implements
	*
	* @return {Boolean} instanceof True if class implements interface, otherwise false
	*	
	*/
	
	this.isInstanceOf = function (func_interface) {
		
		return _implements.indexOf(func_interface) > -1;
	};
	

	/** Notifies observers that form has been updated (i.e. submitted).
	*
	* Overrides default method in IObservable.
	*
	* @param {Person} The Person passing data in the form onto the observers
	*
	* @return void
	 */

	/*
	app.AccountProfileView.prototype.notifyObservers = function(IModelable_person, int_objId) {

		this.observers.forEach(function(observer) {

			observer.update(IModelable_person, int_objId);
		});
	};
	*/

	/** (Re)renders p