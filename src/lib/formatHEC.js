const formatHEC = ({ level, message = '', meta = {} }) => {
	if (typeof meta === 'object') {
		return Object.assign({}, { level, message }, meta);
	} else {
		return {};
	}
};

export default formatHEC;
