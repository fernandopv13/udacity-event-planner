'use strict'; // Not in functions to make it easier to remove by build process

/**********************************************************************************************
* public class FrontPageView extends View
**********************************************************************************************/

var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc View class for displaying app's front page.
	*
	* @constructor
	*
	* @extends View
	*
	* @author Ulrik H. Gade, March 2016
	*/

	module.FrontPageView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'FrontPageView';

		this.ssuper = module.View;

		
		// Initialize instance members inherited from parent class
		
		module.View.call(this, null, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.FrontPageView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from View
	*---------------------------------------------------------------------------------------*/	

	module.FrontPageView.prototype = Object.create(module.View.prototype); // Set up inheritance

	module.FrontPageView.prototype.constructor = module.FrontPageView; //Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (beyond accessors)
	*---------------------------------------------------------------------------------------*/

	/** Renders front page.
	*
	* Front page is pure navigation. It is not bound to any model, nor to the controller.
	*
	* @return void
	*/

	module.FrontPageView.prototype.render = function() {

		var containerDiv, buttonElement, linkElement;
			
		this.$renderContext().empty();

		
		// Add heading
			
			containerDiv =  this.createElement( // inner div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			this.$renderContext().append(containerDiv);

			
			containerDiv.appendChild(this.createElement({

				element: 'h4',

				innerHTML: this.heading()
			}));

		
		// Add logo and teaser

			containerDiv =  this.createElement( // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			this.$renderContext().append(containerDiv);

			
			containerDiv.appendChild(this.createElement(
			{
				element: 'img',

				attributes: {src: 'assets/img/logo.png', alt: 'Logo'}
			}));

			containerDiv.appendChild(this.createElement(
			{
				element: 'p',

				innerHTML: 'The awesomest place for all your event planning'
			}));

		
		// Add sign-up button

			containerDiv =  this.createElement( // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			this.$renderContext().append(containerDiv);

			
			containerDiv.appendChild(this.createElement({ // button
				
				element: 'a',
				
				attributes: {id: 'front-page-sign-up', role: 'button'},
				
				classList: ['waves-effect', 'waves-light', 'btn', 'right-align'],

				innerHTML: 'Sign Up'
			}));


		// Add sign-in link

			containerDiv =  this.createElement( // div
			{
				element: 'div',			
				
				classList: ['row', 'center-align']
			});

			this.$renderContext().append(containerDiv);


			containerDiv.appendChild(this.createElement(
			{
				element: 'p',

				innerHTML: 'or'
				
			}));

			
			containerDiv.appendChild(this.createElement({ // link
				
				element: 'a',
				
				attributes: {id: 'front-page-sign-in', role: 'button'},
				
				innerHTML: 'Sign In'
			}));
		
		// (Re)assign event handlers to form elements

			$('#front-page-sign-up').click(function(event) { // go to sign-up view

				this.notifyObservers(new module.SignUpView(), null, module.View.UIAction.NAVIGATE);

				//Materialize.toast('Sign up is not implemented in this demo. Sorry.', 4000)

			}.bind(this));


			$('#front-page-sign-in').click(function(event) { // go to sign-up view

				this.notifyObservers(new module.SignInView(), null, module.View.UIAction.NAVIGATE);

			}.bind(this));
	};

	module.FrontPageView.prototype.update = function() {

		this.render();
	}

})(app);