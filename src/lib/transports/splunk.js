import { fork } from 'child_process';
import path from 'path';
import winston from 'winston';
import formatMessage from '../format-message';
import formatMeta from '../format-meta';

class Splunk extends winston.Transport {

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

	log (level, msg, meta, callback) {
		const formattedMsg = formatMessage(msg);
		const formattedMeta = formatMeta(Object.assign({ level }, meta));

		// HACK: For AWS Lambda
		// Compare the breaking API change somewhere ebetween 0.10 and 4.x.x
		// https://nodejs.org/docs/v0.10.36/api/child_process.html#child_process_child_send_message_sendhandle
		// https://nodejs.org/api/child_process.html#child_process_child_send_message_sendhandle_callback
		if (/^v0\.10/.test(process.version)) {
			this.agent.send(`${formattedMsg} ${formattedMeta}`);
			setTimeout(() => callback(undefined, true));
		} else {
			this.agent.send(`${formattedMsg} ${formattedMeta}`, (err) => callback(err, true));
		}
	}

}

export default Splunk;
