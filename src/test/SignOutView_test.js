'use strict';

/* Jasmine.js test suite for SignOutView class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/


describe('Class SignOutView', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testModal, testElement;
	
	beforeAll(function(){
		
		void $('#modal-view').remove(); // make sure we have a fresh div

		void $('body').append('<div id="modal-view" class="modal view"></div>');
	});
	
	
	// Test generic class features

		it('inherits from ModalView', function() {

			expect((new app.SignOutView()) instanceof app.ModalView).toBe(true);
		});

		
		it('can be instantiated', function() {

			expect((new app.SignOutView()).constructor).toBe(app.SignOutView);
		});

	
	describe('instance', function() {

		beforeEach(function() {

			testModal = new app.SignOutView('modal-view', 'Delete');

			testElement = $('#modal-view');
		});


		// Test generic View features

			it('provides a complete() method', function() {

				expect(typeof testModal.complete).toBe('function');

				expect(testModal.render).not.toEqual((new app.ModalView()).render);
			});
			

			it('overrides its parent\'s render() method', function() {

				expect(typeof testModal.render).toBe('function');

				expect(testModal.render).not.toEqual((new app.ModalView()).render);
			});


			it('overrides its parent\'s show() method', function() {

				expect(typeof testModal.show).toBe('function');

				expect(testModal.show).not.toEqual((new app.ModalView()).show);
			});


			it('can render itself to the DOM', function() {
				
				// Just testing that something is rendered to its div, check details individually

				testModal.$renderContext().empty();

				expect(testModal.$renderContext().children().length).toBe(0);

				testModal.render();

				expect(testModal.$renderContext().children().length).toBeGreaterThan(0);
			});
			

			it('responds to an update() call by rendering itself to the DOM', function() {
				
				// Just testing that something is rendered to its div, check details individually

				testModal.$renderContext().empty();

				expect(testModal.$renderContext().children().length).toBe(0);

				testModal.update(null, new app.SignOutView());

				expect(testModal.$renderContext().children().length).toBeGreaterThan(0);
			});


			it('is hidden by default after rendering', function() {
				
				testModal.$renderContext().empty();

				testModal.render();

				expect(testModal.$renderContext().css('display')).toBe('none');
			});


			it('can show and hide itself', function(done) {
				
				testModal.$renderContext().empty();

				testModal.render();

				testModal.show({duration: 5});

				expect(testModal.$renderContext().css('display')).toBe('block');

				testModal.hide(5);

				setTimeout(function() {
					
					expect(testModal.$renderContext().css('display')).toBe('none');

					done();

				}, 500);
			});

		
		// Test presence of UI widgets

			it('displays a main heading', function() {
				
				testModal.$renderContext().empty();

				testModal.render();
				
				expect(testElement.children().find('h4').length).toBe(1);
			});


			it('displays one or more paragraphs of text ', function() {
				
				testModal.$renderContext().empty();

				testModal.render();
				
				expect(testElement.children().find('p').length).toBeGreaterThan(0);
			});

			
			it('displays an OK button', function() {
				
				testModal.$renderContext().empty();

				testModal.render();
				
				expect(testElement.children().find('#modal-ok').length).toBe(1);
			});


			it('displays a cancel button', function() {
				
				testModal.$renderContext().empty();

				testModal.render();
				
				expect(testElement.children().find('#modal-cancel').length).toBe(1);
			});

			
		// Test generic UI behaviours

			it('closes (hides) when the user clicks/taps cancel', function(done) {
				
				testModal.$renderContext().empty();

				testModal.render();

				testModal.show(
				{
					duration: 5,

					complete: function() {

						expect(testModal.$renderContext().css('display')).toBe('none');

						done();
					}
				});

				expect(testModal.$renderContext().css('display')).toBe('block');

				testElement.children().find('#modal-cancel').click();
			});

			it('closes (hides) when the user clicks/taps OK', function(done) {
				
				testModal.$renderContext().empty();

				testModal.render();

				testModal.show(
				{
					duration: 5,

					complete: function() {

						expect(testModal.$renderContext().css('display')).toBe('none');

						done();
					}
				});

				expect(testModal.$renderContext().css('display')).toBe('block');

				testElement.children().find('#modal-ok').click();
			});

		afterEach(function() {

			testModal = null; // try to speed upå garbage collection
		});
	});


	afterAll(function() {

		void $('#modal-view').remove();
	});
});