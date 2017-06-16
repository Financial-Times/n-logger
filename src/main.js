const loggers = require('./loggers');

const getLogger = () => {
	if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
		// Lambda environment - don't use Winston
		return new loggers.Function();
	} else {
		// app environment - use Winston
		const logger = new loggers.App();

		logger.addConsole(process.env.CONSOLE_LOG_LEVEL || 'silly');

		// only log to splunk in production
		if (process.env.NODE_ENV === 'production' && process.env.SPLUNK_URL) {
			logger.addSplunk(process.env.SPLUNK_URL, process.env.SPLUNK_LOG_LEVEL || 'warn');
		}
		return logger;
	}
};

module.exports = getLogger();
