const {
	globalVars,
	nativeExstensions,
	nativeExstensionsNames,
	noConflictMode
} = require("./AddConflict");

const noConflict = function() {
	if (noConflictMode.value) throw "You can call noConflict only once!";

	if (typeof window !== "undefined") {
		// only browser - remove global vars
		for (let t of globalVars) window[t.name] = t.value;
		globalVars.length = 0;
	}
	// NODE & browser - remove native extensions
	for (let t of nativeExstensions) {
		if (t.descriptor === undefined) {
			delete t.type.prototype[t.methodName];
		} else {
			Object.defineProperty(t.type.prototype, t.methodName, t.descriptor);
		}
	}
	nativeExstensions.length = 0;
	nativeExstensionsNames.clear();
	noConflictMode.value = true;
	let linqObjects = require("../linqifyObjects");
	let lq = linqObjects.Enumerable.From;
	for (let [key, value] of Object.entries(linqObjects)) lq[key] = value;
	return lq;
};

module.exports = { noConflict };
