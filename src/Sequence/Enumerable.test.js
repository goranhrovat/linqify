var { Enumerable } = process.env.LINQIFY_PATH
	? require("../../" + process.env.LINQIFY_PATH)
	: require("../linqify");
//var {Enumerable} = require('../../src/linqify');

test("From", () => {
	let myarr = Enumerable.From(function*() {
		yield 2;
		yield 5;
		yield 8;
	});
	expect(myarr.ToArray()).toEqual([2, 5, 8]);
	expect([...Enumerable.From([1, 2, 3]).Select(t => t * 2)]).toEqual([2, 4, 6]);
	expect([...Enumerable.From(Enumerable.From([1, 2, 3]))]).toEqual([1, 2, 3]);
});

test("Range", () => {
	expect(Enumerable.Range(8, 4).ToArray()).toEqual([8, 9, 10, 11]);
	expect(() => Enumerable.Range(8, -1).ToArray()).toThrow(
		"count is less than 0"
	);
});

test("Repeate", () => {
	expect(Enumerable.Repeat("abc", 4).ToArray()).toEqual([
		"abc",
		"abc",
		"abc",
		"abc"
	]);
	expect(() => Enumerable.Repeat("abc", -1).ToArray()).toThrow(
		"count is less than 0"
	);
});

test("Empty", () => {
	expect(Enumerable.Empty().ToArray()).toEqual([]);
});

test("setMethod", () => {
	Enumerable.setMethod("EvenElements", function*() {
		let ind = 0;
		for (let t of this) if (ind++ % 2 === 0) yield t;
	});
	// @ts-ignore
	expect([1, 2, 3].EvenElements().ToArray()).toEqual([1, 3]);
});
