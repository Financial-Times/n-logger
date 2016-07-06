const extractErrorDetails = err => {
	const deets = {
		error_message: err.message,
		error_name: err.name
	};
	if (err.stack) {
		deets.error_stack = err.stack;
	}

	return deets;
};

const deQuote = string => (typeof string === 'string') ? string.replace(/"/g, '\'') : string;

const formatMessage = message => deQuote(message);

const formatError = data => (data instanceof Error) ? extractErrorDetails(data) : data;

const formatFields = fields => {
	const formattedFields = Object.keys(fields)
		.map(key => {
			let value = formatValue(fields[key]);
			return `${key}=${value}`;
		});

	return formattedFields.join(' ');
};

// wrap in quotes, if it contains a space
const formatValue = value => (/\s/.test(value)) ? `"${deQuote(value)}"` : deQuote(value);

export { formatError, formatMessage, formatFields, formatValue }
