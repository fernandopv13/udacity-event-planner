'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class ClassName
******************************************************************************/

var app = app || {};


/** @classdesc Manages the browser history so that back/forward navigation
*
* works meaningfully despite this being a single-page application.
*
* Minimalist implementation to get demo of app up and running. Requires HTML5 capable browser.

* More comprehensive solution awaits port of the app to Angular.js or similar framework.
*
* For now, does not support deep linking.
*
* @constructor
*
* @author Ulrik H. Gade, February 2016
*/

app.Router = function() {

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

app.Router.prototype.onPopState = function(PopStateEvent_event) {

	if (PopStateEvent_event.state && PopStateEvent_event.state.className) { // we're still in the app

		var className = PopStateEvent_event.state.className,

		id = PopStateEvent_event.state.id;

		console.log('popped: ' + className + ', ' + id);

		switch (className) {

			case 'AccountProfileView':

				window.history.back();

				break;

			case 'AccountSettingsView':

				window.history.back();

				break;

			case 'EventListView':

				app.controller.onAccountSelected(id);

				break;

			case 'EventView':

				app.controller.onEventSelected(id);

				break;

			case 'GuestListView':

				app.controller.onGuestListSelected(id);

				break;

			case 'PersonView':

				app.controller.onGuestSelected(id);

				break;
		}
	}

	// else: users is about to back out of the app
}


/** Updates browser history and location bar URL to match user's navigation within the app
*	
* @param {View} view The View which has just been made the focus of the app
*
*/

app.Router.prototype.onViewChange = function(View_view) {

	if (history.pushState) {

		var className = View_view.className, id = View_view.model.id();

		try {// needs to be run off a server to work

			if (!history.state || history.state.className !== className) { // don't set state if navigating back

				history.pushState(
				{
					className: className,

					id: id
				},

					'',

					'#!'

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