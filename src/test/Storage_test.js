'use strict';

/* Jasmine.js unit test suite for Storage class in meetup even planner application.
*
*  This suite designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('Storage localStorage', function(){
	
	var prefix = 'dk.ulrikgade.udacity.srwebdev.meetup-app.';
		
		beforeEach(function() {
			
			//testMail = new app.Email('test@mail.suite');
		});
	
	
	it('is defined', function() {
		
			expect(window.localStorage).toBeDefined();
	});
	
	
	it('implements the methods of the native localStorage object', function() {
		
		expect(window.localStorage.getItem).toBeDefined();
		
		expect(typeof window.localStorage.getItem).toBe('function');
		
		expect(window.localStorage.key).toBeDefined();
		
		expect(typeof window.localStorage.key).toBe('function');
		
		expect(window.localStorage.setItem).toBeDefined();
		
		expect(typeof window.localStorage.setItem).toBe('function');
		
		expect(window.localStorage.length).toBeDefined();
		
		expect(typeof window.localStorage.length).toBe('number'); // native function uses implicit getter
		
		expect(window.localStorage.removeItem).toBeDefined();
		
		expect(typeof window.localStorage.removeItem).toBe('function');
		
		// Not sure what this.get does in the localStorage polyfill. Leaving it out for now.
	});
	
	
	it('can set and get an item from local storage (by name)', function() {
		
		expect(localStorage.getItem(prefix + 'storageTest')).not.toBe('storageTest');
		
		localStorage.setItem(prefix + 'storageTest', 'storageTest');
		
		expect(localStorage.getItem(prefix + 'storageTest')).toBe('storageTest');
	});
	
	
	it('can remove an item from local storage', function() {
		
		localStorage.setItem(prefix + 'storageTest', 'storageTest');
		
		localStorage.removeItem(prefix + 'storageTest');
		
		expect(localStorage.getItem(prefix + 'storageTest')).toBe(null); // polyfill may return undefined, not null
	});
	
	it('can get the number of items in local storage', function() {
		
		localStorage.setItem(prefix + 'storageTest1', 'storageTest1');
		
		localStorage.setItem(prefix + 'storageTest2', 'storageTest2');
		
		localStorage.setItem(prefix + 'storageTest3', 'storageTest3');
		
		expect(localStorage.length).toBeGreaterThan(2);
		
	});
	
	it('can clear all items out of local storage', function() {
		
		expect(localStorage.length).toBeGreaterThan(0);
		
		localStorage.clear();
		
		expect(localStorage.length).toBe(0);
	});

	
	it('can get a key from local storage by number', function() {
		
		localStorage.clear();
		
		localStorage.setItem(prefix + 'storageTest1', 'storageTest1');
		
		localStorage.setItem(prefix + 'storageTest2', 'storageTest2');
		
		localStorage.setItem(prefix + 'storageTest3', 'storageTest3');
		
		expect(localStorage.key(1)).toBe(prefix + 'storageTest2');
	});
	
	
	afterAll(function() {
		
		localStorage.clear();
	});
	
});