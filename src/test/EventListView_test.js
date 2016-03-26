'use strict';

/* Jasmine.js unit test suite for EventListView class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class EventListView', function(){
	
	var testElement, testView;
	
	beforeAll(function(){
		
		testView = app.controller.views()['eventListView'];

		testElement = testView.$renderContext();
	});


	// Test generic View features

		it('implements the IObservable interface', function() {
			
				expect(app.IInterfaceable.isImplementationOf(app.EventListView, app.IObservable)).toBe(true);
		});


		it('implements the IObserver interface', function() {
			
				expect(app.IInterfaceable.isImplementationOf(app.EventListView, app.IObserver)).toBe(true);
		});


		it('inherits from ListView', function() {

				expect((new app.EventListView()) instanceof app.ListView).toBe(true);
		})


		it('can be instantiated', function() {

			expect((new app.EventListView()).constructor).toBe(app.EventListView);
		});


	/*
	describe('EventListView instance', function() {

		var testAccount, testView;

		beforeEach(function(){

			testAccount = app.data.accounts[0]; // new app.Account(new app.Email('some@server.domain'), new app.Password('ABCD!efgh4'));

			testView = new app.EventListView('event-list', 'Event List View Test');
		});

		
		xit('can render itself into the DOM', function() {

			testElement.empty();

			expect(testElement.children().length).toBe(0);

			testView.render(testAccount);

			expect(testElement.children().first().is('ul')).toBe(true); // a u-list was rendered to the DOM
		});


		xit('can update itself when receiving notification from the controller', function() {


		});

		xit('can respond to being tapped or clicked on', function() {


		});
	});
	*/
});