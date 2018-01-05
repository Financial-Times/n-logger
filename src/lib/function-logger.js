import Logger from './logger';
import levels from './levels'

class FunctionLogger extends Logger {

	constructor (deps = {}) {
		super(deps);
	}

	doLog (level, message, meta) {
		if (levels.indexOf(level) >= levels.indexOf(this.deps.level)) {
			if (typeof message !== 'string') {
				meta = Object.assign(message, meta);
				message = null;
			}
			const formattedMessage = this.deps.formatter({ level, message, meta, splunkFriendly: true });
			/* eslint no-console: 0 */
			console.log(formattedMessage);
		}
	}

}

export default FunctionLogger;
