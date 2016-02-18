import { formatObject } from './format-splunk';

const extractErrorDetails = err => ({
	error_message: err.message,
	error_name: err.name,
	error_stack: err.stack
});

export default message => {
	if (typeof message === 'string') {
		return message.replace(/"/g, '\'');
	} else if (message instanceof Error) {
		return formatObject(extractErrorDetails(message));
	} else {
		return message;
	}
}
