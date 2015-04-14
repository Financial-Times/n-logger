'use strict';

var winston = require('winston');

module.exports = (function () {
	var transports = [];
	var options = {};

	// only log errors when testing
	if (process.env.NODE_ENV === 'test') {
		options.level = 'error';
	}
	transports.push(new (winston.transports.Console)(options));

	return new (winston.Logger)({
		transports: transports
	});
})();
