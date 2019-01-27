/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

const { getType, defaultVal } = require("../Utils/TypeUtils");
const { EqualityComparers } = require("../Utils/EqualityComparers");

const { Enumerable } = require("../Sequence/Enumerable");
const { HashSet } = require("../DataStructures/HashSet");
const { Dictionary } = require("../DataStructures/Dictionary");
const { Lookup } = require("../DataStructures/Lookup");

let setMtd = Enumerable.setMethod;
/**
 seed, func, resultSelector
 seed func
 func
 */
setMtd("Aggregate", function(arg1, arg2, resultSelector = t => t) {
	let fun, seed;
	let thisIterator = this[Symbol.iterator]();
	let val = thisIterator.next();
	if (val.done) throw "Source contains no elements";
	if (getType(arg1) === "function") {
		// first argument is accumulator function and is only argument
		seed = defaultVal(getType(val.value));
		fun = arg1;
	} else {
		// first argument is seed, second is accumulator function and third is optional resultSelector
		seed = arg1;
		fun = arg2;
	}

	for (let t of this) seed = fun(seed, t);

	return resultSelector(seed);
});

setMtd("All", function(predicate) {
	for (let t of this) {
		if (!predicate(t)) return false;
	}
	return true;
});

setMtd("Any", function(predicate = _t => true) {
	for (let t of this) if (predicate(t)) return true;
	return false;
});

setMtd("Append", function*(element) {
	yield* this;
	yield element;
});

setMtd("AsEnumerable", function*() {
	yield* this;
});

setMtd("Average", function(selector = t => t) {
	let count = 0;
	let sum = 0;
	for (let t of this) {
		if (t != null) {
			count++;
			sum += selector(t);
		}
	}
	return sum / count;
});

setMtd("Cast", function*() {
	yield* this;
});

setMtd("Concat", function*(second) {
	if (second == undefined || second == null) throw "Second is null";
	yield* this;
	yield* second;
});

setMtd("Contains", function(
	value,
	comparer = EqualityComparers.PrimitiveComparer
) {
	for (let t of this) if (comparer.Equals(value, t)) return true;
	return false;
});

setMtd("Count", function(predicate = _t => true) {
	let cur = 0;

	for (let t of this) if (predicate(t)) cur++;
	return cur;
});

setMtd("DefaultIfEmpty", function*(defaultValue = null) {
	let val = this[Symbol.iterator]().next();
	if (val.done) yield defaultValue;
	else yield* this;
});

setMtd("Distinct", function*(comparer = EqualityComparers.PrimitiveComparer) {
	let hashset = new HashSet(comparer);
	for (let t of this) if (hashset.Add(t)) yield t;
});

setMtd("ElementAt", function(index) {
	if (index >= 0) {
		let cur = 0;
		for (let t of this) {
			if (cur++ === index) return t;
		}
	}
	throw "Out of range";
});

setMtd("ElementAtOrDefault", function(index, defaultValue = null) {
	let cur = 0;
	for (let t of this) {
		if (cur++ === index) return t;
	}
	return defaultValue;
});

setMtd("Except", function*(
	second,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let sec = Enumerable.From(second).ToHashSet(comparer);
	for (let t of this) if (sec.Add(t)) yield t;
});

setMtd("First", function(predicate = _t => true) {
	for (let t of this) if (predicate(t)) return t;
	throw "No first element";
});

setMtd("FirstOrDefault", function(predicate = _t => true, defaultValue = null) {
	for (let t of this) if (predicate(t)) return t;
	return defaultValue;
});

setMtd("ForEach", function(callback) {
	let ind = 0;
	for (let t of this) callback(t, ind++);
});

/**
 * 1). keySelector (source => key), elementSelector (source => element), resultSelector (key, elemList)
 * 2). keySelector, elementSelector, resultSelector, comparer
 * 3). keySelector, elementSelector
 * 4). keySelector, elementSelector, comparer
 * 5) keySelector, resultSelector
 * 6) keySelector, resultSelector, comparer
 * 7) keySelector
 * 8) keySelector, comparer
 */
setMtd("GroupBy", function(
	keySelector,
	arg2,
	arg3,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let elementSelector = t => t;
	let resultSelector = (key, elemList) => elemList;
	if (arg2 === undefined) {
		// 7
	} else if (getType(arg2) === "Object") {
		// 8
		comparer = arg2;
	} else if (arg2.length === 1) {
		// 1-4
		elementSelector = arg2;
		if (arg3 !== undefined) {
			if (getType(arg3) === "Object") comparer = arg3;
			// 4
			else resultSelector = arg3; // 1,2
		}
		// 3
	} else if (arg2.length === 2) {
		// 5,6
		resultSelector = arg2; // 5
		if (getType(arg3) === "Object") comparer = arg3; // 6
	}

	return this.ToLookup(keySelector, elementSelector, comparer).Select(g =>
		resultSelector(g.Key, g)
	);
});

// Left Outer JOIN
setMtd("GroupJoin", function*(
	inner,
	outerKeySelector,
	innerKeySelector,
	resultSelector,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let lookup = Enumerable.From(inner).ToLookup(innerKeySelector, comparer);
	for (let outerElem of this) {
		yield resultSelector(outerElem, lookup.Get(outerKeySelector(outerElem)));
	}
	//return this.Select(outerElem => resultSelector(outerElem, lookup.Get(outerKeySelector(outerElem))));
});

setMtd("Intersect", function*(
	second,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let first = this.ToHashSet(comparer);
	for (let t of second) {
		let val = first.TryGetValue(t);
		if (val.contains) {
			first.Remove(t);
			yield val.actualValue;
		}
	}
});

// Inner Join
setMtd("Join", function*(
	inner,
	outerKeySelector,
	innerKeySelector,
	resultSelector,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let lookup = Enumerable.From(inner).ToLookup(innerKeySelector, comparer);
	for (let outerElem of this) {
		for (let innerElem of lookup.Get(outerKeySelector(outerElem))) {
			yield resultSelector(outerElem, innerElem);
		}
	}
	//return this.SelectMany(outerElem => lookup.Get(outerKeySelector(outerElem)), resultSelector);
});

setMtd("Last", function(predicate = _t => true) {
	let last;
	let notfound = true;
	for (let t of this)
		if (predicate(t)) {
			last = t;
			notfound = false;
		}
	if (notfound) throw "No last element";
	return last;
});

setMtd("LastOrDefault", function(predicate = _t => true, defaultValue = null) {
	let last = defaultValue;
	for (let t of this) if (predicate(t)) last = t;
	return last;
});

setMtd("Max", function(selector = t => t) {
	let thisIterator = this[Symbol.iterator]();
	let val = thisIterator.next();
	if (val.done) throw "Source contains no elements";
	let myval = selector(val.value);

	for (let t of this) if (selector(t) > myval) myval = selector(t);

	return myval;
});

setMtd("Min", function(selector = t => t) {
	let thisIterator = this[Symbol.iterator]();
	let val = thisIterator.next();
	if (val.done) throw "Source contains no elements";
	let myval = selector(val.value);

	for (let t of this) if (selector(t) < myval) myval = selector(t);

	return myval;
});

setMtd("OfType", function(type) {
	return this.Where(t => getType(t) === type);
});

setMtd("Prepend", function*(element) {
	yield element;
	yield* this;
});

setMtd("Reverse", function*() {
	var arr = [...this];
	var i = arr.length;
	while (i--) yield arr[i];
});

setMtd("Select", function*(selector) {
	let ind = 0;
	for (let t of this) yield selector(t, ind++);
});

/**
 * collectionSelector (t), resultSelector
 * collectionSelector (t, i), resultSelector
 * collectionSelector (t)
 * collectionSelector (t, i)
 */
setMtd("SelectMany", function*(
	collectionSelector,
	resultSelector = (list, item) => item
) {
	let ind = 0;
	for (let list of this) {
		for (let item of collectionSelector(list, ind++)) {
			yield resultSelector(list, item);
		}
	}
});

setMtd("SequenceEqual", function(
	second,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let thisIterator = this[Symbol.iterator]();
	let secondIterator = second[Symbol.iterator]();
	// eslint-disable-next-line no-constant-condition
	while (true) {
		let val1 = thisIterator.next();
		let val2 = secondIterator.next();
		if (val1.done != val2.done) return false;
		if (val1.done) return true;
		if (!comparer.Equals(val1.value, val2.value)) return false;
	}
});

setMtd("Single", function(predicate = _t => true) {
	let thisIterator = this.Where(predicate)[Symbol.iterator]();
	let val = thisIterator.next();
	if (val.done) throw "No element";
	if (!thisIterator.next().done) throw "More than 1 element";
	return val.value;
});

setMtd("SingleOrDefault", function(
	predicate = _t => true,
	defaultValue = null
) {
	let thisIterator = this.Where(predicate)[Symbol.iterator]();
	let val = thisIterator.next();
	if (val.done) return defaultValue;
	if (!thisIterator.next().done) throw "More than 1 element";
	return val.value;
});

setMtd("Skip", function*(count) {
	let cur = 0;
	for (let t of this) {
		if (cur >= count) yield t;
		else cur++;
	}
});

setMtd("SkipLast", function(count) {
	return this.Take(this.Count() - count);
});

setMtd("SkipWhile", function*(predicate) {
	let thisIterator = this[Symbol.iterator]();
	let val = thisIterator.next();
	let ind = 0;
	while (!val.done && predicate(val.value, ind++)) {
		val = thisIterator.next();
	}

	while (!val.done) {
		yield val.value;
		val = thisIterator.next();
	}
});

setMtd("Sum", function(selector = t => t) {
	let sum = 0;
	for (let t of this) sum += selector(t);
	return sum;
});

setMtd("Take", function*(count) {
	let cur = 0;
	for (let t of this) {
		if (cur++ < count) yield t;
		else break;
	}
});

setMtd("TakeLast", function(count) {
	return this.Skip(this.Count() - count);
});

setMtd("TakeWhile", function*(predicate) {
	let ind = 0;
	for (let t of this) {
		if (predicate(t, ind++)) yield t;
		else break;
	}
});

setMtd("ToArray", function() {
	return [...this];
});

/**
 * 
keySel, elemSelect
keySel, elemSelect, comparer
keySel
keySel, comparer
*/
setMtd("ToDictionary", function(
	keySelector,
	arg2 = t => t,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let elementSelector;
	if (getType(arg2) === "Object") {
		elementSelector = t => t;
		comparer = arg2;
	} else {
		elementSelector = arg2;
	}
	return new Dictionary(
		this.Select(t => ({ Key: keySelector(t), Value: elementSelector(t) })),
		comparer
	);
});

setMtd("ToHashSet", function(comparer = EqualityComparers.PrimitiveComparer) {
	return new HashSet(this, comparer);
});

/**
 * keySel, elemSel
 * keySel, elemSel, comparer
 * keySel
 * keySel, comparer
 */
setMtd("ToLookup", function(
	keySelector,
	arg2 = t => t,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let elementSelector;
	if (getType(arg2) === "Object") {
		elementSelector = t => t;
		comparer = arg2;
	} else {
		elementSelector = arg2;
	}
	return new Lookup(
		this.Select(t => ({ Key: keySelector(t), Value: elementSelector(t) })),
		comparer
	);
});

setMtd("ToMap", function(keySelector, elementSelector = t => t) {
	return new Map(this.Select(t => [keySelector(t), elementSelector(t)]));
});

setMtd("ToSet", function() {
	return new Set(this);
});

setMtd("Union", function*(
	second,
	comparer = EqualityComparers.PrimitiveComparer
) {
	let hashset = new HashSet(comparer);
	for (let t of this) if (hashset.Add(t)) yield t;
	for (let t of second) if (hashset.Add(t)) yield t;
});

setMtd("Where", function*(predicate) {
	let ind = 0;
	for (let t of this) if (predicate(t, ind++)) yield t;
});

setMtd("Zip", function*(second, resultSelector) {
	if (second == undefined || second == null) throw "Second is null";
	let thisIterator = this[Symbol.iterator]();
	let secondIterator = second[Symbol.iterator]();
	while (true) {
		let val1 = thisIterator.next();
		if (val1.done) break;
		let val2 = secondIterator.next();
		if (val2.done) break;
		yield resultSelector(val1.value, val2.value);
	}
});
