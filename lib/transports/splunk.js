'use strict';

var util = require('util'),
	winston = require('winston');

var Splunk = function (options) {
	this.name = 'splunk';
	this.level = options.level || 'info';
};

util.inherits(Splunk, winston.Transport);

Splunk.prototype.log = function (level, msg, meta, callback) {
	callback(null, true);
};

module.exports = Splunk;
