import winston from 'winston';

import Logger from './logger';
import SplunkHEC from './transports/splunkHEC';

class AppLogger extends Logger {

	constructor (deps = {}) {
		super(deps);
		Object.assign(this.deps, { winston, SplunkHEC }, deps);
		this.logger = new (this.deps.winston.Logger)({
			transports: [
				new (this.deps.winston.transports.Console)({
					colorize: this.deps.colorize,
					level: this.deps.level,
					json: this.deps.json,
					stringify: true // This ensures that any JSON logs are single-line
				})
			]
		});
	}

	doLog (...args) {
		this.logger.log.apply(this.logger, args);
	}

	addConsole (level = 'info', colorize = true, opts = {}) {
		if (this.logger.transports.console) {
			return;
		}
		this.logger.add(
			this.deps.winston.transports.Console,
			Object.assign({ level, formatter: this.deps.formatter, colorize}, opts)
		);
	}

	removeConsole () {
		if (!this.logger.transports.console) {
			return;
		}
		this.logger.remove('console');
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
		this.logger.remove('splunkHEC');
	}

	clearLoggers () {
		Object.keys(this.logger.transports)
			.forEach(logger => this.logger.remove(logger));
	}

}

export default AppLogger;
