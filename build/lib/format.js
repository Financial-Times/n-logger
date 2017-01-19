'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var sanitise = function sanitise(value) {
	return typeof value === 'string' ? value.replace(/"/g, '\'').replace(/\n/g, '	') : value;
};

var formatMessage = function formatMessage(message) {
	return sanitise(message);
};

var formatValue = function formatValue(value) {
	if (Array.isArray(value)) {
		return '"' + value.map(sanitise).join(',') + '"';
	} else {
		var sanitisedValue = sanitise(value);
		// wrap in quotes, if it contains a space
		return (/\s/.test(sanitisedValue) ? '"' + sanitisedValue + '"' : sanitisedValue
		);
	}
};

var formatFields = function formatFields() {
	var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$splunkFriendly = _ref.splunkFriendly,
	    splunkFriendly = _ref$splunkFriendly === undefined ? false : _ref$splunkFriendly;

	var formattedFields = Object.keys(fields).map(function (fieldName) {
		var fieldValue = splunkFriendly ? formatValue(fields[fieldName]) : fields[fieldName];
		return fieldName + '=' + fieldValue;
	});

	return formattedFields.join(' ');
};

exports.message = formatMessage;
exports.fields = formatFields;