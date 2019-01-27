var globalVars = [];
var nativeExstensions = [];
var nativeExstensionsNames = new Set();
var noConflictMode = { value: false };

const addConflictGlobalVar = function(name) {
	if (typeof window !== "undefined") {
		globalVars.push({ name, value: window[name] });
	}
};

const tryAddConflictProperty = function(type, methodName, value) {
	if (noConflictMode.value) return;
	// check
	if (type.prototype.hasOwnProperty(methodName)) {
		if (
			!Object.getOwnPropertyDescriptor(type.prototype, methodName).configurable
		) {
			// eslint-disable-next-line no-console
			console.warn(
				"Method " + methodName + " on " + type.name + " can not be changed!"
			);
			return;
		}
	}
	if (!nativeExstensionsNames.has(type.name + "_" + methodName)) {
		nativeExstensions.push({
			methodName,
			type,
			descriptor: Object.getOwnPropertyDescriptor(type.prototype, methodName)
		});
		nativeExstensionsNames.add(type.name + "_" + methodName);
	}
	// define
	Object.defineProperty(type.prototype, methodName, {
		enumerable: false,
		writable: false,
		configurable: true,
		value
	});
};

module.exports = {
	addConflictGlobalVar,
	tryAddConflictProperty,
	globalVars,
	nativeExstensions,
	nativeExstensionsNames,
	noConflictMode
};
