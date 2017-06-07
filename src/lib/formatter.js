import * as format from './format';
import * as utils from './utils';

const formatter = ({ level, message = '', meta = {}, splunkFriendly = false } = {}) => {
	if (level) {
		meta.level = level;
	}
	const formattedMessage = splunkFriendly ? format.message(message) : message;
	return [formattedMessage, format.fields(meta, { splunkFriendly })]
		.filter(utils.identity)
		.join(' ');
};

export default formatter;
