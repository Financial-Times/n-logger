/* global process */
'use strict';

const winston = require('winston');
const Splunk = require('./lib/transports/splunk');

module.exports = (() => {
	const transports = [];
	transports.push(
		// only log errors to console when testing
		new (winston.transports.Console)({
			level: process.env.NODE_ENV === 'test' ? 'error' : 'info'
		})
	);
	if (process.env.NODE_ENV !== 'test') {
		transports.push(
			new Splunk({
				level: 'error'
			})
		);
	}

	return new (winston.Logger)({
		transports: transports
	});
})();
