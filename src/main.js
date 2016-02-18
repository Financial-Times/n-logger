import winston from 'winston';
import Splunk from './lib/transports/splunk';
import formatter from './lib/formatter';
import formatMessage from './lib/format-message';

class Logger {

	constructor () {
		this.logger = new (winston.Logger)();
		// create logging methods
		Object.keys(this.logger.levels).forEach(level =>
			this[level] = (...args) => this.log(level, ...args)
		);
	}

	log (level, message, ...args) {
		const formattedMessage = formatMessage(message);
		this.logger.log(level, formattedMessage, ...args);
	}

	addConsole (level = 'info', opts = {}) {
		if (this.logger.transports.console) {
			return;
		}
		this.logger.add(
			winston.transports.Console,
			Object.assign({ level, formatter }, opts)
		);
	}

	removeConsole () {
		if (!this.logger.transports.console) {
			return;
		}
		this.logger.remove('console');
	}

	addSplunk (splunkUrl, level = 'info', opts = {}) {
		if (this.logger.transports.splunk) {
			return;
		}
		if (!splunkUrl) {
			this.logger.warn('No `splunkUrl` supplied');
			return false;
		}
		this.logger.add(
			Splunk,
			Object.assign({ level, splunkUrl }, opts)
		);
	}

	removeSplunk () {
		if (!this.logger.transports.splunk) {
			return;
		}
		this.logger.remove('splunk');
	}

	clearLoggers () {
		Object.keys(this.logger.transports)
			.forEach(logger => this.logger.remove(logger));
	}

}

const logger = new Logger();

logger.addConsole(process.env.CONSOLE_LOG_LEVEL || 'silly');

// only log to splunk in production
if (process.env.NODE_ENV === 'production' && process.env.SPLUNK_URL) {
	logger.addSplunk(process.env.SPLUNK_URL, process.env.SPLUNK_LOG_LEVEL || 'warn');
}

export default logger;
