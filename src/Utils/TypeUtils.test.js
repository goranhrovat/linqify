var { defaultVal } = require("./TypeUtils");

test("defaultVal", () => {
	expect(() => defaultVal(1)).toThrow("Type must be a string.");
	expect(defaultVal("boolean")).toBe(false);
	expect(defaultVal("function")).toBeInstanceOf(Function);
	expect(defaultVal("null")).toBe(null);
	expect(defaultVal("object")).toEqual({});
	expect(typeof defaultVal("symbol")).toBe("symbol");
	expect(defaultVal("undefined")).toBe(void 0);
});
