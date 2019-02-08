const {
	getComparer,
	getComparerReverse,
	sortGen
} = require("../Utils/SortUtils");
const { IEnumerable } = require("./IEnumerable");

class IOrderedEnumerable extends IEnumerable {
	constructor(gen, source, cmpfuns) {
		super(gen, source, cmpfuns);
		this.gen = gen;
		this.source = source;
		this.cmpfuns = cmpfuns;
	}

	ThenBy(keySelector, comparer) {
		return new IOrderedEnumerable(sortGen, this.source, [
			...this.cmpfuns,
			getComparer(keySelector, comparer)
		]);
	}

	ThenByDescending(keySelector, comparer) {
		return new IOrderedEnumerable(sortGen, this.source, [
			...this.cmpfuns,
			getComparerReverse(keySelector, comparer)
		]);
	}
}

Object.defineProperty(IEnumerable.prototype, "OrderBy", {
	enumerable: false,
	writable: false,
	configurable: true,
	value: function(keySelector, comparer) {
		return new IOrderedEnumerable(sortGen, this, [
			getComparer(keySelector, comparer)
		]);
	}
});

Object.defineProperty(IEnumerable.prototype, "OrderByDescending", {
	enumerable: false,
	writable: false,
	configurable: true,
	value: function(keySelector, comparer) {
		return new IOrderedEnumerable(sortGen, this, [
			getComparerReverse(keySelector, comparer)
		]);
	}
});

module.exports = { IOrderedEnumerable };
