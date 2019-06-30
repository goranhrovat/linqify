var { IEnumerable } = require("./IEnumerable");
const { tryAddConflictProperty } = require("../NoConflict/AddConflict");

let emptyGenerator = function*() {};
const emptyEnumerable = new IEnumerable(emptyGenerator);

class Enumerable {
	static From(source) {
		if (source instanceof IEnumerable) return source;

		if (
			source.constructor.name === "GeneratorFunction" ||
			source instanceof emptyGenerator.constructor
		)
			return new IEnumerable(source);

		return Enumerable.Empty().Concat(source);
	}

	static Range(start, count) {
		if (count < 0) throw new Error("count is less than 0");
		return new IEnumerable(function*() {
			let end = start + count;
			for (let i = start; i < end; i++) yield i;
		});
	}

	static Repeat(value, count) {
		if (count < 0) throw new Error("count is less than 0");
		return new IEnumerable(function*() {
			while (count--) yield value;
		});
	}

	static Empty() {
		return emptyEnumerable;
	}

	static setMethod(methodName, fun) {
		let funFinal = fun;
		if (
			fun.constructor.name === "GeneratorFunction" ||
			fun instanceof emptyGenerator.constructor
		) {
			// if generator
			funFinal = function(...args) {
				return new IEnumerable(fun.bind(this, ...args));
			};
		}

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

module.exports = { Enumerable, emptyGenerator };
