var app = app || {};

app.testutil = app.testutil || {};


// 'Clones' test data by way of local storage

app.testutil.resetTestData = function(testApp) {

	var klasses = ['Account', 'Email', 'Event', 'Organization', 'Password', 'Person']

	// Flush registries

	app.registry.clear();

	klasses.forEach(function(klass) {

		app[klass].registry.clear();

		app.registry.getObjectList().push(app[klass].registry);
	});

	// Restore testdata

	for (var klass in app.data) {

		app.data[klass].forEach(function(model) {

			app[klass].registry.add(model);
		});
	};

	// Overwrite local storage with fresh test data

	void app.prefs.isLocalStorageAllowed(true);

	localStorage.clear();

	app.registry.writeObject();

	// Load test data from local storage into testApp

	testApp.registry.clear();

	void testApp.prefs.isLocalStorageAllowed(true);

	testApp.registry.readObject();

	testApp.registry.onDeserialized();

	void testApp.prefs.isLocalStorageAllowed(false);

	klasses.forEach(function(klass) {testApp.registry.getObjectList().push(testApp[klass].registry);});
}