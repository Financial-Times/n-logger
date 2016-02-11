import formatMessage from './format-message';

export default meta => {
	const formattedMeta = Object.keys(meta)
		.map(metaName => {
			let value = formatMessage(meta[metaName]);
			// wrap in quotes, if it contains a space
			if (/\s/.test(value)) {
				value = `"${value}"`;
			}
			return `${metaName}=${value}`;
		});

	return formattedMeta.join(' ');
};
