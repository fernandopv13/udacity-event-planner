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
	* @author Ulrik H. Gade, June 2016
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

		var view, className, id;

		//console.log(PopStateEvent_e);

		if (PopStateEvent_e.state === null) { //console.log('handle redundant null request (from ModalView)');

			if (history.state === null) { //console.log('replace redundant null entry in browser history');

				view = module.controller.currentView();

				className = view ? view.className() : null;

				id = view && view.model() ? view.model().id(): null;

				//console.log(history.state);

				history.replaceState( // state object
				{
					className: className,

					id: id
				},

					'', // title

					'#!' // URL

					+ className.toLowerCase().slice(0, className.length - 4) // pop 'View' from class name

					+ '?id=' + id // add model object id
				);

				//console.log(history.state);

				/*DEPRECATED: Solved by using replaceState
				if (!(module.device().isiOS() && module.device().isChrome())) { //console.log('browser is not iOS Chrome');

					// When popping a null entry, iOS Chrome seems to also pop the next item on the stack, causing

					// the browser to navigate too far back (e.g. so we're taken back to sign in right after signing in!).

					// Skipping this step means it will sometimes be necessary to activate navigation twice (e.g. form submit) 

					// before it takes effect. There seems to be no way around this compromise without resorting to

					// 3rd party polyfills (e.g. History.js), which I would rather avoid in this project (need to wrap it up).

					console.log('removing redundant null entry');

					history.back();
				}
				*/
			}
		}

		else { // navigate to requested View

			className = PopStateEvent_e.state.className;

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
	}


	/** Updates browser history and location bar URL to match user's navigation within the app
	*	
	* @param {View} view The View which has just been made the focus of the app
	*
	*/

	module.Router.prototype.onViewChange = function(View_v) {

		if (history.pushState) { // only works in browsers that support the History API

			var className = View_v.className(), id = View_v.model() ? View_v.model().id() : null;

			try {// needs to be run off a Web server to work

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

					//console.log('pushed ' + history.state.className);
				}

				/*
				else {

					console.log('ignoring ' + (history.state ? history.state.className : history.state));
				}
				*/
			}

			catch(e) {

				console.log(e);
			}
		}
	}

})(app);