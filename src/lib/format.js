const deQuote = value => (typeof value === 'string') ? value.replace(/"/g, '\'') : value;

const extractErrorDetails = err => {
	const deets = {
		error_message: err.message,
		error_name: err.name
	};
	if (err.stack) {
		// logs need to all be on one line, so remove newlines from the stacktrace
		deets.error_stack = err.stack.replace(/\n/g, '; ');
	}

	return deets;
};

const formatError = data => (data instanceof Error) ? extractErrorDetails(data) : data;

const formatMessage = message => deQuote(message);

// wrap in quotes, if it contains a space
const formatValue = value => {
	if (Array.isArray(value)) {
		return `"${value.join(',')}"`;
	} else {
		return (/\s/.test(value)) ? `"${deQuote(value)}"` : deQuote(value);
	}
}

const formatFields = fields => {
	const formattedFields = Object.keys(fields)
		.map(key => {
			let value = formatValue(fields[key]);
			return `${key}=${value}`;
		});

	return formattedFields.join(' ');
};

export { formatError, formatMessage, formatFields, formatValue }
