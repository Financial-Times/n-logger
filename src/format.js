const sanitise = value => (typeof value === 'string') ? value.replace(/"/g, '\'').replace(/\n/g, '	') : value;

const splunkifyValue = value => {
	if (Array.isArray(value)) {
		return `"${value.map(sanitise).join(',')}"`;
	} else {
		const sanitisedValue = sanitise(value);
		// wrap in quotes, if it contains a space
		return (/[\s=]/.test(sanitisedValue)) ? `"${sanitisedValue}"` : sanitisedValue;
	}
};

const formatMessage = message => sanitise(message);

const formatFields = (fields = {}, { splunkFriendly = false } = {}) => {
	const formattedFields = Object.keys(fields)
		.map(fieldName => {
			const fieldValue = splunkFriendly ? splunkifyValue(fields[fieldName]) : fields[fieldName];
			return `${fieldName}=${fieldValue}`;
		});

	return formattedFields.join(' ');
};

module.exports = {
	message: formatMessage,
	fields: formatFields
};
