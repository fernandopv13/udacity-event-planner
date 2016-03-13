/** Slight override of Materialize's forms.js component library, with these aims:
*
* 1. Keep labels active on empty fields that have validation (error) messages,
* lest the typography and spacing get thrown way off.
*
* 2. Remove reliance on element.validity.badInput, as it is not well supported, and
* does not seem to reliably reflect the validation status set with setCustomValidity().
* Use checkValidity() instead.
*
* 3. Enable an optional, custom validator to be run before executing the standard
* response to events captured on a form field. But retain basic idea of managing
* standard event handlers from a central location.
*
* 4. Degrade gracefully on older browsers.
*
* There may be a better way of injecting the custom validation by more directly manipulating
* how events 'bubble', or not, in the browser. But no time to go into that now.
*
* Most of the code is a straight copy from the main Materialize library, with only slight
* modifications. Pulling this excerpt out into separate file to keep main library intact.
* Load this file after the main Materialize library to put the override into effect.
* 
* The original Materialize authors retain all rights to their work, including most of this file,
* and are welcome to incorporate the minor adjustments made free of charge, should they so choose.
*/


(function ($) {
	
	$(document).ready(function() {
 
		// function to run custom validator

		function updateCustomValidity(element) {

			if ($(element).data && typeof $(element).data('customValidator') !== 'undefined') { // field has custom validator attribute

				var fn = $(element).data('customValidator').split('.').reduce(function(obj, ix) {return obj[ix]}, window); // resolve dot string into js reference (w/o resorting to eval()!)

				if (element.setCustomValidity && typeof fn === 'function') { // custom validator is a function

					element.setCustomValidity(fn(element) ? '' : false); // run custom validator and set custom validity based on result
				}
			}
		}

		function setActive(element){

			if ($(element).val().length > 0 // field not empty

				|| element.autofocus // element has focus when form loads

				|| $(this).attr('placeholder') !== undefined // field has placeholder

				|| $(element)[0].checkValidity() === false) // field has validation error
				
				{
					$(element).siblings('label, i').addClass('active'); // set label 'active'
				}

			else {
			
				$(element).siblings('label, i').removeClass('active'); // set label not 'active'
			}
		}



		// Function to set text field labels 'active', or not.
		// Run once on $(document).ready(), then call manually in the FormView's custom onLoad handler
		
		Materialize.updateTextFields = function(element) {

			console.log(element);

			var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
			
			input_selector += ', input[type="datetime-local"]'; // not strictly speaking a text field, but we want the same behaviour re. this function

			if (element) {

				updateCustomValidity(element); // run custom validator, if any

				validate_field($(element)); // set CSS validation state and active classes
			}

			else {

				$(input_selector).each(function(index, element) {
					
					updateCustomValidity(element); // run custom validator, if any

					validate_field($(element)); // set CSS validation state and active classes
				});
			}
		};


		// Text based inputs

		var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';

		input_selector += ', input[type="datetime-local"]'; // not strictly speaking a text field, but we want the same behaviour re. this function
		
		
		// Add 'active' when element has focus
		
		$(document).off('focus', input_selector); // block/override main library by unregistering its event handlers
		
		$(document).on('focus', input_selector, function () {
			
			$(this).siblings('label, i').addClass('active');//console.log('focus'); // debug
		});

		
		// Conditionally remove active when element loses focus.
		// We especially want to keep the element active when it displays an error message,
		// or else the typography and location of the error message go way off.
		// Ideally this could better be handled in CSS. But I have given up on disentangling
		// the behaviours of the label and error message using only CSS, at least for now.

		$(document).off('blur', input_selector); // block blur handlers

		
		// Remove 'active' CSS label class, unless we don't

		// Attaching to the global object has the potential drawback of not allowing for separate,
		// more complex validation before this code is run (global handlers seem to execute first).
		// But it may be necessary for the code to work across all devices to be investigated.

		$(document).on('blur', input_selector, function () {
			
			var $inputElement = $(this);

			updateCustomValidity($inputElement[0]);//.id); // run custom validator, if any

			//setActive($inputElement[0]); // set/remove 'active' class on label

			
			/*
			if ($inputElement.val().length === 0 // field is empty

				&& $inputElement[0].checkValidity() === true // field has no validation errors

				&& $inputElement.attr('placeholder') === undefined) { // field has no placeholder text
				
				$inputElement.siblings('label, i').removeClass('active'); // remove 'active' class

				$inputElement.siblings('i').removeClass('active'); // does this do anything different than the previos line?
			}
			*/

			/* Moved up the one line here that didn't seem redundant
			if ($inputElement.val().length === 0

				&& $inputElement[0].checkValidity() === true

				&& $inputElement.attr('placeholder') !== undefined) {
				
					$inputElement.siblings('i').removeClass('active');
			}
			*/

			validate_field($inputElement); // 
		});


	
		/* Toggle 'valid' and 'invalid' CSS classes depending on validation state */ 

		window.validate_field = function(object) {
			
			var hasLength = object.attr('length') !== undefined;
			
			var lenAttr = parseInt(object.attr('length'));
			
			var len = object.val().length;

			
			if (object.val().length === 0 && object[0].checkValidity() === true) { // empty with no errors
				
				if (object.hasClass('validate')) { // wants validation
					
					// console.log('1: remove both'); // debug

					object.removeClass('valid'); // default presentation
					
					object.removeClass('invalid');
				}
			}

			else {

				if (object.hasClass('validate')) {
					
					// Check for character counter attributes
					
					if ((object.is(':valid') && hasLength && (len <= lenAttr)) || (object.is(':valid') && !hasLength)) {
						
						//console.log('2: mark textarea valid?'); // debug
						
						object.removeClass('invalid');
						
						object.addClass('valid');
					}
					
					else {
						
						//console.log('3: mark textarea invalid'); // debug
						
						object.removeClass('valid');
						
						object.addClass('invalid');
					}
				}
			}

			setActive(object);
		};
	}); // End of $(document).ready

}( jQuery ));
