var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	module.data = {
		
		Organization:
		[
			new module.Organization('ACME'),
			
			new module.Organization('BigBig'),
			
			new module.Organization('Pops')
		],

		Person:
		[
			new module.Person('Peter Paulson'),
			
			new module.Person('Paul Peterson'),
			
			new module.Person('Mary Nogales')
		],

		Event:
		[
			new module.Event('Web site launch party'),
			
			new module.Event('Welcome reception for Peter'),
			
			new module.Event('Friday bar'),

			new module.Event('Diwali'),
			
			new module.Event('Stag night for Andrea'),
			
			new module.Event('Sunday lunch at moms')
		],
		
		Email:
		[
			new module.Email('peter@server.domain'),
			
			new module.Email('paul@server.domain'),
			
			new module.Email('mary@server.domain')
		],
		
		Account:
		[
			new module.Account(new module.Email('demo@demo.demo'), new module.Password('DEMO5%demo')),
			
			new module.Account(new module.Email('lisa@server.domain'), new module.Password('aBc!12345')),
			
			new module.Account(new module.Email('john@server.domain'), new module.Password('abCd1234!'))
		]
	};

	module.data.Person[1].imgUrl('assets/img/male-avatar-2.jpg');
	module.data.Person[2].imgUrl('assets/img/female-avatar-1.jpg');

	module.data.Person[0].employer(module.data.Organization[0]);
	module.data.Person[1].employer(module.data.Organization[1]);
	module.data.Person[2].employer(module.data.Organization[2]);

	module.data.Person[0].email(module.data.Email[0]);
	module.data.Person[1].email(module.data.Email[1]);
	module.data.Person[2].email(module.data.Email[2]);

	module.data.Event[0].host(module.data.Organization[0]);
	module.data.Event[1].host(module.data.Organization[1]);
	module.data.Event[2].host(module.data.Organization[2]);

	module.data.Event[0].start(new Date(1400000000000));
	module.data.Event[0].end(new   Date(1400005000000));
	module.data.Event[0].capacity(100);
	module.data.Event[0].addGuest(module.data.Person[0]);
	module.data.Event[0].addGuest(module.data.Person[1]);
	module.data.Event[0].addGuest(module.data.Person[2]);

	module.data.Event[1].start(new Date(1400000000000));
	module.data.Event[1].end(new   Date(1400005000000));
	module.data.Event[1].capacity(100);
	module.data.Event[1].addGuest(module.data.Person[0]);
	module.data.Event[1].addGuest(module.data.Person[1]);
	module.data.Event[1].addGuest(module.data.Person[2]);

	module.data.Event[2].start(new Date(1400000000000));
	module.data.Event[2].end(new   Date(1400005000000));
	module.data.Event[2].capacity(100);
	module.data.Event[2].addGuest(module.data.Person[0]);
	module.data.Event[2].addGuest(module.data.Person[1]);
	module.data.Event[2].addGuest(module.data.Person[2]);

	module.data.Account[0].addEvent(module.data.Event[0]);
	module.data.Account[0].addEvent(module.data.Event[1]);
	module.data.Account[0].addEvent(module.data.Event[2]);
	module.data.Account[0].addEvent(module.data.Event[3]);
	module.data.Account[0].addEvent(module.data.Event[4]);
	module.data.Account[0].addEvent(module.data.Event[5]);

	
	void module.data.Account[0].accountHolder(module.data.Person[0]);
	void module.data.Account[0].geoLocationAllowed(true);
	void module.data.Account[0].localStorageAllowed(true);

})(app);