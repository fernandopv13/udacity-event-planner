'use strict';

/* Jasmine.js unit test suite for EventView class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class EventView', function(){
	
	it('implements the IObservable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.EventView, app.IObservable)).toBe(true);
	});

	it('implements the IObserver interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.EventView, app.IObserver)).toBe(true);
	});


	it('implements the IViewable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.EventView, app.IViewable)).toBe(true);
	});
	

	it('can be instantiated', function() {

		expect((new app.EventView()).constructor).toBe(app.EventView);
	});


	describe('EventView instance', function() {

		var testEvent, testView;

		beforeEach(function(){

			testEvent = new app.Event('Test event');

			testView = new app.EventView(testEvent);
		});

		
		xit('can render itself into list item format', function() {

			var el = testView.render();
			
			expect(el.constructor).toBe(HTMLLIElement);

			expect(el.classList[0]).toBe('collection-item');

			expect(el.firstChild.constructor).toBe(HTMLDivElement);

			expect(el.firstChild.lastChild.constructor).toBe(HTMLAnchorElement);
		});


		xit('can update its UI presentation when receiving notification from its data model', function() {


		});

		xit('can respond to being tapped or clicked on', function() {


		});
	});
});