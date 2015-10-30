'use strict';

const winston = require('winston');
const Splunk = require('./lib/transports/splunk');

class Logger {

	constructor() {
		this.logger = new (winston.Logger)();
		this.inited = false;
	}

	addConsole(level, opts) {
		if (this.logger.transports.console) {
			return;
		}
		this.logger.add(
			winston.transports.Console,
			Object.assign({}, {
				level: level || 'info'
			}, opts)
		);
	}

	removeConsole() {
		if (!this.logger.transports.console) {
			return;
		}
		this.logger.remove('console');
	}

	addSplunk(splunkUrl, level, opts) {
		if (this.logger.transports.splunk) {
			return;
		}
		if (!splunkUrl) {
			this.logger.warn('No `splunkUrl` supplied');
			return false;
		}
		this.logger.add(
			Splunk,
			Object.assign({}, {
				level: level || 'info',
				splunkUrl
			}, opts)
		);
	}

	removeSplunk() {
		if (!this.logger.transports.splunk) {
			return;
		}
		this.logger.remove('splunk');
	}

	clearLoggers() {
		Object.keys(this.logger.transports)
			.forEach(logger => this.logger.remove(logger));
	}

}

const logger = new Logger();

let consoleLoggerLevel;
if(process.env.NODE_ENV === 'test') {
	consoleLoggerLevel = 'error';
} else {
	consoleLoggerLevel = process.env.CONSOLE_LOGGER_LEVEL || 'info'
}
logger.addConsole(consoleLoggerLevel);

if (process.env.NODE_ENV === 'production' && process.env.SPLUNK_URL) {
	logger.addSplunk(process.env.SPLUNK_URL);
}

module.exports = logger;
