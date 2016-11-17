import * as format from './format';
import * as utils from './utils';

export default ({ level, message = '', meta = {} }) => {
	if (level) {
		meta.level = level
	}
	return [format.message(message), format.fields(meta)]
		.filter(utils.identity)
		.join(' ');
}
