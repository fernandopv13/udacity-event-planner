'use strict'; // Not in functions to make it easier to remove by build process

/******************************************************************************
* public abstract class InputWidget extends UIWidget
******************************************************************************/

var app = app || {};


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/** @classdesc Abstract base class for the abstract factory method pattern used to create and manage UIwidgets.
	*
	* Represents widgets in a form that take data input from users.
	*
	* @abstract
	*
	* @constructor
	*
	* @extends UIWidget
	*
	* @author Ulrik H. Gade, June 2016
	*
	* @return {InputWidget} Not supposed to be instantiated, except when setting up inheritance in subclasses (concrete products)
	*/

	module.InputWidget = function() {

		/*----------------------------------------------------------------------------------------
		* Call (chain) parent class constructor
		*---------------------------------------------------------------------------------------*/
		
			// Set temporary literals for use by parent class constructor (unless already defined in calling class)

			this.type = this.type || 'InputWidget';

			this.ssuper = module.InputWidget; // All derived classes has InputWidget as super, so set here

			
			// Initialize instance members inherited from parent class
			
			module.UIWidget.call(this);
	};

	/*----------------------------------------------------------------------------------------
	* Inherit from UIWidget
	*---------------------------------------------------------------------------------------*/	
	
	module.InputWidget.prototype = Object.create(module.UIWidget.prototype); // Set up inheritance

	module.InputWidget.prototype.constructor = module.InputWidget // Reset constructor property


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

	/** Adds autocomplete to input widget.
	*
	* Uses HTML5 datalist when available, custom list design when not.
	*
	* Custom list gneration inspired by example at https://jsfiddle.net/ypcrumble/ht379nq5/.
	*
	* @param {HTMLInputELement} element The input element to be augmented with an autocomplete feature.
	*
	* @param {Array} options A flat array of strings to be used as autocomplete list options
	*
	* @return {void}
	*
	* @todo Invert logic to show all suggestions by default, then narrow down in response to user entries (tried blur on input, but prematurely closes list when making selection)
	*/

	module.InputWidget.prototype.addAutocomplete = function(HTMLInputElement, arr_options) {

		var $input = $(HTMLInputElement),

		id = $input.attr('id') + '-suggest',

		listElement, option, spanElement;


		if (Modernizr.input.list && !module.device().isiOS()) { // datalist available, so use it

			void $input.parent().find('datalist').remove(); // remove existing lists, if any

			listElement = document.createElement('datalist');

			listElement.id = id

			listElement.setAttribute('role', 'list');

			arr_options.forEach(function(value) {

				option = document.createElement('option');

				option.value = value;

				option.innerHTML = value;

				option.setAttribute('role', 'listitem');

				listElement.appendChild(option);
			});

			$input.attr('list', id);
		}

		else { // create custom list

			void $input.parent().find('ul').remove(); // remove existing lists, if any

			listElement = document.createElement('ul');

			listElement.id = id;

			listElement.setAttribute('role', 'list');

			listElement.classList.add('autocomplete-content');

			arr_options.forEach(function(value) {

				option = document.createElement('li');

				option.classList.add('autocomplete-option');

				//option.classList.add('hide');

				option.setAttribute('role', 'listitem');

				spanElement = document.createElement('span');

				spanElement.innerHTML = value;

				option.appendChild(spanElement);

				listElement.appendChild(option);

				$(option).click(function() { // set input to content of selected option

					$input.val($(this).text().trim());

					Materialize.updateTextFields($input); // get Materialize to mark label as active w/o reopening suggestions
				
					$('.autocomplete-option').addClass('hide');
				});
			});

			$input.blur(function() { // hide list after delay to allow capture of option selection

				setTimeout(function() {

					listElement.classList.add('hide');

				}, 200);
				
			});

			$input.on('keyup', function() { // filter suggestions based on user input

				var $val = $input.val().trim();
				
				if ($val !== '') {
					
					$(listElement).children('li').addClass('hide');
					
					$(listElement).children('li').filter(function() { // match options to user's entry
						
						return $(this).text().toLowerCase().indexOf($val.toLowerCase()) === 0;

					}).removeClass('hide');

				} else {

					$(listElement).children('li').addClass('hide');
				}
			});
		}

		$input.parent().append(listElement);
	};


	/** Initializes InputWidget upon rendering it into the HTML DOM.
	*
	* Sets default error message, then passes call up the inheritance chain to UIWidget.
	*
	* (ssuper only works one level up from the 'lowest' derived class, so must pass manually.)
	*
	*/

	module.InputWidget.prototype.init = function(View_v, str_id, obj_options) {
		
		var label = $('#' + str_id + '-label')[0];

		// can't get setting to work with jQuery data(), so going old school

		label.dataset.error_default = label.dataset.error;

		module.UIWidget.prototype.init(View_v, str_id, obj_options);
	};
	

	/** Sets custom error message on input field (technically, on its label) if
	*
	* provided with the expected two params, or reset to default.
	*
	* @param {HTMLInputELement} e The input to be validated.
	*
	* @param {String} msg The error message to display, or null to reset to default
	*
	* @return {void}
	*/

	module.InputWidget.prototype.setErrorMessage = function(HTMLInputElement_e, str_msg) {

		var label = document.getElementById($(HTMLInputElement_e).attr('id') + '-label');

		// can't get setting to work with jQuery data(), so going old school

		label.dataset.error = str_msg !== null ? str_msg : label.dataset.error_default;
	};


	/** Performs custom validation of input field beyond what can be acheived using the
	*
	* HTML5 constraint validation API. Validation is specific to the type of input, so each
	*
	* subclass of InputWidget must have its own implementation.
	*
	* @abstract
	*
	* @param {HTMLInputELement} e The input to be validated.
	*
	* @return {Boolean} true if validation is succesful, otherwise false.
	*
	* @throws {AbstractMethodError} If invoked directly on InputWidget (must be realized by subclasses)
	*/

	module.InputWidget.prototype.validate = function(HTMLInputElement_e) {

		throw new AbstractMethodError('validate() must be realized by subclasses');
	};

})(app);