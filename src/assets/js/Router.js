'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class ClassName
******************************************************************************/

var app = app || {};


/** @classdesc Manages the browser history so that deep linking and back/forward navigation
*
* works meaningfully despite this being a single-page application.
*
* Minimalist implementation to get demo of app up and running. Requires HTML5 capaable browser.

* More comprehensive solution awaits port of the app to Angular.js or similar framework
*
* that comes with more comprehensive support for this functionality.
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*/

app.Router = function() {

	/*----------------------------------------------------------------------------------------
	* Private instance fields (encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// none so far	
	
	/*----------------------------------------------------------------------------------------
	* Public instance fields (non-encapsulated data members)
	*---------------------------------------------------------------------------------------*/
	
	// none so far
	
	

	/*----------------------------------------------------------------------------------------
	* Accessors for private instance fields
	*---------------------------------------------------------------------------------------*/

	// none so far

	
	/*----------------------------------------------------------------------------------------
	* Private instance methods (may depend on accessors, so declare after them)
	*---------------------------------------------------------------------------------------*/
	
	//none so far

	

	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/
	
	/** Handles browser history's HTML5 onpopstate event
	*
	* Parses event object and loads app view matching the user's navigation
	 */

	this.onPopState = function(event) {

		console.log(event);

		var className = event.state.className,

		id = event.state.id;

		switch (className) {

			case 'EventListView':

				app.controller.onAccountSelected(id);

				break;

			case 'EventView':

				app.controller.onEventSelected(id);

				break;

			case 'PersonListView':

				app.controller.onGuestListSelected(id);

				break;

			case 'PersonView':

				app.controller.onGuestSelected(id);

				break;
		}


	}


	/** Updates browser history and location bar URL to match user's navigation within the app
	*	
	* @param {IViewable} view The IViewable which has just been made the focus of the app
	*
	*/

	this.onViewChange = function(IViewable_view) {

		if (history.pushState) {

			var className = IViewable_view.className();

			try {// needs to be run off a server to work

				history.pushState(
				{
					className: className,

					id: IViewable_view.modelId()
				},

					'',

					className.slice(0, className.length - 4) // pop 'View' from class name
				);

				console.log(history.state);
			}

			catch(e) {

				console.log(e);
			}
		}

	}


	/*----------------------------------------------------------------------------------------
	* Other object initialization (using parameter parsing/constructor 'polymorphism')
	*---------------------------------------------------------------------------------------*/
		
	// none so far
	
};


/*----------------------------------------------------------------------------------------
* Public instance fields (default/shared non-encapsulated data members)
*---------------------------------------------------------------------------------------*/

// none so far



/*----------------------------------------------------------------------------------------
* Public instance methods (on prototype)
*---------------------------------------------------------------------------------------*/

// none so far




/*----------------------------------------------------------------------------------------
* Public class (static) members
*---------------------------------------------------------------------------------------*/
		
// none so far
	

/*----------------------------------------------------------------------------------------
Mix in default methods from implemented interfaces, unless overridden by class or ancestor
*---------------------------------------------------------------------------------------*/

//void app.IInterfaceable.mixInto(app.IInterfaceable, app.Router); // custom 'interface' framework

// none so far