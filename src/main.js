import FunctionLogger from './lib/function-logger';
import AppLogger from './lib/app-logger';

const getLogger = () => {
	if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
		// Lambda environment - don't use Winston
		return new FunctionLogger();
	} else {
		// app environment - use Winston

		// Determine whether the app is using Heroku log drains or Splunk HEC
		const useHerokuLogDrains = Boolean(process.env.MIGRATE_TO_HEROKU_LOG_DRAINS);
		const splunkToken = process.env.SPLUNK_HEC_TOKEN;

		// Determine the log level
		const splunkLogLevel = process.env.SPLUNK_LOG_LEVEL || 'warn';
		const consoleLogLevel = process.env.CONSOLE_LOG_LEVEL || 'silly';

		const logger = new AppLogger({
			level: (useHerokuLogDrains ? splunkLogLevel : consoleLogLevel),
			colorize: process.env.CONSOLE_LOG_UNCOLORIZED !== 'true',

			// If we're migrating to Heroku log drains then we want
			// all logs as JSON instead of key/value pairs
			json: useHerokuLogDrains
		});

		// If we have a Splunk token and we're not using log drains,
		// then add a Splunk HEC transport to the logger
		if (splunkToken && !useHerokuLogDrains) {
			logger.addSplunkHEC(splunkLogLevel);
		}

		return logger;
	}
};

const logger = getLogger();
export default logger;
