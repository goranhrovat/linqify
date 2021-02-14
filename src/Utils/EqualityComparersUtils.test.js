const { GetHashStringRecursive } = require("./EqualityComparersUtils");

let person3 = {
	name: "test3",
	age: 25,
	grades: [1, 2, 3, 4],
	distance: {
		length: 5,
		width: 8,
		transport: [
			{ auto: true, values: [1, 2, 5] },
			{ auto: false, values: [1, 3, 6] },
			{ auto: true, values: [1, 4, 7] },
		],
	},
};
test("GetHashStringRecursive", () => {
	expect(
		GetHashStringRecursive(
			new Map([
				[1, 2],
				[3, 4],
				[5, 6],
			])
		)
	).toBe(
		"[Map->0:[Array->0:[number->1],1:[number->2],],1:[Array->0:[number->3],1:[number->4],],2:[Array->0:[number->5],1:[number->6],],]"
	);
	expect(GetHashStringRecursive(new Set([1, 2, 3]))).toBe(
		"[Set->0:[number->1],1:[number->2],2:[number->3],]"
	);
	expect(GetHashStringRecursive(person3)).toBe(
		"[Object->age:[number->25],distance:[Object->length:[number->5],transport:[Array->0:[Object->auto:[boolean->true],values:[Array->0:[number->1],1:[number->2],2:[number->5],],],1:[Object->auto:[boolean->false],values:[Array->0:[number->1],1:[number->3],2:[number->6],],],2:[Object->auto:[boolean->true],values:[Array->0:[number->1],1:[number->4],2:[number->7],],],],width:[number->8],],grades:[Array->0:[number->1],1:[number->2],2:[number->3],3:[number->4],],name:[string->test3],]"
	);
	expect(GetHashStringRecursive({ 0: 1, 1: 2 })).toBe(
		"[Object->0:[number->1],1:[number->2],]"
	);
	expect(GetHashStringRecursive([1, 2, null])).toBe(
		"[Array->0:[number->1],1:[number->2],2:[null->null],]"
	);
});
