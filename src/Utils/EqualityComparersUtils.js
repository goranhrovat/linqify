const { getType } = require("./TypeUtils");

// TODO limit depth
// https://stackoverflow.com/questions/38400594/javascript-deep-comparison

// https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
// (Compatible to Java's String.hashCode()) s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
const HashCode = function(s) {
	let h;
	for (let i = 0; i < s.length; i++)
		h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
	return h;
};
const GetHashStringRecursive = function(obj) {
	let hashString = "[" + getType(obj) + "->";
	if (obj != null && typeof obj == "object") {
		if (typeof obj[Symbol.iterator] === "function") obj = [...obj];
		for (let key of Object.keys(obj).sort())
			hashString += key + ":" + GetHashStringRecursive(obj[key]) + ",";
	} else {
		hashString += obj + "";
	}
	return hashString + "]";
};

const EqualsRecursive = function(x, y) {
	if (getType(x) != getType(y)) return false;
	if (x != null && y != null && typeof x == "object") {
		if (
			typeof x[Symbol.iterator] === "function" &&
			typeof y[Symbol.iterator] === "function"
		) {
			x = [...x];
			y = [...y];
		}
		if (Object.keys(x).length !== Object.keys(y).length) return false;
		for (let key of Object.keys(x).sort())
			if (!EqualsRecursive(x[key], y[key])) return false;
		return true;
	} else {
		return x === y;
	}
};

module.exports = { HashCode, GetHashStringRecursive, EqualsRecursive };
