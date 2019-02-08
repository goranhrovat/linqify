Object.defineProperty(Array.prototype, "Select", {
	enumerable: false,
	writable: false,
	configurable: true,
	value: () => 123
});

Object.defineProperty(Array.prototype, "Where", {
	enumerable: false,
	writable: false,
	configurable: false,
	value: () => 1234
});

afterEach(() => {
	jest.resetModules();
});

test("NoConflict", () => {
	var { linqify } = process.env.LINQIFY_PATH
		? require("../../" + process.env.LINQIFY_PATH)
		: require("../linqify");

	linqify.Enumerable.setMethod("Test", () => 234);
	linqify.Enumerable.setMethod("Test", () => 234);
	expect([1, 2].Select(t => t * 2).ToArray()).toEqual([2, 4]);
	expect([1, 2].Where()).toEqual(1234);
	expect(
		linqify.Enumerable.From([1, 2])
			.Where(t => t > 1)
			.ToArray()
	).toEqual([2]);
	expect(
		linqify([1, 2])
			.Where(t => t > 1)
			.ToArray()
	).toEqual([2]);
	let lq = linqify.noConflict();
	lq.Enumerable.setMethod("Select", () => 234);
	expect([1, 2].Select()).toBe(123);
	expect([1, 2].Where()).toEqual(1234);
	expect(
		lq([1, 2])
			.Where(t => t > 1)
			.ToArray()
	).toEqual([2]);
	expect(
		lq.Enumerable.From([1, 2])
			.Where(t => t > 1)
			.ToArray()
	).toEqual([2]);
	expect(() => linqify.noConflict()).toThrow(
		"You can call noConflict only once!"
	);
});
