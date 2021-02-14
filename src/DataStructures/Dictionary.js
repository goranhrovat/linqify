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
		super(function* () {
			for (let t of this._data)
				for (let k of t[1]) yield { Key: k.key, Value: k.value };
		});
		this._count = 0;
		this._data = new Map();
		comparer = comparer || EqualityComparers.PrimitiveComparer;
		if (arg1 === undefined) {
			// 1
			this._comparer = comparer;
		} else if (getType(arg1) === "Object" || getType(arg1) === "null") {
			// 4
			this._comparer = arg1 || EqualityComparers.PrimitiveComparer;
		} else {
			// 2, 3
			this._comparer = comparer;
			for (let t of arg1) this.Add(t.Key, t.Value);
		}
	}

	get Comparer() {
		return this._comparer;
	}

	get CountNative() {
		return this._count;
	}

	get Keys() {
		return new Dictionary.KeyCollection(this);
	}

	get Values() {
		return new Dictionary.ValueCollection(this);
	}

	Add(key, value) {
		if (!this._data.has(this._comparer.GetHashCode(key))) {
			this._data.set(this._comparer.GetHashCode(key), [{ key, value }]);
		} else {
			for (let t of this._data.get(this._comparer.GetHashCode(key))) {
				if (this._comparer.Equals(t.key, key)) {
					throw new Error("Key already exists");
				}
			}
			this._data.get(this._comparer.GetHashCode(key)).push({ key, value });
		}
		this._count++;
	}

	Clear() {
		this._data.clear();
		this._count = 0;
	}

	ContainsKey(key) {
		if (this._data.has(this._comparer.GetHashCode(key))) {
			for (let t of this._data.get(this._comparer.GetHashCode(key))) {
				if (this._comparer.Equals(t.key, key)) return true;
			}
		}
		return false;
	}

	ContainsValue(value) {
		for (let t of this._data) {
			for (let k of t[1]) if (k.value === value) return true;
		}
		return false;
	}

	Remove(key) {
		if (this._data.has(this._comparer.GetHashCode(key))) {
			let i = 0;
			for (let t of this._data.get(this._comparer.GetHashCode(key))) {
				if (this._comparer.Equals(t.key, key)) {
					this._data.get(this._comparer.GetHashCode(key)).splice(i, 1);
					if (this._data.get(this._comparer.GetHashCode(key)).length === 0) {
						this._data.delete(this._comparer.GetHashCode(key));
					}
					this._count--;
					return true;
				}
				i++;
			}
		}
		return false;
	}

	Get(key) {
		if (this._data.has(this._comparer.GetHashCode(key))) {
			for (let t of this._data.get(this._comparer.GetHashCode(key))) {
				if (this._comparer.Equals(t.key, key)) return t.value;
			}
		}
		throw new Error("Key does not exist");
	}

	Set(key, value) {
		if (this._data.has(this._comparer.GetHashCode(key))) {
			for (let t of this._data.get(this._comparer.GetHashCode(key))) {
				if (this._comparer.Equals(t.key, key)) {
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
		if (this._data.has(this._comparer.GetHashCode(key))) {
			for (let t of this._data.get(this._comparer.GetHashCode(key))) {
				if (this._comparer.Equals(t.key, key))
					return { value: t.value, contains: true };
			}
		}
		return { value: undefined, contains: false };
	}
}

let _KeyValueCollection = class extends IEnumerable {
	constructor(dictionary, property) {
		super(function* () {
			for (let t of dictionary) yield t[property];
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

Dictionary.KeyCollection = class extends _KeyValueCollection {
	constructor(dictionary) {
		super(dictionary, "Key");
	}
};

Dictionary.ValueCollection = class extends _KeyValueCollection {
	constructor(dictionary) {
		super(dictionary, "Value");
	}
};

module.exports = { Dictionary };
