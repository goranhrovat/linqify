// https://stackoverflow.com/questions/14603106/default-value-of-a-type-in-javascript
function getType(obj) {
	var type = typeof obj;

	if (type !== "object") return type; // primitive or function
	if (obj === null) return "null"; // null

	// Everything else, check for a constructor
	var ctor = obj.constructor;
	var name = typeof ctor === "function" && ctor.name;

	return typeof name === "string" && name.length > 0 ? name : "object";
}

function defaultVal(type) {
	if (typeof type !== "string") throw new TypeError("Type must be a string.");

	// Handle simple types (primitives and plain function/object)
	switch (type) {
		case "boolean":
			return false;
		case "function":
			return function () {};
		case "null":
			return null;
		case "number":
			return 0;
		case "object":
			return {};
		case "string":
			return "";
		case "symbol":
			return Symbol();
		case "undefined":
			return void 0;
	}

	try {
		// Look for constructor in this or current scope
		var ctor = typeof this[type] === "function" ? this[type] : eval(type);

		return new ctor();

		// Constructor not found, return new object
	} catch (e) {
		return {};
	}
}

module.exports = { getType, defaultVal };
