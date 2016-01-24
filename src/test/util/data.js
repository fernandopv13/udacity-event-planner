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