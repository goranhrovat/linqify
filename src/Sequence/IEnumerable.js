class IEnumerable {
	constructor(gen, ...args) {
		this.gen = gen;
		this.args = args;
	}

	[Symbol.iterator]() {
		return this.gen(...this.args);
	}
}

module.exports = { IEnumerable };
