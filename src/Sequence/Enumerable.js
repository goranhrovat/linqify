var { IEnumerable } = require("./IEnumerable");
const { tryAddConflictProperty } = require("../NoConflict/AddConflict");

let generatorConstructor = function*() {}.constructor;

class Enumerable {
	static From(source) {
		if (source instanceof IEnumerable) return source;

		if (
			source.constructor.name === "GeneratorFunction" ||
			source instanceof generatorConstructor
		)
			return new IEnumerable(source);

		return IEnumerable.prototype.AsEnumerable.bind(source)();
	}

	static Range(start, count) {
		if (count < 0) throw "count is less than 0";
		return new IEnumerable(function*() {
			let end = start + count;
			for (let i = start; i < end; i++) yield i;
		});
	}

	static Repeat(value, count) {
		if (count < 0) throw "count is less than 0";
		return new IEnumerable(function*() {
			for (let i = 0; i < count; i++) {
				yield value;
			}
		});
	}

	static Empty() {
		return emptyEnumerable;
	}

	static setMethod(methodName, fun) {
		let funFinal = fun;
		if (
			fun.constructor.name === "GeneratorFunction" ||
			fun instanceof generatorConstructor
		) {
			// if generator
			funFinal = function(...args) {
				return new IEnumerable(fun.bind(this), ...args);
			};
		}
		// else { // if not generator return value immediately
		//     //funFinal = function(...args) {return fun.bind(this)(...args)};
		//     funFinal = fun;
		// }

		Object.defineProperty(IEnumerable.prototype, methodName, {
			enumerable: false,
			writable: false,
			configurable: true,
			value: funFinal
		});

		for (let type of [Array, Map, Set, String]) {
			tryAddConflictProperty(type, methodName, funFinal);
		}
	}
}
const emptyEnumerable = new IEnumerable(function*() {});

module.exports = { Enumerable };
