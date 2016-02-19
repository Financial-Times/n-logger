import { formatMessage, formatFields } from './format';

const nonEmpty = item => item;

export default ({ level, message = '', meta = {} }) => {
	const fields = level ? Object.assign({ level }, meta) : meta;
	return [formatMessage(message), formatFields(fields)]
		.filter(nonEmpty)
		.join(' ');
}
