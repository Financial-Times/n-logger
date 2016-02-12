import formatMessage from './format-message';
import formatMeta from './format-meta';

const nonEmpty = item => item;

const handleErrorMessage = (message, meta) => {
	if (message instanceof Error) {
		meta.errorName = message.name;
		meta.errorStack = message.stack;
		return [message.message, meta];
	} else {
		return [message, meta];
	}
}

export default ({ message = '', level, meta = {} }) => {
	const [updatedMessage, updatedMeta] = handleErrorMessage(message, meta);
	const fields = level ? Object.assign({ level }, updatedMeta) : updatedMeta;
	return [formatMessage(updatedMessage), formatMeta(fields)]
		.filter(nonEmpty)
		.join(' ');
}
