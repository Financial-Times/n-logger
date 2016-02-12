import formatMessage from './format-message';
import formatMeta from './format-meta';

const nonEmpty = item => item;

const extractErrorDetails = err => ({
	error_message: err.message,
	error_name: err.name,
	error_stack: err.stack
});

const handleErrorMessage = (message, meta) => {
	if (message instanceof Error) {
		return [message.message, Object.assign({}, extractErrorDetails(message), meta)];
	} else if (meta instanceof Error) {
		return [message, extractErrorDetails(meta)];
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
