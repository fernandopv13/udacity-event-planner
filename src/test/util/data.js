var app = app || {};

app.data = {
	
	organizations:
	[
		new app.Organization('ACME'),
		
		new app.Organization('BigBig'),
		
		new app.Organization('Pops')
	],

	people:
	[
		new app.Person('Peter Paulson'),
		
		new app.Person('Paul Peterson'),
		
		new app.Person('Mary Nogales')
	],

	events:
	[
		new app.Event('Web site launch party'),
		
		new app.Event('Welcome reception for Peter'),
		
		new app.Event('Friday bar'),

		new app.Event('Diwali'),
		
		new app.Event('Stag night for Andrea'),
		
		new app.Event('Sunday lunch at moms')
	],
	
	emails:
	[
		new app.Email('peter@server.domain'),
		
		new app.Email('paul@server.domain'),
		
		new app.Email('mary@server.domain')
	],
	
	accounts:
	[
		new app.Account(new app.Email('demo@demo.demo'), new app.Password('DEMO5%demo')),
		
		new app.Account(new app.Email('lisa@server.domain'), new app.Password('aBc!12345')),
		
		new app.Account(new app.Email('john@server.domain'), new app.Password('abCd1234!'))
	]
};
app.data.people[2].imgUrl('assets/img/test-avatar.jpg');

app.data.people[0].employer(app.data.organizations[0]);
app.data.people[1].employer(app.data.organizations[1]);
app.data.people[2].employer(app.data.organizations[2]);

app.data.people[0].email(app.data.emails[0]);
app.data.people[1].email(app.data.emails[1]);
app.data.people[2].email(app.data.emails[2]);

app.data.events[0].host(app.data.organizations[0]);
app.data.events[1].host(app.data.organizations[1]);
app.data.events[2].host(app.data.organizations[2]);

app.data.events[0].start(new Date(1400000000000));
app.data.events[0].end(new   Date(1400005000000));
app.data.events[0].capacity(100);
app.data.events[0].addGuest(app.data.people[0]);
app.data.events[0].addGuest(app.data.people[1]);
app.data.events[0].addGuest(app.data.people[2]);

app.data.events[1].start(new Date(1400000000000));
app.data.events[1].end(new   Date(1400005000000));
app.data.events[1].capacity(100);
app.data.events[1].addGuest(app.data.people[0]);
app.data.events[1].addGuest(app.data.people[1]);
app.data.events[1].addGuest(app.data.people[2]);

app.data.events[2].start(new Date(1400000000000));
app.data.events[2].end(new   Date(1400005000000));
app.data.events[2].capacity(100);
app.data.events[2].addGuest(app.data.people[0]);
app.data.events[2].addGuest(app.data.people[1]);
app.data.events[2].addGuest(app.data.people[2]);

app.data.accounts[0].addEvent(app.data.events[0]);
app.data.accounts[0].addEvent(app.data.events[1]);
app.data.accounts[0].addEvent(app.data.events[2]);
app.data.accounts[0].addEvent(app.data.events[3]);
app.data.accounts[0].addEvent(app.data.events[4]);
app.data.accounts[0].addEvent(app.data.events[5]);

void app.data.accounts[0].geoLocationAllowed(true);
void app.data.accounts[0].localStorageAllowed(true);