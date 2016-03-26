'use strict';

/* Jasmine.js test suite for PersoNview class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/

describe('Class PersonView', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testApp, testDoc, testElement, testView, testWindow;
	
	beforeAll(function(done){
		
		testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../dist/index.html'); // test on production version of app

		setTimeout(function() {

			testDoc = testWindow.document;
		
			testApp = testWindow.app;

			testView = testApp.controller.views()['guestView'];

			testElement = testView.$renderContext();

			done();

		}, 500); // wait for page to load
	});
	
	
	// Test generic View features

		it('inherits from FormView', function() {

			expect((new app.PersonView()) instanceof app.FormView).toBe(true);
		});


		it('can render itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.render(new app.Person());

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});
		

		xit('responds to an update() call by rendering itself to the DOM', function() {
			
			// just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(new app.Event(), new app.PersonView());
			
			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('is hidden by default after rendering', function() {
			
			testView.render(new app.Person());

			expect(testElement.hasClass('hidden')).toBe(true);
		});


		it('can show and hide itself', function(done) {
			
			testView.render(new app.Person());

			testView.show(5);

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(5);

			expect(testElement.hasClass('hidden')).toBe(true);

			expect(testElement.css('display')).toBe('none');

			testView.show(5);

			setTimeout(function() {
				
				done();

			}, 25);
		});
		

	// Test presence of UI widgets

		xit('displays the main navigation', function() {
			
			expect(testWindow.$('.navbar-fixed').length).toBe(1);
		});


		it('displays a main heading', function() {
			
			expect($(testElement).find('h4').length).toBe(1);
		});


		it('displays a required name field', function() {
			
			var el = testWindow.$('#guest-name');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).toBe('required');
		});


		it('displays a required email input field', function() {
			
			var el = testWindow.$('input[type=email]');

			expect(el.length).toBe(1);

			expect(el.attr('required')).toBe('required');

			expect(el.data('customValidator')).toBe('EmailInputWidget.prototype.validate');
		});


		it('displays an optional job title field', function() {
			
			var el = testWindow.$('#guest-jobtitle');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional employer field', function() {
			
			var el = testWindow.$('#guest-employer');

			expect(el.length).toBe(1);

			expect(el.attr('type')).toBe('text');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays an optional birthday field', function() {
			
			var el = testWindow.$('#guest-birthday');

			expect(el.length).toBe(1);

			//expect(el.attr('type')).toBe('text');

			expect(el.data('customValidator')).toBe('DateInputWidget.prototype.validate');

			expect(el.attr('required')).not.toBeDefined();
		});


		it('displays a "Cancel" link', function() {
			
			var el = testWindow.$('#guest-form-cancel');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(false);
		});


		it('displays a "Done" button', function() {
			
			var el = testWindow.$('#guest-form-submit');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(true);
		});


	// Test UI behaviours

		it('will not submit the form if there are validation errors in any fields', function() {
			
			testWindow.$('#guest-name').val('');

			expect(app.FormWidget.instance().validate(testWindow.$('#guest-form'))).toBe(false);

			testWindow.$('#guest-form-submit').trigger('mousedown');

			expect(testApp.controller.currentView()).not.toBeDefined();
		});


		xit('submits form when the "Done" button is activated if all fields valididate', function() {
			
			testWindow.$('#guest-name').val('a name');

			testWindow.$('#guest-email').val('fa@wqrq.qwwq');

			expect(app.FormWidget.instance().validate(testWindow.$('#guest-form'))).toBe(true);
			
			testWindow.$('#guest-form-submit').trigger('mousedown');

			expect(testApp.controller.currentView().constructor).toBe(testApp.EventListView);
		});


	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});