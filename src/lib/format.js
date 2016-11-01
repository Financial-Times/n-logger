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

const deQuote = value => (typeof value === 'string') ? value.replace(/"/g, '\'') : value;

const formatMessage = message => deQuote(message);

const formatError = obj => (obj instanceof Error) ? extractErrorDetails(obj) : obj;

const formatFields = fields => {
	const formattedFields = Object.keys(fields)
		.map(key => {
			let value = formatValue(fields[key]);
			return `${key}=${value}`;
		});

	return formattedFields.join(' ');
};

const formatValue = value => {
	if (Array.isArray(value)) {
		return `"${value.join(',')}"`;
	} else {
		// wrap in quotes, if it contains a space
		return (/\s/.test(value)) ? `"${deQuote(value)}"` : deQuote(value);
	}
};

export { formatError, formatMessage, formatFields, formatValue }
