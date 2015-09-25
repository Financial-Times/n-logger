/* global process */
'use strict';

const winston = require('winston');
const Splunk = require('./lib/transports/splunk');

class Logger {

	constructor() {
		this.logger = new (winston.Logger)();
	}

	init(appName, opts) {
		this.appName = appName;
		this.opts = opts;

		// add console logger
		this.logger.add(
			winston.transports.Console,
			Object.assign({}, {
				level: process.env.NODE_ENV === 'test' ? 'error' : 'info'
			}, opts)
		);
		if (process.env.NODE_ENV !== 'test') {
			// add splunk logger
			this.logger.add(
				Splunk,
				Object.assign({}, {
					level: 'error',
					appName
				}, opts)
			);
		}
	}

}

module.exports = new Logger();
