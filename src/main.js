require('isomorphic-fetch');

import FunctionLogger from './lib/function-logger';
import AppLogger from './lib/app-logger';

const getLogger = () => {
	if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
		// Lambda environment - don't use Winston
		return new FunctionLogger();
	} else {
		// app environment - use Winston
		const logger = new AppLogger({
			level: process.env.CONSOLE_LOG_LEVEL || 'silly'
		});

		if (process.env.SPLUNK_HEC_TOKEN && process.env.SPLUNK_HEC_TOKEN.length > 0) {
			logger.addSplunkHEC(process.env.SPLUNK_LOG_LEVEL || 'warn');
		}

		return logger;
	}
};

const logger = getLogger();
export default logger;
