const Logger = require('./logger');

module.exports = class extends Logger {
	constructor (deps = {}) {
		super(deps);
	}

	log (...args) {
		const tidiedArgs = this.tidyArgs(...args);
		const formattedMessage = this.deps.formatter(tidiedArgs);
		console.log(formattedMessage); // eslint-disable-line no-console
	}
};
