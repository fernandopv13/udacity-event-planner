'use strict';

/******************************************************************************
* Utility class for listening to Observer pattern messages in unit testing
******************************************************************************/


var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	module.TestObserver = function() {

		this.notification = null;
	};

	module.TestObserver.prototype.isInstanceOf = function() {return true;};

	module.TestObserver.prototype.update = function() {this.notification = arguments; console.log(arguments)};

	void app.IInterfaceable.mixInto(app.IObserver, module.TestObserver);

})(app);