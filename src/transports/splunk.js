const { fork } = require('child_process');
const path = require('path');
const winston = require('winston');

const formatter = require('../formatter');

module.exports = class extends winston.Transport {
	constructor (opts) {
		super(opts);
		this.name = 'splunk';
		if (opts && opts.agent) {
			this.agent = opts.agent;
			this.agent.url = opts.splunkUrl;
		} else {
			this.agent = fork(path.resolve(__dirname, '..', 'agent.js'), [opts.splunkUrl]);
		}
	}

	log (level, message, meta, callback) {
		const formattedMessage = formatter({ level, message, meta, splunkFriendly: true });
		// HACK: For AWS Lambda
		// Compare the breaking API change somewhere ebetween 0.10 and 4.x.x
		// https://nodejs.org/docs/v0.10.36/api/child_process.html#child_process_child_send_message_sendhandle
		// https://nodejs.org/api/child_process.html#child_process_child_send_message_sendhandle_callback
		if (/^v0\.10/.test(process.version)) {
			this.agent.send(formattedMessage);
			setTimeout(() => callback(undefined, true));
		} else {
			this.agent.send(formattedMessage, (err) => callback(err, true));
		}
	}
};
