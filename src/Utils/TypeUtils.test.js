var { defaultVal, getType } = require("./TypeUtils");

test("defaultVal", () => {
	expect(() => defaultVal(1)).toThrow("Type must be a string.");
	expect(defaultVal("boolean")).toBe(false);
	let defFun = defaultVal("function");
	expect(defFun).toBeInstanceOf(Function);
	expect(defFun).not.toThrow();
	expect(defaultVal("null")).toBe(null);
	expect(defaultVal("object")).toEqual({});
	expect(typeof defaultVal("symbol")).toBe("symbol");
	expect(defaultVal("undefined")).toBe(void 0);
	expect(defaultVal("")).toEqual({});
	expect(defaultVal("number")).toEqual(Number(0));

	expect(defaultVal("number")).toBe(0);
	let a = {};
	a.constructor = { name: null };
	expect(getType(a)).toBe("object");
});
