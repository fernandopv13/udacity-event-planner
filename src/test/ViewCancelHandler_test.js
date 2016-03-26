'use strict';

/* Jasmine.js unit test suite for ViewCancelHandler class in meetup even planner application
*
*  This suite is designed to be able to be run as independently as possible from other tests
*  and/or functionality. UI and other integration testing is done seperately.

*/

describe('class ViewCancelHandler', function(){
	
	var testHandler = new app.ViewCancelHandler(new app.Controller());

	it('inherits from ViewUpdateHandler', function() {
		
			expect(testHandler.ssuper()).toBe(app.ViewUpdateHandler); // verify both direct inheritance and parent constructor reference

			expect(typeof testHandler.update).toBe('function') // verify inheritance of parent methods via prototype

			// this should be enough to prove that basics of inheritance are in place, no need to test for every inherited member
	});


	it('can be instantiated', function() {

		expect((new app.ViewCancelHandler()).constructor).toBe(app.ViewCancelHandler);
	});


	describe('instance', function() {

		it('can get the type of UIAction it will respond to (expressed as an integer)', function() {

			expect(typeof testHandler.uiAction).toBe('function');

			expect(parseInt(testHandler.uiAction())).toEqual(testHandler.uiAction());
		});

		
		it('rejects attempt to set its UIAction', function() {

			try {

				testHandler.uiAction('read-only');
			}

			catch(e) {

				expect(e.name).toBe('IllegalArgumentError');
			}

			expect(true).toBe(true); // Jasmine.js may not see expects in trys
		});


		it('executes its algorithm if updated with a matching UIAction, a Model and a View', function() {

			expect(typeof testHandler.execute).toBe('function');

			var testModel = new app.Event(), oldPermission = app.prefs.isLocalStorageAllowed();

			app.prefs.isLocalStorageAllowed(true);

			testHandler.controller().newModel(testModel);

			expect(testHandler.controller().newModel().id()).toEqual(testModel.id());

			testHandler.update(app.View.UIAction.CANCEL, new app.Model(), new app.View());

			//expect(testHandler.controller().newModel()).toBe(null);

			app.prefs.isLocalStorageAllowed(oldPermission);
		});


		it('does not execute its algorithm if updated with a non-matching UIAction', function() {

			expect(typeof testHandler.execute).toBe('function');

			var testModel = new app.Event(), oldPermission = app.prefs.isLocalStorageAllowed();

			app.prefs.isLocalStorageAllowed(true);

			testHandler.controller().newModel(testModel);

			expect(testHandler.controller().newModel().id()).toEqual(testModel.id());

			testHandler.update(app.View.UIAction.CANCEL + 1, new app.Model(), new app.View());

			expect(testHandler.controller().newModel().id()).toEqual(testModel.id());

			app.prefs.isLocalStorageAllowed(oldPermission);
		});

		
		it('does not execute its algorithm if updated with a model that is not an instance of Model', function() {

			expect(typeof testHandler.execute).toBe('function');

			var testModel = new app.Event(), oldPermission = app.prefs.isLocalStorageAllowed();

			app.prefs.isLocalStorageAllowed(true);

			testHandler.controller().newModel(testModel);

			expect(testHandler.controller().newModel().id()).toEqual(testModel.id());

			testHandler.update(app.View.UIAction.CANCEL, new app.View(), new app.View());

			expect(testHandler.controller().newModel().id()).toEqual(testModel.id());

			app.prefs.isLocalStorageAllowed(oldPermission);
		});


		it('does not execute its algorithm if updated with a view that is not an instance of View', function() {

			expect(typeof testHandler.execute).toBe('function');

			var testModel = new app.Event(), oldPermission = app.prefs.isLocalStorageAllowed();

			app.prefs.isLocalStorageAllowed(true);

			testHandler.controller().newModel(testModel);

			expect(testHandler.controller().newModel().id()).toEqual(testModel.id());

			testHandler.update(app.View.UIAction.CANCEL, new app.View(), new app.Model());

			expect(testHandler.controller().newModel().id()).toEqual(testModel.id());

			app.prefs.isLocalStorageAllowed(oldPermission);
		});
	});
});