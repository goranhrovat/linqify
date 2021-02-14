const { getType } = require("../Utils/TypeUtils");
const { SortComparers } = require("../Utils/SortComparers");
const { IEnumerable } = require("../Sequence/IEnumerable");

class List extends IEnumerable {
	/**
	 * ()
	 * source
	 * source, comparer
	 * comparer
	 */
	constructor(arg1, comparer) {
		super(function* () {
			for (let t of this._data) yield t;
		});
		this._data = [];
		this._comparer = comparer || SortComparers.DefaultComparer;
		if (arg1 !== undefined) {
			if (getType(arg1) === "function" || getType(arg1) === "null") {
				// 4
				this._comparer = arg1 || SortComparers.DefaultComparer;
			} else {
				// 2, 3
				for (let t of arg1) this.Add(t);
			}
			// 1
		}
	}

	get Comparer() {
		return this._comparer;
	}

	get CountNative() {
		return this._data.length;
	}

	Get(index) {
		if (index < 0 || index >= this.CountNative)
			throw new Error("Index not valid");
		return this._data[index];
	}

	Set(index, item) {
		if (index < 0 || index >= this.CountNative)
			throw new Error("Index not valid");
		this._data[index] = item;
	}

	Add(item) {
		this._data.push(item);
	}

	AddRange(collection) {
		for (let t of collection) this.Add(t);
	}

	/**
	 * item
	 * item, IComparer
	 * index, count, item, IComparer
	 */
	BinarySearch(...args) {
		let item;
		let comparer = this._comparer;
		let index = 0;
		let count = this.CountNative;
		if (args.length === 1) {
			[item] = args;
		} else if (args.length === 2) {
			[item, comparer] = args;
		} else if (args.length === 4) {
			[index, count, item, comparer] = args;
			comparer = comparer || this._comparer;
		} else {
			throw new Error("Wrong number of arguments");
		}

		if (index < 0 || count < 0 || index + count > this.CountNative)
			throw new Error("Not a valid range");

		let start = index;
		let stop = index + count - 1;

		let middle;
		while (start <= stop) {
			middle = Math.floor((start + stop) / 2);

			let cmpRes = comparer(item, this._data[middle]);
			if (cmpRes === 0) return middle;
			if (cmpRes < 0) stop = middle - 1;
			else start = middle + 1;
		}

		return ~start; // same as -start-1
	}

	Clear() {
		this._data.length = 0;
	}

	ContainsNative(item) {
		return this.Any((t) => this._comparer(item, t) === 0);
	}

	ConvertAll(converter) {
		return this.Select(converter).ToList();
	}

	/**
	 * array, arrayIndex
	 * index, array, arrayIndex, count
	 * array
	 */
	CopyTo(...args) {
		let array;
		let arrayIndex = 0;
		let index = 0;
		let count = this.CountNative;

		if (args.length === 1) {
			[array] = args;
		} else if (args.length === 2) {
			[array, arrayIndex] = args;
		} else if (args.length === 4) {
			[index, array, arrayIndex, count] = args;
		} else {
			throw new Error("Wrong number of arguments");
		}

		if (
			index < 0 ||
			arrayIndex < 0 ||
			count < 0 ||
			index + count > this.CountNative ||
			arrayIndex + count > array.length
		)
			throw new Error("Not a valid range");

		for (let i = 0; i < count; i++) {
			array[arrayIndex + i] = this._data[index + i];
		}
	}

	Exists(match) {
		return this.Any(match);
	}

	Find(match, defaultValue = null) {
		return this.FirstOrDefault(match, defaultValue);
	}

	FindAll(match) {
		return this.Where(match).ToList(this._comparer);
	}

	/**
	 * match
	 * startIndex, match
	 * startIndex, count, match
	 */
	FindIndex(...args) {
		let match;
		let startIndex = 0;
		let count = this.CountNative - startIndex;

		if (args.length === 1) {
			[match] = args;
		} else if (args.length === 2) {
			[startIndex, match] = args;
			count = this.CountNative - startIndex;
		} else if (args.length === 3) {
			[startIndex, count, match] = args;
		} else {
			throw new Error("Wrong number of arguments");
		}

		if (startIndex < 0 || count < 0 || startIndex + count > this.CountNative)
			throw new Error("Not a valid range");

		for (let i = startIndex; i < startIndex + count; i++) {
			if (match(this._data[i])) return i;
		}
		return -1;
	}

	FindLast(match, defaultValue = null) {
		return this.LastOrDefault(match, defaultValue);
	}

	/**
	 * match
	 * startIndex, match
	 * startIndex, count, match
	 */
	FindLastIndex(...args) {
		let match;
		let startIndex = 0;
		let count = this.CountNative - startIndex;

		if (args.length === 1) {
			[match] = args;
		} else if (args.length === 2) {
			[startIndex, match] = args;
			count = this.CountNative - startIndex;
		} else if (args.length === 3) {
			[startIndex, count, match] = args;
		} else {
			throw new Error("Wrong number of arguments");
		}

		if (startIndex < 0 || count < 0 || startIndex + count > this.CountNative)
			throw new Error("Not a valid range");

		let last_i = -1;
		for (let i = startIndex; i < startIndex + count; i++) {
			if (match(this._data[i])) last_i = i;
		}
		return last_i;
	}

	// ForEach

	GetRange(index, count) {
		if (index < 0 || count < 0 || index + count > this.CountNative)
			throw new Error("Not a valid range");

		return new List(this.Skip(index).Take(count), this._comparer);
	}

	/**
	 * item, index
	 * item, index, count
	 * item
	 */
	IndexOf(item, index = 0, count = this.CountNative - index) {
		if (index < 0 || count < 0 || index + count > this.CountNative)
			throw new Error("Not a valid range");

		for (let i = index; i < index + count; i++) {
			if (this._comparer(item, this._data[i]) === 0) return i;
		}
		return -1;
	}

	Insert(index, item) {
		if (index < 0 || index > this.CountNative)
			throw new Error("Not a valid range");

		this._data.splice(index, 0, item);
	}

	InsertRange(index, collection) {
		if (index < 0 || index > this.CountNative)
			throw new Error("Not a valid range");

		if (getType(collection) != "Array") collection = [...collection];
		var args = [index, 0].concat(collection);
		this._data.splice.apply(this._data, args);
	}

	/**
	 * item
	 * item, index
	 * item, index, count
	 */
	LastIndexOf(item, index = 0, count = this.CountNative - index) {
		if (index < 0 || count < 0 || index + count > this.CountNative)
			throw new Error("Not a valid range");

		let foundInd = -1;
		for (let i = index; i < index + count; i++) {
			if (this._comparer(item, this._data[i]) === 0) foundInd = i;
		}
		return foundInd;
	}

	Remove(item) {
		for (let i = 0; i < this.CountNative; i++) {
			if (this._comparer(item, this._data[i]) === 0) {
				this._data.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	RemoveAll(match) {
		let oldCount = this.CountNative;
		this._data = this._data.filter((t) => !match(t));
		return oldCount - this.CountNative;
	}

	RemoveAt(index) {
		if (index < 0 || index >= this.CountNative)
			throw new Error("Not a valid range");
		this._data.splice(index, 1);
	}

	RemoveRange(index, count) {
		if (index < 0 || count < 0 || index + count > this.CountNative)
			throw new Error("Not a valid range");
		this._data.splice(index, count);
	}

	/**
	 * ()
	 * index, count
	 */
	ReverseNative(index = 0, count = this.CountNative - index) {
		if (index < 0 || count < 0 || index + count > this.CountNative)
			throw new Error("Not a valid range");

		if (index === 0 && count === this.CountNative) {
			this._data.reverse();
		} else {
			this._data = this._data
				.slice(0, index)
				.concat(
					this._data.slice(index, index + count).reverse(),
					this._data.slice(index + count, this.CountNative)
				);
		}
	}

	/**
	 * IComparer
	 * index, count, IComparer
	 * ()
	 */
	Sort(...args) {
		let index = 0;
		let count = this.CountNative - index;
		let comparer = this._comparer;

		if (args.length > 0) {
			if (args.length === 1) {
				[comparer] = args;
			} else if (args.length === 3) {
				[index, count, comparer] = args;
				comparer = comparer || this._comparer;
			} else {
				throw new Error("Wrong number of arguments");
			}
		}

		if (index < 0 || count < 0 || index + count > this.CountNative)
			throw new Error("Not a valid range");

		if (index === 0 && count === this.CountNative) {
			this._data.sort(comparer);
		} else {
			this._data = this._data
				.slice(0, index)
				.concat(
					this._data.slice(index, index + count).sort(comparer),
					this._data.slice(index + count, this.CountNative)
				);
		}
	}

	TrueForAll(match) {
		return this.All(match);
	}
}

module.exports = { List };
