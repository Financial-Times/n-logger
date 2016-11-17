import winston from 'winston';

import Splunk from './transports/splunk';
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
		metas.unshift(message)
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
		this.deps = Object.assign({ winston, formatter, Splunk }, deps);
		this.logger = new (this.deps.winston.Logger)();
		// create logging methods
		Object.keys(this.logger.levels).forEach(level =>
			this[level] = (...args) => this.log(level, ...args)
		);
	}

	log (level, message, ...metas) {
		const args = loggerArgs(level, message, ...metas).filter(utils.identity);
		this.logger.log.apply(this.logger, args);
	}

	addConsole (level = 'info', opts = {}) {
		if (this.logger.transports.console) {
			return;
		}
		this.logger.add(
			this.deps.winston.transports.Console,
			Object.assign({ level, formatter: this.deps.formatter }, opts)
		);
	}

	removeConsole () {
		if (!this.logger.transports.console) {
			return;
		}
		this.logger.remove('console');
	}

	addSplunk (splunkUrl, level = 'info', opts = {}) {
		if (this.logger.transports.splunk) {
			return;
		}
		if (!splunkUrl) {
			this.warn('No `splunkUrl` supplied');
			return false;
		}
		this.logger.add(
			this.deps.Splunk,
			Object.assign({ level, splunkUrl }, opts)
		);
	}

	removeSplunk () {
		if (!this.logger.transports.splunk) {
			return;
		}
		this.logger.remove('splunk');
	}

	clearLoggers () {
		Object.keys(this.logger.transports)
			.forEach(logger => this.logger.remove(logger));
	}

}

export default Logger;
