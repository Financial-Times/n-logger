import { formatObject } from './format-splunk';

const nonEmpty = item => item;

export default ({ message = '', level, meta = {} }) => {
	const fields = level ? Object.assign({ level }, meta) : meta;
	return [message, formatObject(fields)]
		.filter(nonEmpty)
		.join(' ');
}
