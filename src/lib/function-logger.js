import Logger from './logger';

class FunctionLogger extends Logger {

	constructor (deps = {}) {
		super(deps);
	}

	doLog (level, message, meta) {
		if (typeof message !== 'string') {
			meta = Object.assign(message, meta);
			message = null;
		}
		const formattedMessage = this.deps.formatter({ level, message, meta, splunkFriendly: true });
		/* eslint no-console: 0 */
		console.log(formattedMessage);
	}

}

export default FunctionLogger;
