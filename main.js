'use strict';

var winston = require('winston');

module.exports = (function () {
	var transports = [];

	if (process.env.NODE_ENV !== 'test') {
		transports.push(new (winston.transports.Console)());
	}
	return new (winston.Logger)({
	    transports: transports
	});
})();
