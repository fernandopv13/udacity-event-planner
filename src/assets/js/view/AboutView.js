'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class AboutView extends ModalView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for generic modal dialog (popup) with customizable header and body content.
	*
	* @constructor
	*
	* @param (String) elementId Id of the HTML DOM element the view is bound to
	*
	* @param (String) header Content for the modal header
	*
	* @param (String) body Content for the modal body
	*
	* @author Ulrik H. Gade, May 2016
	*/

	module.AboutView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'AboutView';

		this.ssuper = module.ModalView;
		
		// Initialize instance members inherited from parent class
		
		module.ModalView.call(this, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.AboutView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from View
	*---------------------------------------------------------------------------------------*/

	module.AboutView.prototype = Object.create(module.ModalView.prototype); // Set up inheritance

	module.AboutView.prototype.constructor = module.AboutView; // Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	
	/** (Re)renders modal in UI
	*
	* @param {Object} options JSON object containing (optional) header and body content, and custom 'OK' event handler
	*
	* @return void
	 */

	module.AboutView.prototype.render = function(obj_options) {
	
		var self = this;

		this.ssuper().prototype.render.call(this, 
		{
			header: 'About Meetup Planner',

			body: (function() {

				var container = document.createElement('div');

				container.appendChild(module.View.prototype.createWidget.call(

					this,

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'This app was created by Ulrik H. Gade as an exercise in user-friendly front-end form design for my Senior Web Developer Nanodegree Course at Udacity.com in early 2016.'
					}
				));

				container.appendChild(module.View.prototype.createWidget.call(

					this,

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'However, it has also evolved into a more involved experiment with cross-browser/platform, "classical" object-oriented programming in JavaScript.'
					}
				));
				
				container.appendChild(module.View.prototype.createWidget.call(

					this,

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'Please see the Readme file and the other documentation in my Github repo for more technical details.'
					}
				));

				return container;

			}.bind(this))(),

			ok: 'OK'
		});
	};

})(app);