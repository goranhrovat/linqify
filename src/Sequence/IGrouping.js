var { IEnumerable } = require("./IEnumerable");

class IGrouping extends IEnumerable {
	constructor(key, source) {
		super(function*() {
			yield* source;
		});
		this.key = key;
	}

	get Key() {
		return this.key;
	}
}

module.exports = { IGrouping };
