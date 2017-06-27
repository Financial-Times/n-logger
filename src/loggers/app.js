const winston = require('winston');

const Logger = require('./logger');
const Splunk = require('../transports/splunk');
const utils = require('../utils');

module.exports = class extends Logger {
	constructor (deps = {}) {
		super(Object.assign({ winston, Splunk }, deps));
		this.logger = new (this.deps.winston.Logger)();
	}

	log (...args) {
		const { level, message, meta } = this.tidyArgs(...args);
		this.logger.log.apply(null, ([level, message, meta].filter(utils.identity)));
	}

	addConsole (level = 'info', opts = {}) {
		if (this.logger.transports.console) {
			return;
		}
		this.logger.add(
			this.deps.winston.transports.Console,
			Object.assign({ level, formatter: this.deps.formatter, colorize: true }, opts)
		);
	}

	removeConsole () {
		if (this.logger.transports.console) {
			this.logger.remove('console');
		}
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
		if (this.logger.transports.splunk) {
			this.logger.remove('splunk');
		}
	}

	clearLoggers () {
		Object.keys(this.logger.transports)
			.forEach(logger => this.logger.remove(logger));
	}
};
