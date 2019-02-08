var { Enumerable } = require("../Sequence/Enumerable");

const { getType } = require("../Utils/TypeUtils");
const { EqualityComparers } = require("../Utils/EqualityComparers");
const { IEnumerable } = require("../Sequence/IEnumerable");

class HashSet extends IEnumerable {
	/**
	 * ()
	 * source
	 * source, comparer
	 * comparer
	 */
	constructor(arg1, comparer = EqualityComparers.PrimitiveComparer) {
		super(function*() {
			for (let t of this.data) for (let k of t[1]) yield k;
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
			for (let t of arg1) this.Add(t);
		}
	}

	get Comparer() {
		return this.comparer;
	}

	get CountNative() {
		return this.count;
	}

	Add(item) {
		if (this.data.has(this.comparer.GetHashCode(item))) {
			for (let t of this.data.get(this.comparer.GetHashCode(item))) {
				if (this.comparer.Equals(t, item)) return false;
			}
			this.data.get(this.comparer.GetHashCode(item)).push(item);
		} else {
			this.data.set(this.comparer.GetHashCode(item), [item]);
		}
		this.count++;
		return true;
	}

	Clear() {
		this.data.clear();
		this.count = 0;
	}

	ContainsNative(item) {
		if (this.data.has(this.comparer.GetHashCode(item))) {
			for (let t of this.data.get(this.comparer.GetHashCode(item))) {
				if (this.comparer.Equals(t, item)) return true;
			}
		}
		return false;
	}

	CopyTo(array, arrayIndex = 0, count = this.count) {
		let i = 0;
		for (let t of this) {
			if (i >= count) break;
			array[arrayIndex + i] = t;
			i++;
		}
	}

	CreateSetComparer() {
		return {
			Equals: (x, y) => x.SetEquals(y),
			GetHashCode: obj => obj.CountNative
		};
	}

	ExceptWith(other) {
		// the same equality comparer as the current
		for (let t of other) this.Remove(t);
	}

	IntersectWith(other) {
		// the same equality comparer as the current
		let oth = Enumerable.From(other).ToHashSet(this.comparer);
		this.RemoveWhere(t => !oth.ContainsNative(t));
	}

	IsProperSubsetOf(other) {
		let numThisContains = 0,
			numThisNotContains = 0;
		for (let t of Enumerable.From(other).Distinct(this.comparer)) {
			this.ContainsNative(t) ? numThisContains++ : numThisNotContains++;
			if (numThisContains === this.CountNative && numThisNotContains > 0)
				return true;
		}
		return numThisContains === this.CountNative && numThisNotContains > 0;
	}

	IsProperSupersetOf(other) {
		if (this.CountNative === 0) return false;
		let numOther = 0;
		for (let t of Enumerable.From(other).Distinct(this.comparer)) {
			if (!this.ContainsNative(t) || this.CountNative <= ++numOther)
				return false;
		}
		return true;
	}

	IsSubsetOf(other) {
		let numThisContains = 0;
		for (let t of Enumerable.From(other).Distinct(this.comparer)) {
			if (this.ContainsNative(t)) numThisContains++;
			if (numThisContains === this.CountNative) return true;
		}
		return numThisContains === this.CountNative;
	}

	IsSupersetOf(other) {
		let numOther = 0;
		for (let t of Enumerable.From(other).Distinct(this.comparer)) {
			if (!this.ContainsNative(t) || this.CountNative < ++numOther)
				return false;
		}
		return true;
	}

	Overlaps(other) {
		return Enumerable.From(other).Any(t => this.ContainsNative(t));
	}

	Remove(item) {
		if (this.data.has(this.comparer.GetHashCode(item))) {
			let i = 0;
			for (let t of this.data.get(this.comparer.GetHashCode(item))) {
				if (this.comparer.Equals(t, item)) {
					this.data.get(this.comparer.GetHashCode(item)).splice(i, 1);
					if (this.data.get(this.comparer.GetHashCode(item)).length === 0) {
						this.data.delete(this.comparer.GetHashCode(item));
					}
					this.count--;
					return true;
				}
				i++;
			}
		}
		return false;
	}

	RemoveWhere(match) {
		let itemsToRemove = this.Where(match).ToArray();
		this.ExceptWith(itemsToRemove);
		return itemsToRemove.length;
	}

	SetEquals(other) {
		let num = 0;
		for (let t of Enumerable.From(other).Distinct(this.comparer)) {
			if (!this.ContainsNative(t)) return false;
			num++;
		}
		return num === this.CountNative;
	}

	SymmetricExceptWith(other) {
		Enumerable.From(other)
			.Distinct(this.comparer)
			.ForEach(t => (this.ContainsNative(t) ? this.Remove(t) : this.Add(t)));
	}

	TryGetValue(equalValue) {
		if (this.data.has(this.comparer.GetHashCode(equalValue))) {
			for (let t of this.data.get(this.comparer.GetHashCode(equalValue))) {
				if (this.comparer.Equals(t, equalValue))
					return { actualValue: t, contains: true };
			}
		}
		return { actualValue: undefined, contains: false };
	}

	UnionWith(other) {
		for (let t of other) this.Add(t);
	}
}

module.exports = { HashSet };
