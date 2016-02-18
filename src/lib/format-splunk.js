/**
 * Formats data for splunk land
 */
const formatObject = obj => {
	const formattedObj = Object.keys(obj)
		.map(key => {
			let value = formatValue(obj[key]);
			return `${key}=${value}`;
		});

	return formattedObj.join(' ');
};

// wrap in quotes, if it contains a space
const formatValue = value => (/\s/.test(value)) ?
	`"${value.replace(/"/g, '\'')}"` :
	value;

export { formatObject, formatValue }
