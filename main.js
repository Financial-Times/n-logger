/* global process */
'use strict';

const winston = require('winston');
const Splunk = require('./lib/transports/splunk');

class Logger {

	constructor() {
		this.logger = new (winston.Logger)();
		this.inited = false;
	}

	init(appName, opts, transports) {
		if (this.inited) {
			return;
		}
		this.inited = true;
		this.appName = appName;
		this.opts = opts;

		// add console logger
		this.logger.add(
			winston.transports.Console,
			Object.assign({}, {
				level: process.env.NODE_ENV === 'test' ? 'error' : 'info'
			}, opts)
		);
		if (process.env.NODE_ENV === 'production' || (transports && transports.splunk)) {
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
