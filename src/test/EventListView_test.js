'use strict';

/* Jasmine.js unit test suite for EventListView class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class EventListView', function(){
	
	it('implements the IObserver interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.EventListView, app.IObserver)).toBe(true);
	});


	it('implements the IViewable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.EventListView, app.IViewable)).toBe(true);
	});
	

	it('can be instantiated', function() {

		expect((new app.EventListView()).constructor).toBe(app.EventListView);
	});


	describe('EventListView instance', function() {

		var testAccount, testView;

		beforeEach(function(){

			testAccount = new app.Account('Test event');

			testView = new app.EventListView(testAccount);
		});

		
		xit('can render itself into list item format', function() {

			var el = testView.render();
			
			expect(el.constructor).toBe(HTMLLIElement);

			expect(el.classList[0]).toBe('collection-item');

			expect(el.firstChild.constructor).toBe(HTMLDivElement);

			expect(el.firstChild.lastChild.constructor).toBe(HTMLAnchorElement);
		});


		xit('can update its UI presentation when receiving notification from the controller', function() {


		});

		xit('can respond to being tapped or clicked on', function() {


		});
	});
});