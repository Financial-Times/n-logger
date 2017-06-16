const format = require('./format');
const utils = require('./utils');

const formatter = ({ level, message = '', meta = {}, splunkFriendly = false } = {}) => {
	if (level) {
		meta.level = level;
	}
	const formattedMessage = splunkFriendly ? format.message(message) : message;
	return [formattedMessage, format.fields(meta, { splunkFriendly })]
		.filter(utils.identity)
		.join(' ');
};

module.exports = formatter;
