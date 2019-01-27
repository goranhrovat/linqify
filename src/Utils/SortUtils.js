const { SortComparers } = require("./SortComparers");

function getComparer(keySelector, comparer) {
	if (comparer === undefined) {
		return (a, b) =>
			SortComparers.DefaultComparer(keySelector(a), keySelector(b));
	} else {
		return (a, b) => comparer(keySelector(a), keySelector(b));
	}
}
function getComparerReverse(keySelector, comparer) {
	if (comparer === undefined) {
		return (a, b) =>
			SortComparers.DefaultComparerReverse(keySelector(a), keySelector(b));
	} else {
		return (a, b) => -comparer(keySelector(a), keySelector(b));
	}
}
function* sortGen(source, cmpfuns) {
	if (cmpfuns.length == 1) {
		yield* [...source].sort(cmpfuns[0]);
	} else {
		yield* [...source].sort((a, b) => {
			for (let cf of cmpfuns) {
				let res = cf(a, b);
				if (res != 0) return res;
			}
			return 0;
		});
	}
}

module.exports = { getComparer, getComparerReverse, sortGen };
