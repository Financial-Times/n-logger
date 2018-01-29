import winston from 'winston';

import Logger from './logger';
import Splunk from './transports/splunk';
import SplunkHEC from './transports/splunkHEC';

class AppLogger extends Logger {

	constructor (deps = {}) {
		super(deps);
		Object.assign(this.deps, { winston, Splunk, SplunkHEC }, deps);
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

	addSplunkHEC (level = 'info', opts = {}) {
		if (this.logger.transports.splunkHEC) {
			return;
		}
		this.logger.add(
			this.deps.SplunkHEC,
			Object.assign({ level }, opts)
		);
	}

	removeSplunkHEC () {
		if (!this.logger.transports.splunkHEC) {
			return;
		}
		this.logger.remove('SplunkHEC');
	}

	clearLoggers () {
		Object.keys(this.logger.transports)
			.forEach(logger => this.logger.remove(logger));
	}

}

export default AppLogger;
