const {
	getComparer,
	getComparerReverse,
	sortGen
} = require("../Utils/SortUtils");
const { IEnumerable } = require("./IEnumerable");

class IOrderedEnumerable extends IEnumerable {
	constructor(source, cmpfuns) {
		super(sortGen.bind(source, cmpfuns));
		this._source = source;
		this._cmpfuns = cmpfuns;
	}

	ThenBy(keySelector, comparer) {
		return new IOrderedEnumerable(this._source, [
			...this._cmpfuns,
			getComparer(keySelector, comparer)
		]);
	}

	ThenByDescending(keySelector, comparer) {
		return new IOrderedEnumerable(this._source, [
			...this._cmpfuns,
			getComparerReverse(keySelector, comparer)
		]);
	}
}

Object.defineProperty(IEnumerable.prototype, "OrderBy", {
	enumerable: false,
	writable: false,
	configurable: true,
	value: function(keySelector, comparer) {
		return new IOrderedEnumerable(this, [getComparer(keySelector, comparer)]);
	}
});

Object.defineProperty(IEnumerable.prototype, "OrderByDescending", {
	enumerable: false,
	writable: false,
	configurable: true,
	value: function(keySelector, comparer) {
		return new IOrderedEnumerable(this, [
			getComparerReverse(keySelector, comparer)
		]);
	}
});

module.exports = { IOrderedEnumerable };
