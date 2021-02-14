process.env.LINQIFY_PATH
	? require("../../" + process.env.LINQIFY_PATH)
	: require("../linqify");
//require('../../src/linqify');

const { Lookup } = require("./Lookup");

let comparer = {
	Equals: (a, b) => a.a === b.a,
	GetHashCode: (a) => a.a,
};

test("Lookup", () => {
	let myLookup = new Lookup([
		{ Key: { a: "a" }, Value: "a" },
		{ Key: { a: "a" }, Value: "a" },
	]);
	expect(myLookup.CountNative).toBe(2);

	expect(
		[1, 2, 3]
			.ToLookup((t) => t)
			.Select((t) => ({ K: t.Key, S: t.Sum() }))
			.ToArray()
	).toEqual([
		{ K: 1, S: 1 },
		{ K: 2, S: 2 },
		{ K: 3, S: 3 },
	]);

	let arr = [
		[{ a: "test" }, 1],
		[{ a: "test2" }, 2],
		[{ a: "test2" }, 3],
		[{ a: "test3" }, 1],
		[{ a: "test3" }, 1],
	];
	var lookup = arr.ToLookup(
		(t) => t[0],
		(t) => t[1],
		comparer
	);
	expect(lookup.CountNative).toBe(3);
	expect(
		lookup
			.ToArray()
			.Select((t) => [t.Key, [...t]])
			.ToArray()
	).toEqual([
		[{ a: "test" }, [1]],
		[{ a: "test2" }, [2, 3]],
		[{ a: "test3" }, [1, 1]],
	]);
	expect(lookup.Get({ a: "test4" }).ToArray()).toEqual([]);
	expect(lookup.Get({ a: "test2" }).ToArray()).toEqual([2, 3]);
	expect(lookup.ContainsNative({ a: "test4" })).toBeFalsy();
	expect(lookup.ContainsNative({ a: "test3" })).toBeTruthy();

	expect(
		lookup.ApplyResultSelector((k, c) => [k, c.Average()]).ToArray()
	).toEqual([
		[{ a: "test" }, 1],
		[{ a: "test2" }, 2.5],
		[{ a: "test3" }, 1],
	]);

	let lookIter = lookup[Symbol.iterator]();
	lookIter.next();
	let val = lookIter.next();
	expect(val.value.Key).toEqual({ a: "test2" });
	expect([...val.value]).toEqual([2, 3]);
});
