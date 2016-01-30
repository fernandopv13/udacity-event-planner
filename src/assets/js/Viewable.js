/****************************************************************
 public abstract class Viewable extends Observable
****************************************************************/

//Provides a generic interface to the view to collaborator classes.
//Viewables may be observed by Controllers.

/*
* JS has no concept of interfaces, so no option but to create
* hierarchy of 'abstract' classes.
*/


//constructor
var Viewable = function() {
	//call (chain) parent constructor to create and populate inherited instance fields
	Observable.call(this);
	
	//public instance fields
	this.id; //mostly used to parse option selected in Controller.update()
};
//inherit from Observable
Viewable.prototype = Object.create(Observable.prototype); //set up inheritance
Viewable.prototype.constructor = Viewable; //reset constructor property


Viewable.prototype.click = function(int_ID) { //'abstract' method
	//handle click events	
	//int_ID is the ID of whatever model object is impacted by the click
	//it's up to the implementation in derived classes to decide what that means
	throw new Error('Viewable.click() not implemented by subclass');
}

Viewable.prototype.init = function() { //'abstract' method
	//initialize object at app startup
	throw new Error('Viewable.init() not implemented by subclass');
}

Viewable.prototype.render = function(modelable_obj) { //'abstract' method
	//(re-)render object when something has changed
	throw new Error('Viewable.render() not implemented by subclass');
}