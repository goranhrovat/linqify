var { EqualityComparers } = process.env.LINQIFY_PATH
	? require("../../" + process.env.LINQIFY_PATH)
	: require("../linqify");

test("DeepComparer", () => {
	let cmp = EqualityComparers.DeepComparer((t) => ({
		name: t.name,
		props: { grades: t.grades },
	}));
	let person1 = {
		grades: [1, 2, 3],
		age: 20,
		name: "test",
	};
	let person2 = {
		name: "test",
		age: 22,
		grades: [1, 2, 3],
	};
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

	expect(cmp.Equals(person1, person2)).toBeTruthy();
	expect(cmp.Equals(person1, person3)).toBeFalsy();
	expect(EqualityComparers.DeepComparer().GetHashCode(person3)).toEqual(
		-1609480414
	);
	expect(cmp.GetHashCode(person3)).toEqual(-891271352);
	expect(cmp.GetHashCode(person1) === cmp.GetHashCode(person2)).toBeTruthy();
	expect(cmp.GetHashCode(person1)).toBe(1849273306);
	expect(cmp.GetHashCode(person2)).toBe(1849273306);
	expect(
		EqualityComparers.DeepComparer().Equals({ 0: 1, 1: 2 }, [1, 2])
	).toBeFalsy();
	expect(
		EqualityComparers.DeepComparer().Equals([1, 2, 3], [1, 2])
	).toBeFalsy();

	let date1 = new Date(2000, 10);
	let date2 = new Date(2000, 10);
	let date3 = new Date(2001, 10);
	expect(EqualityComparers.DeepComparer().Equals(date1, date2)).toBeTruthy();
	expect(EqualityComparers.DeepComparer().Equals(date1, date3)).toBeFalsy();
	expect(EqualityComparers.DeepComparer().Equals(date1, {})).toBeFalsy();
});
