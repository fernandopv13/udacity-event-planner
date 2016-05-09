'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public class ModalView extends FormView
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

	module.ModalView = function(str_elementId, str_heading) {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
		// Set temporary literals for use by parent class constructor

		this.className = 'ModalView';

		this.ssuper = module.View;
		
		// Initialize instance members inherited from parent class
		
		module.View.call(this, module.Event, str_elementId, str_heading);
		

		/*----------------------------------------------------------------------------------------
		* Other initialization
		*---------------------------------------------------------------------------------------*/

		this.parentList().push(module.ModalView);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from View
	*---------------------------------------------------------------------------------------*/

	module.ModalView.prototype = Object.create(module.View.prototype); // Set up inheritance

	module.ModalView.prototype.constructor = module.ModalView; // Reset constructor property



	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Closes modal dialog with no further action.
	*
	* Relies on Materialize leanModal so overriding default hide() method in View. 
	*/

	module.ModalView.prototype.hide = function() {

		this.$renderContext().closeModal();
	}


	/** (Re)renders modal in UI
	*
	* @param {Object} options JSON object containing (optional) header and body content, and custom 'OK' event handler
	*
	* @return void
	 */

	module.ModalView.prototype.render = function(obj_options) {

		//console.log('entering ModalView render()'); // debug

		var container; // shorthand reference to inherited temporary container element
			
		// Set up container div
		
			container = this.containerElement(this.createWidget(

				'HTMLElement', // div
				{
					element: 'div',

					attributes: {id: 'modal-view'}, //'aria-hidden': true
					
					classList: ['modal']
				}
			));


		// Add content divs
			
			var contentDiv = this.createWidget( // wrapper

				'HTMLElement',
				{
					element: 'div',

					attributes: {id: 'modal-content'},

					classList: ['modal-content']
				}
			);

			container.appendChild(contentDiv);

			contentDiv.appendChild(this.createWidget( // header

				'HTMLElement',
				{
					element: 'h4',

					attributes: {id: 'modal-header'},

					innerHTML: obj_options && obj_options.header ? obj_options.header : '[Untitled]'
				}
			));

			contentDiv.appendChild(this.createWidget( // content

				'HTMLElement',
				{
					element: 'div',

					attributes: {id: 'modal-body'},

					innerHTML: obj_options && obj_options.body ? obj_options.body : '[No content]'
				}
			));

		// Add footer (OK/Cancel buttons)

			var footerDiv = this.createWidget( // wrapper

				'HTMLElement',
				{
					element: 'div',

					attributes: {id: 'modal-footer'},

					classList: ['modal-footer']
				}
			);

			container.appendChild(footerDiv);

			footerDiv.appendChild(this.createWidget( // cancel button

				'HTMLElement',
				{
					element: 'a',

					attributes: {href: '#!', id: 'modal-cancel'},

					classList: ['modal-action', 'modal-close', 'waves-effect', 'waves-green', 'btn-flat'],

					innerHTML: obj_options && obj_options.cancel_label ? obj_options.cancel_label : 'Cancel'
				}
			));

			var OKbutton = this.createWidget( // OK button

				'HTMLElement',
				{
					element: 'a',

					attributes: {href: '#!', id: 'modal-ok'},

					classList: ['modal-action', 'modal-close', 'waves-effect', 'waves-green', 'btn-flat'],

					innerHTML: obj_options && obj_options.ok_label ? obj_options.ok_label : 'OK'
				}
			);

			$(OKbutton).on('mousedown', this.submit.bind(this)); // attach custom OK event handler

			footerDiv.appendChild(OKbutton);


		// Render to DOM

			this.$renderContext().replaceWith(container);
		
		// Do post-render initialization

			this.$renderContext().leanModal();
	};


	/** Opens modal dialog with whatever contents have been rendered to it most recently.
	*
	* Relies on Materialize leanModel so overriding default show() method in View. 
	*/

	module.ModalView.prototype.show = function() {

		this.$renderContext().openModal(
		{
			/* options provided by Materialize CSS, (defaults are fine for now):
			dismissible: true, // Modal can be dismissed by clicking outside of the modal
			opacity: .5, // Opacity of modal background
			in_duration: 300, // Transition in duration
			out_duration: 200, // Transition out duration
			ready: function() { alert('Ready'); }, // Callback for Modal open
			complete: function() { alert('Closed'); } // Callback for Modal close
			*/
		});
	}


	/** Submits event form to controller if it passes all validations
	*
	* @return {Boolean} true if validation and is succesful, otherwise false
	*
	* @todo Fix host hack
	*/

	module.ModalView.prototype.submit = function(nEvent) {
		
		this.$renderContext().closeModal();

		console.log(nEvent); // debug

		return true;
	};

})(app);