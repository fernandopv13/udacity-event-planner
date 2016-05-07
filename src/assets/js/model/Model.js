'use strict';

var app = app || {}; // create a simple namespace for the module


(function (module) { // wrap initialization in anonymous function taking app/module context as parameter

	/*********************************************************************************************
	* public abstract class Model implements IInterfaceable, IObserable, IObserver, ISerializable
	*********************************************************************************************/

	/** @classdesc Abstract base class for the 'M' part of our MVC framework. Represents data in the app.
	*
	* Enables loosely coupled messaging among main MVC collaborators.
	*
	* Interfaces implemented as mixins, using static method in IInterface:
	*
	* Please see individual interfaces for documentation of methods that have a default implementation.
	*
	* @abstract
	*
	* @implements IInterfaceable
	*
	* @implements IObservable
	*
	* @implements IObserver
	*
	* @implements ISerializable
	*
	* @constructor
	*
	* @return {Model} Not supposed to be instantiated, except when extended by subclasses.
	*
	* @author Ulrik H. Gade, February 2016
	*
	* @todo: Try to pull some of the boilerplate initialization (e.g. retrieval from storage, id assignment) from subclasses up into this (the parent)
	*/

	module.Model = function() {
		
		/*----------------------------------------------------------------------------------------
		* Private instance fields (encapsulated data members)
		*---------------------------------------------------------------------------------------*/

		var _className = (this.className ? this.className : 'Model'), // name of this view class (override by subclass constructor, if provided )

		_id = (this.id >= 0 ? this.id: undefined), // (int) Unique object ID obtained from object class' registry

		_observers = [], // Array of IObservers receiving updates from this view, required in order to implement IObservable

		_parentList = [module.IInterfaceable, module.IObservable, module.IObserver, module.ISerializable, module.Model, this.constructor], // list of interfaces implemented by this class (by function reference)
		
		// try adding this.constructor to parentList to relieve subclasses from this task

		_super = (this.ssuper ? this.ssuper : Object); // reference to immediate parent class (by function) if provided by subclass, otherwise Object 

		
		
		/*----------------------------------------------------------------------------------------
		* Accessors for private instance fields (dependency injection enables access for subclasses)
		*---------------------------------------------------------------------------------------*/

			/** Gets name of the Model's class (read-only).
			*
			* @return {String} className The name of the View's class
			*
			* @throws {IllegalArgumentError} If trying to set the className.
			*/

			this.className = new module.Accessor(_className, true); // replace temporary literal with read-only accessor

			
			/** Gets Model's unique id (read-only).
			*
			* @return {int} id The Model's unique id
			*
			* @throws {IllegalArgumentError} If trying to set the id.
			*/

			this.id = new module.Accessor(_id, true);

			
			/** Gets the collection of IObservers currently registered with the Model
			*
			* @return {Array} observers An array of IObservers
			*
			* @throws {IllegalArgumentError} If trying to set the observers array
			*/

			this.observers = new module.Accessor(_observers, true);

			
			/** Gets a collection of classes or 'interfaces' (by function reference) the Model extends or implements. Includes the class of the Model itself.
			*
			* @return {Array} parentList An array of functions
			*
			* @throws {IllegalArgumentError} If trying to set the parentList array
			*/

			this.parentList = new module.Accessor(_parentList, true);
			
			
			/** Gets a reference to the Model's parent (by function reference) in the class inheritence hierarchy (the topmost class is Object)
			*
			* @return {Function} ssuper The parent class
			*
			* @throws {IllegalArgumentError} If trying to set the ssuper attribute
			*
			* @todo Not fully functional; only works one level up from the lowest level in the tree
			*/

			this.ssuper = new module.Accessor(_super, true); // 'super' may be a reserved word, so slight name change
	}


	/*----------------------------------------------------------------------------------------
	Mix in default methods from implemented interfaces, unless overridden by class or ancestor
	*---------------------------------------------------------------------------------------*/

		void module.IInterfaceable.mixInto(module.IInterfaceable, module.Model);

		void module.IInterfaceable.mixInto(module.IObservable, module.Model);

		void module.IInterfaceable.mixInto(module.IObserver, module.Model);

		void module.IInterfaceable.mixInto(module.ISerializable, module.Model);


	/*----------------------------------------------------------------------------------------
	* Public instance methods (on prototype)
	*---------------------------------------------------------------------------------------*/

		/** Does clean up associated with deletion of Model, e.g. removes from registry and
		*
		* deletes objects it is uniquely composed of. Removes Model from local storage, if available.
		*
		* @return {void}
		*/

		module.Model.prototype.delete = function () {

			void this.constructor.registry.remove(this);

			if (window.localStorage && module.prefs.isLocalStorageAllowed()) {this.removeObject();}
		};


		/** Returns true if class is or extends the class, or implements the interface, passed in (by function reference).
		*
		* See IInterfaceable for further documentation.
		*
		* @todo Now that the parent list is publicly available, this should be able to rely on the/a default method in IInterfaceable
		*/

		module.Model.prototype.isInstanceOf = function (func_interface) {
			
			return this.parentList().indexOf(func_interface) > -1;
		};


		/** Does housekeeping common to all Models after they have updated themselves.
		*
		* Override in subclsees to do the actual updating, then call this.
		*
		* @param {Model} obj Temporary object holding the updated information. Is of same class as Modelable itself.
		*
		* @param {int} id ID of the object to be updated
		*
		* @return {void}
		*/

		module.Model.prototype.onUpdate = function(Model_obj) {

			// Remove references to tmp object (to mark for garbage collection, preventing memory leak)

			this.constructor.registry.remove(Model_obj);

			Model_obj = undefined;
			
			
			// Write new state to local storage, if available

			var account = module.controller.selectedAccount();

			if (account.localStorageAllowed() && window.localStorage) {

				this.writeObject();

				//console.log(JSON.parse(localStorage.getItem(module.prefs.localStoragePrefix() + this.className() + '.' + this.id())));
			}


			// Register controller as observer of object (ignored if already registered)

			this.registerObserver(module.controller);

			
			// Notify observers (i.e. controller) of update to Model state

			//console.log('Updated ' + this.className() + ', notifying controller'); // debug

			this.notifyObservers(this);
		}


		/** Reports whether this object should respond to an update notification broadcast (from controller)
		*
		* @param {Model} m Temporary Model instance holding the data to update from. Its class must match the class of the target object.
		*
		* @param {int} id Id of the Model instance intended to receive the update. Must match the id of the target object.
		*
		* @return {Boolean} true if both class and id of provided params match this instance, otherwise or false
		*
		*/

		module.Model.prototype.update = function(Model_m, int_id) {

			var args = arguments;

			if (args.length === 2) {

				if (args[0] && args[0].isInstanceOf && args[0].isInstanceOf(module.Model) && args[1] === parseInt(args[1])) { //console.log('correct method signature');

					if (args[0].constructor === this.constructor) { //console.log('correct Model subtype');

						if (typeof args[1] === 'number' && parseInt(args[1]) === this.id()) { //console.log('correct id');

							//console.log('Received update to ' + this.className() + ' ' + this.id()); // debug

							return true;
						}

						// else: ignore silently, the call may not be for this object
					}

					// else : ignore silently, the call may not be for this object
				}
			}

			return false;
		}

})(app);