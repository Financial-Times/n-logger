'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _format = require('./format');

var format = _interopRequireWildcard(_format);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var formatter = function formatter() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    level = _ref.level,
	    _ref$message = _ref.message,
	    message = _ref$message === undefined ? '' : _ref$message,
	    _ref$meta = _ref.meta,
	    meta = _ref$meta === undefined ? {} : _ref$meta,
	    _ref$splunkFriendly = _ref.splunkFriendly,
	    splunkFriendly = _ref$splunkFriendly === undefined ? false : _ref$splunkFriendly;

	if (level) {
		meta.level = level;
	}
	var formattedMessage = splunkFriendly ? format.message(message) : message;
	return [formattedMessage, format.fields(meta, { splunkFriendly: splunkFriendly })].filter(utils.identity).join(' ');
};

exports.default = formatter;