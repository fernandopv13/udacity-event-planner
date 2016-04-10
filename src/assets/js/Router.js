'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class Router
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Manages the browser history so that back/forward navigation
	*
	* works meaningfully despite this being a single-page application.
	*
	* Minimalist implementation to get demo of app up and running. Requires HTML5 capable browser.

	* More comprehensive solution awaits port of the app to Angular.js or similar framework.
	*
	* Does not support deep linking, and is a bit flaky. But will have to do for now.
	*
	* @constructor
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.Router = function() {

	};


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Handles browser history's HTML5 onpopstate event
	*
	* Parses event object and loads app view matching the user's navigation
	*
	* @param {PopStateEvent} event Native browser PopStateEvent
	 */

	module.Router.prototype.onPopState = function(PopStateEvent_e) {

		if (PopStateEvent_e.state && PopStateEvent_e.state.className) { // we're still in the app

			var className = PopStateEvent_e.state.className,

			id = parseInt(PopStateEvent_e.state.id);

			//console.log('popping ' + className); // debug

			switch (className) { // use the MVC protocol to simulate an update from a view

				case 'EventListView':

					module.controller.update(new module.EventListView(), module.Account.registry.getObjectById(id), module.View.UIAction.NAVIGATE);

					break;

				case 'EventView':

					module.controller.update(new module.EventView(), module.Event.registry.getObjectById(id), module.View.UIAction.NAVIGATE);

					break;

				case 'GuestListView':

					module.controller.update(new module.GuestListView(), module.Event.registry.getObjectById(id), module.View.UIAction.NAVIGATE);

					break;

				case 'PersonView':

					module.controller.update(new module.PersonView(), module.Person.registry.getObjectById(id), module.View.UIAction.NAVIGATE);

					break;

				default: // includes AccountProfileView and AccountSettingsView

					module.controller.update(new app[className](), app[className].registry ? app[className].registry.getObjectById(id): null, module.View.UIAction.NAVIGATE);
			}
		}

		// else: users is about to back out of the app
	}


	/** Updates browser history and location bar URL to match user's navigation within the app
	*	
	* @param {View} view The View which has just been made the focus of the app
	*
	*/

	module.Router.prototype.onViewChange = function(View_v) {

		if (history.pushState) {

			var className = View_v.className(), id = View_v.model() ? View_v.model().id() : null;

			try {// needs to be run off a server to work

				if (!history.state || history.state.className !== className) { // don't set state if navigating back

					//console.log('pushing ' + className); // debug

					history.pushState( // state object
					{
						className: className,

						id: id
					},

						'', // title

						'#!' // URL

						+ className.toLowerCase().slice(0, className.length - 4) // pop 'View' from class name

						+ '?id=' + id // add model object id
					);
				}
			}

			catch(e) {

				console.log(e);
			}
		}
	}

})(app);