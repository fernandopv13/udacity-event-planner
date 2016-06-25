'use strict';

/* Jasmine.js unit test suite for NavigationWidget class in Meetup Event Planner app.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or funcitonality. UI and other integration testing is done seperately.

*/

describe('class NavigationWidget', function(){
	
	it('inherits from InputWidget', function() {

		expect((new app.NavigationWidget({id: 'nav'})) instanceof app.UIWidget).toBe(true);

		expect(typeof (new app.NavigationWidget({id: 'nav'})).createProduct).toBe('function');

		expect(typeof (new app.NavigationWidget({id: 'nav'})).init).toBe('function');
	});


	it('can create a new instance', function() {
			
		expect((new app.NavigationWidget({id: 'nav'})).constructor).toBe(app.NavigationWidget);
	});

	
	it('can get a singleton instance of itself', function() {

		expect(app.NavigationWidget.instance().constructor).toBe(app.NavigationWidget);

		expect(app.NavigationWidget.instance()).toBe(app.NavigationWidget.instance());
	});
		
	
	describe('instance', function() {
		
		var testFactory;
		
		beforeEach(function() {
			
			// Create a fresh instance to work with
			
			testFactory = new app.NavigationWidget({id: 'nav'});
		});
		
		
		it('can create a new main nav bar', function(){

			var testElement = app.UIWidgetFactory.instance().createProduct('NavigationWidget',
			{
				id: 'nav-main',

				logotype: 'Meetup Planner',

				menuItems: // list of menu items, in order of presentation
				[
					{
						text: 'Account Settings', // link text

						href: '#!Settings', // link URL

						icon: 'settings' // Google Material Design icon name (optional)
					},

					{
						text: 'Account Profile',

						href: '#!Profile',

						icon: 'account_circle'
					},

					{
						text: 'About',

						href: '#!About',

						icon: 'info'
					},

					{
						text: 'Sign Out',

						href: '#!Sign Out',

						icon: 'power_settings_new'
					}
				]
			});

			expect(testElement.constructor).toBe(HTMLDivElement);

			expect(testElement.classList[0]).toBe('navbar-fixed');

			// add more detail later, for now just checking that something was generated
		});


		xit('can initialize a nav bar upon rendering to the DOM', function() {


		});
	});
});