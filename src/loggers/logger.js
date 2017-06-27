const formatter = require('../formatter');

const extractErrorDetails = obj => {
	if (obj instanceof Error) {
		const deets = {
			error_message: obj.message,
			error_name: obj.name
		};
		if ('stack' in obj) {
			deets.error_stack = obj.stack;
		}

		return deets;
	} else {
		return obj;
	}
};

module.exports = class {
	constructor (deps = {}) {
		this.deps = Object.assign({ formatter }, deps);
		this.context = {};
		// create logging methods
		['silly', 'debug', 'verbose', 'info', 'warn', 'error'].forEach(level =>
			this[level] = (...args) => this.log(level, ...args)
		);
	}

	tidyArgs (level, ...metas) {
		const args = {
			level
		};
		// if first meta object is a string, assume it's the message
		if (typeof metas[0] === 'string') {
			args.message = metas.shift();
		}
		args.meta = [this.context].concat(metas)
			.reduceRight((metaAcc, meta) => {
				return Object.assign({}, metaAcc, extractErrorDetails(meta));
			}, {});

		return args;
	}

	log () { }

	addContext (meta = {}) {
		this.context = Object.assign({}, this.context, meta);
	}
};
