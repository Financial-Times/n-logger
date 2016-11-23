import * as format from './format';
import * as utils from './utils';

 const formatter = ({ level, message = '', meta = {} }) => {
	if (level) {
		meta.level = level
	}
	return [format.message(message), format.fields(meta)]
		.filter(utils.identity)
		.join(' ');
}

export default formatter;
