const { noConflict } = require("./NoConflict/NoConflict");
const { addConflictGlobalVar } = require("./NoConflict/AddConflict");
const globalVars = [
	"Enumerable",
	"Dictionary",
	"HashSet",
	"List",
	"EqualityComparers",
	"SortComparers",
	"linqify"
];
for (let t of globalVars) addConflictGlobalVar(t);

const linqObjects = require("./linqifyObjects");

const {
	Dictionary,
	Enumerable,
	EqualityComparers,
	HashSet,
	List,
	SortComparers
} = linqObjects;

require("./Sequence/IOrderedEnumerable");
// extend Array, Map, Set, and String
require("./Methods/NativeExtensions");
// add other LINQ methods and further extend Array, Map, Set, and String
require("./Methods/Methods");

const linqify = Enumerable.From;
for (let [key, value] of Object.entries(linqObjects)) linqify[key] = value;
linqify["noConflict"] = noConflict;
// const linqify = {
// 	Dictionary,
// 	Enumerable,
// 	EqualityComparers,
// 	HashSet,
// 	SortComparers,
// 	noConflict
// };
module.exports = {
	Dictionary,
	Enumerable,
	EqualityComparers,
	HashSet,
	List,
	SortComparers,
	linqify
};
