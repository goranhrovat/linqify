const { EqualityComparers } = require("../Utils/EqualityComparers");
const { IEnumerable } = require("../Sequence/IEnumerable");
const { Enumerable } = require("../Sequence/Enumerable");
const { Dictionary } = require("./Dictionary");
const { IGrouping } = require("../Sequence/IGrouping");

class Lookup extends IEnumerable {
	constructor(source, comparer = EqualityComparers.PrimitiveComparer) {
		super(function*() {
			for (let t of this._data) yield new IGrouping(t.Key, t.Value);
		});
		this._comparer = comparer;
		this._count = 0;
		this._data = new Dictionary(comparer);

		let Add = (key, element) => {
			let val = this._data.TryGetValue(key);
			if (val.contains) {
				val.value.push(element);
			} else {
				this._data.Add(key, [element]);
				this._count++;
			}
		};

		for (let t of source) Add(t.Key, t.Value);
	}

	get CountNative() {
		return this._count;
	}

	Get(key) {
		let tryValue = this._data.TryGetValue(key);

		return tryValue.contains
			? Enumerable.From(tryValue.value)
			: Enumerable.Empty();
	}

	ApplyResultSelector(resultSelector) {
		return this.Select(t => resultSelector(t.Key, t));
	}

	ContainsNative(key) {
		return this._data.ContainsKey(key);
	}
}

module.exports = { Lookup };
