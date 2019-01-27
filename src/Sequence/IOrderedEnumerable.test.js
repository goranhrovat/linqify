process.env.LINQIFY_PATH
	? require("../../" + process.env.LINQIFY_PATH)
	: require("../linqify");
//require('../../src/linqify');

test("OrderBy", () => {
	let data = [[1, 9, 5], [2, 5, 9], [1, 4, 3], [7, 1, 5]];
	let comparer = (a, b) => {
		for (let i of [0, 1, 2]) {
			if (a[i] > b[i]) return 1;
			else if (a[i] < b[i]) return -1;
		}
		return 0;
	};
	expect(
		[5, 4, 3, 10, 200]
			.OrderBy(t => t)
			.Select(t => t)
			.ToArray()
	).toEqual([3, 4, 5, 10, 200]);
	expect(data.OrderBy(t => t, comparer).ToArray()).toEqual([
		[1, 4, 3],
		[1, 9, 5],
		[2, 5, 9],
		[7, 1, 5]
	]);
});

test("OrderByDescending", () => {
	let data = [[1, 9, 5], [2, 5, 9], [1, 4, 3], [7, 1, 5]];
	let comparer = (a, b) => {
		for (let i of [0, 1, 2]) {
			if (a[i] > b[i]) return 1;
			else if (a[i] < b[i]) return -1;
		}
		return 0;
	};
	expect([5, 4, 3, 8].OrderByDescending(t => t).ToArray()).toEqual([
		8,
		5,
		4,
		3
	]);
	expect(data.OrderByDescending(t => t, comparer).ToArray()).toEqual([
		[7, 1, 5],
		[2, 5, 9],
		[1, 9, 5],
		[1, 4, 3]
	]);
});

test("ThenBy", () => {
	let data = [[1, 9, 5], [2, 5, 9], [1, 4, 3], [7, 1, 5], [7, 1, 3], [7, 1, 5]];
	let comparer = (a, b) => {
		for (let i of [0, 1]) {
			if (a[i] > b[i]) return 1;
			else if (a[i] < b[i]) return -1;
		}
		return 0;
	};
	let comparer2 = (a, b) => {
		for (let i of [2]) {
			if (a[i] > b[i]) return 1;
			else if (a[i] < b[i]) return -1;
		}
		return 0;
	};
	expect(
		[
			...[
				{ i: "Maki", a: 27 },
				{ i: "Gogii", a: 32 },
				{ i: "Sraki", a: 37 },
				{ i: "Sraki", a: 20 }
			]
				.OrderBy(t => t.i)
				.ThenBy(a => a.a)
		][3].a
	).toBe(37);

	expect(
		data
			.OrderBy(t => t, comparer)
			.ThenBy(t => t, comparer2)
			.Select(t => t)
			.ToArray()
	).toEqual([[1, 4, 3], [1, 9, 5], [2, 5, 9], [7, 1, 3], [7, 1, 5], [7, 1, 5]]);
});

test("ThenByDescending", () => {
	let data = [[1, 9, 5], [2, 5, 9], [1, 4, 3], [7, 1, 3], [7, 1, 5], [7, 2, 5]];
	let comparer = (a, b) => {
		for (let i of [0]) {
			if (a[i] > b[i]) return 1;
			else if (a[i] < b[i]) return -1;
		}
		return 0;
	};
	let comparer2 = (a, b) => {
		for (let i of [0, 1]) {
			if (a[i] > b[i]) return 1;
			else if (a[i] < b[i]) return -1;
		}
		return 0;
	};
	expect(
		[
			...[
				{ i: "Maki", a: 27 },
				{ i: "Gogii", a: 32 },
				{ i: "Sraki", a: 37 },
				{ i: "Sraki", a: 50 },
				{ i: "Sraki", a: 20 }
			]
				.OrderByDescending(t => t.i)
				.ThenByDescending(a => a.a)
		][0].a
	).toBe(50);

	expect(
		data
			.OrderBy(t => [t[0]], comparer)
			.ThenByDescending(t => [t[2], t[1]], comparer2)
			.ToArray()
	).toEqual([[1, 9, 5], [1, 4, 3], [2, 5, 9], [7, 2, 5], [7, 1, 5], [7, 1, 3]]);

	let people = [
		{ Name: "Jack", Age: 18 },
		{ Name: "Joe", Age: 18 },
		{ Name: "Jack", Age: 16 }
	];
	expect(
		people
			.OrderBy(t => t.Age)
			.ThenByDescending(t => t.Name)
			.ToArray()
	).toEqual([
		{ Name: "Jack", Age: 16 },
		{ Name: "Joe", Age: 18 },
		{ Name: "Jack", Age: 18 }
	]);
});
