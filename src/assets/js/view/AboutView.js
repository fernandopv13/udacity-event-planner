'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class AboutView extends ModalView
******************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for generic modal dialog (popup) with customizable header and body content.
	*
	* @requires jQuery
	*
	* @extends ModalView
	*
	* @constructor
	*
	* @param {String} elementId Id of the HTML DOM element the view is bound to
	*
	* @param {String} header Content for the modal header
	*
	* @param {String} body Content for the modal body
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
	* Inherit from ModalView
	*---------------------------------------------------------------------------------------*/

	module.AboutView.prototype = Object.create(module.ModalView.prototype); // Set up inheritance

	module.AboutView.prototype.constructor = module.AboutView; // Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	
	/** (Re)renders modal into DOM
	*
	* @param {Object} options JSON object containing (optional) header and body content, and custom 'OK' event handler
	*
	* @return void
	 */

	module.AboutView.prototype.render = function(obj_options) {
	
		var self = this, options = obj_options || {};

		$.extend(options,
		{
			header: 'About Meetup Planner',

			body: (function() {

				var container = document.createElement('div');

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'img',

						attributes:
						{
							src: 'assets/img/ulrik.jpg',

							alt: 'Ulrik H. Gade'
						},

						classList: ['circle', 'about-portrait']
					}
				));

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'Hi, I\'m Ulrik H. Gade.'
					}
				));
				
				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'I created this app in early 2016 as an exercise in user-friendly front-end form design for my Senior Web Developer Nanodegree course at Udacity.com.'
					}
				));

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'I also used the app to experiment with cross-browser/platform, "classical" object-oriented programming in JavaScript, as well as modern build and testing tools. This ended up getting as involved as it was educational.'
					}
				));
				
				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'Please see the source code, Readme file and the other documentation in my Github repo for more technical details.'
					}
				));

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'Or, if you\'re not into the techie stuff, just have fun with the app.'
					}
				));

				container.appendChild(self.createWidget(

					'HTMLElement',
					{
						element: 'p',

						//id: 'about-intro',

						innerHTML: 'But don\'t use it for anything serious: this is a study project, not a commercial-grade service.'
					}
				));

				return container;

			})(),

			ok: 'OK, got it'
		});

		this.ssuper().prototype.render.call(this, options);
	};

})(app);