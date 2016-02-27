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

app.Router.prototype.onPopState = function(PopStateEvent_e) {

	if (PopStateEvent_e.state && PopStateEvent_e.state.className) { // we're still in the app

		var className = PopStateEvent_e.state.className,

		id = parseInt(PopStateEvent_e.state.id);

		//console.log('popped: ' + className + ', ' + id);

		switch (className) {

			case 'AccountProfileView':

				window.history.back();

				break;

			case 'AccountSettingsView':

				window.history.back();

				break;

			case 'EventListView':

				app.controller.update([new app.EventListView(), app.Account.registry.getObjectById(id), app.View.UIAction.NAVIGATE]);

				//app.controller.onAccountSelected(app.Account.registry.getObjectById(id));

				break;

			case 'EventView':

				app.controller.update([new app.EventView(), app.Event.registry.getObjectById(id), app.View.UIAction.NAVIGATE]);

				//app.controller.onEventSelected(app.Event.registry.getObjectById(id));

				break;

			case 'GuestListView':

				app.controller.update([new app.GuestListView(), app.Event.registry.getObjectById(id), app.View.UIAction.NAVIGATE]);

				//app.controller.onGuestListSelected(app.controller.selectedEvent());

				break;

			case 'PersonView':

				app.controller.update([new app.PersonView(), app.Person.registry.getObjectById(id), app.View.UIAction.NAVIGATE]);

				//app.controller.onGuestSelected(app.Person.registry.getObjectById(id));

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

app.Router.prototype.onViewChange = function(View_v) {

	if (history.pushState) {

		var className = View_v.className(), id = View_v.model().id();

		try {// needs to be run off a server to work

			if (!history.state || history.state.className !== className) { // don't set state if navigating back

				//console.log('pushing: ' + className + ', ' + id);

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

			/*
			else {

				console.log('did not push');
			}
			*/
		}

		catch(e) {

			console.log(e);
		}
	}
}