/* global process */
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

	addSplunk(appName, splunkUrl, level, opts) {
		if (this.logger.transports.splunk) {
			return;
		}
		if (!appName || !splunkUrl) {
			this.logger.warn('No `appName` or `splunkUrl` supplied');
			return false;
		}
		this.logger.add(
			Splunk,
			Object.assign({}, {
				level: level || 'error',
				appName,
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

module.exports = new Logger();
