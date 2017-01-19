'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _logger = require('./lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _logger2.default();

logger.addConsole(process.env.CONSOLE_LOG_LEVEL || 'silly');

// only log to splunk in production
if (process.env.NODE_ENV === 'production' && process.env.SPLUNK_URL) {
	logger.addSplunk(process.env.SPLUNK_URL, process.env.SPLUNK_LOG_LEVEL || 'warn');
}

exports.default = logger;