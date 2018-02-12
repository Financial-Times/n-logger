const formatHEC = ({ level, message, meta = {} } = {}) => {
	return message ? Object.assign({}, { level, message }, meta) : Object.assign({}, { level }, meta);
};

export default formatHEC;
