const { IEnumerable } = require("../Sequence/IEnumerable");
const { tryAddConflictProperty } = require("../NoConflict/AddConflict");

// extend Array, Map, Set and String
for (let type of [Array, Map, Set, String]) {
	for (let methodName of Object.getOwnPropertyNames(
		IEnumerable.prototype
	).filter(t => t !== "constructor")) {
		tryAddConflictProperty(type, methodName, IEnumerable.prototype[methodName]);
	}
}
