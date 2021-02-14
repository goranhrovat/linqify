var { HashSet, Enumerable } = process.env.LINQIFY_PATH
	? require("../../" + process.env.LINQIFY_PATH)
	: require("../linqify");
//var {HashSet, Enumerable} = require('../../src/linqify');

let comparer = {
	Equals: (a, b) => a.a === b.a,
	GetHashCode: (a) => a.a,
};

let comparerCollision = {
	Equals: (a, b) => a.a === b.a,
	GetHashCode: (a) => 1,
};

test("HashSet", () => {
	let hashsetColl = new HashSet(comparerCollision);
	expect(hashsetColl.Add({ a: "test" })).toBeTruthy();
	expect(hashsetColl.Add({ a: "test2" })).toBeTruthy();
	expect(hashsetColl.Remove({ a: "test" })).toBeTruthy();
	expect(hashsetColl.Remove({ a: "test" })).toBeFalsy();

	expect(hashsetColl.ContainsNative({ a: "test2" })).toBeTruthy();
	expect(hashsetColl.ContainsNative({ a: "test" })).toBeFalsy();

	expect(hashsetColl.TryGetValue({ a: "test" })).toEqual({
		actualValue: undefined,
		contains: false,
	});
	expect(hashsetColl.TryGetValue({ a: "test2" })).toEqual({
		actualValue: { a: "test2" },
		contains: true,
	});

	let hashset = new HashSet(comparer);
	expect(hashset.Comparer).toBe(comparer);
	let added1 = hashset.Add({ a: "test" });
	let added2 = hashset.Add({ a: "test" });
	hashset.Add({ a: "test3" });
	expect(hashset.ContainsNative({ a: "test" })).toBeTruthy();
	expect(hashset.ContainsNative({ a: "test2" })).toBeFalsy();
	expect(added1).toBeTruthy();
	expect(added2).toBeFalsy();
	expect(hashset.CountNative).toBe(2);
	expect(hashset.ToArray()).toEqual([{ a: "test" }, { a: "test3" }]);
	let hashsetIter = hashset[Symbol.iterator]();
	hashsetIter.next();
	let val = hashsetIter.next();
	expect(val.value).toEqual({ a: "test3" });
	expect(hashset.Remove({ a: "test" })).toBeTruthy();
	expect(hashset.Remove({ a: "test" })).toBeFalsy();
	expect(hashset.ContainsNative({ a: "test" })).toBeFalsy();
	expect(hashset._data.has("test3")).toBeTruthy();
	expect(hashset.CountNative).toBe(1);
	expect(hashset.Remove({ a: "test3" })).toBeTruthy();
	expect(hashset._data.has("test")).toBeFalsy();
	expect(hashset.CountNative).toBe(0);

	hashset = new HashSet(null);
	expect(hashset.Add("test")).toBeTruthy();
	expect(hashset.Add("test")).toBeFalsy();
	expect(hashset.CountNative).toBe(1);

	let hs1 = new HashSet();
	hs1.Add(1);
	let hs2 = hs1.ToHashSet();
	hs2.Add(2);
	hs2.Add(3);

	var setArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	let hsRW = setArr.ToHashSet();
	hsRW.RemoveWhere((t) => t % 2 === 0);
	expect(hsRW.ToArray()).toEqual([1, 3, 5, 7, 9]);

	hs2.CopyTo(setArr, 4);
	expect(setArr).toEqual([1, 2, 3, 4, 1, 2, 3, 8, 9]);
	hs2.CopyTo(setArr, 5, 2);
	expect(setArr).toEqual([1, 2, 3, 4, 1, 1, 2, 8, 9]);

	hs2.CopyTo(setArr);
	expect(setArr).toEqual([1, 2, 3, 4, 1, 1, 2, 8, 9]);

	hs2.Remove(1);
	expect(hs1.CountNative).toBe(1);
	expect(hs2.CountNative).toBe(2);

	hs2.Clear();
	expect(hs2.CountNative).toBe(0);

	let hs3 = new HashSet([1, 2, 2, 8, 3, 4, 8], null);
	expect(hs3.ToArray()).toEqual([1, 2, 8, 3, 4]);
	let hs4 = new HashSet(Enumerable.From([1, 2, 2, 8, 3, 4, 8]));
	expect(hs4.ToArray()).toEqual([1, 2, 8, 3, 4]);
	let hs5 = new HashSet(hs4);
	expect(hs5.ToArray()).toEqual([1, 2, 8, 3, 4]);

	var hs7 = new HashSet([hs3, hs4, hs5]);
	var hs8 = new HashSet([hs4, hs3.ToHashSet(), hs5]);
	expect(hs7.SequenceEqual(hs8, hs7.CreateSetComparer())).toBeTruthy();

	var hsOfSets = new HashSet(hs7.CreateSetComparer());
	expect(hsOfSets.Add(new HashSet([1, 2, 2, 8, 3, 4, 8]))).toBeTruthy();
	expect(hsOfSets.Add(new HashSet([1, 2, 2, 8, 3, 4, 8]))).toBeFalsy();
});

test("HashSet set operations", () => {
	let hs1 = new HashSet(comparer);
	hs1.Add({ a: "test1" });
	hs1.Add({ a: "test2" });
	hs1.Add({ a: "test3" });

	let hs2 = new HashSet(comparer);
	hs2.Add({ a: "test2" });
	hs2.Add({ a: "test3" });
	hs2.Add({ a: "test4" });

	let hs3 = new HashSet(comparer);
	hs3.Add({ a: "test2" });
	hs3.Add({ a: "test4" });
	hs3.Add({ a: "test3" });

	let hs4 = new HashSet(comparer);
	hs4.Add({ a: "test2" });
	hs4.Add({ a: "test3" });
	hs4.Add({ a: "test4" });
	hs4.Add({ a: "test5" });

	let hs5 = new HashSet(comparer);
	hs5.Add({ a: "test2" });
	hs5.Add({ a: "test3" });

	let hs6 = new HashSet(comparer);
	hs6.Add({ a: "test6" });
	hs6.Add({ a: "test7" });

	let hs11 = hs1.ToHashSet(comparer);
	hs11.ExceptWith(hs2);
	expect(hs11.ToArray()).toEqual([{ a: "test1" }]);

	hs11 = hs1.ToHashSet(comparer);
	hs11.IntersectWith(hs2);
	expect(hs11.ToArray()).toEqual([{ a: "test2" }, { a: "test3" }]);

	let hs21 = hs2.ToHashSet(comparer);
	expect(hs21.IsProperSubsetOf(hs4)).toBeTruthy();
	expect(hs21.IsProperSubsetOf(hs3)).toBeFalsy();
	expect(hs21.IsSubsetOf(hs4)).toBeTruthy();
	expect(hs21.IsSubsetOf(hs3)).toBeTruthy();
	expect(hs21.IsSubsetOf(hs1)).toBeFalsy();
	expect(hs21.IsProperSupersetOf(hs5)).toBeTruthy();
	expect(hs21.IsProperSupersetOf(hs3)).toBeFalsy();
	expect(hs21.IsSupersetOf(hs3)).toBeTruthy();
	expect(hs21.IsSupersetOf(hs5)).toBeTruthy();
	expect(hs21.IsSupersetOf(hs4)).toBeFalsy();

	expect(new HashSet().IsProperSupersetOf(hs11)).toBeFalsy();

	expect(hs21.Overlaps(hs1)).toBeTruthy();
	expect(hs21.Overlaps(hs6)).toBeFalsy();

	expect(hs2.SetEquals(hs3)).toBeTruthy();
	expect(hs2.SetEquals(hs5)).toBeFalsy();

	expect(hs5.SetEquals(hs2)).toBeFalsy();

	hs11 = hs1.ToHashSet(comparer);
	hs11.SymmetricExceptWith(hs2);
	expect(hs11.ToArray()).toEqual([{ a: "test1" }, { a: "test4" }]);

	hs11 = hs1.ToHashSet(comparer);
	hs11.UnionWith(hs2);
	expect(hs11.ToArray()).toEqual([
		{ a: "test1" },
		{ a: "test2" },
		{ a: "test3" },
		{ a: "test4" },
	]);

	let hsTGV = new HashSet(comparer);
	hsTGV.Add({ a: "test1" });
	hsTGV.Add({ a: "test2", b: "bVal" });
	hsTGV.Add({ a: "test3" });

	let tgv1 = hsTGV.TryGetValue({ a: "test2" });
	let tgv2 = hsTGV.TryGetValue({ a: "test20" });

	expect(tgv1).toEqual({
		contains: true,
		actualValue: { a: "test2", b: "bVal" },
	});
	expect(tgv2).toEqual({ contains: false, actualValue: undefined });
});
