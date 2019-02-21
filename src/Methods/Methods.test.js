/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
//// @ts-nocheck
var { Enumerable } = process.env.LINQIFY_PATH
	? require("../../" + process.env.LINQIFY_PATH)
	: require("../linqify");
//var {Enumerable, EqualityComparers} = require('../linqify');

let comparer = {
	Equals: (a, b) => a.a === b.a,
	GetHashCode: a => a.a
};

test("Aggregate", () => {
	expect(
		[1, 2, 3, 4, 5].ToHashSet().Aggregate(2, (seed, next) => seed + next)
	).toBe(17);
	expect(
		[1, 2, 3, 4, 5].Aggregate(2, (seed, next) => seed + next, t => t * 2)
	).toBe(34);
	expect([1, 2, 3, 4, 5].Aggregate((seed, next) => seed + next)).toBe(15);
	expect(() => [].Aggregate(2, (seed, next) => seed + next)).toThrow(
		"Source contains no elements"
	);

	let res1 = [["a", "b"], ["not here"], ["b", "c"]]
		.Aggregate(Enumerable.Empty(), (current, next) => current.Union(next))
		.ToArray();
	expect(res1).toEqual(["a", "b", "not here", "c"]);
	let res2 = [["a", "b"], ["not here"], ["b", "c"]]
		.Aggregate(Enumerable.Empty(), (current, next) =>
			current.Union([next.length])
		)
		.ToArray();
	expect(res2).toEqual([2, 1]);
	let res3 = [["a", "b"], ["not here"], ["b", "c"]]
		.Aggregate(Enumerable.Empty(), (current, next) =>
			next.length > 1 ? current.Union(next) : current
		)
		.ToArray();
	expect(res3).toEqual(["a", "b", "c"]);
});

test("All", () => {
	expect([true, true, true, true].All(t => t)).toBeTruthy();
	expect([true, false, true, true].All(t => t)).toBeFalsy();
	expect([4, 80, 1, 2, 3, 4, 5].All(t => t > 0)).toBeTruthy();
	expect([4, 80, 1, 2, 3, 4, 5].All(t => t > 3)).toBeFalsy();
	expect([].All(t => t > 3)).toBeTruthy();
});

test("Any", () => {
	expect([true, true, true, true].Any(t => t)).toBeTruthy();
	expect([null, true, false, true, true].Any(t => t)).toBeTruthy();
	expect([false, false, false, false].Any(t => t)).toBeFalsy();
	expect([4, 80, 1, 2, 3, 4, 5].Any(t => t > 10)).toBeTruthy();
	expect([4, 80, 1, 2, 3, 4, 5].Any(t => t > 500)).toBeFalsy();
	expect([].Any(t => t > 3)).toBeFalsy();
	expect([].Any()).toBeFalsy();
	expect([1, 2].Any()).toBeTruthy();
});

test("Append", () => {
	expect([1, 2, 3].Append(8).ToArray()).toEqual([1, 2, 3, 8]);
});

test("AsEnumerable", () => {
	expect([1, 2, 3].AsEnumerable().ToArray()).toEqual([1, 2, 3]);
});

test("Average", () => {
	expect(["1", "2", "3", "4", "5"].Average(t => parseInt(t))).toBe(3);
	expect([1, 2, 3, 4, 5].Average()).toBe(3);
	expect([1, 2, 3, 4, 5, null].Average()).toBe(3);
	expect([null].Average()).toBe(NaN);
});

test("Cast", () => {
	expect([1, 2, 3].Cast().ToArray()).toEqual([1, 2, 3]);
});

test("Concat", () => {
	expect(() => [1, 2, 3].Concat().ToArray()).toThrow();
	expect([1, 2, 3].Concat([5, 9, 6]).ToArray()).toEqual([1, 2, 3, 5, 9, 6]);
});

test("Contains", () => {
	expect([1, 2, 3].Contains(2)).toBeTruthy();
	expect([1, 2, 3].Contains(8)).toBeFalsy();
	expect([{ a: "test" }].Contains({ a: "test" }, comparer)).toBeTruthy();
});

test("Count", () => {
	expect([1, 2, 3, 4, 5].Count()).toBe(5);
	expect([1, 2, 3, 4, 5].Count(t => t > 2)).toBe(3);
});

test("Custom", () => {
	expect(
		[1, 2, 3].Custom(function() {
			let sum = 0;
			for (let t of this) sum += t;
			return sum * 2;
		})
	).toBe(12);

	expect(
		[1, 2, 3].Custom(source => {
			let sum = 0;
			for (let t of source) sum += t;
			return sum * 2;
		})
	).toBe(12);

	expect(
		[1, 2, 3]
			.Custom(function*() {
				// double adn select only bigger than 2
				for (let t of this) {
					if (t * 2 > 2) yield t * 2;
				}
			})
			.Select(t => t * 2)
			.ToArray()
	).toEqual([8, 12]);

	expect(
		[1, 2, 3]
			.Custom(function*(source) {
				// double adn select only bigger than 2
				for (let t of source) {
					if (t * 2 > 2) yield t * 2;
				}
			})
			.ToArray()
	).toEqual([4, 6]);
});

test("DefaultIfEmpty", () => {
	expect([1, 2, 3, 4, 5].DefaultIfEmpty(7).ToArray()).toEqual([1, 2, 3, 4, 5]);
	expect([].DefaultIfEmpty(7).ToArray()).toEqual([7]);
	expect([].DefaultIfEmpty().ToArray()).toEqual([null]);
});

test("Distinct", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Distinct().ToArray()).toEqual([
		4,
		1,
		2,
		3,
		5
	]);
	expect([].Distinct().ToArray()).toEqual([]);
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }].Distinct(comparer).ToArray()
	).toEqual([{ a: "test" }, { a: "test2" }]);
	expect("test".Distinct().ToArray()).toEqual(["t", "e", "s"]);
});

test("ElementAt", () => {
	expect(() => [4, 1, 1, 2, 3, 3, 4, 5, 2].ElementAt(50)).toThrow(
		"Out of range"
	);
	expect(() => [4, 1, 1, 2, 3, 3, 4, 5, 2].ElementAt(-50)).toThrow(
		"Out of range"
	);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].ElementAt(6)).toBe(4);
});

test("ElementAtOrDefault", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].ElementAtOrDefault(6)).toBe(4);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].ElementAtOrDefault(50)).toBe(null);
	expect([null].ElementAtOrDefault(50, "test")).toBe("test");
	expect([].ElementAtOrDefault(50)).toBe(null);
});

test("Except", () => {
	expect(() => [].Except(undefined).ToArray()).toThrow("Second is null");
	expect(() => [].Except(null).ToArray()).toThrow("Second is null");
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Except([4, 2, 3, 4, 8]).ToArray()).toEqual(
		[1, 5]
	);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Except([18, 25]).ToArray()).toEqual([
		4,
		1,
		2,
		3,
		5
	]);
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.Except([{ a: "test2" }], comparer)
			.ToArray()
	).toEqual([{ a: "test" }]);
});

test("First", () => {
	expect([1, 2, 3, 4, 5].First(t => t == 5)).toBe(5);
	expect([1, 2, 3, 4, 5].First()).toBe(1);
	expect(() => [].First()).toThrow("No first element");
	expect("test".First()).toBe("t");
});

test("FirstOrDefault", () => {
	expect([1, 2, 3, 4, 5].FirstOrDefault(t => t == 5)).toBe(5);
	expect([1, 2, 3, 4, 5].FirstOrDefault()).toBe(1);
	expect([].FirstOrDefault()).toBe(null);
	expect([].FirstOrDefault(_t => true, 5)).toBe(5);
});

test("ForEach", () => {
	const myfun = jest.fn();
	[1, 2, "a"].ForEach((t, i) => myfun(t, i));
	expect(myfun).toHaveBeenNthCalledWith(1, 1, 0);
	expect(myfun).toHaveBeenNthCalledWith(2, 2, 1);
	expect(myfun).toHaveBeenNthCalledWith(3, "a", 2);
});

test("GroupBy", () => {
	let arr = [
		{ name: "John", age: 15 },
		{ name: "Doe", age: 15 },
		{ name: "Jane", age: 12 }
	];
	let ageComparer = {
		Equals: (a, b) => a.age === b.age,
		GetHashCode: a => a.age
	};

	expect(
		[1, 2, 3, 4, 5, 9]
			.GroupBy(t => t % 2)
			.Select(t => ({ key: t.Key, avg: t.Average() }))
			.ToArray()
	).toEqual([{ avg: 4.5, key: 1 }, { avg: 3, key: 0 }]);

	// 1
	expect(
		arr
			.GroupBy(t => t.age, t => t.name, (key, elmList) => [key, [...elmList]])
			.ToArray()
	).toEqual([[15, ["John", "Doe"]], [12, ["Jane"]]]);
	// 2
	expect(
		arr
			.GroupBy(
				t => t,
				t => t.name,
				(key, elmList) => [key.age, [...elmList]],
				ageComparer
			)
			.ToArray()
	).toEqual([[15, ["John", "Doe"]], [12, ["Jane"]]]);
	// 3
	expect(
		arr
			.GroupBy(t => t.age, t => t.name)
			.Select(t => [t.Key, [...t]])
			.ToArray()
	).toEqual([[15, ["John", "Doe"]], [12, ["Jane"]]]);
	// 4
	expect(
		arr
			.GroupBy(t => t, t => t.name, ageComparer)
			.Select(t => [t.Key.age, [...t]])
			.ToArray()
	).toEqual([[15, ["John", "Doe"]], [12, ["Jane"]]]);
	// 5
	expect(
		arr
			.GroupBy(t => t.age, (key, elmList) => [key, elmList])
			.Select(t => [t[0], [...t[1]]])
			.ToArray()
	).toEqual([
		[15, [{ name: "John", age: 15 }, { name: "Doe", age: 15 }]],
		[12, [{ name: "Jane", age: 12 }]]
	]);
	// 6
	expect(
		arr
			.GroupBy(t => t, (key, elmList) => [key.age, elmList], ageComparer)
			.Select(t => [t[0], [...t[1]]])
			.ToArray()
	).toEqual([
		[15, [{ name: "John", age: 15 }, { name: "Doe", age: 15 }]],
		[12, [{ name: "Jane", age: 12 }]]
	]);
	// 7 and else
	expect(
		[1, 2, 3, 4, 5]
			.GroupBy(t => t % 2)
			.Select(t => [t.Key, [...t]])
			.ToArray()
	).toEqual([[1, [1, 3, 5]], [0, [2, 4]]]);

	// 8
	expect(
		[{ a: "test" }, { a: "test2" }, { a: "test" }]
			.GroupBy(t => t, comparer)
			.Select(t => [t.Key, [...t]])
			.ToArray()
	).toEqual([
		[{ a: "test" }, [{ a: "test" }, { a: "test" }]],
		[{ a: "test2" }, [{ a: "test2" }]]
	]);
	// else
	expect(() =>
		[1, 2, 3, 4, 5]
			.GroupBy(t => t % 2, (_a, _b, _c) => ({}))
			.Select(t => [t.Key, [...t]])
			.ToArray()
	).toThrow("Wrong arguments");
});

test("GroupJoin", () => {
	let people = [
		{ Name: "Hedlund, Magnus" },
		{ Name: "Adams, Terry" },
		{ Name: "Weiss, Charlotte" }
	];
	let nameComparer = {
		Equals: (a, b) => a.Name === b.Name,
		GetHashCode: a => a.Name
	};
	// 1 with comparer
	let pets = [
		{ Name: "Barley", Owner: { Name: "Adams, Terry" } },
		{ Name: "Boots", Owner: { Name: "Adams, Terry" } },
		{ Name: "Whiskers", Owner: { Name: "Weiss, Charlotte" } },
		{ Name: "Daisy", Owner: { Name: "Hedlund, Magnus" } }
	];

	let res = people
		.GroupJoin(
			pets,
			person => person,
			pet => pet.Owner,
			(person, petCollection) => ({
				OwnerName: person.Name,
				Pets: [
					petCollection
						.Select(pet => pet.Name)
						.Aggregate((seed, item) => seed + " " + item)
						.trim()
				]
			}),
			nameComparer
		)
		.ToArray();

	expect(res).toEqual([
		{ OwnerName: "Hedlund, Magnus", Pets: ["Daisy"] },
		{ OwnerName: "Adams, Terry", Pets: ["Barley Boots"] },
		{ OwnerName: "Weiss, Charlotte", Pets: ["Whiskers"] }
	]);

	// 2 without comparer
	let pets2 = [
		{ Name: "Barley", Owner: people[1] },
		{ Name: "Boots", Owner: people[1] },
		{ Name: "Whiskers", Owner: people[2] },
		{ Name: "Daisy", Owner: people[0] }
	];

	let res2 = people
		.GroupJoin(
			pets2,
			person => person,
			pet => pet.Owner,
			(person, petCollection) => ({
				OwnerName: person.Name,
				Pets: [...petCollection.Select(pet => pet.Name)]
			})
		)
		.ToArray();

	expect(res2).toEqual([
		{ OwnerName: "Hedlund, Magnus", Pets: ["Daisy"] },
		{ OwnerName: "Adams, Terry", Pets: ["Barley", "Boots"] },
		{ OwnerName: "Weiss, Charlotte", Pets: ["Whiskers"] }
	]);
});

test("Intersect", () => {
	expect(() => [].Intersect(undefined).ToArray()).toThrow("Second is null");
	expect(() => [].Intersect(null).ToArray()).toThrow("Second is null");
	expect(
		[4, 1, 1, 2, 3, 3, 4, 5, 2].Intersect([4, 2, 3, 4, 8]).ToArray()
	).toEqual([4, 2, 3]);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Intersect([18, 25]).ToArray()).toEqual([]);
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.Intersect([{ a: "test2" }], comparer)
			.ToArray()
	).toEqual([{ a: "test2" }]);

	let nameComparer = {
		Equals: (a, b) => a.Name === b.Name,
		GetHashCode: a => a.Name
	};
	let people = [
		{ Name: "Jack", Age: 18 },
		{ Name: "Joe", Age: 22 },
		{ Name: "Jack", Age: 20 }
	];
	expect(
		people
			.Intersect(
				[{ Name: "Joe", Age: 50 }, { Name: "Jane", Age: 24 }],
				nameComparer
			)
			.ToArray()
	).toEqual([{ Name: "Joe", Age: 22 }]);
});

test("Join", () => {
	let people = [
		{ Name: "Hedlund, Magnus" },
		{ Name: "Adams, Terry" },
		{ Name: "Weiss, Charlotte" },
		{ Name: "Without Pets" }
	];
	let nameComparer = {
		Equals: (a, b) => a.Name === b.Name,
		GetHashCode: a => a.Name
	};
	// 1 with comparer
	let pets = [
		{ Name: "Barley", Owner: { Name: "Adams, Terry" } },
		{ Name: "Boots", Owner: { Name: "Adams, Terry" } },
		{ Name: "Pet Without Owner", Owner: { Name: "Doe, Jane" } },
		{ Name: "Whiskers", Owner: { Name: "Weiss, Charlotte" } },
		{ Name: "Daisy", Owner: { Name: "Hedlund, Magnus" } }
	];

	let res = people
		.Join(
			pets,
			person => person,
			pet => pet.Owner,
			(person, pet) => ({
				OwnerName: person.Name,
				Pet: pet.Name
			}),
			nameComparer
		)
		.ToArray();

	expect(res).toEqual([
		{ OwnerName: "Hedlund, Magnus", Pet: "Daisy" },
		{ OwnerName: "Adams, Terry", Pet: "Barley" },
		{ OwnerName: "Adams, Terry", Pet: "Boots" },
		{ OwnerName: "Weiss, Charlotte", Pet: "Whiskers" }
	]);

	// 2 without comparer
	let pets2 = [
		{ Name: "Barley", Owner: people[1] },
		{ Name: "Boots", Owner: people[1] },
		{ Name: "Pet Without Owner", Owner: { Name: "Doe, Jane" } },
		{ Name: "Whiskers", Owner: people[2] },
		{ Name: "Daisy", Owner: people[0] }
	];

	let res2 = people
		.Join(
			pets2,
			person => person,
			pet => pet.Owner,
			(person, pet) => ({
				OwnerName: person.Name,
				Pet: pet.Name
			})
		)
		.ToArray();

	expect(res2).toEqual([
		{ OwnerName: "Hedlund, Magnus", Pet: "Daisy" },
		{ OwnerName: "Adams, Terry", Pet: "Barley" },
		{ OwnerName: "Adams, Terry", Pet: "Boots" },
		{ OwnerName: "Weiss, Charlotte", Pet: "Whiskers" }
	]);
});

test("Last", () => {
	expect(Enumerable.Range(1, 10).Last()).toBe(10);
	expect([1, 2, 3, 4, 5].Last(t => t < 3)).toBe(2);
	expect([1, 2, 3, 4, 5].Last()).toBe(5);
	expect([null].Last()).toBe(null);
	expect([undefined].Last()).toBe(undefined);
	expect(() => [].Last()).toThrow("No last element");
});

test("LastOrDefault", () => {
	expect(
		new Map([[1, 2], [2, 3], [3, 4], [4, 5]]).LastOrDefault(t => t[0] < 3)
	).toEqual([2, 3]);
	expect([1, 2, 3, 4, 5].LastOrDefault(t => t < 3)).toBe(2);
	expect([1, 2, 3, 4, 5].LastOrDefault(_t => true, "test")).toBe(5);
	expect([1, 2, 3].LastOrDefault()).toBe(3);
	expect([].LastOrDefault()).toBe(null);
	expect([].LastOrDefault(_t => true, "test")).toBe("test");
});

test("Max", () => {
	expect([4, 80, 1, 2, 3, 4, 5].Max(t => t * 2)).toBe(160);
	expect([4, 80, -1, 2, 3, 4, 5, 100, null].Max()).toBe(100);
	expect(() => [].Max()).toThrow("Source contains no elements");
});

test("Min", () => {
	expect([4, 80, 1, 2, 3, 4, 5].Min(t => t * 2)).toBe(2);
	expect([4, 80, -1, 2, 3, 4, 5, null].Min()).toBe(-1);
	expect(() => [].Min()).toThrow("Source contains no elements");
});

test("OfType", () => {
	expect(
		[4, 1, "1", 2, 3, "3", 4, 5, 2, true].OfType("string").ToArray()
	).toEqual(["1", "3"]);
	expect(
		[4, 1, "1", 2, 3, "3", 4, 5, 2, true].OfType("number").ToArray()
	).toEqual([4, 1, 2, 3, 4, 5, 2]);
	expect(
		[4, 1, "1", 2, 3, "3", 4, 5, 2, true].OfType("boolean").ToArray()
	).toEqual([true]);
});

test("Prepend", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Prepend(5).ToArray()).toEqual([
		5,
		4,
		1,
		1,
		2,
		3,
		3,
		4,
		5,
		2
	]);
});

test("Reverse", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Reverse().ToArray()).toEqual([
		2,
		5,
		4,
		3,
		3,
		2,
		1,
		1,
		4
	]);
});

test("Select", () => {
	expect([1, 2, 3, 4, 5].Select(t => t * 2).ToArray()).toEqual([
		2,
		4,
		6,
		8,
		10
	]);
	expect([1, 2, 3, 4, 5].Select((t, i) => t * 2 + i).ToArray()).toEqual([
		2,
		5,
		8,
		11,
		14
	]);
});

test("SelectMany", () => {
	let persons = [
		{ Name: "t", Items: ["a", "b"] },
		{ Name: "u", Items: ["c", "d"] },
		{ Name: "v", Items: ["e", "f"] },
		{ Name: "w", Items: ["g"] }
	];

	let mylist = persons
		.SelectMany(
			(t, i) => t.Items.Select(z => z + i),
			(per, item) => ({ name: per.Name, item })
		)
		.ToArray();

	expect(mylist).toEqual([
		{ name: "t", item: "a0" },
		{ name: "t", item: "b0" },
		{ name: "u", item: "c1" },
		{ name: "u", item: "d1" },
		{ name: "v", item: "e2" },
		{ name: "v", item: "f2" },
		{ name: "w", item: "g3" }
	]);

	let mylist2 = persons
		.SelectMany((t, i) => t.Items.Select(z => z + i))
		.ToArray();

	expect(mylist2).toEqual(["a0", "b0", "c1", "d1", "e2", "f2", "g3"]);
});

test("SequenceEqual", () => {
	expect(() => [].SequenceEqual(undefined)).toThrow("Second is null");
	expect(() => [].SequenceEqual(null)).toThrow("Second is null");
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].SequenceEqual([4, 1, 1, 2])).toBeFalsy();
	expect([4, 3].SequenceEqual([4, 1, 1, 2])).toBeFalsy();
	expect(
		[4, 1, 1, 2, 3, 3, 4, 5, 2].SequenceEqual([4, 1, 1, 2, 3, 3, 4, 5, 2])
	).toBeTruthy();
	expect([{ a: "test" }].SequenceEqual([{ a: "test" }], comparer)).toBeTruthy();
});

test("Single", () => {
	expect([4].Single()).toBe(4);
	expect(() => [4].Single(t => t > 5)).toThrow("No element");
	expect(() => [4, 9, 8].Single(t => t > 5)).toThrow("More than 1 element");
	expect([8].Single(t => t > 5)).toBe(8);
});

test("SingleOrDefault", () => {
	expect([4].SingleOrDefault()).toBe(4);
	expect([4].SingleOrDefault(t => t > 5, "test")).toBe("test");
	expect(() => [4, 9, 8].SingleOrDefault(t => t > 5, "test")).toThrow(
		"More than 1 element"
	);
	expect([8].SingleOrDefault(t => t > 5)).toBe(8);
});

test("Skip", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Skip(3).ToArray()).toEqual([
		2,
		3,
		3,
		4,
		5,
		2
	]);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Skip(30).ToArray()).toEqual([]);
});

test("SkipLast", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].SkipLast(5).ToArray()).toEqual([
		4,
		1,
		1,
		2
	]);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].SkipLast(8).ToArray()).toEqual([4]);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].SkipLast(20).ToArray()).toEqual([]);
});

test("SkipWhile", () => {
	expect(
		Enumerable.Range(1, 10)
			.SkipWhile(t => t < 10)
			.ToArray()
	).toEqual([10]);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].SkipWhile(t => t < 5).ToArray()).toEqual([
		5,
		2
	]);
	expect(
		[4, 1, 1, 2, 3, 3, 4, 5, 2].SkipWhile((t, i) => i < 5).ToArray()
	).toEqual([3, 4, 5, 2]);
});

test("Sum", () => {
	expect(Enumerable.Range(1, 100).Sum()).toBe(5050);
	expect([1, 2, 3, null].Sum()).toBe(6);
	expect([1, 2, 3].Sum(t => t * 2)).toBe(12);
});

test("Take", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Take(4).ToArray()).toEqual([4, 1, 1, 2]);
	expect([].Take(4).ToArray()).toEqual([]);
});

test("TakeLast", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].TakeLast(3).ToArray()).toEqual([4, 5, 2]);
	expect([4, 1].TakeLast(3).ToArray()).toEqual([4, 1]);
	expect([4, 1].TakeLast(2).ToArray()).toEqual([4, 1]);
});

test("TakeWhile", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].TakeWhile(t => t < 5).ToArray()).toEqual([
		4,
		1,
		1,
		2,
		3,
		3,
		4
	]);
	expect(
		[4, 1, 1, 2, 3, 3, 4, 5, 2].TakeWhile((t, i) => i < 5).ToArray()
	).toEqual([4, 1, 1, 2, 3]);
});

test("ToArray", () => {
	// test for HashSet, Dictionary, Lookup, Enumerable, Map, Set, Array
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }].ToHashSet(comparer).ToArray()
	).toEqual([{ a: "test" }, { a: "test2" }]);

	expect(
		[{ a: "test" }, { a: "test2" }]
			.ToDictionary(t => t, t => t.a, comparer)
			.ToArray()
	).toEqual([
		{ Key: { a: "test" }, Value: "test" },
		{ Key: { a: "test2" }, Value: "test2" }
	]);
	expect(() =>
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToDictionary(t => t, t => t.a, comparer)
			.ToArray()
	).toThrow("Key already exists");

	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToLookup(t => t, t => t.a, comparer)
			.ToArray()
			.Select(t => [t.Key, [...t]])
			.ToArray()
	).toEqual([[{ a: "test" }, ["test", "test"]], [{ a: "test2" }, ["test2"]]]);

	expect([1, 2, 3, 4, 5].AsEnumerable().ToArray()).toEqual([1, 2, 3, 4, 5]);

	expect(new Map([[1, 2], [2, 3], [2, 4]]).ToArray()).toEqual([[1, 2], [2, 4]]);

	expect(new Set([2, 5, 5, 9]).ToArray()).toEqual([2, 5, 9]);

	expect([1, 2, 3, 4, 5].ToArray()).toEqual([1, 2, 3, 4, 5]);
});

test("ToDictionary", () => {
	// test for HashSet, Dictionary, Lookup, Enumerable, Map, Set, Array
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToHashSet(comparer)
			.ToDictionary(t => t, t => t.a)
			.ToArray()
	).toEqual([
		{ Key: { a: "test" }, Value: "test" },
		{ Key: { a: "test2" }, Value: "test2" }
	]);

	expect(
		[{ a: "test" }, { a: "test2" }]
			.ToDictionary(t => t, t => t.a, comparer)
			.ToDictionary(t => t.Key, t => t.Value)
			.ToArray()
	).toEqual([
		{ Key: { a: "test" }, Value: "test" },
		{ Key: { a: "test2" }, Value: "test2" }
	]);

	expect(
		[{ a: "test" }, { a: "test2" }]
			.ToDictionary(t => t, comparer)
			.ToDictionary(t => t.Key, t => t.Value)
			.ToArray()
	).toEqual([
		{ Key: { a: "test" }, Value: { a: "test" } },
		{ Key: { a: "test2" }, Value: { a: "test2" } }
	]);

	expect(
		[{ a: "test" }, { a: "test2" }]
			.ToDictionary(t => t.a)
			.ToDictionary(t => t.Key, t => t.Value)
			.ToArray()
	).toEqual([
		{ Value: { a: "test" }, Key: "test" },
		{ Value: { a: "test2" }, Key: "test2" }
	]);

	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToLookup(t => t.a, t => t)
			.ToDictionary(t => t.Key, t => t)
			.Select(t => [t.Key, [...t.Value]])
			.ToArray()
	).toEqual([
		["test", [{ a: "test" }, { a: "test" }]],
		["test2", [{ a: "test2" }]]
	]);

	expect(
		[1, 2, 3, 4, 5]
			.AsEnumerable()
			.ToDictionary(t => t, t => t * 2)
			.ToArray()
	).toEqual([
		{ Key: 1, Value: 2 },
		{ Key: 2, Value: 4 },
		{ Key: 3, Value: 6 },
		{ Key: 4, Value: 8 },
		{ Key: 5, Value: 10 }
	]);

	expect(
		new Map([[1, 2], [2, 3], [2, 4], [3, 4], [5, 10]])
			.ToDictionary(t => t[0], t => t[1])
			.ToArray()
	).toEqual([
		{ Key: 1, Value: 2 },
		{ Key: 2, Value: 4 },
		{ Key: 3, Value: 4 },
		{ Key: 5, Value: 10 }
	]);

	expect(
		new Set([1, 2, 3, 3, 4, 5]).ToDictionary(t => t, t => t * 2).ToArray()
	).toEqual([
		{ Key: 1, Value: 2 },
		{ Key: 2, Value: 4 },
		{ Key: 3, Value: 6 },
		{ Key: 4, Value: 8 },
		{ Key: 5, Value: 10 }
	]);

	expect([2, 5, 9].ToDictionary(t => t, t => t * 2).ToArray()).toEqual([
		{ Key: 2, Value: 4 },
		{ Key: 5, Value: 10 },
		{ Key: 9, Value: 18 }
	]);
});

test("ToHashSet", () => {
	// test for HashSet, Dictionary, Lookup, Enumerable, Map, Set, Array
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToHashSet(comparer)
			.ToHashSet()
			.ToArray()
	).toEqual([{ a: "test" }, { a: "test2" }]);

	expect(
		[{ a: "test" }, { a: "test2" }]
			.ToDictionary(t => t, t => t.a, comparer)
			.Select(t => t.Key)
			.ToHashSet()
			.ToArray()
	).toEqual([{ a: "test" }, { a: "test2" }]);

	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToLookup(t => t, t => t.a, comparer)
			.Select(t => t.Key)
			.ToHashSet()
			.ToArray()
	).toEqual([{ a: "test" }, { a: "test2" }]);

	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToLookup(t => t, t => t.a, comparer)
			.Select(t => [...t])
			.ToHashSet()
			.ToArray()
	).toEqual([["test", "test"], ["test2"]]);

	expect(
		[1, 2, 3, 3, 4, 5]
			.AsEnumerable()
			.ToHashSet()
			.ToArray()
	).toEqual([1, 2, 3, 4, 5]);

	expect(
		new Map([[1, 2], [2, 3], [2, 4], [3, 4]])
			.Select(t => t[1])
			.ToHashSet()
			.ToArray()
	).toEqual([2, 4]);

	expect(new Set([2, 5, 5, 9]).ToHashSet().ToArray()).toEqual([2, 5, 9]);

	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }].ToHashSet(comparer).ToArray()
	).toEqual([{ a: "test" }, { a: "test2" }]);
});

test("ToList", () => {
	let comparer = (a, b) => {
		if (a.Age > b.Age) return 1;
		if (a.Age < b.Age) return -1;
		return 0;
	};

	let people = [
		{ Name: "John", Age: 15 },
		{ Name: "Jane", Age: 30 },
		{ Name: "John", Age: 20 }
	];
	expect(people.ToList().CountNative).toBe(3);
	expect(
		people.ToList(comparer).ContainsNative({ Name: null, Age: 15 })
	).toBeTruthy();

	let people2 = [
		{ Name: "Jack", Age: 18 },
		{ Name: "Joe", Age: 22 },
		{ Name: "Jack", Age: 20 }
	];
	let mylist = people2.ToList();
	mylist.Add({ Name: "Jane", Age: 19 });
	expect(mylist.ToArray()).toEqual([
		{ Name: "Jack", Age: 18 },
		{ Name: "Joe", Age: 22 },
		{ Name: "Jack", Age: 20 },
		{ Name: "Jane", Age: 19 }
	]);

	let mylist3 = [1, 3, 4, 8, 12].ToList();
	mylist3.Add(15);
	expect([...mylist3]).toEqual([1, 3, 4, 8, 12, 15]);
});

test("ToLookup", () => {
	// test for HashSet, Dictionary, Lookup, Enumerable, Map, Set, Array
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToHashSet(comparer)
			.ToLookup(t => t, t => t.a)
			.Select(t => [t.Key, ...t])
			.ToArray()
	).toEqual([[{ a: "test" }, "test"], [{ a: "test2" }, "test2"]]);

	expect(
		[{ a: "test" }, { a: "test2" }]
			.ToDictionary(t => t, t => t.a, comparer)
			.ToLookup(t => t.Key, t => t.Value)
			.Select(t => [t.Key, ...t])
			.ToArray()
	).toEqual([[{ a: "test" }, "test"], [{ a: "test2" }, "test2"]]);

	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToLookup(t => t.a, t => t)
			.ToLookup(t => t.Key, t => [...t])
			.Select(t => [t.Key, ...t])
			.ToArray()
	).toEqual([
		["test", [{ a: "test" }, { a: "test" }]],
		["test2", [{ a: "test2" }]]
	]);

	expect(
		[1, 2, 3, 3, 4, 5]
			.AsEnumerable()
			.ToLookup(t => t, t => t * 2)
			.Select(t => ({ Key: t.Key, Value: [...t] }))
			.ToArray()
	).toEqual([
		{ Key: 1, Value: [2] },
		{ Key: 2, Value: [4] },
		{ Key: 3, Value: [6, 6] },
		{ Key: 4, Value: [8] },
		{ Key: 5, Value: [10] }
	]);

	expect(
		[1, 2, 3, 3, 4, 5]
			.AsEnumerable()
			.ToLookup(t => t)
			.Select(t => ({ Key: t.Key, Value: [...t] }))
			.ToArray()
	).toEqual([
		{ Key: 1, Value: [1] },
		{ Key: 2, Value: [2] },
		{ Key: 3, Value: [3, 3] },
		{ Key: 4, Value: [4] },
		{ Key: 5, Value: [5] }
	]);

	expect(
		new Map([[1, 2], [2, 3], [2, 4], [3, 4], [5, 10]])
			.ToLookup(t => t[1], t => t[0])
			.Select(t => [t.Key, [...t]])
			.ToArray()
	).toEqual([[2, [1]], [4, [2, 3]], [10, [5]]]);

	expect(
		new Set([1, 2, 3, 3, 4, 5])
			.ToLookup(t => t, t => t * 2)
			.Select(t => ({ Key: t.Key, Value: [...t] }))
			.ToArray()
	).toEqual([
		{ Key: 1, Value: [2] },
		{ Key: 2, Value: [4] },
		{ Key: 3, Value: [6] },
		{ Key: 4, Value: [8] },
		{ Key: 5, Value: [10] }
	]);

	expect(
		[1, 2, 3, 3, 4, 5]
			.ToLookup(t => t, t => t * 2)
			.Select(t => ({ Key: t.Key, Value: [...t] }))
			.ToArray()
	).toEqual([
		{ Key: 1, Value: [2] },
		{ Key: 2, Value: [4] },
		{ Key: 3, Value: [6, 6] },
		{ Key: 4, Value: [8] },
		{ Key: 5, Value: [10] }
	]);
});

test("ToMap", () => {
	// test for HashSet, Dictionary, Lookup, Enumerable, Map, Set, Array
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToHashSet(comparer)
			.ToMap(t => t, t => t.a)
	).toEqual(new Map([[{ a: "test" }, "test"], [{ a: "test2" }, "test2"]]));

	expect(
		[{ a: "test" }, { a: "test2" }]
			.ToDictionary(t => t.a, t => t)
			.ToMap(t => t.Key, t => t.Value)
	).toEqual(new Map([["test", { a: "test" }], ["test2", { a: "test2" }]]));

	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToLookup(t => t.a, t => t)
			.ToMap(t => t.Key, t => t)
			.Select(t => [t[0], [...t[1]]])
			.ToArray()
	).toEqual([
		["test", [{ a: "test" }, { a: "test" }]],
		["test2", [{ a: "test2" }]]
	]);

	expect([1, 2, 3, 3, 4, 5].AsEnumerable().ToMap(t => t, t => t * 2)).toEqual(
		new Map([[1, 2], [2, 4], [3, 6], [4, 8], [5, 10]])
	);

	expect([1, 2, 3, 3, 4, 5].AsEnumerable().ToMap(t => t)).toEqual(
		new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]])
	);

	expect(
		new Map([[1, 2], [2, 3], [2, 4], [3, 4]]).ToMap(t => t[0], t => t[1])
	).toEqual(new Map([[1, 2], [2, 3], [2, 4], [3, 4]]));

	expect(new Set([1, 2, 3, 3, 4, 5]).ToMap(t => t, t => t * 2)).toEqual(
		new Map([[1, 2], [2, 4], [3, 6], [4, 8], [5, 10]])
	);

	expect([2, 5, 9].ToMap(t => t, t => t * 2)).toEqual(
		new Map([[2, 4], [5, 10], [9, 18]])
	);
});

test("ToSet", () => {
	// test for HashSet, Dictionary, Lookup, Enumerable, Map, Set, Array
	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }].ToHashSet(comparer).ToSet()
	).toEqual(new Set([{ a: "test" }, { a: "test2" }]));

	expect(
		[{ a: "test" }, { a: "test2" }]
			.ToDictionary(t => t, t => t.a, comparer)
			.Select(t => t.Value)
			.ToSet()
	).toEqual(new Set(["test", "test2"]));

	expect(
		[{ a: "test" }, { a: "test" }, { a: "test2" }]
			.ToLookup(t => t, t => t.a, comparer)
			.Select(t => t.Key)
			.ToSet()
	).toEqual(new Set([{ a: "test" }, { a: "test2" }]));

	expect([1, 2, 3, 3, 4, 5].AsEnumerable().ToSet()).toEqual(
		new Set([1, 2, 3, 4, 5])
	);

	expect(
		new Map([[1, 2], [2, 3], [2, 4], [3, 4]]).Select(t => t[1]).ToSet()
	).toEqual(new Set([2, 4]));

	expect(new Set([2, 5, 5, 9]).ToSet()).toEqual(new Set([2, 5, 9]));

	expect([2, 5, 5, 9].ToSet()).toEqual(new Set([2, 5, 9]));
});

test("Union", () => {
	expect(() => [].Union(undefined).ToArray()).toThrow("Second is null");
	expect(() => [].Union(null).ToArray()).toThrow("Second is null");
	expect(
		Enumerable.Empty()
			.Union([4, 2, 3, 4])
			.Union([8])
			.ToArray()
	).toEqual([4, 2, 3, 8]);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Union([4, 2, 3, 4, 8]).ToArray()).toEqual([
		4,
		1,
		2,
		3,
		5,
		8
	]);
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Union([18, 25]).ToArray()).toEqual([
		4,
		1,
		2,
		3,
		5,
		18,
		25
	]);
	expect(
		[{ a: "test" }, { a: "test3" }, { a: "test" }]
			.Union([{ a: "test" }, { a: "test2" }, { a: "test" }], comparer)
			.ToArray()
	).toEqual([{ a: "test" }, { a: "test3" }, { a: "test2" }]);
});

test("Where", () => {
	expect([4, 1, 1, 2, 3, 3, 4, 5, 2].Where(t => t < 4).ToArray()).toEqual([
		1,
		1,
		2,
		3,
		3,
		2
	]);
	expect(
		[4, 1, 1, 2, 3, 3, 4, 5, 2].Where((t, i) => i % 2 == 0).ToArray()
	).toEqual([4, 1, 3, 4, 2]);
});

test("Zip", () => {
	expect(
		[1, 2, 3].Zip(["one", "two"], (a, b) => a + " " + b).ToArray()
	).toEqual(["1 one", "2 two"]);
	expect(
		[1, 2].Zip(["one", "two", "three"], (a, b) => a + " " + b).ToArray()
	).toEqual(["1 one", "2 two"]);
	expect(() => [1, 2, 3].Zip(null, (a, b) => a + " " + b).ToArray()).toThrow(
		"Second is null"
	);
});
