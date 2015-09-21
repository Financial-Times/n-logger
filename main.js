/* global process */
'use strict';

var winston = require('winston');
var Splunk = require('./lib/transports/splunk');

module.exports = (function () {
	var transports = [];
	var options = {};

	// only log errors when testing
	if (process.env.NODE_ENV === 'test') {
		options.level = 'error';
	}
	transports.push(new (winston.transports.Console)(options));
	transports.push(new Splunk(options));

	return new (winston.Logger)({
		transports: transports
	});
})();
