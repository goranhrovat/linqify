var { Dictionary, Enumerable, EqualityComparers } = process.env.LINQIFY_PATH
	? require("../../" + process.env.LINQIFY_PATH)
	: require("../linqify");
//var {Dictionary, Enumerable} = require('../../src/linqify');

let comparer = {
	Equals: (a, b) => a.a === b.a,
	GetHashCode: (a) => a.a,
};

let comparerCollision = {
	Equals: (a, b) => a.a === b.a,
	GetHashCode: (a) => 1,
};

test("Dictionary", () => {
	let dictColl = new Dictionary(comparerCollision);
	dictColl.Add({ a: "test" }, 1);
	expect(() => dictColl.Add({ a: "test" }, 1)).toThrow("Key already exists");
	dictColl.Add({ a: "test2" }, 2);
	dictColl.Add({ a: "test4" }, 4);

	expect(dictColl.ContainsKey({ a: "test2" })).toBeTruthy();

	expect(dictColl.Remove({ a: "test" })).toBeTruthy();
	expect(dictColl.Remove({ a: "test3" })).toBeFalsy();

	dictColl.Set({ a: "test4" }, 44);
	expect(dictColl.Get({ a: "test4" })).toBe(44);

	expect(dictColl.TryGetValue({ a: "test4" })).toEqual({
		contains: true,
		value: 44,
	});

	let dict0 = new Dictionary();
	expect(dict0.Comparer).toBe(EqualityComparers.PrimitiveComparer);
	let dict = new Dictionary(comparer);
	expect(dict.Comparer).toBe(comparer);
	dict.Add({ a: "test" }, 1);
	dict.Add({ a: "test2" }, 2);
	expect(dict.CountNative).toBe(2);
	expect(() => dict.Add({ a: "test" }, 1)).toThrow("Key already exists");
	expect(() => dict.Get({ a: "test3" })).toThrow("Key does not exist");
	expect(dict.Get({ a: "test" })).toBe(1);
	expect(dict.ContainsKey({ a: "test" })).toBeTruthy();
	expect(dict.ContainsKey({ a: "test3" })).toBeFalsy();
	expect(dict.ToArray()).toStrictEqual([
		{ Key: { a: "test" }, Value: 1 },
		{ Key: { a: "test2" }, Value: 2 },
	]);

	let dictIter = dict[Symbol.iterator]();
	dictIter.next();
	let val = dictIter.next();
	expect(val.value.Key).toEqual({ a: "test2" });
	expect(val.value.Value).toEqual(2);

	var keys = dict.Keys;
	var vals = dict.Values;
	dict.Add({ a: "test3" }, 3);
	expect(keys.ToArray()).toEqual([
		{ a: "test" },
		{ a: "test2" },
		{ a: "test3" },
	]);
	expect(vals.ToArray()).toEqual([1, 2, 3]);

	expect(dict.ContainsValue(1)).toBeTruthy();
	expect(dict.ContainsValue(15)).toBeFalsy();

	expect(dict.Remove({ a: "test4" })).toBeFalsy();
	expect(dict.Remove({ a: "test2" })).toBeTruthy();
	expect(dict.CountNative).toBe(2);
	expect(vals.ToArray()).toEqual([1, 3]);

	expect(dict.TryGetValue({ a: "test3" })).toEqual({
		value: 3,
		contains: true,
	});
	expect(dict.TryGetValue({ a: "test13" })).toEqual({
		value: undefined,
		contains: false,
	});

	expect(keys.CountNative).toBe(2);
	expect(vals.CountNative).toBe(2);

	var keysArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	keys.CopyTo(keysArr, 4);
	expect(keysArr).toEqual([1, 2, 3, 4, { a: "test" }, { a: "test3" }, 7, 8, 9]);

	vals.CopyTo(keysArr, 4);
	expect(keysArr).toEqual([1, 2, 3, 4, 1, 3, 7, 8, 9]);

	dict.Clear();
	expect(dict.CountNative).toBe(0);
	expect(vals.ToArray()).toEqual([]);

	let dict3 = new Dictionary(
		[
			{ Key: 1, Value: "1" },
			{ Key: 2, Value: "2" },
			{ Key: 3, Value: "3" },
		],
		null
	);
	expect(dict3.ToArray()).toEqual([
		{ Key: 1, Value: "1" },
		{ Key: 2, Value: "2" },
		{ Key: 3, Value: "3" },
	]);
	let dict4 = new Dictionary(
		Enumerable.From([
			{ Key: 1, Value: "1" },
			{ Key: 2, Value: "2" },
			{ Key: 3, Value: "3" },
		])
	);
	expect(dict4.ToArray()).toEqual([
		{ Key: 1, Value: "1" },
		{ Key: 2, Value: "2" },
		{ Key: 3, Value: "3" },
	]);
	let dict5 = new Dictionary(dict4);
	expect(dict5.ToArray()).toEqual([
		{ Key: 1, Value: "1" },
		{ Key: 2, Value: "2" },
		{ Key: 3, Value: "3" },
	]);

	let dict8 = new Dictionary(null);
	expect(dict8.TryAdd(1, "1")).toBeTruthy();
	expect(dict8.TryAdd(1, "1")).toBeFalsy();
	dict8.Set(1, "test1");
	dict8.Set(2, "test2");
	expect(dict8.ToArray()).toEqual([
		{ Key: 1, Value: "test1" },
		{ Key: 2, Value: "test2" },
	]);
});
