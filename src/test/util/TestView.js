'use strict';

/******************************************************************************
* Mockup for View class for use in unit testing
******************************************************************************/


var app = app || {};

(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	if (!module.View)   {

		module.View = function() {

			this.className = function() {return 'View'};
		};

		module.View.prototype.isInstanceOf = function(fn_View) {return fn_View === module.View;};

		void app.IInterfaceable.mixInto(app.IObservable, module.View);

		void app.IInterfaceable.mixInto(app.IObserver, module.View);
	}

})(app);