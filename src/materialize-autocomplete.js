// https://jsfiddle.net/ypcrumble/ht379nq5/


$('document').ready(function() {

	var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';


	/**************************
	 * Auto complete plugin*
	 *************************/


	$(input_selector).each(function() {

		var $input = $(this);

		if ($input.hasClass('autocomplete')) {

			// Perform search
			
			$(document).on('keyup', $input, function() {
				
				var $val = $input.val().trim(), $select = $('.autocomplete-content');
				
				// Check if the input isn't empty
				
				$select.css('width', $input.width());

				if ($val != '') {
					
					$select.children('li').addClass('hide');
					
					$select.children('li').filter(function() {
						
						$select.removeClass('hide'); // Show results

						return $(this).text().toLowerCase().indexOf($val.toLowerCase()) === 0;

					}).removeClass('hide');

				} else {

					$select.children('li').addClass('hide');
				}
			});

			// Set input value
			
			$('.autocomplete-option').click(function() {
				
				$input.val($(this).text().trim());
				
				$('.autocomplete-option').addClass('hide');
			});
		}
	});
});
