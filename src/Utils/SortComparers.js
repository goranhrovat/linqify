const SortComparers = {
	DefaultComparer: (a, b) => (a > b ? 1 : a < b ? -1 : 0),
	DefaultComparerReverse: (a, b) => (a > b ? -1 : a < b ? 1 : 0)
};

module.exports = { SortComparers };
