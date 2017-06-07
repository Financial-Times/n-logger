import formatter from './formatter';
import * as utils from './utils';

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

const loggerArgs = (level, message, ...metas) => {
	const args = [level];
	// if not a string, assume it's a meta object
	if (typeof message === 'string') {
		args.push(message);
	} else {
		metas.unshift(message);
	}
	if (metas.length) {
		args.push(
			metas.reduceRight((currentFormattedMetas, meta) =>
				Object.assign({}, currentFormattedMetas, extractErrorDetails(meta)),
			{})
		);
	}
	return args;
};

class Logger {

	constructor (deps = {}) {
		this.deps = Object.assign({ formatter }, deps);
		this.context = {};
		// create logging methods
		['data', 'debug', 'error', 'info', 'silly', 'verbose', 'warn'].forEach(level =>
			this[level] = (...args) => this.log(level, ...args)
		);
	}

	log (level, message, ...metas) {
		const args = loggerArgs(level, message, ...metas, this.context)
			.filter(utils.identity);
		this.doLog.apply(this, args);
	}

	doLog (/* level, message, meta */) {
		// to be implemented by subclasses
	}

	addContext (meta = {}) {
		this.context = Object.assign({}, this.context, meta);
	}

}

export default Logger;
