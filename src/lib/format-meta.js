'use strict';

module.exports = meta => {
	const formattedMeta = Object.keys(meta).map(metaName => {
		const metaValue = meta[metaName];
		let value = typeof metaValue === 'string' ? metaValue.replace(/"/g, '\'') : metaValue;
		// wrap in quotes, if it contains a space
		if (/\s/.test(value)) {
			value = `"${value}"`;
		}
		return `${metaName}=${value}`;
	});

	return formattedMeta.join(' ');
};
