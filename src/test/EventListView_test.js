'use strict';

/* Jasmine.js unit test suite for EventListView class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class EventListView', function(){
	
	it('implements the IObservable interface', function() { // uses Interface.js
		
			expect(app.InterfaceTester.isImplementationOf(app.EventListView, app.IObservable)).toBe(true);
	});


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

			testAccount = new app.Account(new app.Email('some@server.domain'), new app.Password('ABCD!efgh4'));

			testView = new app.EventListView(testAccount);
		});

		
		it('can render itself into the DOM', function() {

			var $list = $('#event-list');

			$list.empty();

			expect($list.children().first().is('ul')).toBe(false);

			testView.render(testAccount);

			expect($list.children().first().is('ul')).toBe(true); // a u-list was rendered to the DOM
		});


		xit('can update itself when receiving notification from the controller', function() {


		});

		xit('can respond to being tapped or clicked on', function() {


		});
	});
});