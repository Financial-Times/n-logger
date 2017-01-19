import AppLogger from './lib/app-logger';

const logger = new AppLogger();

logger.addConsole(process.env.CONSOLE_LOG_LEVEL || 'silly');

// only log to splunk in production
if (process.env.NODE_ENV === 'production' && process.env.SPLUNK_URL) {
	logger.addSplunk(process.env.SPLUNK_URL, process.env.SPLUNK_LOG_LEVEL || 'warn');
}

export default logger;
