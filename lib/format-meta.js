'use strict';

module.exports = meta => {
	const formattedMeta = Object.keys(meta).map(metaName => {
		const value = meta[metaName].replace(/"/g, '\'');
		return `${metaName}="${value}"`;
	});

	return formattedMeta.join(' ');
};
