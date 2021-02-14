const {
	HashCode,
	GetHashStringRecursive,
	EqualsRecursive,
} = require("./EqualityComparersUtils");

const EqualityComparers = {
	DeepComparer: (selector = (t) => t) => ({
		Equals: (x, y) => EqualsRecursive(selector(x), selector(y)),
		GetHashCode: (obj) => HashCode(GetHashStringRecursive(selector(obj))),
	}),
	PrimitiveComparer: {
		Equals: (x, y) => x === y,
		GetHashCode: (obj) => obj,
	},
};

module.exports = { EqualityComparers };
