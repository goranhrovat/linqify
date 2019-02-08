const { getType } = require("../Utils/TypeUtils");
const { EqualityComparers } = require("../Utils/EqualityComparers");
const { IEnumerable } = require("../Sequence/IEnumerable");

class Dictionary extends IEnumerable {
	/**
	 * ()
	 * source<{Key,Value}>
	 * source<{Key,Value}>, comparer
	 * comparer
	 */
	constructor(arg1, comparer = EqualityComparers.PrimitiveComparer) {
		super(function*() {
			for (let t of this.data)
				for (let k of t[1]) yield { Key: k.key, Value: k.value };
		});
		this.count = 0;
		this.data = new Map();
		comparer = comparer || EqualityComparers.PrimitiveComparer;
		if (arg1 === undefined) {
			// 1
			this.comparer = comparer;
		} else if (getType(arg1) === "Object" || getType(arg1) === "null") {
			// 4
			this.comparer = arg1 || EqualityComparers.PrimitiveComparer;
		} else {
			// 2, 3
			this.comparer = comparer;
			for (let t of arg1) this.Add(t.Key, t.Value);
		}
	}

	get Comparer() {
		return this.comparer;
	}

	get CountNative() {
		return this.count;
	}

	get Keys() {
		return new Dictionary.KeyCollection(this);
	}

	get Values() {
		return new Dictionary.ValueCollection(this);
	}

	Add(key, value) {
		if (!this.data.has(this.comparer.GetHashCode(key))) {
			this.data.set(this.comparer.GetHashCode(key), [{ key, value }]);
		} else {
			for (let t of this.data.get(this.comparer.GetHashCode(key))) {
				if (this.comparer.Equals(t.key, key)) {
					throw "Key already exists";
				}
			}
			this.data.get(this.comparer.GetHashCode(key)).push({ key, value });
		}
		this.count++;
	}

	Clear() {
		this.data.clear();
		this.count = 0;
	}

	ContainsKey(key) {
		if (this.data.has(this.comparer.GetHashCode(key))) {
			for (let t of this.data.get(this.comparer.GetHashCode(key))) {
				if (this.comparer.Equals(t.key, key)) return true;
			}
		}
		return false;
	}

	ContainsValue(value) {
		for (let t of this.data) {
			for (let k of t[1]) if (k.value === value) return true;
		}
		return false;
	}

	Remove(key) {
		if (this.data.has(this.comparer.GetHashCode(key))) {
			let i = 0;
			for (let t of this.data.get(this.comparer.GetHashCode(key))) {
				if (this.comparer.Equals(t.key, key)) {
					this.data.get(this.comparer.GetHashCode(key)).splice(i, 1);
					if (this.data.get(this.comparer.GetHashCode(key)).length === 0) {
						this.data.delete(this.comparer.GetHashCode(key));
					}
					this.count--;
					return true;
				}
				i++;
			}
		}
		return false;
	}

	Get(key) {
		if (this.data.has(this.comparer.GetHashCode(key))) {
			for (let t of this.data.get(this.comparer.GetHashCode(key))) {
				if (this.comparer.Equals(t.key, key)) return t.value;
			}
		}
		throw "Key does not exist";
	}

	Set(key, value) {
		if (this.data.has(this.comparer.GetHashCode(key))) {
			for (let t of this.data.get(this.comparer.GetHashCode(key))) {
				if (this.comparer.Equals(t.key, key)) {
					t.value = value;
					return;
				}
			}
		}
		this.Add(key, value);
	}

	TryAdd(key, value) {
		if (this.ContainsKey(key)) return false;
		this.Add(key, value);
		return true;
	}

	TryGetValue(key) {
		if (this.data.has(this.comparer.GetHashCode(key))) {
			for (let t of this.data.get(this.comparer.GetHashCode(key))) {
				if (this.comparer.Equals(t.key, key))
					return { value: t.value, contains: true };
			}
		}
		return { value: undefined, contains: false };
	}
}

Dictionary.KeyCollection = class extends IEnumerable {
	constructor(dictionary) {
		super(function*() {
			for (let t of dictionary) yield t.Key;
		});
		this.dictionary = dictionary;
	}

	get CountNative() {
		return this.dictionary.CountNative;
	}

	CopyTo(array, index) {
		let i = 0;
		for (let t of this) array[index + i++] = t;
	}
};

Dictionary.ValueCollection = class extends IEnumerable {
	constructor(dictionary) {
		super(function*() {
			for (let t of dictionary) yield t.Value;
		});
		this.dictionary = dictionary;
	}

	get CountNative() {
		return this.dictionary.CountNative;
	}

	CopyTo(array, index) {
		let i = 0;
		for (let t of this) {
			array[index + i] = t;
			i++;
		}
	}
};

module.exports = { Dictionary };
