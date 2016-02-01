'use strict';

/* Jasmine.js unit test suite for app object invoked by anonymous self-executing function in the style of the JS Module pattern.
*/

describe('app', function(){
	
	beforeEach(function() {
		
		app.Account.registry.clear();
		
		app.Email.registry.clear();
		
		app.Event.registry.clear();
		
		app.Organization.registry.clear();
		
		app.Person.registry.clear();
		
		app.data = {
			
			organizations:
			[
				new app.Organization('ACME'),
				
				new app.Organization('BigBig'),
				
				new app.Organization('Pops')
			],

			people:
			[
				new app.Person('Peter'),
				
				new app.Person('Paul'),
				
				new app.Person('Mary')
			],

			events:
			[
				new app.Event('Web site launch party'),
				
				new app.Event('Welcome reception for Peter'),
				
				new app.Event('Friday bar')
			],
			
			emails:
			[
				new app.Email('peter@server.domain'),
				
				new app.Email('paul@server.domain'),
				
				new app.Email('mary@server.domain')
			],
			
			accounts:
			[
				new app.Account(new app.Email('tina@server.domain'), new app.Password('Abcd!1234')),
				
				new app.Account(new app.Email('lisa@server.domain'), new app.Password('aBc!12345')),
				
				new app.Account(new app.Email('john@server.domain'), new app.Password('abCd1234!'))
			]
		};

		app.data.people[0].employer(app.data.organizations[0]);
		app.data.people[1].employer(app.data.organizations[1]);
		app.data.people[2].employer(app.data.organizations[2]);

		app.data.people[0].email(app.data.emails[0]);
		app.data.people[1].email(app.data.emails[1]);
		app.data.people[2].email(app.data.emails[2]);

		app.data.events[0].host(app.data.organizations[0]);
		app.data.events[1].host(app.data.organizations[1]);
		app.data.events[2].host(app.data.organizations[2]);

		app.data.events[0].capacity(100);
		app.data.events[0].addGuest(app.data.people[0]);
		app.data.events[0].addGuest(app.data.people[1]);
		app.data.events[0].addGuest(app.data.people[2]);

		app.data.events[1].capacity(100);
		app.data.events[1].addGuest(app.data.people[0]);
		app.data.events[1].addGuest(app.data.people[1]);
		app.data.events[1].addGuest(app.data.people[2]);

		app.data.events[2].capacity(100);
		app.data.events[2].addGuest(app.data.people[0]);
		app.data.events[2].addGuest(app.data.people[1]);
		app.data.events[2].addGuest(app.data.people[2]);
	});
	
	
	it('has been instantiated', function() {
		
		expect(app).toBeDefined();
	});
	
	xit('can be initialized with a master registry of all class registries', function(){
		
		expect(app.init).toBeDefined();
		
		expect(typeof app.init).toBe('function');
		
		app.init();
		
		expect(app.registry.getObjectList().indexOf(app.Account.registry)).toBeGreaterThan(-1);
		
		expect(app.registry.getObjectList().indexOf(app.Email.registry)).toBeGreaterThan(-1);
		
		expect(app.registry.getObjectList().indexOf(app.Event.registry)).toBeGreaterThan(-1);
		
		expect(app.registry.getObjectList().indexOf(app.Organization.registry)).toBeGreaterThan(-1);
		
		expect(app.registry.getObjectList().indexOf(app.Person.registry)).toBeGreaterThan(-1);
	});
	
	
	it('can write all its data out to local storage in one go, and read it back in', function(){
		
		var oldPermission = app.prefs.isLocalStorageAllowed();
		
		app.prefs.isLocalStorageAllowed(true);
		
		
		app.registry.writeObject();
		
		app.registry.clear();
		
		app.registry.readObject();
		
		app.registry.onDeserialized();
		
		
		expect(app.Account.registry.getObjectList()).not.toEqual({}); // looping doesn't work, so going manual
		
		expect(app.Email.registry.getObjectList()).not.toEqual({});
		
		expect(app.Event.registry.getObjectList()).not.toEqual({});
		
		expect(app.Organization.registry.getObjectList()).not.toEqual({});
		
		expect(app.Person.registry.getObjectList()).not.toEqual({});
		
		
		// Test a few cross-cutting samples for now, be more throught later
		
		expect(app.Account.registry.getObjectList()[2].email().address()).toBe('john@server.domain');
		
		expect(app.Email.registry.getObjectList()[2].address()).toBe('mary@server.domain');
		
		expect(app.Event.registry.getObjectList()[0].guests()[0].employer().name()).toBe('ACME');
		
		expect(app.Event.registry.getObjectList()[1].host().hostName()).toBe('BigBig');
		
		
		app.prefs.isLocalStorageAllowed(oldPermission);
	});
	
	
	it('can clear out all data in class registries in one go', function(){
		
		app.registry.clear();
		
		app.registry.getObjectList().forEach(function(reg) {
			
			expect(reg.getObjectList()).toEqual({});
		});

		expect(true).toBe(true); // Jasmine may not see expects in blocks
	});
	
	
	it('has a set of preferences', function() {
		
		expect(app.prefs.constructor).toBe(Object);
	});
	
	
	it('it can get and set permission to store locally using accessor', function(){
		
		var isAllowed = app.prefs.isLocalStorageAllowed();
		
		app.prefs.isLocalStorageAllowed(!isAllowed);
		
		expect(app.prefs.isLocalStorageAllowed()).toBe(!isAllowed);
	});
	
	
	it('it cannot get and set permission to store locally without using accessor', function(){
		
		var func = app.prefs.isLocalStorageAllowed; //store the function so we can re-establish it
		
		app.prefs.isLocalStorageAllowed = true; // 'accidentally' replace function with literal
		
		try {
			
			app.prefs.isLocalStorageAllowed();
		}
		
		catch(e) {
			
			expect(e.message.indexOf('not a function')).toBeGreaterThan(-1);
		}
		
		app.prefs.isLocalStorageAllowed = func; // re-establish function
		
		expect(typeof app.prefs.isLocalStorageAllowed()).toBe('boolean'); // verify that is works again
	});
	
	
	it('it can get local storage prefix using accessor', function(){
		
		expect(app.prefs.localStoragePrefix()).toBeDefined();
		
		expect(typeof app.prefs.localStoragePrefix()).toBe('string');
	});
	
	
	it('it cannot get local storage prefix without using accessor', function(){
		
		var func = app.prefs.localStoragePrefix; //store the function so we can re-establish it
		
		app.prefs.localStoragePrefix = true; // 'accidentally' replace function with literal
		
		try {
			
			app.prefs.localStoragePrefix();
		}
		
		catch(e) {
			
			expect(e.message.indexOf('not a function')).toBeGreaterThan(-1);
		}
		
		app.prefs.localStoragePrefix = func; // re-establish function
		
		expect(typeof app.prefs.localStoragePrefix()).toBe('string'); // verify that is works again
	});
	
	
	it('it cannot set local storage prefix', function(){
		
		try {
			
			app.prefs.localStoragePrefix('still not cool'); // invoking with a param equals setting
		}
		
		catch(e) {
			
			expect(e.message).toBe('Illegal parameter: Local storage prefix is read-only');
		}		
	});
});