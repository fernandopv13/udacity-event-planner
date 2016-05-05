var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	module.data = {
		
		organizations:
		[
			new module.Organization('ACME'),
			
			new module.Organization('BigBig'),
			
			new module.Organization('Pops')
		],

		people:
		[
			new module.Person('Peter Paulson'),
			
			new module.Person('Paul Peterson'),
			
			new module.Person('Mary Nogales')
		],

		events:
		[
			new module.Event('Web site launch party'),
			
			new module.Event('Welcome reception for Peter'),
			
			new module.Event('Friday bar'),

			new module.Event('Diwali'),
			
			new module.Event('Stag night for Andrea'),
			
			new module.Event('Sunday lunch at moms')
		],
		
		emails:
		[
			new module.Email('peter@server.domain'),
			
			new module.Email('paul@server.domain'),
			
			new module.Email('mary@server.domain')
		],
		
		accounts:
		[
			new module.Account(new module.Email('demo@demo.demo'), new module.Password('DEMO5%demo')),
			
			new module.Account(new module.Email('lisa@server.domain'), new module.Password('aBc!12345')),
			
			new module.Account(new module.Email('john@server.domain'), new module.Password('abCd1234!'))
		]
	};

	module.data.people[1].imgUrl('assets/img/male-avatar-2.jpg');
	module.data.people[2].imgUrl('assets/img/female-avatar-1.jpg');

	module.data.people[0].employer(module.data.organizations[0]);
	module.data.people[1].employer(module.data.organizations[1]);
	module.data.people[2].employer(module.data.organizations[2]);

	module.data.people[0].email(module.data.emails[0]);
	module.data.people[1].email(module.data.emails[1]);
	module.data.people[2].email(module.data.emails[2]);

	module.data.events[0].host(module.data.organizations[0]);
	module.data.events[1].host(module.data.organizations[1]);
	module.data.events[2].host(module.data.organizations[2]);

	module.data.events[0].start(new Date(1400000000000));
	module.data.events[0].end(new   Date(1400005000000));
	module.data.events[0].capacity(100);
	module.data.events[0].addGuest(module.data.people[0]);
	module.data.events[0].addGuest(module.data.people[1]);
	module.data.events[0].addGuest(module.data.people[2]);

	module.data.events[1].start(new Date(1400000000000));
	module.data.events[1].end(new   Date(1400005000000));
	module.data.events[1].capacity(100);
	module.data.events[1].addGuest(module.data.people[0]);
	module.data.events[1].addGuest(module.data.people[1]);
	module.data.events[1].addGuest(module.data.people[2]);

	module.data.events[2].start(new Date(1400000000000));
	module.data.events[2].end(new   Date(1400005000000));
	module.data.events[2].capacity(100);
	module.data.events[2].addGuest(module.data.people[0]);
	module.data.events[2].addGuest(module.data.people[1]);
	module.data.events[2].addGuest(module.data.people[2]);

	module.data.accounts[0].addEvent(module.data.events[0]);
	module.data.accounts[0].addEvent(module.data.events[1]);
	module.data.accounts[0].addEvent(module.data.events[2]);
	module.data.accounts[0].addEvent(module.data.events[3]);
	module.data.accounts[0].addEvent(module.data.events[4]);
	module.data.accounts[0].addEvent(module.data.events[5]);

	void module.data.accounts[0].accountHolder(module.data.people[0]);
	void module.data.accounts[0].geoLocationAllowed(true);
	void module.data.accounts[0].localStorageAllowed(true);

})(app);