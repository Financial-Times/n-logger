'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _formatter = require('./formatter');

var _formatter2 = _interopRequireDefault(_formatter);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extractErrorDetails = function extractErrorDetails(obj) {
	if (obj instanceof Error) {
		var deets = {
			error_message: obj.message,
			error_name: obj.name
		};
		if ('stack' in obj) {
			deets.error_stack = obj.stack;
		}

		return deets;
	} else {
		return obj;
	}
};

var loggerArgs = function loggerArgs(level, message) {
	for (var _len = arguments.length, metas = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		metas[_key - 2] = arguments[_key];
	}

	var args = [level];
	// if not a string, assume it's a meta object
	if (typeof message === 'string') {
		args.push(message);
	} else {
		metas.unshift(message);
	}
	if (metas.length) {
		args.push(metas.reduceRight(function (currentFormattedMetas, meta) {
			return _extends({}, currentFormattedMetas, extractErrorDetails(meta));
		}, {}));
	}
	return args;
};

var Logger = function () {
	function Logger() {
		var _this = this;

		var deps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, Logger);

		this.deps = _extends({ formatter: _formatter2.default }, deps);
		this.context = {};
		// create logging methods
		['data', 'debug', 'error', 'info', 'silly', 'verbose', 'warn'].forEach(function (level) {
			return _this[level] = function () {
				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				return _this.log.apply(_this, [level].concat(args));
			};
		});
	}

	_createClass(Logger, [{
		key: 'log',
		value: function log(level, message) {
			for (var _len3 = arguments.length, metas = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
				metas[_key3 - 2] = arguments[_key3];
			}

			var args = loggerArgs.apply(undefined, [level, message].concat(metas, [this.context])).filter(utils.identity);
			this.logToConsole.apply(this, args);
		}
	}, {
		key: 'logToConsole',
		value: function logToConsole(level, message, meta) {
			if (typeof message !== 'string') {
				meta = _extends(message, meta);
				message = null;
			}
			var formattedMessage = this.deps.formatter({ level: level, message: message, meta: meta, splunkFriendly: true });
			console.log(formattedMessage);
		}
	}, {
		key: 'addContext',
		value: function addContext() {
			var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			this.context = _extends({}, this.context, meta);
		}
	}]);

	return Logger;
}();

exports.default = Logger;