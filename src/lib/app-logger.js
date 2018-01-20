import winston from 'winston';

import Logger from './logger';
import Splunk from './transports/splunk';

class AppLogger extends Logger {

	constructor (deps = {}) {
		super(deps);
		Object.assign(this.deps, { winston, Splunk }, deps);
		this.logger = new (this.deps.winston.Logger)({
					transports: [
						new (this.deps.winston.transports.Console)({
							colorize: true,
							level: deps.level
						})
					]
				});
	}

	doLog (...args) {
		this.logger.log.apply(this.logger, args);
	}

	addConsole (level = 'info', opts = {}) {
		if (this.logger.transports.console) {
			return;
		}
		this.logger.add(
			this.deps.winston.transports.Console,
			Object.assign({ level, formatter: this.deps.formatter, colorize: true }, opts)
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
			this.warn('No `splunkUrl` supplied');
			return false;
		}
		this.logger.add(
			this.deps.Splunk,
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

export default AppLogger;
