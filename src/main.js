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

		if (process.env.NODE_ENV === 'production' && process.env.SPLUNK_HEC_TOKEN) {
			logger.addSplunkHEC(process.env.SPLUNK_LOG_LEVEL || 'warn');
		}

		// log to splunk only in production
		if (process.env.NODE_ENV === 'production' && process.env.SPLUNK_URL) {
			logger.addSplunk(process.env.SPLUNK_URL, process.env.SPLUNK_LOG_LEVEL || 'warn');
		}
		return logger;
	}
};

const logger = getLogger();
export default logger;
