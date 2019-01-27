const { EqualityComparers } = require("../Utils/EqualityComparers");
const { IEnumerable } = require("../Sequence/IEnumerable");
const { Enumerable } = require("../Sequence/Enumerable");
const { Dictionary } = require("./Dictionary");
const { IGrouping } = require("../Sequence/IGrouping");

class Lookup extends IEnumerable {
	constructor(source, comparer = EqualityComparers.PrimitiveComparer) {
		super();
		this.comparer = comparer;
		this.count = 0;
		this.data = new Dictionary(comparer);

		let Add = (key, element) => {
			if (!this.data.ContainsKey(key)) {
				this.data.Add(key, [element]);
				this.count++;
			} else {
				this.data.Get(key).push(element);
			}
		};

		for (let t of source) Add(t.Key, t.Value);
	}

	*[Symbol.iterator]() {
		for (let t of this.data) yield new IGrouping(t.Key, t.Value);
	}

	get CountNative() {
		return this.count;
	}

	Get(key) {
		let tryValue = this.data.TryGetValue(key);

		return tryValue.contains
			? Enumerable.From(tryValue.value)
			: Enumerable.Empty();
	}

	ApplyResultSelector(resultSelector) {
		return this.Select(t => resultSelector(t.Key, t));
	}

	ContainsNative(key) {
		return this.data.ContainsKey(key);
	}
}

module.exports = { Lookup };
