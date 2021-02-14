var { IEnumerable } = require("./IEnumerable");

class IGrouping extends IEnumerable {
	constructor(key, source) {
		super(function* () {
			yield* source;
		});
		this._key = key;
	}

	get Key() {
		return this._key;
	}
}

module.exports = { IGrouping };
