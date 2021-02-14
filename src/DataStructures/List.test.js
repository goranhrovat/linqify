const { List, SortComparers, Enumerable } = process.env.LINQIFY_PATH
	? require("../../" + process.env.LINQIFY_PATH)
	: require("../linqify");

//const { List, SortComparers } = require("../linqify");

let comparer = (a, b) => (a.Age > b.Age ? 1 : a.Age < b.Age ? -1 : 0);

test("List", () => {
	let people = [
		{ Name: "Jack", Age: 18 },
		{ Name: "Joe", Age: 22 },
		{ Name: "Jack", Age: 20 },
		{ Name: "Jane", Age: 19 },
	];

	let mylist1 = new List();
	let mylist2 = new List(null);
	let mylist3 = new List([91, 92, 93, 94]);
	let mylist4 = new List(people, comparer);
	let mylist5 = new List(people, null);
	let mylist6 = new List(comparer);

	expect(mylist1.Comparer).toBe(SortComparers.DefaultComparer);
	expect(mylist2.Comparer).toBe(SortComparers.DefaultComparer);
	expect(mylist3.Comparer).toBe(SortComparers.DefaultComparer);
	expect(mylist4.Comparer).toBe(comparer);
	expect(mylist5.Comparer).toBe(SortComparers.DefaultComparer);
	expect(mylist6.Comparer).toBe(comparer);

	expect(mylist2.CountNative).toBe(0);
	expect(mylist4.CountNative).toBe(4);

	expect(mylist4.Get(2)).toEqual({ Name: "Jack", Age: 20 });
	expect(() => mylist4.Set(100, null)).toThrow("Index not valid");
	expect(() => mylist4.Set(-1, null)).toThrow("Index not valid");
	mylist4.Set(2, { Name: "Joe", Age: 23 });
	expect(mylist4.Get(2)).toEqual({ Name: "Joe", Age: 23 });
	expect(() => mylist4.Get(100)).toThrow("Index not valid");
	expect(() => mylist4.Get(mylist4.CountNative)).toThrow("Index not valid");

	mylist4.AddRange([
		{ Name: "Andy", Age: 50 },
		{ Name: "Peter", Age: 60 },
	]);

	mylist4.Sort();

	expect([...mylist4]).toEqual([
		{ Age: 18, Name: "Jack" },
		{ Age: 19, Name: "Jane" },
		{ Age: 22, Name: "Joe" },
		{ Age: 23, Name: "Joe" },
		{ Age: 50, Name: "Andy" },
		{ Age: 60, Name: "Peter" },
	]);

	let res1 = mylist4.BinarySearch({ Name: "Andy2", Age: 50 });
	expect(res1).toBe(4);

	// @ts-ignore
	expect(() => mylist4.BinarySearch(2, -1, 3, null, null)).toThrow(
		"Wrong number of arguments"
	);
	expect(() => mylist4.BinarySearch(-1, 3, null, null)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.BinarySearch(1, 30, null, null)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.BinarySearch(4, 4, null, null)).toThrow(
		"Not a valid range"
	);
	let res2 = mylist4.BinarySearch({ Name: "Andy20", Age: 20 });
	expect(res2).toBe(-3);
	mylist4.Insert(~res2, { Name: "Andy20", Age: 20 });

	expect([...mylist4]).toEqual([
		{ Age: 18, Name: "Jack" },
		{ Age: 19, Name: "Jane" },
		{ Age: 20, Name: "Andy20" },
		{ Age: 22, Name: "Joe" },
		{ Age: 23, Name: "Joe" },
		{ Age: 50, Name: "Andy" },
		{ Age: 60, Name: "Peter" },
	]);

	let res3 = mylist4.BinarySearch(3, 2, { Name: "Andy20", Age: 20 }, comparer);
	expect(res3).toBe(-4);

	let res4 = mylist4.BinarySearch(0, 7, { Name: "Andy20", Age: 100 }, comparer);
	expect(res4).toBe(-8);

	mylist4.Insert(~res4, { Name: "Andy20", Age: 100 });
	expect([...mylist4]).toEqual([
		{ Age: 18, Name: "Jack" },
		{ Age: 19, Name: "Jane" },
		{ Age: 20, Name: "Andy20" },
		{ Age: 22, Name: "Joe" },
		{ Age: 23, Name: "Joe" },
		{ Age: 50, Name: "Andy" },
		{ Age: 60, Name: "Peter" },
		{ Age: 100, Name: "Andy20" },
	]);

	let res5 = mylist4.BinarySearch(0, 7, { Name: "Andy20", Age: 17 }, comparer);
	let res51 = mylist4.BinarySearch({ Name: "Andy20", Age: 17 }, comparer);
	expect(res5).toBe(-1);
	expect(res51).toBe(-1);

	mylist4.Insert(~res5, { Name: "Andy20", Age: 17 });
	expect([...mylist4]).toEqual([
		{ Age: 17, Name: "Andy20" },
		{ Age: 18, Name: "Jack" },
		{ Age: 19, Name: "Jane" },
		{ Age: 20, Name: "Andy20" },
		{ Age: 22, Name: "Joe" },
		{ Age: 23, Name: "Joe" },
		{ Age: 50, Name: "Andy" },
		{ Age: 60, Name: "Peter" },
		{ Age: 100, Name: "Andy20" },
	]);

	let res6 = mylist4.BinarySearch(0, 7, { Name: "Andy20", Age: 17 }, comparer);
	expect(res6).toBe(0);
	let res7 = mylist4.BinarySearch({ Name: "Andy20", Age: 100 }, comparer);
	expect(res7).toBe(8);

	mylist5.Clear();
	expect(mylist5.ToArray()).toEqual([]);

	let mylist7 = mylist4.ConvertAll((t) => ({ Name: t.Name, Age: t.Age / 2 }));

	expect(mylist7.Select((t) => t.Age).ToArray()).toEqual([
		8.5,
		9,
		9.5,
		10,
		11,
		11.5,
		25,
		30,
		50,
	]);

	var arr = [];

	// @ts-ignore
	expect(() => mylist3.CopyTo(arr, 2, 5, 6, 7)).toThrow(
		"Wrong number of arguments"
	);
	expect(() => mylist3.CopyTo(arr, 2)).toThrow("Not a valid range");

	arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	expect(() => mylist3.CopyTo(arr, -2)).toThrow("Not a valid range");

	expect(() => mylist3.CopyTo(arr)).not.toThrow();
	expect(arr).toEqual([91, 92, 93, 94, 5, 6, 7, 8, 9, 10]);

	expect(() => mylist3.CopyTo(1, arr, 5, 2)).not.toThrow();
	expect(arr).toEqual([91, 92, 93, 94, 5, 92, 93, 8, 9, 10]);

	expect(mylist4.Exists((t) => t.Age > 100)).toBeFalsy();
	expect(mylist4.Exists((t) => t.Age == 11)).toBeFalsy();

	expect(mylist4.Find((t) => t.Age == 11)).toEqual(null);
	expect(mylist4.Find((t) => t.Age == 11, { Name: "Jane", Age: 40 })).toEqual({
		Age: 40,
		Name: "Jane",
	});
	expect(mylist4.Find((t) => t.Age == 20, { Name: "Jane", Age: 40 })).toEqual({
		Age: 20,
		Name: "Andy20",
	});

	expect(mylist4.FindAll((t) => t.Age > 40).ToArray()).toEqual([
		{ Age: 50, Name: "Andy" },
		{ Age: 60, Name: "Peter" },
		{ Age: 100, Name: "Andy20" },
	]);
	expect(mylist4.FindAll((t) => t.Age > 150).ToArray()).toEqual([]);

	// @ts-ignore
	expect(() => mylist4.FindIndex((t) => t.Age > 150, 1, 1, 1, 1)).toThrow(
		"Wrong number of arguments"
	);
	expect(mylist4.FindIndex((t) => t.Age > 150)).toBe(-1);
	expect(mylist4.FindIndex((t) => t.Age == 22)).toBe(4);
	expect(mylist4.FindIndex(5, (t) => t.Age == 22)).toBe(-1);
	expect(mylist4.FindIndex(5, (t) => t.Age == 60)).toBe(7);
	expect(mylist4.FindIndex(2, 4, (t) => t.Age == 60)).toBe(-1);
	expect(mylist4.FindIndex(2, 4, (t) => t.Age == 18)).toBe(-1);
	expect(mylist4.FindIndex(2, 4, (t) => t.Age == 23)).toBe(5);
	expect(mylist4.FindIndex(2, 4, (t) => t.Age == 19)).toBe(2);
	expect(() => mylist4.FindIndex(-2, 4, (t) => t.Age == 19)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.FindIndex(2, -4, (t) => t.Age == 19)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.FindIndex(-4, (t) => t.Age == 19)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.FindIndex(2, 100, (t) => t.Age == 19)).toThrow(
		"Not a valid range"
	);

	expect(mylist4.FindLast((t) => t.Age == 11)).toEqual(null);
	expect(
		mylist4.FindLast((t) => t.Age == 11, { Name: "Jane", Age: 40 })
	).toEqual({
		Age: 40,
		Name: "Jane",
	});
	expect(mylist4.FindLast((t) => t.Age > 5, { Name: "Jane", Age: 40 })).toEqual(
		{
			Age: 100,
			Name: "Andy20",
		}
	);

	// @ts-ignore
	expect(() => mylist4.FindLastIndex((t) => t.Age > 150, 1, 1, 1, 1)).toThrow(
		"Wrong number of arguments"
	);
	expect(mylist4.FindLastIndex((t) => t.Age > 150)).toBe(-1);
	expect(mylist4.FindLastIndex((t) => t.Age > 22)).toBe(8);
	expect(mylist4.FindLastIndex(5, (t) => t.Age == 22)).toBe(-1);
	expect(mylist4.FindLastIndex(5, (t) => t.Age == 60)).toBe(7);
	expect(mylist4.FindLastIndex(2, 4, (t) => t.Age == 60)).toBe(-1);
	expect(mylist4.FindLastIndex(2, 4, (t) => t.Age == 18)).toBe(-1);
	expect(mylist4.FindLastIndex(2, 4, (t) => t.Age == 23)).toBe(5);
	expect(mylist4.FindLastIndex(2, 4, (t) => t.Age == 19)).toBe(2);
	expect(() => mylist4.FindLastIndex(-2, 4, (t) => t.Age == 19)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.FindLastIndex(2, -4, (t) => t.Age == 19)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.FindLastIndex(-4, (t) => t.Age == 19)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.FindLastIndex(2, 100, (t) => t.Age == 19)).toThrow(
		"Not a valid range"
	);

	expect(() => mylist4.GetRange(-1, 5)).toThrow("Not a valid range");
	expect(() => mylist4.GetRange(1, -5)).toThrow("Not a valid range");
	expect(() => mylist4.GetRange(1, 9)).toThrow("Not a valid range");
	expect(mylist4.GetRange(1, 8).ToArray()).toEqual([
		{ Age: 18, Name: "Jack" },
		{ Age: 19, Name: "Jane" },
		{ Age: 20, Name: "Andy20" },
		{ Age: 22, Name: "Joe" },
		{ Age: 23, Name: "Joe" },
		{ Age: 50, Name: "Andy" },
		{ Age: 60, Name: "Peter" },
		{ Age: 100, Name: "Andy20" },
	]);
	expect(mylist4.GetRange(4, 2).ToArray()).toEqual([
		{ Age: 22, Name: "Joe" },
		{ Age: 23, Name: "Joe" },
	]);

	expect(mylist4.IndexOf({ Age: 23 })).toBe(5);
	expect(mylist4.IndexOf({ Age: 23 }, 2)).toBe(5);
	expect(mylist4.IndexOf({ Age: 23 }, 2, 4)).toBe(5);
	expect(mylist4.IndexOf({ Age: 23 }, 2, 2)).toBe(-1);
	expect(mylist4.IndexOf({ Age: 230 })).toBe(-1);
	expect(() => mylist4.IndexOf({ Age: 230 }, -1)).toThrow("Not a valid range");
	expect(() => mylist4.IndexOf({ Age: 230 }, -1, -5)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.IndexOf({ Age: 230 }, 4, 5)).not.toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.IndexOf({ Age: 230 }, 4, 6)).toThrow(
		"Not a valid range"
	);

	expect(() => mylist4.Insert(-1, { Age: 15, Name: "Andy5" })).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.Insert(10, { Age: 15, Name: "Andy5" })).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.Insert(9, { Age: 150, Name: "Andy150" })).not.toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.Insert(0, { Age: 15, Name: "Andy15" })).not.toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.Insert(3, { Age: 18.5, Name: "Andy18.5" })).not.toThrow(
		"Not a valid range"
	);

	expect(mylist4.Select((t) => t.Age).ToArray()).toEqual([
		15,
		17,
		18,
		18.5,
		19,
		20,
		22,
		23,
		50,
		60,
		100,
		150,
	]);

	expect(() => mylist3.InsertRange(-1, [1, 5, 4])).toThrow("Not a valid range");
	expect(() => mylist3.InsertRange(5, [1, 5, 4])).toThrow("Not a valid range");
	expect(() => mylist3.InsertRange(4, [1, 5, 4])).not.toThrow();
	expect(() => mylist3.InsertRange(0, [1, 5, 4])).not.toThrow();
	expect(() =>
		mylist3.InsertRange(0, Enumerable.From([1, 5, 4]))
	).not.toThrow();
	expect(() => mylist3.RemoveRange(0, 3)).not.toThrow();
	expect(() => mylist3.InsertRange(2, [1, 5, 4].AsEnumerable())).not.toThrow(
		"Not a valid range"
	);

	expect([...mylist3]).toEqual([1, 5, 1, 5, 4, 4, 91, 92, 93, 94, 1, 5, 4]);

	mylist4.Add({ Age: 60, Name: "Peter2" });

	expect(mylist4.LastIndexOf({ Age: 60 })).toBe(12);
	expect(mylist4.LastIndexOf({ Age: 23 }, 2)).toBe(7);
	expect(mylist4.LastIndexOf({ Age: 23 }, 2, 6)).toBe(7);
	expect(mylist4.LastIndexOf({ Age: 23 }, 2, 5)).toBe(-1);
	expect(mylist4.LastIndexOf({ Age: 60 })).toBe(12);
	expect(mylist4.LastIndexOf({ Age: 230 })).toBe(-1);
	expect(() => mylist4.LastIndexOf({ Age: 230 }, -1)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.LastIndexOf({ Age: 230 }, -1, -5)).toThrow(
		"Not a valid range"
	);
	expect(() => mylist4.LastIndexOf({ Age: 230 }, 4, 9)).not.toThrow();
	expect(() => mylist4.LastIndexOf({ Age: 230 }, 4, 10)).toThrow(
		"Not a valid range"
	);

	expect(mylist4.Remove({ Age: 24 })).toBeFalsy();
	expect(mylist4.Remove({ Age: 23 })).toBeTruthy();

	expect(mylist4.Select((t) => t.Age).ToArray()).toEqual([
		15,
		17,
		18,
		18.5,
		19,
		20,
		22,
		50,
		60,
		100,
		150,
		60,
	]);

	expect(mylist4.RemoveAll((t) => t.Age > 200)).toBe(0);
	expect(mylist4.RemoveAll((t) => t.Age > 50 && t.Age < 150)).toBe(3);
	expect(mylist4.Select((t) => t.Age).ToArray()).toEqual([
		15,
		17,
		18,
		18.5,
		19,
		20,
		22,
		50,
		150,
	]);

	expect(() => mylist4.RemoveAt(-1)).toThrow("Not a valid range");
	expect(() => mylist4.RemoveAt(9)).toThrow("Not a valid range");

	expect(() => mylist4.RemoveAt(3)).not.toThrow();
	expect(() => mylist4.RemoveAt(8)).toThrow("Not a valid range");
	expect(() => mylist4.RemoveAt(7)).not.toThrow();
	expect(() => mylist4.RemoveAt(0)).not.toThrow();

	expect(mylist4.Select((t) => t.Age).ToArray()).toEqual([
		17,
		18,
		19,
		20,
		22,
		50,
	]);

	expect(() => mylist4.RemoveRange(-1, 5)).toThrow("Not a valid range");
	expect(() => mylist4.RemoveRange(9, 20)).toThrow("Not a valid range");
	expect(() => mylist4.RemoveRange(9, -2)).toThrow("Not a valid range");

	expect(() => mylist4.RemoveRange(3, 2)).not.toThrow();
	expect(() => mylist4.RemoveRange(0, 1)).not.toThrow();
	expect(() => mylist4.RemoveRange(2, 1)).not.toThrow();
	expect(() => mylist4.RemoveRange(2, 1)).toThrow("Not a valid range");

	expect(mylist4.Select((t) => t.Age).ToArray()).toEqual([18, 19]);

	mylist4.AddRange([
		{ Age: 20, Name: "Andy20" },
		{ Age: 19, Name: "Jane" },
		{ Age: 50, Name: "Andy" },
		{ Age: 23, Name: "Joe" },
		{ Age: 22, Name: "Joe" },
		{ Age: 60, Name: "Peter" },
	]);

	expect(() => mylist4.ReverseNative()).not.toThrow();
	expect(() => mylist4.ReverseNative(-1, -5)).toThrow("Not a valid range");
	expect(() => mylist4.ReverseNative(-1, 6)).toThrow("Not a valid range");
	expect(() => mylist4.ReverseNative(1, -6)).toThrow("Not a valid range");
	expect(() => mylist4.ReverseNative(1, 8)).toThrow("Not a valid range");
	expect(() => mylist4.ReverseNative(0, 2)).not.toThrow();
	expect(() => mylist4.ReverseNative(6, 2)).not.toThrow();
	expect(() => mylist4.ReverseNative(3, 3)).not.toThrow();

	expect(mylist4.Select((t) => t.Age).ToArray()).toEqual([
		22,
		60,
		23,
		20,
		19,
		50,
		18,
		19,
	]);

	// without, sort cmp name, left 3, right 3, middle, wrong args, wrong range

	let mylist41 = mylist4.ToList(mylist4.Comparer);
	let mylist412 = mylist4.ToList(mylist4.Comparer);
	let mylist42 = mylist4.ToList(mylist4.Comparer);
	let mylist43 = mylist4.ToList(mylist4.Comparer);
	let mylist44 = mylist4.ToList(mylist4.Comparer);
	let mylist45 = mylist4.ToList(mylist4.Comparer);

	mylist41.Sort();
	expect(mylist41.Select((t) => t.Age).ToArray()).toEqual([
		18,
		19,
		19,
		20,
		22,
		23,
		50,
		60,
	]);

	mylist412.Sort(0, 8, null);
	expect(mylist412.Select((t) => t.Age).ToArray()).toEqual([
		18,
		19,
		19,
		20,
		22,
		23,
		50,
		60,
	]);

	mylist42.Sort((a, b) => (a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));

	expect(mylist42.Select((t) => t).ToArray()).toEqual([
		{ Age: 50, Name: "Andy" },
		{ Age: 20, Name: "Andy20" },
		{ Age: 18, Name: "Jack" },
		{ Age: 19, Name: "Jane" },
		{ Age: 19, Name: "Jane" },
		{ Age: 22, Name: "Joe" },
		{ Age: 23, Name: "Joe" },
		{ Age: 60, Name: "Peter" },
	]);

	mylist43.Sort(0, 3, (a, b) =>
		a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0
	);

	expect(mylist43.Select((t) => t).ToArray()).toEqual([
		{ Age: 22, Name: "Joe" },
		{ Age: 23, Name: "Joe" },
		{ Age: 60, Name: "Peter" },
		{ Age: 20, Name: "Andy20" },
		{ Age: 19, Name: "Jane" },
		{ Age: 50, Name: "Andy" },
		{ Age: 18, Name: "Jack" },
		{ Age: 19, Name: "Jane" },
	]);

	// descending sort!!
	mylist44.Sort(5, 3, (a, b) =>
		a.Name > b.Name ? -1 : a.Name < b.Name ? 1 : 0
	);

	expect(mylist44.Select((t) => t).ToArray()).toEqual([
		{ Age: 22, Name: "Joe" },
		{ Age: 60, Name: "Peter" },
		{ Age: 23, Name: "Joe" },
		{ Age: 20, Name: "Andy20" },
		{ Age: 19, Name: "Jane" },
		{ Age: 19, Name: "Jane" },
		{ Age: 18, Name: "Jack" },
		{ Age: 50, Name: "Andy" },
	]);

	mylist45.Sort(3, 4, (a, b) =>
		a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0
	);

	expect(mylist45.Select((t) => t).ToArray()).toEqual([
		{ Age: 22, Name: "Joe" },
		{ Age: 60, Name: "Peter" },
		{ Age: 23, Name: "Joe" },
		{ Age: 50, Name: "Andy" },
		{ Age: 20, Name: "Andy20" },
		{ Age: 18, Name: "Jack" },
		{ Age: 19, Name: "Jane" },
		{ Age: 19, Name: "Jane" },
	]);

	expect(() =>
		// @ts-ignore
		mylist45.Sort(3, 4, 5, (a, b) =>
			a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0
		)
	).toThrow("Wrong number of arguments");

	expect(() =>
		mylist45.Sort(-3, 4, (a, b) =>
			a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0
		)
	).toThrow("Not a valid range");

	expect(() =>
		mylist45.Sort(3, -4, (a, b) =>
			a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0
		)
	).toThrow("Not a valid range");

	expect(() =>
		mylist45.Sort(5, 4, (a, b) =>
			a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0
		)
	).toThrow("Not a valid range");

	expect(mylist4.TrueForAll((t) => t.Age < 500)).toBeTruthy();
	expect(mylist4.TrueForAll((t) => t.Age < 50)).toBeFalsy();
});
