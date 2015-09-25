/* global process */
'use strict';

const winston = require('winston');
const Splunk = require('./lib/transports/splunk');

let logger;
let appName;
let opts;
let inited = false;

module.exports = {
	init(applicationName, options) {
		appName = applicationName;
		opts = options;
		inited = true;
	},

	get logger() {
		if (logger) {
			return logger;
		}
		if (!inited) {
			console.error('ft-next-logger: please call init first');
		}
		const transports = [];
		transports.push(
			// only log errors to console when testing
			new (winston.transports.Console)(
				Object.assign({}, {
					level: process.env.NODE_ENV === 'test' ? 'error' : 'info'
				}, opts)
			)
		);
		if (process.env.NODE_ENV !== 'test') {
			transports.push(
				new Splunk(
					appName,
					Object.assign({}, {
						level: 'error'
					}, opts)
				)
			);
		}

		return logger = new (winston.Logger)({
			transports: transports
		});

	},

	reset() {
		logger = undefined;
		appName = undefined;
		opts = undefined;
		inited = false;
	}
};
