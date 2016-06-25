'use strict';

/******************************************************************************
* Mockup for Model class for use in unit testing
******************************************************************************/


var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	if (!module.Model)   {

		module.Model = function() {

			this.className = function() {return 'Model'};
		};

		module.Module.prototype.isInstanceOf = function(fn) {return fn === module.Model;};

		void app.IInterfaceable.mixInto(app.IObservable, module.Model);

		void app.IInterfaceable.mixInto(app.IObserver, module.Model);
	}

})(app);