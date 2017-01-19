import FunctionLogger from './lib/function-logger';
import AppLogger from './lib/app-logger';

const getLogger = () => {
	if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
		// browser or Lambda environment - don't use Winston
		return new FunctionLogger();
	} else {
		const logger = new AppLogger();

		logger.addConsole(process.env.CONSOLE_LOG_LEVEL || 'silly');

		// only log to splunk in production
		if (process.env.NODE_ENV === 'production' && process.env.SPLUNK_URL) {
			logger.addSplunk(process.env.SPLUNK_URL, process.env.SPLUNK_LOG_LEVEL || 'warn');
		}
		return logger;
	}
};

const logger = getLogger();
export default logger;
