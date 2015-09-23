/* global process */
'use strict';

const winston = require('winston');
const Splunk = require('./lib/transports/splunk');

let logger;
let config;

module.exports = {
	init(c) {
		config = c;
	},

	get logger() {
		if (logger) {
			return logger;
		}
		if (!config) {
			throw new Error('Please call init first');
		}
		const transports = [];
		transports.push(
			// only log errors to console when testing
			new (winston.transports.Console)({
				level: process.env.NODE_ENV === 'test' ? 'error' : 'info'
			})
		);
		if (process.env.NODE_ENV !== 'test') {
			transports.push(
				new Splunk(config.appName, {
					level: 'error'
				})
			);
		}

		return logger = new (winston.Logger)({
			transports: transports
		});

	}
};
