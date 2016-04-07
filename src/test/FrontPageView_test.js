'use strict';

/* Jasmine.js test suite for FrontPageView class in Meetup Event Planner app.
*
* These tests combine unit tests of the class itself and integration tests of the UI it represents.
* The suite is therefore dependent on the other, non-View classes of tha app performning correctly,
* and should only by run after these have been tested individually.
*
*/

jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000;


describe('Class FrontPageView', function(){
	
	/* This code only works if testsuite and app are both loaded from the same server.
	*  Localhost is also OK, but file:// throws CORS related security error
	*/
	
	var testApp, testDoc, testElement, testView, testWindow;
	
	beforeAll(function(done){
		
		testWindow = window.open('../index.html'); // test on development version of app

		//testWindow = window.open('../../dist/index.html'); // test on production version of app

		setTimeout(function() {

			testWindow.app.controller.views()['frontPageView'].hide(5);

			testDoc = testWindow.document;
		
			testApp = testWindow.app;

			testView = testApp.controller.views()['frontPageView'];

			testElement = testView.$renderContext();

			done();

		}, 2000); // wait for page to load
	});
	
	
	// Test generic class features

		it('inherits from View', function() {

			expect((new app.SignInView()) instanceof app.View).toBe(true);
		});

		
		it('implements the IObservable interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.SignInView, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {
			
			expect(app.IInterfaceable.isImplementationOf(app.SignInView, app.IObserver)).toBe(true);
		});


		it('can be instantiated', function() {

			expect((new app.SignInView()).constructor).toBe(app.SignInView);
		});


	// Test generic View features

		it('can render itself to the DOM', function() {
			
			// Just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.render();

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('responds to an update() call by rendering itself to the DOM', function() {
			
			// just testing that something is rendered to its div, check details individually

			testView.$renderContext().empty();

			expect(testView.$renderContext().children().length).toBe(0);

			testView.update(null, new testApp.FrontPageView());

			expect(testView.$renderContext().children().length).toBeGreaterThan(0);
		});


		it('can show and hide itself', function(done) {
			
			testView.show(5);

			expect(testElement.hasClass('hidden')).toBe(false);

			expect(testElement.css('display')).toBe('block');

			testView.hide(5);

			expect(testElement.hasClass('hidden')).toBe(true);

			expect(testElement.css('display')).toBe('none');

			testView.show(5);

			setTimeout(function() {
				
				done();

			}, 1000);
		});

	
	// Test presence of UI widgets

		it('does not display the main navigation', function() {
			
			expect(testWindow.$('#nav-main').length).toBe(0);
		});


		it('displays a main heading', function() {
			
			expect(testElement.children().find('h4').length).toBe(1);
		});


		it('displays a logo', function() {
			
			var ret = false;

			testElement.children().find('img').each(function(ix, el){

				if ($(el).attr('src').indexOf('logo.png') > -1) {

					ret = true;
				}
			});

			expect(ret).toBe(true);
		});


		it('displays a catchphrase after the logo', function() {
			
			var logoElement;

			testElement.children().find('img').each(function(ix, el){

				if ($(el).attr('src').indexOf('logo.png') > -1) {

					logoElement = el;
				}
			});

			expect($(logoElement).next().is('p')).toBe(true);
		});


		it('displays a "Sign Up" button', function() {
			
			var el = testElement.children().find('#front-page-sign-up');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(true);
		});
		

		it('displays a "Sign In" link', function() {
			
			var el = testElement.children().find('#front-page-sign-in');

			expect($(el).is('a')).toBe(true);

			expect($(el).attr('role')).toBe('button');

			expect($(el).hasClass('btn')).toBe(false);
		});

	
	// Test UI behaviours

		it('navigates to the Sign Up view when the "Sign Up" button is activated', function() {
			
			testElement.children().find('#front-page-sign-up').trigger('mousedown');

			expect(testApp.controller.currentView().constructor).toBe(testApp.SignUpView);
		});


		it('navigates to the Sign In view when the "Sign In" link is activated', function() {
			
			testElement.children().find('#front-page-sign-in').trigger('mousedown');

			expect(testApp.controller.currentView().constructor).toBe(testApp.SignInView);
		});

	
	afterAll(function() {

		testWindow.close();

		testWindow = null;
	});
});