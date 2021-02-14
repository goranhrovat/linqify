/**
 * @jest-environment node
 */

Object.defineProperty(Array.prototype, "Select", {
	enumerable: false,
	writable: false,
	configurable: true,
	value: () => 123,
});

Object.defineProperty(Array.prototype, "Where", {
	enumerable: false,
	writable: false,
	configurable: false,
	value: () => 1234,
});

afterEach(() => {
	jest.resetModules();
});

test("nowindow", () => {
	var { linqify } = process.env.LINQIFY_PATH
		? require("../../" + process.env.LINQIFY_PATH)
		: require("../linqify");

	expect(typeof window == "undefined").toBeTruthy();

	let lq = linqify.noConflict();
	expect(
		lq([1, 2])
			.Where((t) => t > 1)
			.ToArray()
	).toEqual([2]);
});
