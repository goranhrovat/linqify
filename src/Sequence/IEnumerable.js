class IEnumerable {
	constructor(gen) {
		this._gen = gen;
	}

	[Symbol.iterator]() {
		return this._gen();
	}
}

module.exports = { IEnumerable };
