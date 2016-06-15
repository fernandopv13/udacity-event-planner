'use strict';

/* Jasmine.js test suite for AboutView class in Meetup Event Planner testApp.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/


describe('Class AboutView', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testApp, testDoc, testElement, testModal, testView, testWindow;
	
	beforeAll(function(done){

		testWindow = window.open(app.testutil.testTarget);

		setTimeout(function() {

			testApp = testWindow.app;

			testApp.controller.views().frontPageView.hide(5);

			testDoc = testWindow.document;
			
			testApp = testWindow.app;

			//app.testutil.resetTestData(testApp);

			testView = testApp.controller.views().eventListView;

			testElement = testView.$renderContext();

			void testWindow.$('#modal-view').remove(); // make sure we have a fresh div

			void testWindow.$('body').append('<div id="modal-view" class="modal view"></div>');

			done();

		}, app.testutil.pageLoadDelay); // wait for page to load		
	});
	
	
	// Test generic class features

		it('inherits from ModalView', function() {

			expect((new testApp.AboutView()) instanceof testApp.ModalView).toBe(true);
		});

		
		it('can be instantiated', function() {

			expect((new testApp.AboutView()).constructor).toBe(testApp.AboutView);
		});

	
	describe('instance', function() {

		beforeEach(function() {

			testModal = new testApp.AboutView('modal-view', 'About Test');

			testElement = testWindow.$('#modal-view');
		});


		// Test generic View features

			it('overrides its parent\'s render() method', function() {

				expect(typeof testModal.render).toBe('function');

				expect(testModal.render).not.toEqual((new testApp.ModalView()).render);
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

				testModal.update(null, new testApp.AboutView());

				expect(testModal.$renderContext().children().length).toBeGreaterThan(0);
			});


			it('is hidden by default after rendering', function() {
				
				testModal.$renderContext().empty();

				testModal.render();

				expect(testModal.$renderContext().css('display')).toBe('none');
			});


			/*DEPRECATED
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
			*/

			it('can show itself', function(done) {
				
				testModal.$renderContext().empty();

				testModal.render();

				testModal.show(
				{
					done: function() {
						
						//console.log('done');

						expect(this.$renderContext().css('display')).toBe('block');

						done();
						
					}.bind(testModal),

					duration: 5
				});

				expect(true).toBe(true); // Jasmine may not see expect in block
			});


			it('can hide itself', function(done) {
				
				testModal.$renderContext().empty();

				testModal.render();

				testModal.hide(
				{
					complete: function() {

						//console.log('complete');

						expect(this.$renderContext().css('display')).toBe('none');

						done();

					}.bind(testModal),

					duration: 5
				});

				expect(true).toBe(true); // Jasmine may not see expect in block
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


			it('does not display a cancel button', function() {
				
				testModal.$renderContext().empty();

				testModal.render();
				
				expect(testElement.children().find('#modal-cancel').length).toBe(0);

			});

			
		// Test UI behaviours

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

		void testWindow.close();

		testApp = testDoc = testElement = testModal = testView = testWindow = null;
	});
});